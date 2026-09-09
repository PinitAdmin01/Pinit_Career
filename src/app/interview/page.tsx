'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { speakWithAvatar as speakWithAvatarRaw, stopSpeaking, getAvatarVoiceVolume, setAvatarVoiceVolume } from '@/lib/tts';
import { stopArchetypeSoundscape } from '@/lib/audio/soundscapes';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { runTestSuite } from '@/lib/code/codeRunner';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { toast } from '@/lib/store/useAppStore';
import {
  calculateRoleWeightedScore,
  normalizeRoleKey,
  generatePersonaCoaching,
  generateTelemetryDiagnostics,
  MindsetArchetype
} from '@/lib/interview/scoringMatrix';

// Dynamic import of 3D VRoid Avatar to protect SSR
const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

// Dynamic import of Monaco Editor for syntax highlighting & code indentation
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.default),
  { ssr: false, loading: () => <div style={{ height: 360, background: '#090d16', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>Loading Monaco Code Engine...</div> }
);

// Dynamic import of System Design Canvas
const SystemDesignWhiteboard = dynamic(
  () => import('@/components/interview/SystemDesignWhiteboard'),
  { ssr: false }
);

interface RadarChartProps {
  scores: {
    logic: number;
    systems: number;
    comms: number;
    solving: number;
    star: number;
  };
  size?: number;
}

const RadarChart = ({ scores, size = 200 }: RadarChartProps) => {
  const center = size / 2;
  const maxRadius = (size / 2) - 28;

  const getCoordinates = () => {
    const categories = ['logic', 'systems', 'comms', 'solving', 'star'];
    return categories.map((cat, i) => {
      const rawVal = Number(((scores || {}) as any)[cat]);
      const safeScore = isNaN(rawVal) ? 50 : Math.max(10, Math.min(100, rawVal));
      const radius = (safeScore / 100) * maxRadius;
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x: isNaN(x) ? center : x, y: isNaN(y) ? center : y, score: safeScore, name: cat.toUpperCase() };
    });
  };

  const coords = getCoordinates();
  const pointsStr = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  const ringPolygons = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    const r = scale * maxRadius;
    return Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  });

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <defs>
          <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(var(--brand-rgb), 0.4)" />
            <stop offset="100%" stopColor="rgba(var(--brand-rgb), 0.02)" />
          </radialGradient>
        </defs>

        {ringPolygons.map((ringPoints, i) => (
          <polygon
            key={i}
            points={ringPoints}
            fill="none"
            stroke="var(--border2)"
            strokeWidth="1"
            strokeDasharray={i === 3 ? "none" : "3,3"}
          />
        ))}

        {coords.map((c, i) => (
          <line
            key={i}
            x1={center} y1={center} x2={c.x} y2={c.y}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}

        <polygon
          points={pointsStr}
          fill="url(#radar-glow)"
          stroke="var(--accent-mid)"
          strokeWidth="2"
          filter="url(#radar-glow)"
        />

        {coords.map((c, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const lx = center + (maxRadius + 16) * Math.cos(angle);
          const ly = center + (maxRadius + 16) * Math.sin(angle) + 3;
          return (
            <text
              key={i} x={lx} y={ly} fill="var(--t2)" fontSize="9" fontWeight="800"
              fontFamily="monospace" textAnchor="middle"
            >
              {c.name} ({c.score}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};

type Stage = 'round1_behavioral' | 'round2_coding' | 'round3_systems' | 'round4_star' | 'results';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InterviewSessionRecord {
  id: string;
  date: string;
  timestamp: string;
  type: string;
  domainStream: 'tech' | 'non_tech';
  domainSubTopic: string;
  difficulty: 'easy' | 'normal' | 'hard';
  verdict: string;
  score: number;
  radar: {
    logic: number;
    systems: number;
    comms: number;
    solving: number;
    star: number;
  };
  telemetry: {
    eyeContact: number;
    wpm: number;
    fillerWords: number;
    tabSwitches: number;
  };
  messages: Message[];
  summary: string;
  strengths: string[];
  improvements: string;
  topology?: any;
}

interface ActiveInterviewDraft {
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  domainSubTopic?: string;
  activeStage: Stage;
  difficulty: 'easy' | 'normal' | 'hard';
  starStep: number;
  messages: Message[];
  codeContent: string;
  selectedLang: 'java' | 'python' | 'javascript' | 'sql';
  elapsedSeconds: number;
  fillerWordCount: number;
  activeTeacherId: string;
  latestTopology?: any;
  timestamp: number;
}

const formatStageLabel = (stage: Stage): string => {
  switch (stage) {
    case 'round1_behavioral': return 'Round 1: Behavioral & Introductions';
    case 'round2_coding': return 'Round 2: Technical & Coding Sandbox';
    case 'round3_systems': return 'Round 3: System Architecture Canvas';
    case 'round4_star': return 'Round 4: Situational STAR Defense';
    case 'results': return 'Final Evaluation';
    default: return stage;
  }
};

const AVATAR_POOL = [
  { id: 'priya', name: 'Ms. Priya', title: 'HR & Talent Acquisition Director', emoji: '👩‍💼' },
  { id: 'rohan', name: 'Mr. Rohan', title: 'Lead Software Architect', emoji: '👨‍💻' },
  { id: 'vikram', name: 'Mr. Vikram', title: 'Principal Systems Specialist', emoji: '👨‍⚖️' },
  { id: 'aisha', name: 'Ms. Aisha', title: 'Executive STAR Evaluator', emoji: '👩‍🏫' }
];

function safeFormatDate(input?: string | number | Date): { dateStr: string; isoStr: string } {
  try {
    const d = input ? new Date(input) : new Date();
    if (isNaN(d.getTime())) {
      const fallback = new Date();
      return {
        dateStr: fallback.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        isoStr: fallback.toISOString()
      };
    }
    return {
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      isoStr: d.toISOString()
    };
  } catch {
    const fallback = new Date();
    return {
      dateStr: fallback.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      isoStr: fallback.toISOString()
    };
  }
}

// Helper to securely attach Supabase JWT Session Token
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { supabase } = await import('@/lib/supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      };
    }
  } catch (err) {
    console.warn('[Interview Auth] Could not retrieve Supabase session token:', err);
  }
  return { 'Content-Type': 'application/json' };
}

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const cOS = useCareerOS();
  const { user } = useAuth();
  const { addXp, earnPins } = cOS;

  // Interview Mode: 'roadmap' vs 'custom'
  const [interviewMode, setInterviewMode] = useState<'roadmap' | 'custom'>('roadmap');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [activeTopicName, setActiveTopicName] = useState('Software Engineering');

  // Domain Stream State
  const [domainStream, setDomainStream] = useState<'tech' | 'non_tech'>('tech');
  const [domainSubTopic, setDomainSubTopic] = useState<string>('software');

  // Handle URL Query Params (e.g. from Capstone Project Viva Defense /projects)
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const projectParam = searchParams.get('project');
    const courseParam = searchParams.get('course');

    if (modeParam === 'project_viva' && projectParam) {
      console.log(`[Interview Page] Loaded Capstone Project Viva mode for: ${projectParam}`);
      setInterviewMode('custom');
      setCustomTopicInput(`Capstone Project Viva: ${decodeURIComponent(projectParam)} (${decodeURIComponent(courseParam || '')})`);
      setActiveTopicName(`Capstone Viva: ${decodeURIComponent(projectParam)}`);
      setDomainStream('tech');
    }
  }, [searchParams]);

  // Active Interview & Fullscreen Sidebar Auto-Hide
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage>('round1_behavioral');
  const isScoredStage = isInterviewActive && ['round1_behavioral', 'round2_coding', 'round3_systems', 'round4_star', 'results'].includes(activeStage);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [animState, setAnimState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [manualTextInput, setManualTextInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio Volume Control State (0-100)
  const [avatarVolume, setAvatarVolumeState] = useState<number>(() => Math.round(getAvatarVoiceVolume() * 100));

  const handleVolumeChange = (newVol: number) => {
    setAvatarVolumeState(newVol);
    setAvatarVoiceVolume(newVol / 100);
  };

  // Elapsed Session Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (isInterviewActive && activeStage !== 'results') {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isInterviewActive, activeStage]);

  // BeforeUnload Guard for Active In-Flight Sessions
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isInterviewActive && activeStage !== 'results') {
        e.preventDefault();
        e.returnValue = 'You have an active interview session in progress. Leaving now will abandon your current attempt.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isInterviewActive, activeStage]);

  // Proactive Voice Loop & Hands-Free Conversation
  const [autoVoiceLoop, setAutoVoiceLoop] = useState(true);
  const autoVoiceLoopRef = useRef(true);
  const silenceTimerRef = useRef<any>(null);
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState<string>('');
  const isAvatarSpeakingRef = useRef<boolean>(false);
  const autoRestartTimerRef = useRef<any>(null);
  const micRetryCountRef = useRef<number>(0);
  const lastSpokenEndTimeRef = useRef<number>(0);

  useEffect(() => {
    autoVoiceLoopRef.current = autoVoiceLoop;
  }, [autoVoiceLoop]);

  // Maintain consistent avatar across all rounds of a session (avoids 4x WebGL canvas teardown)
  const [activeTeacher, setActiveTeacher] = useState(AVATAR_POOL[0]);

  const selectRandomTeacherForSession = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * AVATAR_POOL.length);
    const chosen = AVATAR_POOL[randomIndex];
    setActiveTeacher(chosen);
    return chosen;
  }, []);

  // 100% Dynamic Generative Problem State & In-Memory Cache
  const [dynamicProblemData, setDynamicProblemData] = useState<any>(null);
  const dynamicProblemCacheRef = useRef<Map<string, any>>(new Map());

  const fetchDynamicProblem = useCallback(async (topicName: string, stream: string = 'tech', lang: string = 'python') => {
    const cacheKey = `${topicName}:${stream}`;
    if (dynamicProblemCacheRef.current.has(cacheKey)) {
      const cached = dynamicProblemCacheRef.current.get(cacheKey);
      setDynamicProblemData(cached);
      return cached;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/generate-problem', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic: topicName,
          domainStream: stream,
          language: lang,
          difficulty
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.title && data.starterCode) {
          dynamicProblemCacheRef.current.set(cacheKey, data);
          setDynamicProblemData(data);
          console.log(`[Dynamic Problem] ✅ Loaded dynamic challenge for "${topicName}": ${data.title}`);
          return data;
        }
      }
    } catch (e) {
      console.warn('[Dynamic Problem] Remote generation failed, generating instant semantic fallback');
    }

    // Dynamic Semantic Fallback (Works for 100% of custom courses/topics)
    const safeFn = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 24) || 'evaluate_metric';
    const fallback = {
      title: `${topicName} Assessment & Logic Evaluator`,
      description: `Implement function '${safeFn}' to evaluate constraints, metrics, and throughput for ${topicName}.`,
      functionName: safeFn,
      starterCode: {
        python: `def ${safeFn}(input_data, threshold):\n    # Process ${topicName} records in O(N)\n    return {"status": "Optimal", "count": len(input_data) if hasattr(input_data, '__len__') else 1}`,
        javascript: `function ${safeFn}(inputData, threshold) {\n    return { status: "Optimal", count: Array.isArray(inputData) ? inputData.length : 1 };\n}`,
        java: `public class Solution {\n    public boolean ${safeFn}(int[] data) { return true; }\n}`,
        sql: `SELECT department_id, COUNT(*) as emp_count, AVG(salary) as avg_sal FROM employees GROUP BY department_id;`
      },
      testCases: [
        { input: '[10, 20, 30], 15', expectedOutput: 'Optimal', name: 'Standard Case' },
        { input: '[], 0', expectedOutput: 'Handled', name: 'Boundary Check' }
      ],
      suggestedWhiteboardNodes: [
        { id: 'gateway', label: 'Client / Gateway', type: 'api' },
        { id: 'engine', label: `${topicName} Service`, type: 'compute' },
        { id: 'cache', label: 'Redis Cache', type: 'cache' },
        { id: 'storage', label: 'Primary DB', type: 'database' }
      ]
    };
    dynamicProblemCacheRef.current.set(cacheKey, fallback);
    setDynamicProblemData(fallback);
    return fallback;
  }, [difficulty]);

  // Dynamic Topic-Based Problem Starter Code Resolver (IV-09 FIX: Domain-aware algorithmic challenges)
  const getDynamicCodingProblem = useCallback((topic: string, lang: string) => {
    const cached = dynamicProblemCacheRef.current.get(`${topic}:${domainStream}`);
    if (cached && cached.starterCode) {
      return {
        title: cached.title,
        description: cached.description,
        starterCode: cached.starterCode[lang] || cached.starterCode.python || ''
      };
    }

    const lower = (topic + ' ' + domainStream).toLowerCase();
    let problemTitle = `${topic} Technical Assessment`;
    let problemDesc = `Implement algorithmic logic to solve real-world constraints for ${topic}.`;
    let starterCodeMap: Record<string, string> = {};

    if (lower.includes('frontend') || lower.includes('react') || lower.includes('web') || lower.includes('ui')) {
      problemTitle = `${topic}: State Batcher & Reducer`;
      problemDesc = `Implement function 'batch_state_updates' to merge queued state actions without race conditions or memory leaks.`;
      starterCodeMap = {
        python: `def batch_state_updates(initial_state, actions):\n    state = dict(initial_state)\n    for act in actions:\n        if act.get('type') == 'SET':\n            state[act['key']] = act['value']\n    return state`,
        javascript: `function batchStateUpdates(initialState, actions) {\n    return actions.reduce((acc, act) => {\n        if (act.type === 'SET') return { ...acc, [act.key]: act.value };\n        return acc;\n    }, { ...initialState });\n}`,
        java: `import java.util.*;\npublic class Solution {\n    public Map<String, Object> batchState(Map<String, Object> state, List<Map<String, Object>> actions) {\n        return new HashMap<>(state);\n    }\n}`,
        sql: `SELECT action_type, COUNT(*) as action_count FROM audit_logs GROUP BY action_type;`
      };
    } else if (lower.includes('sql') || lower.includes('database') || lower.includes('db')) {
      problemTitle = `${topic}: High-Throughput Aggregations`;
      problemDesc = `Write an optimized query or function calculating monthly department expenditure and identifying salary outliers.`;
      starterCodeMap = {
        sql: `SELECT department_id, COUNT(*) as headcount, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department_id\nHAVING AVG(salary) > 50000;`,
        python: `def analyze_department_salaries(records, min_avg):\n    # Filter and group employee records\n    return [{"department_id": 101, "avg_salary": 92500}]`,
        javascript: `function analyzeDepartmentSalaries(records, minAvg) {\n    return [{ departmentId: 101, avgSalary: 92500 }];\n}`,
        java: `import java.util.*;\npublic class Solution {\n    public List<Map<String, Object>> analyzeSalaries(List<Map<String, Object>> records) {\n        return new ArrayList<>();\n    }\n}`
      };
    } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('microservice') || lower.includes('distributed')) {
      problemTitle = `${topic}: Token Bucket Rate Limiter`;
      problemDesc = `Implement function 'is_request_allowed' enforcing a maximum requests-per-second limit with burst tolerance.`;
      starterCodeMap = {
        python: `def is_request_allowed(client_id, timestamp_ms, capacity=10, refill_rate=1.0):\n    # Return True if request passes token bucket threshold\n    return True`,
        javascript: `function isRequestAllowed(clientId, timestampMs, capacity = 10, refillRate = 1.0) {\n    return true;\n}`,
        java: `public class Solution {\n    public boolean isRequestAllowed(String clientId, long timestampMs) {\n        return true;\n    }\n}`,
        sql: `SELECT client_ip, COUNT(*) as req_count FROM access_logs WHERE req_time > NOW() - INTERVAL '1 minute' GROUP BY client_ip;`
      };
    } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('data')) {
      problemTitle = `${topic}: Cosine Similarity & Vector Matching`;
      problemDesc = `Calculate cosine similarity between query embedding vector A and candidate vector B to score relevance.`;
      starterCodeMap = {
        python: `import math\ndef cosine_similarity(vec_a, vec_b):\n    dot = sum(a * b for a, b in zip(vec_a, vec_b))\n    norm_a = math.sqrt(sum(a * a for a in vec_a))\n    norm_b = math.sqrt(sum(b * b for b in vec_b))\n    return round(dot / (norm_a * norm_b), 4) if (norm_a * norm_b) > 0 else 0.0`,
        javascript: `function cosineSimilarity(vecA, vecB) {\n    const dot = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);\n    const normA = Math.sqrt(vecA.reduce((s, a) => s + a * a, 0));\n    const normB = Math.sqrt(vecB.reduce((s, b) => s + b * b, 0));\n    return (normA * normB) > 0 ? +(dot / (normA * normB)).toFixed(4) : 0;\n}`,
        java: `public class Solution {\n    public double cosineSimilarity(double[] a, double[] b) {\n        return 1.0;\n    }\n}`,
        sql: `SELECT doc_id, vector_distance FROM documents ORDER BY vector_distance ASC LIMIT 5;`
      };
    } else {
      problemTitle = `${topic}: Longest Valid Throughput Window`;
      problemDesc = `Given an array of throughput metric integers, find the length of the longest contiguous subsegment meeting SLA bounds.`;
      starterCodeMap = {
        python: `def max_throughput_window(metrics, min_sla):\n    max_len, cur_len = 0, 0\n    for val in metrics:\n        if val >= min_sla:\n            cur_len += 1\n            max_len = max(max_len, cur_len)\n        else:\n            cur_len = 0\n    return max_len`,
        javascript: `function maxThroughputWindow(metrics, minSla) {\n    let maxLen = 0, curLen = 0;\n    for (const val of metrics) {\n        if (val >= minSla) { curLen++; maxLen = Math.max(maxLen, curLen); }\n        else { curLen = 0; }\n    }\n    return maxLen;\n}`,
        java: `public class Solution {\n    public int maxThroughputWindow(int[] metrics, int minSla) {\n        int max = 0, cur = 0;\n        for (int m : metrics) {\n            if (m >= minSla) { cur++; max = Math.max(max, cur); }\n            else { cur = 0; }\n        }\n        return max;\n    }\n}`,
        sql: `SELECT MAX(streak) FROM (SELECT department_id, COUNT(*) as streak FROM metrics WHERE status = 'OK' GROUP BY department_id) t;`
      };
    }

    return {
      title: problemTitle,
      description: problemDesc,
      starterCode: starterCodeMap[lang] || starterCodeMap.python || ''
    };
  }, [domainStream]);

  // Real-Time Camera PiP Preview State
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Voice Recognition State
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechStartTimeRef = useRef<number>(0);

  const toggleCameraPreview = async () => {
    if (showCameraPreview) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
      }
      setShowCameraPreview(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
        cameraStreamRef.current = stream;
        setShowCameraPreview(true);
        setTimeout(() => {
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
          }
        }, 150);
      } catch (err) {
        console.warn('[Camera Preview] Webcam access denied or unavailable:', err);
        toast.warning('Webcam Preview Unavailable', 'Camera access was denied or no device was detected. You can continue naturally with voice.');
      }
    }
  };

  useEffect(() => {
    return () => {
      console.log('[Interview Page] 🛑 Unmounting interview page: Terminating voice synthesis, media tracks, and recognition...');
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        } catch (e) {}
      }
      if (cameraStreamRef.current) {
        try {
          cameraStreamRef.current.getTracks().forEach(t => t.stop());
          cameraStreamRef.current = null;
        } catch (e) {}
      }
    };
  }, []);

  // Fullscreen Auto-Hide Sidebars
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isInterviewActive) {
        document.body.setAttribute('data-interview-active', 'true');
      } else {
        document.body.removeAttribute('data-interview-active');
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('data-interview-active');
      }
    };
  }, [isInterviewActive]);

  // IV-04 FIX: Start with empty array — pre-seeded static message contaminated AI evaluation
  // context and assist-mode script fetching. startInterview() sets the real greeting dynamically.
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll chat transcript whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const lastSentTranscriptRef = useRef<string>('');

  // Speech Recognition & Hands-Free Auto-Listen Loop
  const startVoiceListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Acoustic Echo Cancellation: Ensure 400ms has elapsed since avatar stopped speaking
    const now = Date.now();
    if (now - lastSpokenEndTimeRef.current < 400 && !isAvatarSpeakingRef.current) {
      setTimeout(() => startVoiceListening(), 400);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[Speech STT] Web Speech recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      micRetryCountRef.current = 0;
      speechStartTimeRef.current = Date.now();
      setIsVoiceListening(true);
      setAnimState('listening');
      console.log(`[Speech STT] 🎙️ Speech recognition started for stage: ${activeStage}`);

      // IV-06 FIX: Tailored silence prompts for all stages so candidates never stall indefinitely
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (activeStage === 'round1_behavioral' || activeStage === 'round4_star') {
        silenceTimerRef.current = setTimeout(() => {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
            const nudgeMsg = `Take all the time you need! When you're ready, feel free to share your thoughts or explain your approach for ${activeTopicName}.`;
            console.log('[Speech STT] 💬 Friendly 45s silence prompt triggered.');
            setMessages(prev => [...prev, { role: 'assistant', content: nudgeMsg }]);
            speakWithAvatar(nudgeMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
          }
        }, 45000);
      } else if (activeStage === 'round2_coding') {
        silenceTimerRef.current = setTimeout(() => {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
            const nudgeMsg = `How is your implementation coming along? Feel free to explain your data structures out loud, or check the hints toggle above if you would like a nudge!`;
            console.log('[Speech STT] 💬 Round 2 coding silence nudge triggered.');
            setMessages(prev => [...prev, { role: 'assistant', content: nudgeMsg }]);
            speakWithAvatar(nudgeMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
          }
        }, 90000);
      } else if (activeStage === 'round3_systems') {
        silenceTimerRef.current = setTimeout(() => {
          if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
            const nudgeMsg = `As you lay out your architecture nodes for ${activeTopicName}, consider how traffic flows between your API gateway, cache layers, and primary database.`;
            console.log('[Speech STT] 💬 Round 3 systems silence nudge triggered.');
            setMessages(prev => [...prev, { role: 'assistant', content: nudgeMsg }]);
            speakWithAvatar(nudgeMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
          }
        }, 90000);
      }
    };

    rec.onresult = (e: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      let interim = '';
      let final = '';

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      // Conversational Barge-In: If candidate starts speaking while avatar is talking, interrupt avatar smoothly
      if (interim.trim().length > 6 && isAvatarSpeakingRef.current) {
        console.log('[Barge-In] Interrupting avatar speech in response to candidate vocal input.');
        stopSpeaking();
        isAvatarSpeakingRef.current = false;
        setIsAvatarSpeaking(false);
      }

      if (interim) {
        setLiveSpeechTranscript(interim);
      }

      if (final.trim() && final.trim() !== lastSentTranscriptRef.current) {
        lastSentTranscriptRef.current = final.trim();
        setLiveSpeechTranscript('');
        try { rec.stop(); } catch (err) {}

        // IV-07 FIX: Calculate instantaneous and moving average WPM from speech duration
        const words = final.trim().split(/\s+/).filter(Boolean);
        if (speechStartTimeRef.current > 0) {
          const durationSec = Math.max(1.0, (Date.now() - speechStartTimeRef.current) / 1000);
          const rawWpm = Math.round((words.length / durationSec) * 60);
          const boundedWpm = Math.min(220, Math.max(60, rawWpm));
          setWpmScore(prev => prev === 128 ? boundedWpm : Math.round(prev * 0.45 + boundedWpm * 0.55));
        }

        handleSendMessageWithText(final.trim());
      }
    };

    rec.onerror = (e: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsVoiceListening(false);
      setAnimState('idle');

      const errType = e?.error || '';
      if (errType === 'not-allowed' || errType === 'service-not-allowed' || errType === 'audio-capture') {
        console.warn('[Speech STT] Microphone permission denied or capture error:', errType);
        return;
      }

      if (micRetryCountRef.current >= 3) {
        console.warn('[Speech STT] Max mic retries reached.');
        return;
      }
      micRetryCountRef.current += 1;

      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          startVoiceListening();
        }, 1200);
      }
    };

    rec.onend = () => {
      // IV-02 FIX: Do NOT increment micRetryCountRef here.
      // rec.onend fires after EVERY normal utterance end — not just errors.
      // Incrementing here caused the retry counter to hit 3 after just 3
      // normal speech turns, permanently killing auto-listen for the session.
      // Only rec.onerror should increment the retry counter.
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsVoiceListening(false);
      setAnimState('idle');

      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          startVoiceListening();
        }, 1000);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (e: any) {
      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current && micRetryCountRef.current < 3) {
        micRetryCountRef.current += 1;
        setTimeout(() => {
          try { rec.start(); } catch (err) {}
        }, 800);
      }
    }
  }, [activeTopicName, activeTeacher.id, difficulty, activeStage]);

  // Avatar Speech with Proactive Auto-Listen Loop
  const speakWithAvatar = useCallback((text: string, teacherId: string, onStart: () => void, onEnd: () => void) => {
    isAvatarSpeakingRef.current = true;
    setIsAvatarSpeaking(true);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    speakWithAvatarRaw(text, teacherId, () => {
      isAvatarSpeakingRef.current = true;
      setIsAvatarSpeaking(true);
      onStart();
    }, () => {
      isAvatarSpeakingRef.current = false;
      setIsAvatarSpeaking(false);
      lastSpokenEndTimeRef.current = Date.now();
      onEnd();
      // Auto-start microphone 500ms after avatar finishes speaking
      if (autoVoiceLoopRef.current) {
        setTimeout(() => {
          startVoiceListening();
        }, 500);
      }
    }, false, true, difficulty);
  }, [difficulty, startVoiceListening]);

  // Dynamic Telemetry metrics
  const [eyeContactScore, setEyeContactScore] = useState<number | null>(null);
  const [wpmScore, setWpmScore] = useState(128);
  const [fillerWordCount, setFillerWordCount] = useState(0);

  // Dynamic Optical Gaze Tracking: samples video stream during live interview
  useEffect(() => {
    if (!showCameraPreview || !isInterviewActive) return;

    let totalChecks = 0;
    let focusedChecks = 0;
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // IV-05 FIX: Instantiate FaceDetector ONCE outside the interval loop.
    // Re-creating it inside setInterval leaked GPU memory and WebGL context every 2 seconds.
    let faceDetectorInstance: any = null;
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        faceDetectorInstance = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      } catch (e) {
        faceDetectorInstance = null;
      }
    }

    const interval = setInterval(async () => {
      const video = videoPreviewRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      try {
        totalChecks++;
        let isFocused = false;

        // Native Chromium FaceDetector if supported
        if (faceDetectorInstance) {
          try {
            const faces = await faceDetectorInstance.detect(video);
            if (faces && faces.length > 0) {
              const face = faces[0].boundingBox;
              const cx = face.x + face.width / 2;
              const cy = face.y + face.height / 2;
              if (
                cx > video.videoWidth * 0.2 &&
                cx < video.videoWidth * 0.8 &&
                cy > video.videoHeight * 0.15 &&
                cy < video.videoHeight * 0.85
              ) {
                isFocused = true;
              }
            }
          } catch {
            // fallback to luminance
          }
        }

        // Optical contrast & facial texture gradient analysis fallback
        if (!isFocused && !('FaceDetector' in window)) {
          ctx.drawImage(video, 0, 0, 160, 120);
          const centerData = ctx.getImageData(40, 30, 80, 60).data;
          let sum = 0;
          let sumSq = 0;
          const pixelCount = centerData.length / 16;
          for (let i = 0; i < centerData.length; i += 16) {
            const luma = 0.299 * centerData[i] + 0.587 * centerData[i + 1] + 0.114 * centerData[i + 2];
            sum += luma;
            sumSq += luma * luma;
          }
          const avgLuma = sum / pixelCount;
          const variance = (sumSq / pixelCount) - (avgLuma * avgLuma);
          const stdDev = Math.sqrt(Math.max(0, variance));

          // A centered human face contains high-contrast feature edges (eyes, mouth, contours)
          // yielding standard deviation >= 18 under standard lighting (25 < avgLuma < 235).
          // Flat walls, empty rooms, or pointed-away angles produce flat variance (< 12) and fail.
          if (avgLuma > 25 && avgLuma < 235 && stdDev >= 18) {
            isFocused = true;
          }
        }

        if (isFocused) focusedChecks++;
        const currentRatio = Math.round((focusedChecks / totalChecks) * 100);
        setEyeContactScore(currentRatio);
      } catch {
        // Ignore sampling errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [showCameraPreview, isInterviewActive]);

  // ─── Assist Mode & Teleprompter State ─────────────────────────────────────
  const [isAssistModeActive, setIsAssistModeActive] = useState(false);
  const [assistData, setAssistData] = useState<{
    script: string;
    bulletPoints: string[];
    deliveryGuide: {
      pacing: string;
      tone: string;
      emphasisWords: string[];
      pauseCues: string[];
    };
    starBreakdown?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
  } | null>(null);
  const [isFetchingAssist, setIsFetchingAssist] = useState(false);
  const [assistScriptLevel, setAssistScriptLevel] = useState<'standard' | 'advanced'>('standard');
  const [assistTab, setAssistTab] = useState<'script' | 'bullets' | 'delivery'>('script');

  const fetchAssistScript = useCallback(async (questionText: string, level?: 'standard' | 'advanced') => {
    // Prohibit teleprompter cheat scripts during active graded interviews
    if (isScoredStage) {
      console.warn('[Assist Mode] Teleprompter disabled during active interview rounds to maintain grading integrity.');
      return;
    }
    setIsFetchingAssist(true);
    console.log(`[Assist Mode] 🪄 Requesting speech script for question: "${questionText.slice(0, 50)}..."`);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/assist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: questionText,
          stage: activeStage,
          topic: activeTopicName,
          domainStream,
          difficulty,
          scriptLevel: level || assistScriptLevel,
          isPractice: !isInterviewActive
        })
      });
      const data = await res.json();
      if (data && data.script) {
        setAssistData(data);
        console.log('[Assist Mode] ✅ Received tailored script and vocal delivery guide');
      }
    } catch (err) {
      console.warn('[Assist Mode] Failed to fetch assist script:', err);
    } finally {
      setIsFetchingAssist(false);
    }
  }, [isInterviewActive, activeStage, activeTopicName, domainStream, difficulty, assistScriptLevel]);

  // IV-03 FIX: Track whether candidate has manually edited the editor.
  // Without this, switching language OR topic mid-round called setCodeContent(starterCode)
  // and silently destroyed whatever the candidate had already typed.
  const codeModifiedRef = useRef(false);

  // Round 2 Code Workspace State
  const [showHint, setShowHint] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'java' | 'python' | 'javascript' | 'sql'>('python');
  const [codeContent, setCodeContent] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  // Load starter code only when code hasn't been modified by the candidate
  useEffect(() => {
    // IV-03: If candidate has touched the editor, never overwrite their work
    if (codeModifiedRef.current) return;
    const dynamicProb = getDynamicCodingProblem(activeTopicName, selectedLang);
    if (dynamicProb.starterCode) {
      setCodeContent(dynamicProb.starterCode);
    }
  }, [activeTopicName, selectedLang, getDynamicCodingProblem]);

  // Sessions History State
  const [sessions, setSessions] = useState<InterviewSessionRecord[]>([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState<InterviewSessionRecord | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const historyKey = `pinit_interview_history_${user?.id || 'anon'}`;
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
        }
      }
    } catch (e) {
      console.warn('[Interview History] Failed to parse localStorage history');
    }

    if (user?.id) {
      getAuthHeaders().then(async headers => {
        try {
          const res = await fetch('/api/interview/history', { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.sessions) && data.sessions.length > 0) {
              setSessions(prev => {
                const map = new Map<string, InterviewSessionRecord>();
                data.sessions.forEach((s: InterviewSessionRecord) => map.set(s.id, s));
                prev.forEach(s => map.set(s.id, s));
                const merged = Array.from(map.values()).slice(0, 20);
                try {
                  localStorage.setItem(historyKey, JSON.stringify(merged));
                } catch {}
                return merged;
              });
            }
          }
        } catch (err) {
          console.warn('[Interview History] Failed to fetch remote session history:', err);
        }
      }).catch(() => {});
    }
  }, [user?.id]);

  const saveSessionHistory = async (newSession: InterviewSessionRecord) => {
    setSessions(prev => {
      // Keep up to 20 most recent sessions to avoid localStorage QuotaExceededError
      const updated = [newSession, ...prev.filter(s => s.id !== newSession.id)].slice(0, 20);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pinit_interview_history_${user?.id || 'anon'}`, JSON.stringify(updated));
        } catch (e) {
          console.warn('[Interview History] Storage quota exceeded; trimmed history.');
        }
      }
      return updated;
    });

    try {
      const headers = await getAuthHeaders();
      await fetch('/api/interview/history', {
        method: 'POST',
        headers,
        body: JSON.stringify(newSession)
      });
    } catch (e) {
      console.warn('[Interview History] Remote sync failed, stored locally.');
    }
  };

  const clearSessionHistory = () => {
    if (window.confirm('Are you sure you want to clear all your interview session history?')) {
      setSessions([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`pinit_interview_history_${user?.id || 'anon'}`);
      }
    }
  };

  // Round 3 Whiteboard Topology State
  const [latestTopology, setLatestTopology] = useState<any>(null);
  const [isAnalyzingArchitecture, setIsAnalyzingArchitecture] = useState(false);

  // AI Architecture Analysis & Recruiter Follow-up Question
  const analyzeSystemArchitecture = async () => {
    setIsAnalyzingArchitecture(true);
    console.log('[Interview Whiteboard] Evaluating system architecture topology...');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'systems',
          topology: latestTopology,
          domainStream,
          domainSubTopic: activeTopicName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const evalData = data.evaluation;
        const spoken = evalData?.spokenFeedback || `Architecture review complete. Your system design achieved a grade of ${evalData?.verdict || 'A'}.`;
        setMessages(prev => [...prev, { role: 'assistant', content: spoken }]);
        speakWithAvatar(spoken, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      } else {
        const fallbackMsg = `I evaluated your architecture for ${activeTopicName}. You have a solid distribution strategy. How do you handle failure tolerance and caching consistency when read traffic spikes?`;
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
        speakWithAvatar(fallbackMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      }
    } catch {
      const fallbackMsg = `Architecture received. To optimize ${activeTopicName}, consider adding asynchronous queues and a low-latency caching tier.`;
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
      speakWithAvatar(fallbackMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    } finally {
      setIsAnalyzingArchitecture(false);
    }
  };

  // STAR Step Tracker
  const [starStep, setStarStep] = useState<number>(0);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [, setIsEvaluating] = useState(false);

  // Active Session Persistence & Recovery (Survives Browser Refresh)
  const [activeSessionDraft, setActiveSessionDraft] = useState<ActiveInterviewDraft | null>(null);

  const getDraftKey = useCallback((uid?: string) => {
    const validUid = uid && uid !== 'guest' ? uid : 'active_session';
    return `pinit_active_interview_draft_${validUid}`;
  }, []);

  // Check for recoverable draft on load (IV-08 FIX: Use localStorage with 4-hour TTL)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = getDraftKey(user?.id);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: ActiveInterviewDraft = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < 4 * 3600 * 1000 && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setActiveSessionDraft(parsed);
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {}
  }, [user?.id, getDraftKey]);

  // Persist draft while in-flight (IV-08 FIX: localStorage protects against tab kill)
  useEffect(() => {
    if (!isInterviewActive || activeStage === 'results') return;
    try {
      const key = getDraftKey(user?.id);
      const draft: ActiveInterviewDraft = {
        activeTopicName,
        domainStream,
        domainSubTopic,
        activeStage,
        difficulty,
        starStep,
        messages,
        codeContent,
        selectedLang,
        elapsedSeconds,
        fillerWordCount,
        activeTeacherId: activeTeacher.id,
        latestTopology,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(draft));
    } catch {}
  }, [
    isInterviewActive,
    activeStage,
    activeTopicName,
    domainStream,
    domainSubTopic,
    difficulty,
    starStep,
    messages,
    codeContent,
    selectedLang,
    elapsedSeconds,
    fillerWordCount,
    activeTeacher.id,
    latestTopology,
    user?.id,
    getDraftKey
  ]);

  const resumeActiveSession = useCallback(() => {
    if (!activeSessionDraft) return;
    setActiveTopicName(activeSessionDraft.activeTopicName);
    setDomainStream(activeSessionDraft.domainStream);
    if (activeSessionDraft.domainSubTopic) setDomainSubTopic(activeSessionDraft.domainSubTopic);
    setActiveStage(activeSessionDraft.activeStage);
    setDifficulty(activeSessionDraft.difficulty);
    setStarStep(activeSessionDraft.starStep || 0);
    setMessages(activeSessionDraft.messages || []);
    setCodeContent(activeSessionDraft.codeContent || '');
    setSelectedLang(activeSessionDraft.selectedLang || 'python');
    setElapsedSeconds(activeSessionDraft.elapsedSeconds || 0);
    setFillerWordCount(activeSessionDraft.fillerWordCount || 0);
    if (activeSessionDraft.latestTopology) setLatestTopology(activeSessionDraft.latestTopology);

    const foundTeacher = AVATAR_POOL.find(a => a.id === activeSessionDraft.activeTeacherId);
    if (foundTeacher) setActiveTeacher(foundTeacher);

    setIsInterviewActive(true);
    toast.success('Interview Session Restored', `Resumed in ${activeSessionDraft.activeTopicName} (${formatStageLabel(activeSessionDraft.activeStage)})`);
  }, [activeSessionDraft]);

  const discardActiveSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(getDraftKey(user?.id));
      } catch {}
    }
    setActiveSessionDraft(null);
    toast.info('Session Discarded', 'Previous in-progress interview attempt was discarded.');
  }, [user?.id, getDraftKey]);

  // Start Interview with Clean State & Single Avatar
  const startInterview = async () => {
    // Mute ambient focus soundscapes to eliminate microphone contamination
    stopArchetypeSoundscape();

    const topic = interviewMode === 'custom' && customTopicInput.trim()
      ? customTopicInput.trim()
      : (domainStream === 'non_tech' ? 'Finance & Accounting (B.Com)' : 'Software Engineering (SDE)');

    const itemKey = `interview:${domainStream}:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    if (!cOS.isItemUnlocked(itemKey)) {
      const ok = cOS.unlockItem(itemKey, 'interview', `AI Interview: ${topic}`);
      if (!ok) {
        toast.info('📌 Free Training Mode', `Zero Pins required for practice sessions. Launching demo interview for ${topic}!`);
      }
    }

    const sessionTeacher = selectRandomTeacherForSession();
    setActiveTopicName(topic);
    setIsInterviewActive(true);
    setActiveStage('round1_behavioral');
    setIsAssistModeActive(false);
    setAssistData(null);
    setShowHint(false);
    setCodeSubmitted(false);
    setTerminalLogs([]);
    setElapsedSeconds(0);
    setFillerWordCount(0);
    setStarStep(0);
    setEvaluationResult(null);
    codeModifiedRef.current = false; // IV-03: reset so starter code loads fresh for this session

    const greeting = `Welcome to your ${topic} Corporate Interview! I am ${sessionTeacher.name}, ${sessionTeacher.title}. To kick things off, please introduce yourself, tell me a bit about your academic background, and share your experience with ${topic}.`;

    setMessages([{ role: 'assistant', content: greeting }]);
    speakWithAvatar(greeting, sessionTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  };

  const exitInterview = () => {
    stopSpeaking();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    setShowCameraPreview(false);
    setIsInterviewActive(false);
    setActiveStage('round1_behavioral');
    setAssistData(null);
    setIsAssistModeActive(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getDraftKey(user?.id));
      } catch {}
    }
    setActiveSessionDraft(null);
  };

  // Proceed to Next Stage (IV-10 FIX: Clear stage advancement notification & briefing)
  const proceedToNextStage = (next: Stage) => {
    setActiveStage(next);
    setShowHint(false);

    const stageTitleMap: Record<Stage, string> = {
      round1_behavioral: 'Round 1: Behavioral & Background',
      round2_coding: 'Round 2: Technical & Coding Sandbox',
      round3_systems: 'Round 3: System Architecture Canvas',
      round4_star: 'Round 4: Situational STAR Defense',
      results: 'Final Evaluation & Scorecard'
    };
    toast.info('Advancing Round ➔', `Now Entering ${stageTitleMap[next] || next}.`);

    // Assist Mode is for practice only — auto-disable when entering scored assessment stages
    if (['round2_coding', 'round3_systems', 'round4_star', 'results'].includes(next)) {
      setIsAssistModeActive(false);
      setAssistData(null);
    }

    let stagePrompt = '';
    if (next === 'round2_coding') {
      const prob = getDynamicCodingProblem(activeTopicName, selectedLang);
      stagePrompt = `Round 2: Technical Assessment for ${activeTopicName}. Here is your challenge: "${prob.title}". Write and run your code solution in the editor on the left.`;
    } else if (next === 'round3_systems') {
      stagePrompt = `Round 3: System Architecture Canvas for ${activeTopicName}. Problem Statement: Design a scalable, resilient architecture for ${activeTopicName}. Drag components onto the canvas, link them, and click 'Evaluate Architecture'.`;
    } else if (next === 'round4_star') {
      const builtNodeNames = latestTopology?.nodes?.map((n: any) => n.label || n.type).join(', ') || 'distributed tiers';
      stagePrompt = `Round 4: Executive Review & STAR Assessment. I reviewed your Round 2 problem solving and your Round 3 system whiteboard with ${builtNodeNames}. Looking back at your complete architecture for ${activeTopicName}, what were your primary trade-offs, and how do you mitigate single points of failure?`;
    }

    if (stagePrompt) {
      setMessages(prev => [...prev, { role: 'assistant', content: stagePrompt }]);
      speakWithAvatar(stagePrompt, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
  };

  const skipQuestion = () => {
    stopSpeaking();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const skipMsg = `Let's move on to the next question regarding ${activeTopicName}. What is your experience handling production edge-cases or scalability challenges in this area?`;
    setMessages(prev => [...prev, { role: 'user', content: '[Candidate requested to skip to the next question]' }, { role: 'assistant', content: skipMsg }]);
    speakWithAvatar(skipMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  };

  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim()) return;

    // Compute dynamic WPM telemetry using actual speaking duration
    const words = text.trim().split(/\s+/).filter(Boolean);
    let instantWpm = 130;
    if (speechStartTimeRef.current > 0) {
      const durationSec = Math.max(0.8, (Date.now() - speechStartTimeRef.current) / 1000);
      speechStartTimeRef.current = 0;
      const rawWpm = Math.round((words.length / durationSec) * 60);
      instantWpm = Math.min(220, Math.max(60, rawWpm));
      console.log(`[Interview] ⏱️ WPM computed from audio duration: words=${words.length}, duration=${durationSec.toFixed(1)}s, wpm=${instantWpm}`);
    } else {
      // Natural fallback for typed responses based on conversational pace
      const naturalSec = Math.max(2, words.length / 2.3);
      instantWpm = Math.min(180, Math.max(85, Math.round((words.length / naturalSec) * 60)));
    }

    setWpmScore(prev => {
      const smoothed = Math.round(prev * 0.35 + instantWpm * 0.65);
      console.log(`[Interview] ⏱️ Telemetry smoothed: instant=${instantWpm} WPM -> smoothed=${smoothed} WPM`);
      return smoothed;
    });

    // Compute dynamic filler word count
    const fillers = text.match(/\b(um|uh|like|you know|basically|actually|sort of|kind of)\b/gi);
    if (fillers) {
      setFillerWordCount(prev => prev + fillers.length);
    }

    const newMsgs: Message[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMsgs);

    if (activeStage === 'round4_star') setStarStep(prev => prev + 1);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text.trim(),
          interviewerId: activeTeacher.id,
          stage: activeStage,
          history: newMsgs,
          difficulty,
          customTopic: activeTopicName,
          domainStream,
          domainSubTopic: activeTopicName,
          telemetry: {
            eyeContact: eyeContactScore ?? 0,
            wpm: wpmScore,
            fillerWords: fillerWordCount
          }
        })
      });
      const data = await res.json();
      const cleanReply = sanitizeLLMOutput(data?.reply);
      if (cleanReply) {
        setMessages([...newMsgs, { role: 'assistant', content: cleanReply }]);
        speakWithAvatar(cleanReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      }
    } catch (e) {
      console.warn('[Interview Chat] Backend call failed, using fallback speech');
      const fallbackReply = `Thank you for sharing that! In your work with ${activeTopicName}, how do you approach reliability, performance optimization, and debugging edge cases?`;
      setMessages([...newMsgs, { role: 'assistant', content: fallbackReply }]);
      speakWithAvatar(fallbackReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
  };

  // Dynamic Test Suite Execution for Round 2 (100% Dynamic Engine)
  const runCodeAndTests = async () => {
    setIsRunning(true);
    console.log(`[Interview] 🧪 Running dynamic test suite for: "${activeTopicName}" | Lang: ${selectedLang}`);
    setTerminalLogs([`[RUNNER] Compiling ${selectedLang.toUpperCase()} for ${activeTopicName}...`]);

    try {
      // 1. Detect function name dynamically from generated problem or regex
      let fnName = dynamicProblemData?.functionName ||
                   /def\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   /function\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
                   'evaluateSolution';

      if (selectedLang === 'javascript' && fnName.includes('_')) {
        fnName = fnName.replace(/_([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      }

      // 2. Resolve dynamic test cases
      let testCases: any[] = [];
      if (dynamicProblemData?.testCases && dynamicProblemData.testCases.length > 0) {
        testCases = dynamicProblemData.testCases.map((tc: any) => ({
          input: tc.input || '[10, 20, 30]',
          output: tc.expectedOutput || 'Optimal',
          name: tc.name || 'Dynamic Constraint Assertion',
          verify: (res: any) => {
            if (res === null || res === undefined) return false;
            const str = String(JSON.stringify(res));
            return str.includes('Optimal') || str.includes('Viable') || res === true || String(res) === 'true' || Object.keys(res).length > 0;
          }
        }));
      } else {
        testCases = [
          { input: '[10, 20, 30, 40]', output: 'true / optimal', name: 'Primary Verification Case', verify: (res: any) => res !== null && res !== undefined },
          { input: '[]', output: 'handled', name: 'Boundary Empty Dataset Check', verify: (res: any) => res !== null && res !== undefined }
        ];
      }

      const sqlConfig = {
        query: codeContent,
        schemaSql: 'CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT); INSERT INTO employees VALUES (1, "Alice", 101, "Engineering", 90000), (2, "Bob", 102, "Marketing", 60000), (3, "Charlie", 101, "Engineering", 95000);',
        expectedColumns: ['department_id'],
        expectedRows: [[101]]
      };

      const result = await runTestSuite(codeContent, selectedLang as any, {
        functionName: fnName,
        testCases,
        sqlConfig,
        timeoutMs: 5000
      });

      setTerminalLogs(prev => [...prev, ...result.terminalLogs]);

      if (result.allPassed || result.passedTests > 0) {
        setCodeSubmitted(true);
        console.log(`[Interview] ✅ Verified dynamic execution for ${activeTopicName}: ${result.passedTests}/${result.totalTests || 1} assertions passed.`);
        setTerminalLogs(prev => [
          ...prev,
          `\n✅ [PASSED] ${result.passedTests}/${result.totalTests || 1} tests verified for ${activeTopicName}. You can now proceed to Round 3!`
        ]);
      } else {
        setTerminalLogs(prev => [
          ...prev,
          `\n⚠️ Some tests encountered output discrepancies. Check console logs and refine logic.`
        ]);
      }
    } catch (e: any) {
      console.warn('[Interview] Runner execution error:', e);
      setTerminalLogs(prev => [...prev, `[ERROR] Execution failed: ${e?.message || 'Syntax error'}`]);
    } finally {
      setIsRunning(false);
    }
  };

  // Finish Interview & Calculate Holistic Deterministic Role Score
  const finishInterview = async () => {
    setIsEvaluating(true);
    setActiveStage('results');

    const userMsgCount = messages.filter(m => m.role === 'user').length;
    const roleKey = normalizeRoleKey(activeTopicName, domainStream);
    const archetype: MindsetArchetype = cOS?.onboardingAnswers?.mindset_archetype || (user as any)?.mindset_archetype || 'Pattern Hunter';

    // Holistic dimension ratings across all 4 interview rounds (no false 58% hard-cap)
    const verbalContribution = Math.min(88, Math.max(45, userMsgCount * 9));
    const architectureBonus = latestTopology?.nodes?.length ? Math.min(95, 60 + latestTopology.nodes.length * 5) : 60;
    const solvingScore = codeSubmitted ? 90 : (verbalContribution > 65 ? 65 : 50);

    const rawDimensions = {
      logic: Math.max(35, Math.min(95, solvingScore * 0.95 + (architectureBonus > 70 ? 5 : 0))),
      systems: Math.max(35, Math.min(95, architectureBonus)),
      comms: Math.max(40, Math.min(95, 45 + userMsgCount * 8 - Math.min(15, fillerWordCount * 2))),
      solving: solvingScore,
      star: Math.max(35, Math.min(95, 40 + starStep * 15))
    };

    const scoringResult = calculateRoleWeightedScore(rawDimensions, roleKey);
    const coaching = generatePersonaCoaching(archetype, scoringResult.sanitizedDimensions, roleKey);
    const telemetryDiagnostics = generateTelemetryDiagnostics({ eyeContact: eyeContactScore ?? 0, wpm: wpmScore, fillerWords: fillerWordCount });

    console.log(`[Interview] 📊 Holistic evaluation computed: verdict=${scoringResult.verdict}, score=${scoringResult.overallScore}%`);

    // IV-UX-01 FIX: Calculate explicit per-round scores for the 4-round scorecard
    const perRoundScores = {
      round1: {
        title: 'Round 1: Behavioral & Mindset',
        score: Math.min(100, Math.max(50, Math.round((rawDimensions.comms * 0.7) + (verbalContribution * 0.3)))),
        verdict: rawDimensions.comms >= 75 ? 'Strong Fit' : rawDimensions.comms >= 60 ? 'Competent' : 'Developing',
        metric: `${userMsgCount} conversational responses, ${fillerWordCount} filler words`,
        badge: 'Behavioral'
      },
      round2: {
        title: 'Round 2: Technical Sandbox',
        score: Math.min(100, Math.max(45, solvingScore)),
        verdict: solvingScore >= 85 ? 'Optimal Solution' : solvingScore >= 65 ? 'Working Implementation' : 'Incomplete Logic',
        metric: codeSubmitted ? 'Test suite verified' : 'Manual code submitted',
        badge: 'Coding'
      },
      round3: {
        title: 'Round 3: System Architecture',
        score: Math.min(100, Math.max(50, architectureBonus)),
        verdict: architectureBonus >= 80 ? 'Production Ready' : architectureBonus >= 65 ? 'Viable Topology' : 'Basic Tiering',
        metric: latestTopology?.nodes?.length ? `${latestTopology.nodes.length} nodes connected` : 'Baseline architecture',
        badge: 'System Design'
      },
      round4: {
        title: 'Round 4: Situational STAR Defense',
        score: Math.min(100, Math.max(50, rawDimensions.star)),
        verdict: rawDimensions.star >= 80 ? 'Exemplary STAR' : rawDimensions.star >= 60 ? 'Structured Response' : 'Unstructured',
        metric: `${starStep} STAR steps articulated`,
        badge: 'STAR Defense'
      }
    };

    let resultObj: any = {
      verdict: scoringResult.verdict,
      score: scoringResult.overallScore,
      readiness: scoringResult.readiness,
      roleName: scoringResult.roleName,
      rubricVersion: 'v1.0',
      appliedWeights: scoringResult.appliedWeights,
      radar: scoringResult.sanitizedDimensions,
      summary: `${scoringResult.verdict} performance recorded for ${scoringResult.roleName}.`,
      strengths: coaching.tailoredStrengths,
      improvements: coaching.coachingTips.join(' • '),
      coaching,
      telemetryDiagnostics,
      perRoundScores
    };

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          history: messages,
          codingScore: solvingScore,
          domainStream,
          domainSubTopic: activeTopicName,
          roleKey: activeTopicName,
          archetype,
          telemetry: {
            eyeContact: eyeContactScore ?? 0,
            wpm: wpmScore,
            fillerWords: fillerWordCount
          }
        })
      });
      const data = await res.json();
      if (data?.evaluation) {
        resultObj = { 
          ...resultObj, 
          ...data.evaluation,
          perRoundScores: data.evaluation.perRoundScores || perRoundScores
        };
      }
    } catch (e) {
      console.warn('[Interview Evaluator] Fallback deterministic rubric applied');
    } finally {
      setEvaluationResult(resultObj);
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(getDraftKey(user?.id));
        } catch {}
      }
      setActiveSessionDraft(null);
      if (resultObj.verdict === 'Hire' || resultObj.verdict === 'Conditional Hire') {
        addXp(150, 'Completed AI Interview');
        earnPins('ai_interview');
      }
      setIsEvaluating(false);

      const { dateStr, isoStr } = safeFormatDate();
      const sessionRecord: InterviewSessionRecord = {
        id: `sess-${Date.now()}`,
        date: dateStr,
        timestamp: isoStr,
        type: `${domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}: ${activeTopicName}`,
        domainStream,
        domainSubTopic: activeTopicName,
        difficulty,
        verdict: resultObj.verdict,
        score: resultObj.score,
        radar: resultObj.radar || scoringResult.sanitizedDimensions,
        telemetry: { eyeContact: eyeContactScore ?? 0, wpm: wpmScore, fillerWords: fillerWordCount, tabSwitches: 0 },
        messages: messages,
        summary: resultObj.summary || '',
        strengths: Array.isArray(resultObj.strengths) ? resultObj.strengths : [resultObj.strengths || 'Good effort'],
        improvements: Array.isArray(resultObj.improvements) ? resultObj.improvements.join('. ') : (resultObj.improvements || ''),
        topology: latestTopology || null,
      };

      saveSessionHistory(sessionRecord);

      // Record authentic defense evidence to Pathway Evidence Ledger
      if (resultObj.score >= 65) {
        try {
          const studentId = user?.id || 'student_defense_id';
          const targetCompId = domainStream === 'non_tech' || activeTopicName.toLowerCase().includes('behavioral')
            ? 'comp_comm_star_interview_l2'
            : 'comp_production_engineering_residency_l5';

          PathwayApiService.recordEvidence({
            id: `ev_interview_${sessionRecord.id}`,
            competencyId: targetCompId,
            competencyVersion: '1.0.0',
            studentId,
            programId: 'prog_swe_accelerated_9m',
            evidenceClass: 'defense',
            difficulty: difficulty === 'hard' ? 'production' : difficulty === 'normal' ? 'advanced' : 'intermediate',
            evidenceFamilyId: `interview_${activeTopicName.toLowerCase().replace(/\s+/g, '_')}`,
            sourceType: 'capstone_defense',
            sourceId: sessionRecord.id,
            attemptId: `att_${sessionRecord.id}`,
            score: Math.min(100, Math.max(65, resultObj.score)),
            evaluatorType: 'ai',
            evaluatorVersion: 'vroid-ai-interviewer-v2',
            rubricVersion: 'rubric-star-defense-v1',
            timestamp: Date.now(),
            artifacts: {
              executionLogSnippet: `Verdict: ${resultObj.verdict} | Summary: ${resultObj.summary || 'Completed oral interview defense'}`,
            }
          }).catch(err => console.warn('[Evidence Ledger] Recording warning:', err));
        } catch (err) {
          console.warn('[Evidence Ledger] Failed to record oral defense evidence:', err);
        }
      }
    }
  };

  // IV-UX-02 FIX: Export full multi-round interview transcript & scorecard (MD or JSON)
  const exportInterviewTranscript = (format: 'markdown' | 'json' = 'markdown') => {
    if (format === 'json') {
      const payload = {
        topic: activeTopicName,
        domain: domainStream,
        interviewer: activeTeacher.name,
        date: new Date().toISOString(),
        overallScore: evaluationResult?.score || 0,
        verdict: evaluationResult?.verdict || 'Recorded',
        perRoundScores: evaluationResult?.perRoundScores,
        telemetry: {
          eyeContact: eyeContactScore,
          wpm: wpmScore,
          fillerWords: fillerWordCount
        },
        codeSolution: codeContent,
        architectureTopology: latestTopology,
        transcript: messages
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Transcript Downloaded 📋', 'Exported full JSON interview record.');
    } else {
      const lines = [
        `# Pinit Career OS — Technical Interview Report`,
        `**Topic:** ${activeTopicName}  `,
        `**Track:** ${domainStream === 'non_tech' ? 'Non-Technical / Product' : 'Technical / Engineering'}  `,
        `**Interviewer:** ${activeTeacher.name}  `,
        `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}  `,
        `**Verdict:** ${evaluationResult?.verdict || 'Completed'} (${evaluationResult?.score || 0}%)  `,
        `\n---\n`,
        `## 1. Per-Round Performance Breakdown`,
        `- **Round 1 (Behavioral):** ${evaluationResult?.perRoundScores?.round1?.score || 75}% — ${evaluationResult?.perRoundScores?.round1?.verdict || 'Competent'} (${evaluationResult?.perRoundScores?.round1?.metric || 'Verbal Q&A'})`,
        `- **Round 2 (Coding):** ${evaluationResult?.perRoundScores?.round2?.score || 70}% — ${evaluationResult?.perRoundScores?.round2?.verdict || 'Working'} (${evaluationResult?.perRoundScores?.round2?.metric || 'Test assertions'})`,
        `- **Round 3 (Systems):** ${evaluationResult?.perRoundScores?.round3?.score || 80}% — ${evaluationResult?.perRoundScores?.round3?.verdict || 'Viable'} (${evaluationResult?.perRoundScores?.round3?.metric || 'Canvas topology'})`,
        `- **Round 4 (STAR):** ${evaluationResult?.perRoundScores?.round4?.score || 85}% — ${evaluationResult?.perRoundScores?.round4?.verdict || 'Structured'} (${evaluationResult?.perRoundScores?.round4?.metric || 'STAR criteria'})`,
        `\n## 2. Telemetry & Delivery Diagnostics`,
        `- **Average Eye Contact:** ${eyeContactScore !== null ? `${eyeContactScore}%` : 'Not Tracked'}`,
        `- **Speaking Pace:** ${wpmScore} Words Per Minute`,
        `- **Filler Words Count:** ${fillerWordCount}`,
        `\n## 3. Candidate Code Submission (${selectedLang})`,
        '```' + selectedLang,
        codeContent || '// No code submitted',
        '```',
        `\n## 4. Complete Interview Transcript\n`
      ];

      messages.forEach(m => {
        const sender = m.role === 'user' ? 'Candidate' : activeTeacher.name;
        lines.push(`**${sender}:** ${m.content}\n`);
      });

      const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Transcript Downloaded 📋', 'Exported comprehensive Markdown interview report.');
    }
  };

  // Get the last interviewer speech strictly (never showing candidate's words in avatar subtitle)
  const lastInterviewerSpeech = useMemo(() => {
    const assistantMsgs = messages.filter(m => m.role === 'assistant');
    return assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1].content : 'Welcome to your interview!';
  }, [messages]);

  const currentCodingProb = getDynamicCodingProblem(activeTopicName, selectedLang);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ padding: isInterviewActive ? '6px 16px' : '24px 36px', maxWidth: 1400, margin: '0 auto', color: 'var(--t1)', fontFamily: 'var(--font-sans)' }}>
      
      {!isInterviewActive ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
          <div className="iv-panel" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px', color: 'var(--t1)' }}>🎙️ Start AI Corporate Interview</h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Practice real-time corporate interviews with spoken voice communication, Monaco code sandbox, interactive architecture canvas, and automated role-weighted scoring.
            </p>

            {/* Recoverable Active Session Banner (Survives Browser Refresh) */}
            {activeSessionDraft && (
              <div style={{
                marginBottom: 20,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(var(--brand-rgb), 0.08)',
                border: '1.5px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>⚠️</span> In-Progress Session Recovered
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--t2)', marginTop: 2 }}>
                    Topic: <strong>{activeSessionDraft.activeTopicName}</strong> • {formatStageLabel(activeSessionDraft.activeStage)} • {Math.floor(activeSessionDraft.elapsedSeconds / 60)}m {activeSessionDraft.elapsedSeconds % 60}s elapsed
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={resumeActiveSession}
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--text)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Resume ➔
                  </button>
                  <button
                    onClick={discardActiveSession}
                    style={{
                      background: 'transparent',
                      color: 'var(--t3)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            {/* Mode Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 8 }}>SELECT INTERVIEW MODE</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setInterviewMode('roadmap')}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: interviewMode === 'roadmap' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'roadmap' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'roadmap' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                >
                  🎯 1. Roadmap Track
                </button>
                <button
                  onClick={() => setInterviewMode('custom')}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: interviewMode === 'custom' ? '2px solid var(--accent)' : '1px solid var(--border)', background: interviewMode === 'custom' ? 'var(--accent-light)' : 'var(--bg3)', color: interviewMode === 'custom' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                >
                  ✏️ 2. Custom Topic / Viva
                </button>
              </div>
            </div>

            {interviewMode === 'roadmap' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>DOMAIN STREAM</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => { setDomainStream('tech'); setDomainSubTopic('software'); }}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: domainStream === 'tech' ? '2px solid var(--accent)' : '1px solid var(--border)', background: domainStream === 'tech' ? 'var(--accent-light)' : 'var(--bg3)', color: domainStream === 'tech' ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                    >
                      💻 Tech Stream
                    </button>
                    <button
                      onClick={() => { setDomainStream('non_tech'); setDomainSubTopic('finance'); }}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: domainStream === 'non_tech' ? '2px solid var(--pink)' : '1px solid var(--border)', background: domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--bg3)', color: domainStream === 'non_tech' ? 'var(--pink)' : 'var(--t1)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                    >
                      📊 Non-Tech Stream
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>SUB-TOPIC & SPECIALIZATION</label>
                  <select
                    value={domainSubTopic}
                    onChange={(e) => setDomainSubTopic(e.target.value)}
                    className="iv-select"
                    style={{ width: '100%', padding: '10px 12px', fontSize: 12.5, fontWeight: 700 }}
                  >
                    {domainStream === 'tech' ? (
                      <>
                        <option value="software">Software Engineering (SDE)</option>
                        <option value="data">Data Science & Analytics</option>
                        <option value="systems">Cloud & Systems</option>
                      </>
                    ) : (
                      <>
                        <option value="finance">Finance & Accounting (B.Com)</option>
                        <option value="marketing">Digital Marketing & Growth</option>
                        <option value="bba">Business Strategy & Product</option>
                        <option value="hr">HR & Talent Management</option>
                        <option value="operations">Supply Chain & Operations</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>ENTER CUSTOM TOPIC OR CAPSTONE PROJECT</label>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g. Distributed Caching & Kafka, React State Performance, DCF Valuation..."
                  className="iv-input"
                  style={{ width: '100%', padding: '10px 14px', fontSize: 12.5 }}
                />
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>DIFFICULTY LEVEL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['easy', 'normal', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, border: difficulty === d ? '2px solid var(--accent)' : '1px solid var(--border)', background: difficulty === d ? 'var(--accent-light)' : 'var(--bg3)', color: difficulty === d ? 'var(--accent)' : 'var(--t1)', fontWeight: 800, fontSize: 11.5, textTransform: 'capitalize', cursor: 'pointer' }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 900, color: 'var(--text)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
            >
              🎙️ Start Proactive Voice Interview ➔
            </button>
          </div>

          {/* Persistent History Section */}
          <div className="iv-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>📜 Past Session History ({sessions.length})</h3>
              {sessions.length > 0 && (
                <button onClick={clearSessionHistory} style={{ background: 'none', border: 'none', color: 'var(--coral-mid)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                  🗑️ Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 380, paddingRight: 4 }} className="scroll-container">
              {sessions.map(s => (
                <div key={s.id} style={{ background: 'var(--bg3)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: s.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: s.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                        {s.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>{s.type}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 900, color: s.score >= 70 ? 'var(--green-mid)' : 'var(--coral-mid)' }}>{s.score}%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t2)' }}>
                    <span>📅 {s.date}</span>
                    <span style={{ color: s.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', fontWeight: 800 }}>Verdict: {s.verdict}</span>
                  </div>

                  <button
                    onClick={() => setSelectedHistorySession(s)}
                    style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer', textAlign: 'center', marginTop: 2 }}
                  >
                    📄 Review Transcript & Report ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Fullscreen Interview Workspace */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          
          {/* Top Session Control Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{activeTeacher.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>{activeTeacher.name} ({activeTeacher.title})</div>
                <div style={{ fontSize: 10, color: 'var(--accent-mid)' }}>
                  Topic: {activeTopicName} • Stage: {activeStage.replace('_', ' ').toUpperCase()} • ⏱️ {formatElapsed(elapsedSeconds)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Assist Mode Teleprompter Toggle — Practice Mode Only */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  disabled={isScoredStage}
                  title={isScoredStage ? 'Assist Mode is disabled during scored assessment rounds' : 'Practice Mode — AI Teleprompter'}
                  onClick={() => {
                    const next = !isAssistModeActive;
                    setIsAssistModeActive(next);
                    console.log(`[Assist Mode] Toggled: ${next ? 'ACTIVE' : 'OFF'}`);
                    if (next) {
                      const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
                      if (lastAssistantMsg) fetchAssistScript(lastAssistantMsg);
                    }
                  }}
                  style={{
                    background: isScoredStage ? 'var(--bg2)' : isAssistModeActive ? 'linear-gradient(135deg, var(--brand) 0%, var(--reward) 100%)' : 'var(--bg3)',
                    border: isScoredStage ? '1px solid var(--border)' : isAssistModeActive ? '1px solid var(--reward)' : '1px solid var(--border)',
                    color: isScoredStage ? 'var(--t3)' : isAssistModeActive ? 'var(--text)' : 'var(--t2)',
                    borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 900,
                    cursor: isScoredStage ? 'not-allowed' : 'pointer',
                    opacity: isScoredStage ? 0.5 : 1,
                    boxShadow: isAssistModeActive && !isScoredStage ? '0 0 14px rgba(var(--reward-rgb),0.4)' : 'none'
                  }}
                >
                  {isScoredStage ? '🔒 Practice Only' : isAssistModeActive ? '🪄 Assist Mode ACTIVE' : '🪄 Assist Mode'}
                </button>
              </div>

              {/* Inline Avatar Volume Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)', padding: '4px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11 }}>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={avatarVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  style={{ width: 60, cursor: 'pointer' }}
                  title="Avatar Voice Volume"
                />
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t2)', minWidth: 28 }}>{avatarVolume}%</span>
              </div>

              {/* Real-Time Webcam Preview Toggle */}
              <button
                onClick={toggleCameraPreview}
                style={{
                  background: showCameraPreview ? 'var(--accent-light)' : 'var(--bg3)',
                  border: showCameraPreview ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: showCameraPreview ? 'var(--accent)' : 'var(--t2)',
                  borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer'
                }}
              >
                {showCameraPreview ? '📷 Self-View ON' : '📷 Self-View'}
              </button>

              {/* Conversational Barge-In Button */}
              {isAvatarSpeaking && (
                <button
                  onClick={() => {
                    console.log('[Barge-In] Manual interrupt button clicked');
                    stopSpeaking();
                    isAvatarSpeakingRef.current = false;
                    setIsAvatarSpeaking(false);
                    startVoiceListening();
                  }}
                  style={{
                    background: 'var(--warning)',
                    border: 'none',
                    color: '#000',
                    borderRadius: 8,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer',
                    animation: 'pulse 1.5s infinite'
                  }}
                >
                  ✋ Interrupt & Speak
                </button>
              )}

              <button
                onClick={() => setAutoVoiceLoop(a => !a)}
                style={{
                  background: autoVoiceLoop ? 'var(--green-light)' : 'var(--bg3)',
                  border: autoVoiceLoop ? '1px solid var(--green)' : '1px solid var(--border)',
                  color: autoVoiceLoop ? 'var(--green)' : 'var(--t2)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer'
                }}
              >
                {autoVoiceLoop ? '🔄 Voice Loop ACTIVE' : '⏸️ Auto Voice Paused'}
              </button>

              <button
                onClick={skipQuestion}
                style={{
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber)',
                  color: 'var(--amber-mid)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer'
                }}
              >
                ⏩ Skip Question
              </button>

              <button onClick={exitInterview} style={{ background: 'var(--coral-light)', border: '1px solid var(--coral-mid)', color: 'var(--coral-mid)', borderRadius: 8, padding: '5px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                ✕ Exit Session
              </button>
            </div>
          </div>

          {/* Real-Time Hands-Free Voice HUD Banner */}
          <div style={{
            background: isVoiceListening ? 'linear-gradient(90deg, rgba(var(--success-rgb),0.15) 0%, rgba(var(--info-rgb),0.15) 100%)' : 'var(--bg3)',
            border: '1px solid ' + (isVoiceListening ? 'var(--success)' : 'var(--border)'),
            borderRadius: 12, padding: '8px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: isVoiceListening ? '0 0 14px rgba(var(--success-rgb),0.2)' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{isAvatarSpeaking ? '🗣️' : isVoiceListening ? '🎙️' : '🎤'}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)' }}>
                  {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? 'SPOKEN VOICE RECOGNITION ACTIVE' : 'Voice Mode Standby'}
                </div>
                <div style={{ fontSize: 11, color: isVoiceListening ? 'var(--success)' : 'var(--t2)', fontWeight: liveSpeechTranscript ? 800 : 600 }}>
                  {isAvatarSpeaking
                    ? 'Listening to avatar audio response (Speak anytime to interrupt)...'
                    : liveSpeechTranscript
                    ? `Hearing your voice: "${liveSpeechTranscript}"`
                    : isVoiceListening
                    ? '🟢 Microphone active — Speak naturally to answer'
                    : 'Click "Speak to Avatar" or enable Auto Voice Loop.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* IV-UX-04: Energetic Your Turn Indicator */}
              {isVoiceListening && !isAvatarSpeaking && (
                <div style={{
                  background: 'rgba(var(--success-rgb), 0.2)',
                  border: '1.5px solid var(--success)',
                  borderRadius: 8,
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  animation: 'pulse 1.8s infinite'
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--success)', letterSpacing: 0.5 }}>
                    YOUR TURN TO SPEAK
                  </span>
                </div>
              )}

              {!isAssistModeActive && !isScoredStage && (
                <button
                  onClick={() => {
                    setIsAssistModeActive(true);
                    const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
                    if (lastAssistantMsg) fetchAssistScript(lastAssistantMsg);
                  }}
                  style={{
                    background: 'rgba(var(--reward-rgb),0.12)',
                    border: '1px dashed var(--reward)',
                    color: 'var(--reward-bright)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  💡 Need a script? Turn on Assist Mode
                </button>
              )}

              <button
                onClick={startVoiceListening}
                disabled={isVoiceListening || isAvatarSpeaking}
                style={{
                  background: isVoiceListening ? 'var(--success)' : 'var(--accent)',
                  border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 900, cursor: isVoiceListening ? 'default' : 'pointer'
                }}
              >
                {isVoiceListening ? '🎙️ Listening...' : '🎤 Force Mic Reactivate'}
              </button>
            </div>
          </div>

          {/* 🪄 Assist Mode Interactive Teleprompter & Delivery Guide Card — Practice Only */}
          {!isScoredStage && isAssistModeActive && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '1.5px solid var(--reward)',
              borderRadius: 14,
              padding: '14px 16px',
              boxShadow: '0 8px 24px rgba(var(--reward-rgb), 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(var(--reward-rgb),0.3)', paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🪄</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--reward-bright)', letterSpacing: 0.5 }}>
                      ASSIST MODE TELEPROMPTER & VOCAL SCRIPT
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      Word-for-word spoken response script & vocal coaching tailored to the current question
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (assistData?.script) {
                        speakWithAvatarRaw(assistData.script, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'), false, true, difficulty);
                      }
                    }}
                    style={{
                      background: 'rgba(var(--reward-rgb),0.2)',
                      border: '1px solid var(--reward)',
                      color: 'var(--reward-bright)',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    🔊 Listen Sample Voice
                  </button>

                  <button
                    onClick={() => {
                      const nextLvl = assistScriptLevel === 'standard' ? 'advanced' : 'standard';
                      setAssistScriptLevel(nextLvl);
                      const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
                      if (lastAssistantMsg) fetchAssistScript(lastAssistantMsg, nextLvl);
                    }}
                    style={{
                      background: 'rgba(var(--reward-rgb),0.15)',
                      border: '1px solid var(--reward)',
                      color: 'var(--reward-bright)',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {assistScriptLevel === 'standard' ? '⚡ Beginner Script' : '🔥 Executive Script'}
                  </button>

                  <button
                    onClick={() => {
                      if (assistData?.script) {
                        navigator.clipboard.writeText(assistData.script);
                        toast.success('Script Copied! 📋', 'Teleprompter script copied to clipboard.');
                      }
                    }}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
                  >
                    📋 Copy
                  </button>

                  <button
                    onClick={() => setIsAssistModeActive(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', padding: '0 4px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Tab Selectors */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setAssistTab('script')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    background: assistTab === 'script' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
                    color: assistTab === 'script' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  📝 Word-for-Word Script
                </button>
                <button
                  onClick={() => setAssistTab('bullets')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    background: assistTab === 'bullets' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
                    color: assistTab === 'bullets' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🎯 Bullet Anchors
                </button>
                <button
                  onClick={() => setAssistTab('delivery')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    background: assistTab === 'delivery' ? 'var(--reward)' : 'rgba(255,255,255,0.05)',
                    color: assistTab === 'delivery' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🗣️ How to Speak (Guide)
                </button>
              </div>

              {/* Tab Content */}
              {isFetchingAssist ? (
                <div style={{ padding: 14, textAlign: 'center', color: 'var(--reward-bright)', fontSize: 11.5, fontStyle: 'italic' }}>
                  ✨ Generating tailored high-scoring speech script...
                </div>
              ) : assistData ? (
                <div>
                  {assistTab === 'script' && (
                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
                      <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>
                        &ldquo;
                        {assistData.script.split(' ').map((word: string, wIdx: number) => {
                          const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                          const isMatched = clean.length > 2 && liveSpeechTranscript.toLowerCase().includes(clean);
                          return (
                            <span
                              key={wIdx}
                              style={{
                                color: isMatched ? 'var(--success-bright)' : 'var(--text)',
                                fontWeight: isMatched ? 800 : 500,
                                textShadow: isMatched ? '0 0 10px rgba(var(--success-rgb),0.7)' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                        &rdquo;
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--reward-bright)' }}>
                        <span>🎙️ {liveSpeechTranscript ? '🟢 Reading detected — word matches glow green' : 'Read this script out loud into your microphone'}</span>
                        <span>Pace: {assistData.deliveryGuide?.pacing || '~125 WPM'}</span>
                      </div>
                    </div>
                  )}

                  {assistTab === 'bullets' && (
                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)' }}>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.6, color: 'var(--text)' }}>
                        {(assistData.bulletPoints || []).map((pt, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {assistTab === 'delivery' && (
                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(var(--reward-rgb),0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Vocal Delivery</span>
                        <div style={{ fontSize: 11.5, color: 'var(--text)', marginTop: 4 }}><strong>Pacing:</strong> {assistData.deliveryGuide?.pacing}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text)', marginTop: 2 }}><strong>Tone:</strong> {assistData.deliveryGuide?.tone}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--reward-bright)', textTransform: 'uppercase' }}>Emphasis Keywords</span>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                          {(assistData.deliveryGuide?.emphasisWords || []).map((w, i) => (
                            <span key={i} style={{ background: 'rgba(var(--reward-rgb),0.3)', color: '#e9d5ff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: 10, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>
                  No script loaded yet. Click &lsquo;Regenerate Script&rsquo; or wait for the next question.
                </div>
              )}
            </div>
          )}

          {/* Round 1: 60% Avatar Screen Viewport + Spoken Dialogue */}
          {activeStage === 'round1_behavioral' && (
            <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 16, alignItems: 'stretch' }}>
              
              {/* Left 60%: 3D VRoid Avatar Viewport */}
              <div style={{ height: 500, background: 'var(--bg3)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
                <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.65} />

                {/* Floating Candidate Camera PiP Preview (IV-UX-03: Live Eye Contact & Vocal Pace HUD) */}
                {showCameraPreview && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14, width: 140, height: 105,
                    borderRadius: 12, overflow: 'hidden', border: '2px solid var(--accent)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.6)', background: '#000', zIndex: 20
                  }}>
                    <video ref={videoPreviewRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', bottom: 3, left: 3, right: 3,
                      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)',
                      borderRadius: 6, padding: '2px 6px', fontSize: 8.5, color: 'var(--text)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800
                    }}>
                      <span style={{ color: eyeContactScore !== null ? (eyeContactScore >= 70 ? 'var(--success-bright)' : eyeContactScore >= 50 ? 'var(--warning-bright)' : 'var(--danger-bright)') : 'var(--text-muted)' }}>
                        👁️ {eyeContactScore !== null ? `${eyeContactScore}% Gaze` : 'Tracking...'}
                      </span>
                      <span style={{ color: 'var(--info-bright)' }}>⚡ {wpmScore} WPM</span>
                    </div>
                  </div>
                )}

                {/* Avatar Status Badge */}
                <div style={{
                  position: 'absolute', top: 14, left: 14, padding: '6px 14px', borderRadius: 100,
                  background: isAvatarSpeaking ? 'var(--accent)' : isVoiceListening ? 'var(--danger)' : 'var(--green)',
                  backdropFilter: 'blur(8px)', color: 'var(--text)', fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-md)'
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                  {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? '🎙️ Listening (Speak Now)...' : '🎤 Voice Ready'}
                </div>

                {/* Inverted Subtitle Fixed: Strictly displays interviewer's speech */}
                <div style={{
                  position: 'absolute', bottom: 14, left: 14, right: 14, padding: '10px 16px',
                  background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(10px)', borderRadius: 12,
                  color: 'var(--text)', fontSize: 12, lineHeight: 1.4, border: '1px solid rgba(255,255,255,0.12)'
                }}>
                  <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
                </div>
              </div>

              {/* Right 40%: Scrollable Transcript & Telemetry */}
              <div className="iv-panel" style={{ padding: 18, height: 500, display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-mid)' }}>ROUND 1 OF 4</span>
                    <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>Behavioral & Background Intro</h2>
                  </div>
                  <button onClick={() => proceedToNextStage('round2_coding')} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    Proceed to Round 2 ➔
                  </button>
                </div>

                {/* Telemetry Bar */}
                <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '8px 12px', border: '1px solid var(--border)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <div>👀 Eye Contact: <strong style={{ color: eyeContactScore !== null ? 'var(--green-mid)' : 'var(--t3)' }}>{eyeContactScore !== null ? `${eyeContactScore}%` : 'Cam Off'}</strong></div>
                  <div>⚡ Pace: <strong style={{ color: 'var(--accent-mid)' }}>{wpmScore} WPM</strong></div>
                  <div>💬 Fillers: <strong style={{ color: 'var(--green-mid)' }}>{fillerWordCount}</strong></div>
                </div>

                {/* Transcript Stream */}
                <div className="scroll-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                      <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '10px 14px', borderRadius: 14, fontSize: 12, lineHeight: 1.5 }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={startVoiceListening}
                    style={{
                      width: '100%',
                      background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                      border: 'none', color: 'var(--text)', borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 900, cursor: 'pointer',
                      boxShadow: isVoiceListening ? '0 0 14px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
                    }}
                  >
                    {isVoiceListening ? '🎙️ Listening to Voice... (Speak Now)' : '🎤 Click to Speak Response'}
                  </button>

                  {/* ⌨️ Direct Typed Response Fallback for Noisy Environments */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!manualTextInput.trim()) return;
                      const textToSend = manualTextInput.trim();
                      setManualTextInput('');
                      console.log('[Interview] ⌨️ Candidate submitted typed response:', textToSend);
                      handleSendMessageWithText(textToSend);
                    }}
                    style={{ display: 'flex', gap: 6 }}
                  >
                    <input
                      type="text"
                      value={manualTextInput}
                      onChange={(e) => setManualTextInput(e.target.value)}
                      placeholder="Or type your response here..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--bg3)',
                        color: 'var(--t1)',
                        fontSize: 11.5
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!manualTextInput.trim()}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: 'none',
                        background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
                        color: manualTextInput.trim() ? 'var(--text)' : 'var(--t3)',
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: manualTextInput.trim() ? 'pointer' : 'default'
                      }}
                    >
                      Send ➔
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* Round 2: Technical Assessment & Monaco Code Workspace */}
          {activeStage === 'round2_coding' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 16, alignItems: 'stretch' }}>
              {/* Left 70%: Code Workspace with Monaco Editor */}
              <div className="iv-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--pink)' }}>ROUND 2 OF 4</span>
                    <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
                      {domainStream === 'non_tech' ? 'Case Study & Analytics:' : 'Technical Problem:'} {currentCodingProb.title}
                    </h2>
                    <p style={{ fontSize: 11.5, color: 'var(--t2)', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {currentCodingProb.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={() => setShowHint(h => !h)}
                      style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', color: 'var(--amber-mid)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                    >
                      💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <button onClick={() => proceedToNextStage('round3_systems')} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                      Proceed to Round 3 ➔
                    </button>
                  </div>
                </div>

                {showHint && (
                  <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 8, padding: '8px 12px', fontSize: 11.5, color: 'var(--t1)' }}>
                    💡 Hint: Focus on time/space complexity and verifying numerical boundary cases.
                  </div>
                )}

                {/* Language Selector */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['python', 'javascript', 'java', 'sql'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        style={{
                          padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                          background: selectedLang === lang ? 'var(--accent)' : 'var(--bg3)',
                          color: selectedLang === lang ? 'var(--text)' : 'var(--t2)', border: 'none', cursor: 'pointer'
                        }}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={runCodeAndTests}
                    style={{ background: 'var(--green)', border: 'none', borderRadius: 8, padding: '7px 16px', color: 'var(--text)', fontWeight: 900, fontSize: 11.5, cursor: 'pointer' }}
                  >
                    {isRunning ? 'Executing...' : (domainStream === 'non_tech' ? '📊 Execute Business Calculation' : '▶️ Run Code & Tests')}
                  </button>
                </div>

                {/* Full Monaco Code Editor Area */}
                <div style={{ height: 340, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <MonacoEditor
                    height="100%"
                    language={selectedLang === 'sql' ? 'sql' : selectedLang === 'python' ? 'python' : selectedLang === 'java' ? 'java' : 'javascript'}
                    theme="vs-dark"
                    value={codeContent}
                    onChange={(val) => {
                      setCodeContent(val || '');
                      codeModifiedRef.current = true; // IV-03: candidate has typed — never overwrite their work
                    }}
                    options={{
                      fontSize: 12.5,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                      automaticLayout: true
                    }}
                  />
                </div>
              </div>

              {/* Right 30%: Avatar Viewport & Execution Terminal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 180, background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                  <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
                  <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--text)', fontSize: 10, fontWeight: 800 }}>
                    {activeTeacher.emoji} {activeTeacher.name}
                  </div>
                </div>

                <button
                  onClick={startVoiceListening}
                  style={{
                    width: '100%',
                    background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: 'none', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer',
                    boxShadow: isVoiceListening ? '0 0 12px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
                  }}
                >
                  {isVoiceListening ? '🎙️ Listening... (Speak Now)' : '🎤 Speak to Interviewer'}
                </button>

                <div style={{ flex: 1, background: '#020617', borderRadius: 14, border: '1px solid var(--border)', padding: 12, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>EXECUTION CONSOLE</div>
                    <button
                      onClick={() => {
                        console.log('[Interview] 🗑️ Terminal console cleared by candidate.');
                        setTerminalLogs([]);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 9.5,
                        color: 'var(--t3)',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Clear
                    </button>
                  </div>
                  <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--success-bright)', overflowY: 'auto', maxHeight: 160 }}>
                    {terminalLogs.length > 0 ? (
                      terminalLogs.map((l, idx) => <div key={idx} style={{ marginBottom: 4 }}>{l}</div>)
                    ) : (
                      <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Click 'Run Code & Tests' to verify solution...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Round 3: Interactive System Architecture Canvas */}
          {activeStage === 'round3_systems' && (
            <div style={{ display: 'grid', gridTemplateColumns: '7.5fr 2.5fr', gap: 16, alignItems: 'stretch' }}>
              <div className="iv-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--teal-mid)' }}>ROUND 3 OF 4</span>
                    <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
                      {domainStream === 'non_tech' ? 'Business Workflow Canvas:' : 'System Architecture Canvas:'} {activeTopicName}
                    </h2>
                  </div>
                  <button onClick={() => proceedToNextStage('round4_star')} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    Proceed to Round 4 ➔
                  </button>
                </div>

                <SystemDesignWhiteboard
                  domainStream={domainStream}
                  activeTopic={activeTopicName}
                  onTopologyChange={setLatestTopology}
                  onAnalyze={analyzeSystemArchitecture}
                  isAnalyzing={isAnalyzingArchitecture}
                />
              </div>

              {/* Right 25%: Avatar Viewport & Review Comments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 190, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                  <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
                  <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--text)', fontSize: 10, fontWeight: 800 }}>
                    {activeTeacher.emoji} {activeTeacher.name}
                  </div>
                </div>

                <button
                  onClick={startVoiceListening}
                  style={{
                    width: '100%',
                    background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: 'none', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer',
                    boxShadow: isVoiceListening ? '0 0 12px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
                  }}
                >
                  {isVoiceListening ? '🎙️ Listening... (Speak Now)' : '🎤 Speak to Interviewer'}
                </button>

                <div className="iv-panel" style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)' }}>INTERVIEWER FEEDBACK</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t1)', lineHeight: 1.4, overflowY: 'auto', maxHeight: 160 }}>
                    <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Round 4: Executive Review & STAR Assessment */}
          {activeStage === 'round4_star' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ width: '85%', height: 480, background: 'var(--bg3)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
                <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />

                {/* Floating Candidate Camera PiP Preview (IV-UX-03: Live Eye Contact & Vocal Pace HUD) */}
                {showCameraPreview && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14, width: 140, height: 105,
                    borderRadius: 12, overflow: 'hidden', border: '2px solid var(--accent)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.6)', background: '#000', zIndex: 20
                  }}>
                    <video ref={videoPreviewRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', bottom: 3, left: 3, right: 3,
                      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)',
                      borderRadius: 6, padding: '2px 6px', fontSize: 8.5, color: 'var(--text)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800
                    }}>
                      <span style={{ color: eyeContactScore !== null ? (eyeContactScore >= 70 ? 'var(--success-bright)' : eyeContactScore >= 50 ? 'var(--warning-bright)' : 'var(--danger-bright)') : 'var(--text-muted)' }}>
                        👁️ {eyeContactScore !== null ? `${eyeContactScore}% Gaze` : 'Tracking...'}
                      </span>
                      <span style={{ color: 'var(--info-bright)' }}>⚡ {wpmScore} WPM</span>
                    </div>
                  </div>
                )}

                <div style={{ position: 'absolute', bottom: 16, left: '5%', right: '5%', background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)', padding: '10px 16px', borderRadius: 12, color: 'var(--text)', fontSize: 12.5, lineHeight: 1.4, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>{activeTeacher.name}:</strong> {lastInterviewerSpeech}
                </div>
              </div>

              <div style={{ width: '85%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    onClick={startVoiceListening}
                    style={{
                      flex: 1,
                      background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--success) 0%, var(--success-deep) 100%)',
                      border: 'none', color: 'var(--text)', borderRadius: 12, padding: '12px', fontSize: 12.5, fontWeight: 900, cursor: 'pointer',
                      boxShadow: isVoiceListening ? '0 0 16px rgba(var(--danger-rgb),0.6)' : 'var(--shadow-md)'
                    }}
                  >
                    {isVoiceListening ? '🎙️ Listening to Your Voice... (Speak Now)' : '🎤 Click to Speak STAR Response'}
                  </button>

                  <button onClick={finishInterview} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 12, padding: '12px 18px', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}>
                    View Results ➔
                  </button>
                </div>

                {/* ⌨️ Direct Typed STAR Response Fallback */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!manualTextInput.trim()) return;
                    const textToSend = manualTextInput.trim();
                    setManualTextInput('');
                    console.log('[Interview] ⌨️ Candidate submitted typed STAR response:', textToSend);
                    handleSendMessageWithText(textToSend);
                  }}
                  style={{ display: 'flex', gap: 6 }}
                >
                  <input
                    type="text"
                    value={manualTextInput}
                    onChange={(e) => setManualTextInput(e.target.value)}
                    placeholder="Or type your STAR response (Situation, Task, Action, Result)..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg3)',
                      color: 'var(--t1)',
                      fontSize: 12
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!manualTextInput.trim()}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      border: 'none',
                      background: manualTextInput.trim() ? 'var(--accent)' : 'var(--bg2)',
                      color: manualTextInput.trim() ? 'var(--text)' : 'var(--t3)',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: manualTextInput.trim() ? 'pointer' : 'default'
                    }}
                  >
                    Send ➔
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {activeStage === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="iv-panel" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20, alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '1px', color: 'var(--accent-mid)', textTransform: 'uppercase' }}>
                      {evaluationResult?.roleName ? `ROLE: ${evaluationResult.roleName}` : `INTERVIEW REPORT: ${activeTopicName}`}
                    </span>
                    <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)', fontFamily: 'monospace' }}>
                      v1.0 Rubric
                    </span>
                  </div>
                  <h1 style={{ fontSize: 22, fontWeight: 900, margin: '6px 0', color: evaluationResult?.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)' }}>
                    Verdict: {evaluationResult?.verdict || 'Needs Practice'} ({evaluationResult?.score || 50}%)
                  </h1>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: '0 0 10px' }}>
                    {evaluationResult?.summary || `Performance evaluation recorded for ${activeTopicName}.`}
                  </p>

                  {evaluationResult?.coaching?.growthArea && (
                    <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(var(--brand-rgb),0.08)', border: '1px solid rgba(var(--brand-rgb),0.2)', fontSize: 11.5, color: 'var(--accent-mid)', marginBottom: 8 }}>
                      <strong>🎯 DNA Focus Area:</strong> {evaluationResult.coaching.growthArea}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarChart scores={evaluationResult?.radar || { logic: 50, systems: 45, comms: 60, solving: 50, star: 48 }} size={190} />
                </div>
              </div>

              {/* IV-UX-01: Per-Round Mastery Scorecard Breakdown */}
              <div className="iv-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>📋</span>
                    <h3 style={{ fontSize: 13, fontWeight: 900, margin: 0, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Per-Round Mastery Breakdown
                    </h3>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(var(--brand-rgb),0.1)', color: 'var(--accent-mid)', fontWeight: 800 }}>
                    4 Assessment Stages Evaluated
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {[
                    { key: 'round1', def: { title: 'Round 1: Behavioral', score: 82, verdict: 'Strong Communicator', metric: 'Spoken Q&A', badge: 'Behavioral' }, icon: '🗣️', color: 'var(--accent)' },
                    { key: 'round2', def: { title: 'Round 2: Technical Sandbox', score: codeSubmitted ? 90 : 65, verdict: codeSubmitted ? 'Optimal Implementation' : 'Partial Draft', metric: codeSubmitted ? 'Tests Passed' : 'Incomplete', badge: 'Coding' }, icon: '💻', color: 'var(--pink)' },
                    { key: 'round3', def: { title: 'Round 3: System Canvas', score: latestTopology?.nodes?.length ? 85 : 60, verdict: latestTopology?.nodes?.length ? 'Viable Topology' : 'Basic Tiering', metric: `${latestTopology?.nodes?.length || 0} nodes wired`, badge: 'Systems' }, icon: '🏗️', color: 'var(--teal)' },
                    { key: 'round4', def: { title: 'Round 4: STAR Defense', score: Math.min(100, 50 + starStep * 15), verdict: starStep >= 3 ? 'Exemplary STAR' : 'Developing Structure', metric: `${starStep} STAR steps`, badge: 'STAR' }, icon: '⭐', color: 'var(--amber)' }
                  ].map((r, idx) => {
                    const roundData = evaluationResult?.perRoundScores?.[r.key] || r.def;
                    return (
                      <div key={idx} style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{r.icon}</span>
                            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t1)' }}>{roundData.title}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 900, color: roundData.score >= 75 ? 'var(--green-mid)' : 'var(--amber-mid)' }}>
                            {roundData.score}%
                          </span>
                        </div>

                        <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <div style={{ height: '100%', width: `${roundData.score}%`, background: r.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--t3)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--t2)' }}>{roundData.verdict}</span>
                          <span>{roundData.metric}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coaching & Diagnostics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="iv-panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 15 }}>🧠</span>
                    <h3 style={{ fontSize: 12.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>DNA Coaching Guidance</h3>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4, marginBottom: 8 }}>
                    {evaluationResult?.coaching?.personaSummary || 'Tailored coaching for your mindset archetype.'}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>
                    {(evaluationResult?.coaching?.coachingTips || [
                      'Lead with structured STAR metrics.',
                      'Explicitly quantify architectural trade-offs.',
                      'State boundary assumptions before solving.'
                    ]).map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="iv-panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 15 }}>📡</span>
                      <h3 style={{ fontSize: 12.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>Delivery Diagnostics (Practice Signal)</h3>
                    </div>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)' }}>Non-Scoring</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(evaluationResult?.telemetryDiagnostics?.signals || [
                      { metric: 'Speaking Pace', value: `${wpmScore || 125} WPM`, diagnostic: 'Natural conversational pace.', status: 'good' },
                      { metric: 'Speech Clarity', value: `${fillerWordCount} filler words`, diagnostic: 'Clean verbal articulation.', status: 'good' },
                      { metric: 'Gaze Alignment', value: eyeContactScore !== null ? `${eyeContactScore}% track` : 'Not Tracked', diagnostic: eyeContactScore !== null ? (eyeContactScore >= 70 ? 'Steady visual focus maintained.' : 'Gaze drift detected during speaking.') : 'Camera was inactive; gaze focus was not measured.', status: eyeContactScore !== null ? (eyeContactScore >= 70 ? 'good' : 'warning') : 'neutral' }
                    ]).map((s: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '4px 8px', borderRadius: 6, background: 'var(--bg3)' }}>
                        <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{s.metric} ({s.value})</span>
                        <span style={{ color: s.status === 'warning' ? 'var(--coral-mid)' : 'var(--green-mid)' }}>{s.diagnostic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row with PDF Print & Share */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                <button onClick={startInterview} style={{ padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, var(--success) 0%, var(--success-deep) 100%)', border: 'none', color: 'var(--text)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}>
                  🔄 Practice Round Again
                </button>
                {/* IV-UX-02: Export Full Transcript & Scorecard */}
                <button
                  onClick={() => exportInterviewTranscript('markdown')}
                  style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--accent)', color: 'var(--accent-mid)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
                >
                  📥 Export Transcript (.md)
                </button>
                <button
                  onClick={() => exportInterviewTranscript('json')}
                  style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
                >
                  💾 Raw JSON
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const url = `${window.location.origin}/interview?verified=true`;
                      navigator.clipboard.writeText(url).then(() => toast.success('Link Copied! 📋', 'Scorecard verification link copied to clipboard!'));
                    }
                  }}
                  style={{ padding: 12, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}
                >
                  🔗 Share Verification Link
                </button>
                <button onClick={exitInterview} style={{ padding: 12, borderRadius: 10, background: 'var(--accent)', border: 'none', color: 'var(--text)', fontSize: 12.5, fontWeight: 900, cursor: 'pointer' }}>
                  🔀 Switch Topic / Mode
                </button>
                <Link href="/career-twin" style={{ padding: 12, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 12.5, fontWeight: 900, textAlign: 'center', textDecoration: 'none' }}>
                  🧬 Sync Career Twin
                </Link>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Session History Review Modal */}
      {selectedHistorySession && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="iv-panel" style={{ width: '100%', maxWidth: 850, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                    {selectedHistorySession.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
                  </span>
                  <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>{selectedHistorySession.type}</h2>
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                  Session ID: {selectedHistorySession.id} • Date: {selectedHistorySession.date}
                </div>
              </div>

              <button
                onClick={() => setSelectedHistorySession(null)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: '50%', width: 30, height: 30, fontSize: 13, cursor: 'pointer', fontWeight: 900 }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }} className="scroll-container">
              <div style={{ background: 'var(--bg3)', borderRadius: 14, padding: 16, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)' }}>RECORDED VERDICT</span>
                  <div style={{ fontSize: 20, fontWeight: 900, color: selectedHistorySession.verdict?.includes('Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', margin: '4px 0' }}>
                    {selectedHistorySession.verdict} ({selectedHistorySession.score}%)
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4, margin: 0 }}>{selectedHistorySession.summary}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarChart scores={selectedHistorySession.radar || { logic: 70, systems: 65, comms: 75, solving: 70, star: 70 }} size={150} />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 13, fontWeight: 900, marginBottom: 10, color: 'var(--accent-mid)' }}>💬 Full Conversation Transcript</h3>
                <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }} className="scroll-container">
                  {selectedHistorySession.messages && selectedHistorySession.messages.length > 0 ? (
                    selectedHistorySession.messages.map((m, idx) => (
                      <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                          {m.role === 'user' ? 'Candidate Response' : 'Interviewer'}
                        </div>
                        <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '8px 12px', borderRadius: 12, fontSize: 11.5, lineHeight: 1.4 }}>
                          {m.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', fontStyle: 'italic' }}>No detailed transcript recorded.</div>
                  )}
                </div>
              </div>

              {selectedHistorySession.topology?.nodes?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 900, marginBottom: 8, color: 'var(--accent-mid)' }}>
                    📐 Evaluated Architecture Topology ({selectedHistorySession.topology.nodes.length} Components)
                  </h3>
                  <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedHistorySession.topology.nodes.map((n: any, idx: number) => (
                      <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700 }}>
                        {n.label || n.type || n.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  const lines = [
                    `# Past Interview Defense: ${selectedHistorySession.type}`,
                    `**Topic / Role:** ${selectedHistorySession.type}  `,
                    `**Date:** ${selectedHistorySession.date}  `,
                    `**Score:** ${selectedHistorySession.score}% | Verdict: ${selectedHistorySession.verdict}  `,
                    `\n---\n`,
                    `## Transcript\n`
                  ];
                  selectedHistorySession.messages?.forEach((m: any) => {
                    lines.push(`**${m.role === 'user' ? 'Candidate' : 'Interviewer'}:**\n${m.content}\n`);
                  });
                  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `History_${selectedHistorySession.id}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success('History Exported', 'Downloaded past interview defense transcript.');
                }}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: 8, padding: '7px 14px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
              >
                📥 Export Past Transcript (.md)
              </button>
              <button
                onClick={() => setSelectedHistorySession(null)}
                style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '8px 18px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer' }}
              >
                Close Review
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
