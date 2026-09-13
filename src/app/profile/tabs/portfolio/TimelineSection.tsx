'use client';

import React, { useState } from 'react';
import { TimelineItem, ProjectItem, CertificateItem } from './usePortfolioData';
import { TimelineCategory } from '../types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
  addTimelineEvent: (year: string, category: TimelineCategory, title: string, detail: string) => void;
  projects?: ProjectItem[];
  certificates?: CertificateItem[];
  cOS?: any;
}

export function TimelineSection({
  timeline,
  addTimelineEvent,
  projects = [],
  certificates = [],
  cOS = {}
}: TimelineSectionProps) {
  const [newEvtYear, setNewEvtYear] = useState('2026');
  const [newEvtCategory, setNewEvtCategory] = useState<TimelineCategory>('Course');
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDetail, setNewEvtDetail] = useState('');

  const handleAdd = () => {
    if (!newEvtTitle.trim() || !newEvtDetail.trim()) return;
    addTimelineEvent(newEvtYear, newEvtCategory, newEvtTitle.trim(), newEvtDetail.trim());
    setNewEvtTitle('');
    setNewEvtDetail('');
  };

  const totalEvidenceCount = (cOS.completedQuests?.length || 0) + (cOS.completedMissions?.length || 0) + projects.filter(p => p.verified).length + (cOS.vaultItems?.filter((v: any) => v.verified)?.length || 0);
  const questCount = (cOS.completedQuests?.length || 0) + (cOS.completedMissions?.length || 0);
  const verifiedProjectsCount = projects.filter(p => p.verified).length + (cOS.onboardingAnswers?.projects?.length ? 1 : 0);
  const dnaMastery = Math.max(0, Math.min(100, cOS.dnaScore || 0));
  const verifiedCertsCount = (cOS.vaultItems?.filter((v: any) => v.verified && (v.item_type === 'certification' || v.item_type === 'course'))?.length || 0) + certificates.filter(c => c.verified).length;

  const cloItems = [
    {
      code: 'CLO-101',
      name: 'Data Structures & Algorithmic Crisis Recovery',
      syllabus: 'Anna Univ CS3401 / VTU 21CS32 / Mumbai Univ Core DSA',
      mastery: questCount === 0 ? 0 : Math.min(100, Math.round((questCount / 6) * 100)),
      evidence: questCount > 0 ? `${cOS.completedQuests?.length || 0} Quests + ${cOS.completedMissions?.length || 0} Coding Missions Passed` : 'No verified DSA quests completed yet'
    },
    {
      code: 'CLO-102',
      name: 'System Architecture & Concurrency Design',
      syllabus: 'Anna Univ CS3451 / VTU 21CS33 OS & Concurrency',
      mastery: verifiedProjectsCount === 0 ? 0 : Math.min(100, verifiedProjectsCount * 45),
      evidence: verifiedProjectsCount > 0 ? `${verifiedProjectsCount} Verified Capstone Project(s) Evaluated` : 'No verified system design projects submitted'
    },
    {
      code: 'CLO-103',
      name: 'Technical Presentation & Verbal Alignment',
      syllabus: 'AICTE Model Curriculum: Professional Communication',
      mastery: dnaMastery,
      evidence: dnaMastery > 0 ? `AI Speech & Behavioral DNA Score: ${dnaMastery}%` : 'No AI mock interview sessions recorded'
    },
    {
      code: 'CLO-204',
      name: 'Distributed Cloud & Network Architectures',
      syllabus: 'Anna Univ CS3591 / VTU 21CS52 Computer Networks',
      mastery: verifiedCertsCount === 0 ? 0 : Math.min(100, verifiedCertsCount * 50),
      evidence: verifiedCertsCount > 0 ? `${verifiedCertsCount} Verified Cloud & Infrastructure Credentials` : 'No verified cloud/networking credentials in Vault'
    }
  ];

  return (
    <div>
      {/* Course Learning Outcome (CLO) Competency Matrix */}
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8 }}>AICTE & University Outcome Framework</span>
            <h4 style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 800 }}>Course Learning Outcome (CLO) Competency Matrix</h4>
          </div>
          <span style={{ fontSize: 10.5, background: totalEvidenceCount > 0 ? 'rgba(var(--success-rgb), 0.1)' : 'rgba(var(--danger-rgb), 0.1)', color: totalEvidenceCount > 0 ? 'var(--success)' : 'var(--t3)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
            {totalEvidenceCount > 0 ? '✓ Verified Progress' : 'Awaiting Submissions'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cloItems.map((clo, idx) => (
            <div key={idx} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>{clo.code}: {clo.name}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: clo.mastery > 0 ? 'var(--success)' : 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{clo.mastery}% Mastery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: 'rgba(var(--info-rgb), 0.1)', color: 'var(--accent)', fontWeight: 700 }}>
                  🏛️ {clo.syllabus}
                </span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: `${clo.mastery}%`, height: '100%', background: clo.mastery > 0 ? 'linear-gradient(90deg, #10b981, #059669)' : 'var(--border)', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, color: clo.mastery > 0 ? 'var(--t2)' : 'var(--t3)' }}>Verified Evidence: {clo.evidence}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 900 }}>Progression Timeline</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '2px solid var(--border)', paddingLeft: 16, marginLeft: 10, position: 'relative' }}>
        {timeline.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '4px 0' }}>No milestone events logged in timeline.</p>
        ) : (
          timeline.map(evt => (
            <div key={evt.id} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 4, left: -22, width: 10, height: 10, borderRadius: '50%', background: evt.verified ? 'var(--green)' : 'var(--amber)' }} />
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>{evt.year} · {evt.category}</span>
                <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: evt.verified ? 'var(--green-light)' : 'var(--amber-light)', color: evt.verified ? 'var(--green)' : 'var(--amber)' }}>{evt.verified ? 'Verified ✓' : 'Pending'}</span>
              </div>
              <h4 style={{ margin: '2px 0 4px 0', fontSize: 13, fontWeight: 700 }}>{evt.title}</h4>
              <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>{evt.detail}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: 13.5, fontWeight: 800 }}>Add Timeline Achievement</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Year"
            value={newEvtYear}
            onChange={e => setNewEvtYear(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }}
          />
          <select
            value={newEvtCategory}
            onChange={e => setNewEvtCategory(e.target.value as TimelineCategory)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }}
          >
            {['Course', 'Project', 'Internship', 'Hackathon', 'Certification', 'Award', 'Placement'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvtTitle}
            onChange={e => setNewEvtTitle(e.target.value)}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5 }}
          />
          <textarea
            placeholder="Event Details..."
            value={newEvtDetail}
            onChange={e => setNewEvtDetail(e.target.value)}
            rows={2}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }}
          />
          <button
            onClick={handleAdd}
            style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: 12, fontWeight: 800, background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}
