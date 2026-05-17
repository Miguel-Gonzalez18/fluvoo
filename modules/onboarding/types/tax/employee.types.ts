import { Tables } from "@/src/types/supabase";

type TaxParameters = Tables<"tax_parameters">;

export interface EmployeeTaxSectionProps {
  monthlySalary: number;
  taxParams: TaxParameters;
}

export interface PeriodConfig {
  multiplier: number;
  label: string;
}

export type PeriodType = "annual" | "monthly" | "biweekly";
