import fs from 'node:fs';
import path from 'node:path';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { getLongLesson } from '../src/lib/data/longLessons';
import { getTestQuestions, parseTestQuestId } from '../src/lib/data/courseTests';
import { parseQuestId } from '../src/lib/data/curriculumEnricher';

// Directly import all 53 LongLesson arrays
import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { SQL_LONG_LESSONS } from '../src/lib/data/sqlLongLessons';
import { DSA_PYTHON_LONG_LESSONS } from '../src/lib/data/dsaPythonLongLessons';
import { AI_PYTHON_LONG_LESSONS } from '../src/lib/data/aiPythonLongLessons';
import { DIST_PYTHON_LONG_LESSONS } from '../src/lib/data/distPythonLongLessons';
import { CLOUD_PYTHON_LONG_LESSONS } from '../src/lib/data/cloudPythonLongLessons';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';
import { QUANT_PYTHON_LONG_LESSONS } from '../src/lib/data/quantPythonLongLessons';
import { PROMPT_PYTHON_LONG_LESSONS } from '../src/lib/data/promptPythonLongLessons';
import { CYBER_PYTHON_LONG_LESSONS } from '../src/lib/data/cyberPythonLongLessons';
import { TRAIN_PYTHON_LONG_LESSONS } from '../src/lib/data/trainPythonLongLessons';
import { VECTOR_PYTHON_LONG_LESSONS } from '../src/lib/data/vectorPythonLongLessons';
import { SAFETY_PYTHON_LONG_LESSONS } from '../src/lib/data/safetyPythonLongLessons';
import { NODE_WEB_LONG_LESSONS } from '../src/lib/data/nodeWebLongLessons';
import { DEVOPS_WEB_LONG_LESSONS } from '../src/lib/data/devopsWebLongLessons';
import { CLOUD_WEB_LONG_LESSONS } from '../src/lib/data/cloudWebLongLessons';
import { DESIGN_WEB_LONG_LESSONS } from '../src/lib/data/designWebLongLessons';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';
import { DISTRIBUTED_WEB_LONG_LESSONS } from '../src/lib/data/distributedWebLongLessons';
import { CYBER_WEB_LONG_LESSONS } from '../src/lib/data/cyberWebLongLessons';
import { AI_WEB_LONG_LESSONS } from '../src/lib/data/aiWebLongLessons';
import { SRE_WEB_LONG_LESSONS } from '../src/lib/data/sreWebLongLessons';
import { STREAM_WEB_LONG_LESSONS } from '../src/lib/data/streamWebLongLessons';
import { AI_DEPLOY_WEB_LONG_LESSONS } from '../src/lib/data/aiDeployWebLongLessons';
import { COMP_FUND_LONG_LESSONS } from '../src/lib/data/compFundLongLessons';
import { GIT_VCS_LONG_LESSONS } from '../src/lib/data/gitVcsLongLessons';
import { IOT_EMB_LONG_LESSONS } from '../src/lib/data/iotEmbLongLessons';
import { QUANT_SYSTEMS_LONG_LESSONS } from '../src/lib/data/quantSystemsLongLessons';
import { EXCEL_VIZ_LONG_LESSONS } from '../src/lib/data/excelVizLongLessons';
import { BLOCKCHAIN_LONG_LESSONS } from '../src/lib/data/blockchainLongLessons';
import { MOBILE_LONG_LESSONS } from '../src/lib/data/mobileLongLessons';
import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { SOFT_SKILLS_LONG_LESSONS } from '../src/lib/data/softSkillsLongLessons';
import { G3D_LONG_LESSONS } from '../src/lib/data/g3dLongLessons';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';
import { IOT_EDGE_LONG_LESSONS } from '../src/lib/data/iotEdgeLongLessons';
import { IOT_SEC_LONG_LESSONS } from '../src/lib/data/iotSecLongLessons';
import { IOT_NET_LONG_LESSONS } from '../src/lib/data/iotNetLongLessons';
import { BCOM_ANA_LONG_LESSONS } from '../src/lib/data/bcomAnaLongLessons';
import { BCOM_OPS_LONG_LESSONS } from '../src/lib/data/bcomOpsLongLessons';
import { BCOM_AIT_LONG_LESSONS } from '../src/lib/data/bcomAitLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';
import { BCOM_ACCOUNTING_LONG_LESSONS } from '../src/lib/data/bcomAccountingLongLessons';
import { BCOM_SCRM_LONG_LESSONS } from '../src/lib/data/bcomScrmLongLessons';
import { BCOM_ENT_LONG_LESSONS } from '../src/lib/data/bcomEntLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../src/lib/data/bcomEcomLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../src/lib/data/bcomDmktLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';
import { BCOM_LAW_LONG_LESSONS } from '../src/lib/data/bcomLawLongLessons';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../src/lib/data/bcomAudLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';

const ALL_LONG_LESSON_MODULES: [string, string, readonly any[]][] = [
  ['react', 'reactLongLessons.ts', REACT_LONG_LESSONS],
  ['python', 'pythonLongLessons.ts', PYTHON_LONG_LESSONS],
  ['sql', 'sqlLongLessons.ts', SQL_LONG_LESSONS],
  ['dsaPython', 'dsaPythonLongLessons.ts', DSA_PYTHON_LONG_LESSONS],
  ['aiPython', 'aiPythonLongLessons.ts', AI_PYTHON_LONG_LESSONS],
  ['distPython', 'distPythonLongLessons.ts', DIST_PYTHON_LONG_LESSONS],
  ['cloudPython', 'cloudPythonLongLessons.ts', CLOUD_PYTHON_LONG_LESSONS],
  ['nlpPython', 'nlpPythonLongLessons.ts', NLP_PYTHON_LONG_LESSONS],
  ['quantPython', 'quantPythonLongLessons.ts', QUANT_PYTHON_LONG_LESSONS],
  ['promptPython', 'promptPythonLongLessons.ts', PROMPT_PYTHON_LONG_LESSONS],
  ['cyberPython', 'cyberPythonLongLessons.ts', CYBER_PYTHON_LONG_LESSONS],
  ['trainPython', 'trainPythonLongLessons.ts', TRAIN_PYTHON_LONG_LESSONS],
  ['vectorPython', 'vectorPythonLongLessons.ts', VECTOR_PYTHON_LONG_LESSONS],
  ['safetyPython', 'safetyPythonLongLessons.ts', SAFETY_PYTHON_LONG_LESSONS],
  ['nodeWeb', 'nodeWebLongLessons.ts', NODE_WEB_LONG_LESSONS],
  ['devopsWeb', 'devopsWebLongLessons.ts', DEVOPS_WEB_LONG_LESSONS],
  ['cloudWeb', 'cloudWebLongLessons.ts', CLOUD_WEB_LONG_LESSONS],
  ['designWeb', 'designWebLongLessons.ts', DESIGN_WEB_LONG_LESSONS],
  ['dsaWeb', 'dsaWebLongLessons.ts', DSA_WEB_LONG_LESSONS],
  ['distributedWeb', 'distributedWebLongLessons.ts', DISTRIBUTED_WEB_LONG_LESSONS],
  ['cyberWeb', 'cyberWebLongLessons.ts', CYBER_WEB_LONG_LESSONS],
  ['aiWeb', 'aiWebLongLessons.ts', AI_WEB_LONG_LESSONS],
  ['sreWeb', 'sreWebLongLessons.ts', SRE_WEB_LONG_LESSONS],
  ['streamWeb', 'streamWebLongLessons.ts', STREAM_WEB_LONG_LESSONS],
  ['aiDeployWeb', 'aiDeployWebLongLessons.ts', AI_DEPLOY_WEB_LONG_LESSONS],
  ['compFund', 'compFundLongLessons.ts', COMP_FUND_LONG_LESSONS],
  ['gitVcs', 'gitVcsLongLessons.ts', GIT_VCS_LONG_LESSONS],
  ['iotEmb', 'iotEmbLongLessons.ts', IOT_EMB_LONG_LESSONS],
  ['quantSystems', 'quantSystemsLongLessons.ts', QUANT_SYSTEMS_LONG_LESSONS],
  ['excelViz', 'excelVizLongLessons.ts', EXCEL_VIZ_LONG_LESSONS],
  ['blockchain', 'blockchainLongLessons.ts', BLOCKCHAIN_LONG_LESSONS],
  ['mobile', 'mobileLongLessons.ts', MOBILE_LONG_LESSONS],
  ['javaBasics', 'javaBasicsLongLessons.ts', JAVA_BASICS_LONG_LESSONS],
  ['softSkills', 'softSkillsLongLessons.ts', SOFT_SKILLS_LONG_LESSONS],
  ['g3d', 'g3dLongLessons.ts', G3D_LONG_LESSONS],
  ['fullstackJs', 'fullstackJsLongLessons.ts', FULLSTACK_JS_LONG_LESSONS],
  ['iotEdge', 'iotEdgeLongLessons.ts', IOT_EDGE_LONG_LESSONS],
  ['iotSec', 'iotSecLongLessons.ts', IOT_SEC_LONG_LESSONS],
  ['iotNet', 'iotNetLongLessons.ts', IOT_NET_LONG_LESSONS],
  ['bcomAna', 'bcomAnaLongLessons.ts', BCOM_ANA_LONG_LESSONS],
  ['bcomOps', 'bcomOpsLongLessons.ts', BCOM_OPS_LONG_LESSONS],
  ['bcomAit', 'bcomAitLongLessons.ts', BCOM_AIT_LONG_LESSONS],
  ['bcomFinance', 'bcomFinanceLongLessons.ts', BCOM_FINANCE_LONG_LESSONS],
  ['bcomAccounting', 'bcomAccountingLongLessons.ts', BCOM_ACCOUNTING_LONG_LESSONS],
  ['bcomScrm', 'bcomScrmLongLessons.ts', BCOM_SCRM_LONG_LESSONS],
  ['bcomEnt', 'bcomEntLongLessons.ts', BCOM_ENT_LONG_LESSONS],
  ['bcomEcom', 'bcomEcomLongLessons.ts', BCOM_ECOM_LONG_LESSONS],
  ['bcomDmkt', 'bcomDmktLongLessons.ts', BCOM_DMKT_LONG_LESSONS],
  ['bcomBan', 'bcomBanLongLessons.ts', BCOM_BAN_LONG_LESSONS],
  ['bcomLaw', 'bcomLawLongLessons.ts', BCOM_LAW_LONG_LESSONS],
  ['bcomTax', 'bcomTaxLongLessons.ts', BCOM_TAX_LONG_LESSONS],
  ['bcomAud', 'bcomAudLongLessons.ts', BCOM_AUD_LONG_LESSONS],
  ['bcomMkt', 'bcomMktLongLessons.ts', BCOM_MKT_LONG_LESSONS],
];

let totalDays = 0;
let totalParts = 0;
let totalWords = 0;
let lowSayDays = 0;
let answerIndexOnlyParts = 0;
let missingCheckParts = 0;
let missingExampleParts = 0;
let missingCodeParts = 0;
let missingOutputParts = 0;

for (const [course, file, lessons] of ALL_LONG_LESSON_MODULES) {
  for (const lesson of lessons) {
    totalDays++;
    let daySayCount = 0;
    const parts = Array.isArray(lesson.parts) ? lesson.parts : [];
    for (const part of parts) {
      totalParts++;
      const sayArr = Array.isArray(part.say) ? part.say : (typeof part.say === 'string' ? [part.say] : []);
      daySayCount += sayArr.length;
      const text = [
        part.title || '',
        ...sayArr,
        part.example || '',
        part.code || '',
        part.output || '',
        part.tryIt || '',
        part.check?.question || '',
        ...(part.check?.options || []),
        part.check?.why || part.check?.explanation || ''
      ].join(' ');
      totalWords += text.split(/\s+/).filter(Boolean).length;

      if (!part.example) missingExampleParts++;
      if (!part.code && !part.rawCode) missingCodeParts++;
      if (part.output === undefined) missingOutputParts++;
      if (!part.check || !Array.isArray(part.check.options) || part.check.options.length < 2) {
        missingCheckParts++;
      } else if (part.check.answer === undefined && part.check.answerIndex !== undefined) {
        answerIndexOnlyParts++;
      }
    }
    if (daySayCount < 20) {
      lowSayDays++;
    }
  }
}

console.log(JSON.stringify({
  modules: ALL_LONG_LESSON_MODULES.length,
  totalDays,
  totalParts,
  totalWords,
  lowSayDays,
  answerIndexOnlyParts,
  missingCheckParts,
  missingExampleParts,
  missingCodeParts,
  missingOutputParts
}, null, 2));
