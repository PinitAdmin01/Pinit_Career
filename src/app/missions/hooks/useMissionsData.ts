'use client';

import { useEffect, useCallback, useRef } from 'react';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { speakWithAvatar, stopSpeaking, preloadTTS } from '@/lib/tts';
import { readRecentRoleplayTitles, rememberRoleplayTitle } from '@/lib/missions/roleplayEngine';
import { useMissionsState } from './useMissionsState';

type MissionsState = ReturnType<typeof useMissionsState>;

interface UseMissionsDataProps {
  state: MissionsState;
  cOS: any;
  user: any;
  refresh: () => Promise<void>;
  searchParams: any;
}

export function useMissionsData({
  state,
  cOS,
  user,
  refresh,
  searchParams
}: UseMissionsDataProps) {
  const {
    roleplayActive, setRoleplayActive,
    roleplayLoading, setRoleplayLoading,
    isUnlocking, setIsUnlocking,
    roleplayScenario, setScenario,
    roleplayHistory, setRoleplayHistory,
    animState, setAnimState,
    evaluationReport, setEvaluationReport,
    setEvaluationLoading,
    timerCount, setTimerCount,
    selectedChoiceIdx, setSelectedChoiceIdx,
    setQt2Delta,
    setCognitiveLoad,
    setSessionElapsed,
    setSocraticHistory,
    activeTab,
    customSkill, setCustomSkill,
    customRole,
    setGeneratingSkill,
    isRoleplayParam
  } = state;

  const {
    onboardingAnswers,
    setOnboarding,
    completeMission,
    addXp,
    earnPins
  } = cOS;

  // Session elapsed timer
  useEffect(() => {
    if (!roleplayActive || evaluationReport) return;
    const interval = setInterval(() => {
      setSessionElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [roleplayActive, evaluationReport, setSessionElapsed]);

  // Preload TTS on mount and cleanup speech on unmount
  useEffect(() => {
    preloadTTS();
    return () => {
      stopSpeaking();
    };
  }, []);

  // Load Socratic simulation history
  useEffect(() => {
    try {
      const rawHistory = typeof window !== 'undefined' ? localStorage.getItem('pinit_socratic_history') : null;
      if (rawHistory) {
        setSocraticHistory(JSON.parse(rawHistory));
      }
    } catch (err) {
      console.warn("Failed to load Socratic history:", err);
    }
  }, [activeTab, setSocraticHistory]);

  const triggerEvaluation = useCallback(async (finalHistory: any[]) => {
    setEvaluationLoading(true);
    try {
      const res = await fetch('/api/missions/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          history: finalHistory,
          studentName: String(user?.displayName || user?.full_name || 'there'),
        })
      });
      const data = await res.json();
      if (data && data.ok) {
        setEvaluationReport(data.report);
        setQt2Delta(data.qt2_delta);

        completeMission('socratic_roleplay', true);

        const todayStr = new Date().toDateString();
        const hasCompletedToday = onboardingAnswers?.last_streak_date === todayStr;
        const nextTimestamps = [
          ...(onboardingAnswers?.completedMissionsTimestamps || []),
          new Date().toISOString()
        ];

        const currentQT2 = onboardingAnswers?.qt2_score ?? 75;
        const newQT2 = Math.min(100, Math.max(30, currentQT2 + data.qt2_delta));
        const computedMindsetArchetype = data.mindset_archetype || 'Pattern Hunter';
        setOnboarding({
          ...onboardingAnswers,
          qt2_score: newQT2,
          mindset_archetype: computedMindsetArchetype,
          last_streak_date: todayStr,
          completedMissionsTimestamps: nextTimestamps,
        });

        const currentComm = Number(user?.communication_score ?? 75);
        const currentExec = Number(user?.execution_score ?? 75);
        const currentLead = Number(user?.leadership_score ?? 75);
        const currentIntel = Number(user?.intelligence_score ?? 75);
        const currentStreak = Number(cOS.missionOnlyStreak ?? 0);

        const newComm = Math.min(100, Math.max(30, currentComm + (data.communication_delta || 0)));
        const newExec = Math.min(100, Math.max(30, currentExec + (data.execution_delta || 0)));
        const newLead = Math.min(100, Math.max(30, currentLead + (data.leadership_delta || 0)));
        const newIntel = Math.min(100, Math.max(30, currentIntel + (data.intelligence_delta || 0)));
        const newStreak = hasCompletedToday ? currentStreak : currentStreak + 1;

        api.patch('/api/auth/profile', {
          communication_score: newComm,
          execution_score: newExec,
          leadership_score: newLead,
          intelligence_score: newIntel,
          mission_streak: newStreak
        }).then(() => {
          refresh().catch(() => {});
        }).catch(() => {});

        addXp(150, "Socratic Roleplay Cleared");
        earnPins('mission_complete', 10, "Socratic Roleplay Cleared");
        if (hasCompletedToday) {
          toast.success("Evolution Complete! 🧠", `Socratic review compiled. Mindset Archetype evolved to: ${computedMindsetArchetype}. Streak is active for today! +150 XP and +10 Pins awarded.`);
        } else {
          toast.success("Evolution Complete! 🧠", `Socratic review compiled. Mindset Archetype evolved to: ${computedMindsetArchetype}. Streak: 🔥${newStreak} days! +150 XP and +10 Pins awarded.`);
        }

        const lastSpeaker = roleplayScenario?.activeAvatar || 'anish';
        setAnimState('talking');
        speakWithAvatar(
          data.spokenConclusion || "We have reached the end of the crisis simulation. Please review your strategic decision and accountability scores inside the blueprint below.",
          lastSpeaker,
          () => setAnimState('talking'),
          () => setAnimState('idle'),
          false,
          true,
          undefined,
          1.1
        );

        try {
          const rawHistory = typeof window !== 'undefined' ? localStorage.getItem('pinit_socratic_history') : null;
          const historyArr = rawHistory ? JSON.parse(rawHistory) : [];
          const newRecord = {
            id: 'soc_' + Date.now(),
            title: roleplayScenario?.scenarioTitle || "Outage Socratic Crisis Simulation",
            date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            avatar: roleplayScenario?.activeAvatar || "abhijit",
            avatarName: roleplayScenario?.avatarName || "Mr. Abhijit",
            qt2Delta: data.qt2_delta,
            mindsetArchetype: computedMindsetArchetype,
            report: data.report
          };
          historyArr.unshift(newRecord);
          if (typeof window !== 'undefined') {
            localStorage.setItem('pinit_socratic_history', JSON.stringify(historyArr));
          }
          setSocraticHistory(historyArr);
        } catch (err) {
          console.warn("Failed to write simulation record to history:", err);
        }

        api.post('/api/student/activity', {
          action: 'interview_complete',
          meta: { scenarioId: roleplayScenario?.scenarioId, qt2Delta: data.qt2_delta, newQT2 }
        }).catch(() => {});
      } else {
        throw new Error(data.error || "Evaluation failed");
      }
    } catch (err: any) {
      toast.error("Evaluation Error", err.message || "Could not generate final persona report.");
    } finally {
      setEvaluationLoading(false);
    }
  }, [
    user,
    cOS.missionOnlyStreak,
    onboardingAnswers,
    roleplayScenario,
    addXp,
    completeMission,
    earnPins,
    refresh,
    setAnimState,
    setEvaluationLoading,
    setEvaluationReport,
    setOnboarding,
    setQt2Delta,
    setSocraticHistory
  ]);

  const handleSelectChoice = useCallback(async (idx: number) => {
    if (!roleplayScenario || selectedChoiceIdx !== null) return;
    setSelectedChoiceIdx(idx);
    stopSpeaking();

    const selectedChoice = roleplayScenario.choices[idx];
    const userMsg = { role: 'user' as const, content: selectedChoice.text, delta: selectedChoice.delta };
    const updatedHistory = [...roleplayHistory, userMsg];
    const delta = selectedChoice.delta || 0;
    setCognitiveLoad(prev => Math.min(100, Math.max(10, prev + (delta < 0 ? 15 : -10))));
    setRoleplayHistory(updatedHistory);

    setAnimState('thinking');
    try {
      const res = await fetch('/api/missions/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          choice: selectedChoice.text,
          history: updatedHistory,
          studentName: String(user?.displayName || user?.full_name || 'there'),
          role: onboardingAnswers?.role ?? 'Software Developer',
        })
      });
      const data = await res.json();
      if (data && data.ok) {
        setSelectedChoiceIdx(null);
        setTimerCount(25);

        const serverNodeCount = updatedHistory.filter(h => h.role === 'user').length;
        const forceEnd = data.isEnded || serverNodeCount >= 8;

        if (forceEnd) {
          data.isEnded = true;
          data.choices = [];
          setScenario(data);
          const finalMsg = { role: 'assistant' as const, content: data.message };
          setRoleplayHistory(prev => [...prev, finalMsg]);

          setAnimState('talking');
          speakWithAvatar(
            data.message,
            data.activeAvatar,
            () => setAnimState('talking'),
            () => {
              setAnimState('idle');
              setTimeout(() => {
                triggerEvaluation([...updatedHistory, finalMsg]);
              }, 800);
            },
            false,
            true,
            undefined,
            1.1
          );
        } else {
          setScenario(data);
          const nextMsg = { role: 'assistant' as const, content: data.message };
          setRoleplayHistory(prev => [...prev, nextMsg]);

          setAnimState('talking');
          speakWithAvatar(data.message, data.activeAvatar, () => setAnimState('talking'), () => setAnimState('listening'), false, true, undefined, 1.1);
        }
      } else {
        throw new Error(data.error || "Response failed");
      }
    } catch (err: any) {
      toast.error("Communication Error", err.message || "Failed to sync avatar response.");
      setSelectedChoiceIdx(null);
      setAnimState('idle');
    }
  }, [
    roleplayScenario,
    selectedChoiceIdx,
    roleplayHistory,
    user,
    onboardingAnswers?.role,
    setCognitiveLoad,
    setRoleplayHistory,
    setAnimState,
    setSelectedChoiceIdx,
    setTimerCount,
    setScenario,
    triggerEvaluation
  ]);

  // Keep a ref for handleSelectChoice to safely call inside timer without stale closure or missing deps
  const handleSelectChoiceRef = useRef(handleSelectChoice);
  useEffect(() => {
    handleSelectChoiceRef.current = handleSelectChoice;
  }, [handleSelectChoice]);

  // Countdown timer for stress drilling
  useEffect(() => {
    if (!roleplayActive || !roleplayScenario || !roleplayScenario.choices || roleplayScenario.choices.length === 0 || evaluationReport || animState === 'talking') {
      return;
    }
    const interval = setInterval(() => {
      setTimerCount(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [roleplayActive, roleplayScenario, evaluationReport, animState, setTimerCount]);

  // Auto-fail / panic on timeout
  useEffect(() => {
    if (timerCount === 0 && roleplayActive && roleplayScenario && roleplayScenario.choices && roleplayScenario.choices.length > 0 && !evaluationReport && animState !== 'talking') {
      toast.error("Time Expired! ⏳", "Panic option selected automatically due to stress limit.");
      let worstIdx = 0;
      let worstDelta = Infinity;
      roleplayScenario.choices.forEach((c, i) => {
        const d = typeof c.delta === 'number' ? c.delta : 0;
        if (d < worstDelta) {
          worstDelta = d;
          worstIdx = i;
        }
      });
      handleSelectChoiceRef.current(worstIdx);
      setTimerCount(25);
    }
  }, [timerCount, roleplayActive, roleplayScenario, evaluationReport, animState, setTimerCount]);

  const initiateRoleplay = async () => {
    if (roleplayLoading || isUnlocking) return;
    setIsUnlocking(true);
    setRoleplayLoading(true);

    try {
      const ok = cOS.unlockItem('mission:roleplay', 'mission', 'Mindset Roleplay Outage Simulation');
      if (!ok) {
        setRoleplayLoading(false);
        setIsUnlocking(false);
        return;
      }

      setRoleplayActive(true);
      setScenario(null);
      setRoleplayHistory([]);
      setEvaluationReport('');
      setTimerCount(25);
      setCognitiveLoad(30);
      setSessionElapsed(0);
      stopSpeaking();

      // Nonce ID generation: use crypto.randomUUID() (Fixes L215)
      const sessionNonce = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `n_${Date.now()}`;
      const studentName = String(user?.displayName || user?.full_name || 'there');
      const recentTitles = user?.id ? readRecentRoleplayTitles(user.id) : [];

      const res = await fetch('/api/missions/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initialize',
          qt2: onboardingAnswers?.qt2_score ?? 75,
          role: onboardingAnswers?.role ?? 'Software Developer',
          studentName,
          sessionNonce,
          recentTitles,
        })
      });
      const data = await res.json();
      if (data && data.ok) {
        setScenario(data);
        if (user?.id && data.scenarioTitle) rememberRoleplayTitle(user.id, data.scenarioTitle);
        const firstMessage = { role: 'assistant' as const, content: data.message };
        setRoleplayHistory([firstMessage]);

        setAnimState('talking');
        speakWithAvatar(data.message, data.activeAvatar, () => setAnimState('talking'), () => setAnimState('listening'), false, true, 'normal');
      } else {
        throw new Error(data.error || "Initialization failed");
      }
    } catch (err: any) {
      toast.error("Simulation Error", err.message || "Could not launch role-play.");
      setRoleplayActive(false);
    } finally {
      setRoleplayLoading(false);
      setIsUnlocking(false);
    }
  };

  const handleGenerateCustomQuests = async () => {
    if (!customSkill.trim()) {
      toast.error('Skill Required', 'Please enter a skill to train.');
      return;
    }
    setGeneratingSkill(true);
    try {
      await api.post('/api/missions/generate-custom-skill', {
        targetRole: customRole,
        skill: customSkill.trim()
      });
      toast.success('Skill Quests Active! ⚡', `Learning modules for "${customSkill}" have been injected.`);
      setCustomSkill('');
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.reload();
      }, 800);
    } catch (err: any) {
      toast.error('Generation Failed', err.message || 'Could not generate custom quests.');
    } finally {
      setGeneratingSkill(false);
    }
  };

  return {
    initiateRoleplay,
    handleSelectChoice,
    triggerEvaluation,
    handleGenerateCustomQuests
  };
}
