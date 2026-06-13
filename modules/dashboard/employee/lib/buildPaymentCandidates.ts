import {
  getLoanTypeLabel,
  getObligationTypeLabel,
} from "@/modules/onboarding/config/financial";
import type { ObligationType, LoanType } from "@/modules/onboarding/types/onboarding";
import {
  computeNextDueDate,
  isDueDayInMonth,
  isObligationActiveForMonth,
} from "./computeNextDueDate";
import {
  isDateInCalendarMonth,
  ymdToLocalDate,
} from "@/modules/dashboard/employee/lib/credit-card-dates";
import {
  buildCardAmountSubtext,
  getCreditCardShortLabel,
  getInstitutionShortLabel,
} from "@/modules/dashboard/employee/lib/format-card-payment-subtext";
import {
  resolveCardPaymentTotalInDop,
  sumActiveInstallmentsForCard,
} from "./resolve-card-payment-total";
import type { FinancialObligationsSnapshot, PaymentCandidate } from "./financial-obligations.types";

export { getInstitutionShortLabel, getCreditCardShortLabel } from "@/modules/dashboard/employee/lib/format-card-payment-subtext";

export function buildPaymentCandidates(
  snapshot: FinancialObligationsSnapshot,
  referenceDate: Date = new Date(),
  usdToDopRate: number = 1
): PaymentCandidate[] {
  const candidates: PaymentCandidate[] = [];
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const consolidatedCardIds = new Set<string>();

  for (const obligation of snapshot.fixedObligations) {
    if (obligation.status !== "active") continue;

    const shortLabel =
      obligation.name?.trim() ||
      getObligationTypeLabel(obligation.obligation_type as ObligationType);
    const label = obligation.provider_name
      ? `${shortLabel} · ${obligation.provider_name}`
      : shortLabel;

    candidates.push({
      label,
      shortLabel,
      amount: obligation.monthly_amount,
      dueDate: computeNextDueDate(obligation.payment_due_day, referenceDate),
      source: "fixed_obligation",
    });
  }

  for (const loan of snapshot.loans) {
    if (loan.status !== "active" || !loan.payment_due_day) continue;
    if (!isObligationActiveForMonth(loan.end_date, year, month)) continue;

    const typeLabel = getLoanTypeLabel(loan.loan_type as LoanType);
    const shortLabel = loan.lender_name
      ? getInstitutionShortLabel(loan.lender_name)
      : "Préstamo";
    candidates.push({
      label: `${typeLabel} · ${shortLabel}`,
      shortLabel,
      amount: loan.monthly_payment,
      dueDate: computeNextDueDate(loan.payment_due_day, referenceDate),
      source: "loan",
    });
  }

  for (const card of snapshot.creditCards) {
    if (card.status !== "active") continue;

    consolidatedCardIds.add(card.id);

    const installmentsTotal = sumActiveInstallmentsForCard(
      card.id,
      snapshot.creditCardInstallments,
      year,
      month
    );
    const totalInDop = resolveCardPaymentTotalInDop(
      card,
      snapshot.creditCardInstallments,
      usdToDopRate,
      year,
      month
    );

    const amountSubtext = buildCardAmountSubtext(
      card,
      installmentsTotal,
      usdToDopRate
    );

    const shortLabel = getCreditCardShortLabel(card.card_label, card.issuer_name);

    candidates.push({
      label: `TC · ${shortLabel}`,
      shortLabel,
      amount: totalInDop,
      dueDate: ymdToLocalDate(card.next_payment_due_date),
      source: "credit_card",
      amountSubtext: amountSubtext || undefined,
    });
  }

  for (const installment of snapshot.creditCardInstallments) {
    if (installment.status !== "active") continue;
    if (consolidatedCardIds.has(installment.credit_card_id)) continue;
    if (!isObligationActiveForMonth(installment.end_date, year, month)) continue;

    const dueDateYmd =
      installment.credit_cards?.next_payment_due_date ?? null;
    if (!dueDateYmd) continue;

    const shortLabel = installment.description?.trim()
      ? installment.description.trim()
      : installment.credit_cards
        ? getCreditCardShortLabel(
            installment.credit_cards.card_label,
            installment.credit_cards.issuer_name
          )
        : "Cuota";

    candidates.push({
      label: `Cuota · ${shortLabel}`,
      shortLabel,
      amount: installment.monthly_payment,
      dueDate: ymdToLocalDate(dueDateYmd),
      source: "credit_card_installment",
    });
  }

  return candidates.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function sumObligationsDueThisMonth(
  snapshot: FinancialObligationsSnapshot,
  referenceDate: Date = new Date(),
  usdToDopRate: number = 1
): number {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  let total = 0;
  const consolidatedCardIds = new Set<string>();

  for (const obligation of snapshot.fixedObligations) {
    if (obligation.status !== "active") continue;
    if (isDueDayInMonth(obligation.payment_due_day, year, month)) {
      total += obligation.monthly_amount;
    }
  }

  for (const loan of snapshot.loans) {
    if (loan.status !== "active" || !loan.payment_due_day) continue;
    if (!isObligationActiveForMonth(loan.end_date, year, month)) continue;
    if (isDueDayInMonth(loan.payment_due_day, year, month)) {
      total += loan.monthly_payment;
    }
  }

  for (const card of snapshot.creditCards) {
    if (card.status !== "active") continue;
    consolidatedCardIds.add(card.id);
    if (isDateInCalendarMonth(card.next_payment_due_date, referenceDate)) {
      total += resolveCardPaymentTotalInDop(
        card,
        snapshot.creditCardInstallments,
        usdToDopRate,
        year,
        month
      );
    }
  }

  for (const installment of snapshot.creditCardInstallments) {
    if (installment.status !== "active") continue;
    if (consolidatedCardIds.has(installment.credit_card_id)) continue;
    if (!isObligationActiveForMonth(installment.end_date, year, month)) continue;

    const dueDateYmd = installment.credit_cards?.next_payment_due_date;
    if (!dueDateYmd) continue;

    if (isDateInCalendarMonth(dueDateYmd, referenceDate)) {
      total += installment.monthly_payment;
    }
  }

  return total;
}
