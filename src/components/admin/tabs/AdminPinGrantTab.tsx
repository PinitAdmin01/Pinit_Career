'use client';

import React, { useState, useEffect } from 'react';
import { adminEconomyService, PinGrantRecord } from '@/lib/services/adminEconomyService';
import { portalService, EnrolledStudent } from '@/lib/services/portalService';

export default function AdminPinGrantTab() {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [history, setHistory] = useState<PinGrantRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [pinAmount, setPinAmount] = useState<number>(100);
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<'Merit' | 'Hackathon' | 'Ambassador' | 'Administrative' | 'Contest'>('Merit');
  const [isGranting, setIsGranting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [enrolled, grants] = await Promise.all([
      portalService.getEnrolledStudents().catch(() => []),
      adminEconomyService.getPinGrantsHistory().catch(() => [])
    ]);

    setStudents(enrolled);
    setHistory(grants);
    if (enrolled.length > 0 && !selectedStudentId) {
      setSelectedStudentId(enrolled[0].id);
    }
    setLoading(false);
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  async function handleGrantPins(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudentId || pinAmount <= 0) return;

    const student = selectedStudent || {
      id: selectedStudentId,
      name: 'Student ' + selectedStudentId,
      email: `${selectedStudentId}@student.pinit.edu`
    };

    setIsGranting(true);
    try {
      const grant = await adminEconomyService.grantPinsToUser({
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        amount: pinAmount,
        reason: reason || 'Merit Recognition Grant',
        category,
        grantedBy: 'Campus Administrator'
      });

      setHistory(prev => [grant, ...prev]);
      setFeedback(`🎉 Successfully granted ${pinAmount} Pins to ${student.name} (${student.email})! Balance credited.`);
      setReason('');
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback('❌ Failed to complete pin grant.');
    } finally {
      setIsGranting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
          🎁 Direct Pin Grants & Student Rewards Ledger
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--t3)', fontSize: 14.5 }}>
          Authorize direct institutional Pin endowments for hackathon achievements, academic honors, ambassadorship, or financial assistance.
        </p>
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

      {/* Grant Action Form Card */}
      <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
          ⚡ Issue New Pin Endowment
        </h3>

        <form onSubmit={handleGrantPins} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Student Selector */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>
              Select Student Recipient
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by student name, roll no, or email..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 260,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t1)',
                  fontSize: 14
                }}
              />

              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                style={{
                  flex: 2,
                  minWidth: 280,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t1)',
                  fontSize: 14
                }}
              >
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo || s.id}) • {s.department} • {s.email}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="usr_demo_student_01">Alex Chen • alex.chen@student.pinit.edu</option>
                    <option value="usr_demo_student_02">Rohan Sharma • rohan.sharma@campus.pinit.edu</option>
                    <option value="usr_demo_student_03">Aanya Verma • aanya.verma@tech.pinit.edu</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Amount Pills & Custom Input */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>
              Grant Amount (Pins)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {[50, 100, 250, 500, 1000].map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setPinAmount(amt)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: pinAmount === amt ? '2px solid #2563eb' : '1px solid var(--border)',
                    background: pinAmount === amt ? 'rgba(37,99,235,0.1)' : 'var(--bg3)',
                    color: pinAmount === amt ? '#2563eb' : 'var(--t1)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  +{amt} Pins
                </button>
              ))}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--t3)' }}>Custom:</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={pinAmount}
                  onChange={e => setPinAmount(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: 90,
                    padding: '7px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontWeight: 700,
                    background: 'var(--bg3)',
                    color: 'var(--t1)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category & Reason */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>
                Grant Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              >
                <option value="Merit">🏅 Academic Merit & Excellence</option>
                <option value="Hackathon">⚔️ Hackathon & Duel Championship</option>
                <option value="Ambassador">🤝 Campus Ambassador Grant</option>
                <option value="Contest">🏆 Coding Arena Tournament Prize</option>
                <option value="Administrative">🏛️ Administrative / Relief Grant</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>
                Reason & Official Citation
              </label>
              <input
                type="text"
                placeholder="e.g. 1st Place Winner in Winter National Hackathon"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGranting}
            style={{
              alignSelf: 'flex-start',
              padding: '11px 24px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 14.5,
              cursor: isGranting ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              marginTop: 4
            }}
          >
            {isGranting ? 'Authorizing Endowment...' : `🎁 Authorize & Grant ${pinAmount} Pins`}
          </button>
        </form>
      </div>

      {/* Grant Ledger Audit Table */}
      <div style={{ background: 'var(--card, #fff)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--t1)' }}>
            📜 Institutional Pin Grants History Ledger
          </h3>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>
            {history.length} Total Grants Recorded
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Recipient Student</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Amount</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Category</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Reason / Citation</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Authorized By</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Timestamp</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  No historical grants recorded yet.
                </td>
              </tr>
            ) : (
              history.map(g => (
                <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 650, color: 'var(--t1)', fontSize: 13.5 }}>{g.studentName}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{g.studentEmail}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 800, color: '#10b981', fontSize: 14 }}>
                      +{g.amount} Pins
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 650,
                      background: 'rgba(59,130,246,0.1)',
                      color: '#2563eb'
                    }}>
                      {g.category}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t1)' }}>
                    {g.reason}
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--t2)' }}>
                    {g.grantedBy}
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--t3)', fontFamily: 'monospace' }}>
                    {new Date(g.grantedAt).toLocaleString()}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                      ● {g.status}
                    </span>
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
