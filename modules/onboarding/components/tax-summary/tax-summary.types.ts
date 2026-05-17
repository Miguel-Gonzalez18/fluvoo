import { ProfileType } from "../../types/onboarding";

export interface TaxSummaryCardProps {
  profileType: ProfileType;
  monthlySalary?: number;
  averageMonthlyIncome?: number;
  businessMonthlyRevenue?: number;
  gastosEstimados?: number;
  className?: string;
}

export interface TaxCalculationData {
  ingresoBruto: number;
  deduccionesTSS: number;
  baseImponible: number;
  impuestoISR: number;
  totalDeducciones: number;
  ingresoNeto: number;
}

export interface TaxRowProps {
  label: string;
  value: string;
  isNegative?: boolean;
  isBold?: boolean;
  hasIcon?: "up" | "down" | "info" | null;
  className?: string;
  children?: React.ReactNode;
}

export interface TaxToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

export interface PeriodTabsProps {
  period: "annual" | "monthly" | "biweekly";
  onChange: (period: "annual" | "monthly" | "biweekly") => void;
}
