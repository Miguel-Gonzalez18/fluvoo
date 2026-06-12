import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "@/modules/dashboard/employee/components/transactions/CategoryBadge";
import { TransactionAmountCell } from "@/modules/dashboard/employee/components/transactions/TransactionAmountCell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table";
import type { TransactionListItem } from "@/modules/dashboard/employee/types/transactions.types";

interface TransactionsTableProps {
  transactions: TransactionListItem[];
  gmailConnected: boolean;
  className?: string;
}

export function TransactionsTable({
  transactions,
  gmailConnected,
  className,
}: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 px-4 py-16 text-center",
          className
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Receipt className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Sin transacciones en este periodo
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            {gmailConnected
              ? "Prueba ajustar los filtros o sincroniza Gmail para importar movimientos recientes."
              : "Conecta Gmail desde el header para importar tus movimientos bancarios."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table className={className}>
      <TableHeader className="bg-background">
        <TableRow>
          <TableHead className="font-label text-xs uppercase tracking-wide text-muted-foreground">
            Fecha
          </TableHead>
          <TableHead className="font-label text-xs uppercase tracking-wide text-muted-foreground">
            Comercio / Descripción
          </TableHead>
          <TableHead className="font-label text-xs uppercase tracking-wide text-muted-foreground">
            Cuenta
          </TableHead>
          <TableHead className="font-label text-xs uppercase tracking-wide text-muted-foreground">
            Categoría
          </TableHead>
          <TableHead className="text-right font-label text-xs uppercase tracking-wide text-muted-foreground">
            Monto
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const Icon = transaction.icon;

          return (
            <TableRow key={transaction.id}>
              <TableCell className="align-top">
                <div className="font-semibold text-foreground">
                  {transaction.dateParts.dayMonth}
                </div>
                <div className="text-xs text-muted-foreground">
                  {transaction.dateParts.time}
                </div>
              </TableCell>
              <TableCell className="align-top">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {transaction.merchant}
                    </p>
                    {transaction.description ? (
                      <p className="truncate text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </TableCell>
              <TableCell className="align-top text-sm text-muted-foreground">
                {transaction.accountLabel}
              </TableCell>
              <TableCell className="align-top">
                <CategoryBadge transaction={transaction} />
              </TableCell>
              <TableCell className="align-top">
                <TransactionAmountCell transaction={transaction} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
