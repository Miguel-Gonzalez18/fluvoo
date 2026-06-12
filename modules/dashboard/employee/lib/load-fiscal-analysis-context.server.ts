import { buildFiscalAnalysisContext } from "@/modules/dashboard/employee/lib/buildFiscalAnalysisContext.server";
import {
  getCategoryExpenses,
  getMonthlyExpenseAggregate,
} from "@/modules/dashboard/employee/lib/getCategoryExpenses.server";
import { buildPaymentCandidates } from "@/modules/dashboard/employee/lib/buildPaymentCandidates";
import {
  buildMonthlyObligationCategoryExpenses,
  mergeCategoryExpenses,
  sumMonthlyObligationsForMonth,
} from "@/modules/dashboard/employee/lib/monthly-obligation-expenses";
import type { FinancialObligationsSnapshot } from "@/modules/dashboard/employee/lib/financial-obligations.types";
import { getUsdToDopRate } from "@/modules/gmail/lib/exchange-rate.server";
import { getActiveTaxParameters } from "@/modules/onboarding/supabase/tax-parameters";
import type { FiscalAnalysisContext } from "@/modules/shared/ai/fiscal-analysis.schema";
import { createAdminClient } from "@/src/lib/admin";
import { getExpenseCategoryColorMap } from "@/modules/shared/supabase/get-expense-category-colors.server";

function buildMarginStatus(
  marginValue: number,
  netIncomeValue: number
): string {
  if (netIncomeValue <= 0) return "Configura tu ingreso mensual";
  if (marginValue <= 0) return "Alerta: gastos iguales o mayores al ingreso";

  const ratio = marginValue / netIncomeValue;
  if (ratio < 0.1) return "Alerta: margen muy corto";
  if (ratio < 0.25) return "Margen moderado, vigila tus pagos";
  return "Margen amplio después de gastos";
}

export async function loadFiscalAnalysisContextForUser(
  userId: string
): Promise<FiscalAnalysisContext | null> {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("monthly_salary, monthly_tss_deduction, gmail_connected")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;

  const categoryColorMap = await getExpenseCategoryColorMap(userId);

  const [
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
    getCategoryExpenses(admin, userId, "this-month", categoryColorMap),
    getCategoryExpenses(admin, userId, "last-month", categoryColorMap),
    getMonthlyExpenseAggregate(admin, userId, "this-month"),
    getMonthlyExpenseAggregate(admin, userId, "last-month"),
    admin
      .from("fixed_obligations")
      .select(
        "name, obligation_type, provider_name, monthly_amount, payment_due_day, status"
      )
      .eq("user_id", userId)
      .eq("status", "active"),
    admin
      .from("loans")
      .select(
        "id, lender_name, loan_type, monthly_payment, payment_due_day, end_date, start_date, status, original_amount, current_balance, term_months, annual_rate"
      )
      .eq("user_id", userId)
      .eq("status", "active"),
    admin
      .from("credit_cards")
      .select(
        "id, issuer_name, card_label, currency_mode, minimum_payment, minimum_payment_usd, payment_due_day, status, current_balance, current_balance_usd, statement_balance, statement_balance_usd, credit_limit, credit_limit_usd, statement_close_day, annual_rate"
      )
      .eq("user_id", userId)
      .eq("status", "active"),
    admin
      .from("credit_card_installments")
      .select(
        "id, description, monthly_payment, remaining_balance, original_amount, term_months, payment_due_day, statement_close_day, end_date, status, credit_card_id, credit_cards(issuer_name, card_label, payment_due_day, statement_close_day)"
      )
      .eq("user_id", userId)
      .eq("status", "active"),
    getActiveTaxParameters(),
  ]);

  const salary = profile.monthly_salary ?? 0;
  const tssDeduction = profile.monthly_tss_deduction ?? 0;
  const netIncomeValue = salary > 0 ? salary - tssDeduction : 0;

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
    // FX unavailable
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

  const expensesThisMonth = thisMonthAggregate.total + thisMonthObligationsTotal;
  const expensesLastMonth = lastMonthAggregate.total + lastMonthObligationsTotal;
  const marginMonthly = netIncomeValue - expensesThisMonth;

  const mergedThisMonthCategories = mergeCategoryExpenses(
    categoryColorMap,
    thisMonthCategories,
    buildMonthlyObligationCategoryExpenses(
      obligationsSnapshot,
      categoryColorMap,
      today,
      usdToDopRate
    )
  );

  const paymentCandidates = buildPaymentCandidates(
    obligationsSnapshot,
    today,
    usdToDopRate
  );

  return buildFiscalAnalysisContext({
    salary,
    tssDeduction,
    netIncomeMonthly: netIncomeValue,
    expensesThisMonth,
    expensesLastMonth,
    marginMonthly,
    marginStatus: buildMarginStatus(marginMonthly, netIncomeValue),
    transactionCount: thisMonthAggregate.transactionCount,
    categories: mergedThisMonthCategories,
    obligationsSnapshot,
    nextCandidate: paymentCandidates[0],
    today,
    usdToDopRate,
    gmailConnected: profile.gmail_connected ?? false,
    taxParams,
  });
}
