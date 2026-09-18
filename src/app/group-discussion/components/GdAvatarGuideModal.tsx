'use client';

import React from 'react';
import { GdAvatar } from './GdMeetGrid';

interface GdAvatarGuideModalProps {
  isOpen: boolean;
  avatars: GdAvatar[];
  currentMentorId: string;
  onClose: () => void;
  onPlayDemo: (id: string, name: string) => void;
}

export default function GdAvatarGuideModal({
  isOpen,
  avatars,
  currentMentorId,
  onClose,
  onPlayDemo
}: GdAvatarGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1.5px solid var(--border)',
        borderRadius: 24,
        width: '100%',
        maxWidth: 960,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        animation: 'fade-in 0.2s'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg3)'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>
              🤖 Multi-Agent Avatar & Voice Cast Guide
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--t3)' }}>
              Preview visual profiles, behavioral traits, and listen to neural Kokoro/Kitten voice samples.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--t2)',
              fontSize: 20,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {avatars.map(avatar => {
            const isUserActiveMentor = avatar.id === currentMentorId;
            return (
              <div
                key={avatar.id}
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  opacity: isUserActiveMentor ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                {isUserActiveMentor && (
                  <span style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: 8.5,
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: 6,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    ACTIVE MENTOR
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{avatar.emoji}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>{avatar.name}</h4>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{avatar.role}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 8.5,
                    background: 'rgba(var(--accent-teal-rgb), 0.1)',
                    border: '1px solid var(--teal)',
                    color: 'var(--teal)',
                    padding: '2px 6px',
                    borderRadius: 6,
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    Trait: {avatar.trait}
                  </span>
                  <span style={{
                    fontSize: 8.5,
                    background: 'rgba(79,70,229,0.1)',
                    border: '1px solid #4f46e5',
                    color: '#818cf8',
                    padding: '2px 6px',
                    borderRadius: 6,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    Voice: {avatar.voiceName}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 11, color: 'var(--t2)', flex: 1 }}>{avatar.description}</p>

                <button
                  onClick={() => onPlayDemo(avatar.id, avatar.name)}
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: 10.5,
                    borderRadius: 8,
                    background: 'var(--bg2)',
                    border: '1.5px solid var(--border)',
                    color: 'var(--teal)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  🎙️ Play Neural Voice Sample
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg3)' }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}
          >
            Close Cast Guide
          </button>
        </div>
      </div>
    </div>
  );
}
