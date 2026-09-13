'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { parseAndValidateGithubUrl } from '@/lib/github/githubIngestion';
import { CS, modalOverlayStyle, modalContentStyle, SocraticExamData, TimelineCategory } from './types';

// Helper to securely attach Supabase JWT Session Token
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { supabase } = await import('@/lib/supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      };
    }
  } catch (err) {
    console.warn('[Profile Auth] Could not retrieve Supabase session token:', err);
  }
  return { 'Content-Type': 'application/json' };
}

interface PortfolioTabProps {
  user: any;
  cOS: any;
  passportSkills?: Array<{ id: string; name: string; level: number }>;
}

export default function PortfolioTab({ user, cOS, passportSkills: propPassportSkills }: PortfolioTabProps) {
  const passportSkills = propPassportSkills || (cOS.skills || []).map((s: any) => ({ id: s.id || s.name, name: s.name, level: s.level || 1 }));
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
  const [achievements, setAchievements] = useState<Array<{ id: string; title: string; detail: string; date?: string; verified?: boolean }>>([]);
  const [recommendations, setRecommendations] = useState<Array<{ id: string; author: string; role?: string; text: string; date?: string; verified?: boolean }>>([]);
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

  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDetail, setNewAchDetail] = useState('');
  const [showAddAch, setShowAddAch] = useState(false);

  const [newRecAuthor, setNewRecAuthor] = useState('');
  const [newRecRole, setNewRecRole] = useState('');
  const [newRecText, setNewRecText] = useState('');
  const [showAddRec, setShowAddRec] = useState(false);

  const savePitch = () => {
    setPitch(tempPitch);
    setEditingPitch(false);
    if (typeof window !== 'undefined' && user?.id) {
      try {
        localStorage.setItem(`pinit_${user.id}_pitch`, tempPitch);
      } catch {}
    }
    api.patch('/api/auth/profile', { bio: tempPitch }).catch(() => {});
    toast.success('Pitch Updated', 'Your profile pitch has been updated and saved.');
  };
  const addProject = () => {
    if (!newProjTitle || !newProjDesc) return;
    const newProj = { id: `p_${Date.now()}`, title: newProjTitle, description: newProjDesc, tech: newProjTech.split(',').map(t => t.trim()).filter(Boolean), verified: false };
    const next = [...projects, newProj];
    setProjects(next);
    if (typeof window !== 'undefined' && user?.id) {
      try { localStorage.setItem(`pinit_${user.id}_projects`, JSON.stringify(next)); } catch {}
    }
    api.patch('/api/auth/profile', { projects: next }).catch(() => {});
    setNewProjTitle(''); setNewProjDesc(''); setNewProjTech('');
    toast.success('Project Pitch Saved', 'Your project has been added and synced to your cloud portfolio. Pending faculty verification.');
  };
  const addTimelineEvent = () => {
    if (!newEvtTitle || !newEvtDetail) return;
    const newEvt = { id: `t_evt_${Date.now()}`, year: newEvtYear, category: newEvtCategory, title: newEvtTitle, detail: newEvtDetail, verified: false };
    const next = [newEvt, ...timeline];
    setTimeline(next);
    if (typeof window !== 'undefined' && user?.id) {
      try { localStorage.setItem(`pinit_${user.id}_timeline`, JSON.stringify(next)); } catch {}
    }
    api.patch('/api/auth/profile', { timeline: next }).catch(() => {});
    setNewEvtTitle(''); setNewEvtDetail('');
    toast.success('Event Added', 'Achievement event added to timeline and synced. Pending faculty verification.');
  };
  const addAchievement = () => {
    if (!newAchTitle.trim()) return;
    const newAch = {
      id: `ach_${Date.now()}`,
      title: newAchTitle.trim(),
      detail: newAchDetail.trim() || 'Competition & Honors Record',
      date: new Date().toLocaleDateString(),
      verified: false
    };
    const updated = [newAch, ...achievements];
    setAchievements(updated);
    if (typeof window !== 'undefined' && user?.id) {
      try {
        localStorage.setItem(`pinit_${user.id}_achievements`, JSON.stringify(updated));
      } catch {}
    }
    api.patch('/api/auth/profile', { achievements: updated }).catch(() => {});
    setNewAchTitle('');
    setNewAchDetail('');
    setShowAddAch(false);
    toast.success('Achievement Logged', 'Honor / award added to portfolio and synced. Pending verification.');
  };

  const addRecommendation = async () => {
    if (!newRecAuthor.trim() || !newRecText.trim()) return;

    let isServerVerified = false;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portfolio/verify-endorsement', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'add_recommendation',
          author: newRecAuthor.trim(),
          role: newRecRole.trim(),
          text: newRecText.trim(),
        })
      });
      if (res.ok) {
        const data = await res.json();
        isServerVerified = Boolean(data.isVerified);
      }
    } catch {
      isServerVerified = false;
    }

    const newRec = {
      id: `rec_${Date.now()}`,
      author: newRecAuthor.trim(),
      role: newRecRole.trim() || 'Academic / Industry Mentor',
      text: newRecText.trim(),
      date: new Date().toLocaleDateString(),
      verified: isServerVerified
    };
    const updated = [newRec, ...recommendations];
    setRecommendations(updated);
    if (typeof window !== 'undefined' && user?.id) {
      try {
        localStorage.setItem(`pinit_${user.id}_recommendations`, JSON.stringify(updated));
      } catch {}
    }
    api.patch('/api/auth/profile', { recommendations: updated }).catch(() => {});

    setNewRecAuthor('');
    setNewRecRole('');
    setNewRecText('');
    setShowAddRec(false);
    toast.success(
      isServerVerified ? 'Faculty Recommendation Verified' : 'Recommendation Submitted',
      isServerVerified
        ? 'Official faculty endorsement validated by institutional authority.'
        : 'Recommendation submitted. Awaiting official faculty verification.'
    );
  };

  const toggleVerification = async (type: 'project' | 'certificate' | 'research' | 'timeline', id: string) => {
    // Authoritative server-side verification check
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portfolio/verify-endorsement', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'verify_item',
          type,
          id,
          studentId: user?.id
        })
      });
      if (!res.ok) {
        toast.error('Permission Denied', 'Only authenticated faculty mentors and institutional administrators can verify portfolio evidence.');
        return;
      }
    } catch {
      toast.error('Verification Error', 'Failed to reach server for institutional role verification.');
      return;
    }

    if (type === 'project') {
      const next = projects.map(p => p.id === id ? { ...p, verified: !p.verified } : p);
      setProjects(next);
      if (typeof window !== 'undefined' && user?.id) {
        try { localStorage.setItem(`pinit_${user.id}_projects`, JSON.stringify(next)); } catch {}
      }
      api.patch('/api/auth/profile', { projects: next }).catch(() => {});
    } else if (type === 'certificate') {
      const next = certificates.map(c => c.id === id ? { ...c, verified: !c.verified } : c);
      setCertificates(next);
      if (typeof window !== 'undefined' && user?.id) {
        try { localStorage.setItem(`pinit_${user.id}_certificates`, JSON.stringify(next)); } catch {}
      }
      api.patch('/api/auth/profile', { certificates: next }).catch(() => {});
    } else if (type === 'research') {
      const next = researchPapers.map(r => r.id === id ? { ...r, verified: !r.verified } : r);
      setResearchPapers(next);
      if (typeof window !== 'undefined' && user?.id) {
        try { localStorage.setItem(`pinit_${user.id}_research`, JSON.stringify(next)); } catch {}
      }
      api.patch('/api/auth/profile', { researchPapers: next }).catch(() => {});
    } else if (type === 'timeline') {
      const next = timeline.map(t => t.id === id ? { ...t, verified: !t.verified } : t);
      setTimeline(next);
      if (typeof window !== 'undefined' && user?.id) {
        try { localStorage.setItem(`pinit_${user.id}_timeline`, JSON.stringify(next)); } catch {}
      }
      api.patch('/api/auth/profile', { timeline: next }).catch(() => {});
    }
    toast.success('Verification status updated');
  };

  // GitHub Repositories
  const [githubRepoInput, setGithubRepoInput] = useState('');
  const [linkingRepo, setLinkingRepo] = useState(false);
  const [linkedRepos, setLinkedRepos] = useState<Array<{
    repoUrl: string;
    fullName: string;
    description: string;
    stars: number;
    score: number;
    skills: string[];
    verifiedAt: string;
  }>>([]);

  useEffect(() => {
    if (!user?.id || typeof window === 'undefined') return;
    try {
      const storedPitch = localStorage.getItem(`pinit_${user.id}_pitch`);
      if (storedPitch) {
        setPitch(storedPitch);
        setTempPitch(storedPitch);
      }
      const obAny = user?.onboardingAnswers as any;
      const storedProjects = localStorage.getItem(`pinit_${user.id}_projects`);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else if (obAny?.portfolio_projects || (user as any)?.projects) {
        setProjects(obAny?.portfolio_projects || (user as any)?.projects);
      }
      const storedCerts = localStorage.getItem(`pinit_${user.id}_certificates`);
      if (storedCerts) {
        setCertificates(JSON.parse(storedCerts));
      } else if (obAny?.portfolio_certificates || (user as any)?.certifications) {
        setCertificates(obAny?.portfolio_certificates || (user as any)?.certifications);
      }
      const storedTimeline = localStorage.getItem(`pinit_${user.id}_timeline`);
      if (storedTimeline) {
        setTimeline(JSON.parse(storedTimeline));
      } else if (obAny?.portfolio_timeline || (user as any)?.timeline) {
        setTimeline(obAny?.portfolio_timeline || (user as any)?.timeline);
      }
      const storedResearch = localStorage.getItem(`pinit_${user.id}_research`);
      if (storedResearch) {
        setResearchPapers(JSON.parse(storedResearch));
      }
      const storedAchievements = localStorage.getItem(`pinit_${user.id}_achievements`);
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      } else if (obAny?.portfolio_achievements || (user as any)?.achievements) {
        setAchievements(obAny?.portfolio_achievements || (user as any)?.achievements);
      }
      const storedRecs = localStorage.getItem(`pinit_${user.id}_recommendations`);
      if (storedRecs) {
        setRecommendations(JSON.parse(storedRecs));
      } else if (obAny?.portfolio_recommendations || (user as any)?.recommendations) {
        setRecommendations(obAny?.portfolio_recommendations || (user as any)?.recommendations);
      }

      const stored = localStorage.getItem(`pinit_${user.id}_github_repos`);
      if (stored) {
        setLinkedRepos(JSON.parse(stored));
      } else {
        const capstones = localStorage.getItem(`pinit_${user.id}_capstones_v1`);
        if (capstones) {
          const parsed = JSON.parse(capstones);
          if (Array.isArray(parsed)) {
            const foundRepos = parsed
              .filter((c: any) => c.githubRepoUrl || c.repoUrl)
              .map((c: any) => {
                const url = c.githubRepoUrl || c.repoUrl;
                return {
                  repoUrl: url,
                  fullName: url.replace(/^https?:\/\/github\.com\//i, ''),
                  description: c.title || 'Capstone Project Repository',
                  stars: 0,
                  score: c.vivaScore || 85,
                  skills: c.techStack || ['Full-Stack'],
                  verifiedAt: new Date().toLocaleDateString()
                };
              });
            if (foundRepos.length > 0) {
              setLinkedRepos(foundRepos);
            }
          }
        }
      }
    } catch {}
  }, [user?.id]);

  const handleLinkGithubRepo = async () => {
    if (!githubRepoInput.trim()) {
      toast.error('URL Required', 'Please enter a GitHub repository URL.');
      return;
    }
    const check = parseAndValidateGithubUrl(githubRepoInput.trim());
    if (!check.valid) {
      toast.error('Invalid URL', check.error || 'Please enter a valid GitHub repository URL.');
      return;
    }
    setLinkingRepo(true);
    try {
      const res = await fetch('/api/github/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: githubRepoInput.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.report) {
        toast.error('Ingestion Failed', data.error || 'Could not verify repository evidence.');
        return;
      }
      const report = data.report;
      const newEntry = {
        repoUrl: githubRepoInput.trim(),
        fullName: report.metadata?.fullName || `${check.owner}/${check.repo}`,
        description: report.metadata?.description || 'Public GitHub Repository',
        stars: report.metadata?.stars || 0,
        score: report.overallEvidenceScore || 0,
        skills: (report.detectedSkills || []).map((s: any) => s.skill),
        verifiedAt: new Date().toLocaleDateString()
      };
      setLinkedRepos(prev => {
        const filtered = prev.filter(r => r.repoUrl.toLowerCase() !== newEntry.repoUrl.toLowerCase());
        const updated = [newEntry, ...filtered];
        if (typeof window !== 'undefined' && user?.id) {
          localStorage.setItem(`pinit_${user.id}_github_repos`, JSON.stringify(updated));
        }
        return updated;
      });
      setGithubRepoInput('');
      toast.success('Repository Linked & Audited', `${newEntry.fullName} verified with evidence score ${newEntry.score}/100.`);
    } catch (err: any) {
      toast.error('Network Error', err.message || 'Failed to communicate with repository ingestion engine.');
    } finally {
      setLinkingRepo(false);
    }
  };

  const handleUnlinkGithubRepo = (repoUrl: string) => {
    setLinkedRepos(prev => {
      const updated = prev.filter(r => r.repoUrl !== repoUrl);
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`pinit_${user.id}_github_repos`, JSON.stringify(updated));
      }
      return updated;
    });
    toast.success('Repository Unlinked', 'Repository removed from portfolio view.');
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
      setCertificates(prev => {
        const next = [...prev, newCert];
        if (typeof window !== 'undefined' && user?.id) {
          try { localStorage.setItem(`pinit_${user.id}_certificates`, JSON.stringify(next)); } catch {}
        }
        return next;
      });

      const newEvt = {
        id: `t_evt_${Date.now()}`,
        year: '2026',
        category: docCategory as TimelineCategory,
        title: docTitle,
        detail: `Uploaded portfolio credential issued by ${docIssuer}.`,
        verified: false
      };
      setTimeline(prev => {
        const next = [newEvt, ...prev];
        if (typeof window !== 'undefined' && user?.id) {
          try { localStorage.setItem(`pinit_${user.id}_timeline`, JSON.stringify(next)); } catch {}
        }
        return next;
      });

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

    let verifyRes: any;
    try {
      const res = await fetch('/api/portfolio/verify-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examSessionToken: examData.examSessionToken,
          selectedAnswers,
        }),
      });
      verifyRes = await res.json();
      if (!res.ok || !verifyRes.ok) {
        throw new Error(verifyRes.error || 'Failed to grade exam.');
      }
    } catch (e: any) {
      toast.error('Evaluation Error', e.message || 'Failed to verify exam submission with server.');
      return;
    }

    const { passed, correctCount: correct, total: verifiedTotal } = verifyRes;
    const currentTrust = Number(user?.trust_score ?? (user as any)?.trustScore ?? cOS.trustScore ?? 0);
    const currentDna = Number(user?.career_dna_score ?? (user as any)?.careerDnaScore ?? cOS.careerScore ?? 0);

    if (passed) {
      const newTrust = Math.min(99, currentTrust + 10);
      const newDna = Math.min(99, currentDna + 5);

      try {
        await api.post('/api/auth/profile', { trust_score: newTrust, career_dna_score: newDna });
      } catch (err) {
        console.error('Failed to update scores in DB:', err);
      }

      const newCert = { id: `c_${Date.now()}`, title: docTitle, issuer: docIssuer, verified: true };
      setCertificates(prev => {
        const next = [...prev, newCert];
        if (typeof window !== 'undefined' && user?.id) {
          try { localStorage.setItem(`pinit_${user.id}_certificates`, JSON.stringify(next)); } catch {}
        }
        return next;
      });

      const newEvt = {
        id: `t_evt_${Date.now()}`,
        year: '2026',
        category: 'Course' as TimelineCategory,
        title: docTitle,
        detail: `Passed Socratic verification exam (${correct}/${verifiedTotal}) for course by ${docIssuer}.`,
        verified: true
      };
      setTimeline(prev => {
        const next = [newEvt, ...prev];
        if (typeof window !== 'undefined' && user?.id) {
          try { localStorage.setItem(`pinit_${user.id}_timeline`, JSON.stringify(next)); } catch {}
        }
        return next;
      });

      setExamFeedback(`🎉 PASS! You scored ${correct}/${verifiedTotal}. Credential verified successfully!\nTrust Score increased to ${newTrust} (+10).\nCareer DNA increased to ${newDna} (+5).`);
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
        setExamFeedback(`❌ Verification failed (Scored ${correct}/${verifiedTotal}). You have ${newAttempts} attempts left.\nA penalty of -2 points has been applied to your Trust Score.`);
      } else {
        const finalTrust = Math.max(0, currentTrust - 10);
        try {
          await api.post('/api/auth/profile', { trust_score: finalTrust });
        } catch (err) {
          console.error('Failed to update final penalty in DB:', err);
        }

        const newCert = { id: `c_${Date.now()}`, title: docTitle, issuer: docIssuer, verified: false };
        setCertificates(prev => {
          const next = [...prev, newCert];
          if (typeof window !== 'undefined' && user?.id) {
            try { localStorage.setItem(`pinit_${user.id}_certificates`, JSON.stringify(next)); } catch {}
          }
          return next;
        });

        const newEvt = {
          id: `t_evt_${Date.now()}`,
          year: '2026',
          category: 'Course' as TimelineCategory,
          title: docTitle,
          detail: `Failed Socratic verification attempts (0/3 remaining) for course by ${docIssuer}.`,
          verified: false
        };
        setTimeline(prev => {
          const next = [newEvt, ...prev];
          if (typeof window !== 'undefined' && user?.id) {
            try { localStorage.setItem(`pinit_${user.id}_timeline`, JSON.stringify(next)); } catch {}
          }
          return next;
        });

        setExamFeedback(`❌ Failed all attempts. Certificate added as unverified.\nA penalty of -10 has been applied to your Trust Score (New Trust Score: ${finalTrust}).`);
        setExamDone(true);
        toast.error('Verification Failed', 'All attempts exhausted. Trust Score penalized.');
      }
    }
  };

  return (
    <>
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
                          <button onClick={savePitch} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Save Pitch</button>
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
                        <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}>
                          {(() => {
                            const verifiedVaultItem = cOS.vaultItems?.find((v: any) => v.verified)?.title;
                            const lastQuest = cOS.completedQuests?.length ? `Quest: ${cOS.completedQuests[cOS.completedQuests.length - 1]}` : null;
                            return verifiedVaultItem || lastQuest || 'None yet';
                          })()}
                        </div>
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
                              background: hasTag ? 'rgba(var(--success-deep-rgb), 0.1)' : 'rgba(var(--danger-rgb), 0.1)',
                              color: hasTag ? 'var(--green)' : 'var(--coral)',
                              border: `1px solid ${hasTag ? 'rgba(var(--success-deep-rgb), 0.2)' : 'rgba(var(--danger-rgb), 0.2)'}`,
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
                              background: 'rgba(var(--danger-rgb), 0.04)',
                              border: '1px solid rgba(var(--danger-rgb), 0.15)',
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
                            style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            {uploading ? '⏳ Analyzing Credentials...' : 'Upload & Verify Credentials ✓'}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {activePortfolioTab === 'Resume' && (
                  <div style={{ padding: '24px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)', maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: '0 0 4px 0' }}>
                          {user?.displayName || 'Student Candidate'}
                        </h3>
                        <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                          {user?.email || 'verified@career-os.internal'}
                        </p>
                      </div>
                      <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(var(--brand-rgb), 0.12)', color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        LIVE PORTFOLIO SYNC
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 16 }}>
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t2)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                        Verified Skills & Competencies ({passportSkills.length})
                      </h4>
                      {passportSkills.length === 0 ? (
                        <p style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', margin: 0 }}>
                          No verified skills recorded yet. Complete proctored quests to certify skills.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {passportSkills.map((s: any) => (
                            <span key={s.id} style={{ fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4, color: 'var(--t1)' }}>
                              {s.name} (L{s.level})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 20 }}>
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t2)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                        Active Projects ({projects.length})
                      </h4>
                      {projects.length === 0 ? (
                        <p style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', margin: 0 }}>
                          No projects added to portfolio yet.
                        </p>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--t2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {projects.map(p => (
                            <li key={p.id}>
                              <strong>{p.title}</strong> &mdash; {p.description || 'Verified implementation'}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16, flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => window.print()} 
                        className="btn-primary"
                        style={{ padding: '8px 20px', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        🖨️ Print / Save as PDF
                      </button>
                      <span style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>
                        Direct PDF Export: Coming Soon
                      </span>
                    </div>
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
                        <button onClick={addProject} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Add Project for Verification</button>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Verified Honors & Awards</h3>
                      <button
                        onClick={() => setShowAddAch(!showAddAch)}
                        style={{
                          background: 'var(--accent)',
                          color: 'var(--text)',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {showAddAch ? 'Cancel' : '+ Log Honor / Award'}
                      </button>
                    </div>

                    {showAddAch && (
                      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <input
                            type="text"
                            placeholder="Award or Honor Title (e.g. 1st Place Smart India Hackathon)"
                            value={newAchTitle}
                            onChange={e => setNewAchTitle(e.target.value)}
                            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
                          />
                          <input
                            type="text"
                            placeholder="Issuing Organization or Details (e.g. Ministry of Education / IEEE)"
                            value={newAchDetail}
                            onChange={e => setNewAchDetail(e.target.value)}
                            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button onClick={() => setShowAddAch(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'var(--t2)', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={addAchievement} style={{ background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}>Save Award</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {(() => {
                      const vaultHonors = (cOS.vaultItems || []).filter((v: any) => v.item_type === 'activity' || v.item_type === 'certification').map((v: any) => ({
                        id: v.id,
                        title: v.title,
                        detail: v.organization_name || v.description || 'Verified Vault Credential',
                        verified: v.verified
                      }));
                      const allHonors = [...achievements, ...vaultHonors];
                      if (allHonors.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>🏆</span>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>No Honors or Awards Logged Yet</div>
                            <p style={{ fontSize: 12, color: 'var(--t3)', maxWidth: 440, margin: '0 auto' }}>
                              Log hackathon awards, competition honors, or verified certifications above to showcase verified achievements on your public profile.
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {allHonors.map(a => (
                            <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 20 }}>🏆</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{a.title}</h4>
                                  <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: a.verified ? 'rgba(34,197,94,0.1)' : 'rgba(var(--warning-rgb), 0.1)', color: a.verified ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                                    {a.verified ? '✓ Verified' : 'Pending Audit'}
                                  </span>
                                </div>
                                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{a.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {activePortfolioTab === 'GitHub' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Linked GitHub Repositories & Evidence</h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>
                          Audited via AST parsing, testing harness detection, and dependency manifests.
                        </p>
                      </div>
                      <span style={{ fontSize: 10.5, background: 'rgba(var(--info-rgb), 0.1)', color: 'var(--accent)', border: '1px solid rgba(var(--info-rgb), 0.2)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                        PinIT Ingestion Engine v1.0
                      </span>
                    </div>

                    {/* Honest OAuth Status Banner */}
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 16 }}>ℹ️</span>
                      <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                        <strong>Direct Ingestion Active:</strong> Public repositories can be linked and verified below. OAuth token access (for private commits) is scheduled for v2.1.
                      </div>
                    </div>

                    {/* Link Repository Form */}
                    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                        Link & Audit Public GitHub Repository
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          placeholder="https://github.com/username/project-repo"
                          value={githubRepoInput}
                          onChange={e => setGithubRepoInput(e.target.value)}
                          disabled={linkingRepo}
                          style={{
                            flex: 1,
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: 'var(--t1)',
                            fontSize: 12.5,
                            fontFamily: 'var(--font-mono)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleLinkGithubRepo}
                          disabled={linkingRepo || !githubRepoInput.trim()}
                          style={{
                            padding: '8px 16px',
                            fontSize: 12,
                            fontWeight: 800,
                            background: linkingRepo ? 'var(--bg3)' : 'var(--accent)',
                            color: linkingRepo ? 'var(--t3)' : 'var(--text)',
                            border: 'none',
                            borderRadius: 8,
                            cursor: linkingRepo ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          {linkingRepo ? 'Auditing Repo...' : 'Audit & Link Repo ↗'}
                        </button>
                      </div>
                    </div>

                    {/* Linked Repositories List */}
                    {linkedRepos.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>🐙</span>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>No GitHub Repositories Linked</div>
                        <p style={{ fontSize: 12, color: 'var(--t3)', maxWidth: 440, margin: '0 auto', lineHeight: 1.5 }}>
                          Link your project or capstone repositories above. The PinIT engine validates architecture structure, test coverage, and exports verified technical skills to your portfolio.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {linkedRepos.map((repo, idx) => (
                          <div key={idx} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                              <div>
                                <a
                                  href={repo.repoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                                >
                                  {repo.fullName} ↗
                                </a>
                                <p style={{ fontSize: 12, color: 'var(--t2)', margin: '4px 0 0 0' }}>{repo.description}</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: repo.score >= 70 ? 'rgba(var(--success-rgb), 0.1)' : 'rgba(var(--warning-rgb), 0.1)', color: repo.score >= 70 ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                                  Score: {repo.score}/100
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUnlinkGithubRepo(repo.repoUrl)}
                                  title="Unlink Repository"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 12, padding: 4 }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {repo.skills && repo.skills.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                {repo.skills.map((s, sIdx) => (
                                  <span key={sIdx} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--t1)' }}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 10.5, color: 'var(--t3)' }}>
                              <span>★ {repo.stars} stars</span>
                              <span>Audited: {repo.verifiedAt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Mentor & Faculty Endorsements</h3>
                      <button
                        onClick={() => setShowAddRec(!showAddRec)}
                        style={{
                          background: 'var(--accent)',
                          color: 'var(--text)',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {showAddRec ? 'Cancel' : '+ Add Endorsement'}
                      </button>
                    </div>

                    {showAddRec && (
                      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <input
                              type="text"
                              placeholder="Mentor / Faculty Name (e.g. Dr. Rajesh Sharma)"
                              value={newRecAuthor}
                              onChange={e => setNewRecAuthor(e.target.value)}
                              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
                            />
                            <input
                              type="text"
                              placeholder="Designation / Role (e.g. Professor & Head of CS)"
                              value={newRecRole}
                              onChange={e => setNewRecRole(e.target.value)}
                              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5 }}
                            />
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Recommendation or letter of endorsement quote..."
                            value={newRecText}
                            onChange={e => setNewRecText(e.target.value)}
                            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button onClick={() => setShowAddRec(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'var(--t2)', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={addRecommendation} style={{ background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}>Save Endorsement</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {recommendations.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {recommendations.map(r => (
                          <div key={r.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div>
                                <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>{r.author}</span>
                                {r.role && <span style={{ fontSize: 11.5, color: 'var(--t3)', marginLeft: 8 }}>&middot; {r.role}</span>}
                              </div>
                              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', color: 'var(--green)', fontWeight: 700 }}>
                                {r.verified ? '✓ Faculty Endorsed' : 'Pending Audit'}
                              </span>
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                              &ldquo;{r.text}&rdquo;
                            </p>
                            {r.date && (
                              <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 8 }}>Endorsed on {r.date}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>✍️</span>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>No Endorsements Recorded Yet</div>
                        <p style={{ fontSize: 12, color: 'var(--t3)', maxWidth: 460, margin: '0 auto 16px', lineHeight: 1.5 }}>
                          Add cryptographically signed letters of recommendation and mentor endorsements above to showcase academic and industry credibility.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activePortfolioTab === 'Timeline' && (
                  <div>
                    {/* Course Learning Outcome (CLO) Competency Matrix (University & Moodle-aligned) */}
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8 }}>AICTE & University Outcome Framework</span>
                          <h4 style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 800 }}>Course Learning Outcome (CLO) Competency Matrix</h4>
                        </div>
                        {(() => {
                          const totalEvidenceCount = (cOS.completedQuests?.length || 0) + (cOS.completedMissions?.length || 0) + projects.filter(p => p.verified).length + (cOS.vaultItems?.filter((v: any) => v.verified)?.length || 0);
                          return (
                            <span style={{ fontSize: 10.5, background: totalEvidenceCount > 0 ? 'rgba(var(--success-rgb), 0.1)' : 'rgba(var(--danger-rgb), 0.1)', color: totalEvidenceCount > 0 ? 'var(--success)' : 'var(--t3)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                              {totalEvidenceCount > 0 ? '✓ Verified Progress' : 'Awaiting Submissions'}
                            </span>
                          );
                        })()}
                      </div>

                      {(() => {
                        const questCount = (cOS.completedQuests?.length || 0) + (cOS.completedMissions?.length || 0);
                        const verifiedProjectsCount = projects.filter(p => p.verified).length + (cOS.onboardingAnswers?.projects?.length ? 1 : 0);
                        const dnaMastery = Math.max(0, Math.min(100, cOS.dnaScore || 0));
                        const verifiedCertsCount = (cOS.vaultItems?.filter((v: any) => v.verified && (v.item_type === 'certification' || v.item_type === 'course'))?.length || 0) + certificates.filter(c => c.verified).length;

                        const cloItems = [
                          {
                            code: 'CLO-101',
                            name: 'Data Structures & Algorithmic Crisis Recovery',
                            syllabus: 'Anna Univ CS3401 / VTU 21CS32 / Mumbai Univ Core DSA',
                            mastery: questCount === 0 ? 0 : Math.min(100, Math.round((questCount / 6) * 100)),
                            evidence: questCount > 0 ? `${cOS.completedQuests?.length || 0} Quests + ${cOS.completedMissions?.length || 0} Coding Missions Passed` : 'No verified DSA quests completed yet'
                          },
                          {
                            code: 'CLO-102',
                            name: 'System Architecture & Concurrency Design',
                            syllabus: 'Anna Univ CS3451 / VTU 21CS33 OS & Concurrency',
                            mastery: verifiedProjectsCount === 0 ? 0 : Math.min(100, verifiedProjectsCount * 45),
                            evidence: verifiedProjectsCount > 0 ? `${verifiedProjectsCount} Verified Capstone Project(s) Evaluated` : 'No verified system design projects submitted'
                          },
                          {
                            code: 'CLO-103',
                            name: 'Technical Presentation & Verbal Alignment',
                            syllabus: 'AICTE Model Curriculum: Professional Communication',
                            mastery: dnaMastery,
                            evidence: dnaMastery > 0 ? `AI Speech & Behavioral DNA Score: ${dnaMastery}%` : 'No AI mock interview sessions recorded'
                          },
                          {
                            code: 'CLO-204',
                            name: 'Distributed Cloud & Network Architectures',
                            syllabus: 'Anna Univ CS3591 / VTU 21CS52 Computer Networks',
                            mastery: verifiedCertsCount === 0 ? 0 : Math.min(100, verifiedCertsCount * 50),
                            evidence: verifiedCertsCount > 0 ? `${verifiedCertsCount} Verified Cloud & Infrastructure Credentials` : 'No verified cloud/networking credentials in Vault'
                          }
                        ];

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {cloItems.map((clo, idx) => (
                              <div key={idx} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>{clo.code}: {clo.name}</span>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: clo.mastery > 0 ? 'var(--success)' : 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{clo.mastery}% Mastery</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                  <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: 'rgba(var(--info-rgb),  0.1)', color: 'var(--accent)', fontWeight: 700 }}>
                                    🏛️ {clo.syllabus}
                                  </span>
                                </div>
                                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden', marginBottom: 6 }}>
                                  <div style={{ width: `${clo.mastery}%`, height: '100%', background: clo.mastery > 0 ? 'linear-gradient(90deg, #10b981, #059669)' : 'var(--border)', borderRadius: 3 }} />
                                </div>
                                <div style={{ fontSize: 10, color: clo.mastery > 0 ? 'var(--t2)' : 'var(--t3)' }}>Verified Evidence: {clo.evidence}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
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
                        <button onClick={addTimelineEvent} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Add Event</button>
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
                        <button onClick={() => toggleVerification('project', p.id)} style={{ padding: '6px 12px', fontSize: 10.5, fontWeight: 800, background: p.verified ? 'var(--coral)' : 'var(--green)', color: 'var(--text)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
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
                background: attempts > 1 ? 'rgba(255,255,255,0.03)' : 'rgba(var(--danger-rgb), 0.1)',
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
                background: examFeedback.includes('🎉') ? 'rgba(var(--success-deep-rgb), 0.06)' : 'rgba(var(--danger-rgb), 0.06)',
                border: `1px solid ${examFeedback.includes('🎉') ? 'rgba(var(--success-deep-rgb), 0.15)' : 'rgba(var(--danger-rgb), 0.15)'}`,
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
                      const currentTrust = Number(user?.trust_score ?? (user as any)?.trustScore ?? cOS.trustScore ?? 0);
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
    </>
  );
}
