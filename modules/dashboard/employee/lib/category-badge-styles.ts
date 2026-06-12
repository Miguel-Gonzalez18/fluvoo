import type { CSSProperties } from "react";
import type { CategoryColorTokens } from "@/modules/shared/lib/expense-category-colors.types";
import type { CategoryColorMap } from "@/modules/shared/lib/expense-category-colors.types";
import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";
import {
  INCOME_CATEGORY_COLOR,
  resolveCategoryColor,
  UNCATEGORIZED_CATEGORY_COLOR,
} from "@/modules/shared/lib/resolve-category-color";

export function getCategoryBadgeStyle(
  color: CategoryColorTokens
): CSSProperties {
  return {
    backgroundColor: color.badgeBg,
    color: color.badgeText,
    borderColor: color.badgeBorder,
  };
}

export function resolveTransactionCategoryColor(
  slug: ExpenseCategorySlug | null,
  direction: "income" | "expense",
  colorMap: CategoryColorMap
): CategoryColorTokens {
  if (direction === "income") {
    return INCOME_CATEGORY_COLOR;
  }

  return resolveCategoryColor(slug, colorMap);
}

export { INCOME_CATEGORY_COLOR, UNCATEGORIZED_CATEGORY_COLOR };
