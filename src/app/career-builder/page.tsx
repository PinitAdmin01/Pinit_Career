'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';

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

  const [selectedTrajectory, setSelectedTrajectory] = useState<string>('react_frontend');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [previewModules, setPreviewModules] = useState<Module[]>([]);

  // Load roadmap modules on mount if already generated
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
  }, [userId]);

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

  const activeTrajectory = TRAJECTORIES.find(t => t.id === selectedTrajectory);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 80 }} className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 28 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>🗺️ Career Roadmap Architect</h1>
        <p>Fuse your target trajectory with diagnostic criteria to compile dynamic, AI-structured socratic quests.</p>
      </div>

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{t.icon}</span>
                      <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>{t.title}</h3>
                      {selectedTrajectory === t.id && (
                        <span style={{ marginLeft: 'auto', fontSize: 10, background: t.color, color: '#fff', padding: '1px 8px', borderRadius: 10, fontWeight: 700 }}>
                          Selected
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>{t.desc}</p>
                    
                    {/* Skills mapping chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                      {t.skills.map(s => (
                        <span key={s} style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4, color: 'var(--t2)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience level Selection */}
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', marginBottom: 12 }}>
                2. Experience Level Focus
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setExperienceLevel(lvl)}
                    style={{
                      padding: '10px 0',
                      borderRadius: 10,
                      border: `1px solid ${experienceLevel === lvl ? 'var(--accent)' : 'var(--border)'}`,
                      background: experienceLevel === lvl ? 'rgba(99, 102, 241, 0.06)' : 'var(--bg2)',
                      color: experienceLevel === lvl ? 'var(--accent)' : 'var(--t2)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              style={{
                height: 44,
                width: '100%',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
                transition: 'all 0.2s',
                opacity: loading ? 0.65 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                  Synthesizing Roadmap...
                </>
              ) : (
                <>🧬 Generate Dynamic AI Roadmap</>
              )}
            </button>

            {previewModules.length > 0 && (
              <button
                onClick={handleActivateRoadmap}
                style={{
                  height: 42,
                  width: '100%',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1.5px solid var(--teal)',
                  borderRadius: 12,
                  color: 'var(--teal)',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Activate & Launch Quest Workspace ➔
              </button>
            )}
          </div>
        </section>

        {/* Right Panel: Visual Roadmap Timeline (Tree) */}
        {previewModules.length > 0 && (
          <section className="glass-card" style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>Roadmap Tree Visualizer</h2>
                <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Visual outline of AI-graded learning nodes.</p>
              </div>
              <span style={{ fontSize: 10, background: 'rgba(20, 184, 166, 0.1)', color: 'var(--teal)', padding: '2px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                Active Preview
              </span>
            </div>

            {/* Timeline tree layout */}
            <div style={{ position: 'relative', paddingLeft: 30 }}>
              
              {/* Vertical line through timeline */}
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
                  
                  {/* Timeline circle node */}
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

                  {/* Module Card */}
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

                    {/* Quest nodes list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                      {(mod.quests || []).map((q, qIdx) => {
                        let catEmoji = '💻';
                        let catColor = 'var(--teal)';
                        if (q.category === 'learning' || q.type === 'lecture') {
                          catEmoji = '🎓';
                          catColor = 'rgba(167,139,250,1)';
                        } else if (q.category === 'exam') {
                          catEmoji = '📝';
                          catColor = 'var(--coral)';
                        }

                        return (
                          <div key={q.id || qIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 11 }}>{catEmoji}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {q.title}
                              </div>
                              <div style={{ fontSize: 9.5, color: 'var(--t3)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {q.desc}
                              </div>
                            </div>
                            <span style={{ fontSize: 9, color: catColor, fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>
                              {q.category || q.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </section>
        )}

      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
