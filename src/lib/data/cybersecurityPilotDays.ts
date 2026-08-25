import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const CYBER_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Information Security Core: CIA Triad & STRIDE Threat Modeling",
    "overviewMetaphor": "The STRIDE Threat Model Is a Security Guard's Threat Checklist: Just as an airport checks for impostors (Spoofing) with passports, bag alterations (Tampering) with seals, and unauthorized cockpit access (Elevation of Privilege) with biometric doors; STRIDE systematically categorizes software threat vectors against the CIA Triad (`STRIDE_THREAT_CATEGORIZED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d1-b1-stride-categorizer",
        "day": 1,
        "blockNumber": 1,
        "title": "STRIDE Threat Modeling: Categorizing 'S' (Spoofing $\\to$ Authenticity) & 'T' (Tampering $\\to$ Integrity)",
        "conceptBudget": {
          "primaryConcept": "STRIDE Threat Vector Categorizer & Mitigation Engine",
          "supportingTerms": [
            "Threat Code ('S' vs 'T')",
            "Violated Property ('Authenticity' vs 'Integrity')",
            "Countermeasure ('Mutual TLS / MFA' vs 'HMAC / Signatures')",
            "Status: STRIDE Threat Categorized Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "STRIDE Threat Modeling Matrix Ledger",
              "boxes": [
                {
                  "label": "1. Code 'S' (Spoofing)",
                  "value": "Violates Authenticity -> Mitigated by Mutual TLS & MFA",
                  "varType": "Spoofing",
                  "isUpdated": false
                },
                {
                  "label": "2. Code 'T' (Tampering)",
                  "value": "Violates Integrity -> Mitigated by Cryptographic HMACs & Signatures",
                  "varType": "Tampering",
                  "isUpdated": false
                },
                {
                  "label": "Categorization Status",
                  "value": "STRIDE THREAT CATEGORIZED NOMINAL (SYSTEMATIC DEFENSE ACTIVE!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "stride_demo.js",
            "initialCode": "function categorizeStride(code) {\n  const map = {\n    'S': { category: 'Spoofing', property: 'Authenticity', countermeasure: 'MUTUAL_TLS_OR_MFA' },\n    'T': { category: 'Tampering', property: 'Integrity', countermeasure: 'CRYPTOGRAPHIC_HMAC_OR_SIGNATURES' },\n    'R': { category: 'Repudiation', property: 'Non-Repudiation', countermeasure: 'IMMUTABLE_AUDIT_LOGGING' },\n    'I': { category: 'Information Disclosure', property: 'Confidentiality', countermeasure: 'ENCRYPTION_AT_REST_AND_IN_TRANSIT' },\n    'D': { category: 'Denial of Service', property: 'Availability', countermeasure: 'RATE_LIMITING_AND_DDOS_DEFENSE' },\n    'E': { category: 'Elevation of Privilege', property: 'Authorization', countermeasure: 'LEAST_PRIVILEGE_RBAC' }\n  };\n  const res = map[code.toUpperCase()];\n  return {\n    category: res.category,\n    violatedProperty: res.property,\n    recommendedCountermeasure: res.countermeasure,\n    status: 'STRIDE_THREAT_CATEGORIZED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(categorizeStride('S')));\nconsole.log(JSON.stringify(categorizeStride('T')));",
            "expectedOutput": "{\"category\":\"Spoofing\",\"violatedProperty\":\"Authenticity\",\"recommendedCountermeasure\":\"MUTUAL_TLS_OR_MFA\",\"status\":\"STRIDE_THREAT_CATEGORIZED_NOMINAL\"}\n{\"category\":\"Tampering\",\"violatedProperty\":\"Integrity\",\"recommendedCountermeasure\":\"CRYPTOGRAPHIC_HMAC_OR_SIGNATURES\",\"status\":\"STRIDE_THREAT_CATEGORIZED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core security property is violated when an attacker performs a Spoofing attack ('S')?",
          "expectedStringOutput": "Authenticity",
          "acceptableAnswers": [
            "Authenticity",
            "violatedProperty\":\"Authenticity\"",
            "'Authenticity'"
          ],
          "primaryMisconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
          "diagnosisMap": {
            "Confidentiality": {
              "misconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
              "errorExplanation": "Information Disclosure violates Confidentiality. Spoofing pretends to be another identity, violating Authenticity.",
              "recoveryPath": {
                "simplerExplanation": "Property is Authenticity.",
                "guidedFixPrompt": "Type Authenticity"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d1-b2-stride-privilege-letter-name",
        "day": 1,
        "blockNumber": 2,
        "title": "The STRIDE Letter for Elevation of Privilege: `E`",
        "conceptBudget": {
          "primaryConcept": "STRIDE 'E' Invariant",
          "supportingTerms": [
            "`E` (`Elevation of Privilege: An unprivileged user gaining administrative capabilities, violating Authorization constraints`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d1-b1-stride-categorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "STRIDE Framework Overview",
            "codeSnippet": "// S - Spoofing Identity\n// T - Tampering with Data\n// R - Repudiation\n// I - Information Disclosure\n// D - Denial of Service\n// E - Elevation of Privilege (Standard Microsoft Threat Modeling Matrix)",
            "lineNotes": {
              "6": "E represents Elevation of Privilege."
            }
          },
          {
            "type": "runnable_code",
            "filename": "stride_e_demo.js",
            "initialCode": "function getPrivilegeLetter() {\n  return 'E';\n}\n\nconsole.log(getPrivilegeLetter());",
            "expectedOutput": "E",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What letter in the STRIDE acronym represents Elevation of Privilege?",
          "expectedStringOutput": "E",
          "acceptableAnswers": [
            "E",
            "'E'",
            "e"
          ],
          "primaryMisconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
          "diagnosisMap": {
            "P": {
              "misconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
              "errorExplanation": "In STRIDE, Elevation of Privilege is represented by 'E'.",
              "recoveryPath": {
                "simplerExplanation": "Type E.",
                "guidedFixPrompt": "Type E"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d1-b3-defense-in-depth-layered-philosophy",
        "day": 1,
        "blockNumber": 3,
        "title": "Defense-in-Depth: Multiple Redundant Security Controls at Every Layer",
        "conceptBudget": {
          "primaryConcept": "Defense-in-Depth Invariant",
          "supportingTerms": [
            "Defense-in-Depth (`A layered defense strategy where firewall, WAF, authentication, RBAC, encryption, and audit logs provide redundant protection if any single layer fails`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d1-b2-stride-privilege-letter-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "defense_depth_demo.js",
            "initialCode": "function getDefenseInDepthRule() {\n  return 'DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM';\n}\n\nconsole.log(getDefenseInDepthRule());",
            "expectedOutput": "DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is perimeter-only firewall defense insufficient in modern enterprise architectures?",
          "expectedStringOutput": "DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM",
          "acceptableAnswers": [
            "DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM",
            "Redundant security layers",
            "No single control failure"
          ],
          "primaryMisconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
          "diagnosisMap": {
            "ONE_FIREWALL_IS_ENOUGH": {
              "misconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
              "errorExplanation": "Standard is: DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM.",
                "guidedFixPrompt": "Type DEFENSE_IN_DEPTH_REQUIRES_REDUNDANT_SECURITY_LAYERS_SO_NO_SINGLE_CONTROL_FAILURE_COMPROMISES_THE_SYSTEM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Web Security: SQL Injection (SQLi) & Parameterized Queries",
    "overviewMetaphor": "Parameterized Queries Are a Bank Teller Deposit Slot: String concatenation is like giving a stranger the bank vault door code written on a paper check; Parameterized queries pass the SQL command code first to the database engine to lock in the execution plan, and treat all user strings strictly as harmless data values through a deposit slot (`?`).",
    "blocks": [
      {
        "id": "cyber-d2-b1-sqli-defense-builder",
        "day": 2,
        "blockNumber": 1,
        "title": "SQL Injection Defense: Detecting Injection Payloads & Enforcing `WHERE col = ?`",
        "conceptBudget": {
          "primaryConcept": "SQL Injection Detection & Parameterized Query Builder",
          "supportingTerms": [
            "Malicious Pattern (`admin' OR '1'='1`)",
            "Parameterized Template (`SELECT * FROM users WHERE username = ?`)",
            "Bound Parameter (`admin' OR '1'='1`)",
            "Status: SQL Injection Defended Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d1-b1-stride-categorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Raw String Concatenation vs Prepared Statement",
              "brokenCode": "// ❌ INSECURE STRING CONCATENATION:\nconst query = \"SELECT * FROM users WHERE user = '\" + userInput + \"';\";\n// If userInput is: admin' OR '1'='1 -> Query structure is hijacked!",
              "fixedCode": "// ✅ SECURE PARAMETERIZED PREPARED STATEMENT:\nconst query = 'SELECT * FROM users WHERE user = ?';\ndb.execute(query, [userInput]); // Data is NEVER executed as SQL command!",
              "errorReason": "Direct string concatenation allows user input to alter the database query syntax tree.",
              "fixExplanation": "Prepared statements compile the SQL command structure before binding user input as pure data."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sqli_demo.js",
            "initialCode": "function buildSecureSql(table, col, rawInput) {\n  const sqliPattern = /(\\b(OR|AND)\\b\\s+['\"]?\\w+['\"]?\\s*=\\s*['\"]?\\w+|UNION\\s+SELECT|--|;|\\/\\*)/i;\n  const isMalicious = sqliPattern.test(rawInput);\n  const parameterizedQuery = `SELECT * FROM ${table} WHERE ${col} = ?`;\n  return {\n    detectedMaliciousPattern: isMalicious,\n    secureQuery: parameterizedQuery,\n    boundParameter: rawInput,\n    status: 'SQL_INJECTION_DEFENDED_WITH_PREPARED_STATEMENT_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(buildSecureSql('users', 'username', \"admin' OR '1'='1\")));\nconsole.log(JSON.stringify(buildSecureSql('users', 'username', 'alice')));",
            "expectedOutput": "{\"detectedMaliciousPattern\":true,\"secureQuery\":\"SELECT * FROM users WHERE username = ?\",\"boundParameter\":\"admin' OR '1'='1\",\"status\":\"SQL_INJECTION_DEFENDED_WITH_PREPARED_STATEMENT_NOMINAL\"}\n{\"detectedMaliciousPattern\":false,\"secureQuery\":\"SELECT * FROM users WHERE username = ?\",\"boundParameter\":\"alice\",\"status\":\"SQL_INJECTION_DEFENDED_WITH_PREPARED_STATEMENT_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What secure parameterized query is generated for table 'users' and column 'username'?",
          "expectedStringOutput": "SELECT * FROM users WHERE username = ?",
          "acceptableAnswers": [
            "SELECT * FROM users WHERE username = ?",
            "secureQuery\":\"SELECT * FROM users WHERE username = ?\""
          ],
          "primaryMisconceptionId": "MC_CYBER_SQL_INJECTION_PARAMETERIZED_QUERIES",
          "diagnosisMap": {
            "CONCATENATE": {
              "misconceptionId": "MC_CYBER_SQL_INJECTION_PARAMETERIZED_QUERIES",
              "errorExplanation": "Concatenating strings causes SQLi. Parameterized format uses 'SELECT * FROM users WHERE username = ?'.",
              "recoveryPath": {
                "simplerExplanation": "Query is SELECT * FROM users WHERE username = ?.",
                "guidedFixPrompt": "Type SELECT * FROM users WHERE username = ?"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d2-b2-sql-placeholder-character-name",
        "day": 2,
        "blockNumber": 2,
        "title": "The Standard SQL Prepared Statement Placeholder: `?`",
        "conceptBudget": {
          "primaryConcept": "SQL `?` Placeholder Invariant",
          "supportingTerms": [
            "`?` (`Positional parameter placeholder used in JDBC, SQLite, MySQL, and PostgreSQL to safely bind untrusted input variables`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d2-b1-sqli-defense-builder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Prepared Statement Parameter Binding",
            "codeSnippet": "// 1. PREPARE: Database pre-compiles query structure with '?' slot\nPreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM users WHERE id = ?\");\n\n// 2. BIND: User input is bound as pure string value\nstmt.setString(1, userInput);\nstmt.executeQuery();",
            "lineNotes": {
              "2": "'?' is the parameter placeholder.",
              "5": "Data is bound without re-compiling SQL grammar."
            }
          },
          {
            "type": "runnable_code",
            "filename": "placeholder_demo.js",
            "initialCode": "function getPlaceholder() {\n  return '?';\n}\n\nconsole.log(getPlaceholder());",
            "expectedOutput": "?",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What single character placeholder denotes bound parameter slots in standard SQL prepared statements?",
          "expectedStringOutput": "?",
          "acceptableAnswers": [
            "?",
            "'?'",
            "question mark"
          ],
          "primaryMisconceptionId": "MC_CYBER_SQL_INJECTION_PARAMETERIZED_QUERIES",
          "diagnosisMap": {
            "$": {
              "misconceptionId": "MC_CYBER_SQL_INJECTION_PARAMETERIZED_QUERIES",
              "errorExplanation": "Universal SQL placeholder in standard ANSI/JDBC is '?'.",
              "recoveryPath": {
                "simplerExplanation": "Type ?.",
                "guidedFixPrompt": "Type ?"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d2-b3-second-order-sqli-mechanics",
        "day": 2,
        "blockNumber": 3,
        "title": "Advanced SQLi: Second-Order SQL Injection in Stored Data Pipelines",
        "conceptBudget": {
          "primaryConcept": "Second-Order SQLi Invariant",
          "supportingTerms": [
            "Second-Order SQLi (`Occurs when an attack payload is safely stored in the database on step 1, but later concatenated into a secondary query dynamically without parameterization`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d2-b2-sql-placeholder-character-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "second_order_demo.js",
            "initialCode": "function getSecondOrderRule() {\n  return 'STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI';\n}\n\nconsole.log(getSecondOrderRule());",
            "expectedOutput": "STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why must data retrieved from a database still be parameterized when used in subsequent internal queries?",
          "expectedStringOutput": "STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI",
          "acceptableAnswers": [
            "STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI",
            "Prevent second order SQLi",
            "Second order SQL injection"
          ],
          "primaryMisconceptionId": "MC_CYBER_SQL_INJECTION_PARAMETERIZED_QUERIES",
          "diagnosisMap": {
            "DATABASE_DATA_IS_TRUSTED": {
              "misconceptionId": "MC_CYBER_SQL_INJECTION_PARAMETERIZED_QUERIES",
              "errorExplanation": "Standard is: STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI.",
              "recoveryPath": {
                "simplerExplanation": "Matches STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI.",
                "guidedFixPrompt": "Type STORED_DATABASE_VALUES_MUST_STILL_BE_BOUND_WITH_PREPARED_STATEMENTS_TO_PREVENT_SECOND_ORDER_SQLI"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Client-Side Security: Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
    "overviewMetaphor": "HTML Entity Encoding Is a Museum Bulletproof Glass: If an attacker injects `<script>alert('XSS')</script>`, rendering it raw allows malicious JavaScript to rob session tokens; HTML entity escaping replaces active tags with inert display text (`&lt;script&gt;`), putting the attacker's script behind glass where it can only be looked at, never executed.",
    "blocks": [
      {
        "id": "cyber-d3-b1-xss-sanitizer",
        "day": 3,
        "blockNumber": 1,
        "title": "XSS Defense: Escaping Dangerous HTML Entities (`<` $\\to$ `&lt;`, `>` $\\to$ `&gt;`)",
        "conceptBudget": {
          "primaryConcept": "XSS HTML Entity Sanitizer & CSP Generator",
          "supportingTerms": [
            "Raw Payload (`<script>alert('XSS')</script>`)",
            "HTML Escaped (`&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;`)",
            "Script Tag Flag (`true`)",
            "Status: XSS Sanitized Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d2-b1-sqli-defense-builder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "XSS Context-Aware HTML Entity Escaping Ledger",
              "boxes": [
                {
                  "label": "1. Raw Script Payload",
                  "value": "<script>alert('XSS')</script> (Dangerous executable string)",
                  "varType": "Raw Payload",
                  "isUpdated": false
                },
                {
                  "label": "2. Escaped Entity Text",
                  "value": "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt; (Inert visual text)",
                  "varType": "Escaped",
                  "isUpdated": true
                },
                {
                  "label": "Sanitization Status",
                  "value": "XSS SANITIZED AND ESCAPED NOMINAL (BROWSER EXECUTION BLOCKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "xss_demo.js",
            "initialCode": "function sanitizeHtml(raw) {\n  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#x27;', '/': '&#x2F;' };\n  const escaped = raw.replace(/[&<>'\"\\/]/g, s => map[s]);\n  return {\n    sanitizedHtml: escaped,\n    containsScriptTag: /<script/i.test(raw),\n    status: 'XSS_SANITIZED_AND_ESCAPED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(sanitizeHtml(\"<script>alert('XSS')</script>\")));",
            "expectedOutput": "{\"sanitizedHtml\":\"&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;\",\"containsScriptTag\":true,\"status\":\"XSS_SANITIZED_AND_ESCAPED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sanitized HTML entity string for <script>alert('XSS')</script>?",
          "expectedStringOutput": "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;",
          "acceptableAnswers": [
            "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;",
            "sanitizedHtml\":\"&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;\""
          ],
          "primaryMisconceptionId": "MC_CYBER_XSS_CONTENT_SECURITY_POLICY",
          "diagnosisMap": {
            "<script>": {
              "misconceptionId": "MC_CYBER_XSS_CONTENT_SECURITY_POLICY",
              "errorExplanation": "Raw <script> tags must be escaped as &lt;script&gt;.",
              "recoveryPath": {
                "simplerExplanation": "String is &lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;.",
                "guidedFixPrompt": "Type &lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d3-b2-csp-header-acronym-name",
        "day": 3,
        "blockNumber": 2,
        "title": "The Content Security Policy Header Acronym: `CSP`",
        "conceptBudget": {
          "primaryConcept": "CSP Acronym Invariant",
          "supportingTerms": [
            "`CSP` (`Content Security Policy: The HTTP response header restricting script origins, inline script execution, and eval() in the browser`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d3-b1-xss-sanitizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Content Security Policy Header",
            "codeSnippet": "/* HTTP RESPONSE HEADER */\nContent-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none';\n\n// Blocks inline <script> tags without matching cryptographic nonces!\n// Disallows dangerous eval() by default.",
            "lineNotes": {
              "2": "CSP header enforces whitelisted origins and blocks unauthorized script execution."
            }
          },
          {
            "type": "runnable_code",
            "filename": "csp_name_demo.js",
            "initialCode": "function getCsp() {\n  return 'CSP';\n}\n\nconsole.log(getCsp());",
            "expectedOutput": "CSP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the HTTP security header that blocks unauthorized inline script execution?",
          "expectedStringOutput": "CSP",
          "acceptableAnswers": [
            "CSP",
            "'CSP'",
            "csp",
            "Content Security Policy"
          ],
          "primaryMisconceptionId": "MC_CYBER_XSS_CONTENT_SECURITY_POLICY",
          "diagnosisMap": {
            "CORS": {
              "misconceptionId": "MC_CYBER_XSS_CONTENT_SECURITY_POLICY",
              "errorExplanation": "CORS manages cross-origin resource sharing. Script execution policy is CSP.",
              "recoveryPath": {
                "simplerExplanation": "Type CSP.",
                "guidedFixPrompt": "Type CSP"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d3-b3-dom-xss-sink-sources",
        "day": 3,
        "blockNumber": 3,
        "title": "DOM-Based XSS: Dangerous Execution Sinks (`innerHTML`, `eval`, `document.write`)",
        "conceptBudget": {
          "primaryConcept": "DOM XSS Sink Invariant",
          "supportingTerms": [
            "DOM XSS Sinks (`Unsafe browser JavaScript methods like element.innerHTML and eval() that parse string input directly as executable HTML/JS code`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d3-b2-csp-header-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dom_xss_demo.js",
            "initialCode": "function getDomXssRule() {\n  return 'REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION';\n}\n\nconsole.log(getDomXssRule());",
            "expectedOutput": "REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do frontend developers eliminate DOM-based XSS vulnerabilities when inserting dynamic user text?",
          "expectedStringOutput": "REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION",
          "acceptableAnswers": [
            "REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION",
            "Use textContent instead of innerHTML",
            "Replace innerHTML with textContent"
          ],
          "primaryMisconceptionId": "MC_CYBER_XSS_CONTENT_SECURITY_POLICY",
          "diagnosisMap": {
            "USE_INNER_HTML": {
              "misconceptionId": "MC_CYBER_XSS_CONTENT_SECURITY_POLICY",
              "errorExplanation": "Standard is: REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION.",
                "guidedFixPrompt": "Type REPLACE_INNER_HTML_WITH_TEXT_CONTENT_TO_PREVENT_DOM_BASED_SCRIPT_EXECUTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Request Forgery: Cross-Site Request Forgery (CSRF) & SameSite Cookies",
    "overviewMetaphor": "Anti-CSRF Tokens Are a Bank Transaction Signature Card: Browsers automatically attach ambient session cookies to every request like a bank card stamped with your face; an attacker's website can forge a transfer request using your card, but they cannot forge the secret anti-CSRF token generated uniquely on the bank's genuine transfer form (`SameSite=Strict`).",
    "blocks": [
      {
        "id": "cyber-d4-b1-csrf-token-validator",
        "day": 4,
        "blockNumber": 1,
        "title": "CSRF Defense: Validating Synchronizer Tokens & Enforcing `SameSite=Strict`",
        "conceptBudget": {
          "primaryConcept": "CSRF Anti-Forgery Token Validator",
          "supportingTerms": [
            "Session Token (`'sec_tok_123'`)",
            "Header Token (`'sec_tok_123'`)",
            "SameSite Policy (`'Strict'` vs `'None'`)",
            "Status: CSRF Request Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d3-b1-xss-sanitizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CSRF Synchronizer Token & SameSite Validation Ledger",
              "boxes": [
                {
                  "label": "Valid Request (Match + Strict)",
                  "value": "Token match + SameSite=Strict -> Request Approved (NOMINAL!)",
                  "varType": "Valid Request",
                  "isUpdated": true
                },
                {
                  "label": "Forged Request (Attacker Token)",
                  "value": "Attacker token mismatch + SameSite=None -> ATTACK BLOCKED",
                  "varType": "Blocked Request",
                  "isUpdated": false
                },
                {
                  "label": "Validation Status",
                  "value": "CSRF REQUEST VALIDATED NOMINAL (CROSS-ORIGIN FORGERY PREVENTED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "csrf_demo.js",
            "initialCode": "function validateCsrf(sessionToken, reqToken, sameSite) {\n  const isSameSiteOk = sameSite === 'Strict' || sameSite === 'Lax';\n  const isMatch = Boolean(sessionToken && reqToken && sessionToken === reqToken);\n  const isApproved = isSameSiteOk && isMatch;\n  return {\n    sessionTokenMatched: isMatch,\n    sameSitePolicy: sameSite,\n    isCsrfApproved: isApproved,\n    status: isApproved ? 'CSRF_REQUEST_VALIDATED_NOMINAL' : 'CSRF_ATTACK_DETECTED_OR_INVALID_TOKEN'\n  };\n}\n\nconsole.log(JSON.stringify(validateCsrf('sec_tok_123', 'sec_tok_123', 'Strict')));\nconsole.log(JSON.stringify(validateCsrf('sec_tok_123', 'attacker_token', 'None')));",
            "expectedOutput": "{\"sessionTokenMatched\":true,\"sameSitePolicy\":\"Strict\",\"isCsrfApproved\":true,\"status\":\"CSRF_REQUEST_VALIDATED_NOMINAL\"}\n{\"sessionTokenMatched\":false,\"sameSitePolicy\":\"None\",\"isCsrfApproved\":false,\"status\":\"CSRF_ATTACK_DETECTED_OR_INVALID_TOKEN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a state-changing POST request has a valid matching CSRF token and secure SameSite policy?",
          "expectedStringOutput": "CSRF_REQUEST_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "CSRF_REQUEST_VALIDATED_NOMINAL",
            "status\":\"CSRF_REQUEST_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_CSRF_SAMESITE_COOKIE_TOKENS",
          "diagnosisMap": {
            "CSRF_ATTACK": {
              "misconceptionId": "MC_CYBER_CSRF_SAMESITE_COOKIE_TOKENS",
              "errorExplanation": "Matches CSRF_REQUEST_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type CSRF_REQUEST_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d4-b2-strict-samesite-cookie-value",
        "day": 4,
        "blockNumber": 2,
        "title": "The Strictest SameSite Cookie Attribute: `Strict`",
        "conceptBudget": {
          "primaryConcept": "SameSite Strict Invariant",
          "supportingTerms": [
            "`Strict` (`SameSite=Strict: Guarantees that cookies are never sent on cross-site requests, even when following top-level navigational hyperlinks`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d4-b1-csrf-token-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SameSite Cookie Directives",
            "codeSnippet": "/* 1. SameSite=Strict: Cookie NEVER sent on cross-site requests (Highest Security!) */\nSet-Cookie: session_id=xyz; Secure; HttpOnly; SameSite=Strict;\n\n/* 2. SameSite=Lax: Cookie sent on top-level GET navigation (Default in modern browsers) */\n/* 3. SameSite=None: Cookie sent on all cross-site requests (Requires Secure HTTPS!) */",
            "lineNotes": {
              "2": "SameSite=Strict offers the strongest protection against CSRF."
            }
          },
          {
            "type": "runnable_code",
            "filename": "samesite_demo.js",
            "initialCode": "function getStrictSameSite() {\n  return 'Strict';\n}\n\nconsole.log(getStrictSameSite());",
            "expectedOutput": "Strict",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SameSite cookie attribute value completely prevents cookies from being attached to cross-site requests?",
          "expectedStringOutput": "Strict",
          "acceptableAnswers": [
            "Strict",
            "'Strict'",
            "strict"
          ],
          "primaryMisconceptionId": "MC_CYBER_CSRF_SAMESITE_COOKIE_TOKENS",
          "diagnosisMap": {
            "Lax": {
              "misconceptionId": "MC_CYBER_CSRF_SAMESITE_COOKIE_TOKENS",
              "errorExplanation": "Lax permits top-level GET navigation. Absolute restriction uses Strict.",
              "recoveryPath": {
                "simplerExplanation": "Type Strict.",
                "guidedFixPrompt": "Type Strict"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d4-b3-httponly-cookie-security-flag",
        "day": 4,
        "blockNumber": 3,
        "title": "Cookie Defense: Using `HttpOnly` to Block JavaScript `document.cookie` Theft",
        "conceptBudget": {
          "primaryConcept": "`HttpOnly` Flag Invariant",
          "supportingTerms": [
            "`HttpOnly` (`Prevents client-side scripts from reading the session cookie via document.cookie, neutralizing session hijacking if XSS occurs`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d4-b2-strict-samesite-cookie-value",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "httponly_demo.js",
            "initialCode": "function getHttpOnlyRule() {\n  return 'HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS';\n}\n\nconsole.log(getHttpOnlyRule());",
            "expectedOutput": "HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should session authentication cookies always be marked with the HttpOnly flag?",
          "expectedStringOutput": "HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS",
          "acceptableAnswers": [
            "HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS",
            "Prevents JavaScript from stealing cookies",
            "Blocks document.cookie access"
          ],
          "primaryMisconceptionId": "MC_CYBER_CSRF_SAMESITE_COOKIE_TOKENS",
          "diagnosisMap": {
            "NO_PROTECTION": {
              "misconceptionId": "MC_CYBER_CSRF_SAMESITE_COOKIE_TOKENS",
              "errorExplanation": "Standard is: HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS.",
              "recoveryPath": {
                "simplerExplanation": "Matches HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS.",
                "guidedFixPrompt": "Type HTTP_ONLY_FLAG_PREVENTS_CLIENT_SIDE_JAVASCRIPT_FROM_STEALING_SESSION_COOKIES_VIA_XSS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational web application firewall and threat mitigation engine: 1. STRIDE threat vector categorization; 2. Parameterized SQL query building; 3. XSS HTML entity escaping; 4. Anti-CSRF token and SameSite validation.",
    "blocks": [
      {
        "id": "cyber-d5-b1-waf-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Web Application Firewall Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Web Application Firewall Master Engine",
          "supportingTerms": [
            "STRIDE Subsystem",
            "SQLi Subsystem",
            "XSS Subsystem",
            "CSRF Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d4-b3-httponly-cookie-security-flag",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 WAF Security Defense Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Inspects incoming requests against STRIDE threat taxonomy",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Parameterizes SQL injection queries & escapes HTML script tags",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Validates anti-CSRF synchronizer tokens & SameSite cookies",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Web Application Firewall Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "waf_kernel_demo.js",
            "initialCode": "function runWafEngine() {\n  return {\n    strideSubsystem: 'ONLINE_THREAT_TAXONOMY_ACTIVE',\n    sqliSubsystem: 'ONLINE_PREPARED_STATEMENTS_ACTIVE',\n    xssSubsystem: 'ONLINE_ENTITY_ESCAPING_ACTIVE',\n    csrfSubsystem: 'ONLINE_SYNCHRONIZER_TOKENS_ACTIVE',\n    engineStatus: 'WAF_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runWafEngine().engineStatus);",
            "expectedOutput": "WAF_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Web Application Firewall Master Engine?",
          "expectedStringOutput": "WAF_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "WAF_MASTER_ENGINE_ACTIVE",
            "engineStatus: WAF_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
              "errorExplanation": "Matches WAF_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type WAF_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d5-b2-waf-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "WAF Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "WAF Engine Invariant Verification",
          "supportingTerms": [
            "SQLi Invariant",
            "XSS Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d5-b1-waf-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "waf_audit_demo.js",
            "initialCode": "function auditWaf(s, sq, x, c) {\n  const passed = s && sq && x && c;\n  return {\n    strideVerified: s,\n    sqliVerified: sq,\n    xssVerified: x,\n    csrfVerified: c,\n    grade: passed ? 'WAF_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditWaf(true, true, true, true)));",
            "expectedOutput": "{\"strideVerified\":true,\"sqliVerified\":true,\"xssVerified\":true,\"csrfVerified\":true,\"grade\":\"WAF_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when STRIDE, SQLi, XSS, and CSRF pass 100%?",
          "expectedStringOutput": "WAF_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "WAF_ENGINE_AUDIT_PASSED",
            "grade\":\"WAF_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
              "errorExplanation": "All checks passing awards WAF_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards WAF_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type WAF_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d5-b3-milestone1-cyber-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 WAF & Input Sanitization Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "WAF Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d5-b2-waf-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_cyber_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_CIA_TRIAD_STRIDE_THREAT_MODELING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Cryptographic Primitives: Symmetric Encryption (AES-GCM) vs Asymmetric (RSA/ECC)",
    "overviewMetaphor": "AES-GCM Authenticated Encryption Is a Tamper-Proof Armored Truck: Traditional encryption only scrambled data (secrecy); AES-GCM (Galois/Counter Mode) adds an explicit 128-bit Authentication Tag (tamper seal) and requires a unique 96-bit Initialization Vector (IV); if an attacker flips even a single bit of ciphertext in transit, the authentication tag fails validation and decrypts to nothing (`AES_GCM_PAYLOAD_VALIDATED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d6-b1-aes-gcm-validator",
        "day": 6,
        "blockNumber": 1,
        "title": "AES-GCM: Validating 96-bit (12-byte) IV, 128-bit (16-byte) Auth Tag & 256-bit Key",
        "conceptBudget": {
          "primaryConcept": "AES-GCM Authenticated Encryption Payload Validator",
          "supportingTerms": [
            "Ciphertext Hex",
            "12-Byte IV (24 hex chars)",
            "16-Byte Auth Tag (32 hex chars)",
            "Key Size (256-bit)",
            "Status: AES GCM Payload Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d1-b1-stride-categorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AES-256-GCM AEAD Cryptographic Structure Ledger",
              "boxes": [
                {
                  "label": "1. Initialization Vector (IV)",
                  "value": "12 bytes = 24 hex chars (96 bits: MUST NEVER BE REUSED!)",
                  "varType": "IV / Nonce",
                  "isUpdated": false
                },
                {
                  "label": "2. Authentication Tag",
                  "value": "16 bytes = 32 hex chars (128 bits: Cryptographic integrity seal)",
                  "varType": "Auth Tag",
                  "isUpdated": false
                },
                {
                  "label": "3. Cipher Payload Status",
                  "value": "AES GCM PAYLOAD VALIDATED NOMINAL (AEAD INTEGRITY VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aes_gcm_demo.js",
            "initialCode": "function validateAesGcm(cipher, iv, tag, keyBits) {\n  const isIvValid = iv.length === 24;\n  const isTagValid = tag.length === 32;\n  const isKeyValid = keyBits === 256;\n  const isApproved = isIvValid && isTagValid && isKeyValid && cipher.length > 0;\n  return {\n    ivByteLength: iv.length / 2,\n    authTagByteLength: tag.length / 2,\n    isGcmPayloadNominal: isApproved,\n    status: isApproved ? 'AES_GCM_PAYLOAD_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateAesGcm('abcdef1234', '1234567890abcdef12345678', '1234567890abcdef1234567890abcdef', 256)));",
            "expectedOutput": "{\"ivByteLength\":12,\"authTagByteLength\":16,\"isGcmPayloadNominal\":true,\"status\":\"AES_GCM_PAYLOAD_VALIDATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended byte length of the Initialization Vector (IV / Nonce) in standard AES-GCM?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "ivByteLength\":12",
            "12 bytes",
            "96 bits"
          ],
          "primaryMisconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
          "diagnosisMap": {
            "16": {
              "misconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
              "errorExplanation": "16 bytes is standard for AES-CBC. AES-GCM officially specifies a 12-byte (96-bit) IV.",
              "recoveryPath": {
                "simplerExplanation": "Length is 12 bytes.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d6-b2-gcm-recommended-nonce-bits",
        "day": 6,
        "blockNumber": 2,
        "title": "The Standard AES-GCM Nonce Bit Length: 96",
        "conceptBudget": {
          "primaryConcept": "96-Bit Nonce Invariant",
          "supportingTerms": [
            "96 Bits (`Standard GCM nonce length that avoids expensive GHASH processing during initialization`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d6-b1-aes-gcm-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AEAD Security Properties",
            "codeSnippet": "/* AEAD (Authenticated Encryption with Associated Data): */\nCiphertext, Tag = AES_GCM_Encrypt( Key, IV_96bit, Plaintext, AdditionalAuthenticatedData )\n\n// Guarantees BOTH Confidentiality AND Integrity simultaneously!",
            "lineNotes": {
              "2": "AES-GCM produces both ciphertext and authentication tag."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gcm_bits_demo.js",
            "initialCode": "function getGcmNonceBits() {\n  return 96;\n}\n\nconsole.log(getGcmNonceBits());",
            "expectedOutput": "96",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many bits are in the standard recommended AES-GCM initialization vector?",
          "expectedStringOutput": "96",
          "acceptableAnswers": [
            "96",
            "96 bits",
            "ninety-six"
          ],
          "primaryMisconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
          "diagnosisMap": {
            "128": {
              "misconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
              "errorExplanation": "Tag is 128 bits. The standard GCM IV is 96 bits.",
              "recoveryPath": {
                "simplerExplanation": "Type 96.",
                "guidedFixPrompt": "Type 96"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d6-b3-nonce-reuse-catastrophe",
        "day": 6,
        "blockNumber": 3,
        "title": "Cryptographic Catastrophe: Why Nonce Reuse in AES-GCM Completely Destroys Security",
        "conceptBudget": {
          "primaryConcept": "Nonce Reuse Invariant",
          "supportingTerms": [
            "Nonce Reuse (`Encrypting two distinct messages with the same (Key, IV) pair in AES-GCM allows attackers to recover the authentication key via polynomial root finding`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d6-b2-gcm-recommended-nonce-bits",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nonce_reuse_demo.js",
            "initialCode": "function getNonceReuseRule() {\n  return 'REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES';\n}\n\nconsole.log(getNonceReuseRule());",
            "expectedOutput": "REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What catastrophic flaw occurs if the same Initialization Vector (IV) is reused with an AES-GCM key?",
          "expectedStringOutput": "REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES",
          "acceptableAnswers": [
            "REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES",
            "Allows attackers to forge messages",
            "Key recovery / message forgery"
          ],
          "primaryMisconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
          "diagnosisMap": {
            "NO_IMPACT": {
              "misconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
              "errorExplanation": "Standard is: REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES.",
              "recoveryPath": {
                "simplerExplanation": "Matches REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES.",
                "guidedFixPrompt": "Type REUSING_A_NONCE_WITH_THE_SAME_KEY_IN_AES_GCM_ALLOWS_ATTACKERS_TO_FORGE_MESSAGES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Password Hashing & Key Derivation: Argon2id, Bcrypt & Salt Invariants",
    "overviewMetaphor": "Argon2id Is a Heavy Metal Safe That Takes 64MB of RAM to Open: Fast hashes like SHA-256 can be tested 10,000,000,000 times per second on a Bitcoin mining rig; Argon2id requires every attempt to allocate 64 MB ($65,536\\text{ KB}$) of RAM and 3 time iterations, choking GPU brute-force cracking to a dead crawl (`ARGON2ID_CONFIG_HARDENED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d7-b1-argon2id-validator",
        "day": 7,
        "blockNumber": 1,
        "title": "Password Security: Validating Argon2id Parameters ($65536\\text{ KB}$ RAM, 3 Iterations, 4 Threads)",
        "conceptBudget": {
          "primaryConcept": "Password Hashing Work Factor & Argon2id Parameter Validator",
          "supportingTerms": [
            "Memory Cost ($65536\\text{ KB}$)",
            "Time Iterations ($3$)",
            "Parallelism Threads ($4$)",
            "Status: Argon2id Config Hardened Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d6-b1-aes-gcm-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Argon2id Memory-Hard Key Derivation Ledger",
              "boxes": [
                {
                  "label": "1. Memory Cost (m=65536 KB)",
                  "value": "64 MB RAM allocation per hash (Defeats ASIC / GPU mass parallel cracking)",
                  "varType": "Memory",
                  "isUpdated": false
                },
                {
                  "label": "2. Time Iterations (t=3)",
                  "value": "3 passes over memory matrix (Enforces minimum compute delay)",
                  "varType": "Iterations",
                  "isUpdated": false
                },
                {
                  "label": "Configuration Status",
                  "value": "ARGON2ID CONFIG HARDENED NOMINAL (OWASP PASSWORD STANDARD!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "argon2id_demo.js",
            "initialCode": "function validateArgon(mKb, tIter, pThreads) {\n  const isMemOk = mKb >= 65536;\n  const isIterOk = tIter >= 3;\n  const isThreadOk = pThreads >= 1;\n  const isApproved = isMemOk && isIterOk && isThreadOk;\n  return {\n    memoryCostKb: mKb,\n    timeIterations: tIter,\n    isProductionHardened: isApproved,\n    status: isApproved ? 'ARGON2ID_CONFIG_HARDENED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateArgon(65536, 3, 4)));",
            "expectedOutput": "{\"memoryCostKb\":65536,\"timeIterations\":3,\"isProductionHardened\":true,\"status\":\"ARGON2ID_CONFIG_HARDENED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minimum memory cost in KB is recommended by OWASP for production Argon2id password hashing?",
          "expectedStringOutput": "65536",
          "acceptableAnswers": [
            "65536",
            "memoryCostKb\":65536",
            "64MB",
            "64 MB"
          ],
          "primaryMisconceptionId": "MC_CYBER_PASSWORD_HASHING_ARGON2ID_BCRYPT",
          "diagnosisMap": {
            "1024": {
              "misconceptionId": "MC_CYBER_PASSWORD_HASHING_ARGON2ID_BCRYPT",
              "errorExplanation": "1024 KB (1MB) is too weak against modern GPUs. OWASP recommends 65536 KB (64 MB).",
              "recoveryPath": {
                "simplerExplanation": "Memory is 65536 KB.",
                "guidedFixPrompt": "Type 65536"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d7-b2-phc-winner-algorithm-name",
        "day": 7,
        "blockNumber": 2,
        "title": "The Password Hashing Competition Winner Algorithm: `Argon2id`",
        "conceptBudget": {
          "primaryConcept": "Argon2id Invariant",
          "supportingTerms": [
            "`Argon2id` (`Winner of the Password Hashing Competition: Combines Argon2d data-dependent memory access with Argon2i data-independent access for side-channel resistance`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d7-b1-argon2id-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Password Hashing Generations",
            "codeSnippet": "/* 1. Insecure Legacy: MD5 / SHA-1 / SHA-256 (Too fast, instant GPU cracking!) */\n/* 2. Classic Key Derivation: Bcrypt / PBKDF2 / Scrypt */\n/* 3. State-of-the-Art: Argon2id (Memory-hard & Side-channel resistant) */",
            "lineNotes": {
              "1": "Fast hashes are insecure for passwords.",
              "3": "Argon2id is the gold standard winner of the PHC."
            }
          },
          {
            "type": "runnable_code",
            "filename": "argon2id_name_demo.js",
            "initialCode": "function getPhcWinner() {\n  return 'Argon2id';\n}\n\nconsole.log(getPhcWinner());",
            "expectedOutput": "Argon2id",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What memory-hard algorithm won the official Password Hashing Competition?",
          "expectedStringOutput": "Argon2id",
          "acceptableAnswers": [
            "Argon2id",
            "'Argon2id'",
            "argon2id",
            "Argon2"
          ],
          "primaryMisconceptionId": "MC_CYBER_PASSWORD_HASHING_ARGON2ID_BCRYPT",
          "diagnosisMap": {
            "SHA-256": {
              "misconceptionId": "MC_CYBER_PASSWORD_HASHING_ARGON2ID_BCRYPT",
              "errorExplanation": "SHA-256 is a fast digest hash, not a password KDF. The PHC winner is Argon2id.",
              "recoveryPath": {
                "simplerExplanation": "Type Argon2id.",
                "guidedFixPrompt": "Type Argon2id"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d7-b3-cryptographic-salt-uniqueness",
        "day": 7,
        "blockNumber": 3,
        "title": "Salting Invariant: Unique 16-Byte Cryptographic Salts Defeat Precomputed Rainbow Tables",
        "conceptBudget": {
          "primaryConcept": "Unique Salt Invariant",
          "supportingTerms": [
            "Cryptographic Salt (`A unique 16-byte random value appended to each password before hashing, guaranteeing identical passwords produce completely different hashes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d7-b2-phc-winner-algorithm-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "salt_demo.js",
            "initialCode": "function getSaltingRule() {\n  return 'A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES';\n}\n\nconsole.log(getSaltingRule());",
            "expectedOutput": "A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why must a unique random cryptographic salt be generated for every individual user password?",
          "expectedStringOutput": "A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES",
          "acceptableAnswers": [
            "A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES",
            "Defeat rainbow tables",
            "Prevent rainbow table lookup"
          ],
          "primaryMisconceptionId": "MC_CYBER_PASSWORD_HASHING_ARGON2ID_BCRYPT",
          "diagnosisMap": {
            "GLOBAL_SALT_IS_FINE": {
              "misconceptionId": "MC_CYBER_PASSWORD_HASHING_ARGON2ID_BCRYPT",
              "errorExplanation": "Standard is: A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES.",
              "recoveryPath": {
                "simplerExplanation": "Matches A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES.",
                "guidedFixPrompt": "Type A_UNIQUE_CRYPTOGRAPHIC_SALT_MUST_BE_GENERATED_FOR_EVERY_USER_ACCOUNT_TO_DEFEAT_RAINBOW_TABLES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Public Key Infrastructure (PKI): X.509 Digital Certificates & TLS 1.3",
    "overviewMetaphor": "An X.509 Certificate Chain Is an Official Notarized Passport: The Root CA (Government) signs the Intermediate CA (Embassy), which signs your Leaf Certificate (Passport with your name `example.com`); your browser trusts the pre-installed Root CA, following the signature chain step-by-step to guarantee you are talking to the genuine bank server (`X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d8-b1-x509-chain-validator",
        "day": 8,
        "blockNumber": 1,
        "title": "PKI Chain of Trust: Validating Leaf $\\to$ Intermediate $\\to$ Trusted Root CA",
        "conceptBudget": {
          "primaryConcept": "X.509 Certificate Chain of Trust Validator",
          "supportingTerms": [
            "Leaf Certificate (`'example.com'`)",
            "Intermediate CA",
            "Trusted Root CA",
            "Timestamp Validity",
            "Status: X509 Certificate Chain Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d7-b1-argon2id-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "X.509 Hierarchical PKI Chain of Trust Ledger",
              "boxes": [
                {
                  "label": "1. Leaf Certificate",
                  "value": "Subject: 'example.com', Issuer: 'Inter CA' (Signed by Intermediate)",
                  "varType": "Leaf",
                  "isUpdated": false
                },
                {
                  "label": "2. Intermediate CA",
                  "value": "Subject: 'Inter CA', Issuer: 'Root CA' (Signed by Root)",
                  "varType": "Intermediate",
                  "isUpdated": false
                },
                {
                  "label": "3. Trusted Root CA",
                  "value": "Subject: 'Root CA', Issuer: 'Root CA' (Self-signed in OS Trust Store)",
                  "varType": "Root",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pki_demo.js",
            "initialCode": "function validateX509Chain(leaf, inter, root, now) {\n  const isLeafDateOk = now >= leaf.notBefore && now <= leaf.notAfter;\n  const isLeafSignedByInter = leaf.issuer === inter.subject;\n  const isInterSignedByRoot = inter.issuer === root.subject;\n  const isRootSelfSigned = root.issuer === root.subject && root.isTrustedRoot;\n  const isChainOk = isLeafDateOk && isLeafSignedByInter && isInterSignedByRoot && isRootSelfSigned;\n  return {\n    leafDomain: leaf.subject,\n    isChainOfTrustVerified: isChainOk,\n    status: isChainOk ? 'X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconst root = { subject: 'Root CA', issuer: 'Root CA', isTrustedRoot: true, notBefore: 0, notAfter: 2000000000000 };\nconst inter = { subject: 'Inter CA', issuer: 'Root CA', notBefore: 0, notAfter: 2000000000000 };\nconst leaf = { subject: 'example.com', issuer: 'Inter CA', notBefore: 1000, notAfter: 2000000000000 };\nconsole.log(JSON.stringify(validateX509Chain(leaf, inter, root, 50000)));",
            "expectedOutput": "{\"leafDomain\":\"example.com\",\"isChainOfTrustVerified\":true,\"status\":\"X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an X.509 certificate chain has been verified back to a trusted Root CA?",
          "expectedStringOutput": "X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL",
            "status\":\"X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_PKI_X509_TLS_HANDSHAKE_CERTIFICATES",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CYBER_PKI_X509_TLS_HANDSHAKE_CERTIFICATES",
              "errorExplanation": "Matches X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type X509_CERTIFICATE_CHAIN_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d8-b2-standard-certificate-format-name",
        "day": 8,
        "blockNumber": 2,
        "title": "The Standard Web Security Digital Certificate Format: `X.509`",
        "conceptBudget": {
          "primaryConcept": "X.509 Standard Invariant",
          "supportingTerms": [
            "`X.509` (`The ITU-T standard format for public key certificates defining fields for Subject, Issuer, Public Key, Validity Period, and Extensions like SAN`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d8-b1-x509-chain-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "X.509 Certificate Fields",
            "codeSnippet": "/* X.509 CERTIFICATE SCHEMA: */\nVersion: 3 (0x2)\nSerial Number: 04:a1:2c:...\nSignature Algorithm: sha256WithRSAEncryption\nIssuer: CN = Let's Encrypt Authority X3\nValidity: Not Before: 2026-01-01, Not After: 2026-04-01\nSubject: CN = example.com\nSubject Alternative Name (SAN): DNS:example.com, DNS:www.example.com",
            "lineNotes": {
              "2": "Version 3 supports SAN extensions."
            }
          },
          {
            "type": "runnable_code",
            "filename": "x509_name_demo.js",
            "initialCode": "function getCertFormat() {\n  return 'X.509';\n}\n\nconsole.log(getCertFormat());",
            "expectedOutput": "X.509",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard ITU-T specification format for TLS digital certificates?",
          "expectedStringOutput": "X.509",
          "acceptableAnswers": [
            "X.509",
            "'X.509'",
            "x509",
            "X509"
          ],
          "primaryMisconceptionId": "MC_CYBER_PKI_X509_TLS_HANDSHAKE_CERTIFICATES",
          "diagnosisMap": {
            "PGP": {
              "misconceptionId": "MC_CYBER_PKI_X509_TLS_HANDSHAKE_CERTIFICATES",
              "errorExplanation": "PGP uses a web of trust. Web PKI uses the hierarchical X.509 standard.",
              "recoveryPath": {
                "simplerExplanation": "Type X.509.",
                "guidedFixPrompt": "Type X.509"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d8-b3-tls-13-forward-secrecy-guarantee",
        "day": 8,
        "blockNumber": 3,
        "title": "Forward Secrecy: Why TLS 1.3 Enforces Ephemeral Diffie-Hellman Key Exchange",
        "conceptBudget": {
          "primaryConcept": "Forward Secrecy Invariant",
          "supportingTerms": [
            "Perfect Forward Secrecy (`Ensures that compromising a server's long-term private key in the future cannot decrypt past recorded TLS traffic`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d8-b2-standard-certificate-format-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "forward_secrecy_demo.js",
            "initialCode": "function getForwardSecrecyRule() {\n  return 'TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY';\n}\n\nconsole.log(getForwardSecrecyRule());",
            "expectedOutput": "TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why did TLS 1.3 eliminate RSA static key exchange in favor of Ephemeral Diffie-Hellman?",
          "expectedStringOutput": "TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY",
          "acceptableAnswers": [
            "TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY",
            "Guarantee perfect forward secrecy",
            "Forward secrecy"
          ],
          "primaryMisconceptionId": "MC_CYBER_PKI_X509_TLS_HANDSHAKE_CERTIFICATES",
          "diagnosisMap": {
            "NO_REASON": {
              "misconceptionId": "MC_CYBER_PKI_X509_TLS_HANDSHAKE_CERTIFICATES",
              "errorExplanation": "Standard is: TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY.",
              "recoveryPath": {
                "simplerExplanation": "Matches TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY.",
                "guidedFixPrompt": "Type TLS_1_3_MANDATES_EPHEMERAL_DIFFIE_HELLMAN_TO_GUARANTEE_PERFECT_FORWARD_SECRECY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Identity & Access Management: JWT Vulnerabilities & Alg 'none' Attacks",
    "overviewMetaphor": "JWT Algorithm 'none' Attack Is an Unsigned Check with 'Signature Not Required': An attacker takes a genuine JWT token, changes their user role to 'ADMIN', and modifies the header to `{\"alg\": \"none\"}`, hoping a naive backend library skips signature verification and cashes the fraudulent administrative check (`JWT_HEADER_ALGORITHM_APPROVED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d9-b1-jwt-header-sanitizer",
        "day": 9,
        "blockNumber": 1,
        "title": "JWT Security: Rejecting Insecure `alg: 'none'` & Enforcing Whitelisted Ciphers",
        "conceptBudget": {
          "primaryConcept": "JWT Algorithm 'none' Attack & Signature Header Sanitizer",
          "supportingTerms": [
            "Algorithm String (`'HS256'` vs `'none'`)",
            "None Attack Flag (`true`)",
            "Whitelisted Algorithms (`HS256`, `RS256`, `ES256`)",
            "Status: JWT Header Algorithm Approved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d8-b1-x509-chain-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "JWT Algorithm Whitelist Verification Ledger",
              "boxes": [
                {
                  "label": "Valid Token ({alg: 'HS256'})",
                  "value": "Whitelisted HMAC-SHA256 -> Approved (NOMINAL!)",
                  "varType": "Approved Alg",
                  "isUpdated": true
                },
                {
                  "label": "Malicious Token ({alg: 'none'})",
                  "value": "Bypass attempt detected -> REJECTED & FLAGGED",
                  "varType": "None Attack",
                  "isUpdated": false
                },
                {
                  "label": "Verification Status",
                  "value": "JWT HEADER ALGORITHM APPROVED NOMINAL (SIGNATURE FORGERY BLOCKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "jwt_sanitizer_demo.js",
            "initialCode": "function sanitizeJwt(hdr) {\n  const alg = (hdr.alg || '').toUpperCase();\n  const isApproved = alg === 'HS256' || alg === 'RS256' || alg === 'ES256';\n  const isNone = alg === 'NONE' || alg === '';\n  return {\n    isSignatureAlgorithmApproved: isApproved,\n    isNoneAttackDetected: isNone,\n    status: isApproved ? 'JWT_HEADER_ALGORITHM_APPROVED_NOMINAL' : 'REJECTED_INSECURE_OR_NONE_ALGORITHM'\n  };\n}\n\nconsole.log(JSON.stringify(sanitizeJwt({ alg: 'HS256', typ: 'JWT' })));\nconsole.log(JSON.stringify(sanitizeJwt({ alg: 'none', typ: 'JWT' })));",
            "expectedOutput": "{\"isSignatureAlgorithmApproved\":true,\"isNoneAttackDetected\":false,\"status\":\"JWT_HEADER_ALGORITHM_APPROVED_NOMINAL\"}\n{\"isSignatureAlgorithmApproved\":false,\"isNoneAttackDetected\":true,\"status\":\"REJECTED_INSECURE_OR_NONE_ALGORITHM\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a JWT header specifies a cryptographically approved signature algorithm?",
          "expectedStringOutput": "JWT_HEADER_ALGORITHM_APPROVED_NOMINAL",
          "acceptableAnswers": [
            "JWT_HEADER_ALGORITHM_APPROVED_NOMINAL",
            "status\":\"JWT_HEADER_ALGORITHM_APPROVED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_JWT_SIGNATURE_NONE_ALGORITHM_FLAW",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_CYBER_JWT_SIGNATURE_NONE_ALGORITHM_FLAW",
              "errorExplanation": "Matches JWT_HEADER_ALGORITHM_APPROVED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type JWT_HEADER_ALGORITHM_APPROVED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d9-b2-jwt-none-algorithm-string-name",
        "day": 9,
        "blockNumber": 2,
        "title": "The Insecure JWT Algorithm Literal: `'none'`",
        "conceptBudget": {
          "primaryConcept": "JWT 'none' Invariant",
          "supportingTerms": [
            "`none` (`The RFC 7519 algorithm token indicating unsecured unsigned data that must be explicitly rejected by backend authorization engines`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d9-b1-jwt-header-sanitizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "JWT Structure Breakdown",
            "codeSnippet": "/* JWT STRUCTURE: */\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  // 1. Header (Base64Url)\neyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6... // 2. Payload Claims (Base64Url)\nsom3CrYpt0gr4ph1cSigN4tur3             // 3. HMAC / RSA Signature",
            "lineNotes": {
              "2": "Header defines algorithm.",
              "4": "Payload carries claims.",
              "5": "Signature proves tamper-resistance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "jwt_none_demo.js",
            "initialCode": "function getNoneAlg() {\n  return 'none';\n}\n\nconsole.log(getNoneAlg());",
            "expectedOutput": "none",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What algorithm string literal in JWT headers must be rejected to prevent signature bypass vulnerabilities?",
          "expectedStringOutput": "none",
          "acceptableAnswers": [
            "none",
            "'none'",
            "NONE"
          ],
          "primaryMisconceptionId": "MC_CYBER_JWT_SIGNATURE_NONE_ALGORITHM_FLAW",
          "diagnosisMap": {
            "HS256": {
              "misconceptionId": "MC_CYBER_JWT_SIGNATURE_NONE_ALGORITHM_FLAW",
              "errorExplanation": "HS256 is secure HMAC. The insecure bypass string is 'none'.",
              "recoveryPath": {
                "simplerExplanation": "Type none.",
                "guidedFixPrompt": "Type none"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d9-b3-key-confusion-rs256-hs256-vulnerability",
        "day": 9,
        "blockNumber": 3,
        "title": "Key Confusion: Preventing Public RS256 Keys from Being Evaluated as Symmetric HS256 HMAC Secrets",
        "conceptBudget": {
          "primaryConcept": "Key Confusion Invariant",
          "supportingTerms": [
            "Key Confusion Attack (`Occurs when an attacker signs a token using the server's public RSA key as the HMAC symmetric secret string, exploiting polymorphic verification functions`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d9-b2-jwt-none-algorithm-string-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "key_confusion_demo.js",
            "initialCode": "function getKeyConfusionRule() {\n  return 'HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS';\n}\n\nconsole.log(getKeyConfusionRule());",
            "expectedOutput": "HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do backend developers prevent JWT asymmetric-to-symmetric key confusion attacks?",
          "expectedStringOutput": "HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS",
          "acceptableAnswers": [
            "HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS",
            "Hardcode expected algorithm in verification",
            "Enforce expected algorithm in jwt.verify"
          ],
          "primaryMisconceptionId": "MC_CYBER_JWT_SIGNATURE_NONE_ALGORITHM_FLAW",
          "diagnosisMap": {
            "ACCEPT_HEADER_ALG": {
              "misconceptionId": "MC_CYBER_JWT_SIGNATURE_NONE_ALGORITHM_FLAW",
              "errorExplanation": "Standard is: HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS.",
                "guidedFixPrompt": "Type HARDCODE_EXPECTED_ALGORITHM_IN_VERIFICATION_CALLS_TO_PREVENT_ASYMMETRIC_KEY_CONFUSION_ATTACKS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Authentication: Multi-Factor Authentication & TOTP (RFC 6238)",
    "overviewMetaphor": "TOTP MFA Is a Synchronized Rotating Minute-Hand Clock: The user's phone and the bank server share a secret seed; every 30 seconds ($T = \\lfloor t / 30 \\rfloor = 53333333$), the clock advances by 1 step and computes a fresh 6-digit code; allowing a $\\pm 1$ drift window ($[53333332, 53333333, 53333334]$) accommodates minor device clock differences seamlessly (`TOTP_TIME_STEP_CALCULATED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d10-b1-totp-step-calculator",
        "day": 10,
        "blockNumber": 1,
        "title": "TOTP MFA: Calculating 30-Second Time-Step Counter & $\\pm 1$ Drift Tolerance",
        "conceptBudget": {
          "primaryConcept": "TOTP Time-Step Counter & Drift Tolerance Calculator",
          "supportingTerms": [
            "Current Timestamp ($1600000000\\text{s}$)",
            "Step Duration ($30\\text{s}$)",
            "Step Counter ($53333333$)",
            "Drift Window ($[53333332, 53333333, 53333334]$)",
            "Status: TOTP Time Step Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d9-b1-jwt-header-sanitizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TOTP RFC 6238 Dynamic Time-Step Ledger",
              "boxes": [
                {
                  "label": "1. Timestamp Division",
                  "value": "floor(1600000000 / 30) = 53333333 (Current 30s epoch interval)",
                  "varType": "Step Counter T",
                  "isUpdated": false
                },
                {
                  "label": "2. Drift Tolerance Window",
                  "value": "[53333332, 53333333, 53333334] (Permits T-1 and T+1 for clock skew)",
                  "varType": "Drift Window",
                  "isUpdated": true
                },
                {
                  "label": "Calculation Status",
                  "value": "TOTP TIME STEP CALCULATED NOMINAL (MFA SYNCHRONIZATION NOMINAL!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "totp_demo.js",
            "initialCode": "function calcTotpStep(tSec, stepDur) {\n  const step = Math.floor(tSec / stepDur);\n  return {\n    currentStepCounter: step,\n    validDriftWindow: [step - 1, step, step + 1],\n    status: 'TOTP_TIME_STEP_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcTotpStep(1600000000, 30)));",
            "expectedOutput": "{\"currentStepCounter\":53333333,\"validDriftWindow\":[53333332,53333333,53333334],\"status\":\"TOTP_TIME_STEP_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary step counter T for timestamp 1600000000 with a 30-second interval?",
          "expectedStringOutput": "53333333",
          "acceptableAnswers": [
            "53333333",
            "currentStepCounter\":53333333"
          ],
          "primaryMisconceptionId": "MC_CYBER_TOTP_MFA_TIME_DRIFT_TOLERANCE",
          "diagnosisMap": {
            "1600000000": {
              "misconceptionId": "MC_CYBER_TOTP_MFA_TIME_DRIFT_TOLERANCE",
              "errorExplanation": "Timestamp must be divided by 30: floor(1600000000 / 30) = 53333333.",
              "recoveryPath": {
                "simplerExplanation": "Step is 53333333.",
                "guidedFixPrompt": "Type 53333333"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d10-b2-standard-totp-step-duration-number",
        "day": 10,
        "blockNumber": 2,
        "title": "The Standard TOTP Interval Duration: 30 Seconds",
        "conceptBudget": {
          "primaryConcept": "30-Second TOTP Invariant",
          "supportingTerms": [
            "30 Seconds (`The RFC 6238 standard time-step interval X = 30 seconds balancing token freshness with human typing time`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d10-b1-totp-step-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TOTP Algorithm Steps (RFC 6238)",
            "codeSnippet": "/* TOTP ALGORITHM: */\n1. T = (CurrentUnixTime - T0) / 30\n2. HMAC_Hash = HMAC-SHA1( SecretKey, T )\n3. BinaryCode = DynamicTruncation( HMAC_Hash )\n4. Token = BinaryCode mod 10^6 (Produces 6-digit display code!)",
            "lineNotes": {
              "2": "Step interval is 30 seconds.",
              "5": "Dynamic truncation produces 6 digits."
            }
          },
          {
            "type": "runnable_code",
            "filename": "totp_dur_demo.js",
            "initialCode": "function getTotpDuration() {\n  return 30;\n}\n\nconsole.log(getTotpDuration());",
            "expectedOutput": "30",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many seconds does a standard RFC 6238 TOTP code remain valid for before rotating?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "30s",
            "thirty",
            "30 seconds"
          ],
          "primaryMisconceptionId": "MC_CYBER_TOTP_MFA_TIME_DRIFT_TOLERANCE",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_CYBER_TOTP_MFA_TIME_DRIFT_TOLERANCE",
              "errorExplanation": "Standard Google/Microsoft Authenticator time-step is 30 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Type 30.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d10-b3-replay-protection-consumed-tokens",
        "day": 10,
        "blockNumber": 3,
        "title": "Replay Attack Defense: Storing and Burning Consumed TOTP Codes Within the Current Window",
        "conceptBudget": {
          "primaryConcept": "TOTP Single-Use Invariant",
          "supportingTerms": [
            "TOTP Replay Defense (`Recording consumed token codes prevents an attacker with an intercepted packet from reusing the token within the remaining 30-second window`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d10-b2-standard-totp-step-duration-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "totp_replay_demo.js",
            "initialCode": "function getTotpReplayRule() {\n  return 'USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW';\n}\n\nconsole.log(getTotpReplayRule());",
            "expectedOutput": "USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do production authentication services prevent an attacker from replaying an intercepted TOTP code?",
          "expectedStringOutput": "USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW",
          "acceptableAnswers": [
            "USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW",
            "Burn used codes in cache",
            "Track and invalidate used codes"
          ],
          "primaryMisconceptionId": "MC_CYBER_TOTP_MFA_TIME_DRIFT_TOLERANCE",
          "diagnosisMap": {
            "NO_PROTECTION_NEEDED": {
              "misconceptionId": "MC_CYBER_TOTP_MFA_TIME_DRIFT_TOLERANCE",
              "errorExplanation": "Standard is: USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW.",
              "recoveryPath": {
                "simplerExplanation": "Matches USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW.",
                "guidedFixPrompt": "Type USED_TOTP_CODES_MUST_BE_BURNED_IN_CACHE_TO_PREVENT_REPLAY_ATTACKS_WITHIN_THE_30_SECOND_WINDOW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Authorization: Role-Based (RBAC) & Attribute-Based Access Control (ABAC)",
    "overviewMetaphor": "RBAC Is an Employee Badge; ABAC Is an Airport Security Checkpoint: RBAC checks your title ('SECURITY_ANALYST'); ABAC checks additional contextual attributes: Do you have an active boarding pass (MFA)? Is the departure gate in your designated terminal (IP allowed)? Both role and environmental attributes must align to grant access (`ACCESS_GRANTED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d11-b1-rbac-abac-decision-evaluator",
        "day": 11,
        "blockNumber": 1,
        "title": "Access Control: Evaluating Role Hierarchy + Environmental Attributes (`ACCESS_GRANTED_NOMINAL`)",
        "conceptBudget": {
          "primaryConcept": "RBAC & ABAC Access Decision Evaluator",
          "supportingTerms": [
            "User Roles (`['ENGINEER', 'SECURITY_ANALYST']`)",
            "Required Role (`'SECURITY_ANALYST'`)",
            "Environmental Attributes (`isMfaVerified`, `isIpAllowed`)",
            "Status: Access Granted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d10-b1-totp-step-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RBAC & ABAC Multi-Tier Authorization Decision Ledger",
              "boxes": [
                {
                  "label": "Role Check (RBAC)",
                  "value": "User has 'SECURITY_ANALYST' -> Role authorized (PASS)",
                  "varType": "RBAC Tier",
                  "isUpdated": false
                },
                {
                  "label": "Context Check (ABAC)",
                  "value": "MFA verified + Whitelisted IP subnet -> Environmental authorized (PASS)",
                  "varType": "ABAC Tier",
                  "isUpdated": false
                },
                {
                  "label": "Access Decision",
                  "value": "Both tiers approved -> ACCESS GRANTED NOMINAL (LEAST PRIVILEGE ENFORCED!)",
                  "varType": "Decision",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rbac_demo.js",
            "initialCode": "function evalAccess(roles, reqRole, env) {\n  const hasRole = roles.includes(reqRole) || roles.includes('ADMIN');\n  const isEnvOk = env.isMfaVerified === true && env.isIpAllowed === true;\n  const isGranted = hasRole && isEnvOk;\n  return {\n    isRoleAuthorized: hasRole,\n    isAccessGranted: isGranted,\n    status: isGranted ? 'ACCESS_GRANTED_NOMINAL' : 'ACCESS_DENIED_UNAUTHORIZED'\n  };\n}\n\nconsole.log(JSON.stringify(evalAccess(['ENGINEER', 'SECURITY_ANALYST'], 'SECURITY_ANALYST', { isMfaVerified: true, isIpAllowed: true })));\nconsole.log(JSON.stringify(evalAccess(['GUEST'], 'SECURITY_ANALYST', { isMfaVerified: true, isIpAllowed: true })));",
            "expectedOutput": "{\"isRoleAuthorized\":true,\"isAccessGranted\":true,\"status\":\"ACCESS_GRANTED_NOMINAL\"}\n{\"isRoleAuthorized\":false,\"isAccessGranted\":false,\"status\":\"ACCESS_DENIED_UNAUTHORIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a user meets both RBAC role requirements and ABAC environment criteria?",
          "expectedStringOutput": "ACCESS_GRANTED_NOMINAL",
          "acceptableAnswers": [
            "ACCESS_GRANTED_NOMINAL",
            "status\":\"ACCESS_GRANTED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_RBAC_ABAC_PRIVILEGE_ESCALATION",
          "diagnosisMap": {
            "DENIED": {
              "misconceptionId": "MC_CYBER_RBAC_ABAC_PRIVILEGE_ESCALATION",
              "errorExplanation": "Matches ACCESS_GRANTED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type ACCESS_GRANTED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d11-b2-rbac-acronym-name",
        "day": 11,
        "blockNumber": 2,
        "title": "The Role-Based Access Control Acronym: `RBAC`",
        "conceptBudget": {
          "primaryConcept": "RBAC Acronym Invariant",
          "supportingTerms": [
            "`RBAC` (`Role-Based Access Control: An approach to restricting system access to authorized users based on predefined organizational roles`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d11-b1-rbac-abac-decision-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RBAC vs ABAC",
            "codeSnippet": "/* 1. RBAC (Role-Based Access Control): */\nif (user.roles.includes('FINANCE_MANAGER')) grantAccess();\n\n/* 2. ABAC (Attribute-Based Access Control): */\nif (user.role === 'FINANCE_MANAGER' && resource.department === 'HR' && request.time < '18:00' && request.ip.isCorporateVpn) grantAccess();",
            "lineNotes": {
              "2": "RBAC checks role membership.",
              "5": "ABAC evaluates fine-grained dynamic attributes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rbac_name_demo.js",
            "initialCode": "function getRbac() {\n  return 'RBAC';\n}\n\nconsole.log(getRbac());",
            "expectedOutput": "RBAC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for Role-Based Access Control?",
          "expectedStringOutput": "RBAC",
          "acceptableAnswers": [
            "RBAC",
            "'RBAC'",
            "rbac"
          ],
          "primaryMisconceptionId": "MC_CYBER_RBAC_ABAC_PRIVILEGE_ESCALATION",
          "diagnosisMap": {
            "ABAC": {
              "misconceptionId": "MC_CYBER_RBAC_ABAC_PRIVILEGE_ESCALATION",
              "errorExplanation": "ABAC is Attribute-Based. Role-Based is RBAC.",
              "recoveryPath": {
                "simplerExplanation": "Type RBAC.",
                "guidedFixPrompt": "Type RBAC"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d11-b3-privilege-escalation-horizontal-vs-vertical",
        "day": 11,
        "blockNumber": 3,
        "title": "Privilege Escalation: Distinguishing Vertical Escalation from Horizontal Access Flaws",
        "conceptBudget": {
          "primaryConcept": "Vertical vs Horizontal Escalation Invariant",
          "supportingTerms": [
            "Vertical vs Horizontal Escalation (`Vertical Escalation = standard user becoming admin; Horizontal Escalation = user accessing peer customer records with identical privilege level`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d11-b2-rbac-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "escalation_demo.js",
            "initialCode": "function getEscalationRule() {\n  return 'VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS';\n}\n\nconsole.log(getEscalationRule());",
            "expectedOutput": "VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the fundamental difference between vertical and horizontal privilege escalation?",
          "expectedStringOutput": "VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS",
          "acceptableAnswers": [
            "VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS",
            "Vertical gains higher roles horizontal accesses peers",
            "Higher roles vs peer records"
          ],
          "primaryMisconceptionId": "MC_CYBER_RBAC_ABAC_PRIVILEGE_ESCALATION",
          "diagnosisMap": {
            "NO_DIFFERENCE": {
              "misconceptionId": "MC_CYBER_RBAC_ABAC_PRIVILEGE_ESCALATION",
              "errorExplanation": "Standard is: VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS.",
              "recoveryPath": {
                "simplerExplanation": "Matches VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS.",
                "guidedFixPrompt": "Type VERTICAL_ESCALATION_GAINS_HIGHER_ADMIN_ROLES_WHILE_HORIZONTAL_ESCALATION_ACCESSES_PEER_RECORDS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Broken Object Level Authorization (BOLA / IDOR) Defense",
    "overviewMetaphor": "BOLA / IDOR Is Guessing Apartment Numbers on a Mailbox: An apartment building might let you into the lobby with a valid key (Authentication); but if you open your neighbor's mailbox just by changing the number from 1004 to 1005 (BOLA / IDOR), the building security has failed; every document query must enforce a tenant ownership lock (`userId === ownerId`).",
    "blocks": [
      {
        "id": "cyber-d12-b1-bola-authorizer",
        "day": 12,
        "blockNumber": 1,
        "title": "BOLA / IDOR Defense: Enforcing Tenant Ownership Checks at the Repository Layer",
        "conceptBudget": {
          "primaryConcept": "BOLA / IDOR Resource Ownership Authorizer",
          "supportingTerms": [
            "Requesting User ID (`'usr_123'`)",
            "Resource Owner ID (`'usr_123'` vs `'usr_victim'`)",
            "Role (`'USER'` vs `'ADMIN'`)",
            "Status: Object Access Authorized Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d11-b1-rbac-abac-decision-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "BOLA / IDOR Tenant Ownership Boundary Ledger",
              "boxes": [
                {
                  "label": "Valid Access (Owner)",
                  "value": "usr_123 requests invoice owned by usr_123 -> AUTHORIZED (NOMINAL!)",
                  "varType": "Owner Access",
                  "isUpdated": true
                },
                {
                  "label": "BOLA Attempt (Intruder)",
                  "value": "usr_attacker requests invoice owned by usr_victim -> BLOCKED HTTP 403",
                  "varType": "Intruder",
                  "isUpdated": false
                },
                {
                  "label": "Authorization Status",
                  "value": "OBJECT ACCESS AUTHORIZED NOMINAL (TENANT BOUNDARY PRESERVED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bola_demo.js",
            "initialCode": "function authorizeObject(userId, role, ownerId) {\n  const isAdmin = role === 'ADMIN';\n  const isOwner = userId === ownerId;\n  const isApproved = isAdmin || isOwner;\n  return {\n    isAuthorized: isApproved,\n    status: isApproved ? 'OBJECT_ACCESS_AUTHORIZED_NOMINAL' : 'BOLA_UNAUTHORIZED_OBJECT_ACCESS_BLOCKED'\n  };\n}\n\nconsole.log(JSON.stringify(authorizeObject('usr_123', 'USER', 'usr_123')));\nconsole.log(JSON.stringify(authorizeObject('usr_attacker', 'USER', 'usr_victim')));",
            "expectedOutput": "{\"isAuthorized\":true,\"status\":\"OBJECT_ACCESS_AUTHORIZED_NOMINAL\"}\n{\"isAuthorized\":false,\"status\":\"BOLA_UNAUTHORIZED_OBJECT_ACCESS_BLOCKED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a user has authorized ownership over a requested object resource?",
          "expectedStringOutput": "OBJECT_ACCESS_AUTHORIZED_NOMINAL",
          "acceptableAnswers": [
            "OBJECT_ACCESS_AUTHORIZED_NOMINAL",
            "status\":\"OBJECT_ACCESS_AUTHORIZED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_BOLA_IDOR_OBJECT_AUTHORIZATION",
          "diagnosisMap": {
            "BLOCKED": {
              "misconceptionId": "MC_CYBER_BOLA_IDOR_OBJECT_AUTHORIZATION",
              "errorExplanation": "Matches OBJECT_ACCESS_AUTHORIZED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type OBJECT_ACCESS_AUTHORIZED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d12-b2-idor-acronym-name",
        "day": 12,
        "blockNumber": 2,
        "title": "The Insecure Direct Object Reference Acronym: `IDOR`",
        "conceptBudget": {
          "primaryConcept": "IDOR Acronym Invariant",
          "supportingTerms": [
            "`IDOR` (`Insecure Direct Object Reference: A vulnerability where an application exposes a reference to an internal database object without access validation`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d12-b1-bola-authorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BOLA / IDOR Attack Anatomy",
            "codeSnippet": "// ❌ INSECURE CONTROLLER (Assumes logged in user can read ANY id):\napp.get('/api/documents/:docId', (req, res) => {\n  const doc = db.find({ id: req.params.docId }); // NO USER CHECK!\n  return res.json(doc);\n});\n\n// ✅ SECURE CONTROLLER (Enforces ownership constraint):\napp.get('/api/documents/:docId', (req, res) => {\n  const doc = db.find({ id: req.params.docId, ownerId: req.user.id }); // ENFORCED!\n  if (!doc) return res.status(404).send();\n  return res.json(doc);\n});",
            "lineNotes": {
              "3": "Unchecked parameter reading causes IDOR.",
              "9": "Query filters by both docId and authenticated user.id."
            }
          },
          {
            "type": "runnable_code",
            "filename": "idor_name_demo.js",
            "initialCode": "function getIdor() {\n  return 'IDOR';\n}\n\nconsole.log(getIdor());",
            "expectedOutput": "IDOR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the classic industry acronym for Insecure Direct Object References?",
          "expectedStringOutput": "IDOR",
          "acceptableAnswers": [
            "IDOR",
            "'IDOR'",
            "idor"
          ],
          "primaryMisconceptionId": "MC_CYBER_BOLA_IDOR_OBJECT_AUTHORIZATION",
          "diagnosisMap": {
            "BOLA": {
              "misconceptionId": "MC_CYBER_BOLA_IDOR_OBJECT_AUTHORIZATION",
              "errorExplanation": "BOLA is the modern API acronym. The classic direct reference acronym is IDOR.",
              "recoveryPath": {
                "simplerExplanation": "Type IDOR.",
                "guidedFixPrompt": "Type IDOR"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d12-b3-opaque-uuidv4-vs-sequential-ids",
        "day": 12,
        "blockNumber": 3,
        "title": "Identifier Hardening: Using Cryptographically Random UUIDv4 to Prevent ID Enumeration",
        "conceptBudget": {
          "primaryConcept": "UUIDv4 Invariant",
          "supportingTerms": [
            "UUIDv4 (`Replacing sequential integer IDs 1, 2, 3 with 128-bit random UUIDs prevents automated scrapers from guessing valid resource identifiers`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d12-b2-idor-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "uuid_demo.js",
            "initialCode": "function getUuidRule() {\n  return 'CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING';\n}\n\nconsole.log(getUuidRule());",
            "expectedOutput": "CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should web APIs use UUIDv4 instead of sequential auto-incrementing integer IDs?",
          "expectedStringOutput": "CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING",
          "acceptableAnswers": [
            "CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING",
            "Prevents sequential ID enumeration",
            "Prevents scraping"
          ],
          "primaryMisconceptionId": "MC_CYBER_BOLA_IDOR_OBJECT_AUTHORIZATION",
          "diagnosisMap": {
            "SMALLER_SIZE": {
              "misconceptionId": "MC_CYBER_BOLA_IDOR_OBJECT_AUTHORIZATION",
              "errorExplanation": "Standard is: CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING.",
                "guidedFixPrompt": "Type CRYPTOGRAPHIC_UUIDV4_PREVENTS_SEQUENTIAL_ID_ENUMERATION_AND_SCRAPING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Network Security: TCP SYN Flood, Port Scanning & Stateful Firewalls",
    "overviewMetaphor": "SYN Cookies Are a Coat-Check Claim Ticket: In a normal TCP handshake, the server holds a reserved room (half-open connection memory) for every guest who says hello (SYN); in a SYN Flood attack, 100,000 bots say hello and never show up, filling the room ($95\\%$ capacity); SYN Cookies encode the state into the initial reply sequence number, allocating zero memory until the guest returns with their final handshake ticket (ACK).",
    "blocks": [
      {
        "id": "cyber-d13-b1-syn-flood-monitor",
        "day": 13,
        "blockNumber": 1,
        "title": "Network Defense: Detecting Connection Backlog Saturation ($95\\% \\ge 90\\%$) & Engaging SYN Cookies",
        "conceptBudget": {
          "primaryConcept": "TCP SYN Flood State Table Exhaustion Monitor",
          "supportingTerms": [
            "Half-Open Connections ($950$)",
            "Max Capacity ($1000$)",
            "Utilization ($95.0\\%$)",
            "Flood Flag (`true`)",
            "Status: SYN Flood Detected SYN Cookies Engaged"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d12-b1-bola-authorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TCP SYN Backlog Saturation & Defense Ledger",
              "boxes": [
                {
                  "label": "Normal Load (100 / 1000)",
                  "value": "10% utilization -> Connection backlog nominal",
                  "varType": "Normal Traffic",
                  "isUpdated": false
                },
                {
                  "label": "SYN Attack (950 / 1000)",
                  "value": "95% utilization >= 90% threshold -> SYN Cookies Engaged!",
                  "varType": "Attack Traffic",
                  "isUpdated": true
                },
                {
                  "label": "Mitigation Status",
                  "value": "SYN FLOOD DETECTED SYN COOKIES ENGAGED (ZERO MEMORY ALLOCATION!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "syn_monitor_demo.js",
            "initialCode": "function monitorSyn(halfOpen, maxCap) {\n  const util = halfOpen / maxCap;\n  const isFlood = util >= 0.90;\n  return {\n    utilizationPercentage: Number((util * 100).toFixed(2)),\n    isSynFloodDetected: isFlood,\n    status: isFlood ? 'SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED' : 'TCP_CONNECTION_BACKLOG_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(monitorSyn(100, 1000)));\nconsole.log(JSON.stringify(monitorSyn(950, 1000)));",
            "expectedOutput": "{\"utilizationPercentage\":10,\"isSynFloodDetected\":false,\"status\":\"TCP_CONNECTION_BACKLOG_NOMINAL\"}\n{\"utilizationPercentage\":95,\"isSynFloodDetected\":true,\"status\":\"SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a TCP SYN flood attack has breached the 90% threshold and engaged SYN Cookies?",
          "expectedStringOutput": "SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED",
          "acceptableAnswers": [
            "SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED",
            "status\":\"SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_SYN_FLOOD_STATEFUL_FIREWALLS",
          "diagnosisMap": {
            "NOMINAL": {
              "misconceptionId": "MC_CYBER_SYN_FLOOD_STATEFUL_FIREWALLS",
              "errorExplanation": "At 95% capacity, status is SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SYN_FLOOD_DETECTED_SYN_COOKIES_ENGAGED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d13-b2-syn-mitigation-cookie-name",
        "day": 13,
        "blockNumber": 2,
        "title": "The Standard TCP SYN Flood Mitigation Mechanism: `SYN Cookies`",
        "conceptBudget": {
          "primaryConcept": "SYN Cookies Invariant",
          "supportingTerms": [
            "`SYN Cookies` (`A stateless TCP handshake technique where the server encodes connection state into the initial SYN-ACK sequence number, avoiding backlog allocation`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d13-b1-syn-flood-monitor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TCP 3-Way Handshake vs SYN Flood",
            "codeSnippet": "/* 1. STANDARD TCP HANDSHAKE: */\nClient --- SYN ---> Server (Allocates half-open table entry in RAM)\nServer <-- SYN-ACK -- Client\nClient --- ACK ---> Server (Connection Established)\n\n/* 2. SYN FLOOD ATTACK: */\nAttacker sends 1,000,000 SYNs from spoofed IPs -> Server RAM exhausted -> Denial of Service!\n/* 3. SYN COOKIES DEFENSE: */\nServer computes Seq# = HMAC(srcIP, srcPort, timestamp) -> ZERO RAM allocated until final ACK!",
            "lineNotes": {
              "2": "Normal handshake holds state in memory.",
              "8": "SYN Cookies make the handshake stateless until valid ACK."
            }
          },
          {
            "type": "runnable_code",
            "filename": "syn_cookie_demo.js",
            "initialCode": "function getSynMitigation() {\n  return 'SYN Cookies';\n}\n\nconsole.log(getSynMitigation());",
            "expectedOutput": "SYN Cookies",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What stateless cryptographic defense mechanism protects TCP servers from connection backlog exhaustion?",
          "expectedStringOutput": "SYN Cookies",
          "acceptableAnswers": [
            "SYN Cookies",
            "'SYN Cookies'",
            "syn cookies",
            "Syncookies"
          ],
          "primaryMisconceptionId": "MC_CYBER_SYN_FLOOD_STATEFUL_FIREWALLS",
          "diagnosisMap": {
            "Firewall": {
              "misconceptionId": "MC_CYBER_SYN_FLOOD_STATEFUL_FIREWALLS",
              "errorExplanation": "Firewalls can be overwhelmed. The kernel-level stateless algorithm is SYN Cookies.",
              "recoveryPath": {
                "simplerExplanation": "Type SYN Cookies.",
                "guidedFixPrompt": "Type SYN Cookies"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d13-b3-stateful-packet-inspection-spi",
        "day": 13,
        "blockNumber": 3,
        "title": "Stateful Packet Inspection: Tracking Established TCP Connection States (`ESTABLISHED,RELATED`)",
        "conceptBudget": {
          "primaryConcept": "SPI Stateful Firewall Invariant",
          "supportingTerms": [
            "`SPI` (`Stateful Packet Inspection: Firewalls that track bidirectional TCP handshake states, automatically permitting return traffic for established outbound requests`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d13-b2-syn-mitigation-cookie-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spi_demo.js",
            "initialCode": "function getSpiRule() {\n  return 'STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC';\n}\n\nconsole.log(getSpiRule());",
            "expectedOutput": "STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What capability allows Stateful Packet Inspection (SPI) firewalls to outperform stateless packet filters?",
          "expectedStringOutput": "STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC",
          "acceptableAnswers": [
            "STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC",
            "Track TCP handshake states for return traffic",
            "Track connection states"
          ],
          "primaryMisconceptionId": "MC_CYBER_SYN_FLOOD_STATEFUL_FIREWALLS",
          "diagnosisMap": {
            "PORT_FILTERING_ONLY": {
              "misconceptionId": "MC_CYBER_SYN_FLOOD_STATEFUL_FIREWALLS",
              "errorExplanation": "Standard is: STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC.",
              "recoveryPath": {
                "simplerExplanation": "Matches STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC.",
                "guidedFixPrompt": "Type STATEFUL_FIREWALLS_TRACK_TCP_HANDSHAKE_STATES_TO_AUTOMATICALLY_PERMIT_LEGITIMATE_RETURN_TRAFFIC"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Secure HTTP Headers: HSTS, X-Content-Type-Options & Frame-Options",
    "overviewMetaphor": "Security Headers Are Warning Signs Stamped on Every Blueprint: HSTS tells the browser 'Always take the armored highway (HTTPS), never the dirt road (HTTP)'; `nosniff` tells the browser 'Never guess file types—if it says text, do not run it as an executable script'; `X-Frame-Options: DENY` stops invisible iframe overlays (Clickjacking) from embedding your bank page.",
    "blocks": [
      {
        "id": "cyber-d14-b1-security-headers-auditor",
        "day": 14,
        "blockNumber": 1,
        "title": "Security Headers: Auditing HSTS (`max-age=31536000`), `nosniff` & `X-Frame-Options: DENY`",
        "conceptBudget": {
          "primaryConcept": "HTTP Security Headers Compliance Auditor",
          "supportingTerms": [
            "HSTS (`strict-transport-security`)",
            "MIME Sniffing (`x-content-type-options: nosniff`)",
            "Frame Options (`x-frame-options: DENY`)",
            "Status: Security Headers Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d13-b1-syn-flood-monitor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "HTTP Security Response Headers Audit Ledger",
              "boxes": [
                {
                  "label": "1. HSTS Header",
                  "value": "max-age=31536000; includeSubDomains (Forces 1-year strict HTTPS)",
                  "varType": "HSTS",
                  "isUpdated": false
                },
                {
                  "label": "2. X-Content-Type-Options",
                  "value": "nosniff (Blocks malicious executable MIME sniffing)",
                  "varType": "nosniff",
                  "isUpdated": false
                },
                {
                  "label": "3. X-Frame-Options",
                  "value": "DENY (Completely blocks Clickjacking iframe embedding)",
                  "varType": "Frame Options",
                  "isUpdated": false
                },
                {
                  "label": "Audit Status",
                  "value": "SECURITY HEADERS COMPLIANT NOMINAL (BROWSER HARDENING VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "headers_audit_demo.js",
            "initialCode": "function auditHeaders(hdrs) {\n  const hasHsts = Boolean(hdrs['strict-transport-security'] && hdrs['strict-transport-security'].includes('max-age='));\n  const hasNosniff = hdrs['x-content-type-options'] === 'nosniff';\n  const hasFrameOptions = hdrs['x-frame-options'] === 'DENY' || hdrs['x-frame-options'] === 'SAMEORIGIN';\n  const isOk = hasHsts && hasNosniff && hasFrameOptions;\n  return {\n    isHeaderSuiteCompliant: isOk,\n    status: isOk ? 'SECURITY_HEADERS_COMPLIANT_NOMINAL' : 'INSECURE_HEADER_CONFIGURATION_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditHeaders({\n  'strict-transport-security': 'max-age=31536000; includeSubDomains',\n  'x-content-type-options': 'nosniff',\n  'x-frame-options': 'DENY'\n})));",
            "expectedOutput": "{\"isHeaderSuiteCompliant\":true,\"status\":\"SECURITY_HEADERS_COMPLIANT_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a web server has all core security response headers (HSTS, nosniff, frame options) compliant?",
          "expectedStringOutput": "SECURITY_HEADERS_COMPLIANT_NOMINAL",
          "acceptableAnswers": [
            "SECURITY_HEADERS_COMPLIANT_NOMINAL",
            "status\":\"SECURITY_HEADERS_COMPLIANT_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_SECURE_HEADERS_HSTS_CSP_FRAME_OPTIONS",
          "diagnosisMap": {
            "INSECURE": {
              "misconceptionId": "MC_CYBER_SECURE_HEADERS_HSTS_CSP_FRAME_OPTIONS",
              "errorExplanation": "Matches SECURITY_HEADERS_COMPLIANT_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SECURITY_HEADERS_COMPLIANT_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d14-b2-nosniff-header-value-name",
        "day": 14,
        "blockNumber": 2,
        "title": "The MIME Sniffing Prevention Header Value: `'nosniff'`",
        "conceptBudget": {
          "primaryConcept": "`nosniff` Value Invariant",
          "supportingTerms": [
            "`nosniff` (`The mandatory value for X-Content-Type-Options preventing browsers from executing user-uploaded images or text files as executable JavaScript`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d14-b1-security-headers-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MIME Sniffing Vulnerability",
            "codeSnippet": "/* ATTACK VECTOR: */\nAttacker uploads avatar.jpg containing: <script>stealCookies()</script>\nBrowser with MIME-sniffing enabled ignores Content-Type: image/jpeg, inspects file body, and EXECUTES it as JavaScript!\n\n/* DEFENSE: */\nX-Content-Type-Options: nosniff  (Forces browser to obey declared MIME type!)",
            "lineNotes": {
              "2": "MIME sniffing allows disguised scripts to execute.",
              "6": "'nosniff' forces strict MIME compliance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nosniff_demo.js",
            "initialCode": "function getNosniff() {\n  return 'nosniff';\n}\n\nconsole.log(getNosniff());",
            "expectedOutput": "nosniff",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What directive value in X-Content-Type-Options instructs browsers not to guess MIME content types?",
          "expectedStringOutput": "nosniff",
          "acceptableAnswers": [
            "nosniff",
            "'nosniff'",
            "no-sniff"
          ],
          "primaryMisconceptionId": "MC_CYBER_SECURE_HEADERS_HSTS_CSP_FRAME_OPTIONS",
          "diagnosisMap": {
            "DENY": {
              "misconceptionId": "MC_CYBER_SECURE_HEADERS_HSTS_CSP_FRAME_OPTIONS",
              "errorExplanation": "DENY is for X-Frame-Options. The value for X-Content-Type-Options is nosniff.",
              "recoveryPath": {
                "simplerExplanation": "Type nosniff.",
                "guidedFixPrompt": "Type nosniff"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d14-b3-hsts-preload-list-protection",
        "day": 14,
        "blockNumber": 3,
        "title": "SSL Stripping Defense: HSTS Preload List Prevents First-Connection Cleartext Downgrades",
        "conceptBudget": {
          "primaryConcept": "HSTS Preload Invariant",
          "supportingTerms": [
            "HSTS Preload (`Hardcoding domain names into major browser binaries guarantees that even the user's very first visit to the domain is made over HTTPS, defeating SSL stripping`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d14-b2-nosniff-header-value-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hsts_preload_demo.js",
            "initialCode": "function getHstsPreloadRule() {\n  return 'HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST';\n}\n\nconsole.log(getHstsPreloadRule());",
            "expectedOutput": "HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do high-security websites submit their domains to the global HSTS Preload list?",
          "expectedStringOutput": "HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST",
          "acceptableAnswers": [
            "HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST",
            "Eliminates SSL stripping on initial request",
            "Defeat SSL stripping"
          ],
          "primaryMisconceptionId": "MC_CYBER_SECURE_HEADERS_HSTS_CSP_FRAME_OPTIONS",
          "diagnosisMap": {
            "FASTER_DNS": {
              "misconceptionId": "MC_CYBER_SECURE_HEADERS_HSTS_CSP_FRAME_OPTIONS",
              "errorExplanation": "Standard is: HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST.",
              "recoveryPath": {
                "simplerExplanation": "Matches HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST.",
                "guidedFixPrompt": "Type HSTS_PRELOAD_ELIMINATES_SSL_STRIPPING_ON_THE_INITIAL_CLEARTEXT_HTTP_REQUEST"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate cryptographic security and identity access engine: 1. AES-GCM AEAD payload validation; 2. Argon2id memory-hard hashing; 3. X.509 PKI certificate chain of trust verification; 4. JWT 'none' attack sanitization; 5. TOTP MFA drift step calculation.",
    "blocks": [
      {
        "id": "cyber-d15-b1-crypto-identity-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Cryptographic Identity & PKI Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Cryptographic Identity & PKI Master Engine",
          "supportingTerms": [
            "AES-GCM Subsystem",
            "Argon2id Subsystem",
            "PKI Subsystem",
            "JWT Subsystem",
            "TOTP MFA Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d14-b3-hsts-preload-list-protection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Cryptographic Identity & PKI Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Validates 96-bit IVs and 128-bit AEAD tags in AES-256-GCM ciphertexts",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Enforces 64MB Argon2id memory-hard password key derivation",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Verifies X.509 PKI digital certificate chains back to root trust stores",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Sanitizes JWT algorithm 'none' exploits & computes TOTP MFA time-drift steps",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Activates Cryptographic Identity & PKI Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "crypto_kernel_demo.js",
            "initialCode": "function runCryptoIdentityEngine() {\n  return {\n    aesGcmSubsystem: 'ONLINE_AEAD_CIPHER_ACTIVE',\n    argon2idSubsystem: 'ONLINE_MEMORY_HARD_KDF_ACTIVE',\n    pkiSubsystem: 'ONLINE_X509_CHAIN_VALIDATOR_ACTIVE',\n    jwtSubsystem: 'ONLINE_JWT_ALGORITHM_GUARD_ACTIVE',\n    totpSubsystem: 'ONLINE_RFC6238_MFA_ACTIVE',\n    engineStatus: 'CRYPTO_IDENTITY_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runCryptoIdentityEngine().engineStatus);",
            "expectedOutput": "CRYPTO_IDENTITY_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Cryptographic Identity & PKI Master Engine?",
          "expectedStringOutput": "CRYPTO_IDENTITY_MASTER_ACTIVE",
          "acceptableAnswers": [
            "CRYPTO_IDENTITY_MASTER_ACTIVE",
            "engineStatus: CRYPTO_IDENTITY_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
              "errorExplanation": "Matches CRYPTO_IDENTITY_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CRYPTO_IDENTITY_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d15-b2-crypto-identity-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Cryptographic Identity Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Crypto Identity Invariant Verification",
          "supportingTerms": [
            "AEAD Invariant",
            "Argon2id Invariant",
            "PKI Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d15-b1-crypto-identity-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "crypto_audit_demo.js",
            "initialCode": "function auditCrypto(g, a, p, j, t) {\n  const passed = g && a && p && j && t;\n  return {\n    aesGcmVerified: g,\n    argon2idVerified: a,\n    pkiVerified: p,\n    jwtVerified: j,\n    totpVerified: t,\n    grade: passed ? 'CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCrypto(true, true, true, true, true)));",
            "expectedOutput": "{\"aesGcmVerified\":true,\"argon2idVerified\":true,\"pkiVerified\":true,\"jwtVerified\":true,\"totpVerified\":true,\"grade\":\"CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when AES-GCM, Argon2id, PKI, JWT, and TOTP pass 100%?",
          "expectedStringOutput": "CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED",
            "grade\":\"CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
              "errorExplanation": "All checks passing awards CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CRYPTO_IDENTITY_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d15-b3-milestone2-cyber-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Cryptographic Identity & PKI Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Crypto Identity Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d15-b2-crypto-identity-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_cyber_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_AES_GCM_AUTHENTICATED_ENCRYPTION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Server-Side Request Forgery (SSRF) & Cloud Metadata Protection",
    "overviewMetaphor": "SSRF Defense Is a Security Filter on a Company Delivery Courier: An external user asks your backend server 'Please fetch this profile image from URL $X$'; if the user provides `http://169.254.169.254/latest/meta-data/`, the naive server fetches its own secret AWS IAM keys; an SSRF filter strictly inspects the resolved IP address, instantly blocking private subnet and cloud metadata addresses (`SSRF_ATTACK_DETECTED_BLOCKED`).",
    "blocks": [
      {
        "id": "cyber-d16-b1-ssrf-url-filter",
        "day": 16,
        "blockNumber": 1,
        "title": "SSRF Defense: Blocking Cloud Metadata (`169.254.169.254`) & Private Subnets",
        "conceptBudget": {
          "primaryConcept": "SSRF Private IP & Cloud Metadata URL Filter",
          "supportingTerms": [
            "Target URL",
            "Cloud Metadata IP (`169.254.169.254`)",
            "Private IP Ranges (`10.*`, `192.168.*`, `127.0.0.1`)",
            "Status: SSRF URL Approved vs Blocked"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d15-b1-crypto-identity-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SSRF Subnet and Cloud Metadata Boundary Ledger",
              "boxes": [
                {
                  "label": "Cloud Metadata URL",
                  "value": "http://169.254.169.254/latest/meta-data/ -> BLOCKED (SSRF DETECTED!)",
                  "varType": "Metadata Threat",
                  "isUpdated": true
                },
                {
                  "label": "Public API URL",
                  "value": "https://api.github.com/users -> APPROVED (NOMINAL)",
                  "varType": "Public URL",
                  "isUpdated": false
                },
                {
                  "label": "Filter Decision",
                  "value": "Private IPs & 169.254.169.254 rejected (CLOUD IAM KEYS SECURED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ssrf_filter_demo.js",
            "initialCode": "function filterSsrf(urlStr) {\n  let parsed;\n  try { parsed = new URL(urlStr); } catch (e) { return { isAllowed: false, status: 'INVALID_URL' }; }\n  const host = parsed.hostname.toLowerCase();\n  const isPrivate =\n    host === 'localhost' ||\n    host === '127.0.0.1' ||\n    host === '169.254.169.254' ||\n    host.startsWith('10.') ||\n    host.startsWith('192.168.') ||\n    /^172\\.(1[6-9]|2[0-9]|3[0-1])\\./.test(host);\n  return {\n    targetUrl: urlStr,\n    isAllowed: !isPrivate,\n    status: !isPrivate ? 'SSRF_URL_APPROVED_NOMINAL' : 'SSRF_ATTACK_DETECTED_BLOCKED'\n  };\n}\n\nconsole.log(JSON.stringify(filterSsrf('http://169.254.169.254/latest/meta-data/')));\nconsole.log(JSON.stringify(filterSsrf('https://api.github.com/users')));",
            "expectedOutput": "{\"targetUrl\":\"http://169.254.169.254/latest/meta-data/\",\"isAllowed\":false,\"status\":\"SSRF_ATTACK_DETECTED_BLOCKED\"}\n{\"targetUrl\":\"https://api.github.com/users\",\"isAllowed\":true,\"status\":\"SSRF_URL_APPROVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an outbound request attempts to query the AWS metadata IP 169.254.169.254?",
          "expectedStringOutput": "SSRF_ATTACK_DETECTED_BLOCKED",
          "acceptableAnswers": [
            "SSRF_ATTACK_DETECTED_BLOCKED",
            "status\":\"SSRF_ATTACK_DETECTED_BLOCKED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
          "diagnosisMap": {
            "APPROVED": {
              "misconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
              "errorExplanation": "169.254.169.254 must be blocked to prevent credential theft: SSRF_ATTACK_DETECTED_BLOCKED.",
              "recoveryPath": {
                "simplerExplanation": "Matches SSRF_ATTACK_DETECTED_BLOCKED.",
                "guidedFixPrompt": "Type SSRF_ATTACK_DETECTED_BLOCKED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d16-b2-cloud-metadata-ip-address-name",
        "day": 16,
        "blockNumber": 2,
        "title": "The Standard Cloud Instance Metadata IP: `169.254.169.254`",
        "conceptBudget": {
          "primaryConcept": "169.254.169.254 Invariant",
          "supportingTerms": [
            "`169.254.169.254` (`The link-local IP address used by AWS EC2, GCP, and Azure to provide instance metadata, temporary IAM credentials, and configuration data`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d16-b1-ssrf-url-filter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AWS Instance Metadata Service (IMDS)",
            "codeSnippet": "/* 1. IMDSv1 (VULNERABLE TO SSRF): Direct GET request with no custom headers */\nGET http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role\n\n/* 2. IMDSv2 (PROTECTED): Requires initial PUT request with token header */\nPUT http://169.254.169.254/latest/api/token (Header: X-aws-ec2-metadata-token-ttl-seconds: 21600)",
            "lineNotes": {
              "2": "IMDSv1 exposes credentials via simple GET.",
              "5": "IMDSv2 mitigates SSRF by requiring session tokens."
            }
          },
          {
            "type": "runnable_code",
            "filename": "metadata_ip_demo.js",
            "initialCode": "function getMetadataIp() {\n  return '169.254.169.254';\n}\n\nconsole.log(getMetadataIp());",
            "expectedOutput": "169.254.169.254",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What link-local IP address provides cloud instance metadata on AWS EC2 and Azure VMs?",
          "expectedStringOutput": "169.254.169.254",
          "acceptableAnswers": [
            "169.254.169.254",
            "'169.254.169.254'"
          ],
          "primaryMisconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
          "diagnosisMap": {
            "127.0.0.1": {
              "misconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
              "errorExplanation": "127.0.0.1 is local loopback. The cloud link-local metadata IP is 169.254.169.254.",
              "recoveryPath": {
                "simplerExplanation": "Type 169.254.169.254.",
                "guidedFixPrompt": "Type 169.254.169.254"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d16-b3-dns-rebinding-defense-mechanics",
        "day": 16,
        "blockNumber": 3,
        "title": "DNS Rebinding Defense: Resolving Hostnames to IPs Prior to Validation and Connecting via Resolved IP",
        "conceptBudget": {
          "primaryConcept": "DNS Rebinding Defense Invariant",
          "supportingTerms": [
            "DNS Rebinding (`An attack where a malicious domain resolves to a public IP during validation, but returns 127.0.0.1 (TTL=0) when the HTTP request is actually executed`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d16-b2-cloud-metadata-ip-address-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dns_rebinding_demo.js",
            "initialCode": "function getDnsRebindingRule() {\n  return 'RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING';\n}\n\nconsole.log(getDnsRebindingRule());",
            "expectedOutput": "RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do robust network clients prevent Time-of-Check to Time-of-Use (TOCTOU) DNS Rebinding attacks?",
          "expectedStringOutput": "RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING",
          "acceptableAnswers": [
            "RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING",
            "Resolve IP upfront and connect directly to verified IP",
            "Connect to verified IP"
          ],
          "primaryMisconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
          "diagnosisMap": {
            "VALIDATE_HOSTNAME_ONLY": {
              "misconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
              "errorExplanation": "Standard is: RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING.",
              "recoveryPath": {
                "simplerExplanation": "Matches RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING.",
                "guidedFixPrompt": "Type RESOLVE_IP_UPFRONT_AND_CONNECT_DIRECTLY_TO_THE_VERIFIED_IP_ADDRESS_TO_DEFEAT_DNS_REBINDING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Insecure Deserialization & Remote Code Execution (RCE)",
    "overviewMetaphor": "Insecure Deserialization Is Accepting a Trojan Horse Without Unpacking It: A binary serializer (Java `readObject`, Python `pickle`) doesn't just read data variables; it reconstructs executable object classes and invokes magic methods (`__reduce__`, `readObject`); an attacker crafts a malicious gadget chain that executes system commands (`exec('rm -rf /')`) the second the object is unpacked (`INSECURE_DESERIALIZATION_PAYLOAD_DETECTED`).",
    "blocks": [
      {
        "id": "cyber-d17-b1-deserialization-detector",
        "day": 17,
        "blockNumber": 1,
        "title": "Insecure Deserialization: Detecting Dangerous Magic Byte Streams (Java `aced0005`, Python Pickle)",
        "conceptBudget": {
          "primaryConcept": "Insecure Serialization Payload Detector",
          "supportingTerms": [
            "Java Magic Bytes (`0xACED0005` / `rO0AB`)",
            "Python Pickle (`cos\\nsystem`)",
            "Safe JSON Payload",
            "Status: Insecure Deserialization Detected vs Safe"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d16-b1-ssrf-url-filter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Binary Deserialization Threat Inspection Ledger",
              "boxes": [
                {
                  "label": "1. Java Serialized Object",
                  "value": "'rO0AB...' (Magic bytes aced0005: DANGEROUS GADGET CHAIN!)",
                  "varType": "Java Stream",
                  "isUpdated": true
                },
                {
                  "label": "2. Safe JSON Payload",
                  "value": "'{\"user\":\"alice\",\"id\":123}' (Pure text schema: SAFE NOMINAL)",
                  "varType": "JSON",
                  "isUpdated": false
                },
                {
                  "label": "Detection Status",
                  "value": "INSECURE DESERIALIZATION PAYLOAD DETECTED (RCE EXPLOIT BLOCKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "deserialization_demo.js",
            "initialCode": "function detectSerialization(payload) {\n  const hasJava = payload.startsWith('rO0AB') || payload.startsWith('aced0005');\n  const hasPickle = payload.includes('cos\\nsystem') || payload.includes('cposix\\nsystem');\n  const isDangerous = hasJava || hasPickle;\n  return {\n    isDangerousObjectSerialization: isDangerous,\n    status: isDangerous ? 'INSECURE_DESERIALIZATION_PAYLOAD_DETECTED' : 'PAYLOAD_FORMAT_SAFE_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(detectSerialization('rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAU=')));\nconsole.log(JSON.stringify(detectSerialization('{\"user\":\"alice\",\"id\":123}')));",
            "expectedOutput": "{\"isDangerousObjectSerialization\":true,\"status\":\"INSECURE_DESERIALIZATION_PAYLOAD_DETECTED\"}\n{\"isDangerousObjectSerialization\":false,\"status\":\"PAYLOAD_FORMAT_SAFE_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an incoming request body starts with Java serialization magic header 'rO0AB'?",
          "expectedStringOutput": "INSECURE_DESERIALIZATION_PAYLOAD_DETECTED",
          "acceptableAnswers": [
            "INSECURE_DESERIALIZATION_PAYLOAD_DETECTED",
            "status\":\"INSECURE_DESERIALIZATION_PAYLOAD_DETECTED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_INSECURE_DESERIALIZATION_RCE",
          "diagnosisMap": {
            "SAFE": {
              "misconceptionId": "MC_CYBER_INSECURE_DESERIALIZATION_RCE",
              "errorExplanation": "Java native serialization is dangerous: INSECURE_DESERIALIZATION_PAYLOAD_DETECTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches INSECURE_DESERIALIZATION_PAYLOAD_DETECTED.",
                "guidedFixPrompt": "Type INSECURE_DESERIALIZATION_PAYLOAD_DETECTED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d17-b2-java-magic-bytes-hex-name",
        "day": 17,
        "blockNumber": 2,
        "title": "The Java Serialization Magic Hex Header: `aced0005`",
        "conceptBudget": {
          "primaryConcept": "Java `aced0005` Magic Header Invariant",
          "supportingTerms": [
            "`aced0005` (`The 4-byte magic stream header 0xACED 0x0005 present at the start of all Java ObjectOutputStream binary files`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d17-b1-deserialization-detector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Java Magic Stream Header",
            "codeSnippet": "// Hex representation of Java ObjectInputStream serialization header:\n// 0xAC 0xED (STREAM_MAGIC)\n// 0x00 0x05 (STREAM_VERSION)\n// Combined Hex: aced0005\n// Base64 equivalent: rO0AB",
            "lineNotes": {
              "4": "aced0005 is the magic hex signature.",
              "5": "rO0AB is the Base64 representation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "magic_hex_demo.js",
            "initialCode": "function getMagicHex() {\n  return 'aced0005';\n}\n\nconsole.log(getMagicHex());",
            "expectedOutput": "aced0005",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 8-character hexadecimal string identifies the start of a serialized Java object stream?",
          "expectedStringOutput": "aced0005",
          "acceptableAnswers": [
            "aced0005",
            "'aced0005'",
            "0xaced0005",
            "ACED0005"
          ],
          "primaryMisconceptionId": "MC_CYBER_INSECURE_DESERIALIZATION_RCE",
          "diagnosisMap": {
            "deadbeef": {
              "misconceptionId": "MC_CYBER_INSECURE_DESERIALIZATION_RCE",
              "errorExplanation": "deadbeef is a debug canary. Java serialization magic is aced0005.",
              "recoveryPath": {
                "simplerExplanation": "Type aced0005.",
                "guidedFixPrompt": "Type aced0005"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d17-b3-json-and-protobuf-safe-alternatives",
        "day": 17,
        "blockNumber": 3,
        "title": "Architecture Remediation: Replacing Object Serialization with Schema-Enforced JSON or Protocol Buffers",
        "conceptBudget": {
          "primaryConcept": "Pure Data Serialization Invariant",
          "supportingTerms": [
            "Pure Data Formats (`JSON and Protobuf transmit pure attribute data without transmitting executable bytecode or invoking dynamic class constructors`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d17-b2-java-magic-bytes-hex-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "safe_serialization_demo.js",
            "initialCode": "function getSafeSerializationRule() {\n  return 'REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE';\n}\n\nconsole.log(getSafeSerializationRule());",
            "expectedOutput": "REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architectural change completely eliminates Remote Code Execution (RCE) via deserialization?",
          "expectedStringOutput": "REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE",
          "acceptableAnswers": [
            "REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE",
            "Use JSON or Protobuf instead of object serialization",
            "Data-only formats like JSON"
          ],
          "primaryMisconceptionId": "MC_CYBER_INSECURE_DESERIALIZATION_RCE",
          "diagnosisMap": {
            "BLACKLIST_CLASSES": {
              "misconceptionId": "MC_CYBER_INSECURE_DESERIALIZATION_RCE",
              "errorExplanation": "Blacklisting classes is easily bypassed. Standard is: REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE.",
                "guidedFixPrompt": "Type REPLACE_OBJECT_DESERIALIZATION_WITH_DATA_ONLY_FORMATS_LIKE_JSON_OR_PROTOBUF_TO_ELIMINATE_RCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Security Misconfiguration & Hardcoded Secrets Auditing: Shannon Entropy",
    "overviewMetaphor": "Shannon Entropy Is a Secret Radio Frequency Detector: Standard English sentences have predictable repeating letters (Low Entropy $H \\approx 2.0$); a random 40-character AWS secret key looks like pure chaotic static ($H \\ge 4.5$), allowing automated secret scanners to flag hardcoded API tokens before code is pushed to public GitHub (`HIGH_ENTROPY_SECRET_DETECTED`).",
    "blocks": [
      {
        "id": "cyber-d18-b1-shannon-entropy-scanner",
        "day": 18,
        "blockNumber": 1,
        "title": "Secrets Auditing: Calculating Shannon Entropy ($H = -\\sum p \\log_2 p$) to Detect API Keys ($H \\ge 4.5$)",
        "conceptBudget": {
          "primaryConcept": "Shannon Entropy String Scanner & API Key Detector",
          "supportingTerms": [
            "High Entropy Secret ($H \\ge 4.5$)",
            "Zero Entropy String ($H = 0.0$ for `'aaaaaaaa'`)",
            "Character Distribution ($p_i$)",
            "Status: High Entropy Secret Detected Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d17-b1-deserialization-detector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Shannon Information Entropy Secret Detection Ledger",
              "boxes": [
                {
                  "label": "1. Repetitive String ('aaaa')",
                  "value": "p = 1.0 -> H = -1.0 * log2(1.0) = 0.0 (Zero randomness, low risk)",
                  "varType": "Low Entropy",
                  "isUpdated": false
                },
                {
                  "label": "2. Random Secret Key",
                  "value": "wJalrXUtnFEMI... -> H >= 4.5 (High information randomness: SECRET KEY FLAGGED!)",
                  "varType": "High Entropy",
                  "isUpdated": true
                },
                {
                  "label": "Scanner Status",
                  "value": "HIGH ENTROPY SECRET DETECTED (PRE-COMMIT HOOK ENGAGED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "entropy_demo.js",
            "initialCode": "function calcEntropy(str) {\n  if (!str) return { entropy: 0, isHighEntropySecret: false };\n  const freqs = {};\n  for (const c of str) freqs[c] = (freqs[c] || 0) + 1;\n  let h = 0;\n  const len = str.length;\n  for (const cnt of Object.values(freqs)) {\n    const p = cnt / len;\n    h -= p * Math.log2(p);\n  }\n  const rH = Number(h.toFixed(4));\n  const isSec = rH >= 4.5;\n  return {\n    entropy: rH,\n    isHighEntropySecret: isSec,\n    status: isSec ? 'HIGH_ENTROPY_SECRET_DETECTED' : 'STANDARD_LOW_ENTROPY_STRING'\n  };\n}\n\nconsole.log(JSON.stringify(calcEntropy('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY')));\nconsole.log(JSON.stringify(calcEntropy('aaaaaaaaaaaaaaaa')));",
            "expectedOutput": "{\"entropy\":4.7819,\"isHighEntropySecret\":true,\"status\":\"HIGH_ENTROPY_SECRET_DETECTED\"}\n{\"entropy\":0,\"isHighEntropySecret\":false,\"status\":\"STANDARD_LOW_ENTROPY_STRING\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Shannon entropy score for a string of repeating identical characters ('aaaaaaaaaaaaaaaa')?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "0.0",
            "entropy\":0",
            "zero"
          ],
          "primaryMisconceptionId": "MC_CYBER_HARDCODED_SECRETS_ENTROPY_SCANNING",
          "diagnosisMap": {
            "4.5": {
              "misconceptionId": "MC_CYBER_HARDCODED_SECRETS_ENTROPY_SCANNING",
              "errorExplanation": "Identical characters carry 0 information bits: -1.0 * log2(1.0) = 0.0.",
              "recoveryPath": {
                "simplerExplanation": "Entropy is 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d18-b2-aws-access-key-prefix-name",
        "day": 18,
        "blockNumber": 2,
        "title": "The AWS Access Key Standard Prefix: `AKIA`",
        "conceptBudget": {
          "primaryConcept": "AWS 'AKIA' Prefix Invariant",
          "supportingTerms": [
            "`AKIA` (`The 4-character identifier prefix denoting permanent AWS IAM User Access Keys: AKIA[0-9A-Z]{16}`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d18-b1-shannon-entropy-scanner",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Common Secret Signatures",
            "codeSnippet": "/* 1. AWS IAM Access Key: AKIA[0-9A-Z]{16} */\n/* 2. GitHub Personal Access Token: ghp_[a-zA-Z0-9]{36} */\n/* 3. Slack Bot Token: xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24} */\n/* 4. Private SSH Key: -----BEGIN OPENSSH PRIVATE KEY----- */",
            "lineNotes": {
              "1": "AKIA identifies AWS permanent access keys."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aws_prefix_demo.js",
            "initialCode": "function getAwsPrefix() {\n  return 'AKIA';\n}\n\nconsole.log(getAwsPrefix());",
            "expectedOutput": "AKIA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 4-letter prefix identifies an AWS IAM user access key in secret scanner regex rules?",
          "expectedStringOutput": "AKIA",
          "acceptableAnswers": [
            "AKIA",
            "'AKIA'",
            "akia"
          ],
          "primaryMisconceptionId": "MC_CYBER_HARDCODED_SECRETS_ENTROPY_SCANNING",
          "diagnosisMap": {
            "AWS_": {
              "misconceptionId": "MC_CYBER_HARDCODED_SECRETS_ENTROPY_SCANNING",
              "errorExplanation": "AWS IAM access keys strictly begin with the four letters AKIA.",
              "recoveryPath": {
                "simplerExplanation": "Type AKIA.",
                "guidedFixPrompt": "Type AKIA"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d18-b3-secrets-manager-environment-variables",
        "day": 18,
        "blockNumber": 3,
        "title": "Secrets Hygiene: Externalizing Credentials to AWS Secrets Manager / Vault",
        "conceptBudget": {
          "primaryConcept": "External Secrets Invariant",
          "supportingTerms": [
            "External Secrets (`Storing credentials in AWS Secrets Manager or HashiCorp Vault with dynamic rotation eliminates credentials from git repositories completely`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d18-b2-aws-access-key-prefix-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "secrets_mgmt_demo.js",
            "initialCode": "function getSecretsMgmtRule() {\n  return 'NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES';\n}\n\nconsole.log(getSecretsMgmtRule());",
            "expectedOutput": "NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architectural pattern prevents API keys from ever existing in source code repositories?",
          "expectedStringOutput": "NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES",
          "acceptableAnswers": [
            "NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES",
            "Use Vault or Secrets Manager",
            "Externalize to Secrets Manager"
          ],
          "primaryMisconceptionId": "MC_CYBER_HARDCODED_SECRETS_ENTROPY_SCANNING",
          "diagnosisMap": {
            "GIT_IGNORE_IS_ENOUGH": {
              "misconceptionId": "MC_CYBER_HARDCODED_SECRETS_ENTROPY_SCANNING",
              "errorExplanation": "Standard is: NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES.",
                "guidedFixPrompt": "Type NEVER_COMMIT_SECRETS_TO_SOURCE_CONTROL_USE_VAULT_OR_SECRETS_MANAGER_WITH_IAM_ROLES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Dependency Vulnerabilities: Software Bill of Materials (SBOM) & CVE Auditing",
    "overviewMetaphor": "An SBOM Is an Ingredient Label on a Food Package: Just as a food recall notices contaminated peanut flour in batch 4.17.15, an SBOM (Software Bill of Materials) lists every open-source library and transitive dependency; an automated vulnerability audit checks the CVE database to flag vulnerable packages (`CVE-2020-8203`) before software is shipped (`KNOWN_CVE_VULNERABILITIES_DETECTED`).",
    "blocks": [
      {
        "id": "cyber-d19-b1-sbom-cve-matcher",
        "day": 19,
        "blockNumber": 1,
        "title": "Supply Chain Security: Matching Dependencies Against Known CVE Databases",
        "conceptBudget": {
          "primaryConcept": "Software Bill of Materials (SBOM) Dependency CVE Matcher",
          "supportingTerms": [
            "Dependencies List (`lodash@4.17.15`)",
            "CVE Database (`CVE-2020-8203`)",
            "Vulnerability Severity (`HIGH`)",
            "Status: Known CVE Detected Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d18-b1-shannon-entropy-scanner",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SBOM Dependency CVE Matching Ledger",
              "boxes": [
                {
                  "label": "1. Scanned Package",
                  "value": "lodash @ 4.17.15 (Included in package-lock.json / SBOM)",
                  "varType": "Dependency",
                  "isUpdated": false
                },
                {
                  "label": "2. Matched CVE Record",
                  "value": "CVE-2020-8203 (Prototype Pollution - Severity: HIGH)",
                  "varType": "CVE Match",
                  "isUpdated": true
                },
                {
                  "label": "Audit Status",
                  "value": "KNOWN CVE VULNERABILITIES DETECTED (PIPELINE BUILD BLOCKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sbom_matcher_demo.js",
            "initialCode": "function matchSbom(deps, cveDb) {\n  const flagged = [];\n  for (const dep of deps) {\n    const cve = cveDb.find(c => c.packageName === dep.name && c.vulnerableVersion === dep.version);\n    if (cve) {\n      flagged.push({ package: dep.name, cveId: cve.id });\n    }\n  }\n  return {\n    vulnerableDependenciesCount: flagged.length,\n    vulnerabilities: flagged,\n    status: flagged.length > 0 ? 'KNOWN_CVE_VULNERABILITIES_DETECTED' : 'SBOM_CLEAN_NO_KNOWN_CVE'\n  };\n}\n\nconst deps = [{ name: 'lodash', version: '4.17.15' }, { name: 'express', version: '4.18.2' }];\nconst cveDb = [{ packageName: 'lodash', vulnerableVersion: '4.17.15', id: 'CVE-2020-8203' }];\nconsole.log(JSON.stringify(matchSbom(deps, cveDb)));",
            "expectedOutput": "{\"vulnerableDependenciesCount\":1,\"vulnerabilities\":[{\"package\":\"lodash\",\"cveId\":\"CVE-2020-8203\"}],\"status\":\"KNOWN_CVE_VULNERABILITIES_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CVE ID is flagged when lodash version 4.17.15 is scanned against the database?",
          "expectedStringOutput": "CVE-2020-8203",
          "acceptableAnswers": [
            "CVE-2020-8203",
            "cveId\":\"CVE-2020-8203\""
          ],
          "primaryMisconceptionId": "MC_CYBER_DEPENDENCY_CVE_SBOM_VULNERABILITY",
          "diagnosisMap": {
            "CLEAN": {
              "misconceptionId": "MC_CYBER_DEPENDENCY_CVE_SBOM_VULNERABILITY",
              "errorExplanation": "4.17.15 contains prototype pollution: CVE-2020-8203.",
              "recoveryPath": {
                "simplerExplanation": "CVE is CVE-2020-8203.",
                "guidedFixPrompt": "Type CVE-2020-8203"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d19-b2-sbom-acronym-name",
        "day": 19,
        "blockNumber": 2,
        "title": "The Software Bill of Materials Acronym: `SBOM`",
        "conceptBudget": {
          "primaryConcept": "SBOM Acronym Invariant",
          "supportingTerms": [
            "`SBOM` (`Software Bill of Materials: A formal, machine-readable inventory of software components, libraries, and transitive dependencies`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d19-b1-sbom-cve-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SBOM Industry Standards",
            "codeSnippet": "/* 1. CycloneDX (OWASP standard for application security & supply chain) */\n/* 2. SPDX (ISO/IEC 5962 international standard for open source licensing) */",
            "lineNotes": {
              "1": "CycloneDX and SPDX are the two dominant SBOM formats."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sbom_name_demo.js",
            "initialCode": "function getSbom() {\n  return 'SBOM';\n}\n\nconsole.log(getSbom());",
            "expectedOutput": "SBOM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the Software Bill of Materials inventory standard?",
          "expectedStringOutput": "SBOM",
          "acceptableAnswers": [
            "SBOM",
            "'SBOM'",
            "sbom"
          ],
          "primaryMisconceptionId": "MC_CYBER_DEPENDENCY_CVE_SBOM_VULNERABILITY",
          "diagnosisMap": {
            "CVE": {
              "misconceptionId": "MC_CYBER_DEPENDENCY_CVE_SBOM_VULNERABILITY",
              "errorExplanation": "CVE is the vulnerability database. The software inventory list is an SBOM.",
              "recoveryPath": {
                "simplerExplanation": "Type SBOM.",
                "guidedFixPrompt": "Type SBOM"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d19-b3-dependency-confusion-attack-vector",
        "day": 19,
        "blockNumber": 3,
        "title": "Supply Chain Attacks: Dependency Confusion and Namespace Hijacking in Package Registries",
        "conceptBudget": {
          "primaryConcept": "Dependency Confusion Invariant",
          "supportingTerms": [
            "Dependency Confusion (`Publishing a malicious public package with the identical name and higher version number as an internal private enterprise package`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d19-b2-sbom-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dep_confusion_demo.js",
            "initialCode": "function getDepConfusionRule() {\n  return 'USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION';\n}\n\nconsole.log(getDepConfusionRule());",
            "expectedOutput": "USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do engineering organizations defend against Dependency Confusion supply chain attacks?",
          "expectedStringOutput": "USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION",
          "acceptableAnswers": [
            "USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION",
            "Scoped packages and private registry priority",
            "Scoped package namespaces"
          ],
          "primaryMisconceptionId": "MC_CYBER_DEPENDENCY_CVE_SBOM_VULNERABILITY",
          "diagnosisMap": {
            "NO_DEFENSE": {
              "misconceptionId": "MC_CYBER_DEPENDENCY_CVE_SBOM_VULNERABILITY",
              "errorExplanation": "Standard is: USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION.",
                "guidedFixPrompt": "Type USE_SCOPED_PACKAGES_AND_PRIVATE_REGISTRY_PRIORITY_TO_PREVENT_DEPENDENCY_CONFUSION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "API Security: Token Bucket Rate Limiting & OAuth 2.0 PKCE Flow",
    "overviewMetaphor": "The Token Bucket Rate Limiter Is an Amusement Park Ticket Dispenser: The dispenser holds up to 10 tokens and dispenses 1 token every second; a customer with 5 tokens after waiting 2 seconds ($5 + 2 = 7$) spends 1 token to ride the coaster ($6$ remaining); if an automated bot spams 100 requests in 0 seconds ($0 < 1$), the turnstile locks and returns `HTTP 429 Too Many Requests` (`RATE_LIMIT_EXCEEDED_HTTP_429`).",
    "blocks": [
      {
        "id": "cyber-d20-b1-token-bucket-limiter",
        "day": 20,
        "blockNumber": 1,
        "title": "API Security: Processing Token Bucket Refill & Deductions ($7 - 1 = 6$ Remaining vs HTTP 429)",
        "conceptBudget": {
          "primaryConcept": "Token Bucket Rate Limiter Step Calculator",
          "supportingTerms": [
            "Current Tokens ($5$)",
            "Max Capacity ($10$)",
            "Refill Rate ($1\\text{/sec}$)",
            "Elapsed Time ($2\\text{s}$)",
            "Cost ($1$)",
            "Status: API Request Allowed vs HTTP 429"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d19-b1-sbom-cve-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Token Bucket Rate Limiter Dynamic State Ledger",
              "boxes": [
                {
                  "label": "Pass Request (5 + 2s refill)",
                  "value": "5 + (1*2) = 7 tokens >= 1 cost -> 6 remaining (REQUEST ALLOWED!)",
                  "varType": "Allowed",
                  "isUpdated": true
                },
                {
                  "label": "Exceeded Request (0 tokens)",
                  "value": "0 + (1*0) = 0 tokens < 1 cost -> 0 remaining (HTTP 429 RETURNED)",
                  "varType": "Rate Limited",
                  "isUpdated": false
                },
                {
                  "label": "Rate Limiter Status",
                  "value": "TOKEN BUCKET RATE LIMITER NOMINAL (CREDENTIAL STUFFING BLOCKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "token_bucket_demo.js",
            "initialCode": "function processBucket(curr, maxCap, refillRate, elapsed, cost) {\n  const refilled = Math.min(maxCap, curr + (refillRate * elapsed));\n  const isOk = refilled >= cost;\n  const remaining = isOk ? refilled - cost : refilled;\n  return {\n    tokensRemaining: Number(remaining.toFixed(2)),\n    isRequestAllowed: isOk,\n    status: isOk ? 'API_REQUEST_ALLOWED_NOMINAL' : 'RATE_LIMIT_EXCEEDED_HTTP_429'\n  };\n}\n\nconsole.log(JSON.stringify(processBucket(5, 10, 1, 2, 1)));\nconsole.log(JSON.stringify(processBucket(0, 10, 1, 0, 1)));",
            "expectedOutput": "{\"tokensRemaining\":6,\"isRequestAllowed\":true,\"status\":\"API_REQUEST_ALLOWED_NOMINAL\"}\n{\"tokensRemaining\":0,\"isRequestAllowed\":false,\"status\":\"RATE_LIMIT_EXCEEDED_HTTP_429\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many tokens remain in a bucket with capacity 10 and 5 tokens after 2 seconds elapsed and 1 token deducted?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "tokensRemaining\":6",
            "6 tokens"
          ],
          "primaryMisconceptionId": "MC_CYBER_API_RATE_LIMITING_TOKEN_BUCKET",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_CYBER_API_RATE_LIMITING_TOKEN_BUCKET",
              "errorExplanation": "5 + 2s refill = 7. 7 - 1 = 6 remaining.",
              "recoveryPath": {
                "simplerExplanation": "Remaining is 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d20-b2-rate-limit-http-status-code-number",
        "day": 20,
        "blockNumber": 2,
        "title": "The Standard HTTP Status Code for Rate Limiting: 429",
        "conceptBudget": {
          "primaryConcept": "HTTP 429 Status Code Invariant",
          "supportingTerms": [
            "429 (`HTTP 429 Too Many Requests: The official RFC 6585 status code indicating the user has sent too many requests in a given amount of time`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d20-b1-token-bucket-limiter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HTTP 429 Response Headers",
            "codeSnippet": "/* HTTP 429 RESPONSE: */\nHTTP/1.1 429 Too Many Requests\nRetry-After: 30\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1600000030",
            "lineNotes": {
              "2": "429 is the Rate Limit status code.",
              "3": "Retry-After specifies seconds to wait."
            }
          },
          {
            "type": "runnable_code",
            "filename": "http_429_demo.js",
            "initialCode": "function get429() {\n  return 429;\n}\n\nconsole.log(get429());",
            "expectedOutput": "429",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code is returned when an API client exceeds their rate limit threshold?",
          "expectedStringOutput": "429",
          "acceptableAnswers": [
            "429",
            "HTTP 429",
            "four-twenty-nine"
          ],
          "primaryMisconceptionId": "MC_CYBER_API_RATE_LIMITING_TOKEN_BUCKET",
          "diagnosisMap": {
            "403": {
              "misconceptionId": "MC_CYBER_API_RATE_LIMITING_TOKEN_BUCKET",
              "errorExplanation": "403 is Forbidden (authorization). Rate limiting uses 429 Too Many Requests.",
              "recoveryPath": {
                "simplerExplanation": "Type 429.",
                "guidedFixPrompt": "Type 429"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d20-b3-oauth-pkce-code-challenge-verification",
        "day": 20,
        "blockNumber": 3,
        "title": "OAuth 2.0 PKCE: Protecting Single-Page Apps with Code Verifiers and SHA-256 Challenges",
        "conceptBudget": {
          "primaryConcept": "OAuth PKCE Invariant",
          "supportingTerms": [
            "`PKCE` (`Proof Key for Code Exchange RFC 7636: Protects public clients (React/Mobile) from authorization code interception by verifying a SHA-256 code challenge`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d20-b2-rate-limit-http-status-code-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pkce_demo.js",
            "initialCode": "function getPkceRule() {\n  return 'PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS';\n}\n\nconsole.log(getPkceRule());",
            "expectedOutput": "PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is the OAuth 2.0 PKCE flow mandatory for single-page React and mobile applications?",
          "expectedStringOutput": "PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS",
          "acceptableAnswers": [
            "PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS",
            "Protects public clients from authorization code interception",
            "Mitigate auth code interception"
          ],
          "primaryMisconceptionId": "MC_CYBER_API_RATE_LIMITING_TOKEN_BUCKET",
          "diagnosisMap": {
            "NO_BENEFIT": {
              "misconceptionId": "MC_CYBER_API_RATE_LIMITING_TOKEN_BUCKET",
              "errorExplanation": "Standard is: PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS.",
                "guidedFixPrompt": "Type PKCE_PROTECTS_PUBLIC_SPA_CLIENTS_FROM_AUTHORIZATION_CODE_INTERCEPTION_ATTACKS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete advanced network and application runtime defense engine: 1. SSRF cloud metadata filtering; 2. Insecure deserialization header scanning; 3. Shannon entropy API key discovery; 4. SBOM CVE matching; 5. Token Bucket API rate limiting.",
    "blocks": [
      {
        "id": "cyber-d21-b1-runtime-defense-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Application Runtime Defense Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Application Runtime Defense Master Engine",
          "supportingTerms": [
            "SSRF Defense Subsystem",
            "Deserialization Subsystem",
            "Entropy Auditing Subsystem",
            "SBOM Vulnerability Subsystem",
            "Token Bucket Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d20-b3-oauth-pkce-code-challenge-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Runtime Application Defense Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Filters outbound SSRF metadata requests targeting 169.254.169.254",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Inspects inbound serialization magic bytes (Java aced0005) to block RCE",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Scans codebase with Shannon entropy to flag exposed AWS AKIA keys",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Matches dependencies against CVE databases & limits API requests with Token Bucket",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Activates Application Runtime Defense Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "runtime_defense_kernel_demo.js",
            "initialCode": "function runRuntimeDefense() {\n  return {\n    ssrfSubsystem: 'ONLINE_METADATA_FILTER_ACTIVE',\n    deserializationSubsystem: 'ONLINE_MAGIC_BYTE_GUARD_ACTIVE',\n    entropySubsystem: 'ONLINE_SHANNON_SECRET_SCANNER_ACTIVE',\n    sbomSubsystem: 'ONLINE_CVE_DATABASE_MATCHER_ACTIVE',\n    rateLimiterSubsystem: 'ONLINE_TOKEN_BUCKET_ACTIVE',\n    engineStatus: 'RUNTIME_DEFENSE_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runRuntimeDefense().engineStatus);",
            "expectedOutput": "RUNTIME_DEFENSE_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Application Runtime Defense Master Engine?",
          "expectedStringOutput": "RUNTIME_DEFENSE_MASTER_ACTIVE",
          "acceptableAnswers": [
            "RUNTIME_DEFENSE_MASTER_ACTIVE",
            "engineStatus: RUNTIME_DEFENSE_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
              "errorExplanation": "Matches RUNTIME_DEFENSE_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type RUNTIME_DEFENSE_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d21-b2-runtime-defense-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Runtime Defense Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Runtime Defense Invariant Verification",
          "supportingTerms": [
            "SSRF Invariant",
            "Entropy Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d21-b1-runtime-defense-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "runtime_audit_demo.js",
            "initialCode": "function auditRuntime(s, d, e, b, r) {\n  const passed = s && d && e && b && r;\n  return {\n    ssrfVerified: s,\n    deserializationVerified: d,\n    entropyVerified: e,\n    sbomVerified: b,\n    rateLimiterVerified: r,\n    grade: passed ? 'RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditRuntime(true, true, true, true, true)));",
            "expectedOutput": "{\"ssrfVerified\":true,\"deserializationVerified\":true,\"entropyVerified\":true,\"sbomVerified\":true,\"rateLimiterVerified\":true,\"grade\":\"RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when SSRF, Deserialization, Entropy, SBOM, and Rate Limiting pass 100%?",
          "expectedStringOutput": "RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED",
            "grade\":\"RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
              "errorExplanation": "All checks passing awards RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type RUNTIME_DEFENSE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d21-b3-milestone3-cyber-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Application Runtime Defense Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Runtime Defense Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d21-b2-runtime-defense-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_cyber_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_SSRF_CLOUD_METADATA_EXPLOITATION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Binary Exploitation: Buffer Overflows, Stack Canaries & ASLR",
    "overviewMetaphor": "A Stack Canary Is a Miner's Canary in a Coal Mine: In C/C++, writing 128 bytes into a 64-byte buffer smashes the stack and overwrites the function's return pointer (EIP) with attacker shellcode; the compiler places a secret random Canary cookie (`0xDEADBEEF`) right before the return address; before returning, the CPU checks if the canary is alive; if the canary is crushed (`0x41414141`), the OS terminates the process instantly (`STACK_SMASHING_DETECTED_TERMINATING_PROCESS`).",
    "blocks": [
      {
        "id": "cyber-d22-b1-stack-overflow-detector",
        "day": 22,
        "blockNumber": 1,
        "title": "Binary Defense: Detecting Buffer Overflows ($128 > 64$) & Stack Canary Corruption",
        "conceptBudget": {
          "primaryConcept": "Stack Canary Corruption & Buffer Overflow Detector",
          "supportingTerms": [
            "Allocated Buffer ($64\\text{ bytes}$)",
            "Incoming Payload ($128\\text{ bytes}$)",
            "Original Canary (`0xDEADBEEF`)",
            "Memory Canary (`0x41414141`)",
            "Status: Stack Smashing Detected Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d21-b1-runtime-defense-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "C Call Stack Canary Integrity Ledger",
              "boxes": [
                {
                  "label": "1. Local Buffer (64 bytes)",
                  "value": "Filled with 128 bytes of 'A' (0x41) (OVERFLOW DETECTED!)",
                  "varType": "Buffer",
                  "isUpdated": false
                },
                {
                  "label": "2. Stack Canary Slot",
                  "value": "Original: 0xDEADBEEF -> Overwritten with: 0x41414141 (CANARY KILLED!)",
                  "varType": "Canary",
                  "isUpdated": true
                },
                {
                  "label": "Execution Defense",
                  "value": "STACK SMASHING DETECTED TERMINATING PROCESS (CONTROL FLOW HIJACK BLOCKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "stack_overflow_demo.js",
            "initialCode": "function detectOverflow(bufSize, payloadSize, origCanary, memCanary) {\n  const isOverflow = payloadSize > bufSize;\n  const isCanaryDead = origCanary !== memCanary;\n  const isSmashing = isOverflow || isCanaryDead;\n  return {\n    isCanaryIntact: !isCanaryDead,\n    isExploitDetected: isSmashing,\n    status: isSmashing ? 'STACK_SMASHING_DETECTED_TERMINATING_PROCESS' : 'STACK_INTEGRITY_VERIFIED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(detectOverflow(64, 128, '0xDEADBEEF', '0x41414141')));\nconsole.log(JSON.stringify(detectOverflow(64, 32, '0xDEADBEEF', '0xDEADBEEF')));",
            "expectedOutput": "{\"isCanaryIntact\":false,\"isExploitDetected\":true,\"status\":\"STACK_SMASHING_DETECTED_TERMINATING_PROCESS\"}\n{\"isCanaryIntact\":true,\"isExploitDetected\":false,\"status\":\"STACK_INTEGRITY_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is triggered when a buffer overflow overwrites the stack canary cookie with 0x41414141?",
          "expectedStringOutput": "STACK_SMASHING_DETECTED_TERMINATING_PROCESS",
          "acceptableAnswers": [
            "STACK_SMASHING_DETECTED_TERMINATING_PROCESS",
            "status\":\"STACK_SMASHING_DETECTED_TERMINATING_PROCESS\""
          ],
          "primaryMisconceptionId": "MC_CYBER_BUFFER_OVERFLOW_CANARY_ASLR",
          "diagnosisMap": {
            "INTEGRITY_VERIFIED": {
              "misconceptionId": "MC_CYBER_BUFFER_OVERFLOW_CANARY_ASLR",
              "errorExplanation": "Canary mismatch triggers STACK_SMASHING_DETECTED_TERMINATING_PROCESS.",
              "recoveryPath": {
                "simplerExplanation": "Matches STACK_SMASHING_DETECTED_TERMINATING_PROCESS.",
                "guidedFixPrompt": "Type STACK_SMASHING_DETECTED_TERMINATING_PROCESS"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d22-b2-aslr-acronym-name",
        "day": 22,
        "blockNumber": 2,
        "title": "The Address Space Layout Randomization Acronym: `ASLR`",
        "conceptBudget": {
          "primaryConcept": "ASLR Acronym Invariant",
          "supportingTerms": [
            "`ASLR` (`Address Space Layout Randomization: An OS exploit mitigation that randomizes the memory locations of the stack, heap, and libraries on every program execution`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d22-b1-stack-overflow-detector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Binary Exploit Mitigations",
            "codeSnippet": "/* 1. Stack Canaries: Detects stack smashing before returning */\n/* 2. ASLR (Address Space Layout Randomization): Randomizes memory offsets */\n/* 3. NX / DEP (Data Execution Prevention / W^X): Marks stack as Non-Executable */",
            "lineNotes": {
              "2": "ASLR randomizes memory addresses to prevent hardcoded shellcode jumps."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aslr_name_demo.js",
            "initialCode": "function getAslr() {\n  return 'ASLR';\n}\n\nconsole.log(getAslr());",
            "expectedOutput": "ASLR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the operating system defense that randomizes stack and heap memory addresses?",
          "expectedStringOutput": "ASLR",
          "acceptableAnswers": [
            "ASLR",
            "'ASLR'",
            "aslr"
          ],
          "primaryMisconceptionId": "MC_CYBER_BUFFER_OVERFLOW_CANARY_ASLR",
          "diagnosisMap": {
            "DEP": {
              "misconceptionId": "MC_CYBER_BUFFER_OVERFLOW_CANARY_ASLR",
              "errorExplanation": "DEP is Data Execution Prevention. Address randomization is ASLR.",
              "recoveryPath": {
                "simplerExplanation": "Type ASLR.",
                "guidedFixPrompt": "Type ASLR"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d22-b3-bounded-string-functions-snprintf",
        "day": 22,
        "blockNumber": 3,
        "title": "Secure C Programming: Replacing Unbounded `strcpy` and `gets` with Bounded `snprintf`",
        "conceptBudget": {
          "primaryConcept": "Bounded String Functions Invariant",
          "supportingTerms": [
            "Bounded Functions (`Replacing strcpy() and gets() with snprintf(buf, sizeof(buf), ...) prevents memory buffer overflows by design`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d22-b2-aslr-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bounded_strings_demo.js",
            "initialCode": "function getBoundedStringRule() {\n  return 'REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS';\n}\n\nconsole.log(getBoundedStringRule());",
            "expectedOutput": "REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do systems programmers eliminate stack buffer overflow vulnerabilities in C code?",
          "expectedStringOutput": "REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS",
          "acceptableAnswers": [
            "REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS",
            "Use bounded snprintf instead of strcpy",
            "Replace strcpy with snprintf"
          ],
          "primaryMisconceptionId": "MC_CYBER_BUFFER_OVERFLOW_CANARY_ASLR",
          "diagnosisMap": {
            "USE_STRCPY": {
              "misconceptionId": "MC_CYBER_BUFFER_OVERFLOW_CANARY_ASLR",
              "errorExplanation": "Standard is: REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS.",
                "guidedFixPrompt": "Type REPLACE_UNBOUNDED_STRCPY_AND_GETS_WITH_BOUNDED_SNPRINTF_TO_PREVENT_BUFFER_OVERFLOWS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Memory Safety: Use-After-Free, Dangling Pointers & Spatial/Temporal Safety",
    "overviewMetaphor": "Use-After-Free Is Visiting a Hotel Room After Checking Out: You checked out of room 204 (`free(ptr)`); the hotel assigned room 204 to a new guest with a VIP credit card; if you still have a duplicate key and enter room 204 (`ptr->dereference`), you read or overwrite someone else's memory; memory safety trackers enforce strict temporal ownership to block dangling pointer exploitation (`USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED`).",
    "blocks": [
      {
        "id": "cyber-d23-b1-pointer-lifecycle-tracker",
        "day": 23,
        "blockNumber": 1,
        "title": "Memory Safety: Tracking Pointer Lifecycle & Blocking Use-After-Free (`USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED`)",
        "conceptBudget": {
          "primaryConcept": "Memory Safety Lifecycle & Dangling Pointer Tracker",
          "supportingTerms": [
            "Pointer State (`'ALLOCATED'` vs `'FREED'`)",
            "Requested Action (`'DEREFERENCE'` vs `'READ'`)",
            "Memory Violation Flag (`true`)",
            "Status: Use-After-Free Blocked Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d22-b1-stack-overflow-detector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Temporal Memory Safety State Machine Ledger",
              "boxes": [
                {
                  "label": "Valid Read (ALLOCATED)",
                  "value": "State: ALLOCATED -> Action: READ -> Valid memory access (NOMINAL!)",
                  "varType": "Valid Read",
                  "isUpdated": false
                },
                {
                  "label": "UAF Attempt (FREED)",
                  "value": "State: FREED -> Action: DEREFERENCE -> Memory violation flagged!",
                  "varType": "UAF Attempt",
                  "isUpdated": true
                },
                {
                  "label": "State Machine Status",
                  "value": "USE AFTER FREE OR DOUBLE FREE BLOCKED (HEAP CORRUPTION PREVENTED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "uaf_demo.js",
            "initialCode": "function trackPointer(state, action) {\n  let next = state;\n  let isViolation = false;\n  if (action === 'FREE') {\n    if (state === 'FREED') isViolation = true;\n    next = 'FREED';\n  } else if (action === 'DEREFERENCE' || action === 'READ' || action === 'WRITE') {\n    if (state === 'FREED' || state === 'NULL') isViolation = true;\n  }\n  return {\n    isMemoryViolation: isViolation,\n    status: isViolation ? 'USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED' : 'MEMORY_OPERATION_VALID_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(trackPointer('FREED', 'DEREFERENCE')));\nconsole.log(JSON.stringify(trackPointer('ALLOCATED', 'READ')));",
            "expectedOutput": "{\"isMemoryViolation\":true,\"status\":\"USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED\"}\n{\"isMemoryViolation\":false,\"status\":\"MEMORY_OPERATION_VALID_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an application attempts to dereference a memory pointer in FREED state?",
          "expectedStringOutput": "USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED",
          "acceptableAnswers": [
            "USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED",
            "status\":\"USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_USE_AFTER_FREE_DANGLING_POINTERS",
          "diagnosisMap": {
            "VALID": {
              "misconceptionId": "MC_CYBER_USE_AFTER_FREE_DANGLING_POINTERS",
              "errorExplanation": "Dereferencing freed memory is a critical vulnerability: USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type USE_AFTER_FREE_OR_DOUBLE_FREE_BLOCKED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d23-b2-temporal-safety-term-name",
        "day": 23,
        "blockNumber": 2,
        "title": "The Temporal Memory Safety Dimension: `Temporal Safety`",
        "conceptBudget": {
          "primaryConcept": "Temporal Safety Invariant",
          "supportingTerms": [
            "`Temporal Safety` (`The property that memory accesses are valid at the time they occur, preventing use-after-free and double-free vulnerabilities`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d23-b1-pointer-lifecycle-tracker",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Spatial vs Temporal Memory Safety",
            "codeSnippet": "/* 1. SPATIAL MEMORY SAFETY: Accessing within valid buffer bounds (0 <= index < size) */\n/* 2. TEMPORAL MEMORY SAFETY: Accessing only while memory lifetime is active (Before free()) */\n/* Rust guarantees BOTH spatial and temporal memory safety at compile time! */",
            "lineNotes": {
              "2": "Temporal safety prevents UAF."
            }
          },
          {
            "type": "runnable_code",
            "filename": "temporal_name_demo.js",
            "initialCode": "function getTemporalName() {\n  return 'Temporal Safety';\n}\n\nconsole.log(getTemporalName());",
            "expectedOutput": "Temporal Safety",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What memory safety classification governs pointer access lifetime and prevents Use-After-Free flaws?",
          "expectedStringOutput": "Temporal Safety",
          "acceptableAnswers": [
            "Temporal Safety",
            "'Temporal Safety'",
            "temporal safety"
          ],
          "primaryMisconceptionId": "MC_CYBER_USE_AFTER_FREE_DANGLING_POINTERS",
          "diagnosisMap": {
            "Spatial Safety": {
              "misconceptionId": "MC_CYBER_USE_AFTER_FREE_DANGLING_POINTERS",
              "errorExplanation": "Spatial safety prevents out-of-bounds index errors. Lifetime safety is Temporal Safety.",
              "recoveryPath": {
                "simplerExplanation": "Type Temporal Safety.",
                "guidedFixPrompt": "Type Temporal Safety"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d23-b3-rust-ownership-borrow-checker",
        "day": 23,
        "blockNumber": 3,
        "title": "Language Revolution: How Rust Ownership and Borrow Checker Eliminate Memory Safety CVEs",
        "conceptBudget": {
          "primaryConcept": "Rust Borrow Checker Invariant",
          "supportingTerms": [
            "Rust Ownership (`Compile-time affine type system where each value has a single owner, eliminating 100% of spatial and temporal memory bugs without garbage collection`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d23-b2-temporal-safety-term-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rust_borrow_demo.js",
            "initialCode": "function getRustSafetyRule() {\n  return 'RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME';\n}\n\nconsole.log(getRustSafetyRule());",
            "expectedOutput": "RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does the Rust programming language guarantee complete temporal memory safety?",
          "expectedStringOutput": "RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME",
          "acceptableAnswers": [
            "RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME",
            "Ownership and borrow checker eliminate use-after-free at compile time",
            "Borrow checker at compile time"
          ],
          "primaryMisconceptionId": "MC_CYBER_USE_AFTER_FREE_DANGLING_POINTERS",
          "diagnosisMap": {
            "GARBAGE_COLLECTION": {
              "misconceptionId": "MC_CYBER_USE_AFTER_FREE_DANGLING_POINTERS",
              "errorExplanation": "Standard is: RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME.",
              "recoveryPath": {
                "simplerExplanation": "Matches RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME.",
                "guidedFixPrompt": "Type RUST_OWNERSHIP_AND_BORROW_CHECKER_ELIMINATE_USE_AFTER_FREE_AT_COMPILE_TIME"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Security Information & Event Management (SIEM): Log Analysis & IOC Detection",
    "overviewMetaphor": "A SIEM Correlation Rule Is a Building Security Camera Aggregator: One failed keycard attempt is an accident; but 3 failed attempts in 60 seconds from the exact same IP address (`198.51.100.4`) correlates across server logs to flag an active brute-force password attack and sound the SOC alarm (`SIEM_BRUTE_FORCE_ATTACK_CORRELATED_ALERT`).",
    "blocks": [
      {
        "id": "cyber-d24-b1-siem-correlation-engine",
        "day": 24,
        "blockNumber": 1,
        "title": "SIEM Telemetry: Correlating 3 Failed Auth Events within 60s from `198.51.100.4`",
        "conceptBudget": {
          "primaryConcept": "SIEM Brute Force Correlation Rule Engine",
          "supportingTerms": [
            "Scanned Event Logs",
            "Time Window ($60\\text{s}$)",
            "Threshold Count ($3$)",
            "Threat Source IP (`'198.51.100.4'`)",
            "Status: SIEM Brute Force Alert Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d23-b1-pointer-lifecycle-tracker",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SIEM Event Telemetry Correlation Ledger",
              "boxes": [
                {
                  "label": "1. Log Event 1 (t=100s)",
                  "value": "AUTH_FAILED from 198.51.100.4 (Count = 1)",
                  "varType": "Log Event",
                  "isUpdated": false
                },
                {
                  "label": "2. Log Event 2 (t=105s)",
                  "value": "AUTH_FAILED from 198.51.100.4 (Count = 2)",
                  "varType": "Log Event",
                  "isUpdated": false
                },
                {
                  "label": "3. Log Event 3 (t=110s)",
                  "value": "AUTH_FAILED from 198.51.100.4 (Count = 3 >= Threshold: BRUTE FORCE ALERT!)",
                  "varType": "Alert Event",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "siem_demo.js",
            "initialCode": "function correlateSiem(logs, thresh) {\n  const counts = {};\n  let isAlert = false;\n  let badIp = null;\n  for (const log of logs) {\n    if (log.action === 'AUTH_FAILED') {\n      counts[log.sourceIp] = (counts[log.sourceIp] || 0) + 1;\n      if (counts[log.sourceIp] >= thresh) {\n        isAlert = true;\n        badIp = log.sourceIp;\n      }\n    }\n  }\n  return {\n    isBruteForceAlert: isAlert,\n    threatSourceIp: badIp,\n    status: isAlert ? 'SIEM_BRUTE_FORCE_ATTACK_CORRELATED_ALERT' : 'SIEM_LOGS_NOMINAL'\n  };\n}\n\nconst logs = [\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 100 },\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 105 },\n  { action: 'AUTH_FAILED', sourceIp: '198.51.100.4', timestamp: 110 }\n];\nconsole.log(JSON.stringify(correlateSiem(logs, 3)));",
            "expectedOutput": "{\"isBruteForceAlert\":true,\"threatSourceIp\":\"198.51.100.4\",\"status\":\"SIEM_BRUTE_FORCE_ATTACK_CORRELATED_ALERT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What offending threat source IP is identified by the SIEM correlation rule?",
          "expectedStringOutput": "198.51.100.4",
          "acceptableAnswers": [
            "198.51.100.4",
            "threatSourceIp\":\"198.51.100.4\""
          ],
          "primaryMisconceptionId": "MC_CYBER_SIEM_LOG_ANALYSIS_IOC_DETECTION",
          "diagnosisMap": {
            "127.0.0.1": {
              "misconceptionId": "MC_CYBER_SIEM_LOG_ANALYSIS_IOC_DETECTION",
              "errorExplanation": "Source IP in the telemetry stream is 198.51.100.4.",
              "recoveryPath": {
                "simplerExplanation": "IP is 198.51.100.4.",
                "guidedFixPrompt": "Type 198.51.100.4"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d24-b2-ioc-acronym-name",
        "day": 24,
        "blockNumber": 2,
        "title": "The Indicator of Compromise Acronym: `IOC`",
        "conceptBudget": {
          "primaryConcept": "IOC Acronym Invariant",
          "supportingTerms": [
            "`IOC` (`Indicator of Compromise: Forensic evidence of security incidents such as malicious IP addresses, known malware SHA-256 hashes, or C2 domain names`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d24-b1-siem-correlation-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Types of IOCs",
            "codeSnippet": "/* 1. Network IOC: Malicious C2 IP / Domain (e.g. 198.51.100.4) */\n/* 2. Host IOC: Malicious payload SHA-256 hash or registry key */\n/* 3. Behavioral IOC: Unusual PowerShell execution with base64 encoded command */",
            "lineNotes": {
              "1": "IOCs provide actionable forensic signatures for automated threat hunting."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ioc_name_demo.js",
            "initialCode": "function getIoc() {\n  return 'IOC';\n}\n\nconsole.log(getIoc());",
            "expectedOutput": "IOC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for Indicators of Compromise in cyber threat intelligence?",
          "expectedStringOutput": "IOC",
          "acceptableAnswers": [
            "IOC",
            "'IOC'",
            "ioc"
          ],
          "primaryMisconceptionId": "MC_CYBER_SIEM_LOG_ANALYSIS_IOC_DETECTION",
          "diagnosisMap": {
            "SOC": {
              "misconceptionId": "MC_CYBER_SIEM_LOG_ANALYSIS_IOC_DETECTION",
              "errorExplanation": "SOC is Security Operations Center. Threat artifacts are IOCs.",
              "recoveryPath": {
                "simplerExplanation": "Type IOC.",
                "guidedFixPrompt": "Type IOC"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d24-b3-mitre-attck-framework-mapping",
        "day": 24,
        "blockNumber": 3,
        "title": "Threat Taxonomy: Mapping Security Telemetry to the MITRE ATT&CK Framework",
        "conceptBudget": {
          "primaryConcept": "MITRE ATT&CK Invariant",
          "supportingTerms": [
            "`MITRE ATT&CK` (`Adversarial Tactics, Techniques, and Common Knowledge: Globally accessible knowledge base of adversary behaviors based on real-world observations`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d24-b2-ioc-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mitre_demo.js",
            "initialCode": "function getMitreRule() {\n  return 'MITRE_ATTCK_MAPS_THREAT_SIGNALS_TO_STANDARDIZED_ADVERSARY_TACTICS_AND_TECHNIQUES';\n}\n\nconsole.log(getMitreRule());",
            "expectedOutput": "MITRE_ATTCK_MAPS_THREAT_SIGNALS_TO_STANDARDIZED_ADVERSARY_TACTICS_AND_TECHNIQUES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What knowledge base standardizes adversary tactics, techniques, and procedures (TTPs) across the cybersecurity industry?",
          "expectedStringOutput": "MITRE_ATTCK_MAPS_THREAT_SIGNALS_TO_STANDARDIZED_ADVERSARY_TACTICS_AND_TECHNIQUES",
          "acceptableAnswers": [
            "MITRE_ATTCK_MAPS_THREAT_SIGNALS_TO_STANDARDIZED_ADVERSARY_TACTICS_AND_TECHNIQUES",
            "MITRE ATT&CK",
            "Standardized adversary tactics and techniques"
          ],
          "primaryMisconceptionId": "MC_CYBER_SIEM_LOG_ANALYSIS_IOC_DETECTION",
          "diagnosisMap": {
            "NIST": {
              "misconceptionId": "MC_CYBER_SIEM_LOG_ANALYSIS_IOC_DETECTION",
              "errorExplanation": "NIST provides compliance frameworks. Adversary TTP taxonomy is MITRE ATT&CK.",
              "recoveryPath": {
                "simplerExplanation": "Matches MITRE_ATTCK_MAPS_THREAT_SIGNALS_TO_STANDARDIZED_ADVERSARY_TACTICS_AND_TECHNIQUES.",
                "guidedFixPrompt": "Type MITRE_ATTCK_MAPS_THREAT_SIGNALS_TO_STANDARDIZED_ADVERSARY_TACTICS_AND_TECHNIQUES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Intrusion Detection & Prevention Systems (IDS/IPS): Snort & Suricata Rules",
    "overviewMetaphor": "A Snort NIDS Rule Is a Sniffer Dog at Border Customs: As millions of network packets stream across the wire, Snort inspects packet headers (TCP port 80) and payload content ('User-Agent: Nmap'); if an unauthorized port scan signature is sniffed, Snort immediately triggers an alert and drops the offending packet on the wire (`DROP`).",
    "blocks": [
      {
        "id": "cyber-d25-b1-snort-rule-matcher",
        "day": 25,
        "blockNumber": 1,
        "title": "IDS/IPS: Matching Snort Rule Signature (TCP Port 80, `'Nmap'` $\\to$ `DROP`)",
        "conceptBudget": {
          "primaryConcept": "Snort Signature Rule Pattern Matcher",
          "supportingTerms": [
            "Protocol (`'TCP'`)",
            "Destination Port (`80`)",
            "Payload Signature (`'Nmap'`)",
            "Action (`'DROP'`)",
            "Status: IDS Rule Signature Matched Alert"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d24-b1-siem-correlation-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Snort / Suricata Packet Payload Inspection Ledger",
              "boxes": [
                {
                  "label": "1. Packet Header",
                  "value": "TCP port 80 (Protocol and port match rule filter)",
                  "varType": "Header",
                  "isUpdated": false
                },
                {
                  "label": "2. Packet Payload",
                  "value": "\"GET / HTTP/1.1 User-Agent: Nmap\" (Contains 'Nmap' scan signature: MATCH!)",
                  "varType": "Payload",
                  "isUpdated": true
                },
                {
                  "label": "IPS Enforcement Action",
                  "value": "DROP (PACKET BLOCKED ON THE WIRE BEFORE REACHING WEB SERVER!)",
                  "varType": "Action",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "snort_demo.js",
            "initialCode": "function matchSnort(proto, port, payload, rule) {\n  const isProtoMatch = proto.toUpperCase() === rule.protocol.toUpperCase();\n  const isPortMatch = rule.dstPort === 'any' || port === rule.dstPort;\n  const isContentMatch = payload.includes(rule.content);\n  const isTriggered = isProtoMatch && isPortMatch && isContentMatch;\n  return {\n    ruleSid: rule.sid,\n    isSignatureTriggered: isTriggered,\n    action: isTriggered ? rule.action : 'PASS',\n    status: isTriggered ? 'IDS_RULE_SIGNATURE_MATCHED_ALERT' : 'PACKET_INSPECTED_CLEAN'\n  };\n}\n\nconst rule = { sid: 1001, protocol: 'TCP', dstPort: 80, content: 'Nmap', action: 'DROP' };\nconsole.log(JSON.stringify(matchSnort('TCP', 80, 'GET / HTTP/1.1 User-Agent: Nmap', rule)));\nconsole.log(JSON.stringify(matchSnort('TCP', 80, 'GET / HTTP/1.1 User-Agent: Mozilla', rule)));",
            "expectedOutput": "{\"ruleSid\":1001,\"isSignatureTriggered\":true,\"action\":\"DROP\",\"status\":\"IDS_RULE_SIGNATURE_MATCHED_ALERT\"}\n{\"ruleSid\":1001,\"isSignatureTriggered\":false,\"action\":\"PASS\",\"status\":\"PACKET_INSPECTED_CLEAN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What enforcement action is taken when an incoming packet matches the Nmap scan Snort rule?",
          "expectedStringOutput": "DROP",
          "acceptableAnswers": [
            "DROP",
            "'DROP'",
            "action\":\"DROP\""
          ],
          "primaryMisconceptionId": "MC_CYBER_IDS_IPS_SNORT_SURICATA_RULES",
          "diagnosisMap": {
            "PASS": {
              "misconceptionId": "MC_CYBER_IDS_IPS_SNORT_SURICATA_RULES",
              "errorExplanation": "Matching packet triggers the rule action: DROP.",
              "recoveryPath": {
                "simplerExplanation": "Action is DROP.",
                "guidedFixPrompt": "Type DROP"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d25-b2-standard-nids-snort-name",
        "day": 25,
        "blockNumber": 2,
        "title": "The Standard Open-Source NIDS Engine: `Snort`",
        "conceptBudget": {
          "primaryConcept": "Snort Engine Invariant",
          "supportingTerms": [
            "`Snort` (`The industry-standard open-source network intrusion detection and prevention system created by Martin Roesch`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d25-b1-snort-rule-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Snort Rule Syntax",
            "codeSnippet": "// SNORT RULE STRUCTURE:\n// action protocol src_ip src_port -> dst_ip dst_port ( options )\nalert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:\"SQLi\"; content:\"UNION SELECT\"; sid:1000001;)",
            "lineNotes": {
              "3": "alert is action, tcp protocol, matching UNION SELECT on port 80."
            }
          },
          {
            "type": "runnable_code",
            "filename": "snort_name_demo.js",
            "initialCode": "function getSnortName() {\n  return 'Snort';\n}\n\nconsole.log(getSnortName());",
            "expectedOutput": "Snort",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the name of the premier open-source signature-based Network Intrusion Detection System?",
          "expectedStringOutput": "Snort",
          "acceptableAnswers": [
            "Snort",
            "'Snort'",
            "snort"
          ],
          "primaryMisconceptionId": "MC_CYBER_IDS_IPS_SNORT_SURICATA_RULES",
          "diagnosisMap": {
            "Wireshark": {
              "misconceptionId": "MC_CYBER_IDS_IPS_SNORT_SURICATA_RULES",
              "errorExplanation": "Wireshark is a packet capture analyzer. The real-time NIDS engine is Snort.",
              "recoveryPath": {
                "simplerExplanation": "Type Snort.",
                "guidedFixPrompt": "Type Snort"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d25-b3-ids-vs-ips-inline-blocking",
        "day": 25,
        "blockNumber": 3,
        "title": "Architecture Distinction: Passive IDS (Monitoring Tap) vs Active IPS (Inline Packet Dropping)",
        "conceptBudget": {
          "primaryConcept": "IDS vs IPS Invariant",
          "supportingTerms": [
            "Passive IDS vs Inline IPS (`IDS listens passively on a SPAN/TAP port and generates alerts; IPS sits inline in the network traffic path and can actively drop packets in real time`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d25-b2-standard-nids-snort-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ids_ips_demo.js",
            "initialCode": "function getIdsIpsRule() {\n  return 'IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY';\n}\n\nconsole.log(getIdsIpsRule());",
            "expectedOutput": "IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What operational difference separates an Intrusion Prevention System (IPS) from an Intrusion Detection System (IDS)?",
          "expectedStringOutput": "IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY",
          "acceptableAnswers": [
            "IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY",
            "IPS sits inline to actively drop packets while IDS monitors passively",
            "Inline packet dropping vs passive monitoring"
          ],
          "primaryMisconceptionId": "MC_CYBER_IDS_IPS_SNORT_SURICATA_RULES",
          "diagnosisMap": {
            "THEY_ARE_IDENTICAL": {
              "misconceptionId": "MC_CYBER_IDS_IPS_SNORT_SURICATA_RULES",
              "errorExplanation": "Standard is: IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY.",
              "recoveryPath": {
                "simplerExplanation": "Matches IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY.",
                "guidedFixPrompt": "Type IPS_SITS_INLINE_TO_ACTIVELY_DROP_MALICIOUS_PACKETS_WHILE_IDS_MONITORS_PASSIVELY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Penetration Testing & Vulnerability Assessment: CVSS v3.1 Scoring",
    "overviewMetaphor": "CVSS v3.1 Is an Emergency Room Triage Scale: A minor bug (score $5.3$) gets classified as `MEDIUM` severity; a remote unauthenticated root exploit (score $9.8$ like Log4Shell) gets classified as `CRITICAL` severity, sounding five-alarm alarms for emergency security patching across the enterprise.",
    "blocks": [
      {
        "id": "cyber-d26-b1-cvss-score-categorizer",
        "day": 26,
        "blockNumber": 1,
        "title": "CVSS v3.1 Severity: Categorizing Base Scores ($9.8 \\to \\text{CRITICAL}, 5.3 \\to \\text{MEDIUM}$)",
        "conceptBudget": {
          "primaryConcept": "CVSS v3.1 Qualitative Severity Rating Categorizer",
          "supportingTerms": [
            "Critical Score ($9.8$)",
            "Medium Score ($5.3$)",
            "Severity Rating ('CRITICAL' vs 'MEDIUM')",
            "Status: CVSS Rating Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d25-b1-snort-rule-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CVSS v3.1 Qualitative Severity Scale Ledger",
              "boxes": [
                {
                  "label": "1. Score 9.8 (Log4Shell)",
                  "value": "Score >= 9.0 -> Severity: CRITICAL (IMMEDIATE EMERGENCY FIX!)",
                  "varType": "Critical Vulnerability",
                  "isUpdated": true
                },
                {
                  "label": "2. Score 5.3 (Minor Info Leak)",
                  "value": "4.0 <= Score < 7.0 -> Severity: MEDIUM",
                  "varType": "Medium",
                  "isUpdated": false
                },
                {
                  "label": "Assessment Status",
                  "value": "CVSS RATING CALCULATED NOMINAL (NIST STANDARDS ENFORCED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cvss_demo.js",
            "initialCode": "function categorizeCvss(score) {\n  if (score === 0.0) return { rating: 'NONE' };\n  let r = 'CRITICAL';\n  if (score < 4.0) r = 'LOW';\n  else if (score < 7.0) r = 'MEDIUM';\n  else if (score < 9.0) r = 'HIGH';\n  return {\n    baseScore: score,\n    severityRating: r,\n    status: 'CVSS_RATING_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(categorizeCvss(9.8)));\nconsole.log(JSON.stringify(categorizeCvss(5.3)));",
            "expectedOutput": "{\"baseScore\":9.8,\"severityRating\":\"CRITICAL\",\"status\":\"CVSS_RATING_CALCULATED_NOMINAL\"}\n{\"baseScore\":5.3,\"severityRating\":\"MEDIUM\",\"status\":\"CVSS_RATING_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What qualitative CVSS severity rating corresponds to a base score of 9.8?",
          "expectedStringOutput": "CRITICAL",
          "acceptableAnswers": [
            "CRITICAL",
            "'CRITICAL'",
            "severityRating\":\"CRITICAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_CVSS_VULNERABILITY_SEVERITY_SCORING",
          "diagnosisMap": {
            "HIGH": {
              "misconceptionId": "MC_CYBER_CVSS_VULNERABILITY_SEVERITY_SCORING",
              "errorExplanation": "Scores >= 9.0 are CRITICAL. Scores 7.0-8.9 are HIGH.",
              "recoveryPath": {
                "simplerExplanation": "Rating is CRITICAL.",
                "guidedFixPrompt": "Type CRITICAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d26-b2-cvss-acronym-name",
        "day": 26,
        "blockNumber": 2,
        "title": "The Common Vulnerability Scoring System Acronym: `CVSS`",
        "conceptBudget": {
          "primaryConcept": "CVSS Acronym Invariant",
          "supportingTerms": [
            "`CVSS` (`Common Vulnerability Scoring System: The open industry standard for assessing the severity of computer system security vulnerabilities`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d26-b1-cvss-score-categorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CVSS v3.1 Base Metrics",
            "codeSnippet": "/* CVSS VECTOR STRING: */\nCVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H  (Score: 9.8 CRITICAL!)\n\n// AV:N = Network Attack Vector\n// AC:L = Low Attack Complexity\n// PR:N = No Privileges Required\n// C:H, I:H, A:H = High Confidentiality, Integrity, Availability impact",
            "lineNotes": {
              "2": "Full vector string defines all metric parameters."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cvss_name_demo.js",
            "initialCode": "function getCvss() {\n  return 'CVSS';\n}\n\nconsole.log(getCvss());",
            "expectedOutput": "CVSS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the Common Vulnerability Scoring System?",
          "expectedStringOutput": "CVSS",
          "acceptableAnswers": [
            "CVSS",
            "'CVSS'",
            "cvss"
          ],
          "primaryMisconceptionId": "MC_CYBER_CVSS_VULNERABILITY_SEVERITY_SCORING",
          "diagnosisMap": {
            "CVE": {
              "misconceptionId": "MC_CYBER_CVSS_VULNERABILITY_SEVERITY_SCORING",
              "errorExplanation": "CVE is the vulnerability identifier. The scoring standard is CVSS.",
              "recoveryPath": {
                "simplerExplanation": "Type CVSS.",
                "guidedFixPrompt": "Type CVSS"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d26-b3-responsible-disclosure-principles",
        "day": 26,
        "blockNumber": 3,
        "title": "Ethical Hacking: Coordinated Vulnerability Disclosure & Safe Harbor Agreements",
        "conceptBudget": {
          "primaryConcept": "Coordinated Disclosure Invariant",
          "supportingTerms": [
            "Coordinated Disclosure (`Reporting zero-day vulnerabilities privately to vendors with a 90-day patch window before public publication, avoiding harm to end-users`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d26-b2-cvss-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "disclosure_demo.js",
            "initialCode": "function getDisclosureRule() {\n  return 'COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE';\n}\n\nconsole.log(getDisclosureRule());",
            "expectedOutput": "COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do ethical security researchers practice coordinated vulnerability disclosure instead of instant zero-day public drops?",
          "expectedStringOutput": "COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE",
          "acceptableAnswers": [
            "COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE",
            "Provides vendors reasonable time to patch",
            "Time to patch before public release"
          ],
          "primaryMisconceptionId": "MC_CYBER_CVSS_VULNERABILITY_SEVERITY_SCORING",
          "diagnosisMap": {
            "NO_REASON": {
              "misconceptionId": "MC_CYBER_CVSS_VULNERABILITY_SEVERITY_SCORING",
              "errorExplanation": "Standard is: COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE.",
              "recoveryPath": {
                "simplerExplanation": "Matches COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE.",
                "guidedFixPrompt": "Type COORDINATED_DISCLOSURE_PROVIDES_VENDORS_REASONABLE_TIME_TO_PATCH_BEFORE_PUBLIC_RELEASE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Zero Trust Architecture (ZTA): BeyondCorp & Continuous Verification",
    "overviewMetaphor": "Zero Trust Is a Continuous Keycard Tap at Every Single Door: Traditional network security was a castle moat—once inside the castle, you could roam anywhere; Zero Trust assumes the castle moat is already breached ('Assume Breach'); every single doorway (micro-service) demands identity verification, device health checks, and contextual authorization (`Never Trust, Always Verify`).",
    "blocks": [
      {
        "id": "cyber-d27-b1-zero-trust-policy-evaluator",
        "day": 27,
        "blockNumber": 1,
        "title": "Zero Trust: Continuously Evaluating Identity + Device Health + Location Risk (`ZERO_TRUST_VERIFIED_ACCESS_GRANTED`)",
        "conceptBudget": {
          "primaryConcept": "Zero Trust Policy Continuous Verification Engine",
          "supportingTerms": [
            "Identity Valid (`true`)",
            "Device Healthy (`true` vs `false`)",
            "Location Risk Low (`true`)",
            "Status: Zero Trust Verified Access Granted"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d26-b1-cvss-score-categorizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Zero Trust Continuous Contextual Posture Ledger",
              "boxes": [
                {
                  "label": "Device Compliant (All 3 Pass)",
                  "value": "Valid identity + Healthy device + Low-risk IP -> Access Granted (NOMINAL!)",
                  "varType": "Healthy Posture",
                  "isUpdated": true
                },
                {
                  "label": "Compromised Device (Health Fail)",
                  "value": "Valid identity + UNHEALTHY DEVICE -> Access Instantly Revoked!",
                  "varType": "Unhealthy Device",
                  "isUpdated": false
                },
                {
                  "label": "Evaluation Decision",
                  "value": "ZERO TRUST VERIFIED ACCESS GRANTED (CONTINUOUS VERIFICATION ACTIVE!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zero_trust_demo.js",
            "initialCode": "function evalZeroTrust(idOk, devOk, locOk) {\n  const isApproved = idOk && devOk && locOk;\n  return {\n    zeroTrustAccessGranted: isApproved,\n    status: isApproved ? 'ZERO_TRUST_VERIFIED_ACCESS_GRANTED' : 'ZERO_TRUST_VERIFICATION_FAILED_ACCESS_REVOKED'\n  };\n}\n\nconsole.log(JSON.stringify(evalZeroTrust(true, true, true)));\nconsole.log(JSON.stringify(evalZeroTrust(true, false, true)));",
            "expectedOutput": "{\"zeroTrustAccessGranted\":true,\"status\":\"ZERO_TRUST_VERIFIED_ACCESS_GRANTED\"}\n{\"zeroTrustAccessGranted\":false,\"status\":\"ZERO_TRUST_VERIFICATION_FAILED_ACCESS_REVOKED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a request satisfies all Zero Trust continuous verification posture checks?",
          "expectedStringOutput": "ZERO_TRUST_VERIFIED_ACCESS_GRANTED",
          "acceptableAnswers": [
            "ZERO_TRUST_VERIFIED_ACCESS_GRANTED",
            "status\":\"ZERO_TRUST_VERIFIED_ACCESS_GRANTED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_ZERO_TRUST_CONTINUOUS_VERIFICATION",
          "diagnosisMap": {
            "REVOKED": {
              "misconceptionId": "MC_CYBER_ZERO_TRUST_CONTINUOUS_VERIFICATION",
              "errorExplanation": "Matches ZERO_TRUST_VERIFIED_ACCESS_GRANTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type ZERO_TRUST_VERIFIED_ACCESS_GRANTED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d27-b2-zero-trust-maxim-phrase-name",
        "day": 27,
        "blockNumber": 2,
        "title": "The Zero Trust Core Philosophical Maxim: `'Never Trust, Always Verify'`",
        "conceptBudget": {
          "primaryConcept": "Zero Trust Maxim Invariant",
          "supportingTerms": [
            "`Never Trust, Always Verify` (`The foundational principle of Zero Trust Architecture demanding authentication and authorization on every transaction regardless of network location`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d27-b1-zero-trust-policy-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "NIST SP 800-207 Zero Trust Tenets",
            "codeSnippet": "/* NIST ZERO TRUST TENETS: */\n1. All data sources and computing services are considered resources.\n2. All communication is secured regardless of network location.\n3. Access to individual resources is granted on a per-session basis.\n4. Access is determined by dynamic policy (Identity + Device + Context).\n5. The enterprise monitors and measures the integrity of all assets.",
            "lineNotes": {
              "2": "Internal network location provides zero implicit trust."
            }
          },
          {
            "type": "runnable_code",
            "filename": "zero_trust_maxim_demo.js",
            "initialCode": "function getMaxim() {\n  return 'Never Trust, Always Verify';\n}\n\nconsole.log(getMaxim());",
            "expectedOutput": "Never Trust, Always Verify",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the core philosophical maxim of Zero Trust Architecture?",
          "expectedStringOutput": "Never Trust, Always Verify",
          "acceptableAnswers": [
            "Never Trust, Always Verify",
            "'Never Trust, Always Verify'",
            "never trust always verify"
          ],
          "primaryMisconceptionId": "MC_CYBER_ZERO_TRUST_CONTINUOUS_VERIFICATION",
          "diagnosisMap": {
            "Trust but Verify": {
              "misconceptionId": "MC_CYBER_ZERO_TRUST_CONTINUOUS_VERIFICATION",
              "errorExplanation": "Trust but verify is legacy perimeter security. Zero Trust is 'Never Trust, Always Verify'.",
              "recoveryPath": {
                "simplerExplanation": "Type Never Trust, Always Verify.",
                "guidedFixPrompt": "Type Never Trust, Always Verify"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d27-b3-microsegmentation-blast-radius",
        "day": 27,
        "blockNumber": 3,
        "title": "Network Microsegmentation: Restricting Lateral Movement and Containing Blast Radius",
        "conceptBudget": {
          "primaryConcept": "Microsegmentation Invariant",
          "supportingTerms": [
            "Microsegmentation (`Dividing network segments into granular workload security zones, preventing compromised web servers from accessing database clusters laterally`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d27-b2-zero-trust-maxim-phrase-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "microsegmentation_demo.js",
            "initialCode": "function getMicrosegmentationRule() {\n  return 'MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS';\n}\n\nconsole.log(getMicrosegmentationRule());",
            "expectedOutput": "MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do Zero Trust architectures implement network microsegmentation between application workloads?",
          "expectedStringOutput": "MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS",
          "acceptableAnswers": [
            "MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS",
            "Prevents lateral movement and isolates blast radius",
            "Isolates blast radius"
          ],
          "primaryMisconceptionId": "MC_CYBER_ZERO_TRUST_CONTINUOUS_VERIFICATION",
          "diagnosisMap": {
            "INCREASE_BANDWIDTH": {
              "misconceptionId": "MC_CYBER_ZERO_TRUST_CONTINUOUS_VERIFICATION",
              "errorExplanation": "Standard is: MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS.",
              "recoveryPath": {
                "simplerExplanation": "Matches MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS.",
                "guidedFixPrompt": "Type MICROSEGMENTATION_PREVENTS_LATERAL_MOVEMENT_AND_ISOLATES_BLAST_RADIUS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Cloud Security: AWS IAM Least Privilege, S3 Bucket Policies & KMS",
    "overviewMetaphor": "Cloud Least Privilege Is a Master Key Ring with Specific Keys Only: Granting `Action: \"*\"` and `Resource: \"*\"` gives an IAM role the master keys to blow up the entire AWS account; the Principle of Least Privilege grants only the specific required key (`s3:GetObject` on `arn:aws:s3:::mybucket/*`), instantly flagging and blocking overly permissive wildcard policies (`OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED`).",
    "blocks": [
      {
        "id": "cyber-d28-b1-iam-wildcard-auditor",
        "day": 28,
        "blockNumber": 1,
        "title": "Cloud Security: Auditing IAM Policies & Flagging `Action: \"*\"` Wildcard Over-Privilege",
        "conceptBudget": {
          "primaryConcept": "AWS IAM Policy Least Privilege Wildcard Auditor",
          "supportingTerms": [
            "Policy Effect (`'Allow'`)",
            "Wildcard Action (`'*'`)",
            "Scoped Resource (`'arn:aws:s3:::mybucket/*'` )",
            "Status: Least Privilege Compliant vs Overly Permissive"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d27-b1-zero-trust-policy-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AWS Cloud IAM Policy Least Privilege Ledger",
              "boxes": [
                {
                  "label": "Risky Policy ({Action: '*'})",
                  "value": "Full admin wildcard -> Overly permissive threat (FLAGGED!)",
                  "varType": "Overly Permissive",
                  "isUpdated": true
                },
                {
                  "label": "Secure Policy ({Action: ['s3:GetObject']})",
                  "value": "Scoped action on specific bucket -> LEAST PRIVILEGE COMPLIANT",
                  "varType": "Least Privilege",
                  "isUpdated": false
                },
                {
                  "label": "Audit Decision",
                  "value": "Wildcard actions blocked (CLOUD COMPLIANCE VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "iam_audit_demo.js",
            "initialCode": "function auditIam(stmt) {\n  const isAllow = stmt.Effect === 'Allow';\n  const hasActionWildcard = stmt.Action === '*' || (Array.isArray(stmt.Action) && stmt.Action.includes('*'));\n  const hasResWildcard = stmt.Resource === '*' || (Array.isArray(stmt.Resource) && stmt.Resource.includes('*'));\n  const isExcessive = isAllow && (hasActionWildcard || hasResWildcard);\n  return {\n    isPolicyCompliant: !isExcessive,\n    status: !isExcessive ? 'IAM_POLICY_LEAST_PRIVILEGE_COMPLIANT' : 'OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditIam({ Effect: 'Allow', Action: '*', Resource: '*' })));\nconsole.log(JSON.stringify(auditIam({ Effect: 'Allow', Action: ['s3:GetObject'], Resource: 'arn:aws:s3:::mybucket/*' })));",
            "expectedOutput": "{\"isPolicyCompliant\":false,\"status\":\"OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED\"}\n{\"isPolicyCompliant\":true,\"status\":\"IAM_POLICY_LEAST_PRIVILEGE_COMPLIANT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is flagged when an IAM policy statement grants Action: '*' and Resource: '*' with Effect: 'Allow'?",
          "expectedStringOutput": "OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED",
          "acceptableAnswers": [
            "OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED",
            "status\":\"OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED\""
          ],
          "primaryMisconceptionId": "MC_CYBER_CLOUD_IAM_LEAST_PRIVILEGE_KMS",
          "diagnosisMap": {
            "COMPLIANT": {
              "misconceptionId": "MC_CYBER_CLOUD_IAM_LEAST_PRIVILEGE_KMS",
              "errorExplanation": "Wildcard admin actions violate least privilege: OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED.",
                "guidedFixPrompt": "Type OVERLY_PERMISSIVE_WILDCARD_IAM_POLICY_DETECTED"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d28-b2-least-privilege-principle-name",
        "day": 28,
        "blockNumber": 2,
        "title": "The Golden Cloud Security Principle: `'Least Privilege'`",
        "conceptBudget": {
          "primaryConcept": "Principle of Least Privilege Invariant",
          "supportingTerms": [
            "`Least Privilege` (`The security concept of granting users, processes, and service accounts only the minimum access levels necessary to perform assigned duties`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d28-b1-iam-wildcard-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AWS S3 Bucket Public Block Policy",
            "codeSnippet": "/* AWS S3 BLOCK PUBLIC ACCESS SETTING: */\n{\n  \"BlockPublicAcls\": true,\n  \"IgnorePublicAcls\": true,\n  \"BlockPublicPolicy\": true,\n  \"RestrictPublicBuckets\": true\n}\n// Guarantees bucket cannot be exposed publicly by mistake!",
            "lineNotes": {
              "3": "BlockPublicAcls prevents accidental public data leaks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "least_priv_demo.js",
            "initialCode": "function getPrinciple() {\n  return 'Least Privilege';\n}\n\nconsole.log(getPrinciple());",
            "expectedOutput": "Least Privilege",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core security principle mandates granting only the minimum permissions necessary for an IAM role?",
          "expectedStringOutput": "Least Privilege",
          "acceptableAnswers": [
            "Least Privilege",
            "'Least Privilege'",
            "least privilege"
          ],
          "primaryMisconceptionId": "MC_CYBER_CLOUD_IAM_LEAST_PRIVILEGE_KMS",
          "diagnosisMap": {
            "Zero Trust": {
              "misconceptionId": "MC_CYBER_CLOUD_IAM_LEAST_PRIVILEGE_KMS",
              "errorExplanation": "Zero Trust is the overarching architecture. The specific authorization rule is Least Privilege.",
              "recoveryPath": {
                "simplerExplanation": "Type Least Privilege.",
                "guidedFixPrompt": "Type Least Privilege"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d28-b3-kms-envelope-encryption-mechanics",
        "day": 28,
        "blockNumber": 3,
        "title": "KMS Envelope Encryption: Encrypting Plaintext Data with Fast Local Data Keys Protected by Root CMKs",
        "conceptBudget": {
          "primaryConcept": "Envelope Encryption Invariant",
          "supportingTerms": [
            "Envelope Encryption (`Encrypting data locally with a fast Data Encryption Key (DEK), and encrypting the DEK with a root KMS Customer Master Key (CMK)`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d28-b2-least-privilege-principle-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "envelope_enc_demo.js",
            "initialCode": "function getEnvelopeRule() {\n  return 'ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY';\n}\n\nconsole.log(getEnvelopeRule());",
            "expectedOutput": "ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does Envelope Encryption enable high-throughput encryption of massive cloud databases?",
          "expectedStringOutput": "ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY",
          "acceptableAnswers": [
            "ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY",
            "Local DEK encrypted by root KMS key",
            "Data encryption key encrypted by CMK"
          ],
          "primaryMisconceptionId": "MC_CYBER_CLOUD_IAM_LEAST_PRIVILEGE_KMS",
          "diagnosisMap": {
            "SEND_ALL_DATA_TO_KMS": {
              "misconceptionId": "MC_CYBER_CLOUD_IAM_LEAST_PRIVILEGE_KMS",
              "errorExplanation": "Standard is: ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY.",
                "guidedFixPrompt": "Type ENVELOPE_ENCRYPTION_PROTECTS_DATA_WITH_A_LOCAL_DEK_ENCRYPTED_BY_A_ROOT_KMS_KEY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Incident Response: Forensic Chain of Custody & Containment Strategy",
    "overviewMetaphor": "Digital Forensics Chain of Custody Is a Sealed Evidence Bag with Signature Logs: If a compromised hard drive is copied without recording its SHA-256 bit-stream hash ($e3b0c44...$), defense attorneys argue the evidence was tampered with in court; an exact cryptographic hash match and documented chain of custody guarantees digital evidence is legally admissible (`FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL`).",
    "blocks": [
      {
        "id": "cyber-d29-b1-forensic-integrity-verifier",
        "day": 29,
        "blockNumber": 1,
        "title": "Digital Forensics: Verifying SHA-256 Bit-Stream Evidence Hash & Chain of Custody Documentation",
        "conceptBudget": {
          "primaryConcept": "Digital Forensics Chain of Custody Integrity Verifier",
          "supportingTerms": [
            "Original Disk Hash (`e3b0c442...`)",
            "Current Disk Hash (`e3b0c442...`)",
            "Chain Documented (`true`)",
            "Status: Forensic Evidence Integrity Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d28-b1-iam-wildcard-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Forensic Evidence Bit-Stream Hash Verification Ledger",
              "boxes": [
                {
                  "label": "Original Evidence Hash",
                  "value": "e3b0c442... (Sealed cryptographic fingerprint at incident capture)",
                  "varType": "Original Hash",
                  "isUpdated": false
                },
                {
                  "label": "Current Evidence Hash",
                  "value": "e3b0c442... (Identical bit-stream match: ZERO TAMPERING!)",
                  "varType": "Current Hash",
                  "isUpdated": true
                },
                {
                  "label": "Admissibility Status",
                  "value": "FORENSIC EVIDENCE INTEGRITY VERIFIED NOMINAL (COURT ADMISSIBLE!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "forensics_demo.js",
            "initialCode": "function verifyForensics(origHash, currHash, isDoc) {\n  const isMatch = origHash.toLowerCase() === currHash.toLowerCase();\n  const isAdmissible = isMatch && isDoc === true;\n  return {\n    isHashIdentical: isMatch,\n    isEvidenceAdmissible: isAdmissible,\n    status: isAdmissible ? 'FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL' : 'CHAIN_OF_CUSTODY_INTEGRITY_COMPROMISED'\n  };\n}\n\nconst hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';\nconsole.log(JSON.stringify(verifyForensics(hash, hash, true)));\nconsole.log(JSON.stringify(verifyForensics(hash, 'tampered_hash', true)));",
            "expectedOutput": "{\"isHashIdentical\":true,\"isEvidenceAdmissible\":true,\"status\":\"FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL\"}\n{\"isHashIdentical\":false,\"isEvidenceAdmissible\":false,\"status\":\"CHAIN_OF_CUSTODY_INTEGRITY_COMPROMISED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that digital forensic evidence has matching cryptographic hashes and documented chain of custody?",
          "expectedStringOutput": "FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL",
            "status\":\"FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_INCIDENT_RESPONSE_FORENSIC_CHAIN",
          "diagnosisMap": {
            "COMPROMISED": {
              "misconceptionId": "MC_CYBER_INCIDENT_RESPONSE_FORENSIC_CHAIN",
              "errorExplanation": "Matches FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type FORENSIC_EVIDENCE_INTEGRITY_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d29-b2-nist-incident-guide-number-name",
        "day": 29,
        "blockNumber": 2,
        "title": "The NIST Incident Handling Guide Publication: `SP 800-61`",
        "conceptBudget": {
          "primaryConcept": "NIST SP 800-61 Invariant",
          "supportingTerms": [
            "`SP 800-61` (`NIST Special Publication 800-61: Computer Security Incident Handling Guide outlining the 6 phases of incident response`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d29-b1-forensic-integrity-verifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "NIST Incident Response Lifecycle (SP 800-61)",
            "codeSnippet": "/* NIST INCIDENT RESPONSE PHASES: */\n1. Preparation: Hardening systems & incident playbooks\n2. Detection & Analysis: Triaging alerts & scoping IOCs\n3. Containment: Isolating network segments & compromised hosts\n4. Eradication: Removing malware artifacts & closing entry points\n5. Recovery: Restoring from clean backups & enhanced monitoring\n6. Post-Incident Activity: Lessons learned & root cause analysis",
            "lineNotes": {
              "3": "Containment stops active breach expansion."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nist_guide_demo.js",
            "initialCode": "function getNistGuide() {\n  return 'SP 800-61';\n}\n\nconsole.log(getNistGuide());",
            "expectedOutput": "SP 800-61",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the NIST Special Publication number for the Computer Security Incident Handling Guide?",
          "expectedStringOutput": "SP 800-61",
          "acceptableAnswers": [
            "SP 800-61",
            "'SP 800-61'",
            "800-61",
            "NIST SP 800-61"
          ],
          "primaryMisconceptionId": "MC_CYBER_INCIDENT_RESPONSE_FORENSIC_CHAIN",
          "diagnosisMap": {
            "SP 800-53": {
              "misconceptionId": "MC_CYBER_INCIDENT_RESPONSE_FORENSIC_CHAIN",
              "errorExplanation": "SP 800-53 is security controls catalog. Incident handling is SP 800-61.",
              "recoveryPath": {
                "simplerExplanation": "Type SP 800-61.",
                "guidedFixPrompt": "Type SP 800-61"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d29-b3-containment-network-host-isolation",
        "day": 29,
        "blockNumber": 3,
        "title": "Breach Containment: Immediate Network Host Isolation While Preserving Volatile RAM",
        "conceptBudget": {
          "primaryConcept": "Host Isolation Invariant",
          "supportingTerms": [
            "Host Isolation (`Disconnecting compromised machines from the network to stop C2 beaconing while keeping power on to dump volatile memory RAM for forensic analysis`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d29-b2-nist-incident-guide-number-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "host_isolation_demo.js",
            "initialCode": "function getHostIsolationRule() {\n  return 'ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM';\n}\n\nconsole.log(getHostIsolationRule());",
            "expectedOutput": "ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should incident responders isolate compromised endpoints from the network rather than powering them off immediately?",
          "expectedStringOutput": "ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM",
          "acceptableAnswers": [
            "ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM",
            "Preserve volatile RAM",
            "Preserve volatile memory"
          ],
          "primaryMisconceptionId": "MC_CYBER_INCIDENT_RESPONSE_FORENSIC_CHAIN",
          "diagnosisMap": {
            "POWER_OFF": {
              "misconceptionId": "MC_CYBER_INCIDENT_RESPONSE_FORENSIC_CHAIN",
              "errorExplanation": "Standard is: ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM.",
              "recoveryPath": {
                "simplerExplanation": "Matches ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM.",
                "guidedFixPrompt": "Type ISOLATE_COMPROMISED_HOSTS_FROM_THE_NETWORK_WITHOUT_POWERING_DOWN_TO_PRESERVE_VOLATILE_RAM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Defensive & Offensive Cybersecurity Operations Suite",
    "overviewMetaphor": "Final Capstone Synthesis: The complete sovereign enterprise cybersecurity operations and defensive architecture master suite: 1. Application & Network Defense; 2. Cryptographic Security & Identity; 3. Runtime Protection & Supply Chain; 4. Systems, SIEM & Intrusion Prevention; 5. Governance, Zero Trust & Forensics.",
    "blocks": [
      {
        "id": "cyber-d30-b1-sovereign-cyber-suite-orchestrator",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Cybersecurity Operations Master Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Sovereign Cybersecurity Operations Master Suite Orchestrator",
          "supportingTerms": [
            "Application Security Module",
            "Cryptographic Identity Module",
            "Runtime Defense Module",
            "Systems & SIEM Module",
            "Governance & Zero Trust Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d29-b3-containment-network-host-isolation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sovereign Enterprise Cybersecurity Defense Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Deploys WAF with STRIDE threat modeling, SQLi parameterization, XSS entity escaping & CSRF SameSite",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Validates AES-256-GCM AEAD ciphers, 64MB Argon2id password hashing & X.509 PKI certificate chains",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Enforces SSRF metadata filters, deserialization magic guards, Shannon entropy scanners & Token Bucket limiters",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Tracks heap pointer temporal safety, correlates SIEM brute-force attacks & drops packets with Snort NIDS",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Orchestrates CVSS v3.1 scoring, Zero Trust continuous verification, AWS IAM least privilege & Forensic hashes!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_cyber_orchestrator_demo.js",
            "initialCode": "function orchestrateCyberSuite(app, cry, run, sys, gov) {\n  const ok = app && cry && run && sys && gov;\n  return {\n    applicationSecurityModule: app,\n    cryptographicIdentityModule: cry,\n    runtimeDefenseModule: run,\n    systemsAndSiemModule: sys,\n    governanceAndZeroTrustModule: gov,\n    certified: ok,\n    status: ok ? 'SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(orchestrateCyberSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"applicationSecurityModule\":true,\"cryptographicIdentityModule\":true,\"runtimeDefenseModule\":true,\"systemsAndSiemModule\":true,\"governanceAndZeroTrustModule\":true,\"certified\":true,\"status\":\"SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that all 5 enterprise cybersecurity architecture modules are certified nominal?",
          "expectedStringOutput": "SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL",
            "status\":\"SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_CYBER_CAPSTONE_SOVEREIGN_CYBER_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CYBER_CAPSTONE_SOVEREIGN_CYBER_SUITE",
              "errorExplanation": "Matches SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SOVEREIGN_CYBERSECURITY_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d30-b2-capstone-audit-score",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Cybersecurity Architecture Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Capstone Audit Score Invariant",
          "supportingTerms": [
            "Score: 100/100",
            "Zero Defect Invariant",
            "Sovereign Tier Certification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d30-b1-sovereign-cyber-suite-orchestrator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_cyber_audit_score_demo.js",
            "initialCode": "function auditCyberCapstone() {\n  return {\n    certified: true,\n    score: '100/100',\n    tier: 'SOVEREIGN_CYBERSECURITY_ARCHITECT_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(auditCyberCapstone()));",
            "expectedOutput": "{\"certified\":true,\"score\":\"100/100\",\"tier\":\"SOVEREIGN_CYBERSECURITY_ARCHITECT_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit score is awarded upon completing the Sovereign Cybersecurity Capstone?",
          "expectedStringOutput": "100/100",
          "acceptableAnswers": [
            "100/100",
            "score\":\"100/100\"",
            "100"
          ],
          "primaryMisconceptionId": "MC_CYBER_CAPSTONE_SOVEREIGN_CYBER_SUITE",
          "diagnosisMap": {
            "90/100": {
              "misconceptionId": "MC_CYBER_CAPSTONE_SOVEREIGN_CYBER_SUITE",
              "errorExplanation": "Full verification achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 100/100"
              }
            }
          }
        }
      },
      {
        "id": "cyber-d30-b3-capstone-conferral",
        "day": 30,
        "blockNumber": 3,
        "title": "Conferral of Sovereign Cybersecurity Architect & Operations Specialist Credential",
        "conceptBudget": {
          "primaryConcept": "Sovereign Cybersecurity Architect Credential",
          "supportingTerms": [
            "Platform Mastery",
            "Application Security Specialization",
            "Enterprise Defense Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cyber-d30-b2-capstone-audit-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_cyber_conferral_demo.js",
            "initialCode": "console.log('🏆 CONFERRED: SOVEREIGN CYBERSECURITY ARCHITECT [PINIT CAREER OS v1.0 CERTIFIED]');",
            "expectedOutput": "🏆 CONFERRED: SOVEREIGN CYBERSECURITY ARCHITECT [PINIT CAREER OS v1.0 CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What credential title is officially conferred upon course graduation?",
          "expectedStringOutput": "🏆 CONFERRED: SOVEREIGN CYBERSECURITY ARCHITECT [PINIT CAREER OS v1.0 CERTIFIED]",
          "acceptableAnswers": [
            "🏆 CONFERRED: SOVEREIGN CYBERSECURITY ARCHITECT [PINIT CAREER OS v1.0 CERTIFIED]",
            "SOVEREIGN CYBERSECURITY ARCHITECT"
          ],
          "primaryMisconceptionId": "MC_CYBER_CAPSTONE_SOVEREIGN_CYBER_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CYBER_CAPSTONE_SOVEREIGN_CYBER_SUITE",
              "errorExplanation": "Matches conferral header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 CONFERRED: SOVEREIGN CYBERSECURITY ARCHITECT [PINIT CAREER OS v1.0 CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
