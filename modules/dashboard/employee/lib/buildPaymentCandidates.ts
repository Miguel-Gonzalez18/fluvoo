import {
  FINANCIAL_INSTITUTIONS,
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
  resolveCardPaymentTotalInDop,
  sumActiveInstallmentsForCard,
} from "./resolve-card-payment-total";
import type { FinancialObligationsSnapshot, PaymentCandidate } from "./financial-obligations.types";

function getInstitutionShortLabel(value: string): string {
  const full =
    FINANCIAL_INSTITUTIONS.find((item) => item.value === value)?.label ?? value;
  const acronym = full.match(/\(([^)]+)\)\s*$/)?.[1]?.trim();
  return acronym ?? full;
}

function getCreditCardShortLabel(
  cardLabel: string | null,
  issuerName: string
): string {
  if (cardLabel?.trim()) return cardLabel.trim();
  return getInstitutionShortLabel(issuerName);
}

function formatUsdSubtext(
  card: FinancialObligationsSnapshot["creditCards"][number],
  usdToDopRate: number
): string | undefined {
  const mode = card.currency_mode ?? "dop_only";
  if (mode === "dop_only") return undefined;

  const usdPart = card.minimum_payment_usd ?? 0;
  if (usdPart <= 0) return undefined;

  const dopEquivalent = Math.round(usdPart * usdToDopRate * 100) / 100;
  return `~RD$ ${dopEquivalent.toLocaleString("es-DO", { minimumFractionDigits: 2 })} (USD ${usdPart.toFixed(2)} @ ${usdToDopRate.toFixed(2)})`;
}

function formatInstallmentsSubtext(
  installmentsTotal: number
): string | undefined {
  if (installmentsTotal <= 0) return undefined;
  return `incl. RD$ ${installmentsTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })} en cuotas`;
}

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

    const usdSubtext = formatUsdSubtext(card, usdToDopRate);
    const installmentsSubtext = formatInstallmentsSubtext(installmentsTotal);
    const amountSubtext = [usdSubtext, installmentsSubtext]
      .filter(Boolean)
      .join(" · ");

    const shortLabel = getCreditCardShortLabel(card.card_label, card.issuer_name);

    candidates.push({
      label: `TC · ${shortLabel}`,
      shortLabel,
      amount: totalInDop,
      dueDate: computeNextDueDate(card.payment_due_day, referenceDate),
      source: "credit_card",
      amountSubtext: amountSubtext || undefined,
    });
  }

  // Orphan installments (card deleted or inactive) still surface separately
  for (const installment of snapshot.creditCardInstallments) {
    if (installment.status !== "active") continue;
    if (consolidatedCardIds.has(installment.credit_card_id)) continue;
    if (!isObligationActiveForMonth(installment.end_date, year, month)) continue;

    const dueDay =
      installment.payment_due_day ??
      installment.credit_cards?.payment_due_day ??
      1;
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
      dueDate: computeNextDueDate(dueDay, referenceDate),
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
    if (isDueDayInMonth(card.payment_due_day, year, month)) {
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

    const dueDay =
      installment.payment_due_day ??
      installment.credit_cards?.payment_due_day ??
      1;

    if (isDueDayInMonth(dueDay, year, month)) {
      total += installment.monthly_payment;
    }
  }

  return total;
}
