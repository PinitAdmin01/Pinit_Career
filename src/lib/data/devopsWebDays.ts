import { DayConfig } from './curriculumEnricher';

/**
 * DevOps & CI/CD Pipeline Automation (course-devops-cicd, prefix: devops):
 * 30 course days covering Linux administration, Docker containerization,
 * GitHub Actions CI/CD pipelines, Kubernetes orchestration, Helm, ArgoCD GitOps,
 * Prometheus & Grafana observability, and DevSecOps production practices.
 *
 * Practice tasks are in devops30DayData.ts; lessons in devopsWebLongLessons.ts.
 */
export const DEVOPS_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "DevOps Culture, CI/CD & The 12-Factor App",
    "desc": "Establish core DevOps principles: CALMS framework (Culture, Automation, Lean, Measurement, Sharing), CI/CD pipelines, and The 12-Factor App methodology (declarative formats, explicit dependencies, strict separation of config from code).",
    "syllabus": [
      "The CALMS Framework: Bridging development velocity and operational reliability.",
      "The 12-Factor Methodology: Factor III (Store config in the environment) and Factor IX (Disposability: fast startup and graceful shutdown).",
      "Continuous Integration (CI) vs Continuous Delivery (CD) vs Continuous Deployment."
    ]
  },
  {
    "day": 2,
    "title": "Linux Administration, POSIX Signals & Process Daemons",
    "desc": "Master production Linux operations: PID 1 init process responsibilities, standard streams (stdin, stdout, stderr), POSIX signals (SIGTERM, SIGKILL, SIGHUP, SIGINT), and systemd daemon management.",
    "syllabus": [
      "The PID 1 Problem in Containers: Handling orphaned zombie processes and forwarding termination signals.",
      "POSIX Signals: SIGTERM (15: Graceful termination request) vs SIGKILL (9: Uncatchable forced kill) vs SIGHUP (1: Reload config).",
      "Process Lifecycle: Graceful connection draining and exit status codes (0 = Success, 1-255 = Failure)."
    ]
  },
  {
    "day": 3,
    "title": "Docker Architecture, Copy-on-Write & Image Layer Caching",
    "desc": "Understand container virtualization: Linux Namespaces (PID, NET, MNT, IPC, UTS), Cgroups (CPU/RAM limits), UnionFS (Overlay2), Copy-on-Write storage, and optimizing Docker build cache layers.",
    "syllabus": [
      "Virtual Machines vs Containers: Hypervisor guest OS abstraction vs shared host Linux kernel isolation.",
      "Linux Kernel Primitives: Namespaces (What a process can see) and Cgroups (How much a process can use).",
      "Docker Image Layer Caching: Maximizing cache hits by ordering stable instructions (COPY package.json) before volatile code (COPY . .)."
    ]
  },
  {
    "day": 4,
    "title": "Docker Multi-Stage Builds & Minimal Production Images",
    "desc": "Build secure, minimal production container images using multi-stage builds: Compiling in build stages, copying runtime artifacts into Alpine/Distroless bases, and eliminating build toolchains and attack surfaces.",
    "syllabus": [
      "Multi-Stage Build Pattern: `FROM golang:1.22 AS builder` -> `FROM gcr.io/distroless/static-debian12`.",
      "Distroless & Alpine Bases: Stripping package managers (apt/apk), shells (bash/sh), and unnecessary debuggers from final artifacts.",
      "Image Size Reduction: Slashing image footprint from 1GB+ development environments to <30MB production containers."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose",
    "desc": "Milestone 1: Orchestrate a production-grade multi-container application: Frontend (Nginx), Backend (Node.js/Go), Database (PostgreSQL), Cache (Redis), private bridge networks, environment files (.env), and volume persistence.",
    "syllabus": [
      "Docker Compose Spec: `services`, `networks`, `volumes`, `depends_on` (with `condition: service_healthy`).",
      "Internal Service Discovery: Automatic DNS resolution across Docker user-defined bridge networks.",
      "Persistent Data Storage: Named volumes vs bind mounts for database state isolation."
    ]
  },
  {
    "day": 6,
    "title": "Docker Container Networking & Host/Bridge Port Mappings",
    "desc": "Configure container networking modes: Bridge (Default isolated network with NAT), Host (Zero overhead port binding), Overlay (Multi-host Swarm/K8s), and None (Isolated air-gapped sandboxes).",
    "syllabus": [
      "Docker Network Drivers: `bridge`, `host`, `overlay`, `macvlan`, `none`.",
      "Port Mapping Semantics: `HOST_PORT:CONTAINER_PORT` (e.g. `-p 8080:80`) and binding to localhost vs 0.0.0.0.",
      "Container DNS: Embedded Docker DNS resolver at `127.0.0.11` translating service names to container IPs."
    ]
  },
  {
    "day": 7,
    "title": "Docker Security, Rootless Daemons & Read-Only Root Filesystems",
    "desc": "Harden container security: Dropping Linux capabilities (`--cap-drop ALL`), running as non-root users (`USER 10001`), read-only root filesystems (`--read-only`), and seccomp/AppArmor profiles.",
    "syllabus": [
      "The Non-Root Invariant: Never run container processes as root (`UID 0`) to prevent kernel privilege escalation.",
      "Linux Capabilities: Dropping `CAP_SYS_ADMIN`, `CAP_NET_RAW`, and retaining only `CAP_NET_BIND_SERVICE`.",
      "Immutable Containers: `--read-only` root filesystem with ephemeral `tmpfs` mounts for `/tmp` and `/run`."
    ]
  },
  {
    "day": 8,
    "title": "Container Healthchecks, Restart Policies & Resource Limits",
    "desc": "Configure container self-healing: Docker HEALTHCHECK instructions (interval, timeout, start-period, retries), Restart Policies (`unless-stopped`, `on-failure`), and Cgroup resource constraints (`--memory`, `--cpus`).",
    "syllabus": [
      "Healthcheck Lifecycle: `starting` (start-period grace) -> `healthy` -> `unhealthy` (after max retries).",
      "Restart Policies: `no`, `always`, `unless-stopped`, `on-failure:5`.",
      "Out of Memory (OOM) Killer: Understanding kernel OOM score adjustment and container memory swapping."
    ]
  },
  {
    "day": 9,
    "title": "GitHub Actions CI: Workflow Syntax, Triggers & Secret Stores",
    "desc": "Build automated Continuous Integration workflows with GitHub Actions: Workflow YAML structure, triggers (`on: [push, pull_request]`), jobs and steps, runners, and encrypted Repository Secrets.",
    "syllabus": [
      "Workflow Architecture: `.github/workflows/ci.yml`, `jobs.<job_id>.runs-on: ubuntu-latest`, and step execution.",
      "Event Triggers & Path Filtering: Triggering builds on specific branches (`branches: [main]`) and path filters (`paths: ['src/**']`).",
      "Secret Management: Accessing secrets via `${{ secrets.PROD_API_KEY }}` and secret masking in log outputs."
    ]
  },
  {
    "day": 10,
    "title": "CI Test Automation, Parallelism & Test Matrix Strategies",
    "desc": "Accelerate CI feedback loops: Matrix builds across multiple Node/Python/OS versions, parallel test sharding (`--shard=1/4`), dependency caching (`actions/cache`), and flaky test quarantine.",
    "syllabus": [
      "Matrix Strategy: `strategy.matrix: { node: [18, 20, 22], os: [ubuntu-latest, macos-latest] }` yielding combinatorial jobs.",
      "GitHub Actions Caching: Caching `~/.npm` or `~/.cache/pip` based on `hashFiles('**/package-lock.json')`.",
      "Parallel Test Sharding: Dividing 2,000 unit tests across 4 parallel runners to cut pipeline time from 20m to 5m."
    ]
  },
  {
    "day": 11,
    "title": "Semantic Versioning (SemVer) & Automated Git Tagging",
    "desc": "Automate release versioning: SemVer specification (`MAJOR.MINOR.PATCH`), Conventional Commits (`feat:`, `fix:`, `feat!:`, `BREAKING CHANGE`), and automated CHANGELOG generation.",
    "syllabus": [
      "SemVer Anatomy: `MAJOR` (Breaking API changes), `MINOR` (Backwards-compatible features), `PATCH` (Backwards-compatible bug fixes).",
      "Conventional Commits 1.0.0: Structuring commit messages to drive automated release pipelines.",
      "Automated Release Drafter: Generating git tags (`v1.2.3`) and GitHub Releases with release notes."
    ]
  },
  {
    "day": 12,
    "title": "Container Registry Security & Vulnerability Scanning (Trivy/Clair)",
    "desc": "Secure container registries: Scanning images with Trivy and Clair, analyzing Common Vulnerabilities and Exposures (CVEs), CVSS severity scores, and enforcing build-breaking security gates.",
    "syllabus": [
      "Vulnerability Scanning: Scanning OS packages (apk/deb/rpm) and language dependencies (npm/pip/cargo).",
      "CVSS Score Ranges: Low (0.1-3.9), Medium (4.0-6.9), High (7.0-8.9), Critical (9.0-10.0).",
      "CI Security Gates: `--exit-code 1 --severity CRITICAL,HIGH` blocking image push to AWS ECR / Docker Hub."
    ]
  },
  {
    "day": 13,
    "title": "Automated Staging Deployments, SSH Bastions & Environment Promotion",
    "desc": "Orchestrate environment progression: Development -> Staging -> Production promotion gates, SSH Bastion tunneling, ephemeral review environments, and automated database schema backups.",
    "syllabus": [
      "Environment Promotion Pipeline: Immutable container artifact built once, promoted across Dev, Staging, Prod.",
      "Bastion Host (Jump Box) Security: SSH agent forwarding, ephemeral SSH keys, and zero public port ingress.",
      "Ephemeral Pull Request Environments: Auto-provisioning preview environments per PR branch."
    ]
  },
  {
    "day": 14,
    "title": "Automated Smoke Testing & Synthetic Health Verification",
    "desc": "Verify post-deployment health: Synthetic transaction probes, deep `/healthz` endpoints (checking DB, Redis, downstream APIs), automated rollbacks on probe failure, and alerting.",
    "syllabus": [
      "Shallow vs Deep Healthchecks: Shallow (HTTP 200 process alive) vs Deep (Verifying read/write to database and cache).",
      "Synthetic Probes: Simulating end-to-end user journeys (User login, add to cart, checkout probe).",
      "Automated Rollback Triggers: Fast-aborting deployments within 60s if smoke tests fail."
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks",
    "desc": "Milestone 2: Construct an end-to-end production CI/CD automation pipeline: Lint -> Matrix Unit Tests -> Multi-Stage Docker Build -> Trivy Security Scan -> Staging Deployment -> Synthetic Smoke Tests -> Auto Rollback.",
    "syllabus": [
      "Enterprise CI/CD Synthesis: Connecting test matrices, security gates, and container builds.",
      "Zero-Human Staging Deployment: Safe, automated push to staging on every merged Pull Request.",
      "Pipeline Resiliency & Disaster Recovery: Automated fast-rollback on regression detection."
    ]
  },
  {
    "day": 16,
    "title": "Kubernetes Core Architecture: Pods, ReplicaSets & Deployments",
    "desc": "Master Kubernetes orchestration architecture: Control Plane (API Server, etcd, Controller Manager, Kube-Scheduler), Worker Nodes (Kubelet, Kube-Proxy, Container Runtime), Pod lifecycle, and Declarative Deployments.",
    "syllabus": [
      "Kubernetes Control Plane vs Worker Node components and consensus via etcd.",
      "Pod Lifecycle & Status: `Pending`, `Running`, `Succeeded`, `Failed`, `CrashLoopBackOff`.",
      "Deployment Controllers: Managing ReplicaSets, RollingUpdate strategy (`maxSurge`, `maxUnavailable`)."
    ]
  },
  {
    "day": 17,
    "title": "Kubernetes Networking: ClusterIP, NodePort & LoadBalancer Services",
    "desc": "Route internal and external traffic in Kubernetes: ClusterIP (Internal pod-to-pod discovery), NodePort (Static port on each node 30000-32767), LoadBalancer (Cloud provider ELB provisioning), and Endpoints / EndpointSlices.",
    "syllabus": [
      "The Kubernetes Network Model: Every Pod gets its own unique, routable IP within the cluster CIDR.",
      "Kube-Proxy & iptables/IPVS: How Services provide stable virtual IPs load balancing across ephemeral Pod IPs.",
      "Service Types: ClusterIP (Default internal) vs NodePort vs LoadBalancer vs ExternalName."
    ]
  },
  {
    "day": 18,
    "title": "Kubernetes Ingress Controllers & Automated TLS Termination",
    "desc": "Manage external HTTP/HTTPS access to services: Ingress Controllers (NGINX, Traefik), Ingress resources (host/path routing), TLS secret certificates, and automated SSL issuance with cert-manager / Let's Encrypt.",
    "syllabus": [
      "Ingress vs LoadBalancer Service: 1 Ingress Controller ELB routing to 100+ services vs 100 expensive individual cloud ELBs.",
      "Path-Based & Host-Based Ingress: `api.pinit.com/v1` -> `api-service:8080`; `cdn.pinit.com` -> `static-service:80`.",
      "Automated TLS with cert-manager: ACME HTTP-01 / DNS-01 challenge reconciliation loops."
    ]
  },
  {
    "day": 19,
    "title": "Kubernetes ConfigMaps, Secrets & Environment Volume Mounting",
    "desc": "Decouple configuration from code in Kubernetes: ConfigMaps (Plain text key-values and config files), Secrets (Base64 encoded sensitive data, SealedSecrets, HashiCorp Vault), and mounting as environment variables or volume files.",
    "syllabus": [
      "ConfigMaps: Injecting environment variables (`envFrom.configMapRef`) and mounting config files (`volumeMounts`).",
      "Kubernetes Secrets: Base64 encoding is NOT encryption; integrating with AWS KMS envelope encryption for etcd at rest.",
      "Live Reloading: Volume-mounted ConfigMaps automatically update in-pod files without restarting containers."
    ]
  },
  {
    "day": 20,
    "title": "Kubernetes Health Probes: Liveness, Readiness & Startup Probes",
    "desc": "Ensure container reliability with Kubernetes health probes: Liveness Probe (Restarts deadlocked pods), Readiness Probe (Removes unready pods from Service endpoints), and Startup Probe (Protects slow-starting legacy apps).",
    "syllabus": [
      "Probe Types: `httpGet` (HTTP 200-399), `tcpSocket` (Port open), `exec` (Command exit 0).",
      "Liveness vs Readiness: Liveness restarts container on failure; Readiness removes container from load balancer endpoints without restart.",
      "Startup Probes: Giving slow legacy applications up to 5 minutes to boot before liveness probes activate."
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA",
    "desc": "Milestone 3: Build an enterprise-grade Kubernetes architecture: NGINX Ingress Controller with SSL termination, Deployment with RollingUpdate and PodAntiAffinity across nodes, and Horizontal Pod Autoscaler (HPA).",
    "syllabus": [
      "High Availability Topology: PodAntiAffinity scheduling pods across distinct worker nodes and AZs.",
      "Horizontal Pod Autoscaler (HPA): Scaling replicas automatically based on CPU/Memory metrics.",
      "Production cluster stress testing and automated traffic load balancing."
    ]
  },
  {
    "day": 22,
    "title": "Helm Package Management & Multi-Environment Values",
    "desc": "Package and deploy Kubernetes applications with Helm: Chart architecture (`Chart.yaml`, `templates/`, `values.yaml`), Go template syntax, built-in objects (`.Values`, `.Release`, `.Chart`), and Helm Release rollbacks.",
    "syllabus": [
      "Helm Chart Structure: Reusable Kubernetes manifests parameterized with Go templating.",
      "Multi-Environment Values: `values.yaml` (Base defaults) overridden by `values.staging.yaml` and `values.prod.yaml`.",
      "Helm Lifecycle: `helm upgrade --install`, `helm rollback <release> <revision>`, and Helm test hooks."
    ]
  },
  {
    "day": 23,
    "title": "GitOps Continuous Delivery with ArgoCD & Declarative Sync",
    "desc": "Implement GitOps delivery: Git repository as single source of truth, automated ArgoCD reconciliation loops, declarative sync policies, and Out-of-Sync / Degraded state detection.",
    "syllabus": [
      "The GitOps Paradigm: Declarative desired state in Git continuously reconciled with live cluster state.",
      "ArgoCD Architecture: API Server, Repository Server, Application Controller reconciling CRDs (`Application`, `AppProject`).",
      "Automated Sync & Self-Healing: Auto-syncing git commits and rolling back manual cluster mutations (anti-drift)."
    ]
  },
  {
    "day": 24,
    "title": "Prometheus Metric Scraping & PromQL Alerting Rules",
    "desc": "Monitor Kubernetes clusters with Prometheus: pull-based metric scraping (`/metrics`), PromQL time-series queries (rate, histogram_quantile, irate), Alertmanager routing, and SLO monitoring.",
    "syllabus": [
      "Prometheus Data Model: Metric name + key-value labels + timestamp + float64 value.",
      "PromQL Fundamentals: Counter rate calculations (`rate(http_requests_total[5m])`) and latency percentiles.",
      "Alertmanager Architecture: Grouping, deduplication, silencing, and PagerDuty/Slack routing."
    ]
  },
  {
    "day": 25,
    "title": "Grafana Dashboards & Distributed Tracing with OpenTelemetry",
    "desc": "Visualize system health and trace microservices: Grafana dashboard panels, OpenTelemetry (OTel) instrumentation, W3C Trace Context propagation (`traceparent`), Spans, and Jaeger visualization.",
    "syllabus": [
      "The 3 Pillars of Observability: Metrics (What is broken), Logs (Why is it broken), Traces (Where is it broken).",
      "W3C Trace Context Standard: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`.",
      "Distributed Tracing: Tracking asynchronous requests across 15 microservices with parent-child Span IDs."
    ]
  },
  {
    "day": 26,
    "title": "Centralized Logging with Fluentbit, Elasticsearch & Kibana",
    "desc": "Aggregate distributed container logs: Fluentbit daemonset log collectors, Logstash filters, Elasticsearch inverted index search, Kibana dashboards, and PII log redaction.",
    "syllabus": [
      "Logging Architecture: Fluentbit log shipper on every node -> Centralized Elasticsearch / OpenSearch cluster.",
      "Structured JSON Logging: Emitting `level`, `timestamp`, `service`, `trace_id`, `message` fields instead of unstructured strings.",
      "PII Masking & Compliance: Redacting credit cards, passwords, and tokens before log persistence."
    ]
  },
  {
    "day": 27,
    "title": "Zero-Downtime Blue-Green & Canary Rollout Orchestration",
    "desc": "Execute progressive delivery deployments: Blue-Green deployments (Instant traffic flip via router), Canary rollouts (Gradual 5% -> 25% -> 100% traffic shift with automated metrics analysis), and Flagger.",
    "syllabus": [
      "Deployment Strategies Compared: Recreate (Downtime) vs RollingUpdate (Gradual) vs Blue-Green (Instant swap) vs Canary (Risk-mitigated).",
      "Canary Analysis: Evaluating HTTP 5xx error rates and p99 latency during each traffic increment phase.",
      "Instant Automated Rollbacks: Reverting router weights to 0% immediately upon metric deviation."
    ]
  },
  {
    "day": 28,
    "title": "DevSecOps: Automated SAST, DAST & Software Supply Chain Security",
    "desc": "Embed security throughout the DevOps lifecycle: Static Application Security Testing (SAST: SonarQube, Semgrep), Dynamic Testing (DAST: OWASP ZAP), Software Bill of Materials (SBOM: Syft), and Sigstore image signing with Cosign.",
    "syllabus": [
      "Shifting Left: Identifying security flaws during IDE writing and PR build phases rather than in production.",
      "Software Bill of Materials (SBOM): Generating SPDX / CycloneDX inventories of every transitive dependency.",
      "Cryptographic Image Signing: Signing container images with Cosign and validating signatures via Kubernetes Kyverno policies."
    ]
  },
  {
    "day": 29,
    "title": "Zero-Downtime Database Migrations & The Expand-Contract Pattern",
    "desc": "Safely execute breaking database schema changes with zero downtime: The Expand-Contract (Parallel Run) Pattern, additive non-destructive migrations, dual-writing, and dropping legacy columns.",
    "syllabus": [
      "The Expand Phase: Add new nullable columns or tables without modifying existing schema.",
      "The Transition Phase: App writes to both old and new columns, reads from new column.",
      "The Contract Phase: Backfill historical rows, drop old columns, and enforce NOT NULL constraints."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise GitOps Continuous Delivery & Zero-Downtime Multi-Cluster Kubernetes Platform",
    "desc": "Final Capstone Synthesis: Build an enterprise-grade automated GitOps continuous delivery platform: Multi-Cluster Kubernetes, ArgoCD automated sync, Blue-Green canary routing, Prometheus/Grafana SLO alerting, OpenTelemetry tracing, DevSecOps gates, and zero-downtime database migrations.",
    "syllabus": [
      "Master DevOps Architecture Synthesis: Declarative infrastructure, automated pipelines, resilient orchestration.",
      "Zero-Downtime Multi-Cluster Release Invariants & Automated Fast-Rollback Verification.",
      "Enterprise Platform Engineer Boardroom Certification."
    ]
  }
];

export const DEVOPS_WEB_DAYS: DayConfig[] = DEVOPS_DAYS;
