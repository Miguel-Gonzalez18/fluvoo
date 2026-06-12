import { isBankMerchantName } from "@/modules/gmail/lib/is-internal-bank-movement";
import {
  getDaysInCurrentMonth,
  getChartPeriodRange,
} from "@/modules/dashboard/employee/lib/transaction-period-bounds";
import {
  buildMonthlyObligationCategoryExpenses,
  mergeCategoryExpenses,
  sumMonthlyObligationsForMonth,
} from "@/modules/dashboard/employee/lib/monthly-obligation-expenses";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import type {
  ChartPeriod,
  ChartPeriodData,
  ExpenseMarginBucket,
} from "@/modules/dashboard/employee/types/transactions.types";
import {
  getCategoryBySlug,
  EXPENSE_TRANSACTION_TYPES,
  INCOME_TRANSACTION_TYPES,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import { formatPeriodSubtitle } from "@/modules/dashboard/employee/lib/transaction-period-bounds";
import type { SupportedBank } from "@/modules/onboarding/config/gmail";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";
import { getZonedYmd, zonedEndOfDay, zonedStartOfDay } from "./month-bounds";

export interface ExpenseTransactionRow {
  expense_category: string | null;
  amount: number;
  merchant_name: string | null;
  bank_name: string | null;
  transaction_date: string;
  transaction_type: string;
}

function shouldSkipExpenseRow(
  bankName: string | null,
  merchantName: string | null
): boolean {
  if (!bankName || !merchantName) return false;
  return isBankMerchantName(bankName as SupportedBank, merchantName);
}

function filterExpenseRows(rows: ExpenseTransactionRow[]): ExpenseTransactionRow[] {
  return rows.filter(
    (row) =>
      EXPENSE_TRANSACTION_TYPES.includes(
        row.transaction_type as (typeof EXPENSE_TRANSACTION_TYPES)[number]
      ) && !shouldSkipExpenseRow(row.bank_name, row.merchant_name)
  );
}

function prorateMonthlyAmount(monthlyAmount: number, periodDays: number): number {
  const daysInMonth = getDaysInCurrentMonth();
  return Math.round(((monthlyAmount * periodDays) / daysInMonth) * 100) / 100;
}

function buildProratedObligationCategories(
  snapshot: FinancialObligationsSnapshot,
  periodDays: number,
  usdToDopRate: number
): CategoryExpense[] {
  const monthlyCategories = buildMonthlyObligationCategoryExpenses(
    snapshot,
    new Date(),
    usdToDopRate
  );

  return monthlyCategories.map((item) => ({
    ...item,
    amount: prorateMonthlyAmount(item.amount, periodDays),
  }));
}

function aggregateTransactionCategories(
  rows: ExpenseTransactionRow[]
): CategoryExpense[] {
  const totals = new Map<ExpenseCategorySlug, number>();

  for (const row of rows) {
    const slug =
      (row.expense_category as ExpenseCategorySlug | null) ?? "otros";
    totals.set(slug, (totals.get(slug) ?? 0) + row.amount);
  }

  return Array.from(totals.entries())
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, amount]) => {
      const definition = getCategoryBySlug(slug);
      return {
        slug,
        category: definition.shortLabel,
        fullLabel: definition.label,
        amount: Math.round(amount * 100) / 100,
        budget: 0,
        colorIndex: definition.colorIndex,
      };
    });
}

interface TimeBucket {
  label: string;
  start: Date;
  end: Date;
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: "America/Santo_Domingo",
    weekday: "short",
    day: "numeric",
  }).format(date);
}

function formatWeekLabel(start: Date, end: Date): string {
  const dayFmt = new Intl.DateTimeFormat("es-DO", {
    timeZone: "America/Santo_Domingo",
    day: "numeric",
    month: "short",
  });
  return `${dayFmt.format(start)}–${dayFmt.format(end)}`;
}

function buildTimeBuckets(period: ChartPeriod, rangeStart: Date, rangeEnd: Date): TimeBucket[] {
  if (period === "7d" || period === "15d") {
    const buckets: TimeBucket[] = [];
    const days = period === "7d" ? 7 : 15;
    for (let i = 0; i < days; i++) {
      const dayStart = new Date(rangeStart.getTime() + i * 86_400_000);
      const ymd = getZonedYmd(dayStart);
      const start = zonedStartOfDay(ymd.year, ymd.month, ymd.day);
      const end = zonedEndOfDay(ymd.year, ymd.month, ymd.day);
      buckets.push({ label: formatDayLabel(start), start, end });
    }
    return buckets;
  }

  const buckets: TimeBucket[] = [];
  let cursor = new Date(rangeStart);

  while (cursor <= rangeEnd) {
    const ymd = getZonedYmd(cursor);
    const start = zonedStartOfDay(ymd.year, ymd.month, ymd.day);
    const weekEnd = new Date(start.getTime() + 6 * 86_400_000);
    const end = weekEnd > rangeEnd ? rangeEnd : weekEnd;
    buckets.push({
      label: formatWeekLabel(start, end),
      start,
      end,
    });
    cursor = new Date(end.getTime() + 86_400_000);
  }

  return buckets;
}

function sumExpensesInBucket(
  rows: ExpenseTransactionRow[],
  bucket: TimeBucket
): number {
  let total = 0;
  for (const row of rows) {
    const date = new Date(row.transaction_date);
    if (date >= bucket.start && date <= bucket.end) {
      total += row.amount;
    }
  }
  return Math.round(total * 100) / 100;
}

function buildMarginBuckets(
  period: ChartPeriod,
  expenseRows: ExpenseTransactionRow[],
  rangeStart: Date,
  rangeEnd: Date,
  netIncomeMonthly: number,
  obligationsSnapshot: FinancialObligationsSnapshot,
  usdToDopRate: number
): ExpenseMarginBucket[] {
  const buckets = buildTimeBuckets(period, rangeStart, rangeEnd);
  const daysInMonth = getDaysInCurrentMonth();
  const dailyIncome = netIncomeMonthly > 0 ? netIncomeMonthly / daysInMonth : 0;
  const monthlyObligations = sumMonthlyObligationsForMonth(
    obligationsSnapshot,
    new Date(),
    usdToDopRate
  );
  const dailyObligations = monthlyObligations / daysInMonth;

  return buckets.map((bucket) => {
    const bucketDays =
      Math.round((bucket.end.getTime() - bucket.start.getTime()) / 86_400_000) + 1;
    const txExpenses = sumExpensesInBucket(expenseRows, bucket);
    const obligationExpenses = Math.round(dailyObligations * bucketDays * 100) / 100;
    const expenses = Math.round((txExpenses + obligationExpenses) * 100) / 100;
    const bucketIncome = Math.round(dailyIncome * bucketDays * 100) / 100;
    const marginPct =
      bucketIncome > 0
        ? Math.round(((bucketIncome - expenses) / bucketIncome) * 100)
        : 0;

    return {
      label: bucket.label,
      expenses,
      marginPct,
    };
  });
}

export function aggregateChartPeriodData(
  period: ChartPeriod,
  allRows: ExpenseTransactionRow[],
  obligationsSnapshot: FinancialObligationsSnapshot,
  netIncomeMonthly: number,
  usdToDopRate: number
): ChartPeriodData {
  const { start, end, days } = getChartPeriodRange(period);
  const rangeStart = new Date(start);
  const rangeEnd = new Date(end);

  const periodRows = filterExpenseRows(
    allRows.filter((row) => {
      const date = new Date(row.transaction_date);
      return date >= rangeStart && date <= rangeEnd;
    })
  );

  const txCategories = aggregateTransactionCategories(periodRows);
  const obligationCategories = buildProratedObligationCategories(
    obligationsSnapshot,
    days,
    usdToDopRate
  );

  return {
    categories: mergeCategoryExpenses(txCategories, obligationCategories),
    marginBuckets: buildMarginBuckets(
      period,
      periodRows,
      rangeStart,
      rangeEnd,
      netIncomeMonthly,
      obligationsSnapshot,
      usdToDopRate
    ),
    periodLabel: formatPeriodSubtitle(period),
  };
}

export function sumIncomeTransactions(
  rows: Pick<ExpenseTransactionRow, "amount" | "transaction_type">[]
): number {
  let total = 0;
  for (const row of rows) {
    if (
      INCOME_TRANSACTION_TYPES.includes(
        row.transaction_type as (typeof INCOME_TRANSACTION_TYPES)[number]
      )
    ) {
      total += row.amount;
    }
  }
  return Math.round(total * 100) / 100;
}
