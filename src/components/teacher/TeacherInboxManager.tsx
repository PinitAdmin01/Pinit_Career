'use client';

import React, { useState, useEffect } from 'react';
import { inboxSyncService, StudentConversation, StudentMessage } from '@/lib/chat/inboxSyncService';

export default function TeacherInboxManager() {
  const [conversations, setConversations] = useState<StudentConversation[]>(() => inboxSyncService.getConversations());
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_101');
  const [replyInput, setReplyInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Initial sync
    setConversations(inboxSyncService.getConversations());
    // Subscribe to live cross-tab/runtime updates
    const unsubscribe = inboxSyncService.subscribe((updated) => {
      setConversations(updated);
    });
    return () => unsubscribe();
  }, []);

  const activeConvo = conversations.find(c => c.studentId === selectedStudentId) || conversations[0];

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyInput.trim() || !activeConvo) return;

    inboxSyncService.sendTeacherReply(activeConvo.studentId, replyInput.trim());
    setReplyInput('');
  };

  const filteredConvos = conversations.filter(c =>
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, height: 600, background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Left Conversations Sidebar */}
      <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg3)' }}>
        <div style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>Student Messages & Guidance</h3>
          <input
            type='text'
            placeholder='Search students or courses...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--t1)', fontSize: 11 }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredConvos.map(c => {
            const isSelected = c.studentId === selectedStudentId;
            return (
              <div
                key={c.studentId}
                onClick={() => {
                  setSelectedStudentId(c.studentId);
                  setConversations(prev => prev.map(conv => conv.studentId === c.studentId ? { ...conv, unreadCount: 0 } : conv));
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: isSelected ? 'var(--accent-light)' : 'var(--bg2)',
                  border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: 12, color: 'var(--t1)' }}>{c.studentName}</span>
                  {c.unreadCount > 0 && (
                    <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 900, padding: '1px 6px', borderRadius: 10 }}>
                      {c.unreadCount} NEW
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700 }}>{c.course}</span>
                <p style={{ margin: 0, fontSize: 10.5, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.lastMessage}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Thread Area */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg2)' }}>
        {/* Thread Header */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{activeConvo?.studentName}</h4>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>{activeConvo?.studentEmail} • {activeConvo?.course}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, background: 'var(--green-light)', color: 'var(--green)' }}>
            ● Active Student
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeConvo?.messages.map(m => {
            const isTeacher = m.sender === 'teacher';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isTeacher ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: isTeacher ? 'var(--accent)' : 'var(--bg3)',
                  color: isTeacher ? '#ffffff' : 'var(--t1)',
                  padding: '10px 14px',
                  borderRadius: 14,
                  borderBottomRightRadius: isTeacher ? 2 : 14,
                  borderBottomLeftRadius: isTeacher ? 14 : 2,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: 9.5, fontWeight: 800, marginBottom: 2, opacity: 0.85 }}>
                  {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.45 }}>{m.text}</div>
              </div>
            );
          })}
        </div>

        {/* Reply Input Bar */}
        <form onSubmit={handleSendReply} style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input
            type='text'
            placeholder='Type mentorship guidance or review feedback...'
            value={replyInput}
            onChange={e => setReplyInput(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 12 }}
          />
          <button
            type='submit'
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
          >
            Send ➔
          </button>
        </form>
      </div>
    </div>
  );
}
