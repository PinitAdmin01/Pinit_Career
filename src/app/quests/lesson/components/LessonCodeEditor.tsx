import React from 'react';
import { parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLessonLanguage } from '@/lib/data/longLessons';

interface LessonCodeEditorProps {
  questId: string;
  slideIdx: number;
  codeExample?: string;
  mockOutput?: string;
  codeRunning?: boolean;
  codeOutput?: string;
  /** Runs the code as currently written in the editor (students can change it). */
  onRunCode: (code: string) => void;
}

export function LessonCodeEditor({
  questId,
  slideIdx,
  codeExample,
  codeRunning,
  codeOutput,
  onRunCode,
}: LessonCodeEditorProps) {
  const [code, setCode] = React.useState(codeExample || '');

  // A new slide brings new code.
  React.useEffect(() => {
    setCode(codeExample || '');
  }, [codeExample, slideIdx]);

  if (!codeExample) return null;

  const id = questId.toLowerCase();
  const prefix = parseQuestId(questId)?.prefix || '';
  const language = getLongLessonLanguage(prefix);
  const fileName = id.includes('react')
    ? 'app.js'
    : language === 'sql' || id.includes('sql')
    ? 'query.sql'
    : language === 'python' || id.includes('python')
    ? 'main.py'
    : prefix.startsWith('java')
    ? 'Solution.java'
    : 'main.js';

  const edited = code !== codeExample;
  const rows = Math.min(Math.max(code.split('\n').length, 3), 18);

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
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {fileName}{edited ? ' • edited' : ''}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {edited && (
            <button
              data-testid="btn-reset-code"
              onClick={() => setCode(codeExample)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: 'var(--text)',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              ↺ Reset
            </button>
          )}
          <button
            data-testid="btn-run-code"
            onClick={() => onRunCode(code)}
            disabled={codeRunning}
            style={{
              background: codeRunning ? 'rgba(255,255,255,0.1)' : 'var(--success)',
              border: 'none',
              color: 'var(--text)',
              fontSize: 10.5,
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
            {codeRunning ? '⏳ Running...' : '▶ Run Code'}
          </button>
        </div>
      </div>
      <textarea
        data-testid="lesson-code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={rows}
        aria-label="Lesson code. You can change it and press Run Code."
        style={{
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
          resize: 'vertical',
          background: '#0e1420',
          padding: '14px 18px',
          borderBottomLeftRadius: codeOutput ? 0 : 12,
          borderBottomRightRadius: codeOutput ? 0 : 12,
          fontSize: 12.5,
          lineHeight: 1.55,
          fontFamily: 'var(--font-mono)',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          margin: 0,
          outline: 'none',
          whiteSpace: 'pre',
          overflowX: 'auto',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}
      />
      {codeOutput && (
        <div style={{
          background: '#05070a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: '#a7f3d0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: 6, fontSize: 10.5 }}>
            <span>
              {fileName.endsWith('.java')
                ? '$ javac Solution.java && java Solution'
                : fileName.endsWith('.py')
                ? '$ python3 main.py'
                : fileName.endsWith('.sql')
                ? '$ psql -f query.sql'
                : `$ node ${fileName}`}
            </span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Output</span>
          </div>
          {/* Keep every space, so tables and lined-up columns stay aligned; scroll sideways if too wide. */}
          <div style={{ whiteSpace: 'pre', overflowX: 'auto' }}>{codeOutput}</div>
        </div>
      )}
    </div>
  );
}
