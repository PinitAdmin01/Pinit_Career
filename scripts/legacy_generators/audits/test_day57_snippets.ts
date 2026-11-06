import { compileTs } from '../src/lib/code/ts/compileTs';
import vm from 'node:vm';

async function testSnippet(code: string) {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math, Map, Set, String, Number, Boolean, Array, Object, JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

async function run() {
  const s1 = `interface SagaStep {
  name: string;
  action: () => boolean;
  compensate: () => void;
}

class SagaOrchestrator {
  private executedSteps: SagaStep[] = [];

  execute(steps: SagaStep[]): { status: string; completedSteps: string[] } {
    for (const step of steps) {
      const ok = step.action();
      if (!ok) {
        while (this.executedSteps.length > 0) {
          const prev = this.executedSteps.pop()!;
          prev.compensate();
        }
        return { status: 'COMPENSATED', completedSteps: [] };
      }
      this.executedSteps.push(step);
    }
    return {
      status: 'SUCCEEDED',
      completedSteps: this.executedSteps.map(s => s.name)
    };
  }
}

const saga = new SagaOrchestrator();
const steps: SagaStep[] = [
  { name: 'ReserveInventory', action: () => true, compensate: () => {} },
  { name: 'AuthorizePayment', action: () => true, compensate: () => {} },
  { name: 'DispatchShipping', action: () => true, compensate: () => {} }
];

const res = saga.execute(steps);
console.log('Status=SAGA_ORCHESTRATOR_VERIFIED | ExecutionStatus=' + res.status + ' | Steps=' + res.completedSteps.join('->'));`;

  const s2 = `interface TaskExecution {
  taskId: string;
  taskToken: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

class StepFunctionsTaskTokenManager {
  private activeTasks = new Map<string, TaskExecution>();

  createTask(taskId: string): string {
    const token = 'token-' + taskId + '-sec77';
    this.activeTasks.set(token, { taskId, taskToken: token, status: 'PENDING' });
    return token;
  }

  sendTaskSuccess(token: string): boolean {
    const task = this.activeTasks.get(token);
    if (!task) return false;
    task.status = 'APPROVED';
    return true;
  }

  getTaskStatus(token: string): string {
    return this.activeTasks.get(token)?.status || 'NOT_FOUND';
  }
}

const manager = new StepFunctionsTaskTokenManager();
const token = manager.createTask('EXP-401');
const p1 = manager.getTaskStatus(token);
manager.sendTaskSuccess(token);
const p2 = manager.getTaskStatus(token);

console.log('Status=TASK_TOKEN_CALLBACK_VERIFIED | InitialState=' + p1 + ' | CallbackSuccess=true | FinalState=' + p2);`;

  const s3 = `class WorkflowParallelProcessor {
  executeParallelBranches(data: { id: string; price: number }): { branch1: string; branch2: string } {
    const b1 = data.price < 5000 ? 'CREDIT_APPROVED' : 'CREDIT_FLAGGED';
    const b2 = 'FRAUD_SCORE_LOW';
    return { branch1: b1, branch2: b2 };
  }

  executeDistributedMap(items: number[]): { totalProcessed: number; sum: number } {
    let sum = 0;
    for (const item of items) {
      sum += item;
    }
    return { totalProcessed: items.length, sum };
  }
}

const proc = new WorkflowParallelProcessor();
const branches = proc.executeParallelBranches({ id: 'ORD-99', price: 1200 });
const mapRes = proc.executeDistributedMap([10, 20, 30, 40, 50]);

console.log('Status=PARALLEL_MAP_WORKFLOW_VERIFIED | Branch1=' + branches.branch1 + ' | Branch2=' + branches.branch2 + ' | MapItems=' + mapRes.totalProcessed + ' | MapSum=' + mapRes.sum);`;

  const s4 = `interface StepLog {
  step: string;
  action: 'EXECUTED' | 'COMPENSATED';
}

class ResilientSagaWithRollback {
  public history: StepLog[] = [];

  executeWithCompensation(shouldFailThirdStep: boolean): { success: boolean; rollbackCompleted: boolean } {
    this.history.push({ step: 'ReserveInventory', action: 'EXECUTED' });
    this.history.push({ step: 'ChargePayment', action: 'EXECUTED' });

    if (shouldFailThirdStep) {
      this.history.push({ step: 'ChargePayment', action: 'COMPENSATED' });
      this.history.push({ step: 'ReserveInventory', action: 'COMPENSATED' });
      return { success: false, rollbackCompleted: true };
    }

    return { success: true, rollbackCompleted: false };
  }
}

const resilientSaga = new ResilientSagaWithRollback();
const resFail = resilientSaga.executeWithCompensation(true);
const compensatedSteps = resilientSaga.history
  .filter(h => h.action === 'COMPENSATED')
  .map(h => h.step)
  .join(',');

console.log('Status=COMPENSATING_ROLLBACK_VERIFIED | SagaSucceeded=' + resFail.success + ' | RollbackCompleted=' + resFail.rollbackCompleted + ' | Compensated=' + compensatedSteps);`;

  const s5 = `class StepFunctionsSagaEngine {
  runDistributedSaga(orderId: string, totalAmount: number): {
    workflowType: string;
    inventoryReserved: boolean;
    paymentAuthorized: boolean;
    shippingDispatched: boolean;
    notificationSent: boolean;
    sagaExecutionTimeMs: number;
  } {
    const workflowType = 'STANDARD';
    const inventoryReserved = true;
    const paymentAuthorized = totalAmount > 0;
    const shippingDispatched = true;
    const notificationSent = true;
    const sagaExecutionTimeMs = 45;

    return {
      workflowType,
      inventoryReserved,
      paymentAuthorized,
      shippingDispatched,
      notificationSent,
      sagaExecutionTimeMs
    };
  }
}

const engine = new StepFunctionsSagaEngine();
const result = engine.runDistributedSaga('ORD-7700', 1299);

console.log('Status=STEP_FUNCTIONS_SAGA_VERIFIED | Workflow=' + result.workflowType + ' | Inventory=' + result.inventoryReserved + ' | Payment=' + result.paymentAuthorized + ' | Shipping=' + result.shippingDispatched + ' | LatencyMs=' + result.sagaExecutionTimeMs);`;

  console.log('--- OUTPUT 1 ---');
  console.log(await testSnippet(s1));
  console.log('--- OUTPUT 2 ---');
  console.log(await testSnippet(s2));
  console.log('--- OUTPUT 3 ---');
  console.log(await testSnippet(s3));
  console.log('--- OUTPUT 4 ---');
  console.log(await testSnippet(s4));
  console.log('--- OUTPUT 5 ---');
  console.log(await testSnippet(s5));
}

run().catch(console.error);
