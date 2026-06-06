import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CreditCard,
  HelpCircle,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatTransactionDate } from "@/modules/dashboard/employee/lib/formatTransactionDate";
import type {
  RecentTransaction,
  TransactionDirection,
} from "@/modules/dashboard/employee/types/dashboard.types";
import type { Tables } from "@/src/types/supabase";

type TransactionRow = Pick<
  Tables<"transactions">,
  | "id"
  | "merchant_name"
  | "amount"
  | "transaction_date"
  | "transaction_type"
  | "bank_name"
  | "description"
>;

type TransactionType = Tables<"transactions">["transaction_type"];

interface TransactionTypeMeta {
  category: string;
  categoryVariant: RecentTransaction["categoryVariant"];
  direction: TransactionDirection;
  icon: LucideIcon;
}

const transactionTypeMap: Record<TransactionType, TransactionTypeMeta> = {
  debit: {
    category: "DÉBITO",
    categoryVariant: "outline",
    direction: "expense",
    icon: ArrowDownLeft,
  },
  payment: {
    category: "PAGO",
    categoryVariant: "outline",
    direction: "expense",
    icon: CreditCard,
  },
  transfer: {
    category: "TRANSFERENCIA",
    categoryVariant: "outline",
    direction: "expense",
    icon: ArrowLeftRight,
  },
  credit: {
    category: "CRÉDITO",
    categoryVariant: "success",
    direction: "income",
    icon: ArrowUpRight,
  },
  deposit: {
    category: "DEPÓSITO",
    categoryVariant: "success",
    direction: "income",
    icon: Landmark,
  },
  unknown: {
    category: "OTROS",
    categoryVariant: "outline",
    direction: "expense",
    icon: HelpCircle,
  },
};

function resolveMerchantName(row: TransactionRow): string {
  return (
    row.merchant_name?.trim() ||
    row.description?.trim() ||
    row.bank_name?.trim() ||
    "Transacción bancaria"
  );
}

export function mapTransactionToRecent(row: TransactionRow): RecentTransaction {
  const meta = transactionTypeMap[row.transaction_type] ?? transactionTypeMap.unknown;

  return {
    id: row.id,
    merchant: resolveMerchantName(row),
    dateLabel: formatTransactionDate(row.transaction_date),
    category: meta.category,
    categoryVariant: meta.categoryVariant,
    amount: row.amount,
    direction: meta.direction,
    icon: meta.icon,
  };
}
