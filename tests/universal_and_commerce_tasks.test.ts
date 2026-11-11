import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import type { DayConfig } from '../src/lib/data/curriculumEnricher';
import { GIT_VERSION_CONTROL_30_DAYS_CONFIGS } from '../src/lib/data/gitVersionControl30DayData';
import { IOT_EMBEDDED_30_DAYS_CONFIGS } from '../src/lib/data/iotEmbedded30DayData';
import { BLOCKCHAIN_30_DAYS_CONFIGS } from '../src/lib/data/blockchain30DayData';
import { MOBILE_30_DAYS_CONFIGS } from '../src/lib/data/mobile30DayData';
import { GRAPHICS_3D_30_DAYS_CONFIGS } from '../src/lib/data/graphics3d30DayData';
import { IOT_NETWORK_30_DAYS_CONFIGS } from '../src/lib/data/iotNetwork30DayData';
import { IOT_EDGE_AI_30_DAYS_CONFIGS } from '../src/lib/data/iotEdgeAi30DayData';
import { IOT_SECURITY_30_DAYS_CONFIGS } from '../src/lib/data/iotSecurity30DayData';
import { BCOM_ANALYTICS_30_DAYS_CONFIGS } from '../src/lib/data/bcomAnalytics30DayData';
import { BCOM_DIGITAL_MARKETING_30_DAYS_CONFIGS } from '../src/lib/data/bcomDigitalMarketing30DayData';
import { BCOM_ECOMMERCE_30_DAYS_CONFIGS } from '../src/lib/data/bcomEcommerce30DayData';
import { BCOM_ENTREPRENEURSHIP_30_DAYS_CONFIGS } from '../src/lib/data/bcomEntrepreneurship30DayData';
import { BCOM_SALES_CRM_30_DAYS_CONFIGS } from '../src/lib/data/bcomSalesCrm30DayData';
import { BCOM_OPERATIONS_30_DAYS_CONFIGS } from '../src/lib/data/bcomOperations30DayData';
import { BCOM_AI_TRANSFORMATION_30_DAYS_CONFIGS } from '../src/lib/data/bcomAiTransformation30DayData';
import { BCOM_AUDITING_30_DAYS_CONFIGS } from '../src/lib/data/bcomAuditing30DayData';
import { BCOM_BANKING_30_DAYS_CONFIGS } from '../src/lib/data/bcomBanking30DayData';
import { BCOM_LAW_30_DAYS_CONFIGS } from '../src/lib/data/bcomLaw30DayData';
import { BCOM_TAXATION_30_DAYS_CONFIGS } from '../src/lib/data/bcomTaxation30DayData';

import { COMPUTER_FUNDAMENTALS_30_DAYS_CONFIGS } from '../src/lib/data/computerFundamentals30DayData';
import { QUANT_SYSTEMS_30_DAYS_CONFIGS } from '../src/lib/data/quant30DayData';
import { SOFT_SKILLS_30_DAYS_CONFIGS } from '../src/lib/data/softSkills30DayData';
import { EXCEL_DATA_VIZ_30_DAYS_CONFIGS } from '../src/lib/data/excelDataViz30DayData';
import { AI_PROMPT_LITERACY_30_DAYS_CONFIGS } from '../src/lib/data/aiPromptLiteracy30DayData';
import { NLP_30_DAYS_CONFIGS } from '../src/lib/data/nlp30DayData';
import { BCOM_ACCOUNTING_30_DAYS_CONFIGS } from '../src/lib/data/bcomAccounting30DayData';
import { BCOM_FINANCE_30_DAYS_CONFIGS } from '../src/lib/data/bcomFinance30DayData';
import { BCOM_MARKETING_30_DAYS_CONFIGS } from '../src/lib/data/bcomMarketing30DayData';

const SOLUTIONS_PATH = path.join(process.cwd(), 'tests', 'fixtures', 'universal_and_commerce_solutions.json');
const PRACTICE_SOLUTIONS_PATH = path.join(process.cwd(), 'tests', 'fixtures', 'practice_solutions.json');

const universalSolutions: Record<string, string> = JSON.parse(fs.readFileSync(SOLUTIONS_PATH, 'utf8'));
const practiceSolutions: Record<string, string> = JSON.parse(fs.readFileSync(PRACTICE_SOLUTIONS_PATH, 'utf8'));

function runInSandbox(code: string, testCode: string): { ok: boolean; err?: string } {
  try {
    vm.runInNewContext(
      `${code}\n${testCode}`,
      {
        console: { log: () => {}, warn: () => {}, error: () => {} },
        Math,
        Number,
        String,
        Array,
        Object,
        JSON,
        Date,
        RegExp,
        Set,
        Map,
        Error,
        TypeError,
        RangeError,
        parseInt,
        parseFloat,
        isNaN,
        Boolean,
        Buffer,
        Uint8Array,
        Int8Array,
        Float32Array,
      },
      { timeout: 1000 }
    );
    return { ok: true };
  } catch (e: any) {
    return { ok: false, err: e?.message || String(e) };
  }
}

const COURSES_WITH_FIXTURES: Array<{ prefix: string; configs: DayConfig[]; fixtureMap: Record<string, string> }> = [
  { prefix: 'git_vcs', configs: GIT_VERSION_CONTROL_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'iot_emb', configs: IOT_EMBEDDED_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'blockchain', configs: BLOCKCHAIN_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'mobile', configs: MOBILE_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'g3d', configs: GRAPHICS_3D_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'iot_net', configs: IOT_NETWORK_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'iot_edge', configs: IOT_EDGE_AI_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'iot_sec', configs: IOT_SECURITY_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_ana', configs: BCOM_ANALYTICS_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_dmkt', configs: BCOM_DIGITAL_MARKETING_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_ecom', configs: BCOM_ECOMMERCE_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_ent', configs: BCOM_ENTREPRENEURSHIP_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_scrm', configs: BCOM_SALES_CRM_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_ops', configs: BCOM_OPERATIONS_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_ait', configs: BCOM_AI_TRANSFORMATION_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_aud', configs: BCOM_AUDITING_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_ban', configs: BCOM_BANKING_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_law', configs: BCOM_LAW_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom_tax', configs: BCOM_TAXATION_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'comp_fund', configs: COMPUTER_FUNDAMENTALS_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'soft-skills', configs: SOFT_SKILLS_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'excel_viz', configs: EXCEL_DATA_VIZ_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom-accounting', configs: BCOM_ACCOUNTING_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom-finance', configs: BCOM_FINANCE_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'bcom-marketing', configs: BCOM_MARKETING_30_DAYS_CONFIGS, fixtureMap: universalSolutions },
  { prefix: 'quant-systems', configs: QUANT_SYSTEMS_30_DAYS_CONFIGS, fixtureMap: practiceSolutions },
  { prefix: 'ai_prompt', configs: AI_PROMPT_LITERACY_30_DAYS_CONFIGS, fixtureMap: practiceSolutions },
  { prefix: 'nlp', configs: NLP_30_DAYS_CONFIGS, fixtureMap: practiceSolutions },
];

const COURSES_STARTER_ONLY: Array<{ prefix: string; configs: DayConfig[] }> = [];

for (const c of COURSES_WITH_FIXTURES) {
  test(`[${c.prefix}] all 30 days (60 tasks) fail with starter code and pass with reference solution`, () => {
    assert.equal(c.configs.length, 30, `${c.prefix} must have 30 day configs`);
    c.configs.forEach((cfg, idx) => {
      const day = cfg.day ?? idx + 1;
      const eKey = `${c.prefix}-exam-day-${day}`;
      const aKey = `${c.prefix}-assign-day-${day}`;

      assert.equal(runInSandbox(cfg.eStarter || '', cfg.eTest || '').ok, false, `${eKey} starter code must NOT pass`);
      assert.equal(runInSandbox(cfg.aStarter || '', cfg.aTest || '').ok, false, `${aKey} starter code must NOT pass`);

      const eSol = c.fixtureMap[eKey];
      const aSol = c.fixtureMap[aKey];
      assert.ok(eSol, `Missing reference solution for ${eKey}`);
      assert.ok(aSol, `Missing reference solution for ${aKey}`);

      const eRes = runInSandbox(eSol, cfg.eTest || '');
      assert.equal(eRes.ok, true, `${eKey} reference solution failed: ${eRes.err}`);

      const aRes = runInSandbox(aSol, cfg.aTest || '');
      assert.equal(aRes.ok, true, `${aKey} reference solution failed: ${aRes.err}`);
    });
  });
}

for (const c of COURSES_STARTER_ONLY) {
  test(`[${c.prefix}] all 30 days (60 tasks) fail with starter code (zero pre-solved starters)`, () => {
    assert.equal(c.configs.length, 30, `${c.prefix} must have 30 day configs`);
    c.configs.forEach((cfg, idx) => {
      const day = cfg.day ?? idx + 1;
      assert.equal(runInSandbox(cfg.eStarter || '', cfg.eTest || '').ok, false, `${c.prefix} day ${day} exam starter must NOT pass`);
      assert.equal(runInSandbox(cfg.aStarter || '', cfg.aTest || '').ok, false, `${c.prefix} day ${day} assign starter must NOT pass`);
    });
  });
}
