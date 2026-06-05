"use client";

import { useMemo } from "react";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { calcularISRAsalariado } from "@/modules/shared/tax";
import { PeriodTabs } from "../period-tabs.component";
import { TaxRow } from "../tax-row.component";
import { useEmployeePeriod } from "@/modules/onboarding/hooks/tax/use-employee-period.hooks";
import { EmployeeTaxSectionProps } from "@/modules/onboarding/types/tax/employee.types";

export function EmployeeTaxSection({ monthlySalary, taxParams }: EmployeeTaxSectionProps) {
  const { period, setPeriod, periodConfig } = useEmployeePeriod();

  const calculation = useMemo(
    () => calcularISRAsalariado(monthlySalary, taxParams),
    [monthlySalary, taxParams]
  );

  const tssTotalRate = (taxParams.sfs_employee ?? 0) + (taxParams.afp_employee ?? 0);

  const values = useMemo(() => {
    const { multiplier, label } = periodConfig;
    return {
      periodLabel: label,
      ingresoBruto: calculation.ingresoBrutoAnual * multiplier,
      deduccionesTSS: calculation.deduccionesTSS * multiplier,
      baseImponible: calculation.baseImponible * multiplier,
      impuestoISR: calculation.impuestoCalculado * multiplier,
      totalDeducciones: (calculation.deduccionesTSS + calculation.impuestoCalculado) * multiplier,
      ingresoNeto: (calculation.ingresoBrutoAnual - calculation.deduccionesTSS - calculation.impuestoCalculado) * multiplier,
    };
  }, [calculation, periodConfig]);

  return (
    <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4")}>
      {/* Header con tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Resumen Fiscal</h4>
            <p className="text-xs text-muted-foreground">Proyección ISR + TSS</p>
          </div>
        </div>
        <PeriodTabs period={period} onChange={setPeriod} />
      </div>

      <div className="space-y-3">
        <TaxRow
          label={`Salario bruto ${values.periodLabel}`}
          value={`RD$${values.ingresoBruto.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`}
        />

        <TaxRow
          label={`TSS (${(tssTotalRate * 100).toFixed(2)}%)`}
          value={`-RD$${values.deduccionesTSS.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`}
          hasIcon="down"
        />

        <TaxRow
          label="Base imponible ISR"
          value={`RD$${values.baseImponible.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`}
          className="border-t pt-2"
        />

        {values.impuestoISR > 0 && (
          <TaxRow
            label={`ISR ${values.periodLabel} (Tramo ${calculation.tramoAplicable})`}
            value={`-RD$${values.impuestoISR.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`}
            hasIcon="info"
          />
        )}

        <TaxRow
          label="Total deducciones ley"
          value={`-RD$${values.totalDeducciones.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`}
          isBold
          className="border-t border-primary/20 pt-2"
        />

        <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
          <TaxRow
            label={`Ingreso neto ${values.periodLabel}`}
            value={`RD$${values.ingresoNeto.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`}
            hasIcon="up"
          />
        </div>
      </div>
    </div>
  );
}
