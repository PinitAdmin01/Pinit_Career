// supabase/functions/verify-quest/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Secure Supabase Edge Function: verify-quest (v2)
//
// Q-C2 + Q-C3 enhancements:
//   • After a quest passes code evaluation, atomically appends the questId to
//     users.completed_quests and increments xp_total in a single DB update.
//   • For quest START requests (action=start), atomically validates and deducts
//     pins from the DB — the single authoritative source for pin balances.
//   • Both operations use the SERVICE_ROLE key (bypasses RLS) to guarantee
//     consistency even when the student's JWT has expired.
//
// WHY THIS EXISTS (original rationale unchanged):
//   The original verify handler ran a JavaScript `new Function(...)` evaluator
//   inside the student's own browser. Any student could open the browser console,
//   intercept the evaluator, and return { success: true } — bypassing all test logic.
//
//   This function runs the code evaluation on Deno (serverless), then returns a
//   cryptographically signed verification token that the client stores in Supabase.
//   The token proves the quest was completed server-side, not faked client-side.
//
// DEPLOY:
//   supabase functions deploy verify-quest
//
// ENV VARS REQUIRED:
//   QUEST_SIGNING_SECRET      — used to HMAC-sign the verification token
//   SUPABASE_URL              — auto-injected
//   SUPABASE_ANON_KEY         — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — required for pin + completion writes (bypasses RLS)
//   JS_JUDGE_URL              — the isolated grading judge (cloud-run/js-judge/).
//                               This function no longer executes student code
//                               itself — see grading.ts for why.
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";
import { QUEST_TEST_SUITES } from "./questTestSuites.generated.ts";
import { gradeSubmission } from "./grading.ts";

// ── CORS ─────────────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Supported quest test suites ───────────────────────────────────────────────
// STAGE 1 FIX (§3.1 + §3.2): QUEST_TEST_SUITES is now a SERVER-OWNED registry
// generated from the authoritative course data (scripts/generate-quest-test-suites.ts,
// see questTestSuites.generated.ts), not a 4-entry hand-written map. The previous
// map's only fallback key was `generic`, whose body never throws — so EVERY quest ID
// that wasn't one of the 3 hardcoded demo IDs fell through to a no-op test and
// PASSED UNCONDITIONALLY regardless of submitted code. There is no `generic` key in
// the generated registry; an unknown quest ID now has NO entry and fails closed
// below. The client can identify which quest it is submitting; it can no longer
// supply or override which test runs (see the `verify` handler — `body.testSuite`
// is no longer read at all).

// ── HMAC sign a verification token ───────────────────────────────────────────
function signVerificationToken(
  uid: string,
  questId: string,
  secret: string
): string {
  const payload = `${uid}:${questId}:${Date.now()}`;
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const sig = hmac.digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${sig}`;
}

// ── Q-C3: Atomic pin spend using service role (bypasses RLS) ─────────────────
async function atomicSpendPins(
  adminClient: ReturnType<typeof createClient>,
  uid: string,
  cost: number,
  reason: string
): Promise<{ ok: boolean; newBalance?: number; reason?: string }> {
  const { data: profile, error: fetchErr } = await adminClient
    .from("users")
    .select("pins, pin_history")
    .eq("id", uid)
    .single();

  if (fetchErr || !profile) {
    console.warn("[atomicSpendPins] fetch failed:", fetchErr?.message);
    return { ok: false, reason: "ERROR" };
  }

  const current: number = profile.pins ?? 100;
  if (current < cost) {
    return { ok: false, reason: "INSUFFICIENT_PINS" };
  }

  const newBalance = current - cost;
  const tx = { id: `tx_${Date.now()}`, type: "spend", amount: cost, reason, timestamp: Date.now() };
  const history: any[] = profile.pin_history || [];
  const trimmedHistory = [tx, ...history].slice(0, 100);

  const { error: updateErr } = await adminClient
    .from("users")
    .update({ pins: newBalance, pin_history: trimmedHistory })
    .eq("id", uid);

  if (updateErr) {
    console.warn("[atomicSpendPins] update failed:", updateErr.message);
    return { ok: false, reason: "ERROR" };
  }

  return { ok: true, newBalance };
}

// ── Q-C2: Atomic quest completion persistence (bypasses RLS) ─────────────────
async function atomicPersistCompletion(
  adminClient: ReturnType<typeof createClient>,
  uid: string,
  questId: string,
  xpAmount: number
): Promise<{ ok: boolean }> {
  const { data: profile, error: fetchErr } = await adminClient
    .from("users")
    .select("completed_quests, xp_total")
    .eq("id", uid)
    .single();

  if (fetchErr || !profile) {
    console.warn("[atomicPersistCompletion] fetch failed:", fetchErr?.message);
    return { ok: false };
  }

  const current: string[] = profile.completed_quests || [];
  if (current.includes(questId)) {
    return { ok: true }; // idempotent
  }

  const newCompleted = [...current, questId];
  const newXp = (profile.xp_total || 0) + xpAmount;

  const { error: updateErr } = await adminClient
    .from("users")
    .update({ completed_quests: newCompleted, xp_total: newXp })
    .eq("id", uid);

  if (updateErr) {
    console.warn("[atomicPersistCompletion] update failed:", updateErr.message);
    return { ok: false };
  }

  return { ok: true };
}

// ── Main handler ─────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // User client — for auth only
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  // Admin client — for pin deduction + quest persistence (bypasses RLS)
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  // STAGE 1 FIX (§3.2 + §3.3): `body.testSuite` is intentionally NOT read. The
  // grader is resolved exclusively from `QUEST_TEST_SUITES[questId]` (the
  // server-owned registry below) — the client can say which quest it is
  // submitting, never which test verifies it.
  let action: string; // "verify" (default) or "start"
  let questId: string;
  let code: string;
  let questXp: number;
  let pinCost: number;

  try {
    const body = await req.json();
    action = body.action ?? "verify";
    questId = body.questId;
    code = body.code ?? "";
    questXp = typeof body.xp === "number" ? body.xp : 150;
    pinCost = typeof body.pinCost === "number" ? body.pinCost : 5;
    if (!questId) throw new Error("questId is required");
    if (code.length > 50000) throw new Error("Source code exceeds size limit (50KB max)");
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid body", detail: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── Q-C3: action=start → validate + deduct pins atomically ───────────────
  if (action === "start") {
    const spendResult = await atomicSpendPins(adminClient, user.id, pinCost, `Quest Start: ${questId}`);
    if (!spendResult.ok) {
      const status = spendResult.reason === "INSUFFICIENT_PINS" ? 402 : 500;
      console.log(`[verify-quest] START DENIED uid=${user.id} questId=${questId} reason=${spendResult.reason}`);
      return new Response(
        JSON.stringify({ ok: false, reason: spendResult.reason }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log(`[verify-quest] START OK uid=${user.id} questId=${questId} newBalance=${spendResult.newBalance}`);
    return new Response(
      JSON.stringify({ ok: true, newBalance: spendResult.newBalance }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── action=verify → delegate execution to the isolated judge, then persist ─
  // STAGE 1 FIX (§3.1 + §3.2 + §3.3 + §3.4): grading logic lives in grading.ts
  // (gradeSubmission), which:
  //   - fails closed on unknown quest IDs (no `generic` fallback — see
  //     questTestSuites.generated.ts, which has no such key);
  //   - is never given a client-supplied test suite (only `testSuites[questId]`);
  //   - no longer executes anything in THIS process — it POSTs {code,
  //     testSuite} to JS_JUDGE_URL, a separate Cloud Run service
  //     (cloud-run/js-judge/) with zero Supabase configuration. §3.3's
  //     Deno.env exposure is CLOSED by this, not hidden: this function never
  //     hands secret-bearing code and untrusted student code to the same
  //     process. See grading.ts's header for the full history and why
  //     splitting Supabase functions (secrets are project-wide) was ruled out.
  //   - the Java transpiler (javaToJs) is deleted — Java was already graded
  //     entirely through its own separate judge and never reached this path.
  // grading.ts has no Deno-specific APIs, so the exact same function is
  // exercised directly (not re-implemented) by the Node-based regression test
  // at scripts/verify-quest-grading.test.ts, pointed at a real locally-running
  // instance of cloud-run/js-judge/ — see that file and the Stage 1 report for
  // what was actually executed vs. what could only be reviewed (this deployed
  // function itself cannot be invoked from a dev session; JS_JUDGE_URL is not
  // yet deployed to Cloud Run — see the report for the exact blocker).
  const judgeUrl = Deno.env.get("JS_JUDGE_URL") ?? "";
  if (!judgeUrl) {
    return new Response(
      JSON.stringify({ success: false, message: "JUDGE_NOT_CONFIGURED" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  const gradeResult = await gradeSubmission(questId, code, QUEST_TEST_SUITES, judgeUrl);
  const success = gradeResult.success;
  const errorMessage = gradeResult.message ?? "";

  if (gradeResult.reason === "NO_TEST_SUITE") {
    console.log(`[verify-quest] FAIL-CLOSED — uid=${user.id} questId=${questId} reason=NO_TEST_SUITE`);
  }

  // ── If passed, persist completion + generate signed verification token ────
  if (success) {
    const signingSecret = Deno.env.get("QUEST_SIGNING_SECRET") ?? "dev_signing_secret_fallback";
    const verificationToken = signVerificationToken(user.id, questId, signingSecret);

    // Q-C2: Atomically persist to Supabase (non-blocking on token response)
    const persistResult = await atomicPersistCompletion(adminClient, user.id, questId, questXp);
    if (!persistResult.ok) {
      console.warn(`[verify-quest] Completion persistence failed for uid=${user.id} questId=${questId}`);
    }

    console.log(`[verify-quest] PASS — uid=${user.id} questId=${questId} xp=${questXp} persisted=${persistResult.ok}`);

    return new Response(
      JSON.stringify({
        success: true,
        verificationToken,
        questId,
        uid: user.id,
        verifiedAt: new Date().toISOString(),
        persistedToDb: persistResult.ok,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log(`[verify-quest] FAIL — uid=${user.id} questId=${questId} reason=${errorMessage}`);
  return new Response(
    JSON.stringify({ success: false, message: errorMessage }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
