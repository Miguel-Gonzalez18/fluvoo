const dopFormatter = new Intl.NumberFormat("es-DO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
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

export function formatUSD(amount: number | string): string {
  const numericAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (Number.isNaN(numericAmount)) {
    return "US$ 0.00";
  }

  return `US$ ${usdFormatter.format(numericAmount)}`;
}

export function formatSignedDOP(amount: number, direction: "income" | "expense"): string {
  const prefix = direction === "income" ? "+ " : "- ";
  return `${prefix}${formatDOP(amount)}`;
}

export function formatOriginalAmountSubtext(
  originalAmount: number | null | undefined,
  originalCurrency: string | null | undefined,
  rateSource: string | null | undefined
): string | null {
  if (!originalAmount || originalCurrency !== "USD") {
    return null;
  }

  const usdLabel = formatUSD(originalAmount);
  return rateSource === "api_estimated" ? `${usdLabel} (estimado)` : usdLabel;
}
