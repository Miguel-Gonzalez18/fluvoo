import type {
  CategoryExpense,
  GmailStatus,
  KpiTrend,
  RecentTransaction,
} from "@/modules/dashboard/employee/types/dashboard.types";
import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";

export type ChartPeriod = "7d" | "15d" | "30d" | "90d";

export type TransactionSort =
  | "recent"
  | "oldest"
  | "amount-high"
  | "amount-low";

export interface TransactionDateParts {
  dayMonth: string;
  time: string;
}

export interface TransactionListItem extends RecentTransaction {
  description: string | null;
  accountLabel: string;
  categorySlug: ExpenseCategorySlug | null;
  transactionDate: string;
  dateParts: TransactionDateParts;
}

export interface TransactionsSummaryKpi {
  label: string;
  value: number;
  subtext: string;
  trend: KpiTrend;
}

export interface ExpenseMarginBucket {
  label: string;
  expenses: number;
  marginPct: number;
}

export interface ChartPeriodData {
  categories: CategoryExpense[];
  marginBuckets: ExpenseMarginBucket[];
  periodLabel: string;
}

export interface TransactionsTableData {
  items: TransactionListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TransactionsPageData {
  summary: {
    income: TransactionsSummaryKpi;
    expenses: TransactionsSummaryKpi;
    margin: TransactionsSummaryKpi;
  };
  chartData: Record<ChartPeriod, ChartPeriodData>;
  table: TransactionsTableData;
  gmailStatus: GmailStatus;
}

export interface TransactionsSearchParams {
  page?: string;
  q?: string;
  sort?: string;
  minAmount?: string;
  maxAmount?: string;
}

export const TRANSACTIONS_PAGE_SIZE = 15;
export const TRANSACTIONS_LOOKBACK_DAYS = 90;

export const CHART_PERIOD_LABELS: Record<ChartPeriod, string> = {
  "7d": "Última semana",
  "15d": "Últimos 15 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
};

export const CHART_PERIODS: ChartPeriod[] = ["7d", "15d", "30d", "90d"];
