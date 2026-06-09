import type { ObligationPaymentFrequency } from "../types/onboarding";

const FREQUENCY_MULTIPLIERS: Record<ObligationPaymentFrequency, number> = {
  monthly: 1,
  weekly: 4,
  biweekly: 2,
  daily: 30,
};

export function computeMonthlyFromFrequency(
  paymentAmount: number,
  frequency: ObligationPaymentFrequency
): number {
  if (!Number.isFinite(paymentAmount) || paymentAmount < 0) {
    return 0;
  }
  const multiplier = FREQUENCY_MULTIPLIERS[frequency] ?? 1;
  return Math.round(paymentAmount * multiplier * 100) / 100;
}

export const PAYMENT_FREQUENCY_LABELS: Record<ObligationPaymentFrequency, string> = {
  monthly: "Mensual",
  weekly: "Semanal",
  biweekly: "Quincenal",
  daily: "Diario",
};
