import { getEmployeeDisplayName } from "@/modules/dashboard/employee/lib/getEmployeeDisplayName.server";
import type { GmailStatus } from "@/modules/dashboard/employee/types/dashboard.types";
import {
  EMPTY_GMAIL_STATUS,
  getGmailStatus,
} from "@/modules/gmail/lib/get-gmail-status.server";
import { createClient } from "@/src/lib/server";

export interface EmployeeLayoutData {
  displayName: string;
  gmailStatus: GmailStatus;
}

export async function getEmployeeLayoutData(): Promise<EmployeeLayoutData> {
  const displayName = await getEmployeeDisplayName();

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { displayName, gmailStatus: EMPTY_GMAIL_STATUS };
    }

    const { data: profile } = await supabase
      .from("users")
      .select("gmail_connected")
      .eq("id", user.id)
      .maybeSingle();

    const gmailStatus = await getGmailStatus(
      user.id,
      profile?.gmail_connected ?? null
    );

    return { displayName, gmailStatus };
  } catch {
    return { displayName, gmailStatus: EMPTY_GMAIL_STATUS };
  }
}
