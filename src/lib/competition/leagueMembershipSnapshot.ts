export type LeagueMembershipStatus = {
  userId: string;
  joined: boolean;
} | null;

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
 * League membership has no leave operation. Once the server has confirmed a
 * join, an older or contradictory `false` snapshot must not resurrect the
 * Join button for that account. A fresh `true` server response is always safe
 * to apply; `false` is accepted only when this client has no prior confirmation.
 */
export function shouldApplyLeagueMembershipSnapshot(
  userId: string,
  serverJoined: boolean,
  currentStatus: LeagueMembershipStatus,
  locallyConfirmed: boolean,
): boolean {
  if (serverJoined) return true;

  const confirmedForAccount = currentStatus?.userId === userId && currentStatus.joined;
  return !confirmedForAccount && !locallyConfirmed;
}
