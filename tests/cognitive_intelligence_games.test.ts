import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createIqPuzzleSet,
  createMindMosaicSet,
  intelligenceProfileAverages,
  MCQ_PUZZLES,
  mergeIntelligenceProfile,
  scoreIqPuzzleSet,
  scoreMindMosaic,
} from '../src/components/attention-span/intelligenceGameData';

test('IQ puzzle forms stay balanced and keep shuffled answer keys valid', () => {
  for (const difficulty of ['easy', 'normal', 'hard'] as const) {
    const form = createIqPuzzleSet(difficulty, () => 0.42);
    assert.equal(form.length, 4);
    for (const area of ['logic', 'numerical', 'pattern', 'verbal'] as const) {
      assert.equal(form.filter((question) => question.area === area).length, 1);
    }
    for (const question of form) {
      assert.ok(question.answer >= 0 && question.answer < question.choices.length);
      assert.equal(question.choices[question.answer], MCQ_PUZZLES[difficulty].find((item) => item.id === question.id)?.choices[
        MCQ_PUZZLES[difficulty].find((item) => item.id === question.id)!.answer
      ]);
    }
    assert.equal(scoreIqPuzzleSet(form, form.map((question) => question.answer)).score, 100);
    assert.equal(scoreIqPuzzleSet(form, form.map(() => null)).score, 0);
    const first = scoreIqPuzzleSet(form, [form[0].answer]);
    assert.equal(first.score, 100);
    assert.equal(Object.keys(first.areaScores).length, 1);
  }
});

test('Mind Mosaic presents two scenarios per lens and scores each lens independently', () => {
  for (const difficulty of ['easy', 'normal', 'hard'] as const) {
    const scenarios = createMindMosaicSet(difficulty, () => 0.42);
    assert.equal(scenarios.length, 3);
    for (const dimension of ['creative', 'executive', 'social'] as const) {
      const selected = scenarios.map((scenario, index) => scenario.dimension === dimension ? index : -1).filter((index) => index >= 0);
      assert.equal(selected.length, 1);
      const answers = scenarios.map((scenario) => scenario.dimension === dimension
        ? scenario.choices.findIndex((choice) => choice.points === 2)
        : null);
      assert.equal(scoreMindMosaic(scenarios, answers).dimensionScores[dimension], 100);
    }
    const bestAnswers = scenarios.map((scenario) => scenario.choices.findIndex((choice) => choice.points === Math.max(...scenario.choices.map((item) => item.points))));
    assert.equal(scoreMindMosaic(scenarios, bestAnswers).score, 100);
    assert.equal(scoreMindMosaic(scenarios, scenarios.map(() => null)).score, 0);
    const partialAnswers = [bestAnswers[0], null, null];
    const partial = scoreMindMosaic(scenarios, partialAnswers);
    assert.equal(partial.score, 100);
    assert.equal(Object.keys(partial.dimensionScores).length, 1);
  }
});

test('intelligence profile averages accumulate only supplied, bounded practice signals', () => {
  const afterOne = mergeIntelligenceProfile(undefined, { reasoning: 80, creative: 70 });
  const afterTwo = mergeIntelligenceProfile(afterOne, { reasoning: 100, social: 130 });
  assert.deepEqual(intelligenceProfileAverages(afterTwo), { reasoning: 90, creative: 70, executive: 0, social: 100 });
  assert.equal(afterTwo.creative.sessions, 1);
  assert.equal(afterTwo.executive.sessions, 0);
});
