import {
  DEBT_CATEGORY_SLUG,
  resolveObligationCategorySlug,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import type { ObligationType } from "@/modules/onboarding/types/onboarding";
import type { TransactionType } from "@/modules/gmail/types/sync.types";
import { classifyExpenseCategory } from "@/modules/shared/lib/classify-expense-category";

export type ExpenseCategorySource =
  | "transaction"
  | "fixed_obligation"
  | "loan"
  | "credit_card";

export type ExpenseCategoryClassifiedBy =
  | "keyword"
  | "obligation_map"
  | "business_rule";

export interface ResolveExpenseCategoryInput {
  source: ExpenseCategorySource;
  merchantName?: string | null;
  description?: string | null;
  transactionType?: TransactionType;
  obligationType?: ObligationType | string;
}

export interface ResolveExpenseCategoryResult {
  slug: ExpenseCategorySlug;
  classifiedBy: ExpenseCategoryClassifiedBy;
}

export function resolveExpenseCategory(
  input: ResolveExpenseCategoryInput
): ResolveExpenseCategoryResult {
  if (input.source === "loan" || input.source === "credit_card") {
    return { slug: DEBT_CATEGORY_SLUG, classifiedBy: "business_rule" };
  }

  if (input.source === "fixed_obligation") {
    const obligationType = (input.obligationType ?? "other") as ObligationType;
    return {
      slug: resolveObligationCategorySlug(obligationType),
      classifiedBy: "obligation_map",
    };
  }

  const classification = classifyExpenseCategory({
    merchantName: input.merchantName ?? null,
    description: input.description ?? null,
    transactionType: input.transactionType ?? "unknown",
  });

  return {
    slug: classification.category ?? "otros",
    classifiedBy: "keyword",
  };
}
