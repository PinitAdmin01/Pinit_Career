# Cybersecurity Principles & Secure Systems — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Cybersecurity Principles & Secure Systems (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🛡️ Course Overview
* **Name**: Cybersecurity Principles & Secure Systems
* **ID**: `course-cybersecurity`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Security Engineers / Penetration Testers / Secure Coding Auditors
* **Learning Interface**: WAF rules dashboards, network scanners output, threat models maps, and SAST pipeline reports.
* **Evaluation Sandbox**: Security engines checking SQL prepared queries, XSS sanitization templates, CSRF tokens, JWT expiration claims, AES cryptographic parameters, and path traversal vulnerabilities.

---

## 📅 Detailed Day-by-Day Syllabus

### 🛡️ Week 1: Network Architecture, Threat Modeling & Injection Preventions

#### 🟢 Day 1: Introduction to Cybersecurity & The Attack Surface
* **Lecture Syllabus**:
  - CIA Triad and threat models principles
  - Mapping server attack surfaces
  - Common entry points vulnerabilities
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Computer Networks, Ports & TLS Handshakes
* **Lecture Syllabus**:
  - TCP/IP stack and DNS lookups
  - HTTPS/TLS handshakes procedures
  - Common ports and sockets controls
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: SQL Injection Inputs Sanitization & Parameterization
* **Lecture Syllabus**:
  - SQL injection exploits parameters
  - Sanitizing quote inputs
  - Prepared statement parameterization rules
* **Coding Exam**: `cyber-basics-exam-day-3` (`sanitizeQuery`)
  - **Task**: Write a JS function `sanitizeQuery(input)` removing single and double quotes.
  - **Test**: `sanitizeQuery("SELECT * FROM users WHERE id = '1'") === 'SELECT * FROM users WHERE id = 1'`.
* **Coding Assignment**: `cyber-basics-assign-day-3` (`buildSafeQuery`)
  - **Task**: Write a JS function `buildSafeQuery(userId)` returning parameterized query.
  - **Test**: Maps userId to SQL query parameter.

#### 🟢 Day 4: Vulnerability Remediation: XSS script cleanups
* **Lecture Syllabus**:
  - Cross-Site Scripting (XSS) classifications
  - HTML entity escaping rules
  - Stripping malicious HTML elements
* **Coding Exam**: `cyber-basics-exam-day-4` (`sanitizeHtml`)
  - **Task**: Write a JS function `sanitizeHtml(input)` removing script tags.
  - **Test**: Removes tags case-insensitively.
* **Coding Assignment**: `cyber-basics-assign-day-4` (`escapeHtmlEntities`)
  - **Task**: Write a JS function `escapeHtmlEntities(input)` escaping characters.
  - **Test**: Escapes & to &amp;, < to &lt;, and > to &gt;.

#### 🟢 Day 5: CSRF token validation & state verification
* **Lecture Syllabus**:
  - CSRF request exploits mechanics
  - Session CSRF state tokens validation
  - Configuring SameSite cookie policies
* **Coding Exam**: `cyber-basics-exam-day-5` (`verifyCsrfToken`)
  - **Task**: Write a JS function `verifyCsrfToken(cookieToken, headerToken)` checking tokens matches.
  - **Test**: Checks token matching properties.
* **Coding Assignment**: `cyber-basics-assign-day-5` (`isSameSiteStrict`)
  - **Task**: Write a JS function `isSameSiteStrict(cookieHeader)` checking cookie headers.
  - **Test**: Flags SameSite=Strict value presence.

#### 🟢 Day 6: API Security: Token expiry and signature checks
* **Lecture Syllabus**:
  - JWT token claims format validation
  - Parsing expiration timestamps metrics
  - Validating Bearer authorization headers
* **Coding Exam**: `cyber-basics-exam-day-6` (`isJwtExpired`)
  - **Task**: Write a JS function `isJwtExpired(payload, currentEpoch)` checking tokens expiry.
  - **Test**: Checks expiration.
* **Coding Assignment**: `cyber-basics-assign-day-6` (`extractBearerToken`)
  - **Task**: Write a JS function `extractBearerToken(headerVal)` slicing token.
  - **Test**: Extracts tokens from Bearer headers prefix.

#### 🟢 Day 7: Symmetric Encryption: Cipher Block validations
* **Lecture Syllabus**:
  - Symmetric algorithms (AES-256)
  - Initialization Vector (IV) entropy requirements
  - Padding block alignments checks
* **Coding Exam**: `cyber-basics-exam-day-7` (`isIvLengthSafe`)
  - **Task**: Write a JS function `isIvLengthSafe(algorithm, bytes)` auditing IV dimensions.
  - **Test**: Enforces 16 bytes for AES-256 ciphers.
* **Coding Assignment**: `cyber-basics-assign-day-7` (`isAesKeyLengthSafe`)
  - **Task**: Write a JS function `isAesKeyLengthSafe(bitLength)` checking key size.
  - **Test**: Restricts keys to 256 bits.

---

### 🛡️ Week 2: Hashing Upgrades, Rate Limiting & Logs Auditing

#### 🟢 Day 8: Weak Hashing algorithms migrations rules
* **Lecture Syllabus**:
  - Weak hashes identifiers (MD5, SHA-1)
  - Salting and hashing algorithms upgrades
  - Password verify parameter limits
* **Coding Exam**: `cyber-basics-exam-day-8` (`isHashAlgorithmDeprecated`)
  - **Task**: Write a JS function `isHashAlgorithmDeprecated(algorithm)` identifying old hashes.
  - **Test**: Flags MD5 and SHA-1.
* **Coding Assignment**: `cyber-basics-assign-day-8` (`isBcryptHash`)
  - **Task**: Write a JS function `isBcryptHash(hash)` validating BCrypt outputs.
  - **Test**: Confirms starting prefix matches.

#### 🟢 Day 9: Rate Limiting: Sliding window request limits
* **Lecture Syllabus**:
  - Rate limiting sliding window algorithms
  - IP request count tracking rules
  - Configuring status code 429 pages
* **Coding Exam**: `cyber-basics-exam-day-9` (`isRateLimitExceeded`)
  - **Task**: Write a JS function `isRateLimitExceeded(requestsList, limit)` validating rate limits.
  - **Test**: Blocks requests lists exceeding limit.
* **Coding Assignment**: `cyber-basics-assign-day-9` (`getRequestsLeft`)
  - **Task**: Write a JS function `getRequestsLeft(requestsList, limit)` finding remaining slots.
  - **Test**: Subtracts list size.

#### 🟢 Day 10: System security logs integrity audits
* **Lecture Syllabus**:
  - Log scrubbing techniques
  - Parsing sensitive credential fields
  - Audit trails integrity checks
* **Coding Exam**: `cyber-basics-exam-day-10` (`scrubLogField`)
  - **Task**: Write a JS function `scrubLogField(logText, pattern)` sanitizing logs text.
  - **Test**: Redacts patterns elements.
* **Coding Assignment**: `cyber-basics-assign-day-10` (`isErrorLog`)
  - **Task**: Write a JS function `isErrorLog(logLine)` checking line severities.
  - **Test**: Flags ERROR or FATAL values presence.

#### 🟢 Day 11: Network Security: CORS origins whitelist checker
* **Lecture Syllabus**:
  - Cross-Origin Resource Sharing rules
  - Configuring server headers parameters
  - Origin whitelist controls validation
* **Coding Exam**: `cyber-basics-exam-day-11` (`isOriginAllowed`)
  - **Task**: Write a JS function `isOriginAllowed(origin, whitelist)` checking CORS.
  - **Test**: Compares origin with allowed list.
* **Coding Assignment**: `cyber-basics-assign-day-11` (`isWildcardAllowed`)
  - **Task**: Write a JS function `isWildcardAllowed(whitelist)` checking wildcards.
  - **Test**: Searches for * indicator.

#### 🟢 Day 12: SSRF: Server-Side Request Forgery URL auditor
* **Lecture Syllabus**:
  - Server-Side Request Forgery vulnerabilities
  - Blacklisting internal IP addresses (localhost)
  - Validating hostname parameters structures
* **Coding Exam**: `cyber-basics-exam-day-12` (`isSsrfUrlBlocked`)
  - **Task**: Write a JS function `isSsrfUrlBlocked(url)` blocking localhost.
  - **Test**: Blocks 127.0.0.1 or localhost mappings.
* **Coding Assignment**: `cyber-basics-assign-day-12` (`isHttpsSchema`)
  - **Task**: Write a JS function `isHttpsSchema(url)` checking schema strings.
  - **Test**: Flags starting with https://.

#### 🟢 Day 13: Command Injection validations & arguments escape
* **Lecture Syllabus**:
  - Command injection vulnerabilities
  - Shell command character escapes rules
  - Validating parameter arguments structures
* **Coding Exam**: `cyber-basics-exam-day-13` (`hasShellMetaCharacters`)
  - **Task**: Write a JS function `hasShellMetaCharacters(arg)` scanning arguments.
  - **Test**: Flags characters like ;, &, |, or $.
* **Coding Assignment**: `cyber-basics-assign-day-13` (`hasArgumentSpaces`)
  - **Task**: Write a JS function `hasArgumentSpaces(arg)` auditing variables formatting.
  - **Test**: Returns true if string contains spaces.

#### 🟢 Day 14: Directory Traversal: Path resolution audits
* **Lecture Syllabus**:
  - Directory traversal exploits (../)
  - Resolving absolute file paths paths
  - Restricting access to parent directories
* **Coding Exam**: `cyber-basics-exam-day-14` (`isPathTraversalBlocked`)
  - **Task**: Write a JS function `isPathTraversalBlocked(path)` blocking relative lookups.
  - **Test**: Flags dot-dot directory separators.
* **Coding Assignment**: `cyber-basics-assign-day-14` (`isExtensionAllowed`)
  - **Task**: Write a JS function `isExtensionAllowed(filename, allowedExts)` checking filename extensions.
  - **Test**: Compares extension suffix.

---

### 🛡️ Week 3: Threat Mitigation & SAST Compliances

#### 🟢 Day 15: Static Analysis & SAST pipeline automation
* **Lecture Syllabus**:
  - SAST static scan tools
  - Auditing compiler dependencies logs
  - Scanning code repositories for raw secrets
* **Coding Exam**: `cyber-basics-exam-day-15` (`isSecureRelease`)
  - **Task**: Write a JS function `isSecureRelease(report)` verifying build states.
  - **Test**: Confirms sastPass, depsOk, and noSecrets check metrics.
* **Coding Assignment**: `cyber-basics-assign-day-15` (`getSecurityRating`)
  - **Task**: Write a JS function `getSecurityRating(score)` rating releases.
  - **Test**: Outputs A, B, or F grades.

#### 🟢 Day 16: Final Capstone: Security & Secure Systems Audit
* **Lecture Syllabus**:
  - Auditing key validation setups
  - SQL injection prepared query reviews
  - Logging sanitations and access policies checks
* **Coding Exam**: `cyber-basics-exam-day-16` (`evaluateSystemSecurity`)
  - **Task**: Write a JS function `evaluateSystemSecurity(report)` evaluating system parameters.
  - **Test**: Checks authOk, sqlSafe, and logsSanitized flags.
* **Coding Assignment**: `cyber-basics-assign-day-16` (`getThreatSeverity`)
  - **Task**: Write a JS function `getThreatSeverity(score)` evaluating score.
  - **Test**: Emits high, medium, or low.

---

### 🛡️ Week 4: Applied Vulnerabilities Auditing & Capstone System Review

#### 🟢 Day 17: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Reviewing code injection preventions
  - Assembling security compliance checklists
  - Verifying logging scrub configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Secure Systems Audit (Review)
* **Lecture Syllabus**:
  - Assemble final systems security compliance report
  - Verify SQL prepared parameter inputs and HTML XSS escaping rules
  - Confirm CSRF cookies, path traversal blockers, and SAST pipeline release configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
