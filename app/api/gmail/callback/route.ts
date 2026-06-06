import { NextRequest, NextResponse } from "next/server";
import { handleGmailOAuthCallback } from "@/modules/onboarding/actions/gmail-callback.server";
import { consumeGmailOAuthReturnTo } from "@/modules/shared/google/oauth-state.server";

function buildGmailRedirect(
  request: NextRequest,
  returnTo: string,
  params: Record<string, string>
): NextResponse {
  const redirectUrl = new URL(returnTo, request.url);

  for (const [key, value] of Object.entries(params)) {
    redirectUrl.searchParams.set(key, value);
  }

  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError) {
    const returnTo = await consumeGmailOAuthReturnTo();
    return buildGmailRedirect(request, returnTo, {
      gmail: "error",
      message: oauthError,
    });
  }

  if (!code || !state) {
    const returnTo = await consumeGmailOAuthReturnTo();
    return buildGmailRedirect(request, returnTo, {
      gmail: "error",
      message: "missing_code",
    });
  }

  const returnTo = await consumeGmailOAuthReturnTo();
  const result = await handleGmailOAuthCallback(code, state);

  if (!result.success) {
    return buildGmailRedirect(request, returnTo, {
      gmail: "error",
      message: result.error || "unknown",
    });
  }

  const params: Record<string, string> = { gmail: "connected" };

  if (result.sync && !result.sync.success) {
    params.sync = "error";
    params.syncMessage = result.sync.error || "Gmail sync failed";
  } else if (result.sync?.imported) {
    params.imported = String(result.sync.imported);
  }

  return buildGmailRedirect(request, returnTo, params);
}
