export type Stage = 'round1_behavioral' | 'round2_coding' | 'round3_systems' | 'round4_star' | 'results';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AvatarTeacher {
  id: string;
  name: string;
  title: string;
  emoji: string;
}

export interface InterviewSessionRecord {
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
  telemetry?: {
    eyeContact?: number | null;
    wpm?: number | null;
    fillerWords?: number | null;
    tabSwitches?: number;
  };
  messages: Message[];
  summary: string;
  strengths: string[];
  improvements: string;
  topology?: any;
  evaluationToken?: string;
}

export interface ActiveInterviewDraft {
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

export const formatStageLabel = (stage: Stage): string => {
  switch (stage) {
    case 'round1_behavioral': return 'Round 1: Behavioral & Introductions';
    case 'round2_coding': return 'Round 2: Technical & Coding Sandbox';
    case 'round3_systems': return 'Round 3: System Architecture Canvas';
    case 'round4_star': return 'Round 4: Situational STAR Defense';
    case 'results': return 'Final Evaluation';
    default: return stage;
  }
};

export const AVATAR_POOL: AvatarTeacher[] = [
  { id: 'priya', name: 'Ms. Priya', title: 'HR & Talent Acquisition Director', emoji: '👩‍💼' },
  { id: 'rohan', name: 'Mr. Rohan', title: 'Lead Software Architect', emoji: '👨‍💻' },
  { id: 'vikram', name: 'Mr. Vikram', title: 'Principal Systems Specialist', emoji: '👨‍⚖️' },
  { id: 'aisha', name: 'Ms. Aisha', title: 'Executive STAR Evaluator', emoji: '👩‍🏫' }
];

export function safeFormatDate(input?: string | number | Date): { dateStr: string; isoStr: string } {
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

export async function getAuthHeaders(): Promise<Record<string, string>> {
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
