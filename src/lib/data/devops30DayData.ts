import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const DEVOPS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "DevOps Culture, CI/CD & The 12-Factor App",
    desc: "Understand continuous integration, continuous delivery, automated feedback loops, and 12-factor rules.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of DevOps Culture, CI/CD & The 12-Factor App.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: DevOps Culture, CI/CD & The 12-Factor App Validation",
    eDesc: "Implement a JavaScript validation function for DevOps Culture, CI/CD & The 12-Factor App.",
    eStarter: "function devopsTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay1 !== 'function') throw new Error('Function devopsTaskDay1 not found');\nif (devopsTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: DevOps Culture, CI/CD & The 12-Factor App Practice",
    aDesc: "Write an auxiliary helper function for DevOps Culture, CI/CD & The 12-Factor App.",
    aStarter: "function devopsTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Linux Administration & Bash Automation",
    desc: "Master POSIX shells, process signals, background daemons, systemd services, and automation scripts.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Linux Administration & Bash Automation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Linux Administration & Bash Automation Validation",
    eDesc: "Implement a JavaScript validation function for Linux Administration & Bash Automation.",
    eStarter: "function devopsTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay2 !== 'function') throw new Error('Function devopsTaskDay2 not found');\nif (devopsTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Linux Administration & Bash Automation Practice",
    aDesc: "Write an auxiliary helper function for Linux Administration & Bash Automation.",
    aStarter: "function devopsTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Docker Architecture & Image Layering",
    desc: "Understand Docker daemon, container isolation, copy-on-write image layers, and build cache optimization.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Docker Architecture & Image Layering.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Docker Architecture & Image Layering Validation",
    eDesc: "Implement a JavaScript validation function for Docker Architecture & Image Layering.",
    eStarter: "function devopsTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay3 !== 'function') throw new Error('Function devopsTaskDay3 not found');\nif (devopsTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Docker Architecture & Image Layering Practice",
    aDesc: "Write an auxiliary helper function for Docker Architecture & Image Layering.",
    aStarter: "function devopsTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Writing Optimized Multi-Stage Dockerfiles",
    desc: "Minimize production image weights using multi-stage builds, non-root users, and Alpine base images.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Writing Optimized Multi-Stage Dockerfiles.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Writing Optimized Multi-Stage Dockerfiles Validation",
    eDesc: "Implement a JavaScript validation function for Writing Optimized Multi-Stage Dockerfiles.",
    eStarter: "function devopsTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay4 !== 'function') throw new Error('Function devopsTaskDay4 not found');\nif (devopsTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Writing Optimized Multi-Stage Dockerfiles Practice",
    aDesc: "Write an auxiliary helper function for Writing Optimized Multi-Stage Dockerfiles.",
    aStarter: "function devopsTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Docker Compose & Multi-Container Networks",
    desc: "Orchestrate local web, database, and Redis cache containers with isolated bridge networks and volumes.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Docker Compose & Multi-Container Networks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Docker Compose & Multi-Container Networks Validation",
    eDesc: "Implement a JavaScript validation function for Docker Compose & Multi-Container Networks.",
    eStarter: "function devopsTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay5 !== 'function') throw new Error('Function devopsTaskDay5 not found');\nif (devopsTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Docker Compose & Multi-Container Networks Practice",
    aDesc: "Write an auxiliary helper function for Docker Compose & Multi-Container Networks.",
    aStarter: "function devopsTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "GitHub Actions Core Architecture & Runners",
    desc: "Structure GitHub Actions YAML workflows, triggers, and runner environments.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of GitHub Actions Core Architecture & Runners.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: GitHub Actions Core Architecture & Runners Validation",
    eDesc: "Implement a JavaScript validation function for GitHub Actions Core Architecture & Runners.",
    eStarter: "function devopsTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay6 !== 'function') throw new Error('Function devopsTaskDay6 not found');\nif (devopsTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: GitHub Actions Core Architecture & Runners Practice",
    aDesc: "Write an auxiliary helper function for GitHub Actions Core Architecture & Runners.",
    aStarter: "function devopsTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "CI/CD Test Automation & Artifact Storage",
    desc: "Automate test suites, linting checks, build artifact uploads, and code coverage reporting.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of CI/CD Test Automation & Artifact Storage.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: CI/CD Test Automation & Artifact Storage Validation",
    eDesc: "Implement a JavaScript validation function for CI/CD Test Automation & Artifact Storage.",
    eStarter: "function devopsTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay7 !== 'function') throw new Error('Function devopsTaskDay7 not found');\nif (devopsTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: CI/CD Test Automation & Artifact Storage Practice",
    aDesc: "Write an auxiliary helper function for CI/CD Test Automation & Artifact Storage.",
    aStarter: "function devopsTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Container Registry Integration & Push",
    desc: "Authenticate, tag with semver commits, and securely push container images to Docker Hub and AWS ECR.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Container Registry Integration & Push.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Container Registry Integration & Push Validation",
    eDesc: "Implement a JavaScript validation function for Container Registry Integration & Push.",
    eStarter: "function devopsTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay8 !== 'function') throw new Error('Function devopsTaskDay8 not found');\nif (devopsTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Container Registry Integration & Push Practice",
    aDesc: "Write an auxiliary helper function for Container Registry Integration & Push.",
    aStarter: "function devopsTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Infrastructure as Code (IaC) & Terraform Basics",
    desc: "Understand declarative infrastructure, providers, resources, variables, and outputs in HCL.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Infrastructure as Code (IaC) & Terraform Basics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Infrastructure as Code (IaC) & Terraform Basics Validation",
    eDesc: "Implement a JavaScript validation function for Infrastructure as Code (IaC) & Terraform Basics.",
    eStarter: "function devopsTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay9 !== 'function') throw new Error('Function devopsTaskDay9 not found');\nif (devopsTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Infrastructure as Code (IaC) & Terraform Basics Practice",
    aDesc: "Write an auxiliary helper function for Infrastructure as Code (IaC) & Terraform Basics.",
    aStarter: "function devopsTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Terraform State Management & Remote Backends",
    desc: "Configure S3/DynamoDB remote state locking, workspaces, module composition, and plan safety audits.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Terraform State Management & Remote Backends.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Terraform State Management & Remote Backends Validation",
    eDesc: "Implement a JavaScript validation function for Terraform State Management & Remote Backends.",
    eStarter: "function devopsTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay10 !== 'function') throw new Error('Function devopsTaskDay10 not found');\nif (devopsTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Terraform State Management & Remote Backends Practice",
    aDesc: "Write an auxiliary helper function for Terraform State Management & Remote Backends.",
    aStarter: "function devopsTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kubernetes Core Architecture & Control Plane",
    desc: "Dissect API Server, etcd, kube-scheduler, kube-controller-manager, and worker node kubelets.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kubernetes Core Architecture & Control Plane.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kubernetes Core Architecture & Control Plane Validation",
    eDesc: "Implement a JavaScript validation function for Kubernetes Core Architecture & Control Plane.",
    eStarter: "function devopsTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay11 !== 'function') throw new Error('Function devopsTaskDay11 not found');\nif (devopsTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kubernetes Core Architecture & Control Plane Practice",
    aDesc: "Write an auxiliary helper function for Kubernetes Core Architecture & Control Plane.",
    aStarter: "function devopsTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kubernetes Pods, Deployments & ReplicaSets",
    desc: "Declare self-healing Pod deployments, rolling update strategies, and replica count scaling.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kubernetes Pods, Deployments & ReplicaSets.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kubernetes Pods, Deployments & ReplicaSets Validation",
    eDesc: "Implement a JavaScript validation function for Kubernetes Pods, Deployments & ReplicaSets.",
    eStarter: "function devopsTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay12 !== 'function') throw new Error('Function devopsTaskDay12 not found');\nif (devopsTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kubernetes Pods, Deployments & ReplicaSets Practice",
    aDesc: "Write an auxiliary helper function for Kubernetes Pods, Deployments & ReplicaSets.",
    aStarter: "function devopsTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kubernetes Services & Cluster Networking",
    desc: "Configure ClusterIP, NodePort, and LoadBalancer services for internal and external traffic routing.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kubernetes Services & Cluster Networking.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kubernetes Services & Cluster Networking Validation",
    eDesc: "Implement a JavaScript validation function for Kubernetes Services & Cluster Networking.",
    eStarter: "function devopsTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay13 !== 'function') throw new Error('Function devopsTaskDay13 not found');\nif (devopsTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kubernetes Services & Cluster Networking Practice",
    aDesc: "Write an auxiliary helper function for Kubernetes Services & Cluster Networking.",
    aStarter: "function devopsTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kubernetes ConfigMaps & Secrets Management",
    desc: "Inject dynamic environment variables and encrypted secrets into container pods securely.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kubernetes ConfigMaps & Secrets Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kubernetes ConfigMaps & Secrets Management Validation",
    eDesc: "Implement a JavaScript validation function for Kubernetes ConfigMaps & Secrets Management.",
    eStarter: "function devopsTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay14 !== 'function') throw new Error('Function devopsTaskDay14 not found');\nif (devopsTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kubernetes ConfigMaps & Secrets Management Practice",
    aDesc: "Write an auxiliary helper function for Kubernetes ConfigMaps & Secrets Management.",
    aStarter: "function devopsTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kubernetes Storage (PV, PVC & StorageClasses)",
    desc: "Bind persistent volumes, define dynamic provisioners, and manage stateful database storage.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kubernetes Storage (PV, PVC & StorageClasses).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kubernetes Storage (PV, PVC & StorageClasses) Validation",
    eDesc: "Implement a JavaScript validation function for Kubernetes Storage (PV, PVC & StorageClasses).",
    eStarter: "function devopsTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay15 !== 'function') throw new Error('Function devopsTaskDay15 not found');\nif (devopsTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kubernetes Storage (PV, PVC & StorageClasses) Practice",
    aDesc: "Write an auxiliary helper function for Kubernetes Storage (PV, PVC & StorageClasses).",
    aStarter: "function devopsTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Helm Charts & Kubernetes Package Management",
    desc: "Package Kubernetes manifests into templated Helm charts, manage values files, and track releases.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Helm Charts & Kubernetes Package Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Helm Charts & Kubernetes Package Management Validation",
    eDesc: "Implement a JavaScript validation function for Helm Charts & Kubernetes Package Management.",
    eStarter: "function devopsTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay16 !== 'function') throw new Error('Function devopsTaskDay16 not found');\nif (devopsTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Helm Charts & Kubernetes Package Management Practice",
    aDesc: "Write an auxiliary helper function for Helm Charts & Kubernetes Package Management.",
    aStarter: "function devopsTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "ArgoCD & GitOps Continuous Delivery",
    desc: "Implement GitOps reconciliation loops, declarative application manifests, sync waves, and auto rollbacks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of ArgoCD & GitOps Continuous Delivery.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: ArgoCD & GitOps Continuous Delivery Validation",
    eDesc: "Implement a JavaScript validation function for ArgoCD & GitOps Continuous Delivery.",
    eStarter: "function devopsTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay17 !== 'function') throw new Error('Function devopsTaskDay17 not found');\nif (devopsTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: ArgoCD & GitOps Continuous Delivery Practice",
    aDesc: "Write an auxiliary helper function for ArgoCD & GitOps Continuous Delivery.",
    aStarter: "function devopsTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kubernetes Ingress Controllers & Nginx",
    desc: "Configure hostname routing, SSL/TLS termination with Cert-Manager, and path-based ingress rules.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kubernetes Ingress Controllers & Nginx.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kubernetes Ingress Controllers & Nginx Validation",
    eDesc: "Implement a JavaScript validation function for Kubernetes Ingress Controllers & Nginx.",
    eStarter: "function devopsTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay18 !== 'function') throw new Error('Function devopsTaskDay18 not found');\nif (devopsTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kubernetes Ingress Controllers & Nginx Practice",
    aDesc: "Write an auxiliary helper function for Kubernetes Ingress Controllers & Nginx.",
    aStarter: "function devopsTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Service Mesh Architecture & Istio",
    desc: "Deploy Envoy proxy sidecars, mutual TLS (mTLS), traffic shifting, canary rollouts, and circuit breakers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Service Mesh Architecture & Istio.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Service Mesh Architecture & Istio Validation",
    eDesc: "Implement a JavaScript validation function for Service Mesh Architecture & Istio.",
    eStarter: "function devopsTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay19 !== 'function') throw new Error('Function devopsTaskDay19 not found');\nif (devopsTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Service Mesh Architecture & Istio Practice",
    aDesc: "Write an auxiliary helper function for Service Mesh Architecture & Istio.",
    aStarter: "function devopsTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Prometheus Monitoring & Metric Collection",
    desc: "Expose custom application metrics, scrape endpoints, and query data using PromQL expressions.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Prometheus Monitoring & Metric Collection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Prometheus Monitoring & Metric Collection Validation",
    eDesc: "Implement a JavaScript validation function for Prometheus Monitoring & Metric Collection.",
    eStarter: "function devopsTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay20 !== 'function') throw new Error('Function devopsTaskDay20 not found');\nif (devopsTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Prometheus Monitoring & Metric Collection Practice",
    aDesc: "Write an auxiliary helper function for Prometheus Monitoring & Metric Collection.",
    aStarter: "function devopsTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Grafana Dashboards & Visual Alerts",
    desc: "Design real-time operational dashboards, configure threshold alerts, and route incidents to PagerDuty.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Grafana Dashboards & Visual Alerts.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Grafana Dashboards & Visual Alerts Validation",
    eDesc: "Implement a JavaScript validation function for Grafana Dashboards & Visual Alerts.",
    eStarter: "function devopsTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay21 !== 'function') throw new Error('Function devopsTaskDay21 not found');\nif (devopsTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Grafana Dashboards & Visual Alerts Practice",
    aDesc: "Write an auxiliary helper function for Grafana Dashboards & Visual Alerts.",
    aStarter: "function devopsTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Distributed Tracing with OpenTelemetry & Jaeger",
    desc: "Propagate W3C trace contexts across microservices, trace span lifecycles, and diagnose latency.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Distributed Tracing with OpenTelemetry & Jaeger.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Distributed Tracing with OpenTelemetry & Jaeger Validation",
    eDesc: "Implement a JavaScript validation function for Distributed Tracing with OpenTelemetry & Jaeger.",
    eStarter: "function devopsTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay22 !== 'function') throw new Error('Function devopsTaskDay22 not found');\nif (devopsTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Distributed Tracing with OpenTelemetry & Jaeger Practice",
    aDesc: "Write an auxiliary helper function for Distributed Tracing with OpenTelemetry & Jaeger.",
    aStarter: "function devopsTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Centralized Logging with Vector & Elasticsearch",
    desc: "Collect structured JSON log streams, aggregate high-throughput container logs, and configure lifecycles.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Centralized Logging with Vector & Elasticsearch.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Centralized Logging with Vector & Elasticsearch Validation",
    eDesc: "Implement a JavaScript validation function for Centralized Logging with Vector & Elasticsearch.",
    eStarter: "function devopsTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay23 !== 'function') throw new Error('Function devopsTaskDay23 not found');\nif (devopsTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Centralized Logging with Vector & Elasticsearch Practice",
    aDesc: "Write an auxiliary helper function for Centralized Logging with Vector & Elasticsearch.",
    aStarter: "function devopsTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "HashiCorp Vault Secret Management",
    desc: "Issue dynamic database credentials, encrypt application secrets transitively, and configure Kubernetes auth.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of HashiCorp Vault Secret Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: HashiCorp Vault Secret Management Validation",
    eDesc: "Implement a JavaScript validation function for HashiCorp Vault Secret Management.",
    eStarter: "function devopsTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay24 !== 'function') throw new Error('Function devopsTaskDay24 not found');\nif (devopsTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: HashiCorp Vault Secret Management Practice",
    aDesc: "Write an auxiliary helper function for HashiCorp Vault Secret Management.",
    aStarter: "function devopsTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Container Security & Vulnerability Scanning (Trivy)",
    desc: "Scan Docker image layers for CVEs, audit base image vulnerabilities, and enforce admission controllers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Container Security & Vulnerability Scanning (Trivy).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Container Security & Vulnerability Scanning (Trivy) Validation",
    eDesc: "Implement a JavaScript validation function for Container Security & Vulnerability Scanning (Trivy).",
    eStarter: "function devopsTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay25 !== 'function') throw new Error('Function devopsTaskDay25 not found');\nif (devopsTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Container Security & Vulnerability Scanning (Trivy) Practice",
    aDesc: "Write an auxiliary helper function for Container Security & Vulnerability Scanning (Trivy).",
    aStarter: "function devopsTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Continuous Deployment Strategies (Blue-Green / Canary)",
    desc: "Roll out zero-downtime releases with traffic percentage slicing and automated health rollbacks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Continuous Deployment Strategies (Blue-Green / Canary).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Continuous Deployment Strategies (Blue-Green / Canary) Validation",
    eDesc: "Implement a JavaScript validation function for Continuous Deployment Strategies (Blue-Green / Canary).",
    eStarter: "function devopsTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay26 !== 'function') throw new Error('Function devopsTaskDay26 not found');\nif (devopsTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Continuous Deployment Strategies (Blue-Green / Canary) Practice",
    aDesc: "Write an auxiliary helper function for Continuous Deployment Strategies (Blue-Green / Canary).",
    aStarter: "function devopsTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Chaos Engineering & Resiliency Testing",
    desc: "Simulate pod failures, network packet loss, and CPU throttling using Chaos Mesh to validate recovery.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Chaos Engineering & Resiliency Testing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Chaos Engineering & Resiliency Testing Validation",
    eDesc: "Implement a JavaScript validation function for Chaos Engineering & Resiliency Testing.",
    eStarter: "function devopsTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay27 !== 'function') throw new Error('Function devopsTaskDay27 not found');\nif (devopsTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Chaos Engineering & Resiliency Testing Practice",
    aDesc: "Write an auxiliary helper function for Chaos Engineering & Resiliency Testing.",
    aStarter: "function devopsTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Site Reliability Engineering (SRE) & SLIs/SLOs",
    desc: "Define Service Level Indicators (SLIs), Service Level Objectives (SLOs), and manage Error Budgets.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Site Reliability Engineering (SRE) & SLIs/SLOs.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Site Reliability Engineering (SRE) & SLIs/SLOs Validation",
    eDesc: "Implement a JavaScript validation function for Site Reliability Engineering (SRE) & SLIs/SLOs.",
    eStarter: "function devopsTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay28 !== 'function') throw new Error('Function devopsTaskDay28 not found');\nif (devopsTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Site Reliability Engineering (SRE) & SLIs/SLOs Practice",
    aDesc: "Write an auxiliary helper function for Site Reliability Engineering (SRE) & SLIs/SLOs.",
    aStarter: "function devopsTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "DevSecOps & Automated Security Compliance",
    desc: "Embed SAST and DAST scans directly into CI/CD pipelines.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of DevSecOps & Automated Security Compliance.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: DevSecOps & Automated Security Compliance Validation",
    eDesc: "Implement a JavaScript validation function for DevSecOps & Automated Security Compliance.",
    eStarter: "function devopsTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay29 !== 'function') throw new Error('Function devopsTaskDay29 not found');\nif (devopsTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: DevSecOps & Automated Security Compliance Practice",
    aDesc: "Write an auxiliary helper function for DevSecOps & Automated Security Compliance.",
    aStarter: "function devopsTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Zero-Downtime Multi-Cluster GitOps Pipeline",
    desc: "Deploy an end-to-end automated GitOps pipeline with Istio canary routing, Prometheus alerts, and Vault secrets.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Zero-Downtime Multi-Cluster GitOps Pipeline.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Zero-Downtime Multi-Cluster GitOps Pipeline Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Zero-Downtime Multi-Cluster GitOps Pipeline.",
    eStarter: "function devopsTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof devopsTaskDay30 !== 'function') throw new Error('Function devopsTaskDay30 not found');\nif (devopsTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Zero-Downtime Multi-Cluster GitOps Pipeline Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Zero-Downtime Multi-Cluster GitOps Pipeline.",
    aStarter: "function devopsTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof devopsTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const DEVOPS_30_DAYS_QUESTS = DEVOPS_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('devops', i + 1, cfg)
);
