'use client';

import React, { useState, useEffect } from 'react';
import { teacherStudentService, StudentInstitutionalProfile } from '@/lib/services/teacherStudentService';

export default function TeacherStudentDetailsTab({ initialSearch = '' }: { initialSearch?: string } = {}) {
  const [students, setStudents] = useState<StudentInstitutionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);
  const [selectedStudent, setSelectedStudent] = useState<StudentInstitutionalProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<StudentInstitutionalProfile>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    const data = await teacherStudentService.getStudents();
    setStudents(data);
    setLoading(false);
  }

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.studentName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.collegeName.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || s.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function openProfile(student: StudentInstitutionalProfile) {
    setSelectedStudent(student);
    setEditForm({ ...student });
    setIsEditing(false);
  }

  function startEditing(student: StudentInstitutionalProfile) {
    setSelectedStudent(student);
    setEditForm({ ...student });
    setIsEditing(true);
  }

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudent || !editForm.studentId) return;

    setSaving(true);
    try {
      const updated = await teacherStudentService.saveStudentDetails({
        ...selectedStudent,
        ...editForm,
        studentName: editForm.studentName || selectedStudent.studentName,
        collegeName: editForm.collegeName || selectedStudent.collegeName,
        university: editForm.university || selectedStudent.university,
        rollNumber: editForm.rollNumber || selectedStudent.rollNumber,
        department: editForm.department || selectedStudent.department,
        batch: editForm.batch || selectedStudent.batch,
        semester: Number(editForm.semester) || selectedStudent.semester,
        gpa: Number(editForm.gpa) || selectedStudent.gpa,
        phone: editForm.phone || selectedStudent.phone,
        guardianPhone: editForm.guardianPhone || selectedStudent.guardianPhone,
        verificationStatus: (editForm.verificationStatus as any) || selectedStudent.verificationStatus,
        notes: editForm.notes || selectedStudent.notes,
        verifiedBy: 'Dr. Kashyap (Faculty Lead)'
      } as StudentInstitutionalProfile);

      setStudents(prev => prev.map(s => (s.studentId === updated.studentId ? updated : s)));
      setSelectedStudent(updated);
      setIsEditing(false);
      setFeedback(`✅ Updated institutional profile & college details for ${updated.studentName} successfully.`);
      setTimeout(() => setFeedback(null), 4500);
    } catch {
      setFeedback('❌ Failed to save student institutional details.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
            🎓 Student Profiles & College Records Directory
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--t3)', fontSize: 14.5 }}>
            Faculty records portal: lookup student profiles, verify college affiliation, edit roll numbers, GPA, semester progression, and add advisory notes.
          </p>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '12px 18px',
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

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search by student name, roll number, college, department or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 280,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card, #fff)',
            color: 'var(--t1)',
            fontSize: 14,
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: 'All Students' },
            { id: 'verified', label: '✓ Verified' },
            { id: 'pending', label: '⏳ Pending Review' },
            { id: 'flagged', label: '⚠️ Flagged' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: statusFilter === f.id ? '#2563eb' : 'var(--card, #fff)',
                color: statusFilter === f.id ? '#fff' : 'var(--t2)',
                fontSize: 13,
                fontWeight: statusFilter === f.id ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div style={{ background: 'var(--card, #fff)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Student Name & Email</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>College / University</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Roll Number</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Department & Batch</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>GPA</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  Loading student institutional records...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--t3)' }}>
                  No students matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.studentId} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 650, color: 'var(--t1)', fontSize: 14 }}>{student.studentName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{student.email}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13.5, color: 'var(--t1)', fontWeight: 500 }}>{student.collegeName}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{student.university}</div>
                  </td>

                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                    {student.rollNumber || 'Not Assigned'}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, color: 'var(--t1)' }}>{student.department}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Batch {student.batch} • Sem {student.semester}</div>
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 800, color: student.gpa >= 8.5 ? '#10b981' : '#f59e0b' }}>
                    {student.gpa.toFixed(2)}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: student.verificationStatus === 'verified' ? '#dcfce7' : student.verificationStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: student.verificationStatus === 'verified' ? '#15803d' : student.verificationStatus === 'pending' ? '#92400e' : '#b91c1c'
                    }}>
                      ● {student.verificationStatus}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => openProfile(student)}
                        style={{
                          padding: '5px 12px',
                          background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--t1)'
                        }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => startEditing(student)}
                        style={{
                          padding: '5px 12px',
                          background: '#2563eb',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: '#fff'
                        }}
                      >
                        ✏️ Edit Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Profile Drawer / Editor Modal */}
      {selectedStudent && (
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
            maxWidth: 640,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--t1)' }}>
                  {isEditing ? `✏️ Edit Student Details: ${selectedStudent.studentName}` : `👤 Student Dossier: ${selectedStudent.studentName}`}
                </h3>
                <span style={{ fontSize: 12.5, color: 'var(--t3)' }}>
                  ID: {selectedStudent.studentId} • {selectedStudent.email}
                </span>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--t3)' }}
              >
                ✕
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveDetails} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.studentName || ''}
                      onChange={e => setEditForm({ ...editForm, studentName: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Roll Number / Register Number
                    </label>
                    <input
                      type="text"
                      value={editForm.rollNumber || ''}
                      onChange={e => setEditForm({ ...editForm, rollNumber: e.target.value })}
                      placeholder="e.g. 21CS042"
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      College / Institution Name
                    </label>
                    <input
                      type="text"
                      value={editForm.collegeName || ''}
                      onChange={e => setEditForm({ ...editForm, collegeName: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Affiliated University
                    </label>
                    <input
                      type="text"
                      value={editForm.university || ''}
                      onChange={e => setEditForm({ ...editForm, university: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Department
                    </label>
                    <input
                      type="text"
                      value={editForm.department || ''}
                      onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Semester
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.semester || 1}
                      onChange={e => setEditForm({ ...editForm, semester: Number(e.target.value) })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={editForm.gpa || 8.0}
                      onChange={e => setEditForm({ ...editForm, gpa: Number(e.target.value) })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Student Contact Phone
                    </label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                      Guardian Phone
                    </label>
                    <input
                      type="text"
                      value={editForm.guardianPhone || ''}
                      onChange={e => setEditForm({ ...editForm, guardianPhone: e.target.value })}
                      placeholder="+91 98765 43211"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                    Verification Status
                  </label>
                  <select
                    value={editForm.verificationStatus || 'verified'}
                    onChange={e => setEditForm({ ...editForm, verificationStatus: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
                  >
                    <option value="verified">Verified Official Student</option>
                    <option value="pending">Pending Document Verification</option>
                    <option value="flagged">Flagged / Under Disciplinary Review</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                    Faculty Mentorship & Advisory Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.notes || ''}
                    onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Enter academic remarks, recommendation notes, or capstone status..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--t2)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ padding: '8px 22px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}
                  >
                    {saving ? 'Saving...' : '💾 Save Student Details'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, background: 'var(--bg3)', padding: 18, borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>College Name</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{selectedStudent.collegeName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Affiliated University</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{selectedStudent.university}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Roll Number</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>{selectedStudent.rollNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Department & Batch</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>{selectedStudent.department} ({selectedStudent.batch})</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Current Semester</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Semester {selectedStudent.semester}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>CGPA</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>{selectedStudent.gpa.toFixed(2)}</div>
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 4 }}>Faculty Advisory Notes:</div>
                  <div style={{ fontSize: 13.5, color: 'var(--t1)', fontStyle: 'italic' }}>
                    &ldquo;{selectedStudent.notes || 'No faculty advisory notes on file.'}&rdquo;
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>
                    Verified by: {selectedStudent.verifiedBy || 'Dr. Kashyap'} • Last updated: {new Date(selectedStudent.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '8px 18px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                  >
                    ✏️ Edit Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
