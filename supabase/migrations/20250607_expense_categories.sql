CREATE TYPE public.expense_category AS ENUM (
  'supermercados_alimentacion',
  'restaurantes_comida_rapida',
  'gasolina_transporte',
  'salud_farmacia',
  'educacion',
  'servicios_hogar',
  'telecomunicaciones',
  'entretenimiento',
  'ocio_salidas',
  'compras_retail',
  'viajes_turismo',
  'deudas_prestamos',
  'servicios_profesionales_negocios',
  'transferencias_pagos_personas',
  'hogar_reparaciones',
  'mascotas',
  'ahorros_inversiones',
  'otros'
);

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS expense_category public.expense_category,
  ADD COLUMN IF NOT EXISTS category_source text;

COMMENT ON COLUMN public.transactions.expense_category IS
  'Spending category for dashboard; null for income rows';
COMMENT ON COLUMN public.transactions.category_source IS
  'rule or manual';
