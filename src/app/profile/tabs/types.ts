import React from 'react';

export interface SocraticQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx?: number;
}

export interface SocraticExamData {
  subject: string;
  questions: SocraticQuestion[];
  examSessionToken?: string;
}

export interface AuditLogItem {
  id: string;
  actor_id: string;
  action: string;
  timestamp: string;
  meta?: {
    questTitle?: string;
    title?: string;
    roomTitle?: string;
  };
}

export type TimelineCategory = 'Course' | 'Project' | 'Internship' | 'Hackathon' | 'Certification' | 'Award' | 'Placement';

export const CS = {
  card:      { background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:20, position: 'relative' } as const,
  cardTitle: { fontSize:13, fontWeight:700, marginBottom:8, fontFamily:'var(--font-display)' } as const,
  cardLabel: { fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: 14, display: 'block' } as const,
};

export const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  backdropFilter: 'blur(4px)'
};

export const modalContentStyle: React.CSSProperties = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: 24,
  width: 500,
  maxWidth: '100%',
  boxShadow: 'var(--shadow-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16
};
