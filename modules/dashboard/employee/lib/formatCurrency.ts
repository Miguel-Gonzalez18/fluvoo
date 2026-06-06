const dopFormatter = new Intl.NumberFormat("es-DO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatDOP(amount: number | string): string {
  const numericAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (Number.isNaN(numericAmount)) {
    return "RD$ 0";
  }

  return `RD$ ${dopFormatter.format(numericAmount)}`;
}

export function formatSignedDOP(amount: number, direction: "income" | "expense"): string {
  const prefix = direction === "income" ? "+ " : "- ";
  return `${prefix}${formatDOP(amount)}`;
}
