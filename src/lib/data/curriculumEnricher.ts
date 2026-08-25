export interface DayConfig {
  day?: number;
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export type { CourseQuest } from './coursesData';
import { CourseQuest } from './coursesData';
import { JAVA_PILOT_DAYS } from './javaPilotDays';
import { PYTHON_PILOT_DAYS } from './pythonPilotDays';
import { REACT_PILOT_DAYS } from './reactPilotDays';
import { DATABASE_PILOT_DAYS } from './databasePilotDays';
import { DSA_PILOT_DAYS } from './dsaPilotDays';
import { FULLSTACK_PILOT_DAYS } from './fullstackPilotDays';
import { CLOUD_PILOT_DAYS } from './cloudPilotDays';
import { DEVOPS_PILOT_DAYS } from './devopsPilotDays';
import { AI_PILOT_DAYS } from './aiPilotDays';
import { DISTRIBUTED_PILOT_DAYS } from './distributedPilotDays';
import { IOT_EMBEDDED_PILOT_DAYS } from './iotEmbeddedPilotDays';
import { GRAPHICS_3D_PILOT_DAYS } from './graphics3dPilotDays';
import { BLOCKCHAIN_PILOT_DAYS } from './blockchainPilotDays';
import { IOT_NETWORK_PILOT_DAYS } from './iotNetworkPilotDays';
import { IOT_EDGE_AI_PILOT_DAYS } from './iotEdgeAiPilotDays';
import { IOT_SECURITY_PILOT_DAYS } from './iotSecurityPilotDays';
import { QUANT_PILOT_DAYS } from './quantPilotDays';
import { BCOM_ACCOUNTING_PILOT_DAYS } from './bcomAccountingPilotDays';
import { BCOM_FINANCE_PILOT_DAYS } from './bcomFinancePilotDays';
import { BCOM_ANALYTICS_PILOT_DAYS } from './bcomAnalyticsPilotDays';
import { BCOM_MARKETING_PILOT_DAYS } from './bcomMarketingPilotDays';
import { BCOM_DIGITAL_MARKETING_PILOT_DAYS } from './bcomDigitalMarketingPilotDays';
import { BCOM_ECOMMERCE_PILOT_DAYS } from './bcomEcommercePilotDays';
import { BCOM_ENTREPRENEURSHIP_PILOT_DAYS } from './bcomEntrepreneurshipPilotDays';
import { BCOM_SALES_CRM_PILOT_DAYS } from './bcomSalesCrmPilotDays';
import { BCOM_OPERATIONS_PILOT_DAYS } from './bcomOperationsPilotDays';

export function buildEnrichedDayQuests(prefix: string, dayNum: number, cfg: DayConfig): CourseQuest[] {
  let pilotDay: any = null;
  if (prefix.includes('java')) {
    pilotDay = JAVA_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('python')) {
    pilotDay = PYTHON_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('react')) {
    pilotDay = REACT_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('sql') || prefix.includes('database')) {
    pilotDay = DATABASE_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('dsa')) {
    pilotDay = DSA_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('fullstack')) {
    pilotDay = FULLSTACK_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('cloud')) {
    pilotDay = CLOUD_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('devops')) {
    pilotDay = DEVOPS_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_ops') || prefix.includes('operations') || prefix.includes('supplychain') || prefix.includes('compliance')) {
    pilotDay = BCOM_OPERATIONS_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_scrm') || prefix.includes('sales') || prefix.includes('crm') || prefix.includes('customer_success')) {
    pilotDay = BCOM_SALES_CRM_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_ent') || prefix.includes('entrepreneurship') || prefix.includes('biz_mgmt') || prefix.includes('startup')) {
    pilotDay = BCOM_ENTREPRENEURSHIP_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_ecom') || prefix.includes('ecommerce') || prefix.includes('ecom') || prefix.includes('digital_biz')) {
    pilotDay = BCOM_ECOMMERCE_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_dmkt') || prefix.includes('dmkt') || prefix.includes('digital_marketing') || prefix.includes('growth')) {
    pilotDay = BCOM_DIGITAL_MARKETING_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_mkt') || prefix.includes('marketing') || prefix.includes('branding')) {
    pilotDay = BCOM_MARKETING_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_ana') || prefix.includes('analytics') || prefix.includes('decision_intelligence')) {
    pilotDay = BCOM_ANALYTICS_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_fin') || prefix.includes('finance') || prefix.includes('investment') || prefix.includes('capital_budgeting')) {
    pilotDay = BCOM_FINANCE_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('bcom_acc') || prefix.includes('accounting') || prefix.includes('taxation') || prefix.includes('tally')) {
    pilotDay = BCOM_ACCOUNTING_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('quant') || prefix.includes('trading') || prefix.includes('hft')) {
    pilotDay = QUANT_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('iot_sec') || prefix.includes('iot-sec') || prefix.includes('security')) {
    pilotDay = (IOT_SECURITY_PILOT_DAYS as any)[dayNum] || Object.values(IOT_SECURITY_PILOT_DAYS).find(p => p.day === dayNum);
  } else if (prefix.includes('iot_edge') || prefix.includes('iot-edge') || prefix.includes('edge') || prefix.includes('tinyml')) {
    pilotDay = (IOT_EDGE_AI_PILOT_DAYS as any)[dayNum] || Object.values(IOT_EDGE_AI_PILOT_DAYS).find(p => p.day === dayNum);
  } else if (prefix.includes('ai')) {
    pilotDay = AI_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('dist')) {
    pilotDay = DISTRIBUTED_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('iot_net') || prefix.includes('iot-net') || prefix.includes('network')) {
    pilotDay = IOT_NETWORK_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('iot') || prefix.includes('emb')) {
    pilotDay = IOT_EMBEDDED_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('g3d') || prefix.includes('graphics') || prefix.includes('3d')) {
    pilotDay = GRAPHICS_3D_PILOT_DAYS.find(p => p.day === dayNum);
  } else if (prefix.includes('blockchain') || prefix.includes('web3') || prefix.includes('crypto')) {
    pilotDay = BLOCKCHAIN_PILOT_DAYS.find(p => p.day === dayNum);
  }

  // ── 1. Unified Socratic Adaptive Lesson ──────────────────────────────────
  const lessonTask: CourseQuest = {
    id: `${prefix}-lecture1-day-${dayNum}`,
    title: pilotDay ? `Day ${dayNum}: ${pilotDay.title}` : `Day ${dayNum}: ${cfg.title}`,
    desc: pilotDay ? pilotDay.overviewMetaphor : cfg.desc,
    type: 'lecture',
    category: 'learning',
    requiresAvatar: true,
    syllabus: pilotDay
      ? pilotDay.blocks.map((b: any) => `${b.title}: ${b.conceptBudget.primaryConcept}`)
      : cfg.syllabus,
    skillCategory: 'theory',
    xp: 150,
    pins: 5
  };

  // ── 2. Pure Coding Exam ──────────────────────────────────────────────────
  const examTask: CourseQuest = {
    id: `${prefix}-exam-day-${dayNum}`,
    title: `Day ${dayNum} Exam: ${cfg.eTitle}`,
    desc: cfg.eDesc,
    type: 'coding',
    category: 'exam',
    requiresAvatar: false,
    starterCode: cfg.eStarter,
    hint: cfg.eHint,
    testSuite: cfg.eTest,
    skillCategory: 'programming',
    xp: 120,
    pins: 6
  };

  // ── 3. Pure Practice Assignment ──────────────────────────────────────────
  const assignmentTask: CourseQuest = {
    id: `${prefix}-assign-day-${dayNum}`,
    title: `Day ${dayNum} Assignment: ${cfg.aTitle}`,
    desc: cfg.aDesc,
    type: 'coding',
    category: 'assignment',
    requiresAvatar: false,
    starterCode: cfg.aStarter,
    hint: cfg.aHint,
    testSuite: cfg.aTest,
    skillCategory: 'programming',
    xp: 150,
    pins: 8
  };

  // Return unified quest triad per day (Adaptive Lesson + Coding Exam + Practice Assignment)
  return [lessonTask, examTask, assignmentTask];
}
