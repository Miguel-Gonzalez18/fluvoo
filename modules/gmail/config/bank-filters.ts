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

export function buildGmailBankSearchQuery(daysBack = GMAIL_SYNC_LOOKBACK_DAYS): string {
  const domainClauses = BANK_EMAIL_FILTERS.flatMap((bank) =>
    bank.domains.map((domain) => `from:${domain}`)
  );

  const fromFilter = `(${domainClauses.join(" OR ")})`;
  const timeFilter = `newer_than:${daysBack}d`;
  const subjectInclude =
    "subject:(transaccion OR compra OR debito OR cargo OR notificacion OR aprobada OR consumo)";
  const subjectExclude =
    '-subject:(publicidad OR promocion OR "estado de cuenta" OR newsletter OR oferta)';

  return `${fromFilter} ${subjectInclude} ${subjectExclude} ${timeFilter}`;
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
