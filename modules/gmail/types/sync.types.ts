import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";

export interface RawParsedAmounts {
  dopAmount: number | null;
  usdAmount: number | null;
  rateFromEmail: number | null;
}

export type TransactionType =
  | "debit"
  | "credit"
  | "transfer"
  | "payment"
  | "deposit"
  | "unknown";

export type TransactionParseStatus = "parsed" | "partial" | "failed";

export type RateSource = "bank_email" | "api_estimated";

export type BankEmailSkipReason =
  | "marketing"
  | "statement"
  | "unknown"
  | "no_amount"
  | "usd_only_disabled"
  | "duplicate"
  | "declined"
  | "internal_transfer";

export interface ParsedBankEmailDraft {
  bankName: string;
  transactionType: TransactionType;
  merchantName: string | null;
  description: string | null;
  transactionDate: Date;
  rawAmounts: RawParsedAmounts;
}

export interface ParsedBankTransaction {
  bankName: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  originalAmount: number | null;
  originalCurrency: string | null;
  exchangeRate: number | null;
  rateSource: RateSource | null;
  merchantName: string | null;
  description: string | null;
  transactionDate: Date;
  parseStatus: TransactionParseStatus;
  expenseCategory: ExpenseCategorySlug | null;
  categorySource: string | null;
}

export interface GmailSyncResult {
  success: boolean;
  processed: number;
  imported: number;
  skipped: number;
  failed: number;
  skippedMarketing?: number;
  skippedNoAmount?: number;
  skippedDuplicate?: number;
  skippedDeclined?: number;
  skippedInternal?: number;
  aiReviewed?: number;
  aiUpdated?: number;
  aiFailed?: number;
  error?: string;
}

export interface GmailConnectionRow {
  user_id: string;
  google_email: string;
  refresh_token: string;
  access_token: string | null;
  token_expires_at: string | null;
  sync_status: string;
  sync_error: string | null;
}
