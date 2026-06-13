import { insertUserNotification } from "@/modules/notifications/lib/insert-user-notification.server";
import { runCreditCardScheduledReminders } from "@/modules/dashboard/employee/lib/obligations/credit-card-scheduled-reminders.server";
import { getTodayYmdInSantoDomingo } from "@/modules/dashboard/employee/lib/obligations/generate-loan-cycles.server";
import { createAdminClient } from "@/src/lib/admin";

export interface PaymentRemindersSummary {
  users: number;
  loanDue: number;
  cardDue: number;
  statementReminders: number;
  cardCloseReminders: number;
  cardPaymentUpcoming: number;
}

const STATEMENT_GRACE_DAYS = 3;

function addDaysYmd(dateYmd: string, days: number): string {
  const date = new Date(`${dateYmd}T12:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function runPaymentReminders(): Promise<PaymentRemindersSummary> {
  const admin = createAdminClient();
  const summary: PaymentRemindersSummary = {
    users: 0,
    loanDue: 0,
    cardDue: 0,
    statementReminders: 0,
    cardCloseReminders: 0,
    cardPaymentUpcoming: 0,
  };

  const todayYmd = getTodayYmdInSantoDomingo();

  const { data: users } = await admin
    .from("users")
    .select("id")
    .eq("onboarding_completed", true);

  if (!users?.length) return summary;

  summary.users = users.length;

  for (const user of users) {
    const { data: loanCycles } = await admin
      .from("loan_payment_cycles")
      .select("id, due_date, expected_amount, loans(loan_alias)")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lte("due_date", todayYmd);

    for (const cycle of loanCycles ?? []) {
      const loan = Array.isArray(cycle.loans) ? cycle.loans[0] : cycle.loans;
      const alias =
        (loan as { loan_alias?: string } | null)?.loan_alias ?? "Préstamo";

      await insertUserNotification(user.id, "loan_payment_due", {
        title: `Cuota de ${alias}`,
        body: `¿Ya pagaste tu cuota de RD$ ${Number(cycle.expected_amount).toLocaleString("es-DO")}? Confírmala en Transacciones.`,
        deepLink: "/employee/transactions",
        referenceKey: `loan-cycle:${cycle.id}`,
      });
      summary.loanDue += 1;
    }

    const { data: cardCycles } = await admin
      .from("credit_card_payment_cycles")
      .select(
        "id, due_date, expected_amount, credit_cards(card_label, issuer_name)"
      )
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lte("due_date", todayYmd);

    for (const cycle of cardCycles ?? []) {
      const card = Array.isArray(cycle.credit_cards)
        ? cycle.credit_cards[0]
        : cycle.credit_cards;
      const label =
        (card as { card_label?: string | null } | null)?.card_label?.trim() ||
        (card as { issuer_name?: string } | null)?.issuer_name ||
        "Tarjeta";

      await insertUserNotification(user.id, "credit_card_payment_due", {
        title: `Pago de ${label}`,
        body: `¿Ya pagaste tu tarjeta? Confirma el pago en Transacciones.`,
        deepLink: "/employee/transactions",
        referenceKey: `card-cycle:${cycle.id}`,
      });
      summary.cardDue += 1;
    }

    const { data: trackedCards } = await admin
      .from("credit_cards")
      .select(
        "id, card_label, issuer_name, next_statement_close_date, last_statement_upload_at"
      )
      .eq("user_id", user.id)
      .eq("tracking_enabled", true)
      .eq("status", "active");

    for (const card of trackedCards ?? []) {
      if (!card.next_statement_close_date) continue;

      const reminderAfterYmd = addDaysYmd(
        card.next_statement_close_date,
        STATEMENT_GRACE_DAYS
      );

      if (todayYmd < reminderAfterYmd) continue;

      if (card.last_statement_upload_at) {
        const uploadedYmd = getTodayYmdInSantoDomingo(
          new Date(card.last_statement_upload_at)
        );
        if (uploadedYmd >= card.next_statement_close_date) {
          continue;
        }
      }

      const label = card.card_label?.trim() || card.issuer_name;
      const monthKey = card.next_statement_close_date.slice(0, 7);

      await insertUserNotification(user.id, "credit_card_statement_reminder", {
        title: `Sube tu estado de cuenta`,
        body: `Actualiza ${label} con el PDF de tu estado de cuenta para mantener los saldos al día.`,
        deepLink: "/employee/transactions",
        referenceKey: `card-statement:${card.id}:${monthKey}`,
      });
      summary.statementReminders += 1;
    }

    const scheduled = await runCreditCardScheduledReminders(user.id, todayYmd);
    summary.cardCloseReminders += scheduled.closeReminders;
    summary.cardPaymentUpcoming += scheduled.paymentUpcoming;
  }

  return summary;
}
