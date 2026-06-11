import { computeFiscalContextHash } from "@/modules/dashboard/employee/lib/compute-fiscal-context-hash.server";
import type {
  FiscalAnalysisData,
  FiscalAnalysisSource,
} from "@/modules/dashboard/employee/types/dashboard.types";
import type { FiscalTipIconKey } from "@/modules/shared/ai/fiscal-analysis.schema";
import type { FiscalAnalysisContext } from "@/modules/shared/ai/fiscal-analysis.schema";
import { generateFiscalAnalysis } from "@/modules/shared/ai/generate-fiscal-analysis.server";
import { createAdminClient } from "@/src/lib/admin";
import { createClient } from "@/src/lib/server";

export type FiscalInsightTriggerEvent =
  | "dashboard_load"
  | "gmail_sync"
  | "profile_update"
  | "manual_refresh";

interface StoredFiscalTip {
  id: string;
  title: string;
  description: string;
  iconKey: FiscalTipIconKey;
  priority: "1" | "2" | "3";
}

interface UserAiInsightRow {
  user_id: string;
  context_hash: string;
  diagnosis: string;
  tips: StoredFiscalTip[];
  source: FiscalAnalysisSource;
  trigger_event: string;
  generated_at: string;
}

function mapRowToFiscalAnalysis(row: UserAiInsightRow): FiscalAnalysisData {
  return {
    diagnosis: row.diagnosis,
    tips: row.tips.map((tip) => ({
      id: tip.id,
      title: tip.title,
      description: tip.description,
      iconKey: tip.iconKey,
    })),
    source: row.source,
  };
}

async function getStoredFiscalInsight(
  userId: string
): Promise<UserAiInsightRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_ai_insights")
    .select("user_id, context_hash, diagnosis, tips, source, trigger_event, generated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    tips: Array.isArray(data.tips) ? (data.tips as StoredFiscalTip[]) : [],
  };
}

async function upsertFiscalInsight(
  userId: string,
  contextHash: string,
  analysis: FiscalAnalysisData,
  triggerEvent: FiscalInsightTriggerEvent,
  tipsPayload: StoredFiscalTip[]
): Promise<void> {
  const admin = createAdminClient();

  const { error } = await admin.from("user_ai_insights").upsert(
    {
      user_id: userId,
      context_hash: contextHash,
      diagnosis: analysis.diagnosis,
      tips: tipsPayload,
      source: analysis.source,
      trigger_event: triggerEvent,
      generated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export interface EnsureFiscalAnalysisOptions {
  triggerEvent: FiscalInsightTriggerEvent;
  force?: boolean;
}

export async function ensureFiscalAnalysisStored(
  userId: string,
  context: FiscalAnalysisContext,
  options: EnsureFiscalAnalysisOptions
): Promise<FiscalAnalysisData> {
  const contextHash = computeFiscalContextHash(context);

  if (!options.force) {
    const stored = await getStoredFiscalInsight(userId);
    if (stored && stored.context_hash === contextHash) {
      return mapRowToFiscalAnalysis(stored);
    }
  }

  const generated = await generateFiscalAnalysis(context, {
    devCacheKey: process.env.NODE_ENV === "development" ? userId : undefined,
  });

  const tipsPayload: StoredFiscalTip[] = generated.tips.map((tip, index) => ({
    id: tip.id,
    title: tip.title,
    description: tip.description,
    iconKey: tip.iconKey,
    priority: String(Math.min(index + 1, 3)) as "1" | "2" | "3",
  }));

  try {
    await upsertFiscalInsight(
      userId,
      contextHash,
      generated,
      options.triggerEvent,
      tipsPayload
    );
  } catch (error) {
    console.error("[ensureFiscalAnalysisStored] Failed to persist insight:", error);
  }

  return generated;
}

export async function refreshFiscalInsightAfterDataChange(
  userId: string,
  triggerEvent: FiscalInsightTriggerEvent
): Promise<void> {
  const { loadFiscalAnalysisContextForUser } = await import(
    "@/modules/dashboard/employee/lib/load-fiscal-analysis-context.server"
  );

  const context = await loadFiscalAnalysisContextForUser(userId);
  if (!context) return;

  await ensureFiscalAnalysisStored(userId, context, { triggerEvent });
}
