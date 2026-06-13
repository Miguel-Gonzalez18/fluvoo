-- Credit cards: rolling full dates instead of day-of-month only

ALTER TABLE public.credit_cards
  ADD COLUMN IF NOT EXISTS next_statement_close_date date,
  ADD COLUMN IF NOT EXISTS next_payment_due_date date;

CREATE OR REPLACE FUNCTION public.compute_next_monthly_occurrence(
  day_num integer,
  ref date DEFAULT CURRENT_DATE
)
RETURNS date
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  y integer := EXTRACT(YEAR FROM ref)::integer;
  m integer := EXTRACT(MONTH FROM ref)::integer;
  dim integer;
  d integer;
  candidate date;
BEGIN
  IF day_num IS NULL OR day_num < 1 THEN
    RETURN ref;
  END IF;

  dim := EXTRACT(DAY FROM (date_trunc('month', ref::timestamp) + interval '1 month - 1 day'))::integer;
  d := LEAST(day_num, dim);
  candidate := make_date(y, m, d);

  IF candidate < ref THEN
    ref := (date_trunc('month', ref::timestamp) + interval '1 month')::date;
    y := EXTRACT(YEAR FROM ref)::integer;
    m := EXTRACT(MONTH FROM ref)::integer;
    dim := EXTRACT(DAY FROM (date_trunc('month', ref::timestamp) + interval '1 month - 1 day'))::integer;
    d := LEAST(day_num, dim);
    candidate := make_date(y, m, d);
  END IF;

  RETURN candidate;
END;
$$;

UPDATE public.credit_cards
SET
  next_statement_close_date = COALESCE(
    next_statement_close_date,
    public.compute_next_monthly_occurrence(
      COALESCE(statement_close_day, payment_due_day, 1),
      CURRENT_DATE
    )
  ),
  next_payment_due_date = COALESCE(
    next_payment_due_date,
    public.compute_next_monthly_occurrence(payment_due_day, CURRENT_DATE)
  )
WHERE next_statement_close_date IS NULL
   OR next_payment_due_date IS NULL;

ALTER TABLE public.credit_cards
  ALTER COLUMN next_statement_close_date SET NOT NULL,
  ALTER COLUMN next_payment_due_date SET NOT NULL;

ALTER TABLE public.credit_cards
  DROP COLUMN IF EXISTS statement_close_day,
  DROP COLUMN IF EXISTS payment_due_day;

DROP FUNCTION IF EXISTS public.compute_next_monthly_occurrence(integer, date);
