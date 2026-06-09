import { z } from "zod";

export const fiscalTipIconKeys = [
  "piggy-bank",
  "credit-card",
  "graduation-cap",
  "wallet",
  "home",
  "smartphone",
  "car",
  "briefcase",
  "shopping-cart",
  "shopping-bag",
  "hammer",
  "help-circle",
  "laptop",
  "shield-check",
  "trending-down",
  "sparkles",
  "calendar",
] as const;

export type FiscalTipIconKey = (typeof fiscalTipIconKeys)[number];

export const fiscalTipSchema = z.object({
  id: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(4).max(80),
  description: z.string().min(12).max(360),
  iconKey: z.enum(fiscalTipIconKeys),
  // Gemini structured output requires string enum values, not numbers.
  priority: z.enum(["1", "2", "3"]),
});

export const fiscalAnalysisResponseSchema = z.object({
  diagnosis: z.string().min(40).max(600),
  tips: z.array(fiscalTipSchema).min(2).max(3),
});

export type FiscalAnalysisResponse = z.infer<typeof fiscalAnalysisResponseSchema>;
export type FiscalAnalysisTipPayload = z.infer<typeof fiscalTipSchema>;

export interface FiscalAnalysisContext {
  profileType: "employee";
  monthLabel: string;
  hasSalary: boolean;
  grossSalaryMonthly: number;
  tssDeductionMonthly: number;
  netIncomeMonthly: number;
  expensesThisMonth: number;
  expensesLastMonth: number;
  marginMonthly: number;
  marginPercent: number | null;
  marginStatus: string;
  transactionCount: number;
  fixedObligationsMonthly: number;
  debtPaymentsMonthly: number;
  obligationCount: number;
  nextPayment: {
    daysUntil: number | null;
    label: string;
    amount: number;
  } | null;
  topCategories: Array<{
    name: string;
    amount: number;
    percent: number;
  }>;
  isr: {
    monthlyEstimate: number;
    annualEstimate: number;
    bracket: string;
  } | null;
  gmailConnected: boolean;
  dataCompleteness: "low" | "medium" | "high";
}
