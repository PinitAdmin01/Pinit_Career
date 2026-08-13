/** Consecutive calendar-day streak from ISO (or `iso|tag`) timestamps. */
export function consecutiveCalendarStreak(timestamps: string[] | undefined | null): number {
  if (!timestamps || timestamps.length === 0) return 0;

  const days = new Set<string>();
  for (const raw of timestamps) {
    const iso = String(raw).split('|')[0];
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    days.add(d.toDateString());
  }
  if (days.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toDateString())) return 0;
  }

  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function hasMissionProof(
  completedMissions: string[] | undefined,
  timestamps: string[] | undefined
): boolean {
  return (completedMissions?.length || 0) > 0 || (timestamps?.length || 0) > 0;
}
