'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import NotificationPreferences from '@/components/ui/NotificationPreferences';
import { getUserSoundscapeVolume, setUserSoundscapeVolume, startArchetypeSoundscape, stopArchetypeSoundscape } from '@/lib/audio/soundscapes';
import { CS } from './types';

const TEACHERS = [
  { id:'priya',  name:'Ms. Priya',  emoji:'👩‍💼', style:'Friendly & encouraging'   },
  { id:'aisha',  name:'Ms. Aisha',  emoji:'👩‍🏫', style:'Structured & methodical'  },
  { id:'rohan',  name:'Mr. Rohan',  emoji:'👨‍💻', style:'Energetic & tech-focused'  },
  { id:'vikram', name:'Mr. Vikram', emoji:'👨‍⚖️', style:'Strict & results-driven'  },
];

const VISIBILITY_OPTIONS = [
  { value:'public',           label:'Public',           desc:'Visible to all approved recruiters'           },
  { value:'recruiters_only',  label:'Recruiters Only',  desc:'Only approved recruiters can see you'         },
  { value:'institution_only', label:'Institution Only', desc:'Only your linked institution can see you'     },
  { value:'private',          label:'Private',          desc:'Hidden from all external searches'            },
];

interface PreferencesTabProps {
  user: any;
  cOS: any;
  soundscapeVol: number;
  setSoundscapeVol: (vol: number) => void;
  isPreviewingAudio: boolean;
  setIsPreviewingAudio: (val: boolean) => void;
  teacherId: string;
  setTeacherId: (id: string) => void;
  visibility: string;
  setVisibility: (vis: string) => void;
  saving: boolean;
  saveTeacher: () => Promise<void>;
  saveVisibility: () => Promise<void>;
}

export default function PreferencesTab({
  user,
  cOS,
  soundscapeVol,
  setSoundscapeVol,
  isPreviewingAudio,
  setIsPreviewingAudio,
  teacherId,
  setTeacherId,
  visibility,
  setVisibility,
  saving,
  saveTeacher,
  saveVisibility
}: PreferencesTabProps) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }} className="animate-fade-in">
      {/* 🎵 Mindset Focus Soundscape Settings */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>🎵 Mindset Background Music & Soundscapes</div>
        <p style={{ fontSize: 11.5, color: 'var(--t2)', marginBottom: 14 }}>
          Adjust the volume of your learning soundscape (Pattern Hunter, Explorer, Social IQ, Stabilizer). Music automatically ducks when the AI Teacher speaks.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Music Volume Level</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{soundscapeVol}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={soundscapeVol}
            onChange={(e) => {
              const newVol = parseInt(e.target.value, 10);
              setSoundscapeVol(newVol);
              setUserSoundscapeVolume(newVol);
            }}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={() => {
                if (isPreviewingAudio) {
                  stopArchetypeSoundscape();
                  setIsPreviewingAudio(false);
                  toast.info("Audio Preview Stopped", "Soundscape muted.");
                } else {
                  const metaData = (user?.user_metadata as any) || {};
                  const arch = metaData.mindset_archetype || 'Pattern Hunter';
                  startArchetypeSoundscape(arch);
                  setIsPreviewingAudio(true);
                  toast.success("Playing Focus Audio", `Previewing soundscape for ${arch}`);
                }
              }}
              className="btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {isPreviewingAudio ? '⏸️ Stop Audio Preview' : '▶️ Test Soundscape Audio Track'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Teacher selector */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>🤖 AI Teacher / Mentor</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {TEACHERS.map(t => (
            <button key={t.id} onClick={() => setTeacherId(t.id)}
              style={{ padding:'12px 14px', borderRadius:10, textAlign:'left',
                border:`1.5px solid ${teacherId===t.id?'var(--accent)':'var(--border)'}`,
                background:teacherId===t.id?'var(--accent-light)':'var(--bg2)',
                cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ fontSize:20, marginBottom:5 }}>{t.emoji}</div>
              <div style={{ fontSize:12.5, fontWeight:teacherId===t.id?700:500, color:teacherId===t.id?'var(--accent)':'var(--t1)' }}>{t.name}</div>
              <div style={{ fontSize:11, color:'var(--t3)', marginTop:2 }}>{t.style}</div>
            </button>
          ))}
        </div>
        <button onClick={saveTeacher} disabled={saving} className="btn-primary btn-sm">
          {saving ? 'Saving…' : 'Save Teacher'}
        </button>
      </div>

      {/* Recruiter Visibility */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>🔍 Recruiter Visibility</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {VISIBILITY_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setVisibility(opt.value)} style={{
              padding:'10px 12px', borderRadius:10, textAlign:'left',
              border:`1.5px solid ${visibility===opt.value?'var(--accent)':'var(--border)'}`,
              background:visibility===opt.value?'var(--accent-light)':'var(--bg2)',
              cursor:'pointer', transition:'all 0.15s',
            }}>
              <div style={{ fontSize:12.5, fontWeight:visibility===opt.value?700:500, color:visibility===opt.value?'var(--accent)':'var(--t1)', marginBottom:2 }}>{opt.label}</div>
              <div style={{ fontSize:11, color:'var(--t3)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>
        <button onClick={saveVisibility} disabled={saving} className="btn-primary btn-sm">
          {saving ? 'Saving…' : 'Save Visibility'}
        </button>
      </div>

      {/* Career Builder Tab Visibility Toggle */}
      <div style={CS.card}>
        <div style={CS.cardTitle}>🛠 Career Builder Visibility</div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          By default, once you complete all quest roadmap milestones, the Career Builder tab is automatically hidden from the sidebar to keep your workspace clean. You can toggle it back to visible here anytime.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Show Career Builder Tab</span>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
              {cOS.forceShowCareerBuilder ? 'Always visible in sidebar' : 'Automatically hidden when quests are completed'}
            </div>
          </div>
          <button 
            onClick={() => {
              cOS.setForceShowCareerBuilder(!cOS.forceShowCareerBuilder);
              toast.success(
                cOS.forceShowCareerBuilder ? 'Tab Hidden' : 'Tab Visible',
                `Career Builder tab has been set to ${cOS.forceShowCareerBuilder ? 'hidden' : 'visible'}.`
              );
            }} 
            style={{
              background: cOS.forceShowCareerBuilder ? 'var(--accent)' : 'var(--bg2)',
              color: cOS.forceShowCareerBuilder ? 'white' : 'var(--t2)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: cOS.forceShowCareerBuilder ? '0 4px 12px rgba(79,70,229,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {cOS.forceShowCareerBuilder ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <NotificationPreferences />
    </div>
  );
}
