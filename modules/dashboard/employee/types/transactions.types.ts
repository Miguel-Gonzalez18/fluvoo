import type {
  CategoryExpense,
  GmailStatus,
  KpiTrend,
  RecentTransaction,
} from "@/modules/dashboard/employee/types/dashboard.types";
import type { CategoryColorTokens } from "@/modules/shared/lib/expense-category-colors.types";
import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";
import type {
  CreditCardCurrencyMode,
  LoanType,
  ObligationType,
} from "@/modules/onboarding/types/onboarding";

export type CommitmentUrgency = "ok" | "soon" | "urgent";

export interface CommitmentDueStatus {
  urgency: CommitmentUrgency;
  dueDay: number;
  dueLabel: string;
}

export interface FixedCommitmentItem {
  id: string;
  label: string;
  provider: string | null;
  obligationType: ObligationType;
  amount: number;
  dueStatus: CommitmentDueStatus;
}

export interface LoanCommitmentItem {
  id: string;
  label: string;
  lenderLabel: string;
  lenderName: string | null;
  loanType: LoanType;
  amount: number;
  dueStatus: CommitmentDueStatus;
  originalAmount: number;
  currentBalance: number | null;
  termMonths: number;
  annualRate: number;
  startDate: string | null;
  endDate: string | null;
}

export interface CreditCardCommitmentInstallment {
  id: string;
  description: string;
  monthlyPayment: number;
  amountOwed: number;
  termMonths: number;
}

export interface CreditCardCommitmentItem {
  id: string;
  alias: string;
  issuerName: string;
  issuerLabel: string;
  cardholderName: string;
  totalBalanceDop: number;
  totalBalanceUsd: number;
  statementBalanceDop: number;
  statementBalanceUsd: number;
  totalPaymentDop: number;
  revolvingDop: number;
  installmentsDop: number;
  currencyMode: CreditCardCurrencyMode;
  usdSubtext: string | null;
  dueStatus: CommitmentDueStatus;
  themeKey: string;
  patternIndex: number;
  gradientClass: string;
  patternClass: string;
  installments: CreditCardCommitmentInstallment[];
  creditLimitDop: number;
  creditLimitUsd: number | null;
  statementCloseDay: number | null;
  annualRate: number | null;
}

export interface TransactionsCommitmentsData {
  monthLabel: string;
  totals: { fixed: number; loans: number; cards: number; all: number };
  fixed: FixedCommitmentItem[];
  loans: LoanCommitmentItem[];
  cards: CreditCardCommitmentItem[];
  hasAny: boolean;
}

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
  categoryColor: CategoryColorTokens;
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
  commitments: TransactionsCommitmentsData;
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
