import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";
import { EXPENSE_CATEGORY_CATALOG } from "@/modules/shared/config/expense-categories";

const colorIndexClassMap: Record<number, string> = {
  1: "border-orange-200 bg-orange-50 text-orange-700",
  2: "border-slate-200 bg-slate-100 text-slate-700",
  3: "border-red-200 bg-red-50 text-red-700",
  4: "border-emerald-200 bg-emerald-50 text-emerald-700",
  5: "border-violet-200 bg-violet-50 text-violet-700",
};

const slugClassMap: Record<ExpenseCategorySlug, string> = Object.fromEntries(
  EXPENSE_CATEGORY_CATALOG.map((category) => [
    category.slug,
    colorIndexClassMap[category.colorIndex] ?? colorIndexClassMap[2],
  ])
) as Record<ExpenseCategorySlug, string>;

export const incomeBadgeClassName =
  "border-emerald-200 bg-emerald-50 text-emerald-700";

export const uncategorizedBadgeClassName =
  "border-slate-200 bg-slate-100 text-slate-600";

export function getCategoryBadgeClassName(
  slug: ExpenseCategorySlug | null,
  direction: "income" | "expense"
): string {
  if (direction === "income") {
    return incomeBadgeClassName;
  }

  if (!slug) {
    return uncategorizedBadgeClassName;
  }

  return slugClassMap[slug] ?? uncategorizedBadgeClassName;
}
