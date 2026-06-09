import { isBankMerchantName } from "@/modules/gmail/lib/is-internal-bank-movement";
import {
  getCategoryBySlug,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import { EXPENSE_TRANSACTION_TYPES } from "@/modules/shared/config/expense-categories";
import type { SupportedBank } from "@/modules/onboarding/config/gmail";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import {
  getMonthRange,
  type ExpensePeriod,
} from "@/modules/dashboard/employee/lib/month-bounds";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/supabase";

export type { ExpensePeriod };

export interface MonthlyExpenseAggregate {
  total: number;
  transactionCount: number;
}

function shouldSkipExpenseRow(
  bankName: string | null,
  merchantName: string | null
): boolean {
  if (!bankName || !merchantName) return false;
  return isBankMerchantName(bankName as SupportedBank, merchantName);
}

export async function fetchMonthExpenseRows(
  supabase: SupabaseClient<Database>,
  userId: string,
  period: ExpensePeriod
) {
  const { start, end } = getMonthRange(period);

  const { data, error } = await supabase
    .from("transactions")
    .select("expense_category, amount, merchant_name, bank_name")
    .eq("user_id", userId)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES])
    .gte("transaction_date", start)
    .lte("transaction_date", end);

  if (error) throw new Error(error.message);

  return (data ?? []).filter(
    (row) => !shouldSkipExpenseRow(row.bank_name, row.merchant_name)
  );
}

export async function getMonthlyExpenseAggregate(
  supabase: SupabaseClient<Database>,
  userId: string,
  period: ExpensePeriod
): Promise<MonthlyExpenseAggregate> {
  const rows = await fetchMonthExpenseRows(supabase, userId, period);

  let total = 0;
  for (const row of rows) {
    total += row.amount;
  }

  return {
    total: Math.round(total * 100) / 100,
    transactionCount: rows.length,
  };
}

export async function getCategoryExpenses(
  supabase: SupabaseClient<Database>,
  userId: string,
  period: ExpensePeriod
): Promise<CategoryExpense[]> {
  const rows = await fetchMonthExpenseRows(supabase, userId, period);
  const totals = new Map<ExpenseCategorySlug, number>();

  for (const row of rows) {
    const slug = (row.expense_category as ExpenseCategorySlug | null) ?? "otros";
    totals.set(slug, (totals.get(slug) ?? 0) + row.amount);
  }

  return Array.from(totals.entries())
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, amount]) => {
      const definition = getCategoryBySlug(slug);
      return {
        slug,
        category: definition.shortLabel,
        fullLabel: definition.label,
        amount,
        budget: 0,
        colorIndex: definition.colorIndex,
      };
    });
}
