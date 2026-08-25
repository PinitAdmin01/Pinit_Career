'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { StudentSkillProfile, JobDescriptionSkillGap, InternshipRecord } from '@/lib/pathway/competencySchema';
import { COMPETENCY_CATALOG_V1 } from '@/lib/pathway/competencyCatalog';

interface Quest {
  id: string;
  title: string;
  desc: string;
  type: 'coding' | 'lecture' | 'interactive';
  category?: 'learning' | 'exam' | 'assignment';
  requiresAvatar?: boolean;
  starterCode?: string;
  hint?: string;
  testSuite?: string;
  skillCategory?: string;
  syllabus?: string[];
}

interface Module {
  id: string;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  quests: Quest[];
}

const TRAJECTORIES = [
  {
    id: 'react_frontend',
    title: 'React Frontend SDE',
    desc: 'Focuses on responsive user interfaces, React state machines, Next.js SSR, and client data arrays.',
    skills: ['React Hooks', 'NextJS SSR', 'Vanilla CSS', 'Zustand State', 'TypeScript Types'],
    icon: '⚛️',
    color: '#06b6d4'
  },
  {
    id: 'java_sde',
    title: 'Java Backend SDE',
    desc: 'Focuses on REST API compilation, database processes, SOLID design, and JVM memory pools.',
    skills: ['Java Core', 'Spring Boot REST', 'SQL Tables', 'SOLID Principles', 'Unit Testing'],
    icon: '☕',
    color: '#4f46e5'
  },
  {
    id: 'devops_cloud',
    title: 'DevOps Cloud SDE',
    desc: 'Focuses on dockerizing applications, CI/CD telemetry, AWS infrastructure, and sentinel security.',
    skills: ['Docker Containers', 'CI/CD Pipelines', 'AWS S3/EC2', 'Kubernetes', 'Process Telemetry'],
    icon: '☁️',
    color: '#10b981'
  }
];

export default function CareerBuilderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const cOS = useCareerOS();

  const { 
    roadmapGenerated, 
    setRoadmapGenerated, 
    onboardingAnswers,
    setOnboarding,
    onboardingStep,
    setOnboardingStep
  } = cOS;

  const [activeView, setActiveView] = useState<'roadmap' | 'resume'>('roadmap');
  const [selectedTrajectory, setSelectedTrajectory] = useState<string>('react_frontend');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [previewModules, setPreviewModules] = useState<Module[]>([]);

  // ATS Gap State
  const [jdText, setJdText] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsGaps, setAtsGaps] = useState<JobDescriptionSkillGap[]>([]);
  const [skillProfile, setSkillProfile] = useState<StudentSkillProfile | null>(null);
  const [internships, setInternships] = useState<InternshipRecord[]>([]);

  // Load roadmap modules and skill profile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const modulesKey = `pinit_${userId}_roadmap_modules`;
      const saved = localStorage.getItem(modulesKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setPreviewModules(parsed);
          }
        } catch {}
      }
    }

    async function loadStudentData() {
      try {
        const [prof, intern] = await Promise.all([
          PathwayApiService.getStudentSkillProfile(userId),
          PathwayApiService.getInternshipRecords(userId),
        ]);
        setSkillProfile(prof);
        setInternships(intern);
      } catch (err) {
        console.warn('Failed to load profile data in career builder:', err);
      }
    }
    loadStudentData();
  }, [userId]);

  // Run ATS Scanner against pasted Job Description
  const handleScanJobDescription = () => {
    if (!jdText.trim()) {
      toast.error('Empty Job Description', 'Please paste a job description to analyze.');
      return;
    }

    const textLower = jdText.toLowerCase();
    const verifiedNames = new Set((skillProfile?.verified || []).map(v => v.name.toLowerCase()));
    const demonstratedNames = new Set((skillProfile?.demonstrated || []).map(d => d.name.toLowerCase()));

    const detectedGaps: JobDescriptionSkillGap[] = [];
    let matchedCount = 0;
    let totalChecked = 0;

    for (const comp of COMPETENCY_CATALOG_V1) {
      const compTitleLower = comp.title.toLowerCase();
      const compWords = comp.title.split(/[:\s]/).map(w => w.toLowerCase()).filter(w => w.length > 3);
      
      const isMentioned = compWords.some(w => textLower.includes(w));
      if (isMentioned) {
        totalChecked++;
        const isVerified = verifiedNames.has(compTitleLower) || Array.from(verifiedNames).some(v => v.includes(comp.id));
        const isDemonstrated = demonstratedNames.has(compTitleLower) || Array.from(demonstratedNames).some(d => d.includes(comp.id));

        if (isVerified) {
          matchedCount += 1.0;
        } else if (isDemonstrated) {
          matchedCount += 0.5;
        }

        detectedGaps.push({
          taxonomyTerm: comp.title,
          competencyId: comp.id,
          importance: comp.level === 'L0' || comp.level === 'L1' || comp.level === 'L2' ? 'required' : 'preferred',
          isSatisfied: isVerified,
          userConsentStatus: isVerified ? 'accepted' : 'pending',
        });
      }
    }

    const calculatedScore = totalChecked > 0 ? Math.round((matchedCount / totalChecked) * 100) : 75;
    setAtsScore(calculatedScore);
    setAtsGaps(detectedGaps);
    toast.success('ATS Analysis Complete! 🎯', `Calculated ${calculatedScore}% match with verified skill mapping.`);
  };

  // Consented Roadmap Addition
  const handleAcceptGaps = () => {
    if (typeof window !== 'undefined') {
      const pendingTerms = atsGaps.filter(g => !g.isSatisfied).map(g => g.taxonomyTerm);
      localStorage.setItem(`pinit_${userId}_consented_ats_gaps`, JSON.stringify(pendingTerms));
      toast.success('Roadmap Updated with Consent! 🚀', `Added ${pendingTerms.length} targeted skill gaps to your weekly roadmap.`);
    }
  };

  // Generate dynamic roadmap via AI
  const handleGenerateRoadmap = async () => {
    setLoading(true);
    const targetTrajectory = TRAJECTORIES.find(t => t.id === selectedTrajectory);
    const targetLabel = targetTrajectory?.title || 'Software Developer';
    const skillsList = targetTrajectory?.skills.join(', ') || '';

    try {
      const payloadGaps = ['Docker', 'System Design']; // defaults
      const res = await cOS.generateFusedRoadmap(targetTrajectory?.skills || [], payloadGaps);
      
      if (res && Array.isArray(res)) {
        setPreviewModules(res);
        
        // Also update onboardingAnswers context values
        cOS.setOnboarding({
          role: targetLabel,
          education: onboardingAnswers?.education || 'Self-Taught',
          skills: skillsList,
          experience: experienceLevel
        });

        // Advance onboarding state if needed
        if (onboardingStep < 4) {
          cOS.setOnboardingStep(4);
        }

        toast.success('AI Roadmap Synthesized! 🧬', 'Your custom quest roadmap structure is ready.');
      } else {
        toast.error('AI Generation Failed', 'Falling back to baseline templates.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error', 'An error occurred during roadmap generation.');
    } finally {
      setLoading(false);
    }
  };

  // Commit and unlock Quests page
  const handleActivateRoadmap = () => {
    cOS.setRoadmapGenerated(true);
    if (onboardingStep < 4) {
      cOS.setOnboardingStep(4);
    }
    toast.success('Quest Roadmap Activated! 🗺️', 'Redirecting to Quests playground.');
    router.push('/quests');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 80 }} className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>🗺️ Career Architecture & ATS Intelligence</h1>
        <p>Synthesize adaptive roadmaps and generate data-driven ATS resumes backed strictly by verified proof of work.</p>
      </div>

      {/* Top View Switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => setActiveView('roadmap')}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1.5px solid ${activeView === 'roadmap' ? 'var(--accent)' : 'var(--border)'}`,
            background: activeView === 'roadmap' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg2)',
            color: activeView === 'roadmap' ? 'var(--accent)' : 'var(--t2)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.15s ease',
          }}
        >
          🧬 Custom Roadmap Fuser
        </button>
        <button
          onClick={() => setActiveView('resume')}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1.5px solid ${activeView === 'resume' ? 'var(--accent)' : 'var(--border)'}`,
            background: activeView === 'resume' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg2)',
            color: activeView === 'resume' ? 'var(--accent)' : 'var(--t2)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.15s ease',
          }}
        >
          📄 AI Resume & ATS Gap Loop
        </button>
      </div>

      {activeView === 'resume' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 28 }}>
          {/* Left Panel: ATS Job Description Scanner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  🎯 TARGET JOB DESCRIPTION SCANNER
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 0' }}>
                  ATS Keyword & Taxonomy Gap Matcher
                </h3>
                <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>
                  Paste any job description to match against your verified PinIT skills without fabricated gaps.
                </p>
              </div>

              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste Target Job Description here (e.g. Senior Full-Stack Engineer requiring React, TypeScript, PostgreSQL, Docker, and Concurrency)..."
                rows={7}
                style={{
                  width: '100%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 12,
                  color: 'var(--t1)',
                  fontSize: 12.5,
                  fontFamily: 'var(--font-mono)',
                  resize: 'vertical',
                }}
              />

              <button
                onClick={handleScanJobDescription}
                style={{
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Scan Job Description with ATS Engine ➔
              </button>

              {atsScore !== null && (
                <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>ATS Match Score:</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: atsScore >= 80 ? 'var(--green)' : atsScore >= 60 ? '#3b82f6' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                      {atsScore}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Detected Taxonomy Gaps:</div>
                    {atsGaps.map((gap, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '6px 10px', borderRadius: 8, background: gap.isSatisfied ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', border: `1px solid ${gap.isSatisfied ? '#10b98130' : '#ef444430'}` }}>
                        <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{gap.taxonomyTerm}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 9.5, textTransform: 'uppercase', padding: '1px 5px', borderRadius: 4, background: gap.importance === 'required' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: gap.importance === 'required' ? '#ef4444' : '#f59e0b', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                            {gap.importance}
                          </span>
                          <span style={{ fontSize: 11, color: gap.isSatisfied ? '#10b981' : '#ef4444', fontWeight: 800 }}>
                            {gap.isSatisfied ? '✓ Verified' : '✗ Missing'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {atsGaps.some(g => !g.isSatisfied) && (
                    <button
                      onClick={handleAcceptGaps}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px solid var(--accent)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--accent)',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        marginTop: 4,
                      }}
                    >
                      ✓ Accept & Add Missing Skills to Roadmap
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Auto-Populated ATS Resume Preview */}
          <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                  📄 Live ATS Resume Preview
                </h3>
                <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                  Auto-populated from real verified evidence records
                </span>
              </div>
              <button
                onClick={() => {
                  const roleStr = typeof onboardingAnswers?.role === 'string' ? onboardingAnswers.role : 'Full-Stack SDE';
                  navigator.clipboard.writeText(`CANDIDATE: ${user?.name || 'Student'}\nTARGET: ${roleStr}\nVERIFIED SKILLS:\n${(skillProfile?.verified || []).map(v => `- ${v.name} (Score: ${Math.round(v.score)}/100, Level: ${v.level})`).join('\n')}`);
                  toast.success('Copied ATS Resume! 📋', 'Copied markdown resume to clipboard.');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t1)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Copy Markdown 📋
              </button>
            </div>

            <div style={{ background: 'var(--bg3)', padding: 18, borderRadius: 12, border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--t1)', lineHeight: 1.6 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>
                {typeof user?.name === 'string' ? user.name : 'Engineering Student'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                Target: {typeof onboardingAnswers?.role === 'string' ? onboardingAnswers.role : 'Full-Stack Software Engineer'} &middot; PinIT Verified Candidate
              </div>
              
              <div style={{ margin: '14px 0 6px', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
                🟢 VERIFIED TECHNICAL COMPETENCIES:
              </div>
              {(skillProfile?.verified || []).length > 0 ? (
                skillProfile?.verified.map(v => (
                  <div key={v.id} style={{ fontSize: 11, color: 'var(--t2)' }}>
                    • <strong>{v.name}</strong> ({v.level}) — Evaluated Composite: {Math.round(v.score)}/100 [SHA-256 Validated]
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>• Computer Architecture & Git Fundamentals (In Progress)</div>
              )}

              <div style={{ margin: '14px 0 6px', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
                💼 EXTERNAL INTERNSHIP RECORDS:
              </div>
              {internships.length > 0 ? (
                internships.map(intern => (
                  <div key={intern.id} style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 4 }}>
                    • <strong>{intern.role}</strong> at {intern.companyName} ({intern.startDate} to {intern.endDate || 'Present'})<br />
                    &nbsp;&nbsp;{intern.projectDescription}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>• PinIT Simulated Production Engineering Residency (Active)</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: previewModules.length > 0 ? '1fr 1.2fr' : '1fr', gap: 28 }}>
          {/* Left Panel: Settings / Configuration */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginBottom: 8, letterSpacing: '-0.3px' }}>
                  1. Select Target SDE Trajectory
                </h2>
                <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16 }}>
                  Choose the trajectory track you want to master. Content is served dynamic to this track.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {TRAJECTORIES.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrajectory(t.id)}
                      style={{
                        padding: 16,
                        borderRadius: 14,
                        border: `1.5px solid ${selectedTrajectory === t.id ? t.color : 'var(--border)'}`,
                        background: selectedTrajectory === t.id ? `${t.color}08` : 'var(--bg2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{t.icon}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>{t.title}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{t.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateRoadmap}
                disabled={loading}
                style={{
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                {loading ? 'Compiling Dynamic Socratic Roadmap...' : '⚡ Synthesize Custom AI Roadmap'}
              </button>
            </div>
          </section>

          {/* Right Panel: Module & Quest Preview */}
          {previewModules.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>
                  Compiled Quest Trajectory ({previewModules.length} Stages)
                </h2>
                <button
                  onClick={handleActivateRoadmap}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--green)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Activate & Enter Playground ➔
                </button>
              </div>

              {/* Timeline tree layout */}
              <div style={{ position: 'relative', paddingLeft: 30 }}>
                <div style={{
                  position: 'absolute',
                  top: 10,
                  bottom: 10,
                  left: 10,
                  width: 2,
                  background: 'linear-gradient(180deg, var(--accent) 0%, var(--teal) 100%)',
                  opacity: 0.3
                }} />

                {previewModules.map((mod, modIdx) => (
                  <div key={mod.id || modIdx} style={{ marginBottom: 28, position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: -26,
                      top: 4,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: 'var(--bg1)',
                      border: '3px solid var(--accent)',
                      boxShadow: '0 0 8px var(--accent)',
                      zIndex: 2
                    }} />

                    <div style={{
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                          STAGE {modIdx + 1}
                        </span>
                        <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>
                          ⏳ {mod.estimatedWeeks || 2} Weeks
                        </span>
                      </div>

                      <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{mod.title}</h3>
                      <p style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4, lineHeight: 1.4 }}>{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
