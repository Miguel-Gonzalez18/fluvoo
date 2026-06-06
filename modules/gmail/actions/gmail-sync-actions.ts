"use server";

import { syncGmailTransactions } from "@/modules/gmail/lib/sync-gmail.server";
import type { GmailSyncResult } from "@/modules/gmail/types/sync.types";
import { createClient } from "@/src/lib/server";

export async function triggerGmailSync(): Promise<GmailSyncResult & { error?: string }> {
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

  return syncGmailTransactions(user.id);
}
