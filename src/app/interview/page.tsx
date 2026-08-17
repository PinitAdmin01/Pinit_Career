'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { speakWithAvatar as speakWithAvatarRaw, stopSpeaking } from '@/lib/tts';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { runTestSuite } from '@/lib/code/codeRunner';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
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
      const score = Math.max(10, Math.min(100, ((scores || {}) as any)[cat] || 50));
      const radius = (score / 100) * maxRadius;
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y, score, name: cat.toUpperCase() };
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
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.02)" />
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
}

const AVATAR_POOL = [
  { id: 'priya', name: 'Ms. Priya', title: 'HR & Talent Director', emoji: '👩‍💼' },
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

const PREVIOUS_SESSIONS: InterviewSessionRecord[] = [];

const STARTER_CODES: Record<string, string> = {
  java: `public class Solution {\n    public boolean verifySorted(int[] arr) {\n        // Check if array is sorted in non-decreasing order\n        for (int i = 0; i < arr.length - 1; i++) {\n            if (arr[i] > arr[i + 1]) return false;\n        }\n        return true;\n    }\n}`,
  python: `def verify_sorted(arr):\n    # Check if array is sorted in non-decreasing order\n    for i in range(len(arr) - 1):\n        if arr[i] > arr[i + 1]:\n            return False\n    return True`,
  javascript: `function verifySorted(arr) {\n    // Check if array is sorted in non-decreasing order\n    for (let i = 0; i < arr.length - 1; i++) {\n        if (arr[i] > arr[i + 1]) return false;\n    }\n    return true;\n}`,
  sql: `SELECT department_id, COUNT(*) as employee_count, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) >= 5\nORDER BY avg_salary DESC;`
};

export default function InterviewPage() {
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

  // Active Interview & Fullscreen Sidebar Auto-Hide
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage>('round1_behavioral');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [chatInput, setChatInput] = useState('');
  const [animState, setAnimState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive Voice Loop & Hands-Free Conversation
  const [autoVoiceLoop, setAutoVoiceLoop] = useState(true);
  const autoVoiceLoopRef = useRef(true);
  const silenceTimerRef = useRef<any>(null);
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState<string>('');
  const isAvatarSpeakingRef = useRef<boolean>(false);
  const autoRestartTimerRef = useRef<any>(null);
  const micRetryCountRef = useRef<number>(0);

  useEffect(() => {
    autoVoiceLoopRef.current = autoVoiceLoop;
  }, [autoVoiceLoop]);

  // Fully Random Avatar Selection per Round
  const [activeTeacher, setActiveTeacher] = useState(AVATAR_POOL[0]);

  const pickRandomTeacher = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * AVATAR_POOL.length);
    const chosen = AVATAR_POOL[randomIndex];
    setActiveTeacher(chosen);
    return chosen;
  }, []);

  // Dynamic Topic-Based Problem Generator (Tech & Non-Tech)
  const getDynamicCodingProblem = useCallback((topic: string, lang: string) => {
    const cleanTopic = topic.toLowerCase();
    
    if (cleanTopic.includes('marketing') || cleanTopic.includes('growth') || cleanTopic.includes('ad')) {
      return {
        title: `Marketing Unit Economics & CAC/LTV Calculator (${topic})`,
        description: `Write a business analytics function 'calculate_cac_ltv(ad_spend, new_users, avg_revenue_per_user, churn_rate)' that evaluates payback period and flags CAC risk.`,
        starterCode: {
          python: `def calculate_cac_ltv(ad_spend, new_users, arpu, churn_rate):\n    cac = ad_spend / new_users if new_users > 0 else 0\n    ltv = arpu / churn_rate if churn_rate > 0 else 0\n    ratio = ltv / cac if cac > 0 else 0\n    return {"cac": round(cac, 2), "ltv": round(ltv, 2), "ltv_cac_ratio": round(ratio, 2), "verdict": "Viable" if ratio >= 3.0 else "High Burn Risk"}`,
          javascript: `function calculateCacLtv(adSpend, newUsers, arpu, churnRate) {\n    const cac = adSpend / newUsers;\n    const ltv = arpu / churnRate;\n    const ratio = ltv / cac;\n    return { cac, ltv, ratio, status: ratio >= 3 ? "Viable" : "Risk" };\n}`,
          java: `public class Solution {\n    public String evaluateMarketingFunnel(double adSpend, double newUsers, double arpu) {\n        double cac = adSpend / newUsers;\n        return cac < 50 ? "Efficient" : "High CAC";\n    }\n}`,
          sql: `SELECT campaign_name, SUM(ad_spend) as total_spend, COUNT(user_id) as new_signups,\n (SUM(ad_spend) / NULLIF(COUNT(user_id), 0)) as cac\nFROM ad_campaigns GROUP BY campaign_name ORDER BY cac ASC;`
        }[lang] || ''
      };
    }

    if (cleanTopic.includes('hr') || cleanTopic.includes('talent') || cleanTopic.includes('people')) {
      return {
        title: `HR Employee Attrition & Recruitment Funnel Analytics (${topic})`,
        description: `Write an HR analytics function that computes quarterly attrition rate and flags departments exceeding healthy turnover thresholds.`,
        starterCode: {
          python: `def analyze_attrition(departures, avg_employee_count):\n    turnover_pct = (departures / avg_employee_count) * 100 if avg_employee_count > 0 else 0\n    return {"turnover_rate": round(turnover_pct, 2), "action": "Urgent Retention Review" if turnover_pct > 12.5 else "Healthy Retention"}`,
          javascript: `function analyzeAttrition(departures, avgEmp) {\n    const rate = (departures / avgEmp) * 100;\n    return { rate, status: rate > 12.5 ? "Retention Warning" : "Healthy" };\n}`,
          java: `public class Solution {\n    public boolean isRetentionHealthy(int departures, int totalStaff) {\n        return ((double)departures / totalStaff) <= 0.125;\n    }\n}`,
          sql: `SELECT department, COUNT(exit_date) as exits, (COUNT(exit_date) * 100.0 / COUNT(*)) as turnover_pct\nFROM employee_records GROUP BY department;`
        }[lang] || ''
      };
    }

    if (cleanTopic.includes('operations') || cleanTopic.includes('supply') || cleanTopic.includes('logistics')) {
      return {
        title: `Supply Chain Economic Order Quantity (EOQ) Evaluator (${topic})`,
        description: `Calculate optimal inventory reorder quantity (EOQ) to minimize total holding and ordering costs.`,
        starterCode: {
          python: `import math\ndef calculate_eoq(annual_demand, order_cost, holding_cost):\n    eoq = math.sqrt((2 * annual_demand * order_cost) / holding_cost) if holding_cost > 0 else 0\n    return {"optimal_batch_size": round(eoq, 0)}`,
          javascript: `function calculateEOQ(demand, orderCost, holdingCost) {\n    return Math.round(Math.sqrt((2 * demand * orderCost) / holdingCost));\n}`,
          java: `public class Solution {\n    public double computeEOQ(double demand, double orderCost, double holdingCost) {\n        return Math.sqrt((2 * demand * orderCost) / holdingCost);\n    }\n}`,
          sql: `SELECT item_sku, SQRT((2 * annual_demand * 50) / holding_cost_per_unit) as optimal_eoq FROM inventory_catalog;`
        }[lang] || ''
      };
    }

    if (cleanTopic.includes('python') || cleanTopic.includes('data')) {
      return {
        title: `Python Data Aggregator & API Pipeline (${topic})`,
        description: `Write a Python function 'aggregate_metrics(events)' that takes a list of log event dicts and calculates the average latency per endpoint.`,
        starterCode: {
          python: `def aggregate_metrics(events):\n    # Calculate average latency per endpoint\n    results = {}\n    counts = {}\n    for event in events:\n        ep = event.get('endpoint')\n        lat = event.get('latency', 0)\n        results[ep] = results.get(ep, 0) + lat\n        counts[ep] = counts.get(ep, 0) + 1\n    return {k: results[k] / counts[k] for k in results}`,
          java: `import java.util.*;\npublic class Solution {\n    public Map<String, Double> aggregateMetrics(List<Map<String, Object>> events) {\n        Map<String, Double> results = new HashMap<>();\n        return results;\n    }\n}`,
          javascript: `function aggregateMetrics(events) {\n    const results = {};\n    const counts = {};\n    events.forEach(e => {\n        results[e.endpoint] = (results[e.endpoint] || 0) + e.latency;\n        counts[e.endpoint] = (counts[e.endpoint] || 0) + 1;\n    });\n    return Object.fromEntries(Object.keys(results).map(k => [k, results[k] / counts[k]]));\n}`,
          sql: `SELECT endpoint, AVG(latency_ms) as avg_latency, COUNT(*) as req_count\nFROM api_logs GROUP BY endpoint HAVING COUNT(*) >= 5;`
        }[lang] || ''
      };
    }

    if (cleanTopic.includes('react') || cleanTopic.includes('js') || cleanTopic.includes('web')) {
      return {
        title: `React Component State Optimization (${topic})`,
        description: `Implement a memoized state filter function for rendering large dataset lists smoothly without UI jank.`,
        starterCode: {
          javascript: `function useOptimizedFilter(items, query) {\n    const memoized = React.useMemo(() => {\n        return items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));\n    }, [items, query]);\n    return memoized;\n}`,
          python: `def filter_items(items, query):\n    return [item for item in items if query.lower() in item['name'].lower()]`,
          java: `public class Solution {\n    public List<String> filterItems(List<String> items, String query) {\n        List<String> res = new ArrayList<>();\n        for (String s : items) if (s.toLowerCase().contains(query.toLowerCase())) res.add(s);\n        return res;\n    }\n}`,
          sql: `SELECT * FROM items WHERE LOWER(name) LIKE LOWER('%query%');`
        }[lang] || ''
      };
    }

    if (cleanTopic.includes('finance') || cleanTopic.includes('b.com') || cleanTopic.includes('accounting') || cleanTopic.includes('strategy')) {
      return {
        title: `Financial Ratio & Working Capital Liquidity Evaluator (${topic})`,
        description: `Write a financial calculator function that computes Current Ratio (Current Assets / Current Liabilities) and flags solvency risk.`,
        starterCode: {
          python: `def evaluate_liquidity(current_assets, current_liabilities):\n    ratio = current_assets / current_liabilities if current_liabilities > 0 else 0\n    return {"current_ratio": round(ratio, 2), "solvency_status": "Healthy Liquidity" if ratio >= 1.5 else "Short-term Solvency Risk"}`,
          java: `public class Solution {\n    public String evaluateLiquidity(double assets, double liabilities) {\n        return (assets / liabilities) >= 1.5 ? "Healthy Liquidity" : "Solvency Risk";\n    }\n}`,
          javascript: `function evaluateLiquidity(assets, liabilities) {\n    const ratio = assets / liabilities;\n    return { currentRatio: ratio, status: ratio >= 1.5 ? 'Healthy Liquidity' : 'Solvency Risk' };\n}`,
          sql: `SELECT company_name, (current_assets / NULLIF(current_liabilities,0)) as working_capital_ratio FROM balance_sheets;`
        }[lang] || ''
      };
    }

    return {
      title: `Corporate Analytics & Optimization (${topic})`,
      description: `Implement an efficient evaluation algorithm to compute performance and structure for ${topic}.`,
      starterCode: {
        java: `public class Solution {\n    public boolean verifyPerformance(int[] metrics) {\n        for (int i = 0; i < metrics.length - 1; i++) {\n            if (metrics[i] > metrics[i + 1]) return false;\n        }\n        return true;\n    }\n}`,
        python: `def verify_performance(metrics):\n    for i in range(len(metrics) - 1):\n        if metrics[i] > metrics[i + 1]:\n            return False\n    return True`,
        javascript: `function verifyPerformance(metrics) {\n    for (let i = 0; i < metrics.length - 1; i++) {\n        if (metrics[i] > metrics[i + 1]) return false;\n    }\n    return true;\n}`,
        sql: `SELECT department_id, COUNT(*) as emp_count FROM employees GROUP BY department_id;`
      }[lang] || ''
    };
  }, []);

  // Voice Recognition
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to your interview! To kick things off, please introduce yourself and tell me a bit about your academic background, experience, and career goals."
    }
  ]);

  const lastSentTranscriptRef = useRef<string>('');

  // Speech Recognition & Hands-Free Auto-Listen Loop
  const startVoiceListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (isAvatarSpeakingRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in browser.");
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
      micRetryCountRef.current = 0; // Reset retry counter on successful start
      setIsVoiceListening(true);
      setAnimState('listening');

      // Proactive 14s silence timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
          let nudgeMsg = `Take your time! Feel free to share your thoughts or experience on ${activeTopicName}.`;
          if (activeStage === 'round2_coding') {
            nudgeMsg = `Need any guidance on your code? Feel free to explain your algorithmic approach for ${activeTopicName} out loud!`;
          } else if (activeStage === 'round3_systems') {
            nudgeMsg = `How is your system canvas design coming along? Tell me about the components and data flows you are building for ${activeTopicName}.`;
          } else if (activeStage === 'round4_star') {
            nudgeMsg = `Take your time! Walk me through the Situation, Task, Action, and Result of your project experience for ${activeTopicName}.`;
          }

          setMessages(prev => [...prev, { role: 'assistant', content: nudgeMsg }]);
          speakWithAvatar(nudgeMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
        }
      }, 14000);
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

      if (interim) {
        setLiveSpeechTranscript(interim);
      }

      if (final.trim() && final.trim() !== lastSentTranscriptRef.current) {
        lastSentTranscriptRef.current = final.trim();
        setLiveSpeechTranscript('');
        setChatInput(final.trim());
        try { rec.stop(); } catch (err) {}
        handleSendMessageWithText(final.trim());
      }
    };

    rec.onerror = (e: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsVoiceListening(false);
      setAnimState('idle');

      // Stop loop if microphone permission is denied or audio capture fails
      const errType = e?.error || '';
      if (errType === 'not-allowed' || errType === 'service-not-allowed' || errType === 'audio-capture') {
        console.warn('[Speech STT] Microphone permission denied or capture error:', errType);
        return;
      }

      // Cap retries to 3 to prevent CPU lockup
      if (micRetryCountRef.current >= 3) {
        console.warn('[Speech STT] Max mic retries reached.');
        return;
      }
      micRetryCountRef.current += 1;

      // Throttled Voice Loop Auto-Restart
      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          startVoiceListening();
        }, 1000);
      }
    };

    rec.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsVoiceListening(false);
      setAnimState('idle');

      if (micRetryCountRef.current >= 3) return;
      micRetryCountRef.current += 1;

      // Throttled Voice Loop Auto-Restart
      if (autoVoiceLoopRef.current && !isAvatarSpeakingRef.current) {
        if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
        autoRestartTimerRef.current = setTimeout(() => {
          startVoiceListening();
        }, 800);
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
        }, 600);
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
      onEnd();
      // Auto-start microphone after avatar finishes speaking
      if (autoVoiceLoopRef.current) {
        setTimeout(() => {
          startVoiceListening();
        }, 400);
      }
    }, false, true, difficulty);
  }, [difficulty, startVoiceListening]);

  // Dynamic Telemetry metrics
  const [eyeContactScore, setEyeContactScore] = useState(0);
  const [wpmScore, setWpmScore] = useState(0);
  const [fillerWordCount, setFillerWordCount] = useState(0);

  // Round 2 Code Workspace State
  const [showHint, setShowHint] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'java' | 'python' | 'javascript' | 'sql'>('java');
  const [codeContent, setCodeContent] = useState(STARTER_CODES.java);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  useEffect(() => {
    if (STARTER_CODES[selectedLang]) {
      setCodeContent(STARTER_CODES[selectedLang]);
    }
  }, [selectedLang]);

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
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage history');
    }
    setSessions([]);
  }, [user?.id]);

  const saveSessionHistory = (newSession: InterviewSessionRecord) => {
    setSessions(prev => {
      const updated = [newSession, ...prev.filter(s => s.id !== newSession.id)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pinit_interview_history_${user?.id || 'anon'}`, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save to localStorage');
        }
      }
      return updated;
    });

    fetch('/api/interview/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSession)
    }).catch(() => {});
  };

  const clearSessionHistory = () => {
    if (window.confirm('Are you sure you want to clear all your interview session history?')) {
      setSessions([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`pinit_interview_history_${user?.id || 'anon'}`);
      }
    }
  };

  // Round 3 Draggable Canvas & Connect Mode State
  const [boardNodes, setBoardNodes] = useState<{ id: string; type: string; x: number; y: number }[]>([
    { id: 'node-1', type: domainStream === 'non_tech' ? 'Target Audience' : 'Client', x: 30, y: 60 },
    { id: 'node-2', type: domainStream === 'non_tech' ? 'Ad Campaign' : 'Load Balancer', x: 220, y: 60 },
    { id: 'node-3', type: domainStream === 'non_tech' ? 'Landing Funnel' : 'Web Server', x: 410, y: 60 },
    { id: 'node-4', type: domainStream === 'non_tech' ? 'Revenue Model' : 'Postgres DB', x: 410, y: 200 }
  ]);
  const [boardLinks, setBoardLinks] = useState<{ id: string; from: string; to: string; label?: string }[]>([
    { id: 'link-1', from: 'node-1', to: 'node-2', label: 'HTTP Request' },
    { id: 'link-2', from: 'node-2', to: 'node-3', label: 'Route' },
    { id: 'link-3', from: 'node-3', to: 'node-4', label: 'Query SQL' }
  ]);

  const [isConnectModeActive, setIsConnectModeActive] = useState(false);
  const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<string | null>(null);
  const [isAnalyzingArchitecture, setIsAnalyzingArchitecture] = useState(false);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 140, e.clientX - rect.left - 40));
    const newY = Math.max(10, Math.min(rect.height - 50, e.clientY - rect.top - 20));

    setBoardNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleNodeTouchStart = (e: React.TouchEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (!draggingNodeId || !canvasRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 140, touch.clientX - rect.left - 40));
    const newY = Math.max(10, Math.min(rect.height - 50, touch.clientY - rect.top - 20));

    setBoardNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
  };

  const handleCanvasTouchEnd = () => {
    setDraggingNodeId(null);
  };

  const addNodeToBoard = (type: string) => {
    const id = `node-${Date.now()}`;
    const x = 30 + (boardNodes.length % 5) * 80;
    const y = 60 + Math.floor(boardNodes.length / 5) * 70;
    setBoardNodes(prev => [...prev, { id, type, x, y }]);
  };

  const deleteNode = (id: string) => {
    setBoardNodes(prev => prev.filter(n => n.id !== id));
    setBoardLinks(prev => prev.filter(l => l.from !== id && l.to !== id));
    if (selectedSourceNodeId === id) setSelectedSourceNodeId(null);
  };

  const handleNodeClick = (id: string) => {
    if (!isConnectModeActive) return;

    if (!selectedSourceNodeId) {
      setSelectedSourceNodeId(id);
    } else if (selectedSourceNodeId === id) {
      setSelectedSourceNodeId(null);
    } else {
      setBoardLinks(prev => [...prev, { id: `link-${Date.now()}`, from: selectedSourceNodeId, to: id, label: 'Data Flow' }]);
      setSelectedSourceNodeId(null);
    }
  };

  const deleteLink = (linkId: string) => {
    setBoardLinks(prev => prev.filter(l => l.id !== linkId));
  };

  // AI Architecture Analysis & Recruiter Follow-up Question
  const analyzeSystemArchitecture = () => {
    setIsAnalyzingArchitecture(true);
    const nodeNames = boardNodes.map(n => n.type).join(', ');
    const linkCount = boardLinks.length;

    setTimeout(() => {
      setIsAnalyzingArchitecture(false);
      const followUpMsg = domainStream === 'non_tech'
        ? `I evaluated your business strategy canvas for ${activeTopicName}. You connected ${nodeNames} via ${linkCount} commercial strategy flows. How do you optimize customer acquisition cost (CAC), mitigate retention churn risk, and scale unit economics across this growth funnel?`
        : `I evaluated your architecture design for ${activeTopicName}. You connected ${nodeNames} via ${linkCount} flow links. How do you handle failure tolerance, data replication, and rate-limiting if one of your database nodes goes down?`;
      
      setMessages(prev => [...prev, { role: 'assistant', content: followUpMsg }]);
      speakWithAvatar(followUpMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }, 1200);
  };

  const renderLinks = () => {
    return boardLinks.map(link => {
      const fromNode = boardNodes.find(n => n.id === link.from);
      const toNode = boardNodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return null;

      const x1 = fromNode.x + 65;
      const y1 = fromNode.y + 20;
      const x2 = toNode.x + 65;
      const y2 = toNode.y + 20;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      return (
        <g key={link.id} style={{ pointerEvents: 'auto' }}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent-mid)" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#arrow)" />
          <text x={midX} y={midY - 6} fill="var(--accent-mid)" fontSize="9" fontWeight="bold" textAnchor="middle">{link.label || 'Flow'}</text>
          <circle cx={midX} cy={midY} r="7" fill="#ef4444" cursor="pointer" onClick={(e) => { e.stopPropagation(); deleteLink(link.id); }}>
            <title>Delete Link</title>
          </circle>
          <text x={midX} y={midY + 3} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle" pointerEvents="none">✕</text>
        </g>
      );
    });
  };

  // STAR Step Tracker
  const [starStep, setStarStep] = useState<number>(0);

  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [, setIsEvaluating] = useState(false);

  // Start Interview with Fully Random Avatar
  const startInterview = async () => {
    const itemKey = `interview:${domainStream}:${domainSubTopic}`;
    if (!cOS.isItemUnlocked(itemKey)) {
      const ok = cOS.unlockItem(itemKey, 'interview', `AI Interview: ${domainSubTopic}`);
      if (!ok) return;
    }

    const topic = interviewMode === 'custom' && customTopicInput.trim()
      ? customTopicInput.trim()
      : (domainStream === 'non_tech' ? 'B.Com Finance & Strategy' : 'Software Engineering (SDE)');

    const randomTeacher = pickRandomTeacher();
    setActiveTopicName(topic);
    setIsInterviewActive(true);
    setActiveStage('round1_behavioral');
    setShowHint(false);
    setCodeSubmitted(false);

    const greeting = `Hello! I am ${randomTeacher.name}, ${randomTeacher.title}. Welcome to your ${topic} Corporate Interview! Please introduce yourself, your experience, and your career goals.`;

    setMessages([{ role: 'assistant', content: greeting }]);
    speakWithAvatar(greeting, randomTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  };

  const exitInterview = () => {
    stopSpeaking();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsInterviewActive(false);
    setActiveStage('round1_behavioral');
  };

  // Proceed to Next Stage & Pick Fully Random Avatar
  const proceedToNextStage = (next: Stage) => {
    setActiveStage(next);
    setShowHint(false);
    const randomTeacher = pickRandomTeacher();

    let stagePrompt = '';
    if (next === 'round2_coding') {
      const prob = getDynamicCodingProblem(activeTopicName, selectedLang);
      stagePrompt = `Round 2: Technical Assessment for ${activeTopicName}. I am ${randomTeacher.name}, ${randomTeacher.title}. Here is your challenge: "${prob.title}". Write and run your code solution in the editor on the left.`;
    } else if (next === 'round3_systems') {
      stagePrompt = `Round 3: System Architecture Canvas for ${activeTopicName}. I am ${randomTeacher.name}, ${randomTeacher.title}. Problem Statement: Design a scalable, resilient microservices system architecture for ${activeTopicName}. Drag components onto the canvas, use 'Connect Nodes Mode' to draw directional flow arrows, and click 'Analyze System Architecture'.`;
    } else if (next === 'round4_star') {
      const builtComponents = boardNodes.map(n => n.type).join(', ');
      stagePrompt = `Round 4: Executive Review & STAR Assessment. I am ${randomTeacher.name}, ${randomTeacher.title}. I evaluated your Round 2 code and your Round 3 system architecture where you built: ${builtComponents || 'components'}. Looking back at your complete interview for ${activeTopicName}, why did you build your solution like this? What were the key architectural and trade-off decisions you made?`;
    }

    if (stagePrompt) {
      setMessages([{ role: 'assistant', content: stagePrompt }]);
      speakWithAvatar(stagePrompt, randomTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
  };

  const skipQuestion = () => {
    stopSpeaking();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const skipMsg = `Let's move on to the next question regarding ${activeTopicName}. What is your experience handling production edge-cases or scalability challenges in this area?`;
    setMessages(prev => [...prev, { role: 'assistant', content: skipMsg }]);
    speakWithAvatar(skipMsg, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
  };

  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim()) return;

    // Compute dynamic WPM telemetry
    const words = text.trim().split(/\s+/);
    const computedWpm = Math.min(220, Math.max(75, Math.round((words.length / 8) * 60)));
    setWpmScore(computedWpm);

    // Compute dynamic filler word count
    const fillers = text.match(/\b(um|uh|like|you know|basically|actually|sort of|kind of)\b/gi);
    if (fillers) {
      setFillerWordCount(prev => prev + fillers.length);
    }

    const newMsgs: Message[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMsgs);
    setChatInput('');

    if (activeStage === 'round4_star') setStarStep(prev => prev + 1);

    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), interviewerId: activeTeacher.id, stage: activeStage, history: newMsgs, difficulty, domainStream, domainSubTopic: activeTopicName })
      });
      const data = await res.json();
      const cleanReply = sanitizeLLMOutput(data?.reply);
      if (cleanReply) {
        setMessages([...newMsgs, { role: 'assistant', content: cleanReply }]);
        speakWithAvatar(cleanReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
      }
    } catch (e) {
      const fallbackReply = `Understood! Tell me more about your technical approach to ${activeTopicName}.`;
      setMessages([...newMsgs, { role: 'assistant', content: fallbackReply }]);
      speakWithAvatar(fallbackReply, activeTeacher.id, () => setAnimState('talking'), () => setAnimState('idle'));
    }
  };

  const runCodeAndTests = async () => {
    setIsRunning(true);
    setTerminalLogs(prev => [...prev, `[COMPILING] Initializing in-browser ${selectedLang.toUpperCase()} execution engine for ${activeTopicName}...`]);

    try {
      const fnName =
        /def\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
        /function\s+([a-zA-Z0-9_]+)/.exec(codeContent)?.[1] ||
        'verifyPerformance';

      const testCases = [
        { input: '[10, 20, 30, 40]', output: 'true', name: 'Ascending Array [10, 20, 30, 40]' },
        { input: '[50, 20, 10]', output: 'false', name: 'Unsorted Array [50, 20, 10]' },
        { input: '[]', output: 'true', name: 'Empty Array []' }
      ];

      const sqlConfig = {
        query: codeContent,
        schemaSql: 'CREATE TABLE employees (id INT, name TEXT, salary INT); INSERT INTO employees VALUES (1, "Alice", 90000), (2, "Bob", 60000);',
        expectedColumns: ['id', 'name', 'salary'],
        expectedRows: [[1, 'Alice', 90000], [2, 'Bob', 60000]]
      };

      const result = await runTestSuite(codeContent, selectedLang as any, {
        functionName: fnName,
        testCases,
        sqlConfig,
        timeoutMs: 4500
      });

      setTerminalLogs(prev => [...prev, ...result.terminalLogs]);

      if (result.allPassed) {
        setCodeSubmitted(true);
        setTerminalLogs(prev => [
          ...prev,
          `[SUCCESS] All ${result.totalTests} ${selectedLang.toUpperCase()} test assertions PASSED. Verified for ${activeTopicName}.`
        ]);
      } else {
        setCodeSubmitted(false);
        setTerminalLogs(prev => [
          ...prev,
          `[FAILURE] Solution logic incomplete (${result.passedTests}/${result.totalTests} tests passed). Review algorithmic edge cases.`
        ]);
      }
    } catch (err: any) {
      setCodeSubmitted(false);
      setTerminalLogs(prev => [
        ...prev,
        `[CRITICAL RUNTIME ERROR] Execution failed: ${err?.message || 'Unknown runtime error'}`
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // Finish & Calculate Realistic Evaluation
  const finishInterview = async () => {
    setIsEvaluating(true);
    setActiveStage('results');

    const userMsgCount = messages.filter(m => m.role === 'user').length;
    const candidateAnswered = userMsgCount >= 3;
    // Drawing board alone must not grant Hire — require verified coding submission.
    const isPassing = candidateAnswered && codeSubmitted;

    const calculatedScore = isPassing
      ? Math.min(92, 60 + userMsgCount * 4 + (codeSubmitted ? 15 : 0))
      : Math.max(30, Math.min(58, userMsgCount * 12));
    const calculatedVerdict = isPassing ? 'Hire' : 'Needs Practice / No Hire';

    let resultObj: {
      verdict: string;
      score: number;
      summary: string;
      strengths: string[];
      improvements: string;
      radar?: {
        logic: number;
        systems: number;
        comms: number;
        solving: number;
        star: number;
      };
      coaching?: {
        personaSummary: string;
        coachingTips: string[];
        tailoredStrengths: string[];
        growthArea: string;
      };
      telemetryDiagnostics?: any;
      roleName?: string;
      rubricVersion?: string;
    } = {
      verdict: calculatedVerdict,
      score: calculatedScore,
      summary: isPassing
        ? `Strong performance across ${activeTopicName} behavioral, coding, and architecture rounds.`
        : `Candidate provided minimal input across interview rounds for ${activeTopicName}. Further practice required.`,
      strengths: isPassing
        ? [`Demonstrated structured STAR method`, `Verified code implementation for ${activeTopicName}`]
        : [`Attempted the interview simulator`],
      improvements: isPassing
        ? `Refine distributed system edge-case handling`
        : `Actively answer interviewer questions and complete the coding challenge`
    };

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages,
          codingScore: calculatedScore,
          domainStream,
          domainSubTopic: activeTopicName,
          roleKey: activeTopicName,
          archetype: cOS?.onboardingAnswers?.mindset_archetype || (user as any)?.mindset_archetype || 'Pattern Hunter',
          telemetry: {
            eyeContact: eyeContactScore,
            wpm: wpmScore,
            fillerWords: fillerWordCount,
            tabSwitches: 0
          }
        })
      });
      const data = await res.json();
      if (data?.evaluation) {
        resultObj = { ...resultObj, ...data.evaluation };
      }
    } catch (e) {
      console.warn('Fallback evaluation used');
    } finally {
      setEvaluationResult(resultObj);
      if (resultObj.verdict === 'Hire') {
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
        radar: resultObj.radar || {
          logic: Math.max(20, Math.min(95, Math.round(calculatedScore * 0.9 + (codeSubmitted ? 5 : -10)))),
          systems: Math.max(20, Math.min(95, Math.round(calculatedScore * 0.85 + (boardLinks.length > 2 ? 5 : -8)))),
          comms: Math.max(20, Math.min(95, Math.round(Math.min(90, 40 + userMsgCount * 8) - fillerWordCount * 3))),
          solving: calculatedScore,
          star: Math.max(20, Math.min(95, Math.round(30 + starStep * 12 + (candidateAnswered ? 10 : 0))))
        },
        telemetry: { eyeContact: eyeContactScore, wpm: wpmScore, fillerWords: fillerWordCount, tabSwitches: 0 },
        messages: messages,
        summary: resultObj.summary || '',
        strengths: Array.isArray(resultObj.strengths) ? resultObj.strengths : [resultObj.strengths || 'Good effort'],
        improvements: Array.isArray(resultObj.improvements) ? resultObj.improvements.join('. ') : (resultObj.improvements || '')
      };

      saveSessionHistory(sessionRecord);
    }
  };

  const getFormulaHint = () => {
    if (domainStream === 'non_tech') {
      return '💡 Business Formula Hint: Gross Margin % = (Revenue - COGS) / Revenue × 100 | CAC = Ad Spend / New Customers.';
    }
    return `💡 Hint: For ${activeTopicName}, focus on time complexity and edge case validations.`;
  };

  const currentCodingProb = getDynamicCodingProblem(activeTopicName, selectedLang);

  return (
    <div style={{ padding: isInterviewActive ? '8px 16px' : '24px 36px', maxWidth: 1400, margin: '0 auto', color: 'var(--t1)', fontFamily: 'var(--font-sans)' }}>
      
      {!isInterviewActive ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
          <div className="iv-panel" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px', color: 'var(--t1)' }}>🎙️ Start AI Corporate Interview</h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Practice real-time corporate interviews with proactive voice-to-voice communication (60% avatar viewport), expanded code workspace, interactive canvas, and randomly assigned AI evaluator avatars.
            </p>

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
                  ✏️ 2. Custom Topic
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

                  {domainStream === 'non_tech' && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      {[
                        { label: '📊 B.Com Finance', val: 'finance' },
                        { label: '📢 Marketing & Growth', val: 'marketing' },
                        { label: '📈 Business Strategy', val: 'bba' },
                        { label: '👥 HR & Talent', val: 'hr' },
                        { label: '📦 Supply Chain', val: 'operations' }
                      ].map(spec => (
                        <button
                          key={spec.val}
                          type="button"
                          onClick={() => setDomainSubTopic(spec.val)}
                          style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                            background: domainSubTopic === spec.val ? 'var(--pink)' : 'var(--bg3)',
                            color: domainSubTopic === spec.val ? '#fff' : 'var(--t2)',
                            border: '1px solid var(--border)', cursor: 'pointer'
                          }}
                        >
                          {spec.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>ENTER CUSTOM INTERVIEW TOPIC</label>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g. Distributed Systems & Kafka, React Performance, M&A Valuation..."
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
              style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 900, color: '#fff', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
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
                    <span style={{ fontSize: 12, fontWeight: 900, color: s.score >= 75 ? 'var(--green-mid)' : 'var(--coral-mid)' }}>{s.score}%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t2)' }}>
                    <span>📅 {s.date}</span>
                    <span style={{ color: s.verdict?.includes('Hire') && !s.verdict?.includes('No Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', fontWeight: 800 }}>Verdict: {s.verdict}</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Top Session Control Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{activeTeacher.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--t1)' }}>{activeTeacher.name} ({activeTeacher.title})</div>
                <div style={{ fontSize: 10, color: 'var(--accent-mid)' }}>Topic: {activeTopicName} • Stage: {activeStage.replace('_', ' ').toUpperCase()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => setAutoVoiceLoop(a => !a)}
                style={{
                  background: autoVoiceLoop ? 'var(--green-light)' : 'var(--bg3)',
                  border: autoVoiceLoop ? '1px solid var(--green)' : '1px solid var(--border)',
                  color: autoVoiceLoop ? 'var(--green)' : 'var(--t2)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer'
                }}
              >
                {autoVoiceLoop ? '🔄 Hands-Free Voice Loop ACTIVE' : '⏸️ Auto Voice Paused'}
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

          {/* Real-Time Hands-Free Voice-to-Voice HUD Banner */}
          <div style={{
            background: isVoiceListening ? 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)' : 'var(--bg3)',
            border: '1px solid ' + (isVoiceListening ? '#10b981' : 'var(--border)'),
            borderRadius: 12, padding: '10px 18px', marginBottom: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: isVoiceListening ? '0 0 14px rgba(16,185,129,0.2)' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{isAvatarSpeaking ? '🗣️' : isVoiceListening ? '🎙️' : '🎤'}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--t1)' }}>
                  {isAvatarSpeaking ? `${activeTeacher.name} (${activeTeacher.title}) is Speaking...` : isVoiceListening ? 'FULL HANDS-FREE VOICE-TO-VOICE MODE (ACTIVE)' : 'Voice Mode Standby'}
                </div>
                <div style={{ fontSize: 11, color: isVoiceListening ? '#10b981' : 'var(--t2)', fontWeight: liveSpeechTranscript ? 800 : 600 }}>
                  {isAvatarSpeaking
                    ? 'Listening to avatar audio response...'
                    : liveSpeechTranscript
                    ? `Hearing your voice: "${liveSpeechTranscript}"`
                    : isVoiceListening
                    ? '🟢 Microphones Active — Speak continuously without clicking buttons'
                    : 'Voice loop paused. Click "Speak to Avatar" or enable Auto Voice Loop.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={skipQuestion}
                style={{
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber)',
                  color: 'var(--amber-mid)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer'
                }}
              >
                ⏩ Skip
              </button>

              <button
                onClick={startVoiceListening}
                disabled={isVoiceListening || isAvatarSpeaking}
                style={{
                  background: isVoiceListening ? '#10b981' : 'var(--accent)',
                  border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 900, cursor: isVoiceListening ? 'default' : 'pointer'
                }}
              >
                {isVoiceListening ? '🎙️ Listening Live...' : '🎤 Force Mic Reactivate'}
              </button>
            </div>
          </div>

          {/* Round 1: 60% Avatar Screen Viewport + Hands-Free Voice Conversation */}
          {activeStage === 'round1_behavioral' && (
            <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 20, alignItems: 'stretch' }}>
              
              {/* Left 60%: 60% Screen 3D VRoid Avatar Viewport */}
              <div style={{ height: 560, background: 'var(--bg3)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
                <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.65} />

                {/* Avatar Status Badge */}
                <div style={{
                  position: 'absolute', top: 16, left: 16, padding: '8px 18px', borderRadius: 100,
                  background: isAvatarSpeaking ? 'var(--accent)' : isVoiceListening ? '#ef4444' : 'var(--green)',
                  backdropFilter: 'blur(8px)', color: '#fff', fontSize: 11.5, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-md)'
                }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                  {isAvatarSpeaking ? `${activeTeacher.name} is Speaking...` : isVoiceListening ? '🎙️ Listening to You (Speak Now)...' : '🎤 Proactive Voice Ready'}
                </div>

                {/* Live Subtitle Overlay */}
                <div style={{
                  position: 'absolute', bottom: 18, left: 16, right: 16, padding: '12px 18px',
                  background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)', borderRadius: 14,
                  color: '#fff', fontSize: 12.5, lineHeight: 1.5, border: '1px solid rgba(255,255,255,0.12)'
                }}>
                  <strong>{activeTeacher.name}:</strong> {messages[messages.length - 1]?.content || 'Welcome to your interview!'}
                </div>
              </div>

              {/* Right 40%: Scrollable Transcript + Voice Waveform & Telemetry */}
              <div className="iv-panel" style={{ padding: 20, height: 560, display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-mid)' }}>ROUND 1 OF 4</span>
                    <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>Behavioral & Background Intro</h2>
                  </div>
                  <button onClick={() => proceedToNextStage('round2_coding')} style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    Proceed to Round 2 ➔
                  </button>
                </div>

                {/* Telemetry Bar */}
                <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--border)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <div>👀 Eye Contact: <strong style={{ color: 'var(--green-mid)' }}>{eyeContactScore}%</strong></div>
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

                {/* Hands-Free Voice Indicator & Manual Override Button */}
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={startVoiceListening}
                    style={{
                      width: '100%',
                      background: isVoiceListening ? '#ef4444' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                      border: 'none', color: '#fff', borderRadius: 12, padding: '12px', fontSize: 12.5, fontWeight: 900, cursor: 'pointer',
                      boxShadow: isVoiceListening ? '0 0 16px rgba(239,68,68,0.7)' : 'var(--shadow-sm)'
                    }}
                  >
                    {isVoiceListening ? '🎙️ Listening to Your Voice... (Speak Now)' : '🎤 Speak Now (Voice Mode Active)'}
                  </button>

                  <div style={{ fontSize: 10, color: 'var(--t3)', textAlign: 'center' }}>
                    {autoVoiceLoop ? '⚡ Hands-free continuous loop enabled: avatar auto-listens when done speaking' : 'Pause mode active'}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Round 2: Technical & Dynamic Coding Workspace (Mr. Rohan) */}
          {activeStage === 'round2_coding' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 16, alignItems: 'stretch' }}>
              {/* Left 70%: Code Workspace */}
              <div className="iv-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--pink)' }}>ROUND 2 OF 4</span>
                    <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
                      {domainStream === 'non_tech' ? 'Case Study & Analytics:' : 'Technical Assessment:'} {currentCodingProb.title}
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--t2)', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {currentCodingProb.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={() => setShowHint(h => !h)}
                      style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', color: 'var(--amber-mid)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                    >
                      💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <button onClick={() => proceedToNextStage('round3_systems')} style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                      Proceed to Round 3 ➔
                    </button>
                  </div>
                </div>

                {showHint && (
                  <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--t1)' }}>
                    {getFormulaHint()}
                  </div>
                )}

                {/* Language / Formula Selector */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['java', 'python', 'javascript', 'sql'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        style={{
                          padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                          background: selectedLang === lang ? 'var(--accent)' : 'var(--bg3)',
                          color: selectedLang === lang ? '#fff' : 'var(--t2)', border: 'none', cursor: 'pointer'
                        }}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={runCodeAndTests}
                    style={{ background: 'var(--green)', border: 'none', borderRadius: 8, padding: '8px 18px', color: '#fff', fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                  >
                    {isRunning ? 'Calculating...' : (domainStream === 'non_tech' ? '📊 Execute Business Calculation' : '▶️ Run Code & Tests')}
                  </button>
                </div>

                {/* Full Code Editor Area */}
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  style={{
                    width: '100%', height: 360, fontFamily: 'var(--font-mono)', fontSize: 12.5,
                    background: '#090d16', color: '#34d399', padding: 14, borderRadius: 10,
                    border: '1px solid var(--border)', outline: 'none', resize: 'none', lineHeight: 1.5
                  }}
                />
              </div>

              {/* Right 30%: Random AI Evaluator Avatar & Proactive Voice Control */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ height: 210, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                  <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
                  <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 10, fontWeight: 800 }}>
                    {activeTeacher.emoji} {activeTeacher.name} ({activeTeacher.title})
                  </div>
                </div>

                <button
                  onClick={startVoiceListening}
                  style={{
                    width: '100%',
                    background: isVoiceListening ? '#ef4444' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: 'none', color: '#fff', borderRadius: 10, padding: '10px 12px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer',
                    boxShadow: isVoiceListening ? '0 0 12px rgba(239,68,68,0.7)' : 'var(--shadow-sm)'
                  }}
                >
                  {isVoiceListening ? '🎙️ Listening to Voice... (Speak Now)' : '🎤 Speak to Avatar (Voice Mode)'}
                </button>

                <div style={{ flex: 1, background: '#020617', borderRadius: 16, border: '1px solid var(--border)', padding: 14, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', marginBottom: 8, textTransform: 'uppercase' }}>EXECUTION CONSOLE</div>
                  <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#34d399', overflowY: 'auto', maxHeight: 180 }}>
                    {terminalLogs.length > 0 ? (
                      terminalLogs.map((l, idx) => <div key={idx} style={{ marginBottom: 4 }}>{l}</div>)
                    ) : (
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>Click 'Run Code & Tests' to verify solution for {activeTopicName}...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Round 3: System Canvas + 25% Avatar Viewport (Random AI Evaluator & Proactive Mic) */}
          {activeStage === 'round3_systems' && (
            <div style={{ display: 'grid', gridTemplateColumns: '7.5fr 2.5fr', gap: 16, alignItems: 'stretch' }}>
              {/* Left 75%: Canvas & Problem Statement */}
              <div className="iv-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--teal-mid)' }}>ROUND 3 OF 4</span>
                    <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
                      {domainStream === 'non_tech' ? 'Business Strategy & Growth Funnel Canvas:' : 'System Architecture Canvas:'} {activeTopicName}
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--accent-mid)', margin: '4px 0 0', fontWeight: 800 }}>
                      {domainStream === 'non_tech'
                        ? `📋 Problem Statement: Build an end-to-end growth funnel & commercial strategy for ${activeTopicName} optimizing unit economics.`
                        : `📋 Problem Statement: Design a high-availability, fault-tolerant system for ${activeTopicName} serving 100,000 RPS.`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={() => setIsConnectModeActive(c => !c)}
                      style={{
                        background: isConnectModeActive ? 'var(--accent)' : 'var(--bg3)',
                        border: isConnectModeActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                        color: isConnectModeActive ? '#fff' : 'var(--t1)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 900, cursor: 'pointer'
                      }}
                    >
                      {isConnectModeActive ? '🔗 Connect Mode ACTIVE' : '🔗 Connect Nodes Mode'}
                    </button>

                    <button
                      onClick={analyzeSystemArchitecture}
                      style={{ background: 'var(--purple)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}
                    >
                      {isAnalyzingArchitecture ? '🤖 Analyzing...' : (domainStream === 'non_tech' ? '🤖 Analyze Business Canvas' : '🤖 Analyze Architecture')}
                    </button>

                    <button onClick={() => proceedToNextStage('round4_star')} style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                      Proceed to Round 4 ➔
                    </button>
                  </div>
                </div>

                {/* Component Palette Buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(domainStream === 'non_tech'
                    ? ['Target Segment', 'Ad Campaign', 'Landing Funnel', 'Checkout Engine', 'Revenue Model', 'Retention Loop', 'Logistics Hub', 'Supplier Network', 'Customer Support', 'Custom Node']
                    : ['Client', 'Load Balancer', 'API Gateway', 'Microservice', 'Web Server', 'Redis Cache', 'Postgres DB', 'Kafka Queue', 'CDN', 'Custom Node']
                  ).map(t => (
                    <button key={t} onClick={() => addNodeToBoard(t)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: 6, padding: '4px 8px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>
                      + {t}
                    </button>
                  ))}
                </div>

                {/* Draggable System Canvas */}
                <div
                  ref={canvasRef}
                  className="iv-canvas-bg"
                  data-board-canvas="true"
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onTouchMove={handleCanvasTouchMove}
                  onTouchEnd={handleCanvasTouchEnd}
                  style={{ position: 'relative', height: 420, borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', cursor: draggingNodeId ? 'grabbing' : 'default' }}
                >
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-mid)" />
                      </marker>
                    </defs>
                    {renderLinks()}
                  </svg>

                  {boardNodes.map(n => {
                    const isSelected = selectedSourceNodeId === n.id;
                    return (
                      <div
                        key={n.id}
                        onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                        onTouchStart={(e) => handleNodeTouchStart(e, n.id)}
                        onClick={() => handleNodeClick(n.id)}
                        style={{
                          position: 'absolute', left: n.x, top: n.y, width: 130, padding: '8px 12px',
                          background: isSelected ? 'var(--accent-light)' : 'var(--bg2)',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                          borderRadius: 10, color: 'var(--t1)', fontSize: 11.5, fontWeight: 800, cursor: 'grab', userSelect: 'none',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{n.type}</span>
                          <button onClick={(e) => { e.stopPropagation(); deleteNode(n.id); }} style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ fontSize: 9, color: isSelected ? 'var(--accent)' : 'var(--t3)', marginTop: 4 }}>
                          {isSelected ? '🎯 Source Selected' : isConnectModeActive ? '🔗 Click to Connect' : '✊ Drag Node'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 25%: 25% Screen Avatar Viewport (Random AI Evaluator) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ height: 220, background: 'var(--bg3)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
                  <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
                  <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 10, fontWeight: 800 }}>
                    {activeTeacher.emoji} {activeTeacher.name} ({activeTeacher.title})
                  </div>
                </div>

                <button
                  onClick={startVoiceListening}
                  style={{
                    width: '100%',
                    background: isVoiceListening ? '#ef4444' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: 'none', color: '#fff', borderRadius: 10, padding: '10px 12px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer',
                    boxShadow: isVoiceListening ? '0 0 12px rgba(239,68,68,0.7)' : 'var(--shadow-sm)'
                  }}
                >
                  {isVoiceListening ? '🎙️ Listening to Voice... (Speak Now)' : '🎤 Speak to Avatar (Voice Mode)'}
                </button>

                <div className="iv-panel" style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>INTERVIEWER EVALUATION</div>
                  <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.5, overflowY: 'auto', maxHeight: 180 }}>
                    <strong>{activeTeacher.name}:</strong> {messages[messages.length - 1]?.content || `Please build your architecture on the canvas for ${activeTopicName} and click 'Analyze Architecture'.`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Round 4: Cinematic 80% Screen Avatar Viewport */}
          {activeStage === 'round4_star' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <div style={{ width: '80%', height: 560, background: 'var(--bg3)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-xl)' }}>
                <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />

                <div style={{ position: 'absolute', bottom: 20, left: '5%', right: '5%', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: 14, color: '#fff', fontSize: 13, lineHeight: 1.5, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>{activeTeacher.name} ({activeTeacher.title}):</strong> {messages[messages.length - 1]?.content || 'Describe your STAR project experience.'}
                </div>
              </div>

              <div style={{ width: '80%', display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  onClick={startVoiceListening}
                  style={{
                    flex: 1,
                    background: isVoiceListening ? '#ef4444' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none', color: '#fff', borderRadius: 12, padding: '14px', fontSize: 13, fontWeight: 900, cursor: 'pointer',
                    boxShadow: isVoiceListening ? '0 0 16px rgba(239,68,68,0.6)' : 'var(--shadow-md)'
                  }}
                >
                  {isVoiceListening ? '🎙️ Listening to Your Voice... (Speak Now)' : '🎤 Click to Speak Response (Voice Mode)'}
                </button>

                <button onClick={finishInterview} style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 12, padding: '14px 20px', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>
                  View Results ➔
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {activeStage === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="iv-panel" style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24, alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '1px', color: 'var(--accent-mid)', textTransform: 'uppercase' }}>
                      {evaluationResult?.roleName ? `ROLE: ${evaluationResult.roleName}` : `INTERVIEW REPORT: ${activeTopicName}`}
                    </span>
                    {evaluationResult?.rubricVersion && (
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)', fontFamily: 'monospace' }}>
                        {evaluationResult.rubricVersion}
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, margin: '6px 0', color: evaluationResult?.verdict?.includes('Hire') && !evaluationResult?.verdict?.includes('No Hire') ? 'var(--green-mid)' : 'var(--coral-mid)' }}>
                    Verdict: {evaluationResult?.verdict || 'Needs Practice'} ({evaluationResult?.score || 45}%)
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 12px' }}>
                    {evaluationResult?.summary || `Performance evaluation recorded for ${activeTopicName}.`}
                  </p>

                  {/* Persona Growth Area */}
                  {evaluationResult?.coaching?.growthArea && (
                    <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, color: 'var(--accent-mid)', marginBottom: 8 }}>
                      <strong>🎯 DNA Focus Area:</strong> {evaluationResult.coaching.growthArea}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarChart scores={evaluationResult?.radar || { logic: 50, systems: 45, comms: 60, solving: 50, star: 48 }} size={200} />
                </div>
              </div>

              {/* Persona Coaching & Practice Diagnostics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Persona Coaching Advice */}
                <div className="iv-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>🧠</span>
                    <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
                      DNA Coaching Interpretation
                    </h3>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 10 }}>
                    {evaluationResult?.coaching?.personaSummary || 'Tailored pedagogical coaching for your career trajectory.'}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.6 }}>
                    {(evaluationResult?.coaching?.coachingTips || [
                      'Structure answers using STAR metrics.',
                      'Quantify technical trade-offs explicitly.',
                      'State boundary assumptions before solving.'
                    ]).map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Delivery Telemetry Diagnostics (Non-penalizing practice signal) */}
                <div className="iv-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>📡</span>
                      <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
                        Delivery Diagnostics (Practice Only)
                      </h3>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t3)' }}>
                      Non-Scoring
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(evaluationResult?.telemetryDiagnostics?.signals || [
                      { metric: 'Speaking Pace', value: `${wpmScore || 125} WPM`, diagnostic: 'Natural conversational pace.', status: 'good' },
                      { metric: 'Speech Clarity', value: `${fillerWordCount} filler words`, diagnostic: 'Crisp verbal execution.', status: 'good' },
                      { metric: 'Gaze Alignment', value: `${eyeContactScore}% track`, diagnostic: 'Steady visual presence.', status: 'good' }
                    ]).map((s: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, padding: '4px 8px', borderRadius: 6, background: 'var(--bg3)' }}>
                        <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{s.metric} ({s.value})</span>
                        <span style={{ color: s.status === 'warning' ? 'var(--coral-mid)' : 'var(--green-mid)', fontSize: 11 }}>
                          {s.diagnostic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={startInterview} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>
                  🔄 Practice Round Again
                </button>
                <button onClick={exitInterview} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>
                  🔀 Switch Topic / Mode
                </button>
                <Link href="/career-twin" style={{ flex: 1, padding: 14, borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', fontSize: 13, fontWeight: 900, textAlign: 'center', textDecoration: 'none' }}>
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
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink-light)' : 'var(--accent-light)', color: selectedHistorySession.domainStream === 'non_tech' ? 'var(--pink)' : 'var(--accent)', fontWeight: 800 }}>
                    {selectedHistorySession.domainStream === 'non_tech' ? 'Non-Tech' : 'Tech'}
                  </span>
                  <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>{selectedHistorySession.type}</h2>
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                  Session ID: {selectedHistorySession.id} • Date: {selectedHistorySession.date}
                </div>
              </div>

              <button
                onClick={() => setSelectedHistorySession(null)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--t1)', borderRadius: '50%', width: 32, height: 32, fontSize: 14, cursor: 'pointer', fontWeight: 900 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }} className="scroll-container">
              
              {/* Verdict Banner */}
              <div style={{ background: 'var(--bg3)', borderRadius: 16, padding: 20, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>RECORDED VERDICT</span>
                  <div style={{ fontSize: 22, fontWeight: 900, color: selectedHistorySession.verdict?.includes('Hire') && !selectedHistorySession.verdict?.includes('No Hire') ? 'var(--green-mid)' : 'var(--coral-mid)', margin: '4px 0' }}>
                    {selectedHistorySession.verdict} ({selectedHistorySession.score}%)
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>{selectedHistorySession.summary}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarChart scores={selectedHistorySession.radar || { logic: 80, systems: 75, comms: 85, solving: 80, star: 80 }} size={160} />
                </div>
              </div>

              {/* Full Chat Transcript */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 900, marginBottom: 12, color: 'var(--accent-mid)' }}>💬 Full Conversation Transcript</h3>
                <div style={{ background: 'var(--bg3)', borderRadius: 16, padding: 18, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }} className="scroll-container">
                  {selectedHistorySession.messages && selectedHistorySession.messages.length > 0 ? (
                    selectedHistorySession.messages.map((m, idx) => (
                      <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 2, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                          {m.role === 'user' ? 'Candidate Response' : 'AI Recruiter'}
                        </div>
                        <div className={m.role === 'user' ? 'iv-chat-user' : 'iv-chat-assistant'} style={{ padding: '8px 14px', borderRadius: 12, fontSize: 12, lineHeight: 1.5 }}>
                          {m.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic' }}>No detailed transcript recorded for this session.</div>
                  )}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--green-mid)', margin: '0 0 8px' }}>🟢 Strengths</h4>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>
                    {(selectedHistorySession.strengths || ['Good communication']).map((st, i) => <li key={i}>{st}</li>)}
                  </ul>
                </div>

                <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--amber-mid)', margin: '0 0 8px' }}>💡 Growth Tip</h4>
                  <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>
                    {selectedHistorySession.improvements || 'Focus on structured STAR frameworks.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedHistorySession(null)}
                style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
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
