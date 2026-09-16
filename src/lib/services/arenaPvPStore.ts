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

// In-memory fallback stores for sub-millisecond local dev or when Supabase table isn't migrated yet
const inMemoryRooms = new Map<string, ArenaRoom>();
const inMemoryQueue: QueueTicket[] = [];

function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ARENA-${code}`;
}

export class ArenaPvPStore {
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
  }): Promise<ArenaRoom> {
    const roomCode = generateRoomCode();
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
      hostProgress: { testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' },
      guestReady: false,
      guestProgress: { testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' },
      createdAt: now,
    };

    inMemoryRooms.set(roomCode, room);

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('arena_rooms').insert({
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
        created_at: new Date(now).toISOString(),
      });
    } catch (err) {
      console.warn('[ArenaPvPStore] Supabase write failed, operating on memory store:', err);
    }

    return room;
  }

  /**
   * Get room by code
   */
  static async getRoom(roomCode: string): Promise<ArenaRoom | null> {
    const formattedCode = roomCode.toUpperCase().trim();

    // Check memory first
    if (inMemoryRooms.has(formattedCode)) {
      return inMemoryRooms.get(formattedCode)!;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('arena_rooms')
        .select('*')
        .eq('room_code', formattedCode)
        .maybeSingle();

      if (!error && data) {
        const room: ArenaRoom = {
          id: data.id,
          roomCode: data.room_code,
          problemId: data.problem_id,
          difficulty: data.difficulty,
          timeLimitSeconds: data.time_limit_seconds,
          status: data.status,
          hostId: data.host_id,
          hostName: data.host_name,
          hostAvatar: data.host_avatar,
          hostReady: data.host_ready,
          hostProgress: data.host_progress || { testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' },
          guestId: data.guest_id,
          guestName: data.guest_name,
          guestAvatar: data.guest_avatar,
          guestReady: data.guest_ready,
          guestProgress: data.guest_progress || { testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' },
          winnerId: data.winner_id,
          startedAt: data.started_at ? new Date(data.started_at).getTime() : undefined,
          endedAt: data.ended_at ? new Date(data.ended_at).getTime() : undefined,
          createdAt: new Date(data.created_at).getTime(),
        };
        inMemoryRooms.set(formattedCode, room);
        return room;
      }
    } catch {
      // Ignore and fallback
    }

    return null;
  }

  /**
   * Join an existing room
   */
  static async joinRoom(params: {
    roomCode: string;
    guestId: string;
    guestName: string;
    guestAvatar?: string;
  }): Promise<{ success: boolean; room?: ArenaRoom; error?: string }> {
    const room = await this.getRoom(params.roomCode);
    if (!room) {
      return { success: false, error: 'Room not found. Please check the code.' };
    }

    if (room.status === 'completed' || room.status === 'cancelled') {
      return { success: false, error: 'This match has already concluded.' };
    }

    // If student is host re-entering
    if (room.hostId === params.guestId) {
      return { success: true, room };
    }

    // If guest slot is taken by another student
    if (room.guestId && room.guestId !== params.guestId && room.status === 'in_progress') {
      return { success: false, error: 'This battle room is already full.' };
    }

    room.guestId = params.guestId;
    room.guestName = params.guestName;
    room.guestAvatar = params.guestAvatar || '';
    inMemoryRooms.set(room.roomCode, room);

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('arena_rooms').update({
        guest_id: room.guestId,
        guest_name: room.guestName,
        guest_avatar: room.guestAvatar,
        updated_at: new Date().toISOString(),
      }).eq('room_code', room.roomCode);
    } catch (err) {
      console.warn('[ArenaPvPStore] Supabase join update failed:', err);
    }

    return { success: true, room };
  }

  /**
   * Update room state (ready, progress, submit, leave)
   */
  static async updateRoom(
    roomCode: string,
    updater: (room: ArenaRoom) => ArenaRoom | null
  ): Promise<ArenaRoom | null> {
    const room = await this.getRoom(roomCode);
    if (!room) return null;

    const updated = updater(room);
    if (!updated) return null;

    inMemoryRooms.set(room.roomCode, updated);

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('arena_rooms').update({
        status: updated.status,
        host_ready: updated.hostReady,
        host_progress: updated.hostProgress,
        guest_ready: updated.guestReady,
        guest_progress: updated.guestProgress,
        winner_id: updated.winnerId,
        started_at: updated.startedAt ? new Date(updated.startedAt).toISOString() : null,
        ended_at: updated.endedAt ? new Date(updated.endedAt).toISOString() : null,
        updated_at: new Date().toISOString(),
      }).eq('room_code', updated.roomCode);
    } catch (err) {
      console.warn('[ArenaPvPStore] Supabase sync update failed:', err);
    }

    return updated;
  }

  /**
   * Matchmake ticket queue
   */
  static async matchmake(ticket: QueueTicket, defaultProblemId: string): Promise<{ matched: boolean; room?: ArenaRoom }> {
    const now = Date.now();
    // Purge stale tickets (> 60s)
    const validQueue = inMemoryQueue.filter(t => now - t.enqueuedAt < 60000 && t.studentId !== ticket.studentId);

    // Look for matching opponent
    const opponentIndex = validQueue.findIndex(t => 
      ticket.difficulty === 'any' || t.difficulty === 'any' || t.difficulty === ticket.difficulty
    );

    if (opponentIndex !== -1) {
      const opponent = validQueue.splice(opponentIndex, 1)[0];
      // Remove from global queue
      const globalIdx = inMemoryQueue.findIndex(t => t.studentId === opponent.studentId);
      if (globalIdx !== -1) inMemoryQueue.splice(globalIdx, 1);

      // Create matched room with both players ready
      const room = await this.createRoom({
        hostId: opponent.studentId,
        hostName: opponent.studentName,
        hostAvatar: opponent.studentAvatar,
        problemId: defaultProblemId,
        difficulty: (ticket.difficulty !== 'any' ? ticket.difficulty : opponent.difficulty !== 'any' ? opponent.difficulty : 'intermediate') as any,
        timeLimitSeconds: 600,
      });

      room.guestId = ticket.studentId;
      room.guestName = ticket.studentName;
      room.guestAvatar = ticket.studentAvatar;
      room.hostReady = true;
      room.guestReady = true;
      room.status = 'in_progress';
      room.startedAt = Date.now();

      inMemoryRooms.set(room.roomCode, room);

      return { matched: true, room };
    }

    // If no match found, enqueue
    const existingIdx = inMemoryQueue.findIndex(t => t.studentId === ticket.studentId);
    if (existingIdx !== -1) {
      inMemoryQueue[existingIdx] = ticket;
    } else {
      inMemoryQueue.push(ticket);
    }

    return { matched: false };
  }

  static cancelQueue(studentId: string) {
    const idx = inMemoryQueue.findIndex(t => t.studentId === studentId);
    if (idx !== -1) {
      inMemoryQueue.splice(idx, 1);
    }
  }
}
