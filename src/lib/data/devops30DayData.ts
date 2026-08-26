import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const DEVOPS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "DevOps Culture, CI/CD & The 12-Factor App",
    "desc": "Understand continuous integration, continuous delivery, automated feedback loops, and 12-factor configuration rules.",
    "syllabus": [
      "The 12-Factor App Methodology: Factor III (Config in Environment) & Factor VI (Stateless Processes).",
      "Continuous Integration vs Continuous Delivery vs Continuous Deployment.",
      "Shift-Left Security & Automated Fast Feedback Loops."
    ],
    "eTitle": "12-Factor Config Environment Evaluator",
    "eDesc": "Implement function getEnvironmentConfig(envKey, fallbackDefault, processEnv) extracting configuration from environment variables, strictly prohibiting hardcoded source secrets.",
    "eStarter": "function getEnvironmentConfig(key, defaultVal, envObj = process.env) {\n  // Check if key exists in envObj and is not empty string, else return defaultVal.\n  \n}",
    "eHint": "Check if key exists in envObj and is not empty string, else return defaultVal.",
    "eTest": "const mockEnv = { DATABASE_URL: 'postgres://prod:5432/db', PORT: '8080' };\nif (getEnvironmentConfig('DATABASE_URL', 'localhost', mockEnv) !== 'postgres://prod:5432/db') throw new Error('Env extraction failed');\nif (getEnvironmentConfig('REDIS_HOST', '127.0.0.1', mockEnv) !== '127.0.0.1') throw new Error('Default fallback failed');",
    "aTitle": "CI/CD Pipeline Stage Classifier",
    "aDesc": "Implement function classifyPipelinePhase(stageName) returning BUILD, TEST, DEPLOY, or MONITOR.",
    "aStarter": "function classifyPipelinePhase(stage) {\n  // Map lint/unit_test to TEST, docker_build to BUILD, helm_deploy to DEPLOY.\n  \n}",
    "aHint": "Map lint/unit_test to TEST, docker_build to BUILD, helm_deploy to DEPLOY.",
    "aTest": "if (classifyPipelinePhase('unit_test') !== 'TEST' || classifyPipelinePhase('docker_build') !== 'BUILD') throw new Error('Phase classification failed');"
  },
  {
    "day": 2,
    "title": "Linux Administration, POSIX Signals & Process Daemons",
    "desc": "Master POSIX process signals (SIGTERM, SIGKILL, SIGHUP), background daemons, systemd unit files, and exit status codes.",
    "syllabus": [
      "POSIX Signals: `SIGTERM` (15: Graceful stop), `SIGKILL` (9: Force kill), `SIGHUP` (1: Reload config).",
      "Exit Status Codes: 0 (Success), 1-255 (Failure), 130 (SIGINT Ctrl+C), 137 (SIGKILL / OOM 128+9).",
      "systemd Services: ExecStart, Restart=always, and journalctl log inspection."
    ],
    "eTitle": "Linux Process Signal Trap & Graceful Shutdown Controller",
    "eDesc": "Implement function handleProcessSignal(signal, activeConnections) returning 0 for clean SIGTERM drainage and 137 for SIGKILL force kill.",
    "eStarter": "function handleProcessSignal(signal, activeConns) {\n  // SIGTERM drains connections and exits 0; SIGKILL exits 137; SIGHUP reloads config.\n  \n}",
    "eHint": "SIGTERM drains connections and exits 0; SIGKILL exits 137; SIGHUP reloads config.",
    "eTest": "const term = handleProcessSignal('SIGTERM', 42);\nif (term.exitCode !== 0 || term.drainedCount !== 42) throw new Error('SIGTERM graceful drain failed');\nconst kill = handleProcessSignal('SIGKILL', 42);\nif (kill.exitCode !== 137) throw new Error('SIGKILL exit code must be 137 (128+9)');",
    "aTitle": "Linux Exit Code Formatter",
    "aDesc": "Implement function isExitCodeSuccess(code) returning true for 0.",
    "aStarter": "function isExitCodeSuccess(code) { return code === 0; }",
    "aHint": "Return code === 0.",
    "aTest": "if (isExitCodeSuccess(0) !== true || isExitCodeSuccess(1) !== false) throw new Error('Exit code checker failed');"
  },
  {
    "day": 3,
    "title": "Docker Architecture, Copy-on-Write & Image Layer Caching",
    "desc": "Understand the Docker daemon, container namespace isolation, union filesystems, and optimal layer caching order.",
    "syllabus": [
      "Docker Daemon & containerd / runc container runtime architecture.",
      "Union Filesystem (Overlay2) & Immutable Read-Only Image Layers.",
      "Layer Caching Rule: Place frequently changing files (`COPY . .`) AFTER static dependencies (`COPY package*.json ./`)."
    ],
    "eTitle": "Docker Layer Caching Build Order Auditor",
    "eDesc": "Implement function auditDockerfileLayers(dockerfileInstructions) returning valid if dependencies are cached before source code.",
    "eStarter": "function auditDockerfileLayers(instructions) {\n  // Verify package.json copied first, then dependency install, then source copy.\n  \n}",
    "eHint": "Verify package.json copied first, then dependency install, then source copy.",
    "eTest": "const optimalSteps = ['FROM node:20-alpine', 'WORKDIR /app', 'COPY package*.json ./', 'RUN npm ci', 'COPY . .', 'CMD [\"node\", \"server.js\"]'];\nif (auditDockerfileLayers(optimalSteps).optimal !== true) throw new Error('Optimal Dockerfile was rejected');\nconst badSteps = ['FROM node:20-alpine', 'WORKDIR /app', 'COPY . .', 'RUN npm ci', 'CMD [\"node\", \"server.js\"]'];\nif (auditDockerfileLayers(badSteps).optimal !== false) throw new Error('Suboptimal Dockerfile should be flagged');",
    "aTitle": "Docker Image Tag Formatter",
    "aDesc": "Implement function formatDockerTag(registry, repo, tag) returning registry/repo:tag.",
    "aStarter": "function formatDockerTag(reg, repo, tag) { return `${reg}/${repo}:${tag}`; }",
    "aHint": "Join with slash and colon.",
    "aTest": "if (formatDockerTag('ghcr.io', 'pinit/api', 'v1.0.0') !== 'ghcr.io/pinit/api:v1.0.0') throw new Error('Image tag format failed');"
  },
  {
    "day": 4,
    "title": "Docker Multi-Stage Builds & Minimal Production Images",
    "desc": "Shrink container image footprint from 1.5GB to < 60MB using multi-stage Dockerfiles and Alpine/Distroless runners.",
    "syllabus": [
      "Multi-Stage Build Phases: `AS builder` (Compiles binaries) $\\to$ `AS runner` (Runs with 0 devDependencies).",
      "Distroless & Alpine Linux Base Images: Eliminating package managers, curl, and shell vulnerabilities.",
      "Non-Root User Invariant (`USER node` / `USER 10001`) preventing container privilege escalation."
    ],
    "eTitle": "Multi-Stage Docker Image Size & Security Validator",
    "eDesc": "Implement function validateProductionImage(imageMetadata) verifying size < 100MB, non-root user, and zero build tool artifacts.",
    "eStarter": "function validateProductionImage(meta) {\n  // Verify size < 100MB, user is not root, and build tools are absent.\n  \n}",
    "eHint": "Verify size < 100MB, user is not root, and build tools are absent.",
    "eTest": "const prod = { imageSizeBytes: 48 * 1024 * 1024, user: 'node', installedPackages: ['ca-certificates', 'tzdata'] };\nif (validateProductionImage(prod).productionReady !== true) throw new Error('Valid production image failed');\nconst insecure = { imageSizeBytes: 850 * 1024 * 1024, user: 'root', installedPackages: ['gcc', 'git'] };\nif (validateProductionImage(insecure).productionReady !== false) throw new Error('Insecure bloated image should fail');",
    "aTitle": "Image Size Megabyte Formatter",
    "aDesc": "Implement function formatBytesToMb(bytes) returning megabytes string.",
    "aStarter": "function formatBytesToMb(bytes) { return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }",
    "aHint": "Divide bytes by 1024*1024.",
    "aTest": "if (formatBytesToMb(52428800) !== '50.0 MB') throw new Error('MB formatter failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose",
    "desc": "Milestone 1: Build a production-grade multi-container local stack with Docker Compose: Next.js Frontend + Express API Gateway + PostgreSQL DB + Redis Cache + Bridge Network DNS resolution.",
    "syllabus": [
      "Docker Compose v2 Specification: `services`, `networks`, `volumes`, and `healthcheck` declarations.",
      "Internal Bridge Network Service Discovery: Resolving `postgres:5432` and `redis:6379` via automatic Docker DNS.",
      "Service Dependency Sequencing: `depends_on` with `condition: service_healthy`."
    ],
    "eTitle": "Docker Compose Dependency & DNS Resolution Engine",
    "eDesc": "Implement function resolveDockerComposeDns(services, sourceService, targetService) returning target container IP and status.",
    "eStarter": "function resolveDockerComposeDns(services, source, target) {\n  // Verify both services exist and share the same network.\n  \n}",
    "eHint": "Verify both services exist and share the same network.",
    "eTest": "const stack = {\n  web: { network: 'backend_net', internalIp: '172.20.0.2', port: 3000 },\n  api: { network: 'backend_net', internalIp: '172.20.0.3', port: 8080 },\n  db:  { network: 'backend_net', internalIp: '172.20.0.4', port: 5432 }\n};\nconst res = resolveDockerComposeDns(stack, 'web', 'db');\nif (!res.resolved || res.dnsHost !== 'db' || res.targetIp !== '172.20.0.4') throw new Error('Docker Compose DNS resolution failed');",
    "aTitle": "Docker Compose Healthcheck Validator",
    "aDesc": "Implement function hasValidHealthcheck(serviceConfig) checking test command, interval, and retries.",
    "aStarter": "function hasValidHealthcheck(cfg) { return Boolean(cfg.healthcheck?.test && cfg.healthcheck?.interval && cfg.healthcheck?.retries); }",
    "aHint": "Check test, interval, retries.",
    "aTest": "const s = { healthcheck: { test: ['CMD', 'curl', '-f', 'http://localhost:8080/healthz'], interval: '10s', retries: 3 } };\nif (hasValidHealthcheck(s) !== true) throw new Error('Healthcheck validator failed');"
  },
  {
    "day": 6,
    "title": "Docker Container Networking & Host/Bridge Port Mappings",
    "desc": "Master Docker Bridge, Host, None, and Overlay networks, iptables port forwarding (`-p 8080:80`), and cross-container communication.",
    "syllabus": [
      "Network Drivers: Bridge (Default isolated private network), Host (Bypasses Docker network stack), Overlay (Multi-host Swarm/K8s).",
      "Port Mapping Syntax: `HOST_PORT:CONTAINER_PORT` (e.g. `8080:80`).",
      "Network Inspection & Packet Routing across Docker virtual bridges (`docker0`)."
    ],
    "eTitle": "Docker Port Forwarding Collision Detector",
    "eDesc": "Implement function checkPortCollision(activeBindings, newBinding) ensuring no two containers bind the same host port on 0.0.0.0.",
    "eStarter": "function checkPortCollision(active, newBind) {\n  // Check if hostIp and hostPort already exist in active bindings.\n  \n}",
    "eHint": "Check if hostIp and hostPort already exist in active bindings.",
    "eTest": "const bindings = [{ hostIp: '0.0.0.0', hostPort: 8080, containerId: 'c1' }];\nif (checkPortCollision(bindings, { hostIp: '0.0.0.0', hostPort: 8080 }).available !== false) throw new Error('Port collision was not detected');\nif (checkPortCollision(bindings, { hostIp: '0.0.0.0', hostPort: 3000 }).available !== true) throw new Error('Available port was rejected');",
    "aTitle": "Docker Port String Parser",
    "aDesc": "Implement function parsePortMapping(portStr) extracting hostPort and containerPort.",
    "aStarter": "function parsePortMapping(str) {\n  // Split by colon and parse ints.\n  \n}",
    "aHint": "Split by colon and parse ints.",
    "aTest": "const p = parsePortMapping('8080:80');\nif (p.hostPort !== 8080 || p.containerPort !== 80) throw new Error('Port parser failed');"
  },
  {
    "day": 7,
    "title": "Docker Security, Rootless Daemons & Read-Only Root Filesystems",
    "desc": "Harden container runtime security: drop Linux capabilities (`--cap-drop ALL`), read-only root filesystems, and SecComp/AppArmor profiles.",
    "syllabus": [
      "Principle of Least Privilege: Dropping dangerous kernel capabilities (`CAP_SYS_ADMIN`, `CAP_NET_RAW`).",
      "Immutable Containers: Running with `--read-only` root filesystem and tmpfs memory mounts.",
      "Rootless Docker: Running the Docker daemon entirely in unprivileged user namespaces."
    ],
    "eTitle": "Container Security Posture Evaluator",
    "eDesc": "Implement function evaluateContainerSecurity(config) checking non-root user, read-only root filesystem, and dropped capabilities.",
    "eStarter": "function evaluateContainerSecurity(cfg) {\n  // Compute score: non-root (40), read-only (30), dropped caps (30); secure if score >= 70.\n  \n}",
    "eHint": "Compute score: non-root (40), read-only (30), dropped caps (30); secure if score >= 70.",
    "eTest": "const hardened = { user: 'node', readOnlyRootFilesystem: true, capabilities: { drop: ['ALL'] } };\nif (evaluateContainerSecurity(hardened).secure !== true || evaluateContainerSecurity(hardened).securityScore !== 100) throw new Error('Hardened container failed evaluation');\nconst insecure = { user: 'root', readOnlyRootFilesystem: false, capabilities: { drop: [] } };\nif (evaluateContainerSecurity(insecure).secure !== false) throw new Error('Insecure container should fail');",
    "aTitle": "Capability Formatter",
    "aDesc": "Implement function formatCapability(name) ensuring CAP_ prefix.",
    "aStarter": "function formatCapability(n) { return n.startsWith('CAP_') ? n : `CAP_${n}`; }",
    "aHint": "Prepend CAP_ if missing.",
    "aTest": "if (formatCapability('SYS_ADMIN') !== 'CAP_SYS_ADMIN' || formatCapability('CAP_NET_RAW') !== 'CAP_NET_RAW') throw new Error('Cap format failed');"
  },
  {
    "day": 8,
    "title": "Container Healthchecks, Restart Policies & Resource Limits",
    "desc": "Configure container self-healing: Docker HEALTHCHECK instructions, restart policies (`unless-stopped`, `on-failure`), and memory/CPU limits.",
    "syllabus": [
      "Container Restart Policies: `no`, `always`, `on-failure:max_retries`, `unless-stopped`.",
      "Docker HEALTHCHECK: `interval=30s`, `timeout=5s`, `retries=3`, `start_period=10s`.",
      "Out-Of-Memory (OOM) Killer & Setting hard memory limits (`--memory=512m --memory-swap=512m`)."
    ],
    "eTitle": "Container Self-Healing & Restart Policy Manager",
    "eDesc": "Implement function evaluateRestartPolicy(exitCode, policy, restartCount, maxRetries = 5) determining whether to restart container.",
    "eStarter": "function evaluateRestartPolicy(exitCode, policy, restartCount, maxRetries = 5) {\n  // Always restarts on 'always'; 'on-failure' restarts only on non-zero exit code if restartCount < maxRetries.\n  \n}",
    "eHint": "Always restarts on 'always'; 'on-failure' restarts only on non-zero exit code if restartCount < maxRetries.",
    "eTest": "if (evaluateRestartPolicy(1, 'on-failure', 2, 5).shouldRestart !== true) throw new Error('on-failure with non-zero exit should restart');\nif (evaluateRestartPolicy(0, 'on-failure', 0, 5).shouldRestart !== false) throw new Error('on-failure with clean exit 0 should not restart');\nif (evaluateRestartPolicy(1, 'on-failure', 5, 5).shouldRestart !== false) throw new Error('Max retries exceeded should halt');",
    "aTitle": "Memory Limit Byte Calculator",
    "aDesc": "Implement function parseMemoryLimit(str) converting '512m' or '2g' to bytes.",
    "aStarter": "function parseMemoryLimit(s) {\n  // Multiply m by 1024*1024 and g by 1024*1024*1024.\n  \n}",
    "aHint": "Multiply m by 1024*1024 and g by 1024*1024*1024.",
    "aTest": "if (parseMemoryLimit('512m') !== 536870912 || parseMemoryLimit('1g') !== 1073741824) throw new Error('Memory parser failed');"
  },
  {
    "day": 9,
    "title": "GitHub Actions CI: Workflow Syntax, Triggers & Secret Stores",
    "desc": "Build automated Continuous Integration workflows in GitHub Actions: `.github/workflows/*.yml`, triggers (`push`, `pull_request`), and Encrypted Secrets.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of GitHub Actions CI: Workflow Syntax, Triggers & Secret Stores.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "GitHub Actions Workflow Syntax & Secret Sanitizer",
    "eDesc": "Implement function sanitizeWorkflowSecrets(logOutput, secretValues) masking all sensitive API keys with `***` in CI logs.",
    "eStarter": "function sanitizeWorkflowSecrets(log, secrets) {\n  // Replace all secret string occurrences with ***\n  \n}",
    "eHint": "Replace all secret string occurrences with ***",
    "eTest": "const log = 'Connecting with secret token ghp_ABC123456789 to deployment endpoint';\nconst res = sanitizeWorkflowSecrets(log, ['ghp_ABC123456789']);\nif (res.includes('ghp_ABC123456789') || !res.includes('***')) throw new Error('Secret was leaked in CI log');",
    "aTitle": "GitHub Actions Event Matcher",
    "aDesc": "Implement function shouldTriggerWorkflow(workflowEvents, incomingEvent, branch) checking branch triggers.",
    "aStarter": "function shouldTriggerWorkflow(events, incoming, branch) {\n  // Check branch filter.\n  \n}",
    "aHint": "Check branch filter.",
    "aTest": "const e = { push: { branches: ['main', 'staging'] } };\nif (shouldTriggerWorkflow(e, 'push', 'main') !== true || shouldTriggerWorkflow(e, 'push', 'feature') !== false) throw new Error('Trigger check failed');"
  },
  {
    "day": 10,
    "title": "CI Test Automation, Parallelism & Test Matrix Strategies",
    "desc": "Accelerate CI build times from 30 minutes to 3 minutes using parallel matrix builds (Node 18/20/22, Linux/macOS) and dependency caching (`actions/cache`).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of CI Test Automation, Parallelism & Test Matrix Strategies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CI Matrix Build Parallelism Calculator",
    "eDesc": "Implement function calculateMatrixCombinations(matrixConfig) calculating total parallel jobs and max execution time.",
    "eStarter": "function calculateMatrixCombinations(cfg) {\n  // Total jobs is os.length * node.length.\n  \n}",
    "eHint": "Total jobs is os.length * node.length.",
    "eTest": "const m = { os: ['ubuntu-latest', 'macos-latest'], node: ['18', '20', '22'], jobDurationMin: 4 };\nconst res = calculateMatrixCombinations(m);\nif (res.totalJobs !== 6 || res.estimatedParallelTimeMin !== 4) throw new Error('Matrix calculation failed');",
    "aTitle": "Cache Key Hash Formatter",
    "aDesc": "Implement function buildCacheKey(prefix, os, lockfileHash) returning formatted key string.",
    "aStarter": "function buildCacheKey(p, os, hash) { return `${p}-${os}-${hash}`; }",
    "aHint": "Join with hyphens.",
    "aTest": "if (buildCacheKey('npm', 'linux', 'abc1234') !== 'npm-linux-abc1234') throw new Error('Cache key failed');"
  },
  {
    "day": 11,
    "title": "Semantic Versioning (SemVer) & Automated Git Tagging",
    "desc": "Automate release pipelines with Semantic Versioning (`MAJOR.MINOR.PATCH`), Conventional Commits (`fix:`, `feat:`, `feat!:`), and GitHub Releases.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Semantic Versioning (SemVer) & Automated Git Tagging.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Conventional Commits SemVer Increment Engine",
    "eDesc": "Implement function computeNextSemVer(currentVersion, commitMessages) calculating next version based on commit conventions.",
    "eStarter": "function computeNextSemVer(curr, commits) {\n  // Breaking change bumps MAJOR; feat bumps MINOR; fix bumps PATCH.\n  \n}",
    "eHint": "Breaking change bumps MAJOR; feat bumps MINOR; fix bumps PATCH.",
    "eTest": "if (computeNextSemVer('v1.2.3', ['fix: resolve memory leak']) !== 'v1.2.4') throw new Error('Fix must bump PATCH');\nif (computeNextSemVer('v1.2.3', ['feat: add oauth login']) !== 'v1.3.0') throw new Error('Feat must bump MINOR');\nif (computeNextSemVer('v1.2.3', ['feat!: drop v1 API support']) !== 'v2.0.0') throw new Error('Breaking change must bump MAJOR');",
    "aTitle": "SemVer Format Validator",
    "aDesc": "Implement function isValidSemVer(tag) validating vX.Y.Z format.",
    "aStarter": "function isValidSemVer(tag) { return /^v?\\d+\\.\\d+\\.\\d+$/.test(tag); }",
    "aHint": "Check regex.",
    "aTest": "if (isValidSemVer('v1.0.0') !== true || isValidSemVer('1.0') !== false) throw new Error('SemVer regex failed');"
  },
  {
    "day": 12,
    "title": "Container Registry Security & Vulnerability Scanning (Trivy/Clair)",
    "desc": "Secure container registries (GHCR / AWS ECR / Docker Hub) with automated CVE vulnerability scanners (Trivy) and image signing (Cosign).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Container Registry Security & Vulnerability Scanning (Trivy/Clair).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Container Vulnerability Security Gate Gatekeeper",
    "eDesc": "Implement function evaluateSecurityScan(vulnerabilities, failOnSeverity = 'CRITICAL') blocking CI deployment if critical CVEs are found.",
    "eStarter": "function evaluateSecurityScan(cves, failSeverity = 'CRITICAL') {\n  // Block deployment if criticalCount > 0.\n  \n}",
    "eHint": "Block deployment if criticalCount > 0.",
    "eTest": "const clean = [{ cve: 'CVE-1', severity: 'LOW' }];\nif (evaluateSecurityScan(clean).deployPermitted !== true) throw new Error('Clean scan failed');\nconst dirty = [{ cve: 'CVE-2', severity: 'CRITICAL' }];\nif (evaluateSecurityScan(dirty).deployPermitted !== false) throw new Error('Critical CVE must block pipeline');",
    "aTitle": "CVE Identifier Validator",
    "aDesc": "Implement function isValidCve(cveStr) verifying CVE-YYYY-NNNNN format.",
    "aStarter": "function isValidCve(s) { return /^CVE-\\d{4}-\\d{4,}$/.test(s); }",
    "aHint": "Check regex.",
    "aTest": "if (isValidCve('CVE-2026-12345') !== true || isValidCve('BUG-101') !== false) throw new Error('CVE regex failed');"
  },
  {
    "day": 13,
    "title": "Automated Staging Deployments, SSH Bastions & Environment Promotion",
    "desc": "Automate continuous delivery across deployment environments (Dev $\\to$ Staging $\\to$ Production) with manual approval gates.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Automated Staging Deployments, SSH Bastions & Environment Promotion.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Environment Promotion State Machine",
    "eDesc": "Implement function promoteDeployment(currentEnv, testResultsPassed, manualApproval) advancing build through staging to production.",
    "eStarter": "function promoteDeployment(curr, testsPassed, approved) {\n  // Dev auto-promotes to Staging if tests pass; Staging requires manualApproval to reach Production.\n  \n}",
    "eHint": "Dev auto-promotes to Staging if tests pass; Staging requires manualApproval to reach Production.",
    "eTest": "if (promoteDeployment('DEV', true, false).nextEnv !== 'STAGING') throw new Error('Dev should auto-promote to Staging');\nif (promoteDeployment('STAGING', true, false).status !== 'AWAITING_MANUAL_PROD_APPROVAL') throw new Error('Staging requires approval');\nif (promoteDeployment('STAGING', true, true).nextEnv !== 'PRODUCTION') throw new Error('Approved staging must promote to Production');",
    "aTitle": "Environment Name Normalizer",
    "aDesc": "Implement function normalizeEnv(name) returning DEV, STAGING, or PROD.",
    "aStarter": "function normalizeEnv(n) {\n  // Map substring matches.\n  \n}",
    "aHint": "Map substring matches.",
    "aTest": "if (normalizeEnv('production') !== 'PROD' || normalizeEnv('stage') !== 'STAGING') throw new Error('Env normalize failed');"
  },
  {
    "day": 14,
    "title": "Automated Smoke Testing & Synthetic Health Verification",
    "desc": "Verify live production deployments with automated HTTP smoke tests, synthetic transaction probes, and automated rollback triggers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Automated Smoke Testing & Synthetic Health Verification.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Post-Deployment Smoke Test Runner",
    "eDesc": "Implement function runSmokeTestSuite(endpoints, healthProbe) verifying all critical HTTP endpoints return 200 OK within 500ms SLA.",
    "eStarter": "async function runSmokeTestSuite(endpoints, probe) {\n  // Check status === 200 and latencyMs < 500.\n  \n}",
    "eHint": "Check status === 200 and latencyMs < 500.",
    "eTest": "const probe = { check: async (ep) => ({ status: 200, latencyMs: 120 }) };\nconst res = await runSmokeTestSuite(['/healthz', '/api/v1/version'], probe);\nif (!res.allPassed || res.passedCount !== 2) throw new Error('Smoke test suite failed');",
    "aTitle": "HTTP Status Health Evaluator",
    "aDesc": "Implement function isHttpHealthy(status) returning true for 200-299.",
    "aStarter": "function isHttpHealthy(s) { return s >= 200 && s <= 299; }",
    "aHint": "Check 200-299.",
    "aTest": "if (isHttpHealthy(200) !== true || isHttpHealthy(500) !== false) throw new Error('Status checker failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks",
    "desc": "Milestone 2: Build a production-grade CI/CD pipeline in GitHub Actions: Multi-OS matrix unit tests $\\to$ Docker multi-stage build $\\to$ Trivy CVE scan $\\to$ Staging deploy $\\to$ Automated smoke test $\\to$ Production deploy with automated rollback.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Enterprise CI/CD Pipeline State Orchestrator",
    "eDesc": "Implement function orchestratePipelineRun(pipelineStages) executing steps in order and triggering automated rollback if any stage fails.",
    "eStarter": "async function orchestratePipelineRun(stages) {\n  // Iterate stages; catch failures and return FAILED_ROLLED_BACK with rollbackTriggered: true.\n  \n}",
    "eHint": "Iterate stages; catch failures and return FAILED_ROLLED_BACK with rollbackTriggered: true.",
    "eTest": "const stages = [\n  { name: 'MatrixTest', run: async () => ({ success: true }) },\n  { name: 'DockerBuild', run: async () => ({ success: true }) },\n  { name: 'SmokeTest', run: async () => ({ success: false, error: '500_INTERNAL_ERROR' }) }\n];\nconst res = await orchestratePipelineRun(stages);\nif (res.pipelineStatus !== 'FAILED_ROLLED_BACK' || res.failedStage !== 'SmokeTest' || !res.rollbackTriggered) throw new Error('Automated pipeline rollback failed');",
    "aTitle": "Pipeline Execution Time Calculator",
    "aDesc": "Implement function calculatePipelineDuration(startMs, endMs) returning duration in seconds.",
    "aStarter": "function calculatePipelineDuration(s, e) { return Math.round((e - s) / 1000); }",
    "aHint": "Divide ms delta by 1000.",
    "aTest": "if (calculatePipelineDuration(1000, 15000) !== 14) throw new Error('Duration calc failed');"
  },
  {
    "day": 16,
    "title": "Kubernetes Core Architecture: Pods, ReplicaSets & Deployments",
    "desc": "Master Kubernetes control plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager) and worker nodes (kubelet, kube-proxy).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Kubernetes Core Architecture: Pods, ReplicaSets & Deployments.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kubernetes ReplicaSet Reconciliation Loop Engine",
    "eDesc": "Implement function reconcileReplicaSet(desiredReplicas, currentPods) determining scale-out (create pods) or scale-in (terminate pods) actions.",
    "eStarter": "function reconcileReplicaSet(desired, current) {\n  // Compute delta = desired - current.length.\n  \n}",
    "eHint": "Compute delta = desired - current.length.",
    "eTest": "if (reconcileReplicaSet(5, ['p1', 'p2', 'p3']).podsToCreate !== 2) throw new Error('Scale out failed: 5 - 3 = 2 to create');\nif (reconcileReplicaSet(2, ['p1', 'p2', 'p3']).podsToTerminate !== 1) throw new Error('Scale in failed: 3 - 2 = 1 to terminate');",
    "aTitle": "K8s Resource Kind Validator",
    "aDesc": "Implement function isK8sCoreKind(kind) checking Pod, Service, Deployment, ReplicaSet, ConfigMap, Secret.",
    "aStarter": "function isK8sCoreKind(k) { return ['Pod', 'Service', 'Deployment', 'ReplicaSet', 'ConfigMap', 'Secret'].includes(k); }",
    "aHint": "Check array includes.",
    "aTest": "if (isK8sCoreKind('Deployment') !== true || isK8sCoreKind('Lambda') !== false) throw new Error('K8s kind checker failed');"
  },
  {
    "day": 17,
    "title": "Kubernetes Networking: ClusterIP, NodePort & LoadBalancer Services",
    "desc": "Route traffic inside and into Kubernetes clusters: internal ClusterIP, worker node NodePort (30000-32767), and cloud LoadBalancer services.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Kubernetes Networking: ClusterIP, NodePort & LoadBalancer Services.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kubernetes Service Type Traffic Dispatcher",
    "eDesc": "Implement function routeK8sServiceTraffic(serviceType, incomingTrafficOrigin) returning allowed status.",
    "eStarter": "function routeK8sServiceTraffic(svcType, origin) {\n  // ClusterIP is accessible only to INTERNAL_CLUSTER_POD; LoadBalancer is accessible to all origins.\n  \n}",
    "eHint": "ClusterIP is accessible only to INTERNAL_CLUSTER_POD; LoadBalancer is accessible to all origins.",
    "eTest": "if (routeK8sServiceTraffic('ClusterIP', 'PUBLIC_INTERNET').accessible !== false) throw new Error('ClusterIP must not be accessible from public internet');\nif (routeK8sServiceTraffic('LoadBalancer', 'PUBLIC_INTERNET').accessible !== true) throw new Error('LoadBalancer must be accessible from public internet');",
    "aTitle": "NodePort Range Validator",
    "aDesc": "Implement function isNodePortValid(port) checking range 30000-32767.",
    "aStarter": "function isNodePortValid(p) { return p >= 30000 && p <= 32767; }",
    "aHint": "Check 30000-32767.",
    "aTest": "if (isNodePortValid(31234) !== true || isNodePortValid(8080) !== false) throw new Error('NodePort range check failed');"
  },
  {
    "day": 18,
    "title": "Kubernetes Ingress Controllers & Automated TLS Termination",
    "desc": "Expose HTTP/HTTPS microservices through Ingress resources (Nginx Ingress / Traefik / AWS ALB Controller) and cert-manager Let's Encrypt certificates.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Kubernetes Ingress Controllers & Automated TLS Termination.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kubernetes Ingress Path Router",
    "eDesc": "Implement function resolveIngressPath(ingressRules, requestPath) resolving target backend service and port.",
    "eStarter": "function resolveIngressPath(rules, path) {\n  // Iterate rules; match prefix on path.\n  \n}",
    "eHint": "Iterate rules; match prefix on path.",
    "eTest": "const rules = [\n  { path: '/api/v1', backendService: 'api-service', backendPort: 8080 },\n  { path: '/', backendService: 'frontend-service', backendPort: 3000 }\n];\nif (resolveIngressPath(rules, '/api/v1/users').backendService !== 'api-service') throw new Error('Ingress API route failed');\nif (resolveIngressPath(rules, '/about').backendService !== 'frontend-service') throw new Error('Ingress frontend route failed');",
    "aTitle": "Ingress Host Matcher",
    "aDesc": "Implement function matchIngressHost(hostRule, requestHost) evaluating host matching.",
    "aStarter": "function matchIngressHost(rule, req) { return rule === '*' || rule === req; }",
    "aHint": "Match wildcard or exact.",
    "aTest": "if (matchIngressHost('api.pinit.io', 'api.pinit.io') !== true) throw new Error('Host match failed');"
  },
  {
    "day": 19,
    "title": "Kubernetes ConfigMaps, Secrets & Environment Volume Mounting",
    "desc": "Decouple configuration from code using ConfigMaps and base64-encoded Kubernetes Secrets mounted as environment variables or volume files.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Kubernetes ConfigMaps, Secrets & Environment Volume Mounting.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kubernetes Base64 Secret Decoder & Volume Mounter",
    "eDesc": "Implement function decodeK8sSecret(secretManifest) decoding base64 data attributes into plaintext memory map.",
    "eStarter": "function decodeK8sSecret(manifest) {\n  // Decode each base64 value in manifest.data.\n  \n}",
    "eHint": "Decode each base64 value in manifest.data.",
    "eTest": "const manifest = { data: { DB_PASSWORD: Buffer.from('superSecret123').toString('base64') } };\nif (decodeK8sSecret(manifest).DB_PASSWORD !== 'superSecret123') throw new Error('K8s secret decode failed');\nconst multi = { data: { USER: Buffer.from('admin').toString('base64'), PASS: Buffer.from('secret').toString('base64') } };\nif (decodeK8sSecret(multi).USER !== 'admin' || decodeK8sSecret(multi).PASS !== 'secret') throw new Error('Multi-key K8s secret decode failed');",
    "aTitle": "Secret Base64 Encoder",
    "aDesc": "Implement function encodeK8sSecret(val) encoding string to base64.",
    "aStarter": "function encodeK8sSecret(v) { return Buffer.from(v).toString('base64'); }",
    "aHint": "Buffer base64 encode.",
    "aTest": "if (encodeK8sSecret('hello') !== 'aGVsbG8=') throw new Error('Base64 encode failed');"
  },
  {
    "day": 20,
    "title": "Kubernetes Health Probes: Liveness, Readiness & Startup Probes",
    "desc": "Enforce pod lifecycle health: Liveness (Restarts stuck deadlocked containers), Readiness (Controls load balancer traffic routing), and Startup Probes.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Kubernetes Health Probes: Liveness, Readiness & Startup Probes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kubernetes Pod Health Probe Controller",
    "eDesc": "Implement function evaluateK8sProbes(livenessHealthy, readinessHealthy, consecutiveFails) returning Kubelet action (RESTART, DETACH_TRAFFIC, HEALTHY).",
    "eStarter": "function evaluateK8sProbes(isLive, isReady, fails) {\n  // Failing liveness with 3 fails restarts pod; failing readiness detaches traffic.\n  \n}",
    "eHint": "Failing liveness with 3 fails restarts pod; failing readiness detaches traffic.",
    "eTest": "if (evaluateK8sProbes(false, true, 3).action !== 'KUBELET_RESTART_POD') throw new Error('Liveness failure must restart pod');\nif (evaluateK8sProbes(true, false, 0).action !== 'DETACH_FROM_SERVICE_ENDPOINTS') throw new Error('Readiness failure must detach traffic');\nif (evaluateK8sProbes(true, true, 0).receiveTraffic !== true) throw new Error('Healthy pod must receive traffic');",
    "aTitle": "Probe Failure Threshold Counter",
    "aDesc": "Implement function isThresholdReached(consecutiveFails, threshold = 3) returning true if fails >= threshold.",
    "aStarter": "function isThresholdReached(f, t = 3) { return f >= t; }",
    "aHint": "Check >= threshold.",
    "aTest": "if (isThresholdReached(3, 3) !== true || isThresholdReached(1, 3) !== false) throw new Error('Threshold check failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA",
    "desc": "Milestone 3: Build a production-grade Kubernetes cluster topology: Multi-Replica Deployment + Ingress Controller + TLS + Horizontal Pod Autoscaler (HPA) scaling pods dynamically from 2 to 20 under load.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Horizontal Pod Autoscaler (HPA) Capacity Formula Engine",
    "eDesc": "Implement function calculateHpaDesiredReplicas(currentReplicas, currentMetricVal, targetMetricVal, minReplicas, maxReplicas) calculating desired pod count.",
    "eStarter": "function calculateHpaDesiredReplicas(current, currentMetric, targetMetric, min, max) {\n  // Formula is ceil(current * (currentMetric / targetMetric)), clamped between min and max.\n  \n}",
    "eHint": "Formula is ceil(current * (currentMetric / targetMetric)), clamped between min and max.",
    "eTest": "if (calculateHpaDesiredReplicas(2, 80, 50, 2, 20) !== 4) throw new Error('HPA scale out failed: ceil(2 * (80/50)) = 4 pods');\nif (calculateHpaDesiredReplicas(10, 10, 50, 2, 20) !== 2) throw new Error('HPA scale in clamped to min 2 pods');",
    "aTitle": "K8s Resource CPU Formatter",
    "aDesc": "Implement function parseCpuMillicores(str) parsing '500m' to 500 or '2' to 2000.",
    "aStarter": "function parseCpuMillicores(s) {\n  // Parse millicores.\n  \n}",
    "aHint": "Parse millicores.",
    "aTest": "if (parseCpuMillicores('500m') !== 500 || parseCpuMillicores('2') !== 2000) throw new Error('CPU parser failed');"
  },
  {
    "day": 22,
    "title": "Helm Package Management & Multi-Environment Values",
    "desc": "Package Kubernetes applications into versioned Helm Charts: `Chart.yaml`, Go template syntax (`{{ .Values.replicaCount }}`), and `values-dev.yaml` vs `values-prod.yaml`.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Helm Package Management & Multi-Environment Values.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Helm Template Values Renderer Simulator",
    "eDesc": "Implement function renderHelmTemplate(templateString, values) interpolating template placeholders with values object.",
    "eStarter": "function renderHelmTemplate(tmpl, values) {\n  // Replace {{ .Values.key }} with corresponding value from values object.\n  \n}",
    "eHint": "Replace {{ .Values.key }} with corresponding value from values object.",
    "eTest": "const tmpl = 'replicas: {{ .Values.replicaCount }}\\nimage: {{ .Values.image.repository }}:{{ .Values.image.tag }}';\nconst vals = { replicaCount: 3, image: { repository: 'pinit/api', tag: 'v1.2.0' } };\nconst rendered = renderHelmTemplate(tmpl, vals);\nif (!rendered.includes('replicas: 3') || !rendered.includes('image: pinit/api:v1.2.0')) throw new Error('Helm template rendering failed');",
    "aTitle": "Helm Chart Version Validator",
    "aDesc": "Implement function isValidChartVersion(v) verifying SemVer string.",
    "aStarter": "function isValidChartVersion(v) { return /^\\d+\\.\\d+\\.\\d+$/.test(v); }",
    "aHint": "Check X.Y.Z regex.",
    "aTest": "if (isValidChartVersion('1.0.0') !== true || isValidChartVersion('v1') !== false) throw new Error('Chart version check failed');"
  },
  {
    "day": 23,
    "title": "GitOps Continuous Delivery with ArgoCD & Declarative Sync",
    "desc": "Implement GitOps delivery: Git repository as single source of truth, automated ArgoCD reconciliation loops, and Out-of-Sync / Degraded state detection.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of GitOps Continuous Delivery with ArgoCD & Declarative Sync.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ArgoCD GitOps Declarative Reconciliation Engine",
    "eDesc": "Implement function reconcileGitOpsState(gitManifestHash, clusterManifestHash, autoSyncEnabled) determining Sync and Out-of-Sync actions.",
    "eStarter": "function reconcileGitOpsState(gitHash, clusterHash, autoSync) {\n  // If gitHash === clusterHash return Synced; if different and autoSync return Syncing, else OutOfSync.\n  \n}",
    "eHint": "If gitHash === clusterHash return Synced; if different and autoSync return Syncing, else OutOfSync.",
    "eTest": "if (reconcileGitOpsState('hash_abc', 'hash_abc', true).status !== 'Synced') throw new Error('In-sync state failed');\nif (reconcileGitOpsState('hash_new', 'hash_old', true).action !== 'APPLYING_GIT_MANIFESTS_TO_CLUSTER') throw new Error('Auto-sync failed');\nif (reconcileGitOpsState('hash_new', 'hash_old', false).status !== 'OutOfSync') throw new Error('Manual sync state failed');",
    "aTitle": "Git Commit SHA Formatter",
    "aDesc": "Implement function formatShortSha(sha) returning first 7 characters.",
    "aStarter": "function formatShortSha(sha) { return sha.slice(0, 7); }",
    "aHint": "Slice first 7 chars.",
    "aTest": "if (formatShortSha('e1a2b3c4d5e6f7') !== 'e1a2b3c') throw new Error('Short SHA failed');"
  },
  {
    "day": 24,
    "title": "Prometheus Metric Scraping & PromQL Alerting Rules",
    "desc": "Monitor Kubernetes clusters with Prometheus: pull-based metric scraping (`/metrics`), PromQL time-series queries (rate, histogram_quantile), and Alertmanager.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Prometheus Metric Scraping & PromQL Alerting Rules.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "PromQL Error Rate SLA Expression Evaluator",
    "eDesc": "Implement function evaluatePromQlErrorRate(requestTotalCount, request5xxCount, thresholdPercent = 0.01) returning ALERT if 5xx rate > 1%.",
    "eStarter": "function evaluatePromQlErrorRate(total, errors5xx, threshold = 0.01) {\n  // Calculate rate = errors5xx / total; fire alert if rate > threshold.\n  \n}",
    "eHint": "Calculate rate = errors5xx / total; fire alert if rate > threshold.",
    "eTest": "const clean = evaluatePromQlErrorRate(10000, 20, 0.01); // 0.2% error rate\nif (clean.alertState !== 'OK') throw new Error('0.2% error rate should be OK');\nconst broken = evaluatePromQlErrorRate(1000, 45, 0.01); // 4.5% error rate\nif (broken.alertState !== 'FIRING_HIGH_ERROR_RATE') throw new Error('4.5% error rate must fire alert');",
    "aTitle": "Prometheus Metric Line Formatter",
    "aDesc": "Implement function formatPrometheusMetric(name, labels, val) formatting Prometheus exposition text format.",
    "aStarter": "function formatPrometheusMetric(n, l, v) {\n  // Format name{label=val} value.\n  \n}",
    "aHint": "Format name{label=val} value.",
    "aTest": "if (formatPrometheusMetric('http_requests_total', { method: 'GET' }, 42) !== 'http_requests_total{method=\"GET\"} 42') throw new Error('Metric format failed');"
  },
  {
    "day": 25,
    "title": "Grafana Dashboards & Distributed Tracing with OpenTelemetry",
    "desc": "Visualize infrastructure telemetry in Grafana dashboards and trace distributed transactions across microservices with OpenTelemetry & Jaeger.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Grafana Dashboards & Distributed Tracing with OpenTelemetry.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "OpenTelemetry Span Trace Context Propagator",
    "eDesc": "Implement function propagateTraceContext(traceId, currentSpanId) generating next child span with W3C `traceparent` header.",
    "eStarter": "function propagateTraceContext(traceId, currentSpanId) {\n  // Return traceId, parentSpanId, newSpanId, and w3cTraceparent.\n  \n}",
    "eHint": "Return traceId, parentSpanId, newSpanId, and w3cTraceparent.",
    "eTest": "const ctx = propagateTraceContext('4bf92f3577b34da6a3ce929d0e0e4736', '00f067aa0ba902b7');\nif (ctx.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || ctx.parentSpanId !== '00f067aa0ba902b7' || !ctx.w3cTraceparent.startsWith('00-4bf92f3577b34da6a3ce929d0e0e4736-')) throw new Error('Trace propagation failed');",
    "aTitle": "W3C Traceparent Header Extractor",
    "aDesc": "Implement function extractTraceId(header) extracting traceId.",
    "aStarter": "function extractTraceId(h) { return h.split('-')[1]; }",
    "aHint": "Split by hyphen and get index 1.",
    "aTest": "if (extractTraceId('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01') !== '4bf92f3577b34da6a3ce929d0e0e4736') throw new Error('TraceId extraction failed');"
  },
  {
    "day": 26,
    "title": "Centralized Logging with Fluentbit, Elasticsearch & Kibana",
    "desc": "Aggregate distributed container stdout/stderr logs with Fluentbit daemonsets, structured JSON parsing, and Elasticsearch log indexing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Centralized Logging with Fluentbit, Elasticsearch & Kibana.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Fluentbit Structured JSON Log Parser & Redactor",
    "eDesc": "Implement function parseAndRedactLog(rawLogString, sensitiveKeys = ['password', 'token', 'authorization']) parsing JSON and redacting secrets.",
    "eStarter": "function parseAndRedactLog(raw, sensitive = ['password', 'token', 'authorization']) {\n  // Parse JSON and replace sensitive keys with [REDACTED].\n  \n}",
    "eHint": "Parse JSON and replace sensitive keys with [REDACTED].",
    "eTest": "const raw = JSON.stringify({ level: 'info', user: 'Alex', token: 'secret_abc123' });\nconst res = parseAndRedactLog(raw);\nif (!res.success || res.log.token !== '[REDACTED]' || res.log.user !== 'Alex') throw new Error('Log redaction failed');",
    "aTitle": "Log Level Severity Sorter",
    "aDesc": "Implement function isLogLevelCritical(level) returning true for ERROR and FATAL.",
    "aStarter": "function isLogLevelCritical(l) { return ['ERROR', 'FATAL', 'CRITICAL'].includes(l.toUpperCase()); }",
    "aHint": "Check array includes.",
    "aTest": "if (isLogLevelCritical('ERROR') !== true || isLogLevelCritical('INFO') !== false) throw new Error('Log level check failed');"
  },
  {
    "day": 27,
    "title": "Zero-Downtime Blue-Green & Canary Rollout Orchestration",
    "desc": "Orchestrate zero-downtime deployment strategies with Kubernetes: RollingUpdate maxSurge/maxUnavailable, Blue-Green cutover, and Argo Rollouts canary traffic shifting.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Zero-Downtime Blue-Green & Canary Rollout Orchestration.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Canary Rollout Automated Error Analyzer & Rollback Engine",
    "eDesc": "Implement function evaluateCanaryStep(canaryWeight, errorRate, errorThreshold = 0.02) returning PROMOTE, HOLD, or ROLLBACK.",
    "eStarter": "function evaluateCanaryStep(weight, errRate, threshold = 0.02) {\n  // If errRate > threshold rollback to 0; else increment canary weight by 20%.\n  \n}",
    "eHint": "If errRate > threshold rollback to 0; else increment canary weight by 20%.",
    "eTest": "const healthy = evaluateCanaryStep(20, 0.005, 0.02);\nif (healthy.decision !== 'PROGRESS_TO_NEXT_CANARY_STEP' || healthy.targetWeight !== 40) throw new Error('Canary progression failed');\nconst degraded = evaluateCanaryStep(40, 0.05, 0.02);\nif (degraded.decision !== 'AUTOMATED_ROLLBACK' || degraded.targetWeight !== 0) throw new Error('Canary rollback failed');",
    "aTitle": "RollingUpdate Surge Calculator",
    "aDesc": "Implement function calculateMaxSurgePods(replicas, surgePercent = 0.25) calculating max pods during rollout.",
    "aStarter": "function calculateMaxSurgePods(r, p = 0.25) { return r + Math.ceil(r * p); }",
    "aHint": "Add ceil(r * p).",
    "aTest": "if (calculateMaxSurgePods(4, 0.25) !== 5) throw new Error('Surge calc failed');"
  },
  {
    "day": 28,
    "title": "DevSecOps: Automated SAST, DAST & Software Supply Chain Security",
    "desc": "Embed security into CI/CD pipelines: Static Application Security Testing (SAST), Dynamic Analysis (DAST), Software Bill of Materials (SBOM), and dependency audit.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of DevSecOps: Automated SAST, DAST & Software Supply Chain Security.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DevSecOps Security Gate Pipeline Enforcement Engine",
    "eDesc": "Implement function evaluateDevSecOpsGate(sastResults, scaResults, secretScanResults) verifying 0 critical vulnerabilities and 0 hardcoded secrets.",
    "eStarter": "function evaluateDevSecOpsGate(sast, sca, secrets) {\n  // Approved only if sastPassed, scaPassed, and secretsPassed are all true.\n  \n}",
    "eHint": "Approved only if sastPassed, scaPassed, and secretsPassed are all true.",
    "eTest": "const clean = { criticalIssues: 0 }, scaClean = { vulnerablePackages: [] }, secClean = { leakedKeysCount: 0 };\nif (evaluateDevSecOpsGate(clean, scaClean, secClean).approvedForProduction !== true) throw new Error('Clean security gate failed');\nconst dirty = { criticalIssues: 1 };\nif (evaluateDevSecOpsGate(dirty, scaClean, secClean).approvedForProduction !== false) throw new Error('Vulnerable gate must reject');",
    "aTitle": "SBOM Component Formatter",
    "aDesc": "Implement function formatSbomEntry(name, version, license) returning { name, version, license }.",
    "aStarter": "function formatSbomEntry(n, v, l) { return { name: n, version: v, license: l }; }",
    "aHint": "Return object.",
    "aTest": "if (formatSbomEntry('express', '4.18.2', 'MIT').license !== 'MIT') throw new Error('SBOM format failed');"
  },
  {
    "day": 29,
    "title": "Zero-Downtime Database Migrations & The Expand-Contract Pattern",
    "desc": "Safely execute relational database migrations across live Kubernetes rolling updates without dropping connections using Expand-and-Contract.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Zero-Downtime Database Migrations & The Expand-Contract Pattern.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Database Expand-Contract Migration Phase Evaluator",
    "eDesc": "Implement function evaluateMigrationCompatibility(schemaPhase, appVersion) ensuring backward compatibility during rolling deployments.",
    "eStarter": "function evaluateMigrationCompatibility(phase, appVer) {\n  // EXPAND is always compatible; CONTRACT fails if old app version v1.0.0_OLD attempts to query removed column.\n  \n}",
    "eHint": "EXPAND is always compatible; CONTRACT fails if old app version v1.0.0_OLD attempts to query removed column.",
    "eTest": "if (evaluateMigrationCompatibility('EXPAND', 'v1.0.0_OLD').isCompatible !== true) throw new Error('Expand phase must be backward compatible');\nif (evaluateMigrationCompatibility('CONTRACT', 'v1.0.0_OLD').isCompatible !== false) throw new Error('Contracting before app upgrade must fail');",
    "aTitle": "Migration Version Formatter",
    "aDesc": "Implement function formatMigrationFilename(versionNum, name) returning YYYYMMDDHHMMSS_name.sql.",
    "aStarter": "function formatMigrationFilename(v, n) { return `${v}_${n}.sql`; }",
    "aHint": "Join with underscore.",
    "aTest": "if (formatMigrationFilename('20260824120000', 'add_users_table') !== '20260824120000_add_users_table.sql') throw new Error('Migration format failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise GitOps Continuous Delivery & Zero-Downtime Multi-Cluster Kubernetes Platform",
    "desc": "Final Capstone Synthesis: The complete production enterprise DevOps & GitOps platform featuring GitHub Actions CI, ArgoCD GitOps, Helm Charts, Prometheus & Grafana telemetry, DevSecOps gates, and zero-downtime Canary deployments.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise GitOps Continuous Delivery & Zero-Downtime Multi-Cluster Kubernetes Platform.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone Enterprise GitOps Multi-Cluster Release Controller",
    "eDesc": "Implement function orchestrateEnterpriseRelease(releasePayload) coordinating CI validation, security scanning, ArgoCD sync, and canary verification across Multi-Cluster Kubernetes.",
    "eStarter": "async function orchestrateEnterpriseRelease(payload) {\n  // Verify ciPassed and securityScanPassed, then sync all targetClusters.\n  \n}",
    "eHint": "Verify ciPassed and securityScanPassed, then sync all targetClusters.",
    "eTest": "const release = {\n  version: 'v2.5.0',\n  ciPassed: true,\n  securityScanPassed: true,\n  targetClusters: ['k8s-us-east-prod', 'k8s-eu-west-prod']\n};\nconst res = await orchestrateEnterpriseRelease(release);\nif (!res.success || res.syncedClusters.length !== 2 || res.version !== 'v2.5.0') throw new Error('Enterprise GitOps release orchestration failed');",
    "aTitle": "Capstone Platform Certification Auditor",
    "aDesc": "Implement function auditDevopsCapstoneStatus() returning certification grade.",
    "aStarter": "function auditDevopsCapstoneStatus() { return { certified: true, score: '100/100', tier: 'ENTERPRISE_GITOPS_CERTIFIED' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (auditDevopsCapstoneStatus().certified !== true) throw new Error('Capstone audit failed');"
  }
];

export const DEVOPS_30_DAYS_QUESTS: CourseQuest[] = DEVOPS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('devops', idx + 1, cfg)
);
