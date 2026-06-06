import { detectBankFromEmail } from "@/modules/gmail/config/bank-filters";
import {
  extractGmailMessageBody,
  getGmailHeader,
  getGmailMessageDate,
  type GmailMessagePayload,
} from "@/modules/gmail/lib/decode-message.server";
import type {
  ParsedBankTransaction,
  TransactionParseStatus,
  TransactionType,
} from "@/modules/gmail/types/sync.types";

const AMOUNT_PATTERNS = [
  /(?:RD\$|RD\s?\$|DOP\s?)\s*([\d,]+\.\d{2})/i,
  /(?:RD\$|RD\s?\$|DOP\s?)\s*([\d,]+)/i,
  /\$\s*([\d,]+\.\d{2})/,
  /monto[\s:]+([\d,]+\.\d{2})/i,
  /amount[\s:]+([\d,]+\.\d{2})/i,
];

const MERCHANT_PATTERNS = [
  /compra en\s+(.+?)(?:\s+por|\s+de|\s+rd\$|\s+dop|\s+el|\s+con|\s*$)/i,
  /consumo en\s+(.+?)(?:\s+por|\s+de|\s+rd\$|\s+dop|\s+el|\s*$)/i,
  /en\s+(.+?)\s+por\s+(?:RD\$|DOP|\$)/i,
  /comercio[\s:]+(.+?)(?:\s+por|\s+monto|\s+rd\$|\s*$)/i,
];

function parseAmount(text: string): number | null {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = Number.parseFloat(match[1].replace(/,/g, ""));
      if (!Number.isNaN(value) && value > 0) return value;
    }
  }
  return null;
}

function detectTransactionType(text: string): TransactionType {
  const normalized = text.toLowerCase();

  if (/dep[oó]sito|abono|cr[eé]dito recib|transferencia recibida|ingreso|recibiste/.test(normalized)) {
    return "deposit";
  }
  if (/transferencia enviada|transferencia realizada|transferiste/.test(normalized)) {
    return "transfer";
  }
  if (/pago de|pago con|pago realizado|pagaste/.test(normalized)) {
    return "payment";
  }
  if (/compra|d[eé]bito|retiro|cargo|consumo|compraste/.test(normalized)) {
    return "debit";
  }
  if (/cr[eé]dito|abono recibido/.test(normalized)) {
    return "credit";
  }

  return "unknown";
}

function parseMerchant(subject: string, body: string): string | null {
  for (const pattern of MERCHANT_PATTERNS) {
    const match = subject.match(pattern) ?? body.match(pattern);
    if (match?.[1]) {
      const merchant = match[1].trim().replace(/\s+/g, " ");
      if (merchant.length >= 3 && merchant.length <= 120) {
        return merchant;
      }
    }
  }
  return null;
}

function resolveParseStatus(
  amount: number | null,
  bankName: string | null
): TransactionParseStatus {
  if (amount && bankName) return "parsed";
  if (amount || bankName) return "partial";
  return "failed";
}

export function parseBankEmailMessage(
  message: GmailMessagePayload
): ParsedBankTransaction | null {
  const from = getGmailHeader(message, "From") ?? "";
  const subject = getGmailHeader(message, "Subject") ?? "";
  const body = extractGmailMessageBody(message);
  const combinedText = `${subject}\n${body}`;
  const bankName = detectBankFromEmail(from);

  if (!bankName) return null;

  const amount = parseAmount(combinedText);
  if (!amount) return null;

  const transactionType = detectTransactionType(combinedText);
  const merchantName = parseMerchant(subject, body);
  const parseStatus = resolveParseStatus(amount, bankName);

  return {
    bankName,
    transactionType,
    amount,
    currency: "DOP",
    merchantName,
    description: subject || message.snippet || null,
    transactionDate: getGmailMessageDate(message),
    parseStatus,
  };
}
