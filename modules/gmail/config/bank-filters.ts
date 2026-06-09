import type { SupportedBank } from "@/modules/onboarding/config/gmail";
import { GMAIL_SYNC_LOOKBACK_DAYS } from "@/modules/shared/google/constants";

export interface BankEmailFilter {
  bankName: SupportedBank;
  domains: string[];
}

export const BANK_EMAIL_FILTERS: BankEmailFilter[] = [
  { bankName: "Banreservas", domains: ["banreservas.com"] },
  { bankName: "Popular", domains: ["bpd.com.do", "popularenlinea.com", "popular.com.do"] },
  { bankName: "BHD", domains: ["bhd.com.do", "bhdleon.com.do"] },
  { bankName: "APAP", domains: ["apap.com.do"] },
  { bankName: "Scotiabank", domains: ["scotiabank.com", "scotiabank.com.do"] },
  { bankName: "Qik", domains: ["qik.com.do"] },
  { bankName: "Santa Cruz", domains: ["bsc.com.do", "santacruz.com.do"] },
  { bankName: "Cibao", domains: ["asociacioncibao.com.do", "acap.com.do"] },
  { bankName: "Caribe", domains: ["bancocaribe.com.do", "caribe.com.do"] },
  { bankName: "Banesco", domains: ["banesco.com.do", "banesco.com"] },
];

export const ACTIVE_SYNC_BANKS: SupportedBank[] = [
  "Banreservas",
  "BHD",
  "APAP",
  "Popular",
  "Scotiabank",
  "Qik",
  "Santa Cruz",
  "Cibao",
  "Caribe",
  "Banesco",
];

export function buildGmailBankSearchQueryForBanks(
  banks: SupportedBank[],
  daysBack = GMAIL_SYNC_LOOKBACK_DAYS
): string {
  const activeFilters = BANK_EMAIL_FILTERS.filter((bank) =>
    banks.includes(bank.bankName)
  );

  const domainClauses = activeFilters.flatMap((bank) =>
    bank.domains.map((domain) => `from:${domain}`)
  );

  const fromFilter = `(${domainClauses.join(" OR ")})`;
  const timeFilter = `newer_than:${daysBack}d`;
  const subjectExclude =
    '-subject:(publicidad OR promocion OR "estado de cuenta" OR newsletter OR oferta)';

  return `${fromFilter} ${subjectExclude} ${timeFilter}`;
}

export function buildGmailBankSearchQuery(daysBack = GMAIL_SYNC_LOOKBACK_DAYS): string {
  return buildGmailBankSearchQueryForBanks(ACTIVE_SYNC_BANKS, daysBack);
}

export function detectBankFromEmail(fromHeader: string): SupportedBank | null {
  const normalized = fromHeader.toLowerCase();

  for (const bank of BANK_EMAIL_FILTERS) {
    if (bank.domains.some((domain) => normalized.includes(domain))) {
      return bank.bankName;
    }
  }

  return null;
}
