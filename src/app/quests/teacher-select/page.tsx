'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';

interface Teacher {
  id: string;
  name: string;
  role: string;
  desc: string;
  avatar: string; // emoji or design representation
  color: string;
  accent: string;
  focus: string;
}

const TEACHERS: Teacher[] = [
  {
    id: 'kashyap',
    name: 'Kashyap Sir',
    role: 'Staff Systems Architect',
    desc: 'Deeply technical, calm, and structured. Focuses on system scalability, clean coding standards, and dynamic dispatch mechanics.',
    avatar: '👨‍💼',
    color: 'rgba(59, 130, 246, 0.1)',
    accent: 'var(--accent)',
    focus: 'Scale & Object-Oriented Principles'
  },
  {
    id: 'karthic',
    name: 'Karthic Sir "Nega"',
    role: 'Algorithmic Lead Tutor',
    desc: 'Hyper-energetic and highly visual. Loves drawing memory blocks, step-by-step pointers, and breaking down loop loops on virtual whiteboards.',
    avatar: '👨‍🏫',
    color: 'rgba(245, 158, 11, 0.1)',
    accent: 'var(--amber)',
    focus: 'Algorithms & Core Loop Efficiency'
  },
  {
    id: 'maya',
    name: 'Ms. Maya',
    role: 'Principal Security Auditor',
    desc: 'Strict, audit-focused, and extremely precise. Focuses on AWS cloud design patterns, security rules, and performance checking.',
    avatar: '👩‍💼',
    color: 'rgba(239, 68, 68, 0.1)',
    accent: 'var(--coral)',
    focus: 'Cloud Patterns & Security Standards'
  },
  {
    id: 'divya',
    name: 'Ms. Divya',
    role: 'Lead UX Engineer',
    desc: 'Empathetic, clear, and product-oriented. Focuses on frontend component hierarchies, state management, and design system grids.',
    avatar: '👩‍🎨',
    color: 'rgba(16, 185, 129, 0.1)',
    accent: 'var(--green)',
    focus: 'State Management & Design Systems'
  }
];

export default function TeacherSelectPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--t1)' }}>Loading Mentor Selection...</div>}>
      <TeacherSelectPageContent />
    </Suspense>
  );
}

function TeacherSelectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get('questId') || '';

  const { onboardingAnswers, setOnboarding } = useCareerOS();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Guard: redirect back if questId is missing from URL
  useEffect(() => {
    if (!questId) {
      router.replace('/quests');
    }
  }, [questId, router]);

  if (!questId) return null;

  const handleChooseTeacher = async (teacherId: string) => {
    setSelected(teacherId);
    setSaving(true);
    try {
      // Save teacher selection in onboardingAnswers or context profile
      const nextAnswers = {
        ...onboardingAnswers,
        selectedTeacherId: teacherId
      };
      setOnboarding(nextAnswers, true);
      
      // Redirect to lesson
      router.push(`/quests/lesson?questId=${encodeURIComponent(questId)}&teacherId=${encodeURIComponent(teacherId)}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 20px' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ fontSize: 44 }}>🎙️</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: 'var(--t1)', marginTop: 12 }}>
          Select Your Quest Teacher
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--t2)', marginTop: 8, maxWidth: 500, margin: '8px auto 0', lineHeight: 1.5 }}>
          Choose a specialized digital teacher from the local catalog to narrate and guide you through this learning module.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20
      }}>
        {TEACHERS.map((teacher) => {
          const isCurrent = selected === teacher.id;

          return (
            <div
              key={teacher.id}
              onClick={() => !saving && handleChooseTeacher(teacher.id)}
              className="glass-card card-hover"
              style={{
                padding: '24px',
                borderRadius: 20,
                border: isCurrent ? `2px solid ${teacher.accent}` : '1px solid var(--border)',
                background: teacher.color,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 320,
                transition: 'all 0.2s ease',
                opacity: saving && !isCurrent ? 0.6 : 1
              }}
            >
              <div>
                <div style={{ fontSize: 50, marginBottom: 16, textAlign: 'center' }}>
                  {teacher.avatar}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', textAlign: 'center', marginBottom: 2 }}>
                  {teacher.name}
                </h3>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: teacher.accent, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', marginBottom: 12 }}>
                  {teacher.role}
                </div>
                <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, textAlign: 'center' }}>
                  {teacher.desc}
                </p>
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'var(--t3)',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: 10
                }}>
                  🎯 Focus: {teacher.focus}
                </div>
                <button
                  style={{
                    width: '100%',
                    background: isCurrent ? teacher.accent : 'var(--bg1)',
                    border: `1px solid ${isCurrent ? 'transparent' : 'var(--border)'}`,
                    color: isCurrent ? '#fff' : 'var(--t1)',
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isCurrent ? 'Selected ✓' : 'Choose Mentor'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
