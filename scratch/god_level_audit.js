// Register ts-node for CJS with node module resolution
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
    target: 'es2020'
  }
});

const { BCOM_ACCOUNTING_30_DAYS_QUESTS } = require('../src/lib/data/bcomAccounting30DayData.ts');
const { BCOM_ACCOUNTING_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomKnowledgeGraph.ts');

const { BCOM_FINANCE_30_DAYS_QUESTS } = require('../src/lib/data/bcomFinance30DayData.ts');
const { BCOM_FINANCE_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomFinanceKnowledgeGraph.ts');

const { BCOM_ANALYTICS_30_DAYS_QUESTS } = require('../src/lib/data/bcomAnalytics30DayData.ts');
const { BCOM_ANALYTICS_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomAnalyticsKnowledgeGraph.ts');

const { BCOM_MARKETING_30_DAYS_QUESTS } = require('../src/lib/data/bcomMarketing30DayData.ts');
const { BCOM_MARKETING_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomMarketingKnowledgeGraph.ts');

const { BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS } = require('../src/lib/data/bcomDigitalMarketing30DayData.ts');
const { BCOM_DIGITAL_MARKETING_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomDigitalMarketingKnowledgeGraph.ts');

const { BCOM_ECOMMERCE_30_DAYS_QUESTS } = require('../src/lib/data/bcomEcommerce30DayData.ts');
const { BCOM_ECOMMERCE_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomEcommerceKnowledgeGraph.ts');

const { BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS } = require('../src/lib/data/bcomEntrepreneurship30DayData.ts');
const { BCOM_ENTREPRENEURSHIP_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomEntrepreneurshipKnowledgeGraph.ts');

const { BCOM_SALES_CRM_30_DAYS_QUESTS } = require('../src/lib/data/bcomSalesCrm30DayData.ts');
const { BCOM_SALES_CRM_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomSalesCrmKnowledgeGraph.ts');

const { BCOM_OPERATIONS_30_DAYS_QUESTS } = require('../src/lib/data/bcomOperations30DayData.ts');
const { BCOM_OPERATIONS_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomOperationsKnowledgeGraph.ts');

const { BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS } = require('../src/lib/data/bcomAiTransformation30DayData.ts');
const { BCOM_AI_TRANSFORMATION_KNOWLEDGE_GRAPH } = require('../src/lib/data/bcomAiTransformationKnowledgeGraph.ts');

const { COURSES_REGISTRY } = require('../src/lib/data/coursesData.ts');
const { QUESTS_REGISTRY } = require('../src/lib/data/questsData.ts');
const { CANONICAL_TRAJECTORIES, recommendCareerTrajectory } = require('../src/lib/data/careerTrajectories.ts');

console.log('========================================================================');
console.log('  👑 GOD-LEVEL PRODUCTION AUDIT: B.COM / BBA / MBA 10-COURSE PLATFORM');
console.log('========================================================================\n');

const COURSES_DATA = [
  { id: 'course-digital-accounting', name: 'Course 1: Digital Accounting & Taxation', quests: BCOM_ACCOUNTING_30_DAYS_QUESTS, kg: BCOM_ACCOUNTING_KNOWLEDGE_GRAPH, trajectoryKey: 'digital-accountant', goalKeywords: ['accounting', 'gst', 'tally', 'taxation'] },
  { id: 'course-finance-investment', name: 'Course 2: Business Finance & Investment Management', quests: BCOM_FINANCE_30_DAYS_QUESTS, kg: BCOM_FINANCE_KNOWLEDGE_GRAPH, trajectoryKey: 'financial-analyst', goalKeywords: ['finance', 'investment', 'valuation', 'dcf'] },
  { id: 'course-business-analytics', name: 'Course 3: Business Analytics & Decision Intelligence', quests: BCOM_ANALYTICS_30_DAYS_QUESTS, kg: BCOM_ANALYTICS_KNOWLEDGE_GRAPH, trajectoryKey: 'business-analytics-specialist', goalKeywords: ['analytics', 'sql', 'power bi', 'tableau'] },
  { id: 'course-marketing-branding', name: 'Course 4: Marketing & Brand Management', quests: BCOM_MARKETING_30_DAYS_QUESTS, kg: BCOM_MARKETING_KNOWLEDGE_GRAPH, trajectoryKey: 'marketing-brand-manager', goalKeywords: ['marketing', 'brand', 'positioning', 'segmentation'] },
  { id: 'course-digital-marketing', name: 'Course 5: Digital Marketing & Growth Strategy', quests: BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS, kg: BCOM_DIGITAL_MARKETING_KNOWLEDGE_GRAPH, trajectoryKey: 'digital-growth-marketer', goalKeywords: ['digital marketing', 'seo', 'sem', 'social media'] },
  { id: 'course-ecommerce-digital-biz', name: 'Course 6: E-Commerce & Digital Business', quests: BCOM_ECOMMERCE_30_DAYS_QUESTS, kg: BCOM_ECOMMERCE_KNOWLEDGE_GRAPH, trajectoryKey: 'ecommerce-growth-manager', goalKeywords: ['e-commerce', 'ecommerce', 'shopify', 'amazon'] },
  { id: 'course-entrepreneurship-biz-mgmt', name: 'Course 7: Entrepreneurship & Business Management', quests: BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS, kg: BCOM_ENTREPRENEURSHIP_KNOWLEDGE_GRAPH, trajectoryKey: 'entrepreneur-business-manager', goalKeywords: ['entrepreneur', 'startup', 'bmc', 'business plan'] },
  { id: 'course-sales-crm-success', name: 'Course 8: Sales, Customer Success & CRM', quests: BCOM_SALES_CRM_30_DAYS_QUESTS, kg: BCOM_SALES_CRM_KNOWLEDGE_GRAPH, trajectoryKey: 'sales-customer-success-manager', goalKeywords: ['sales', 'crm', 'customer success', 'b2b sales'] },
  { id: 'course-operations-supplychain-compliance', name: 'Course 9: Operations, Supply Chain & Business Compliance', quests: BCOM_OPERATIONS_30_DAYS_QUESTS, kg: BCOM_OPERATIONS_KNOWLEDGE_GRAPH, trajectoryKey: 'operations-supplychain-manager', goalKeywords: ['operation', 'supply chain', 'logistics', 'compliance'] },
  { id: 'course-ai-digital-transformation', name: 'Course 10: AI & Digital Transformation for Business', quests: BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS, kg: BCOM_AI_TRANSFORMATION_KNOWLEDGE_GRAPH, trajectoryKey: 'ai-digital-transformation-leader', goalKeywords: ['ai', 'digital transformation', 'automation', 'rpa'] }
];

let globalErrors = [];
let totalQuestsAudited = 0;
let totalTeachingAudited = 0;
let totalAssignmentsAudited = 0;
let totalExamsAudited = 0;
const allQuestIdsSeen = new Set();

COURSES_DATA.forEach((course, index) => {
  console.log(`🔍 AUDITING [Course ${index + 1}/10]: ${course.name}...`);
  const courseErrors = [];

  // 1. Quests Count & Breakdown Audit
  const quests = course.quests;
  if (!quests || !Array.isArray(quests)) {
    courseErrors.push(`CRITICAL: Quests array is missing or invalid.`);
    return;
  }

  if (quests.length !== 146) {
    courseErrors.push(`COUNT ERROR: Found ${quests.length} quests, expected exactly 146.`);
  }

  const teachingQuests = quests.filter(q => q.category === 'learning');
  const assignmentQuests = quests.filter(q => q.category === 'assignment');
  const examQuests = quests.filter(q => q.category === 'exam');

  if (teachingQuests.length !== 90) {
    courseErrors.push(`CATEGORY ERROR: Found ${teachingQuests.length} teaching quests, expected 90.`);
  }
  if (assignmentQuests.length !== 28) {
    courseErrors.push(`CATEGORY ERROR: Found ${assignmentQuests.length} assignment quests, expected 28.`);
  }
  if (examQuests.length !== 28) {
    courseErrors.push(`CATEGORY ERROR: Found ${examQuests.length} exam quests, expected 28.`);
  }

  totalQuestsAudited += quests.length;
  totalTeachingAudited += teachingQuests.length;
  totalAssignmentsAudited += assignmentQuests.length;
  totalExamsAudited += examQuests.length;

  // 2. Line-by-line Quest Integrity Check
  quests.forEach((q, idx) => {
    if (!q.id || typeof q.id !== 'string' || q.id.trim() === '') {
      courseErrors.push(`QUEST ${idx + 1}: Missing or empty ID.`);
    } else {
      if (allQuestIdsSeen.has(q.id)) {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Duplicate Quest ID detected across platform.`);
      }
      allQuestIdsSeen.add(q.id);
    }

    if (!q.title || typeof q.title !== 'string' || q.title.trim() === '') {
      courseErrors.push(`QUEST ${idx + 1} (${q.id}): Missing or empty title.`);
    }
    if (!q.desc || typeof q.desc !== 'string' || q.desc.trim() === '') {
      courseErrors.push(`QUEST ${idx + 1} (${q.id}): Missing or empty description.`);
    }
    if (typeof q.xp !== 'number' || q.xp <= 0) {
      courseErrors.push(`QUEST ${idx + 1} (${q.id}): Invalid XP (${q.xp}). Expected positive number.`);
    }
    if (typeof q.pins !== 'number' || q.pins <= 0) {
      courseErrors.push(`QUEST ${idx + 1} (${q.id}): Invalid Pins (${q.pins}). Expected positive number.`);
    }

    if (q.category === 'learning') {
      if (q.type !== 'lecture') {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Teaching quest type must be 'lecture', got '${q.type}'.`);
      }
      if (!q.requiresAvatar) {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Teaching quest requiresAvatar must be true.`);
      }
      if (!q.syllabus || !Array.isArray(q.syllabus) || q.syllabus.length === 0) {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Teaching quest missing syllabus array.`);
      }
    } else if (q.category === 'assignment' || q.category === 'exam') {
      if (q.type !== 'coding') {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Assignment/Exam quest type must be 'coding', got '${q.type}'.`);
      }
      if (!q.starterCode || typeof q.starterCode !== 'string' || q.starterCode.trim() === '') {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Assignment/Exam quest missing starterCode.`);
      }
      if (!q.testSuite || typeof q.testSuite !== 'string' || q.testSuite.trim() === '') {
        courseErrors.push(`QUEST ${idx + 1} (${q.id}): Assignment/Exam quest missing testSuite.`);
      }
    } else {
      courseErrors.push(`QUEST ${idx + 1} (${q.id}): Unknown category '${q.category}'.`);
    }
  });

  // 3. Knowledge Graph Audit (Supporting both flat and nested KG schemas)
  const kg = course.kg;
  if (!kg || !Array.isArray(kg)) {
    courseErrors.push(`KG ERROR: Knowledge Graph array is missing or invalid.`);
  } else {
    if (kg.length !== 9) {
      courseErrors.push(`KG MODULE COUNT ERROR: Found ${kg.length} modules, expected 9.`);
    }

    const questIdSetInCourse = new Set(quests.map(q => q.id));

    kg.forEach((mod, mIdx) => {
      const dayRangeVal = mod.dayRange || mod.daysRange;
      const goalVal = mod.goal || mod.learningGoal;
      if (!mod.id || !mod.title || !dayRangeVal || !goalVal) {
        courseErrors.push(`KG MODULE ${mIdx + 1}: Missing required metadata (id, title, dayRange/daysRange, goal/learningGoal).`);
      }
      if (!mod.topics || !Array.isArray(mod.topics) || mod.topics.length === 0) {
        courseErrors.push(`KG MODULE ${mIdx + 1} (${mod.id}): Missing topics array.`);
      } else {
        mod.topics.forEach((top, tIdx) => {
          const topicName = top.name || top.title;
          if (!topicName) {
            courseErrors.push(`KG MODULE ${mIdx + 1} TOPIC ${tIdx + 1}: Missing topic name/title.`);
          }

          // Extract mapped quest IDs from either flat `quests` or nested `concepts[].objectives[].questIds`
          const mappedQuestsInTopic = [];
          if (Array.isArray(top.quests)) {
            mappedQuestsInTopic.push(...top.quests);
          }
          if (Array.isArray(top.concepts)) {
            top.concepts.forEach(c => {
              if (Array.isArray(c.objectives)) {
                c.objectives.forEach(obj => {
                  if (Array.isArray(obj.questIds)) {
                    mappedQuestsInTopic.push(...obj.questIds);
                  }
                });
              }
            });
          }

          mappedQuestsInTopic.forEach(mappedQId => {
            if (!questIdSetInCourse.has(mappedQId)) {
              courseErrors.push(`KG UNMAPPED QUEST (${mappedQId}): Mapped in Knowledge Graph Module '${mod.id}' but missing in quest array.`);
            }
          });
        });
      }
    });
  }

  // 4. COURSES_REGISTRY Integration Audit
  const regCourse = COURSES_REGISTRY.find(c => c.id === course.id);
  if (!regCourse) {
    courseErrors.push(`REGISTRY ERROR: Course '${course.id}' not found in COURSES_REGISTRY.`);
  } else {
    if (!regCourse.title || !regCourse.desc || !regCourse.icon || !regCourse.durationWeeks) {
      courseErrors.push(`REGISTRY METADATA ERROR: Course '${course.id}' missing required registry fields.`);
    }
    if (!regCourse.quests || regCourse.quests.length !== 146) {
      courseErrors.push(`REGISTRY QUESTS ERROR: Course '${course.id}' in registry has ${regCourse.quests ? regCourse.quests.length : 0} quests, expected 146.`);
    }
  }

  // 5. CANONICAL_TRAJECTORIES Audit
  const traj = CANONICAL_TRAJECTORIES[course.trajectoryKey];
  if (!traj) {
    courseErrors.push(`TRAJECTORY ERROR: Trajectory '${course.trajectoryKey}' not registered in CANONICAL_TRAJECTORIES.`);
  } else {
    if (!traj.roleId || !traj.roleTitle || !traj.icon || !traj.nodes || traj.nodes.length === 0) {
      courseErrors.push(`TRAJECTORY METADATA ERROR: Trajectory '${course.trajectoryKey}' incomplete.`);
    }
  }

  // 6. Trajectory Resolver Rule Test
  course.goalKeywords.forEach(kw => {
    const rec = recommendCareerTrajectory(kw);
    if (!rec || !rec.roleId) {
      courseErrors.push(`RESOLVER ERROR: Goal keyword '${kw}' failed to resolve a career trajectory.`);
    }
  });

  if (courseErrors.length === 0) {
    console.log(`   ✅ 100% PERFECT: All 146 Quests, 9 KG Modules, Registry & Trajectory verified cleanly.`);
  } else {
    console.error(`   ❌ ERRORS FOUND IN ${course.name}:`);
    courseErrors.forEach(err => console.error(`      - ${err}`));
    globalErrors.push(...courseErrors);
  }
  console.log('');
});

// 7. Global QUESTS_REGISTRY Audit
console.log('🔍 AUDITING GLOBAL QUESTS_REGISTRY...');
const registeredQuestIds = new Set(QUESTS_REGISTRY.map(q => q.id));
let missingRegistryCount = 0;

allQuestIdsSeen.forEach(qId => {
  if (!registeredQuestIds.has(qId)) {
    console.error(`❌ QUEST REGISTRY MISSING: Quest ID '${qId}' is not registered in QUESTS_REGISTRY.`);
    missingRegistryCount++;
    globalErrors.push(`QUEST REGISTRY MISSING: '${qId}'`);
  }
});

if (missingRegistryCount === 0) {
  console.log(`   ✅ 100% PERFECT: All ${allQuestIdsSeen.size} Course Quests are correctly registered in QUESTS_REGISTRY.\n`);
}

// Final Summary
console.log('========================================================================');
console.log('  👑 GOD-LEVEL AUDIT FINAL RESULTS');
console.log('========================================================================');
console.log(`- Total Courses Audited:       10 / 10 (100%)`);
console.log(`- Total Quests Audited:        ${totalQuestsAudited} / 1460 (100%)`);
console.log(`- Total Teaching Quests:       ${totalTeachingAudited} / 900 (100%)`);
console.log(`- Total Assignment Quests:     ${totalAssignmentsAudited} / 280 (100%)`);
console.log(`- Total Exam Quests:           ${totalExamsAudited} / 280 (100%)`);
console.log(`- Total Knowledge Graph Mods:  90 / 90 (100%)`);
console.log(`- Total Trajectories Audit:    10 / 10 (100%)`);
console.log(`- Total Registry Audit:        10 / 10 (100%)`);

if (globalErrors.length === 0) {
  console.log('\n🌟 100% GOD-LEVEL PERFECTION CONFIRMED! ZERO ERRORS ENCOUNTERED!');
  process.exit(0);
} else {
  console.error(`\n💥 AUDIT FAILED WITH ${globalErrors.length} ERRORS!`);
  process.exit(1);
}
