export interface ParsedLoanDocumentFields {
  loanAlias: string | null;
  originalAmount: number | null;
  currentBalance: number | null;
  annualRate: number | null;
  termMonths: number | null;
  monthlyPayment: number | null;
  paymentDueDay: number | null;
  startDate: string | null;
}

function parseAmount(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/,/g, "");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

function parseRate(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/,/g, ".");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) && value >= 0 && value <= 100
    ? Math.round(value * 100) / 100
    : null;
}

function parseDay(raw: string | undefined): number | null {
  if (!raw) return null;
  const day = Number.parseInt(raw, 10);
  return day >= 1 && day <= 31 ? day : null;
}

function parseMonths(raw: string | undefined): number | null {
  if (!raw) return null;
  const months = Number.parseInt(raw, 10);
  return months > 0 && months <= 600 ? months : null;
}

function parseIsoDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = raw.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

export function parseLoanDocumentText(text: string): ParsedLoanDocumentFields {
  const normalized = text.replace(/\s+/g, " ");

  const originalPatterns = [
    /monto(?:\s+(?:del\s+)?pr[eé]stamo|\s+original|\s+desembolsado)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
    /capital(?:\s+inicial|\s+prestado)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
  ];

  const balancePatterns = [
    /saldo(?:\s+actual|\s+pendiente|\s+de\s+capital)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
    /balance(?:\s+outstanding|\s+remaining)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
  ];

  const paymentPatterns = [
    /cuota(?:\s+mensual|\s+fija)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
    /pago\s+mensual[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
  ];

  const ratePatterns = [
    /tasa(?:\s+de\s+inter[eé]s|\s+anual|\s+nominal)?[^%\d]{0,30}([\d]+(?:[.,]\d+)?)\s*%/i,
    /inter[eé]s\s+anual[^%\d]{0,30}([\d]+(?:[.,]\d+)?)\s*%/i,
  ];

  const termPatterns = [
    /plazo[^0-9]{0,20}(\d{1,3})\s*meses/i,
    /(\d{1,3})\s*cuotas/i,
    /(\d{1,3})\s*meses/i,
  ];

  const dueDayPatterns = [
    /(?:d[ií]a\s+de\s+pago|vencimiento|fecha\s+de\s+pago)[^0-9]{0,30}(\d{1,2})/i,
  ];

  const startDatePatterns = [
    /fecha(?:\s+de\s+)?(?:inicio|desembolso|firma)[^0-9]{0,20}(\d{4}[-/]\d{2}[-/]\d{2})/i,
  ];

  const aliasPatterns = [
    /pr[eé]stamo[:\s-]+([A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]{3,40})/i,
  ];

  return {
    loanAlias: firstMatch(normalized, aliasPatterns)?.trim() ?? null,
    originalAmount: parseAmount(firstMatch(normalized, originalPatterns)),
    currentBalance: parseAmount(firstMatch(normalized, balancePatterns)),
    annualRate: parseRate(firstMatch(normalized, ratePatterns)),
    termMonths: parseMonths(firstMatch(normalized, termPatterns)),
    monthlyPayment: parseAmount(firstMatch(normalized, paymentPatterns)),
    paymentDueDay: parseDay(firstMatch(normalized, dueDayPatterns)),
    startDate: parseIsoDate(firstMatch(normalized, startDatePatterns)),
  };
}
