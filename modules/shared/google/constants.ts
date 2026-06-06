export const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

export const GOOGLE_OAUTH_SCOPES = [
  "openid",
  "email",
  "profile",
  GMAIL_READONLY_SCOPE,
] as const;

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
export const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1";

export const GMAIL_OAUTH_STATE_COOKIE = "gmail_oauth_state";

/** Max messages fetched per sync run (initial + manual). */
export const GMAIL_SYNC_MAX_MESSAGES = 100;

/** Gmail search window in days. */
export const GMAIL_SYNC_LOOKBACK_DAYS = 90;
