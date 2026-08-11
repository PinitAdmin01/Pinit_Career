'use client';

import { useState } from 'react';
import { triggerHaptic, playSound } from './types';

export function OnScreenNumpad({
  soundMuted,
  onPress,
  onBackspace,
  onSubmit,
}: {
  soundMuted: boolean;
  onPress: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleKeyClick = (val: string) => {
    setActiveKey(val);
    setTimeout(() => setActiveKey(null), 120);

    if (val === 'backspace') {
      playSound('click', soundMuted);
      onBackspace();
    } else if (val === 'submit') {
      playSound('correct', soundMuted);
      onSubmit();
    } else {
      playSound('click', soundMuted);
      triggerHaptic('light');
      onPress(val);
    }
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['⌫', '0', '✓'],
  ];

  return (
    <div className="att-pad">
      {keys.flat().map((k, idx) => {
        const isBack = k === '⌫';
        const isSub = k === '✓';
        const keyId = isBack ? 'backspace' : isSub ? 'submit' : k;

        return (
          <button
            key={idx}
            type="button"
            className={isSub ? 'is-ok' : isBack ? 'is-back' : undefined}
            onClick={() => handleKeyClick(keyId)}
            style={activeKey === keyId ? { transform: 'translateY(3px)', boxShadow: '0 2px 0 var(--att-plinth)' } : undefined}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
