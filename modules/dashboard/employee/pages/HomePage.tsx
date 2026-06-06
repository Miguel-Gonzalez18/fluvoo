import { DashboardFab } from "@/modules/dashboard/employee/components/home/DashboardFab";
import { ExpenseCategoryChart } from "@/modules/dashboard/employee/components/home/ExpenseCategoryChart";
import { FiscalAnalysisCard } from "@/modules/dashboard/employee/components/home/FiscalAnalysisCard";
import { KpiStatCard } from "@/modules/dashboard/employee/components/home/KpiStatCard";
import { RecentTransactionsTable } from "@/modules/dashboard/employee/components/home/RecentTransactionsTable";
import { KPI_STATS } from "@/modules/dashboard/employee/config/dashboardMock";

export function EmployeeHomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KPI_STATS.map((stat) => (
          <KpiStatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <FiscalAnalysisCard className="lg:col-span-5" />
        <ExpenseCategoryChart className="lg:col-span-7" />
      </section>

      <RecentTransactionsTable />

      <DashboardFab />
    </div>
  );
}
