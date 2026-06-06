const dateFormatter = new Intl.DateTimeFormat("es-DO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatLongDate(date: Date = new Date()): string {
  const formatted = dateFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "F";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
