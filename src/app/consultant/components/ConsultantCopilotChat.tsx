'use client';

import React from 'react';

interface CopilotTabProps {
  copilotMessages: Array<{ role: 'user' | 'assistant'; text: string }>;
  setCopilotMessages: React.Dispatch<React.SetStateAction<Array<{ role: 'user' | 'assistant'; text: string }>>>;
  copilotInput: string;
  setCopilotInput: (val: string) => void;
}

export function ConsultantCopilotTab({
  copilotMessages,
  setCopilotMessages,
  copilotInput,
  setCopilotInput,
}: CopilotTabProps) {
  const handleSend = () => {
    if (!copilotInput.trim()) return;
    const text = copilotInput;
    setCopilotMessages(prev => [...prev, { role: 'user', text }]);
    setCopilotInput('');
    setTimeout(() => {
      setCopilotMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `I logged your query about "${text}". Click one of our quick buttons above for active metrics lists.`,
        },
      ]);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 420 }} className="fade-in">
      <div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🤖 AI Consultant Copilot Chat</h3>
        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
          Athena AI assistant helping you audit cohort admissions probability and scholarship matches.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 14,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: 'var(--card)',
          }}
        >
          {copilotMessages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
                background: m.role === 'assistant' ? 'var(--bg3)' : 'var(--accent)',
                color: m.role === 'assistant' ? 'var(--t1)' : 'white',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                maxWidth: '85%',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Quick action prompts */}
        <div
          style={{
            padding: 10,
            background: 'var(--bg3)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 6,
          }}
        >
          {[
            {
              q: 'Who has incomplete documents?',
              a: 'Incomplete-document alerts require live document verification data. No fabricated candidate names are listed.',
            },
            {
              q: 'Who qualifies for scholarships?',
              a: 'Scholarship eligibility requires live CGPA and country preference data from the pipeline. No demo qualifiers are listed as live.',
            },
          ].map((pre, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCopilotMessages(prev => [
                  ...prev,
                  { role: 'user', text: pre.q },
                  { role: 'assistant', text: pre.a },
                ]);
              }}
              style={{
                padding: '6px 10px',
                fontSize: 11,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--t2)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              💬 {pre.q}
            </button>
          ))}
        </div>

        {/* Input tray */}
        <div
          style={{
            padding: 10,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            background: 'var(--card)',
          }}
        >
          <input
            value={copilotInput}
            onChange={e => setCopilotInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask Athena a pipeline question..."
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg3)',
              color: 'var(--t1)',
              fontSize: 12.5,
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

interface CopilotSidebarProps {
  showCopilotSidebar: boolean;
  setShowCopilotSidebar: (show: boolean) => void;
  sidebarMessages: Array<{ role: 'user' | 'assistant'; text: string }>;
  setSidebarMessages: React.Dispatch<React.SetStateAction<Array<{ role: 'user' | 'assistant'; text: string }>>>;
}

export function ConsultantCopilotSidebar({
  showCopilotSidebar,
  setShowCopilotSidebar,
  sidebarMessages,
  setSidebarMessages,
}: CopilotSidebarProps) {
  if (!showCopilotSidebar) return null;

  return (
    <div
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 18,
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'sticky',
        top: 20,
      }}
      className="fade-in"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <strong style={{ fontSize: 13, color: 'var(--t1)' }}>AI Copilot Workspace</strong>
        </div>
        <button
          onClick={() => setShowCopilotSidebar(false)}
          className="btn-ghost"
          style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}
        >
          Hide
        </button>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          height: 260,
          border: '1px solid var(--border)',
          borderRadius: 10,
          background: 'var(--card)',
          padding: 10,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {sidebarMessages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
              background: m.role === 'assistant' ? 'var(--bg2)' : 'var(--accent)',
              color: m.role === 'assistant' ? 'var(--t1)' : 'white',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              maxWidth: '90%',
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              whiteSpace: 'pre-wrap',
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Clickable Consultant Prompts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>
          Quick Actions Console
        </span>
        {[
          {
            label: '🎓 Suggest universities from pipeline',
            user: 'Suggest universities from live pipeline data.',
            reply:
              'University suggestions require live CGPA/GRE/country fields from the pipeline. No fabricated candidate dossiers are returned.',
          },
          {
            label: '✍️ Generate SOP Draft',
            user: 'Generate SOP.',
            reply: 'SOP generation needs a selected live pipeline candidate with verified profile fields.',
          },
          {
            label: '📊 Compare Canada & Germany',
            user: 'Compare Canada and Germany.',
            reply:
              'Germany: Zero tuition fee, Blocked Account required (€11,900/yr), high tech labs.\nCanada: Higher tuition (~CAD 30K/yr), simpler PGWP work permits, fast visa loops.',
          },
          {
            label: '⚠️ What documents are missing?',
            user: 'What documents are missing?',
            reply:
              'Missing-document summaries come from vault verification status. Demo incomplete lists are not shown as live alerts.',
          },
          {
            label: '📅 Schedule next meeting',
            user: 'Schedule next meeting.',
            reply:
              'Use the Meetings tab to schedule against a live pipeline candidate. Fake booked sessions are disabled.',
          },
        ].map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSidebarMessages(prev => [
                ...prev,
                { role: 'user', text: p.user },
                { role: 'assistant', text: p.reply },
              ]);
            }}
            style={{
              padding: '6px 10px',
              fontSize: 11,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--t2)',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            className="btn-ghost"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
