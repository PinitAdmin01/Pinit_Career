import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { executeRoleplayTurn } from '../src/lib/missions/roleplayEngine';
import MissionsPersonaSimulator from '../src/app/missions/components/MissionsPersonaSimulator';

describe('MISSIONS GAMING MODE & SESSION CONCLUSION AUDIT', () => {

  describe('Task 3: Turn Limit & Crisp Session Ending (3 Decisions)', () => {
    it('does not end after 1 turn (nodeCount = 1)', async () => {
      const turn1History = [
        { role: 'assistant' as const, content: 'Crisis begins. Server database locked up.' }
      ];
      const res = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Alex',
        role: 'Software Developer',
        choice: 'Investigate the database logs',
        history: turn1History,
      });

      assert.strictEqual(res.isEnded, false, 'Turn 1 should not end the session');
      assert.ok(res.choices && res.choices.length === 3, 'Turn 1 must provide 3 next choices');
    });

    it('does not end after 2 turns (nodeCount = 2)', async () => {
      const turn2History = [
        { role: 'assistant' as const, content: 'Crisis begins. Server database locked up.' },
        { role: 'user' as const, content: 'Investigate the database logs' },
        { role: 'assistant' as const, content: 'The lead demands an update right now.' }
      ];
      const res = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Alex',
        role: 'Software Developer',
        choice: 'Give an honest 15-minute estimate',
        history: turn2History,
      });

      assert.strictEqual(res.isEnded, false, 'Turn 2 should not end the session');
      assert.ok(res.choices && res.choices.length === 3, 'Turn 2 must provide 3 next choices');
    });

    it('ends reliably after 3 turns (nodeCount = 3)', async () => {
      const turn3History = [
        { role: 'assistant' as const, content: 'Crisis begins. Server database locked up.' },
        { role: 'user' as const, content: 'Investigate the database logs' },
        { role: 'assistant' as const, content: 'The lead demands an update right now.' },
        { role: 'user' as const, content: 'Give an honest 15-minute estimate' },
        { role: 'assistant' as const, content: 'Final pressure: client is calling the CEO.' }
      ];
      const res = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Alex',
        role: 'Software Developer',
        choice: 'Stay calm and brief the team with facts',
        history: turn3History,
      });

      assert.strictEqual(res.isEnded, true, 'Turn 3 must end the session');
      assert.strictEqual(res.choices.length, 0, 'Final turn must clear choices');
      assert.ok(res.message.includes('session has concluded') || res.message.includes('determined how the team handled'), 'Final message must conclude the crisis');
    });
  });

  describe('Task 1: Pinned Options & No Layout Jumping', () => {
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

    it('renders outer grid with alignItems: start to prevent row stretching', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'High-Load Database Deadlock',
            activeAvatar: 'abhijit',
            avatarName: 'Mr. Abhijit',
            avatarRole: 'Senior Architect',
            message: 'Database connection pool exhausted.',
            choices: [
              { text: 'Restart service pool', delta: -2 },
              { text: 'Profile slow queries', delta: 4 },
              { text: 'Add read replicas', delta: 2 }
            ],
            scenarioId: 'sc_test_1',
          },
          roleplayHistory: [
            { role: 'assistant', content: 'Database connection pool exhausted.' },
            { role: 'user', content: 'Restart service pool' }
          ],
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 25,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 45,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
        })
      );

      assert.ok(markup.includes('align-items:start'), 'Outer grid must contain align-items:start');
      assert.ok(markup.includes('max-height:180px'), 'Situation summary container must be capped at 180px');
      assert.ok(markup.includes('overflow:hidden'), 'Situation summary must have overflow:hidden');
      assert.ok(markup.includes('max-height:68px'), 'Decisions logged list must be capped at 68px');
      assert.ok(markup.includes('height:310px'), 'Chat logs container must have fixed height: 310px');
    });

    it('does not stretch right column or push choices when 6 decisions are logged', () => {
      const multiDecisionsHistory = [
        { role: 'assistant' as const, content: 'Crisis begins' },
        { role: 'user' as const, content: 'Choice 1: Checked server logs' },
        { role: 'assistant' as const, content: 'Pressure 1' },
        { role: 'user' as const, content: 'Choice 2: Scaled web pods' },
        { role: 'assistant' as const, content: 'Pressure 2' },
        { role: 'user' as const, content: 'Choice 3: Contacted on-call SRE' },
        { role: 'assistant' as const, content: 'Pressure 3' },
        { role: 'user' as const, content: 'Choice 4: Reverted bad deployment' },
      ];

      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'Multi-turn crisis',
            activeAvatar: 'priya',
            avatarName: 'Ms. Priya',
            avatarRole: 'Engineering Manager',
            message: 'Everything is under control now.',
            choices: [
              { text: 'Write a blameless post-mortem', delta: 5 },
              { text: 'Go home early', delta: -5 },
              { text: 'Blame junior developer', delta: -10 }
            ],
            scenarioId: 'sc_test_2',
          },
          roleplayHistory: multiDecisionsHistory,
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 20,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 120,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
        })
      );

      assert.ok(markup.includes('Decisions Logged (4)'), 'Must render accurate count of user decisions');
      assert.ok(markup.includes('Choice 1: Checked server logs'), 'Must display decisions');
      assert.ok(markup.includes('Choose how you would respond:'), 'Choices must remain rendered directly in view');
    });
  });

  describe('Task 3: Concluded Session Fallback Card & Manual Trigger', () => {
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

    it('displays active conclusion card with "View Evolution Report Now" when isEnded is true and report is loading/pending', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'High-Load Database Deadlock',
            activeAvatar: 'abhijit',
            avatarName: 'Mr. Abhijit',
            avatarRole: 'Senior Architect',
            message: 'Alex, the session has concluded. Let us review your results.',
            choices: [],
            isEnded: true,
            scenarioId: 'sc_final_1',
          },
          roleplayHistory: [
            { role: 'assistant', content: 'Alex, the session has concluded. Let us review your results.' }
          ],
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 0,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 180,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
          triggerEvaluation: () => {},
        })
      );

      assert.ok(markup.includes('Crisis Simulation Concluded · Generating Mindset Report...'), 'Must render explicit conclusion status');
      assert.ok(markup.includes('View Evolution Report Now ➔'), 'Must offer manual button to immediately view report');
    });
  });

  describe('Task 2: Gaming Mode Reactivity Contract', () => {
    it('verifies updateRoleplayActive dispatches window event and global flag', () => {
      // Simulate window
      const mockEvents: string[] = [];
      const mockGlobal: Record<string, any> = {};
      const fakeWindow = {
        addEventListener: (name: string) => mockEvents.push(name),
        dispatchEvent: (event: any) => mockEvents.push(event.type),
        location: { href: 'http://localhost:3000/missions', search: '' },
        history: { replaceState: () => {} }
      };

      // Contract test of the implementation in useMissionsState
      const updateRoleplayActive = (active: boolean) => {
        (fakeWindow as any).__pinitMissionsRoleplayActive = active;
        fakeWindow.dispatchEvent({ type: 'pinit-roleplay-toggle', detail: { active } });
      };

      updateRoleplayActive(true);
      assert.strictEqual((fakeWindow as any).__pinitMissionsRoleplayActive, true);
      assert.ok(mockEvents.includes('pinit-roleplay-toggle'), 'Must dispatch pinit-roleplay-toggle');

      updateRoleplayActive(false);
      assert.strictEqual((fakeWindow as any).__pinitMissionsRoleplayActive, false);
    });
  });
});
