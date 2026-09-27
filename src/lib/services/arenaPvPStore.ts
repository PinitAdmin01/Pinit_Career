import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export interface ArenaPlayerProgress {
  testsPassed: number;
  totalTests: number;
  score: number;
  submitted: boolean;
  code: string;
  logs?: string;
  lastActiveAt?: number;
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
  guestId?: string;
  guestName?: string;
  guestAvatar?: string;
  guestReady: boolean;
  guestProgress: ArenaPlayerProgress;
  winnerId?: string;
  startedAt?: number;
  endedAt?: number;
  createdAt: number;
}

export interface QueueTicket {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  difficulty: string;
  eloRating: number;
  enqueuedAt: number;
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
const emptyProgress = (): ArenaPlayerProgress => ({ testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' });
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
    hostProgress: data.host_progress || emptyProgress(),
    guestId: data.guest_id || undefined,
    guestName: data.guest_name || undefined,
    guestAvatar: data.guest_avatar || undefined,
    guestReady: Boolean(data.guest_ready),
    guestProgress: data.guest_progress || emptyProgress(),
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
    problemId: string;
    difficulty?: 'basic' | 'intermediate' | 'advanced' | 'production';
    timeLimitSeconds?: number;
    roomCode?: string;
  }): Promise<ArenaRoom> {
    const roomCode = params.roomCode || generateRoomCode();
    const now = Date.now();

    const room: ArenaRoom = {
      id: `room_${now}_${Math.random().toString(36).substring(2, 7)}`,
      roomCode,
      problemId: params.problemId,
      difficulty: params.difficulty || 'intermediate',
      timeLimitSeconds: params.timeLimitSeconds || 600,
      status: 'waiting',
      hostId: params.hostId,
      hostName: params.hostName,
      hostAvatar: params.hostAvatar || '',
      hostReady: false,
      hostProgress: emptyProgress(),
      guestReady: false,
      guestProgress: emptyProgress(),
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
  }): Promise<{ success: boolean; room?: ArenaRoom; error?: string }> {
    let failure: string | null = null;
    const room = await this.updateRoom(params.roomCode, (r) => {
      if (r.status === 'completed' || r.status === 'cancelled') { failure = 'This match has already concluded.'; return null; }
      if (r.hostId === params.guestId || r.guestId === params.guestId) { failure = null; return null; }
      if (r.guestId) { failure = 'This battle room is already full.'; return null; }
      r.guestId = params.guestId;
      r.guestName = params.guestName;
      r.guestAvatar = params.guestAvatar || '';
      return r;
    });
    if (room) return { success: true, room };
    if (failure) return { success: false, error: failure };
    // Host re-entering, or this student is already the guest.
    const existing = await this.getRoom(params.roomCode);
    if (existing && (existing.hostId === params.guestId || existing.guestId === params.guestId)) {
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
    const created = await this.createRoom({
      hostId: host.studentId,
      hostName: host.studentName,
      hostAvatar: host.studentAvatar,
      problemId: defaultProblemId,
      difficulty: (guest.difficulty !== 'any' ? guest.difficulty : host.difficulty !== 'any' ? host.difficulty : 'intermediate') as ArenaRoom['difficulty'],
      timeLimitSeconds: 600,
      roomCode,
    });
    return this.updateRoom(created.roomCode, (r) => {
      r.guestId = guest.studentId;
      r.guestName = guest.studentName;
      r.guestAvatar = guest.studentAvatar;
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

        const host: QueueTicket = {
          studentId: cand.student_id,
          studentName: cand.student_name,
          studentAvatar: cand.student_avatar || undefined,
          difficulty: cand.difficulty || 'any',
          eloRating: cand.elo_rating || 1200,
          enqueuedAt: Date.now(),
        };
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
    const waitingFor = inMemoryMatches.get(ticket.studentId);
    if (waitingFor) {
      inMemoryMatches.delete(ticket.studentId);
      const room = await this.getRoom(waitingFor);
      if (room) return { matched: true, room };
    }

    const now = Date.now();
    const opponent = inMemoryQueue.find((t) =>
      now - t.enqueuedAt < QUEUE_TTL_MS && t.studentId !== ticket.studentId && difficultyFits(ticket.difficulty, t.difficulty));
    if (opponent) {
      inMemoryQueue.splice(inMemoryQueue.indexOf(opponent), 1);
      const room = await this.createMatchedRoom(opponent, ticket, defaultProblemId);
      if (room) {
        inMemoryMatches.set(opponent.studentId, room.roomCode);
        const mine = inMemoryQueue.findIndex((t) => t.studentId === ticket.studentId);
        if (mine !== -1) inMemoryQueue.splice(mine, 1);
        return { matched: true, room };
      }
    }

    const existingIdx = inMemoryQueue.findIndex((t) => t.studentId === ticket.studentId);
    if (existingIdx !== -1) inMemoryQueue[existingIdx] = ticket;
    else inMemoryQueue.push(ticket);
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
