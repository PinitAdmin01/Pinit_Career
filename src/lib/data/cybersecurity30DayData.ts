import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const CYBER_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is Cybersecurity? — The CIA Triad, Attack Surfaces and Think Like a Hacker",
    desc: "Cybersecurity is the practice of protecting systems, networks, programs, and data from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money from users via ransomware, or interrupting normal business operations. To understand security, you must start with the foundation of all cybersecurity: the CIA TRIAD. CIA stands for Confidentiality, Integrity, and Availability. (1) Confidentiality: keeping secrets secret. Only authorised people should be able to read your data. If a hacker steals your password, your confidentiality is breached. Encryption (scrambling data so only those with a key can read it) is the main defense. (2) Integrity: keeping data accurate and untampered. If you send Rs 1,000 to a friend, but a hacker intercepts the transaction and changes it to Rs 10,000, your integrity is breached. Cryptographic hashes (digital fingerprints of files) are used to detect unauthorized changes. (3) Availability: keeping systems running and accessible. If a hacker floods a bank's website with fake traffic so that real customers cannot log in and check their balance, availability is breached. This is called a DDoS (Distributed Denial of Service) attack. An ATTACK SURFACE is the sum of all points where an unauthorized user can try to enter data or extract data from an environment. Think of a house: the front door is part of the attack surface, and so are the windows, the chimney, and the back door. In cybersecurity, your attack surface includes every open network port, every input field on a website (like login forms), and every API endpoint. The goal of a security engineer is to make the attack surface as small as possible by closing unused ports, sanitizing inputs, and locking down permissions. (Real world: In the famous 2013 Target breach, hackers did not attack Target's main systems directly. They stole credentials from Target's heating/cooling vendor. This heating vendor had access to Target's internal network to monitor building temperatures. By attacking this weak external point, hackers entered Target's network and stole 40 million credit card numbers. Reducing your attack surface means checking every single door, even the temperature monitor.)",
    syllabus: ["Cybersecurity = protecting systems, networks, and data from digital attacks. The core goal is defending the CIA Triad: Confidentiality (only authorized eyes see data), Integrity (data cannot be altered undetected), Availability (systems stay online and accessible).", "Attack Surface = the sum of all paths where an attacker can try to enter or steal data. Includes open network ports, input forms, APIs, and third-party vendors. Security engineers focus on shrinking this attack surface to as small as possible.", "Real-world breaches analysis: Target breach (hackers used vendor temperature monitors to break in), DDoS attacks (flooding servers to take them down). Thinking like a hacker means finding the weakest link in the entire chain, not just the front door."],
    eTitle: "Exam: Attack Surface Scanner",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: CIA Risk Assessment",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "How Computers Talk — TCP/IP Layers, IP Addresses and Port Scanners Explained",
    desc: "To secure a computer network, you must first understand how computers talk to each other over the internet. The internet runs on the TCP/IP model, which divides networking tasks into 4 layers. Let us follow the journey of a network packet from your computer (Client) to a server: (1) Application Layer: where you interact with apps. When you type a URL, your browser creates an HTTP or HTTPS request. Other protocols here include DNS (translates google.com to an IP address) and SSH (secure remote control). (2) Transport Layer: splits your request into smaller packets and manages delivery. The main protocol here is TCP (Transmission Control Protocol). TCP is reliable: it numbers every packet, sends them, and waits for the server to confirm it received them. If a packet is lost, TCP resends it. This layer also introduces PORTS. A port is like a door to a specific service on a computer. A computer has 65,535 ports. Port 80 is for HTTP (unencrypted web), Port 443 is for HTTPS (secure web), Port 22 is for SSH, Port 3306 is for MySQL database. (3) Internet Layer: routes the packets across the globe using IP addresses. Every device has an IP address (like 142.250.190.46 for Google). The routers on the internet read the IP address on each packet and pass it to the next router until it reaches the destination server. (4) Network Access Layer: converts packets into electrical or radio signals (Ethernet, Wi-Fi) to physically travel through wires or air. PORT SCANNING: an attack technique where a hacker sends messages to various ports (0 to 65535) of a server to see which doors are open. If Port 22 (SSH) is open, the hacker might try a brute-force attack. If Port 3306 (MySQL) is open, they might try to hack the database directly. Security rule: close all ports except the ones absolutely required for your service. (Real world: Firewalls act as network guards. A firewall blocks all incoming packets to a server except for those landing on port 80 and 443, protecting internal services like databases on port 3306 from being accessed by the internet.)",
    syllabus: ["TCP/IP model layers: Application Layer (HTTP, HTTPS, DNS, SSH), Transport Layer (TCP, UDP, ports), Internet Layer (IP routing, IP addresses), Network Access Layer (Wi-Fi, Ethernet wires).", "Ports = communication doors on a server (0 to 65,535). Standard ports to know: Port 80 (HTTP), Port 443 (HTTPS), Port 22 (SSH), Port 3306 (MySQL database). Running services list on these ports.", "Port scanning = sending packets to all ports of a server to find open doors. Hacker's reconnaissance step. Defense = Firewalls blocking all incoming traffic to unauthorized ports, keeping only web ports 80/443 open."],
    eTitle: "Exam: Port Scanner Checker",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: TLS Certificate Auditor",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "SQL Injection Inputs Sanitization & Parameterization",
    desc: "Learn injection threats, raw query sanitization, and parameterized SQL queries. (Real world: Parameterized queries separate input parameters from executable SQL logic, making SQL injection attacks impossible.)",
    syllabus: ["SQL injection exploits parameters", "Sanitizing quote inputs", "Prepared statement parameterization rules"],
    eTitle: "Exam: SQL Query Sanitizer",
    eDesc: "Write a JS function `sanitizeQuery(input)` returning the input string with all single quotes (') and double quotes (\") removed. Return empty string if input is null.",
    eStarter: "function sanitizeQuery(input) {\n    // Write your code here\n    \n}",
    eHint: "Check if the input is null, and then use JavaScript's replace method with regex /['\"]/g to remove quotes.",
    eTest: "if (typeof sanitizeQuery !== 'function') throw new Error('Method sanitizeQuery not found.');\nif (sanitizeQuery(\"SELECT * FROM users WHERE id = '1'\") !== 'SELECT * FROM users WHERE id = 1') throw new Error('Quotes removal failed');\nif (sanitizeQuery(null) !== '') throw new Error('Null parameter check failed');",
    aTitle: "Assignment: Safe Query Builder",
    aDesc: "Write a JS function `buildSafeQuery(userId)` returning an object `{ sql: 'SELECT * FROM users WHERE id = ?', params: [userId] }`.",
    aStarter: "function buildSafeQuery(userId) {\n    // Write your code here\n    \n}",
    aHint: "Return a query model object containing sql and params properties.",
    aTest: "if (typeof buildSafeQuery !== 'function') throw new Error('Method buildSafeQuery not found.');\nconst q = buildSafeQuery('user123');\nif (q.sql !== 'SELECT * FROM users WHERE id = ?' || q.params[0] !== 'user123') throw new Error('Safe query mapping failed');"
  },
  {
    title: "Vulnerability Remediation: XSS script cleanups",
    desc: "Master Cross-Site Scripting (XSS) prevention. (Real world: Frontend sanitizers strip script tags, preventing attackers from injecting malicious scripts into comments sections.)",
    syllabus: ["Cross-Site Scripting (XSS) classifications", "HTML entity escaping rules", "Stripping malicious HTML elements"],
    eTitle: "Exam: XSS HTML Sanitizer",
    eDesc: "Write a JS function `sanitizeHtml(input)` returning string with '<script>' and '</script>' tags removed case-insensitively. Return empty string if input is null.",
    eStarter: "function sanitizeHtml(input) {\n    // Write your code here\n    \n}",
    eHint: "Use regex replacement case-insensitively: /<\\/?script>/gi.",
    eTest: "if (typeof sanitizeHtml !== 'function') throw new Error('Method sanitizeHtml not found');\nif (sanitizeHtml('<script>alert(1)</script>') !== 'alert(1)') throw new Error('XSS tag cleanup failed');",
    aTitle: "Assignment: HTML entity escaper",
    aDesc: "Write a JS function `escapeHtmlEntities(input)` replacing '&' with '&amp;', '<' with '&lt;', and '>' with '&gt;'.",
    aStarter: "function escapeHtmlEntities(input) {\n    // Write your code here\n    \n}",
    aHint: "Chain string replace checks.",
    aTest: "if (typeof escapeHtmlEntities !== 'function') throw new Error('Method escapeHtmlEntities not found');"
  },
  {
    title: "CSRF token validation & state verification",
    desc: "Master Cross-Site Request Forgery (CSRF) defenses. (Real world: REST backends match request CSRF headers with session tokens, blocking state-changing requests if they mismatch.)",
    syllabus: ["CSRF request exploits mechanics", "Session CSRF state tokens validation", "Configuring SameSite cookie policies"],
    eTitle: "Exam: CSRF Header Token Validator",
    eDesc: "Write a JS function `verifyCsrfToken(cookieToken, headerToken)` returning true if both are non-empty strings and match. Returns false otherwise.",
    eStarter: "function verifyCsrfToken(cookieToken, headerToken) {\n    // Write your code here\n    \n}",
    eHint: "Compare parameters, checking null/empty constraints.",
    eTest: "if (typeof verifyCsrfToken !== 'function') throw new Error('Method verifyCsrfToken not found');\nif (verifyCsrfToken('t123', 't123') !== true) throw new Error('CSRF validation failed');",
    aTitle: "Assignment: SameSite Cookie checker",
    aDesc: "Write a JS function `isSameSiteStrict(cookieHeader)` returning true if cookieHeader contains 'SameSite=Strict' case-insensitively.",
    aStarter: "function isSameSiteStrict(cookieHeader) {\n    // Write your code here\n    \n}",
    aHint: "Check substring presence in cookie parameters.",
    aTest: "if (typeof isSameSiteStrict !== 'function') throw new Error('Method isSameSiteStrict not found');"
  },
  {
    title: "API Security: Token expiry and signature checks",
    desc: "Master token-based authentication validations. (Real world: OAuth endpoints verify token signature headers, dropping requests if expirations are surpassed.)",
    syllabus: ["JWT token claims format validation", "Parsing expiration timestamps metrics", "Validating Bearer authorization headers"],
    eTitle: "Exam: JWT expiration epoch auditor",
    eDesc: "Write a JS function `isJwtExpired(payload, currentEpoch)` returning true if payload.exp <= currentEpoch. Return false if payload is null or exp is missing.",
    eStarter: "function isJwtExpired(payload, currentEpoch) {\n    // Write your code here\n    \n}",
    eHint: "Compare current timestamp against exp claim value.",
    eTest: "if (typeof isJwtExpired !== 'function') throw new Error('Method isJwtExpired not found');\nif (isJwtExpired({ exp: 1000 }, 1200) !== true) throw new Error('JWT expiry check failed');",
    aTitle: "Assignment: Bearer header token extractor",
    aDesc: "Write a JS function `extractBearerToken(headerVal)` returning token substring after 'Bearer '. Return null if headerVal doesn't start with 'Bearer '.",
    aStarter: "function extractBearerToken(headerVal) {\n    // Write your code here\n    \n}",
    aHint: "Check starting prefix, slicing trailing token value.",
    aTest: "if (typeof extractBearerToken !== 'function') throw new Error('Method extractBearerToken not found');"
  },
  {
    title: "Symmetric Encryption: Cipher Block validations",
    desc: "Master symmetric encryption implementation. (Real world: Cryptographic APIs check AES initialization vectors, ensuring blocks fit block size limits.)",
    syllabus: ["Symmetric algorithms (AES-256)", "Initialization Vector (IV) entropy requirements", "Padding block alignments checks"],
    eTitle: "Exam: AES IV Length Checker",
    eDesc: "Write a JS function `isIvLengthSafe(algorithm, bytes)` returning true if algorithm is 'AES-256' and bytes === 16. Returns false otherwise.",
    eStarter: "function isIvLengthSafe(algorithm, bytes) {\n    // Write your code here\n    \n}",
    eHint: "Compare parameters against standard AES IV size (16 bytes).",
    eTest: "if (typeof isIvLengthSafe !== 'function') throw new Error('Method isIvLengthSafe not found');\nif (isIvLengthSafe('AES-256', 16) !== true) throw new Error('IV size check failed');",
    aTitle: "Assignment: Key bit length validator",
    aDesc: "Write a JS function `isAesKeyLengthSafe(bitLength)` returning true if bitLength === 256.",
    aStarter: "function isAesKeyLengthSafe(bitLength) {\n    // Write your code here\n    \n}",
    aHint: "Verify key size match.",
    aTest: "if (typeof isAesKeyLengthSafe !== 'function') throw new Error('Method isAesKeyLengthSafe not found');"
  },
  {
    title: "Weak Hashing algorithms migrations rules",
    desc: "Master password hashing standards. (Real world: User directories migrate from MD5 and SHA-1, verifying credentials conform to Argon2 or BCrypt standards.)",
    syllabus: ["Weak hashes identifiers (MD5, SHA-1)", "Salting and hashing algorithms upgrades", "Password verify parameter limits"],
    eTitle: "Exam: Hash Algorithm Deprecation Checker",
    eDesc: "Write a JS function `isHashAlgorithmDeprecated(algorithm)` returning true if algorithm is 'MD5' or 'SHA-1' case-insensitively. Returns false otherwise.",
    eStarter: "function isHashAlgorithmDeprecated(algorithm) {\n    // Write your code here\n    \n}",
    eHint: "Compare input string with deprecated algorithms list.",
    eTest: "if (typeof isHashAlgorithmDeprecated !== 'function') throw new Error('Method isHashAlgorithmDeprecated not found');\nif (isHashAlgorithmDeprecated('MD5') !== true) throw new Error('MD5 check failed');",
    aTitle: "Assignment: BCrypt prefix indicator",
    aDesc: "Write a JS function `isBcryptHash(hash)` returning true if hash starts with '$2a$' or '$2b$'.",
    aStarter: "function isBcryptHash(hash) {\n    // Write your code here\n    \n}",
    aHint: "Check starting prefix indicator.",
    aTest: "if (typeof isBcryptHash !== 'function') throw new Error('Method isBcryptHash not found');"
  },
  {
    title: "Rate Limiting: Sliding window request limits",
    desc: "Master Denial of Service (DoS) protections. (Real world: Firewalls track client requests timestamps, blocking requests exceeding window limits.)",
    syllabus: ["Rate limiting sliding window algorithms", "IP request count tracking rules", "Configuring status code 429 pages"],
    eTitle: "Exam: Request Limit Auditor",
    eDesc: "Write a JS function `isRateLimitExceeded(requestsList, limit)` returning true if requestsList.length > limit. Return false if limit is negative.",
    eStarter: "function isRateLimitExceeded(requestsList, limit) {\n    // Write your code here\n    \n}",
    eHint: "Compare list size with limits thresholds.",
    eTest: "if (typeof isRateLimitExceeded !== 'function') throw new Error('Method isRateLimitExceeded not found');\nif (isRateLimitExceeded([1, 2, 3], 2) !== true) throw new Error('Rate limit check failed');",
    aTitle: "Assignment: Remaining requests finder",
    aDesc: "Write a JS function `getRequestsLeft(requestsList, limit)` returning limit - requestsList.length. Return 0 if negative.",
    aStarter: "function getRequestsLeft(requestsList, limit) {\n    // Write your code here\n    \n}",
    aHint: "Subtract array size from limit, clamp.",
    aTest: "if (typeof getRequestsLeft !== 'function') throw new Error('Method getRequestsLeft not found');"
  },
  {
    title: "System security logs integrity audits",
    desc: "Master logs sanitization controls. (Real world: Audits logs drop password fields or credit cards numbers before writing database records, preventing leak anomalies.)",
    syllabus: ["Log scrubbing techniques", "Parsing sensitive credential fields", "Audit trails integrity checks"],
    eTitle: "Exam: Log Sensitive Field Scruber",
    eDesc: "Write a JS function `scrubLogField(logText, pattern)` returning logText with matches of pattern string replaced by '[REDACTED]'. Return logText if parameters are empty.",
    eStarter: "function scrubLogField(logText, pattern) {\n    // Write your code here\n    \n}",
    eHint: "Replace pattern occurrences with redacted indicators.",
    eTest: "if (typeof scrubLogField !== 'function') throw new Error('Method scrubLogField not found');\nif (scrubLogField('pass=123', '123') !== 'pass=[REDACTED]') throw new Error('Log scrubbing failed');",
    aTitle: "Assignment: Log error status auditor",
    aDesc: "Write a JS function `isErrorLog(logLine)` returning true if logLine contains 'ERROR' or 'FATAL' case-insensitively.",
    aStarter: "function isErrorLog(logLine) {\n    // Write your code here\n    \n}",
    aHint: "Check substring presence in logs.",
    aTest: "if (typeof isErrorLog !== 'function') throw new Error('Method isErrorLog not found');"
  },
  {
    title: "Network Security: CORS origins whitelist checker",
    desc: "Master CORS security policy configuration. (Real world: Enterprise routers check Origin headers against CORS whitelists, dropping unauthorized cross-site requests.)",
    syllabus: ["Cross-Origin Resource Sharing rules", "Configuring server headers parameters", "Origin whitelist controls validation"],
    eTitle: "Exam: CORS Origin Auditor",
    eDesc: "Write a JS function `isOriginAllowed(origin, whitelist)` returning true if origin exists inside whitelist array. Return false if whitelist is empty or null.",
    eStarter: "function isOriginAllowed(origin, whitelist) {\n    // Write your code here\n    \n}",
    eHint: "Check array element presence using includes().",
    eTest: "if (typeof isOriginAllowed !== 'function') throw new Error('Method isOriginAllowed not found');\nif (isOriginAllowed('http://a.com', ['http://a.com']) !== true) throw new Error('CORS origin validation failed');",
    aTitle: "Assignment: Whitelist wildcard auditor",
    aDesc: "Write a JS function `isWildcardAllowed(whitelist)` returning true if whitelist contains '*'.",
    aStarter: "function isWildcardAllowed(whitelist) {\n    // Write your code here\n    \n}",
    aHint: "Check for wildcard element.",
    aTest: "if (typeof isWildcardAllowed !== 'function') throw new Error('Method isWildcardAllowed not found');"
  },
  {
    title: "SSRF: Server-Side Request Forgery URL auditor",
    desc: "Master SSRF prevention. (Real world: Dynamic loaders parse outgoing URLs, blocking requests targeting localhost or internal network IP ranges.)",
    syllabus: ["Server-Side Request Forgery vulnerabilities", "Blacklisting internal IP addresses (localhost)", "Validating hostname parameters structures"],
    eTitle: "Exam: SSRF URL Auditor",
    eDesc: "Write a JS function `isSsrfUrlBlocked(url)` returning true if url contains 'localhost', '127.0.0.1', or '192.168.' case-insensitively. Returns false otherwise.",
    eStarter: "function isSsrfUrlBlocked(url) {\n    // Write your code here\n    \n}",
    eHint: "Check for local network identifiers inside URL string.",
    eTest: "if (typeof isSsrfUrlBlocked !== 'function') throw new Error('Method isSsrfUrlBlocked not found');\nif (isSsrfUrlBlocked('http://localhost/api') !== true) throw new Error('SSRF url checker failed');",
    aTitle: "Assignment: Protocol schema check",
    aDesc: "Write a JS function `isHttpsSchema(url)` returning true if url starts with 'https://'.",
    aStarter: "function isHttpsSchema(url) {\n    // Write your code here\n    \n}",
    aHint: "Check starting substring prefix.",
    aTest: "if (typeof isHttpsSchema !== 'function') throw new Error('Method isHttpsSchema not found');"
  },
  {
    title: "Command Injection validations & arguments escape",
    desc: "Master command injection prevention. (Real world: Process spawning systems escape parameter shells, preventing execution of chained terminal sub-processes.)",
    syllabus: ["Command injection vulnerabilities", "Shell command character escapes rules", "Validating parameter arguments structures"],
    eTitle: "Exam: Shell Argument Sanitizer",
    eDesc: "Write a JS function `hasShellMetaCharacters(arg)` returning true if arg contains any character like ';', '&', '|', or '$'. Returns false otherwise.",
    eStarter: "function hasShellMetaCharacters(arg) {\n    // Write your code here\n    \n}",
    eHint: "Use regex to check for characters: /[;&|$]/.",
    eTest: "if (typeof hasShellMetaCharacters !== 'function') throw new Error('Method hasShellMetaCharacters not found');\nif (hasShellMetaCharacters('file.txt; rm -rf') !== true) throw new Error('Shell injection checker failed');",
    aTitle: "Assignment: Argument spacing auditor",
    aDesc: "Write a JS function `hasArgumentSpaces(arg)` returning true if arg contains spaces.",
    aStarter: "function hasArgumentSpaces(arg) {\n    // Write your code here\n    \n}",
    aHint: "Check for space character.",
    aTest: "if (typeof hasArgumentSpaces !== 'function') throw new Error('Method hasArgumentSpaces not found');"
  },
  {
    title: "Directory Traversal: Path resolution audits",
    desc: "Master directory traversal prevention. (Real world: File download endpoints verify resolved file paths, ensuring filenames do not traverse outside parent roots.)",
    syllabus: ["Directory traversal exploits (../)", "Resolving absolute file paths paths", "Restricting access to parent directories"],
    eTitle: "Exam: Path Traversal Auditor",
    eDesc: "Write a JS function `isPathTraversalBlocked(path)` returning true if path contains '..' or starts with '/' representing root directories. Returns false otherwise.",
    eStarter: "function isPathTraversalBlocked(path) {\n    // Write your code here\n    \n}",
    eHint: "Check for dot-dot directory separators or leading slash character.",
    eTest: "if (typeof isPathTraversalBlocked !== 'function') throw new Error('Method isPathTraversalBlocked not found');\nif (isPathTraversalBlocked('../../etc/passwd') !== true) throw new Error('Traversal checker failed');",
    aTitle: "Assignment: File extension whitelist checker",
    aDesc: "Write a JS function `isExtensionAllowed(filename, allowedExts)` returning true if filename ends with extension in allowedExts array.",
    aStarter: "function isExtensionAllowed(filename, allowedExts) {\n    // Write your code here\n    \n}",
    aHint: "Extract extension suffix, check array presence.",
    aTest: "if (typeof isExtensionAllowed !== 'function') throw new Error('Method isExtensionAllowed not found');"
  },
  {
    title: "Static Analysis & SAST pipeline automation",
    desc: "Learn automated security linting. (Real world: Pipeline engines run static analysis (SAST) checks, verifying that build steps pass before release.)",
    syllabus: ["SAST static scan tools", "Auditing compiler dependencies logs", "Scanning code repositories for raw secrets"],
    eTitle: "Exam: Pipeline Release Compliance Auditor",
    eDesc: "Write a JS function `isSecureRelease(report)` returning true if report.sastPass === true, report.depsOk === true, and report.noSecrets === true.",
    eStarter: "function isSecureRelease(report) {\n    // Write your code here\n    \n}",
    eHint: "Check report.sastPass, report.depsOk, and report.noSecrets boolean parameters.",
    eTest: "if (typeof isSecureRelease !== 'function') throw new Error('Method isSecureRelease not found.');\nconst rep = { sastPass: true, depsOk: true, noSecrets: true };\nif (isSecureRelease(rep) !== true) throw new Error('Compliance check failed');",
    aTitle: "Assignment: Security Score Rater",
    aDesc: "Write a JS function `getSecurityRating(score)` returning 'A' if score >= 90, 'B' if score >= 75, and 'F' otherwise.",
    aStarter: "function getSecurityRating(score) {\n    // Write your code here\n    \n}",
    aHint: "Compare score intervals.",
    aTest: "if (typeof getSecurityRating !== 'function') throw new Error('Method getSecurityRating not found.');"
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit",
    desc: "Evaluating API keys validations, sanitations compliance, security logging configs, and credentials storage frameworks. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Auditing key validation setups", "SQL injection prepared query reviews", "Logging sanitations and access policies checks"],
    eTitle: "Exam: Secure System Compliance Auditor",
    eDesc: "Write a JS function `evaluateSystemSecurity(report)` returning true if report.authOk === true, report.sqlSafe === true, and report.logsSanitized === true.",
    eStarter: "function evaluateSystemSecurity(report) {\n    // Write your code here\n    \n}",
    eHint: "Check report.authOk, report.sqlSafe, and report.logsSanitized boolean parameters.",
    eTest: "if (typeof evaluateSystemSecurity !== 'function') throw new Error('Method evaluateSystemSecurity not found.');\nconst rep = { authOk: true, sqlSafe: true, logsSanitized: true };\nif (evaluateSystemSecurity(rep) !== true) throw new Error('System compliance validation failed');",
    aTitle: "Assignment: System Threat Severity Finder",
    aDesc: "Write a JS function `getThreatSeverity(score)` returning 'high' if score >= 8, 'medium' if score >= 5, and 'low' otherwise.",
    aStarter: "function getThreatSeverity(score) {\n    // Write your code here\n    \n}",
    aHint: "Audit score values ranges.",
    aTest: "if (typeof getThreatSeverity !== 'function') throw new Error('Method getThreatSeverity not found.');"
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Security & Secure Systems Audit (Review)",
    desc: "Review system security parameters, sanitization check algorithms, access policies filters, and secure coding guidelines. (Real world: Security audits verify that all systems components conform to security standards.)",
    syllabus: ["Reviewing code injection preventions", "Assembling security compliance checklists", "Verifying logging scrub configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Audit score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const CYBER_30_DAYS_QUESTS = CYBER_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `cyber-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `cyber-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `cyber-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `cyber-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `cyber-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('cyber-basics', dayNum, cfg);
});
