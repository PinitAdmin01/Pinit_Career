// scripts/test_pathway_validation.ts
// Exhaustive 360-degree forensic validation runner for Competency Graph & Schema

import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import { validateCompetencyCatalog } from '../src/lib/pathway/graphValidator';
import { CompetencyDefinition } from '../src/lib/pathway/competencySchema';

console.log('================================================================');
console.log('  PINIT PATHWAY & GRAPH VALIDATION: 360° FORENSIC AUDIT SUITE  ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assertTest(name: string, condition: boolean, details?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name}`, details || '');
    process.exit(1);
  }
}

// ── TEST 1: Production Catalog V1 ─────────────────────────────────────────────
console.log('--- 1. Production Catalog V1 Integrity ---');
const prodResult = validateCompetencyCatalog(COMPETENCY_CATALOG_V1);
assertTest('Production Catalog V1 is 100% valid with 0 errors', prodResult.valid, prodResult);
assertTest('Production Catalog has 0 missing references', prodResult.missingReferences.length === 0);
assertTest('Production Catalog has 0 duplicate IDs', prodResult.duplicateCompetencyIds.length === 0);
assertTest('Production Catalog has 0 cycles', prodResult.cycles.length === 0);
assertTest('Production Catalog has 0 self-dependencies', prodResult.selfDependencies.length === 0);
assertTest('Production Catalog has 0 cross-level violations', prodResult.invalidCrossLevelPrerequisites.length === 0);
assertTest('Production Catalog has 0 invalid class weights', prodResult.invalidClassWeights.length === 0);
assertTest('Production Catalog has 0 invalid evidence requirements', prodResult.invalidEvidenceRequirements.length === 0);

// ── TEST 2: Valid Diamond DAG (No false-positive cycles) ──────────────────────
console.log('\n--- 2. Valid Diamond DAG Structure ---');
const diamondCatalog: CompetencyDefinition[] = [
  {
    id: 'node_root',
    version: '1.0.0',
    title: 'Root',
    domain: 'tech',
    level: 'L0',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'node_left',
    version: '1.0.0',
    title: 'Left Branch',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['node_root'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'node_right',
    version: '1.0.0',
    title: 'Right Branch',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['node_root'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'node_merge',
    version: '1.0.0',
    title: 'Merged Node',
    domain: 'tech',
    level: 'L2',
    description: '',
    prerequisites: ['node_left', 'node_right'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'intermediate' }],
    classWeights: { knowledge: 1.0 },
  },
];
const diamondResult = validateCompetencyCatalog(diamondCatalog);
assertTest('Diamond DAG correctly passes validation with 0 false-positive cycles', diamondResult.valid && diamondResult.cycles.length === 0);

// ── TEST 3: Cycle Detection in Disjoint Subgraphs ─────────────────────────────
console.log('\n--- 3. Cycle Detection in Disjoint Subgraphs ---');
const cyclicCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_a',
    version: '1.0.0',
    title: 'A',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_c'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_b',
    version: '1.0.0',
    title: 'B',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_a'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_c',
    version: '1.0.0',
    title: 'C',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_b'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
];
const cycleResult = validateCompetencyCatalog(cyclicCatalog);
assertTest('Cycle detection catches circular dependency loop', !cycleResult.valid && cycleResult.cycles.length > 0);

// ── TEST 4: Self-Dependency & Duplicate Prerequisites ────────────────────────
console.log('\n--- 4. Self-Dependencies and Duplicate Prerequisites ---');
const selfDepCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_self',
    version: '1.0.0',
    title: 'Self',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_self'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_dup_prereq',
    version: '1.0.0',
    title: 'Dup Prereq',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_self', 'comp_self'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
];
const selfDepResult = validateCompetencyCatalog(selfDepCatalog);
assertTest('Self-dependency is detected', selfDepResult.selfDependencies.includes('comp_self'));
assertTest('Duplicate prerequisite is detected', selfDepResult.duplicatePrerequisites.some(d => d.competencyId === 'comp_dup_prereq'));

// ── TEST 5: Missing Reference Detection ───────────────────────────────────────
console.log('\n--- 5. Missing Prerequisite Reference Detection ---');
const missingRefCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_orphan',
    version: '1.0.0',
    title: 'Orphan',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['non_existent_prereq_id'],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
];
const missingRefResult = validateCompetencyCatalog(missingRefCatalog);
assertTest('Missing prerequisite is detected and identified', missingRefResult.missingReferences.some(m => m.missingPrereqId === 'non_existent_prereq_id'));

// ── TEST 6: Duplicate Competency ID Detection ─────────────────────────────────
console.log('\n--- 6. Duplicate Competency ID Detection ---');
const dupIdCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_duplicate',
    version: '1.0.0',
    title: 'Duplicate 1',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_duplicate',
    version: '1.0.0',
    title: 'Duplicate 2',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
];
const dupIdResult = validateCompetencyCatalog(dupIdCatalog);
assertTest('Duplicate competency ID is detected', dupIdResult.duplicateCompetencyIds.includes('comp_duplicate'));

// ── TEST 7: Cross-Level Hierarchy Invariant ──────────────────────────────────
console.log('\n--- 7. Cross-Level Hierarchy Invariant ---');
const crossLevelCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_l4_target',
    version: '1.0.0',
    title: 'L4 Target',
    domain: 'tech',
    level: 'L4',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'advanced' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_l1_junior',
    version: '1.0.0',
    title: 'L1 Junior',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_l4_target'], // L1 requires L4!
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_l1_allowed',
    version: '1.0.0',
    title: 'L1 Allowed Cross Level',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: ['comp_l4_target'],
    allowHigherLevelPrerequisite: true, // Explicitly allowed
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.0 },
  },
];
const crossLevelResult = validateCompetencyCatalog(crossLevelCatalog);
assertTest('Illegal cross-level prerequisite (L1 -> L4) is caught', crossLevelResult.invalidCrossLevelPrerequisites.some(c => c.competencyId === 'comp_l1_junior'));
assertTest('Explicitly allowed cross-level prerequisite is NOT flagged', !crossLevelResult.invalidCrossLevelPrerequisites.some(c => c.competencyId === 'comp_l1_allowed'));

// ── TEST 8: Class Weight Normalization Validation ─────────────────────────────
console.log('\n--- 8. Class Weight Normalization Validation ---');
const badWeightCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_bad_weight_sum',
    version: '1.0.0',
    title: 'Bad Weight Sum',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 0.3, application: 0.4 }, // Sum = 0.7 != 1.0
  },
  {
    id: 'comp_bad_weight_negative',
    version: '1.0.0',
    title: 'Bad Weight Negative',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 1, minimumDifficulty: 'basic' }],
    classWeights: { knowledge: 1.2, application: -0.2 }, // Negative weight
  },
];
const badWeightResult = validateCompetencyCatalog(badWeightCatalog);
assertTest('Non-1.0 class weight sum is caught', badWeightResult.invalidClassWeights.some(w => w.competencyId === 'comp_bad_weight_sum'));
assertTest('Negative class weight is caught', badWeightResult.invalidClassWeights.some(w => w.competencyId === 'comp_bad_weight_negative'));

// ── TEST 9: Evidence Requirement Bounds Validation ───────────────────────────
console.log('\n--- 9. Evidence Requirement Bounds Validation ---');
const badEvidenceCatalog: CompetencyDefinition[] = [
  {
    id: 'comp_bad_evidence_score',
    version: '1.0.0',
    title: 'Bad Evidence Score',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 120, minCount: 1, minimumDifficulty: 'basic' }], // Score > 100
    classWeights: { knowledge: 1.0 },
  },
  {
    id: 'comp_bad_evidence_count',
    version: '1.0.0',
    title: 'Bad Evidence Count',
    domain: 'tech',
    level: 'L1',
    description: '',
    prerequisites: [],
    evidenceRequirements: [{ evidenceClass: 'knowledge', minScore: 70, minCount: 0, minimumDifficulty: 'basic' }], // Count <= 0
    classWeights: { knowledge: 1.0 },
  },
];
const badEvidenceResult = validateCompetencyCatalog(badEvidenceCatalog);
assertTest('Score out of bounds [0, 100] is caught', badEvidenceResult.invalidEvidenceRequirements.some(e => e.competencyId === 'comp_bad_evidence_score'));
assertTest('Non-positive minCount is caught', badEvidenceResult.invalidEvidenceRequirements.some(e => e.competencyId === 'comp_bad_evidence_count'));

console.log('\n================================================================');
console.log(`  🎉 360° AUDIT COMPLETE: ALL ${passedTests}/${totalTests} TESTS PASSED WITH ZERO ERRORS!`);
console.log('================================================================\n');
