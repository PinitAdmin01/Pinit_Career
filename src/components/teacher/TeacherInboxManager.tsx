'use client';

import React, { useState, useEffect } from 'react';
import { inboxSyncService, StudentConversation, StudentMessage } from '@/lib/chat/inboxSyncService';

interface TeacherInboxManagerProps {
  teacherId?: string;
  teacherName?: string;
}

export default function TeacherInboxManager({
  teacherId = 'priya',
  teacherName = 'Faculty Mentor'
}: TeacherInboxManagerProps) {
  const [conversations, setConversations] = useState<StudentConversation[]>(() => inboxSyncService.getConversations());
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [replyInput, setReplyInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Initial sync from local storage
    const initial = inboxSyncService.getConversations();
    setConversations(initial);
    if (initial.length > 0) {
      setSelectedStudentId(prev => prev || initial[0].studentId);
    }

    // 2. Load from database so student messages sent from another computer arrive
    setLoading(true);
    inboxSyncService.syncFromDatabase(teacherId).then((synced) => {
      setConversations(synced);
      if (synced.length > 0) {
        setSelectedStudentId(prev => (prev && synced.some(c => c.studentId === prev) ? prev : synced[0].studentId));
      }
    }).finally(() => {
      setLoading(false);
    });

    // 3. Subscribe to real-time cross-tab and database updates
    const unsubscribe = inboxSyncService.subscribe((updated) => {
      setConversations(updated);
      if (updated.length > 0) {
        setSelectedStudentId(prev => (prev && updated.some(c => c.studentId === prev) ? prev : updated[0].studentId));
      }
    });

    return () => unsubscribe();
  }, [teacherId]);

  const activeConvo = conversations.find(c => c.studentId === selectedStudentId) || conversations[0];

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyInput.trim() || !activeConvo) return;

    inboxSyncService.sendTeacherReply(activeConvo.studentId, replyInput.trim(), teacherName, teacherId);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 900, color: 'var(--t1)' }}>Student Messages & Guidance</h3>
            {loading && <span style={{ fontSize: 11, color: 'var(--accent)' }}>Syncing...</span>}
          </div>
          <input
            type='text'
            placeholder='Search students or courses...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--t1)', fontSize: 12 }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredConvos.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              No messages found. Incoming student inquiries will appear here.
            </div>
          ) : (
            filteredConvos.map(c => {
              const isSelected = c.studentId === selectedStudentId;
              return (
                <div
                  key={c.studentId}
                  onClick={() => {
                    setSelectedStudentId(c.studentId);
                    inboxSyncService.markThreadAsRead(c.studentId, teacherId);
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
                    <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--t1)' }}>{c.studentName}</span>
                    {c.unreadCount > 0 && (
                      <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '1px 6px', borderRadius: 10 }}>
                        {c.unreadCount} NEW
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{c.course}</span>
                  <p style={{ margin: 0, fontSize: 11.5, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.lastMessage}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Chat Thread Area */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg2)' }}>
        {activeConvo ? (
          <>
            {/* Thread Header */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 15.5, fontWeight: 900, color: 'var(--t1)' }}>{activeConvo.studentName}</h4>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>{activeConvo.studentEmail} • {activeConvo.course}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 6, background: 'var(--green-light)', color: 'var(--green)' }}>
                ● Active Thread
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeConvo.messages.map(m => {
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
                    <div style={{ fontSize: 10.5, fontWeight: 800, marginBottom: 2, opacity: 0.85 }}>
                      {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.45 }}>{m.text}</div>
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
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
              />
              <button
                type='submit'
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
              >
                Send ➔
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 35, marginBottom: 8, opacity: 0.5 }}>💬</div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--t1)' }}>No active conversation selected</div>
            <p style={{ fontSize: 13, maxWidth: 320, margin: '8px 0 0' }}>
              Select a student thread from the left to read messages and respond with academic guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
