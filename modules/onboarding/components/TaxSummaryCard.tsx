"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingDown, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calcularISRAsalariado,
  calcularISRFreelance,
  calcularISREmpresa,
  ISR_EXEMPTION_THRESHOLD,
  ISR_RATE_PJ,
} from "../config/isr-calculator";
import { getTaxParameters } from "../actions/tax-actions";
import { Tables } from "@/src/types/supabase";

type TaxParameters = Tables<"tax_parameters">;
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
  const [period, setPeriod] = useState<"annual" | "monthly">("monthly");
  const [taxParams, setTaxParams] = useState<TaxParameters | null>(null);
  const [loadingParams, setLoadingParams] = useState(true);
  const [paramsError, setParamsError] = useState<string | null>(null);

  // Estado del toggle TSS voluntaria — solo relevante para freelancer
  const [tssVoluntaria, setTssVoluntaria] = useState(false);
  const onToggleTSS = () => setTssVoluntaria(prev => !prev);

  useEffect(() => {
    let mounted = true;
    getTaxParameters().then((res) => {
      if (!mounted) return;
      if (res.success && res.data) {
        setTaxParams(res.data);
      } else {
        setParamsError(res.error || "Error cargando parámetros fiscales");
      }
      setLoadingParams(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (profileType === "employee" && monthlySalary && monthlySalary > 0) {
    if (loadingParams) {
      return (
        <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4 animate-pulse", className)}>
          <div className="h-10 bg-muted rounded-lg w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>
      );
    }

    if (!taxParams) {
      return (
        <div className={cn("bg-muted/50 rounded-xl p-4 text-sm text-destructive", className)}>
          {paramsError ?? "No se pudieron cargar los parámetros fiscales."}
        </div>
      );
    }

    const calculation = calcularISRAsalariado(monthlySalary, taxParams);
    const tssTotalRate = (taxParams.sfs_employee ?? 0) + (taxParams.afp_employee ?? 0);

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
              <span>TSS ({(tssTotalRate * 100).toFixed(2)}%)</span>
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
    const calculation = calcularISRFreelance(
      ingresoAnual,
      0,
      true,
      0,
      tssVoluntaria
    );

    const pagaraISR = calculation.impuestoFinal > 0;
    const bajoPisoPorGastos = calculation.rentaNeta < ISR_EXEMPTION_THRESHOLD;

    return (
      <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4", className)}>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Resumen Fiscal Anual</h4>
            <p className="text-xs text-muted-foreground">Proyección ISR · Persona Física</p>
          </div>
        </div>

        <div className="space-y-3">

          {/* Honorarios brutos */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Honorarios estimados anuales</span>
            <span className="font-medium">
              RD${ingresoAnual.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Gastos simplificados (40%) */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="w-3.5 h-3.5 text-primary" />
              <span>Gastos simplificados DGII (40%)</span>
            </div>
            <span className="text-primary">
              -RD${calculation.gastosSimplificados.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Renta neta sujeta */}
          <div className="flex justify-between items-center text-sm border-t pt-2">
            <span className="text-muted-foreground">Renta neta sujeta a ISR</span>
            <span className="font-medium">
              RD${calculation.rentaNeta.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Estado ISR — condicional */}
          {!pagaraISR ? (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>ISR</span>
              </div>
              <span className="text-xs text-muted-foreground italic">
                {bajoPisoPorGastos
                  ? "Renta neta bajo umbral — exento"
                  : "No aplica"}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Info className="w-3.5 h-3.5" />
                  <span>ISR Anual (Tramo {calculation.tramoAplicable})</span>
                </div>
                <span className="text-destructive">
                  -RD${calculation.impuestoFinal.toLocaleString("es-DO")}
                </span>
              </div>

              {/* Reserva mensual recomendada */}
              <div className="flex justify-between items-center text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1 text-amber-700">
                  <Info className="w-3 h-3" />
                  <span className="font-medium">Reserva mensual recomendada</span>
                </div>
                <span className="font-semibold text-amber-700">
                  RD${calculation.reservaMensualRecomendada.toLocaleString("es-DO")}
                </span>
              </div>
            </>
          )}

          {/* Tasa efectiva */}
          <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
            <span>Tasa efectiva ISR</span>
            <span>
              {pagaraISR
                ? `${((calculation.impuestoFinal / ingresoAnual) * 100).toFixed(2)}%`
                : "0.00%"}
            </span>
          </div>

          {/* Toggle TSS voluntaria */}
          <div className="flex items-center justify-between pt-1 pb-1">
            <div>
              <p className="text-xs font-medium">¿Cotizas TSS voluntaria? (5.91%)</p>
              <p className="text-xs text-muted-foreground">
                Cobertura de salud y pensiones
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={tssVoluntaria}
              onClick={onToggleTSS}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none",
                tssVoluntaria ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  tssVoluntaria ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          {tssVoluntaria && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                <span>TSS voluntaria (5.91%)</span>
              </div>
              <span className="text-destructive">
                -RD${Math.round(calculation.tssVoluntaria).toLocaleString("es-DO")}
              </span>
            </div>
          )}

          {/* Alerta ITBIS si supera el umbral */}
          {calculation.superaUmbralITBIS && (
            <div className="text-xs bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 space-y-1">
              <p className="font-semibold text-orange-700">⚠️ Umbral ITBIS superado</p>
              <p className="text-orange-600">
                Con ingresos superiores a RD$8,695,240 anuales debes inscribirte
                como contribuyente ordinario del ITBIS y cobrar 18% adicional
                a tus clientes.
              </p>
            </div>
          )}

          {/* Nota informativa sobre TSS — solo cuando NO la tienen activa */}
          {!tssVoluntaria && (
            <div className="text-xs text-muted-foreground bg-muted/80 rounded-lg px-3 py-2">
              <strong>Nota:</strong> La TSS es voluntaria para freelancers.
              Cotizarla (5.91%) garantiza acceso al SFS (salud) y acumulación
              para pensión. Puedes activarla arriba para verla en tu proyección.
            </div>
          )}

          {/* Ingreso neto real */}
          <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">Ingreso neto anual estimado</span>
            </div>
            <span className="font-bold text-primary">
              RD${Math.round(calculation.ingresoNetoReal).toLocaleString("es-DO")}
            </span>
          </div>

          {/* Promedio mensual neto */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Promedio mensual disponible</span>
            <span className="font-medium">
              RD${Math.round(calculation.ingresoNetoReal / 12).toLocaleString("es-DO")}
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
