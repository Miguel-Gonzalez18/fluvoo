const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function deriveStartDate(endDate: string, termMonths: number): string {
  const end = new Date(`${endDate}T12:00:00`);
  end.setMonth(end.getMonth() - termMonths);
  return end.toISOString().split("T")[0];
}

export function monthsBetweenDates(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

export function resolveStartDate(
  startDate: string | undefined,
  endDate: string,
  termMonths: number
): string {
  if (startDate && startDate.length > 0) {
    return startDate;
  }
  return deriveStartDate(endDate, termMonths);
}

export function normalizeOptionalDate(value: string | undefined): string | undefined {
  if (!value || value.trim().length === 0) {
    return undefined;
  }
  return value;
}

export function daysBetween(from: Date, to: Date): number {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / MS_PER_DAY);
}
