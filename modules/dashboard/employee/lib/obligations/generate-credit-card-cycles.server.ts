import { createAdminClient } from "@/src/lib/admin";
import type { PaymentCycleStatus } from "@/modules/dashboard/employee/lib/obligations/payment-cycle.types";
import { getTodayYmdInSantoDomingo } from "@/modules/dashboard/employee/lib/obligations/generate-loan-cycles.server";
import { buildCardPaymentDueDates } from "@/modules/dashboard/employee/lib/credit-card-dates";

interface CreditCardRow {
  id: string;
  next_payment_due_date: string;
  minimum_payment: number;
  status: string;
}

function resolveCycleStatus(dueDate: string, todayYmd: string): PaymentCycleStatus {
  if (dueDate > todayYmd) return "projected";
  return "pending";
}

export async function ensureCreditCardPaymentCycles(
  userId: string,
  cards: CreditCardRow[],
  expectedAmountByCardId: Map<string, number>,
  referenceDate: Date = new Date()
): Promise<void> {
  const admin = createAdminClient();
  const todayYmd = getTodayYmdInSantoDomingo(referenceDate);

  for (const card of cards) {
    if (card.status !== "active") continue;

    const dueDates = buildCardPaymentDueDates(
      card.next_payment_due_date,
      referenceDate
    );
    const expectedAmount =
      expectedAmountByCardId.get(card.id) ?? card.minimum_payment;

    for (const dueDate of dueDates) {
      const { data: existing } = await admin
        .from("credit_card_payment_cycles")
        .select("id, status")
        .eq("credit_card_id", card.id)
        .eq("due_date", dueDate)
        .maybeSingle();

      if (existing) {
        if (
          existing.status === "projected" &&
          resolveCycleStatus(dueDate, todayYmd) === "pending"
        ) {
          await admin
            .from("credit_card_payment_cycles")
            .update({ status: "pending", expected_amount: expectedAmount })
            .eq("id", existing.id);
        }
        continue;
      }

      await admin.from("credit_card_payment_cycles").insert({
        credit_card_id: card.id,
        user_id: userId,
        due_date: dueDate,
        expected_amount: expectedAmount,
        status: resolveCycleStatus(dueDate, todayYmd),
      });
    }
  }
}

export async function loadCreditCardPaymentCyclesByCardIds(
  cardIds: string[]
): Promise<
  Map<
    string,
    Array<{
      id: string;
      due_date: string;
      expected_amount: number;
      status: PaymentCycleStatus;
      confirmed_at: string | null;
    }>
  >
> {
  const result = new Map<
    string,
    Array<{
      id: string;
      due_date: string;
      expected_amount: number;
      status: PaymentCycleStatus;
      confirmed_at: string | null;
    }>
  >();

  if (cardIds.length === 0) return result;

  const admin = createAdminClient();
  const { data } = await admin
    .from("credit_card_payment_cycles")
    .select("id, credit_card_id, due_date, expected_amount, status, confirmed_at")
    .in("credit_card_id", cardIds)
    .order("due_date", { ascending: true });

  for (const row of data ?? []) {
    const list = result.get(row.credit_card_id) ?? [];
    list.push({
      id: row.id,
      due_date: row.due_date,
      expected_amount: Number(row.expected_amount),
      status: row.status as PaymentCycleStatus,
      confirmed_at: row.confirmed_at,
    });
    result.set(row.credit_card_id, list);
  }

  return result;
}
