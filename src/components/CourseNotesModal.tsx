'use client';

import React, { useState } from 'react';
import { getCourseNotes, CourseNote } from '@/lib/data/courseNotesRegistry';

interface CourseNotesModalProps {
  courseId: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseNotesModal({ courseId, courseTitle, isOpen, onClose }: CourseNotesModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'concepts' | 'cheatsheet' | 'pitfalls' | 'interview'>('summary');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const notes: CourseNote = getCourseNotes(courseId, courseTitle);

  const handleDownloadNotes = () => {
    const mdContent = `# ${notes.courseTitle} — Master Study Notes
Category: ${notes.category}

## 📖 Summary
${notes.summary}

## 🏢 Intuitive Real-World Analogy
${notes.realWorldAnalogy}

## 🧠 Key Concepts & Blueprints
${notes.keyConcepts.map(c => `### ${c.heading}\n${c.explanation}\n${c.codeOrExample ? `\`\`\`\n${c.codeOrExample}\n\`\`\`` : ''}`).join('\n\n')}

## ⚡ Syntax & Formula Cheatsheet
${notes.cheatsheet.map(c => `- ${c}`).join('\n')}

## ⚠️ Common Pitfalls & Gotchas
${notes.commonPitfalls.map(p => `- ${p}`).join('\n')}

## 🎯 Interview & Exam Prep Questions
${notes.interviewPrep.map((q, i) => `### Q${i+1}: ${q.question}\n**Answer**: ${q.answer}`).join('\n\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${courseId}-notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        width: '100%',
        maxWidth: 760,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(99,102,241,0.05)'
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📚 Course Study Notes · {notes.category}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 0 0' }}>
              {notes.courseTitle}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={handleDownloadNotes}
              className="btn-glow"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: 10,
                padding: '7px 14px',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              📥 Download (.md)
            </button>

            <button
              onClick={() => window.print()}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '7px 14px',
                color: 'var(--t1)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              🖨️ Print / PDF
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                width: 34,
                height: 34,
                color: 'var(--t2)',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'summary', label: '📖 Summary & Analogy', icon: '📖' },
            { id: 'concepts', label: '🧠 Key Concepts', icon: '🧠' },
            { id: 'cheatsheet', label: '⚡ Syntax Cheatsheet', icon: '⚡' },
            { id: 'pitfalls', label: '⚠️ Gotchas & Pitfalls', icon: '⚠️' },
            { id: 'interview', label: '🎯 Interview Questions', icon: '🎯' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                color: activeTab === tab.id ? '#fff' : 'var(--t2)',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, textAlign: 'left' }}>
          {activeTab === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px 0' }}>📋 Executive Summary</h4>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>{notes.summary}</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: 16,
                padding: 18
              }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 4 }}>
                  🏢 Intuitive Real-World Metaphor
                </div>
                <p style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                  {notes.realWorldAnalogy}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'concepts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {notes.keyConcepts.map((concept, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)', margin: '0 0 8px 0' }}>{concept.heading}</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: concept.codeOrExample ? 12 : 0 }}>
                    {concept.explanation}
                  </p>
                  {concept.codeOrExample && (
                    <pre style={{
                      background: '#090d16',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 11.5,
                      color: '#34d399',
                      fontFamily: 'var(--font-mono)',
                      overflowX: 'auto',
                      margin: 0
                    }}>
                      {concept.codeOrExample}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cheatsheet' && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)', margin: '0 0 12px 0' }}>⚡ Essential Syntax & Formula Rules</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
                {notes.cheatsheet.map((item, idx) => (
                  <li key={idx} style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'pitfalls' && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 900, color: '#f87171', margin: '0 0 12px 0' }}>⚠️ Common Beginner Mistakes & How to Fix Them</h4>
              <ul style={{ listStyleType: 'circle', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
                {notes.commonPitfalls.map((pitfall, idx) => (
                  <li key={idx} style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5 }}>
                    {pitfall}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'interview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {notes.interviewPrep.map((qa, idx) => (
                <div key={idx} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#38bdf8', marginBottom: 6 }}>
                    ❓ Q{idx + 1}: {qa.question}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, background: 'var(--bg)', padding: 12, borderRadius: 10 }}>
                    💡 <strong>Answer</strong>: {qa.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
