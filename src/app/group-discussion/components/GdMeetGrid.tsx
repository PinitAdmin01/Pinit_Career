'use client';

import React, { useEffect } from 'react';
import MeetCallGrid from '@/components/group-discussion/MeetCallGrid';
import GdAudioVisualizer from './GdAudioVisualizer';

export interface GdAvatar {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  trait: 'proactive' | 'reactive' | 'silent' | 'aggressive';
  description: string;
  voiceName: string;
}

interface GdMeetGridProps {
  invitedAvatars: string[];
  avatarsList: GdAvatar[];
  activeSpeakingAvatar: string | null;
  currentAvatarARoleId: string | null;
  currentAvatarBRoleId: string | null;
  isUserTurn: boolean;
  onUserFinishSpeaking: () => void;
  onToggleRaiseHand: () => void;
  onInterjectImmediately: () => void;
  onEndCall: () => void;
  onForceExit: () => void;
  hostId: string;
  handRaised: boolean;
  micActive: boolean;
  callDurationSeconds: number;
}

export default function GdMeetGrid({
  invitedAvatars,
  avatarsList,
  activeSpeakingAvatar,
  currentAvatarARoleId,
  currentAvatarBRoleId,
  isUserTurn,
  onUserFinishSpeaking,
  onToggleRaiseHand,
  onInterjectImmediately,
  onEndCall,
  onForceExit,
  hostId,
  handRaised,
  micActive,
  callDurationSeconds
}: GdMeetGridProps) {
  // WebGL & Media Cleanup on unmount (Task 4.4 guarantee)
  useEffect(() => {
    return () => {
      // Find all canvas elements in MeetCallGrid and force context loss if WebGL
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        try {
          const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
          if (gl) {
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
          }
        } catch {
          // ignore
        }
      });
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MeetCallGrid
        invitedAvatars={invitedAvatars}
        avatarsList={avatarsList}
        activeSpeakingAvatar={activeSpeakingAvatar}
        currentAvatarARoleId={currentAvatarARoleId}
        currentAvatarBRoleId={currentAvatarBRoleId}
        isUserTurn={isUserTurn}
        onUserFinishSpeaking={onUserFinishSpeaking}
        onToggleRaiseHand={onToggleRaiseHand}
        onInterjectImmediately={onInterjectImmediately}
        onEndCall={onEndCall}
        onForceExit={onForceExit}
        hostId={hostId}
        handRaised={handRaised}
        micActive={micActive}
        callDurationSeconds={callDurationSeconds}
      />

      {/* Mic Status & Visualizer footer bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: micActive ? 'var(--teal)' : 'var(--danger)',
            boxShadow: micActive ? '0 0 8px var(--teal)' : 'none'
          }} />
          <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--t2)' }}>
            {micActive ? 'AUDIO STREAM ACTIVE' : 'MUTED'}
          </span>
        </div>

        <div style={{ flex: 1, maxWidth: 200 }}>
          <GdAudioVisualizer active={micActive} isSpeaking={isUserTurn && micActive} />
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {handRaised && (
            <span style={{
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid var(--orange)',
              color: 'var(--orange)',
              padding: '2px 8px',
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 800
            }}>
              ✋ Hand Raised
            </span>
          )}
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
            {Math.floor(callDurationSeconds / 60).toString().padStart(2, '0')}:{(callDurationSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
