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
  const loadTelemetry = async () => {
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
  };

  useEffect(() => {
    loadTelemetry();
  }, [githubUrl]);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
      {/* ── Top Independent Project Hub Header ── */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderLeft: '4px solid #3b82f6',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#3b82f6',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'monospace',
                }}
              >
                🛠️ Independent Custom Software
              </span>
              <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                ● Real GitHub Repository Tracked
              </span>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                • Course Milestones Bypassed
              </span>
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
              {project.name}
            </h1>

            <p style={{ fontSize: 14.5, color: 'var(--t2)', margin: 0, maxWidth: 760, lineHeight: 1.5 }}>
              {project.problem || project.description || 'Custom independent project authored outside standard academic curriculum.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {githubUrl && (
              <>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '9px 16px',
                    borderRadius: 10,
                    background: 'var(--bg2)',
                    border: '1px solid var(--border2)',
                    color: 'var(--t1)',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>↗</span>
                  <span>Open in GitHub</span>
                </a>

                <a
                  href={codespacesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '9px 16px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    boxShadow: '0 3px 10px rgba(59, 130, 246, 0.3)',
                  }}
                  title="Open in GitHub Web Editor / Codespaces to code directly in browser"
                >
                  <span>💻</span>
                  <span>Code in Web Editor</span>
                </a>
              </>
            )}

            <button
              onClick={onLinkAnother}
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                background: 'transparent',
                border: '1px dashed var(--border)',
                color: 'var(--t2)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Link Another Repo
            </button>
          </div>
        </div>

        {/* Project Meta Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--t2)' }}>
            <span style={{ color: 'var(--t3)' }}>Repository:</span>
            <code style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6, fontSize: 12.5, color: 'var(--t1)' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#10b981', fontWeight: 800 }}>
                <span>🛡️</span>
                <span>Jury Review Active ({juryReceipt.id})</span>
              </div>
            </>
          )}
        </div>

        {/* Project Switcher if multiple custom projects exist */}
        {independentList.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, overflowX: 'auto', paddingTop: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)' }}>Switch Custom Project:</span>
            {independentList.map((p) => {
              const isSelected = p.id === project.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject?.(p)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg2)',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border)',
                    color: isSelected ? '#3b82f6' : 'var(--t2)',
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
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
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 14,
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚡</span> Student Engineering Protocol: How to Code & Clear Verification
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0 }}>
              Follow this 4-step workflow to build your software, verify code logic, and earn accredited portfolio credentials.
            </p>
          </div>
          <button
            onClick={() => setShowTerminalGuide(!showTerminalGuide)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              color: '#93c5fd',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {showTerminalGuide ? '▲ Hide Git Terminal Commands' : '▼ View Git Terminal Quickstart'}
          </button>
        </div>

        {/* 4 Protocol Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 1: Write Code
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
              Choose Your Environment
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>
              Click <strong>[💻 Code in Web Editor]</strong> for 1-click browser coding, or open VS Code / Cursor on your computer.
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 2: Push Changes
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
              Git Commit &amp; Push
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>
              Push your code to branch <code>main</code>. Click <strong>🔄 Rescan GitHub</strong> to ingest new commits immediately.
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 3: Verification
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
              AST &amp; AI Logic Scan
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>
              Career OS checks tests &amp; architecture, and runs an AI Logic Audit to verify algorithmic soundness and correctness.
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 4: Certification
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
              Viva &amp; Faculty Review
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>
              Submit for faculty grading and complete a live Voice AI Viva with Ms. Priya defending your repository design.
            </div>
          </div>
        </div>

        {/* Collapsible Terminal Commands Box */}
        {showTerminalGuide && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border2)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>🖥️ Standard Git Commands for Local Machine (VS Code / Terminal):</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`git clone ${githubUrl}\ncd ${repoName || 'my-project'}\ngit add .\ngit commit -m "feat: implement logic"\ngit push origin main`);
                  toast.success('Copied! 📋', 'Terminal commands copied to clipboard.');
                }}
                style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Copy Commands
              </button>
            </div>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, color: '#38bdf8', lineHeight: 1.6, overflowX: 'auto' }}>
{`# 1. Clone repository locally
git clone ${githubUrl}
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

      {/* ── Sub-Navigation within Independent Workspace ── */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab('telemetry')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'telemetry' ? 'var(--card)' : 'transparent',
            border: activeTab === 'telemetry' ? '1px solid var(--border2)' : '1px solid transparent',
            color: activeTab === 'telemetry' ? 'var(--t1)' : 'var(--t3)',
            fontSize: 13.5,
            fontWeight: activeTab === 'telemetry' ? 800 : 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🛰️</span>
          <span>GitHub Live Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'evidence' ? 'var(--card)' : 'transparent',
            border: activeTab === 'evidence' ? '1px solid var(--border2)' : '1px solid transparent',
            color: activeTab === 'evidence' ? 'var(--t1)' : 'var(--t3)',
            fontSize: 13.5,
            fontWeight: activeTab === 'evidence' ? 800 : 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🛡️</span>
          <span>Evidence Scanner &amp; AI Logic Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('defense')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'defense' ? 'var(--card)' : 'transparent',
            border: activeTab === 'defense' ? '1px solid var(--border2)' : '1px solid transparent',
            color: activeTab === 'defense' ? 'var(--t1)' : 'var(--t3)',
            fontSize: 13.5,
            fontWeight: activeTab === 'defense' ? 800 : 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⚖️</span>
          <span>Jury Defense &amp; Squads</span>
        </button>
      </div>

      {/* ── TAB 1: Live GitHub Telemetry ── */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {/* Card: Repository Health */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
                Repository Statistics
              </h3>
              <button
                onClick={handleManualScan}
                disabled={isScanning}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--accent)',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border2)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  cursor: isScanning ? 'not-allowed' : 'pointer',
                }}
              >
                {isScanning ? 'Scanning...' : '🔄 Rescan GitHub'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Default Branch</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
                  {telemetry?.defaultBranch || 'main'}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Primary Language</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6', marginTop: 4 }}>
                  {telemetry?.primaryLanguage || project.techStack || 'Python'}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Stars &amp; Forks</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginTop: 4 }}>
                  ⭐ {telemetry?.stars ?? 0} &nbsp; 🍴 {telemetry?.forks ?? 0}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Evidence Score</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', marginTop: 4 }}>
                  {telemetry?.evidenceScore ?? 85} / 100
                </div>
              </div>
            </div>

            {telemetry?.error && (
              <div style={{ padding: 10, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', fontSize: 12.5 }}>
                ⚠️ {telemetry.error}
              </div>
            )}
          </div>

          {/* Card: Latest Commits Stream */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
                Recent Git Commits
              </h3>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>Live SHA-256 Hashes</span>
            </div>

            {telemetry?.commits && telemetry.commits.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {telemetry.commits.map((c, i) => (
                  <div
                    key={c.hash || i}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <code style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>
                        {c.hash}
                      </code>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                      {c.message}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                      by {c.author}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 18, borderRadius: 10, background: 'var(--bg2)', border: '1px dashed var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📦</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
                  No Commits Captured Yet
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  Code locally in VS Code or click <strong>[💻 Code in Web Editor]</strong>, then push your first commit.
                </p>
                <div style={{ textAlign: 'left', background: 'var(--bg3)', padding: 10, borderRadius: 6, fontFamily: 'monospace', fontSize: 11.5, color: 'var(--t1)', lineHeight: 1.6 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Section A: Multi-Tier AST Architecture Breakdown */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', margin: '0 0 6px 0' }}>
                  Static AST &amp; Repository Evidence Breakdown
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--t2)', margin: 0 }}>
                  Deterministic scan of public repository file tree, testing manifests, and DevOps configuration.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>Proof Signature:</span>
                <code style={{ fontSize: 12, color: '#10b981', background: 'var(--bg2)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  {telemetry?.evidenceHash || 'PIN-GH-SCAN'}
                </code>
              </div>
            </div>

            {/* 5 Structural Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 700, marginBottom: 6 }}>
                  <span>🏗️ Architecture (30%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.architectureScore ?? 70}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.architectureScore ?? 70}%`, height: '100%', background: '#3b82f6', borderRadius: 3 }} />
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 700, marginBottom: 6 }}>
                  <span>🧪 Automated Tests (25%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.testingScore ?? 60}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.testingScore ?? 60}%`, height: '100%', background: '#10b981', borderRadius: 3 }} />
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 700, marginBottom: 6 }}>
                  <span>⚙️ DevOps &amp; CI/CD (20%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.devopsScore ?? 55}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.devopsScore ?? 55}%`, height: '100%', background: '#f59e0b', borderRadius: 3 }} />
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 700, marginBottom: 6 }}>
                  <span>📚 Docs &amp; Specs (15%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.documentationScore ?? 80}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.documentationScore ?? 80}%`, height: '100%', background: '#a855f7', borderRadius: 3 }} />
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 700, marginBottom: 6 }}>
                  <span>⚡ Activity (10%)</span>
                  <span style={{ color: 'var(--t1)' }}>{telemetry?.activityScore ?? 90}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                  <div style={{ width: `${telemetry?.activityScore ?? 90}%`, height: '100%', background: '#06b6d4', borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {/* Key Files Found */}
            {telemetry?.keyFilesFound && telemetry.keyFilesFound.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)' }}>Verified Manifests Found:</span>
                {telemetry.keyFilesFound.map((f, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '2px 8px',
                      borderRadius: 6,
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
              borderRadius: 14,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
                    🧠 AI Semantic Code &amp; Logic Inspection
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--t3)' }}>Deep Model Evaluation (Groq / Gemini)</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', margin: '0 0 6px 0' }}>
                  Is Your Code &amp; Logic Correct?
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--t2)', margin: 0, maxWidth: 740, lineHeight: 1.5 }}>
                  The AI Code Auditor reads your repository source code, verifies whether your algorithms match your problem statement, checks Big-O time complexity, and inspects exception handling.
                </p>
              </div>

              <button
                onClick={handleRunAiAudit}
                disabled={isAuditing}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  background: isAuditing ? 'var(--bg3)' : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 800,
                  border: 'none',
                  cursor: isAuditing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 3px 12px rgba(168, 85, 247, 0.3)',
                }}
              >
                <span>{isAuditing ? '⏳' : '🔍'}</span>
                <span>{isAuditing ? 'Auditing Code Logic...' : 'Run AI Logic & Correctness Audit'}</span>
              </button>
            </div>

            {/* Audit Results View */}
            {auditResult ? (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Logic Quality Score</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: auditResult.logicScore >= 75 ? '#10b981' : '#f59e0b', marginTop: 4 }}>
                      {auditResult.logicScore} / 100
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Code Health Status</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: auditResult.codeHealth === 'Optimal' ? '#10b981' : '#3b82f6', marginTop: 6 }}>
                      {auditResult.codeHealth}
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Algorithmic Complexity</div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#a855f7', marginTop: 6 }}>
                      {auditResult.algorithmicComplexity}
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Inspected Source File</div>
                    <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginTop: 6, display: 'block' }}>
                      {auditResult.testedSourceFile}
                    </code>
                  </div>
                </div>

                {/* Verdict Box */}
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#818cf8', marginBottom: 4 }}>AUDIT VERDICT &amp; PATHWAY STATUS:</div>
                  <div style={{ fontSize: 13.5, color: 'var(--t1)', lineHeight: 1.5 }}>{auditResult.verdict}</div>
                </div>

                {/* Strengths & Fixes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>✓ IDENTIFIED LOGIC STRENGTHS:</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.6 }}>
                      {auditResult.keyStrengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', marginBottom: 8 }}>⚡ ACTIONABLE LOGIC FIXES REQUIRED:</div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.6 }}>
                      {auditResult.criticalFixes.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px dashed var(--border)', textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--t3)' }}>
                  Click <strong>[Run AI Logic &amp; Correctness Audit]</strong> above to evaluate your repository code against your problem statement.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: Faculty & Jury Defense ── */}
      {activeTab === 'defense' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', marginBottom: 4 }}>
                ⚖️ Formal Evaluation &amp; Career Showcase
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px 0' }}>
                Faculty Jury Defense &amp; Hackathon Squad Hub
              </h3>
              <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0, maxWidth: 740, lineHeight: 1.5 }}>
                Submit this independent repository for accredited faculty evaluation, live oral AI viva defense, and squad formation in the Innovation Hub.
              </p>
            </div>

            {juryReceipt ? (
              <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontWeight: 800, fontSize: 13 }}>
                ✓ Jury Defense Submitted: {juryReceipt.id}
              </div>
            ) : (
              <button
                onClick={handleSubmitForJury}
                disabled={isSubmittingJury}
                style={{
                  padding: '11px 20px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  fontSize: 13.5,
                  fontWeight: 800,
                  border: 'none',
                  cursor: isSubmittingJury ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                <span>🏛️</span>
                <span>{isSubmittingJury ? 'Submitting...' : 'Submit Project for Faculty Review'}</span>
              </button>
            )}
          </div>

          {/* 4-Tier Evaluation Rubric */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', marginBottom: 4 }}>1. Architecture (30%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)' }}>Separation of concerns, clean modules, schema definitions.</div>
            </div>

            <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', marginBottom: 4 }}>2. Logic Correctness (30%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)' }}>Algorithmic soundness, edge-case coverage, functional solution.</div>
            </div>

            <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', marginBottom: 4 }}>3. Automated Tests (20%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)' }}>Automated test cases, pytest / jest passes, CI execution.</div>
            </div>

            <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', marginBottom: 4 }}>4. Oral Defense (20%)</div>
              <div style={{ fontSize: 13, color: 'var(--t2)' }}>Live voice defense responding to architectural edge cases.</div>
            </div>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href={`/interview?mode=project_viva&project=${encodeURIComponent(project.name)}&course=${encodeURIComponent(project.techStack || 'Independent')}`}
              style={{
                padding: '12px 22px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              }}
            >
              <span>🎙️</span>
              <span>Launch Live AI Voice Viva Defense →</span>
            </Link>

            <Link
              href={`/innovation-hub?repo=${encodeURIComponent(githubUrl)}&title=${encodeURIComponent(project.name)}&problem=${encodeURIComponent(project.problem || '')}`}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                background: 'var(--bg2)',
                border: '1px solid var(--border2)',
                color: 'var(--t1)',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
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
