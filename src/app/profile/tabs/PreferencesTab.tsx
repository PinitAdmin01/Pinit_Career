'use client';

import React from 'react';
import { toast } from '@/lib/store/useAppStore';
import { getUserSoundscapeVolume, setUserSoundscapeVolume, startArchetypeSoundscape, stopArchetypeSoundscape } from '@/lib/audio/soundscapes';
import { CS } from './types';

export interface TeachingAvatarOption {
  id: string;
  name: string;
  role: string;
  emoji: string;
  focus: string;
  desc: string;
  badge: string;
}

export const TEACHING_AVATARS: TeachingAvatarOption[] = [
  {
    id: 'kashyap',
    name: 'Kashyap Sir',
    role: 'Staff Systems Architect',
    emoji: '👨‍💼',
    focus: 'Scalability & Systems Design',
    desc: 'Structured, calm, and deeply technical. Teaches clean architectural patterns and system invariants.',
    badge: 'Systems & Architecture'
  },
  {
    id: 'karthic',
    name: 'Karthic Sir "Nega"',
    role: 'Algorithmic Lead Tutor',
    emoji: '👨‍🏫',
    focus: 'Algorithms & Core Loop Efficiency',
    desc: 'Hyper-energetic whiteboard educator. Breaks down memory structures, pointers, and runtime logic step-by-step.',
    badge: 'Algorithms & DS'
  },
  {
    id: 'maya',
    name: 'Ms. Maya',
    role: 'Principal Security Auditor',
    emoji: '👩‍💼',
    focus: 'Cloud Patterns & Security Standards',
    desc: 'Strict, audit-focused, and precise. Evaluates production readiness, IAM policies, and cloud infrastructure.',
    badge: 'Cloud & Security'
  },
  {
    id: 'divya',
    name: 'Ms. Divya',
    role: 'Lead UX Engineer',
    emoji: '👩‍🎨',
    focus: 'Frontend Systems & State Management',
    desc: 'Empathetic, clear, and product-oriented. Focuses on component design, state architecture, and UI responsiveness.',
    badge: 'UI & Product Eng'
  },
];

export interface GuidanceMentorOption {
  id: string;
  name: string;
  role: string;
  emoji: string;
  desc: string;
  style: string;
}

export const GUIDANCE_MENTORS: GuidanceMentorOption[] = [
  {
    id: 'priya',
    name: 'Ms. Priya',
    role: 'AI Career Mentor & Strategic Advisor',
    emoji: '👩‍💼',
    desc: 'Empathetic, supportive, and encouraging guidance partner across all daily missions and interviews.',
    style: 'Friendly, encouraging & holistic'
  },
  {
    id: 'anish',
    name: 'Mr. Anish',
    role: 'AI Systems Mentor & Technical Advisor',
    emoji: '👨‍💻',
    desc: 'Structured, analytical, and results-oriented systems mentor pushing for rigor and technical clarity.',
    style: 'Strategic, analytical & tech-focused'
  },
];

export const VISIBILITY_OPTIONS = [
  { value: 'public',           label: 'Public (Recommended)', desc: 'Visible to all approved corporate recruiters and hiring partners', badge: 'Default' },
  { value: 'recruiters_only',  label: 'Recruiters Only',      desc: 'Only vetted enterprise recruiters can access your profile' },
  { value: 'institution_only', label: 'Institution Only',     desc: 'Only your affiliated campus or university faculty can view you' },
  { value: 'private',          label: 'Private',              desc: 'Completely hidden from external recruiter searches' },
];

interface PreferencesTabProps {
  user: any;
  cOS: any;
  soundscapeVol: number;
  setSoundscapeVol: (vol: number) => void;
  isPreviewingAudio: boolean;
  setIsPreviewingAudio: (val: boolean) => void;
  teachingAvatarId: string;
  setTeachingAvatarId: (id: string) => void;
  guidanceMentorId: string;
  setGuidanceMentorId: (id: string) => void;
  visibility: string;
  setVisibility: (vis: string) => void;
  savingAvatar: boolean;
  savingMentor: boolean;
  savingVisibility: boolean;
  saveTeachingAvatar: () => Promise<void>;
  saveMentor: () => Promise<void>;
  saveVisibility: () => Promise<void>;
}

export default function PreferencesTab({
  user,
  cOS,
  soundscapeVol,
  setSoundscapeVol,
  isPreviewingAudio,
  setIsPreviewingAudio,
  teachingAvatarId,
  setTeachingAvatarId,
  guidanceMentorId,
  setGuidanceMentorId,
  visibility,
  setVisibility,
  savingAvatar,
  savingMentor,
  savingVisibility,
  saveTeachingAvatar,
  saveMentor,
  saveVisibility,
}: PreferencesTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="animate-fade-in">
      {/* ── Section 1: Default Course Teaching Avatar ── */}
      <div style={{ ...CS.card, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <div>
            <div style={{ ...CS.cardTitle, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎓</span> Default Course Teaching Avatar
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 680 }}>
              Choose your preferred 3D faculty instructor for course lectures. Once selected here, whenever you click <strong>Start Course</strong> or enter any lesson, it automatically launches with your chosen teaching avatar without asking you to choose every time.
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
            Course Player Engine
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 14, marginBottom: 16 }}>
          {TEACHING_AVATARS.map((t) => {
            const isSelected = teachingAvatarId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTeachingAvatarId(t.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  textAlign: 'left',
                  border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--accent-light)' : 'var(--bg3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 26 }}>{t.emoji}</span>
                  {isSelected && (
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, background: 'var(--accent)', color: 'white' }}>
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginTop: 1 }}>
                    {t.role}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4, marginTop: 2 }}>
                  {t.desc}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--bg2)', color: 'var(--t2)', border: '1px solid var(--border)' }}>
                    {t.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={saveTeachingAvatar}
            disabled={savingAvatar}
            className="btn-primary btn-sm"
            style={{ padding: '8px 20px', fontSize: 13.5, fontWeight: 800 }}
          >
            {savingAvatar ? 'Saving Avatar…' : 'Save Teaching Avatar'}
          </button>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            Active default for all course lectures and code sandboxes.
          </span>
        </div>
      </div>

      {/* ── Section 2: AI Career Guidance Mentor ── */}
      <div style={{ ...CS.card, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <div>
            <div style={{ ...CS.cardTitle, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🧭</span> AI Career Mentor &amp; Copilot
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 680 }}>
              Your dedicated 3D personal AI career mentor provides voice navigation, daily habit guidance, interview feedback, and career readiness advice across the entire platform. Mentors are exclusively Ms. Priya and Mr. Anish.
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'var(--purple-light)', color: 'var(--purple)', border: '1px solid var(--purple)' }}>
            Global 3D Copilot
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 14, marginBottom: 16 }}>
          {GUIDANCE_MENTORS.map((m) => {
            const isSelected = guidanceMentorId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setGuidanceMentorId(m.id)}
                style={{
                  padding: '16px 18px',
                  borderRadius: 12,
                  textAlign: 'left',
                  border: `2px solid ${isSelected ? 'var(--purple)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--purple-light)' : 'var(--bg3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 32 }}>{m.emoji}</span>
                  {isSelected && (
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, background: 'var(--purple)', color: 'white' }}>
                      Active Mentor
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isSelected ? 'var(--purple)' : 'var(--t1)' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--t2)', marginTop: 2 }}>
                    {m.role}
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.45 }}>
                  {m.desc}
                </div>
                <div style={{ fontSize: 11.5, color: isSelected ? 'var(--purple)' : 'var(--accent)', fontWeight: 700, marginTop: 'auto' }}>
                  Style: {m.style}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={saveMentor}
            disabled={savingMentor}
            className="btn-primary btn-sm"
            style={{
              padding: '8px 20px',
              fontSize: 13.5,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--purple), var(--accent))',
            }}
          >
            {savingMentor ? 'Saving Mentor…' : 'Save AI Mentor'}
          </button>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            Powers voice copilot, mock interview debriefs, and global guidance.
          </span>
        </div>
      </div>

      {/* ── Section 3: Recruiter Visibility (Public Default) ── */}
      <div style={{ ...CS.card, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <div>
            <div style={{ ...CS.cardTitle, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🔍</span> Recruiter Visibility
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, maxWidth: 680 }}>
              Control whether corporate talent acquisition partners and technical recruiters can discover your verified skills, project portfolio, and proctored exam transcripts.
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
            Default: Public
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginTop: 14, marginBottom: 16 }}>
          {VISIBILITY_OPTIONS.map((opt) => {
            const isSelected = visibility === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setVisibility(opt.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  textAlign: 'left',
                  border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--accent-light)' : 'var(--bg3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>
                    {opt.label}
                  </div>
                  {opt.badge && (
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: 'var(--green)', color: 'white' }}>
                      {opt.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={saveVisibility}
            disabled={savingVisibility}
            className="btn-primary btn-sm"
            style={{ padding: '8px 20px', fontSize: 13.5, fontWeight: 800 }}
          >
            {savingVisibility ? 'Saving Visibility…' : 'Save Visibility'}
          </button>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            Changes sync immediately with corporate talent discovery algorithms.
          </span>
        </div>
      </div>

      {/* ── Section 4: Mindset Focus Soundscape Settings ── */}
      <div style={{ ...CS.card, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ ...CS.cardTitle, fontSize: 16 }}>🎵 Mindset Background Music &amp; Soundscapes</div>
        <p style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 14 }}>
          Adjust the volume of your learning soundscape (Pattern Hunter, Explorer, Social IQ, Stabilizer). Music automatically ducks when your AI teacher speaks.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Music Volume Level</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{soundscapeVol}%</span>
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
              type="button"
              onClick={() => {
                if (isPreviewingAudio) {
                  stopArchetypeSoundscape();
                  setIsPreviewingAudio(false);
                  toast.info('Audio Preview Stopped', 'Soundscape muted.');
                } else {
                  const metaData = (user?.user_metadata as any) || {};
                  const arch = metaData.mindset_archetype || 'Pattern Hunter';
                  startArchetypeSoundscape(arch);
                  setIsPreviewingAudio(true);
                  toast.success('Playing Focus Audio', `Previewing soundscape for ${arch}`);
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

      {/* ── Section 5: Career Builder Tab Visibility Toggle ── */}
      <div style={{ ...CS.card, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ ...CS.cardTitle, fontSize: 16 }}>🛠️ Career Builder Visibility</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 14, lineHeight: 1.5 }}>
          By default, once you complete all quest roadmap milestones, the Career Builder tab is automatically hidden from the sidebar to keep your workspace clean. You can toggle it back to visible here anytime.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--t1)' }}>Show Career Builder Tab</span>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
              {cOS?.forceShowCareerBuilder ? 'Always visible in sidebar' : 'Automatically hidden when quests are completed'}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              if (cOS?.setForceShowCareerBuilder) {
                cOS.setForceShowCareerBuilder(!cOS.forceShowCareerBuilder);
                toast.success(
                  cOS.forceShowCareerBuilder ? 'Tab Hidden' : 'Tab Visible',
                  `Career Builder tab has been set to ${cOS.forceShowCareerBuilder ? 'hidden' : 'visible'}.`
                );
              }
            }} 
            style={{
              background: cOS?.forceShowCareerBuilder ? 'var(--accent)' : 'var(--bg2)',
              color: cOS?.forceShowCareerBuilder ? 'white' : 'var(--t2)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: cOS?.forceShowCareerBuilder ? '0 4px 12px rgba(79,70,229,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {cOS?.forceShowCareerBuilder ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>
    </div>
  );
}
