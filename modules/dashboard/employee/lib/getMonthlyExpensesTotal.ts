import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";

export function getMonthlyExpensesTotal(
  categories: CategoryExpense[]
): number {
  return categories.reduce((sum, category) => sum + category.amount, 0);
}
