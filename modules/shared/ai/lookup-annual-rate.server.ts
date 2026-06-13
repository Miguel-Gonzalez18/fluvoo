import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText, zodSchema } from "ai";
import {
  annualRateLookupResultSchema,
  buildAnnualRateExtractPrompt,
  buildAnnualRateSearchPrompt,
  resolveProductLabel,
} from "@/modules/shared/ai/lookup-annual-rate.schema";
import {
  resolveGeminiApiKey,
  resolveGeminiModelId,
} from "@/modules/shared/ai/gemini.client.server";
import type { AnnualRateProductType } from "@/modules/onboarding/actions/lookup-annual-rate.server";
import type { LoanType } from "@/modules/onboarding/types/onboarding";
import { FINANCIAL_INSTITUTIONS } from "@/modules/onboarding/config/financial";

export interface LookupAnnualRateCoreInput {
  institution: string;
  productType: AnnualRateProductType;
  loanType?: LoanType;
}

export interface LookupAnnualRateCoreResult {
  available: boolean;
  rate?: number;
  confidence?: "high" | "medium" | "low";
  note?: string;
  error?: string;
}

function resolveInstitutionLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return (
    FINANCIAL_INSTITUTIONS.find((item) => item.value === trimmed)?.label ??
    trimmed
  );
}

function createGoogleProvider() {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    return null;
  }
  return createGoogleGenerativeAI({ apiKey });
}

export async function lookupAnnualRateWithAi(
  input: LookupAnnualRateCoreInput
): Promise<LookupAnnualRateCoreResult> {
  const institutionLabel = resolveInstitutionLabel(input.institution);
  if (!institutionLabel) {
    return {
      available: false,
      error: "Selecciona primero la entidad financiera",
    };
  }

  const google = createGoogleProvider();
  if (!google) {
    return {
      available: false,
      error: "Configura GEMINI_API_KEY para consultar tasas con IA",
    };
  }

  const modelId = resolveGeminiModelId();
  const productLabel = resolveProductLabel(input.productType, input.loanType);

  try {
    const { text: searchText } = await generateText({
      model: google(modelId),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt: buildAnnualRateSearchPrompt({
        institutionLabel,
        productType: input.productType,
        loanType: input.loanType,
      }),
    });

    if (!searchText?.trim()) {
      return {
        available: false,
        error: "No se encontró información sobre la tasa",
      };
    }

    const { object } = await generateObject({
      model: google(modelId),
      schema: zodSchema(annualRateLookupResultSchema),
      schemaName: "AnnualRateLookup",
      schemaDescription:
        "Tasa anual referencial extraída de búsqueda web para productos financieros en RD",
      prompt: buildAnnualRateExtractPrompt(
        searchText,
        institutionLabel,
        productLabel
      ),
      temperature: 0.1,
    });

    if (!object.rate || object.rate <= 0) {
      return {
        available: false,
        error:
          object.note ??
          "No se pudo determinar una tasa confiable. Ingrésala manualmente.",
      };
    }

    return {
      available: true,
      rate: Math.round(object.rate * 100) / 100,
      confidence: object.confidence,
      note: object.note,
    };
  } catch (error) {
    console.error("[lookupAnnualRateWithAi]", error);
    return {
      available: false,
      error: "Error al consultar la tasa. Intenta de nuevo o ingrésala manualmente.",
    };
  }
}
