import type { FiscalAnalysisData } from "@/modules/dashboard/employee/types/dashboard.types";

const DEV_CACHE_TTL_MS = 15 * 60 * 1000;
const DEV_ERROR_CACHE_TTL_MS = 5 * 60 * 1000;

interface DevCacheEntry {
  result: FiscalAnalysisData;
  expiresAt: number;
}

const devCache = new Map<string, DevCacheEntry>();

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getDevFiscalAnalysisCache(
  cacheKey: string
): FiscalAnalysisData | null {
  if (!isDevelopment()) return null;

  const entry = devCache.get(cacheKey);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    devCache.delete(cacheKey);
    return null;
  }

  return entry.result;
}

export function setDevFiscalAnalysisCache(
  cacheKey: string,
  result: FiscalAnalysisData,
  options?: { shortLived?: boolean }
): void {
  if (!isDevelopment()) return;

  const ttl = options?.shortLived ? DEV_ERROR_CACHE_TTL_MS : DEV_CACHE_TTL_MS;

  devCache.set(cacheKey, {
    result,
    expiresAt: Date.now() + ttl,
  });
}

export function isGeminiQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("quota") ||
    message.includes("Quota exceeded") ||
    message.includes("rate-limit")
  );
}
