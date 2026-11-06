'use client';

import React from 'react';

export interface InterviewCameraProps {
  showCameraPreview: boolean;
  toggleCameraPreview: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  eyeContactScore?: number | null;
  isInterviewActive?: boolean;
}

export const InterviewCamera: React.FC<InterviewCameraProps> = ({
  showCameraPreview,
  toggleCameraPreview,
  videoRef,
  eyeContactScore = null,
  isInterviewActive = false,
}) => {
  return (
    <div
      data-testid="interview-camera-container"
      style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg3)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 280,
      }}
    >
      {/* Camera Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 10px',
          background: 'rgba(0, 0, 0, 0.4)',
          fontSize: 11.5,
          fontWeight: 800,
          color: 'var(--t1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: showCameraPreview ? 'var(--green-mid)' : 'var(--t3)' }}>
            {showCameraPreview ? '●' : '○'}
          </span>
          <span>Webcam Gaze</span>
        </div>

        {eyeContactScore !== null && showCameraPreview && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 6,
              background: eyeContactScore >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: eyeContactScore >= 70 ? 'var(--green-mid)' : 'var(--coral-mid)',
              fontWeight: 900,
            }}
          >
            {eyeContactScore}% Focus
          </span>
        )}
      </div>

      {/* Video Preview or Placeholder */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 160,
          background: '#090a0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          data-testid="interview-camera-video"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)', // Mirrored view
            display: showCameraPreview ? 'block' : 'none',
          }}
        />

        {!showCameraPreview && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--t3)',
              fontSize: 12,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
            <div>Camera Standby</div>
            <button
              onClick={toggleCameraPreview}
              type="button"
              style={{
                marginTop: 8,
                padding: '4px 10px',
                borderRadius: 6,
                background: 'var(--accent-light)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Enable Preview
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      {showCameraPreview && (
        <div
          style={{
            padding: '6px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg2)',
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>
            {isInterviewActive ? 'Optical Eye Contact Active' : 'Preview Ready'}
          </span>
          <button
            onClick={toggleCameraPreview}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--t3)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Turn Off
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewCamera;
