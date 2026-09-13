'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';

export function useInterviewGaze(isInterviewActive: boolean) {
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [eyeContactScore, setEyeContactScore] = useState<number | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const toggleCameraPreview = async () => {
    if (showCameraPreview) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
      }
      setShowCameraPreview(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
        cameraStreamRef.current = stream;
        setShowCameraPreview(true);
        setTimeout(() => {
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
          }
        }, 150);
      } catch (err) {
        console.warn('[Camera Preview] Webcam access denied or unavailable:', err);
        toast.warning('Webcam Preview Unavailable', 'Camera access was denied or no device was detected. You can continue naturally with voice.');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    setShowCameraPreview(false);
  };

  useEffect(() => {
    if (!showCameraPreview || !isInterviewActive) return;

    let totalChecks = 0;
    let focusedChecks = 0;
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let faceDetectorInstance: any = null;
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        faceDetectorInstance = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      } catch (e) {
        faceDetectorInstance = null;
      }
    }

    const interval = setInterval(async () => {
      const video = videoPreviewRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      try {
        totalChecks++;
        let isFocused = false;

        if (faceDetectorInstance) {
          try {
            const faces = await faceDetectorInstance.detect(video);
            if (faces && faces.length > 0) {
              const face = faces[0].boundingBox;
              const cx = face.x + face.width / 2;
              const cy = face.y + face.height / 2;
              if (
                cx > video.videoWidth * 0.2 &&
                cx < video.videoWidth * 0.8 &&
                cy > video.videoHeight * 0.15 &&
                cy < video.videoHeight * 0.85
              ) {
                isFocused = true;
              }
            }
          } catch {}
        }

        if (!isFocused && !('FaceDetector' in window)) {
          ctx.drawImage(video, 0, 0, 160, 120);
          const centerData = ctx.getImageData(40, 30, 80, 60).data;
          let sum = 0;
          let sumSq = 0;
          const pixelCount = centerData.length / 16;
          for (let i = 0; i < centerData.length; i += 16) {
            const luma = 0.299 * centerData[i] + 0.587 * centerData[i + 1] + 0.114 * centerData[i + 2];
            sum += luma;
            sumSq += luma * luma;
          }
          const avgLuma = sum / pixelCount;
          const variance = (sumSq / pixelCount) - (avgLuma * avgLuma);
          const stdDev = Math.sqrt(Math.max(0, variance));

          if (avgLuma > 25 && avgLuma < 235 && stdDev >= 18) {
            isFocused = true;
          }
        }

        if (isFocused) focusedChecks++;
        const currentRatio = Math.round((focusedChecks / totalChecks) * 100);
        setEyeContactScore(currentRatio);
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, [showCameraPreview, isInterviewActive]);

  // Master unmount cleanup: stop any active webcam media tracks
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        try {
          cameraStreamRef.current.getTracks().forEach(t => t.stop());
        } catch {}
        cameraStreamRef.current = null;
      }
    };
  }, []);

  return {
    showCameraPreview,
    setShowCameraPreview,
    eyeContactScore,
    setEyeContactScore,
    videoPreviewRef,
    toggleCameraPreview,
    stopCamera
  };
}
