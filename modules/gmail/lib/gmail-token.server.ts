import { GOOGLE_TOKEN_URL } from "@/modules/shared/google/constants";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export interface RefreshedAccessToken {
  accessToken: string;
  expiresAt: Date;
}

export async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<RefreshedAccessToken> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth environment variables are not configured");
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const payload = (await response.json()) as RefreshTokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new Error(
      payload.error_description || payload.error || "Failed to refresh Google access token"
    );
  }

  return {
    accessToken: payload.access_token,
    expiresAt: new Date(Date.now() + payload.expires_in * 1000),
  };
}

export function isAccessTokenExpired(expiresAt: string | null, bufferMs = 60_000): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() <= Date.now() + bufferMs;
}
