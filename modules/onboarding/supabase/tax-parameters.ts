import { createClient } from "@/src/lib/server";
import { Tables } from "@/src/types/supabase";

// Type for ISR bracket structure (isr_brackets is Json in Supabase)
export interface ISRTaxBracket {
  tramo: number;
  desde_anual: number;
  hasta_anual: number | null;
  tasa: number;
  monto_fijo: number;
  descripcion: string;
}

export async function getActiveTaxParameters(): Promise<Tables<"tax_parameters"> | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_parameters")
    .select("*")
    .eq("is_active", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Error fetching tax parameters:", error);
    return null;
  }

  return {
    ...data,
    afp_employee: Number(data.afp_employee),
    sfs_employee: Number(data.sfs_employee),
    afp_employer: Number(data.afp_employer),
    sfs_employer: Number(data.sfs_employer),
    srl_employer: Number(data.srl_employer),
    infotep_employer: Number(data.infotep_employer),
    afp_ceiling: Number(data.afp_ceiling),
    sfs_ceiling: Number(data.sfs_ceiling),
    srl_ceiling: Number(data.srl_ceiling),
    minimum_wage: Number(data.minimum_wage),
    isr_brackets: (data.isr_brackets ?? []) as ISRTaxBracket[],
  };
}
