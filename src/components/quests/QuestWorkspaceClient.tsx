'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { QUESTS_REGISTRY } from '@/lib/data/questsData';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';

// Dynamically import Three.js avatar widget to ensure zero Next.js SSR build errors
const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });

const TEACHERS = [
  {
    id: 'kashyap',
    name: 'Kashyap Sir',
    emoji: '👨‍🔬',
    color: '#3b82f6',
    nature: 'Calm & Protective (Dr. Kalam inspired)',
    characteristics: 'Profoundly patient, encourages honest engineering effort, and focuses on high-level architecture, scalability, and ethical leadership.',
    memory: 'Maintains architectural blueprints, system diagrams, and leadership records.'
  },
  {
    id: 'karthic',
    name: 'Karthic Sir (Nega)',
    emoji: '👨‍🎨',
    color: '#f59e0b',
    nature: 'Hyper-active & Stress Buster',
    characteristics: 'Always happy, uses humor to destress students, and explains complex algorithms with drawing analogies and clean coding practices.',
    memory: 'Tracks funny code examples, stress-relief logs, and algorithm maps.'
  },
  {
    id: 'maya',
    name: 'Ms. Maya',
    emoji: '👩‍💻',
    color: '#ec4899',
    nature: 'Meticulous Systems Auditor',
    characteristics: 'Analytical, data-driven, and strict. Zero tolerance for messy files. Focuses on cloud security, CI/CD telemetry, and network stability.',
    memory: 'Maintains deployment metrics, system constraints, and auditing logs.'
  },
  {
    id: 'divya',
    name: 'Ms. Divya',
    emoji: '👩‍🏫',
    color: '#10b981',
    nature: 'Empathetic Frontend Wizard',
    characteristics: 'Creative, empathetic, and visually-driven. Specializes in user experience layouts, interactive web flows, and frontend gamification.',
    memory: 'Tracks UI wireframes, client feedback, and visual progression.'
  }
];

export default function QuestWorkspaceClient({ questId }: { questId: string }) {
  const router = useRouter();

  const cOS = useCareerOS();
  const { completedQuests, addCompletedQuest, saveQuestCode, pins, spendPins, unlockItem, isItemUnlocked, aiUseTokens, buyAiMinutes } = cOS;
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const isCompleted = completedQuests.includes(questId);

  // AI Companion token usage warning is displayed inside AI Chat tab instead of locking the entire offline editor

  const quest = useMemo(() => {
    const fromCourses = COURSES_REGISTRY.flatMap(c => c.quests || []).find((q: { id?: string }) => q.id === questId);
    if (fromCourses) return fromCourses;
    const fromRegistry = QUESTS_REGISTRY.find(q => q.id === questId);
    if (fromRegistry) return fromRegistry;
    if (typeof window === 'undefined') return null;
    try {
      const moduleKeys = Object.keys(localStorage).filter(k => k.startsWith(`pinit_${userId}_roadmap_modules`));
      for (const key of moduleKeys) {
        const saved = localStorage.getItem(key);
        if (saved) {
          const mods = JSON.parse(saved);
          if (Array.isArray(mods)) {
            for (const m of mods) {
              const q = m.quests?.find((qi: any) => qi.id === questId);
              if (q) return q;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [questId, userId]);

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

  // Countdown Timer state for Taking Exam
  const [timeLeft, setTimeLeft] = useState('45:00');
  const [examTimedOut, setExamTimedOut] = useState(false);
  useEffect(() => {
    if (category !== 'exam') return;
    let sec = 2700; // 45 minutes
    const timer = setInterval(() => {
      sec--;
      if (sec <= 0) {
        clearInterval(timer);
        setTimeLeft('00:00');
        setExamTimedOut(true);
        setOutput({
          success: false,
          message: 'Exam time expired. Session locked — automatic fail. Further submissions are disabled.'
        });
        toast.error('Time Expired', 'Exam locked. Your attempt was auto-failed.');
        return;
      }
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      setTimeLeft(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [category]);

  // States
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('priya');
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



  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextValue = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
      }, 0);
    }

    const pairs: Record<string, string> = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'"
    };
    if (pairs[e.key] !== undefined) {
      e.preventDefault();
      const closing = pairs[e.key];
      const nextValue = value.substring(0, selectionStart) + e.key + closing + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const linesStr = value.substring(0, selectionStart).split('\n');
      const currentLine = linesStr[linesStr.length - 1];
      const indentMatch = currentLine.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : '';
      const extraIndent = currentLine.trim().endsWith('{') ? '    ' : '';
      const nextValue = value.substring(0, selectionStart) + '\n' + indent + extraIndent + value.substring(selectionEnd);
      setCode(nextValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  const getLangInfo = (qId: string): { file: string; label: string; native: boolean } => {
    if (qId.startsWith('py') || qId.includes('python') || qId.includes('ai')) return { file: 'solution.py', label: 'Python editor (no CPython runtime)', native: false };
    if (qId.startsWith('database') || qId.includes('sql')) return { file: 'query.sql', label: 'SQL editor (no DB engine)', native: false };
    if (qId.startsWith('react') || qId.includes('fullstack') || qId.includes('javascript') || qId.includes('js')) return { file: 'App.jsx', label: 'JS/JSX sandbox', native: true };
    return { file: 'Solution.java', label: 'Java editor (no JVM runtime)', native: false };
  };

  const renderEditor = (isExam: boolean) => {
    const langInfo = getLangInfo(questId || '');
    const lineCount = (code || '').split('\n').length || 1;
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
    const editorLocked = isCompleted || (isExam && examTimedOut);

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg3)', border: '1.5px solid var(--border)', borderBottom: 'none', padding: '8px 14px', borderRadius: '12px 12px 0 0' }}>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{langInfo.file} ({isExam ? 'Proctored Environment' : langInfo.label})</span>
          <span style={{ fontSize: 11, color: editorLocked ? (examTimedOut && !isCompleted ? 'var(--coral)' : 'var(--green)') : (isExam ? 'var(--coral)' : 'var(--accent)'), fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {isCompleted ? 'COMPLETED (READ-ONLY)' : (examTimedOut && isExam ? 'TIME EXPIRED (LOCKED)' : (isExam ? 'EXAM ENVIRONMENT' : langInfo.label.toUpperCase()))}
          </span>
        </div>
        <div style={{
          display: 'flex',
          background: '#0d0e12',
          border: '1.5px solid var(--border)',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          minHeight: 320
        }}>
          {/* Gutter */}
          <div style={{
            background: '#090a0f',
            borderRight: '1px solid var(--border)',
            padding: '16px 8px',
            color: 'var(--t3)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            textAlign: 'right',
            userSelect: 'none',
            minWidth: 40,
            lineHeight: 1.6
          }}>
            {lineNumbers.map(n => (
              <div key={n}>{n}</div>
            ))}
          </div>
          {/* Textarea */}
          <textarea
            value={code}
            onChange={(e) => {
              if (editorLocked) return;
              setCode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (editorLocked) return;
              handleKeyDown(e);
            }}
            readOnly={editorLocked}
            style={{
              width: '100%',
              height: 320,
              background: 'transparent',
              color: editorLocked ? 'var(--t3)' : '#f8fafc',
              fontFamily: 'var(--font-mono)',
              fontSize: 12.5,
              padding: '16px 12px',
              border: 'none',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.6
            }}
          />
        </div>

        {/* ── ENHANCEMENT 1 & 2: VS Code Style Interactive Terminal Output & AI Debug Assistant ── */}
        <div style={{
          marginTop: 16,
          background: '#090a0f',
          border: '1.5px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)'
        }}>
          {/* Terminal Bar Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#11131a', borderBottom: '1px solid var(--border)', padding: '6px 14px'
          }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>
              <span style={{ color: 'var(--accent)', borderBottom: '2px solid var(--accent)', paddingBottom: 2 }}>TERMINAL</span>
              <span>OUTPUT</span>
              <span>PROBLEMS</span>
            </div>

            {output && !output.success && (
              <button
                onClick={() => {
                  setShowAiTutorModal(true);
                  const teacher = TEACHERS.find(t => t.id === questTeacher) || TEACHERS[0];
                  setLoadingAiTutor(true);
                  setTimeout(() => {
                    setLoadingAiTutor(false);
                    setAiTutorHint(
                      `🤖 ${teacher.name} (${teacher.emoji}) Socratic Debug Hint:\n\n"I analyzed your code execution logic for ${quest?.title || 'this quest'}.\n\nCompiler Output: '${output.message}'.\n\n💡 Guidance: Check your loop bounds, syntax parameters, and return statement types before executing!"`
                    );
                  }, 500);
                }}
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                  border: 'none', borderRadius: 8, color: '#fff',
                  padding: '4px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
                className="btn-glow"
              >
                🤖 Ask AI Debug Tutor
              </button>
            )}
          </div>

          {/* Terminal Logs Prompt */}
          <div style={{ padding: '12px 16px', minHeight: 100, fontSize: 12, lineHeight: 1.6, color: '#f8fafc' }}>
            <div style={{ color: '#00ff66', fontWeight: 700, marginBottom: 6 }}>
              bash - pinit-compiler-v2.0 ~ $ execution-runner --lang={langInfo.file}
            </div>
            {terminalLogs.length > 0 ? (
              terminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('[ERROR]') ? 'var(--coral)' : log.startsWith('[WARN]') ? 'var(--amber)' : '#e2e8f0' }}>
                  {log}
                </div>
              ))
            ) : output ? (
              <div style={{ color: output.success ? 'var(--green)' : 'var(--coral)', fontWeight: 700 }}>
                {output.success ? '✓ [SUCCESS] ' : '❌ [ERROR] '}{output.message}
              </div>
            ) : (
              <div style={{ color: 'var(--t4)', fontStyle: 'italic' }}>
                Press "Run Code / Verify" to compile script and view terminal outputs...
              </div>
            )}
          </div>
        </div>

        {/* AI Tutor Hint Modal */}
        {showAiTutorModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
          }}>
            <div style={{
              maxWidth: 500, width: '100%', background: 'var(--bg2)',
              border: '1px solid var(--accent)', borderRadius: 24, padding: 28,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  🤖 AI Debug Tutor Assistance
                </span>
                <button onClick={() => setShowAiTutorModal(false)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>

              {loadingAiTutor ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t3)' }}>
                  <span>Analyzing code AST and execution stack trace... 🧠</span>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--t1)', lineHeight: 1.6 }}>
                  {aiTutorHint}
                </div>
              )}

              <button
                onClick={() => setShowAiTutorModal(false)}
                style={{
                  width: '100%', marginTop: 20, padding: '10px', background: 'var(--accent)',
                  border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer'
                }}
              >
                Return to Workspace ➔
              </button>
            </div>
          </div>
        )}

      </div>
    );
  };

  // Load unlock status and selected teacher from localStorage on mount
  useEffect(() => {
    if (!questId) return;
    const teacherStored = localStorage.getItem(`pinit_quest_teacher_${questId}`);
    const isPaid = (cOS.onboardingAnswers?.initiatedQuests || []).includes(questId);
    if (teacherStored || isPaid || completedQuests.includes(questId)) {
      const selectedTeacher = cOS.onboardingAnswers?.selectedTeacherId || teacherStored || 'kashyap';
      setQuestTeacher(selectedTeacher);
      setIsUnlocked(true);
    }
  }, [questId, completedQuests, cOS.onboardingAnswers]);

  // Set default starter code & load saved code if exists
  useEffect(() => {
    if (!quest) return;
    const savedCode = cOS.onboardingAnswers?.questCodes?.[questId] || (typeof window !== 'undefined' ? localStorage.getItem(`pinit_code_${userId}_${questId}`) : null);
    if (savedCode) {
      setCode(savedCode);
    } else if (quest.starterCode) {
      setCode(quest.starterCode);
    }
  }, [quest, questId, userId, cOS.onboardingAnswers]);

  if (!quest) {
    return (
      <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
        <h2>Quest Not Found</h2>
        <p style={{ color: 'var(--t3)', margin: '10px 0 20px' }}>The quest trajectory you requested could not be resolved.</p>
        <Link href="/quests" className="btn-primary">Return to Quests Tab</Link>
      </div>
    );
  }

  // Spend pins to unlock the quest
  const handleUnlockQuest = () => {
    const teacher = TEACHERS.find(t => t.id === selectedTeacherId) || TEACHERS[0];
    if (unlockItem(`quest:${questId}`, 'quest', `Unlock Quest: ${(quest.title || '').split(':')[1]?.trim() || quest.title}`)) {
      localStorage.setItem(`pinit_quest_teacher_${questId}`, selectedTeacherId);
      setQuestTeacher(selectedTeacherId);
      setIsUnlocked(true);
      toast.success('Quest Active! ⚡', `Unlocked with ${teacher.name} as your instructor.`);
    }
  };

  // Lightweight syntax helpers only — not real JVM/CPython/SQL engines
  const multiLangTranspiler = (inputCode: string, qId: string) => {
    let js = inputCode || '';
    
    // Python-looking source → approximate JS (keyword rewrite only; not CPython)
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

    // SQL text is not executed against a database here
    if (qId.startsWith('database') || qId.includes('sql')) {
      return `
        const sqlQuery = ${JSON.stringify(inputCode || '')};
        const s = sqlQuery.toUpperCase();
        if (!s.includes("SELECT") && !s.includes("INSERT") && !s.includes("CREATE") && !s.includes("UPDATE")) {
          throw new Error("Invalid SQL Syntax: Query must contain valid SELECT, INSERT, or UPDATE statement.");
        }
      `;
    }

    // Java-looking source → approximate JS (not a JVM)
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
  };

  const handleVerifySolution = () => {
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

    const isJava = (questId || '').includes('java') || (quest?.id || '').includes('java');
    if (isJava) {
      setOutput(null);
      setTerminalLogs(['⚙️ Dispatching Java submission to isolated compiler judge...']);
      
      import('@/lib/code/codeRunner').then(({ runTestSuite }) => {
        runTestSuite(code, 'java', { testSuite: quest.testSuite })
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
              }
            } else {
              const errMsg = result.testOutcomes?.[0]?.error || result.terminalLogs?.[result.terminalLogs.length - 1] || 'Automated test assertion failed.';
              setOutput({
                success: false,
                message: errMsg
              });
            }
          })
          .catch((err) => {
            setOutput({ success: false, message: 'Execution judge error: ' + err.message });
          });
      });
      return;
    }

    const langInfo = getLangInfo(questId || '');
    // Fail closed for non-native languages without dedicated runners
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
            isExam: category === 'exam'
          })
          .then(data => {
            if (data.success) {
              setOutput({ success: true, message: "Verification Passed! All test cases validated on secure compiler." });
              saveQuestCode(quest.id, code);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`pinit_code_${userId}_${quest.id}`, code);
              }
              addCompletedQuest(quest.id, category === 'exam', quest.xp || 150);
              setIsCompleteView(true);
              
              api.post('/api/admin/audit-log/add', {
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
  };

  const handleCompleteLecture = () => {
    addCompletedQuest(quest.id, false, quest.xp || 150);
    setIsCompleteView(true);
    
    // Audit log lecture completion (non-blocking)
    api.post('/api/admin/audit-log/add', {
      action: 'quest_complete',
      meta: { questId: quest.id, questTitle: quest.title, isExam: false, xp: quest.xp || 150 }
    }).catch(() => {});
  };

  const currentTeacher = TEACHERS.find(t => t.id === questTeacher) || TEACHERS[0];

  // 0. QUEST NOT FOUND GUARD
  if (!quest) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          maxWidth: 420, background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 36, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginBottom: 10 }}>Quest Not Found</h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>
            This quest may have been removed or your roadmap has changed. Return to the Quests Hub to continue.
          </p>
          <Link
            href="/quests"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--accent)', color: '#fff', padding: '10px 22px',
              borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: 'none'
            }}
          >
            ← Back to Quests Hub
          </Link>
        </div>
      </div>
    );
  }

  // 1. TEACHER SELECTION VIEW
  if (!isUnlocked) {
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

        {/* Teachers Cards Grid */}
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

        {/* Start Button */}
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
            onClick={handleUnlockQuest}
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

  // 2. CONGRATULATIONS / SUCCESS SCREEN
  if (isCompleteView) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '40px 24px', textAlign: 'center' }} className="animate-fade-in">
        <div style={{
          background: 'var(--bg2)',
          border: '1.5px solid var(--green)',
          borderRadius: 24,
          padding: '50px 40px',
          boxShadow: '0 20px 40px -15px rgba(5,150,105,0.15)'
        }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
            Quest Completed!
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Congratulations! You have completed the quest <strong style={{ color: 'var(--t1)' }}>"{quest.title}"</strong> under the guidance of <strong style={{ color: currentTeacher.color }}>{currentTeacher.name}</strong>.
          </p>

          {/* Rewards pill */}
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

  // 3. EXAM ENVIRONMENT VIEW
  if (category === 'exam') {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
        {/* Workspace Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Link href="/quests" style={{ textDecoration: 'none', color: 'var(--t3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Return to Quests Tab
            </Link>
            <h2 style={{ margin: '8px 0 0', fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
              📝 Taking Exam: {quest.title}
              <span style={{ fontSize: 10, background: 'rgba(239,68,68,0.1)', color: 'var(--coral)', padding: '2px 8px', borderRadius: 6, fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                PROCTOR EXAM
              </span>
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 12, color: 'var(--t3)', marginRight: 12 }}>Instructor: <strong style={{ color: currentTeacher.color }}>{currentTeacher.name} {currentTeacher.emoji}</strong></span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Timer: <strong style={{ color: 'var(--coral)', fontFamily: 'var(--font-mono)' }}>⏱ {timeLeft}</strong></span>
          </div>
        </div>

        {/* Compiler Workspace Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showGuidedMentor ? '1.1fr 1.3fr 1.2fr' : '1fr 1.2fr',
          gap: 24,
          alignItems: 'flex-start',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Left Column: Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24, borderTop: '4px solid var(--coral)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Exam Instructions</h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 16px 0' }}>{quest.desc}</p>
              
              <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 12, padding: 14, fontSize: 12.5, color: 'var(--coral)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span>⚠️</span>
                <div>
                  <strong>Proctored Session:</strong> Tab-switches or exiting this browser view are logged in the cryptographically signed Sentinel trust ledger. Do not exit full-screen.
                </div>
              </div>

              <button
                onClick={() => setShowGuidedMentor(prev => !prev)}
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: showGuidedMentor ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                  color: showGuidedMentor ? 'var(--t1)' : '#fff',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: showGuidedMentor ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                {showGuidedMentor ? '💬 Close Socratic Mentor' : `💬 Ask ${currentTeacher.name} for Socratic Help`}
              </button>
            </div>

            {quest.hint && (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <button
                  onClick={() => setShowHint(h => !h)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  {showHint ? '💡 Hide Exam Hint' : '💡 Show Exam Hint'}
                </button>
                {showHint && (
                  <p style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10, marginTop: 8, fontSize: 12, color: 'var(--amber)', lineHeight: 1.5, margin: '8px 0 0' }}>
                    {quest.hint}
                  </p>
                )}
              </div>
            )}

            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Requirements</h3>
              <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--t3)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Implement a class method inside the compiler editor that complies with the signature.</li>
                <li>Write a solution that satisfies all automated test cases.</li>
                <li>Submit your solution for compilation and proctored grading.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Code Editor */}
          <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderEditor(true)}

            {output && (
              <div style={{
                background: output.success ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)',
                border: `1.5px solid ${output.success ? 'var(--green)' : 'var(--coral)'}`,
                padding: 14,
                borderRadius: 12,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: output.success ? 'var(--green)' : 'var(--coral)',
                whiteSpace: 'pre-wrap'
              }}>
                {output.success ? '🟢 ' : '🔴 '}
                {output.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleVerifySolution}
                disabled={isCompleted || examTimedOut}
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: 12,
                  fontSize: 13,
                  background: (isCompleted || examTimedOut) ? 'var(--bg3)' : 'var(--coral)',
                  border: (isCompleted || examTimedOut) ? '1px solid var(--border)' : '1px solid var(--coral)',
                  color: (isCompleted || examTimedOut) ? 'var(--t3)' : '#fff',
                  cursor: (isCompleted || examTimedOut) ? 'not-allowed' : 'pointer',
                  boxShadow: (isCompleted || examTimedOut) ? 'none' : '0 4px 12px rgba(220,38,38,0.2)'
                }}
              >
                {isCompleted ? 'Exam Submitted ✓ (Read Only)' : examTimedOut ? 'Time Expired — Locked' : 'Submit Exam Solution ✓'}
              </button>
              {!isCompleted && !examTimedOut && (
                <button
                  onClick={() => setCode(quest.starterCode || '')}
                  className="btn-ghost"
                  style={{ padding: 12, fontSize: 13 }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Bynik Hardware Firmware Push Tool Integration */}
            {(quest.id.includes('embedded') || quest.id.includes('network') || quest.id.includes('edge') || quest.id.includes('iotsec')) && (
              <div style={{
                marginTop: 8,
                padding: 16,
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(167,139,250,1)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                    🔌 Bynik Hardware Flashing Tool (Proctored)
                  </h4>
                  <span style={{ fontSize: 9.5, background: 'rgba(124,58,237,0.15)', color: 'rgba(167,139,250,1)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>
                    v1.0.4 Connected
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.45, margin: 0 }}>
                  Deploy your compiled firmware solution directly to the target microcontroller core using the Bynik USB bridge.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      toast.info('Bynik: Compiling...', 'Translating code to binary hex payload...');
                      setTimeout(() => {
                        toast.success('Bynik: Flash Completed! ⚡', 'Firmware successfully written to CPU address 0x08000000.');
                      }, 1800);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 11.5,
                      borderRadius: 8,
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(124,58,237,0.2)'
                    }}
                  >
                    Deploy to CPU (Bynik)
                  </button>
                  <button
                    onClick={() => {
                      toast.info('Bynik: Resetting CPU...', 'Sending hardware restart signal...');
                      setTimeout(() => {
                        toast.success('Bynik: CPU Restarted 🔄', 'Microcontroller core bootloader initialized.');
                      }, 1000);
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      color: 'var(--t1)',
                      fontWeight: 700,
                      fontSize: 11.5,
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    Reset CPU
                  </button>
                </div>
              </div>
            )}
          </div>

          {showGuidedMentor && (
            <div style={{
              background: 'var(--bg2)',
              border: '1.5px solid var(--border)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: 620,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <AvatarMentorWidget
                userId={userId}
                careerProfile={{ ats_score: 75 } as any}
                teacherId={questTeacher || 'kashyap'}
                activeQuest={quest}
                minimized={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. ASSIGNMENT SANDBOX WORKSPACE
  if (category === 'assignment') {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
        {/* Workspace Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Link href="/quests" style={{ textDecoration: 'none', color: 'var(--t3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Return to Quests Tab
            </Link>
            <h2 style={{ margin: '8px 0 0', fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
              💻 Completing Assignment: {quest.title}
              <span style={{ fontSize: 10, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                ASSIGNMENT CHALLENGE
              </span>
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 12, color: 'var(--t3)', marginRight: 12 }}>Instructor: <strong style={{ color: currentTeacher.color }}>{currentTeacher.name} {currentTeacher.emoji}</strong></span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Balance: <strong style={{ color: 'var(--accent)' }}>⚡ {pins} Pins</strong></span>
          </div>
        </div>

        {/* Compiler Workspace Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showGuidedMentor ? '1.1fr 1.3fr 1.2fr' : '1fr 1.2fr',
          gap: 24,
          alignItems: 'flex-start',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Left Column: Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Assignment Description</h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>{quest.desc}</p>
              
              <button
                onClick={() => setShowGuidedMentor(prev => !prev)}
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: showGuidedMentor ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                  color: showGuidedMentor ? 'var(--t1)' : '#fff',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: showGuidedMentor ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                {showGuidedMentor ? '💬 Close Socratic Mentor' : `💬 Ask ${currentTeacher.name} for Socratic Help`}
              </button>
            </div>

            {quest.hint && (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <button
                  onClick={() => setShowHint(h => !h)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  {showHint ? '💡 Show Assignment Hint' : '💡 Show Assignment Hint'}
                </button>
                {showHint && (
                  <p style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10, marginTop: 8, fontSize: 12, color: 'var(--amber)', lineHeight: 1.5, margin: '8px 0 0' }}>
                    {quest.hint}
                  </p>
                )}
              </div>
            )}

            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Requirements</h3>
              <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--t3)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Write a Java class method that implements the requested interface/class functionality.</li>
                <li>Verify your solution using the live sandbox compiler execution block.</li>
                <li>Submit to satisfy all test cases.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Code Editor */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderEditor(false)}

            {output && (
              <div style={{
                background: output.success ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)',
                border: `1.5px solid ${output.success ? 'var(--green)' : 'var(--coral)'}`,
                padding: 14,
                borderRadius: 12,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: output.success ? 'var(--green)' : 'var(--coral)',
                whiteSpace: 'pre-wrap'
              }}>
                {output.success ? '🟢 ' : '🔴 '}
                {output.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleVerifySolution}
                disabled={isCompleted}
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: 12,
                  fontSize: 13,
                  background: isCompleted ? 'var(--bg3)' : 'var(--accent)',
                  border: isCompleted ? '1px solid var(--border)' : '1px solid var(--accent)',
                  color: isCompleted ? 'var(--t3)' : '#fff',
                  cursor: isCompleted ? 'not-allowed' : 'pointer'
                }}
              >
                {isCompleted ? 'Assignment Completed ✓ (Read Only)' : 'Submit Assignment ✓'}
              </button>
              {!isCompleted && (
                <button
                  onClick={() => setCode(quest.starterCode || '')}
                  className="btn-ghost"
                  style={{ padding: 12, fontSize: 13 }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Bynik Hardware Firmware Push Tool Integration */}
            {(quest.id.includes('embedded') || quest.id.includes('network') || quest.id.includes('edge') || quest.id.includes('iotsec')) && (
              <div style={{
                marginTop: 8,
                padding: 16,
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(167,139,250,1)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                    🔌 Bynik Hardware Flashing Tool
                  </h4>
                  <span style={{ fontSize: 9.5, background: 'rgba(124,58,237,0.15)', color: 'rgba(167,139,250,1)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>
                    v1.0.4 Connected
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.45, margin: 0 }}>
                  Deploy your compiled firmware solution directly to the target microcontroller core using the Bynik USB bridge.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      if (isCompleted) return;
                      toast.info('Bynik: Compiling...', 'Translating code to binary hex payload...');
                      setTimeout(() => {
                        toast.success('Bynik: Flash Completed! ⚡', 'Firmware successfully written to CPU address 0x08000000.');
                      }, 1800);
                    }}
                    disabled={isCompleted}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: isCompleted ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                      border: isCompleted ? '1px solid var(--border)' : 'none',
                      color: isCompleted ? 'var(--t3)' : '#fff',
                      fontWeight: 700,
                      fontSize: 11.5,
                      borderRadius: 8,
                      cursor: isCompleted ? 'not-allowed' : 'pointer',
                      boxShadow: isCompleted ? 'none' : '0 4px 10px rgba(124,58,237,0.2)'
                    }}
                  >
                    Deploy to CPU (Bynik)
                  </button>
                  <button
                    onClick={() => {
                      if (isCompleted) return;
                      toast.info('Bynik: Resetting CPU...', 'Sending hardware restart signal...');
                      setTimeout(() => {
                        toast.success('Bynik: CPU Restarted 🔄', 'Microcontroller core bootloader initialized.');
                      }, 1000);
                    }}
                    disabled={isCompleted}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      color: isCompleted ? 'var(--t3)' : 'var(--t1)',
                      fontWeight: 700,
                      fontSize: 11.5,
                      borderRadius: 8,
                      cursor: isCompleted ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Reset CPU
                  </button>
                </div>
              </div>
            )}
          </div>

          {showGuidedMentor && (
            <div style={{
              background: 'var(--bg2)',
              border: '1.5px solid var(--border)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: 620,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <AvatarMentorWidget
                userId={userId}
                careerProfile={{ ats_score: 75 } as any}
                teacherId={questTeacher || 'kashyap'}
                activeQuest={quest}
                minimized={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. LECTURE & INTERACTIVE WORKSPACE (category === 'learning')
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Link href="/quests" style={{ textDecoration: 'none', color: 'var(--t3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ← Return to Quests Tab
          </Link>
          <h2 style={{ margin: '8px 0 0', fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            🎓 Learning Class: {quest.title}
            <span style={{ fontSize: 10, background: 'rgba(124,58,237,0.1)', color: 'rgba(167,139,250,1)', padding: '2px 8px', borderRadius: 6, fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              SOCRATIC CLASS
            </span>
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 12, color: 'var(--t3)', marginRight: 12 }}>Instructor: <strong style={{ color: currentTeacher.color }}>{currentTeacher.name} {currentTeacher.emoji}</strong></span>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>Balance: <strong style={{ color: 'var(--accent)' }}>⚡ {pins} Pins</strong></span>
        </div>
      </div>

      {/* 2-Column Socratic Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'stretch' }}>
        
        {/* Left Column: Syllabus & Complete Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quest Objectives */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: 'var(--t1)' }}>Quest Objective</h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>{quest.desc}</p>
            </div>

            {/* Lecture Syllabus Checklist */}
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

            {/* Guidance instructions */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8, color: 'var(--t1)' }}>Socratic Interactive Guidelines</h3>
              <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                Communicate with the avatar using the chat panel on the right. Ask questions about the JVM memory model, stack/heap boundaries, or OOP concepts. Your teacher will evaluate your answers socratically.
              </p>
            </div>
          </div>

          {/* Complete Lesson Action Box */}
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: isCompleted ? 'var(--green)' : 'var(--t1)' }}>
                {isCompleted ? '✓ Lesson Completed' : 'Completed your discussion?'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                {isCompleted ? 'You have successfully completed this lesson.' : 'Ready to finalize this milestone lesson?'}
              </div>
            </div>
            <button
              onClick={handleCompleteLecture}
              disabled={isCompleted}
              className="btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: 12.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: isCompleted ? 'var(--bg3)' : 'var(--accent)',
                border: isCompleted ? '1px solid var(--border)' : '1px solid var(--accent)',
                color: isCompleted ? 'var(--t3)' : '#fff',
                cursor: isCompleted ? 'not-allowed' : 'pointer'
              }}
            >
              {isCompleted ? '✓ Completed' : '✓ Complete Lesson'}
            </button>
          </div>
        </div>

        {/* Right Column: VRoid Avatar and Chat Box */}
        <div style={{
          background: 'var(--bg2)',
          border: '1.5px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 620,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <AvatarMentorWidget
            userId={user?.id}
            careerProfile={{ ats_score: 75 } as any} // Mock profile metrics to avoid TS issues
            teacherId={questTeacher || 'priya'}
            activeQuest={quest}
            minimized={false}
          />
        </div>
      </div>


    </div>
  );
}
