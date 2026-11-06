import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SpeechDebounceManager,
  computeSpeechCadence,
} from '../src/lib/interview/speechDebounce';

test('AI Interview Block 47 - Speech-to-Text & Camera Debounce Suite', async (t) => {
  await t.test('SpeechDebounceManager accumulates and joins interim and final speech chunks', () => {
    const manager = new SpeechDebounceManager({ silenceThresholdMs: 50 });
    
    manager.handleInterimChunk('I am');
    assert.equal(manager.getCurrentTranscript(), 'I am');

    manager.handleFinalChunk('I am explaining');
    assert.equal(manager.getCurrentTranscript(), 'I am explaining');

    manager.handleInterimChunk('our database schema');
    assert.equal(manager.getCurrentTranscript(), 'I am explaining our database schema');
  });

  await t.test('SpeechDebounceManager enforces silence threshold and triggers callback', async () => {
    const manager = new SpeechDebounceManager({ silenceThresholdMs: 40 });
    let triggeredText = '';

    manager.handleInterimChunk('Microservices architecture provides fault isolation', (text) => {
      triggeredText = text;
    });

    assert.equal(triggeredText, '');
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal(triggeredText, 'Microservices architecture provides fault isolation');
  });

  await t.test('SpeechDebounceManager suppresses duplicate submissions in sliding window', () => {
    const manager = new SpeechDebounceManager({ duplicateWindowMs: 1000 });
    manager.handleFinalChunk('React state management');
    
    const firstCommit = manager.commitSubmission();
    assert.ok(firstCommit);
    assert.equal(firstCommit.text, 'React state management');

    // Trying to submit the exact same utterance immediately must be suppressed
    manager.handleFinalChunk('React state management');
    const secondCommit = manager.commitSubmission();
    assert.equal(secondCommit, null);
  });

  await t.test('SpeechDebounceManager rejects empty or below-minimum word utterances', () => {
    const manager = new SpeechDebounceManager({ minWordCount: 2 });
    manager.handleInterimChunk('   ');
    assert.equal(manager.canSubmit(manager.getCurrentTranscript()), false);

    manager.handleFinalChunk('Hey');
    assert.equal(manager.canSubmit(manager.getCurrentTranscript()), false);

    manager.handleFinalChunk('Hey there');
    assert.equal(manager.canSubmit(manager.getCurrentTranscript()), true);
  });

  await t.test('computeSpeechCadence calculates WPM and detects filler words', () => {
    const text = 'Um basically we chose PostgreSQL because like it handles transactions well';
    const durationSec = 6.0; // ~11 words in 6 sec = 110 WPM
    const cadence = computeSpeechCadence(text, durationSec);

    assert.equal(cadence.wordCount, 11);
    assert.ok(cadence.clampedWpm >= 90 && cadence.clampedWpm <= 130);
    assert.ok(cadence.fillerWordCount >= 2); // 'um', 'basically', 'like'
    assert.ok(cadence.detectedFillers.includes('um'));
    assert.ok(cadence.detectedFillers.includes('basically'));
    assert.ok(cadence.detectedFillers.includes('like'));
  });

  await t.test('SpeechDebounceManager resets cleanly without memory leaks', () => {
    const manager = new SpeechDebounceManager({ silenceThresholdMs: 50 });
    manager.handleInterimChunk('In progress answer that was interrupted');
    manager.reset();
    assert.equal(manager.getCurrentTranscript(), '');
    assert.equal(manager.commitSubmission(), null);
  });
});
