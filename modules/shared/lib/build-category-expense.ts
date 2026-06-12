import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import {
  getCategoryBySlug,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import type { CategoryColorMap } from "@/modules/shared/lib/expense-category-colors.types";
import { resolveCategoryColor } from "@/modules/shared/lib/resolve-category-color";

export function buildCategoryExpense(
  slug: ExpenseCategorySlug,
  amount: number,
  colorMap: CategoryColorMap
): CategoryExpense {
  const definition = getCategoryBySlug(slug);

  return {
    slug,
    category: definition.shortLabel,
    fullLabel: definition.label,
    amount: Math.round(amount * 100) / 100,
    budget: 0,
    color: resolveCategoryColor(slug, colorMap),
  };
}
