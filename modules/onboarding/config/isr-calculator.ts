import { Tables } from "@/src/types/supabase";

// Type for ISR bracket structure (isr_brackets is Json in Supabase)
export interface ISRTaxBracket {
  tramo: number;
  desde_anual: number;
  hasta_anual: number | null;
  tasa: number;
  monto_fijo: number;
  descripcion: string;
}

export type TaxParameters = Tables<"tax_parameters">;

// ISR (Impuesto Sobre la Renta) Calculator for Dominican Republic
// Based on DGII regulations for fiscal year 2024

// ===== CONSTANTES DGII 2024 =====
// Nota: TSS y brackets ISR ahora se leen desde la tabla tax_parameters.
// Las constantes siguientes se mantienen como fallback para compatibilidad.

// Topes de salario para TSS (fallback)
export const TSS_CAPS = {
  sfs: 193815, // Tope SFS (3.04%)
  afp: 387630, // Tope AFP (2.87%)
} as const;

// Tasas TSS para empleados (fallback)
export const TSS_RATES = {
  sfs: 0.0304, // 3.04% - ARS/Seguro de Salud
  afp: 0.0287, // 2.87% - Fondo de Pensiones
  total: 0.0591, // 5.91% total
} as const;

// Escala anual ISR para Personas Físicas (fallback)
export const ISR_SCALE_PF = [
  { tramo: 1, min: 0, max: 416220.0, base: 0, rate: 0, fixed: 0 },
  { tramo: 2, min: 416220.01, max: 624329.0, base: 416220.0, rate: 0.15, fixed: 0 },
  { tramo: 3, min: 624329.01, max: 867123.0, base: 624329.0, rate: 0.2, fixed: 31216.0 },
  { tramo: 4, min: 867123.01, max: Infinity, base: 867123.0, rate: 0.25, fixed: 79776.0 },
] as const;

/** Porcentaje de gastos simplificados que la DGII permite deducir
 *  sobre honorarios brutos (sin justificar con NCF).
 *  Fuente: DGII, Código Tributario Art. 287 */
export const GASTOS_SIMPLIFICADOS_RATE = 0.40; // 40%

/** Umbral de exención ISR — primer tramo de la tabla ISR
 *  Renta neta anual por debajo de este monto paga 0% de ISR.
 *  Sin cambios desde 2017 (DGII RES-DDG-AR1-2025-00001) */
export const ISR_EXEMPTION_THRESHOLD = 416220;

/** Retención en la fuente cuando el cliente es empresa formal */
export const RETENCION_FUENTE_FREELANCE = 0.10; // 10%

/** Umbral anual de ingresos a partir del cual el freelancer
 *  debe registrarse como contribuyente ordinario del ITBIS */
export const ITBIS_THRESHOLD_ANNUAL = 8_695_240;

/** Tasa estándar del ITBIS */
export const ITBIS_RATE = 0.18;

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
  gastosSimplificados: number;
  rentaNeta: number;
  retenciones: number;
  impuestoFinal: number;
  reservaMensualRecomendada: number;
  tssVoluntaria: number;
  ingresoNetoReal: number;
  superaUmbralITBIS: boolean;
  tipoDeduccion: 'simplificado' | 'comprobados';
  gastosDeducibles: number;
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
 * Calcula deducciones TSS con topes aplicados usando parámetros de la DB
 */
function calcularDeduccionesTSS(
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

/**
 * Aplica la escala ISR a la base imponible anual usando parámetros de la DB
 * Si no se proveen taxParams, usa la escala hardcodeada como fallback.
 */
function aplicarEscalaISR(
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

// ===== CALCULADORAS POR PERFIL =====

/**
 * 1. PERFIL ASALARIADO
n * Entrada: Sueldo Bruto Mensual
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
      `Deducción SFS (${sfsRatePct}%): RD$${deducciones.sfs.toLocaleString(
        "es-DO"
      )}/mes`,
      `Deducción AFP (${afpRatePct}%): RD$${deducciones.afp.toLocaleString(
        "es-DO"
      )}/mes`,
      `Total deducciones TSS: RD$${deducciones.total.toLocaleString(
        "es-DO"
      )}/mes`,
      `Salario neto mensual: RD$${salarioNetoMensual.toLocaleString("es-DO")}`,
      `Base imponible anual: RD$${salarioNetoAnual.toLocaleString("es-DO")}`,
      resultadoEscala.detalle,
      `Impuesto anual: RD$${resultadoEscala.impuesto.toLocaleString("es-DO")}`,
      `Impuesto mensual estimado: RD$${(
        resultadoEscala.impuesto / 12
      ).toLocaleString("es-DO")}`,
    ],
  };
}

/**
 * 2. PERFIL FREELANCE (Persona Física)
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
  let tipoDeduccion: 'simplificado' | 'comprobados';

  if (usarGastoSimplificado) {
    // Gastos simplificados: 40% de honorarios brutos (DGII Art. 287)
    gastosDeducibles = honorariosBrutosAnuales * GASTOS_SIMPLIFICADOS_RATE;
    tipoDeduccion = 'simplificado';
  } else {
    // Gastos comprobados: lo que el freelancer pueda documentar con NCF
    gastosDeducibles = gastosComprobadosAnuales;
    tipoDeduccion = 'comprobados';
  }

  // PASO 2: Renta neta = honorarios - gastos deducibles
  const rentaNeta = Math.max(0, honorariosBrutosAnuales - gastosDeducibles);

  // PASO 3: Aplicar tabla ISR a la renta neta
  const resultadoEscala = aplicarEscalaISR(rentaNeta, taxParams);
  const isrCalculado = resultadoEscala.impuesto;

  // PASO 4: Descontar retenciones en la fuente (crédito fiscal)
  const impuestoFinal = Math.max(0, isrCalculado - retenciones10Pct);

  // PASO 5: TSS voluntaria (si el freelancer decide cotizar)
  const tssVoluntaria = cotizaTSSVoluntaria
    ? honorariosBrutosAnuales * 0.0591
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
      `Honorarios brutos anuales: RD$${honorariosBrutosAnuales.toLocaleString('es-DO')}`,
      `Gastos ${tipoDeduccion === 'simplificado' ? 'simplificados (40%)' : 'comprobados'}: -RD$${gastosDeducibles.toLocaleString('es-DO')}`,
      `Renta neta sujeta a ISR: RD$${rentaNeta.toLocaleString('es-DO')}`,
      resultadoEscala.detalle,
      `ISR calculado: RD$${isrCalculado.toLocaleString('es-DO')}`,
      retenciones10Pct > 0
        ? `Retenciones en fuente (10%): -RD$${retenciones10Pct.toLocaleString('es-DO')}`
        : 'Sin retenciones en fuente',
      `ISR final a pagar: RD$${impuestoFinal.toLocaleString('es-DO')}`,
      `Reserva mensual recomendada: RD$${reservaMensualRecomendada.toLocaleString('es-DO')}`,
      cotizaTSSVoluntaria
        ? `TSS voluntaria (5.91%): RD$${tssVoluntaria.toLocaleString('es-DO')}`
        : 'Sin TSS voluntaria',
      `Ingreso neto real anual: RD$${ingresoNetoReal.toLocaleString('es-DO')}`,
      superaUmbralITBIS
        ? '⚠️ Supera umbral ITBIS — debe inscribirse como contribuyente ordinario'
        : 'Bajo umbral ITBIS — no obligado a cobrar ITBIS',
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
    `Total obligaciones fiscales: RD$${(impuestoISR + (result.retencionDividendos || 0) + (result.impuesto1PorcientoActivos || 0)).toLocaleString('es-DO')
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
  ingresoMensual: number,
  taxParams: TaxParameters
): ComparativoISR[] {
  const ingresoAnual = ingresoMensual * 12;

  // Asalariado
  const asalariado = calcularISRAsalariado(ingresoMensual, taxParams);
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
        `Deducción: Gastos simplificados (${(GASTOS_SIMPLIFICADOS_RATE * 100).toFixed(0)}%)`,
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
