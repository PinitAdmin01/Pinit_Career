const CONFIRMED_CACHE_PREFIX = 'confirmed:';

export function encodeConfirmedLeagueMembership(joinedAt: string | null | undefined): string {
  const timestamp = joinedAt && Number.isFinite(Date.parse(joinedAt))
    ? new Date(joinedAt).toISOString()
    : new Date().toISOString();
  return `${CONFIRMED_CACHE_PREFIX}${timestamp}`;
}

export function isConfirmedLeagueMembershipCacheValue(value: string | null): boolean {
  if (!value?.startsWith(CONFIRMED_CACHE_PREFIX)) return false;
  return Number.isFinite(Date.parse(value.slice(CONFIRMED_CACHE_PREFIX.length)));
}

/**
 * Decide whether a successful, account-specific server snapshot can be applied.
 * The caller rejects responses from another account and responses that started
 * before a membership change. Once those freshness checks pass, the server is
 * authoritative in both directions so stale browser storage cannot claim that
 * a user is enrolled when the persisted profile is not.
 */
export function shouldApplyLeagueMembershipSnapshot(
  userId: string,
  serverJoined: boolean,
): boolean {
  return Boolean(userId.trim()) && typeof serverJoined === 'boolean';
}
