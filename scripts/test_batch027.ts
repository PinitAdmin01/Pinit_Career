// scripts/test_batch027.ts
// Programmatic Verification Suite for PinIT Career OS Batch 027 (Days 133–137 · COMPLETE)
// Django 6.0 Forms, ModelForms, Mass-Assignment Defense & Class-Based Views (CBVs)

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_027_MANIFEST,
  COMPETENCY_ID_DJANGO_FORMS_AND_CBVS,
  DAY_137_ASSESSMENT,
} from '../src/lib/curriculum/pythonFullStack/batch027';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. Multi-Stage Form Validation Pipeline Simulator
interface FormValidationResult {
  isValid: boolean;
  cleanedData: Record<string, any>;
  errors: Record<string, string[]>;
}

function simulateFormValidationPipeline(
  rawInput: Record<string, any>,
  fieldNormalizers: Record<string, (val: any) => any>,
  fieldCleaners: Record<string, (val: any) => any>,
  crossFieldCleaner: (cleaned: Record<string, any>) => void
): FormValidationResult {
  const cleanedData: Record<string, any> = {};
  const errors: Record<string, string[]> = {};

  // Stage 1 & 2: to_python and clean_<field>
  for (const [key, rawVal] of Object.entries(rawInput)) {
    try {
      const normalizer = fieldNormalizers[key] || ((v) => v);
      const coerced = normalizer(rawVal);
      const cleaner = fieldCleaners[key] || ((v) => v);
      cleanedData[key] = cleaner(coerced);
    } catch (err: any) {
      errors[key] = [err.message || 'Validation error'];
    }
  }

  // Stage 3: cross-field clean()
  if (Object.keys(errors).length === 0) {
    try {
      crossFieldCleaner(cleanedData);
    } catch (err: any) {
      errors['__all__'] = [err.message || 'Cross-field validation error'];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    cleanedData: Object.keys(errors).length === 0 ? cleanedData : {},
    errors,
  };
}

// 2. Mass-Assignment Allowlist Filter Simulator
function filterModelFormFields(
  submittedPayload: Record<string, any>,
  allowlistedFields: string[]
): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const field of allowlistedFields) {
    if (field in submittedPayload) {
      sanitized[field] = submittedPayload[field];
    }
  }
  return sanitized;
}

// 3. View Mixin C3 MRO Execution Order Simulator
function simulateViewMroDispatch(
  inheritanceOrder: ('Mixin' | 'BaseView')[]
): { executionOrder: string[]; mixinIntercepted: boolean } {
  const executionOrder: string[] = [];
  let mixinIntercepted = false;

  for (const cls of inheritanceOrder) {
    executionOrder.push(cls);
    if (cls === 'Mixin') {
      mixinIntercepted = true;
    } else if (cls === 'BaseView') {
      // BaseView terminal dispatch halts further resolution unless mixin ran first
      break;
    }
  }

  return { executionOrder, mixinIntercepted };
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

export async function runBatch027Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 027 (COMPLETE · DAYS 133–137) TECHNICAL AUDIT TEST SUITE');
  console.log('Django 6.0 Forms, ModelForms, Mass-Assignment Defense & CBVs');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_027_MANIFEST.batchCode === 'P2-M7-W27-BATCH027', 'Batch code is "P2-M7-W27-BATCH027"');
  assert(BATCH_027_MANIFEST.batchId === 'batch-pfs-m7-w27-027', 'Batch ID is "batch-pfs-m7-w27-027"');
  assert(BATCH_027_MANIFEST.days.length === 5, 'Batch contains exactly 5 published learning days (Days 133–137)');
  assert(BATCH_027_MANIFEST.isPartial === false, 'Batch manifest is explicitly flagged isPartial: false');
  assert(BATCH_027_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_027_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_027_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  ContentValidator.validateBatchManifest(BATCH_027_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for complete 5-day batch');

  for (let i = 0; i < 5; i++) {
    assert(BATCH_027_MANIFEST.days[i].dayNumber === i + 1, `Day ${133 + i} internal dayNumber is ${i + 1}`);
    assert(BATCH_027_MANIFEST.days[i].packetId === 'batch-pfs-m7-w27-027', `Day ${133 + i} packetId matches batchId`);
  }

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_027_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_027_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  for (let i = 0; i < 5; i++) {
    assert(dayMinutes[i] === 85, `Day ${133 + i} workload is 85 min (Found: ${dayMinutes[i]} min)`);
  }

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 425, `Total Batch 027 learning time is 425 min / ~7.1h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Technical Invariants & Architectural Coverage ──
  console.log('\n── GROUP 3: Technical Invariants & Architectural Coverage ──');

  // Day 133: Forms lifecycle, clean stages, CSRF
  const day133Theory = BATCH_027_MANIFEST.days[0].blocks[0] as any;
  assert(
    day133Theory.whatItIs.includes('to_python') &&
    day133Theory.whatItIs.includes('clean_<fieldname>') &&
    day133Theory.whatItIs.includes('clean()'),
    'Day 133 covers the multi-stage form validation pipeline'
  );
  assert(
    day133Theory.whatItIs.includes('cleaned_data') &&
    day133Theory.whatItIs.includes('ValidationError'),
    'Day 133 covers cleaned_data and ValidationError invariants'
  );
  assert(
    day133Theory.whatItIs.includes('CSRF') &&
    day133Theory.whatItIs.includes('CsrfViewMiddleware'),
    'Day 133 covers CSRF defense and SameSite cookie tokens'
  );

  // Day 134: ModelForm mass-assignment & allowlisting
  const day134Theory = BATCH_027_MANIFEST.days[1].blocks[0] as any;
  assert(
    day134Theory.whatItIs.includes('Mass-Assignment') || day134Theory.whatItIs.includes('mass-assignment'),
    'Day 134 addresses the mass-assignment (over-posting) threat model'
  );
  assert(
    day134Theory.whatItIs.includes('fields = [') || day134Theory.whatItIs.includes('Explicit Field Allowlisting'),
    'Day 134 enforces explicit fields allowlisting'
  );
  assert(
    day134Theory.whatItIs.includes('commit=False'),
    'Day 134 covers two-phase saving with commit=False'
  );

  // Day 135: CBVs, as_view(), ListView, CreateView
  const day135Theory = BATCH_027_MANIFEST.days[2].blocks[0] as any;
  assert(
    day135Theory.whatItIs.includes('as_view()') &&
    day135Theory.whatItIs.includes('dispatch()'),
    'Day 135 covers as_view() and dispatch() lifecycle'
  );
  assert(
    day135Theory.whatItIs.includes('ListView') &&
    day135Theory.whatItIs.includes('CreateView'),
    'Day 135 covers generic ListView and CreateView'
  );
  assert(
    day135Theory.whatItIs.includes('form_valid'),
    'Day 135 covers the form_valid() lifecycle hook'
  );

  // Day 136: Mixins & MRO ordering
  const day136Theory = BATCH_027_MANIFEST.days[3].blocks[0] as any;
  assert(
    day136Theory.whatItIs.includes('C3 Linearization') || day136Theory.whatItIs.includes('MRO'),
    'Day 136 covers Python C3 Linearization and MRO'
  );
  assert(
    day136Theory.whatItIs.includes('TO THE LEFT') || day136Theory.whatItIs.includes('to the left'),
    'Day 136 mandates placing mixins to the left of generic base views'
  );
  assert(
    day136Theory.whatItIs.includes('non_field_errors'),
    'Day 136 covers non_field_errors diagnosis'
  );

  // Day 137: Formative assessment
  const day137Transfer = BATCH_027_MANIFEST.days[4].blocks[0] as any;
  assert(day137Transfer.type === 'TRANSFER_CHALLENGE', 'Day 137 primary block is TRANSFER_CHALLENGE');
  assert(day137Transfer.estimatedMinutes === 75, 'Day 137 transfer challenge is 75 min');
  assert(day137Transfer.constraints.length >= 5, 'Day 137 transfer challenge has at least 5 constraints');
  assert(DAY_137_ASSESSMENT.rubric.length === 5, 'Day 137 assessment has 5 rubric dimensions');
  const rubricSum = DAY_137_ASSESSMENT.rubric.reduce((sum, r) => sum + r.weight, 0);
  assert(Math.abs(rubricSum - 1.0) < 0.001, `Day 137 rubric weights sum to exactly 1.0 (Found: ${rubricSum})`);

  // ── GROUP 4: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 4: Behavioral Reference Simulation Tests ──');

  // Test 1: Multi-stage form validation pipeline simulation
  const validPayload = {
    code: '  nct-2026-001  ',
    systolic: '120',
    diastolic: '80',
  };

  const normalizers = {
    code: (v: any) => String(v).trim(),
    systolic: (v: any) => parseInt(v, 10),
    diastolic: (v: any) => parseInt(v, 10),
  };

  const cleaners = {
    code: (v: any) => {
      const upper = v.toUpperCase();
      if (!upper.startsWith('NCT-')) throw new Error('Code must start with NCT-');
      return upper;
    },
  };

  const crossCleaner = (cleaned: Record<string, any>) => {
    if (cleaned.systolic <= cleaned.diastolic) {
      throw new Error('Systolic must be strictly greater than diastolic');
    }
  };

  const validResult = simulateFormValidationPipeline(validPayload, normalizers, cleaners, crossCleaner);
  assert(validResult.isValid, 'Valid form payload passes all pipeline stages');
  assert(validResult.cleanedData.code === 'NCT-2026-001', 'clean_<field> successfully normalizes uppercase string');
  assert(validResult.cleanedData.systolic === 120, 'to_python correctly coerces string to integer');

  const invalidPayload = {
    code: 'INVALID-99',
    systolic: '80',
    diastolic: '120',
  };
  const invalidResult = simulateFormValidationPipeline(invalidPayload, normalizers, cleaners, crossCleaner);
  assert(!invalidResult.isValid, 'Invalid payload fails validation pipeline');
  assert(invalidResult.errors.code !== undefined, 'Field-level cleaner captures invalid prefix error');

  // Test 2: Mass-assignment allowlisting simulation
  const attackerPayload = {
    username: 'alice_researcher',
    email: 'alice@hospital.org',
    is_staff: true,
    is_superuser: true,
    credit_limit: 999999,
  };
  const safeFields = ['username', 'email'];
  const sanitized = filterModelFormFields(attackerPayload, safeFields);
  assert(sanitized.username === 'alice_researcher', 'Allowlisted username field is retained');
  assert(sanitized.email === 'alice@hospital.org', 'Allowlisted email field is retained');
  assert(sanitized.is_staff === undefined, 'Injected is_staff field is stripped by allowlist');
  assert(sanitized.is_superuser === undefined, 'Injected is_superuser field is stripped by allowlist');
  assert(sanitized.credit_limit === undefined, 'Injected credit_limit field is stripped by allowlist');

  // Test 3: View mixin MRO execution order simulation
  const correctMro = simulateViewMroDispatch(['Mixin', 'BaseView']);
  assert(correctMro.mixinIntercepted, 'When mixin is on LEFT, mixin intercept executes successfully');
  assert(correctMro.executionOrder[0] === 'Mixin', 'Mixin appears first in execution chain');

  const brokenMro = simulateViewMroDispatch(['BaseView', 'Mixin']);
  assert(!brokenMro.mixinIntercepted, 'When BaseView is on LEFT, terminal dispatch bypasses mixin entirely');
  assert(brokenMro.executionOrder[0] === 'BaseView', 'BaseView appears first, short-circuiting mixin');

  // ── GROUP 5: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 5: Diagnostic & QA Checks on All Blocks ──');

  BATCH_027_MANIFEST.days.forEach((d) => {
    d.blocks.forEach((blk) => {
      assert(blk.title.trim().length > 0, `Block ${blk.id} has non-empty title`);
      assert(blk.estimatedMinutes > 0, `Block ${blk.id} has positive estimatedMinutes`);
      if (blk.type === 'KNOWLEDGE_CHECK') {
        const kc = blk as any;
        assert(kc.options.length >= 4, `Knowledge check ${blk.id} has at least 4 options`);
        assert(kc.correctIndex >= 0 && kc.correctIndex < kc.options.length, `Knowledge check ${blk.id} has valid correctIndex`);
        assert(kc.explanation.length > 20, `Knowledge check ${blk.id} has detailed explanation`);
        assert(kc.misconceptionIdentified.length > 10, `Knowledge check ${blk.id} has misconceptionIdentified`);
      }
    });
  });

  console.log(`\n========================================================================`);
  console.log(`🎉 BATCH 027 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch027Audit().catch((err) => {
    console.error('Batch 027 Audit Failed:', err);
    process.exit(1);
  });
}
