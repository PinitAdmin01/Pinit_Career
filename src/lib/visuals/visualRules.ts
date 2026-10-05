import type { LessonVisual } from '@/lib/types/lessonVisual';

/**
 * Spec v1.1 Rule:
 * Returns the list of tappable labels for visual words underlining.
 * Underlines nothing for table, letters or compare visuals.
 * Only flow and boxes visuals have tappable nodes/boxes.
 */
export function getTappableLabelsForVisual(visual?: LessonVisual | null): string[] {
  if (!visual) return [];
  if (visual.template === 'flow') {
    return visual.nodes.filter(n => n.tappable !== false).map(n => n.label);
  }
  if (visual.template === 'boxes') {
    return visual.boxes.filter(b => b.tappable !== false).map(b => b.label);
  }
  // Spec v1.1: Underline nothing for table, letters or compare visuals
  return [];
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

  const validLabels = labels.filter(l => Boolean(l && l.trim()));
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
