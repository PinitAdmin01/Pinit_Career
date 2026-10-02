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
    "eDesc": "Implement function categorizeStrideThreat(threatType) mapping threat categories ('S', 'T', 'R', 'I', 'D', 'E') to their formal property violation and security countermeasure. Use these exact values: `recommendedCountermeasure`: 'MUTUAL_TLS_OR_MFA'; `status`: 'STRIDE_THREAT_CATEGORIZED_NOMINAL'. The result must have these fields: `violatedProperty`, `category`.",
    "eStarter": "function categorizeStrideThreat(code) {\n  // TODO: write your code here\n}",
    "eHint": "Map S, T, R, I, D, E to their respective security countermeasure.",
    "eTest": "const s = categorizeStrideThreat('S');\nconst t = categorizeStrideThreat('T');\nif (s.violatedProperty !== 'Authenticity' || s.recommendedCountermeasure !== 'MUTUAL_TLS_OR_MFA' || t.category !== 'Tampering' || t.status !== 'STRIDE_THREAT_CATEGORIZED_NOMINAL') throw new Error('STRIDE categorization failed');",
    "aTitle": "STRIDE Threat Property Resolver",
    "aDesc": "Implement function resolveStrideProperty(letter) returning the security property for 'S' ('Authenticity'), 'T' ('Integrity'), 'R' ('Non-Repudiation'), 'I' ('Confidentiality'), 'D' ('Availability'), and 'E' ('Authorization'). Return 'UNKNOWN' for invalid letters.",
    "aStarter": "function resolveStrideProperty(letter) {\n  // TODO: write your code here\n}",
    "aHint": "Map S, T, R, I, D, E to their respective security property.",
    "aTest": "if (resolveStrideProperty('S') !== 'Authenticity') throw new Error('S failed');\nif (resolveStrideProperty('T') !== 'Integrity') throw new Error('T failed');\nif (resolveStrideProperty('I') !== 'Confidentiality') throw new Error('I failed');\nif (resolveStrideProperty('X') !== 'UNKNOWN') throw new Error('Invalid check failed');"
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
    "eDesc": "Implement function buildSecureSqlStatement(tableName, filterColumn, rawUserInput) detecting unescaped SQL syntax injections (e.g. `' OR '1'='1`, `UNION SELECT`, `--`) and replacing raw concatenation with parameterized `?` placeholders. Use these exact values: `status`: 'SQL_INJECTION_DEFENDED_WITH_PREPARED_STATEMENT_NOMINAL'. The result must have these fields: `detectedMaliciousPattern`, `secureQuery`.",
    "eStarter": "function buildSecureSqlStatement(table, col, rawInput) {\n  // TODO: write your code here\n}",
    "eHint": "Test for malicious syntax with regex and return parameterized template.",
    "eTest": "const attack = buildSecureSqlStatement('users', 'username', \"admin' OR '1'='1\");\nconst safe = buildSecureSqlStatement('users', 'username', 'alice');\nif (!attack.detectedMaliciousPattern || safe.detectedMaliciousPattern || attack.secureQuery !== 'SELECT * FROM users WHERE username = ?' || attack.status !== 'SQL_INJECTION_DEFENDED_WITH_PREPARED_STATEMENT_NOMINAL') throw new Error('SQLi defense failed');",
    "aTitle": "SQL Parameter Placeholder Generator",
    "aDesc": "Implement function generateSqlPlaceholders(count) returning a comma-separated string of '?' placeholders for prepared statements (e.g. 1 -> '?', 3 -> '?, ?, ?'). Return empty string for count <= 0.",
    "aStarter": "function generateSqlPlaceholders(count) {\n  // TODO: write your code here\n}",
    "aHint": "Create an array of length count filled with '?' and join with ', '.",
    "aTest": "if (generateSqlPlaceholders(1) !== '?') throw new Error('1 placeholder failed');\nif (generateSqlPlaceholders(3) !== '?, ?, ?') throw new Error('3 placeholders failed');\nif (generateSqlPlaceholders(0) !== '') throw new Error('0 placeholder failed');"
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
    "eDesc": "Implement function sanitizeHtmlForXss(untrustedString) escaping `&`, `<`, `>`, `\"`, `'`, and `/` preventing script execution in the browser. Use these exact values: `status`: 'XSS_SANITIZED_AND_ESCAPED_NOMINAL'. The result must have these fields: `sanitizedHtml`, `containsScriptTag`.",
    "eStarter": "function sanitizeHtmlForXss(raw) {\n  // TODO: write your code here\n}",
    "eHint": "Replace special characters with entity equivalents.",
    "eTest": "const res1 = sanitizeHtmlForXss(\"<script>alert('XSS')</script>\");\nif (res1.sanitizedHtml !== '&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;' || !res1.containsScriptTag || res1.status !== 'XSS_SANITIZED_AND_ESCAPED_NOMINAL') throw new Error('XSS script tag failed');\nconst res2 = sanitizeHtmlForXss(\"Hello & welcome!\");\nif (res2.sanitizedHtml !== 'Hello &amp; welcome!' || res2.containsScriptTag) throw new Error('XSS ampersand failed');",
    "aTitle": "Content Security Policy Directive Formatter",
    "aDesc": "Implement function formatCspDirective(directiveName, sources) returning `${directiveName} ${sources.join(' ')}`.",
    "aStarter": "function formatCspDirective(name, sources) {\n  // TODO: write your code here\n}",
    "aHint": "Join sources array with a space.",
    "aTest": "if (formatCspDirective('default-src', [\"'self'\"]) !== \"default-src 'self'\") throw new Error('default-src failed');\nif (formatCspDirective('script-src', [\"'self'\", 'https://cdn.example.com']) !== \"script-src 'self' https://cdn.example.com\") throw new Error('script-src failed');"
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
    "eDesc": "Implement function validateCsrfToken(sessionToken, requestHeaderToken, cookieSameSite) validating that the request header token matches the session token and that SameSite is configured to `'Strict'` or `'Lax'`. Use these exact values: `status`: 'CSRF_REQUEST_VALIDATED_NOMINAL'. The result must have the field: `isCsrfApproved`.",
    "eStarter": "function validateCsrfToken(sessionToken, reqToken, sameSite) {\n  // TODO: write your code here\n}",
    "eHint": "Check token match and verify sameSite is Strict or Lax.",
    "eTest": "const pass = validateCsrfToken('sec_tok_123', 'sec_tok_123', 'Strict');\nconst fail = validateCsrfToken('sec_tok_123', 'attacker_token', 'None');\nif (!pass.isCsrfApproved || fail.isCsrfApproved || pass.status !== 'CSRF_REQUEST_VALIDATED_NOMINAL') throw new Error('CSRF validation failed');",
    "aTitle": "SameSite Cookie Attribute Formatter",
    "aDesc": "Implement function formatSameSiteCookie(cookieName, cookieValue, sameSiteMode, isSecure = true) returning formatted Set-Cookie header attribute string (e.g. 'session', 'abc', 'Strict' -> 'session=abc; SameSite=Strict; Secure').",
    "aStarter": "function formatSameSiteCookie(name, val, mode, sec) {\n  // TODO: write your code here\n}",
    "aHint": "Format with name, value, SameSite, and conditionally ; Secure.",
    "aTest": "if (formatSameSiteCookie('sid', '123', 'Strict', true) !== 'sid=123; SameSite=Strict; Secure') throw new Error('Strict secure failed');\nif (formatSameSiteCookie('pref', 'dark', 'Lax', false) !== 'pref=dark; SameSite=Lax') throw new Error('Lax non-secure failed');"
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
    "eDesc": "Implement function executeWafMasterEngine(strideOk, sqliOk, xssOk, csrfOk) certifying combined WAF execution. Use these exact values: `engineStatus`: 'WAF_MASTER_ENGINE_ACTIVE' or 'WAF_DEFECT_DETECTED'.",
    "eStarter": "function executeWafMasterEngine(s, sq, x, c) {\n  // TODO: write your code here\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const pass = executeWafMasterEngine(true, true, true, true);\nif (!pass || pass.engineStatus !== 'WAF_MASTER_ENGINE_ACTIVE' || !pass.wafCertified) throw new Error('WAF all pass failed');\nconst fail = executeWafMasterEngine(true, false, true, true);\nif (!fail || fail.engineStatus !== 'WAF_DEFECT_DETECTED' || fail.wafCertified) throw new Error('WAF defect failed');",
    "aTitle": "Web Application Firewall Status Formatter",
    "aDesc": "Implement function formatWafStatus(ok) returning `WAF_${ok ? 'ACTIVE' : 'OFFLINE'}`.",
    "aStarter": "function formatWafStatus(ok) {\n  // TODO: write your code here\n}",
    "aHint": "Return WAF_ACTIVE when true, WAF_OFFLINE when false.",
    "aTest": "if (formatWafStatus(true) !== 'WAF_ACTIVE') throw new Error('WAF active failed');\nif (formatWafStatus(false) !== 'WAF_OFFLINE') throw new Error('WAF offline failed');"
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
    "eDesc": "Implement function validateAesGcmPayload(cipherHex, ivHex, authTagHex, keyBits) validating that the IV is exactly 12 bytes (96 bits), the Auth Tag is 16 bytes (128 bits), and the key is 256 bits. Use these exact values: `status`: 'AES_GCM_PAYLOAD_VALIDATED_NOMINAL'. The result must have the field: `isGcmPayloadNominal`.",
    "eStarter": "function validateAesGcmPayload(cipher, iv, tag, keyBits) {\n  // TODO: write your code here\n}",
    "eHint": "Verify 12-byte IV (24 hex), 16-byte tag (32 hex), and 256-bit key.",
    "eTest": "const pass = validateAesGcmPayload('abcdef1234', '1234567890abcdef12345678', '1234567890abcdef1234567890abcdef', 256);\nconst fail = validateAesGcmPayload('abcdef1234', 'short_iv', 'short_tag', 128);\nif (!pass.isGcmPayloadNominal || fail.isGcmPayloadNominal || pass.status !== 'AES_GCM_PAYLOAD_VALIDATED_NOMINAL') throw new Error('AES-GCM payload validation failed');",
    "aTitle": "Cryptographic Key Bit Length Calculator",
    "aDesc": "Implement function calculateKeyBits(byteLength) returning `byteLength * 8`. Return 0 for non-positive byteLength.",
    "aStarter": "function calculateKeyBits(bytes) {\n  // TODO: write your code here\n}",
    "aHint": "Multiply bytes by 8.",
    "aTest": "if (calculateKeyBits(32) !== 256) throw new Error('32 bytes should be 256 bits');\nif (calculateKeyBits(16) !== 128) throw new Error('16 bytes should be 128 bits');\nif (calculateKeyBits(0) !== 0) throw new Error('0 bytes should be 0 bits');"
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
    "eDesc": "Implement function validateArgon2idConfig(memoryKb, timeIterations, parallelismThreads) validating that memory is $\\ge 65536\\text{ KB}$ (64 MB), iterations $\\ge 3$, and threads $\\ge 1$. Use these exact values: `status`: 'ARGON2ID_CONFIG_HARDENED_NOMINAL'. The result must have the field: `isProductionHardened`.",
    "eStarter": "function validateArgon2idConfig(mKb, tIter, pThreads) {\n  // TODO: write your code here\n}",
    "eHint": "Verify mKb >= 65536, tIter >= 3, pThreads >= 1.",
    "eTest": "const pass = validateArgon2idConfig(65536, 3, 4);\nconst fail = validateArgon2idConfig(1024, 1, 1);\nif (!pass.isProductionHardened || fail.isProductionHardened || pass.status !== 'ARGON2ID_CONFIG_HARDENED_NOMINAL') throw new Error('Argon2id validation failed');",
    "aTitle": "Argon2 Variant Security Classifier",
    "aDesc": "Implement function classifyArgon2Variant(variant) returning 'HYBRID_MAXIMUM_RESISTANCE' for 'argon2id', 'SIDE_CHANNEL_RESISTANT' for 'argon2i', 'GPU_CRACKING_RESISTANT' for 'argon2d', and 'UNKNOWN' otherwise.",
    "aStarter": "function classifyArgon2Variant(v) {\n  // TODO: write your code here\n}",
    "aHint": "Normalize string and check variant mapping.",
    "aTest": "if (classifyArgon2Variant('argon2id') !== 'HYBRID_MAXIMUM_RESISTANCE') throw new Error('argon2id failed');\nif (classifyArgon2Variant('argon2i') !== 'SIDE_CHANNEL_RESISTANT') throw new Error('argon2i failed');\nif (classifyArgon2Variant('argon2d') !== 'GPU_CRACKING_RESISTANT') throw new Error('argon2d failed');\nif (classifyArgon2Variant('sha256') !== 'UNKNOWN') throw new Error('Invalid variant failed');"
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
    "eDesc": "Implement function validateX509CertificateChain(leafCert, intermediateCert, rootCert, currentTimeMs) verifying date validity, Subject/Issuer binding, and CA signature hierarchy. Use these exact values: `status`: 'X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL' or 'CERTIFICATE_CHAIN_VALIDATION_FAILED'. The result must have the field: `isChainOfTrustVerified`.",
    "eStarter": "function validateX509CertificateChain(leaf, inter, root, now) {\n  // TODO: write your code here\n}",
    "eHint": "Verify dates, leaf.issuer===inter.subject, inter.issuer===root.subject, and root self-signature.",
    "eTest": "const root = { subject: 'Root CA', issuer: 'Root CA', isTrustedRoot: true, notBefore: 0, notAfter: 2000000000000 };\nconst inter = { subject: 'Inter CA', issuer: 'Root CA', notBefore: 0, notAfter: 2000000000000 };\nconst leaf = { subject: 'example.com', issuer: 'Inter CA', notBefore: 1000, notAfter: 2000000000000 };\nconst pass = validateX509CertificateChain(leaf, inter, root, 50000);\nif (!pass.isChainOfTrustVerified || pass.status !== 'X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL') throw new Error('PKI valid chain failed');\nconst expired = validateX509CertificateChain(leaf, inter, root, 3000000000000);\nif (expired.isChainOfTrustVerified || expired.status !== 'CERTIFICATE_CHAIN_VALIDATION_FAILED') throw new Error('Expired certificate must fail');",
    "aTitle": "Certificate Expiry Date Validator",
    "aDesc": "Implement function isCertificateValidAt(notBefore, notAfter, currentTimestamp) returning true if `currentTimestamp >= notBefore && currentTimestamp <= notAfter`, else false.",
    "aStarter": "function isCertificateValidAt(nb, na, now) {\n  // TODO: write your code here\n}",
    "aHint": "Check currentTimestamp between notBefore and notAfter.",
    "aTest": "if (!isCertificateValidAt(1000, 5000, 3000)) throw new Error('Valid date should pass');\nif (isCertificateValidAt(1000, 5000, 6000)) throw new Error('Future expired date should fail');\nif (isCertificateValidAt(1000, 5000, 500)) throw new Error('Past date should fail');"
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
    "eDesc": "Implement function sanitizeJwtHeader(headerObj) rejecting tokens specifying `alg: 'none'` or unsupported cryptographic algorithms. The result must have these fields: `isSignatureAlgorithmApproved`, `isNoneAttackDetected`.",
    "eStarter": "function sanitizeJwtHeader(hdr) {\n  // TODO: write your code here\n}",
    "eHint": "Verify alg is HS256, RS256, or ES256 and reject NONE.",
    "eTest": "const pass = sanitizeJwtHeader({ alg: 'HS256', typ: 'JWT' });\nconst fail = sanitizeJwtHeader({ alg: 'none', typ: 'JWT' });\nif (!pass.isSignatureAlgorithmApproved || fail.isSignatureAlgorithmApproved || !fail.isNoneAttackDetected) throw new Error('JWT sanitizer failed');",
    "aTitle": "JWT Approved Algorithm Checker",
    "aDesc": "Implement function isApprovedJwtAlgorithm(alg, approvedList = ['HS256', 'RS256', 'ES256']) returning true if `alg !== 'none'` and `approvedList.includes(alg)`, otherwise false.",
    "aStarter": "function isApprovedJwtAlgorithm(alg, list) {\n  // TODO: write your code here\n}",
    "aHint": "Reject 'none' and check presence in list.",
    "aTest": "if (!isApprovedJwtAlgorithm('HS256')) throw new Error('HS256 should pass');\nif (!isApprovedJwtAlgorithm('RS256')) throw new Error('RS256 should pass');\nif (isApprovedJwtAlgorithm('none')) throw new Error('none must fail');\nif (isApprovedJwtAlgorithm('MD5')) throw new Error('MD5 must fail');"
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
    "eDesc": "Implement function calculateTotpTimeStep(currentTimestampSec, timeStepDurationSec) calculating current time-step counter $T = \\lfloor t / 30 \\rfloor$ and generating acceptable drift window $[T-1, T, T+1]$. Use these exact values: `status`: 'TOTP_TIME_STEP_CALCULATED_NOMINAL'. The result must have the field: `currentStepCounter`.",
    "eStarter": "function calculateTotpTimeStep(tSec, stepDur) {\n  // TODO: write your code here\n}",
    "eHint": "step = Math.floor(tSec / stepDur), validDriftWindow = [step-1, step, step+1].",
    "eTest": "const res1 = calculateTotpTimeStep(1600000000, 30);\nif (res1.currentStepCounter !== 53333333 || res1.validDriftWindow[0] !== 53333332 || res1.status !== 'TOTP_TIME_STEP_CALCULATED_NOMINAL') throw new Error('TOTP step 1 failed');\nconst res2 = calculateTotpTimeStep(1600000060, 30);\nif (res2.currentStepCounter !== 53333335 || res2.validDriftWindow[0] !== 53333334) throw new Error('TOTP step 2 failed');",
    "aTitle": "TOTP Time-Step Counter Formatter",
    "aDesc": "Implement function getTotpStep(epochSec, stepDuration = 30) returning `Math.floor(epochSec / stepDuration)`.",
    "aStarter": "function getTotpStep(epoch, step) {\n  // TODO: write your code here\n}",
    "aHint": "Math.floor(epoch / (step || 30)).",
    "aTest": "if (getTotpStep(1600000000, 30) !== 53333333) throw new Error('Step check failed for 1600000000');\nif (getTotpStep(90, 30) !== 3) throw new Error('Step check failed for 90s');\nif (getTotpStep(59, 30) !== 1) throw new Error('Step check failed for 59s');"
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
    "eDesc": "Implement function evaluateAccessDecision(userRoles, requiredRole, environmentContext) checking that the user possesses `requiredRole` and that environmental attributes (e.g. `isMfaVerified: true`) satisfy access policies. Use these exact values: `status`: 'ACCESS_GRANTED_NOMINAL'. The result must have the field: `isAccessGranted`.",
    "eStarter": "function evaluateAccessDecision(roles, reqRole, env) {\n  // TODO: write your code here\n}",
    "eHint": "Check hasRole and env conditions.",
    "eTest": "const pass = evaluateAccessDecision(['ENGINEER', 'SECURITY_ANALYST'], 'SECURITY_ANALYST', { isMfaVerified: true, isIpAllowed: true });\nconst fail = evaluateAccessDecision(['GUEST'], 'SECURITY_ANALYST', { isMfaVerified: true, isIpAllowed: true });\nif (!pass.isAccessGranted || fail.isAccessGranted || pass.status !== 'ACCESS_GRANTED_NOMINAL') throw new Error('Access decision failed');",
    "aTitle": "Role Permission Checker",
    "aDesc": "Implement function checkRolePermission(userRoles, rolePermissionsMap, requiredPermission) returning true if any of the user's roles grants `requiredPermission`, else false.",
    "aStarter": "function checkRolePermission(roles, map, perm) {\n  // TODO: write your code here\n}",
    "aHint": "Iterate roles and check if rolePermissionsMap[role] includes requiredPermission.",
    "aTest": "const perms = { ADMIN: ['READ', 'WRITE', 'DELETE'], USER: ['READ'] };\nif (!checkRolePermission(['ADMIN'], perms, 'DELETE')) throw new Error('Admin delete should pass');\nif (checkRolePermission(['USER'], perms, 'DELETE')) throw new Error('User delete should fail');\nif (!checkRolePermission(['USER'], perms, 'READ')) throw new Error('User read should pass');"
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
    "eDesc": "Implement function authorizeResourceAccess(authenticatedUserId, userRole, resourceOwnerId) verifying that non-admin users can ONLY read resources matching their own `userId`. Use these exact values: `status`: 'BOLA_UNAUTHORIZED_OBJECT_ACCESS_BLOCKED'. The result must have the field: `isAuthorized`.",
    "eStarter": "function authorizeResourceAccess(userId, role, ownerId) {\n  // TODO: write your code here\n}",
    "eHint": "isApproved = role === 'ADMIN' || userId === ownerId.",
    "eTest": "const owner = authorizeResourceAccess('usr_123', 'USER', 'usr_123');\nconst intruder = authorizeResourceAccess('usr_attacker', 'USER', 'usr_victim');\nif (!owner.isAuthorized || intruder.isAuthorized || intruder.status !== 'BOLA_UNAUTHORIZED_OBJECT_ACCESS_BLOCKED') throw new Error('BOLA authorization failed');",
    "aTitle": "Multi-Tenant Object Ownership Validator",
    "aDesc": "Implement function isTenantObjectAccessible(userTenantId, objectTenantId, isSuperAdmin = false) returning true if `isSuperAdmin === true` or `userTenantId === objectTenantId`, otherwise false.",
    "aStarter": "function isTenantObjectAccessible(uTenant, oTenant, isAdmin) {\n  // TODO: write your code here\n}",
    "aHint": "Check isAdmin === true || uTenant === oTenant.",
    "aTest": "if (!isTenantObjectAccessible('tenant_a', 'tenant_a', false)) throw new Error('Same tenant should pass');\nif (isTenantObjectAccessible('tenant_a', 'tenant_b', false)) throw new Error('Different tenant should fail');\nif (!isTenantObjectAccessible('tenant_a', 'tenant_b', true)) throw new Error('Admin access should pass across tenants');"
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
    "eDesc": "Implement function monitorSynConnectionBacklog(currentHalfOpenCount, maxBacklogCapacity) detecting SYN flood saturation ($> 90\\%$ capacity) and triggering SYN Cookie mitigation. Use these exact values: `status`: 'SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED'. The result must have the field: `isSynFloodDetected`.",
    "eStarter": "function monitorSynConnectionBacklog(halfOpen, maxCap) {\n  // TODO: write your code here\n}",
    "eHint": "utilization = halfOpen / maxCap, isFlood = utilization >= 0.9.",
    "eTest": "const normal = monitorSynConnectionBacklog(100, 1000); // 10%\nconst attack = monitorSynConnectionBacklog(950, 1000); // 95%\nif (normal.isSynFloodDetected || !attack.isSynFloodDetected || attack.status !== 'SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED') throw new Error('SYN monitor failed');",
    "aTitle": "Connection Backlog Capacity Calculator",
    "aDesc": "Implement function calculateBacklogUtilization(currentHalfOpen, maxCapacity) returning `{ utilization: Number((currentHalfOpen / maxCapacity).toFixed(2)), isCritical: (currentHalfOpen / maxCapacity) >= 0.9 }`.",
    "aStarter": "function calculateBacklogUtilization(cur, max) {\n  // TODO: write your code here\n}",
    "aHint": "Calculate ratio and check threshold.",
    "aTest": "const n = calculateBacklogUtilization(200, 1000);\nif (n.utilization !== 0.2 || n.isCritical !== false) throw new Error('Normal backlog failed');\nconst c = calculateBacklogUtilization(950, 1000);\nif (c.utilization !== 0.95 || c.isCritical !== true) throw new Error('Critical backlog failed');"
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
    "eDesc": "Implement function auditHttpSecurityHeaders(headersMap) verifying that HSTS, X-Content-Type-Options, and X-Frame-Options are present and configured securely. Use these exact values: `status`: 'SECURITY_HEADERS_COMPLIANT_NOMINAL' or 'INSECURE_HEADER_CONFIGURATION_DETECTED'. The result must have the field: `isHeaderSuiteCompliant`.",
    "eStarter": "function auditHttpSecurityHeaders(hdrs) {\n  // TODO: write your code here\n}",
    "eHint": "Verify strict-transport-security, nosniff, and x-frame-options.",
    "eTest": "const pass = auditHttpSecurityHeaders({\n  'strict-transport-security': 'max-age=31536000; includeSubDomains',\n  'x-content-type-options': 'nosniff',\n  'x-frame-options': 'DENY'\n});\nif (!pass.isHeaderSuiteCompliant || pass.status !== 'SECURITY_HEADERS_COMPLIANT_NOMINAL') throw new Error('Headers audit pass failed');\nconst fail = auditHttpSecurityHeaders({\n  'x-frame-options': 'DENY'\n});\nif (fail.isHeaderSuiteCompliant || fail.status !== 'INSECURE_HEADER_CONFIGURATION_DETECTED') throw new Error('Missing headers must fail');",
    "aTitle": "Security Header Formatter",
    "aDesc": "Implement function formatHstsHeader(maxAgeSeconds = 31536000, includeSubDomains = true) returning `max-age=${maxAgeSeconds}${includeSubDomains ? '; includeSubDomains' : ''}`.",
    "aStarter": "function formatHstsHeader(sec, sub) {\n  // TODO: write your code here\n}",
    "aHint": "Format HSTS string.",
    "aTest": "if (formatHstsHeader(31536000, true) !== 'max-age=31536000; includeSubDomains') throw new Error('Full HSTS failed');\nif (formatHstsHeader(86400, false) !== 'max-age=86400') throw new Error('Basic HSTS failed');"
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
    "eDesc": "Implement function executeCryptoIdentityMaster(gcmOk, argonOk, pkiOk, jwtOk, totpOk) certifying combined cryptographic identity engine execution. Use these exact values: `engineStatus`: 'CRYPTO_IDENTITY_MASTER_ACTIVE' or 'CRYPTO_IDENTITY_DEFECT'.",
    "eStarter": "function executeCryptoIdentityMaster(g, a, p, j, t) {\n  // TODO: write your code here\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const pass = executeCryptoIdentityMaster(true, true, true, true, true);\nif (!pass || pass.engineStatus !== 'CRYPTO_IDENTITY_MASTER_ACTIVE') throw new Error('Milestone 2 crypto master all pass failed');\nconst fail = executeCryptoIdentityMaster(true, true, false, true, true);\nif (!fail || fail.engineStatus !== 'CRYPTO_IDENTITY_DEFECT') throw new Error('Milestone 2 crypto master rejection failed');",
    "aTitle": "Crypto Identity Master Certification Auditor",
    "aDesc": "Implement function auditCryptoIdentityStatus(score, totalScore = 5) returning `{ certified: score === totalScore, scoreText: \`${score}/${totalScore}\`, grade: score === totalScore ? 'ENTERPRISE_CRYPTO_CERTIFIED' : 'REMEDIATION_REQUIRED' }`.",
    "aStarter": "function auditCryptoIdentityStatus(score, total) {\n  // TODO: write your code here\n}",
    "aHint": "Compare score with total and return audit grade object.",
    "aTest": "const pass = auditCryptoIdentityStatus(5, 5);\nif (!pass.certified || pass.grade !== 'ENTERPRISE_CRYPTO_CERTIFIED' || pass.scoreText !== '5/5') throw new Error('Pass audit failed');\nconst fail = auditCryptoIdentityStatus(3, 5);\nif (fail.certified || fail.grade !== 'REMEDIATION_REQUIRED' || fail.scoreText !== '3/5') throw new Error('Fail audit failed');"
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
    "eDesc": "Implement function filterSsrfUrl(targetUrl) blocking requests targeting `169.254.169.254`, `localhost`, `127.0.0.1`, `10.*`, `192.168.*`, or `172.16-31.*`. Use these exact values: `status`: 'SSRF_ATTACK_DETECTED_BLOCKED'. The result must have the field: `isAllowed`.",
    "eStarter": "function filterSsrfUrl(urlStr) {\n  // TODO: write your code here\n}",
    "eHint": "Check for 169.254.169.254, localhost, 127.0.0.1, 10.*, 192.168.*.",
    "eTest": "const cloudMeta = filterSsrfUrl('http://169.254.169.254/latest/meta-data/');\nconst publicApi = filterSsrfUrl('https://api.github.com/users');\nif (cloudMeta.isAllowed || !publicApi.isAllowed || cloudMeta.status !== 'SSRF_ATTACK_DETECTED_BLOCKED') throw new Error('SSRF filter failed');",
    "aTitle": "Cloud Metadata IP Address Validator",
    "aDesc": "Implement function isCloudMetadataIp(ip) returning true if ip is AWS IPv4 metadata ('169.254.169.254') or IPv6 ('fd00:ec2::254'), otherwise false.",
    "aStarter": "function isCloudMetadataIp(ip) {\n  // TODO: write your code here\n}",
    "aHint": "Check for 169.254.169.254 or fd00:ec2::254.",
    "aTest": "if (!isCloudMetadataIp('169.254.169.254')) throw new Error('169.254.169.254 should be true');\nif (!isCloudMetadataIp('fd00:ec2::254')) throw new Error('IPv6 metadata should be true');\nif (isCloudMetadataIp('8.8.8.8')) throw new Error('8.8.8.8 should be false');"
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
    "eDesc": "Implement function detectInsecureSerialization(rawPayloadStr) identifying dangerous serialization magic headers such as Java `0xACED0005`, Python `pickle`, or PHP `O:4:\"User\"` object injections. Use these exact values: `status`: 'INSECURE_DESERIALIZATION_PAYLOAD_DETECTED'. The result must have the field: `isDangerousObjectSerialization`.",
    "eStarter": "function detectInsecureSerialization(payload) {\n  // TODO: write your code here\n}",
    "eHint": "Check for Java magic bytes, python pickle system calls, and PHP serialized objects.",
    "eTest": "const javaAttack = detectInsecureSerialization('rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAU=');\nconst safeJson = detectInsecureSerialization('{\"user\":\"alice\",\"id\":123}');\nif (!javaAttack.isDangerousObjectSerialization || safeJson.isDangerousObjectSerialization || javaAttack.status !== 'INSECURE_DESERIALIZATION_PAYLOAD_DETECTED') throw new Error('Deserialization detector failed');",
    "aTitle": "Java Serialization Magic Header Validator",
    "aDesc": "Implement function isJavaSerializationMagic(magicHex) returning true if hex string is case-insensitively equal to 'aced0005', else false.",
    "aStarter": "function isJavaSerializationMagic(magicHex) {\n  // TODO: write your code here\n}",
    "aHint": "Normalize to lowercase and compare to aced0005.",
    "aTest": "if (!isJavaSerializationMagic('aced0005')) throw new Error('aced0005 should pass');\nif (!isJavaSerializationMagic('ACED0005')) throw new Error('Uppercase ACED0005 should pass');\nif (isJavaSerializationMagic('deadbeef')) throw new Error('deadbeef should fail');"
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
    "eDesc": "Implement function calculateShannonEntropy(inputString) computing character distribution entropy $H = -\\sum p_i \\log_2(p_i)$ with high entropy ($H \\ge 4.5$) flagging random cryptographic keys. Use these exact values: `status`: 'HIGH_ENTROPY_SECRET_DETECTED'. The result must have the field: `isHighEntropySecret`.",
    "eStarter": "function calculateShannonEntropy(str) {\n  // TODO: write your code here\n}",
    "eHint": "Calculate character frequencies and sum -p * Math.log2(p).",
    "eTest": "const secret = calculateShannonEntropy('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'); // high entropy\nconst regular = calculateShannonEntropy('aaaaaaaaaaaaaaaa'); // 0 entropy\nif (regular.entropy !== 0.0 || !secret.isHighEntropySecret || secret.status !== 'HIGH_ENTROPY_SECRET_DETECTED') throw new Error('Entropy calculation failed');",
    "aTitle": "AWS Access Key Format Validator",
    "aDesc": "Implement function isValidAwsAccessKeyFormat(key) returning true if key starts with 'AKIA', is 20 uppercase alphanumeric characters, else false.",
    "aStarter": "function isValidAwsAccessKeyFormat(key) {\n  // TODO: write your code here\n}",
    "aHint": "Check startsWith('AKIA'), length === 20, and uppercase alphanumeric characters.",
    "aTest": "if (!isValidAwsAccessKeyFormat('AKIAIOSFODNN7EXAMPLE')) throw new Error('Valid AKIA key failed');\nif (isValidAwsAccessKeyFormat('BKIAIOSFODNN7EXAMPLE')) throw new Error('Non-AKIA key should fail');\nif (isValidAwsAccessKeyFormat('AKIA123')) throw new Error('Short key should fail');"
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
    "eDesc": "Implement function matchSbomVulnerabilities(dependenciesList, cveDatabase) finding outdated dependencies matching known CVE records. The result must have these fields: `vulnerableDependenciesCount`, `vulnerabilities`, `cveId`.",
    "eStarter": "function matchSbomVulnerabilities(deps, cveDb) {\n  // TODO: write your code here\n}",
    "eHint": "Match dep.name and dep.version against cveDb.",
    "eTest": "const deps = [{ name: 'lodash', version: '4.17.15' }, { name: 'express', version: '4.18.2' }];\nconst cveDb = [{ packageName: 'lodash', vulnerableVersion: '4.17.15', id: 'CVE-2020-8203', severity: 'HIGH' }];\nconst res = matchSbomVulnerabilities(deps, cveDb);\nif (res.vulnerableDependenciesCount !== 1 || res.vulnerabilities[0].cveId !== 'CVE-2020-8203') throw new Error('SBOM matcher failed');\nconst cleanDeps = [{ name: 'react', version: '18.2.0' }];\nconst resClean = matchSbomVulnerabilities(cleanDeps, cveDb);\nif (resClean.vulnerableDependenciesCount !== 0 || resClean.vulnerabilities.length !== 0) throw new Error('Clean SBOM failed');",
    "aTitle": "Package URL (PURL) Formatter",
    "aDesc": "Implement function formatPackagePurl(type, namespace, name, version) returning `pkg:${type}/${namespace ? namespace + '/' : ''}${name}@${version}`.",
    "aStarter": "function formatPackagePurl(type, ns, name, ver) {\n  // TODO: write your code here\n}",
    "aHint": "Format PURL string with type, optional namespace, name and version.",
    "aTest": "if (formatPackagePurl('npm', '', 'lodash', '4.17.21') !== 'pkg:npm/lodash@4.17.21') throw new Error('npm purl failed');\nif (formatPackagePurl('golang', 'github.com/gin-gonic', 'gin', 'v1.9.1') !== 'pkg:golang/github.com/gin-gonic/gin@v1.9.1') throw new Error('golang purl failed');"
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
    "eDesc": "Implement function processTokenBucketRequest(currentTokens, maxCapacity, refillRatePerSec, timeElapsedSec, costPerRequest) refilling bucket and deducting cost if available. Use these exact values: `status`: 'RATE_LIMIT_EXCEEDED_HTTP_429'. The result must have the field: `isRequestAllowed`.",
    "eStarter": "function processTokenBucketRequest(currTokens, maxCap, refillRate, elapsedSec, cost) {\n  // TODO: write your code here\n}",
    "eHint": "refilled = min(maxCap, curr + refillRate * elapsed), if refilled >= cost deduct cost.",
    "eTest": "const pass = processTokenBucketRequest(5, 10, 1, 2, 1); // 5 + 2 = 7 >= 1 -> remaining 6\nconst fail = processTokenBucketRequest(0, 10, 1, 0, 1); // 0 < 1 -> remaining 0, HTTP 429\nif (!pass.isRequestAllowed || fail.isRequestAllowed || fail.status !== 'RATE_LIMIT_EXCEEDED_HTTP_429') throw new Error('Rate limiter failed');",
    "aTitle": "Rate Limit Threshold Checker",
    "aDesc": "Implement function isRateLimitBreached(requestCount, maxAllowed) returning true if requestCount exceeds maxAllowed, else false.",
    "aStarter": "function isRateLimitBreached(reqCount, maxAllowed) {\n  // TODO: write your code here\n}",
    "aHint": "Check reqCount > maxAllowed.",
    "aTest": "if (!isRateLimitBreached(101, 100)) throw new Error('101/100 should be true');\nif (isRateLimitBreached(99, 100)) throw new Error('99/100 should be false');\nif (isRateLimitBreached(100, 100)) throw new Error('100/100 should be false');"
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
    "eDesc": "Implement function executeRuntimeDefenseMaster(ssrfOk, deserOk, entropyOk, sbomOk, rateOk) certifying combined runtime defense execution. Use these exact values: `engineStatus`: 'RUNTIME_DEFENSE_MASTER_ACTIVE' or 'RUNTIME_DEFENSE_DEFECT'.",
    "eStarter": "function executeRuntimeDefenseMaster(s, d, e, b, r) {\n  // TODO: write your code here\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeRuntimeDefenseMaster(true, true, true, true, true);\nif (!res || res.engineStatus !== 'RUNTIME_DEFENSE_MASTER_ACTIVE') throw new Error('Milestone 3 runtime master failed');\nconst fail = executeRuntimeDefenseMaster(true, true, false, true, true);\nif (!fail || fail.engineStatus !== 'RUNTIME_DEFENSE_DEFECT') throw new Error('Runtime master defect failed');",
    "aTitle": "Runtime Defense Score Formatter",
    "aDesc": "Implement function formatRuntimeDefenseScore(passedCount, totalCount = 5) returning `{ percentage: Math.round((passedCount / totalCount) * 100), isSecure: passedCount === totalCount, statusText: \`${passedCount}/${totalCount}\` }`.",
    "aStarter": "function formatRuntimeDefenseScore(p, t) {\n  // TODO: write your code here\n}",
    "aHint": "Compute percentage and check passedCount === totalCount.",
    "aTest": "const pass = formatRuntimeDefenseScore(5, 5);\nif (!pass.isSecure || pass.percentage !== 100 || pass.statusText !== '5/5') throw new Error('Pass score failed');\nconst fail = formatRuntimeDefenseScore(3, 5);\nif (fail.isSecure || fail.percentage !== 60 || fail.statusText !== '3/5') throw new Error('Fail score failed');"
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
    "eDesc": "Implement function detectStackOverflow(allocatedBufferSize, incomingPayloadSize, canaryValue, currentCanaryMemory) verifying buffer bounds and detecting modified canary cookies. Use these exact values: `status`: 'STACK_SMASHING_DETECTED_TERMINATING_PROCESS'. The result must have the field: `isExploitDetected`.",
    "eStarter": "function detectStackOverflow(bufSize, payloadSize, originalCanary, memoryCanary) {\n  // TODO: write your code here\n}",
    "eHint": "Check if payloadSize > bufSize or canary differs.",
    "eTest": "const attack = detectStackOverflow(64, 128, '0xDEADBEEF', '0x41414141');\nconst safe = detectStackOverflow(64, 32, '0xDEADBEEF', '0xDEADBEEF');\nif (!attack.isExploitDetected || safe.isExploitDetected || attack.status !== 'STACK_SMASHING_DETECTED_TERMINATING_PROCESS') throw new Error('Buffer overflow detector failed');",
    "aTitle": "Stack Canary Integrity Checker",
    "aDesc": "Implement function isStackCanaryValid(expectedCanary, observedCanary) returning true if the observed memory canary matches the expected canary cookie, else false.",
    "aStarter": "function isStackCanaryValid(expected, observed) {\n  // TODO: write your code here\n}",
    "aHint": "Check expected === observed.",
    "aTest": "if (!isStackCanaryValid('0xDEADBEEF', '0xDEADBEEF')) throw new Error('Identical canary failed');\nif (isStackCanaryValid('0xDEADBEEF', '0x41414141')) throw new Error('Corrupted canary should fail');"
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
    "eDesc": "Implement function trackMemoryPointerLifecycle(pointerState, requestedAction) state machine enforcing that freed pointers cannot be dereferenced (`USE_AFTER_FREE_BLOCKED`). Use these exact values: `status`: 'USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED'. The result must have the field: `isMemoryViolation`.",
    "eStarter": "function trackMemoryPointerLifecycle(state, action) {\n  // TODO: write your code here\n}",
    "eHint": "Flag violation if action is FREE when state is FREED, or action is DEREFERENCE when state is FREED/NULL.",
    "eTest": "const uaf = trackMemoryPointerLifecycle('FREED', 'DEREFERENCE');\nconst valid = trackMemoryPointerLifecycle('ALLOCATED', 'READ');\nif (!uaf.isMemoryViolation || valid.isMemoryViolation || uaf.status !== 'USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED') throw new Error('Memory safety tracker failed');",
    "aTitle": "Memory Violation Classifier",
    "aDesc": "Implement function classifyMemoryViolation(pointerState, action) returning 'USE_AFTER_FREE' if pointerState is 'FREED' and action is 'READ' or 'WRITE', 'DOUBLE_FREE' if pointerState is 'FREED' and action is 'FREE', otherwise 'SAFE'.",
    "aStarter": "function classifyMemoryViolation(state, action) {\n  // TODO: write your code here\n}",
    "aHint": "Check pointerState and action to return 'USE_AFTER_FREE', 'DOUBLE_FREE', or 'SAFE'.",
    "aTest": "if (classifyMemoryViolation('FREED', 'READ') !== 'USE_AFTER_FREE') throw new Error('UAF check failed');\nif (classifyMemoryViolation('FREED', 'FREE') !== 'DOUBLE_FREE') throw new Error('Double free check failed');\nif (classifyMemoryViolation('ALLOCATED', 'READ') !== 'SAFE') throw new Error('Safe check failed');"
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
    "eDesc": "Implement function correlateSiemLogEvents(eventLogsArray, timeWindowSec, thresholdCount) grouping failed logins by source IP and raising a high-priority alert if threshold is breached within window. Use these exact values: `status`: 'SIEM_BRUTE_FORCE_ATTACK_CORRELATED_ALERT' or 'SIEM_LOGS_NOMINAL'. The result must have these fields: `isBruteForceAlert`, `threatSourceIp`.",
    "eStarter": "function correlateSiemLogEvents(logs, windowSec, thresh) {\n  // TODO: write your code here\n}",
    "eHint": "Count AUTH_FAILED per sourceIp and alert if >= thresh.",
    "eTest": "const logs = [\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 100 },\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 105 },\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 110 }\n];\nconst res = correlateSiemLogEvents(logs, 60, 3);\nif (!res.isBruteForceAlert || res.threatSourceIp !== '198.51.100.4' || res.status !== 'SIEM_BRUTE_FORCE_ATTACK_CORRELATED_ALERT') throw new Error('SIEM engine failed');\nconst normalLogs = [{ action: 'AUTH_SUCCESS', sourceIp: '10.0.0.1', timestamp: 100 }];\nconst normalRes = correlateSiemLogEvents(normalLogs, 60, 3);\nif (normalRes.isBruteForceAlert || normalRes.status !== 'SIEM_LOGS_NOMINAL') throw new Error('SIEM normal logs failed');",
    "aTitle": "Malicious IP Threat Intelligence Checker",
    "aDesc": "Implement function isMaliciousIp(ip, threatIntelList) returning true if ip is in threatIntelList, else false.",
    "aStarter": "function isMaliciousIp(ip, list) {\n  // TODO: write your code here\n}",
    "aHint": "Check threatIntelList.includes(ip).",
    "aTest": "const blacklist = ['198.51.100.4', '203.0.113.50'];\nif (!isMaliciousIp('198.51.100.4', blacklist)) throw new Error('Blacklisted IP failed');\nif (isMaliciousIp('10.0.0.1', blacklist)) throw new Error('Clean IP should fail');"
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
    "eDesc": "Implement function matchSnortSignature(packetProtocol, packetDstPort, packetPayload, ruleConfig) triggering an alert if protocol, port, and payload signature content match. The result must have the field: `isSignatureTriggered`.",
    "eStarter": "function matchSnortSignature(proto, port, payload, rule) {\n  // TODO: write your code here\n}",
    "eHint": "Verify proto, port, and payload.includes(rule.content).",
    "eTest": "const rule = { sid: 1001, msg: 'Nmap Scan', protocol: 'TCP', dstPort: 80, content: 'Nmap', action: 'DROP' };\nconst attack = matchSnortSignature('TCP', 80, 'GET / HTTP/1.1 User-Agent: Nmap', rule);\nconst clean = matchSnortSignature('TCP', 80, 'GET / HTTP/1.1 User-Agent: Mozilla', rule);\nif (!attack.isSignatureTriggered || clean.isSignatureTriggered || attack.action !== 'DROP') throw new Error('Snort matcher failed');",
    "aTitle": "Snort Rule Header Formatter",
    "aDesc": "Implement function formatSnortRuleHeader(action, protocol, srcIp, srcPort, dstIp, dstPort) returning `${action} ${protocol} ${srcIp} ${srcPort} -> ${dstIp} ${dstPort}`.",
    "aStarter": "function formatSnortRuleHeader(a, pr, si, sp, di, dp) {\n  // TODO: write your code here\n}",
    "aHint": "Format rule header with action, protocol, source and destination ip/port.",
    "aTest": "if (formatSnortRuleHeader('alert', 'tcp', '$EXTERNAL_NET', 'any', '$HOME_NET', '80') !== 'alert tcp $EXTERNAL_NET any -> $HOME_NET 80') throw new Error('Snort rule header failed');\nif (formatSnortRuleHeader('drop', 'udp', 'any', 'any', '$HOME_NET', '53') !== 'drop udp any any -> $HOME_NET 53') throw new Error('DNS drop rule header failed');"
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
    "eDesc": "Implement function categorizeCvssScore(baseScore) mapping numerical score ($[0.0, 10.0]$) to `'NONE'`, `'LOW'`, `'MEDIUM'`, `'HIGH'`, or `'CRITICAL'` according to the official CVSS v3.1 specification. Use these exact values: `status`: 'CVSS_RATING_CALCULATED_NOMINAL'. The result must have these fields: `g`, `Log4Shell`, `severityRating`.",
    "eStarter": "function categorizeCvssScore(score) {\n  // TODO: write your code here\n}",
    "eHint": "0.0 None, <4.0 Low, <7.0 Medium, <9.0 High, else Critical.",
    "eTest": "const crit = categorizeCvssScore(9.8); // Critical (e.g. Log4Shell)\nconst med = categorizeCvssScore(5.3); // Medium\nif (crit.severityRating !== 'CRITICAL' || med.severityRating !== 'MEDIUM' || crit.status !== 'CVSS_RATING_CALCULATED_NOMINAL') throw new Error('CVSS categorizer failed');",
    "aTitle": "CVSS Qualitative Severity Rating Calculator",
    "aDesc": "Implement function getCvssSeverity(score) returning 'NONE' for score <= 0, 'LOW' for score < 4.0, 'MEDIUM' for score < 7.0, 'HIGH' for score < 9.0, and 'CRITICAL' otherwise.",
    "aStarter": "function getCvssSeverity(score) {\n  // TODO: write your code here\n}",
    "aHint": "Map numerical score to 'NONE', 'LOW', 'MEDIUM', 'HIGH', or 'CRITICAL'.",
    "aTest": "if (getCvssSeverity(9.8) !== 'CRITICAL') throw new Error('9.8 should be CRITICAL');\nif (getCvssSeverity(7.5) !== 'HIGH') throw new Error('7.5 should be HIGH');\nif (getCvssSeverity(5.3) !== 'MEDIUM') throw new Error('5.3 should be MEDIUM');\nif (getCvssSeverity(2.1) !== 'LOW') throw new Error('2.1 should be LOW');\nif (getCvssSeverity(0.0) !== 'NONE') throw new Error('0.0 should be NONE');"
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
    "eDesc": "Implement function evaluateZeroTrustPolicy(isIdentityValid, isDeviceHealthy, isLocationRiskLow) verifying that all 3 dynamic posture signals evaluate to true for every single micro-service request. Use these exact values: `status`: 'ZERO_TRUST_VERIFICATION_FAILED_ACCESS_REVOKED'. The result must have the field: `zeroTrustAccessGranted`.",
    "eStarter": "function evaluateZeroTrustPolicy(idValid, devHealthy, locLowRisk) {\n  // TODO: write your code here\n}",
    "eHint": "isApproved = idValid && devHealthy && locLowRisk.",
    "eTest": "const pass = evaluateZeroTrustPolicy(true, true, true);\nconst fail = evaluateZeroTrustPolicy(true, false, true); // unhealthy device\nif (!pass.zeroTrustAccessGranted || fail.zeroTrustAccessGranted || fail.status !== 'ZERO_TRUST_VERIFICATION_FAILED_ACCESS_REVOKED') throw new Error('Zero trust evaluator failed');",
    "aTitle": "Zero Trust Contextual Posture Evaluator",
    "aDesc": "Implement function isZeroTrustRequestCompliant(deviceCompliant, userMfaVerified, ipReputationScore) returning true if deviceCompliant && userMfaVerified && ipReputationScore >= 80, else false.",
    "aStarter": "function isZeroTrustRequestCompliant(dev, mfa, score) {\n  // TODO: write your code here\n}",
    "aHint": "Verify deviceCompliant, userMfaVerified, and score >= 80.",
    "aTest": "if (!isZeroTrustRequestCompliant(true, true, 95)) throw new Error('Healthy request failed');\nif (isZeroTrustRequestCompliant(true, true, 60)) throw new Error('Low reputation IP should fail');\nif (isZeroTrustRequestCompliant(false, true, 95)) throw new Error('Non-compliant device should fail');"
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
    "eDesc": "Implement function auditAwsIamPolicy(policyStatement) flagging overly permissive wildcard actions (`Action: \"*\"` or `Resource: \"*\"` with `Effect: \"Allow\"`). Use these exact values: `status`: 'OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED'. The result must have the field: `isPolicyCompliant`.",
    "eStarter": "function auditAwsIamPolicy(statement) {\n  // TODO: write your code here\n}",
    "eHint": "Flag excessive privilege if Effect === 'Allow' and Action or Resource is '*'.",
    "eTest": "const risky = auditAwsIamPolicy({ Effect: 'Allow', Action: '*', Resource: '*' });\nconst secure = auditAwsIamPolicy({ Effect: 'Allow', Action: ['s3:GetObject'], Resource: 'arn:aws:s3:::mybucket/*' });\nif (risky.isPolicyCompliant || !secure.isPolicyCompliant || risky.status !== 'OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED') throw new Error('IAM auditor failed');",
    "aTitle": "IAM Wildcard Privilege Auditor",
    "aDesc": "Implement function hasWildcardPermission(actions) returning true if actions string or array contains '*' or '*.*', else false.",
    "aStarter": "function hasWildcardPermission(actions) {\n  // TODO: write your code here\n}",
    "aHint": "Check if actions is '*' or array containing '*' or '*.*'.",
    "aTest": "if (!hasWildcardPermission('*')) throw new Error('Wildcard string failed');\nif (!hasWildcardPermission(['s3:*', '*'])) throw new Error('Wildcard array failed');\nif (hasWildcardPermission(['s3:GetObject', 's3:PutObject'])) throw new Error('Restricted actions should fail');"
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
    "eDesc": "Implement function verifyForensicEvidenceIntegrity(originalEvidenceHash, currentEvidenceHash, isChainDocumented) certifying that evidence bit-stream has not been altered. Use these exact values: `status`: 'FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL'. The result must have the field: `isEvidenceAdmissible`.",
    "eStarter": "function verifyForensicEvidenceIntegrity(origHash, currHash, isDoc) {\n  // TODO: write your code here\n}",
    "eHint": "isCertified = origHash.toLowerCase() === currHash.toLowerCase() && isDoc === true.",
    "eTest": "const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';\nconst pass = verifyForensicEvidenceIntegrity(hash, hash, true);\nconst fail = verifyForensicEvidenceIntegrity(hash, 'tampered_hash', true);\nif (!pass.isEvidenceAdmissible || fail.isEvidenceAdmissible || pass.status !== 'FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL') throw new Error('Forensic verifier failed');",
    "aTitle": "Forensic Evidence Hash Matcher",
    "aDesc": "Implement function isForensicHashMatched(calculatedHash, storedEvidenceHash) returning true if hashes match case-insensitively, else false.",
    "aStarter": "function isForensicHashMatched(calc, stored) {\n  // TODO: write your code here\n}",
    "aHint": "Compare lowercase string representations.",
    "aTest": "const h = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';\nif (!isForensicHashMatched(h, h)) throw new Error('Exact hash failed');\nif (!isForensicHashMatched(h.toUpperCase(), h)) throw new Error('Case insensitive hash failed');\nif (isForensicHashMatched(h, 'deadbeef')) throw new Error('Different hash should fail');"
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
    "eDesc": "Implement function orchestrateCyberSecurityMasterSuite(appSecOk, cryptoOk, runtimeOk, systemsOk, governanceOk) certifying comprehensive enterprise cyber defense mastery. Use these exact values: `status`: 'SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL'. The result must have these fields: `sovereignCyberCertified`, `certified`.",
    "eStarter": "function orchestrateCyberSecurityMasterSuite(app, cry, run, sys, gov) {\n  // TODO: write your code here\n}",
    "eHint": "Verify all 5 module flags evaluate to true.",
    "eTest": "const ok = orchestrateCyberSecurityMasterSuite(true, true, true, true, true);\nconst fail = orchestrateCyberSecurityMasterSuite(true, true, false, true, true);\nif (!ok.sovereignCyberCertified || fail.sovereignCyberCertified || !ok.certified || ok.status !== 'SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL') throw new Error('Capstone orchestrator failed');",
    "aTitle": "Cybersecurity Master Certification Auditor",
    "aDesc": "Implement function auditCyberMasterCert(totalScore, passingThreshold = 100) returning `{ certified: totalScore >= passingThreshold, score: \`${totalScore}/${passingThreshold}\`, tier: totalScore >= passingThreshold ? 'SOVEREIGN_CYBERSECURITY_ARCHITECT_CERTIFIED' : 'REMEDIATION_REQUIRED' }`.",
    "aStarter": "function auditCyberMasterCert(totalScore, passingThreshold) {\n  // TODO: write your code here\n}",
    "aHint": "Compare totalScore to passingThreshold and return 'SOVEREIGN_CYBERSECURITY_ARCHITECT_CERTIFIED' or 'REMEDIATION_REQUIRED'.",
    "aTest": "const pass = auditCyberMasterCert(100, 100);\nif (!pass.certified || pass.tier !== 'SOVEREIGN_CYBERSECURITY_ARCHITECT_CERTIFIED' || pass.score !== '100/100') throw new Error('Pass cert failed');\nconst fail = auditCyberMasterCert(85, 100);\nif (fail.certified || fail.tier !== 'REMEDIATION_REQUIRED' || fail.score !== '85/100') throw new Error('Fail cert failed');"
  }
];

export const CYBER_30_DAYS_QUESTS: CourseQuest[] = CYBER_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('cyber', idx + 1, cfg)
);
