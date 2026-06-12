"use server";

import type { NotificationPreferences } from "@/modules/notifications/types/notification.types";
import { createClient } from "@/src/lib/server";

export async function getNotificationPreferencesAction(): Promise<
  NotificationPreferences & { error?: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      emailEnabled: true,
      pushEnabled: true,
      minAmountDop: 0,
      error: "Not authenticated",
    };
  }

  const { data, error } = await supabase
    .from("user_notification_preferences")
    .select("email_enabled, push_enabled, min_amount_dop")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      emailEnabled: true,
      pushEnabled: true,
      minAmountDop: 0,
      error: error.message,
    };
  }

  if (!data) {
    return {
      emailEnabled: true,
      pushEnabled: true,
      minAmountDop: 0,
    };
  }

  return {
    emailEnabled: data.email_enabled,
    pushEnabled: data.push_enabled,
    minAmountDop: Number(data.min_amount_dop),
  };
}

export async function saveNotificationPreferencesAction(
  preferences: NotificationPreferences
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("user_notification_preferences").upsert(
    {
      user_id: user.id,
      email_enabled: preferences.emailEnabled,
      push_enabled: preferences.pushEnabled,
      min_amount_dop: preferences.minAmountDop,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
