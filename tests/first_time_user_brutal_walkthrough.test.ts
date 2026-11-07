import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { executeRoleplayTurn } from '../src/lib/missions/roleplayEngine';
import MissionsPersonaSimulator from '../src/app/missions/components/MissionsPersonaSimulator';
import MissionsGrowthRadar from '../src/components/missions/MissionsGrowthRadar';
import MissionsArchetypeMatrix from '../src/components/missions/MissionsArchetypeMatrix';
import MissionsEvolveBanner from '../src/app/missions/components/MissionsEvolveBanner';
import LinguaLab from '../src/components/missions/LinguaLab';
import { CareerOSProvider } from '../src/lib/context/CareerOSContext';

describe('BRUTAL FIRST-TIME USER FULL JOURNEY AUDIT', () => {
  const dummyTheme = {
    bg: '#0a0a0a',
    bgCard: '#121212',
    bgInside: '#181818',
    border: '#2a2a2a',
    tPrimary: '#ffffff',
    tSecondary: '#a0a0a0',
    tTertiary: '#666666',
    accentLight: '#2dd4bf',
  };

  describe('1. First-Time Landing: Uncalibrated Baseline Integrity', () => {
    it('Radar displays "null" across all 5 spokes when user has completed 0 missions', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsGrowthRadar, {
          theme: dummyTheme,
          communication_score: 75,
          execution_score: 75,
          leadership_score: 75,
          intelligence_score: 75,
          streak: 0,
          hoveredSpoke: null,
          setHoveredSpoke: () => {},
          hasCompletedAnyMission: false,
        })
      );

      assert.ok(markup.includes('null (Uncalibrated)'), 'Top status badge must say null (Uncalibrated)');
      assert.ok(markup.includes('UNCALIBRATED'), 'Center radar badge must show UNCALIBRATED');
      assert.ok(markup.includes('0 Missions Done'), 'Must show 0 Missions Done');
      assert.ok(markup.includes('Baseline Calibration Pending'), 'Must show Baseline Calibration Pending');
      assert.ok(markup.includes('Start Mission'), 'Must render Start Mission CTA');
    });

    it('Matrix displays CALIBRATION PENDING and null archetype when user has completed 0 missions', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsArchetypeMatrix, {
          theme: dummyTheme,
          mindsetArchetype: 'Pattern Hunter',
          qt2Score: 75,
          hoveredQuadrant: null,
          setHoveredQuadrant: () => {},
          selectedQuadrant: null,
          setSelectedQuadrant: () => {},
          hasCompletedAnyMission: false,
        })
      );

      assert.ok(markup.includes('CALIBRATION PENDING'), 'Matrix center pin must say CALIBRATION PENDING');
      assert.ok(markup.includes('Mindset Archetype: null (Uncalibrated)'), 'Must show null Archetype');
      assert.ok(markup.includes('Pending Baseline'), 'Must indicate Pending Baseline');
    });

    it('Evolve Banner shows clear prompt to calibrate baseline with zero mock leakage', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsEvolveBanner, {
          theme: dummyTheme,
          onboardingAnswers: { role: 'Software Developer' },
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

      assert.ok(markup.includes('Pending Baseline'), 'Evolve banner must announce Pending Baseline');
      assert.ok(markup.includes('null (Uncalibrated)'), 'Must show null (Uncalibrated) for Archetype');
      assert.ok(markup.includes('🧠 null'), 'Must show 🧠 null for QT2 Score');
      assert.ok(markup.includes('Enter real-life crisis simulations'), 'Must describe mission intent');
    });
  });

  describe('2. Active Crisis Simulation: Gaming Mode & Pinned UI', () => {
    it('Simulator layout pins choices: outer grid has align-items:start and capped Situation Summary', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'Critical Incident',
            activeAvatar: 'abhijit',
            avatarName: 'Mr. Abhijit',
            avatarRole: 'Principal Architect',
            message: 'What is your immediate remediation plan?',
            choices: [
              { text: 'Scale pod replicas', delta: 2 },
              { text: 'Rollback recent migration', delta: 4 },
              { text: 'Wait and monitor', delta: -5 }
            ],
            scenarioId: 'sc_test_run',
          },
          roleplayHistory: [
            { role: 'assistant', content: 'What is your immediate remediation plan?' },
            { role: 'user', content: 'Scale pod replicas' }
          ],
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 22,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 30,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
          triggerEvaluation: () => {},
        })
      );

      assert.ok(markup.includes('align-items:start'), 'Grid must specify align-items:start');
      assert.ok(markup.includes('max-height:180px'), 'Situation summary capped at 180px');
      assert.ok(markup.includes('max-height:68px'), 'Decisions list capped at 68px');
      assert.ok(markup.includes('height:310px'), 'Chat logs pinned at 310px');
      assert.ok(markup.includes('Scale pod replicas'), 'User decision rendered in log');
    });

    it('Disables choice buttons when roleplayLoading is true', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'Critical Incident',
            activeAvatar: 'abhijit',
            avatarName: 'Mr. Abhijit',
            avatarRole: 'Principal Architect',
            message: 'Analyzing move...',
            choices: [
              { text: 'A', delta: 1 },
              { text: 'B', delta: 2 },
              { text: 'C', delta: 3 }
            ],
            scenarioId: 'sc_load_test',
          },
          roleplayHistory: [],
          roleplayLoading: true, // IN FLIGHT
          animState: 'thinking',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 20,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 15,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
          triggerEvaluation: () => {},
        })
      );

      assert.ok(markup.includes('disabled=""'), 'Buttons must be disabled while request is loading');
      assert.ok(markup.includes('cursor:not-allowed'), 'Buttons must indicate not-allowed cursor while loading');
    });
  });

  describe('3. Turn Limitation & Session Ending Enforcement', () => {
    it('Crisp 3-turn format: completes after exactly 3 user choices', async () => {
      const history = [
        { role: 'assistant' as const, content: 'Crisis Step 1' },
        { role: 'user' as const, content: 'Choice 1' },
        { role: 'assistant' as const, content: 'Crisis Step 2' },
        { role: 'user' as const, content: 'Choice 2' },
        { role: 'assistant' as const, content: 'Crisis Step 3' }
      ];

      const turn3Response = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Priya',
        role: 'Data Analyst',
        choice: 'Final Strategic Choice 3',
        history,
      });

      assert.strictEqual(turn3Response.isEnded, true, 'Must end the session after 3 decisions');
      assert.strictEqual(turn3Response.choices.length, 0, 'Must clear choices on ending');
      assert.ok(turn3Response.message.toLowerCase().includes('concluded'), 'Verdict message must declare session conclusion');
    });

    it('Displays conclusion banner with manual report trigger when isEnded is true and report is preparing', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'High-Load Incident',
            activeAvatar: 'rohan',
            avatarName: 'Mr. Rohan',
            avatarRole: 'Tech Lead',
            message: 'Session has concluded. Outstanding handling.',
            choices: [],
            isEnded: true,
            scenarioId: 'sc_concluded',
          },
          roleplayHistory: [
            { role: 'assistant', content: 'Session has concluded. Outstanding handling.' }
          ],
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 0,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 120,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
          triggerEvaluation: () => {},
        })
      );

      assert.ok(markup.includes('Crisis Simulation Concluded · Generating Mindset Report...'), 'Must render conclusion card');
      assert.ok(markup.includes('View Evolution Report Now ➔'), 'Must offer manual View Report CTA');
    });

    it('Renders Socratic Evolution Report with score delta and return button when evaluation completes', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'High-Load Incident',
            activeAvatar: 'rohan',
            avatarName: 'Mr. Rohan',
            avatarRole: 'Tech Lead',
            message: 'Session has concluded.',
            choices: [],
            isEnded: true,
            scenarioId: 'sc_concluded',
          },
          roleplayHistory: [],
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: 'Clear communication under stress.\nDemonstrated System 2 deliberative problem solving.',
          evaluationLoading: false,
          timerCount: 0,
          selectedChoiceIdx: null,
          qt2Delta: 5,
          sessionElapsed: 125,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
          triggerEvaluation: () => {},
        })
      );

      assert.ok(markup.includes('🧠 Socratic Evolution Report'), 'Must render evolution report header');
      assert.ok(markup.includes('Score: +5 points'), 'Must display positive score delta');
      assert.ok(markup.includes('Demonstrated System 2 deliberative problem solving.'), 'Must render evaluation breakdown');
      assert.ok(markup.includes('Return to Command Center'), 'Must provide Return to Command Center button');
    });
  });

  describe('4. Career Communication Lab (Subtab 2): Real-World Polish', () => {
    it('Renders clean interface with domain filters and voice dictation support', () => {
      const markup = renderToStaticMarkup(
        React.createElement(
          CareerOSProvider,
          null,
          React.createElement(LinguaLab, {
            streak: 3,
            theme: dummyTheme,
            activeCourseId: 'cs_fullstack',
            role: 'Full Stack Engineer',
          })
        )
      );

      assert.ok(markup.includes('Workplace Communication Simulator'), 'Must render LinguaLab title');
      assert.ok(markup.includes('Speak Your Answer (Voice Dictation)'), 'Must render voice dictation button');
      assert.ok(markup.includes('Check Corporate Communication'), 'Must render submit button');
    });
  });
});
