import {
  getCategoryBySlug,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import { EXPENSE_TRANSACTION_TYPES } from "@/modules/shared/config/expense-categories";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/supabase";

export type ExpensePeriod = "this-month" | "last-month";

function getMonthRange(period: ExpensePeriod): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (period === "this-month") {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { start: start.toISOString(), end: end.toISOString() };
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function getCategoryExpenses(
  supabase: SupabaseClient<Database>,
  userId: string,
  period: ExpensePeriod
): Promise<CategoryExpense[]> {
  const { start, end } = getMonthRange(period);

  const { data, error } = await supabase
    .from("transactions")
    .select("expense_category, amount")
    .eq("user_id", userId)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES])
    .not("expense_category", "is", null)
    .gte("transaction_date", start)
    .lte("transaction_date", end);

  if (error) throw new Error(error.message);

  const totals = new Map<ExpenseCategorySlug, number>();

  for (const row of data ?? []) {
    if (!row.expense_category) continue;
    const slug = row.expense_category as ExpenseCategorySlug;
    totals.set(slug, (totals.get(slug) ?? 0) + row.amount);
  }

  return Array.from(totals.entries())
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, amount]) => {
      const definition = getCategoryBySlug(slug);
      return {
        category: definition.shortLabel,
        fullLabel: definition.label,
        amount,
        budget: 0,
        colorIndex: definition.colorIndex,
      };
    });
}
