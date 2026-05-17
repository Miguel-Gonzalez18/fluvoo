import type { TaxParameters, ComparativoISR } from "../types";
import { TSS_RATES } from "../constants/tss";
import { GASTOS_SIMPLIFICADOS_RATE } from "../constants/isr-pf";
import { ISR_RATE_PJ } from "../constants/isr-pj";
import { calcularISRAsalariado } from "./asalariado";
import { calcularISRFreelance } from "./freelance";
import { calcularISREmpresa } from "./empresa";

/**
 * Genera comparativo de carga tributaria entre perfiles.
 * Útil para mostrar al usuario las diferencias fiscales.
 */
export function generarComparativoISR(
  ingresoMensual: number,
  taxParams: TaxParameters
): ComparativoISR[] {
  const ingresoAnual = ingresoMensual * 12;

  const asalariado = calcularISRAsalariado(ingresoMensual, taxParams);
  const cargaAsalariado = (asalariado.impuestoCalculado / ingresoAnual) * 100;

  const freelance = calcularISRFreelance(ingresoAnual, 0, true, 0);
  const cargaFreelance = (freelance.impuestoFinal / ingresoAnual) * 100;

  const empresa = calcularISREmpresa(ingresoAnual, ingresoAnual * 0.3);
  const cargaEmpresa = (empresa.impuestoISR / ingresoAnual) * 100;

  return [
    {
      perfil: "asalariado",
      ingreso: ingresoAnual,
      cargaTributaria: cargaAsalariado,
      impuestoTotal: asalariado.impuestoCalculado,
      detalles: [
        `TSS: ${(TSS_RATES.total * 100).toFixed(2)}% del salario`,
        `ISR efectivo: ${cargaAsalariado.toFixed(2)}%`,
        `Tramo: ${asalariado.tramoAplicable}`,
      ],
    },
    {
      perfil: "freelance",
      ingreso: ingresoAnual,
      cargaTributaria: cargaFreelance,
      impuestoTotal: freelance.impuestoFinal,
      detalles: [
        `Deducción: Gastos simplificados (${(GASTOS_SIMPLIFICADOS_RATE * 100).toFixed(0)}%)`,
        `ISR efectivo: ${cargaFreelance.toFixed(2)}%`,
        `Tramo: ${freelance.tramoAplicable}`,
      ],
    },
    {
      perfil: "empresa",
      ingreso: ingresoAnual,
      cargaTributaria: cargaEmpresa,
      impuestoTotal: empresa.impuestoISR,
      detalles: [
        `Tasa: ${(ISR_RATE_PJ * 100).toFixed(0)}% sobre beneficio`,
        `ISR efectivo: ${cargaEmpresa.toFixed(2)}%`,
        "Considerar anticipos mensuales",
      ],
    },
  ];
}
