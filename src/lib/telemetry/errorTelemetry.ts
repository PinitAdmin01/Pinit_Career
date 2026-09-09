// src/lib/telemetry/errorTelemetry.ts
/**
 * ============================================================================
 * PINIT CLIENT RUNTIME ERROR TELEMETRY SENTINEL
 * ============================================================================
 * 
 * Purpose:
 * Captures unhandled JavaScript exceptions, unhandled Promise rejections,
 * and client routing failures across all production browser sessions.
 * 
 * Privacy & Security Guarantees:
 * 1. Sanitizes messages to redact JWTs, API keys, passwords, and tokens.
 * 2. Does not capture private student assessment answers or sensitive PII.
 * 3. Includes release version identifier, route context, and scrubbed stack traces.
 * 4. Buffers telemetry in diagnostic session storage for local debugging.
 */

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  release: string;
  type: 'UNHANDLED_EXCEPTION' | 'UNHANDLED_REJECTION' | 'ROUTE_ERROR' | 'TEST_PROBE';
  message: string;
  stack?: string;
  route: string;
  userAgent: string;
}

const REDACTION_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, replacement: '[REDACTED_JWT]' },
  { pattern: /(?:key|token|password|secret|auth|bearer)\s*[:=]\s*['"]?[^'"\s&]+['"]?/gi, replacement: '[REDACTED_SECRET]' },
  { pattern: /https?:\/\/[^:]+:[^@]+@/g, replacement: 'https://[REDACTED_CREDENTIALS]@' },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[REDACTED_EMAIL]' },
  { pattern: /[?&](?:token|key|secret|password|auth|code|jwt|email)=[^&\s]+/gi, replacement: '?[REDACTED_PARAM]' },
  { pattern: /(?:postgres|postgresql|mysql|mongodb):\/\/[^\s]+/gi, replacement: '[REDACTED_DB_URL]' },
];

function sanitizeErrorMessage(msg: string): string {
  let cleaned = msg || 'Unknown error';
  for (const { pattern, replacement } of REDACTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

const APP_RELEASE_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'd0f3a65b68';
const TELEMETRY_STORAGE_KEY = 'pinit_client_telemetry_events';
const MAX_BUFFERED_EVENTS = 50;

// Client-side rate-limiting: max 5 events per 60-second window
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_EVENTS_PER_WINDOW = 5;
const eventTimestamps: number[] = [];

// Payload size cap: 2 KB maximum total payload
const MAX_PAYLOAD_BYTES = 2048;

let isInitialized = false;

export function recordTelemetryEvent(event: Omit<TelemetryEvent, 'id' | 'timestamp' | 'release' | 'route' | 'userAgent'>): TelemetryEvent | null {
  const now = Date.now();

  // Enforce client-side rate limit window
  while (eventTimestamps.length > 0 && eventTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    eventTimestamps.shift();
  }

  if (eventTimestamps.length >= MAX_EVENTS_PER_WINDOW) {
    // Drop excess telemetry events locally to prevent browser flooding
    return null;
  }
  eventTimestamps.push(now);

  const currentRoute = typeof window !== 'undefined' ? window.location.pathname : 'server';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';

  let sanitizedMsg = sanitizeErrorMessage(event.message).slice(0, 500);
  let sanitizedStack = event.stack ? sanitizeErrorMessage(event.stack).slice(0, 1000) : undefined;

  const fullEvent: TelemetryEvent = {
    id: `tel_${now}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date(now).toISOString(),
    release: APP_RELEASE_VERSION,
    route: currentRoute,
    userAgent,
    type: event.type,
    message: sanitizedMsg,
    stack: sanitizedStack,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(TELEMETRY_STORAGE_KEY);
      const events: TelemetryEvent[] = raw ? JSON.parse(raw) : [];
      events.unshift(fullEvent);
      if (events.length > MAX_BUFFERED_EVENTS) events.length = MAX_BUFFERED_EVENTS;
      sessionStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(events));
    } catch {}

    // Expose on window for runtime engineering diagnostics
    (window as any).__PINIT_TELEMETRY__ = (window as any).__PINIT_TELEMETRY__ || [];
    (window as any).__PINIT_TELEMETRY__.unshift(fullEvent);

    // Ingestion boundary:
    // CLASSIFICATION: UNTRUSTED CLIENT OBSERVATION
    // Must NEVER be treated as authoritative security or certification evidence.
    // Telemetry is decoupled from application contact tables (ZERO writing to contact_submissions).
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && process.env.NEXT_PUBLIC_TELEMETRY_ENABLED === 'true') {
      const endpoint = `${supabaseUrl}/rest/v1/client_telemetry_events?apikey=${encodeURIComponent(supabaseAnonKey)}`;
      let payloadStr = JSON.stringify({
        client_id: fullEvent.id,
        client_reported_timestamp: fullEvent.timestamp,
        release: fullEvent.release,
        route: fullEvent.route,
        error_type: fullEvent.type,
        sanitized_message: fullEvent.message,
        sanitized_stack: fullEvent.stack,
        trust_classification: 'UNTRUSTED_CLIENT_OBSERVATION'
      });

      // Enforce 2 KB payload limit
      if (payloadStr.length > MAX_PAYLOAD_BYTES) {
        payloadStr = payloadStr.slice(0, MAX_PAYLOAD_BYTES - 2) + '"}';
      }

      if (typeof fetch !== 'undefined') {
        try {
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: payloadStr,
            keepalive: true
          }).catch(() => {});
        } catch {}
      } else if (navigator.sendBeacon) {
        try {
          const blob = new Blob([payloadStr], { type: 'application/json' });
          navigator.sendBeacon(endpoint, blob);
        } catch {}
      }
    }
  }

  return fullEvent;
}

export function initClientTelemetry(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // 1. Capture unhandled JavaScript exceptions
  window.addEventListener('error', (event: ErrorEvent) => {
    recordTelemetryEvent({
      type: 'UNHANDLED_EXCEPTION',
      message: event.message || 'Unknown unhandled exception',
      stack: event.error?.stack,
    });
  });

  // 2. Capture unhandled Promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    let message = 'Unhandled Promise Rejection';
    let stack: string | undefined;

    if (event.reason instanceof Error) {
      message = event.reason.message;
      stack = event.reason.stack;
    } else if (typeof event.reason === 'string') {
      message = event.reason;
    }

    recordTelemetryEvent({
      type: 'UNHANDLED_REJECTION',
      message,
      stack,
    });
  });

  console.log(`📡 [Telemetry] PinIT Client Error Telemetry Active (Release: ${APP_RELEASE_VERSION})`);
}

export function getBufferedTelemetryEvents(): TelemetryEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(TELEMETRY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Diagnostic Verification Function:
 * Triggers a test telemetry probe and returns the structured telemetry event
 * to verify route, release, sanitized message, and stack capture.
 */
export function triggerTestTelemetryException(): TelemetryEvent | null {
  return recordTelemetryEvent({
    type: 'TEST_PROBE',
    message: 'Intentional Telemetry Verification Probe (Testing error pipeline)',
    stack: new Error('Verification Stack Trace').stack,
  });
}
