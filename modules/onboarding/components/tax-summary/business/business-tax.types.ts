import { ISREmpresaCalculation } from "@/modules/shared/tax";

export interface BusinessTaxSectionProps {
  businessMonthlyRevenue: number;
  gastosEstimados: number;
}

export interface BusinessCalculationResult extends ISREmpresaCalculation {
  ingresoAnual: number;
  gastosAnuales: number;
}
