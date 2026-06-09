import type { SupportedBank } from "@/modules/onboarding/config/gmail";
import { hasRecognizedMerchantField } from "@/modules/gmail/lib/parsers/bank-email-parsers";

const BANK_MERCHANT_ALIASES: Record<SupportedBank, string[]> = {
  Banreservas: ["banreservas", "banco de reservas"],
  Popular: ["popular", "banco popular", "bpd"],
  BHD: ["bhd", "bhd leon", "bhd león", "bhdleon"],
  APAP: ["apap", "asociacion popular", "asociación popular"],
  Scotiabank: ["scotiabank", "scotia"],
  Qik: ["qik"],
  "Santa Cruz": ["santa cruz", "banco santa cruz", "bsc"],
  Cibao: ["cibao", "asociacion cibao", "asociación cibao"],
  Caribe: ["caribe", "banco caribe"],
  Banesco: ["banesco"],
};

const INTERNAL_PHRASES = [
  /transferencia entre/i,
  /movimiento entre cuentas/i,
  /pago a tarjeta/i,
  /abono a tarjeta/i,
  /pago de tarjeta/i,
  /transferencia a cuenta propia/i,
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function merchantMatchesBank(
  bankName: SupportedBank,
  merchantName: string
): boolean {
  const normalizedMerchant = normalize(merchantName);
  const aliases = BANK_MERCHANT_ALIASES[bankName] ?? [normalize(bankName)];

  return aliases.some(
    (alias) =>
      normalizedMerchant === alias ||
      normalizedMerchant.startsWith(`${alias} `) ||
      normalizedMerchant.includes(alias)
  );
}

export function isInternalBankMovement(
  bankName: SupportedBank,
  merchantName: string | null,
  combinedText: string
): boolean {
  if (INTERNAL_PHRASES.some((pattern) => pattern.test(combinedText))) {
    return true;
  }

  if (!merchantName?.trim()) {
    if (INTERNAL_PHRASES.some((pattern) => pattern.test(combinedText))) {
      return true;
    }
    if (
      /\baprobada\b/i.test(combinedText) &&
      /\b(compra|consumo|monto|claro|uber|cursor)\b/i.test(combinedText)
    ) {
      return false;
    }
    return !hasRecognizedMerchantField(combinedText);
  }

  if (merchantMatchesBank(bankName, merchantName)) {
    return true;
  }

  if (/^transacci[oó]n\s+/i.test(merchantName)) {
    return true;
  }

  return false;
}

export function isBankMerchantName(
  bankName: SupportedBank,
  merchantName: string | null
): boolean {
  if (!merchantName?.trim()) return false;
  return merchantMatchesBank(bankName, merchantName);
}
