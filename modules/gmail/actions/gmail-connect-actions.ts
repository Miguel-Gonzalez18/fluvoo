"use server";

import { randomBytes } from "crypto";
import { buildGoogleAuthUrl } from "@/modules/shared/google/oauth.server";
import { setGmailOAuthState } from "@/modules/shared/google/oauth-state.server";
import { createClient } from "@/src/lib/server";

function createOAuthState(): string {
  return randomBytes(32).toString("hex");
}

export async function startGmailConnect(): Promise<{
  success: boolean;
  authUrl?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const state = createOAuthState();
    await setGmailOAuthState(state, "/employee/home");

    return {
      success: true,
      authUrl: buildGoogleAuthUrl(state),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start Gmail connection",
    };
  }
}
