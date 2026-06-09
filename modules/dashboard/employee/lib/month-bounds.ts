/** Dominican Republic — no DST, fixed UTC-4 */
export const APP_TIMEZONE = "America/Santo_Domingo";
const AST_OFFSET = "-04:00";

export interface ZonedYmd {
  year: number;
  month: number;
  day: number;
}

export function getZonedYmd(
  date: Date,
  timeZone: string = APP_TIMEZONE
): ZonedYmd {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const pick = (type: string) =>
    parseInt(parts.find((part) => part.type === type)?.value ?? "0", 10);

  return {
    year: pick("year"),
    month: pick("month"),
    day: pick("day"),
  };
}

export function isSameZonedDay(a: Date, b: Date): boolean {
  const ymdA = getZonedYmd(a);
  const ymdB = getZonedYmd(b);
  return (
    ymdA.year === ymdB.year &&
    ymdA.month === ymdB.month &&
    ymdA.day === ymdB.day
  );
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function zonedStartOfDay(
  year: number,
  month: number,
  day: number
): Date {
  return new Date(
    `${year}-${pad2(month)}-${pad2(day)}T00:00:00.000${AST_OFFSET}`
  );
}

export function zonedEndOfDay(
  year: number,
  month: number,
  day: number
): Date {
  return new Date(
    `${year}-${pad2(month)}-${pad2(day)}T23:59:59.999${AST_OFFSET}`
  );
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export type ExpensePeriod = "this-month" | "last-month";

export function getMonthRange(period: ExpensePeriod): { start: string; end: string } {
  const now = new Date();
  const { year, month, day } = getZonedYmd(now);

  if (period === "this-month") {
    return {
      start: zonedStartOfDay(year, month, 1).toISOString(),
      end: zonedEndOfDay(year, month, day).toISOString(),
    };
  }

  const lastMonth = month === 1 ? 12 : month - 1;
  const lastYear = month === 1 ? year - 1 : year;
  const lastMonthDays = daysInMonth(lastYear, lastMonth);

  return {
    start: zonedStartOfDay(lastYear, lastMonth, 1).toISOString(),
    end: zonedEndOfDay(lastYear, lastMonth, lastMonthDays).toISOString(),
  };
}
