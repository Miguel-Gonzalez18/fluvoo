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
  // Bancos Múltiples
  { value: "banco_popular", label: "Banco Popular Dominicano" },
  { value: "banco_reservas", label: "Banreservas" },
  { value: "banco_bhd", label: "Banco BHD" },
  { value: "banco_scotiabank", label: "Scotiabank" },
  { value: "banco_santa_cruz", label: "Banco Santa Cruz" },
  { value: "banco_bdi", label: "Banco BDI" },
  { value: "banco_caribe", label: "Banco Múltiple Caribe" },
  { value: "banco_lopez_de_haro", label: "Banco López de Haro (BLH)" },
  { value: "banco_promerica", label: "Banco Promerica" },
  { value: "banco_banesco", label: "Banesco" },
  { value: "banco_vimenca", label: "Banco Vimenca" },
  { value: "banco_lafise", label: "Banco Lafise" },
  { value: "banco_ademi", label: "Banco ADEMI" },
  { value: "banco_jmmb", label: "JMMB Bank" },
  { value: "banco_activo", label: "Banco Activo" },
  { value: "banco_citibank", label: "Citibank" },
  { value: "banco_qik", label: "Qik Banco Digital" },
  { value: "banco_alaver", label: "Banco Múltiple ALAVER" },

  // Bancos de Ahorro y Crédito
  { value: "banco_adopem", label: "Banco ADOPEM" },
  { value: "banco_bacc", label: "Banco BACC (Ahorro y Crédito del Caribe)" },
  { value: "banco_fihogar", label: "Banco Fihogar" },
  { value: "banco_union", label: "Banco Unión" },

  // Asociaciones de Ahorros y Préstamos
  { value: "apap", label: "Asociación Popular de Ahorros y Préstamos (APAP)" },
  { value: "asociacion_nacional", label: "Asociación La Nacional de Ahorros y Préstamos" },
  { value: "asociacion_cibao", label: "Asociación Cibao de Ahorros y Préstamos (ACAP)" },
  { value: "asociacion_duarte", label: "Asociación Duarte de Ahorros y Préstamos (ADAP)" },
  { value: "asociacion_romana", label: "Asociación Romana de Ahorros y Préstamos" },
  { value: "asociacion_mocana", label: "Asociación Mocana de Ahorros y Préstamos" },
  { value: "asociacion_maguana", label: "Asociación Maguana de Ahorros y Préstamos" },
  { value: "asociacion_peravia", label: "Asociación Peravia de Ahorros y Préstamos" },

  // Cooperativas principales
  { value: "coopmaimon", label: "Cooperativa Maimón (COOPMAIMON)" },
  { value: "coopmedica", label: "Coopmédica" },
  { value: "vega_real", label: "Cooperativa Vega Real" },
  { value: "la_telefonica", label: "La Cooperativa de Servicios Múltiples la Telefónica" },

  // Otras entidades
  { value: "prestamista_particular", label: "Prestamista Particular" },
  { value: "otros", label: "Otros" }
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
