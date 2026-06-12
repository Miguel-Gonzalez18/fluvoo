import webpush from "web-push";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { ExpenseNotificationPayload } from "@/modules/notifications/types/notification.types";
import { createAdminClient } from "@/src/lib/admin";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function buildPushContent(payload: ExpenseNotificationPayload): {
  title: string;
  body: string;
} {
  const primary = payload.newExpenses[0];

  if (payload.newExpenses.length === 1) {
    return {
      title: `Nuevo gasto: ${primary.merchant}`,
      body: truncate(
        `${formatDOP(primary.amountDop)} · Gastos mes ${formatDOP(payload.monthlyExpenses)} · Margen ${formatDOP(payload.marginMonthly)}. ${payload.aiDiagnosis}`,
        180
      ),
    };
  }

  return {
    title: `${payload.newExpenses.length} gastos nuevos`,
    body: truncate(
      `${formatDOP(primary.amountDop)} y más · Gastos mes ${formatDOP(payload.monthlyExpenses)} · Margen ${formatDOP(payload.marginMonthly)}. ${payload.aiDiagnosis}`,
      180
    ),
  };
}

function configureWebPush(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function sendExpensePush(
  userId: string,
  payload: ExpenseNotificationPayload
): Promise<boolean> {
  if (!configureWebPush()) {
    console.warn("[sendExpensePush] VAPID keys not configured");
    return false;
  }

  const admin = createAdminClient();
  const { data: subscriptions, error } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (error || !subscriptions?.length) {
    return false;
  }

  const { title, body } = buildPushContent(payload);
  const pushPayload = JSON.stringify({
    title,
    body,
    url: payload.deepLink,
  });

  let sent = false;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          pushPayload
        );
        sent = true;
      } catch (pushError) {
        const statusCode =
          pushError &&
          typeof pushError === "object" &&
          "statusCode" in pushError
            ? Number(pushError.statusCode)
            : null;

        if (statusCode === 404 || statusCode === 410) {
          await admin
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", subscription.endpoint);
        }

        console.error("[sendExpensePush] Failed for endpoint:", pushError);
      }
    })
  );

  return sent;
}
