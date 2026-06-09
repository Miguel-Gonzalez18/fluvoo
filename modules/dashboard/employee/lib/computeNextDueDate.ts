export function clampDueDayToMonth(year: number, month: number, dueDay: number): number {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Math.min(dueDay, lastDay);
}

export function computeNextDueDate(
  paymentDueDay: number,
  referenceDate: Date = new Date()
): Date {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const today = referenceDate.getDate();

  const dueDayThisMonth = clampDueDayToMonth(year, month, paymentDueDay);

  if (today <= dueDayThisMonth) {
    return new Date(year, month, dueDayThisMonth);
  }

  const nextMonth = month + 1;
  const nextYear = nextMonth > 11 ? year + 1 : year;
  const normalizedMonth = nextMonth % 12;
  const dueDayNextMonth = clampDueDayToMonth(
    nextYear,
    normalizedMonth,
    paymentDueDay
  );

  return new Date(nextYear, normalizedMonth, dueDayNextMonth);
}

export function isDueDayInMonth(
  paymentDueDay: number,
  year: number,
  month: number
): boolean {
  const dueDay = clampDueDayToMonth(year, month, paymentDueDay);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  if (!isCurrentMonth) {
    return true;
  }

  return today.getDate() <= dueDay;
}

export function isObligationActiveForMonth(
  endDate: string | null | undefined,
  year: number,
  month: number
): boolean {
  if (!endDate) return true;
  const end = new Date(`${endDate}T12:00:00`);
  const monthStart = new Date(year, month, 1);
  return end >= monthStart;
}
