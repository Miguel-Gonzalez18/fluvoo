"use server";

import { randomBytes } from "crypto";
import { createClient } from "@/src/lib/server";
import { OnboardingData } from "@/modules/onboarding/types/onboarding";
import { buildGoogleAuthUrl } from "@/modules/shared/google/oauth.server";
import { setGmailOAuthState } from "@/modules/shared/google/oauth-state.server";
import { saveOnboardingData } from "@/modules/onboarding/actions/onboarding-actions";

function createOAuthState(): string {
  return randomBytes(32).toString("hex");
}

export async function connectGmail(data: OnboardingData): Promise<{
  success: boolean;
  error?: string;
  authUrl?: string;
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

    const saveResult = await saveOnboardingData(data);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error || "Failed to save onboarding data" };
    }

    const state = createOAuthState();
    await setGmailOAuthState(state);

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
