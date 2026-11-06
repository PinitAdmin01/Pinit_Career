const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { DESKTOP_DIR, DOCS_DIR, COMMON_STYLES } = require('./pdf_shared.cjs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinIT Career OS — Branch C Executive Directive: Institutional Systems, Interviews & Career Architecture</title>
  <style>
    ${COMMON_STYLES}
  </style>
</head>
<body>

  <div class="header-card" style="border-left-color: #8b5cf6;">
    <h1>🏢 PinIT Career OS — Branch C Directive</h1>
    <div class="subtitle">Campus Admin Portals, Faculty Studio, AI Mock Interviews & Virtual Internship Simulator</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Assigned Lead</strong><span>Branch C Platform Sub-Agent</span></div>
      <div class="meta-item"><strong>Working Tree</strong><span>Present-Career-os-platform</span></div>
      <div class="meta-item"><strong>Git Branch</strong><span>agent/branch-c-platform-admin-faculty</span></div>
      <div class="meta-item"><strong>Assigned Scope</strong><span>17 Blocks (46-59, 77-79)</span></div>
    </div>
  </div>

  <h2>1. Executive Mission & Strategic Context</h2>
  <p>
    <strong>The Core Problem:</strong> Educational software typically fragments student learning, institutional administration, mock interviews, and career placement into disconnected siloed portals. Furthermore, administrative dashboards often display dummy metrics that fail under multi-tenant isolation.
  </p>
  <p>
    <strong>The Vision:</strong> Branch C anchors the complete institutional, career-readiness, and placement ecosystem: AI Mock Interview voice simulation with rubric quote extraction, Virtual Internship engineering sprints with cryptographic deliverable verification, Career DNA trajectory mapping, and full Campus Admin / Faculty Studio governance.
  </p>

  <div class="alert-box alert-critical">
    <strong>🚨 STRICT INSTITUTIONAL & EVALUATION INVARIANTS:</strong><br>
    1. <strong>Rubric Quote Extraction:</strong> AI Interview evaluations must quote exact candidate statements to substantiate scoring (Accuracy, Depth, Clarity, Structure) — generic or hallucinated feedback is strictly forbidden.<br>
    2. <strong>Cryptographic Deliverable Proof:</strong> Virtual Internship deliverables (pull requests, code submissions) must be hashed and verified via SHA-256 fingerprints before sprint completion.<br>
    3. <strong>Multi-Tenant Institutional Isolation:</strong> Campus Admin, Faculty Studio, Admissions Matrix, and Hostel Management must strictly enforce university tenant separation via Supabase RLS.<br>
    4. <strong>ATS Resume Grounding:</strong> ATS scoring must parse genuine resume text against real Job Description keywords, providing exact match percentages and actionable enhancements.<br>
    5. <strong>Supervisor External Token Gate:</strong> External supervisor rating portals must use secure, temporary, single-use cryptographically signed tokens.
  </div>

  <h2>2. Assigned Scope: 17 Forensic Verification Blocks</h2>
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
        <td><strong>Block 46</strong></td>
        <td>Interview Setup & JD Matcher</td>
        <td><code>src/app/interview/page.tsx</code>, <code>src/lib/interview/jdMatch.ts</code></td>
        <td><code>npx tsx audit/jdMatch.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 47</strong></td>
        <td>Speech-to-Text & Camera Debounce</td>
        <td><code>InterviewCamera.tsx</code>, <code>speechDebounce.ts</code></td>
        <td>WebRTC camera & silence debouncing checks</td>
      </tr>
      <tr>
        <td><strong>Block 48</strong></td>
        <td>Dynamic Question Generator</td>
        <td><code>src/app/api/interview/generate-questions/route.ts</code></td>
        <td>Progressive fallback & contract parity checks</td>
      </tr>
      <tr>
        <td><strong>Block 49</strong></td>
        <td>Interview Rubrics & Quote Extractor</td>
        <td><code>evaluationQuality.ts</code>, <code>InterviewResultsView.tsx</code></td>
        <td><code>npx tsx --test tests/interview_evaluation_quality.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 50</strong></td>
        <td>Assist Mode & PDF Scorecard</td>
        <td><code>src/components/interview/AssistModeDrawer.tsx</code></td>
        <td>Assist drawer hint triggers & PDF export</td>
      </tr>
      <tr>
        <td><strong>Block 51</strong></td>
        <td>Internship Catalog & Application</td>
        <td><code>src/app/internships/page.tsx</code>, <code>opportunities/route.ts</code></td>
        <td>Prerequisite checks & application contract parity</td>
      </tr>
      <tr>
        <td><strong>Block 52</strong></td>
        <td>Virtual Workplace & Standup Updates</td>
        <td><code>src/app/internship-demo/page.tsx</code>, <code>teamEngine.ts</code></td>
        <td><code>npx tsx tests/tier1_5milestone_internship.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 53</strong></td>
        <td>Weekly Deliverable Verification</td>
        <td><code>src/app/api/internship/weekly-log/route.ts</code></td>
        <td>SHA-256 fingerprint hash validation</td>
      </tr>
      <tr>
        <td><strong>Block 54</strong></td>
        <td>Supervisor Rating & Certificates</td>
        <td><code>supervisor-link/route.ts</code>, <code>certificateGenerator.ts</code></td>
        <td>Certificate NFT verification & token lifecycle</td>
      </tr>
      <tr>
        <td><strong>Block 55</strong></td>
        <td>Multi-Degree Onboarding Wizard</td>
        <td><code>src/app/onboarding/page.tsx</code>, <code>lifeQuestions.ts</code></td>
        <td><code>npx tsx tests/onboarding_life_questions.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 56</strong></td>
        <td>Career DNA & Personality Archetype</td>
        <td><code>src/app/career-dna/page.tsx</code>, <code>career-archetypes.ts</code></td>
        <td><code>npx tsx tests/career_dna_archetype_mapping.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 57</strong></td>
        <td>Trajectory Studio & Roadmap Fuser</td>
        <td><code>src/app/career-builder/page.tsx</code>, <code>roadmapFuser.ts</code></td>
        <td><code>npx tsx tests/career_builder_tab_intelligence.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 58</strong></td>
        <td>ATS Resume Parser & PDF Output</td>
        <td><code>src/app/api/resume/analyze/route.ts</code>, <code>printResume.ts</code></td>
        <td>Resume keyword density scoring & print format</td>
      </tr>
      <tr>
        <td><strong>Block 59</strong></td>
        <td>Portfolio Engine & QR Identity Page</td>
        <td><code>src/app/portfolio/page.tsx</code>, <code>src/app/identity/page.tsx</code></td>
        <td><code>npx tsx audit/course_purchase_qr.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 77</strong></td>
        <td>Campus Admin Portal & Telemetry</td>
        <td><code>src/app/campus-admin/page.tsx</code>, <code>AdminDashboardShell.tsx</code></td>
        <td><code>npx tsx tests/campus_admin_portal.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 78</strong></td>
        <td>Teacher Studio & Exam Generator</td>
        <td><code>src/app/teacher/page.tsx</code>, <code>TeacherDashboard.tsx</code></td>
        <td><code>npx tsx tests/teacher_portal_gradebook.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 79</strong></td>
        <td>Admissions Matrix & Hostel System</td>
        <td><code>src/app/admissions/page.tsx</code>, <code>hostelManagement.ts</code></td>
        <td><code>npx tsx tests/admissions_and_hostel_systems.test.ts</code></td>
      </tr>
    </tbody>
  </table>

  <h2>3. Multi-Agent Concurrency & Branch Isolation</h2>
  <div class="alert-box alert-warning">
    <strong>🛡️ BRANCH C BOUNDARY RULES:</strong><br>
    • Operate strictly inside worktree <code>C:\Users\Admin\Desktop\projects\Present-Career-os-platform</code> on branch <code>agent/branch-c-platform-admin-faculty</code>.<br>
    • Do NOT touch curriculum long lesson files (<code>src/lib/data/*LongLessons.ts</code>) or 3D avatar engines.<br>
    • Log completed tasks in <code>C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv</code> within task range <code>TASK-851</code> to <code>TASK-950</code>.<br>
    • Log verified milestones in <code>PROJECT_MEMORY.md</code> with exact pass counts and commit SHAs.
  </div>

</body>
</html>
`;

(async () => {
  const htmlPath = path.join(DOCS_DIR, 'PINIT_BRANCH_C_DIRECTIVE.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('HTML written to:', htmlPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  const destPdfDocs = path.join(DOCS_DIR, 'PINIT_BRANCH_C_DIRECTIVE.pdf');
  const destPdfDesktop = path.join(DESKTOP_DIR, 'PINIT_BRANCH_C_DIRECTIVE.pdf');

  await page.pdf({
    path: destPdfDocs,
    format: 'A4',
    margin: { top: '10mm', right: '12mm', bottom: '10mm', left: '12mm' },
    printBackground: true
  });
  console.log('PDF 4 created in docs/directives:', destPdfDocs);

  fs.copyFileSync(destPdfDocs, destPdfDesktop);
  console.log('PDF 4 mirrored to Desktop:', destPdfDesktop);

  await browser.close();
})();
