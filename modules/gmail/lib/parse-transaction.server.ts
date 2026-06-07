import { detectBankFromEmail } from "@/modules/gmail/config/bank-filters";
import {
  classifyBankEmail,
  shouldSkipClassification,
} from "@/modules/gmail/lib/classify-bank-email";
import {
  extractGmailMessageBody,
  getGmailHeader,
  getGmailMessageDate,
  type GmailMessagePayload,
} from "@/modules/gmail/lib/decode-message.server";
import { extractRawAmounts, hasResolvableAmount } from "@/modules/gmail/lib/parse-amounts";
import { parseMerchant } from "@/modules/gmail/lib/parse-merchant";
import type {
  BankEmailSkipReason,
  ParsedBankEmailDraft,
  TransactionType,
} from "@/modules/gmail/types/sync.types";

function detectTransactionType(text: string): TransactionType {
  const normalized = text.toLowerCase();

  if (
    /dep[oó]sito|abono|cr[eé]dito recib|transferencia recibida|ingreso|recibiste/.test(
      normalized
    )
  ) {
    return "deposit";
  }
  if (/transferencia enviada|transferencia realizada|transferiste/.test(normalized)) {
    return "transfer";
  }
  if (/pago de|pago con|pago realizado|pagaste/.test(normalized)) {
    return "payment";
  }
  if (/compra|d[eé]bito|retiro|cargo|consumo|compraste|aprobada/.test(normalized)) {
    return "debit";
  }
  if (/cr[eé]dito|abono recibido/.test(normalized)) {
    return "credit";
  }

  return "unknown";
}

export type ParseBankEmailOutcome =
  | { status: "parsed"; draft: ParsedBankEmailDraft }
  | { status: "skipped"; reason: BankEmailSkipReason };

export function parseBankEmailMessage(
  message: GmailMessagePayload
): ParseBankEmailOutcome {
  const from = getGmailHeader(message, "From") ?? "";
  const subject = getGmailHeader(message, "Subject") ?? "";
  const body = extractGmailMessageBody(message);
  const combinedText = `${subject}\n${body}`;
  const bankName = detectBankFromEmail(from);

  if (!bankName) {
    return { status: "skipped", reason: "unknown" };
  }

  const classification = classifyBankEmail(subject, body);
  if (shouldSkipClassification(classification)) {
    return {
      status: "skipped",
      reason: classification === "marketing" ? "marketing" : "statement",
    };
  }

  if (classification === "unknown") {
    const hasAmountHint = /(?:RD\$|RD\s?\$|US\$|USD|DOP|\$[\d,]+)/i.test(combinedText);
    if (!hasAmountHint) {
      return { status: "skipped", reason: "unknown" };
    }
  }

  const rawAmounts = extractRawAmounts(combinedText);
  if (!hasResolvableAmount(rawAmounts)) {
    return { status: "skipped", reason: "no_amount" };
  }

  const draft: ParsedBankEmailDraft = {
    bankName,
    transactionType: detectTransactionType(combinedText),
    merchantName: parseMerchant(subject, body),
    description: subject || message.snippet || null,
    transactionDate: getGmailMessageDate(message),
    rawAmounts,
  };

  return { status: "parsed", draft };
}
