// scripts/test_day46_snippets.ts
import assert from 'node:assert/strict';

console.log("Testing Day 46 Snippets...");

// Snippet 1: Terraform Directed Acyclic Graph (DAG) Dependency Evaluator
interface DagNode {
  id: string;
  type: string;
  dependencies: string[];
}

class TerraformDagEvaluator {
  private nodes: Map<string, DagNode> = new Map();

  addNode(node: DagNode) {
    this.nodes.set(node.id, node);
  }

  resolveExecutionOrder(): { order: string[]; hasCycle: boolean } {
    const inDegree: Map<string, number> = new Map();
    const adjList: Map<string, string[]> = new Map();

    for (const [id] of this.nodes) {
      inDegree.set(id, 0);
      adjList.set(id, []);
    }

    for (const [id, node] of this.nodes) {
      for (const dep of node.dependencies) {
        if (adjList.has(dep)) {
          adjList.get(dep)!.push(id);
          inDegree.set(id, (inDegree.get(id) || 0) + 1);
        }
      }
    }

    const queue: string[] = [];
    for (const [id, deg] of inDegree) {
      if (deg === 0) queue.push(id);
    }

    const order: string[] = [];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr);
      for (const neighbor of adjList.get(curr) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    const hasCycle = order.length !== this.nodes.size;
    return { order, hasCycle };
  }
}

const dag = new TerraformDagEvaluator();
dag.addNode({ id: 'aws_vpc.main', type: 'resource', dependencies: [] });
dag.addNode({ id: 'aws_subnet.public', type: 'resource', dependencies: ['aws_vpc.main'] });
dag.addNode({ id: 'aws_security_group.web', type: 'resource', dependencies: ['aws_vpc.main'] });
dag.addNode({ id: 'aws_instance.app', type: 'resource', dependencies: ['aws_subnet.public', 'aws_security_group.web'] });

const evalDag = dag.resolveExecutionOrder();
const s1_out = `TERRAFORM_DAG_EVAL: TotalNodes=${evalDag.order.length} RootNode=${evalDag.order[0]} TerminalNode=${evalDag.order[evalDag.order.length - 1]} HasCycle=${evalDag.hasCycle}`;
console.log("Snippet 1 Output:\n", s1_out);
assert.equal(s1_out, 'TERRAFORM_DAG_EVAL: TotalNodes=4 RootNode=aws_vpc.main TerminalNode=aws_instance.app HasCycle=false');

// Snippet 2: Terragrunt DRY Multi-Environment Configuration Resolver
interface TerragruntEnvConfig {
  environment: 'dev' | 'stage' | 'prod';
  moduleSource: string;
  instanceType: string;
  minReplicas: number;
}

class TerragruntResolver {
  private baseModuleUrl: string;

  constructor(baseModuleUrl: string) {
    this.baseModuleUrl = baseModuleUrl;
  }

  resolveEnvironment(env: 'dev' | 'stage' | 'prod', overrides: Partial<TerragruntEnvConfig>): TerragruntEnvConfig {
    const defaults: Record<string, { instanceType: string; minReplicas: number }> = {
      dev: { instanceType: 't3.micro', minReplicas: 1 },
      stage: { instanceType: 't3.medium', minReplicas: 2 },
      prod: { instanceType: 'm5.large', minReplicas: 4 },
    };

    return {
      environment: env,
      moduleSource: `${this.baseModuleUrl}//modules/eks-cluster?ref=v2.4.0`,
      instanceType: overrides.instanceType || defaults[env].instanceType,
      minReplicas: overrides.minReplicas || defaults[env].minReplicas,
    };
  }
}

const tg = new TerragruntResolver('git::https://github.com/enterprise/terraform-aws-architecture.git');
const devConfig = tg.resolveEnvironment('dev', {});
const prodConfig = tg.resolveEnvironment('prod', {});

const s2_out = `TERRAGRUNT_DRY_RESOLVER: DevCluster=${devConfig.instanceType}x${devConfig.minReplicas} ProdCluster=${prodConfig.instanceType}x${prodConfig.minReplicas} CommonModuleRef=v2.4.0`;
console.log("Snippet 2 Output:\n", s2_out);
assert.equal(s2_out, 'TERRAGRUNT_DRY_RESOLVER: DevCluster=t3.microx1 ProdCluster=m5.largex4 CommonModuleRef=v2.4.0');

// Snippet 3: Zero-Downtime State Refactoring & Declarative Moved Blocks
interface ResourceState {
  address: string;
  id: string;
  attributes: Record<string, string>;
}

interface MovedBlock {
  from: string;
  to: string;
}

class TerraformStateRefactorEngine {
  private state: Map<string, ResourceState> = new Map();

  registerResource(res: ResourceState) {
    this.state.set(res.address, res);
  }

  planRefactor(newAddress: string, movedBlocks: MovedBlock[]): { planAction: 'DESTROY_AND_CREATE' | 'STATE_RENAME'; resourcePreserved: boolean } {
    const movedRule = movedBlocks.find(m => m.to === newAddress);

    if (movedRule && this.state.has(movedRule.from)) {
      const existing = this.state.get(movedRule.from)!;
      this.state.delete(movedRule.from);
      existing.address = newAddress;
      this.state.set(newAddress, existing);
      return { planAction: 'STATE_RENAME', resourcePreserved: true };
    }

    return { planAction: 'DESTROY_AND_CREATE', resourcePreserved: false };
  }
}

const stateEngine = new TerraformStateRefactorEngine();
stateEngine.registerResource({
  address: 'aws_security_group.web_sg',
  id: 'sg-0123456789abcdef0',
  attributes: { vpc_id: 'vpc-9988' },
});

// Refactoring without moved block
const dangerousPlan = new TerraformStateRefactorEngine();
dangerousPlan.registerResource({ address: 'aws_security_group.web_sg', id: 'sg-0123456789abcdef0', attributes: {} });
const planWithoutMoved = dangerousPlan.planRefactor('aws_security_group.frontend_sg', []);

// Refactoring with declarative moved block
const safePlan = stateEngine.planRefactor('aws_security_group.frontend_sg', [
  { from: 'aws_security_group.web_sg', to: 'aws_security_group.frontend_sg' },
]);

const s3_out = `TERRAFORM_MOVED_EVAL: UnmappedAction=${planWithoutMoved.planAction} MappedAction=${safePlan.planAction} ResourcePreserved=${safePlan.resourcePreserved}`;
console.log("Snippet 3 Output:\n", s3_out);
assert.equal(s3_out, 'TERRAFORM_MOVED_EVAL: UnmappedAction=DESTROY_AND_CREATE MappedAction=STATE_RENAME ResourcePreserved=true');

// Snippet 4: S3 Remote Backend, DynamoDB State Locking & Deadlock Recovery
interface StateLockRecord {
  lockId: string;
  operation: string;
  who: string;
  created: string;
}

class DynamoDbStateLockManager {
  private activeLock: StateLockRecord | null = null;

  acquireLock(record: StateLockRecord): { acquired: boolean; currentLock: StateLockRecord | null } {
    if (this.activeLock !== null) {
      return { acquired: false, currentLock: this.activeLock };
    }
    this.activeLock = record;
    return { acquired: true, currentLock: record };
  }

  forceUnlock(lockId: string): { unlocked: boolean; message: string } {
    if (!this.activeLock || this.activeLock.lockId !== lockId) {
      return { unlocked: false, message: 'LOCK_NOT_FOUND' };
    }
    this.activeLock = null;
    return { unlocked: true, message: 'LOCK_FORCE_RELEASED' };
  }
}

const lockManager = new DynamoDbStateLockManager();
const cicdLock = lockManager.acquireLock({
  lockId: 'd7a8e239-014f-4d02-869f-354cfbf90123',
  operation: 'OperationTypeApply',
  who: 'github-runner-prod-04@ip-10-0-14-22',
  created: '2026-10-24T16:00:00Z',
});

// Concurrent runner attempts lock
const concurrentAttempt = lockManager.acquireLock({
  lockId: 'e9b11048-9999-4444-1111-222233334444',
  operation: 'OperationTypeApply',
  who: 'developer-laptop@192.168.1.5',
  created: '2026-10-24T16:02:00Z',
});

// SRE invokes terraform force-unlock
const unlockResult = lockManager.forceUnlock('d7a8e239-014f-4d02-869f-354cfbf90123');

const s4_out = `DYNAMODB_STATE_LOCK: PrimaryAcquired=${cicdLock.acquired} ConcurrentBlocked=${!concurrentAttempt.acquired} ForceUnlocked=${unlockResult.unlocked} Msg=${unlockResult.message}`;
console.log("Snippet 4 Output:\n", s4_out);
assert.equal(s4_out, 'DYNAMODB_STATE_LOCK: PrimaryAcquired=true ConcurrentBlocked=true ForceUnlocked=true Msg=LOCK_FORCE_RELEASED');

// Snippet 5: Masterclass Synthesis: Enterprise IaC GitOps Pipeline Validator
interface IaCGitOpsAudit {
  moduleReusePercent: number;
  unmappedDestructiveRenamesCount: number;
  remoteStateS3KmsEncrypted: boolean;
  dynamoDbLockingActive: boolean;
  opaPolicyEnforcementActive: boolean;
}

class TerraformEnterpriseGovernanceEngine {
  private audit: IaCGitOpsAudit;

  constructor(audit: IaCGitOpsAudit) {
    this.audit = audit;
  }

  evaluatePosture(): string {
    const isCompliant = this.audit.moduleReusePercent >= 90 &&
                        this.audit.unmappedDestructiveRenamesCount === 0 &&
                        this.audit.remoteStateS3KmsEncrypted &&
                        this.audit.dynamoDbLockingActive &&
                        this.audit.opaPolicyEnforcementActive;

    return `TERRAFORM_ENTERPRISE_AUDIT: ModuleReuse=${this.audit.moduleReusePercent}% DestructiveDrifts=${this.audit.unmappedDestructiveRenamesCount} StateLocking=ACTIVE Posture=${isCompliant ? 'TERRAFORM_ENTERPRISE_DRY_PASS' : 'FAIL'}`;
  }
}

const iacGov = new TerraformEnterpriseGovernanceEngine({
  moduleReusePercent: 96.5,
  unmappedDestructiveRenamesCount: 0,
  remoteStateS3KmsEncrypted: true,
  dynamoDbLockingActive: true,
  opaPolicyEnforcementActive: true,
});

const s5_out = iacGov.evaluatePosture();
console.log("Snippet 5 Output:\n", s5_out);
assert.equal(s5_out, 'TERRAFORM_ENTERPRISE_AUDIT: ModuleReuse=96.5% DestructiveDrifts=0 StateLocking=ACTIVE Posture=TERRAFORM_ENTERPRISE_DRY_PASS');

console.log("All 5 Day 46 snippets passed with 100% exact match!");
