'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  trustScore: number;
  atsScore: number;
  status: 'active' | 'suspended';
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

  const [users, setUsers] = useState<UserRow[]>([]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showOverrideModal, setShowOverrideModal] = useState<UserRow | null>(null);
  const [overrideValue, setOverrideValue] = useState<number>(90);
  const [overrideReason, setOverrideReason] = useState('');

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  function toggleStatus(id: string) {
    if (!isSuperAdmin) {
      alert('🔒 Security Guard: Only SuperAdmins can suspend or reactivate accounts.');
      return;
    }
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  }

  function handleApplyOverride() {
    if (!showOverrideModal) return;
    if (!overrideReason || overrideReason.length < 5) {
      alert('Please provide a reason for the score override.');
      return;
    }
    setUsers(users.map(u => u.id === showOverrideModal.id ? { ...u, trustScore: overrideValue } : u));
    setShowOverrideModal(null);
    setOverrideReason('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>👥 User & Role Management</h2>
          <p style={{ color: 'var(--t3, #64748b)', margin: '4px 0 0', fontSize: 14 }}>Manage student, faculty, and administrator accounts, trust scores, and access permissions.</p>
        </div>

        <div style={{ background: isSuperAdmin ? '#dcfce7' : '#fee2e2', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: isSuperAdmin ? '#15803d' : '#b91c1c' }}>
          {isSuperAdmin ? '🛡️ SuperAdmin Access Verified' : '🔒 Read-Only Admin Guard Active'}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 240,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border, #cbd5e1)'
          }}
        />

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Score Override Modal */}
      {showOverrideModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>📊 SuperAdmin Score Override</h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Target User: {showOverrideModal.name}</span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>New Trust Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideValue}
                  onChange={e => setOverrideValue(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Audit Reason *</label>
                <textarea
                  rows={2}
                  placeholder="Reason for score adjustment..."
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button onClick={() => setShowOverrideModal(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}>Cancel</button>
                <button onClick={handleApplyOverride} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600 }}>Save Override</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      <div style={{ background: 'var(--bg1, #fff)', borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg2, #f8fafc)', textAlign: 'left', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
              <th style={{ padding: 12, fontSize: 13 }}>User</th>
              <th style={{ padding: 12, fontSize: 13 }}>Role</th>
              <th style={{ padding: 12, fontSize: 13 }}>Trust Score</th>
              <th style={{ padding: 12, fontSize: 13 }}>Status</th>
              <th style={{ padding: 12, fontSize: 13, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>{u.email}</div>
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: u.role === 'admin' ? '#fef3c7' : u.role === 'teacher' ? '#f3e8ff' : '#dbeafe',
                    color: u.role === 'admin' ? '#92400e' : u.role === 'teacher' ? '#6b21a8' : '#1e40af'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: 12, fontWeight: 700, color: u.trustScore > 80 ? '#16a34a' : '#d97706' }}>
                  {u.trustScore} / 100
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: u.status === 'active' ? '#16a34a' : '#dc2626' }}>
                    ● {u.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    {isSuperAdmin && (
                      <button
                        onClick={() => { setShowOverrideModal(u); setOverrideValue(u.trustScore); }}
                        style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      >
                        Override Score
                      </button>
                    )}
                    <button
                      onClick={() => toggleStatus(u.id)}
                      style={{
                        padding: '4px 10px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: 'none',
                        background: u.status === 'active' ? '#fee2e2' : '#dcfce7',
                        color: u.status === 'active' ? '#dc2626' : '#16a34a',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
