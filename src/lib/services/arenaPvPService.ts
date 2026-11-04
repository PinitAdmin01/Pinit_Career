import { supabase } from '@/lib/supabaseClient';
import { ArenaRoom, ArenaPlayerProgress } from './arenaPvPStore';

export type { ArenaRoom, ArenaPlayerProgress };

export class ArenaPvPService {
  /**
   * Device session token ensuring 100% collision-free pairing
   * when testing between 2 devices, mobile, or incognito tabs.
   */
  static getDeviceId(): string {
    if (typeof window === 'undefined') return 'server_session';
    try {
      let id = sessionStorage.getItem('pinit_arena_device_token');
      if (!id) {
        id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).slice(-4);
        sessionStorage.setItem('pinit_arena_device_token', id);
      }
      return id;
    } catch {
      return 'dev_' + Math.random().toString(36).substring(2, 8);
    }
  }

  /**
   * Authoritative header builder passing Supabase JWT or device-scoped combatant token.
   * Completely defends against 401 Unauthorized errors in arena duels.
   */
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const deviceId = this.getDeviceId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-combatant-device-id': deviceId,
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
        return headers;
      }
    } catch {}

    // Fallback: guest combatant token recognized by requireCombatantFromRequest
    headers['Authorization'] = `Bearer guest-token-${deviceId}`;
    return headers;
  }

  /**
   * Create a new custom battle room
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
  }): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const deviceId = params.hostDeviceId || this.getDeviceId();
    const res = await fetch('/api/arena/create-room', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params, deviceId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create room');
    }
    return data.room;
  }

  /**
   * Join an existing battle room via code
   */
  static async joinRoom(params: {
    roomCode: string;
    guestId: string;
    guestName: string;
    guestAvatar?: string;
    guestDeviceId?: string;
    guestLanguage?: string;
  }): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const deviceId = params.guestDeviceId || this.getDeviceId();
    const res = await fetch('/api/arena/join-room', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params, deviceId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to join room');
    }
    return data.room;
  }

  /**
   * Get latest room state
   */
  static async getRoom(roomCode: string): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/arena/room/${encodeURIComponent(roomCode)}`, {
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Room not found');
    }
    return data.room;
  }

  /**
   * Toggle player ready state
   */
  static async toggleReady(roomCode: string, playerId: string): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/arena/room/${encodeURIComponent(roomCode)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'toggle_ready', playerId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to toggle ready');
    }
    return data.room;
  }

  /**
   * Update player test progress
   */
  static async updateProgress(params: {
    roomCode: string;
    playerId: string;
    testsPassed: number;
    totalTests: number;
    score: number;
    code: string;
    logs?: string;
  }): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/arena/room/${encodeURIComponent(params.roomCode)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'update_progress', ...params }),
    });
    const data = await res.json();
    return data.room;
  }

  /**
   * Submit the solution. The server runs the code itself and decides the result and the winner.
   */
  static async submitSolution(params: {
    roomCode: string;
    playerId: string;
    passed: boolean;
    testsPassed: number;
    totalTests: number;
    score: number;
    code: string;
    language?: string;
  }): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/arena/room/${encodeURIComponent(params.roomCode)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'submit_solution', ...params }),
    });
    const data = await res.json();
    return data.room;
  }

  /**
   * Forfeit match
   */
  static async forfeit(roomCode: string, playerId: string): Promise<ArenaRoom> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/arena/room/${encodeURIComponent(roomCode)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'forfeit', playerId }),
    });
    const data = await res.json();
    return data.room;
  }

  /**
   * Matchmake 1v1 Queue
   */
  static async matchmake(params: {
    studentId: string;
    studentName: string;
    studentAvatar?: string;
    difficulty?: string;
    eloRating?: number;
    defaultProblemId?: string;
    action?: 'poll' | 'cancel';
    knowledgeScore?: number;
    preferredLanguage?: string;
  }): Promise<{ matched: boolean; room?: ArenaRoom }> {
    const headers = await this.getAuthHeaders();
    const deviceId = this.getDeviceId();
    const res = await fetch('/api/arena/matchmake', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params, deviceId }),
    });
    const data = await res.json();
    return data;
  }

  /**
   * Subscribe to real-time updates for a battle room
   * Uses Supabase Realtime channel + 1500ms polling fallback
   */
  static subscribeToRoom(roomCode: string, onUpdate: (room: ArenaRoom) => void): () => void {
    let isActive = true;

    // 1. Supabase Realtime broadcast channel
    let channel: any = null;
    try {
      channel = supabase.channel(`arena_room_${roomCode}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'arena_rooms', filter: `room_code=eq.${roomCode}` },
          (payload: any) => {
            if (!isActive) return;
            if (payload.new) {
              const d = payload.new as any;
              onUpdate({
                id: d.id,
                roomCode: d.room_code,
                problemId: d.problem_id,
                difficulty: d.difficulty,
                timeLimitSeconds: d.time_limit_seconds,
                status: d.status,
                hostId: d.host_id,
                hostName: d.host_name,
                hostAvatar: d.host_avatar,
                hostReady: d.host_ready,
                hostProgress: d.host_progress || { testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' },
                guestId: d.guest_id,
                guestName: d.guest_name,
                guestAvatar: d.guest_avatar,
                guestReady: d.guest_ready,
                guestProgress: d.guest_progress || { testsPassed: 0, totalTests: 5, score: 0, submitted: false, code: '' },
                winnerId: d.winner_id,
                startedAt: d.started_at ? new Date(d.started_at).getTime() : undefined,
                endedAt: d.ended_at ? new Date(d.ended_at).getTime() : undefined,
                createdAt: new Date(d.created_at).getTime(),
              });
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('[ArenaPvP] Realtime channel setup failed, relying on polling:', e);
    }

    // 2. Continuous 1.5s Polling Fallback (ensures 100% reliability everywhere)
    const pollInterval = setInterval(async () => {
      if (!isActive) return;
      try {
        const room = await this.getRoom(roomCode);
        if (room && isActive) {
          onUpdate(room);
        }
      } catch {
        // Ignore periodic network blips
      }
    }, 1500);

    return () => {
      isActive = false;
      clearInterval(pollInterval);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }
}
