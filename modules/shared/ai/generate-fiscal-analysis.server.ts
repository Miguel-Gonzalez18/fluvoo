import { generateObject, zodSchema } from "ai";
import type { FiscalTip } from "@/modules/dashboard/employee/types/dashboard.types";
import { buildFallbackFiscalAnalysis } from "@/modules/shared/ai/fiscal-analysis.fallback";
import {
  FISCAL_ANALYSIS_SYSTEM_PROMPT,
  buildFiscalAnalysisUserPrompt,
} from "@/modules/shared/ai/fiscal-analysis.prompt";
import {
  fiscalAnalysisResponseSchema,
  type FiscalAnalysisContext,
  type FiscalTipIconKey,
} from "@/modules/shared/ai/fiscal-analysis.schema";
import {
  createGeminiLanguageModel,
  resolveGeminiApiKey,
} from "@/modules/shared/ai/gemini.client.server";

export type FiscalAnalysisSource = "ai" | "fallback";

export interface FiscalAnalysisResult {
  diagnosis: string;
  tips: FiscalTip[];
  source: FiscalAnalysisSource;
}

function mapTipsToUi(
  tips: Array<{
    id: string;
    title: string;
    description: string;
    iconKey: FiscalTipIconKey;
    priority: "1" | "2" | "3";
  }>
): FiscalTip[] {
  return [...tips]
    .sort((a, b) => Number(a.priority) - Number(b.priority))
    .map((tip) => ({
      id: tip.id,
      title: tip.title,
      description: tip.description,
      iconKey: tip.iconKey,
    }));
}

export async function generateFiscalAnalysis(
  context: FiscalAnalysisContext
): Promise<FiscalAnalysisResult> {
  if (!resolveGeminiApiKey()) {
    const fallback = buildFallbackFiscalAnalysis(context);
    return {
      diagnosis: fallback.diagnosis,
      tips: mapTipsToUi(fallback.tips),
      source: "fallback",
    };
  }

  try {
    const { object } = await generateObject({
      model: createGeminiLanguageModel(),
      schema: zodSchema(fiscalAnalysisResponseSchema),
      schemaName: "FiscalAnalysis",
      schemaDescription:
        "Diagnóstico financiero en español dominicano con 2 a 3 tips accionables",
      system: FISCAL_ANALYSIS_SYSTEM_PROMPT,
      prompt: buildFiscalAnalysisUserPrompt(context),
      temperature: 0.4,
    });

    return {
      diagnosis: object.diagnosis,
      tips: mapTipsToUi(object.tips),
      source: "ai",
    };
  } catch (error) {
    console.error(
      "[generateFiscalAnalysis] Gemini failed:",
      error instanceof Error ? error.message : error
    );
    const fallback = buildFallbackFiscalAnalysis(context);
    return {
      diagnosis: fallback.diagnosis,
      tips: mapTipsToUi(fallback.tips),
      source: "fallback",
    };
  }
}
