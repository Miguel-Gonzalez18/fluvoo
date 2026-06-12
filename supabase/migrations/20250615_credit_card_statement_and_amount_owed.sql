-- Saldo al corte (revolving) en tarjetas de crédito
ALTER TABLE public.credit_cards
  ADD COLUMN IF NOT EXISTS statement_balance numeric(12, 2) NOT NULL DEFAULT 0
    CHECK (statement_balance >= 0),
  ADD COLUMN IF NOT EXISTS statement_balance_usd numeric(12, 2) NOT NULL DEFAULT 0
    CHECK (statement_balance_usd >= 0);

COMMENT ON COLUMN public.credit_cards.statement_balance IS
  'Saldo al corte del último estado de cuenta en RD$';
COMMENT ON COLUMN public.credit_cards.statement_balance_usd IS
  'Saldo al corte del último estado de cuenta en USD';

-- Monto adeudado en compras a cuotas (remaining_balance)
UPDATE public.credit_card_installments
SET remaining_balance = 0
WHERE remaining_balance IS NULL;

ALTER TABLE public.credit_card_installments
  ALTER COLUMN remaining_balance SET DEFAULT 0,
  ALTER COLUMN remaining_balance SET NOT NULL;

COMMENT ON COLUMN public.credit_card_installments.remaining_balance IS
  'Monto adeudado pendiente de la compra a cuotas';
