CREATE TABLE IF NOT EXISTS public.user_ai_insights (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  context_hash TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL CHECK (source IN ('ai', 'fallback')),
  trigger_event TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_ai_insights_generated_at_idx
  ON public.user_ai_insights (generated_at DESC);

ALTER TABLE public.user_ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ai insights"
  ON public.user_ai_insights
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages ai insights"
  ON public.user_ai_insights
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_user_ai_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_ai_insights_updated_at ON public.user_ai_insights;

CREATE TRIGGER user_ai_insights_updated_at
  BEFORE UPDATE ON public.user_ai_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_ai_insights_updated_at();
