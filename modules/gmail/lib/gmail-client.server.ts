import { GMAIL_API_BASE } from "@/modules/shared/google/constants";
import type { GmailMessagePayload } from "@/modules/gmail/lib/decode-message.server";

interface GmailListResponse {
  messages?: { id: string; threadId: string }[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
}

interface GmailApiError {
  error?: {
    message?: string;
    status?: string;
  };
}

export class GmailApiClient {
  constructor(private accessToken: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${GMAIL_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/json",
        ...init?.headers,
      },
    });

    const payload = (await response.json()) as T & GmailApiError;

    if (!response.ok) {
      if (response.status === 404) {
        return {} as T;
      }
      throw new Error(payload.error?.message || `Gmail API error (${response.status})`);
    }

    return payload;
  }

  async listMessageIds(
    query: string,
    maxResults: number,
    pageToken?: string
  ): Promise<{ ids: string[]; nextPageToken?: string }> {
    const params = new URLSearchParams({
      q: query,
      maxResults: String(Math.min(maxResults, 100)),
    });

    if (pageToken) params.set("pageToken", pageToken);

    const payload = await this.request<GmailListResponse>(
      `/users/me/messages?${params.toString()}`
    );

    return {
      ids: payload.messages?.map((message) => message.id) ?? [],
      nextPageToken: payload.nextPageToken,
    };
  }

  async getMessage(messageId: string): Promise<GmailMessagePayload> {
    return this.request<GmailMessagePayload>(
      `/users/me/messages/${messageId}?format=full`
    );
  }
}
