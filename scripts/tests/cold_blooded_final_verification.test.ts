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

describe('COLD-BLOODED FINAL VERIFICATION SUITE: Zero-Defect System Lockdown', () => {
  const root = process.cwd();

  /* ──────────────────────────────────────────────────────────────────────────
   * SECTION 1: TASKS 6 & 7 (PinIT ID & College ID Scanner)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Section 1: PinIT ID & Scanner Rigor', () => {
    it('CB-1.1: Format validator strictly distinguishes Global vs College IDs and rejects all tampered forms', () => {
      // Valid Global
      const g1 = validatePinItId('PIN-GLB-VINAY-842');
      assert.strictEqual(g1.valid, true);
      assert.strictEqual(g1.type, 'global');

      const g2 = validatePinItId('PIN-GLB-ANANYA-1099');
      assert.strictEqual(g2.valid, true);
      assert.strictEqual(g2.type, 'global');

      // Valid College
      const c1 = validatePinItId('PIN-RVCE-CSE-042');
      assert.strictEqual(c1.valid, true);
      assert.strictEqual(c1.type, 'college');

      const c2 = validatePinItId('PIN-IITB-EE-104');
      assert.strictEqual(c2.valid, true);
      assert.strictEqual(c2.type, 'college');

      // Malformed / Tampered IDs that MUST fail
      const badCases = [
        'PIN-GLB-KAVYA-84A', // non-digit suffix in global
        'pin-glb-vinay-842', // lowercase
        'PIN-glb-vinay-842',
        'PIN-GLB-VINAY', // missing suffix
        'PIN--CSE-042', // missing college
        'PIN-RVCE--042', // missing dept
        'PIN-RVCE-CSE-', // missing roll
        'INVALID-ID-PATTERN',
        '',
        '   ',
      ];

      for (const bad of badCases) {
        assert.strictEqual(isValidPinItId(bad), false, `Should reject "${bad}"`);
      }
    });

    it('CB-1.2: Heuristic scanner handles OCR text and builds valid PinIT ID for real Indian institutions', async () => {
      const cards = [
        {
          text: 'R.V. COLLEGE OF ENGINEERING\nDEPARTMENT OF COMPUTER SCIENCE\nUSN: 1RV21CS099',
          name: 'rvce.png',
          expectedCollege: 'RVCE',
          expectedDept: 'CSE',
          expectedRoll: '1RV21CS099',
        },
        {
          text: 'PES UNIVERSITY\nINFORMATION SCIENCE AND ENGINEERING\nUSN: PES120220055',
          name: 'pes.jpg',
          expectedCollege: 'PES',
          expectedDept: 'ISE',
          expectedRoll: 'PES120220055',
        },
        {
          text: 'BMS COLLEGE OF ENGINEERING\nMECHANICAL ENGINEERING\nROLL NO: 1BM22ME045',
          name: 'bms.pdf',
          expectedCollege: 'BMS',
          expectedDept: 'MECH',
          expectedRoll: '1BM22ME045',
        },
      ];

      for (const card of cards) {
        const parsed = await parseCollegeIdCard({ text: card.text, name: card.name });
        assert.strictEqual(parsed.collegeCode, card.expectedCollege);
        assert.strictEqual(parsed.departmentCode, card.expectedDept);
        assert.strictEqual(parsed.rollNumber, card.expectedRoll);

        const generated = generateCollegePinItId(parsed.collegeCode, parsed.departmentCode, parsed.rollNumber);
        assert.ok(isValidPinItId(generated));
        assert.ok(generated.startsWith(`PIN-${card.expectedCollege}-`));
      }
    });

    it('CB-1.3: CollegeIdScanner and SignupPage implement ref-guarded and useCallback handlers', () => {
      const scannerPath = path.join(root, 'src', 'components', 'auth', 'CollegeIdScanner.tsx');
      const signupPath = path.join(root, 'src', 'app', 'signup', 'page.tsx');

      const scannerContent = fs.readFileSync(scannerPath, 'utf8');
      const signupContent = fs.readFileSync(signupPath, 'utf8');

      // Scanner ref guard
      assert.match(scannerContent, /const onIdGeneratedRef = useRef\(onIdGenerated\);/);
      assert.match(scannerContent, /onIdGeneratedRef\.current\(gid, 'global'\);/);

      // Signup useCallback
      assert.match(signupContent, /const handleIdGenerated = useCallback\(/);
      assert.match(signupContent, /onIdGenerated=\{handleIdGenerated\}/);
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * SECTION 2: TASKS 8 & 11 (My Network & Mutual Connection Privacy Gate)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Section 2: My Network & Privacy Lockdown', () => {
    it('CB-2.1: Navigation, Shell, and Page titles display "My Network" and filter chips are purged', () => {
      const appShellPath = path.join(root, 'src', 'components', 'ui', 'AppShell.tsx');
      const friendsPagePath = path.join(root, 'src', 'app', 'friends', 'page.tsx');

      const shell = fs.readFileSync(appShellPath, 'utf8');
      const page = fs.readFileSync(friendsPagePath, 'utf8');

      assert.match(shell, /'\/friends':\s*'My Network'/);
      assert.match(page, /My\s*<span>Network<\/span>/);
      assert.match(page, /My Network\s*\{networkStats\.friendsCount/);

      // Filter chips removed
      assert.doesNotMatch(page, /className="friends-filters-row"/);
      assert.doesNotMatch(page, /ref-filter-chip/);
    });

    it('CB-2.2: Total absence of keyword "portfolio" across networking domain', () => {
      const targetDirs = [
        path.join(root, 'src', 'app', 'friends'),
        path.join(root, 'src', 'components', 'friends'),
      ];

      for (const dir of targetDirs) {
        const files = fs.readdirSync(dir, { recursive: true }) as string[];
        for (const file of files) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            assert.doesNotMatch(content, /\bportfolio\b/i, `Forbidden word "portfolio" found in ${fullPath}`);
          }
        }
      }
    });

    it('CB-2.3: Both FriendProfileDrawer and friends/[id] enforce mutual privacy gate against non-friends', () => {
      const drawerPath = path.join(root, 'src', 'components', 'friends', 'FriendProfileDrawer.tsx');
      const pagePath = path.join(root, 'src', 'app', 'friends', '[id]', 'page.tsx');

      const drawer = fs.readFileSync(drawerPath, 'utf8');
      const page = fs.readFileSync(pagePath, 'utf8');

      // Drawer
      assert.match(drawer, /data-testid="drawer-profile-locked-state"/);
      assert.match(drawer, /const isFriend = student\.relationship === 'friends' \|\| Boolean\(student\.isSelf\);/);

      // Page
      assert.match(page, /data-testid="page-profile-locked-state"/);
      assert.match(page, /isFriend = student \? \(student\.relationship === ['"]friends['"] \|\| Boolean\(student\.isSelf\)\) : false;/);

      // Action buttons: Arena Duel and Message are strictly gated
      assert.match(
        page,
        /student\.relationship === 'friends'[\s\S]*?handleArenaDuel[\s\S]*?handleOpenChat/,
        'Arena Duel and Message must be strictly inside connected friends block'
      );
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * SECTION 3: TASK 9 (Project Workspace & Innovation Hub)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Section 3: Project Workspace & Innovation Hub Division', () => {
    it('CB-3.1: Projects page divides into Workspace and Innovation Hub and supports URL tab deep-linking', () => {
      const pagePath = path.join(root, 'src', 'app', 'projects', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');

      assert.match(content, /mainTab === 'projects'/);
      assert.match(content, /mainTab === 'innovation'/);
      assert.match(content, /searchParams\?\.get\('tab'\) === 'innovation'/);
      assert.match(content, /<CourseProjectProgressBar/);
      assert.match(content, /<InnovationHub/);
    });

    it('CB-3.2: CourseProjectProgressBar renders progress bar and wires "+ Start Your Own Project"', () => {
      const compPath = path.join(root, 'src', 'components', 'projects', 'CourseProjectProgressBar.tsx');
      const content = fs.readFileSync(compPath, 'utf8');

      assert.match(content, /data-testid="course-project-progress-card"/);
      assert.match(content, /data-testid="course-progress-fill"/);
      assert.match(content, /data-testid="start-own-project-btn"/);
      assert.match(content, /\+ Start Your Own Project/);
    });

    it('CB-3.3: InnovationHub features WhatsApp share, QR code, Live Chat, Public Search, and Empty States', () => {
      const hubPath = path.join(root, 'src', 'components', 'projects', 'InnovationHub.tsx');
      const content = fs.readFileSync(hubPath, 'utf8');

      assert.match(content, /data-testid="innovation-hub-container"/);
      assert.match(content, /data-testid="public-project-search-input"/);
      assert.match(content, /data-testid="invite-friends-btn"/);
      assert.match(content, /<QRCodeSVG/);
      assert.match(content, /api\.whatsapp\.com\/send\?text=/);
      assert.match(content, /handleSendMessage/);
      assert.match(content, /handleSubmitJoinRequest/);
      assert.match(content, /handleAcceptRequest/);

      // Empty states
      assert.match(content, /No projects found matching that filter/);
      assert.match(content, /No Innovation Projects Yet/);
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
   * SECTION 4: TASK 10 (100 XP League Gate & Multi-Tier Leaderboards)
   * ────────────────────────────────────────────────────────────────────────── */
  describe('Section 4: 100 XP League Gate & Multi-Tier Leaderboard', () => {
    it('CB-4.1: Strictly enforces 100 XP Gate without premature auto-enrollment', () => {
      const pagePath = path.join(root, 'src', 'app', 'leaderboard', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');

      // State check
      assert.match(content, /const \[joinedLeague, setJoinedLeague\] = useState<boolean>\(\(\) => \{/);
      assert.match(content, /return stored === 'true';/);

      // Gate components
      assert.match(content, /data-testid="league-100xp-gate"/);
      assert.match(content, /data-testid="league-qualified-banner"/);
      assert.match(content, /data-testid="join-league-btn"/);
    });

    it('CB-4.2: Implements 4 Sub-Tabs with Guild Projects Table and XP + ELO Promotion Formula', () => {
      const pagePath = path.join(root, 'src', 'app', 'leaderboard', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');

      // 4 Sub-Tabs
      assert.match(content, /id:\s*'region_college',\s*icon:\s*'🏛️',\s*label:\s*'Region \/ College'/);
      assert.match(content, /id:\s*'global',\s*icon:\s*'🌐',\s*label:\s*'Global Leaderboard'/);
      assert.match(content, /id:\s*'guild_projects',\s*icon:\s*'🛡️',\s*label:\s*'Guild Projects'/);
      assert.match(content, /id:\s*'weekly_leagues',\s*icon:\s*'🏆',\s*label:\s*'League Promotion & Demotion'/);

      // Guild Projects Table
      assert.match(content, /data-testid="guild-projects-table-container"/);
      assert.match(content, /Guild \/ Engineering Squad/);
      assert.match(content, /guild\.completedProjectsCount/);

      // Cutoff lines
      assert.match(content, /Promotion Cutoff Line — Top 10% advance to higher league/);
      assert.match(content, /Demotion Cutoff Line — Bottom 10% demote to lower league/);
    });
  });
});
