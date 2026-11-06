import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

describe('STUDENT DASHBOARD: TASK 1 REMOVALS AUDIT', () => {
  const rootDir = process.cwd();

  it('Task 1.1: Screenshot 1 (DashboardKpiStrip) is completely removed from dashboard page', () => {
    const pageContent = fs.readFileSync(path.join(rootDir, 'src/app/dashboard/page.tsx'), 'utf-8');
    assert.ok(!pageContent.includes('<DashboardKpiStrip'), 'Must not render <DashboardKpiStrip />');
    assert.ok(!pageContent.includes("import DashboardKpiStrip"), 'Must not import DashboardKpiStrip');
  });

  it('Task 1.2: Screenshot 2 (DashboardAttendanceMarker) is completely removed from BentoGrid', () => {
    const bentoContent = fs.readFileSync(path.join(rootDir, 'src/components/student/dashboard/DashboardBentoGrid.tsx'), 'utf-8');
    assert.ok(!bentoContent.includes('<DashboardAttendanceMarker'), 'Must not render <DashboardAttendanceMarker />');
    assert.ok(!bentoContent.includes("import DashboardAttendanceMarker"), 'Must not import DashboardAttendanceMarker');
  });

  it('Task 1.3: Screenshot 3 (Trust button & SDE/IoT Track Toggle) is completely removed from HeaderHUD', () => {
    const hudContent = fs.readFileSync(path.join(rootDir, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf-8');
    assert.ok(!hudContent.includes('btn-trust-top'), 'Must not contain btn-trust-top Link');
    assert.ok(!hudContent.includes('Engineering Career Trajectory Track'), 'Must not contain Track radiogroup');
    assert.ok(!hudContent.includes('SDE Software'), 'Must not contain SDE Software button');
    assert.ok(!hudContent.includes('IoT Hardware'), 'Must not contain IoT Hardware button');
  });

  it('Task 1.4: Specified words are strictly purged from components', () => {
    const barContent = fs.readFileSync(path.join(rootDir, 'src/components/student/dashboard/CareerCourseProgressBar.tsx'), 'utf-8');
    const hudContent = fs.readFileSync(path.join(rootDir, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf-8');

    // 1. "ENROLLED CAREER ACCREDITATION"
    assert.ok(!barContent.includes('ENROLLED CAREER ACCREDITATION'), 'Must not contain "ENROLLED CAREER ACCREDITATION"');
    
    // 2. "Active Program"
    assert.ok(!barContent.includes('Active Program'), 'Must not contain "Active Program"');

    // 3. "Overall Progress"
    assert.ok(!barContent.includes('Overall Progress'), 'Must not contain "Overall Progress"');

    // 4. "Active Pathway"
    assert.ok(!hudContent.includes('Active Pathway'), 'Must not contain "Active Pathway"');
  });

  it('Task 1.5: Retains essential progress information and action button in CareerCourseProgressBar', () => {
    const barContent = fs.readFileSync(path.join(rootDir, 'src/components/student/dashboard/CareerCourseProgressBar.tsx'), 'utf-8');
    // Must still have progress % and resume button
    assert.ok(barContent.includes('{percentComplete}% Completed'), 'Must retain percent complete');
    assert.ok(barContent.includes('btn-resume-incomplete-day'), 'Must retain resume button');
    assert.ok(barContent.includes('TRACK'), 'Must retain TRACK badge');
  });
});
