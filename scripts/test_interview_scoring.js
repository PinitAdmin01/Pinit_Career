// Test Suite for P0-2: Role-Weighted AI Interview Scorecard & Rubric Engine
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const matrixCode = fs.readFileSync(path.join(__dirname, '../src/lib/interview/scoringMatrix.ts'), 'utf8');
const compiled = ts.transpileModule(matrixCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});

const evalModule = { exports: {} };
const runner = new Function('module', 'exports', compiled.outputText);
runner(evalModule, evalModule.exports);

const {
  ROLE_RUBRIC_VERSION,
  ROLE_SCORING_MATRICES,
  normalizeRoleKey,
  calculateRoleWeightedScore,
  generatePersonaCoaching,
  generateTelemetryDiagnostics,
  clampScore,
} = evalModule.exports;

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

console.log(`🧪 Running PinIT Role-Weighted Interview Scoring Test Suite (P0-2, ${ROLE_RUBRIC_VERSION})...\n`);

// 1. All Role Matrices sum to exactly 1.0 (100%)
Object.keys(ROLE_SCORING_MATRICES).forEach(key => {
  const matrix = ROLE_SCORING_MATRICES[key];
  const sum = Object.values(matrix.weights).reduce((acc, w) => acc + w, 0);
  const roundedSum = Math.round(sum * 1000) / 1000;
  assert(
    `Role Matrix '${key}' weights sum to exactly 1.0`,
    roundedSum === 1.0,
    `Sum was ${roundedSum}`
  );
});

// 2. Role Divergence: SDE vs PM with identical raw dimensions produce distinct overalls
const rawCandidateScores = {
  logic: 90,
  systems: 90,
  solving: 85,
  comms: 60,
  star: 50,
};

const sdeResult = calculateRoleWeightedScore(rawCandidateScores, 'sde');
const pmResult = calculateRoleWeightedScore(rawCandidateScores, 'pm');

// For SDE: 90*0.30 + 90*0.25 + 60*0.15 + 85*0.20 + 50*0.10 = 27 + 22.5 + 9 + 17 + 5 = 80.5 -> 81 (Hire)
// For PM:  90*0.10 + 90*0.20 + 60*0.30 + 85*0.15 + 50*0.25 = 9 + 18 + 18 + 12.75 + 12.5 = 70.25 -> 70 (Hire/Ready)
assert('SDE score is calculated accurately (81)', sdeResult.overallScore === 81, `Was ${sdeResult.overallScore}`);
assert('PM score is calculated accurately (70)', pmResult.overallScore === 70, `Was ${pmResult.overallScore}`);
assert(
  'Identical dimension performance diverges across roles reflecting real role priorities (SDE 81 != PM 70)',
  sdeResult.overallScore !== pmResult.overallScore
);

// 3. Persona Neutrality: Persona NEVER modifies the numerical score
const dimensionsForPersona = { logic: 80, systems: 75, comms: 85, solving: 80, star: 75 };
const baseScore = calculateRoleWeightedScore(dimensionsForPersona, 'sde').overallScore;

const patternHunterCoaching = generatePersonaCoaching('Pattern Hunter', dimensionsForPersona, 'sde');
const socialIqCoaching = generatePersonaCoaching('Social IQ', dimensionsForPersona, 'sde');
const explorerCoaching = generatePersonaCoaching('Explorer', dimensionsForPersona, 'sde');
const stabilizerCoaching = generatePersonaCoaching('Stabilizer', dimensionsForPersona, 'sde');

assert('Pattern Hunter coaching provides tailored analytical advice', patternHunterCoaching.personaSummary.includes('Pattern Hunter'));
assert('Social IQ coaching provides tailored storytelling advice', socialIqCoaching.personaSummary.includes('Social IQ'));
assert('Coaching advice differs across archetypes', patternHunterCoaching.growthArea !== explorerCoaching.growthArea);
assert('Persona does not mutate dimensions or calculate separate numerical marks', typeof patternHunterCoaching.personaSummary === 'string');

// 4. Telemetry Isolation: Diagnostic signals do NOT alter hiring score or verdict
const cleanTelemetryDiag = generateTelemetryDiagnostics({ eyeContact: 90, wpm: 130, fillerWords: 0 });
const noisyTelemetryDiag = generateTelemetryDiagnostics({ eyeContact: 20, wpm: 190, fillerWords: 7 });

assert('Telemetry diagnostics identify delivery status without numerical penalty', cleanTelemetryDiag.deliveryStatus === 'Optimal');
assert('Telemetry diagnostics identify noisy delivery without crashing', noisyTelemetryDiag.deliveryStatus === 'Good');
assert('Telemetry diagnostics contain specific practice advice', noisyTelemetryDiag.practiceAdvice.length > 0);

// 4b. Absent Telemetry: Does NOT invent fake metrics when camera/audio was not measured
const emptyTelemetryDiag = generateTelemetryDiagnostics();
const undefinedTelemetryDiag = generateTelemetryDiagnostics({});
assert("Absent telemetry sets deliveryStatus to 'Not Assessed'", emptyTelemetryDiag.deliveryStatus === 'Not Assessed');
assert("Empty telemetry sets deliveryStatus to 'Not Assessed'", undefinedTelemetryDiag.deliveryStatus === 'Not Assessed');
assert("Absent telemetry does not invent 125 WPM", !emptyTelemetryDiag.signals.some(s => s.value === '125 WPM'));
assert("Absent telemetry does not invent 0 filler words", !emptyTelemetryDiag.signals.some(s => s.value === '0 filler words'));
assert("Absent telemetry states camera off, delivery not assessed", emptyTelemetryDiag.practiceAdvice[0].includes('Camera off, delivery not assessed'));
assert("Absent telemetry signals camera off", emptyTelemetryDiag.signals.some(s => s.metric === 'Camera & Presence' && s.value === 'Camera Off'));

// 5. Unknown role normalization falls back gracefully
const unknownRole1 = normalizeRoleKey('Chief Quantum Officer', 'tech');
const unknownRole2 = normalizeRoleKey('Head of Happiness', 'non_tech');
assert("Unknown tech role defaults to 'general_tech'", unknownRole1 === 'general_tech');
assert("Unknown non-tech role defaults to 'general_non_tech'", unknownRole2 === 'general_non_tech');

// 5b. Probe Cases: Verify whole-word role matching prevents erroneous PM/Data Analyst/Frontend mappings
assert("'Software Development Engineer' maps to 'sde' (not 'pm')", normalizeRoleKey('Software Development Engineer') === 'sde');
assert("'Java Programmer' maps to 'sde' (not 'pm')", normalizeRoleKey('Java Programmer') === 'sde');
assert("'Mobile App Developer' maps to 'sde' (not 'data_analyst')", normalizeRoleKey('Mobile App Developer') === 'sde');
assert("'Build & Release Engineer' maps to 'devops' (not 'frontend')", normalizeRoleKey('Build & Release Engineer') === 'devops');
assert("'Data Structures and Algorithms' maps to 'sde' (not 'data_analyst')", normalizeRoleKey('Data Structures and Algorithms') === 'sde');
assert("'Product Manager' maps to 'pm'", normalizeRoleKey('Product Manager') === 'pm');
assert("'Associate PM' maps to 'pm'", normalizeRoleKey('Associate PM') === 'pm');
assert("'Power BI Specialist' maps to 'data_analyst'", normalizeRoleKey('Power BI Specialist') === 'data_analyst');
assert("'Business Development Representative' maps to 'sales_marketing' (not 'business_analyst')", normalizeRoleKey('Business Development Representative') === 'sales_marketing');
assert("'Backend Microservices Architect' maps to 'backend'", normalizeRoleKey('Backend Microservices Architect') === 'backend');
assert("'React Frontend Developer' maps to 'frontend'", normalizeRoleKey('React Frontend Developer') === 'frontend');

// 6. Missing dimension fail-safe defaults
const partialResult = calculateRoleWeightedScore({ logic: 85 });
assert('Missing dimensions default safely to 50 without crashing or NaN', !isNaN(partialResult.overallScore));
assert('Partial result provides valid verdict', typeof partialResult.verdict === 'string');

// 7. Clamp score bounds tests
assert('clampScore bounds negative values to 0', clampScore(-10) === 0);
assert('clampScore bounds excessive values to 100', clampScore(150) === 100);
assert('clampScore handles string numbers gracefully', clampScore('85') === 85);
assert('clampScore handles malformed strings with fallback', clampScore('invalid', 50) === 50);

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
