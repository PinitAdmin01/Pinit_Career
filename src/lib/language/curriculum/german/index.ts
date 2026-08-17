import { LanguageLesson, FinalMission, LanguageLevel } from '../../languageTypes';
import { PRE_A1_GERMAN_LESSONS, PRE_A1_GERMAN_MISSION } from './preA1';

export const GERMAN_CURRICULUM: Record<LanguageLevel, { lessons: LanguageLesson[]; mission: FinalMission }> = {
  PRE_A1: { lessons: PRE_A1_GERMAN_LESSONS, mission: PRE_A1_GERMAN_MISSION },
  A1: { lessons: PRE_A1_GERMAN_LESSONS, mission: PRE_A1_GERMAN_MISSION },
  A2: { lessons: PRE_A1_GERMAN_LESSONS, mission: PRE_A1_GERMAN_MISSION },
  B1: { lessons: PRE_A1_GERMAN_LESSONS, mission: PRE_A1_GERMAN_MISSION },
  B2: { lessons: PRE_A1_GERMAN_LESSONS, mission: PRE_A1_GERMAN_MISSION }
};
