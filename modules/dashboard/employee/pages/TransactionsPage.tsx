import { Suspense } from "react";
import { TransactionsCommitmentsSection } from "@/modules/dashboard/employee/components/transactions/commitments/TransactionsCommitmentsSection";
import { TransactionsChartsSection } from "@/modules/dashboard/employee/components/transactions/TransactionsChartsSection";
import { TransactionsSummaryCards } from "@/modules/dashboard/employee/components/transactions/TransactionsSummaryCards";
import { TransactionsTableSection } from "@/modules/dashboard/employee/components/transactions/TransactionsTableSection";
import type { TransactionsPageData } from "@/modules/dashboard/employee/types/transactions.types";

interface EmployeeTransactionsPageProps {
  data: TransactionsPageData;
}

export function EmployeeTransactionsPage({
  data,
}: EmployeeTransactionsPageProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <TransactionsSummaryCards summary={data.summary} />

      <TransactionsCommitmentsSection commitments={data.commitments} />

      <TransactionsChartsSection chartData={data.chartData} />

      <Suspense fallback={null}>
        <TransactionsTableSection
          table={data.table}
          gmailConnected={data.gmailStatus.connected}
        />
      </Suspense>
    </div>
  );
}
