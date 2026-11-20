import test from 'node:test';
import assert from 'node:assert/strict';
import {
  encodeConfirmedLeagueMembership,
  isConfirmedLeagueMembershipCacheValue,
  shouldApplyLeagueMembershipSnapshot,
} from '../src/lib/competition/leagueMembershipSnapshot';

test('stores confirmed membership with a parseable timestamp marker', () => {
  const storedValue = encodeConfirmedLeagueMembership('2026-11-21T00:00:00.000Z');
  assert.equal(isConfirmedLeagueMembershipCacheValue(storedValue), true);
  assert.equal(isConfirmedLeagueMembershipCacheValue('true'), false, 'legacy optimistic values are not treated as authoritative');
});

test('accepts a positive server membership confirmation', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-a', true, null, false), true);
});

test('accepts a first server response that confirms no membership', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-a', false, null, false), true);
});

test('ignores a contradictory false response after this account was confirmed joined', () => {
  assert.equal(
    shouldApplyLeagueMembershipSnapshot('student-a', false, { userId: 'student-a', joined: true }, true),
    false,
  );
});

test('keeps a persisted server-confirmed join across a page remount', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-a', false, null, true), false);
});

test('does not carry another account’s confirmation into this account', () => {
  assert.equal(
    shouldApplyLeagueMembershipSnapshot('student-b', false, { userId: 'student-a', joined: true }, false),
    true,
  );
});
