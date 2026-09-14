import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { supabase } from '@/lib/supabaseClient';

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

export function getLangInfo(qId: string): { file: string; label: string; native: boolean } {
  if (qId.startsWith('py') || qId.includes('python') || qId.includes('ai')) return { file: 'solution.py', label: 'Python editor (no CPython runtime)', native: false };
  if (qId.startsWith('database') || qId.includes('sql')) return { file: 'query.sql', label: 'SQL editor (no DB engine)', native: false };
  if (qId.startsWith('react') || qId.includes('fullstack') || qId.includes('javascript') || qId.includes('js')) return { file: 'App.jsx', label: 'JS/JSX sandbox', native: true };
  return { file: 'Solution.java', label: 'Java compiler judge', native: true };
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
      const stored = sessionStorage.getItem(examStartKey);
      const parsed = stored ? Number(stored) : NaN;
      if (Number.isFinite(parsed) && parsed > 0 && parsed <= Date.now()) {
        return parsed;
      }
      const now = Date.now();
      sessionStorage.setItem(examStartKey, String(now));
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
    const teacherStored = typeof window !== 'undefined' ? sessionStorage.getItem(`pinit_quest_teacher_${questId}`) : null;
    const isPaid = (cOS.onboardingAnswers?.initiatedQuests || []).includes(questId);
    if (teacherStored || isPaid || completedQuests.includes(questId)) {
      const selectedTeacher = cOS.onboardingAnswers?.selectedTeacherId || teacherStored || 'kashyap';
      setQuestTeacher(selectedTeacher);
      setIsUnlocked(true);
    }
  }, [questId, completedQuests, cOS.onboardingAnswers]);

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
    const ok = await unlockItem(`quest:${questId}`, 'quest', `Unlock Quest: ${(quest?.title || '').split(':')[1]?.trim() || quest?.title}`);
    if (ok) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`pinit_quest_teacher_${questId}`, selectedTeacherId);
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
    if (!quest?.testSuite || !String(quest.testSuite).trim()) {
      setOutput({
        success: false,
        message: 'Verification Error: Test suite is missing for this quest. Contact your instructor — auto-pass is not allowed.'
      });
      return;
    }

    const isJava = (questId || '').includes('java') ||
      (quest?.id || '').includes('java') ||
      (quest?.starterCode || '').includes('class Solution') ||
      (quest?.starterCode || '').includes('public class') ||
      (quest?.desc || '').toLowerCase().includes('java') ||
      ['fizzbuzz', 'reverser', 'arraysum', 'palindrome', 'twosum'].some(id => (questId || '').includes(id));

    if (isJava) {
      setOutput(null);
      setTerminalLogs(['⚙️ Dispatching Java submission to isolated compiler judge...']);
      
      import('@/lib/code/codeRunner').then(({ runTestSuite }) => {
        runTestSuite(code, 'java', { testSuite: quest.testSuite, questId: quest.id, xp: quest.xp })
          .then((result) => {
            setTerminalLogs(result.terminalLogs || []);
            if (result.allPassed) {
              setOutput({
                success: true,
                message: 'Verification Passed! All automated Java test assertions cleared.'
              });
              if (!isCompleted) {
                addCompletedQuest(questId, true, quest.xp || 120, 'course-java-logic');
                toast.success('Exam Passed! 🎉', 'Earned ' + (quest.xp || 120) + ' XP & ' + (quest.pins || 6) + ' Pins.');
                try { sessionStorage.removeItem(examStartKey); } catch {}
              }
            } else {
              const errMsg = result.testOutcomes?.[0]?.error || result.terminalLogs?.[result.terminalLogs.length - 1] || 'Automated test assertion failed.';
              setOutput({ success: false, message: errMsg });
            }
          })
          .catch((err) => {
            setOutput({ success: false, message: 'Execution judge error: ' + err.message });
          });
      });
      return;
    }

    const langInfo = getLangInfo(questId || '');
    if (!langInfo.native) {
      setOutput({
        success: false,
        message: `Verification unavailable: ${langInfo.label}. Client keyword/transpile checks are not accepted as a pass. Configure a server-side judge for this language.`
      });
      setTerminalLogs([`[BLOCKED] No native runtime for ${langInfo.file}. Fail-closed — not marked verified.`]);
      return;
    }

    setOutput(null);
    setTerminalLogs([]);
    try {
      const jsCode = multiLangTranspiler(code, questId || '');
      const workerCode = `
        self.onmessage = function(e) {
          const js = e.data.js;
          const tests = e.data.tests;
          const logs = [];
          const customConsole = {
            log: function(...args) { logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); },
            error: function(...args) { logs.push("[ERROR] " + args.map(a => String(a)).join(' ')); },
            warn: function(...args) { logs.push("[WARN] " + args.map(a => String(a)).join(' ')); }
          };
          try {
            const evaluator = new Function('console', \`
              \${js}
              try {
                \${tests}
                return { success: true, message: "Verification Passed! All test cases cleared." };
              } catch (e) {
                return { success: false, message: e.message };
              }
            \`);
            const res = evaluator(customConsole) || {};
            res.logs = logs;
            self.postMessage(res);
          } catch (err) {
            self.postMessage({ success: false, message: "Syntax or execution error: " + err.message, logs: logs });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      const timeout = setTimeout(() => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        setOutput({ 
          success: false, 
          message: "Execution Timeout: Code execution exceeded the 3000ms sandbox limit (infinite loop detected)." 
        });
      }, 3000);

      worker.onmessage = (e) => {
        clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        const res = e.data;
        if (res.logs && Array.isArray(res.logs)) {
          setTerminalLogs(res.logs);
        }

        if (res.success) {
          api.post<{ success: boolean; message?: string }>('/api/quests/verify', {
            questId: quest.id,
            code,
            language: 'javascript',
            isExam: category === 'exam',
            elapsedSeconds: category === 'exam'
              ? Math.floor((Date.now() - getOrCreateExamStart()) / 1000)
              : null,
            allowedSeconds: category === 'exam' ? EXAM_DURATION_SEC : null
          })
          .then(data => {
            if (data.success) {
              setOutput({ success: true, message: "Verification Passed! All test cases validated on secure compiler." });
              saveQuestCode(quest.id, code);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`pinit_code_${userId}_${quest.id}`, code);
              }
              addCompletedQuest(quest.id, category === 'exam', quest.xp || 150);
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
                meta: { questId: quest.id, questTitle: quest.title, isExam: category === 'exam', xp: quest.xp || 150 }
              }).catch(() => {});
            } else {
              setOutput({ success: false, message: "Security Validation Failed: " + data.message });
            }
          })
          .catch(err => {
            setOutput({ success: false, message: "Server validation connection failed: " + err.message });
          });
        } else {
          setOutput(res);
        }
      };

      worker.onerror = (err) => {
        clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        setOutput({ success: false, message: "Sandbox Error: " + err.message });
      };

      worker.postMessage({ js: jsCode, tests: quest.testSuite });
    } catch (err: any) {
      setOutput({ success: false, message: 'Syntax or sandbox error: ' + err.message });
    }
  }, [examTimedOut, quest, questId, code, isCompleted, addCompletedQuest, examStartKey, category, getOrCreateExamStart, saveQuestCode, userId]);

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
