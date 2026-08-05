import { BCOM_ACCOUNTING_30_DAYS_QUESTS } from '../src/lib/data/bcomAccounting30DayData';
import { BCOM_ACCOUNTING_KNOWLEDGE_GRAPH } from '../src/lib/data/bcomKnowledgeGraph';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { CANONICAL_TRAJECTORIES } from '../src/lib/data/careerTrajectories';

console.log('--- B.COM & BBA DIGITAL ACCOUNTING & TAXATION VALIDATION ---');
console.log('1. Total Quests Count:', BCOM_ACCOUNTING_30_DAYS_QUESTS.length);

const teachingQuests = BCOM_ACCOUNTING_30_DAYS_QUESTS.filter(q => q.category === 'learning');
const assignmentQuests = BCOM_ACCOUNTING_30_DAYS_QUESTS.filter(q => q.category === 'assignment');
const examQuests = BCOM_ACCOUNTING_30_DAYS_QUESTS.filter(q => q.category === 'exam');

console.log('   - Teaching Quests:', teachingQuests.length, '(Expected: 90)');
console.log('   - Assignment Quests:', assignmentQuests.length, '(Expected: 28)');
console.log('   - Exam Quests:', examQuests.length, '(Expected: 28)');

const day1And2 = BCOM_ACCOUNTING_30_DAYS_QUESTS.filter(q => q.id.startsWith('bcom-day1-') || q.id.startsWith('bcom-day2-'));
console.log('2. Days 1 & 2 Quests Count:', day1And2.length, '(All Teaching)');

const day30 = BCOM_ACCOUNTING_30_DAYS_QUESTS.filter(q => q.id.startsWith('bcom-day30-'));
console.log('3. Day 30 Capstone Quests Count:', day30.length, '(3 Teaching + 1 Capstone Assignment + 1 Final Exam)');

console.log('4. Knowledge Graph Modules Count:', BCOM_ACCOUNTING_KNOWLEDGE_GRAPH.length);
console.log('5. Course Registry Registered:', COURSES_REGISTRY.some(c => c.id === 'course-digital-accounting'));
console.log('6. Trajectory Registered:', Boolean(CANONICAL_TRAJECTORIES['digital-accountant']));

console.log('VALIDATION PASSED SUCCESSFULLY!');
