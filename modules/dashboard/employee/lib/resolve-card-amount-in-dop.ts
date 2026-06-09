export interface CreditCardAmountFields {
  currency_mode: string;
  minimum_payment: number;
  minimum_payment_usd: number | null;
}

export function resolveMinimumPaymentInDop(
  card: CreditCardAmountFields,
  usdToDopRate: number
): number {
  const mode = card.currency_mode ?? "dop_only";
  const dopPart = card.minimum_payment ?? 0;
  const usdPart = card.minimum_payment_usd ?? 0;

  if (mode === "usd_only") {
    return usdPart * usdToDopRate;
  }

  if (mode === "mixed") {
    return dopPart + usdPart * usdToDopRate;
  }

  return dopPart;
}
