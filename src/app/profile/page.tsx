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

import PortfolioTab from './tabs/PortfolioTab';
import PassportTab from './tabs/PassportTab';
import CareerDnaTab from './tabs/CareerDnaTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PreferencesTab from './tabs/PreferencesTab';
import SettingsTab from './tabs/SettingsTab';
import SecurityTab from './tabs/SecurityTab';
import ActivityTab from './tabs/ActivityTab';

type TabType = 'portfolio' | 'passport' | 'career-dna' | 'analytics' | 'preferences' | 'security' | 'activity' | 'settings';

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <ProfilePageInner />
    </Suspense>
  );
}

function ProfilePageInner() {
  const { user, logout } = useAuth();
  const cOS = useCareerOS();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  const [teacherId, setTeacherId] = useState(user?.selectedTeacherId || 'priya');
  const [visibility, setVisibility] = useState('recruiters_only');
  const [saving, setSaving] = useState(false);

  // Focus Audio Soundscape Volume State
  const [soundscapeVol, setSoundscapeVol] = useState<number>(50);
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false);

  useEffect(() => {
    setSoundscapeVol(getUserSoundscapeVolume());
  }, []);

  // Sync state from authoritative user profile
  useEffect(() => {
    if (user) {
      if (user.selectedTeacherId) {
        setTeacherId(user.selectedTeacherId);
      }
      const rVis = (user as any).recruiter_visibility ?? (user as any).recruiterVisibility;
      if (rVis !== undefined && rVis !== null) {
        const num = Number(rVis);
        if (num === 0) setVisibility('private');
        else if (num === 100) setVisibility('public');
        else if (num === 50) setVisibility('institution_only');
        else setVisibility('recruiters_only');
      }
    }
  }, [user]);

  // Consolidated Tabs: 'portfolio' | 'passport' | 'career-dna' | 'analytics' | 'preferences' | 'security' | 'activity' | 'settings'
  const [tab, setTab] = useState<TabType>('portfolio');

  // Read URL search param 'tab' to set active tab
  useEffect(() => {
    let tabParam = searchParams.get('tab') as TabType | null;
    if (!tabParam) {
      const keys = Array.from(searchParams.keys());
      for (const k of keys) {
        if (k.toLowerCase().includes('setting')) {
          tabParam = 'settings';
          break;
        }
      }
    }
    const validTabs: TabType[] = ['portfolio', 'passport', 'career-dna', 'analytics', 'preferences', 'security', 'activity', 'settings'];
    if (tabParam && validTabs.includes(tabParam)) {
      setTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (nextTab: typeof tab) => {
    setTab(nextTab);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', `/profile?tab=${nextTab}`);
      } catch {}
    }
  };

  async function saveTeacher() {
    setSaving(true);
    try {
      await api.patch('/api/auth/teacher', { teacherId });
      await api.patch('/api/auth/profile', { selectedTeacherId: teacherId });
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success('Saved!', 'Your AI teacher has been updated.');
    } catch (err) {
      toast.error('Save failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function saveVisibility() {
    setSaving(true);
    try {
      await api.patch('/api/recruiter/visibility', { visibility });
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success('Saved!', 'Visibility updated.');
    } catch (err) {
      toast.error('Save failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const effectiveUser = user || {
    id: 'guest',
    displayName: 'Student',
    username: '@student',
    role: 'student',
    avatar_url: null,
    subscription_tier: 'free',
  };

  const initials = (effectiveUser.displayName || 'V')[0].toUpperCase();

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 60 }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
        background: 'var(--bg2)', padding: 24, borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', flexWrap: 'wrap'
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--teal))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 900, color: 'var(--text)', flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--t1)', marginBottom: 3 }}>
            {effectiveUser.displayName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            {effectiveUser.username}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 100, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
              {effectiveUser.role}
            </span>
            <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 100, background: 'var(--bg3)', color: 'var(--t3)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
              {effectiveUser.subscription_tier || 'free'} plan
            </span>
          </div>
        </div>
        <Link href="/pricing" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <button className="btn-ghost btn-sm">⭐ Upgrade</button>
        </Link>
      </div>

      {/* Main Consolidated Tabs Menu */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 24, overflowX: 'auto', width: '100%', scrollbarWidth: 'none' }}>
        {[
          { id: 'portfolio', label: '👤 Portfolio' },
          { id: 'passport', label: '🎫 Skill Passport' },
          { id: 'career-dna', label: '🧬 Career DNA' },
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'preferences', label: '🎛️ Preferences' },
          { id: 'settings', label: '⚙️ Settings' },
          { id: 'security', label: '🔒 Security' },
          { id: 'activity', label: '📜 Activity History' }
        ].map(t => (
          <button key={t.id} onClick={() => handleTabChange(t.id as TabType)} style={{
            padding: '8px 16px', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
            background: tab === t.id ? 'var(--bg2)' : 'transparent',
            color: tab === t.id ? 'var(--t1)' : 'var(--t3)',
            boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* ────────────────── SUB-TABS RENDERERS ────────────────── */}
      {tab === 'portfolio' && <PortfolioTab user={user} cOS={cOS} />}
      {tab === 'passport' && <PassportTab user={user} cOS={cOS} />}
      {tab === 'career-dna' && <CareerDnaTab user={user} cOS={cOS} />}
      {tab === 'analytics' && <AnalyticsTab />}
      {tab === 'preferences' && (
        <PreferencesTab
          user={user}
          cOS={cOS}
          soundscapeVol={soundscapeVol}
          setSoundscapeVol={setSoundscapeVol}
          isPreviewingAudio={isPreviewingAudio}
          setIsPreviewingAudio={setIsPreviewingAudio}
          teacherId={teacherId}
          setTeacherId={setTeacherId}
          visibility={visibility}
          setVisibility={setVisibility}
          saving={saving}
          saveTeacher={saveTeacher}
          saveVisibility={saveVisibility}
        />
      )}
      {tab === 'settings' && (
        <SettingsTab soundscapeVol={soundscapeVol} setSoundscapeVol={setSoundscapeVol} />
      )}
      {tab === 'security' && <SecurityTab logout={logout} router={router} />}
      {tab === 'activity' && <ActivityTab user={user} />}
    </div>
  );
}
