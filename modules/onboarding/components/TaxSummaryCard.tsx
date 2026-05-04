"use client";

import { useState } from "react";
import { Calculator, TrendingDown, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calcularISRAsalariado,
  calcularISRFreelance,
  calcularISREmpresa,
  EXENCION_GASTO_SIMPLIFICADO,
  TSS_RATES,
  ISR_RATE_PJ,
} from "../config/isr-calculator";
import { ProfileType } from "../types/onboarding";

interface TaxSummaryCardProps {
  profileType: ProfileType;
  // Asalariado
  monthlySalary?: number;
  // Freelance
  averageMonthlyIncome?: number;
  // Empresa
  businessMonthlyRevenue?: number;
  gastosEstimados?: number; // % de gastos sobre ingresos
  className?: string;
}

export function TaxSummaryCard({
  profileType,
  monthlySalary,
  averageMonthlyIncome,
  businessMonthlyRevenue,
  gastosEstimados = 30, // Default 30%
  className,
}: TaxSummaryCardProps) {
  if (profileType === "employee" && monthlySalary && monthlySalary > 0) {
    const [period, setPeriod] = useState<"annual" | "monthly">("monthly");
    const calculation = calcularISRAsalariado(monthlySalary);

    const isAnnual = period === "annual";
    const multiplier = isAnnual ? 1 : 1 / 12;
    const ingresoBruto = calculation.ingresoBrutoAnual * multiplier;
    const deduccionesTSS = calculation.deduccionesTSS * multiplier;
    const baseImponible = calculation.baseImponible * multiplier;
    const impuestoISR = calculation.impuestoCalculado * multiplier;
    const totalDeducciones = deduccionesTSS + impuestoISR;
    const ingresoNeto = ingresoBruto - totalDeducciones;

    return (
      <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4", className)}>
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

          {/* Tabs Anual / Mensual */}
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setPeriod("monthly")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                period === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensual
            </button>
            <button
              onClick={() => setPeriod("annual")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                period === "annual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Ingreso */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Salario bruto {isAnnual ? "anual" : "mensual"}</span>
            <span className="font-medium">
              RD${ingresoBruto.toLocaleString("es-DO", { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Deducciones TSS */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              <span>TSS ({(TSS_RATES.total * 100).toFixed(2)}%)</span>
            </div>
            <span className="text-destructive">
              -RD${deduccionesTSS.toLocaleString("es-DO", { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Base imponible */}
          <div className="flex justify-between items-center text-sm border-t pt-2">
            <span className="text-muted-foreground">Base imponible ISR</span>
            <span className="font-medium">
              RD${baseImponible.toLocaleString("es-DO", { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* ISR */}
          {impuestoISR > 0 && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>ISR {isAnnual ? "Anual" : "Mensual"} (Tramo {calculation.tramoAplicable})</span>
              </div>
              <span className="text-destructive">
                -RD${impuestoISR.toLocaleString("es-DO", { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}

          {/* Total deducciones */}
          <div className="flex justify-between items-center text-sm border-t border-primary/20 pt-2">
            <span className="font-medium">Total deducciones ley</span>
            <span className="font-semibold text-destructive">
              -RD${totalDeducciones.toLocaleString("es-DO", { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Ingreso neto */}
          <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">Ingreso neto {isAnnual ? "anual" : "mensual"}</span>
            </div>
            <span className="font-bold text-primary">
              RD${ingresoNeto.toLocaleString("es-DO", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (profileType === "freelancer" && averageMonthlyIncome && averageMonthlyIncome > 0) {
    const ingresoAnual = averageMonthlyIncome * 12;
    const calculation = calcularISRFreelance(ingresoAnual, 0, true, 0);

    return (
      <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4", className)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Resumen Fiscal Anual</h4>
            <p className="text-xs text-muted-foreground">Proyección ISR Persona Física</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Ingreso */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Honorarios anuales</span>
            <span className="font-medium">
              RD${ingresoAnual.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Deducción simplificada */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="w-3.5 h-3.5 text-primary" />
              <span>Gasto simplificado (exención)</span>
            </div>
            <span className="text-primary">
              -RD${EXENCION_GASTO_SIMPLIFICADO.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Base imponible */}
          <div className="flex justify-between items-center text-sm border-t pt-2">
            <span className="text-muted-foreground">Base imponible</span>
            <span className="font-medium">
              RD${calculation.baseImponible.toLocaleString("es-DO")}
            </span>
          </div>

          {/* ISR */}
          {calculation.impuestoFinal > 0 && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>ISR Anual (Tramo {calculation.tramoAplicable})</span>
              </div>
              <span className="text-destructive">
                -RD${calculation.impuestoFinal.toLocaleString("es-DO")}
              </span>
            </div>
          )}

          {/* Tasa efectiva */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Tasa efectiva ISR</span>
            <span>
              {((calculation.impuestoFinal / ingresoAnual) * 100).toFixed(2)}%
            </span>
          </div>

          {/* Nota seguridad social */}
          <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-2">
            <strong>Nota:</strong> Como freelancer debes pagar tu TSS de forma voluntaria (aprox. 5.91% del ingreso) para mantener cobertura de salud y pensiones.
          </div>

          {/* Ingreso neto */}
          <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">Ingreso neto anual</span>
            </div>
            <span className="font-bold text-primary">
              RD${(ingresoAnual - calculation.impuestoFinal).toLocaleString("es-DO")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (profileType === "business_owner" && businessMonthlyRevenue && businessMonthlyRevenue > 0) {
    const ingresoAnual = businessMonthlyRevenue * 12;
    const gastosAnuales = ingresoAnual * (gastosEstimados / 100);
    const calculation = calcularISREmpresa(ingresoAnual, gastosAnuales);

    return (
      <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4", className)}>
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
            <span className="font-medium">
              RD${ingresoAnual.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Gastos */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="w-3.5 h-3.5 text-primary" />
              <span>Gastos deducibles (~{gastosEstimados}%)</span>
            </div>
            <span className="text-primary">
              -RD${gastosAnuales.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Beneficio */}
          <div className="flex justify-between items-center text-sm border-t pt-2">
            <span className="text-muted-foreground">Beneficio neto</span>
            <span className="font-medium">
              RD${calculation.beneficioNeto.toLocaleString("es-DO")}
            </span>
          </div>

          {/* ISR 27% */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <span>ISR ({(ISR_RATE_PJ * 100).toFixed(0)}%)</span>
            </div>
            <span className="text-destructive">
              -RD${calculation.impuestoISR.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Anticipo mensual */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Anticipo mensual estimado</span>
            <span>
              RD${calculation.anticipoMensual?.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Beneficio después de impuestos */}
          <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">Beneficio neto después ISR</span>
            </div>
            <span className="font-bold text-primary">
              RD${(calculation.beneficioNeto - calculation.impuestoISR).toLocaleString("es-DO")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
