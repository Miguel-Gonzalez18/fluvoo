import { cn } from "@/lib/utils";
import { CategoryColorBadge } from "@/modules/dashboard/employee/components/CategoryColorBadge";
import type { TransactionListItem } from "@/modules/dashboard/employee/types/transactions.types";

interface CategoryBadgeProps {
  transaction: TransactionListItem;
  className?: string;
}

export function CategoryBadge({ transaction, className }: CategoryBadgeProps) {
  return (
    <CategoryColorBadge
      label={transaction.category}
      color={transaction.categoryColor}
      className={className}
    />
  );
}
