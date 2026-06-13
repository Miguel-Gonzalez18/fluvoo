"use server";

import { lookupAnnualRateWithAi } from "@/modules/shared/ai/lookup-annual-rate.server";
import type { LoanType } from "@/modules/onboarding/types/onboarding";

export type AnnualRateProductType = "credit_card" | "loan" | "installment";

export interface LookupAnnualRateInput {
  institution: string;
  productType: AnnualRateProductType;
  loanType?: LoanType;
}

export interface LookupAnnualRateResult {
  available: boolean;
  rate?: number;
  confidence?: "high" | "medium" | "low";
  note?: string;
  error?: string;
}

export async function lookupAnnualRate(
  input: LookupAnnualRateInput
): Promise<LookupAnnualRateResult> {
  return lookupAnnualRateWithAi(input);
}
