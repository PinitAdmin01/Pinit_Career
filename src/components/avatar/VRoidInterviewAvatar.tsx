'use client';

import { useState, useEffect, useRef } from 'react';
import { VRoidAvatarEngine, AnimState } from './VRoidAvatarEngine';

interface Props {
  teacherId?: string;
  animState?: AnimState;
  zoom?: number;
  visible?: boolean;
  paused?: boolean;
}

export default function VRoidInterviewAvatar({ teacherId = 'priya', animState = 'idle', zoom = 1.6, visible = true, paused = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<VRoidAvatarEngine | null>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new VRoidAvatarEngine();
    sceneRef.current = scene;
    scene.paused = paused || !visible;
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
      console.warn("[VRoid Avatar] WebGL Engine initialization failed, falling back to 2D portrait:", e);
      setHasWebGLError(true);
    }

    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry && sceneRef.current) {
        sceneRef.current.resize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    ro.observe(canvasRef.current);

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
    }
  }, [zoom]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.paused = paused || !visible;
    }
  }, [paused, visible]);

  if (hasWebGLError) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        color: '#fff', textAlign: 'center', padding: 20
      }}>
        <div style={{ fontSize: 64, marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.4))' }}>
          {teacherId === 'priya' ? '👩‍💼' : teacherId === 'rohan' ? '👨‍💻' : teacherId === 'vikram' ? '👨‍⚖️' : '👩‍🏫'}
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, textTransform: 'capitalize' }}>
          {teacherId} (AI Interviewer)
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          2D Mode Active • Audio Vocal Track Connected
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

export function preloadAvatarGLB(teacherIds: string[] = ['priya', 'anish']) {
  if (typeof window === 'undefined') return;
  teacherIds.forEach(id => {
    const charId = id.toLowerCase().trim();
    const url = `/avatar/${charId}.glb`;
    fetch(url, { mode: 'cors', cache: 'force-cache' }).catch(() => {});
  });
}
