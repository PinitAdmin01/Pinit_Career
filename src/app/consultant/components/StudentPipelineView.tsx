'use client';

import React from 'react';
import { STAGES, STAGE_LABELS, VISA_STATUS_COLOR, Session } from '../hooks/useConsultantData';

interface StudentPipelineViewProps {
  loading: boolean;
  allStudents: any[];
  pipeline: Record<string, any[]>;
  selectedStudent: Record<string, any> | null;
  setSelectedStudent: (s: Record<string, any> | null) => void;
  setSessionForm: React.Dispatch<React.SetStateAction<Session>>;
  setActiveTab: (tab: string) => void;
  updateStatus: (id: string, status: string) => Promise<void>;
  handleVerifyDocument: (itemId: string, status: 'verified' | 'rejected') => Promise<void>;
  newTask: string;
  setNewTask: (task: string) => void;
  newTaskPriority: 'high' | 'medium' | 'low';
  setNewTaskPriority: (p: 'high' | 'medium' | 'low') => void;
  newTaskDueDate: string;
  setNewTaskDueDate: (date: string) => void;
  addTask: () => Promise<void>;
  handleInitiateCareTeamReview: (studentId: string, studentName: string) => void;
  careTeamReviews: Record<string, { initiatedAt: string; status: string }>;
}

export default function StudentPipelineView({
  loading,
  allStudents,
  pipeline,
  selectedStudent,
  setSelectedStudent,
  setSessionForm,
  setActiveTab,
  updateStatus,
  handleVerifyDocument,
  newTask,
  setNewTask,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  addTask,
  handleInitiateCareTeamReview,
  careTeamReviews,
}: StudentPipelineViewProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 380px' : '1fr', gap: 16 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)' }}>Refreshing student pipeline...</div>
      ) : allStudents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 48,
            color: 'var(--t3)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
          }}
        >
          No pipeline data. Add a student or link candidates via the consultant API.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${STAGES.length}, minmax(195px, 1fr))`,
              gap: 12,
              minWidth: 1100,
            }}
          >
            {STAGES.map((stage) => {
              const students = pipeline[stage] || [];
              return (
                <div
                  key={stage}
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: '16px 12px',
                    minHeight: 500,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: 'var(--t2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {STAGE_LABELS[stage]}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        background: 'var(--bg3)',
                        padding: '2px 8px',
                        borderRadius: 10,
                        color: 'var(--t3)',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {students.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
                    {students.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedStudent(s)}
                        className="glass-card card-hover"
                        style={{
                          background: selectedStudent?.id === s.id ? 'rgba(var(--brand-rgb), 0.08)' : 'var(--bg3)',
                          border: `1px solid ${selectedStudent?.id === s.id ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 12,
                          padding: 14,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--t1)', marginBottom: 4 }}>
                          {s.displayName}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--t3)', marginBottom: 8 }}>
                          {s.targetCountry} · {s.programType}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: 9.5,
                              padding: '2px 7px',
                              borderRadius: 8,
                              background: `${VISA_STATUS_COLOR[s.visa_status || 'not_started']}15`,
                              color: VISA_STATUS_COLOR[s.visa_status || 'not_started'],
                              border: `1px solid ${VISA_STATUS_COLOR[s.visa_status || 'not_started']}30`,
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 600,
                            }}
                          >
                            Visa: {s.visa_status || 'not_started'}
                          </span>

                          <div
                            style={{ display: 'flex', gap: 6, alignItems: 'center' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              title="Schedule 1:1 Consultation Session"
                              onClick={() => {
                                setSessionForm((prev) => ({ ...prev, studentId: s.id }));
                                setActiveTab('meetings');
                              }}
                              className="btn-ghost"
                              style={{
                                padding: '2px 6px',
                                fontSize: 11,
                                borderRadius: 6,
                                background: 'rgba(255,255,255,0.03)',
                              }}
                            >
                              📅
                            </button>
                            {s.vaultItems && s.vaultItems.length > 0 && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: 'var(--green)',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                📎{s.vaultItems.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Student details panel */}
      {selectedStudent && (
        <div
          className="glass-card"
          style={{
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 22,
            height: 'fit-content',
            position: 'sticky',
            top: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}
            >
              {selectedStudent.displayName}
            </div>
            <button
              onClick={() => setSelectedStudent(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18 }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: 'var(--t2)',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 10,
              lineHeight: 1.5,
            }}
          >
            <div>
              📧 <strong style={{ color: 'var(--t1)' }}>{selectedStudent.email}</strong>
            </div>
            <div style={{ marginTop: 2 }}>
              📞 <strong style={{ color: 'var(--t1)' }}>{selectedStudent.phone || 'No phone attached'}</strong>
            </div>
          </div>

          <div
            style={{
              fontSize: 12.5,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 12px',
            }}
          >
            Target: <strong style={{ color: 'var(--accent)' }}>{selectedStudent.targetCountry}</strong> ·{' '}
            {selectedStudent.programType}
          </div>

          {/* Status transition dropdown */}
          <div>
            <label
              className="form-label"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--t3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Update Stage Status
            </label>
            <select
              className="form-input"
              style={{ width: '100%', marginTop: 6 }}
              value={selectedStudent.status}
              onChange={(e) => updateStatus(selectedStudent.id, e.target.value)}
            >
              {STAGES.map((st) => (
                <option key={st} value={st}>
                  {STAGE_LABELS[st]}
                </option>
              ))}
            </select>
          </div>

          {/* Vault Document Verification */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div
              style={{
                fontSize: 10,
                color: 'var(--t3)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: 8,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Vault Credentials Verification
            </div>
            {!selectedStudent?.vaultItems || selectedStudent.vaultItems.length === 0 ? (
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--t3)',
                  fontStyle: 'italic',
                  padding: 8,
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                No uploads inside student vault yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selectedStudent.vaultItems || []).map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--t1)' }}>
                        📄 {item.label || item.type}
                      </span>
                      <span
                        className={`badge ${
                          item.status === 'verified'
                            ? 'badge-green'
                            : item.status === 'rejected'
                            ? 'badge-coral'
                            : 'badge-amber'
                        }`}
                        style={{ fontSize: 9, padding: '2px 6px', fontFamily: 'var(--font-mono)' }}
                      >
                        {item.status || 'pending'}
                      </span>
                    </div>
                    {item.fileUrl && (
                      <div style={{ marginTop: 2 }}>
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: 11 }}
                        >
                          Review File
                        </a>
                      </div>
                    )}
                    {item.status !== 'verified' && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <button
                          onClick={() => handleVerifyDocument(item.id, 'verified')}
                          className="btn-primary btn-sm"
                          style={{ padding: '4px 10px', fontSize: 10.5, flex: 1, justifyContent: 'center' }}
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(item.id, 'rejected')}
                          className="btn-ghost btn-sm"
                          style={{
                            padding: '4px 10px',
                            fontSize: 10.5,
                            color: 'var(--coral)',
                            border: '1px solid rgba(var(--danger-rgb), 0.2)',
                            flex: 1,
                            justifyContent: 'center',
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Tasks checklist */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div
              style={{
                fontSize: 10,
                color: 'var(--t3)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: 8,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Action Tasks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Assign new task..."
                className="form-input"
                style={{ fontSize: 11, padding: '6px 10px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="form-input"
                  style={{ fontSize: 10.5, padding: '4px 8px', flex: 1 }}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 10.5, padding: '4px 8px', flex: 1 }}
                />
                <button
                  onClick={addTask}
                  className="btn-primary"
                  style={{ padding: '4px 12px', fontSize: 11 }}
                >
                  Add
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
              {(selectedStudent.tasks || []).map((t: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg3)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 11,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{t.title}</span>
                  <span
                    className={`badge ${
                      t.priority === 'high'
                        ? 'badge-coral'
                        : t.priority === 'medium'
                        ? 'badge-amber'
                        : 'badge-blue'
                    }`}
                    style={{ fontSize: 9 }}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* At-Risk Care Team Action */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <button
              onClick={() => handleInitiateCareTeamReview(selectedStudent.id, selectedStudent.displayName)}
              className="btn-ghost btn-sm"
              style={{
                width: '100%',
                justifyContent: 'center',
                color: 'var(--coral)',
                border: '1px solid rgba(var(--danger-rgb), 0.3)',
                background: 'rgba(var(--danger-rgb), 0.05)',
              }}
            >
              🚨 {careTeamReviews[selectedStudent.id] ? 'Care Team Assigned' : 'Assign Care Team Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
