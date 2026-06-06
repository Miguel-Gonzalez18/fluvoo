import {
  GOOGLE_AUTH_URL,
  GOOGLE_OAUTH_SCOPES,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} from "@/modules/shared/google/constants";

function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth environment variables are not configured");
  }

  return { clientId, clientSecret, redirectUri };
}

export function buildGoogleAuthUrl(state: string): string {
  const { clientId, redirectUri } = getGoogleOAuthConfig();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_OAUTH_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
    include_granted_scopes: "true",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleOAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
  idToken?: string;
}

function decodeJwtPayload(idToken: string): Record<string, unknown> | null {
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(normalized, "base64").toString("utf-8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

export function getEmailFromIdToken(idToken?: string): string | null {
  if (!idToken) return null;
  const payload = decodeJwtPayload(idToken);
  return typeof payload?.email === "string" ? payload.email : null;
}

export async function resolveGoogleAccountEmail(
  tokens: GoogleOAuthTokens,
  fallbackEmail?: string | null
): Promise<string> {
  const emailFromIdToken = getEmailFromIdToken(tokens.idToken);
  if (emailFromIdToken) return emailFromIdToken;

  if (fallbackEmail) return fallbackEmail;

  return fetchGoogleUserEmail(tokens.accessToken);
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleOAuthTokens> {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const payload = (await response.json()) as GoogleTokenResponse & { error?: string; error_description?: string };

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || "Failed to exchange Google OAuth code");
  }

  if (!payload.refresh_token) {
    throw new Error("Google did not return a refresh token. Revoke app access and try again.");
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: new Date(Date.now() + payload.expires_in * 1000),
    scopes: payload.scope.split(" "),
    idToken: payload.id_token,
  };
}

export async function fetchGoogleUserEmail(accessToken: string): Promise<string> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const payload = (await response.json()) as { email?: string; error?: { message?: string } };

  if (!response.ok || !payload.email) {
    throw new Error(payload.error?.message || "Failed to fetch Google account email");
  }

  return payload.email;
}
