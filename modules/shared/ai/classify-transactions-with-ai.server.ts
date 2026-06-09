import { generateObject, zodSchema } from "ai";
import {
  TRANSACTION_CATEGORY_SYSTEM_PROMPT,
  buildTransactionCategoryUserPrompt,
  isValidCategorySlug,
} from "@/modules/shared/ai/transaction-category.prompt";
import {
  transactionCategoryBatchSchema,
  type TransactionCategoryClassification,
  type TransactionCategoryInput,
} from "@/modules/shared/ai/transaction-category.schema";
import {
  createGeminiLanguageModel,
  resolveGeminiApiKey,
} from "@/modules/shared/ai/gemini.client.server";

const AI_BATCH_SIZE = 25;

export interface ClassifyTransactionsWithAiResult {
  reviewed: number;
  classifications: TransactionCategoryClassification[];
  failed: boolean;
}

async function classifyBatch(
  items: TransactionCategoryInput[],
  allowedIds: Set<string>
): Promise<TransactionCategoryClassification[]> {
  const { object } = await generateObject({
    model: createGeminiLanguageModel(),
    schema: zodSchema(transactionCategoryBatchSchema),
    schemaName: "TransactionCategoryBatch",
    schemaDescription:
      "Clasificación de transacciones bancarias por slug del catálogo RD",
    system: TRANSACTION_CATEGORY_SYSTEM_PROMPT,
    prompt: buildTransactionCategoryUserPrompt(items),
    temperature: 0.2,
  });

  const results: TransactionCategoryClassification[] = [];

  for (const item of object.items) {
    if (!allowedIds.has(item.transactionId)) {
      console.warn(
        "[classifyTransactionsWithAi] Ignoring unknown transactionId from AI"
      );
      continue;
    }

    if (!isValidCategorySlug(item.slug)) {
      console.warn(
        "[classifyTransactionsWithAi] Ignoring invalid slug from AI:",
        item.slug
      );
      continue;
    }

    results.push({
      transactionId: item.transactionId,
      slug: item.slug,
    });
  }

  return results;
}

export async function classifyTransactionsWithAi(
  items: TransactionCategoryInput[]
): Promise<ClassifyTransactionsWithAiResult> {
  if (!items.length) {
    return { reviewed: 0, classifications: [], failed: false };
  }

  if (!resolveGeminiApiKey()) {
    return { reviewed: 0, classifications: [], failed: false };
  }

  const allowedIds = new Set(items.map((item) => item.transactionId));
  const classifications: TransactionCategoryClassification[] = [];
  let failed = false;

  for (let offset = 0; offset < items.length; offset += AI_BATCH_SIZE) {
    const batch = items.slice(offset, offset + AI_BATCH_SIZE);

    try {
      const batchResults = await classifyBatch(batch, allowedIds);
      classifications.push(...batchResults);
    } catch (error) {
      failed = true;
      console.error("[classifyTransactionsWithAi] Gemini batch failed:", error);
    }
  }

  return {
    reviewed: items.length,
    classifications,
    failed,
  };
}
