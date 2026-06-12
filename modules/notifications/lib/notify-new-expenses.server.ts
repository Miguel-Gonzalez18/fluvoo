import { buildExpenseNotificationPayload } from "@/modules/notifications/lib/build-expense-notification-payload.server";
import { getNotificationPreferences } from "@/modules/notifications/lib/get-notification-preferences.server";
import { sendExpenseEmail } from "@/modules/notifications/lib/send-expense-email.server";
import { sendExpensePush } from "@/modules/notifications/lib/send-expense-push.server";
import type { NotifyNewExpensesResult } from "@/modules/notifications/types/notification.types";
import { createAdminClient } from "@/src/lib/admin";

function passesMinAmountFilter(
  transactionIds: string[],
  minAmountDop: number,
  amountsById: Map<string, number>
): boolean {
  if (minAmountDop <= 0) return true;

  return transactionIds.some((id) => {
    const amount = amountsById.get(id) ?? 0;
    return amount >= minAmountDop;
  });
}

export async function notifyNewExpenses(
  userId: string,
  transactionIds: string[]
): Promise<NotifyNewExpensesResult> {
  if (transactionIds.length === 0) {
    return { notified: false, emailSent: false, pushSent: false, skippedReason: "no_transactions" };
  }

  const preferences = await getNotificationPreferences(userId);
  const admin = createAdminClient();

  const { data: transactions } = await admin
    .from("transactions")
    .select("id, amount")
    .eq("user_id", userId)
    .in("id", transactionIds);

  const amountsById = new Map(
    (transactions ?? []).map((row) => [row.id, Number(row.amount)])
  );

  if (!passesMinAmountFilter(transactionIds, preferences.minAmountDop, amountsById)) {
    return {
      notified: false,
      emailSent: false,
      pushSent: false,
      skippedReason: "below_min_amount",
    };
  }

  const payload = await buildExpenseNotificationPayload(userId, transactionIds);
  if (!payload) {
    return {
      notified: false,
      emailSent: false,
      pushSent: false,
      skippedReason: "payload_unavailable",
    };
  }

  let emailSent = false;
  let pushSent = false;

  if (preferences.emailEnabled) {
    emailSent = await sendExpenseEmail(payload);
  }

  if (preferences.pushEnabled) {
    pushSent = await sendExpensePush(userId, payload);
  }

  const notified = emailSent || pushSent;

  if (notified) {
    const now = new Date().toISOString();
    await admin.from("user_notifications").insert({
      user_id: userId,
      type: "expense_detected",
      payload,
      email_sent_at: emailSent ? now : null,
      push_sent_at: pushSent ? now : null,
    });
  }

  return { notified, emailSent, pushSent };
}
