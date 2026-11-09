import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { calculateEloMatch } from '@/lib/arena/eloEngine';
import { CODE_WARS_PROBLEMS_CATALOG, CodeWarsProblem } from '@/lib/api/codeWarsApi';

export type CurriculumTier = 'basic' | 'intermediate' | 'advanced';

export const TIER_ORDER: Record<CurriculumTier, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
};

/**
 * Knowledge-Affinity Curriculum Tier Evaluator
 * Calibrates a student's maximum verified algorithmic frontier from their completed quests and competencies.
 * Guarantees zero alien surprises for learners and slow readers.
 */
export function getStudentCurriculumTier(
  completedQuests: string[] = [],
  verifiedCompetencies: string[] = []
): CurriculumTier {
  const advComps = new Set([
    'comp_dsa_linear_trees_l2',
    'comp_concurrency_threads_l2',
    'comp_database_sql_internals_l3',
    'comp_binary_tree_invert_l3',
    'comp_tree_depth_dfs_l3',
    'comp_validate_bst_bounds_l3',
    'comp_dp_unbounded_knapsack_l3',
    'comp_dp_non_adjacent_l3',
    'comp_heap_quickselect_l3',
    'comp_graph_grid_bfs_l3',
  ]);
  const intComps = new Set([
    'comp_stack_brackets_l2',
    'comp_greedy_kadane_l2',
    'comp_sliding_window_stock_l2',
    'comp_dsa_binary_search_l2',
    'comp_linked_list_pointers_l2',
    'comp_sliding_window_unique_l2',
    'comp_greedy_container_l2',
    'comp_prefix_suffix_product_l2',
    'comp_two_pointers_3sum_l2',
    'comp_stack_min_o1_l2',
  ]);

  for (const comp of verifiedCompetencies) {
    if (advComps.has(comp)) return 'advanced';
  }
  for (const quest of completedQuests) {
    if (advComps.has(quest)) return 'advanced';
  }

  for (const comp of verifiedCompetencies) {
    if (intComps.has(comp)) return 'intermediate';
  }
  for (const quest of completedQuests) {
    if (intComps.has(quest)) return 'intermediate';
  }

  // Parse day numbers from quest IDs (e.g. 'day_15', 'day-25', 'd18', 'iot_net_day_05')
  let maxDay = 0;
  for (const q of completedQuests) {
    const match = q.match(/(?:day|d)[_-]?(\d+)/i);
    if (match && match[1]) {
      const dayNum = parseInt(match[1], 10);
      if (!isNaN(dayNum) && dayNum > maxDay) {
        maxDay = dayNum;
      }
    }
  }

  if (maxDay >= 21) return 'advanced';
  if (maxDay >= 11) return 'intermediate';

  // Fallback to quest count:
  const count = completedQuests.length;
  if (count >= 16) return 'advanced';
  if (count >= 6) return 'intermediate';

  return 'basic';
}

/**
 * 1-Perfect-Question Knowledge Affinity & Polyglot Selector
 * Selects exactly ONE shared question at the intersection of both combatants' verified learning frontiers.
 * Supports polyglot execution (e.g. Player A in Python, Player B in TypeScript) with 100% test case alignment.
 */
export function selectPerfectQuestion(
  host: {
    studentId?: string;
    difficulty?: string;
    preferredLanguage?: string;
    completedQuests?: string[];
    verifiedCompetencies?: string[];
    recentProblemIds?: string[];
  },
  guest: {
    studentId?: string;
    difficulty?: string;
    preferredLanguage?: string;
    completedQuests?: string[];
    verifiedCompetencies?: string[];
    recentProblemIds?: string[];
  },
  overrideProblemId?: string,
  extraRecentIds?: string[]
): CodeWarsProblem {
  console.log(`[SelectPerfectQuestion] Initiating question selection for Host: ${host.studentId || 'unknown'} | Guest: ${guest.studentId || 'unknown'}`);

  // If a valid override problem ID was explicitly requested and exists in catalog
  if (overrideProblemId && overrideProblemId !== 'auto') {
    const directMatch = CODE_WARS_PROBLEMS_CATALOG.find((p) => p.id === overrideProblemId);
    if (directMatch) {
      console.log(`[SelectPerfectQuestion] Direct override requested -> Using problem: ${directMatch.id} (${directMatch.title})`);
      return directMatch;
    }
  }

  const hostTier = getStudentCurriculumTier(host.completedQuests, host.verifiedCompetencies);
  const guestTier = getStudentCurriculumTier(guest.completedQuests, guest.verifiedCompetencies);

  console.log(`[SelectPerfectQuestion] Frontier Tiers evaluated -> Host Tier: ${hostTier} (${host.completedQuests?.length || 0} quests) | Guest Tier: ${guestTier} (${guest.completedQuests?.length || 0} quests)`);

  // Shared Learning Frontier: Clamped to the lowest common denominator
  // Neither student gets an alien question they have not studied!
  let targetTier: CurriculumTier = 'basic';
  if (TIER_ORDER[hostTier] >= 3 && TIER_ORDER[guestTier] >= 3) {
    targetTier = 'advanced';
  } else if (TIER_ORDER[hostTier] >= 2 && TIER_ORDER[guestTier] >= 2) {
    targetTier = 'intermediate';
  } else {
    targetTier = 'basic';
  }

  // If both players specifically requested a tier that is within their shared frontier, respect it
  const hostReq = host.difficulty;
  const guestReq = guest.difficulty;
  if (hostReq && guestReq && hostReq !== 'any' && guestReq !== 'any' && hostReq === guestReq) {
    const reqTier = hostReq as CurriculumTier;
    if (TIER_ORDER[reqTier] && TIER_ORDER[reqTier] <= TIER_ORDER[targetTier]) {
      targetTier = reqTier;
      console.log(`[SelectPerfectQuestion] Mutual preference applied within verified frontier: ${targetTier}`);
    } else {
      console.log(`[SelectPerfectQuestion] Requested tier '${reqTier}' exceeds verified frontier '${targetTier}' -> Clamped to protect learner`);
    }
  }

  console.log(`[SelectPerfectQuestion] Final Shared Target Tier: ${targetTier}`);

  // Language Compatibility Guard
  const hostLang = (host.preferredLanguage || 'typescript').toLowerCase();
  const guestLang = (guest.preferredLanguage || 'typescript').toLowerCase();

  const isLangSupported = (problem: CodeWarsProblem, lang: string): boolean => {
    const normalized = (lang === 'js' || lang === 'javascript') ? 'typescript' : (lang === 'py' ? 'python' : lang);
    return Boolean(problem.starterCode && problem.starterCode[normalized]);
  };

  // Filter problems by tier and polyglot support
  let candidates = CODE_WARS_PROBLEMS_CATALOG.filter((p) => {
    if (p.difficulty !== targetTier) return false;
    return isLangSupported(p, hostLang) && isLangSupported(p, guestLang);
  });

  // Fallback to basic tier if no candidates found in target tier
  if (candidates.length === 0) {
    console.warn(`[SelectPerfectQuestion] No problems found in tier '${targetTier}' supporting [${hostLang}, ${guestLang}]. Falling back to basic tier.`);
    candidates = CODE_WARS_PROBLEMS_CATALOG.filter((p) => p.difficulty === 'basic' && isLangSupported(p, hostLang) && isLangSupported(p, guestLang));
  }

  // If still empty (e.g. exotic language), ignore language constraint and use basic catalog
  if (candidates.length === 0) {
    candidates = CODE_WARS_PROBLEMS_CATALOG.filter((p) => p.difficulty === 'basic');
  }

  // Combine recent problem IDs to avoid immediate repeats
  const recentSet = new Set<string>([
    ...(host.recentProblemIds || []),
    ...(guest.recentProblemIds || []),
    ...(extraRecentIds || []),
  ]);

  const freshCandidates = candidates.filter((p) => !recentSet.has(p.id));
  const pool = freshCandidates.length > 0 ? freshCandidates : candidates;

  // Pick candidate
  const chosenIndex = Math.floor(Math.random() * pool.length);
  const selected = pool[chosenIndex] || CODE_WARS_PROBLEMS_CATALOG[0];

  console.log(`[SelectPerfectQuestion] Perfect Question Chosen: [${selected.id}] "${selected.title}" (Tier: ${selected.difficulty}, Competency: ${selected.competencyId}) - Candidates: ${pool.length}`);

  return selected;
}

export interface ArenaPlayerProgress {
  testsPassed: number;
  totalTests: number;
  score: number;
  submitted: boolean;
  code: string;
  logs?: string;
  lastActiveAt?: number;
  language?: string;
  submissionAttempts?: number;
  failedAttempts?: number;
  lastRunTimestamp?: number;
}

export interface ArenaRoom {
  id: string;
  roomCode: string;
  problemId: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'production';
  timeLimitSeconds: number;
  status: 'waiting' | 'ready' | 'in_progress' | 'completed' | 'cancelled';
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostReady: boolean;
  hostProgress: ArenaPlayerProgress;
  hostDeviceId?: string;
  hostLanguage?: string;
  guestId?: string;
  guestName?: string;
  guestAvatar?: string;
  guestReady: boolean;
  guestProgress: ArenaPlayerProgress;
  guestDeviceId?: string;
  guestLanguage?: string;
  winnerId?: string;
  startedAt?: number;
  endedAt?: number;
  createdAt: number;
  // Code War Rules & Competitive Dynamics
  firstBloodClaimedBy?: string;
  firstBloodClaimedAt?: number;
  cleanBonusAwardedTo?: string;
  tieBreakerReason?: string;
  hostScore?: number;
  guestScore?: number;
  events?: any[];
  // Authoritative Elo & Match Settlement
  eloApplied?: boolean;
  hostEloDelta?: number;
  guestEloDelta?: number;
  hostNewElo?: number;
  guestNewElo?: number;
  hostXpAward?: number;
  guestXpAward?: number;
  hostPinsAward?: number;
  guestPinsAward?: number;
}

export interface QueueTicket {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  difficulty: string;
  eloRating: number;
  enqueuedAt: number;
  deviceId?: string;
  preferredLanguage?: string;
  knowledgeScore?: number;
  completedQuests?: string[];
  verifiedCompetencies?: string[];
  recentProblemIds?: string[];
}

interface ArenaRoomRow {
  id: string;
  room_code: string;
  problem_id: string;
  difficulty: ArenaRoom['difficulty'];
  time_limit_seconds: number;
  status: ArenaRoom['status'];
  host_id: string;
  host_name: string;
  host_avatar: string | null;
  host_ready: boolean | null;
  host_progress: ArenaPlayerProgress | null;
  guest_id: string | null;
  guest_name: string | null;
  guest_avatar: string | null;
  guest_ready: boolean | null;
  guest_progress: ArenaPlayerProgress | null;
  winner_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string | null;
}

interface QueueRow {
  student_id: string;
  student_name: string;
  student_avatar: string | null;
  difficulty: string | null;
  elo_rating: number | null;
  status: 'searching' | 'matched' | 'cancelled';
  matched_room_code: string | null;
}

// Local-dev fallback only (no database). On Vercel several server instances run at once, so the
// database is the source of truth; a per-instance copy would be stale and overwrite other players.
const inMemoryRooms = new Map<string, ArenaRoom>();
const inMemoryCodes = new Map<string, { code: string; logs?: string }>();
const inMemoryQueue: QueueTicket[] = [];
const inMemoryMatches = new Map<string, string>(); // waiting studentId → room code (local fallback)

const QUEUE_TTL_MS = 60000;
const difficultyFits = (a: string, b: string) => a === 'any' || b === 'any' || a === b;

const MAX_CODE_CHARS = 50000;
const emptyProgress = (): ArenaPlayerProgress => ({ testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '', submissionAttempts: 0, failedAttempts: 0 });
const normalizeCode = (roomCode: string) => roomCode.toUpperCase().trim();
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ARENA-${code}`;
}

function rowToRoom(data: ArenaRoomRow): ArenaRoom {
  const hostProg = data.host_progress || emptyProgress();
  const guestProg = data.guest_progress || emptyProgress();
  return {
    id: data.id,
    roomCode: data.room_code,
    problemId: data.problem_id,
    difficulty: data.difficulty,
    timeLimitSeconds: data.time_limit_seconds,
    status: data.status,
    hostId: data.host_id,
    hostName: data.host_name,
    hostAvatar: data.host_avatar || '',
    hostReady: Boolean(data.host_ready),
    hostProgress: hostProg,
    hostLanguage: hostProg.language || 'typescript',
    guestId: data.guest_id || undefined,
    guestName: data.guest_name || undefined,
    guestAvatar: data.guest_avatar || undefined,
    guestReady: Boolean(data.guest_ready),
    guestProgress: guestProg,
    guestLanguage: guestProg.language || 'typescript',
    winnerId: data.winner_id || undefined,
    startedAt: data.started_at ? new Date(data.started_at).getTime() : undefined,
    endedAt: data.ended_at ? new Date(data.ended_at).getTime() : undefined,
    createdAt: new Date(data.created_at).getTime(),
  };
}

/** The room as a given viewer may see it: nobody sees the opponent's code or logs before the match ends. */
export function viewRoomFor(room: ArenaRoom, viewerId: string | null): ArenaRoom {
  const view = clone(room);
  const isHost = viewerId !== null && viewerId === room.hostId;
  const isGuest = viewerId !== null && viewerId === room.guestId;
  const reveal = room.status === 'completed' && (isHost || isGuest);
  if (!reveal) {
    if (!isHost) { view.hostProgress.code = ''; delete view.hostProgress.logs; }
    if (!isGuest) { view.guestProgress.code = ''; delete view.guestProgress.logs; }
  }
  return view;
}

type LoadedRoom = { room: ArenaRoom; version: string | null };

export class ArenaPvPStore {
  /** Database first; the in-memory copy is used only when the database is unreachable. */
  private static async loadRoom(roomCode: string): Promise<LoadedRoom | null> {
    const code = normalizeCode(roomCode);
    try {
      const { data, error } = await getSupabaseAdmin().from('arena_rooms').select('*').eq('room_code', code).maybeSingle();
      if (!error) {
        if (!data) return null;
        const row = data as ArenaRoomRow;
        const room = rowToRoom(row);
        inMemoryRooms.set(code, room);
        return { room, version: row.updated_at };
      }
      console.warn('[ArenaPvPStore] arena_rooms read failed, using local copy:', error.message);
    } catch (err) {
      console.warn('[ArenaPvPStore] arena_rooms unreachable, using local copy:', err);
    }
    const local = inMemoryRooms.get(code);
    return local ? { room: clone(local), version: null } : null;
  }

  /**
   * Create a new battle room
   */
  static async createRoom(params: {
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    hostDeviceId?: string;
    hostLanguage?: string;
    problemId: string;
    difficulty?: 'basic' | 'intermediate' | 'advanced' | 'production';
    timeLimitSeconds?: number;
    roomCode?: string;
  }): Promise<ArenaRoom> {
    const roomCode = params.roomCode || generateRoomCode();
    const now = Date.now();

    // Resolve 'auto' or tier-based request to a concrete catalog challenge
    let finalProblemId = params.problemId;
    let finalDifficulty = params.difficulty || 'intermediate';
    if (!finalProblemId || finalProblemId === 'auto' || finalProblemId.startsWith('tier_')) {
      const targetDiff = finalProblemId?.startsWith('tier_')
        ? (finalProblemId.replace('tier_', '') as CurriculumTier)
        : (finalDifficulty as CurriculumTier);
      const candidates = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === targetDiff);
      const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : CODE_WARS_PROBLEMS_CATALOG[0];
      finalProblemId = chosen.id;
      finalDifficulty = chosen.difficulty as any;
    }

    console.log(`[ArenaPvPStore.createRoom] Creating room code: ${roomCode} for host: ${params.hostId} (${params.hostName}) | problem: ${finalProblemId} (${finalDifficulty}) | language: ${params.hostLanguage || 'typescript'}`);

    const room: ArenaRoom = {
      id: `room_${now}_${Math.random().toString(36).substring(2, 7)}`,
      roomCode,
      problemId: finalProblemId,
      difficulty: finalDifficulty,
      timeLimitSeconds: params.timeLimitSeconds || 600,
      status: 'waiting',
      hostId: params.hostId,
      hostName: params.hostName,
      hostAvatar: params.hostAvatar || '',
      hostDeviceId: params.hostDeviceId,
      hostLanguage: params.hostLanguage || 'typescript',
      hostReady: false,
      hostProgress: { ...emptyProgress(), language: params.hostLanguage || 'typescript' },
      guestReady: false,
      guestProgress: { ...emptyProgress(), language: 'typescript' },
      guestLanguage: 'typescript',
      createdAt: now,
    };

    inMemoryRooms.set(roomCode, room);

    try {
      const { error } = await getSupabaseAdmin().from('arena_rooms').insert({
        room_code: room.roomCode,
        problem_id: room.problemId,
        difficulty: room.difficulty,
        time_limit_seconds: room.timeLimitSeconds,
        status: room.status,
        host_id: room.hostId,
        host_name: room.hostName,
        host_avatar: room.hostAvatar,
        host_ready: room.hostReady,
        host_progress: room.hostProgress,
        guest_ready: room.guestReady,
        guest_progress: room.guestProgress,
      });
      if (error) console.warn('[ArenaPvPStore] arena_rooms insert failed:', error.message);
    } catch (err) {
      console.warn('[ArenaPvPStore] arena_rooms insert failed:', err);
    }

    return room;
  }

  /**
   * Get room by code
   */
  static async getRoom(roomCode: string): Promise<ArenaRoom | null> {
    const loaded = await this.loadRoom(roomCode);
    return loaded ? loaded.room : null;
  }

  /**
   * Update room state. Compare-and-swap on updated_at: if the other player changed the room
   * between our read and our write, re-read and re-apply instead of overwriting their change.
   * The updater returns null to leave the room unchanged.
   */
  static async updateRoom(
    roomCode: string,
    updater: (room: ArenaRoom) => ArenaRoom | null
  ): Promise<ArenaRoom | null> {
    const code = normalizeCode(roomCode);
    for (let attempt = 0; attempt < 5; attempt++) {
      const loaded = await this.loadRoom(code);
      if (!loaded) return null;
      const updated = updater(clone(loaded.room));
      if (!updated) return null;

      if (loaded.version === null) {
        inMemoryRooms.set(code, updated);
        return updated;
      }

      const { data, error } = await getSupabaseAdmin()
        .from('arena_rooms')
        .update({
          status: updated.status,
          host_ready: updated.hostReady,
          host_progress: updated.hostProgress,
          guest_id: updated.guestId ?? null,
          guest_name: updated.guestName ?? null,
          guest_avatar: updated.guestAvatar ?? null,
          guest_ready: updated.guestReady,
          guest_progress: updated.guestProgress,
          winner_id: updated.winnerId ?? null,
          started_at: updated.startedAt ? new Date(updated.startedAt).toISOString() : null,
          ended_at: updated.endedAt ? new Date(updated.endedAt).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('room_code', code)
        .eq('updated_at', loaded.version)
        .select('room_code');

      if (error) {
        console.warn('[ArenaPvPStore] arena_rooms update failed:', error.message);
        return null;
      }
      if (Array.isArray(data) && data.length > 0) {
        inMemoryRooms.set(code, updated);
        return updated;
      }
      // Lost the race: someone else updated the room first. Try again on the fresh state.
    }
    console.warn('[ArenaPvPStore] arena_rooms update gave up after concurrent changes:', code);
    return null;
  }

  /**
   * Join an existing room. A taken guest slot is never reassigned.
   */
  static async joinRoom(params: {
    roomCode: string;
    guestId: string;
    guestName: string;
    guestAvatar?: string;
    guestDeviceId?: string;
    guestLanguage?: string;
  }): Promise<{ success: boolean; room?: ArenaRoom; error?: string }> {
    console.log(`[ArenaPvPStore.joinRoom] Guest joining room: ${params.roomCode} | guestId: ${params.guestId} (${params.guestName}) | language: ${params.guestLanguage || 'typescript'}`);
    let failure: string | null = null;
    let actualGuestId = params.guestId;

    const room = await this.updateRoom(params.roomCode, (r) => {
      if (r.status === 'completed' || r.status === 'cancelled') { failure = 'This match has already concluded.'; return null; }

      // Check device ID: if the same user account is testing on two devices (or two tabs)
      const isDifferentDevice = Boolean(
        params.guestDeviceId && r.hostDeviceId && params.guestDeviceId !== r.hostDeviceId
      );

      // If same user ID and same device, it is host re-entering
      if (r.hostId === params.guestId && !isDifferentDevice) {
        failure = null;
        return null;
      }

      // If already the guest re-entering
      if (r.guestId === params.guestId || (r.guestDeviceId && r.guestDeviceId === params.guestDeviceId)) {
        failure = null;
        return null;
      }

      // If room already full
      if (r.guestId && r.guestId !== params.guestId) {
        failure = 'This battle room is already full.';
        return null;
      }

      // If same user ID but DIFFERENT device, allocate distinct challenger ID
      if (r.hostId === params.guestId && isDifferentDevice) {
        actualGuestId = `${params.guestId}_challenger`;
      }

      r.guestId = actualGuestId;
      r.guestName = params.guestName || 'Challenger';
      r.guestAvatar = params.guestAvatar || '';
      r.guestDeviceId = params.guestDeviceId;
      if (params.guestLanguage) {
        r.guestLanguage = params.guestLanguage;
        r.guestProgress.language = params.guestLanguage;
      }
      return r;
    });

    if (room) return { success: true, room };
    if (failure) return { success: false, error: failure };

    // Host or existing guest re-entering
    const existing = await this.getRoom(params.roomCode);
    if (existing && (existing.hostId === params.guestId || existing.guestId === params.guestId || existing.guestId === `${params.guestId}_challenger`)) {
      return { success: true, room: existing };
    }
    return { success: false, error: 'Room not found. Please check the code.' };
  }

  /** Keeps a player's code private (service role only) until the match is over. */
  static async saveCode(roomCode: string, playerId: string, code: string, logs?: string, submitted = false): Promise<void> {
    const key = `${normalizeCode(roomCode)}::${playerId}`;
    const entry = { code: code.slice(0, MAX_CODE_CHARS), logs: typeof logs === 'string' ? logs.slice(0, MAX_CODE_CHARS) : undefined };
    inMemoryCodes.set(key, entry);
    try {
      const { error } = await getSupabaseAdmin().from('arena_room_submissions').upsert({
        room_code: normalizeCode(roomCode),
        player_id: playerId,
        code: entry.code,
        logs: entry.logs ?? null,
        submitted,
        updated_at: new Date().toISOString(),
      });
      if (error) console.warn('[ArenaPvPStore] arena_room_submissions write failed:', error.message);
    } catch (err) {
      console.warn('[ArenaPvPStore] arena_room_submissions write failed:', err);
    }
  }

  private static async loadCodes(roomCode: string): Promise<Map<string, { code: string; logs?: string }>> {
    const code = normalizeCode(roomCode);
    const codes = new Map<string, { code: string; logs?: string }>();
    inMemoryCodes.forEach((v, k) => { if (k.startsWith(`${code}::`)) codes.set(k.slice(code.length + 2), v); });
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('arena_room_submissions')
        .select('player_id, code, logs')
        .eq('room_code', code);
      if (!error && Array.isArray(data)) {
        for (const r of data as { player_id: string; code: string; logs: string | null }[]) {
          codes.set(r.player_id, { code: r.code, logs: r.logs ?? undefined });
        }
      }
    } catch (err) {
      console.warn('[ArenaPvPStore] arena_room_submissions read failed:', err);
    }
    return codes;
  }

  /** After the match ends, both players' code goes into the room for the side-by-side review. */
  /**

   * Authoritative Elo & XP settlement when a match concludes.

   * Calculates Elo deltas, updates users table, writes to xp_ledger, and attaches rewards.

   */

  static async settleMatch(room: ArenaRoom): Promise<ArenaRoom> {

    if (room.status !== 'completed' || !room.winnerId || room.eloApplied) {

      return room;

    }



    const hostId = room.hostId;
    const guestId = room.guestId || 'guest';
    console.log(`[ArenaPvPStore.settleMatch] Settling match ${room.roomCode} | Winner: ${room.winnerId} | Host: ${hostId} | Guest: ${guestId}`);
    let hostElo = 1200;
    let guestElo = 1200;



    try {

      const admin = getSupabaseAdmin();

      const { data: hostUser } = await admin.from('users').select('arena_elo').eq('id', hostId).maybeSingle();

      if (hostUser?.arena_elo && typeof hostUser.arena_elo === 'number') {

        hostElo = hostUser.arena_elo;

      }

      if (guestId && guestId !== 'guest') {

        const { data: guestUser } = await admin.from('users').select('arena_elo').eq('id', guestId).maybeSingle();

        if (guestUser?.arena_elo && typeof guestUser.arena_elo === 'number') {

          guestElo = guestUser.arena_elo;

        }

      }

    } catch (err) {

      console.warn('[ArenaPvPStore] Could not fetch current Elo ratings:', err);

    }



    const result = calculateEloMatch({

      hostId,

      guestId,

      hostElo,

      guestElo,

      winnerId: room.winnerId,

    });



    // Code War Rule 3: First Blood Bonus (+25 XP, +5 Elo)
    if (room.firstBloodClaimedBy) {
      if (room.firstBloodClaimedBy === hostId) {
        result.hostXpAward += 25;
        result.hostDelta += 5;
        result.hostNewElo += 5;
      } else if (room.firstBloodClaimedBy === guestId) {
        result.guestXpAward += 25;
        result.guestDelta += 5;
        result.guestNewElo += 5;
      }
    }

    // Code War Rule 4: Clean Execution Bonus (+15 XP for passing on 1st submission)
    if (room.cleanBonusAwardedTo) {
      if (room.cleanBonusAwardedTo === hostId) {
        result.hostXpAward += 15;
      } else if (room.cleanBonusAwardedTo === guestId) {
        result.guestXpAward += 15;
      }
    }

    room.eloApplied = true;

    room.hostEloDelta = result.hostDelta;

    room.guestEloDelta = result.guestDelta;

    room.hostNewElo = result.hostNewElo;

    room.guestNewElo = result.guestNewElo;

    room.hostXpAward = result.hostXpAward;

    room.guestXpAward = result.guestXpAward;

    room.hostPinsAward = result.hostPinsAward;

    room.guestPinsAward = result.guestPinsAward;

    console.log(`[ArenaPvPStore.settleMatch] Match ${room.roomCode} settled | Host Delta: ${result.hostDelta} (New: ${result.hostNewElo}), Guest Delta: ${result.guestDelta} (New: ${result.guestNewElo}), FirstBlood: ${room.firstBloodClaimedBy || 'none'}`);

    // Cache in memory

    inMemoryRooms.set(normalizeCode(room.roomCode), clone(room));



    // Persist to Supabase if available

    try {

      const admin = getSupabaseAdmin();

      const isHostWin = room.winnerId === hostId;

      const isHostLoss = room.winnerId === guestId;



      const { data: hostProfile } = await admin.from('users')

        .select('arena_wins, arena_losses, xp_total, weekly_xp, pins')

        .eq('id', hostId)

        .maybeSingle();



      if (hostProfile) {

        await admin.from('users').update({

          arena_elo: result.hostNewElo,

          arena_wins: (hostProfile.arena_wins || 0) + (isHostWin ? 1 : 0),

          arena_losses: (hostProfile.arena_losses || 0) + (isHostLoss ? 1 : 0),

          xp_total: (hostProfile.xp_total || 0) + result.hostXpAward,

          weekly_xp: (hostProfile.weekly_xp || 0) + result.hostXpAward,

          pins: (hostProfile.pins || 0) + result.hostPinsAward,

        }).eq('id', hostId);



        await admin.from('xp_ledger').insert({

          user_id: hostId,

          amount: result.hostXpAward,

          reason: `arena_pvp:${room.roomCode}`,

          created_at: new Date().toISOString(),

        });

      }



      if (guestId && guestId !== 'guest') {

        const isGuestWin = room.winnerId === guestId;

        const isGuestLoss = room.winnerId === hostId;



        const { data: guestProfile } = await admin.from('users')

          .select('arena_wins, arena_losses, xp_total, weekly_xp, pins')

          .eq('id', guestId)

          .maybeSingle();



        if (guestProfile) {

          await admin.from('users').update({

            arena_elo: result.guestNewElo,

            arena_wins: (guestProfile.arena_wins || 0) + (isGuestWin ? 1 : 0),

            arena_losses: (guestProfile.arena_losses || 0) + (isGuestLoss ? 1 : 0),

            xp_total: (guestProfile.xp_total || 0) + result.guestXpAward,

            weekly_xp: (guestProfile.weekly_xp || 0) + result.guestXpAward,

            pins: (guestProfile.pins || 0) + result.guestPinsAward,

          }).eq('id', guestId);



          await admin.from('xp_ledger').insert({

            user_id: guestId,

            amount: result.guestXpAward,

            reason: `arena_pvp:${room.roomCode}`,

            created_at: new Date().toISOString(),

          });

        }

      }

    } catch (persistErr) {

      console.warn('[ArenaPvPStore] Failed to persist Elo match settlement:', persistErr);

    }



    return room;

  }



  static async publishCodesIfCompleted(room: ArenaRoom): Promise<ArenaRoom> {
    if (room.status !== 'completed') return room;
    const codes = await this.loadCodes(room.roomCode);
    const published = await this.updateRoom(room.roomCode, (r) => {
      if (r.status !== 'completed') return null;
      const host = codes.get(r.hostId);
      const guest = r.guestId ? codes.get(r.guestId) : undefined;
      const hostChanged = host && host.code !== r.hostProgress.code;
      const guestChanged = guest && guest.code !== r.guestProgress.code;
      if (!hostChanged && !guestChanged) return null;
      if (host) { r.hostProgress.code = host.code; r.hostProgress.logs = host.logs; }
      if (guest) { r.guestProgress.code = guest.code; r.guestProgress.logs = guest.logs; }
      return r;
    });
    return published || (await this.getRoom(room.roomCode)) || room;
  }

  /** A started 1v1 room: the waiting player hosts, the player who found them is the guest. */
  private static async createMatchedRoom(
    host: QueueTicket,
    guest: QueueTicket,
    defaultProblemId: string,
    roomCode?: string
  ): Promise<ArenaRoom | null> {
    console.log(`[ArenaPvPStore.createMatchedRoom] Pairing Host: ${host.studentId} (${host.preferredLanguage || 'ts'}) with Guest: ${guest.studentId} (${guest.preferredLanguage || 'ts'})`);

    const recentProblemIds = [
      ...(host.recentProblemIds || []),
      ...(guest.recentProblemIds || []),
    ];

    const perfectProblem = selectPerfectQuestion(host, guest, defaultProblemId, recentProblemIds);

    const created = await this.createRoom({
      hostId: host.studentId,
      hostName: host.studentName,
      hostAvatar: host.studentAvatar,
      hostDeviceId: host.deviceId,
      hostLanguage: host.preferredLanguage || 'typescript',
      problemId: perfectProblem.id,
      difficulty: perfectProblem.difficulty,
      timeLimitSeconds: perfectProblem.timeLimitSeconds || 600,
      roomCode,
    });

    console.log(`[ArenaPvPStore.createMatchedRoom] Room created: ${created.roomCode} with 1-Perfect-Question: ${perfectProblem.id} (${perfectProblem.difficulty})`);

    return this.updateRoom(created.roomCode, (r) => {
      r.guestId = guest.studentId;
      r.guestName = guest.studentName;
      r.guestAvatar = guest.studentAvatar;
      r.guestDeviceId = guest.deviceId;
      r.guestLanguage = guest.preferredLanguage || 'typescript';
      r.guestProgress.language = guest.preferredLanguage || 'typescript';
      r.hostProgress.language = host.preferredLanguage || 'typescript';
      r.hostReady = true;
      r.guestReady = true;
      r.status = 'in_progress';
      r.startedAt = Date.now();
      return r;
    });
  }

  /** The room a waiting player was matched into by someone else, if any (consumes the ticket). */
  private static async takeMatchedRoom(studentId: string, row: QueueRow | null): Promise<ArenaRoom | null> {
    if (!row || row.status !== 'matched' || !row.matched_room_code) return null;
    await getSupabaseAdmin().from('arena_matchmaking_queue').delete().eq('student_id', studentId);
    const room = await this.getRoom(row.matched_room_code);
    return room && room.status !== 'completed' && room.status !== 'cancelled' ? room : null;
  }

  /**
   * Matchmaking through arena_matchmaking_queue, shared by every server instance.
   * - A waiting player's ticket is 'searching'; each poll refreshes it (tickets older than 60s are ignored).
   * - A new player claims one waiting ticket atomically (update … where status = 'searching'), so two
   *   players can never claim the same opponent, then creates the started room.
   * - The waiting player's next poll finds their ticket 'matched' and receives that room.
   */
  static async matchmake(ticket: QueueTicket, defaultProblemId: string): Promise<{ matched: boolean; room?: ArenaRoom }> {
    const admin = getSupabaseAdmin();
    const queue = () => admin.from('arena_matchmaking_queue');
    try {
      // 1. Did someone already match me?
      const { data: mineData, error: mineErr } = await queue()
        .select('student_id, student_name, student_avatar, difficulty, elo_rating, status, matched_room_code')
        .eq('student_id', ticket.studentId)
        .maybeSingle();
      if (mineErr) throw new Error(mineErr.message);
      const mine = mineData as QueueRow | null;
      const already = await this.takeMatchedRoom(ticket.studentId, mine);
      if (already) return { matched: true, room: already };

      // 2. Claim a waiting opponent.
      const since = new Date(Date.now() - QUEUE_TTL_MS).toISOString();
      const { data: waitingData, error: waitErr } = await queue()
        .select('student_id, student_name, student_avatar, difficulty, elo_rating, status, matched_room_code')
        .eq('status', 'searching')
        .neq('student_id', ticket.studentId)
        .gte('created_at', since)
        .order('created_at', { ascending: true })
        .limit(10);
      if (waitErr) throw new Error(waitErr.message);

      for (const cand of (waitingData ?? []) as QueueRow[]) {
        if (!difficultyFits(ticket.difficulty, cand.difficulty || 'any')) continue;
        const roomCode = generateRoomCode();
        const { data: claimed } = await queue()
          .update({ status: 'matched', matched_room_code: roomCode })
          .eq('student_id', cand.student_id)
          .eq('status', 'searching')
          .select('student_id');
        if (!Array.isArray(claimed) || claimed.length === 0) continue; // someone else got them first

        const inMemHost = inMemoryQueue.find((t) => t.studentId === cand.student_id);
        const host: QueueTicket = {
          studentId: cand.student_id,
          studentName: cand.student_name,
          studentAvatar: cand.student_avatar || undefined,
          difficulty: cand.difficulty || 'any',
          eloRating: cand.elo_rating || 1200,
          enqueuedAt: Date.now(),
          preferredLanguage: inMemHost?.preferredLanguage || 'typescript',
          completedQuests: inMemHost?.completedQuests || [],
          verifiedCompetencies: inMemHost?.verifiedCompetencies || [],
          recentProblemIds: inMemHost?.recentProblemIds || [],
        };

        if (!inMemHost) {
          try {
            const baseHostId = cand.student_id.split('_')[0];
            const { data: hostUserData } = await admin
              .from('users')
              .select('completed_quests, onboarding_answers')
              .eq('id', baseHostId)
              .maybeSingle();
            if (hostUserData?.completed_quests && Array.isArray(hostUserData.completed_quests)) {
              host.completedQuests = hostUserData.completed_quests;
            }
          } catch (fetchErr) {
            console.warn('[ArenaPvPStore] Could not fetch host completed_quests from users table:', fetchErr);
          }
        }
        const room = await this.createMatchedRoom(host, ticket, defaultProblemId, roomCode);
        if (!room) {
          // Could not create the room: put the opponent back in the queue.
          await queue().update({ status: 'searching', matched_room_code: null }).eq('student_id', cand.student_id);
          continue;
        }
        await queue().delete().eq('student_id', ticket.studentId);
        return { matched: true, room };
      }

      // 3. Wait: refresh my ticket, but never overwrite a match made in the meantime.
      const ticketFields = {
        student_name: ticket.studentName,
        student_avatar: ticket.studentAvatar ?? null,
        difficulty: ticket.difficulty,
        elo_rating: ticket.eloRating,
        created_at: new Date().toISOString(),
      };
      const { data: refreshed } = await queue()
        .update(ticketFields)
        .eq('student_id', ticket.studentId)
        .eq('status', 'searching')
        .select('student_id');
      if (Array.isArray(refreshed) && refreshed.length > 0) return { matched: false };

      const { data: nowData } = await queue()
        .select('student_id, student_name, student_avatar, difficulty, elo_rating, status, matched_room_code')
        .eq('student_id', ticket.studentId)
        .maybeSingle();
      const matchedMeanwhile = await this.takeMatchedRoom(ticket.studentId, nowData as QueueRow | null);
      if (matchedMeanwhile) return { matched: true, room: matchedMeanwhile };
      if (nowData) {
        // A stale or cancelled ticket: reuse it.
        await queue().update({ ...ticketFields, status: 'searching', matched_room_code: null }).eq('student_id', ticket.studentId);
      } else {
        await queue().insert({ student_id: ticket.studentId, status: 'searching', ...ticketFields });
      }
      return { matched: false };
    } catch (err) {
      console.warn('[ArenaPvPStore] matchmaking queue unavailable, using local queue:', err);
      return this.matchmakeLocally(ticket, defaultProblemId);
    }
  }

  /** Local-dev fallback (no database): same rules, one process. */
  private static async matchmakeLocally(ticket: QueueTicket, defaultProblemId: string): Promise<{ matched: boolean; room?: ArenaRoom }> {
    console.log(`[ArenaPvPStore.matchmakeLocally] Local matchmaking for student: ${ticket.studentId} (queue size: ${inMemoryQueue.length})`);
    const waitingFor = inMemoryMatches.get(ticket.studentId);
    if (waitingFor) {
      inMemoryMatches.delete(ticket.studentId);
      const room = await this.getRoom(waitingFor);
      if (room) {
        console.log(`[ArenaPvPStore.matchmakeLocally] Found local match for ${ticket.studentId} -> ${room.roomCode}`);
        return { matched: true, room };
      }
    }

    const now = Date.now();
    const opponent = inMemoryQueue.find((t) =>
      now - t.enqueuedAt < QUEUE_TTL_MS && t.studentId !== ticket.studentId && difficultyFits(ticket.difficulty, t.difficulty));
    if (opponent) {
      console.log(`[ArenaPvPStore.matchmakeLocally] Opponent found in local queue: ${opponent.studentId} for ${ticket.studentId}`);
      inMemoryQueue.splice(inMemoryQueue.indexOf(opponent), 1);
      const room = await this.createMatchedRoom(opponent, ticket, defaultProblemId);
      if (room) {
        inMemoryMatches.set(opponent.studentId, room.roomCode);
        const mine = inMemoryQueue.findIndex((t) => t.studentId === ticket.studentId);
        if (mine !== -1) inMemoryQueue.splice(mine, 1);
        console.log(`[ArenaPvPStore.matchmakeLocally] Created local matched room: ${room.roomCode} for ${opponent.studentId} and ${ticket.studentId}`);
        return { matched: true, room };
      }
    }

    const existingIdx = inMemoryQueue.findIndex((t) => t.studentId === ticket.studentId);
    if (existingIdx !== -1) inMemoryQueue[existingIdx] = ticket;
    else inMemoryQueue.push(ticket);
    console.log(`[ArenaPvPStore.matchmakeLocally] Student ${ticket.studentId} waiting in local queue (size: ${inMemoryQueue.length})`);
    return { matched: false };
  }

  /** Leave the queue (a match already made for this student is left for their next poll to expire). */
  static async cancelQueue(studentId: string): Promise<void> {
    const idx = inMemoryQueue.findIndex((t) => t.studentId === studentId);
    if (idx !== -1) inMemoryQueue.splice(idx, 1);
    try {
      await getSupabaseAdmin().from('arena_matchmaking_queue').delete().eq('student_id', studentId).eq('status', 'searching');
    } catch (err) {
      console.warn('[ArenaPvPStore] matchmaking queue cancel failed:', err);
    }
  }
}
