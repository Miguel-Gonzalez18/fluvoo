export interface ISREmpresaCalculation {
  beneficioNeto: number;
  impuestoISR: number;
  tasaAplicable: number;
  retencionDividendos?: number;
  anticipoMensual?: number;
  impuesto1PorcientoActivos?: number;
  detalles: string[];
}
