import { insertUserNotification } from "@/modules/notifications/lib/insert-user-notification.server";
import {
  daysBetweenYmd,
  formatCreditCardDateLabel,
  resolveRollingCreditCardDates,
} from "@/modules/dashboard/employee/lib/credit-card-dates";
import { createAdminClient } from "@/src/lib/admin";

export interface CreditCardScheduledRemindersSummary {
  closeReminders: number;
  paymentUpcoming: number;
}

interface ActiveCreditCardRow {
  id: string;
  card_label: string | null;
  issuer_name: string;
  next_statement_close_date: string;
  next_payment_due_date: string;
}

/** Días antes del corte para avisar (3 y 1). El día del corte usa offset 0. */
const CLOSE_REMINDER_OFFSETS = [3, 1, 0] as const;

/** Días antes del límite de pago para avisar. */
const PAYMENT_UPCOMING_OFFSETS = [7, 3, 1] as const;

function resolveCardLabel(card: ActiveCreditCardRow): string {
  return card.card_label?.trim() || card.issuer_name || "Tarjeta";
}

function daysUntil(fromYmd: string, toYmd: string): number {
  return daysBetweenYmd(fromYmd, toYmd);
}

async function isPaymentConfirmedForDueDate(
  cardId: string,
  dueDateYmd: string
): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("credit_card_payment_cycles")
    .select("id")
    .eq("credit_card_id", cardId)
    .eq("due_date", dueDateYmd)
    .eq("status", "confirmed")
    .maybeSingle();

  return Boolean(data);
}

function buildCloseReminderCopy(
  label: string,
  daysUntilClose: number,
  paymentDueYmd: string
): { title: string; body: string } {
  const dueLabel = formatCreditCardDateLabel(paymentDueYmd);

  if (daysUntilClose === 0) {
    return {
      title: `Corte hoy · ${label}`,
      body: `Hoy cierra tu ciclo de facturación. Revisa tu saldo y paga antes del ${dueLabel}.`,
    };
  }

  if (daysUntilClose === 1) {
    return {
      title: `Corte mañana · ${label}`,
      body: `Mañana es tu fecha de corte. Prepárate para pagar antes del ${dueLabel}.`,
    };
  }

  return {
    title: `Corte en ${daysUntilClose} días · ${label}`,
    body: `Tu fecha de corte es pronto. Tendrás hasta el ${dueLabel} para pagar sin mora.`,
  };
}

function buildPaymentUpcomingCopy(
  label: string,
  daysUntilDue: number,
  paymentDueYmd: string
): { title: string; body: string } {
  const dueLabel = formatCreditCardDateLabel(paymentDueYmd);

  if (daysUntilDue === 1) {
    return {
      title: `Pago mañana · ${label}`,
      body: `Mañana vence el límite de pago (${dueLabel}). Confírmalo en Transacciones cuando lo hagas.`,
    };
  }

  return {
    title: `Pago en ${daysUntilDue} días · ${label}`,
    body: `El límite de pago es el ${dueLabel}. Planifica tu pago antes de esa fecha.`,
  };
}

export async function runCreditCardScheduledReminders(
  userId: string,
  todayYmd: string
): Promise<CreditCardScheduledRemindersSummary> {
  const admin = createAdminClient();
  const summary: CreditCardScheduledRemindersSummary = {
    closeReminders: 0,
    paymentUpcoming: 0,
  };

  const { data: cards } = await admin
    .from("credit_cards")
    .select(
      "id, card_label, issuer_name, next_statement_close_date, next_payment_due_date"
    )
    .eq("user_id", userId)
    .eq("status", "active");

  if (!cards?.length) return summary;

  const referenceDate = new Date(`${todayYmd}T12:00:00`);

  for (const raw of cards as ActiveCreditCardRow[]) {
    if (!raw.next_statement_close_date || !raw.next_payment_due_date) continue;

    const { nextStatementCloseDate, nextPaymentDueDate } =
      resolveRollingCreditCardDates(
        {
          nextStatementCloseDate: raw.next_statement_close_date,
          nextPaymentDueDate: raw.next_payment_due_date,
        },
        referenceDate
      );

    const label = resolveCardLabel(raw);
    const untilClose = daysUntil(todayYmd, nextStatementCloseDate);
    const untilPayment = daysUntil(todayYmd, nextPaymentDueDate);

    if (
      CLOSE_REMINDER_OFFSETS.includes(
        untilClose as (typeof CLOSE_REMINDER_OFFSETS)[number]
      )
    ) {
      const copy = buildCloseReminderCopy(
        label,
        untilClose,
        nextPaymentDueDate
      );

      await insertUserNotification(userId, "credit_card_close_reminder", {
        title: copy.title,
        body: copy.body,
        deepLink: "/employee/transactions",
        referenceKey: `card-close:${raw.id}:${nextStatementCloseDate}:${untilClose}`,
      });
      summary.closeReminders += 1;
    }

    if (untilPayment <= 0) continue;

    if (
      await isPaymentConfirmedForDueDate(raw.id, nextPaymentDueDate)
    ) {
      continue;
    }

    if (
      !PAYMENT_UPCOMING_OFFSETS.includes(
        untilPayment as (typeof PAYMENT_UPCOMING_OFFSETS)[number]
      )
    ) {
      continue;
    }

    const copy = buildPaymentUpcomingCopy(
      label,
      untilPayment,
      nextPaymentDueDate
    );

    await insertUserNotification(userId, "credit_card_payment_upcoming", {
      title: copy.title,
      body: copy.body,
      deepLink: "/employee/transactions",
      referenceKey: `card-pay-upcoming:${raw.id}:${nextPaymentDueDate}:${untilPayment}`,
    });
    summary.paymentUpcoming += 1;
  }

  return summary;
}
