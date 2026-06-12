-- System category colors (one unique color per expense_category enum slug)
CREATE TABLE IF NOT EXISTS public.expense_categories (
  slug TEXT PRIMARY KEY,
  color_hex TEXT NOT NULL CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  badge_bg_hex TEXT CHECK (badge_bg_hex IS NULL OR badge_bg_hex ~ '^#[0-9A-Fa-f]{6}$'),
  badge_text_hex TEXT CHECK (badge_text_hex IS NULL OR badge_text_hex ~ '^#[0-9A-Fa-f]{6}$'),
  badge_border_hex TEXT CHECK (badge_border_hex IS NULL OR badge_border_hex ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT expense_categories_slug_enum CHECK (
    slug IN (
      'transferencias',
      'entretenimiento',
      'restaurantes',
      'supermercados',
      'transporte',
      'salud',
      'educacion',
      'servicios',
      'telecom',
      'ocio',
      'compras',
      'viajes',
      'deudas',
      'negocios',
      'hogar',
      'mascotas',
      'ahorros',
      'otros'
    )
  )
);

COMMENT ON TABLE public.expense_categories IS
  'Unique display colors per expense category slug; system defaults for charts and badges';

-- Per-user color overrides (future manual transaction / category personalization)
CREATE TABLE IF NOT EXISTS public.user_category_colors (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL REFERENCES public.expense_categories(slug) ON DELETE CASCADE,
  color_hex TEXT NOT NULL CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  badge_bg_hex TEXT CHECK (badge_bg_hex IS NULL OR badge_bg_hex ~ '^#[0-9A-Fa-f]{6}$'),
  badge_text_hex TEXT CHECK (badge_text_hex IS NULL OR badge_text_hex ~ '^#[0-9A-Fa-f]{6}$'),
  badge_border_hex TEXT CHECK (badge_border_hex IS NULL OR badge_border_hex ~ '^#[0-9A-Fa-f]{6}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, category_slug)
);

CREATE INDEX IF NOT EXISTS user_category_colors_user_id_idx
  ON public.user_category_colors (user_id);

ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_category_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read expense category colors"
  ON public.expense_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages expense category colors"
  ON public.expense_categories
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own category color overrides"
  ON public.user_category_colors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own category color overrides"
  ON public.user_category_colors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages user category colors"
  ON public.user_category_colors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_expense_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS expense_categories_updated_at ON public.expense_categories;

CREATE TRIGGER expense_categories_updated_at
  BEFORE UPDATE ON public.expense_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_expense_categories_updated_at();

CREATE OR REPLACE FUNCTION public.set_user_category_colors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_category_colors_updated_at ON public.user_category_colors;

CREATE TRIGGER user_category_colors_updated_at
  BEFORE UPDATE ON public.user_category_colors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_category_colors_updated_at();

INSERT INTO public.expense_categories (slug, color_hex, sort_order) VALUES
  ('transferencias', '#475569', 1),
  ('entretenimiento', '#9333EA', 2),
  ('restaurantes', '#F97316', 3),
  ('supermercados', '#059669', 4),
  ('transporte', '#2563EB', 5),
  ('salud', '#E11D48', 6),
  ('educacion', '#7C3AED', 7),
  ('servicios', '#64748B', 8),
  ('telecom', '#0891B2', 9),
  ('ocio', '#DB2777', 10),
  ('compras', '#CA8A04', 11),
  ('viajes', '#0D9488', 12),
  ('deudas', '#DC2626', 13),
  ('negocios', '#4F46E5', 14),
  ('hogar', '#B45309', 15),
  ('mascotas', '#65A30D', 16),
  ('ahorros', '#10B981', 17),
  ('otros', '#78716C', 99)
ON CONFLICT (slug) DO NOTHING;
