import { classifyExpenseCategory } from "@/modules/shared/lib/classify-expense-category";
import { EXPENSE_TRANSACTION_TYPES } from "@/modules/shared/config/expense-categories";
import { createAdminClient } from "@/src/lib/admin";

export async function backfillExpenseCategoriesForUser(
  userId: string
): Promise<number> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("transactions")
    .select("id, merchant_name, description, transaction_type")
    .eq("user_id", userId)
    .is("expense_category", null)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES]);

  if (error) throw new Error(error.message);
  if (!data?.length) return 0;

  let updated = 0;

  for (const row of data) {
    const classification = classifyExpenseCategory({
      merchantName: row.merchant_name,
      description: row.description,
      transactionType: row.transaction_type,
    });

    if (!classification.category) continue;

    const { error: updateError } = await admin
      .from("transactions")
      .update({
        expense_category: classification.category,
        category_source: classification.source,
      })
      .eq("id", row.id);

    if (updateError) throw new Error(updateError.message);
    updated += 1;
  }

  return updated;
}

export async function backfillExpenseCategoriesIfNeeded(
  userId: string
): Promise<void> {
  const admin = createAdminClient();

  const { count, error } = await admin
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("expense_category", null)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES]);

  if (error) throw new Error(error.message);
  if (!count) return;

  await backfillExpenseCategoriesForUser(userId);
}
