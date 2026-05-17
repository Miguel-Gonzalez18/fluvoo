import { ISRFreelanceCalculation } from "@/modules/shared/tax";

export interface FreelancerTaxSectionProps {
  averageMonthlyIncome: number;
}

export interface FreelancerState {
  tssVoluntaria: boolean;
  registradoDGII: boolean;
  clientesRetienen: boolean;
}

export interface FreelancerCalculationResult extends ISRFreelanceCalculation {
  ingresoAnual: number;
  retencionesAnuales: number;
  pagaraISR: boolean;
  bajoPisoPorGastos: boolean;
}
