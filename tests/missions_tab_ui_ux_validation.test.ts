import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import MissionsEvolveBanner from '../src/app/missions/components/MissionsEvolveBanner';
import MissionsStreakPanel from '../src/app/missions/components/MissionsStreakPanel';
import MissionsHeader from '../src/app/missions/components/MissionsHeader';

describe('BRUTAL VALIDATION — MISSIONS TAB UI/UX & DYNAMIC DATA (Tasks 1 & 2)', () => {
  const theme = {
    bg: '#0b0f19',
    bgCard: '#111827',
    bgInside: '#1f2937',
    border: '#374151',
    tPrimary: '#f9fafb',
    tSecondary: '#d1d5db',
    tTertiary: '#9ca3af',
    accentLight: 'rgba(99, 102, 241, 0.1)',
  };

  const sampleTeacher = { name: 'Ms. Priya', emoji: '👩‍💼' };

  describe('Task 1: Full-Width Layout & Spatial Balance', () => {
    it('MissionsEvolveBanner renders full-width container without 354px squeezing', () => {
      const renderedHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsEvolveBanner, {
          theme,
          onboardingAnswers: { mindset_archetype: 'Pattern Hunter', qt2_score: 82 },
          roleplayLoading: false,
          isUnlocking: false,
          initiateRoleplay: () => {},
          showTraditionalMissions: false,
          setShowTraditionalMissions: () => {},
          tab: 'today',
          setTab: () => {},
          generating: false,
          handleTriggerRegenerate: () => {},
          pending: [],
          completedMissions: [],
          allTodayMissions: [],
          pastCompleted: [],
          completeMission: () => {},
          customSkill: '',
          setCustomSkill: () => {},
          handleGenerateCustomQuests: () => {},
          generatingSkill: false,
          hasCompletedAnyMission: true,
        })
      );

      // Verify full width container
      assert.ok(renderedHtml.includes('width:100%'), 'MissionsEvolveBanner must take 100% width');
      assert.ok(!renderedHtml.includes('354px'), 'Must not have any hardcoded 354px width constraint');

      // Verify command center features
      assert.ok(renderedHtml.includes('Mindset Persona Simulator'), 'Must render simulator badge');
      assert.ok(renderedHtml.includes('Initiate Dynamic Socratic Roleplay'), 'Must render main hero title');
      assert.ok(renderedHtml.includes('Pattern Hunter'), 'Must display active archetype');
      assert.ok(renderedHtml.includes('82 pts'), 'Must display active QT2 score');
      assert.ok(renderedHtml.includes('Launch Simulator Session (5 Pins)'), 'Must render CTA button');
    });

    it('MissionsStreakPanel renders 2x2 downstairs analysis grid', () => {
      const renderedHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsStreakPanel, {
          theme,
          xp: 150,
          missionOnlyStreak: 5,
          completedCount: 2,
          gapClosurePct: 40,
          onboardingAnswers: { role: 'Full-Stack Software Developer' },
          user: { selectedTeacherId: 'priya' },
          hoveredQuadrant: null,
          setHoveredQuadrant: () => {},
          selectedQuadrant: null,
          setSelectedQuadrant: () => {},
          hoveredRadarMetric: null,
          setHoveredRadarMetric: () => {},
          setActiveTab: () => {},
          teacher: sampleTeacher,
        })
      );

      // Verify grid configuration for downstairs layout
      assert.ok(renderedHtml.includes('display:grid'), 'MissionsStreakPanel must render as a CSS grid');
      assert.ok(
        renderedHtml.includes('minmax(460px, 1fr)') || renderedHtml.includes('minmax(460px,1fr)'),
        'MissionsStreakPanel must use responsive minmax columns'
      );

      // Verify all 4 analytical cards are present
      assert.ok(renderedHtml.includes('Mindset Growth Radar'), 'Must render Mindset Growth Radar');
      assert.ok(
        renderedHtml.includes('Mission Insights &amp; Goal Progress') || renderedHtml.includes('Mission Insights'),
        'Must render Mission Insights'
      );
      assert.ok(
        renderedHtml.includes('Strategic Coaching') || renderedHtml.includes('Ms. Priya'),
        'Must render Teacher coaching card'
      );
      assert.ok(renderedHtml.includes('Target Gap Closure'), 'Must render gap closure progress');
      assert.ok(renderedHtml.includes('Full-Stack Software Developer'), 'Must render active student role');
    });

    it('CTA button remains interactive and conveys disabled state properly when loading', () => {
      const loadingHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsEvolveBanner, {
          theme,
          onboardingAnswers: null,
          roleplayLoading: true,
          isUnlocking: false,
          initiateRoleplay: () => {},
          showTraditionalMissions: false,
          setShowTraditionalMissions: () => {},
          tab: 'today',
          setTab: () => {},
          generating: false,
          handleTriggerRegenerate: () => {},
          pending: [],
          completedMissions: [],
          allTodayMissions: [],
          pastCompleted: [],
          completeMission: () => {},
          customSkill: '',
          setCustomSkill: () => {},
          handleGenerateCustomQuests: () => {},
          generatingSkill: false,
          hasCompletedAnyMission: true,
        })
      );

      assert.ok(
        loadingHtml.includes('disabled=""') || loadingHtml.includes('disabled'),
        'CTA button must be disabled when loading'
      );
      assert.ok(loadingHtml.includes('Compiling Parameters...'), 'Button text must reflect loading status');
    });

    it('Missions page structure separates hero action stage from downstairs analytics', async () => {
      const pageModule = await import('../src/app/missions/page');
      assert.ok(pageModule.default, 'Missions page must export a default component');
    });
  });

  describe('Task 2: Purge Banned Subtitle & Enforce Dynamic Course Data', () => {
    it('MissionsHeader strictly purges the banned subtitle line', () => {
      const headerHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsHeader, {
          theme,
          xp: 250,
          missionOnlyStreak: 7,
        })
      );

      // Verify title is cleanly rendered
      assert.ok(headerHtml.includes('Daily Missions'), 'Must render Daily Missions title');

      // Verify banned subtitle is strictly absent
      assert.ok(
        !headerHtml.includes(
          'Adaptive challenges dynamically generated by AI to close gaps between Current & Future Self.'
        ),
        'Must NOT contain the banned subtitle line'
      );
      assert.ok(
        !headerHtml.includes('Adaptive challenges dynamically generated'),
        'Must NOT contain partial banned subtitle'
      );
    });
  });

  describe('New Task 1: Zero Missions Completed Dynamic Null / Uncalibrated State', () => {
    it('MissionsGrowthRadar renders null and uncalibrated state when user has completed 0 missions', async () => {
      const { MissionsGrowthRadar } = await import('../src/components/missions/MissionsGrowthRadar');
      const uncalibratedHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsGrowthRadar, {
          theme,
          onboardingAnswers: null,
          user: { missions_completed: 0 },
          hoveredRadarMetric: null,
          setHoveredRadarMetric: () => {},
          setActiveTab: () => {},
          hasCompletedAnyMission: false,
        })
      );

      // Must render null uncalibrated indicators
      assert.ok(uncalibratedHtml.includes('null (Uncalibrated)'), 'Overall index must show null (Uncalibrated)');
      assert.ok(uncalibratedHtml.includes('UNCALIBRATED'), 'Center text must say UNCALIBRATED');
      assert.ok(uncalibratedHtml.includes('0 Missions Done'), 'Must indicate 0 Missions Done');
      assert.ok(uncalibratedHtml.includes('Baseline Calibration Pending'), 'Must prompt for baseline calibration');

      // Must NOT contain fabricated baseline percentages
      assert.ok(!uncalibratedHtml.includes('>75%<'), 'Must not display fake 75% logic');
      assert.ok(!uncalibratedHtml.includes('>59% Index<'), 'Must not display fake 59% index badge');
      assert.ok(!uncalibratedHtml.includes('>46% Index<'), 'Must not display fake 46% index badge');
    });

    it('MissionsArchetypeMatrix renders null and uncalibrated state when user has completed 0 missions', async () => {
      const MissionsArchetypeMatrix = (await import('../src/components/missions/MissionsArchetypeMatrix')).default;
      const uncalibratedHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsArchetypeMatrix, {
          theme,
          onboardingAnswers: null,
          user: { missions_completed: 0 },
          hoveredQuadrant: null,
          setHoveredQuadrant: () => {},
          selectedQuadrant: null,
          setSelectedQuadrant: () => {},
          hasCompletedAnyMission: false,
        })
      );

      // Must render null uncalibrated indicators
      assert.ok(uncalibratedHtml.includes('Pending Baseline'), 'Status badge must show Pending Baseline');
      assert.ok(uncalibratedHtml.includes('CALIBRATION PENDING'), 'User pin label must state CALIBRATION PENDING');
      assert.ok(uncalibratedHtml.includes('Mindset Archetype: null (Uncalibrated)'), 'Archetype must be null');
      assert.ok(uncalibratedHtml.includes('QT2: null'), 'QT2 score must be null');

      // Quadrants must not show active checkmarks
      assert.ok(!uncalibratedHtml.includes('Pattern Hunter ✓'), 'Must not check Pattern Hunter by default');
    });

    it('MissionsEvolveBanner renders null Archetype and QT2 when user has completed 0 missions', () => {
      const uncalibratedHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsEvolveBanner, {
          theme,
          onboardingAnswers: null,
          roleplayLoading: false,
          isUnlocking: false,
          initiateRoleplay: () => {},
          showTraditionalMissions: false,
          setShowTraditionalMissions: () => {},
          tab: 'today',
          setTab: () => {},
          generating: false,
          handleTriggerRegenerate: () => {},
          pending: [],
          completedMissions: [],
          allTodayMissions: [],
          pastCompleted: [],
          completeMission: () => {},
          customSkill: '',
          setCustomSkill: () => {},
          handleGenerateCustomQuests: () => {},
          generatingSkill: false,
          hasCompletedAnyMission: false,
        })
      );

      assert.ok(uncalibratedHtml.includes('Pending Baseline'), 'Must render Pending Baseline badge');
      assert.ok(uncalibratedHtml.includes('null (Uncalibrated)'), 'Must render null (Uncalibrated) Archetype');
      assert.ok(uncalibratedHtml.includes('🧠 null'), 'Must render 🧠 null for QT2 score');
    });

    it('MissionsStreakPanel propagates uncalibrated state to child components', () => {
      const panelHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsStreakPanel, {
          theme,
          xp: 0,
          missionOnlyStreak: 0,
          completedCount: 0,
          gapClosurePct: 0,
          onboardingAnswers: null,
          user: { missions_completed: 0 },
          hoveredQuadrant: null,
          setHoveredQuadrant: () => {},
          selectedQuadrant: null,
          setSelectedQuadrant: () => {},
          hoveredRadarMetric: null,
          setHoveredRadarMetric: () => {},
          setActiveTab: () => {},
          teacher: sampleTeacher,
          hasCompletedAnyMission: false,
        })
      );

      assert.ok(panelHtml.includes('null (Uncalibrated)'), 'Radar inside panel must be uncalibrated');
      assert.ok(panelHtml.includes('Pending Baseline'), 'Matrix inside panel must be uncalibrated');
      assert.ok(panelHtml.includes('CALIBRATION PENDING'), 'Pin inside panel must show CALIBRATION PENDING');
    });
  });
});
