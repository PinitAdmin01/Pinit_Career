import React from 'react';

export const card: React.CSSProperties = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)',
  padding: 20,
  boxShadow: 'var(--shadow-sm)'
};

export const cardLabel: React.CSSProperties = {
  fontSize: 10.5,
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  color: 'var(--t3)',
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  marginBottom: 14,
  display: 'block'
};
