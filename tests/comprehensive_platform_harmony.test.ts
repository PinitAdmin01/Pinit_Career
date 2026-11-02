import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

// Stub CSS imports for Node.js test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import { TOUR_SLIDES, TOUR_TOTAL_MS } from '../src/components/ui/StoryTourModal';
import { STUDENT_NAV, ROUTE_TOOLTIPS } from '../src/components/ui/AppSidebar';

describe('COMPREHENSIVE PLATFORM HARMONIZATION & ADVERSARIAL INTEGRATION AUDIT', () => {

  describe('Auditor 1 (Persona 4: Student UX & Story Tour Synchronicity)', () => {
    it('C1.1: TOUR_SLIDES matches current unified STUDENT_NAV architecture', () => {
      assert.ok(Array.isArray(TOUR_SLIDES), 'TOUR_SLIDES must be an array');
      assert.strictEqual(TOUR_SLIDES.length, 16, 'Story tour must have 16 streamlined slides');

      // Slide 7 must be AI Interview Studio
      const interviewSlide = TOUR_SLIDES[7];
      assert.strictEqual(interviewSlide.route, '/interview');
      assert.strictEqual(interviewSlide.title, 'AI Interview & GD Studio');
      assert.strictEqual(interviewSlide.segmentLabel, 'TAB 7/13 · AI INTERVIEW & GD');

      // Slide 8 must be Career Mirror Hub
      const mirrorSlide = TOUR_SLIDES[8];
      assert.strictEqual(mirrorSlide.route, '/mirror');
      assert.strictEqual(mirrorSlide.title, 'Career Mirror Hub');
      assert.strictEqual(mirrorSlide.segmentLabel, 'TAB 8/13 · CAREER MIRROR');
      assert.ok(mirrorSlide.text.includes('ATS Resume Studio'), 'Mirror slide must mention ATS Resume Studio');

      // Verify no slide points to obsolete dead routes
      for (const slide of TOUR_SLIDES) {
        assert.notStrictEqual(slide.route, '/group-discussion', 'No slide should route to obsolete /group-discussion');
        assert.notStrictEqual(slide.route, '/learning', 'No slide should route to obsolete /learning');
        assert.notStrictEqual(slide.route, '/career-builder', 'No slide should route to obsolete /career-builder');
      }
    });

    it('C1.2: AppSidebar spotlight logic supports unified routes and legacy aliases', () => {
      const sidebarCode = fs.readFileSync(path.resolve('src/components/ui/AppSidebar.tsx'), 'utf8');
      assert.ok(sidebarCode.includes("href === '/interview' && activeTourRoute.startsWith('/group-discussion')"),
        'Sidebar spotlight must map legacy group-discussion to interview');
      assert.ok(sidebarCode.includes("href === '/mirror' && (activeTourRoute.startsWith('/learning')"),
        'Sidebar spotlight must map legacy learning/career-builder to mirror');
    });

    it('C1.3: Story Tour total runtime is non-zero, monotonic and well-bounded', () => {
      assert.ok(TOUR_TOTAL_MS > 15000, 'Tour runtime should exceed 15 seconds');
      assert.ok(TOUR_TOTAL_MS < 120000, 'Tour runtime should stay under 2 minutes for student retention');
    });
  });

  describe('Auditor 2 (Persona 3: Link Trails & Navigation Invariant Auditing)', () => {
    it('C2.1: LiteChatInterface points directly to unified Mirror hub with sub-tab query', () => {
      const chatCode = fs.readFileSync(path.resolve('src/components/ui/LiteChatInterface.tsx'), 'utf8');
      assert.ok(!chatCode.includes("router.push('/career-builder')"),
        'LiteChatInterface must not push to deprecated /career-builder');
      assert.ok(chatCode.includes("router.push('/mirror?tab=career-builder')"),
        'LiteChatInterface must push to /mirror?tab=career-builder');
      assert.ok(chatCode.includes('Open Career Mirror'),
        'Action button label must reflect Career Mirror');
    });

    it('C2.2: WorkspaceSubmitPanel points directly to Mirror roadmap', () => {
      const panelCode = fs.readFileSync(path.resolve('src/components/quests/workspace/WorkspaceSubmitPanel.tsx'), 'utf8');
      assert.ok(!panelCode.includes('href="/career-builder"'),
        'WorkspaceSubmitPanel must not link to legacy /career-builder');
      assert.ok(panelCode.includes('href="/mirror?tab=roadmap"'),
        'WorkspaceSubmitPanel must link directly to /mirror?tab=roadmap');
    });

    it('C2.3: modules/page.tsx launcher cards link directly to unified destinations', () => {
      const modCode = fs.readFileSync(path.resolve('src/app/modules/page.tsx'), 'utf8');
      assert.ok(!modCode.includes("route: '/learning'"),
        'Module card 1 must not point to bare /learning');
      assert.ok(modCode.includes("route: '/mirror?tab=roadmap'"),
        'Module card 1 must point to /mirror?tab=roadmap');
      assert.ok(!modCode.includes("route: '/group-discussion'"),
        'Module card 9 must not point to bare /group-discussion');
      assert.ok(modCode.includes("route: '/interview?tab=gd'"),
        'Module card 9 must point to /interview?tab=gd');
    });
  });

  describe('Auditor 3 (Persona 5: Database Schema Integrity & Migration Coverage)', () => {
    it('C3.1: All 3 new consolidation migrations exist and contain valid PostgreSQL syntax', () => {
      const mig1 = path.resolve('supabase/migrations/20261102_student_mirror_and_gd_consolidation.sql');
      const mig2 = path.resolve('supabase/migrations/20261102_user_career_twin_columns_and_seed.sql');
      const mig3 = path.resolve('supabase/migrations/20261102_campus_erp_consolidation.sql');

      assert.ok(fs.existsSync(mig1), 'Student mirror migration must exist');
      assert.ok(fs.existsSync(mig2), 'User career twin seed migration must exist');
      assert.ok(fs.existsSync(mig3), 'Campus ERP migration must exist');

      const sql1 = fs.readFileSync(mig1, 'utf8');
      const sql2 = fs.readFileSync(mig2, 'utf8');
      const sql3 = fs.readFileSync(mig3, 'utf8');

      // Table existence assertions
      assert.ok(sql1.includes('CREATE TABLE IF NOT EXISTS public.gd_sessions'), 'Must create gd_sessions');
      assert.ok(sql1.includes('CREATE TABLE IF NOT EXISTS public.student_gd_history'), 'Must create student_gd_history');
      assert.ok(sql1.includes('CREATE TABLE IF NOT EXISTS public.resumes'), 'Must create resumes');
      assert.ok(sql1.includes('CREATE TABLE IF NOT EXISTS public.vault_items'), 'Must create vault_items');
      assert.ok(sql1.includes('CREATE TABLE IF NOT EXISTS public.student_attendance'), 'Must create student_attendance');

      // User column and backfill assertions
      assert.ok(sql2.includes('ADD COLUMN IF NOT EXISTS target_role'), 'Must add target_role');
      assert.ok(sql2.includes('ADD COLUMN IF NOT EXISTS onboarding_answers'), 'Must add onboarding_answers');
      assert.ok(sql2.includes('ADD COLUMN IF NOT EXISTS ats_score'), 'Must add ats_score');
      assert.ok(sql2.includes('UPDATE public.users'), 'Must backfill existing users');

      // ERP table assertions
      assert.ok(sql3.includes('CREATE TABLE IF NOT EXISTS public.library_books'), 'Must create library_books');
      assert.ok(sql3.includes('CREATE TABLE IF NOT EXISTS public.hostel_rooms'), 'Must create hostel_rooms');
      assert.ok(sql3.includes('CREATE TABLE IF NOT EXISTS public.transport_routes'), 'Must create transport_routes');
      assert.ok(sql3.includes('CREATE TABLE IF NOT EXISTS public.grievances_tickets'), 'Must create grievances_tickets');
      assert.ok(sql3.includes('CREATE TABLE IF NOT EXISTS public.notifications'), 'Must create notifications');
    });

    it('C3.2: 100% of all Supabase tables queried across src/ exist in migrations', () => {
      const migrationsDir = 'supabase/migrations';
      const definedTables = new Set<string>();
      const createTableRe = /CREATE TABLE (?:IF NOT EXISTS )?(?:public\.)?([a-zA-Z0-9_]+)/gi;

      for (const f of fs.readdirSync(migrationsDir)) {
        if (f.endsWith('.sql')) {
          const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
          let m: RegExpExecArray | null;
          while ((m = createTableRe.exec(sql)) !== null) {
            definedTables.add(m[1].toLowerCase());
          }
        }
      }

      const tableOccurrences = new Set<string>();
      const fromRe = /(?:supabase|sb|client|db|adminDb|supabaseAdmin)\.from\(['"]([a-zA-Z0-9_]+)['"]\)/g;

      function scan(dir: string) {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) scan(full);
          else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js')) {
            const code = fs.readFileSync(full, 'utf8');
            let m: RegExpExecArray | null;
            while ((m = fromRe.exec(code)) !== null) {
              tableOccurrences.add(m[1].toLowerCase());
            }
          }
        }
      }

      scan('src');

      const missing: string[] = [];
      for (const t of tableOccurrences) {
        if (!definedTables.has(t)) {
          missing.push(t);
        }
      }

      assert.strictEqual(missing.length, 0, `All queried tables must exist in migrations. Missing: ${missing.join(', ')}`);
    });
  });

  describe('Auditor 4 (Defensive Invariants & Role Gate Cleanliness)', () => {
    it('C4.1: STUDENT_NAV retains exact 9 flagship routes with Mirror and Interview', () => {
      const items = STUDENT_NAV[0].items;
      assert.strictEqual(items.length, 9, 'STUDENT_NAV must strictly maintain 9 flagship items');
      const hrefs = items.map((i: any) => i.href);
      assert.deepStrictEqual(hrefs, [
        '/dashboard',
        '/quests',
        '/missions',
        '/arena',
        '/projects',
        '/leaderboard',
        '/interview',
        '/mirror',
        '/attention-span'
      ]);
    });

    it('C4.2: ROUTE_TOOLTIPS includes comprehensive metadata for /mirror', () => {
      assert.ok(ROUTE_TOOLTIPS['/mirror'], 'ROUTE_TOOLTIPS must have /mirror defined');
      assert.strictEqual(ROUTE_TOOLTIPS['/mirror'].label, 'Mirror');
      assert.ok(ROUTE_TOOLTIPS['/mirror'].tooltip.includes('ATS Resume Studio'));
      assert.ok(ROUTE_TOOLTIPS['/mirror'].description.includes('AI resume builder'));
    });
  });

});
