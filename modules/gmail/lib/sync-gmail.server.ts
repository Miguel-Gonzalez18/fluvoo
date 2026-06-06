import { buildGmailBankSearchQuery } from "@/modules/gmail/config/bank-filters";
import { GmailApiClient } from "@/modules/gmail/lib/gmail-client.server";
import {
  isAccessTokenExpired,
  refreshGoogleAccessToken,
} from "@/modules/gmail/lib/gmail-token.server";
import { getGmailHeader } from "@/modules/gmail/lib/decode-message.server";
import { parseBankEmailMessage } from "@/modules/gmail/lib/parse-transaction.server";
import type {
  GmailConnectionRow,
  GmailSyncResult,
} from "@/modules/gmail/types/sync.types";
import {
  GMAIL_SYNC_LOOKBACK_DAYS,
  GMAIL_SYNC_MAX_MESSAGES,
} from "@/modules/shared/google/constants";
import { createAdminClient } from "@/src/lib/admin";

async function getGmailConnection(userId: string): Promise<GmailConnectionRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("gmail_connections")
    .select(
      "user_id, google_email, refresh_token, access_token, token_expires_at, sync_status, sync_error"
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function updateGmailConnection(
  userId: string,
  patch: Record<string, unknown>
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("gmail_connections").update(patch).eq("user_id", userId);
  if (error) throw new Error(error.message);
}

async function ensureValidAccessToken(
  connection: GmailConnectionRow
): Promise<string> {
  if (connection.access_token && !isAccessTokenExpired(connection.token_expires_at)) {
    return connection.access_token;
  }

  const refreshed = await refreshGoogleAccessToken(connection.refresh_token);

  await updateGmailConnection(connection.user_id, {
    access_token: refreshed.accessToken,
    token_expires_at: refreshed.expiresAt.toISOString(),
  });

  return refreshed.accessToken;
}

async function getExistingMessageIds(userId: string, messageIds: string[]): Promise<Set<string>> {
  if (messageIds.length === 0) return new Set();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("transactions")
    .select("gmail_message_id")
    .eq("user_id", userId)
    .in("gmail_message_id", messageIds);

  if (error) throw new Error(error.message);

  return new Set(data?.map((row) => row.gmail_message_id) ?? []);
}

async function collectMessageIds(
  client: GmailApiClient,
  query: string,
  maxMessages: number
): Promise<string[]> {
  const collected: string[] = [];
  let pageToken: string | undefined;

  while (collected.length < maxMessages) {
    const remaining = maxMessages - collected.length;
    const page = await client.listMessageIds(query, remaining, pageToken);
    collected.push(...page.ids);

    if (!page.nextPageToken || page.ids.length === 0) break;
    pageToken = page.nextPageToken;
  }

  return collected.slice(0, maxMessages);
}

export async function syncGmailTransactions(
  userId: string,
  options?: { maxMessages?: number; lookbackDays?: number }
): Promise<GmailSyncResult> {
  const maxMessages = options?.maxMessages ?? GMAIL_SYNC_MAX_MESSAGES;
  const lookbackDays = options?.lookbackDays ?? GMAIL_SYNC_LOOKBACK_DAYS;

  const result: GmailSyncResult = {
    success: false,
    processed: 0,
    imported: 0,
    skipped: 0,
    failed: 0,
  };

  let connection: GmailConnectionRow | null = null;

  try {
    connection = await getGmailConnection(userId);
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Failed to load Gmail connection",
    };
  }

  if (!connection) {
    return { ...result, error: "Gmail connection not found" };
  }

  try {
    await updateGmailConnection(userId, {
      sync_status: "syncing",
      sync_error: null,
    });
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Failed to start Gmail sync",
    };
  }

  try {
    const accessToken = await ensureValidAccessToken(connection);
    const client = new GmailApiClient(accessToken);
    const query = buildGmailBankSearchQuery(lookbackDays);
    const messageIds = await collectMessageIds(client, query, maxMessages);
    const existingIds = await getExistingMessageIds(userId, messageIds);
    const admin = createAdminClient();

    for (const messageId of messageIds) {
      result.processed += 1;

      if (existingIds.has(messageId)) {
        result.skipped += 1;
        continue;
      }

      try {
        const message = await client.getMessage(messageId);
        const parsed = parseBankEmailMessage(message);

        if (!parsed) {
          result.skipped += 1;
          continue;
        }

        const from = getGmailHeader(message, "From");
        const subject = getGmailHeader(message, "Subject");

        const { error: insertError } = await admin.from("transactions").insert({
          user_id: userId,
          gmail_message_id: messageId,
          bank_name: parsed.bankName,
          transaction_type: parsed.transactionType,
          amount: parsed.amount,
          currency: parsed.currency,
          merchant_name: parsed.merchantName,
          description: parsed.description,
          transaction_date: parsed.transactionDate.toISOString(),
          raw_subject: subject ?? null,
          raw_from: from ?? null,
          parse_status: parsed.parseStatus,
        });

        if (insertError) {
          if (insertError.code === "23505") {
            result.skipped += 1;
            continue;
          }
          throw new Error(insertError.message);
        }

        result.imported += 1;
      } catch {
        result.failed += 1;
      }
    }

    await updateGmailConnection(userId, {
      sync_status: "active",
      sync_error: null,
      last_sync_at: new Date().toISOString(),
    });

    return { ...result, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gmail sync failed";

    await updateGmailConnection(userId, {
      sync_status: "error",
      sync_error: message,
    });

    return { ...result, error: message };
  }
}
