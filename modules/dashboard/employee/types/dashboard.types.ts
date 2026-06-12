import type { LucideIcon } from "lucide-react";
import type { CategoryColorTokens } from "@/modules/shared/lib/expense-category-colors.types";
import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";
import type { FiscalTipIconKey } from "@/modules/shared/ai/fiscal-analysis.schema";

export type KpiTrend = "positive" | "negative" | "neutral";

export interface KpiStat {
  id: string;
  label: string;
  value: string;
  subtext: string;
  trend: KpiTrend;
  icon?: LucideIcon;
}

export interface CategoryExpense {
  slug: ExpenseCategorySlug;
  category: string;
  fullLabel: string;
  amount: number;
  budget: number;
  color: CategoryColorTokens;
}

export type TransactionDirection = "income" | "expense";

export interface RecentTransaction {
  id: string;
  merchant: string;
  dateLabel: string;
  category: string;
  categoryVariant: "default" | "success" | "outline";
  categoryColor: CategoryColorTokens;
  amount: number;
  originalAmountSubtext: string | null;
  direction: TransactionDirection;
  icon: LucideIcon;
}

export interface FiscalTip {
  id: string;
  title: string;
  description: string;
  iconKey: FiscalTipIconKey;
}

export type FiscalAnalysisSource = "ai" | "fallback";

export interface FiscalAnalysisData {
  diagnosis: string;
  tips: FiscalTip[];
  source: FiscalAnalysisSource;
}

export type GmailSyncStatus = "pending" | "syncing" | "active" | "error";

export interface GmailStatus {
  connected: boolean;
  googleEmail: string | null;
  syncStatus: GmailSyncStatus | null;
  lastSyncAt: string | null;
  syncError: string | null;
}

export interface NetIncomeData {
  value: number;
  subtext: string;
  hasSalary: boolean;
}

export interface MonthlyExpensesData {
  value: number;
  subtext: string;
  trend: KpiTrend;
  transactionCount: number;
}

export interface MonthlyMarginData {
  value: number;
  subtext: string;
  trend: KpiTrend;
}

export interface NextPaymentData {
  value: string;
  subtext: string;
  trend: KpiTrend;
  hasPayment: boolean;
}

export interface HomeDashboardData {
  netIncome: NetIncomeData;
  monthlyExpenses: MonthlyExpensesData;
  monthlyMargin: MonthlyMarginData;
  nextPayment: NextPaymentData;
  fiscalAnalysis: FiscalAnalysisData;
  recentTransactions: RecentTransaction[];
  expenseCategoriesThisMonth: CategoryExpense[];
  expenseCategoriesLastMonth: CategoryExpense[];
  gmailStatus: GmailStatus;
}
