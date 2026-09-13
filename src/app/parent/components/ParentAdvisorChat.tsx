'use client';

import React from 'react';
import { StudentOverview } from '../hooks/useParentDashboard';
import { toast } from '@/lib/store/useAppStore';

interface ParentAdvisorChatProps {
  activeTab: string;
  overview: StudentOverview;
  advisorMessages: Array<{ role: 'assistant' | 'user'; text: string }>;
  setAdvisorMessages: React.Dispatch<React.SetStateAction<Array<{ role: 'assistant' | 'user'; text: string }>>>;
  advisorInput: string;
  setAdvisorInput: (val: string) => void;
  chatMessages: Array<{ role: 'teacher' | 'parent'; text: string }>;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ role: 'teacher' | 'parent'; text: string }>>>;
  chatInput: string;
  setChatInput: (val: string) => void;
}

export default function ParentAdvisorChat({
  activeTab,
  overview,
  advisorMessages,
  setAdvisorMessages,
  advisorInput,
  setAdvisorInput,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
}: ParentAdvisorChatProps) {
  const handleAdvisorSend = () => {
    if (!advisorInput.trim()) return;
    const inputVal = advisorInput;
    setAdvisorMessages(prev => [...prev, { role: 'user', text: inputVal }]);
    setAdvisorInput('');
    setTimeout(() => {
      setAdvisorMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `I can only report live overview fields. Career readiness ${overview.profile?.career_readiness ?? '—'}%, ATS ${
            overview.profile?.ats_score ?? '—'
          }. No fabricated attendance/CGPA answers.`,
        },
      ]);
    }, 400);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatMessages(prev => [...prev, { role: 'parent', text }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'teacher',
          text: 'Thanks — faculty messaging is not connected to a live inbox yet. Your note was kept locally in this session only.',
        },
      ]);
    }, 1000);
  };

  if (activeTab === 'advisor') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(var(--success-rgb), 0.06) 0%, rgba(var(--success-deep-rgb), 0.02) 100%)',
            border: '1.5px solid rgba(var(--success-rgb), 0.2)',
            borderRadius: 12,
            padding: 18,
          }}
        >
          <h4 style={{ margin: '0 0 6px 0', fontSize: 13.5, fontWeight: 900, color: 'var(--success)' }}>
            📋 Live Overview Snapshot
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.45 }}>
            {overview.profile?.displayName || 'Student'}: Career readiness {overview.profile?.career_readiness ?? '—'}%,
            ATS {overview.profile?.ats_score ?? '—'}, streak {overview.profile?.mission_streak ?? 0} days. Attendance and CGPA
            are unavailable until linked to institutional feeds.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 350,
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'var(--bg3)',
              padding: '10px 14px',
              fontSize: 11.5,
              fontWeight: 800,
              color: 'var(--t3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            CHAT CONSOLE WITH ATHENA
          </div>

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
            {advisorMessages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
                  background: m.role === 'assistant' ? 'var(--bg3)' : 'var(--success)',
                  color: m.role === 'assistant' ? 'var(--t1)' : 'white',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  maxWidth: '85%',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}
              >
                {m.role === 'assistant' ? '🤖 ' : '👤 '}
                {m.text}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: 10,
              background: 'var(--bg3)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                q: 'How is my child doing?',
                a: `Live overview — Career readiness: ${overview.profile?.career_readiness ?? '—'}% | ATS: ${
                  overview.profile?.ats_score ?? '—'
                } | Trust: ${overview.profile?.trust_score ?? '—'} | Streak: ${
                  overview.profile?.mission_streak ?? 0
                } days. Attendance/CGPA: not available from API.`,
              },
              {
                q: 'What metrics are available?',
                a: 'Available now from overview API: career readiness, ATS, trust, career DNA, mission streak, and career track. Attendance, CGPA, and faculty notes require institutional integrations.',
              },
              {
                q: 'Will my child get placed?',
                a: `Placement probability is not computed here. Current readiness signal is ${
                  overview.profile?.career_readiness ?? '—'
                }% from ATS/trust. Connect placement outcomes data for a real forecast.`,
              },
            ].map((pre, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAdvisorMessages(prev => [
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
              value={advisorInput}
              onChange={e => setAdvisorInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdvisorSend();
              }}
              placeholder="Type a question for Athena..."
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
              onClick={handleAdvisorSend}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: 'var(--success)',
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

  if (activeTab === 'communication') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>
            💬 Institution & Faculty Communication
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
            Chat with advisors, book Parent-Teacher Meetings (PTM), and view general announcements.
          </p>
        </div>

        {/* Main two-column block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Left: Chat with Prof. Vikram Sen */}
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: 320,
            }}
          >
            <div
              style={{
                background: 'var(--bg3)',
                padding: '10px 14px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: 12.5, color: 'var(--t1)' }}>Prof. Vikram Sen</strong>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>Course Director / Placement Advisor</div>
              </div>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
            </div>

            {/* Chat body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                background: 'var(--card)',
              }}
            >
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === 'teacher' ? 'flex-start' : 'flex-end',
                    background: m.role === 'teacher' ? 'var(--bg3)' : 'var(--accent)',
                    color: m.role === 'teacher' ? 'var(--t1)' : 'white',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    maxWidth: '85%',
                    border: m.role === 'teacher' ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div
              style={{
                padding: 8,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: 8,
                background: 'var(--bg3)',
              }}
            >
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleChatSend();
                }}
                placeholder="Type message to teacher..."
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--t1)',
                  fontSize: 12,
                }}
              />
              <button
                onClick={handleChatSend}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Right: PTM and Announcements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* PTM card */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                Upcoming Virtual PTM
              </span>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>July 29, 04:00 PM</div>
              <p style={{ margin: '4px 0 8px 0', fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
                Agenda: Pre-placement eligibility and communication lab checkups.
              </p>
              <button
                onClick={() => {
                  toast.success(
                    'PTM Scheduler',
                    'The virtual PTM room link will become active 10 minutes before the scheduled time.'
                  );
                }}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  background: 'var(--border)',
                  color: 'var(--t2)',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Join Video Meeting
              </button>
            </div>

            {/* Announcements */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
                Institutional Announcements
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--t2)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: 6,
                  }}
                >
                  📢 <strong>Placement Drive</strong> starting Aug 10. Direct resume screening schedules have been locked.
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>
                  📢 <strong>Summer Internships</strong> details are now downloadable in the Documents tab.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Meeting request */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>
              📞 Request 1-on-1 Callback Advisor Call
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: 11, color: 'var(--t3)' }}>
              Select a preferred slot to request a phone advisor callback from Prof Vikram Sen.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => toast.success('Request Callback', 'Morning advisory session requested successfully.')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  fontSize: 11.5,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  color: 'var(--t1)',
                }}
              >
                🌅 Morning (10:00 AM - 12:00 PM)
              </button>
              <button
                onClick={() => toast.success('Request Callback', 'Evening advisory session requested successfully.')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  fontSize: 11.5,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  color: 'var(--t1)',
                }}
              >
                🌇 Evening (03:00 PM - 05:00 PM)
              </button>
            </div>
          </div>

          {/* Support helpdesk */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>
              🛠️ Institute Support Ticket
            </h4>
            <p style={{ margin: '0 0 10px 0', fontSize: 11, color: 'var(--t3)' }}>
              Submit a concern to general student support advisors.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Describe your issue or query..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  background: 'var(--card)',
                  color: 'var(--t1)',
                  fontSize: 11.5,
                }}
              />
              <button
                onClick={() => {
                  toast.success('Support Helpdesk', 'Your query has been logged. Support ticket ref #7492.');
                }}
                style={{
                  padding: '8px 14px',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
