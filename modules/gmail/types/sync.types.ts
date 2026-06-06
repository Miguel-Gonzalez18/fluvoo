export type TransactionType =
  | "debit"
  | "credit"
  | "transfer"
  | "payment"
  | "deposit"
  | "unknown";

export type TransactionParseStatus = "parsed" | "partial" | "failed";

export interface ParsedBankTransaction {
  bankName: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  merchantName: string | null;
  description: string | null;
  transactionDate: Date;
  parseStatus: TransactionParseStatus;
}

export interface GmailSyncResult {
  success: boolean;
  processed: number;
  imported: number;
  skipped: number;
  failed: number;
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
