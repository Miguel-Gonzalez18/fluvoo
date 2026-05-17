"use server";

import { getActiveTaxParameters } from "../supabase/tax-parameters";
import { Tables } from "@/src/types/supabase";

type TaxParameters = Tables<"tax_parameters">;

export interface TaxActionResult {
  success: boolean;
  data?: TaxParameters;
  error?: string;
}

export async function getTaxParameters(): Promise<TaxActionResult> {
  try {
    const params = await getActiveTaxParameters();

    if (!params) {
      return { success: false, error: "No active tax parameters found" };
    }

    return { success: true, data: params };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error in getTaxParameters action:", message);
    return { success: false, error: message };
  }
}
