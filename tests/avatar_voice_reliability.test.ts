// tests/avatar_voice_reliability.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  mapSpeechClassToVRoidMorphs,
  phonemeToSpeechClass,
  SpeechClass,
  VisemeEvent
} from '../src/lib/avatar/visemeTypes';
import {
  splitIntoSentences,
  setAvatarVisemeTimeline,
  clearAvatarVisemeTimeline,
  getAvatarActiveSpeechClass
} from '../src/lib/audio/streamingAudioQueue';

describe('Avatar Voice Reliability & Rig-Aware Articulation Test Suite', () => {

  describe('1. Pure SpeechClass to VRoid Morph Target Mapper', () => {
    it('should map BILABIAL_CLOSE (/p/, /b/, /m/) to Fcl_MTH_Close with zero vowels', () => {
      const morphs = mapSpeechClassToVRoidMorphs('BILABIAL_CLOSE', 1.0);
      assert.strictEqual(morphs.close, 1.0, 'Close morph must be 1.0 for bilabials');
      assert.strictEqual(morphs.A, 0, 'Vowel A must be 0 for closed lips');
      assert.strictEqual(morphs.I, 0, 'Vowel I must be 0 for closed lips');
      assert.strictEqual(morphs.U, 0, 'Vowel U must be 0 for closed lips');
    });

    it('should map LABIODENTAL (/f/, /v/) to small + down lip tuck', () => {
      const morphs = mapSpeechClassToVRoidMorphs('LABIODENTAL', 1.0);
      assert.ok(morphs.small > 0.5, 'Lower lip narrowing must be active');
      assert.ok(morphs.down > 0.3, 'Lower lip down tuck must be active');
      assert.strictEqual(morphs.close, 0, 'Mouth must not be fully clamped shut');
    });

    it('should map DENTAL_NARROW (/t/, /d/, /s/, /z/, /th/) to narrow teeth aperture', () => {
      const morphs = mapSpeechClassToVRoidMorphs('DENTAL_NARROW', 1.0);
      assert.ok(morphs.I > 0.4, 'I teeth aperture must be active');
      assert.ok(morphs.small > 0.3, 'Mouth small narrowing must be active');
      assert.strictEqual(morphs.A, 0, 'Jaw drop A must be 0');
    });

    it('should map VOWEL_OPEN (/a/, /ah/, /ae/) to full vertical jaw drop', () => {
      const morphs = mapSpeechClassToVRoidMorphs('VOWEL_OPEN', 1.0);
      assert.ok(morphs.A >= 0.85, 'A jaw drop must be near maximum');
      assert.strictEqual(morphs.close, 0, 'Mouth must not be closed');
    });

    it('should map VOWEL_ROUND (/u/, /w/, /o/) to forward pucker', () => {
      const morphs = mapSpeechClassToVRoidMorphs('VOWEL_ROUND', 1.0);
      assert.ok(morphs.U >= 0.8, 'U pucker must be primary');
      assert.ok(morphs.small > 0.3, 'Small funneling must accompany U');
      assert.strictEqual(morphs.close, 0);
    });

    it('should map REST_NEUTRAL to all zeroes', () => {
      const morphs = mapSpeechClassToVRoidMorphs('REST_NEUTRAL', 1.0);
      assert.strictEqual(morphs.close, 0);
      assert.strictEqual(morphs.A, 0);
      assert.strictEqual(morphs.I, 0);
      assert.strictEqual(morphs.U, 0);
      assert.strictEqual(morphs.E, 0);
      assert.strictEqual(morphs.O, 0);
    });

    it('should scale morph weights proportionally with intensity parameter', () => {
      const morphsHalf = mapSpeechClassToVRoidMorphs('BILABIAL_CLOSE', 0.5);
      assert.strictEqual(morphsHalf.close, 0.5);
    });
  });

  describe('2. Phoneme to SpeechClass Converter', () => {
    it('should categorize plosives and bilabials correctly', () => {
      assert.strictEqual(phonemeToSpeechClass('p'), 'BILABIAL_CLOSE');
      assert.strictEqual(phonemeToSpeechClass('b'), 'BILABIAL_CLOSE');
      assert.strictEqual(phonemeToSpeechClass('m'), 'BILABIAL_CLOSE');
    });

    it('should categorize fricatives correctly', () => {
      assert.strictEqual(phonemeToSpeechClass('f'), 'LABIODENTAL');
      assert.strictEqual(phonemeToSpeechClass('v'), 'LABIODENTAL');
    });

    it('should categorize dentals and sibilants correctly', () => {
      assert.strictEqual(phonemeToSpeechClass('t'), 'DENTAL_NARROW');
      assert.strictEqual(phonemeToSpeechClass('d'), 'DENTAL_NARROW');
      assert.strictEqual(phonemeToSpeechClass('s'), 'DENTAL_NARROW');
      assert.strictEqual(phonemeToSpeechClass('z'), 'DENTAL_NARROW');
      assert.strictEqual(phonemeToSpeechClass('th'), 'DENTAL_NARROW');
    });

    it('should categorize vowels correctly', () => {
      assert.strictEqual(phonemeToSpeechClass('aa'), 'VOWEL_OPEN');
      assert.strictEqual(phonemeToSpeechClass('uw'), 'VOWEL_ROUND');
      assert.strictEqual(phonemeToSpeechClass('iy'), 'VOWEL_WIDE');
    });

    it('should categorize silences and pauses to REST_NEUTRAL', () => {
      assert.strictEqual(phonemeToSpeechClass('sil'), 'REST_NEUTRAL');
      assert.strictEqual(phonemeToSpeechClass('sp'), 'REST_NEUTRAL');
      assert.strictEqual(phonemeToSpeechClass(''), 'REST_NEUTRAL');
    });
  });

  describe('3. Viseme Timeline Media Time Synchronization', () => {
    it('should return the correct active speech class at a given media timestamp', () => {
      const testEvents: VisemeEvent[] = [
        { start_s: 0.00, end_s: 0.08, speechClass: 'REST_NEUTRAL', weight: 0 },
        { start_s: 0.08, end_s: 0.16, speechClass: 'BILABIAL_CLOSE', weight: 0.95 },
        { start_s: 0.16, end_s: 0.28, speechClass: 'VOWEL_WIDE', weight: 0.80 },
        { start_s: 0.28, end_s: 0.40, speechClass: 'DENTAL_NARROW', weight: 0.70 }
      ];

      setAvatarVisemeTimeline(testEvents, 0);

      // At 0.12s -> should be BILABIAL_CLOSE
      const activeAt120ms = getAvatarActiveSpeechClass(0.12);
      assert.ok(activeAt120ms, 'Must resolve an active event');
      assert.strictEqual(activeAt120ms?.speechClass, 'BILABIAL_CLOSE');
      assert.strictEqual(activeAt120ms?.weight, 0.95);

      // At 0.20s -> should be VOWEL_WIDE
      const activeAt200ms = getAvatarActiveSpeechClass(0.20);
      assert.ok(activeAt200ms);
      assert.strictEqual(activeAt200ms?.speechClass, 'VOWEL_WIDE');

      // Beyond timeline -> returns null
      const activeAt500ms = getAvatarActiveSpeechClass(0.50);
      assert.strictEqual(activeAt500ms, null);

      clearAvatarVisemeTimeline();
      assert.strictEqual(getAvatarActiveSpeechClass(0.12), null, 'Cleared timeline must return null');
    });
  });

  describe('4. Hierarchical Sentence Boundary Protection', () => {
    it('should preserve technical acronyms, versions and abbreviations without fragmentation', () => {
      const text = 'Welcome to PinIT Careers v1.0. e.g. Mr. Anish teaches SQL, node.js and AWS APIs. Next sentence.';
      const sentences = splitIntoSentences(text);

      assert.strictEqual(sentences.length, 2, 'Should split into exactly 2 natural sentences, protecting abbreviations');
      assert.ok(sentences[0].includes('v1.0'), 'Must retain v1.0 intact');
      assert.ok(sentences[0].includes('e.g.'), 'Must retain e.g. intact');
      assert.ok(sentences[0].includes('Mr. Anish'), 'Must retain Mr. Anish intact');
      assert.ok(sentences[0].includes('node.js'), 'Must retain node.js intact');
      assert.strictEqual(sentences[1], 'Next sentence.');
    });
  });
});
