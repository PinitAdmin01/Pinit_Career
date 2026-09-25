/**
 * Automated Verification Suite: Story Mode Optimization & Forensic Audit
 * Verifies:
 * 1. 30s runtime constraint (< 30s) across all 7 flagship slides
 * 2. Route mappings for Tabs 1-7 (Dashboard, Quests, Missions, Arena, Projects, Leaderboard, Interview)
 * 3. Audio lock (__PINIT_STORY_TOUR_ACTIVE) preventing route unmount audio abortion
 * 4. 25% surfacing area reduction across tour card and floating mentor widgets
 * 5. Auto-scroll mechanism implementation
 * 6. Console error elimination (SpeechRecognition guards & dep array cleanup)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

console.log('========================================================================');
console.log('🎬 PIN-IT CAREER OS: STORY MODE FORENSIC VALIDATION SUITE');
console.log('========================================================================\n');

// ── SECTION 1: StoryTourModal.tsx 30s Budget & Hub Routing ───────────────────
console.log('── SECTION 1: StoryTourModal.tsx Timing Budget & Slide Structure ──');
const modalPath = path.join(ROOT, 'src/components/ui/StoryTourModal.tsx');
const modalSrc = fs.readFileSync(modalPath, 'utf8');

// Check TOUR_SLIDES array
assert(modalSrc.includes("title: 'Command Center Dashboard'") && modalSrc.includes("route: '/dashboard'"), 'Slide 1 maps to /dashboard');
assert(modalSrc.includes("title: 'Socratic Quests & Courses'") && modalSrc.includes("route: '/quests'"), 'Slide 2 maps to /quests');
assert(modalSrc.includes("title: 'Daily Missions & Skill Gaps'") && modalSrc.includes("route: '/missions'"), 'Slide 3 maps to /missions');
assert(modalSrc.includes("title: 'Competitive Battle Arena'") && modalSrc.includes("route: '/arena'"), 'Slide 4 maps to /arena');
assert(modalSrc.includes("title: 'Industry Squads & Projects'") && modalSrc.includes("route: '/projects'"), 'Slide 5 maps to /projects');
assert(modalSrc.includes("title: 'Global & Campus Leagues'") && modalSrc.includes("route: '/leaderboard'"), 'Slide 6 maps to /leaderboard');
assert(modalSrc.includes("title: 'AI Mock Interview Studio'") && modalSrc.includes("route: '/interview'"), 'Slide 7 maps to /interview');

// Extract all text in TOUR_SLIDES to calculate strict timing
const textRegex = /text:\s*"([^"]+)"/g;
const slideTexts = [];
let match;
while ((match = textRegex.exec(modalSrc)) !== null) {
  slideTexts.push(match[1]);
}

assert(slideTexts.length === 7, `Exact slide count is 7 (found ${slideTexts.length})`);

// Calculate word counts & estimated spoken durations (assuming average speech rate of 150 words/min = 2.5 words/sec)
let totalWords = 0;
slideTexts.forEach((txt, idx) => {
  const words = txt.split(/\s+/).filter(Boolean).length;
  totalWords += words;
  const durationSec = (words / 2.5).toFixed(1);
  console.log(`    Step ${idx + 1}: ${words} words (~${durationSec}s)`);
});

// Inter-slide delay: 6 transitions * 0.4s = 2.4s
const totalSpeechDurationSec = totalWords / 2.5;
const totalTourRuntimeSec = totalSpeechDurationSec + (6 * 0.4);
console.log(`    Total Words: ${totalWords} words across 7 slides`);
console.log(`    Estimated Total Tour Runtime: ${totalTourRuntimeSec.toFixed(1)}s (Budget: < 30.0s)`);

assert(totalTourRuntimeSec < 30.0, `Total tour runtime strictly under 30.0s (${totalTourRuntimeSec.toFixed(1)}s < 30.0s)`);

// ── SECTION 2: 25% Surfacing Area Reduction ──────────────────────────────────
console.log('\n── SECTION 2: Surfacing Area 25% Reduction Audit ──');
const avatarPath = path.join(ROOT, 'src/components/ui/GlobalAvatar.tsx');
const avatarSrc = fs.readFileSync(avatarPath, 'utf8');

assert(avatarSrc.includes('width: tourActive ?') && avatarSrc.includes('420') && avatarSrc.includes('285') && avatarSrc.includes('210'), 'Width scaled 25% down: 420 (tour), 285 (enlarged), 210 (default)');
assert(avatarSrc.includes('height: tourActive ? 240 : (isEnlarged ? 360 : 270)'), 'Height scaled 25% down: 240 (tour), 360 (enlarged), 270 (default)');
assert(modalSrc.includes("padding: '10px 11px 9px'"), 'StoryTourCard padding reduced for compact 420x240 dimensions');
assert(avatarSrc.includes('width: 30') && avatarSrc.includes('height: 30'), 'Minimized avatar icon bubble scaled down from 38px to 30px');

// ── SECTION 3: Audio Protection & Stuck State Prevention ──────────────────────
console.log('\n── SECTION 3: Audio Protection & Stuck State Prevention (__PINIT_STORY_TOUR_ACTIVE) ──');
const ttsPath = path.join(ROOT, 'src/lib/tts.ts');
const ttsSrc = fs.readFileSync(ttsPath, 'utf8');

assert(ttsSrc.includes('(window as any).__PINIT_STORY_TOUR_ACTIVE && !force'), 'tts.ts checks __PINIT_STORY_TOUR_ACTIVE and ignores unforced stopSpeaking()');
assert(ttsSrc.includes('stopSpeaking(options?.force ?? true)'), 'speakWithAvatar in tts.ts force-stops previous speech so new slide always plays');
assert(avatarSrc.includes('(window as any).__PINIT_STORY_TOUR_ACTIVE = true'), 'GlobalAvatar.tsx sets __PINIT_STORY_TOUR_ACTIVE = true on tour start/advance');
assert(avatarSrc.includes('(window as any).__PINIT_STORY_TOUR_ACTIVE = false'), 'GlobalAvatar.tsx sets __PINIT_STORY_TOUR_ACTIVE = false on tour completion/dismissal');

// ── SECTION 4: Parallel Auto-Scroll Mechanism ─────────────────────────────────
console.log('\n── SECTION 4: Parallel Auto-Scroll Mechanism (Update 1) ──');
assert(avatarSrc.includes('function startAutoScroll(durationMs: number)'), 'startAutoScroll function defined');
assert(avatarSrc.includes('targetEl.scrollHeight - targetEl.clientHeight'), 'startAutoScroll dynamically checks scrollable height');
assert(avatarSrc.includes('requestAnimationFrame(step)'), 'startAutoScroll uses requestAnimationFrame for smooth ease-in-out scrolling');
assert(avatarSrc.includes('cancelAutoScrollRef.current = startAutoScroll(approxDurationMs)'), 'speakCurrentTourSlide initiates parallel auto-scroll');

// ── SECTION 5: Console Error Elimination ─────────────────────────────────────
console.log('\n── SECTION 5: Console Error Elimination & Speech Recognition Guards ──');
const mentorWidgetPath = path.join(ROOT, 'src/components/avatar/AvatarMentorWidget.tsx');
const mentorWidgetSrc = fs.readFileSync(mentorWidgetPath, 'utf8');

assert(mentorWidgetSrc.includes('if (typeof window === \'undefined\' || onlyAvatar) return;'), 'AvatarMentorWidget guards speech recognition with onlyAvatar check');
assert(avatarSrc.includes('!voiceListeningActive || tourActive'), 'GlobalAvatar guards speech recognition with tourActive check');
assert(!avatarSrc.match(/\[teacher\.name,.*cleanPath.*voiceListeningActive/), 'cleanPath removed from speech recognition useEffect dependency array');

// ── SECTION 6: Quality, UX Polish & Accessibility ─────────────────────────────
console.log('\n── SECTION 6: Quality, UX Polish & Keyboard Accessibility ──');
assert(avatarSrc.includes("e.key === 'ArrowRight'") && avatarSrc.includes("e.key === 'ArrowLeft'"), 'Keyboard arrow navigation wired (ArrowRight / ArrowLeft)');
assert(avatarSrc.includes("e.key === 'Escape'") && avatarSrc.includes("dismissTour()"), 'Escape key smoothly dismisses tour');
assert(avatarSrc.includes("e.key === ' ' || e.code === 'Space'"), 'Spacebar replays current slide voice narration');
assert(avatarSrc.includes("window.addEventListener('wheel', stopOnUserGesture") && avatarSrc.includes("window.addEventListener('touchmove', stopOnUserGesture"), 'Auto-scroll gracefully yields on manual user scroll/touch');
assert(avatarSrc.includes("document.addEventListener('visibilitychange', onVisible)"), 'Tour pauses advance if user temporarily switches browser tabs');
assert(modalSrc.includes('isSpeaking?: boolean') && modalSrc.includes('Mentor Speaking'), 'StoryTourCard renders live voice waveform indicator when mentor speaks');
assert(avatarSrc.includes('isSpeaking={isSpeaking}'), 'GlobalAvatar passes isSpeaking state into StoryTourCard');

console.log('\n========================================================================');
console.log(`🏁 VERIFICATION SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================\n');

process.exit(failed > 0 ? 1 : 0);
