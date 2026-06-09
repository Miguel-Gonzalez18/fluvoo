-- Fixed obligations, credit cards, installments; extend loans for payment scheduling

-- Enums
CREATE TYPE public.obligation_type AS ENUM (
  'rent',
  'electricity',
  'water',
  'gas',
  'internet',
  'transport',
  'insurance',
  'other'
);

CREATE TYPE public.obligation_status AS ENUM (
  'active',
  'inactive'
);

CREATE TYPE public.credit_card_status AS ENUM (
  'active',
  'closed'
);

CREATE TYPE public.installment_status AS ENUM (
  'active',
  'paid_off'
);

-- Fixed monthly obligations (rent, utilities, etc.)
CREATE TABLE IF NOT EXISTS public.fixed_obligations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  obligation_type public.obligation_type NOT NULL,
  name text NOT NULL DEFAULT '',
  provider_name text,
  monthly_amount numeric(12, 2) NOT NULL CHECK (monthly_amount > 0),
  payment_due_day smallint NOT NULL CHECK (payment_due_day >= 1 AND payment_due_day <= 31),
  status public.obligation_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fixed_obligations_user_id_idx
  ON public.fixed_obligations (user_id);

-- Credit cards (revolving)
CREATE TABLE IF NOT EXISTS public.credit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issuer_name text NOT NULL,
  card_label text,
  credit_limit numeric(12, 2) NOT NULL CHECK (credit_limit > 0),
  current_balance numeric(12, 2) NOT NULL DEFAULT 0 CHECK (current_balance >= 0),
  minimum_payment numeric(12, 2) NOT NULL CHECK (minimum_payment >= 0),
  statement_close_day smallint CHECK (statement_close_day IS NULL OR (statement_close_day >= 1 AND statement_close_day <= 31)),
  payment_due_day smallint NOT NULL CHECK (payment_due_day >= 1 AND payment_due_day <= 31),
  annual_rate numeric(8, 4),
  status public.credit_card_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT credit_cards_balance_within_limit CHECK (current_balance <= credit_limit)
);

CREATE INDEX IF NOT EXISTS credit_cards_user_id_idx
  ON public.credit_cards (user_id);

-- Credit card installment purchases (child of credit_cards)
CREATE TABLE IF NOT EXISTS public.credit_card_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  description text,
  original_amount numeric(12, 2) NOT NULL CHECK (original_amount > 0),
  remaining_balance numeric(12, 2),
  monthly_payment numeric(12, 2) NOT NULL CHECK (monthly_payment > 0),
  term_months integer NOT NULL CHECK (term_months > 0),
  annual_rate numeric(8, 4) NOT NULL DEFAULT 0 CHECK (annual_rate >= 0),
  end_date date NOT NULL,
  start_date date,
  payment_due_day smallint CHECK (payment_due_day IS NULL OR (payment_due_day >= 1 AND payment_due_day <= 31)),
  status public.installment_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credit_card_installments_card_id_idx
  ON public.credit_card_installments (credit_card_id);

CREATE INDEX IF NOT EXISTS credit_card_installments_user_id_idx
  ON public.credit_card_installments (user_id);

-- Migrate existing credit_card loans to credit_cards before removing enum value
INSERT INTO public.credit_cards (
  user_id,
  issuer_name,
  credit_limit,
  current_balance,
  minimum_payment,
  payment_due_day,
  annual_rate,
  status,
  created_at,
  updated_at
)
SELECT
  l.user_id,
  COALESCE(l.lender_name, 'Desconocido'),
  GREATEST(l.original_amount, l.monthly_payment, 1),
  COALESCE(l.current_balance, l.original_amount, 0),
  l.monthly_payment,
  EXTRACT(DAY FROM COALESCE(l.end_date::timestamptz, l.start_date::timestamptz, now()))::smallint,
  l.annual_rate,
  CASE WHEN l.status = 'paid_off' THEN 'closed'::public.credit_card_status ELSE 'active'::public.credit_card_status END,
  l.created_at,
  l.updated_at
FROM public.loans l
WHERE l.loan_type = 'credit_card';

DELETE FROM public.loans WHERE loan_type = 'credit_card';

-- Extend loans: payment_due_day, nullable start_date
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS payment_due_day smallint
    CHECK (payment_due_day IS NULL OR (payment_due_day >= 1 AND payment_due_day <= 31));

ALTER TABLE public.loans
  ALTER COLUMN start_date DROP NOT NULL;

-- Backfill payment_due_day from end_date or start_date for existing loans
UPDATE public.loans
SET payment_due_day = EXTRACT(DAY FROM COALESCE(end_date::timestamptz, start_date::timestamptz, now()))::smallint
WHERE payment_due_day IS NULL;

-- Remove credit_card from loan_type enum
ALTER TYPE public.loan_type RENAME TO loan_type_old;

CREATE TYPE public.loan_type AS ENUM (
  'personal',
  'mortgage',
  'vehicle',
  'business'
);

ALTER TABLE public.loans
  ALTER COLUMN loan_type TYPE public.loan_type
  USING loan_type::text::public.loan_type;

DROP TYPE public.loan_type_old;

-- Default status on loans
ALTER TABLE public.loans
  ALTER COLUMN status SET DEFAULT 'active';

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.set_financial_obligations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fixed_obligations_updated_at ON public.fixed_obligations;
CREATE TRIGGER trg_fixed_obligations_updated_at
  BEFORE UPDATE ON public.fixed_obligations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_financial_obligations_updated_at();

DROP TRIGGER IF EXISTS trg_credit_cards_updated_at ON public.credit_cards;
CREATE TRIGGER trg_credit_cards_updated_at
  BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_financial_obligations_updated_at();

DROP TRIGGER IF EXISTS trg_credit_card_installments_updated_at ON public.credit_card_installments;
CREATE TRIGGER trg_credit_card_installments_updated_at
  BEFORE UPDATE ON public.credit_card_installments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_financial_obligations_updated_at();

-- RLS: fixed_obligations
ALTER TABLE public.fixed_obligations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fixed_obligations"
  ON public.fixed_obligations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fixed_obligations"
  ON public.fixed_obligations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fixed_obligations"
  ON public.fixed_obligations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fixed_obligations"
  ON public.fixed_obligations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON public.fixed_obligations FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fixed_obligations TO authenticated;
GRANT ALL ON public.fixed_obligations TO service_role;

-- RLS: credit_cards
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit_cards"
  ON public.credit_cards FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit_cards"
  ON public.credit_cards FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit_cards"
  ON public.credit_cards FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credit_cards"
  ON public.credit_cards FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON public.credit_cards FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_cards TO authenticated;
GRANT ALL ON public.credit_cards TO service_role;

-- RLS: credit_card_installments
ALTER TABLE public.credit_card_installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit_card_installments"
  ON public.credit_card_installments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit_card_installments"
  ON public.credit_card_installments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit_card_installments"
  ON public.credit_card_installments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credit_card_installments"
  ON public.credit_card_installments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON public.credit_card_installments FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_card_installments TO authenticated;
GRANT ALL ON public.credit_card_installments TO service_role;

-- RLS: loans insert/update (existing table may only have SELECT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'loans' AND policyname = 'Users can insert own loans'
  ) THEN
    CREATE POLICY "Users can insert own loans"
      ON public.loans FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'loans' AND policyname = 'Users can update own loans'
  ) THEN
    CREATE POLICY "Users can update own loans"
      ON public.loans FOR UPDATE TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'loans' AND policyname = 'Users can delete own loans'
  ) THEN
    CREATE POLICY "Users can delete own loans"
      ON public.loans FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

GRANT INSERT, UPDATE, DELETE ON public.loans TO authenticated;

COMMENT ON TABLE public.fixed_obligations IS 'Recurring fixed monthly obligations: rent, utilities, transport, etc.';
COMMENT ON TABLE public.credit_cards IS 'Revolving credit card accounts with minimum payment and due dates.';
COMMENT ON TABLE public.credit_card_installments IS 'Installment purchases on credit cards (cuotas).';
