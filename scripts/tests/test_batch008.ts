// scripts/test_batch008.ts
// Invariant & Technical Audit Test Suite for PinIT Batch 008 (Days 36–40: Month 2 Culmination)

import {
  BATCH_008_MANIFEST,
  DAY_36_MANIFEST,
  DAY_37_MANIFEST,
  DAY_38_MANIFEST,
  DAY_39_MANIFEST,
  DAY_40_MANIFEST,
  DAY_40_ASSESSMENT,
  COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
} from '../src/lib/curriculum/pythonFullStack/batch008';
import {
  BATCH_001_MANIFEST,
  BATCH_002_MANIFEST,
  BATCH_003_MANIFEST,
  BATCH_004_MANIFEST,
  BATCH_005_MANIFEST,
  BATCH_006_MANIFEST,
  BATCH_007_MANIFEST,
} from '../src/lib/curriculum';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';
import { AssessmentEngine } from '../src/lib/curriculum/assessmentEngine';
import { EvidenceLedger } from '../src/lib/curriculum/evidenceLedger';
import { ProgressEngine } from '../src/lib/curriculum/progressEngine';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

async function runBatch008Tests() {
  console.log('\n========================================================================');
  console.log('📦 RUNNING PINIT BATCH 008 (DAYS 36–40) TECHNICAL AUDIT TEST SUITE');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_008_MANIFEST.batchCode === 'P1-M2-W8-BATCH008', 'Batch code is P1-M2-W8-BATCH008');
  assert(BATCH_008_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 36–40)');

  let manifestValid = true;
  try {
    ContentValidator.validateBatchManifest(BATCH_008_MANIFEST);
  } catch (e) {
    manifestValid = false;
  }
  assert(manifestValid, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(DAY_36_MANIFEST.dayNumber === 1 && DAY_36_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 36 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_37_MANIFEST.dayNumber === 2 && DAY_37_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 37 is Day 2 of batch with APPLY intent');
  assert(DAY_38_MANIFEST.dayNumber === 3 && DAY_38_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 38 is Day 3 of batch with BUILD intent');
  assert(DAY_39_MANIFEST.dayNumber === 4 && DAY_39_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 39 is Day 4 of batch with DEBUG intent');
  assert(DAY_40_MANIFEST.dayNumber === 5 && DAY_40_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 40 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');
  const allBlocks = BATCH_008_MANIFEST.days.flatMap(d => d.blocks);
  assert(allBlocks.length >= 18, `Batch 008 contains ${allBlocks.length} comprehensive content blocks across 5 days (Found: ${allBlocks.length})`);

  // Day 36: Custom Exceptions
  const d36Theory = DAY_36_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d36Theory.mentalModel.includes('Business Errors'), 'Day 36 teaches custom exceptions communicating domain business failures');
  assert(d36Theory.whatItIs.includes('subclasses Python\'s built-in `Exception`'), 'Day 36 teaches deriving custom exceptions from Exception');
  assert(d36Theory.commonMistakes.some((m: string) => m.includes('except: pass') || m.includes('except Exception: pass')), 'Day 36 warns against blanket exception masking');

  // Day 37: Data Model Dunders
  const d37Theory = DAY_37_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d37Theory.mentalModel.includes('__str__') && d37Theory.mentalModel.includes('__repr__') && d37Theory.mentalModel.includes('__eq__'), 'Day 37 teaches __str__, __repr__, and __eq__');
  assert(d37Theory.commonMisconceptions.some((m: string) => m.toLowerCase().includes('unhashable')), 'Day 37 explicitly warns that defining __eq__ without __hash__ makes instances unhashable');

  // Day 38: Multi-Module Architecture & Imports
  const d38Theory = DAY_38_MANIFEST.blocks.find(b => b.type === 'THEORY') as any;
  assert(d38Theory.mentalModel.includes('Relative imports') && d38Theory.mentalModel.includes('absolute imports'), 'Day 38 teaches import contexts (package vs entry point)');
  assert(!d38Theory.whatItIs.includes('copy-paste'), 'Day 38 avoids naive copy-paste import analogies');

  // Day 39: Integration Debugging Challenges
  const d39DebuggingBlocks = DAY_39_MANIFEST.blocks.filter(b => b.type === 'DEBUGGING_CHALLENGE') as any[];
  assert(d39DebuggingBlocks.length === 3, 'Day 39 contains 3 realistic integration debugging challenges');
  assert(d39DebuggingBlocks[0].problemDescription.toLowerCase().includes('circular import'), 'Debugging Challenge 1 diagnoses circular import / partially initialized module');
  assert(!d39DebuggingBlocks[0].problemDescription.toLowerCase().includes('deadlock'), 'Debugging Challenge 1 avoids misleading "deadlock" terminology');
  assert(d39DebuggingBlocks[1].problemDescription.toLowerCase().includes('except exception: pass'), 'Debugging Challenge 2 diagnoses silent failure masking');
  assert(d39DebuggingBlocks[2].problemDescription.toLowerCase().includes('mutable'), 'Debugging Challenge 3 diagnoses mutable state equality desynchronization');

  // ── GROUP 3: Day 40 Independent Assessment Invariants & Rubric ──
  console.log('\n── GROUP 3: Day 40 Independent Assessment Invariants & Rubric ──');
  let asmValid = true;
  try {
    AssessmentValidator.validateAssessment(DAY_40_ASSESSMENT);
  } catch (e) {
    asmValid = false;
  }
  assert(asmValid, 'AssessmentValidator.validateAssessment() passes for Day 40 Assessment');

  const rubricSum = DAY_40_ASSESSMENT.items[0].rubricDimensions?.reduce((acc, r) => acc + r.weight, 0) || 0;
  assert(Math.abs(rubricSum - 1.0) < 0.0001, `Day 40 rubric weights sum exactly to 1.0 (Found: ${rubricSum})`);
  assert(DAY_40_ASSESSMENT.mode === 'FORMATIVE' || DAY_40_ASSESSMENT.mode === 'PRACTICE', 'Day 40 is explicitly marked mode: FORMATIVE/PRACTICE (Formative only, not Certification)');

  // Register in Assessment Engine
  const assessmentEngine = new AssessmentEngine();
  assessmentEngine.registerAssessment(DAY_40_ASSESSMENT);
  const sanitized = assessmentEngine.getSanitizedAssessment(DAY_40_ASSESSMENT.id);
  assert(sanitized !== undefined, 'Sanitized Day 40 assessment generated');
  assert((sanitized?.items[0] as any).privateTests === undefined, 'Sanitized payload DOES NOT leak privateTests to client');
  assert((sanitized?.items[0] as any).integrityTests === undefined, 'Sanitized payload DOES NOT leak integrityTests to client');
  assert(sanitized?.items[0].visibleTests?.length === 2, 'Sanitized payload includes visible test cases');

  // ── GROUP 4: Multi-Design Grading Validation ──
  console.log('\n── GROUP 4: Multi-Design Grading Validation ──');
  
  // Design A: Composition & Object-Oriented Billing Engine
  const studentSolutionDesignA = `
class BillingError(Exception):
    pass

class SubscriptionNotFoundError(BillingError):
    pass

class CustomerAccount:
    def __init__(self, account_id, initial_balance):
        self.account_id = str(account_id)
        self.balance = float(initial_balance)
        self.total_billed = 0.0

    def deduct(self, amount):
        if amount > self.balance:
            return False
        self.balance = round(self.balance - amount, 2)
        self.total_billed = round(self.total_billed + amount, 2)
        return True

    def __str__(self):
        return f"Account({self.account_id}, balance={self.balance})"

    def __repr__(self):
        return f"CustomerAccount(account_id='{self.account_id}', balance={self.balance})"

    def __eq__(self, other):
        if not isinstance(other, CustomerAccount):
            return NotImplemented
        return self.account_id == other.account_id


class Subscription:
    def __init__(self, sub_id, account_id, tier, monthly_rate):
        self.sub_id = str(sub_id)
        self.account_id = str(account_id)
        self.tier = str(tier).upper()
        self.monthly_rate = float(monthly_rate)
        self.discount_percent = 0.0
        self.is_active = True

    def calculate_effective_rate(self):
        discounted = self.monthly_rate * (1.0 - self.discount_percent / 100.0)
        if self.tier == "PRO":
            return round(discounted + 10.0, 2)
        elif self.tier == "ENTERPRISE":
            return round(discounted + 30.0, 2)
        else: # STANDARD
            return round(max(5.0, discounted), 2)


class BillingService:
    def __init__(self):
        self.accounts = {}
        self.subscriptions = {}
        self.successful_billings = 0
        self.failed_billings = 0
        self.rejected_ops = 0
        self.total_revenue = 0.0

    def register_account(self, account_id, balance):
        if account_id in self.accounts or balance < 0.0:
            self.rejected_ops += 1
            return False
        self.accounts[account_id] = CustomerAccount(account_id, balance)
        return True

    def create_subscription(self, sub_id, account_id, tier, rate):
        if (sub_id in self.subscriptions or 
            account_id not in self.accounts or 
            tier not in ("STANDARD", "PRO", "ENTERPRISE") or 
            rate < 0.0):
            self.rejected_ops += 1
            return False
        self.subscriptions[sub_id] = Subscription(sub_id, account_id, tier, rate)
        return True

    def apply_discount(self, sub_id, discount):
        if sub_id not in self.subscriptions or discount < 0.0 or discount > 100.0:
            self.rejected_ops += 1
            return False
        self.subscriptions[sub_id].discount_percent = float(discount)
        return True

    def bill_cycle(self, sub_id):
        if sub_id not in self.subscriptions:
            self.rejected_ops += 1
            return False
        sub = self.subscriptions[sub_id]
        if not sub.is_active:
            self.rejected_ops += 1
            return False
        account = self.accounts[sub.account_id]
        cost = sub.calculate_effective_rate()
        if account.deduct(cost):
            self.successful_billings += 1
            self.total_revenue = round(self.total_revenue + cost, 2)
            return True
        else:
            self.failed_billings += 1
            return False

    def cancel_subscription(self, sub_id):
        if sub_id not in self.subscriptions:
            self.rejected_ops += 1
            return False
        sub = self.subscriptions[sub_id]
        if not sub.is_active:
            self.rejected_ops += 1
            return False
        sub.is_active = False
        return True

    def generate_summary(self):
        active_count = sum(1 for s in self.subscriptions.values() if s.is_active)
        primary_id = "NONE"
        if self.accounts:
            # Find account with highest total_billed, tiebreak by first registered
            highest = -1.0
            for aid, acc in self.accounts.items():
                if acc.total_billed > highest:
                    highest = acc.total_billed
                    primary_id = aid

        return (
            f"REGISTERED_ACCOUNTS_COUNT: {len(self.accounts)}\\n"
            f"ACTIVE_SUBSCRIPTIONS_COUNT: {active_count}\\n"
            f"TOTAL_REVENUE_BILLED: {self.total_revenue:.2f}\\n"
            f"SUCCESSFUL_BILLINGS_COUNT: {self.successful_billings}\\n"
            f"FAILED_BILLINGS_COUNT: {self.failed_billings}\\n"
            f"REJECTED_OPERATIONS: {self.rejected_ops}\\n"
            f"PRIMARY_ACCOUNT_ID: {primary_id}"
        )


def process_billing_operations(operations):
    service = BillingService()
    if not operations:
        return service.generate_summary()

    for op in operations:
        action = op.get("action")
        if action == "REGISTER_ACCOUNT":
            service.register_account(op.get("account_id"), op.get("initial_balance", 0.0))
        elif action == "CREATE_SUBSCRIPTION":
            service.create_subscription(op.get("sub_id"), op.get("account_id"), op.get("tier"), op.get("monthly_rate", 0.0))
        elif action == "APPLY_DISCOUNT":
            service.apply_discount(op.get("sub_id"), op.get("discount_percent", 0.0))
        elif action == "BILL_CYCLE":
            service.bill_cycle(op.get("sub_id"))
        elif action == "CANCEL_SUBSCRIPTION":
            service.cancel_subscription(op.get("sub_id"))
        elif action == "SUMMARY":
            pass
        else:
            service.rejected_ops += 1

    return service.generate_summary()
`;

  const attemptA = assessmentEngine.createAttempt('student-001', DAY_40_ASSESSMENT.id, DAY_40_ASSESSMENT.version);
  const evalResultA = await assessmentEngine.submitAndEvaluateAttempt(attemptA.id, {
    'item-bill-01': studentSolutionDesignA,
  });

  assert(evalResultA.passed === true, 'Design A (Layered OOP BillingService) passes all tests');

  // Design B: Alternative naming & strategy-based design
  const studentSolutionDesignB = `
class BillingException(Exception):
    pass

class Subscriber:
    def __init__(self, uid, starting_funds):
        self.uid = str(uid)
        self.funds = float(starting_funds)
        self.billed_total = 0.0

    def charge(self, amt):
        if amt > self.funds:
            return False
        self.funds = round(self.funds - amt, 2)
        self.billed_total = round(self.billed_total + amt, 2)
        return True

    def __str__(self):
        return f"Subscriber[{self.uid}] Funds: {self.funds}"

    def __repr__(self):
        return f"Subscriber(uid='{self.uid}', funds={self.funds})"

    def __eq__(self, other):
        if not isinstance(other, Subscriber):
            return NotImplemented
        return self.uid == other.uid


class PlanTier:
    def __init__(self, plan_id, user_id, tier_name, base_price):
        self.plan_id = str(plan_id)
        self.user_id = str(user_id)
        self.tier_name = str(tier_name).upper()
        self.base_price = float(base_price)
        self.rebate = 0.0
        self.active = True

    def get_cycle_charge(self):
        discounted = self.base_price * (1.0 - self.rebate / 100.0)
        if self.tier_name == "PRO":
            return round(discounted + 10.0, 2)
        elif self.tier_name == "ENTERPRISE":
            return round(discounted + 30.0, 2)
        else:
            return round(max(5.0, discounted), 2)


class SubscriptionManager:
    def __init__(self):
        self.subscribers = {}
        self.plans = {}
        self.order_ids = []
        self.successful = 0
        self.failed = 0
        self.invalid_count = 0
        self.gross_revenue = 0.0

    def add_user(self, uid, funds):
        if uid in self.subscribers or funds < 0.0:
            self.invalid_count += 1
            return False
        self.subscribers[uid] = Subscriber(uid, funds)
        self.order_ids.append(uid)
        return True

    def subscribe(self, pid, uid, tier, price):
        if pid in self.plans or uid not in self.subscribers or tier not in ("STANDARD", "PRO", "ENTERPRISE") or price < 0.0:
            self.invalid_count += 1
            return False
        self.plans[pid] = PlanTier(pid, uid, tier, price)
        return True

    def apply_rebate(self, pid, pct):
        if pid not in self.plans or pct < 0.0 or pct > 100.0:
            self.invalid_count += 1
            return False
        self.plans[pid].rebate = float(pct)
        return True

    def run_cycle(self, pid):
        if pid not in self.plans:
            self.invalid_count += 1
            return False
        p = self.plans[pid]
        if not p.active:
            self.invalid_count += 1
            return False
        sub = self.subscribers[p.user_id]
        charge_amt = p.get_cycle_charge()
        if sub.charge(charge_amt):
            self.successful += 1
            self.gross_revenue = round(self.gross_revenue + charge_amt, 2)
            return True
        else:
            self.failed += 1
            return False

    def terminate_plan(self, pid):
        if pid not in self.plans:
            self.invalid_count += 1
            return False
        p = self.plans[pid]
        if not p.active:
            self.invalid_count += 1
            return False
        p.active = False
        return True

    def get_report(self):
        active_plans = sum(1 for p in self.plans.values() if p.active)
        top_user = "NONE"
        if self.subscribers:
            max_billed = -1.0
            for uid in self.order_ids:
                if self.subscribers[uid].billed_total > max_billed:
                    max_billed = self.subscribers[uid].billed_total
                    top_user = uid

        return (
            f"REGISTERED_ACCOUNTS_COUNT: {len(self.subscribers)}\\n"
            f"ACTIVE_SUBSCRIPTIONS_COUNT: {active_plans}\\n"
            f"TOTAL_REVENUE_BILLED: {self.gross_revenue:.2f}\\n"
            f"SUCCESSFUL_BILLINGS_COUNT: {self.successful}\\n"
            f"FAILED_BILLINGS_COUNT: {self.failed}\\n"
            f"REJECTED_OPERATIONS: {self.invalid_count}\\n"
            f"PRIMARY_ACCOUNT_ID: {top_user}"
        )


def process_billing_operations(operations):
    mgr = SubscriptionManager()
    if not operations:
        return mgr.get_report()

    for op in operations:
        act = op.get("action")
        if act == "REGISTER_ACCOUNT":
            mgr.add_user(op.get("account_id"), op.get("initial_balance", 0.0))
        elif act == "CREATE_SUBSCRIPTION":
            mgr.subscribe(op.get("sub_id"), op.get("account_id"), op.get("tier"), op.get("monthly_rate", 0.0))
        elif act == "APPLY_DISCOUNT":
            mgr.apply_rebate(op.get("sub_id"), op.get("discount_percent", 0.0))
        elif act == "BILL_CYCLE":
            mgr.run_cycle(op.get("sub_id"))
        elif act == "CANCEL_SUBSCRIPTION":
            mgr.terminate_plan(op.get("sub_id"))
        elif act == "SUMMARY":
            pass
        else:
            mgr.invalid_count += 1

    return mgr.get_report()
`;

  const attemptB = assessmentEngine.createAttempt('student-002', DAY_40_ASSESSMENT.id, DAY_40_ASSESSMENT.version);
  const evalResultB = await assessmentEngine.submitAndEvaluateAttempt(attemptB.id, {
    'item-bill-01': studentSolutionDesignB,
  });

  assert(evalResultB.passed === true, 'Design B (Alternative naming & strategy design) passes grading without rigid teacher class names');

  // Record Formative Evidence Ledger
  const ledger = new EvidenceLedger();
  const evidenceRecord = ledger.recordAssessmentEvidence({
    studentId: 'student-001',
    courseId: 'course-python-fullstack',
    phaseId: 'phase-pfs-01',
    monthId: 'month-pfs-02',
    weekId: 'week-pfs-m2-w8',
    packetId: BATCH_008_MANIFEST.batchId,
    dayId: 'day-008-d40',
    competencyId: COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
    evidenceType: 'PRACTICAL_RESULT',
    sourceType: 'FORMATIVE',
    assessment: DAY_40_ASSESSMENT,
    attempt: attemptA,
    result: evalResultA,
    provenance: {
      evaluatorType: 'DETERMINISTIC',
      verificationMethod: 'AUTOMATED_DETERMINISTIC',
    },
  });

  assert(evidenceRecord.sourceType === 'FORMATIVE', 'Evidence correctly labeled FORMATIVE (Not Certification)');
  assert(evidenceRecord.competencyId === COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE, 'Evidence bound to competency COMP-PFS-M2-008');

  // ── GROUP 5: Semantic Prerequisite Invariant Tests & Prompt Audit ──
  console.log('\n── GROUP 5: Semantic Prerequisite Invariant Tests & Prompt Audit ──');
  const batch008Src = fs.readFileSync(path.join(process.cwd(), 'src/lib/curriculum/pythonFullStack/batch008.ts'), 'utf-8');

  // Forbidden premature concepts
  assert(!batch008Src.includes('@property'), 'AST Scan: Zero @property decorators in Batch 008');
  assert(!batch008Src.includes('@dataclass'), 'AST Scan: Zero @dataclass decorators in Batch 008');
  assert(!batch008Src.includes('@classmethod'), 'AST Scan: Zero @classmethod decorators in Batch 008');
  assert(!batch008Src.includes('@staticmethod'), 'AST Scan: Zero @staticmethod decorators in Batch 008');
  assert(!batch008Src.includes('abc.ABC') && !batch008Src.includes('@abstractmethod'), 'AST Scan: Zero ABCs in Batch 008');
  assert(!batch008Src.includes('typing.Protocol'), 'AST Scan: Zero Protocols in Batch 008');
  assert(!batch008Src.includes('__getattr__') && !batch008Src.includes('__call__') && !batch008Src.includes('__enter__'), 'AST Scan: Zero advanced dunders in Batch 008');
  assert(!batch008Src.includes('pyproject.toml') && !batch008Src.includes('setup.py'), 'AST Scan: Zero packaging files in Batch 008');

  const d40Transfer = DAY_40_MANIFEST.blocks[0] as any;
  assert(!d40Transfer.task.includes('->') && !d40Transfer.task.includes(': str') && !d40Transfer.task.includes(': int'), 'Day 40 Transfer task contains ZERO type annotations');
  assert(!d40Transfer.task.includes('must name your class CustomerAccount'), 'Day 40 Transfer task does NOT prescribe rigid class names');
  assert(!DAY_40_ASSESSMENT.title.toLowerCase().includes('enterprise'), 'Day 40 Assessment title is "Subscription Billing Domain Engine" (No artificial "Enterprise" label)');

  // ── GROUP 6: Programmatic Progress Model Invariant Verification ──
  console.log('\n── GROUP 6: Programmatic Progress Model Invariant Verification ──');
  const publishedBatches = [
    BATCH_001_MANIFEST,
    BATCH_002_MANIFEST,
    BATCH_003_MANIFEST,
    BATCH_004_MANIFEST,
    BATCH_005_MANIFEST,
    BATCH_006_MANIFEST,
    BATCH_007_MANIFEST,
    BATCH_008_MANIFEST,
  ];

  const progressReport = ProgressEngine.computeProgress(publishedBatches);
  assert(progressReport.publishedBatchesCount === 8, 'Progress Engine reports exactly 8 published batches');
  assert(progressReport.publishedLearningDaysCount === 40, 'Progress Engine computes exactly 40 published learning days (Month 2 Completed)');
  assert(progressReport.semester1PlannedDays === 120, 'Semester 1 planned days dynamically computed as 120 (6 months * 20 days)');
  assert(progressReport.year1PlannedDays === 240, 'Year 1 planned days dynamically computed as 240 (12 months * 20 days)');
  assert(progressReport.totalPlannedDays === 480, 'Total 24-month program planned days dynamically computed as 480 (24 months * 20 days)');
  assert(progressReport.semester1ProgressPercent === 33.33, `Semester 1 progress calculated as 40 / 120 = 33.33% (Found: ${progressReport.semester1ProgressPercent}%)`);
  assert(progressReport.year1ProgressPercent === 16.67, `Year 1 progress calculated as 40 / 240 = 16.67% (Found: ${progressReport.year1ProgressPercent}%)`);
  assert(progressReport.totalProgramProgressPercent === 8.33, `Total program progress calculated as 40 / 480 = 8.33% (Found: ${progressReport.totalProgramProgressPercent}%)`);

  console.log('\n========================================================================');
  console.log('🏁 BATCH 008 TEST SUITE COMPLETE: All Invariants Verified Cleanly');
  console.log('========================================================================\n');
}

runBatch008Tests().catch((err) => {
  console.error('[FATAL ERROR IN BATCH 008 TEST SUITE]', err);
  process.exit(1);
});
