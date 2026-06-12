import { Receipt } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CategoryColorBadge } from "@/modules/dashboard/employee/components/CategoryColorBadge";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent, CardHeader } from "@/modules/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table";
import { formatSignedDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { RecentTransaction } from "@/modules/dashboard/employee/types/dashboard.types";

interface RecentTransactionsTableProps {
  transactions: RecentTransaction[];
  gmailConnected: boolean;
  className?: string;
}

export function RecentTransactionsTable({
  transactions,
  gmailConnected,
  className,
}: RecentTransactionsTableProps) {
  return (
    <DashboardCard className={cn("gap-4 rounded-md py-6", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 px-5 pb-0">
        <h2 className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Últimas Transacciones
        </h2>
        <Link
          href="/employee/transactions"
          className="text-sm font-medium text-primary hover:text-primary-700"
        >
          Ver todas
        </Link>
      </CardHeader>

      <CardContent className="px-2 sm:px-5">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Receipt className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Sin transacciones todavía
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                {gmailConnected
                  ? "Tu Gmail está conectado pero aún no hay movimientos importados. Usa el botón de sincronizar en el header o verifica las notificaciones de tu banco."
                  : "Usa el botón Conectar en el header para vincular Gmail e importar tus movimientos bancarios."}
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead>Comercio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="max-h-[32rem] overflow-y-auto">
              {transactions.map((transaction) => {
                const Icon = transaction.icon;

                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">
                          {transaction.merchant}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.dateLabel}
                    </TableCell>
                    <TableCell>
                      <CategoryColorBadge
                        label={transaction.category}
                        color={transaction.categoryColor}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={cn(
                          "font-semibold tabular-nums",
                          transaction.direction === "income"
                            ? "text-primary-600"
                            : "text-destructive"
                        )}
                      >
                        {formatSignedDOP(transaction.amount, transaction.direction)}
                      </div>
                      {transaction.originalAmountSubtext ? (
                        <p className="text-xs tabular-nums text-muted-foreground">
                          {transaction.originalAmountSubtext}
                        </p>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </DashboardCard>
  );
}
