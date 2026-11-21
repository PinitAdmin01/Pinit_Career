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
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-a', true), true);
});

test('a negative snapshot cannot undo a server-confirmed join', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-a', false, true), false);
});

test('a negative snapshot can reconcile a user without a confirmed join', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-a', false), true);
});

test('rejects a membership snapshot without an account identity', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('', true), false);
});

test('server membership state is account-scoped by the caller-provided request identity', () => {
  assert.equal(shouldApplyLeagueMembershipSnapshot('student-b', false), true);
});
