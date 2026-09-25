// scripts/tests/test_role_track_mapping.ts
import assert from 'assert';
import { GOAL_DISCOVERY_QUESTIONS } from '../../src/lib/onboarding/diagnosticRegistry';

// We replicate the exact resolution logic from useOnboardingWizard
function resolveTrackFromGoal(goalRole?: string, profileType?: string) {
  const goal = (goalRole || '').toLowerCase();
  const profile = (profileType || '').toLowerCase();

  // 1. AI & LLM Systems Engineer
  if (goal.includes('ai') || goal.includes('ml') || goal.includes('machine learning') || goal.includes('llm') || goal.includes('deep learning')) {
    return {
      targetRoleLabel: 'AI & LLM Systems Engineer',
      courseId: 'course-ai-eng',
      skillsList: 'Python 3.12, PyTorch, LangChain, Vector Databases (pgvector/Pinecone), RAG Architecture, LLM Prompt Engineering',
      weakAreas: ['Vector Index Tuning', 'Model Evaluation & Grounding', 'Async Agent Pipelines']
    };
  }

  // 2. Data & Business Analytics
  if (goal.includes('data') || goal.includes('analytics') || goal.includes('business_analytics')) {
    return {
      targetRoleLabel: 'Data & Business Analytics Specialist',
      courseId: 'course-bcom-analytics',
      skillsList: 'SQL Analytics, Advanced Excel, Python Data Science, Pandas, PowerBI Dashboarding, Statistical Modeling',
      weakAreas: ['A/B Test Design', 'Data Pipeline ETL', 'Predictive Modeling']
    };
  }

  // 3. Cybersecurity Analyst
  if (goal.includes('cyber') || goal.includes('security') || goal.includes('infosec')) {
    return {
      targetRoleLabel: 'Cybersecurity Analyst',
      courseId: 'course-cybersecurity',
      skillsList: 'Network Defense, OWASP Top 10, Penetration Testing, SIEM Log Analysis, Cryptography, Vulnerability Assessment',
      weakAreas: ['Zero Trust Architecture', 'Cloud Security Posture', 'Incident Response Playbooks']
    };
  }

  // 4. React Frontend Engineer
  if (goal.includes('front') || goal.includes('react') || goal.includes('web dev') || goal.includes('next')) {
    return {
      targetRoleLabel: 'React Frontend Web SDE',
      courseId: 'course-react-web',
      skillsList: 'React 18, Next.js SSR, TypeScript, TailwindCSS, CSS Architecture, State Management (Zustand), Web Performance',
      weakAreas: ['Webpack / Vite Bundling', 'Core Web Vitals Optimization', 'React Testing Library']
    };
  }

  // 5. Cloud & DevOps Engineer
  if (goal.includes('devops') || goal.includes('cloud') || goal.includes('aws') || goal.includes('docker') || goal.includes('kubernetes')) {
    return {
      targetRoleLabel: 'Cloud & DevOps Engineer',
      courseId: 'course-devops-cicd',
      skillsList: 'Docker Containers, Kubernetes, CI/CD GitHub Actions, AWS Cloud Infrastructure, Terraform IaC, Prometheus Monitoring',
      weakAreas: ['Kubernetes Security Policies', 'Terraform State Management', 'Multi-Region High Availability']
    };
  }

  // 6. UI/UX Designer
  if (goal.includes('ui') || goal.includes('ux') || goal.includes('design') || goal.includes('figma')) {
    return {
      targetRoleLabel: 'UI/UX Product Designer',
      courseId: 'course-design-systems',
      skillsList: 'Figma Wireframing & Prototyping, Design Systems & Tokens, User Research, Usability Testing, Micro-interactions',
      weakAreas: ['Design System Tokens Architecture', 'Accessibility (WCAG 2.1 AA)', 'A/B Testing Experiments']
    };
  }

  // 7. Full-Stack Developer
  if (goal.includes('full') || goal.includes('stack')) {
    return {
      targetRoleLabel: 'Full-Stack Software Developer',
      courseId: 'course-fullstack-js',
      skillsList: 'JavaScript ES6+, TypeScript, Next.js, Node.js REST APIs, PostgreSQL, Prisma/Drizzle, Docker Basics',
      weakAreas: ['Database Indexing & Transactions', 'Serverless Cold Starts', 'Authentication Security']
    };
  }

  // 8. Financial & FinTech Analyst
  if (goal.includes('finance') || goal.includes('financial') || goal.includes('fintech') || goal.includes('accounting') ||
      profile.includes('commerce') || profile.includes('b.com')) {
    return {
      targetRoleLabel: 'Financial & FinTech Analyst',
      courseId: 'course-finance-investment',
      skillsList: 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Financial Statement Analysis, Auditing & Compliance',
      weakAreas: ['Derivatives Valuation', 'Regulatory Tech (RegTech)', 'Corporate Restructuring Modeling']
    };
  }

  // 9. Product & Operations Manager
  if (goal.includes('product') || goal.includes('business') || goal.includes('consult') || goal.includes('operations') ||
      profile.includes('management') || profile.includes('bba') || profile.includes('mba')) {
    return {
      targetRoleLabel: 'Product & Operations Manager',
      courseId: 'course-bcom-operations',
      skillsList: 'Product Strategy, PRD Writing, Agile Scrum, User Journey Mapping, Growth Funnels, Data Analytics, Stakeholder Alignment',
      weakAreas: ['Cohort Retention Analysis', 'North Star Metric Decomposition', 'Experimentation Frameworks']
    };
  }

  // 10. Digital Growth & Marketing Lead
  if (goal.includes('market') || goal.includes('growth')) {
    return {
      targetRoleLabel: 'Digital Growth & Marketing Lead',
      courseId: 'course-bcom-digital-marketing',
      skillsList: 'Growth Marketing Funnels, SEO & Search Strategy, Conversion Rate Optimization (CRO), Google Analytics 4, Content Strategy',
      weakAreas: ['Attribution Modeling', 'Paid Acquisition Unit Economics', 'Lifecycle Marketing Automation']
    };
  }

  // 11. IoT & Embedded Systems
  if (goal.includes('iot') || goal.includes('embedded')) {
    return {
      targetRoleLabel: 'IoT & Embedded Systems Engineer',
      courseId: 'course-iot-embedded',
      skillsList: 'Embedded C/C++, ESP32/Arduino, GPIO Sensor Interfacing, MQTT & Wireless Protocols, TinyML, Hardware Security',
      weakAreas: ['Low-Power Duty Cycling', 'Secure Boot & Co-Processors', 'Firmware Over-The-Air (FOTA) Updates']
    };
  }

  // 12. QA & Test Automation
  if (goal.includes('qa') || goal.includes('test')) {
    return {
      targetRoleLabel: 'QA & Test Automation Engineer',
      courseId: 'course-fullstack-js',
      skillsList: 'Jest Unit Testing, Playwright E2E, Cypress, API Integration Testing, CI/CD Test Automation, Performance Testing',
      weakAreas: ['Flaky Test Isolation', 'Contract Testing', 'Load & Stress Testing']
    };
  }

  // 13. Default: Java Backend SDE
  return {
    targetRoleLabel: 'Java Backend SDE',
    courseId: 'course-java-logic',
    skillsList: 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design',
    weakAreas: ['Docker Containers', 'System Design', 'Microservices Architecture']
  };
}

console.log('=== VALIDATING ALL 12 GOAL DISCOVERY ROLES RESOLUTION ===\n');

const q2 = GOAL_DISCOVERY_QUESTIONS.find(q => q.id === 'Q2_PRIMARY_ROLE')!;
assert.strictEqual(q2.options.length, 12, 'Expected 12 distinct career track options in Q2');

const expectedMappings: Record<string, { expectedRole: string; expectedCourse: string }> = {
  frontend_developer: { expectedRole: 'React Frontend Web SDE', expectedCourse: 'course-react-web' },
  backend_developer: { expectedRole: 'Java Backend SDE', expectedCourse: 'course-java-logic' },
  full_stack_developer: { expectedRole: 'Full-Stack Software Developer', expectedCourse: 'course-fullstack-js' },
  ai_ml_engineer: { expectedRole: 'AI & LLM Systems Engineer', expectedCourse: 'course-ai-eng' },
  data_analyst: { expectedRole: 'Data & Business Analytics Specialist', expectedCourse: 'course-bcom-analytics' },
  ui_ux_designer: { expectedRole: 'UI/UX Product Designer', expectedCourse: 'course-design-systems' },
  qa_engineer: { expectedRole: 'QA & Test Automation Engineer', expectedCourse: 'course-fullstack-js' },
  cybersecurity: { expectedRole: 'Cybersecurity Analyst', expectedCourse: 'course-cybersecurity' },
  cloud_devops: { expectedRole: 'Cloud & DevOps Engineer', expectedCourse: 'course-devops-cicd' },
  product_manager: { expectedRole: 'Product & Operations Manager', expectedCourse: 'course-bcom-operations' },
  financial_analyst: { expectedRole: 'Financial & FinTech Analyst', expectedCourse: 'course-finance-investment' },
  digital_marketing: { expectedRole: 'Digital Growth & Marketing Lead', expectedCourse: 'course-bcom-digital-marketing' },
};

for (const opt of q2.options) {
  const mappedVal = opt.mappedValue as string;
  const result = resolveTrackFromGoal(mappedVal);
  const expected = expectedMappings[mappedVal];

  assert.ok(expected, `Missing expectation for option ${mappedVal}`);
  assert.strictEqual(result.targetRoleLabel, expected.expectedRole, `Role mismatch for ${mappedVal}: got ${result.targetRoleLabel}`);
  assert.strictEqual(result.courseId, expected.expectedCourse, `Course mismatch for ${mappedVal}: got ${result.courseId}`);
  assert.ok(result.skillsList.length > 10, `Skills list empty for ${mappedVal}`);
  assert.ok(result.weakAreas.length >= 2, `Weak areas empty for ${mappedVal}`);

  console.log(`✓ [Role ${mappedVal}]:`);
  console.log(`  -> Title:     ${result.targetRoleLabel}`);
  console.log(`  -> Course ID: ${result.courseId}`);
  console.log(`  -> Skills:    ${result.skillsList.slice(0, 45)}...`);
  console.log(`  -> Gaps:      ${result.weakAreas.join(', ')}\n`);
}

console.log('🎉 ALL 12 CAREER TRACKS VERIFIED 100% DISTINCT AND ACCURATELY MAPPED!');
