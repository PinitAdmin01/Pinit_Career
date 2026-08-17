/**
 * PinIT Careers — Canonical Centralized LLM Sanitizer (P0-1)
 *
 * Provides authoritative ingress/egress sanitization across the entire PinIT platform:
 * 1. Structured JSON contract parsing first
 * 2. Explicit XML reasoning-tag stripping (<think>, <thought>, <reasoning>)
 * 3. Streaming state machine for chunked token delivery
 * 4. Zero-retention telemetry metadata
 * 5. Distinct speech-specific audio normalizer for Kokoro-82M TTS
 */

export const SANITIZER_VERSION = 'v1';

export interface SanitizationMetadata {
  hadReasoningTags: boolean;
  removedCharacters: number;
  tagTypesFound: string[];
  version: string;
}

const REASONING_TAG_NAMES = ['think', 'thought', 'reasoning'] as const;

/**
 * Primary Canonical Sanitizer for text displayed in UI, persisted in DB, or passed between services.
 * Hierarchy:
 * 1. Structured contract extraction (JSON / markdown JSON block)
 * 2. Explicit paired reasoning tag removal (<think>...</think>)
 * 3. Unclosed opening tag fail-closed removal (<think>... to end of text)
 * 4. Stray tag removal without deleting surrounding text
 */
export function sanitizeLLMOutput(rawInput: string | null | undefined): string {
  if (!rawInput || typeof rawInput !== 'string') return '';

  let text = rawInput.trim();

  // Tier 1: Structured Contract Parser
  // If the model wrapped the response in a JSON markdown fence or raw JSON, extract final answer safely
  if (text.startsWith('```json') || text.startsWith('{')) {
    try {
      const cleanJsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      if (parsed && typeof parsed === 'object') {
        const userFacingField = parsed.reply || parsed.content || parsed.message || parsed.text || parsed.answer;
        if (typeof userFacingField === 'string' && userFacingField.trim().length > 0) {
          text = userFacingField.trim();
        }
      }
    } catch {
      // Not a valid JSON payload, proceed to standard tag sanitization
    }
  }

  // Tier 2: Explicit Paired Tag Stripping
  for (const tag of REASONING_TAG_NAMES) {
    const pairedRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    text = text.replace(pairedRegex, '');
  }

  // Tier 3: Unclosed Opening Tag (Fail Closed — thought trace was cut off)
  for (const tag of REASONING_TAG_NAMES) {
    const unclosedRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*$`, 'gi');
    text = text.replace(unclosedRegex, '');
  }

  // Tier 4: Stray Closing or Opening Tags (Safely remove only the tag, preserving surrounding text)
  for (const tag of REASONING_TAG_NAMES) {
    const strayClosingRegex = new RegExp(`<\\/${tag}>`, 'gi');
    const strayOpeningRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
    text = text.replace(strayClosingRegex, ' ');
    text = text.replace(strayOpeningRegex, ' ');
  }

  return text.trim();
}

/**
 * Speech Audio Normalizer for Kokoro-82M TTS & Audio Engine.
 * Converts clean semantic text into smooth, human-like narration:
 * - Strips code blocks and raw syntax
 * - Strips Markdown formatting (*, #, __, >, `)
 * - Converts links [label](url) to just "label"
 * - Strips emojis and visual UI glyphs
 * - Normalizes bullet points to commas/pauses
 */
export function sanitizeForSpeech(rawInput: string | null | undefined): string {
  const cleanBase = sanitizeLLMOutput(rawInput);
  if (!cleanBase) return '';

  let speech = cleanBase;

  // 1. Remove UI glyphs & emojis first so markdown matches work correctly at line starts
  speech = speech.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}✦🤖👋🎯💼🔐🔬⚡✨✓⬡🚀💡🧠📌]/gu, '');

  // 2. Remove code blocks completely (reading raw code syntax aloud sounds bad in voice)
  speech = speech.replace(/```[\s\S]*?```/g, ' [Code example omitted] ');

  // 3. Remove inline code snippets `foo()` -> foo()
  speech = speech.replace(/`([^`]+)`/g, '$1');

  // 4. Remove Markdown URLs [link text](https://...) -> link text
  speech = speech.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  speech = speech.replace(/https?:\/\/\S+/gi, '');

  // 5. Remove Markdown headers, blockquotes, bold/italic markers
  speech = speech.replace(/#{1,6}\s+/g, '');
  speech = speech.replace(/^>\s+/gm, '');
  speech = speech.replace(/[*_~]{1,3}/g, '');

  // 6. Convert bullet points and symbols (•, ●, ▪, - , * ) to natural speech cadence
  speech = speech.replace(/[•●▪◆]/g, ' , ');
  speech = speech.replace(/^[\s]*[-*]\s+/gm, ', ');
  speech = speech.replace(/(?:\s+[-*]\s+)/g, ' , ');
  speech = speech.replace(/^[\s]*\d+\.\s+/gm, ', ');

  // 7. Strip specific role/persona headers like "Ms. Priya:", "Mr. Vikram:", "INTERVIEWER:"
  speech = speech.replace(/^(?:(?:Ms\.|Mr\.|Dr\.|Prof\.)\s+[A-Za-z]+|Interviewer|Teacher|Mentor|Assistant|Candidate|User|System):\s*/i, '');

  // 8. Clean double commas and normalize whitespace
  speech = speech.replace(/,\s*,/g, ',');
  speech = speech.replace(/^,\s*/, '');
  speech = speech.replace(/\s+/g, ' ').trim();

  return speech;
}

/**
 * Returns safe telemetry metadata about LLM output sanitization.
 * Zero-Retention: NEVER stores or records the reasoning content itself.
 */
export function getSanitizationMetadata(rawInput: string | null | undefined): SanitizationMetadata {
  if (!rawInput || typeof rawInput !== 'string') {
    return { hadReasoningTags: false, removedCharacters: 0, tagTypesFound: [], version: SANITIZER_VERSION };
  }

  const tagTypesFound: string[] = [];
  let hadReasoningTags = false;

  for (const tag of REASONING_TAG_NAMES) {
    const checkRegex = new RegExp(`<${tag}[^>]*>|<\\/${tag}>`, 'i');
    if (checkRegex.test(rawInput)) {
      hadReasoningTags = true;
      tagTypesFound.push(tag);
    }
  }

  const clean = sanitizeLLMOutput(rawInput);
  const removedCharacters = Math.max(0, rawInput.length - clean.length);

  return {
    hadReasoningTags,
    removedCharacters,
    tagTypesFound,
    version: SANITIZER_VERSION,
  };
}

/**
 * Safely sanitizes user-facing string fields of an evaluation object without corrupting numeric scores or schema.
 */
export function sanitizeEvaluationResult<T extends Record<string, any>>(evalData: T): T {
  if (!evalData || typeof evalData !== 'object') return evalData;

  const result: Record<string, any> = { ...evalData };

  // Sanitize standard string fields
  if (typeof result.summary === 'string') {
    result.summary = sanitizeLLMOutput(result.summary);
  }
  if (typeof result.verdict === 'string') {
    result.verdict = sanitizeLLMOutput(result.verdict);
  }
  if (typeof result.improvements === 'string') {
    result.improvements = sanitizeLLMOutput(result.improvements);
  }

  // Sanitize array string fields
  if (Array.isArray(result.strengths)) {
    result.strengths = result.strengths.map((s: any) => (typeof s === 'string' ? sanitizeLLMOutput(s) : s));
  }
  if (Array.isArray(result.weaknesses)) {
    result.weaknesses = result.weaknesses.map((w: any) => (typeof w === 'string' ? sanitizeLLMOutput(w) : w));
  }
  if (Array.isArray(result.improvement_tips)) {
    result.improvement_tips = result.improvement_tips.map((t: any) => (typeof t === 'string' ? sanitizeLLMOutput(t) : t));
  }

  return result as T;
}

/**
 * Streaming Text Sanitizer State Machine
 * Handles token chunks where tags like <think> or </think> might be split across chunk boundaries.
 */
export class StreamingTextSanitizer {
  private state: 'NORMAL' | 'INSIDE_REASONING' = 'NORMAL';
  private buffer: string = '';
  private currentTag: string = '';

  /**
   * Process an incoming stream chunk and return only confirmed clean user-facing text.
   */
  public processChunk(chunk: string): string {
    this.buffer += chunk;
    let output = '';

    while (this.buffer.length > 0) {
      if (this.state === 'NORMAL') {
        const openIdx = this.buffer.indexOf('<');

        if (openIdx === -1) {
          // No tag opening found, emit everything
          output += this.buffer;
          this.buffer = '';
          break;
        }

        // Emit text before the '<'
        if (openIdx > 0) {
          output += this.buffer.slice(0, openIdx);
          this.buffer = this.buffer.slice(openIdx);
        }

        // We are at a '<'. Check if a full tag is formed
        const closeIdx = this.buffer.indexOf('>');
        if (closeIdx === -1) {
          // Incomplete tag (e.g. "<thi"), wait for next chunk (unless buffer is unreasonably long)
          if (this.buffer.length > 30) {
            output += this.buffer[0];
            this.buffer = this.buffer.slice(1);
          }
          break;
        }

        const tagContent = this.buffer.slice(1, closeIdx).trim().toLowerCase();
        const fullTag = this.buffer.slice(0, closeIdx + 1);

        // Check if this tag matches any reasoning tag name
        const matchedOpen = REASONING_TAG_NAMES.find(t => tagContent === t || tagContent.startsWith(`${t} `));

        if (matchedOpen) {
          // Transition to INSIDE_REASONING
          this.state = 'INSIDE_REASONING';
          this.currentTag = matchedOpen;
          this.buffer = this.buffer.slice(closeIdx + 1);
        } else {
          // Check if it's a stray closing tag like </think>
          const matchedClose = REASONING_TAG_NAMES.find(t => tagContent === `/${t}`);
          if (matchedClose) {
            // Stray closing tag — discard only the tag, keep prior text
            this.buffer = this.buffer.slice(closeIdx + 1);
          } else {
            // Normal HTML / XML tag (e.g. <b> or <br>) — pass through
            output += fullTag;
            this.buffer = this.buffer.slice(closeIdx + 1);
          }
        }
      } else if (this.state === 'INSIDE_REASONING') {
        const closingTagStr = `</${this.currentTag}>`;
        const closeIdx = this.buffer.toLowerCase().indexOf(closingTagStr);

        if (closeIdx !== -1) {
          // Found closing tag, transition back to NORMAL
          this.buffer = this.buffer.slice(closeIdx + closingTagStr.length);
          this.state = 'NORMAL';
          this.currentTag = '';
        } else {
          // Still inside reasoning. Keep last few characters in case closing tag is split (e.g. "</thi")
          const keepLen = closingTagStr.length;
          if (this.buffer.length > keepLen) {
            this.buffer = this.buffer.slice(-keepLen);
          }
          break;
        }
      }
    }

    return output;
  }

  /**
   * Finalize the stream and return any trailing clean text.
   * If the stream ended while INSIDE_REASONING (unclosed tag), fails closed and discards the buffer.
   */
  public finalize(): string {
    if (this.state === 'INSIDE_REASONING') {
      this.buffer = '';
      this.state = 'NORMAL';
      return '';
    }

    const remaining = this.buffer;
    this.buffer = '';
    return sanitizeLLMOutput(remaining);
  }

  public reset(): void {
    this.state = 'NORMAL';
    this.buffer = '';
    this.currentTag = '';
  }
}
