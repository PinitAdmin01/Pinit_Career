'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/data/projectData';
import {
  fetchGithubLiveTelemetry,
  auditProjectCodeLogic,
  submitProjectForJuryReview,
  GithubLiveTelemetry,
  LogicAuditResponse,
} from '@/lib/api/independentProjectsApi';
import { toast } from '@/lib/store/useAppStore';

interface IndependentWorkspaceProps {
  project: Project;
  onLinkAnother: () => void;
  onSelectProject?: (proj: Project) => void;
  allProjects?: Project[];
  userId?: string;
}

export function IndependentWorkspace({
  project,
  onLinkAnother,
  onSelectProject,
  allProjects = [],
  userId = 'demo_student_01',
}: IndependentWorkspaceProps) {
  const [telemetry, setTelemetry] = useState<GithubLiveTelemetry | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'evidence' | 'defense'>('telemetry');
  const [showTerminalGuide, setShowTerminalGuide] = useState(false);

  // AI Logic & Code Correctness State
  const [auditResult, setAuditResult] = useState<LogicAuditResponse | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Jury Review Submission State
  const [juryReceipt, setJuryReceipt] = useState<{ id: string; date: string } | null>(
    (project as any).juryReceiptId
      ? { id: (project as any).juryReceiptId, date: (project as any).jurySubmittedAt || new Date().toISOString() }
      : null
  );
  const [isSubmittingJury, setIsSubmittingJury] = useState(false);

  const githubUrl = project.githubLink || '';

  // Fetch live GitHub telemetry
  const loadTelemetry = React.useCallback(async () => {
    if (!githubUrl) return;
    setIsScanning(true);
    try {
      const data = await fetchGithubLiveTelemetry(githubUrl);
      setTelemetry(data);
    } catch {
      // Graceful fallback
    } finally {
      setIsScanning(false);
    }
  }, [githubUrl]);

  useEffect(() => {
    loadTelemetry();
  }, [loadTelemetry]);

  const handleManualScan = async () => {
    await loadTelemetry();
    toast.success('Repository Scanned! 🔍', 'Live GitHub telemetry & AST evidence updated.');
  };

  // Run AI Logic Audit
  const handleRunAiAudit = async () => {
    if (!githubUrl) return;
    setIsAuditing(true);
    try {
      const result = await auditProjectCodeLogic(
        githubUrl,
        project.problem || project.description || '',
        project.techStack || 'Python'
      );
      setAuditResult(result);
      if (result.success) {
        toast.success('AI Logic Audit Complete! 🧠', `Logic Score: ${result.logicScore}/100 • Complexity: ${result.algorithmicComplexity}`);
      } else {
        toast.warning('Audit Notice', result.verdict || 'Could not inspect remote code.');
      }
    } catch (e: any) {
      toast.error('Audit Error', e.message || 'Failed to complete AI code inspection.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Submit to Faculty Jury
  const handleSubmitForJury = async () => {
    setIsSubmittingJury(true);
    try {
      const res = await submitProjectForJuryReview(
        userId,
        project,
        telemetry?.evidenceHash || 'DEFENSE'
      );
      if (res.success) {
        setJuryReceipt({ id: res.receiptId, date: res.submittedAt });
        toast.success('Submitted for Faculty Review! 🏛️', `Official Jury Receipt: ${res.receiptId}`);
      }
    } catch (err: any) {
      toast.error('Submission Failed', err.message || 'Could not log jury defense.');
    } finally {
      setIsSubmittingJury(false);
    }
  };

  // Derive repo owner and repo name from URL
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  const repoOwner = match ? match[1] : '';
  const repoName = match ? match[2].replace(/\.git$/, '') : '';
  const codespacesUrl = repoOwner && repoName ? `https://github.dev/${repoOwner}/${repoName}` : githubUrl;

  const independentList = allProjects.filter(
    (p) => !p.isTemplate || Boolean(p.githubLink) || p.id.startsWith('custom_proj_')
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="fade-in">
      {/* ── Top Independent Project Hub Header (God-Level Semantic Adaptive Hero) ── */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '28px 32px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow accent */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
          <div style={{ flex: '1 1 540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: 'var(--blue, #3b82f6)',
                  background: 'var(--blue-light, rgba(59, 130, 246, 0.12))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  fontFamily: 'var(--font-mono, monospace)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>🛠️</span> Independent Custom Software
              </span>
              <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                ● Real GitHub Repository Tracked
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: 'var(--success, #10b981)',
                  background: 'var(--green-light, rgba(16, 185, 129, 0.12))',
                  border: '1px solid rgba(16, 185, 129, 0.28)',
                  padding: '3px 9px',
                  borderRadius: 20,
                }}
              >
                ✓ Course Milestones Bypassed
              </span>
            </div>

            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: 'var(--t1)',
                margin: '0 0 10px 0',
                letterSpacing: '-0.5px',
                lineHeight: 1.25,
              }}
            >
              {project.name}
            </h1>

            <p style={{ fontSize: 14.5, color: 'var(--t2)', margin: 0, maxWidth: 780, lineHeight: 1.6 }}>
              {project.problem || project.description || 'Custom independent project authored outside standard academic curriculum.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {githubUrl && (
              <>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 18px',
                    borderRadius: 12,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <span style={{ fontSize: 14 }}>↗</span>
                  <span>Open in GitHub</span>
                </a>

                <a
                  href={codespacesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  title="Open in GitHub Web Editor / Codespaces to code directly in browser"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.35)';
                  }}
                >
                  <span style={{ fontSize: 14 }}>💻</span>
                  <span>Code in Web Editor</span>
                </a>
              </>
            )}

            <button
              onClick={onLinkAnother}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                background: 'transparent',
                border: '1px dashed var(--border2)',
                color: 'var(--t2)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border2)';
                e.currentTarget.style.color = 'var(--t2)';
              }}
            >
              + Link Another Repo
            </button>
          </div>
        </div>

        {/* Project Meta Pills (Refined Pixel-Perfect Alignment) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--t2)' }}>
            <span style={{ color: 'var(--t3)' }}>Repository:</span>
            <code style={{ background: 'var(--bg3)', padding: '3px 8px', borderRadius: 6, fontSize: 12.5, color: 'var(--accent)', border: '1px solid var(--border)' }}>
              {githubUrl || 'Not linked'}
            </code>
          </div>
          <span style={{ color: 'var(--border2)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--t2)' }}>
            <span style={{ color: 'var(--t3)' }}>Tech Stack:</span>
            <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{project.techStack || 'Python'}</span>
          </div>
          <span style={{ color: 'var(--border2)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--t2)' }}>
            <span style={{ color: 'var(--t3)' }}>Evidence XP:</span>
            <span style={{ fontWeight: 800, color: '#f59e0b' }}>+{project.xpReward || 350} XP</span>
          </div>
          {juryReceipt && (
            <>
              <span style={{ color: 'var(--border2)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--success, #10b981)', fontWeight: 800 }}>
                <span>🛡️</span>
                <span>Jury Review Active ({juryReceipt.id})</span>
              </div>
            </>
          )}
        </div>

        {/* Project Switcher if multiple custom projects exist */}
        {independentList.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, overflowX: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', whiteSpace: 'nowrap' }}>Switch Custom Project:</span>
            {independentList.map((p) => {
              const isSelected = p.id === project.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject?.(p)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: isSelected ? 'var(--accent-light)' : 'var(--bg3)',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                    color: isSelected ? 'var(--accent)' : 'var(--t2)',
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 🚀 STUDENT ENGINEERING PROTOCOL (Step-by-Step Developer Guide) ── */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderLeft: '4px solid var(--accent)',
          borderRadius: 18,
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--accent)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.2px' }}>
              <span>⚡</span> Student Engineering Protocol: How to Code &amp; Clear Verification
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>
              Follow this 4-step workflow to build your software, verify code logic, and earn accredited portfolio credentials.
            </p>
          </div>
          <button
            onClick={() => setShowTerminalGuide(!showTerminalGuide)}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              background: 'var(--accent-light)',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {showTerminalGuide ? '▲ Hide Git Terminal Commands' : '▼ View Git Terminal Quickstart'}
          </button>
        </div>

        {/* 4 Protocol Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderTop: '2px solid #3b82f6',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
              Step 1: Write Code
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 5 }}>
              Choose Your Environment
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>
              Click <strong>[💻 Code in Web Editor]</strong> for 1-click browser coding, or open VS Code / Cursor on your machine.
            </div>
          </div>

          <div
            style={{
              padding: '16px 18px',
              borderRadius: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderTop: '2px solid #10b981',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
              Step 2: Push Changes
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 5 }}>
              Git Commit &amp; Push
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>
              Push your code to branch <code>main</code>. Click <strong>🔄 Rescan GitHub</strong> to ingest new commits immediately.
            </div>
          </div>

          <div
            style={{
              padding: '16px 18px',
              borderRadius: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderTop: '2px solid #f59e0b',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
              Step 3: Verification
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 5 }}>
              AST &amp; AI Logic Scan
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>
              Career OS checks tests &amp; architecture, and runs an AI Logic Audit to verify algorithmic soundness and correctness.
            </div>
          </div>

          <div
            style={{
              padding: '16px 18px',
              borderRadius: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderTop: '2px solid #a855f7',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
              Step 4: Certification
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 5 }}>
              Viva &amp; Faculty Review
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>
              Submit for faculty grading and complete a live Voice AI Viva with Ms. Priya defending your repository design.
            </div>
          </div>
        </div>

        {/* Collapsible Terminal Commands Box (Crisp Terminal Shell) */}
        {showTerminalGuide && (
          <div style={{ marginTop: 16, padding: '16px 20px', borderRadius: 14, background: '#090d16', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#94a3b8', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🖥️</span> Standard Git Commands for Local Machine (VS Code / Terminal):
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`git clone ${githubUrl || 'https://github.com/username/repository'}\ncd ${repoName || 'my-project'}\ngit add .\ngit commit -m "feat: implement logic"\ngit push origin main`);
                  toast.success('Copied! 📋', 'Terminal commands copied to clipboard.');
                }}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  color: '#60a5fa',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.15s ease',
                }}
              >
                Copy Commands
              </button>
            </div>
            <pre style={{ margin: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: 12.5, color: '#38bdf8', lineHeight: 1.7, overflowX: 'auto' }}>
{`# 1. Clone repository locally
git clone ${githubUrl || 'https://github.com/username/repository'}
cd ${repoName || 'my-project'}

# 2. Write your code, add unit tests, and save files
# 3. Commit and push to GitHub
git add .
git commit -m "feat: implement functional logic and unit tests"
git push origin main`}
            </pre>
          </div>
        )}
      </div>

      {/* ── Sub-Navigation within Independent Workspace (Segmented Pill Bar) ── */}
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 5,
          gap: 6,
          boxShadow: 'var(--shadow-sm)',
          alignSelf: 'flex-start',
        }}
      >
        <button
          onClick={() => setActiveTab('telemetry')}
          style={{
            padding: '9px 18px',
            borderRadius: 10,
            background: activeTab === 'telemetry' ? 'var(--accent-light)' : 'transparent',
            border: activeTab === 'telemetry' ? '1px solid var(--accent)' : '1px solid transparent',
            color: activeTab === 'telemetry' ? 'var(--accent)' : 'var(--t2)',
            fontSize: 13.5,
            fontWeight: activeTab === 'telemetry' ? 800 : 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            boxShadow: activeTab === 'telemetry' ? '0 2px 8px var(--accent-glow)' : 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'telemetry') {
              e.currentTarget.style.background = 'var(--bg3)';
              e.currentTarget.style.color = 'var(--t1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'telemetry') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--t2)';
            }
          }}
        >
          <span>🛰️</span>
          <span>GitHub Live Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '9px 18px',
            borderRadius: 10,
            background: activeTab === 'evidence' ? 'var(--accent-light)' : 'transparent',
            border: activeTab === 'evidence' ? '1px solid var(--accent)' : '1px solid transparent',
            color: activeTab === 'evidence' ? 'var(--accent)' : 'var(--t2)',
            fontSize: 13.5,
            fontWeight: activeTab === 'evidence' ? 800 : 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            boxShadow: activeTab === 'evidence' ? '0 2px 8px var(--accent-glow)' : 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'evidence') {
              e.currentTarget.style.background = 'var(--bg3)';
              e.currentTarget.style.color = 'var(--t1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'evidence') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--t2)';
            }
          }}
        >
          <span>🛡️</span>
          <span>Evidence Scanner &amp; AI Logic Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('defense')}
          style={{
            padding: '9px 18px',
            borderRadius: 10,
            background: activeTab === 'defense' ? 'var(--accent-light)' : 'transparent',
            border: activeTab === 'defense' ? '1px solid var(--accent)' : '1px solid transparent',
            color: activeTab === 'defense' ? 'var(--accent)' : 'var(--t2)',
            fontSize: 13.5,
            fontWeight: activeTab === 'defense' ? 800 : 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            boxShadow: activeTab === 'defense' ? '0 2px 8px var(--accent-glow)' : 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'defense') {
              e.currentTarget.style.background = 'var(--bg3)';
              e.currentTarget.style.color = 'var(--t1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'defense') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--t2)';
            }
          }}
        >
          <span>⚖️</span>
          <span>Jury Defense &amp; Squads</span>
        </button>
      </div>

      {/* ── TAB 1: Live GitHub Telemetry ── */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Card: Repository Health */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: 24,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', margin: 0, letterSpacing: '-0.2px' }}>
                Repository Statistics
              </h3>
              <button
                onClick={handleManualScan}
                disabled={isScanning}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--blue, #3b82f6)',
                  background: 'var(--blue-light, rgba(59, 130, 246, 0.12))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '5px 12px',
                  borderRadius: 8,
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isScanning ? 'Scanning...' : '🔄 Rescan GitHub'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Branch</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>
                  {telemetry?.defaultBranch || 'main'}
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Language</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--blue, #3b82f6)', marginTop: 4 }}>
                  {telemetry?.primaryLanguage || project.techStack || 'Python'}
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stars &amp; Forks</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b', marginTop: 4 }}>
                  ⭐ {telemetry?.stars ?? 0} &nbsp; 🍴 {telemetry?.forks ?? 0}
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--green-light, rgba(16, 185, 129, 0.08))', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ fontSize: 11, color: 'var(--success, #10b981)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evidence Score</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--success, #10b981)', marginTop: 4 }}>
                  {telemetry?.evidenceScore ?? 85} / 100
                </div>
              </div>
            </div>

            {telemetry?.error && (
              <div style={{ padding: 12, borderRadius: 10, background: 'var(--coral-light, rgba(239, 68, 68, 0.1))', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', fontSize: 13 }}>
                ⚠️ {telemetry.error}
              </div>
            )}
          </div>

          {/* Card: Latest Commits Stream */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: 24,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', margin: 0, letterSpacing: '-0.2px' }}>
                Recent Git Commits
              </h3>
              <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>Live SHA-256 Hashes</span>
            </div>

            {telemetry?.commits && telemetry.commits.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {telemetry.commits.map((c, i) => (
                  <div
                    key={c.hash || i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <code style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, background: 'var(--accent-light)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '2px 7px', borderRadius: 5 }}>
                        {c.hash}
                      </code>
                      <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginTop: 2 }}>
                      {c.message}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                      by {c.author}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px 20px', borderRadius: 14, background: 'var(--bg3)', border: '1px dashed var(--border2)', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>📦</div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
                  No Commits Captured Yet
                </div>
                <p style={{ fontSize: 13, color: 'var(--t3)', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                  Code locally in VS Code or click <strong>[💻 Code in Web Editor]</strong>, then push your first commit.
                </p>
                <div style={{ textAlign: 'left', background: '#090d16', padding: 12, borderRadius: 10, fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: '#38bdf8', lineHeight: 1.6, border: '1px solid #1e293b' }}>
                  git remote add origin {githubUrl}<br />
                  git add .<br />
                  git commit -m &quot;feat: initial commit&quot;<br />
                  git push -u origin main
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Evidence Scanner & AI Logic Audit ── */}
      {activeTab === 'evidence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Section A: Multi-Tier AST Architecture Breakdown */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: '28px 30px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
                  Static AST &amp; Repository Evidence Breakdown
                </h3>
                <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0 }}>
                  Deterministic scan of public repository file tree, testing manifests, and DevOps configuration.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>Proof Signature:</span>
                <code style={{ fontSize: 12.5, color: '#10b981', background: 'var(--green-light, rgba(16, 185, 129, 0.12))', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 800 }}>
                  {telemetry?.evidenceHash || 'PIN-GH-SCAN'}
                </code>
              </div>
            </div>

            {/* 5 Structural Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 800, marginBottom: 8, letterSpacing: '0.3px' }}>
                  <span>🏗️ Architecture (30%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.architectureScore ?? 70}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.architectureScore ?? 70}%`, height: '100%', background: '#3b82f6', borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 800, marginBottom: 8, letterSpacing: '0.3px' }}>
                  <span>🧪 Automated Tests (25%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.testingScore ?? 60}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.testingScore ?? 60}%`, height: '100%', background: '#10b981', borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 800, marginBottom: 8, letterSpacing: '0.3px' }}>
                  <span>⚙️ DevOps &amp; CI/CD (20%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.devopsScore ?? 55}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.devopsScore ?? 55}%`, height: '100%', background: '#f59e0b', borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 800, marginBottom: 8, letterSpacing: '0.3px' }}>
                  <span>📚 Docs &amp; Specs (15%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.documentationScore ?? 80}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.documentationScore ?? 80}%`, height: '100%', background: '#a855f7', borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 800, marginBottom: 8, letterSpacing: '0.3px' }}>
                  <span>⚡ Activity (10%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.activityScore ?? 90}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.activityScore ?? 90}%`, height: '100%', background: '#06b6d4', borderRadius: 4 }} />
                </div>
              </div>
            </div>

            {/* Key Files Found */}
            {telemetry?.keyFilesFound && telemetry.keyFilesFound.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t3)' }}>Verified Manifests Found:</span>
                {telemetry.keyFilesFound.map((f, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'var(--green-light, rgba(16, 185, 129, 0.12))',
                      border: '1px solid rgba(16, 185, 129, 0.28)',
                      padding: '3px 9px',
                      borderRadius: 8,
                    }}
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Deep AI Code Logic & Algorithmic Correctness Auditor */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderLeft: '4px solid #a855f7',
              borderRadius: 18,
              padding: '28px 30px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#c084fc', background: 'rgba(168, 85, 247, 0.14)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🧠 AI Semantic Code &amp; Logic Inspection
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>Deep Model Evaluation (Groq / Gemini)</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
                  Is Your Code &amp; Logic Correct?
                </h3>
                <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0, maxWidth: 740, lineHeight: 1.55 }}>
                  The AI Code Auditor reads your repository source code, verifies whether your algorithms match your problem statement, checks Big-O time complexity, and inspects exception handling.
                </p>
              </div>

              <button
                onClick={handleRunAiAudit}
                disabled={isAuditing}
                style={{
                  padding: '11px 20px',
                  borderRadius: 12,
                  background: isAuditing ? 'var(--bg3)' : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: isAuditing ? 'var(--t3)' : '#fff',
                  fontSize: 13.5,
                  fontWeight: 800,
                  border: isAuditing ? '1px solid var(--border)' : 'none',
                  cursor: isAuditing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isAuditing ? 'none' : '0 4px 16px rgba(168, 85, 247, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span>{isAuditing ? '⏳' : '🔍'}</span>
                <span>{isAuditing ? 'Auditing Code Logic...' : 'Run AI Logic & Correctness Audit'}</span>
              </button>
            </div>

            {/* Audit Results View */}
            {auditResult ? (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logic Quality Score</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: auditResult.logicScore >= 75 ? '#10b981' : '#f59e0b', marginTop: 4 }}>
                      {auditResult.logicScore} / 100
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code Health Status</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: auditResult.codeHealth === 'Optimal' ? '#10b981' : '#60a5fa', marginTop: 6 }}>
                      {auditResult.codeHealth}
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Algorithmic Complexity</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#c084fc', marginTop: 6 }}>
                      {auditResult.algorithmicComplexity}
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inspected Source File</div>
                    <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue, #38bdf8)', marginTop: 6, display: 'block' }}>
                      {auditResult.testedSourceFile}
                    </code>
                  </div>
                </div>

                {/* Verdict Box */}
                <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--accent-light)', border: '1px solid rgba(99, 102, 241, 0.25)', borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    AUDIT VERDICT &amp; PATHWAY STATUS:
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--t1)', lineHeight: 1.6 }}>{auditResult.verdict}</div>
                </div>

                {/* Strengths & Fixes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  <div style={{ padding: '18px 20px', borderRadius: 14, background: 'var(--green-light, rgba(16, 185, 129, 0.08))', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', letterSpacing: '0.4px', marginBottom: 10 }}>✓ IDENTIFIED LOGIC STRENGTHS:</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--t1)', lineHeight: 1.7 }}>
                      {auditResult.keyStrengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: '18px 20px', borderRadius: 14, background: 'var(--amber-light, rgba(245, 158, 11, 0.08))', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.4px', marginBottom: 10 }}>⚡ ACTIONABLE LOGIC FIXES REQUIRED:</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--t1)', lineHeight: 1.7 }}>
                      {auditResult.criticalFixes.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 16, padding: '18px 20px', borderRadius: 12, background: 'var(--bg3)', border: '1px dashed var(--border2)', textAlign: 'center' }}>
                <span style={{ fontSize: 13.5, color: 'var(--t3)' }}>
                  Click <strong>[Run AI Logic &amp; Correctness Audit]</strong> above to evaluate your repository code against your problem statement.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: Faculty & Jury Defense ── */}
      {activeTab === 'defense' && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>
                ⚖️ Formal Evaluation &amp; Career Showcase
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
                Faculty Jury Defense &amp; Hackathon Squad Hub
              </h3>
              <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0, maxWidth: 740, lineHeight: 1.55 }}>
                Submit this independent repository for accredited faculty evaluation, live oral AI viva defense, and squad formation in the Innovation Hub.
              </p>
            </div>

            {juryReceipt ? (
              <div style={{ padding: '9px 18px', borderRadius: 12, background: 'var(--green-light)', border: '1px solid #10b981', color: '#10b981', fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>✓</span> Jury Defense Submitted: {juryReceipt.id}
              </div>
            ) : (
              <button
                onClick={handleSubmitForJury}
                disabled={isSubmittingJury}
                style={{
                  padding: '11px 22px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  fontSize: 13.5,
                  fontWeight: 800,
                  border: 'none',
                  cursor: isSubmittingJury ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span>🏛️</span>
                <span>{isSubmittingJury ? 'Submitting...' : 'Submit Project for Faculty Review'}</span>
              </button>
            )}
          </div>

          {/* 4-Tier Evaluation Rubric */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
            <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa', marginBottom: 4 }}>1. Architecture (30%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>Separation of concerns, clean modules, schema definitions.</div>
            </div>

            <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#34d399', marginBottom: 4 }}>2. Logic Correctness (30%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>Algorithmic soundness, edge-case coverage, functional solution.</div>
            </div>

            <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', marginBottom: 4 }}>3. Automated Tests (20%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>Automated test cases, pytest / jest passes, CI execution.</div>
            </div>

            <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#c084fc', marginBottom: 4 }}>4. Oral Defense (20%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>Live voice defense responding to architectural edge cases.</div>
            </div>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href={`/interview?mode=project_viva&project=${encodeURIComponent(project.name)}&course=${encodeURIComponent(project.techStack || 'Independent')}`}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span>🎙️</span>
              <span>Launch Live AI Voice Viva Defense →</span>
            </Link>

            <Link
              href={`/innovation-hub?repo=${encodeURIComponent(githubUrl)}&title=${encodeURIComponent(project.name)}&problem=${encodeURIComponent(project.problem || '')}`}
              style={{
                padding: '12px 22px',
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <span>🏆</span>
              <span>Form Hackathon Squad in Innovation Hub</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
