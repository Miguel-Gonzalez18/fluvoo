import { createClient } from "@/src/lib/server";
import { MOCK_DISPLAY_NAME } from "@/modules/dashboard/employee/config/dashboardMock";
import { getFirstName } from "@/modules/dashboard/employee/lib/formatDate";

export async function getEmployeeDisplayName(): Promise<string> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return MOCK_DISPLAY_NAME;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const fullName =
      profile?.full_name ??
      (typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null);

    if (!fullName) {
      return MOCK_DISPLAY_NAME;
    }

    return getFirstName(fullName);
  } catch {
    return MOCK_DISPLAY_NAME;
  }
}
