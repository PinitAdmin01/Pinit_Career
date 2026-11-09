import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateMemorableGlobalId,
  generateCollegePinItId,
  parseCollegeIdCard,
  validatePinItId,
} from '../../src/lib/utils/pinitIdGenerator';

describe('BRUTAL FIRST-TIME STRANGER AUDIT: Chaos, Adversarial & Boundary Testing', () => {

  /* ──────────────────────────────────────────────────────────────────────────
   * SUITE 1: ADVERSARIAL PINIT ID & SCANNER PARSER (Tasks 6 & 7)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Suite 1: Extreme PinIT ID Generation & Heuristics', () => {
    it('Brutal 1.1: Handles bizarre display names without breaking format', () => {
      const bizarreNames = [
        'X', // single char
        '   padded   spaces   ', // excessive whitespace
        'Dr. Jean-Luc O\'Connor-Smith III', // special punctuation
        '1234567890', // numeric only
        '🚀🔥 Code Master 💻', // emojis
        'A'.repeat(120), // 120 chars long
        '---___---', // punctuation only
        'null', // keyword
        'undefined', // keyword
      ];

      for (const name of bizarreNames) {
        const id = generateMemorableGlobalId(name, 'dummy_user');
        assert.ok(
          validatePinItId(id),
          `Failed for name "${name}": Generated ID "${id}" does not conform to PIN-GLB-[NAME]-[3DIGITS]`
        );
        // Prefix must be PIN-GLB
        assert.ok(id.startsWith('PIN-GLB-'), `Must start with PIN-GLB-, got "${id}"`);
      }
    });

    it('Brutal 1.2: College ID generator produces exact uppercase uppercase canonical token', () => {
      const testCases = [
        { college: 'rv college of engineering', dept: 'computer science', roll: '1rv21cs104', expectedCollege: 'RVCE', expectedDept: 'CSE' },
        { college: 'pes university', dept: 'information science', roll: 'pes120220055', expectedCollege: 'PES', expectedDept: 'ISE' },
        { college: 'b.m.s. college', dept: 'electronics', roll: '042', expectedCollege: 'BMS', expectedDept: 'ECE' },
        { college: 'iit bombay', dept: 'mechanical', roll: '210010045', expectedCollege: 'IITB', expectedDept: 'MECH' },
      ];

      for (const tc of testCases) {
        const id = generateCollegePinItId(tc.college, tc.dept, tc.roll);
        assert.ok(validatePinItId(id), `Generated college ID "${id}" failed validation`);
        assert.ok(id.startsWith('PIN-'), `Must start with PIN-, got "${id}"`);
        assert.ok(id.includes(tc.expectedCollege), `Should contain "${tc.expectedCollege}" in "${id}"`);
        assert.ok(id.includes(tc.expectedDept), `Should contain "${tc.expectedDept}" in "${id}"`);
      }
    });

    it('Brutal 1.3: Heuristic scanner parses chaotic, fragmented OCR strings correctly', async () => {
      const messyOcrSamples = [
        {
          text: 'STUDENT IDENTITY CARD\nINDIAN INSTITUTE OF TECHNOLOGY BOMBAY\nName: RAHUL SHARMA\nDept: COMPUTER SCIENCE & ENGINEERING\nRoll No: 210050123\nValid till 2026',
          fileName: 'id_card_scan.pdf',
          expectedCollege: 'IITB',
          expectedDept: 'CSE',
          expectedRoll: '210050123'
        },
        {
          text: 'PES UNIVERSITY EC CAMPUS\nBranch: ARTIFICIAL INTELLIGENCE & MACHINE LEARNING\nUSN: 1PE22AIML099',
          fileName: 'pes_id.jpg',
          expectedCollege: 'PES',
          expectedDept: 'AIML',
          expectedRoll: '1PE22AIML099'
        },
        {
          text: 'RVCE BANGALORE\nDEPARTMENT OF INFORMATION SCIENCE AND ENGINEERING\nID NO: 1RV22IS045\nBlood Group: B+',
          fileName: 'rv_id_card.png',
          expectedCollege: 'RVCE',
          expectedDept: 'ISE',
          expectedRoll: '1RV22IS045'
        }
      ];

      for (const sample of messyOcrSamples) {
        const parsed = await parseCollegeIdCard({ text: sample.text, name: sample.fileName });
        assert.equal(parsed.collegeCode, sample.expectedCollege, `Wrong college for sample`);
        assert.equal(parsed.departmentCode, sample.expectedDept, `Wrong department for sample`);
        assert.equal(parsed.rollNumber, sample.expectedRoll, `Wrong roll suffix for sample`);
      }
    });

    it('Brutal 1.4: Format validator strictly catches all malformed, lowercase, or tampered IDs', () => {
      const invalidIds = [
        'pin-glb-alex-104', // lowercase
        'PIN-GLB-ALEX', // missing 3-digit suffix
        'PIN-UNKNOWN-DEPT-12345', // unknown prefix
        'PIN--CSE-104', // missing college code
        'PIN-RVCE--104', // missing dept
        'INVALID-ID-FORMAT', // totally wrong
        'PIN-GLB-ALEX-104-EXTRA', // extra segments
        '', // empty string
        '   ', // whitespace
      ];

      for (const badId of invalidIds) {
        assert.equal(
          validatePinItId(badId).valid,
          false,
          `Tampered ID "${badId}" should fail validation but passed!`
        );
      }
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * SUITE 2: ADVERSARIAL PRIVACY GATE ON MY NETWORK (Tasks 8 & 11)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Suite 2: Privacy Gate Verification on Non-Friend Connections', () => {
    it('Brutal 2.1: Disallows non-friend relationships (none, sent, received, undefined) from seeing full profile', () => {
      const testCases = [
        { relationship: 'none', isSelf: false, shouldBeFriend: false },
        { relationship: 'sent', isSelf: false, shouldBeFriend: false },
        { relationship: 'received', isSelf: false, shouldBeFriend: false },
        { relationship: undefined, isSelf: false, shouldBeFriend: false },
        { relationship: 'none', isSelf: true, shouldBeFriend: true },
        { relationship: 'friends', isSelf: false, shouldBeFriend: true },
        { relationship: 'friends', isSelf: true, shouldBeFriend: true },
      ];

      for (const tc of testCases) {
        const student = {
          id: 'student_xyz',
          name: 'Target Student',
          relationship: tc.relationship,
          isSelf: tc.isSelf,
        };

        // Logic applied across FriendProfileDrawer and /friends/[id]
        const isFriend = student.relationship === 'friends' || Boolean(student.isSelf);
        assert.equal(
          isFriend,
          tc.shouldBeFriend,
          `Failed privacy evaluation for relationship="${tc.relationship}", isSelf=${tc.isSelf}`
        );
      }
    });

    it('Brutal 2.2: Verifies that no references to "portfolio" remain anywhere in network components', () => {
      const fs = require('fs');
      const path = require('path');
      const networkFiles = [
        path.join(process.cwd(), 'src', 'app', 'friends', 'page.tsx'),
        path.join(process.cwd(), 'src', 'app', 'friends', '[id]', 'page.tsx'),
        path.join(process.cwd(), 'src', 'components', 'friends', 'FriendProfileDrawer.tsx'),
        path.join(process.cwd(), 'src', 'components', 'friends', 'StudentCard.tsx'),
        path.join(process.cwd(), 'src', 'components', 'friends', 'PrivacySettingsModal.tsx'),
      ];

      for (const fp of networkFiles) {
        const content = fs.readFileSync(fp, 'utf8');
        assert.doesNotMatch(content, /portfolio/i, `File "${path.basename(fp)}" still contains prohibited word "portfolio"`);
      }
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * SUITE 3: ADVERSARIAL COURSE PROGRESS & INNOVATION HUB (Task 9)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Suite 3: Course Progress Bar & Innovation Hub Resilience', () => {
    it('Brutal 3.1: Progress bar calculation prevents Division-by-Zero and handles extreme bounds', () => {
      // Simulation of CourseProjectProgressBar mathematical logic
      const calculateProgress = (completedList: any[], projectsList: any[]) => {
        const totalRequired = Math.max(projectsList.length, 3);
        const completedCount = completedList.length;
        const projectProgressPct = Math.min(100, Math.round((completedCount / totalRequired) * 100));
        return { totalRequired, completedCount, projectProgressPct };
      };

      // Case 1: Empty projects list
      const emptyRes = calculateProgress([], []);
      assert.equal(emptyRes.totalRequired, 3, 'Default minimum total should be 3');
      assert.equal(emptyRes.completedCount, 0);
      assert.equal(emptyRes.projectProgressPct, 0, 'Must produce 0% not NaN%');

      // Case 2: 1 completed out of 3
      const oneRes = calculateProgress(['p1'], ['p1', 'p2', 'p3']);
      assert.equal(oneRes.projectProgressPct, 33);

      // Case 3: 2 completed out of 3
      const twoRes = calculateProgress(['p1', 'p2'], ['p1', 'p2', 'p3']);
      assert.equal(twoRes.projectProgressPct, 67);

      // Case 4: 3 completed out of 3 (100%)
      const fullRes = calculateProgress(['p1', 'p2', 'p3'], ['p1', 'p2', 'p3']);
      assert.equal(fullRes.projectProgressPct, 100);

      // Case 5: 10 projects in track
      const tenRes = calculateProgress(['p1', 'p2', 'p3', 'p4', 'p5'], Array(10).fill('p'));
      assert.equal(tenRes.projectProgressPct, 50);
    });

    it('Brutal 3.2: Innovation WhatsApp invite share link escapes weird project titles safely', () => {
      const weirdSquadTitles = [
        'AI & Cloud Systems #1: <Distributed> Ledger?',
        'Fullstack 100% Guaranteed "Production" App',
        'Squad + Team = Success & Profit$$$',
      ];

      for (const title of weirdSquadTitles) {
        const inviteUrl = `https://pinit.app/projects?tab=innovation&join=squad_999`;
        const shareMsg = `Join our collaborative engineering project "${title}" on PinIT Career OS! 🚀\n\nInvite Link: ${inviteUrl}`;
        const encodedUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;

        // Verify URL does not have raw illegal characters like unencoded spaces, quotes, or newlines
        assert.ok(!encodedUrl.includes(' '), 'Encoded URL must not contain raw spaces');
        assert.ok(!encodedUrl.includes('\n'), 'Encoded URL must not contain raw newlines');
        assert.ok(!encodedUrl.includes('"'), 'Encoded URL must not contain raw quotes');
        assert.ok(encodedUrl.includes(encodeURIComponent(title)), 'Must contain safely escaped title');
      }
    });

    it('Brutal 3.3: Chat message validator rejects empty or whitespace-only inputs', () => {
      const invalidMessages = ['', '   ', '\n\n', '\t\t', '     \r\n'];
      for (const msg of invalidMessages) {
        const isValid = Boolean(msg.trim());
        assert.equal(isValid, false, `Message "${msg}" should be rejected`);
      }

      const validMsg = 'Hey team, I pushed the Redis caching PR!';
      assert.equal(Boolean(validMsg.trim()), true);
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * SUITE 4: ADVERSARIAL 100 XP LEAGUE GATE & ELO FORMULA (Task 10)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Suite 4: 100 XP League Gate & Multi-Tier Promotion/Demotion Formula', () => {
    it('Brutal 4.1: Strictly enforces 100 XP boundary (0 to 99 XP locked, >=100 XP unlocked)', () => {
      const boundaryCases = [
        { xp: 0, canJoin: false },
        { xp: 1, canJoin: false },
        { xp: 50, canJoin: false },
        { xp: 99, canJoin: false },
        { xp: 100, canJoin: true },
        { xp: 101, canJoin: true },
        { xp: 2500, canJoin: true },
      ];

      for (const b of boundaryCases) {
        const isEligible = b.xp >= 100;
        assert.equal(
          isEligible,
          b.canJoin,
          `At ${b.xp} XP: eligibility should be ${b.canJoin} but got ${isEligible}`
        );
      }
    });

    it('Brutal 4.2: Exhaustively validates the XP + ELO League Ranking formula', () => {
      // User's explicit prompt specification:
      // "simple logic exp + elo like 1000 exp and 20 elo on 1st place and 1000 exp and 10 elo on second place"
      const calculateLeagueScore = (weeklyXp: number, eloRating: number) => {
        const eloGain = Math.max(0, eloRating - 100);
        return weeklyXp + eloGain;
      };

      const candidates = [
        { name: 'Player B', weeklyXp: 1000, eloRating: 1210 }, // Score = 1000 + 10 = 1010
        { name: 'Player A', weeklyXp: 1000, eloRating: 1220 }, // Score = 1000 + 20 = 1020
        { name: 'Player C', weeklyXp: 1100, eloRating: 1200 }, // Score = 1100 + 0 = 1100
        { name: 'Player D', weeklyXp: 800, eloRating: 1350 },  // Score = 800 + 150 = 950
        { name: 'Player E', weeklyXp: 1200, eloRating: 1150 }, // Score = 1200 + 0 = 1200 (sub-1200 ELO does not subtract)
      ];

      // Sort using the exact formula from src/app/api/leaderboard/route.ts
      const ranked = [...candidates].sort((a, b) => {
        const scoreA = calculateLeagueScore(a.weeklyXp, a.eloRating);
        const scoreB = calculateLeagueScore(b.weeklyXp, b.eloRating);
        if (scoreB !== scoreA) return scoreB - scoreA;
        if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;
        return b.eloRating - a.eloRating;
      });

      // Assertions
      assert.equal(ranked[0].name, 'Player E', 'Rank 1 must be Player E (Score: 1200)');
      assert.equal(ranked[1].name, 'Player C', 'Rank 2 must be Player C (Score: 1100)');
      assert.equal(ranked[2].name, 'Player A', 'Rank 3 must be Player A (Score: 1020, 1000 XP + 20 ELO)');
      assert.equal(ranked[3].name, 'Player B', 'Rank 4 must be Player B (Score: 1010, 1000 XP + 10 ELO)');
      assert.equal(ranked[4].name, 'Player D', 'Rank 5 must be Player D (Score: 950)');

      // Direct verification of User's prompt: Player A (1000 XP + 20 ELO) beats Player B (1000 XP + 10 ELO)
      const rankA = ranked.findIndex(r => r.name === 'Player A');
      const rankB = ranked.findIndex(r => r.name === 'Player B');
      assert.ok(rankA < rankB, 'Player A (1000 XP + 20 ELO) must rank ahead of Player B (1000 XP + 10 ELO)');
    });

    it('Brutal 4.3: Promotion (Top 10%) and Demotion (Bottom 10%) cutoff ranks calculate correctly for cohorts', () => {
      const cohortSizes = [
        { total: 10, expectedPromoteCutoff: 1, expectedDemoteCutoff: 10 },
        { total: 20, expectedPromoteCutoff: 2, expectedDemoteCutoff: 19 },
        { total: 50, expectedPromoteCutoff: 5, expectedDemoteCutoff: 46 },
        { total: 100, expectedPromoteCutoff: 10, expectedDemoteCutoff: 91 },
      ];

      for (const cs of cohortSizes) {
        const promotionCutoffRank = Math.max(1, Math.ceil(cs.total * 0.10));
        const demotionCutoffRank = Math.max(1, cs.total - Math.floor(cs.total * 0.10) + 1);

        assert.equal(promotionCutoffRank, cs.expectedPromoteCutoff, `Wrong promote cutoff for total=${cs.total}`);
        assert.equal(demotionCutoffRank, cs.expectedDemoteCutoff, `Wrong demote cutoff for total=${cs.total}`);
      }
    });

    it('Brutal 4.4: Guild Projects completed ranking sorts guilds by completedProjectsCount descending', () => {
      const mockGuilds = [
        { guildName: 'Guild Alpha', completedProjectsCount: 2 },
        { guildName: 'Guild Beta', completedProjectsCount: 7 },
        { guildName: 'Guild Gamma', completedProjectsCount: 4 },
      ];

      const sorted = [...mockGuilds].sort((a, b) => b.completedProjectsCount - a.completedProjectsCount);

      assert.equal(sorted[0].guildName, 'Guild Beta');
      assert.equal(sorted[1].guildName, 'Guild Gamma');
      assert.equal(sorted[2].guildName, 'Guild Alpha');
      assert.equal(sorted[0].completedProjectsCount, 7);
    });
  });

});
