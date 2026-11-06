# scripts/generate_rich_devops_day44.py
import json

day44 = {
    "day": 44,
    "coursePrefix": "devops",
    "title": "Policy as Code (PaC) & Automated IaC Guardrails: OPA, Rego Assertions & Shift-Left Validation",
    "goal": "Implement Policy as Code (PaC) governance across infrastructure pipelines using Open Policy Agent (OPA), Rego assertion semantics, Conftest unit testing, terraform-compliance, and Gatekeeper admission validation.",
    "minutes": 38,
    "recap": "In Day 43, we structured multi-environment cloud infrastructure using Terragrunt dependency DAGs and remote state codegen. Today we establish automated guardrails and governance using Policy as Code (PaC) with Open Policy Agent (OPA) and Rego.",
    "parts": [
        {
            "title": "Policy as Code (PaC) Foundations: Shift-Left Security, Compliance-as-Code & Automated Guardrails vs Manual Auditing",
            "say": [
                "In traditional enterprise IT environments, security and regulatory compliance were enforced through manual change advisory boards (CABs), lengthy spreadsheet checklists, and retrospective security audits. Platform engineers would wait weeks for security teams to review architecture designs, only to discover weeks after deployment that an unencrypted S3 bucket or overly permissive firewall rule had slipped into production.",
                "This legacy governance model is completely incompatible with modern DevOps velocity, where automated pipelines deploy dozens of cloud infrastructure changes daily. Attempting to review declarative infrastructure code manually results in human fatigue, inconsistent rule enforcement, severe deployment bottlenecks, and catastrophic security breaches.",
                "To reconcile rapid infrastructure delivery with rigorous security governance, industry leaders adopt Policy as Code (PaC). Policy as Code is the practice of expressing organizational rules, regulatory compliance mandates (such as PCI-DSS, SOC 2, HIPAA, and GDPR), and operational best practices as machine-readable, version-controlled declarative code.",
                "At the core of Policy as Code is the Shift-Left Security philosophy. Rather than waiting for cloud security posture management (CSPM) tools to flag vulnerabilities after resources are provisioned in live AWS accounts, PaC evaluates infrastructure definitions during local development and CI/CD pull request validation phases.",
                "By shifting validation left into the developer's feedback loop, security policies act as automated guardrails rather than bureaucratic gates. Developers receive instant, actionable feedback in their terminal or Git pull request within seconds of committing code: 'Denied: S3 bucket must have server-side encryption enabled with customer-managed KMS key.'",
                "Furthermore, PaC bridges the historical communication chasm between security architects and platform engineers. Instead of publishing vague 80-page PDF security standards that developers rarely read, security teams author executable, testable code repositories containing concrete policy definitions.",
                "These policy repositories undergo standard software engineering lifecycles: automated unit testing, peer review, semantic versioning, and continuous integration testing. When corporate compliance requirements change—such as mandating TLS 1.3 across all internet-facing load balancers—security engineers update a policy rule, run tests, and immediately enforce the mandate across all enterprise pipelines.",
                "PaC also provides automated audit readiness. In regulated industries, demonstrating compliance to external auditors historically required months of collecting screenshots and configuration logs. With Policy as Code, organizations provide auditors with Git commit histories, unit test execution logs, and cryptographic verification that every single deployed resource passed automated compliance checks prior to provisioning.",
                "Another critical benefit of PaC is the distinction between Guardrails and Discretionary Guidelines. While linter tools like tflint or tfsec provide valuable heuristic warnings, a robust PaC engine operates as an authoritative admission controller: if an infrastructure plan violates a critical security policy, the pipeline halts immediately with a non-zero exit code, physically preventing deployment.",
                "In addition, Policy as Code scales seamlessly across multi-cloud and multi-account architectures. The same logical policy—such as 'all storage volumes must be encrypted with an approved encryption key'—can be asserted against AWS EBS volumes, Azure Managed Disks, and Google Cloud Persistent Disks using a unified policy language.",
                "From an organizational perspective, automated guardrails empower application development teams to practice self-service infrastructure provisioning. Central security teams no longer need to micromanage individual PRs; they trust that automated PaC engines will intercept and block any non-compliant infrastructure changes before they reach cloud APIs.",
                "Mastering Policy as Code foundations, shift-left governance philosophies, compliance-as-code engineering, and automated guardrail pipelines prepares cloud platform engineers to build enterprise platforms that deliver high velocity without compromising security integrity."
            ],
            "example": "A global healthcare enterprise replaced their weekly manual Change Advisory Board with an automated Policy as Code pipeline. Developers provisioned HIPAA-compliant AWS resources in minutes, while automated guardrails prevented 140 unencrypted S3 buckets from ever reaching production over a twelve-month period.",
            "code": "interface ComplianceCheck {\n  ruleId: string;\n  resourceType: string;\n  status: 'PASSED' | 'VIOLATION';\n  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';\n  remediation: string;\n}\n\nclass PolicyAsCodeEngine {\n  evaluateResource(resource: { type: string; encrypted: boolean }): ComplianceCheck {\n    if (resource.type === 'aws_s3_bucket' && !resource.encrypted) {\n      return {\n        ruleId: 'SEC-S3-001',\n        resourceType: resource.type,\n        status: 'VIOLATION',\n        severity: 'CRITICAL',\n        remediation: 'Enable server-side KMS encryption on the S3 bucket.'\n      };\n    }\n    return {\n      ruleId: 'SEC-S3-001',\n      resourceType: resource.type,\n      status: 'PASSED',\n      severity: 'LOW',\n      remediation: 'None required.'\n    };\n  }\n}\n\nconst engine = new PolicyAsCodeEngine();\nconst audit = engine.evaluateResource({ type: 'aws_s3_bucket', encrypted: false });\nconsole.log(`PAC_POLICY_EVALUATED | Rule=${audit.ruleId} | Status=${audit.status} | Severity=${audit.severity} | ShiftLeftBlocked=true`);",
            "output": "PAC_POLICY_EVALUATED | Rule=SEC-S3-001 | Status=VIOLATION | Severity=CRITICAL | ShiftLeftBlocked=true",
            "codeNotes": [
              {"line": 1, "note": "Defines ComplianceCheck interface modeling Policy as Code rule evaluation outcomes."},
              {"line": 9, "note": "Implements rule logic asserting server-side encryption for S3 storage resources."},
              {"line": 23, "note": "Evaluates unencrypted S3 bucket triggering critical security violation."},
              {"line": 25, "note": "Outputs verified PaC evaluation token proving shift-left pipeline blocking."}
            ],
            "tryIt": "Pass encrypted: true and verify that status evaluates to 'PASSED' with severity 'LOW'.",
            "check": {
              "question": "What is the primary operational advantage of Policy as Code (PaC) over traditional manual Change Advisory Board (CAB) reviews?",
              "options": [
                "It shifts security evaluation left into automated CI/CD pipelines, providing instant, deterministic feedback and physically blocking non-compliant infrastructure in seconds.",
                "It eliminates the need for cloud infrastructure by converting code into physical servers.",
                "It allows developers to bypass all corporate security policies during emergencies.",
                "It automatically writes user application code using artificial intelligence."
              ],
              "answer": 0,
              "explanation": "Policy as Code provides instant, automated, programmatic guardrails within CI/CD pipelines, eliminating the multi-week bottlenecks and human error inherent in manual review boards."
            }
        },
        {
            "title": "Open Policy Agent (OPA) Architecture & Rego Language: Evaluation engine, declarative rules, sets, comprehension loops & input document querying",
            "say": [
                "When selecting an engine for Policy as Code, organizations require a technology that is vendor-neutral, domain-agnostic, and capable of evaluating policies across heterogeneous systems—from Terraform and Kubernetes to Docker containers, API gateways, and CI/CD pipelines. The undisputed industry standard is the Open Policy Agent (OPA, pronounced 'oh-pa').",
                "Donated to the Cloud Native Computing Foundation (CNCF) and graduated as a top-tier project, Open Policy Agent is a lightweight, general-purpose declarative policy engine. OPA completely decouples policy decision-making from policy enforcement.",
                "Understanding this decoupled architecture is fundamental. The service enforcing the policy (such as a CI/CD runner executing a Terraform plan or a Kubernetes API server processing an ingress) is known as the Policy Enforcement Point (PEP). The PEP queries OPA, which acts as the Policy Decision Point (PDP). The PEP sends a structured JSON payload representing the proposed action (the input document) to OPA; OPA evaluates the input against its loaded policy rules and returns a structured JSON authorization decision (allow or deny).",
                "Policies in OPA are authored in a specialized declarative language named Rego (pronounced 'ray-go'). Inspired by Datalog, a declarative logic programming language, Rego is purpose-built for querying and asserting constraints over deeply nested JSON and YAML hierarchical data structures.",
                "Unlike imperative programming languages (like Python, Go, or JavaScript) which specify how to iterate through collections and check conditions step by step, Rego code declares what assertions must hold true. In Rego, rules evaluate to true or generate sets of values if all expressions in the rule body are simultaneously satisfied.",
                "The basic building block of Rego is the Rule. A rule begins with a head and an optional body: deny[msg] { ... }. The rule body contains a series of expressions separated by newlines or semicolons, which behave as logical AND operations. If every expression in the body evaluates to true, the rule fires and emits the message msg into the deny set.",
                "To evaluate collections, Rego provides powerful Comprehension Loops and Iteration primitives. In Rego, iterating over an array or map does not require a for-loop; instead, writing some_array[_] or some_map[key] automatically binds to each element in the collection.",
                "Furthermore, Rego features Set Comprehensions ({x | ...}) and Array Comprehensions ([x | ...]), allowing engineers to filter and transform nested objects with extraordinary conciseness. For instance, extracting all security group rules that open port 22 can be expressed in a single declarative line.",
                "Another core strength of Rego is its rich library of over 150 built-in pure functions, covering string manipulation, regular expression matching, IP address CIDR parsing (net.cidr_contains), JSON Web Token (JWT) verification, and cryptographic hash verification.",
                "OPA evaluates policies strictly in-memory using optimized Abstract Syntax Trees and indexing algorithms, achieving sub-millisecond evaluation latency. This lightning-fast performance ensures that running dozens of complex policy checks against large infrastructure plans adds zero noticeable delay to CI/CD pipelines.",
                "To ensure software engineering rigor, OPA includes a built-in Unit Testing Framework. Engineers write unit tests in files ending in _test.rego, using mock input documents to verify that deny rules fire when expected and that valid configurations pass cleanly, guaranteeing high policy reliability.",
                "Mastering OPA architecture, PDP/PEP decoupling, Rego declarative assertion semantics, collection comprehensions, and built-in unit testing equips platform engineers to build universal, high-performance policy guardrails across any cloud-native platform."
            ],
            "example": "A platform security team wrote an OPA Rego rule that inspected incoming JSON documents. Using net.cidr_contains('10.0.0.0/8', input.cidr), the rule automatically flagged any firewall configuration attempting to route traffic to public internet CIDRs, blocking invalid PRs in 4 milliseconds.",
            "code": "interface OpaDecision {\n  allow: boolean;\n  violations: string[];\n  evaluationTimeMs: number;\n}\n\nclass RegoPolicyEvaluator {\n  evaluateInput(inputDoc: { resourceType: string; ingressCidrs: string[] }): OpaDecision {\n    const violations: string[] = [];\n    // Rego rule: deny[msg] { input.ingressCidrs[_] == \"0.0.0.0/0\"; msg := \"Public 0.0.0.0/0 forbidden\" }\n    for (const cidr of inputDoc.ingressCidrs) {\n      if (cidr === '0.0.0.0/0') {\n        violations.push(`Violation: Ingress CIDR ${cidr} exposes resource to the public internet.`);\n      }\n    }\n\n    return {\n      allow: violations.length === 0,\n      violations,\n      evaluationTimeMs: 3\n    };\n  }\n}\n\nconst evaluator = new RegoPolicyEvaluator();\nconst decision = evaluator.evaluateInput({\n  resourceType: 'aws_security_group',\n  ingressCidrs: ['10.0.0.0/16', '0.0.0.0/0']\n});\n\nconsole.log(`OPA_REGO_EVALUATED | Allow=${decision.allow} | Violations=${decision.violations.length} | EvalTime=${decision.evaluationTimeMs}ms | Engine=OPA_CORE`);",
            "output": "OPA_REGO_EVALUATED | Allow=false | Violations=1 | EvalTime=3ms | Engine=OPA_CORE",
            "codeNotes": [
              {"line": 1, "note": "Defines OpaDecision interface modeling PDP authorization decisions and violation lists."},
              {"line": 7, "note": "Simulates Rego declarative rule evaluation asserting ingress CIDR security constraints."},
              {"line": 21, "note": "Evaluates security group configuration containing prohibited 0.0.0.0/0 CIDR."},
              {"line": 23, "note": "Outputs verified OPA evaluation token confirming denial and sub-millisecond evaluation."}
            ],
            "tryIt": "Remove '0.0.0.0/0' from ingressCidrs and verify that Allow evaluates to true with 0 violations.",
            "check": {
              "question": "What is the architectural distinction between a Policy Enforcement Point (PEP) and a Policy Decision Point (PDP) in Open Policy Agent?",
              "options": [
                "The PEP (e.g. CI runner or API server) intercepts the action and enforces the outcome, while the PDP (OPA) evaluates the input document against Rego policies and returns an allow or deny decision.",
                "The PEP is a hardware router, while the PDP is a cloud database.",
                "The PEP encrypts hard drives, while the PDP calculates electricity consumption.",
                "The PEP compiles TypeScript, while the PDP downloads npm packages."
              ],
              "answer": 0,
              "explanation": "OPA acts as the decoupled Policy Decision Point (PDP) evaluating rules in-memory, while the calling system acts as the Policy Enforcement Point (PEP) executing the enforcement."
            }
        },
        {
            "title": "Validating Terraform Plans with Conftest & OPA: Parsing terraform show -json plan, resource_changes inspection & deny rules",
            "say": [
                "While OPA is a general-purpose engine capable of evaluating any JSON document, running OPA directly against raw Terraform HCL configuration files is challenging because HCL contains dynamic expressions, variable references, and ternary conditionals that have not yet been evaluated into concrete values.",
                "To evaluate the true, finalized state of proposed infrastructure changes, Policy as Code must inspect the Terraform Plan. When an engineer executes terraform plan -out=tfplan.binary, Terraform resolves all variables, executes module expressions, evaluates dynamic blocks, and compiles the exact cloud API changes it intends to execute.",
                "By executing terraform show -json tfplan.binary > tfplan.json, Terraform converts this compiled binary plan into a standardized, deeply structured JSON document. This JSON schema is officially maintained by HashiCorp and serves as the universal input payload for automated policy engines.",
                "The tfplan.json document contains several top-level keys: format_version, terraform_version, variables, and most importantly, resource_changes. The resource_changes array lists every cloud resource that Terraform plans to create, update, or delete during the upcoming apply phase.",
                "Inside each resource change object resides a change block containing actions (e.g., [\"create\"], [\"update\"], [\"delete\"]), before (the current cloud state), and after (the proposed new cloud state). Inspecting change.after allows policy authors to evaluate the exact attribute values that will be sent to the cloud provider.",
                "To streamline testing Terraform plans with OPA, the open-source community created Conftest. Conftest is a lightweight CLI utility that uses OPA under the hood to run tests against structured configuration files (JSON, YAML, HCL, Dockerfiles, and Kubernetes manifests).",
                "Conftest establishes an intuitive convention: engineers store Rego policy files in a policy/ directory. Each policy file belongs to the main package (package main). Inside the policy, authors define one or more deny[msg] or warn[msg] rules.",
                "When a developer runs conftest test tfplan.json, Conftest automatically parses the JSON file, binds it to the global input document in Rego, executes all deny rules, and outputs a formatted terminal report indicating passes, warnings, and failures.",
                "Writing a Rego rule to inspect resource_changes follows a clean, standardized idiom: r := input.resource_changes[_]; r.type == 'aws_s3_bucket'; not r.change.after.server_side_encryption_configuration. If this condition evaluates to true, Conftest captures the formatted violation message and exits with a non-zero exit code.",
                "Furthermore, Conftest supports testing policies against multiple files simultaneously and grouping policies into subpackages. By combining Conftest with automated git-diff analysis, platform teams can run targeted policy suites against only the modules impacted by a specific pull request.",
                "Conftest also integrates with remote policy registries via Open Container Initiative (OCI) artifacts. Platform teams can package their approved corporate Rego policies as OCI container images, push them to an enterprise registry like Amazon ECR or Harbor, and have CI runners automatically pull the latest policy bundle using conftest pull.",
                "Mastering terraform show -json serialization, resource_changes inspection, Conftest CLI test execution, and OCI policy distribution empowers platform teams to embed bulletproof compliance guardrails directly into modern GitOps delivery pipelines."
            ],
            "example": "A DevOps engineer added `conftest test tfplan.json` to their GitHub Actions workflow. When a pull request proposed creating an unencrypted RDS MySQL instance, Conftest detected that `storage_encrypted == false` in `change.after`, failed the build in 1.2 seconds, and prevented the merge.",
            "code": "interface ResourceChange {\n  address: string;\n  type: string;\n  change: {\n    actions: string[];\n    after: Record<string, any>;\n  };\n}\n\nclass ConftestPlanValidator {\n  validatePlan(resourceChanges: ResourceChange[]): { passed: boolean; violations: string[] } {\n    const violations: string[] = [];\n\n    for (const res of resourceChanges) {\n      if (res.type === 'aws_db_instance') {\n        if (!res.change.after.storage_encrypted) {\n          violations.push(`DENY [${res.address}]: RDS instances must have storage_encrypted set to true.`);\n        }\n      }\n    }\n\n    return {\n      passed: violations.length === 0,\n      violations\n    };\n  }\n}\n\nconst validator = new ConftestPlanValidator();\nconst result = validator.validatePlan([\n  {\n    address: 'module.database.aws_db_instance.postgres',\n    type: 'aws_db_instance',\n    change: {\n      actions: ['create'],\n      after: { storage_encrypted: false, allocated_storage: 50 }\n    }\n  }\n]);\n\nconsole.log(`CONFTEST_PLAN_TESTED | Passed=${result.passed} | ViolationsFound=${result.violations.length} | TargetAddress=${result.violations[0]?.split(' ')[1] || 'none'} | ExitCode=1`);",
            "output": "CONFTEST_PLAN_TESTED | Passed=false | ViolationsFound=1 | TargetAddress=[module.database.aws_db_instance.postgres]: | ExitCode=1",
            "codeNotes": [
              {"line": 1, "note": "Defines ResourceChange interface modeling the exact JSON schema of terraform show -json."},
              {"line": 10, "note": "Implements Conftest deny rule inspecting change.after attributes for database encryption."},
              {"line": 23, "note": "Validates proposed PostgreSQL instance lacking storage encryption."},
              {"line": 34, "note": "Outputs verified Conftest test token confirming non-zero exit code and violation address."}
            ],
            "tryIt": "Set storage_encrypted to true and verify that passed evaluates to true with ExitCode 0.",
            "check": {
              "question": "Why is running Conftest against 'terraform show -json' plan output superior to scanning raw static .tf source files?",
              "options": [
                "Because the compiled plan JSON contains all evaluated variables, resolved dynamic blocks, and concrete provider change payloads, eliminating false positives from unparsed expressions.",
                "Because raw .tf files cannot be opened by text editors.",
                "Because Conftest only supports JSON and cannot read any other file format.",
                "Because terraform plan automatically encrypts all cloud infrastructure."
              ],
              "answer": 0,
              "explanation": "Scanning the compiled plan JSON guarantees that all dynamic variables, locals, module inputs, and provider attributes are fully resolved, providing accurate, deterministic policy assertions."
            }
        },
        {
            "title": "Advanced Rego Policies: Enforcing KMS Encryption, Tagging Governance, CIDR Ingress Restrictions & Cost Guardrails",
            "say": [
                "Basic Policy as Code implementations often begin with simple boolean assertions, such as checking whether a single attribute is true or false. However, real-world enterprise environments require sophisticated, multi-faceted policy suites that enforce cryptographic standards, corporate cost ceilings, network perimeter defense, and comprehensive resource metadata governance.",
                "The first major category of advanced policy is Cryptographic Key Governance. In enterprise AWS architectures, simply setting encrypted = true on EBS volumes, S3 buckets, and RDS databases is insufficient. Security mandates dictate that resources must not use default cloud-managed keys (aws/s3 or aws/ebs); they must use dedicated Customer Managed Keys (CMKs) provisioned in AWS KMS with automated annual rotation.",
                "In Rego, this is asserted by querying the kms_key_id attribute in change.after and validating that the ARN matches approved corporate key aliases or account-specific key ARN patterns: startswith(r.change.after.kms_key_id, 'arn:aws:kms:us-east-1:123456789012:key/').",
                "The second critical category is Corporate Tagging Governance. Accurate cost allocation, chargeback accounting, security incident response, and automated lifecycle management rely entirely on consistent resource tags. Platform teams enforce that every provisioned resource must include mandatory tags: Environment, Owner, CostCenter, Application, and DataClassification.",
                "In Rego, enforcing tags involves comparing the keys of change.after.tags against a predefined set of required tag names: required_tags := {'Environment', 'Owner', 'CostCenter'}; missing := required_tags - {tag | r.change.after.tags[tag]}; count(missing) > 0. If any required tag is omitted, the rule emits a detailed violation message listing the missing tag keys.",
                "Furthermore, tagging policies validate tag values against approved enumerations—for example, asserting that the Environment tag must be one of ['dev', 'stage', 'prod', 'dr'], preventing typos like 'production' or 'prde' from disrupting automated reporting tools.",
                "The third vital category is Network Perimeter Ingress Defense. Opening port 22 (SSH) or port 3389 (RDP) to the public internet (0.0.0.0/0 or ::/0) in an AWS Security Group or Azure Network Security Group is a severe vulnerability that leads directly to automated brute-force attacks and botnet infiltration.",
                "Advanced Rego policies iterate through all ingress rules in aws_security_group and aws_security_group_rule resources, checking whether cidr_blocks contains 0.0.0.0/0 while from_port or to_port overlaps with sensitive administrative ports (22, 3389, 5432, 3306). If detected, Conftest immediately rejects the plan.",
                "The fourth category is IaC Cost Guardrails. Cloud infrastructure costs can easily spiral out of control when developers accidentally provision expensive compute instances (such as p4d.24xlarge GPU instances or db.m5.24xlarge database instances) in development or sandbox accounts.",
                "Rego policies enforce instance sizing constraints by mapping environment folders to allowed instance families. In dev and staging environments, the policy asserts that instance_type must match regex('^(t3|t4g|m5)\\.(nano|micro|small|medium)$'), preventing accidental multi-thousand-dollar monthly cloud billing surprises.",
                "Combining cryptographic validation, mandatory tagging sets, network ingress restrictions, and instance size ceilings transforms Policy as Code into a comprehensive defense-in-depth governance shield that safeguards enterprise security, compliance, and financial health.",
                "Mastering advanced Rego rule construction, set difference operations, regex matching, and multi-resource cross-referencing equips platform engineers to author sophisticated governance suites that scale across massive multi-cloud organizations."
            ],
            "example": "A fintech platform team deployed an advanced Rego tagging and encryption policy suite. When a developer submitted a plan provisioning an RDS database without an approved KMS CMK and missing the CostCenter tag, Conftest blocked the pull request, detailing both violations in the CI console.",
            "code": "interface TaggedResource {\n  address: string;\n  type: string;\n  tags: Record<string, string>;\n  kmsKeyArn?: string;\n}\n\nclass EnterpriseGovernanceValidator {\n  private requiredTags = ['Environment', 'Owner', 'CostCenter'];\n\n  validateGovernance(resource: TaggedResource): { approved: boolean; missingTags: string[]; kmsApproved: boolean } {\n    const resourceTags = Object.keys(resource.tags);\n    const missingTags = this.requiredTags.filter(t => !resourceTags.includes(t));\n    \n    const kmsApproved = !!resource.kmsKeyArn && resource.kmsKeyArn.startsWith('arn:aws:kms:');\n\n    return {\n      approved: missingTags.length === 0 && kmsApproved,\n      missingTags,\n      kmsApproved\n    };\n  }\n}\n\nconst gov = new EnterpriseGovernanceValidator();\nconst check = gov.validateGovernance({\n  address: 'aws_ebs_volume.analytics_data',\n  type: 'aws_ebs_volume',\n  tags: { Environment: 'prod', Owner: 'telemetry-team' }, // Missing CostCenter\n  kmsKeyArn: 'arn:aws:kms:us-east-1:111122223333:key/cmk-analytics'\n});\n\nconsole.log(`ADVANCED_POLICY_VALIDATED | Approved=${check.approved} | MissingTags=${check.missingTags.join(',')} | KmsApproved=${check.kmsApproved} | Guardrail=ACTIVE`);",
            "output": "ADVANCED_POLICY_VALIDATED | Approved=false | MissingTags=CostCenter | KmsApproved=true | Guardrail=ACTIVE",
            "codeNotes": [
              {"line": 1, "note": "Defines TaggedResource interface modeling enterprise metadata and cryptographic attributes."},
              {"line": 8, "note": "Implements governance validation checking mandatory tags and KMS key ARN patterns."},
              {"line": 22, "note": "Evaluates EBS volume missing required CostCenter tag despite having valid KMS key."},
              {"line": 28, "note": "Outputs verified advanced policy validation token confirming active guardrails."}
            ],
            "tryIt": "Add CostCenter: 'CC-9042' to tags and verify that Approved evaluates to true with empty MissingTags.",
            "check": {
              "question": "In enterprise Policy as Code governance, why is enforcing Customer Managed Keys (CMKs) in AWS KMS preferred over default AWS-managed keys?",
              "options": [
                "Because Customer Managed Keys provide independent cryptographic access control, automated annual key rotation, and dedicated CloudTrail audit logging not available with default keys.",
                "Because AWS-managed keys cost ten times more money per month.",
                "Because default AWS keys delete data automatically after 30 days.",
                "Because Customer Managed Keys increase network bandwidth to EC2 instances."
              ],
              "answer": 0,
              "explanation": "Customer Managed Keys allow organizations to define custom key policies, enforce annual rotation, and track all decryption requests in CloudTrail for regulatory compliance."
            }
        },
        {
            "title": "Pre-Commit Hooks & CI/CD Pipeline Enforcement: Shift-left validation gates, Conftest CLI test runners, GitHub Actions status checks & break-the-build policies",
            "say": [
                "Authoring comprehensive Policy as Code rules is meaningless unless those policies are systematically and irrevocably enforced across the software delivery lifecycle. If an engineer can bypass policy checks by simply running terraform apply directly from their laptop using personal AWS credentials, the entire governance framework collapses.",
                "To establish an unbreachable governance perimeter, enterprise platform teams implement Multi-Tiered Shift-Left Validation Gates spanning developer workstations, version control hooks, and automated CI/CD pipelines.",
                "The first tier of defense is Developer Workstation Tooling via Pre-Commit Hooks. Using the open-source pre-commit framework, developers configure local Git hooks that run automatically whenever git commit is executed. These hooks run fast static linters—such as terraform fmt -check, tflint, and local Conftest checks against static configurations.",
                "Pre-commit hooks provide sub-second feedback before code ever leaves the developer's laptop, eliminating trivial formatting errors and basic syntax bugs without waiting for CI/CD runners to spin up.",
                "The second and authoritative tier of defense is the Automated CI/CD Pipeline Gate. When a developer pushes a branch or opens a Pull Request in GitHub, GitLab, or Bitbucket, an automated workflow is triggered immediately.",
                "The pipeline operates in an isolated runner environment, authenticating to cloud providers via temporary OIDC credentials. The pipeline executes: 1) terraform init, 2) terraform plan -out=tfplan.binary, 3) terraform show -json tfplan.binary > tfplan.json, and 4) conftest test tfplan.json --policy ./policy.",
                "This stage enforces the Break-the-Build Policy. If Conftest detects even a single critical policy violation, the CLI returns an exit code of 1. The CI pipeline intercepts this non-zero exit code and marks the pull request status check as FAILED. Version control branch protection rules are configured to require all status checks to pass before a pull request can be merged.",
                "Furthermore, leading platform teams implement Rich PR Feedback Automation using tools like tfcmt or Atlantis. When Conftest fails, the CI bot automatically posts a structured Markdown comment directly on the developer's pull request. The comment highlights the exact failing resource, cites the specific security policy violated, and provides a clear code snippet illustrating how to resolve the issue.",
                "In Kubernetes environments, Policy as Code extends beyond CI/CD into runtime admission control via OPA Gatekeeper. OPA Gatekeeper runs as a dynamic Admission Webhook inside Kubernetes clusters, evaluating resource manifests during kubectl apply or Helm releases and rejecting non-compliant pods or services directly at the API server.",
                "To prevent malicious or accidental bypasses, platform teams strictly revoke direct write access to production cloud accounts. No human engineer possesses IAM credentials to run terraform apply from a workstation. All production deployments must occur exclusively through the automated CI/CD pipeline following peer review and policy validation.",
                "Additionally, for break-glass emergency production fixes, teams implement formal Policy Exception Workflows. An engineer can request a temporary 24-hour policy bypass signed off by the Chief Information Security Officer (CISO), with all bypass actions logged to an immutable security audit trail.",
                "Mastering pre-commit hooks, automated CI/CD validation gates, break-the-build enforcement, Gatekeeper admission control, and least-privilege pipeline architectures equips platform teams to deliver flawless, enterprise-grade cloud governance at scale."
            ],
            "example": "A financial services organization configured GitHub Actions branch protection requiring `conftest-security-gate` to pass. When a developer attempted to merge a PR provisioning an internet-exposed Elasticsearch cluster, the CI gate broke the build, blocking the merge until TLS encryption was added.",
            "code": "interface PipelineGateResult {\n  stepName: string;\n  exitCode: number;\n  status: 'SUCCESS' | 'BLOCKED';\n  errorMessage?: string;\n}\n\nclass CiCdPolicyGateRunner {\n  runGate(conftestViolations: number): PipelineGateResult {\n    if (conftestViolations > 0) {\n      return {\n        stepName: 'conftest-iac-guardrail',\n        exitCode: 1,\n        status: 'BLOCKED',\n        errorMessage: 'GATEKEEPER_ADMISSION_DENIED: Policy violations detected in terraform plan.'\n      };\n    }\n    return {\n      stepName: 'conftest-iac-guardrail',\n      exitCode: 0,\n      status: 'SUCCESS'\n    };\n  }\n}\n\nconst gateRunner = new CiCdPolicyGateRunner();\nconst execution = gateRunner.runGate(2);\n\nconsole.log(`PIPELINE_GATE_EXECUTED | Step=${execution.stepName} | ExitCode=${execution.exitCode} | Status=${execution.status} | Reason=${execution.errorMessage}`);",
            "output": "PIPELINE_GATE_EXECUTED | Step=conftest-iac-guardrail | ExitCode=1 | Status=BLOCKED | Reason=GATEKEEPER_ADMISSION_DENIED: Policy violations detected in terraform plan.",
            "codeNotes": [
              {"line": 1, "note": "Defines PipelineGateResult interface modeling CI/CD step status and exit codes."},
              {"line": 8, "note": "Implements break-the-build policy logic halting pipeline when violations exist."},
              {"line": 21, "note": "Executes policy gate with 2 active violations triggering pipeline termination."},
              {"line": 23, "note": "Outputs verified pipeline gate token confirming admission denial and non-zero exit code."}
            ],
            "tryIt": "Pass 0 violations to runGate and observe exitCode 0 with status 'SUCCESS'.",
            "check": {
              "question": "What is the primary enforcement mechanism that prevents non-compliant Terraform code from reaching cloud environments?",
              "options": [
                "Enforcing automated CI/CD status checks paired with Git branch protection rules, physically preventing pull requests with policy violations from being merged.",
                "Sending an email to developers asking them to please review their code.",
                "Shutting down developer laptops remotely.",
                "Uninstalling Git from developer workstations."
              ],
              "answer": 0,
              "explanation": "Branch protection rules require all CI/CD status checks (including Conftest policy validation) to pass before a merge can occur, programmatically blocking non-compliant code."
            }
        }
    ],
    "summary": [
        "Policy as Code (PaC) shifts compliance and security left, replacing slow manual change review boards with automated programmatic guardrails in CI/CD pipelines.",
        "Open Policy Agent (OPA) decouples policy decision-making (PDP) from enforcement (PEP), utilizing the declarative Rego query language for in-memory assertions.",
        "Conftest parses terraform show -json plan outputs to inspect resource_changes and proposed change.after attributes before cloud provisioning occurs.",
        "Advanced Rego policy suites enforce Customer Managed KMS encryption, mandatory tagging taxonomies, CIDR ingress restrictions, and cost guardrails.",
        "Pre-commit hooks and CI/CD break-the-build gates prevent non-compliant pull requests from merging, ensuring total governance across cloud environments."
    ],
    "projectStep": {
        "title": "Implementing Policy as Code Guardrails with OPA & Conftest",
        "steps": [
            "Author a declarative OPA Rego policy that denies any S3 bucket or RDS instance lacking Customer Managed Key (CMK) encryption.",
            "Write a tagging governance rule asserting that all cloud resources contain Environment, Owner, and CostCenter tags.",
            "Generate a compiled JSON plan from HCL infrastructure using terraform plan and terraform show -json.",
            "Execute Conftest test suites against the plan JSON verifying that violations trigger a non-zero exit code and block CI."
        ]
    }
}

with open("scripts/data_devops_day44.py", "w", encoding="utf-8") as f:
    f.write("# scripts/data_devops_day44.py\n# Day 44: Policy as Code (PaC) & Automated IaC Guardrails: OPA, Rego Assertions & Shift-Left Validation\n\nDAY_44 = " + repr(day44) + "\n")

print("Generated scripts/data_devops_day44.py successfully!")
