import { Tables } from "@/src/types/supabase";

export interface ISRTaxBracket {
  tramo: number;
  desde_anual: number;
  hasta_anual: number | null;
  tasa: number;
  monto_fijo: number;
  descripcion: string;
}

export type TaxParameters = Tables<"tax_parameters">;

export interface ISRCalculation {
  ingresoBrutoAnual: number;
  deduccionesTSS: number;
  baseImponible: number;
  impuestoCalculado: number;
  impuestoMensual: number;
  tramoAplicable: number;
  detalles: string[];
}
