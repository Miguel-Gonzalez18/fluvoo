import { Suspense } from "react";
import { TransactionsPagination } from "@/modules/dashboard/employee/components/transactions/TransactionsPagination";
import { TransactionsTable } from "@/modules/dashboard/employee/components/transactions/TransactionsTable";
import { TransactionsTableToolbar } from "@/modules/dashboard/employee/components/transactions/TransactionsTableToolbar";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import type { TransactionsPageData } from "@/modules/dashboard/employee/types/transactions.types";

interface TransactionsTableSectionProps {
  table: TransactionsPageData["table"];
  gmailConnected: boolean;
}

export function TransactionsTableSection({
  table,
  gmailConnected,
}: TransactionsTableSectionProps) {
  return (
    <DashboardCard className="gap-0 overflow-hidden rounded-md py-0">
      <Suspense fallback={null}>
        <TransactionsTableToolbar />
      </Suspense>

      <div className="px-2 sm:px-0">
        <TransactionsTable
          transactions={table.items}
          gmailConnected={gmailConnected}
        />
      </div>

      <TransactionsPagination
        page={table.page}
        pageSize={table.pageSize}
        totalCount={table.totalCount}
      />
    </DashboardCard>
  );
}
