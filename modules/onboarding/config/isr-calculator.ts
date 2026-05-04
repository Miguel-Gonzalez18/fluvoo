// ISR (Impuesto Sobre la Renta) Calculator for Dominican Republic
// Based on DGII regulations for fiscal year 2024

// ===== CONSTANTES DGII 2024 =====

// Topes de salario para TSS
export const TSS_CAPS = {
  sfs: 193815, // Tope SFS (3.04%)
  afp: 387630, // Tope AFP (2.87%)
} as const;

// Tasas TSS para empleados
export const TSS_RATES = {
  sfs: 0.0304, // 3.04% - ARS/Seguro de Salud
  afp: 0.0287, // 2.87% - Fondo de Pensiones
  total: 0.0591, // 5.91% total
} as const;

// Escala anual ISR para Personas Físicas (Asalariados y Freelancers)
// Año fiscal 2024
export const ISR_SCALE_PF = [
  { tramo: 1, min: 0, max: 416220.0, base: 0, rate: 0, fixed: 0 },
  { tramo: 2, min: 416220.01, max: 624329.0, base: 416220.0, rate: 0.15, fixed: 0 },
  { tramo: 3, min: 624329.01, max: 867123.0, base: 624329.0, rate: 0.2, fixed: 31216.0 },
  { tramo: 4, min: 867123.01, max: Infinity, base: 867123.0, rate: 0.25, fixed: 79776.0 },
] as const;

// Exención para gasto simplificado (Personas Físicas)
export const EXENCION_GASTO_SIMPLIFICADO = 416220;

// Tasa corporativa para Personas Jurídicas
export const ISR_RATE_PJ = 0.27; // 27% fijo

// Retención ISR para freelancers (cuando el cliente es empresa)
export const RETENCION_FREELANCE = 0.1; // 10%

// Retención dividendos
export const RETENCION_DIVIDENDOS = 0.1; // 10%

// ===== TIPOS =====

export interface ISRCalculation {
  ingresoBrutoAnual: number;
  deduccionesTSS: number;
  baseImponible: number;
  impuestoCalculado: number;
  impuestoMensual: number;
  tramoAplicable: number;
  detalles: string[];
}

export interface ISRFreelanceCalculation extends ISRCalculation {
  retenciones: number;
  impuestoFinal: number;
  tipoDeduccion: 'simplificado' | 'comprobados';
  gastosDeducibles?: number;
}

export interface ISREmpresaCalculation {
  beneficioNeto: number;
  impuestoISR: number;
  tasaAplicable: number;
  retencionDividendos?: number;
  anticipoMensual?: number;
  impuesto1PorcientoActivos?: number;
  detalles: string[];
}

// ===== FUNCIONES AUXILIARES =====

/**
 * Calcula deducciones TSS con topes aplicados
 */
function calcularDeduccionesTSS(salarioMensual: number): {
  sfs: number;
  afp: number;
  total: number;
} {
  const salarioParaSFS = Math.min(salarioMensual, TSS_CAPS.sfs);
  const salarioParaAFP = Math.min(salarioMensual, TSS_CAPS.afp);

  const sfs = salarioParaSFS * TSS_RATES.sfs;
  const afp = salarioParaAFP * TSS_RATES.afp;

  return {
    sfs,
    afp,
    total: sfs + afp,
  };
}

/**
 * Aplica la escala ISR a la base imponible anual
 */
function aplicarEscalaISR(baseImponibleAnual: number): {
  impuesto: number;
  tramo: number;
  detalle: string;
} {
  const tramo = ISR_SCALE_PF.find(
    (t) => baseImponibleAnual >= t.min && baseImponibleAnual <= t.max
  );

  if (!tramo) {
    return { impuesto: 0, tramo: 1, detalle: 'Sin impuesto aplicable' };
  }

  if (tramo.rate === 0) {
    return {
      impuesto: 0,
      tramo: tramo.tramo,
      detalle: `Tramo ${tramo.tramo}: hasta RD$${tramo.max.toLocaleString('es-DO')} exento`,
    };
  }

  const excedente = baseImponibleAnual - tramo.base;
  const impuestoVariable = excedente * tramo.rate;
  const impuestoTotal = tramo.fixed + impuestoVariable;

  return {
    impuesto: impuestoTotal,
    tramo: tramo.tramo,
    detalle: `Tramo ${tramo.tramo}: RD$${tramo.fixed.toLocaleString('es-DO')} fijo + ${(
      tramo.rate * 100
    ).toFixed(0)}% del excedente (RD$${excedente.toLocaleString('es-DO')})`,
  };
}

// ===== CALCULADORAS POR PERFIL =====

/**
 * 1. PERFIL ASALARIADO
n * Entrada: Sueldo Bruto Mensual
 * Deducciones: TSS (5.91% con topes)
 * Base imponible: Salario neto tras TSS, anualizado
 */
export function calcularISRAsalariado(
  salarioBrutoMensual: number
): ISRCalculation {
  const deducciones = calcularDeduccionesTSS(salarioBrutoMensual);
  const salarioNetoMensual = salarioBrutoMensual - deducciones.total;
  const salarioNetoAnual = salarioNetoMensual * 12;

  const resultadoEscala = aplicarEscalaISR(salarioNetoAnual);

  return {
    ingresoBrutoAnual: salarioBrutoMensual * 12,
    deduccionesTSS: deducciones.total * 12,
    baseImponible: salarioNetoAnual,
    impuestoCalculado: resultadoEscala.impuesto,
    impuestoMensual: resultadoEscala.impuesto / 12,
    tramoAplicable: resultadoEscala.tramo,
    detalles: [
      `Salario bruto mensual: RD$${salarioBrutoMensual.toLocaleString('es-DO')}`,
      `Deducción SFS (3.04%): RD$${deducciones.sfs.toLocaleString('es-DO')}/mes`,
      `Deducción AFP (2.87%): RD$${deducciones.afp.toLocaleString('es-DO')}/mes`,
      `Total deducciones TSS: RD$${deducciones.total.toLocaleString('es-DO')}/mes`,
      `Salario neto mensual: RD$${salarioNetoMensual.toLocaleString('es-DO')}`,
      `Base imponible anual: RD$${salarioNetoAnual.toLocaleString('es-DO')}`,
      resultadoEscala.detalle,
      `Impuesto anual: RD$${resultadoEscala.impuesto.toLocaleString('es-DO')}`,
      `Impuesto mensual estimado: RD$${(resultadoEscala.impuesto / 12).toLocaleString('es-DO')}`,
    ],
  };
}

/**
 * 2. PERFIL FREELANCE (Persona Física)
 * Entrada: Honorarios brutos
 * Retención: 10% si el cliente es empresa
 * Opciones de deducción: Gasto simplificado o gastos comprobados
 */
export function calcularISRFreelance(
  honorariosBrutosAnuales: number,
  gastosComprobados: number = 0,
  usasGastoSimplificado: boolean = true,
  retenciones10Porciento: number = 0
): ISRFreelanceCalculation {
  let baseImponible: number;
  let detalleDeduccion: string;

  if (usasGastoSimplificado) {
    // Gasto simplificado: exención de RD$416,220
    baseImponible = Math.max(0, honorariosBrutosAnuales - EXENCION_GASTO_SIMPLIFICADO);
    detalleDeduccion = `Gasto simplificado: RD$${EXENCION_GASTO_SIMPLIFICADO.toLocaleString('es-DO')} exentos`;
  } else {
    // Gastos comprobados: ingresos - gastos con NCF
    const rentaNeta = Math.max(0, honorariosBrutosAnuales - gastosComprobados);
    baseImponible = rentaNeta;
    detalleDeduccion = `Gastos comprobados: RD$${gastosComprobados.toLocaleString('es-DO')}`;
  }

  const resultadoEscala = aplicarEscalaISR(baseImponible);
  const impuestoFinal = Math.max(0, resultadoEscala.impuesto - retenciones10Porciento);

  return {
    ingresoBrutoAnual: honorariosBrutosAnuales,
    deduccionesTSS: 0, // Freelancers pagan seguridad social por separado
    baseImponible,
    impuestoCalculado: resultadoEscala.impuesto,
    impuestoMensual: resultadoEscala.impuesto / 12,
    tramoAplicable: resultadoEscala.tramo,
    retenciones: retenciones10Porciento,
    impuestoFinal,
    tipoDeduccion: usasGastoSimplificado ? 'simplificado' : 'comprobados',
    gastosDeducibles: usasGastoSimplificado ? EXENCION_GASTO_SIMPLIFICADO : gastosComprobados,
    detalles: [
      `Honorarios brutos anuales: RD$${honorariosBrutosAnuales.toLocaleString('es-DO')}`,
      detalleDeduccion,
      `Base imponible: RD$${baseImponible.toLocaleString('es-DO')}`,
      resultadoEscala.detalle,
      `Impuesto calculado: RD$${resultadoEscala.impuesto.toLocaleString('es-DO')}`,
      retenciones10Porciento > 0
        ? `Retenciones del 10%: RD$${retenciones10Porciento.toLocaleString('es-DO')}`
        : 'Sin retenciones (clientes personas físicas)',
      `Impuesto final a pagar: RD$${impuestoFinal.toLocaleString('es-DO')}`,
      `Pago mensual estimado: RD$${(impuestoFinal / 12).toLocaleString('es-DO')}`,
    ],
  };
}

/**
 * 3. PERFIL DUEÑO DE NEGOCIO (Persona Jurídica)
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
    `Ingresos anuales: RD$${ingresosAnuales.toLocaleString('es-DO')}`,
    `Gastos deducibles: RD$${gastosDeducibles.toLocaleString('es-DO')}`,
    `Beneficio neto: RD$${beneficioNeto.toLocaleString('es-DO')}`,
    `Tasa ISR: ${(ISR_RATE_PJ * 100).toFixed(0)}%`,
    `Impuesto ISR: RD$${impuestoISR.toLocaleString('es-DO')}`,
  ];

  const result: ISREmpresaCalculation = {
    beneficioNeto,
    impuestoISR,
    tasaAplicable: ISR_RATE_PJ,
    detalles,
  };

  // Retención por dividendos si aplica
  if (utilidadesRetiradas > 0) {
    result.retencionDividendos = utilidadesRetiradas * RETENCION_DIVIDENDOS;
    detalles.push(
      `Utilidades retiradas: RD$${utilidadesRetiradas.toLocaleString('es-DO')}`,
      `Retención 10% dividendos: RD$${result.retencionDividendos.toLocaleString('es-DO')}`
    );
  }

  // 1% sobre activos (si aplica según tipo de empresa)
  if (activosTotales > 0) {
    result.impuesto1PorcientoActivos = activosTotales * 0.01;
    detalles.push(
      `Activos totales: RD$${activosTotales.toLocaleString('es-DO')}`,
      `Impuesto 1% sobre activos: RD$${result.impuesto1PorcientoActivos.toLocaleString('es-DO')}`
    );
  }

  // Anticipo mensual (basado en impuesto del año anterior)
  result.anticipoMensual = impuestoISR / 12;
  detalles.push(
    `Anticipo mensual ISR: RD$${result.anticipoMensual.toLocaleString('es-DO')}`,
    `Total obligaciones fiscales: RD$${
      (impuestoISR + (result.retencionDividendos || 0) + (result.impuesto1PorcientoActivos || 0)).toLocaleString('es-DO')
    }`
  );

  return result;
}

/**
 * RST - Régimen Simplificado de Tributación
 * Para pequeños contribuyentes que califican
 * Paga % fijo sobre ingresos sin reportar gastos detallados
 */
export function calcularRST(ingresosAnuales: number, tasaRST: number = 0.02): {
  impuesto: number;
  tasa: number;
  detalles: string[];
} {
  const impuesto = ingresosAnuales * tasaRST;

  return {
    impuesto,
    tasa: tasaRST,
    detalles: [
      `Ingresos anuales: RD$${ingresosAnuales.toLocaleString('es-DO')}`,
      `Tasa RST: ${(tasaRST * 100).toFixed(1)}%`,
      `Impuesto RST: RD$${impuesto.toLocaleString('es-DO')}`,
      'No requiere llevar contabilidad completa',
      'Pago trimestral simplificado',
    ],
  };
}

// ===== RESUMEN COMPARATIVO =====

export interface ComparativoISR {
  perfil: 'asalariado' | 'freelance' | 'empresa';
  ingreso: number;
  cargaTributaria: number; // % del ingreso
  impuestoTotal: number;
  detalles: string[];
}

/**
 * Genera comparativo de carga tributaria entre perfiles
 * Útil para mostrar al usuario las diferencias fiscales
 */
export function generarComparativoISR(
  ingresoMensual: number
): ComparativoISR[] {
  const ingresoAnual = ingresoMensual * 12;

  // Asalariado
  const asalariado = calcularISRAsalariado(ingresoMensual);
  const cargaAsalariado = (asalariado.impuestoCalculado / ingresoAnual) * 100;

  // Freelance (con gasto simplificado)
  const freelance = calcularISRFreelance(ingresoAnual, 0, true, 0);
  const cargaFreelance = (freelance.impuestoFinal / ingresoAnual) * 100;

  // Empresa (asumiendo 30% de gastos)
  const empresa = calcularISREmpresa(ingresoAnual, ingresoAnual * 0.3);
  const cargaEmpresa = (empresa.impuestoISR / ingresoAnual) * 100;

  return [
    {
      perfil: 'asalariado',
      ingreso: ingresoAnual,
      cargaTributaria: cargaAsalariado,
      impuestoTotal: asalariado.impuestoCalculado,
      detalles: [
        `TSS: ${((TSS_RATES.total) * 100).toFixed(2)}% del salario`,
        `ISR efectivo: ${cargaAsalariado.toFixed(2)}%`,
        `Tramo: ${asalariado.tramoAplicable}`,
      ],
    },
    {
      perfil: 'freelance',
      ingreso: ingresoAnual,
      cargaTributaria: cargaFreelance,
      impuestoTotal: freelance.impuestoFinal,
      detalles: [
        `Deducción: RD$${EXENCION_GASTO_SIMPLIFICADO.toLocaleString('es-DO')} (simplificada)`,
        `ISR efectivo: ${cargaFreelance.toFixed(2)}%`,
        `Tramo: ${freelance.tramoAplicable}`,
      ],
    },
    {
      perfil: 'empresa',
      ingreso: ingresoAnual,
      cargaTributaria: cargaEmpresa,
      impuestoTotal: empresa.impuestoISR,
      detalles: [
        `Tasa: ${(ISR_RATE_PJ * 100).toFixed(0)}% sobre beneficio`,
        `ISR efectivo: ${cargaEmpresa.toFixed(2)}%`,
        'Considerar anticipos mensuales',
      ],
    },
  ];
}
