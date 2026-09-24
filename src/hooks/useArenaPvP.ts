'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArenaPvPService, ArenaRoom } from '@/lib/services/arenaPvPService';

export function useArenaPvP(roomCode: string | null, studentId: string) {
  const [room, setRoom] = useState<ArenaRoom | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isHost = room?.hostId === studentId;
  const isGuest = room?.guestId === studentId;
  const myProgress = isHost ? room?.hostProgress : room?.guestProgress;
  const opponentProgress = isHost ? room?.guestProgress : room?.hostProgress;
  const opponentName = isHost ? room?.guestName : room?.hostName;
  const opponentAvatar = isHost ? room?.guestAvatar : room?.hostAvatar;
  const isOpponentReady = isHost ? room?.guestReady : room?.hostReady;
  const isMyReady = isHost ? room?.hostReady : room?.guestReady;

  // Subscribe to room updates
  useEffect(() => {
    if (!roomCode) {
      setRoom(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Initial fetch
    ArenaPvPService.getRoom(roomCode)
      .then((initial) => {
        setRoom(initial);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load room');
        setLoading(false);
      });

    // Realtime subscription
    const unsubscribe = ArenaPvPService.subscribeToRoom(roomCode, (updated) => {
      setRoom(updated);
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode]);

  const toggleReady = useCallback(async () => {
    if (!roomCode) return;
    try {
      const updated = await ArenaPvPService.toggleReady(roomCode, studentId);
      setRoom(updated);
    } catch (err: any) {
      setError(err.message || 'Error toggling ready');
    }
  }, [roomCode, studentId]);

  const updateProgress = useCallback(async (params: {
    testsPassed: number;
    totalTests: number;
    score: number;
    code: string;
    logs?: string;
  }) => {
    if (!roomCode) return;
    try {
      const updated = await ArenaPvPService.updateProgress({
        roomCode,
        playerId: studentId,
        ...params,
      });
      setRoom(updated);
    } catch {
      // Ignored
    }
  }, [roomCode, studentId]);

  const submitSolution = useCallback(async (params: {
    passed: boolean;
    testsPassed: number;
    totalTests: number;
    score: number;
    code: string;
  }) => {
    if (!roomCode) return;
    try {
      const updated = await ArenaPvPService.submitSolution({
        roomCode,
        playerId: studentId,
        ...params,
      });
      setRoom(updated);
    } catch (err: any) {
      setError(err.message || 'Error submitting solution');
    }
  }, [roomCode, studentId]);

  const forfeit = useCallback(async () => {
    if (!roomCode) return;
    try {
      const updated = await ArenaPvPService.forfeit(roomCode, studentId);
      setRoom(updated);
    } catch (err: any) {
      setError(err.message || 'Error forfeiting');
    }
  }, [roomCode, studentId]);

  return {
    room,
    loading,
    error,
    isHost,
    isGuest,
    myProgress,
    opponentProgress,
    opponentName,
    opponentAvatar,
    isOpponentReady,
    isMyReady,
    toggleReady,
    updateProgress,
    submitSolution,
    forfeit,
  };
}
