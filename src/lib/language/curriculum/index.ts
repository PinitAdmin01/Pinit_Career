import { LanguageCode, LanguageLevel, LanguageLesson, FinalMission } from '../languageTypes';
import { ENGLISH_CURRICULUM } from './english';
import { FRENCH_CURRICULUM } from './french';
import { SPANISH_CURRICULUM } from './spanish';
import { GERMAN_CURRICULUM } from './german';
import { JAPANESE_CURRICULUM } from './japanese';

export const ALL_LEVELS: LanguageLevel[] = ['PRE_A1', 'A1', 'A2', 'B1', 'B2'];

export const MULTI_LANGUAGE_CURRICULUM: Record<LanguageCode, Record<LanguageLevel, { lessons: LanguageLesson[]; mission: FinalMission }>> = {
  en: ENGLISH_CURRICULUM,
  fr: FRENCH_CURRICULUM,
  es: SPANISH_CURRICULUM,
  de: GERMAN_CURRICULUM,
  ja: JAPANESE_CURRICULUM
};

export function getCurriculumByLanguageAndLevel(languageCode: LanguageCode, level: LanguageLevel) {
  const langData = MULTI_LANGUAGE_CURRICULUM[languageCode] || MULTI_LANGUAGE_CURRICULUM['en'];
  return langData[level] || langData['PRE_A1'];
}

export function getLessonById(lessonId: string, languageCode: LanguageCode = 'en'): LanguageLesson | undefined {
  const langData = MULTI_LANGUAGE_CURRICULUM[languageCode] || MULTI_LANGUAGE_CURRICULUM['en'];
  for (const lvl of ALL_LEVELS) {
    const found = langData[lvl].lessons.find(l => l.id === lessonId);
    if (found) return found;
  }
  // Fallback search across all languages if not found under specified languageCode
  for (const langKey of Object.keys(MULTI_LANGUAGE_CURRICULUM) as LanguageCode[]) {
    for (const lvl of ALL_LEVELS) {
      const found = MULTI_LANGUAGE_CURRICULUM[langKey][lvl].lessons.find(l => l.id === lessonId);
      if (found) return found;
    }
  }
  return undefined;
}
