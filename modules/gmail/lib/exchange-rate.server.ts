import { createAdminClient } from "@/src/lib/admin";

const FX_API_URL = "https://open.er-api.com/v6/latest/USD";
const FX_PROVIDER = "open.er-api.com";
const FETCH_TIMEOUT_MS = 5_000;

interface OpenErApiResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc?: string;
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function isFxApiEnabled(): boolean {
  return process.env.FX_API_ENABLED !== "false";
}

async function fetchUsdToDopFromApi(): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(FX_API_URL, {
      signal: controller.signal,
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      throw new Error(`FX API responded with status ${response.status}`);
    }

    const payload = (await response.json()) as OpenErApiResponse;

    if (payload.result !== "success" || !payload.rates?.DOP) {
      throw new Error("FX API response missing DOP rate");
    }

    return payload.rates.DOP;
  } finally {
    clearTimeout(timeout);
  }
}

async function getCachedRate(rateDate: string): Promise<number | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("exchange_rates")
    .select("rate")
    .eq("base_currency", "USD")
    .eq("target_currency", "DOP")
    .eq("rate_date", rateDate)
    .eq("provider", FX_PROVIDER)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.rate ?? null;
}

async function cacheRate(rateDate: string, rate: number): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("exchange_rates").upsert(
    {
      base_currency: "USD",
      target_currency: "DOP",
      rate,
      rate_date: rateDate,
      provider: FX_PROVIDER,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "base_currency,target_currency,rate_date,provider" }
  );

  if (error) throw new Error(error.message);
}

export async function getUsdToDopRate(): Promise<{
  rate: number;
  rateDate: string;
  fromCache: boolean;
}> {
  if (!isFxApiEnabled()) {
    throw new Error("FX API is disabled");
  }

  const rateDate = getTodayDateString();
  const cached = await getCachedRate(rateDate);

  if (cached) {
    return { rate: cached, rateDate, fromCache: true };
  }

  const rate = await fetchUsdToDopFromApi();
  await cacheRate(rateDate, rate);

  return { rate, rateDate, fromCache: false };
}
