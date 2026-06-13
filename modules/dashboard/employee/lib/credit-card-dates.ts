import { getTodayYmdInSantoDomingo } from "@/modules/dashboard/employee/lib/obligations/generate-loan-cycles.server";
import type { CommitmentDueStatus } from "@/modules/dashboard/employee/types/transactions.types";

export interface RollingCreditCardDates {
  nextStatementCloseDate: string;
  nextPaymentDueDate: string;
}

/** Plazo típico entre corte y pago en RD (~20–22 días; ver Circular SIB 005/11, Banreservas, ProUsuario). */
export const CREDIT_CARD_DEFAULT_GRACE_DAYS = 22;

export const CREDIT_CARD_PAYMENT_AFTER_CLOSE_MESSAGE =
  "La fecha límite de pago debe ser posterior al corte (en RD suele ser 15–25 días después, típico ~20–22)";

function parseYmd(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

function formatYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function addOneMonthSameDay(dateYmd: string): string {
  const { year, month, day } = parseYmd(dateYmd);
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  const clampedDay = Math.min(day, daysInMonth(nextYear, nextMonth));
  return formatYmd(nextYear, nextMonth, clampedDay);
}

export function advanceDateUntilFuture(
  dateYmd: string,
  todayYmd: string
): string {
  let current = dateYmd;
  let guard = 0;
  while (current < todayYmd && guard < 120) {
    current = addOneMonthSameDay(current);
    guard += 1;
  }
  return current;
}

export function addDaysYmd(dateYmd: string, days: number): string {
  const date = new Date(`${dateYmd}T12:00:00`);
  date.setDate(date.getDate() + days);
  return formatYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function daysBetweenYmd(fromYmd: string, toYmd: string): number {
  const from = new Date(`${fromYmd}T12:00:00`);
  const to = new Date(`${toYmd}T12:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export function isPaymentDueAfterStatementClose(
  paymentYmd: string,
  closeYmd: string
): boolean {
  return paymentYmd > closeYmd;
}

export function computeGraceDaysBetweenCloseAndPayment(
  closeYmd: string,
  paymentYmd: string
): number {
  if (!isPaymentDueAfterStatementClose(paymentYmd, closeYmd)) {
    return CREDIT_CARD_DEFAULT_GRACE_DAYS;
  }
  return daysBetweenYmd(closeYmd, paymentYmd);
}

export function derivePaymentDueFromClose(
  closeYmd: string,
  graceDays: number = CREDIT_CARD_DEFAULT_GRACE_DAYS
): string {
  return addDaysYmd(closeYmd, Math.max(1, graceDays));
}

export function resolveRollingCreditCardDates(
  dates: RollingCreditCardDates,
  referenceDate: Date = new Date()
): RollingCreditCardDates {
  const todayYmd = getTodayYmdInSantoDomingo(referenceDate);
  const graceDays = computeGraceDaysBetweenCloseAndPayment(
    dates.nextStatementCloseDate,
    dates.nextPaymentDueDate
  );

  const nextStatementCloseDate = advanceDateUntilFuture(
    dates.nextStatementCloseDate,
    todayYmd
  );
  const nextPaymentDueDate = derivePaymentDueFromClose(
    nextStatementCloseDate,
    graceDays
  );

  return { nextStatementCloseDate, nextPaymentDueDate };
}

export function dayFromYmd(dateYmd: string): number {
  return parseYmd(dateYmd).day;
}

export function formatCreditCardDateLabel(dateYmd: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(`${dateYmd}T12:00:00`));
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function buildDateDueStatus(
  dueDateYmd: string,
  referenceDate: Date = new Date()
): CommitmentDueStatus {
  const today = startOfDay(referenceDate);
  const due = startOfDay(new Date(`${dueDateYmd}T12:00:00`));
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  let urgency: CommitmentDueStatus["urgency"] = "ok";
  if (diffDays <= 3) {
    urgency = "urgent";
  } else if (diffDays <= 7) {
    urgency = "soon";
  }

  let dueLabel: string;
  if (diffDays < 0) {
    dueLabel = `Vencido hace ${Math.abs(diffDays)} d`;
  } else if (diffDays === 0) {
    dueLabel = "Vence hoy";
  } else if (diffDays === 1) {
    dueLabel = "Vence mañana";
  } else if (diffDays <= 7) {
    dueLabel = `En ${diffDays} días`;
  } else {
    dueLabel = formatCreditCardDateLabel(dueDateYmd);
  }

  return {
    urgency,
    dueDay: dayFromYmd(dueDateYmd),
    dueLabel,
    dueDate: dueDateYmd,
  };
}

export function buildCardPaymentDueDates(
  nextPaymentDueDate: string,
  referenceDate: Date = new Date()
): string[] {
  const todayYmd = getTodayYmdInSantoDomingo(referenceDate);
  const current = advanceDateUntilFuture(nextPaymentDueDate, todayYmd);
  const following = addOneMonthSameDay(current);
  return [current, following];
}

export function defaultNextStatementCloseDate(
  referenceDate: Date = new Date()
): string {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const lastDay = daysInMonth(year, month);
  return formatYmd(year, month, lastDay);
}

export function defaultNextPaymentDueDate(
  referenceDate: Date = new Date()
): string {
  return derivePaymentDueFromClose(
    defaultNextStatementCloseDate(referenceDate),
    CREDIT_CARD_DEFAULT_GRACE_DAYS
  );
}

export function ymdToLocalDate(dateYmd: string): Date {
  return new Date(`${dateYmd}T12:00:00`);
}

export function isDateInCalendarMonth(
  dateYmd: string,
  referenceDate: Date
): boolean {
  const d = ymdToLocalDate(dateYmd);
  return (
    d.getFullYear() === referenceDate.getFullYear() &&
    d.getMonth() === referenceDate.getMonth()
  );
}

export function dayNumberToNextDate(
  dayNum: number,
  referenceDate: Date = new Date()
): string {
  const todayYmd = getTodayYmdInSantoDomingo(referenceDate);
  const { year, month } = parseYmd(todayYmd);
  const clamped = Math.min(dayNum, daysInMonth(year, month));
  const candidate = formatYmd(year, month, clamped);
  return advanceDateUntilFuture(candidate, todayYmd);
}
