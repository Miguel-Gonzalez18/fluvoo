import { getUsdToDopRate } from "@/modules/gmail/lib/exchange-rate.server";
import type { RawParsedAmounts } from "@/modules/gmail/types/sync.types";
import type { RateSource } from "@/modules/gmail/types/sync.types";

export interface ResolvedDopAmount {
  amountDop: number;
  originalAmount: number | null;
  originalCurrency: string | null;
  exchangeRate: number | null;
  rateSource: RateSource;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function resolveDopAmount(
  raw: RawParsedAmounts
): Promise<ResolvedDopAmount | null> {
  if (raw.dopAmount !== null && raw.usdAmount === null) {
    return {
      amountDop: roundMoney(raw.dopAmount),
      originalAmount: null,
      originalCurrency: null,
      exchangeRate: null,
      rateSource: "bank_email",
    };
  }

  if (raw.dopAmount !== null && raw.usdAmount !== null) {
    const rate =
      raw.rateFromEmail ??
      roundMoney(raw.dopAmount / raw.usdAmount);

    return {
      amountDop: roundMoney(raw.dopAmount),
      originalAmount: roundMoney(raw.usdAmount),
      originalCurrency: "USD",
      exchangeRate: rate,
      rateSource: "bank_email",
    };
  }

  if (raw.usdAmount !== null && raw.rateFromEmail !== null) {
    return {
      amountDop: roundMoney(raw.usdAmount * raw.rateFromEmail),
      originalAmount: roundMoney(raw.usdAmount),
      originalCurrency: "USD",
      exchangeRate: raw.rateFromEmail,
      rateSource: "bank_email",
    };
  }

  if (raw.usdAmount !== null) {
    try {
      const { rate } = await getUsdToDopRate();
      return {
        amountDop: roundMoney(raw.usdAmount * rate),
        originalAmount: roundMoney(raw.usdAmount),
        originalCurrency: "USD",
        exchangeRate: rate,
        rateSource: "api_estimated",
      };
    } catch {
      return null;
    }
  }

  return null;
}
