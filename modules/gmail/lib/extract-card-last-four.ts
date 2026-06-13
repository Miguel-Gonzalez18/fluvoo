const LAST_FOUR_PATTERNS = [
  /\*{2,}\s*(\d{4})\b/,
  /terminad[oa]\s+en\s+(\d{4})\b/i,
  /final\s+(\d{4})\b/i,
  /(?:visa|mastercard|mc)\s+\*{0,4}\s*(\d{4})\b/i,
  /\b(\d{4})\s*(?:\)|\.|,|$)/,
];

export function extractCardLastFour(text: string): string | null {
  const normalized = text.replace(/\s+/g, " ");

  for (const pattern of LAST_FOUR_PATTERNS) {
    const match = normalized.match(pattern);
    if (match?.[1] && /^\d{4}$/.test(match[1])) {
      return match[1];
    }
  }

  return null;
}

export function isLikelyCreditCardPurchase(text: string): boolean {
  const normalized = text.toLowerCase();
  if (/pago de tarjeta|pago tc|abono a tarjeta|pago tarjeta/i.test(normalized)) {
    return false;
  }
  return /compra|consumo|d[eé]bito|aprobada|cargo/i.test(normalized);
}
