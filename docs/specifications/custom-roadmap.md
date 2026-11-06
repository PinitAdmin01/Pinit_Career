# PinIT AI Adaptive Career Journey Engine (`custom-roadmap.md`)

## Executive Summary & Vision

The **PinIT AI Adaptive Career Journey Engine** transforms PinIT Career OS from a static collection of standalone 30-day coding courses into a unified, data-driven **Master Orchestration Brain** for student career success.

Instead of treating features independently, the Career Journey Engine acts as the central orchestrator that unifies **Courses, Communication Lab, AI Projects Hub, ATS Resume, Skill Passport, Career DNA, and AI Interviews** into a single, guided, outcome-driven experience.

---

## 🌟 The Core Mindset Shift & Central Orchestration Vision

```
                                  CAREER GOAL
                                       │
                                       ▼
                       CAREER JOURNEY ENGINE (Central Brain)
                                       │
      ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
      ▼              ▼                 ▼                 ▼              ▼
  Courses      Communication       Projects          Resume        AI Interviews
  (30-Day)        (Soft Skills)    (Verification)   (ATS Check)    (Stress Arena)
      │              │                 │                 │              │
      └──────────────┴─────────────────┼─────────────────┴──────────────┘
                                       │
                                       ▼
                         CAREER READINESS CHECKPOINTS (Gates)
                                       │
                                       ▼
                          VERIFIED PLACEMENT READINESS
```

* **Students buy careers, not individual courses.**
* **Holistic Gating**: Stage transitions do not just check course completion; they act as **Career Readiness Checkpoints** enforcing multi-dimensional readiness (Technical, Soft Skills, ATS, Code Verification).

---

## Architecture & Adaptive System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   1. AI CAREER COUNSELOR & INTEREST DISCOVERY               │
│      Asks about preferences (Math, Visual Design, Systems, Logic, AI)        │
│                Recommends optimal Career Trajectories                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 2. INITIAL SKILL DIAGNOSIS & ADAPTIVE PACING                │
│       Evaluates existing knowledge to Fast-Track or Condense stages         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   3. CAREER TRAJECTORY MATRIX ENGINE                        │
│               `src/lib/data/careerTrajectories.ts`                           │
│  Maps target role to a multi-stage ordered sequence of courses & milestones │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             4. CONTINUOUS AI REMEDIATION & ADJUSTMENT ENGINE                 │
│   Monitors Quest Accuracy, Quiz Scores, AI Interviews, and Code Verifications│
│       - Score >= 90%: Fast-track / Skip redundant foundations               │
│       - Score < 60%: Auto-inject targeted remediation mini-module            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   5. MULTI-DIMENSIONAL CAREER GATES (Readiness)             │
│    Stage 2 Complete ➔ Gate: Communication >= 70 | DSA >= 75 | ATS >= 80     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    6. MASTER CAREER JOURNEY DASHBOARD                       │
│                 `src/app/career-path/page.tsx`                              │
│  - Live ETA Predictor (e.g. "At 3 quests/day, ETA: Nov 18")                 │
│  - Skill Mastery Heatmap (Python, DSA, React, SQL)                          │
│  - Multi-Journey Management (Active vs. Paused Career Paths)                │
│  - Master Career Journey Certificate upon Placement Readiness               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Components & Data Schemas

### 1. Data Layer: Trajectory Matrix (`src/lib/data/careerTrajectories.ts`)

Defines canonical learning sequences with adaptive diagnostic triggers and **Career Readiness Checkpoints (Gates)**.

```typescript
export interface CareerGateRequirements {
  minCourseCompletionPct: number;    // Technical course requirement (e.g. 100%)
  minCommunicationScore?: number;    // Soft Skills / Communication Lab score (e.g. >= 70)
  minDsaScore?: number;              // Algorithm & Problem-Solving score (e.g. >= 75)
  minAtsScore?: number;              // ATS Resume Score requirement (e.g. >= 80)
  requireProjectVerification?: boolean; // Code verified in AI Projects Hub
}

export interface TrajectoryStage {
  stageNumber: number;
  stageTitle: string;
  type: 'course' | 'project' | 'exam' | 'interview';
  courseId?: string;           // Maps to COURSES_REGISTRY id
  projectSpecId?: string;      // Real-world portfolio build task
  estimatedDays: number;
  unlocked: boolean;
  canBeSkippedViaDiagnostic: boolean; // Fast-track flag for advanced students
  gateRequirements?: CareerGateRequirements; // Multi-dimensional readiness checkpoint
}

export interface CareerTrajectory {
  roleId: string;
  roleTitle: string;
  icon: string;
  targetMonths: number;
  averageSalaryRange: string;  // e.g. "₹8–18 LPA" or "$90k–$140k"
  prerequisites: string[];
  stages: TrajectoryStage[];
}

export const CAREER_TRAJECTORIES: Record<string, CareerTrajectory> = {
  'fullstack-engineer': {
    roleId: 'fullstack-engineer',
    roleTitle: 'Full-Stack Software Engineer',
    icon: '💻',
    targetMonths: 5,
    averageSalaryRange: '₹8–18 LPA',
    prerequisites: ['Basic computer literacy'],
    stages: [
      { 
        stageNumber: 1, 
        stageTitle: 'Python & Core Programming Logic', 
        type: 'course', 
        courseId: 'course-python-backend', 
        estimatedDays: 30, 
        unlocked: true, 
        canBeSkippedViaDiagnostic: true 
      },
      { 
        stageNumber: 2, 
        stageTitle: 'Data Structures & Algorithmic Optimization', 
        type: 'course', 
        courseId: 'course-dsa-optim', 
        estimatedDays: 30, 
        unlocked: false, 
        canBeSkippedViaDiagnostic: false,
        gateRequirements: {
          minCourseCompletionPct: 100,
          minDsaScore: 75,
          minCommunicationScore: 65
        }
      },
      { 
        stageNumber: 3, 
        stageTitle: 'Database Engineering & Performance', 
        type: 'course', 
        courseId: 'course-database-eng', 
        estimatedDays: 30, 
        unlocked: false, 
        canBeSkippedViaDiagnostic: true 
      },
      { 
        stageNumber: 4, 
        stageTitle: 'Full-Stack React & Next.js Architecture', 
        type: 'course', 
        courseId: 'course-react-web', 
        estimatedDays: 30, 
        unlocked: false, 
        canBeSkippedViaDiagnostic: false 
      },
      { 
        stageNumber: 5, 
        stageTitle: 'Capstone Portfolio Build: Distributed SaaS App', 
        type: 'project', 
        projectSpecId: 'proj-saas-capstone', 
        estimatedDays: 14, 
        unlocked: false, 
        canBeSkippedViaDiagnostic: false,
        gateRequirements: {
          minCourseCompletionPct: 100,
          requireProjectVerification: true,
          minAtsScore: 80
        }
      },
      { 
        stageNumber: 6, 
        stageTitle: 'AI Interview Arena & Technical Assessment', 
        type: 'interview', 
        estimatedDays: 7, 
        unlocked: false, 
        canBeSkippedViaDiagnostic: false,
        gateRequirements: {
          minCourseCompletionPct: 100,
          minCommunicationScore: 75,
          minAtsScore: 85
        }
      }
    ]
  }
};
```

---

### 2. State & Persistence Layer (`src/lib/context/CareerOSContext.tsx`)

Manages **Multiple Career Journeys**, readiness checkpoints evaluation, active selection, adaptive modifications, and live pace calculation.

```typescript
export interface CareerJourneyState {
  journeyId: string;
  roleId: string;
  roleTitle: string;
  status: 'active' | 'paused' | 'completed';
  activeStageIndex: number;
  completedStageIndices: number[];
  remediationModules: string[]; // Inserted mini-modules for weak areas
  startedAt: string;
  estimatedCompletionDate: string;
  overallReadinessScore: number; // 0-100% calculated from ATS, Quests, Communication & AI Interviews
  gateStatus: Record<number, { passed: boolean; missingRequirements: string[] }>;
}
```

* **LocalStorage Keys**:
  * `pinit_${userId}_career_journeys`: Stored list of all user journeys (Active & Paused).
  * `pinit_${userId}_skill_heatmap`: Real-time skill proficiency values (e.g. `{ Python: 85, React: 30, DSA: 60 }`).

---

## 🎯 High-Value Differentiators

### 1. Career Readiness Checkpoints (Gates)
Replaces simple course completion checks with multi-dimensional gates:
* Stage 2 Complete ➔ Gate Check: **Communication Score ≥ 70**, **DSA Score ≥ 75**, **Verified Project**, **ATS Resume ≥ 80**.

### 2. Central Orchestration Brain
Unifies all PinIT systems (Communication Lab, AI Projects Hub, Skill Passport, Career DNA, ATS Resume, AI Interview Arena) under a single target outcome.

### 3. AI Adaptive Remediation & Fast-Tracking
* **Fast-Track**: Diagnostic test score >90% skips redundant foundation stages.
* **Remediation**: Quest/Quiz accuracy <60% auto-injects a 3-day refresher module before advancing.

### 4. Live Pace-Based ETA Predictor
Calculates completion dates based on current daily quest completion velocity:
* *3 Quests / Day*: Expected Completion = **Nov 18**
* *1 Quest / Day*: Expected Completion = **Feb 22**

### 5. Multi-Journey Management
Allows students to pause one career track (e.g. Full-Stack) and try another (e.g. Cloud) without losing progress, XP, or completed milestone credentials.

### 6. Master Career Journey Credential
Awards an end-to-end **Master Career Journey Certificate** verifying:
- 180 Days of Disciplined Practice
- Complete Core Subject Mastery & Project Verification
- Verified ATS Resume Score ≥ 85
- Passed Live AI Technical & Communication Interview
