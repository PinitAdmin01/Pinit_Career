/**
 * PinIT Team Projects & Hackathon Squads API Service
 * Manages squad formations, role allocations, milestone progress,
 * and multi-contributor evidence ledger recordings.
 */

import { PathwayApiService } from './pathwayApi';
import { supabase } from '@/lib/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type TeamRole = 'frontend_lead' | 'backend_lead' | 'devops_cloud' | 'data_engineer' | 'ai_architect';

export interface TeamMember {
  studentId: string;
  name: string;
  avatarUrl: string;
  role: TeamRole;
  contributionPct: number;
  assignedTasks: string[];
}

export interface TeamMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: number;
}

export interface HackathonSquad {
  id: string;
  name: string;
  hackathonTitle: string;
  teamLeadStudentId: string;
  members: TeamMember[];
  repoUrl: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  milestones: TeamMilestone[];
  status: 'recruiting' | 'building' | 'submitted' | 'verified';
  finalScore?: number;
  juryFeedback?: string;
  createdAt: number;
}

export const INITIAL_HACKATHON_SQUADS: HackathonSquad[] = [
  {
    id: 'squad_pin_agile_01',
    name: 'ByteCraft Autonomous Systems',
    hackathonTitle: 'Global AI & Cloud Distributed Systems Hackathon',
    teamLeadStudentId: 'student_lead_101',
    members: [
      {
        studentId: 'student_lead_101',
        name: 'Devin Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        role: 'backend_lead',
        contributionPct: 35,
        assignedTasks: ['Microservices gRPC Gateway', 'Distributed Transaction Coordinator']
      },
      {
        studentId: 'student_dev_102',
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        role: 'frontend_lead',
        contributionPct: 30,
        assignedTasks: ['Next.js App Router Realtime Telemetry HUD', 'WebSocket Live Terminal']
      },
      {
        studentId: 'student_dev_103',
        name: 'Kofi Mensah',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        role: 'devops_cloud',
        contributionPct: 35,
        assignedTasks: ['Kubernetes Helm Charts', 'GitHub Actions CI/CD Pipeline', 'Prometheus Monitoring']
      }
    ],
    repoUrl: 'https://github.com/pinit-hackathon/bytecraft-autonomous',
    liveUrl: 'https://bytecraft-demo.pinit.app',
    milestones: [
      { id: 'm1', title: 'Sprint 1: Architecture & Data Contracts', description: 'Whiteboard system design & define proto schemas', dueDate: '2026-03-01', isCompleted: true, completedAt: 1772400000000 },
      { id: 'm2', title: 'Sprint 2: Core Distributed Service Implementation', description: 'Ship Redis caching & PostgreSQL connection pool', dueDate: '2026-03-15', isCompleted: true, completedAt: 1773500000000 },
      { id: 'm3', title: 'Sprint 3: CI/CD Deployment & Jury Defense', description: 'Deploy live cluster and defend architecture to panel', dueDate: '2026-03-30', isCompleted: false }
    ],
    status: 'building',
    createdAt: 1771000000000
  }
];

export class TeamsApiService {
  private static localSquadsKey = 'pinit_hackathon_squads_store';
  private static inMemorySquads: HackathonSquad[] = [...INITIAL_HACKATHON_SQUADS];
  private static realtimeChannel: RealtimeChannel | null = null;
  private static subscribers: Set<(payload: any) => void> = new Set();

  static subscribe(callback: (payload: any) => void): () => void {
    return this.subscribeToSquadUpdates(callback);
  }

  static subscribeToSquadUpdates(callback: (payload: any) => void): () => void {
    this.subscribers.add(callback);

    let localHandler: ((e: any) => void) | null = null;
    let storageHandler: ((e: StorageEvent) => void) | null = null;

    if (typeof window !== 'undefined') {
      localHandler = (e: any) => {
        try { callback(e.detail); } catch (err) { console.warn(err); }
      };
      window.addEventListener('pinit_squads_updated', localHandler);

      storageHandler = (e: StorageEvent) => {
        if (e.key === this.localSquadsKey || (e.key && e.key.includes('_hackathon_squads'))) {
          try { callback({ type: 'storage_sync' }); } catch (err) { console.warn(err); }
        }
      };
      window.addEventListener('storage', storageHandler);

      if (!this.realtimeChannel && supabase) {
        try {
          this.realtimeChannel = supabase.channel('pinit_squads_realtime')
            .on('broadcast', { event: 'squad_update' }, ({ payload }) => {
              this.handleRemoteSquadUpdate(payload);
              this.subscribers.forEach(cb => {
                try { cb(payload); } catch (err) { console.warn(err); }
              });
            })
            .subscribe();
        } catch (err) {
          console.warn('Realtime squad channel subscription failed:', err);
        }
      }
    }

    return () => {
      this.subscribers.delete(callback);
      if (typeof window !== 'undefined') {
        if (localHandler) window.removeEventListener('pinit_squads_updated', localHandler);
        if (storageHandler) window.removeEventListener('storage', storageHandler);
      }
    };
  }

  private static handleRemoteSquadUpdate(payload: any) {
    if (!payload?.squad?.id) return;
    try {
      const current = this.getSquads();
      const idx = current.findIndex(s => s.id === payload.squad.id);
      if (idx >= 0) {
        current[idx] = payload.squad;
      } else {
        current.unshift(payload.squad);
      }
      this.inMemorySquads = current;
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.localSquadsKey, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Failed to merge remote squad update:', e);
    }
  }

  private static broadcastUpdate(action: string, payload: { squad: HackathonSquad; studentId?: string }) {
    if (typeof window === 'undefined') return;

    const eventData = { action, ...payload, timestamp: Date.now() };

    // 1. Local subscribers
    this.subscribers.forEach(cb => {
      try { cb(eventData); } catch (err) { console.warn(err); }
    });

    // 2. Local window event for same-page components
    try {
      window.dispatchEvent(new CustomEvent('pinit_squads_updated', { detail: eventData }));
    } catch (err) {
      console.warn('Local squad custom event dispatch failed:', err);
    }

    // 3. Supabase Realtime broadcast across clients
    if (this.realtimeChannel) {
      try {
        this.realtimeChannel.send({
          type: 'broadcast',
          event: 'squad_update',
          payload: eventData
        }).catch(err => {
          console.warn('Supabase realtime broadcast failed:', err);
        });
      } catch (err) {
        console.warn('Supabase broadcast send failed:', err);
      }
    }
  }

  static getSquads(studentId?: string): HackathonSquad[] {
    if (typeof window === 'undefined') return this.inMemorySquads;
    try {
      const raw = localStorage.getItem(this.localSquadsKey);
      let list: HackathonSquad[] = raw ? JSON.parse(raw) : [...this.inMemorySquads];
      
      // If studentId is provided, merge with user-scoped storage to prevent data loss on refresh
      if (studentId) {
        const userRaw = localStorage.getItem(`pinit_${studentId}_hackathon_squads`);
        if (userRaw) {
          const userSquads: HackathonSquad[] = JSON.parse(userRaw);
          const map = new Map<string, HackathonSquad>();
          list.forEach(s => map.set(s.id, s));
          userSquads.forEach(s => map.set(s.id, s)); // user copy takes precedence
          list = Array.from(map.values());
        }
      }
      return list;
    } catch {
      return this.inMemorySquads;
    }
  }

  static getSquadById(squadId: string, studentId?: string): HackathonSquad | undefined {
    return this.getSquads(studentId).find(s => s.id === squadId);
  }

  static createSquad(params: {
    name: string;
    hackathonTitle: string;
    teamLeadStudentId: string;
    teamLeadName: string;
    teamLeadRole: TeamRole;
    repoUrl: string;
    avatarUrl?: string;
  }): HackathonSquad {
    const squads = this.getSquads(params.teamLeadStudentId);
    const avatar = params.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(params.teamLeadName || params.teamLeadStudentId)}`;
    const newSquad: HackathonSquad = {
      id: `squad_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: params.name,
      hackathonTitle: params.hackathonTitle,
      teamLeadStudentId: params.teamLeadStudentId,
      members: [
        {
          studentId: params.teamLeadStudentId,
          name: params.teamLeadName,
          avatarUrl: avatar,
          role: params.teamLeadRole,
          contributionPct: 100,
          assignedTasks: ['Team Leadership', 'Project Architecture Initialization']
        }
      ],
      repoUrl: params.repoUrl,
      milestones: [
        { id: 'm1', title: 'Sprint 1: Architecture & Technical RFC', description: 'Define database models and API endpoints', dueDate: 'Day 3', isCompleted: false },
        { id: 'm2', title: 'Sprint 2: MVP Core Feature Implementation', description: 'Functional backend endpoints and frontend UI', dueDate: 'Day 7', isCompleted: false },
        { id: 'm3', title: 'Sprint 3: Cloud Deployment & Jury Viva', description: 'Docker containerization and demo recording', dueDate: 'Day 10', isCompleted: false }
      ],
      status: 'recruiting',
      createdAt: Date.now()
    };

    squads.unshift(newSquad);
    this.saveSquads(squads, params.teamLeadStudentId);
    this.broadcastUpdate('create', { squad: newSquad, studentId: params.teamLeadStudentId });
    return newSquad;
  }

  static joinSquad(params: {
    squadId: string;
    studentId: string;
    name: string;
    role: TeamRole;
    avatarUrl?: string;
  }): HackathonSquad {
    const squads = this.getSquads(params.studentId);
    const squad = squads.find(s => s.id === params.squadId);
    if (!squad) throw new Error(`Squad not found: ${params.squadId}`);

    if (squad.members.some(m => m.studentId === params.studentId)) {
      return squad;
    }

    const avatar = params.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(params.name || params.studentId)}`;
    squad.members.push({
      studentId: params.studentId,
      name: params.name,
      avatarUrl: avatar,
      role: params.role,
      contributionPct: Math.round(100 / (squad.members.length + 1)),
      assignedTasks: [`${params.role.replace('_', ' ').toUpperCase()} Core Deliverables`]
    });

    // Rebalance contribution percentage
    const equalShare = Math.floor(100 / squad.members.length);
    squad.members.forEach(m => m.contributionPct = equalShare);

    this.saveSquads(squads, params.studentId);
    this.broadcastUpdate('join', { squad, studentId: params.studentId });
    return squad;
  }

  static toggleMilestone(squadId: string, milestoneId: string, studentId?: string): HackathonSquad {
    const squads = this.getSquads(studentId);
    const squad = squads.find(s => s.id === squadId);
    if (!squad) throw new Error(`Squad not found: ${squadId}`);

    const m = squad.milestones.find(mil => mil.id === milestoneId);
    if (m) {
      m.isCompleted = !m.isCompleted;
      m.completedAt = m.isCompleted ? Date.now() : undefined;
    }

    if (squad.milestones.every(mil => mil.isCompleted)) {
      squad.status = 'submitted';
    }

    this.saveSquads(squads, studentId);
    this.broadcastUpdate('milestone', { squad, studentId });
    return squad;
  }

  /**
   * Submits team project for final jury review and records
   * multi-member SHA-256 evidence records for each member's specialized domain.
   */
  static async submitTeamProject(params: {
    squadId: string;
    liveUrl: string;
    demoVideoUrl?: string;
    studentId?: string;
  }): Promise<{ squad: HackathonSquad; evidenceCount: number }> {
    const squads = this.getSquads(params.studentId);
    const squad = squads.find(s => s.id === params.squadId);
    if (!squad) throw new Error(`Squad not found: ${params.squadId}`);

    squad.liveUrl = params.liveUrl;
    squad.demoVideoUrl = params.demoVideoUrl;
    squad.status = 'submitted';
    const completedMilestones = squad.milestones.filter(m => m.isCompleted).length;
    const computedScore = Math.round((completedMilestones / Math.max(1, squad.milestones.length)) * 100);
    squad.finalScore = computedScore;
    squad.juryFeedback = computedScore === 100
      ? 'All sprint deliverables submitted. Awaiting live faculty jury defense.'
      : `${completedMilestones}/${squad.milestones.length} sprint milestones completed. Final jury review scheduled upon completion.`;

    let recordedCount = 0;

    // Record evidence submission for each team member based on their role
    for (const member of squad.members) {
      let targetCompId = 'comp_production_engineering_residency_l5';
      if (member.role === 'backend_lead') targetCompId = 'comp_backend_apis_frameworks_l3';
      if (member.role === 'devops_cloud') targetCompId = 'comp_cicd_cloud_devops_l4';
      if (member.role === 'data_engineer') targetCompId = 'comp_database_sql_internals_l3';

      await PathwayApiService.recordEvidence({
        id: `ev_team_${squad.id}_${member.studentId}`,
        competencyId: targetCompId,
        competencyVersion: '1.0.0',
        studentId: member.studentId,
        programId: 'prog_swe_accelerated_9m',
        evidenceClass: 'production',
        difficulty: 'advanced',
        evidenceFamilyId: `hackathon_${squad.id}`,
        sourceType: 'project',
        sourceId: `squad_project_${squad.id}`,
        attemptId: `att_team_final`,
        score: computedScore,
        evaluatorType: 'hybrid',
        evaluatorVersion: 'hackathon-milestone-evaluation-v1',
        rubricVersion: 'rubric-team-hackathon',
        timestamp: Date.now(),
        artifacts: {
          repoUrl: squad.repoUrl,
          githubRepoUrl: squad.repoUrl,
          liveUrl: squad.liveUrl,
          executionLogSnippet: `Team ${squad.name} submission recorded. Role: ${member.role}. Milestones: ${completedMilestones}/${squad.milestones.length}`,
        }
      });
      recordedCount++;
    }

    this.saveSquads(squads, params.studentId);
    this.broadcastUpdate('submit', { squad, studentId: params.studentId });
    return { squad, evidenceCount: recordedCount };
  }

  static async syncRemoteSquads(studentId?: string): Promise<HackathonSquad[]> {
    if (typeof window === 'undefined') return this.inMemorySquads;
    const local = this.getSquads(studentId);
    if (!supabase) return local;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = studentId || session?.user?.id;
      if (!uid) return local;

      // 1. Try dedicated table
      try {
        const { data, error } = await supabase
          .from('student_squads')
          .select('squads_payload')
          .eq('user_id', uid)
          .maybeSingle();

        if (!error && data?.squads_payload && Array.isArray(data.squads_payload)) {
          const map = new Map<string, HackathonSquad>();
          local.forEach(s => map.set(s.id, s));
          data.squads_payload.forEach((s: HackathonSquad) => map.set(s.id, s));
          const merged = Array.from(map.values());
          this.saveSquads(merged, uid);
          return merged;
        }
      } catch {}

      // 2. Try auth user_metadata fallback
      const metaSquads = session?.user?.user_metadata?.hackathon_squads;
      if (Array.isArray(metaSquads) && metaSquads.length > 0) {
        const map = new Map<string, HackathonSquad>();
        local.forEach(s => map.set(s.id, s));
        metaSquads.forEach((s: HackathonSquad) => map.set(s.id, s));
        const merged = Array.from(map.values());
        this.saveSquads(merged, uid);
        return merged;
      }
    } catch (e) {
      console.warn('[TeamsApiService] Remote sync fallback to local store:', e);
    }
    return local;
  }

  private static saveSquads(squads: HackathonSquad[], studentId?: string) {
    this.inMemorySquads = squads;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.localSquadsKey, JSON.stringify(squads));

      // Save user-scoped squads for any member present or specific student
      const userIds = new Set<string>();
      if (studentId) userIds.add(studentId);
      squads.forEach(s => {
        if (s.teamLeadStudentId) userIds.add(s.teamLeadStudentId);
        s.members?.forEach(m => {
          if (m.studentId) userIds.add(m.studentId);
        });
      });

      userIds.forEach(uid => {
        const userSquads = squads.filter(s =>
          s.teamLeadStudentId === uid || s.members?.some(m => m.studentId === uid)
        );
        if (userSquads.length > 0) {
          localStorage.setItem(`pinit_${uid}_hackathon_squads`, JSON.stringify(userSquads));
        }
      });

      // PR-07 FIX: Asynchronously persist to Supabase so squads survive across devices
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          const uid = studentId || session?.user?.id;
          if (uid) {
            // Attempt table upsert
            Promise.resolve(supabase.from('student_squads').upsert({
              user_id: uid,
              squads_payload: squads,
              updated_at: new Date().toISOString()
            })).then(({ error }) => {
              if (error && session?.user?.id === uid) {
                // Fallback to updating user_metadata if table does not exist
                supabase.auth.updateUser({
                  data: { hackathon_squads: squads }
                }).catch(() => {});
              }
            }).catch(() => {});
          }
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to save squads to local storage', e);
    }
  }
}
