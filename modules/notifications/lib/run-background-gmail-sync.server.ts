import { notifyNewExpenses } from "@/modules/notifications/lib/notify-new-expenses.server";
import { syncGmailTransactions } from "@/modules/gmail/lib/sync-gmail.server";
import { createAdminClient } from "@/src/lib/admin";

const INCREMENTAL_LOOKBACK_DAYS = 10;
const INCREMENTAL_MAX_MESSAGES = 200;

export interface BackgroundGmailSyncSummary {
  users: number;
  synced: number;
  notified: number;
  errors: string[];
}

export async function runBackgroundGmailSync(): Promise<BackgroundGmailSyncSummary> {
  const admin = createAdminClient();
  const summary: BackgroundGmailSyncSummary = {
    users: 0,
    synced: 0,
    notified: 0,
    errors: [],
  };

  const { data: users, error } = await admin
    .from("users")
    .select("id")
    .eq("gmail_connected", true)
    .eq("onboarding_completed", true);

  if (error) {
    summary.errors.push(error.message);
    return summary;
  }

  if (!users?.length) {
    return summary;
  }

  summary.users = users.length;

  for (const user of users) {
    try {
      const { data: connection } = await admin
        .from("gmail_connections")
        .select("sync_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (connection?.sync_status === "syncing") {
        continue;
      }

      const result = await syncGmailTransactions(user.id, {
        lookbackDays: INCREMENTAL_LOOKBACK_DAYS,
        maxMessages: INCREMENTAL_MAX_MESSAGES,
      });

      if (!result.success) {
        if (result.error) {
          summary.errors.push(`${user.id}: ${result.error}`);
        }
        continue;
      }

      summary.synced += 1;

      if (result.imported > 0 && result.importedTransactionIds.length > 0) {
        const notifyResult = await notifyNewExpenses(
          user.id,
          result.importedTransactionIds
        );

        if (notifyResult.notified) {
          summary.notified += 1;
        }
      }
    } catch (syncError) {
      const message =
        syncError instanceof Error ? syncError.message : "Unknown sync error";
      summary.errors.push(`${user.id}: ${message}`);
    }
  }

  return summary;
}
