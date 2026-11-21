'use client';
// Premium Proof-of-Work Vault, Brutal Skill Defense Launcher & Telemetry Audit Ledgers
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { useVault } from '@/lib/api/hooks';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/store/useAppStore';
import { getLocalTrustScore } from '@/lib/trust/trustEngine';
import {
  extractSkillsFast,
  getActiveUserMentorId,
  resolveVaultAuditorMentor,
  savePendingVaultDefense,
} from '@/lib/vault/vaultDefenseEngine';
import { TelemetryAuditLedger } from '@/components/vault/TelemetryAuditLedger';

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  resume:        { icon: '📄', color: 'var(--accent)', label: 'Master Resume'   },
  certification: { icon: '🏆', color: 'var(--amber)',  label: 'Certification'   },
  internship:    { icon: '🏢', color: 'var(--blue)',   label: 'Internship'      },
  project:       { icon: '⚡', color: 'var(--purple)', label: 'Project'         },
  academic:      { icon: '🎓', color: 'var(--teal)',   label: 'Academic Record' },
  activity:      { icon: '🌟', color: 'var(--gold)',   label: 'Extracurricular' },
  exam:          { icon: '📝', color: 'var(--green)',  label: 'Exam Score'      },
  financial:     { icon: '💵', color: 'var(--pink)',   label: 'Financial Proof' },
  personal:      { icon: '👤', color: 'var(--coral)',  label: 'Personal ID'     },
  other:         { icon: '📎', color: 'var(--t2)',     label: 'Other'           },
};

export default function VaultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const cOS = useCareerOS();
  const { vaultItems: ctxItems, setVaultItems, addVaultItem, updateVaultItem } = cOS;
  const { data: fsVaultData, refetch } = useVault();
  const fsItems = (fsVaultData || []) as any[];
  const fsIds = new Set(fsItems.map((i: any) => i.id));
  const vaultItems = useMemo(
    () => [...fsItems, ...ctxItems.filter((i) => !fsIds.has(i.id))],
    [fsItems, ctxItems]
  );

  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [formEvidenceFile, setFormEvidenceFile] = useState<File | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<{
    id: string;
    title: string;
    itemType: string;
    skills: string[];
    confidence: number;
  } | null>(null);

  const [form, setForm] = useState({
    title: '',
    itemType: 'resume',
    description: '',
    organizationName: '',
    startDate: '',
    endDate: '',
  });

  // Live Trust Score synced with engine + context
  const [liveTrust, setLiveTrust] = useState<number>(() =>
    getLocalTrustScore(user?.id, cOS?.trustScore ?? (user as any)?.trust_score)
  );

  useEffect(() => {
    setLiveTrust(getLocalTrustScore(user?.id, cOS?.trustScore ?? (user as any)?.trust_score));
    const syncTrust = (e: any) => {
      if (typeof e?.detail?.score === 'number') setLiveTrust(e.detail.score);
      else setLiveTrust(getLocalTrustScore(user?.id, cOS?.trustScore));
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit-trust-updated', syncTrust);
      return () => window.removeEventListener('pinit-trust-updated', syncTrust);
    }
  }, [user?.id, cOS?.trustScore, (user as any)?.trust_score]);

  const activeMentorId = getActiveUserMentorId(user);
  const auditor = useMemo(() => resolveVaultAuditorMentor(activeMentorId), [activeMentorId]);

  const getLocalAuditRejection = (itemId: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`pinit_vault_audit_status_${itemId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const launchDefenseRoom = (item: any) => {
    const inferredSkills = extractSkillsFast(
      `${item.title || ''} ${item.description || ''} ${(item.skill_tags || []).join(' ')}`,
      item.skill_tags
    );
    const challengeSkills =
      inferredSkills.length > 0 ? inferredSkills : ['System Design', 'Problem Solving'];

    savePendingVaultDefense({
      docId: item.id,
      userId: user?.id,
      title: item.title || 'Uploaded Credential',
      itemType: item.item_type || 'resume',
      organizationName: item.organization_name || '',
      claimedSkills: challengeSkills,
      auditor,
      createdAt: new Date().toISOString(),
    });

    router.push(`/interview?mode=vault_verify&docId=${encodeURIComponent(item.id)}`);
  };

  const filteredItems =
    filter === 'all' ? vaultItems : vaultItems.filter((item) => item.item_type === filter);

  const total = vaultItems.length;
  const verified_total = vaultItems.filter((i) => i.verified).length;
  const avg_score =
    vaultItems.length > 0
      ? Math.round(vaultItems.reduce((acc, i) => acc + (i.ai_confidence_score ?? 0), 0) / vaultItems.length)
      : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setUploading(true);

    try {
      let extractedSkills = extractSkillsFast(`${form.title} ${form.description}`);
      if (extractedSkills.length === 0) {
        if (form.itemType === 'project') extractedSkills = ['System Architecture', 'Git & CI/CD'];
        else if (form.itemType === 'certification') extractedSkills = ['Applied Domain Mastery', 'Problem Solving'];
        else if (form.itemType === 'internship') extractedSkills = ['Production Delivery', 'Team Engineering'];
        else extractedSkills = ['Analytical', 'Problem Solving'];
      }

      let proofFileUrl: string | undefined = undefined;
      let resolvedId = `vlt_${Date.now()}`;
      if (formEvidenceFile) {
        try {
          const formData = new FormData();
          formData.append('file', formEvidenceFile);
          formData.append('category', form.itemType === 'project' ? 'achievement' : form.itemType);
          formData.append('primaryName', user?.displayName || 'Candidate');
          const res = await api.post<any>('/api/vault/upload', formData).catch(() => null);
          if (res?.document?.id || res?.data?.id) {
            resolvedId = res?.document?.id || res?.data?.id;
          }
          if (res?.document?.storageUrl || res?.data?.storageUrl) {
            proofFileUrl = res?.document?.storageUrl || res?.data?.storageUrl;
          } else {
            proofFileUrl = formEvidenceFile.name;
          }
          const serverSkills = res?.document?.skills || res?.data?.skills;
          if (Array.isArray(serverSkills) && serverSkills.length > 0) {
            extractedSkills = extractSkillsFast(`${form.title} ${form.description}`, serverSkills);
          }
        } catch {
          proofFileUrl = formEvidenceFile.name;
        }
      }

      addVaultItem({
        id: resolvedId,
        title: form.title.trim(),
        item_type: form.itemType,
        organization_name: form.organizationName.trim(),
        description: form.description.trim(),
        skill_tags: extractedSkills,
        verified: false,
        ai_confidence_score: 72,
        proof_url: proofFileUrl,
      });

      setLatestAnalysis({
        id: resolvedId,
        title: form.title.trim(),
        itemType: form.itemType,
        skills: extractedSkills,
        confidence: 72,
      });

      toast.success(
        '⚡ Fast Analysis Complete',
        `Extracted ${extractedSkills.length} skills. Enter Brutal Defense with ${auditor.name} to verify.`
      );
      setShowForm(false);
      setForm({
        title: '',
        itemType: 'resume',
        description: '',
        organizationName: '',
        startDate: '',
        endDate: '',
      });
      setFormEvidenceFile(null);
    } finally {
      setUploading(false);
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleFileUploadLive = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('primaryName', user?.displayName || 'Candidate');

      const res = await api
        .post<{ ok: boolean; document?: any; data?: any; message?: string }>('/api/vault/upload', formData)
        .catch(() => null);
      const doc = res?.document || res?.data;

      if (doc) {
        const fastSkills = extractSkillsFast(`${doc.title} ${file.name}`, doc.skills);
        const docCategory = doc.category === 'achievement' ? 'project' : doc.category || 'resume';
        setLatestAnalysis({
          id: doc.id,
          title: doc.title || file.name,
          itemType: docCategory,
          skills: fastSkills,
          confidence: Math.round((doc.ai_confidence_score || 75)),
        });
        toast.success(
          '⚡ Document Analyzed',
          `${fastSkills.length} skills extracted from "${doc.title || file.name}". Launch Brutal Defense with ${auditor.name}!`
        );
        if (user?.id) {
          const { data: refreshed } = await supabase.from('vault_items').select('*').eq('user_id', user.id);
          if (refreshed) {
            setVaultItems(refreshed.filter((item: any) => item.item_type !== 'campus_kv'));
          }
        }
        refetch?.();
      } else {
        // Fast resilient client-side document inspection when server upload unavailable / guest mode
        let textSample = file.name;
        try {
          if (file.size < 2_000_000) {
            const rawChunk = await file.text();
            textSample += ' ' + rawChunk.replace(/[^\x20-\x7E\n]/g, ' ').slice(0, 15000);
          }
        } catch {}
        const detectedType = /cert/i.test(textSample)
          ? 'certification'
          : /intern/i.test(textSample)
          ? 'internship'
          : /resume|cv/i.test(textSample)
          ? 'resume'
          : 'resume';
        const fastSkills = extractSkillsFast(textSample);
        const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
        const tempId = `vlt_${Date.now()}`;
        addVaultItem({
          id: tempId,
          title: docTitle || 'Master Resume',
          item_type: detectedType,
          organization_name: 'Candidate Uploaded',
          description: `Analyzed ${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB). Ready for ${auditor.name} skill interrogation.`,
          skill_tags: fastSkills,
          verified: false,
          ai_confidence_score: 76,
          proof_url: file.name,
        });
        setLatestAnalysis({
          id: tempId,
          title: docTitle || file.name,
          itemType: detectedType,
          skills: fastSkills,
          confidence: 76,
        });
        toast.success(
          '⚡ Document Analyzed',
          `Detected ${fastSkills.length} skills in "${file.name}". Ready for ${auditor.name} defense room!`
        );
      }
    } catch (err: any) {
      toast.error('Upload Refused', err?.message || 'Could not inspect this document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUploadLive(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 64 }} className="animate-fade-in">
      {/* Executive Command Header */}
      <div
        style={{
          borderRadius: 20,
          padding: '24px 28px',
          marginBottom: 20,
          background:
            'radial-gradient(circle at top right, rgba(99, 102, 241, 0.16), transparent 55%), linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(10, 15, 30, 0.72))',
          border: '1px solid var(--border)',
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 10.5,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.1,
                padding: '3px 9px',
                borderRadius: 99,
                background: 'rgba(20, 184, 166, 0.14)',
                color: 'var(--teal)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
              }}
            >
              Tamper-Proof Evidence Locker
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--t3)',
              }}
            >
              Auditor Assigned: <strong style={{ color: 'var(--t1)' }}>{auditor.name}</strong>
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 800,
              margin: '0 0 4px',
              color: 'var(--t1)',
              letterSpacing: '-0.02em',
            }}
          >
            Proof Vault &amp; Verification Lab
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 14, margin: 0 }}>
            Upload resumes &amp; certificates for fast AI extraction, survive oral defense to sync skills to your Portfolio, and inspect your Trust &amp; Telemetry ledgers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="btn-ghost btn-sm"
            style={{ padding: '9px 15px', fontWeight: 700 }}
          >
            📤 Upload File
          </button>
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            className="btn-primary btn-sm"
            style={{ padding: '9px 16px', fontWeight: 700 }}
          >
            {showForm ? '✕ Close Form' : '+ Add Proof-of-Work'}
          </button>
        </div>
      </div>

      {/* 4-Card Balanced KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: 'Live Trust Score',
            value: `${liveTrust}`,
            sub: 'Default 50 · +5 Verified / -5 Rejected',
            color: liveTrust >= 50 ? 'var(--green)' : '#f87171',
            tint: 'rgba(34, 197, 94, 0.08)',
          },
          {
            label: 'Total Vault Assets',
            value: `${total}`,
            sub: `${verified_total} verified · ${Math.max(0, total - verified_total)} awaiting defense`,
            color: 'var(--accent)',
            tint: 'rgba(99, 102, 241, 0.08)',
          },
          {
            label: 'Verified Proofs',
            value: `${verified_total}`,
            sub: 'Skills synced to Student Portfolio',
            color: 'var(--teal)',
            tint: 'rgba(20, 184, 166, 0.08)',
          },
          {
            label: 'Avg AI Grounding',
            value: total > 0 ? `${avg_score}%` : 'Ready',
            sub: `Cross-mentor gate: ${auditor.name}`,
            color: 'var(--amber)',
            tint: 'rgba(245, 158, 11, 0.08)',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: `linear-gradient(155deg, ${kpi.tint}, var(--card))`,
              border: '1px solid var(--border)',
              borderTop: `3px solid ${kpi.color}`,
              borderRadius: 16,
              padding: '16px 18px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: 1.1,
                textTransform: 'uppercase',
                color: 'var(--t3)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 800,
                color: kpi.color,
                lineHeight: 1.15,
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Fast Analysis Result Callout (Auto-appears after upload/creation) */}
      {latestAnalysis && (
        <div
          data-testid="vault-fast-analysis-banner"
          style={{
            marginBottom: 22,
            padding: '16px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(15,23,42,0.8))',
            border: '1px solid rgba(99,102,241,0.45)',
            boxShadow: '0 10px 28px rgba(79,70,229,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              ⚡ Fast Document Scan Complete · Verification Room Ready
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>
              {latestAnalysis.title} — Extracted {latestAnalysis.skills.length} Claimed Skills
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {latestAnalysis.skills.map((s) => (
                <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--bg2)', color: 'var(--t1)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            data-testid="enter-defense-from-banner-btn"
            onClick={() =>
              launchDefenseRoom({
                id: latestAnalysis.id,
                title: latestAnalysis.title,
                item_type: latestAnalysis.itemType,
                skill_tags: latestAnalysis.skills,
              })
            }
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: 13.5, fontWeight: 800 }}
          >
            ⚔️ Enter Brutal Defense ({auditor.name}) →
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragActive ? 'var(--accent)' : 'var(--border2)'}`,
          background: dragActive
            ? 'rgba(99, 102, 241, 0.09)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.02), rgba(15,23,42,0.4))',
          borderRadius: 18,
          padding: '22px 20px',
          textAlign: 'center',
          marginBottom: 22,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: dragActive ? '0 0 0 4px rgba(99,102,241,0.12)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        <input
          type="file"
          ref={fileRef}
          accept=".pdf,.docx,.txt,.jpg,.png,.zip"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUploadLive(e.target.files[0]);
            }
          }}
        />
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, borderRadius: 12, background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', fontSize: 22, marginBottom: 10 }}>
          📤
        </div>
        <h3 style={{ fontSize: 15.5, fontWeight: 800, margin: '0 0 4px', color: 'var(--t1)' }}>
          Drop Resume, Certificate, or Project Evidence Here
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--t3)', maxWidth: 520, margin: '0 auto 10px' }}>
          Instant skill &amp; provenance scan upon upload. Claims must survive oral defense with <strong style={{ color: 'var(--t2)' }}>{auditor.name}</strong> before unlocking Portfolio sync &amp; +5 Trust Score.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {['PDF', 'DOCX', 'TXT', 'PNG / JPG', 'GitHub ZIP'].map((fmt) => (
            <span key={fmt} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 6, background: 'var(--bg3)', color: 'var(--t3)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Add Proof-of-Work Form */}
      {showForm && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border2)',
            borderRadius: 18,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
          }}
          className="animate-fade-in"
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
            Add Proof-of-Work Asset
          </h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Asset Title *</label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Full-Stack Resume (React, TypeScript, SQL)"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Evidence Category *</label>
                <select
                  className="form-input"
                  value={form.itemType}
                  onChange={(e) => setForm((f) => ({ ...f, itemType: e.target.value }))}
                >
                  {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Issuing Organization</label>
              <input
                className="form-input"
                value={form.organizationName}
                onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                placeholder="Company / University / Certification Body"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Claimed Skills &amp; Evidence Summary</label>
              <textarea
                className="form-input"
                style={{ resize: 'vertical', minHeight: 80 }}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="List exact technologies & achievements (e.g. React, PostgreSQL, Docker, System Design) so the auditor can quiz you..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Proof / Certificate Document</label>
                <input
                  type="file"
                  id="vault-form-file-input"
                  accept=".pdf,.docx,.txt,.jpg,.png,.zip"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormEvidenceFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="vault-form-file-input"
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 13,
                    border: '1px dashed var(--border2)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 8px',
                  }}
                >
                  {formEvidenceFile ? `📎 ${formEvidenceFile.name}` : '📎 Attach Proof Document'}
                </label>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }} disabled={uploading}>
              {uploading ? 'Analyzing Document...' : '➔ Analyze & Create Defense Room'}
            </button>
          </form>
        </div>
      )}

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {['all', ...Object.keys(TYPE_CONFIG)].map((t) => {
          const count = t === 'all' ? vaultItems.length : vaultItems.filter((i) => i.item_type === t).length;
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '6px 13px',
                borderRadius: 99,
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(99,102,241,0.14)' : 'var(--bg2)',
                color: active ? '#a5b4fc' : 'var(--t2)',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: active ? 700 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t === 'all' ? 'All Assets' : TYPE_CONFIG[t]?.label}</span>
              <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', opacity: 0.75 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Vault Assets Grid */}
      {uploading && !showForm ? (
        <div
          style={{
            textAlign: 'center',
            padding: 44,
            background: 'var(--bg2)',
            borderRadius: 16,
            border: '1px dashed var(--accent)',
            color: 'var(--accent)',
          }}
        >
          <span style={{ display: 'block', fontSize: 28, marginBottom: 8 }}>🔍</span>
          Running Fast Document Analyzer &amp; Extracting Claimed Skills...
        </div>
      ) : filteredItems.length === 0 ? (
        <div
          style={{
            padding: '44px 24px',
            borderRadius: 18,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 34, marginBottom: 8 }}>🗄️</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
            Secure Vault is empty
          </div>
          <div style={{ fontSize: 13, color: 'var(--t3)', maxWidth: 440, margin: '0 auto' }}>
            Upload your Resume or Certificates above. PinIT parses your claimed skills and launches an oral defense challenge with {auditor.name}.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 16 }}>
          {filteredItems.map((item) => {
            const cfg = TYPE_CONFIG[item.item_type as string] || TYPE_CONFIG.other;
            const score = Math.round(item.ai_confidence_score || 0);
            const rejectionInfo = !item.verified ? getLocalAuditRejection(item.id) : null;
            const isRejected = rejectionInfo?.status === 'rejected' || String(item.endorsement_note || '').toLowerCase().includes('rejected');

            const cardSkills = extractSkillsFast(
              `${item.title || ''} ${item.description || ''}`,
              item.skill_tags
            );

            return (
              <div
                key={item.id}
                data-testid={`vault-asset-card-${item.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 18,
                  overflow: 'hidden',
                  background: 'linear-gradient(165deg, rgba(255,255,255,0.03), rgba(10,15,30,0.72))',
                  border: `1px solid ${
                    item.verified
                      ? 'rgba(34,197,94,0.32)'
                      : isRejected
                      ? 'rgba(239,68,68,0.35)'
                      : 'var(--border)'
                  }`,
                  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.24)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                {/* Clean Non-Overlapping Card Header Bar */}
                <div
                  style={{
                    padding: '14px 18px',
                    background: `linear-gradient(135deg, color-mix(in srgb, ${cfg.color} 14%, transparent), rgba(15, 23, 42, 0.5))`,
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 19,
                        flexShrink: 0,
                      }}
                    >
                      {cfg.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--t2)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        letterSpacing: 0.6,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {/* Status Pill (Right-aligned, zero overlap) */}
                  {item.verified ? (
                    <span
                      style={{
                        background: 'rgba(34, 197, 94, 0.16)',
                        color: 'var(--green)',
                        border: '1px solid rgba(34,197,94,0.35)',
                        borderRadius: 99,
                        padding: '3px 10px',
                        fontSize: 10.5,
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: 0.4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ✓ Verified {score > 0 ? `(${score}%)` : ''}
                    </span>
                  ) : isRejected ? (
                    <span
                      style={{
                        background: 'rgba(239, 68, 68, 0.16)',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.35)',
                        borderRadius: 99,
                        padding: '3px 10px',
                        fontSize: 10.5,
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ✕ Failed Defense
                    </span>
                  ) : (
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.14)',
                        color: 'var(--amber)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 99,
                        padding: '3px 10px',
                        fontSize: 10.5,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ⚔️ Needs Defense
                    </span>
                  )}
                </div>

                {/* Card Details Body */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <h3
                      style={{
                        margin: '0 0 3px',
                        fontSize: 16,
                        fontWeight: 800,
                        color: 'var(--t1)',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.organization_name && (
                      <div style={{ fontSize: 12.5, color: 'var(--t3)', fontWeight: 500 }}>
                        {item.organization_name}
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p
                      style={{
                        fontSize: 12.5,
                        color: 'var(--t2)',
                        lineHeight: 1.5,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description}
                    </p>
                  )}

                  {/* Claimed / Verified Skills */}
                  {cardSkills.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
                      {cardSkills.slice(0, 5).map((s: string) => (
                        <span
                          key={s}
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: item.verified ? 'rgba(34,197,94,0.1)' : 'var(--bg3)',
                            color: item.verified ? 'var(--green)' : 'var(--t2)',
                            border: `1px solid ${item.verified ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div
                  style={{
                    padding: '12px 18px',
                    borderTop: '1px solid var(--border)',
                    background: 'rgba(10, 15, 30, 0.35)',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => updateVaultItem(item.id, { is_public: !item.is_public })}
                    className="btn-ghost btn-sm"
                    style={{ fontSize: 12, padding: '6px 10px', justifyContent: 'center' }}
                  >
                    {item.is_public ? '🔒 Private' : '👁 Share'}
                  </button>

                  {item.verified ? (
                    <span
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: 'var(--green)',
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 8,
                        padding: '6px 10px',
                      }}
                    >
                      ✓ Portfolio Synced (+5 Trust)
                    </span>
                  ) : (
                    <button
                      type="button"
                      data-testid={`vault-verify-room-btn-${item.id}`}
                      onClick={() => launchDefenseRoom(item)}
                      className="btn-primary btn-sm"
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '6px 12px',
                        justifyContent: 'center',
                      }}
                    >
                      ⚔️ {isRejected ? `Re-Defend (${auditor.name})` : `Verify with ${auditor.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trust Score (+/-), Arena ELO & League Points, Weekly EXP & Career Score, and Mentality Ledgers */}
      <TelemetryAuditLedger
        userId={user?.id}
        user={user}
        cOS={cOS}
        liveTrustScore={liveTrust}
        verifiedCount={verified_total}
        totalVaultCount={total}
      />
    </div>
  );
}
