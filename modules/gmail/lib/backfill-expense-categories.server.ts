import { classifyExpenseCategory } from "@/modules/shared/lib/classify-expense-category";
import { EXPENSE_TRANSACTION_TYPES } from "@/modules/shared/config/expense-categories";
import { createAdminClient } from "@/src/lib/admin";

interface BackfillExpenseCategoriesOptions {
  /** Reclassify rows previously tagged by rules (skips manual overrides). */
  force?: boolean;
}

export async function backfillExpenseCategoriesForUser(
  userId: string,
  options: BackfillExpenseCategoriesOptions = {}
): Promise<number> {
  const admin = createAdminClient();

  let query = admin
    .from("transactions")
    .select("id, merchant_name, description, transaction_type, category_source")
    .eq("user_id", userId)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES]);

  if (options.force) {
    query = query.or("expense_category.is.null,category_source.eq.rule");
  } else {
    query = query.is("expense_category", null);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  if (!data?.length) return 0;

  let updated = 0;

  for (const row of data) {
    if (options.force && row.category_source === "manual") continue;

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
  userId: string,
  options: BackfillExpenseCategoriesOptions = {}
): Promise<void> {
  const admin = createAdminClient();

  let countQuery = admin
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES]);

  if (options.force) {
    countQuery = countQuery.or("expense_category.is.null,category_source.eq.rule");
  } else {
    countQuery = countQuery.is("expense_category", null);
  }

  const { count, error } = await countQuery;

  if (error) throw new Error(error.message);
  if (!count) return;

  await backfillExpenseCategoriesForUser(userId, options);
}
