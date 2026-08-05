'use client';
import React from 'react';

interface ComingSoonGateProps {
  featureName: string;
  expectedSprint?: string;
  description?: string;
}

export default function ComingSoonGate({ featureName, expectedSprint = 'Phase 2', description }: ComingSoonGateProps) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 24,
      padding: '40px 24px',
      textAlign: 'center',
      maxWidth: 500,
      margin: '40px auto',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: 140,
        height: 140,
        background: 'rgba(99,102,241,0.15)',
        filter: 'blur(30px)',
        borderRadius: '50%'
      }} />
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        fontWeight: 800,
        color: 'var(--t1)',
        marginBottom: 8
      }}>
        {featureName}
      </h2>
      <span style={{
        display: 'inline-block',
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--accent)',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        padding: '3px 10px',
        borderRadius: 20,
        marginBottom: 16
      }}>
        Coming in {expectedSprint}
      </span>
      <p style={{
        fontSize: 13,
        color: 'var(--t2)',
        lineHeight: 1.55,
        margin: '0 auto',
        maxWidth: 380
      }}>
        {description || `This feature is currently in active development. Our engineering team is preparing to roll it out in the next upcoming release phase.`}
      </p>
    </div>
  );
}