import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/modules/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/modules/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table";
import { RECENT_TRANSACTIONS } from "@/modules/dashboard/employee/config/dashboardMock";
import { formatSignedDOP } from "@/modules/dashboard/employee/lib/formatCurrency";

interface RecentTransactionsTableProps {
  className?: string;
}

export function RecentTransactionsTable({ className }: RecentTransactionsTableProps) {
  return (
    <Card
      className={cn(
        "gap-4 rounded-2xl border-border/60 bg-white py-6 shadow-sm",
        className
      )}
    >
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 px-5 pb-0">
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Comercio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_TRANSACTIONS.map((transaction) => {
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
                    <Badge variant={transaction.categoryVariant}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold tabular-nums",
                      transaction.direction === "income"
                        ? "text-primary-600"
                        : "text-destructive"
                    )}
                  >
                    {formatSignedDOP(transaction.amount, transaction.direction)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
