const timeFormatter = new Intl.DateTimeFormat("es-DO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function formatTransactionDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  if (isSameDay(date, now)) {
    return `Hoy, ${timeFormatter.format(date)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, yesterday)) {
    return `Ayer, ${timeFormatter.format(date)}`;
  }

  return shortDateFormatter.format(date);
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
