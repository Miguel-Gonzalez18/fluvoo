-- Rename expense_category enum values to short stable slugs (in-place; no row updates needed).
ALTER TYPE public.expense_category RENAME VALUE 'transferencias_pagos_personas' TO 'transferencias';
ALTER TYPE public.expense_category RENAME VALUE 'restaurantes_comida_rapida' TO 'restaurantes';
ALTER TYPE public.expense_category RENAME VALUE 'supermercados_alimentacion' TO 'supermercados';
ALTER TYPE public.expense_category RENAME VALUE 'gasolina_transporte' TO 'transporte';
ALTER TYPE public.expense_category RENAME VALUE 'salud_farmacia' TO 'salud';
ALTER TYPE public.expense_category RENAME VALUE 'servicios_hogar' TO 'servicios';
ALTER TYPE public.expense_category RENAME VALUE 'telecomunicaciones' TO 'telecom';
ALTER TYPE public.expense_category RENAME VALUE 'ocio_salidas' TO 'ocio';
ALTER TYPE public.expense_category RENAME VALUE 'compras_retail' TO 'compras';
ALTER TYPE public.expense_category RENAME VALUE 'viajes_turismo' TO 'viajes';
ALTER TYPE public.expense_category RENAME VALUE 'deudas_prestamos' TO 'deudas';
ALTER TYPE public.expense_category RENAME VALUE 'servicios_profesionales_negocios' TO 'negocios';
ALTER TYPE public.expense_category RENAME VALUE 'hogar_reparaciones' TO 'hogar';
ALTER TYPE public.expense_category RENAME VALUE 'ahorros_inversiones' TO 'ahorros';
