-- Gmail OAuth tokens (server-only access via service role)
CREATE TABLE IF NOT EXISTS public.gmail_connections (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  google_email text NOT NULL,
  refresh_token text NOT NULL,
  access_token text,
  token_expires_at timestamptz,
  scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  connected_at timestamptz NOT NULL DEFAULT now(),
  last_sync_at timestamptz,
  sync_status text NOT NULL DEFAULT 'pending',
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.gmail_connections IS 'OAuth tokens for Gmail API. No client-facing RLS policies; access via service role only.';

ALTER TABLE public.gmail_connections ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.gmail_connections FROM anon, authenticated;
GRANT ALL ON public.gmail_connections TO service_role;

CREATE OR REPLACE FUNCTION public.set_gmail_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gmail_connections_updated_at ON public.gmail_connections;
CREATE TRIGGER trg_gmail_connections_updated_at
  BEFORE UPDATE ON public.gmail_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.set_gmail_connections_updated_at();
