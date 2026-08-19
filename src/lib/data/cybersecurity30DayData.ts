import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const CYBER_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Cybersecurity Principles & The CIA Triad",
    desc: "Master Confidentiality, Integrity, Availability, threat modeling, and defense-in-depth security layers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Cybersecurity Principles & The CIA Triad.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Cybersecurity Principles & The CIA Triad Validation",
    eDesc: "Implement a JavaScript validation function for Cybersecurity Principles & The CIA Triad.",
    eStarter: "function cyber_basicsTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay1 !== 'function') throw new Error('Function cyber_basicsTaskDay1 not found');\nif (cyber_basicsTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cybersecurity Principles & The CIA Triad Practice",
    aDesc: "Write an auxiliary helper function for Cybersecurity Principles & The CIA Triad.",
    aStarter: "function cyber_basicsTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "OWASP Top 10: SQL Injection (SQLi)",
    desc: "Identify SQL injection vectors, exploit unsafe queries, and implement parameterized prepared statements.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of OWASP Top 10: SQL Injection (SQLi).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: OWASP Top 10: SQL Injection (SQLi) Validation",
    eDesc: "Implement a JavaScript validation function for OWASP Top 10: SQL Injection (SQLi).",
    eStarter: "function cyber_basicsTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay2 !== 'function') throw new Error('Function cyber_basicsTaskDay2 not found');\nif (cyber_basicsTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: OWASP Top 10: SQL Injection (SQLi) Practice",
    aDesc: "Write an auxiliary helper function for OWASP Top 10: SQL Injection (SQLi).",
    aStarter: "function cyber_basicsTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Cross-Site Scripting (XSS: Stored, Reflected, DOM)",
    desc: "Analyze JavaScript injection pathways, payload execution, and apply Content Security Policy (CSP).",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Cross-Site Scripting (XSS: Stored, Reflected, DOM).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Cross-Site Scripting (XSS: Stored, Reflected, DOM) Validation",
    eDesc: "Implement a JavaScript validation function for Cross-Site Scripting (XSS: Stored, Reflected, DOM).",
    eStarter: "function cyber_basicsTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay3 !== 'function') throw new Error('Function cyber_basicsTaskDay3 not found');\nif (cyber_basicsTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cross-Site Scripting (XSS: Stored, Reflected, DOM) Practice",
    aDesc: "Write an auxiliary helper function for Cross-Site Scripting (XSS: Stored, Reflected, DOM).",
    aStarter: "function cyber_basicsTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Cross-Site Request Forgery (CSRF) & SameSite Cookies",
    desc: "Understand unauthorized state-changing requests, anti-CSRF tokens, and SameSite=Strict cookie flags.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Cross-Site Request Forgery (CSRF) & SameSite Cookies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Cross-Site Request Forgery (CSRF) & SameSite Cookies Validation",
    eDesc: "Implement a JavaScript validation function for Cross-Site Request Forgery (CSRF) & SameSite Cookies.",
    eStarter: "function cyber_basicsTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay4 !== 'function') throw new Error('Function cyber_basicsTaskDay4 not found');\nif (cyber_basicsTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cross-Site Request Forgery (CSRF) & SameSite Cookies Practice",
    aDesc: "Write an auxiliary helper function for Cross-Site Request Forgery (CSRF) & SameSite Cookies.",
    aStarter: "function cyber_basicsTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Authentication Vulnerabilities & Brute-Force Defense",
    desc: "Protect login endpoints with rate limiting, exponential backoff delays, account lockouts, and CAPTCHA.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Authentication Vulnerabilities & Brute-Force Defense.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Authentication Vulnerabilities & Brute-Force Defense Validation",
    eDesc: "Implement a JavaScript validation function for Authentication Vulnerabilities & Brute-Force Defense.",
    eStarter: "function cyber_basicsTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay5 !== 'function') throw new Error('Function cyber_basicsTaskDay5 not found');\nif (cyber_basicsTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Authentication Vulnerabilities & Brute-Force Defense Practice",
    aDesc: "Write an auxiliary helper function for Authentication Vulnerabilities & Brute-Force Defense.",
    aStarter: "function cyber_basicsTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Session Hijacking & Session Fixation",
    desc: "Prevent session cookie theft with HttpOnly, Secure flags, session regeneration on login, and IP binding.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Session Hijacking & Session Fixation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Session Hijacking & Session Fixation Validation",
    eDesc: "Implement a JavaScript validation function for Session Hijacking & Session Fixation.",
    eStarter: "function cyber_basicsTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay6 !== 'function') throw new Error('Function cyber_basicsTaskDay6 not found');\nif (cyber_basicsTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Session Hijacking & Session Fixation Practice",
    aDesc: "Write an auxiliary helper function for Session Hijacking & Session Fixation.",
    aStarter: "function cyber_basicsTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Server-Side Request Forgery (SSRF)",
    desc: "Detect internal network scanning vulnerabilities, sanitize outbound URLs, and block metadata endpoints.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Server-Side Request Forgery (SSRF).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Server-Side Request Forgery (SSRF) Validation",
    eDesc: "Implement a JavaScript validation function for Server-Side Request Forgery (SSRF).",
    eStarter: "function cyber_basicsTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay7 !== 'function') throw new Error('Function cyber_basicsTaskDay7 not found');\nif (cyber_basicsTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Server-Side Request Forgery (SSRF) Practice",
    aDesc: "Write an auxiliary helper function for Server-Side Request Forgery (SSRF).",
    aStarter: "function cyber_basicsTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Insecure Direct Object References (IDOR)",
    desc: "Enforce strict server-side authorization checks and replace sequential IDs with random UUIDv4.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Insecure Direct Object References (IDOR).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Insecure Direct Object References (IDOR) Validation",
    eDesc: "Implement a JavaScript validation function for Insecure Direct Object References (IDOR).",
    eStarter: "function cyber_basicsTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay8 !== 'function') throw new Error('Function cyber_basicsTaskDay8 not found');\nif (cyber_basicsTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Insecure Direct Object References (IDOR) Practice",
    aDesc: "Write an auxiliary helper function for Insecure Direct Object References (IDOR).",
    aStarter: "function cyber_basicsTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Security Misconfigurations & Default Credentials",
    desc: "Disable default administrative accounts, remove debug endpoints, and harden production servers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Security Misconfigurations & Default Credentials.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Security Misconfigurations & Default Credentials Validation",
    eDesc: "Implement a JavaScript validation function for Security Misconfigurations & Default Credentials.",
    eStarter: "function cyber_basicsTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay9 !== 'function') throw new Error('Function cyber_basicsTaskDay9 not found');\nif (cyber_basicsTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Security Misconfigurations & Default Credentials Practice",
    aDesc: "Write an auxiliary helper function for Security Misconfigurations & Default Credentials.",
    aStarter: "function cyber_basicsTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Cryptographic Failures & Weak Ciphers",
    desc: "Audit outdated ciphers and migrate to AES-GCM, Argon2id, and SHA-256.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Cryptographic Failures & Weak Ciphers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Cryptographic Failures & Weak Ciphers Validation",
    eDesc: "Implement a JavaScript validation function for Cryptographic Failures & Weak Ciphers.",
    eStarter: "function cyber_basicsTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay10 !== 'function') throw new Error('Function cyber_basicsTaskDay10 not found');\nif (cyber_basicsTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cryptographic Failures & Weak Ciphers Practice",
    aDesc: "Write an auxiliary helper function for Cryptographic Failures & Weak Ciphers.",
    aStarter: "function cyber_basicsTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Public Key Infrastructure (PKI) & TLS Certificates",
    desc: "Understand certificate authorities, root trust chains, TLS 1.3 handshakes, and certificate revocation.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Public Key Infrastructure (PKI) & TLS Certificates.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Public Key Infrastructure (PKI) & TLS Certificates Validation",
    eDesc: "Implement a JavaScript validation function for Public Key Infrastructure (PKI) & TLS Certificates.",
    eStarter: "function cyber_basicsTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay11 !== 'function') throw new Error('Function cyber_basicsTaskDay11 not found');\nif (cyber_basicsTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Public Key Infrastructure (PKI) & TLS Certificates Practice",
    aDesc: "Write an auxiliary helper function for Public Key Infrastructure (PKI) & TLS Certificates.",
    aStarter: "function cyber_basicsTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "JWT Security & Algorithm Confusion Attacks",
    desc: "Validate JWT signatures properly, reject none algorithm tokens, and store refresh tokens securely.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of JWT Security & Algorithm Confusion Attacks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: JWT Security & Algorithm Confusion Attacks Validation",
    eDesc: "Implement a JavaScript validation function for JWT Security & Algorithm Confusion Attacks.",
    eStarter: "function cyber_basicsTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay12 !== 'function') throw new Error('Function cyber_basicsTaskDay12 not found');\nif (cyber_basicsTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: JWT Security & Algorithm Confusion Attacks Practice",
    aDesc: "Write an auxiliary helper function for JWT Security & Algorithm Confusion Attacks.",
    aStarter: "function cyber_basicsTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Network Packet Analysis with Wireshark",
    desc: "Capture raw network frames, analyze TCP/IP handshakes, inspect DNS queries, and detect cleartext credentials.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Network Packet Analysis with Wireshark.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Network Packet Analysis with Wireshark Validation",
    eDesc: "Implement a JavaScript validation function for Network Packet Analysis with Wireshark.",
    eStarter: "function cyber_basicsTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay13 !== 'function') throw new Error('Function cyber_basicsTaskDay13 not found');\nif (cyber_basicsTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Network Packet Analysis with Wireshark Practice",
    aDesc: "Write an auxiliary helper function for Network Packet Analysis with Wireshark.",
    aStarter: "function cyber_basicsTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Port Scanning & Network Reconnaissance (Nmap)",
    desc: "Execute SYN stealth scans, detect running service versions, and identify open network ports.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Port Scanning & Network Reconnaissance (Nmap).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Port Scanning & Network Reconnaissance (Nmap) Validation",
    eDesc: "Implement a JavaScript validation function for Port Scanning & Network Reconnaissance (Nmap).",
    eStarter: "function cyber_basicsTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay14 !== 'function') throw new Error('Function cyber_basicsTaskDay14 not found');\nif (cyber_basicsTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Port Scanning & Network Reconnaissance (Nmap) Practice",
    aDesc: "Write an auxiliary helper function for Port Scanning & Network Reconnaissance (Nmap).",
    aStarter: "function cyber_basicsTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Web Application Firewalls (WAF) & ModSecurity",
    desc: "Configure WAF inspection rules, block malicious payload signatures, and mitigate DDoS attacks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Web Application Firewalls (WAF) & ModSecurity.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Web Application Firewalls (WAF) & ModSecurity Validation",
    eDesc: "Implement a JavaScript validation function for Web Application Firewalls (WAF) & ModSecurity.",
    eStarter: "function cyber_basicsTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay15 !== 'function') throw new Error('Function cyber_basicsTaskDay15 not found');\nif (cyber_basicsTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Web Application Firewalls (WAF) & ModSecurity Practice",
    aDesc: "Write an auxiliary helper function for Web Application Firewalls (WAF) & ModSecurity.",
    aStarter: "function cyber_basicsTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Linux Security Hardening & SSH Bastions",
    desc: "Disable SSH root login, enforce key-based auth, configure fail2ban, and audit user sudo rights.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Linux Security Hardening & SSH Bastions.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Linux Security Hardening & SSH Bastions Validation",
    eDesc: "Implement a JavaScript validation function for Linux Security Hardening & SSH Bastions.",
    eStarter: "function cyber_basicsTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay16 !== 'function') throw new Error('Function cyber_basicsTaskDay16 not found');\nif (cyber_basicsTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Linux Security Hardening & SSH Bastions Practice",
    aDesc: "Write an auxiliary helper function for Linux Security Hardening & SSH Bastions.",
    aStarter: "function cyber_basicsTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Denial of Service (DoS/DDoS) Mitigation",
    desc: "Deploy Cloudflare edge protection, rate limit requests with token buckets, and configure SYN cookies.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Denial of Service (DoS/DDoS) Mitigation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Denial of Service (DoS/DDoS) Mitigation Validation",
    eDesc: "Implement a JavaScript validation function for Denial of Service (DoS/DDoS) Mitigation.",
    eStarter: "function cyber_basicsTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay17 !== 'function') throw new Error('Function cyber_basicsTaskDay17 not found');\nif (cyber_basicsTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Denial of Service (DoS/DDoS) Mitigation Practice",
    aDesc: "Write an auxiliary helper function for Denial of Service (DoS/DDoS) Mitigation.",
    aStarter: "function cyber_basicsTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Penetration Testing Methodology & Metasploit",
    desc: "Follow ethical hacking lifecycles: Recon, Scanning, Exploitation, Privilege Escalation, Reporting.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Penetration Testing Methodology & Metasploit.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Penetration Testing Methodology & Metasploit Validation",
    eDesc: "Implement a JavaScript validation function for Penetration Testing Methodology & Metasploit.",
    eStarter: "function cyber_basicsTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay18 !== 'function') throw new Error('Function cyber_basicsTaskDay18 not found');\nif (cyber_basicsTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Penetration Testing Methodology & Metasploit Practice",
    aDesc: "Write an auxiliary helper function for Penetration Testing Methodology & Metasploit.",
    aStarter: "function cyber_basicsTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Malware Analysis & Sandbox Forensics",
    desc: "Analyze ransomware signatures, identify command-and-control beacons, and examine memory dumps.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Malware Analysis & Sandbox Forensics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Malware Analysis & Sandbox Forensics Validation",
    eDesc: "Implement a JavaScript validation function for Malware Analysis & Sandbox Forensics.",
    eStarter: "function cyber_basicsTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay19 !== 'function') throw new Error('Function cyber_basicsTaskDay19 not found');\nif (cyber_basicsTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Malware Analysis & Sandbox Forensics Practice",
    aDesc: "Write an auxiliary helper function for Malware Analysis & Sandbox Forensics.",
    aStarter: "function cyber_basicsTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Phishing Defense & Security Awareness",
    desc: "Deploy SPF, DKIM, DMARC email authentication records to prevent domain spoofing and phishing.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Phishing Defense & Security Awareness.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Phishing Defense & Security Awareness Validation",
    eDesc: "Implement a JavaScript validation function for Phishing Defense & Security Awareness.",
    eStarter: "function cyber_basicsTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay20 !== 'function') throw new Error('Function cyber_basicsTaskDay20 not found');\nif (cyber_basicsTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Phishing Defense & Security Awareness Practice",
    aDesc: "Write an auxiliary helper function for Phishing Defense & Security Awareness.",
    aStarter: "function cyber_basicsTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Social Engineering & Human Attack Vectors",
    desc: "Identify pretexting, baiting, shoulder surfing, and implement zero-trust identity verification.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Social Engineering & Human Attack Vectors.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Social Engineering & Human Attack Vectors Validation",
    eDesc: "Implement a JavaScript validation function for Social Engineering & Human Attack Vectors.",
    eStarter: "function cyber_basicsTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay21 !== 'function') throw new Error('Function cyber_basicsTaskDay21 not found');\nif (cyber_basicsTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Social Engineering & Human Attack Vectors Practice",
    aDesc: "Write an auxiliary helper function for Social Engineering & Human Attack Vectors.",
    aStarter: "function cyber_basicsTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "API Security & Rate Limiting Gateways",
    desc: "Protect REST/GraphQL APIs with token bucket throttling, schema validation, and payload size limits.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of API Security & Rate Limiting Gateways.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: API Security & Rate Limiting Gateways Validation",
    eDesc: "Implement a JavaScript validation function for API Security & Rate Limiting Gateways.",
    eStarter: "function cyber_basicsTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay22 !== 'function') throw new Error('Function cyber_basicsTaskDay22 not found');\nif (cyber_basicsTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: API Security & Rate Limiting Gateways Practice",
    aDesc: "Write an auxiliary helper function for API Security & Rate Limiting Gateways.",
    aStarter: "function cyber_basicsTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Zero-Trust Architecture & Identity-Aware Proxies",
    desc: "Eliminate internal network perimeter trust with continuous authentication, device posture checks, and mTLS.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Zero-Trust Architecture & Identity-Aware Proxies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Zero-Trust Architecture & Identity-Aware Proxies Validation",
    eDesc: "Implement a JavaScript validation function for Zero-Trust Architecture & Identity-Aware Proxies.",
    eStarter: "function cyber_basicsTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay23 !== 'function') throw new Error('Function cyber_basicsTaskDay23 not found');\nif (cyber_basicsTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Zero-Trust Architecture & Identity-Aware Proxies Practice",
    aDesc: "Write an auxiliary helper function for Zero-Trust Architecture & Identity-Aware Proxies.",
    aStarter: "function cyber_basicsTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Cloud Security Posture Management (CSPM) & IAM",
    desc: "Audit AWS/Azure cloud security baselines, detect S3 bucket leaks, and enforce least-privilege IAM.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Cloud Security Posture Management (CSPM) & IAM.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Cloud Security Posture Management (CSPM) & IAM Validation",
    eDesc: "Implement a JavaScript validation function for Cloud Security Posture Management (CSPM) & IAM.",
    eStarter: "function cyber_basicsTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay24 !== 'function') throw new Error('Function cyber_basicsTaskDay24 not found');\nif (cyber_basicsTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cloud Security Posture Management (CSPM) & IAM Practice",
    aDesc: "Write an auxiliary helper function for Cloud Security Posture Management (CSPM) & IAM.",
    aStarter: "function cyber_basicsTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "SIEM Log Analysis & Splunk Rule Correlation",
    desc: "Aggregate syslog streams, correlate security event rules in Wazuh/Splunk, and ingest threat intelligence.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of SIEM Log Analysis & Splunk Rule Correlation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: SIEM Log Analysis & Splunk Rule Correlation Validation",
    eDesc: "Implement a JavaScript validation function for SIEM Log Analysis & Splunk Rule Correlation.",
    eStarter: "function cyber_basicsTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay25 !== 'function') throw new Error('Function cyber_basicsTaskDay25 not found');\nif (cyber_basicsTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: SIEM Log Analysis & Splunk Rule Correlation Practice",
    aDesc: "Write an auxiliary helper function for SIEM Log Analysis & Splunk Rule Correlation.",
    aStarter: "function cyber_basicsTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Vulnerability Scanning & Automated SAST/DAST",
    desc: "Integrate static application security testing and dynamic scanning in CI/CD.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Vulnerability Scanning & Automated SAST/DAST.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Vulnerability Scanning & Automated SAST/DAST Validation",
    eDesc: "Implement a JavaScript validation function for Vulnerability Scanning & Automated SAST/DAST.",
    eStarter: "function cyber_basicsTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay26 !== 'function') throw new Error('Function cyber_basicsTaskDay26 not found');\nif (cyber_basicsTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Vulnerability Scanning & Automated SAST/DAST Practice",
    aDesc: "Write an auxiliary helper function for Vulnerability Scanning & Automated SAST/DAST.",
    aStarter: "function cyber_basicsTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Incident Response Playbooks & Ransomware Containment",
    desc: "Execute containment playbooks, isolate compromised hosts, capture volatile memory, and eradicate malware.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Incident Response Playbooks & Ransomware Containment.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Incident Response Playbooks & Ransomware Containment Validation",
    eDesc: "Implement a JavaScript validation function for Incident Response Playbooks & Ransomware Containment.",
    eStarter: "function cyber_basicsTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay27 !== 'function') throw new Error('Function cyber_basicsTaskDay27 not found');\nif (cyber_basicsTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Incident Response Playbooks & Ransomware Containment Practice",
    aDesc: "Write an auxiliary helper function for Incident Response Playbooks & Ransomware Containment.",
    aStarter: "function cyber_basicsTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Compliance Frameworks (SOC2, ISO 27001, GDPR)",
    desc: "Implement data encryption at rest, access audit logging, data retention policies, and compliance evidence.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Compliance Frameworks (SOC2, ISO 27001, GDPR).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Compliance Frameworks (SOC2, ISO 27001, GDPR) Validation",
    eDesc: "Implement a JavaScript validation function for Compliance Frameworks (SOC2, ISO 27001, GDPR).",
    eStarter: "function cyber_basicsTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay28 !== 'function') throw new Error('Function cyber_basicsTaskDay28 not found');\nif (cyber_basicsTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Compliance Frameworks (SOC2, ISO 27001, GDPR) Practice",
    aDesc: "Write an auxiliary helper function for Compliance Frameworks (SOC2, ISO 27001, GDPR).",
    aStarter: "function cyber_basicsTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Red-Team vs Blue-Team Simulation Exercises",
    desc: "Simulate advanced persistent threat attacks, test detection alarms, and refine SOC response times.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Red-Team vs Blue-Team Simulation Exercises.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Red-Team vs Blue-Team Simulation Exercises Validation",
    eDesc: "Implement a JavaScript validation function for Red-Team vs Blue-Team Simulation Exercises.",
    eStarter: "function cyber_basicsTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay29 !== 'function') throw new Error('Function cyber_basicsTaskDay29 not found');\nif (cyber_basicsTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Red-Team vs Blue-Team Simulation Exercises Practice",
    aDesc: "Write an auxiliary helper function for Red-Team vs Blue-Team Simulation Exercises.",
    aStarter: "function cyber_basicsTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Enterprise Security Penetration Test & Audit",
    desc: "Conduct an end-to-end security penetration test, patch detected CVEs, and produce executive audit reports.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Enterprise Security Penetration Test & Audit.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Enterprise Security Penetration Test & Audit Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Enterprise Security Penetration Test & Audit.",
    eStarter: "function cyber_basicsTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof cyber_basicsTaskDay30 !== 'function') throw new Error('Function cyber_basicsTaskDay30 not found');\nif (cyber_basicsTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Enterprise Security Penetration Test & Audit Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Enterprise Security Penetration Test & Audit.",
    aStarter: "function cyber_basicsTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof cyber_basicsTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const CYBER_30_DAYS_QUESTS = CYBER_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('cyber-basics', i + 1, cfg)
);
