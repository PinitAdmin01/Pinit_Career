import { LanguageLesson, FinalMission, LanguageLevel } from '../../languageTypes';
import { PRE_A1_JAPANESE_LESSONS, PRE_A1_JAPANESE_MISSION } from './preA1';
import { JAPANESE_KANA_LESSON } from './kanaScript';

export const JAPANESE_CURRICULUM: Record<LanguageLevel, { lessons: LanguageLesson[]; mission: FinalMission }> = {
  PRE_A1: { lessons: [JAPANESE_KANA_LESSON, ...PRE_A1_JAPANESE_LESSONS], mission: PRE_A1_JAPANESE_MISSION },
  A1: { lessons: [JAPANESE_KANA_LESSON, ...PRE_A1_JAPANESE_LESSONS], mission: PRE_A1_JAPANESE_MISSION },
  A2: { lessons: [JAPANESE_KANA_LESSON, ...PRE_A1_JAPANESE_LESSONS], mission: PRE_A1_JAPANESE_MISSION },
  B1: { lessons: [JAPANESE_KANA_LESSON, ...PRE_A1_JAPANESE_LESSONS], mission: PRE_A1_JAPANESE_MISSION },
  B2: { lessons: [JAPANESE_KANA_LESSON, ...PRE_A1_JAPANESE_LESSONS], mission: PRE_A1_JAPANESE_MISSION }
};
