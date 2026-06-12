import { NextResponse } from "next/server";
import { runBackgroundGmailSync } from "@/modules/notifications/lib/run-background-gmail-sync.server";

export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runBackgroundGmailSync();
  return NextResponse.json(summary);
}
