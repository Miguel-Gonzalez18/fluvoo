-- Multi-currency support for parsed Gmail transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS original_amount numeric(12, 2),
  ADD COLUMN IF NOT EXISTS original_currency text,
  ADD COLUMN IF NOT EXISTS exchange_rate numeric(10, 4),
  ADD COLUMN IF NOT EXISTS rate_source text;

COMMENT ON COLUMN public.transactions.amount IS 'Canonical amount in DOP for calculations';
COMMENT ON COLUMN public.transactions.original_amount IS 'Original foreign amount when purchase was in USD';
COMMENT ON COLUMN public.transactions.original_currency IS 'Original currency code e.g. USD';
COMMENT ON COLUMN public.transactions.exchange_rate IS 'Exchange rate used when converting to DOP';
COMMENT ON COLUMN public.transactions.rate_source IS 'bank_email or api_estimated';

-- Daily FX cache (USD -> DOP) from open.er-api.com
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency text NOT NULL DEFAULT 'USD',
  target_currency text NOT NULL DEFAULT 'DOP',
  rate numeric(10, 6) NOT NULL,
  rate_date date NOT NULL,
  provider text NOT NULL DEFAULT 'open.er-api.com',
  fetched_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exchange_rates_unique_day UNIQUE (base_currency, target_currency, rate_date, provider)
);

COMMENT ON TABLE public.exchange_rates IS 'Cached USD/DOP rates for API fallback. Service role only.';

ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.exchange_rates FROM anon, authenticated;
GRANT ALL ON public.exchange_rates TO service_role;

-- Sync observability on gmail_connections
ALTER TABLE public.gmail_connections
  ADD COLUMN IF NOT EXISTS last_sync_stats jsonb;
