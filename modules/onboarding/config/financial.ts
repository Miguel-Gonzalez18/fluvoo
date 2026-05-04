import { Loan, HealthInsurance } from "../types/onboarding";

// ARS Insurance Providers - Lista completa de aseguradoras de salud en RD
export const ARS_PROVIDERS = [
  // ARS principales
  "ARS Humano",
  "ARS SEMMA",
  "ARS Palic",
  "ARS Universal",
  "ARS Renacer",
  "ARS Futuro",
  "ARS Monumental",
  "ARS Reservas",
  "ARS MetaSalud",
  "ARS Grupo Médico Asociado (GMA)",
  "ARS Crecer",
  "ARS Constitución",
  "ARS Yuniversal",
  // Administradoras de planes de salud
  "Plan Humano",
  "Plan SEMMA",
  "Plan Palic",
  "Plan Futuro",
  "Plan Renacer",
  "Plan Universal",
  "Plan Monumental",
  // Seguros de salud internacionales con presencia en RD
  "SENASA (Subsido/Contributivo)",
  "Nueva Humana",
  "La Colonial",
  "MAPFRE Salud",
  "Bupa",
  "Cigna",
  "Aetna",
  "Seguro Nacional de Salud (SENASA)",
  // Otras
  "Otra",
] as const;

export type ArsProvider = (typeof ARS_PROVIDERS)[number];

// Loan Types
export interface LoanTypeOption {
  value: Loan["loanType"];
  label: string;
}

export const LOAN_TYPES: LoanTypeOption[] = [
  { value: "personal", label: "Personal" },
  { value: "mortgage", label: "Hipotecario" },
  { value: "vehicle", label: "Vehicular" },
  { value: "business", label: "Empresarial" },
  { value: "credit_card", label: "Tarjeta de crédito" },
];

export const getLoanTypeLabel = (type: Loan["loanType"]): string =>
  LOAN_TYPES.find((t) => t.value === type)?.label ?? type;

// Business Types
export interface BusinessTypeOption {
  value: string;
  label: string;
}

export const BUSINESS_TYPES: BusinessTypeOption[] = [
  { value: "retail", label: "Retail / Tienda" },
  { value: "services", label: "Servicios" },
  { value: "restaurant", label: "Restaurante / Food" },
  { value: "technology", label: "Tecnología" },
  { value: "other", label: "Otro" },
];

// Default empty entities
export const createEmptyInsurance = (): HealthInsurance => ({
  id: crypto.randomUUID(),
  arsName: "",
  planType: "",
  monthlyPremium: 0,
});

export const createEmptyLoan = (): Loan => ({
  id: crypto.randomUUID(),
  loanType: "personal",
  lenderName: "",
  originalAmount: 0,
  annualRate: 0,
  termMonths: 0,
  monthlyPayment: 0,
  startDate: new Date().toISOString().split("T")[0],
});

// Dominican Financial Institutions (Banks & Cooperatives)
export interface FinancialInstitutionOption {
  value: string;
  label: string;
}

export const FINANCIAL_INSTITUTIONS: FinancialInstitutionOption[] = [
  // Bancos múltiples
  { value: "banco_popular", label: "Banco Popular Dominicano" },
  { value: "bhd_leon", label: "BHD León" },
  { value: "banco_bhd", label: "Banco BHD" },
  { value: "scotiabank", label: "Scotiabank" },
  { value: "banco_bdi", label: "Banco BDI" },
  { value: "banco_progresso", label: "Banco Progresso" },
  { value: "banco_santa_cruz", label: "Banco Santa Cruz" },
  { value: "banco_caroni", label: "Banco Caroní" },
  { value: "banco_de_reservas", label: "BanReservas" },
  { value: "banco_adopem", label: "Banco ADOPEM" },
  { value: "banco_bellbank", label: "Banco Bellbank" },
  { value: "banco_multiple_caribe", label: "Banco Múltiple Caribe" },
  { value: "citibank", label: "Citibank" },
  { value: "blh", label: "BLH (Banco López de Haro)" },
  { value: "asociacion_nacional", label: "Asociación Nacional de Ahorros y Préstamos" },
  { value: "apap", label: "APAP (Asociación Popular de Ahorros y Préstamos)" },
  // Bancos adicionales
  { value: "banco_vimenca", label: "Banco Vimenca" },
  { value: "banco_bancamerica", label: "Banco Bancamérica" },
  { value: "banco_lafise", label: "Banco Lafise" },
  { value: "banco_peravia", label: "Banco Peravia" },
  { value: "banco_oriental", label: "Banco Oriental" },
  { value: "banco_alaver", label: "Banco Alaver" },
  { value: "banco_transatlantico", label: "Banco Transatlántico" },
  { value: "banco_plaza", label: "Banco Plaza" },
  { value: "banco_union", label: "Banco Unión" },
  { value: "banco_cambiario", label: "Banco Cambiario" },
  { value: "banco_ahorros_credito_nacional", label: "Banco de Ahorros y Crédito Nacional" },
  { value: "banco_ahorro_higuay", label: "Banco de Ahorro y Crédito Higüey" },
  { value: "banco_ahorro_santiago", label: "Banco de Ahorro y Crédito Santiago" },
  { value: "banco_ahorro_vega", label: "Banco de Ahorro y Crédito La Vega" },
  { value: "banco_ahorro_adopem", label: "Banco de Ahorro y Crédito ADOPEM" },
  // Cooperativas
  { value: "coop_la_nacional", label: "Cooperativa La Nacional" },
  { value: "coop_san_jose", label: "Cooperativa San José" },
  { value: "coop_cibao", label: "Cooperativa del Cibao" },
  { value: "coop_santiago", label: "Cooperativa Santiago" },
  { value: "coop_mujeres", label: "Cooperativa de Mujeres" },
  { value: "coop_rodiguez", label: "Cooperativa Coronel Francisco Rodríguez" },
  { value: "coop_credifamilia", label: "Cooperativa Credifamilia" },
  { value: "coop_pegasus", label: "Cooperativa Pegasus" },
  { value: "coop_herrera", label: "Cooperativa Herrera" },
  { value: "coop_rivas", label: "Cooperativa Rivas" },
  { value: "coop_maimon", label: "Cooperativa Maimón" },
  { value: "coop_espinal", label: "Cooperativa Espinal" },
  { value: "coop_villa_hermosa", label: "Cooperativa Villa Hermosa" },
  { value: "coop_hermanas_mirabal", label: "Cooperativa Hermanas Mirabal" },
  { value: "coop_juan_pablo", label: "Cooperativa Juan Pablo Duarte" },
  // Financieras (Entidades de préstamo no bancarias)
  { value: "financiera_verde", label: "Financiera La Verde" },
  { value: "financiera_otra", label: "Financiera Otra" },
  { value: "financiera_ave", label: "Financiera AVE" },
  { value: "financiera_df", label: "Financiera DF" },
  { value: "financiera_emisora", label: "Financiera Emisora" },
  { value: "financiera_facil", label: "Financiera Fácil" },
  { value: "financiera_ags", label: "Financiera AGS" },
  { value: "financiera_dom", label: "Financiera DOM" },
  { value: "financiera_suda", label: "Financiera Suda" },
  { value: "financiera_confia", label: "Financiera Confía" },
  { value: "financiera_cash", label: "Financiera Cash" },
  { value: "financiera_promerica", label: "Financiera Promerica" },
  { value: "financiera_alternativa", label: "Financiera Alternativa" },
  // Asociaciones de ahorros y préstamos
  { value: "aap_bella_vista", label: "Asociación de Ahorros y Préstamos Bella Vista" },
  { value: "aap_cibao", label: "Asociación de Ahorros y Préstamos del Cibao" },
  { value: "aap_la_vega", label: "Asociación de Ahorros y Préstamos La Vega" },
  { value: "aap_maimon", label: "Asociación de Ahorros y Préstamos Maimón" },
  { value: "aap_higuey", label: "Asociación de Ahorros y Préstamos Higüey" },
  { value: "aap_moca", label: "Asociación de Ahorros y Préstamos Moca" },
  { value: "aap_san_juan", label: "Asociación de Ahorros y Préstamos San Juan" },
  { value: "aap_romana", label: "Asociación de Ahorros y Préstamos La Romana" },
  // Casas de préstamo
  { value: "casa_prestamo_sol", label: "Casa de Préstamo Sol" },
  { value: "casa_prestamo_confianza", label: "Casa de Préstamo Confianza" },
  { value: "casa_prestamo_nacional", label: "Casa de Préstamo Nacional" },
  // Prestamistas particulares / Privados
  { value: "prestamista_particular", label: "Prestamista Particular" },
  // Otros
  { value: "otros", label: "Otros" },
];

// SIPEN/ARS Configuration - Aporte obligatorio del empleado (3.04%)
export const SIPEN_CONFIG = {
  rate: 3.04,
  label: "3.04%",
  description: "Aporte obligatorio a ARS (Seguro Familiar de Salud). Empleado: 3.04% | Empleador: 7.09%",
  isMandatory: true,
} as const;

// AFP (Fondo de Pensiones) Configuration - Aporte obligatorio del empleado (2.87%)
export const AFP_CONFIG = {
  rate: 2.87,
  label: "2.87%",
  description: "Aporte obligatorio a AFP (Pensiones). Empleado: 2.87% | Empleador: 7.10%",
  isMandatory: true,
} as const;
