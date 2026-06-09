import { classifyTransactionsWithAi } from "@/modules/shared/ai/classify-transactions-with-ai.server";
import type { TransactionCategoryInput } from "@/modules/shared/ai/transaction-category.schema";
import {
  EXPENSE_TRANSACTION_TYPES,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import { createAdminClient } from "@/src/lib/admin";

export interface AiCategorySyncStats {
  aiReviewed: number;
  aiUpdated: number;
  aiFailed: number;
}

interface TransactionRow {
  id: string;
  merchant_name: string | null;
  description: string | null;
  transaction_type: string;
  expense_category: ExpenseCategorySlug | null;
  category_source: string | null;
}

export async function classifyImportedTransactionsWithAi(
  userId: string,
  importedIds: string[]
): Promise<AiCategorySyncStats> {
  const empty: AiCategorySyncStats = {
    aiReviewed: 0,
    aiUpdated: 0,
    aiFailed: 0,
  };

  if (!importedIds.length) return empty;

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("transactions")
    .select(
      "id, merchant_name, description, transaction_type, expense_category, category_source"
    )
    .eq("user_id", userId)
    .in("id", importedIds)
    .in("transaction_type", [...EXPENSE_TRANSACTION_TYPES]);

  if (error) {
    console.error(
      "[classifyImportedTransactionsWithAi] Failed to load transactions:",
      error.message
    );
    return { ...empty, aiFailed: 1 };
  }

  const rows = (data ?? []) as TransactionRow[];
  const eligible = rows.filter((row) => row.category_source !== "manual");

  if (!eligible.length) return empty;

  const inputs: TransactionCategoryInput[] = eligible.map((row) => ({
    transactionId: row.id,
    merchantName: row.merchant_name,
    description: row.description,
    transactionType: row.transaction_type,
    ruleSlug: row.expense_category ?? "otros",
  }));

  const aiResult = await classifyTransactionsWithAi(inputs);

  const rowById = new Map(eligible.map((row) => [row.id, row]));
  let aiUpdated = 0;

  for (const classification of aiResult.classifications) {
    const row = rowById.get(classification.transactionId);
    if (!row) continue;

    const currentSlug = row.expense_category ?? "otros";
    if (classification.slug === currentSlug) continue;

    const { error: updateError } = await admin
      .from("transactions")
      .update({
        expense_category: classification.slug,
        category_source: "ai",
      })
      .eq("id", classification.transactionId)
      .eq("user_id", userId);

    if (updateError) {
      console.error(
        "[classifyImportedTransactionsWithAi] Update failed:",
        updateError.message
      );
      continue;
    }

    aiUpdated += 1;
  }

  return {
    aiReviewed: aiResult.reviewed,
    aiUpdated,
    aiFailed: aiResult.failed ? 1 : 0,
  };
}
