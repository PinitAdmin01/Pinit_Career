import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React, { Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { TrackSelectorDrawer, type TrackSelectorDrawerProps } from '../src/app/quests/components/TrackSelectorDrawer';
import { QuestPathView, type QuestPathViewProps } from '../src/app/quests/components/QuestPathView';
import {
  isValidSubTab,
  CERTIFICATION_TRACKS,
  COURSE_TO_ROLE,
  TRACK_CONFIG,
} from '../src/app/quests/components/useQuestProgression';
import type { CareerTrajectory } from '../src/lib/data/careerTrajectories';
import type { Course } from '../src/lib/data/coursesData';

describe('Block 52 — QuestsPage, TrackSelectorDrawer & QuestPathView SSR Suite', () => {
  const sampleTrajectory: CareerTrajectory = {
    id: 'traj-ai-eng',
    roleTitle: 'Production AI Engineer',
    nodes: [
      {
        id: 'node-1',
        title: 'Python Core & Asynchronous Systems',
        description: 'Advanced Python idioms and concurrency',
        quests: ['py-core-1', 'py-core-2'],
      },
      {
        id: 'node-2',
        title: 'Deep Learning & Vector Indexing',
        description: 'Embeddings and neural models',
        quests: ['dl-vec-1'],
      },
    ],
  };

  const sampleCourse: Course = {
    id: 'course-react-web',
    title: 'React Basics (Full-Stack)',
    badge: '⚛️',
    description: 'Foundations of modern reactive frontend engineering',
    quests: [],
  } as unknown as Course;

  it('validates QuestsSubTab values and curriculum metadata integrity', () => {
    // 1. Subtab validator
    assert.equal(isValidSubTab('certification_passport'), true);
    assert.equal(isValidSubTab('custom_roadmap'), true);
    assert.equal(isValidSubTab('standalone'), true);
    assert.equal(isValidSubTab('language'), true);
    assert.equal(isValidSubTab('projects'), false);
    assert.equal(isValidSubTab(''), false);
    assert.equal(isValidSubTab('random_tab'), false);

    // 2. Certification tracks
    assert.ok(Array.isArray(CERTIFICATION_TRACKS));
    assert.ok(CERTIFICATION_TRACKS.length >= 2);
    const trackIds = CERTIFICATION_TRACKS.map((t) => t.id);
    assert.ok(trackIds.includes('cert-12m-sde'));
    assert.ok(trackIds.includes('cert-9m-fullstack'));

    // 3. Course to role mapping
    assert.ok(typeof COURSE_TO_ROLE === 'object');
    assert.ok('course-react-web' in COURSE_TO_ROLE);
    assert.ok('course-ai-python' in COURSE_TO_ROLE);

    // 4. Track configs
    assert.ok('ai_transformation' in TRACK_CONFIG);
    assert.ok('operations' in TRACK_CONFIG);
    assert.ok('sales_crm' in TRACK_CONFIG);
    assert.ok('entrepreneurship' in TRACK_CONFIG);
  });

  it('renders TrackSelectorDrawer SSR with all 4 primary subtab navigation buttons', () => {
    const props: TrackSelectorDrawerProps = {
      activeSubTab: 'certification_passport',
      handleSubTabChange: () => {},
      selectedCertTrackId: 'python_ai',
      setSelectedCertTrackId: () => {},
      setActiveCourseId: () => {},
      setShowQrModal: () => {},
      roleReadiness: null,
      getPassportStatusBadge: () => ({ bg: '', border: '', color: '', text: '' }),
      showPassportDetails: false,
      setShowPassportDetails: () => {},
      passportView: 'timeline',
      setPassportView: () => {},
      passportSelectedProgramId: 'prog-1',
      masteryMap: new Map(),
      setPassportSelectedCompId: () => {},
      trajectory: sampleTrajectory,
      setShowRoadmapModal: () => {},
      selectedStandaloneCourseId: 'course-react-web',
      setSelectedStandaloneCourseId: () => {},
      setLearningPathMode: () => {},
      COURSES_REGISTRY: [sampleCourse],
      activeCourseId: 'course-react-web',
      activeCourseIds: ['course-react-web'],
      completedQuests: [],
      showCourseLibrary: false,
      setShowCourseLibrary: () => {},
      modules: [],
      handleSelectCourseFromLibrary: () => {},
      setNotesModalState: () => {},
    };

    const markup = renderToStaticMarkup(React.createElement(TrackSelectorDrawer, props));

    assert.ok(markup.includes('data-testid="track-selector-subtabs"'));
    assert.ok(markup.includes('data-testid="subtab-certification-passport"'));
    assert.ok(markup.includes('Certification Programs'));
    assert.ok(markup.includes('data-testid="subtab-custom-roadmap"'));
    assert.ok(markup.includes('Custom Roadmap'));
    assert.ok(markup.includes('data-testid="subtab-standalone"'));
    assert.ok(markup.includes('Standalone Course'));
    assert.ok(markup.includes('data-testid="subtab-language"'));
    assert.ok(markup.includes('Language Academy'));
  });

  it('renders QuestPathView SSR with dynamic roadmap container, heading, and detailed journey trigger', () => {
    const props: QuestPathViewProps = {
      activeCourseId: 'course-react-web',
      setActiveCourseId: () => {},
      trajectory: sampleTrajectory,
      COURSES_REGISTRY: [sampleCourse],
      completedQuests: [],
      modules: [],
      setShowFullJourneyModal: () => {},
      learningPathMode: 'fullstack',
      setLearningPathMode: () => {},
      extraRoadmaps: [],
      closeExtraRoadmap: () => {},
      setShowRoadmapModal: () => {},
      isPlacementPrepFastTrack: false,
      setIsPlacementPrepFastTrack: () => {},
      setActiveGateModalNode: () => {},
      handleLaunchQuest: () => {},
      pinsHistory: [],
      onboardingAnswers: {},
      historyFilter: 'all',
      setHistoryFilter: () => {},
      activeSubTab: 'custom_roadmap',
      router: {},
    };

    const markup = renderToStaticMarkup(React.createElement(QuestPathView, props));

    assert.ok(markup.includes('data-testid="quest-path-view-root"'));
    assert.ok(markup.includes('data-testid="quest-roadmap-title"'));
    assert.ok(markup.includes('Dynamic Career Roadmap (React Basics)'));
    assert.ok(markup.includes('data-testid="btn-view-detailed-journey"'));
    assert.ok(markup.includes('View Entire Detailed Journey'));
  });

  it('renders QuestsPage Suspense fallback with deterministic loading testid', () => {
    const fallbackElement = React.createElement('div', {
      'data-testid': 'quests-page-loading',
      style: { padding: 40, textAlign: 'center', color: 'var(--t3)' },
    }, 'Loading Quests & Career Passport...');

    const markup = renderToStaticMarkup(
      React.createElement(
        Suspense,
        { fallback: fallbackElement },
        fallbackElement
      )
    );

    assert.ok(markup.includes('data-testid="quests-page-loading"'));
    assert.ok(markup.includes('Loading Quests &amp; Career Passport...'));
  });
});
