import { cookies } from "next/headers";
import { GMAIL_OAUTH_STATE_COOKIE } from "@/modules/shared/google/constants";

export async function setGmailOAuthState(state: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GMAIL_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function validateAndClearGmailOAuthState(state: string): Promise<boolean> {
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GMAIL_OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(GMAIL_OAUTH_STATE_COOKIE);
  return Boolean(expectedState && expectedState === state);
}
