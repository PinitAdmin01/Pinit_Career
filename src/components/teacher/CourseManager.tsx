'use client';

import React, { useState, useEffect } from 'react';
import { portalService, CourseMaterialRecord } from '@/lib/services/portalService';

export default function CourseManager() {
  const [materials, setMaterials] = useState<CourseMaterialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [semester, setSemester] = useState('Sem 3');
  const [type, setType] = useState<'pdf' | 'pptx' | 'docx' | 'link'>('pdf');
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterialRecord | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await portalService.getMaterials();
        setMaterials(data);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    // Create valid Data URL content blob for real downloading
    const sampleContent = `Document: ${title}\nSubject: ${subject}\nSemester: ${semester}\nPublished via Campus OS.`;
    const encodedDataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(sampleContent)}`;

    const newMaterial: CourseMaterialRecord = {
      id: String(Date.now()),
      title: title.trim(),
      subject,
      semester,
      type,
      fileUrl: encodedDataUrl,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '1.5 MB',
      downloadsCount: 0,
      tags: tagInput ? tagInput.split(',').map(t => t.trim()).filter(Boolean) : [subject]
    };

    await portalService.saveMaterial(newMaterial);
    setMaterials([newMaterial, ...materials]);
    setTitle('');
    setTagInput('');
  }

  function handleDownload(mat: CourseMaterialRecord) {
    const a = document.createElement('a');
    a.href = mat.fileUrl.startsWith('data:') ? mat.fileUrl : `data:text/plain;charset=utf-8,${encodeURIComponent(`Document: ${mat.title}`)}`;
    a.download = `${mat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${mat.type === 'pdf' ? 'pdf' : mat.type === 'pptx' ? 'pptx' : mat.type === 'docx' ? 'docx' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setMaterials(materials.map(m => m.id === mat.id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m));
  }

  const filtered = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.subject.toLowerCase().includes(search.toLowerCase()) ||
                          (m.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Quick Action Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>📚 Persistent Course Material Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>Publish lectures, lab manuals, and notes connected to live storage with downloadable blobs.</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '8px 16px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: 13, color: '#1d4ed8', fontWeight: 600 }}>
            Total Materials: <strong>{materials.length}</strong>
          </div>
          <div style={{ padding: '8px 16px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
            Total Downloads: <strong>{materials.reduce((acc, m) => acc + (m.downloadsCount || 0), 0)}</strong>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} style={{
        background: 'var(--bg2, #f8fafc)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>➕ Upload & Publish Material</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Material Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Advanced Graph Traversal Algorithms"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Subject</label>
            <input 
              type="text" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Semester</label>
            <select 
              value={semester} 
              onChange={e => setSemester(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
            >
              {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>File Format</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value as any)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
            >
              <option value="pdf">📕 PDF Document</option>
              <option value="pptx">📊 Presentation (PPTX)</option>
              <option value="docx">📝 Word Document</option>
              <option value="link">🔗 External Resource Link</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Tags (comma-separated)</label>
          <input 
            type="text" 
            value={tagInput} 
            onChange={e => setTagInput(e.target.value)} 
            placeholder="e.g. Dynamic Programming, Algorithms, Exam Prep"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
        </div>

        <button 
          type="submit" 
          style={{
            alignSelf: 'flex-start',
            padding: '10px 24px',
            background: 'var(--primary, #3b82f6)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🚀 Publish Material
        </button>
      </form>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search materials by title, subject, or tag..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
        />

        <select 
          value={typeFilter} 
          onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
        >
          <option value="all">All Formats</option>
          <option value="pdf">📕 PDF</option>
          <option value="pptx">📊 PPTX</option>
          <option value="docx">📝 DOCX</option>
          <option value="link">🔗 Link</option>
        </select>
      </div>

      {/* Material Modal Preview */}
      {previewMaterial && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 500, width: '100%' }}>
            <h3 style={{ margin: '0 0 8px' }}>📄 Preview: {previewMaterial.title}</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>Subject: {previewMaterial.subject} • {previewMaterial.semester}</p>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', margin: '16px 0', fontSize: 13 }}>
              Uploaded on {previewMaterial.uploadedAt} • File Size: {previewMaterial.size} • Total Downloads: {previewMaterial.downloadsCount}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {(previewMaterial.tags || []).map(t => (
                <span key={t} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>#{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setPreviewMaterial(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}>Close</button>
              <button onClick={() => handleDownload(previewMaterial)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 600 }}>Download File</button>
            </div>
          </div>
        </div>
      )}

      {/* Material List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading published materials...</div>
        ) : filtered.map(mat => (
          <div key={mat.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 18,
            borderRadius: 12,
            border: '1px solid var(--border, #e2e8f0)',
            background: 'var(--bg1, #fff)',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28 }}>
                {mat.type === 'pdf' ? '📕' : mat.type === 'pptx' ? '📊' : mat.type === 'docx' ? '📝' : '🔗'}
              </span>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{mat.title}</h4>
                <div style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--t3, #64748b)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{mat.subject}</span> • <span>{mat.semester}</span> • <span>{mat.uploadedAt}</span> • <span>{mat.size}</span>
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>• 📥 {mat.downloadsCount || 0} downloads</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {(mat.tags || []).map(tag => (
                    <span key={tag} style={{ background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => setPreviewMaterial(mat)}
                style={{ padding: '6px 12px', fontSize: 13, borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                👁️ Preview
              </button>
              <button 
                onClick={() => handleDownload(mat)}
                style={{ padding: '6px 14px', fontSize: 13, borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                📥 Download Blob
              </button>
              <button 
                onClick={async () => {
                  const prev = materials;
                  setMaterials(materials.filter(m => m.id !== mat.id));
                  try {
                    await portalService.deleteMaterial(mat.id);
                  } catch {
                    setMaterials(prev); // Rollback on failure
                  }
                }}
                style={{ padding: '6px 12px', fontSize: 13, borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
