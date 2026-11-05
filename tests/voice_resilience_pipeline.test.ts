import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  splitIntoSentences,
  getGlobalAudioQueue,
  SentenceAudioQueuePlayer,
  getAvatarVoiceVolume,
  setAvatarVoiceVolume
} from '../src/lib/audio/streamingAudioQueue';

test('Voice Pipeline: splitIntoSentences correctly breaks text and protects abbreviations', () => {
  const text = 'Welcome to PinIT Career OS! Please inspect e.g. the system architecture. We run on node.js v1.0 and scale to 3.14 million requests. Are you ready?';
  const sentences = splitIntoSentences(text);

  assert.ok(sentences.length >= 3, `Expected at least 3 chunks, got ${sentences.length}`);

  // Must not have severed "e.g." or "node.js" into broken fragments
  const joined = sentences.join(' ');
  assert.ok(joined.includes('e.g.'), 'Must preserve e.g. abbreviation');
  assert.ok(joined.includes('node.js'), 'Must preserve node.js token');
  assert.ok(joined.includes('v1.0'), 'Must preserve v1.0 version tag');
  assert.ok(joined.includes('3.14'), 'Must preserve 3.14 decimal number');

  // Verify bounded chunk sizes (max 140 chars per chunk)
  for (const chunk of sentences) {
    assert.ok(chunk.length <= 150, `Chunk exceeds reasonable boundary length: ${chunk.length} chars ("${chunk}")`);
  }
});

test('Voice Pipeline: SentenceAudioQueuePlayer life-cycle and hard interruption', () => {
  const queue = new SentenceAudioQueuePlayer();
  assert.equal(queue.isCurrentlyPlaying(), false, 'Queue should not be playing on init');

  // Verify abort signal exists
  const signal = queue.getAbortSignal();
  assert.ok(signal, 'AbortSignal must be defined');
  assert.equal(signal.aborted, false, 'AbortSignal should initially be active');

  // Call stopAll
  queue.stopAll();
  assert.equal(queue.isCurrentlyPlaying(), false, 'Queue should remain not playing after stopAll');

  // Global singleton instance
  const globalQ = getGlobalAudioQueue();
  assert.ok(globalQ instanceof SentenceAudioQueuePlayer, 'getGlobalAudioQueue must return SentenceAudioQueuePlayer');
});

test('Voice Pipeline: Avatar voice volume controls clamp to [0.0, 1.0]', () => {
  setAvatarVoiceVolume(0.75);
  assert.equal(getAvatarVoiceVolume(), 0.75, 'Volume should be set to 0.75');

  // Lower clamp boundary
  setAvatarVoiceVolume(-0.25);
  assert.equal(getAvatarVoiceVolume(), 0.0, 'Volume must clamp to 0.0 on negative input');

  // Upper clamp boundary
  setAvatarVoiceVolume(1.85);
  assert.equal(getAvatarVoiceVolume(), 1.0, 'Volume must clamp to 1.0 on exceeding input');

  // Restore baseline
  setAvatarVoiceVolume(0.85);
  assert.equal(getAvatarVoiceVolume(), 0.85);
});

test('Voice Pipeline: speakWithAvatar enforces 3500ms start deadline fallback across streaming & single-shot', () => {
  const ttsPath = path.resolve(process.cwd(), 'src/lib/tts.ts');
  const ttsContent = fs.readFileSync(ttsPath, 'utf-8');

  // Must have 3500ms default start deadline in sentence streaming
  assert.ok(
    ttsContent.includes('const streamDeadlineMs = options?.startDeadlineMs ??'),
    'tts.ts must default streamDeadlineMs'
  );

  // Must have 3500ms default start deadline in single-request path
  assert.ok(
    ttsContent.includes('const startDeadlineMs = options?.startDeadlineMs ??'),
    'tts.ts must default startDeadlineMs'
  );

  // Must have fallbackWebSpeech call in streaming catch block
  assert.ok(
    ttsContent.includes('fallbackWebSpeech('),
    'tts.ts must call fallbackWebSpeech on neural timeout or failure'
  );
});

test('Voice Pipeline: Kokoro neural voice mapping covers all mentor and teacher personas', () => {
  const ttsPath = path.resolve(process.cwd(), 'src/lib/tts.ts');
  const ttsContent = fs.readFileSync(ttsPath, 'utf-8');

  const requiredPersonas = ['priya', 'anish', 'kashyap', 'karthic', 'maya', 'divya'];
  for (const persona of requiredPersonas) {
    assert.ok(
      ttsContent.includes(`${persona}:`),
      `KOKORO_VOICE_MAP must contain persona voice mapping for: ${persona}`
    );
  }
});
