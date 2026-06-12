import {
  APP_TIMEZONE,
  getZonedYmd,
  isSameZonedDay,
  zonedStartOfDay,
} from "@/modules/dashboard/employee/lib/month-bounds";

const timeFormatter = new Intl.DateTimeFormat("es-DO", {
  timeZone: APP_TIMEZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-DO", {
  timeZone: APP_TIMEZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatTransactionDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  if (isSameZonedDay(date, now)) {
    return `Hoy, ${timeFormatter.format(date)}`;
  }

  const { year, month, day } = getZonedYmd(now);
  const yesterdayRef = new Date(
    zonedStartOfDay(year, month, day).getTime() - 1
  );

  if (isSameZonedDay(date, yesterdayRef)) {
    return `Ayer, ${timeFormatter.format(date)}`;
  }

  return shortDateFormatter.format(date);
}

const dayMonthFormatter = new Intl.DateTimeFormat("es-DO", {
  timeZone: APP_TIMEZONE,
  day: "numeric",
  month: "short",
});

export function formatTransactionDateParts(isoDate: string): {
  dayMonth: string;
  time: string;
} {
  const date = new Date(isoDate);
  return {
    dayMonth: dayMonthFormatter.format(date),
    time: timeFormatter.format(date),
  };
}

export function formatRelativeTime(isoDate: string | null): string {
  if (!isoDate) {
    return "Sin sincronizar aún";
  }

  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) {
    return "hace un momento";
  }

  if (diffMins < 60) {
    return `hace ${diffMins} min`;
  }

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `hace ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} día${diffDays === 1 ? "" : "s"}`;
}
