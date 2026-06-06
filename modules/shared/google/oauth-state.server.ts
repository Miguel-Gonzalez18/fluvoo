import { cookies } from "next/headers";
import {
  GMAIL_OAUTH_RETURN_COOKIE,
  GMAIL_OAUTH_STATE_COOKIE,
} from "@/modules/shared/google/constants";

const OAUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 10,
};

export async function setGmailOAuthState(
  state: string,
  returnTo?: string
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GMAIL_OAUTH_STATE_COOKIE, state, OAUTH_COOKIE_OPTIONS);

  if (returnTo) {
    cookieStore.set(GMAIL_OAUTH_RETURN_COOKIE, returnTo, OAUTH_COOKIE_OPTIONS);
  }
}

export async function validateAndClearGmailOAuthState(state: string): Promise<boolean> {
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GMAIL_OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(GMAIL_OAUTH_STATE_COOKIE);
  return Boolean(expectedState && expectedState === state);
}

export async function consumeGmailOAuthReturnTo(): Promise<string> {
  const cookieStore = await cookies();
  const returnTo = cookieStore.get(GMAIL_OAUTH_RETURN_COOKIE)?.value;
  cookieStore.delete(GMAIL_OAUTH_RETURN_COOKIE);
  return returnTo ?? "/dashboard";
}
