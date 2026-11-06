// scripts/test_day45_snippets.ts
import assert from 'node:assert/strict';

console.log("Testing Day 45 Snippets...");

// Snippet 1: Multi-Account Landing Zone SCP Perimeter Guardrails
interface AccountContext {
  accountId: string;
  ou: 'Security' | 'CoreNetwork' | 'CDE_Workloads' | 'Dev';
  hasDirectInternetGateway: boolean;
  defaultEbsKmsEncryption: boolean;
}

class LandingZoneScpValidator {
  validateAccountCompliance(acc: AccountContext): { compliant: boolean; violations: string[] } {
    const violations: string[] = [];

    // PCI-DSS Rule: CDE Workloads must NEVER possess direct Internet Gateway attachments
    if (acc.ou === 'CDE_Workloads' && acc.hasDirectInternetGateway) {
      violations.push('SCP_VIOLATION: Direct IGW forbidden in CDE_Workloads OU');
    }

    // Enterprise Rule: All EBS volumes must be encrypted with Customer Managed Keys
    if (!acc.defaultEbsKmsEncryption) {
      violations.push('SCP_VIOLATION: Default EBS KMS encryption must be enabled');
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  }
}

const scp = new LandingZoneScpValidator();
const cdeAccount = scp.validateAccountCompliance({
  accountId: '998877665544',
  ou: 'CDE_Workloads',
  hasDirectInternetGateway: false,
  defaultEbsKmsEncryption: true,
});

const rogueAccount = scp.validateAccountCompliance({
  accountId: '112233445566',
  ou: 'CDE_Workloads',
  hasDirectInternetGateway: true,
  defaultEbsKmsEncryption: false,
});

const s1_out = `SCP_LANDING_ZONE: CDECompliant=${cdeAccount.compliant} RogueCompliant=${rogueAccount.compliant} ViolationsCaught=${rogueAccount.violations.length}`;
console.log("Snippet 1 Output:\n", s1_out);
assert.equal(s1_out, 'SCP_LANDING_ZONE: CDECompliant=true RogueCompliant=false ViolationsCaught=2');

// Snippet 2: Cardholder Data Environment (CDE) TGW Network Isolation
interface RouteRule {
  targetCidr: string;
  allowed: boolean;
}

class CdeNetworkIsolator {
  private cdeAllowedRoutes: Map<string, boolean> = new Map();

  constructor() {
    // Only Inspection VPC and Shared Services are allowed
    this.cdeAllowedRoutes.set('10.100.0.0/16', true); // Central Inspection VPC
    this.cdeAllowedRoutes.set('10.50.0.0/16', true);  // Shared Security Services
    this.cdeAllowedRoutes.set('10.20.0.0/16', false); // Dev VPC (BLOCKED)
    this.cdeAllowedRoutes.set('10.30.0.0/16', false); // Corp VPN (BLOCKED)
  }

  canTraverse(targetCidr: string): boolean {
    return this.cdeAllowedRoutes.get(targetCidr) === true;
  }
}

const cdeNet = new CdeNetworkIsolator();
const toInspection = cdeNet.canTraverse('10.100.0.0/16');
const toDev = cdeNet.canTraverse('10.20.0.0/16');
const toCorp = cdeNet.canTraverse('10.30.0.0/16');

const s2_out = `CDE_NETWORK_ISOLATION: RouteToInspection=${toInspection} RouteToDevBlocked=${!toDev} RouteToCorpBlocked=${!toCorp}`;
console.log("Snippet 2 Output:\n", s2_out);
assert.equal(s2_out, 'CDE_NETWORK_ISOLATION: RouteToInspection=true RouteToDevBlocked=true RouteToCorpBlocked=true');

// Snippet 3: PCI-DSS Edge Tokenization Engine (CloudHSM Vault Simulation)
interface TokenizedCardRecord {
  token: string;
  vaultId: string;
  last4: string;
  isPanRedacted: boolean;
}

class EdgeTokenizationVault {
  private vaultStore: Map<string, string> = new Map();

  tokenize(rawPan: string, hsmWrappingKeyId: string): TokenizedCardRecord {
    const last4 = rawPan.slice(-4);
    const token = `tok_pci_${last4}_${Math.floor(Math.random() * 89999 + 10000)}`;
    const encryptedBlob = `VAULT_ENCRYPTED_[${rawPan}]_BY_[${hsmWrappingKeyId}]`;
    this.vaultStore.set(token, encryptedBlob);

    return {
      token,
      vaultId: 'hsm-vault-cde-01',
      last4,
      isPanRedacted: true,
    };
  }

  isRawPanInPayload(payload: string): boolean {
    // Check if 16-digit PAN is present in payload string
    return /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/.test(payload);
  }
}

const tokenEngine = new EdgeTokenizationVault();
const rawCard = '4111-2222-3333-4444';
const tokenized = tokenEngine.tokenize(rawCard, 'hsm-key-fips140-level3');

const appLogPayload = `PAYMENT_PROCESSED: Token=${tokenized.token} Last4=${tokenized.last4} Status=SUCCESS`;
const panLeakedInLog = tokenEngine.isRawPanInPayload(appLogPayload);

const s3_out = `EDGE_TOKENIZATION: TokenGenerated=${tokenized.token.startsWith('tok_pci_4444')} RawPanLeakedInLogs=${panLeakedInLog} PanRedacted=${tokenized.isPanRedacted}`;
console.log("Snippet 3 Output:\n", s3_out);
assert.equal(s3_out, 'EDGE_TOKENIZATION: TokenGenerated=true RawPanLeakedInLogs=false PanRedacted=true');

// Snippet 4: Zero Static Credentials & Short-Lived STS Access in the CDE
interface PrincipalCredential {
  principalArn: string;
  credentialType: 'STATIC_ACCESS_KEY' | 'OIDC_EPHEMERAL_STS';
  sessionDurationMinutes: number;
  mfaVerified: boolean;
}

class CdeAccessGovernor {
  evaluateAccess(cred: PrincipalCredential): { authorized: boolean; reason: string } {
    if (cred.credentialType === 'STATIC_ACCESS_KEY') {
      return { authorized: false, reason: 'PCI_DSS_VIOLATION: Static access keys strictly prohibited in CDE' };
    }
    if (!cred.mfaVerified) {
      return { authorized: false, reason: 'PCI_DSS_VIOLATION: MFA required for all CDE sessions' };
    }
    if (cred.sessionDurationMinutes > 60) {
      return { authorized: false, reason: 'PCI_DSS_VIOLATION: Session duration cannot exceed 60 minutes' };
    }
    return { authorized: true, reason: 'ACCESS_GRANTED: Valid ephemeral STS session with MFA' };
  }
}

const governor = new CdeAccessGovernor();
const staticKeyAttempt = governor.evaluateAccess({
  principalArn: 'arn:aws:iam::111122223333:user/dev-admin',
  credentialType: 'STATIC_ACCESS_KEY',
  sessionDurationMinutes: 1440,
  mfaVerified: false,
});

const ephemeralOidcAttempt = governor.evaluateAccess({
  principalArn: 'arn:aws:sts::111122223333:assumed-role/GithubActionsDeployer/job-941',
  credentialType: 'OIDC_EPHEMERAL_STS',
  sessionDurationMinutes: 30,
  mfaVerified: true,
});

const s4_out = `CDE_CREDENTIAL_GOVERNANCE: StaticKeyAllowed=${staticKeyAttempt.authorized} OIDCAllowed=${ephemeralOidcAttempt.authorized} Reason="${ephemeralOidcAttempt.reason}"`;
console.log("Snippet 4 Output:\n", s4_out);
assert.equal(s4_out, 'CDE_CREDENTIAL_GOVERNANCE: StaticKeyAllowed=false OIDCAllowed=true Reason="ACCESS_GRANTED: Valid ephemeral STS session with MFA"');

// Snippet 5: Milestone 8 Capstone: Production SRE PCI-DSS Compliance Validator
interface PciDssMeshAudit {
  totalAccounts: number;
  cdeIsolated: boolean;
  zeroStaticKeysEnforced: boolean;
  cloudHsmActive: boolean;
  networkFirewallEnforced: boolean;
  flowLogsStreaming: boolean;
}

class Milestone8PciComplianceEngine {
  private audit: PciDssMeshAudit;

  constructor(audit: PciDssMeshAudit) {
    this.audit = audit;
  }

  runFullAudit(): string {
    const isCompliant = this.audit.totalAccounts >= 50 &&
                        this.audit.cdeIsolated &&
                        this.audit.zeroStaticKeysEnforced &&
                        this.audit.cloudHsmActive &&
                        this.audit.networkFirewallEnforced &&
                        this.audit.flowLogsStreaming;

    const statusToken = isCompliant ? 'PCI_DSS_ZERO_TRUST_MESH_VERIFIED' : 'AUDIT_FAILED';

    return `MILESTONE_8_VALIDATION: Accounts=${this.audit.totalAccounts} CDEIsolated=${this.audit.cdeIsolated} ZeroStaticKeys=${this.audit.zeroStaticKeysEnforced} CloudHSMActive=${this.audit.cloudHsmActive} NetworkFirewallEnforced=${this.audit.networkFirewallEnforced} Status=${statusToken}`;
  }
}

const auditor = new Milestone8PciComplianceEngine({
  totalAccounts: 64,
  cdeIsolated: true,
  zeroStaticKeysEnforced: true,
  cloudHsmActive: true,
  networkFirewallEnforced: true,
  flowLogsStreaming: true,
});

const s5_out = auditor.runFullAudit();
console.log("Snippet 5 Output:\n", s5_out);
assert.equal(s5_out, 'MILESTONE_8_VALIDATION: Accounts=64 CDEIsolated=true ZeroStaticKeys=true CloudHSMActive=true NetworkFirewallEnforced=true Status=PCI_DSS_ZERO_TRUST_MESH_VERIFIED');

console.log("All 5 Day 45 snippets passed with 100% exact match!");
