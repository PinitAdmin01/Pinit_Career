'use client';
// src/app/maintenance/page.tsx
// Student/Faculty Infrastructure Maintenance Page containing ticket logger forms, Category selectors, and tickets progression trackers.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function StudentMaintenancePortal() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form states
  const [category, setCategory] = useState('Electricity');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await api.get<{ tickets: any[] }>('/api/maintenance/stats');
      setTickets(data.tickets || []);
    } catch {}
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post<{ ok: boolean }>('/api/maintenance/report', {
        category,
        location,
        description
      });
      if (res && res.ok) {
        alert('Infrastructure maintenance ticket logged successfully! Campus facilities team notified ✓');
        setLocation('');
        setDescription('');
        fetchTickets();
      }
    } catch {
      alert('Failed to log ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchCat && matchStatus;
  });

  const cssStyle = `
    .mnt-wrapper {
      max-width: 1040px;
      margin: 0 auto;
    }
    .page-title {
      font-family: var(--font-display), sans-serif;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.6px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .grid-split {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .grid-split {
        grid-template-columns: 1fr;
      }
    }
    .card-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px var(--border);
    }
    .card-title {
      font-family: var(--font-display), sans-serif;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tbl-mnt {
      width: 100%;
      border-collapse: collapse;
    }
    .tbl-mnt th {
      text-align: left;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--t2);
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border2);
    }
    .tbl-mnt td {
      padding: 12px 0;
      font-size: 13px;
      border-bottom: 1px solid var(--border);
    }
    .status-badge {
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }
    .metric-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      box-shadow: var(--shadow-sm);
    }
  `;

  return (
    <div className="portal-page">
      <style dangerouslySetInnerHTML={{ __html: cssStyle }} />

      <div className="mnt-wrapper">
        <h1 className="page-title">🔧 Infrastructure Maintenance Desk</h1>

        {/* Diagnostic Metrics */}
        <div className="metric-grid">
          {[
            { label: 'Reported Issues', value: `${tickets.filter(t => t.status === 'Reported').length} Pending`, color: '#f59e0b' },
            { label: 'Scheduled Visits', value: `${tickets.filter(t => t.status === 'Scheduled').length} Assigned`, color: 'var(--accent)' },
            { label: 'Work In Progress', value: `${tickets.filter(t => t.status === 'In Progress').length} Active`, color: '#8b5cf6' },
            { label: 'Issues Resolved', value: `${tickets.filter(t => t.status === 'Resolved').length} Succeeded`, color: 'var(--green)' }
          ].map(s => (
            <div key={s.label} className="metric-card">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid-split">
          {/* Left Block: Request Form */}
          <div className="card-box" style={{ height: 'fit-content' }}>
            <h3 className="card-title">🚨 Report Campus Fault / Issue</h3>
            
            <form onSubmit={handleReportIssue} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Issue Category *</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="Electricity">💡 Electricity (Power failure, flickering lights)</option>
                  <option value="Internet">🌐 Internet (WiFi down, slow ethernet)</option>
                  <option value="Classroom Issues">🏫 Classroom Issues (Damaged benches, faulty projector screens)</option>
                  <option value="Lab Maintenance">🧪 Lab Maintenance (Faulty sockets, gas leak, gear calibration)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Exact Campus Location *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Block C, Room 304"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Detailed Fault Description *</label>
                <textarea
                  required
                  className="form-input"
                  style={{ minHeight: 80, resize: 'vertical' }}
                  placeholder="Describe the issue (e.g. ceiling fan is making clicking sound and running slow)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', marginTop: 6 }}>
                {submitting ? 'Logging Ticket...' : '✓ Log Maintenance Request'}
              </button>
            </form>
          </div>

          {/* Right Block: Tickets Progression tracker */}
          <div className="card-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="card-title" style={{ margin: 0 }}>📋 Campus Infrastructure Tickets</h3>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="form-input"
                  style={{ fontSize: 11, padding: '4px 8px', width: 110 }}
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Internet">Internet</option>
                  <option value="Classroom Issues">Classroom</option>
                  <option value="Lab Maintenance">Lab</option>
                </select>

                <select
                  className="form-input"
                  style={{ fontSize: 11, padding: '4px 8px', width: 100 }}
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Reported">Reported</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="tbl-mnt">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Category / Location</th>
                    <th>Description</th>
                    <th>Technician</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t2)' }}>
                        No maintenance tickets logged matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map(t => {
                      let bg = 'var(--amber-light)'; let fg = '#b45309';
                      if (t.status === 'Scheduled') { bg = 'var(--accent-light)'; fg = '#1e40af'; }
                      else if (t.status === 'In Progress') { bg = '#f3e8ff'; fg = '#6b21a8'; }
                      else if (t.status === 'Resolved') { bg = '#d1fae5'; fg = '#065f46'; }

                      return (
                        <tr key={t.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{t.id}</td>
                          <td>
                            <strong style={{ display: 'block', fontSize: 13 }}>{t.category}</strong>
                            <span style={{ fontSize: 11, color: 'var(--t2)' }}>📍 {t.location}</span>
                          </td>
                          <td style={{ maxWidth: 200, fontSize: 12 }}>{t.description}</td>
                          <td style={{ fontSize: 12, fontWeight: 600 }}>{t.technician || 'Not assigned yet'}</td>
                          <td>
                            <span className="status-badge" style={{ background: bg, color: fg }}>{t.status}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
