import type {
  ExpenseNotificationPayload,
  GenericNotificationPayload,
  ObligationNotificationType,
  UserNotificationItem,
  UserNotificationsInbox,
} from "@/modules/notifications/types/notification.types";
import { createClient } from "@/src/lib/server";

const INBOX_LIMIT = 20;

const OBLIGATION_TYPES = new Set<string>([
  "loan_payment_due",
  "credit_card_payment_due",
  "credit_card_payment_upcoming",
  "credit_card_close_reminder",
  "credit_card_statement_reminder",
  "gmail_connected_enable_tracking",
]);

function parseExpensePayload(raw: unknown): ExpenseNotificationPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const payload = raw as Partial<ExpenseNotificationPayload>;
  if (!Array.isArray(payload.newExpenses)) return null;

  return {
    newExpenses: payload.newExpenses.map((expense) => ({
      merchant: String(expense.merchant ?? "Gasto"),
      amountDop: Number(expense.amountDop ?? 0),
      categoryLabel: String(expense.categoryLabel ?? "Otros"),
      date: String(expense.date ?? ""),
    })),
    aiDiagnosis: String(payload.aiDiagnosis ?? ""),
    aiTopTip: payload.aiTopTip ?? null,
    monthlyExpenses: Number(payload.monthlyExpenses ?? 0),
    marginMonthly: Number(payload.marginMonthly ?? 0),
    marginPercent:
      payload.marginPercent === null || payload.marginPercent === undefined
        ? null
        : Number(payload.marginPercent),
    marginStatus: String(payload.marginStatus ?? ""),
    deepLink: String(payload.deepLink ?? "/employee"),
    recipientEmail: String(payload.recipientEmail ?? ""),
    recipientName: payload.recipientName ?? null,
  };
}

function parseGenericPayload(raw: unknown): GenericNotificationPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const payload = raw as Partial<GenericNotificationPayload>;
  if (!payload.title || !payload.body) return null;

  return {
    title: String(payload.title),
    body: String(payload.body),
    deepLink: String(payload.deepLink ?? "/employee/transactions"),
    referenceKey: payload.referenceKey
      ? String(payload.referenceKey)
      : undefined,
  };
}

export async function getUserNotificationsInbox(
  userId: string
): Promise<UserNotificationsInbox> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_notifications")
    .select("id, type, payload, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(INBOX_LIMIT);

  if (error || !data) {
    return { notifications: [], unreadCount: 0 };
  }

  const notifications: UserNotificationItem[] = [];

  for (const row of data) {
    if (row.type === "expense_detected") {
      const payload = parseExpensePayload(row.payload);
      if (!payload) continue;

      notifications.push({
        id: row.id,
        type: "expense_detected",
        payload,
        readAt: row.read_at,
        createdAt: row.created_at,
      });
      continue;
    }

    if (OBLIGATION_TYPES.has(row.type)) {
      const payload = parseGenericPayload(row.payload);
      if (!payload) continue;

      notifications.push({
        id: row.id,
        type: row.type as ObligationNotificationType,
        payload,
        readAt: row.read_at,
        createdAt: row.created_at,
      });
    }
  }

  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return { notifications, unreadCount };
}
