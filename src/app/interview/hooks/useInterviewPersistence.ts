'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/lib/store/useAppStore';
import {
  Stage,
  Message,
  InterviewSessionRecord,
  ActiveInterviewDraft,
  getAuthHeaders
} from '../interviewTypes';

interface UseInterviewPersistenceProps {
  userId?: string;
  isInterviewActive: boolean;
  activeStage: Stage;
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  domainSubTopic: string;
  difficulty: 'easy' | 'normal' | 'hard';
  starStep: number;
  messages: Message[];
  codeContent: string;
  selectedLang: 'java' | 'python' | 'javascript' | 'sql';
  elapsedSeconds: number;
  fillerWordCount: number;
  activeTeacherId: string;
  latestTopology: any;
}

const DRAFT_CACHE_TTL_MS = 30_000; // 30-second TTL for mid-answer autosave

export function useInterviewPersistence({
  userId,
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
  activeTeacherId,
  latestTopology
}: UseInterviewPersistenceProps) {
  const [sessions, setSessions] = useState<InterviewSessionRecord[]>([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState<InterviewSessionRecord | null>(null);
  const [activeSessionDraft, setActiveSessionDraft] = useState<ActiveInterviewDraft | null>(null);

  const getDraftKey = useCallback((uid?: string) => {
    const validUid = uid && uid !== 'guest' ? uid : 'active_session';
    return `pinit_active_interview_draft_${validUid}`;
  }, []);

  // Check for recoverable draft on load (30-second TTL for mid-answer autosave buffer)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = getDraftKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: ActiveInterviewDraft = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < DRAFT_CACHE_TTL_MS && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setActiveSessionDraft(parsed);
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {}
  }, [userId, getDraftKey]);

  // Persist short-term draft while in-flight (autosave buffer)
  useEffect(() => {
    if (!isInterviewActive || activeStage === 'results') return;
    try {
      const key = getDraftKey(userId);
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
        activeTeacherId,
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
    activeTeacherId,
    latestTopology,
    userId,
    getDraftKey
  ]);

  // Sessions History State (Supabase is source of truth on mount)
  useEffect(() => {
    if (!userId || userId === 'guest') return;
    let isMounted = true;

    async function loadSessionsFromSupabase() {
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        const { data, error } = await supabase
          .from('interview_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && Array.isArray(data) && data.length > 0 && isMounted) {
          const formatted: InterviewSessionRecord[] = data.map((row: any) => {
            const evalData = row.evaluation || {};
            return {
              id: evalData.id || row.id,
              date: evalData.date || new Date(row.created_at).toLocaleDateString(),
              timestamp: evalData.timestamp || row.created_at,
              type: row.mode || evalData.type || 'technical',
              domainStream: evalData.domainStream || 'tech',
              domainSubTopic: row.domain || evalData.domainSubTopic || '',
              difficulty: row.pressure_mode || evalData.difficulty || 'normal',
              verdict: evalData.verdict || (row.overall_score >= 70 ? 'Pass' : 'Needs Work'),
              score: row.overall_score ?? evalData.score ?? 0,
              radar: evalData.radar || {},
              telemetry: evalData.telemetry || {},
              summary: evalData.summary || '',
              strengths: evalData.strengths || [],
              improvements: evalData.improvements || [],
              topology: evalData.topology || null,
              messages: row.messages || evalData.messages || [],
            };
          });
          setSessions(formatted);
          return;
        }
      } catch (err) {
        console.warn('[Interview History] Direct Supabase fetch error, trying API fallback:', err);
      }

      // API fallback
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/interview/history', { headers });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data.sessions) && data.sessions.length > 0) {
            setSessions(data.sessions);
          }
        }
      } catch (e) {
        console.warn('[Interview History] Failed to fetch session history:', e);
      }
    }

    loadSessionsFromSupabase();
    return () => { isMounted = false; };
  }, [userId]);

  const saveSessionHistory = async (newSession: InterviewSessionRecord) => {
    // 1. Optimistic UI update
    setSessions(prev => [newSession, ...prev.filter(s => s.id !== newSession.id)].slice(0, 20));

    // 2. Persist authoritatively through server-side history API with cryptographic signature verification
    if (userId && userId !== 'guest') {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/interview/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...newSession,
            overallScore: Math.round(Number(newSession.score) || 0),
            evaluationToken: newSession.evaluationToken
          })
        });
        if (!res.ok) {
          console.warn('[Interview History] Server rejected history sync:', res.status);
        }
      } catch (e) {
        console.warn('[Interview History] Remote sync failed:', e);
      }
    }
  };

  const clearSessionHistory = async () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear all your interview session history?')) {
      setSessions([]);
      if (userId && userId !== 'guest') {
        try {
          const { supabase } = await import('@/lib/supabaseClient');
          await supabase.from('interview_sessions').delete().eq('user_id', userId);
        } catch (err) {
          console.warn('[Interview History] Failed to delete sessions from Supabase:', err);
        }
      }
    }
  };

  const discardActiveSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getDraftKey(userId));
      } catch {}
    }
    setActiveSessionDraft(null);
    toast.info('Session Discarded', 'Previous in-progress interview attempt was discarded.');
  }, [userId, getDraftKey]);

  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getDraftKey(userId));
      } catch {}
    }
    setActiveSessionDraft(null);
  }, [userId, getDraftKey]);

  return {
    sessions,
    selectedHistorySession,
    setSelectedHistorySession,
    activeSessionDraft,
    setActiveSessionDraft,
    saveSessionHistory,
    clearSessionHistory,
    discardActiveSession,
    clearDraft,
    getDraftKey
  };
}
