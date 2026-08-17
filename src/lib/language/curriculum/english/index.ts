import { LanguageLesson, FinalMission, LanguageLevel } from '../../languageTypes';
import { PRE_A1_ENGLISH_LESSONS, PRE_A1_ENGLISH_MISSION } from './preA1';
import { A1_LESSONS, A1_MISSION } from '../a1';
import { A2_LESSONS, A2_MISSION } from '../a2';
import { B1_LESSONS, B1_MISSION } from '../b1';
import { B2_LESSONS, B2_MISSION } from '../b2';

export const ENGLISH_CURRICULUM: Record<LanguageLevel, { lessons: LanguageLesson[]; mission: FinalMission }> = {
  PRE_A1: { lessons: PRE_A1_ENGLISH_LESSONS, mission: PRE_A1_ENGLISH_MISSION },
  A1: { lessons: A1_LESSONS.map(l => ({ ...l, languageCode: 'en' as const })), mission: A1_MISSION },
  A2: { lessons: A2_LESSONS.map(l => ({ ...l, languageCode: 'en' as const })), mission: A2_MISSION },
  B1: { lessons: B1_LESSONS.map(l => ({ ...l, languageCode: 'en' as const })), mission: B1_MISSION },
  B2: { lessons: B2_LESSONS.map(l => ({ ...l, languageCode: 'en' as const })), mission: B2_MISSION }
};
