import type { LucideIcon } from "lucide-react";

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
  category: string;
  amount: number;
  budget: number;
  colorKey: "housing" | "food" | "transport" | "leisure" | "other";
}

export type TransactionDirection = "income" | "expense";

export interface RecentTransaction {
  id: string;
  merchant: string;
  dateLabel: string;
  category: string;
  categoryVariant: "default" | "success" | "outline";
  amount: number;
  direction: TransactionDirection;
  icon: LucideIcon;
}

export interface FiscalTip {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
