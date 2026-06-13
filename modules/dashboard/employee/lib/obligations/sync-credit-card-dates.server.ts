import {
  resolveRollingCreditCardDates,
  type RollingCreditCardDates,
} from "@/modules/dashboard/employee/lib/credit-card-dates";
import { createAdminClient } from "@/src/lib/admin";

interface CreditCardDateRow {
  id: string;
  next_statement_close_date: string | null;
  next_payment_due_date: string | null;
}

export async function syncCreditCardDatesForUser(
  userId: string,
  referenceDate: Date = new Date()
): Promise<void> {
  const admin = createAdminClient();

  const { data: cards, error } = await admin
    .from("credit_cards")
    .select("id, next_statement_close_date, next_payment_due_date")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error || !cards?.length) return;

  for (const card of cards as CreditCardDateRow[]) {
    const updates = buildDateUpdates(card, referenceDate);
    if (!updates) continue;

    await admin
      .from("credit_cards")
      .update({
        next_statement_close_date: updates.nextStatementCloseDate,
        next_payment_due_date: updates.nextPaymentDueDate,
      })
      .eq("id", card.id);
  }
}

function buildDateUpdates(
  card: CreditCardDateRow,
  referenceDate: Date
): Partial<RollingCreditCardDates> | null {
  if (!card.next_statement_close_date || !card.next_payment_due_date) {
    return null;
  }

  const resolved = resolveRollingCreditCardDates(
    {
      nextStatementCloseDate: card.next_statement_close_date,
      nextPaymentDueDate: card.next_payment_due_date,
    },
    referenceDate
  );

  if (
    resolved.nextStatementCloseDate === card.next_statement_close_date &&
    resolved.nextPaymentDueDate === card.next_payment_due_date
  ) {
    return null;
  }

  return {
    nextStatementCloseDate: resolved.nextStatementCloseDate,
    nextPaymentDueDate: resolved.nextPaymentDueDate,
  };
}

export function mapDbCreditCardDates(row: {
  next_statement_close_date?: string | null;
  next_payment_due_date?: string | null;
}): RollingCreditCardDates | null {
  if (row.next_statement_close_date && row.next_payment_due_date) {
    return {
      nextStatementCloseDate: row.next_statement_close_date,
      nextPaymentDueDate: row.next_payment_due_date,
    };
  }
  return null;
}
