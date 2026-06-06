import type {
  GmailStatus,
  GmailSyncStatus,
} from "@/modules/dashboard/employee/types/dashboard.types";
import { createAdminClient } from "@/src/lib/admin";

export const EMPTY_GMAIL_STATUS: GmailStatus = {
  connected: false,
  googleEmail: null,
  syncStatus: null,
  lastSyncAt: null,
  syncError: null,
};

const GMAIL_SYNC_STATUSES = new Set<GmailSyncStatus>([
  "pending",
  "syncing",
  "active",
  "error",
]);

function parseGmailSyncStatus(
  value: string | null | undefined
): GmailSyncStatus | null {
  if (!value || !GMAIL_SYNC_STATUSES.has(value as GmailSyncStatus)) {
    return null;
  }

  return value as GmailSyncStatus;
}

export async function getGmailStatus(
  userId: string,
  gmailConnected: boolean | null
): Promise<GmailStatus> {
  if (!gmailConnected) {
    return EMPTY_GMAIL_STATUS;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("gmail_connections")
      .select("google_email, sync_status, last_sync_at, sync_error")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return {
        connected: true,
        googleEmail: null,
        syncStatus: null,
        lastSyncAt: null,
        syncError: null,
      };
    }

    return {
      connected: true,
      googleEmail: data.google_email,
      syncStatus: parseGmailSyncStatus(data.sync_status),
      lastSyncAt: data.last_sync_at,
      syncError: data.sync_error,
    };
  } catch {
    return {
      connected: Boolean(gmailConnected),
      googleEmail: null,
      syncStatus: null,
      lastSyncAt: null,
      syncError: null,
    };
  }
}
