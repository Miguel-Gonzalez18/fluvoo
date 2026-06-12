import type { KpiTrend } from "@/modules/dashboard/employee/types/dashboard.types";
import type { TransactionsSummaryKpi } from "@/modules/dashboard/employee/types/transactions.types";

export function buildExpensesSubtext(
  thisMonthTotal: number,
  lastMonthTotal: number,
  transactionCount: number
): { subtext: string; trend: KpiTrend } {
  if (lastMonthTotal > 0) {
    const changePct = Math.round(
      ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    );
    if (changePct > 0) {
      return {
        subtext: `↑ ${changePct}% vs mes anterior`,
        trend: "negative",
      };
    }
    if (changePct < 0) {
      return {
        subtext: `↓ ${Math.abs(changePct)}% vs mes anterior`,
        trend: "positive",
      };
    }
    return {
      subtext: "Sin cambio vs mes anterior",
      trend: "neutral",
    };
  }

  if (transactionCount === 0) {
    return {
      subtext: "Obligaciones registradas este mes",
      trend: thisMonthTotal > 0 ? "negative" : "neutral",
    };
  }

  return {
    subtext: `${transactionCount} transacción${transactionCount === 1 ? "" : "es"} + obligaciones`,
    trend: "neutral",
  };
}

export function buildMarginMeta(
  marginValue: number,
  netIncomeValue: number
): { subtext: string; trend: KpiTrend } {
  if (netIncomeValue <= 0) {
    return {
      subtext: "Configura tu ingreso mensual",
      trend: "neutral",
    };
  }

  const ratio = marginValue / netIncomeValue;

  if (marginValue <= 0) {
    return {
      subtext: "Alerta: gastos iguales o mayores al ingreso",
      trend: "negative",
    };
  }

  if (ratio < 0.1) {
    return {
      subtext: "Alerta: margen muy corto",
      trend: "negative",
    };
  }

  if (ratio < 0.25) {
    return {
      subtext: "Margen moderado, vigila tus pagos",
      trend: "neutral",
    };
  }

  return {
    subtext: "Margen amplio después de gastos",
    trend: "positive",
  };
}

export function buildIncomeSubtext(
  thisMonthIncome: number,
  lastMonthIncome: number,
  hasSalary: boolean
): { subtext: string; trend: KpiTrend } {
  if (lastMonthIncome > 0) {
    const changePct = Math.round(
      ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
    );
    if (changePct > 0) {
      return {
        subtext: `↑ ${changePct}% vs mes anterior`,
        trend: "positive",
      };
    }
    if (changePct < 0) {
      return {
        subtext: `↓ ${Math.abs(changePct)}% vs mes anterior`,
        trend: "negative",
      };
    }
    return {
      subtext: "Sin cambio vs mes anterior",
      trend: "neutral",
    };
  }

  return {
    subtext: hasSalary
      ? "Salario mensual − deducciones TSS"
      : "Configura tu salario en el perfil",
    trend: hasSalary ? "positive" : "neutral",
  };
}

export interface MonthlyFinancialSummaryInput {
  netIncomeValue: number;
  hasSalary: boolean;
  thisMonthExpenses: number;
  lastMonthExpenses: number;
  thisMonthTransactionCount: number;
  thisMonthIncomeTx: number;
  lastMonthIncomeTx: number;
}

export function buildMonthlyFinancialSummary(
  input: MonthlyFinancialSummaryInput
): {
  income: TransactionsSummaryKpi;
  expenses: TransactionsSummaryKpi;
  margin: TransactionsSummaryKpi;
} {
  const marginValue = input.netIncomeValue - input.thisMonthExpenses;
  const expensesMeta = buildExpensesSubtext(
    input.thisMonthExpenses,
    input.lastMonthExpenses,
    input.thisMonthTransactionCount
  );
  const marginMeta = buildMarginMeta(marginValue, input.netIncomeValue);
  const incomeMeta = buildIncomeSubtext(
    input.thisMonthIncomeTx,
    input.lastMonthIncomeTx,
    input.hasSalary
  );

  return {
    income: {
      label: "Ingresos",
      value: input.netIncomeValue,
      subtext: incomeMeta.subtext,
      trend: incomeMeta.trend,
    },
    expenses: {
      label: "Gastos",
      value: input.thisMonthExpenses,
      subtext: expensesMeta.subtext,
      trend: expensesMeta.trend,
    },
    margin: {
      label: "Margen del Mes",
      value: marginValue,
      subtext: marginMeta.subtext,
      trend: marginMeta.trend,
    },
  };
}
