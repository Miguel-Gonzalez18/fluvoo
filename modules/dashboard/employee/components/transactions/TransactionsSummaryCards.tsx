import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { KpiStatCard } from "@/modules/dashboard/employee/components/home/KpiStatCard";
import type { TransactionsPageData } from "@/modules/dashboard/employee/types/transactions.types";
import type { KpiStat } from "@/modules/dashboard/employee/types/dashboard.types";

interface TransactionsSummaryCardsProps {
  summary: TransactionsPageData["summary"];
}

export function TransactionsSummaryCards({
  summary,
}: TransactionsSummaryCardsProps) {
  const stats: KpiStat[] = [
    {
      id: "income",
      label: summary.income.label,
      value: String(summary.income.value),
      subtext: summary.income.subtext,
      trend: summary.income.trend,
      icon: TrendingUp,
    },
    {
      id: "expenses",
      label: summary.expenses.label,
      value: String(summary.expenses.value),
      subtext: summary.expenses.subtext,
      trend: summary.expenses.trend,
      icon: TrendingDown,
    },
    {
      id: "margin",
      label: summary.margin.label,
      value: String(summary.margin.value),
      subtext: summary.margin.subtext,
      trend: summary.margin.trend,
      icon: Wallet,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <KpiStatCard key={stat.id} stat={stat} />
      ))}
    </section>
  );
}
