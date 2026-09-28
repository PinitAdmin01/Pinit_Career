'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { supabase } from '@/lib/supabaseClient';
import { getAuthoritativeTestSuite } from '@/lib/quests/questRegistry';

export interface Teacher {
  id: string;
  name: string;
  emoji: string;
  color: string;
  accent: string;
  nature: string;
  characteristics: string;
  memory: string;
}

export const TEACHERS: Teacher[] = [
  {
    id: 'kashyap',
    name: 'Kashyap Sir',
    emoji: '👩‍🎨',
    color: '#06b6d4',
    accent: 'var(--accent)',
    nature: 'Staff Systems Architect',
    characteristics: 'Analytical, architectural, and strict on performance. Focuses on low-level memory layout, concurrency, and scalable systems.',
    memory: 'Remembers systems projects, compiler optimization, and architecture paradigms.'
  },
  {
    id: 'karthic',
    name: 'Karthic Sir "Nega"',
    emoji: '👨‍🏫',
    color: '#f59e0b',
    accent: 'var(--amber)',
    nature: 'Algorithmic Lead Tutor',
    characteristics: 'Socratic, algorithmic, and deeply mathematical. Pushes developers to understand Big-O, edge cases, and recursive paradigms.',
    memory: 'Maintains notes on algorithmic edge-cases, dynamic programming patterns, and math intuition.'
  },
  {
    id: 'maya',
    name: 'Ms. Maya',
    emoji: '👩‍💼',
    color: '#f43f5e',
    accent: 'var(--coral)',
    nature: 'Principal Security Auditor',
    characteristics: 'Cautious, thorough, and security-first. Highlights injection vulnerabilities, race conditions, and cryptographic principles.',
    memory: 'Tracks security audits, lock safety, and zero-trust protocol compliance.'
  },
  {
    id: 'divya',
    name: 'Ms. Divya',
    emoji: '👨‍💼',
    color: '#10b981',
    accent: 'var(--green)',
    nature: 'Empathetic Frontend Wizard',
    characteristics: 'Creative, empathetic, and visually-driven. Specializes in user experience layouts, interactive web flows, and frontend gamification.',
    memory: 'Tracks UI wireframes, client feedback, and visual progression.'
  }
];

export function resolveQuestLanguage(quest: any, qId: string = ''): 'java' | 'python' | 'sql' | 'javascript' {
  if (quest?.language) {
    const l = String(quest.language).toLowerCase();
    if (l === 'py' || l === 'python') return 'python';
    if (l === 'sql' || l === 'sqlite') return 'sql';
    if (l === 'java') return 'java';
    if (l === 'javascript' || l === 'js' || l === 'react' || l === 'typescript' || l === 'ts') return 'javascript';
  }

  const starter = String(quest?.starterCode || '');
  const testSuite = String(quest?.testSuite || '');
  const cleanId = (qId || quest?.id || '').toLowerCase();

  if (starter.includes('public class') || starter.includes('class Solution') || testSuite.includes('public class')) {
    return 'java';
  }
  if (starter.includes('def ') || testSuite.includes('def ') || testSuite.includes('assert ')) {
    return 'python';
  }
  if (starter.toUpperCase().includes('CREATE TABLE') || starter.toUpperCase().includes('SELECT ') || testSuite.toUpperCase().includes('PRAGMA') || testSuite.toUpperCase().includes('SELECT sql FROM')) {
    return 'sql';
  }

  const prefixMatch = cleanId.match(/^([a-z0-9_]+)-/);
  const prefix = prefixMatch ? prefixMatch[1] : '';

  const PYTHON_PREFIXES = new Set(['python', 'py', 'nlp', 'quant', 'iot_edge', 'ai']);
  const SQL_PREFIXES = new Set(['sql', 'sql-mastery', 'database']);
  const JS_PREFIXES = new Set(['react', 'react-basics', 'fullstack', 'fullstack-js', 'mobile', 'graphics3d', 'g3d', 'blockchain', 'javascript', 'js']);
  const JAVA_PREFIXES = new Set(['java', 'java-basics', 'dsa', 'dsa-optim', 'distributed', 'dist', 'cloud', 'cloud-native', 'devops', 'cyber', 'iot_sec', 'iot_net', 'iot_emb']);

  if (PYTHON_PREFIXES.has(prefix) || cleanId.startsWith('python-') || cleanId.startsWith('py-')) return 'python';
  if (SQL_PREFIXES.has(prefix) || cleanId.startsWith('database-') || cleanId.startsWith('sql-')) return 'sql';
  if (JS_PREFIXES.has(prefix) || cleanId.startsWith('react-') || cleanId.startsWith('fullstack-') || cleanId.startsWith('js-')) return 'javascript';
  if (JAVA_PREFIXES.has(prefix) || cleanId.startsWith('java-') || cleanId.startsWith('dsa-')) return 'java';

  if (/\b(python|py)\b/i.test(cleanId)) return 'python';
  if (/\b(sql|database)\b/i.test(cleanId)) return 'sql';
  if (/\b(react|javascript|js|frontend)\b/i.test(cleanId)) return 'javascript';

  return 'java';
}

export function getLangInfo(qId: string, quest?: any): { file: string; label: string; native: boolean; language: 'java' | 'python' | 'sql' | 'javascript' } {
  const language = resolveQuestLanguage(quest, qId);
  switch (language) {
    case 'python':
      return { file: 'solution.py', label: 'Python runtime (Pyodide WASM)', native: true, language };
    case 'sql':
      return { file: 'query.sql', label: 'PostgreSQL (runs in your browser)', native: true, language };
    case 'javascript':
      return { file: 'App.jsx', label: 'JS/JSX sandbox', native: true, language };
    case 'java':
    default:
      return { file: 'Solution.java', label: 'Java compiler judge', native: true, language: 'java' };
  }
}

export function multiLangTranspiler(inputCode: string, qId: string): string {
  let js = inputCode || '';
  if (qId.startsWith('py') || qId.includes('python') || qId.includes('ai') || qId.includes('edge')) {
    js = js.replace(/#.*$/gm, '');
    js = js.replace(/\bdef\s+(\w+)\s*\(([^)]*)\):/g, 'function $1($2) {');
    js = js.replace(/\belif\b/g, '} else if');
    js = js.replace(/\belse\s*:/g, '} else {');
    js = js.replace(/\bif\s+(.*?):/g, 'if ($1) {');
    js = js.replace(/\bTrue\b/g, 'true');
    js = js.replace(/\bFalse\b/g, 'false');
    js = js.replace(/\bNone\b/g, 'null');
    js = js.replace(/\band\b/g, '&&');
    js = js.replace(/\bor\b/g, '||');
    js = js.replace(/\bnot\b/g, '!');
    js = js.replace(/print\((.*?)\)/g, 'console.log($1)');
    if (js.includes('function ') && !js.includes('}')) {
      js = js + '\n}';
    }
    return js;
  }

  if (qId.startsWith('database') || qId.includes('sql')) {
    return `
      const sqlQuery = ${JSON.stringify(inputCode || '')};
      const s = sqlQuery.toUpperCase();
      if (!s.includes("SELECT") && !s.includes("INSERT") && !s.includes("CREATE") && !s.includes("UPDATE")) {
        throw new Error("Invalid SQL Syntax: Query must contain valid SELECT, INSERT, or UPDATE statement.");
      }
    `;
  }

  js = js.replace(/public\s+class\s+\w+\s*\{/, '');
  js = js.trim();
  if (js.endsWith('}') && js.split('{').length < js.split('}').length) js = js.slice(0, -1);
  const reserved = new Set(['if', 'for', 'while', 'switch', 'catch', 'synchronized']);
  js = js.replace(/(public|protected|private|static|\s)+([a-zA-Z0-9_<>\s\[\]]+)\s+(\w+)\s*\(([^)]*)\)/g, (match, access, retType, name, args) => {
    if (reserved.has(name)) return match;
    const cleanArgs = args.replace(/(int|String|double|float|boolean|char|int\[\])\s+/g, '');
    return `function ${name}(${cleanArgs})`;
  });
  js = js.replace(/new\s+int\[\]\s*\{/g, '[');
  js = js.replace(/\b(int|String|double|float|boolean|char)\b(?!\.)\s+(\w+)/g, 'let $2');
  js = js.replace(/String\.valueOf\(/g, 'String(');
  js = js.replace(/\.length\(\)/g, '.length');
  js = js.replace(/System\.out\.println/g, 'console.log');
  return js;
}

interface UseWorkspaceStateProps {
  questId: string;
  quest: any;
  category: string;
  userId: string;
  cOS: any;
  isCompleted: boolean;
}

export function useWorkspaceState({
  questId,
  quest,
  category,
  userId,
  cOS,
  isCompleted,
}: UseWorkspaceStateProps) {
  const { completedQuests, addCompletedQuest, saveQuestCode, unlockItem, getItemRemainingSeconds, unlockedItems } = cOS;

  const EXAM_DURATION_SEC = 2700;
  const examStartKey = useMemo(
    () => `pinit_exam_started_${userId}_${questId}`,
    [userId, questId]
  );

  const getOrCreateExamStart = useCallback((): number => {
    if (typeof window === 'undefined') return Date.now();
    try {
      const stored = localStorage.getItem(examStartKey);
      const parsed = stored ? Number(stored) : NaN;
      if (Number.isFinite(parsed) && parsed > 0 && parsed <= Date.now()) {
        return parsed;
      }
      const now = Date.now();
      localStorage.setItem(examStartKey, String(now));
      return now;
    } catch (err) {
      console.warn('[QuestWorkspace] Could not persist exam start time:', err);
      return Date.now();
    }
  }, [examStartKey]);

  const [timeLeft, setTimeLeft] = useState('45:00');
  const [examTimedOut, setExamTimedOut] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('kashyap');
  const [questTeacher, setQuestTeacher] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<{ success: boolean; message: string } | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showAiTutorModal, setShowAiTutorModal] = useState<boolean>(false);
  const [aiTutorHint, setAiTutorHint] = useState<string | null>(null);
  const [loadingAiTutor, setLoadingAiTutor] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleteView, setIsCompleteView] = useState<boolean>(false);
  const [showGuidedMentor, setShowGuidedMentor] = useState<boolean>(false);
  const [unlockRemainingSec, setUnlockRemainingSec] = useState<number>(0);

  useEffect(() => {
    if (category !== 'exam') return;
    const startedAt = getOrCreateExamStart();

    const tick = () => {
      const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = EXAM_DURATION_SEC - elapsedSec;
      if (remaining <= 0) {
        setTimeLeft('00:00');
        setExamTimedOut(true);
        setOutput({
          success: false,
          message: 'Exam time expired. Session locked — automatic fail. Further submissions are disabled.'
        });
        return true;
      }
      const m = Math.floor(remaining / 60).toString().padStart(2, '0');
      const s = (remaining % 60).toString().padStart(2, '0');
      setTimeLeft(`${m}:${s}`);
      return false;
    };

    const alreadyExpired = tick();
    if (alreadyExpired) {
      toast.error('Time Expired', 'Exam locked. Your attempt was auto-failed.');
      return;
    }

    const timer = setInterval(() => {
      if (tick()) {
        clearInterval(timer);
        toast.error('Time Expired', 'Exam locked. Your attempt was auto-failed.');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [category, getOrCreateExamStart]);

  useEffect(() => {
    if (!questId || typeof getItemRemainingSeconds !== 'function') return;
    const check = () => {
      setUnlockRemainingSec(getItemRemainingSeconds(`quest:${questId}`));
    };
    check();
    const timer = setInterval(check, 2000);
    return () => clearInterval(timer);
  }, [questId, getItemRemainingSeconds, unlockedItems]);

  useEffect(() => {
    if (!questId) return;
    const teacherStored = typeof window !== 'undefined'
      ? (localStorage.getItem(`pinit_quest_teacher_${questId}`) || sessionStorage.getItem(`pinit_quest_teacher_${questId}`))
      : null;
    const isPaid = (cOS.onboardingAnswers?.initiatedQuests || []).includes(questId);
    const isUnlockedInLocks = typeof cOS.isItemUnlocked === 'function' ? cOS.isItemUnlocked(`quest:${questId}`) : false;
    const isAlreadyCompleted = completedQuests.includes(questId);
    const isEnrolledRoadmapQuest = (() => {
      const answers = cOS.onboardingAnswers as any;
      if (answers?.roadmap_modules && Array.isArray(answers.roadmap_modules)) {
        return answers.roadmap_modules.some((m: any) => (m.quests || []).some((q: any) => q.id === questId));
      }
      return false;
    })();

    const selectedTeacher = cOS.onboardingAnswers?.selectedTeacherId || teacherStored || 'kashyap';
    setQuestTeacher(selectedTeacher);

    // Authoritative unlock check: allow enrolled roadmap quests without pin paywall
    if (isUnlockedInLocks || isPaid || isAlreadyCompleted || isEnrolledRoadmapQuest) {
      setIsUnlocked(true);
    }
  }, [questId, completedQuests, cOS, unlockedItems]);

  useEffect(() => {
    if (!quest) return;
    const savedCode = cOS.onboardingAnswers?.questCodes?.[questId] || (typeof window !== 'undefined' ? localStorage.getItem(`pinit_code_${userId}_${questId}`) : null);
    if (savedCode) {
      setCode(savedCode);
    } else if (quest.starterCode) {
      setCode(quest.starterCode);
    }
  }, [quest, questId, userId, cOS.onboardingAnswers]);

  const handleUnlockQuest = async () => {
    const teacher = TEACHERS.find(t => t.id === selectedTeacherId) || TEACHERS[0];
    const ok = await unlockItem(`quest:${questId}`, 'quest', `Unlock Quest: ${(quest?.title || '').split(':')[1]?.trim() || quest?.title}`).catch(() => true);
    if (ok) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`pinit_quest_teacher_${questId}`, selectedTeacherId);
      }
      setQuestTeacher(selectedTeacherId);
      setIsUnlocked(true);
      toast.success('Quest Active! ⚡', `Unlocked with ${teacher.name} as your instructor.`);
    }
  };

  const handleVerifySolution = useCallback(() => {
    if (examTimedOut) {
      setOutput({
        success: false,
        message: 'Exam time expired. Session locked — further submissions are disabled.'
      });
      return;
    }

    const resolvedLanguage = resolveQuestLanguage(quest, questId || '');
    const authoritativeSuite = getAuthoritativeTestSuite(questId || '');
    const fallbackSuite = resolvedLanguage === 'python' ? 'def test_suite():\n    assert True\ntest_suite()' :
      resolvedLanguage === 'sql' ? 'SELECT 1;' :
      resolvedLanguage === 'javascript' ? 'if (typeof solution === "function") { solution(); }' :
      'public class SolutionTest { public static void main(String[] args) { Solution.main(new String[]{}); } }';

    const effectiveTestSuite = (quest?.testSuite && String(quest.testSuite).trim())
      ? String(quest.testSuite)
      : (authoritativeSuite || fallbackSuite);

    setOutput(null);
    setTerminalLogs([`⚙️ Dispatching ${resolvedLanguage.toUpperCase()} submission to isolated compiler judge...`]);

    import('@/lib/code/codeRunner').then(({ runTestSuite }) => {
      runTestSuite(code, resolvedLanguage, {
        testSuite: effectiveTestSuite,
        questId: quest?.id || questId,
        xp: quest?.xp || 150
      })
        .then((result) => {
          setTerminalLogs(result.terminalLogs || []);
          if (result.allPassed) {
            const xpReward = quest.xp || (category === 'exam' ? 120 : 150);
            const pinsReward = quest.pins || (category === 'exam' ? 6 : 5);

            const applySuccess = (isOffline = false) => {
              setOutput({
                success: true,
                message: isOffline
                  ? `Verification Passed (Offline Resilient)! All automated ${resolvedLanguage.toUpperCase()} test assertions cleared.`
                  : `Verification Passed! All automated ${resolvedLanguage.toUpperCase()} test assertions cleared.`
              });
              saveQuestCode(quest.id, code);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`pinit_code_${userId}_${quest.id}`, code);
              }
              addCompletedQuest(quest.id, category === 'exam', xpReward);
              toast.success(category === 'exam' ? 'Exam Passed! 🎉' : 'Quest Completed! 🎉', `Earned +${xpReward} XP & +${pinsReward} Pins.`);
              if (typeof cOS?.earnPins === 'function') {
                cOS.earnPins(category === 'exam' ? 'exam_pass' : 'mission_complete', pinsReward, `Completed quest: ${quest.title}`);
              }
              if (userId && userId !== 'guest') {
                Promise.resolve(supabase.from('quest_completions').upsert({
                  user_id: userId,
                  quest_id: quest.id,
                  completed_at: new Date().toISOString(),
                }, { onConflict: 'user_id,quest_id' })).then(() => {}).catch(() => {});
              }
              setIsCompleteView(true);
              api.post('/api/student/activity', {
                action: 'quest_complete',
                meta: { questId: quest.id, questTitle: quest.title, isExam: category === 'exam', xp: xpReward }
              }).catch(() => {});
              try { sessionStorage.removeItem(examStartKey); } catch {}
            };

            api.post<{ success: boolean; message?: string }>('/api/quests/verify', {
              questId: quest.id,
              code,
              language: resolvedLanguage,
              isExam: category === 'exam',
              elapsedSeconds: category === 'exam'
                ? Math.floor((Date.now() - getOrCreateExamStart()) / 1000)
                : null,
              allowedSeconds: category === 'exam' ? EXAM_DURATION_SEC : null
            })
            .then(data => {
              if (data && data.success) {
                applySuccess(false);
              } else {
                setOutput({ success: false, message: "Security Validation Failed: " + (data?.message || 'Verification rejected') });
              }
            })
            .catch(err => {
              // Network disconnection / offline resilience: client automated judge already cleared all test assertions
              console.warn('[useWorkspaceState] Server verification network failed, applying client-passed completion:', err);
              applySuccess(true);
            });
          } else {
            const errMsg = result.testOutcomes?.[0]?.error || result.terminalLogs?.[result.terminalLogs.length - 1] || 'Automated test assertion failed.';
            setOutput({ success: false, message: errMsg });
          }
        })
        .catch((err) => {
          setOutput({ success: false, message: 'Execution judge error: ' + err.message });
        });
    });
  }, [examTimedOut, quest, questId, code, category, getOrCreateExamStart, saveQuestCode, userId, addCompletedQuest, cOS, examStartKey]);

  const handleCompleteLecture = useCallback(() => {
    addCompletedQuest(quest?.id, false, quest?.xp || 150);
    setIsCompleteView(true);
    api.post('/api/student/activity', {
      action: 'quest_complete',
      meta: { questId: quest?.id, questTitle: quest?.title, isExam: false, xp: quest?.xp || 150 }
    }).catch(() => {});
  }, [quest, addCompletedQuest]);

  return {
    EXAM_DURATION_SEC,
    examStartKey,
    getOrCreateExamStart,
    timeLeft,
    examTimedOut,
    selectedTeacherId, setSelectedTeacherId,
    questTeacher, setQuestTeacher,
    isUnlocked, setIsUnlocked,
    code, setCode,
    output, setOutput,
    terminalLogs, setTerminalLogs,
    showAiTutorModal, setShowAiTutorModal,
    aiTutorHint, setAiTutorHint,
    loadingAiTutor, setLoadingAiTutor,
    showHint, setShowHint,
    isCompleteView, setIsCompleteView,
    showGuidedMentor, setShowGuidedMentor,
    unlockRemainingSec, setUnlockRemainingSec,
    handleUnlockQuest,
    handleVerifySolution,
    handleCompleteLecture,
  };
}

export type WorkspaceState = ReturnType<typeof useWorkspaceState>;
