import {
  EXPENSE_CATEGORIES,
  INCOME_TRANSACTION_TYPES,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import type { TransactionType } from "@/modules/gmail/types/sync.types";

export type CategorySource = "rule" | "manual";

export interface ClassifyExpenseCategoryResult {
  category: ExpenseCategorySlug | null;
  source: CategorySource | null;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildSearchText(
  merchantName: string | null,
  description: string | null
): string {
  return normalizeText(`${merchantName ?? ""} ${description ?? ""}`.trim());
}

function matchKeyword(searchText: string, keyword: string): boolean {
  const normalizedKeyword = normalizeText(keyword);
  return searchText.includes(normalizedKeyword);
}

function matchCategoryByKeywords(
  searchText: string,
  excludeSlugs: ExpenseCategorySlug[] = []
): ExpenseCategorySlug | null {
  const sorted = [...EXPENSE_CATEGORIES]
    .filter((category) => category.slug !== "otros")
    .filter((category) => !excludeSlugs.includes(category.slug))
    .sort((a, b) => a.matchPriority - b.matchPriority);

  for (const category of sorted) {
    const keywords = [...category.keywords].sort((a, b) => b.length - a.length);
    for (const keyword of keywords) {
      if (matchKeyword(searchText, keyword)) {
        return category.slug;
      }
    }
  }

  return null;
}

export function classifyExpenseCategory(input: {
  merchantName: string | null;
  description: string | null;
  transactionType: TransactionType;
}): ClassifyExpenseCategoryResult {
  if (
    INCOME_TRANSACTION_TYPES.includes(
      input.transactionType as (typeof INCOME_TRANSACTION_TYPES)[number]
    )
  ) {
    return { category: null, source: null };
  }

  const searchText = buildSearchText(input.merchantName, input.description);

  if (input.transactionType === "transfer") {
    const specificMatch = matchCategoryByKeywords(searchText, [
      "transferencias_pagos_personas",
    ]);
    if (specificMatch) {
      return { category: specificMatch, source: "rule" };
    }
    return { category: "transferencias_pagos_personas", source: "rule" };
  }

  const matched = matchCategoryByKeywords(searchText);
  if (matched) {
    return { category: matched, source: "rule" };
  }

  return { category: "otros", source: "rule" };
}
