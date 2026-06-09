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
import { isInternalBankMovement } from "@/modules/gmail/lib/is-internal-bank-movement";
import { extractRawAmounts, hasResolvableAmount } from "@/modules/gmail/lib/parse-amounts";
import { parseMerchant } from "@/modules/gmail/lib/parse-merchant";
import {
  isDeclinedEmail,
  parseByBank,
} from "@/modules/gmail/lib/parsers/bank-email-parsers";
import type {
  BankEmailSkipReason,
  ParsedBankEmailDraft,
  RawParsedAmounts,
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

function mergeAmounts(
  bankAmounts: RawParsedAmounts | null,
  genericAmounts: RawParsedAmounts
): RawParsedAmounts {
  return {
    dopAmount: bankAmounts?.dopAmount ?? genericAmounts.dopAmount,
    usdAmount: bankAmounts?.usdAmount ?? genericAmounts.usdAmount,
    rateFromEmail: bankAmounts?.rateFromEmail ?? genericAmounts.rateFromEmail,
  };
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

  if (isDeclinedEmail(combinedText)) {
    return { status: "skipped", reason: "declined" };
  }

  const classification = classifyBankEmail(subject, body);
  if (shouldSkipClassification(classification)) {
    return {
      status: "skipped",
      reason: classification === "marketing" ? "marketing" : "statement",
    };
  }

  const bankParse = parseByBank(bankName, subject, body);

  if (bankParse?.declined) {
    return { status: "skipped", reason: "declined" };
  }

  if (bankParse && !bankParse.approved) {
    return { status: "skipped", reason: "unknown" };
  }

  const genericAmounts = extractRawAmounts(combinedText);
  const bankAmounts: RawParsedAmounts | null = bankParse
    ? {
        dopAmount: bankParse.dopAmount,
        usdAmount: bankParse.usdAmount,
        rateFromEmail: null,
      }
    : null;

  const rawAmounts = mergeAmounts(bankAmounts, genericAmounts);

  if (!hasResolvableAmount(rawAmounts)) {
    return { status: "skipped", reason: "no_amount" };
  }

  const merchantName = parseMerchant(subject, body, bankName);

  if (isInternalBankMovement(bankName, merchantName, combinedText)) {
    return { status: "skipped", reason: "internal_transfer" };
  }

  const draft: ParsedBankEmailDraft = {
    bankName,
    transactionType: detectTransactionType(combinedText),
    merchantName,
    description: subject || message.snippet || null,
    transactionDate: getGmailMessageDate(message),
    rawAmounts,
  };

  return { status: "parsed", draft };
}
