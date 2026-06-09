import { ArrowUpRight, HelpCircle, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatOriginalAmountSubtext } from "@/modules/dashboard/employee/lib/formatCurrency";
import { formatTransactionDate } from "@/modules/dashboard/employee/lib/formatTransactionDate";
import type {
  RecentTransaction,
  TransactionDirection,
} from "@/modules/dashboard/employee/types/dashboard.types";
import { getCategoryIcon } from "@/modules/shared/config/expense-category-icons";
import {
  getCategoryBySlug,
  INCOME_TRANSACTION_TYPES,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import type { Tables } from "@/src/types/supabase";

type TransactionRow = Pick<
  Tables<"transactions">,
  | "id"
  | "merchant_name"
  | "amount"
  | "transaction_date"
  | "transaction_type"
  | "bank_name"
  | "original_amount"
  | "original_currency"
  | "rate_source"
  | "expense_category"
>;

function resolveMerchantName(row: TransactionRow): string {
  if (row.merchant_name?.trim()) {
    return row.merchant_name.trim();
  }

  if (row.bank_name?.trim()) {
    return `Transacción ${row.bank_name.trim()}`;
  }

  return "Transacción bancaria";
}

function resolveTransactionMeta(row: TransactionRow): {
  category: string;
  categoryVariant: RecentTransaction["categoryVariant"];
  direction: TransactionDirection;
  icon: LucideIcon;
} {
  if (
    INCOME_TRANSACTION_TYPES.includes(
      row.transaction_type as (typeof INCOME_TRANSACTION_TYPES)[number]
    )
  ) {
    return {
      category: "INGRESOS",
      categoryVariant: "success",
      direction: "income",
      icon: row.transaction_type === "deposit" ? Landmark : ArrowUpRight,
    };
  }

  if (row.expense_category) {
    const slug = row.expense_category as ExpenseCategorySlug;
    return {
      category: getCategoryBySlug(slug).shortLabel.toUpperCase(),
      categoryVariant: "outline",
      direction: "expense",
      icon: getCategoryIcon(slug),
    };
  }

  return {
    category: "OTROS",
    categoryVariant: "outline",
    direction: "expense",
    icon: HelpCircle,
  };
}

export function mapTransactionToRecent(row: TransactionRow): RecentTransaction {
  const meta = resolveTransactionMeta(row);

  return {
    id: row.id,
    merchant: resolveMerchantName(row),
    dateLabel: formatTransactionDate(row.transaction_date),
    category: meta.category,
    categoryVariant: meta.categoryVariant,
    amount: row.amount,
    originalAmountSubtext: formatOriginalAmountSubtext(
      row.original_amount,
      row.original_currency,
      row.rate_source
    ),
    direction: meta.direction,
    icon: meta.icon,
  };
}
