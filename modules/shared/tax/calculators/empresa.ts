import type { ISREmpresaCalculation } from "../types";
import { ISR_RATE_PJ, RETENCION_DIVIDENDOS } from "../constants";

/**
 * PERFIL DUEÑO DE NEGOCIO (Persona Jurídica)
 * Entrada: Beneficio neto (Ingresos - Gastos deducibles)
 * Tasa: 27% fijo sobre beneficio
 */
export function calcularISREmpresa(
  ingresosAnuales: number,
  gastosDeducibles: number,
  utilidadesRetiradas: number = 0,
  activosTotales: number = 0
): ISREmpresaCalculation {
  const beneficioNeto = Math.max(0, ingresosAnuales - gastosDeducibles);
  const impuestoISR = beneficioNeto * ISR_RATE_PJ;

  const detalles: string[] = [
    `Ingresos anuales: RD$${ingresosAnuales.toLocaleString("es-DO")}`,
    `Gastos deducibles: RD$${gastosDeducibles.toLocaleString("es-DO")}`,
    `Beneficio neto: RD$${beneficioNeto.toLocaleString("es-DO")}`,
    `Tasa ISR: ${(ISR_RATE_PJ * 100).toFixed(0)}%`,
    `Impuesto ISR: RD$${impuestoISR.toLocaleString("es-DO")}`,
  ];

  const result: ISREmpresaCalculation = {
    beneficioNeto,
    impuestoISR,
    tasaAplicable: ISR_RATE_PJ,
    detalles,
  };

  if (utilidadesRetiradas > 0) {
    result.retencionDividendos = utilidadesRetiradas * RETENCION_DIVIDENDOS;
    detalles.push(
      `Utilidades retiradas: RD$${utilidadesRetiradas.toLocaleString("es-DO")}`,
      `Retención 10% dividendos: RD$${result.retencionDividendos.toLocaleString("es-DO")}`
    );
  }

  if (activosTotales > 0) {
    result.impuesto1PorcientoActivos = activosTotales * 0.01;
    detalles.push(
      `Activos totales: RD$${activosTotales.toLocaleString("es-DO")}`,
      `Impuesto 1% sobre activos: RD$${result.impuesto1PorcientoActivos.toLocaleString("es-DO")}`
    );
  }

  result.anticipoMensual = impuestoISR / 12;
  detalles.push(
    `Anticipo mensual ISR: RD$${result.anticipoMensual.toLocaleString("es-DO")}`,
    `Total obligaciones fiscales: RD$${(
      impuestoISR +
      (result.retencionDividendos || 0) +
      (result.impuesto1PorcientoActivos || 0)
    ).toLocaleString("es-DO")}`
  );

  return result;
}
