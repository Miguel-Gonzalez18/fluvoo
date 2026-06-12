"use server";

import { getUserNotificationsInbox } from "@/modules/notifications/lib/get-user-notifications.server";
import type { UserNotificationsInbox } from "@/modules/notifications/types/notification.types";
import { createClient } from "@/src/lib/server";

export async function getNotificationsInboxAction(): Promise<
  UserNotificationsInbox & { error?: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { notifications: [], unreadCount: 0, error: "Not authenticated" };
  }

  return getUserNotificationsInbox(user.id);
}

export async function markNotificationReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", user.id)
    .is("read_at", null);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
