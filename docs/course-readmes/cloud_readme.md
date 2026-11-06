# Cloud Native Architectures (AWS) — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Cloud Native Architectures (AWS) (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## ☁️ Course Overview
* **Name**: Cloud Native Architectures (AWS)
* **ID**: `course-cloud-native`
* **Duration**: 30 Days (6 Weeks)
* **Target Audience**: Cloud Architects / Backend Developers / Devops SDEs
* **Learning Interface**: VPC routing tables, security group ports rules, bucket encryption locks, and serverless logs.
* **Evaluation Sandbox**: Cloud engines checking VPC routing tables mappings, Ingress whitelists ports, EC2 monthly pricing calculators, S3 public block policies locks, Lambda resource limits boundaries, API Gateway routing logic, and cloud architecture compliance audits.

---

## 📅 Detailed Day-by-Day Syllabus

### ☁️ Week 1: VPC Networking, Subnet Masking & Security Groups Rules

#### 🟢 Day 1: Introduction to Cloud Computing & AWS Global Infrastructure
* **Lecture Syllabus**:
  - Cloud service models
  - AWS regions & availability zones
  - CloudFront edge caching nodes
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: AWS Virtual Private Cloud (VPC) & Subnets
* **Lecture Syllabus**:
  - VPC IP CIDR ranges boundaries
  - Subnet splitting and mask boundaries
  - Public vs private subnet allocations
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: VPC Routing & Internet Gateways
* **Lecture Syllabus**:
  - Route Table configurations
  - Internet Gateway routing
  - Default route destination maps
* **Coding Exam**: `cloud-basics-exam-day-3` (`evaluateVpcRoutes`)
  - **Task**: Write a JS function `evaluateVpcRoutes(routes)` auditing routing targets.
  - **Test**: `evaluateVpcRoutes([{destination: '0.0.0.0/0', target: 'igw-123'}]) === true`.
* **Coding Assignment**: `cloud-basics-assign-day-3` (`subnetRangeCalculator`)
  - **Task**: Write a JS function `subnetRangeCalculator(cidr)` checking mask sizes.
  - **Test**: Checks if CIDR string ends with /16 or /24.

#### 🟢 Day 4: AWS Security Groups: Network access control ports rules
* **Lecture Syllabus**:
  - Security Groups stateful rules configurations
  - Ingress port boundaries whitelists
  - Configuring outbound egress connection maps
* **Coding Exam**: `cloud-basics-exam-day-4` (`isPortOpen`)
  - **Task**: Write a JS function `isPortOpen(rules, port, originCidr)` validating open ports.
  - **Test**: Matches open port ranges and origin whitelists.
* **Coding Assignment**: `cloud-basics-assign-day-4` (`isSshRestricted`)
  - **Task**: Write a JS function `isSshRestricted(rules)` verifying port 22 access.
  - **Test**: Prevents open public routes mapping to SSH connections.

#### 🟢 Day 5: AWS EC2 instances sizes & storage maps
* **Lecture Syllabus**:
  - EC2 instance types and performance properties
  - EBS volume block storage mappings
  - Resource sizing bounds validations
* **Coding Exam**: `cloud-basics-exam-day-5` (`calculateEc2MonthlyCost`)
  - **Task**: Write a JS function `calculateEc2MonthlyCost(instanceType, hours, storageGb)` computing costs.
  - **Test**: Combines instance rate scales and storage gigabytes.
* **Coding Assignment**: `cloud-basics-assign-day-5` (`isEbsVolumeSafe`)
  - **Task**: Write a JS function `isEbsVolumeSafe(sizeGb, maxLimit)` checking volumes.
  - **Test**: Compare size against thresholds limits.

#### 🟢 Day 6: AWS S3: Storage bucket configurations & encryption keys
* **Lecture Syllabus**:
  - S3 bucket policies structures
  - Blocking public access configurations flags
  - Enabling KMS default encryption keys
* **Coding Exam**: `cloud-basics-exam-day-6` (`isBucketPolicySafe`)
  - **Task**: Write a JS function `isBucketPolicySafe(policy)` checking bucket access.
  - **Test**: Blocks public wildcards permissions structures.
* **Coding Assignment**: `cloud-basics-assign-day-6` (`getS3StorageClass`)
  - **Task**: Write a JS function `getS3StorageClass(accessDays)` mapping storage categories.
  - **Test**: Resolves Standard, Infrequent, or Glacier.

#### 🟢 Day 7: AWS Lambda serverless scaling trigger rules
* **Lecture Syllabus**:
  - Lambda execution timeout limits
  - Memory allocation boundaries
  - Event payload trigger rules
* **Coding Exam**: `cloud-basics-exam-day-7` (`isLambdaLimitAllowed`)
  - **Task**: Write a JS function `isLambdaLimitAllowed(memoryMb, timeoutSec)` checking resources.
  - **Test**: Enforces maximum limits limits (3008MB, 900s timeout).
* **Coding Assignment**: `cloud-basics-assign-day-7` (`canRetryExecution`)
  - **Task**: Write a JS function `canRetryExecution(failures)` checking attempts.
  - **Test**: Rejects counts exceeding 2 failed attempts.

---

### ☁️ Week 2: Routing Gateways & Account compliance Audits

#### 🟢 Day 8: AWS API Gateway: Route mappings & status pages
* **Lecture Syllabus**:
  - API Gateway route configurations mapping
  - HTTP integrations target types
  - Formatting status codes returns
* **Coding Exam**: `cloud-basics-exam-day-8` (`routeApiGateway`)
  - **Task**: Write a JS function `routeApiGateway(method, path)` mapping routes.
  - **Test**: Routes GET or POST request targeting /api/ paths to LambdaTrigger.
* **Coding Assignment**: `cloud-basics-assign-day-8` (`isRateLimitBucketSafe`)
  - **Task**: Write a JS function `isRateLimitBucketSafe(bucketSize)` verifying capacities.
  - **Test**: Check scale limits.

#### 🟢 Day 9: Final Capstone: Cloud Native compliance audit
* **Lecture Syllabus**:
  - VPC routing compliance scans
  - Security Group open ports audit
  - S3 public bucket access audits
* **Coding Exam**: `cloud-basics-exam-day-9` (`evaluateCloudCompliance`)
  - **Task**: Write a JS function `evaluateCloudCompliance(report)` verifying AWS infrastructure.
  - **Test**: Validates routes, ports, and bucket encryption parameters in report.
* **Coding Assignment**: `cloud-basics-assign-day-9` (`calcCostStatus`)
  - **Task**: Write a JS function `calcCostStatus(monthlyCost, budget)` checking budgets.
  - **Test**: Returns OVER_BUDGET or WITHIN_BUDGET status.

---

### ☁️ Week 3: Applied Cloud Architecture & Security Reviews

#### 🟢 Day 10: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

---

### ☁️ Week 4: Applied Cloud Architecture & Security Reviews (Review)

#### 🟢 Day 15: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing VPC routing bounds
  - Assembling infrastructure security checklists
  - Verifying database sharding parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Cloud Native compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final cloud native architectures deployment and infrastructure audit report
  - Verify VPC route table paths and Security Groups ingress whitelists
  - Confirm S3 buckets AES encryptions policies and Lambda serverless scaling resources limit configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
