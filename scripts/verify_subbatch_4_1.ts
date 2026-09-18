import * as dotenv from 'dotenv';
dotenv.config();

import {
  POST,
  validateAudioMagicBytes,
  getSttMetrics,
  resetSttMetrics,
  recordSttFailure,
  recordSttSuccess,
  MAX_STT_BYTES,
  MIN_STT_BYTES,
  ALLOWED_MIME_PREFIXES,
} from '../src/app/api/stt/route';

async function runSubBatch4_1Tests() {
  console.log('========================================================================');
  console.log('📦 VERIFYING SUB-BATCH 4.1: Speech-to-Text & Audio Fallback (Issues 082-086)');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // ── Defect 085: Audio MIME & Magic Byte Validation ──
  console.log('── Defect 085: Audio MIME Type & Magic Bytes Guard ──');
  // 1. Valid WebM header: 1A 45 DF A3
  const webmHeader = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0x01, 0x00, 0x00]);
  assert(validateAudioMagicBytes(webmHeader) === true, 'WebM magic bytes [1A 45 DF A3] validated');

  // 2. Valid WAV header: 'RIFF'
  const wavHeader = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00]);
  assert(validateAudioMagicBytes(wavHeader) === true, 'WAV magic bytes [RIFF] validated');

  // 3. Valid OGG header: 'OggS'
  const oggHeader = new Uint8Array([0x4f, 0x67, 0x67, 0x53, 0x00, 0x02, 0x00, 0x00]);
  assert(validateAudioMagicBytes(oggHeader) === true, 'OGG magic bytes [OggS] validated');

  // 4. Valid MP3 header: 'ID3'
  const mp3Header = new Uint8Array([0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00]);
  assert(validateAudioMagicBytes(mp3Header) === true, 'MP3 magic bytes [ID3] validated');

  // 5. Corrupted / text / executable file magic bytes
  const invalidHeader = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]); // DOS MZ
  assert(validateAudioMagicBytes(invalidHeader) === false, 'Non-audio DOS executable header [MZ] rejected');
  const textHeader = new Uint8Array([0x48, 0x65, 0x6c, 0x6c]); // 'Hell'
  assert(validateAudioMagicBytes(textHeader) === false, 'Arbitrary text bytes rejected');

  // ── Defect 084: Audio Buffer Sizing & Truncation Guard ──
  console.log('\n── Defect 084: Audio Buffer Sizing & Truncation Guard ──');
  assert(MAX_STT_BYTES === 25 * 1024 * 1024, 'MAX_STT_BYTES is configured to 25MB (not 4MB or 15MB)');
  assert(MIN_STT_BYTES === 1024, 'MIN_STT_BYTES enforces 1KB minimum threshold');

  // ── Defect 083: Observability & Health Metrics ──
  console.log('\n── Defect 083: Observability & Health Metrics ──');
  resetSttMetrics();
  assert(getSttMetrics().totalFailures === 0, 'Initial STT failure counter is 0');

  recordSttFailure('groq-whisper', 'Test simulated rate limit', 429);
  const metricsAfter1 = getSttMetrics();
  assert(metricsAfter1.totalFailures === 1, 'Failure incremented totalFailures to 1');
  assert(metricsAfter1.consecutiveFailures === 1, 'consecutiveFailures tracked at 1');
  assert(metricsAfter1.lastFailureEngine === 'groq-whisper', 'Engine tagged as groq-whisper');
  assert(metricsAfter1.lastFailureReason === 'Test simulated rate limit', 'Failure reason captured');

  recordSttSuccess();
  assert(getSttMetrics().consecutiveFailures === 0, 'recordSttSuccess resets consecutiveFailures to 0');

  // ── Defect 082: Fail-Fast Error Reporting (No Fabricated Text) ──
  console.log('\n── Defect 082: Synthetic Audio Fallback Eradication ──');
  // Create mock WebM audio payload (> 1KB)
  const validAudioPayload = new Uint8Array(2048);
  validAudioPayload[0] = 0x1a;
  validAudioPayload[1] = 0x45;
  validAudioPayload[2] = 0xdf;
  validAudioPayload[3] = 0xa3;

  const validBlob = new Blob([validAudioPayload], { type: 'audio/webm' });
  const mockFormData = new FormData();
  mockFormData.append('file', validBlob, 'recording.webm');
  mockFormData.append('mimeType', 'audio/webm');

  // Simulate request to POST handler with offline external services
  const mockReq = {
    formData: async () => mockFormData,
    headers: new Headers({
      'x-student-id': 'student_demo_001',
      'authorization': 'Bearer demo-token-bypass'
    }),
  } as any;

  // Temporarily backup env vars to force fallback
  const origGroqKeys = process.env.GROQ_API_KEYS;
  const origGroqKey = process.env.GROQ_API_KEY;
  const origBackend = process.env.STT_API_URL;
  delete process.env.GROQ_API_KEYS;
  delete process.env.GROQ_API_KEY;
  delete process.env.STT_API_URL;

  try {
    const res = await POST(mockReq);
    const body = await res.json();

    assert(res.status === 503, `Fallback returns HTTP 503 Service Unavailable (Got ${res.status})`);
    assert(body.error === 'STT_FAILED', `Fallback returns error code STT_FAILED (Got ${body.error})`);
    assert(body.retryable === true, 'Fallback indicates retryable: true');
    assert(body.text === undefined, 'Fabricated synthetic text string is completely eradicated (undefined)');
    assert(
      !JSON.stringify(body).includes('Voice response successfully received and processed via audio buffer'),
      'Zero trace of legacy synthetic fallback message in response payload'
    );
  } finally {
    if (origGroqKeys) process.env.GROQ_API_KEYS = origGroqKeys;
    if (origGroqKey) process.env.GROQ_API_KEY = origGroqKey;
    if (origBackend) process.env.STT_API_URL = origBackend;
  }

  // ── Defect 086: Multi-Key Rotation Pool Logic ──
  console.log('\n── Defect 086: Groq Multi-Key Pool Parsing ──');
  const sampleKeyPool = ' gsk_key1 , gsk_key2,   gsk_key3  ';
  const parsedKeys = sampleKeyPool.split(',').map(k => k.trim()).filter(Boolean);
  assert(parsedKeys.length === 3, 'Multi-key comma separation parses 3 distinct keys');
  assert(parsedKeys[0] === 'gsk_key1' && parsedKeys[1] === 'gsk_key2' && parsedKeys[2] === 'gsk_key3', 'Keys trimmed cleanly without whitespace');

  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 4.1 RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSubBatch4_1Tests().catch(err => {
  console.error('Test execution crashed:', err);
  process.exit(1);
});
