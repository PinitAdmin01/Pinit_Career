'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMissionsToday, useMissionHistory } from '@/lib/api/hooks';
import { Mission } from './useMissionsState';

// Course-specific dynamic mission profiles mapped to active curriculum tracks
const COURSE_MISSION_PROFILES: Record<string, { title: string; desc: string; gap: string }> = {
  python: {
    title: 'Python Production Code Challenge',
    desc: 'Implement optimal data structures, solve list-comprehension tasks, and refactor nested algorithms.',
    gap: 'Python Production Architecture',
  },
  java: {
    title: 'Java JVM & OOP Architecture Challenge',
    desc: 'Verify object lifecycle, garbage collection tuning, and multi-threaded interface patterns.',
    gap: 'Java Enterprise Systems',
  },
  dsa: {
    title: 'Data Structures & Algorithmic Optimization',
    desc: 'Solve dual-pointer array transformations with strict O(N) time and O(1) space constraints.',
    gap: 'Algorithmic Complexity & Optimization',
  },
  cloud: {
    title: 'Cloud Infrastructure & Microservice Orchestration',
    desc: 'Audit container manifests, configure VPC security groups, and deploy resilient cloud services.',
    gap: 'Cloud Architecture & Containers',
  },
  devops: {
    title: 'CI/CD Pipeline Automation & Infrastructure as Code',
    desc: 'Build automated test pipelines, validate Docker build caching, and configure deployment gates.',
    gap: 'DevOps Pipeline Automation',
  },
  cyber: {
    title: 'Application Security & Threat Vector Defense',
    desc: 'Perform vulnerability scanning, sanitize SQL and XSS attack surfaces, and verify token signing.',
    gap: 'Cybersecurity Threat Defense',
  },
  iot: {
    title: 'Edge Device Firmware & Telemetry Streams',
    desc: 'Inspect MQTT broker payloads, optimize low-power packet transmissions, and debug edge protocols.',
    gap: 'IoT Edge Networking & Protocols',
  },
  iot_net: {
    title: 'IoT Network Topology & Sensor Protocols',
    desc: 'Analyze edge gateway routing, Zigbee/LoRaWAN packet framing, and sensor telemetry ingestion.',
    gap: 'IoT Network Infrastructure',
  },
  bcom_acc: {
    title: 'Forensic Transaction Audit & Ledger Reconciliation',
    desc: 'Examine suspicious journal entries, detect phantom balance sheet postings, and balance credit ledgers.',
    gap: 'Forensic Accounting & Audit',
  },
  bcom_fin: {
    title: 'Corporate Valuation & DCF Capital Modeling',
    desc: 'Calculate weighted average cost of capital (WACC), model cash flow projections, and evaluate portfolio risk.',
    gap: 'Corporate Finance & Valuation',
  },
  bcom_mkt: {
    title: 'Brand Positioning & Strategic Campaign Audit',
    desc: 'Map customer acquisition funnels, analyze cohort retention rates, and optimize omnichannel reach.',
    gap: 'Strategic Brand Architecture',
  },
  bcom_aud: {
    title: 'Statutory Compliance & Internal Control Assessment',
    desc: 'Perform materiality thresholds check, test internal SOX/IFRS controls, and verify evidence logs.',
    gap: 'Statutory Audit Assurance',
  },
  bcom_ban: {
    title: 'Banking Treasury Operations & Liquidity Stress Test',
    desc: 'Stress test Basel III capital adequacy ratios, review non-performing assets, and optimize reserve yields.',
    gap: 'Treasury & Credit Risk Management',
  },
  bcom_dmkt: {
    title: 'Digital Attribution & Performance Ad Optimization',
    desc: 'Audit multi-touch attribution models, optimize blended ROAS, and eliminate conversion drop-offs.',
    gap: 'Performance Marketing Analytics',
  },
  bcom_ecom: {
    title: 'E-Commerce Platform Checkout & Conversion Optimization',
    desc: 'Diagnose payment gateway drop-offs, optimize SKU load latency, and engineer frictionless checkout.',
    gap: 'E-Commerce Platform Architecture',
  },
};

export function useMissionsList(
  role: string,
  extraMissions: Mission[],
  setExtraMissions: (missions: Mission[]) => void,
  completedMissions: string[],
  activeCourseId?: string | null,
  weakAreas?: string[]
) {
  const [generating, setGenerating] = useState(false);

  // Real missions from server
  const { data: firestoreMissions, refetch } = useMissionsToday();
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
          description: `Review core principles, complete hands-on assignments, and submit evidence of building an artifact using ${skill.trim()}.`,
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

  // Dynamically generated course and role missions (used when server missions are syncing or fallback)
  const dynamicFallbackMissions: Mission[] = useMemo(() => {
    const cleanCourseKey = (activeCourseId || '').toLowerCase().trim();
    const courseProfile = COURSE_MISSION_PROFILES[cleanCourseKey] || {
      title: `${role || 'Professional'} Core Competency Sprint`,
      desc: `Complete today's active syllabus assignment and submit verified project evidence for ${role || 'Target Role'}.`,
      gap: `${role || 'Target Role'} Benchmark`,
    };

    const primaryWeakness =
      weakAreas && weakAreas.length > 0
        ? weakAreas[0]
        : `${role || 'Professional'} Domain Foundations`;

    return [
      {
        id: `dyn_${cleanCourseKey || 'core'}_challenge`,
        title: courseProfile.title,
        description: courseProfile.desc,
        type: 'skill',
        status: completedMissions.includes(`dyn_${cleanCourseKey || 'core'}_challenge`)
          ? 'completed'
          : 'pending',
        trust_reward: 20,
        estimated_minutes: 25,
        source_weakness: cleanCourseKey || 'Core Syllabus',
        target_gap: courseProfile.gap,
        role_requirement: `${role || 'Target Role'} Invariant`,
      },
      {
        id: `dyn_weakness_${primaryWeakness.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        title: `Overcome ${primaryWeakness} Friction`,
        description: `Targeted deliberate practice to eliminate cognitive friction and master ${primaryWeakness}.`,
        type: 'skill',
        status: completedMissions.includes(
          `dyn_weakness_${primaryWeakness.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        )
          ? 'completed'
          : 'pending',
        trust_reward: 15,
        estimated_minutes: 20,
        source_weakness: primaryWeakness,
        target_gap: `${primaryWeakness} Mastery`,
        role_requirement: `${role || 'Target Role'} Diagnostic Gap`,
      },
      {
        id: `dyn_comm_${(role || 'sde').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        title: `Strategic ${role || 'Professional'} Executive Communication`,
        description: `Deliver a concise, structured executive brief addressing blockers, trade-offs, and timeline commitments.`,
        type: 'communication',
        status: completedMissions.includes(
          `dyn_comm_${(role || 'sde').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        )
          ? 'completed'
          : 'pending',
        trust_reward: 20,
        estimated_minutes: 30,
        source_weakness: 'Executive Presence',
        target_gap: 'Stakeholder Alignment & STAR Communication',
        role_requirement: 'Corporate Readiness Benchmark',
      },
    ];
  }, [completedMissions, role, activeCourseId, weakAreas]);

  const activeExtra = useMemo(
    () =>
      extraMissions.map((m) => ({
        ...m,
        status: completedMissions.includes(m.id) ? 'completed' : 'pending',
      })),
    [extraMissions, completedMissions]
  );

  // Combine dynamic missions: server firestoreMissions take absolute precedence over client fallbacks
  const allTodayMissions = useMemo(() => {
    const fsMissions =
      firestoreMissions && firestoreMissions.length > 0
        ? firestoreMissions.map((m: any) => ({
            ...m,
            status: completedMissions.includes(m.id) ? 'completed' : m.status || 'pending',
          }))
        : dynamicFallbackMissions;

    const localIds = new Set(activeExtra.map((m) => m.id));
    const uniqueServerOrFallback = fsMissions.filter((m: any) => !localIds.has(m.id));
    return [...activeExtra, ...uniqueServerOrFallback];
  }, [firestoreMissions, completedMissions, activeExtra, dynamicFallbackMissions]);

  const pending = useMemo(() => allTodayMissions.filter((m) => m.status === 'pending'), [allTodayMissions]);
  const completed = useMemo(() => allTodayMissions.filter((m) => m.status === 'completed'), [allTodayMissions]);
  const todayPct = allTodayMissions.length ? (completed.length / allTodayMissions.length) * 100 : 0;
  const pastCompleted = useMemo(
    () => historyMissions.filter((m: any) => m.status === 'completed' || m.status === 'submitted'),
    [historyMissions]
  );

  async function handleTriggerRegenerate() {
    setGenerating(true);
    try {
      if (refetch) {
        await refetch();
      }
    } catch (e) {
      console.warn('Mission refetch notice:', e);
    } finally {
      setTimeout(() => {
        setGenerating(false);
      }, 500);
    }
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
    handleTriggerRegenerate,
  };
}
