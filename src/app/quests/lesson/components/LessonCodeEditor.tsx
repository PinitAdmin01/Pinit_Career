import React from 'react';

interface LessonCodeEditorProps {
  questId: string;
  slideIdx: number;
  codeExample?: string;
  mockOutput?: string;
  codeRunning?: boolean;
  codeOutput?: string;
  onRunCode: () => void;
}

export function LessonCodeEditor({
  questId,
  slideIdx,
  codeExample,
  codeRunning,
  codeOutput,
  onRunCode,
}: LessonCodeEditorProps) {
  if (!codeExample) return null;

  const fileName = questId.toLowerCase().includes('react')
    ? 'Component.tsx'
    : questId.toLowerCase().includes('sql')
    ? 'query.sql'
    : questId.toLowerCase().includes('python')
    ? 'main.py'
    : 'Solution.java';

  return (
    <div id="slide-code-execution-block" style={{ marginTop: 8 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#1e293b',
        padding: '6px 12px',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {fileName}
        </span>
        <button
          data-testid="btn-run-code"
          onClick={onRunCode}
          disabled={codeRunning}
          style={{
            background: codeRunning ? 'rgba(255,255,255,0.1)' : 'var(--success)',
            border: 'none',
            color: 'var(--text)',
            fontSize: 9.5,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
            cursor: codeRunning ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'background 0.2s'
          }}
        >
          {codeRunning ? '⏳ Executing...' : '▶ Run Code'}
        </button>
      </div>
      <pre style={{
        background: '#0e1420',
        padding: '14px 18px',
        borderBottomLeftRadius: codeOutput ? 0 : 12,
        borderBottomRightRadius: codeOutput ? 0 : 12,
        fontSize: 10.5,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        overflowX: 'auto',
        border: '1px solid rgba(255,255,255,0.06)',
        borderTop: 'none',
        margin: 0,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
      }}>
        <code>{codeExample}</code>
      </pre>
      {codeOutput && (
        <div style={{
          background: '#05070a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#a7f3d0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: 6, fontSize: 9.5 }}>
            <span>
              {fileName.endsWith('.java')
                ? '$ javac Solution.java && java Solution'
                : fileName.endsWith('.py')
                ? '$ python3 main.py'
                : fileName.endsWith('.sql')
                ? '$ sqlite3 < query.sql'
                : `$ node ${fileName}`}
            </span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Sandbox Isolated</span>
          </div>
          <div style={{ whiteSpace: 'pre-line' }}>{codeOutput}</div>
        </div>
      )}
    </div>
  );
}
