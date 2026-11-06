const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { DESKTOP_DIR, DOCS_DIR, COMMON_STYLES } = require('./pdf_shared.cjs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinIT Career OS — Branch A Executive Directive: Tech & Launchpad Curriculum Architecture</title>
  <style>
    ${COMMON_STYLES}
  </style>
</head>
<body>

  <div class="header-card" style="border-left-color: #3b82f6;">
    <h1>💻 PinIT Career OS — Branch A Directive</h1>
    <div class="subtitle">Tech & Launchpad Curriculum Tracks, Student Dashboard Experience & Gate v2 Interactive Visuals</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Assigned Lead</strong><span>Branch A Tech Sub-Agent</span></div>
      <div class="meta-item"><strong>Working Tree</strong><span>Present-Career-os-tech</span></div>
      <div class="meta-item"><strong>Git Branch</strong><span>agent/branch-a-curriculum-tech</span></div>
      <div class="meta-item"><strong>Assigned Scope</strong><span>16 Blocks (09-14, 60-63, 67-72)</span></div>
    </div>
  </div>

  <h2>1. Executive Mission & Pedagogical Mandate</h2>
  <p>
    <strong>The Core Problem:</strong> Engineering courses frequently suffer from surface-level summaries, fragmented code snippets, hallucinated prerequisite links, and boring text dumps. When an avatar only speaks for 2 minutes or reads disjointed bullet points, student retention collapses.
  </p>
  <p>
    <strong>The Pedagogical Vision:</strong> Branch A is responsible for the core engineering launchpad of PinIT Career OS (Python, Java, DSA, Cloud, DevOps, Cyber, IoT Tech) and the unified Student Dashboard. Every technical lesson must feel like a 1-on-1 private masterclass with a senior staff engineer at a top tech company.
  </p>

  <div class="alert-box alert-critical">
    <strong>🚨 CORE CURRICULUM INVARIANTS (ABSOLUTELY MANDATORY):</strong><br>
    1. <strong>25–30 Minute Avatar Spoken Duration:</strong> The 3D avatar MUST speak for 25 to 30 minutes every single day. This is achieved by authoring strictly <strong>>= 2,900 words per day</strong> across the 5 parts (strictly <strong>>= 580 words per part</strong>).<br>
    2. <strong>Perfect Concept-Aligned MCQs:</strong> Every lesson must include 4-option MCQs directly probing deep understanding of memory layout, concurrency, or failure modes—never syntax trivia.<br>
    3. <strong>Perfect Cognitive Puzzles:</strong> Every day must feature algorithmic and structural puzzles that reinforce the core concept.<br>
    4. <strong>Gate v2 Interactive Visuals:</strong> Every single day must include a valid Gate v2 interactive visual JSON specification (<code>flow</code>, <code>boxes</code>, <code>bars</code>, <code>cells</code>, <code>stack_queue</code>, <code>compare</code>).<br>
    5. <strong>Deterministic Code Execution:</strong> All starter code and test suites must execute cleanly in Pyodide or Monaco with verified inputs and expected outputs.
  </div>

  <h2>2. The 5-Part LongLesson Daily Structure</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Part</th>
        <th style="width: 25%;">Section Name</th>
        <th style="width: 20%;">Word Invariant</th>
        <th style="width: 40%;">Required Pedagogical Content</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Part 1</strong></td>
        <td>First-Principles Concept Deep Dive</td>
        <td>>= 580 words</td>
        <td>Foundational mental models, historical context, why this abstraction was invented.</td>
      </tr>
      <tr>
        <td><strong>Part 2</strong></td>
        <td>Architectural Deep Dive & Internals</td>
        <td>>= 580 words</td>
        <td>Memory layout, JVM/V8 execution pipeline, complexity analysis, asymptotic bounds.</td>
      </tr>
      <tr>
        <td><strong>Part 3</strong></td>
        <td>Real-World Enterprise Implementation</td>
        <td>>= 580 words</td>
        <td>Production system implementation, complete runnable code, industry architecture patterns.</td>
      </tr>
      <tr>
        <td><strong>Part 4</strong></td>
        <td>Trap Analysis, Edge Cases & War Stories</td>
        <td>>= 580 words</td>
        <td>Post-mortem war stories, race conditions, memory leaks, security flaws, debugging strategies.</td>
      </tr>
      <tr>
        <td><strong>Part 5</strong></td>
        <td>Practical Hands-On Project & Submission</td>
        <td>>= 580 words</td>
        <td>Step-by-step student implementation task, automated test verification criteria, rubric.</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Student Dashboard Experience Invariants</h2>
  <div class="grid-2">
    <div class="block-card">
      <div class="block-card-header">
        <span class="block-title">🍱 Bento Grid 50/50 Split</span>
        <span class="badge badge-blue">UI Invariant</span>
      </div>
      <p>The student dashboard BentoGrid strictly pairs the <strong>WhatToDoToday</strong> prioritized action card with the <strong>Socratic Competencies Radar</strong> in a clean 50/50 responsive split. All legacy KPI strips and attendance markers are permanently removed.</p>
    </div>
    <div class="block-card">
      <div class="block-card-header">
        <span class="block-title">🧭 Prioritized Daily Quest</span>
        <span class="badge badge-green">State Invariant</span>
      </div>
      <p><code>WhatToDoToday.tsx</code> dynamically calculates the student's next uncompleted quest in curriculum sequence. When all quests are satisfied, it presents the Capstone Graduation CTA. It must gracefully handle null profile states.</p>
    </div>
  </div>

  <h2>4. Assigned Scope: 16 Forensic Verification Blocks</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">Block</th>
        <th style="width: 25%;">Domain & Title</th>
        <th style="width: 35%;">Target Files & Modules</th>
        <th style="width: 30%;">Deterministic Verification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Block 09</strong></td>
        <td>AppShell Layout & Navigation</td>
        <td><code>src/components/layout/AppShell.tsx</code>, <code>AppSidebar.tsx</code></td>
        <td><code>npx tsx --test tests/student_dashboard_task2_layout.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 10</strong></td>
        <td>Student Dashboard Bento Grid</td>
        <td><code>src/app/dashboard/page.tsx</code>, <code>DashboardBentoGrid.tsx</code></td>
        <td><code>npx tsx --test tests/student_dashboard_task1_removals.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 11</strong></td>
        <td>WhatToDoToday Task Prioritizer</td>
        <td><code>src/components/ui/WhatToDoToday.tsx</code>, <code>advisorLogic.ts</code></td>
        <td><code>npx tsx --test tests/student_dashboard_task2_layout.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 12</strong></td>
        <td>Socratic Competencies Radar SVG</td>
        <td><code>src/components/student/dashboard/CompetenciesRadar.tsx</code></td>
        <td>Verify 5-axis math calculation (0-100 normalization)</td>
      </tr>
      <tr>
        <td><strong>Block 13</strong></td>
        <td>CareerCourseProgressBar</td>
        <td><code>src/components/student/dashboard/CareerCourseProgressBar.tsx</code></td>
        <td>Render tests in <code>student_dashboard_task1_removals.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 14</strong></td>
        <td>StoryTourModal Onboarding Tour</td>
        <td><code>src/components/ui/StoryTourModal.tsx</code>, <code>storyTourEngine.ts</code></td>
        <td>Verify tour step sequence & localStorage dismissal</td>
      </tr>
      <tr>
        <td><strong>Block 60</strong></td>
        <td>Curriculum Data Loader</td>
        <td><code>src/lib/data/coursesData.ts</code>, <code>curriculumRegistry.ts</code></td>
        <td><code>npx tsx --test tests/java_basics_master_60days.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 61</strong></td>
        <td>LongLesson Word Count Enforcer</td>
        <td><code>src/lib/data/longLessons.ts</code>, <code>build-long-lessons-json.cjs</code></td>
        <td><code>npm run predev</code>; verify all parts >= 580 words</td>
      </tr>
      <tr>
        <td><strong>Block 62</strong></td>
        <td>Gate v2 Interactive Visuals</td>
        <td><code>src/lib/data/lessonVisuals/*</code>, <code>scripts/visuals/check.mts</code></td>
        <td><code>npm run visuals:check</code></td>
      </tr>
      <tr>
        <td><strong>Block 63</strong></td>
        <td>Quest Task Scope & Starters</td>
        <td><code>src/app/quests/page.tsx</code>, <code>src/lib/quests/questEngine.ts</code></td>
        <td><code>npx tsx audit/logic.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 67</strong></td>
        <td>Python & Full-Stack Track</td>
        <td><code>content/courses/pythonnow.md</code>, <code>fullstacknow.md</code>, <code>reactnow.md</code></td>
        <td>Verify all 60 days syntax & starter code</td>
      </tr>
      <tr>
        <td><strong>Block 68</strong></td>
        <td>Java Enterprise Masterclass</td>
        <td><code>content/courses/javanow.md</code>, <code>tests/java_basics_master_60days.test.ts</code></td>
        <td><code>npx tsx --test tests/java_basics_master_60days.test.ts</code> (100% PASS)</td>
      </tr>
      <tr>
        <td><strong>Block 69</strong></td>
        <td>Data Structures & Algorithms</td>
        <td><code>content/courses/dsanow.md</code>, <code>computerfundamentalsnow.md</code></td>
        <td><code>npx tsx tests/js_practice_tasks.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 70</strong></td>
        <td>Cloud & DevOps Engineering</td>
        <td><code>content/courses/cloudnow.md</code>, <code>content/courses/devopsnow.md</code></td>
        <td>Verify Docker/K8s/Terraform YAML snippet syntax</td>
      </tr>
      <tr>
        <td><strong>Block 71</strong></td>
        <td>Cybersecurity & Cryptography</td>
        <td><code>content/courses/cybersecuritynow.md</code>, <code>iotsecuritynow.md</code></td>
        <td><code>npx tsx scripts/tests/test_p0_security_remediations.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 72</strong></td>
        <td>Embedded Systems & IoT Tech</td>
        <td><code>content/courses/iotnow.md</code>, <code>iotnetworknow.md</code>, <code>edgeainow.md</code></td>
        <td>Verify IoT firmware & network protocol code</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Multi-Agent Concurrency & Branch Isolation</h2>
  <div class="alert-box alert-warning">
    <strong>🛡️ BRANCH A BOUNDARY RULES:</strong><br>
    • Operate strictly inside worktree <code>C:\Users\Admin\Desktop\projects\Present-Career-os-tech</code> on branch <code>agent/branch-a-curriculum-tech</code>.<br>
    • Do NOT touch files in Commerce tracks (<code>src/lib/data/bcom*</code>) or Institutional Portals (<code>src/app/campus-admin/*</code>).<br>
    • Log completed tasks in <code>C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv</code> within task range <code>TASK-688</code> to <code>TASK-750</code>.<br>
    • When a 5-day block is complete, record word counts and test results in <code>PROJECT_MEMORY.md</code>.
  </div>

</body>
</html>
`;

(async () => {
  const htmlPath = path.join(DOCS_DIR, 'PINIT_BRANCH_A_DIRECTIVE.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('HTML written to:', htmlPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  const destPdfDocs = path.join(DOCS_DIR, 'PINIT_BRANCH_A_DIRECTIVE.pdf');
  const destPdfDesktop = path.join(DESKTOP_DIR, 'PINIT_BRANCH_A_DIRECTIVE.pdf');

  await page.pdf({
    path: destPdfDocs,
    format: 'A4',
    margin: { top: '10mm', right: '12mm', bottom: '10mm', left: '12mm' },
    printBackground: true
  });
  console.log('PDF 2 created in docs/directives:', destPdfDocs);

  fs.copyFileSync(destPdfDocs, destPdfDesktop);
  console.log('PDF 2 mirrored to Desktop:', destPdfDesktop);

  await browser.close();
})();
