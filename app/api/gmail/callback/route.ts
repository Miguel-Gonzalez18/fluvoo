import { NextRequest, NextResponse } from "next/server";
import { handleGmailOAuthCallback } from "@/modules/onboarding/actions/gmail-callback.server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/onboarding?gmail=error&message=${encodeURIComponent(oauthError)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/onboarding?gmail=error&message=missing_code", request.url)
    );
  }

  const result = await handleGmailOAuthCallback(code, state);

  if (!result.success) {
    return NextResponse.redirect(
      new URL(
        `/onboarding?gmail=error&message=${encodeURIComponent(result.error || "unknown")}`,
        request.url
      )
    );
  }

  const redirectUrl = new URL("/dashboard", request.url);
  redirectUrl.searchParams.set("gmail", "connected");

  if (result.sync && !result.sync.success) {
    redirectUrl.searchParams.set("sync", "error");
    redirectUrl.searchParams.set("syncMessage", result.sync.error || "Gmail sync failed");
  } else if (result.sync?.imported) {
    redirectUrl.searchParams.set("imported", String(result.sync.imported));
  }

  return NextResponse.redirect(redirectUrl);
}
