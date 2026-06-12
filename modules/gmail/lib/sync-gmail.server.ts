import { buildGmailBankSearchQuery } from "@/modules/gmail/config/bank-filters";

import { GmailApiClient } from "@/modules/gmail/lib/gmail-client.server";

import {

  isAccessTokenExpired,

  refreshGoogleAccessToken,

} from "@/modules/gmail/lib/gmail-token.server";

import { getGmailHeader } from "@/modules/gmail/lib/decode-message.server";

import { parseBankEmailMessage } from "@/modules/gmail/lib/parse-transaction.server";

import { refreshFiscalInsightAfterDataChange } from "@/modules/dashboard/employee/lib/fiscal-insight.server";
import { classifyImportedTransactionsWithAi } from "@/modules/gmail/lib/classify-imported-transactions-with-ai.server";
import { resolveDopAmount } from "@/modules/gmail/lib/resolve-dop-amount";
import { classifyExpenseCategory } from "@/modules/shared/lib/classify-expense-category";

import type {

  GmailConnectionRow,

  GmailSyncResult,

  ParsedBankTransaction,

  ParsedBankEmailDraft,

} from "@/modules/gmail/types/sync.types";

import type { ResolvedDopAmount } from "@/modules/gmail/lib/resolve-dop-amount";

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



function buildParsedTransaction(

  draft: ParsedBankEmailDraft,

  resolved: ResolvedDopAmount

): ParsedBankTransaction {

  const hasOriginal = resolved.originalAmount !== null;
  const classification = classifyExpenseCategory({
    merchantName: draft.merchantName,
    description: draft.description,
    transactionType: draft.transactionType,
  });

  return {

    bankName: draft.bankName,

    transactionType: draft.transactionType,

    amount: resolved.amountDop,

    currency: "DOP",

    originalAmount: resolved.originalAmount,

    originalCurrency: resolved.originalCurrency,

    exchangeRate: resolved.exchangeRate,

    rateSource: resolved.rateSource,

    merchantName: draft.merchantName,

    description: draft.description,

    transactionDate: draft.transactionDate,

    parseStatus: hasOriginal ? "parsed" : "parsed",

    expenseCategory: classification.category,

    categorySource: classification.source,

  };

}



function incrementSkipReason(

  result: GmailSyncResult,

  reason: string

): void {

  result.skipped += 1;



  if (reason === "marketing") {

    result.skippedMarketing = (result.skippedMarketing ?? 0) + 1;

  } else if (reason === "no_amount" || reason === "usd_only_disabled") {

    result.skippedNoAmount = (result.skippedNoAmount ?? 0) + 1;

  } else if (reason === "duplicate") {

    result.skippedDuplicate = (result.skippedDuplicate ?? 0) + 1;

  } else if (reason === "declined") {

    result.skippedDeclined = (result.skippedDeclined ?? 0) + 1;

  } else if (reason === "internal_transfer") {

    result.skippedInternal = (result.skippedInternal ?? 0) + 1;

  }

}



async function purgeUserTransactions(userId: string): Promise<void> {

  const admin = createAdminClient();

  const { error } = await admin.from("transactions").delete().eq("user_id", userId);

  if (error) throw new Error(error.message);

}



export async function syncGmailTransactions(

  userId: string,

  options?: {
    maxMessages?: number;
    lookbackDays?: number;
    purgeExisting?: boolean;
  }

): Promise<GmailSyncResult> {

  const maxMessages = options?.maxMessages ?? GMAIL_SYNC_MAX_MESSAGES;

  const lookbackDays = options?.lookbackDays ?? GMAIL_SYNC_LOOKBACK_DAYS;



  const result: GmailSyncResult = {

    success: false,

    processed: 0,

    imported: 0,

    importedTransactionIds: [],

    skipped: 0,

    failed: 0,

    skippedMarketing: 0,

    skippedNoAmount: 0,

    skippedDuplicate: 0,

    skippedDeclined: 0,

    skippedInternal: 0,

    aiReviewed: 0,

    aiUpdated: 0,

    aiFailed: 0,

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

    if (options?.purgeExisting) {

      await purgeUserTransactions(userId);

    }



    const accessToken = await ensureValidAccessToken(connection);

    const client = new GmailApiClient(accessToken);

    const query = buildGmailBankSearchQuery(lookbackDays);

    const messageIds = await collectMessageIds(client, query, maxMessages);

    const existingIds = await getExistingMessageIds(userId, messageIds);

    const admin = createAdminClient();

    const importedIds: string[] = [];



    for (const messageId of messageIds) {

      result.processed += 1;



      if (existingIds.has(messageId)) {

        incrementSkipReason(result, "duplicate");

        continue;

      }



      try {

        const message = await client.getMessage(messageId);

        const outcome = parseBankEmailMessage(message);



        if (outcome.status === "skipped") {

          incrementSkipReason(result, outcome.reason);

          continue;

        }



        const resolved = await resolveDopAmount(outcome.draft.rawAmounts);

        if (!resolved) {

          incrementSkipReason(result, "no_amount");

          continue;

        }



        const parsed = buildParsedTransaction(outcome.draft, resolved);

        const from = getGmailHeader(message, "From");

        const subject = getGmailHeader(message, "Subject");



        const { data: insertedRows, error: insertError } = await admin
          .from("transactions")
          .insert({

          user_id: userId,

          gmail_message_id: messageId,

          bank_name: parsed.bankName,

          transaction_type: parsed.transactionType,

          amount: parsed.amount,

          currency: parsed.currency,

          original_amount: parsed.originalAmount,

          original_currency: parsed.originalCurrency,

          exchange_rate: parsed.exchangeRate,

          rate_source: parsed.rateSource,

          merchant_name: parsed.merchantName,

          description: parsed.description,

          transaction_date: parsed.transactionDate.toISOString(),

          raw_subject: subject ?? null,

          raw_from: from ?? null,

          parse_status: parsed.parseStatus,

          expense_category: parsed.expenseCategory,

          category_source: parsed.categorySource,

        })
          .select("id");



        if (insertError) {

          if (insertError.code === "23505") {

            incrementSkipReason(result, "duplicate");

            continue;

          }

          throw new Error(insertError.message);

        }



        const insertedId = insertedRows?.[0]?.id;

        if (insertedId) {

          importedIds.push(insertedId);

          result.importedTransactionIds.push(insertedId);

        }

        result.imported += 1;

      } catch {

        result.failed += 1;

      }

    }



    const aiStats = await classifyImportedTransactionsWithAi(userId, importedIds);

    result.aiReviewed = aiStats.aiReviewed;

    result.aiUpdated = aiStats.aiUpdated;

    result.aiFailed = aiStats.aiFailed;

    await updateGmailConnection(userId, {

      sync_status: "active",

      sync_error: null,

      last_sync_at: new Date().toISOString(),

      last_sync_stats: {

        processed: result.processed,

        imported: result.imported,

        skipped: result.skipped,

        failed: result.failed,

        skippedMarketing: result.skippedMarketing,

        skippedNoAmount: result.skippedNoAmount,

        skippedDuplicate: result.skippedDuplicate,

        skippedDeclined: result.skippedDeclined,

        skippedInternal: result.skippedInternal,

        aiReviewed: result.aiReviewed,

        aiUpdated: result.aiUpdated,

        aiFailed: result.aiFailed,

      },

    });

    if (result.imported > 0 || (result.aiUpdated ?? 0) > 0) {
      try {
        await refreshFiscalInsightAfterDataChange(userId, "gmail_sync");
      } catch (insightError) {
        console.error(
          "[syncGmailTransactions] Fiscal insight refresh failed:",
          insightError
        );
      }
    }

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


