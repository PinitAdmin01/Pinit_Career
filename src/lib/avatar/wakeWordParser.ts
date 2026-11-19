// src/lib/avatar/wakeWordParser.ts
/**
 * Wake-Word & Voice Intent Parser for PinIT Career OS AI Mentors (Priya / Anish).
 * 
 * Features:
 * - Word-boundary enforcement (\b) preventing substring false positives (e.g., Priyadarshini).
 * - Tolerates flexible pre-greeting punctuation (e.g., "Hey, Priya, open quests").
 * - Strips trailing punctuation cleanly so route matches receive clean command text.
 * - Detects standalone wake-words (e.g., user just says "Hey Priya") to trigger listening state.
 */

const WAKE_WORD_REGEX = /^\s*(?:(?:hey|hi|hello)[,\s]+)?(priya|anish)\b[\s,.:;!?-]*/i;

export interface WakeWordResult {
  hasWakeWord: boolean;
  mentor: string | null;
  command: string;
  isStandaloneWake: boolean;
}

export function parseWakeWord(
  transcript: unknown,
  configuredMentor?: string
): WakeWordResult {
  if (typeof transcript !== 'string') {
    return { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false };
  }

  const trimmed = transcript.trim();
  if (!trimmed) {
    return { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false };
  }

  const mentorPattern = configuredMentor && /^[a-zA-Z0-9_-]+$/.test(configuredMentor)
    ? `(${configuredMentor.toLowerCase()}|priya|anish)`
    : '(priya|anish)';
  const dynamicRegex = new RegExp(`^\\s*(?:(?:hey|hi|hello)[,\\s]+)?${mentorPattern}\\b[\\s,.:;!?-]*`, 'i');

  const match = trimmed.match(dynamicRegex);
  if (!match) {
    return {
      hasWakeWord: false,
      mentor: null,
      command: trimmed,
      isStandaloneWake: false,
    };
  }

  const mentor = match[1].toLowerCase();
  const matchedPrefixLength = match[0].length;
  const rawCommand = trimmed.slice(matchedPrefixLength).trim();

  // Clean any leading punctuation that might remain
  const cleanCommand = rawCommand.replace(/^[\s,.:;!?-]+/, '').trim();

  return {
    hasWakeWord: true,
    mentor,
    command: cleanCommand,
    isStandaloneWake: cleanCommand.length === 0,
  };
}

/**
 * Detects conversational "Hyper-Active" activation phrases such as:
 * - "hey priya we need to chat" / "hey priya we need to chart" (common STT typo)
 * - "hwy priya we need to speak" / "hey priya let's talk"
 * - "hyper active" / "hyperactive mode"
 */
export function isHyperActiveTrigger(
  transcript: unknown,
  configuredMentor?: string
): boolean {
  if (typeof transcript !== 'string') return false;
  const cleaned = transcript.trim().toLowerCase();
  if (!cleaned) return false;

  if (/\bhyper[\s-]?active\b/i.test(cleaned)) {
    return true;
  }

  const extraMentor =
    configuredMentor && /^[a-zA-Z0-9_-]+$/.test(configuredMentor)
      ? `|${configuredMentor.toLowerCase()}`
      : '';
  const mentorRegex = new RegExp(`\\b(priya|anish${extraMentor})\\b`, 'i');
  const greetingWithMentorRegex = new RegExp(
    `\\b(?:hey|hwy|hay|hi|hello)[,\\s]+(?:ms\\.?\\s+|mr\\.?\\s+)?(priya|anish${extraMentor})\\b`,
    'i'
  );

  const addressesMentor = mentorRegex.test(cleaned) || greetingWithMentorRegex.test(cleaned);
  if (!addressesMentor) return false;

  const talkIntentRegex =
    /\b(?:(?:we|i)\s+(?:need|want|have)\s+to|wanna|let'?s|can\s+we|please|open)\s+(?:chat|chart|speak|talk|converse|discuss)\b|\b(?:chat|chart|speak|talk)\s+(?:with|to)\s+(?:me|you|u)\b/i;

  return talkIntentRegex.test(cleaned);
}
