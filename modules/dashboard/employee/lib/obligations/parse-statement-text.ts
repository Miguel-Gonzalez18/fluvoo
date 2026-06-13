export interface ParsedStatementFields {
  statementBalance: number | null;
  statementBalanceUsd: number | null;
  minimumPayment: number | null;
  currentBalance: number | null;
  statementCloseDay: number | null;
  paymentDueDay: number | null;
}

function parseAmount(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/,/g, "");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

function parseDay(raw: string | undefined): number | null {
  if (!raw) return null;
  const day = Number.parseInt(raw, 10);
  return day >= 1 && day <= 31 ? day : null;
}

export function parseStatementText(
  text: string,
  issuerName: string
): ParsedStatementFields {
  const normalized = text.replace(/\s+/g, " ");

  const balancePatterns = [
    /saldo(?:\s+al\s+corte|\s+actual|\s+total)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
    /balance(?:\s+due|\s+total)?[^$\d]{0,40}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
  ];

  const usdPatterns = [
    /saldo(?:\s+al\s+corte|\s+usd)?[^$\d]{0,40}US\s*\$\s*([\d,]+\.?\d*)/i,
    /US\s*\$\s*([\d,]+\.?\d*)/i,
  ];

  const minimumPatterns = [
    /pago\s+m[ií]nimo[^$\d]{0,30}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
    /minimum\s+payment[^$\d]{0,30}(?:RD\s*\$|RD\$|\$)\s*([\d,]+\.?\d*)/i,
  ];

  const closeDayPatterns = [
    /(?:d[ií]a|corte|fecha\s+de\s+corte)[^0-9]{0,20}(\d{1,2})/i,
  ];

  const dueDayPatterns = [
    /(?:fecha\s+l[ií]mite|vencimiento|pago\s+m[ií]nimo\s+para)[^0-9]{0,30}(\d{1,2})/i,
  ];

  let statementBalance: number | null = null;
  for (const pattern of balancePatterns) {
    const match = normalized.match(pattern);
    const value = parseAmount(match?.[1]);
    if (value != null) {
      statementBalance = value;
      break;
    }
  }

  let statementBalanceUsd: number | null = null;
  for (const pattern of usdPatterns) {
    const match = normalized.match(pattern);
    const value = parseAmount(match?.[1]);
    if (value != null) {
      statementBalanceUsd = value;
      break;
    }
  }

  let minimumPayment: number | null = null;
  for (const pattern of minimumPatterns) {
    const match = normalized.match(pattern);
    const value = parseAmount(match?.[1]);
    if (value != null) {
      minimumPayment = value;
      break;
    }
  }

  let statementCloseDay: number | null = null;
  for (const pattern of closeDayPatterns) {
    const match = normalized.match(pattern);
    statementCloseDay = parseDay(match?.[1]);
    if (statementCloseDay != null) break;
  }

  let paymentDueDay: number | null = null;
  for (const pattern of dueDayPatterns) {
    const match = normalized.match(pattern);
    paymentDueDay = parseDay(match?.[1]);
    if (paymentDueDay != null) break;
  }

  void issuerName;

  return {
    statementBalance,
    statementBalanceUsd,
    minimumPayment,
    currentBalance: statementBalance,
    statementCloseDay,
    paymentDueDay,
  };
}
