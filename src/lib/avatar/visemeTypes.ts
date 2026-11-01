// src/lib/avatar/visemeTypes.ts
/**
 * PinIT Careers Avatar Speech & Viseme Articulation Types
 * Standardizes speech classes across both pre-baked static lessons and live neural streams,
 * and maps them deterministically to VRoid Studio / VRM morph targets.
 */

export type SpeechClass =
  | 'BILABIAL_CLOSE'  // /p/, /b/, /m/ -> Lips pressed shut
  | 'LABIODENTAL'     // /f/, /v/ -> Lower lip drawn back under teeth
  | 'DENTAL_NARROW'   // /s/, /z/, /t/, /d/, /th/ -> Teeth together, narrow slit
  | 'VOWEL_OPEN'      // /a/, /ah/, /ae/ -> Full vertical jaw drop
  | 'VOWEL_ROUND'     // /u/, /oo/, /w/, /o/ -> Forward pucker / funnel
  | 'VOWEL_WIDE'      // /i/, /ee/, /ey/ -> Horizontal lip spread
  | 'REST_NEUTRAL';   // Silence / breath -> Neutral rest pose

export interface VisemeEvent {
  start_s: number;
  end_s: number;
  speechClass: SpeechClass;
  weight: number; // 0.0 to 1.0
}

export interface VisemeTimelinePayload {
  schema_version: 1;
  asset_id?: string;
  voice_id: string;
  timebase: 'media_seconds';
  events: VisemeEvent[];
}

/**
 * Maps a SpeechClass to native VRoid morph target influences.
 * VRoid models (such as Priya, Anish, Kashyap) expose:
 * - Fcl_MTH_Close
 * - Fcl_MTH_Small
 * - Fcl_MTH_Down
 * - Fcl_MTH_Up
 * - Fcl_MTH_A, I, U, E, O
 */
export interface VRoidMorphWeights {
  close: number;
  small: number;
  down: number;
  up: number;
  A: number;
  I: number;
  U: number;
  E: number;
  O: number;
}

export function mapSpeechClassToVRoidMorphs(
  speechClass: SpeechClass,
  weight = 1.0
): VRoidMorphWeights {
  const w = Math.max(0, Math.min(1, weight));

  switch (speechClass) {
    case 'BILABIAL_CLOSE':
      return { close: 1.0 * w, small: 0.1 * w, down: 0, up: 0, A: 0, I: 0, U: 0, E: 0, O: 0 };
    case 'LABIODENTAL':
      return { close: 0, small: 0.65 * w, down: 0.40 * w, up: 0, A: 0.15 * w, I: 0.20 * w, U: 0, E: 0, O: 0 };
    case 'DENTAL_NARROW':
      return { close: 0, small: 0.40 * w, down: 0, up: 0, A: 0, I: 0.55 * w, U: 0, E: 0.25 * w, O: 0 };
    case 'VOWEL_OPEN':
      return { close: 0, small: 0, down: 0, up: 0, A: 0.90 * w, I: 0, U: 0, E: 0, O: 0.10 * w };
    case 'VOWEL_ROUND':
      return { close: 0, small: 0.45 * w, down: 0, up: 0, A: 0, I: 0, U: 0.85 * w, E: 0, O: 0.50 * w };
    case 'VOWEL_WIDE':
      return { close: 0, small: 0, down: 0, up: 0, A: 0, I: 0.75 * w, U: 0, E: 0.50 * w, O: 0 };
    case 'REST_NEUTRAL':
    default:
      return { close: 0, small: 0, down: 0, up: 0, A: 0, I: 0, U: 0, E: 0, O: 0 };
  }
}

/**
 * Phoneme to SpeechClass converter (IPA / Arpabet tokens from Kokoro / TTS)
 */
export function phonemeToSpeechClass(phoneme: string): SpeechClass {
  const p = phoneme.toLowerCase().trim();
  if (!p || p === 'sil' || p === 'sp' || p === 'pau') return 'REST_NEUTRAL';

  // Bilabial
  if (['p', 'b', 'm'].includes(p)) return 'BILABIAL_CLOSE';

  // Labiodental
  if (['f', 'v'].includes(p)) return 'LABIODENTAL';

  // Dental / Alveolar / Sibilant
  if (['t', 'd', 's', 'z', 'th', 'dh', 'sh', 'zh', 'ch', 'jh', 'n', 'l'].includes(p)) {
    return 'DENTAL_NARROW';
  }

  // Open Vowels
  if (['aa', 'ae', 'ah', 'ao', 'a', 'ɑ', 'ʌ', 'æ'].includes(p)) return 'VOWEL_OPEN';

  // Rounded Vowels
  if (['uw', 'uh', 'ow', 'u', 'w', 'o', 'ʊ', 'u:', 'oʊ'].includes(p)) return 'VOWEL_ROUND';

  // Wide / Front Vowels
  if (['iy', 'ih', 'ey', 'eh', 'i', 'e', 'ɪ', 'i:', 'eɪ'].includes(p)) return 'VOWEL_WIDE';

  return 'REST_NEUTRAL';
}
