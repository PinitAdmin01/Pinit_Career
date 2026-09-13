import { supabase } from '@/lib/supabaseClient';

export interface GdAvatar {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  trait: 'proactive' | 'reactive' | 'silent' | 'aggressive';
  description: string;
  voiceName: string;
}

export const AVATARS: GdAvatar[] = [
  { id: 'priya', name: 'Ms. Priya', emoji: '👩‍💼', role: 'Friendly & encouraging Mentor', color: 'var(--purple)', trait: 'reactive', description: 'Warm, encouraging mentor guiding general career pathways.', voiceName: 'af_heart' },
  { id: 'anish', name: 'Mr. Akash', emoji: '👨‍💼', role: 'Casual, friendly Mentor', color: '#0891b2', trait: 'proactive', description: 'Approachable, friendly mentor guiding team workflows.', voiceName: 'am_liam' },
  { id: 'aisha', name: 'Ms. Aisha', emoji: '👩‍💼', role: 'Structured & methodical Teacher', color: 'var(--brand)', trait: 'reactive', description: 'Structured, logical teacher focusing on systematic SDE steps.', voiceName: 'af_sky' },
  { id: 'rohan', name: 'Mr. Rohan', emoji: '👨‍💻', role: 'Energetic & tech-focused Teacher', color: 'var(--danger)', trait: 'aggressive', description: 'Energetic, code-focused teacher drilling compiler concepts.', voiceName: 'am_fenrir' },
  { id: 'kashyap', name: 'Mr. Kashyap', emoji: '👨‍🔧', role: 'Systems Architect Teacher', color: 'var(--warning)', trait: 'aggressive', description: 'Demands deep technical details and low-level JVM models.', voiceName: 'am_fenrir' },
  { id: 'karthic', name: 'Mr. Karthic', emoji: '👨‍💻', role: 'Algorithmic Lead Teacher', color: 'var(--info)', trait: 'proactive', description: 'Focuses on database design, SOLID code, and algorithms.', voiceName: 'am_liam' },
  { id: 'maya', name: 'Ms. Maya', emoji: '👩‍⚕️', role: 'Security Auditor Teacher', color: '#2563eb', trait: 'silent', description: 'Quiet, warning about cloud budgets and networking security.', voiceName: 'bf_emma' },
  { id: 'divya', name: 'Ms. Divya', emoji: '👩‍🏫', role: 'UX Expert Teacher', color: 'var(--success-deep)', trait: 'proactive', description: 'Active, pushes accessible frontend components and user experiences.', voiceName: 'af_nicole' },
  { id: 'vikram', name: 'Mr. Vikram', emoji: '👨‍💼', role: 'Serious, strict UK Interviewer', color: 'var(--danger-deep)', trait: 'aggressive', description: 'Authoritative, challenges timing delays and technical debt.', voiceName: 'bm_lewis' },
  { id: 'shalini', name: 'Ms. Shalini', emoji: '👩‍💼', role: 'Silent UK observer Interviewer', color: '#ec4899', trait: 'reactive', description: 'Silent observer focusing on soft skills and team behavior.', voiceName: 'bf_isabella' },
  { id: 'aditya', name: 'Mr. Aditya', emoji: '👨‍🎨', role: 'Wise System Design Purist', color: 'var(--warning)', trait: 'proactive', description: 'Drives high-level scaling, sharding, and consensus rules.', voiceName: 'am_adam' },
  { id: 'neha', name: 'Ms. Neha', emoji: '👩‍💻', role: 'High-Stress Driller Interviewer', color: 'var(--success)', trait: 'aggressive', description: 'Grills validation edges, load testing, and compiler check rules.', voiceName: 'af_bella' },
  { id: 'rajesh', name: 'Mr. Rajesh', emoji: '👨‍💼', role: 'Friendly Legacy Defender', color: 'var(--brand)', trait: 'reactive', description: 'Focuses on legacy code wraps and clean codebase dependencies.', voiceName: 'am_liam' },
  { id: 'sneha', name: 'Ms. Sneha', emoji: '👩‍💼', role: 'Empathy-First Socratic Interviewer', color: '#db2777', trait: 'proactive', description: 'Focuses on clean hooks, empathetic cooperation, and socratic tips.', voiceName: 'af_sarah' },
  { id: 'abhijit', name: 'Mr. Abhijit', emoji: '👨‍💼', role: 'Bored Executive Interviewer', color: 'var(--text-dim)', trait: 'silent', description: 'Silent executive caring about commercial impact and metrics.', voiceName: 'bm_george' }
];

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      };
    }
  } catch (err) {
    console.warn('[GD Auth] Could not retrieve Supabase session token:', err);
  }
  return { 'Content-Type': 'application/json' };
}

export const SUGGESTED_TOPICS = [
  {
    name: 'Black Friday Production Database CPU Spike Outage',
    desc: 'Triage a sudden database thread lock congestion during peak shopping minutes while avoiding data inconsistencies.'
  },
  {
    name: 'Payment Gateway Double-Charging API Race Condition',
    desc: 'Debug and resolve a distributed database double-charging bug under heavy connection drop rates and customer complaints.'
  },
  {
    name: 'Distributed Cache Eviction Stampede Emergency',
    desc: 'Mitigate massive database queue overloads after a primary cache node failure triggers thousands of concurrent write-backs.'
  },
  {
    name: 'OAuth2 Token Hijack Security Compromise',
    desc: 'Draft a hotfix to safely invalidate leaked JWT signing keys on active apps without triggering widespread forced user logouts.'
  },
  {
    name: 'WebSocket Connection Leak Memory Depletion Outage',
    desc: 'Resolve heap memory leaks in the real-time chat gateway after reaching 100K active concurrent connections.'
  },
  {
    name: 'IoT Device Remote Firmware Bricking Crisis',
    desc: 'Mitigate a broken OTA firmware update that is currently causing 5% of active field devices to enter bootloops.'
  }
];
