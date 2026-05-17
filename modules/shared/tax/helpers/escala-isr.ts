import type { ISRTaxBracket, TaxParameters } from "../types";
import { ISR_SCALE_PF } from "../constants";

/**
 * Aplica la escala ISR a la base imponible anual usando parámetros de la DB.
 * Si no se proveen taxParams, usa la escala hardcodeada como fallback.
 */
export function aplicarEscalaISR(
  baseImponibleAnual: number,
  taxParams?: TaxParameters
): {
  impuesto: number;
  tramo: number;
  detalle: string;
} {
  const brackets: ISRTaxBracket[] =
    (taxParams?.isr_brackets as ISRTaxBracket[] | null) ??
    ISR_SCALE_PF.map((b) => ({
      tramo: b.tramo,
      desde_anual: b.min,
      hasta_anual: b.max === Infinity ? null : b.max,
      tasa: b.rate,
      monto_fijo: b.fixed,
      descripcion: "",
    }));

  const bracket = brackets.find((b) => {
    const withinMin = baseImponibleAnual >= b.desde_anual;
    const withinMax =
      b.hasta_anual === null || baseImponibleAnual <= b.hasta_anual;
    return withinMin && withinMax;
  });

  if (!bracket) {
    return { impuesto: 0, tramo: 1, detalle: "Sin impuesto aplicable" };
  }

  if (bracket.tasa === 0) {
    const hastaTexto =
      bracket.hasta_anual !== null
        ? `hasta RD$${bracket.hasta_anual.toLocaleString("es-DO")}`
        : "";
    return {
      impuesto: 0,
      tramo: bracket.tramo,
      detalle: `Tramo ${bracket.tramo}: ${hastaTexto} exento`,
    };
  }

  const excedente = baseImponibleAnual - bracket.desde_anual;
  const impuestoVariable = excedente * bracket.tasa;
  const impuestoTotal = bracket.monto_fijo + impuestoVariable;

  return {
    impuesto: impuestoTotal,
    tramo: bracket.tramo,
    detalle: `Tramo ${bracket.tramo}: RD$${bracket.monto_fijo.toLocaleString(
      "es-DO"
    )} fijo + ${(bracket.tasa * 100).toFixed(0)}% del excedente (RD$${excedente.toLocaleString(
      "es-DO"
    )})`,
  };
}
