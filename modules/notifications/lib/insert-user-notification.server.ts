import type {
  GenericNotificationPayload,
  ObligationNotificationType,
} from "@/modules/notifications/types/notification.types";
import { createAdminClient } from "@/src/lib/admin";

export async function insertUserNotification(
  userId: string,
  type: ObligationNotificationType,
  payload: GenericNotificationPayload
): Promise<void> {
  const admin = createAdminClient();

  if (type === "gmail_connected_enable_tracking") {
    const { data: existing } = await admin
      .from("user_notifications")
      .select("id")
      .eq("user_id", userId)
      .eq("type", type)
      .limit(1);

    if (existing && existing.length > 0) return;
  } else if (payload.referenceKey) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const { data: recent } = await admin
      .from("user_notifications")
      .select("id, payload")
      .eq("user_id", userId)
      .eq("type", type)
      .gte("created_at", since.toISOString());

    const duplicate = (recent ?? []).some((row) => {
      if (!row.payload || typeof row.payload !== "object") return false;
      return (
        (row.payload as { referenceKey?: string }).referenceKey ===
        payload.referenceKey
      );
    });

    if (duplicate) return;
  }

  await admin.from("user_notifications").insert({
    user_id: userId,
    type,
    payload,
  });
}
