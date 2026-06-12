import { cn } from "@/lib/utils";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { TransactionListItem } from "@/modules/dashboard/employee/types/transactions.types";

interface TransactionAmountCellProps {
  transaction: TransactionListItem;
}

export function TransactionAmountCell({
  transaction,
}: TransactionAmountCellProps) {
  const prefix = transaction.direction === "income" ? "+ " : "- ";
  const formatted = formatDOP(transaction.amount);

  return (
    <div className="text-right">
      <div
        className={cn(
          "font-semibold tabular-nums",
          transaction.direction === "income"
            ? "text-primary-600"
            : "text-destructive"
        )}
      >
        {prefix}
        {formatted}
      </div>
      {transaction.originalAmountSubtext ? (
        <p className="text-xs tabular-nums text-muted-foreground">
          {transaction.originalAmountSubtext}
        </p>
      ) : null}
    </div>
  );
}
