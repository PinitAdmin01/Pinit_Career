export interface ExtraRoadmap {
  id: string;
  number: number;
  goal: string;
  courseId: string;
  durationDays: number;
  dailyPace: number;
  track: string;
  createdAt: number;
}

export type LearningPathMode = 'fused_roadmap' | 'single_course' | `extra:${string}`;

export function extraRoadmapMode(id: string): `extra:${string}` {
  return `extra:${id}`;
}

export function extraIdFromMode(mode: string): string | null {
  return mode.startsWith('extra:') ? mode.slice(6) : null;
}

export function extrasStorageKey(userId: string) {
  return `pinit_${userId}_extra_roadmaps`;
}

export function extraModulesKey(userId: string, extraId: string) {
  return `pinit_${userId}_extra_roadmap_${extraId}_modules`;
}

export function nextRoadmapNumber(extras: ExtraRoadmap[]): number {
  return extras.reduce((max, rm) => Math.max(max, rm.number || 0), 1) + 1;
}

export function createExtraId(): string {
  return `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isExtraRoadmap(value: unknown): value is ExtraRoadmap {
  if (!value || typeof value !== 'object') return false;
  const rm = value as ExtraRoadmap;
  return (
    typeof rm.id === 'string' &&
    rm.id.length > 0 &&
    typeof rm.number === 'number' &&
    Number.isFinite(rm.number) &&
    rm.number >= 2 &&
    typeof rm.goal === 'string' &&
    typeof rm.courseId === 'string' &&
    typeof rm.durationDays === 'number' &&
    typeof rm.dailyPace === 'number'
  );
}

export function parseExtraRoadmaps(raw: string | null): ExtraRoadmap[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter(isExtraRoadmap)
      .filter(rm => {
        if (seen.has(rm.id)) return false;
        seen.add(rm.id);
        return true;
      })
      .map(rm => ({
        ...rm,
        track: typeof rm.track === 'string' ? rm.track : '',
        createdAt: typeof rm.createdAt === 'number' && Number.isFinite(rm.createdAt) ? rm.createdAt : 0
      }))
      .sort((a, b) => a.number - b.number || a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

function canPersist(userId: string) {
  return typeof window !== 'undefined' && !!userId && userId !== 'guest';
}

export function writeExtraRoadmaps(userId: string, extras: ExtraRoadmap[]) {
  if (!canPersist(userId)) return;
  localStorage.setItem(extrasStorageKey(userId), JSON.stringify(extras));
}

export function writeExtraModules(userId: string, extraId: string, modules: unknown) {
  if (!canPersist(userId)) return;
  localStorage.setItem(extraModulesKey(userId, extraId), JSON.stringify(modules));
}

export function readExtraModules(userId: string, extraId: string): unknown[] | null {
  if (!canPersist(userId)) return null;
  const raw = localStorage.getItem(extraModulesKey(userId, extraId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function removeExtraModules(userId: string, extraId: string) {
  if (!canPersist(userId)) return;
  localStorage.removeItem(extraModulesKey(userId, extraId));
}
