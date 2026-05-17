"use client";

import { Calculator, TrendingDown, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ISR_RATE_PJ } from "@/modules/shared/tax";
import { BusinessTaxSectionProps } from "../../../types/tax/business.types";
import { useBusinessCalculation } from "../../../hooks/tax/use-business-calculation.hooks";

export function BusinessTaxSection({ businessMonthlyRevenue, gastosEstimados }: BusinessTaxSectionProps) {
  const calc = useBusinessCalculation({ businessMonthlyRevenue, gastosEstimados });

  return (
    <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4")}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Resumen Fiscal Anual</h4>
          <p className="text-xs text-muted-foreground">Proyección ISR Persona Jurídica</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Ingreso */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Ingresos anuales</span>
          <span className="font-medium">RD${calc.ingresoAnual.toLocaleString("es-DO")}</span>
        </div>

        {/* Gastos */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5 text-primary" />
            <span>Gastos deducibles (~{gastosEstimados}%)</span>
          </div>
          <span className="text-primary">-RD${calc.gastosAnuales.toLocaleString("es-DO")}</span>
        </div>

        {/* Beneficio */}
        <div className="flex justify-between items-center text-sm border-t pt-2">
          <span className="text-muted-foreground">Beneficio neto</span>
          <span className="font-medium">RD${calc.beneficioNeto.toLocaleString("es-DO")}</span>
        </div>

        {/* ISR 27% */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
            <span>ISR ({(ISR_RATE_PJ * 100).toFixed(0)}%)</span>
          </div>
          <span className="text-destructive">-RD${calc.impuestoISR.toLocaleString("es-DO")}</span>
        </div>

        {/* Anticipo mensual */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Anticipo mensual estimado</span>
          <span>RD${calc.anticipoMensual?.toLocaleString("es-DO")}</span>
        </div>

        {/* Beneficio después de impuestos */}
        <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Beneficio neto después ISR</span>
          </div>
          <span className="font-bold text-primary">
            RD${(calc.beneficioNeto - calc.impuestoISR).toLocaleString("es-DO")}
          </span>
        </div>
      </div>
    </div>
  );
}
