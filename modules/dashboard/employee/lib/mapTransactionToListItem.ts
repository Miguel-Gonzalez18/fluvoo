import { mapTransactionToRecent } from "@/modules/dashboard/employee/lib/mapTransactionToRecent";
import { formatTransactionDateParts } from "@/modules/dashboard/employee/lib/formatTransactionDate";
import { resolveAccountLabel } from "@/modules/dashboard/employee/lib/resolve-account-label";
import type { TransactionListItem } from "@/modules/dashboard/employee/types/transactions.types";
import {
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
  | "description"
  | "raw_subject"
>;

interface MapTransactionOptions {
  cardLabelsByBank?: Map<string, string>;
}

export function mapTransactionToListItem(
  row: TransactionRow,
  options: MapTransactionOptions = {}
): TransactionListItem {
  const recent = mapTransactionToRecent(row);
  const bankKey = row.bank_name?.trim().toLowerCase() ?? "";
  const cardLabel = options.cardLabelsByBank?.get(bankKey) ?? null;

  const isIncome = INCOME_TRANSACTION_TYPES.includes(
    row.transaction_type as (typeof INCOME_TRANSACTION_TYPES)[number]
  );

  return {
    ...recent,
    description: row.description?.trim() || null,
    accountLabel: resolveAccountLabel({
      bankName: row.bank_name,
      description: row.description,
      rawSubject: row.raw_subject,
      cardLabel,
    }),
    categorySlug: isIncome
      ? null
      : ((row.expense_category as ExpenseCategorySlug | null) ?? null),
    transactionDate: row.transaction_date,
    dateParts: formatTransactionDateParts(row.transaction_date),
  };
}
