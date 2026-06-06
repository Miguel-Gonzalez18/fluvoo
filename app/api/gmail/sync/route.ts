import { NextResponse } from "next/server";
import { syncGmailTransactions } from "@/modules/gmail/lib/sync-gmail.server";
import { createClient } from "@/src/lib/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const result = await syncGmailTransactions(user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
