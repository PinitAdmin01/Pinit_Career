'use client';

import React, { useState } from 'react';
import type { ClientInternshipTask } from '@/lib/internships/types';
import { runPythonInBrowser } from '@/lib/code/python/pythonRunner';
import { executeTypeScriptTask } from '@/lib/code/runners/webTaskRunner';
import { executeSqlSuite } from '@/lib/code/runners/sqlRunner';
import { TicketEditorTabs } from './TicketEditorTabs';
import { TicketTerminalOutput } from './TicketTerminalOutput';
import type { CodeReview } from '@/lib/internships/codeReview';

interface TicketWorkspaceProps {
  task: ClientInternshipTask;
  onBack: () => void;
  onTaskPassed?: (taskId: string) => void;
}

export const TicketWorkspace: React.FC<TicketWorkspaceProps> = ({
  task,
  onBack,
  onTaskPassed,
}) => {
  const [code, setCode] = useState(task.starterCode);
  const [isRunningLocal, setIsRunningLocal] = useState(false);
  const [localOutput, setLocalOutput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    passed: boolean;
    output: string;
    attempts: number;
    aiReview?: CodeReview | null;
  } | null>(null);

  const handleRunVisible = async () => {
    setIsRunningLocal(true);
    try {
      if (task.language === 'typescript' || task.language === 'tsx') {
        setLocalOutput(`Executing ${task.language.toUpperCase()} code and visible tests in browser sandbox...`);
        const res = await executeTypeScriptTask(code, task.visibleTests, 15000, task.language);
        const logs = (res.terminalLogs || []).join('\n');
        const err = res.error ? `[Error] ${res.error}` : '';
        const out = [logs, err].filter(Boolean).join('\n');
        setLocalOutput(
          out || (res.allPassed ? 'Visible tests completed with no console output (all assertions held).' : 'Visible tests failed.')
        );
      } else if (task.language === 'sql') {
        setLocalOutput('Executing SQL query and visible tests in browser database...');
        const res = await executeSqlSuite(code, { query: code }, 15000, task.visibleTests);
        const logs = (res.terminalLogs || []).join('\n');
        const err = res.error ? `[Error] ${res.error}` : '';
        const out = [logs, err].filter(Boolean).join('\n');
        setLocalOutput(
          out || (res.allPassed ? 'SQL visible checks completed successfully.' : 'SQL visible check failed.')
        );
      } else {
        setLocalOutput('Executing code and visible tests in WebAssembly Python runner...');
        const combined = `${code}\n\n# --- VISIBLE TESTS ---\n${task.visibleTests}`;
        const res = await runPythonInBrowser(combined, 15000);
        const out = [res.stdout, res.error ? `[Error] ${res.error}` : ''].filter(Boolean).join('\n');
        setLocalOutput(out || 'Visible tests completed with no console output (all assertions held).');
      }
    } catch (err) {
      setLocalOutput(err instanceof Error ? `Runtime error: ${err.message}` : 'Execution failed.');
    } finally {
      setIsRunningLocal(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/internship/tasks/${encodeURIComponent(task.id)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setSubmitError(data.message || 'Submission verification failed.');
        return;
      }
      setSubmitResult({
        passed: Boolean(data.passed),
        output: String(data.output || ''),
        attempts: Number(data.attempts || task.attempts + 1),
        aiReview: data.aiReview as CodeReview | null,
      });
      if (data.passed && onTaskPassed) {
        onTaskPassed(task.id);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error submitting ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(5, 7, 15, 0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1.5px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 960,
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 12px',
              color: 'var(--t2)',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Back to Backlog
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#818cf8' }}>
              Ticket #{task.seq}
            </span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>
              {task.title}
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 6,
                background: task.status === 'passed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: task.status === 'passed' ? '#10b981' : '#818cf8',
                border: `1px solid ${task.status === 'passed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              }}
            >
              {task.status === 'passed' ? '✓ Passed' : '● Open Ticket'}
            </span>
          </div>
          <button
            type="button"
            onClick={onBack}
            style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--t3)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Ticket Brief */}
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
            Engineering Brief & Requirements
          </span>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5 }}>
            {task.brief}
          </p>
        </div>

        {/* Code & Visible Tests */}
        <TicketEditorTabs
          code={code}
          setCode={setCode}
          starterCode={task.starterCode}
          visibleTests={task.visibleTests}
          language={task.language}
        />

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <button
            type="button"
            onClick={handleRunVisible}
            disabled={isRunningLocal}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 800,
              cursor: isRunningLocal ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isRunningLocal ? '⏳ Running...' : '▶ Run Visible Tests'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '10px 22px',
              borderRadius: 10,
              background: isSubmitting ? 'var(--bg2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            {isSubmitting ? '⏳ Verifying Solution...' : '⚡ Submit for Server Verification'}
          </button>
        </div>

        {submitError && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: 13 }}>
            {submitError}
          </div>
        )}

        {/* Terminal & AI Review */}
        <TicketTerminalOutput
          localOutput={localOutput}
          submitResult={submitResult}
        />
      </div>
    </div>
  );
};

export default TicketWorkspace;
