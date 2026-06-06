import { TrendingUp } from "lucide-react";
import { DashboardFab } from "@/modules/dashboard/employee/components/home/DashboardFab";
import { ExpenseCategoryChart } from "@/modules/dashboard/employee/components/home/ExpenseCategoryChart";
import { FiscalAnalysisCard } from "@/modules/dashboard/employee/components/home/FiscalAnalysisCard";
import { GmailStatusBanner } from "@/modules/dashboard/employee/components/home/GmailStatusBanner";
import { KpiStatCard } from "@/modules/dashboard/employee/components/home/KpiStatCard";
import { RecentTransactionsTable } from "@/modules/dashboard/employee/components/home/RecentTransactionsTable";
import { KPI_STATS } from "@/modules/dashboard/employee/config/dashboardMock";
import { getHomeDashboardData } from "@/modules/dashboard/employee/lib/getHomeDashboardData.server";
import type { KpiStat } from "@/modules/dashboard/employee/types/dashboard.types";

export async function EmployeeHomePage() {
  const data = await getHomeDashboardData();

  const netIncomeKpi: KpiStat = {
    id: "net-income",
    label: "Ingreso Neto",
    value: String(data.netIncome.value),
    subtext: data.netIncome.subtext,
    trend: data.netIncome.hasSalary ? "positive" : "neutral",
    icon: TrendingUp,
  };

  const otherKpis = KPI_STATS.filter((stat) => stat.id !== "net-income");
  const kpiStats = [netIncomeKpi, ...otherKpis];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <GmailStatusBanner status={data.gmailStatus} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiStats.map((stat) => (
          <KpiStatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <FiscalAnalysisCard className="lg:col-span-5" />
        <ExpenseCategoryChart className="lg:col-span-7" />
      </section>

      <RecentTransactionsTable
        transactions={data.recentTransactions}
        gmailConnected={data.gmailStatus.connected}
      />

      <DashboardFab />
    </div>
  );
}
