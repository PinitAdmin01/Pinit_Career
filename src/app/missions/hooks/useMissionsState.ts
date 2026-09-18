'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  trust_reward: number;
  estimated_minutes: number;
  source_weakness: string;
  target_gap?: string;
  role_requirement?: string;
}

export interface RoleplayScenario {
  scenarioTitle: string;
  activeAvatar: string;
  avatarName: string;
  avatarRole: string;
  message: string;
  choices: { text: string; delta: number }[];
  scenarioId: string;
  isEnded?: boolean;
}

export interface RoleplayHistoryEntry {
  role: 'user' | 'assistant' | 'system';
  content: string;
  delta?: number;
}

export function useMissionsState(defaultRole: string = 'Software Developer') {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRoleplayParam = searchParams?.get('roleplay') === 'true';

  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [extraMissions, setExtraMissions] = useState<Mission[]>([]);
  const [generating, setGenerating] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [customRole, setCustomRole] = useState(defaultRole);
  const [generatingSkill, setGeneratingSkill] = useState(false);

  // Gamified Sub-tab selections & Universal History Command Center states
  const [activeTab, setActiveTab] = useState<'evolve' | 'language' | 'history'>('evolve');
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any | null>(null);
  const [socraticHistory, setSocraticHistory] = useState<any[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<'all' | 'mindset' | 'corporate_comm' | 'missions'>('all');

  // Dynamic Plus Shape Human Archetype Chart states
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const [hoveredRadarMetric, setHoveredRadarMetric] = useState<string | null>(null);

  // Roleplay Simulator State & Atomic Unlock Lock
  const [roleplayActive, setRoleplayActive] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const updateRoleplayActive = (active: boolean) => {
    setRoleplayActive(active);
    if (active && !isRoleplayParam) {
      router.replace('/missions?roleplay=true');
    } else if (!active && isRoleplayParam) {
      router.replace('/missions');
    }
  };

  const [roleplayLoading, setRoleplayLoading] = useState(false);
  const [roleplayScenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [roleplayHistory, setRoleplayHistory] = useState<RoleplayHistoryEntry[]>([]);
  const [animState, setAnimState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const [evaluationReport, setEvaluationReport] = useState<string>('');
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [timerCount, setTimerCount] = useState(25);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [showTraditionalMissions, setShowTraditionalMissions] = useState(false);
  const [qt2Delta, setQt2Delta] = useState(0);
  const [cognitiveLoad, setCognitiveLoad] = useState(30);
  const [sessionElapsed, setSessionElapsed] = useState(0);

  return {
    tab, setTab,
    extraMissions, setExtraMissions,
    generating, setGenerating,
    customSkill, setCustomSkill,
    customRole, setCustomRole,
    generatingSkill, setGeneratingSkill,
    activeTab, setActiveTab,
    selectedHistoryRecord, setSelectedHistoryRecord,
    socraticHistory, setSocraticHistory,
    historySearchQuery, setHistorySearchQuery,
    historyCategoryFilter, setHistoryCategoryFilter,
    hoveredQuadrant, setHoveredQuadrant,
    selectedQuadrant, setSelectedQuadrant,
    hoveredRadarMetric, setHoveredRadarMetric,
    roleplayActive, setRoleplayActive,
    updateRoleplayActive,
    isUnlocking, setIsUnlocking,
    roleplayLoading, setRoleplayLoading,
    roleplayScenario, setScenario,
    roleplayHistory, setRoleplayHistory,
    animState, setAnimState,
    evaluationReport, setEvaluationReport,
    evaluationLoading, setEvaluationLoading,
    timerCount, setTimerCount,
    selectedChoiceIdx, setSelectedChoiceIdx,
    showTraditionalMissions, setShowTraditionalMissions,
    qt2Delta, setQt2Delta,
    cognitiveLoad, setCognitiveLoad,
    sessionElapsed, setSessionElapsed,
    isRoleplayParam
  };
}
