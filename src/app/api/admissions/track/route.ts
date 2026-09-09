import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';

/**
 * Public application tracking.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS ROUTE IS GATED THE WAY IT IS
 * ─────────────────────────────────────────────────────────────────────────────
 * This endpoint is intentionally unauthenticated — an applicant has no account
 * yet, so requiring a login would defeat the feature. That is fine. What was
 * NOT fine is that a single guessable identifier was the only thing standing
 * between an anonymous caller and a named applicant's course, rank and status.
 *
 * Application ids are generated as `APP-${Date.now()}` — a millisecond
 * timestamp. Individually that is a large keyspace, but timestamps of people
 * who applied around the same time are ADJACENT. One known id (an attacker's
 * own, for instance) leaks its neighbours: scan a few thousand milliseconds
 * either side and you harvest everyone who applied that minute. With no rate
 * limit, that is cheap.
 *
 * Applicant records contain no date of birth, phone or email, so the usual
 * second factors are unavailable without a schema change. studentId is not
 * usable either — anonymous applications store `anon-<timestamp>`, which is as
 * guessable as the id itself.
 *
 * That leaves the applicant's own name. It is not a secret, and this is not
 * presented as strong authentication. What it does is change the attack from
 * "enumerate ids and read everything" to "you must already know both the id
 * AND the matching name" — which is precisely the bulk-harvesting case worth
 * stopping. Combined with the rate limit and the uniform response below, an
 * enumeration run yields nothing.
 *
 * Under India's DPDP Act this data — names, ranks and admission status, often
 * of minors — is exactly the category that attracts regulatory attention.
 */

// ── Rate limiting ────────────────────────────────────────────────────────────
// LIMITATION, STATED PLAINLY: this counter lives in module memory. On a
// serverless host each instance keeps its own map and cold starts reset it, so
// a determined attacker spread across instances gets more than MAX_ATTEMPTS.
// It is a speed bump, not a wall. The durable fix is a shared store (Redis /
// Upstash) or a database-backed counter; this is deliberately dependency-free
// so it can ship now rather than waiting on infrastructure.
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_WINDOW = 8;
const attemptLog = new Map<string, number[]>();

function getClientKey(req: Request): string {
  // x-forwarded-for is client-supplied and therefore spoofable. It is used here
  // only to bucket honest traffic, never as an identity or an authorisation
  // input, so spoofing it buys an attacker nothing beyond a fresh bucket.
  const fwd = req.headers.get('x-forwarded-for') || '';
  const real = req.headers.get('x-real-ip') || '';
  return (fwd.split(',')[0] || real || 'unknown').trim();
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attemptLog.get(key) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  attemptLog.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound on a
  // long-lived instance.
  if (attemptLog.size > 5000) {
    for (const [k, times] of attemptLog) {
      if (!times.some(t => now - t < RATE_LIMIT_WINDOW_MS)) attemptLog.delete(k);
    }
  }
  return recent.length > MAX_ATTEMPTS_PER_WINDOW;
}

/** Case- and whitespace-insensitive comparison of the supplied name. */
function nameMatches(supplied: string, stored: unknown): boolean {
  if (typeof stored !== 'string' || !stored.trim()) return false;
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  return norm(supplied) === norm(stored);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = (searchParams.get('id') || '').trim();
    const name = (searchParams.get('name') || '').trim();

    const clientKey = getClientKey(req);
    if (isRateLimited(clientKey)) {
      console.warn(`[Admissions Track] Rate limit exceeded for client bucket: ${clientKey}`);
      return NextResponse.json(
        {
          error: 'RATE_LIMITED',
          message: 'Too many tracking attempts. Please wait a minute and try again.',
        },
        { status: 429 }
      );
    }

    // UNIFORM RESPONSE. Every failure path below returns this identical object.
    // Distinguishing "no such application" from "wrong name" would turn the
    // endpoint into an existence oracle: an attacker could confirm which ids
    // are real without ever knowing a name, which is most of the value of
    // enumeration.
    const notFound = NextResponse.json({ application: null });

    if (!id || !name) {
      return NextResponse.json(
        {
          error: 'MISSING_FIELDS',
          message: 'Both the application ID and the applicant name are required.',
        },
        { status: 400 }
      );
    }

    const data = await admissionsService.trackApplication(id);
    const app = data?.application;

    if (!app) {
      console.log('[Admissions Track] Lookup miss (no such application).');
      return notFound;
    }

    if (!nameMatches(name, (app as any).studentName)) {
      console.log('[Admissions Track] Lookup miss (name did not match).');
      return notFound;
    }

    console.log(`[Admissions Track] Verified lookup succeeded for application ${id}.`);
    return NextResponse.json({ application: app });
  } catch (err: any) {
    console.error('[Admissions Track] Error:', err?.message);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
