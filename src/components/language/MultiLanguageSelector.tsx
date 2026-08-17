'use client';

import React from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES, StudentLanguageProgress } from '@/lib/language/languageTypes';

interface MultiLanguageSelectorProps {
  activeLanguage: LanguageCode;
  allProgress: Record<LanguageCode, StudentLanguageProgress>;
  onSelectLanguage: (code: LanguageCode) => void;
}

export const MultiLanguageSelector: React.FC<MultiLanguageSelectorProps> = ({
  activeLanguage,
  allProgress,
  onSelectLanguage
}) => {
  const languageCodes = Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: 10,
      marginBottom: 20
    }}>
      {languageCodes.map(code => {
        const meta = SUPPORTED_LANGUAGES[code];
        const prog = allProgress[code] || { currentLevel: 'PRE_A1', totalXpEarned: 0 };
        const isActive = activeLanguage === code;

        return (
          <button
            key={code}
            onClick={() => onSelectLanguage(code)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              padding: '10px 14px',
              borderRadius: 12,
              background: isActive
                ? 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.15))'
                : 'rgba(255,255,255,0.03)',
              border: isActive
                ? '2px solid var(--accent)'
                : '1px solid rgba(255,255,255,0.08)',
              color: 'var(--t1)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 14px rgba(99,102,241,0.25)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 20 }}>{meta.flag}</span>
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 8,
                background: 'rgba(99,102,241,0.18)',
                color: 'var(--accent)'
              }}>
                {prog.currentLevel}
              </span>
            </div>

            <div style={{ marginTop: 6, fontWeight: 800, fontSize: 13 }}>
              {meta.name}
            </div>

            <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
              {meta.nativeName} • {prog.totalXpEarned} XP
            </div>
          </button>
        );
      })}
    </div>
  );
};
