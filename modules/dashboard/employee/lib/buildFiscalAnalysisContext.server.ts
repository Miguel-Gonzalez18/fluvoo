import type { FiscalAnalysisContext } from "@/modules/shared/ai/fiscal-analysis.schema";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";
import { resolveCardPaymentTotalInDop } from "./resolve-card-payment-total";
import { calcularISRAsalariado } from "@/modules/shared/tax";
import type { TaxParameters } from "@/modules/shared/tax/types";
import type { PaymentCandidate } from "./financial-obligations.types";

interface BuildFiscalAnalysisContextInput {
  salary: number;
  tssDeduction: number;
  netIncomeMonthly: number;
  expensesThisMonth: number;
  expensesLastMonth: number;
  marginMonthly: number;
  marginStatus: string;
  transactionCount: number;
  categories: CategoryExpense[];
  obligationsSnapshot: FinancialObligationsSnapshot;
  nextCandidate: PaymentCandidate | undefined;
  today: Date;
  usdToDopRate: number;
  gmailConnected: boolean;
  taxParams: TaxParameters | null;
}

function sumDebtPayments(
  snapshot: FinancialObligationsSnapshot,
  referenceDate: Date,
  usdToDopRate: number
): number {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const consolidatedCardIds = new Set<string>();
  let total = 0;

  for (const loan of snapshot.loans) {
    if (loan.status !== "active") continue;
    total += loan.monthly_payment;
  }

  for (const card of snapshot.creditCards) {
    if (card.status !== "active") continue;
    consolidatedCardIds.add(card.id);
    total += resolveCardPaymentTotalInDop(
      card,
      snapshot.creditCardInstallments,
      usdToDopRate,
      year,
      month
    );
  }

  for (const installment of snapshot.creditCardInstallments) {
    if (installment.status !== "active") continue;
    if (consolidatedCardIds.has(installment.credit_card_id)) continue;
    total += installment.monthly_payment;
  }

  return Math.round(total * 100) / 100;
}

function resolveDataCompleteness(input: {
  hasSalary: boolean;
  obligationCount: number;
  transactionCount: number;
  gmailConnected: boolean;
}): FiscalAnalysisContext["dataCompleteness"] {
  if (!input.hasSalary) return "low";
  if (input.obligationCount === 0 && input.transactionCount === 0) return "low";
  if (input.transactionCount > 0 && input.obligationCount > 0) return "high";
  return "medium";
}

export function buildFiscalAnalysisContext(
  input: BuildFiscalAnalysisContextInput
): FiscalAnalysisContext {
  const hasSalary = input.salary > 0;
  const fixedObligationsMonthly = input.obligationsSnapshot.fixedObligations
    .filter((o) => o.status === "active")
    .reduce((sum, o) => sum + o.monthly_amount, 0);

  const debtPaymentsMonthly = sumDebtPayments(
    input.obligationsSnapshot,
    input.today,
    input.usdToDopRate
  );

  const obligationCount =
    input.obligationsSnapshot.fixedObligations.filter((o) => o.status === "active")
      .length +
    input.obligationsSnapshot.loans.filter((l) => l.status === "active").length +
    input.obligationsSnapshot.creditCards.filter((c) => c.status === "active")
      .length;

  const marginPercent =
    hasSalary && input.netIncomeMonthly > 0
      ? Math.round((input.marginMonthly / input.netIncomeMonthly) * 1000) / 10
      : null;

  const topCategories = input.categories
    .slice(0, 5)
    .map((item) => ({
      name: item.category,
      amount: Math.round(item.amount),
      percent:
        input.expensesThisMonth > 0
          ? Math.round((item.amount / input.expensesThisMonth) * 1000) / 10
          : 0,
    }));

  let isr: FiscalAnalysisContext["isr"] = null;
  if (hasSalary && input.taxParams) {
    const result = calcularISRAsalariado(input.salary, input.taxParams);
    isr = {
      monthlyEstimate: Math.round(result.impuestoMensual),
      annualEstimate: Math.round(result.impuestoCalculado),
      bracket: String(result.tramoAplicable),
    };
  }

  const monthLabel = input.today.toLocaleDateString("es-DO", {
    month: "long",
    year: "numeric",
  });

  let nextPayment: FiscalAnalysisContext["nextPayment"] = null;
  if (input.nextCandidate) {
    const daysUntil = Math.max(
      0,
      Math.ceil(
        (input.nextCandidate.dueDate.getTime() - input.today.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    nextPayment = {
      daysUntil,
      label: input.nextCandidate.shortLabel,
      amount: Math.round(input.nextCandidate.amount),
    };
  }

  return {
    profileType: "employee",
    monthLabel,
    hasSalary,
    grossSalaryMonthly: Math.round(input.salary),
    tssDeductionMonthly: Math.round(input.tssDeduction),
    netIncomeMonthly: Math.round(input.netIncomeMonthly),
    expensesThisMonth: Math.round(input.expensesThisMonth),
    expensesLastMonth: Math.round(input.expensesLastMonth),
    marginMonthly: Math.round(input.marginMonthly),
    marginPercent,
    marginStatus: input.marginStatus,
    transactionCount: input.transactionCount,
    fixedObligationsMonthly: Math.round(fixedObligationsMonthly),
    debtPaymentsMonthly,
    obligationCount,
    nextPayment,
    topCategories,
    isr,
    gmailConnected: input.gmailConnected,
    dataCompleteness: resolveDataCompleteness({
      hasSalary,
      obligationCount,
      transactionCount: input.transactionCount,
      gmailConnected: input.gmailConnected,
    }),
  };
}
