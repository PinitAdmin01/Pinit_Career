import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { isHyperActiveTrigger } from '../src/lib/avatar/wakeWordParser';
import {
  buildHyperActiveGreeting,
  buildHyperActivePromptDirective,
  buildHyperActiveFallbackReply,
} from '../src/lib/avatar/hyperActivePersona';
import { buildMentorSystemPrompt } from '../src/lib/avatar/mentorPromptBuilder';
import {
  isStudentEngagedProject,
  computeHonestProjectProgress,
  getActiveCareerProjects,
} from '../src/lib/projects/savedProjects';
import {
  buildActivityJourneyModel,
  ProjectActivityJourney,
} from '../src/components/projects/ProjectActivityJourney';

const ROOT = path.resolve(__dirname, '..');

test('Task 1: GlobalAvatar fades 15% more when inactive, relocates bottom-left when active, and keeps header/caption off avatar', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/components/ui/GlobalAvatar.tsx'), 'utf8');

  assert.ok(src.includes('const INACTIVE_PILL_OPACITY = 0.4;'), 'Inactive launcher pill must fade 15% more from 0.55 to 0.40');
  assert.ok(src.includes('activeDockLeft'), 'Active window must relocate dynamically to bottom-left corner');
  assert.ok(src.includes('data-testid="global-avatar-slim-header"'), 'Slim single-line header must be present');
  assert.ok(src.includes('data-testid="global-avatar-compact-caption"'), 'Compact 2-line caption strip must sit below avatar');
  assert.ok(src.includes("WebkitLineClamp: 2"), 'Compact caption must clamp strictly to 2 lines');
  assert.equal(src.includes('**Home Dashboard**'), false, 'TAB_GUIDES must not render raw markdown asterisks');
});

test('Task 2: Hyper-Active voice trigger, 65% centered split pane, and left sidebar collapse wiring', () => {
  // Positive spoken triggers (including common STT typo "chart" & "hwy")
  assert.equal(isHyperActiveTrigger('hey priya we need to chat'), true);
  assert.equal(isHyperActiveTrigger('hey priya we need to chart'), true);
  assert.equal(isHyperActiveTrigger('hwy priya we need to speak'), true);
  assert.equal(isHyperActiveTrigger('Hey Priya, let\'s talk!'), true);
  assert.equal(isHyperActiveTrigger('hey anish we need to speak', 'anish'), true);
  assert.equal(isHyperActiveTrigger('enable hyper active mode'), true);

  // Negative false-positive guards
  assert.equal(isHyperActiveTrigger('create a bar chart in python'), false);
  assert.equal(isHyperActiveTrigger('hello world how does docker work'), false);
  assert.equal(isHyperActiveTrigger(''), false);

  const globalAvatarSrc = fs.readFileSync(path.join(ROOT, 'src/components/ui/GlobalAvatar.tsx'), 'utf8');
  const appShellSrc = fs.readFileSync(path.join(ROOT, 'src/components/ui/AppShell.tsx'), 'utf8');
  const widgetSrc = fs.readFileSync(path.join(ROOT, 'src/components/avatar/AvatarMentorWidget.tsx'), 'utf8');

  assert.ok(appShellSrc.includes('onCollapseLeftNav={() => toggleLeftSidebar(true)}'), 'AppShell must wire left sidebar collapse callback');
  assert.ok(globalAvatarSrc.includes('onCollapseLeftNavRef.current?.()'), 'enterHyperActive must collapse left sidebar');
  assert.ok(globalAvatarSrc.includes('data-testid="global-avatar-hyper-active"'), 'Hyper-Active centered modal must exist');
  assert.ok(globalAvatarSrc.includes('68vw') && globalAvatarSrc.includes('68vh'), 'Hyper-Active modal must cover ~65% centered viewport');
  assert.ok(globalAvatarSrc.includes('isEnlarged={true}') && globalAvatarSrc.includes('onlyAvatar={false}'), 'Hyper-Active must render split-pane Avatar + Chat');
  assert.ok(globalAvatarSrc.includes('|| hyperActive) return;'), 'Wake-word mic must pause while Hyper-Active owns mic');
  assert.ok(widgetSrc.includes('Hyper-Active'), 'AvatarMentorWidget must render Hyper-Active state badge');
});

test('Task 3: Hyper-Active persona speaks with human care, playful charm, and honest real-progress check-ins', () => {
  const freshGreeting = buildHyperActiveGreeting(
    { studentName: 'Suraj', completedQuestsCount: 0, completedMissionsCount: 0, missionStreak: 0 },
    new Date(2026, 10, 19, 20, 30),
    0
  );
  assert.match(freshGreeting, /Hey Suraj!/i);
  assert.match(freshGreeting, /how was your day|are you doing okay/i);
  assert.match(freshGreeting, /zero tasks logged yet/i);
  assert.match(freshGreeting, /what do you want to tackle next/i);

  const activeGreeting = buildHyperActiveGreeting(
    { studentName: 'Suraj', completedQuestsCount: 2, completedMissionsCount: 1, missionStreak: 4 },
    new Date(2026, 10, 19, 10, 0),
    1
  );
  assert.match(activeGreeting, /2 lessons and 1 daily mission on a 4-day streak/i);

  const tiredReply = buildHyperActiveFallbackReply('I am really tired and stressed today', {
    studentName: 'Suraj',
    completedQuestsCount: 1,
    completedMissionsCount: 0,
  });
  assert.match(tiredReply, /breathe|burn out/i);
  assert.match(tiredReply, /1 lesson/i);

  const hyperPrompt = buildMentorSystemPrompt(
    {
      studentName: 'Suraj',
      targetRole: 'Full Stack Engineer',
      questTitle: 'Core Foundation',
      missingSkills: ['Docker'],
      atsScore: 45,
      hyperActive: true,
      completedQuestsCount: 1,
      completedMissionsCount: 2,
      missionStreak: 3,
    },
    undefined,
    'v1_legacy'
  );
  assert.ok(hyperPrompt.includes('HYPER-ACTIVE HUMAN CONVERSATION MODE'));
  assert.ok(hyperPrompt.includes('1 lessons completed, 2 daily missions completed, 3-day streak'));

  const stdPrompt = buildMentorSystemPrompt(
    {
      studentName: 'Suraj',
      targetRole: 'Full Stack Engineer',
      questTitle: 'Core Foundation',
      missingSkills: [],
      atsScore: 0,
    },
    undefined,
    'v1_legacy'
  );
  assert.equal(stdPrompt.includes('HYPER-ACTIVE HUMAN CONVERSATION MODE'), false);
  assert.ok(buildHyperActivePromptDirective({ studentName: 'Suraj' }).includes('NEVER exaggerate'));
});

test('Task 4: Untouched catalog templates are excluded from Active Projects and progress never fakes 15%', () => {
  const untouchedTemplate = {
    id: 'proj-1',
    name: 'Automated Personal Finance & Expense Tracker CLI',
    level: 'Beginner' as const,
    description: 'CLI',
    techStack: 'Python 3, Pydantic',
    problem: 'P',
    deliverable: 'D',
    xpReward: 250,
    status: 'Not Started' as const,
    isTemplate: true,
    source: 'curated_template' as const,
  };

  assert.equal(isStudentEngagedProject(untouchedTemplate), false, 'Untouched template must not be treated as active');
  assert.equal(computeHonestProjectProgress(untouchedTemplate), 0, 'Untouched project must be 0%, NEVER 15%');

  const startedTemplate = { ...untouchedTemplate, status: 'In Progress' as const };
  assert.equal(isStudentEngagedProject(startedTemplate), true);
  assert.equal(computeHonestProjectProgress(startedTemplate), 20);

  const repoLinked = { ...startedTemplate, githubLink: 'https://github.com/suraj/finance-cli' };
  assert.equal(computeHonestProjectProgress(repoLinked), 50);

  const completed = { ...repoLinked, status: 'Completed' as const };
  assert.equal(computeHonestProjectProgress(completed), 100);

  const activeList = getActiveCareerProjects({ portfolio_projects: [untouchedTemplate, startedTemplate] });
  assert.equal(activeList.length, 1);
  assert.equal(activeList[0].status, 'In Progress');

  const bentoSrc = fs.readFileSync(path.join(ROOT, 'src/components/student/dashboard/DashboardBentoGrid.tsx'), 'utf8');
  assert.ok(bentoSrc.includes('computeHonestProjectProgress(p)'), 'DashboardBentoGrid must use computeHonestProjectProgress');
  assert.ok(bentoSrc.includes('isStudentEngagedProject'), 'DashboardBentoGrid must filter untouched templates');
  assert.equal(bentoSrc.includes(': 15;'), false, 'Fake 15% fallback must be completely eliminated');
});

test('Task 5: ProjectActivityJourney renders honest visual lesson milestones ("Done Lesson 1") and SSR passes cleanly', () => {
  const untouchedTemplate = {
    id: 'proj-1',
    name: 'Automated Personal Finance CLI',
    level: 'Beginner' as const,
    description: 'CLI',
    techStack: 'Python 3',
    problem: 'P',
    deliverable: 'D',
    xpReward: 250,
    status: 'Not Started' as const,
    isTemplate: true,
  };

  // Baseline: 0 lessons completed -> honest 0%, zero stamps, Lesson 1 Next Up
  const emptyModel = buildActivityJourneyModel({
    completedQuests: [],
    matchedCourseQuests: [],
    completedMissions: [],
    missionStreak: 0,
    projects: [untouchedTemplate],
  });
  assert.equal(emptyModel.completedLessons.length, 0);
  assert.equal(emptyModel.capstoneUnlockPercent, 0);
  assert.equal(emptyModel.activeProjects.length, 0);
  assert.equal(emptyModel.stamps.length, 0);
  assert.equal(emptyModel.lessonNodes[0].state, 'next');

  // After completing Lesson 1 -> "Done Lesson 1" lit up, 33% toward capstone gate
  const lesson1Model = buildActivityJourneyModel({
    completedQuests: ['py-day-1'],
    matchedCourseQuests: ['py-day-1'],
    completedMissions: ['m-1'],
    missionStreak: 1,
    projects: [untouchedTemplate],
  });
  assert.deepEqual(lesson1Model.completedLessons, [1]);
  assert.equal(lesson1Model.lessonNodes[0].state, 'done');
  assert.equal(lesson1Model.lessonNodes[0].label, 'Done Lesson 1');
  assert.equal(lesson1Model.lessonNodes[1].state, 'next');
  assert.equal(lesson1Model.capstoneUnlockPercent, 33);
  assert.ok(lesson1Model.stamps.some((s) => s.label === 'Done Lesson 1'));

  // SSR render check
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ProjectActivityJourney, {
      courseTitle: 'Python Backend Engineering',
      completedQuests: ['py-day-1'],
      matchedCourseQuests: ['py-day-1'],
      completedMissions: ['m-1'],
      missionStreak: 1,
      projects: [untouchedTemplate],
    })
  );
  assert.ok(html.includes('Done Lesson 1'), 'SSR output must display visual "Done Lesson 1" badge');
  assert.ok(html.includes('Verified Visual Log:'), 'SSR output must display visual log strip');
  assert.ok(html.includes('Capstone Gate'), 'SSR output must display Capstone Gate milestone node');
});

test('Task 6: ProjectActivityJourney is positioned at the end of the Projects page layout', () => {
  const fs = require('fs');
  const path = require('path');
  const pageContent = fs.readFileSync(path.join(__dirname, '../src/app/projects/page.tsx'), 'utf-8');

  const journeyIdx = pageContent.lastIndexOf('<ProjectActivityJourney');
  const pathwayNavIdx = pageContent.indexOf('data-testid="pathway-card-certification"');
  const activeWorkspaceIdx = pageContent.indexOf('selectedGuideProject.status === \'Completed\'');

  assert.ok(journeyIdx > 0, 'ProjectActivityJourney must be present in page.tsx');
  assert.ok(pathwayNavIdx > 0, 'Pathway sub-tab navigation must be present in page.tsx');
  assert.ok(journeyIdx > pathwayNavIdx, 'ProjectActivityJourney must be positioned AFTER the pathway navigation');
  assert.ok(journeyIdx > activeWorkspaceIdx, 'ProjectActivityJourney must be positioned at the last of the project content flow');
});
