import { LanguageLesson, FinalMission, LanguageLevel } from '../../languageTypes';
import { PRE_A1_SPANISH_LESSONS, PRE_A1_SPANISH_MISSION } from './preA1';

export const SPANISH_CURRICULUM: Record<LanguageLevel, { lessons: LanguageLesson[]; mission: FinalMission }> = {
  PRE_A1: { lessons: PRE_A1_SPANISH_LESSONS, mission: PRE_A1_SPANISH_MISSION },
  A1: { lessons: PRE_A1_SPANISH_LESSONS, mission: PRE_A1_SPANISH_MISSION },
  A2: { lessons: PRE_A1_SPANISH_LESSONS, mission: PRE_A1_SPANISH_MISSION },
  B1: { lessons: PRE_A1_SPANISH_LESSONS, mission: PRE_A1_SPANISH_MISSION },
  B2: { lessons: PRE_A1_SPANISH_LESSONS, mission: PRE_A1_SPANISH_MISSION }
};
