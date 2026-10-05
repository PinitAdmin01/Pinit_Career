import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTappableLabelsForVisual,
  tokenizeParagraphWithUnderlines,
  shouldShowSpaceDots,
} from '../src/lib/visuals/visualRules';
import { PYTHON_M1_VISUALS } from '../src/lib/data/lessonVisuals/pythonMonth1Visuals';
import type { LessonVisual } from '../src/lib/types/lessonVisual';

test('Rule 1: no underlines for table, letters or compare visuals', () => {
  const tableVisual: LessonVisual = {
    template: 'table',
    title: 'Test Table',
    columns: ['Col 1', 'Col 2'],
    steps: [{ at: 'say1', caption: 'Step 1.', rows: [{ cells: ['line', 'print'], tone: 'ok' }] }],
  };
  const lettersVisual: LessonVisual = {
    template: 'letters',
    title: 'Test Letters',
    text: 'Priya',
    steps: [{ at: 'say1', caption: 'Step 1.', result: 'P', tone: 'ok' }],
  };
  const compareVisual: LessonVisual = {
    template: 'compare',
    title: 'Test Compare',
    leftLabel: 'Left',
    rightLabel: 'Right',
    steps: [{
      at: 'say1',
      caption: 'Step 1.',
      left: { code: 'a', result: '1', tone: 'ok', checks: [] },
      right: { code: 'b', result: '2', tone: 'ok', checks: [] },
    }],
  };

  assert.deepEqual(getTappableLabelsForVisual(tableVisual), []);
  assert.deepEqual(getTappableLabelsForVisual(lettersVisual), []);
  assert.deepEqual(getTappableLabelsForVisual(compareVisual), []);

  // For Part 1.3 (table visual), tappable labels must be empty -> 0 underlines
  const part13 = PYTHON_M1_VISUALS['python:1:2'];
  assert.ok(part13, 'python:1:2 exists');
  assert.deepEqual(getTappableLabelsForVisual(part13.visual), []);
});

test('Rule 2: flow and boxes provide tappable labels', () => {
  const flowVisual: LessonVisual = {
    template: 'flow',
    title: 'Test Flow',
    nodes: [
      { id: 'n1', label: 'balance' },
      { id: 'n2', label: 'total', tappable: false },
    ],
    steps: [{ at: 'say1', caption: 'Step 1.', values: {}, tones: {}, arrows: [] }],
  };
  assert.deepEqual(getTappableLabelsForVisual(flowVisual), ['balance']);
});

test('Rule 3: underline only the first match per paragraph', () => {
  const labels = ['balance', 'cost'];
  const paragraph = 'Your balance starts at 500. Then balance decreases when cost is added. Total balance is now lower.';

  const tokens = tokenizeParagraphWithUnderlines(paragraph, labels);
  const underlined = tokens.filter(t => t.isUnderlined).map(t => t.text.toLowerCase());

  // 'balance' occurs 3 times, but only the first must be underlined. 'cost' occurs once.
  assert.deepEqual(underlined, ['balance', 'cost']);

  // Second paragraph: each paragraph gets its own fresh first match
  const paragraph2 = 'Check your balance again tomorrow.';
  const tokens2 = tokenizeParagraphWithUnderlines(paragraph2, labels);
  const underlined2 = tokens2.filter(t => t.isUnderlined).map(t => t.text.toLowerCase());
  assert.deepEqual(underlined2, ['balance']);
});

test('Rule 4: show space dots only where visual data has showSpaces: true', () => {
  // Parts 3.1 (python:3:0), 3.4 (python:3:3), and 3.6 (python:3:5) must have showSpaces: true
  const part31 = PYTHON_M1_VISUALS['python:3:0'];
  const part34 = PYTHON_M1_VISUALS['python:3:3'];
  const part36 = PYTHON_M1_VISUALS['python:3:5'];

  assert.ok(part31, 'python:3:0 exists');
  assert.ok(part34, 'python:3:3 exists');
  assert.ok(part36, 'python:3:5 exists');

  assert.equal(shouldShowSpaceDots(part31.visual), true);
  assert.equal(shouldShowSpaceDots(part34.visual), true);
  assert.equal(shouldShowSpaceDots(part36.visual), true);

  // Other parts like 1.3 (python:1:2) and 2.2 (python:2:1) must NOT show space dots
  const part13 = PYTHON_M1_VISUALS['python:1:2'];
  const part22 = PYTHON_M1_VISUALS['python:2:1'];
  assert.equal(shouldShowSpaceDots(part13.visual), false);
  assert.equal(shouldShowSpaceDots(part22.visual), false);
});
