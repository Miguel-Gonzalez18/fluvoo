import { cn } from "@/lib/utils";
import { getCategoryBadgeClassName } from "@/modules/dashboard/employee/lib/category-badge-styles";
import type { TransactionListItem } from "@/modules/dashboard/employee/types/transactions.types";

interface CategoryBadgeProps {
  transaction: TransactionListItem;
  className?: string;
}

export function CategoryBadge({ transaction, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2 py-0.5 font-label text-xs font-semibold uppercase tracking-wide",
        getCategoryBadgeClassName(
          transaction.categorySlug,
          transaction.direction
        ),
        className
      )}
    >
      {transaction.category}
    </span>
  );
}
