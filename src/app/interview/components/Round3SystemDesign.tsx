'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

const SystemDesignWhiteboard = dynamic(
  () => import('@/components/interview/SystemDesignWhiteboard'),
  { ssr: false }
);

export interface Round3SystemDesignProps {
  domainStream: 'tech' | 'non_tech';
  activeTopicName: string;
  onProceed: () => void;
  setLatestTopology: (topo: any) => void;
  analyzeSystemArchitecture: () => void;
  isAnalyzingArchitecture: boolean;
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  isVoiceListening: boolean;
  startVoiceListening: () => void;
  lastInterviewerSpeech: string;
}

export const Round3SystemDesign: React.FC<Round3SystemDesignProps> = ({
  domainStream,
  activeTopicName,
  onProceed,
  setLatestTopology,
  analyzeSystemArchitecture,
  isAnalyzingArchitecture,
  activeTeacher,
  animState,
  isVoiceListening,
  startVoiceListening,
  lastInterviewerSpeech,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '7.5fr 2.5fr', gap: 16, alignItems: 'stretch' }}>
      <div className="iv-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--teal-mid)' }}>ROUND 3 OF 4</span>
            <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Business Workflow Canvas:' : 'System Architecture Canvas:'} {activeTopicName}
            </h2>
          </div>
          <button onClick={onProceed} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
            Proceed to Round 4 ➔
          </button>
        </div>

        <SystemDesignWhiteboard
          domainStream={domainStream}
          activeTopic={activeTopicName}
          onTopologyChange={setLatestTopology}
          onAnalyze={analyzeSystemArchitecture}
          isAnalyzing={isAnalyzingArchitecture}
        />
      </div>

      {/* Right 25%: Avatar Viewport & Review Comments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 190, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--text)', fontSize: 10, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        <button
          onClick={startVoiceListening}
          style={{
            width: '100%',
            background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer',
            boxShadow: isVoiceListening ? '0 0 12px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
          }}
        >
          {isVoiceListening ? '🎙️ Listening... (Speak Now)' : '🎤 Speak to Interviewer'}
        </button>

        <div className="iv-panel" style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)' }}>INTERVIEWER FEEDBACK</div>
          <div style={{ fontSize: 11.5, color: 'var(--t1)', lineHeight: 1.4, overflowY: 'auto', maxHeight: 160 }}>
            <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Round3SystemDesign;
