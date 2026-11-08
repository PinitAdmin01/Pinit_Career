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

    // 8-second safety timeout: degrades to 2D portrait fallback if GLB load stalls
    const safetyTimer = setTimeout(() => {
      setHasWebGLError(true);
      setIsLoading(false);
    }, 3000);

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

  const avatarEmoji =
    teacherId === 'priya' ? '👩‍💼'
    : teacherId === 'rohan' ? '👨‍💻'
    : teacherId === 'vikram' ? '👨‍⚖️'
    : teacherId === 'rajesh' ? '👨‍💼'
    : teacherId === 'sneha' ? '👩‍💻'
    : teacherId === 'abhijit' ? '👨‍🏫'
    : teacherId === 'kashyap' ? '👨‍🔬'
    : '👩‍🏫';

  if (hasWebGLError) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        color: '#fff', textAlign: 'center', padding: 20
      }}>
        <div style={{ fontSize: 70.5, marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.4))' }}>
          {avatarEmoji}
        </div>
        <div style={{ fontSize: 17.5, fontWeight: 900, textTransform: 'capitalize' }}>
          {teacherId} (AI Mentor)
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
          2D Mode Active • Audio Vocal Track Connected
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas key={teacherId} ref={canvasRef} data-vroid-canvas="true" style={{ width: '100%', height: '100%', display: 'block' }} />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(30,27,75,0.88) 0%, rgba(15,23,42,0.94) 100%)',
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 8, filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.4))' }}>
            {avatarEmoji}
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, textTransform: 'capitalize', color: '#fff' }}>
            {teacherId} (AI Mentor)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderTopColor: '#818cf8',
                animation: 'vroid-avatar-spin 0.85s linear infinite',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
              CONNECTING 3D MENTOR FEED...
            </span>
          </div>
          <style>{`
            @keyframes vroid-avatar-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export function preloadAvatarGLB(teacherIds: string | string[] = ['priya']) {
  if (typeof window === 'undefined') return;

  const schedulePreload = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1200));

  schedulePreload(() => {
    const nav = navigator as any;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    if (conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g')) {
      return;
    }

    const list = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
    const primaryId = list[0];
    if (!primaryId) return;

    const charId = primaryId.toLowerCase().trim();
    const url = `/avatar/${charId}.glb`;
    fetch(url, { mode: 'cors' }).catch(() => {});
  });
}
