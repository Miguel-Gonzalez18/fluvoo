import type { ISRCalculation } from "./base";

export interface ISRFreelanceCalculation extends ISRCalculation {
  gastosSimplificados: number;
  rentaNeta: number;
  retenciones: number;
  impuestoFinal: number;
  reservaMensualRecomendada: number;
  tssVoluntaria: number;
  ingresoNetoReal: number;
  superaUmbralITBIS: boolean;
  tipoDeduccion: "simplificado" | "comprobados";
  gastosDeducibles: number;
}
