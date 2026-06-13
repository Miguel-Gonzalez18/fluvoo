import { z } from "zod";
import type { LoanType } from "@/modules/onboarding/types/onboarding";
import type { AnnualRateProductType } from "@/modules/onboarding/actions/lookup-annual-rate.server";

export const annualRateLookupResultSchema = z.object({
  rate: z
    .number()
    .min(0)
    .max(100)
    .describe("Tasa anual efectiva en porcentaje (ej. 18.5)"),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("Confianza en la tasa encontrada"),
  note: z
    .string()
    .optional()
    .describe("Breve nota sobre la fuente o rango referencial"),
});

export type AnnualRateLookupResult = z.infer<typeof annualRateLookupResultSchema>;

const PRODUCT_LABELS: Record<AnnualRateProductType, string> = {
  credit_card: "tarjeta de crédito",
  loan: "préstamo",
  installment: "compra a cuotas / financiamiento",
};

const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  personal: "préstamo personal",
  mortgage: "préstamo hipotecario",
  vehicle: "préstamo vehicular",
  business: "préstamo empresarial",
};

export function buildAnnualRateSearchPrompt(input: {
  institutionLabel: string;
  productType: AnnualRateProductType;
  loanType?: LoanType;
}): string {
  const productLabel =
    input.productType === "loan" && input.loanType
      ? LOAN_TYPE_LABELS[input.loanType]
      : PRODUCT_LABELS[input.productType];

  return [
    `Busca en la web la tasa de interés anual referencial (en porcentaje) para ${productLabel} en ${input.institutionLabel}, República Dominicana.`,
    "Prioriza fuentes oficiales del banco, la Superintendencia de Bancos (SIB) o sitios financieros dominicanos recientes (2025-2026).",
    "Si hay un rango, indica una tasa representativa típica para clientes generales.",
    "Responde en español con el porcentaje encontrado y menciona brevemente la fuente.",
  ].join(" ");
}

export function buildAnnualRateExtractPrompt(
  searchText: string,
  institutionLabel: string,
  productLabel: string
): string {
  return [
    `Extrae la tasa anual referencial en porcentaje para ${productLabel} en ${institutionLabel} (República Dominicana).`,
    "Si el texto menciona un rango, elige un valor representativo del medio del rango.",
    "Si no hay dato confiable, usa confidence low y rate 0.",
    "",
    "Texto de búsqueda:",
    searchText,
  ].join("\n");
}

export function resolveProductLabel(
  productType: AnnualRateProductType,
  loanType?: LoanType
): string {
  if (productType === "loan" && loanType) {
    return LOAN_TYPE_LABELS[loanType];
  }
  return PRODUCT_LABELS[productType];
}
