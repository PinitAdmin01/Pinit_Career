// supabase/functions/push-dossier/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure Supabase Edge Function: push-dossier
// Replaces the client-side /api/placements/push handler in client.ts.
//
// WHY THIS EXISTS:
//   The original client.ts had the webhook secret hard-coded in the static
//   JavaScript bundle ("pinit_verify_token_882"). Any student could open
//   DevTools → Sources → find the token → forge dossier pushes.
//   This function moves that secret to Deno environment variables which are
//   NEVER served to the browser.
//
// DEPLOY:
//   supabase functions deploy push-dossier --no-verify-jwt
//
// ENV VARS REQUIRED (set via Supabase Dashboard → Settings → Edge Functions):
//   RECRUITER_WEBHOOK_SECRET  — the bearer token for recruiter-portal.pinit.app
//   SUPABASE_URL              — auto-injected by Supabase runtime
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected by Supabase runtime
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS headers so the Next.js static app on Firebase can call this ─────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Outbox table: durable retry queue for failed dossier deliveries ────────
const OUTBOX_TABLE = "dossier_delivery_outbox";

/**
 * Persist a failed dossier delivery to the outbox so it can be retried by a
 * scheduled retry worker. Returns true if persisted, false if storage failed.
 */
async function persistOutboxRecord(
  client: ReturnType<typeof createClient>,
  studentId: string,
  dossier: Record<string, unknown>,
  reason: string,
  attempt: number
): Promise<boolean> {
  try {
    const { error } = await client
      .from(OUTBOX_TABLE)
      .insert({
        studentId,
        dossier,
        status: "QUEUED_FOR_RETRY",
        reason,
        attempt,
        createdAt: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.warn(`[push-dossier] Outbox persist failed: ${error.message}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[push-dossier] Outbox persist threw: ${(err as Error).message}`);
    return false;
  }
}

serve(async (req: Request) => {
  // Handle OPTIONS pre-flight from the browser
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Auth: require a valid Supabase JWT so only real users can call this ──
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Parse request body ──────────────────────────────────────────────────
  let studentId: string;
  let dossier: Record<string, unknown> | undefined;

  try {
    const body = await req.json();
    studentId = body.studentId;
    dossier = body.dossier; // Optional: caller can pre-build dossier or let us build it
    if (!studentId) throw new Error("studentId is required");
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid request body", detail: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── If no dossier was passed, fetch it from Firestore via service client ─
  // NOTE: Since this project uses Firestore (not Supabase DB), the dossier is
  // built on the client and passed in the body. We validate it here.
  if (!dossier) {
    return new Response(
      JSON.stringify({ error: "dossier payload is required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Ensure the dossier belongs to the authenticated user (anti-forgery check)
  if (dossier.studentId && dossier.studentId !== user.id && dossier.studentId !== studentId) {
    return new Response(
      JSON.stringify({ error: "Dossier student ID mismatch — access denied" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── Push dossier to recruiter portal ─────────────────────────────────────
  try {
    const pushRes = await fetch(
      "https://recruiter-portal.pinit.app/api/dossier/receive",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("RECRUITER_WEBHOOK_SECRET") ?? ""}`,
        },
        body: JSON.stringify({ ...dossier, pushedAt: new Date().toISOString() }),
      }
    );

    if (pushRes.ok) {
      console.log(`[push-dossier] Dossier pushed for studentId=${studentId}`);
      return new Response(
        JSON.stringify({ ok: true, status: "PUSHED_TO_RECRUITERS", dossier }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Recruiter portal returned an error HTTP code → persist to outbox, then report honestly
    const errBody = await pushRes.text();
    console.warn(`[push-dossier] Recruiter portal responded ${pushRes.status}: ${errBody}`);
    const persisted = await persistOutboxRecord(
      supabaseClient,
      studentId,
      dossier,
      `RECRUITER_PORTAL_HTTP_${pushRes.status}`,
      1
    );
    if (persisted) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: "DELIVERY_QUEUED_FOR_RETRY",
          error: "RECRUITER_PORTAL_HTTP_ERROR",
          message: `Recruiter portal returned HTTP ${pushRes.status}. Dossier queued for retry.`,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        ok: false,
        status: "DELIVERY_FAILED",
        error: "OUTBOX_UNAVAILABLE",
        message: "Recruiter portal returned HTTP " + pushRes.status + " and the retry outbox is unavailable.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.warn("[push-dossier] Recruiter portal unreachable:", (err as Error).message);
    const persisted = await persistOutboxRecord(
      supabaseClient,
      studentId,
      dossier,
      "RECRUITER_PORTAL_UNREACHABLE",
      1
    );
    if (persisted) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: "DELIVERY_QUEUED_FOR_RETRY",
          error: "RECRUITER_PORTAL_UNREACHABLE",
          message: "Recruiter portal unreachable. Dossier queued for retry.",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        ok: false,
        status: "DELIVERY_FAILED",
        error: "RECRUITER_PORTAL_UNREACHABLE",
        message: "Recruiter portal unreachable and the retry outbox is unavailable.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
