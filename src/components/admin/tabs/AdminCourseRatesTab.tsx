'use client';

import React, { useState, useEffect } from 'react';
import { adminEconomyService, CourseCertificationRate } from '@/lib/services/adminEconomyService';

export default function AdminCourseRatesTab() {
  const [rates, setRates] = useState<CourseCertificationRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CourseCertificationRate>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    id: '',
    title: '',
    category: 'Tech',
    originalPriceInr: 2999,
    discountedPriceInr: 1499,
    priceInPins: 250,
    certFeeInr: 499
  });

  useEffect(() => {
    loadRates();
  }, []);

  async function loadRates() {
    setLoading(true);
    const data = await adminEconomyService.getCourseRates();
    setRates(data);
    setLoading(false);
  }

  const filteredRates = rates.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  function startEdit(course: CourseCertificationRate) {
    setEditingId(course.id);
    setEditForm({ ...course });
  }

  async function saveEdit(id: string) {
    try {
      const updated = await adminEconomyService.updateCourseRate(id, editForm);
      setRates(prev => prev.map(r => (r.id === id ? updated : r)));
      setEditingId(null);
      setFeedback(`✅ Updated purchase rates for "${updated.title}" successfully.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('❌ Failed to update course rate.');
    }
  }

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!newCourse.id || !newCourse.title) return;
    try {
      const created = await adminEconomyService.updateCourseRate(newCourse.id.toLowerCase().replace(/\s+/g, '_'), newCourse);
      setRates(prev => [created, ...prev]);
      setShowAddModal(false);
      setNewCourse({
        id: '',
        title: '',
        category: 'Tech',
        originalPriceInr: 2999,
        discountedPriceInr: 1499,
        priceInPins: 250,
        certFeeInr: 499
      });
      setFeedback(`🎉 New certification course "${created.title}" added with active pricing.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('❌ Failed to add course.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
            🏷️ Certification Course Purchase & Pricing Rates
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--t3)', fontSize: 14.5 }}>
            Update course enrollment fees (INR), discount prices, Pins redemption equivalent, and proctored certification exam fees in real time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '9px 16px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: 13.5,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          + Add Course Pricing Rate
        </button>
      </div>

      {feedback && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', fontWeight: 600, fontSize: 14 }}>
          {feedback}
        </div>
      )}

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by course title or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 240,
            padding: '9px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card, #fff)',
            color: 'var(--t1)',
            fontSize: 14,
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Tech', 'Commerce', 'IoT', 'AI & Data'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: categoryFilter === cat ? 'var(--accent, #2563eb)' : 'var(--card, #fff)',
                color: categoryFilter === cat ? '#fff' : 'var(--t2)',
                fontSize: 13,
                fontWeight: categoryFilter === cat ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rates Table */}
      <div style={{ background: 'var(--card, #fff)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Course & Track</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Category</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Original Price (₹)</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Discounted Rate (₹)</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Pins Price</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Cert Exam Fee (₹)</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  Loading course purchase rates...
                </td>
              </tr>
            ) : filteredRates.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  No courses found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredRates.map(course => {
                const isEditing = editingId === course.id;

                return (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 650, color: 'var(--t1)', fontSize: 14 }}>{course.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'monospace' }}>ID: {course.id}</div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11.5,
                        fontWeight: 650,
                        background: course.category === 'Commerce' ? '#fef3c7' : course.category === 'Tech' ? '#dbeafe' : '#f3e8ff',
                        color: course.category === 'Commerce' ? '#92400e' : course.category === 'Tech' ? '#1e40af' : '#6b21a8'
                      }}>
                        {course.category}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.originalPriceInr || 0}
                          onChange={e => setEditForm({ ...editForm, originalPriceInr: Number(e.target.value) })}
                          style={{ width: 80, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <span style={{ textDecoration: 'line-through', color: 'var(--t3)', fontSize: 13 }}>₹{course.originalPriceInr}</span>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.discountedPriceInr || 0}
                          onChange={e => setEditForm({ ...editForm, discountedPriceInr: Number(e.target.value) })}
                          style={{ width: 80, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)', fontWeight: 700 }}
                        />
                      ) : (
                        <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: 14 }}>₹{course.discountedPriceInr}</span>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.priceInPins || 0}
                          onChange={e => setEditForm({ ...editForm, priceInPins: Number(e.target.value) })}
                          style={{ width: 70, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <span style={{ fontWeight: 650, color: '#f59e0b', fontSize: 13.5 }}>🪙 {course.priceInPins} Pins</span>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.certFeeInr || 0}
                          onChange={e => setEditForm({ ...editForm, certFeeInr: Number(e.target.value) })}
                          style={{ width: 70, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <span style={{ fontSize: 13.5, color: 'var(--t1)' }}>₹{course.certFeeInr}</span>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            onClick={() => saveEdit(course.id)}
                            style={{ padding: '5px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: 'var(--t2)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(course)}
                          style={{ padding: '5px 12px', background: 'var(--accent, #2563eb)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          ✏️ Edit Rate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'var(--card, #fff)',
            borderRadius: 16,
            padding: 28,
            maxWidth: 520,
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
              Add Certification Course Rate
            </h3>

            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Course Code ID</label>
                <input
                  type="text"
                  placeholder="e.g. bcom_dmkt or tech_ai_pro"
                  value={newCourse.id}
                  onChange={e => setNewCourse({ ...newCourse, id: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Digital Marketing Analytics & Performance"
                  value={newCourse.title}
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Category</label>
                  <select
                    value={newCourse.category}
                    onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  >
                    <option value="Tech">Tech</option>
                    <option value="Commerce">Commerce</option>
                    <option value="IoT">IoT</option>
                    <option value="AI & Data">AI & Data</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={newCourse.discountedPriceInr}
                    onChange={e => setNewCourse({ ...newCourse, discountedPriceInr: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Price in Pins (🪙)</label>
                  <input
                    type="number"
                    value={newCourse.priceInPins}
                    onChange={e => setNewCourse({ ...newCourse, priceInPins: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Exam Fee (₹)</label>
                  <input
                    type="number"
                    value={newCourse.certFeeInr}
                    onChange={e => setNewCourse({ ...newCourse, certFeeInr: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--t2)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Course Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
