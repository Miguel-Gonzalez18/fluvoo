import type { PaymentCycleItem } from "@/modules/dashboard/employee/lib/obligations/payment-cycle.types";
import {
  ensureCreditCardPaymentCycles,
  loadCreditCardPaymentCyclesByCardIds,
} from "@/modules/dashboard/employee/lib/obligations/generate-credit-card-cycles.server";
import {
  ensureLoanPaymentCycles,
  loadLoanPaymentCyclesByLoanIds,
  syncLoanCycleStatuses,
} from "@/modules/dashboard/employee/lib/obligations/generate-loan-cycles.server";
import { mapDbCycleToItem } from "@/modules/dashboard/employee/lib/obligations/map-payment-cycles";
import { resolveCardPaymentTotalInDop } from "@/modules/dashboard/employee/lib/resolve-card-payment-total";
import type { FinancialObligationsSnapshot } from "@/modules/dashboard/employee/lib/financial-obligations.types";

export async function syncAndLoadPaymentCycles(
  userId: string,
  snapshot: FinancialObligationsSnapshot,
  usdToDopRate: number,
  referenceDate: Date = new Date()
): Promise<{
  loanCyclesById: Map<string, PaymentCycleItem[]>;
  cardCyclesById: Map<string, PaymentCycleItem[]>;
}> {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  await ensureLoanPaymentCycles(userId, snapshot.loans, referenceDate);
  await syncLoanCycleStatuses(userId, referenceDate);

  const expectedAmountByCardId = new Map<string, number>();
  for (const card of snapshot.creditCards) {
    expectedAmountByCardId.set(
      card.id,
      resolveCardPaymentTotalInDop(
        card,
        snapshot.creditCardInstallments,
        usdToDopRate,
        year,
        month
      )
    );
  }

  await ensureCreditCardPaymentCycles(
    userId,
    snapshot.creditCards,
    expectedAmountByCardId,
    referenceDate
  );

  const loanIds = snapshot.loans.map((l) => l.id);
  const cardIds = snapshot.creditCards.map((c) => c.id);

  const [loanRaw, cardRaw] = await Promise.all([
    loadLoanPaymentCyclesByLoanIds(loanIds),
    loadCreditCardPaymentCyclesByCardIds(cardIds),
  ]);

  const loanCyclesById = new Map<string, PaymentCycleItem[]>();
  for (const [loanId, rows] of loanRaw.entries()) {
    loanCyclesById.set(loanId, rows.map(mapDbCycleToItem));
  }

  const cardCyclesById = new Map<string, PaymentCycleItem[]>();
  for (const [cardId, rows] of cardRaw.entries()) {
    cardCyclesById.set(cardId, rows.map(mapDbCycleToItem));
  }

  return { loanCyclesById, cardCyclesById };
}
