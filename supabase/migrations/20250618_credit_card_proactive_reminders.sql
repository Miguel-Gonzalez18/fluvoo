-- Proactive credit card close and payment-upcoming notifications

ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'credit_card_close_reminder';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'credit_card_payment_upcoming';
