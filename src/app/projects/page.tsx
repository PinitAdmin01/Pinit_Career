'use client';

import { useState, useEffect } from 'react';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { toast } from '@/lib/store/useAppStore';
import { Project, GITHUB_REPO_REGEX, SWAP_POOLS, getGuideStepsForProject } from '@/lib/data/projectData';



export default function ProjectsPage() {
  const { user } = useAuth();
  const cOS = useCareerOS();

  const { completedQuests, onboardingAnswers, addXp, earnPins, setOnboarding } = cOS;

  const educationStr = String(user?.education || (onboardingAnswers as any)?.education || 'B.Tech in Computer Science');
  const degree = educationStr.split(' at ')[0] || 'B.Tech';

  const activeCourseId = onboardingAnswers?.activeCourseId || COURSES_REGISTRY[0].id;
  const activeCourse = COURSES_REGISTRY.find(c => c.id === activeCourseId) || COURSES_REGISTRY[0];
  const totalQuestsCount = activeCourse.quests?.length || 30;
  const completedCount = completedQuests ? completedQuests.length : 0;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(totalQuestsCount, 1)) * 100));

  const [bypassGate, setBypassGate] = useState<boolean>(false);
  const [bypassMentor, setBypassMentor] = useState<boolean>(false);
  const [bypassRecruiter, setBypassRecruiter] = useState<boolean>(false);

  // Hydrate bypass flags from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      setBypassGate(localStorage.getItem(`pinit_${user.id}_bypass_gate`) === 'true');
      setBypassMentor(localStorage.getItem(`pinit_${user.id}_bypass_mentor`) === 'true');
      setBypassRecruiter(localStorage.getItem(`pinit_${user.id}_bypass_recruiter`) === 'true');
    }
  }, [user?.id]);

  const toggleBypassGate = (val: boolean) => {
    setBypassGate(val);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`pinit_${user.id}_bypass_gate`, String(val));
    }
  };
  const toggleBypassMentor = (val: boolean) => {
    setBypassMentor(val);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`pinit_${user.id}_bypass_mentor`, String(val));
    }
  };
  const toggleBypassRecruiter = (val: boolean) => {
    setBypassRecruiter(val);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`pinit_${user.id}_bypass_recruiter`, String(val));
    }
  };
  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<string>(onboardingAnswers?.role || 'AI Engineer');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedGuideProject, setSelectedGuideProject] = useState<Project | null>(null);
  
  // Workspace tabs: 'overview' | 'guide' | 'reqs' | 'resources' | 'submit'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'overview' | 'guide' | 'reqs' | 'resources' | 'submit'>('overview');
  
  // Verification states
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(0);
  const [showReport, setShowReport] = useState<boolean>(false);
  
  // Submission fields
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [liveDemoUrl, setLiveDemoUrl] = useState<string>('');
  const [zipFileSelected, setZipFileSelected] = useState<boolean>(false);

  // Certificate Modal View
  const [activeCertificate, setActiveCertificate] = useState<Project | null>(null);

  const isUnlocked = progressPercent >= 90 || bypassGate;

  useEffect(() => {
    if (onboardingAnswers?.projects && onboardingAnswers.projects.length > 0) {
      setProjects(onboardingAnswers.projects);
      const active = onboardingAnswers.projects.find((p: Project) => p.status === 'In Progress' || p.status === 'Completed');
      if (active) setSelectedGuideProject(active);
    } else if (typeof window !== 'undefined' && user?.id) {
      const cached = localStorage.getItem(`pinit_${user.id}_career_projects`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setProjects(parsed);
            const active = parsed.find((p: Project) => p.status === 'In Progress' || p.status === 'Completed');
            if (active) setSelectedGuideProject(active);
          }
        } catch {
          // Ignore corrupt localStorage cache
        }
      }
    }
  }, [user?.id, onboardingAnswers?.projects]);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`pinit_${user.id}_career_projects`, JSON.stringify(updated));
    }
    // Sync to Supabase via onboardingAnswers projects property
    setOnboarding({
      ...onboardingAnswers,
      projects: updated
    });
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const goal = selectedGoal;
      let generated: Project[] = [];

      if (goal.includes('AI') || goal.toLowerCase().includes('data')) {
        generated = [
          {
            id: 'proj-1',
            name: 'AI Resume Analyzer',
            level: 'Beginner',
            description: 'Extract skills and match keywords against JDs to compute real-time ATS grades.',
            techStack: 'Python, PyPDF2, TF-IDF, Regex',
            problem: 'Simple text parsing often misses SDE skills and miscalculates ATS matching logic.',
            deliverable: 'Parse uploaded PDF resume files, scan against input job descriptions, and output score metrics.',
            xpReward: 250,
            status: 'Not Started'
          },
          {
            id: 'proj-2',
            name: 'RAG Knowledge-Base Chatbot',
            level: 'Intermediate',
            description: 'Vector-embedded PDF querying interface using LangChain and vector indexes.',
            techStack: 'React, LangChain, Pinecone, OpenAI API',
            problem: 'Standard AI models hallucinate when answering questions from proprietary PDF manuals.',
            deliverable: 'Complete web chatbot interface executing similarity search on semantic chunks.',
            xpReward: 500,
            status: 'Not Started'
          },
          {
            id: 'proj-3',
            name: 'Multi-Agent Code Reviewer Coordinator',
            level: 'Advanced',
            description: 'Decentralized AI agent loop simulating technical architect and QA developer debating code quality.',
            techStack: 'CrewAI, Python, FastAPI, Gradio',
            problem: 'Single-prompt code reviews fail to enforce complex linting and design pattern guidelines.',
            deliverable: 'Autonomous agent coordinator console returning detailed architectural reports.',
            xpReward: 750,
            status: 'Not Started'
          },
          {
            id: 'proj-4',
            name: 'Neural Network Ops Dashboard',
            level: 'Enterprise',
            description: 'High-throughput system monitoring tensor weights and GPU performance metrics during model fine-tuning.',
            techStack: 'PyTorch, Prometheus, Grafana, Docker',
            problem: 'Unmonitored long-running training loops freeze or crash without warning due to vanishing gradients.',
            deliverable: 'Dashboard rendering real-time validation curves and resource saturation stats.',
            xpReward: 1000,
            status: 'Not Started'
          },
          {
            id: 'proj-5',
            name: 'Zero-Knowledge Homomorphic Inference Engine',
            level: 'Future-Tech',
            description: 'Cryptographic inference proxy evaluating regression models directly on encrypted customer inputs.',
            techStack: 'TenSEAL, Rust, WebAssembly',
            problem: 'Cloud-hosted AI models expose sensitive patient/financial inputs during standard decryption steps.',
            deliverable: 'WASM-compiled library performing dot product additions on encrypted arrays.',
            xpReward: 1500,
            status: 'Not Started'
          }
        ];
      } else if (goal.includes('Cyber') || goal.toLowerCase().includes('security')) {
        generated = [
          {
            id: 'proj-1',
            name: 'Argon2 Authentication Portal',
            level: 'Beginner',
            description: 'Highly secure user registry hashing credentials with salt/pepper algorithms and rate limits.',
            techStack: 'Node.js, Express, Argon2, Redis',
            problem: 'Brute-force credential stuffing easily compromises default bcrypt hashes.',
            deliverable: 'Authentication API rate-limiting brute force attempts and enforcing complex password salts.',
            xpReward: 250,
            status: 'Not Started'
          },
          {
            id: 'proj-2',
            name: 'JWT Identity Provider Server',
            level: 'Intermediate',
            description: 'Custom authentication provider issuing asymmetric key-signed rotation tokens.',
            techStack: 'Jose, TypeScript, PostgreSQL',
            problem: 'Symmetric JWT key leaks compromise authorization across whole microservice fleets.',
            deliverable: 'Token issuance service supporting key rotation and real-time blacklists.',
            xpReward: 500,
            status: 'Not Started'
          },
          {
            id: 'proj-3',
            name: 'Zero-Trust Reputational Gateway',
            level: 'Advanced',
            description: 'Reverse proxy filtering requests by scanning caller IP address and authorization headers.',
            techStack: 'Nginx, Lua, Redis, Scapy',
            problem: 'WAF rules fail to identify credentialed threat actors executing low-and-slow port scans.',
            deliverable: 'API Gateway returning active blocks for clients displaying bad reputations.',
            xpReward: 750,
            status: 'Not Started'
          },
          {
            id: 'proj-4',
            name: 'Real-time Intrusion System (IDS)',
            level: 'Enterprise',
            description: 'Network packet inspector mapping flow patterns to alert administrators of anomalous traffic.',
            techStack: 'Go, Scapy, ClickHouse',
            problem: 'Standard firewalls ignore malicious activity once inside the private network boundary.',
            deliverable: 'Dashboard tracking active flows, anomalies, and triggering alerts.',
            xpReward: 1000,
            status: 'Not Started'
          },
          {
            id: 'proj-5',
            name: 'Homomorphic Cryptographic Vault',
            level: 'Future-Tech',
            description: 'Secured database vault running searches on encrypted fields without decrypting the data.',
            techStack: 'Rust, Concrete-ML, WebAssembly',
            problem: 'Decrypting databases to run search queries exposes client data to server administrators.',
            deliverable: 'WASM microservice performing arithmetic searches on encrypted numbers.',
            xpReward: 1500,
            status: 'Not Started'
          }
        ];
      } else {
        generated = [
          {
            id: 'proj-1',
            name: 'Payment Webhook Broker',
            level: 'Beginner',
            description: 'REST API validating webhook signatures and updating checkout database states.',
            techStack: 'Go, PostgreSQL, Stripe CLI',
            problem: 'Fake webhook requests can trick databases into approving orders without payment.',
            deliverable: 'API verifying cryptographic signatures and writing transaction logs.',
            xpReward: 250,
            status: 'Not Started'
          },
          {
            id: 'proj-2',
            name: 'Concurrency-Locked Inventory',
            level: 'Intermediate',
            description: 'Inventory management system database with pessimistic locking to prevent race conditions.',
            techStack: 'Go, Redis, PostgreSQL',
            problem: 'High-concurrency traffic causes double-purchasing and incorrect stock numbers.',
            deliverable: 'Inventory service with transactional locking and validation.',
            xpReward: 500,
            status: 'Not Started'
          },
          {
            id: 'proj-3',
            name: 'Event-Driven Microservices ERP',
            level: 'Advanced',
            description: 'Logistics microservices coordinating via RabbitMQ event buses with backpressure.',
            techStack: 'Spring Boot, RabbitMQ, Docker',
            problem: 'Synchronous REST calls create latency cascades when backend modules fail.',
            deliverable: 'Docker-compose fleet of event-driven messaging microservices.',
            xpReward: 750,
            status: 'Not Started'
          },
          {
            id: 'proj-4',
            name: 'CQRS Ledger Analytics Pipeline',
            level: 'Enterprise',
            description: 'Pipeline splitting ledger commands from query views using Kafka and Elasticsearch.',
            techStack: 'Kafka, Go, Elasticsearch',
            problem: 'Running analytics queries on active transactional databases locks rows and slows checkouts.',
            deliverable: 'Kafka pipeline replicating data to query databases.',
            xpReward: 1000,
            status: 'Not Started'
          },
          {
            id: 'proj-5',
            name: 'Edge CDN Cache Router',
            level: 'Future-Tech',
            description: 'Edge middleware proxy routing user sessions to the nearest database replica.',
            techStack: 'Cloudflare Workers, Rust, WASM',
            problem: 'Global users experience lag when fetching sessions from single centralized databases.',
            deliverable: 'Rust-WASM middleware script running routing calculations at the edge.',
            xpReward: 1500,
            status: 'Not Started'
          }
        ];
      }

      const enriched = generated.map(p => {
        const guides = getGuideStepsForProject(p.name, goal);
        return {
          ...p,
          guideSteps: guides.steps,
          tips: guides.tips,
          verificationReqs: guides.reqs,
          minScore: guides.minScore
        };
      });

      saveProjects(enriched);
      setSelectedGuideProject(enriched[0]);
      setGenerating(false);
      toast.success('Projects Generated! ⚡', `Created 5 customized projects for degree: ${degree} & goal: ${goal}`);
    }, 1800);
  };

  const handleStart = (id: string) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        return { ...p, status: 'In Progress' as const };
      }
      return p;
    });
    saveProjects(updated);
    const startProj = updated.find(p => p.id === id);
    if (startProj) {
      setSelectedGuideProject(startProj);
      setActiveWorkspaceTab('overview');
    }
    toast.success('Project Workspace Unlocked! 🚀', 'Guide Book and Submission portals are now active.');
  };

  const handleBypassVerify = () => {
    if (!githubUrl.trim()) {
      setGithubUrl('https://github.com/bypass/demo-repo');
    }
    setVerifying(false);
    setShowReport(true);
    toast.success('Dev Mode: Bypassed Verification checklist checks! ✅');
  };

  const handleBypassViva = () => {
    if (selectedGuideProject && user?.id) {
      const score = 91;
      const certId = `PIN-${Math.floor(10 + Math.random() * 90)}PJ-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      const dateStr = new Date().toLocaleDateString('en-GB', options);

      const updated = projects.map(p => {
        if (p.id === selectedGuideProject.id) {
          return {
            ...p,
            status: 'Completed' as const,
            githubLink: githubUrl || 'https://github.com/bypass/demo-repo',
            demoLink: liveDemoUrl || undefined,
            verificationScore: score,
            vivaPassed: true,
            certificateType: 'excellence' as const,
            certificateId: certId,
            issueDate: dateStr
          };
        }
        return p;
      });
      saveProjects(updated);
      const updatedProj = updated.find(p => p.id === selectedGuideProject.id);
      if (updatedProj) setSelectedGuideProject(updatedProj);
      
      addXp(1200, `Bypassed Viva for Project: ${selectedGuideProject.name}`);
      earnPins('vault_verify', 25, `Bypassed Viva for Project: ${selectedGuideProject.name}`);
      
      setShowReport(false);
      toast.success('Dev Mode: Bypassed Viva with Excellence Certificate! 🏆');
    }
  };

  const handleVerifyProject = () => {
    if (!githubUrl.trim()) {
      toast.error('Verification Error', 'GitHub repository URL is required.');
      return;
    }

    if (!GITHUB_REPO_REGEX.test(githubUrl.trim())) {
      toast.error('Invalid Repository URL', 'Please enter a valid GitHub repository URL (e.g. https://github.com/username/repository).');
      return;
    }

    setVerifying(true);
    setVerificationStep(0);
    setShowReport(false);

    const verifyIntervalRef = { current: null as ReturnType<typeof setInterval> | null };
    const interval = setInterval(() => {
      setVerificationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          verifyIntervalRef.current = null;
          setTimeout(() => {
            setVerifying(false);
            setShowReport(true);
            toast.success('AI Verification Complete! ✅', 'Your project has passed dynamic validations with score: 91%');
          }, 600);
          return 5;
        }
        return prev + 1;
      });
    }, 800);
    verifyIntervalRef.current = interval;
  };

  const handleIssueStandardCertificate = () => {
    if (selectedGuideProject && user?.id) {
      const score = 91;
      // Generate dynamic Certificate ID and date
      const certId = `PIN-${Math.floor(10 + Math.random() * 90)}PJ-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      const dateStr = new Date().toLocaleDateString('en-GB', options); // e.g. "18 May 2025" or current local

      const updated = projects.map(p => {
        if (p.id === selectedGuideProject.id) {
          return {
            ...p,
            status: 'Completed' as const,
            githubLink: githubUrl,
            demoLink: liveDemoUrl || undefined,
            verificationScore: score,
            certificateType: 'standard' as const,
            certificateId: certId,
            issueDate: dateStr
          };
        }
        return p;
      });
      saveProjects(updated);
      const updatedProj = updated.find(p => p.id === selectedGuideProject.id);
      if (updatedProj) setSelectedGuideProject(updatedProj);
      
      // Perform automated synchronization updates
      addXp(1000, `Completed Project: ${selectedGuideProject.name}`);
      earnPins('vault_verify', 20, `Completed Project: ${selectedGuideProject.name}`);
      
      setShowReport(false);
      toast.success('Project Completed! 🏅', 'Issued standard AI Verified Project Certificate and synchronized DNA profile.');
    }
  };

  const handleChangeProject = (id: string, level: string) => {
    const goal = selectedGoal;
    const pool = SWAP_POOLS[goal]?.[level];
    if (!pool) {
      toast.error('Change Project Failed', 'No alternative templates available.');
      return;
    }

    const updated = projects.map(p => {
      if (p.id === id) {
        const isSwapped = p.name === pool.name;
        const baselineNameMap: Record<string, string> = goal.includes('AI')
          ? { 'Beginner': 'AI Resume Analyzer', 'Intermediate': 'RAG Knowledge-Base Chatbot', 'Advanced': 'Multi-Agent Code Reviewer Coordinator', 'Enterprise': 'Neural Network Ops Dashboard', 'Future-Tech': 'Zero-Knowledge Homomorphic Inference Engine' }
          : goal.includes('Cyber')
            ? { 'Beginner': 'Argon2 Authentication Portal', 'Intermediate': 'JWT Identity Provider Server', 'Advanced': 'Zero-Trust Reputational Gateway', 'Enterprise': 'Real-time Intrusion System (IDS)', 'Future-Tech': 'Homomorphic Cryptographic Vault' }
            : { 'Beginner': 'Payment Webhook Broker', 'Intermediate': 'Concurrency-Locked Inventory', 'Advanced': 'Event-Driven Microservices ERP', 'Enterprise': 'CQRS Ledger Analytics Pipeline', 'Future-Tech': 'Edge CDN Cache Router' };

        const baselineName = baselineNameMap[level] || 'Baseline Project';
        const targetName = isSwapped ? baselineName : pool.name;
        const targetDesc = isSwapped 
          ? ({ 'AI Resume Analyzer': 'Extract skills and match keywords against JDs to compute real-time ATS grades.', 'RAG Knowledge-Base Chatbot': 'Vector-embedded PDF querying interface using LangChain and vector indexes.', 'Multi-Agent Code Reviewer Coordinator': 'Decentralized AI agent loop simulating technical architect and QA developer debating code quality.', 'Neural Network Ops Dashboard': 'High-throughput system monitoring tensor weights and GPU performance metrics during model fine-tuning.', 'Zero-Knowledge Homomorphic Inference Engine': 'Cryptographic inference proxy evaluating regression models directly on encrypted customer inputs.' }[targetName] || pool.description)
          : pool.description;

        const targetTech = isSwapped ? 'Python, PyPDF2, TF-IDF' : pool.techStack;
        const targetProblem = isSwapped ? 'Default problem' : pool.problem;
        const targetDeliv = isSwapped ? 'Default requirements' : pool.deliverable;

        const guides = getGuideStepsForProject(targetName || '', goal);

        return {
          ...p,
          name: targetName || 'Alternative Project',
          description: targetDesc || 'Alternative project description',
          techStack: targetTech || 'General stack',
          problem: targetProblem || 'General problem',
          deliverable: targetDeliv || 'General deliverable',
          status: 'Not Started' as const,
          githubLink: undefined,
          demoLink: undefined,
          vivaPassed: false,
          certificateType: undefined,
          certificateId: undefined,
          issueDate: undefined,
          verificationScore: undefined,
          guideSteps: guides.steps,
          tips: guides.tips,
          verificationReqs: guides.reqs,
          minScore: guides.minScore
        };
      }
      return p;
    });

    saveProjects(updated);
    const swapped = updated.find(p => p.id === id);
    if (swapped) {
      setSelectedGuideProject(swapped);
      setActiveWorkspaceTab('overview');
    }
    toast.success('Template Swapped! 🔄', 'Successfully changed project template.');
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 20px 80px' }} className="fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'var(--t1)' }}>🚀 AI Projects Workspace</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t3)' }}>
            Build, test, verify, and pass Project Vivas to unlock Verified Excellence Certifications.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => toggleBypassGate(!bypassGate)}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
              background: bypassGate ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              color: bypassGate ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${bypassGate ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              cursor: 'pointer'
            }}
          >
            ⚙️ Bypass Gate: {bypassGate ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => {
              const nextVal = !bypassMentor;
              toggleBypassMentor(nextVal);
              toast.success(`Mentor Verify Bypass: ${nextVal ? 'ENABLED 👨‍🏫' : 'DISABLED'}`);
            }}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
              background: bypassMentor ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
              color: bypassMentor ? 'var(--success)' : 'var(--t3)',
              border: `1px solid ${bypassMentor ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              cursor: 'pointer'
            }}
          >
            👨‍🏫 Mentor Bypass: {bypassMentor ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              const nextVal = !bypassRecruiter;
              toggleBypassRecruiter(nextVal);
              toast.success(`Recruiter Endorsement Bypass: ${nextVal ? 'ENABLED 💼' : 'DISABLED'}`);
            }}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
              background: bypassRecruiter ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
              color: bypassRecruiter ? 'var(--success)' : 'var(--t3)',
              border: `1px solid ${bypassRecruiter ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              cursor: 'pointer'
            }}
          >
            💼 Recruiter Bypass: {bypassRecruiter ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Lock Screen */}
      {!isUnlocked ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1.5px dashed var(--border)',
          borderRadius: 20, padding: '60px 24px', textAlign: 'center', margin: '40px auto', maxWidth: 640
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>Projects Workspace Locked</h2>
          <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>
            To ensure foundational skills are solid before building, the Projects tab unlocks after completing **90%** of your active course quests.
          </p>

          <div style={{ maxWidth: 400, margin: '0 auto 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: 'var(--t2)', marginBottom: 6 }}>
              <span>{activeCourse.title} Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--accent), var(--purple))', transition: 'width 0.5s' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--t3)' }}>
              {completedCount} of {totalQuestsCount} quests completed.
            </div>
          </div>
        </div>
      ) : (
        /* Workspace interface */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* AI Generator Control */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>⚡ AI Dynamic Portfolio Generator</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
                Constructs 5 real-world projects utilizing target parameters: `projects = quests + academic degree + DNA score + career goal`.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Academic Course / Degree</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginTop: 4 }}>{degree}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Quests Completed</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginTop: 4 }}>{completedCount} Quests</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Overall DNA Score</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>{Math.min(95, 60 + (completedCount * 1.5))}/100</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Target Career Goal</span>
                <select
                  value={selectedGoal}
                  onChange={e => setSelectedGoal(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: 12, padding: '6px 8px', marginTop: 4 }}
                >
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Cybersecurity Engineer">Cybersecurity Engineer</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary"
              style={{ padding: '12px 0', fontSize: 13, fontWeight: 800, justifyContent: 'center', marginTop: 8 }}
            >
              {generating ? '🧬 Simulating Career Optimization Formula...' : '⚡ Generate My Personalised Career Projects'}
            </button>
          </div>

          {/* Project Workspace Content Layout */}
          {projects.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: 20, alignItems: 'start' }}>
              
              {/* Left Column: Projects lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {projects.map((p) => {
                  const isActiveGuide = selectedGuideProject?.id === p.id;
                  const borderColors = {
                    'Beginner': 'var(--teal)',
                    'Intermediate': 'var(--blue)',
                    'Advanced': 'var(--purple)',
                    'Enterprise': 'var(--amber)',
                    'Future-Tech': 'var(--coral)'
                  };
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedGuideProject(p)}
                      style={{
                        background: 'var(--card)', border: `1px solid ${isActiveGuide ? 'var(--accent)' : 'var(--border)'}`,
                        borderLeft: `4px solid ${borderColors[p.level]}`, borderRadius: 14, padding: 16,
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
                        boxShadow: isActiveGuide ? '0 0 10px rgba(99,102,241,0.08)' : 'none',
                        transition: 'border 0.2s, box-shadow 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 9, background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, fontWeight: 800, color: borderColors[p.level] }}>
                            {p.level}
                          </span>
                          <strong style={{ fontSize: 14, color: 'var(--t1)' }}>{p.name}</strong>
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--t3)' }}>+{p.xpReward} XP</span>
                      </div>

                      <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{p.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--t3)' }}>⚙️ {p.techStack}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          
                          {p.status === 'Not Started' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeProject(p.id, p.level);
                              }}
                              style={{
                                padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                                color: 'var(--t2)', cursor: 'pointer'
                              }}
                            >
                              🔄 Swap
                            </button>
                          )}

                          {p.status === 'Not Started' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStart(p.id);
                              }}
                              className="btn-primary"
                              style={{ padding: '4px 10px', fontSize: 10, borderRadius: 6 }}
                            >
                              🚀 Start Project
                            </button>
                          )}
                          {p.status === 'In Progress' && (
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)' }}>⚡ In Progress</span>
                          )}
                          {p.status === 'Completed' && (
                            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--success)' }}>
                              {p.vivaPassed ? '🏆 Verified Excellence' : '🏅 AI Verified'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Interactive Workspace Panel */}
              {selectedGuideProject && (
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
                  padding: 20, display: 'flex', flexDirection: 'column', gap: 16
                }}>
                  
                  {/* Top Info & Action Panel */}
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>{selectedGuideProject.name}</h2>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>Workspace Level: <strong>{selectedGuideProject.level}</strong></span>
                    </div>

                    {selectedGuideProject.status === 'Not Started' ? (
                      <button
                        onClick={() => handleStart(selectedGuideProject.id)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: 12 }}
                      >
                        🚀 Open Workspace
                      </button>
                    ) : (
                      /* Active Workspace Tab headers */
                      <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 8 }}>
                        {(['overview', 'guide', 'reqs', 'resources', 'submit'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveWorkspaceTab(tab)}
                            style={{
                              padding: '6px 10px', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 800,
                              background: activeWorkspaceTab === tab ? 'var(--card)' : 'transparent',
                              color: activeWorkspaceTab === tab ? 'var(--accent)' : 'var(--t3)',
                              cursor: 'pointer'
                            }}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tab Body views */}
                  {selectedGuideProject.status !== 'Not Started' && (
                    <div style={{ minHeight: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      
                      {/* Overview Tab */}
                      {activeWorkspaceTab === 'overview' && (
                        <>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>🎯 Project Overview:</strong>
                            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.description}</p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>⚠️ Real-World Problem:</strong>
                            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.problem}</p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>📦 Required Outcome:</strong>
                            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{selectedGuideProject.deliverable}</p>
                          </div>
                        </>
                      )}

                      {/* Guide Book Tab */}
                      {activeWorkspaceTab === 'guide' && (
                        <>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>🛠️ Step-by-Step Implementation Guide:</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(selectedGuideProject.guideSteps || []).map((step, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'start' }}>
                                  <span style={{
                                    width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-light)',
                                    color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 10, fontWeight: 900, flexShrink: 0, marginTop: 1
                                  }}>
                                    {idx + 1}
                                  </span>
                                  <span style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {selectedGuideProject.tips && (
                            <div style={{ padding: 12, background: 'rgba(99,102,241,0.02)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10 }}>
                              <strong style={{ fontSize: 11.5, color: 'var(--accent)', display: 'block', marginBottom: 4 }}>💡 Developer Tips & Gotchas:</strong>
                              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--t3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {selectedGuideProject.tips.map((t, idx) => <li key={idx}>{t}</li>)}
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {/* Verification Requirements Tab */}
                      {activeWorkspaceTab === 'reqs' && (
                        <>
                          <div>
                            <strong style={{ fontSize: 12, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>✅ AI Verification Requirements Checklist:</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(selectedGuideProject.verificationReqs || ['API endpoints validation', 'Database mappings', 'Documentation README']).map((req, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5, color: 'var(--t2)' }}>
                                  <span style={{ color: 'var(--success)' }}>✓</span>
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Minimum Pass Threshold:</span>
                            <strong style={{ fontSize: 13, color: 'var(--danger)' }}>{selectedGuideProject.minScore || 80}% AI Score</strong>
                          </div>
                        </>
                      )}

                      {/* Resources Tab */}
                      {activeWorkspaceTab === 'resources' && (
                        <>
                          <strong style={{ fontSize: 12, color: 'var(--t2)' }}>📚 Reference Links & SDKs:</strong>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ padding: 10, background: 'var(--bg3)', borderRadius: 8, fontSize: 12 }}>
                              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>GitHub Developer documentation 🔗</a>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--t3)', fontSize: 11 }}>Setup SSH keys and configure action workflows.</p>
                            </div>
                            <div style={{ padding: 10, background: 'var(--bg3)', borderRadius: 8, fontSize: 12 }}>
                              <a href="https://qdrant.tech" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Vector Indexing with Qdrant Vector database 🔗</a>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--t3)', fontSize: 11 }}>Configure Cosine and Euclidean distance parameters.</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Submission Tab */}
                      {activeWorkspaceTab === 'submit' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div>
                            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>GitHub Repository URL *</label>
                            <input
                              type="text"
                              value={githubUrl}
                              onChange={e => setGithubUrl(e.target.value)}
                              className="form-input"
                              placeholder="https://github.com/username/project-repo"
                              style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Live Demo Link (Optional)</label>
                            <input
                              type="text"
                              value={liveDemoUrl}
                              onChange={e => setLiveDemoUrl(e.target.value)}
                              className="form-input"
                              placeholder="https://myprojectdemo.vercel.app"
                              style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>ZIP Upload Backup (Optional)</span>
                            <button
                              onClick={() => setZipFileSelected(prev => !prev)}
                              style={{
                                padding: '4px 10px', fontSize: 10, borderRadius: 6, cursor: 'pointer',
                                background: zipFileSelected ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.05)',
                                color: zipFileSelected ? 'var(--success)' : 'var(--t2)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              {zipFileSelected ? '✓ File Attached' : 'Attach ZIP'}
                            </button>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--success)', background: 'rgba(16,185,129,0.04)', padding: 8, borderRadius: 6 }}>
                            <span>✓</span>
                            <span>Auto-detected: <strong>README.md</strong> file exists in repository root directory.</span>
                          </div>

                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button
                              onClick={handleVerifyProject}
                              disabled={verifying}
                              className="btn-primary"
                              style={{ flex: 1.5, padding: '12px 0', fontSize: 13, fontWeight: 800, justifyContent: 'center' }}
                            >
                              {verifying ? '🤖 Connecting to Verification Pipeline...' : 'Submit and Verify Project'}
                            </button>
                            <button
                              onClick={handleBypassVerify}
                              className="btn-ghost"
                              style={{ flex: 1, padding: '12px 0', fontSize: 11, fontWeight: 800, color: 'var(--amber)', border: '1px dashed var(--amber)', justifyContent: 'center' }}
                            >
                              ⚡ Dev Bypass Verification
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* View Certificate Action trigger */}
                  {selectedGuideProject.status === 'Completed' && (
                    <div style={{
                      marginTop: 10, border: '1px solid var(--border)', borderRadius: 14, padding: 18,
                      background: 'var(--bg3)',
                      textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12
                    }}>
                      <div style={{ fontSize: 28 }}>🏅</div>
                      <div>
                        <strong style={{ fontSize: 14, color: 'var(--t1)', display: 'block' }}>
                          {selectedGuideProject.vivaPassed ? '🏆 AI Verified Excellence Certificate' : '🏅 AI Verified Project Certificate'}
                        </strong>
                        <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                          Status: <strong>VERIFIED ({selectedGuideProject.verificationScore || 91}%)</strong>
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveCertificate(selectedGuideProject)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: 12, justifyContent: 'center' }}
                      >
                        🎓 View Certificate
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* AI Verification Loader Overlay */}
      {verifying && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 440, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 15, color: 'var(--t1)' }}>🤖 AI Project Verification</strong>
              <div style={{ fontSize: 12, color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }}>⬡</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Checking Repository...',
                'Checking Project Structure...',
                'Checking Features...',
                'Checking Documentation...',
                'Generating Report...'
              ].map((step, idx) => {
                const isPassed = verificationStep > idx;
                const isActive = verificationStep === idx;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: isPassed ? 'var(--success)' : isActive ? 'var(--t1)' : 'var(--t4)' }}>
                    <span>{step}</span>
                    <span>{isPassed ? '✅' : isActive ? '⚡' : '⏳'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Verification Report Overlay */}
      {showReport && selectedGuideProject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 480, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>🤖 AI Verification Report</h3>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Project: {selectedGuideProject.name}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Project Structure</span>
                <strong style={{ color: 'var(--success)' }}>✅ Excellent</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Features Audit</span>
                <strong style={{ color: 'var(--success)' }}>✅ Complete</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Documentation</span>
                <strong style={{ color: 'var(--success)' }}>✅ Good</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--t2)' }}>Code Quality</span>
                <strong style={{ color: 'var(--success)' }}>✅ Very Good</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: 6 }}>
                <strong>Overall AI Score</strong>
                <strong style={{ color: 'var(--accent)', fontSize: 16 }}>91%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--success)', background: 'rgba(16,185,129,0.06)', padding: 8, borderRadius: 6, marginTop: 4 }}>
                <span>Status:</span>
                <strong>VERIFIED</strong>
              </div>
            </div>

            {/* Optional AI Viva Prompt */}
            <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--t1)' }}>Earn AI Excellence Badge? 🏆</strong>
              <p style={{ margin: '4px 0 10px 0', color: 'var(--t3)' }}>
                Take a 3-Minute **Project Viva** interview to test your deployment choices and upgrade your credentials to an **Excellence Certificate**.
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <a
                  href={`/interview?mode=project_viva&project=${encodeURIComponent(selectedGuideProject.name)}&projectId=${selectedGuideProject.id}&course=${encodeURIComponent(activeCourse.title)}&repo=${encodeURIComponent(githubUrl)}&score=91`}
                  className="btn-primary"
                  style={{ textDecoration: 'none', fontSize: 11, padding: '6px 12px' }}
                >
                  🎙️ Start AI Viva
                </a>
                <button
                  onClick={handleIssueStandardCertificate}
                  className="btn-ghost"
                  style={{ border: '1px solid var(--border)', fontSize: 11, padding: '6px 12px' }}
                >
                  Skip & Issue Standard
                </button>
                <button
                  onClick={handleBypassViva}
                  className="btn-ghost"
                  style={{ fontSize: 11, padding: '6px 12px', color: 'var(--amber)', border: '1px dashed var(--amber)' }}
                >
                  🏆 Dev Bypass Viva
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Certificate Modal (Mirroring the gold/navy design image) */}
      {activeCertificate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
          background: 'rgba(5, 8, 22, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            position: 'relative', width: '100%', maxWidth: 840, background: '#060B19',
            border: '8px solid #0d162f', borderRadius: 18, color: '#fff', overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(129,140,248,0.1)'
          }}>
            
            {/* Close Button */}
            <button
              onClick={() => setActiveCertificate(null)}
              style={{
                position: 'absolute', top: 20, right: 20, zIndex: 100,
                background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16
              }}
            >
              ✕
            </button>

            {/* Certificate Outer Border Layout Frame */}
            <div style={{
              padding: '40px 48px', border: '2px solid #8e701d', margin: 10, borderRadius: 12,
              position: 'relative', background: 'radial-gradient(circle at center, #0B1226 0%, #060B19 100%)'
            }}>
              
              {/* Corner Gold Triangles decorations */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '4px solid #D4AF37', borderLeft: '4px solid #D4AF37' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: '4px solid #D4AF37', borderRight: '4px solid #D4AF37' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: '4px solid #D4AF37', borderLeft: '4px solid #D4AF37' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '4px solid #D4AF37', borderRight: '4px solid #D4AF37' }} />

              {/* Left sidebar info details */}
              <div style={{
                position: 'absolute', left: 40, top: 120, bottom: 120, width: 140,
                borderRight: '1px solid rgba(142, 112, 29, 0.4)', paddingRight: 16,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 5
              }}>
                <div>
                  <span style={{ fontSize: 9, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Date</span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 4 }}>{activeCertificate.issueDate || '18 May 2025'}</div>
                </div>
                
                <div>
                  <span style={{ fontSize: 9, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Project Level</span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 4 }}>{activeCertificate.level}</div>
                </div>

                <div>
                  <span style={{ fontSize: 9, color: '#8e701d', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Verification Score</span>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#D4AF37', marginTop: 4 }}>{activeCertificate.verificationScore || 91}%</div>
                </div>
              </div>

              {/* Right embossed gold stamp */}
              <div style={{
                position: 'absolute', right: 40, bottom: 80, width: 100, height: 100,
                borderRadius: '50%', background: 'radial-gradient(circle, #f3e5ab 0%, #D4AF37 70%, #aa7c11 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', zIndex: 10, border: '4px double #8e701d'
              }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#4a3306', textTransform: 'uppercase' }}>PinIT</span>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <span style={{ fontSize: 7, fontWeight: 800, color: '#4a3306', textTransform: 'uppercase', letterSpacing: 0.5 }}>Verified</span>
              </div>

              {/* Main Content Pane */}
              <div style={{ paddingLeft: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, color: '#3b82f6' }}>⬡</span>
                  <strong style={{ fontSize: 13, letterSpacing: 1.5, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    PinIT <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 400 }}>AI CAREER OS</span>
                  </strong>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '2px', margin: '10px 0 2px 0', textTransform: 'uppercase' }}>
                  Certificate
                </h2>
                <div style={{ fontSize: 10, color: '#8e701d', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
                  of Project Achievement
                </div>

                <div style={{ fontSize: 10.5, color: '#94a3b8', fontStyle: 'italic', marginBottom: 4, letterSpacing: '0.5px' }}>
                  PROUDLY PRESENTED TO
                </div>

                <h1 style={{
                  fontFamily: 'Georgia, serif', fontSize: 40, fontStyle: 'italic', color: '#D4AF37',
                  margin: '4px 0 12px 0', letterSpacing: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {user?.displayName || (onboardingAnswers as any)?.displayName || 'Arjun Sharma'}
                </h1>

                <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 12px 0' }}>
                  for successfully completing and getting
                </p>

                {/* Badge ribbon with Laurel branch wreaths */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ color: '#D4AF37', fontSize: 14 }}>🌿</span>
                  <strong style={{ fontSize: 12, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    {activeCertificate.vivaPassed ? 'AI EXCELLENCE' : 'AI VERIFIED'}
                  </strong>
                  <span style={{ color: '#D4AF37', fontSize: 14 }}>🌿</span>
                </div>

                <div style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px 0' }}>
                  for the project
                </div>

                {/* Project Details Box with Brain icon */}
                <div style={{
                  background: 'linear-gradient(90deg, #091128, #0e1b38)', border: '1px solid #8e701d', borderRadius: 8,
                  padding: '8px 24px', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', marginBottom: 20
                }}>
                  <span style={{ fontSize: 14 }}>🧠</span>
                  <span>{activeCertificate.name}</span>
                </div>

                <div style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                  <span>🚀</span>
                  <span>Real Project. Verified by AI. Built for Your Future.</span>
                </div>

                {/* Footer Signing details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, marginTop: 10 }}>
                  <div style={{ textAlign: 'left', fontSize: 9 }}>
                    <div style={{ color: '#94a3b8', fontSize: 8 }}>SCAN TO VERIFY</div>
                    <div style={{ color: '#D4AF37', marginTop: 2, fontWeight: 700 }}>pinIt.in/verify</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ textAlign: 'center', width: 130 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>Rohit Sharma</div>
                      <div style={{ height: 1, background: '#8e701d', margin: '4px 0' }} />
                      <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Rohit Sharma</div>
                      <div style={{ fontSize: 7, color: '#8e701d', textTransform: 'uppercase' }}>Co-founder & CTO</div>
                    </div>

                    {(bypassMentor || activeCertificate.vivaPassed) && (
                      <div style={{ textAlign: 'center', width: 130 }}>
                        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#D4AF37' }}>Prof. Rajesh Kumar</div>
                        <div style={{ height: 1, background: '#8e701d', margin: '4px 0' }} />
                        <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Mentor Co-signed</div>
                        <div style={{ fontSize: 7, color: '#8e701d', textTransform: 'uppercase' }}>University Lead</div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', fontSize: 9 }}>
                    <div style={{ color: '#94a3b8', fontSize: 8 }}>CERTIFICATE ID</div>
                    <div style={{ color: '#94a3b8', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{activeCertificate.certificateId || 'PIN-25PJ-7X2Q-09191'}</div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
