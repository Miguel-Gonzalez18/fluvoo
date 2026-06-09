import {
  EXPENSE_CATEGORY_CATALOG,
  INCOME_TRANSACTION_TYPES,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import type { TransactionType } from "@/modules/gmail/types/sync.types";

/** How expense_category was assigned: keywords, AI post-sync, or user override. */
export type CategorySource = "rule" | "manual" | "ai";

export interface ClassifyExpenseCategoryResult {
  category: ExpenseCategorySlug | null;
  source: CategorySource | null;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[*_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUberEatsMerchant(searchText: string): boolean {
  return (
    searchText.includes("uber eats") ||
    searchText.includes("ubereats") ||
    /uber\s+eats/.test(searchText)
  );
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
  const sorted = [...EXPENSE_CATEGORY_CATALOG]
    .filter((category) => category.active)
    .filter((category) => category.slug !== "otros")
    .filter((category) => !excludeSlugs.includes(category.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);

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

  if (isUberEatsMerchant(searchText)) {
    return { category: "restaurantes", source: "rule" };
  }

  if (input.transactionType === "transfer") {
    const specificMatch = matchCategoryByKeywords(searchText, ["transferencias"]);
    if (specificMatch) {
      return { category: specificMatch, source: "rule" };
    }
    return { category: "transferencias", source: "rule" };
  }

  const matched = matchCategoryByKeywords(searchText);
  if (matched) {
    return { category: matched, source: "rule" };
  }

  return { category: "otros", source: "rule" };
}
