'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import { toast } from '@/lib/store/useAppStore';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { getUserSoundscapeVolume } from '@/lib/audio/soundscapes';
import { executeSecureLogout } from '@/lib/auth/secureLogout';

import PortfolioTab from './tabs/PortfolioTab';
import PassportTab, { type PassportView } from './tabs/PassportTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PreferencesTab from './tabs/PreferencesTab';
import SettingsTab from './tabs/SettingsTab';
import SecurityTab from './tabs/SecurityTab';
import ActivityTab from './tabs/ActivityTab';

/** The 4 top-level profile areas. */
type TabType = 'portfolio' | 'passport' | 'analytics' | 'settings';

/** Legacy `?tab=` values (8 old tabs) → new tab + the section to focus. */
const LEGACY_TAB_MAP: Record<string, { tab: TabType; section?: string }> = {
  portfolio:    { tab: 'portfolio' },
  passport:     { tab: 'passport' },
  'career-dna': { tab: 'passport', section: 'dna' },
  analytics:    { tab: 'analytics' },
  activity:     { tab: 'analytics', section: 'activity' },
  settings:     { tab: 'settings' },
  preferences:  { tab: 'settings', section: 'preferences' },
  security:     { tab: 'settings', section: 'security' },
};

const TABS: Array<{ id: TabType; icon: string; label: string; hint: string }> = [
  { id: 'portfolio', icon: '👤', label: 'Portfolio',          hint: 'Pitch, projects, credentials, resume' },
  { id: 'passport',  icon: '🎫', label: 'Skills & DNA',       hint: 'Skill passport, career DNA, pathway' },
  { id: 'analytics', icon: '📊', label: 'Growth & Activity',  hint: 'Progress analytics and history' },
  { id: 'settings',  icon: '⚙️', label: 'Settings',           hint: 'Preferences, audio, security, sign out' },
];

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)' }}>Loading…</div>}>
      <ProfilePageInner />
    </Suspense>
  );
}

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 80, margin: '8px 0 12px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--t3)', margin: '2px 0 0' }}>{subtitle}</p>}
    </div>
  );
}

function ProfilePageInner() {
  const { user, logout, refresh } = useAuth();
  const cOS = useCareerOS();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  // 1. Course Teaching Avatar State (4 options: kashyap, karthic, maya, divya)
  const [teachingAvatarId, setTeachingAvatarId] = useState<string>('kashyap');

  // 2. AI Guidance Mentor State (2 options: priya, anish)
  const [guidanceMentorId, setGuidanceMentorId] = useState<string>('priya');

  // 3. Recruiter Visibility State (default public)
  const [visibility, setVisibility] = useState<string>('public');

  // Save loaders
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingMentor, setSavingMentor] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Student Name Inline Editing State
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await executeSecureLogout({
      queryClient: qc,
      authLogout: logout,
      redirectTo: '/login'
    });
  };

  // Focus Audio Soundscape Volume State (0–100)
  const [soundscapeVol, setSoundscapeVol] = useState<number>(50);
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false);

  useEffect(() => {
    setSoundscapeVol(getUserSoundscapeVolume());
  }, []);

  // Sync state from authoritative user profile
  useEffect(() => {
    if (user) {
      // Sync teaching avatar
      const userTeacher = user.selectedTeacherId || (user as any).selected_teacher_id;
      if (userTeacher && ['kashyap', 'karthic', 'maya', 'divya'].includes(userTeacher)) {
        setTeachingAvatarId(userTeacher);
      } else if (typeof window !== 'undefined') {
        const local = localStorage.getItem('pinit_selected_teacher_id') || localStorage.getItem('pinit_preferred_teaching_avatar');
        if (local && ['kashyap', 'karthic', 'maya', 'divya'].includes(local)) {
          setTeachingAvatarId(local);
        }
      }

      // Sync AI guidance mentor
      const userMentor = user.guidanceMentorId || (user as any).guidance_mentor_id;
      if (userMentor && ['priya', 'anish'].includes(userMentor)) {
        setGuidanceMentorId(userMentor);
      } else if (typeof window !== 'undefined') {
        const localM = localStorage.getItem('pinit_selected_mentor_id');
        if (localM && ['priya', 'anish'].includes(localM)) {
          setGuidanceMentorId(localM);
        }
      }

      // Sync recruiter visibility (default public)
      const rVis = (user as any).recruiter_visibility ?? (user as any).recruiterVisibility;
      if (rVis !== undefined && rVis !== null) {
        const num = Number(rVis);
        if (num === 0) setVisibility('private');
        else if (num === 50) setVisibility('institution_only');
        else if (num === 80) setVisibility('recruiters_only');
        else setVisibility('public');
      } else {
        setVisibility('public');
      }
    }
  }, [user]);

  const [tab, setTab] = useState<TabType>('portfolio');
  const [focusSection, setFocusSection] = useState<string | undefined>(undefined);

  // Read URL `?tab=` (supports all 8 legacy values) to pick tab + section
  useEffect(() => {
    let tabParam = searchParams.get('tab');
    if (!tabParam) {
      for (const k of Array.from(searchParams.keys())) {
        if (k.toLowerCase().includes('setting')) {
          tabParam = 'settings';
          break;
        }
      }
    }
    const mapped = tabParam ? LEGACY_TAB_MAP[tabParam] : undefined;
    if (mapped) {
      setTab(mapped.tab);
      setFocusSection(mapped.section);
    }
  }, [searchParams]);

  // Scroll to the focused section (e.g. ?tab=security) once it has rendered
  useEffect(() => {
    if (!focusSection || focusSection === 'dna' || typeof window === 'undefined') return;
    const t = window.setTimeout(() => {
      document.getElementById(`profile-section-${focusSection}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => window.clearTimeout(t);
  }, [focusSection, tab]);

  const handleTabChange = (nextTab: TabType) => {
    setTab(nextTab);
    setFocusSection(undefined);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', `/profile?tab=${nextTab}`);
      } catch {}
    }
  };

  // Save Teaching Avatar (Course Faculty)
  async function saveTeachingAvatar() {
    setSavingAvatar(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_selected_teacher_id', teachingAvatarId);
        localStorage.setItem('pinit_preferred_teaching_avatar', teachingAvatarId);
      }
      await api.patch('/api/auth/teacher', { teacherId: teachingAvatarId });
      await api.patch('/api/auth/profile', { selectedTeacherId: teachingAvatarId });
      qc.invalidateQueries({ queryKey: KEYS.me });
      const avatarNames: Record<string, string> = {
        kashyap: 'Kashyap Sir',
        karthic: 'Karthic Sir "Nega"',
        maya: 'Ms. Maya',
        divya: 'Ms. Divya',
      };
      toast.success(
        'Teaching Avatar Saved!',
        `${avatarNames[teachingAvatarId] || teachingAvatarId} is set as default. Courses will launch immediately with this instructor.`
      );
    } catch {
      toast.error('Save failed', 'Could not save teaching avatar.');
    } finally {
      setSavingAvatar(false);
    }
  }

  // Save AI Career Mentor
  async function saveMentor() {
    setSavingMentor(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_selected_mentor_id', guidanceMentorId);
      }
      await api.patch('/api/auth/profile', { guidanceMentorId });
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success(
        'AI Mentor Saved!',
        `${guidanceMentorId === 'anish' ? 'Mr. Anish' : 'Ms. Priya'} is your active guidance mentor across PinIT.`
      );
    } catch {
      toast.error('Save failed', 'Could not save AI mentor.');
    } finally {
      setSavingMentor(false);
    }
  }

  // Save Recruiter Visibility
  async function saveVisibility() {
    setSavingVisibility(true);
    try {
      await api.patch('/api/recruiter/visibility', { visibility });
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success('Visibility Updated!', `Recruiter discovery set to ${visibility.replace('_', ' ')}.`);
    } catch {
      toast.error('Save failed', 'Could not update visibility.');
    } finally {
      setSavingVisibility(false);
    }
  }

  const effectiveUser: any = user || {
    id: 'guest',
    displayName: 'Student',
    username: '@student',
    role: 'student',
    avatar_url: null,
    subscription_tier: 'free',
  };

  // Resolve authentic student display name (fallback from raw IDs or generic placeholders)
  const resolvedRealName =
    effectiveUser.fullName ||
    effectiveUser.full_name ||
    effectiveUser.candidateName ||
    effectiveUser.candidate_name ||
    effectiveUser.onboardingAnswers?.candidateName ||
    effectiveUser.onboardingAnswers?.fullName ||
    effectiveUser.onboardingAnswers?.name;

  const rawDisplayName = effectiveUser.displayName || effectiveUser.name || '';
  const isIdOrFallback =
    !rawDisplayName ||
    rawDisplayName.startsWith('usr_') ||
    rawDisplayName.toLowerCase() === 'student' ||
    rawDisplayName.toLowerCase() === 'candidate';

  const currentStudentName = !isIdOrFallback
    ? rawDisplayName
    : resolvedRealName || rawDisplayName || 'Student';

  const initials = (currentStudentName.trim()[0] || 'S').toUpperCase();
  const handle =
    effectiveUser.username && !effectiveUser.username.startsWith('usr_')
      ? `@${effectiveUser.username}`
      : effectiveUser.email || '';
  const college =
    effectiveUser.institutionName ||
    effectiveUser.collegeName ||
    effectiveUser.onboardingAnswers?.college ||
    '';
  const registerNumber = effectiveUser.registerNumber || '';
  const tier = String(effectiveUser.subscription_tier || 'free');

  // Save Student Name Handler
  async function handleSaveStudentName() {
    const trimmed = tempName.trim();
    if (!trimmed) {
      toast.error('Name required', 'Please enter your student name.');
      return;
    }
    setSavingName(true);
    try {
      await api.patch('/api/auth/profile', {
        displayName: trimmed,
        display_name: trimmed,
        full_name: trimmed,
      });
      await api.patch('/api/auth/me', {
        displayName: trimmed,
        fullName: trimmed,
      }).catch(() => {});

      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('pinit_current_user');
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.displayName = trimmed;
            parsed.name = trimmed;
            localStorage.setItem('pinit_current_user', JSON.stringify(parsed));
          }
          if (user?.id) {
            const userKey = `pinit_${user.id}_profile`;
            const rawUser = localStorage.getItem(userKey);
            if (rawUser) {
              const parsed = JSON.parse(rawUser);
              parsed.displayName = trimmed;
              localStorage.setItem(userKey, JSON.stringify(parsed));
            }
          }
        } catch {}
      }

      if (typeof refresh === 'function') {
        await refresh();
      }
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success('Name Updated!', `Your student profile name is now ${trimmed}.`);
      setEditingName(false);
    } catch {
      toast.error('Save failed', 'Could not save student name. Please try again.');
    } finally {
      setSavingName(false);
    }
  }

  const stats = [
    { label: 'Career', value: Number(cOS?.careerScore) || 0 },
    { label: 'DNA', value: Number(cOS?.dnaScore) || 0 },
    { label: 'Trust', value: Number(cOS?.trustScore) || 0 },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 60 }}>
      {/* Profile Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 20,
          background: 'var(--card)',
          padding: 22,
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--teal))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 27,
            fontWeight: 900,
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          {editingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <input
                type="text"
                value={tempName}
                placeholder="Enter your student name"
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveStudentName();
                  else if (e.key === 'Escape') setEditingName(false);
                }}
                autoFocus
                style={{
                  padding: '6px 12px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: '1.5px solid var(--accent)',
                  background: 'var(--bg3)',
                  color: 'var(--t1)',
                  fontFamily: 'var(--font-display)',
                  outline: 'none',
                  minWidth: 220,
                }}
              />
              <button
                type="button"
                onClick={handleSaveStudentName}
                disabled={savingName}
                className="btn-primary btn-sm"
                style={{ padding: '6px 14px', fontSize: 13, fontWeight: 700 }}
              >
                {savingName ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditingName(false)}
                className="btn-ghost btn-sm"
                style={{ padding: '6px 10px', fontSize: 13 }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2, flexWrap: 'wrap' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--t1)',
                }}
              >
                {currentStudentName}
              </div>
              <button
                type="button"
                onClick={() => {
                  setTempName(currentStudentName === 'Student' ? '' : currentStudentName);
                  setEditingName(true);
                }}
                title="Edit student name"
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                ✏️ Edit Name
              </button>
            </div>
          )}

          <div
            style={{
              fontSize: 13,
              color: 'var(--t3)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {[handle, college, registerNumber].filter(Boolean).join(' · ')}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                padding: '2px 10px',
                borderRadius: 100,
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textTransform: 'capitalize',
              }}
            >
              {effectiveUser.role}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 10px',
                borderRadius: 100,
                background: 'var(--bg3)',
                color: 'var(--t2)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'capitalize',
              }}
            >
              {tier} plan
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                minWidth: 64,
                padding: '8px 10px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--t1)',
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--t3)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {tier === 'free' && (
            <Link href="/pricing" className="btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              ⭐ Upgrade
            </Link>
          )}
          <button
            type="button"
            data-testid="profile-header-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn-ghost btn-sm"
            style={{
              color: 'var(--coral)',
              borderColor: 'rgba(var(--danger-rgb), 0.35)',
              background: 'rgba(var(--danger-rgb), 0.08)',
              fontWeight: 700,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            {loggingOut ? 'Signing out...' : '🚪 Log Out'}
          </button>
        </div>
      </div>

      {/* 4 top-level tabs */}
      <div
        role="tablist"
        aria-label="Profile sections"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 8,
          marginBottom: 20,
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              data-testid={`profile-tab-${t.id}`}
              type="button"
              onClick={() => handleTabChange(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 12,
                cursor: 'pointer',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'var(--accent-light)' : 'var(--card)',
                boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: active ? 'var(--accent)' : 'var(--t1)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {t.label}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 11.5,
                    color: 'var(--t3)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'portfolio' && <PortfolioTab user={user} cOS={cOS} />}

      {tab === 'passport' && (
        <PassportTab
          user={user}
          cOS={cOS}
          initialView={(focusSection === 'dna' ? 'dna' : 'skills') as PassportView}
        />
      )}

      {tab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeading
            id="profile-section-analytics"
            title="Growth analytics"
            subtitle="Scores, trends and course progress"
          />
          <AnalyticsTab />
          <SectionHeading
            id="profile-section-activity"
            title="Activity history"
            subtitle="Everything you have done recently"
          />
          <ActivityTab user={user} />
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeading
            id="profile-section-preferences"
            title="Preferences"
            subtitle="Teaching avatar, AI mentor, recruiter visibility and soundscapes"
          />
          <PreferencesTab
            user={user}
            cOS={cOS}
            soundscapeVol={soundscapeVol}
            setSoundscapeVol={setSoundscapeVol}
            isPreviewingAudio={isPreviewingAudio}
            setIsPreviewingAudio={setIsPreviewingAudio}
            teachingAvatarId={teachingAvatarId}
            setTeachingAvatarId={setTeachingAvatarId}
            guidanceMentorId={guidanceMentorId}
            setGuidanceMentorId={setGuidanceMentorId}
            visibility={visibility}
            setVisibility={setVisibility}
            savingAvatar={savingAvatar}
            savingMentor={savingMentor}
            savingVisibility={savingVisibility}
            saveTeachingAvatar={saveTeachingAvatar}
            saveMentor={saveMentor}
            saveVisibility={saveVisibility}
          />
          <SectionHeading
            id="profile-section-security"
            title="Security"
            subtitle="Password, face login and account protection"
          />
          <SecurityTab logout={handleLogout} router={router} />
          <SectionHeading id="profile-section-general" title="Tour, microphone & session" />
          <SettingsTab
            soundscapeVol={soundscapeVol}
            setSoundscapeVol={setSoundscapeVol}
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />
        </div>
      )}
    </div>
  );
}
