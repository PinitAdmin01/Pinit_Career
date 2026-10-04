'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 340,
          background: '#090d16',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        Loading Monaco Code Engine...
      </div>
    ),
  }
);

export interface TicketEditorTabsProps {
  code: string;
  setCode: (code: string) => void;
  starterCode: string;
  visibleTests: string;
  language?: string;
}

export function getTicketLanguageInfo(language?: string) {
  if (language === 'tsx') {
    return {
      codeFileName: 'Component.tsx',
      testFileName: 'test_visible.tsx',
      label: 'React TSX',
      badgeIcon: '⚛️',
      monacoLang: 'typescript',
      indentSize: 2,
    };
  }
  if (language === 'typescript') {
    return {
      codeFileName: 'solution.ts',
      testFileName: 'test_visible.ts',
      label: 'TypeScript',
      badgeIcon: '📘',
      monacoLang: 'typescript',
      indentSize: 2,
    };
  }
  if (language === 'sql') {
    return {
      codeFileName: 'query.sql',
      testFileName: 'test_visible.sql',
      label: 'PostgreSQL',
      badgeIcon: '🐘',
      monacoLang: 'sql',
      indentSize: 2,
    };
  }
  return {
    codeFileName: 'main.py',
    testFileName: 'test_visible.py',
    label: 'Python',
    badgeIcon: '🐍',
    monacoLang: 'python',
    indentSize: 4,
  };
}

export const TicketEditorTabs: React.FC<TicketEditorTabsProps> = ({
  code,
  setCode,
  starterCode,
  visibleTests,
  language = 'python',
}) => {
  const [activeTab, setActiveTab] = React.useState<'code' | 'tests'>('code');
  const [useMonaco, setUseMonaco] = React.useState(true);

  const info = getTicketLanguageInfo(language);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    const indentStr = ' '.repeat(info.indentSize);

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextValue = value.substring(0, selectionStart) + indentStr + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + info.indentSize;
      }, 0);
    }

    const pairs: Record<string, string> = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'",
      '`': '`',
    };
    if (pairs[e.key] !== undefined) {
      e.preventDefault();
      const closing = pairs[e.key];
      const nextValue = value.substring(0, selectionStart) + e.key + closing + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const linesStr = value.substring(0, selectionStart).split('\n');
      const currentLine = linesStr[linesStr.length - 1];
      const indentMatch = currentLine.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : '';
      const extraIndent = currentLine.trim().endsWith('{') || currentLine.trim().endsWith(':') ? indentStr : '';
      const nextValue = value.substring(0, selectionStart) + '\n' + indent + extraIndent + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Tab Selector & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'code' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'code' ? '#818cf8' : 'var(--t3)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📄</span>
            <span>{info.codeFileName} (Solution)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'tests' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'tests' ? '#818cf8' : 'var(--t3)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🧪</span>
            <span>{info.testFileName} (Tests)</span>
          </button>

          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{info.badgeIcon}</span>
            <span>{info.label}</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setUseMonaco(!useMonaco)}
            title="Toggle between Monaco Editor and Simple Textarea"
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 11.5,
              color: 'var(--t2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{useMonaco ? '⚡ Monaco' : '📝 Simple'}</span>
          </button>

          {activeTab === 'code' && (
            <button
              type="button"
              onClick={() => setCode(starterCode)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 11.5,
                color: 'var(--t3)',
                cursor: 'pointer',
              }}
            >
              ↺ Reset Starter Code
            </button>
          )}
        </div>
      </div>

      {/* Code / Test Area */}
      {activeTab === 'code' ? (
        useMonaco ? (
          <div
            style={{
              height: 340,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#090d16',
            }}
          >
            <MonacoEditor
              height="100%"
              language={info.monacoLang}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13.5,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: info.indentSize,
                automaticLayout: true,
                fontFamily: 'var(--font-mono)',
                wordWrap: 'on',
              }}
            />
          </div>
        ) : (
          <textarea
            data-testid="ticket-code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={14}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              background: '#0e1420',
              padding: '14px 18px',
              borderRadius: 12,
              fontSize: 13,
              lineHeight: 1.55,
              fontFamily: 'var(--font-mono)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              outline: 'none',
              whiteSpace: 'pre',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          />
        )
      ) : useMonaco ? (
        <div
          style={{
            height: 340,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: '#090d16',
          }}
        >
          <MonacoEditor
            height="100%"
            language={info.monacoLang}
            theme="vs-dark"
            value={visibleTests}
            options={{
              readOnly: true,
              fontSize: 13.5,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: info.indentSize,
              automaticLayout: true,
              fontFamily: 'var(--font-mono)',
              wordWrap: 'on',
            }}
          />
        </div>
      ) : (
        <div
          data-testid="ticket-visible-tests"
          style={{
            background: '#0e1420',
            padding: '14px 18px',
            borderRadius: 12,
            fontSize: 12.5,
            lineHeight: 1.55,
            fontFamily: 'var(--font-mono)',
            color: '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            whiteSpace: 'pre',
            maxHeight: 340,
            overflowY: 'auto',
          }}
        >
          {visibleTests}
        </div>
      )}
    </div>
  );
};
