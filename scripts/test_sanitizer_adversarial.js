// Adversarial / Stress Test Suite for sanitizeLLM
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const sanitizeCode = fs.readFileSync(path.join(__dirname, '../src/lib/sanitizeLLM.ts'), 'utf8');
const compiled = ts.transpileModule(sanitizeCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});

const evalModule = { exports: {} };
const runner = new Function('module', 'exports', compiled.outputText);
runner(evalModule, evalModule.exports);

const {
  sanitizeLLMOutput,
  sanitizeForSpeech,
  getSanitizationMetadata,
  sanitizeEvaluationResult,
  StreamingTextSanitizer,
} = evalModule.exports;

let passed = 0;
let failed = 0;

function assertEqual(testName, actual, expected) {
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  if (isMatch) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    console.error(`   Expected:`, expected);
    console.error(`   Actual:  `, actual);
    failed++;
  }
}

console.log('🔬 Running Adversarial / Stress Test Suite for sanitizeLLM...\n');

// 1. Multilingual Support (Hindi, Japanese, Tamil, Cyrillic, Arabic)
assertEqual(
  'A1. Preserves Hindi / Devanagari text after thinking strip',
  sanitizeLLMOutput('<think>Hindi question...</think>नमस्ते! आप कैसे हैं?'),
  'नमस्ते! आप कैसे हैं?'
);

assertEqual(
  'A2. Preserves Japanese & Tamil text',
  sanitizeLLMOutput('<thought>multilingual</thought>こんにちは / வணக்கம்'),
  'こんにちは / வணக்கம்'
);

// 2. Normal HTML tags (must NOT be stripped by default in UI sanitizer)
assertEqual(
  'A3. Preserves legitimate HTML tags like <b> and <code> in UI text',
  sanitizeLLMOutput('Use <b>bold</b> and <code>var x</code> in code.'),
  'Use <b>bold</b> and <code>var x</code> in code.'
);

// 3. Null / Undefined / Non-string resilience
assertEqual('A4. Handles null gracefully', sanitizeLLMOutput(null), '');
assertEqual('A5. Handles undefined gracefully', sanitizeLLMOutput(undefined), '');
assertEqual('A6. Handles non-string gracefully', sanitizeLLMOutput(12345), '');

// 4. Heavy / Stress Payload Test (10,000 characters)
const largePadded = '<think>' + 'a'.repeat(5000) + '</think>' + 'Target answer. '.repeat(100);
const startBench = Date.now();
const sanitizedLarge = sanitizeLLMOutput(largePadded);
const benchDuration = Date.now() - startBench;
assertEqual('A7. Sanitizes 10KB payload in under 20ms', benchDuration < 20, true);
assertEqual('A8. Large payload answer preserved', sanitizedLarge.startsWith('Target answer.'), true);

// 5. 1-character token stream stress test
const singleCharStream = new StreamingTextSanitizer();
const chars = 'Hello! <think>reasoning step by step</think> Welcome to PinIT.';
let reconstructed = '';
for (let i = 0; i < chars.length; i++) {
  reconstructed += singleCharStream.processChunk(chars[i]);
}
reconstructed += singleCharStream.finalize();
assertEqual(
  'A9. Handles character-by-character token streaming perfectly',
  reconstructed.trim(),
  'Hello!  Welcome to PinIT.'
);

// 6. Speech normalizer adversarial tests
assertEqual(
  'A10. Speech normalizer cleans multiple emojis and nested markdown',
  sanitizeForSpeech('🚀 # Topic: **Important** [Click Here](https://pinit.in) - Point 1 • Point 2'),
  'Topic: Important Click Here , Point 1 , Point 2'
);

console.log(`\n========================================`);
console.log(`Adversarial Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
