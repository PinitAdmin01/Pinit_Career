# Arena Polish & Combat Enhancements — Integration Manifest

## Sandbox Files
| File | Target Destination in Parent |
|------|-------------------------------|
| `claude_sandbox/ArenaMatchmakingRadar.tsx` | `src/components/pins/ArenaMatchmakingRadar.tsx` |
| `claude_sandbox/ArenaCodeDiffViewer.tsx` | `src/components/pins/ArenaCodeDiffViewer.tsx` |

---

## ArenaMatchmakingRadar.tsx

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isQueueing` | `boolean` | Yes | Whether the student is currently in the matchmaking queue |
| `queueSeconds` | `number` | Yes | Seconds spent in queue (for countdown timer) |
| `onSwitchToAiSparring` | `() => void` | Yes | Called when user clicks "Spar with Turing AI" button |
| `studentPins` | `number` | No | Current pin balance for optional display |

### Features
- Pulsing concentric radar rings (SVG)
- Sweeping radar beam with rotating animation
- 12 animated scanning dots representing online engineers
- 15-second search countdown timer
- AI Sparring CTA button after timeout (12s mark in page)

### Integration (Arena page.tsx)
Replace inline queue state with radar:
```tsx
import ArenaMatchmakingRadar from '@/components/pins/ArenaMatchmakingRadar';

// Inside Quick Match card, replace existing queue UI:
<ArenaMatchmakingRadar
  isQueueing={isQueueing}
  queueSeconds={queueSeconds}
  onSwitchToAiSparring={handleStartSoloSparring}
  studentPins={pins}
/>
```

### CSS Keyframes (merge into pins.css)
```css
@keyframes ringPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}
@keyframes beamSweep {
  to { transform: rotate(360deg); }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}
```

---

## ArenaCodeDiffViewer.tsx

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Whether modal is visible |
| `onClose` | `() => void` | Yes | Called when user closes modal |
| `myCode` | `string` | Yes | Student's submitted code |
| `opponentCode` | `string` | Yes | Opponent's submitted code |
| `myScore` | `{ passed, testsPassed, totalTests, score, executionTimeMs? }` | Yes | Student's test results |
| `opponentScore` | Same shape | Yes | Opponent's test results |
| `problemId` | `string` | Yes | CodeWars problem ID (e.g. 'war_tree_lca_01') |

### Features
- Side-by-side code panes (Your Code / Opponent's Code)
- Score summary row showing test progress vs opponent
- Tab switcher between panes
- Diff legend (✓ Same / ✗ Different implementation)
- Clean monospace rendering with scroll support

### Integration (Arena page.tsx)
```tsx
import ArenaCodeDiffViewer from '@/components/pins/ArenaCodeDiffViewer';

// Inside ArenaContent, after battle ends:
<ArenaCodeDiffViewer
  isOpen={showCodeInspect}
  onClose={() => setShowCodeInspect(false)}
  myCode={studentCode}
  opponentCode={opponentCodeFromRoom}
  myScore={myMatchScore}
  opponentScore={opponentMatchScore}
  problemId={activeProblem?.id || 'war_tree_lca_01'}
/>
```

### Trigger point (existing in page.tsx)
Add to the victory/defeat modal — add a "Compare Code" button alongside existing controls:
```tsx
<button
  onClick={() => {
    setStudentCode(code);
    setOpponentCode(opponentCodeFromRoom);
    setShowCodeInspect(true);
  }}
>
  📊 Compare Code Solutions
</button>
```

---

## Verification Checklist
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] Radar renders pulsing rings, beam, and 12 scanning dots
- [ ] AI Sparring button appears at 12s queue time
- [ ] Code diff modal opens and shows both solutions side-by-side
- [ ] Tab switching works between Your Code / Opponent's Code
- [ ] Score summary displays correctly with test counts
- [ ] Modal closes cleanly on ✕ button or backdrop click
- [ ] No orphaned animation frames after unmount
