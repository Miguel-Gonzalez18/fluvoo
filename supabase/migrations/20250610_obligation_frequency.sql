-- Obligation types (gym, university), payment frequency, credit card currency, installment dates

-- Extend obligation_type enum
ALTER TYPE public.obligation_type ADD VALUE IF NOT EXISTS 'gym';
ALTER TYPE public.obligation_type ADD VALUE IF NOT EXISTS 'university';

-- Payment frequency for fixed obligations
CREATE TYPE public.obligation_payment_frequency AS ENUM (
  'monthly',
  'weekly',
  'biweekly',
  'daily'
);

ALTER TABLE public.fixed_obligations
  ADD COLUMN IF NOT EXISTS payment_frequency public.obligation_payment_frequency NOT NULL DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS payment_amount numeric(12, 2);

UPDATE public.fixed_obligations
SET payment_amount = monthly_amount
WHERE payment_amount IS NULL;

ALTER TABLE public.fixed_obligations
  ALTER COLUMN payment_amount SET NOT NULL;

-- Credit card currency mode
CREATE TYPE public.credit_card_currency_mode AS ENUM (
  'dop_only',
  'usd_only',
  'mixed'
);

ALTER TABLE public.credit_cards
  ADD COLUMN IF NOT EXISTS currency_mode public.credit_card_currency_mode NOT NULL DEFAULT 'dop_only',
  ADD COLUMN IF NOT EXISTS credit_limit_usd numeric(12, 2),
  ADD COLUMN IF NOT EXISTS current_balance_usd numeric(12, 2),
  ADD COLUMN IF NOT EXISTS minimum_payment_usd numeric(12, 2);

-- Installment: optional end_date, statement_close_day
ALTER TABLE public.credit_card_installments
  ALTER COLUMN end_date DROP NOT NULL;

ALTER TABLE public.credit_card_installments
  ADD COLUMN IF NOT EXISTS statement_close_day smallint
    CHECK (statement_close_day IS NULL OR (statement_close_day >= 1 AND statement_close_day <= 31));
