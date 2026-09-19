'use client';

import React, { useState, useMemo } from 'react';

export interface VerifiedCandidate {
  id: string;
  name: string;
  usn: string;
  college: string;
  targetRole: string;
  readiness: number;
  pins: number;
  status: 'ready' | 'remediation';
  proofs: string[];
}

const SAMPLE_ROSTER: VerifiedCandidate[] = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    usn: '1MS21CS045',
    college: 'M.S. Ramaiah Institute of Technology',
    targetRole: 'Full-Stack',
    readiness: 92,
    pins: 340,
    status: 'ready',
    proofs: ['6 Capstone Commits Signed', 'HMAC Security Lab Pass', 'JWT RBAC Shipped'],
  },
  {
    id: 'c2',
    name: 'Priya Venkatesh',
    usn: '1RV21IS088',
    college: 'RV College of Engineering',
    targetRole: 'Cloud/DevOps',
    readiness: 88,
    pins: 295,
    status: 'ready',
    proofs: ['Blue-Green Deploy Sprint', 'Kubernetes Recovery Lab', 'Docker Compose Signed'],
  },
  {
    id: 'c3',
    name: 'Rohan Deshmukh',
    usn: '1BM21CS112',
    college: 'BMS College of Engineering',
    targetRole: 'AI/ML',
    readiness: 86,
    pins: 280,
    status: 'ready',
    proofs: ['RAG Evaluation Harness', 'ETL Pipeline Signed', 'Prompt Red-Teaming Pass'],
  },
  {
    id: 'c4',
    name: 'Sneha Kulkarni',
    usn: '1DS21EC074',
    college: 'Dayananda Sagar College',
    targetRole: 'Data Platform',
    readiness: 84,
    pins: 260,
    status: 'ready',
    proofs: ['Streaming Quality Gate', 'SQL Optimization Pass', 'dbt Modeling Suite Green'],
  },
  {
    id: 'c5',
    name: 'Vikram Nair',
    usn: '1PE21CS150',
    college: 'PES University',
    targetRole: 'Full-Stack',
    readiness: 73,
    pins: 185,
    status: 'remediation',
    proofs: ['React State Pass', 'REST API Basics Pass'],
  },
];

export interface UniversityPlacementRosterProps {
  onExportCsv?: (selectedIds: string[]) => void;
  onDispatchInvite?: (selectedIds: string[]) => void;
}

export const UniversityPlacementRoster: React.FC<UniversityPlacementRosterProps> = ({
  onExportCsv,
  onDispatchInvite,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [minReadiness, setMinReadiness] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['c1', 'c2']));

  const filteredCandidates = useMemo(() => {
    return SAMPLE_ROSTER.filter((c) => {
      const matchRole = roleFilter === 'All' || c.targetRole === roleFilter;
      const matchReadiness = c.readiness >= minReadiness;
      const matchSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.college.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchReadiness && matchSearch;
    });
  }, [roleFilter, minReadiness, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCandidates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCandidates.map((c) => c.id)));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            TPO Corporate Placement Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Verified Student Placement Roster
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Filter cryptographically verified candidates by demonstrated readiness, zero unverified claims.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Pool</div>
            <div className="text-xl font-extrabold text-emerald-400">{SAMPLE_ROSTER.length} Students</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name, USN, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Full-Stack', 'Cloud/DevOps', 'AI/ML', 'Data Platform'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-slate-400 font-medium">Min Readiness:</span>
          {[0, 70, 80, 90].map((thr) => (
            <button
              key={thr}
              type="button"
              onClick={() => setMinReadiness(thr)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                minReadiness === thr
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/5'
              }`}
            >
              {thr === 0 ? 'All' : `>${thr}%`}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {filteredCandidates.map((c) => {
          const isSelected = selectedIds.has(c.id);
          const isHigh = c.readiness >= 85;
          return (
            <div
              key={c.id}
              onClick={() => toggleSelect(c.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-950/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-white text-base">{c.name}</span>
                    <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-white/[0.04]">
                      {c.usn}
                    </span>
                    <span className="text-xs text-indigo-300 font-semibold">{c.targetRole}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{c.college}</div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {c.proofs.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                      >
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Readiness</div>
                  <div className={`text-lg font-black ${isHigh ? 'text-emerald-400' : 'text-cyan-300'}`}>
                    {c.readiness}%
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <span>🏅</span>
                  <span>{c.pins} Pins</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-6 p-4 rounded-2xl bg-indigo-950/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
              {selectedIds.size}
            </span>
            <span className="text-sm font-semibold text-white">
              {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected for Corporate Placement Drive
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onExportCsv?.(Array.from(selectedIds))}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold text-white transition-all"
            >
              Export Roster (CSV)
            </button>
            <button
              type="button"
              onClick={() => onDispatchInvite?.(Array.from(selectedIds))}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
            >
              Dispatch Batch Drive Invite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPlacementRoster;
