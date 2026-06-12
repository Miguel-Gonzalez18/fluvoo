import { FINANCIAL_INSTITUTIONS } from "@/modules/onboarding/config/financial";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";

type CreditCardRow = FinancialObligationsSnapshot["creditCards"][number];

export function getInstitutionShortLabel(value: string): string {
  const full =
    FINANCIAL_INSTITUTIONS.find((item) => item.value === value)?.label ?? value;
  const acronym = full.match(/\(([^)]+)\)\s*$/)?.[1]?.trim();
  return acronym ?? full;
}

export function getInstitutionFullLabel(value: string): string {
  return (
    FINANCIAL_INSTITUTIONS.find((item) => item.value === value)?.label ?? value
  );
}

export function getCreditCardShortLabel(
  cardLabel: string | null,
  issuerName: string
): string {
  if (cardLabel?.trim()) return cardLabel.trim();
  return getInstitutionShortLabel(issuerName);
}

export function formatUsdSubtext(
  card: CreditCardRow,
  usdToDopRate: number
): string | null {
  const mode = card.currency_mode ?? "dop_only";
  if (mode === "dop_only") return null;

  const usdPart = card.minimum_payment_usd ?? 0;
  if (usdPart <= 0) return null;

  const dopEquivalent = Math.round(usdPart * usdToDopRate * 100) / 100;
  return `~RD$ ${dopEquivalent.toLocaleString("es-DO", { minimumFractionDigits: 2 })} (USD ${usdPart.toFixed(2)} @ ${usdToDopRate.toFixed(2)})`;
}

export function formatInstallmentsSubtext(
  installmentsTotal: number
): string | null {
  if (installmentsTotal <= 0) return null;
  return `incl. RD$ ${installmentsTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })} en cuotas`;
}

export function buildCardAmountSubtext(
  card: CreditCardRow,
  installmentsTotal: number,
  usdToDopRate: number
): string | null {
  const parts = [
    formatUsdSubtext(card, usdToDopRate),
    formatInstallmentsSubtext(installmentsTotal),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}
