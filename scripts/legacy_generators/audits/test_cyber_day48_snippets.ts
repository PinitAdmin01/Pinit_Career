// scripts/test_cyber_day48_snippets.ts
import assert from 'node:assert';

// Snippet 1: Kube API Server Request Lifecycle Validator
interface KubeApiRequest {
  user: string;
  groups: string[];
  verb: 'get' | 'list' | 'create' | 'update' | 'delete' | 'watch';
  resource: string;
  namespace: string;
  isMutating: boolean;
}

class KubeApiSecurityPipeline {
  static evaluateAdmission(req: KubeApiRequest, allowedRoles: Record<string, string[]>): { allowed: boolean; stage: string } {
    // Stage 1: AuthN
    if (!req.user || req.user === 'system:anonymous') {
      return { allowed: false, stage: 'Authentication (Anonymous blocked)' };
    }
    // Stage 2: AuthZ (RBAC)
    const permittedVerbs = allowedRoles[req.resource] || [];
    if (!permittedVerbs.includes(req.verb) && !permittedVerbs.includes('*')) {
      return { allowed: false, stage: 'Authorization (RBAC denied)' };
    }
    // Stage 3: Admission Controller
    if (req.resource === 'pods' && req.verb === 'create' && req.namespace === 'default') {
      return { allowed: false, stage: 'Admission Control (Default namespace prohibited)' };
    }

    return { allowed: true, stage: 'Admitted & Persisted to Etcd' };
  }
}

const req1: KubeApiRequest = {
  user: 'system:serviceaccount:production:payment-processor',
  groups: ['system:serviceaccounts', 'system:serviceaccounts:production'],
  verb: 'get',
  resource: 'secrets',
  namespace: 'production',
  isMutating: false
};
const roles1 = { secrets: ['get'] };
const result1 = KubeApiSecurityPipeline.evaluateAdmission(req1, roles1);
assert.strictEqual(result1.allowed, true);

// Snippet 2: Kubernetes RBAC Policy Auditor
interface RbacRule {
  apiGroups: string[];
  resources: string[];
  verbs: string[];
}

interface RbacRole {
  name: string;
  isClusterScoped: boolean;
  rules: RbacRule[];
}

class RbacLeastPrivilegeAuditor {
  static auditRole(role: RbacRole): { isCompliant: boolean; risks: string[] } {
    const risks: string[] = [];
    for (const r of role.rules) {
      if (r.resources.includes('*')) {
        risks.push(`Wildcard resource access in role ${role.name}`);
      }
      if (r.verbs.includes('*')) {
        risks.push(`Wildcard verb access in role ${role.name}`);
      }
      if (r.resources.includes('secrets') && (r.verbs.includes('list') || r.verbs.includes('watch'))) {
        risks.push(`Overly broad secrets access (list/watch) in role ${role.name}`);
      }
    }
    return {
      isCompliant: risks.length === 0,
      risks
    };
  }
}

const safeRole: RbacRole = {
  name: 'pod-reader',
  isClusterScoped: false,
  rules: [
    { apiGroups: [''], resources: ['pods'], verbs: ['get', 'list', 'watch'] },
    { apiGroups: [''], resources: ['configmaps'], verbs: ['get'] }
  ]
};
const safeAudit = RbacLeastPrivilegeAuditor.auditRole(safeRole);
assert.strictEqual(safeAudit.isCompliant, true);

const dangerousRole: RbacRole = {
  name: 'cluster-admin-shadow',
  isClusterScoped: true,
  rules: [
    { apiGroups: ['*'], resources: ['*'], verbs: ['*'] }
  ]
};
const badAudit = RbacLeastPrivilegeAuditor.auditRole(dangerousRole);
assert.strictEqual(badAudit.isCompliant, false);
assert.strictEqual(badAudit.risks.length, 2);

// Snippet 3: Pod Security Standards (PSS) Admission Validator
type PsaLevel = 'privileged' | 'baseline' | 'restricted';

interface PodSecurityContext {
  runAsNonRoot: boolean;
  runAsUser?: number;
  readOnlyRootFilesystem: boolean;
  allowPrivilegeEscalation: boolean;
  capabilitiesDrop: string[];
  hostNetwork: boolean;
  hostPID: boolean;
  hostIPC: boolean;
}

class PodSecurityAdmissionGate {
  static evaluatePod(sc: PodSecurityContext, requiredLevel: PsaLevel): { admitted: boolean; reasons: string[] } {
    const reasons: string[] = [];
    if (requiredLevel === 'restricted') {
      if (!sc.runAsNonRoot) reasons.push('Must require runAsNonRoot: true');
      if (!sc.readOnlyRootFilesystem) reasons.push('Must require readOnlyRootFilesystem: true');
      if (sc.allowPrivilegeEscalation) reasons.push('Must set allowPrivilegeEscalation: false');
      if (!sc.capabilitiesDrop.includes('ALL')) reasons.push('Must drop ALL capabilities');
      if (sc.hostNetwork || sc.hostPID || sc.hostIPC) reasons.push('Host namespaces forbidden');
    } else if (requiredLevel === 'baseline') {
      if (sc.hostNetwork || sc.hostPID || sc.hostIPC) reasons.push('Host namespaces forbidden in baseline');
    }
    return {
      admitted: reasons.length === 0,
      reasons
    };
  }
}

const restrictedPod: PodSecurityContext = {
  runAsNonRoot: true,
  runAsUser: 10001,
  readOnlyRootFilesystem: true,
  allowPrivilegeEscalation: false,
  capabilitiesDrop: ['ALL'],
  hostNetwork: false,
  hostPID: false,
  hostIPC: false
};
const psaResult = PodSecurityAdmissionGate.evaluatePod(restrictedPod, 'restricted');
assert.strictEqual(psaResult.admitted, true);

// Snippet 4: Kubernetes Network Policy Evaluator
interface NetworkPolicyRule {
  protocol: 'TCP' | 'UDP';
  port: number;
  allowedCidr?: string;
  allowedNamespace?: string;
}

interface PodNetworkPolicy {
  name: string;
  namespace: string;
  policyTypes: ('Ingress' | 'Egress')[];
  defaultDenyIngress: boolean;
  defaultDenyEgress: boolean;
  allowedEgressRules: NetworkPolicyRule[];
}

class NetworkPolicyInspector {
  static auditPolicy(policy: PodNetworkPolicy): { isSecure: boolean; defects: string[] } {
    const defects: string[] = [];
    if (!policy.defaultDenyIngress) {
      defects.push('Missing default-deny ingress rule');
    }
    if (!policy.defaultDenyEgress) {
      defects.push('Missing default-deny egress rule');
    }
    // Check if cloud metadata IP (169.254.169.254) is blocked
    const permitsMetadata = policy.allowedEgressRules.some(r => r.allowedCidr === '0.0.0.0/0' || r.allowedCidr === '169.254.169.254/32');
    if (permitsMetadata) {
      defects.push('Policy must block egress to cloud metadata service (169.254.169.254)');
    }
    return {
      isSecure: defects.length === 0,
      defects
    };
  }
}

const hardenedNetPol: PodNetworkPolicy = {
  name: 'default-deny-and-isolate',
  namespace: 'production',
  policyTypes: ['Ingress', 'Egress'],
  defaultDenyIngress: true,
  defaultDenyEgress: true,
  allowedEgressRules: [
    { protocol: 'UDP', port: 53, allowedNamespace: 'kube-system' }, // kube-dns
    { protocol: 'TCP', port: 443, allowedCidr: '10.0.0.0/8' }       // internal mesh
  ]
};
const netAudit = NetworkPolicyInspector.auditPolicy(hardenedNetPol);
assert.strictEqual(netAudit.isSecure, true);

// Snippet 5: Production Kubernetes Cluster Security Benchmark
interface ClusterSecurityChecklist {
  apiServerMtlsEtcd: boolean;
  etcdEncryptionAtRest: boolean;
  rbacNoWildcards: boolean;
  psaRestrictedEnforced: boolean;
  defaultDenyNetworkPolicies: boolean;
  metadataServiceBlocked: boolean;
}

class ProductionKubeSecurityAuditor {
  static certifyCluster(checklist: ClusterSecurityChecklist): { certified: boolean; score: number } {
    const checks = Object.values(checklist);
    const passed = checks.filter(Boolean).length;
    const score = (passed / checks.length) * 100;
    return {
      certified: score === 100,
      score
    };
  }
}

const prodKubeChecks: ClusterSecurityChecklist = {
  apiServerMtlsEtcd: true,
  etcdEncryptionAtRest: true,
  rbacNoWildcards: true,
  psaRestrictedEnforced: true,
  defaultDenyNetworkPolicies: true,
  metadataServiceBlocked: true
};
const certKube = ProductionKubeSecurityAuditor.certifyCluster(prodKubeChecks);
assert.strictEqual(certKube.certified, true);
assert.strictEqual(certKube.score, 100);

console.log('All 5 Cyber Day 48 snippets passed unit tests!');
