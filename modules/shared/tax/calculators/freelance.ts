import type { TaxParameters, ISRFreelanceCalculation } from "../types";
import { aplicarEscalaISR } from "../helpers/escala-isr";
import { GASTOS_SIMPLIFICADOS_RATE, ITBIS_THRESHOLD_ANNUAL } from "../constants";
import { TSS_RATES } from "../constants/tss";

/**
 * PERFIL FREELANCE (Persona Física)
 * Entrada: Honorarios brutos
 * Retención: 10% si el cliente es empresa
 * Opciones de deducción: Gasto simplificado (40%) o gastos comprobados
 */
export function calcularISRFreelance(
  honorariosBrutosAnuales: number,
  gastosComprobadosAnuales: number = 0,
  usarGastoSimplificado: boolean = true,
  retenciones10Pct: number = 0,
  cotizaTSSVoluntaria: boolean = false,
  taxParams?: TaxParameters
): ISRFreelanceCalculation {
  // PASO 1: Calcular gastos deducibles
  let gastosDeducibles: number;
  let tipoDeduccion: "simplificado" | "comprobados";

  if (usarGastoSimplificado) {
    gastosDeducibles = honorariosBrutosAnuales * GASTOS_SIMPLIFICADOS_RATE;
    tipoDeduccion = "simplificado";
  } else {
    gastosDeducibles = gastosComprobadosAnuales;
    tipoDeduccion = "comprobados";
  }

  // PASO 2: Renta neta = honorarios - gastos deducibles
  const rentaNeta = Math.max(0, honorariosBrutosAnuales - gastosDeducibles);

  // PASO 3: Aplicar tabla ISR a la renta neta
  const resultadoEscala = aplicarEscalaISR(rentaNeta, taxParams);
  const isrCalculado = resultadoEscala.impuesto;

  // PASO 4: Descontar retenciones en la fuente (crédito fiscal)
  const impuestoFinal = Math.max(0, isrCalculado - retenciones10Pct);

  // PASO 5: TSS voluntaria (usa constante en vez de hardcode)
  const tssVoluntaria = cotizaTSSVoluntaria
    ? honorariosBrutosAnuales * TSS_RATES.total
    : 0;

  // PASO 6: Ingreso neto real anual
  const ingresoNetoReal = honorariosBrutosAnuales - impuestoFinal - tssVoluntaria;

  // PASO 7: Reserva mensual recomendada para ISR
  const reservaMensualRecomendada = impuestoFinal > 0
    ? Math.ceil(impuestoFinal / 12)
    : 0;

  // PASO 8: Verificar si supera umbral de ITBIS
  const superaUmbralITBIS = honorariosBrutosAnuales > ITBIS_THRESHOLD_ANNUAL;

  return {
    ingresoBrutoAnual: honorariosBrutosAnuales,
    deduccionesTSS: tssVoluntaria,
    gastosSimplificados: gastosDeducibles,
    rentaNeta,
    baseImponible: rentaNeta,
    impuestoCalculado: isrCalculado,
    impuestoMensual: isrCalculado / 12,
    tramoAplicable: resultadoEscala.tramo,
    retenciones: retenciones10Pct,
    impuestoFinal,
    reservaMensualRecomendada,
    tssVoluntaria,
    ingresoNetoReal,
    superaUmbralITBIS,
    tipoDeduccion,
    gastosDeducibles,
    detalles: [
      `Honorarios brutos anuales: RD$${honorariosBrutosAnuales.toLocaleString("es-DO")}`,
      `Gastos ${tipoDeduccion === "simplificado" ? "simplificados (40%)" : "comprobados"}: -RD$${gastosDeducibles.toLocaleString("es-DO")}`,
      `Renta neta sujeta a ISR: RD$${rentaNeta.toLocaleString("es-DO")}`,
      resultadoEscala.detalle,
      `ISR calculado: RD$${isrCalculado.toLocaleString("es-DO")}`,
      retenciones10Pct > 0
        ? `Retenciones en fuente (10%): -RD$${retenciones10Pct.toLocaleString("es-DO")}`
        : "Sin retenciones en fuente",
      `ISR final a pagar: RD$${impuestoFinal.toLocaleString("es-DO")}`,
      `Reserva mensual recomendada: RD$${reservaMensualRecomendada.toLocaleString("es-DO")}`,
      cotizaTSSVoluntaria
        ? `TSS voluntaria (${(TSS_RATES.total * 100).toFixed(2)}%): RD$${tssVoluntaria.toLocaleString("es-DO")}`
        : "Sin TSS voluntaria",
      `Ingreso neto real anual: RD$${ingresoNetoReal.toLocaleString("es-DO")}`,
      superaUmbralITBIS
        ? "⚠️ Supera umbral ITBIS — debe inscribirse como contribuyente ordinario"
        : "Bajo umbral ITBIS — no obligado a cobrar ITBIS",
    ],
  };
}
