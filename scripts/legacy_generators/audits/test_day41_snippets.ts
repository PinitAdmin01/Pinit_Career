import { compileTs } from '../src/lib/code/ts/compileTs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

async function runSnippet(code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

async function main() {
  console.log('Testing Day 41 Snippets...');

  // Snippet 1
  const code1 = `interface AWSAccount {
  accountId: string;
  accountName: string;
  ouPath: string;
  environment: 'CORE' | 'PROD' | 'NON_PROD' | 'SANDBOX';
}

class OrganizationsHierarchy {
  private accounts: AWSAccount[] = [];

  registerAccount(acc: AWSAccount) {
    this.accounts.push(acc);
  }

  getAccountsByOU(ouPrefix: string): AWSAccount[] {
    return this.accounts.filter(a => a.ouPath.startsWith(ouPrefix));
  }
}

const org = new OrganizationsHierarchy();
org.registerAccount({ accountId: '111122223333', accountName: 'sec-log-archive', ouPath: 'Root/Core/Security', environment: 'CORE' });
org.registerAccount({ accountId: '444455556666', accountName: 'ecommerce-prod', ouPath: 'Root/Workloads/Prod', environment: 'PROD' });
org.registerAccount({ accountId: '777788889999', accountName: 'ecommerce-dev', ouPath: 'Root/Workloads/NonProd', environment: 'NON_PROD' });

const prodWorkloads = org.getAccountsByOU('Root/Workloads/Prod');
console.log(\`ORGANIZATIONS_HIERARCHY: TotalAccounts=\${org.getAccountsByOU('Root').length} ProdCount=\${prodWorkloads.length} ProdAccount=\${prodWorkloads[0].accountName}\`);`;
  const out1 = await runSnippet(code1);
  console.log('Snippet 1 Output:\n', out1);
  assert.equal(out1, 'ORGANIZATIONS_HIERARCHY: TotalAccounts=3 ProdCount=1 ProdAccount=ecommerce-prod');

  // Snippet 2
  const code2 = `interface SCPRule {
  effect: 'Allow' | 'Deny';
  actions: string[];
  resources: string[];
}

function evaluateSCPAccess(scpRules: SCPRule[], requestedAction: string): { isAllowed: boolean; reason: string } {
  for (const rule of scpRules) {
    if (rule.effect === 'Deny' && (rule.actions.includes('*') || rule.actions.includes(requestedAction))) {
      return { isAllowed: false, reason: \`EXPLICIT_SCP_DENY on action '\${requestedAction}' overrides all local IAM admin rights\` };
    }
  }

  for (const rule of scpRules) {
    if (rule.effect === 'Allow' && (rule.actions.includes('*') || rule.actions.includes(requestedAction))) {
      return { isAllowed: true, reason: \`ACTION_PERMITTED within SCP boundary\` };
    }
  }

  return { isAllowed: false, reason: \`IMPLICIT_DENY: No matching Allow rule found in SCP hierarchy\` };
}

const scpSuite: SCPRule[] = [
  { effect: 'Allow', actions: ['*'], resources: ['*'] },
  { effect: 'Deny', actions: ['cloudtrail:StopLogging', 'cloudtrail:DeleteTrail'], resources: ['*'] }
];

const res1 = evaluateSCPAccess(scpSuite, 'ec2:RunInstances');
const res2 = evaluateSCPAccess(scpSuite, 'cloudtrail:StopLogging');

console.log(\`SCP_EVALUATION: Action=ec2:RunInstances Allowed=\${res1.isAllowed} Reason='\${res1.reason}'\`);
console.log(\`SCP_EVALUATION: Action=cloudtrail:StopLogging Allowed=\${res2.isAllowed} Reason='\${res2.reason}'\`);`;
  const out2 = await runSnippet(code2);
  console.log('Snippet 2 Output:\n', out2);
  assert.equal(out2, "SCP_EVALUATION: Action=ec2:RunInstances Allowed=true Reason='ACTION_PERMITTED within SCP boundary'\nSCP_EVALUATION: Action=cloudtrail:StopLogging Allowed=false Reason='EXPLICIT_SCP_DENY on action 'cloudtrail:StopLogging' overrides all local IAM admin rights'");

  // Snippet 3
  const code3 = `interface GuardrailStatus {
  guardrailId: string;
  type: 'PREVENTIVE' | 'DETECTIVE';
  targetOU: string;
  compliantAccounts: number;
  totalAccounts: number;
}

function auditControlTowerBaseline(guardrails: GuardrailStatus[]): string {
  let allCompliant = true;
  for (const g of guardrails) {
    if (g.compliantAccounts < g.totalAccounts) {
      allCompliant = false;
    }
  }
  return \`CONTROL_TOWER_AUDIT: Evaluated=\${guardrails.length} BaselineStatus=\${allCompliant ? '100%_CONFORMANT' : 'NON_COMPLIANT'} ActiveOUs=\${guardrails.length}\`;
}

const audit = auditControlTowerBaseline([
  { guardrailId: 'SH.S3.1_ENCRYPT', type: 'PREVENTIVE', targetOU: 'Workloads/Prod', compliantAccounts: 12, totalAccounts: 12 },
  { guardrailId: 'SH.LOG.1_TRAIL_ACTIVE', type: 'PREVENTIVE', targetOU: 'Core/Security', compliantAccounts: 4, totalAccounts: 4 },
  { guardrailId: 'SH.EC2.2_MFA_DELETE', type: 'DETECTIVE', targetOU: 'Workloads/Prod', compliantAccounts: 12, totalAccounts: 12 },
]);

console.log(audit);`;
  const out3 = await runSnippet(code3);
  console.log('Snippet 3 Output:\n', out3);
  assert.equal(out3, 'CONTROL_TOWER_AUDIT: Evaluated=3 BaselineStatus=100%_CONFORMANT ActiveOUs=3');

  // Snippet 4
  const code4 = `interface RegionRequest {
  requestedRegion: string;
  approvedRegions: string[];
  isS3PutEncrypted: boolean;
}

function evaluateGovernancePolicies(req: RegionRequest): { regionPass: boolean; encryptionPass: boolean; status: string } {
  const regionPass = req.approvedRegions.includes(req.requestedRegion);
  const encryptionPass = req.isS3PutEncrypted;
  const status = regionPass && encryptionPass ? 'OPERATION_PERMITTED' : 'BLOCKED_BY_GUARDRAIL';

  return { regionPass, encryptionPass, status };
}

const approvedRegions = ['us-east-1', 'eu-west-1'];
const op1 = evaluateGovernancePolicies({ requestedRegion: 'us-east-1', approvedRegions, isS3PutEncrypted: true });
const op2 = evaluateGovernancePolicies({ requestedRegion: 'ap-southeast-1', approvedRegions, isS3PutEncrypted: true });

console.log(\`GOVERNANCE_RESULT: Region=\${op1.regionPass} Encryption=\${op1.encryptionPass} Status=\${op1.status}\`);
console.log(\`GOVERNANCE_RESULT: Region=\${op2.regionPass} Encryption=\${op2.encryptionPass} Status=\${op2.status}\`);`;
  const out4 = await runSnippet(code4);
  console.log('Snippet 4 Output:\n', out4);
  assert.equal(out4, 'GOVERNANCE_RESULT: Region=true Encryption=true Status=OPERATION_PERMITTED\nGOVERNANCE_RESULT: Region=false Encryption=true Status=BLOCKED_BY_GUARDRAIL');

  // Snippet 5
  const code5 = `interface EnclaveMetrics {
  totalMemberAccounts: number;
  activeSCPRules: number;
  scpDenyPrecedenceActive: boolean;
  breakGlassAccessRestricted: boolean;
  unauthorizedActionsBlocked: number;
}

class MultiAccountGovernanceSimulator {
  private metrics: EnclaveMetrics;

  constructor(metrics: EnclaveMetrics) {
    this.metrics = metrics;
  }

  runAudit(): string {
    const isEnclaveSecure = this.metrics.totalMemberAccounts >= 25 &&
                            this.metrics.activeSCPRules >= 8 &&
                            this.metrics.scpDenyPrecedenceActive &&
                            this.metrics.breakGlassAccessRestricted;

    return \`ENCLAVE_GOVERNANCE_VERIFIED: Accounts=\${this.metrics.totalMemberAccounts} SCPs=\${this.metrics.activeSCPRules} BlockedThreats=\${this.metrics.unauthorizedActionsBlocked} ComplianceStatus=\${isEnclaveSecure ? 'ENTERPRISE_ZERO_TRUST_PASS' : 'FAIL'}\`;
  }
}

const simulator = new MultiAccountGovernanceSimulator({
  totalMemberAccounts: 32,
  activeSCPRules: 14,
  scpDenyPrecedenceActive: true,
  breakGlassAccessRestricted: true,
  unauthorizedActionsBlocked: 1420,
});

console.log(simulator.runAudit());`;
  const out5 = await runSnippet(code5);
  console.log('Snippet 5 Output:\n', out5);
  assert.equal(out5, 'ENCLAVE_GOVERNANCE_VERIFIED: Accounts=32 SCPs=14 BlockedThreats=1420 ComplianceStatus=ENTERPRISE_ZERO_TRUST_PASS');

  console.log('All 5 snippets passed with 100% exact match!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
