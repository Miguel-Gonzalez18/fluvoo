import { z } from "zod";
import {
  getActiveCategorySlugs,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";

const activeSlugs = getActiveCategorySlugs();

export const expenseCategorySlugSchema = z.enum(
  activeSlugs as [ExpenseCategorySlug, ...ExpenseCategorySlug[]]
);

export const transactionCategoryItemSchema = z.object({
  transactionId: z.string().uuid(),
  slug: expenseCategorySlugSchema,
});

export const transactionCategoryBatchSchema = z.object({
  items: z.array(transactionCategoryItemSchema),
});

export interface TransactionCategoryInput {
  transactionId: string;
  merchantName: string | null;
  description: string | null;
  transactionType: string;
  ruleSlug: ExpenseCategorySlug;
}

export interface TransactionCategoryClassification {
  transactionId: string;
  slug: ExpenseCategorySlug;
}
