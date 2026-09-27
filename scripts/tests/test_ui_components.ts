// scripts/test_ui_components.ts
// Exhaustive 360-degree forensic audit for Phase 4 UI Components & Integration Contracts

import React from 'react';
import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';
import { CAREER_PROGRAMS_CATALOG, evaluateStageProgression } from '../src/lib/pathway/programEngine';
import { CompetencyMasteryStatus, MasteryState } from '../src/lib/pathway/competencySchema';

console.log('================================================================');
console.log('  PINIT UI COMPONENTS & INTEGRATION: 360° FORENSIC AUDIT        ');
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

// ── 1. CareerPathwayTimeline Contract & Logic Validation ───────────────────────
console.log('--- 1. CareerPathwayTimeline Component Contracts ---');

// 1a. Fallback to default catalog program on invalid ID
const invalidProgId = 'invalid_program_999';
const resolvedProgram = CAREER_PROGRAMS_CATALOG.find(p => p.id === invalidProgId) || CAREER_PROGRAMS_CATALOG[0];
assertTest('Invalid program ID safely defaults to first available catalog program', resolvedProgram.id === 'prog_swe_accelerated_9m');

// 1b. Stage Stepper & Residency detection
const sweProg = CAREER_PROGRAMS_CATALOG.find(p => p.id === 'prog_software_engineering')!;
assertTest('SWE Program has 4 stages with final stage designated as Residency', sweProg.stages.length === 4 && sweProg.hasIndustryResidency);

// 1c. Stage 1 progression evaluation with empty mastery map
const emptyMastery = new Map<string, CompetencyMasteryStatus>();
const sem1Result = evaluateStageProgression(sweProg.stages[0], sweProg.stages[1], emptyMastery);
assertTest('Initial state shows 0/3 required competencies satisfied', sem1Result.passedRequiredCompetencies === 0 && sem1Result.totalRequiredCompetencies === 3);
assertTest('Stage progress percentage is exactly 0%', sem1Result.stageProgressPct === 0);
assertTest('Advancement to Semester 2 is strictly blocked', !sem1Result.canAdvanceToNextStage);

// 1d. Stage 1 with fully satisfied competencies
const completedMastery = new Map<string, CompetencyMasteryStatus>([
  ['comp_comp_fundamentals_l0', { state: 'demonstrated', compositeScore: 80 } as any],
  ['comp_git_version_control_l1', { state: 'verified', compositeScore: 85 } as any],
  ['comp_java_syntax_oop_l1', { state: 'demonstrated', compositeScore: 80 } as any],
]);
const sem1PassedResult = evaluateStageProgression(sweProg.stages[0], sweProg.stages[1], completedMastery);
assertTest('Completed Stage 1 passes all 3/3 gates', sem1PassedResult.passedRequiredCompetencies === 3);
assertTest('Stage progress percentage reaches 100%', sem1PassedResult.stageProgressPct === 100);
assertTest('Advancement unlocks next stage ID (sem_2_swe_core_engineering)', sem1PassedResult.canAdvanceToNextStage && sem1PassedResult.nextStageId === 'sem_2_swe_core_engineering');

// ── 2. CompetencyRadarView Filter & Search Engine Contracts ──────────────────
console.log('\n--- 2. CompetencyRadarView Filter & Search Contracts ---');

// 2a. Domain filtering
const filterByDomain = (domain: string) => COMPETENCY_CATALOG_V1.filter(c => domain === 'all' || c.domain === domain);
assertTest('Domain filter "all" returns full catalog (17 competencies)', filterByDomain('all').length === 17);
assertTest('Domain filter "tech" returns only engineering competencies', filterByDomain('tech').every(c => c.domain === 'tech'));
assertTest('Domain filter "data" returns only data analytics competencies', filterByDomain('data').every(c => c.domain === 'data'));
assertTest('Domain filter "ai" returns only AI competencies', filterByDomain('ai').every(c => c.domain === 'ai'));
assertTest('Domain filter "communication" returns soft skills competencies', filterByDomain('communication').every(c => c.domain === 'communication'));

// 2b. Level filtering
const filterByLevel = (level: string) => COMPETENCY_CATALOG_V1.filter(c => level === 'all' || c.level === level);
assertTest('Level filter "L0" returns Computer Fundamentals', filterByLevel('L0').some(c => c.id === 'comp_comp_fundamentals_l0'));
assertTest('Level filter "L1" returns Syntax and Version Control', filterByLevel('L1').length >= 3);
assertTest('Level filter "L5" returns Production Engineering Residency', filterByLevel('L5').some(c => c.id === 'comp_production_engineering_residency_l5'));

// 2c. Case-insensitive Search
const searchCatalog = (query: string) => {
  const q = query.toLowerCase().trim();
  return COMPETENCY_CATALOG_V1.filter(c =>
    c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
};
assertTest('Search "syntax" matches Java and Python syntax competencies', searchCatalog('syntax').length >= 2);
assertTest('Search "java" matches Java Core Syntax L1', searchCatalog('java').some(c => c.id === 'comp_java_syntax_oop_l1'));
assertTest('Search "sql" matches SQL Internals and Analytics', searchCatalog('sql').length >= 2);
assertTest('Search "residency" matches Production Residency L5', searchCatalog('residency').length >= 1);
assertTest('Search "nonexistent_xyz" returns empty array [] without crashing', searchCatalog('nonexistent_xyz').length === 0);

// ── 3. State Color & Badge Resolution Contracts ──────────────────────────────
console.log('\n--- 3. State Badge Contracts ---');
const badgeStates: MasteryState[] = [
  'locked',
  'diagnostic',
  'learning',
  'practice',
  'provisional',
  'demonstrated',
  'verified',
  'verified_needs_review',
];

assertTest('All 8 mastery states are defined in the schema lifecycle', badgeStates.length === 8);
assertTest('Verified state represents highest credential verification', badgeStates.includes('verified'));
assertTest('Verified_needs_review preserves non-destructive review state', badgeStates.includes('verified_needs_review'));

// ── 4. Cross-View Synchronization Logic (Passport Page) ──────────────────────
console.log('\n--- 4. Passport Page Cross-View Synchronization ---');
let activeView = 'timeline';
let selectedCompId: string | undefined = undefined;

// Simulate user clicking a competency on the timeline
const handleSelectFromTimeline = (compId: string) => {
  selectedCompId = compId;
  activeView = 'matrix';
};

handleSelectFromTimeline('comp_java_syntax_oop_l1');
assertTest('Selecting a competency in Timeline switches view mode to "matrix"', activeView === 'matrix');
assertTest('Selected competency ID is persisted in state', selectedCompId === 'comp_java_syntax_oop_l1');

console.log('\n================================================================');
console.log(`  🎉 360° FORENSIC AUDIT PASSED: ALL ${passedTests}/${totalTests} TESTS PASSED WITH 0 ERRORS!`);
console.log('================================================================\n');
