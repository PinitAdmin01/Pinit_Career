const { execSync } = require('child_process');

const tests = [
  { block: 46, name: 'Interview Setup & JD Matcher', cmd: 'npx tsx audit/jdMatch.test.ts' },
  { block: 47, name: 'Speech-to-Text & Camera Debounce', cmd: 'npx tsx tests/interview_camera_and_debounce.test.ts' },
  { block: 48, name: 'Dynamic Question Generator', cmd: 'npx tsx tests/interview_question_generator.test.ts' },
  { block: 49, name: 'Interview Rubrics & Quote Extractor', cmd: 'npx tsx --test tests/interview_evaluation_quality.test.ts' },
  { block: 50, name: 'Assist Mode & PDF Scorecard', cmd: 'npx tsx tests/interview_assist_and_scorecard.test.ts' },
  { block: 51, name: 'Internship Catalog & Application', cmd: 'npx tsx tests/internship_eligibility.test.ts' },
  { block: 52, name: 'Virtual Workplace & Standup Updates', cmd: 'npx tsx tests/tier1_5milestone_internship.test.ts' },
  { block: 53, name: 'Weekly Deliverable Verification', cmd: 'npx tsx tests/internship_deliverables_and_certificates.test.ts' },
  { block: 54, name: 'Supervisor Rating & Certificates', cmd: 'npx tsx tests/internship_t34_supervisor.test.ts' },
  { block: 55, name: 'Multi-Degree Onboarding Wizard', cmd: 'npx tsx tests/onboarding_life_questions.test.ts' },
  { block: 56, name: 'Career DNA & Personality Archetype', cmd: 'npx tsx --test tests/career_dna_archetype_mapping.test.ts' },
  { block: 57, name: 'Trajectory Studio & Roadmap Fuser', cmd: 'npx tsx tests/career_builder_tab_intelligence.test.ts' },
  { block: 58, name: 'ATS Resume Parser & PDF Output', cmd: 'npx tsx --test tests/ats_resume_parser_and_print.test.ts' },
  { block: 59, name: 'Portfolio Engine & QR Identity Page', cmd: 'npx tsx audit/course_purchase_qr.test.ts' },
  { block: 77, name: 'Campus Admin Portal & Telemetry', cmd: 'npx tsx --test tests/campus_admin_portal.test.ts' },
  { block: 78, name: 'Teacher Studio & Exam Generator', cmd: 'npx tsx --test tests/teacher_portal_gradebook.test.ts' },
  { block: 79, name: 'Admissions Matrix & Hostel System', cmd: 'npx tsx --test tests/admissions_and_hostel_systems.test.ts' },
];

console.log('🚀 RUNNING ALL 17 FORENSIC VERIFICATION TESTS FOR BRANCH C...\n');
let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    process.stdout.write(`Block ${t.block} [${t.name}]... `);
    const start = Date.now();
    execSync(t.cmd, { stdio: 'pipe' });
    const dur = Date.now() - start;
    console.log(`✅ PASS (${dur}ms)`);
    passed++;
  } catch (err) {
    console.log('❌ FAIL');
    console.error(err.stdout ? err.stdout.toString() : err.message);
    failed++;
  }
}

console.log(`\n======================================================`);
console.log(`🏆 ALL FORENSIC RESULTS: ${tests.length} BLOCKS | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`======================================================\n`);

process.exit(failed > 0 ? 1 : 0);
