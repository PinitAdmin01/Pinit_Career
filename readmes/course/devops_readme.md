# DevOps & CI/CD Pipeline Automation — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **DevOps & CI/CD Pipeline Automation (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🚀 Course Overview
* **Name**: DevOps & CI/CD Pipeline Automation
* **ID**: `course-devops-cicd`
* **Duration**: 30 Days (6 Weeks)
* **Target Audience**: Infrastructure SDEs / DevOps Engineers / Release Managers
* **Learning Interface**: Pipeline runners schedules, Docker layer maps, Kubernetes replica state sheets, and ConfigMaps volumes.
* **Evaluation Sandbox**: Build compilers checking cron syntax timings, container image layer storage limits, Docker bridge communications, GitHub actions runners events, Kubernetes CPU horizontal autoscalers, and ConfigMaps yaml values.

---

## 📅 Detailed Day-by-Day Syllabus

### 🚀 Week 1: Linux Command Line, Scripting & Docker Containers

#### 🟢 Day 1: Linux Filesystem & Navigation
* **Lecture Syllabus**:
  - Linux filesystem hierarchies (bin, etc, var, home)
  - Navigation basics
  - File copy, moves, and cleanup operations
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Linux Permissions, Users & Process Control
* **Lecture Syllabus**:
  - Chown, chmod permissions boundaries
  - User and usergroup security policies
  - Process monitoring and signal control
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Linux Networking & Scripting (Bash)
* **Lecture Syllabus**:
  - Bash loops, conditions, and variable formats
  - Cron scheduled task pipelines
  - Network lookup tools validation
* **Coding Exam**: `devops-basics-exam-day-3` (`buildCronSchedule`)
  - **Task**: Write a JS function `buildCronSchedule(hour)` validating cron strings.
  - **Test**: `buildCronSchedule(5) === '0 5 * * *'`.
* **Coding Assignment**: `devops-basics-assign-day-3` (`isExitSuccess`)
  - **Task**: Write a JS function `isExitSuccess(code)` checking exit status flags.
  - **Test**: Returns true if code is 0.

#### 🟢 Day 4: Docker: Containers storage overlay sizes
* **Lecture Syllabus**:
  - Docker container layer concepts
  - Measuring storage cache sizes
  - Optimizing multi-stage build layers
* **Coding Exam**: `devops-basics-exam-day-4` (`isImageSizeSafe`)
  - **Task**: Write a JS function `isImageSizeSafe(baseMb, overlayMb, maxLimitMb)` checking layer sizes.
  - **Test**: Rejects combined sizes exceeding limit bounds.
* **Coding Assignment**: `devops-basics-assign-day-4` (`getDockerPortMap`)
  - **Task**: Write a JS function `getDockerPortMap(host, container)` building port parameters.
  - **Test**: Formats host-to-container port strings.

#### 🟢 Day 5: Docker: Containers networking bridges check
* **Lecture Syllabus**:
  - Docker bridge network architecture
  - Routing isolated container DNS
  - Validating container socket gates
* **Coding Exam**: `devops-basics-exam-day-5` (`canBridgeResolve`)
  - **Task**: Write a JS function `canBridgeResolve(originNet, targetNet)` checking bridge access.
  - **Test**: Enforces identical network name variables matching rules.
* **Coding Assignment**: `devops-basics-assign-day-5` (`isSubnetAllowed`)
  - **Task**: Write a JS function `isSubnetAllowed(ip, prefix)` checking subnet boundaries.
  - **Test**: Validates ip startsWith prefix.

#### 🟢 Day 6: CI/CD: GitHub Actions runners pipeline scheduler
* **Lecture Syllabus**:
  - CI/CD pipeline event scheduling triggers
  - GitHub Actions workflow syntax configurations
  - Job runners sequential executions rules
* **Coding Exam**: `devops-basics-exam-day-6` (`isPipelineTriggered`)
  - **Task**: Write a JS function `isPipelineTriggered(event, branch)` validating triggers.
  - **Test**: Triggers true on pull_request to main branch.
* **Coding Assignment**: `devops-basics-assign-day-6` (`getRunnerOs`)
  - **Task**: Write a JS function `getRunnerOs(runnerLabel)` mapping runner targets.
  - **Test**: Resolves windows-latest or ubuntu-latest tags.

#### 🟢 Day 7: Kubernetes: Pod replicas autoscaler checks
* **Lecture Syllabus**:
  - Kubernetes pod replicas parameters
  - CPU utilization scaling triggers
  - Configuring target minimum and maximum replicas limits
* **Coding Exam**: `devops-basics-exam-day-7` (`calculateScaledReplicas`)
  - **Task**: Write a JS function `calculateScaledReplicas(current, cpuUtil, targetUtil, max)` autoscaling pods.
  - **Test**: Computes scaled pod counts rounding up.
* **Coding Assignment**: `devops-basics-assign-day-7` (`isPodReady`)
  - **Task**: Write a JS function `isPodReady(status)` evaluating pod status states.
  - **Test**: Validates Running or Completed strings.

---

### 🚀 Week 2: Orchestration Configurations & Pipeline Auditing

#### 🟢 Day 8: Kubernetes: ConfigMaps parameters compiler
* **Lecture Syllabus**:
  - Kubernetes ConfigMap and Secret layouts
  - Mounting config keys to pod volumes
  - Parsing environment namespaces values
* **Coding Exam**: `devops-basics-exam-day-8` (`isConfigKeyValValid`)
  - **Task**: Write a JS function `isConfigKeyValValid(yamlStr, expectedKey)` checking yaml configurations.
  - **Test**: Flags expectedKey presence.
* **Coding Assignment**: `devops-basics-assign-day-8` (`isSecretBase64`)
  - **Task**: Write a JS function `isSecretBase64(secretVal)` checking secrets formats.
  - **Test**: Enforces 4-byte boundaries criteria.

#### 🟢 Day 9: Final Capstone: Pipeline & Deployment compliance audit
* **Lecture Syllabus**:
  - Pipeline execution timing diagnostics
  - Container layer sizes audits
  - Kubernetes autoscaler scaling parameters validation
* **Coding Exam**: `devops-basics-exam-day-9` (`evaluatePipelineBuild`)
  - **Task**: Write a JS function `evaluatePipelineBuild(report)` validating pipeline builds.
  - **Test**: Checks images, triggers, and pods parameters in report.
* **Coding Assignment**: `devops-basics-assign-day-9` (`getBuildRating`)
  - **Task**: Write a JS function `getBuildRating(errorsCount)` rating deployments.
  - **Test**: Returns SUCCESS, UNSTABLE, or FAILED.

---

### 🚀 Week 3: Applied Pipeline Orchestration & Scaling Reviews

#### 🟢 Day 10: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

---

### 🚀 Week 4: Applied Pipeline Orchestration & Scaling Reviews (Review)

#### 🟢 Day 15: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing container sizes benchmarks
  - Assembling release audit checklists
  - Verifying Kubernetes routing configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Pipeline & Deployment compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final pipeline compilation and deployments audit report
  - Verify Docker layers sizes and Kubernetes horizontal pod autoscalers triggers
  - Confirm ConfigMaps keys yaml parser and GitHub Actions events runners scheduler configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
