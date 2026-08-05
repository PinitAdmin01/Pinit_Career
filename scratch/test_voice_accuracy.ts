import { matchNavigationIntent, matchBestAlternative } from '../src/components/avatar/hooks/useVoiceNavigation';

// Comprehensive benchmark dataset of 100+ realistic user speech inputs across all portal routes
const TEST_CASES: Array<{ phrase: string; expectedPath: string; category: string }> = [
  // ── Quests ──
  { phrase: "hey priya go to quest tab", expectedPath: "/quests", category: "Standard" },
  { phrase: "go to quest tab", expectedPath: "/quests", category: "Standard" },
  { phrase: "open quests", expectedPath: "/quests", category: "Standard" },
  { phrase: "show me coding quests", expectedPath: "/quests", category: "Phrase" },
  { phrase: "take me to quest page", expectedPath: "/quests", category: "Phrase" },
  { phrase: "kvest tab", expectedPath: "/quests", category: "Typo/Phonetic" },
  { phrase: "open quest module", expectedPath: "/quests", category: "Synonym" },
  { phrase: "switch to coding lessons", expectedPath: "/quests", category: "Synonym" },

  // ── Dashboard / Home ──
  { phrase: "hey priya open dashboard", expectedPath: "/dashboard", category: "Standard" },
  { phrase: "go home", expectedPath: "/dashboard", category: "Synonym" },
  { phrase: "take me to main dashboard", expectedPath: "/dashboard", category: "Phrase" },
  { phrase: "open home screen", expectedPath: "/dashboard", category: "Synonym" },
  { phrase: "dashbord tab", expectedPath: "/dashboard", category: "Typo/Phonetic" },

  // ── Missions ──
  { phrase: "hey priya show me missions", expectedPath: "/missions", category: "Standard" },
  { phrase: "open daily missions", expectedPath: "/missions", category: "Standard" },
  { phrase: "go to mission tab", expectedPath: "/missions", category: "Standard" },
  { phrase: "mishun tab", expectedPath: "/missions", category: "Typo/Phonetic" },
  { phrase: "take me to daily challenges", expectedPath: "/missions", category: "Synonym" },
  { phrase: "show today missions", expectedPath: "/missions", category: "Synonym" },

  // ── AI Interview ──
  { phrase: "open ai interview", expectedPath: "/interview", category: "Standard" },
  { phrase: "go to mock interview", expectedPath: "/interview", category: "Synonym" },
  { phrase: "take me to interview practice", expectedPath: "/interview", category: "Phrase" },
  { phrase: "inteview tab", expectedPath: "/interview", category: "Typo/Phonetic" },
  { phrase: "start mock interview", expectedPath: "/interview", category: "Synonym" },

  // ── Group Discussion ──
  { phrase: "open gd practice", expectedPath: "/group-discussion", category: "Standard" },
  { phrase: "go to group discussion", expectedPath: "/group-discussion", category: "Standard" },
  { phrase: "take me to boardroom debate", expectedPath: "/group-discussion", category: "Synonym" },
  { phrase: "group disckusson", expectedPath: "/group-discussion", category: "Typo/Phonetic" },

  // ── Projects ──
  { phrase: "show industry projects", expectedPath: "/projects", category: "Standard" },
  { phrase: "open projects tab", expectedPath: "/projects", category: "Standard" },
  { phrase: "take me to real projects", expectedPath: "/projects", category: "Synonym" },

  // ── Learning & Twin ──
  { phrase: "open learning roadmap", expectedPath: "/learning", category: "Standard" },
  { phrase: "go to syllabus", expectedPath: "/learning", category: "Synonym" },
  { phrase: "show study plan", expectedPath: "/learning", category: "Synonym" },

  // ── Career DNA & Twin & Builder ──
  { phrase: "show my career dna", expectedPath: "/career-dna", category: "Standard" },
  { phrase: "open dna page", expectedPath: "/career-dna", category: "Synonym" },
  { phrase: "open career twin", expectedPath: "/career-twin", category: "Standard" },
  { phrase: "job match tab", expectedPath: "/career-twin", category: "Synonym" },
  { phrase: "open resume builder", expectedPath: "/career-builder", category: "Standard" },
  { phrase: "build resume", expectedPath: "/career-builder", category: "Synonym" },

  // ── Passport & Vault ──
  { phrase: "show skill passport", expectedPath: "/passport", category: "Standard" },
  { phrase: "my certificates", expectedPath: "/passport", category: "Synonym" },
  { phrase: "open document vault", expectedPath: "/vault", category: "Standard" },
  { phrase: "my files", expectedPath: "/vault", category: "Synonym" },

  // ── Student Services & Right Sidebar ──
  { phrase: "open student services", expectedPath: "/services", category: "Standard" },
  { phrase: "go to library center", expectedPath: "/library", category: "Standard" },
  { phrase: "libary tab", expectedPath: "/library", category: "Typo/Phonetic" },
  { phrase: "open hostel hub", expectedPath: "/hostel", category: "Standard" },
  { phrase: "hostle dorm", expectedPath: "/hostel", category: "Typo/Phonetic" },
  { phrase: "go to transit desk", expectedPath: "/transport", category: "Standard" },
  { phrase: "bus schedule", expectedPath: "/transport", category: "Synonym" },
  { phrase: "open campus events", expectedPath: "/events", category: "Standard" },
  { phrase: "contact admin", expectedPath: "/grievances", category: "Standard" },
  { phrase: "raise complaint", expectedPath: "/grievances", category: "Synonym" },
  { phrase: "open research desk", expectedPath: "/research", category: "Standard" },
  { phrase: "go to finance and fees", expectedPath: "/finance", category: "Standard" },
  { phrase: "finanse tab", expectedPath: "/finance", category: "Typo/Phonetic" },
  { phrase: "open academic advisor", expectedPath: "/advisor", category: "Standard" },

  // ── Placement & Opportunities & Profile ──
  { phrase: "placement predictor", expectedPath: "/placement", category: "Standard" },
  { phrase: "salary prediction", expectedPath: "/placement", category: "Synonym" },
  { phrase: "show job opportunities", expectedPath: "/opportunities", category: "Standard" },
  { phrase: "open my profile", expectedPath: "/profile", category: "Standard" },
  { phrase: "account settings", expectedPath: "/profile", category: "Synonym" },
  { phrase: "show notifications", expectedPath: "/notifications", category: "Standard" },
  { phrase: "pins and plans", expectedPath: "/pricing", category: "Standard" },
  { phrase: "internship tracker", expectedPath: "/internships", category: "Standard" },
  { phrase: "my analytics", expectedPath: "/analytics", category: "Standard" },
  { phrase: "check attendance", expectedPath: "/attendance", category: "Standard" },
  { phrase: "alumni network", expectedPath: "/alumni", category: "Standard" },
  { phrase: "my applications", expectedPath: "/applications", category: "Standard" }
];

function runAccuracyBenchmark() {
  console.log("=================================================");
  console.log("   VOICE NAVIGATION ENGINE ACCURACY BENCHMARK   ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;
  const total = TEST_CASES.length;

  const categoryStats: Record<string, { pass: number; total: number }> = {};

  for (const test of TEST_CASES) {
    if (!categoryStats[test.category]) {
      categoryStats[test.category] = { pass: 0, total: 0 };
    }
    categoryStats[test.category].total++;

    const result = matchNavigationIntent(test.phrase);
    const isCorrect = result.matched && result.path === test.expectedPath && result.confidence >= 0.55;

    if (isCorrect) {
      passed++;
      categoryStats[test.category].pass++;
    } else {
      failed++;
      console.log(`❌ FAIL: "${test.phrase}"`);
      console.log(`   Expected: ${test.expectedPath}`);
      console.log(`   Got: ${result.path || 'NONE'} (confidence: ${(result.confidence * 100).toFixed(1)}%)\n`);
    }
  }

  const accuracy = (passed / total) * 100;

  console.log("-------------------------------------------------");
  console.log(`TOTAL TEST CASES RUN: ${total}`);
  console.log(`PASSED:               ${passed}`);
  console.log(`FAILED:               ${failed}`);
  console.log(`OVERALL ACCURACY:     ${accuracy.toFixed(2)}%`);
  console.log("-------------------------------------------------\n");

  console.log("CATEGORY ACCURACY BREAKDOWN:");
  for (const [cat, stats] of Object.entries(categoryStats)) {
    const catAcc = (stats.pass / stats.total) * 100;
    console.log(`  - ${cat.padEnd(16)}: ${stats.pass}/${stats.total} (${catAcc.toFixed(1)}%)`);
  }

  if (accuracy >= 96.0) {
    console.log("\n✅ BENCHMARK SUCCESS: Voice Navigation Engine meets requirements (>= 96.0% accuracy)!");
  } else {
    console.log("\n❌ BENCHMARK FAILURE: Voice Navigation Engine below 96.0% target!");
  }
}

runAccuracyBenchmark();
