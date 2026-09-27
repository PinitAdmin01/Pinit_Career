import {
  sanitizeLLMOutput,
  sanitizeForSpeech,
  getSanitizationMetadata,
  sanitizeEvaluationResult,
  StreamingTextSanitizer,
} from '../src/lib/sanitizeLLM';

let passed = 0;
let failed = 0;

function assertEqual(testName: string, actual: any, expected: any) {
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

console.log('🧪 Running PinIT Centralized LLM Sanitizer Test Suite (P0-1)...\n');

// 1. Paired explicit reasoning tags
assertEqual(
  '1. Strips <think> tags cleanly',
  sanitizeLLMOutput('<think>Evaluating candidate response on React...</think>Hello! Can you explain useEffect?'),
  'Hello! Can you explain useEffect?'
);

assertEqual(
  '2. Strips <reasoning> tags cleanly',
  sanitizeLLMOutput('<reasoning>Let us check their SQL background.</reasoning>Tell me about SQL indexes.'),
  'Tell me about SQL indexes.'
);

assertEqual(
  '3. Strips <thought> tags cleanly',
  sanitizeLLMOutput('<thought>This is an intern so keep it simple.</thought>What is a loop in Python?'),
  'What is a loop in Python?'
);

// 2. Unclosed opening tags (fail closed)
assertEqual(
  '4. Unclosed <think> tag fails closed',
  sanitizeLLMOutput('<think>This thinking stream was abruptly cut off without a close'),
  ''
);

// 3. Stray closing tag does not delete preceding text
assertEqual(
  '5. Stray closing tag preserves text before and after',
  sanitizeLLMOutput('Here is valid text </think> and more valid text'),
  'Here is valid text   and more valid text'
);

// 4. Structured JSON contract parsing
assertEqual(
  '6. Extracts reply from JSON markdown fence',
  sanitizeLLMOutput('```json\n{"reply": "Welcome to your interview round!"}\n```'),
  'Welcome to your interview round!'
);

assertEqual(
  '7. Extracts reply from raw JSON object',
  sanitizeLLMOutput('{"reply": "Explain microservices architecture."}'),
  'Explain microservices architecture.'
);

// 5. Speech Audio Normalization
assertEqual(
  '8. sanitizeForSpeech removes code blocks and markdown',
  sanitizeForSpeech('Here is code: ```js\nconst x = 10;\n``` and `inlineCode()` with **bold** text and [link](https://pinit.in) 🚀'),
  'Here is code: [Code example omitted] and inlineCode() with bold text and link'
);

assertEqual(
  '9. sanitizeForSpeech strips teacher role prefix',
  sanitizeForSpeech('Ms. Priya: Welcome to your diagnostic assessment!'),
  'Welcome to your diagnostic assessment!'
);

// 6. Zero-retention metadata
const meta = getSanitizationMetadata('<think>Some secret thoughts</think>Public question?');
assertEqual('10. Metadata tracks tag presence without saving thoughts', meta.hadReasoningTags, true);
assertEqual('11. Metadata tracks tag type', meta.tagTypesFound, ['think']);
assertEqual('12. Metadata records removed characters', meta.removedCharacters > 0, true);

// 7. Structured evaluation object sanitizer
const rawEval = {
  overall_score: 85,
  confidence_score: 80,
  summary: '<think>Candidate was good</think>Strong grasp of system design.',
  strengths: ['<thought>Good comms</thought>Clear articulation', 'Solid knowledge'],
  weaknesses: ['Needs more STAR metrics'],
};
const cleanedEval = sanitizeEvaluationResult(rawEval);
assertEqual('13. Evaluation numeric score preserved', cleanedEval.overall_score, 85);
assertEqual('14. Evaluation summary sanitized', cleanedEval.summary, 'Strong grasp of system design.');
assertEqual('15. Evaluation strengths sanitized', cleanedEval.strengths[0], 'Clear articulation');

// 8. Streaming State Machine Test
const stream = new StreamingTextSanitizer();
let streamedResult = '';

// Chunk 1: Starts a think tag
streamedResult += stream.processChunk('Hello! <thi');
// Chunk 2: Finishes think opening and gives reasoning
streamedResult += stream.processChunk('nk>I need to check candidate algorithms.</thi');
// Chunk 3: Closes think tag and emits spoken response
streamedResult += stream.processChunk('nk> How does quicksort work?');
streamedResult += stream.finalize();

assertEqual(
  '16. StreamingTextSanitizer properly handles tags split across chunks',
  streamedResult.trim(),
  'Hello!  How does quicksort work?'
);

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
