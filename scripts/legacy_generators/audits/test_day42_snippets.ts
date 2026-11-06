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
  console.log('Testing Day 42 Snippets...');

  // Snippet 1
  const code1 = `interface IAMRoleRequest {
  roleName: string;
  attachedPolicyPermissions: string[];
  permissionBoundaryPermissions: string[];
}

function evaluateEffectivePermissions(req: IAMRoleRequest): { effectiveAllowed: string[]; isPrivilegeEscalationBlocked: boolean } {
  const effective = req.attachedPolicyPermissions.filter(p => req.permissionBoundaryPermissions.includes(p));
  const isEscalationBlocked = req.attachedPolicyPermissions.includes('iam:*') && !effective.includes('iam:*');

  return { effectiveAllowed: effective, isPrivilegeEscalationBlocked: isEscalationBlocked };
}

const developerRole: IAMRoleRequest = {
  roleName: 'AppDeployerRole',
  attachedPolicyPermissions: ['s3:*', 'sqs:*', 'iam:*'],
  permissionBoundaryPermissions: ['s3:*', 'sqs:*', 'dynamodb:*'],
};

const result = evaluateEffectivePermissions(developerRole);
console.log(\`PERMISSION_BOUNDARY_CHECK: Role=\${developerRole.roleName} EffectivePerms=[\${result.effectiveAllowed.join(',')}] EscalationBlocked=\${result.isPrivilegeEscalationBlocked}\`);`;
  const out1 = await runSnippet(code1);
  console.log('Snippet 1 Output:\n', out1);
  assert.equal(out1, 'PERMISSION_BOUNDARY_CHECK: Role=AppDeployerRole EffectivePerms=[s3:*,sqs:*] EscalationBlocked=true');

  // Snippet 2
  const code2 = `interface PrincipalIdentity {
  username: string;
  department: string;
  project: string;
}

interface CloudResource {
  resourceId: string;
  departmentTag: string;
  projectTag: string;
}

function evaluateABAC(principal: PrincipalIdentity, resource: CloudResource): { accessGranted: boolean; matchedTags: number } {
  let matches = 0;
  if (principal.department === resource.departmentTag) matches++;
  if (principal.project === resource.projectTag) matches++;

  const accessGranted = matches === 2;
  return { accessGranted, matchedTags: matches };
}

const alice: PrincipalIdentity = { username: 'alice', department: 'Analytics', project: 'Apollo' };
const res1: CloudResource = { resourceId: 's3://apollo-raw-data', departmentTag: 'Analytics', projectTag: 'Apollo' };
const res2: CloudResource = { resourceId: 's3://zeus-finance-records', departmentTag: 'Finance', projectTag: 'Zeus' };

console.log(\`ABAC_EVALUATION: User=\${alice.username} Res=\${res1.resourceId} Access=\${evaluateABAC(alice, res1).accessGranted}\`);
console.log(\`ABAC_EVALUATION: User=\${alice.username} Res=\${res2.resourceId} Access=\${evaluateABAC(alice, res2).accessGranted}\`);`;
  const out2 = await runSnippet(code2);
  console.log('Snippet 2 Output:\n', out2);
  assert.equal(out2, 'ABAC_EVALUATION: User=alice Res=s3://apollo-raw-data Access=true\nABAC_EVALUATION: User=alice Res=s3://zeus-finance-records Access=false');

  // Snippet 3
  const code3 = `interface OIDCTokenClaims {
  iss: string;
  aud: string;
  sub: string;
  repository: string;
  ref: string;
}

interface IAMTrustPolicyRule {
  expectedIssuer: string;
  expectedAudience: string;
  allowedRepo: string;
  allowedBranch: string;
}

function validateOIDCTrust(claims: OIDCTokenClaims, rule: IAMTrustPolicyRule): { tokenValid: boolean; roleAssumed: boolean } {
  const isIssValid = claims.iss === rule.expectedIssuer;
  const isAudValid = claims.aud === rule.expectedAudience;
  const isSubjectValid = claims.sub === \`repo:\${rule.allowedRepo}:ref:refs/heads/\${rule.allowedBranch}\`;

  const valid = isIssValid && isAudValid && isSubjectValid;
  return { tokenValid: valid, roleAssumed: valid };
}

const rule: IAMTrustPolicyRule = {
  expectedIssuer: 'https://token.actions.githubusercontent.com',
  expectedAudience: 'sts.amazonaws.com',
  allowedRepo: 'enterprise-org/production-api',
  allowedBranch: 'main',
};

const mainDeployment = validateOIDCTrust({
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'sts.amazonaws.com',
  sub: 'repo:enterprise-org/production-api:ref:refs/heads/main',
  repository: 'enterprise-org/production-api',
  ref: 'refs/heads/main',
}, rule);

const featureBranchDeployment = validateOIDCTrust({
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'sts.amazonaws.com',
  sub: 'repo:enterprise-org/production-api:ref:refs/heads/feature-x',
  repository: 'enterprise-org/production-api',
  ref: 'refs/heads/feature-x',
}, rule);

console.log(\`OIDC_FEDERATION_RESULT: MainBranch RoleAssumed=\${mainDeployment.roleAssumed}\`);
console.log(\`OIDC_FEDERATION_RESULT: FeatureBranch RoleAssumed=\${featureBranchDeployment.roleAssumed}\`);`;
  const out3 = await runSnippet(code3);
  console.log('Snippet 3 Output:\n', out3);
  assert.equal(out3, 'OIDC_FEDERATION_RESULT: MainBranch RoleAssumed=true\nOIDC_FEDERATION_RESULT: FeatureBranch RoleAssumed=false');

  // Snippet 4
  const code4 = `interface SCIMUser {
  id: string;
  userName: string;
  groups: string[];
  active: boolean;
}

class SCIMDirectoryEngine {
  private users: Map<string, SCIMUser> = new Map();

  syncUser(user: SCIMUser) {
    this.users.set(user.id, user);
  }

  deprovisionUser(userId: string): { userFound: boolean; accessRevoked: boolean } {
    const user = this.users.get(userId);
    if (!user) return { userFound: false, accessRevoked: false };
    user.active = false;
    user.groups = [];
    return { userFound: true, accessRevoked: true };
  }

  getActiveUserCount(): number {
    return Array.from(this.users.values()).filter(u => u.active).length;
  }
}

const scim = new SCIMDirectoryEngine();
scim.syncUser({ id: 'usr-101', userName: 'john.doe@company.com', groups: ['CloudEngineers', 'ProdAdmins'], active: true });
scim.syncUser({ id: 'usr-102', userName: 'sarah.smith@company.com', groups: ['Auditors'], active: true });

const deprovision = scim.deprovisionUser('usr-101');
console.log(\`SCIM_LIFECYCLE: Deprovisioned=\${deprovision.accessRevoked} ActiveSSOUsers=\${scim.getActiveUserCount()}\`);`;
  const out4 = await runSnippet(code4);
  console.log('Snippet 4 Output:\n', out4);
  assert.equal(out4, 'SCIM_LIFECYCLE: Deprovisioned=true ActiveSSOUsers=1');

  // Snippet 5
  const code5 = `interface IdentityGovernanceAudit {
  totalPrincipals: number;
  staticAccessKeysEliminated: number;
  abacTagCoveragePercent: number;
  permissionBoundariesActive: boolean;
  oidcShortLivedSessionsDaily: number;
}

class ZeroTrustIdentityEngine {
  private audit: IdentityGovernanceAudit;

  constructor(audit: IdentityGovernanceAudit) {
    this.audit = audit;
  }

  verifyCompliance(): string {
    const isZeroTrustCompliant = this.audit.staticAccessKeysEliminated >= 500 &&
                                 this.audit.abacTagCoveragePercent >= 98 &&
                                 this.audit.permissionBoundariesActive &&
                                 this.audit.oidcShortLivedSessionsDaily >= 10000;

    return \`ZERO_TRUST_IAM_AUDIT: StaticKeysPurged=\${this.audit.staticAccessKeysEliminated} ABACCoverage=\${this.audit.abacTagCoveragePercent}% DailyOIDCSessions=\${this.audit.oidcShortLivedSessionsDaily} Status=\${isZeroTrustCompliant ? 'ENTERPRISE_IDENTITY_PASS' : 'FAIL'}\`;
  }
}

const engine = new ZeroTrustIdentityEngine({
  totalPrincipals: 1250,
  staticAccessKeysEliminated: 540,
  abacTagCoveragePercent: 99.4,
  permissionBoundariesActive: true,
  oidcShortLivedSessionsDaily: 14500,
});

console.log(engine.verifyCompliance());`;
  const out5 = await runSnippet(code5);
  console.log('Snippet 5 Output:\n', out5);
  assert.equal(out5, 'ZERO_TRUST_IAM_AUDIT: StaticKeysPurged=540 ABACCoverage=99.4% DailyOIDCSessions=14500 Status=ENTERPRISE_IDENTITY_PASS');

  console.log('All 5 snippets passed with 100% exact match!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
