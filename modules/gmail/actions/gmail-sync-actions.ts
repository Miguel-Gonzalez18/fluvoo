"use server";

import { syncGmailTransactions } from "@/modules/gmail/lib/sync-gmail.server";
import type { GmailSyncResult } from "@/modules/gmail/types/sync.types";
import { createClient } from "@/src/lib/server";

interface TriggerGmailSyncOptions {
  fullResync?: boolean;
}

export async function triggerGmailSync(
  options?: TriggerGmailSyncOptions
): Promise<GmailSyncResult & { error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      processed: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
      error: "Not authenticated",
    };
  }

  return syncGmailTransactions(user.id, {
    purgeExisting: options?.fullResync ?? false,
  });
}
