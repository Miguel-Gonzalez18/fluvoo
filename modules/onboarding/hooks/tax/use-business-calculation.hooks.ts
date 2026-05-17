"use client";

import { useMemo } from "react";
import { calcularISREmpresa } from "@/modules/shared/tax";
import { BusinessTaxSectionProps, BusinessCalculationResult } from "../../types/tax/business.types";

export function useBusinessCalculation({
  businessMonthlyRevenue,
  gastosEstimados,
}: BusinessTaxSectionProps): BusinessCalculationResult {
  return useMemo(() => {
    const ingresoAnual = businessMonthlyRevenue * 12;
    const gastosAnuales = ingresoAnual * (gastosEstimados / 100);
    const calculation = calcularISREmpresa(ingresoAnual, gastosAnuales);

    return {
      ...calculation,
      ingresoAnual,
      gastosAnuales,
    };
  }, [businessMonthlyRevenue, gastosEstimados]);
}
