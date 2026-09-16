# Flying Pins Animation & Pin Currency System — Integration Manifest

## Sandbox Files
| File | Target Destination in Parent |
|------|------------------------------|
| `claude_sandbox/PinCurrencyIcon.tsx` | `src/components/pins/PinCurrencyIcon.tsx` |
| `claude_sandbox/FlyingPinsAnimation.tsx` | `src/components/pins/FlyingPinsAnimation.tsx` |

## PinCurrencyIcon.tsx

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | Pin size in pixels (16 / 22 / 32) |
| `glow` | `boolean` | `false` | Enables radiant golden halo glow |
| `animate` | `boolean` | `false` | Enables breathing pulse animation |
| `alt` | `string` | `'PinIT Pins'` | Accessible label |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `React.CSSProperties` | `{}` | Inline styles |

**Usage:**
```tsx
import PinCurrencyIcon from '@/components/pins/PinCurrencyIcon';
<PinCurrencyIcon size="md" glow animate />
```

**Replace:** Any instance of `<PinCoin .../>` used as the currency pin indicator
(existing `PinCoin.tsx` renders the 3D coin; `PinCurrencyIcon` is the sovereign pin glyph).

## FlyingPinsAnimation.tsx

**Props:** None — listens for the `pinit:pin-stream` CustomEvent globally.

**Triggering the stream** from purchase/claim handlers:
```tsx
// In src/app/pins/page.tsx — on successful purchase
window.dispatchEvent(new CustomEvent('pinit:pin-stream', {
  detail: {
    sourceElement: e.currentTarget,   // the purchase/claim button
    count: 12,                        // 8–20 pins, default 16
    onComplete: () => { /* refresh balance */ },
  }
}));

// Or with explicit coordinates
window.dispatchEvent(new CustomEvent('pinit:pin-stream', {
  detail: { sourceCoords: { x, y }, count: 14 }
}));
```

**Flow:**
1. Spawns 8–15 `PinCurrencyIcon` particles from the clicked button.
2. Each pin follows a curved quadratic-bezier path upward to `#topbar-pins-badge`.
3. On arrival: adds `pins-gold-impact-pulse` CSS class to the header badge (golden shockwave).
4. Spawns landing sparkle effects around the badge.
5. Cleans up all DOM nodes after animation completes.

**Mount point:** `src/components/ui/AppHeader.tsx` — add alongside the existing `<CoinStreamOverlay />`:
```tsx
import FlyingPinsAnimation from '@/components/pins/FlyingPinsAnimation';
// Inside AppHeader return:
<>
  <CoinStreamOverlay />
  <FlyingPinsAnimation />
</>
```

**CSS Required** (add to `src/components/pins/pins.css`):
- `pinCurrencyBreath` — breathing glow pulse for `animate` prop (see comments in PinCurrencyIcon.tsx).
- `pinCurrencyHaloSpin` — halo spin for the glowing ring.
- The existing `goldImpactShockwave` and `goldSparkleFade` are already defined.

## Verification Checklist
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] No orphaned DOM nodes after animations end (React Strict Mode)
- [ ] `<PinCurrencyIcon>` renders crisply at sm/md/lg sizes
- [ ] `pinit:pin-stream` event fires from purchase and claim buttons
- [ ] `#topbar-pins-badge` gets the `pins-gold-impact-pulse` class on arrival
- [ ] Pin balance updates correctly after purchase/claim flow
- [ ] Clean unmount — no dangling `requestAnimationFrame` callbacks
