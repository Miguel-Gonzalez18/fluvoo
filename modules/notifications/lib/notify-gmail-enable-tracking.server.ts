import { insertUserNotification } from "@/modules/notifications/lib/insert-user-notification.server";
import { createAdminClient } from "@/src/lib/admin";

export async function notifyGmailEnableCardTracking(
  userId: string
): Promise<void> {
  const admin = createAdminClient();

  const { count } = await admin
    .from("credit_cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("tracking_enabled", true);

  if ((count ?? 0) > 0) return;

  await insertUserNotification(userId, "gmail_connected_enable_tracking", {
    title: "Gmail conectado",
    body: "Ya detectamos transacciones generales. Activa el seguimiento por tarjeta en Transacciones para registrar consumos automáticamente.",
    deepLink: "/employee/transactions",
  });
}
