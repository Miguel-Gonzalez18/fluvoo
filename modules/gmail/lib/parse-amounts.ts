import type { RawParsedAmounts } from "@/modules/gmail/types/sync.types";

export type { RawParsedAmounts };

type AmountSource = "monto" | "labeled" | "fallback";

interface AmountCandidate {
  value: number;
  source: AmountSource;
}

const BALANCE_LINE =
  /balance\s+disponible|saldo\s+disponible|disponible\s*:|l[ií]mite|saldo\s+actual|cr[eé]dito\s+disponible/i;

const MONTO_PLAIN_PATTERN = /\bmonto[\s:]+([\d,]+\.?\d*)/i;

const DOP_LABELED_PATTERNS = [
  /(?:monto|amount|total|debitado|cargado|aprobada\s+por|equivalente|en\s+pesos|por\s+la\s+suma\s+de|suma\s+de)[\s:]*(?:RD\$|RD\s?\$|DOP)\s*([\d,]+\.?\d*)/i,
  /(?:RD\$|RD\s?\$|DOP)\s*([\d,]+\.?\d*)[\s]*(?:debitado|cargado|aprobado)/i,
  /\bRD\s*\$?\s*([\d,]+\.?\d*)/i,
];

const USD_LABELED_PATTERNS = [
  /(?:monto|amount|total|compra)[\s:]*(?:US\$|USD)\s*([\d,]+\.?\d*)/i,
  /(?:US\$|USD)\s*([\d,]+\.?\d*)/i,
  /([\d,]+\.?\d*)\s*(?:US\$|USD|d[oó]lares)/i,
];

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
  return BALANCE_LINE.test(segment);
}

function collectDopCandidates(text: string): AmountCandidate[] {
  const candidates: AmountCandidate[] = [];
  const segments = splitTextSegments(text);

  for (const segment of segments) {
    if (isBalanceSegment(segment)) continue;

    const montoPlain = segment.match(MONTO_PLAIN_PATTERN);
    if (montoPlain?.[1]) {
      const value = parseNumeric(montoPlain[1]);
      if (value) candidates.push({ value, source: "monto" });
    }

    for (const pattern of DOP_LABELED_PATTERNS) {
      const match = segment.match(pattern);
      if (match?.[1]) {
        const value = parseNumeric(match[1]);
        if (value) candidates.push({ value, source: "labeled" });
      }
    }
  }

  return candidates;
}

function collectUsdCandidates(text: string): AmountCandidate[] {
  const candidates: AmountCandidate[] = [];
  const segments = splitTextSegments(text);

  for (const segment of segments) {
    if (isBalanceSegment(segment)) continue;

    for (const pattern of USD_LABELED_PATTERNS) {
      const match = segment.match(pattern);
      if (match?.[1]) {
        const value = parseNumeric(match[1]);
        if (value) candidates.push({ value, source: "labeled" });
      }
    }
  }

  return candidates;
}

function pickBestCandidate(
  candidates: AmountCandidate[]
): number | null {
  const priority: AmountSource[] = ["monto", "labeled", "fallback"];

  for (const source of priority) {
    const match = candidates.find((candidate) => candidate.source === source);
    if (match) return match.value;
  }

  return null;
}

export function extractRawAmounts(text: string): RawParsedAmounts {
  const dopAmount = pickBestCandidate(collectDopCandidates(text));
  const usdAmount = pickBestCandidate(collectUsdCandidates(text));

  let rateFromEmail: number | null = null;
  for (const segment of splitTextSegments(text)) {
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
