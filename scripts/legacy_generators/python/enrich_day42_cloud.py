import sys

enriched_script = '''import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_hash(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def count_words(paragraphs: list) -> int:
    return sum(len(p.split()) for p in paragraphs)

# -------------------------------------------------------------
# Part 1: IAM Permission Boundaries
# -------------------------------------------------------------
p1_title = "IAM Permission Boundaries: Delegated Administration without Privilege Escalation"
p1_say = [
    "Welcome to Day 42 of our Cloud Native AWS Masterclass. Following yesterday's multi-account organizational governance with AWS Organizations and Service Control Policies, we now zoom into the core authorization mechanisms that govern individual identities, roles, and workloads within each account. In modern DevOps and platform engineering teams, developers require the agility to create and modify AWS IAM roles for serverless Lambda functions, Amazon ECS tasks, and automated CI/CD runners without waiting days for central security tickets. However, granting developers direct `iam:CreateRole` and `iam:AttachRolePolicy` permissions introduces an existential security risk: Privilege Escalation.",
    "Privilege Escalation occurs when a principal with limited permissions uses its existing access to grant itself elevated privileges. Consider a junior developer with permissions to deploy Lambda functions and attach policies to them. If given unconstrained `iam:CreateRole` and `iam:AttachRolePolicy` rights, the developer can trivially author a new IAM role with the AWS-managed `AdministratorAccess` policy (`Effect: Allow, Action: *, Resource: *`), attach that role to their Lambda function, and invoke the function to execute root-level commands or access restricted databases. To prevent this security breach while still empowering developers with self-service autonomy, AWS engineered IAM Permission Boundaries.",
    "An IAM Permission Boundary is an advanced authorization mechanism that uses a customer-managed policy to set the absolute maximum permissions that an identity-based policy can grant to an IAM user or role. An identity's effective permissions are calculated mathematically as the strict intersection between its attached identity-based policies and its permission boundary. If an action is allowed by an attached policy but absent from the permission boundary policy, the action is unconditionally denied!",
    "To understand this evaluation hierarchy, consider the comprehensive AWS Policy Evaluation Logic: when an API request arrives, AWS evaluates Service Control Policies (SCPs) first, followed by Resource-Based Policies (like S3 bucket policies), IAM Permission Boundaries, Session Policies (from assumed roles), and finally Identity-Based Policies. An explicit Deny at any level in this evaluation pipeline immediately terminates the evaluation with an Access Denied. Even if an identity policy has `Allow *`, the permission boundary filters out every action not explicitly whitelisted within the boundary document.",
    "To enforce delegated administration securely, security teams author an IAM policy that allows developers to create roles only if they simultaneously attach the designated permission boundary. This is achieved using the `iam:PermissionsBoundary` condition key: `Condition: { StringEquals: { 'iam:PermissionsBoundary': 'arn:aws:iam::123456789012:policy/DeveloperBoundary' } }`. If a developer attempts to create an IAM role without attaching the boundary, or attempts to attach a different, more permissive boundary, the AWS IAM policy evaluation engine rejects the API call with an `AccessDeniedException`.",
    "Furthermore, the developer's own IAM policy must prevent them from modifying or deleting the permission boundary policy itself (`Deny` on `iam:DeletePolicy`, `iam:CreatePolicyVersion`, and `iam:SetDefaultPolicyVersion` on the boundary ARN), and must prevent them from removing the boundary from any existing role (`Deny` on `iam:DeleteRolePermissionsBoundary`). In automated CI/CD pipelines, platform teams enforce this via Open Policy Agent (OPA) Conftest and Terraform pre-commit linters, verifying that every `aws_iam_role` resource declares the mandatory `permissions_boundary` argument.",
    "To enforce permission boundaries across complex multi-account organizations automatically, security teams utilize AWS CloudFormation Service-Linked Roles and Service Catalog portfolios. When a developer launches a new microservice product stack, the provisioning pipeline uses a designated deployment role that has permission to author IAM roles strictly with the mandatory permission boundary attached. If an attacker attempts to author an unconstrained role via the AWS CLI or SDK, CloudFormation detects the absence of the boundary and rolls back the stack creation atomically, preserving organizational boundary invariants.",
    "In high-compliance enterprise cloud environments, Permission Boundaries serve as the second tier in the defense-in-depth hierarchy: Service Control Policies (SCPs) define the outer perimeter for the entire account, Permission Boundaries establish maximum ceilings for delegated principals within the account, and identity-based policies define granular least-privilege permissions for specific microservices."
]

p1_code = """// Part 1: IAM Permission Boundary Privilege Escalation Prevention
interface IAMRoleRequest {
  roleName: string;
  attachedPolicyPermissions: string[];
  permissionBoundaryPermissions: string[];
}

function evaluateEffectivePermissions(req: IAMRoleRequest): { effectiveAllowed: string[]; isPrivilegeEscalationBlocked: boolean } {
  const effective = req.attachedPolicyPermissions.filter(p => req.permissionBoundaryPermissions.includes(p));
  const isEscalationBlocked = req.attachedPolicyPermissions.includes('iam:*') && !effective.includes('iam:*');

  return { effectiveAllowed: effective, isPrivilegeEscalationBlocked: isEscalationBlocked };
}

const developerRole: IAMRoleRequest = {
  roleName: 'AppDeployerRole',
  attachedPolicyPermissions: ['s3:*', 'sqs:*', 'iam:*'],
  permissionBoundaryPermissions: ['s3:*', 'sqs:*', 'dynamodb:*'],
};

const result = evaluateEffectivePermissions(developerRole);
console.log(`PERMISSION_BOUNDARY_CHECK: Role=${developerRole.roleName} EffectivePerms=[${result.effectiveAllowed.join(',')}] EscalationBlocked=${result.isPrivilegeEscalationBlocked}`);"""

p1_output = """PERMISSION_BOUNDARY_CHECK: Role=AppDeployerRole EffectivePerms=[s3:*,sqs:*] EscalationBlocked=true"""

p1_check = {
    "question": "A cloud platform team wants to allow software developers to create and manage IAM roles for their microservices, but must guarantee that developers cannot create a role with `AdministratorAccess` to escalate their privileges. Which architectural pattern enforces this?",
    "options": [
        "Enforce IAM Permission Boundaries on role creation: require developers to attach a customer-managed permission boundary policy to any new role using the `iam:PermissionsBoundary` condition key.",
        "Remove all IAM permissions from developers and force them to submit manual tickets for every role.",
        "Rely on annual security audits to detect privilege escalations after they occur.",
        "Store the AWS root account password in an encrypted file on an S3 bucket."
    ],
    "answer": 0,
    "explanation": "IAM Permission Boundaries allow administrators to delegate role creation authority safely. By enforcing a condition that any new role must have a predefined Permission Boundary attached, the effective permissions of the new role can never exceed the boundary ceiling, preventing privilege escalation."
}

# -------------------------------------------------------------
# Part 2: Attribute-Based Access Control (ABAC) vs RBAC
# -------------------------------------------------------------
p2_title = "Attribute-Based Access Control (ABAC) vs RBAC: Dynamic Tag-Based Authorization at Scale"
p2_say = [
    "As cloud architectures scale to hundreds of microservices, thousands of infrastructure resources, and hundreds of software engineers, traditional access control models experience severe operational friction. In traditional Role-Based Access Control (RBAC), access permissions are tightly coupled to specific named IAM roles and policies. When a company launches a new engineering team or microservice project, security engineers must author new IAM roles, update policy ARNs, and modify resource-based policies on S3 buckets, KMS keys, and SQS queues. Over several years, this creates catastrophic Policy Explosion: accounts accumulate thousands of sprawling, overlapping IAM policies that become impossible to audit, maintain, or refactor.",
    "To eliminate policy explosion and achieve infinite governance scalability, enterprise architects transition to Attribute-Based Access Control (ABAC). ABAC is an authorization paradigm where permissions are defined dynamically based on attributes (tags) attached to the IAM principal (user or role) and tags attached to the AWS target resource. In AWS, ABAC policies compare the principal's session tags (`aws:PrincipalTag/Key`) with the resource's resource tags (`aws:ResourceTag/Key`) directly within policy condition blocks.",
    "Consider a dynamic ABAC policy statement: `Effect: Allow, Action: ['s3:GetObject', 's3:PutObject'], Resource: 'arn:aws:s3:::*', Condition: { StringEquals: { 'aws:ResourceTag/Project': '${aws:PrincipalTag/Project}', 'aws:ResourceTag/Department': '${aws:PrincipalTag/Department}' } }`. This single policy statement scales effortlessly across the entire enterprise! When an engineer tagged `Department: Analytics, Project: Apollo` attempts to read an S3 bucket tagged `Department: Analytics, Project: Apollo`, access is automatically granted. If the same engineer attempts to read an S3 bucket tagged `Department: Finance, Project: Zeus`, access is denied automatically by the tag mismatch.",
    "The operational benefits of ABAC are transformative: when a new microservice project launches, security teams author zero new IAM policies! Developers simply tag their new S3 buckets and DynamoDB tables with the project tag. Engineers who assume project roles tagged with matching attributes gain immediate, least-privilege access without touching central IAM configurations. Furthermore, when employees switch teams or projects, updating their federated identity tags in the central corporate directory (e.g. Okta or Azure AD) instantly reconfigures their cloud access rights globally in real time.",
    "In advanced ABAC topologies, session tags flow across multi-tier role assumptions using AWS STS Transitive Tags. When a human engineer or automated runner assumes an IAM role via `sts:AssumeRole`, the caller can pass session tags (`--tags Key=CostCenter,Value=101`) with the `sts:TransitiveTagKeys` parameter. Transitive tags persist across subsequent role chaining steps, ensuring that when an application container assumes a secondary database access role, the original principal's department and project tags are preserved and enforced at the database tier.",
    "A critical complement to dynamic ABAC is AWS Organizations Tag Policies. While IAM ABAC policies check tags during runtime authorization, Tag Policies enforce case-sensitive standardization and permissible value enums during resource provisioning. For example, a tag policy mandates that the `Project` tag key must be capitalized and must match one of forty approved corporate initiatives (such as `Apollo`, `Zeus`, or `Hermes`). If a developer attempts to create an S3 bucket or DynamoDB table with a typo like `project: apolo`, the AWS API rejects the creation request immediately, guaranteeing that ABAC runtime tag comparisons never fail due to typographical drift.",
    "To maintain ABAC integrity, security teams must prevent Tag Tampering. If a developer could modify the tags on their own IAM role or re-tag a restricted production database with a development tag, they could bypass ABAC guardrails. Therefore, production ABAC policies include strict tag governance statements: denying `iam:TagRole` and `iam:UntagRole` on principals unless authorized by security administrators, and enforcing `aws:RequestTag` validation during resource creation to guarantee that all newly created resources possess mandatory, non-empty cost center and project tags.",
    "By shifting from static RBAC role proliferation to dynamic ABAC tag matching, enterprise organizations establish scalable, autonomous security boundaries that adapt seamlessly to organizational changes while minimizing human error."
]

p2_code = """// Part 2: Attribute-Based Access Control (ABAC) Dynamic Tag Evaluator
interface PrincipalIdentity {
  username: string;
  department: string;
  project: string;
}

interface CloudResource {
  resourceId: string;
  departmentTag: string;
  projectTag: string;
}

function evaluateABAC(principal: PrincipalIdentity, resource: CloudResource): { accessGranted: boolean; matchedTags: number } {
  let matches = 0;
  if (principal.department === resource.departmentTag) matches++;
  if (principal.project === resource.projectTag) matches++;

  const accessGranted = matches === 2;
  return { accessGranted, matchedTags: matches };
}

const alice: PrincipalIdentity = { username: 'alice', department: 'Analytics', project: 'Apollo' };
const res1: CloudResource = { resourceId: 's3://apollo-raw-data', departmentTag: 'Analytics', projectTag: 'Apollo' };
const res2: CloudResource = { resourceId: 's3://zeus-finance-records', departmentTag: 'Finance', projectTag: 'Zeus' };

console.log(`ABAC_EVALUATION: User=${alice.username} Res=${res1.resourceId} Access=${evaluateABAC(alice, res1).accessGranted}`);
console.log(`ABAC_EVALUATION: User=${alice.username} Res=${res2.resourceId} Access=${evaluateABAC(alice, res2).accessGranted}`);"""

p2_output = """ABAC_EVALUATION: User=alice Res=s3://apollo-raw-data Access=true
ABAC_EVALUATION: User=alice Res=s3://zeus-finance-records Access=false"""

p2_check = {
    "question": "An enterprise with 200 software teams suffers from IAM policy sprawl, having accumulated over 3,000 distinct IAM policies that must be updated whenever teams change. What is the recommended architectural solution to scale access control without adding new policies?",
    "options": [
        "Implement Attribute-Based Access Control (ABAC), utilizing tag-matching condition keys (`aws:PrincipalTag/Project == aws:ResourceTag/Project`) so a single policy scales dynamically across all current and future projects.",
        "Give all 200 teams access to a single shared IAM role with wildcard permissions.",
        "Delete all IAM policies and switch to public S3 bucket policies.",
        "Manually merge all 3,000 policies into a single 10MB text file."
    ],
    "answer": 0,
    "explanation": "Attribute-Based Access Control (ABAC) dynamically grants permissions based on attributes (tags) on the user and the resource. A single ABAC policy allows access when principal tags match resource tags, eliminating the need to create or modify IAM policies as new projects and teams are onboarded."
}

# -------------------------------------------------------------
# Part 3: Eliminating Static Credentials: OIDC Federation
# -------------------------------------------------------------
p3_title = "Eliminating Static Credentials: OIDC Workload Identity Federation with GitHub Actions"
p3_say = [
    "One of the most persistent and catastrophic vulnerability vectors in modern cloud infrastructure is Static Long-Term Credentials. Historically, engineering teams deploying code from continuous integration and continuous deployment (CI/CD) pipelines (such as GitHub Actions, GitLab CI, or Jenkins) created dedicated IAM users with permanent programmatic access keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`). These static credentials were copy-pasted into repository secrets. However, static keys present severe attack surfaces: keys are accidentally committed to public repositories, exposed in CI build log traces, or stolen when third-party open-source build actions are compromised in software supply-chain attacks.",
    "A zero-trust cloud architecture enforces an absolute mandate: Zero Static Long-Term Credentials! Workloads running outside AWS—whether CI/CD runners, on-premises Kubernetes clusters, or multi-cloud services—must authenticate using Short-Lived Ephemeral Credentials issued dynamically through OpenID Connect (OIDC) Workload Identity Federation.",
    "With OpenID Connect federation, the external CI/CD runner establishes an OpenID Connect trust relationship directly with AWS Security Token Service (STS). In the case of GitHub Actions, GitHub acts as the trusted OpenID Connect Identity Provider (IdP). Prior to running a deployment job, GitHub's runner requests a signed JSON Web Token (JWT) from GitHub's internal token minting service (`token.actions.githubusercontent.com`). This cryptographically signed JWT contains rich metadata claims: the GitHub repository name, the Git branch, the pull request commit SHA, and the workflow environment.",
    "The GitHub Action runner forwards this signed JWT to the AWS STS `AssumeRoleWithWebIdentity` API endpoint. AWS STS inspects the token: it cryptographically validates GitHub's public RSA signature using GitHub's OpenID discovery keys (`/.well-known/openid-configuration`), verifies the audience claim (`aud: sts.amazonaws.com`), and evaluates the IAM Role's Trust Policy.",
    "The IAM Role Trust Policy is where senior cloud architects enforce strict contextual boundaries. A naive trust policy that simply trusts the GitHub IdP allows ANY GitHub user on the internet to assume the production role! A hardened enterprise trust policy binds token issuance to specific repository boundaries using the `token.actions.githubusercontent.com:sub` (Subject) claim: `Condition: { StringEquals: { 'token.actions.githubusercontent.com:sub': 'repo:my-enterprise/production-api:ref:refs/heads/main' } }`. This guarantees that ONLY workflows running on the protected `main` branch of that specific private enterprise repository can assume the role.",
    "Furthermore, security teams leverage GitHub Environment Protections to enforce human approval gates. By binding the IAM role trust policy to a specific GitHub Environment (`repo:my-org/my-repo:environment:production`), GitHub requires designated security leads to manually approve the deployment job before GitHub's token service mints the JWT. This guarantees that unapproved pull request code or unauthorized commits can never obtain AWS credentials.",
    "In enterprise software delivery, OpenID Connect federation with GitHub Actions also supports Matrix Deployments and Reusable Workflows across multi-account topologies. By including the `job_workflow_ref` claim in the IAM trust policy condition block (`Condition: { StringEquals: { 'token.actions.githubusercontent.com:job_workflow_ref': 'enterprise-org/shared-workflows/.github/workflows/deploy.yml@refs/heads/main' } }`), organizations guarantee that only standardized, security-approved deployment pipelines can assume the production deployment role. Individual application development teams cannot tamper with the CI deployment scripts in their private repositories, achieving strict separation of duties between workflow authoring and application code.",
    "Similar OIDC federation patterns secure containerized workloads running in Amazon EKS via IAM Roles for Service Accounts (IRSA). In IRSA, Pods project a projected service account token signed by EKS's OIDC provider. The AWS SDK automatically reads this token and assumes an IAM role dynamically, eliminating the dangerous legacy practice of assigning broad IAM permissions to the underlying EC2 worker node instance profiles.",
    "Upon successful validation, AWS STS issues temporary credentials (`AWS_SESSION_TOKEN`) valid for a strictly limited duration (e.g. 15 to 60 minutes). The runner completes its Terraform or CDK deployment, and the credentials expire automatically. Even if a rogue build action exfiltrates the session token, the token becomes completely inert shortly after the build completes, neutralizing credential leakage threats."
]

p3_code = """// Part 3: GitHub Actions OIDC Token Claim & Trust Policy Evaluator
interface OIDCTokenClaims {
  iss: string;
  aud: string;
  sub: string;
  repository: string;
  ref: string;
}

interface IAMTrustPolicyRule {
  expectedIssuer: string;
  expectedAudience: string;
  allowedRepo: string;
  allowedBranch: string;
}

function validateOIDCTrust(claims: OIDCTokenClaims, rule: IAMTrustPolicyRule): { tokenValid: boolean; roleAssumed: boolean } {
  const isIssValid = claims.iss === rule.expectedIssuer;
  const isAudValid = claims.aud === rule.expectedAudience;
  const isSubjectValid = claims.sub === `repo:${rule.allowedRepo}:ref:refs/heads/${rule.allowedBranch}`;

  const valid = isIssValid && isAudValid && isSubjectValid;
  return { tokenValid: valid, roleAssumed: valid };
}

const rule: IAMTrustPolicyRule = {
  expectedIssuer: 'https://token.actions.githubusercontent.com',
  expectedAudience: 'sts.amazonaws.com',
  allowedRepo: 'enterprise-org/production-api',
  allowedBranch: 'main',
};

const mainDeployment = validateOIDCTrust({
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'sts.amazonaws.com',
  sub: 'repo:enterprise-org/production-api:ref:refs/heads/main',
  repository: 'enterprise-org/production-api',
  ref: 'refs/heads/main',
}, rule);

const featureBranchDeployment = validateOIDCTrust({
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'sts.amazonaws.com',
  sub: 'repo:enterprise-org/production-api:ref:refs/heads/feature-x',
  repository: 'enterprise-org/production-api',
  ref: 'refs/heads/feature-x',
}, rule);

console.log(`OIDC_FEDERATION_RESULT: MainBranch RoleAssumed=${mainDeployment.roleAssumed}`);
console.log(`OIDC_FEDERATION_RESULT: FeatureBranch RoleAssumed=${featureBranchDeployment.roleAssumed}`);"""

p3_output = """OIDC_FEDERATION_RESULT: MainBranch RoleAssumed=true
OIDC_FEDERATION_RESULT: FeatureBranch RoleAssumed=false"""

p3_check = {
    "question": "A DevOps team wants to configure secure CI/CD deployments from GitHub Actions into an AWS production account without storing permanent AWS Access Keys (`AKIA...`) in repository secrets. What is the AWS-recommended architecture?",
    "options": [
        "Configure OpenID Connect (OIDC) identity federation between GitHub Actions and AWS STS, allowing the CI runner to assume an IAM role dynamically using short-lived tokens restricted to the main branch via subject claims.",
        "Store static root account access keys in GitHub Secrets and rotate them manually every two years.",
        "Disable IAM authentication and make the production S3 deployment bucket publicly writable.",
        "Deploy a dedicated EC2 proxy instance that holds long-term access keys and listens on public port 80."
    ],
    "answer": 0,
    "explanation": "Configuring OIDC federation between GitHub Actions and AWS STS eliminates long-term static credentials. Workflows authenticate dynamically via signed JWTs, exchanging them for temporary STS session credentials with strict branch and repository subject constraints."
}

# -------------------------------------------------------------
# Part 4: Enterprise Identity Federation: IAM Identity Center & SCIM
# -------------------------------------------------------------
p4_title = "Enterprise Identity Federation: IAM Identity Center (AWS SSO), Okta & SCIM Provisioning"
p4_say = [
    "While workload identity federation solves the security challenge for automated CI/CD runners and software containers, enterprise cloud governance must also address Human Identity Federation. In a company with hundreds of software engineers, cloud architects, and data analysts working across dozens of AWS accounts, creating local IAM users (`iam:CreateUser`) inside each individual AWS account is an administrative disaster. Employees who leave the company retain active access keys unless manually deleted from every single account; password policies, multi-factor authentication (MFA) enforcement, and session timeouts become impossible to audit.",
    "To centralize human access governance, AWS engineered AWS IAM Identity Center (formerly AWS Single Sign-On / AWS SSO). Built as the native human access gateway for AWS Organizations, IAM Identity Center allows employees to sign in once to a centralized enterprise portal and access assigned roles across multiple AWS accounts and business applications using their single corporate identity.",
    "In enterprise production environments, IAM Identity Center integrates with external Identity Providers (IdPs)—such as Okta, Microsoft Entra ID (Azure AD), PingFederate, or Google Workspace—via SAML 2.0 (Security Assertion Markup Language) and SCIM (System for Cross-domain Identity Management). While SAML 2.0 handles browser authentication and cryptographic assertion signing during login, SCIM handles Automated User Provisioning and Deprovisioning.",
    "SCIM is a RESTful API protocol that synchronizes user and group lifecycle events in real time. When HR onboard a new engineer in Okta and assigns them to the 'CloudPlatform' group, Okta's SCIM client automatically calls IAM Identity Center to provision the user object, synchronize group memberships, and assign project attributes. Even more critical is Instant Offboarding: when an employee departs the organization, disabling their account in Okta triggers an automated SCIM deprovisioning call that instantly revokes all active AWS SSO sessions and strips access across all member accounts in milliseconds!",
    "Within IAM Identity Center, access to AWS member accounts is governed by Permission Sets and Account Assignments. A Permission Set is a centralized template defining IAM policies (AWS managed policies, customer managed policies, or inline policies). Security administrators assign a permission set (e.g. `DeveloperReadWrite`) to a specific group (e.g. `PaymentsTeam`) across designated member accounts (e.g. `Payments-Dev`, `Payments-Prod`). When assigned, IAM Identity Center automatically provisions and manages an underlying cross-account IAM role in each target account.",
    "Furthermore, IAM Identity Center enables ABAC Session Tagging for human identities. By mapping external IdP attributes (such as Okta user department, division, and cost center) into IAM Identity Center SAML session tags, when an engineer signs into AWS via SSO, their federated session is automatically stamped with their corporate attributes. Downstream IAM policies evaluate these session tags against resource tags dynamically, harmonizing human access and workload access under a unified ABAC umbrella.",
    "For fine-grained human session control, IAM Identity Center integrates with Session Policies during SSO role assumption. When an engineer clicks an assigned account in the AWS access portal, IAM Identity Center can dynamically inject an inline session policy that further scopes down the user's permissions based on their current network context. For instance, if an engineer accesses the production console from an external home Wi-Fi network rather than the corporate VPN, the session policy restricts write actions while allowing read-only inspection, enforcing zero-trust conditional access at the presentation layer.",
    "In addition, IAM Identity Center enforces Context-Aware Multi-Factor Authentication (MFA). Administrators configure policies requiring FIDO2 WebAuthn security keys or hardware TOTP tokens on every login, blocking session establishment if incoming traffic originates from suspicious IP ranges or unmanaged corporate devices, conforming to modern Zero-Trust human access standards."
]

p4_code = """// Part 4: IAM Identity Center (AWS SSO) SCIM Directory Sync
interface SCIMUser {
  id: string;
  userName: string;
  groups: string[];
  active: boolean;
}

class SCIMDirectoryEngine {
  private users: Map<string, SCIMUser> = new Map();

  syncUser(user: SCIMUser) {
    this.users.set(user.id, user);
  }

  deprovisionUser(userId: string): { userFound: boolean; accessRevoked: boolean } {
    const user = this.users.get(userId);
    if (!user) return { userFound: false, accessRevoked: false };
    user.active = false;
    user.groups = [];
    return { userFound: true, accessRevoked: true };
  }

  getActiveUserCount(): number {
    return Array.from(this.users.values()).filter(u => u.active).length;
  }
}

const scim = new SCIMDirectoryEngine();
scim.syncUser({ id: 'usr-101', userName: 'john.doe@company.com', groups: ['CloudEngineers', 'ProdAdmins'], active: true });
scim.syncUser({ id: 'usr-102', userName: 'sarah.smith@company.com', groups: ['Auditors'], active: true });

const deprovision = scim.deprovisionUser('usr-101');
console.log(`SCIM_LIFECYCLE: Deprovisioned=${deprovision.accessRevoked} ActiveSSOUsers=${scim.getActiveUserCount()}`);"""

p4_output = """SCIM_LIFECYCLE: Deprovisioned=true ActiveSSOUsers=1"""

p4_check = {
    "question": "An enterprise with 500 engineers across 60 AWS accounts must ensure that when an employee departs the company, their access to all 60 AWS accounts is terminated immediately without requiring manual audits of local IAM users. What is the optimal architecture?",
    "options": [
        "Federate an external Identity Provider (such as Okta or Microsoft Entra ID) with AWS IAM Identity Center using SAML 2.0 and SCIM automated provisioning, so deactivating the user in Okta instantly revokes all AWS access globally.",
        "Write a scheduled daily cron job on an EC2 instance that logs into each of the 60 accounts with root credentials and checks for departed users.",
        "Share a single IAM user across all 500 engineers and change the password whenever an employee leaves.",
        "Disable all human access to AWS and require all infrastructure modifications to be done via support tickets."
    ],
    "answer": 0,
    "explanation": "Integrating an external IdP with AWS IAM Identity Center via SCIM (System for Cross-domain Identity Management) automates user provisioning and deprovisioning. Terminating an employee in the central IdP immediately triggers SCIM synchronization, revoking all active sessions and permissions across all AWS accounts in real time."
}

# -------------------------------------------------------------
# Part 5: Masterclass Synthesis & Production Zero-Trust IAM Policy Engine
# -------------------------------------------------------------
p5_title = "Masterclass Synthesis: Zero-Trust IAM Policy Architecture & Identity SRE Runbook"
p5_say = [
    "To conclude Day 42, we synthesize the complete Zero-Trust Identity Architecture into an integrated, production-grade security framework. Over today's masterclass, we traversed the prevention of privilege escalation using IAM Permission Boundaries, eliminated policy explosion through Attribute-Based Access Control (ABAC), purged static long-term credentials via GitHub Actions OIDC workload federation, and automated human identity lifecycle governance using IAM Identity Center and SCIM.",
    "In production enterprise operations, maintaining Zero-Trust posture requires continuous identity telemetry and automated policy hygiene. Security operations teams deploy AWS IAM Access Analyzer across the organization. Access Analyzer uses mathematical automated reasoning (formal logic verification) to analyze resource-based policies and IAM role trust policies, proving definitively whether any resource is accessible from outside the AWS organization or by unintended external identities.",
    "Furthermore, platform teams integrate IAM Access Analyzer policy validation into CI/CD pipelines using the AWS CLI command `aws accessanalyzer validate-policy`. When developers author CloudFormation or Terraform IAM policy documents, the automated pull request test suite executes formal logic checks to detect security warnings, syntax errors, and overly permissive statements (such as granting `iam:PassRole` without resource constraints) before policies can be merged into the infrastructure codebase.",
    "Another critical operational practice is Automated Credential Hygiene. For legacy applications that have not yet migrated to OIDC federation or IAM roles for service accounts (IRSA), platform teams enforce strict credential age monitoring. CloudWatch Alarms combined with AWS Config rules alert security teams whenever an IAM access key exceeds 90 days of age. Automated Systems Manager runbooks deactivate stale access keys that have had no recorded activity for 30 days, shrinking the organization's dormant attack surface.",
    "Zero-Trust session governance also enforces Session Duration and Re-Authentication Guardrails. Workload federation roles assumed via OIDC are configured with short maximum session durations (`sts:DurationSeconds` capped at 15 to 60 minutes). For human operators accessing sensitive production accounts via IAM Identity Center, session durations are limited to 4 hours with mandatory MFA re-authentication for privileged actions, preventing session hijacking from abandoned developer laptops.",
    "To ensure continuous posture compliance and detect sophisticated identity attacks in flight, SRE and security operations teams deploy AWS IAM Access Analyzer alongside Amazon GuardDuty and Amazon Detective. GuardDuty uses machine learning algorithms trained on VPC flow logs, DNS queries, and CloudTrail management events to identify anomalous credential behaviors—such as `CredentialAccess:IAMUser/AnomalousBehavior` or unexpected console logins following session token hijacking. Automated EventBridge rules intercept high-severity GuardDuty findings, instantly invoking an AWS Step Functions state machine that revokes all active STS sessions for the compromised role and disables the user's Okta profile within five seconds.",
    "Finally, Site Reliability Engineering (SRE) teams establish comprehensive CloudTrail Lake audit queries and Amazon GuardDuty anomaly detectors. GuardDuty continuously analyzes AWS CloudTrail management events using machine learning models to detect credential compromise: alerting when credentials are used from an unusual IP address or anonymous proxy (`UnauthorizedAccess:IAMUser/TorIPCaller`), detecting impossible travel logins, and flagging credential exfiltration attempts in real time.",
    "In the accompanying verified implementation, we execute the 'ZeroTrustIdentityEngine' simulator. This deterministic harness evaluates the complete zero-trust identity topology: verifying that long-term static keys have been eliminated in favor of OIDC ephemeral tokens, proving high ABAC tag coverage across cloud resources, asserting permission boundary enforcement on delegated roles, and validating high-throughput short-lived session issuance. Run this verified harness to complete your mastery of advanced IAM and zero-trust identity architectures on AWS!"
]

p5_code = """// Part 5: ⭐ Masterclass Synthesis: Zero-Trust Identity & ABAC Pipeline Simulator
interface IdentityGovernanceAudit {
  totalPrincipals: number;
  staticAccessKeysEliminated: number;
  abacTagCoveragePercent: number;
  permissionBoundariesActive: boolean;
  oidcShortLivedSessionsDaily: number;
}

class ZeroTrustIdentityEngine {
  private audit: IdentityGovernanceAudit;

  constructor(audit: IdentityGovernanceAudit) {
    this.audit = audit;
  }

  verifyCompliance(): string {
    const isZeroTrustCompliant = this.audit.staticAccessKeysEliminated >= 500 &&
                                 this.audit.abacTagCoveragePercent >= 98 &&
                                 this.audit.permissionBoundariesActive &&
                                 this.audit.oidcShortLivedSessionsDaily >= 10000;

    return `ZERO_TRUST_IAM_AUDIT: StaticKeysPurged=${this.audit.staticAccessKeysEliminated} ABACCoverage=${this.audit.abacTagCoveragePercent}% DailyOIDCSessions=${this.audit.oidcShortLivedSessionsDaily} Status=${isZeroTrustCompliant ? 'ENTERPRISE_IDENTITY_PASS' : 'FAIL'}`;
  }
}

const engine = new ZeroTrustIdentityEngine({
  totalPrincipals: 1250,
  staticAccessKeysEliminated: 540,
  abacTagCoveragePercent: 99.4,
  permissionBoundariesActive: true,
  oidcShortLivedSessionsDaily: 14500,
});

console.log(engine.verifyCompliance());"""

p5_output = """ZERO_TRUST_IAM_AUDIT: StaticKeysPurged=540 ABACCoverage=99.4% DailyOIDCSessions=14500 Status=ENTERPRISE_IDENTITY_PASS"""

p5_check = {
    "question": "A Chief Information Security Officer (CISO) mandates a Zero-Trust identity architecture across an enterprise cloud estate. What three core pillars must be implemented to satisfy this mandate?",
    "options": [
        "Eliminate long-term static access keys using OIDC/IAM federation, enforce IAM Permission Boundaries on delegated role creation, and scale authorization dynamically using Attribute-Based Access Control (ABAC).",
        "Give all developers static access keys with 5-year expiration dates and disable CloudTrail logging.",
        "Store all user passwords in a plaintext DynamoDB table with open public read access.",
        "Require all microservices to run under the AWS account root user to avoid permission errors."
    ],
    "answer": 0,
    "explanation": "A mature Zero-Trust IAM architecture replaces static long-term access keys with short-lived ephemeral tokens issued via OIDC/IAM federation, prevents privilege escalation through Permission Boundaries, and achieves infinite policy scalability through tag-based ABAC."
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

print(f"Total Day 42 word count: {total_words} (Target >= 3000)")
if total_words < 3000:
    print(f"ERROR: Total word count {total_words} < 3000 words!")
    sys.exit(1)

# -------------------------------------------------------------
# Build LongLesson Data Object
# -------------------------------------------------------------
day42_lesson = {
    "day": 42,
    "coursePrefix": "cloud",
    "title": "Advanced IAM & Zero Trust: Permission Boundaries, Attribute-Based Access Control (ABAC) & OIDC Identity Federation",
    "goal": "Eliminate static credentials and scalable policy sprawl: master IAM Permission Boundaries, Attribute-Based Access Control (ABAC) using resource/principal tags, and OpenID Connect (OIDC) identity federation with GitHub Actions and Okta.",
    "minutes": 30,
    "recap": "Today we master Advanced IAM and Zero-Trust Identity. We explore delegated administration without privilege escalation via Permission Boundaries, dynamic tag-based authorization with ABAC, eliminating static credentials using GitHub Actions OIDC federation, enterprise single sign-on with IAM Identity Center and SCIM, and automated identity governance with IAM Access Analyzer.",
    "summary": [
        "IAM Permission Boundaries set the absolute maximum permissions ceiling for delegated roles, mathematically preventing privilege escalation.",
        "Attribute-Based Access Control (ABAC) matches principal tags with resource tags, enabling infinite authorization scalability without policy sprawl.",
        "OIDC Workload Identity Federation exchanges signed JWTs for short-lived STS credentials, completely eliminating static long-term access keys.",
        "IAM Identity Center synchronizes human identities via SAML 2.0 and SCIM, automating real-time provisioning and instantaneous access revocation."
    ],
    "parts": []
}

for i in range(5):
    day42_lesson["parts"].append({
        "title": parts_title[i],
        "say": parts_say[i],
        "code": parts_code[i],
        "output": parts_output[i],
        "codeNotes": [
            {"line": 2, "note": f"Defines structural interfaces and identity parameters for Part {i+1} mechanics."},
            {"line": 10, "note": f"Executes deterministic verification of zero-trust identity and authorization bounds."},
            {"line": 20, "note": f"Validates privilege escalation prevention, ABAC matching, and ephemeral session rules."}
        ],
        "tryIt": "Modify the tag values, role permissions, or branch claims to observe authorization decisions and boundary enforcement results.",
        "check": parts_check[i]
    })

# Write to scripts/day42_cloud.json
with open('scripts/day42_cloud.json', 'w', encoding='utf-8') as f:
    json.dump(day42_lesson, f, indent=2)

print("Saved scripts/day42_cloud.json successfully.")

# -------------------------------------------------------------
# Build Visual Envelope day-42.json
# -------------------------------------------------------------
visual_envelope = {
    "schemaVersion": 2,
    "prefix": "cloud",
    "day": 42,
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
                    {"id": "principal", "label": "Identity / OIDC Runner", "status": "active"},
                    {"id": "sts_gateway", "label": "AWS STS / Identity Center", "status": "active"},
                    {"id": "boundary_abac", "label": "Boundary & ABAC Tag Filter", "status": "active"},
                    {"id": "target_resource", "label": "Target Cloud Resource", "status": "active"}
                ],
                "edges": [
                    {"from": "principal", "to": "sts_gateway", "label": "Assume Role With Token"},
                    {"from": "sts_gateway", "to": "boundary_abac", "label": "Evaluate Boundary & Tags"},
                    {"from": "boundary_abac", "to": "target_resource", "label": "Authorize Ephemeral Session"}
                ]
            },
            "steps": [
                {
                    "at": "say1",
                    "focus": "principal",
                    "annotation": "Principals and CI/CD runners request dynamic access using short-lived tokens without static keys."
                },
                {
                    "at": "say2",
                    "focus": "sts_gateway",
                    "annotation": "AWS STS and IAM Identity Center validate cryptographic claims and trust policies at the edge."
                },
                {
                    "at": "example",
                    "focus": "boundary_abac",
                    "annotation": "Permission boundaries block privilege escalation while ABAC matches principal and resource tags."
                },
                {
                    "at": "tryIt",
                    "focus": "target_resource",
                    "annotation": "Target AWS resources allow access only when boundary and tag conditions are mathematically satisfied."
                }
            ]
        }
    }
    visual_envelope["entries"].append(entry)

with open('src/lib/data/lessonVisuals/cloud/day-42.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print("Saved src/lib/data/lessonVisuals/cloud/day-42.json successfully.")
'''

with open('scripts/build_day42_cloud.py', 'w', encoding='utf-8') as f:
    f.write(enriched_script)
print("Updated scripts/build_day42_cloud.py")
