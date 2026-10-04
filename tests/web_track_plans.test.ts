import test from 'node:test';
import assert from 'node:assert/strict';

import { getCrashPlanById } from '../src/lib/data/crashPlansData';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { getLongLesson } from '../src/lib/data/longLessons';

/**
 * Committed baseline snapshot of plan-24m-master (SRS C6 / W-12).
 * Verifies plan-24m-master is NEVER modified by any web-track changes.
 */
export const PLAN_24M_BASELINE = {
  web_fullstack: [
    { month: 1, courseId: 'course-react-web', title: 'Month 1: Frontend Architecture' },
    { month: 2, courseId: 'course-fullstack-js', title: 'Month 2: Distributed Node Services' },
    { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL' },
    { month: 4, courseId: 'course-dsa-optim', title: 'Month 4: System DSA & LeetCode Prep' },
    { month: 5, courseId: 'course-devops-cicd', title: 'Month 5: DevOps & Kubernetes' },
    { month: 6, courseId: 'course-cloud-native', title: 'Month 6: High-Scale Cloud Systems' },
    { month: 7, courseId: 'course-distributed-sys', title: 'Month 7: Microservices & Event Streams' },
    { month: 8, courseId: 'course-cybersecurity', title: 'Month 8: AppSec & Enterprise Defense' },
    { month: 9, courseId: 'course-ai-eng', title: 'Month 9: Applied AI Integrations' },
    { month: 10, courseId: 'course-cloud-native', title: 'Month 10: Multi-Cloud Reliability' },
    { month: 11, courseId: 'course-distributed-sys', title: 'Month 11: High-Throughput Streaming' },
    { month: 12, courseId: 'course-ai-prompt-literacy', title: 'Month 12: Production AI Deployment' },
    { month: 13, courseId: 'course-distributed-sys', title: 'Month 13: Distributed Consensus Protocols' },
    { month: 14, courseId: 'course-cybersecurity', title: 'Month 14: Zero-Trust Cloud Security' },
    { month: 15, courseId: 'course-cloud-native', title: 'Month 15: Edge Computing & WASM' },
    { month: 16, courseId: 'course-database-eng', title: 'Month 16: Globally Distributed Databases' },
    { month: 17, courseId: 'course-devops-cicd', title: 'Month 17: Platform Engineering & GitOps' },
    { month: 18, courseId: 'course-fullstack-js', title: 'Month 18: Real-Time Media & WebRTC' },
    { month: 19, courseId: 'course-ai-eng', title: 'Month 19: AI Multi-Agent Mesh' },
    { month: 20, courseId: 'course-cloud-native', title: 'Month 20: Cost Optimization & FinOps' },
    { month: 21, courseId: 'course-cybersecurity', title: 'Month 21: Disaster Recovery & Chaos Engineering' },
    { month: 22, courseId: 'course-distributed-sys', title: 'Month 22: High-Performance Networking' },
    { month: 23, courseId: 'course-design-systems', title: 'Month 23: Technical Leadership & RFCs' },
    { month: 24, courseId: 'course-dsa-optim', title: 'Month 24: Staff SDE Interview Mastery' },
  ],
  python_ai: [
    { month: 1, courseId: 'course-python-backend', title: 'Month 1: Python Core & AsyncIO' },
    { month: 2, courseId: 'course-dsa-python', title: 'Month 2: Algorithms & Problem Solving' },
    { month: 3, courseId: 'course-database-eng', title: 'Month 3: Databases with SQL and PostgreSQL' },
    { month: 4, courseId: 'course-ai-python', title: 'Month 4: Machine Learning Pipelines' },
    { month: 5, courseId: 'course-distributed-python', title: 'Month 5: Distributed Data Streams' },
    { month: 6, courseId: 'course-cloud-python', title: 'Month 6: Cloud Native MLOps' },
    { month: 7, courseId: 'course-nlp-python', title: 'Month 7: Natural Language Processing' },
    { month: 8, courseId: 'course-quant-python', title: 'Month 8: High-Frequency Analytics' },
    { month: 9, courseId: 'course-ai-prompt-python', title: 'Month 9: Autonomous AI Agents' },
    { month: 10, courseId: 'course-train-python', title: 'Month 10: Distributed Model Training' },
    { month: 11, courseId: 'course-vector-python', title: 'Month 11: Production Vector Engines' },
    { month: 12, courseId: 'course-ai-python', title: 'Month 12: Production AI Safety & Guardrails' },
    { month: 13, courseId: 'course-ai-python', title: 'Month 13: Transformer Architecture from Scratch' },
    { month: 14, courseId: 'course-quant-python', title: 'Month 14: LLM Quantization & Hardware Acceleration' },
    { month: 15, courseId: 'course-nlp-python', title: 'Month 15: Multimodal Vision-Language Models' },
    { month: 16, courseId: 'course-ai-python', title: 'Month 16: Reinforcement Learning from Human Feedback' },
    { month: 17, courseId: 'course-distributed-python', title: 'Month 17: Large-Scale Synthetic Data Engines' },
    { month: 18, courseId: 'course-cloud-python', title: 'Month 18: High-Throughput Inference Clusters' },
    { month: 19, courseId: 'course-ai-prompt-python', title: 'Month 19: Long-Horizon Agent Planning' },
    { month: 20, courseId: 'course-database-eng', title: 'Month 20: Graph Neural Networks & Knowledge Graphs' },
    { month: 21, courseId: 'course-cyber-python', title: 'Month 21: Model Extraction & Red Teaming' },
    { month: 22, courseId: 'course-cloud-python', title: 'Month 22: Edge AI & Mobile Neural Engines' },
    { month: 23, courseId: 'course-design-systems', title: 'Month 23: AI Ethics, Compliance & Governance' },
    { month: 24, courseId: 'course-dsa-python', title: 'Month 24: Principal AI Architect Defense' },
  ],
};

test('plan-24m-master is unchanged: module list matches committed baseline snapshot', () => {
  const plan = getCrashPlanById('plan-24m-master');
  assert.ok(plan, 'plan-24m-master must exist');

  const webActual = plan.modulesByTrack.web_fullstack.map((m) => ({
    month: m.month,
    courseId: m.courseId,
    title: m.title,
  }));
  assert.deepEqual(webActual, PLAN_24M_BASELINE.web_fullstack, 'plan-24m-master web_fullstack modules modified!');

  const pyActual = plan.modulesByTrack.python_ai.map((m) => ({
    month: m.month,
    courseId: m.courseId,
    title: m.title,
  }));
  assert.deepEqual(pyActual, PLAN_24M_BASELINE.python_ai, 'plan-24m-master python_ai modules modified!');
});

test('web plans inclusion check: 1m ⊂ 3m ⊂ 9m ⊂ 12m by month', () => {
  const p1m = getCrashPlanById('plan-1m-sprint');
  const p3m = getCrashPlanById('plan-3m-accelerator');
  const p9m = getCrashPlanById('plan-9m-master');
  const p12m = getCrashPlanById('plan-12m-fellow');

  assert.ok(p1m, 'plan-1m-sprint exists');
  assert.ok(p3m, 'plan-3m-accelerator exists');
  assert.ok(p9m, 'plan-9m-master exists');
  assert.ok(p12m, 'plan-12m-fellow exists');

  const m1 = p1m.modulesByTrack.web_fullstack;
  const m3 = p3m.modulesByTrack.web_fullstack;
  const m9 = p9m.modulesByTrack.web_fullstack;
  const m12 = p12m.modulesByTrack.web_fullstack;

  assert.equal(m1.length, 1);
  assert.equal(m3.length, 3);
  assert.equal(m9.length, 9);
  assert.equal(m12.length, 12);

  // 1m is subset of 3m: month 1 matches
  assert.equal(m1[0].courseId, m3[0].courseId);

  // 3m is subset of 9m: months 1..3 match
  for (let i = 0; i < 3; i++) {
    assert.equal(m3[i].courseId, m9[i].courseId, `Month ${i + 1} differs between 3m and 9m`);
  }

  // 9m is subset of 12m: months 1..9 match
  for (let i = 0; i < 9; i++) {
    assert.equal(m9[i].courseId, m12[i].courseId, `Month ${i + 1} differs between 9m and 12m`);
  }
});

test('Web 12m has 12 distinct courses', () => {
  const p12m = getCrashPlanById('plan-12m-fellow');
  assert.ok(p12m);
  const courses = p12m.modulesByTrack.web_fullstack.map((m) => m.courseId);
  assert.equal(courses.length, 12);
  assert.equal(new Set(courses).size, 12, '12m must have 12 distinct courses');
});

const PREFIX_MAP: Record<string, string> = {
  'course-react-web': 'react-basics',
  'course-node-web': 'node-web',
  'course-database-eng': 'sql-mastery',
  'course-dsa-optim': 'dsa-optim',
  'course-devops-cicd': 'devops',
  'course-cloud-native': 'cloud',
  'course-distributed-sys': 'dist',
  'course-cybersecurity': 'cyber',
  'course-ai-eng': 'ai',
  'course-sre-web': 'sre-web',
  'course-stream-web': 'stream-web',
  'course-aideploy-web': 'aideploy-web',
  'course-design-systems': 'design',
  'course-fullstack-js': 'fullstack-js',
  'course-ai-prompt-literacy': 'ai_prompt',
};

test('every web course used by 1m-12m has 30 long lessons and 60 tasks', () => {
  const p12m = getCrashPlanById('plan-12m-fellow');
  assert.ok(p12m);
  const courses = Array.from(new Set(p12m.modulesByTrack.web_fullstack.map((m) => m.courseId)));
  for (const courseId of courses) {
    const course = COURSES_REGISTRY.find((c) => c.id === courseId);
    assert.ok(course, `${courseId} is registered`);
    const practice = course.quests.filter((q) => /-(exam|assign)-day-\d+$/.test(q.id));
    assert.equal(practice.length, 60, `${courseId} has 60 practice tasks`);
    const prefix = PREFIX_MAP[courseId] || courseId.replace(/^course-/, '');
    for (let day = 1; day <= 30; day++) {
      assert.ok(getLongLesson(prefix, day), `${courseId} Day ${day} long lesson exists`);
    }
  }
});
