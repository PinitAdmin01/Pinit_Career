'use client';

import { triggerHaptic, playSound } from './types';

export function OnScreenNumpad({
  soundMuted,
  onPress,
  onBackspace,
  onSubmit,
  disabled,
}: {
  soundMuted: boolean;
  onPress: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const handleNum = (val: string) => {
    if (disabled) return;
    playSound('click', soundMuted);
    triggerHaptic('light');
    onPress(val);
  };

  const handleBack = () => {
    if (disabled) return;
    playSound('click', soundMuted);
    triggerHaptic('light');
    onBackspace();
  };

  const handleSub = () => {
    if (disabled) return;
    playSound('click', soundMuted);
    triggerHaptic('success');
    onSubmit();
  };

  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '⌫', '0', '✓',
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 260, margin: '0 auto' }}>
      {keys.map((k) => {
        const isAction = k === '⌫' || k === '✓';
        const isSubmit = k === '✓';

        return (
          <button
            key={k}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (k === '⌫') handleBack();
              else if (k === '✓') handleSub();
              else handleNum(k);
            }}
            style={{
              height: 56,
              borderRadius: 14,
              border: isSubmit ? 'none' : '1px solid rgba(255,255,255,0.14)',
              background: isSubmit
                ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                : isAction
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.06)',
              color: isSubmit ? '#fff' : isAction ? '#f87171' : '#f0f0f0',
              fontSize: isAction ? 20 : 22,
              fontWeight: 800,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSubmit ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
            }}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
