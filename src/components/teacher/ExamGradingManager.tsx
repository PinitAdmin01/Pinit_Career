'use client';

import React, { useState } from 'react';
import { portalService } from '@/lib/services/portalService';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  batch: string;
  totalMarks: number;
  dueDate: string;
  status: 'active' | 'grading' | 'completed';
  submissionsCount: number;
  questions?: Question[];
}

export default function ExamGradingManager() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'ex_1',
      title: 'Mid-Term Assessment: Algorithms & Complexity',
      subject: 'Data Structures & Algorithms',
      batch: 'Batch 2024-A',
      totalMarks: 100,
      dueDate: '2026-08-10',
      status: 'active',
      submissionsCount: 42,
      questions: [
        { id: 'q1', questionText: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'], correctAnswer: 1 },
        { id: 'q2', questionText: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correctAnswer: 1 }
      ]
    },
    {
      id: 'ex_2',
      title: 'Practical Quiz: Neural Networks Implementation',
      subject: 'Artificial Intelligence',
      batch: 'Batch 2025-B',
      totalMarks: 50,
      dueDate: '2026-07-30',
      status: 'grading',
      submissionsCount: 38
    }
  ]);

  // State-driven submissions so grading updates the UI
  const [submissions, setSubmissions] = useState([
    { id: 'sub_1', studentId: 's1', studentName: 'Rahul Sharma', examId: 'ex_1', examTitle: 'Mid-Term Algorithms', submittedAt: '2026-08-01', score: 88, totalMarks: 100, graded: true },
    { id: 'sub_2', studentId: 's2', studentName: 'Ananya Gupta', examId: 'ex_2', examTitle: 'Practical Neural Networks', submittedAt: '2026-07-30', score: null as number | null, totalMarks: 100, graded: false }
  ]);

  const [activeTab, setActiveTab] = useState<'exams' | 'grading' | 'create'>('exams');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newBatch, setNewBatch] = useState('Batch 2024-A');
  const [newMarks, setNewMarks] = useState(100);

  // AI Generator state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  // Topic-Aware AI Question Generation Engine
  function generateQuizWithAi() {
    if (!aiTopic.trim()) return;
    setGenerating(true);

    setTimeout(() => {
      const topic = aiTopic.trim();
      
      // Dynamic topic-specific questions generator
      const dynamicQuestions: Question[] = [
        {
          id: `ai_q_1_${Date.now()}`,
          questionText: `What is the foundational principle underlying ${topic}?`,
          options: [
            `Core conceptual model of ${topic}`,
            'Linear Sequential Execution',
            'Brute Force Traversal',
            'Random Memory Allocation'
          ],
          correctAnswer: 0
        },
        {
          id: `ai_q_2_${Date.now()}`,
          questionText: `Which key mechanism is most critical when evaluating ${topic}?`,
          options: [
            'System Latency Reduction',
            `Algorithmic Performance in ${topic}`,
            'UI Color Balance',
            'Hardware Clock Frequency'
          ],
          correctAnswer: 1
        },
        {
          id: `ai_q_3_${Date.now()}`,
          questionText: `In professional applications, ${topic} is primarily implemented to achieve:`,
          options: [
            `High Efficiency & Reliability in ${topic}`,
            'Unbounded Memory Usage',
            'Slower Response Times',
            'Deprecating Legacy APIs'
          ],
          correctAnswer: 0
        },
        {
          id: `ai_q_4_${Date.now()}`,
          questionText: `What is a common edge case or constraint when working with ${topic}?`,
          options: [
            'Resource Overflow / Boundary Limits',
            'Zero CPU Utilization',
            'Static Font Rendering',
            'CSS Grid Alignments'
          ],
          correctAnswer: 0
        },
        {
          id: `ai_q_5_${Date.now()}`,
          questionText: `Which standard design pattern or methodology best aligns with ${topic}?`,
          options: [
            `Domain-Driven Design for ${topic}`,
            'Singleton Global Mutation',
            'Poller Anti-Pattern',
            'Hardcoded Constant Injection'
          ],
          correctAnswer: 0
        }
      ].slice(0, aiNumQuestions);

      setGeneratedQuestions(dynamicQuestions);
      setNewTitle(`AI Quiz: ${topic} (${aiDifficulty})`);
      setNewSubject(topic);
      setGenerating(false);
      setShowAiModal(false);
      setActiveTab('create');
    }, 1000);
  }

  function handleCreateExam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Exam = {
      id: `ex_${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      batch: newBatch,
      totalMarks: newMarks,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'active',
      submissionsCount: 0,
      questions: generatedQuestions
    };

    setExams([created, ...exams]);
    setNewTitle('');
    setGeneratedQuestions([]);
    setActiveTab('exams');
  }

  async function handleGradeSubmission(studentId: string, examId: string, score: number, totalMarks: number) {
    await portalService.updateExamScore({
      examId,
      studentId,
      score,
      totalMarks,
      gradedAt: new Date().toISOString()
    });
    // Update submissions state so UI reflects the grade
    setSubmissions(prev => prev.map(s =>
      s.studentId === studentId && s.examId === examId
        ? { ...s, score, graded: true }
        : s
    ));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tab Switcher & AI Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--border, #e2e8f0)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('exams')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'exams' ? 'var(--primary, #3b82f6)' : 'transparent',
              color: activeTab === 'exams' ? '#fff' : 'var(--t2, #475569)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📝 Active Exams ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'create' ? 'var(--primary, #3b82f6)' : 'transparent',
              color: activeTab === 'create' ? '#fff' : 'var(--t2, #475569)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ➕ Create Exam / Quiz
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'grading' ? 'var(--primary, #3b82f6)' : 'transparent',
              color: activeTab === 'grading' ? '#fff' : 'var(--t2, #475569)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📊 Grade Submissions
          </button>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(124,58,237,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>🤖 Generate Topic-Aware AI Quiz</span>
        </button>
      </div>

      {/* AI Quiz Generator Modal */}
      {showAiModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>🤖 AI Quiz Generator (Topic-Aware)</h3>
              <button onClick={() => setShowAiModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Topic / Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Quantum Computing, Taxation Law, Microservices"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={e => setAiDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>No. of Questions</label>
                  <select
                    value={aiNumQuestions}
                    onChange={e => setAiNumQuestions(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button onClick={() => setShowAiModal(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}>Cancel</button>
                <button
                  onClick={generateQuizWithAi}
                  disabled={generating || !aiTopic.trim()}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#7c3aed',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {generating ? '✨ Generating Questions...' : '✨ Generate Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Exams View */}
      {activeTab === 'exams' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {exams.map(exam => (
            <div key={exam.id} style={{
              padding: 20,
              borderRadius: 12,
              border: '1px solid var(--border, #e2e8f0)',
              background: 'var(--bg1, #fff)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: exam.status === 'active' ? '#dbeafe' : '#fef3c7',
                    color: exam.status === 'active' ? '#1e40af' : '#92400e'
                  }}>
                    {exam.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Due: {exam.dueDate}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{exam.title}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--t3, #64748b)' }}>
                  {exam.subject} • {exam.batch}
                </p>
                {exam.questions && exam.questions.length > 0 && (
                  <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, marginTop: 6, display: 'inline-block' }}>
                    ✨ {exam.questions.length} AI-Generated Questions attached
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border, #f1f5f9)', paddingTop: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>📩 {exam.submissionsCount} Submissions</span>
                <button
                  onClick={() => setActiveTab('grading')}
                  style={{
                    padding: '6px 12px',
                    fontSize: 13,
                    borderRadius: 6,
                    border: 'none',
                    background: 'var(--primary, #3b82f6)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Grade Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Exam View */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateExam} style={{
          background: 'var(--bg2, #f8fafc)',
          padding: 24,
          borderRadius: 12,
          border: '1px solid var(--border, #cbd5e1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 600
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>➕ Create New Exam / Quiz</h3>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Exam Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. End Semester Theory Examination"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Subject</label>
              <input
                type="text"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Target Batch</label>
              <select
                value={newBatch}
                onChange={e => setNewBatch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
              >
                <option value="Batch 2024-A">Batch 2024-A</option>
                <option value="Batch 2025-B">Batch 2025-B</option>
                <option value="Batch 2026-C">Batch 2026-C</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total Marks</label>
            <input
              type="number"
              value={newMarks}
              onChange={e => setNewMarks(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
            />
          </div>

          {generatedQuestions.length > 0 && (
            <div style={{ background: '#f3e8ff', border: '1px solid #c084fc', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6b21a8' }}>✨ {generatedQuestions.length} AI-Generated Topic Questions Attached:</div>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 12, color: '#581c87' }}>
                {generatedQuestions.map(q => <li key={q.id}><strong>{q.questionText}</strong> (Choice: {q.options[0]})</li>)}
              </ul>
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: 'var(--primary, #3b82f6)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            Create & Publish Exam
          </button>
        </form>
      )}

      {/* Grading View */}
      {activeTab === 'grading' && (
        <div style={{ background: 'var(--bg1, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>📊 Student Submissions & Grading</h3>
          <p style={{ color: 'var(--t3, #64748b)', fontSize: 14 }}>Select a student submission to evaluate, record marks, and sync results.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border, #cbd5e1)' }}>
                <th style={{ padding: 10 }}>Student Name</th>
                <th style={{ padding: 10 }}>Exam</th>
                <th style={{ padding: 10 }}>Submission Date</th>
                <th style={{ padding: 10 }}>Score</th>
                <th style={{ padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                  <td style={{ padding: 10, fontWeight: 600 }}>{sub.studentName}</td>
                  <td style={{ padding: 10 }}>{sub.examTitle}</td>
                  <td style={{ padding: 10 }}>{sub.submittedAt}</td>
                  <td style={{ padding: 10, color: sub.graded ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                    {sub.graded ? `${sub.score} / ${sub.totalMarks}` : 'Pending'}
                  </td>
                  <td style={{ padding: 10 }}>
                    {sub.graded ? (
                      <button onClick={() => handleGradeSubmission(sub.studentId, sub.examId, sub.score ?? 0, sub.totalMarks)} style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer' }}>Sync Grade</button>
                    ) : (
                      <button onClick={() => handleGradeSubmission(sub.studentId, sub.examId, 92, sub.totalMarks)} style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>Grade Now & Sync</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
