import {
  getLoanTypeLabel,
  getObligationTypeLabel,
} from "@/modules/onboarding/config/financial";
import type {
  CreditCardCurrencyMode,
  LoanType,
  ObligationType,
} from "@/modules/onboarding/types/onboarding";
import { buildCommitmentDueStatus } from "@/modules/dashboard/employee/lib/build-commitment-due-status";
import {
  formatUsdSubtext,
  getCreditCardShortLabel,
  getInstitutionShortLabel,
} from "@/modules/dashboard/employee/lib/format-card-payment-subtext";
import { resolveCreditCardPlasticTheme } from "@/modules/dashboard/employee/lib/credit-card-plastic-theme";
import { isObligationActiveForMonth } from "@/modules/dashboard/employee/lib/computeNextDueDate";
import {
  resolveCardPaymentTotalInDop,
  sumActiveInstallmentsForCard,
} from "@/modules/dashboard/employee/lib/resolve-card-payment-total";
import type { FinancialObligationsSnapshot } from "@/modules/dashboard/employee/lib/financial-obligations.types";
import type {
  CreditCardCommitmentItem,
  FixedCommitmentItem,
  LoanCommitmentItem,
  TransactionsCommitmentsData,
} from "@/modules/dashboard/employee/types/transactions.types";

export const EMPTY_COMMITMENTS: TransactionsCommitmentsData = {
  monthLabel: "",
  totals: { fixed: 0, loans: 0, cards: 0, all: 0 },
  fixed: [],
  loans: [],
  cards: [],
  hasAny: false,
};

function formatMonthLabel(referenceDate: Date): string {
  return new Intl.DateTimeFormat("es-DO", {
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(referenceDate);
}

function sortByDueDay<
  T extends { dueStatus: { dueDay: number } },
>(items: T[]): T[] {
  return [...items].sort((a, b) => a.dueStatus.dueDay - b.dueStatus.dueDay);
}

function sumInstallmentsRemainingForCard(
  cardId: string,
  installments: FinancialObligationsSnapshot["creditCardInstallments"]
): number {
  return installments
    .filter(
      (installment) =>
        installment.credit_card_id === cardId && installment.status === "active"
    )
    .reduce((total, installment) => total + installment.remaining_balance, 0);
}

export function buildTransactionsCommitments(
  snapshot: FinancialObligationsSnapshot,
  displayName: string,
  usdToDopRate: number = 1,
  referenceDate: Date = new Date()
): TransactionsCommitmentsData {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const fixed: FixedCommitmentItem[] = [];
  snapshot.fixedObligations.forEach((obligation, index) => {
    if (obligation.status !== "active") return;

    const obligationType = obligation.obligation_type as ObligationType;
    const label =
      obligation.name?.trim() ||
      getObligationTypeLabel(obligationType);

    fixed.push({
      id: `fixed-${index}-${obligationType}`,
      label,
      provider: obligation.provider_name?.trim() || null,
      obligationType,
      amount: obligation.monthly_amount,
      dueStatus: buildCommitmentDueStatus(
        obligation.payment_due_day,
        referenceDate
      ),
    });
  });

  const loans: LoanCommitmentItem[] = [];
  snapshot.loans.forEach((loan) => {
    if (loan.status !== "active" || !loan.payment_due_day) return;
    if (!isObligationActiveForMonth(loan.end_date, year, month)) return;

    const loanType = loan.loan_type as LoanType;
    const lenderLabel = loan.lender_name
      ? getInstitutionShortLabel(loan.lender_name)
      : "Préstamo";

    loans.push({
      id: loan.id,
      label: getLoanTypeLabel(loanType),
      lenderLabel,
      lenderName: loan.lender_name,
      loanType,
      amount: loan.monthly_payment,
      dueStatus: buildCommitmentDueStatus(loan.payment_due_day, referenceDate),
      originalAmount: loan.original_amount,
      currentBalance: loan.current_balance,
      termMonths: loan.term_months,
      annualRate: loan.annual_rate,
      startDate: loan.start_date,
      endDate: loan.end_date,
    });
  });

  const cards: CreditCardCommitmentItem[] = [];
  let cardIndex = 0;

  for (const card of snapshot.creditCards) {
    if (card.status !== "active") continue;

    const installmentsDop = sumActiveInstallmentsForCard(
      card.id,
      snapshot.creditCardInstallments,
      year,
      month
    );
    const totalPaymentDop = resolveCardPaymentTotalInDop(
      card,
      snapshot.creditCardInstallments,
      usdToDopRate,
      year,
      month
    );
    const revolvingDop =
      Math.round((totalPaymentDop - installmentsDop) * 100) / 100;
    const alias = getCreditCardShortLabel(card.card_label, card.issuer_name);
    const issuerLabel = getInstitutionShortLabel(card.issuer_name);
    const theme = resolveCreditCardPlasticTheme(card.issuer_name, cardIndex);

    const installmentsRemaining = sumInstallmentsRemainingForCard(
      card.id,
      snapshot.creditCardInstallments
    );
    const totalBalanceDop =
      Math.round((card.current_balance + installmentsRemaining) * 100) / 100;
    const totalBalanceUsd = card.current_balance_usd ?? 0;

    const cardInstallments = snapshot.creditCardInstallments
      .filter(
        (installment) =>
          installment.credit_card_id === card.id &&
          installment.status === "active"
      )
      .map((installment) => ({
        id: installment.id,
        description: installment.description?.trim() || "Compra a cuotas",
        monthlyPayment: installment.monthly_payment,
        amountOwed: installment.remaining_balance,
        termMonths: installment.term_months,
      }));

    cards.push({
      id: card.id,
      alias,
      issuerName: card.issuer_name,
      issuerLabel,
      cardholderName: displayName,
      totalBalanceDop,
      totalBalanceUsd,
      statementBalanceDop: card.statement_balance,
      statementBalanceUsd: card.statement_balance_usd,
      totalPaymentDop,
      revolvingDop,
      installmentsDop,
      currencyMode: (card.currency_mode ?? "dop_only") as CreditCardCurrencyMode,
      usdSubtext: formatUsdSubtext(card, usdToDopRate),
      dueStatus: buildCommitmentDueStatus(card.payment_due_day, referenceDate),
      themeKey: card.issuer_name,
      patternIndex: cardIndex % 3,
      gradientClass: theme.gradientClass,
      patternClass: theme.patternClass,
      installments: cardInstallments,
      creditLimitDop: card.credit_limit,
      creditLimitUsd: card.credit_limit_usd,
      statementCloseDay: card.statement_close_day,
      annualRate: card.annual_rate,
    });

    cardIndex += 1;
  }

  const fixedTotal = fixed.reduce((sum, item) => sum + item.amount, 0);
  const loansTotal = loans.reduce((sum, item) => sum + item.amount, 0);
  const cardsTotal = cards.reduce((sum, item) => sum + item.totalPaymentDop, 0);

  const sortedFixed = sortByDueDay(fixed);
  const sortedLoans = sortByDueDay(loans);
  const sortedCards = sortByDueDay(cards);

  const hasAny =
    sortedFixed.length > 0 || sortedLoans.length > 0 || sortedCards.length > 0;

  return {
    monthLabel: formatMonthLabel(referenceDate),
    totals: {
      fixed: Math.round(fixedTotal * 100) / 100,
      loans: Math.round(loansTotal * 100) / 100,
      cards: Math.round(cardsTotal * 100) / 100,
      all: Math.round((fixedTotal + loansTotal + cardsTotal) * 100) / 100,
    },
    fixed: sortedFixed,
    loans: sortedLoans,
    cards: sortedCards,
    hasAny,
  };
}
