import { LanguageLesson, FinalMission, LanguageLevel } from '../../languageTypes';
import { PRE_A1_FRENCH_LESSONS, PRE_A1_FRENCH_MISSION } from './preA1';

export const FRENCH_CURRICULUM: Record<LanguageLevel, { lessons: LanguageLesson[]; mission: FinalMission }> = {
  PRE_A1: { lessons: PRE_A1_FRENCH_LESSONS, mission: PRE_A1_FRENCH_MISSION },
  A1: { lessons: PRE_A1_FRENCH_LESSONS, mission: PRE_A1_FRENCH_MISSION },
  A2: { lessons: PRE_A1_FRENCH_LESSONS, mission: PRE_A1_FRENCH_MISSION },
  B1: { lessons: PRE_A1_FRENCH_LESSONS, mission: PRE_A1_FRENCH_MISSION },
  B2: { lessons: PRE_A1_FRENCH_LESSONS, mission: PRE_A1_FRENCH_MISSION }
};
