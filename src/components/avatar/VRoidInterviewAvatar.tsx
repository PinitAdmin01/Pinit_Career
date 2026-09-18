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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new VRoidAvatarEngine();
    sceneRef.current = scene;

    // 8-second safety timeout: degrades smoothly to 2D fallback if network is slow
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    scene.onReady = () => {
      clearTimeout(safetyTimer);
      setIsLoading(false);
    };

    // Immediate 2D portrait fallback if WebGL context is lost (GPU crash or low memory)
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("[VRoid Avatar] WebGL context lost (webglcontextlost). Falling back to 2D portrait immediately.");
      clearTimeout(safetyTimer);
      setHasWebGLError(true);
      setIsLoading(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    scene.paused = paused || !visible;
    try {
      scene.init(canvas, teacherId);
      scene.setState(animState);
      if (scene.camera) {
        scene.camera.position.z = zoom;
      }
      if (typeof window !== 'undefined') {
        (window as any).interviewAvatarScene = scene;
        window.dispatchEvent(new CustomEvent('pinit_vroid_active', { detail: { active: true } }));
      }
    } catch (e) {
      console.warn("[VRoid Avatar] WebGL Engine initialization failed, falling back to 2D portrait:", e);
      clearTimeout(safetyTimer);
      setHasWebGLError(true);
      setIsLoading(false);
    }

    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry && sceneRef.current) {
        sceneRef.current.resize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    ro.observe(canvas);

    return () => {
      clearTimeout(safetyTimer);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      ro.disconnect();
      scene.dispose();
      if (typeof window !== 'undefined') {
        if ((window as any).interviewAvatarScene === scene) {
          delete (window as any).interviewAvatarScene;
        }
        window.dispatchEvent(new CustomEvent('pinit_vroid_active', { detail: { active: false } }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <canvas ref={canvasRef} data-vroid-canvas="true" style={{ width: '100%', height: '100%', display: 'block' }} />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.7) 0%, rgba(2, 6, 23, 0.9) 100%)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#818cf8',
              animation: 'vroid-avatar-spin 0.85s linear infinite',
            }}
          />
          <style>{`
            @keyframes vroid-avatar-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginTop: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Synthesizing 3D Mentor...
          </div>
        </div>
      )}
    </div>
  );
}

export function preloadAvatarGLB(teacherIds: string | string[] = ['priya', 'anish']) {
  if (typeof window === 'undefined') return;
  const list = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
  list.forEach(id => {
    if (!id) return;
    const charId = id.toLowerCase().trim();
    const url = `/avatar/${charId}.glb`;
    fetch(url, { mode: 'cors', cache: 'force-cache' }).catch(() => {});
  });
}
