import type { NotificationPreferences } from "@/modules/notifications/types/notification.types";
import { createAdminClient } from "@/src/lib/admin";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailEnabled: true,
  pushEnabled: true,
  minAmountDop: 0,
};

export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("user_notification_preferences")
    .select("email_enabled, push_enabled, min_amount_dop")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_PREFERENCES;
  }

  return {
    emailEnabled: data.email_enabled,
    pushEnabled: data.push_enabled,
    minAmountDop: Number(data.min_amount_dop),
  };
}
