import {
  getCategoryExpenses,
  getMonthlyExpenseAggregate,
} from "@/modules/dashboard/employee/lib/getCategoryExpenses.server";
import { syncGmailIfStale } from "@/modules/gmail/lib/sync-gmail-if-stale.server";
import { mapTransactionToRecent } from "@/modules/dashboard/employee/lib/mapTransactionToRecent";
import type { HomeDashboardData } from "@/modules/dashboard/employee/types/dashboard.types";
import {
  EMPTY_GMAIL_STATUS,
  getGmailStatus,
} from "@/modules/gmail/lib/get-gmail-status.server";
import { backfillExpenseCategoriesIfNeeded } from "@/modules/gmail/lib/backfill-expense-categories.server";
import { createClient } from "@/src/lib/server";
import {
  buildPaymentCandidates,
} from "./buildPaymentCandidates";
import {
  buildMonthlyObligationCategoryExpenses,
  mergeCategoryExpenses,
  sumMonthlyObligationsForMonth,
} from "./monthly-obligation-expenses";
import { daysBetween } from "@/modules/onboarding/lib/schemas/date-helpers";
import { getUsdToDopRate } from "@/modules/gmail/lib/exchange-rate.server";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";
import { buildFiscalAnalysisContext } from "./buildFiscalAnalysisContext.server";
import { ensureFiscalAnalysisStored } from "@/modules/dashboard/employee/lib/fiscal-insight.server";
import { getActiveTaxParameters } from "@/modules/onboarding/supabase/tax-parameters";
import { getExpenseCategoryColorMap } from "@/modules/shared/supabase/get-expense-category-colors.server";
import {
  buildExpensesSubtext,
  buildMarginMeta,
} from "@/modules/dashboard/employee/lib/getMonthlyFinancialSummary.server";

export const RECENT_TRANSACTIONS_LIMIT = 15;

const EMPTY_DASHBOARD_DATA: HomeDashboardData = {
  netIncome: {
    value: 0,
    subtext: "Sin datos de salario",
    hasSalary: false,
  },
  monthlyExpenses: {
    value: 0,
    subtext: "Sin gastos este mes",
    trend: "neutral",
    transactionCount: 0,
  },
  monthlyMargin: {
    value: 0,
    subtext: "Después de gastos y pagos del mes",
    trend: "neutral",
  },
  nextPayment: {
    value: "Sin pagos",
    subtext: "Registra tus obligaciones en onboarding",
    trend: "neutral",
    hasPayment: false,
  },
  recentTransactions: [],
  expenseCategoriesThisMonth: [],
  expenseCategoriesLastMonth: [],
  gmailStatus: EMPTY_GMAIL_STATUS,
  fiscalAnalysis: {
    diagnosis:
      "Inicia sesión y completa tu perfil para recibir un diagnóstico financiero personalizado.",
    tips: [
      {
        id: "iniciar-sesion",
        title: "Configura tu perfil",
        description:
          "Agrega salario, obligaciones y conecta Gmail para que la IA analice tu situación real.",
        iconKey: "wallet",
      },
    ],
    source: "fallback",
  },
};

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return EMPTY_DASHBOARD_DATA;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("monthly_salary, monthly_tss_deduction, gmail_connected")
      .eq("id", user.id)
      .maybeSingle();

    await syncGmailIfStale(user.id, profile?.gmail_connected);

    try {
      await backfillExpenseCategoriesIfNeeded(user.id);
    } catch (error) {
      console.error("[getHomeDashboardData] backfillExpenseCategories failed:", error);
    }

    const categoryColorMap = await getExpenseCategoryColorMap(user.id);

    const [
      transactionsResult,
      thisMonthCategories,
      lastMonthCategories,
      thisMonthAggregate,
      lastMonthAggregate,
      fixedObligationsResult,
      loansResult,
      creditCardsResult,
      installmentsResult,
      taxParams,
    ] = await Promise.all([
      supabase
        .from("transactions")
        .select(
          "id, merchant_name, amount, transaction_date, transaction_type, bank_name, original_amount, original_currency, rate_source, expense_category"
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .limit(RECENT_TRANSACTIONS_LIMIT),
      getCategoryExpenses(supabase, user.id, "this-month", categoryColorMap),
      getCategoryExpenses(supabase, user.id, "last-month", categoryColorMap),
      getMonthlyExpenseAggregate(supabase, user.id, "this-month"),
      getMonthlyExpenseAggregate(supabase, user.id, "last-month"),
      supabase
        .from("fixed_obligations")
        .select(
          "name, obligation_type, provider_name, monthly_amount, payment_due_day, status"
        )
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("loans")
        .select(
          "id, lender_name, loan_alias, loan_type, monthly_payment, payment_due_day, end_date, start_date, status, original_amount, current_balance, term_months, annual_rate"
        )
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("credit_cards")
        .select(
          "id, issuer_name, card_label, currency_mode, minimum_payment, minimum_payment_usd, next_statement_close_date, next_payment_due_date, status, current_balance, current_balance_usd, statement_balance, statement_balance_usd, credit_limit, credit_limit_usd, annual_rate, tracking_enabled, last_four, last_statement_upload_at"
        )
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("credit_card_installments")
        .select(
          "id, description, monthly_payment, remaining_balance, original_amount, term_months, annual_rate, start_date, end_date, status, credit_card_id, credit_cards(issuer_name, card_label, next_payment_due_date)"
        )
        .eq("user_id", user.id)
        .eq("status", "active"),
      getActiveTaxParameters(),
    ]);
    const salary = profile?.monthly_salary ?? 0;
    const tssDeduction = profile?.monthly_tss_deduction ?? 0;
    const hasSalary = salary > 0;
    const netIncomeValue = hasSalary ? salary - tssDeduction : 0;

    const resolvedGmailStatus = await getGmailStatus(
      user.id,
      profile?.gmail_connected ?? null
    );

    const obligationsSnapshot: FinancialObligationsSnapshot = {
      fixedObligations: fixedObligationsResult.data ?? [],
      loans: loansResult.data ?? [],
      creditCards: creditCardsResult.data ?? [],
      creditCardInstallments: (installmentsResult.data ?? []).map((row) => ({
        ...row,
        credit_cards: Array.isArray(row.credit_cards)
          ? row.credit_cards[0] ?? null
          : row.credit_cards,
      })),
    };

    let usdToDopRate = 1;
    try {
      const fx = await getUsdToDopRate();
      usdToDopRate = fx.rate;
    } catch {
      // FX unavailable — USD card amounts fall back to 1:1
    }

    const today = new Date();
    const lastMonthReference = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      15
    );

    const thisMonthObligationsTotal = sumMonthlyObligationsForMonth(
      obligationsSnapshot,
      today,
      usdToDopRate
    );
    const lastMonthObligationsTotal = sumMonthlyObligationsForMonth(
      obligationsSnapshot,
      lastMonthReference,
      usdToDopRate
    );
    const thisMonthTotal = thisMonthAggregate.total + thisMonthObligationsTotal;
    const lastMonthTotal = lastMonthAggregate.total + lastMonthObligationsTotal;
    const marginValue = netIncomeValue - thisMonthTotal;

    const paymentCandidates = buildPaymentCandidates(
      obligationsSnapshot,
      today,
      usdToDopRate
    );
    const nextCandidate = paymentCandidates[0];

    let nextPayment: HomeDashboardData["nextPayment"] = {
      value: "Sin pagos",
      subtext: "Registra tus obligaciones en onboarding",
      trend: "neutral",
      hasPayment: false,
    };

    if (nextCandidate) {
      const daysUntil = daysBetween(today, nextCandidate.dueDate);
      const daysText =
        daysUntil === 0
          ? "Hoy"
          : `Faltan ${daysUntil} día${daysUntil === 1 ? "" : "s"}`;
      nextPayment = {
        value: `Día ${nextCandidate.dueDate.getDate()}`,
        subtext: `${daysText} · ${nextCandidate.shortLabel}`,
        trend: "neutral",
        hasPayment: true,
      };
    }

    const expensesMeta = buildExpensesSubtext(
      thisMonthTotal,
      lastMonthTotal,
      thisMonthAggregate.transactionCount
    );
    const marginMeta = buildMarginMeta(marginValue, netIncomeValue);
    const thisMonthObligationCategories = buildMonthlyObligationCategoryExpenses(
      obligationsSnapshot,
      categoryColorMap,
      today,
      usdToDopRate
    );
    const lastMonthObligationCategories = buildMonthlyObligationCategoryExpenses(
      obligationsSnapshot,
      categoryColorMap,
      lastMonthReference,
      usdToDopRate
    );
    const mergedThisMonthCategories = mergeCategoryExpenses(
      categoryColorMap,
      thisMonthCategories,
      thisMonthObligationCategories
    );
    const mergedLastMonthCategories = mergeCategoryExpenses(
      categoryColorMap,
      lastMonthCategories,
      lastMonthObligationCategories
    );

    const fiscalAnalysisContext = buildFiscalAnalysisContext({
      salary,
      tssDeduction,
      netIncomeMonthly: netIncomeValue,
      expensesThisMonth: thisMonthTotal,
      expensesLastMonth: lastMonthTotal,
      marginMonthly: marginValue,
      marginStatus: marginMeta.subtext,
      transactionCount: thisMonthAggregate.transactionCount,
      categories: mergedThisMonthCategories,
      obligationsSnapshot,
      nextCandidate,
      today,
      usdToDopRate,
      gmailConnected: resolvedGmailStatus.connected,
      taxParams,
    });

    const fiscalAnalysis = await ensureFiscalAnalysisStored(
      user.id,
      fiscalAnalysisContext,
      { triggerEvent: "dashboard_load" }
    );

    const baseNetIncome = {
      value: netIncomeValue,
      subtext: hasSalary
        ? "Salario mensual − deducciones TSS"
        : "Configura tu salario en el perfil",
      hasSalary,
    };

    if (transactionsResult.error) {
      return {
        netIncome: baseNetIncome,
        monthlyExpenses: {
          value: thisMonthTotal,
          subtext: expensesMeta.subtext,
          trend: expensesMeta.trend,
          transactionCount: thisMonthAggregate.transactionCount,
        },
        monthlyMargin: {
          value: marginValue,
          subtext: marginMeta.subtext,
          trend: marginMeta.trend,
        },
        nextPayment,
        fiscalAnalysis,
        recentTransactions: [],
        expenseCategoriesThisMonth: mergedThisMonthCategories,
        expenseCategoriesLastMonth: mergedLastMonthCategories,
        gmailStatus: resolvedGmailStatus,
      };
    }

    return {
      netIncome: baseNetIncome,
      monthlyExpenses: {
        value: thisMonthTotal,
        subtext: expensesMeta.subtext,
        trend: expensesMeta.trend,
        transactionCount: thisMonthAggregate.transactionCount,
      },
      monthlyMargin: {
        value: marginValue,
        subtext: marginMeta.subtext,
        trend: marginMeta.trend,
      },
      nextPayment,
      fiscalAnalysis,
      recentTransactions: (transactionsResult.data ?? []).map((row) =>
        mapTransactionToRecent(row, { categoryColorMap })
      ),
      expenseCategoriesThisMonth: mergedThisMonthCategories,
      expenseCategoriesLastMonth: mergedLastMonthCategories,
      gmailStatus: resolvedGmailStatus,
    };
  } catch (error) {
    console.error("[getHomeDashboardData] failed:", error);
    return EMPTY_DASHBOARD_DATA;
  }
}
