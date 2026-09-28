import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const CYBER_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Information Security Core: CIA Triad & STRIDE Threat Modeling",
    "desc": "Master the foundational pillars of enterprise security: The CIA Triad (Confidentiality, Integrity, Availability), The STRIDE Threat Modeling framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege), and Defense-in-Depth layered architecture.",
    "syllabus": [
      "The CIA Triad and quantitative security risk formula Risk = Threat x Vulnerability x Impact.",
      "The STRIDE threat categorization matrix and mitigation mapping.",
      "Building a multi-layered Defense-in-Depth security audit."
    ],
    "eTitle": "STRIDE Threat Vector Categorizer & Mitigation Engine",
    "eDesc": "Implement function categorizeStrideThreat(threatType) mapping threat categories ('S', 'T', 'R', 'I', 'D', 'E') to their formal property violation and security countermeasure.",
    "eStarter": "function categorizeStrideThreat(code) {\n  // TODO: write your code here\n}",
    "eHint": "Map S, T, R, I, D, E to their respective security countermeasure.",
    "eTest": "const s = categorizeStrideThreat('S');\nconst t = categorizeStrideThreat('T');\nif (s.violatedProperty !== 'Authenticity' || s.recommendedCountermeasure !== 'MUTUAL_TLS_OR_MFA' || t.category !== 'Tampering' || t.status !== 'STRIDE_THREAT_CATEGORIZED_NOMINAL') throw new Error('STRIDE categorization failed');",
    "aTitle": "STRIDE Framework Elevation of Privilege Letter Formatter",
    "aDesc": "Implement function getStridePrivilegeLetter() returning `'E'`.",
    "aStarter": "function getStridePrivilegeLetter() {\n  // TODO: write your code here\n}",
    "aHint": "Return E.",
    "aTest": "if (getStridePrivilegeLetter() !== 'E') throw new Error('Letter check failed');"
  },
  {
    "day": 2,
    "title": "Web Security: SQL Injection (SQLi) & Parameterized Queries",
    "desc": "Defend relational databases against injection attacks: Tautology attacks (`' OR '1'='1`), Piggybacked queries (`; DROP TABLE users;--`), Blind and Time-Based SQLi (`SLEEP(5)`), and Defense via Parameterized Prepared Statements separating SQL syntax parsing from user data input.",
    "syllabus": [
      "Anatomy of SQL Injection vulnerabilities in dynamic string concatenation.",
      "The Prepared Statement execution pipeline: Pre-compilation and parameter binding.",
      "Implementing parameterized query sanitizers and automated vulnerability scanners."
    ],
    "eTitle": "SQL Injection Detection & Parameterized Query Builder",
    "eDesc": "Implement function buildSecureSqlStatement(tableName, filterColumn, rawUserInput) detecting unescaped SQL syntax injections (e.g. `' OR '1'='1`, `UNION SELECT`, `--`) and replacing raw concatenation with parameterized `?` placeholders.",
    "eStarter": "function buildSecureSqlStatement(table, col, rawInput) {\n  // TODO: write your code here\n}",
    "eHint": "Test for malicious syntax with regex and return parameterized template.",
    "eTest": "const attack = buildSecureSqlStatement('users', 'username', \"admin' OR '1'='1\");\nconst safe = buildSecureSqlStatement('users', 'username', 'alice');\nif (!attack.detectedMaliciousPattern || safe.detectedMaliciousPattern || attack.secureQuery !== 'SELECT * FROM users WHERE username = ?' || attack.status !== 'SQL_INJECTION_DEFENDED_WITH_PREPARED_STATEMENT_NOMINAL') throw new Error('SQLi defense failed');",
    "aTitle": "SQL Prepared Statement Parameter Placeholder Formatter",
    "aDesc": "Implement function getSqlPlaceholderChar() returning `'?'`.",
    "aStarter": "function getSqlPlaceholderChar() {\n  // TODO: write your code here\n}",
    "aHint": "Return ?.",
    "aTest": "if (getSqlPlaceholderChar() !== '?') throw new Error('Placeholder check failed');"
  },
  {
    "day": 3,
    "title": "Client-Side Security: Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
    "desc": "Neutralize browser script injections: Stored XSS (persistent database payloads), Reflected XSS (unvalidated URL parameter echoes), DOM-based XSS (unsafe `innerHTML` / `eval` usage), Context-Aware HTML Entity Encoding (`&lt;script&gt;`), and Content Security Policy (`default-src 'self'`).",
    "syllabus": [
      "Three classes of Cross-Site Scripting (Stored, Reflected, DOM).",
      "Context-sensitive sanitization: HTML body, attribute, JavaScript, and CSS encodings.",
      "Hardening applications with HTTP Content-Security-Policy (CSP) headers and nonces."
    ],
    "eTitle": "XSS HTML Entity Sanitizer & CSP Generator",
    "eDesc": "Implement function sanitizeHtmlForXss(untrustedString) escaping `&`, `<`, `>`, `\"`, `'`, and `/` preventing script execution in the browser.",
    "eStarter": "function sanitizeHtmlForXss(raw) {\n  // TODO: write your code here\n}",
    "eHint": "Replace special characters with entity equivalents.",
    "eTest": "const res = sanitizeHtmlForXss(\"<script>alert('XSS')</script>\");\nif (res.sanitizedHtml !== '&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;' || !res.containsScriptTag || res.status !== 'XSS_SANITIZED_AND_ESCAPED_NOMINAL') throw new Error('XSS sanitization failed');",
    "aTitle": "Content Security Policy Header Acronym Formatter",
    "aDesc": "Implement function getCspHeaderAcronym() returning `'CSP'`.",
    "aStarter": "function getCspHeaderAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return CSP.",
    "aTest": "if (getCspHeaderAcronym() !== 'CSP') throw new Error('Acronym check failed');"
  },
  {
    "day": 4,
    "title": "Request Forgery: Cross-Site Request Forgery (CSRF) & SameSite Cookies",
    "desc": "Block cross-origin state-changing exploits: The CSRF attack mechanism (exploiting ambient cookie authentication), Synchronizer Token Pattern (cryptographic anti-CSRF form tokens), Double Submit Cookie pattern, and Modern Browser SameSite Cookie attributes (`SameSite=Strict`, `SameSite=Lax`).",
    "syllabus": [
      "CSRF attack vectors on session cookies.",
      "Cryptographic Synchronizer Token generation and validation pipeline.",
      "Configuring SameSite=Strict and SameSite=Lax cookie policies."
    ],
    "eTitle": "CSRF Anti-Forgery Token Validator",
    "eDesc": "Implement function validateCsrfToken(sessionToken, requestHeaderToken, cookieSameSite) validating that the request header token matches the session token and that SameSite is configured to `'Strict'` or `'Lax'`.",
    "eStarter": "function validateCsrfToken(sessionToken, reqToken, sameSite) {\n  // TODO: write your code here\n}",
    "eHint": "Check token match and verify sameSite is Strict or Lax.",
    "eTest": "const pass = validateCsrfToken('sec_tok_123', 'sec_tok_123', 'Strict');\nconst fail = validateCsrfToken('sec_tok_123', 'attacker_token', 'None');\nif (!pass.isCsrfApproved || fail.isCsrfApproved || pass.status !== 'CSRF_REQUEST_VALIDATED_NOMINAL') throw new Error('CSRF validation failed');",
    "aTitle": "Strictest SameSite Cookie Value Formatter",
    "aDesc": "Implement function getStrictSameSiteCookieValue() returning `'Strict'`.",
    "aStarter": "function getStrictSameSiteCookieValue() {\n  // TODO: write your code here\n}",
    "aHint": "Return Strict.",
    "aTest": "if (getStrictSameSiteCookieValue() !== 'Strict') throw new Error('Value check failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine",
    "desc": "Milestone 1: Build a complete foundational web application firewall and threat mitigation engine: STRIDE categorization, SQLi prepared statement defense, XSS entity escaping, and CSRF token/SameSite validation.",
    "syllabus": [
      "Synthesis of threat modeling, SQL injection defense, XSS escaping, and CSRF protection.",
      "Foundational application security milestone verification.",
      "Milestone 1 certification."
    ],
    "eTitle": "Web Application Firewall Master Engine",
    "eDesc": "Implement function executeWafMasterEngine(strideOk, sqliOk, xssOk, csrfOk) certifying combined WAF execution.",
    "eStarter": "function executeWafMasterEngine(s, sq, x, c) {\n  // TODO: write your code here\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeWafMasterEngine(true, true, true, true);\nif (res.engineStatus !== 'WAF_MASTER_ENGINE_ACTIVE') throw new Error('Milestone 1 WAF master failed');",
    "aTitle": "Web Application Firewall Status Formatter",
    "aDesc": "Implement function formatWafStatus(ok) returning `WAF_${ok ? 'ACTIVE' : 'OFFLINE'}`.",
    "aStarter": "function formatWafStatus(o) {\n  // TODO: write your code here\n}",
    "aHint": "Format status.",
    "aTest": "if (formatWafStatus(true) !== 'WAF_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 6,
    "title": "Cryptographic Primitives: Symmetric Encryption (AES-GCM) vs Asymmetric (RSA/ECC)",
    "desc": "Implement enterprise cryptography: Symmetric Block Ciphers (AES-256-GCM Authenticated Encryption with Associated Data AEAD), Galois/Counter Mode Initialization Vectors (IV/Nonce), Authentication Tags (128-bit), and Asymmetric Cryptography (RSA-4096 vs ECC Curve25519) for key exchange.",
    "syllabus": [
      "Symmetric vs Asymmetric encryption computational trade-offs.",
      "Authenticated Encryption with Associated Data (AEAD: AES-GCM) mechanics.",
      "The role of unique Initialization Vectors (IVs) to prevent replay and ciphertext manipulation."
    ],
    "eTitle": "AES-GCM Authenticated Encryption Payload Validator",
    "eDesc": "Implement function validateAesGcmPayload(cipherHex, ivHex, authTagHex, keyBits) validating that the IV is exactly 12 bytes (96 bits), the Auth Tag is 16 bytes (128 bits), and the key is 256 bits.",
    "eStarter": "function validateAesGcmPayload(cipher, iv, tag, keyBits) {\n  // TODO: write your code here\n}",
    "eHint": "Verify 12-byte IV (24 hex), 16-byte tag (32 hex), and 256-bit key.",
    "eTest": "const pass = validateAesGcmPayload('abcdef1234', '1234567890abcdef12345678', '1234567890abcdef1234567890abcdef', 256);\nconst fail = validateAesGcmPayload('abcdef1234', 'short_iv', 'short_tag', 128);\nif (!pass.isGcmPayloadNominal || fail.isGcmPayloadNominal || pass.status !== 'AES_GCM_PAYLOAD_VALIDATED_NOMINAL') throw new Error('AES-GCM payload validation failed');",
    "aTitle": "Standard AES-GCM Recommended Nonce Bit Length Formatter",
    "aDesc": "Implement function getGcmRecommendedNonceBits() returning `96`.",
    "aStarter": "function getGcmRecommendedNonceBits() {\n  // TODO: write your code here\n}",
    "aHint": "Return 96.",
    "aTest": "if (getGcmRecommendedNonceBits() !== 96) throw new Error('Bits check failed');"
  },
  {
    "day": 7,
    "title": "Password Hashing & Key Derivation: Argon2id, Bcrypt & Salt Invariants",
    "desc": "Store user credentials securely: Why fast cryptographic hashes (MD5, SHA-256) are disastrous for passwords (ASIC/GPU rainbow tables), Memory-Hard Key Derivation Functions (Argon2id Winner of the Password Hashing Competition), Work Factors (Bcrypt cost rounds), and Unique Cryptographic Salts (16 bytes).",
    "syllabus": [
      "The physics of offline brute-force attacks and GPU password cracking.",
      "Salting mechanics: Defeating precomputed Rainbow Tables.",
      "Argon2id configuration: Memory cost, Time cost, and Parallelism threads."
    ],
    "eTitle": "Password Hashing Work Factor & Argon2id Parameter Validator",
    "eDesc": "Implement function validateArgon2idConfig(memoryKb, timeIterations, parallelismThreads) validating that memory is $\\ge 65536\\text{ KB}$ (64 MB), iterations $\\ge 3$, and threads $\\ge 1$.",
    "eStarter": "function validateArgon2idConfig(mKb, tIter, pThreads) {\n  // TODO: write your code here\n}",
    "eHint": "Verify mKb >= 65536, tIter >= 3, pThreads >= 1.",
    "eTest": "const pass = validateArgon2idConfig(65536, 3, 4);\nconst fail = validateArgon2idConfig(1024, 1, 1);\nif (!pass.isProductionHardened || fail.isProductionHardened || pass.status !== 'ARGON2ID_CONFIG_HARDENED_NOMINAL') throw new Error('Argon2id validation failed');",
    "aTitle": "Password Hashing Competition Winner Algorithm Formatter",
    "aDesc": "Implement function getPhcWinnerAlgorithm() returning `'Argon2id'`.",
    "aStarter": "function getPhcWinnerAlgorithm() {\n  // TODO: write your code here\n}",
    "aHint": "Return Argon2id.",
    "aTest": "if (getPhcWinnerAlgorithm() !== 'Argon2id') throw new Error('Algorithm check failed');"
  },
  {
    "day": 8,
    "title": "Public Key Infrastructure (PKI): X.509 Digital Certificates & TLS 1.3",
    "desc": "Secure transport layer communications: X.509 Certificate Hierarchy (Root CA, Intermediate CA, Leaf Certificate), Digital Signatures ($S = \\text{Sign}_{K_{\\text{priv}}}(\\text{Hash}(M))$), Certificate Revocation (CRL & OCSP Stapling), and The TLS 1.3 1-RTT Handshake eliminating insecure cipher suites.",
    "syllabus": [
      "Certificate Authorities, Root Stores, and the Chain of Trust.",
      "Digital Certificate verification: Validity dates, SAN DNS names, and cryptographic signatures.",
      "TLS 1.3 handshake mechanics: Ephemeral Diffie-Hellman (ECDHE) and forward secrecy."
    ],
    "eTitle": "X.509 Certificate Chain of Trust Validator",
    "eDesc": "Implement function validateX509CertificateChain(leafCert, intermediateCert, rootCert, currentTimeMs) verifying date validity, Subject/Issuer binding, and CA signature hierarchy.",
    "eStarter": "function validateX509CertificateChain(leaf, inter, root, now) {\n  // TODO: write your code here\n}",
    "eHint": "Verify dates, leaf.issuer===inter.subject, inter.issuer===root.subject, and root self-signature.",
    "eTest": "const root = { subject: 'Root CA', issuer: 'Root CA', isTrustedRoot: true, notBefore: 0, notAfter: 2000000000000 };\nconst inter = { subject: 'Inter CA', issuer: 'Root CA', notBefore: 0, notAfter: 2000000000000 };\nconst leaf = { subject: 'example.com', issuer: 'Inter CA', notBefore: 1000, notAfter: 2000000000000 };\nconst res = validateX509CertificateChain(leaf, inter, root, 50000);\nif (!res.isChainOfTrustVerified || res.status !== 'X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL') throw new Error('PKI validation failed');",
    "aTitle": "Standard Web Security Digital Certificate Format Name Formatter",
    "aDesc": "Implement function getStandardCertificateFormatName() returning `'X.509'`.",
    "aStarter": "function getStandardCertificateFormatName() {\n  // TODO: write your code here\n}",
    "aHint": "Return X.509.",
    "aTest": "if (getStandardCertificateFormatName() !== 'X.509') throw new Error('Format name check failed');"
  },
  {
    "day": 9,
    "title": "Identity & Access Management: JWT Vulnerabilities & Alg 'none' Attacks",
    "desc": "Harden JSON Web Tokens: JWT Structure (Header, Payload, Signature `base64(H).base64(P).base64(S)`), Signature verification algorithms (HS256 vs RS256), The critical 'none' algorithm bypass vulnerability, Key confusion attacks (verifying RS256 public key as HS256 HMAC secret), and Token expiration (`exp`, `nbf`).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Identity & Access Management: JWT Vulnerabilities & Alg 'none' Attacks.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "JWT Algorithm 'none' Attack & Signature Header Sanitizer",
    "eDesc": "Implement function sanitizeJwtHeader(headerObj) rejecting tokens specifying `alg: 'none'` or unsupported cryptographic algorithms.",
    "eStarter": "function sanitizeJwtHeader(hdr) {\n  // TODO: write your code here\n}",
    "eHint": "Verify alg is HS256, RS256, or ES256 and reject NONE.",
    "eTest": "const pass = sanitizeJwtHeader({ alg: 'HS256', typ: 'JWT' });\nconst fail = sanitizeJwtHeader({ alg: 'none', typ: 'JWT' });\nif (!pass.isSignatureAlgorithmApproved || fail.isSignatureAlgorithmApproved || !fail.isNoneAttackDetected) throw new Error('JWT sanitizer failed');",
    "aTitle": "JWT Standard Signature None Algorithm Formatter",
    "aDesc": "Implement function getJwtNoneAlgorithmString() returning `'none'`.",
    "aStarter": "function getJwtNoneAlgorithmString() {\n  // TODO: write your code here\n}",
    "aHint": "Return none.",
    "aTest": "if (getJwtNoneAlgorithmString() !== 'none') throw new Error('String check failed');"
  },
  {
    "day": 10,
    "title": "Authentication: Multi-Factor Authentication & TOTP (RFC 6238)",
    "desc": "Implement Time-Based One-Time Passwords (TOTP): HMAC-Based One-Time Password algorithm (HOTP RFC 4226), Time-Step intervals ($T = \\lfloor(\\text{CurrentTime} - T_0) / 30\\rfloor$), Dynamic Truncation of HMAC-SHA1 hash into 6-digit verification code, and Time-drift window tolerance ($pm 1$ step).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Authentication: Multi-Factor Authentication & TOTP (RFC 6238).",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "TOTP Time-Step Counter & Drift Tolerance Calculator",
    "eDesc": "Implement function calculateTotpTimeStep(currentTimestampSec, timeStepDurationSec) calculating current time-step counter $T = \\lfloor t / 30 \\rfloor$ and generating acceptable drift window $[T-1, T, T+1]$.",
    "eStarter": "function calculateTotpTimeStep(tSec, stepDur) {\n  // TODO: write your code here\n}",
    "eHint": "step = Math.floor(tSec / stepDur), validDriftWindow = [step-1, step, step+1].",
    "eTest": "const res = calculateTotpTimeStep(1600000000, 30); // 1600000000 / 30 = 53333333\nif (res.currentStepCounter !== 53333333 || res.validDriftWindow[0] !== 53333332 || res.status !== 'TOTP_TIME_STEP_CALCULATED_NOMINAL') throw new Error('TOTP calculation failed');",
    "aTitle": "Standard TOTP Time Step Duration in Seconds Formatter",
    "aDesc": "Implement function getStandardTotpStepDurationSec() returning `30`.",
    "aStarter": "function getStandardTotpStepDurationSec() {\n  // TODO: write your code here\n}",
    "aHint": "Return 30.",
    "aTest": "if (getStandardTotpStepDurationSec() !== 30) throw new Error('Duration check failed');"
  },
  {
    "day": 11,
    "title": "Authorization: Role-Based (RBAC) & Attribute-Based Access Control (ABAC)",
    "desc": "Enforce granular access boundaries: Role-Based Access Control (RBAC: User $\\to$ Role $\\to$ Permissions mapping), Attribute-Based Access Control (ABAC: Evaluating Subject, Resource, Action, and Environmental context attributes like IP subnet or business hours), and Privilege Escalation prevention.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Authorization: Role-Based (RBAC) & Attribute-Based Access Control (ABAC).",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "RBAC & ABAC Access Decision Evaluator",
    "eDesc": "Implement function evaluateAccessDecision(userRoles, requiredRole, environmentContext) checking that the user possesses `requiredRole` and that environmental attributes (e.g. `isMfaVerified: true`) satisfy access policies.",
    "eStarter": "function evaluateAccessDecision(roles, reqRole, env) {\n  // TODO: write your code here\n}",
    "eHint": "Check hasRole and env conditions.",
    "eTest": "const pass = evaluateAccessDecision(['ENGINEER', 'SECURITY_ANALYST'], 'SECURITY_ANALYST', { isMfaVerified: true, isIpAllowed: true });\nconst fail = evaluateAccessDecision(['GUEST'], 'SECURITY_ANALYST', { isMfaVerified: true, isIpAllowed: true });\nif (!pass.isAccessGranted || fail.isAccessGranted || pass.status !== 'ACCESS_GRANTED_NOMINAL') throw new Error('Access decision failed');",
    "aTitle": "Role Based Access Control Acronym Formatter",
    "aDesc": "Implement function getRbacAcronym() returning `'RBAC'`.",
    "aStarter": "function getRbacAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return RBAC.",
    "aTest": "if (getRbacAcronym() !== 'RBAC') throw new Error('Acronym check failed');"
  },
  {
    "day": 12,
    "title": "Broken Object Level Authorization (BOLA / IDOR) Defense",
    "desc": "Defend against Insecure Direct Object References (IDOR / BOLA #1 in OWASP API Top 10): Exploiting sequential IDs (`/api/invoices/1004` $\\to$ `/api/invoices/1005`), Enforcing tenant ownership checks at the data repository layer, and Using Cryptographically Random UUIDv4 or Opaque Tokens.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Broken Object Level Authorization (BOLA / IDOR) Defense.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "BOLA / IDOR Resource Ownership Authorizer",
    "eDesc": "Implement function authorizeResourceAccess(authenticatedUserId, userRole, resourceOwnerId) verifying that non-admin users can ONLY read resources matching their own `userId`.",
    "eStarter": "function authorizeResourceAccess(userId, role, ownerId) {\n  // TODO: write your code here\n}",
    "eHint": "isApproved = role === 'ADMIN' || userId === ownerId.",
    "eTest": "const owner = authorizeResourceAccess('usr_123', 'USER', 'usr_123');\nconst intruder = authorizeResourceAccess('usr_attacker', 'USER', 'usr_victim');\nif (!owner.isAuthorized || intruder.isAuthorized || intruder.status !== 'BOLA_UNAUTHORIZED_OBJECT_ACCESS_BLOCKED') throw new Error('BOLA authorization failed');",
    "aTitle": "Insecure Direct Object Reference Acronym Formatter",
    "aDesc": "Implement function getIdorAcronym() returning `'IDOR'`.",
    "aStarter": "function getIdorAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return IDOR.",
    "aTest": "if (getIdorAcronym() !== 'IDOR') throw new Error('Acronym check failed');"
  },
  {
    "day": 13,
    "title": "Network Security: TCP SYN Flood, Port Scanning & Stateful Firewalls",
    "desc": "Secure transport layer networking: TCP 3-Way Handshake (SYN, SYN-ACK, ACK), SYN Flood Denial of Service attacks (Half-open connection table exhaustion), SYN Cookies mitigation ($S = \\text{Hash}(IP_{\\text{src}}, Port_{\\text{src}}, t)$), Nmap port scan detection (Stealth SYN scan `nmap -sS`), and Stateful Packet Inspection (SPI).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Network Security: TCP SYN Flood, Port Scanning & Stateful Firewalls.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "TCP SYN Flood State Table Exhaustion Monitor",
    "eDesc": "Implement function monitorSynConnectionBacklog(currentHalfOpenCount, maxBacklogCapacity) detecting SYN flood saturation ($> 90\\%$ capacity) and triggering SYN Cookie mitigation.",
    "eStarter": "function monitorSynConnectionBacklog(halfOpen, maxCap) {\n  // TODO: write your code here\n}",
    "eHint": "utilization = halfOpen / maxCap, isFlood = utilization >= 0.9.",
    "eTest": "const normal = monitorSynConnectionBacklog(100, 1000); // 10%\nconst attack = monitorSynConnectionBacklog(950, 1000); // 95%\nif (normal.isSynFloodDetected || !attack.isSynFloodDetected || attack.status !== 'SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED') throw new Error('SYN monitor failed');",
    "aTitle": "TCP SYN Flood Mitigation Cookie Name Formatter",
    "aDesc": "Implement function getSynMitigationName() returning `'SYN Cookies'`.",
    "aStarter": "function getSynMitigationName() {\n  // TODO: write your code here\n}",
    "aHint": "Return SYN Cookies.",
    "aTest": "if (getSynMitigationName() !== 'SYN Cookies') throw new Error('Mitigation name check failed');"
  },
  {
    "day": 14,
    "title": "Secure HTTP Headers: HSTS, X-Content-Type-Options & Frame-Options",
    "desc": "Harden web server responses with security headers: HTTP Strict Transport Security (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`), `X-Content-Type-Options: nosniff` (blocking MIME-type sniffing attacks), `X-Frame-Options: DENY` (defeating Clickjacking), and Referrer Policy.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Secure HTTP Headers: HSTS, X-Content-Type-Options & Frame-Options.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "HTTP Security Headers Compliance Auditor",
    "eDesc": "Implement function auditHttpSecurityHeaders(headersMap) verifying that HSTS, X-Content-Type-Options, and X-Frame-Options are present and configured securely.",
    "eStarter": "function auditHttpSecurityHeaders(hdrs) {\n  // TODO: write your code here\n}",
    "eHint": "Verify strict-transport-security, nosniff, and x-frame-options.",
    "eTest": "const pass = auditHttpSecurityHeaders({\n  'strict-transport-security': 'max-age=31536000; includeSubDomains',\n  'x-content-type-options': 'nosniff',\n  'x-frame-options': 'DENY'\n});\nif (!pass.isHeaderSuiteCompliant || pass.status !== 'SECURITY_HEADERS_COMPLIANT_NOMINAL') throw new Error('Headers audit failed');",
    "aTitle": "MIME Sniffing Prevention Header Value Formatter",
    "aDesc": "Implement function getNosniffHeaderValue() returning `'nosniff'`.",
    "aStarter": "function getNosniffHeaderValue() {\n  // TODO: write your code here\n}",
    "aHint": "Return nosniff.",
    "aTest": "if (getNosniffHeaderValue() !== 'nosniff') throw new Error('Value check failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine",
    "desc": "Milestone 2: Build a complete intermediate cryptographic security and identity access engine: AES-GCM AEAD payload validation, Argon2id memory-hard hashing, X.509 PKI certificate chain of trust verification, JWT 'none' attack sanitization, and TOTP MFA drift step calculation.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of ⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Cryptographic Identity & PKI Master Engine",
    "eDesc": "Implement function executeCryptoIdentityMaster(gcmOk, argonOk, pkiOk, jwtOk, totpOk) certifying combined cryptographic identity engine execution.",
    "eStarter": "function executeCryptoIdentityMaster(g, a, p, j, t) {\n  // TODO: write your code here\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeCryptoIdentityMaster(true, true, true, true, true);\nif (res.engineStatus !== 'CRYPTO_IDENTITY_MASTER_ACTIVE') throw new Error('Milestone 2 crypto master failed');",
    "aTitle": "Crypto Identity Master Status Formatter",
    "aDesc": "Implement function getCryptoIdentityMasterStatus() returning `'CRYPTO_IDENTITY_MASTER_ACTIVE'`.",
    "aStarter": "function getCryptoIdentityMasterStatus() {\n  // TODO: write your code here\n}",
    "aHint": "Return status.",
    "aTest": "if (getCryptoIdentityMasterStatus() !== 'CRYPTO_IDENTITY_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 16,
    "title": "Server-Side Request Forgery (SSRF) & Cloud Metadata Protection",
    "desc": "Defend backend servers against SSRF attacks: Cloud Instance Metadata Service exploitation (`http://169.254.169.254/latest/meta-data/iam/`), Private IP subnet filtering (RFC 1918 `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`), DNS Rebinding attacks, and IMDSv2 session token enforcement.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Server-Side Request Forgery (SSRF) & Cloud Metadata Protection.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "SSRF Private IP & Cloud Metadata URL Filter",
    "eDesc": "Implement function filterSsrfUrl(targetUrl) blocking requests targeting `169.254.169.254`, `localhost`, `127.0.0.1`, `10.*`, `192.168.*`, or `172.16-31.*`.",
    "eStarter": "function filterSsrfUrl(urlStr) {\n  // TODO: write your code here\n}",
    "eHint": "Check for 169.254.169.254, localhost, 127.0.0.1, 10.*, 192.168.*.",
    "eTest": "const cloudMeta = filterSsrfUrl('http://169.254.169.254/latest/meta-data/');\nconst publicApi = filterSsrfUrl('https://api.github.com/users');\nif (cloudMeta.isAllowed || !publicApi.isAllowed || cloudMeta.status !== 'SSRF_ATTACK_DETECTED_BLOCKED') throw new Error('SSRF filter failed');",
    "aTitle": "AWS Cloud Metadata IP Address Formatter",
    "aDesc": "Implement function getCloudMetadataIpAddress() returning `'169.254.169.254'`.",
    "aStarter": "function getCloudMetadataIpAddress() {\n  // TODO: write your code here\n}",
    "aHint": "Return 169.254.169.254.",
    "aTest": "if (getCloudMetadataIpAddress() !== '169.254.169.254') throw new Error('IP check failed');"
  },
  {
    "day": 17,
    "title": "Insecure Deserialization & Remote Code Execution (RCE)",
    "desc": "Prevent arbitrary object injection vulnerabilities: Java `ObjectInputStream.readObject()` gadget chains (ysoserial, Apache Commons Collections), Python `pickle.loads()` bytecode execution (`__reduce__`), PHP `unserialize()`, and Replacing binary serialization with typed schema formats (JSON / Protocol Buffers).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Insecure Deserialization & Remote Code Execution (RCE).",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Insecure Serialization Payload Detector",
    "eDesc": "Implement function detectInsecureSerialization(rawPayloadStr) identifying dangerous serialization magic headers such as Java `0xACED0005`, Python `pickle`, or PHP `O:4:\"User\"` object injections.",
    "eStarter": "function detectInsecureSerialization(payload) {\n  // TODO: write your code here\n}",
    "eHint": "Check for Java magic bytes, python pickle system calls, and PHP serialized objects.",
    "eTest": "const javaAttack = detectInsecureSerialization('rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAU=');\nconst safeJson = detectInsecureSerialization('{\"user\":\"alice\",\"id\":123}');\nif (!javaAttack.isDangerousObjectSerialization || safeJson.isDangerousObjectSerialization || javaAttack.status !== 'INSECURE_DESERIALIZATION_PAYLOAD_DETECTED') throw new Error('Deserialization detector failed');",
    "aTitle": "Java Serialization Magic Hex Header Formatter",
    "aDesc": "Implement function getJavaSerializationMagicHex() returning `'aced0005'`.",
    "aStarter": "function getJavaSerializationMagicHex() {\n  // TODO: write your code here\n}",
    "aHint": "Return aced0005.",
    "aTest": "if (getJavaSerializationMagicHex() !== 'aced0005') throw new Error('Hex check failed');"
  },
  {
    "day": 18,
    "title": "Security Misconfiguration & Hardcoded Secrets Auditing: Shannon Entropy",
    "desc": "Detect exposed secrets in source code: High Shannon Entropy calculation ($H = -\\sum p_i \\log_2 p_i$), Detecting AWS Access Keys (`AKIA[0-9A-Z]{16}`), Private SSH Keys (`-----BEGIN RSA PRIVATE KEY-----`), and Git Pre-commit Hook secret scanning.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Security Misconfiguration & Hardcoded Secrets Auditing: Shannon Entropy.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Shannon Entropy String Scanner & API Key Detector",
    "eDesc": "Implement function calculateShannonEntropy(inputString) computing character distribution entropy $H = -\\sum p_i \\log_2(p_i)$ with high entropy ($H \\ge 4.5$) flagging random cryptographic keys.",
    "eStarter": "function calculateShannonEntropy(str) {\n  // TODO: write your code here\n}",
    "eHint": "Calculate character frequencies and sum -p * Math.log2(p).",
    "eTest": "const secret = calculateShannonEntropy('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'); // high entropy\nconst regular = calculateShannonEntropy('aaaaaaaaaaaaaaaa'); // 0 entropy\nif (regular.entropy !== 0.0 || !secret.isHighEntropySecret || secret.status !== 'HIGH_ENTROPY_SECRET_DETECTED') throw new Error('Entropy calculation failed');",
    "aTitle": "AWS Access Key Standard Prefix Formatter",
    "aDesc": "Implement function getAwsAccessKeyPrefix() returning `'AKIA'`.",
    "aStarter": "function getAwsAccessKeyPrefix() {\n  // TODO: write your code here\n}",
    "aHint": "Return AKIA.",
    "aTest": "if (getAwsAccessKeyPrefix() !== 'AKIA') throw new Error('Prefix check failed');"
  },
  {
    "day": 19,
    "title": "Dependency Vulnerabilities: Software Bill of Materials (SBOM) & CVE Auditing",
    "desc": "Secure the software supply chain: Common Vulnerabilities and Exposures (CVE identifiers), Software Bill of Materials (SBOM formats: CycloneDX & SPDX), Dependency Confusion attacks, Typosquatting in npm/PyPI, and Automated `npm audit` / Snyk integration.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Dependency Vulnerabilities: Software Bill of Materials (SBOM) & CVE Auditing.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Software Bill of Materials (SBOM) Dependency CVE Matcher",
    "eDesc": "Implement function matchSbomVulnerabilities(dependenciesList, cveDatabase) finding outdated dependencies matching known CVE records.",
    "eStarter": "function matchSbomVulnerabilities(deps, cveDb) {\n  // TODO: write your code here\n}",
    "eHint": "Match dep.name and dep.version against cveDb.",
    "eTest": "const deps = [{ name: 'lodash', version: '4.17.15' }, { name: 'express', version: '4.18.2' }];\nconst cveDb = [{ packageName: 'lodash', vulnerableVersion: '4.17.15', id: 'CVE-2020-8203', severity: 'HIGH' }];\nconst res = matchSbomVulnerabilities(deps, cveDb);\nif (res.vulnerableDependenciesCount !== 1 || res.vulnerabilities[0].cveId !== 'CVE-2020-8203') throw new Error('SBOM matcher failed');",
    "aTitle": "Software Bill of Materials Acronym Formatter",
    "aDesc": "Implement function getSbomAcronym() returning `'SBOM'`.",
    "aStarter": "function getSbomAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return SBOM.",
    "aTest": "if (getSbomAcronym() !== 'SBOM') throw new Error('Acronym check failed');"
  },
  {
    "day": 20,
    "title": "API Security: Token Bucket Rate Limiting & OAuth 2.0 PKCE Flow",
    "desc": "Protect REST/GraphQL APIs: Token Bucket Algorithm (Capacity $C$, Refill Rate $r$ tokens/sec), Mitigating Automated Credential Stuffing and DoS, and OAuth 2.0 Proof Key for Code Exchange (PKCE: Code Verifier and SHA-256 Code Challenge `BASE64URL(SHA256(verifier))`).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of API Security: Token Bucket Rate Limiting & OAuth 2.0 PKCE Flow.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Token Bucket Rate Limiter Step Calculator",
    "eDesc": "Implement function processTokenBucketRequest(currentTokens, maxCapacity, refillRatePerSec, timeElapsedSec, costPerRequest) refilling bucket and deducting cost if available.",
    "eStarter": "function processTokenBucketRequest(currTokens, maxCap, refillRate, elapsedSec, cost) {\n  // TODO: write your code here\n}",
    "eHint": "refilled = min(maxCap, curr + refillRate * elapsed), if refilled >= cost deduct cost.",
    "eTest": "const pass = processTokenBucketRequest(5, 10, 1, 2, 1); // 5 + 2 = 7 >= 1 -> remaining 6\nconst fail = processTokenBucketRequest(0, 10, 1, 0, 1); // 0 < 1 -> remaining 0, HTTP 429\nif (!pass.isRequestAllowed || fail.isRequestAllowed || fail.status !== 'RATE_LIMIT_EXCEEDED_HTTP_429') throw new Error('Rate limiter failed');",
    "aTitle": "HTTP Status Code for Rate Limiting Formatter",
    "aDesc": "Implement function getRateLimitHttpStatusCode() returning `429`.",
    "aStarter": "function getRateLimitHttpStatusCode() {\n  // TODO: write your code here\n}",
    "aHint": "Return 429.",
    "aTest": "if (getRateLimitHttpStatusCode() !== 429) throw new Error('Status code check failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter",
    "desc": "Milestone 3: Build a complete advanced network and application runtime defense engine: SSRF cloud metadata filtering, Insecure deserialization header scanning, Shannon entropy API key discovery, SBOM CVE matching, and Token Bucket API rate limiting.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of ⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Application Runtime Defense Master Engine",
    "eDesc": "Implement function executeRuntimeDefenseMaster(ssrfOk, deserOk, entropyOk, sbomOk, rateOk) certifying combined runtime defense execution.",
    "eStarter": "function executeRuntimeDefenseMaster(s, d, e, b, r) {\n  // TODO: write your code here\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeRuntimeDefenseMaster(true, true, true, true, true);\nif (res.engineStatus !== 'RUNTIME_DEFENSE_MASTER_ACTIVE') throw new Error('Milestone 3 runtime master failed');",
    "aTitle": "Runtime Defense Master Status Formatter",
    "aDesc": "Implement function getRuntimeDefenseMasterStatus() returning `'RUNTIME_DEFENSE_MASTER_ACTIVE'`.",
    "aStarter": "function getRuntimeDefenseMasterStatus() {\n  // TODO: write your code here\n}",
    "aHint": "Return status.",
    "aTest": "if (getRuntimeDefenseMasterStatus() !== 'RUNTIME_DEFENSE_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 22,
    "title": "Binary Exploitation: Buffer Overflows, Stack Canaries & ASLR",
    "desc": "Understand low-level memory corruption: The C Call Stack layout (Local Variables, Saved Frame Pointer EBP, Return Address EIP), Smashing the Stack (`strcpy()` unbounded copy), Stack Canaries (terminator / random cookies placed before return address), Address Space Layout Randomization (ASLR), and Non-Executable Stack (NX / W^X).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Binary Exploitation: Buffer Overflows, Stack Canaries & ASLR.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Stack Canary Corruption & Buffer Overflow Detector",
    "eDesc": "Implement function detectStackOverflow(allocatedBufferSize, incomingPayloadSize, canaryValue, currentCanaryMemory) verifying buffer bounds and detecting modified canary cookies.",
    "eStarter": "function detectStackOverflow(bufSize, payloadSize, originalCanary, memoryCanary) {\n  // TODO: write your code here\n}",
    "eHint": "Check if payloadSize > bufSize or canary differs.",
    "eTest": "const attack = detectStackOverflow(64, 128, '0xDEADBEEF', '0x41414141');\nconst safe = detectStackOverflow(64, 32, '0xDEADBEEF', '0xDEADBEEF');\nif (!attack.isExploitDetected || safe.isExploitDetected || attack.status !== 'STACK_SMASHING_DETECTED_TERMINATING_PROCESS') throw new Error('Buffer overflow detector failed');",
    "aTitle": "Address Space Layout Randomization Acronym Formatter",
    "aDesc": "Implement function getAslrAcronym() returning `'ASLR'`.",
    "aStarter": "function getAslrAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return ASLR.",
    "aTest": "if (getAslrAcronym() !== 'ASLR') throw new Error('Acronym check failed');"
  },
  {
    "day": 23,
    "title": "Memory Safety: Use-After-Free, Dangling Pointers & Spatial/Temporal Safety",
    "desc": "Master modern memory security: Spatial Memory Safety (Out-of-bounds indexing buffer overflow), Temporal Memory Safety (Use-After-Free UAF, Double Free, Dangling Pointers), Why C/C++ cause 70% of Microsoft/Google CVEs, and Memory-Safe Languages (Rust Ownership, Borrow Checker, Zero-Cost Lifetimes).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Memory Safety: Use-After-Free, Dangling Pointers & Spatial/Temporal Safety.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Memory Safety Lifecycle & Dangling Pointer Tracker",
    "eDesc": "Implement function trackMemoryPointerLifecycle(pointerState, requestedAction) state machine enforcing that freed pointers cannot be dereferenced (`USE_AFTER_FREE_BLOCKED`).",
    "eStarter": "function trackMemoryPointerLifecycle(state, action) {\n  // TODO: write your code here\n}",
    "eHint": "Flag violation if action is FREE when state is FREED, or action is DEREFERENCE when state is FREED/NULL.",
    "eTest": "const uaf = trackMemoryPointerLifecycle('FREED', 'DEREFERENCE');\nconst valid = trackMemoryPointerLifecycle('ALLOCATED', 'READ');\nif (!uaf.isMemoryViolation || valid.isMemoryViolation || uaf.status !== 'USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED') throw new Error('Memory safety tracker failed');",
    "aTitle": "Memory Safety Invariant Core Term Formatter",
    "aDesc": "Implement function getMemorySafetyTerm() returning `'Temporal Safety'`.",
    "aStarter": "function getMemorySafetyTerm() {\n  // TODO: write your code here\n}",
    "aHint": "Return Temporal Safety.",
    "aTest": "if (getMemorySafetyTerm() !== 'Temporal Safety') throw new Error('Term check failed');"
  },
  {
    "day": 24,
    "title": "Security Information & Event Management (SIEM): Log Analysis & IOC Detection",
    "desc": "Monitor enterprise security telemetry: Indicators of Compromise (IOC: Malicious IP lists, SHA-256 file hashes, domain reputation), Event Correlation rules (5 failed SSH logins in 60s followed by successful sudo), Elastic SIEM / Splunk search queries, and MITRE ATT&CK Framework mapping.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Security Information & Event Management (SIEM): Log Analysis & IOC Detection.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "SIEM Brute Force Correlation Rule Engine",
    "eDesc": "Implement function correlateSiemLogEvents(eventLogsArray, timeWindowSec, thresholdCount) grouping failed logins by source IP and raising a high-priority alert if threshold is breached within window.",
    "eStarter": "function correlateSiemLogEvents(logs, windowSec, thresh) {\n  // TODO: write your code here\n}",
    "eHint": "Count AUTH_FAILED per sourceIp and alert if >= thresh.",
    "eTest": "const logs = [\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 100 },\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 105 },\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 110 }\n];\nconst res = correlateSiemLogEvents(logs, 60, 3);\nif (!res.isBruteForceAlert || res.threatSourceIp !== '198.51.100.4' || res.status !== 'SIEM_BRUTE_FORCE_ATTACK_CORRELATED_ALERT') throw new Error('SIEM engine failed');",
    "aTitle": "Indicator of Compromise Acronym Formatter",
    "aDesc": "Implement function getIocAcronym() returning `'IOC'`.",
    "aStarter": "function getIocAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return IOC.",
    "aTest": "if (getIocAcronym() !== 'IOC') throw new Error('Acronym check failed');"
  },
  {
    "day": 25,
    "title": "Intrusion Detection & Prevention Systems (IDS/IPS): Snort & Suricata Rules",
    "desc": "Inspect live network packet payloads: Network-based IDS (NIDS) vs Host-based (HIDS), Signature-based vs Anomaly-based detection, Snort / Suricata Rule Syntax (`alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:\"SQLi\"; content:\"UNION SELECT\"; sid:1000001;)`), and Inline Packet Dropping (IPS).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Intrusion Detection & Prevention Systems (IDS/IPS): Snort & Suricata Rules.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Snort Signature Rule Pattern Matcher",
    "eDesc": "Implement function matchSnortSignature(packetProtocol, packetDstPort, packetPayload, ruleConfig) triggering an alert if protocol, port, and payload signature content match.",
    "eStarter": "function matchSnortSignature(proto, port, payload, rule) {\n  // TODO: write your code here\n}",
    "eHint": "Verify proto, port, and payload.includes(rule.content).",
    "eTest": "const rule = { sid: 1001, msg: 'Nmap Scan', protocol: 'TCP', dstPort: 80, content: 'Nmap', action: 'DROP' };\nconst attack = matchSnortSignature('TCP', 80, 'GET / HTTP/1.1 User-Agent: Nmap', rule);\nconst clean = matchSnortSignature('TCP', 80, 'GET / HTTP/1.1 User-Agent: Mozilla', rule);\nif (!attack.isSignatureTriggered || clean.isSignatureTriggered || attack.action !== 'DROP') throw new Error('Snort matcher failed');",
    "aTitle": "Open Source IDS Engine Name Formatter",
    "aDesc": "Implement function getStandardNidsEngineName() returning `'Snort'`.",
    "aStarter": "function getStandardNidsEngineName() {\n  // TODO: write your code here\n}",
    "aHint": "Return Snort.",
    "aTest": "if (getStandardNidsEngineName() !== 'Snort') throw new Error('Engine name check failed');"
  },
  {
    "day": 26,
    "title": "Penetration Testing & Vulnerability Assessment: CVSS v3.1 Scoring",
    "desc": "Quantify security vulnerabilities: Common Vulnerability Scoring System (CVSS v3.1 Base Metrics: Attack Vector AV, Attack Complexity AC, Privileges Required PR, User Interaction UI, Scope S, Confidentiality C, Integrity I, Availability A), Qualitative Severity ratings (Low 0.1-3.9, Medium 4.0-6.9, High 7.0-8.9, Critical 9.0-10.0), and Responsible Disclosure.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Penetration Testing & Vulnerability Assessment: CVSS v3.1 Scoring.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "CVSS v3.1 Qualitative Severity Rating Categorizer",
    "eDesc": "Implement function categorizeCvssScore(baseScore) mapping numerical score ($[0.0, 10.0]$) to `'NONE'`, `'LOW'`, `'MEDIUM'`, `'HIGH'`, or `'CRITICAL'` according to the official CVSS v3.1 specification.",
    "eStarter": "function categorizeCvssScore(score) {\n  // TODO: write your code here\n}",
    "eHint": "0.0 None, <4.0 Low, <7.0 Medium, <9.0 High, else Critical.",
    "eTest": "const crit = categorizeCvssScore(9.8); // Critical (e.g. Log4Shell)\nconst med = categorizeCvssScore(5.3); // Medium\nif (crit.severityRating !== 'CRITICAL' || med.severityRating !== 'MEDIUM' || crit.status !== 'CVSS_RATING_CALCULATED_NOMINAL') throw new Error('CVSS categorizer failed');",
    "aTitle": "Common Vulnerability Scoring System Acronym Formatter",
    "aDesc": "Implement function getCvssAcronym() returning `'CVSS'`.",
    "aStarter": "function getCvssAcronym() {\n  // TODO: write your code here\n}",
    "aHint": "Return CVSS.",
    "aTest": "if (getCvssAcronym() !== 'CVSS') throw new Error('Acronym check failed');"
  },
  {
    "day": 27,
    "title": "Zero Trust Architecture (ZTA): BeyondCorp & Continuous Verification",
    "desc": "Eliminate perimeter security fallacies: NIST SP 800-207 Zero Trust Core Tenets ('Never Trust, Always Verify', 'Assume Breach'), Continuous Contextual Authentication (Device posture, Geolocation, Risk score), Microsegmentation, and Identity-Aware Proxies (IAP).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Zero Trust Architecture (ZTA): BeyondCorp & Continuous Verification.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Zero Trust Policy Continuous Verification Engine",
    "eDesc": "Implement function evaluateZeroTrustPolicy(isIdentityValid, isDeviceHealthy, isLocationRiskLow) verifying that all 3 dynamic posture signals evaluate to true for every single micro-service request.",
    "eStarter": "function evaluateZeroTrustPolicy(idValid, devHealthy, locLowRisk) {\n  // TODO: write your code here\n}",
    "eHint": "isApproved = idValid && devHealthy && locLowRisk.",
    "eTest": "const pass = evaluateZeroTrustPolicy(true, true, true);\nconst fail = evaluateZeroTrustPolicy(true, false, true); // unhealthy device\nif (!pass.zeroTrustAccessGranted || fail.zeroTrustAccessGranted || fail.status !== 'ZERO_TRUST_VERIFICATION_FAILED_ACCESS_REVOKED') throw new Error('Zero trust evaluator failed');",
    "aTitle": "Zero Trust Core Philosophical Maxim Formatter",
    "aDesc": "Implement function getZeroTrustMaxim() returning `'Never Trust, Always Verify'`.",
    "aStarter": "function getZeroTrustMaxim() {\n  // TODO: write your code here\n}",
    "aHint": "Return Never Trust, Always Verify.",
    "aTest": "if (getZeroTrustMaxim() !== 'Never Trust, Always Verify') throw new Error('Maxim check failed');"
  },
  {
    "day": 28,
    "title": "Cloud Security: AWS IAM Least Privilege, S3 Bucket Policies & KMS",
    "desc": "Harden public cloud infrastructure: Principle of Least Privilege in IAM Policies (Explicit Deny evaluation, Wildcard `*` audit), Public S3 Bucket exposure prevention (`BlockPublicAcls: true`), Envelope Encryption with AWS KMS Customer Managed Keys (CMK), and AWS CloudTrail immutable audit logs.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Cloud Security: AWS IAM Least Privilege, S3 Bucket Policies & KMS.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "AWS IAM Policy Least Privilege Wildcard Auditor",
    "eDesc": "Implement function auditAwsIamPolicy(policyStatement) flagging overly permissive wildcard actions (`Action: \"*\"` or `Resource: \"*\"` with `Effect: \"Allow\"`).",
    "eStarter": "function auditAwsIamPolicy(statement) {\n  // TODO: write your code here\n}",
    "eHint": "Flag excessive privilege if Effect === 'Allow' and Action or Resource is '*'.",
    "eTest": "const risky = auditAwsIamPolicy({ Effect: 'Allow', Action: '*', Resource: '*' });\nconst secure = auditAwsIamPolicy({ Effect: 'Allow', Action: ['s3:GetObject'], Resource: 'arn:aws:s3:::mybucket/*' });\nif (risky.isPolicyCompliant || !secure.isPolicyCompliant || risky.status !== 'OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED') throw new Error('IAM auditor failed');",
    "aTitle": "Principle of Security Authorization Formatter",
    "aDesc": "Implement function getLeastPrivilegePrincipleName() returning `'Least Privilege'`.",
    "aStarter": "function getLeastPrivilegePrincipleName() {\n  // TODO: write your code here\n}",
    "aHint": "Return Least Privilege.",
    "aTest": "if (getLeastPrivilegePrincipleName() !== 'Least Privilege') throw new Error('Principle check failed');"
  },
  {
    "day": 29,
    "title": "Incident Response: Forensic Chain of Custody & Containment Strategy",
    "desc": "Respond to enterprise cyber security breaches: NIST SP 800-61 Incident Handling Guide (Preparation, Detection & Analysis, Containment, Eradication, Recovery, Post-Incident Activity), Forensic Chain of Custody (Cryptographic SHA-256 disk image hashing), and Network Host Isolation.",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of Incident Response: Forensic Chain of Custody & Containment Strategy.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Digital Forensics Chain of Custody Integrity Verifier",
    "eDesc": "Implement function verifyForensicEvidenceIntegrity(originalEvidenceHash, currentEvidenceHash, isChainDocumented) certifying that evidence bit-stream has not been altered.",
    "eStarter": "function verifyForensicEvidenceIntegrity(origHash, currHash, isDoc) {\n  // TODO: write your code here\n}",
    "eHint": "isCertified = origHash.toLowerCase() === currHash.toLowerCase() && isDoc === true.",
    "eTest": "const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';\nconst pass = verifyForensicEvidenceIntegrity(hash, hash, true);\nconst fail = verifyForensicEvidenceIntegrity(hash, 'tampered_hash', true);\nif (!pass.isEvidenceAdmissible || fail.isEvidenceAdmissible || pass.status !== 'FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL') throw new Error('Forensic verifier failed');",
    "aTitle": "Incident Response Standard Guide NIST Number Formatter",
    "aDesc": "Implement function getNistIncidentGuideNumber() returning `'SP 800-61'`.",
    "aStarter": "function getNistIncidentGuideNumber() {\n  // TODO: write your code here\n}",
    "aHint": "Return SP 800-61.",
    "aTest": "if (getNistIncidentGuideNumber() !== 'SP 800-61') throw new Error('NIST number check failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Defensive & Offensive Cybersecurity Operations Suite",
    "desc": "Final Capstone Synthesis: The complete sovereign enterprise cybersecurity operations and defensive architecture master suite: 1. Application & Network Defense (STRIDE threat modeling, SQLi prepared queries, XSS entity escaping, CSRF SameSite tokens, TCP SYN cookie mitigation, Secure headers); 2. Cryptographic Security & Identity (AES-256-GCM AEAD, Argon2id memory-hard hashing, X.509 PKI chain of trust, JWT none attack defense, TOTP MFA RFC 6238, BOLA/IDOR object authorization); 3. Runtime Protection & Supply Chain (SSRF cloud metadata defense, Insecure deserialization filters, Shannon entropy secret discovery, SBOM CVE auditing, Token Bucket API rate limiter); 4. Systems, SIEM & Intrusion Prevention (Stack canary buffer overflow detection, Use-After-Free temporal pointer safety, SIEM brute-force correlation, Snort NIDS signature matching); 5. Governance, Zero Trust & Forensics (CVSS v3.1 qualitative scoring, Zero Trust continuous verification, AWS IAM least privilege, Forensic SHA-256 chain of custody integrity).",
    "syllabus": [
      "Core Foundations: Principles and attack/defense mechanisms of 🏆 FINAL CAPSTONE: Sovereign Defensive & Offensive Cybersecurity Operations Suite.",
      "Operational Architecture: Security verification and rule execution flow.",
      "Production Best Practices: Hardening guidelines, error sanitization, and compliance auditing."
    ],
    "eTitle": "Sovereign Cybersecurity Operations Master Suite Orchestrator",
    "eDesc": "Implement function orchestrateCyberSecurityMasterSuite(appSecOk, cryptoOk, runtimeOk, systemsOk, governanceOk) certifying comprehensive enterprise cyber defense mastery.",
    "eStarter": "function orchestrateCyberSecurityMasterSuite(app, cry, run, sys, gov) {\n  // TODO: write your code here\n}",
    "eHint": "Verify all 5 module flags evaluate to true.",
    "eTest": "const ok = orchestrateCyberSecurityMasterSuite(true, true, true, true, true);\nconst fail = orchestrateCyberSecurityMasterSuite(true, true, false, true, true);\nif (!ok.sovereignCyberCertified || fail.sovereignCyberCertified || !ok.certified || ok.status !== 'SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL') throw new Error('Capstone orchestrator failed');",
    "aTitle": "Cybersecurity Master Certification Auditor",
    "aDesc": "Implement function auditCyberMasterCert() returning `{ certified: true, score: '100/100', tier: 'SOVEREIGN_CYBERSECURITY_ARCHITECT_CERTIFIED' }`.",
    "aStarter": "function auditCyberMasterCert() {\n  // TODO: write your code here\n}",
    "aHint": "Return certification object.",
    "aTest": "if (!auditCyberMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const CYBER_30_DAYS_QUESTS: CourseQuest[] = CYBER_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('cyber', idx + 1, cfg)
);
