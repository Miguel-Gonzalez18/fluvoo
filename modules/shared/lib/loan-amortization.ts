import type { LoanType } from "@/modules/onboarding/types/onboarding";

export const LOAN_AMORTIZATION_NOTES = [
  "Resultados aproximados.",
  "Cálculo con meses de 30 días y año de 360 días.",
  "Sin período de gracia; primer vencimiento aprox. 30 días.",
  "Hipoteca: seguros y gastos no incluidos.",
] as const;

export type AmortizationRowStatus = "paid" | "upcoming" | "projected";

export interface AmortizationRow {
  installment: number;
  dueDate: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  status: AmortizationRowStatus;
}

export interface BuildAmortizationScheduleInput {
  originalAmount: number;
  currentBalance: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  startDate: string;
  paymentDueDay: number;
  referenceDate?: string;
}

function parseYmd(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

function formatYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function clampDueDay(year: number, month: number, dueDay: number): number {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Math.min(dueDay, daysInMonth);
}

/** Commercial periodic rate: 30-day month, 360-day year (SIB-style). */
function periodicRate(annualRatePercent: number): number {
  return (annualRatePercent / 100 / 360) * 30;
}

function buildDueDateForInstallment(
  startDate: string,
  paymentDueDay: number,
  installmentIndex: number
): string {
  const start = parseYmd(startDate);
  let month = start.month + installmentIndex + 1;
  let year = start.year;
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  const day = clampDueDay(year, month, paymentDueDay);
  return formatYmd(year, month, day);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildAmortizationSchedule(
  input: BuildAmortizationScheduleInput
): AmortizationRow[] {
  const {
    originalAmount,
    currentBalance,
    annualRate,
    termMonths,
    monthlyPayment,
    startDate,
    paymentDueDay,
    referenceDate,
  } = input;

  const rate = periodicRate(annualRate);
  const paidPrincipal = Math.max(0, originalAmount - currentBalance);
  let cumulativePrincipal = 0;

  const rows: AmortizationRow[] = [];
  let balance = originalAmount;

  for (let i = 0; i < termMonths; i += 1) {
    const interest = roundMoney(balance * rate);
    let principal = roundMoney(monthlyPayment - interest);
    if (principal < 0) principal = 0;

    if (i === termMonths - 1 || balance - principal < 0.01) {
      principal = roundMoney(balance);
    }

    const payment = roundMoney(principal + interest);
    balance = roundMoney(Math.max(0, balance - principal));

    cumulativePrincipal += principal;
    const isPaid = cumulativePrincipal <= paidPrincipal + 0.01 && paidPrincipal > 0;

    const dueDate = buildDueDateForInstallment(startDate, paymentDueDay, i);
    let status: AmortizationRowStatus = "projected";
    if (isPaid) {
      status = "paid";
    } else if (referenceDate && dueDate <= referenceDate) {
      status = "upcoming";
    }

    rows.push({
      installment: i + 1,
      dueDate,
      payment,
      principal,
      interest,
      balance,
      status,
    });

    if (balance <= 0) break;
  }

  return rows;
}

export function getAmortizationNotesForLoanType(loanType: LoanType): readonly string[] {
  if (loanType === "mortgage") {
    return LOAN_AMORTIZATION_NOTES;
  }
  return LOAN_AMORTIZATION_NOTES.filter(
    (note) => !note.startsWith("Hipoteca:")
  );
}
