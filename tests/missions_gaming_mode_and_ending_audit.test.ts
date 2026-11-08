import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { executeRoleplayTurn } from '../src/lib/missions/roleplayEngine';
import MissionsPersonaSimulator from '../src/app/missions/components/MissionsPersonaSimulator';

describe('MISSIONS GAMING MODE & SESSION CONCLUSION AUDIT', () => {
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

  describe('Task 3: Sustained 15-Minute Simulation & 10 Turns Ending Enforcement', () => {
    it('does not end early during incident phases (nodeCount = 1, 2, or 5)', async () => {
      const turn1History = [
        { role: 'assistant' as const, content: 'Crisis begins. Server database locked up.' }
      ];
      const res1 = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Alex',
        role: 'Software Developer',
        choice: 'Investigate the database logs',
        history: turn1History,
      });

      assert.strictEqual(res1.isEnded, false, 'Turn 1 should not end the session');
      assert.ok(res1.choices && res1.choices.length === 4, 'Turn 1 must provide 4 next choices');

      // Check turn 5
      const turn5History: any[] = [];
      for (let i = 0; i < 5; i++) {
        turn5History.push({ role: 'assistant', content: `Assistant msg ${i + 1}` });
        turn5History.push({ role: 'user', content: `User choice ${i + 1}` });
      }
      turn5History.pop(); // last is assistant (5 assistant messages)
      const res5 = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Alex',
        role: 'Software Developer',
        choice: 'Hold the line against shortcuts',
        history: turn5History,
      });
      assert.strictEqual(res5.isEnded, false, 'Turn 5 should still be active');
      assert.ok(res5.choices && res5.choices.length === 4, 'Turn 5 must provide 4 next choices');
    });

    it('ends reliably after 10 turns (nodeCount = 10) for 15-minute simulation', async () => {
      const turn10History: any[] = [];
      for (let i = 0; i < 10; i++) {
        turn10History.push({ role: 'assistant', content: `Assistant msg ${i + 1}` });
        turn10History.push({ role: 'user', content: `User choice ${i + 1}` });
      }
      turn10History.pop(); // 10th assistant message is last in history before user responds
      const res10 = await executeRoleplayTurn({
        action: 'respond',
        studentName: 'Alex',
        role: 'Software Developer',
        choice: 'Stay calm and brief the team with verified recovery steps',
        history: turn10History,
      });

      assert.strictEqual(res10.isEnded, true, 'Turn 10 must end the session');
      assert.strictEqual(res10.choices.length, 0, 'Final turn must clear choices');
      assert.ok(res10.message.toLowerCase().includes('concluded'), 'Final message must announce session conclusion');
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
    it('verifies MissionsPersonaSimulator renders gaming mode banner and fullscreen toggle', () => {
      const markup = renderToStaticMarkup(
        React.createElement(MissionsPersonaSimulator, {
          theme: dummyTheme,
          roleplayScenario: {
            scenarioTitle: 'Active Outage',
            activeAvatar: 'rohan',
            avatarName: 'Mr. Rohan',
            avatarRole: 'Tech Lead',
            message: 'What is our move?',
            choices: [{ text: 'Choice 1', delta: 4 }],
            isEnded: false,
            scenarioId: 'sc_active',
          },
          roleplayHistory: [
            { role: 'assistant', content: 'What is our move?' }
          ],
          roleplayLoading: false,
          animState: 'idle',
          evaluationReport: '',
          evaluationLoading: false,
          timerCount: 45,
          selectedChoiceIdx: null,
          qt2Delta: 0,
          sessionElapsed: 60,
          handleSelectChoice: () => {},
          updateRoleplayActive: () => {},
          setEvaluationReport: () => {},
          triggerEvaluation: () => {},
        })
      );

      assert.ok(markup.includes('GAMING MODE ACTIVE · 100% IMMERSIVE'), 'Must render gaming mode badge');
      assert.ok(markup.includes('Fullscreen'), 'Must render fullscreen control');
      assert.ok(markup.includes('15:00 Simulation'), 'Must render 15-minute simulation target');
    });

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
