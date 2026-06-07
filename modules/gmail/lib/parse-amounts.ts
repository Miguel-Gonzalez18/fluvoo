import type { RawParsedAmounts } from "@/modules/gmail/types/sync.types";

export type { RawParsedAmounts };

const BALANCE_CONTEXT =
  /balance\s+disponible|saldo\s+disponible|disponible\s*:|l[ií]mite|saldo\s+actual|cr[eé]dito\s+disponible/i;

const DOP_LABELED_PATTERNS = [
  /(?:monto|amount|total|debitado|cargado|aprobada\s+por|equivalente|en\s+pesos|por\s+la\s+suma\s+de|suma\s+de)[\s:]*(?:RD\$|RD\s?\$|DOP)\s*([\d,]+\.?\d*)/i,
  /(?:RD\$|RD\s?\$|DOP)\s*([\d,]+\.?\d*)[\s]*(?:debitado|cargado|aprobado)/i,
];

const USD_LABELED_PATTERNS = [
  /(?:monto|amount|total|compra)[\s:]*(?:US\$|USD)\s*([\d,]+\.?\d*)/i,
  /(?:US\$|USD)\s*([\d,]+\.?\d*)/i,
  /([\d,]+\.?\d*)\s*(?:US\$|USD|d[oó]lares)/i,
];

const DOP_FALLBACK_PATTERN = /(?:RD\$|RD\s?\$|DOP)\s*([\d,]+\.?\d*)/i;
const USD_FALLBACK_PATTERN = /(?:US\$|USD)\s*([\d,]+\.?\d*)/i;

const RATE_PATTERNS = [
  /(?:tasa|tipo\s+de\s+cambio|exchange\s+rate)[\s:]*([\d,]+\.?\d*)/i,
];

function parseNumeric(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function splitTextSegments(text: string): string[] {
  return text
    .split(/\n|\.|;|\||<br\s*\/?>/i)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function isBalanceSegment(segment: string): boolean {
  return BALANCE_CONTEXT.test(segment);
}

function extractFromPatterns(
  segments: string[],
  patterns: RegExp[],
  fallbackPattern?: RegExp
): number | null {
  for (const segment of segments) {
    if (isBalanceSegment(segment)) continue;

    for (const pattern of patterns) {
      const match = segment.match(pattern);
      if (match?.[1]) {
        const value = parseNumeric(match[1]);
        if (value) return value;
      }
    }
  }

  if (fallbackPattern) {
    for (const segment of segments) {
      if (isBalanceSegment(segment)) continue;

      const match = segment.match(fallbackPattern);
      if (match?.[1]) {
        const value = parseNumeric(match[1]);
        if (value) return value;
      }
    }
  }

  return null;
}

function extractWithContextScan(
  text: string,
  pattern: RegExp
): number | null {
  const globalPattern = new RegExp(pattern.source, "gi");
  let match = globalPattern.exec(text);

  while (match) {
    const before = text.slice(Math.max(0, match.index - 50), match.index);
    if (!BALANCE_CONTEXT.test(before) && match[1]) {
      const value = parseNumeric(match[1]);
      if (value) return value;
    }
    match = globalPattern.exec(text);
  }

  return null;
}

export function extractRawAmounts(text: string): RawParsedAmounts {
  const segments = splitTextSegments(text);

  const dopAmount =
    extractFromPatterns(segments, DOP_LABELED_PATTERNS, DOP_FALLBACK_PATTERN) ??
    extractWithContextScan(text, DOP_FALLBACK_PATTERN);

  const usdAmount =
    extractFromPatterns(segments, USD_LABELED_PATTERNS, USD_FALLBACK_PATTERN) ??
    extractWithContextScan(text, USD_FALLBACK_PATTERN);

  let rateFromEmail: number | null = null;
  for (const segment of segments) {
    if (isBalanceSegment(segment)) continue;
    for (const pattern of RATE_PATTERNS) {
      const match = segment.match(pattern);
      if (match?.[1]) {
        const rate = parseNumeric(match[1]);
        if (rate && rate > 1 && rate < 200) {
          rateFromEmail = rate;
          break;
        }
      }
    }
  }

  return { dopAmount, usdAmount, rateFromEmail };
}

export function hasResolvableAmount(raw: RawParsedAmounts): boolean {
  return raw.dopAmount !== null || raw.usdAmount !== null;
}
