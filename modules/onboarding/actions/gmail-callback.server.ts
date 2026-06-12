import { createClient } from "@/src/lib/server";
import { createAdminClient } from "@/src/lib/admin";
import {
  exchangeCodeForTokens,
  resolveGoogleAccountEmail,
} from "@/modules/shared/google/oauth.server";
import { validateAndClearGmailOAuthState } from "@/modules/shared/google/oauth-state.server";
import { syncGmailTransactions } from "@/modules/gmail/lib/sync-gmail.server";
import type { GmailSyncResult } from "@/modules/gmail/types/sync.types";

export async function handleGmailOAuthCallback(
  code: string,
  state: string
): Promise<{ success: boolean; error?: string; sync?: GmailSyncResult }> {
  const isValidState = await validateAndClearGmailOAuthState(state);
  if (!isValidState) {
    return { success: false, error: "Invalid OAuth state" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const googleEmail = await resolveGoogleAccountEmail(tokens, user.email);
    const admin = createAdminClient();

    const { error: upsertError } = await admin.from("gmail_connections").upsert(
      {
        user_id: user.id,
        google_email: googleEmail,
        refresh_token: tokens.refreshToken,
        access_token: tokens.accessToken,
        token_expires_at: tokens.expiresAt.toISOString(),
        scopes: tokens.scopes,
        sync_status: "pending",
        sync_error: null,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    const { error: userError } = await supabase
      .from("users")
      .update({
        gmail_connected: true,
        onboarding_completed: true,
        onboarding_step: 3,
      })
      .eq("id", user.id);

    if (userError) {
      return { success: false, error: userError.message };
    }

    let sync: GmailSyncResult = {
      success: false,
      processed: 0,
      imported: 0,
      importedTransactionIds: [],
      skipped: 0,
      failed: 0,
    };

    try {
      sync = await syncGmailTransactions(user.id);
    } catch (syncError) {
      sync = {
        ...sync,
        error:
          syncError instanceof Error ? syncError.message : "Gmail sync failed after connect",
      };
    }

    return { success: true, sync };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect Gmail",
    };
  }
}
