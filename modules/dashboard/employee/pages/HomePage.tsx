import {
  Calendar,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { DashboardFab } from "@/modules/dashboard/employee/components/home/DashboardFab";
import { ExpenseCategoryChart } from "@/modules/dashboard/employee/components/home/ExpenseCategoryChart";
import { FiscalAnalysisCard } from "@/modules/dashboard/employee/components/home/FiscalAnalysisCard";
import { KpiStatCard } from "@/modules/dashboard/employee/components/home/KpiStatCard";
import { RecentTransactionsTable } from "@/modules/dashboard/employee/components/home/RecentTransactionsTable";
import { getHomeDashboardData } from "@/modules/dashboard/employee/lib/getHomeDashboardData.server";
import type { KpiStat } from "@/modules/dashboard/employee/types/dashboard.types";

export async function EmployeeHomePage() {
  const data = await getHomeDashboardData();

  const kpiStats: KpiStat[] = [
    {
      id: "net-income",
      label: "Ingreso Neto",
      value: String(data.netIncome.value),
      subtext: data.netIncome.subtext,
      trend: data.netIncome.hasSalary ? "positive" : "neutral",
      icon: TrendingUp,
    },
    {
      id: "monthly-expenses",
      label: "Gastos del Mes",
      value: String(data.monthlyExpenses.value),
      subtext: data.monthlyExpenses.subtext,
      trend: data.monthlyExpenses.trend,
      icon: TrendingDown,
    },
    {
      id: "monthly-margin",
      label: "Margen del Mes",
      value: String(data.monthlyMargin.value),
      subtext: data.monthlyMargin.subtext,
      trend: data.monthlyMargin.trend,
      icon: Wallet,
    },
    {
      id: "next-payment",
      label: "Próximo Pago",
      value: data.nextPayment.value,
      subtext: data.nextPayment.subtext,
      trend: data.nextPayment.trend,
      icon: Calendar,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiStats.map((stat) => (
          <KpiStatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <FiscalAnalysisCard
          className="lg:col-span-5"
          analysis={data.fiscalAnalysis}
        />
        <ExpenseCategoryChart
          className="lg:col-span-7"
          thisMonth={data.expenseCategoriesThisMonth}
          lastMonth={data.expenseCategoriesLastMonth}
        />
      </section>

      <RecentTransactionsTable
        transactions={data.recentTransactions}
        gmailConnected={data.gmailStatus.connected}
      />

      <DashboardFab />
    </div>
  );
}
