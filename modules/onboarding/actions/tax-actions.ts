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

export async function getItbisParameters() {
  const { createClient } = await import("@/src/lib/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itbis_parameters")
    .select("*")
    .eq("is_active", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return { success: false, error: error.message, data: null };
  }
  return { success: true, data, error: null };
}

export async function getFreelancerDeductionParameters() {
  const { createClient } = await import("@/src/lib/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("freelancer_deduction_parameters")
    .select("*")
    .eq("is_active", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return { success: false, error: error.message, data: null };
  }
  return { success: true, data, error: null };
}
