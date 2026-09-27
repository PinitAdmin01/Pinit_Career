// scripts/test_error_telemetry.ts
import { recordTelemetryEvent, triggerTestTelemetryException } from '../src/lib/telemetry/errorTelemetry';

console.log('========================================================================');
console.log('📡 AUDITING CLIENT ERROR TELEMETRY SENTINEL');
console.log('========================================================================\n');

// 1. Verify Intentional Test Probe
const probe = triggerTestTelemetryException();
if (!probe) {
  console.error('❌ Telemetry probe failed validation (null returned)');
  process.exit(1);
}
console.log('  ✅ [PASS] Telemetry Probe Triggered:');
console.log(`     • Event ID:   ${probe.id}`);
console.log(`     • Timestamp:  ${probe.timestamp}`);
console.log(`     • Release:    ${probe.release}`);
console.log(`     • Type:       ${probe.type}`);
console.log(`     • Route:      ${probe.route}`);

if (!probe.id || !probe.release || probe.type !== 'TEST_PROBE') {
  console.error('❌ Telemetry probe failed validation');
  process.exit(1);
}

// 2. Verify Secret Sanitization in Telemetry
const sensitiveMessage = 'Error connecting with token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThis and password="SuperSecretPassword123"';
const sanitizedEvent = recordTelemetryEvent({
  type: 'UNHANDLED_EXCEPTION',
  message: sensitiveMessage,
  stack: 'Error: Connection failed\n  at login (https://pinit.app/login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature)'
});
if (!sanitizedEvent) {
  console.error('❌ Sanitized event unexpectedly dropped by rate limiter');
  process.exit(1);
}

console.log('\n  ✅ [PASS] Secret Redaction Audit:');
console.log(`     • Raw:       ${sensitiveMessage}`);
console.log(`     • Sanitized: ${sanitizedEvent.message}`);

if (sanitizedEvent.message.includes('eyJ') || sanitizedEvent.message.includes('SuperSecretPassword123')) {
  console.error('❌ CRITICAL: Secrets leaked into telemetry message!');
  process.exit(1);
}

if (sanitizedEvent.stack?.includes('eyJ')) {
  console.error('❌ CRITICAL: JWT leaked into telemetry stack!');
  process.exit(1);
}

// 3. Verify Email, Query Parameter, and DB URL Sanitization
const piiMessage = 'Failed query for user student.alice@university.edu on postgres://user:secret123@db.prod:5432/main?email=alice@example.com&key=mykey123';
const sanitizedPii = recordTelemetryEvent({
  type: 'UNHANDLED_EXCEPTION',
  message: piiMessage,
  stack: 'Error at https://pinit.app/api?token=secrettoken123\n  caused by student.alice@university.edu'
});
if (!sanitizedPii) {
  console.error('❌ Sanitized PII unexpectedly dropped by rate limiter');
  process.exit(1);
}

console.log('\n  ✅ [PASS] Secondary PII & Parameter Redaction Audit:');
console.log(`     • Raw:       ${piiMessage}`);
console.log(`     • Sanitized: ${sanitizedPii.message}`);

if (sanitizedPii.message.includes('student.alice@university.edu') || sanitizedPii.message.includes('alice@example.com')) {
  console.error('❌ CRITICAL: Email address leaked into telemetry message!');
  process.exit(1);
}

if (sanitizedPii.message.includes('secret123') || sanitizedPii.message.includes('mykey123')) {
  console.error('❌ CRITICAL: Database credentials or query param leaked into telemetry message!');
  process.exit(1);
}

if (sanitizedPii.stack?.includes('secrettoken123') || sanitizedPii.stack?.includes('student.alice@university.edu')) {
  console.error('❌ CRITICAL: Sensitive parameter leaked into telemetry stack!');
  process.exit(1);
}

console.log('\n========================================================================');
console.log('🏁 TELEMETRY AUDIT PASSED: ZERO SECRETS LEAKED, CONTEXT CAPTURED');
console.log('========================================================================');
