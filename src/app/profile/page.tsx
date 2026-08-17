'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import { toast } from '@/lib/store/useAppStore';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import NotificationPreferences from '@/components/ui/NotificationPreferences';
import { ArchetypeId } from '@/lib/career-archetypes';
import { getUserSoundscapeVolume, setUserSoundscapeVolume, startArchetypeSoundscape, stopArchetypeSoundscape } from '@/lib/audio/soundscapes';

const FaceEnroll = dynamic(() => import('@/components/auth/FaceEnroll'), { ssr: false });

// ── Types ───────────────────────────────────────────────────────────────────
interface SocraticQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
}

interface SocraticExamData {
  subject: string;
  questions: SocraticQuestion[];
}

interface AuditLogItem {
  id: string;
  actor_id: string;
  action: string;
  timestamp: string;
  meta?: {
    questTitle?: string;
    title?: string;
    roomTitle?: string;
  };
}

type TimelineCategory = 'Course' | 'Project' | 'Internship' | 'Hackathon' | 'Certification' | 'Award' | 'Placement';

type TabType = 'portfolio' | 'passport' | 'career-dna' | 'analytics' | 'preferences' | 'security' | 'activity';

// ── Styles ──────────────────────────────────────────────────────────────────
const CS = {
  card:      { background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:20, position: 'relative' } as const,
  cardTitle: { fontSize:13, fontWeight:700, marginBottom:8, fontFamily:'var(--font-display)' } as const,
  cardLabel: { fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: 14, display: 'block' } as const,
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  backdropFilter: 'blur(4px)'
};

const modalContentStyle: React.CSSProperties = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: 24,
  width: 500,
  maxWidth: '100%',
  boxShadow: 'var(--shadow-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16
};

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

// ── Shared Sub-components ──────────────────────────────────────────────────────

// 1. MiniLineChart for Analytics Tab
function MiniLineChart({ data, color, height=40 }: { data: number[]; color: string; height?: number }) {
  if (!data || data.length < 2) return <div style={{ height, background:'var(--bg3)', borderRadius:6 }} />;
  const max = Math.max(...data, 1);
  const w = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * w},${height - (v / max) * height}`).join(' ');
  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width:'100%', height }} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} vectorEffect="non-scaling-stroke" />
      <polyline fill={`${color}18`} stroke="none" points={`0,${height} ${pts} 100,${height}`} />
    </svg>
  );
}

// StatCard for Analytics Tab
function StatCard({ icon, label, value, sub, color, trend, href }: {
  icon: string; label: string; value: string|number; sub?: string;
  color: string; trend?: number; href?: string;
}) {
  const cardContent = (
    <div className="score-card card-hover" style={{ cursor: href ? 'pointer' : 'default', padding: '16px 20px' }}>
      <div className="sc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="sc-icon-wrap" style={{ background:`${color}18`, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize:16 }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:6, background: trend>=0?'var(--green-light)':'var(--coral-light)', color: trend>=0?'var(--green)':'var(--coral)' }}>
            {trend>=0?'↑':'↓'}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="sc-label" style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</div>
      <div className="sc-value" style={{ fontSize: 20, fontWeight: 900, marginTop: 4, color: 'var(--t1)' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'var(--t3)', marginTop:3 }}>{sub}</div>}
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration:'none' }}>{cardContent}</Link> : cardContent;
}

// 2. SkillRadarChart for Career DNA
function SkillRadarChart({ profile }: { profile: Record<string, unknown> }) {
  const axes = [
    { label: 'Communication', key: 'communication_score' },
    { label: 'Leadership', key: 'leadership_score' },
    { label: 'Execution', key: 'execution_score' },
    { label: 'Problem Solving', key: 'problem_solving_score' },
    { label: 'Creativity', key: 'creativity_score' },
    { label: 'Adaptability', key: 'adaptability_score' },
    { label: 'Consistency', key: 'consistency_score' },
    { label: 'Collaboration', key: 'collaboration_score' },
    { label: 'Learning Velocity', key: 'learning_velocity_score' },
    { label: 'Strategic Thinking', key: 'strategic_thinking_score' }
  ];

  const size = 260;
  const center = size / 2;
  const maxR = size * 0.32;
  const numAxes = axes.length;

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const bgPolygons = levels.map(level => {
    const r = maxR * level;
    const pts = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  });

  const axisLines = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const outerX = center + maxR * Math.cos(angle);
    const outerY = center + maxR * Math.sin(angle);
    const labelX = center + (maxR + 18) * Math.cos(angle);
    const labelY = center + (maxR + 12) * Math.sin(angle);

    return {
      x1: center,
      y1: center,
      x2: outerX,
      y2: outerY,
      labelX,
      labelY,
      label: axis.label,
      align: (Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle') as 'start' | 'end' | 'middle'
    };
  });

  const dataPoints = axes.map((axis, i) => {
    const score = Math.round((profile[axis.key] as number) || 40);
    const r = maxR * (score / 100);
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {bgPolygons.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="var(--border)" strokeWidth={1} />
        ))}
        {axisLines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="var(--border2)" strokeWidth={1} />
        ))}
        {axisLines.map((line, i) => (
          <text key={i} x={line.labelX} y={line.labelY} fill="var(--t3)" fontSize={7.5} fontFamily="var(--font-mono)" textAnchor={line.align} dominantBaseline="middle" fontWeight={600}>
            {line.label}
          </text>
        ))}
        <polygon points={dataPoints} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={2} style={{ transition: 'all 0.5s ease-in-out' }} />
        {axes.map((axis, i) => {
          const score = Math.round((profile[axis.key] as number) || 40);
          const r = maxR * (score / 100);
          const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle key={i} cx={x} cy={y} r={3} fill="var(--accent)" stroke="var(--bg2)" strokeWidth={1} style={{ transition: 'all 0.5s ease-in-out' }} />
          );
        })}
      </svg>
    </div>
  );
}

// Weekly velocity heatmap for Career DNA
function WeeklyVelocityHeatmap({ completedQuests = [], completedMissions = [], themeColor }: { completedQuests?: string[], completedMissions?: string[], themeColor: string }) {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const totalActivity = (completedQuests || []).length * 3 + (completedMissions || []).length;
  
  const grid = Array.from({ length: 7 }, (_, dayIndex) => {
    return Array.from({ length: 4 }, (_, weekIndex) => {
      const val = (dayIndex * 3 + weekIndex * 7 + totalActivity) % 11;
      return val > 8 ? 3 : val > 5 ? 2 : val > 2 ? 1 : 0;
    });
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 3: return themeColor;
      case 2: return `${themeColor}cc`;
      case 1: return `${themeColor}66`;
      default: return 'var(--bg3)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Evolution Velocity Heatmap
          </span>
          <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>Weekly activity metrics & quest completion density</div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          <span>Less</span>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--bg3)', border: '1px solid var(--border)' }} />
          <span style={{ width: 8, height: 8, borderRadius: 2, background: `${themeColor}66` }} />
          <span style={{ width: 8, height: 8, borderRadius: 2, background: `${themeColor}cc` }} />
          <span style={{ width: 8, height: 8, borderRadius: 2, background: themeColor }} />
          <span>More</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'right', width: 28 }}>
          {DAYS.map((day, i) => (
            <div key={i} style={{ height: 12, lineHeight: '12px' }}>{i % 2 === 0 ? day : ''}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {WEEKS.map((_, weekIdx) => (
            <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const level = grid[dayIdx][weekIdx];
                return (
                  <div key={dayIdx} style={{ width: 12, height: 12, borderRadius: 2, background: getLevelColor(level), border: level === 0 ? '1px solid var(--border)' : 'none' }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Profile Main Component ────────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <ProfilePageInner />
    </Suspense>
  );
}

function ProfilePageInner() {
  const { user, logout } = useAuth();
  const cOS              = useCareerOS();
  const router           = useRouter();
  const searchParams     = useSearchParams();
  const qc               = useQueryClient();

  const [teacherId,   setTeacherId]   = useState(user?.selectedTeacherId || 'priya');
  const [visibility,  setVisibility]  = useState('recruiters_only');
  const [saving,      setSaving]      = useState(false);

  // Focus Audio Soundscape Volume State
  const [soundscapeVol, setSoundscapeVol] = useState<number>(50);
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false);

  useEffect(() => {
    setSoundscapeVol(getUserSoundscapeVolume());
  }, []);

  // Consolidated Tabs: 'portfolio' | 'passport' | 'career-dna' | 'analytics' | 'preferences' | 'security' | 'activity'
  const [tab, setTab] = useState<TabType>('portfolio');

  // Read URL search param 'tab' to set active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType | null;
    const validTabs: TabType[] = ['portfolio', 'passport', 'career-dna', 'analytics', 'preferences', 'security', 'activity'];
    if (tabParam && validTabs.includes(tabParam)) {
      setTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (nextTab: typeof tab) => {
    setTab(nextTab);
    router.replace(`/profile?tab=${nextTab}`);
  };

  // 1. Portfolio States & Logic
  const [activePortfolioRole, setActivePortfolioRole] = useState<'student' | 'recruiter' | 'faculty' | 'parent'>('student');
  const [activePortfolioTab, setActivePortfolioTab] = useState<string>('Profile');

  // Document Upload & Socratic Exam States
  const [docTitle, setDocTitle] = useState('');
  const [docIssuer, setDocIssuer] = useState('');
  const [docCategory, setDocCategory] = useState('Course Certificate');
  const [uploading, setUploading] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [examData, setExamData] = useState<SocraticExamData | null>(null);
  const [attempts, setAttempts] = useState(3);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examFeedback, setExamFeedback] = useState('');
  const [examDone, setExamDone] = useState(false);

  const [pitch, setPitch] = useState("Add a short professional pitch about your skills and goals.");
  const [projects, setProjects] = useState<Array<{ id: string; title: string; description: string; tech: string[]; verified: boolean }>>([]);
  const [certificates, setCertificates] = useState<Array<{ id: string; title: string; issuer: string; verified: boolean }>>([]);
  const [researchPapers, setResearchPapers] = useState<Array<{ id: string; title: string; journal: string; verified: boolean }>>([]);
  const [achievements] = useState<Array<{ id: string; title: string; detail: string }>>([]);
  const [recommendations] = useState<Array<{ id: string; author: string; text: string }>>([]);
  const [timeline, setTimeline] = useState<Array<{ id: string; year: string; category: TimelineCategory; title: string; detail: string; verified: boolean }>>([]);
  const [editingPitch, setEditingPitch] = useState(false);
  const [tempPitch, setTempPitch] = useState(pitch);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newEvtYear, setNewEvtYear] = useState('2026');
  const [newEvtCategory, setNewEvtCategory] = useState<TimelineCategory>('Course');
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDetail, setNewEvtDetail] = useState('');

  const savePitch = () => {
    setPitch(tempPitch);
    setEditingPitch(false);
    toast.success('Pitch Updated', 'Your profile pitch has been updated instantly.');
  };
  const addProject = () => {
    if (!newProjTitle || !newProjDesc) return;
    const newProj = { id: `p_${Date.now()}`, title: newProjTitle, description: newProjDesc, tech: newProjTech.split(',').map(t => t.trim()).filter(Boolean), verified: false };
    setProjects(prev => [...prev, newProj]);
    setNewProjTitle(''); setNewProjDesc(''); setNewProjTech('');
    toast.success('Project Pitch Saved', 'Your project has been added. Pending faculty verification.');
  };
  const addTimelineEvent = () => {
    if (!newEvtTitle || !newEvtDetail) return;
    const newEvt = { id: `t_evt_${Date.now()}`, year: newEvtYear, category: newEvtCategory, title: newEvtTitle, detail: newEvtDetail, verified: false };
    setTimeline(prev => [newEvt, ...prev]);
    setNewEvtTitle(''); setNewEvtDetail('');
    toast.success('Event Added', 'Achievement event added to timeline. Pending faculty verification.');
  };
  const toggleVerification = (type: 'project' | 'certificate' | 'research' | 'timeline', id: string) => {
    if (type === 'project') setProjects(prev => prev.map(p => p.id === id ? { ...p, verified: !p.verified } : p));
    else if (type === 'certificate') setCertificates(prev => prev.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
    else if (type === 'research') setResearchPapers(prev => prev.map(r => r.id === id ? { ...r, verified: !r.verified } : r));
    else if (type === 'timeline') setTimeline(prev => prev.map(t => t.id === id ? { ...t, verified: !t.verified } : t));
    toast.success('Verification status updated');
  };

  const handleUploadDocument = async () => {
    if (!docTitle.trim() || !docIssuer.trim()) {
      toast.error('Missing Details', 'Please fill in the document title and issuer.');
      return;
    }

    const totalActivity = (cOS.completedMissions?.length || 0) + (cOS.completedQuests?.length || 0);
    const hasTag = totalActivity >= 1;
    if (!hasTag) {
      toast.error('Student Tag Locked', 'You must complete at least 1 Coding Mission or Quest to earn the Student Tag before uploading.');
      return;
    }

    if (docCategory !== 'Course Certificate') {
      // Direct upload
      const newCert = { id: `c_${Date.now()}`, title: docTitle, issuer: docIssuer, verified: false };
      setCertificates(prev => [...prev, newCert]);

      const newEvt = {
        id: `t_evt_${Date.now()}`,
        year: '2026',
        category: docCategory as TimelineCategory,
        title: docTitle,
        detail: `Uploaded portfolio credential issued by ${docIssuer}.`,
        verified: false
      };
      setTimeline(prev => [newEvt, ...prev]);

      toast.success('Document Uploaded', 'Document added to your portfolio. Pending faculty verification.');
      setDocTitle('');
      setDocIssuer('');
      return;
    }

    // Category is Course Certificate: trigger Socratic Exam flow
    setUploading(true);
    try {
      const res = await fetch('/api/portfolio/analyze-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: docTitle, issuer: docIssuer })
      });
      if (!res.ok) throw new Error('Failed to analyze certificate.');
      const data = await res.json();
      setExamData(data);
      setAttempts(3);
      setSelectedAnswers({});
      setExamFeedback('');
      setExamDone(false);
      setShowExamModal(true);
      toast.success('Exam Generated', 'Socratic verification exam generated based on certificate contents!');
    } catch (e: any) {
      toast.error('Upload Error', e.message || 'Failed to start AI analysis.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitExam = async () => {
    if (!examData || !examData.questions || examData.questions.length === 0) return;
    
    const totalQ = examData.questions.length;
    if (Object.keys(selectedAnswers).length < totalQ) {
      setExamFeedback(`⚠️ Please answer all ${totalQ} questions before submitting.`);
      return;
    }

    let correct = 0;
    examData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIdx) {
        correct++;
      }
    });

    const passed = correct >= Math.ceil(totalQ * 0.6);
    const currentTrust = user?.trustScore ?? 70;
    const currentDna = user?.careerDnaScore ?? 65;

    if (passed) {
      const newTrust = Math.min(99, currentTrust + 10);
      const newDna = Math.min(99, currentDna + 5);

      try {
        await api.post('/api/auth/profile', { trust_score: newTrust, career_dna_score: newDna });
      } catch (err) {
        console.error('Failed to update scores in DB:', err);
      }

      setCertificates(prev => [...prev, { id: `c_${Date.now()}`, title: docTitle, issuer: docIssuer, verified: true }]);
      setTimeline(prev => [
        {
          id: `t_evt_${Date.now()}`,
          year: '2026',
          category: 'Course',
          title: docTitle,
          detail: `Passed Socratic verification exam (${correct}/${totalQ}) for course by ${docIssuer}.`,
          verified: true
        },
        ...prev
      ]);

      setExamFeedback(`🎉 PASS! You scored ${correct}/${totalQ}. Credential verified successfully!\nTrust Score increased to ${newTrust} (+10).\nCareer DNA increased to ${newDna} (+5).`);
      setExamDone(true);
      toast.success('Exam Passed!', 'Your certificate is verified and scores have increased.');
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      const penaltyTrust = Math.max(0, currentTrust - 2);
      try {
        await api.post('/api/auth/profile', { trust_score: penaltyTrust });
      } catch (err) {
        console.error('Failed to update penalty in DB:', err);
      }

      if (newAttempts > 0) {
        setExamFeedback(`❌ Verification failed (Scored ${correct}/${totalQ}). You have ${newAttempts} attempts left.\nA penalty of -2 points has been applied to your Trust Score.`);
      } else {
        const finalTrust = Math.max(0, currentTrust - 10);
        try {
          await api.post('/api/auth/profile', { trust_score: finalTrust });
        } catch (err) {
          console.error('Failed to update final penalty in DB:', err);
        }

        setCertificates(prev => [...prev, { id: `c_${Date.now()}`, title: docTitle, issuer: docIssuer, verified: false }]);
        setTimeline(prev => [
          {
            id: `t_evt_${Date.now()}`,
            year: '2026',
            category: 'Course',
            title: docTitle,
            detail: `Failed Socratic verification attempts (0/3 remaining) for course by ${docIssuer}.`,
            verified: false
          },
          ...prev
        ]);

        setExamFeedback(`❌ Failed all attempts. Certificate added as unverified.\nA penalty of -10 has been applied to your Trust Score (New Trust Score: ${finalTrust}).`);
        setExamDone(true);
        toast.error('Verification Failed', 'All attempts exhausted. Trust Score penalized.');
      }
    }
  };

  // 2. Skill Passport States & Logic
  const [activePassportRole, setActivePassportRole] = useState<'student' | 'recruiter' | 'faculty'>('student');
  const [activePassportTab, setActivePassportTab] = useState<string>('Overview');
  const [passportSkills, setPassportSkills] = useState<Array<{ id: string; name: string; level: 1|2|3; evidence: string; recency: string; verified: boolean; category: string }>>([
    { id: 'sk1', name: 'TypeScript', level: 3, evidence: 'Completed Stripe Internship queue optimization deliverables.', recency: '2 days ago', verified: true, category: 'Industry' },
    { id: 'sk2', name: 'Web Cryptography', level: 2, evidence: 'Verified project code repository "Zero-Knowledge Vault".', recency: '1 day ago', verified: true, category: 'Implementation' },
    { id: 'sk3', name: 'Dynamic Programming', level: 1, evidence: 'Completed 30 days of Advanced DSA Quests.', recency: 'Yesterday', verified: true, category: 'Programming' },
    { id: 'sk4', name: 'Systems Scaling Design', level: 2, evidence: 'Passed Whiteboard Socratic Interview in Round 3.', recency: '3 days ago', verified: false, category: 'Theory' },
    { id: 'sk5', name: 'Socratic Communication', level: 3, evidence: 'Speech telemetry scoring in Round 4 behavioral mock.', recency: 'Yesterday', verified: true, category: 'Communication' }
  ]);
  const [skillsInProgress] = useState([
    { name: 'Go Lang', progress: 45, nextGoal: 'Complete Level 1 Quest' },
    { name: 'Docker Orchestration', progress: 60, nextGoal: 'Obtain AWS Certificate Verification' }
  ]);
  const [assessmentHistory] = useState([
    { date: 'Yesterday', type: 'Mock Interview (Round 4)', score: '90%', result: 'Level 3 Comms Verified' },
    { date: '2 days ago', type: 'Coding Challenge (Round 2)', score: '82%', result: 'Level 1 Syntax Approved' },
    { date: '3 days ago', type: 'Theory Exam (LMS)', score: '88%', result: 'Theory Verified' }
  ]);
  const toggleEndorsement = (id: string) => {
    setPassportSkills(prev => prev.map(s => s.id === id ? { ...s, verified: !s.verified, level: !s.verified ? 3 : 2 } : s));
    toast.success('Skill Endorsement updated', 'Student skill passport credentials updated instantly.');
  };

  // 3. Analytics Queries
  interface AnalyticsDashboardData {
    scores?: {
      ats_score?: number;
      career_dna_score?: number;
      trust_score?: number;
      recruiter_visibility?: number;
      mission_streak?: number;
      career_readiness?: number;
    };
    missions?: {
      completed?: number;
      pending?: number;
      failed?: number;
      total?: number;
    };
    exams?: {
      total?: number;
      avg_pct?: number;
      pass_rate?: number;
      gold?: number;
      silver?: number;
      bronze?: number;
    };
    interviews?: {
      total?: number;
    };
    score_history?: Array<{
      ats?: number;
      dna?: number;
      trust?: number;
    }>;
  }

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery<AnalyticsDashboardData>({
    queryKey: ['analytics','dashboard'],
    queryFn:  () => api.get<AnalyticsDashboardData>('/api/analytics/dashboard'),
    staleTime: 2 * 60 * 1000,
  });

  const s  = analyticsData?.scores     || {};
  const m  = analyticsData?.missions   || {};
  const ex = analyticsData?.exams      || {};
  const iv = analyticsData?.interviews || {};

  const historyAts   = analyticsData?.score_history?.map((h) => h.ats   || 0) || [0, s.ats_score   || 0];
  const historyDna   = analyticsData?.score_history?.map((h) => h.dna   || 0) || [0, s.career_dna_score || 0];
  const historyTrust = analyticsData?.score_history?.map((h) => h.trust || 0) || [0, s.trust_score  || 0];

  const STATS = [
    { icon:'🎯', label:'ATS Score',          value:Math.round(s.ats_score||0),             color:'var(--teal)' },
    { icon:'🧬', label:'Career DNA',         value:Math.round(s.career_dna_score||0),      color:'var(--purple)' },
    { icon:'🛡', label:'Trust Score',        value:Math.round(s.trust_score||0),           color:'var(--green)' },
    { icon:'📡', label:'Recruiter Rank',     value:Math.round(s.recruiter_visibility||0),  color:'var(--amber)' },
    { icon:'🔥', label:'Day Streak',         value:s.mission_streak||0,                    color:'var(--coral)'  },
    { icon:'⚡', label:'Missions Done',      value:m.completed||0,                         color:'var(--accent)' },
    { icon:'📋', label:'Exams Taken',        value:ex.total||0,                            color:'var(--blue)' },
    { icon:'📊', label:'Avg Exam Score',     value:`${Math.round(ex.avg_pct||0)}%`,        color:'var(--teal)'   },
    { icon:'🎙', label:'Interviews Done',    value:iv.total||0,                            color:'var(--purple)' },
    { icon:'🏆', label:'Career Readiness',   value:`${Math.round(s.career_readiness||0)}/100`, color:'var(--green)' },
  ];

  // 4. Activity States
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  useEffect(() => {
    if (tab === 'activity' && user) {
      (async () => {
        try {
          const res = await api.get<{ log: AuditLogItem[] }>('/api/admin/audit-log');
          const userLogs = (res.log || []).filter((l) => l.actor_id === user.id);
          setAuditLogs(userLogs);
        } catch (err) {
          console.warn("Failed to fetch user activity logs", err);
        } finally {
          setIsActivityLoading(false);
        }
      })();
    }
  }, [tab, user]);

  if (!user) return null;
  const initials = (user.displayName || 'U')[0].toUpperCase();

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
      toast.success('Saved!', 'Visibility updated.');
    } catch (err) {
      toast.error('Save failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 60 }}>
      {/* Top Banner Profile Summary */}
      <div style={{ background:'linear-gradient(135deg,var(--bg2),var(--bg3))', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'24px 28px', marginBottom:20, display:'flex', gap:20, alignItems:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#fff', flexShrink:0, fontFamily:'var(--font-display)' }}>
          {initials}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'var(--t1)', marginBottom:3 }}>{user.displayName}</div>
          <div style={{ fontSize:12, color:'var(--t3)', fontFamily:'var(--font-mono)', marginBottom:8 }}>{user.username}</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:10, padding:'2px 10px', borderRadius:100, background:'var(--accent-light)', color:'var(--accent)', border:'1px solid var(--accent)', fontWeight:700, fontFamily:'var(--font-mono)', textTransform:'capitalize' }}>
              {user.role}
            </span>
            <span style={{ fontSize:10, padding:'2px 10px', borderRadius:100, background:'var(--bg3)', color:'var(--t3)', border:'1px solid var(--border)', fontFamily:'var(--font-mono)' }}>
              {user.subscription_tier || 'free'} plan
            </span>
          </div>
        </div>
        <Link href="/pricing" style={{ textDecoration:'none', flexShrink:0 }}>
          <button className="btn-ghost btn-sm">⭐ Upgrade</button>
        </Link>
      </div>

      {/* Main Consolidated Tabs Menu */}
      <div style={{ display:'flex', gap:4, background:'var(--bg3)', padding:4, borderRadius:'var(--radius)', border:'1px solid var(--border)', marginBottom:24, overflowX: 'auto', width:'100%', scrollbarWidth: 'none' }}>
        {[
          { id: 'portfolio', label: '👤 Portfolio' },
          { id: 'passport', label: '🎫 Skill Passport' },
          { id: 'career-dna', label: '🧬 Career DNA' },
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'preferences', label: '⚙️ Preferences' },
          { id: 'security', label: '🔒 Security' },
          { id: 'activity', label: '📜 Activity History' }
        ].map(t => (
          <button key={t.id} onClick={() => handleTabChange(t.id as TabType)} style={{
            padding:'8px 16px', border:'none', borderRadius:'var(--radius)', cursor:'pointer',
            fontSize:12.5, fontWeight:600, fontFamily:'var(--font-display)', whiteSpace: 'nowrap',
            background: tab === t.id ? 'var(--bg2)'  : 'transparent',
            color:      tab === t.id ? 'var(--t1)'   : 'var(--t3)',
            boxShadow:  tab === t.id ? 'var(--shadow-sm)' : 'none',
            transition:'all 0.15s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* ────────────────── SUB-TABS RENDERERS ────────────────── */}

      {/* A. PORTFOLIO SUB-TAB */}
      {tab === 'portfolio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>🔧 PORTFOLIO PERSPECTIVE SWITCH:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'student', label: '🧑‍🎓 Student Portal' },
                { id: 'recruiter', label: '🏢 Recruiter View' },
                { id: 'faculty', label: '👩‍🏫 Faculty Desk' },
                { id: 'parent', label: '👪 Parent Portal' }
              ].map(role => (
                <button key={role.id} onClick={() => setActivePortfolioRole(role.id as any)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: activePortfolioRole === role.id ? 'var(--accent)' : 'transparent', color: activePortfolioRole === role.id ? '#fff' : 'var(--t3)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{role.label}</button>
              ))}
            </div>
          </div>

          {activePortfolioRole === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg2)', padding: 8, borderRadius: 14, border: '1px solid var(--border)' }}>
                {['Profile', 'Resume', 'Projects', 'Certificates', 'Internships', 'Achievements', 'GitHub', 'Research', 'Recommendations', 'Timeline'].map(t => (
                  <button key={t} onClick={() => setActivePortfolioTab(t)} style={{ textAlign: 'left', padding: '8px 12px', border: 'none', borderRadius: 8, background: activePortfolioTab === t ? 'var(--accent-light)' : 'transparent', color: activePortfolioTab === t ? 'var(--accent)' : 'var(--t2)', fontSize: 12.5, fontWeight: activePortfolioTab === t ? 800 : 500, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>

              <div style={CS.card}>
                {activePortfolioTab === 'Profile' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Core Professional Pitch</span>
                        <button onClick={() => setEditingPitch(!editingPitch)} style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--accent)', cursor: 'pointer' }}>{editingPitch ? 'Cancel' : 'Edit Pitch'}</button>
                      </div>
                      {editingPitch ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <textarea value={tempPitch} onChange={e => setTempPitch(e.target.value)} rows={3} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: 'var(--t1)', fontSize: 13, resize: 'vertical' }} />
                          <button onClick={savePitch} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Save Pitch</button>
                        </div>
                      ) : (
                        <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>"{pitch}"</p>
                      )}
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800 }}>🧬 Career DNA Snapshot</h3>
                        <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}>Verified ATS rating: <strong>85/100</strong></div>
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 800 }}>🏆 Last Verified Accomplishment</h3>
                        <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}>{achievements[0]?.title || 'None'}</div>
                      </div>
                    </div>
                    
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

                    {/* Document Upload Center & Student Tag Status */}
                    {(() => {
                      const totalActivity = (cOS.completedMissions?.length || 0) + (cOS.completedQuests?.length || 0);
                      const hasTag = totalActivity >= 1;
                      return (
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>📄 Document Upload Center</h3>
                              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Upload course certificates, internship offer letters, or project files.</p>
                            </div>
                            <span style={{
                              fontSize: 10.5,
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: 20,
                              background: hasTag ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)',
                              color: hasTag ? 'var(--green)' : 'var(--coral)',
                              border: `1px solid ${hasTag ? 'rgba(5,150,105,0.2)' : 'rgba(239,68,68,0.2)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5
                            }}>
                              {hasTag ? '🎓 STUDENT TAG: ACTIVE' : '🔒 NO STUDENT TAG'}
                            </span>
                          </div>

                          {!hasTag && (
                            <div style={{
                              padding: '10px 14px',
                              borderRadius: 10,
                              background: 'rgba(239,68,68,0.04)',
                              border: '1px solid rgba(239,68,68,0.15)',
                              fontSize: 12,
                              color: 'var(--t2)',
                              lineHeight: 1.5
                            }}>
                              ⚠️ <strong>Upload Restriction</strong>: Portfolio uploads require a **Student Tag**. Complete at least **1 Daily Mission or Quest** from the sidebar to activate your student tag and unlock uploads.
                            </div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Document Category</label>
                              <select 
                                value={docCategory} 
                                onChange={e => setDocCategory(e.target.value)} 
                                disabled={!hasTag}
                                style={{
                                  background: 'var(--bg2)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 8,
                                  padding: 8,
                                  color: 'var(--t1)',
                                  fontSize: 12.5,
                                  outline: 'none'
                                }}
                              >
                                <option value="Course Certificate">🎓 Course Certificate (Requires Socratic Exam)</option>
                                <option value="Project Document">📂 Project Technical Document</option>
                                <option value="Internship Offer / Letter">🏢 Internship PPO / Offer Letter</option>
                                <option value="Other Academic Cert">📜 Other Academic Certificate</option>
                              </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Document Title</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Advanced React & Redux Specialization" 
                                value={docTitle} 
                                onChange={e => setDocTitle(e.target.value)} 
                                disabled={!hasTag}
                                style={{
                                  background: 'var(--bg2)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 8,
                                  padding: 8,
                                  color: 'var(--t1)',
                                  fontSize: 12.5,
                                  outline: 'none'
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Issuing Authority</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Coursera / Google" 
                                value={docIssuer} 
                                onChange={e => setDocIssuer(e.target.value)} 
                                disabled={!hasTag}
                                style={{
                                  background: 'var(--bg2)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 8,
                                  padding: 8,
                                  color: 'var(--t1)',
                                  fontSize: 12.5,
                                  outline: 'none'
                                }}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Select Verification Proof File</label>
                              <div style={{
                                border: '1px dashed var(--border)',
                                borderRadius: 8,
                                background: 'var(--bg2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                fontSize: 12,
                                color: 'var(--t3)',
                                opacity: hasTag ? 1 : 0.6
                              }}>
                                📁 <span>Click to select PDF or image proof</span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={handleUploadDocument} 
                            disabled={!hasTag || uploading}
                            className="btn-primary" 
                            style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            {uploading ? '⏳ Analyzing Credentials...' : 'Upload & Verify Credentials ✓'}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {activePortfolioTab === 'Resume' && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>📄</span>
                    <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 16 }}>Your resume is currently up to date with verified portfolio credentials.</p>
                    <button onClick={() => toast.success('Starting Assembly', 'Generating verified resume PDF...')} style={{ padding: '8px 20px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Download Official Resume</button>
                  </div>
                )}

                {activePortfolioTab === 'Projects' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {projects.map(p => (
                        <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>{p.title}</h4>
                            <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: p.verified ? 'var(--green-light)' : 'rgba(255,255,255,0.02)', color: p.verified ? 'var(--green)' : 'var(--t3)' }}>{p.verified ? '✓ Verified' : 'Pending Verification'}</span>
                          </div>
                          <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '0 0 10px 0', lineHeight: 1.5 }}>{p.description}</p>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {p.tech.map(t => (
                              <span key={t} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: 'var(--bg2)', color: 'var(--t3)' }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: 13.5, fontWeight: 800 }}>Pitch New Code Project</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <input type="text" placeholder="Project Name" value={newProjTitle} onChange={e => setNewProjTitle(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }} />
                        <textarea placeholder="Technical scope, problems solved..." value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)} rows={3} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }} />
                        <input type="text" placeholder="Tech Stack (comma separated)" value={newProjTech} onChange={e => setNewProjTech(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }} />
                        <button onClick={addProject} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Add Project for Verification</button>
                      </div>
                    </div>
                  </div>
                )}

                {activePortfolioTab === 'Certificates' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Credentials</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {certificates.map(c => (
                        <div key={c.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{c.title}</h4>
                            <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>Issuer: {c.issuer}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: c.verified ? 'var(--green)' : 'var(--amber)' }}>{c.verified ? '✓ Verified' : 'Awaiting Audit'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePortfolioTab === 'Internships' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Internships</h3>
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 13.5, fontWeight: 800 }}>Stripe Security</h4>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>Software Engineering Intern · 2026</div>
                      <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0 }}>Worked on transaction queue billing ledger systems.</p>
                    </div>
                  </div>
                )}

                {activePortfolioTab === 'Achievements' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Honors & Awards</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {achievements.map(a => (
                        <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 20 }}>🏆</span>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{a.title}</h4>
                            <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{a.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePortfolioTab === 'GitHub' && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🐙</span>
                    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>Connect your GitHub profile</div>
                    <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0 }}>No repository linked yet. Sync commits after connecting an account.</p>
                  </div>
                )}

                {activePortfolioTab === 'Research' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Scientific Papers & Preprints</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {researchPapers.map(r => (
                        <div key={r.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 800 }}>{r.title}</h4>
                          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--t3)' }}>
                            <span>Journal: {r.journal}</span>
                            <span style={{ color: r.verified ? 'var(--green)' : 'var(--amber)' }}>{r.verified ? '✓ Verified' : 'Awaiting Audit'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePortfolioTab === 'Recommendations' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Endorsements from Mentors</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {recommendations.map(rec => (
                        <div key={rec.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                          <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--accent)', marginBottom: 6 }}>{rec.author}</div>
                          <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>"{rec.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePortfolioTab === 'Timeline' && (
                  <div>
                    {/* Course Learning Outcome (CLO) Competency Matrix (Moodle-inspired) */}
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Moodle Competency Framework</span>
                          <h4 style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 800 }}>Course Learning Outcome (CLO) Competency Matrix</h4>
                        </div>
                        <span style={{ fontSize: 10.5, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                          Accredited Matrix
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                          { code: 'CLO-101', name: 'Data Structure & Algorithmic Crisis Recovery', mastery: 92, evidence: 'Socratic Quest #4 + WASM Sandbox' },
                          { code: 'CLO-102', name: 'System Architecture & Concurrency Design', mastery: 85, evidence: 'GitHub AST Hash PIN-GH-9021' },
                          { code: 'CLO-103', name: 'Technical Presentation & Verbal Alignment', mastery: 88, evidence: '4-Round AI Interview Round 3' }
                        ].map((clo, idx) => (
                          <div key={idx} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t1)' }}>{clo.code}: {clo.name}</span>
                              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{clo.mastery}% Mastery</span>
                            </div>
                            <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden', marginBottom: 6 }}>
                              <div style={{ width: `${clo.mastery}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 3 }} />
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--t3)' }}>Verified Evidence: {clo.evidence}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 900 }}>Progression Timeline</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '2px solid var(--border)', paddingLeft: 16, marginLeft: 10, position: 'relative' }}>
                      {timeline.map(evt => (
                        <div key={evt.id} style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 4, left: -22, width: 10, height: 10, borderRadius: '50%', background: evt.verified ? 'var(--green)' : 'var(--amber)' }} />
                          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>{evt.year} · {evt.category}</span>
                            <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: evt.verified ? 'var(--green-light)' : 'var(--amber-light)', color: evt.verified ? 'var(--green)' : 'var(--amber)' }}>{evt.verified ? 'Verified ✓' : 'Pending'}</span>
                          </div>
                          <h4 style={{ margin: '2px 0 4px 0', fontSize: 13, fontWeight: 700 }}>{evt.title}</h4>
                          <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{evt.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: 13.5, fontWeight: 800 }}>Add Timeline Achievement</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, marginBottom: 10 }}>
                        <input type="text" placeholder="Year" value={newEvtYear} onChange={e => setNewEvtYear(e.target.value)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }} />
                        <select value={newEvtCategory} onChange={e => setNewEvtCategory(e.target.value as TimelineCategory)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }}>
                          {['Course', 'Project', 'Internship', 'Hackathon', 'Certification', 'Award', 'Placement'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <input type="text" placeholder="Event Title" value={newEvtTitle} onChange={e => setNewEvtTitle(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }} />
                        <textarea placeholder="Event Details..." value={newEvtDetail} onChange={e => setNewEvtDetail(e.target.value)} rows={2} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }} />
                        <button onClick={addTimelineEvent} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Add Event</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePortfolioRole === 'recruiter' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={CS.card}>
                  <div style={CS.cardLabel}>Dossier Core Professional Pitch</div>
                  <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>"{pitch}"</p>
                </div>
                <div style={CS.card}>
                  <div style={CS.cardLabel}>Verified Projects Portfolio</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {projects.filter(p => p.verified).map(p => (
                      <div key={p.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800 }}>{p.title}</h4>
                        <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '6px 0 10px' }}>{p.description}</p>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {p.tech.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg2)' }}>{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={CS.card}>
                <div style={CS.cardLabel}>Verified Accreditations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {certificates.filter(c => c.verified).map(c => (
                    <div key={c.id} style={{ background: 'var(--bg3)', padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
                      <strong>{c.title}</strong>
                      <div style={{ fontSize: 11, color: 'var(--t3)' }}>{c.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePortfolioRole === 'faculty' && (
            <div style={CS.card}>
              <div style={CS.cardLabel}>Student Portfolio Verifications Board</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--t3)', margin: '0 0 10px' }}>Projects pending validation:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {projects.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10 }}>
                        <div>
                          <strong style={{ fontSize: 13 }}>{p.title}</strong>
                          <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{p.tech.join(', ')}</div>
                        </div>
                        <button onClick={() => toggleVerification('project', p.id)} style={{ padding: '6px 12px', fontSize: 10.5, fontWeight: 800, background: p.verified ? 'var(--coral)' : 'var(--green)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                          {p.verified ? 'Revoke Verify' : 'Verify Project'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePortfolioRole === 'parent' && (
            <div style={CS.card}>
              <div style={CS.cardLabel}>Verified Academic Progress Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {timeline.filter(t => t.verified).map(evt => (
                  <div key={evt.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>{evt.year} &middot; {evt.category}</span>
                    <h4 style={{ margin: '2px 0', fontSize: 13 }}>{evt.title}</h4>
                    <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{evt.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* B. SKILL PASSPORT SUB-TAB */}
      {tab === 'passport' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>🎫 PASSPORT PERSPECTIVE SWITCH:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['student', 'recruiter', 'faculty'].map(role => (
                <button key={role} onClick={() => setActivePassportRole(role as any)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: activePassportRole === role ? 'var(--accent)' : 'transparent', color: activePassportRole === role ? '#fff' : 'var(--t3)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {role === 'student' ? '🧑‍🎓 Student' : role === 'recruiter' ? '🔍 Recruiter' : '👩‍🏫 Faculty'}
                </button>
              ))}
            </div>
          </div>

          {activePassportRole === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg2)', padding: 8, borderRadius: 14, border: '1px solid var(--border)' }}>
                {['Overview', 'Verified Skills', 'Skills in Progress', 'Assessment History', 'Verification Levels'].map(t => (
                  <button key={t} onClick={() => setActivePassportTab(t)} style={{ textAlign: 'left', padding: '8px 12px', border: 'none', borderRadius: 8, background: activePassportTab === t ? 'var(--accent-light)' : 'transparent', color: activePassportTab === t ? 'var(--accent)' : 'var(--t2)', fontSize: 12.5, fontWeight: activePassportTab === t ? 800 : 500, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>

              <div style={CS.card}>
                {activePassportTab === 'Overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 16, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 24 }}>🧠</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--accent)', marginBottom: 4 }}>PinIT AI Skill Validation Engine</div>
                        <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                          Skill Passport credentials update automatically from your activities:<br />
                          • <strong>Quests</strong> verify syntax levels.<br />
                          • <strong>Interviews</strong> verify communication & depth.<br />
                          • <strong>Projects</strong> verify practical implementation.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>My Skill Blueprint</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {passportSkills.map(s => (
                          <div key={s.name} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <span style={{ fontSize: 11, background: 'var(--bg3)', padding: '3px 8px', borderRadius: 6, color: 'var(--t3)' }}>{s.category}</span>
                              <span style={{ fontSize: 11, background: 'var(--accent-light)', padding: '3px 8px', borderRadius: 6, color: 'var(--accent)', fontWeight: 800 }}>Level {s.level}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePassportTab === 'Verified Skills' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Verified Credentials Directory</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {passportSkills.filter(s => s.verified).map(s => (
                        <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 800 }}>{s.name}</span>
                            <span style={{ fontSize: 11, background: 'var(--green-light)', color: 'var(--green)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>Level {s.level} Verified ✓</span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 8px 0', lineHeight: 1.4 }}><strong>Evidence:</strong> {s.evidence}</p>
                          <div style={{ fontSize: 11, color: 'var(--t3)' }}>Demonstrated: <strong>{s.recency}</strong></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePassportTab === 'Skills in Progress' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Ongoing Learning Targets</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {skillsInProgress.map(s => (
                        <div key={s.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                            <span style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 700 }}>{s.progress}% Progress</span>
                          </div>
                          <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                            <div style={{ width: `${s.progress}%`, height: '100%', background: 'var(--accent)' }} />
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--t3)' }}>Next Target: {s.nextGoal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePassportTab === 'Assessment History' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>AI Audit Transcripts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {assessmentHistory.map((h, i) => (
                        <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{h.type}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>Demonstrated {h.date}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)' }}>{h.score} Score</div>
                            <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{h.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePassportTab === 'Verification Levels' && (
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Skill Credential Hierarchy</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { lvl: 1, title: 'Quest Approved', desc: 'Syntax and basic algorithm constructs verified via automated Next.js IDE test runs.' },
                        { lvl: 2, title: 'Faculty Endorsed', desc: 'Mentorship and code audit approval completed by academic institution staff.' },
                        { lvl: 3, title: 'Industry Verified', desc: 'Practical deployment experience verified during company internships or client projects.' }
                      ].map(h => (
                        <div key={h.lvl} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent)', marginBottom: 4 }}>Level {h.lvl} — {h.title}</div>
                          <p style={{ fontSize: 12, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>{h.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePassportRole === 'recruiter' && (
            <div style={CS.card}>
              <div style={CS.cardLabel}>Candidate Skill Passport Dossier</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {passportSkills.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 13.5 }}>{s.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>{s.evidence}</p>
                    </div>
                    <span style={{ fontSize: 11, background: s.verified ? 'var(--green-light)' : 'var(--border)', color: s.verified ? 'var(--green)' : 'var(--t3)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                      {s.verified ? `Level ${s.level} Verified` : 'Pending Validation'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePassportRole === 'faculty' && (
            <div style={CS.card}>
              <div style={CS.cardLabel}>Skill Endorsement Panel</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {passportSkills.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 14, borderRadius: 12 }}>
                    <div>
                      <strong style={{ fontSize: 13.5 }}>{s.name} (Level {s.level})</strong>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{s.evidence}</div>
                    </div>
                    <button onClick={() => toggleEndorsement(s.id)} style={{ padding: '6px 12px', fontSize: 10.5, fontWeight: 800, background: s.verified ? 'var(--coral)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                      {s.verified ? 'Revoke Endorse' : 'Endorse Skill'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* C. CAREER DNA SUB-TAB */}
      {tab === 'career-dna' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Archetype Card */}
              <div style={CS.card}>
                <div style={CS.cardLabel}>📊 Career Archetype Profile</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 32 }}>🛠️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>Software Engineer Archetype</h3>
                    <span style={{ fontSize: 12, color: 'var(--t3)' }}>Focus: Distributed Infrastructure & Cryptographic consensus</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                  Your code quest completions and cryptographic project vault verifications map your archetype directly to SDE structures.
                </p>
              </div>

              {/* Weekly Heatmap */}
              <div style={CS.card}>
                <WeeklyVelocityHeatmap completedQuests={cOS.completedQuests} completedMissions={cOS.completedMissions} themeColor="var(--accent)" />
              </div>
            </div>

            {/* Radar chart */}
            <div style={CS.card}>
              <div style={CS.cardLabel}>🧬 10 Core Evolution Dimensions</div>
              <SkillRadarChart profile={user} />
            </div>
          </div>

          {/* DNA Dimensions details */}
          <div style={CS.card}>
            <div style={CS.cardLabel}>🧬 Dimension Explanations</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Communication', icon: '🎙', desc: 'Speech clarity and presentation style verified in mock calls.' },
                { label: 'Execution', icon: '⚡', desc: 'Missions completion rate and corporate internship delivery benchmarks.' },
                { label: 'Problem Solving', icon: '🧩', desc: 'Coding quest suite resolutions and algorithm execution times.' },
                { label: 'Strategic Thinking', icon: '🧠', desc: 'System design scaling logic and architecture complexity analysis.' }
              ].map(d => (
                <div key={d.label} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
                    <span>{d.icon}</span>
                    <span>{d.label}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0, lineHeight: 1.4 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* D. ANALYTICS SUB-TAB */}
      {tab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
          {isAnalyticsLoading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
              {[...Array(6)].map((_,i) => <div key={i} className="skeleton score-skeleton" style={{ height: 100 }} />)}
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {STATS.slice(0, 8).map(st => <StatCard key={st.label} {...st} />)}
              </div>

              {/* Score trend charts */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                {[
                  { label:'ATS Score Trend',    data:historyAts,   color:'var(--teal)',   val:Math.round(s.ats_score||0)          },
                  { label:'Career DNA Trend',   data:historyDna,   color:'var(--purple)', val:Math.round(s.career_dna_score||0)   },
                  { label:'Trust Score Trend',  data:historyTrust, color:'var(--green)',  val:Math.round(s.trust_score||0)        },
                ].map(chart => (
                  <div key={chart.label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:16, boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <div style={{ fontSize:11.5, fontWeight:600, color:'var(--t2)' }}>{chart.label}</div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:chart.color }}>{chart.val}</div>
                    </div>
                    <MiniLineChart data={chart.data} color={chart.color} height={48} />
                  </div>
                ))}
              </div>

              {/* Mission & Exam breakdown */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={CS.card}>
                  <div style={CS.cardTitle}>Mission Breakdown</div>
                  {[
                    { label:'Completed', val:m.completed||0, color:'var(--green)',  pct:(m.completed||0)/Math.max(m.total||1,1)*100 },
                    { label:'Pending',   val:m.pending||0,   color:'var(--amber)',  pct:(m.pending||0)/Math.max(m.total||1,1)*100   },
                    { label:'Failed',    val:m.failed||0,    color:'var(--coral)',  pct:(m.failed||0)/Math.max(m.total||1,1)*100    },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom:11 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:12, color:'var(--t2)' }}>{item.label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:item.color, fontFamily:'var(--font-mono)' }}>{item.val}</span>
                      </div>
                      <div className="progress-bar" style={{ height:5 }}>
                        <div className="progress-fill" style={{ width:`${item.pct}%`, background:item.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={CS.card}>
                  <div style={CS.cardTitle}>Exam Performance</div>
                  {[
                    { label:'Pass Rate',    val:`${Math.round(ex.pass_rate||0)}%`, color:'var(--green)'   },
                    { label:'Avg Score',    val:`${Math.round(ex.avg_pct||0)}%`,   color:'var(--teal)'    },
                    { label:'Gold Badges',  val:ex.gold||0,                         color:'#f59e0b'        },
                    { label:'Silver Badges',val:ex.silver||0,                       color:'#9ca3af'        },
                    { label:'Bronze Badges',val:ex.bronze||0,                       color:'#d97706'        },
                  ].map(item => (
                    <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
                      <span style={{ fontSize:12, color:'var(--t2)' }}>{item.label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:item.color, fontFamily:'var(--font-mono)' }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* E. PREFERENCES SUB-TAB (Original Profile Page settings) */}
      {tab === 'preferences' && (
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
      )}

      {/* F. SECURITY SUB-TAB */}
      {tab === 'security' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }} className="animate-fade-in">
          <div style={CS.card}>
            <div style={CS.cardTitle}>🔒 Password</div>
            <Link href="/reset-password" style={{ textDecoration:'none' }}>
              <button className="btn-ghost btn-sm">Change Password →</button>
            </Link>
          </div>
          <SecurityFaceLogin />
          <div style={CS.card}>
            <div style={CS.cardTitle}>📱 QR Login</div>
            <div style={{ fontSize:12, color:'var(--t3)', marginBottom:10, lineHeight:1.5 }}>
              Scan a QR code on another device. Confirm with your phone — no typing needed.
            </div>
            <Link href="/qr-login" style={{ textDecoration:'none' }}>
              <button className="btn-ghost btn-sm">Open QR Login →</button>
            </Link>
          </div>
          <div style={{ ...CS.card, borderColor:'rgba(239,68,68,0.2)' }}>
            <div style={{ ...CS.cardTitle, color:'var(--coral)' }}>⚠ Danger Zone</div>
            <button onClick={async () => { await logout(); router.push('/login'); }} className="btn-ghost btn-sm" style={{ color:'var(--coral)', borderColor:'rgba(239,68,68,0.2)' }}>
              ⏻ Sign Out of All Devices
            </button>
          </div>
        </div>
      )}

      {/* G. ACTIVITY HISTORY SUB-TAB */}
      {tab === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">
          <div style={CS.card}>
            <div style={CS.cardTitle}>📜 Activity History</div>
            <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
              Your history of actions, quest completions, and session metrics recorded on PinIT Career OS.
            </p>

            {isActivityLoading ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>Loading activity logs...</div>
            ) : auditLogs.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--t3)', border: '1px dashed var(--border)', borderRadius: 12, fontSize: 13 }}>
                No recent activity records found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {auditLogs.map((log) => (
                  <div key={log.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg3)',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 18 }}>⚡</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', textTransform: 'capitalize' }}>
                          {log.action.replace(/_/g, ' ')}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                          {log.meta?.questTitle || log.meta?.title || log.meta?.roomTitle || (log.action === 'login' ? 'Logged in securely' : log.action === 'logout' ? 'Logged out securely' : 'System update')}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: 9.5, color: 'var(--t4)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SOCRATIC VERIFICATION EXAM MODAL ──────────────────────── */}
      {showExamModal && examData && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
                  🧠 Socratic Verification Exam
                </h3>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                  Subject: {examData.subject}
                </span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 12,
                background: attempts > 1 ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.1)',
                color: attempts > 1 ? 'var(--t2)' : 'var(--coral)',
                border: '1px solid var(--border)'
              }}>
                Attempts Left: {attempts}/3
              </span>
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
              📄 <strong>Credential:</strong> "{docTitle}" by {docIssuer}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '320px', overflowY: 'auto', paddingRight: 4 }}>
              {(examData.questions || []).map((q, qIdx) => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                    {qIdx + 1}. {q.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (examDone) return;
                            setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                          }}
                          disabled={examDone}
                          style={{
                            textAlign: 'left',
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                            background: isSelected ? 'var(--accent-light)' : 'rgba(255,255,255,0.01)',
                            color: isSelected ? 'var(--accent)' : 'var(--t2)',
                            fontSize: 12,
                            fontWeight: isSelected ? 700 : 500,
                            cursor: examDone ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {examFeedback && (
              <div style={{
                padding: 12,
                borderRadius: 10,
                background: examFeedback.includes('🎉') ? 'rgba(5,150,105,0.06)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${examFeedback.includes('🎉') ? 'rgba(5,150,105,0.15)' : 'rgba(239,68,68,0.15)'}`,
                fontSize: 12.5,
                color: 'var(--t2)',
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}>
                {examFeedback}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {!examDone ? (
                <>
                  <button 
                    onClick={handleSubmitExam} 
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Submit Answers ✓
                  </button>
                  <button 
                    onClick={async () => {
                      const currentTrust = user?.trustScore ?? 70;
                      const penalty = Math.max(0, currentTrust - 5);
                      try {
                        await api.post('/api/auth/profile', { trust_score: penalty });
                      } catch (err) {
                        console.error('Failed to post penalty:', err);
                      }
                      setShowExamModal(false);
                      setDocTitle(''); setDocIssuer('');
                      toast.error('Exam Abandoned', 'Deducted -5 from Trust Score for abandoning exam.');
                    }} 
                    className="btn-ghost"
                    style={{ padding: '8px 16px', color: 'var(--coral)' }}
                  >
                    Abandon Exam
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setShowExamModal(false);
                    setDocTitle(''); setDocIssuer('');
                    setExamData(null);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Close & Refresh Portfolio
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-component for Face Login configuration in Security Tab
function SecurityFaceLogin() {
  const [faceEnrolled, setFaceEnrolled] = useState<boolean | null>(null);
  const [showEnroll,   setShowEnroll]   = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/face/enrolled', { credentials:'include', signal: controller.signal })
      .then(r => r.json())
      .then(d => setFaceEnrolled(d.enrolled))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setFaceEnrolled(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  async function removeEnrollment() {
    try {
      const res = await fetch('/api/auth/face/enroll', { method:'DELETE', credentials:'include' });
      if (!res.ok) throw new Error('Failed to remove face enrollment');
      setFaceEnrolled(false);
      setShowEnroll(false);
      toast.success('Face enrollment removed');
    } catch {
      toast.error('Failed to remove face enrollment');
    }
  }

  return (
    <div style={CS.card}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div style={CS.cardTitle}>👤 Face Login</div>
          <div style={{ fontSize:12, color:'var(--t3)', lineHeight:1.5 }}>
            {faceEnrolled === null && 'Checking…'}
            {faceEnrolled === false && 'Login to PinIT using just your face — no password needed.'}
            {faceEnrolled === true  && 'Your face is enrolled. Login with your webcam or phone camera.'}
          </div>
        </div>
        {faceEnrolled === true && !showEnroll && (
          <span style={{ fontSize:10, fontWeight:700, color:'var(--green)', background:'rgba(5,150,105,0.12)', padding:'3px 9px', borderRadius:100, whiteSpace:'nowrap', border:'1px solid rgba(5,150,105,0.25)' }}>
            ✓ Active
          </span>
        )}
      </div>
      {!showEnroll && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={() => setShowEnroll(true)} className="btn-ghost btn-sm">
            {faceEnrolled ? '↺ Re-enroll Face' : '+ Set up Face Login'}
          </button>
          <Link href="/qr-login?tab=face" style={{ textDecoration:'none' }}>
            <button className="btn-ghost btn-sm">Test Face Login →</button>
          </Link>
          {faceEnrolled && (
            <button onClick={removeEnrollment} className="btn-ghost btn-sm" style={{ color:'var(--coral)' }}>✕ Remove</button>
          )}
        </div>
      )}
      {showEnroll && (
        <div style={{ marginTop:12 }}>
          <FaceEnroll
            onSuccess={() => { setFaceEnrolled(true); setShowEnroll(false); }}
            onCancel={() => setShowEnroll(false)}
          />
        </div>
      )}
    </div>
  );
}

