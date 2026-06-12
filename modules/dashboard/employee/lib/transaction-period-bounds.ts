import {
  APP_TIMEZONE,
  getZonedYmd,
  zonedEndOfDay,
  zonedStartOfDay,
} from "@/modules/dashboard/employee/lib/month-bounds";
import type { ChartPeriod } from "@/modules/dashboard/employee/types/transactions.types";

const PERIOD_DAYS: Record<ChartPeriod, number> = {
  "7d": 7,
  "15d": 15,
  "30d": 30,
  "90d": 90,
};

export function getChartPeriodDays(period: ChartPeriod): number {
  return PERIOD_DAYS[period];
}

export function getChartPeriodRange(period: ChartPeriod): {
  start: string;
  end: string;
  days: number;
} {
  const days = PERIOD_DAYS[period];
  const now = new Date();
  const { year, month, day } = getZonedYmd(now);
  const end = zonedEndOfDay(year, month, day).toISOString();

  const startRef = new Date(
    zonedStartOfDay(year, month, day).getTime() - (days - 1) * 86_400_000
  );
  const startYmd = getZonedYmd(startRef);
  const start = zonedStartOfDay(
    startYmd.year,
    startYmd.month,
    startYmd.day
  ).toISOString();

  return { start, end, days };
}

export function getTransactionsLookbackRange(): { start: string; end: string } {
  return getChartPeriodRange("90d");
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function getDaysInCurrentMonth(reference: Date = new Date()): number {
  const { year, month } = getZonedYmd(reference);
  return daysInMonth(year, month);
}

export function formatPeriodSubtitle(period: ChartPeriod): string {
  const { start, end } = getChartPeriodRange(period);
  const formatter = new Intl.DateTimeFormat("es-DO", {
    timeZone: APP_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
}
