'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMissionsToday, useMissionHistory } from '@/lib/api/hooks';
import { Mission } from './useMissionsState';

export function useMissionsList(
  role: string,
  extraMissions: Mission[],
  setExtraMissions: (missions: Mission[]) => void,
  completedMissions: string[]
) {
  const [generating, setGenerating] = useState(false);

  // Real missions
  const { data: firestoreMissions } = useMissionsToday();
  const { data: historyData } = useMissionHistory();
  const historyMissions = useMemo(() => historyData || [], [historyData]);

  // Pre-seed personal gap closure missions if passed in URL gaps query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gapsParam = new URLSearchParams(window.location.search).get('gaps');
      if (gapsParam) {
        const gapSkills = gapsParam.split(',');
        const seeded: Mission[] = gapSkills.map((skill) => ({
          id: `seeded_${skill.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
          title: `Master ${skill.trim()} Fundamentals`,
          description: `Review core syntax, complete hands-on assignments, and submit evidence of building a sandbox app using ${skill.trim()}.`,
          type: 'skill',
          status: 'pending',
          trust_reward: 25,
          estimated_minutes: 35,
          source_weakness: skill.trim(),
          target_gap: `${skill.trim()} Core Competency`,
          role_requirement: `${role || 'Target Role'} Gap Closure`,
        }));
        setExtraMissions(seeded);
      }
    }
  }, [role, setExtraMissions]);

  const baseMissions: Mission[] = useMemo(() => [
    {
      id: 'python_loops',
      title: 'Complete Python Loops Practice',
      description: 'Solve 3 advanced problems on array manipulation and nested loops.',
      type: 'skill',
      status: completedMissions.includes('python_loops') ? 'completed' : 'pending',
      trust_reward: 15,
      estimated_minutes: 25,
      source_weakness: 'Python',
      target_gap: 'Python Loops & Algorithms',
      role_requirement: `${role || 'SDE'} Benchmark`,
    },
    {
      id: 'react_loops',
      title: 'React Fundamentals Challenge',
      description: 'Implement complex state synchronization hooks across deeply nested components.',
      type: 'skill',
      status: completedMissions.includes('react_loops') ? 'completed' : 'pending',
      trust_reward: 15,
      estimated_minutes: 20,
      source_weakness: 'React Hooks',
      target_gap: 'React Context & Render Loop',
      role_requirement: `${role || 'SDE'} Benchmark`,
    },
    {
      id: 'star_video',
      title: 'Record Video Response for STAR Story',
      description: 'Describe a situation where you managed a critical frontend crash under intense time pressure.',
      type: 'communication',
      status: completedMissions.includes('star_video') ? 'completed' : 'pending',
      trust_reward: 20,
      estimated_minutes: 30,
      source_weakness: 'Behavioral STAR',
      target_gap: 'STAR Communication Framework',
      role_requirement: 'Corporate Readiness Benchmark',
    },
  ], [completedMissions, role]);

  const activeExtra = useMemo(() => extraMissions.map((m) => ({
    ...m,
    status: completedMissions.includes(m.id) ? 'completed' : 'pending',
  })), [extraMissions, completedMissions]);

  const allTodayMissions = useMemo(() => {
    const fsBaseMissions = (firestoreMissions || []).map((m: any) => ({
      ...m,
      status: completedMissions.includes(m.id) ? 'completed' : m.status || 'pending',
    }));
    const localIds = new Set([...activeExtra.map((m) => m.id), ...baseMissions.map((m) => m.id)]);
    const uniqueFs = fsBaseMissions.filter((m: any) => !localIds.has(m.id));
    return [...activeExtra, ...baseMissions, ...uniqueFs];
  }, [firestoreMissions, completedMissions, activeExtra, baseMissions]);

  const pending = useMemo(() => allTodayMissions.filter((m) => m.status === 'pending'), [allTodayMissions]);
  const completed = useMemo(() => allTodayMissions.filter((m) => m.status === 'completed'), [allTodayMissions]);
  const todayPct = allTodayMissions.length ? (completed.length / allTodayMissions.length) * 100 : 0;
  const pastCompleted = useMemo(() => historyMissions.filter((m: any) => m.status === 'completed' || m.status === 'submitted'), [historyMissions]);

  function handleTriggerRegenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 1000);
  }

  const gapClosurePct = allTodayMissions.length
    ? Math.round((completed.length / allTodayMissions.length) * 100)
    : 0;

  return {
    allTodayMissions,
    pending,
    completed,
    todayPct,
    pastCompleted,
    gapClosurePct,
    generating,
    handleTriggerRegenerate
  };
}
