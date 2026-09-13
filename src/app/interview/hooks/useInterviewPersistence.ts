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

  // Check for recoverable draft on load (IV-08 FIX: localStorage with 4-hour TTL)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = getDraftKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: ActiveInterviewDraft = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < 4 * 3600 * 1000 && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setActiveSessionDraft(parsed);
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {}
  }, [userId, getDraftKey]);

  // Persist draft while in-flight
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

  // Sessions History State (localStorage + remote API)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const historyKey = `pinit_interview_history_${userId || 'anon'}`;
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
        }
      }
    } catch (e) {
      console.warn('[Interview History] Failed to parse localStorage history');
    }

    if (userId) {
      getAuthHeaders().then(async (headers: Record<string, string>) => {
        try {
          const res = await fetch('/api/interview/history', { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.sessions) && data.sessions.length > 0) {
              setSessions(prev => {
                const map = new Map<string, InterviewSessionRecord>();
                data.sessions.forEach((s: InterviewSessionRecord) => map.set(s.id, s));
                prev.forEach(s => map.set(s.id, s));
                const merged = Array.from(map.values()).slice(0, 20);
                try {
                  localStorage.setItem(historyKey, JSON.stringify(merged));
                } catch {}
                return merged;
              });
            }
          }
        } catch (err) {
          console.warn('[Interview History] Failed to fetch remote session history:', err);
        }
      }).catch(() => {});
    }
  }, [userId]);

  const saveSessionHistory = async (newSession: InterviewSessionRecord) => {
    setSessions(prev => {
      const updated = [newSession, ...prev.filter(s => s.id !== newSession.id)].slice(0, 20);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pinit_interview_history_${userId || 'anon'}`, JSON.stringify(updated));
        } catch (e) {
          console.warn('[Interview History] Storage quota exceeded; trimmed history.');
        }
      }
      return updated;
    });

    try {
      const headers = await getAuthHeaders();
      await fetch('/api/interview/history', {
        method: 'POST',
        headers,
        body: JSON.stringify(newSession)
      });
    } catch (e) {
      console.warn('[Interview History] Remote sync failed, stored locally.');
    }
  };

  const clearSessionHistory = () => {
    if (window.confirm('Are you sure you want to clear all your interview session history?')) {
      setSessions([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`pinit_interview_history_${userId || 'anon'}`);
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
