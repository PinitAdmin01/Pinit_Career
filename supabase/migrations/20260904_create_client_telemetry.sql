-- supabase/migrations/20260904_create_client_telemetry.sql
-- PinIT Career OS: Dedicated Ingestion Boundary for Untrusted Client Error Telemetry

CREATE TABLE IF NOT EXISTS public.client_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(64) NOT NULL,
    client_reported_timestamp TIMESTAMPTZ NOT NULL,
    server_received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    release VARCHAR(64) NOT NULL,
    route VARCHAR(256) NOT NULL,
    error_type VARCHAR(64) NOT NULL,
    sanitized_message VARCHAR(1000) NOT NULL,
    sanitized_stack VARCHAR(2000),
    trust_classification VARCHAR(64) NOT NULL DEFAULT 'UNTRUSTED_CLIENT_OBSERVATION',
    user_agent VARCHAR(512)
);

-- Enable RLS
ALTER TABLE public.client_telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_telemetry_events FORCE ROW LEVEL SECURITY;

-- Anonymous write-only ingestion policy (INSERT allowed, SELECT/UPDATE/DELETE strictly blocked)
DROP POLICY IF EXISTS "Allow anonymous telemetry ingest" ON public.client_telemetry_events;
CREATE POLICY "Allow anonymous telemetry ingest"
ON public.client_telemetry_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
    trust_classification = 'UNTRUSTED_CLIENT_OBSERVATION'
    AND length(sanitized_message) <= 1000
);

-- Strictly revoke reading/modifying from public/anon
REVOKE SELECT, UPDATE, DELETE, TRUNCATE ON public.client_telemetry_events FROM anon, authenticated;
GRANT INSERT ON public.client_telemetry_events TO anon, authenticated;

-- Service role retains full read/write for engineering diagnostics
GRANT ALL ON public.client_telemetry_events TO service_role;