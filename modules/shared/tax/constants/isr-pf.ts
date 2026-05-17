export const ISR_SCALE_PF = [
  { tramo: 1, min: 0, max: 416220.0, base: 0, rate: 0, fixed: 0 },
  { tramo: 2, min: 416220.01, max: 624329.0, base: 416220.0, rate: 0.15, fixed: 0 },
  { tramo: 3, min: 624329.01, max: 867123.0, base: 624329.0, rate: 0.2, fixed: 31216.0 },
  { tramo: 4, min: 867123.01, max: Infinity, base: 867123.0, rate: 0.25, fixed: 79776.0 },
] as const;

/** Umbral de exención ISR — primer tramo de la tabla ISR.
 *  Renta neta anual por debajo de este monto paga 0% de ISR. */
export const ISR_EXEMPTION_THRESHOLD = 416220;

/** Porcentaje de gastos simplificados que la DGII permite deducir
 *  sobre honorarios brutos (sin justificar con NCF).
 *  Fuente: DGII, Código Tributario Art. 287 */
export const GASTOS_SIMPLIFICADOS_RATE = 0.40;
