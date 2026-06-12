import {
  getMonthlyExpenseAggregate,
} from "@/modules/dashboard/employee/lib/getCategoryExpenses.server";
import { syncGmailIfStale } from "@/modules/gmail/lib/sync-gmail-if-stale.server";
import { mapTransactionToListItem } from "@/modules/dashboard/employee/lib/mapTransactionToListItem";
import {
  aggregateChartPeriodData,
  sumIncomeTransactions,
  type ExpenseTransactionRow,
} from "@/modules/dashboard/employee/lib/aggregate-chart-data.server";
import { buildMonthlyFinancialSummary } from "@/modules/dashboard/employee/lib/getMonthlyFinancialSummary.server";
import {
  getTransactionsLookbackRange,
} from "@/modules/dashboard/employee/lib/transaction-period-bounds";
import type {
  ChartPeriod,
  TransactionsPageData,
  TransactionsSearchParams,
  TransactionSort,
} from "@/modules/dashboard/employee/types/transactions.types";
import {
  CHART_PERIODS,
  TRANSACTIONS_LOOKBACK_DAYS,
  TRANSACTIONS_PAGE_SIZE,
} from "@/modules/dashboard/employee/types/transactions.types";
import {
  EMPTY_GMAIL_STATUS,
  getGmailStatus,
} from "@/modules/gmail/lib/get-gmail-status.server";
import { backfillExpenseCategoriesIfNeeded } from "@/modules/gmail/lib/backfill-expense-categories.server";
import { getExpenseCategoryColorMap } from "@/modules/shared/supabase/get-expense-category-colors.server";
import { createClient } from "@/src/lib/server";
import {
  sumMonthlyObligationsForMonth,
} from "./monthly-obligation-expenses";
import { getUsdToDopRate } from "@/modules/gmail/lib/exchange-rate.server";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";
import {
  buildTransactionsCommitments,
  EMPTY_COMMITMENTS,
} from "@/modules/dashboard/employee/lib/build-transactions-commitments.server";
import { getEmployeeDisplayName } from "@/modules/dashboard/employee/lib/getEmployeeDisplayName.server";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import { getMonthRange } from "./month-bounds";

const EMPTY_TRANSACTIONS_PAGE: TransactionsPageData = {
  summary: {
    income: {
      label: "Ingresos",
      value: 0,
      subtext: "Inicia sesión para ver tus ingresos",
      trend: "neutral",
    },
    expenses: {
      label: "Gastos",
      value: 0,
      subtext: "Sin gastos este mes",
      trend: "neutral",
    },
    margin: {
      label: "Margen del Mes",
      value: 0,
      subtext: "Después de gastos y pagos del mes",
      trend: "neutral",
    },
  },
  chartData: {
    "7d": { categories: [], marginBuckets: [], periodLabel: "" },
    "15d": { categories: [], marginBuckets: [], periodLabel: "" },
    "30d": { categories: [], marginBuckets: [], periodLabel: "" },
    "90d": { categories: [], marginBuckets: [], periodLabel: "" },
  },
  table: {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: TRANSACTIONS_PAGE_SIZE,
  },
  commitments: EMPTY_COMMITMENTS,
  gmailStatus: EMPTY_GMAIL_STATUS,
};

function parseSort(value: string | undefined): TransactionSort {
  if (
    value === "oldest" ||
    value === "amount-high" ||
    value === "amount-low"
  ) {
    return value;
  }
  return "recent";
}

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseAmount(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function matchesSearch(
  query: string,
  fields: { merchant: string; description: string | null; accountLabel: string; amount: number }
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const amountStr = fields.amount.toString();
  return (
    fields.merchant.toLowerCase().includes(normalized) ||
    (fields.description?.toLowerCase().includes(normalized) ?? false) ||
    fields.accountLabel.toLowerCase().includes(normalized) ||
    amountStr.includes(normalized)
  );
}

function sortTransactions<T extends { amount: number; transactionDate: string }>(
  items: T[],
  sort: TransactionSort
): T[] {
  const copy = [...items];
  switch (sort) {
    case "oldest":
      return copy.sort(
        (a, b) =>
          new Date(a.transactionDate).getTime() -
          new Date(b.transactionDate).getTime()
      );
    case "amount-high":
      return copy.sort((a, b) => b.amount - a.amount);
    case "amount-low":
      return copy.sort((a, b) => a.amount - b.amount);
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      );
  }
}

async function loadObligationsSnapshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<FinancialObligationsSnapshot> {
  const [fixedObligationsResult, loansResult, creditCardsResult, installmentsResult] =
    await Promise.all([
      supabase
        .from("fixed_obligations")
        .select(
          "name, obligation_type, provider_name, monthly_amount, payment_due_day, status"
        )
        .eq("user_id", userId)
        .eq("status", "active"),
      supabase
        .from("loans")
        .select(
          "id, lender_name, loan_type, monthly_payment, payment_due_day, end_date, start_date, status, original_amount, current_balance, term_months, annual_rate"
        )
        .eq("user_id", userId)
        .eq("status", "active"),
      supabase
        .from("credit_cards")
        .select(
          "id, issuer_name, card_label, currency_mode, minimum_payment, minimum_payment_usd, payment_due_day, status, current_balance, current_balance_usd, statement_balance, statement_balance_usd, credit_limit, credit_limit_usd, statement_close_day, annual_rate"
        )
        .eq("user_id", userId)
        .eq("status", "active"),
      supabase
        .from("credit_card_installments")
        .select(
          "id, description, monthly_payment, remaining_balance, original_amount, term_months, payment_due_day, statement_close_day, end_date, status, credit_card_id, credit_cards(issuer_name, card_label, payment_due_day, statement_close_day)"
        )
        .eq("user_id", userId)
        .eq("status", "active"),
    ]);

  return {
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
}

function buildCardLabelsByBank(
  snapshot: FinancialObligationsSnapshot
): Map<string, string> {
  const map = new Map<string, string>();
  for (const card of snapshot.creditCards) {
    const label = card.card_label?.trim() || card.issuer_name?.trim();
    const bank = card.issuer_name?.trim().toLowerCase();
    if (label && bank) {
      map.set(bank, label);
    }
  }
  return map;
}

export async function getTransactionsPageData(
  searchParams: TransactionsSearchParams = {}
): Promise<TransactionsPageData> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return EMPTY_TRANSACTIONS_PAGE;
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
      console.error("[getTransactionsPageData] backfillExpenseCategories failed:", error);
    }

    const categoryColorMap = await getExpenseCategoryColorMap(user.id);

    const lookback = getTransactionsLookbackRange();
    const thisMonthRange = getMonthRange("this-month");
    const lastMonthRange = getMonthRange("last-month");

    const obligationsSnapshot = await loadObligationsSnapshot(supabase, user.id);
    const cardLabelsByBank = buildCardLabelsByBank(obligationsSnapshot);

    let usdToDopRate = 1;
    try {
      const fx = await getUsdToDopRate();
      usdToDopRate = fx.rate;
    } catch {
      // FX unavailable
    }

    const [
      lookbackTransactionsResult,
      thisMonthAggregate,
      lastMonthAggregate,
      thisMonthIncomeResult,
      lastMonthIncomeResult,
    ] = await Promise.all([
      supabase
        .from("transactions")
        .select(
          "id, merchant_name, amount, transaction_date, transaction_type, bank_name, original_amount, original_currency, rate_source, expense_category, description, raw_subject"
        )
        .eq("user_id", user.id)
        .gte("transaction_date", lookback.start)
        .lte("transaction_date", lookback.end)
        .order("transaction_date", { ascending: false }),
      getMonthlyExpenseAggregate(supabase, user.id, "this-month"),
      getMonthlyExpenseAggregate(supabase, user.id, "last-month"),
      supabase
        .from("transactions")
        .select("amount, transaction_type")
        .eq("user_id", user.id)
        .gte("transaction_date", thisMonthRange.start)
        .lte("transaction_date", thisMonthRange.end),
      supabase
        .from("transactions")
        .select("amount, transaction_type")
        .eq("user_id", user.id)
        .gte("transaction_date", lastMonthRange.start)
        .lte("transaction_date", lastMonthRange.end),
    ]);

    const salary = profile?.monthly_salary ?? 0;
    const tssDeduction = profile?.monthly_tss_deduction ?? 0;
    const hasSalary = salary > 0;
    const netIncomeValue = hasSalary ? salary - tssDeduction : 0;

    const today = new Date();
    const lastMonthReference = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      15
    );

    const thisMonthObligations = sumMonthlyObligationsForMonth(
      obligationsSnapshot,
      today,
      usdToDopRate
    );
    const lastMonthObligations = sumMonthlyObligationsForMonth(
      obligationsSnapshot,
      lastMonthReference,
      usdToDopRate
    );

    const thisMonthExpenses = thisMonthAggregate.total + thisMonthObligations;
    const lastMonthExpenses = lastMonthAggregate.total + lastMonthObligations;

    const summary = buildMonthlyFinancialSummary({
      netIncomeValue,
      hasSalary,
      thisMonthExpenses,
      lastMonthExpenses,
      thisMonthTransactionCount: thisMonthAggregate.transactionCount,
      thisMonthIncomeTx: sumIncomeTransactions(thisMonthIncomeResult.data ?? []),
      lastMonthIncomeTx: sumIncomeTransactions(lastMonthIncomeResult.data ?? []),
    });

    if (thisMonthObligations > 0) {
      const variableExpenses = thisMonthAggregate.total;
      summary.expenses.subtext = `${formatDOP(thisMonthExpenses)} total · ${formatDOP(variableExpenses)} variable · ${formatDOP(thisMonthObligations)} compromisos`;
    }

    const displayName = await getEmployeeDisplayName();
    const commitments = buildTransactionsCommitments(
      obligationsSnapshot,
      displayName,
      usdToDopRate,
      today
    );

    const expenseRows = (lookbackTransactionsResult.data ??
      []) as ExpenseTransactionRow[];

    const chartData = CHART_PERIODS.reduce(
      (acc, period) => {
        acc[period] = aggregateChartPeriodData(
          period,
          expenseRows,
          obligationsSnapshot,
          netIncomeValue,
          usdToDopRate,
          categoryColorMap
        );
        return acc;
      },
      {} as Record<ChartPeriod, TransactionsPageData["chartData"][ChartPeriod]>
    );

    const allItems = (lookbackTransactionsResult.data ?? []).map((row) =>
      mapTransactionToListItem(row, { cardLabelsByBank, categoryColorMap })
    );

    const sort = parseSort(searchParams.sort);
    const query = searchParams.q ?? "";
    const minAmount = parseAmount(searchParams.minAmount);
    const maxAmount = parseAmount(searchParams.maxAmount);
    const page = parsePage(searchParams.page);

    const filtered = sortTransactions(
      allItems.filter((item) => {
        if (!matchesSearch(query, item)) return false;
        if (minAmount !== null && item.amount < minAmount) return false;
        if (maxAmount !== null && item.amount > maxAmount) return false;
        return true;
      }),
      sort
    );

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / TRANSACTIONS_PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * TRANSACTIONS_PAGE_SIZE;
    const items = filtered.slice(startIndex, startIndex + TRANSACTIONS_PAGE_SIZE);

    const gmailStatus = await getGmailStatus(
      user.id,
      profile?.gmail_connected ?? null
    );

    return {
      summary,
      chartData,
      commitments,
      table: {
        items,
        totalCount,
        page: safePage,
        pageSize: TRANSACTIONS_PAGE_SIZE,
      },
      gmailStatus,
    };
  } catch (error) {
    console.error("[getTransactionsPageData] failed:", error);
    return EMPTY_TRANSACTIONS_PAGE;
  }
}

export { TRANSACTIONS_LOOKBACK_DAYS };
