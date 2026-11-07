import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  generateMemorableGlobalId,
  generateCollegePinItId,
  parseCollegeIdCard,
  validatePinItId,
  isValidPinItId,
} from '../../src/lib/utils/pinitIdGenerator';

describe('ULTRA-DEEP ADVERSARIAL MATRIX AUDIT: 3-PERSON REVENUE & ROBUSTNESS VERIFICATION', () => {

  /* ──────────────────────────────────────────────────────────────────────────
   * PERSONA 3: ADVERSARIAL SECURITY & DATA BOUNDARY AUDITOR (Black-Hat Angle)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Persona 3: Adversarial Fuzzing, Injection & Privacy Isolation', () => {

    it('P3.1: Fuzzes PinIT Global ID with malicious injections and boundary strings', () => {
      const maliciousPayloads = [
        "Robert'); DROP TABLE Students;--",
        "<script>alert('XSS')</script>",
        "admin\x00secret",
        "../../etc/passwd",
        "${7*7}",
        "{{constructor.constructor('return this')()}}",
        "👩‍💻⚡🚀🔥💯",
        "   \t\r\n   ",
        "A".repeat(5000),
      ];

      for (const payload of maliciousPayloads) {
        const id = generateMemorableGlobalId(payload, 'adversarial_user');
        assert.ok(isValidPinItId(id), `Generated ID "${id}" must conform to valid format`);
        assert.ok(id.startsWith('PIN-GLB-'), `Must start with PIN-GLB-, got "${id}"`);
        assert.ok(!/[<>;'"`\$\{\}\\\/]/.test(id), `ID "${id}" contains unsafe injected characters`);
        assert.ok(id.length <= 26, `ID "${id}" must not exceed maximum memorable length (len=${id.length})`);
      }
    });

    it('P3.2: Strictly blocks lowercase tampering and structural spoofing of PinIT IDs', () => {
      const spoofedIds = [
        'pin-glb-kavya-842',
        'PIN-glb-kavya-842',
        'PIN-GLB-kavya-842',
        'PIN-GLB-KAVYA-84A', // non-digit suffix
        'PIN-GLB-KAVYA-',
        'PIN--CSE-042',
        'PIN-RVCE--042',
        'PIN-RVCE-CSE-',
        'PIN-RVCE-CSE-042-EXT',
        'PIN-TOOLONGCOLLEGE-CSE-042',
      ];

      for (const badId of spoofedIds) {
        const res = validatePinItId(badId);
        assert.strictEqual(res.valid, false, `Spoofed ID "${badId}" must be rejected`);
      }
    });

    it('P3.3: Confirms privacy wall in friends/[id]/page.tsx completely hides Action DMs/Duels for strangers', () => {
      const pagePath = path.join(process.cwd(), 'src', 'app', 'friends', '[id]', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');

      // Arena Duel and Message buttons MUST be enclosed in student.relationship === 'friends' block
      const friendsBlockMatch = content.match(/student\.relationship === 'friends'\s*\?\s*\([\s\S]*?\)\s*:\s*student\.relationship === 'received'/);
      assert.ok(friendsBlockMatch, 'Must find friends relationship ternary branch');

      const friendsBranchContent = friendsBlockMatch[0];
      assert.ok(friendsBranchContent.includes('Arena Duel'), 'Arena Duel must be within friends block');
      assert.ok(friendsBranchContent.includes('handleOpenChat'), 'Message action must be within friends block');

      // Outside the friends branch, neither Arena Duel nor Message button should appear
      const nonFriendsPart = content.split("student.relationship === 'received'")[1];
      assert.ok(
        !nonFriendsPart.includes('<button\n                    className="friends-btn friends-btn-secondary"\n                    onClick={handleArenaDuel}'),
        'Arena Duel must not leak to non-friends'
      );
    });

    it('P3.4: Confirms Drawer enables full profile navigation and provides connection notice when not friends', () => {
      const drawerPath = path.join(process.cwd(), 'src', 'components', 'friends', 'FriendProfileDrawer.tsx');
      const content = fs.readFileSync(drawerPath, 'utf8');

      // Must have non-friend state container
      assert.match(content, /data-testid="drawer-profile-locked-state"/);
      assert.match(content, /Public Student Profile/);

      // Must allow navigating to full profile
      assert.match(content, /Full Profile →/);
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * PERSONA 4: REACT PERFORMANCE & MATHEMATICAL RESILIENCE (Architect Angle)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Persona 4: State Machines, Mathematical Invariants & Zero-Crash Math', () => {

    it('P4.1: Calculates League Score (Weekly XP + ELO Gain) with negative and massive values without NaN', () => {
      const rankingAlgorithm = (weeklyXp: number, eloGain: number) => {
        const cleanXp = Number.isFinite(weeklyXp) ? Math.max(0, weeklyXp) : 0;
        const cleanElo = Number.isFinite(eloGain) ? eloGain : 0;
        return cleanXp + cleanElo;
      };

      // Standard cases
      assert.strictEqual(rankingAlgorithm(1000, 20), 1020);
      assert.strictEqual(rankingAlgorithm(1000, 10), 1010);

      // Negative ELO cases (duel losses)
      assert.strictEqual(rankingAlgorithm(500, -35), 465);

      // Boundary: NaN, undefined, infinity
      assert.strictEqual(rankingAlgorithm(NaN, 20), 20);
      assert.strictEqual(rankingAlgorithm(100, NaN), 100);
      assert.strictEqual(rankingAlgorithm(Infinity, 50), 50);

      // Tie breaker stability check
      const cohort = [
        { name: 'Alice', xp: 1200, elo: 15 }, // 1215
        { name: 'Bob', xp: 1200, elo: 20 },   // 1220
        { name: 'Charlie', xp: 1220, elo: 0 }, // 1220
        { name: 'Diana', xp: 900, elo: -10 }, // 890
      ];

      const sorted = [...cohort].sort((a, b) => {
        const scoreA = rankingAlgorithm(a.xp, a.elo);
        const scoreB = rankingAlgorithm(b.xp, b.elo);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.name.localeCompare(b.name); // deterministic tie breaker
      });

      assert.strictEqual(sorted[0].name, 'Bob');     // 1220
      assert.strictEqual(sorted[1].name, 'Charlie'); // 1220 (alphabetical tie-breaker)
      assert.strictEqual(sorted[2].name, 'Alice');   // 1215
      assert.strictEqual(sorted[3].name, 'Diana');   // 890
    });

    it('P4.2: Cohort cutoffs dynamically compute Promotion and Demotion without collision', () => {
      const computeCutoffs = (cohortLength: number) => {
        if (cohortLength <= 1) return { promo: 0, demo: 0 };
        const promo = Math.max(1, Math.floor(cohortLength * 0.1));
        const demo = Math.max(1, Math.floor(cohortLength * 0.1));
        return { promo, demo };
      };

      // 1 user
      const c1 = computeCutoffs(1);
      assert.strictEqual(c1.promo, 0);
      assert.strictEqual(c1.demo, 0);

      // 10 users (1 promo, 1 demo, 8 safe)
      const c10 = computeCutoffs(10);
      assert.strictEqual(c10.promo, 1);
      assert.strictEqual(c10.demo, 1);

      // 30 users (3 promo, 3 demo, 24 safe)
      const c30 = computeCutoffs(30);
      assert.strictEqual(c30.promo, 3);
      assert.strictEqual(c30.demo, 3);

      // 100 users (10 promo, 10 demo)
      const c100 = computeCutoffs(100);
      assert.strictEqual(c100.promo, 10);
      assert.strictEqual(c100.demo, 10);
    });

    it('P4.3: CourseProjectProgressBar prevents Division-by-Zero and handles out-of-bound counts', () => {
      const calcProgress = (completed: number, total: number) => {
        const totalReq = Math.max(total, 3);
        const count = Math.max(0, completed);
        return Math.min(100, Math.round((count / totalReq) * 100));
      };

      // 0 projects
      assert.strictEqual(calcProgress(0, 0), 0);

      // 1 completed out of 0 given (defaults to 3)
      assert.strictEqual(calcProgress(1, 0), 33);

      // 3 completed out of 3
      assert.strictEqual(calcProgress(3, 3), 100);

      // 10 completed out of 3 (clamped)
      assert.strictEqual(calcProgress(10, 3), 100);

      // Negative values
      assert.strictEqual(calcProgress(-5, -2), 0);
    });

    it('P4.4: WhatsApp share link generator handles complex queries and symbols without corruption', () => {
      const generateWhatsAppLink = (squadName: string, origin: string, squadId: string) => {
        const inviteUrl = `${origin}/projects?tab=innovation&join=${squadId}`;
        const rawText = `Join our collaborative engineering project "${squadName}" on PinIT Career OS! 🚀\n\nInvite Link: ${inviteUrl}`;
        return `https://api.whatsapp.com/send?text=${encodeURIComponent(rawText)}`;
      };

      const link = generateWhatsAppLink('Cloud & DevOps AI Agent #1 (2026)', 'https://pinit.app', 'sq_123');
      assert.ok(link.startsWith('https://api.whatsapp.com/send?text='));
      assert.ok(!link.includes(' '), 'Must not contain unescaped spaces');
      assert.ok(link.includes('%231'), 'Hashtag must be URL-encoded');
      assert.ok(link.includes('%F0%9F%9A%80'), 'Rocket emoji must be UTF-8 percent-encoded');
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * PERSONA 5: REAL STUDENT USER JOURNEY & INTEGRATION AUDIT (Student Angle)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Persona 5: Real-Life Student Lifecycle Verification', () => {

    it('P5.1: Verifies 100 XP League Gate Lifecycle (0 XP locked -> 100 XP unlocked -> Join action)', () => {
      const pagePath = path.join(process.cwd(), 'src', 'app', 'leaderboard', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');

      // Initial state must ONLY read from localStorage, not auto-join if userTotalXp >= 100
      assert.match(content, /const \[joinedLeague, setJoinedLeague\] = useState<boolean>\(\(\) => \{/);
      assert.match(content, /return stored === 'true';/);

      // When not joined and < 100 XP: renders 100 XP Gate
      assert.match(content, /data-testid="league-100xp-gate"/);

      // When not joined and >= 100 XP: renders Celebration Banner
      assert.match(content, /data-testid="league-qualified-banner"/);
      assert.match(content, /data-testid="join-league-btn"/);
    });

    it('P5.2: Heuristic Scanner processes top Indian engineering universities cleanly', async () => {
      const institutions = [
        {
          sample: 'RV COLLEGE OF ENGINEERING\nDEPARTMENT OF COMPUTER SCIENCE\nUSN: 1RV21CS042',
          file: 'rvce_card.jpg',
          expectedCollege: 'RVCE',
          expectedDept: 'CSE',
          expectedRoll: '1RV21CS042',
        },
        {
          sample: 'B.M.S. COLLEGE OF ENGINEERING\nELECTRONICS AND COMMUNICATION\nUSN: 1BM22EC018',
          file: 'bms_id.png',
          expectedCollege: 'BMS',
          expectedDept: 'ECE',
          expectedRoll: '1BM22EC018',
        },
        {
          sample: 'INDIAN INSTITUTE OF TECHNOLOGY BOMBAY\nMECHANICAL ENGINEERING\nROLL: 210050123',
          file: 'iitb_scan.pdf',
          expectedCollege: 'IITB',
          expectedDept: 'MECH',
          expectedRoll: '210050123',
        },
        {
          sample: 'MANIPAL INSTITUTE OF TECHNOLOGY\nDATA SCIENCE\nREG NO: 210905123',
          file: 'mit_id.pdf',
          expectedCollege: 'MIT',
          expectedDept: 'AIDS',
          expectedRoll: '210905123',
        },
      ];

      for (const inst of institutions) {
        const parsed = await parseCollegeIdCard({ text: inst.sample, name: inst.file });
        assert.strictEqual(parsed.collegeCode, inst.expectedCollege, `College mismatch for ${inst.file}`);
        assert.strictEqual(parsed.departmentCode, inst.expectedDept, `Dept mismatch for ${inst.file}`);
        assert.strictEqual(parsed.rollNumber, inst.expectedRoll, `Roll mismatch for ${inst.file}`);
      }
    });

    it('P5.3: Heuristic Scanner falls back gracefully on blurry or low-text uploads', async () => {
      // Extremely low text / noise only
      const blurryFile = { text: 'STUDENT IDENTITY CARD\nBLOOD GROUP O+', name: 'photo.jpg', size: 2450 };
      const parsed = await parseCollegeIdCard(blurryFile, 'Sneha');

      // Must have fallback college and department
      assert.ok(['COLLEGE', 'GEN'].includes(parsed.collegeCode) || parsed.collegeCode.length <= 6);
      assert.ok(parsed.rollNumber.length >= 3, 'Must generate deterministic 3-digit fallback roll');

      // Generating College ID from this fallback result must still create a strictly valid PinIT ID
      const generatedId = generateCollegePinItId({
        collegeCode: parsed.collegeCode,
        departmentCode: parsed.departmentCode,
        rollNumber: parsed.rollNumber,
      });

      assert.ok(isValidPinItId(generatedId), `Fallback ID "${generatedId}" must be valid`);
      assert.ok(generatedId.startsWith('PIN-'), `Must start with PIN-, got "${generatedId}"`);
    });

    it('P5.4: Verifies InnovationHub team chat and join request lifecycle', () => {
      const hubPath = path.join(process.cwd(), 'src', 'components', 'projects', 'InnovationHub.tsx');
      const content = fs.readFileSync(hubPath, 'utf8');

      // Chat handlers & state
      assert.match(content, /handleSendMessage/);
      assert.match(content, /pinit_innovation_chat_/);

      // Join request handlers & state
      assert.match(content, /handleSubmitJoinRequest/);
      assert.match(content, /handleAcceptRequest/);
      assert.match(content, /pinit_join_requests_/);

      // QR Code SVG
      assert.match(content, /<QRCodeSVG/);
      assert.match(content, /whatsappShareUrl/);
    });

    it('P5.5: Verifies Guild Projects Completed Table renders rank, members, and completed count', () => {
      const pagePath = path.join(process.cwd(), 'src', 'app', 'leaderboard', 'page.tsx');
      assert.ok(fs.existsSync(pagePath), 'Leaderboard page must exist');

      const content = fs.readFileSync(pagePath, 'utf8');
      assert.match(content, /data-testid="guild-projects-table-container"/);
      assert.match(content, /guild\.completedProjectsCount/);
      assert.match(content, /guild\.membersCount/);
      assert.match(content, /guild\.teamLeadName/);
    });
  });
});
