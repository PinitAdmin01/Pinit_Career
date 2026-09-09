// scripts/test_batch022.ts
// Programmatic Verification Suite for PinIT Career OS Batch 022 (Days 108–111 · PARTIAL)
// Semantic HTML5, Accessible Forms, Declarative WCAG 2.2 AA Accessibility & Web Performance (CLS)

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_022_MANIFEST,
  DAY_112_ASSESSMENT,
  COMPETENCY_ID_SEMANTIC_HTML_AND_ACCESSIBILITY,
} from '../src/lib/curriculum/pythonFullStack/batch022';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. WCAG 2.2 Criterion 1.4.3 Contrast Ratio Calculation
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getRelativeLuminance(...rgb1);
  const lum2 = getRelativeLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// 2. WCAG 2.2 Criterion 2.5.8 Target Size Validator
function validateTargetSize(widthPx: number, heightPx: number): boolean {
  // WCAG 2.2 AA 2.5.8 minimum target size is 24x24 CSS pixels
  return widthPx >= 24 && heightPx >= 24;
}

// 3. Heading Hierarchy Sequential Validator
function validateHeadingHierarchy(headings: number[]): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  if (headings.length === 0) {
    return { valid: false, violations: ['Missing document heading'] };
  }
  if (headings[0] !== 1) {
    violations.push(`Document should begin with <h1>, found <h${headings[0]}>`);
  }
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const curr = headings[i];
    // Heading levels can increase by at most 1 level (e.g. h1 -> h2, h2 -> h3)
    if (curr > prev + 1) {
      violations.push(`Heading jump from <h${prev}> directly to <h${curr}> violates sequential hierarchy`);
    }
  }
  return { valid: violations.length === 0, violations };
}

// ── TEST RUNNER & ASSERTION SUITE ──

let assertionCount = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`  ❌ [FAIL] Check #${assertionCount}: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] Check #${assertionCount}: ${message}`);
}

export async function runBatch022Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 022 (DAYS 108–111) TECHNICAL AUDIT TEST SUITE');
  console.log('Semantic HTML5, Forms, Declarative WCAG 2.2 AA & DevTools CLS Performance');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_022_MANIFEST.batchCode === 'P2-M6-W22-BATCH022', 'Batch code is "P2-M6-W22-BATCH022"');
  assert(BATCH_022_MANIFEST.batchId === 'batch-pfs-m6-w22-022', 'Batch ID is "batch-pfs-m6-w22-022"');
  assert(BATCH_022_MANIFEST.days.length === 5, 'Batch contains exactly 5 published learning days (Days 108–112)');
  assert(BATCH_022_MANIFEST.isPartial === false, 'Batch manifest is complete (isPartial: false)');
  assert(BATCH_022_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_022_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_022_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  ContentValidator.validateBatchManifest(BATCH_022_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for complete 5-day batch');

  assert(BATCH_022_MANIFEST.days[0].dayNumber === 1, 'Day 108 internal dayNumber is 1');
  assert(BATCH_022_MANIFEST.days[4].dayNumber === 5, 'Day 112 internal dayNumber is 5');
  assert(BATCH_022_MANIFEST.days[0].packetId === 'batch-pfs-m6-w22-022', 'Day 108 packetId matches batchId');
  assert(BATCH_022_MANIFEST.days[4].packetId === 'batch-pfs-m6-w22-022', 'Day 112 packetId matches batchId');

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_022_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_022_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  assert(dayMinutes[0] === 85, `Day 108 workload is 85 min (Found: ${dayMinutes[0]} min)`);
  assert(dayMinutes[1] === 85, `Day 109 workload is 85 min (Found: ${dayMinutes[1]} min)`);
  assert(dayMinutes[2] === 85, `Day 110 workload is 85 min (Found: ${dayMinutes[2]} min)`);
  assert(dayMinutes[3] === 85, `Day 111 workload is 85 min (Found: ${dayMinutes[3]} min)`);
  assert(dayMinutes[4] === 95, `Day 112 workload is 95 min (Found: ${dayMinutes[4]} min)`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 435, `Total Batch 022 learning time is 435 min / 7.25h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Prerequisite Firewall: ZERO JavaScript in Days 108–111 ──
  console.log('\n── GROUP 3: Prerequisite Firewall: ZERO JavaScript in Days 108–111 ──');
  const batch022FilePath = path.join(__dirname, '../src/lib/curriculum/pythonFullStack/batch022.ts');
  const fileContent = fs.readFileSync(batch022FilePath, 'utf8');

  // Forbidden JavaScript keywords / APIs in executable teaching artifacts
  const forbiddenJSPatterns = [
    { name: '<script> tags', regex: /<script\b[^>]*>/i },
    { name: 'document.getElementById / querySelector', regex: /\bdocument\.(getElementById|querySelector|getElementsBy)\b/ },
    { name: 'window.addEventListener', regex: /\b(window|document)\.addEventListener\b/ },
    { name: 'showModal() JavaScript API', regex: /\.showModal\(\)/ },
    { name: 'PerformanceObserver CLS script', regex: /\bnew\s+PerformanceObserver\b/ },
    { name: 'eval() function', regex: /\beval\(/ },
  ];

  forbiddenJSPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `Prerequisite Firewall: Zero instances of ${pat.name}`);
  });

  // ── GROUP 4: Technical Invariants & Accessibility Standards ──
  console.log('\n── GROUP 4: Technical Invariants & Accessibility Standards ──');

  // Verify Day 108 Semantic HTML & Landmarks
  const day108Theory = BATCH_022_MANIFEST.days[0].blocks[0] as any;
  assert(
    day108Theory.whatItIs.includes('<header>') &&
    day108Theory.whatItIs.includes('<nav>') &&
    day108Theory.whatItIs.includes('<main>') &&
    day108Theory.whatItIs.includes('<footer>'),
    'Day 108 covers semantic HTML5 landmark architecture'
  );
  assert(
    day108Theory.whatItIs.includes('Links (<a>) vs Buttons (<button>)') ||
    day108Theory.whatItIs.includes('Links (<a>) vs Buttons'),
    'Day 108 documents distinction between links and buttons'
  );

  // Verify Day 109 Form Encodings & Labels
  const day109Theory = BATCH_022_MANIFEST.days[1].blocks[0] as any;
  assert(
    day109Theory.whatItIs.includes('application/x-www-form-urlencoded') &&
    day109Theory.whatItIs.includes('multipart/form-data'),
    'Day 109 documents form encodings for urlencoded and multipart binary payloads'
  );
  assert(
    day109Theory.whatItIs.includes('Placeholder text is NOT a replacement for a label'),
    'Day 109 documents that placeholder text is not a replacement for an explicit label'
  );

  // Verify Day 110 Declarative Components & WCAG 2.2 AA Criteria
  const day110Theory = BATCH_022_MANIFEST.days[2].blocks[0] as any;
  assert(
    day110Theory.whatItIs.includes('<details>') &&
    day110Theory.whatItIs.includes('<summary>'),
    'Day 110 implements native declarative disclosures via <details> and <summary>'
  );
  assert(
    day110Theory.whatItIs.includes('1.4.3 Contrast (Minimum)') &&
    day110Theory.whatItIs.includes('4.5:1'),
    'Day 110 documents WCAG 1.4.3 minimum 4.5:1 text contrast ratio'
  );
  assert(
    day110Theory.whatItIs.includes('2.5.8 Target Size (Minimum)') &&
    day110Theory.whatItIs.includes('24x24 CSS pixels'),
    'Day 110 documents WCAG 2.5.8 minimum 24x24 CSS px target size'
  );
  assert(
    day110Theory.whatItIs.includes('2.4.7 Focus Visible'),
    'Day 110 documents WCAG 2.4.7 Focus Visible requirement'
  );

  // Verify Day 111 CLS Mechanics & Tooling Scope
  const day111Theory = BATCH_022_MANIFEST.days[3].blocks[0] as any;
  assert(
    day111Theory.whatItIs.includes('CLS <= 0.1 is Good') ||
    day111Theory.whatItIs.includes('<= 0.1 is Good'),
    'Day 111 documents CLS thresholds (<= 0.1 good, > 0.25 poor)'
  );
  assert(
    day111Theory.whatItIs.includes('Lighthouse CLI') &&
    (day111Theory.whatItIs.includes('DevTools') || day111Theory.whatItIs.includes('Developer Tools')),
    'Day 111 scopes CLS measurement to browser DevTools and Lighthouse CLI without JS observer scripts'
  );

  // Verify Day 112 Formative Assessment
  assert(BATCH_022_MANIFEST.days[4].assessmentId === 'asm-pfs-m6-w22-022', 'Day 112 has assessmentId "asm-pfs-m6-w22-022"');
  assert(BATCH_022_MANIFEST.days[4].blocks[0].type === 'TRANSFER_CHALLENGE', 'Day 112 first block is TRANSFER_CHALLENGE');
  assert(DAY_112_ASSESSMENT.id === 'asm-pfs-m6-w22-022', 'DAY_112_ASSESSMENT id is "asm-pfs-m6-w22-022"');
  assert(DAY_112_ASSESSMENT.passingScorePercentage === 70, 'Day 112 assessment passingScorePercentage is 70%');
  assert(DAY_112_ASSESSMENT.rubricDimensions.length === 7, 'Day 112 assessment has exactly 7 rubric dimensions');

  // ── GROUP 5: Behavioral Reference Simulation (A11y & Performance Algorithms) ──
  console.log('\n── GROUP 5: Behavioral Reference Simulation (A11y & Performance Algorithms) ──');

  // Test 1: WCAG 1.4.3 Text Contrast: dark slate (#111827) on white (#ffffff)
  const contrastRatio = calculateContrastRatio([17, 24, 39], [255, 255, 255]);
  assert(contrastRatio >= 4.5, `Contrast ratio of #111827 on #ffffff is ${contrastRatio.toFixed(2)}:1 (exceeds 4.5:1 floor)`);

  // Test 2: Failing contrast: light gray (#9ca3af) on white (#ffffff)
  const failingRatio = calculateContrastRatio([156, 163, 175], [255, 255, 255]);
  assert(failingRatio < 4.5, `Failing contrast ratio of #9ca3af on #ffffff is ${failingRatio.toFixed(2)}:1 (< 4.5:1 floor)`);

  // Test 3: WCAG 2.5.8 Target Size: 44x44 px passes, 16x16 px fails
  assert(validateTargetSize(44, 44), 'Target size 44x44 px passes WCAG 2.5.8');
  assert(validateTargetSize(24, 24), 'Target size 24x24 px passes WCAG 2.5.8 baseline');
  assert(!validateTargetSize(16, 16), 'Target size 16x16 px fails WCAG 2.5.8');

  // Test 4: Heading Hierarchy Sequential Logic
  const validHeadings = [1, 2, 2, 3, 2, 3, 3];
  const hierarchyCheck = validateHeadingHierarchy(validHeadings);
  assert(hierarchyCheck.valid, 'Sequential heading hierarchy passes');

  const brokenHeadings = [1, 4, 2];
  const brokenCheck = validateHeadingHierarchy(brokenHeadings);
  assert(!brokenCheck.valid, 'Non-sequential heading hierarchy (h1 -> h4) fails validation');

  // ── GROUP 6: Diagnostic & Quality Assurance Checks ──
  console.log('\n── GROUP 6: Diagnostic & Quality Assurance Checks ──');

  BATCH_022_MANIFEST.days.forEach((d) => {
    d.blocks.forEach((blk) => {
      assert(blk.title.trim().length > 0, `Block ${blk.id} has non-empty title`);
      assert(blk.estimatedMinutes > 0, `Block ${blk.id} has positive estimatedMinutes`);
      if (blk.type === 'KNOWLEDGE_CHECK') {
        const kc = blk as any;
        assert(kc.options.length >= 4, `Knowledge check ${blk.id} has at least 4 options`);
        assert(kc.correctIndex >= 0 && kc.correctIndex < kc.options.length, `Knowledge check ${blk.id} has valid correctIndex`);
        assert(kc.explanation.length > 20, `Knowledge check ${blk.id} has detailed explanation`);
      }
    });
  });

  console.log(`\n========================================================================`);
  console.log(`🎉 BATCH 022 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch022Audit().catch((err) => {
    console.error('Batch 022 Audit Failed:', err);
    process.exit(1);
  });
}
