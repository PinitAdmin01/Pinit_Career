'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { QUESTS_REGISTRY } from '@/lib/data/questsData';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';

import { useWorkspaceState, TEACHERS, getLangInfo } from './workspace/useWorkspaceState';
import { WorkspaceCodeEditor } from './workspace/WorkspaceCodeEditor';
import { WorkspaceAIHint } from './workspace/WorkspaceAIHint';
import { WorkspaceTestResults } from './workspace/WorkspaceTestResults';
import {
  TeacherSelectScreen,
  CompletionScreen,
  SubmitButtonsBar,
} from './workspace/WorkspaceSubmitPanel';

const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });

export default function QuestWorkspaceClient({ questId }: { questId: string }) {
  const cOS = useCareerOS();
  const { completedQuests, saveQuestCode, pins } = cOS;
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const isCompleted = completedQuests.includes(questId);

  const quest = useMemo(() => {
    const fromCourses = COURSES_REGISTRY.flatMap(c => c.quests || []).find((q: { id?: string }) => q.id === questId);
    if (fromCourses) return fromCourses;
    const fromRegistry = QUESTS_REGISTRY.find(q => q.id === questId);
    if (fromRegistry) return fromRegistry;
    const answers = cOS.onboardingAnswers as any;
    if (answers?.roadmap_modules && Array.isArray(answers.roadmap_modules)) {
      for (const m of answers.roadmap_modules) {
        const q = m.quests?.find((qi: any) => qi.id === questId);
        if (q) return q;
      }
    }
    return null;
  }, [questId, cOS.onboardingAnswers]);

  const category = useMemo(() => {
    if (!quest) return 'assignment';
    if (quest.category) return quest.category;
    if (quest.requiresAvatar || quest.type === 'lecture' || quest.type === 'interactive') {
      return 'learning';
    }
    if (quest.id === 'fizzbuzz' || quest.id.includes('exam')) {
      return 'exam';
    }
    return 'assignment';
  }, [quest]);

  const state = useWorkspaceState({
    questId,
    quest,
    category,
    userId,
    cOS,
    isCompleted,
  });

  const currentTeacher = TEACHERS.find(t => t.id === state.questTeacher) || TEACHERS[0];
  const langInfo = getLangInfo(questId || '');
  const isHardwareQuest = Boolean(quest?.id && (quest.id.includes('embedded') || quest.id.includes('network') || quest.id.includes('edge') || quest.id.includes('iotsec')));

  if (!quest) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginBottom: 10 }}>Quest Not Found</h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>
            This quest may have been removed or your roadmap has changed. Return to the Quests Hub to continue.
          </p>
          <Link href="/quests" className="btn-primary">← Back to Quests Hub</Link>
        </div>
      </div>
    );
  }

  if (!state.isUnlocked) {
    return (
      <TeacherSelectScreen
        quest={quest}
        selectedTeacherId={state.selectedTeacherId}
        setSelectedTeacherId={state.setSelectedTeacherId}
        pins={pins}
        onUnlockQuest={state.handleUnlockQuest}
      />
    );
  }

  if (state.isCompleteView) {
    return (
      <CompletionScreen
        quest={quest}
        currentTeacher={currentTeacher}
        category={category}
      />
    );
  }

  const isExam = category === 'exam';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Link href="/quests" style={{ textDecoration: 'none', color: 'var(--t3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ← Return to Quests Tab
          </Link>
          <h2 style={{ margin: '8px 0 0', fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            {isExam ? '📝 Taking Exam: ' : category === 'learning' ? '🎓 Learning Class: ' : '💻 Completing Assignment: '}
            {quest.title}
            <span style={{
              fontSize: 10,
              background: isExam ? 'rgba(var(--danger-rgb), 0.1)' : category === 'learning' ? 'rgba(var(--purple-rgb, 124, 58, 237), 0.1)' : 'rgba(79,70,229,0.1)',
              color: isExam ? 'var(--coral)' : category === 'learning' ? 'var(--reward-bright)' : 'var(--accent)',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 800,
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)'
            }}>
              {isExam ? 'PROCTOR EXAM' : category === 'learning' ? 'SOCRATIC CLASS' : 'ASSIGNMENT CHALLENGE'}
            </span>
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 12, color: 'var(--t3)', marginRight: 12 }}>
            Instructor: <strong style={{ color: currentTeacher.color }}>{currentTeacher.name} {currentTeacher.emoji}</strong>
          </span>
          {isExam ? (
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Timer: <strong style={{ color: 'var(--coral)', fontFamily: 'var(--font-mono)' }}>⏱ {state.timeLeft}</strong></span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Balance: <strong style={{ color: 'var(--accent)' }}>⚡ {pins} Pins</strong></span>
          )}
        </div>
      </div>

      {category === 'learning' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Quest Objective</h3>
                <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>{quest.desc}</p>
              </div>
              {quest.syllabus && (
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Syllabus Checklist</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {quest.syllabus.map((topic: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: 14 }}>•</span>
                        <span style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: isCompleted ? 'var(--green)' : 'var(--t1)' }}>
                  {isCompleted ? '✓ Lesson Completed' : 'Completed your discussion?'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                  {isCompleted ? 'You have successfully completed this lesson.' : 'Ready to finalize this milestone lesson?'}
                </div>
              </div>
              <button onClick={state.handleCompleteLecture} disabled={isCompleted} className="btn-primary">
                {isCompleted ? '✓ Completed' : '✓ Complete Lesson'}
              </button>
            </div>
          </div>
          <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 620 }}>
            <AvatarMentorWidget userId={user?.id} careerProfile={{ ats_score: 75 } as any} teacherId={state.questTeacher || 'kashyap'} activeQuest={quest} minimized={false} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: state.showGuidedMentor ? '1.1fr 1.3fr 1.2fr' : '1fr 1.2fr', gap: 24, alignItems: 'flex-start', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24, borderTop: isExam ? '4px solid var(--coral)' : undefined }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>
                {isExam ? 'Exam Instructions' : 'Assignment Description'}
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 16px 0' }}>{quest.desc}</p>
              {isExam && (
                <div style={{ background: 'rgba(var(--danger-rgb), 0.05)', border: '1px solid rgba(var(--danger-rgb), 0.15)', borderRadius: 12, padding: 14, fontSize: 12.5, color: 'var(--coral)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span>⚠️</span>
                  <div>
                    <strong>Proctored Session:</strong> Tab-switches or exiting this browser view are logged in the cryptographically signed Sentinel trust ledger. Do not exit full-screen.
                  </div>
                </div>
              )}
              <button
                onClick={() => state.setShowGuidedMentor(prev => !prev)}
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: state.showGuidedMentor ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                  color: state.showGuidedMentor ? 'var(--t1)' : 'var(--text)',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {state.showGuidedMentor ? '💬 Close Socratic Mentor' : `💬 Ask ${currentTeacher.name} for Socratic Help`}
              </button>
            </div>

            {quest.hint && (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <button onClick={() => state.setShowHint(h => !h)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                  {state.showHint ? '💡 Hide Hint' : '💡 Show Hint'}
                </button>
                {state.showHint && (
                  <p style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10, marginTop: 8, fontSize: 12, color: 'var(--amber)', lineHeight: 1.5 }}>
                    {quest.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <WorkspaceCodeEditor
              questId={questId}
              code={state.code}
              setCode={state.setCode}
              editorLocked={isCompleted || (isExam && state.examTimedOut)}
              isExam={isExam}
              examTimedOut={state.examTimedOut}
              isCompleted={isCompleted}
              unlockRemainingSec={state.unlockRemainingSec}
              onExtendGrace={() => {
                if (typeof (cOS as any).extendItemGrace === 'function') {
                  (cOS as any).extendItemGrace(`quest:${questId}`);
                }
              }}
              userId={userId}
              saveQuestCode={saveQuestCode}
              langInfo={langInfo}
            />

            <WorkspaceTestResults
              output={state.output}
              terminalLogs={state.terminalLogs}
              langFile={langInfo.file}
              onAskAiTutor={() => {
                state.setShowAiTutorModal(true);
                state.setLoadingAiTutor(true);
                setTimeout(() => {
                  state.setLoadingAiTutor(false);
                  state.setAiTutorHint(`🤖 ${currentTeacher.name} (${currentTeacher.emoji}) Socratic Debug Hint:\n\n"I analyzed your code execution logic for ${quest?.title || 'this quest'}.\n\nCompiler Output: '${state.output?.message}'.\n\n💡 Guidance: Check your loop bounds, syntax parameters, and return statement types before executing!"`);
                }, 500);
              }}
              isHardwareQuest={isHardwareQuest}
              isCompleted={isCompleted}
            />

            <SubmitButtonsBar
              isExam={isExam}
              isCompleted={isCompleted}
              examTimedOut={state.examTimedOut}
              onSubmit={state.handleVerifySolution}
              onReset={() => state.setCode(quest.starterCode || '')}
            />
          </div>

          {state.showGuidedMentor && (
            <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 620, boxShadow: 'var(--shadow-lg)' }}>
              <AvatarMentorWidget userId={userId} careerProfile={{ ats_score: 75 } as any} teacherId={state.questTeacher || 'kashyap'} activeQuest={quest} minimized={false} />
            </div>
          )}
        </div>
      )}

      <WorkspaceAIHint
        showAiTutorModal={state.showAiTutorModal}
        setShowAiTutorModal={state.setShowAiTutorModal}
        loadingAiTutor={state.loadingAiTutor}
        aiTutorHint={state.aiTutorHint}
      />
    </div>
  );
}
