import type { LessonVisual } from '@/lib/types/lessonVisual';

/**
 * Spec v1.1 Rule:
 * Returns the list of tappable labels for visual words underlining.
 * Underlines nothing for table, letters or compare visuals.
 * Only flow and boxes visuals have tappable nodes/boxes.
 */
// [FIX-STAGE: VisualRules Array Safety] Guard every visual template array against missing or
// non-array fields so malformed JSON visuals log a clear diagnostic warning instead of crashing Gate/UI.
function safeExtractLabels<T>(
  arr: T[] | null | undefined,
  visual: LessonVisual,
  field: string,
  pick: (item: T) => string | undefined | null
): string[] {
  if (!Array.isArray(arr)) {
    console.warn(
      `[PinIT][Fix:VisualRules] Malformed "${visual.template}" visual missing array "${field}" (title="${visual.title ?? 'untitled'}")`
    );
    return [];
  }
  const labels: string[] = [];
  for (const item of arr as T[]) {
    const label = pick(item);
    if (typeof label === 'string' && label.length > 0) {
      labels.push(label);
    }
  }
  return labels;
}

export function getTappableLabelsForVisual(visual?: LessonVisual | null): string[] {
  if (!visual) return [];

  switch (visual.template) {
    case 'flow':
      return safeExtractLabels(visual.nodes, visual, 'nodes', n => (n?.tappable !== false ? n?.label : null));
    case 'boxes':
      return safeExtractLabels(visual.boxes, visual, 'boxes', b => (b?.tappable !== false ? b?.label : null));
    case 'funnel':
      return safeExtractLabels(visual.steps?.[0]?.stages, visual, 'steps[0].stages', s => s?.label);
    case 'ledger-sheet':
      return safeExtractLabels(visual.steps?.[0]?.entries, visual, 'steps[0].entries', e => e?.account);
    case 'register-bits':
      return safeExtractLabels(visual.steps?.[0]?.bits, visual, 'steps[0].bits', b => b?.name);
    case 'component-tree':
      return safeExtractLabels(visual.nodes, visual, 'nodes', n => n?.name);
    case 'workflow':
      return safeExtractLabels(visual.stages, visual, 'stages', s => s?.name);
    case 'wireframe':
      return safeExtractLabels(visual.boxes, visual, 'boxes', b => b?.label);
    case 'states':
      return safeExtractLabels(visual.states, visual, 'states', s => s?.label);
    case 'sequence':
      return safeExtractLabels<string>(visual.actors, visual, 'actors', a => a);
    case 'tree-graph':
      return safeExtractLabels(visual.nodes, visual, 'nodes', n => n?.label);
    case 'bars':
      return safeExtractLabels(visual.steps?.[0]?.bars, visual, 'steps[0].bars', b => b?.label);
    case 'stack-queue':
      return safeExtractLabels<string>(visual.steps?.[0]?.items, visual, 'steps[0].items', item => item);
    case 'cells':
      return safeExtractLabels<string>(visual.steps?.[0]?.items, visual, 'steps[0].items', item => item);
    default:
      // Spec v1.1: Underline nothing for table, letters or compare visuals
      return [];
  }
}

export interface UnderlineToken {
  text: string;
  isUnderlined: boolean;
  matchedLabel?: string;
}

/**
 * Spec v1.1 Rule:
 * Underline only the FIRST matching word in each paragraph.
 * Subsequent occurrences of the same word in the same paragraph remain plain text.
 */
export function tokenizeParagraphWithUnderlines(
  text: string,
  labels: string[]
): UnderlineToken[] {
  if (!text) return [];
  if (!labels || labels.length === 0) {
    return [{ text, isUnderlined: false }];
  }

  const validLabels = labels
    .map(l => (l !== null && l !== undefined ? String(l).trim() : ''))
    .filter(l => l.length > 0);
  if (validLabels.length === 0) {
    return [{ text, isUnderlined: false }];
  }

  const sortedLabels = [...validLabels].sort((a, b) => b.length - a.length);
  const pattern = sortedLabels.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

  const parts = text.split(regex);
  if (parts.length <= 1) {
    return [{ text, isUnderlined: false }];
  }

  const seenLabels = new Set<string>();
  const tokens: UnderlineToken[] = [];

  for (const part of parts) {
    if (!part) continue;
    const matchedLabel = validLabels.find(l => l.toLowerCase() === part.toLowerCase());
    if (!matchedLabel) {
      tokens.push({ text: part, isUnderlined: false });
      continue;
    }

    const lowerKey = matchedLabel.toLowerCase();
    if (seenLabels.has(lowerKey)) {
      tokens.push({ text: part, isUnderlined: false });
    } else {
      seenLabels.add(lowerKey);
      tokens.push({ text: part, isUnderlined: true, matchedLabel });
    }
  }

  return tokens;
}

/**
 * Spec v1.1 Rule:
 * Show space dots only where the visual data explicitly has showSpaces: true.
 */
export function shouldShowSpaceDots(visual?: LessonVisual | null): boolean {
  return visual?.showSpaces === true;
}
