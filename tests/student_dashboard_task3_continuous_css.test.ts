import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('STUDENT DASHBOARD: TASK 3 CONTINUOUS CSS UNIFICATION AUDIT', () => {
  const root = process.cwd();

  const globalsCss = fs.readFileSync(path.join(root, 'src/styles/globals.css'), 'utf-8');
  const appShell = fs.readFileSync(path.join(root, 'src/components/ui/AppShell.tsx'), 'utf-8');
  const pageFile = fs.readFileSync(path.join(root, 'src/app/dashboard/page.tsx'), 'utf-8');
  const hudFile = fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf-8');
  const trajFile = fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardTrajectoryMap.tsx'), 'utf-8');
  const progressBarFile = fs.readFileSync(path.join(root, 'src/components/student/dashboard/CareerCourseProgressBar.tsx'), 'utf-8');

  test('Task 3.1: Left Sidebar (.sidebar) has continuous glassmorphism gradient and luminous border', () => {
    assert.ok(
      globalsCss.includes('linear-gradient(180deg, rgba(99, 102, 241, 0.05)'),
      '.sidebar in globals.css must use continuous subtle indigo gradient'
    );
    assert.ok(
      globalsCss.includes('border-right: 1.5px solid rgba(99, 102, 241, 0.18)'),
      '.sidebar must use continuous luminous border matching progress bar'
    );
    assert.ok(
      globalsCss.includes('box-shadow: 4px 0 24px -4px rgba(99, 102, 241, 0.08)'),
      '.sidebar must have continuous soft glow shadow'
    );
  });

  test('Task 3.2: Left Sidebar active nav item has continuous gradient and accent highlight', () => {
    assert.ok(
      globalsCss.includes('linear-gradient(135deg, rgba(99, 102, 241, 0.14)'),
      '.nav-item.active must use continuous indigo glass gradient'
    );
    assert.ok(
      globalsCss.includes('border: 1px solid rgba(99, 102, 241, 0.25)'),
      '.nav-item.active must use subtle luminous border'
    );
  });

  test('Task 3.3: Right Sidebar in AppShell has continuous glass styling matching left sidebar', () => {
    assert.ok(
      appShell.includes('linear-gradient(180deg, rgba(99, 102, 241, 0.05)'),
      'Right sidebar must use continuous indigo glass gradient'
    );
    assert.ok(
      appShell.includes('borderLeft: \'1.5px solid rgba(99, 102, 241, 0.18)\''),
      'Right sidebar must use continuous luminous border'
    );
    assert.ok(
      appShell.includes('boxShadow: \'-4px 0 24px -4px rgba(99, 102, 241, 0.08)\''),
      'Right sidebar must use continuous elevation glow shadow'
    );
  });

  test('Task 3.4: Base .db-glass tokens unified to match CareerCourseProgressBar glass recipe', () => {
    assert.ok(
      pageFile.includes('linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, var(--dash-card) 100%)'),
      '.db-glass in page.tsx must use continuous indigo glass background'
    );
    assert.ok(
      pageFile.includes('border: 1.5px solid rgba(99, 102, 241, 0.22)'),
      '.db-glass must use continuous luminous border'
    );
    assert.ok(
      pageFile.includes('box-shadow: 0 8px 30px -4px rgba(99, 102, 241, 0.16)'),
      '.db-glass must use continuous soft glow shadow'
    );
  });

  test('Task 3.5: DashboardHeaderHUD container aligns with continuous glass styling', () => {
    assert.ok(
      hudFile.includes('linear-gradient(135deg, rgba(99, 102, 241, 0.07) 0%, var(--dash-card) 100%)'),
      'DashboardHeaderHUD must use continuous glass background'
    );
    assert.ok(
      hudFile.includes('border: \'1.5px solid rgba(99, 102, 241, 0.22)\''),
      'DashboardHeaderHUD must use continuous luminous border'
    );
  });

  test('Task 3.6: DashboardTrajectoryMap container unifies with continuous .db-glass styling', () => {
    assert.ok(
      trajFile.includes('className="db-glass"'),
      'DashboardTrajectoryMap must use db-glass class'
    );
    assert.ok(
      trajFile.includes('linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, var(--dash-card) 100%)'),
      'DashboardTrajectoryMap must use continuous glass gradient'
    );
    assert.ok(
      trajFile.includes('border:\'1.5px solid rgba(99, 102, 241, 0.22)\''),
      'DashboardTrajectoryMap must use continuous border'
    );
  });

  test('Task 3.7: CareerCourseProgressBar remains the gold-standard continuous component', () => {
    assert.ok(
      progressBarFile.includes('linear-gradient(135deg, rgba(99,102,241,0.08) 0%, var(--dash-card) 100%)') ||
      progressBarFile.includes('rgba(99,102,241,0.08)'),
      'CareerCourseProgressBar must retain its continuous glass gradient'
    );
    assert.ok(
      progressBarFile.includes('border: \'1.5px solid rgba(99,102,241,0.3)\''),
      'CareerCourseProgressBar must retain its glowing border'
    );
  });
});
