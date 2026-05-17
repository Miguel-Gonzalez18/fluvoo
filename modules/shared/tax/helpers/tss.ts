import type { TaxParameters } from "../types";

/**
 * Calcula deducciones TSS con topes aplicados usando parámetros de la DB
 */
export function calcularDeduccionesTSS(
  salarioMensual: number,
  taxParams: TaxParameters
): {
  sfs: number;
  afp: number;
  total: number;
} {
  const sfsCeiling = taxParams.sfs_ceiling ?? 0;
  const afpCeiling = taxParams.afp_ceiling ?? 0;
  const sfsEmployeeRate = taxParams.sfs_employee ?? 0;
  const afpEmployeeRate = taxParams.afp_employee ?? 0;

  const salarioParaSFS = Math.min(salarioMensual, sfsCeiling);
  const salarioParaAFP = Math.min(salarioMensual, afpCeiling);

  const sfs = salarioParaSFS * sfsEmployeeRate;
  const afp = salarioParaAFP * afpEmployeeRate;

  return {
    sfs,
    afp,
    total: sfs + afp,
  };
}
