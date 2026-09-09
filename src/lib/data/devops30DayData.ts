import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const DEVOPS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "DevOps Culture, CI/CD & The 12-Factor App",
    "desc": "Establish core DevOps principles: CALMS framework (Culture, Automation, Lean, Measurement, Sharing), CI/CD pipelines, and The 12-Factor App methodology (declarative formats, explicit dependencies, strict separation of config from code).",
    "syllabus": [
      "The CALMS Framework: Bridging development velocity and operational reliability.",
      "The 12-Factor Methodology: Factor III (Store config in the environment) and Factor IX (Disposability: fast startup and graceful shutdown).",
      "Continuous Integration (CI) vs Continuous Delivery (CD) vs Continuous Deployment."
    ],
    "eTitle": "12-Factor Config Environment Evaluator",
    "eDesc": "Implement function `validateTwelveFactorConfig(configObject)` checking that database credentials and API secrets are read strictly from environment variables.",
    "eStarter": "function validateTwelveFactorConfig(config) {\n  // TODO: Validate that config has no hardcoded secrets and environment variables are strictly loaded\n  \n}",
    "eHint": "Check if config contains forbidden hardcoded keywords like 'password123' or 'secret_key' in plain strings; verify databaseUrl starts with 'process.env' or valid env prefix; return { isTwelveFactorCompliant: boolean, violations: string[] }.",
    "eTest": "const cleanConfig = { databaseUrl: 'postgres://${process.env.DB_USER}:${process.env.DB_PASS}@db:5432/app', isDebug: false };\nconst res1 = validateTwelveFactorConfig(cleanConfig);\nif (!res1.isTwelveFactorCompliant || res1.violations.length !== 0) throw new Error('Clean config was rejected');\nconst hardcoded = { databaseUrl: 'postgres://admin:password123@db:5432/app', isDebug: true };\nconst res2 = validateTwelveFactorConfig(hardcoded);\nif (res2.isTwelveFactorCompliant || !res2.violations.includes('HARDCODED_PASSWORD_DETECTED')) throw new Error('Hardcoded credentials were not flagged');\nconst emptyConfig = validateTwelveFactorConfig({});\nif (!emptyConfig.isTwelveFactorCompliant) throw new Error('Empty config evaluation failed');",
    "aTitle": "CI/CD Pipeline Stage Classifier",
    "aDesc": "Implement function `classifyPipelineTrigger(gitEvent, branchName)` returning 'CONTINUOUS_INTEGRATION', 'CONTINUOUS_DELIVERY', or 'NOOP'.",
    "aStarter": "function classifyPipelineTrigger(event, branch) {\n  // TODO: Map pull_request to CONTINUOUS_INTEGRATION, push to main to CONTINUOUS_DELIVERY, other branches to NOOP\n  \n}",
    "aHint": "Check if gitEvent === 'pull_request' -> return 'CONTINUOUS_INTEGRATION'; if gitEvent === 'push' && branchName === 'main' -> return 'CONTINUOUS_DELIVERY'; else return 'NOOP'.",
    "aTest": "if (classifyPipelineTrigger('pull_request', 'feat-login') !== 'CONTINUOUS_INTEGRATION') throw new Error('PR trigger classification failed');\nif (classifyPipelineTrigger('push', 'main') !== 'CONTINUOUS_DELIVERY') throw new Error('Main push trigger classification failed');\nif (classifyPipelineTrigger('push', 'dev') !== 'NOOP') throw new Error('Feature branch push should return NOOP');"
  },
  {
    "day": 2,
    "title": "Linux Administration, POSIX Signals & Process Daemons",
    "desc": "Master production Linux operations: PID 1 init process responsibilities, standard streams (stdin, stdout, stderr), POSIX signals (SIGTERM, SIGKILL, SIGHUP, SIGINT), and systemd daemon management.",
    "syllabus": [
      "The PID 1 Problem in Containers: Handling orphaned zombie processes and forwarding termination signals.",
      "POSIX Signals: SIGTERM (15: Graceful termination request) vs SIGKILL (9: Uncatchable forced kill) vs SIGHUP (1: Reload config).",
      "Process Lifecycle: Graceful connection draining and exit status codes (0 = Success, 1-255 = Failure)."
    ],
    "eTitle": "Linux Process Signal Trap & Graceful Shutdown Controller",
    "eDesc": "Implement function `handleProcessSignal(signalName, activeConnectionsCount, shutdownTimeoutMs)` orchestrating graceful container termination.",
    "eStarter": "function handleProcessSignal(signal, connections, timeoutMs) {\n  // TODO: Handle SIGTERM, SIGKILL, and SIGHUP appropriately with graceful draining logic\n  \n}",
    "eHint": "If signal === 'SIGTERM', return { action: 'DRAIN_CONNECTIONS', shouldExit: true, exitCode: 0, timeout: shutdownTimeoutMs }; if signal === 'SIGKILL', return { action: 'FORCE_IMMEDIATE_TERMINATION', shouldExit: true, exitCode: 137 }; if signal === 'SIGHUP', return { action: 'RELOAD_CONFIGURATION', shouldExit: false, exitCode: null }; return { action: 'IGNORE', shouldExit: false, exitCode: null }.",
    "eTest": "const term = handleProcessSignal('SIGTERM', 25, 30000);\nif (term.action !== 'DRAIN_CONNECTIONS' || !term.shouldExit || term.exitCode !== 0) throw new Error('SIGTERM graceful drain failed');\nconst kill = handleProcessSignal('SIGKILL', 25, 30000);\nif (kill.action !== 'FORCE_IMMEDIATE_TERMINATION' || kill.exitCode !== 137) throw new Error('SIGKILL forced termination failed');\nconst hup = handleProcessSignal('SIGHUP', 0, 0);\nif (hup.action !== 'RELOAD_CONFIGURATION' || hup.shouldExit) throw new Error('SIGHUP config reload failed');",
    "aTitle": "Linux Exit Code Status Formatter",
    "aDesc": "Implement function `formatExitStatus(statusCode)` returning a human-readable interpretation of Linux process exit codes.",
    "aStarter": "function formatExitStatus(code) {\n  // TODO: Map 0 to SUCCESS, 137 to KILLED_BY_SIGKILL_OOM, 143 to TERMINATED_BY_SIGTERM, and others to ERROR\n  \n}",
    "aHint": "Check if statusCode === 0 -> 'SUCCESS'; 137 -> 'KILLED_BY_SIGKILL_OOM'; 143 -> 'TERMINATED_BY_SIGTERM'; default -> 'GENERAL_ERROR'.",
    "aTest": "if (formatExitStatus(0) !== 'SUCCESS' || formatExitStatus(137) !== 'KILLED_BY_SIGKILL_OOM') throw new Error('Exit status formatter failed');\nif (formatExitStatus(143) !== 'TERMINATED_BY_SIGTERM' || formatExitStatus(1) !== 'GENERAL_ERROR') throw new Error('General error code formatting failed');"
  },
  {
    "day": 3,
    "title": "Docker Architecture, Copy-on-Write & Image Layer Caching",
    "desc": "Understand container virtualization: Linux Namespaces (PID, NET, MNT, IPC, UTS), Cgroups (CPU/RAM limits), UnionFS (Overlay2), Copy-on-Write storage, and optimizing Docker build cache layers.",
    "syllabus": [
      "Virtual Machines vs Containers: Hypervisor guest OS abstraction vs shared host Linux kernel isolation.",
      "Linux Kernel Primitives: Namespaces (What a process can see) and Cgroups (How much a process can use).",
      "Docker Image Layer Caching: Maximizing cache hits by ordering stable instructions (COPY package.json) before volatile code (COPY . .)."
    ],
    "eTitle": "Docker Layer Caching Build Order Auditor",
    "eDesc": "Implement function `auditDockerfileLayerOrder(dockerfileLines)` verifying that dependency installation precedes source code copy commands to maximize cache hits.",
    "eStarter": "function auditDockerfileLayerOrder(lines) {\n  // TODO: Verify COPY package*.json appears before RUN npm install, and both appear before COPY . .\n  \n}",
    "eHint": "Find line index of 'COPY package' or 'COPY requirements.txt', line index of 'RUN npm' / 'RUN pip', and line index of 'COPY . .'; verify pkgIdx < runIdx < srcIdx; return { isOptimallyCached: boolean, reason: string }.",
    "eTest": "const optimal = [\n  'FROM node:20-alpine',\n  'WORKDIR /app',\n  'COPY package*.json ./',\n  'RUN npm ci',\n  'COPY . .',\n  'CMD [\"node\", \"server.js\"]'\n];\nconst res1 = auditDockerfileLayerOrder(optimal);\nif (!res1.isOptimallyCached) throw new Error('Optimal Dockerfile layers were rejected');\nconst unoptimized = [\n  'FROM node:20-alpine',\n  'WORKDIR /app',\n  'COPY . .',\n  'RUN npm ci'\n];\nconst res2 = auditDockerfileLayerOrder(unoptimized);\nif (res2.isOptimallyCached) throw new Error('Unoptimized Dockerfile should fail cache audit');\nconst emptyDf = auditDockerfileLayerOrder([]);\nif (emptyDf.isOptimallyCached) throw new Error('Empty Dockerfile should fail audit');",
    "aTitle": "Docker Image Tag SemVer Formatter",
    "aDesc": "Implement function `formatDockerImageTag(repository, version, gitCommitSha)` returning fully qualified image tag `repo:version-sha7`.",
    "aStarter": "function formatDockerImageTag(repo, ver, sha) {\n  // TODO: Combine repository, version, and first 7 characters of gitCommitSha into standard tag format\n  \n}",
    "aHint": "Extract shortSha = gitCommitSha.slice(0, 7); return `${repository}:${version}-${shortSha}`; verify string structure.",
    "aTest": "const tag = formatDockerImageTag('pinit/api', 'v1.4.0', 'e1a2b3c4d5e6');\nif (tag !== 'pinit/api:v1.4.0-e1a2b3c') throw new Error('Docker image tag formatting failed');\nif (formatDockerImageTag('app', '1.0', '123456789') !== 'app:1.0-1234567') throw new Error('Tag short sha failed');"
  },
  {
    "day": 4,
    "title": "Docker Multi-Stage Builds & Minimal Production Images",
    "desc": "Build secure, minimal production container images using multi-stage builds: Compiling in build stages, copying runtime artifacts into Alpine/Distroless bases, and eliminating build toolchains and attack surfaces.",
    "syllabus": [
      "Multi-Stage Build Pattern: `FROM golang:1.22 AS builder` -> `FROM gcr.io/distroless/static-debian12`.",
      "Distroless & Alpine Bases: Stripping package managers (apt/apk), shells (bash/sh), and unnecessary debuggers from final artifacts.",
      "Image Size Reduction: Slashing image footprint from 1GB+ development environments to <30MB production containers."
    ],
    "eTitle": "Multi-Stage Docker Image Size & Security Validator",
    "eDesc": "Implement function `validateMultiStageImageConfig(stagesList)` verifying build vs runtime separation and ensuring final base is a hardened minimal image.",
    "eStarter": "function validateMultiStageImageConfig(stages) {\n  // TODO: Verify at least 2 stages, builder stage compiles assets, and final stage uses distroless or alpine base\n  \n}",
    "eHint": "Verify stages.length >= 2; verify first stage has isBuilder === true; verify last stage baseImage contains 'alpine', 'distroless', or 'scratch'; return { isValidMultiStage: boolean, estimatedReductionPct: number }.",
    "eTest": "const stages = [\n  { name: 'builder', baseImage: 'node:20-bookworm', isBuilder: true },\n  { name: 'runtime', baseImage: 'gcr.io/distroless/nodejs20-debian12', isBuilder: false }\n];\nconst res = validateMultiStageImageConfig(stages);\nif (!res.isValidMultiStage || res.estimatedReductionPct < 70) throw new Error('Valid multi-stage config was rejected');\nconst singleStage = [{ name: 'dev', baseImage: 'node:20-bookworm', isBuilder: false }];\nif (validateMultiStageImageConfig(singleStage).isValidMultiStage !== false) throw new Error('Single stage config should fail multi-stage validation');\nconst insecureFinal = [\n  { name: 'builder', baseImage: 'golang:1.22', isBuilder: true },\n  { name: 'runtime', baseImage: 'ubuntu:22.04', isBuilder: false }\n];\nif (validateMultiStageImageConfig(insecureFinal).isValidMultiStage !== false) throw new Error('Ubuntu base in final stage should be rejected for hardened builds');",
    "aTitle": "Image Size Reduction Percentage Calculator",
    "aDesc": "Implement function `calculateImageSizeReduction(devSizeBytes, prodSizeBytes)` computing percentage footprint reduction.",
    "aStarter": "function calculateImageSizeReduction(devBytes, prodBytes) {\n  // TODO: Compute reduction = ((devBytes - prodBytes) / devBytes) * 100, formatted to 2 decimal places\n  \n}",
    "aHint": "Compute ((devSizeBytes - prodSizeBytes) / devSizeBytes) * 100; return Number(reduction.toFixed(2));",
    "aTest": "const red = calculateImageSizeReduction(1073741824, 52428800); // 1024MB to 50MB = 95.12%\nif (red !== 95.12) throw new Error('Image size reduction calculation failed');\nif (calculateImageSizeReduction(100, 100) !== 0.00) throw new Error('Zero reduction check failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose",
    "desc": "Milestone 1: Orchestrate a production-grade multi-container application: Frontend (Nginx), Backend (Node.js/Go), Database (PostgreSQL), Cache (Redis), private bridge networks, environment files (.env), and volume persistence.",
    "syllabus": [
      "Docker Compose Spec: `services`, `networks`, `volumes`, `depends_on` (with `condition: service_healthy`).",
      "Internal Service Discovery: Automatic DNS resolution across Docker user-defined bridge networks.",
      "Persistent Data Storage: Named volumes vs bind mounts for database state isolation."
    ],
    "eTitle": "Docker Compose Dependency & DNS Resolution Engine",
    "eDesc": "Implement function `simulateComposeStartupOrder(servicesConfig)` determining correct boot sequence based on `depends_on` topology.",
    "eStarter": "function simulateComposeStartupOrder(services) {\n  // TODO: Perform topological sort on services array based on depends_on dependencies\n  \n}",
    "eHint": "Build dependency graph from services[name].depends_on; perform topological sort; if circular dependency detected return { hasCycle: true }; else return { startupOrder: string[], hasCycle: false }.",
    "eTest": "const services = {\n  web: { depends_on: ['api'] },\n  api: { depends_on: ['db', 'redis'] },\n  db: { depends_on: [] },\n  redis: { depends_on: [] }\n};\nconst res = simulateComposeStartupOrder(services);\nif (res.hasCycle || res.startupOrder[res.startupOrder.length - 1] !== 'web') throw new Error('Topological compose order failed');\nconst dbIdx = res.startupOrder.indexOf('db');\nconst apiIdx = res.startupOrder.indexOf('api');\nif (dbIdx >= apiIdx) throw new Error('DB must start before API');\nconst cycle = {\n  a: { depends_on: ['b'] },\n  b: { depends_on: ['a'] }\n};\nif (simulateComposeStartupOrder(cycle).hasCycle !== true) throw new Error('Circular dependency was not detected');",
    "aTitle": "Docker Compose Healthcheck Configuration Validator",
    "aDesc": "Implement function `validateComposeHealthcheck(healthcheckConfig)` ensuring test command, interval, timeout, and retries are properly configured.",
    "aStarter": "function validateComposeHealthcheck(cfg) {\n  // TODO: Verify test command exists, interval is positive, and retries >= 1\n  \n}",
    "aHint": "Check cfg.test && Array.isArray(cfg.test) && cfg.interval && cfg.retries >= 1; return boolean.",
    "aTest": "const valid = { test: ['CMD', 'curl', '-f', 'http://localhost/health'], interval: '10s', timeout: '5s', retries: 3 };\nif (validateComposeHealthcheck(valid) !== true) throw new Error('Valid compose healthcheck was rejected');\nconst invalid = { test: null, retries: 0 };\nif (validateComposeHealthcheck(invalid) !== false) throw new Error('Invalid healthcheck should fail');"
  },
  {
    "day": 6,
    "title": "Docker Container Networking & Host/Bridge Port Mappings",
    "desc": "Configure container networking modes: Bridge (Default isolated network with NAT), Host (Zero overhead port binding), Overlay (Multi-host Swarm/K8s), and None (Isolated air-gapped sandboxes).",
    "syllabus": [
      "Docker Network Drivers: `bridge`, `host`, `overlay`, `macvlan`, `none`.",
      "Port Mapping Semantics: `HOST_PORT:CONTAINER_PORT` (e.g. `-p 8080:80`) and binding to localhost vs 0.0.0.0.",
      "Container DNS: Embedded Docker DNS resolver at `127.0.0.11` translating service names to container IPs."
    ],
    "eTitle": "Docker Port Forwarding Collision Detector",
    "eDesc": "Implement function `detectPortMappingCollisions(containerPortMappings)` detecting duplicate host port assignments across running containers.",
    "eStarter": "function detectPortMappingCollisions(mappings) {\n  // TODO: Check if any hostPort + hostIp combination is assigned to more than one container\n  \n}",
    "eHint": "Iterate mappings; track `${m.hostIp || '0.0.0.0'}:${m.hostPort}` in a Set or Map; record duplicates; return { hasCollision: boolean, conflictingPorts: number[] }.",
    "eTest": "const mappings = [\n  { container: 'c1', hostPort: 8080, containerPort: 80 },\n  { container: 'c2', hostPort: 8080, containerPort: 3000 },\n  { container: 'c3', hostPort: 9000, containerPort: 9000 }\n];\nconst res = detectPortMappingCollisions(mappings);\nif (!res.hasCollision || !res.conflictingPorts.includes(8080)) throw new Error('Port 8080 collision failed to detect');\nconst clean = [\n  { container: 'c1', hostPort: 8080, containerPort: 80 },\n  { container: 'c2', hostPort: 8081, containerPort: 80 }\n];\nif (detectPortMappingCollisions(clean).hasCollision !== false) throw new Error('Distinct host ports should pass');\nconst emptyMap = detectPortMappingCollisions([]);\nif (emptyMap.hasCollision !== false) throw new Error('Empty mappings should have no collision');",
    "aTitle": "Docker Port String Spec Parser",
    "aDesc": "Implement function `parseDockerPortString(portString)` parsing formats like '8080:80', '127.0.0.1:8080:80', or '80/tcp'.",
    "aStarter": "function parseDockerPortString(str) {\n  // TODO: Parse hostIp, hostPort, containerPort, and protocol from Docker CLI port specification string\n  \n}",
    "aHint": "Split on ':'; if 3 parts -> hostIp, hostPort, containerPort; if 2 parts -> hostPort, containerPort; extract protocol if /tcp or /udp present.",
    "aTest": "const p = parseDockerPortString('127.0.0.1:8080:80');\nif (p.hostIp !== '127.0.0.1' || p.hostPort !== 8080 || p.containerPort !== 80) throw new Error('Full port string parse failed');\nconst pSimple = parseDockerPortString('3000:3000');\nif (pSimple.hostPort !== 3000 || pSimple.containerPort !== 3000) throw new Error('Simple port parse failed');"
  },
  {
    "day": 7,
    "title": "Docker Security, Rootless Daemons & Read-Only Root Filesystems",
    "desc": "Harden container security: Dropping Linux capabilities (`--cap-drop ALL`), running as non-root users (`USER 10001`), read-only root filesystems (`--read-only`), and seccomp/AppArmor profiles.",
    "syllabus": [
      "The Non-Root Invariant: Never run container processes as root (`UID 0`) to prevent kernel privilege escalation.",
      "Linux Capabilities: Dropping `CAP_SYS_ADMIN`, `CAP_NET_RAW`, and retaining only `CAP_NET_BIND_SERVICE`.",
      "Immutable Containers: `--read-only` root filesystem with ephemeral `tmpfs` mounts for `/tmp` and `/run`."
    ],
    "eTitle": "Container Security Posture Evaluator",
    "eDesc": "Implement function `evaluateContainerSecurityPosture(securityContext)` auditing non-root execution, dropped capabilities, and read-only root filesystems.",
    "eStarter": "function evaluateContainerSecurityPosture(ctx) {\n  // TODO: Check runAsNonRoot, readOnlyRootFilesystem, and verify capabilities dropped include ALL\n  \n}",
    "eHint": "Audit rules: runAsNonRoot === true (Score +35), readOnlyRootFilesystem === true (Score +35), dropCapabilities.includes('ALL') (Score +30); return { securityScore: number, isHardened: boolean, grade: string }.",
    "eTest": "const hardened = {\n  runAsNonRoot: true,\n  readOnlyRootFilesystem: true,\n  dropCapabilities: ['ALL'],\n  addCapabilities: []\n};\nconst res = evaluateContainerSecurityPosture(hardened);\nif (res.securityScore !== 100 || !res.isHardened || res.grade !== 'PRODUCTION_HARDENED') throw new Error('Hardened container audit failed');\nconst rootContainer = {\n  runAsNonRoot: false,\n  readOnlyRootFilesystem: false,\n  dropCapabilities: []\n};\nconst badRes = evaluateContainerSecurityPosture(rootContainer);\nif (badRes.isHardened || badRes.securityScore !== 0) throw new Error('Root container should fail security audit');\nconst partial = { runAsNonRoot: true, readOnlyRootFilesystem: false, dropCapabilities: [] };\nif (evaluateContainerSecurityPosture(partial).securityScore !== 35) throw new Error('Partial security score failed');",
    "aTitle": "Linux Capability Allowlist Filter",
    "aDesc": "Implement function `filterSafeCapabilities(capabilitiesList)` stripping dangerous capabilities like SYS_ADMIN and RAW_SOCKET from allowed list.",
    "aStarter": "function filterSafeCapabilities(caps) {\n  // TODO: Remove SYS_ADMIN, RAW_SOCKET, and DAC_OVERRIDE from capabilitiesList\n  \n}",
    "aHint": "Filter out 'SYS_ADMIN', 'RAW_SOCKET', 'DAC_OVERRIDE', 'NET_ADMIN'; return array containing only safe capabilities.",
    "aTest": "const filtered = filterSafeCapabilities(['NET_BIND_SERVICE', 'SYS_ADMIN', 'CHOWN']);\nif (filtered.includes('SYS_ADMIN') || !filtered.includes('NET_BIND_SERVICE')) throw new Error('Capability filter failed');"
  },
  {
    "day": 8,
    "title": "Container Healthchecks, Restart Policies & Resource Limits",
    "desc": "Configure container self-healing: Docker HEALTHCHECK instructions (interval, timeout, start-period, retries), Restart Policies (`unless-stopped`, `on-failure`), and Cgroup resource constraints (`--memory`, `--cpus`).",
    "syllabus": [
      "Healthcheck Lifecycle: `starting` (start-period grace) -> `healthy` -> `unhealthy` (after max retries).",
      "Restart Policies: `no`, `always`, `unless-stopped`, `on-failure:5`.",
      "Out of Memory (OOM) Killer: Understanding kernel OOM score adjustment and container memory swapping."
    ],
    "eTitle": "Container Self-Healing & Restart Policy Manager",
    "eDesc": "Implement function `evaluateRestartAction(restartPolicy, exitCode, restartCount, maxRetries = 5)` determining whether container daemon should restart container.",
    "eStarter": "function evaluateRestartAction(policy, code, count, maxRetries = 5) {\n  // TODO: Determine if container should be restarted based on restartPolicy, exitCode, and restartCount\n  \n}",
    "eHint": "If policy === 'always' return { shouldRestart: true }; if policy === 'unless-stopped' return { shouldRestart: true }; if policy === 'on-failure' return { shouldRestart: code !== 0 && count < maxRetries }; return { shouldRestart: false }.",
    "eTest": "if (evaluateRestartAction('always', 0, 10).shouldRestart !== true) throw new Error('Always policy must restart on exit 0');\nif (evaluateRestartAction('on-failure', 1, 3, 5).shouldRestart !== true) throw new Error('On-failure should restart below max retries');\nif (evaluateRestartAction('on-failure', 1, 5, 5).shouldRestart !== false) throw new Error('On-failure should stop at max retries');\nif (evaluateRestartAction('no', 1, 0).shouldRestart !== false) throw new Error('No restart policy should never restart');",
    "aTitle": "Memory Limit Byte String Normalizer",
    "aDesc": "Implement function `normalizeMemoryBytes(memoryString)` converting human strings like '512m', '2g', '1024k' to integer bytes.",
    "aStarter": "function normalizeMemoryBytes(str) {\n  // TODO: Parse numeric value and unit suffix (k, m, g), returning total size in bytes\n  \n}",
    "aHint": "Extract number and multiplier: 'k' -> 1024; 'm' -> 1024*1024; 'g' -> 1024*1024*1024; multiply and return integer.",
    "aTest": "if (normalizeMemoryBytes('512m') !== 536870912 || normalizeMemoryBytes('1g') !== 1073741824) throw new Error('Memory normalization failed');\nif (normalizeMemoryBytes('1024k') !== 1048576) throw new Error('Kilobyte memory normalization failed');"
  },
  {
    "day": 9,
    "title": "GitHub Actions CI: Workflow Syntax, Triggers & Secret Stores",
    "desc": "Build automated Continuous Integration workflows with GitHub Actions: Workflow YAML structure, triggers (`on: [push, pull_request]`), jobs and steps, runners, and encrypted Repository Secrets.",
    "syllabus": [
      "Workflow Architecture: `.github/workflows/ci.yml`, `jobs.<job_id>.runs-on: ubuntu-latest`, and step execution.",
      "Event Triggers & Path Filtering: Triggering builds on specific branches (`branches: [main]`) and path filters (`paths: ['src/**']`).",
      "Secret Management: Accessing secrets via `${{ secrets.PROD_API_KEY }}` and secret masking in log outputs."
    ],
    "eTitle": "GitHub Actions Workflow Syntax & Secret Sanitizer",
    "eDesc": "Implement function `validateWorkflowSecurity(workflowYamlObject)` ensuring pull_request workflows do not expose production secrets.",
    "eStarter": "function validateWorkflowSecurity(workflow) {\n  // TODO: Inspect workflow triggers and step environment variables to ensure no PROD secrets are accessible in PR triggers\n  \n}",
    "eHint": "Check if workflow.on.includes('pull_request') or workflow.on.pull_request; check if any job steps reference secrets containing 'PROD_'; return { isSecure: boolean, leaksDetected: string[] }.",
    "eTest": "const secureWf = {\n  on: ['pull_request'],\n  jobs: { test: { steps: [{ run: 'npm test', env: { CI: 'true' } }] } }\n};\nconst res = validateWorkflowSecurity(secureWf);\nif (!res.isSecure || res.leaksDetected.length !== 0) throw new Error('Secure workflow was rejected');\nconst leakyWf = {\n  on: ['pull_request'],\n  jobs: { deploy: { steps: [{ run: './deploy.sh', env: { KEY: '${{ secrets.PROD_DEPLOY_KEY }}' } }] } }\n};\nconst leakRes = validateWorkflowSecurity(leakyWf);\nif (leakRes.isSecure || leakRes.leaksDetected.length === 0) throw new Error('Production secret in PR workflow was not caught');\nconst emptyWf = validateWorkflowSecurity({});\nif (!emptyWf.isSecure) throw new Error('Empty workflow security check failed');",
    "aTitle": "GitHub Actions Event Trigger Matcher",
    "aDesc": "Implement function `isEventTriggered(triggerConfig, incomingEvent, incomingBranch)` checking if workflow matches event criteria.",
    "aStarter": "function isEventTriggered(cfg, event, branch) {\n  // TODO: Check if incomingEvent matches config events and branch is in branches list\n  \n}",
    "aHint": "Check if cfg.events.includes(incomingEvent) && (!cfg.branches || cfg.branches.includes(incomingBranch)); return boolean.",
    "aTest": "const cfg = { events: ['push'], branches: ['main', 'staging'] };\nif (isEventTriggered(cfg, 'push', 'main') !== true || isEventTriggered(cfg, 'push', 'feature') !== false) throw new Error('Event trigger check failed');"
  },
  {
    "day": 10,
    "title": "CI Test Automation, Parallelism & Test Matrix Strategies",
    "desc": "Accelerate CI feedback loops: Matrix builds across multiple Node/Python/OS versions, parallel test sharding (`--shard=1/4`), dependency caching (`actions/cache`), and flaky test quarantine.",
    "syllabus": [
      "Matrix Strategy: `strategy.matrix: { node: [18, 20, 22], os: [ubuntu-latest, macos-latest] }` yielding combinatorial jobs.",
      "GitHub Actions Caching: Caching `~/.npm` or `~/.cache/pip` based on `hashFiles('**/package-lock.json')`.",
      "Parallel Test Sharding: Dividing 2,000 unit tests across 4 parallel runners to cut pipeline time from 20m to 5m."
    ],
    "eTitle": "CI Matrix Build Parallelism Calculator",
    "eDesc": "Implement function `calculateMatrixJobs(matrixConfig)` calculating the total combinatorial job executions and total core-minutes.",
    "eStarter": "function calculateMatrixJobs(matrixConfig) {\n  // TODO: Compute Cartesian product of all matrix dimensions, multiplying by average execution time\n  \n}",
    "eHint": "Compute totalJobs = Object.values(matrixConfig.dimensions).reduce((acc, arr) => acc * arr.length, 1); totalMinutes = totalJobs * (matrixConfig.avgJobMinutes || 5); return { totalJobsCount: totalJobs, totalEstimatedMinutes: totalMinutes }.",
    "eTest": "const matrix = { dimensions: { os: ['ubuntu-latest', 'windows-latest'], node: [18, 20, 22] }, avgJobMinutes: 4 }; // 2 * 3 = 6 jobs * 4m = 24m\nconst res = calculateMatrixJobs(matrix);\nif (res.totalJobsCount !== 6 || res.totalEstimatedMinutes !== 24) throw new Error('Matrix calculation failed');\nconst single = { dimensions: { os: ['ubuntu-latest'] }, avgJobMinutes: 10 };\nif (calculateMatrixJobs(single).totalJobsCount !== 1) throw new Error('Single dimension matrix failed');\nconst emptyMat = { dimensions: {}, avgJobMinutes: 5 };\nif (calculateMatrixJobs(emptyMat).totalJobsCount !== 1) throw new Error('Empty matrix dimensions check failed');",
    "aTitle": "Cache Key Hash Digest Formatter",
    "aDesc": "Implement function `formatCacheKey(osName, lockfileSha)` creating GitHub Actions deterministic cache key string `npm-cache-${os}-${sha7}`.",
    "aStarter": "function formatCacheKey(os, sha) {\n  // TODO: Return formatted cache key string containing osName and truncated lockfileSha\n  \n}",
    "aHint": "Extract shortSha = lockfileSha.slice(0, 8); return `npm-cache-${osName}-${shortSha}`;",
    "aTest": "const key = formatCacheKey('ubuntu', 'abcdef123456789');\nif (key !== 'npm-cache-ubuntu-abcdef12') throw new Error('Cache key formatting failed');\nif (!key.startsWith('npm-cache-')) throw new Error('Cache key prefix failed');"
  },
  {
    "day": 11,
    "title": "Semantic Versioning (SemVer) & Automated Git Tagging",
    "desc": "Automate release versioning: SemVer specification (`MAJOR.MINOR.PATCH`), Conventional Commits (`feat:`, `fix:`, `feat!:`, `BREAKING CHANGE`), and automated CHANGELOG generation.",
    "syllabus": [
      "SemVer Anatomy: `MAJOR` (Breaking API changes), `MINOR` (Backwards-compatible features), `PATCH` (Backwards-compatible bug fixes).",
      "Conventional Commits 1.0.0: Structuring commit messages to drive automated release pipelines.",
      "Automated Release Drafter: Generating git tags (`v1.2.3`) and GitHub Releases with release notes."
    ],
    "eTitle": "Conventional Commits SemVer Increment Engine",
    "eDesc": "Implement function `determineNextSemVer(currentVersion, commitMessages)` parsing commit headers to calculate next SemVer string.",
    "eStarter": "function determineNextSemVer(current, commits) {\n  // TODO: If any commit has BREAKING CHANGE or feat!, increment MAJOR; if feat, increment MINOR; if fix, increment PATCH\n  \n}",
    "eHint": "Parse [major, minor, patch] from currentVersion; check commits: if any has 'BREAKING CHANGE' or '!' -> major++, minor=0, patch=0; else if any starts with 'feat:' -> minor++, patch=0; else if any starts with 'fix:' -> patch++; return `${major}.${minor}.${patch}`.",
    "eTest": "if (determineNextSemVer('1.2.3', ['feat: add oauth2 login', 'fix: typo']) !== '1.3.0') throw new Error('Feature should increment minor version');\nif (determineNextSemVer('1.2.3', ['fix: resolve memory leak']) !== '1.2.4') throw new Error('Bug fix should increment patch version');\nif (determineNextSemVer('1.2.3', ['feat!: drop support for node 16']) !== '2.0.0') throw new Error('Breaking change should increment major version');\nif (determineNextSemVer('2.0.0', ['chore: update docs']) !== '2.0.0') throw new Error('Chore commit should not change version');",
    "aTitle": "SemVer Regex Format Validator",
    "aDesc": "Implement function `isValidSemVerString(versionString)` validating strictly compliant Semantic Version strings (e.g. 1.0.0, 2.14.3-beta.1).",
    "aStarter": "function isValidSemVerString(ver) {\n  // TODO: Validate Semantic Versioning 2.0 string using regex\n  \n}",
    "aHint": "Use regex /^\\d+\\.\\d+\\.\\d+(-[0-9A-Za-z.-]+)?$/; return boolean test result.",
    "aTest": "if (isValidSemVerString('1.0.0') !== true || isValidSemVerString('v1.0') !== false) throw new Error('SemVer validation failed');\nif (isValidSemVerString('2.1.0-alpha.1') !== true) throw new Error('Pre-release SemVer failed');"
  },
  {
    "day": 12,
    "title": "Container Registry Security & Vulnerability Scanning (Trivy/Clair)",
    "desc": "Secure container registries: Scanning images with Trivy and Clair, analyzing Common Vulnerabilities and Exposures (CVEs), CVSS severity scores, and enforcing build-breaking security gates.",
    "syllabus": [
      "Vulnerability Scanning: Scanning OS packages (apk/deb/rpm) and language dependencies (npm/pip/cargo).",
      "CVSS Score Ranges: Low (0.1-3.9), Medium (4.0-6.9), High (7.0-8.9), Critical (9.0-10.0).",
      "CI Security Gates: `--exit-code 1 --severity CRITICAL,HIGH` blocking image push to AWS ECR / Docker Hub."
    ],
    "eTitle": "Container Vulnerability Security Gate Gatekeeper",
    "eDesc": "Implement function `evaluateSecurityGate(vulnerabilitiesList, allowedSeverities = ['LOW', 'MEDIUM'])` determining if image passes CI deployment gate.",
    "eStarter": "function evaluateSecurityGate(vulns, allowed = ['LOW', 'MEDIUM']) {\n  // TODO: If any vulnerability in vulns has severity not in allowed list, reject deployment\n  \n}",
    "eHint": "Iterate vulns; find any item where !allowedSeverities.includes(v.severity); if found return { passed: false, blockedBy: v.cveId, highestSeverity: v.severity }; else return { passed: true, totalScanned: vulns.length }.",
    "eTest": "const cleanVulns = [{ cveId: 'CVE-2024-001', severity: 'LOW' }, { cveId: 'CVE-2024-002', severity: 'MEDIUM' }];\nconst gate1 = evaluateSecurityGate(cleanVulns);\nif (!gate1.passed || gate1.totalScanned !== 2) throw new Error('Clean scan failed gatekeeper');\nconst dirtyVulns = [{ cveId: 'CVE-2024-9999', severity: 'CRITICAL' }];\nconst gate2 = evaluateSecurityGate(dirtyVulns);\nif (gate2.passed || gate2.blockedBy !== 'CVE-2024-9999') throw new Error('Critical CVE failed to block gate');\nconst emptyScan = evaluateSecurityGate([]);\nif (!emptyScan.passed) throw new Error('Empty scan list should pass');",
    "aTitle": "CVE Identifier Format Validator",
    "aDesc": "Implement function `isValidCveIdentifier(cveString)` verifying format `CVE-YYYY-NNNN+` using strict regular expression.",
    "aStarter": "function isValidCveIdentifier(cve) {\n  // TODO: Verify cveString matches /^CVE-\\d{4}-\\d{4,}$/\n  \n}",
    "aHint": "Use regex /^CVE-\\d{4}-\\d{4,}$/; return boolean test result.",
    "aTest": "if (isValidCveIdentifier('CVE-2024-12345') !== true || isValidCveIdentifier('CVE-24-1') !== false) throw new Error('CVE format validator failed');\nif (isValidCveIdentifier('cve-2024-1234') !== false) throw new Error('Lowercase CVE should fail');"
  },
  {
    "day": 13,
    "title": "Automated Staging Deployments, SSH Bastions & Environment Promotion",
    "desc": "Orchestrate environment progression: Development -> Staging -> Production promotion gates, SSH Bastion tunneling, ephemeral review environments, and automated database schema backups.",
    "syllabus": [
      "Environment Promotion Pipeline: Immutable container artifact built once, promoted across Dev, Staging, Prod.",
      "Bastion Host (Jump Box) Security: SSH agent forwarding, ephemeral SSH keys, and zero public port ingress.",
      "Ephemeral Pull Request Environments: Auto-provisioning preview environments per PR branch."
    ],
    "eTitle": "Environment Promotion State Machine",
    "eDesc": "Implement function `transitionDeploymentState(currentState, targetState, testResultsPassed, manualApprovalGranted)` enforcing deployment governance.",
    "eStarter": "function transitionDeploymentState(current, target, testsPassed, approved) {\n  // TODO: Validate progression from DEV -> STAGING -> PROD requiring testsPassed and manual approval for PROD\n  \n}",
    "eHint": "Progression: DEV -> STAGING requires testResultsPassed === true; STAGING -> PROD requires testResultsPassed === true && manualApprovalGranted === true; return { canTransition: boolean, nextState: string }.",
    "eTest": "const r1 = transitionDeploymentState('DEV', 'STAGING', true, false);\nif (!r1.canTransition || r1.nextState !== 'STAGING') throw new Error('DEV to STAGING transition failed');\nconst r2 = transitionDeploymentState('STAGING', 'PROD', true, false);\nif (r2.canTransition) throw new Error('PROD deployment without approval must be blocked');\nconst r3 = transitionDeploymentState('STAGING', 'PROD', true, true);\nif (!r3.canTransition || r3.nextState !== 'PROD') throw new Error('Approved PROD transition failed');",
    "aTitle": "Deployment Target Environment Name Normalizer",
    "aDesc": "Implement function `normalizeEnvironmentName(rawName)` converting aliases (prd, prod, dev, stg) to canonical uppercase names (DEVELOPMENT, STAGING, PRODUCTION).",
    "aStarter": "function normalizeEnvironmentName(name) {\n  // TODO: Map dev/development, stg/stage/staging, and prd/prod/production to canonical uppercase strings\n  \n}",
    "aHint": "Check lowercase name: ['dev', 'development'] -> 'DEVELOPMENT'; ['stg', 'stage', 'staging'] -> 'STAGING'; ['prd', 'prod', 'production'] -> 'PRODUCTION'; default 'UNKNOWN'.",
    "aTest": "if (normalizeEnvironmentName('prod') !== 'PRODUCTION' || normalizeEnvironmentName('dev') !== 'DEVELOPMENT') throw new Error('Env name normalizer failed');\nif (normalizeEnvironmentName('stg') !== 'STAGING') throw new Error('Staging normalizer failed');"
  },
  {
    "day": 14,
    "title": "Automated Smoke Testing & Synthetic Health Verification",
    "desc": "Verify post-deployment health: Synthetic transaction probes, deep `/healthz` endpoints (checking DB, Redis, downstream APIs), automated rollbacks on probe failure, and alerting.",
    "syllabus": [
      "Shallow vs Deep Healthchecks: Shallow (HTTP 200 process alive) vs Deep (Verifying read/write to database and cache).",
      "Synthetic Probes: Simulating end-to-end user journeys (User login, add to cart, checkout probe).",
      "Automated Rollback Triggers: Fast-aborting deployments within 60s if smoke tests fail."
    ],
    "eTitle": "Post-Deployment Smoke Test Runner",
    "eDesc": "Implement function `executeSmokeTestProbes(endpointUrls, httpClient)` testing endpoints and triggering automated rollback decision if error threshold is breached.",
    "eStarter": "function executeSmokeTestProbes(endpoints, client) {\n  // TODO: Probe all endpoints in parallel; if any returns status !== 200 or latency > 2000ms, trigger rollback\n  \n}",
    "eHint": "Iterate endpoints; record results; if any probe fails (status >= 400 or latencyMs > 2000), return { deploymentHealthy: false, shouldRollback: true, failedEndpoints: string[] }; else return { deploymentHealthy: true, shouldRollback: false }.",
    "eTest": "const mockClient = { get: async (url) => ({ status: url.includes('bad') ? 500 : 200, latencyMs: 150 }) };\nconst cleanUrls = ['https://api.pinit.com/health', 'https://api.pinit.com/ready'];\nconst r1 = await executeSmokeTestProbes(cleanUrls, mockClient);\nif (!r1.deploymentHealthy || r1.shouldRollback) throw new Error('Clean smoke test was marked unhealthy');\nconst dirtyUrls = ['https://api.pinit.com/health', 'https://api.pinit.com/bad'];\nconst r2 = await executeSmokeTestProbes(dirtyUrls, mockClient);\nif (r2.deploymentHealthy || !r2.shouldRollback || !r2.failedEndpoints.includes('https://api.pinit.com/bad')) throw new Error('Failing smoke test did not trigger rollback');\nconst emptyProbes = await executeSmokeTestProbes([], mockClient);\nif (!emptyProbes.deploymentHealthy) throw new Error('Empty probes check failed');",
    "aTitle": "HTTP Status Health Evaluator",
    "aDesc": "Implement function `isHttpStatusHealthy(statusCode)` returning true if code is in the standard 200-299 success range.",
    "aStarter": "function isHttpStatusHealthy(code) {\n  // TODO: Check if statusCode is >= 200 and < 300\n  \n}",
    "aHint": "Compare statusCode >= 200 && statusCode <= 299; return boolean result.",
    "aTest": "if (isHttpStatusHealthy(200) !== true || isHttpStatusHealthy(500) !== false) throw new Error('HTTP status check failed');\nif (isHttpStatusHealthy(404) !== false || isHttpStatusHealthy(204) !== true) throw new Error('Status boundary check failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks",
    "desc": "Milestone 2: Construct an end-to-end production CI/CD automation pipeline: Lint -> Matrix Unit Tests -> Multi-Stage Docker Build -> Trivy Security Scan -> Staging Deployment -> Synthetic Smoke Tests -> Auto Rollback.",
    "syllabus": [
      "Enterprise CI/CD Synthesis: Connecting test matrices, security gates, and container builds.",
      "Zero-Human Staging Deployment: Safe, automated push to staging on every merged Pull Request.",
      "Pipeline Resiliency & Disaster Recovery: Automated fast-rollback on regression detection."
    ],
    "eTitle": "Enterprise CI/CD Pipeline State Orchestrator",
    "eDesc": "Implement function `executeEnterprisePipeline(pipelineStages)` executing sequential stages with fail-fast halts and automated rollback invocation.",
    "eStarter": "function executeEnterprisePipeline(stages) {\n  // TODO: Execute stages sequentially; if any stage fails, halt pipeline and trigger executeRollback()\n  \n}",
    "eHint": "Loop stages: if stage.action() throws or returns { success: false }, call rollbackHandler() and return { pipelineSuccess: false, failedStage: stage.name, rolledBack: true }; return { pipelineSuccess: true, completedStages: stages.map(s => s.name) }.",
    "eTest": "let rolledBack = false;\nconst stages = [\n  { name: 'LINT', action: async () => ({ success: true }) },\n  { name: 'TEST', action: async () => ({ success: true }) },\n  { name: 'SECURITY_SCAN', action: async () => ({ success: false }) }\n];\nconst res = await executeEnterprisePipeline(stages, async () => { rolledBack = true; });\nif (res.pipelineSuccess !== false || res.failedStage !== 'SECURITY_SCAN' || !rolledBack) throw new Error('Pipeline fail-fast and rollback failed');\nconst okStages = [{ name: 'LINT', action: async () => ({ success: true }) }];\nconst okRes = await executeEnterprisePipeline(okStages, async () => {});\nif (okRes.pipelineSuccess !== true || okRes.completedStages[0] !== 'LINT') throw new Error('Clean pipeline execution failed');\nif (typeof res.pipelineSuccess !== 'boolean') throw new Error('Pipeline return type check failed');",
    "aTitle": "Pipeline Duration Aggregator",
    "aDesc": "Implement function `calculateTotalPipelineDuration(stageDurationsSeconds)` computing total elapsed minutes and formatting to 2 decimal places.",
    "aStarter": "function calculateTotalPipelineDuration(durations) {\n  // TODO: Sum durations array, divide by 60, and return formatted number\n  \n}",
    "aHint": "Sum seconds array: durations.reduce((a, b) => a + b, 0) / 60; return Number(mins.toFixed(2));",
    "aTest": "const total = calculateTotalPipelineDuration([120, 180, 60]); // 360s = 6.00 mins\nif (total !== 6.00) throw new Error('Pipeline duration aggregator failed');\nif (calculateTotalPipelineDuration([]) !== 0.00) throw new Error('Empty pipeline duration failed');"
  },
  {
    "day": 16,
    "title": "Kubernetes Core Architecture: Pods, ReplicaSets & Deployments",
    "desc": "Master Kubernetes orchestration architecture: Control Plane (API Server, etcd, Controller Manager, Kube-Scheduler), Worker Nodes (Kubelet, Kube-Proxy, Container Runtime), Pod lifecycle, and Declarative Deployments.",
    "syllabus": [
      "Kubernetes Control Plane vs Worker Node components and consensus via etcd.",
      "Pod Lifecycle & Status: `Pending`, `Running`, `Succeeded`, `Failed`, `CrashLoopBackOff`.",
      "Deployment Controllers: Managing ReplicaSets, RollingUpdate strategy (`maxSurge`, `maxUnavailable`)."
    ],
    "eTitle": "Kubernetes ReplicaSet Reconciliation Loop Engine",
    "eDesc": "Implement function `reconcileReplicaSet(desiredReplicas, currentPodsList)` calculating scale-up pod creation count or scale-down termination targets.",
    "eStarter": "function reconcileReplicaSet(desired, currentPods) {\n  // TODO: Compare desired count with active currentPods; return action CREATE N pods or TERMINATE N pods\n  \n}",
    "eHint": "Count active = currentPods.filter(p => p.status === 'Running').length; diff = desiredReplicas - active; if diff > 0 return { action: 'SCALE_UP', count: diff }; if diff < 0 return { action: 'SCALE_DOWN', count: Math.abs(diff) }; return { action: 'IN_SYNC', count: 0 }.",
    "eTest": "const pods = [{ id: 'p1', status: 'Running' }, { id: 'p2', status: 'Running' }];\nconst r1 = reconcileReplicaSet(5, pods);\nif (r1.action !== 'SCALE_UP' || r1.count !== 3) throw new Error('Scale up reconciliation failed');\nconst r2 = reconcileReplicaSet(1, pods);\nif (r2.action !== 'SCALE_DOWN' || r2.count !== 1) throw new Error('Scale down reconciliation failed');\nconst r3 = reconcileReplicaSet(2, pods);\nif (r3.action !== 'IN_SYNC' || r3.count !== 0) throw new Error('In-sync reconciliation failed');",
    "aTitle": "Kubernetes Resource Kind Validator",
    "aDesc": "Implement function `isValidKubernetesKind(kindString)` verifying that resource kind is a recognized native K8s primitive (Pod, Service, Deployment, ReplicaSet, ConfigMap, Secret, Ingress).",
    "aStarter": "function isValidKubernetesKind(kind) {\n  // TODO: Check if kind is in standard native Kubernetes kinds Set\n  \n}",
    "aHint": "Use a Set of valid kinds: ['Pod', 'Service', 'Deployment', 'ReplicaSet', 'ConfigMap', 'Secret', 'Ingress']; return set.has(kindString).",
    "aTest": "if (isValidKubernetesKind('Deployment') !== true || isValidKubernetesKind('InvalidKind') !== false) throw new Error('K8s kind check failed');\nif (isValidKubernetesKind('ConfigMap') !== true) throw new Error('ConfigMap kind check failed');"
  },
  {
    "day": 17,
    "title": "Kubernetes Networking: ClusterIP, NodePort & LoadBalancer Services",
    "desc": "Route internal and external traffic in Kubernetes: ClusterIP (Internal pod-to-pod discovery), NodePort (Static port on each node 30000-32767), LoadBalancer (Cloud provider ELB provisioning), and Endpoints / EndpointSlices.",
    "syllabus": [
      "The Kubernetes Network Model: Every Pod gets its own unique, routable IP within the cluster CIDR.",
      "Kube-Proxy & iptables/IPVS: How Services provide stable virtual IPs load balancing across ephemeral Pod IPs.",
      "Service Types: ClusterIP (Default internal) vs NodePort vs LoadBalancer vs ExternalName."
    ],
    "eTitle": "Kubernetes Service Type Traffic Dispatcher",
    "eDesc": "Implement function `routeServiceTraffic(serviceType, incomingTrafficOrigin, nodePortConfig)` determining whether traffic is routed internally or externally.",
    "eStarter": "function routeServiceTraffic(type, origin, config) {\n  // TODO: Return ALLOWED for ClusterIP only if origin is INTERNAL; return ALLOWED for LoadBalancer from ANY origin\n  \n}",
    "eHint": "If type === 'ClusterIP' && origin !== 'INTERNAL' return { allowed: false, reason: 'CLUSTER_IP_INTERNAL_ONLY' }; if type === 'NodePort' verify port between 30000 and 32767; return { allowed: true, routedTo: type }.",
    "eTest": "const r1 = routeServiceTraffic('ClusterIP', 'EXTERNAL_INTERNET', {});\nif (r1.allowed !== false || r1.reason !== 'CLUSTER_IP_INTERNAL_ONLY') throw new Error('External traffic to ClusterIP must be blocked');\nconst r2 = routeServiceTraffic('ClusterIP', 'INTERNAL', {});\nif (r2.allowed !== true) throw new Error('Internal traffic to ClusterIP should be allowed');\nconst r3 = routeServiceTraffic('LoadBalancer', 'EXTERNAL_INTERNET', {});\nif (r3.allowed !== true) throw new Error('LoadBalancer traffic should be allowed');",
    "aTitle": "NodePort Port Number Range Validator",
    "aDesc": "Implement function `isValidNodePort(portNumber)` ensuring port falls strictly within standard Kubernetes NodePort range 30000 to 32767.",
    "aStarter": "function isValidNodePort(port) {\n  // TODO: Return true if portNumber is an integer between 30000 and 32767 inclusive\n  \n}",
    "aHint": "Check Number.isInteger(portNumber) && portNumber >= 30000 && portNumber <= 32767; return boolean.",
    "aTest": "if (isValidNodePort(30080) !== true || isValidNodePort(80) !== false) throw new Error('NodePort range check failed');\nif (isValidNodePort(32768) !== false) throw new Error('Out of bounds NodePort check failed');"
  },
  {
    "day": 18,
    "title": "Kubernetes Ingress Controllers & Automated TLS Termination",
    "desc": "Manage external HTTP/HTTPS access to services: Ingress Controllers (NGINX, Traefik), Ingress resources (host/path routing), TLS secret certificates, and automated SSL issuance with cert-manager / Let's Encrypt.",
    "syllabus": [
      "Ingress vs LoadBalancer Service: 1 Ingress Controller ELB routing to 100+ services vs 100 expensive individual cloud ELBs.",
      "Path-Based & Host-Based Ingress: `api.pinit.com/v1` -> `api-service:8080`; `cdn.pinit.com` -> `static-service:80`.",
      "Automated TLS with cert-manager: ACME HTTP-01 / DNS-01 challenge reconciliation loops."
    ],
    "eTitle": "Kubernetes Ingress Path Router",
    "eDesc": "Implement function `matchIngressRoute(ingressRules, requestHost, requestPath)` resolving the target backend service name and service port.",
    "eStarter": "function matchIngressRoute(rules, host, path) {\n  // TODO: Find rule matching requestHost, then match requestPath prefix against rule paths\n  \n}",
    "eHint": "Find rule where rule.host === requestHost; find pathConfig where path.startsWith(pathConfig.path); return { serviceName: pathConfig.backend.service.name, port: pathConfig.backend.service.port.number }.",
    "eTest": "const rules = [\n  {\n    host: 'api.pinit.com',\n    paths: [\n      { path: '/v1/users', backend: { service: { name: 'user-svc', port: { number: 8080 } } } },\n      { path: '/v1/orders', backend: { service: { name: 'order-svc', port: { number: 8081 } } } }\n    ]\n  }\n];\nconst r1 = matchIngressRoute(rules, 'api.pinit.com', '/v1/users/profile');\nif (r1.serviceName !== 'user-svc' || r1.port !== 8080) throw new Error('Ingress user-svc routing failed');\nconst r2 = matchIngressRoute(rules, 'unknown.com', '/v1/users');\nif (r2 !== null) throw new Error('Unknown host should return null');\nconst r3 = matchIngressRoute(rules, 'api.pinit.com', '/v1/orders/123');\nif (r3.serviceName !== 'order-svc') throw new Error('Ingress order-svc routing failed');",
    "aTitle": "Ingress Hostname Wildcard Matcher",
    "aDesc": "Implement function `matchIngressHost(pattern, incomingHost)` supporting wildcard subdomains like `*.pinit.com`.",
    "aStarter": "function matchIngressHost(pattern, host) {\n  // TODO: Match exact host or wildcard subdomain pattern like *.domain.com\n  \n}",
    "aHint": "If pattern === host return true; if pattern.startsWith('*.') check host.endsWith(pattern.slice(2)); return boolean.",
    "aTest": "if (matchIngressHost('*.pinit.com', 'api.pinit.com') !== true || matchIngressHost('*.pinit.com', 'other.com') !== false) throw new Error('Wildcard ingress host match failed');\nif (matchIngressHost('app.pinit.com', 'app.pinit.com') !== true) throw new Error('Exact host match failed');"
  },
  {
    "day": 19,
    "title": "Kubernetes ConfigMaps, Secrets & Environment Volume Mounting",
    "desc": "Decouple configuration from code in Kubernetes: ConfigMaps (Plain text key-values and config files), Secrets (Base64 encoded sensitive data, SealedSecrets, HashiCorp Vault), and mounting as environment variables or volume files.",
    "syllabus": [
      "ConfigMaps: Injecting environment variables (`envFrom.configMapRef`) and mounting config files (`volumeMounts`).",
      "Kubernetes Secrets: Base64 encoding is NOT encryption; integrating with AWS KMS envelope encryption for etcd at rest.",
      "Live Reloading: Volume-mounted ConfigMaps automatically update in-pod files without restarting containers."
    ],
    "eTitle": "Kubernetes Base64 Secret Decoder & Volume Mounter",
    "eDesc": "Implement function `mountKubernetesSecret(secretObject)` decoding base64 data payloads and generating in-memory file mount representation.",
    "eStarter": "function mountKubernetesSecret(secret) {\n  // TODO: Decode each base64 string in secret.data using Buffer.from(val, 'base64').toString('utf8')\n  \n}",
    "eHint": "Iterate Object.entries(secret.data); decode Buffer.from(val, 'base64').toString('utf8'); return object mapping key to plaintext string; return { mountedFiles: object, totalMounted: number }.",
    "eTest": "const secret = {\n  metadata: { name: 'db-credentials' },\n  data: {\n    'username': Buffer.from('db_user').toString('base64'),\n    'password': Buffer.from('super_secret_pass').toString('base64')\n  }\n};\nconst res = mountKubernetesSecret(secret);\nif (res.mountedFiles['username'] !== 'db_user' || res.mountedFiles['password'] !== 'super_secret_pass') throw new Error('Secret base64 decode failed');\nif (res.totalMounted !== 2) throw new Error('Total mounted count mismatch');\nconst emptySecret = { metadata: { name: 'empty' }, data: {} };\nif (mountKubernetesSecret(emptySecret).totalMounted !== 0) throw new Error('Empty secret mount failed');",
    "aTitle": "Secret Base64 Encoder Utility",
    "aDesc": "Implement function `encodeKubernetesSecretData(plainObject)` encoding string dictionary into base64 payload.",
    "aStarter": "function encodeKubernetesSecretData(plain) {\n  // TODO: Encode each value in plainObject to base64 string\n  \n}",
    "aHint": "Loop entries: Buffer.from(val, 'utf8').toString('base64'); return object with base64 encoded strings.",
    "aTest": "const encoded = encodeKubernetesSecretData({ user: 'admin' });\nif (encoded.user !== 'YWRtaW4=') throw new Error('Secret base64 encoding failed');\nif (encodeKubernetesSecretData({}).user) throw new Error('Empty object check failed');"
  },
  {
    "day": 20,
    "title": "Kubernetes Health Probes: Liveness, Readiness & Startup Probes",
    "desc": "Ensure container reliability with Kubernetes health probes: Liveness Probe (Restarts deadlocked pods), Readiness Probe (Removes unready pods from Service endpoints), and Startup Probe (Protects slow-starting legacy apps).",
    "syllabus": [
      "Probe Types: `httpGet` (HTTP 200-399), `tcpSocket` (Port open), `exec` (Command exit 0).",
      "Liveness vs Readiness: Liveness restarts container on failure; Readiness removes container from load balancer endpoints without restart.",
      "Startup Probes: Giving slow legacy applications up to 5 minutes to boot before liveness probes activate."
    ],
    "eTitle": "Kubernetes Pod Health Probe Controller",
    "eDesc": "Implement function `evaluateProbeAction(probeType, consecutiveFailures, failureThreshold)` determining whether to RESTART_CONTAINER, REMOVE_FROM_ENDPOINTS, or CONTINUE.",
    "eStarter": "function evaluateProbeAction(type, failures, threshold) {\n  // TODO: If failures >= threshold: liveness triggers RESTART_CONTAINER, readiness triggers REMOVE_FROM_ENDPOINTS\n  \n}",
    "eHint": "If failures < threshold return { action: 'CONTINUE_SERVING', breached: false }; if type === 'liveness' return { action: 'RESTART_CONTAINER', breached: true }; if type === 'readiness' return { action: 'REMOVE_FROM_ENDPOINTS', breached: true }; return { action: 'CONTINUE_SERVING', breached: false }.",
    "eTest": "if (evaluateProbeAction('liveness', 3, 3).action !== 'RESTART_CONTAINER') throw new Error('Liveness probe breach must restart container');\nif (evaluateProbeAction('readiness', 3, 3).action !== 'REMOVE_FROM_ENDPOINTS') throw new Error('Readiness probe breach must remove endpoints');\nif (evaluateProbeAction('liveness', 2, 3).action !== 'CONTINUE_SERVING') throw new Error('Sub-threshold failures should continue serving');\nif (evaluateProbeAction('startup', 1, 3).breached !== false) throw new Error('Startup probe sub-threshold failed');",
    "aTitle": "Probe Consecutive Failure Threshold Counter",
    "aDesc": "Implement function `recordProbeResult(currentFailures, isSuccess)` incrementing counter on failure or resetting to 0 on success.",
    "aStarter": "function recordProbeResult(curr, success) {\n  // TODO: Return 0 if isSuccess is true, else return currentFailures + 1\n  \n}",
    "aHint": "If isSuccess is true return 0; else return currentFailures + 1; ensuring strict consecutive tracking.",
    "aTest": "if (recordProbeResult(2, false) !== 3 || recordProbeResult(5, true) !== 0) throw new Error('Probe counter failed');\nif (recordProbeResult(0, false) !== 1) throw new Error('Initial failure count failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA",
    "desc": "Milestone 3: Build an enterprise-grade Kubernetes architecture: NGINX Ingress Controller with SSL termination, Deployment with RollingUpdate and PodAntiAffinity across nodes, and Horizontal Pod Autoscaler (HPA).",
    "syllabus": [
      "High Availability Topology: PodAntiAffinity scheduling pods across distinct worker nodes and AZs.",
      "Horizontal Pod Autoscaler (HPA): Scaling replicas automatically based on CPU/Memory metrics.",
      "Production cluster stress testing and automated traffic load balancing."
    ],
    "eTitle": "Horizontal Pod Autoscaler (HPA) Capacity Formula Engine",
    "eDesc": "Implement function `calculateHpaReplicas(currentReplicas, currentMetricValue, targetMetricValue, minReplicas, maxReplicas)` implementing official Kubernetes HPA scaling equation.",
    "eStarter": "function calculateHpaReplicas(curr, currentMetric, targetMetric, min, max) {\n  // TODO: Official formula: Math.ceil(currentReplicas * (currentMetricValue / targetMetricValue)), clamped between min and max\n  \n}",
    "eHint": "Compute rawReplicas = Math.ceil(currentReplicas * (currentMetricValue / targetMetricValue)); clamp: Math.max(minReplicas, Math.min(maxReplicas, rawReplicas)); return desiredReplicas.",
    "eTest": "if (calculateHpaReplicas(2, 80, 50, 1, 10) !== 4) throw new Error('HPA scale up failed: Math.ceil(2 * (80/50)) = 4');\nif (calculateHpaReplicas(5, 20, 50, 2, 10) !== 2) throw new Error('HPA scale in failed: Math.ceil(5 * (20/50)) = 2');\nif (calculateHpaReplicas(4, 95, 20, 1, 10) !== 10) throw new Error('HPA clamp to max 10 failed');\nif (calculateHpaReplicas(1, 10, 50, 2, 10) !== 2) throw new Error('HPA clamp to min 2 failed');",
    "aTitle": "Kubernetes CPU Millicores Normalizer",
    "aDesc": "Implement function `normalizeCpuMillicores(cpuString)` converting '500m', '1', '2.5' to integer millicores (500, 1000, 2500).",
    "aStarter": "function normalizeCpuMillicores(cpu) {\n  // TODO: If ends with 'm' parse integer; else parse float and multiply by 1000\n  \n}",
    "aHint": "Check if string ends with 'm' -> parseInt(cpu.slice(0, -1)); else parseFloat(cpu) * 1000; return Math.round(result).",
    "aTest": "if (normalizeCpuMillicores('500m') !== 500 || normalizeCpuMillicores('2') !== 2000) throw new Error('CPU millicores normalization failed');\nif (normalizeCpuMillicores('1.5') !== 1500) throw new Error('Decimal CPU normalization failed');"
  },
  {
    "day": 22,
    "title": "Helm Package Management & Multi-Environment Values",
    "desc": "Package and deploy Kubernetes applications with Helm: Chart architecture (`Chart.yaml`, `templates/`, `values.yaml`), Go template syntax, built-in objects (`.Values`, `.Release`, `.Chart`), and Helm Release rollbacks.",
    "syllabus": [
      "Helm Chart Structure: Reusable Kubernetes manifests parameterized with Go templating.",
      "Multi-Environment Values: `values.yaml` (Base defaults) overridden by `values.staging.yaml` and `values.prod.yaml`.",
      "Helm Lifecycle: `helm upgrade --install`, `helm rollback <release> <revision>`, and Helm test hooks."
    ],
    "eTitle": "Helm Template Values Renderer Simulator",
    "eDesc": "Implement function `renderHelmTemplate(templateString, valuesObject)` substituting `{{ .Values.key }}` expressions with provided value overrides.",
    "eStarter": "function renderHelmTemplate(tmpl, values) {\n  // TODO: Replace all occurrences of {{ .Values.path.to.key }} with the corresponding value from valuesObject\n  \n}",
    "eHint": "Use regex /\\{\\{\\s*\\.Values\\.([a-zA-Z0-9_.]+)\\s*\\}\\}/g; resolve nested property paths against valuesObject; replace with value; return rendered string.",
    "eTest": "const tmpl = 'replicas: {{ .Values.replicaCount }}\\nimage: {{ .Values.image.repository }}:{{ .Values.image.tag }}';\nconst vals = { replicaCount: 3, image: { repository: 'pinit/api', tag: 'v2.0' } };\nconst res = renderHelmTemplate(tmpl, vals);\nif (!res.includes('replicas: 3') || !res.includes('pinit/api:v2.0')) throw new Error('Helm template substitution failed');\nconst missingVals = renderHelmTemplate('name: {{ .Values.appName }}', {});\nif (missingVals.includes('{{')) throw new Error('Unresolved template tags should be handled');\nif (typeof res !== 'string') throw new Error('Helm rendered result must be string');",
    "aTitle": "Helm Chart SemVer Version Validator",
    "aDesc": "Implement function `isValidChartVersion(versionString)` verifying that Helm chart version strictly complies with SemVer specifications.",
    "aStarter": "function isValidChartVersion(ver) {\n  // TODO: Check if versionString matches standard SemVer pattern\n  \n}",
    "aHint": "Use regex /^\\d+\\.\\d+\\.\\d+$/; return boolean indicating valid Helm chart version.",
    "aTest": "if (isValidChartVersion('1.0.0') !== true || isValidChartVersion('v1') !== false) throw new Error('Chart version check failed');\nif (isValidChartVersion('0.2.15') !== true) throw new Error('Valid minor chart version failed');"
  },
  {
    "day": 23,
    "title": "GitOps Continuous Delivery with ArgoCD & Declarative Sync",
    "desc": "Implement GitOps delivery: Git repository as single source of truth, automated ArgoCD reconciliation loops, declarative sync policies, and Out-of-Sync / Degraded state detection.",
    "syllabus": [
      "The GitOps Paradigm: Declarative desired state in Git continuously reconciled with live cluster state.",
      "ArgoCD Architecture: API Server, Repository Server, Application Controller reconciling CRDs (`Application`, `AppProject`).",
      "Automated Sync & Self-Healing: Auto-syncing git commits and rolling back manual cluster mutations (anti-drift)."
    ],
    "eTitle": "ArgoCD GitOps Declarative Reconciliation Engine",
    "eDesc": "Implement function `reconcileGitOpsState(gitManifestHash, clusterManifestHash, autoSyncEnabled)` determining Sync and Out-of-Sync actions.",
    "eStarter": "function reconcileGitOpsState(gitHash, clusterHash, autoSync) {\n  // TODO: Reconcile git and cluster hashes to determine whether state is Synced, Syncing, or OutOfSync\n  \n}",
    "eHint": "Compare gitHash with clusterHash: if equal, return { status: 'Synced', action: 'NOOP' }; if autoSync is true, return { status: 'Syncing', action: 'APPLYING_GIT_MANIFESTS_TO_CLUSTER' }; else return { status: 'OutOfSync', action: 'MANUAL_SYNC_REQUIRED' }.",
    "eTest": "if (reconcileGitOpsState('hash_abc', 'hash_abc', true).status !== 'Synced') throw new Error('In-sync state failed');\nif (reconcileGitOpsState('hash_new', 'hash_old', true).action !== 'APPLYING_GIT_MANIFESTS_TO_CLUSTER') throw new Error('Auto-sync failed');\nif (reconcileGitOpsState('hash_new', 'hash_old', false).status !== 'OutOfSync') throw new Error('Manual sync state failed');\nif (reconcileGitOpsState('hash_abc', 'hash_abc', false).action !== 'NOOP') throw new Error('Synced state action should be NOOP');",
    "aTitle": "Git Commit SHA Short Formatter",
    "aDesc": "Implement function `formatShortSha(shaString)` returning the first 7 characters of a 40-character Git SHA hash.",
    "aStarter": "function formatShortSha(sha) {\n  // TODO: Extract first 7 characters of shaString\n  \n}",
    "aHint": "Check shaString.length >= 7 ? shaString.slice(0, 7) : shaString; return short string.",
    "aTest": "if (formatShortSha('e1a2b3c4d5e6f7') !== 'e1a2b3c') throw new Error('Short SHA failed');\nif (formatShortSha('1234567890abcdef') !== '1234567') throw new Error('Short SHA 7 char slice failed');"
  },
  {
    "day": 24,
    "title": "Prometheus Metric Scraping & PromQL Alerting Rules",
    "desc": "Monitor Kubernetes clusters with Prometheus: pull-based metric scraping (`/metrics`), PromQL time-series queries (rate, histogram_quantile, irate), Alertmanager routing, and SLO monitoring.",
    "syllabus": [
      "Prometheus Data Model: Metric name + key-value labels + timestamp + float64 value.",
      "PromQL Fundamentals: Counter rate calculations (`rate(http_requests_total[5m])`) and latency percentiles.",
      "Alertmanager Architecture: Grouping, deduplication, silencing, and PagerDuty/Slack routing."
    ],
    "eTitle": "PromQL Error Rate SLA Expression Evaluator",
    "eDesc": "Implement function `evaluatePromQlErrorRate(requestTotalCount, request5xxCount, thresholdPercent = 0.01)` returning ALERT if 5xx rate > 1%.",
    "eStarter": "function evaluatePromQlErrorRate(total, errors5xx, threshold = 0.01) {\n  // TODO: Calculate rate = errors5xx / total; fire alert if rate > threshold\n  \n}",
    "eHint": "Compute errorRate = errors5xx / requestTotalCount; isBreached = errorRate > thresholdPercent; return { errorRate: Number(errorRate.toFixed(4)), alertState: isBreached ? 'FIRING_HIGH_ERROR_RATE' : 'OK' }.",
    "eTest": "const clean = evaluatePromQlErrorRate(10000, 20, 0.01); // 0.2% error rate\nif (clean.alertState !== 'OK') throw new Error('0.2% error rate should be OK');\nconst broken = evaluatePromQlErrorRate(1000, 45, 0.01); // 4.5% error rate\nif (broken.alertState !== 'FIRING_HIGH_ERROR_RATE') throw new Error('4.5% error rate must fire alert');\nconst zero = evaluatePromQlErrorRate(1000, 0, 0.01);\nif (zero.errorRate !== 0.0000 || zero.alertState !== 'OK') throw new Error('Zero errors should be OK');",
    "aTitle": "Prometheus Metric Line Formatter",
    "aDesc": "Implement function `formatPrometheusMetric(metricName, labelsObject, metricValue)` formatting standard Prometheus exposition text format.",
    "aStarter": "function formatPrometheusMetric(name, labels, val) {\n  // TODO: Format string as metric_name{label1=\"val1\",label2=\"val2\"} value\n  \n}",
    "aHint": "Format labels: Object.entries(labels).map(([k, v]) => `${k}=\"${v}\"`).join(','); return `${name}{${labelStr}} ${val}`;",
    "aTest": "const line = formatPrometheusMetric('http_requests_total', { method: 'GET', status: '200' }, 1520);\nif (line !== 'http_requests_total{method=\"GET\",status=\"200\"} 1520') throw new Error('Prometheus metric formatting failed');"
  },
  {
    "day": 25,
    "title": "Grafana Dashboards & Distributed Tracing with OpenTelemetry",
    "desc": "Visualize system health and trace microservices: Grafana dashboard panels, OpenTelemetry (OTel) instrumentation, W3C Trace Context propagation (`traceparent`), Spans, and Jaeger visualization.",
    "syllabus": [
      "The 3 Pillars of Observability: Metrics (What is broken), Logs (Why is it broken), Traces (Where is it broken).",
      "W3C Trace Context Standard: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`.",
      "Distributed Tracing: Tracking asynchronous requests across 15 microservices with parent-child Span IDs."
    ],
    "eTitle": "OpenTelemetry Span Trace Context Propagator",
    "eDesc": "Implement function `propagateTraceContext(incomingHeaders, newSpanId)` injecting or forwarding W3C `traceparent` headers.",
    "eStarter": "function propagateTraceContext(headers, spanId) {\n  // TODO: Extract traceId from incoming traceparent header or generate new one; construct outgoing traceparent header\n  \n}",
    "eHint": "If headers['traceparent'] exists, extract traceId = headers['traceparent'].split('-')[1]; else generate 32-hex traceId; return { 'traceparent': `00-${traceId}-${newSpanId}-01`, traceId, spanId: newSpanId }.",
    "eTest": "const incoming = { 'traceparent': '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' };\nconst res = propagateTraceContext(incoming, '1122334455667788');\nif (res['traceparent'] !== '00-4bf92f3577b34da6a3ce929d0e0e4736-1122334455667788-01') throw new Error('Trace context propagation failed');\nif (res.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736') throw new Error('TraceId extraction failed');\nconst fresh = propagateTraceContext({}, '9999888877776666');\nif (!fresh['traceparent'].includes('9999888877776666')) throw new Error('Fresh trace context generation failed');",
    "aTitle": "W3C Traceparent Header Field Extractor",
    "aDesc": "Implement function `extractTraceparentFields(traceparentString)` parsing version, traceId, parentSpanId, and traceFlags.",
    "aStarter": "function extractTraceparentFields(header) {\n  // TODO: Split traceparent string by '-' and map to { version, traceId, parentSpanId, flags }\n  \n}",
    "aHint": "Split on '-': parts[0] is version, parts[1] is traceId, parts[2] is parentSpanId, parts[3] is flags; return object.",
    "aTest": "const p = extractTraceparentFields('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');\nif (p.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || p.parentSpanId !== '00f067aa0ba902b7') throw new Error('Traceparent parse failed');"
  },
  {
    "day": 26,
    "title": "Centralized Logging with Fluentbit, Elasticsearch & Kibana",
    "desc": "Aggregate distributed container logs: Fluentbit daemonset log collectors, Logstash filters, Elasticsearch inverted index search, Kibana dashboards, and PII log redaction.",
    "syllabus": [
      "Logging Architecture: Fluentbit log shipper on every node -> Centralized Elasticsearch / OpenSearch cluster.",
      "Structured JSON Logging: Emitting `level`, `timestamp`, `service`, `trace_id`, `message` fields instead of unstructured strings.",
      "PII Masking & Compliance: Redacting credit cards, passwords, and tokens before log persistence."
    ],
    "eTitle": "Fluentbit Structured JSON Log Parser & Redactor",
    "eDesc": "Implement function `sanitizeAndIndexLog(rawLogString)` parsing JSON logs and redacting sensitive PII fields (credit cards, passwords).",
    "eStarter": "function sanitizeAndIndexLog(rawLog) {\n  // TODO: Parse JSON string, replace password and card number patterns with [REDACTED], and add ingestedAt timestamp\n  \n}",
    "eHint": "Parse JSON log; if log.password replace with '[REDACTED]'; if string matches credit card regex /\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b/g replace with '[CARD_REDACTED]'; add ingestedAt = Date.now(); return sanitized log object.",
    "eTest": "const raw = JSON.stringify({ message: 'User logged in', password: 'secretPassword', card: '4111-2222-3333-4444' });\nconst clean = sanitizeAndIndexLog(raw);\nif (clean.password !== '[REDACTED]' || !clean.card.includes('REDACTED')) throw new Error('PII redaction failed');\nif (!clean.ingestedAt) throw new Error('Ingestion timestamp missing');\nconst cleanLog = JSON.stringify({ message: 'Health check OK' });\nconst resClean = sanitizeAndIndexLog(cleanLog);\nif (resClean.message !== 'Health check OK') throw new Error('Clean log message altered');",
    "aTitle": "Log Level Severity Sorter",
    "aDesc": "Implement function `isLogLevelAboveThreshold(logLevel, minThreshold)` comparing log levels (DEBUG < INFO < WARN < ERROR < FATAL).",
    "aStarter": "function isLogLevelAboveThreshold(level, threshold) {\n  // TODO: Map levels to numeric weights (DEBUG:0, INFO:1, WARN:2, ERROR:3, FATAL:4) and compare\n  \n}",
    "aHint": "Map: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, FATAL: 4 }; return weights[level] >= weights[threshold];",
    "aTest": "if (isLogLevelAboveThreshold('ERROR', 'INFO') !== true || isLogLevelAboveThreshold('DEBUG', 'WARN') !== false) throw new Error('Log level comparison failed');\nif (isLogLevelAboveThreshold('FATAL', 'ERROR') !== true) throw new Error('Fatal log level check failed');"
  },
  {
    "day": 27,
    "title": "Zero-Downtime Blue-Green & Canary Rollout Orchestration",
    "desc": "Execute progressive delivery deployments: Blue-Green deployments (Instant traffic flip via router), Canary rollouts (Gradual 5% -> 25% -> 100% traffic shift with automated metrics analysis), and Flagger.",
    "syllabus": [
      "Deployment Strategies Compared: Recreate (Downtime) vs RollingUpdate (Gradual) vs Blue-Green (Instant swap) vs Canary (Risk-mitigated).",
      "Canary Analysis: Evaluating HTTP 5xx error rates and p99 latency during each traffic increment phase.",
      "Instant Automated Rollbacks: Reverting router weights to 0% immediately upon metric deviation."
    ],
    "eTitle": "Canary Rollout Automated Error Analyzer & Rollback Engine",
    "eDesc": "Implement function `evaluateCanaryStep(currentWeight, errorRatePercent, maxAllowableErrorPercent = 1.0)` advancing traffic weight or aborting rollout.",
    "eStarter": "function evaluateCanaryStep(weight, errorRate, maxError = 1.0) {\n  // TODO: If errorRate > maxError return ABORT_ROLLBACK; else advance traffic weight by +25% up to 100%\n  \n}",
    "eHint": "If errorRatePercent > maxAllowableErrorPercent return { decision: 'ABORT_ROLLBACK', newWeight: 0, isHealthy: false }; nextWeight = Math.min(100, currentWeight + 25); return { decision: nextWeight === 100 ? 'PROMOTE_TO_FULL_PRODUCTION' : 'ADVANCE_CANARY_STEP', newWeight: nextWeight, isHealthy: true }.",
    "eTest": "const s1 = evaluateCanaryStep(10, 0.2, 1.0); // Clean -> advance from 10% to 35%\nif (s1.decision !== 'ADVANCE_CANARY_STEP' || s1.newWeight !== 35 || !s1.isHealthy) throw new Error('Canary step advance failed');\nconst s2 = evaluateCanaryStep(35, 2.5, 1.0); // 2.5% error > 1.0% max -> Abort\nif (s2.decision !== 'ABORT_ROLLBACK' || s2.newWeight !== 0 || s2.isHealthy) throw new Error('Canary abort failed');\nconst s3 = evaluateCanaryStep(85, 0.1, 1.0); // Reaches 100% -> Promote\nif (s3.decision !== 'PROMOTE_TO_FULL_PRODUCTION' || s3.newWeight !== 100) throw new Error('Canary promotion failed');",
    "aTitle": "RollingUpdate Surge and Unavailable Pod Calculator",
    "aDesc": "Implement function `calculateRollingUpdateBounds(replicaCount, maxSurgePercent, maxUnavailablePercent)` calculating max allowed pods and min active pods.",
    "aStarter": "function calculateRollingUpdateBounds(replicas, surgePct, unavailPct) {\n  // TODO: Compute maxSurge = ceil(replicas * (surgePct/100)), maxUnavail = floor(replicas * (unavailPct/100))\n  \n}",
    "aHint": "maxPods = replicaCount + Math.ceil(replicaCount * (maxSurgePercent / 100)); minPods = replicaCount - Math.floor(replicaCount * (maxUnavailablePercent / 100)); return { maxPods, minPods }.",
    "aTest": "const b = calculateRollingUpdateBounds(10, 25, 25); // max = 10 + 3 = 13, min = 10 - 2 = 8\nif (b.maxPods !== 13 || b.minPods !== 8) throw new Error('Rolling update bounds calculation failed');"
  },
  {
    "day": 28,
    "title": "DevSecOps: Automated SAST, DAST & Software Supply Chain Security",
    "desc": "Embed security throughout the DevOps lifecycle: Static Application Security Testing (SAST: SonarQube, Semgrep), Dynamic Testing (DAST: OWASP ZAP), Software Bill of Materials (SBOM: Syft), and Sigstore image signing with Cosign.",
    "syllabus": [
      "Shifting Left: Identifying security flaws during IDE writing and PR build phases rather than in production.",
      "Software Bill of Materials (SBOM): Generating SPDX / CycloneDX inventories of every transitive dependency.",
      "Cryptographic Image Signing: Signing container images with Cosign and validating signatures via Kubernetes Kyverno policies."
    ],
    "eTitle": "DevSecOps Security Gate Pipeline Enforcement Engine",
    "eDesc": "Implement function `enforceDevSecOpsGate(sastResults, dastResults, isImageSigned)` verifying security policy compliance before production release.",
    "eStarter": "function enforceDevSecOpsGate(sast, dast, isSigned) {\n  // TODO: Verify sast.criticalCount === 0, dast.highCount === 0, and isImageSigned === true\n  \n}",
    "eHint": "Verify sastResults.criticalCount === 0 && dastResults.highCount === 0 && isImageSigned === true; return { isReleaseApproved: boolean, failureReasons: string[] }.",
    "eTest": "const clean = enforceDevSecOpsGate({ criticalCount: 0, warnings: 2 }, { highCount: 0 }, true);\nif (!clean.isReleaseApproved || clean.failureReasons.length !== 0) throw new Error('Clean DevSecOps release was rejected');\nconst unsigned = enforceDevSecOpsGate({ criticalCount: 0 }, { highCount: 0 }, false);\nif (unsigned.isReleaseApproved || !unsigned.failureReasons.includes('UNSIGNED_IMAGE_DETECTED')) throw new Error('Unsigned container image was not blocked');\nconst sastFail = enforceDevSecOpsGate({ criticalCount: 2 }, { highCount: 0 }, true);\nif (sastFail.isReleaseApproved) throw new Error('SAST critical vulnerabilities should fail release');",
    "aTitle": "SBOM Package Component Formatter",
    "aDesc": "Implement function `formatSbomComponent(pkgName, pkgVersion, licenseType)` constructing standard CycloneDX JSON component representation.",
    "aStarter": "function formatSbomComponent(name, ver, lic) {\n  // TODO: Return object with name: pkgName, version: pkgVersion, licenses: [{ license: { id: lic } }]\n  \n}",
    "aHint": "Return object { name: pkgName, version: pkgVersion, licenses: [{ license: { id: licenseType } }] };",
    "aTest": "const comp = formatSbomComponent('express', '4.18.2', 'MIT');\nif (comp.name !== 'express' || comp.version !== '4.18.2' || comp.licenses[0].license.id !== 'MIT') throw new Error('SBOM component format failed');"
  },
  {
    "day": 29,
    "title": "Zero-Downtime Database Migrations & The Expand-Contract Pattern",
    "desc": "Safely execute breaking database schema changes with zero downtime: The Expand-Contract (Parallel Run) Pattern, additive non-destructive migrations, dual-writing, and dropping legacy columns.",
    "syllabus": [
      "The Expand Phase: Add new nullable columns or tables without modifying existing schema.",
      "The Transition Phase: App writes to both old and new columns, reads from new column.",
      "The Contract Phase: Backfill historical rows, drop old columns, and enforce NOT NULL constraints."
    ],
    "eTitle": "Database Expand-Contract Migration Phase Evaluator",
    "eDesc": "Implement function `evaluateMigrationSafety(sqlStatement, currentMigrationPhase)` verifying that destructive operations (DROP, RENAME) are only executed in the Contract phase.",
    "eStarter": "function evaluateMigrationSafety(sql, phase) {\n  // TODO: If sql contains DROP or RENAME and phase !== 'CONTRACT', flag as UNSAFE_DESTRUCTIVE_MIGRATION\n  \n}",
    "eHint": "Check if sql contains /DROP\\s+COLUMN|RENAME\\s+TO|DROP\\s+TABLE/i: if true and currentMigrationPhase !== 'CONTRACT' return { isSafe: false, reason: 'DESTRUCTIVE_SQL_FORBIDDEN_IN_EXPAND_PHASE' }; return { isSafe: true, phase: currentMigrationPhase }.",
    "eTest": "if (evaluateMigrationSafety('ALTER TABLE users ADD COLUMN full_name TEXT;', 'EXPAND').isSafe !== true) throw new Error('Additive column in EXPAND should be safe');\nif (evaluateMigrationSafety('ALTER TABLE users DROP COLUMN old_name;', 'EXPAND').isSafe !== false) throw new Error('DROP COLUMN in EXPAND must be rejected as unsafe');\nif (evaluateMigrationSafety('ALTER TABLE users DROP COLUMN old_name;', 'CONTRACT').isSafe !== true) throw new Error('DROP COLUMN in CONTRACT should be allowed');\nif (evaluateMigrationSafety('CREATE TABLE temp (id INT);', 'EXPAND').isSafe !== true) throw new Error('Create table in expand should be safe');",
    "aTitle": "Database Migration Version String Formatter",
    "aDesc": "Implement function `formatMigrationFilename(migrationSequence, descriptionSlug)` generating timestamped migration filename `V{seq}__{slug}.sql`.",
    "aStarter": "function formatMigrationFilename(seq, slug) {\n  // TODO: Format migration string as V{sequence}__{slug}.sql with padded sequence number\n  \n}",
    "aHint": "Pad sequence: String(migrationSequence).padStart(4, '0'); return `V${padded}__${descriptionSlug}.sql`;",
    "aTest": "const fn = formatMigrationFilename(1, 'add_users_table');\nif (fn !== 'V0001__add_users_table.sql') throw new Error('Migration filename formatting failed');\nif (!fn.endsWith('.sql')) throw new Error('Migration filename must end in .sql');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise GitOps Continuous Delivery & Zero-Downtime Multi-Cluster Kubernetes Platform",
    "desc": "Final Capstone Synthesis: Build an enterprise-grade automated GitOps continuous delivery platform: Multi-Cluster Kubernetes, ArgoCD automated sync, Blue-Green canary routing, Prometheus/Grafana SLO alerting, OpenTelemetry tracing, DevSecOps gates, and zero-downtime database migrations.",
    "syllabus": [
      "Master DevOps Architecture Synthesis: Declarative infrastructure, automated pipelines, resilient orchestration.",
      "Zero-Downtime Multi-Cluster Release Invariants & Automated Fast-Rollback Verification.",
      "Enterprise Platform Engineer Boardroom Certification."
    ],
    "eTitle": "Capstone Enterprise GitOps Multi-Cluster Release Controller",
    "eDesc": "Implement function `orchestrateEnterpriseGitOpsRelease(clusterConfigs, gitReleasePayload)` validating multi-cluster readiness and orchestrating progressive deployment.",
    "eStarter": "function orchestrateEnterpriseGitOpsRelease(clusters, payload) {\n  // TODO: Verify all clusters healthy, devsecops approved, and execute canary release across clusters\n  \n}",
    "eHint": "Verify clusters.every(c => c.status === 'HEALTHY'); verify payload.securityGatePassed === true; return { releaseStatus: 'ENTERPRISE_DEPLOYMENT_SUCCESSFUL', deployedClusters: clusters.map(c => c.name), gitCommit: payload.commitSha }.",
    "eTest": "const clusters = [{ name: 'us-east-cluster', status: 'HEALTHY' }, { name: 'eu-west-cluster', status: 'HEALTHY' }];\nconst payload = { commitSha: 'abcdef1234567890', securityGatePassed: true };\nconst res = orchestrateEnterpriseGitOpsRelease(clusters, payload);\nif (res.releaseStatus !== 'ENTERPRISE_DEPLOYMENT_SUCCESSFUL' || res.deployedClusters.length !== 2) throw new Error('Capstone GitOps multi-cluster release failed');\nconst unready = [{ name: 'us-east-cluster', status: 'DEGRADED' }];\nif (orchestrateEnterpriseGitOpsRelease(unready, payload).releaseStatus === 'ENTERPRISE_DEPLOYMENT_SUCCESSFUL') throw new Error('Degraded cluster must block release');\nif (res.gitCommit !== 'abcdef1234567890') throw new Error('Release git commit mismatch');",
    "aTitle": "DevOps Platform Readiness Scorecard Auditor",
    "aDesc": "Implement function `auditPlatformReadiness(ciScore, k8sScore, observabilityScore, securityScore)` calculating weighted DevOps maturity index.",
    "aStarter": "function auditPlatformReadiness(ci, k8s, obs, sec) {\n  // TODO: Compute weighted score (CI 25%, K8s 30%, Obs 25%, Sec 20%) and evaluate readiness tier\n  \n}",
    "aHint": "weighted = ciScore * 0.25 + k8sScore * 0.30 + observabilityScore * 0.25 + securityScore * 0.20; return { maturityScore: Number(weighted.toFixed(2)), isProductionReady: weighted >= 85 }.",
    "aTest": "const audit = auditPlatformReadiness(90, 90, 85, 95); // 22.5 + 27 + 21.25 + 19 = 89.75\nif (audit.maturityScore !== 89.75 || !audit.isProductionReady) throw new Error('DevOps maturity scorecard failed');\nconst low = auditPlatformReadiness(50, 50, 50, 50);\nif (low.isProductionReady) throw new Error('Low maturity should fail production readiness');"
  }
];

export const DEVOPS_30_DAYS_QUESTS: CourseQuest[] = DEVOPS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('devops', idx + 1, cfg)
);
