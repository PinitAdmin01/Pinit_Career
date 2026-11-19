'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type TrackDomain = 'Engineering & AI' | 'IoT & Hardware' | 'Commerce & Finance' | 'Business & Domains';

const CATEGORIES: Array<'All' | TrackDomain> = [
  'All',
  'Engineering & AI',
  'IoT & Hardware',
  'Commerce & Finance',
  'Business & Domains',
];

const TRACKS: Array<{ title: string; code: string; color: string; cat: TrackDomain }> = [
  { title: 'Java Backend Architect',                    code: 'JAVA',     color: 'var(--accent)', cat: 'Engineering & AI' },
  { title: 'Frontend React Engineer',                   code: 'REACT',    color: 'var(--teal)',   cat: 'Engineering & AI' },
  { title: 'UI/UX Design Systems & Visual Frontend',    code: 'DESIGN',   color: 'var(--amber)',  cat: 'Engineering & AI' },
  { title: 'Data Structures & Algorithmic Optimizations', code: 'DSA',    color: 'var(--blue)',   cat: 'Engineering & AI' },
  { title: 'Mobile Application Development',            code: 'MOBILE',   color: 'var(--purple)', cat: 'Engineering & AI' },
  { title: 'Cybersecurity Specialist & Secure Systems', code: 'SEC',      color: 'var(--accent)', cat: 'Engineering & AI' },
  { title: 'Database Engineering & Query Performance',  code: 'DATA',     color: 'var(--teal)',   cat: 'Engineering & AI' },
  { title: 'High-Scale Distributed System Design',      code: 'DISTRIB',  color: 'var(--blue)',   cat: 'Engineering & AI' },
  { title: 'Cloud Native AWS Architect',                code: 'CLOUD',    color: 'var(--amber)',  cat: 'Engineering & AI' },
  { title: 'DevOps & CI/CD Automation Specialist',      code: 'DEVOPS',   color: 'var(--green)',  cat: 'Engineering & AI' },
  { title: 'AI Software Engineer',                      code: 'AI',       color: 'var(--purple)', cat: 'Engineering & AI' },
  { title: '3D Graphics & Avatar Animation',            code: '3D',       color: 'var(--accent)', cat: 'Engineering & AI' },
  { title: 'Fullstack Generalist',                      code: 'FULL',     color: 'var(--green)',  cat: 'Engineering & AI' },
  { title: 'IoT, Firmware & Embedded Systems',          code: 'EMBED',    color: 'var(--teal)',   cat: 'IoT & Hardware' },
  { title: 'IoT Wireless Networks',                     code: 'MESH',     color: 'var(--blue)',   cat: 'IoT & Hardware' },
  { title: 'Edge AI & TinyML',                          code: 'TINYML',   color: 'var(--purple)', cat: 'IoT & Hardware' },
  { title: 'Industrial IoT Security',                   code: 'IIOT',     color: 'var(--accent)', cat: 'IoT & Hardware' },
  { title: 'Core Systems & Hardware Engineer',          code: 'HW',       color: 'var(--amber)',  cat: 'IoT & Hardware' },
  { title: 'Digital Accountant & Taxation Specialist',  code: 'ACC',      color: 'var(--green)',  cat: 'Commerce & Finance' },
  { title: 'Financial Analyst & Investment Specialist', code: 'FIN',      color: 'var(--blue)',   cat: 'Commerce & Finance' },
  { title: 'Business Analytics & Decision Intelligence Specialist', code: 'ANALYTICS', color: 'var(--purple)', cat: 'Commerce & Finance' },
  { title: 'E-Commerce & Digital Business Specialist',  code: 'ECOM',     color: 'var(--accent)', cat: 'Commerce & Finance' },
  { title: 'Operations, Supply Chain & Compliance Specialist', code: 'OPS', color: 'var(--blue)', cat: 'Commerce & Finance' },
  { title: 'Marketing & Brand Manager',                 code: 'BRAND',    color: 'var(--amber)',  cat: 'Business & Domains' },
  { title: 'Digital Marketing & Growth Strategist',     code: 'DMKT',     color: 'var(--teal)',   cat: 'Business & Domains' },
  { title: 'Entrepreneur & Business Manager',           code: 'VENTURE',  color: 'var(--amber)',  cat: 'Business & Domains' },
  { title: 'Sales, Customer Success & CRM Specialist',  code: 'CRM',      color: 'var(--green)',  cat: 'Business & Domains' },
  { title: 'AI & Digital Transformation Business Specialist', code: 'AI-BIZ', color: 'var(--purple)', cat: 'Business & Domains' },
  { title: 'Management Consultant & Business Strategist', code: 'CONSULT', color: 'var(--amber)', cat: 'Business & Domains' },
  { title: 'Product Manager (Tech & Business Strategy)', code: 'PROD',    color: 'var(--teal)',   cat: 'Business & Domains' },
  { title: 'Human Resources & People Operations Specialist', code: 'HR',    color: 'var(--purple)', cat: 'Business & Domains' },
  { title: 'Scientific & Quantitative Research Specialist', code: 'RESEARCH', color: 'var(--purple)', cat: 'Business & Domains' },
  { title: 'Public Policy, Compliance & Legal Specialist', code: 'LEGAL', color: 'var(--blue)',   cat: 'Business & Domains' },
  { title: 'Education & Learning Technology Specialist', code: 'EDTECH',  color: 'var(--teal)',   cat: 'Business & Domains' },
  { title: 'Healthcare & Clinical Operations Analyst',  code: 'HEALTH',   color: 'var(--green)',  cat: 'Business & Domains' },
  { title: 'Digital Media & Communications Specialist', code: 'MEDIA',    color: 'var(--amber)',  cat: 'Business & Domains' },
  { title: 'Creative & Digital Arts Specialist',        code: 'ARTS',     color: 'var(--accent)', cat: 'Business & Domains' },
  { title: 'Social Impact & Non-Profit Program Manager', code: 'IMPACT',  color: 'var(--teal)',   cat: 'Business & Domains' },
];

interface Props {
  roadmapGenerated: boolean;
  roadmapModules: any[];
  completedQuests: string[];
  isGeneratingRoadmap: boolean;
  selectedTrajectory: string | null;
  onSelectTrajectory: (t: string) => void;
  onChooseTrajectory: (t: string) => void;
  activeTrackTitle?: string | null;
}

export default function DashboardTrajectoryMap({
  roadmapGenerated,
  roadmapModules,
  completedQuests,
  isGeneratingRoadmap,
  selectedTrajectory,
  onSelectTrajectory,
  onChooseTrajectory,
  activeTrackTitle,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | TrackDomain>('All');

  const filteredTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TRACKS.filter(track => {
      const catMatch = selectedCategory === 'All' || track.cat === selectedCategory;
      const queryMatch = !q || track.title.toLowerCase().includes(q) || track.code.toLowerCase().includes(q);
      return catMatch && queryMatch;
    });
  }, [searchQuery, selectedCategory]);

  const headerTitle = activeTrackTitle
    ? `${activeTrackTitle} Trajectory Map`
    : 'Career Trajectory Progress Map';

  return (
    <div id="trajectory-selector" className="db-glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
      {/* Header — always visible, click to expand */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls="trajectory-body"
        aria-label={`Toggle ${headerTitle}`}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(o => !o);
          }
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 22px',
          cursor: 'pointer',
          borderBottom: open ? '1px solid var(--dash-inner-border, var(--border))' : 'none',
          transition: 'border 0.2s',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.26)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid, var(--accent))" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--dash-text, var(--t1))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {headerTitle}
            </div>
            <div className="db-tabular" style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 1 }}>
              {roadmapGenerated ? 'Active Track — click to view quest modules' : 'Select a trajectory to unlock your personalized quest roadmap'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span
            className="db-tabular"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: roadmapGenerated ? '#10b981' : 'var(--dash-subtext, var(--t2))',
              background: roadmapGenerated ? 'rgba(16, 185, 129, 0.12)' : 'var(--dash-subtle-bg, var(--bg3))',
              padding: '3px 9px',
              borderRadius: 7,
              border: `1px solid ${roadmapGenerated ? 'rgba(16, 185, 129, 0.3)' : 'var(--dash-inner-border, var(--border))'}`,
            }}
          >
            {roadmapGenerated ? 'Active' : 'Setup Required'}
          </span>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'var(--t3)',
              transition: 'transform 0.25s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              display: 'block',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Collapsible body with CSS grid height transition */}
      <div
        id="trajectory-body"
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: 20 }}>
            {roadmapGenerated && roadmapModules.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 13.5, color: 'var(--dash-subtext, var(--t2))', margin: 0, lineHeight: 1.5 }}>
                  Your dynamic roadmap was generated from your profile. Complete quests in order to clear each milestone module.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                  {roadmapModules.map((module, mIdx) => {
                    const allQ = module.quests || [];
                    const done = allQ.filter((q: any) => completedQuests.includes(q.id)).length;
                    const isComplete = done === allQ.length && allQ.length > 0;
                    const isActive = !isComplete && (mIdx === 0 || (roadmapModules[mIdx - 1]?.quests || []).every((q: any) => completedQuests.includes(q.id)));
                    const nodeColor = isComplete ? '#10b981' : isActive ? 'var(--accent)' : 'var(--bg3)';
                    return (
                      <div key={module.id || mIdx} style={{ display: 'flex', gap: 14, paddingLeft: 16, borderLeft: '1.5px dashed var(--dash-border-strong, var(--border))', position: 'relative', marginLeft: 8 }}>
                        <div style={{ position: 'absolute', left: -7, top: 4, width: 13, height: 13, borderRadius: '50%', background: nodeColor, border: `2px solid ${isActive ? 'var(--accent-mid)' : 'var(--border)'}`, boxShadow: isActive ? '0 0 8px var(--accent)' : 'none', animation: isActive ? 'hud-pulse 2s infinite ease-in-out' : 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                            <div>
                              <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dash-text, var(--t1))', margin: 0 }}>{module.title}</h4>
                              <span className="db-tabular" style={{ fontSize: 11, color: 'var(--t3)' }}>{done}/{allQ.length} Quests</span>
                            </div>
                            <span className="db-tabular" style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: isComplete ? 'var(--green-light)' : isActive ? 'var(--accent-light)' : 'var(--bg3)', color: isComplete ? 'var(--green-mid)' : isActive ? 'var(--accent-mid, var(--accent))' : 'var(--t3)' }}>
                              {isComplete ? 'Done' : isActive ? 'Active' : 'Locked'}
                            </span>
                          </div>
                          {isActive && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                              {allQ.map((q: any) => {
                                const done2 = completedQuests.includes(q.id);
                                return (
                                  <Link key={q.id} href={`/quests/lesson?questId=${q.id}`} prefetch={false} style={{ textDecoration: 'none' }}>
                                    <div className="db-well" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600, color: done2 ? '#10b981' : 'var(--dash-text, var(--t1))', cursor: 'pointer' }}>
                                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: done2 ? '#10b981' : 'var(--accent)' }} />
                                      <span>{q.title}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : isGeneratingRoadmap ? (
              <div className="db-well" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dash-text, var(--t1))' }}>Generating AI Quest Roadmap...</div>
                <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>Mapping your strengths and gaps into a custom socratic quest path.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid var(--dash-border-accent, rgba(99,102,241,0.2))', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mid, var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--dash-text, var(--t1))' }}>Select Your Career Trajectory</div>
                    <p style={{ fontSize: 12, color: 'var(--dash-subtext, var(--t3))', margin: 0 }}>Filter by domain or search across all {TRACKS.length} career tracks to unlock your quest roadmap.</p>
                  </div>
                </div>

                {/* Search & Domain Filter Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }}>
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      aria-label="Search career trajectories"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${TRACKS.length} tracks...`}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 32px',
                        borderRadius: 9,
                        background: 'var(--dash-subtle-bg, var(--bg3))',
                        border: '1px solid var(--dash-border-strong, var(--border))',
                        color: 'var(--dash-text, var(--t1))',
                        fontSize: 12.5,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {CATEGORIES.map(cat => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 8,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: isActive ? 'var(--accent)' : 'var(--dash-subtle-bg, var(--bg3))',
                            color: isActive ? '#ffffff' : 'var(--dash-subtext, var(--t2))',
                            border: `1px solid ${isActive ? 'var(--accent)' : 'var(--dash-inner-border, var(--border))'}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable Track Grid with valid CSS color-mix() tinting */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
                  {filteredTracks.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px 12px', color: 'var(--t3)', fontSize: 12.5 }}>
                      No matching career trajectories found. Try clearing your filter.
                    </div>
                  ) : (
                    filteredTracks.map(track => {
                      const isSel = selectedTrajectory === track.title;
                      return (
                        <div
                          key={track.title}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${track.title} trajectory`}
                          onClick={() => onChooseTrajectory(track.title)}
                          onMouseEnter={() => onSelectTrajectory(track.title)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onChooseTrajectory(track.title);
                            }
                          }}
                          className="db-well db-well-interactive"
                          style={{
                            padding: 14,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            border: `1px solid ${isSel ? track.color : 'var(--dash-inner-border, var(--border))'}`,
                            boxShadow: isSel ? `0 0 0 1px color-mix(in srgb, ${track.color} 35%, transparent)` : 'var(--hud-card-shadow)',
                            outline: 'none',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span
                                className="db-tabular"
                                style={{
                                  fontSize: 10,
                                  fontWeight: 900,
                                  padding: '2px 7px',
                                  borderRadius: 5,
                                  background: `color-mix(in srgb, ${track.color} 14%, transparent)`,
                                  color: track.color,
                                  border: `1px solid color-mix(in srgb, ${track.color} 30%, transparent)`,
                                }}
                              >
                                {track.code}
                              </span>
                              <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{track.cat.split(' ')[0]}</span>
                            </div>
                            <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--dash-text, var(--t1))', marginBottom: 8, lineHeight: 1.3 }}>
                              {track.title}
                            </div>
                          </div>
                          <span className="db-tabular" style={{ fontSize: 11.5, fontWeight: 700, color: track.color }}>
                            Choose Path &rarr;
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
