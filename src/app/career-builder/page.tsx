'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { StudentSkillProfile, JobDescriptionSkillGap, InternshipRecord } from '@/lib/pathway/competencySchema';
import { COMPETENCY_CATALOG_V1 } from '@/lib/pathway/competencyCatalog';
import { CANONICAL_TRAJECTORIES, CareerTrajectory, TrajectoryNode } from '@/lib/data/careerTrajectories';
import { generateStructuredResume, mapTrackToRoleCategory, StudentProfileInput } from '@/lib/ats/resumeGenerator';
import { auditResumeATS, AtsAuditReport } from '@/lib/ats/atsScreener';
import { matchJobDescription, requiredSkillsFromJd } from '@/lib/opportunities/jdMatch';
import { printResumeClientSide, generateResumeHtml } from '@/lib/printResume';
import { TRACKS, resolveTrackFromGoal } from '@/lib/onboarding/trackResolver';
import { useVault } from '@/hooks/useVault';

interface Quest {
  id: string;
  title: string;
  desc?: string;
  type?: 'coding' | 'lecture' | 'interactive' | string;
  category?: 'learning' | 'exam' | 'assignment' | string;
  requiresAvatar?: boolean;
  starterCode?: string;
  hint?: string;
  testSuite?: string;
  skillCategory?: string;
  syllabus?: string[];
  fastTracked?: boolean;
  reinforcementNeeded?: boolean;
  personalizedHint?: string;
  competencyTag?: {
    competencyId: string;
    evidenceClass: string;
    difficulty: string;
    masteryState?: string;
  };
}

interface Module {
  id: string;
  courseId?: string;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  estimatedWeeks: number;
  personalizedPaceTag?: string;
  knowledgeAdaptationTag?: string;
  tradeoffInterventions?: string[];
  allocationsTag?: string;
  quests: Quest[];
}

// Domain categories for trajectory taxonomy
type DomainCategory = 'all' | 'engineering' | 'ai_data' | 'cloud_devops' | 'iot_hardware' | 'commerce' | 'growth_product';

interface TrajectoryCatalogItem {
  id: string;
  roleTitle: string;
  icon: string;
  description: string;
  category: DomainCategory;
  categoryLabel: string;
  primaryCourseId: string;
  averageSalaryRange: string;
  targetTotalDays: number;
  skills: string[];
  careerImpact: string;
  nodes: TrajectoryNode[];
}

const SAMPLE_JOB_DESCRIPTIONS: Record<string, { label: string; text: string }> = {
  fullstack: {
    label: '💻 Full-Stack React & Node',
    text: `Job Title: Senior Full-Stack Software Engineer
Company: CloudScale Technologies (Bengaluru / Hybrid)
Requirements:
- 3+ years experience building production web applications with React 18, Next.js, and TypeScript.
- Strong proficiency in Node.js, Express, REST APIs, and GraphQL microservices.
- Relational database modeling with PostgreSQL and query optimization with Redis caching.
- Hands-on experience with Docker containerization, CI/CD pipelines, and AWS deployment.
- Understanding of state machines, client performance profiling, and test-driven development (Jest/Cypress).`
  },
  ai_python: {
    label: '🐍 Python AI & LLM Systems',
    text: `Job Title: AI & LLM Systems Engineer
Company: DeepMind Intelligence Systems
Requirements:
- Strong foundations in Python 3.12, AsyncIO, PyTorch, and NumPy vector computation.
- Experience building RAG (Retrieval-Augmented Generation) pipelines with vector embeddings and vector databases.
- Familiarity with Transformer architectures, fine-tuning, LoRA adapters, and LLM orchestration frameworks.
- Production backend API engineering with FastAPI and container deployment on Kubernetes.
- Rigorous mindset towards model evaluation, latency minimization, and AI safety guardrails.`
  },
  cloud_devops: {
    label: '☁️ Cloud Infrastructure & DevOps SRE',
    text: `Job Title: Cloud & SRE Infrastructure Engineer
Company: Nexus Global Cloud
Requirements:
- Deep expertise in Linux systems administration, networking protocols (TCP/IP, DNS, TLS), and shell automation.
- Production container orchestration using Docker, Kubernetes (EKS/GKE), and Helm charts.
- Infrastructure-as-Code (Terraform) and robust CI/CD pipeline automation with GitHub Actions.
- Observability and sentinel telemetry using Prometheus, Grafana, and distributed tracing.
- Cloud security audits, IAM role hardening, and multi-region disaster recovery engineering.`
  },
  accounting_finance: {
    label: '📊 Digital Forensic Accountant & Auditor',
    text: `Job Title: Corporate Forensic Accountant & Financial Analyst
Company: Apex Assurance Partners
Requirements:
- Bachelor of Commerce / Accounting degree with strong mastery of Indian Accounting Standards (Ind AS) & IFRS.
- Hands-on expertise in digital bookkeeping, statutory audit procedures, and forensic ledger reconciliation.
- Proficient in ERP systems (Tally Prime, SAP ERP), GST statutory filings, and TDS tax compliance.
- Advanced financial statement analysis, ratio decomposition, capital budgeting, and cash flow forecasting.
- Strong audit trail documentation, internal controls evaluation, and compliance risk governance.`
  },
  growth_marketing: {
    label: '📈 Digital Growth & Performance Marketer',
    text: `Job Title: Growth Marketing & Analytics Manager
Company: HyperScale Consumer Platforms
Requirements:
- Proven track record scaling digital customer acquisition across Meta Ads, Google Performance Max, and LinkedIn.
- High data fluency in conversion rate optimization (CRO), A/B hypothesis testing, and retention funnel cohort analysis.
- Experience with Google Analytics 4 (GA4), Mixpanel telemetry, and UTM attribution modeling.
- Search Engine Optimization (SEO) technical audits, programmatic keyword strategies, and brand positioning.
- E-commerce unit economics optimization (CAC, LTV, ROAS, Payback Period) and marketing automation.`
  }
};

export default function CareerBuilderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const cOS = useCareerOS();
  const { vaultItems } = useVault();

  const {
    roadmapGenerated,
    setRoadmapGenerated,
    onboardingAnswers,
    setOnboarding,
    onboardingStep,
    setOnboardingStep
  } = cOS;

  // View & Filter States
  const [activeView, setActiveView] = useState<'roadmap' | 'resume'>('roadmap');
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrajectoryId, setSelectedTrajectoryId] = useState<string>('fullstack-developer');
  const [expandedStageIndex, setExpandedStageIndex] = useState<number | null>(0);

  // Candidate Profile Customizer State
  const [customCandidate, setCustomCandidate] = useState<Partial<StudentProfileInput>>({});
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Configuration States
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [studyPace, setStudyPace] = useState<number>(2); // 1, 2, or 3 quests/day
  const [durationDays, setDurationDays] = useState<number>(30); // 30, 60, 90, 120 days
  const [loading, setLoading] = useState(false);
  const [previewModules, setPreviewModules] = useState<Module[]>([]);

  // ATS Gap & Resume States
  const [jdText, setJdText] = useState(SAMPLE_JOB_DESCRIPTIONS.fullstack.text);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsGaps, setAtsGaps] = useState<JobDescriptionSkillGap[]>([]);
  const [atsAuditReport, setAtsAuditReport] = useState<AtsAuditReport | null>(null);
  const [skillProfile, setSkillProfile] = useState<StudentSkillProfile | null>(null);
  const [internships, setInternships] = useState<InternshipRecord[]>([]);
  const [resumeMode, setResumeMode] = useState<'ats_clean' | 'modern_visual' | 'markdown'>('modern_visual');

  // Convert CANONICAL_TRAJECTORIES into Catalog Items
  const trajectoryCatalog = useMemo<TrajectoryCatalogItem[]>(() => {
    const list: TrajectoryCatalogItem[] = [];

    for (const [key, traj] of Object.entries(CANONICAL_TRAJECTORIES)) {
      let cat: DomainCategory = 'engineering';
      let catLabel = 'Engineering & SDE';

      if (key.includes('ai') || key.includes('analytics') || key.includes('data')) {
        cat = 'ai_data';
        catLabel = 'AI, Data & ML';
      } else if (key.includes('cloud') || key.includes('devops') || key.includes('cyber')) {
        cat = 'cloud_devops';
        catLabel = 'Cloud & DevOps';
      } else if (key.includes('iot') || key.includes('embedded') || key.includes('hardware')) {
        cat = 'iot_hardware';
        catLabel = 'IoT & Hardware';
      } else if (key.includes('account') || key.includes('financ') || key.includes('operations')) {
        cat = 'commerce';
        catLabel = 'Commerce & Finance';
      } else if (key.includes('market') || key.includes('ecom') || key.includes('entrepreneur') || key.includes('sales')) {
        cat = 'growth_product';
        catLabel = 'Growth & Product';
      }

      const allSkills = traj.nodes.flatMap(n => n.skillsLearned || []);
      const primaryCourse = traj.nodes[0]?.courseId || 'course-java-logic';

      list.push({
        id: key,
        roleTitle: traj.roleTitle,
        icon: traj.icon || '🚀',
        description: traj.description,
        category: cat,
        categoryLabel: catLabel,
        primaryCourseId: primaryCourse,
        averageSalaryRange: traj.averageSalaryRange || '₹8–18 LPA',
        targetTotalDays: traj.targetTotalDays || 120,
        skills: Array.from(new Set(allSkills)).slice(0, 6),
        careerImpact: traj.nodes[0]?.careerImpact || '+20% Readiness',
        nodes: traj.nodes,
      });
    }

    return list;
  }, []);

  // Filtered trajectories based on search and domain
  const filteredTrajectories = useMemo(() => {
    return trajectoryCatalog.filter(item => {
      const matchCat = selectedDomain === 'all' || item.category === selectedDomain;
      const matchSearch = searchQuery.trim() === '' ||
        item.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [trajectoryCatalog, selectedDomain, searchQuery]);

  // Selected trajectory item
  const selectedTrajectory = useMemo(() => {
    return trajectoryCatalog.find(t => t.id === selectedTrajectoryId) || trajectoryCatalog[0];
  }, [trajectoryCatalog, selectedTrajectoryId]);

  // Load saved roadmap modules and skill profile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const modulesKey = `pinit_${userId}_roadmap_modules`;
      const saved = localStorage.getItem(modulesKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPreviewModules(parsed);
          }
        } catch {}
      }
    }

    async function loadStudentData() {
      try {
        const [prof, intern] = await Promise.all([
          PathwayApiService.getStudentSkillProfile(userId),
          PathwayApiService.getInternshipRecords(userId),
        ]);
        setSkillProfile(prof);
        setInternships(intern);
      } catch (err) {
        console.warn('Failed to load profile data in career builder:', err);
      }
    }
    loadStudentData();

    if (typeof window !== 'undefined') {
      const savedCustom = localStorage.getItem(`pinit_${userId}_custom_resume_profile`);
      if (savedCustom) {
        try {
          setCustomCandidate(JSON.parse(savedCustom));
        } catch {}
      }
    }
  }, [userId]);

  const updateCustomCandidateField = (field: keyof StudentProfileInput, val: string) => {
    setCustomCandidate(prev => {
      const next = { ...prev, [field]: val };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pinit_${userId}_custom_resume_profile`, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  // Initial synthesized resume data with direct user customization capability
  const candidateInput = useMemo<StudentProfileInput>(() => {
    const defaultName = user?.name || (typeof user?.email === 'string' ? user.email.split('@')[0] : 'Arya Dev');
    const roleStr = selectedTrajectory?.roleTitle || 'Full-Stack Software Developer';
    const fullName = (typeof customCandidate.fullName === 'string' && customCandidate.fullName.trim()) ? customCandidate.fullName : String(defaultName);
    const cleanId = fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'candidate';

    return {
      fullName,
      email: typeof customCandidate.email === 'string' ? customCandidate.email : (user?.email || 'arya.dev@pinit.os'),
      phone: customCandidate.phone ?? '+91 98765 43210',
      address: customCandidate.address ?? 'Bengaluru, Karnataka, India',
      linkedin: customCandidate.linkedin ?? `linkedin.com/in/${cleanId}`,
      github: customCandidate.github ?? `github.com/${cleanId}`,
      portfolio: customCandidate.portfolio ?? `https://${cleanId}.dev`,
      degree: customCandidate.degree ?? (onboardingAnswers?.education || 'Bachelor of Technology (B.Tech)'),
      institution: customCandidate.institution ?? (onboardingAnswers?.collegeName || 'National Institute of Technology'),
      graduationYear: customCandidate.graduationYear ?? '2023 - 2027',
      gpa: customCandidate.gpa ?? '8.8 / 10.0 CGPA',
      targetRole: customCandidate.targetRole ?? roleStr,
    };
  }, [user, selectedTrajectory, onboardingAnswers, customCandidate]);

  // Track resolution
  const resolvedTrack = useMemo(() => {
    return resolveTrackFromGoal(selectedTrajectory?.roleTitle || 'Full-Stack Developer');
  }, [selectedTrajectory]);

  // Synthesized resume
  const synthesizedResume = useMemo(() => {
    return generateStructuredResume(candidateInput, vaultItems || [], resolvedTrack);
  }, [candidateInput, vaultItems, resolvedTrack]);

  // Run initial ATS audit report
  useEffect(() => {
    if (synthesizedResume?.plainText) {
      const report = auditResumeATS(synthesizedResume.plainText, {
        targetRole: synthesizedResume.targetRoleCategory,
      });
      setAtsAuditReport(report);
      setAtsScore(report.compositeScore);
    }
  }, [synthesizedResume]);

  // Run ATS Scanner against pasted Job Description
  const handleScanJobDescription = useCallback(() => {
    if (!jdText.trim()) {
      toast.error('Empty Job Description', 'Please paste a job description or click a sample preset.');
      return;
    }

    const jdRequired = requiredSkillsFromJd(jdText);
    const candidateSkills = [
      ...synthesizedResume.skills.all,
      ...(skillProfile?.verified || []).map(v => v.name),
      ...(selectedTrajectory?.skills || [])
    ];

    const jdResult = matchJobDescription(jdText, candidateSkills);

    // Calculate gap elements against Competency Catalog
    const textLower = jdText.toLowerCase();
    const verifiedNames = new Set((skillProfile?.verified || []).map(v => v.name.toLowerCase()));
    const demonstratedNames = new Set((skillProfile?.demonstrated || []).map(d => d.name.toLowerCase()));

    const detectedGaps: JobDescriptionSkillGap[] = [];
    for (const comp of COMPETENCY_CATALOG_V1) {
      const compWords = comp.title.split(/[:\s]/).map(w => w.toLowerCase()).filter(w => w.length > 3);
      const isMentioned = compWords.some(w => textLower.includes(w));
      if (isMentioned) {
        const isVerified = verifiedNames.has(comp.title.toLowerCase()) || Array.from(verifiedNames).some(v => v.includes(comp.id));
        const isDemonstrated = demonstratedNames.has(comp.title.toLowerCase()) || Array.from(demonstratedNames).some(d => d.includes(comp.id));

        detectedGaps.push({
          taxonomyTerm: comp.title,
          competencyId: comp.id,
          importance: comp.level === 'L0' || comp.level === 'L1' ? 'required' : 'preferred',
          isSatisfied: isVerified || isDemonstrated,
          userConsentStatus: isVerified ? 'accepted' : 'pending',
        });
      }
    }

    // Run audit
    const report = auditResumeATS(synthesizedResume.plainText, {
      targetRole: synthesizedResume.targetRoleCategory,
      jobDescription: jdText,
    });

    setAtsAuditReport(report);
    const finalScore = Math.max(jdResult.match_score, report.compositeScore);
    setAtsScore(finalScore);
    setAtsGaps(detectedGaps);

    if (jdRequired.length === 0 && detectedGaps.length === 0) {
      toast.info('Low Keyword Match', 'No recognizable technical skills found in this text. Try a technical job posting.');
    } else {
      toast.success('ATS Analysis Complete! 🎯', `Matched ${finalScore}% compatibility across ${jdRequired.length} detected JD competencies.`);
    }
  }, [jdText, synthesizedResume, skillProfile, selectedTrajectory]);

  // Consented Roadmap Addition
  const handleAcceptGaps = useCallback(async () => {
    const pendingTerms = atsGaps.filter(g => !g.isSatisfied).map(g => g.taxonomyTerm);
    if (pendingTerms.length === 0) {
      toast.info('No Missing Gaps', 'All required competencies are already satisfied!');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`pinit_${userId}_consented_ats_gaps`, JSON.stringify(pendingTerms));
    }

    setLoading(true);
    try {
      const skills = selectedTrajectory?.skills || [];
      const primaryCourse = selectedTrajectory?.primaryCourseId || 'course-fullstack-js';
      const res = await cOS.generateFusedRoadmap(skills, pendingTerms, primaryCourse, durationDays, studyPace);

      if (res && Array.isArray(res) && res.length > 0) {
        setPreviewModules(res);
        toast.success('Roadmap Updated with Consent! 🚀', `Fused ${pendingTerms.length} targeted skill gaps directly into your active weekly quest stages.`);
      } else {
        toast.success('Gaps Saved!', `Added ${pendingTerms.length} skills to your study queue.`);
      }
    } catch {
      toast.success('Gaps Saved!', `Added ${pendingTerms.length} skills to your roadmap checklist.`);
    } finally {
      setLoading(false);
    }
  }, [atsGaps, userId, selectedTrajectory, durationDays, studyPace, cOS]);

  // Generate dynamic roadmap via AI
  const handleGenerateRoadmap = async () => {
    setLoading(true);
    const targetLabel = selectedTrajectory.roleTitle;
    const skillsList = selectedTrajectory.skills.join(', ');
    const primaryCourse = selectedTrajectory.primaryCourseId;

    try {
      cOS.setOnboarding({
        role: targetLabel,
        education: onboardingAnswers?.education || 'B.Tech Computer Science',
        skills: skillsList,
        experience: experienceLevel,
        roadmapDurationDays: durationDays,
        roadmapDailyPace: studyPace,
      });

      const res = await cOS.generateFusedRoadmap(
        selectedTrajectory.skills,
        ['System Design', 'Enterprise Security'],
        primaryCourse,
        durationDays,
        studyPace
      );

      if (res && Array.isArray(res) && res.length > 0) {
        setPreviewModules(res);

        if (onboardingStep < 4) {
          cOS.setOnboardingStep(4);
        }

        toast.success('AI Roadmap Synthesized! 🧬', `Tailored ${res.length} progressive stages for "${targetLabel}".`);
      } else {
        toast.error('AI Generation Warning', 'Synthesized default canonical roadmap structure.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Generation Error', 'An error occurred during roadmap synthesis.');
    } finally {
      setLoading(false);
    }
  };

  // Commit and unlock Quests page with full course synchronicity
  const handleActivateRoadmap = () => {
    const courseId = selectedTrajectory.primaryCourseId;

    if (cOS.setActiveCourseId) {
      cOS.setActiveCourseId(courseId);
    }
    if (cOS.setActiveCourseIds) {
      cOS.setActiveCourseIds([courseId]);
    }

    if (typeof window !== 'undefined') {
      try {
        const toSave = previewModules.length > 0 ? previewModules : selectedTrajectory.nodes.map((node, i) => ({
          id: `${courseId}-stage-${i + 1}`,
          courseId: courseId,
          title: `Phase ${i + 1}: ${node.title}`,
          desc: node.shortDesc,
          difficulty: i === 0 ? 'Beginner' : i === 1 ? 'Intermediate' : 'Advanced',
          estimatedWeeks: 2,
          quests: []
        }));
        localStorage.setItem(`pinit_${userId}_roadmap_modules`, JSON.stringify(toSave));
        localStorage.setItem(`pinit_${userId}_roadmap_modules_${courseId}`, JSON.stringify(toSave));
        localStorage.setItem(`pinit_${userId}_active_course_id`, courseId);
      } catch (e) {
        console.warn(e);
      }
    }

    cOS.setRoadmapGenerated(true);
    if (onboardingStep < 4) {
      cOS.setOnboardingStep(4);
    }
    toast.success('Quest Roadmap Activated! 🗺️', `Switching to ${selectedTrajectory.roleTitle} in Quests Playground.`);
    router.push(`/quests?course=${courseId}`);
  };

  // Export PDF / Print
  const handlePrintResume = () => {
    try {
      printResumeClientSide(synthesizedResume.formData);
      toast.success('Preparing Print/PDF 🖨️', 'Opening native browser print dialog...');
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  // Download plain text ATS resume
  const handleDownloadTxt = () => {
    try {
      const element = document.createElement('a');
      const file = new Blob([synthesizedResume.plainText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${candidateInput.fullName.replace(/\s+/g, '_')}_ATS_Resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Downloaded Plain Text ATS Resume! 📄');
    } catch (err) {
      console.error(err);
      toast.error('Download Failed', 'Could not initiate file download.');
    }
  };

  // Safe clipboard copy
  const handleCopyPlainText = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(synthesizedResume.plainText)
        .then(() => toast.success('Copied Plain Text Resume! 📋'))
        .catch(() => toast.info('Clipboard Copy', 'Please select text and use Ctrl+C / Cmd+C.'));
    } else {
      toast.info('Clipboard Copy', 'Please select text and use Ctrl+C / Cmd+C.');
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 80, paddingLeft: 16, paddingRight: 16 }} className="animate-fade-in">
      {/* ── Page Header Bar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: '-0.5px',
            color: 'var(--t1)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '0 0 6px'
          }}>
            <span>🗺️</span> Career Architecture & ATS Intelligence Studio
          </h1>
          <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>
            Synthesize adaptive curriculum trajectories and generate industry-standard ATS resumes verified by cryptographic proof of work.
          </p>
        </div>

        {/* Status Pill Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--accent)',
            fontSize: 12.5,
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>🎯 Target:</span> {selectedTrajectory.roleTitle}
          </div>
          <div style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--green)',
            fontSize: 12.5,
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>🛡️ Proofs:</span> {skillProfile?.verified?.length || 0} SHA-256 Verified
          </div>
        </div>
      </div>

      {/* ── Main Tab Switcher ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 26 }}>
        <button
          onClick={() => setActiveView('roadmap')}
          style={{
            padding: '12px 22px',
            borderRadius: 12,
            border: `2px solid ${activeView === 'roadmap' ? 'var(--accent)' : 'var(--border)'}`,
            background: activeView === 'roadmap' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg2)',
            color: activeView === 'roadmap' ? 'var(--accent)' : 'var(--t2)',
            fontWeight: 900,
            fontSize: 14.5,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: activeView === 'roadmap' ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <span>🧬</span> Custom Roadmap Fuser
        </button>
        <button
          onClick={() => setActiveView('resume')}
          style={{
            padding: '12px 22px',
            borderRadius: 12,
            border: `2px solid ${activeView === 'resume' ? 'var(--accent)' : 'var(--border)'}`,
            background: activeView === 'resume' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg2)',
            color: activeView === 'resume' ? 'var(--accent)' : 'var(--t2)',
            fontWeight: 900,
            fontSize: 14.5,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: activeView === 'resume' ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <span>📄</span> AI Resume & ATS Gap Loop
        </button>
      </div>

      {/* ── TAB 1: CUSTOM ROADMAP FUSER ─────────────────────────────────── */}
      {activeView === 'roadmap' ? (
        <div className="career-builder-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 28 }}>
          {/* Left Panel: Target Trajectory Selection & Settings */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Section Header */}
              <div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  STEP 1 &middot; CAREER TRAJECTORY & PARADIGM
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 6px', letterSpacing: '-0.3px' }}>
                  Select Target Career Trajectory
                </h2>
                <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0 }}>
                  Choose from canonical industry tracks across Engineering, AI, Cloud, IoT, and Enterprise Commerce.
                </p>
              </div>

              {/* Search & Domain Filter Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text"
                  placeholder="🔍 Search roles, competencies (e.g. React, Python, Cloud, Accountant)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 13.5,
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />

                {/* Domain Category Filter Pills */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(
                    [
                      { id: 'all', label: 'All Tracks' },
                      { id: 'engineering', label: '💻 Engineering' },
                      { id: 'ai_data', label: '🤖 AI & Data' },
                      { id: 'cloud_devops', label: '☁️ Cloud/DevOps' },
                      { id: 'iot_hardware', label: '🔌 IoT' },
                      { id: 'commerce', label: '📊 Commerce' },
                      { id: 'growth_product', label: '🚀 Growth' },
                    ] as const
                  ).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedDomain(cat.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 20,
                        border: selectedDomain === cat.id ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                        background: selectedDomain === cat.id ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg3)',
                        color: selectedDomain === cat.id ? 'var(--accent)' : 'var(--t2)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trajectories Selection Cards Scrollbox */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxHeight: 380,
                overflowY: 'auto',
                paddingRight: 6
              }}>
                {filteredTrajectories.map(t => {
                  const isSelected = selectedTrajectoryId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrajectoryId(t.id)}
                      style={{
                        padding: 16,
                        borderRadius: 14,
                        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        boxShadow: isSelected ? '0 0 14px rgba(99, 102, 241, 0.2)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <span style={{ fontSize: 26, lineHeight: 1 }}>{t.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>{t.roleTitle}</div>
                            <span style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: 'var(--bg2)',
                              border: '1px solid var(--border)',
                              color: 'var(--accent)',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 800
                            }}>
                              {t.categoryLabel}
                            </span>
                          </div>

                          <div style={{ fontSize: 12.5, color: 'var(--t2)', marginTop: 4, lineHeight: 1.4 }}>
                            {t.description}
                          </div>

                          {/* Metadata row */}
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11.5, color: 'var(--green)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                              💰 {t.averageSalaryRange}
                            </span>
                            <span style={{ fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                              ⏱️ {t.targetTotalDays} Days
                            </span>
                            <span style={{ fontSize: 11.5, color: '#3b82f6', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                              🚀 {t.careerImpact}
                            </span>
                          </div>

                          {/* Skill badges */}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                            {t.skills.map((s, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: 11,
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  background: 'var(--bg2)',
                                  color: 'var(--t1)',
                                  border: '1px solid var(--border)',
                                  fontWeight: 600
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 2: Calibrated Pacing & Duration Parameters */}
              <div style={{
                background: 'var(--bg3)',
                padding: 18,
                borderRadius: 14,
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  STEP 2 &middot; CALIBRATE ADAPTIVE PACING
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                  {/* Experience Level */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>
                      Experience Level:
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={e => setExperienceLevel(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 13,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                      }}
                    >
                      <option value="beginner">Beginner (Guided)</option>
                      <option value="intermediate">Intermediate (Standard)</option>
                      <option value="advanced">Advanced (Fast-Track)</option>
                    </select>
                  </div>

                  {/* Daily Pace */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>
                      Daily Quest Pace:
                    </label>
                    <select
                      value={studyPace}
                      onChange={e => setStudyPace(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 13,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                      }}
                    >
                      <option value={1}>1 Quest / Day (Steady)</option>
                      <option value={2}>2 Quests / Day (Standard)</option>
                      <option value={3}>3 Quests / Day (Intensive)</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>
                      Target Duration:
                    </label>
                    <select
                      value={durationDays}
                      onChange={e => setDurationDays(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 13,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                      }}
                    >
                      <option value={30}>30 Days (Sprint)</option>
                      <option value={60}>60 Days (Accelerated)</option>
                      <option value={90}>90 Days (Deep Mastery)</option>
                      <option value={120}>120 Days (Full Trajectory)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Synthesize Button */}
              <button
                onClick={handleGenerateRoadmap}
                disabled={loading}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                    Synthesizing Adaptive Socratic Roadmap...
                  </>
                ) : (
                  <>
                    <span>⚡</span> Synthesize Custom AI Roadmap ({selectedTrajectory.roleTitle})
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Right Panel: Module & Quest Interactive Preview or Blueprint Preview */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {previewModules.length > 0 ? (
              <>
                {/* Header with Stage Count and Activation Button */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '0 0 2px' }}>
                      Compiled Quest Trajectory ({previewModules.length} Stages)
                    </h2>
                    <span style={{ fontSize: 12, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
                      Total Estimated Duration: ~{previewModules.reduce((acc, m) => acc + (m.estimatedWeeks || 2), 0)} Weeks
                    </span>
                  </div>

                  <button
                    onClick={handleActivateRoadmap}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'var(--green)',
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: 13.5,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Activate & Enter Playground ➔
                  </button>
                </div>

                {/* Timeline Tree Layout */}
                <div style={{ position: 'relative', paddingLeft: 30 }}>
                  <div style={{
                    position: 'absolute',
                    top: 14,
                    bottom: 14,
                    left: 10,
                    width: 3,
                    background: 'linear-gradient(180deg, var(--accent) 0%, #10b981 100%)',
                    opacity: 0.4,
                    borderRadius: 2
                  }} />

                  {previewModules.map((mod, modIdx) => {
                    const isExpanded = expandedStageIndex === modIdx;
                    return (
                      <div key={mod.id || modIdx} style={{ marginBottom: 24, position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          left: -27,
                          top: 6,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: 'var(--bg1)',
                          border: '3px solid var(--accent)',
                          boxShadow: '0 0 10px var(--accent)',
                          zIndex: 2
                        }} />

                        <div style={{
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          borderRadius: 16,
                          padding: 18,
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span style={{
                                fontSize: 11,
                                background: 'rgba(99, 102, 241, 0.15)',
                                color: 'var(--accent)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                padding: '2px 10px',
                                borderRadius: 12,
                                fontWeight: 800,
                                fontFamily: 'var(--font-mono)'
                              }}>
                                STAGE {modIdx + 1}
                              </span>
                              <span style={{
                                fontSize: 11,
                                background: 'var(--bg3)',
                                color: 'var(--t2)',
                                padding: '2px 8px',
                                borderRadius: 8,
                                fontWeight: 700
                              }}>
                                {mod.difficulty || 'Intermediate'}
                              </span>
                            </div>

                            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--t2)', fontWeight: 700 }}>
                              ⏳ {mod.estimatedWeeks || 2} Weeks
                            </span>
                          </div>

                          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px', letterSpacing: '-0.2px' }}>
                            {mod.title}
                          </h3>
                          <p style={{ fontSize: 13, color: 'var(--t2)', margin: '0 0 12px', lineHeight: 1.5 }}>
                            {mod.desc}
                          </p>

                          <div style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            fontSize: 12,
                            color: 'var(--green)',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            marginBottom: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}>
                            <span>🔒 Milestone Gate:</span> Requires 100% stage quest completion + verified capstone challenge.
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                              onClick={() => setExpandedStageIndex(isExpanded ? null : modIdx)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--bg3)',
                                color: 'var(--t1)',
                                fontSize: 12,
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                              }}
                            >
                              <span>{isExpanded ? '▲ Hide Quests' : '▼ View Quests'}</span> ({mod.quests?.length || 0} quests)
                            </button>

                            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                              {mod.personalizedPaceTag || '🎯 Calibrated'}
                            </span>
                          </div>

                          {isExpanded && mod.quests && mod.quests.length > 0 && (
                            <div style={{
                              marginTop: 14,
                              paddingTop: 14,
                              borderTop: '1px solid var(--border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8
                            }}>
                              {mod.quests.map((q, qIdx) => (
                                <div
                                  key={q.id || qIdx}
                                  style={{
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    background: 'var(--bg3)',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 12
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 16 }}>
                                      {q.category === 'exam' ? '🏆' : q.category === 'assignment' ? '📝' : q.type === 'coding' ? '💻' : '📖'}
                                    </span>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                                        {q.title}
                                      </div>
                                      {q.personalizedHint && (
                                        <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                                          {q.personalizedHint}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{
                                      fontSize: 10.5,
                                      textTransform: 'uppercase',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                      background: 'var(--bg2)',
                                      color: 'var(--t2)',
                                      fontFamily: 'var(--font-mono)',
                                      fontWeight: 700
                                    }}>
                                      {q.category || q.type || 'Quest'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Initial Trajectory Architecture Blueprint Preview */
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      CANONICAL ARCHITECTURE BLUEPRINT
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 2px' }}>
                      {selectedTrajectory.roleTitle} Trajectory
                    </h3>
                    <span style={{ fontSize: 12, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
                      Industry Benchmark: {selectedTrajectory.averageSalaryRange} &middot; Total Timeline: {selectedTrajectory.targetTotalDays} Days
                    </span>
                  </div>

                  <span style={{ fontSize: 32 }}>{selectedTrajectory.icon}</span>
                </div>

                <div style={{
                  padding: 12,
                  borderRadius: 10,
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: 12.5,
                  color: 'var(--t1)',
                  lineHeight: 1.5
                }}>
                  ⚡ <strong>Interactive Preview Mode:</strong> This blueprint previews the 4 progressive milestones for <strong>{selectedTrajectory.roleTitle}</strong>. Click the <em>&ldquo;⚡ Synthesize Custom AI Roadmap&rdquo;</em> button to calibrate these stages against your diagnostic profile scores.
                </div>

                {/* Milestone Node Blueprint List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {selectedTrajectory.nodes.map((node, nIdx) => (
                    <div
                      key={node.nodeId || nIdx}
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{node.icon || '📌'}</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>
                              Stage {nIdx + 1}: {node.title}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>
                              {node.shortDesc}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--green)', fontWeight: 800 }}>
                          {node.careerImpact}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        {node.skillsLearned.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: 10.5,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: 'var(--bg2)',
                              color: 'var(--t2)',
                              border: '1px solid var(--border)',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* ── TAB 2: AI RESUME & ATS GAP LOOP ───────────────────────────── */
        <div className="career-builder-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 28 }}>
          {/* Left Panel: Target Job Description Scanner */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  🎯 TARGET JOB DESCRIPTION SCANNER
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 6px', letterSpacing: '-0.3px' }}>
                  ATS Keyword & Taxonomy Gap Matcher
                </h3>
                <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0, lineHeight: 1.4 }}>
                  Match any target job description against your verified proof of work. Pinpoint critical missing competencies with zero fabricated gaps.
                </p>
              </div>

              {/* Sample Presets Quick Buttons */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>
                  QUICK PRESET ROLES:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(SAMPLE_JOB_DESCRIPTIONS).map(([key, sample]) => (
                    <button
                      key={key}
                      onClick={() => setJdText(sample.text)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        background: 'var(--bg3)',
                        color: 'var(--t2)',
                        fontSize: 11.5,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description Textarea */}
              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste target job description here..."
                rows={9}
                style={{
                  width: '100%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  color: 'var(--t1)',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  resize: 'vertical',
                  lineHeight: 1.5,
                  outline: 'none'
                }}
              />

              {/* Scan Action Button */}
              <button
                onClick={handleScanJobDescription}
                style={{
                  padding: '13px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 14.5,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                Scan Job Description with ATS Engine ➔
              </button>

              {/* ATS Diagnostic Scorecard Results */}
              {atsScore !== null && (
                <div style={{
                  padding: 18,
                  borderRadius: 14,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t2)' }}>
                        Overall ATS Match Score
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
                        Based on taxonomy heuristics and verified proofs
                      </span>
                    </div>

                    <span style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: atsScore >= 80 ? 'var(--green)' : atsScore >= 60 ? '#3b82f6' : '#f59e0b',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {atsScore}%
                    </span>
                  </div>

                  {atsAuditReport?.vendorProfiles && (
                    <div style={{
                      background: 'var(--bg2)',
                      padding: 12,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase' }}>
                        Enterprise ATS Simulation Profiles:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                        <div style={{ color: 'var(--t2)' }}>
                          Greenhouse: <strong style={{ color: 'var(--t1)' }}>{atsAuditReport.vendorProfiles.greenhouseInspired}%</strong>
                        </div>
                        <div style={{ color: 'var(--t2)' }}>
                          Workday: <strong style={{ color: 'var(--t1)' }}>{atsAuditReport.vendorProfiles.workdayInspired}%</strong>
                        </div>
                        <div style={{ color: 'var(--t2)' }}>
                          Lever: <strong style={{ color: 'var(--t1)' }}>{atsAuditReport.vendorProfiles.leverInspired}%</strong>
                        </div>
                        <div style={{ color: 'var(--t2)' }}>
                          Taleo: <strong style={{ color: 'var(--t1)' }}>{atsAuditReport.vendorProfiles.taleoInspired}%</strong>
                        </div>
                        <div style={{ color: 'var(--t2)' }}>
                          iCIMS: <strong style={{ color: 'var(--t1)' }}>{atsAuditReport.vendorProfiles.icimsInspired}%</strong>
                        </div>
                        <div style={{ color: 'var(--t2)' }}>
                          Ashby: <strong style={{ color: 'var(--t1)' }}>{atsAuditReport.vendorProfiles.ashbyInspired}%</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase' }}>
                      Detected Taxonomy & Skill Match:
                    </div>

                    {atsGaps.length > 0 ? (
                      atsGaps.map((gap, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 12.5,
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: gap.isSatisfied ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            border: `1px solid ${gap.isSatisfied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
                          }}
                        >
                          <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{gap.taxonomyTerm}</span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{
                              fontSize: 10.5,
                              textTransform: 'uppercase',
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: gap.importance === 'required' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: gap.importance === 'required' ? '#ef4444' : '#f59e0b',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 800
                            }}>
                              {gap.importance}
                            </span>
                            <span style={{
                              fontSize: 12,
                              color: gap.isSatisfied ? 'var(--green)' : '#ef4444',
                              fontWeight: 800
                            }}>
                              {gap.isSatisfied ? '✓ Verified' : '✗ Missing'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--t3)', padding: 8 }}>
                        Click &ldquo;Scan Job Description with ATS Engine&rdquo; to analyze skill alignment.
                      </div>
                    )}
                  </div>

                  {atsGaps.some(g => !g.isSatisfied) && (
                    <button
                      onClick={handleAcceptGaps}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: '1.5px solid var(--accent)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--accent)',
                        fontWeight: 900,
                        fontSize: 13.5,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        marginTop: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      ✓ Fuse Missing Skills into Active Roadmap
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Right Panel: Live ATS Resume Studio */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                borderBottom: '1px solid var(--border)',
                paddingBottom: 14
              }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: '0 0 2px' }}>
                    📄 Live ATS Resume Studio
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>
                    Auto-populated with cryptographic SHA-256 evidence records
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setResumeMode('modern_visual')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: resumeMode === 'modern_visual' ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                      background: resumeMode === 'modern_visual' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg3)',
                      color: resumeMode === 'modern_visual' ? 'var(--accent)' : 'var(--t2)',
                      fontSize: 11.5,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Proof Badges
                  </button>
                  <button
                    onClick={() => setResumeMode('ats_clean')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: resumeMode === 'ats_clean' ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                      background: resumeMode === 'ats_clean' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg3)',
                      color: resumeMode === 'ats_clean' ? 'var(--accent)' : 'var(--t2)',
                      fontSize: 11.5,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Clean ATS
                  </button>
                  <button
                    onClick={() => setResumeMode('markdown')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: resumeMode === 'markdown' ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                      background: resumeMode === 'markdown' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg3)',
                      color: resumeMode === 'markdown' ? 'var(--accent)' : 'var(--t2)',
                      fontSize: 11.5,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Markdown
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowProfileEditor(!showProfileEditor)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: showProfileEditor ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                    background: showProfileEditor ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg3)',
                    color: showProfileEditor ? 'var(--accent)' : 'var(--t1)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  ✏️ {showProfileEditor ? 'Close Profile Editor' : 'Edit Resume Details'}
                </button>

                <button
                  onClick={handleCopyPlainText}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--bg3)',
                    color: 'var(--t1)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  📋 Copy Text
                </button>

                <button
                  onClick={handlePrintResume}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--green)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  🖨️ Print / PDF
                </button>

                <button
                  onClick={handleDownloadTxt}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--bg3)',
                    color: 'var(--t1)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  📄 Download .txt
                </button>
              </div>

              {/* Inline Resume Profile Customizer Drawer */}
              {showProfileEditor && (
                <div style={{
                  background: 'var(--bg3)',
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      FULL CANDIDATE NAME
                    </label>
                    <input
                      type="text"
                      value={candidateInput.fullName}
                      onChange={e => updateCustomCandidateField('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      TARGET ROLE TITLE
                    </label>
                    <input
                      type="text"
                      value={candidateInput.targetRole}
                      onChange={e => updateCustomCandidateField('targetRole', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={candidateInput.email}
                      onChange={e => updateCustomCandidateField('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      value={candidateInput.phone}
                      onChange={e => updateCustomCandidateField('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      LOCATION / CITY
                    </label>
                    <input
                      type="text"
                      value={candidateInput.address}
                      onChange={e => updateCustomCandidateField('address', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      COLLEGE / INSTITUTION
                    </label>
                    <input
                      type="text"
                      value={candidateInput.institution}
                      onChange={e => updateCustomCandidateField('institution', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      DEGREE & SPECIALIZATION
                    </label>
                    <input
                      type="text"
                      value={candidateInput.degree}
                      onChange={e => updateCustomCandidateField('degree', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>
                      CGPA / GRADE
                    </label>
                    <input
                      type="text"
                      value={candidateInput.gpa}
                      onChange={e => updateCustomCandidateField('gpa', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              {resumeMode === 'markdown' ? (
                <pre style={{
                  background: 'var(--bg3)',
                  padding: 18,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 12.5,
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  maxHeight: 520,
                  overflowY: 'auto'
                }}>
                  {synthesizedResume.plainText}
                </pre>
              ) : resumeMode === 'ats_clean' ? (
                <div style={{
                  background: '#ffffff',
                  color: '#111827',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid #d1d5db',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  maxHeight: 520,
                  overflowY: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {candidateInput.fullName}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#4b5563', marginTop: 4 }}>
                      {candidateInput.email} | {candidateInput.phone} | {candidateInput.address}
                    </div>
                    <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>
                      {candidateInput.linkedin} | {candidateInput.github}
                    </div>
                  </div>

                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13, borderBottom: '1px solid #9ca3af', marginBottom: 6 }}>
                    Professional Summary
                  </div>
                  <p style={{ margin: '0 0 12px' }}>
                    {synthesizedResume.formData.summary}
                  </p>

                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13, borderBottom: '1px solid #9ca3af', marginBottom: 6 }}>
                    Technical Competencies
                  </div>
                  <p style={{ margin: '0 0 12px' }}>
                    {synthesizedResume.formData.skills.technical}
                  </p>

                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13, borderBottom: '1px solid #9ca3af', marginBottom: 6 }}>
                    Education
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>{candidateInput.degree}</strong> — {candidateInput.institution} ({candidateInput.graduationYear})<br />
                    <span>Grade: {candidateInput.gpa}</span>
                  </div>

                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13, borderBottom: '1px solid #9ca3af', marginBottom: 6 }}>
                    Experience & Production Projects
                  </div>
                  {synthesizedResume.formData.experiences.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: 10 }}>
                      <strong>{exp.role}</strong> &middot; {exp.company} ({exp.startDate} - {exp.endDate || 'Present'})<br />
                      <span>{exp.description}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg3)',
                  padding: 20,
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                  maxHeight: 520,
                  overflowY: 'auto'
                }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>
                      {candidateInput.fullName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>
                      Target: {candidateInput.targetRole} &middot; PinIT Verified Candidate
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                      {candidateInput.email} &middot; {candidateInput.phone} &middot; {candidateInput.address}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
                      Executive Summary:
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                      {synthesizedResume.formData.summary}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🛡️</span> VERIFIED TECHNICAL COMPETENCIES (SHA-256 VALIDATED):
                    </div>

                    {(skillProfile?.verified || []).length > 0 ? (
                      (skillProfile?.verified || []).map(v => (
                        <div key={v.id} style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>•</span>
                          <strong style={{ color: 'var(--t1)' }}>{v.name}</strong> ({v.level})
                          <span style={{ fontSize: 10.5, color: 'var(--green)', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                            Score: {Math.round(v.score)}/100 &middot; SHA-256 Validated
                          </span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--t2)' }}>
                        • <strong>{selectedTrajectory.skills.join(', ')}</strong> (Course Capstone in Progress)
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>
                      💼 Professional Experience & Residency:
                    </div>
                    {synthesizedResume.formData.experiences.map((exp, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 8 }}>
                        • <strong style={{ color: 'var(--t1)' }}>{exp.role}</strong> at {exp.company} ({exp.startDate} – {exp.endDate || 'Present'})<br />
                        &nbsp;&nbsp;<span style={{ color: 'var(--t3)' }}>{exp.description}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>
                      🎓 Academic Education:
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)' }}>
                      • <strong>{candidateInput.degree}</strong> &middot; {candidateInput.institution} ({candidateInput.graduationYear}) — GPA: {candidateInput.gpa}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          :global(.career-builder-layout-grid) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
