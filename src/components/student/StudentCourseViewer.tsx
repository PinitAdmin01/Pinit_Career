'use client';

import React, { useState } from 'react';

interface CourseItem {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  type: 'pdf' | 'pptx' | 'docx' | 'link';
  size: string;
  uploadedAt: string;
}

export default function StudentCourseViewer() {
  const [courses] = useState<CourseItem[]>([
    { id: '1', title: 'Data Structures & Algorithms - Module 1 Notes', subject: 'Data Structures', instructor: 'Prof. Priya', type: 'pdf', size: '2.4 MB', uploadedAt: '2026-08-01' },
    { id: '2', title: 'Neural Networks & Deep Learning Slides', subject: 'Artificial Intelligence', instructor: 'Dr. Meera Sen', type: 'pptx', size: '5.1 MB', uploadedAt: '2026-07-28' },
    { id: '3', title: 'Database Systems & SQL Lab Manual', subject: 'DBMS', instructor: 'Mr. Rohan', type: 'docx', size: '1.8 MB', uploadedAt: '2026-07-20' }
  ]);

  const [search, setSearch] = useState('');

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>📖 Course Notes & Materials</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>Access published lecture slides, lab manuals, and revision summaries from your faculty.</p>
      </div>

      <input
        type="text"
        placeholder="Search notes by title, subject, or professor..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: 400, padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            padding: 20,
            borderRadius: 12,
            border: '1px solid var(--border, var(--border))',
            background: 'var(--bg1, #fff)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>
                  {item.type === 'pdf' ? '📕' : item.type === 'pptx' ? '📊' : item.type === 'docx' ? '📝' : '🔗'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: 4 }}>
                  {item.subject}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{item.title}</h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--t3, #64748b)' }}>
                Faculty: <strong>{item.instructor}</strong> • {item.uploadedAt}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.size}</span>
              <button
                onClick={() => alert(`Downloading ${item.title}`)}
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--primary, #3b82f6)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                📥 Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
