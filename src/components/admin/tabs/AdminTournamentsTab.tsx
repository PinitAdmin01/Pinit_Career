'use client';

import React, { useState, useEffect } from 'react';
import { adminEconomyService, TournamentRecord } from '@/lib/services/adminEconomyService';

export default function AdminTournamentsTab() {
  const [tournaments, setTournaments] = useState<TournamentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newTourn, setNewTourn] = useState({
    title: '',
    domain: 'Tech',
    entryFeePins: 25,
    prizePoolPins: 1500,
    durationMinutes: 120,
    maxParticipants: 150,
    rules: 'Fastest clean code solution with zero memory leaks and sub-100ms algorithmic latency.'
  });

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    setLoading(true);
    const data = await adminEconomyService.getTournaments();
    setTournaments(data);
    setLoading(false);
  }

  const filteredTournaments = tournaments.filter(t => filter === 'all' || t.status === filter);

  async function handleStartTournament(id: string, title: string) {
    try {
      const updated = await adminEconomyService.startTournament(id);
      setTournaments(prev => prev.map(t => (t.id === id ? updated : t)));
      setFeedback(`🚀 Tournament "${title}" is now LIVE! Arena lobby opened for students.`);
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback('❌ Failed to start tournament.');
    }
  }

  async function handleEndTournament(id: string, title: string) {
    try {
      const updated = await adminEconomyService.endTournament(id);
      setTournaments(prev => prev.map(t => (t.id === id ? updated : t)));
      setFeedback(`🏁 Tournament "${title}" concluded. Prize pool dispatched.`);
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback('❌ Failed to end tournament.');
    }
  }

  async function handleCreateTournament(e: React.FormEvent) {
    e.preventDefault();
    if (!newTourn.title) return;
    try {
      const created = await adminEconomyService.createTournament(newTourn);
      setTournaments(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewTourn({
        title: '',
        domain: 'Tech',
        entryFeePins: 25,
        prizePoolPins: 1500,
        durationMinutes: 120,
        maxParticipants: 150,
        rules: 'Fastest clean code solution with zero memory leaks and sub-100ms algorithmic latency.'
      });
      setFeedback(`🎉 New tournament "${created.title}" scheduled successfully.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('❌ Failed to schedule tournament.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
            ⚔️ Coding Arenas & Tournament Command Center
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--t3)', fontSize: 14.5 }}>
            Create, start, monitor, and conclude speed duels, hackathons, and ranked league competitions with automated prize distribution.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          + Schedule New Tournament
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          color: '#10b981',
          fontWeight: 650,
          fontSize: 14
        }}>
          {feedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { id: 'all', label: 'All Competitions' },
          { id: 'live', label: '🔴 Live Now' },
          { id: 'upcoming', label: '⏳ Upcoming' },
          { id: 'completed', label: '✓ Completed' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as any)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: filter === item.id ? 'var(--accent, #2563eb)' : 'var(--card, #fff)',
              color: filter === item.id ? '#fff' : 'var(--t2)',
              fontSize: 13,
              fontWeight: filter === item.id ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tournament Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', gridColumn: '1 / -1' }}>
            Loading tournaments catalog...
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', gridColumn: '1 / -1', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
            No tournaments found for this filter. Click "+ Schedule New Tournament" to launch one!
          </div>
        ) : (
          filteredTournaments.map(tourn => (
            <div
              key={tourn.id}
              style={{
                borderRadius: 14,
                border: tourn.status === 'live' ? '2px solid #ef4444' : '1px solid var(--border)',
                background: 'var(--card, #fff)',
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: tourn.status === 'live' ? '0 10px 25px -5px rgba(239,68,68,0.2)' : '0 4px 12px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: tourn.status === 'live' ? '#dc2626' : tourn.status === 'upcoming' ? '#2563eb' : '#64748b',
                    color: '#fff',
                    animation: tourn.status === 'live' ? 'pulse 2s infinite' : 'none'
                  }}>
                    {tourn.status === 'live' ? '● LIVE NOW' : tourn.status}
                  </span>

                  <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                    {tourn.domain}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: 'var(--t1)' }}>
                  {tourn.title}
                </h3>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
                  {tourn.rules}
                </p>

                {/* Key Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Prize Pool</div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#f59e0b' }}>🪙 {tourn.prizePoolPins}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Entry Fee</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>{tourn.entryFeePins > 0 ? `${tourn.entryFeePins} Pins` : 'Free'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Participants</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>{tourn.participantsCount} / {tourn.maxParticipants}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                {tourn.status === 'upcoming' && (
                  <button
                    onClick={() => handleStartTournament(tourn.id, tourn.title)}
                    style={{
                      flex: 1,
                      padding: '9px 14px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 750,
                      fontSize: 13,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
                    }}
                  >
                    ⚡ Start Tournament Now
                  </button>
                )}

                {tourn.status === 'live' && (
                  <button
                    onClick={() => handleEndTournament(tourn.id, tourn.title)}
                    style={{
                      flex: 1,
                      padding: '9px 14px',
                      background: 'var(--card)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    🏁 Conclude & Award Prizes
                  </button>
                )}

                {tourn.status === 'completed' && (
                  <button
                    disabled
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'var(--bg3)',
                      color: 'var(--t3)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'default'
                    }}
                  >
                    ✓ Event Finished
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Tournament Modal */}
      {showCreateModal && (
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
              ⚔️ Schedule Campus Tournament
            </h3>

            <form onSubmit={handleCreateTournament} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>
                  Tournament Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winter Code Sprint: Distributed Consensus"
                  value={newTourn.title}
                  onChange={e => setNewTourn({ ...newTourn, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Domain / Track</label>
                  <select
                    value={newTourn.domain}
                    onChange={e => setNewTourn({ ...newTourn, domain: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  >
                    <option value="Tech">Tech / Algorithmic</option>
                    <option value="Full-Stack">Full-Stack Web</option>
                    <option value="AI & Data">AI & Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Commerce & Finance">Commerce & Finance</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newTourn.durationMinutes}
                    onChange={e => setNewTourn({ ...newTourn, durationMinutes: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Entry Fee (Pins)</label>
                  <input
                    type="number"
                    value={newTourn.entryFeePins}
                    onChange={e => setNewTourn({ ...newTourn, entryFeePins: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Prize Pool (Pins)</label>
                  <input
                    type="number"
                    value={newTourn.prizePoolPins}
                    onChange={e => setNewTourn({ ...newTourn, prizePoolPins: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Rules & Assessment Focus</label>
                <textarea
                  rows={3}
                  value={newTourn.rules}
                  onChange={e => setNewTourn({ ...newTourn, rules: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--t2)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
