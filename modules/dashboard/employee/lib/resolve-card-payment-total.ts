import { isObligationActiveForMonth } from "./computeNextDueDate";
import { resolveMinimumPaymentInDop } from "./resolve-card-amount-in-dop";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";

type CardRow = FinancialObligationsSnapshot["creditCards"][number];
type InstallmentRow = FinancialObligationsSnapshot["creditCardInstallments"][number];

export function sumActiveInstallmentsForCard(
  cardId: string,
  installments: InstallmentRow[],
  year: number,
  month: number
): number {
  return installments
    .filter(
      (installment) =>
        installment.credit_card_id === cardId && installment.status === "active"
    )
    .filter((installment) =>
      isObligationActiveForMonth(installment.end_date, year, month)
    )
    .reduce((total, installment) => total + installment.monthly_payment, 0);
}

/**
 * Revolving minimum (DOP-normalized) + active installment monthly payments
 * for the same card — one consolidated amount on the card's due date.
 */
export function resolveCardPaymentTotalInDop(
  card: CardRow,
  installments: InstallmentRow[],
  usdToDopRate: number,
  year: number,
  month: number
): number {
  const revolving = resolveMinimumPaymentInDop(card, usdToDopRate);
  const installmentsTotal = sumActiveInstallmentsForCard(
    card.id,
    installments,
    year,
    month
  );
  return Math.round((revolving + installmentsTotal) * 100) / 100;
}
