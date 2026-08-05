'use client';
// apps/web/src/components/ui/WhatToDoToday.tsx
// Generates 3 personalised action cards from existing career_profiles data.
// Zero new API calls — derives everything from the profile already loaded on dashboard.

import Link from 'next/link';

interface Profile {
  ats_score?:           number;
  trust_score?:         number;
  career_dna_score?:    number;
  mission_streak?:      number;
  missions_completed?:  number;
  recruiter_visibility?:number;
  vault_count?:         number;
  interviews_done?:     number;
  weak_areas?:          string[];
  skill_tags?:          string[];
  xp_total?:            number;
}

interface Action {
  icon:    string;
  title:   string;
  desc:    string;
  href:    string;
  cta:     string;
  color:   string;
  urgency: number; // higher = more important, determines order
}

function pickActions(profile: Profile): Action[] {
  const ats     = profile?.ats_score           || 0;
  const trust   = profile?.trust_score         || 0;
  const streak  = profile?.mission_streak      || 0;
  const vault   = profile?.vault_count         || 0;
  const recVis  = profile?.recruiter_visibility|| 0;
  const done    = profile?.missions_completed  || 0;
  const intDone = profile?.interviews_done     || 0;

  const candidates: Action[] = [
    // 1. Resume / ATS Optimization
    {
      icon: '📄', color: 'var(--accent)',
      title: ats === 0 ? 'Optimize your resume' : 'Review resume SDE keywords',
      desc: ats === 0
        ? 'Your ATS score is low (0/100). Upload your resume in the Career Builder to identify keyword gaps.'
        : `Your resume is at ${ats}/100. Close missing keyword tags to push your score towards 80+.`,
      href: '/career-builder', cta: 'Go to Resume Builder ➔',
      urgency: ats === 0 ? 95 : ats < 55 ? 75 : 10
    },
    // 2. Mission Streak
    {
      icon: '🔥', color: 'var(--amber)',
      title: streak === 0 ? 'Start your daily mission streak' : 'Keep the streak going',
      desc: streak === 0
        ? 'Complete a daily mission roleplay today to start building your streak. Consistent users get 3x more recruiter views.'
        : `Outstanding! You are on a ${streak}-day daily streak. Complete today's mission to extend it.`,
      href: '/missions', cta: 'Launch Daily Mission ➔',
      urgency: streak === 0 ? 90 : streak < 3 ? 60 : 15
    },
    // 3. Trust Score
    {
      icon: '🛡️', color: 'var(--green)',
      title: trust < 50 ? 'Verify a skill to build trust' : 'Boost your Trust Score further',
      desc: trust < 50
        ? `Your Trust Score is below 50. Pass coding exams or upload certificates to unlock recruiter visibility.`
        : `Your Trust Score is solid at ${Math.round(trust)}/100. Passing another proctored exam keeps it high.`,
      href: '/vault', cta: 'Verify credentials ➔',
      urgency: trust < 50 ? 88 : trust < 70 ? 45 : 8
    },
    // 4. Mock Interviews
    {
      icon: '🎙️', color: 'var(--blue)',
      title: intDone === 0 ? 'Clear your first SDE interview' : 'Schedule mock SDE practice',
      desc: intDone === 0
        ? 'You have not completed any mock interviews. Practice technical/behavioral rounds with Vikram or Priya.'
        : `You have cleared ${intDone} mock rounds. Take an advanced systems design practice session.`,
      href: '/interview', cta: 'Start Mock Interview ➔',
      urgency: intDone === 0 ? 82 : intDone < 3 ? 40 : 12
    },
    // 5. Vault items
    {
      icon: '🗂️', color: 'var(--purple)',
      title: vault === 0 ? 'Upload proof to Evidence Vault' : 'Expand your Vault assets',
      desc: vault === 0
        ? 'Your Vault is empty. Upload project documentation, university degrees, or course certificates.'
        : `You have ${vault} items in your Vault. Add verified assets to showcase on your profile.`,
      href: '/vault', cta: 'Open Evidence Vault ➔',
      urgency: vault === 0 ? 84 : vault < 3 ? 50 : 15
    },
    // 6. Group Discussion Boardroom
    {
      icon: '💬', color: 'var(--teal)',
      title: 'Join System Design debate',
      desc: 'Top-tier roles require strong communication. Join immersive boardroom debates with AI participants.',
      href: '/group-discussion', cta: 'Join Boardroom ➔',
      urgency: done < 3 ? 65 : 10
    }
  ];

  return candidates
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 3);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function WhatToDoToday({ profile }: { profile: Profile | null | undefined }) {
  if (!profile) return null;
  const actions = pickActions(profile);

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)', padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <div style={{ fontSize:10.5, letterSpacing:'0.8px', textTransform:'uppercase', color:'var(--t3)', fontFamily:'var(--font-mono)', fontWeight:600, marginBottom:3 }}>
            What to do today
          </div>
          <div style={{ fontSize:13, color:'var(--t2)' }}>3 actions personalised to your career profile</div>
        </div>
        <Link href="/missions" style={{ fontSize:11, color:'var(--accent)', textDecoration:'none', fontFamily:'var(--font-mono)' }}>
          All missions →
        </Link>
      </div>

      {/* Action cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10 }}>
        {actions.map((action, i) => (
          <Link key={action.href + i} href={action.href} style={{ textDecoration:'none' }}>
            <div style={{
              background: 'var(--bg3)', border: `1.5px solid ${action.color}22`,
              borderRadius: 'var(--radius-lg)', padding: '14px 16px',
              cursor: 'pointer', transition: 'all 0.15s',
              borderLeft: `4px solid ${action.color}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:20 }}>{action.icon}</span>
                <span style={{ fontSize:11.5, fontWeight:700, color:action.color }}>Priority {i+1}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--t1)', marginBottom:5, lineHeight:1.3 }}>
                {action.title}
              </div>
              <div style={{ fontSize:11.5, color:'var(--t2)', lineHeight:1.55, marginBottom:10 }}>
                {action.desc}
              </div>
              <div style={{ fontSize:11.5, fontWeight:700, color:action.color }}>
                {action.cta}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
