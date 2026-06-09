import type { SupportedBank } from "@/modules/onboarding/config/gmail";
import { parseByBank } from "@/modules/gmail/lib/parsers/bank-email-parsers";

const MERCHANT_PATTERNS = [
  /compra en\s+([^\n]+?)(?:\s+por|\s+de|\s+rd\$|\s+dop|\s+us\$|\s+usd|\s+el|\s+con)/i,
  /consumo en\s+([^\n]+?)(?:\s+por|\s+de|\s+rd\$|\s+dop|\s+us\$|\s+el)/i,
  /en\s+([^\n]+?)\s+por\s+(?:RD\$|DOP|US\$|USD|\$)/i,
  /comercio[\s:]+([^\n]+?)(?:\s+estado\b|\s+monto\b|\s+balance\b|$)/i,
  /establecimiento[\s:]+([^\n]+?)(?:\s+monto\b|\s+rd\$|\s+balance\b|$)/i,
  /lugar de transacci[oó]n[\s:]+([^\n]+?)(?:\s+fecha\b|\s+estado\b|$)/i,
];

const INTERNATIONAL_MERCHANT_PATTERNS = [
  /\b(netflix)\b/i,
  /\b(spotify)\b/i,
  /\b(cursor)\b/i,
  /\b(apple\.com|apple inc)\b/i,
  /\b(google|youtube premium)\b/i,
  /\b(amazon)\b/i,
  /\b(disney\+?|disney plus)\b/i,
  /\b(hbo|max)\b/i,
  /\b(uber)\b/i,
  /\b(microsoft)\b/i,
  /\b(adobe)\b/i,
  /\b(paypal)\b/i,
];

const SUBJECT_NOISE_PATTERNS = [
  /^notificaci[oó]n/i,
  /^alerta/i,
  /^banco\s/i,
  /^apap\s/i,
  /^bhd\s/i,
  /^estatus$/i,
  /^estado$/i,
];

function cleanMerchant(value: string): string | null {
  const merchant = value.trim().replace(/\s+/g, " ");
  if (merchant.length < 2 || merchant.length > 120) return null;
  if (SUBJECT_NOISE_PATTERNS.some((pattern) => pattern.test(merchant))) return null;
  if (/aprobada|balance disponible|declinada/i.test(merchant)) return null;
  return merchant;
}

export function parseMerchant(
  subject: string,
  body: string,
  bankName?: SupportedBank | null
): string | null {
  if (bankName) {
    const bankResult = parseByBank(bankName, subject, body);
    if (bankResult?.merchantName) {
      return bankResult.merchantName;
    }
  }

  for (const pattern of MERCHANT_PATTERNS) {
    const match = subject.match(pattern) ?? body.match(pattern);
    if (match?.[1]) {
      const merchant = cleanMerchant(match[1]);
      if (merchant) return merchant;
    }
  }

  const combined = `${subject}\n${body}`;
  for (const pattern of INTERNATIONAL_MERCHANT_PATTERNS) {
    const match = combined.match(pattern);
    if (match?.[1]) {
      return match[1].toUpperCase() === "CURSOR"
        ? "Cursor"
        : match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    }
  }

  return null;
}
