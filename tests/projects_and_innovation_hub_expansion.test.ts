import test from 'node:test';
import assert from 'node:assert/strict';

import { STUDENT_NAV, ROUTE_TOOLTIPS } from '../src/components/ui/AppSidebar';
import { getDomainFallback } from '../src/lib/projects/projectCatalog';
import { INITIAL_HACKATHON_SQUADS, TeamsApiService } from '../src/lib/api/teamsApi';
import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';

test('Task 1: Sidebar divides Projects and Innovation Hub into distinct first-class navigation items', () => {
  const rootSection = STUDENT_NAV.find((s) => s.section === 'PinIT Career OS');
  assert.ok(rootSection, 'PinIT Career OS section must exist in STUDENT_NAV');

  const projectsItem = rootSection.items.find((item: any) => item.href === '/projects');
  assert.ok(projectsItem, '/projects must exist in student nav items');
  assert.equal(projectsItem.label, 'Projects');

  const innovationHubItem = rootSection.items.find((item: any) => item.href === '/innovation-hub');
  assert.ok(innovationHubItem, '/innovation-hub must exist in student nav items as its own tab');
  assert.equal(innovationHubItem.label, 'Innovation Hub');

  // Verify distinct tooltips and descriptions
  assert.ok(ROUTE_TOOLTIPS['/projects'], 'Tooltips must exist for /projects');
  assert.ok(ROUTE_TOOLTIPS['/innovation-hub'], 'Tooltips must exist for /innovation-hub');
  assert.notEqual(ROUTE_TOOLTIPS['/projects'].label, ROUTE_TOOLTIPS['/innovation-hub'].label);
});

test('Task 3: Dynamic Course Capstone Binding for Python and Java courses', () => {
  // Scenario A: Student is doing Python (course-python-backend / "Day 1: Your First Python Program")
  const pythonProjects = getDomainFallback('Full Stack Engineer', ['Python', 'SQL'], 'Undergraduate', 'course-python-backend');
  assert.ok(pythonProjects.length >= 5, 'Must generate 5 capstone stages for Python track');

  // Stage 1 must be CLI / Foundation Python matching Day 1-30
  assert.equal(pythonProjects[0].level, 'Beginner');
  assert.ok(pythonProjects[0].name.toLowerCase().includes('finance') || pythonProjects[0].name.toLowerCase().includes('expense'),
    'Python stage 1 should be Expense Tracker / CLI finance pipeline');
  assert.ok(pythonProjects[0].techStack.toLowerCase().includes('python'), 'Tech stack must use Python');

  // Stage 2 must be FastAPI / Web API
  assert.equal(pythonProjects[1].level, 'Intermediate');
  assert.ok(pythonProjects[1].name.toLowerCase().includes('fastapi'), 'Python stage 2 should be FastAPI REST microservice');

  // Stage 3 must be Distributed Task Queue with Redis / Celery
  assert.equal(pythonProjects[2].level, 'Advanced');
  assert.ok(pythonProjects[2].techStack.toLowerCase().includes('celery') || pythonProjects[2].techStack.toLowerCase().includes('redis'),
    'Python stage 3 should use Celery and Redis');

  // Scenario B: Student is doing Java Fundamentals & Core Logic (course-java-logic)
  const javaProjects = getDomainFallback('Software Engineer', ['Java'], 'Undergraduate', 'course-java-logic');
  assert.ok(javaProjects.length >= 5, 'Must generate 5 capstone stages for Java track');
  assert.ok(javaProjects[0].techStack.toLowerCase().includes('java'), 'Java track must use Java in tech stack');
  assert.ok(javaProjects[1].techStack.toLowerCase().includes('spring'), 'Java track intermediate must use Spring Boot');
});

test('Task 4: Innovation Hub removes dummy data and purges legacy ByteCraft mock squads', () => {
  // Invariant 1: INITIAL_HACKATHON_SQUADS must be empty
  assert.equal(INITIAL_HACKATHON_SQUADS.length, 0, 'INITIAL_HACKATHON_SQUADS must be empty by default');

  // Invariant 2: getSquads() must never return legacy dummy squad
  const squads = TeamsApiService.getSquads('test_student_999');
  const dummySquad = squads.find((s) => s.id === 'squad_pin_agile_01' || s.name.includes('ByteCraft'));
  assert.equal(dummySquad, undefined, 'Legacy ByteCraft Autonomous Systems dummy squad must be purged');

  // Invariant 3: Real user squad creation works dynamically
  const created = TeamsApiService.createSquad({
    name: 'Real Cohort FinTech Squad',
    hackathonTitle: 'Financial Fraud Detection Hackathon',
    teamLeadStudentId: 'student_real_42',
    teamLeadName: 'Aarav Patel',
    teamLeadRole: 'backend_lead',
    repoUrl: 'https://github.com/aarav-patel/fintech-fraud-core',
  });

  assert.ok(created.id, 'Squad must have an assigned ID');
  assert.equal(created.name, 'Real Cohort FinTech Squad');
  assert.equal(created.members.length, 1);
  assert.equal(created.members[0].name, 'Aarav Patel');
  assert.equal(created.members[0].studentId, 'student_real_42');
});
