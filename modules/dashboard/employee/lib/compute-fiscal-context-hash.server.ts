import { createHash } from "node:crypto";
import type { FiscalAnalysisContext } from "@/modules/shared/ai/fiscal-analysis.schema";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeFiscalContextHash(
  context: FiscalAnalysisContext
): string {
  const payload = {
    monthLabel: context.monthLabel,
    hasSalary: context.hasSalary,
    grossSalaryMonthly: roundMoney(context.grossSalaryMonthly),
    tssDeductionMonthly: roundMoney(context.tssDeductionMonthly),
    netIncomeMonthly: roundMoney(context.netIncomeMonthly),
    expensesThisMonth: roundMoney(context.expensesThisMonth),
    expensesLastMonth: roundMoney(context.expensesLastMonth),
    marginMonthly: roundMoney(context.marginMonthly),
    marginPercent:
      context.marginPercent === null
        ? null
        : roundMoney(context.marginPercent),
    transactionCount: context.transactionCount,
    fixedObligationsMonthly: roundMoney(context.fixedObligationsMonthly),
    debtPaymentsMonthly: roundMoney(context.debtPaymentsMonthly),
    obligationCount: context.obligationCount,
    nextPayment: context.nextPayment
      ? {
          daysUntil: context.nextPayment.daysUntil,
          label: context.nextPayment.label,
          amount: roundMoney(context.nextPayment.amount),
        }
      : null,
    topCategories: context.topCategories.map((category) => ({
      name: category.name,
      amount: roundMoney(category.amount),
      percent: category.percent,
    })),
    isr: context.isr
      ? {
          monthlyEstimate: roundMoney(context.isr.monthlyEstimate),
          annualEstimate: roundMoney(context.isr.annualEstimate),
          bracket: context.isr.bracket,
        }
      : null,
    gmailConnected: context.gmailConnected,
    dataCompleteness: context.dataCompleteness,
  };

  return createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}
