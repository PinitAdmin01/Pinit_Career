'use client';

import React, { useState } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { parseAndValidateGithubUrl } from '@/lib/github/githubIngestion';
import { LinkedRepoItem } from './usePortfolioData';

interface GithubReposSectionProps {
  linkedRepos: LinkedRepoItem[];
  saveLinkedRepos: (next: LinkedRepoItem[]) => void;
}

export function GithubReposSection({ linkedRepos, saveLinkedRepos }: GithubReposSectionProps) {
  const [githubRepoInput, setGithubRepoInput] = useState('');
  const [linkingRepo, setLinkingRepo] = useState(false);

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
      const newEntry: LinkedRepoItem = {
        repoUrl: githubRepoInput.trim(),
        fullName: report.metadata?.fullName || `${check.owner}/${check.repo}`,
        description: report.metadata?.description || 'Public GitHub Repository',
        stars: report.metadata?.stars || 0,
        score: report.overallEvidenceScore || 0,
        skills: (report.detectedSkills || []).map((s: any) => s.skill),
        verifiedAt: new Date().toLocaleDateString()
      };
      const filtered = linkedRepos.filter(r => r.repoUrl.toLowerCase() !== newEntry.repoUrl.toLowerCase());
      const updated = [newEntry, ...filtered];
      saveLinkedRepos(updated);
      setGithubRepoInput('');
      toast.success('Repository Linked & Audited', `${newEntry.fullName} verified with evidence score ${newEntry.score}/100.`);
    } catch (err: any) {
      toast.error('Network Error', err.message || 'Failed to communicate with repository ingestion engine.');
    } finally {
      setLinkingRepo(false);
    }
  };

  const handleUnlink = (repoUrl: string) => {
    const updated = linkedRepos.filter(r => r.repoUrl !== repoUrl);
    saveLinkedRepos(updated);
    toast.success('Repository Unlinked', 'Repository removed from portfolio view.');
  };

  return (
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

      {/* Direct Ingestion Banner */}
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
                    onClick={() => handleUnlink(repo.repoUrl)}
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
  );
}
