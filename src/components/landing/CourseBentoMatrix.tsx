'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { COURSES_CATALOG } from '@/lib/data/coursesCatalog';

type DomainCategory = 'all' | 'software' | 'database_cloud' | 'iot_hardware' | 'bcom' | 'foundational';

export default function CourseBentoMatrix() {
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const domainTabs: { id: DomainCategory; label: string; count: number; icon: string }[] = [
    { id: 'all', label: 'All Tracks', count: 36, icon: '🌟' },
    { id: 'software', label: 'Software & Systems', count: 8, icon: '💻' },
    { id: 'database_cloud', label: 'Database & Cloud', count: 7, icon: '🗄️' },
    { id: 'iot_hardware', label: 'IoT & Hardware', count: 5, icon: '🌐' },
    { id: 'bcom', label: 'B.Com & Commerce', count: 10, icon: '📈' },
    { id: 'foundational', label: 'Foundations & AI', count: 6, icon: '🚀' }
  ];

  const getDomainCategory = (id: string): DomainCategory => {
    if (['course-java-logic', 'course-react-web', 'course-design-systems', 'course-dsa-optim', 'course-mobile-dev', 'course-cybersecurity', 'course-python-backend', 'course-fullstack-js'].includes(id)) {
      return 'software';
    }
    if (['course-cloud-native', 'course-devops-cicd', 'course-database-eng', 'course-distributed-sys', 'course-ai-eng', 'course-3d-graphics', 'course-blockchain-web3'].includes(id)) {
      return 'database_cloud';
    }
    if (['course-iot-embedded', 'course-iot-network', 'course-iot-edge-ai', 'course-iot-security', 'course-quant-systems'].includes(id)) {
      return 'iot_hardware';
    }
    if (id.startsWith('course-digital-accounting') || id.startsWith('course-finance') || id.startsWith('course-business-analytics') || id.startsWith('course-marketing') || id.startsWith('course-digital-marketing') || id.startsWith('course-ecommerce') || id.startsWith('course-entrepreneurship') || id.startsWith('course-sales') || id.startsWith('course-operations') || id.startsWith('course-ai-digital-transformation')) {
      return 'bcom';
    }
    return 'foundational';
  };

  const filteredCourses = useMemo(() => {
    return COURSES_CATALOG.filter((course) => {
      const matchesDomain = selectedDomain === 'all' || getDomainCategory(course.id) === selectedDomain;
      const matchesSearch = searchQuery.trim() === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [selectedDomain, searchQuery]);

  return (
    <section id="courses-matrix" className="lp-section">
      <div className="lp-container">
        
        <div className="lp-section-header">
          <div className="lp-badge-tag cyan">MASTER REGISTRY</div>
          <h2 className="lp-section-title">
            36 Accredited Career Roadmaps.{' '}
            <span className="lp-gradient-text">1,080 Handcrafted Days.</span>
          </h2>
          <p className="lp-section-subtitle">
            From low-latency systems and enterprise Java to B.Com digital accounting and LLM prompt engineering — every roadmap is built with 0 jargon and interactive Socratic code judges.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          
          <div className="domain-filter-bar" style={{ margin: 0 }}>
            {domainTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDomain(tab.id)}
                className={`domain-tab-btn ${selectedDomain === tab.id ? 'active' : ''}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{ fontSize: 10.5, opacity: 0.85, marginLeft: 2, background: 'rgba(0,0,0,0.15)', padding: '2px 7px', borderRadius: 999 }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 36 career tracks..."
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
                boxShadow: 'var(--card-shadow)'
              }}
            />
          </div>

        </div>

        {/* 36-Course Bento Grid */}
        <div className="bento-course-grid">
          {filteredCourses.map((course) => {
            const firstQuestId = `${course.id}-day-1`;

            return (
              <div key={course.id} className="bento-course-card">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {course.icon}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>
                        {course.difficulty}
                      </span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--badge-bg)', color: 'var(--badge-text)', fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        30 Days
                      </span>
                    </div>
                  </div>

                  <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 750, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                    {course.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.desc}
                  </p>
                </div>

                <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>90 Blocks</span> • <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>5 Milestones</span>
                  </div>

                  <Link
                    href={`/quests/lesson?questId=${firstQuestId}`}
                    style={{
                      fontSize: 12,
                      fontWeight: 750,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Start Track →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
