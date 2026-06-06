-- Parsed bank transactions from Gmail notifications
CREATE TYPE public.transaction_type AS ENUM (
  'debit',
  'credit',
  'transfer',
  'payment',
  'deposit',
  'unknown'
);

CREATE TYPE public.transaction_parse_status AS ENUM (
  'parsed',
  'partial',
  'failed'
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_message_id text NOT NULL,
  bank_name text NOT NULL,
  transaction_type public.transaction_type NOT NULL DEFAULT 'unknown',
  amount numeric(12, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'DOP',
  merchant_name text,
  description text,
  transaction_date timestamptz NOT NULL,
  raw_subject text,
  raw_from text,
  parse_status public.transaction_parse_status NOT NULL DEFAULT 'parsed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT transactions_user_message_unique UNIQUE (user_id, gmail_message_id)
);

CREATE INDEX IF NOT EXISTS transactions_user_id_date_idx
  ON public.transactions (user_id, transaction_date DESC);

COMMENT ON TABLE public.transactions IS 'Bank transactions parsed from Gmail notification emails.';

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON public.transactions FROM anon;
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;

CREATE OR REPLACE FUNCTION public.set_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_transactions_updated_at ON public.transactions;
CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_transactions_updated_at();

ALTER TABLE public.gmail_connections
  ADD COLUMN IF NOT EXISTS sync_error text;
