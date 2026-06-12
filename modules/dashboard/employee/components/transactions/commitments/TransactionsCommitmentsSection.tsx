import Link from "next/link";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent, CardHeader } from "@/modules/shared/components/ui/card";
import { CreditCardCarousel } from "@/modules/dashboard/employee/components/transactions/commitments/CreditCardCarousel";
import { FixedObligationsList } from "@/modules/dashboard/employee/components/transactions/commitments/FixedObligationsList";
import { LoansList } from "@/modules/dashboard/employee/components/transactions/commitments/LoansList";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { TransactionsCommitmentsData } from "@/modules/dashboard/employee/types/transactions.types";

interface TransactionsCommitmentsSectionProps {
  commitments: TransactionsCommitmentsData;
}

export function TransactionsCommitmentsSection({
  commitments,
}: TransactionsCommitmentsSectionProps) {
  if (!commitments.hasAny) {
    return (
      <DashboardCard className="gap-4 rounded-md py-6">
        <CardHeader className="px-5 pb-0">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Compromisos del mes
          </h2>
          <p className="text-sm text-muted-foreground">
            Pagos fijos, préstamos y tarjetas que tienes programados
          </p>
        </CardHeader>
        <CardContent className="px-5">
          <div className="rounded-md border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Registra tus obligaciones para ver tus compromisos del mes
            </p>
            <Link
              href="/employee/settings"
              className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Ir a configuración
            </Link>
          </div>
        </CardContent>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="gap-4 rounded-md py-6">
      <CardHeader className="space-y-1 px-5 pb-0">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Compromisos del mes
          </h2>
          <p className="text-sm capitalize text-muted-foreground">
            {commitments.monthLabel}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Total comprometido:{" "}
          <span className="font-semibold text-foreground">
            {formatDOP(commitments.totals.all)}
          </span>
        </p>
      </CardHeader>

      <CardContent className="px-5">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          <FixedObligationsList
            items={commitments.fixed}
            total={commitments.totals.fixed}
          />
          <LoansList items={commitments.loans} total={commitments.totals.loans} />
          <CreditCardCarousel
            cards={commitments.cards}
            total={commitments.totals.cards}
          />
        </div>
      </CardContent>
    </DashboardCard>
  );
}
