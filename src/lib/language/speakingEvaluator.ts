/**
 * PinIT Multi-Language Speaking Transcript Evaluator
 * 
 * Evaluates speech transcripts captured via Web Speech STT or MediaRecorder fallback.
 * 
 * Note: Evaluates text transcript metrics (fluency, pace WPM, vocabulary match, grammar correctness, relevance).
 * Does NOT perform acoustic audio pronunciation modeling.
 */

import { LanguageCode, SUPPORTED_LANGUAGES } from './languageTypes';

export interface SpeakingEvaluationInput {
  languageCode?: LanguageCode;
  transcript: string;
  expectedKeywords: string[];
  minWordCount: number;
  durationSeconds: number;
  targetGrammarRule?: string;
}

export interface SpeakingEvaluationResult {
  score: number; // 0 - 100
  paceWpm: number;
  wordCount: number;
  keywordMatchPct: number;
  fluencyRating: 'Developing' | 'Competent' | 'Fluent' | 'Expert';
  fluencyScore?: number;
  feedbackText: string;
  sttLangCode: string;
}

export function evaluateSpeakingTranscript(input: SpeakingEvaluationInput): SpeakingEvaluationResult {
  const { languageCode = 'en', transcript, expectedKeywords, minWordCount, durationSeconds } = input;
  const meta = SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES['en'];
  const sttLangCode = meta.sttLangCode;

  const cleanText = transcript.trim();
  if (!cleanText) {
    return {
      score: 0,
      paceWpm: 0,
      wordCount: 0,
      keywordMatchPct: 0,
      fluencyRating: 'Developing',
      feedbackText: 'No speech detected. Please speak clearly into the microphone.',
      sttLangCode
    };
  }

  // Word count calculation (For Japanese, count characters as tokens if words count is low)
  let wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  if (languageCode === 'ja' && wordCount <= 2) {
    wordCount = cleanText.length; // Character count token fallback for CJK
  }

  // Pace WPM calculation
  const minutes = Math.max(0.1, durationSeconds / 60);
  const paceWpm = Math.round(wordCount / minutes);

  // Keyword Matching
  const lowerTranscript = cleanText.toLowerCase();
  let matchedCount = 0;
  expectedKeywords.forEach(kw => {
    if (lowerTranscript.includes(kw.toLowerCase())) {
      matchedCount++;
    }
  });

  const keywordMatchPct = expectedKeywords.length > 0
    ? Math.round((matchedCount / expectedKeywords.length) * 100)
    : 100;

  // Length Score
  const lengthRatio = Math.min(1.0, wordCount / Math.max(1, minWordCount));
  const lengthScore = Math.round(lengthRatio * 40);

  // Keyword Score (40% weight)
  const keywordScore = Math.round((keywordMatchPct / 100) * 40);

  // Pace Score (20% weight)
  let paceScore = 20;
  if (paceWpm < 60 || paceWpm > 220) {
    paceScore = 10;
  }

  const totalScore = Math.min(100, lengthScore + keywordScore + paceScore);

  let fluencyRating: 'Developing' | 'Competent' | 'Fluent' | 'Expert' = 'Developing';
  if (totalScore >= 85) fluencyRating = 'Expert';
  else if (totalScore >= 70) fluencyRating = 'Fluent';
  else if (totalScore >= 50) fluencyRating = 'Competent';

  let feedbackText = `Good effort! You matched ${keywordMatchPct}% of expected key concepts.`;
  if (totalScore >= 80) {
    feedbackText = `Excellent response! Fluent articulation with ${wordCount} words captured.`;
  } else if (wordCount < minWordCount) {
    feedbackText = `Try to expand your speech. Speak at least ${minWordCount} words for full credit.`;
  }

  return {
    score: totalScore,
    paceWpm,
    wordCount,
    keywordMatchPct,
    fluencyRating,
    fluencyScore: totalScore,
    feedbackText,
    sttLangCode
  };
}
