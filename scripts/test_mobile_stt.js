// Test Suite for P2-2: Universal STT Engine & Resilient Utterance Buffer
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function transpileAndRequire(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const moduleObj = { exports: {} };
  const runner = new Function('module', 'exports', 'require', compiled.outputText);
  runner(moduleObj, moduleObj.exports, require);
  return moduleObj.exports;
}

const {
  MOBILE_STT_VERSION,
  MAX_UTTERANCE_DURATION_MS,
  MAX_UPLOAD_BYTES,
  getSupportedMimeType,
  isWebSpeechAvailable,
  UnifiedSpeechRecognizer
} = transpileAndRequire(path.join(__dirname, '../src/lib/audio/mobileSTTBuffer.ts'));

let passed = 0;
let failed = 0;

function assert(testName, condition, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details:`, details);
    failed++;
  }
}

console.log(`🧪 Running PinIT Universal STT & Mobile Buffer Test Suite (P2-2, ${MOBILE_STT_VERSION})...\n`);

// 1. MIME & Browser Support Detection
const mime = getSupportedMimeType();
assert('1. getSupportedMimeType returns audio/webm baseline in node environment', typeof mime === 'string' && mime.startsWith('audio/'));

const webSpeechCheck = isWebSpeechAvailable();
assert('2. isWebSpeechAvailable evaluates boolean cleanly without throwing', typeof webSpeechCheck === 'boolean');

// 2. Constants & Thresholds
assert('3. MAX_UTTERANCE_DURATION_MS is bounded to 60 seconds', MAX_UTTERANCE_DURATION_MS === 60000);
assert('4. MAX_UPLOAD_BYTES is 10MB', MAX_UPLOAD_BYTES === 10 * 1024 * 1024);

// 3. State Machine & Instantiation
const stateHistory = [];
const stt = new UnifiedSpeechRecognizer({
  onStateChange: (s) => stateHistory.push(s)
});

assert('5. Initial state is IDLE', stt.getState() === 'IDLE');

stt.stop();
assert('6. Calling stop() transitions state to STOPPED', stt.getState() === 'STOPPED');

// 4. Commit Boundary Deduplication Test
let finalTranscriptCount = 0;
let receivedTranscript = '';
let receivedSource = '';

const dedupSTT = new UnifiedSpeechRecognizer({
  onFinalTranscript: (text, source) => {
    finalTranscriptCount++;
    receivedTranscript = text;
    receivedSource = source;
  }
});

// Simulate private commit invocation
dedupSTT['commitUtterance']('My candidate interview answer on React hooks', 'WEB_SPEECH', 0);
assert('7. First commit successfully emits final transcript', finalTranscriptCount === 1 && receivedTranscript === 'My candidate interview answer on React hooks' && receivedSource === 'WEB_SPEECH');

// Simulate secondary fallback completion attempt with same utteranceId
dedupSTT['commitUtterance']('Duplicate answer from fallback', 'SERVER_FALLBACK', 0);
assert('8. Subsequent duplicate commit attempt is blocked by commit boundary', finalTranscriptCount === 1 && receivedTranscript === 'My candidate interview answer on React hooks');

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
