import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';

export interface CourseCertificationRate {
  id: string;
  title: string;
  category: string;
  originalPriceInr: number;
  discountedPriceInr: number;
  priceInPins: number;
  certFeeInr: number;
  active: boolean;
  lastUpdated: string;
}

export interface PinsPack {
  id: string;
  name: string;
  pinsAmount: number;
  priceInr: number;
  bonusPins: number;
  popular?: boolean;
}

export interface PinsEconomyConfig {
  inrPerPin: number;
  dailyLoginBonusPins: number;
  questCompleteBonusPins: number;
  tournamentEntryBasePins: number;
  packs: PinsPack[];
  lastUpdated: string;
}

export interface PinGrantRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  reason: string;
  category: 'Merit' | 'Hackathon' | 'Ambassador' | 'Administrative' | 'Contest';
  grantedBy: string;
  grantedAt: string;
  status: 'completed' | 'reverted';
}

export interface TournamentRecord {
  id: string;
  title: string;
  domain: string;
  entryFeePins: number;
  prizePoolPins: number;
  status: 'upcoming' | 'live' | 'completed';
  startDate: string;
  durationMinutes: number;
  participantsCount: number;
  maxParticipants: number;
  rules: string;
  createdBy: string;
  createdAt: string;
}

const STORAGE_KEY_RATES = 'pinit_admin_course_rates';
const STORAGE_KEY_PINS = 'pinit_admin_pins_economy';
const STORAGE_KEY_GRANTS = 'pinit_admin_pin_grants';
const STORAGE_KEY_TOURNAMENTS = 'pinit_admin_tournaments';

const memoryStore: Record<string, any> = {};

// Safe localStorage helper with in-memory SSR/Node fallback
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return memoryStore[key] !== undefined ? memoryStore[key] : fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') {
    memoryStore[key] = val;
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

const DEFAULT_COURSE_RATES: CourseCertificationRate[] = [
  {
    id: 'tech_fullstack',
    title: 'Full-Stack Software Engineering Masterclass',
    category: 'Tech',
    originalPriceInr: 3999,
    discountedPriceInr: 1999,
    priceInPins: 300,
    certFeeInr: 599,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'tech_ai_ml',
    title: 'AI & Applied Machine Learning Studio',
    category: 'AI & Data',
    originalPriceInr: 4499,
    discountedPriceInr: 2499,
    priceInPins: 350,
    certFeeInr: 699,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'tech_cloud_devops',
    title: 'Cloud Architecture & DevOps Systems',
    category: 'Tech',
    originalPriceInr: 3499,
    discountedPriceInr: 1799,
    priceInPins: 280,
    certFeeInr: 499,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'tech_cyber_sec',
    title: 'Cybersecurity Defense & Ethical Hacking',
    category: 'Tech',
    originalPriceInr: 3999,
    discountedPriceInr: 1999,
    priceInPins: 300,
    certFeeInr: 599,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'iot_net',
    title: 'IoT Embedded Systems & Industrial Networks',
    category: 'IoT',
    originalPriceInr: 3499,
    discountedPriceInr: 1699,
    priceInPins: 260,
    certFeeInr: 499,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'bcom_acc',
    title: 'Accounting & Forensic Bookkeeping Enterprise',
    category: 'Commerce',
    originalPriceInr: 2999,
    discountedPriceInr: 1499,
    priceInPins: 220,
    certFeeInr: 399,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'bcom_fin',
    title: 'Corporate Finance & Capital Markets',
    category: 'Commerce',
    originalPriceInr: 3499,
    discountedPriceInr: 1799,
    priceInPins: 260,
    certFeeInr: 499,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'bcom_aud',
    title: 'Statutory Audit & Assurance Standards',
    category: 'Commerce',
    originalPriceInr: 2999,
    discountedPriceInr: 1499,
    priceInPins: 220,
    certFeeInr: 399,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  },
  {
    id: 'bcom_ban',
    title: 'Banking, Treasury & Credit Operations',
    category: 'Commerce',
    originalPriceInr: 3299,
    discountedPriceInr: 1599,
    priceInPins: 240,
    certFeeInr: 449,
    active: true,
    lastUpdated: '2026-11-01T10:00:00Z'
  }
];

const DEFAULT_PINS_CONFIG: PinsEconomyConfig = {
  inrPerPin: 10,
  dailyLoginBonusPins: 5,
  questCompleteBonusPins: 25,
  tournamentEntryBasePins: 50,
  packs: [
    { id: 'pack_starter', name: 'Starter Stash', pinsAmount: 50, priceInr: 499, bonusPins: 0 },
    { id: 'pack_growth', name: 'Growth Bundle', pinsAmount: 150, priceInr: 1299, bonusPins: 15, popular: true },
    { id: 'pack_pro', name: 'Pro Vault', pinsAmount: 500, priceInr: 3999, bonusPins: 75 },
    { id: 'pack_institutional', name: 'Campus Cohort Pack', pinsAmount: 1500, priceInr: 9999, bonusPins: 300 }
  ],
  lastUpdated: '2026-11-01T10:00:00Z'
};

const DEFAULT_GRANTS: PinGrantRecord[] = [
  {
    id: 'grant_001',
    studentId: 'usr_demo_student_01',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@student.pinit.edu',
    amount: 250,
    reason: 'Top 1% Finisher in National Code Sprint',
    category: 'Hackathon',
    grantedBy: 'Campus Administrator',
    grantedAt: '2026-10-30T14:30:00Z',
    status: 'completed'
  },
  {
    id: 'grant_002',
    studentId: 'usr_demo_student_02',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@campus.pinit.edu',
    amount: 100,
    reason: 'Exemplary Peer Mentorship and Lab Assistance',
    category: 'Merit',
    grantedBy: 'Campus Administrator',
    grantedAt: '2026-10-29T11:15:00Z',
    status: 'completed'
  }
];

const DEFAULT_TOURNAMENTS: TournamentRecord[] = [
  {
    id: 'tourn_001',
    title: 'PinIT National Code Wars: Algorithmic Duel',
    domain: 'Tech',
    entryFeePins: 20,
    prizePoolPins: 1000,
    status: 'live',
    startDate: new Date().toISOString(),
    durationMinutes: 120,
    participantsCount: 48,
    maxParticipants: 200,
    rules: '1v1 speed debugging, time-complexity constraints, and automated sandbox validation.',
    createdBy: 'admin@pinit.in',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'tourn_002',
    title: 'Full-Stack Architecture Sprint 2026',
    domain: 'Full-Stack',
    entryFeePins: 50,
    prizePoolPins: 2500,
    status: 'upcoming',
    startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    durationMinutes: 180,
    participantsCount: 19,
    maxParticipants: 150,
    rules: 'Design and deploy production-ready serverless microservices with automated verification.',
    createdBy: 'admin@pinit.in',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'tourn_003',
    title: 'AI & Machine Learning Model Hackathon',
    domain: 'AI & Data',
    entryFeePins: 0,
    prizePoolPins: 1500,
    status: 'upcoming',
    startDate: new Date(Date.now() + 86400000 * 6).toISOString(),
    durationMinutes: 240,
    participantsCount: 62,
    maxParticipants: 300,
    rules: 'Fine-tune an open-source classifier on unseen benchmark data with strict latency limits.',
    createdBy: 'admin@pinit.in',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const adminEconomyService = {
  // ── 1. Course Certification Rates ──
  async getCourseRates(): Promise<CourseCertificationRate[]> {
    try {
      const hasTable = await tableExists('admin_course_rates');
      if (hasTable) {
        const { data, error } = await supabase.from('admin_course_rates').select('*').order('title');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category || 'Tech',
            originalPriceInr: Number(d.original_price_inr) || 2999,
            discountedPriceInr: Number(d.discounted_price_inr) || 1499,
            priceInPins: Number(d.price_in_pins) || 250,
            certFeeInr: Number(d.cert_fee_inr) || 499,
            active: Boolean(d.active),
            lastUpdated: d.updated_at || new Date().toISOString()
          }));
        }
      }
    } catch {}

    return getLocal<CourseCertificationRate[]>(STORAGE_KEY_RATES, DEFAULT_COURSE_RATES);
  },

  async updateCourseRate(id: string, updates: Partial<CourseCertificationRate>): Promise<CourseCertificationRate> {
    const rates = await this.getCourseRates();
    const idx = rates.findIndex(r => r.id === id);
    const updatedRecord: CourseCertificationRate = idx >= 0
      ? { ...rates[idx], ...updates, lastUpdated: new Date().toISOString() }
      : {
          id,
          title: updates.title || 'Course',
          category: updates.category || 'Tech',
          originalPriceInr: updates.originalPriceInr || 2999,
          discountedPriceInr: updates.discountedPriceInr || 1499,
          priceInPins: updates.priceInPins || 250,
          certFeeInr: updates.certFeeInr || 499,
          active: updates.active !== undefined ? updates.active : true,
          lastUpdated: new Date().toISOString()
        };

    const nextRates = idx >= 0 ? rates.map(r => (r.id === id ? updatedRecord : r)) : [...rates, updatedRecord];
    setLocal(STORAGE_KEY_RATES, nextRates);

    try {
      const hasTable = await tableExists('admin_course_rates');
      if (hasTable) {
        const { error: rateErr } = await supabase.from('admin_course_rates').upsert({
          id: updatedRecord.id,
          title: updatedRecord.title,
          category: updatedRecord.category,
          original_price_inr: updatedRecord.originalPriceInr,
          discounted_price_inr: updatedRecord.discountedPriceInr,
          price_in_pins: updatedRecord.priceInPins,
          cert_fee_inr: updatedRecord.certFeeInr,
          active: updatedRecord.active,
          updated_at: updatedRecord.lastUpdated
        });
      }
    } catch {}

    return updatedRecord;
  },

  // ── 2. Pins Economy Configuration ──
  async getPinsEconomyConfig(): Promise<PinsEconomyConfig> {
    try {
      const hasTable = await tableExists('admin_pins_economy');
      if (hasTable) {
        const { data, error } = await supabase.from('admin_pins_economy').select('*').limit(1).maybeSingle();
        if (!error && data) {
          return {
            inrPerPin: Number(data.inr_per_pin) || 10,
            dailyLoginBonusPins: Number(data.daily_login_bonus) || 5,
            questCompleteBonusPins: Number(data.quest_complete_bonus) || 25,
            tournamentEntryBasePins: Number(data.tournament_base_pins) || 50,
            packs: Array.isArray(data.packs) ? data.packs : DEFAULT_PINS_CONFIG.packs,
            lastUpdated: data.updated_at || new Date().toISOString()
          };
        }
      }
    } catch {}

    return getLocal<PinsEconomyConfig>(STORAGE_KEY_PINS, DEFAULT_PINS_CONFIG);
  },

  async updatePinsEconomyConfig(updates: Partial<PinsEconomyConfig>): Promise<PinsEconomyConfig> {
    const current = await this.getPinsEconomyConfig();
    const updated: PinsEconomyConfig = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    setLocal(STORAGE_KEY_PINS, updated);

    try {
      const hasTable = await tableExists('admin_pins_economy');
      if (hasTable) {
        const { error: pinErr } = await supabase.from('admin_pins_economy').upsert({
          id: 'canonical_config',
          inr_per_pin: updated.inrPerPin,
          daily_login_bonus: updated.dailyLoginBonusPins,
          quest_complete_bonus: updated.questCompleteBonusPins,
          tournament_base_pins: updated.tournamentEntryBasePins,
          packs: updated.packs,
          updated_at: updated.lastUpdated
        });
      }
    } catch {}

    return updated;
  },

  // ── 3. Grant Pins to Users ──
  async grantPinsToUser(params: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    amount: number;
    reason: string;
    category?: 'Merit' | 'Hackathon' | 'Ambassador' | 'Administrative' | 'Contest';
    grantedBy?: string;
  }): Promise<PinGrantRecord> {
    const newGrant: PinGrantRecord = {
      id: `grant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: params.studentId,
      studentName: params.studentName,
      studentEmail: params.studentEmail,
      amount: Math.max(1, Number(params.amount)),
      reason: params.reason || 'Administrative Grant',
      category: params.category || 'Administrative',
      grantedBy: params.grantedBy || 'Campus Administrator',
      grantedAt: new Date().toISOString(),
      status: 'completed'
    };

    const history = await this.getPinGrantsHistory();
    const updatedHistory = [newGrant, ...history];
    setLocal(STORAGE_KEY_GRANTS, updatedHistory);

    // Update student's pins balance in localStorage
    if (typeof window !== 'undefined') {
      const currentPinsRaw = window.localStorage.getItem(`pinit:pins_balance:${params.studentId}`);
      const currentBalance = currentPinsRaw ? Number(currentPinsRaw) : 50;
      const newBalance = currentBalance + newGrant.amount;
      window.localStorage.setItem(`pinit:pins_balance:${params.studentId}`, String(newBalance));
    }

    try {
      const hasTable = await tableExists('admin_pin_grants');
      if (hasTable) {
        const { error: grantErr } = await supabase.from('admin_pin_grants').insert({
          id: newGrant.id,
          student_id: newGrant.studentId,
          student_name: newGrant.studentName,
          student_email: newGrant.studentEmail,
          amount: newGrant.amount,
          reason: newGrant.reason,
          category: newGrant.category,
          granted_by: newGrant.grantedBy,
          granted_at: newGrant.grantedAt,
          status: newGrant.status
        });
      }

      // Also increment in users table if table exists
      const hasUsers = await tableExists('users');
      if (hasUsers) {
        const { data: userRow } = await supabase.from('users').select('pins').eq('id', params.studentId).maybeSingle();
        if (userRow) {
          const currentPins = Number(userRow.pins) || 0;
          const { error: userErr } = await supabase.from('users').update({ pins: currentPins + newGrant.amount }).eq('id', params.studentId);
        }
      }
    } catch {}

    return newGrant;
  },

  async getPinGrantsHistory(): Promise<PinGrantRecord[]> {
    try {
      const hasTable = await tableExists('admin_pin_grants');
      if (hasTable) {
        const { data, error } = await supabase.from('admin_pin_grants').select('*').order('granted_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            studentId: d.student_id,
            studentName: d.student_name,
            studentEmail: d.student_email,
            amount: Number(d.amount),
            reason: d.reason,
            category: d.category || 'Administrative',
            grantedBy: d.granted_by,
            grantedAt: d.granted_at,
            status: d.status || 'completed'
          }));
        }
      }
    } catch {}

    return getLocal<PinGrantRecord[]>(STORAGE_KEY_GRANTS, DEFAULT_GRANTS);
  },

  // ── 4. Tournaments & Competitions ──
  async getTournaments(): Promise<TournamentRecord[]> {
    try {
      const hasTable = await tableExists('admin_tournaments');
      if (hasTable) {
        const { data, error } = await supabase.from('admin_tournaments').select('*').order('start_date', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            domain: d.domain || 'All Domains',
            entryFeePins: Number(d.entry_fee_pins) || 0,
            prizePoolPins: Number(d.prize_pool_pins) || 500,
            status: d.status || 'upcoming',
            startDate: d.start_date,
            durationMinutes: Number(d.duration_minutes) || 120,
            participantsCount: Number(d.participants_count) || 0,
            maxParticipants: Number(d.max_participants) || 200,
            rules: d.rules || '',
            createdBy: d.created_by || 'admin@pinit.in',
            createdAt: d.created_at || new Date().toISOString()
          }));
        }
      }
    } catch {}

    return getLocal<TournamentRecord[]>(STORAGE_KEY_TOURNAMENTS, DEFAULT_TOURNAMENTS);
  },

  async createTournament(data: Partial<TournamentRecord>): Promise<TournamentRecord> {
    const newTournament: TournamentRecord = {
      id: `tourn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title || 'Campus Coding Championship',
      domain: data.domain || 'Tech',
      entryFeePins: Number(data.entryFeePins) || 0,
      prizePoolPins: Number(data.prizePoolPins) || 1000,
      status: (data.status as any) || 'upcoming',
      startDate: data.startDate || new Date().toISOString(),
      durationMinutes: Number(data.durationMinutes) || 120,
      participantsCount: 0,
      maxParticipants: Number(data.maxParticipants) || 200,
      rules: data.rules || 'Standard algorithmic speed duel rules apply.',
      createdBy: data.createdBy || 'Campus Administrator',
      createdAt: new Date().toISOString()
    };

    const current = await this.getTournaments();
    const updated = [newTournament, ...current];
    setLocal(STORAGE_KEY_TOURNAMENTS, updated);

    try {
      const hasTable = await tableExists('admin_tournaments');
      if (hasTable) {
        const { error: tourInsErr } = await supabase.from('admin_tournaments').insert({
          id: newTournament.id,
          title: newTournament.title,
          domain: newTournament.domain,
          entry_fee_pins: newTournament.entryFeePins,
          prize_pool_pins: newTournament.prizePoolPins,
          status: newTournament.status,
          start_date: newTournament.startDate,
          duration_minutes: newTournament.durationMinutes,
          participants_count: newTournament.participantsCount,
          max_participants: newTournament.maxParticipants,
          rules: newTournament.rules,
          created_by: newTournament.createdBy,
          created_at: newTournament.createdAt
        });
      }
    } catch {}

    return newTournament;
  },

  async startTournament(id: string): Promise<TournamentRecord> {
    const list = await this.getTournaments();
    const target = list.find(t => t.id === id);
    if (!target) throw new Error('Tournament not found');

    const updated: TournamentRecord = {
      ...target,
      status: 'live',
      startDate: new Date().toISOString()
    };

    const nextList = list.map(t => (t.id === id ? updated : t));
    setLocal(STORAGE_KEY_TOURNAMENTS, nextList);

    try {
      const hasTable = await tableExists('admin_tournaments');
      if (hasTable) {
        const { error: tourUpdErr } = await supabase.from('admin_tournaments').update({
          status: 'live',
          start_date: updated.startDate
        }).eq('id', id);
      }
    } catch {}

    return updated;
  },

  async endTournament(id: string): Promise<TournamentRecord> {
    const list = await this.getTournaments();
    const target = list.find(t => t.id === id);
    if (!target) throw new Error('Tournament not found');

    const updated: TournamentRecord = {
      ...target,
      status: 'completed'
    };

    const nextList = list.map(t => (t.id === id ? updated : t));
    setLocal(STORAGE_KEY_TOURNAMENTS, nextList);

    try {
      const hasTable = await tableExists('admin_tournaments');
      if (hasTable) {
        const { error: tourUpdErr } = await supabase.from('admin_tournaments').update({
          status: 'completed'
        }).eq('id', id);
      }
    } catch {}

    return updated;
  }
};
