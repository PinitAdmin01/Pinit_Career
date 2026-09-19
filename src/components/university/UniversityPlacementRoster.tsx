'use client';

import React, { useState, useEffect, useMemo } from 'react';

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

export interface UniversityPlacementRosterProps {
  onExportCsv?: (selectedIds: string[]) => void;
  onDispatchInvite?: (selectedIds: string[]) => void;
}

const rolePaths = {
  'Full-Stack': <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></>,
  'Cloud/DevOps': <><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.5 1.5A4 4 0 0 0 7 19h10.5Z"/><path d="M12 12v6M10 14l2-2 2 2"/></>,
  'AI/ML': <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3.5"/></>,
  'Data Platform': <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></>,
};

export const UniversityPlacementRoster: React.FC<UniversityPlacementRosterProps> = ({
  onExportCsv,
  onDispatchInvite,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [minReadiness, setMinReadiness] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [candidates, setCandidates] = useState<VerifiedCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (roleFilter !== 'All') params.set('role', roleFilter);
    if (minReadiness > 0) params.set('minReadiness', String(minReadiness));
    if (searchQuery) params.set('search', searchQuery);

    setLoading(true);
    fetch(`/api/university/placement-roster?${params.toString()}`, { signal: ctrl.signal })
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((res: any) => {
        const rawList = Array.isArray(res) ? res : (res?.candidates || []);
        const normalized = rawList.map((c: any) => ({
          id: c.id,
          name: c.name,
          usn: c.usn,
          college: c.college,
          targetRole: c.targetRole,
          readiness: c.readiness ?? c.readinessPercentage ?? 0,
          pins: c.pins ?? c.pinsMinted ?? 0,
          status: c.status ?? (c.diagnosticStatus === 'ready' ? 'ready' : 'remediation'),
          proofs: c.proofs ?? c.competencyProofs ?? []
        }));
        setCandidates(normalized);
        setSelectedIds(new Set());
      })
      .catch((e) => { if (e.name !== 'AbortError') console.error(e); })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [roleFilter, minReadiness, searchQuery]);

  const filteredCandidates = useMemo(() => candidates, [candidates]);

  const toggleSelect = (id: string) => setSelectedIds((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.size === filteredCandidates.length ? new Set() : new Set(filteredCandidates.map((c) => c.id)));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> TPO Corporate Placement Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Verified Student Placement Roster</h1>
          <p className="text-sm text-slate-400 mt-1">Filter cryptographically verified candidates by demonstrated readiness, zero unverified claims.</p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Pool</div>
            <div className="text-xl font-extrabold text-emerald-400">{candidates.length} Students</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div className="relative">
          <input type="text" placeholder="Search by student name, USN, or college..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60" />
          <svg className="w-4 h-4 absolute left-3 top-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Full-Stack', 'Cloud/DevOps', 'AI/ML', 'Data Platform'].map((r) => (
            <button key={r} type="button" onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
              }`}>{r}</button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-slate-400 font-medium">Min Readiness:</span>
          {[0, 70, 80, 90].map((thr) => (
            <button key={thr} type="button" onClick={() => setMinReadiness(thr)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                minReadiness === thr ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/5'
              }`}>{thr === 0 ? 'All' : `>${thr}%`}</button>
          ))}
        </div>
      </div>

      {/* Candidates List / Loading / Empty */}
      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/10 bg-slate-950/60 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 mt-1 rounded border-white/20 bg-slate-900" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/3 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-10 text-center backdrop-blur-xl">
          <svg className="mx-auto w-14 h-14 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-slate-300">No verified candidates found</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            No verified candidates found matching these criteria. Once students complete missions and earn cryptographic Pins, their verified profiles will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCandidates.map((c) => {
            const isSelected = selectedIds.has(c.id);
            const isHigh = c.readiness >= 85;
            const roleIcon = rolePaths[c.targetRole as keyof typeof rolePaths] || null;
            return (
              <div key={c.id} onClick={() => toggleSelect(c.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/30' : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}>
                <div className="flex items-start gap-4">
                  <input type="checkbox" checked={isSelected} onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-0 cursor-pointer" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-white text-base">{c.name}</span>
                      <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-white/[0.04]">{c.usn}</span>
                      <span className="flex items-center gap-1 text-xs text-indigo-300 font-semibold">
                        {roleIcon && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{roleIcon}</svg>}
                        {c.targetRole}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{c.college}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {c.proofs.map((p) => (
                        <span key={p} className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Readiness</div>
                    <div className={`text-lg font-black ${isHigh ? 'text-emerald-400' : 'text-cyan-300'}`}>{c.readiness}%</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <span>🏅</span><span>{c.pins} Pins</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-6 p-4 rounded-2xl bg-indigo-950/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">{selectedIds.size}</span>
            <span className="text-sm font-semibold text-white">{selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected for Corporate Placement Drive</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => onExportCsv?.(Array.from(selectedIds))}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold text-white transition-all">Export Roster (CSV)</button>
            <button type="button" onClick={() => onDispatchInvite?.(Array.from(selectedIds))}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all">Dispatch Batch Drive Invite</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPlacementRoster;