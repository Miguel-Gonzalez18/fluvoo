const MERCHANT_PATTERNS = [
  /compra en\s+(.+?)(?:\s+por|\s+de|\s+rd\$|\s+dop|\s+us\$|\s+usd|\s+el|\s+con|\s*$)/i,
  /consumo en\s+(.+?)(?:\s+por|\s+de|\s+rd\$|\s+dop|\s+us\$|\s+el|\s*$)/i,
  /en\s+(.+?)\s+por\s+(?:RD\$|DOP|US\$|USD|\$)/i,
  /comercio[\s:]+(.+?)(?:\s+por|\s+monto|\s+rd\$|\s+us\$|\s*$)/i,
  /establecimiento[\s:]+(.+?)(?:\s+por|\s+monto|\s+rd\$|\s*$)/i,
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
];

function cleanMerchant(value: string): string | null {
  const merchant = value.trim().replace(/\s+/g, " ");
  if (merchant.length < 3 || merchant.length > 120) return null;
  if (SUBJECT_NOISE_PATTERNS.some((pattern) => pattern.test(merchant))) return null;
  return merchant;
}

export function parseMerchant(subject: string, body: string): string | null {
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

  const estadoMatch = combined.match(
    /estado[\s:]+(.+?)(?:\s+balance|\s+monto|\s+aprobada|\s*$)/i
  );
  if (estadoMatch?.[1]) {
    const merchant = cleanMerchant(estadoMatch[1]);
    if (merchant) return merchant;
  }

  return null;
}
