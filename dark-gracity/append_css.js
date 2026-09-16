const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/components/pins/pins.css');
const cssToAppend = `

/* ── Official PinIT Currency Pin SVG Animations ── */
.pin-currency-breathe {
  animation: pinCurrencyBreath 2.6s ease-in-out infinite;
}

@keyframes pinCurrencyBreath {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.55)); }
  50%      { transform: scale(1.14); filter: drop-shadow(0 0 9px rgba(245, 158, 11, 0.95)) brightness(1.12); }
}

.pin-currency-halo {
  animation: pinCurrencyHaloSpin 8s linear infinite;
  transform-origin: center;
}

@keyframes pinCurrencyHaloSpin {
  to { transform: rotate(360deg); }
}
`;

fs.appendFileSync(targetPath, cssToAppend, 'utf8');
console.log('Successfully appended pin currency CSS animations to pins.css');
