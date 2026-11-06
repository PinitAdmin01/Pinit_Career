const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { DESKTOP_DIR, DOCS_DIR, COMMON_STYLES } = require('./pdf_shared.cjs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinIT Career OS — Branch B Executive Directive: Commerce Curriculum & Cognitive Game Architecture</title>
  <style>
    ${COMMON_STYLES}
  </style>
</head>
<body>

  <div class="header-card" style="border-left-color: #10b981;">
    <h1>📊 PinIT Career OS — Branch B Directive</h1>
    <div class="subtitle">Commerce & Business Curricula, Cognitive Intelligence Games & Pins Economy Engine</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Assigned Lead</strong><span>Branch B Commerce Sub-Agent</span></div>
      <div class="meta-item"><strong>Working Tree</strong><span>Present-Career-os-commerce</span></div>
      <div class="meta-item"><strong>Git Branch</strong><span>agent/branch-b-curriculum-commerce-iot</span></div>
      <div class="meta-item"><strong>Assigned Scope</strong><span>19 Blocks (34-45, 64-66, 73-76)</span></div>
    </div>
  </div>

  <h2>1. Executive Mission & Domain Objectives</h2>
  <p>
    <strong>The Core Problem:</strong> Higher education business and commerce curricula (B.Com, BBA, Corporate Finance) are too often delivered as static textbook memorization, lacking real financial data, forensic case studies, or active problem solving. Furthermore, gamified cognitive testing often lapses into unbalanced, repetitive questions.
  </p>
  <p>
    <strong>The Vision:</strong> Branch B combines modern commerce and financial engineering (14 B.Com tracks, 4 IoT engineering tracks) with rigorous cognitive gaming (IQ Puzzle Arena, Mind Mosaic multi-lens simulations, 15-second Sprint Clock) and the Pins micro-economy.
  </p>

  <div class="alert-box alert-critical">
    <strong>🚨 STRICT PEDAGOGICAL & GAMING INVARIANTS:</strong><br>
    1. <strong>25–30 Minute Avatar Speech Invariant:</strong> The 3D avatar MUST speak for 25 to 30 minutes every single day across all 14 B.Com tracks and 4 IoT tracks. Authored content must meet or exceed <strong>2,900 words per day</strong> across all 5 parts (strictly <strong>>= 580 words per part</strong>).<br>
    2. <strong>Balanced IQ Puzzles & Mind Mosaic:</strong> Puzzles must have mathematically balanced options with valid shuffled keys. Scenarios must probe Analytical, Strategic, Creative, and Pragmatic lenses independently.<br>
    3. <strong>15-Second Sprint Clock:</strong> Must maintain sub-millisecond precision without drift when browser tabs are throttled.<br>
    4. <strong>Pins Economy Integrity:</strong> Zero negative balances, idempotent daily reward claims, and cryptographic Razorpay signature validation.<br>
    5. <strong>Group Discussion Simulator:</strong> Must feature realistic turn-taking among 3 AI personas with automated consensus scoring.
  </div>

  <h2>2. Assigned Scope: 19 Forensic Verification Blocks</h2>
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
        <td><strong>Block 34</strong></td>
        <td>Pins Ledger & Daily Reset Cron</td>
        <td><code>src/hooks/usePins.ts</code>, <code>src/app/api/cron/daily-pin-reset/route.ts</code></td>
        <td><code>npx tsx audit/pins_economy.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 35</strong></td>
        <td>Pin Purchase & Razorpay Gateway</td>
        <td><code>src/components/pins/PinPurchaseModal.tsx</code>, <code>src/lib/razorpay.ts</code></td>
        <td>Webhook signature & contract parity verification</td>
      </tr>
      <tr>
        <td><strong>Block 36</strong></td>
        <td>Item Lock & Customization Shop</td>
        <td><code>src/hooks/useItemLocks.ts</code>, <code>AvatarShopModal.tsx</code></td>
        <td>Unlock state persistence & balance decrement checks</td>
      </tr>
      <tr>
        <td><strong>Block 37</strong></td>
        <td>Student Vault, Streaks & Badges</td>
        <td><code>src/app/vault/page.tsx</code>, <code>badgeEngine.ts</code>, <code>useVault.ts</code></td>
        <td><code>npx tsx tests/vault_inventory_parity.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 38</strong></td>
        <td>Leaderboards & League Engine</td>
        <td><code>src/app/leaderboard/page.tsx</code>, <code>leagueEngine.ts</code></td>
        <td><code>npx tsx tests/leaderboard_league_mechanics.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 39</strong></td>
        <td>Code Wars & 1v1 PvP Matchmaking</td>
        <td><code>src/app/arena/page.tsx</code>, <code>useArenaPvP.ts</code>, <code>pvpEngine.ts</code></td>
        <td><code>npx tsx tests/arena_task14_knowledge_and_cross_language.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 40</strong></td>
        <td>Friends Network & Social Feed</td>
        <td><code>src/app/friends/page.tsx</code>, <code>src/app/api/friends/*</code></td>
        <td><code>npx tsx tests/fix_4_friends_audit_remediation.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 41</strong></td>
        <td>Attention Game Board Canvas</td>
        <td><code>src/components/attention-span/AttentionGameBoard.tsx</code></td>
        <td>Canvas render loop & high-DPI scaling checks</td>
      </tr>
      <tr>
        <td><strong>Block 42</strong></td>
        <td>IQ Puzzle Arena Matrix Engine</td>
        <td><code>intelligenceGameData.ts</code>, <code>cognitive_intelligence_games.test.ts</code></td>
        <td><code>npx tsx --test tests/cognitive_intelligence_games.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 43</strong></td>
        <td>Mind Mosaic Multi-Lens Assessment</td>
        <td><code>src/components/attention-span/IntelligenceGames.tsx</code></td>
        <td>Multi-lens scoring independence in <code>cognitive_intelligence_games.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 44</strong></td>
        <td>15-Second Sprint Clock Hook</td>
        <td><code>src/components/attention-span/useSprintClock.ts</code></td>
        <td>Timer countdown, audio cues & timeout callbacks</td>
      </tr>
      <tr>
        <td><strong>Block 45</strong></td>
        <td>Cognitive Score Telemetry & Radar</td>
        <td><code>cognitiveTelemetry.ts</code>, <code>AttentionScorePanel.tsx</code></td>
        <td>Outlier filtering & radar score normalization</td>
      </tr>
      <tr>
        <td><strong>Block 64</strong></td>
        <td>Group Discussion Simulator</td>
        <td><code>src/app/group-discussion/page.tsx</code>, <code>gdTurnEngine.ts</code></td>
        <td>Turn-taking state machine & consensus rubric</td>
      </tr>
      <tr>
        <td><strong>Block 65</strong></td>
        <td>Multilingual Translator</td>
        <td><code>storage/audio/*</code>, <code>multilingualEngine.ts</code></td>
        <td>Hindi, Kannada, Tamil, Telugu locale switching</td>
      </tr>
      <tr>
        <td><strong>Block 66</strong></td>
        <td>Fact-Checking Provenance Validator</td>
        <td><code>src/lib/factCheckValidator.ts</code>, <code>adversarial_qa_audit.test.ts</code></td>
        <td><code>npx tsx --test tests/adversarial_qa_audit.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 73</strong></td>
        <td>B.Com Accounting & Forensics</td>
        <td><code>content/courses/accountingnow.md</code>, <code>bcom_accounting_*.test.ts</code></td>
        <td><code>npx tsx --test tests/bcom_accounting_days31_35_expansion.test.ts</code></td>
      </tr>
      <tr>
        <td><strong>Block 74</strong></td>
        <td>B.Com Finance & Capital Markets</td>
        <td><code>content/courses/financenow.md</code>, <code>content/courses/quantnow.md</code></td>
        <td>Financial DCF & CAPM ratio calculation tests</td>
      </tr>
      <tr>
        <td><strong>Block 75</strong></td>
        <td>B.Com Marketing & E-Commerce</td>
        <td><code>content/courses/marketingnow.md</code>, <code>digitalmarketingnow.md</code></td>
        <td>Verify CAC/LTV attribution models & visual specs</td>
      </tr>
      <tr>
        <td><strong>Block 76</strong></td>
        <td>Entrepreneurship & Sales CRM</td>
        <td><code>content/courses/entrepreneurshipnow.md</code>, <code>salescrmnow.md</code></td>
        <td>Cap table dilution & pipeline stage calculations</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Multi-Agent Concurrency & Branch Isolation</h2>
  <div class="alert-box alert-warning">
    <strong>🛡️ BRANCH B BOUNDARY RULES:</strong><br>
    • Operate strictly inside worktree <code>C:\Users\Admin\Desktop\projects\Present-Career-os-commerce</code> on branch <code>agent/branch-b-curriculum-commerce-iot</code>.<br>
    • Do NOT touch Technical Launchpad files (<code>src/lib/data/{compFund,excelViz,gitVcs}*</code>) or Institutional Portals.<br>
    • Log completed tasks in <code>C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv</code> within task range <code>TASK-751</code> to <code>TASK-850</code>.<br>
    • Record 5-day block word counts, game tests, and commit SHAs in <code>PROJECT_MEMORY.md</code>.
  </div>

</body>
</html>
`;

(async () => {
  const htmlPath = path.join(DOCS_DIR, 'PINIT_BRANCH_B_DIRECTIVE.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('HTML written to:', htmlPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  const destPdfDocs = path.join(DOCS_DIR, 'PINIT_BRANCH_B_DIRECTIVE.pdf');
  const destPdfDesktop = path.join(DESKTOP_DIR, 'PINIT_BRANCH_B_DIRECTIVE.pdf');

  await page.pdf({
    path: destPdfDocs,
    format: 'A4',
    margin: { top: '10mm', right: '12mm', bottom: '10mm', left: '12mm' },
    printBackground: true
  });
  console.log('PDF 3 created in docs/directives:', destPdfDocs);

  fs.copyFileSync(destPdfDocs, destPdfDesktop);
  console.log('PDF 3 mirrored to Desktop:', destPdfDesktop);

  await browser.close();
})();
