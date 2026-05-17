"use client";

import { useMemo } from "react";
import {
  calcularISRFreelance,
  ISR_EXEMPTION_THRESHOLD,
  RETENCION_FUENTE_FREELANCE,
} from "@/modules/shared/tax";
import { FreelancerTaxSectionProps, FreelancerCalculationResult } from "../../types/tax/freelancer.types";

interface UseFreelancerCalculationProps extends FreelancerTaxSectionProps {
  tssVoluntaria: boolean;
  clientesRetienen: boolean;
}

export function useFreelancerCalculation({
  averageMonthlyIncome,
  tssVoluntaria,
  clientesRetienen,
}: UseFreelancerCalculationProps): FreelancerCalculationResult {
  return useMemo(() => {
    const ingresoAnual = averageMonthlyIncome * 12;
    const retencionesAnuales = clientesRetienen
      ? ingresoAnual * RETENCION_FUENTE_FREELANCE
      : 0;

    const calculation = calcularISRFreelance(
      ingresoAnual,
      0,
      true,
      retencionesAnuales,
      tssVoluntaria
    );

    const pagaraISR = calculation.impuestoFinal > 0;
    const bajoPisoPorGastos = calculation.rentaNeta < ISR_EXEMPTION_THRESHOLD;

    return {
      ...calculation,
      ingresoAnual,
      retencionesAnuales,
      pagaraISR,
      bajoPisoPorGastos,
    };
  }, [averageMonthlyIncome, tssVoluntaria, clientesRetienen]);
}
