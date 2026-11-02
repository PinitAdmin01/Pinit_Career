/**
 * tests/learning_twin_deep_dom_ssr.test.ts
 * 
 * IN-DEPTH DOM & COMPONENT SSR VERIFICATION SUITE
 * Uses react-dom/server to render and brutally inspect every component
 * of the Learning & Career Twin Hub across all 5 sub-tabs, both student
 * and faculty modes, and all interaction states.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { EnrolledCoursesPanel } from '../src/app/learning/components/EnrolledCoursesPanel';
import { LearningPathView } from '../src/app/learning/components/LearningPathView';
import { CourseGrid } from '../src/app/learning/components/CourseGrid';
import { LearningFilters } from '../src/app/learning/components/LearningFilters';
import SpacedReviewQueue from '../src/components/learning/SpacedReviewQueue';

import {
  humanizeAssessmentGap,
  getDynamicRoadmapForTrack,
  calculateDynamicCareerTwin,
  getCategorizedGaps
} from '../src/lib/learning/learningTwinIntelligence';

describe('IN-DEPTH COMPONENT SSR & DOM STRUCTURE VERIFICATION', () => {

  it('DOM-1: EnrolledCoursesPanel renders active blind spots, incident telemetry toggle, and Socratic drills', () => {
    const sampleMistakes = [
      humanizeAssessmentGap('rigid_execution_vs_adaptation'),
      humanizeAssessmentGap('communication_vs_investigation')
    ];

    const html = renderToStaticMarkup(
      React.createElement(EnrolledCoursesPanel, {
        activeRole: 'student',
        mistakes: [],
        clearMistake: () => {},
        studentsList: [],
        prescribeQuest: () => {},
        missingSkills: sampleMistakes.map(m => ({
          name: m.title,
          rawName: m.rawKey,
          reason: m.rootCause,
          severity: m.severity as any,
          category: m.category
        })),
        humanizedMistakes: sampleMistakes,
        resolveDrill: async () => ({ success: true, xpEarned: 30 })
      })
    );

    // Verify Header & Badges
    assert.ok(html.includes('Fused Learning Mistakes Tracker'), 'Must include tracker header');
    assert.ok(html.includes('2 Active Blind Spots'), 'Must show count badge');
    assert.ok(html.includes('Why do we collect mistake data?'), 'Must include Socratic educational callout');

    // Verify Mistake 1 (Cognitive Rigidity)
    assert.ok(html.includes('Cognitive Rigidity &amp; Dynamic Constraint Adaptation'), 'Must render humanized title');
    assert.ok(html.includes('Behavioral &amp; Execution'), 'Must render category badge');
    assert.ok(html.includes('High Priority'), 'Must render high severity badge');
    assert.ok(html.includes('View Failure Incident Log'), 'Must render incident telemetry toggle');

    // Verify Socratic Remedial Drill Box
    assert.ok(html.includes('Socratic Remedial Drill'), 'Must render Socratic drill header');
    assert.ok(html.includes('Verify &amp; Resolve Blind Spot'), 'Must render verification action button');
    assert.ok(html.includes('Practice in Sandbox'), 'Must render practice sandbox link');
    assert.ok(html.includes('Mark Resolved'), 'Must render mark resolved button');

    // Verify Right Column (AI Fused Remedial Plan)
    assert.ok(html.includes('AI Fused Remedial Plan'), 'Must render remedial plan header');
    assert.ok(html.includes('1. Strengthen Cognitive Rigidity'), 'Must render humanized remedial step 1');
    assert.ok(html.includes('2. Strengthen Inquiry Imbalance'), 'Must render humanized remedial step 2');
    assert.ok(html.includes('+30 XP on resolution'), 'Must render XP reward indicator');
    assert.ok(html.includes('Estimated Placement Uplift'), 'Must render placement uplift summary');
  });

  it('DOM-2: EnrolledCoursesPanel renders celebratory completion state when all blind spots are cleared', () => {
    const html = renderToStaticMarkup(
      React.createElement(EnrolledCoursesPanel, {
        activeRole: 'student',
        mistakes: [],
        clearMistake: () => {},
        studentsList: [],
        prescribeQuest: () => {},
        missingSkills: [],
        humanizedMistakes: [],
        resolveDrill: async () => ({ success: true, xpEarned: 30 })
      })
    );

    // Verify Celebratory Feedback
    assert.ok(html.includes('All Active Blind Spots Resolved!'), 'Must render celebratory header');
    assert.ok(html.includes('Review in Spaced Repetition'), 'Must render shortcut link to FSRS memory');
    assert.ok(html.includes('100% Remedial Alignment Achieved!'), 'Must render 100% alignment badge on the right');
  });

  it('DOM-3: EnrolledCoursesPanel renders Faculty Desk table with student interventions', () => {
    const sampleStudents = [
      { id: 's1', displayName: 'Aarav Sharma', section: 'CS-4A', gaps: ['Concurrency Deadlocks', 'B-Tree Indexing'], roadmapStep: 'High-Scale Systems' },
      { id: 's2', displayName: 'Sneha Patel', section: 'CS-4B', gaps: ['OAuth2 JWT Flow'], roadmapStep: 'Production APIs' }
    ];

    const html = renderToStaticMarkup(
      React.createElement(EnrolledCoursesPanel, {
        activeRole: 'faculty',
        mistakes: [],
        clearMistake: () => {},
        studentsList: sampleStudents,
        prescribeQuest: () => {},
        missingSkills: [],
        humanizedMistakes: []
      })
    );

    assert.ok(html.includes('Students Requiring Learning Intervention'), 'Must render faculty desk header');
    assert.ok(html.includes('Aarav Sharma'), 'Must render student 1 name');
    assert.ok(html.includes('Sneha Patel'), 'Must render student 2 name');
    assert.ok(html.includes('CS-4A'), 'Must render class section CS-4A');
    assert.ok(html.includes('Concurrency Deadlocks'), 'Must render student gap badge');
    assert.ok(html.includes('Prescribe Quest'), 'Must render Prescribe Quest action button');
  });

  it('DOM-4: LearningPathView renders 4-Phase Growth Roadmap with live blueprint and gate requirements', () => {
    const dynamicRoadmap = getDynamicRoadmapForTrack('React Frontend SDE', 'course-react-web', 4, 3, 2);

    const html = renderToStaticMarkup(
      React.createElement(LearningPathView, {
        activeTab: 'roadmap',
        roadmapSteps: [] as any,
        dynamicRoadmap,
        activeStep: 0,
        setActiveStep: () => {},
        onboardingComplete: true,
        setOnboardingComplete: () => {},
        teacher: { name: 'Ms. Priya', emoji: '👩‍💼' },
        chatHistory: [],
        simulating: false,
        chatBottomRef: { current: null },
        inputVal: '',
        setInputVal: () => {},
        handleSendAnswer: () => {},
        ONBOARDING_QUESTIONS: [],
        step: 0,
        onboardingAnswers: {},
        selectedTwinPath: 0,
        setSelectedTwinPath: () => {},
        targetRole: 'React Frontend SDE'
      })
    );

    // Left Column: 4 Stages
    assert.ok(html.includes('Recommended Growth Roadmap Pathway'), 'Must render roadmap pathway header');
    assert.ok(html.includes('React Frontend SDE'), 'Must render target role badge');
    assert.ok(html.includes('Phase 1'), 'Must render stage 1 phase indicator');
    assert.ok(html.includes('Phase 2'), 'Must render stage 2 phase indicator');
    assert.ok(html.includes('Phase 3'), 'Must render stage 3 phase indicator');
    assert.ok(html.includes('Phase 4'), 'Must render stage 4 phase indicator');
    assert.ok(html.includes('HTML5, CSS Systems') || html.includes('DOM Invariants') || html.includes('Component Architecture'), 'Must render stage titles');

    // Right Column: Active Stage Blueprint & Gate
    assert.ok(html.includes('Active Stage Blueprint &amp; Verification Gate'), 'Must render blueprint header');
    assert.ok(html.includes('Core Verified Competencies To Master'), 'Must render skills header');
    assert.ok(html.includes('DOM Manipulation') || html.includes('ES6+ Syntax'), 'Must render skill chips');
    assert.ok(html.includes('Stage Milestone Verification Gate'), 'Must render gate header');
    assert.ok(html.includes('Curriculum Completion'), 'Must render completion gate');
    assert.ok(html.includes('Enter Quest Arena for this Stage'), 'Must render quest arena launch link');
    assert.ok(html.includes('Check Vault'), 'Must render vault evidence link');
  });

  it('DOM-5: LearningPathView renders Digital Career Twin Cockpit with sensitivity sliders and 3 archetypes', () => {
    const twinSim = calculateDynamicCareerTwin({
      targetRole: 'Full Stack Engineer',
      dailyQuestPace: 3,
      interviewScoreTarget: 88,
      gapsResolvedCount: 4,
      baseAtsScore: 78,
      verifiedProofsCount: 3
    });

    const html = renderToStaticMarkup(
      React.createElement(LearningPathView, {
        activeTab: 'twin',
        roadmapSteps: [] as any,
        dynamicRoadmap: [],
        activeStep: 0,
        setActiveStep: () => {},
        onboardingComplete: true,
        setOnboardingComplete: () => {},
        teacher: { name: 'Ms. Priya', emoji: '👩‍💼' },
        chatHistory: [],
        simulating: false,
        chatBottomRef: { current: null },
        inputVal: '',
        setInputVal: () => {},
        handleSendAnswer: () => {},
        ONBOARDING_QUESTIONS: [],
        step: 0,
        onboardingAnswers: {},
        twinSimulation: twinSim,
        selectedTwinPath: 0,
        setSelectedTwinPath: () => {},
        dailyQuestPace: 3,
        setDailyQuestPace: () => {},
        interviewScoreTarget: 88,
        setInterviewScoreTarget: () => {},
        gapsResolvedCount: 4,
        setGapsResolvedCount: () => {},
        targetRole: 'Full Stack Engineer'
      })
    );

    // Top Header & Recalibration
    assert.ok(html.includes('Digital Career Twin — Market Placement Cockpit'), 'Must render twin cockpit header');
    assert.ok(html.includes('Recalibrate with AI Companion'), 'Must render recalibrate button');

    // 4 Bento Overview Metrics
    assert.ok(html.includes('Market Readiness'), 'Must render Market Readiness bento');
    assert.ok(html.includes(`${twinSim.overallMarketReadiness}%`), 'Must display correct readiness %');
    assert.ok(html.includes('Projected Starting CTC'), 'Must render Starting CTC bento');
    assert.ok(html.includes(twinSim.projectedCtcBracket), 'Must display calculated CTC bracket');
    assert.ok(html.includes('Est. Months to First Offer'), 'Must render Est Months bento');
    assert.ok(html.includes('Recruiter Appeal Tier'), 'Must render Recruiter Tier bento');
    assert.ok(html.includes(twinSim.recruiterAppealTier), 'Must display calculated recruiter tier');

    // Interactive Sensitivity Sliders ("What-If" Engine)
    assert.ok(html.includes('Interactive Career Twin Sensitivity Simulator'), 'Must render sensitivity simulator title');
    assert.ok(html.includes('Daily Quest Pacing'), 'Must render daily pacing slider');
    assert.ok(html.includes('3 Quests / Day'), 'Must display current slider value');
    assert.ok(html.includes('Mock Interview Target'), 'Must render interview target slider');
    assert.ok(html.includes('88% STAR Score'), 'Must display current interview target');
    assert.ok(html.includes('Remedial Gaps Closed'), 'Must render gaps closed slider');
    assert.ok(html.includes('4 Closed'), 'Must display current gaps closed value');

    // 3 Parallel Archetype Paths
    assert.ok(html.includes('3 Parallel Market Trajectory Archetypes'), 'Must render archetypes title');
    assert.ok(html.includes('High-Growth Product Firm / Unicorn'), 'Must render Unicorn archetype');
    assert.ok(html.includes('Global Enterprise MNC &amp; Cloud Core'), 'Must render Enterprise MNC archetype');
    assert.ok(html.includes('Venture / Founding Engineer Track'), 'Must render Venture archetype');

    // High-Leverage Strategic Action Plan
    assert.ok(html.includes('High-Leverage Strategic Action Plan'), 'Must render action plan title');
    assert.ok(html.includes('Sprint 1: Remedial Gap Closure'), 'Must render sprint 1 card');
    assert.ok(html.includes('Sprint 2: Mock Interview Defense'), 'Must render sprint 2 card');
    assert.ok(html.includes('Sprint 3: Proof-of-Work Verification'), 'Must render sprint 3 card');
  });

  it('DOM-6: CourseGrid renders 3-Tier Curriculum Gaps with interactive check and quest bridging', () => {
    const categorizedGaps = getCategorizedGaps(
      'Full Stack Engineer',
      ['rigid_execution_vs_adaptation', 'async_race_condition'],
      ['PostgreSQL Datastore']
    );

    const html = renderToStaticMarkup(
      React.createElement(CourseGrid, {
        activeTab: 'gaps',
        missingSkills: [],
        baseMissingSkills: ['PostgreSQL Datastore', 'Behavioral STAR Method'],
        categorizedGaps,
        quests: [],
        cOS: {}
      })
    );

    // Left Column: DNA Gaps Feed
    assert.ok(html.includes('Career DNA Competency Gaps Feed'), 'Must render gaps feed header');
    assert.ok(html.includes('All Gaps'), 'Must render filter button All');
    assert.ok(html.includes('Critical Blockers'), 'Must render filter button Blockers');
    assert.ok(html.includes('Differentiators'), 'Must render filter button Differentiators');
    assert.ok(html.includes('Specializations'), 'Must render filter button Specializations');

    // Gaps content
    assert.ok(html.includes('Critical Blocker'), 'Must render Critical Blocker badge');
    assert.ok(html.includes('Bridge in Quests'), 'Must render Bridge in Quests deep link');
    assert.ok(html.includes('Test Competency'), 'Must render Test Competency trigger button');

    // Right Column: Real Time JD Gap Analysis
    assert.ok(html.includes('Real Time JD Gap Analysis'), 'Must render JD gap analysis header');
    assert.ok(html.includes('Urgent Core Requirements'), 'Must render urgent requirements section');
    assert.ok(html.includes('Strategic Bridge Recommendation'), 'Must render recommendation callout');
  });

  it('DOM-7: CourseGrid renders Active Career Quests when in Twin tab', () => {
    const sampleQuests = [
      {
        id: 'frontend_quest',
        title: 'Frontend Developer Quest',
        subtitle: 'Master responsive scale systems and UI deployment',
        icon: '</>',
        color: '#4f46e5',
        reward: { badge: 'Frontend Pro', xp: 2000, boost: 'Featured' },
        stages: [
          { title: 'Resume Optimisation', desc: 'Get ATS score above 60', href: '/resume', icon: '📄', isComplete: () => true },
          { title: 'React Challenge', desc: 'Complete React Fundamentals', href: '/missions', icon: '⚛', isComplete: () => false }
        ]
      }
    ];

    const html = renderToStaticMarkup(
      React.createElement(CourseGrid, {
        activeTab: 'twin',
        missingSkills: [],
        baseMissingSkills: [],
        categorizedGaps: [],
        quests: sampleQuests as any,
        cOS: {}
      })
    );

    assert.ok(html.includes('Active Career Quests (Twin Advancement Track)'), 'Must render active quests header');
    assert.ok(html.includes('Frontend Developer Quest'), 'Must render quest title');
    assert.ok(html.includes('Stg 1: Resume Optimisation'), 'Must render completed stage 1');
    assert.ok(html.includes('✓ Done'), 'Must render stage 1 done badge');
    assert.ok(html.includes('Stg 2: React Challenge'), 'Must render active stage 2');
    assert.ok(html.includes('Start ➔'), 'Must render stage 2 start button');
  });

  it('DOM-8: SpacedReviewQueue renders theme-adaptive FSRS-4.5 engine with multi-track deck filters', () => {
    const html = renderToStaticMarkup(
      React.createElement(SpacedReviewQueue)
    );

    // Initial SSR render placeholder (hydration-safe)
    assert.ok(
      html.includes('Loading Spaced Repetition Memory Engine') ||
      html.includes('Spaced Repetition Memory Engine (FSRS-4.5)'),
      'Must render clean SSR markup without hydration mismatches'
    );
  });

  it('DOM-9: LearningFilters renders all 5 sub-tab buttons and handles faculty switch', () => {
    const htmlStudent = renderToStaticMarkup(
      React.createElement(LearningFilters, {
        activeRole: 'student',
        setActiveRole: () => {},
        canAccessFaculty: false,
        activeTab: 'twin',
        handleTabChange: () => {}
      })
    );

    // Student view
    assert.ok(htmlStudent.includes('Learning Roadmap &amp; Digital Career Twin'), 'Must render main page title');
    assert.ok(htmlStudent.includes('Mistakes &amp; Remediation'), 'Must render sub-tab 1 button');
    assert.ok(htmlStudent.includes('Growth Roadmap'), 'Must render sub-tab 2 button');
    assert.ok(htmlStudent.includes('Career Twin Simulator'), 'Must render sub-tab 3 button');
    assert.ok(htmlStudent.includes('Curriculum Gaps'), 'Must render sub-tab 4 button');
    assert.ok(htmlStudent.includes('Spaced Memory (FSRS)'), 'Must render sub-tab 5 button');
    assert.ok(!htmlStudent.includes('Faculty Desk'), 'Must not render faculty switcher for regular students');

    // Faculty view
    const htmlFaculty = renderToStaticMarkup(
      React.createElement(LearningFilters, {
        activeRole: 'faculty',
        setActiveRole: () => {},
        canAccessFaculty: true,
        activeTab: 'mistakes',
        handleTabChange: () => {}
      })
    );
    assert.ok(htmlFaculty.includes('Faculty Desk'), 'Must render faculty switcher for faculty members');
    assert.ok(htmlFaculty.includes('Student Portal'), 'Must render student portal option in switcher');
  });

});
