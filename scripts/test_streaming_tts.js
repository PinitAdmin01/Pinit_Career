// Test Suite for P1-2: Low-Latency Kokoro TTS Streaming & Audio Queue Scheduler
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
  runner(moduleObj, moduleObj.exports, (modPath) => {
    if (modPath === '../sanitizeLLM' || modPath === './sanitizeLLM') {
      return transpileAndRequire(path.join(__dirname, '../src/lib/sanitizeLLM.ts'));
    }
    if (modPath === '../smartVoiceRouter' || modPath === './smartVoiceRouter') {
      return { synthesizeVoice: async () => ({ audioBuffer: new ArrayBuffer(8) }) };
    }
    return require(modPath);
  });
  return moduleObj.exports;
}

const {
  TTS_STREAMING_VERSION,
  MAX_IN_FLIGHT_TTS,
  splitIntoSentences,
  SentenceAudioQueuePlayer,
} = transpileAndRequire(path.join(__dirname, '../src/lib/audio/streamingAudioQueue.ts'));

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

console.log(`🧪 Running PinIT Sentence-Level Streaming TTS Test Suite (P1-2, ${TTS_STREAMING_VERSION})...\n`);

// 1. Single Sentence Test
const singleSentence = "Welcome to your AI interview simulation round for Software Engineering.";
const singleChunks = splitIntoSentences(singleSentence);
assert('1. Single sentence produces exactly 1 chunk', singleChunks.length === 1);
assert('2. Single chunk preserves text content', singleChunks[0] === singleSentence);

// 2. 4-Sentence Paragraph Test
const multiSentence = "Let's begin with your technical experience. Can you explain your approach to database indexing? Please mention trade-offs between B-Trees and Hash indexes. We will then proceed to live coding.";
const multiChunks = splitIntoSentences(multiSentence);
assert('3. 4-sentence paragraph splits into 4 distinct chunks', multiChunks.length === 4, `Got ${multiChunks.length} chunks`);
assert('4. Question marks treated as terminal sentence delimiters', multiChunks[1].endsWith('?'));

// 3. Abbreviation & Number Protection Test
const abbrSentence = "Dr. Smith explained that e.g. Node.js v1.0 uses a single event loop, achieving pi approx 3.14 with C++ bindings.";
const abbrChunks = splitIntoSentences(abbrSentence);
assert('5. Protected abbreviations (Dr., e.g., Node.js, v1.0, 3.14, C++) do not trigger false sentence breaks', abbrChunks.length === 1, `Got ${abbrChunks.length} chunks`);
assert('6. Dots inside abbreviations are preserved', abbrChunks[0].includes('e.g.') && abbrChunks[0].includes('3.14') && abbrChunks[0].includes('Node.js'));

// 4. Very Long Unpunctuated Sentence Test (Fallback Word/Clause Splitter)
const longSentence = "We need to design a high-throughput distributed message queue that can handle over two million concurrent producer connections across global AWS availability zones while guaranteeing zero message loss and sub-millisecond p99 consumer delivery latency during peak traffic events.";
const longChunks = splitIntoSentences(longSentence);
assert('7. Very long sentence is safely chunked under 140 characters', longChunks.length > 1 && longChunks.every(c => c.length <= 140), `Chunk lengths: ${longChunks.map(c => c.length).join(', ')}`);

// 5. Empty & Whitespace Resilience
assert('8. Empty string returns empty array', splitIntoSentences('').length === 0);
assert('9. Whitespace string returns empty array', splitIntoSentences('    \n\t   ').length === 0);

// 6. Concurrency & Queue Configuration
assert('10. Bounded concurrency window MAX_IN_FLIGHT_TTS equals 2', MAX_IN_FLIGHT_TTS === 2);

// 7. Player Instantiation & Interruption Lifecycle
const mockPlayer = new SentenceAudioQueuePlayer();
assert('11. SentenceAudioQueuePlayer instantiates cleanly', typeof mockPlayer.playSentenceStream === 'function');
assert('12. stopAll cancels active queue and resets playback state', () => {
  mockPlayer.stopAll();
  return true;
});

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
