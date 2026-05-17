import type { TaxParameters, ISRCalculation } from "../types";
import { calcularDeduccionesTSS } from "../helpers/tss";
import { aplicarEscalaISR } from "../helpers/escala-isr";

/**
 * PERFIL ASALARIADO
 * Entrada: Sueldo Bruto Mensual
 * Deducciones: TSS (5.91% con topes)
 * Base imponible: Salario neto tras TSS, anualizado
 */
export function calcularISRAsalariado(
  salarioBrutoMensual: number,
  taxParams: TaxParameters
): ISRCalculation {
  const deducciones = calcularDeduccionesTSS(salarioBrutoMensual, taxParams);
  const salarioNetoMensual = salarioBrutoMensual - deducciones.total;
  const salarioNetoAnual = salarioNetoMensual * 12;

  const resultadoEscala = aplicarEscalaISR(salarioNetoAnual, taxParams);

  const sfsRatePct = ((taxParams.sfs_employee ?? 0) * 100).toFixed(2);
  const afpRatePct = ((taxParams.afp_employee ?? 0) * 100).toFixed(2);

  return {
    ingresoBrutoAnual: salarioBrutoMensual * 12,
    deduccionesTSS: deducciones.total * 12,
    baseImponible: salarioNetoAnual,
    impuestoCalculado: resultadoEscala.impuesto,
    impuestoMensual: resultadoEscala.impuesto / 12,
    tramoAplicable: resultadoEscala.tramo,
    detalles: [
      `Salario bruto mensual: RD$${salarioBrutoMensual.toLocaleString("es-DO")}`,
      `Deducción SFS (${sfsRatePct}%): RD$${deducciones.sfs.toLocaleString("es-DO")}/mes`,
      `Deducción AFP (${afpRatePct}%): RD$${deducciones.afp.toLocaleString("es-DO")}/mes`,
      `Total deducciones TSS: RD$${deducciones.total.toLocaleString("es-DO")}/mes`,
      `Salario neto mensual: RD$${salarioNetoMensual.toLocaleString("es-DO")}`,
      `Base imponible anual: RD$${salarioNetoAnual.toLocaleString("es-DO")}`,
      resultadoEscala.detalle,
      `Impuesto anual: RD$${resultadoEscala.impuesto.toLocaleString("es-DO")}`,
      `Impuesto mensual estimado: RD$${(resultadoEscala.impuesto / 12).toLocaleString("es-DO")}`,
    ],
  };
}
