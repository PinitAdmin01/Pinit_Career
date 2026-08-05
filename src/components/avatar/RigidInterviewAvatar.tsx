'use client';

import { useEffect, useRef } from 'react';
import { VRoidAvatarEngine, AnimState } from './VRoidAvatarEngine';

interface Props {
  teacherId?: string;
  animState?: AnimState;
  zoom?: number;
}

export default function RigidInterviewAvatar({ teacherId = 'priya', animState = 'idle', zoom = 1.6 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<VRoidAvatarEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new VRoidAvatarEngine();
    sceneRef.current = scene;
    try {
      scene.init(canvasRef.current, teacherId);
      scene.setState(animState);
      if (scene.camera) {
        scene.camera.position.z = zoom;
      }
      if (typeof window !== 'undefined') {
        (window as any).interviewAvatarScene = scene;
      }
    } catch (e) {
      console.warn("Failed to initialize WebGL avatar engine:", e);
    }

    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry && sceneRef.current) {
        sceneRef.current.resize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    if (canvasRef.current && canvasRef.current.parentElement) {
      ro.observe(canvasRef.current.parentElement);
    }

    return () => {
      ro.disconnect();
      scene.dispose();
    };
  }, [teacherId]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setState(animState);
    }
  }, [animState]);

  useEffect(() => {
    if (sceneRef.current && sceneRef.current.camera) {
      sceneRef.current.camera.position.z = zoom;
      sceneRef.current.camera.lookAt(0, sceneRef.current.camera.position.y + 0.12, 0);
    }
  }, [zoom]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#090a12', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', opacity: 1.0 }} />
      
      {/* Cybernetic HUD Frame */}
      <div style={{
        position: 'absolute', inset: 12, border: '1px solid rgba(99, 102, 241, 0.15)',
        borderRadius: 12, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 12
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              📡 NEURAL HUMAN INTERFACE v5.0
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', marginTop: 2, textTransform: 'capitalize' }}>
              RECRUITER FEED: {teacherId}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: animState === 'talking' ? 'var(--green)' : 'var(--accent)', display: 'inline-block' }} />
            <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--t3)', textTransform: 'uppercase' }}>
              {animState}
            </span>
          </div>
        </div>

        {/* Bottom Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
          <div>
            <div>RESOLUTION: 2048 x 1536</div>
            <div>COMPRESSION: NEURAL STREAM</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>HANDSHAKE: PASS</div>
            <div style={{ color: 'var(--teal)', fontWeight: 'bold' }}>HUMANOID ENGAGED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
