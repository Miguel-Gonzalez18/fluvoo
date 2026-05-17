/**
 * RST - Régimen Simplificado de Tributación
 * Para pequeños contribuyentes que califican.
 * Paga % fijo sobre ingresos sin reportar gastos detallados.
 */
export function calcularRST(
  ingresosAnuales: number,
  tasaRST: number = 0.02
): {
  impuesto: number;
  tasa: number;
  detalles: string[];
} {
  const impuesto = ingresosAnuales * tasaRST;

  return {
    impuesto,
    tasa: tasaRST,
    detalles: [
      `Ingresos anuales: RD$${ingresosAnuales.toLocaleString("es-DO")}`,
      `Tasa RST: ${(tasaRST * 100).toFixed(1)}%`,
      `Impuesto RST: RD$${impuesto.toLocaleString("es-DO")}`,
      "No requiere llevar contabilidad completa",
      "Pago trimestral simplificado",
    ],
  };
}
