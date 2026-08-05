'use client';

import { useEffect, useRef } from 'react';
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
      console.warn("Failed to initialize WebGL avatar engine:", e);
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

export function preloadAvatarGLB(teacherIds: string[] = ['priya', 'anish', 'kashyap', 'karthic']) {
  if (typeof window === 'undefined') return;
  teacherIds.forEach(id => {
    const charId = id.toLowerCase().trim();
    const url = `/avatar/${charId}.glb`;
    fetch(url, { mode: 'cors', cache: 'force-cache' }).catch(() => {});
  });
}
