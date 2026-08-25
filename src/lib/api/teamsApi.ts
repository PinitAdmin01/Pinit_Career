/**
 * PinIT Team Projects & Hackathon Squads API Service
 * Manages squad formations, role allocations, milestone progress,
 * and multi-contributor evidence ledger recordings.
 */

import { PathwayApiService } from './pathwayApi';

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

  static getSquads(): HackathonSquad[] {
    if (typeof window === 'undefined') return this.inMemorySquads;
    try {
      const raw = localStorage.getItem(this.localSquadsKey);
      return raw ? JSON.parse(raw) : this.inMemorySquads;
    } catch {
      return this.inMemorySquads;
    }
  }

  static getSquadById(squadId: string): HackathonSquad | undefined {
    return this.getSquads().find(s => s.id === squadId);
  }

  static createSquad(params: {
    name: string;
    hackathonTitle: string;
    teamLeadStudentId: string;
    teamLeadName: string;
    teamLeadRole: TeamRole;
    repoUrl: string;
  }): HackathonSquad {
    const squads = this.getSquads();
    const newSquad: HackathonSquad = {
      id: `squad_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: params.name,
      hackathonTitle: params.hackathonTitle,
      teamLeadStudentId: params.teamLeadStudentId,
      members: [
        {
          studentId: params.teamLeadStudentId,
          name: params.teamLeadName,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
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
    this.saveSquads(squads);
    return newSquad;
  }

  static joinSquad(params: {
    squadId: string;
    studentId: string;
    name: string;
    role: TeamRole;
  }): HackathonSquad {
    const squads = this.getSquads();
    const squad = squads.find(s => s.id === params.squadId);
    if (!squad) throw new Error(`Squad not found: ${params.squadId}`);

    if (squad.members.some(m => m.studentId === params.studentId)) {
      return squad;
    }

    squad.members.push({
      studentId: params.studentId,
      name: params.name,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: params.role,
      contributionPct: Math.round(100 / (squad.members.length + 1)),
      assignedTasks: [`${params.role.replace('_', ' ').toUpperCase()} Core Deliverables`]
    });

    // Rebalance contribution percentage
    const equalShare = Math.floor(100 / squad.members.length);
    squad.members.forEach(m => m.contributionPct = equalShare);

    this.saveSquads(squads);
    return squad;
  }

  static toggleMilestone(squadId: string, milestoneId: string): HackathonSquad {
    const squads = this.getSquads();
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

    this.saveSquads(squads);
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
  }): Promise<{ squad: HackathonSquad; evidenceCount: number }> {
    const squads = this.getSquads();
    const squad = squads.find(s => s.id === params.squadId);
    if (!squad) throw new Error(`Squad not found: ${params.squadId}`);

    squad.liveUrl = params.liveUrl;
    squad.demoVideoUrl = params.demoVideoUrl;
    squad.status = 'verified';
    squad.finalScore = 92;
    squad.juryFeedback = 'Outstanding architectural modularity, robust CI/CD telemetry, and cohesive multi-member git provenance.';

    let recordedCount = 0;

    // Record verified evidence for each team member based on their role
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
        score: squad.finalScore,
        evaluatorType: 'hybrid',
        evaluatorVersion: 'hackathon-jury-board-v1',
        rubricVersion: 'rubric-team-hackathon',
        timestamp: Date.now(),
        artifacts: {
          repoUrl: squad.repoUrl,
          githubRepoUrl: squad.repoUrl,
          liveUrl: squad.liveUrl,
          commitSha: '7f9c2d1b8e4a',
          executionLogSnippet: `Team ${squad.name} verified by Jury. Role: ${member.role}`,
        }
      });
      recordedCount++;
    }

    this.saveSquads(squads);
    return { squad, evidenceCount: recordedCount };
  }

  private static saveSquads(squads: HackathonSquad[]) {
    this.inMemorySquads = squads;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.localSquadsKey, JSON.stringify(squads));
    } catch (e) {
      console.warn('Failed to save squads to local storage', e);
    }
  }
}
