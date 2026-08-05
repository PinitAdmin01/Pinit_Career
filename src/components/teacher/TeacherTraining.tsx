'use client';

import { useState } from 'react';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'locked' | 'available' | 'completed';
}

const MODULES_INIT: TrainingModule[] = [
  { id: 'mod-proctor', title: 'Exam Integrity & Proctoring Systems', category: 'Proctoring', description: 'Master student focus indexes, proctoring alert parameters, and identifying suspicious browser tab switching behaviors.', duration: '15 mins', difficulty: 'Beginner', status: 'available' },
  { id: 'mod-grading', title: 'Standardized Scoring & AI Calibration', category: 'Grading', description: 'Calibrate manual grading criteria against the SDE ATS scoring engine parameters and institutional guidelines.', duration: '20 mins', difficulty: 'Intermediate', status: 'available' },
  { id: 'mod-socratic', title: 'Socratic Dialogue & Active Learning', category: 'Pedagogy', description: 'Learn to design coding questions that stimulate Socratic problem solving rather than simple rote memorization.', duration: '25 mins', difficulty: 'Advanced', status: 'available' }
];

export default function TeacherTraining({ teacher }: { teacher: any }) {
  const [modules, setModules] = useState<TrainingModule[]>(MODULES_INIT);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  
  // Simulator state
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  // Dynamic simulation challenge scenarios
  const SIMULATION_SCENARIOS = [
    {
      question: 'A student triggers a "Tab Switch Count: 5" alert during a dynamic FizzBuzz assessment. What is the correct standard response?',
      options: [
        { text: 'A) Disregard the warning as a browser latency error.', score: 0 },
        { text: 'B) Flag the account for suspicious activity, document it in the fraud control board, and warn the candidate.', score: 100 },
        { text: 'C) Suspend the student immediately without verification.', score: 40 }
      ]
    },
    {
      question: 'You are grading an essay-based systems design exam. How do you calibrate SDE ATS scores with manual scores?',
      options: [
        { text: 'A) Ensure the grading rubric targets both syntax correctness and STAR structural layout.', score: 100 },
        { text: 'B) Increase manual scores to artificially inflate overall SDE readiness percentages.', score: 10 },
        { text: 'C) Override the ATS metrics directly without writing audit reasons.', score: 0 }
      ]
    }
  ];

  const startModule = (mod: TrainingModule) => {
    setSelectedModule(mod);
    setSimulationActive(true);
    setCurrentStep(0);
    setScore(0);
  };

  const handleOptionSelect = async (optScore: number) => {
    const nextScore = score + optScore;
    setScore(nextScore);

    if (currentStep + 1 < SIMULATION_SCENARIOS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed simulation
      setSimulationActive(false);
      const finalPercentage = Math.round(nextScore / SIMULATION_SCENARIOS.length);

      try {
        await api.post('/api/teacher/training/submit', {
          teacherId: teacher.id || 'teacher-default',
          moduleId: selectedModule?.id,
          score: finalPercentage
        });

        setModules(prev =>
          prev.map(m => (m.id === selectedModule?.id ? { ...m, status: 'completed' } : m))
        );

        toast.success(
          'Training Completed',
          `Completed training successfully with an average alignment score of ${finalPercentage}%!`
        );
      } catch (err) {
        toast.error('Failed to submit training data');
      }
      setSelectedModule(null);
    }
  };

  return (
    <div style={{ padding: '24px', background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)' }} className="animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
          🎓 Teacher Professional Training Center
        </h2>
        <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
          Calibrate proctoring standards, learn grading guidelines, and earn credential badges.
        </p>
      </div>

      {simulationActive && selectedModule ? (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }} className="animate-fade-in">
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
            Interactive Simulator Mode: {selectedModule.title}
          </span>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginTop: 8, marginBottom: 14 }}>
            Scenario {currentStep + 1} of {SIMULATION_SCENARIOS.length}:
          </h3>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 16 }}>
            {SIMULATION_SCENARIOS[currentStep].question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SIMULATION_SCENARIOS[currentStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt.score)}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  background: 'var(--bg2)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--t1)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {modules.map(mod => (
            <div
              key={mod.id}
              style={{
                background: 'var(--bg3)',
                border: '1.5px solid var(--border)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(99, 102, 241, 0.08)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontFamily: 'var(--font-mono)' }}>
                    {mod.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{mod.duration}</span>
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px' }}>{mod.title}</h4>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0, lineHeight: 1.5 }}>{mod.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 10.5, color: mod.status === 'completed' ? 'var(--green)' : 'var(--t2)', fontWeight: 800 }}>
                  {mod.status === 'completed' ? '🟢 COMPLETED' : `Difficulty: ${mod.difficulty}`}
                </span>
                <button
                  onClick={() => startModule(mod)}
                  className="btn-primary"
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  {mod.status === 'completed' ? 'Retake Mode' : 'Start Lesson ➔'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
