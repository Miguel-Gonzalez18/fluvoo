export type BankEmailClassification =
  | "transaction"
  | "marketing"
  | "statement"
  | "unknown";

const MARKETING_PATTERNS = [
  /publicidad/i,
  /promoci[oó]n/i,
  /promocion/i,
  /oferta/i,
  /paquete esperado/i,
  /newsletter/i,
  /bolet[ií]n informativo/i,
  /descubre/i,
  /aprovecha/i,
  /gana /i,
  /sorteo/i,
];

const STATEMENT_PATTERNS = [
  /estado de cuenta/i,
  /resumen mensual/i,
  /extracto/i,
  /resumen de cuenta/i,
  /corte de estado/i,
];

const TRANSACTION_SIGNALS = [
  /transacci[oó]n/i,
  /compra/i,
  /d[eé]bito/i,
  /cargo/i,
  /consumo/i,
  /aprobada/i,
  /monto/i,
  /usd/i,
  /rd\$/i,
  /dop/i,
  /notificaci[oó]n de transacci/i,
  /comercio/i,
  /transferencia/i,
  /retiro/i,
  /pago realizado/i,
];

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce(
    (count, pattern) => (pattern.test(text) ? count + 1 : count),
    0
  );
}

export function classifyBankEmail(
  subject: string,
  body: string
): BankEmailClassification {
  const combined = `${subject}\n${body}`;
  const normalized = combined.toLowerCase();

  if (MARKETING_PATTERNS.some((pattern) => pattern.test(combined))) {
    return "marketing";
  }

  const statementMatches = countMatches(combined, STATEMENT_PATTERNS);
  const transactionSignals = countMatches(combined, TRANSACTION_SIGNALS);

  if (statementMatches > 0 && transactionSignals < 2) {
    return "statement";
  }

  if (transactionSignals >= 2) {
    return "transaction";
  }

  if (
    /notificaci[oó]n/i.test(combined) &&
    /(aprobada|monto|comercio|lugar de transacci)/i.test(combined)
  ) {
    return "transaction";
  }

  if (/detalle de la transacci[oó]n/i.test(combined) && /monto/i.test(combined)) {
    return "transaction";
  }

  if (/declinada|rechazada|fondos insuficientes/i.test(combined)) {
    return "unknown";
  }

  return "unknown";
}

export function shouldSkipClassification(
  classification: BankEmailClassification
): boolean {
  return classification === "marketing" || classification === "statement";
}
