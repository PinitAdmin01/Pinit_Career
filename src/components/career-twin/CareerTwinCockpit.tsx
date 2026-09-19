'use client';
import React, { useState, useEffect } from 'react';

type RoleId = 'fullstack' | 'cloud' | 'ai' | 'data';
type Urgency = 'critical' | 'high' | 'medium';

interface CareerMission {
  title: string;
  delta: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  minutes: number;
  description: string;
}

interface CompetencyRow {
  name: string;
  evidence: string;
  pins: number;
  status: 'verified' | 'gap';
  urgency?: Urgency;
  fix?: string;
}

interface RoleProfile {
  id: RoleId;
  label: string;
  short: string;
  readiness: number;
  academic: number;
  evidence: number;
  mission: CareerMission;
  competencies: CompetencyRow[];
}

const defaultRoleMissions: Record<RoleId, { label: string; short: string; mission: CareerMission }> = {
  fullstack: {
    label: 'Full-Stack',
    short: 'Full-Stack Software Engineer',
    mission: { title: 'JWT Authentication & RBAC Guard', delta: '+14% Readiness', difficulty: 'Intermediate', minutes: 90, description: 'Harden session auth, role gates, and refresh-token rotation in a production-grade API.' }
  },
  cloud: {
    label: 'Cloud/DevOps',
    short: 'Cloud & DevOps Architect',
    mission: { title: 'CI/CD Pipeline Reliability Sprint', delta: '+12% Readiness', difficulty: 'Advanced', minutes: 120, description: 'Build a blue-green deploy path with rollback, health probes, and audit logs.' }
  },
  ai: {
    label: 'AI/ML',
    short: 'AI/ML Systems Engineer',
    mission: { title: 'RAG Evaluation Harness', delta: '+16% Readiness', difficulty: 'Advanced', minutes: 135, description: 'Create grounded retrieval evals with latency, faithfulness, and regression gates.' }
  },
  data: {
    label: 'Data Platform',
    short: 'Data Platform Engineer',
    mission: { title: 'Streaming Quality Gates', delta: '+13% Readiness', difficulty: 'Intermediate', minutes: 105, description: 'Add schema contracts, dead-letter queues, and freshness SLAs to a streaming pipeline.' }
  }
};

const rolePaths: Record<RoleId, React.ReactNode> = {
  fullstack: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></>,
  cloud: <><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.5 1.5A4 4 0 0 0 7 19h10.5Z" /><path d="M12 12v6M10 14l2-2 2 2" /></>,
  ai: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="3.5" /></>,
  data: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
};

const pinIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.2 9.2c0-1 1.2-1.8 2.8-1.8s2.8.7 2.8 1.7c0 2.5-5.6 1.5-5.6 4 0 1 1.2 1.8 2.8 1.8s2.8-.8 2.8-1.8" />
  </svg>
);

const CareerTwinCockpit: React.FC<{ onLaunchMission?: (mission: CareerMission) => void }> = ({ onLaunchMission }) => {
  const [activeRole, setActiveRole] = useState<RoleId>('fullstack');
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveProfile, setLiveProfile] = useState<{
    readiness: number;
    academic: number;
    evidence: number;
    competencies: CompetencyRow[];
    pinsMinted: number;
  }>({
    readiness: 0,
    academic: 0,
    evidence: 0,
    competencies: [],
    pinsMinted: 0
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/career-twin/readiness?role=' + activeRole)
      .then(r => r.json())
      .then(data => {
        if (active && data.success) {
          setLiveProfile({
            readiness: data.readiness ?? 0,
            academic: data.academic ?? 0,
            evidence: data.evidence ?? 0,
            competencies: data.competencies ?? [],
            pinsMinted: data.pinsMinted ?? 0
          });
        }
      })
      .catch(err => console.error('[CareerTwin] Fetch readiness error:', err))
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [activeRole]);

  const roleMeta = defaultRoleMissions[activeRole];
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (liveProfile.readiness / 100) * circumference;

  const launchMission = () => {
    setLaunched(true);
    onLaunchMission?.(roleMeta.mission);
  };

  return (
    <section className="w-full max-w-6xl rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl sm:p-7">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            Live Diagnostic Career Twin HUD
          </div>
          <h2 className="bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
            Mission-Driven Career Readiness Cockpit
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Genuine closed-loop operating view: real marksheet/resume baseline + cryptographic evidence ledger.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Evidence Ledger</div>
          <div className="mt-1 text-sm font-extrabold text-slate-100">{liveProfile.pinsMinted} Pins minted</div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2 sm:grid-cols-4">
        {(Object.keys(defaultRoleMissions) as RoleId[]).map((rId) => {
          const r = defaultRoleMissions[rId];
          const isActive = activeRole === rId;
          return (
            <button
              key={rId}
              type="button"
              onClick={() => { setActiveRole(rId); setLaunched(false); }}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${isActive ? 'border-indigo-400/40 bg-indigo-500/15 shadow-[inset_0_0_24px_rgba(99,102,241,0.12)]' : 'border-white/5 bg-transparent text-slate-400 hover:bg-white/[0.04]'}`}
            >
              <svg viewBox="0 0 24 24" className={`h-5 w-5 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{rolePaths[rId]}</svg>
              <span>
                <span className={`block text-xs font-extrabold ${isActive ? 'text-white' : 'text-slate-300'}`}>{r.label}</span>
                <span className="block text-[10px] leading-3 text-slate-500">{r.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/10 bg-gradient-to-b from-indigo-950/60 to-slate-950/60 p-6 backdrop-blur-xl">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <defs>
                <filter id="careerTwinGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="careerTwinArc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#818cf8" /><stop offset="55%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="13" />
              <circle cx="80" cy="80" r={radius} fill="none" stroke="url(#careerTwinArc)" strokeWidth="13" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={progressOffset} filter="url(#careerTwinGlow)" className="transition-[stroke-dashoffset] duration-700" />
            </svg>
            <div className="absolute text-center">
              <div className="text-5xl font-black tracking-tight text-white">{loading ? '...' : `${liveProfile.readiness}%`}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-200/80">Live Readiness</div>
            </div>
          </div>
          <div className="relative mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold text-slate-300"><span>Academic baseline</span><span>{liveProfile.academic}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-slate-400" style={{ width: `${liveProfile.academic}%` }} /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold text-slate-300"><span>Verified evidence</span><span>{liveProfile.evidence}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.35)]" style={{ width: `${liveProfile.evidence}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Competency Evidence vs Gap Matrix</h3>
                <p className="mt-1 text-xs text-slate-400">Cryptographic Pins validate proof; diagnosed gaps drive the next mission.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{roleMeta.short}</span>
            </div>
            <div className="space-y-2">
              {liveProfile.competencies.map((row) => (
                <div key={row.name} className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border p-3 ${row.status === 'verified' ? 'border-emerald-300/10 bg-emerald-300/[0.045]' : 'border-rose-300/10 bg-rose-300/[0.045]'}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    {row.status === 'verified' ? (
                      <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-1.5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 rounded-xl border border-rose-300/20 bg-rose-300/10 p-1.5 text-rose-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-extrabold text-slate-100">{row.name}</span>
                        {row.status === 'gap' && <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${row.urgency === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/15 text-amber-300'}`}>{row.urgency || 'gap'}</span>}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">{row.status === 'verified' ? row.evidence : row.fix}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {row.status === 'verified' ? <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-xs font-black text-amber-300">{pinIcon}{row.pins} Pins</span> : <span className="rounded-full border border-rose-300/15 px-2 py-1 text-[10px] font-bold text-rose-200/80">Needs proof</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-200/15 bg-gradient-to-br from-indigo-950/70 via-slate-950/70 to-emerald-950/40 p-5 shadow-[0_20px_80px_-20px_rgba(99,102,241,0.45)] backdrop-blur-xl sm:p-6">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Today&apos;s High-ROI Mission</div>
                <h3 className="text-xl font-black text-white">{roleMeta.mission.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{roleMeta.mission.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1">{roleMeta.mission.difficulty}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1">⏱ {roleMeta.mission.minutes} min</span>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-emerald-300">▲ {roleMeta.mission.delta}</span>
                </div>
              </div>
              <button type="button" onClick={launchMission} className="group shrink-0 rounded-2xl border border-indigo-300/30 bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-4 text-left font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40 md:text-right">
                <span className="flex items-center justify-center gap-2 md:justify-end">{launched ? 'Mission Launched' : 'Launch Mission'} <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-indigo-100/70">{launched ? 'Diagnostic → Execution loop active' : 'Single-click launch'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CareerTwinCockpit;
