'use client';
// Streamlined Proof Vault: Compact Above-the-Fold Documents, Brutal Oral Defense & Score History
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
import { PdfCanvasViewer } from '@/components/vault/PdfCanvasViewer';

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

function cleanCardDescription(raw?: string | null): string {
  const txt = String(raw || '').trim();
  if (!txt) return '';
  // Strip noisy internal upload logs & storage paths so cards stay crisp and human-readable
  if (/^Uploaded to Candidate Secure Vault/i.test(txt) || /Storage:\s*vault\//i.test(txt)) {
    return '';
  }
  return txt;
}

export default function VaultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const cOS = useCareerOS();
  const { vaultItems: ctxItems, setVaultItems, addVaultItem, updateVaultItem, removeVaultItem } = cOS;
  const { data: fsVaultData, refetch } = useVault();
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const fsItems = (fsVaultData || []) as any[];
  const fsIds = new Set(fsItems.map((i: any) => i.id));
  const vaultItems = useMemo(
    () => [...fsItems, ...ctxItems.filter((i) => !fsIds.has(i.id))].filter((i) => !deletedIds.has(i.id)),
    [fsItems, ctxItems, deletedIds]
  );

  const [vaultView, setVaultView] = useState<'documents' | 'history'>('documents');
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
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

  const [previewDoc, setPreviewDoc] = useState<{
    item: any;
    loadingFile: boolean;
    fileError: string;
    blobUrl: string | null;
    signedUrl: string | null;
    pdfBytes: Uint8Array | null;
    mimeType: string;
    fileName: string;
    textContent: string;
    aiAnalysis: any;
    rescanning: boolean;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (previewDoc?.blobUrl) {
        try {
          URL.revokeObjectURL(previewDoc.blobUrl);
        } catch {}
      }
    };
  }, [previewDoc?.blobUrl]);

  const [form, setForm] = useState({
    title: '',
    itemType: 'resume',
    description: '',
    organizationName: '',
    startDate: '',
    endDate: '',
  });

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

  useEffect(() => {
    refetch?.();
  }, [refetch]);

  const activeMentorId = getActiveUserMentorId(user);
  const auditor = useMemo(() => resolveVaultAuditorMentor(activeMentorId), [activeMentorId]);

  const getLocalAuditStatus = (itemId: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`pinit_vault_audit_status_${itemId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getLocalAiAnalysis = (itemId: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`pinit_vault_ai_analysis_${itemId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const launchDefenseRoom = (item: any) => {
    const cachedAi = getLocalAiAnalysis(item.id);
    const mergedExistingSkills = Array.from(
      new Set([...(cachedAi?.skills || []), ...(item.skill_tags || [])].map((s: any) => String(s || '').trim()).filter(Boolean))
    );
    const inferredSkills =
      mergedExistingSkills.length > 0
        ? mergedExistingSkills
        : extractSkillsFast(`${item.title || ''} ${item.description || ''}`, item.skill_tags);

    savePendingVaultDefense({
      docId: item.id,
      userId: user?.id,
      title: cachedAi?.documentTitle || item.title || 'Uploaded Credential',
      itemType: cachedAi?.documentType || item.item_type || 'resume',
      organizationName: item.organization_name || '',
      claimedSkills: inferredSkills,
      projects: cachedAi?.projects || undefined,
      certifications: cachedAi?.certifications || undefined,
      summary: cachedAi?.summary || undefined,
      rawTextExcerpt: cachedAi?.rawTextExcerpt || undefined,
      defenseQuestions: cachedAi?.defenseQuestions || undefined,
      analysisSource: cachedAi?.source || undefined,
      auditor,
      createdAt: new Date().toISOString(),
    });

    router.push(`/interview?mode=vault_verify&docId=${encodeURIComponent(item.id)}`);
  };

  const closeDocumentViewer = () => {
    setPreviewDoc((prev) => {
      if (prev?.blobUrl) {
        try {
          URL.revokeObjectURL(prev.blobUrl);
        } catch {}
      }
      return null;
    });
  };

  const hasPdfHeader = (bytes: Uint8Array | null): boolean => {
    if (!bytes || bytes.byteLength < 5) return false;
    const limit = Math.min(bytes.byteLength, 1024);
    for (let i = 0; i <= limit - 5; i++) {
      if (
        bytes[i] === 0x25 &&
        bytes[i + 1] === 0x50 &&
        bytes[i + 2] === 0x44 &&
        bytes[i + 3] === 0x46 &&
        bytes[i + 4] === 0x2d
      ) {
        return true;
      }
    }
    return false;
  };

  const openDocumentViewer = async (item: any) => {
    const cachedAi = getLocalAiAnalysis(item.id);
    setPreviewDoc({
      item,
      loadingFile: true,
      fileError: '',
      blobUrl: null,
      signedUrl: null,
      pdfBytes: null,
      mimeType: '',
      fileName: item.title || 'document.pdf',
      textContent: '',
      aiAnalysis: cachedAi,
      rescanning: false,
    });

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken =
        sessionData?.session?.access_token ||
        (typeof window !== 'undefined' ? localStorage.getItem('pinit_vault_jwt') : null);
      const headers: Record<string, string> = { 'X-Pinit-Direct': '1' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const [res, signedRes] = await Promise.all([
        fetch(`/api/vault/file?docId=${encodeURIComponent(item.id)}`, {
          method: 'GET',
          headers,
        }),
        fetch(`/api/vault/file?docId=${encodeURIComponent(item.id)}&mode=url`, {
          method: 'GET',
          headers,
        }).catch(() => null),
      ]);

      const signedPayload = signedRes && signedRes.ok ? await signedRes.json().catch(() => null) : null;
      const signedUrl = typeof signedPayload?.signedUrl === 'string' ? signedPayload.signedUrl : null;

      let mimeType = res.ok
        ? (res.headers.get('content-type') || 'application/pdf').split(';')[0].trim()
        : (signedPayload?.mimeType || 'application/pdf');
      const fileName =
        (res.ok ? res.headers.get('x-vault-filename') : null) ||
        signedPayload?.fileName ||
        item.title ||
        'document.pdf';

      let fileBytes: Uint8Array | null = null;
      if (res.ok) {
        const ab = await res.arrayBuffer();
        fileBytes = new Uint8Array(ab);
      }

      // If stream failed OR didn't return valid %PDF- bytes, fetch directly from Supabase signed HTTPS URL
      if ((!fileBytes || fileBytes.byteLength === 0 || (mimeType.includes('pdf') && !hasPdfHeader(fileBytes))) && signedUrl) {
        try {
          const directRes = await fetch(signedUrl);
          if (directRes.ok) {
            const directAb = await directRes.arrayBuffer();
            const directBytes = new Uint8Array(directAb);
            if (directBytes.byteLength > 0) {
              fileBytes = directBytes;
              const directCt = (directRes.headers.get('content-type') || '').split(';')[0].trim();
              if (directCt && directCt !== 'application/octet-stream') {
                mimeType = directCt;
              }
            }
          }
        } catch {}
      }

      if (!fileBytes || fileBytes.byteLength === 0) {
        const errPayload = !res.ok ? await res.json().catch(() => ({})) : {};
        setPreviewDoc((prev) =>
          prev
            ? {
                ...prev,
                loadingFile: false,
                signedUrl,
                fileError: errPayload?.message || errPayload?.error || 'No previewable binary file found for this entry.',
              }
            : null
        );
        return;
      }

      const typedBlob = new Blob([new Uint8Array(fileBytes)], { type: mimeType });
      const blobUrl = URL.createObjectURL(typedBlob);
      const textContent = mimeType.startsWith('text/') ? new TextDecoder('utf-8').decode(fileBytes) : '';
      const isPdf = mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf') || hasPdfHeader(fileBytes);

      setPreviewDoc((prev) =>
        prev
          ? {
              ...prev,
              loadingFile: false,
              blobUrl,
              signedUrl,
              pdfBytes: isPdf ? fileBytes : null,
              mimeType: isPdf ? 'application/pdf' : mimeType,
              fileName,
              textContent,
            }
          : null
      );
    } catch (err: any) {
      setPreviewDoc((prev) =>
        prev
          ? {
              ...prev,
              loadingFile: false,
              fileError: err?.message || 'Failed to load document preview.',
            }
          : null
      );
    }
  };

  const handleRescanDocument = async (item: any) => {
    setPreviewDoc((prev) => (prev ? { ...prev, rescanning: true } : null));
    try {
      const res = await api.post<any>('/api/vault/defense-session', {
        action: 'prepare',
        docId: item.id,
        title: item.title,
        itemType: item.item_type,
        auditorName: auditor.name,
        existingSkills: item.skill_tags || [],
      });

      if (res?.ok && res?.readable) {
        const prevAi = getLocalAiAnalysis(item.id) || {};
        const nextSkills =
          Array.isArray(res.claimedSkills) && res.claimedSkills.length > 0
            ? res.claimedSkills
            : Array.isArray(prevAi.skills)
            ? prevAi.skills
            : [];
        const nextProjects =
          Array.isArray(res.projects) && res.projects.length > 0
            ? res.projects
            : Array.isArray(prevAi.projects)
            ? prevAi.projects
            : [];
        const nextCerts =
          Array.isArray(res.certifications) && res.certifications.length > 0
            ? res.certifications
            : Array.isArray(prevAi.certifications)
            ? prevAi.certifications
            : [];
        const isSyntheticRaw =
          typeof res.rawTextExcerpt === 'string' &&
          /^Document Title:[\s\S]*Claimed Skills:/i.test(res.rawTextExcerpt.trim());
        const nextRawText =
          !isSyntheticRaw && res.rawTextExcerpt && res.rawTextExcerpt.trim().length > 30
            ? res.rawTextExcerpt
            : prevAi.rawTextExcerpt || res.rawTextExcerpt || '';

        const nextAi = {
          source: res.analysisSource || prevAi.source,
          documentTitle: res.documentTitle || prevAi.documentTitle || item.title,
          documentType: res.documentType || prevAi.documentType || item.item_type,
          skills: nextSkills,
          projects: nextProjects,
          certifications: nextCerts,
          summary: res.summary || prevAi.summary || '',
          rawTextExcerpt: nextRawText,
          defenseQuestions:
            Array.isArray(res.defenseQuestions) && res.defenseQuestions.length > 0
              ? res.defenseQuestions
              : prevAi.defenseQuestions || [],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`pinit_vault_ai_analysis_${item.id}`, JSON.stringify(nextAi));
          } catch {}
        }
        updateVaultItem(
          item.id,
          {
            title: res.documentTitle || item.title,
            item_type: res.documentType || item.item_type,
            skill_tags: res.claimedSkills || item.skill_tags,
            organization_name: res.institution || item.organization_name,
          },
          { skipTrustMutation: true }
        );
        setPreviewDoc((prev) =>
          prev
            ? {
                ...prev,
                rescanning: false,
                aiAnalysis: nextAi,
                item: {
                  ...prev.item,
                  title: res.documentTitle || prev.item.title,
                  item_type: res.documentType || prev.item.item_type,
                  skill_tags: res.claimedSkills || prev.item.skill_tags,
                },
              }
            : null
        );
        refetch?.();
        toast.success(
          '⚡ Resume Re-scanned with Groq AI',
          `Extracted ${(res.claimedSkills || []).length} real skills and ${(res.projects || []).length} projects.`
        );
      } else {
        setPreviewDoc((prev) => (prev ? { ...prev, rescanning: false } : null));
        toast.error(
          'Could Not Extract Resume Text',
          res?.unreadableReason || 'Try re-uploading a standard PDF, DOCX, or clear PNG/JPG screenshot.'
        );
      }
    } catch (err: any) {
      setPreviewDoc((prev) => (prev ? { ...prev, rescanning: false } : null));
      toast.error('Re-scan Failed', err?.message || 'Could not analyze document right now.');
    }
  };

  const handleDeleteItem = async (item: any) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`pinit_vault_audit_status_${item.id}`);
        localStorage.removeItem(`pinit_vault_ai_analysis_${item.id}`);
      } catch {}
    }
    try {
      await removeVaultItem?.(item.id);
    } finally {
      refetch?.();
    }
  };

  const filteredItems =
    filter === 'all' ? vaultItems : vaultItems.filter((item) => item.item_type === filter);

  const total = vaultItems.length;
  const verified_total = vaultItems.filter(
    (i) => Boolean(i.verified) || getLocalAuditStatus(i.id)?.status === 'verified'
  ).length;

  // Smart filter pills: show All + Resume + Certification + any category that actually has items
  const visibleFilterKeys = useMemo(() => {
    const core = new Set(['resume', 'certification']);
    return ['all', ...Object.keys(TYPE_CONFIG).filter((k) => core.has(k) || vaultItems.some((i) => i.item_type === k))];
  }, [vaultItems]);

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
        else extractedSkills = ['System Design', 'Problem Solving'];
      }

      let proofFileUrl: string | undefined = undefined;
      let resolvedId = `vlt_${Date.now()}`;
      if (formEvidenceFile) {
        try {
          const formData = new FormData();
          formData.append('file', formEvidenceFile);
          formData.append('category', form.itemType === 'project' ? 'achievement' : form.itemType);
          formData.append('primaryName', user?.displayName || 'Candidate');
          formData.append('auditorName', auditor.name);
          const res = await api.post<any>('/api/vault/upload', formData).catch(() => null);
          if (res?.document?.id || res?.data?.id) resolvedId = res?.document?.id || res?.data?.id;
          if (res?.document?.storageUrl || res?.data?.storageUrl) {
            proofFileUrl = res?.document?.storageUrl || res?.data?.storageUrl;
          } else {
            proofFileUrl = formEvidenceFile.name;
          }
          const serverSkills = res?.aiAnalysis?.skills || res?.document?.skills || res?.data?.skills;
          if (Array.isArray(serverSkills) && serverSkills.length > 0) {
            extractedSkills = serverSkills;
          }
          if (res?.aiAnalysis && typeof window !== 'undefined') {
            try {
              localStorage.setItem(`pinit_vault_ai_analysis_${resolvedId}`, JSON.stringify(res.aiAnalysis));
            } catch {}
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

      toast.success('⚡ Ready to Verify', `Extracted ${extractedSkills.length} skills. Start oral check with ${auditor.name}.`);
      setShowUploadPanel(false);
      setShowManualForm(false);
      setVaultView('documents');
      setForm({ title: '', itemType: 'resume', description: '', organizationName: '', startDate: '', endDate: '' });
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
      formData.append('auditorName', auditor.name);

      let uploadError: any = null;
      const res = await api
        .post<{ ok: boolean; document?: any; data?: any; aiAnalysis?: any; message?: string }>('/api/vault/upload', formData)
        .catch((err) => {
          uploadError = err;
          return null;
        });

      if (uploadError && (uploadError?.status === 422 || uploadError?.status === 400 || uploadError?.status === 413)) {
        toast.error(
          'Could Not Read Document',
          uploadError?.message || 'Please upload a readable PDF, DOCX, TXT, or clear PNG/JPG image.'
        );
        return;
      }

      const doc = res?.document || res?.data;

      if (doc) {
        const aiSkills = Array.isArray(res?.aiAnalysis?.skills) && res.aiAnalysis.skills.length > 0
          ? res.aiAnalysis.skills
          : Array.isArray(doc.skills) && doc.skills.length > 0
          ? doc.skills
          : extractSkillsFast(`${doc.title} ${file.name}`, doc.skills);
        const docCategory = doc.category === 'achievement' ? 'project' : doc.category || 'resume';
        if (res?.aiAnalysis && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`pinit_vault_ai_analysis_${doc.id}`, JSON.stringify(res.aiAnalysis));
          } catch {}
        }
        setLatestAnalysis({
          id: doc.id,
          title: doc.title || file.name,
          itemType: docCategory,
          skills: aiSkills,
          confidence: Math.round(doc.ai_confidence_score || 85),
        });
        toast.success(
          '⚡ Document Analyzed with Groq AI',
          aiSkills.length > 0
            ? `${aiSkills.length} real skills extracted. Ready to verify with ${auditor.name}!`
            : `Document uploaded. Click View to inspect or start verification with ${auditor.name}.`
        );
        if (user?.id) {
          const { data: refreshed } = await supabase.from('vault_items').select('*').eq('user_id', user.id);
          if (refreshed) setVaultItems(refreshed.filter((item: any) => item.item_type !== 'campus_kv'));
        }
        refetch?.();
      } else {
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
          : 'resume';
        const fastSkills = extractSkillsFast(textSample);
        const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
        const tempId = `vlt_${Date.now()}`;
        addVaultItem({
          id: tempId,
          title: docTitle || 'Master Resume',
          item_type: detectedType,
          organization_name: 'Candidate Uploaded',
          description: '',
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
        toast.success('⚡ Document Analyzed', `Detected ${fastSkills.length} skills. Ready to verify with ${auditor.name}!`);
      }
      setShowUploadPanel(false);
      setVaultView('documents');
    } catch (err: any) {
      toast.error('Upload Refused', err?.message || 'Could not inspect this document.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
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
    <div style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 48 }} className="animate-fade-in">
      <input
        type="file"
        ref={fileRef}
        accept=".pdf,.docx,.txt,.jpg,.png,.zip"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFileUploadLive(e.target.files[0]);
        }}
      />

      {/* Compact Single-Row Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '14px 18px',
          marginBottom: 14,
          borderRadius: 16,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.16)',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
            Proof Vault
          </h1>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0' }}>
            Upload resumes or certificates, pass an oral check with <strong style={{ color: 'var(--t2)' }}>{auditor.name}</strong>, and sync skills to your Portfolio.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 10,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              color: liveTrust >= 50 ? 'var(--green)' : '#f87171',
            }}
          >
            Trust: {liveTrust}/100
          </span>
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 10,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              color: 'var(--teal)',
            }}
          >
            Verified: {verified_total}/{total}
          </span>
          <button
            type="button"
            data-testid="vault-upload-toggle-btn"
            onClick={() => setShowUploadPanel((s) => !s)}
            className="btn-primary btn-sm"
            style={{ padding: '7px 14px', fontWeight: 700, fontSize: 12.5 }}
          >
            {showUploadPanel ? '✕ Close Upload' : '+ Upload / Add Proof'}
          </button>
        </div>
      </div>

      {/* Clear 2-Tab Top Switcher */}
      <div
        role="tablist"
        aria-label="Proof Vault Views"
        style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={vaultView === 'documents'}
          data-testid="vault-tab-documents"
          onClick={() => setVaultView('documents')}
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            border: `1px solid ${vaultView === 'documents' ? 'var(--accent)' : 'var(--border)'}`,
            background: vaultView === 'documents' ? 'rgba(99,102,241,0.14)' : 'var(--bg2)',
            color: vaultView === 'documents' ? '#a5b4fc' : 'var(--t2)',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>My Documents</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.85 }}>{total}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={vaultView === 'history'}
          data-testid="vault-tab-history"
          onClick={() => setVaultView('history')}
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            border: `1px solid ${vaultView === 'history' ? 'var(--accent)' : 'var(--border)'}`,
            background: vaultView === 'history' ? 'rgba(99,102,241,0.14)' : 'var(--bg2)',
            color: vaultView === 'history' ? '#a5b4fc' : 'var(--t2)',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Score History &amp; Mentality
        </button>
      </div>

      {/* Collapsible Compact Upload & Manual Entry Drawer (Auto-shown only when requested or vault is empty) */}
      {(showUploadPanel || (vaultView === 'documents' && total === 0)) && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border2)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            boxShadow: '0 10px 26px rgba(0, 0, 0, 0.2)',
          }}
          className="animate-fade-in"
        >
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `1.5px dashed ${dragActive ? 'var(--accent)' : 'var(--border2)'}`,
              background: dragActive ? 'rgba(99,102,241,0.09)' : 'var(--bg2)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>📤</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>
                  Drop PDF, DOCX, Certificate, or Click to Browse
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                  Fast skill scan &rarr; Oral check with {auditor.name} &rarr; +5 Trust &amp; Portfolio sync
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowManualForm((m) => !m);
                }}
                className="btn-ghost btn-sm"
                style={{ fontSize: 12 }}
              >
                {showManualForm ? 'Hide Manual Entry' : 'Enter Details Manually'}
              </button>
            </div>
          </div>

          {showManualForm && (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Full-Stack Resume (React, SQL)"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Organization</label>
                  <input
                    className="form-input"
                    value={form.organizationName}
                    onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                    placeholder="University / Platform / Company"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Attach File (Optional)</label>
                  <input
                    type="file"
                    id="vault-form-file-input"
                    accept=".pdf,.docx,.txt,.jpg,.png,.zip"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setFormEvidenceFile(e.target.files[0]);
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
                      fontSize: 12.5,
                      border: '1px dashed var(--border2)',
                      borderRadius: 8,
                    }}
                  >
                    {formEvidenceFile ? `📎 ${formEvidenceFile.name}` : '📎 Choose Proof File'}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Claimed Skills / Notes</label>
                <textarea
                  className="form-input"
                  style={{ resize: 'vertical', minHeight: 64 }}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="List skills from this document (e.g. React, TypeScript, PostgreSQL, Docker)..."
                />
              </div>
              <button type="submit" className="btn-primary btn-sm" style={{ alignSelf: 'flex-end' }} disabled={uploading}>
                {uploading ? 'Analyzing...' : 'Save & Prepare Verification'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Fast Analysis Banner (Appears immediately after a fresh upload) */}
      {latestAnalysis && vaultView === 'documents' && (
        <div
          data-testid="vault-fast-analysis-banner"
          style={{
            marginBottom: 16,
            padding: '12px 16px',
            borderRadius: 14,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>
              ⚡ Scan Ready: {latestAnalysis.title} ({latestAnalysis.skills.length} skills extracted)
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {latestAnalysis.skills.slice(0, 6).map((s) => (
                <span key={s} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, background: 'var(--bg2)', color: 'var(--t1)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
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
            className="btn-primary btn-sm"
            style={{ padding: '8px 14px', fontWeight: 800 }}
          >
            ⚔️ Verify with {auditor.name} &rarr;
          </button>
        </div>
      )}

      {/* TAB 1: MY DOCUMENTS */}
      {vaultView === 'documents' && (
        <div>
          {/* Smart Non-Zero Filter Bar */}
          {total > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {visibleFilterKeys.map((t) => {
                const count = t === 'all' ? vaultItems.length : vaultItems.filter((i) => i.item_type === t).length;
                const active = filter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 99,
                      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      background: active ? 'rgba(99,102,241,0.14)' : 'var(--bg2)',
                      color: active ? '#a5b4fc' : 'var(--t2)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <span>{t === 'all' ? 'All' : TYPE_CONFIG[t]?.label}</span>
                    <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', opacity: 0.75 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {uploading ? (
            <div style={{ textAlign: 'center', padding: 36, background: 'var(--bg2)', borderRadius: 14, border: '1px dashed var(--accent)', color: 'var(--accent)', fontSize: 13.5 }}>
              🔍 Analyzing document and extracting skills...
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: '32px 20px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              No documents in this category yet. Upload a Resume or Certificate above to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 14 }}>
              {filteredItems.map((item) => {
                const cfg = TYPE_CONFIG[item.item_type as string] || TYPE_CONFIG.other;
                const localAudit = getLocalAuditStatus(item.id);
                const isItemVerified = Boolean(item.verified) || localAudit?.status === 'verified';
                const score = Math.round(localAudit?.score || item.ai_confidence_score || 0);
                const isRejected =
                  !isItemVerified &&
                  (localAudit?.status === 'rejected' ||
                    String(item.endorsement_note || '').toLowerCase().includes('rejected'));

                const cachedAi = getLocalAiAnalysis(item.id);
                const rawCardSkills: string[] = Array.from(
                  new Set(
                    [...(cachedAi?.skills || []), ...(Array.isArray(item.skill_tags) ? item.skill_tags : [])]
                      .map((s: any) => String(s || '').trim())
                      .filter(Boolean)
                  )
                );
                const cardSkills =
                  rawCardSkills.length > 0
                    ? rawCardSkills
                    : extractSkillsFast(`${item.title || ''} ${item.description || ''}`, item.skill_tags).filter(
                        (s) => !['System Design', 'Problem Solving'].includes(s)
                      );
                const cleanDesc = cleanCardDescription(item.description);

                return (
                  <div
                    key={item.id}
                    data-testid={`vault-asset-card-${item.id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 15,
                      overflow: 'hidden',
                      background: 'var(--card)',
                      border: `1px solid ${
                        isItemVerified
                          ? 'rgba(34,197,94,0.32)'
                          : isRejected
                          ? 'rgba(239,68,68,0.35)'
                          : 'var(--border)'
                      }`,
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
                    }}
                  >
                    {/* Compact Card Header */}
                    <div
                      style={{
                        padding: '12px 15px',
                        borderBottom: '1px solid var(--border)',
                        background: 'rgba(15, 23, 42, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                        <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)' }}>
                          {cfg.label}
                        </span>
                      </div>

                      {isItemVerified ? (
                        <span style={{ background: 'rgba(34,197,94,0.14)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 99, padding: '2px 8px', fontSize: 10.5, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          ✓ Verified {score > 0 ? `(${score}%)` : ''}
                        </span>
                      ) : isRejected ? (
                        <span style={{ background: 'rgba(239,68,68,0.14)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 99, padding: '2px 8px', fontSize: 10.5, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          ✕ Failed Check
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 99, padding: '2px 8px', fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          Needs Check
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '14px 15px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.3 }}>
                          {item.title}
                        </h3>
                        {item.organization_name && (
                          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{item.organization_name}</div>
                        )}
                      </div>

                      {cleanDesc && (
                        <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cleanDesc}
                        </p>
                      )}

                      {cardSkills.length > 0 && (
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
                          {cardSkills.slice(0, 5).map((s: string) => (
                            <span
                              key={s}
                              style={{
                                fontSize: 11,
                                padding: '2px 7px',
                                borderRadius: 5,
                                background: isItemVerified ? 'rgba(34,197,94,0.1)' : 'var(--bg3)',
                                color: isItemVerified ? 'var(--green)' : 'var(--t2)',
                                border: `1px solid ${isItemVerified ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`,
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Compact Action Bar */}
                    <div style={{ padding: '10px 15px', borderTop: '1px solid var(--border)', background: 'rgba(10, 15, 30, 0.25)', display: 'flex', gap: 6, alignItems: 'center' }}>
                      {isItemVerified ? (
                        <span style={{ flex: 1, textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--green)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '6px 8px' }}>
                          ✓ Synced to Portfolio (+5 Trust)
                        </span>
                      ) : (
                        <button
                          type="button"
                          data-testid={`vault-verify-room-btn-${item.id}`}
                          onClick={() => launchDefenseRoom(item)}
                          className="btn-primary btn-sm"
                          style={{ flex: 1, fontSize: 12, fontWeight: 800, padding: '6px 10px', justifyContent: 'center' }}
                        >
                          ⚔️ {isRejected ? `Retry (${auditor.name})` : `Verify with ${auditor.name}`}
                        </button>
                      )}

                      <button
                        type="button"
                        data-testid={`vault-view-btn-${item.id}`}
                        onClick={() => openDocumentViewer(item)}
                        className="btn-ghost btn-sm"
                        title="View uploaded document & AI scan"
                        style={{ fontSize: 11.5, padding: '6px 9px' }}
                      >
                        👁 View
                      </button>

                      {!isItemVerified && (
                        <button
                          type="button"
                          data-testid={`vault-delete-btn-${item.id}`}
                          onClick={() => handleDeleteItem(item)}
                          className="btn-ghost btn-sm"
                          title="Delete document"
                          style={{ fontSize: 11.5, padding: '6px 9px', color: '#f87171' }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCORE HISTORY & MENTALITY */}
      {vaultView === 'history' && (
        <TelemetryAuditLedger
          userId={user?.id}
          user={user}
          cOS={cOS}
          liveTrustScore={liveTrust}
          verifiedCount={verified_total}
          totalVaultCount={total}
        />
      )}

      {/* IN-APP DOCUMENT PREVIEW & GROQ AI SCAN MODAL */}
      {previewDoc && (
        <div
          onClick={closeDocumentViewer}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(2, 6, 23, 0.78)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 1080,
              maxHeight: '90vh',
              borderRadius: 18,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  📄 {previewDoc.item.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                  {previewDoc.fileName}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleRescanDocument(previewDoc.item)}
                  disabled={previewDoc.rescanning}
                  className="btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  {previewDoc.rescanning ? '⏳ Scanning with Groq AI...' : '🔄 Re-scan with Groq AI'}
                </button>
                {(previewDoc.signedUrl || previewDoc.blobUrl) && (
                  previewDoc.signedUrl ? (
                    <a
                      href={previewDoc.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost btn-sm"
                      style={{ fontSize: 12, textDecoration: 'none' }}
                    >
                      ↗ Open in New Tab
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (previewDoc.blobUrl) window.open(previewDoc.blobUrl, '_blank');
                      }}
                      className="btn-ghost btn-sm"
                      style={{ fontSize: 12 }}
                    >
                      ↗ Open in New Tab
                    </button>
                  )
                )}
                {(previewDoc.blobUrl || previewDoc.signedUrl) && (
                  <a
                    href={previewDoc.blobUrl || previewDoc.signedUrl || undefined}
                    download={previewDoc.fileName}
                    className="btn-ghost btn-sm"
                    style={{ fontSize: 12, textDecoration: 'none' }}
                  >
                    ⬇ Download
                  </a>
                )}
                <button
                  type="button"
                  onClick={closeDocumentViewer}
                  className="btn-ghost btn-sm"
                  style={{ fontSize: 12 }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Split Body: Left = Live Document Viewer, Right = What Groq AI Read */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.35fr) minmax(260px, 0.85fr)', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {/* Left: Rendered PDF / Image / Text */}
              <div style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', minHeight: 460, maxHeight: '76vh' }}>
                {previewDoc.loadingFile ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', fontSize: 13.5 }}>
                    ⏳ Loading your uploaded document from Secure Vault...
                  </div>
                ) : previewDoc.fileError ? (
                  previewDoc.aiAnalysis?.rawTextExcerpt || previewDoc.item?.description ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                      <div
                        style={{
                          padding: '9px 14px',
                          background: 'rgba(245,158,11,0.12)',
                          borderBottom: '1px solid rgba(245,158,11,0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontSize: 11.5, color: '#fbbf24', fontWeight: 700 }}>
                          📄 Showing Extracted Document Content ({previewDoc.fileError})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            closeDocumentViewer();
                            setShowUploadPanel(true);
                            fileRef.current?.click();
                          }}
                          className="btn-primary btn-sm"
                          style={{ fontSize: 11, padding: '4px 10px' }}
                        >
                          📤 Re-upload Full PDF
                        </button>
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: 18, background: '#0b1120' }}>
                        <div
                          style={{
                            maxWidth: 640,
                            margin: '0 auto',
                            padding: 20,
                            borderRadius: 10,
                            background: '#ffffff',
                            color: '#0f172a',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                            fontSize: 12.5,
                            lineHeight: 1.65,
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
                            {previewDoc.item.title}
                          </div>
                          {previewDoc.aiAnalysis?.rawTextExcerpt || cleanCardDescription(previewDoc.item.description)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', gap: 10 }}>
                      <div style={{ fontSize: 28 }}>📂</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>Document Preview Unavailable</div>
                      <div style={{ fontSize: 12.5, color: 'var(--t3)', maxWidth: 360 }}>{previewDoc.fileError}</div>
                      <button
                        type="button"
                        onClick={() => {
                          closeDocumentViewer();
                          setShowUploadPanel(true);
                          fileRef.current?.click();
                        }}
                        className="btn-primary btn-sm"
                      >
                        📤 Upload / Re-upload File
                      </button>
                    </div>
                  )
                ) : previewDoc.pdfBytes && previewDoc.mimeType.includes('pdf') ? (
                  <PdfCanvasViewer
                    data={previewDoc.pdfBytes}
                    fileName={previewDoc.fileName}
                    signedUrl={previewDoc.signedUrl}
                    blobUrl={previewDoc.blobUrl}
                  />
                ) : (previewDoc.blobUrl || previewDoc.signedUrl) && previewDoc.mimeType.startsWith('image/') ? (
                  <div style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src={previewDoc.blobUrl || previewDoc.signedUrl || undefined}
                      alt={previewDoc.fileName}
                      style={{ maxWidth: '100%', borderRadius: 10, boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
                    />
                  </div>
                ) : previewDoc.textContent ? (
                  <pre style={{ flex: 1, overflow: 'auto', padding: 16, margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--t1)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                    {previewDoc.textContent}
                  </pre>
                ) : previewDoc.blobUrl ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 32 }}>📎</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>{previewDoc.fileName}</div>
                    <a
                      href={previewDoc.blobUrl}
                      download={previewDoc.fileName}
                      className="btn-primary btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      ⬇ Download File
                    </a>
                  </div>
                ) : null}
              </div>

              {/* Right: Groq AI Extracted Understanding */}
              <div style={{ padding: 16, overflowY: 'auto', maxHeight: '76vh', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                    Skills Extracted From This File
                  </div>
                  {((previewDoc.aiAnalysis?.skills?.length || 0) > 0 || (previewDoc.item.skill_tags?.length || 0) > 0) ? (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {Array.from(
                        new Set<string>([
                          ...(previewDoc.aiAnalysis?.skills || []),
                          ...(previewDoc.item.skill_tags || []),
                        ])
                      ).map((sk) => (
                        <span
                          key={sk}
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: 'rgba(99,102,241,0.12)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                      No skills extracted yet. Click <strong>Re-scan with Groq AI</strong> above to read this file now.
                    </div>
                  )}
                </div>

                {previewDoc.aiAnalysis?.projects?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                      Projects &amp; Experience Read ({previewDoc.aiAnalysis.projects.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {previewDoc.aiAnalysis.projects.map((p: any, idx: number) => (
                        <div key={idx} style={{ padding: '8px 10px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 12 }}>
                          <div style={{ fontWeight: 700, color: 'var(--t1)' }}>{p.name}</div>
                          {p.techStack?.length > 0 && (
                            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                              {p.techStack.join(' · ')}
                            </div>
                          )}
                          {p.claim && <div style={{ fontSize: 11.5, color: 'var(--t2)', marginTop: 3 }}>{p.claim}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewDoc.aiAnalysis?.rawTextExcerpt && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                      Extracted Document Text Preview
                    </div>
                    <pre style={{ margin: 0, padding: 10, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 11, lineHeight: 1.5, color: 'var(--t2)', maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                      {previewDoc.aiAnalysis.rawTextExcerpt.slice(0, 1800)}
                    </pre>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const target = previewDoc.item;
                      closeDocumentViewer();
                      launchDefenseRoom(target);
                    }}
                    className="btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                  >
                    ⚔️ Verify Accuracy with {auditor.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
