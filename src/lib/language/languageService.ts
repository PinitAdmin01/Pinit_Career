/**
 * PinIT Multi-Language Persistence Service
 * 
 * Supports Supabase primary storage with local cache fallback for all 5 languages:
 * - English (`en`)
 * - French (`fr`)
 * - Spanish (`es`)
 * - German (`de`)
 * - Japanese (`ja`)
 * 
 * Composite primary key: (student_id, language_code)
 */

import { LanguageCode, StudentLanguageProgress, StudentLanguageMastery } from './languageTypes';
import { supabase } from '@/lib/supabaseClient';

const STORAGE_PREFIX = 'pinit_language_progress_v2_';
const MASTERY_PREFIX = 'pinit_language_mastery_v2_';

export async function loadLanguageProgress(studentId: string, languageCode: LanguageCode = 'en'): Promise<StudentLanguageProgress> {
  const cacheKey = `${STORAGE_PREFIX}${studentId}_${languageCode}`;
  
  // 1. Try Supabase Remote Fetch first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('student_language_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('language_code', languageCode)
        .single();

      if (data && !error) {
        const remoteProgress: StudentLanguageProgress = {
          studentId: data.student_id,
          languageCode: data.language_code as LanguageCode,
          currentLevel: data.current_level,
          highestUnlockedLevel: data.highest_unlocked_level,
          completedLessonIds: data.completed_lesson_ids || [],
          totalXpEarned: data.total_xp_earned || 0,
          curriculumVersion: data.curriculum_version || '1.0',
          lastStudiedAt: data.last_studied_at || new Date().toISOString()
        };
        saveLocalCache(cacheKey, remoteProgress);
        return remoteProgress;
      }
    } catch {}
  }

  // 2. Local Storage Cache Fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
  }

  const defaultProgress: StudentLanguageProgress = {
    studentId,
    languageCode,
    currentLevel: 'PRE_A1',
    highestUnlockedLevel: 'PRE_A1',
    completedLessonIds: [],
    totalXpEarned: 0,
    lastStudiedAt: new Date().toISOString()
  };

  saveLocalCache(cacheKey, defaultProgress);
  return defaultProgress;
}

export async function saveLanguageProgress(progress: StudentLanguageProgress): Promise<void> {
  const cacheKey = `${STORAGE_PREFIX}${progress.studentId}_${progress.languageCode}`;
  saveLocalCache(cacheKey, progress);

  // Sync to Supabase Cloud Database asynchronously
  if (supabase) {
    try {
      await supabase.from('student_language_progress').upsert({
        student_id: progress.studentId,
        language_code: progress.languageCode,
        current_level: progress.currentLevel,
        highest_unlocked_level: progress.highestUnlockedLevel,
        completed_lesson_ids: progress.completedLessonIds,
        total_xp_earned: progress.totalXpEarned,
        curriculum_version: progress.curriculumVersion || '1.0',
        last_studied_at: progress.lastStudiedAt || new Date().toISOString()
      }, { onConflict: 'student_id,language_code' });
    } catch {}
  }
}

export async function loadLanguageMastery(studentId: string, languageCode: LanguageCode = 'en'): Promise<StudentLanguageMastery> {
  const cacheKey = `${MASTERY_PREFIX}${studentId}_${languageCode}`;
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('student_language_mastery')
        .select('*')
        .eq('student_id', studentId)
        .eq('language_code', languageCode)
        .single();

      if (data && !error) {
        const remoteMastery: StudentLanguageMastery = {
          studentId: data.student_id,
          languageCode: data.language_code as LanguageCode,
          vocabularyMastery: data.vocabulary_mastery || 0,
          grammarMastery: data.grammar_mastery || 0,
          listeningMastery: data.listening_mastery || 0,
          speakingMastery: data.speaking_mastery || 0,
          hiraganaMastery: data.hiragana_mastery,
          katakanaMastery: data.katakana_mastery,
          kanjiMastery: data.kanji_mastery,
          weakAreas: data.weak_areas || [],
          updatedAt: data.updated_at || new Date().toISOString()
        };
        saveLocalCache(cacheKey, remoteMastery);
        return remoteMastery;
      }
    } catch {}
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
  }

  const defaultMastery: StudentLanguageMastery = {
    studentId,
    languageCode,
    vocabularyMastery: 0,
    grammarMastery: 0,
    listeningMastery: 0,
    speakingMastery: 0,
    hiraganaMastery: languageCode === 'ja' ? 0 : undefined,
    katakanaMastery: languageCode === 'ja' ? 0 : undefined,
    kanjiMastery: languageCode === 'ja' ? 0 : undefined,
    weakAreas: [],
    updatedAt: new Date().toISOString()
  };

  saveLocalCache(cacheKey, defaultMastery);
  return defaultMastery;
}

export async function saveLanguageMastery(mastery: StudentLanguageMastery): Promise<void> {
  const cacheKey = `${MASTERY_PREFIX}${mastery.studentId}_${mastery.languageCode}`;
  saveLocalCache(cacheKey, mastery);

  if (supabase) {
    try {
      await supabase.from('student_language_mastery').upsert({
        student_id: mastery.studentId,
        language_code: mastery.languageCode,
        vocabulary_mastery: mastery.vocabularyMastery,
        grammar_mastery: mastery.grammarMastery,
        listening_mastery: mastery.listeningMastery,
        speaking_mastery: mastery.speakingMastery,
        hiragana_mastery: mastery.hiraganaMastery,
        katakana_mastery: mastery.katakanaMastery,
        kanji_mastery: mastery.kanjiMastery,
        weak_areas: mastery.weakAreas,
        updated_at: mastery.updatedAt || new Date().toISOString()
      }, { onConflict: 'student_id,language_code' });
    } catch {}
  }
}

function saveLocalCache(key: string, data: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  }
}
