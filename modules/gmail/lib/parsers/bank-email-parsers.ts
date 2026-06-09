import type { SupportedBank } from "@/modules/onboarding/config/gmail";

export interface BankParseResult {
  dopAmount: number | null;
  usdAmount: number | null;
  merchantName: string | null;
  approved: boolean;
  declined: boolean;
}

function parseNumeric(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function cleanMerchant(value: string): string | null {
  const merchant = value.trim().replace(/\s+/g, " ");
  if (merchant.length < 2 || merchant.length > 120) return null;
  if (/^(estatus|estado|monto|fecha|moneda)$/i.test(merchant)) return null;
  return merchant;
}

export function isDeclinedEmail(text: string): boolean {
  return /declinada|rechazada|fondos insuficientes|no autorizada|denegada/i.test(
    text
  );
}

function parseApap(text: string): BankParseResult {
  const declined = isDeclinedEmail(text);
  const hasDetail = /detalle de la transacci[oó]n/i.test(text);
  const approved = /estado[\s:]+aprobada/i.test(text);

  if (declined || !hasDetail || !approved) {
    return {
      dopAmount: null,
      usdAmount: null,
      merchantName: null,
      approved: false,
      declined,
    };
  }

  const montoMatch = text.match(/\bmonto[\s:]+([\d,]+\.?\d*)/i);
  const comercioMatch = text.match(
    /comercio[\s:]+([^\n]+?)(?:\s*\n|\s+estado\b)/i
  );

  return {
    dopAmount: montoMatch?.[1] ? parseNumeric(montoMatch[1]) : null,
    usdAmount: null,
    merchantName: comercioMatch?.[1]
      ? cleanMerchant(comercioMatch[1])
      : null,
    approved: true,
    declined: false,
  };
}

function parseBhd(text: string): BankParseResult {
  const declined = isDeclinedEmail(text);
  const approved = /\baprobada\b/i.test(text);

  if (declined || !approved) {
    return {
      dopAmount: null,
      usdAmount: null,
      merchantName: null,
      approved: false,
      declined,
    };
  }

  const rowMatch = text.match(
    /\d{2}\/\d{2}\/\d{4}[\s\d:apm]*RD\s*\$?\s*([\d,]+\.?\d*)[\s\S]*?([A-Z0-9][A-Z0-9*.\s]+?)\s+Aprobada/i
  );

  if (rowMatch) {
    return {
      dopAmount: parseNumeric(rowMatch[1]),
      usdAmount: null,
      merchantName: cleanMerchant(rowMatch[2]),
      approved: true,
      declined: false,
    };
  }

  const amountMatch = text.match(/\bRD\s*\$?\s*([\d,]+\.?\d*)/i);
  const merchantMatch = text.match(
    /\$[\d,]+\.?\d*\s+([A-Z][A-Z0-9*.\s]+?)\s+Aprobada/i
  );

  return {
    dopAmount: amountMatch?.[1] ? parseNumeric(amountMatch[1]) : null,
    usdAmount: null,
    merchantName: merchantMatch?.[1]
      ? cleanMerchant(merchantMatch[1])
      : null,
    approved: true,
    declined: false,
  };
}

function parsePopular(text: string): BankParseResult {
  const declined = isDeclinedEmail(text);

  if (declined) {
    return {
      dopAmount: null,
      usdAmount: null,
      merchantName: null,
      approved: false,
      declined: true,
    };
  }

  const approved = /\baprobada\b/i.test(text);
  if (!approved) {
    return {
      dopAmount: null,
      usdAmount: null,
      merchantName: null,
      approved: false,
      declined: false,
    };
  }

  const rowMatch = text.match(
    /RD\$?\s*([\d,]+\.?\d*)[\s\d/]+([A-Z][A-Z0-9*.\s]+?)\s+Aprobada/i
  );

  return {
    dopAmount: rowMatch?.[1] ? parseNumeric(rowMatch[1]) : null,
    usdAmount: null,
    merchantName: rowMatch?.[2] ? cleanMerchant(rowMatch[2]) : null,
    approved: true,
    declined: false,
  };
}

function parseSantaCruz(text: string): BankParseResult {
  const declined = isDeclinedEmail(text);
  const approved = /estado[\s:]+aprobada/i.test(text);

  if (declined || !approved) {
    return {
      dopAmount: null,
      usdAmount: null,
      merchantName: null,
      approved: false,
      declined,
    };
  }

  const montoMatch = text.match(/monto[\s:]+RD\$\s*([\d,]+\.?\d*)/i);
  const lugarMatch = text.match(
    /lugar de transacci[oó]n[\s:]+([^\n]+?)(?:\s*\n|\s+fecha\b)/i
  );

  return {
    dopAmount: montoMatch?.[1] ? parseNumeric(montoMatch[1]) : null,
    usdAmount: null,
    merchantName: lugarMatch?.[1] ? cleanMerchant(lugarMatch[1]) : null,
    approved: true,
    declined: false,
  };
}

const BANK_PARSERS: Partial<
  Record<SupportedBank, (text: string) => BankParseResult>
> = {
  APAP: parseApap,
  BHD: parseBhd,
  Popular: parsePopular,
  "Santa Cruz": parseSantaCruz,
};

export function parseByBank(
  bankName: SupportedBank,
  subject: string,
  body: string
): BankParseResult | null {
  const parser = BANK_PARSERS[bankName];
  if (!parser) return null;

  return parser(`${subject}\n${body}`);
}

export function hasRecognizedMerchantField(text: string): boolean {
  return /comercio[\s:]|lugar de transacci[oó]n[\s:]|compra en\s|detalle de transacciones|aprobada[\s\S]{0,80}compra/i.test(
    text
  );
}
