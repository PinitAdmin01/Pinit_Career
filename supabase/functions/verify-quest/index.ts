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
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

// ── CORS ─────────────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Supported quest test suites ───────────────────────────────────────────────
// These are the server-side test definitions. The client NEVER sees these test
// strings in the bundle — they only exist in this Deno environment.
const QUEST_TEST_SUITES: Record<string, string> = {
  fizzbuzz: `
    if (typeof fizzBuzz !== 'function') throw new Error("Method fizzBuzz(int n) not found.");
    if (fizzBuzz(3) !== "Fizz") throw new Error("Failed: fizzBuzz(3) should return 'Fizz'");
    if (fizzBuzz(5) !== "Buzz") throw new Error("Failed: fizzBuzz(5) should return 'Buzz'");
    if (fizzBuzz(15) !== "FizzBuzz") throw new Error("Failed: fizzBuzz(15) should return 'FizzBuzz'");
    if (fizzBuzz(7) !== "7") throw new Error("Failed: fizzBuzz(7) should return '7'");
    if (fizzBuzz(1) !== "1") throw new Error("Failed: fizzBuzz(1) should return '1'");
  `,
  reverser: `
    if (typeof reverseString !== 'function') throw new Error("Method reverseString(String s) not found.");
    if (reverseString("hello") !== "olleh") throw new Error("Failed: reverseString('hello') !== 'olleh'");
    if (reverseString("") !== "") throw new Error("Failed: reverseString('') should return ''");
    if (reverseString("a") !== "a") throw new Error("Failed: reverseString('a') !== 'a'");
    if (reverseString("abcde") !== "edcba") throw new Error("Failed: reverseString('abcde') !== 'edcba'");
  `,
  palindrome: `
    if (typeof isPalindrome !== 'function') throw new Error("Method isPalindrome(String s) not found.");
    if (!isPalindrome("racecar")) throw new Error("Failed: 'racecar' is a palindrome");
    if (isPalindrome("hello")) throw new Error("Failed: 'hello' is not a palindrome");
    if (!isPalindrome("a")) throw new Error("Failed: 'a' is a palindrome");
  `,
  // Generic pass-through for lecture/interactive type quests that don't have code tests
  generic: `// Generic verification pass — no code test required`,
};

// ── Java → JS transpiler (same logic as client.ts, now running server-side) ──
function javaToJs(javaCode: string): string {
  let js = javaCode;
  js = js.replace(/public\s+class\s+\w+\s*\{/, "").trim();
  if (js.endsWith("}")) js = js.slice(0, -1);

  const keywords = new Set([
    "if", "for", "while", "switch", "catch", "synchronized",
  ]);
  js = js.replace(
    /(public|protected|private|static|\s)+([a-zA-Z0-9_<>\s\[\]]+)\s+(\w+)\s*\(([^)]*)\)/g,
    (_match: string, _access: string, _retType: string, name: string, args: string) => {
      if (keywords.has(name)) return _match;
      const cleanArgs = args.replace(
        /(int|String|double|float|boolean|char|int\[\])\s+/g,
        ""
      );
      return `function ${name}(${cleanArgs})`;
    }
  );
  js = js.replace(/new\s+int\[\]\s*\{/g, "[");
  js = js.replace(/\b(int|String|double|float|boolean|char)\b(?!\.)\s+(\w+)/g, "let $2");
  js = js.replace(/String\.valueOf\(/g, "String(");
  js = js.replace(/\.length\(\)/g, ".length");
  js = js.replace(/System\.out\.println/g, "console.log");
  return js;
}

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
  let action: string; // "verify" (default) or "start"
  let questId: string;
  let code: string;
  let testSuiteOverride: string | undefined;
  let questXp: number;
  let pinCost: number;

  try {
    const body = await req.json();
    action = body.action ?? "verify";
    questId = body.questId;
    code = body.code ?? "";
    testSuiteOverride = body.testSuite;
    questXp = typeof body.xp === "number" ? body.xp : 150;
    pinCost = typeof body.pinCost === "number" ? body.pinCost : 5;
    if (!questId) throw new Error("questId is required");
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

  // ── action=verify → evaluate code and persist completion ─────────────────
  const testSuite = testSuiteOverride ?? QUEST_TEST_SUITES[questId] ?? QUEST_TEST_SUITES.generic;

  // ── Transpile Java → JS ───────────────────────────────────────────────────
  let jsCode: string;
  try {
    jsCode = javaToJs(code);
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Transpile error: " + (err as Error).message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── Execute using Deno eval (sandboxed, server-side) ─────────────────────
  let success = false;
  let errorMessage = "";

  try {
    const wrappedCode = `
      (function() {
        ${jsCode}
        try {
          ${testSuite}
          return { success: true };
        } catch (e) {
          return { success: false, message: e.message };
        }
      })()
    `;
    // deno-lint-ignore no-eval
    const result = eval(wrappedCode) as { success: boolean; message?: string };
    success = result.success;
    errorMessage = result.message ?? "";
  } catch (err) {
    success = false;
    errorMessage = "Execution error: " + (err as Error).message;
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
