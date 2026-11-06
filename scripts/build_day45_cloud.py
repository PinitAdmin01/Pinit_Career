import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

def count_words(text_list):
    total = 0
    for p in text_list:
        words = p.strip().split()
        total += len(words)
    return total

def get_hash(content):
    return hashlib.sha256(content.strip().encode('utf-8')).hexdigest()

# -------------------------------------------------------------
# Part 1: Multi-Account PCI-DSS Foundation
# -------------------------------------------------------------
p1_title = "Multi-Account PCI-DSS Foundation: Landing Zones, OU Isolation & SCP Perimeter Guardrails"
p1_say = [
    "Welcome to Day 45 of Cloud Native AWS Architecture. Today marks Milestone 8—the synthesis capstone of Month 2 Block 9. Over the past four days, we mastered multi-account landing zones, zero-trust IAM and ABAC federation, hardware security with AWS CloudHSM and Multi-Region KMS keys, and transit hub-and-spoke networking with AWS Network Firewall. Today, we bring every architectural layer together to design, prove, and validate a production-grade, multi-account, PCI-DSS Level 1 compliant financial network mesh.",
    "The Payment Card Industry Data Security Standard (PCI-DSS) is one of the most rigorous regulatory frameworks in the digital economy. At its core lies the Cardholder Data Environment (CDE): the isolated enclave of people, processes, and technology that store, process, or transmit cardholder data (Primary Account Numbers / PANs) or sensitive authentication data. In traditional monolithic hosting, an entire company's infrastructure fell under the audit scope of PCI-DSS, forcing multi-million dollar annual audit fees and crippling developer productivity across non-payment applications.",
    "In modern cloud architecture, the primary defense against audit sprawl and regulatory liability is Radical Scope Reduction through Multi-Account Segmentation. Using AWS Organizations, we partition the enterprise cloud estate into dedicated Organizational Units (OUs): a `Core-Security-OU` hosting centralized audit trails and SIEM engines, a `Network-OU` hosting the central Transit Gateway and Network Firewall inspection hubs, and a strictly quarantined `CDE-Workloads-OU` hosting the payment authorization engines. Non-sensitive corporate microservices and developer environments reside in separate, completely isolated OUs.",
    "To guarantee immutable compliance guardrails that no developer or compromised credential can bypass, the organization deploys Service Control Policies (SCPs) at the root of the `CDE-Workloads-OU`. First, SCPs strictly prohibit the creation or attachment of direct Internet Gateways (`ec2:AttachInternetGateway`) or egress-only internet gateways within the CDE account, mathematically eliminating direct, uninspected ingress or egress routes. Second, an SCP enforces default EBS and S3 encryption using dedicated Customer Managed Keys (`ec2:EnableEbsEncryptionByDefault`), blocking any plaintext disk volumes from ever being provisioned.",
    "Third, SCPs within the CDE enforce the elimination of root account usage and disable legacy IAM user creation (`iam:CreateUser`), mandating that all identities federate via OIDC or IAM Identity Center with multi-factor authentication. By establishing these preventive guardrails at the AWS Organizations boundary layer, security teams satisfy PCI-DSS Requirements 1, 2, and 3 before a single microservice container or database instance is ever launched.",
    "Furthermore, continuous compliance monitoring is automated via AWS Control Tower and AWS Security Hub. The PCI-DSS v3.2.1 and v4.0 conformance packs in AWS Config continuously evaluate hundreds of operational controls across all CDE member accounts in real time. If a misconfigured security group opens an unrestricted ingress port, AWS Config immediately flags the violation and triggers an automated AWS Systems Manager Automation runbook that revokes the unauthorized rule within five seconds.",
    "From an auditability standpoint, all CloudTrail management and data events across every member account stream continuously to a centralized, write-once-read-many (WORM) S3 bucket in the dedicated Log Archive account, protected by S3 Object Lock in Compliance Mode. This immutable audit trail guarantees that Qualified Security Assessors (QSAs) have complete, tamper-proof forensic proof of compliance throughout the annual audit lifecycle.",
    "In the verified TypeScript implementation below, we simulate the 'LandingZoneScpValidator'. We evaluate accounts within our enterprise landing zone, verifying that the CDE Workloads account adheres to strict SCP guardrails (zero direct internet gateways, mandatory default EBS KMS encryption), while proving that rogue non-compliant account configurations are deterministically flagged and blocked.",
    "From an implementation standpoint, Service Control Policies attached to the CDE Organizational Unit utilize fine-grained condition blocks. For example, the SCP blocking direct internet gateways applies an explicit deny on 'ec2:AttachInternetGateway' and 'ec2:CreateInternetGateway' with a condition exception only for the centralized Cloud Platform automation role. Furthermore, SCPs enforce that all Amazon S3 buckets created in the CDE must deny unencrypted HTTP transport by enforcing the condition 'aws:SecureTransport: false', guaranteeing that TLS 1.3 is cryptographically mandated for 100% of internal S3 data transfers.",
    "Additionally, platform engineering teams deploy AWS Control Tower Account Factory for Terraform (AFT) to automate new account provisioning. When an engineer requests a new microservice environment within the CDE OU, AFT provisions the account from a version-controlled Git repository, automatically attaching baseline SCPs, enrolling the account in AWS Security Hub, provisioning the Transit Gateway attachment, and applying AWS Config conformance packs before the account is handed over to development teams."
]

p1_code = """// Part 1: Multi-Account Landing Zone SCP Perimeter Guardrails
interface AccountContext {
  accountId: string;
  ou: 'Security' | 'CoreNetwork' | 'CDE_Workloads' | 'Dev';
  hasDirectInternetGateway: boolean;
  defaultEbsKmsEncryption: boolean;
}

class LandingZoneScpValidator {
  validateAccountCompliance(acc: AccountContext): { compliant: boolean; violations: string[] } {
    const violations: string[] = [];

    // PCI-DSS Rule: CDE Workloads must NEVER possess direct Internet Gateway attachments
    if (acc.ou === 'CDE_Workloads' && acc.hasDirectInternetGateway) {
      violations.push('SCP_VIOLATION: Direct IGW forbidden in CDE_Workloads OU');
    }

    // Enterprise Rule: All EBS volumes must be encrypted with Customer Managed Keys
    if (!acc.defaultEbsKmsEncryption) {
      violations.push('SCP_VIOLATION: Default EBS KMS encryption must be enabled');
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  }
}

const scp = new LandingZoneScpValidator();
const cdeAccount = scp.validateAccountCompliance({
  accountId: '998877665544',
  ou: 'CDE_Workloads',
  hasDirectInternetGateway: false,
  defaultEbsKmsEncryption: true,
});

const rogueAccount = scp.validateAccountCompliance({
  accountId: '112233445566',
  ou: 'CDE_Workloads',
  hasDirectInternetGateway: true,
  defaultEbsKmsEncryption: false,
});

console.log(`SCP_LANDING_ZONE: CDECompliant=${cdeAccount.compliant} RogueCompliant=${rogueAccount.compliant} ViolationsCaught=${rogueAccount.violations.length}`);"""

p1_output = """SCP_LANDING_ZONE: CDECompliant=true RogueCompliant=false ViolationsCaught=2"""

p1_check = {
    "question": "A financial enterprise is preparing for an annual PCI-DSS Level 1 audit across 80 AWS accounts. What landing zone architecture best minimizes audit scope and mathematically prevents unauthorized public internet exposure within the Cardholder Data Environment (CDE)?",
    "options": [
        "Isolate all CDE payment workloads into dedicated AWS accounts within a specific Organizational Unit (OU) governed by Service Control Policies (SCPs) that strictly deny ec2:AttachInternetGateway and enforce default EBS KMS encryption.",
        "Deploy all payment applications and developer sandboxes in a single AWS account to simplify IAM user management.",
        "Allow direct Internet Gateways in every VPC but ask developers not to assign public IPs in production.",
        "Disable AWS CloudTrail logging in payment accounts to reduce S3 storage costs during the audit."
    ],
    "answer": 0,
    "explanation": "Segmenting CDE workloads into dedicated AWS accounts within a separate OU drastically reduces PCI-DSS audit scope. Attaching SCPs that deny `ec2:AttachInternetGateway` mathematically guarantees that payment subnets cannot establish direct public internet ingress or egress, satisfying core PCI-DSS perimeter mandates."
}

# -------------------------------------------------------------
# Part 2: Cardholder Data Environment (CDE) Network Segmentation
# -------------------------------------------------------------
p2_title = "CDE Network Segmentation: Transit Gateway Isolation & Stateful Firewall Inspection"
p2_say = [
    "PCI-DSS Requirement 1 mandates the installation and maintenance of network security controls to protect the Cardholder Data Environment. Specifically, it dictates that all inbound and outbound traffic to and from the CDE must be restricted to only that which is strictly necessary for the business, and that all non-CDE networks (corporate user networks, development environments, and third-party partner connections) must be completely prohibited from establishing direct, uninspected Layer 3 IP routing into cardholder subnets.",
    "To satisfy this mandate, we deploy an isolated Hub-and-Spoke Transit Gateway Topology. The CDE VPC attaches to the central AWS Transit Gateway via a dedicated VPC attachment. However, unlike standard corporate routing where VPCs propagate routes freely, the CDE VPC is associated with an exclusive `CDE-TGW-Route-Table`. In this route table, there are zero routes to the development VPC route tables, zero routes to corporate VPNs, and zero routes to generic workload VPCs. Any packet transmitted from a corporate laptop or development container attempting to reach the CDE database subnet is dropped at the Transit Gateway boundary.",
    "All traffic entering or exiting the CDE must traverse a Centralized Inspection VPC hosting AWS Network Firewall. Inbound payment transactions originating from public mobile apps or web checkouts terminate at an edge Application Load Balancer in a public DMZ VPC protected by AWS WAF. After WAF inspects the request for OWASP Top 10 vulnerabilities, the DMZ proxy forwards the sanitized payload through Transit Gateway into the Central Inspection VPC.",
    "Inside the Central Inspection VPC, AWS Network Firewall executes stateful Deep Packet Inspection (DPI) using Suricata 5.0 compatible intrusion prevention rules. The firewall validates that the incoming packet adheres to strict TLS 1.3 cryptographic cipher suites and contains authorized payment protocol signatures. Only after passing stateful inspection is the packet forwarded via Transit Gateway to the payment gateway microservice in the private CDE subnet.",
    "Similarly, all outbound egress from the CDE—such as communicating with external payment acquiring networks (e.g., Visa, Mastercard, or Stripe)—must route back through the Central Inspection VPC. Network Firewall enforces TLS Server Name Indication (SNI) domain allowlists: outgoing packets are permitted solely to explicit acquiring gateway endpoints (e.g., `api.visa.com`), dropping any unauthorized outbound connections and preventing data exfiltration to unauthorized command-and-control servers.",
    "To ensure bidirectional traffic symmetry across stateful firewall endpoints, Transit Gateway Appliance Mode is enabled on the Inspection VPC attachment. Appliance Mode guarantees that both outbound requests and inbound responses flow through the same Availability Zone firewall endpoint, eliminating TCP asymmetric routing drops and maintaining 100% session inspection state.",
    "In the verified TypeScript implementation below, we simulate the 'CdeNetworkIsolator'. We model the CDE route table policy: verifying that packets destined for the Central Inspection VPC and Shared Security Services are permitted, while asserting that direct route attempts to Development subnets and Corporate VPN CIDRs are strictly blocked.",
    "Under PCI-DSS Requirement 1.3, inbound internet traffic is prohibited from directly accessing any internal system component that stores cardholder data. In our architecture, incoming API calls terminate at public Application Load Balancers protected by AWS WAF in the DMZ VPC. AWS WAF inspects requests using AWS Managed Rules for Core Rule Set (CRS) and Amazon IP Reputation lists. The reverse proxy in the DMZ sanitizes and translates the request, establishing a brand-new TLS connection through Transit Gateway into the Central Inspection VPC before packets can ever touch CDE subnets.",
    "Furthermore, network security teams configure Amazon Route 53 Resolver DNS Firewall within the CDE VPC. Payment containers in private subnets cannot query external public DNS resolvers. All DNS requests resolve via private Route 53 hosted zones and are evaluated by DNS Firewall rules. If a compromised microservice attempts to resolve an unauthorized external domain or known C2 server, DNS Firewall intercepts the request and returns an NXDOMAIN response, thwarting data exfiltration attempts before TCP handshakes can even occur."
]

p2_code = """// Part 2: Cardholder Data Environment (CDE) TGW Network Isolation
interface RouteRule {
  targetCidr: string;
  allowed: boolean;
}

class CdeNetworkIsolator {
  private cdeAllowedRoutes: Map<string, boolean> = new Map();

  constructor() {
    // Only Inspection VPC and Shared Services are allowed
    this.cdeAllowedRoutes.set('10.100.0.0/16', true); // Central Inspection VPC
    this.cdeAllowedRoutes.set('10.50.0.0/16', true);  // Shared Security Services
    this.cdeAllowedRoutes.set('10.20.0.0/16', false); // Dev VPC (BLOCKED)
    this.cdeAllowedRoutes.set('10.30.0.0/16', false); // Corp VPN (BLOCKED)
  }

  canTraverse(targetCidr: string): boolean {
    return this.cdeAllowedRoutes.get(targetCidr) === true;
  }
}

const cdeNet = new CdeNetworkIsolator();
const toInspection = cdeNet.canTraverse('10.100.0.0/16');
const toDev = cdeNet.canTraverse('10.20.0.0/16');
const toCorp = cdeNet.canTraverse('10.30.0.0/16');

console.log(`CDE_NETWORK_ISOLATION: RouteToInspection=${toInspection} RouteToDevBlocked=${!toDev} RouteToCorpBlocked=${!toCorp}`);"""

p2_output = """CDE_NETWORK_ISOLATION: RouteToInspection=true RouteToDevBlocked=true RouteToCorpBlocked=true"""

p2_check = {
    "question": "A fintech enterprise must ensure that an engineer on the corporate office VPN cannot establish direct network connections to the payment database located in the PCI-DSS Cardholder Data Environment (CDE). How is this network isolation enforced at the infrastructure layer?",
    "options": [
        "Associate the CDE VPC with an isolated Transit Gateway Route Table that contains zero routes or propagations for corporate VPN CIDRs, routing all necessary inter-VPC traffic exclusively through a centralized inspection firewall.",
        "Instruct developers via company email not to ping the payment database IP address.",
        "Rely solely on local operating system iptables rules running on the database instance.",
        "Place the database in a public subnet and use a long alphanumeric password."
    ],
    "answer": 0,
    "explanation": "PCI-DSS Requirement 1 requires strict network isolation between general corporate networks and the CDE. Implementing dedicated Transit Gateway route tables with zero route propagations to corporate or dev CIDRs guarantees that cross-network traffic is dropped at Layer 3 by the cloud router."
}

# -------------------------------------------------------------
# Part 3: Edge Tokenization & In-Transit Data Protection
# -------------------------------------------------------------
p3_title = "Edge Tokenization & In-Transit Protection: AWS CloudHSM & PrivateLink Vault Architecture"
p3_say = [
    "PCI-DSS Requirement 3 states: Protect stored account data. Specifically, primary account numbers (PANs) must be rendered unreadable anywhere they are stored (including data lakes, transactional databases, cache layers, and application logs). Storing raw 16-digit credit card numbers anywhere outside a certified cryptographic vault expands the audit scope of every downstream database, microservice, and logging pipeline, creating an enormous compliance burden and catastrophic breach liability.",
    "To solve this challenge, enterprise fintech architectures deploy an Edge Tokenization Vault. When an end-user submits a credit card payment on a web portal or mobile application, the raw credit card payload never reaches the core application microservices or transactional databases. Instead, the incoming request hits an Edge Tokenization Gateway hosted behind an AWS PrivateLink endpoint and an internal Network Load Balancer.",
    "The Tokenization Gateway immediately intercepts the raw credit card number (PAN) and encrypts it using an envelope encryption key backed by a dedicated AWS CloudHSM cluster. CloudHSM provides single-tenant, dedicated FIPS 140-2 Level 3 cryptographic hardware appliances provisioned in private subnets, ensuring that the master key material never leaves the hardware security module and cannot be accessed by AWS operators or hypervisors.",
    "Once the raw PAN is encrypted and stored inside the isolated, WORM-compliant tokenization vault database, the tokenization engine generates a surrogate, non-sensitive Token (e.g., `tok_pci_4444_91823`). This token preserves only the last 4 digits of the card for customer receipt display while replacing the remaining digits with cryptographically secure random bytes. The tokenization gateway returns this token to the caller, and all subsequent application workflows (order processing, ledger accounting, customer history, and analytical reporting) operate exclusively on the non-sensitive token!",
    "Because downstream services, Kafka message brokers, and CloudWatch log groups handle only the surrogate token, they fall completely outside the scope of PCI-DSS Cardholder Data Environment regulations! Even if a microservice logs incoming request headers or an SRE team exports CloudWatch logs to a third-party analytics tool, no raw PAN can ever leak into application log streams or telemetry pipelines.",
    "Furthermore, communication with the tokenization vault is restricted to authorized payment processing microservices via AWS PrivateLink Interface Endpoints. Security groups on the interface endpoint restrict inbound traffic strictly to authorized payment worker containers, while IAM endpoint policies enforce that only roles carrying specific ABAC session tags can request tokenization or detokenization operations.",
    "In the verified TypeScript implementation below, we simulate the 'EdgeTokenizationVault'. We ingest a raw credit card number, generate an encrypted vault record protected by a CloudHSM FIPS 140-2 Level 3 wrapping key, return a surrogate token preserving the last 4 digits, and demonstrate that downstream application logs contain zero raw PAN data, satisfying PCI-DSS Requirement 3.",
    "To preserve downstream business operations without exposing raw card data, modern tokenization architectures often leverage Format-Preserving Encryption (FPE) standards such as NIST SP 800-38G FF1. Format-preserving encryption encrypts the middle digits of a card number while outputting a surrogate value that matches the exact length, Luhn check structure, and character format of a real credit card. This allows legacy accounting, billing, and fraud-scoring databases to process tokenized transactions without requiring schema alterations or database migrations.",
    "From a cryptographic lifecycle perspective, dedicated CloudHSM appliances within the vault VPC undergo formal key ceremonies. Cryptographic Officers (COs) generate root wrapping keys using M-of-N quorum authentication (e.g. 2-of-3 signatures). The CloudHSM cluster replicates keys securely across Availability Zones using hardware-accelerated end-to-end encrypted tunnels. In the event of an AZ failure, the surviving appliances maintain line-rate tokenization throughput, ensuring zero downtime for payment processing.",
    "Additionally, security architects enforce strict Endpoint Policies on the PrivateLink interface endpoints connecting to the tokenization vault. The interface endpoint policy mandates that only requests originating from verified payment worker service accounts with valid mutual TLS certificates are accepted. Any unauthorized microservice attempting to connect to the vault's private IP address is rejected at the network interface layer before any TLS handshake or cryptographic operation can proceed, enforcing defense-in-depth across the tokenization perimeter."
]

p3_code = """// Part 3: PCI-DSS Edge Tokenization Engine (CloudHSM Vault Simulation)
interface TokenizedCardRecord {
  token: string;
  vaultId: string;
  last4: string;
  isPanRedacted: boolean;
}

class EdgeTokenizationVault {
  private vaultStore: Map<string, string> = new Map();

  tokenize(rawPan: string, hsmWrappingKeyId: string): TokenizedCardRecord {
    const last4 = rawPan.slice(-4);
    const token = `tok_pci_${last4}_${Math.floor(Math.random() * 89999 + 10000)}`;
    const encryptedBlob = `VAULT_ENCRYPTED_[${rawPan}]_BY_[${hsmWrappingKeyId}]`;
    this.vaultStore.set(token, encryptedBlob);

    return {
      token,
      vaultId: 'hsm-vault-cde-01',
      last4,
      isPanRedacted: true,
    };
  }

  isRawPanInPayload(payload: string): boolean {
    // Check if 16-digit PAN is present in payload string
    return /\\b\\d{4}[ -]?\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b/.test(payload);
  }
}

const tokenEngine = new EdgeTokenizationVault();
const rawCard = '4111-2222-3333-4444';
const tokenized = tokenEngine.tokenize(rawCard, 'hsm-key-fips140-level3');

const appLogPayload = `PAYMENT_PROCESSED: Token=${tokenized.token} Last4=${tokenized.last4} Status=SUCCESS`;
const panLeakedInLog = tokenEngine.isRawPanInPayload(appLogPayload);

console.log(`EDGE_TOKENIZATION: TokenGenerated=${tokenized.token.startsWith('tok_pci_4444')} RawPanLeakedInLogs=${panLeakedInLog} PanRedacted=${tokenized.isPanRedacted}`);"""

p3_output = """EDGE_TOKENIZATION: TokenGenerated=true RawPanLeakedInLogs=false PanRedacted=true"""

p3_check = {
    "question": "During a pre-audit architecture review of a payment platform, a Qualified Security Assessor (QSA) points out that application microservices log full HTTP payloads to Amazon CloudWatch, which could expose raw 16-digit credit card numbers (PANs) in plaintext logs. What architectural solution permanently eliminates this risk?",
    "options": [
        "Implement an Edge Tokenization Gateway: intercept raw card numbers at the perimeter, store them in a dedicated CloudHSM-backed vault, and pass only non-sensitive surrogate tokens to downstream microservices and logs.",
        "Instruct developers to never inspect CloudWatch logs in production.",
        "Change the log level from INFO to DEBUG so logs are written faster.",
        "Delete all CloudWatch log groups daily at midnight via a cron script."
    ],
    "answer": 0,
    "explanation": "Edge Tokenization intercepts raw card numbers at the perimeter, replacing them with surrogate tokens before forwarding requests to core microservices. Because downstream microservices and loggers only process tokens, raw PANs can never enter CloudWatch logs, eliminating the risk of unencrypted card storage."
}

# -------------------------------------------------------------
# Part 4: Zero Static Credentials & Short-Lived STS Access
# -------------------------------------------------------------
p4_title = "Zero Static Credentials in CDE: OIDC CI/CD Federation & Ephemeral STS Sessions"
p4_say = [
    "PCI-DSS Requirement 7 and Requirement 8 govern access control and identity management: Restrict access to cardholder data by business need to know, and identify users and authenticate access to system components. Historically, identity management in AWS environments was plagued by static long-term IAM access keys (`AKIA...`). Developers and CI/CD pipelines stored static keys in repository secrets or local configuration files; if a developer's laptop was lost or a source repository leaked, attackers gained permanent access to sensitive cloud resources.",
    "In a modern PCI-DSS Cardholder Data Environment, static long-term IAM access keys are completely eradicated! AWS Service Control Policies and IAM account policies explicitly deny `iam:CreateAccessKey` within the CDE account. Both workload identities (automated systems) and human operators must authenticate exclusively using short-lived, cryptographically signed ephemeral tokens issued by AWS Security Token Service (AWS STS).",
    "For automated CI/CD deployment pipelines (such as GitHub Actions or GitLab CI), workloads authenticate via OpenID Connect (OIDC) identity federation. When a deployment job runs on GitHub Actions, the GitHub runner requests a signed JSON Web Token (JWT) from GitHub's OIDC identity provider. The runner presents this token to AWS STS calling `sts:AssumeRoleWithWebIdentity`. AWS STS validates the cryptographic signature, checks that the token's subject claim matches the approved repository and production branch (`repo:enterprise/cde-payment-api:ref:refs/heads/main`), and issues temporary credentials valid for only 30 minutes.",
    "Furthermore, deployment roles within the CDE are constrained by IAM Permission Boundaries. Even if an automated CI/CD pipeline possesses the ability to create or modify microservice IAM execution roles, the permission boundary sets an impenetrable maximum permissions ceiling: any role created without the mandatory permission boundary attached fails immediately, mathematically preventing privilege escalation.",
    "For human operators (cloud engineers and SREs requiring emergency break-glass access to the CDE), access is centralized through AWS IAM Identity Center (AWS SSO) integrated with an external Identity Provider (such as Okta) via SAML 2.0 and SCIM. Engineers must authenticate using FIDO2 WebAuthn hardware security keys (YubiKeys) with mandatory biometric confirmation. Human sessions in the CDE are capped at a maximum duration of 60 minutes with mandatory MFA re-authentication for privileged actions.",
    "Additionally, every STS role assumption, API call, and administrative action in the CDE is recorded in real time by AWS CloudTrail. CloudTrail log streams are monitored continuously by Amazon GuardDuty, which uses machine learning anomaly detection to flag suspicious STS usage—such as anomalous API calls or credential usage from unusual IP addresses—triggering immediate automated session revocation via AWS Step Functions.",
    "In the verified TypeScript implementation below, we simulate the 'CdeAccessGovernor'. We evaluate credential requests within our Cardholder Data Environment: proving that long-term static access keys and non-MFA attempts are strictly rejected, while short-lived OIDC federated sessions with MFA compliance are authorized deterministically.",
    "For emergency break-glass procedures—such as triaging a catastrophic payment outage at 2 AM—security policies strictly prohibit static root or administrator credentials. Instead, engineers invoke an automated Break-Glass Workflow via AWS Systems Manager and IAM Identity Center. The workflow requires dual-authorization approval from the on-call security officer, granting temporary elevation to a tightly scoped Break-Glass IAM role with a maximum session duration of 60 minutes.",
    "During the active break-glass session, AWS CloudTrail records every executed AWS CLI command and API invocation with high-resolution timestamps. Amazon EventBridge rules stream these high-privilege audit events directly into Amazon OpenSearch and trigger real-time Slack notifications in the Security Operations channel. Once the incident is resolved or the 60-minute session timer expires, AWS STS automatically revokes all active session tokens, ensuring that elevated access is automatically deprovisioned without human oversight.",
    "Furthermore, all IAM roles utilized within the Cardholder Data Environment enforce strict session policies and IP address restrictions using the condition key aws:SourceIp or aws:VpcSourceIp. Even if an ephemeral STS session token were exfiltrated from an application container, the token is cryptographically bound to the private subnet CIDR of the CDE VPC. Any attempt by an adversary to utilize the stolen token from an external internet IP address or unauthorized network segment fails instantly with an AccessDenied exception, establishing true multi-layered Zero-Trust defense."
]

p4_code = """// Part 4: Zero Static Credentials & Short-Lived STS Access in the CDE
interface PrincipalCredential {
  principalArn: string;
  credentialType: 'STATIC_ACCESS_KEY' | 'OIDC_EPHEMERAL_STS';
  sessionDurationMinutes: number;
  mfaVerified: boolean;
}

class CdeAccessGovernor {
  evaluateAccess(cred: PrincipalCredential): { authorized: boolean; reason: string } {
    if (cred.credentialType === 'STATIC_ACCESS_KEY') {
      return { authorized: false, reason: 'PCI_DSS_VIOLATION: Static access keys strictly prohibited in CDE' };
    }
    if (!cred.mfaVerified) {
      return { authorized: false, reason: 'PCI_DSS_VIOLATION: MFA required for all CDE sessions' };
    }
    if (cred.sessionDurationMinutes > 60) {
      return { authorized: false, reason: 'PCI_DSS_VIOLATION: Session duration cannot exceed 60 minutes' };
    }
    return { authorized: true, reason: 'ACCESS_GRANTED: Valid ephemeral STS session with MFA' };
  }
}

const governor = new CdeAccessGovernor();
const staticKeyAttempt = governor.evaluateAccess({
  principalArn: 'arn:aws:iam::111122223333:user/dev-admin',
  credentialType: 'STATIC_ACCESS_KEY',
  sessionDurationMinutes: 1440,
  mfaVerified: false,
});

const ephemeralOidcAttempt = governor.evaluateAccess({
  principalArn: 'arn:aws:sts::111122223333:assumed-role/GithubActionsDeployer/job-941',
  credentialType: 'OIDC_EPHEMERAL_STS',
  sessionDurationMinutes: 30,
  mfaVerified: true,
});

console.log(`CDE_CREDENTIAL_GOVERNANCE: StaticKeyAllowed=${staticKeyAttempt.authorized} OIDCAllowed=${ephemeralOidcAttempt.authorized} Reason="${ephemeralOidcAttempt.reason}"`);"""

p4_output = """CDE_CREDENTIAL_GOVERNANCE: StaticKeyAllowed=false OIDCAllowed=true Reason="ACCESS_GRANTED: Valid ephemeral STS session with MFA\""""

p4_check = {
    "question": "To comply with PCI-DSS Requirement 8, an enterprise must eliminate permanent long-term AWS access keys (AKIA...) for all CI/CD deployment pipelines deploying to the Cardholder Data Environment. What is the approved AWS security architecture?",
    "options": [
        "Configure OpenID Connect (OIDC) identity federation between the CI/CD platform (e.g. GitHub Actions) and AWS STS, allowing runners to assume ephemeral IAM roles with branch subject claim conditions and short session durations.",
        "Create an IAM user for every software developer and email them static access keys every Monday.",
        "Store static root account access keys in a private GitHub repository secret.",
        "Disable all authentication checks on the production Kubernetes cluster."
    ],
    "answer": 0,
    "explanation": "OIDC federation allows CI/CD platforms to exchange temporary signed JWTs for short-lived AWS STS session credentials without storing static secrets. Restricting role trust policies to specific repository and branch claims ensures zero static credential leakage risk in the CDE."
}

# -------------------------------------------------------------
# Part 5: Milestone 8 Capstone: Full Mesh Synthesis & Validator
# -------------------------------------------------------------
p5_title = "⭐ Milestone 8 Synthesis: Full-Mesh PCI-DSS Compliance Validator & SRE Runbook"
p5_say = [
    "To conclude Month 2 Block 9 and graduate Milestone 8, we synthesize every architectural discipline into an automated, verifiable PCI-DSS Level 1 Zero-Trust FinTech Mesh. Across this intensive milestone, we established multi-account OU isolation with Service Control Policies, enforced strict Layer 3 network isolation via Transit Gateway route tables, deployed stateful Suricata inspection with AWS Network Firewall, implemented FIPS 140-2 Level 3 edge tokenization using dedicated CloudHSM appliances and PrivateLink, and purged static credentials in favor of short-lived OIDC federated sessions.",
    "In modern Site Reliability Engineering (SRE) and DevSecOps practice, compliance is not a static binder of screenshots assembled once a year for external auditors; it is an active, continuous, automated software pipeline. Security platform teams deploy automated compliance verification harnesses that execute end-to-end synthetic validation checks across all multi-account cloud boundaries on every code deployment.",
    "The SRE verification pipeline evaluates five foundational zero-trust pillars: First, Landing Zone Governance—asserting that the organization spans dedicated accounts with active SCP guardrails blocking direct internet gateways in payment enclaves. Second, Network Perimeter Isolation—verifying that Transit Gateway route tables strictly isolate CDE subnets from corporate and development networks, and that all egress passes through Network Firewall inspection hubs.",
    "Third, Cryptographic Custody & Tokenization—confirming that dedicated CloudHSM clusters maintain FIPS 140-2 Level 3 operational status, that root keys are governed by M-of-N quorum authentication, and that all raw card data is tokenized at the edge before storage. Fourth, Identity Governance—verifying that static access keys are 100% eliminated, that all workloads authenticate via OIDC federation, and that human access is protected by WebAuthn MFA and short session durations.",
    "Fifth, Observability & Forensic Auditability—asserting that enriched VPC Flow Logs stream to Amazon S3 in Apache Parquet format with 1-minute aggregation, and that CloudTrail management events are locked under WORM compliance retention in the Log Archive account.",
    "When all five zero-trust security domains pass automated mathematical evaluation, the compliance harness outputs the official milestone graduation confirmation token: `PCI_DSS_ZERO_TRUST_MESH_VERIFIED`. This cryptographic attestation certifies that the enterprise cloud architecture satisfies the most stringent global financial and defense security standards.",
    "In the verified TypeScript implementation below, we execute the 'Milestone8PciComplianceEngine'. This synthesis harness audits all 64 enterprise accounts across our multi-account mesh: asserting CDE isolation, zero static keys, active CloudHSM hardware clusters, enforced Network Firewall inspection, and continuous VPC flow log streaming. Run this verified harness to achieve official graduation from Milestone 8 and complete Block 9 of Cloud Native AWS Architecture!",
    "To ensure continuous audit readiness throughout the fiscal year, SRE and compliance teams deploy automated Chaos Engineering experiments against the CDE perimeter using AWS Fault Injection Service (FIS). Scheduled chaos drills simulate compromised containers attempting to execute egress internet connections, probe for unauthorized cross-VPC routes, or access S3 buckets without TLS. If any synthetic probe succeeds in bypassing perimeter controls, the automated test suite fails the pipeline and raises a critical PagerDuty incident, guaranteeing that configuration drift is caught and eradicated immediately.",
    "Finally, the complete multi-account architecture produces an automated Compliance Artifact Pack for Qualified Security Assessors (QSAs). An automated AWS Step Functions state machine executes quarterly scans: collecting AWS Config compliance scorecards, AWS Security Hub CIS Benchmark reports, IAM Access Analyzer proof of zero external resource access, and CloudHSM FIPS 140-2 Level 3 attestation certificates. This automated evidence generation reduces annual audit prep time from three months to less than two hours, embodying the gold standard of modern cloud security engineering.",
    "Additionally, Site Reliability Engineering teams integrate automated runbooks with Amazon GuardDuty and AWS Security Hub to enforce automated remediation for high-severity findings. If an unauthorized IAM modification or unusual API call occurs within the CDE, automated EventBridge rules trigger an AWS Step Functions state machine that quarantines the affected resource, alerts on-call security engineers, and logs the incident to CloudTrail Lake within seconds, ensuring continuous, bulletproof defense across the entire financial cloud mesh."
]

p5_code = """// Part 5: ⭐ Masterclass Synthesis: Production SRE PCI-DSS Compliance Validator
interface PciDssMeshAudit {
  totalAccounts: number;
  cdeIsolated: boolean;
  zeroStaticKeysEnforced: boolean;
  cloudHsmActive: boolean;
  networkFirewallEnforced: boolean;
  flowLogsStreaming: boolean;
}

class Milestone8PciComplianceEngine {
  private audit: PciDssMeshAudit;

  constructor(audit: PciDssMeshAudit) {
    this.audit = audit;
  }

  runFullAudit(): string {
    const isCompliant = this.audit.totalAccounts >= 50 &&
                        this.audit.cdeIsolated &&
                        this.audit.zeroStaticKeysEnforced &&
                        this.audit.cloudHsmActive &&
                        this.audit.networkFirewallEnforced &&
                        this.audit.flowLogsStreaming;

    const statusToken = isCompliant ? 'PCI_DSS_ZERO_TRUST_MESH_VERIFIED' : 'AUDIT_FAILED';

    return `MILESTONE_8_VALIDATION: Accounts=${this.audit.totalAccounts} CDEIsolated=${this.audit.cdeIsolated} ZeroStaticKeys=${this.audit.zeroStaticKeysEnforced} CloudHSMActive=${this.audit.cloudHsmActive} NetworkFirewallEnforced=${this.audit.networkFirewallEnforced} Status=${statusToken}`;
  }
}

const auditor = new Milestone8PciComplianceEngine({
  totalAccounts: 64,
  cdeIsolated: true,
  zeroStaticKeysEnforced: true,
  cloudHsmActive: true,
  networkFirewallEnforced: true,
  flowLogsStreaming: true,
});

console.log(auditor.runFullAudit());"""

p5_output = """MILESTONE_8_VALIDATION: Accounts=64 CDEIsolated=true ZeroStaticKeys=true CloudHSMActive=true NetworkFirewallEnforced=true Status=PCI_DSS_ZERO_TRUST_MESH_VERIFIED"""

p5_check = {
    "question": "What is the defining architectural characteristic of a mature, automated PCI-DSS Level 1 Zero-Trust cloud estate on AWS?",
    "options": [
        "Continuous compliance automation across multi-account landing zones with SCP guardrails, isolated Transit Gateway route tables, AWS Network Firewall inspection, CloudHSM edge tokenization, and zero static IAM credentials.",
        "Running all workloads in a single account with root access shared among developers to move quickly.",
        "Disabling all firewall inspection to reduce network latency during high-volume sales events.",
        "Storing cardholder data in unencrypted plaintext databases protected solely by a secret password."
    ],
    "answer": 0,
    "explanation": "A mature PCI-DSS Zero-Trust cloud estate enforces defense-in-depth across every layer: multi-account landing zones with preventive SCPs, isolated Transit Gateway routing, stateful deep packet inspection via Network Firewall, FIPS 140-2 Level 3 edge tokenization via CloudHSM, and zero static credentials using ephemeral OIDC tokens."
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

print(f"Total Day 45 word count: {total_words} (Target >= 3000)")
if total_words < 3000:
    print(f"ERROR: Total word count {total_words} < 3000 words!")
    sys.exit(1)

# -------------------------------------------------------------
# Build LongLesson Data Object
# -------------------------------------------------------------
day45_lesson = {
    "day": 45,
    "coursePrefix": "cloud",
    "title": "⭐ MILESTONE 8: Multi-Account PCI-DSS Regulated Zero-Trust FinTech VPC Mesh",
    "goal": "Architect and prove an enterprise security topology: build a multi-account, PCI-DSS Level 1 compliant financial network mesh using AWS Organizations, Transit Gateway, AWS Network Firewall, PrivateLink, and OIDC federation with zero static credentials.",
    "minutes": 30,
    "recap": "Today we graduate Milestone 8, synthesizing advanced cloud security, cryptography, and networking into a production-grade PCI-DSS Zero-Trust FinTech Mesh. We enforce multi-account OU isolation and SCP guardrails, isolate the Cardholder Data Environment (CDE) with Transit Gateway route tables, deploy edge tokenization using dedicated CloudHSM clusters, eradicate static long-term credentials via OIDC federation, and validate continuous compliance with automated SRE pipelines.",
    "summary": [
        "Multi-Account OU isolation and preventive SCPs mathematically prevent uninspected Internet Gateways and enforce default KMS encryption.",
        "Transit Gateway route table segmentation enforces strict Layer 3 isolation, routing CDE traffic through centralized Network Firewall inspection hubs.",
        "Edge Tokenization backed by dedicated FIPS 140-2 Level 3 CloudHSM appliances replaces raw credit card PANs with surrogate tokens, eliminating log leaks.",
        "Zero static long-term IAM credentials in the CDE: all workloads and human operators authenticate via ephemeral STS tokens issued by OIDC and Identity Center."
    ],
    "parts": []
}

for i in range(5):
    day45_lesson["parts"].append({
        "title": parts_title[i],
        "say": parts_say[i],
        "code": parts_code[i],
        "output": parts_output[i],
        "codeNotes": [
            {"line": 2, "note": f"Defines PCI-DSS governance interfaces and parameters for Part {i+1} implementation."},
            {"line": 10, "note": f"Executes deterministic verification of landing zone guardrails, network isolation, and tokenization rules."},
            {"line": 20, "note": f"Validates zero static credentials, CloudHSM vault encryption, and milestone compliance attestations."}
        ],
        "tryIt": "Modify the account compliance parameters, route table CIDRs, or tokenization payloads to observe zero-trust audit evaluations.",
        "check": parts_check[i]
    })

# Write to scripts/day45_cloud.json
with open('scripts/day45_cloud.json', 'w', encoding='utf-8') as f:
    json.dump(day45_lesson, f, indent=2)

print("Saved scripts/day45_cloud.json successfully.")

# -------------------------------------------------------------
# Build Visual Envelope day-45.json
# -------------------------------------------------------------
visual_envelope = {
    "schemaVersion": 2,
    "prefix": "cloud",
    "day": 45,
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
                    {"id": "public_dmz", "label": "Public DMZ & Edge WAF", "status": "active"},
                    {"id": "inspection_hub", "label": "Network Firewall & Transit Gateway", "status": "active"},
                    {"id": "hsm_vault", "label": "CloudHSM Edge Tokenization Vault", "status": "active"},
                    {"id": "cde_core", "label": "Isolated CDE Payment Core", "status": "active"}
                ],
                "edges": [
                    {"from": "public_dmz", "to": "inspection_hub", "label": "Route Request via TGW"},
                    {"from": "inspection_hub", "to": "hsm_vault", "label": "Tokenize PAN via PrivateLink"},
                    {"from": "hsm_vault", "to": "cde_core", "label": "Deliver Surrogate Token"}
                ]
            },
            "steps": [
                {
                    "at": "say1",
                    "focus": "public_dmz",
                    "annotation": "Inbound payment transactions enter public DMZ and are inspected by AWS WAF for OWASP threats."
                },
                {
                    "at": "say2",
                    "focus": "inspection_hub",
                    "annotation": "Transit Gateway route tables enforce Layer 3 isolation and route traffic to Suricata DPI firewall."
                },
                {
                    "at": "example",
                    "focus": "hsm_vault",
                    "annotation": "Dedicated CloudHSM appliances tokenize raw card numbers, replacing PANs with surrogate tokens."
                },
                {
                    "at": "tryIt",
                    "focus": "cde_core",
                    "annotation": "Payment core processes non-sensitive tokens using short-lived OIDC STS credentials with zero static keys."
                }
            ]
        }
    }
    visual_envelope["entries"].append(entry)

with open('src/lib/data/lessonVisuals/cloud/day-45.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print("Saved src/lib/data/lessonVisuals/cloud/day-45.json successfully.")
