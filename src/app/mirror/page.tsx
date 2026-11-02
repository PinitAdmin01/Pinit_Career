'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CareerBuilderPage from '@/app/career-builder/page';
import LearningPage from '@/app/learning/page';

export type MirrorSubTab = 'career-builder' | 'twin' | 'roadmap';

export default function MirrorPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t2)', fontSize: 14.5 }}>Loading Career Mirror Studio...</div>}>
      <MirrorPageInner />
    </Suspense>
  );
}

function MirrorPageInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<MirrorSubTab>('career-builder');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'twin') {
      setActiveTab('twin');
    } else if (tabParam === 'roadmap') {
      setActiveTab('roadmap');
    } else if (tabParam === 'career-builder' || tabParam === 'resume' || tabParam === 'ats') {
      setActiveTab('career-builder');
    }
  }, [searchParams]);

  const handleTabChange = (nextTab: MirrorSubTab) => {
    setActiveTab(nextTab);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', nextTab);
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
    }
  };

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      {/* Top Mirror Hub Master Navigation */}
      <div
        data-testid="mirror-hub-subtabs"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          padding: '4px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          width: 'fit-content',
        }}
      >
        <button
          type="button"
          data-testid="tab-career-builder"
          onClick={() => handleTabChange('career-builder')}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'career-builder' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'career-builder' ? '#fff' : 'var(--t2)',
            fontWeight: 800,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>🛠️</span>
          <span>Career Builder & ATS Studio</span>
        </button>
        <button
          type="button"
          data-testid="tab-digital-twin"
          onClick={() => handleTabChange('twin')}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'twin' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'twin' ? '#fff' : 'var(--t2)',
            fontWeight: 800,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>🧬</span>
          <span>Digital Career Twin</span>
        </button>
        <button
          type="button"
          data-testid="tab-growth-roadmap"
          onClick={() => handleTabChange('roadmap')}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: activeTab === 'roadmap' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'roadmap' ? '#fff' : 'var(--t2)',
            fontWeight: 800,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.18s ease',
          }}
        >
          <span>📖</span>
          <span>Learning Roadmap & Gaps</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'career-builder' && (
        <div data-testid="mirror-view-career-builder">
          <CareerBuilderPage embedded={true} />
        </div>
      )}
      {activeTab === 'twin' && (
        <div data-testid="mirror-view-learning-twin">
          <LearningPage initialTab="twin" embedded={true} />
        </div>
      )}
      {activeTab === 'roadmap' && (
        <div data-testid="mirror-view-learning-roadmap">
          <LearningPage initialTab="roadmap" embedded={true} />
        </div>
      )}
    </div>
  );
}
