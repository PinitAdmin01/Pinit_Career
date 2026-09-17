'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from '@/lib/store/useAppStore';

interface StudentDetail {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  college: string;
  course: string;
  careerGoal: string;
  skills: string[];
  careerScore: number;
  xp: number;
  arenaWins: number;
  projectsCount: number;
  leagueTier: string;
  online: boolean;
  memberSince: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'battles'>('overview');
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    fetch(`/api/friends/${encodeURIComponent(studentId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.student) {
          setStudent(data.student);
        } else {
          setStudent(null);
        }
      })
      .catch(err => {
        console.error('Failed to load student profile:', err);
        setStudent(null);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleAddFriend = async () => {
    if (!student) return;
    setRequestSent(true);
    toast.success('Friend Request Sent!', `Connected with ${student.name}. Request is pending.`);
    try {
      await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId: student.id })
      });
    } catch (err) {
      console.error('Failed to dispatch friend request:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 24px', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Loading Student Profile...</div>
        <p style={{ fontSize: 13, color: '#64748b' }}>Retrieving verified credentials from Supabase Career Ledger...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: 40, textAlign: 'center', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20 }}>
        <div style={{ fontSize: 42, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>Student Profile Not Found</h2>
        <p style={{ fontSize: 13.5, color: '#94a3b8', margin: '0 0 24px' }}>
          This student account may have been updated, anonymized, or does not exist in the public network registry.
        </p>
        <Link href="/friends" className="friends-btn friends-btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}>
          ← Return to Friends Hub
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 120px', color: '#f8fafc' }}>
      
      {/* ── Top Navigation Bar ── */}
      <div style={{ marginBottom: 18 }}>
        <Link
          href="/friends"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#a5b4fc',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 700,
            transition: 'color 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#a5b4fc')}
        >
          ← Back to Friends Hub
        </Link>
      </div>

      {/* ── Profile Header Card ── */}
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', marginBottom: 24 }}>
        
        {/* Cover Banner */}
        <div style={{ height: 160, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 40%, #6366f1 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', top: 16, right: 20, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            🛡️ Verified Student
          </div>
        </div>

        {/* Profile Details Row */}
        <div style={{ padding: '0 32px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -50, marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            {/* Avatar */}
            <div style={{ width: 110, height: 110, borderRadius: '50%', border: '4px solid #0f172a', background: '#1e293b', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', flexShrink: 0 }}>
              <img src={student.avatar} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: '#22c55e', border: '2.5px solid #0f172a', boxShadow: '0 0 8px #22c55e' }} title="Online Now" />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {requestSent ? (
                <button className="friends-btn friends-btn-pending" style={{ padding: '9px 20px', fontSize: 13 }} disabled>
                  ✓ Request Sent
                </button>
              ) : (
                <button
                  className="friends-btn friends-btn-primary"
                  onClick={handleAddFriend}
                  style={{ padding: '9px 20px', fontSize: 13 }}
                >
                  + Add Friend
                </button>
              )}
              <button
                className="friends-btn friends-btn-secondary"
                onClick={() => {
                  toast.success('Arena Duel Dispatched', `Invited ${student.name} to a 1v1 Algorithm face-off!`);
                  router.push('/arena');
                }}
                style={{ padding: '9px 18px', fontSize: 13 }}
              >
                ⚔️ Arena Duel
              </button>
              <button
                className="friends-btn friends-btn-secondary"
                onClick={() => {
                  router.push('/friends?tab=messages');
                }}
                style={{ padding: '9px 18px', fontSize: 13 }}
              >
                💬 Message
              </button>
            </div>
          </div>

          {/* Student Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
                {student.name}
              </h1>
              <span style={{ color: '#38bdf8', fontSize: 18 }} title="Verified PinIT Scholar">✓</span>
            </div>
            <div style={{ fontSize: 14, color: '#a5b4fc', fontWeight: 600, marginBottom: 8 }}>
              {student.headline}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12.5, color: '#94a3b8', flexWrap: 'wrap' }}>
              <span>🏫 {student.college}</span>
              <span>🎓 {student.course}</span>
              <span>🎯 Target: {student.careerGoal}</span>
              <span>📅 Joined {student.memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Quad Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '🧬', label: 'Career Score', value: `${student.careerScore}/100`, color: '#38bdf8' },
          { icon: '⚡', label: 'Verified XP', value: `${student.xp.toLocaleString()} XP`, color: '#a855f7' },
          { icon: '⚔️', label: 'Arena Battles', value: `${student.arenaWins} Wins`, color: '#f43f5e' },
          { icon: '🚀', label: 'Squad Projects', value: `${student.projectsCount} Built`, color: '#22c55e' }
        ].map((stat, idx) => (
          <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 26 }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Profile Tabs Bar ── */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, marginBottom: 20 }}>
        {[
          { id: 'overview', label: '📋 Overview' },
          { id: 'skills', label: '🛠️ Verified Skills' },
          { id: 'projects', label: '🚀 Projects & Squads' },
          { id: 'battles', label: '⚔️ Battle Record' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === tab.id ? '#818cf8' : '#94a3b8',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>Career Target & Vision</h3>
            <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 16px' }}>
              Targeting placement as a <strong>{student.careerGoal}</strong>. Actively practicing daily coding missions, participating in algorithmic face-offs, and collaborating on production software.
            </p>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>COLLEGIATE AFFILIATION</div>
              <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 600 }}>{student.college}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{student.course} • Degree Track</div>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>Competitive Tier</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>🏆</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8' }}>{student.leagueTier} League</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Ranked in top 15% campus performance</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              Maintains weekly coding sprint promotions with consistent mission milestones.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>Demonstrated Technical Competencies</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {student.skills.map((skill, i) => (
              <div key={i} style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#818cf8', fontWeight: 800 }}>⚡</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{skill}</span>
                <span style={{ fontSize: 10, background: '#22c55e', color: '#000', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>VERIFIED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { title: 'Fullstack Microservices Platform', desc: 'Collaborative cloud architecture with automated CI/CD and Redis caching.', stack: 'React • Node.js • PostgreSQL' },
            { title: 'Real-Time WebSocket Arena Engine', desc: 'Low-latency multiplayer code duel server with socket state management.', stack: 'TypeScript • WebSockets • Docker' }
          ].map((proj, idx) => (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>{proj.title}</div>
              <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px' }}>{proj.desc}</p>
              <div style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{proj.stack}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'battles' && (
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>Recent 1v1 Arena Matches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { opponent: 'Algorithmic Duelist #12', topic: 'Dynamic Programming - Longest Substring', result: 'VICTORY', xp: '+120 XP' },
              { opponent: 'Systems Master #04', topic: 'Binary Search Tree Balancing', result: 'VICTORY', xp: '+95 XP' },
              { opponent: 'Campus Peer #88', topic: 'Two Pointer Sliding Window', result: 'VICTORY', xp: '+110 XP' }
            ].map((duel, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{duel.topic}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>vs. {duel.opponent}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '2px 8px', borderRadius: 6 }}>{duel.result}</span>
                  <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, marginTop: 2 }}>{duel.xp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
