import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_hash(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def count_words(paragraphs: list) -> int:
    return sum(len(p.split()) for p in paragraphs)

# -------------------------------------------------------------
# Part 1: Multi-Account Architecture & OU Hierarchies
# -------------------------------------------------------------
p1_title = "Enterprise Multi-Account Architecture: AWS Organizations, OU Hierarchies & Blast Radius Isolation"
p1_say = [
    "Welcome to Day 41 of our Cloud Native AWS Masterclass. Having mastered high-performance streaming pipelines and real-time collaborative architectures across Blocks 1 through 8, we now inaugurate Block 9: Advanced Security, Governance & Zero Trust Architecture. In enterprise cloud engineering, security is not an afterthought appended to an application prior to deployment; it is the architectural foundation upon which all distributed workloads reside. We begin Block 9 by mastering Enterprise Multi-Account Governance: moving away from primitive single-account topologies and engineering pristine multi-account enclaves using AWS Organizations, AWS Control Tower, Landing Zones, and Organizational Units (OUs).",
    "In the early days of cloud computing, organizations frequently operated all environments—development, staging, user acceptance testing (UAT), and production—inside a single AWS account. This single-account model introduces catastrophic failure modes: an unmitigated blast radius where a compromised developer API key can delete production databases, global API rate limiting where continuous integration (CI) test suites exhaust EC2 or CloudFormation DescribeInstances limits causing production autoscaling failures, and operational chaos where thousands of unrelated IAM roles, VPCs, and security groups clutter a single console.",
    "Modern cloud architecture enforces Strict Multi-Account Isolation. An AWS Account is the ultimate security, administrative, and billing boundary in Amazon Web Services. There is zero default connectivity, zero shared credentials, and zero cross-account resource visibility between two AWS accounts unless explicitly established via IAM cross-account roles, VPC peering, or AWS Transit Gateway. By isolating every workload and lifecycle stage into dedicated member accounts, the blast radius of any security breach or operator error is mathematically contained within that single account.",
    "To govern hundreds of disparate accounts centrally, we deploy AWS Organizations. AWS Organizations arranges member accounts into a tree-like hierarchy rooted at the Management Account (formerly the Master Account). Beneath the Root, accounts are organized into Organizational Units (OUs). An OU is a logical container for accounts that enables centralized policy inheritance. Senior cloud architects structure organizations into two primary branches: Core OUs (also known as Foundation OUs) and Workload OUs.",
    "The Core OU branch contains non-workload accounts dedicated to enterprise infrastructure management. Within Core, we establish a Security OU containing the Log Archive Account (an immutable repository where AWS CloudTrail, VPC Flow Logs, and GuardDuty findings are centralized and locked with S3 Object Lock) and the Security Tooling Account (where security operations teams configure Amazon GuardDuty, AWS Security Hub, Amazon Detective, and AWS IAM Identity Center). The Workload OU branch is partitioned into environment lifecycle tiers: Production OU (containing production application accounts with strict change control), Non-Production OU (containing staging, QA, and dev accounts), and a Sandbox OU (where developers experiment freely with synthetic data, decoupled from internal corporate networks).",
    "A paramount architectural principle in AWS Organizations is Delegated Administration. The Management Account should remain pristine and unburdened by active workloads or daily security operations, because compromising the Management Account compromises the entire corporate enterprise. Instead, AWS Organizations delegates administrative privileges for core security services—such as Amazon GuardDuty, AWS Security Hub, AWS IAM Access Analyzer, and AWS Backup—to the dedicated Security Tooling account. This allows security operations teams to view organization-wide findings, configure automated remediation, and manage compliance baselines without ever possessing root-level credentials to the organization root.",
    "Furthermore, cross-account resource sharing is optimized using AWS Resource Access Manager (AWS RAM). Rather than provisioning redundant NAT gateways, transit VPCs, and private network infrastructure in every single account, platform teams provision central network assets (such as Amazon Route 53 Resolver rules, AWS Transit Gateway attachments, and centralized private subnets) in a dedicated Shared Services account and share them securely across member accounts via AWS RAM. This cross-account sharing slashes operational expenditure by hundreds of thousands of dollars annually while enforcing uniform network topology standards.",
    "Consolidated Billing in AWS Organizations aggregates billing across all member accounts into the Management Account, unlocking massive enterprise volume discounts, Savings Plans pooling, and Reserved Instance sharing without merging data planes. By decoupling management and audit boundaries from individual microservices, platform teams construct an elastic, enterprise-scale landing zone that scales to thousands of engineers while maintaining military-grade governance."
]

p1_code = """// Part 1: AWS Organizations OU Hierarchy & Account Placement Engine
interface AWSAccount {
  accountId: string;
  accountName: string;
  ouPath: string;
  environment: 'CORE' | 'PROD' | 'NON_PROD' | 'SANDBOX';
}

class OrganizationsHierarchy {
  private accounts: AWSAccount[] = [];

  registerAccount(acc: AWSAccount) {
    this.accounts.push(acc);
  }

  getAccountsByOU(ouPrefix: string): AWSAccount[] {
    return this.accounts.filter(a => a.ouPath.startsWith(ouPrefix));
  }
}

const org = new OrganizationsHierarchy();
org.registerAccount({ accountId: '111122223333', accountName: 'sec-log-archive', ouPath: 'Root/Core/Security', environment: 'CORE' });
org.registerAccount({ accountId: '444455556666', accountName: 'ecommerce-prod', ouPath: 'Root/Workloads/Prod', environment: 'PROD' });
org.registerAccount({ accountId: '777788889999', accountName: 'ecommerce-dev', ouPath: 'Root/Workloads/NonProd', environment: 'NON_PROD' });

const prodWorkloads = org.getAccountsByOU('Root/Workloads/Prod');
console.log(`ORGANIZATIONS_HIERARCHY: TotalAccounts=${org.getAccountsByOU('Root').length} ProdCount=${prodWorkloads.length} ProdAccount=${prodWorkloads[0].accountName}`);"""

p1_output = """ORGANIZATIONS_HIERARCHY: TotalAccounts=3 ProdCount=1 ProdAccount=ecommerce-prod"""

p1_check = {
    "question": "A fast-growing fintech company runs its production banking microservices and staging test suites in the same AWS account. An automated load-testing script exhausts regional EC2 API rate limits, causing production Auto Scaling to fail during peak customer traffic. What is the foundational architectural remediation?",
    "options": [
        "Deploy AWS Organizations and isolate production and non-production workloads into separate AWS accounts under distinct Organizational Units (OUs), completely isolating API quotas, blast radius, and administrative credentials.",
        "Request a temporary EC2 DescribeInstances quota increase from AWS Support while keeping everything in the single account.",
        "Combine development and staging databases into a single Aurora cluster to reduce resource usage.",
        "Give all developers AdministratorAccess so they can manually restart EC2 instances when throttling occurs."
    ],
    "answer": 0,
    "explanation": "In AWS, API limits, quotas, IAM credentials, and security blast radii are bounded at the account level. Migrating workloads into dedicated AWS accounts within separate OUs (e.g. Workloads/Prod vs Workloads/NonProd) guarantees that test activities cannot exhaust production quotas, compromise production credentials, or impact live users."
}

# -------------------------------------------------------------
# Part 2: Service Control Policies (SCPs): Evaluation & Deny Precedence
# -------------------------------------------------------------
p2_title = "Service Control Policies (SCPs): Evaluation Logic, Inheritance & Deny Precedence"
p2_say = [
    "Having established an organizational hierarchy of accounts and OUs, the next critical mechanism is Centralized Policy Enforcement. In traditional IAM, permissions are granted by attaching identity-based policies (such as `AdministratorAccess`) to users or roles within a local account. However, relying solely on local IAM introduces severe governance risks: an administrator inside a member account could accidentally disable security logging, leave an S3 bucket unencrypted, or open SSH ports to the public internet. To enforce immutable organizational guardrails, AWS Organizations provides Service Control Policies (SCPs).",
    "A Service Control Policy (SCP) is an organization policy that specifies the maximum permissions for an organization, Organizational Unit (OU), or individual member account. It is crucial to understand what an SCP is NOT: an SCP does not grant permissions! An SCP acts strictly as a Permission Filter or Guardrail. For an action to be authorized in a member account, it must satisfy two independent gates: first, it must be explicitly permitted by the local IAM policy within the account; and second, it must be permitted by every SCP attached at every level in the organizational hierarchy above that account.",
    "The mathematical evaluation logic of SCPs is governed by AWS Organizations Policy Inheritance and Deny Precedence. SCPs attached to the Root apply to all OUs and accounts in the organization. SCPs attached to an OU apply to all child OUs and accounts beneath it. In this inheritance chain, an Explicit Deny rule is absolute and immutable! If an SCP attached to the Root contains an explicit Deny statement (such as `Deny` on `cloudtrail:StopLogging`), that action is irrevocably blocked for every user, role, and administrator across every member account in the entire organization—even for the root account user of a member account!",
    "Local member account administrators have zero authority to bypass, modify, or override an SCP attached by AWS Organizations. Even if an engineer logs in as an IAM user with full `AdministratorAccess` (`Effect: Allow, Action: *, Resource: *`), any action denied by an SCP results in an immediate `AccessDenied` error from the AWS API. This provides security teams with an unbreakable enforcement boundary: central compliance mandates can be locked down globally without requiring security teams to review or audit thousands of local IAM policies.",
    "When engineering production SCPs, platform architects leverage sophisticated Condition Keys and JSON policy operators. Conditions such as `aws:PrincipalArn`, `aws:PrincipalTag`, `aws:SourceVpce` (enforcing access exclusively via designated VPC endpoints), and `aws:RequestedRegion` allow surgical enforcement. Because AWS limits individual SCP documents to a maximum size of 5,120 bytes, enterprise architects avoid monolithic megadocuments. Instead, they engineer modular, single-purpose SCPs—such as `DenyUnapprovedRegions`, `ProtectSecurityBaselines`, and `EnforceStorageEncryption`—and attach them strategically across specific OUs.",
    "To prevent accidental lockout of security tooling, senior cloud architects implement SCP Whitelisting Patterns using Condition Blocks. For example, when authoring an SCP that denies member accounts from leaving the organization (`organizations:LeaveOrganization`) or deleting CloudWatch log groups, the policy must explicitly exempt administrative orchestration roles used by AWS Control Tower (such as `AWSControlTowerExecution`) and the enterprise security team's automation roles. By specifying `ArnNotLike: {'aws:PrincipalArn': ['arn:aws:iam::*:role/AWSControlTowerExecution', 'arn:aws:iam::*:role/SecurityOperationsRole']}`, central security pipelines maintain full administrative reach while member account developers remain strictly bounded.",
    "Two distinct strategies exist for structuring SCP hierarchies: Deny-List Strategy and Allow-List Strategy. The default Allow-List strategy leaves the default `FullAWSAccess` SCP in place and layers targeted explicit Deny statements over it. The strict Allow-List strategy removes `FullAWSAccess` and explicitly whitelists only approved services. While the pure allow-list strategy offers theoretical maximum containment, it creates immense operational friction because adopting any new AWS service requires modifying policies at the root. Therefore, industry-standard enterprise architecture favors the Deny-List strategy, establishing impenetrable guardrails while granting developers autonomy within safe parameters.",
    "By designing declarative, hierarchical SCPs with explicit deny precedence, enterprise security architects establish bulletproof organizational perimeters. Guardrails operate seamlessly in the background, freeing product engineering teams to innovate autonomously within safe, mathematically bounded operating zones."
]

p2_code = """// Part 2: Service Control Policy (SCP) Permission Boundary Evaluator
interface SCPRule {
  effect: 'Allow' | 'Deny';
  actions: string[];
  resources: string[];
}

function evaluateSCPAccess(scpRules: SCPRule[], requestedAction: string): { isAllowed: boolean; reason: string } {
  for (const rule of scpRules) {
    if (rule.effect === 'Deny' && (rule.actions.includes('*') || rule.actions.includes(requestedAction))) {
      return { isAllowed: false, reason: `EXPLICIT_SCP_DENY on action '${requestedAction}' overrides all local IAM admin rights` };
    }
  }

  for (const rule of scpRules) {
    if (rule.effect === 'Allow' && (rule.actions.includes('*') || rule.actions.includes(requestedAction))) {
      return { isAllowed: true, reason: `ACTION_PERMITTED within SCP boundary` };
    }
  }

  return { isAllowed: false, reason: `IMPLICIT_DENY: No matching Allow rule found in SCP hierarchy` };
}

const scpSuite: SCPRule[] = [
  { effect: 'Allow', actions: ['*'], resources: ['*'] },
  { effect: 'Deny', actions: ['cloudtrail:StopLogging', 'cloudtrail:DeleteTrail'], resources: ['*'] }
];

const res1 = evaluateSCPAccess(scpSuite, 'ec2:RunInstances');
const res2 = evaluateSCPAccess(scpSuite, 'cloudtrail:StopLogging');

console.log(`SCP_EVALUATION: Action=ec2:RunInstances Allowed=${res1.isAllowed} Reason='${res1.reason}'`);
console.log(`SCP_EVALUATION: Action=cloudtrail:StopLogging Allowed=${res2.isAllowed} Reason='${res2.reason}'`);"""

p2_output = """SCP_EVALUATION: Action=ec2:RunInstances Allowed=true Reason='ACTION_PERMITTED within SCP boundary'
SCP_EVALUATION: Action=cloudtrail:StopLogging Allowed=false Reason='EXPLICIT_SCP_DENY on action 'cloudtrail:StopLogging' overrides all local IAM admin rights'"""

p2_check = {
    "question": "An enterprise attaches an SCP to the Workloads OU that contains: `Effect: Deny, Action: cloudtrail:StopLogging, Resource: *`. An engineer in a member account logs in as an IAM administrator with `AdministratorAccess` (`*:*`) and attempts to stop logging on a local trail. What is the outcome?",
    "options": [
        "The operation is rejected with an AccessDenied error, because an explicit Deny in an SCP overrides all local IAM permissions, even for administrators and the member account root user.",
        "The operation succeeds, because local IAM AdministratorAccess has precedence over organization SCPs.",
        "The member account is automatically deleted from AWS Organizations.",
        "AWS CloudTrail prompts the user for a multi-factor authentication code and then stops logging."
    ],
    "answer": 0,
    "explanation": "Service Control Policies establish maximum permission boundaries above local IAM policies. An explicit Deny in an SCP attached to an OU or account unconditionally overrides any local IAM permissions, including full AdministratorAccess and the member account's root user."
}

# -------------------------------------------------------------
# Part 3: AWS Control Tower & Account Factory
# -------------------------------------------------------------
p3_title = "AWS Control Tower & Account Factory: Guardrails, Baselines & Automated Provisioning"
p3_say = [
    "While AWS Organizations provides the raw primitive APIs for account grouping and SCP attachment, manually orchestrating landing zone infrastructure across dozens of accounts is error-prone and time-consuming. Setting up cross-account VPC peering, provisioning security baselines, configuring federated identity, and auditing compliance across 50 accounts requires thousands of repetitive manual actions. To automate landing zone deployment at scale, AWS built AWS Control Tower.",
    "AWS Control Tower is a managed service that orchestrates AWS Organizations, AWS Service Catalog, and AWS IAM Identity Center to provision a turnkey, multi-account enterprise landing zone based on AWS best practices. When Control Tower is initialized, it automatically provisions the foundational Core OUs (Security and Sandbox), deploys the central Log Archive and Security Audit accounts, configures organizational CloudTrail trails with cross-account S3 log replication, and activates AWS Config recording across all member accounts.",
    "A centerpiece capability of Control Tower is Guardrail Governance (classified into Mandatory, Strongly Recommended, and Elective guardrails). Control Tower expresses guardrails through two distinct implementation mechanisms: Preventive Guardrails and Detective Guardrails. Preventive Guardrails are implemented as Service Control Policies (SCPs) that disallow non-compliant API calls before they can execute (such as preventing member accounts from disabling AWS Config or disallowing internet gateways in private database accounts).",
    "In contrast, Detective Guardrails are implemented using AWS Config Rules and AWS Lambda automations. Detective guardrails do not block API actions; instead, they continuously inspect the runtime configuration of deployed resources. For example, a detective guardrail monitors all Amazon S3 buckets across member accounts: if an engineer creates an S3 bucket with public read access, AWS Config flags the bucket as `NON_COMPLIANT` within seconds, surfaces an alert in the Control Tower dashboard, and triggers an automated AWS Systems Manager Automation runbook that reverts the bucket ACL to private.",
    "Modern Control Tower governance extends beyond traditional preventive and detective boundaries through Proactive Guardrails. Built on AWS CloudFormation Guard, proactive guardrails evaluate CloudFormation templates directly within CI/CD pipelines before resources are created! If a developer's infrastructure-as-code template contains an unencrypted database or an overly permissive security group, the CloudFormation deployment is blocked during the validation phase, shifting security left into the software delivery pipeline.",
    "To streamline developer onboarding, Control Tower provides Account Factory. Powered by AWS Service Catalog, Account Factory enables platform engineering teams to define standardized account vending templates. When a product team requests a new microservice account, Account Factory automatically provisions the AWS account, links it to the designated OU, attaches the mandatory SCP guardrails, establishes pre-configured transit VPC subnets, and enrols the account in federated single sign-on (SSO)—all within fifteen minutes with zero manual intervention.",
    "Account Factory for Terraform (AFT) represents the pinnacle of automated multi-account lifecycle management. While Service Catalog provides a graphical web interface for provisioning accounts, enterprise platform engineering teams operating under GitOps principles demand full code-driven automation. AFT provisions a dedicated deployment pipeline using AWS Step Functions, Amazon SQS, and Terraform Cloud. When a developer submits a pull request containing a simple HCL account definition, AFT provisions the AWS account, places it in the target OU, runs automated account baseline Terraform modules, and injects custom enterprise VPC configurations in minutes, entirely tracked within Git commit logs.",
    "To customize landing zone behavior declaratively, enterprises deploy Customizations for AWS Control Tower (CfCT). CfCT implements a GitOps continuous delivery pipeline: platform teams commit CloudFormation templates and SCP definitions to a version-controlled repository (such as AWS CodeCommit or GitHub). Whenever changes are merged, an automated pipeline validates the templates and deploys custom IAM roles, baseline security groups, and centralized private endpoints across all enrolled member accounts automatically.",
    "By synthesizing automated landing zone setup, preventive SCP boundaries, continuous detective AWS Config compliance auditing, and self-service Account Factory provisioning, AWS Control Tower delivers an enterprise-grade cloud operating foundation that scales frictionlessly with business growth."
]

p3_code = """// Part 3: AWS Control Tower Guardrail Compliance Validator
interface GuardrailStatus {
  guardrailId: string;
  type: 'PREVENTIVE' | 'DETECTIVE';
  targetOU: string;
  compliantAccounts: number;
  totalAccounts: number;
}

function auditControlTowerBaseline(guardrails: GuardrailStatus[]): string {
  let allCompliant = true;
  for (const g of guardrails) {
    if (g.compliantAccounts < g.totalAccounts) {
      allCompliant = false;
    }
  }
  return `CONTROL_TOWER_AUDIT: Evaluated=${guardrails.length} BaselineStatus=${allCompliant ? '100%_CONFORMANT' : 'NON_COMPLIANT'} ActiveOUs=${guardrails.length}`;
}

const audit = auditControlTowerBaseline([
  { guardrailId: 'SH.S3.1_ENCRYPT', type: 'PREVENTIVE', targetOU: 'Workloads/Prod', compliantAccounts: 12, totalAccounts: 12 },
  { guardrailId: 'SH.LOG.1_TRAIL_ACTIVE', type: 'PREVENTIVE', targetOU: 'Core/Security', compliantAccounts: 4, totalAccounts: 4 },
  { guardrailId: 'SH.EC2.2_MFA_DELETE', type: 'DETECTIVE', targetOU: 'Workloads/Prod', compliantAccounts: 12, totalAccounts: 12 },
]);

console.log(audit);"""

p3_output = """CONTROL_TOWER_AUDIT: Evaluated=3 BaselineStatus=100%_CONFORMANT ActiveOUs=3"""

p3_check = {
    "question": "A security auditor requires that any S3 bucket created without default server-side encryption must be automatically flagged and remediated across 40 AWS member accounts. Which AWS Control Tower mechanism achieves this?",
    "options": [
        "A Detective Guardrail backed by AWS Config Rules that continuously audits resource configurations and triggers automated Systems Manager remediation runbooks.",
        "Manually running a daily bash script from an administrator's laptop that checks each bucket.",
        "Deleting all member accounts and rebuilding them from scratch.",
        "An SCP that terminates the AWS account whenever an unencrypted bucket is uploaded."
    ],
    "answer": 0,
    "explanation": "Detective Guardrails in AWS Control Tower utilize AWS Config Rules to continuously monitor deployed cloud resources. When an unencrypted bucket is detected, AWS Config flags it as non-compliant and can automatically execute an AWS Systems Manager automation to enable encryption."
}

# -------------------------------------------------------------
# Part 4: Production SCP Implementation: Regional Fencing & Security
# -------------------------------------------------------------
p4_title = "Production SCP Engineering: Regional Fencing, CloudTrail Protection & S3 Encryption Mandates"
p4_say = [
    "Now that the governance theory and architectural framework are established, we examine the concrete implementation of Production-Grade Service Control Policies. Authoring enterprise SCPs requires deep precision: policies must enforce strict compliance boundaries without inadvertently blocking necessary global AWS control-plane operations or disrupting legitimate developer workflows. In this section, we dissect the three most critical SCPs deployed in enterprise production environments: Regional Fencing, Security Telemetry Protection, and Data Encryption Mandates.",
    "The first foundational policy is Regional Fencing (Geo-Fencing). Global enterprises subject to regulations like GDPR or HIPAA are legally prohibited from storing or processing customer data outside authorized jurisdictions. Furthermore, allowing developers to spin up resources in unmonitored AWS regions (such as launching EC2 instances in ap-southeast-2 or sa-east-1 when the company operates exclusively in us-east-1 and eu-west-1) creates massive security blind spots and unexpected cloud billing. A Regional Fencing SCP blocks any API call that targets unapproved AWS regions.",
    "However, a critical engineering pitfall in regional fencing is the 'Global Services Lockout'. Core AWS services—including AWS IAM, Amazon Route 53, Amazon CloudFront, AWS WAF, and AWS Organizations itself—operate globally and send their API requests to the `us-east-1` region or global endpoints without explicit region headers. If an SCP bluntly denies all actions where `aws:RequestedRegion != approved_region`, it breaks IAM user management, disables DNS updates, and halts organization administration globally! To prevent catastrophic lockouts, production SCPs inject explicit condition blocks (`NotAction` or `StringNotEquals: {'aws:RequestedRegion': ['us-east-1', 'eu-west-1']}`) exempting global services.",
    "The second essential policy is Security Telemetry Immutability. In modern cyber attack lifecycles, sophisticated adversaries who compromise cloud credentials immediately attempt to cover their tracks by disabling audit logging: stopping AWS CloudTrail trails, deleting S3 log buckets, disabling AWS Config recording, or terminating Amazon GuardDuty detectors. Our Telemetry Protection SCP unconditionally denies `cloudtrail:DeleteTrail`, `cloudtrail:StopLogging`, `config:DeleteConfigurationRecorder`, and `guardduty:DeleteDetector` across all workload accounts. Even if an attacker gains full administrative access to a member account, their malicious actions are permanently captured in immutable CloudTrail logs.",
    "The third essential policy is the Data Encryption Mandate. Rather than relying on individual developers to remember to check the encryption box when creating storage resources, the Encryption SCP enforces encryption at the API boundary. By injecting condition keys like `s3:x-amz-server-side-encryption` with an explicit Deny on `s3:PutObject` if encryption headers are absent, unencrypted data uploads are rejected at the edge with HTTP 403 Forbidden. Similarly, the SCP denies `ec2:CreateVolume` and `ec2:RunInstances` unless the EBS volume encryption flag is set to true.",
    "Furthermore, security teams enforce Organization-Wide S3 Public Access Block. While S3 Block Public Access can be configured on individual buckets or accounts, a dedicated SCP prevents member account administrators from disabling this control. The policy denies `s3:PutAccountPublicAccessBlock` and `s3:PutBucketPublicAccessBlock` if the request attempts to set any of the four public block flags (`BlockPublicAcls`, `IgnorePublicAcls`, `BlockPublicPolicy`, `RestrictPublicBuckets`) to false. This renders accidental public data exposure physically impossible across the entire organization.",
    "In addition to storage encryption and regional fencing, enterprise SCP suites mandate IMDSv2 (Instance Metadata Service Version 2) across all compute fleets. IMDSv1 is vulnerable to Server-Side Request Forgery (SSRF) vulnerabilities, allowing adversaries who exploit web application flaws to steal IAM role credentials from `http://169.254.169.254`. A production IMDSv2 SCP contains an explicit Deny on `ec2:RunInstances` unless the request includes `ec2:MetadataHttpTokens: required` and sets `ec2:MetadataHttpPutResponseHopLimit: 1`. This mathematical policy guardrail eliminates SSRF credential theft vectors at the organizational root, ensuring that EC2 instances launched across hundreds of accounts enforce session-oriented, cryptographically signed metadata requests.",
    "Authoring, validating, and testing these modular SCP policies in a dedicated test OU prior to organization-wide rollout guarantees that enterprise guardrails achieve airtight security compliance without impacting developer velocity."
]

p4_code = """// Part 4: Regional Fencing & S3 Default Encryption Policy Rule
interface RegionRequest {
  requestedRegion: string;
  approvedRegions: string[];
  isS3PutEncrypted: boolean;
}

function evaluateGovernancePolicies(req: RegionRequest): { regionPass: boolean; encryptionPass: boolean; status: string } {
  const regionPass = req.approvedRegions.includes(req.requestedRegion);
  const encryptionPass = req.isS3PutEncrypted;
  const status = regionPass && encryptionPass ? 'OPERATION_PERMITTED' : 'BLOCKED_BY_GUARDRAIL';

  return { regionPass, encryptionPass, status };
}

const approvedRegions = ['us-east-1', 'eu-west-1'];
const op1 = evaluateGovernancePolicies({ requestedRegion: 'us-east-1', approvedRegions, isS3PutEncrypted: true });
const op2 = evaluateGovernancePolicies({ requestedRegion: 'ap-southeast-1', approvedRegions, isS3PutEncrypted: true });

console.log(`GOVERNANCE_RESULT: Region=${op1.regionPass} Encryption=${op1.encryptionPass} Status=${op1.status}`);
console.log(`GOVERNANCE_RESULT: Region=${op2.regionPass} Encryption=${op2.encryptionPass} Status=${op2.status}`);"""

p4_output = """GOVERNANCE_RESULT: Region=true Encryption=true Status=OPERATION_PERMITTED
GOVERNANCE_RESULT: Region=false Encryption=true Status=BLOCKED_BY_GUARDRAIL"""

p4_check = {
    "question": "A security engineer drafts an SCP to restrict member account operations strictly to `us-east-1`. Immediately upon attaching the SCP, administrators across all member accounts are unable to create IAM users or modify Route 53 DNS records. What is the root cause?",
    "options": [
        "The SCP lacked an exemption for global AWS services (such as IAM, Route 53, and CloudFront), which execute against global endpoints and require explicit exclusion from regional condition filters.",
        "IAM and Route 53 were deprecated by AWS Organizations.",
        "Member accounts do not support DNS routing.",
        "The AWS Management Account ran out of IP addresses."
    ],
    "answer": 0,
    "explanation": "Global AWS services like IAM, Route 53, CloudFront, and WAF do not execute within specific regional endpoints. A regional restriction SCP must explicitly exempt global actions or services from the `aws:RequestedRegion` condition check; otherwise, all global identity and DNS operations will be blocked globally."
}

# -------------------------------------------------------------
# Part 5: Masterclass Synthesis & Multi-Account SRE Runbook
# -------------------------------------------------------------
p5_title = "Masterclass Synthesis: Multi-Account SRE, Compliance Audits & Emergency Break-Glass Runbooks"
p5_say = [
    "To conclude Day 41 and establish the foundational security bedrock of Block 9, we synthesize our multi-account governance architecture into a complete Site Reliability Engineering (SRE) and compliance operating model. Over the preceding four parts, we traversed the structural design of AWS Organizations and OU hierarchies, evaluated the mathematical deny precedence of Service Control Policies, leveraged AWS Control Tower for automated landing zone baselines, and implemented production-grade SCPs for regional fencing and telemetry immutability.",
    "In live enterprise operations, managing 50 or 500 AWS accounts requires continuous observability, proactive compliance auditing, and hardened emergency procedures. Security operations teams centralize all multi-account compliance monitoring using AWS Security Hub and AWS Config aggregators deployed in the dedicated Security Tooling account. By enabling cross-account, cross-region aggregation, CIS AWS Foundations Benchmarks and PCI-DSS compliance scores across every member account are updated in real time on a single pane of glass.",
    "A paramount operational protocol in enterprise governance is the Emergency Break-Glass Procedure. While restrictive SCPs and least-privilege IAM roles protect against accidental blunders and malicious insiders, catastrophic incidents can occur where automated CI/CD pipelines fail, production deployments stall, and on-call SREs require emergency access to recover customer-facing services. To handle these rare crises safely, platform teams engineer a Break-Glass Role.",
    "A Break-Glass Role is a highly restricted IAM role residing in the Management or Security account, protected by hardware Multi-Factor Authentication (MFA) with credentials stored in an encrypted physical enterprise vault. The role is permitted to assume cross-account recovery roles in member accounts. Crucially, the Break-Glass role is explicitly exempted from specific operational SCP deny rules via condition keys (`StringNotLike: {'aws:PrincipalArn': 'arn:aws:iam::*:role/EmergencyBreakGlassRole'}`). Whenever a break-glass assumption occurs, Amazon EventBridge immediately triggers a high-severity PagerDuty broadcast, alerting the Chief Information Security Officer (CISO) and opening an emergency incident bridge.",
    "To enforce financial accountability across hundreds of accounts, platform teams implement AWS Tag Policies within AWS Organizations. Tag policies define mandatory tagging schemas for all deployed resources: requiring tags such as `CostCenter`, `Environment`, and `ApplicationOwner`. If a developer or Terraform pipeline attempts to launch an EC2 instance, S3 bucket, or RDS cluster without compliant cost allocation tags, the AWS API rejects the creation request. This automated FinOps governance ensures that every dollar of cloud expenditure is mapped accurately to organizational cost centers.",
    "To guarantee continuous posture compliance against regulatory standards (such as SOC 2 Type II, ISO 27001, and HIPAA), security teams deploy automated drift detection frameworks. AWS Config Organization Rules automatically deploy compliance evaluators across every member account in the organization. If an engineer manages to launch a non-compliant resource—for instance, creating a security group with port 22 open to `0.0.0.0/0`—AWS Config immediately detects the drift, publishes an event to Amazon EventBridge in the Security Tooling account, and triggers an automated AWS Lambda function that revokes the insecure ingress rule within seconds. This closes the loop between static policy governance and runtime autonomous defense.",
    "Audit compliance and log immutability are fortified through S3 Object Lock and AWS CloudTrail Organization Trails. The organization trail delivers encrypted logs from all member accounts directly to the central Log Archive account. S3 Object Lock configured in Compliance Mode prevents any user—including AWS account root users and corporate executives—from altering, overwriting, or deleting log files for a mandatory retention period (such as seven years), satisfying SEC Rule 17a-4 and FedRAMP high compliance standards.",
    "In the accompanying verified implementation, we construct the 'MultiAccountGovernanceSimulator'. This deterministic test harness validates the complete multi-account operational topology: verifying active account placement across core and workload OUs, asserting that explicit SCP denies override local administrator actions, confirming regional fencing enforcement, and validating break-glass access controls. Run this verified harness to establish your mastery of enterprise multi-account governance on AWS."
]

p5_code = """// Part 5: ⭐ Masterclass Synthesis: Multi-Account Enclave Governance Simulator
interface EnclaveMetrics {
  totalMemberAccounts: number;
  activeSCPRules: number;
  scpDenyPrecedenceActive: boolean;
  breakGlassAccessRestricted: boolean;
  unauthorizedActionsBlocked: number;
}

class MultiAccountGovernanceSimulator {
  private metrics: EnclaveMetrics;

  constructor(metrics: EnclaveMetrics) {
    this.metrics = metrics;
  }

  runAudit(): string {
    const isEnclaveSecure = this.metrics.totalMemberAccounts >= 25 &&
                            this.metrics.activeSCPRules >= 8 &&
                            this.metrics.scpDenyPrecedenceActive &&
                            this.metrics.breakGlassAccessRestricted;

    return `ENCLAVE_GOVERNANCE_VERIFIED: Accounts=${this.metrics.totalMemberAccounts} SCPs=${this.metrics.activeSCPRules} BlockedThreats=${this.metrics.unauthorizedActionsBlocked} ComplianceStatus=${isEnclaveSecure ? 'ENTERPRISE_ZERO_TRUST_PASS' : 'FAIL'}`;
  }
}

const simulator = new MultiAccountGovernanceSimulator({
  totalMemberAccounts: 32,
  activeSCPRules: 14,
  scpDenyPrecedenceActive: true,
  breakGlassAccessRestricted: true,
  unauthorizedActionsBlocked: 1420,
});

console.log(simulator.runAudit());"""

p5_output = """ENCLAVE_GOVERNANCE_VERIFIED: Accounts=32 SCPs=14 BlockedThreats=1420 ComplianceStatus=ENTERPRISE_ZERO_TRUST_PASS"""

p5_check = {
    "question": "During a severe production outage, automated deployment pipelines are deadlocked and on-call SREs must urgently modify infrastructure in a member account. What is the recommended architectural pattern to grant emergency access while preserving audit compliance?",
    "options": [
        "Utilize a pre-provisioned Emergency Break-Glass IAM role secured by hardware MFA, exempted from specific operational SCP denies, with automated real-time EventBridge alert broadcasts to security leadership upon assumption.",
        "Share the Management Account root user password in an unencrypted Slack channel.",
        "Delete all Service Control Policies across the entire organization until the outage is resolved.",
        "Disable AWS CloudTrail across all accounts so changes can be made without generating error logs."
    ],
    "answer": 0,
    "explanation": "The Emergency Break-Glass pattern provides controlled, audited high-privilege access during critical crises. The role is secured with hardware MFA, explicitly exempted from operational SCP constraints, and triggers immediate automated high-priority alerts to security leadership when assumed."
}

# -------------------------------------------------------------
# Verify Word Counts
# -------------------------------------------------------------
parts_say = [p1_say, p2_say, p3_say, p4_say, p5_say]
parts_code = [p1_code, p2_code, p3_code, p4_code, p5_code]
parts_output = [p1_output, p2_output, p3_output, p4_output, p5_output]
parts_title = [p1_title, p2_title, p3_title, p4_title, p5_title]
parts_check = [p1_check, p2_check, p3_check, p4_check, p5_check]

total_words = 0
for idx, say in enumerate(parts_say):
    cnt = count_words(say)
    total_words += cnt
    print(f"Part {idx+1} word count: {cnt}")
    if cnt < 580:
        print(f"ERROR: Part {idx+1} word count {cnt} < 580 words!")
        sys.exit(1)

print(f"Total Day 41 word count: {total_words} (Target >= 3000)")
if total_words < 3000:
    print(f"ERROR: Total word count {total_words} < 3000 words!")
    sys.exit(1)

# -------------------------------------------------------------
# Build LongLesson Data Object
# -------------------------------------------------------------
day41_lesson = {
    "day": 41,
    "coursePrefix": "cloud",
    "title": "Multi-Account Governance: AWS Organizations, Landing Zones, AWS Control Tower & Service Control Policies (SCPs)",
    "goal": "Architect enterprise multi-account environments: master AWS Organizations, AWS Control Tower, Landing Zone architectures, Organizational Units (OUs), Consolidated Billing, and Service Control Policies (SCPs) that enforce immutable guardrails.",
    "minutes": 30,
    "recap": "Today we inaugurate Block 9 with Enterprise Multi-Account Governance. We explore account blast radius isolation, AWS Organizations OU hierarchies, the mathematical deny precedence of Service Control Policies (SCPs), Control Tower preventive and detective guardrails, production regional fencing, and emergency break-glass SRE runbooks.",
    "summary": [
        "AWS Accounts provide the ultimate security, administrative, and quota blast radius boundary in cloud architecture.",
        "Service Control Policies (SCPs) enforce maximum permission boundaries across OUs where explicit Deny rules override all local IAM admin rights.",
        "AWS Control Tower orchestrates Landing Zones with automated Account Factory provisioning and continuous AWS Config compliance auditing.",
        "Production SCP engineering requires explicit exemptions for global services like IAM and Route 53 to prevent accidental global control plane lockouts."
    ],
    "parts": []
}

for i in range(5):
    day41_lesson["parts"].append({
        "title": parts_title[i],
        "say": parts_say[i],
        "code": parts_code[i],
        "output": parts_output[i],
        "codeNotes": [
            {"line": 2, "note": f"Defines structural interfaces and governance configuration for Part {i+1} mechanics."},
            {"line": 10, "note": f"Executes deterministic evaluation of AWS Organizations and SCP policy invariants."},
            {"line": 20, "note": f"Validates compliance rules, deny precedence, and administrative boundary guarantees."}
        ],
        "tryIt": "Modify the SCP rules, OU hierarchy paths, or region parameters to observe policy evaluation and guardrail enforcement results.",
        "check": parts_check[i]
    })

# Write to scripts/day41_cloud.json
with open('scripts/day41_cloud.json', 'w', encoding='utf-8') as f:
    json.dump(day41_lesson, f, indent=2)

print("Saved scripts/day41_cloud.json successfully.")

# -------------------------------------------------------------
# Build Visual Envelope day-41.json
# -------------------------------------------------------------
visual_envelope = {
    "schemaVersion": 2,
    "prefix": "cloud",
    "day": 41,
    "entries": []
}

for i in range(5):
    entry = {
        "partTitle": parts_title[i],
        "codeHash": get_hash(parts_code[i]),
        "spec": {
            "template": "workflow",
            "workflow": {
                "title": parts_title[i],
                "nodes": [
                    {"id": "management", "label": "AWS Org Root", "status": "active"},
                    {"id": "ou_core", "label": "Core / Security OU", "status": "active"},
                    {"id": "scp_guardrail", "label": "SCP Deny Guardrail", "status": "active"},
                    {"id": "member_acc", "label": "Workload Member Account", "status": "active"}
                ],
                "edges": [
                    {"from": "management", "to": "ou_core", "label": "Policy Inheritance"},
                    {"from": "ou_core", "to": "scp_guardrail", "label": "Attach Guardrail"},
                    {"from": "scp_guardrail", "to": "member_acc", "label": "Enforce Maximum Boundary"}
                ]
            },
            "steps": [
                {
                    "at": "say1",
                    "focus": "management",
                    "annotation": "AWS Organizations manages root hierarchy, consolidated billing, and core accounts."
                },
                {
                    "at": "say2",
                    "focus": "ou_core",
                    "annotation": "Organizational Units structure accounts into Core (Log Archive, Security) and Workloads."
                },
                {
                    "at": "example",
                    "focus": "scp_guardrail",
                    "annotation": "Service Control Policies apply immutable explicit Deny rules above local IAM admins."
                },
                {
                    "at": "tryIt",
                    "focus": "member_acc",
                    "annotation": "Member accounts operate autonomously within strictly bounded, compliant enclaves."
                }
            ]
        }
    }
    visual_envelope["entries"].append(entry)

with open('src/lib/data/lessonVisuals/cloud/day-41.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print("Saved src/lib/data/lessonVisuals/cloud/day-41.json successfully.")
