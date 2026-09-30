import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseGithubPrLink,
  validatePrMatchesTeamRepo,
  countStandupWords,
} from '../src/lib/internships/sprints';

test('parseGithubPrLink extracts owner, repo, and pull number from valid PR URLs', () => {
  const pr1 = parseGithubPrLink('https://github.com/acme-corp/pulse-backend/pull/42');
  assert.notEqual(pr1, null);
  assert.equal(pr1?.owner, 'acme-corp');
  assert.equal(pr1?.repo, 'pulse-backend');
  assert.equal(pr1?.pullNumber, 42);

  const pr2 = parseGithubPrLink('https://github.com/student-dev/clinic-api/pull/1/');
  assert.notEqual(pr2, null);
  assert.equal(pr2?.owner, 'student-dev');
  assert.equal(pr2?.repo, 'clinic-api');
  assert.equal(pr2?.pullNumber, 1);
});

test('parseGithubPrLink rejects invalid formats and non-PR links', () => {
  assert.equal(parseGithubPrLink('https://github.com/acme-corp/pulse-backend'), null);
  assert.equal(parseGithubPrLink('https://github.com/acme-corp/pulse-backend/issues/42'), null);
  assert.equal(parseGithubPrLink('https://gitlab.com/acme-corp/pulse-backend/pull/42'), null);
  assert.equal(parseGithubPrLink('https://github.com/acme-corp/pulse-backend/pull/not-a-number'), null);
  assert.equal(parseGithubPrLink(''), null);
  assert.equal(parseGithubPrLink(null), null);
});

test('validatePrMatchesTeamRepo validates that PR belongs to the team repository', () => {
  const teamRepo = 'https://github.com/PinIT-Teams/team-gamma-repo';

  // Matches team repo
  const valid = validatePrMatchesTeamRepo(
    'https://github.com/PinIT-Teams/team-gamma-repo/pull/5',
    teamRepo
  );
  assert.equal(valid.valid, true);

  // Mismatched repo
  const wrongRepo = validatePrMatchesTeamRepo(
    'https://github.com/PinIT-Teams/other-repo/pull/5',
    teamRepo
  );
  assert.equal(wrongRepo.valid, false);
  assert.equal(wrongRepo.reason?.includes('team repository is'), true);

  // Mismatched owner
  const wrongOwner = validatePrMatchesTeamRepo(
    'https://github.com/rogue-user/team-gamma-repo/pull/5',
    teamRepo
  );
  assert.equal(wrongOwner.valid, false);
});

test('countStandupWords accurately tallies total words across done, next, and blockers', () => {
  const done = 'Implemented user authentication with bcrypt password hashing and added comprehensive unit test suites.';
  const next = 'Will write PostgreSQL schema migration for appointment booking tables and wire up API route handlers tomorrow morning.';
  const blockers = 'None right now, team communication is smooth and on schedule.';

  const count = countStandupWords(done, next, blockers);
  assert.equal(count >= 30, true, `Word count should be >= 30 (got ${count})`);
  assert.equal(count <= 200, true, `Word count should be <= 200 (got ${count})`);

  // Empty fields
  assert.equal(countStandupWords('', '', ''), 0);
});
