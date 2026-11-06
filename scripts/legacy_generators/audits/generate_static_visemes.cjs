// scripts/generate_static_visemes.cjs
/**
 * Pre-bakes companion .visemes.json files for static diagnostic audio assets.
 * Matches the PinIT VisemeTimelinePayload schema (v1).
 */

const fs = require('fs');
const path = require('path');

const STATIC_TEXTS = {
  step0: "welcome to your personal diagnostic assessment first are you a college student a fresh graduate or a working professional",
  step1: "got it next what is your dream job do you want to build websites work with clouds or build software",
  step2: "nice choice why did you join today are you looking for a job wanting to learn new skills or preparing for an interview",
  step3: "understood next question how much coding experience do you have are you a beginner intermediate or advanced coder",
  step4: "understood how do you prefer to learn do you like reading articles watching videos or writing code hands on",
  step5: "last question how many hours per week can you dedicate to learning five hours ten hours or more",
  step6: "fantastic next let s load your identity discovery slides to establish your cognitive styles"
};

const TEACHERS = ['priya', 'anish', 'kashyap', 'karthic'];

function getAudioDuration(filePath) {
  const buf = fs.readFileSync(filePath);
  // MPEG-2 Layer 3 Mono 48kbps 24000Hz has 144-byte frames @ 24ms per frame
  const frames = Math.floor(buf.length / 144);
  return frames * 0.024;
}

function charToSpeechClass(char, nextChar) {
  const c = char.toLowerCase();
  const next = (nextChar || '').toLowerCase();

  if (c === 'p' || c === 'b' || c === 'm') return 'BILABIAL_CLOSE';
  if (c === 'f' || c === 'v') return 'LABIODENTAL';
  if (c === 'w' || c === 'u' || (c === 'o' && next === 'o')) return 'VOWEL_ROUND';
  if (c === 'o') return 'VOWEL_ROUND';
  if (c === 'a') return 'VOWEL_OPEN';
  if (c === 'e' || c === 'i' || c === 'y') return 'VOWEL_WIDE';
  if ('tdsznrlcjkg'.includes(c)) return 'DENTAL_NARROW';
  return 'REST_NEUTRAL';
}

function generateVisemeTimeline(text, totalDuration, voiceId, assetId) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return {
      schema_version: 1,
      asset_id: assetId,
      voice_id: voiceId,
      timebase: "media_seconds",
      duration_s: totalDuration,
      events: [{ start_s: 0, end_s: totalDuration, speechClass: "REST_NEUTRAL", weight: 0 }]
    };
  }

  // Weight words by length with slight trailing pause weight
  const totalLetters = words.reduce((acc, w) => acc + w.length + 1.2, 0);
  const timePerLetter = totalDuration / totalLetters;

  const rawEvents = [];
  let currentTime = 0.05; // tiny leading silence

  for (let wIdx = 0; wIdx < words.length; wIdx++) {
    const word = words[wIdx];
    const wordDuration = (word.length + 0.5) * timePerLetter;
    const charDuration = wordDuration / word.length;

    for (let cIdx = 0; cIdx < word.length; cIdx++) {
      const ch = word[cIdx];
      const nextCh = word[cIdx + 1];
      const speechClass = charToSpeechClass(ch, nextCh);
      const start = parseFloat(currentTime.toFixed(3));
      const end = parseFloat((currentTime + charDuration).toFixed(3));
      currentTime += charDuration;

      rawEvents.push({
        start_s: start,
        end_s: end,
        speechClass,
        weight: speechClass === 'BILABIAL_CLOSE' ? 1.0 : speechClass === 'REST_NEUTRAL' ? 0.0 : 0.85
      });
    }

    // Small word spacing gap
    const gapDuration = 0.7 * timePerLetter;
    rawEvents.push({
      start_s: parseFloat(currentTime.toFixed(3)),
      end_s: parseFloat((currentTime + gapDuration).toFixed(3)),
      speechClass: 'REST_NEUTRAL',
      weight: 0.0
    });
    currentTime += gapDuration;
  }

  // Coalesce contiguous matching speech classes for smooth GPU morph interpolation
  const coalesced = [];
  for (const ev of rawEvents) {
    if (coalesced.length === 0) {
      coalesced.push({ ...ev });
      continue;
    }
    const last = coalesced[coalesced.length - 1];
    if (last.speechClass === ev.speechClass) {
      last.end_s = ev.end_s;
    } else {
      coalesced.push({ ...ev });
    }
  }

  // Ensure last event reaches totalDuration
  if (coalesced.length > 0) {
    coalesced[coalesced.length - 1].end_s = Math.max(coalesced[coalesced.length - 1].end_s, totalDuration);
  }

  return {
    schema_version: 1,
    asset_id: assetId,
    voice_id: voiceId,
    timebase: "media_seconds",
    duration_s: parseFloat(totalDuration.toFixed(3)),
    events: coalesced
  };
}

let generatedCount = 0;
for (const teacher of TEACHERS) {
  for (let step = 0; step <= 6; step++) {
    const wavPath = path.join(__dirname, '..', 'public', 'audio', teacher, `step${step}.wav`);
    const jsonPath = path.join(__dirname, '..', 'public', 'audio', teacher, `step${step}.visemes.json`);

    if (fs.existsSync(wavPath)) {
      const duration = getAudioDuration(wavPath);
      const text = STATIC_TEXTS[`step${step}`];
      const timeline = generateVisemeTimeline(text, duration, teacher, `${teacher}_step${step}`);
      fs.writeFileSync(jsonPath, JSON.stringify(timeline, null, 2), 'utf-8');
      generatedCount++;
      console.log(`Generated: ${path.relative(path.join(__dirname, '..'), jsonPath)} (${timeline.events.length} events, ${duration.toFixed(2)}s)`);
    } else {
      console.warn(`File not found: ${wavPath}`);
    }
  }
}

console.log(`Successfully generated ${generatedCount} companion viseme files.`);
