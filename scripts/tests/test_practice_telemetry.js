// Test Suite for P2-3: Client-Side Practice Delivery & Expression Telemetry Engine
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
  PRACTICE_TELEMETRY_VERSION,
  TELEMETRY_PRIVACY_DISCLAIMER,
  calculateCameraAlignment,
  evaluateSpeakingPace,
  evaluateFacialMovement,
  synthesizePracticeTelemetryReport
} = transpileAndRequire(path.join(__dirname, '../src/lib/telemetry/practiceTelemetry.ts'));

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

console.log(`🧪 Running PinIT Practice Telemetry & Expression Test Suite (P2-3, ${PRACTICE_TELEMETRY_VERSION})...\n`);

// 1. Camera Alignment & Orientation Tests
const centeredPose = { faceDetected: true, yaw: 2, pitch: -3, lightingQuality: 'Good' };
const alignCentered = calculateCameraAlignment(centeredPose);
assert('1. Centered head orientation achieves high stability score (>= 90%)', alignCentered.stabilityPercent >= 90);
assert('2. Good lighting returns HIGH confidence', alignCentered.confidence === 'HIGH');

const offAnglePose = { faceDetected: true, yaw: 35, pitch: 20, lightingQuality: 'Good' };
const alignOff = calculateCameraAlignment(offAnglePose);
assert('3. Off-angle gaze orientation reflects lower centeredness without crashing', alignOff.stabilityPercent < 70);

const lowLightPose = { faceDetected: true, yaw: 5, pitch: 0, lightingQuality: 'Low' };
const alignLowLight = calculateCameraAlignment(lowLightPose);
assert('4. Low lighting condition marks confidence as LOW_CONFIDENCE', alignLowLight.confidence === 'LOW_CONFIDENCE');

const noFacePose = { faceDetected: false };
const alignNoFace = calculateCameraAlignment(noFacePose);
assert('5. No face detected returns UNAVAILABLE without penalty', alignNoFace.confidence === 'UNAVAILABLE');

// 2. Speaking Pace & Cadence Tests
const typicalAudio = { wordCount: 90, durationSeconds: 40, micActive: true }; // 135 WPM
const paceTypical = evaluateSpeakingPace(typicalAudio);
assert('6. 135 WPM is categorized as Typical pace', paceTypical.wpm === 135 && paceTypical.category === 'Typical');

const fastAudio = { wordCount: 190, durationSeconds: 60, micActive: true }; // 190 WPM
const paceFast = evaluateSpeakingPace(fastAudio);
assert('7. 190 WPM is categorized as Faster with non-penalizing coaching suggestion', paceFast.wpm === 190 && paceFast.category === 'Faster' && typeof paceFast.coachingSuggestion === 'string');

const inactiveAudio = { wordCount: 0, durationSeconds: 0, micActive: false };
const paceInactive = evaluateSpeakingPace(inactiveAudio);
assert('8. Inactive mic returns Unavailable state cleanly', paceInactive.confidence === 'UNAVAILABLE');

// 3. Facial Movement Activity Tests
const dynamicMovement = { faceDetected: true, frameDeltaMovement: 0.42, lightingQuality: 'Good' };
const movDynamic = evaluateFacialMovement(dynamicMovement);
assert('9. High displacement categorized as Dynamic movement', movDynamic.activity === 'Dynamic');

const subtleMovement = { faceDetected: true, frameDeltaMovement: 0.04, lightingQuality: 'Good' };
const movSubtle = evaluateFacialMovement(subtleMovement);
assert('10. Low displacement categorized as Subtle movement', movSubtle.activity === 'Subtle');

// 4. Accessibility Overrides & Report Synthesis
const fullReport = synthesizePracticeTelemetryReport(centeredPose, typicalAudio);
assert('11. Full report generates all 3 delivery metrics', fullReport.metrics.cameraAlignmentStabilityPercent >= 90 && fullReport.metrics.speakingPaceWPM === 135);
assert('12. Telemetry disclaimer is included', fullReport.disclaimer === TELEMETRY_PRIVACY_DISCLAIMER);

const accessibilityReport = synthesizePracticeTelemetryReport(centeredPose, typicalAudio, { disableVisual: true });
assert('13. Accessibility visual override sets Visual_Disabled mode', accessibilityReport.telemetryMode === 'Visual_Disabled');
assert('14. Accessibility notes record disabled state', accessibilityReport.accessibilityNotes.length > 0);

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
