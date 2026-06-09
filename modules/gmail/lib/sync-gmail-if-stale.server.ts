import { syncGmailTransactions } from "@/modules/gmail/lib/sync-gmail.server";
import { createAdminClient } from "@/src/lib/admin";

const STALE_SYNC_MS = 5 * 60 * 1000;
const INCREMENTAL_LOOKBACK_DAYS = 10;
const INCREMENTAL_MAX_MESSAGES = 200;

/**
 * Pulls recent bank emails when the dashboard loads so today's
 * transactions are available without a manual sync.
 */
export async function syncGmailIfStale(
  userId: string,
  gmailConnected: boolean | null | undefined
): Promise<void> {
  if (!gmailConnected) return;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("gmail_connections")
    .select("last_sync_at, sync_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return;
  if (data.sync_status === "syncing") return;

  const lastSyncMs = data.last_sync_at
    ? new Date(data.last_sync_at).getTime()
    : 0;

  if (Date.now() - lastSyncMs < STALE_SYNC_MS) return;

  try {
    await syncGmailTransactions(userId, {
      lookbackDays: INCREMENTAL_LOOKBACK_DAYS,
      maxMessages: INCREMENTAL_MAX_MESSAGES,
    });
  } catch {
    // Dashboard should still render with the last successful sync snapshot.
  }
}
