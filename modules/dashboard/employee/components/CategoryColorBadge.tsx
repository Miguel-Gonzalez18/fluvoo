import { cn } from "@/lib/utils";
import { getCategoryBadgeStyle } from "@/modules/dashboard/employee/lib/category-badge-styles";
import type { CategoryColorTokens } from "@/modules/shared/lib/expense-category-colors.types";

interface CategoryColorBadgeProps {
  label: string;
  color: CategoryColorTokens;
  className?: string;
}

export function CategoryColorBadge({
  label,
  color,
  className,
}: CategoryColorBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2 py-0.5 font-label text-xs font-semibold uppercase tracking-wide",
        className
      )}
      style={getCategoryBadgeStyle(color)}
    >
      {label}
    </span>
  );
}
