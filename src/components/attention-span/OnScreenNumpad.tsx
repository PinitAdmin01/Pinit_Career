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
      playSound('wrong', soundMuted);
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
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, 72px)',
        gap: 10,
        padding: 16,
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {keys.flat().map((k, idx) => {
        const isBack = k === '⌫';
        const isSub = k === '✓';
        const keyId = isBack ? 'backspace' : isSub ? 'submit' : k;
        const isPressed = activeKey === keyId;

        let bg = 'rgba(255,255,255,0.08)';
        let color = '#fff';
        let border = '1px solid rgba(255,255,255,0.15)';
        let borderBottom = '4px solid rgba(0,0,0,0.5)';

        if (isSub) {
          bg = 'linear-gradient(135deg, #10b981, #059669)';
          border = '1px solid #34d399';
          borderBottom = '4px solid #047857';
        } else if (isBack) {
          bg = 'rgba(239,68,68,0.2)';
          border = '1px solid rgba(239,68,68,0.4)';
          borderBottom = '4px solid rgba(185,28,28,0.5)';
          color = '#f87171';
        }

        return (
          <button
            key={idx}
            onClick={() => handleKeyClick(keyId)}
            style={{
              width: 72,
              height: 58,
              borderRadius: 12,
              background: bg,
              color,
              border,
              borderBottom: isPressed ? '1px solid rgba(0,0,0,0.5)' : borderBottom,
              transform: isPressed ? 'translateY(3px) translateZ(-6px)' : 'translateZ(0px)',
              transformStyle: 'preserve-3d',
              fontSize: isSub || isBack ? 22 : 24,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              transition: 'all 0.1s ease',
              outline: 'none',
            }}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
