import { test, describe } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CompetenciesRadar, { calculate5AxisPoints, computeRadarScores, RADAR_AXES } from '../src/components/student/dashboard/CompetenciesRadar';

describe('SOCRATIC COMPETENCIES RADAR: 5-AXIS MATH & NORMALIZATION AUDIT', () => {
  test('Axis schema defines exact 5 axes in clockwise pentagonal orientation', () => {
    assert.strictEqual(RADAR_AXES.length, 5);
    const expected = ['CODING', 'ARCH', 'DATA', 'SOCRATIC', 'IoT'];
    RADAR_AXES.forEach((axis, idx) => {
      assert.strictEqual(axis.name, expected[idx]);
      assert.strictEqual(axis.angle, idx * 72);
    });
  });

  test('0-100 normalization: zero scores map strictly to center (60, 60)', () => {
    const points = calculate5AxisPoints([0, 0, 0, 0, 0]);
    const vertices = points.split(' ');
    assert.strictEqual(vertices.length, 5);
    vertices.forEach(v => {
      assert.strictEqual(v, '60,60');
    });
  });

  test('0-100 normalization: 100 scores map strictly to outer perimeter (R=46, center=60,60)', () => {
    const points = calculate5AxisPoints([100, 100, 100, 100, 100]);
    const vertices = points.split(' ');
    assert.strictEqual(vertices.length, 5);
    
    // Angle 0: (60, 60 - 46) = (60, 14)
    assert.strictEqual(vertices[0], '60,14');
    
    // Angle 72: sin(72 deg) = 0.9510565, cos(72 deg) = 0.309017
    // x = 60 + 46 * 0.9510565 = 103.7, y = 60 - 46 * 0.309017 = 45.8
    assert.strictEqual(vertices[1], '103.7,45.8');
  });

  test('Boundary clamping: values < 0 clamped to 0, values > 100 clamped to 100', () => {
    const below = calculate5AxisPoints([-50, -10, 0, 0, 0]);
    assert.strictEqual(below.split(' ')[0], '60,60');

    const above = calculate5AxisPoints([150, 100, 100, 100, 100]);
    assert.strictEqual(above.split(' ')[0], '60,14');
  });

  test('computeRadarScores correctly computes archetype bonuses and weights', () => {
    const scores = computeRadarScores({
      careerScore: 80,
      dnaScore: 60,
      activeTrack: 'sde',
      trustScore: 75,
      archetype: 'Pattern Hunter Explorer Stabilizer Social IQ',
    });

    // codingScore = 80 + 5 (Pattern Hunter) = 85
    assert.strictEqual(scores.coding, 85);
    // archScore = round(80 * 0.7 + 60 * 0.3) = round(56 + 18) = 74 + 5 (Explorer) = 79
    assert.strictEqual(scores.arch, 79);
    // dataScore = 60 + 5 (Stabilizer) = 65
    assert.strictEqual(scores.data, 65);
    // socraticScore = 75 + 5 (Social IQ) = 80
    assert.strictEqual(scores.socratic, 80);
    // iotScore (sde track) = round(80 * 0.5) = 40
    assert.strictEqual(scores.iot, 40);
  });

  test('Runtime SSR: renders complete SVG with all 5 labels and polygon points', () => {
    const html = renderToStaticMarkup(
      React.createElement(CompetenciesRadar, {
        careerScore: 70,
        dnaScore: 50,
        activeTrack: 'sde',
        trustScore: 60,
      })
    );

    assert.ok(html.includes('data-testid="competencies-radar-card"'));
    assert.ok(html.includes('data-testid="radar-polygon"'));
    assert.ok(html.includes('CODING'));
    assert.ok(html.includes('ARCH'));
    assert.ok(html.includes('DATA'));
    assert.ok(html.includes('SOCRATIC'));
    assert.ok(html.includes('IoT'));
  });
});
