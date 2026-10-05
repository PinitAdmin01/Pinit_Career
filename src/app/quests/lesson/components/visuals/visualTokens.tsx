import React from 'react';
import type { VisualTone } from '@/lib/types/lessonVisual';

export function getToneColor(tone: VisualTone): string {
  switch (tone) {
    case 'data':
      return 'var(--accent)';
    case 'ok':
      return 'var(--success)';
    case 'error':
      return 'var(--coral)';
    case 'idle':
    default:
      return 'var(--border)';
  }
}

export function getToneBg(tone: VisualTone): string {
  switch (tone) {
    case 'data':
      return 'color-mix(in srgb, var(--accent) 15%, transparent)';
    case 'ok':
      return 'color-mix(in srgb, var(--success) 15%, transparent)';
    case 'error':
      return 'color-mix(in srgb, var(--coral) 15%, transparent)';
    case 'idle':
    default:
      return 'transparent';
  }
}

export function getToneTextColor(tone: VisualTone): string {
  switch (tone) {
    case 'data':
      return 'var(--accent)';
    case 'ok':
      return 'var(--success)';
    case 'error':
      return 'var(--coral)';
    case 'idle':
    default:
      return 'var(--text-muted)';
  }
}

export function RenderWithFaintSpaces({ text }: { text: string }): React.ReactElement {
  if (!text) return <React.Fragment />;
  const parts = text.split(/(\u00b7|\s)/);
  return (
    <React.Fragment>
      {parts.map((part, i) => {
        if (part === '\u00b7' || part === ' ') {
          return (
            <span
              key={i}
              style={{
                opacity: 0.45,
                fontWeight: 700,
                display: 'inline-block',
                padding: '0 1px',
                userSelect: 'none',
              }}
              aria-label="space"
            >
              ·
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </React.Fragment>
  );
}
