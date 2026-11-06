with open('src/lib/tts.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  if (isStoryTourAudioLocked() && !options?.force) {
    console.log('[PinIT TTS] 🛡️ speakWithAvatar() suppressed: Story Tour narration owns the audio channel');
    return;
  }
  stopSpeaking(true);
  const mySpeechId = currentSpeechId;
  if (isMuted || !text) return;

  const cleanSpeechText = sanitizeForSpeech(text);
  if (!cleanSpeechText) return;"""

replacement = """  if (isStoryTourAudioLocked() && !options?.force) {
    console.log('[PinIT TTS] 🛡️ speakWithAvatar() suppressed: Story Tour narration owns the audio channel');
    try { onEnd(); } catch {}
    return;
  }
  stopSpeaking(true);
  const mySpeechId = currentSpeechId;
  if (!text) {
    try { onEnd(); } catch {}
    return;
  }

  const cleanSpeechText = sanitizeForSpeech(text);
  if (!cleanSpeechText) {
    try { onEnd(); } catch {}
    return;
  }

  if (isMuted) {
    try { onStart(); } catch {}
    const simulatedReadingMs = Math.min(3500, Math.max(1200, cleanSpeechText.length * 35));
    setTimeout(() => {
      if (mySpeechId === currentSpeechId) {
        try { onEnd(); } catch {}
      }
    }, simulatedReadingMs);
    return;
  }"""

# Normalize CRLF for matching
content_norm = content.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in content_norm:
    content_norm = content_norm.replace(target_norm, replacement_norm, 1)
    with open('src/lib/tts.ts', 'w', encoding='utf-8') as f:
        f.write(content_norm)
    print("SUCCESS: Updated src/lib/tts.ts")
else:
    print("ERROR: Target not found in src/lib/tts.ts")
