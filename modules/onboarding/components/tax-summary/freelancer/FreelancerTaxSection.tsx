"use client";

import { Calculator, TrendingDown, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaxToggle } from "../tax-toggle.component";
import { useFreelancerState } from "@/modules/onboarding/hooks/tax/use-freelancer-state.hooks";
import { useFreelancerCalculation } from "@/modules/onboarding/hooks/tax/use-freelancer-calculation.hooks";
import { FreelancerTaxSectionProps } from "@/modules/onboarding/types/tax/freelancer.types";

export function FreelancerTaxSection({ averageMonthlyIncome }: FreelancerTaxSectionProps) {
  const { tssVoluntaria, registradoDGII, clientesRetienen, toggleTSS, toggleRegistradoDGII, toggleClientesRetienen } =
    useFreelancerState();

  const calc = useFreelancerCalculation({
    averageMonthlyIncome,
    tssVoluntaria,
    clientesRetienen,
  });

  return (
    <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4")}>
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
          <span className="font-medium">RD${calc.ingresoAnual.toLocaleString("es-DO")}</span>
        </div>

        {/* Gastos simplificados */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5 text-primary" />
            <span>Gastos simplificados DGII (40%)</span>
          </div>
          <span className="text-primary">
            -RD${calc.gastosSimplificados.toLocaleString("es-DO")}
          </span>
        </div>

        {/* Renta neta sujeta */}
        <div className="flex justify-between items-center text-sm border-t pt-2">
          <span className="text-muted-foreground">Renta neta sujeta a ISR</span>
          <span className="font-medium">RD${calc.rentaNeta.toLocaleString("es-DO")}</span>
        </div>

        {/* Estado ISR */}
        {!calc.pagaraISR ? (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <span>ISR</span>
            </div>
            <span className="text-xs text-muted-foreground italic">
              {calc.bajoPisoPorGastos ? "Renta neta bajo umbral — exento" : "No aplica"}
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>ISR Anual (Tramo {calc.tramoAplicable})</span>
              </div>
              <span className="text-destructive">
                -RD${calc.impuestoFinal.toLocaleString("es-DO")}
              </span>
            </div>

            {/* Retenciones aplicadas */}
            {clientesRetienen && calc.retencionesAnuales > 0 && (
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Retención 10% aplicada como crédito</span>
                <span className="text-primary">
                  -RD${Math.round(calc.retencionesAnuales).toLocaleString("es-DO")}
                </span>
              </div>
            )}

            {/* Reserva mensual */}
            <div className="flex justify-between items-center text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-amber-700">
                <Info className="w-3 h-3" />
                <span className="font-medium">Reserva mensual recomendada</span>
              </div>
              <span className="font-semibold text-amber-700">
                RD${calc.reservaMensualRecomendada.toLocaleString("es-DO")}
              </span>
            </div>
          </>
        )}

        {/* Tasa efectiva */}
        <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
          <span>Tasa efectiva ISR</span>
          <span>
            {calc.pagaraISR
              ? `${((calc.impuestoFinal / calc.ingresoAnual) * 100).toFixed(2)}%`
              : "0.00%"}
          </span>
        </div>

        {/* Nota educativa */}
        {calc.pagaraISR && (
          <div className="text-xs text-muted-foreground bg-muted/80 rounded-lg px-3 py-2">
            {registradoDGII
              ? "Esta es tu obligación estimada a declarar ante la DGII en tu IR-1 anual."
              : "Si estás registrado en la DGII, esta es tu obligación estimada. Si aún no declaras, formalizarte puede ayudarte a acceder a créditos, historial financiero y clientes corporativos."}
          </div>
        )}

        {/* Toggle: Registrado DGII */}
        <TaxToggle
          label="Estoy registrado en la DGII"
          description="Declaro ISR como persona física"
          checked={registradoDGII}
          onChange={toggleRegistradoDGII}
        />

        {/* Toggle: Clientes retienen */}
        <TaxToggle
          label="Mis clientes me retienen 10%"
          description="Empresas formales como agentes de retención"
          checked={clientesRetienen}
          onChange={toggleClientesRetienen}
        />

        {/* Explicación retención */}
        {clientesRetienen && (
          <div className="text-xs text-muted-foreground bg-muted/80 rounded-lg px-3 py-2">
            Tus clientes empresa retienen el 10% de tus honorarios y lo pagan a la DGII. Ese monto se descuenta de tu ISR anual como crédito fiscal.
          </div>
        )}

        {/* Toggle TSS */}
        <TaxToggle
          label="¿Cotizas TSS voluntaria? (5.91%)"
          description="Cobertura de salud y pensiones"
          checked={tssVoluntaria}
          onChange={toggleTSS}
        />

        {tssVoluntaria && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              <span>TSS voluntaria (5.91%)</span>
            </div>
            <span className="text-destructive">
              -RD${Math.round(calc.tssVoluntaria).toLocaleString("es-DO")}
            </span>
          </div>
        )}

        {/* Alerta ITBIS */}
        {calc.superaUmbralITBIS && (
          <div className="text-xs bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 space-y-1">
            <p className="font-semibold text-orange-700">⚠️ Umbral ITBIS superado</p>
            <p className="text-orange-600">
              Con ingresos superiores a RD$8,695,240 anuales debes inscribirte como contribuyente ordinario del ITBIS y cobrar 18% adicional a tus clientes.
            </p>
          </div>
        )}

        {/* Ingreso neto real */}
        <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Ingreso neto anual estimado</span>
          </div>
          <span className="font-bold text-primary">
            RD${Math.round(calc.ingresoNetoReal).toLocaleString("es-DO")}
          </span>
        </div>

        {/* Promedio mensual neto */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Promedio mensual disponible</span>
          <span className="font-medium">
            RD${Math.round(calc.ingresoNetoReal / 12).toLocaleString("es-DO")}
          </span>
        </div>
      </div>
    </div>
  );
}
