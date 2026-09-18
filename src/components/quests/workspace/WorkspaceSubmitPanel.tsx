import React from 'react';
import Link from 'next/link';
import { Teacher, TEACHERS } from './useWorkspaceState';

interface TeacherSelectScreenProps {
  quest: any;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  pins: number;
  onUnlockQuest: () => void;
}

export function TeacherSelectScreen({
  quest,
  selectedTeacherId,
  setSelectedTeacherId,
  pins,
  onUnlockQuest,
}: TeacherSelectScreenProps) {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <Link href="/quests" style={{ textDecoration: 'none', color: 'var(--t3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          ← Return to Quests Tab
        </Link>
        <h1 style={{ marginTop: 12, fontSize: 28 }}>Choose Your Instructor</h1>
        <p style={{ color: 'var(--t2)', fontSize: 14 }}>
          Select a mentor to guide you through <strong style={{ color: 'var(--t1)' }}>{quest.title}</strong> based on their pedagogical nature, socratic style, and analytical focus.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {TEACHERS.map(t => {
          const isSelected = selectedTeacherId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTeacherId(t.id)}
              style={{
                background: 'var(--bg2)',
                border: `2px solid ${isSelected ? t.color : 'var(--border)'}`,
                borderRadius: 20,
                padding: 22,
                cursor: 'pointer',
                boxShadow: isSelected ? `0 10px 30px -10px ${t.color}30` : 'var(--shadow-sm)',
                transition: 'all 0.25s',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative'
              }}
            >
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  background: t.color,
                  color: 'white',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  ✓
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{t.emoji}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>{t.name}</h3>
                  <span style={{ fontSize: 10, color: t.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{t.nature}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, lineHeight: 1.45 }}>
                <div>
                  <strong style={{ color: 'var(--t2)', fontSize: 11 }}>Characteristics:</strong>
                  <p style={{ color: 'var(--t3)', margin: '2px 0 0' }}>{t.characteristics}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--t2)', fontSize: 11 }}>Memory State:</strong>
                  <p style={{ color: 'var(--t3)', margin: '2px 0 0' }}>{t.memory}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '24px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.8px' }}>
            Quest Startup Gate
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>
            Cost: <span style={{ color: 'var(--accent)' }}>⚡ 5 Pins</span> · Current Balance: <span style={{ color: 'var(--green)' }}>⚡ {pins} Pins</span>
          </div>
        </div>
        <button
          onClick={onUnlockQuest}
          className="btn-primary"
          style={{ padding: '12px 32px', fontSize: 14 }}
          id="btn-start-quest"
        >
          Start Quest & Spend 5 Pins ➔
        </button>
      </div>
    </div>
  );
}

interface CompletionScreenProps {
  quest: any;
  currentTeacher: Teacher;
  category: string;
}

export function CompletionScreen({ quest, currentTeacher, category }: CompletionScreenProps) {
  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '40px 24px', textAlign: 'center' }} className="animate-fade-in">
      <div style={{
        background: 'var(--bg2)',
        border: '1.5px solid var(--green)',
        borderRadius: 24,
        padding: '50px 40px',
        boxShadow: '0 20px 40px -15px rgba(var(--success-deep-rgb), 0.15)'
      }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
          Quest Completed!
        </h2>
        <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
          Congratulations! You have completed the quest <strong style={{ color: 'var(--t1)' }}>"{quest.title}"</strong> under the guidance of <strong style={{ color: currentTeacher.color }}>{currentTeacher.name}</strong>.
        </p>

        <div style={{
          display: 'inline-flex',
          gap: 16,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          padding: '12px 24px',
          borderRadius: 30,
          marginBottom: 36,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700
        }}>
          <span style={{ color: 'var(--accent)' }}>⚡ +{category === 'exam' ? 50 : 30} XP</span>
          <span style={{ color: 'var(--green)' }}>📌 +{category === 'exam' ? 25 : 10} Pins</span>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/quests" className="btn-primary" style={{ padding: '10px 24px' }}>
            Return to Quests Tab
          </Link>
          <Link href="/career-builder" className="btn-ghost" style={{ padding: '10px 24px' }}>
            View Career Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}

interface SubmitButtonsBarProps {
  isExam: boolean;
  isCompleted: boolean;
  examTimedOut: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

export function SubmitButtonsBar({
  isExam,
  isCompleted,
  examTimedOut,
  onSubmit,
  onReset,
}: SubmitButtonsBarProps) {
  const isLocked = isCompleted || (isExam && examTimedOut);
  const btnColor = isLocked ? 'var(--bg3)' : isExam ? 'var(--coral)' : 'var(--accent)';
  const borderCol = isLocked ? '1px solid var(--border)' : isExam ? '1px solid var(--coral)' : '1px solid var(--accent)';

  let label = isExam ? 'Submit Exam Solution ✓' : 'Submit Assignment ✓';
  if (isCompleted) {
    label = isExam ? 'Exam Submitted ✓ (Read Only)' : 'Assignment Completed ✓ (Read Only)';
  } else if (isExam && examTimedOut) {
    label = 'Time Expired — Locked';
  }

  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
      <button
        onClick={onSubmit}
        disabled={isLocked}
        className="btn-primary"
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 12,
          fontSize: 13,
          background: btnColor,
          border: borderCol,
          color: isLocked ? 'var(--t3)' : 'var(--text)',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          boxShadow: isLocked ? 'none' : isExam ? '0 4px 12px rgba(var(--danger-rgb), 0.2)' : undefined
        }}
      >
        {label}
      </button>
      {!isLocked && (
        <button
          onClick={onReset}
          className="btn-ghost"
          style={{ padding: 12, fontSize: 13 }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
