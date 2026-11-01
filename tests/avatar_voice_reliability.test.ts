// tests/avatar_voice_reliability.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  mapSpeechClassToVRoidMorphs,
  phonemeToSpeechClass,
  SpeechClass,
  VisemeEvent,
  VisemeTimelinePayload
} from '../src/lib/avatar/visemeTypes';
import {
  splitIntoSentences,
  setAvatarVisemeTimeline,
  clearAvatarVisemeTimeline,
  appendAvatarVisemeTimeline,
  getAvatarActiveSpeechClass,
  generateEstimatedVisemes
} from '../src/lib/audio/streamingAudioQueue';
import { computeVoiceCacheKey } from '../src/lib/voiceCacheDB';

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

  describe('5. Client-Side Deterministic Estimated Visemes Generator', () => {
    it('should produce contiguous visemes bounded by duration', () => {
      const text = 'Welcome to PinIT Careers, the platform for professional growth.';
      const duration = 3.5;
      const events = generateEstimatedVisemes(text, duration);

      assert.ok(events.length > 5, 'Should generate fine-grained events');
      assert.strictEqual(events[0].start_s <= 0.05, true, 'First event should start near zero');
      assert.ok(events[events.length - 1].end_s >= duration, 'Last event must reach or exceed duration');

      // Must contain BILABIAL_CLOSE for P/B/M ("Welcome", "PinIT", "platform", "professional")
      const bilabials = events.filter(e => e.speechClass === 'BILABIAL_CLOSE');
      assert.ok(bilabials.length >= 3, 'Must detect multiple bilabials in text with M, P, and B');
      for (const b of bilabials) {
        assert.strictEqual(b.weight, 1.0, 'Bilabials must have full weight for lip seal');
      }

      // Check continuity
      for (let i = 0; i < events.length - 1; i++) {
        assert.strictEqual(events[i].end_s, events[i + 1].start_s, `Event ${i} end must match event ${i + 1} start`);
      }
    });

    it('should return safe neutral pose for empty or whitespace text', () => {
      const events = generateEstimatedVisemes('   ', 2.0);
      assert.strictEqual(events.length, 1);
      assert.strictEqual(events[0].speechClass, 'REST_NEUTRAL');
      assert.strictEqual(events[0].end_s, 2.0);
    });
  });

  describe('6. Pipelined Viseme Timeline Appending & Chunk Offsets', () => {
    it('should offset consecutive chunk visemes on the unified playback timeline', () => {
      clearAvatarVisemeTimeline();

      const chunk0Events: VisemeEvent[] = [
        { start_s: 0.0, end_s: 1.0, speechClass: 'VOWEL_OPEN', weight: 0.9 },
        { start_s: 1.0, end_s: 2.0, speechClass: 'BILABIAL_CLOSE', weight: 1.0 }
      ];

      const chunk1Events: VisemeEvent[] = [
        { start_s: 0.0, end_s: 0.8, speechClass: 'VOWEL_ROUND', weight: 0.85 },
        { start_s: 0.8, end_s: 1.5, speechClass: 'LABIODENTAL', weight: 0.9 }
      ];

      // Chunk 0 starts at media time 10.0
      appendAvatarVisemeTimeline(chunk0Events, 10.0);
      // Chunk 1 starts at media time 12.0
      appendAvatarVisemeTimeline(chunk1Events, 12.0);

      // Within chunk 0 (relative offset 0 -> 1.5s is media time 1.5 relative to chunk0 start)
      const evAt1_5 = getAvatarActiveSpeechClass(1.5);
      assert.ok(evAt1_5);
      assert.strictEqual(evAt1_5?.speechClass, 'BILABIAL_CLOSE');

      // Within chunk 1 (relative offset 2.0 -> 2.5s is media time 0.5 into chunk 1)
      const evAt2_5 = getAvatarActiveSpeechClass(2.5);
      assert.ok(evAt2_5);
      assert.strictEqual(evAt2_5?.speechClass, 'VOWEL_ROUND');

      // Second part of chunk 1 (relative offset 2.0 + 1.0 = 3.0s)
      const evAt3_0 = getAvatarActiveSpeechClass(3.0);
      assert.ok(evAt3_0);
      assert.strictEqual(evAt3_0?.speechClass, 'LABIODENTAL');

      clearAvatarVisemeTimeline();
    });
  });

  describe('7. Static Diagnostic Companion Viseme Verification', () => {
    const teachers = ['priya', 'anish', 'kashyap', 'karthic'];

    teachers.forEach(teacher => {
      it(`should have valid companion viseme JSON files for ${teacher} steps 0 through 6`, () => {
        for (let step = 0; step <= 6; step++) {
          const jsonPath = path.join(__dirname, '..', 'public', 'audio', teacher, `step${step}.visemes.json`);
          assert.ok(fs.existsSync(jsonPath), `Missing companion viseme file: ${jsonPath}`);

          const raw = fs.readFileSync(jsonPath, 'utf-8');
          const data: VisemeTimelinePayload = JSON.parse(raw);

          assert.strictEqual(data.schema_version, 1, 'Schema version must be 1');
          assert.strictEqual(data.voice_id, teacher, `Voice ID must match teacher ${teacher}`);
          assert.strictEqual(data.timebase, 'media_seconds', 'Timebase must be media_seconds');
          assert.ok(data.duration_s > 5.0, `Duration must exceed 5 seconds, got ${data.duration_s}`);
          assert.ok(data.events.length > 20, `Events count must be > 20, got ${data.events.length}`);

          // Verify every event has valid speechClass and monotonically increasing time
          for (let i = 0; i < data.events.length; i++) {
            const ev = data.events[i];
            assert.ok(ev.start_s <= ev.end_s, `Event ${i} start_s (${ev.start_s}) > end_s (${ev.end_s})`);
            assert.ok(
              [
                'BILABIAL_CLOSE',
                'LABIODENTAL',
                'DENTAL_NARROW',
                'VOWEL_OPEN',
                'VOWEL_ROUND',
                'VOWEL_WIDE',
                'REST_NEUTRAL'
              ].includes(ev.speechClass),
              `Invalid speech class: ${ev.speechClass}`
            );
          }
        }
      });
    });
  });

  describe('8. Deterministic Voice Cache Key Generation', () => {
    it('should generate identical keys for identical input across repeated calls', async () => {
      const key1 = await computeVoiceCacheKey('Welcome to PinIT Careers', 'af_bella', 1.0);
      const key2 = await computeVoiceCacheKey('Welcome to PinIT Careers', 'af_bella', 1.0);
      assert.strictEqual(key1, key2);
      assert.ok(key1.length > 10);
    });

    it('should generate different keys for different voices or speeds', async () => {
      const keyPriya = await computeVoiceCacheKey('Hello World', 'priya', 1.0);
      const keyAnish = await computeVoiceCacheKey('Hello World', 'anish', 1.0);
      const keyFast = await computeVoiceCacheKey('Hello World', 'priya', 1.2);

      assert.notStrictEqual(keyPriya, keyAnish);
      assert.notStrictEqual(keyPriya, keyFast);
    });
  });
});
