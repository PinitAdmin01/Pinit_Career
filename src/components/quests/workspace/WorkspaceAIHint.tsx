import React from 'react';

interface WorkspaceAIHintProps {
  showAiTutorModal: boolean;
  setShowAiTutorModal: (show: boolean) => void;
  loadingAiTutor: boolean;
  aiTutorHint: string | null;
}

export function WorkspaceAIHint({
  showAiTutorModal,
  setShowAiTutorModal,
  loadingAiTutor,
  aiTutorHint,
}: WorkspaceAIHintProps) {
  if (!showAiTutorModal) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        maxWidth: 500,
        width: '100%',
        background: 'var(--bg2)',
        border: '1px solid var(--accent)',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
            🤖 AI Debug Tutor Assistance
          </span>
          <button
            onClick={() => setShowAiTutorModal(false)}
            style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {loadingAiTutor ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t3)' }}>
            <span>Analyzing code AST and execution stack trace... 🧠</span>
          </div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 }}>
            {aiTutorHint}
          </div>
        )}

        <button
          onClick={() => setShowAiTutorModal(false)}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '10px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--text)',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Return to Workspace ➔
        </button>
      </div>
    </div>
  );
}
