'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

type PortalRole = 'admin' | 'recruiter' | 'consultant';
type SettingsTab = 'requirements' | 'rollout' | 'migration' | 'erp' | 'training';

interface RequirementItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'future';
  fileLink?: string;
  fileLabel?: string;
  notes?: string;
}

const REQUIREMENTS_DATA: Record<PortalRole, RequirementItem[]> = {
  admin: [
    {
      id: 'adm-rbac',
      title: 'User Management & Role-Based Access (RBAC)',
      description: 'System-wide user registry with capabilities to search, paginate, filter, and dynamically reassign roles.',
      status: 'completed',
      fileLink: '/admin',
      fileLabel: 'Admin Control Panel',
      notes: 'Implemented in user table view with inline dropdown role modifiers.'
    },
    {
      id: 'adm-override',
      title: 'Manual Audit & Score Overrides',
      description: 'Allows administrators to adjust student metrics (Trust, ATS, DNA) with a mandatory log audit reason.',
      status: 'completed',
      fileLink: '/admin',
      fileLabel: 'Score Override Modal',
      notes: 'Linked directly inside the Users Manager tab.'
    },
    {
      id: 'adm-fraud',
      title: 'Integrity Monitoring & Fraud Detection',
      description: 'Tracks abnormal activity, such as tab-switching during exams, or suspicious score spikes.',
      status: 'completed',
      fileLink: '/admin',
      fileLabel: 'Fraud Alerts Tab',
      notes: 'Active triggers flag students on the Fraud board for moderator review.'
    },
    {
      id: 'adm-audit',
      title: 'CSV Compliance Audit Exports',
      description: 'Logs all administrative actions (overrides, suspensions) and generates a downloadable CSV audit trail.',
      status: 'completed',
      fileLink: '/admin',
      fileLabel: 'Audit Logs Tab',
      notes: 'Audit entries saved in Firestore and downloadable via "Export Log CSV" action.'
    },
    {
      id: 'adm-bcast',
      title: 'Broadcast Announcement System',
      description: 'Allows bulk dispatching of notifications to students or specific target roles.',
      status: 'completed',
      fileLink: '/admin',
      fileLabel: 'Broadcast Tab',
      notes: 'Broadcasts populate student dashboard notifications immediately.'
    },
    {
      id: 'adm-billing',
      title: 'Subscription & SaaS Billing Manager',
      description: 'Control service tiers, payment configurations, and plan quotas.',
      status: 'completed',
      fileLink: '/pricing',
      fileLabel: 'Pins & Plans Panel',
      notes: 'Allows checking credit balance (pins) and upgrading/unlocking pro features.'
    }
  ],
  recruiter: [
    {
      id: 'rec-search',
      title: 'Talent Pool Sourcing & Boolean Filter',
      description: 'Filter candidates by domain keywords, skills, minimum ATS matches, and Trust scores.',
      status: 'completed',
      fileLink: '/recruiter',
      fileLabel: 'Candidates Tab',
      notes: 'Fetches active student profiles with visibility metrics.'
    },
    {
      id: 'rec-ats',
      title: 'Applicant Tracking System (ATS) Pipeline',
      description: 'Kanban/pipeline state tracker for candidate applications (Applied, Shortlisted, Selected, Rejected).',
      status: 'completed',
      fileLink: '/recruiter',
      fileLabel: 'Applications Tab',
      notes: 'Updates Firestore status records and propagates progress to candidate dashboards.'
    },
    {
      id: 'rec-jobs',
      title: 'Active Job Openings Manager',
      description: 'Allows posting, editing, and deleting job offers. Synced directly to student opportunities feed.',
      status: 'completed',
      fileLink: '/recruiter',
      fileLabel: 'Active Jobs Tab',
      notes: 'Add job form collects title, department, salary, and requirements.'
    },
    {
      id: 'rec-invite',
      title: 'Interview Scheduler',
      description: 'Book interview slots (video, phone, in-person) directly from the candidate screening drawer.',
      status: 'completed',
      fileLink: '/recruiter',
      fileLabel: 'Candidates -> Drawer',
      notes: 'Invites are dispatched to the student immediately.'
    },
    {
      id: 'rec-brand',
      title: 'Company Branding Profile',
      description: 'Allows editing recruiter company profile fields (tagline, industry, headquarters, about).',
      status: 'completed',
      fileLink: '/recruiter',
      fileLabel: 'Company Profile Tab',
      notes: 'Autofills brand details for all associated job postings.'
    },
    {
      id: 'rec-parse',
      title: 'AI Resume Screening & Keyword Matcher',
      description: 'Compares candidate qualifications against job requirements to calculate compliance.',
      status: 'completed',
      fileLink: '/resume',
      fileLabel: 'Resume & ATS Panel',
      notes: 'Calculates the ATS match percentage and highlights missing keywords.'
    }
  ],
  consultant: [
    {
      id: 'con-crm',
      title: 'Student CRM Progression Pipeline',
      description: 'Kanban view of linked students categorized by document collection, visa tracking, and pre-departure stages.',
      status: 'completed',
      fileLink: '/consultant',
      fileLabel: 'CRM Pipeline Board',
      notes: 'Tracks student progress phases cleanly in standard stages.'
    },
    {
      id: 'con-verify',
      title: 'Document & Vault Verification Workflow',
      description: 'Review student certificate uploads. Approving items directly increases student trust credentials.',
      status: 'completed',
      fileLink: '/consultant',
      fileLabel: 'Student CRM -> Verify',
      notes: 'Approved documents trigger a +5 boost to the student\'s Trust Quotient.'
    },
    {
      id: 'con-session',
      title: '1:1 Mentorship Session Scheduler',
      description: 'Schedule video call slots with virtual links, syncs directly to the student\'s command center.',
      status: 'completed',
      fileLink: '/consultant',
      fileLabel: 'Sessions Tab',
      notes: 'Mentorship meetings are propagated to student notifications immediately.'
    },
    {
      id: 'con-tasks',
      title: 'Checklist Task Manager',
      description: 'Add specific target checklists for students with priority badges (high, medium, low) and deadlines.',
      status: 'completed',
      fileLink: '/consultant',
      fileLabel: 'CRM Board -> Tasks',
      notes: 'Allows checking off pipeline milestones dynamically.'
    },
    {
      id: 'con-stats',
      title: 'Pipeline Conversion Analytics',
      description: 'Visual statistics on conversion rates, visa approval ratings, and active student metrics.',
      status: 'completed',
      fileLink: '/consultant',
      fileLabel: 'CRM -> Analytics',
      notes: 'Reflects total linked students, visa approvals, and revenue metrics.'
    }
  ]
};

import { Suspense } from 'react';

function AdminSettingsContent() {
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('requirements');
  const [activeTab, setActiveTab] = useState<PortalRole>('admin');

  // --- Pilot Rollout States ---
  const [cohorts, setCohorts] = useState([
    { name: 'CSE Pilot Cohort A', size: 60, status: 'Active', launchDate: '2026-07-01' },
    { name: 'ECE Pilot Cohort B', size: 45, status: 'Training', launchDate: '2026-07-15' },
    { name: 'ME Pilot Cohort C', size: 30, status: 'Kickoff', launchDate: '2026-08-01' }
  ]);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('CSE Pilot Cohort A');
  const [feedbackLogs, setFeedbackLogs] = useState<any[]>([]);

  // --- Migration States ---
  const [migrationStep, setMigrationStep] = useState(1);
  const [targetTable, setTargetTable] = useState('students');
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [validationReport, setValidationReport] = useState<any | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  // --- ERP Integration States ---
  const [erpConnector, setErpConnector] = useState('sap');
  const [erpUrl, setErpUrl] = useState('https://sap.campus-os.edu/odata/v4/');
  const [erpKey, setErpKey] = useState('••••••••••••••••');
  const [syncLogs, setSyncLogs] = useState([
    { id: 1, connector: 'SAP Student Lifecycle', date: '10:15 AM', status: 'Success', count: 45 },
    { id: 2, connector: 'Canvas LMS Connector', date: 'Yesterday', status: 'Success', count: 88 }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Training & Change Management States ---
  const [trainingList, setTrainingList] = useState([
    { topic: 'TPO Placement Console Kickoff', date: '2026-07-20', time: '11:00 AM', enrolled: 12, host: 'Dean Academics' },
    { topic: 'Faculty Mentorship Booking Training', date: '2026-07-22', time: '02:30 PM', enrolled: 24, host: 'Support Desk' }
  ]);
  const [newTopic, setNewTopic] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [readinessCheck, setReadinessCheck] = useState([
    { id: 'item1', task: 'Department Head Orientation Completed', checked: true },
    { id: 'item2', task: 'ERP Data Schema Alignment Checked', checked: true },
    { id: 'item3', task: 'Mock Portals verified by TPO officers', checked: false },
    { id: 'item4', task: 'Student credentials bulk dispatches issued', checked: false }
  ]);

  // Load Feedback on Mount
  useEffect(() => {
    const cachedFeedback = JSON.parse(localStorage.getItem('rollout_feedback_logs') || '[]');
    setFeedbackLogs(cachedFeedback);
  }, []);

  // --- Actions ---
  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNote.trim()) return;
    try {
      const res = await api.post<any>('/api/settings/rollout/feedback', {
        cohort: selectedCohort,
        note: feedbackNote
      });
      if (res.ok) {
        setFeedbackLogs(prev => [res.feedback, ...prev]);
        setFeedbackNote('');
      }
    } catch {}
  };

  const handleSimulateDrag = () => {
    setDraggedFile('students_admissions_roster_2026.csv');
    setMigrationStep(2);
  };

  const handleValidateFile = async () => {
    setIsValidating(true);
    try {
      const res = await api.post<any>('/api/settings/migration/validate', {
        targetTable,
        fileName: draggedFile
      });
      if (res.ok) {
        setValidationReport(res);
        setMigrationStep(3);
      }
    } catch {}
    setIsValidating(false);
  };

  const handleExecuteImport = async () => {
    setIsImporting(true);
    try {
      const res = await api.post<any>('/api/settings/migration/execute', {
        targetTable
      });
      if (res.ok) {
        setImportResult(res);
        setMigrationStep(4);
      }
    } catch {}
    setIsImporting(false);
  };

  const handleResetMigration = () => {
    setMigrationStep(1);
    setDraggedFile(null);
    setValidationReport(null);
    setImportResult(null);
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await api.post<any>('/api/settings/erp/sync', {
        connector: erpConnector === 'sap' ? 'SAP Student Lifecycle' : erpConnector === 'oracle' ? 'Oracle PeopleSoft' : erpConnector === 'banner' ? 'Ellucian Banner' : 'Canvas LMS'
      });
      if (res.ok) {
        setSyncLogs(prev => [
          { id: Date.now(), connector: res.connector, date: res.syncDate, status: 'Success', count: res.recordsMerged },
          ...prev
        ]);
      }
    } catch {}
    setIsSyncing(false);
  };

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic || !newDate || !newTime) return;
    setTrainingList(prev => [
      ...prev,
      { topic: newTopic, date: newDate, time: newTime, enrolled: 0, host: 'System Administrator' }
    ]);
    setNewTopic('');
    setNewDate('');
    setNewTime('');
  };

  const toggleReadiness = (id: string) => {
    setReadinessCheck(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ marginBottom: 24 }} className="page-header">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
          ⚙️ Enterprise Implementation Suite
        </h1>
        <p style={{ color: 'var(--t2)', fontSize: 13.5, margin: 0 }}>
          Manage multi-campus migration wizards, pilot cohort rollouts, ERP endpoints configuration, and change logs.
        </p>
      </div>

      {/* Primary Navigation Tabs */}
      <div style={{
        display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4,
        borderRadius: 'var(--radius)', border: '1px solid var(--border)',
        marginBottom: 24, width: 'fit-content'
      }}>
        {[
          { id: 'requirements', label: 'Requirements Guide', icon: '📋' },
          { id: 'rollout', label: 'Pilot Rollout', icon: '🚀' },
          { id: 'migration', label: 'Migration Wizard', icon: '⚡' },
          { id: 'erp', label: 'ERP Integrations', icon: '🔌' },
          { id: 'training', label: 'Change Management', icon: '🎓' }
        ].map(t => (
          <button key={t.id} onClick={() => setSettingsTab(t.id as SettingsTab)} style={{
            padding: '8px 16px', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)',
            background: settingsTab === t.id ? 'var(--bg2)' : 'transparent',
            color: settingsTab === t.id ? 'var(--t1)' : 'var(--t3)',
            boxShadow: settingsTab === t.id ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s'
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        
        {/* Left Area: Dynamic Content based on Tabs */}
        <div>
          
          {/* TAB 1: REQUIREMENTS */}
          {settingsTab === 'requirements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tabs Menu */}
              <div style={{ 
                display: 'flex', 
                background: 'var(--bg3)', 
                padding: 4, 
                borderRadius: 12, 
                border: '1px solid var(--border)', 
                gap: 4,
                width: 'fit-content'
              }}>
                {(['admin', 'recruiter', 'consultant'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 9,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      textTransform: 'capitalize',
                      background: activeTab === role ? 'var(--bg2)' : 'transparent',
                      color: activeTab === role ? 'var(--t1)' : 'var(--t3)',
                      boxShadow: activeTab === role ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    {role === 'admin' ? '🛡️ Admin' : role === 'recruiter' ? '🔍 Recruiter' : '🗂️ Consultant'}
                  </button>
                ))}
              </div>

              {/* Requirements List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REQUIREMENTS_DATA[activeTab].map(req => (
                  <div key={req.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>{req.title}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        fontFamily: 'var(--font-mono)',
                        background: req.status === 'completed' ? 'var(--green-light)' : 'var(--amber-light)',
                        color: req.status === 'completed' ? 'var(--green)' : 'var(--amber)',
                        border: req.status === 'completed' ? '1px solid rgba(5,150,105,0.15)' : '1px solid rgba(217,119,6,0.15)'
                      }}>
                        {req.status === 'completed' ? '✓ Active' : '⚡ In Progress'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, margin: '0 0 10px' }}>{req.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
                      <div style={{ color: 'var(--t3)' }}>
                        Note: <span style={{ color: 'var(--t2)' }}>{req.notes}</span>
                      </div>
                      {req.fileLink && (
                        <a href={req.fileLink} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          Open {req.fileLabel} ➔
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PILOT ROLLOUT */}
          {settingsTab === 'rollout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Cohorts status */}
              <div style={card}>
                <div style={cardLabel}>Active Pilot Cohorts</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  {cohorts.map(c => (
                    <div key={c.name} style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)' }}>
                        <span>Size: {c.size} students</span>
                        <span style={{
                          fontWeight: 700,
                          color: c.status === 'Active' ? 'var(--green)' : c.status === 'Training' ? 'var(--blue)' : 'var(--amber)'
                        }}>{c.status}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 8 }}>Launch: {c.launchDate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log Rollout Feedback */}
              <div style={card}>
                <div style={cardLabel}>Log Cohort Rollout Observation & Feedback</div>
                <form onSubmit={handleAddFeedback} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12 }}>
                    <select className="form-input" style={{ fontSize: 12.5 }} value={selectedCohort} onChange={e => setSelectedCohort(e.target.value)}>
                      {cohorts.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <input
                      type="text" className="form-input" style={{ fontSize: 12.5 }}
                      placeholder="e.g. Students successfully completed orientation. System response was stable."
                      value={feedbackNote} onChange={e => setFeedbackNote(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: 'fit-content', alignSelf: 'flex-end', fontSize: 12.5 }}>
                    📝 Post Feedback Log
                  </button>
                </form>
              </div>

              {/* Feedback History logs */}
              <div style={card}>
                <div style={cardLabel}>Pilot Observations Logs</div>
                {feedbackLogs.length === 0 ? (
                  <div style={{ color: 'var(--t3)', fontSize: 13 }}>No observation feedback logged yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {feedbackLogs.map((log: any) => (
                      <div key={log.id} style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 700 }}>
                          <span style={{ color: 'var(--accent)' }}>{log.cohort}</span>
                          <span style={{ fontSize: 10, color: 'var(--t3)' }}>{log.date}</span>
                        </div>
                        <div style={{ color: 'var(--t2)' }}>{log.note}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MIGRATION WIZARD */}
          {settingsTab === 'migration' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={cardLabel}>Enterprise Import & Migration Wizard</div>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', padding: '3px 8px', borderRadius: 4 }}>
                    Step {migrationStep} of 4
                  </div>
                </div>

                {/* Progress Indicators */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                  {['Scope Definition', 'File Upload', 'Validation & Check', 'Database Execution'].map((s, idx) => (
                    <div key={s} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: idx + 1 <= migrationStep ? 'var(--accent)' : 'var(--bg3)',
                      transition: 'all 0.3s'
                    }} />
                  ))}
                </div>

                {/* Step contents */}
                {migrationStep === 1 && (
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 14 }}>
                      Select the destination registry database table target schema:
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                      {[
                        { id: 'students', label: 'Student Roster', desc: 'Roll numbers, ATS scores, emails' },
                        { id: 'faculty', label: 'Faculty Directory', desc: 'Staff codes, payroll designations' }
                      ].map(t => (
                        <div
                          key={t.id} onClick={() => setTargetTable(t.id)}
                          style={{
                            flex: 1, padding: 16, borderRadius: 12, border: '1px solid var(--border)', cursor: 'pointer',
                            background: targetTable === t.id ? 'var(--accent-light)' : 'var(--bg3)',
                            borderColor: targetTable === t.id ? 'var(--accent)' : 'var(--border)',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>{t.label}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>{t.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div
                      onClick={handleSimulateDrag}
                      style={{
                        border: '2px dashed var(--border)', borderRadius: 12, padding: '30px 20px',
                        textAlign: 'center', cursor: 'pointer', background: 'var(--bg3)'
                      }}
                    >
                      <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>📄</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>Click to Simulate Excel / CSV Upload</span>
                      <p style={{ fontSize: 11, color: 'var(--t3)', margin: '4px 0 0' }}>Accepts .csv, .xls, .xlsx files up to 20MB</p>
                    </div>
                  </div>
                )}

                {migrationStep === 2 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', borderRadius: 8, padding: 12, marginBottom: 20 }}>
                      <span style={{ fontSize: 18 }}>✓</span>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{draggedFile}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>Format: CSV File (UTF-8 format)</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button className="btn-secondary" style={{ fontSize: 12.5 }} onClick={handleResetMigration}>
                        Cancel
                      </button>
                      <button className="btn-primary" style={{ fontSize: 12.5 }} onClick={handleValidateFile} disabled={isValidating}>
                        {isValidating ? 'Validating CSV...' : 'Validate CSV Schema ➔'}
                      </button>
                    </div>
                  </div>
                )}

                {migrationStep === 3 && validationReport && (
                  <div>
                    <div style={{ background: 'var(--amber-light)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, padding: 12, fontSize: 12.5, marginBottom: 16 }}>
                      ⚠️ <strong>Parsing Report:</strong> Checked {validationReport.rowsDetected} lines. Valid columns matched: <code>{validationReport.validColumns.join(', ')}</code>. Detected 2 syntax errors.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                      {validationReport.issues.map((iss: any) => (
                        <div key={iss.row} style={{ background: 'var(--bg3)', padding: '8px 12px', borderRadius: 6, fontSize: 11.5, display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--coral)', fontWeight: 700 }}>Row {iss.row}</span>
                          <span style={{ color: 'var(--t2)' }}>{iss.message}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button className="btn-secondary" style={{ fontSize: 12.5 }} onClick={handleResetMigration}>
                        Cancel
                      </button>
                      <button className="btn-primary" style={{ fontSize: 12.5 }} onClick={handleExecuteImport} disabled={isImporting}>
                        {isImporting ? 'Executing Sync...' : 'Execute Bulk Migration (140 records) ➔'}
                      </button>
                    </div>
                  </div>
                )}

                {migrationStep === 4 && importResult && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                    <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 6 }}>Migration Executed Successfully</div>
                    <p style={{ fontSize: 13, color: 'var(--t2)', maxWidth: 460, margin: '0 auto 20px' }}>
                      {importResult.message} Integrated <strong>{importResult.loaded}</strong> rows successfully. Failed {importResult.failed} rows.
                    </p>
                    <button className="btn-primary" style={{ fontSize: 12.5 }} onClick={handleResetMigration}>
                      Start New Migration
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ERP INTEGRATIONS */}
          {settingsTab === 'erp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={card}>
                <div style={cardLabel}>Configure Campus Enterprise Resource Planning (ERP) Connections</div>
                
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {[
                    { id: 'sap', label: 'SAP Student Lifecycle' },
                    { id: 'oracle', label: 'Oracle PeopleSoft' },
                    { id: 'banner', label: 'Ellucian Banner' },
                    { id: 'canvas', label: 'Canvas LMS' }
                  ].map(c => (
                    <button
                      key={c.id} onClick={() => setErpConnector(c.id)}
                      style={{
                        padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
                        fontSize: 11.5, fontWeight: 700,
                        background: erpConnector === c.id ? 'var(--accent)' : 'var(--bg3)',
                        color: erpConnector === c.id ? '#fff' : 'var(--t2)'
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>ERP OData / REST Endpoint API URL</label>
                    <input type="text" className="form-input" style={{ width: '100%', fontSize: 12.5 }} value={erpUrl} onChange={e => setErpUrl(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Client Sync Secret Passkey</label>
                    <input type="password" className="form-input" style={{ width: '100%', fontSize: 12.5 }} value={erpKey} onChange={e => setErpKey(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn-secondary" style={{ fontSize: 12.5 }}>Save Configurations</button>
                  <button className="btn-primary" style={{ fontSize: 12.5 }} onClick={handleTriggerSync} disabled={isSyncing}>
                    {isSyncing ? 'Syncing...' : '🔌 Trigger Sync Test'}
                  </button>
                </div>
              </div>

              {/* Sync History Logs */}
              <div style={card}>
                <div style={cardLabel}>ERP Sync Execution Logs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {syncLogs.map(log => (
                    <div key={log.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', background: 'var(--bg3)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700 }}>{log.connector}</span>
                        <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>Sync Date: {log.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--green)', fontWeight: 700 }}>{log.status}</span>
                        <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 2 }}>{log.count} records merged</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRAINING */}
          {settingsTab === 'training' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Change management readiness */}
              <div style={card}>
                <div style={cardLabel}>Change Management Readiness Checklist</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {readinessCheck.map(item => (
                    <div
                      key={item.id} onClick={() => toggleReadiness(item.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                        background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)',
                        cursor: 'pointer', fontSize: 12.5
                      }}
                    >
                      <input type="checkbox" checked={item.checked} readOnly style={{ cursor: 'pointer' }} />
                      <span style={{
                        color: item.checked ? 'var(--t3)' : 'var(--t1)',
                        textDecoration: item.checked ? 'line-through' : 'none'
                      }}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled training classes */}
              <div style={card}>
                <div style={cardLabel}>Scheduled Training Webinars & Workshops</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {trainingList.map(t => (
                    <div key={t.topic} style={{ background: 'var(--bg3)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.topic}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--t2)', fontSize: 11.5 }}>
                        <span>📅 {t.date} at {t.time}</span>
                        <span>Enrolled: {t.enrolled} staff</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 6 }}>Instructor Host: {t.host}</div>
                    </div>
                  ))}
                </div>

                {/* Add Webinar */}
                <form onSubmit={handleAddTraining} style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)' }}>Schedule New Training Webinar</div>
                  <input
                    type="text" className="form-input" style={{ fontSize: 12.5 }} placeholder="Webinar Title (e.g. Faculty HR Workspace Orientation)"
                    value={newTopic} onChange={e => setNewTopic(e.target.value)} required
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input type="date" className="form-input" style={{ fontSize: 12.5 }} value={newDate} onChange={e => setNewDate(e.target.value)} required />
                    <input type="time" className="form-input" style={{ fontSize: 12.5 }} value={newTime} onChange={e => setNewTime(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ fontSize: 12.5, width: 'fit-content', alignSelf: 'flex-end' }}>
                    🗓️ Schedule Session
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Right Area: Sidebar Configurations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* API Keys */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              🔌 API Key Configurations
            </div>
            <p style={{ color: 'var(--t2)', fontSize: 11.5, lineHeight: 1.5, marginBottom: 14 }}>
              Integrations are driven securely via variables specified in the system config environment.
            </p>
            {[
              ['ANTHROPIC_API_KEY', 'Claude Sonnet 4'],
              ['GROQ_API_KEY', 'Llama 3 Instruct'],
              ['KOKORO_TTS', 'Kokoro + KittenTTS (Offline — No Key Needed)'],
              ['DATABASE_URL', 'PostgreSQL Main DB']
            ].map(([k, desc]) => (
              <div key={k} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '8px 10px', 
                background: 'var(--bg3)', 
                borderRadius: 8, 
                fontSize: 11, 
                marginBottom: 4 
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--t1)', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{desc}</div>
                </div>
                <span style={{ color: 'var(--green)', fontSize: 9, fontFamily: 'var(--font-mono)' }}>● Connected</span>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              ⚡ Portal Quick Access
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['/admin', 'Admin Command Center'],
                ['/recruiter', 'Recruiter Candidate Sourcing'],
                ['/consultant', 'Consultant Student CRM'],
                ['/dashboard', 'Student Command Center']
              ].map(([href, label]) => (
                <a 
                  key={href} 
                  href={href} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    padding: '8px 12px', 
                    background: 'var(--glass)', 
                    borderRadius: 8, 
                    textDecoration: 'none', 
                    color: 'var(--t1)', 
                    fontSize: 12, 
                    border: '1px solid var(--border)', 
                    transition: 'all 0.15s' 
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>→</span>{label}
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Loading Settings...</div>}>
      <AdminSettingsContent />
    </Suspense>
  );
}

const card: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-sm)'
};
const cardLabel: React.CSSProperties = {
  fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase',
  color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600,
  marginBottom: 14, display: 'block'
};
