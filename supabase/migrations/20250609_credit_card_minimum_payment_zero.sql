-- Allow minimum_payment = 0 on credit cards (valid when balance is zero)
ALTER TABLE public.credit_cards
  DROP CONSTRAINT IF EXISTS credit_cards_minimum_payment_check;

ALTER TABLE public.credit_cards
  ADD CONSTRAINT credit_cards_minimum_payment_check
  CHECK (minimum_payment >= 0);
