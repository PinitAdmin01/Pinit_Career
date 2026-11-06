// scripts/test_cyber_day49_snippets.ts
import assert from 'node:assert';

// Snippet 1: Cloud IAM Trust Policy & Confused Deputy Validator
interface TrustPolicyStatement {
  Effect: 'Allow' | 'Deny';
  Principal: { AWS?: string; Service?: string };
  Action: string | string[];
  Condition?: {
    StringEquals?: Record<string, string>;
    Bool?: Record<string, boolean>;
  };
}

class CrossAccountTrustValidator {
  static validateTrustPolicy(statement: TrustPolicyStatement, expectedAccountId: string): { isSecure: boolean; issues: string[] } {
    const issues: string[] = [];
    if (statement.Effect !== 'Allow') {
      issues.push('Statement must be Allow effect for valid assume-role');
    }
    const actions = Array.isArray(statement.Action) ? statement.Action : [statement.Action];
    if (!actions.includes('sts:AssumeRole')) {
      issues.push('Action must include sts:AssumeRole');
    }
    // Confused deputy defense requires externalId condition
    const extId = statement.Condition?.StringEquals?.['sts:ExternalId'];
    if (!extId || extId.length < 16) {
      issues.push('Trust policy must require a cryptographically strong sts:ExternalId condition (Confused Deputy defense)');
    }
    return {
      isSecure: issues.length === 0,
      issues
    };
  }
}

const trustStmt: TrustPolicyStatement = {
  Effect: 'Allow',
  Principal: { AWS: 'arn:aws:iam::123456789012:root' },
  Action: 'sts:AssumeRole',
  Condition: {
    StringEquals: {
      'sts:ExternalId': 'sec-enterprise-token-9876543210'
    }
  }
};
const trustAudit = CrossAccountTrustValidator.validateTrustPolicy(trustStmt, '123456789012');
assert.strictEqual(trustAudit.isSecure, true);
assert.strictEqual(trustAudit.issues.length, 0);

// Snippet 2: Service Control Policy (SCP) Guardrail Evaluator
interface ScpStatement {
  Sid: string;
  Effect: 'Deny';
  Action: string[];
  Resource: string;
  Condition?: Record<string, any>;
}

class OrganizationGuardrailEvaluator {
  static auditGuardrails(scps: ScpStatement[]): { guarded: boolean; missingGuardrails: string[] } {
    const missing: string[] = [];
    const allActions = scps.flatMap(s => s.Action);

    if (!allActions.some(a => a === 'cloudtrail:StopLogging' || a === 'cloudtrail:DeleteTrail' || a === 'cloudtrail:*')) {
      missing.push('Missing SCP guardrail protecting CloudTrail logging from deletion');
    }
    if (!allActions.some(a => a === 'guardduty:DeleteDetector' || a === 'guardduty:DisassociateFromMasterAccount')) {
      missing.push('Missing SCP guardrail preventing GuardDuty security service tampering');
    }
    if (!scps.some(s => s.Condition && s.Condition.StringNotEquals?.['aws:RequestedRegion'])) {
      missing.push('Missing SCP guardrail restricting deployments to approved cloud regions');
    }

    return {
      guarded: missing.length === 0,
      missingGuardrails: missing
    };
  }
}

const testScps: ScpStatement[] = [
  {
    Sid: 'ProtectAuditLogging',
    Effect: 'Deny',
    Action: ['cloudtrail:StopLogging', 'cloudtrail:DeleteTrail', 'cloudtrail:UpdateTrail'],
    Resource: '*'
  },
  {
    Sid: 'ProtectSecurityDetectors',
    Effect: 'Deny',
    Action: ['guardduty:DeleteDetector', 'guardduty:DisassociateFromMasterAccount'],
    Resource: '*'
  },
  {
    Sid: 'RestrictApprovedRegions',
    Effect: 'Deny',
    Action: ['*'],
    Resource: '*',
    Condition: {
      StringNotEquals: {
        'aws:RequestedRegion': ['us-east-1', 'us-west-2', 'eu-west-1']
      }
    }
  }
];
const scpAudit = OrganizationGuardrailEvaluator.auditGuardrails(testScps);
assert.strictEqual(scpAudit.guarded, true);
assert.strictEqual(scpAudit.missingGuardrails.length, 0);

// Snippet 3: Terraform State & Backend Security Inspector
interface TerraformBackendConfig {
  backendType: 's3' | 'gcs' | 'remote';
  bucket: string;
  encrypt: boolean;
  kmsKeyId?: string;
  dynamodbTable?: string;
}

class TerraformBackendValidator {
  static validateBackend(cfg: TerraformBackendConfig): { isHardened: boolean; errors: string[] } {
    const errors: string[] = [];
    if (cfg.backendType === 's3') {
      if (!cfg.encrypt) {
        errors.push('Terraform state backend S3 bucket must have server-side encryption enabled');
      }
      if (!cfg.kmsKeyId) {
        errors.push('Terraform state encryption must utilize a dedicated customer-managed KMS key');
      }
      if (!cfg.dynamodbTable) {
        errors.push('Terraform state backend must configure a DynamoDB table for distributed state locking');
      }
    }
    return {
      isHardened: errors.length === 0,
      errors
    };
  }
}

const backendConfig: TerraformBackendConfig = {
  backendType: 's3',
  bucket: 'corp-terraform-states-prod',
  encrypt: true,
  kmsKeyId: 'arn:aws:kms:us-east-1:111122223333:key/tfstate-key-01',
  dynamodbTable: 'corp-terraform-locks'
};
const backendAudit = TerraformBackendValidator.validateBackend(backendConfig);
assert.strictEqual(backendAudit.isHardened, true);

// Snippet 4: Static IaC Security Scanner & Rule Engine
interface IaCResourceDefinition {
  type: string;
  name: string;
  attributes: Record<string, any>;
}

interface IaCFinding {
  ruleId: string;
  severity: 'HIGH' | 'CRITICAL';
  description: string;
  resource: string;
}

class StaticIaCScanner {
  static scanResources(resources: IaCResourceDefinition[]): { passed: boolean; findings: IaCFinding[] } {
    const findings: IaCFinding[] = [];

    for (const res of resources) {
      if (res.type === 'aws_s3_bucket') {
        if (!res.attributes.server_side_encryption_configuration) {
          findings.push({
            ruleId: 'CKV_AWS_19',
            severity: 'HIGH',
            description: 'S3 bucket lacks server-side encryption configuration',
            resource: res.name
          });
        }
      }
      if (res.type === 'aws_security_group_rule') {
        const cidrs = res.attributes.cidr_blocks || [];
        const port = res.attributes.from_port;
        if (cidrs.includes('0.0.0.0/0') && (port === 22 || port === 3389)) {
          findings.push({
            ruleId: 'CKV_AWS_24',
            severity: 'CRITICAL',
            description: `Security group exposes administrative port ${port} to 0.0.0.0/0`,
            resource: res.name
          });
        }
      }
    }

    return {
      passed: findings.length === 0,
      findings
    };
  }
}

const testResources: IaCResourceDefinition[] = [
  {
    type: 'aws_s3_bucket',
    name: 'prod_customer_data',
    attributes: { server_side_encryption_configuration: { rule: { apply_server_side_encryption_by_default: { sse_algorithm: 'aws:kms' } } } }
  },
  {
    type: 'aws_security_group_rule',
    name: 'bastion_ssh',
    attributes: { from_port: 22, to_port: 22, cidr_blocks: ['10.0.0.0/16'] } // private CIDR
  }
];
const iacScan = StaticIaCScanner.scanResources(testResources);
assert.strictEqual(iacScan.passed, true);
assert.strictEqual(iacScan.findings.length, 0);

// Snippet 5: Production Cloud IAM & IaC Policy Certification Gate
interface CloudDeploymentPlan {
  planId: string;
  targetAccount: string;
  trustPolicyValid: boolean;
  scpEnforced: boolean;
  stateBackendEncrypted: boolean;
  iacScanPassed: boolean;
  zeroUnresolvedFindings: boolean;
}

class ProductionCloudPolicyGatekeeper {
  static certifyDeployment(plan: CloudDeploymentPlan): { certified: boolean; checklist: Record<string, boolean> } {
    const checklist = {
      crossAccountTrustVerified: plan.trustPolicyValid,
      organizationScpGuarded: plan.scpEnforced,
      tfStateEncryptedAndLocked: plan.stateBackendEncrypted,
      staticIaCAnalysisClean: plan.iacScanPassed,
      zeroCriticalHighVulnerabilities: plan.zeroUnresolvedFindings
    };
    const certified = Object.values(checklist).every(Boolean);
    return { certified, checklist };
  }
}

const prodDeployment: CloudDeploymentPlan = {
  planId: 'plan-terraform-prod-2026-b10',
  targetAccount: '998877665544',
  trustPolicyValid: true,
  scpEnforced: true,
  stateBackendEncrypted: true,
  iacScanPassed: true,
  zeroUnresolvedFindings: true
};
const certCloud = ProductionCloudPolicyGatekeeper.certifyDeployment(prodDeployment);
assert.strictEqual(certCloud.certified, true);
assert.strictEqual(Object.values(certCloud.checklist).every(Boolean), true);

console.log('All 5 Cyber Day 49 snippets passed unit tests!');
