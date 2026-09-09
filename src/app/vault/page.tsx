'use client';
// Premium Proof-of-Work Vault & Secure Storage
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { useAddVaultItem, useVault } from '@/lib/api/hooks';
import { useCareerOS } from '@/lib/context/CareerOSContext';

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  academic:      { icon: '🎓', color: 'var(--teal)',   label: 'Academic Record' },
  certification: { icon: '🏆', color: 'var(--amber)',  label: 'Certification'   },
  internship:    { icon: '🏢', color: 'var(--blue)',   label: 'Internship'      },
  project:       { icon: '⚡', color: 'var(--purple)', label: 'Project'         },
  activity:      { icon: '🌟', color: 'var(--gold)',   label: 'Extracurricular' },
  exam:          { icon: '📝', color: 'var(--green)',  label: 'Exam Score'      },
  financial:     { icon: '💵', color: 'var(--pink)',   label: 'Financial Proof' },
  personal:      { icon: '👤', color: 'var(--coral)',  label: 'Personal ID'     },
  other:         { icon: '📎', color: 'var(--t2)',     label: 'Other'           },
};

export default function VaultPage() {
  const { user } = useAuth();
  const { vaultItems: ctxItems, addVaultItem, updateVaultItem, earnPins } = useCareerOS();
  // Also load from Firestore (real persisted items) and merge with context items
  const { data: fsVaultData } = useVault();
  const fsItems = (fsVaultData || []) as any[];
  // Deduplicate: Firestore items take precedence, fill in with context items not yet synced
  const fsIds = new Set(fsItems.map((i: any) => i.id));
  const vaultItems = [
    ...fsItems,
    ...ctxItems.filter(i => !fsIds.has(i.id)),
  ];
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    title: '', itemType: 'project', description: '',
    organizationName: '', startDate: '', endDate: '',
  });

  const filteredItems = filter === 'all' 
    ? vaultItems 
    : vaultItems.filter(item => item.item_type === filter);

  // Live stats from actual context data
  const total = vaultItems.length;
  const verified_total = vaultItems.filter(i => i.verified).length;
  const avg_score = vaultItems.length > 0 
    ? Math.round(vaultItems.reduce((acc, i) => acc + (i.ai_confidence_score ?? 0), 0) / vaultItems.length)
    : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setUploading(true);

    try {
      // Default tags based on item category
      let skills = ['Analytical', 'Problem Solving'];
      if (form.itemType === 'project') skills = ['Project Evidence', 'GitHub'];
      else if (form.itemType === 'certification') skills = ['Certification Evidence'];
      else if (form.itemType === 'internship') skills = ['Work Experience'];
      else if (form.itemType === 'hackathon') skills = ['Hackathon Project'];

      addVaultItem({
        title: form.title.trim(),
        item_type: form.itemType,
        organization_name: form.organizationName.trim(),
        description: form.description.trim(),
        skill_tags: skills,
        verified: false,
        ai_confidence_score: 0,
      });

      // Also persist to Firestore
      api.post('/api/vault', {
        title: form.title.trim(),
        item_type: form.itemType,
        organization_name: form.organizationName.trim(),
        description: form.description.trim(),
        skill_tags: skills,
        verified: false,
      }).catch(() => {/* offline ok — Supabase / localStorage handles it */});

      setShowForm(false);
      setForm({ title: '', itemType: 'project', description: '', organizationName: '', startDate: '', endDate: '' });
    } finally {
      setUploading(false);
    }
  }

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileUploadLive = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      console.log(`[VAULT PAGE]: Uploading "${file.name}" to 12-stage ingestion pipeline...`);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('primaryName', user?.displayName || 'Candidate');

      const res = await api.post<{ ok: boolean; document?: any; data?: any; message?: string }>('/api/vault/upload', formData);
      const doc = res.document || res.data;
      if (doc) {
        console.log(`[VAULT PAGE]: Ingestion success: "${doc.title}", Skills: [${doc.skills?.join(', ') || ''}]`);
        addVaultItem({
          title: doc.title || file.name,
          item_type: doc.category === 'resume' ? 'resume' : doc.category === 'certification' ? 'certification' : 'academic',
          organization_name: doc.institution || 'Verified Portal',
          description: `Uploaded file: ${doc.fileName} (${doc.fileSize}). Score/GPA: ${doc.scoreOrGpa}. Storage: ${doc.storageUrl || 'Supabase Vault'}`,
          skill_tags: doc.skills && doc.skills.length > 0 ? doc.skills : ['Verified File'],
        });
      }
    } catch (err) {
      console.error('[VAULT PAGE UPLOAD ERROR]:', err);
      const titleWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      addVaultItem({
        title: titleWithoutExt.split('-').join(' ').split('_').join(' ').replace(/\b\w/g, c => c.toUpperCase()),
        item_type: 'other',
        organization_name: 'Local Upload',
        description: `Uploaded file: ${file.name} (${Math.round(file.size / 1024)} KB).`,
        skill_tags: [file.name.split('.').pop()?.toUpperCase() || 'FILE'],
      });
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
    <div style={{ maxWidth: 1040, margin: '0 auto' }} className="animate-fade-in">
      <div className="page-hero" style={{ marginBottom: 20 }}>
        <div style={{ position:"relative", zIndex:1 }}>
          <h1 className="page-hero-title">🗄 Proof Vault</h1>
          <p className="page-hero-sub">Your tamper-proof evidence locker — upload certificates, projects, and achievements</p>
        </div>
      </div>

      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            Proof-of-Work Vault
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: 13 }}>
            🔒 Evidence locker for certifications, projects, and credentials.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowForm(s => !s)} className="btn-primary btn-sm">
            {showForm ? '✕ Cancel' : '+ Add Proof-of-Work'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Vault Assets',  value: total,          color: 'var(--accent)' },
          { label: 'AI Auto-Verified',    value: verified_total, color: 'var(--green)'  },
          { label: 'Confidence Quotient', value: `${avg_score}%`, color: 'var(--teal)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
          background: dragActive ? 'rgba(79,70,229,0.06)' : 'var(--bg2)',
          borderRadius: 18,
          padding: '24px 16px',
          textAlign: 'center',
          marginBottom: 24,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={() => fileRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileRef} 
          accept=".pdf,.docx,.jpg,.png,.zip" 
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUploadLive(e.target.files[0]);
            }
          }}
        />
        <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Drag & Drop Proof-of-Work</h3>
        <p style={{ fontSize: 11.5, color: 'var(--t3)', maxWidth: 420, margin: '0 auto' }}>
          Supports PDFs, GitHub ZIPs, certificates, and images. PinIT AI automatically runs secure verification checking metadata.
        </p>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 18, padding: 24, marginBottom: 24 }} className="animate-fade-in">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Add Proof-of-Work Asset</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Asset Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({...f, title:e.target.value}))} placeholder="e.g. Completed React dashboard for scale" required />
              </div>
              <div className="form-group">
                <label className="form-label">Evidence Category *</label>
                <select className="form-input" value={form.itemType} onChange={e => setForm(f => ({...f, itemType:e.target.value}))}>
                  {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Issuing Organization</label>
              <input className="form-input" value={form.organizationName} onChange={e => setForm(f => ({...f, organizationName:e.target.value}))} placeholder="Company / University / Platform" />
            </div>
            <div className="form-group">
              <label className="form-label">Evidence Description</label>
              <textarea className="form-input" style={{ resize: 'vertical', minHeight: 80 }} value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))} placeholder="What project challenges did you solve? Detail exact stack & tech impact." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" value={form.startDate} onChange={e => setForm(f => ({...f, startDate:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-input" value={form.endDate} onChange={e => setForm(f => ({...f, endDate:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Proof / Certificate File</label>
                <button type="button" className="btn-ghost" style={{ width: '100%', height: 38 }} onClick={() => fileRef.current?.click()}>
                  📎 Attach Proof Evidence
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }} disabled={uploading}>
              {uploading ? 'Processing AI Verification...' : '➔ Submit & Run Auto-Verification'}
            </button>
          </form>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...Object.keys(TYPE_CONFIG)].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: '5px 14px', borderRadius: 20, border: `1px solid ${filter === t ? 'var(--accent)' : 'var(--border)'}`, background: filter === t ? 'rgba(79,70,229,0.1)' : 'transparent', color: filter === t ? '#8b8bf5' : 'var(--t2)', cursor: 'pointer', fontSize: 12 }}>
            {t === 'all' ? 'All Assets' : TYPE_CONFIG[t]?.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {uploading && !showForm ? (
        <div style={{ textAlign: 'center', padding: 48, background: 'var(--bg2)', borderRadius: 14, border: '1px dashed var(--accent)', color: 'var(--accent)' }}>
          <span style={{ display: 'block', fontSize: 24, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>🔒</span>
          Extracting document metadata & running AI security analysis...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗄️</div>
          <div className="empty-title">Secure Vault is empty</div>
          <div className="empty-desc">Attach certifications or projects. PINIT AI parses and indexes everything into your Career OS profile.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredItems.map((item) => {
            const cfg = TYPE_CONFIG[item.item_type as string] || TYPE_CONFIG.other;
            const score = Math.round(item.ai_confidence_score || 0);
            const gaugeColor = score > 80 ? 'var(--green)' : score > 50 ? 'var(--amber)' : 'var(--coral)';
            return (
              <div
                key={item.id}
                className="glass-card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: `1px solid ${item.verified ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Visual Document Preview Header */}
                <div style={{
                  height: 100,
                  background: `linear-gradient(135deg, ${cfg.color}15, rgba(13, 18, 30, 0.4))`,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Backdrop Glow */}
                  <div style={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `${cfg.color}10`,
                    filter: 'blur(10px)',
                    pointerEvents: 'none'
                  }} />
                  
                  {/* Large visual icon */}
                  <div style={{ fontSize: 36, position: 'relative', zIndex: 1 }}>
                    {cfg.icon}
                  </div>

                  {/* Verified / Pending Badge Overlay */}
                  {item.verified ? (
                    <div style={{
                      position: 'absolute',
                      left: 12,
                      top: 12,
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: 'var(--green)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: 100,
                      padding: '2px 8px',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      ✓ Verified
                    </div>
                  ) : (
                    <div style={{
                      position: 'absolute',
                      left: 12,
                      top: 12,
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: 'var(--amber)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      borderRadius: 100,
                      padding: '2px 8px',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      ⏳ Pending
                    </div>
                  )}

                  {/* AI Confidence Trust Gauge Overlay */}
                  <div style={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    background: 'rgba(10, 15, 30, 0.75)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--t2)'
                  }}>
                    {score > 0 ? (
                      <>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: gaugeColor, boxShadow: `0 0 6px ${gaugeColor}` }} />
                        AI Trust: {score}%
                      </>
                    ) : (
                      <span style={{ color: 'var(--t3)', fontSize: 9.5 }}>Manual Entry</span>
                    )}
                  </div>
                </div>

                {/* Card details body */}
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {cfg.label}
                    </span>
                    {item.is_public && (
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,0.2)', fontFamily: 'var(--font-mono)' }}>👁 Shared</span>
                    )}
                  </div>

                  <div>
                    <h3 style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700, color: 'var(--t1)', lineClamp: 1, WebkitLineClamp: 1, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                      {item.title}
                    </h3>
                    {item.organization_name && (
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', fontWeight: 500 }}>
                        {item.organization_name}
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45, margin: 0, lineClamp: 2, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                      {item.description}
                    </p>
                  )}

                  {/* Active usages badges */}
                  {(item.used_in_resume || item.used_in_portfolio) && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 }}>
                      {item.used_in_resume && (
                        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(99,102,241,0.1)', color: '#8b8bf5', border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'var(--font-mono)' }}>
                          📄 Resume
                        </span>
                      )}
                      {item.used_in_portfolio && (
                        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,0.2)', fontFamily: 'var(--font-mono)' }}>
                          🌐 Portfolio
                        </span>
                      )}
                    </div>
                  )}

                  {/* Skill tags */}
                  {item.skill_tags && item.skill_tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: (item.used_in_resume || item.used_in_portfolio) ? 2 : 'auto' }}>
                      {item.skill_tags.slice(0, 3).map((s: string) => (
                        <span key={s} style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', color: 'var(--t2)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions bottom bar */}
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'rgba(10, 15, 30, 0.25)', display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      updateVaultItem(item.id, { is_public: !item.is_public });
                    }}
                    className="btn-ghost btn-sm"
                    style={{ fontSize: 11, padding: '4px 8px', flex: 1, justifyContent: 'center' }}
                  >
                    {item.is_public ? '🔒 Private' : '👁 Share'}
                  </button>
                  {!item.verified && (
                    <span style={{ 
                      fontSize: 10.5, padding: '4px 8px', color: 'var(--amber)', 
                      background: 'rgba(245,158,11,0.08)', borderRadius: 6,
                      border: '1px solid rgba(245,158,11,0.15)', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center', flex: 1, fontWeight: 600
                    }}>
                      ⏳ Pending Audit
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
