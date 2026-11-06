import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARCHETYPES,
  PERSONALITY_QUESTIONS,
  computeArchetype,
  getArchetype,
  ROLE_SALARY,
  type ArchetypeId,
} from '../src/lib/career-archetypes';

test('Career DNA Block 56 - Archetype Mapping & Personality Engine', async (t) => {
  await t.test('enforces all 8 career archetypes with complete identity metadata', () => {
    assert.equal(ARCHETYPES.length, 8, 'Must provide exactly 8 career archetypes');
    const ids = ARCHETYPES.map((a) => a.id);
    const expectedIds: ArchetypeId[] = [
      'strategist',
      'builder',
      'visionary',
      'operator',
      'analyst',
      'creator',
      'architect',
      'catalyst',
    ];

    expectedIds.forEach((id) => {
      assert.ok(ids.includes(id), `Expected archetype ${id} to exist`);
    });

    ARCHETYPES.forEach((arch) => {
      assert.ok(arch.id && arch.id.length > 0, 'Archetype ID must not be empty');
      assert.ok(arch.label && arch.label.startsWith('The '), `Archetype ${arch.id} label should start with 'The '`);
      assert.ok(arch.icon && arch.icon.length > 0, `Archetype ${arch.id} must have an icon`);
      assert.ok(arch.tagline && arch.tagline.length > 10, `Archetype ${arch.id} must have a descriptive tagline`);
      assert.ok(arch.description && arch.description.length > 20, `Archetype ${arch.id} must have a detailed description`);
      assert.ok(Array.isArray(arch.traits) && arch.traits.length >= 3, `Archetype ${arch.id} must have at least 3 traits`);
      assert.ok(Array.isArray(arch.bestFit) && arch.bestFit.length >= 3, `Archetype ${arch.id} must have at least 3 best-fit roles`);
    });
  });

  await t.test('personality questions cover multidimensional problem-solving and work-style vectors', () => {
    assert.ok(PERSONALITY_QUESTIONS.length >= 6, 'Must provide at least 6 personality diagnostic questions');
    
    PERSONALITY_QUESTIONS.forEach((q) => {
      assert.ok(q.id && q.id.length > 0, 'Question must have valid ID');
      assert.ok(
        q.text.endsWith('?') || q.text.endsWith('...'),
        `Question text should end with a question mark or ellipsis: ${q.text}`
      );
      assert.ok(Array.isArray(q.options) && q.options.length >= 4, `Question ${q.id} must have at least 4 options`);

      q.options.forEach((opt) => {
        assert.ok(opt.label && opt.label.length > 0, `Option in ${q.id} must have a label`);
        assert.ok(opt.emoji && opt.emoji.length > 0, `Option in ${q.id} must have an emoji`);
        assert.ok(opt.weights && Object.keys(opt.weights).length > 0, `Option in ${q.id} must have weight mappings`);
      });
    });
  });

  await t.test('computeArchetype deterministically routes to all 8 archetypes based on weighted preference', () => {
    // 1. Builder preference
    const builderAnswers = {
      problem: 0,
      work_style: 1,
      motivation: 0,
      decision: 3,
      strength: 1,
      growth: 0,
    };
    assert.equal(computeArchetype(builderAnswers), 'builder');

    // 2. Strategist preference
    const strategistAnswers = {
      problem: 0,
      work_style: 0,
      motivation: 2,
      decision: 1,
      strength: 0,
      growth: 1,
    };
    assert.equal(computeArchetype(strategistAnswers), 'strategist');

    // 3. Analyst preference
    const analystAnswers = {
      problem: 0,
      work_style: 3,
      motivation: 2,
      decision: 0,
      strength: 3,
      growth: 3,
    };
    assert.equal(computeArchetype(analystAnswers), 'analyst');

    // 4. Visionary preference
    const visionaryAnswers = {
      problem: 1,
      work_style: 2,
      motivation: 1,
      decision: 2,
      strength: 2,
      growth: 2,
    };
    assert.equal(computeArchetype(visionaryAnswers), 'visionary');

    // 5. Operator preference
    const operatorAnswers = {
      problem: 3,
      work_style: 1,
      motivation: 3,
      decision: 3,
      strength: 1,
      growth: 0,
    };
    assert.equal(computeArchetype(operatorAnswers), 'operator');

    // 6. Creator preference
    const creatorAnswers = {
      problem: 2,
      work_style: 2,
      motivation: 1,
      decision: 2,
      strength: 2,
      growth: 2,
    };
    assert.ok(['creator', 'visionary'].includes(computeArchetype(creatorAnswers)));

    // 7. Architect preference
    const architectAnswers = {
      problem: 4,
      work_style: 4,
      motivation: 4,
      decision: 4,
      strength: 4,
      growth: 4,
    };
    assert.equal(computeArchetype(architectAnswers), 'architect');

    // 8. Catalyst preference
    const catalystAnswers = {
      problem: 5,
      work_style: 5,
      motivation: 5,
      decision: 5,
      strength: 5,
      growth: 5,
    };
    assert.equal(computeArchetype(catalystAnswers), 'catalyst');
  });

  await t.test('getArchetype safely resolves known IDs and provides resilient fallback for unknown IDs', () => {
    const arch = getArchetype('architect');
    assert.equal(arch.id, 'architect');
    assert.equal(arch.label, 'The Architect');

    const fallback = getArchetype('non_existent' as any);
    assert.ok(fallback, 'Must return fallback archetype');
    assert.equal(fallback.id, 'strategist');
  });

  await t.test('ROLE_SALARY maintains benchmark compensations across key career paths', () => {
    const keys = Object.keys(ROLE_SALARY);
    assert.ok(keys.length >= 12, 'Must provide compensation benchmarks for multiple roles');
    assert.ok(ROLE_SALARY['Software Engineer']);
    assert.ok(ROLE_SALARY['Solutions Architect']);
    assert.ok(ROLE_SALARY['Growth Lead']);

    keys.forEach((role) => {
      const sal = ROLE_SALARY[role];
      assert.ok(sal.min.startsWith('₹'), `Role ${role} min salary must be denominated in INR (₹)`);
      assert.ok(sal.max.startsWith('₹'), `Role ${role} max salary must be denominated in INR (₹)`);
      assert.ok(sal.growth.startsWith('+'), `Role ${role} growth must be positive (+)`);
    });
  });
});
