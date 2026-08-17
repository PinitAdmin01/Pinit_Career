/**
 * PinIT Multi-Language Learning Core Types & Interfaces
 * 
 * Supports 5 Independent Language Programs:
 * - 🇬🇧 English (`en`)
 * - 🇫🇷 French (`fr`)
 * - 🇪🇸 Spanish (`es`)
 * - 🇩🇪 German (`de`)
 * - 🇯🇵 Japanese (`ja`)
 */

export type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'ja';

export type LanguageLevel = 'PRE_A1' | 'A1' | 'A2' | 'B1' | 'B2';

export type LanguageModuleType = 'Vocabulary' | 'Grammar' | 'Listening' | 'Speaking' | 'KanaScript' | 'InteractiveExercises';

export const CURRICULUM_VERSION = "1.0";
export const PLACEMENT_VERSION = "1.0";

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  script: 'latin' | 'kana_mixed';
  voiceCode: string;
  sttLangCode: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    script: 'latin',
    voiceCode: 'priya',
    sttLangCode: 'en-US'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    script: 'latin',
    voiceCode: 'fr-FR',
    sttLangCode: 'fr-FR'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    script: 'latin',
    voiceCode: 'es-ES',
    sttLangCode: 'es-ES'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    script: 'latin',
    voiceCode: 'de-DE',
    sttLangCode: 'de-DE'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    script: 'kana_mixed',
    voiceCode: 'ja-JP',
    sttLangCode: 'ja-JP'
  }
};

export interface VocabularyItem {
  id: string;
  word: string;
  translation?: string;
  meaning?: string;
  phonetic?: string;
  exampleSentence: string;
  exampleTranslation?: string;
  category: string;
  quizQuestion: {
    prompt?: string;
    question?: string;
    options: string[];
    correctIndex: number;
  };
}

export interface GrammarTopic {
  id: string;
  title: string;
  ruleExplanation: string;
  patternExamples?: string[];
  patternExample?: string;
  practiceQuestions: {
    id: string;
    prompt: string;
    sentenceWithBlank?: string;
    options: string[];
    correctIndex?: number;
    correctAnswer?: number | string;
    explanation: string;
    targetPattern?: string;
  }[];
}

export interface ListeningExercise {
  id: string;
  title: string;
  narrationScript: string;
  speakerVoice: string;
  audioSpeed?: number;
  questions: {
    id: string;
    prompt?: string;
    question?: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface SpeakingExercise {
  id: string;
  title: string;
  promptQuestion: string;
  sampleResponse: string;
  keywordsExpected: string[];
  minWordCount: number;
  targetGrammarRule?: string;
}

export type JapaneseScriptIntent = 'reading' | 'recognition' | 'writing' | 'pronunciation';
export type JapaneseDisplayMode = 'romaji' | 'kana' | 'kanji_furigana';

export interface KanaCharacter {
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana' | 'kanji';
  meaning?: string;
  strokeOrderHint?: string;
  audioText: string;
  furigana?: string;
  intent?: JapaneseScriptIntent;
}

export interface WordBankExercise {
  id: string;
  type: 'wordBank';
  prompt: string;
  targetSentence: string;
  tokens: string[];
  correctTokenOrder: string[];
}

export interface MatchGridPair {
  target: string;
  native: string;
}

export interface MatchGridExercise {
  id: string;
  type: 'matchGrid';
  prompt: string;
  pairs: MatchGridPair[];
}

export interface TypeAnswerExercise {
  id: string;
  type: 'typeAnswer';
  prompt: string;
  targetAnswer: string;
  alternativeAnswers?: string[];
  exerciseCategory: 'vocabulary' | 'grammar' | 'japanese_script' | 'sentence_construction';
}

export type InteractiveExercise = WordBankExercise | MatchGridExercise | TypeAnswerExercise;

export interface LanguageLesson {
  id: string;
  languageCode?: LanguageCode;
  level: LanguageLevel;
  moduleType: LanguageModuleType;
  title: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  vocabularyItems?: VocabularyItem[];
  grammarTopic?: GrammarTopic;
  listeningExercise?: ListeningExercise;
  speakingExercise?: SpeakingExercise;
  kanaCharacters?: KanaCharacter[];
  interactiveExercises?: InteractiveExercise[];
}

export interface FinalMission {
  id: string;
  languageCode?: LanguageCode;
  level: LanguageLevel;
  title: string;
  scenarioDescription: string;
  requiredLessons: string[];
  missionPrompt?: string;
  keywordsTarget?: string[];
  passingScorePct?: number;
  xpReward?: number;
}

export type LanguageMission = FinalMission;

export interface StudentLanguageProgress {
  studentId: string;
  languageCode: LanguageCode;
  currentLevel: LanguageLevel;
  highestUnlockedLevel: LanguageLevel;
  completedLessonIds: string[];
  totalXpEarned: number;
  recommendedReviewLevel?: LanguageLevel;
  curriculumVersion?: string;
  lastStudiedAt: string;
}

export type LanguageProgressState = StudentLanguageProgress;

export interface StudentLanguageMastery {
  studentId: string;
  languageCode: LanguageCode;
  vocabularyMastery: number;
  grammarMastery: number;
  listeningMastery: number;
  speakingMastery: number;
  hiraganaMastery?: number;
  katakanaMastery?: number;
  kanjiMastery?: number;
  weakAreas: string[];
  curriculumVersion?: string;
  updatedAt: string;
}

export interface PlacementAssessmentResult {
  placementVersion: string;
  languageCode: LanguageCode;
  recommendedStartLevel: LanguageLevel;
  assessedLevel: LanguageLevel;
  vocabularyScore: number;
  grammarScore: number;
  listeningScore: number;
  speakingScore: number;
  confidenceScore: number;
  assessedAt: string;
}
