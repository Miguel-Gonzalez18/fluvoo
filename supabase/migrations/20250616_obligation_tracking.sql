-- Obligation tracking: credit card tracking, loan aliases, payment cycles, statement uploads

-- Enums
CREATE TYPE public.payment_cycle_status AS ENUM (
  'projected',
  'pending',
  'confirmed'
);

CREATE TYPE public.payment_cycle_source AS ENUM (
  'user'
);

CREATE TYPE public.obligation_link_event_type AS ENUM (
  'purchase'
);

-- Extend notification types
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'gmail_connected_enable_tracking';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'loan_payment_due';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'credit_card_payment_due';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'credit_card_statement_reminder';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'credit_card_purchase_detected';

-- Credit cards: tracking fields
ALTER TABLE public.credit_cards
  ADD COLUMN IF NOT EXISTS tracking_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_four char(4),
  ADD COLUMN IF NOT EXISTS last_statement_upload_at timestamptz,
  ADD COLUMN IF NOT EXISTS tracking_paused_at timestamptz;

ALTER TABLE public.credit_cards
  ADD CONSTRAINT credit_cards_last_four_format
  CHECK (last_four IS NULL OR last_four ~ '^\d{4}$');

CREATE UNIQUE INDEX IF NOT EXISTS credit_cards_user_last_four_tracking_idx
  ON public.credit_cards (user_id, last_four)
  WHERE tracking_enabled = true AND last_four IS NOT NULL;

COMMENT ON COLUMN public.credit_cards.tracking_enabled IS
  'Opt-in: auto-track purchases via Gmail for this card';
COMMENT ON COLUMN public.credit_cards.last_four IS
  'Last 4 digits to match bank email alerts; required when tracking_enabled';

-- Loans: alias
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS loan_alias text;

UPDATE public.loans
SET loan_alias = CASE loan_type
  WHEN 'personal' THEN 'Préstamo personal'
  WHEN 'mortgage' THEN 'Préstamo hipotecario'
  WHEN 'vehicle' THEN 'Préstamo vehicular'
  WHEN 'business' THEN 'Préstamo empresarial'
  ELSE 'Préstamo'
END
WHERE loan_alias IS NULL OR loan_alias = '';

ALTER TABLE public.loans
  ALTER COLUMN loan_alias SET NOT NULL;

-- Loan payment cycles
CREATE TABLE IF NOT EXISTS public.loan_payment_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date date NOT NULL,
  expected_amount numeric(12, 2) NOT NULL CHECK (expected_amount > 0),
  status public.payment_cycle_status NOT NULL DEFAULT 'projected',
  confirmed_at timestamptz,
  source public.payment_cycle_source,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT loan_payment_cycles_loan_due_unique UNIQUE (loan_id, due_date)
);

CREATE INDEX IF NOT EXISTS loan_payment_cycles_user_status_idx
  ON public.loan_payment_cycles (user_id, status, due_date);

-- Credit card payment cycles
CREATE TABLE IF NOT EXISTS public.credit_card_payment_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date date NOT NULL,
  expected_amount numeric(12, 2) NOT NULL CHECK (expected_amount >= 0),
  status public.payment_cycle_status NOT NULL DEFAULT 'projected',
  confirmed_at timestamptz,
  source public.payment_cycle_source,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT credit_card_payment_cycles_card_due_unique UNIQUE (credit_card_id, due_date)
);

CREATE INDEX IF NOT EXISTS credit_card_payment_cycles_user_status_idx
  ON public.credit_card_payment_cycles (user_id, status, due_date);

-- Gmail purchase links (avoid double-counting)
CREATE TABLE IF NOT EXISTS public.obligation_transaction_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  event_type public.obligation_link_event_type NOT NULL DEFAULT 'purchase',
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  linked_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT obligation_transaction_links_transaction_unique UNIQUE (transaction_id)
);

CREATE INDEX IF NOT EXISTS obligation_transaction_links_card_idx
  ON public.obligation_transaction_links (credit_card_id);

-- Statement PDF uploads
CREATE TABLE IF NOT EXISTS public.credit_card_statement_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_card_id uuid NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  applied_at timestamptz,
  parsed_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS credit_card_statement_uploads_card_idx
  ON public.credit_card_statement_uploads (credit_card_id, uploaded_at DESC);

-- Updated_at triggers for cycle tables
DROP TRIGGER IF EXISTS trg_loan_payment_cycles_updated_at ON public.loan_payment_cycles;
CREATE TRIGGER trg_loan_payment_cycles_updated_at
  BEFORE UPDATE ON public.loan_payment_cycles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_financial_obligations_updated_at();

DROP TRIGGER IF EXISTS trg_credit_card_payment_cycles_updated_at ON public.credit_card_payment_cycles;
CREATE TRIGGER trg_credit_card_payment_cycles_updated_at
  BEFORE UPDATE ON public.credit_card_payment_cycles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_financial_obligations_updated_at();

-- RLS: loan_payment_cycles
ALTER TABLE public.loan_payment_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loan_payment_cycles"
  ON public.loan_payment_cycles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loan_payment_cycles"
  ON public.loan_payment_cycles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loan_payment_cycles"
  ON public.loan_payment_cycles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.loan_payment_cycles TO authenticated;
GRANT ALL ON public.loan_payment_cycles TO service_role;

-- RLS: credit_card_payment_cycles
ALTER TABLE public.credit_card_payment_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit_card_payment_cycles"
  ON public.credit_card_payment_cycles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit_card_payment_cycles"
  ON public.credit_card_payment_cycles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit_card_payment_cycles"
  ON public.credit_card_payment_cycles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.credit_card_payment_cycles TO authenticated;
GRANT ALL ON public.credit_card_payment_cycles TO service_role;

-- RLS: obligation_transaction_links
ALTER TABLE public.obligation_transaction_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own obligation_transaction_links"
  ON public.obligation_transaction_links FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT ON public.obligation_transaction_links TO authenticated;
GRANT ALL ON public.obligation_transaction_links TO service_role;

-- RLS: credit_card_statement_uploads
ALTER TABLE public.credit_card_statement_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit_card_statement_uploads"
  ON public.credit_card_statement_uploads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit_card_statement_uploads"
  ON public.credit_card_statement_uploads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON public.credit_card_statement_uploads TO authenticated;
GRANT ALL ON public.credit_card_statement_uploads TO service_role;

-- Storage bucket for statement PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'statement-uploads',
  'statement-uploads',
  false,
  5242880,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own statement PDFs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'statement-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own statement PDFs"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'statement-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own statement PDFs"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'statement-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Service role manages statement uploads"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'statement-uploads')
  WITH CHECK (bucket_id = 'statement-uploads');
