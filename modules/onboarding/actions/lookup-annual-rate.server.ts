"use server";

export type AnnualRateProductType = "credit_card" | "loan" | "installment";

export interface LookupAnnualRateInput {
  institution: string;
  productType: AnnualRateProductType;
}

export interface LookupAnnualRateResult {
  available: boolean;
  rate?: number;
  error?: string;
}

/**
 * Stub for future AI-powered annual rate lookup by financial institution.
 */
export async function lookupAnnualRate(
  input: LookupAnnualRateInput
): Promise<LookupAnnualRateResult> {
  if (!input.institution?.trim()) {
    return {
      available: false,
      error: "Selecciona primero la entidad financiera",
    };
  }

  return {
    available: false,
    error: "Consulta con IA disponible próximamente",
  };
}
