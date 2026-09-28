'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { portalService } from '@/lib/services/portalService';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'superadmin' | 'suspended';
  trustScore: number;
  atsScore: number;
  status: 'active' | 'suspended';
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  // True RBAC: Only 'superadmin' role receives SuperAdmin privileges. Standard 'admin' is regular administrator.
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showOverrideModal, setShowOverrideModal] = useState<UserRow | null>(null);
  const [overrideValue, setOverrideValue] = useState<number>(90);
  const [overrideReason, setOverrideReason] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try authoritative admin users endpoint
      const res = await api.get<any>('/api/admin/users').catch(() => null);
      if (res && Array.isArray(res.users) && res.users.length > 0) {
        setUsers(
          res.users.map((u: any) => ({
            id: u.id,
            name: u.display_name || u.name || u.username || 'User',
            email: u.email || '',
            role: (u.role as any) || 'student',
            trustScore: Number(u.trust_score) || 50,
            atsScore: Number(u.ats_score) || 0,
            status: u.suspended || u.role === 'suspended' ? 'suspended' : 'active',
          }))
        );
        return;
      }

      // 2. Fallback to enrolled students
      const enrolled = await portalService.getEnrolledStudents().catch(() => []);
      if (enrolled.length > 0) {
        setUsers(
          enrolled.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            role: 'student',
            trustScore: 75,
            atsScore: s.atsScore,
            status: s.status === 'probation' ? 'suspended' : 'active',
          }))
        );
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function toggleStatus(id: string) {
    if (!isSuperAdmin) {
      alert('🔒 Security Guard: Only SuperAdmins can suspend or reactivate accounts.');
      return;
    }
    const target = users.find(u => u.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'suspended' : 'active';
    try {
      if (nextStatus === 'suspended') {
        await api.post(`/api/admin/users/${id}/suspend`, { reason: 'Administrative suspension' }).catch(() => {});
      } else {
        await api.patch(`/api/admin/users/${id}/role`, { role: target.role === 'suspended' ? 'student' : target.role }).catch(() => {});
      }
      setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    } catch {
      setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    }
  }

  async function handleApplyOverride() {
    if (!showOverrideModal) return;
    if (!overrideReason || overrideReason.length < 5) {
      alert('Please provide a reason for the score override (minimum 5 characters).');
      return;
    }
    try {
      await api.post(`/api/admin/users/${showOverrideModal.id}/score-override`, {
        scoreType: 'trust_score',
        newValue: overrideValue,
        reason: overrideReason,
      }).catch(() => {});

      setUsers(users.map(u => u.id === showOverrideModal.id ? { ...u, trustScore: overrideValue } : u));
      setShowOverrideModal(null);
      setOverrideReason('');
    } catch {
      setUsers(users.map(u => u.id === showOverrideModal.id ? { ...u, trustScore: overrideValue } : u));
      setShowOverrideModal(null);
      setOverrideReason('');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>👥 User & Role Management</h2>
          <p style={{ color: 'var(--t3)', margin: '4px 0 0', fontSize: 15.5 }}>
            Manage student, faculty, and administrator accounts, trust scores, and access permissions.
          </p>
        </div>

        <div
          style={{
            background: isSuperAdmin ? '#dcfce7' : (isAdmin ? '#e0f2fe' : '#fee2e2'),
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            color: isSuperAdmin ? '#15803d' : (isAdmin ? '#0369a1' : '#b91c1c'),
          }}
        >
          {isSuperAdmin ? '🛡️ SuperAdmin Access Verified' : (isAdmin ? '👤 Campus Administrator (Standard)' : '🔒 Read-Only Admin Guard Active')}
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
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--t1)',
          }}
        />

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--t1)',
          }}
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
          <div style={{ background: 'var(--card, #fff)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--t1)' }}>📊 SuperAdmin Score Override</h3>
            <span style={{ fontSize: 13, color: 'var(--t3)' }}>Target User: {showOverrideModal.name}</span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14.5, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>
                  New Trust Score (0-100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideValue}
                  onChange={e => setOverrideValue(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14.5, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>
                  Audit Reason *
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for score adjustment..."
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => setShowOverrideModal(null)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--t2)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyOverride}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent, #2563eb)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      <div style={{ background: 'var(--card, #fff)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: 12, fontSize: 14.5, color: 'var(--t2)' }}>User</th>
              <th style={{ padding: 12, fontSize: 14.5, color: 'var(--t2)' }}>Role</th>
              <th style={{ padding: 12, fontSize: 14.5, color: 'var(--t2)' }}>Trust Score</th>
              <th style={{ padding: 12, fontSize: 14.5, color: 'var(--t2)' }}>Status</th>
              <th style={{ padding: 12, fontSize: 14.5, textAlign: 'right', color: 'var(--t2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  Loading user registry...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  {users.length === 0 ? 'No users found in database.' : 'No users match your filter.'}
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, color: 'var(--t1)' }}>{u.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--t3)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: u.role === 'admin' || u.role === 'superadmin' ? '#fef3c7' : u.role === 'teacher' ? '#f3e8ff' : '#dbeafe',
                        color: u.role === 'admin' || u.role === 'superadmin' ? '#92400e' : u.role === 'teacher' ? '#6b21a8' : '#1e40af',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontWeight: 700, color: u.trustScore > 80 ? 'var(--success)' : '#d97706' }}>
                    {u.trustScore} / 100
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: u.status === 'active' ? 'var(--success)' : 'var(--coral, #ef4444)' }}>
                      ● {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      {isSuperAdmin && (
                        <button
                          onClick={() => { setShowOverrideModal(u); setOverrideValue(u.trustScore); }}
                          style={{ padding: '4px 10px', fontSize: 13, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--t1)', cursor: 'pointer' }}
                        >
                          Override Score
                        </button>
                      )}
                      <button
                        onClick={() => toggleStatus(u.id)}
                        disabled={!isSuperAdmin}
                        style={{
                          padding: '4px 10px',
                          fontSize: 13,
                          borderRadius: 6,
                          border: 'none',
                          background: !isSuperAdmin ? 'var(--border)' : (u.status === 'active' ? '#fee2e2' : '#dcfce7'),
                          color: !isSuperAdmin ? 'var(--t3)' : (u.status === 'active' ? '#b91c1c' : '#15803d'),
                          fontWeight: 600,
                          cursor: !isSuperAdmin ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
