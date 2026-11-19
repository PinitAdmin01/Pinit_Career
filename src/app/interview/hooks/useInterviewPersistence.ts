'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  selectedLang: 'java' | 'python' | 'javascript' | 'sql' | 'cpp';
  codingAttempt: number;
  codingProblem: any;
  elapsedSeconds: number;
  fillerWordCount: number;
  activeTeacherId: string;
  latestTopology: any;
  liveSessionId?: string | null;
  tabSwitchCount?: number;
  targetCompany?: string;
  round4StartMsgIndex?: number;
}

const DRAFT_CACHE_TTL_MS = 7_200_000; // 2-hour TTL for session recovery buffer

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
  codingAttempt,
  codingProblem,
  elapsedSeconds,
  fillerWordCount,
  activeTeacherId,
  latestTopology,
  liveSessionId,
  tabSwitchCount,
  targetCompany,
  round4StartMsgIndex
}: UseInterviewPersistenceProps) {
  const [sessions, setSessions] = useState<InterviewSessionRecord[]>([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState<InterviewSessionRecord | null>(null);
  const [activeSessionDraft, setActiveSessionDraft] = useState<ActiveInterviewDraft | null>(null);

  const elapsedSecondsRef = useRef(elapsedSeconds);
  elapsedSecondsRef.current = elapsedSeconds;

  const getDraftKey = useCallback((uid?: string) => {
    const validUid = uid && uid !== 'guest' ? uid : 'active_session';
    return `pinit_active_interview_draft_${validUid}`;
  }, []);

  const getHistoryKey = useCallback((uid?: string) => {
    const validUid = uid && uid !== 'guest' ? uid : 'guest';
    return `pinit_interview_history_${validUid}`;
  }, []);

  // Check for recoverable draft on load (2-hour TTL for mid-answer autosave buffer)
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

  const persistDraftNow = useCallback(() => {
    if (typeof window === 'undefined' || !isInterviewActive || activeStage === 'results') return;
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
        codingAttempt,
        codingProblem,
        elapsedSeconds: elapsedSecondsRef.current,
        fillerWordCount,
        activeTeacherId,
        latestTopology,
        liveSessionId: liveSessionId ?? null,
        tabSwitchCount: tabSwitchCount || 0,
        targetCompany: targetCompany || '',
        round4StartMsgIndex: round4StartMsgIndex || 0,
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
    codingAttempt,
    codingProblem,
    fillerWordCount,
    activeTeacherId,
    latestTopology,
    liveSessionId,
    tabSwitchCount,
    targetCompany,
    round4StartMsgIndex,
    userId,
    getDraftKey
  ]);

  // Persist immediately on semantic state changes without 1s JSON serialization churn
  useEffect(() => {
    persistDraftNow();
  }, [persistDraftNow]);

  // Periodic checkpoint every 15s + pagehide/beforeunload flush to keep elapsed time fresh
  useEffect(() => {
    if (typeof window === 'undefined' || !isInterviewActive || activeStage === 'results') return;
    const interval = setInterval(persistDraftNow, 15000);
    window.addEventListener('beforeunload', persistDraftNow);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', persistDraftNow);
    };
  }, [isInterviewActive, activeStage, persistDraftNow]);

  // Sessions History State (Hydrate local cache first, then sync with Supabase / API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem(getHistoryKey(userId));
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed.slice(0, 20));
          }
        }
      } catch {}
    }

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
              targetCompany: evalData.targetCompany || '',
              defendedTechStack: Array.isArray(evalData.defendedTechStack) ? evalData.defendedTechStack : [],
              questionBreakdown: Array.isArray(evalData.questionBreakdown) ? evalData.questionBreakdown : [],
              answerQuality: evalData.answerQuality || null,
              messages: row.transcript || row.messages || evalData.messages || [],
            };
          });
          setSessions(formatted);
          try {
            localStorage.setItem(getHistoryKey(userId), JSON.stringify(formatted));
          } catch {}
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
            try {
              localStorage.setItem(getHistoryKey(userId), JSON.stringify(data.sessions.slice(0, 20)));
            } catch {}
          }
        }
      } catch (e) {
        console.warn('[Interview History] Failed to fetch session history:', e);
      }
    }

    loadSessionsFromSupabase();
    return () => { isMounted = false; };
  }, [userId, getHistoryKey]);

  const saveSessionHistory = async (newSession: InterviewSessionRecord) => {
    // 1. Optimistic UI update + offline-resilient localStorage cache
    setSessions(prev => {
      const updated = [newSession, ...prev.filter(s => s.id !== newSession.id)].slice(0, 20);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(getHistoryKey(userId), JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

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
      try {
        localStorage.removeItem(getHistoryKey(userId));
      } catch {}
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
