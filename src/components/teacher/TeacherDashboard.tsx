'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CourseManager from './CourseManager';
import ExamGradingManager from './ExamGradingManager';
import AttendanceTracker from './AttendanceTracker';
import BatchAnalyticsView from './BatchAnalyticsView';
import TeacherInboxManager from './TeacherInboxManager';
import TeacherStudentDetailsTab from './tabs/TeacherStudentDetailsTab';
import TeacherEventsAuditTab from './tabs/TeacherEventsAuditTab';
import { portalService } from '@/lib/services/portalService';

export interface FacultyStudioItem {
  id: string;
  title: string;
  path: string;
  category: 'academic' | 'research' | 'career' | 'operations';
  icon: string;
  badge: string;
  description: string;
}

export const ALL_FACULTY_STUDIOS: FacultyStudioItem[] = [
  // 1. Academic Planning & Outcomes
  {
    id: 'syllabus',
    title: 'Outcome-Based Syllabus & Lesson Planner',
    path: '/teacher/syllabus',
    category: 'academic',
    icon: '📘',
    badge: 'UGC / NAAC',
    description: '16-week outcome-based syllabus mapping to CLOs/POs, L-T-P credit hour calculations and velocity tracking.'
  },
  {
    id: 'course-outcomes',
    title: 'Course Learning Outcomes (CLO) Attainment',
    path: '/teacher/course-outcomes',
    category: 'academic',
    icon: '🎯',
    badge: 'NBA Criterion 3',
    description: 'Direct/indirect attainment matrix, threshold calculations and remedial action loops for accreditation.'
  },
  {
    id: 'academic-audit',
    title: 'Academic Audit & Peer Teaching Observation',
    path: '/teacher/academic-audit',
    category: 'academic',
    icon: '🔍',
    badge: 'IQAC Peer Review',
    description: 'Classroom observation rubrics, pedagogical innovation evaluation and peer review commendations.'
  },
  {
    id: 'remedial',
    title: 'Remedial Classes & Slow Learner Diagnostics',
    path: '/teacher/remedial',
    category: 'academic',
    icon: '🩺',
    badge: 'Student Support',
    description: 'Diagnostic test score analysis, bridge course attendance logs and student progression tracking.'
  },
  {
    id: 'mentorship',
    title: 'Student Proctorial Mentorship & Holistic Wellness',
    path: '/teacher/mentorship',
    category: 'academic',
    icon: '🌱',
    badge: 'Proctorial Board',
    description: 'Assigned student cohort tracking, wellness flags, academic advisory notes and parent notifications.'
  },
  {
    id: 'appraisal',
    title: 'Annual Faculty Appraisal & PBAS Ledger',
    path: '/teacher/appraisal',
    category: 'academic',
    icon: '📋',
    badge: 'API Scorecard',
    description: 'UGC Performance Based Appraisal System (PBAS) scoring across teaching, research and service.'
  },
  {
    id: 'feedback',
    title: 'Student Feedback & Course Evaluation Telemetry',
    path: '/teacher/feedback',
    category: 'academic',
    icon: '💬',
    badge: 'NAAC 1.4',
    description: 'Anonymous student feedback metrics, curricular delivery rating and pedagogical improvement logs.'
  },

  // 2. Research, Publications & Innovation
  {
    id: 'emeritus-fellowship',
    title: 'Faculty Emeritus Fellowship & Superannuation',
    path: '/teacher/emeritus-fellowship',
    category: 'research',
    icon: '🎖️',
    badge: 'Block 40 Final',
    description: 'Distinguished superannuated scholar dossier, monthly honorarium grants and research continuation.'
  },
  {
    id: 'research-fellowships',
    title: 'Research Fellowships (JRF/SRF/PostDoc) Stipend',
    path: '/teacher/research-fellowships',
    category: 'research',
    icon: '🔬',
    badge: 'CSIR / UGC / DST',
    description: 'Monthly stipend and contingency grant ledger with attendance verification and DBT clearance.'
  },
  {
    id: 'book-publishing',
    title: 'Academic Book Publishing & Text Translation',
    path: '/teacher/book-publishing',
    category: 'research',
    icon: '📚',
    badge: 'UGC NEP Books',
    description: 'Scholarly monograph publisher peer review, institutional repository archiving and author royalties.'
  },
  {
    id: 'ipr-patents',
    title: 'IPR & Patent Commercialization Studio',
    path: '/teacher/ipr-patents',
    category: 'research',
    icon: '💡',
    badge: 'Patent Office',
    description: 'Invention disclosure records, patent attorney liaison, prior-art search and technology licensing.'
  },
  {
    id: 'mooc-course',
    title: 'MOOC Course Authoring & SWAYAM/NPTEL Repository',
    path: '/teacher/mooc-course',
    category: 'research',
    icon: '🎬',
    badge: 'SWAYAM E-Content',
    description: '4-quadrant e-content development, video transcript syncing, discussion forum moderation and credits.'
  },
  {
    id: 'startup-incubation',
    title: 'Student Start-Up Incubation & Seed Fund',
    path: '/teacher/startup-incubation',
    category: 'research',
    icon: '🚀',
    badge: 'Innovation Council',
    description: 'Faculty mentorship equity logs, prototype seed grant approvals and angel pitch coordination.'
  },
  {
    id: 'consultancy-billing',
    title: 'Industrial Consultancy & Testing Services',
    path: '/teacher/consultancy-billing',
    category: 'research',
    icon: '💼',
    badge: 'Industry Connect',
    description: 'Corporate client MoUs, institutional overhead deductions (30/70 split) and GST invoicing.'
  },
  {
    id: 'research',
    title: 'Sponsored Research Projects & Extramural Grants',
    path: '/teacher/research',
    category: 'research',
    icon: '🔭',
    badge: 'SERB / DBT / ICMR',
    description: 'PI grant proposal tracker, milestone deliverables, utilization certificates (UC) and project staff.'
  },

  // 3. Career Advancement, Governance & Leaves
  {
    id: 'professor-of-practice',
    title: 'Professor of Practice (PoP) & Adjunct Scholar',
    path: '/teacher/professor-of-practice',
    category: 'career',
    icon: '👔',
    badge: 'Industry Practice',
    description: 'Senior industry executive appointments, guest lecture schedules, honorarium processing and curriculum reviews.'
  },
  {
    id: 'cas-dossier',
    title: 'Career Advancement Scheme (CAS) Promotion',
    path: '/teacher/cas-dossier',
    category: 'career',
    icon: '📈',
    badge: 'UGC Regulations',
    description: 'Assistant to Associate and Professor promotion dossiers with verified API scores and publication metrics.'
  },
  {
    id: 'continuing-education',
    title: 'Continuing Education & ATAL FDP Workshops',
    path: '/teacher/continuing-education',
    category: 'career',
    icon: '🏅',
    badge: 'AICTE ATAL',
    description: 'Short-term training program (STTP) coordination, participant certificates and resource person logistics.'
  },
  {
    id: 'travel-grants',
    title: 'International Travel Grants & CPDA Ledger',
    path: '/teacher/travel-grants',
    category: 'career',
    icon: '✈️',
    badge: 'CPDA Allowance',
    description: 'Cumulative Professional Development Allowance tracking, visa clearances and airfare reimbursements.'
  },
  {
    id: 'sabbatical-leave',
    title: 'Sabbatical & Post-Doctoral Fellowship Leave',
    path: '/teacher/sabbatical-leave',
    category: 'career',
    icon: '🏖️',
    badge: 'Senate Approval',
    description: 'Statutory 1-year research sabbatical applications, host university invitation letters and service bonds.'
  },
  {
    id: 'leaves',
    title: 'Faculty Duty Leave (DL) & Casual Leave Tracker',
    path: '/teacher/leaves',
    category: 'career',
    icon: '📅',
    badge: 'HR & Service Book',
    description: 'Online leave application, exam duty leaves, medical fitness certificates and casual leave balance.'
  },

  // 4. Departmental Operations & Safety
  {
    id: 'question-paper',
    title: 'Question Paper Authoring & Bloom Taxonomy',
    path: '/teacher/question-paper',
    category: 'operations',
    icon: '📝',
    badge: 'Confidential Exam',
    description: 'Strict Bloom taxonomy cognitive mapping (L1-L6), marking schemes and cryptographic paper submissions.'
  },
  {
    id: 'equipment-amc',
    title: 'Laboratory Equipment & AMC Maintenance Ledger',
    path: '/teacher/equipment-amc',
    category: 'operations',
    icon: '⚙️',
    badge: 'Lab Assets',
    description: 'Critical scientific equipment calibration logs, breakdown tickets and annual service contracts.'
  },
  {
    id: 'indents',
    title: 'Department Purchase Requisitions & Indents',
    path: '/teacher/indents',
    category: 'operations',
    icon: '🛒',
    badge: 'GeM Purchase',
    description: 'Consumable and capital indents, technical specification vetting and storekeeper stock entry.'
  },
  {
    id: 'lab-safety',
    title: 'Laboratory Biosafety & Chemical Protocol Audit',
    path: '/teacher/lab-safety',
    category: 'operations',
    icon: '☣️',
    badge: 'Biosafety Level',
    description: 'Hazardous chemical registries, fume hood inspections, eyewash testing and waste disposal logs.'
  },
  {
    id: 'residential-quarters',
    title: 'Faculty Residential Quarters & House Allotment',
    path: '/teacher/residential-quarters',
    category: 'operations',
    icon: '🏡',
    badge: 'Campus Housing',
    description: 'Seniority-based housing waitlists, maintenance requests and license fee HRA deductions.'
  },
  {
    id: 'risk-radar',
    title: 'Student Academic At-Risk Radar & Early Warning',
    path: '/teacher/risk-radar',
    category: 'operations',
    icon: '⚠️',
    badge: 'Early Warning',
    description: 'Predictive algorithm flagging students with attendance < 75% and test scores below threshold.'
  },
  {
    id: 'assignments',
    title: 'Course Assignments & Rubric Evaluation Studio',
    path: '/teacher/assignments',
    category: 'academic',
    icon: '📑',
    badge: 'OBE Rubrics',
    description: 'Create problem sets, automated code evaluation rubrics, plagiarism checks and late-submission policies.'
  },
  {
    id: 'attendance',
    title: 'Biometric & Smart Classroom Attendance Studio',
    path: '/teacher/attendance',
    category: 'operations',
    icon: '🕒',
    badge: '75% Statutory',
    description: 'Session-wise attendance logs, medical condonation workflows and automated shortage alerts.'
  },
  {
    id: 'exams',
    title: 'Continuous Internal Evaluation (CIE) & Exam Controller',
    path: '/teacher/exams',
    category: 'academic',
    icon: '✍️',
    badge: 'CIE / SEE',
    description: 'Mid-semester moderation, answer-script barcoding, grade moderation and CO attainment mapping.'
  },
  {
    id: 'book-publication',
    title: 'Monograph & ISBN Chapter Publication Registry',
    path: '/teacher/book-publication',
    category: 'research',
    icon: '📖',
    badge: 'ISBN / Scopus',
    description: 'Track edited volume chapters, ISBN verification, textbook grants and API score weightages.'
  },
  {
    id: 'consultancy',
    title: 'Corporate R&D Advisory & Retainer Desk',
    path: '/teacher/consultancy',
    category: 'research',
    icon: '🤝',
    badge: 'R&D Advisory',
    description: 'Manage technical advisory retainers, deliverable sign-offs and departmental revenue sharing.'
  },
  {
    id: 'fdp',
    title: 'Faculty Development Program (FDP) & QIP Tracker',
    path: '/teacher/fdp',
    category: 'career',
    icon: '🎓',
    badge: 'UGC-HRDC / QIP',
    description: 'Refresher courses, orientation programs, NPTEL-AICTE FDP certificates and CAS credit logs.'
  },
  {
    id: 'incubation',
    title: 'Deep-Tech Spin-Off & Pre-Incubation Cell',
    path: '/teacher/incubation',
    category: 'research',
    icon: '🧪',
    badge: 'TRL 1-9 Lab',
    description: 'Technology Readiness Level (TRL) progression, student founder mentoring and DSIR SIRO compliance.'
  },
  {
    id: 'ai-interview',
    title: 'AI Mock Interview Studio',
    path: '/interview',
    category: 'career',
    icon: '🎙️',
    badge: 'Live 1v1 Mock',
    description: 'Autonomous multi-round AI technical and behavioral screening with dynamic conversational follow-ups and live scoring.'
  },
  {
    id: 'group-discussion',
    title: 'Boardroom Group Discussion (GD) Lab',
    path: '/interview?tab=gd',
    category: 'career',
    icon: '🗣️',
    badge: 'Multi-Avatar GD',
    description: 'Host-moderated boardroom discussions with timed turn-taking, active multi-avatar challenges, and instant performance rubrics.'
  }
];

interface TeacherDashboardProps {
  teacher?: {
    id?: string;
    name?: string;
    username?: string;
    department?: string;
    role?: string;
  };
  onLogout?: () => void;
}

export default function TeacherDashboard({ teacher, onLogout }: TeacherDashboardProps) {
  const [activeNav, setActiveNav] = useState<
    'overview' | 'students' | 'events-audit' | 'studios' | 'inbox' | 'courses' | 'exams' | 'attendance' | 'analytics'
  >('overview');
  const [headerStudentQuery, setHeaderStudentQuery] = useState('');
  const [studioSearch, setStudioSearch] = useState('');
  const [studioCategory, setStudioCategory] = useState<string>('all');

  const [materialsCount, setMaterialsCount] = useState<number>(0);
  const [enrolledStudentsCount, setEnrolledStudentsCount] = useState<number>(0);
  const [pendingGradesCount, setPendingGradesCount] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const [mats, students, tickets] = await Promise.all([
          portalService.getMaterials(),
          portalService.getEnrolledStudents(),
          portalService.getServiceTickets()
        ]);
        setMaterialsCount(Array.isArray(mats) ? mats.length : 0);
        setEnrolledStudentsCount(Array.isArray(students) ? students.length : 0);
        const pending = Array.isArray(tickets) ? tickets.filter(t => t.status === 'pending').length : 0;
        setPendingGradesCount(pending);
      } catch (err) {
        console.error('Failed to load teacher stats:', err);
      }
    }
    loadStats();
  }, []);

  const displayName = teacher?.name || teacher?.username || 'Prof. Faculty';

  const filteredStudios = ALL_FACULTY_STUDIOS.filter((studio) => {
    const matchesCat = studioCategory === 'all' || studio.category === studioCategory;
    const matchesSearch =
      studio.title.toLowerCase().includes(studioSearch.toLowerCase()) ||
      studio.badge.toLowerCase().includes(studioSearch.toLowerCase()) ||
      studio.description.toLowerCase().includes(studioSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main, #f8fafc)',
      color: 'var(--t1, #0f172a)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
      <header style={{
        background: 'var(--bg1, #ffffff)',
        borderBottom: '1px solid var(--border, #e2e8f0)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26.5 }}>👩‍🏫</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Faculty & Teacher Studio</h1>
            <span style={{ fontSize: 12.5, color: 'var(--t3, #64748b)' }}>Campus OS • {teacher?.department || 'Academic Department'}</span>
          </div>
        </div>

        {/* Global Student Lookup Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 360, margin: '0 16px' }}>
          <input
            type="text"
            placeholder="🔍 Search student profile by name or roll no..."
            value={headerStudentQuery}
            onChange={e => {
              setHeaderStudentQuery(e.target.value);
              setActiveNav('students');
            }}
            style={{
              width: '100%',
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg3)',
              color: 'var(--t1)',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => window.location.href = '/admin'}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--card, #fff)',
              color: 'var(--t1)',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            title="Open Campus Admin Portal"
          >
            <span>🏛️</span> Admin View
          </button>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{displayName}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>● Active Faculty</div>
          </div>
          <button
            onClick={onLogout || (() => window.location.href = '/login')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid var(--border, #cbd5e1)',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Nav */}
        <aside style={{
          width: 260,
          background: 'var(--bg1, #ffffff)',
          borderRight: '1px solid var(--border, #e2e8f0)',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'students', icon: '🎓', label: 'Student Records & College', badge: 'Active' },
            { id: 'events-audit', icon: '🎪', label: 'Events Audit & Starter', badge: 'Live' },
            { id: 'studios', icon: '🏛️', label: 'Faculty Studios (All 34)' },
            { id: 'inbox', icon: '💬', label: 'Student Messages & Inbox' },
            { id: 'courses', icon: '📚', label: 'Course Materials' },
            { id: 'exams', icon: '📝', label: 'Exams & Grading' },
            { id: 'attendance', icon: '📋', label: 'Attendance Tracker' },
            { id: 'analytics', icon: '📈', label: 'Batch Performance' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeNav === item.id ? '#eff6ff' : 'transparent',
                color: activeNav === item.id ? '#2563eb' : 'var(--t2, #475569)',
                fontWeight: activeNav === item.id ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontSize: 13.5
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 750,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: item.badge === 'Live' ? '#fee2e2' : '#dcfce7',
                  color: item.badge === 'Live' ? '#dc2626' : '#15803d'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0 12px 8px' }}>
              Academic Mentoring Tools
            </div>
            {[
              { href: '/quests/teacher-select', icon: '🗺️', label: 'Quest Mentor Selector' },
              { href: '/learning', icon: '📖', label: 'Learning Roadmaps' },
              { href: '/advisor', icon: '🧠', label: 'AI Advisor Logs' },
              { href: '/portfolio', icon: '👤', label: 'Student Portfolios' },
              { href: '/interview', icon: '🎙️', label: 'AI Interview Studio' },
              { href: '/interview?tab=gd', icon: '🗣️', label: 'GD Boardroom Practice' },
              { href: '/internships', icon: '🏢', label: 'Internships Review' },
              { href: '/projects', icon: '💼', label: 'Projects & Squads' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'var(--t2, #475569)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Content View */}
        <main style={{ flex: 1, padding: 32, maxWidth: 1300 }}>
          {activeNav === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Welcome back, {displayName}! 👋</h2>
                <p style={{ color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Here is what is happening across your batches and departmental duties today.</p>
              </div>

              {/* Dynamic Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: '#fff' }}>
                  <div style={{ fontSize: 13.5, color: '#64748b' }}>Active Batches</div>
                  <div style={{ fontSize: 31, fontWeight: 800, margin: '6px 0 0' }}>4</div>
                </div>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: '#fff' }}>
                  <div style={{ fontSize: 13.5, color: '#64748b' }}>Total Enrolled Students</div>
                  <div style={{ fontSize: 31, fontWeight: 800, margin: '6px 0 0' }}>{enrolledStudentsCount}</div>
                </div>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: '#fff' }}>
                  <div style={{ fontSize: 13.5, color: '#64748b' }}>Pending Grades</div>
                  <div style={{ fontSize: 31, fontWeight: 800, color: '#d97706', margin: '6px 0 0' }}>{pendingGradesCount}</div>
                </div>
                <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: '#fff' }}>
                  <div style={{ fontSize: 13.5, color: '#64748b' }}>Course Materials Published</div>
                  <div style={{ fontSize: 31, fontWeight: 800, color: '#2563eb', margin: '6px 0 0' }}>{materialsCount}</div>
                </div>
              </div>

              {/* Showcase of Faculty Studios */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 4px 0' }}>🏛️ Faculty Governance & Research Studios</h3>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Statutory course planning, research fellowships, and institutional duties.</p>
                  </div>
                  <button
                    onClick={() => setActiveNav('studios')}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      padding: '8px 16px',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View All 34 Studios →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  {ALL_FACULTY_STUDIOS.slice(0, 6).map((studio) => (
                    <Link
                      key={studio.id}
                      href={studio.path}
                      style={{
                        textDecoration: 'none',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#f8fafc'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 20 }}>{studio.icon}</span>
                          <span style={{ fontSize: 11, background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                            {studio.badge}
                          </span>
                        </div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>{studio.title}</h4>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{studio.description}</p>
                      </div>
                      <div style={{ marginTop: 12, fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
                        Open Studio →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Master Studios Tab */}
          {activeNav === 'studios' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px 0' }}>Faculty Governance, Academic Services & Research Studios</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
                  Master directory of all 34 statutory faculty interfaces for syllabus design, doctoral fellowships, book publishing, IPR, and promotion dossiers.
                </p>
              </div>

              {/* Filters */}
              <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: 16,
                marginBottom: 24,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Search faculty studios by title, regulatory body, or keyword..."
                  value={studioSearch}
                  onChange={(e) => setStudioSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 260,
                    padding: '8px 14px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 13.5,
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { id: 'all', label: 'All Studios (34)' },
                    { id: 'academic', label: 'Academic & Outcomes' },
                    { id: 'research', label: 'Research & Innovation' },
                    { id: 'career', label: 'Career & Governance' },
                    { id: 'operations', label: 'Operations & Labs' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setStudioCategory(cat.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: studioCategory === cat.id ? 700 : 500,
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: studioCategory === cat.id ? '#2563eb' : '#cbd5e1',
                        background: studioCategory === cat.id ? '#eff6ff' : 'transparent',
                        color: studioCategory === cat.id ? '#2563eb' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {filteredStudios.map((studio) => (
                  <div
                    key={studio.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{ fontSize: 24 }}>{studio.icon}</span>
                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          fontWeight: 600
                        }}>
                          {studio.badge}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                        {studio.title}
                      </h3>
                      <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                        {studio.description}
                      </p>
                    </div>

                    <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <code style={{ fontSize: 11, color: '#94a3b8' }}>{studio.path}</code>
                      <Link
                        href={studio.path}
                        style={{
                          textDecoration: 'none',
                          background: '#2563eb',
                          color: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        Launch Studio →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredStudios.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: '#64748b', fontSize: 14 }}>
                  No faculty studios match your search filter.
                </div>
              )}
            </div>
          )}

          {activeNav === 'students' && <TeacherStudentDetailsTab initialSearch={headerStudentQuery} />}
          {activeNav === 'events-audit' && <TeacherEventsAuditTab />}
          {activeNav === 'inbox' && <TeacherInboxManager teacherId={teacher?.id || 'priya'} teacherName={displayName} />}
          {activeNav === 'courses' && <CourseManager />}
          {activeNav === 'exams' && <ExamGradingManager />}
          {activeNav === 'attendance' && <AttendanceTracker />}
          {activeNav === 'analytics' && <BatchAnalyticsView />}
        </main>
      </div>
    </div>
  );
}
