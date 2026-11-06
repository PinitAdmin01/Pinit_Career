// scripts/test_cyber_day47_snippets.ts
import assert from 'node:assert';

// Snippet 1: Docker Daemon & Host Isolation Spec
interface DockerDaemonConfig {
  icc: boolean;
  usernsRemap: string;
  noNewPrivileges: boolean;
  liveRestore: boolean;
  userlandProxy: boolean;
  tlsVerify: boolean;
}

class DockerDaemonHardener {
  static auditConfiguration(config: DockerDaemonConfig): { isHardened: boolean; violations: string[] } {
    const violations: string[] = [];
    if (config.icc !== false) violations.push('Inter-container communication (icc) must be disabled');
    if (!config.usernsRemap || config.usernsRemap === 'default') {
      // Valid remap
    } else {
      violations.push('userns-remap must be configured');
    }
    if (!config.noNewPrivileges) violations.push('no-new-privileges must be true');
    if (!config.liveRestore) violations.push('live-restore must be true');
    if (config.userlandProxy) violations.push('userland-proxy should be false for direct iptables routing');
    if (!config.tlsVerify) violations.push('TLS verification must be enabled for remote docker sockets');

    return {
      isHardened: violations.length === 0,
      violations
    };
  }
}

const daemonCfg: DockerDaemonConfig = {
  icc: false,
  usernsRemap: 'default',
  noNewPrivileges: true,
  liveRestore: true,
  userlandProxy: false,
  tlsVerify: true
};
const daemonAudit = DockerDaemonHardener.auditConfiguration(daemonCfg);
assert.strictEqual(daemonAudit.isHardened, true);
assert.strictEqual(daemonAudit.violations.length, 0);

// Snippet 2: Minimal Distroless Image Inspector
interface ContainerImageLayer {
  command: string;
  sizeBytes: number;
  hasShell: boolean;
  hasPackageManager: boolean;
}

interface ImageSecurityProfile {
  imageName: string;
  baseType: 'distroless' | 'alpine' | 'debian-full';
  runAsUser: number;
  layers: ContainerImageLayer[];
}

class ContainerImageInspector {
  static evaluateImage(profile: ImageSecurityProfile): { compliant: boolean; issues: string[] } {
    const issues: string[] = [];
    if (profile.runAsUser === 0) {
      issues.push('Container must not execute as root (UID 0)');
    }
    const containsShell = profile.layers.some(l => l.hasShell);
    if (profile.baseType === 'distroless' && containsShell) {
      issues.push('Distroless production image must not contain interactive shells');
    }
    const containsPkgMgr = profile.layers.some(l => l.hasPackageManager);
    if (containsPkgMgr) {
      issues.push('Production image must strip package managers (apt, apk, yum)');
    }

    return {
      compliant: issues.length === 0,
      issues
    };
  }
}

const distrolessProfile: ImageSecurityProfile = {
  imageName: 'gcr.io/distroless/nodejs20-debian12:nonroot',
  baseType: 'distroless',
  runAsUser: 65532,
  layers: [
    { command: 'COPY server.js /app/', sizeBytes: 45000, hasShell: false, hasPackageManager: false },
    { command: 'USER nonroot:nonroot', sizeBytes: 0, hasShell: false, hasPackageManager: false }
  ]
};
const imgEval = ContainerImageInspector.evaluateImage(distrolessProfile);
assert.strictEqual(imgEval.compliant, true);

// Snippet 3: Immutable Filesystem & Tmpfs Mount Validator
interface MountSpec {
  destination: string;
  type: 'bind' | 'tmpfs' | 'volume';
  readOnly: boolean;
  options?: string[];
}

interface ContainerStorageSecurity {
  readOnlyRootfs: boolean;
  mounts: MountSpec[];
}

class ContainerStorageValidator {
  static validateStorage(spec: ContainerStorageSecurity): { isSecure: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!spec.readOnlyRootfs) {
      errors.push('Root filesystem must be mounted read-only (--read-only)');
    }
    for (const m of spec.mounts) {
      if (m.type === 'tmpfs') {
        const opts = m.options || [];
        if (!opts.includes('noexec')) errors.push(`Tmpfs mount at ${m.destination} missing noexec`);
        if (!opts.includes('nosuid')) errors.push(`Tmpfs mount at ${m.destination} missing nosuid`);
      }
    }
    return {
      isSecure: errors.length === 0,
      errors
    };
  }
}

const storageSpec: ContainerStorageSecurity = {
  readOnlyRootfs: true,
  mounts: [
    { destination: '/tmp', type: 'tmpfs', readOnly: false, options: ['noexec', 'nosuid', 'nodev', 'size=64m'] }
  ]
};
const storageAudit = ContainerStorageValidator.validateStorage(storageSpec);
assert.strictEqual(storageAudit.isSecure, true);

// Snippet 4: Container Vulnerability Scanner & Policy Gate
interface VulnerabilityRecord {
  cveId: string;
  pkgName: string;
  installedVersion: string;
  fixedVersion: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cvssScore: number;
}

class VulnerabilityGatekeeper {
  static scanReport(vulns: VulnerabilityRecord[], maxAllowedSeverity: 'LOW' | 'MEDIUM' | 'HIGH'): { passed: boolean; blockingCves: string[] } {
    const severityRanks: Record<string, number> = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4
    };
    const maxRank = severityRanks[maxAllowedSeverity];
    const blocking = vulns.filter(v => severityRanks[v.severity] > maxRank).map(v => `${v.cveId} (${v.severity}) in ${v.pkgName}`);

    return {
      passed: blocking.length === 0,
      blockingCves: blocking
    };
  }
}

const testVulns: VulnerabilityRecord[] = [
  { cveId: 'CVE-2023-45853', pkgName: 'zlib', installedVersion: '1.2.11', fixedVersion: '1.2.12', severity: 'CRITICAL', cvssScore: 9.8 },
  { cveId: 'CVE-2024-21626', pkgName: 'runc', installedVersion: '1.1.11', fixedVersion: '1.1.12', severity: 'HIGH', cvssScore: 8.6 }
];
const gateResult = VulnerabilityGatekeeper.scanReport(testVulns, 'MEDIUM');
assert.strictEqual(gateResult.passed, false);
assert.strictEqual(gateResult.blockingCves.length, 2);

const cleanVulns: VulnerabilityRecord[] = [
  { cveId: 'CVE-2024-0001', pkgName: 'libssl', installedVersion: '3.0.1', fixedVersion: null, severity: 'LOW', cvssScore: 3.1 }
];
const cleanGate = VulnerabilityGatekeeper.scanReport(cleanVulns, 'MEDIUM');
assert.strictEqual(cleanGate.passed, true);

// Snippet 5: Production Container Security Policy Pipeline
interface ContainerDeploymentArtifact {
  imageName: string;
  nonRootUid: number;
  readOnlyRootfs: boolean;
  tmpfsHardened: boolean;
  vulnScanPassed: boolean;
  sbomGenerated: boolean;
}

class ProductionContainerPolicyEngine {
  static certifyDeployment(artifact: ContainerDeploymentArtifact): { certified: boolean; checklist: Record<string, boolean> } {
    const checklist = {
      nonRootUser: artifact.nonRootUid > 0,
      immutableRootfs: artifact.readOnlyRootfs,
      hardenedStorage: artifact.tmpfsHardened,
      cleanVulnerabilityScan: artifact.vulnScanPassed,
      provenanceSbom: artifact.sbomGenerated
    };
    const certified = Object.values(checklist).every(v => v === true);
    return { certified, checklist };
  }
}

const prodArtifact: ContainerDeploymentArtifact = {
  imageName: 'registry.enterprise.internal/services/payment-gateway:v2.4.0',
  nonRootUid: 10001,
  readOnlyRootfs: true,
  tmpfsHardened: true,
  vulnScanPassed: true,
  sbomGenerated: true
};
const certAudit = ProductionContainerPolicyEngine.certifyDeployment(prodArtifact);
assert.strictEqual(certAudit.certified, true);
assert.strictEqual(Object.values(certAudit.checklist).every(Boolean), true);

console.log('All 5 Cyber Day 47 snippets passed unit tests!');
