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
 * A successful join is persisted and there is no user-facing leave flow, so a
 * later negative snapshot must not undo that confirmed state (for example, if
 * the read comes from a lagging replica). New users still follow the server.
 */
export function shouldApplyLeagueMembershipSnapshot(
  userId: string,
  serverJoined: boolean,
  hasConfirmedMembership = false,
): boolean {
  return Boolean(userId.trim()) && typeof serverJoined === 'boolean' && (serverJoined || !hasConfirmedMembership);
}
