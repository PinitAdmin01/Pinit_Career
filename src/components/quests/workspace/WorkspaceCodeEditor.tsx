import React from 'react';

interface WorkspaceCodeEditorProps {
  questId: string;
  code: string;
  setCode: (code: string) => void;
  editorLocked: boolean;
  isExam: boolean;
  examTimedOut: boolean;
  isCompleted: boolean;
  unlockRemainingSec: number;
  onExtendGrace?: () => void;
  userId: string;
  saveQuestCode?: (questId: string, code: string) => void;
  langInfo: { file: string; label: string; native: boolean };
}

export function WorkspaceCodeEditor({
  questId,
  code,
  setCode,
  editorLocked,
  isExam,
  examTimedOut,
  isCompleted,
  unlockRemainingSec,
  onExtendGrace,
  userId,
  saveQuestCode,
  langInfo,
}: WorkspaceCodeEditorProps) {
  const lineCount = (code || '').split('\n').length || 1;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextValue = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
      }, 0);
    }

    const pairs: Record<string, string> = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'"
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
      const extraIndent = currentLine.trim().endsWith('{') ? '    ' : '';
      const nextValue = value.substring(0, selectionStart) + '\n' + indent + extraIndent + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  return (
    <div>
      {unlockRemainingSec > 0 && unlockRemainingSec <= 300 && (
        <div style={{
          background: 'rgba(234, 179, 8, 0.12)',
          border: '1px solid #eab308',
          borderRadius: 10,
          padding: '8px 14px',
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#eab308'
        }}>
          <span>⏳ Quest unlock expiring in {Math.floor(unlockRemainingSec / 60)}m {unlockRemainingSec % 60}s. Your code is safely auto-saved.</span>
          {onExtendGrace && (
            <button
              onClick={onExtendGrace}
              style={{
                background: '#eab308',
                color: '#0f172a',
                border: 'none',
                borderRadius: 6,
                padding: '4px 10px',
                fontWeight: 800,
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              +15 Min Grace ⚡
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg3)', border: '1.5px solid var(--border)', borderBottom: 'none', padding: '8px 14px', borderRadius: '12px 12px 0 0' }}>
        <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{langInfo.file} ({isExam ? 'Proctored Environment' : langInfo.label})</span>
        <span style={{ fontSize: 11, color: editorLocked ? (examTimedOut && !isCompleted ? 'var(--coral)' : 'var(--green)') : (isExam ? 'var(--coral)' : 'var(--accent)'), fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {isCompleted ? 'COMPLETED (READ-ONLY)' : (examTimedOut && isExam ? 'TIME EXPIRED (LOCKED)' : (isExam ? 'EXAM ENVIRONMENT' : langInfo.label.toUpperCase()))}
        </span>
      </div>

      <div style={{
        display: 'flex',
        background: '#0d0e12',
        border: '1.5px solid var(--border)',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden',
        minHeight: 320
      }}>
        {/* Gutter */}
        <div style={{
          background: '#090a0f',
          borderRight: '1px solid var(--border)',
          padding: '16px 8px',
          color: 'var(--t3)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          textAlign: 'right',
          userSelect: 'none',
          minWidth: 40,
          lineHeight: 1.6
        }}>
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => {
            if (editorLocked) return;
            const nextCode = e.target.value;
            setCode(nextCode);
            if (typeof window !== 'undefined' && questId) {
              try {
                localStorage.setItem(`pinit_code_${userId}_${questId}`, nextCode);
                if (typeof saveQuestCode === 'function') {
                  saveQuestCode(questId, nextCode);
                }
              } catch (err) {
                console.warn('[QuestWorkspace] Failed to persist code draft buffer:', err);
              }
            }
          }}
          onKeyDown={(e) => {
            if (editorLocked) return;
            handleKeyDown(e);
          }}
          readOnly={editorLocked}
          style={{
            width: '100%',
            height: 320,
            background: 'transparent',
            color: editorLocked ? 'var(--t3)' : '#f8fafc',
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            padding: '16px 12px',
            border: 'none',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.6
          }}
        />
      </div>
    </div>
  );
}
