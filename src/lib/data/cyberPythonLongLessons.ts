/**
 * Cybersecurity in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const CYBER_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Information Security Core: CIA Triad & STRIDE Threat Modeling",
    "goal": "You can explain the CIA triad, model threats with STRIDE, score risks by likelihood and impact, and turn threat descriptions into categories and priorities with Python.",
    "minutes": 30,
    "recap": "Welcome to the course. Security is about protecting what matters from people who want to misuse it. Every lesson teaches how attacks work so you can recognise and stop them, with small Python tools that defenders really use.",
    "parts": [
      {
        "title": "What security protects: the CIA triad",
        "say": [
          "Security goals are usually described with three words: confidentiality, integrity and availability, the CIA triad.",
          "Confidentiality means only the right people can read information: salaries, medical records, passwords.",
          "Integrity means information is not changed without permission: an attacker should not be able to alter a bank transfer amount or a grade.",
          "Availability means systems work when they are needed: a hospital system that is down during an emergency has failed, even if no data leaked.",
          "Every security incident harms at least one of the three, and naming which one helps decide the response.",
          "Some frameworks add authenticity (knowing who did something) and non-repudiation (they cannot deny it later).",
          "The example maps incidents to the properties they harm.",
          "Thinking in these terms turns vague worry (\"is it secure?\") into specific questions.",
          "Different organisations weigh the three differently: a news site cares most about availability, a bank about integrity."
        ],
        "example": "A bank locker: only you can open it (confidentiality), nobody can swap its contents (integrity), and the bank is open when you need it (availability).",
        "code": "incidents = {\n    \"customer list emailed to the wrong person\": [\"confidentiality\"],\n    \"attacker changes a delivery address\": [\"integrity\"],\n    \"website down during a sale\": [\"availability\"],\n    \"ransomware encrypts files and threatens to leak them\": [\"availability\", \"confidentiality\"],\n}\nfor incident, harmed in incidents.items():\n    print(f\"{incident:52} -> {', '.join(harmed)}\")",
        "output": "customer list emailed to the wrong person            -> confidentiality\nattacker changes a delivery address                  -> integrity\nwebsite down during a sale                           -> availability\nransomware encrypts files and threatens to leak them -> availability, confidentiality",
        "codeNotes": [
          {
            "line": 5,
            "note": "Some incidents harm more than one property."
          }
        ],
        "tryIt": "Which property does a fake login page that steals passwords harm first?",
        "check": {
          "question": "A tampered exam result harms which property?",
          "options": [
            "Confidentiality",
            "Integrity",
            "Availability"
          ],
          "answer": 1,
          "why": "Unauthorised changes break integrity."
        }
      },
      {
        "title": "Threat modelling with STRIDE",
        "say": [
          "Threat modelling means systematically asking \"what could go wrong?\" before attackers do, ideally while designing a system.",
          "STRIDE, created at Microsoft, gives six categories: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service and Elevation of privilege.",
          "Spoofing is pretending to be someone else; tampering is changing data; repudiation is denying an action with no proof; information disclosure is leaking data; denial of service is making something unavailable; elevation of privilege is gaining powers you should not have.",
          "Each category maps to a defence: authentication for spoofing, integrity checks for tampering, audit logs for repudiation, encryption and access control for disclosure, rate limits for denial of service, and authorisation for elevation.",
          "Practice 1 is stride_categories(description), which tags a threat description with categories using keyword stems.",
          "Keyword tagging is rough, but it helps sort large lists of findings quickly, which is how many teams start.",
          "The example tags three threat descriptions.",
          "Drawing a simple diagram of your system and asking STRIDE questions at each connection is a classic way to run a threat modelling session.",
          "Doing this early is far cheaper than fixing a design flaw after launch."
        ],
        "example": "A home security review: checking every door, window and key, and asking how each could be misused.",
        "code": "STRIDE = [(\"Spoofing\", [\"impersonat\", \"spoof\"]), (\"Tampering\", [\"modif\", \"alter\"]),\n          (\"Repudiation\", [\"no audit\"]), (\"Information Disclosure\", [\"leak\", \"expos\"]),\n          (\"Denial of Service\", [\"flood\", \"crash\"]), (\"Elevation of Privilege\", [\"escalat\", \"admin\"])]\nthreats = [\"Attacker impersonates support staff\", \"Debug page exposes API keys\", \"Bot flood crashes the checkout\"]\nfor t in threats:\n    low = t.lower()\n    print(f\"{t:38} -> {[n for n, stems in STRIDE if any(s in low for s in stems)]}\")",
        "output": "Attacker impersonates support staff    -> ['Spoofing']\nDebug page exposes API keys            -> ['Information Disclosure']\nBot flood crashes the checkout         -> ['Denial of Service']",
        "codeNotes": [
          {
            "line": 7,
            "note": "Stems like \"expos\" match exposes, exposed and exposure."
          }
        ],
        "tryIt": "Write a threat for your college or company portal and tag it by hand with STRIDE.",
        "check": {
          "question": "Which STRIDE category is \"a user gains admin powers through a bug\"?",
          "options": [
            "Spoofing",
            "Elevation of privilege",
            "Repudiation"
          ],
          "answer": 1,
          "why": "Gaining powers you should not have is elevation of privilege."
        }
      },
      {
        "title": "Risk: likelihood times impact",
        "say": [
          "Not every threat deserves the same attention. Risk combines how likely something is and how bad it would be.",
          "A common scale rates likelihood and impact from 1 (rare, minor) to 5 (almost certain, severe), and multiplies them.",
          "Practice 2 is risk_score(likelihood, impact), which returns the score and a level: LOW, MEDIUM, HIGH or CRITICAL.",
          "Risk matrices are simple and subjective, but they make priorities explicit and easy to discuss.",
          "Risks can be reduced (add a control), transferred (insurance), avoided (drop the feature) or accepted (document and live with it).",
          "The example ranks a few risks for a small online shop.",
          "Revisit risk scores as the business changes: a new payment feature can turn a low risk into a critical one.",
          "Validating inputs in the scoring function matters: a typo like 6 on a 1-5 scale should be caught, not silently accepted.",
          "Keeping a risk register, a shared list of risks with owners and actions, turns this analysis into follow-up work."
        ],
        "example": "Deciding which roof leak to fix first: the one over the server room beats the one over the bike shed.",
        "code": "def level(score):\n    return \"LOW\" if score <= 5 else \"MEDIUM\" if score <= 12 else \"HIGH\" if score <= 19 else \"CRITICAL\"\n\nrisks = {\"card data stolen\": (3, 5), \"site defaced\": (2, 3), \"admin password guessed\": (4, 5), \"newsletter typo\": (5, 1)}\nfor name, (l, i) in sorted(risks.items(), key=lambda kv: -kv[1][0] * kv[1][1]):\n    print(f\"{name:24} {l} x {i} = {l * i:2} {level(l * i)}\")",
        "output": "admin password guessed   4 x 5 = 20 CRITICAL\ncard data stolen         3 x 5 = 15 HIGH\nsite defaced             2 x 3 =  6 MEDIUM\nnewsletter typo          5 x 1 =  5 LOW",
        "codeNotes": [
          {
            "line": 5,
            "note": "Highest score first."
          }
        ],
        "tryIt": "Which control would most reduce the top risk: better passwords, MFA or both?",
        "check": {
          "question": "A risk rated likelihood 4 and impact 5 scores?",
          "options": [
            "9",
            "20",
            "45"
          ],
          "answer": 1,
          "why": "4 × 5 = 20, which is critical."
        }
      },
      {
        "title": "Defence in depth",
        "say": [
          "No single control is perfect, so security uses layers: if one fails, the next still protects.",
          "For a web app, layers might include input validation, parameterised queries, a web application firewall, least-privilege database accounts, encryption, monitoring and backups.",
          "Attackers need to beat every layer; defenders need only one layer to hold at the right moment.",
          "Layers should be independent: two checks that share the same bug are really one layer.",
          "The principle of least privilege says every user and program should have only the access it needs, which limits the damage when something is compromised.",
          "The example counts how many layers stop each simulated attack.",
          "Throughout the course, each lesson adds a new layer you can build and test in Python.",
          "Secure defaults, where the safe option is what happens unless someone deliberately changes it, make every layer stronger.",
          "Assume breach is a related mindset: design as if an attacker is already inside, and limit what they could reach."
        ],
        "example": "A castle with a moat, walls, guards and a locked keep: getting past one does not mean getting in.",
        "code": "layers = {\"input validation\": {\"sqli\", \"xss\"}, \"parameterised queries\": {\"sqli\"},\n          \"WAF\": {\"sqli\", \"xss\", \"traversal\"}, \"least privilege DB user\": {\"sqli\"}}\nfor attack in [\"sqli\", \"xss\", \"traversal\", \"phishing\"]:\n    stopping = [name for name, stops in layers.items() if attack in stops]\n    print(f\"{attack:10} stopped by {len(stopping)} layer(s): {stopping}\")",
        "output": "sqli       stopped by 4 layer(s): ['input validation', 'parameterised queries', 'WAF', 'least privilege DB user']\nxss        stopped by 2 layer(s): ['input validation', 'WAF']\ntraversal  stopped by 1 layer(s): ['WAF']\nphishing   stopped by 0 layer(s): []",
        "codeNotes": [
          {
            "line": 4,
            "note": "List every layer that would stop this attack."
          }
        ],
        "tryIt": "Phishing is stopped by no layer here. What layers would you add?",
        "check": {
          "question": "Why use defence in depth?",
          "options": [
            "It is cheaper",
            "If one control fails, others still protect",
            "Attackers prefer it"
          ],
          "answer": 1,
          "why": "Layers cover each other's gaps."
        }
      },
      {
        "title": "Ethics and the law",
        "say": [
          "Security skills can protect or harm. This course teaches how attacks work so you can defend against them.",
          "Only test systems you own or have written permission to test. In India, the Information Technology Act, 2000 makes unauthorised access a crime, and most countries have similar laws.",
          "Companies run bug bounty programmes that invite testing within published rules; that is the legal way to practise on real systems.",
          "Practice labs, deliberately vulnerable apps and capture-the-flag competitions exist for learning safely.",
          "If you find a vulnerability by accident, report it responsibly to the owner and do not exploit or publicise it before it is fixed.",
          "The example checks a planned test against a simple scope file, as professional testers do.",
          "Trust is the foundation of the security profession; one reckless action can end a career.",
          "Keeping written records of permission and scope protects you as well as the client.",
          "When unsure whether something is allowed, stop and ask the system owner first."
        ],
        "example": "A locksmith's licence: the same skills that open doors for owners would be burglary without permission.",
        "code": "scope = {\"in\": {\"staging.shop.example\", \"api-staging.shop.example\"}, \"out\": {\"shop.example\", \"payments.shop.example\"}}\nfor target in [\"staging.shop.example\", \"payments.shop.example\", \"random-site.example\"]:\n    if target in scope[\"in\"]:\n        verdict = \"allowed\"\n    elif target in scope[\"out\"]:\n        verdict = \"explicitly OUT of scope\"\n    else:\n        verdict = \"not authorised\"\n    print(f\"{target:26} {verdict}\")",
        "output": "staging.shop.example       allowed\npayments.shop.example      explicitly OUT of scope\nrandom-site.example        not authorised",
        "codeNotes": [
          {
            "line": 7,
            "note": "Anything not listed is not authorised."
          }
        ],
        "tryIt": "What should you do if a test accidentally reaches an out-of-scope system?",
        "check": {
          "question": "When is it legal to test a system for vulnerabilities?",
          "options": [
            "Whenever you are curious",
            "Only with the owner's permission, within agreed scope",
            "If it is a big company"
          ],
          "answer": 1,
          "why": "Authorisation and scope are essential."
        }
      },
      {
        "title": "Practice time: STRIDE and risk",
        "say": [
          "Practice 1: stride_categories(description). Keep the six categories in STRIDE order with their stems, lower-case the description, and return the names whose stems appear.",
          "The checks include two categories in one description, capital letters, and a harmless description that matches nothing.",
          "Practice 2: risk_score(likelihood, impact). Reject anything that is not an integer from 1 to 5 (booleans and floats too), multiply, and map the score to LOW (1-5), MEDIUM (6-12), HIGH (13-19) or CRITICAL (20-25).",
          "After passing, combine them: tag five threats for a system you know, score each, and sort them into a small risk register.",
          "The example prints such a register.",
          "Tomorrow you will meet one of the most damaging web attacks, SQL injection, and the simple habit that prevents it.",
          "Keep your risk register; later lessons add controls that lower its scores.",
          "Good security work is often this unglamorous: careful lists, clear priorities and steady follow-up.",
          "Sharing the register with developers and managers makes security a team responsibility rather than one person's worry."
        ],
        "example": "A doctor's triage desk: identify each problem, judge how serious it is, and treat the worst first.",
        "code": "register = [(\"Admin panel exposed to the internet\", 4, 5), (\"Order data modified in transit\", 2, 4),\n            (\"Checkout flooded by bots\", 3, 3)]\nfor threat, l, i in sorted(register, key=lambda r: -r[1] * r[2]):\n    s = l * i\n    lvl = \"LOW\" if s <= 5 else \"MEDIUM\" if s <= 12 else \"HIGH\" if s <= 19 else \"CRITICAL\"\n    print(f\"{s:2} {lvl:8} {threat}\")",
        "output": "20 CRITICAL Admin panel exposed to the internet\n 9 MEDIUM   Checkout flooded by bots\n 8 MEDIUM   Order data modified in transit",
        "codeNotes": [
          {
            "line": 3,
            "note": "Sort by score, highest first."
          }
        ],
        "tryIt": "Which STRIDE category does each of these threats belong to?",
        "check": {
          "question": "risk_score(3, 6) should?",
          "options": [
            "Return 18",
            "Raise ValueError",
            "Return CRITICAL"
          ],
          "answer": 1,
          "why": "Impact must be from 1 to 5."
        }
      }
    ],
    "summary": [
      "Security protects confidentiality, integrity and availability.",
      "STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.",
      "Risk = likelihood × impact; treat the highest risks first.",
      "Use defence in depth and least privilege.",
      "Only test with permission, within scope, and report responsibly."
    ],
    "projectStep": {
      "title": "Threat model and risk register",
      "steps": [
        "Draw a simple system you use and list five threats with STRIDE.",
        "Score each with risk_score and sort them.",
        "Propose one control per threat and note which layer it adds."
      ]
    }
  },
  {
    "day": 2,
    "title": "Web Security: SQL Injection (SQLi) & Parameterized Queries",
    "goal": "You can explain how SQL injection works, prevent it with parameterised queries and identifier validation, detect common injection patterns as an extra alarm, and apply least privilege to database accounts.",
    "minutes": 30,
    "recap": "Yesterday you learned to think about threats. Today you study one of the oldest and most damaging web attacks, and the simple habit that stops it.",
    "parts": [
      {
        "title": "How SQL injection happens",
        "say": [
          "Many applications build database queries by gluing user input into SQL text, for example \"SELECT * FROM users WHERE email = '\" + email + \"'\".",
          "If the input contains SQL syntax, the database cannot tell data from code. An input like x' OR '1'='1 turns the condition into one that is always true.",
          "The result can be a login bypass, a dump of the whole table, changed records, or worse.",
          "SQL injection has been behind huge data breaches for over two decades and still appears in the OWASP Top 10 under \"Injection\".",
          "The root cause is mixing code and data in one string. Every fix separates them.",
          "The example shows, as plain strings, how the attacker's input changes the meaning of a glued query. Nothing is executed.",
          "Recognising this pattern in code reviews is a key skill for every developer.",
          "The same mistake appears with other interpreters too: shell commands, LDAP queries and template engines.",
          "Once you understand this one idea, code versus data, many other injection attacks become easy to spot."
        ],
        "example": "A form letter where someone writes \"and also give me the keys\" in the name box, and the clerk reads it out as part of the instructions.",
        "code": "def glued_query(email):\n    return \"SELECT * FROM users WHERE email = '\" + email + \"'\"\n\nprint(glued_query(\"asha@example.com\"))\nprint(glued_query(\"x' OR '1'='1\"))\nprint(\"the second query is true for every row: the input changed the SQL itself\")",
        "output": "SELECT * FROM users WHERE email = 'asha@example.com'\nSELECT * FROM users WHERE email = 'x' OR '1'='1'\nthe second query is true for every row: the input changed the SQL itself",
        "codeNotes": [
          {
            "line": 2,
            "note": "Gluing input into SQL text is the mistake."
          },
          {
            "line": 5,
            "note": "The input closes the quote and adds its own condition."
          }
        ],
        "tryIt": "What would the query look like for the input O'Brien? Why does even a legitimate name break it?",
        "check": {
          "question": "What is the root cause of SQL injection?",
          "options": [
            "Weak passwords",
            "Mixing user data into SQL code as text",
            "Slow databases"
          ],
          "answer": 1,
          "why": "Code and data must be kept separate."
        }
      },
      {
        "title": "Parameterised queries",
        "say": [
          "The fix is parameterised queries (also called prepared statements): the SQL text contains placeholders such as ?, and the values are sent separately.",
          "The database parses the SQL first, then treats each value strictly as data, so an input can never change the query's structure.",
          "In Python's sqlite3, psycopg and most other drivers, you pass the values as a tuple next to the SQL string.",
          "Practice 1 is build_query(table, filters), which produces SQL with placeholders plus a tuple of values.",
          "ORMs (object-relational mappers) such as SQLAlchemy and Django parameterise for you, but raw SQL snippets inside them can reintroduce the problem.",
          "The example shows the query and values staying separate even for a malicious input.",
          "This one habit, always parameterise, eliminates the vast majority of SQL injection.",
          "Parameterised queries also handle legitimate apostrophes, like O'Brien, correctly, so they fix bugs as well as security holes.",
          "Many databases can also reuse the parsed query, so parameterising can even improve performance."
        ],
        "example": "A bank form with separate boxes for the amount and the account number: whatever you write in a box, it stays in that box.",
        "code": "def build(table, filters):\n    sql = f\"SELECT * FROM {table}\"\n    if filters:\n        sql += \" WHERE \" + \" AND \".join(f\"{col} = ?\" for col in filters)\n    return sql, tuple(filters.values())\n\nsql, params = build(\"users\", {\"email\": \"x' OR '1'='1\"})\nprint(sql)\nprint(params)",
        "output": "SELECT * FROM users WHERE email = ?\n(\"x' OR '1'='1\",)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only placeholders go into the SQL text."
          },
          {
            "line": 5,
            "note": "Values travel separately."
          }
        ],
        "tryIt": "Why is the table name in this function still a risk? (Hint: part 3.)",
        "check": {
          "question": "How do parameterised queries prevent injection?",
          "options": [
            "They encrypt the query",
            "Values are sent separately and treated only as data",
            "They block quotes"
          ],
          "answer": 1,
          "why": "The query structure is fixed before values arrive."
        }
      },
      {
        "title": "Identifiers cannot be parameters",
        "say": [
          "Placeholders work only for values. Table names, column names and sort directions cannot be parameterised in most databases.",
          "If users can choose a column to sort by, you must validate it strictly, ideally against an allow-list of known column names.",
          "A regular expression such as [A-Za-z_][A-Za-z0-9_]* (letters, digits and underscores, not starting with a digit) is a reasonable fallback check.",
          "Practice 1 rejects any table or column name that does not fully match this pattern, raising ValueError.",
          "Using re.fullmatch is essential: re.match would accept \"users; DROP TABLE users\" because the start of it is valid.",
          "The example validates several candidate identifiers.",
          "Allow-lists beat block-lists: listing what is permitted is safer than guessing everything that is dangerous.",
          "The same rule applies to sort direction: accept only ASC or DESC, never the raw user text.",
          "When in doubt, map user choices to fixed strings in your code, such as \"newest\" to \"created_at DESC\"."
        ],
        "example": "A menu where you can only choose dishes that are printed on it, not write in your own instructions to the kitchen.",
        "code": "import re\n\nIDENT = r\"[A-Za-z_][A-Za-z0-9_]*\"\nfor name in [\"users\", \"order_items\", \"users; DROP TABLE users\", \"1users\", \"email OR 1=1\"]:\n    print(f\"{name!r:28} fullmatch: {bool(re.fullmatch(IDENT, name))}  match: {bool(re.match(IDENT, name))}\")",
        "output": "'users'                      fullmatch: True  match: True\n'order_items'                fullmatch: True  match: True\n'users; DROP TABLE users'    fullmatch: False  match: True\n'1users'                     fullmatch: False  match: False\n'email OR 1=1'               fullmatch: False  match: True",
        "codeNotes": [
          {
            "line": 5,
            "note": "match accepts a valid prefix; fullmatch requires the whole string."
          }
        ],
        "tryIt": "Why would re.match be a dangerous choice here?",
        "check": {
          "question": "Which can be sent as a query parameter?",
          "options": [
            "A table name",
            "A value such as an email address",
            "A column name"
          ],
          "answer": 1,
          "why": "Only values can be parameterised."
        }
      },
      {
        "title": "Detection as an extra alarm",
        "say": [
          "Detection does not replace prevention, but it warns you that someone is probing your application.",
          "Common injection signals include a quote followed by OR, SQL comment markers (-- and /*), statement separators (;) and UNION SELECT.",
          "Practice 2 is sqli_signals(value), which returns the signals found in a string.",
          "Detection must avoid false alarms: the name O'Brien contains a quote, and the word \"Pune\" contains \"un\", so patterns must be precise.",
          "Web application firewalls (Day 5) use thousands of such rules, tuned to balance missed attacks against blocked customers.",
          "The example checks a few inputs and shows which signals fire.",
          "Signals are best logged and monitored, rather than used alone to block users.",
          "Attackers obfuscate payloads, for example with odd capitalisation or extra spaces, which is why patterns use case-insensitive matching and \\s+.",
          "Seeing many signals from one address in a short time is a strong sign of an automated scanner."
        ],
        "example": "A smoke detector: it does not stop fires, but it tells you to act before the damage spreads.",
        "code": "import re\n\ndef signals(v):\n    low, found = v.lower(), []\n    if re.search(r\"'\\s*or\\s\", low): found.append(\"QUOTE_OR\")\n    if \"--\" in low or \"/*\" in low: found.append(\"COMMENT\")\n    if re.search(r\"union\\s+select\", low): found.append(\"UNION\")\n    return found\n\nfor v in [\"admin' OR 1=1 --\", \"O'Brien\", \"1 UNION SELECT card FROM payments\", \"Priya from Pune\"]:\n    print(f\"{v!r:40} {signals(v)}\")",
        "output": "\"admin' OR 1=1 --\"                       ['QUOTE_OR', 'COMMENT']\n\"O'Brien\"                                []\n'1 UNION SELECT card FROM payments'      ['UNION']\n'Priya from Pune'                        []",
        "codeNotes": [
          {
            "line": 5,
            "note": "A quote followed by OR and whitespace."
          }
        ],
        "tryIt": "Why does \"O'Brien\" not trigger QUOTE_OR?",
        "check": {
          "question": "What is the main role of injection detection?",
          "options": [
            "Replacing parameterised queries",
            "Alerting defenders to probing as an extra layer",
            "Fixing the query"
          ],
          "answer": 1,
          "why": "Detection complements prevention."
        }
      },
      {
        "title": "Least privilege for databases",
        "say": [
          "Even with perfect code, assume a bug will slip through someday, and limit what it could do.",
          "The application's database account should have only the permissions it needs: often SELECT, INSERT and UPDATE on specific tables, never DROP or access to other databases.",
          "Separate accounts for separate jobs, such as a read-only reporting account, limit the blast radius further.",
          "Sensitive columns such as passwords must be hashed (Day 7), so even a leaked table does not reveal them.",
          "Database activity monitoring can alert on unusual queries, such as a sudden export of an entire customer table.",
          "The example checks requested statements against an account's allowed privileges.",
          "Least privilege turns a potential catastrophe into a contained incident.",
          "Rotate database passwords regularly and store them in a secrets manager, not in the code (Day 18).",
          "Backups, tested regularly, are the final layer if data is destroyed."
        ],
        "example": "Giving a delivery driver the key to the loading dock, not to the whole building.",
        "code": "granted = {\"app_user\": {\"SELECT\", \"INSERT\", \"UPDATE\"}, \"report_user\": {\"SELECT\"}}\nattempts = [(\"app_user\", \"SELECT\"), (\"app_user\", \"DROP\"), (\"report_user\", \"UPDATE\")]\nfor account, statement in attempts:\n    ok = statement in granted[account]\n    print(f\"{account:11} {statement:6} -> {'allowed' if ok else 'DENIED'}\")",
        "output": "app_user    SELECT -> allowed\napp_user    DROP   -> DENIED\nreport_user UPDATE -> DENIED",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only explicitly granted statements are allowed."
          }
        ],
        "tryIt": "Which account would an injected DROP TABLE fail under, and why is that valuable?",
        "check": {
          "question": "What does least privilege achieve for a database?",
          "options": [
            "Faster queries",
            "A successful attack can do far less damage",
            "No need for parameterisation"
          ],
          "answer": 1,
          "why": "It limits the blast radius."
        }
      },
      {
        "title": "Practice time: build and detect",
        "say": [
          "Practice 1: build_query(table, filters). Validate the table and every column with re.fullmatch against the identifier pattern (ValueError otherwise), build \"SELECT * FROM table\" plus \" WHERE col = ? AND ...\" when there are filters, and return the SQL with a tuple of values.",
          "The checks include an injection string as a value (which must stay a value), a malicious table name, a malicious column name and a name starting with a digit.",
          "Practice 2: sqli_signals(value). Lower-case the value, check the four patterns, and return the sorted list of signal names.",
          "The checks include a classic login bypass, a UNION attack, stacked statements, and two harmless inputs that must not trigger.",
          "After passing, run sqli_signals on a list of real names and addresses to confirm there are no false alarms.",
          "The example runs the two functions together on a mix of inputs.",
          "Tomorrow you move from the database to the browser: cross-site scripting.",
          "Keep build_query: using it everywhere is the easiest way to never write an injectable query.",
          "In code reviews, search for SQL built with + or f-strings; each one deserves a second look."
        ],
        "example": "A bouncer who checks the guest list (validation) and a camera that records trouble-makers (detection).",
        "code": "import re\n\nIDENT = r\"[A-Za-z_][A-Za-z0-9_]*\"\nfilters = {\"city\": \"Pune\", \"name\": \"x' OR 1=1 --\"}\nassert all(re.fullmatch(IDENT, c) for c in filters)\nsql = \"SELECT * FROM customers WHERE \" + \" AND \".join(f\"{c} = ?\" for c in filters)\nprint(sql, tuple(filters.values()))\nprint(\"alarm for name value:\", bool(re.search(r\"'\\s*or\\s\", filters[\"name\"].lower())))",
        "output": "SELECT * FROM customers WHERE city = ? AND name = ? ('Pune', \"x' OR 1=1 --\")\nalarm for name value: True",
        "codeNotes": [
          {
            "line": 6,
            "note": "Safe query."
          },
          {
            "line": 8,
            "note": "The value still raises an alarm for monitoring."
          }
        ],
        "tryIt": "Is the query safe even though the alarm fired? Explain why.",
        "check": {
          "question": "build_query(\"users\", {\"name OR 1=1\": \"x\"}) should?",
          "options": [
            "Return a query",
            "Raise ValueError",
            "Escape the column"
          ],
          "answer": 1,
          "why": "Column names must match the identifier pattern."
        }
      }
    ],
    "summary": [
      "SQL injection happens when user input is glued into SQL text.",
      "Parameterised queries keep values separate from code and stop it.",
      "Identifiers cannot be parameters: validate them with re.fullmatch or allow-lists.",
      "Detection signals are an extra alarm, not a replacement.",
      "Least-privilege database accounts limit the damage of any breach."
    ],
    "projectStep": {
      "title": "Injection-proof data layer",
      "steps": [
        "Implement build_query and sqli_signals.",
        "Review a sample of old code for glued SQL and rewrite it.",
        "Design least-privilege accounts for an app and a reporting tool."
      ]
    }
  },
  {
    "day": 3,
    "title": "Client-Side Security: Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
    "goal": "You can explain stored, reflected and DOM-based cross-site scripting, escape output correctly for HTML, build a Content Security Policy that blocks inline scripts, and recognise unsafe patterns.",
    "minutes": 30,
    "recap": "Yesterday injection targeted the database. Today the same mistake, mixing data and code, targets your users' browsers: cross-site scripting (XSS).",
    "parts": [
      {
        "title": "What XSS is",
        "say": [
          "Cross-site scripting happens when a website includes untrusted text in a page in a way that the browser treats as code.",
          "If a comment containing <script>...</script> is shown to other users without escaping, their browsers run the attacker's script as if it came from the site.",
          "That script can read what the page shows, act as the user, steal session tokens that are not HttpOnly (Day 4), or show fake login forms.",
          "Stored XSS saves the payload (for example in a comment); reflected XSS bounces it from a link's query string; DOM-based XSS happens entirely in client-side JavaScript.",
          "XSS is one of the most common web vulnerabilities, part of \"Injection\" in the OWASP Top 10.",
          "The example shows how a harmless-looking template turns a comment into markup, as plain text only.",
          "The fix is the same idea as yesterday: keep data as data by escaping it for the context where it appears.",
          "Modern frameworks such as React escape text automatically, but features that insert raw HTML bypass that protection.",
          "User profiles, comments, search pages and error messages are the most common places to find XSS."
        ],
        "example": "A noticeboard where someone pins a note that, when read aloud, instructs the reader to hand over their keys.",
        "code": "template = \"<p>Latest comment: {comment}</p>\"\ncomment = \"Great post! <script>sendCookies()</script>\"\nprint(template.format(comment=comment))\nprint(\"a browser would treat the script tag as code, not as text\")",
        "output": "<p>Latest comment: Great post! <script>sendCookies()</script></p>\na browser would treat the script tag as code, not as text",
        "codeNotes": [
          {
            "line": 3,
            "note": "The comment becomes part of the page's markup."
          }
        ],
        "tryIt": "Where else, besides comments, might user text appear on a page?",
        "check": {
          "question": "What is stored XSS?",
          "options": [
            "A slow database",
            "A malicious script saved by the site and shown to other users",
            "An encrypted page"
          ],
          "answer": 1,
          "why": "The payload is stored and served to victims."
        }
      },
      {
        "title": "Escaping output",
        "say": [
          "Escaping replaces characters that have special meaning in HTML with harmless entities, so the browser displays them instead of interpreting them.",
          "& becomes &amp;, < becomes &lt;, > becomes &gt;, \" becomes &quot; and ' becomes &#x27;.",
          "The ampersand must be replaced first; otherwise the & in the other entities would be escaped again, producing &amp;lt;.",
          "Practice 1 is escape_html(text). Python's html.escape does the same job and is what you should use in real code.",
          "Escaping is context-specific: text inside HTML, inside an attribute, inside a URL or inside JavaScript each need different treatment.",
          "The example escapes the malicious comment and shows the safe result.",
          "Escape at output time, where you know the context, rather than trying to clean input once when it arrives.",
          "Template engines such as Jinja2 escape by default; the danger comes from marking text as safe when it is not.",
          "Never try to write your own HTML sanitiser for rich text; use a maintained library that keeps an allow-list of safe tags."
        ],
        "example": "Writing a recipe that mentions \"a pinch of <salt>\" in quotation marks, so the printer prints it rather than obeying it.",
        "code": "def escape_html(text):\n    return (text.replace(\"&\", \"&amp;\").replace(\"<\", \"&lt;\").replace(\">\", \"&gt;\")\n                .replace('\"', \"&quot;\").replace(\"'\", \"&#x27;\"))\n\ncomment = \"Great post! <script>sendCookies()</script>\"\nprint(\"<p>\" + escape_html(comment) + \"</p>\")\nprint(escape_html(\"Tom & \\\"Jerry\\\"\"))",
        "output": "<p>Great post! &lt;script&gt;sendCookies()&lt;/script&gt;</p>\nTom &amp; &quot;Jerry&quot;",
        "codeNotes": [
          {
            "line": 2,
            "note": "The ampersand goes first."
          }
        ],
        "tryIt": "What would go wrong if < were replaced before &?",
        "check": {
          "question": "Why must & be escaped first?",
          "options": [
            "It is most common",
            "Otherwise the & in new entities would be escaped again",
            "Browsers require alphabetical order"
          ],
          "answer": 1,
          "why": "Order prevents double escaping."
        }
      },
      {
        "title": "Content Security Policy",
        "say": [
          "Content Security Policy (CSP) is a response header that tells the browser which sources of scripts, styles, images and other resources are allowed.",
          "A policy such as \"script-src 'self'\" means only scripts loaded from your own site may run; inline scripts injected by an attacker are blocked.",
          "CSP is a second layer: if escaping fails somewhere, the browser still refuses to run the injected script.",
          "The source 'unsafe-inline' re-allows inline scripts and removes most of this protection, so avoid it for scripts.",
          "Practice 2 is csp_header(policy), which builds the header string and refuses policies that allow inline scripts.",
          "If script-src is not set, the browser falls back to default-src, so the check must look there too.",
          "The example builds a policy for a site that loads scripts from a CDN.",
          "Start with a report-only policy (Content-Security-Policy-Report-Only) to see what would break before enforcing it.",
          "Nonces or hashes let specific, trusted inline scripts run without opening the door to all of them."
        ],
        "example": "A guest list at the door: even if someone sneaks an invitation into your mailbox, the guard only admits names on the list.",
        "code": "policy = {\"default-src\": [\"'self'\"], \"script-src\": [\"'self'\", \"https://cdn.example.com\"], \"img-src\": [\"'self'\", \"data:\"]}\nheader = \"; \".join(f\"{name} {' '.join(sources)}\" for name, sources in policy.items())\nprint(\"Content-Security-Policy:\", header)\nscripts = policy.get(\"script-src\", policy.get(\"default-src\", []))\nprint(\"inline scripts allowed:\", \"'unsafe-inline'\" in scripts)",
        "output": "Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; img-src 'self' data:\ninline scripts allowed: False",
        "codeNotes": [
          {
            "line": 4,
            "note": "script-src falls back to default-src."
          }
        ],
        "tryIt": "What would you add to allow images from a photo CDN?",
        "check": {
          "question": "What does \"script-src 'self'\" do?",
          "options": [
            "Allows all scripts",
            "Allows only scripts from your own origin, blocking injected inline scripts",
            "Disables JavaScript"
          ],
          "answer": 1,
          "why": "Scripts must come from trusted sources."
        }
      },
      {
        "title": "Dangerous patterns in code",
        "say": [
          "Some code patterns almost always lead to XSS when used with user input.",
          "In browser code: assigning to innerHTML, document.write, and building HTML strings by concatenation.",
          "In React: dangerouslySetInnerHTML with unsanitised content. In Python templates: disabling autoescaping or using the |safe filter on user text.",
          "URLs are a special case: a link to \"javascript:...\" runs code when clicked, so user-supplied URLs must be checked to start with http:// or https://.",
          "Event handler attributes such as onerror= and onclick= inside user content are another classic vector.",
          "The example scans code snippets for risky patterns, the way a linter does.",
          "Automated scanners flag these patterns, but a human must decide whether the input can be controlled by users.",
          "Keeping all HTML generation inside a template system, rather than scattered string building, makes review much easier.",
          "When a risky pattern is truly needed, sanitise with a trusted library and leave a comment explaining why it is safe."
        ],
        "example": "Warning signs on a building site: not every sign means danger right now, but each one deserves a careful look.",
        "code": "RISKY = [\"innerHTML\", \"document.write\", \"dangerouslySetInnerHTML\", \"|safe\", \"javascript:\"]\nsnippets = [\"el.textContent = comment\", \"el.innerHTML = comment\", \"<a href='{{ url }}'>\", \"{{ bio|safe }}\"]\nfor s in snippets:\n    hits = [r for r in RISKY if r in s]\n    print(f\"{s:28} {'REVIEW ' + str(hits) if hits else 'ok'}\")",
        "output": "el.textContent = comment     ok\nel.innerHTML = comment       REVIEW ['innerHTML']\n<a href='{{ url }}'>         ok\n{{ bio|safe }}               REVIEW ['|safe']",
        "codeNotes": [
          {
            "line": 4,
            "note": "Simple pattern matching flags code for review."
          }
        ],
        "tryIt": "Why is the <a href> line risky even though it was not flagged?",
        "check": {
          "question": "Why are user-supplied links dangerous?",
          "options": [
            "They are long",
            "A javascript: URL can run code when clicked",
            "Links are always unsafe"
          ],
          "answer": 1,
          "why": "URLs need scheme validation."
        }
      },
      {
        "title": "Protecting sessions from XSS",
        "say": [
          "The most common goal of XSS is stealing the user's session, which lets the attacker act as them.",
          "Marking session cookies HttpOnly means JavaScript cannot read them, so an injected script cannot simply copy them.",
          "HttpOnly does not stop everything: the script can still act within the page as the user, so preventing XSS remains essential.",
          "Short session lifetimes and re-authentication for sensitive actions (such as changing a password) limit the damage further.",
          "Storing tokens in localStorage exposes them to any script on the page, which is why HttpOnly cookies are often preferred.",
          "The example compares which data an injected script could read under two cookie settings.",
          "Layered defences, escaping, CSP and HttpOnly, together make XSS far less damaging.",
          "Monitoring for unusual session activity, such as a session suddenly used from a new country, adds detection on top.",
          "Tomorrow's lesson covers the other cookie flags, Secure and SameSite, and the attack they stop."
        ],
        "example": "Keeping your house keys in a locked drawer: a burglar who gets into the hall still cannot take them.",
        "code": "cookies = [{\"name\": \"session\", \"http_only\": True}, {\"name\": \"theme\", \"http_only\": False},\n           {\"name\": \"cart\", \"http_only\": False}]\nreadable = [c[\"name\"] for c in cookies if not c[\"http_only\"]]\nprint(\"an injected script could read:\", readable)\nprint(\"session cookie protected:\", \"session\" not in readable)",
        "output": "an injected script could read: ['theme', 'cart']\nsession cookie protected: True",
        "codeNotes": [
          {
            "line": 3,
            "note": "Only non-HttpOnly cookies are visible to scripts."
          }
        ],
        "tryIt": "Should the cart cookie be HttpOnly? What would break if it were?",
        "check": {
          "question": "What does the HttpOnly cookie flag do?",
          "options": [
            "Encrypts the cookie",
            "Prevents JavaScript from reading the cookie",
            "Sends it only over HTTP"
          ],
          "answer": 1,
          "why": "Scripts cannot access HttpOnly cookies."
        }
      },
      {
        "title": "Practice time: escape and CSP",
        "say": [
          "Practice 1: escape_html(text). Chain replacements in the right order: &, <, >, \", '.",
          "The checks include a script tag, quotes and ampersands, a single quote, an existing entity (escaped once as text) and plain text.",
          "Practice 2: csp_header(policy). Find the script sources (script-src, else default-src); raise ValueError if they include 'unsafe-inline'; otherwise join directives as \"name source source\" with \"; \".",
          "The checks include a multi-directive policy, a single directive, a case where script-src overrides an unsafe default-src, and two unsafe policies.",
          "After passing, escape a list of tricky comments and build a CSP for a page you know.",
          "The example renders a comment safely and sets a strict policy.",
          "Tomorrow you will stop attackers from making users' browsers send requests they did not intend: CSRF.",
          "Together, escaping and CSP turn XSS from a disaster into a blocked attempt.",
          "Try pasting your escaped output into an HTML file and opening it: the script appears as text, not code."
        ],
        "example": "Two locks on a door: one on the handle, one deadbolt, each enough on its own most of the time.",
        "code": "import html\n\ncomment = \"<img src=x onerror=steal()> Nice!\"\nsafe = html.escape(comment)\nprint(\"<p>\" + safe + \"</p>\")\nprint(\"Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'\")",
        "output": "<p>&lt;img src=x onerror=steal()&gt; Nice!</p>\nContent-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'",
        "codeNotes": [
          {
            "line": 4,
            "note": "The standard library escaper, for real projects."
          }
        ],
        "tryIt": "Which layer stops this attack if a developer forgets to escape one field?",
        "check": {
          "question": "csp_header({\"script-src\": [\"'unsafe-inline'\"]}) should?",
          "options": [
            "Return the header",
            "Raise ValueError",
            "Remove the source silently"
          ],
          "answer": 1,
          "why": "Policies that allow inline scripts are refused."
        }
      }
    ],
    "summary": [
      "XSS happens when untrusted text becomes code in a page.",
      "Escape output for its context; & first in HTML.",
      "CSP blocks injected scripts as a second layer; avoid 'unsafe-inline'.",
      "Watch for innerHTML, |safe, raw HTML props and javascript: URLs.",
      "HttpOnly cookies and short sessions limit what XSS can steal."
    ],
    "projectStep": {
      "title": "XSS-proof comments",
      "steps": [
        "Implement escape_html and csp_header.",
        "Render ten tricky comments safely and verify none produce markup.",
        "Write a CSP for a real page and test it in report-only mode."
      ]
    }
  },
  {
    "day": 4,
    "title": "Request Forgery: Cross-Site Request Forgery (CSRF) & SameSite Cookies",
    "goal": "You can explain cross-site request forgery, protect forms with CSRF tokens compared in constant time, set cookies with Secure, HttpOnly and SameSite correctly, and reason about which requests need protection.",
    "minutes": 30,
    "recap": "Yesterday an attacker ran code in your site. Today the attacker never touches your site at all: they trick a logged-in user's browser into sending a request for them.",
    "parts": [
      {
        "title": "How CSRF works",
        "say": [
          "Browsers automatically attach cookies for a site to every request to that site, even if the request was started by a different site.",
          "Cross-site request forgery (CSRF) exploits this: a malicious page makes the victim's browser submit a form to your bank, which arrives with the victim's valid session cookie.",
          "The bank sees an authenticated request and performs the transfer, although the user never intended it.",
          "CSRF targets state-changing actions: transfers, password changes, email changes, purchases.",
          "The attacker cannot read the response; the harm comes from the action itself.",
          "The example simulates a server that trusts the cookie alone.",
          "Every defence works by requiring something a cross-site page cannot provide.",
          "CSRF was once extremely common; browser changes and frameworks have reduced it, but misconfigurations still create it.",
          "APIs that accept cookies for authentication are just as exposed as traditional forms."
        ],
        "example": "A forged letter on your letterhead that the post office delivers because the envelope looks genuine.",
        "code": "session_cookie = {\"user\": \"asha\"}\ndef transfer(cookie, to, amount):\n    if cookie.get(\"user\"):\n        return f\"transferred {amount} from {cookie['user']} to {to}\"\n    return \"not logged in\"\n\nprint(\"request started by the bank site:  \", transfer(session_cookie, \"landlord\", 15000))\nprint(\"request started by an evil page:   \", transfer(session_cookie, \"attacker\", 50000))",
        "output": "request started by the bank site:   transferred 15000 from asha to landlord\nrequest started by an evil page:    transferred 50000 from asha to attacker",
        "codeNotes": [
          {
            "line": 3,
            "note": "Trusting the cookie alone cannot tell the two requests apart."
          }
        ],
        "tryIt": "What extra information could the server require that the evil page cannot know?",
        "check": {
          "question": "Why does CSRF work?",
          "options": [
            "Passwords are weak",
            "Browsers attach cookies to requests even when another site started them",
            "HTTPS is broken"
          ],
          "answer": 1,
          "why": "Automatic cookies make forged requests look authenticated."
        }
      },
      {
        "title": "Synchroniser tokens",
        "say": [
          "The classic defence is a CSRF token: a random secret the server gives the user's session and embeds in each form.",
          "When the form is submitted, the server checks that the submitted token matches the session's token. A cross-site page cannot read the token, so it cannot include it.",
          "Tokens must be long and random (for example 32 bytes from the secrets module) and tied to the session.",
          "Practice 1 is csrf_ok(session_token, form_token), which requires both to be non-empty and compares them with hmac.compare_digest.",
          "compare_digest takes the same time whatever the input, so an attacker cannot learn how many characters matched by timing responses.",
          "The example generates a token and checks a matching and a forged submission.",
          "Most web frameworks, such as Django, include CSRF tokens automatically; the risk is turning the protection off.",
          "Tokens must never appear in URLs, where they can leak through logs and browser history.",
          "Single-page apps often send the token in a custom header, which cross-site forms cannot set."
        ],
        "example": "A cloakroom ticket: the attendant only hands over the coat to someone holding the matching stub.",
        "code": "import hmac\nimport secrets\n\nsession_token = secrets.token_hex(16)\nform_ok = hmac.compare_digest(session_token, session_token)\nform_forged = hmac.compare_digest(session_token, \"guessed-token\")\nprint(\"token length:\", len(session_token), \"hex characters\")\nprint(\"genuine form accepted:\", form_ok, \"| forged form accepted:\", form_forged)",
        "output": "token length: 32 hex characters\ngenuine form accepted: True | forged form accepted: False",
        "codeNotes": [
          {
            "line": 4,
            "note": "Random tokens from the secrets module."
          },
          {
            "line": 5,
            "note": "Constant-time comparison."
          }
        ],
        "tryIt": "Why print only the token length and not the token itself?",
        "check": {
          "question": "Why compare CSRF tokens with hmac.compare_digest?",
          "options": [
            "It is shorter",
            "Its timing does not reveal how many characters matched",
            "It encrypts the token"
          ],
          "answer": 1,
          "why": "Constant-time comparison resists timing attacks."
        }
      },
      {
        "title": "SameSite cookies",
        "say": [
          "The SameSite cookie attribute tells the browser whether to send a cookie on requests started by other sites.",
          "Strict never sends it cross-site; Lax sends it only on top-level navigations with safe methods such as GET links; None always sends it.",
          "Modern browsers treat cookies as Lax by default, which blocks most CSRF on forms that use POST.",
          "SameSite=None is needed for genuine cross-site uses such as embedded widgets, and browsers require it to be combined with Secure.",
          "SameSite is defence in depth: keep CSRF tokens for sensitive actions, because older browsers and some edge cases do not honour it.",
          "The example shows which requests carry the cookie under each setting.",
          "Choosing SameSite deliberately for every cookie is part of secure configuration.",
          "Lax is usually the best default: users can follow a link into your site and stay logged in, while cross-site form posts are blocked.",
          "Strict suits highly sensitive cookies, such as an admin session, where a little inconvenience is acceptable."
        ],
        "example": "A club that only honours membership cards presented at its own front door, not ones posted in by strangers.",
        "code": "def cookie_sent(same_site, cross_site, top_level_get):\n    if not cross_site or same_site == \"None\":\n        return True\n    return same_site == \"Lax\" and top_level_get\n\nfor mode in [\"Strict\", \"Lax\", \"None\"]:\n    print(f\"{mode:6} cross-site POST: {cookie_sent(mode, True, False)!s:5} | cross-site link click: {cookie_sent(mode, True, True)}\")",
        "output": "Strict cross-site POST: False | cross-site link click: False\nLax    cross-site POST: False | cross-site link click: True\nNone   cross-site POST: True  | cross-site link click: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "Lax allows only top-level GET navigations from other sites."
          }
        ],
        "tryIt": "Which setting would stop the forged transfer from part 1 if the bank used POST?",
        "check": {
          "question": "What does SameSite=Strict do?",
          "options": [
            "Encrypts the cookie",
            "Never sends the cookie on cross-site requests",
            "Sends it only to Strict sites"
          ],
          "answer": 1,
          "why": "Strict cookies stay on same-site requests."
        }
      },
      {
        "title": "Secure and HttpOnly",
        "say": [
          "Secure means the cookie is only sent over HTTPS, so it cannot be read on an untrusted network such as public Wi-Fi.",
          "HttpOnly means JavaScript cannot read it, which protects session cookies from XSS (Day 3).",
          "Session cookies should normally be Secure, HttpOnly and SameSite=Lax or Strict, with a sensible Max-Age.",
          "Practice 2 is set_cookie(...), which builds a Set-Cookie header and rejects invalid SameSite values and SameSite=None without Secure.",
          "Cookie names with the __Host- prefix give extra guarantees: they must be Secure, have Path=/ and no Domain attribute.",
          "The example builds headers for a session cookie and a preferences cookie.",
          "Getting cookie flags right is a small change with a large security benefit.",
          "Security scanners check these flags automatically, so mistakes are easy to find and fix.",
          "Remember to set the same flags when you delete or refresh a cookie, or the browser may keep an old insecure copy."
        ],
        "example": "Sealing an envelope (Secure) and marking it \"addressee only\" (HttpOnly) before posting it.",
        "code": "def set_cookie(name, value, same_site=\"Lax\", secure=True, http_only=True, max_age=None):\n    parts = [f\"{name}={value}\", \"Path=/\"]\n    if max_age is not None:\n        parts.append(f\"Max-Age={max_age}\")\n    if secure:\n        parts.append(\"Secure\")\n    if http_only:\n        parts.append(\"HttpOnly\")\n    parts.append(f\"SameSite={same_site}\")\n    return \"; \".join(parts)\n\nprint(\"Set-Cookie:\", set_cookie(\"session\", \"c9f2a1\", \"Strict\", max_age=3600))\nprint(\"Set-Cookie:\", set_cookie(\"theme\", \"dark\", http_only=False, max_age=31536000))",
        "output": "Set-Cookie: session=c9f2a1; Path=/; Max-Age=3600; Secure; HttpOnly; SameSite=Strict\nSet-Cookie: theme=dark; Path=/; Max-Age=31536000; Secure; SameSite=Lax",
        "codeNotes": [
          {
            "line": 9,
            "note": "SameSite is always set explicitly."
          }
        ],
        "tryIt": "Why is it fine for the theme cookie to be readable by JavaScript?",
        "check": {
          "question": "What does the Secure flag do?",
          "options": [
            "Encrypts the value",
            "Sends the cookie only over HTTPS",
            "Blocks JavaScript"
          ],
          "answer": 1,
          "why": "Secure cookies never travel over plain HTTP."
        }
      },
      {
        "title": "Which requests need protection",
        "say": [
          "Safe methods (GET, HEAD, OPTIONS) should never change state; if they do, CSRF defences become much harder.",
          "State-changing methods (POST, PUT, PATCH, DELETE) must carry a CSRF token or be protected by SameSite and origin checks.",
          "Checking the Origin or Referer header against your own site is an additional layer that frameworks often apply.",
          "APIs authenticated with tokens in headers (not cookies) are not vulnerable to classic CSRF, because browsers do not add those headers automatically.",
          "Login forms need protection too: login CSRF can sign a victim into the attacker's account.",
          "The example classifies routes by whether they need CSRF protection.",
          "A route that changes data through GET is a design bug worth fixing on its own.",
          "Frameworks usually protect POST forms automatically, so the most common gaps are custom API endpoints and GET routes that change data.",
          "Listing routes with their methods, as in the example, is a quick way to audit a whole application."
        ],
        "example": "A shop that lets anyone look at the window display, but requires a signature to take anything out of the store.",
        "code": "routes = [(\"GET\", \"/products\", False), (\"POST\", \"/transfer\", True), (\"GET\", \"/delete-account\", True), (\"DELETE\", \"/cart/3\", True)]\nfor method, path, changes_state in routes:\n    if method in (\"GET\", \"HEAD\", \"OPTIONS\") and changes_state:\n        note = \"BUG: state change over GET\"\n    elif changes_state:\n        note = \"needs CSRF protection\"\n    else:\n        note = \"safe read\"\n    print(f\"{method:6} {path:16} {note}\")",
        "output": "GET    /products        safe read\nPOST   /transfer        needs CSRF protection\nGET    /delete-account  BUG: state change over GET\nDELETE /cart/3          needs CSRF protection",
        "codeNotes": [
          {
            "line": 3,
            "note": "GET must never change state."
          }
        ],
        "tryIt": "How would you redesign /delete-account?",
        "check": {
          "question": "Why are header-token APIs not vulnerable to classic CSRF?",
          "options": [
            "They are faster",
            "Browsers do not attach those headers automatically to cross-site requests",
            "They use GET"
          ],
          "answer": 1,
          "why": "Only cookies are sent automatically."
        }
      },
      {
        "title": "Practice time: tokens and cookies",
        "say": [
          "Practice 1: csrf_ok(session_token, form_token). Return False unless both are non-empty strings; then return hmac.compare_digest(session_token, form_token).",
          "The checks include matching tokens, a one-character difference, empty tokens and a missing form token.",
          "Practice 2: set_cookie(name, value, same_site, secure, http_only, max_age). Validate SameSite, reject None without Secure, and build the parts in order: name=value, Path=/, Max-Age, Secure, HttpOnly, SameSite.",
          "The checks include the default session cookie, a readable preferences cookie with an expiry, a cross-site cookie and two invalid combinations.",
          "After passing, audit the cookies of a site you use (in the browser developer tools) and note any missing flags.",
          "The example protects a transfer form with both a token and a strict cookie.",
          "Milestone 1 tomorrow combines injection, XSS and CSRF defences into a small web application firewall.",
          "These two small functions encode lessons learned from years of real incidents.",
          "Combining tokens with SameSite means an attacker must defeat two independent defences at once."
        ],
        "example": "A bank counter that checks both your passbook and your signature before any withdrawal.",
        "code": "import hmac\n\nsession = {\"csrf\": \"7d2e9a41c0\", \"cookie\": \"session=abc; Path=/; Secure; HttpOnly; SameSite=Strict\"}\nfor label, submitted in [(\"genuine form\", \"7d2e9a41c0\"), (\"forged form\", \"\")]:\n    ok = bool(submitted) and hmac.compare_digest(session[\"csrf\"], submitted)\n    print(f\"{label:12} -> {'transfer allowed' if ok else 'rejected'}\")\nprint(\"cookie:\", session[\"cookie\"])",
        "output": "genuine form -> transfer allowed\nforged form  -> rejected\ncookie: session=abc; Path=/; Secure; HttpOnly; SameSite=Strict",
        "codeNotes": [
          {
            "line": 5,
            "note": "Empty tokens are rejected before comparing."
          }
        ],
        "tryIt": "If the cookie were SameSite=None, would the forged form still be rejected? Why?",
        "check": {
          "question": "set_cookie(\"a\", \"b\", \"None\", False) should?",
          "options": [
            "Return a header",
            "Raise ValueError",
            "Set Secure automatically"
          ],
          "answer": 1,
          "why": "SameSite=None requires Secure."
        }
      }
    ],
    "summary": [
      "CSRF makes a logged-in browser send unintended requests with its cookies.",
      "Synchroniser tokens, compared in constant time, stop forged forms.",
      "SameSite (Lax or Strict) blocks most cross-site cookie sending.",
      "Session cookies should be Secure, HttpOnly and SameSite with a sensible lifetime.",
      "Never change state over GET; protect every state-changing route."
    ],
    "projectStep": {
      "title": "CSRF-proof forms",
      "steps": [
        "Implement csrf_ok and set_cookie.",
        "Classify the routes of a small app and add protection where needed.",
        "Audit the cookie flags of a real site and write recommendations."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Web Application Firewall & Input Sanitization Engine",
    "goal": "You can combine injection, XSS and traversal checks into a simple web application firewall, sanitise uploaded filenames, understand the limits of pattern-based filtering, and test security rules with realistic cases.",
    "minutes": 30,
    "recap": "Milestone 1 brings together threat modelling (Day 1), SQL injection (Day 2), XSS (Day 3) and CSRF (Day 4). You will build a small web application firewall and a safe upload filename sanitiser.",
    "parts": [
      {
        "title": "What a WAF does",
        "say": [
          "A web application firewall (WAF) inspects HTTP requests before they reach your application and blocks those that look like attacks.",
          "Commercial and open-source WAFs (for example Cloudflare, AWS WAF and ModSecurity with the OWASP Core Rule Set) use large sets of patterns and anomaly scores.",
          "A WAF is a layer, not a fix: it buys time and blocks automated attacks, but the application must still be written securely.",
          "WAFs can block legitimate users (false positives) or miss cleverly disguised attacks (false negatives), so rules need tuning and monitoring.",
          "Practice 1 is waf_check(request), which checks the path, query and body for SQL injection, XSS and path traversal signals.",
          "The example shows the three rule families you will combine.",
          "Building a tiny WAF yourself shows exactly why real ones are complicated.",
          "Many WAFs run in \"detect only\" mode first, logging what they would block, before being switched to blocking.",
          "Virtual patching, blocking a specific known attack at the WAF while developers fix the code, is one of their most valuable uses."
        ],
        "example": "A security guard at the building entrance who checks bags for obvious dangers, while each office still locks its own doors.",
        "code": "rules = {\n    \"SQLI\": [\"' or \", \"union select\", \"--\"],\n    \"XSS\": [\"<script\", \"javascript:\", \"onerror=\"],\n    \"TRAVERSAL\": [\"../\", \"..\\\\\"],\n}\nfor name, patterns in rules.items():\n    print(f\"{name:9} looks for: {patterns}\")",
        "output": "SQLI      looks for: [\"' or \", 'union select', '--']\nXSS       looks for: ['<script', 'javascript:', 'onerror=']\nTRAVERSAL looks for: ['../', '..\\\\']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Simplified signals; the practice uses regular expressions for the SQL ones."
          }
        ],
        "tryIt": "Which of these patterns might block a legitimate request? Give an example.",
        "check": {
          "question": "Why is a WAF not a replacement for secure code?",
          "options": [
            "WAFs are illegal",
            "Patterns can miss disguised attacks and block good users",
            "WAFs only work on weekends"
          ],
          "answer": 1,
          "why": "Filtering is imperfect; the application must be safe on its own."
        }
      },
      {
        "title": "Path traversal",
        "say": [
          "Path traversal attacks use sequences like ../ to escape a folder and read files elsewhere on the server, such as configuration files with passwords.",
          "An app that serves files with open(\"uploads/\" + name) is vulnerable if name is \"../../etc/passwd\".",
          "Defences: never build file paths directly from user input; map user choices to known IDs; resolve the final path and confirm it stays inside the allowed folder.",
          "Encoded forms such as %2e%2e%2f (URL-encoded ../) must be decoded before checking, which is a common source of bypasses.",
          "The TRAVERSAL rule in the WAF catches the plain forms; the application check catches the rest.",
          "The example shows how joining paths can climb out of a folder, using string operations only.",
          "Treat every filename from a user as hostile until proven otherwise.",
          "Windows uses backslashes, so checks must handle both / and \\ separators.",
          "Storing uploaded files under random generated names, with the original name kept only as data, avoids most of these problems."
        ],
        "example": "A visitor who asks the librarian for \"the book two shelves behind the staff-only door\".",
        "code": "import posixpath\n\nbase = \"/srv/app/uploads\"\nfor name in [\"report.pdf\", \"../../etc/passwd\", \"photos/../../../secrets.txt\"]:\n    full = posixpath.normpath(posixpath.join(base, name))\n    inside = full.startswith(base + \"/\")\n    print(f\"{name:30} -> {full:28} {'ok' if inside else 'ESCAPES upload folder'}\")",
        "output": "report.pdf                     -> /srv/app/uploads/report.pdf  ok\n../../etc/passwd               -> /srv/etc/passwd              ESCAPES upload folder\nphotos/../../../secrets.txt    -> /srv/secrets.txt             ESCAPES upload folder",
        "codeNotes": [
          {
            "line": 5,
            "note": "Normalise the joined path to resolve the .. parts."
          },
          {
            "line": 6,
            "note": "Check the result is still inside the base folder."
          }
        ],
        "tryIt": "Why check base + \"/\" rather than just base?",
        "check": {
          "question": "What is path traversal?",
          "options": [
            "A slow network",
            "Using ../ sequences to access files outside the intended folder",
            "A type of encryption"
          ],
          "answer": 1,
          "why": "Traversal escapes the allowed directory."
        }
      },
      {
        "title": "Combining the rules",
        "say": [
          "The WAF joins the request's path, query and body into one lower-cased string, because attacks can hide in any part.",
          "It then applies each rule family and collects the names of those that match.",
          "Lower-casing handles tricks such as <SCRIPT> and UNION SeLeCt; regular expressions with \\s+ handle extra spaces.",
          "Returning the list of matched rules (not just blocked or not) makes logs useful: defenders can see what kind of attack was attempted.",
          "Sorting the rule names gives stable, testable output.",
          "The example runs the combined check on three requests.",
          "This structure, normalise, match rule families and report, is how real WAF engines are organised at a high level.",
          "Real engines also decode URL encoding and HTML entities first, because attackers use them to disguise payloads.",
          "Scoring, where each matched rule adds points and blocking happens above a threshold, reduces false positives from single weak signals."
        ],
        "example": "An airport scanner that checks every bag in a traveller's group, not just the one they are carrying.",
        "code": "import re\n\ndef waf(req):\n    text = \" \".join(req.get(k, \"\") for k in (\"path\", \"query\", \"body\")).lower()\n    rules = []\n    if re.search(r\"'\\s*or\\s\", text) or re.search(r\"union\\s+select\", text) or \"--\" in text:\n        rules.append(\"SQLI\")\n    if \"<script\" in text or \"javascript:\" in text or \"onerror=\" in text:\n        rules.append(\"XSS\")\n    if \"../\" in text:\n        rules.append(\"TRAVERSAL\")\n    return sorted(rules)\n\nprint(waf({\"path\": \"/search\", \"query\": \"q=shoes\"}))\nprint(waf({\"path\": \"/files/../../etc/passwd\", \"query\": \"id=1' OR 1=1 --\"}))\nprint(waf({\"path\": \"/comment\", \"body\": \"hi <ScRiPt>x()</script>\"}))",
        "output": "[]\n['SQLI', 'TRAVERSAL']\n['XSS']",
        "codeNotes": [
          {
            "line": 4,
            "note": "Normalise: join all parts and lower-case."
          }
        ],
        "tryIt": "The \"--\" rule would block a comment like \"see you soon -- Priya\". How would you reduce such false positives?",
        "check": {
          "question": "Why lower-case the request text before matching?",
          "options": [
            "To save memory",
            "So mixed-case attacks like <ScRiPt> are still caught",
            "Regular expressions require it"
          ],
          "answer": 1,
          "why": "Normalisation defeats simple disguises."
        }
      },
      {
        "title": "Safe upload filenames",
        "say": [
          "File uploads are a favourite target: attackers try traversal in the filename, hidden files like .htaccess, or scripts disguised as images.",
          "Practice 2 is safe_filename(name), which keeps only the final part of any path, replaces unusual characters, removes leading dots and limits the length.",
          "Keeping only letters, digits, dots, dashes and underscores (an allow-list) is safer than trying to remove every dangerous character.",
          "Even a clean name is not enough: check the file type by content, store uploads outside the web root, and never execute them.",
          "Large or numerous uploads can also be a denial-of-service risk, so enforce size limits.",
          "The example cleans several hostile filenames.",
          "Upload handling combines many lessons from this week in one small feature.",
          "Scanning uploads with antivirus tools adds another layer for files that users will download.",
          "Serving uploads from a separate domain, with its own cookies, stops a malicious file from reaching your main site's sessions."
        ],
        "example": "A post room that re-labels every incoming parcel with a plain, standard label before it goes onto the shelves.",
        "code": "import re\n\ndef safe_filename(name):\n    base = re.split(r\"[\\\\/]\", name)[-1]\n    base = re.sub(r\"[^A-Za-z0-9._-]\", \"_\", base).lstrip(\".\")[:64]\n    if not base:\n        raise ValueError(\"empty filename\")\n    return base\n\nfor n in [\"../../etc/passwd\", \"CV (final).pdf\", \".htaccess\", \"photo.jpg<script>\"]:\n    print(f\"{n:22} -> {safe_filename(n)}\")",
        "output": "../../etc/passwd       -> passwd\nCV (final).pdf         -> CV__final_.pdf\n.htaccess              -> htaccess\nphoto.jpg<script>      -> photo.jpg_script_",
        "codeNotes": [
          {
            "line": 4,
            "note": "Keep only the last path component."
          },
          {
            "line": 5,
            "note": "Allow-list characters, drop leading dots, limit length."
          }
        ],
        "tryIt": "photo.jpg<script> becomes a harmless name, but what other check should the upload still have?",
        "check": {
          "question": "Why use an allow-list of characters for filenames?",
          "options": [
            "It is shorter",
            "Listing what is permitted is safer than guessing every dangerous character",
            "Filenames must be English"
          ],
          "answer": 1,
          "why": "Allow-lists fail safe."
        }
      },
      {
        "title": "Testing security rules",
        "say": [
          "Security rules need tests just like any other code: attacks that must be blocked, and legitimate inputs that must pass.",
          "Collect realistic \"good\" examples, such as names with apostrophes, addresses with dashes and search queries with symbols, to catch false positives.",
          "Collect known attack examples from resources such as the OWASP testing guide to catch false negatives.",
          "Run the tests on every change to the rules, and add a test for every real incident or complaint.",
          "Track the false positive rate in production: blocking customers has a real business cost.",
          "The example runs a small test table against a simplified rule.",
          "Balanced testing is what separates a useful WAF from one that is quickly switched off in frustration.",
          "Sharing the test table with developers helps them understand what the WAF will and will not catch.",
          "Automated security testing in CI makes regressions visible before they reach production."
        ],
        "example": "Testing a smoke alarm with both a test button and a piece of toast: it should sound for smoke, not for breakfast.",
        "code": "def blocked(text):\n    low = text.lower()\n    return \"<script\" in low or \"' or 1=1\" in low\n\ntests = [(\"O'Brien\", False), (\"Pune - Mumbai express\", False), (\"<script>x()</script>\", True),\n         (\"admin' OR 1=1\", True), (\"Tom & Jerry\", False)]\nfor text, expected in tests:\n    got = blocked(text)\n    print(f\"{'PASS' if got == expected else 'FAIL'} {text!r:28} blocked={got}\")",
        "output": "PASS \"O'Brien\"                    blocked=False\nPASS 'Pune - Mumbai express'      blocked=False\nPASS '<script>x()</script>'       blocked=True\nPASS \"admin' OR 1=1\"              blocked=True\nPASS 'Tom & Jerry'                blocked=False",
        "codeNotes": [
          {
            "line": 9,
            "note": "Each row checks one expected decision."
          }
        ],
        "tryIt": "Add a disguised attack that this simple rule misses. What does that teach you?",
        "check": {
          "question": "Why test security rules with legitimate inputs too?",
          "options": [
            "To make tests longer",
            "To catch false positives that would block real users",
            "It is required by law"
          ],
          "answer": 1,
          "why": "Blocking good users is a failure too."
        }
      },
      {
        "title": "Milestone practice: WAF and filenames",
        "say": [
          "Practice 1: waf_check(request). Join path, query and body, lower-case, apply the SQLI, XSS and TRAVERSAL checks exactly as described, and return blocked plus the sorted rule names.",
          "The checks include a normal request, a mixed-case script tag, a request with both traversal and SQL injection, and an event-handler injection.",
          "Practice 2: safe_filename(name). Split on / and \\, keep the last part, replace disallowed characters with _, strip leading dots, cut to 64 characters, and raise ValueError if nothing is left.",
          "The checks include traversal, a Windows path with spaces and brackets, a hidden file, a very long name and three empty results.",
          "Congratulations on Milestone 1: you can now reason about, prevent and detect the classic web injection attacks.",
          "Next week moves to cryptography, passwords, certificates and identity.",
          "The example runs both functions on a simulated upload request.",
          "Keep your test tables; you will extend them with new rules in later lessons.",
          "A small, well-tested WAF plus secure code is far stronger than either alone."
        ],
        "example": "A building's front desk and post room working together: checking visitors and re-labelling parcels before anything goes inside.",
        "code": "import re\n\nupload = {\"path\": \"/upload\", \"query\": \"\", \"body\": \"filename=../../app/config.py\"}\ntext = \" \".join(upload.values()).lower()\nprint(\"WAF traversal alert:\", \"../\" in text)\nname = upload[\"body\"].split(\"=\", 1)[1]\nbase = re.sub(r\"[^A-Za-z0-9._-]\", \"_\", re.split(r\"[\\\\/]\", name)[-1]).lstrip(\".\")[:64]\nprint(\"stored as:\", base)",
        "output": "WAF traversal alert: True\nstored as: config.py",
        "codeNotes": [
          {
            "line": 5,
            "note": "The WAF flags the attempt."
          },
          {
            "line": 7,
            "note": "The application still stores a safe name."
          }
        ],
        "tryIt": "Should this upload be blocked, or cleaned and accepted? Argue both sides.",
        "check": {
          "question": "waf_check with \"<SCRIPT>\" in the body returns which rule?",
          "options": [
            "SQLI",
            "XSS",
            "None"
          ],
          "answer": 1,
          "why": "Lower-casing makes the script check case-insensitive."
        }
      }
    ],
    "summary": [
      "A WAF inspects requests and blocks known attack patterns as an extra layer.",
      "Path traversal uses ../ to escape folders; normalise and check paths, or avoid user paths entirely.",
      "Normalise, match rule families and report which rules fired.",
      "Sanitise upload filenames with an allow-list, and handle uploads defensively.",
      "Test rules with both attacks and legitimate inputs."
    ],
    "projectStep": {
      "title": "Milestone 1: mini WAF",
      "steps": [
        "Implement waf_check and safe_filename.",
        "Build a test table of 20 requests, half attacks and half legitimate.",
        "Measure false positives and propose one rule improvement."
      ]
    }
  },
  {
    "day": 6,
    "title": "Cryptographic Primitives: Symmetric Encryption (AES-GCM) vs Asymmetric (RSA/ECC)",
    "goal": "You can explain symmetric and asymmetric encryption, what authenticated encryption (AES-GCM) adds, why nonces must never repeat, how hashes and MACs differ from encryption, and how to judge key sizes.",
    "minutes": 30,
    "recap": "Milestone 1 defended web inputs. This week protects data itself: first the building blocks of cryptography, then passwords, certificates and identity.",
    "parts": [
      {
        "title": "Symmetric encryption",
        "say": [
          "Encryption turns readable data (plaintext) into unreadable data (ciphertext) using a key; only someone with the right key can reverse it.",
          "Symmetric encryption uses the same secret key to encrypt and decrypt. AES (Advanced Encryption Standard) is the global standard, used in HTTPS, disk encryption and messaging apps.",
          "It is very fast, so it protects bulk data: files, databases, network traffic.",
          "The hard part is sharing the key safely: anyone who has it can read everything.",
          "Never invent your own encryption scheme. Use well-reviewed libraries such as Python's cryptography package or libsodium.",
          "The example uses a toy XOR \"cipher\" only to show the idea of the same key encrypting and decrypting; XOR with a short repeating key is trivially breakable and must never be used for real data.",
          "Real ciphers mix and substitute bits in many rounds so that the ciphertext looks completely random.",
          "AES keys are 128, 192 or 256 bits long; 256-bit keys are common for long-term protection.",
          "Good libraries also handle details such as padding, modes and encoding, which are easy to get wrong by hand."
        ],
        "example": "A padlock with two identical keys: whoever holds a key can lock and unlock, so you must hand the second key over carefully.",
        "code": "def toy_xor(data, key):\n    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))\n\nkey = b\"k3y\"\nsecret = toy_xor(b\"meet at 5\", key)\nprint(\"ciphertext bytes:\", secret.hex())\nprint(\"decrypted:\", toy_xor(secret, key).decode())\nprint(\"teaching toy only: never use XOR with a short key for real data\")",
        "output": "ciphertext bytes: 06561c1f13181f134c\ndecrypted: meet at 5\nteaching toy only: never use XOR with a short key for real data",
        "codeNotes": [
          {
            "line": 2,
            "note": "XOR with the same key twice returns the original."
          }
        ],
        "tryIt": "Why does a short repeating key make this toy easy to break?",
        "check": {
          "question": "What characterises symmetric encryption?",
          "options": [
            "Two different keys",
            "The same secret key encrypts and decrypts",
            "No key at all"
          ],
          "answer": 1,
          "why": "One shared secret key."
        }
      },
      {
        "title": "Authenticated encryption and nonces",
        "say": [
          "Encryption alone hides data but does not stop tampering: an attacker can flip bits in ciphertext and change the decrypted message.",
          "Authenticated encryption, such as AES-GCM or ChaCha20-Poly1305, adds a tag that detects any change, so tampered messages are rejected.",
          "These modes need a nonce (number used once) for every message encrypted with the same key.",
          "Reusing a nonce with the same key in AES-GCM is catastrophic: it can reveal the relationship between plaintexts and let attackers forge messages.",
          "Practice 1 is nonce_reuse(messages), which finds (key, nonce) pairs used more than once in a log.",
          "Safe practice: generate nonces randomly with a secure generator, or use a counter that never repeats, and rotate keys before limits are reached.",
          "The example counts nonce use per key.",
          "The nonce is not secret; it is usually sent alongside the ciphertext.",
          "Libraries that generate nonces for you remove this whole class of mistakes, which is another reason to prefer high-level APIs."
        ],
        "example": "A tamper-evident seal on a parcel: you can see if anyone opened it, and each seal has a unique serial number that must never be reused.",
        "code": "from collections import Counter\n\nlog = [(\"k1\", \"a1\"), (\"k1\", \"a2\"), (\"k2\", \"a1\"), (\"k1\", \"a1\"), (\"k1\", \"a3\")]\ncounts = Counter(log)\nprint(\"reused (key, nonce):\", sorted(p for p, n in counts.items() if n > 1))\nprint(\"same nonce, different keys is fine:\", (\"k2\", \"a1\") not in [p for p, n in counts.items() if n > 1])",
        "output": "reused (key, nonce): [('k1', 'a1')]\nsame nonce, different keys is fine: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "Count each (key, nonce) pair."
          }
        ],
        "tryIt": "How would a counter-based nonce prevent reuse? What happens if the counter resets after a crash?",
        "check": {
          "question": "What does authenticated encryption add?",
          "options": [
            "Speed",
            "Detection of any tampering with the ciphertext",
            "Shorter keys"
          ],
          "answer": 1,
          "why": "The tag verifies integrity."
        }
      },
      {
        "title": "Asymmetric encryption",
        "say": [
          "Asymmetric (public-key) cryptography uses a key pair: a public key that anyone can have, and a private key kept secret.",
          "Data encrypted with the public key can only be decrypted with the private key, which solves the key-sharing problem.",
          "The same key pairs create digital signatures: signing with the private key proves who signed, and anyone can verify with the public key.",
          "RSA and elliptic-curve cryptography (ECC) are the main families; ECC gives similar strength with much smaller keys.",
          "Asymmetric operations are slow, so real systems use them to exchange or protect a symmetric key, then use AES for the data (hybrid encryption, as in TLS).",
          "The example uses tiny textbook RSA numbers to show the maths. Real keys are thousands of bits and use padding schemes; tiny numbers like these are for learning only.",
          "Protecting the private key is everything: whoever has it can decrypt and sign as you.",
          "Quantum computers could one day break RSA and ECC, which is why new post-quantum algorithms are being standardised.",
          "Hardware security modules and cloud key services keep private keys in tamper-resistant hardware."
        ],
        "example": "A letterbox: anyone can drop a letter through the slot (public key), but only the owner has the key to open the box (private key).",
        "code": "p, q, e = 61, 53, 17                # textbook toy values\nn, phi = p * q, (p - 1) * (q - 1)\nd = pow(e, -1, phi)                 # private exponent\nmessage = 65\ncipher = pow(message, e, n)         # encrypt with the public key (e, n)\nprint(\"public key:\", (e, n), \"| ciphertext:\", cipher)\nprint(\"decrypted with private key:\", pow(cipher, d, n))",
        "output": "public key: (17, 3233) | ciphertext: 2790\ndecrypted with private key: 65",
        "codeNotes": [
          {
            "line": 3,
            "note": "pow with -1 computes a modular inverse."
          },
          {
            "line": 5,
            "note": "Modular exponentiation with the public exponent."
          }
        ],
        "tryIt": "Why would anyone who can factor n = 3233 into 61 × 53 break this key?",
        "check": {
          "question": "In public-key encryption, which key decrypts messages sent to you?",
          "options": [
            "Your public key",
            "Your private key",
            "The sender's private key"
          ],
          "answer": 1,
          "why": "Only the private key decrypts."
        }
      },
      {
        "title": "Hashes and MACs",
        "say": [
          "A cryptographic hash function such as SHA-256 turns any input into a fixed-size fingerprint. It is one-way: you cannot get the input back from the hash.",
          "Even a one-character change produces a completely different hash, which makes hashes perfect for detecting changes to files.",
          "Hashing is not encryption: there is no key and nothing to decrypt.",
          "A MAC (message authentication code) such as HMAC-SHA256 mixes a secret key into the hash, so only key holders can produce or verify it. It proves integrity and origin.",
          "MD5 and SHA-1 are broken for security use; use SHA-256 or better.",
          "The example shows how one changed character alters a SHA-256 hash and an HMAC.",
          "You will use hashes for passwords (Day 7), certificate chains (Day 8), tokens (Day 9) and evidence logs (Day 29).",
          "Publishing the hash of a download lets users verify they received the exact file you released.",
          "Comparing MACs must use constant-time comparison, as with CSRF tokens."
        ],
        "example": "A fingerprint identifies a person without revealing anything else about them; a signed fingerprint also proves who took it.",
        "code": "import hashlib\nimport hmac\n\nfor text in [\"Pay Ravi 500\", \"Pay Ravi 900\"]:\n    h = hashlib.sha256(text.encode()).hexdigest()\n    mac = hmac.new(b\"shared-key\", text.encode(), hashlib.sha256).hexdigest()\n    print(f\"{text:13} sha256 {h[:16]}...  hmac {mac[:16]}...\")",
        "output": "Pay Ravi 500  sha256 8e7ba99fefbd1bba...  hmac 19f1f49ecdb1d6d4...\nPay Ravi 900  sha256 a47e0df8f614ea07...  hmac 291d068e4155fc18...",
        "codeNotes": [
          {
            "line": 5,
            "note": "Anyone can compute a hash."
          },
          {
            "line": 6,
            "note": "Only key holders can compute the MAC."
          }
        ],
        "tryIt": "Why can an attacker who changes a message also recompute its plain SHA-256 hash, but not its HMAC?",
        "check": {
          "question": "How does a MAC differ from a plain hash?",
          "options": [
            "It is longer",
            "It uses a secret key, so only key holders can create or verify it",
            "It can be decrypted"
          ],
          "answer": 1,
          "why": "MACs add a secret key."
        }
      },
      {
        "title": "Choosing algorithms and key sizes",
        "say": [
          "Strength depends on the algorithm and key size. Weak choices can be broken with enough computing power.",
          "Current guidance (for example from NIST): AES-128 or AES-256; RSA at least 2048 bits (3072 for long-term); ECC at least 256 bits; SHA-256 or better.",
          "DES and 3DES are retired, MD5 and SHA-1 are broken for signatures, and RSA-1024 is considered weak.",
          "Practice 2 is key_strength(algorithm, bits), which rates keys as WEAK, OK or STRONG and rejects unknown algorithms.",
          "Crypto agility, designing systems so algorithms can be swapped later, makes future upgrades far easier.",
          "The example rates a small inventory of keys found in an audit.",
          "Knowing which algorithms are in use across an organisation is the first step of any cryptography review.",
          "Configuration matters as much as algorithms: a strong cipher with a hard-coded key in source code is still insecure.",
          "Regulated industries often mandate specific algorithms and key lengths, so check the relevant standards."
        ],
        "example": "Choosing a lock: a flimsy padlock and a bank-vault lock both \"lock\", but only one resists a determined thief.",
        "code": "def rate(algo, bits):\n    algo = algo.upper()\n    if algo in (\"DES\", \"3DES\"):\n        return \"WEAK\"\n    if algo == \"RSA\":\n        return \"WEAK\" if bits < 2048 else \"OK\" if bits < 3072 else \"STRONG\"\n    if algo == \"AES\":\n        return \"STRONG\" if bits == 256 else \"OK\"\n    return \"UNKNOWN\"\n\nfor algo, bits in [(\"RSA\", 1024), (\"RSA\", 4096), (\"AES\", 128), (\"3DES\", 168)]:\n    print(f\"{algo:5} {bits:5} -> {rate(algo, bits)}\")",
        "output": "RSA    1024 -> WEAK\nRSA    4096 -> STRONG\nAES     128 -> OK\n3DES    168 -> WEAK",
        "codeNotes": [
          {
            "line": 6,
            "note": "Thresholds from current guidance."
          }
        ],
        "tryIt": "What would you recommend replacing the RSA-1024 key with?",
        "check": {
          "question": "Which is considered weak today?",
          "options": [
            "AES-256",
            "RSA-1024",
            "ECC P-256"
          ],
          "answer": 1,
          "why": "RSA below 2048 bits is weak."
        }
      },
      {
        "title": "Practice time: nonces and key strength",
        "say": [
          "Practice 1: nonce_reuse(messages). Count (key_id, nonce_hex) pairs with collections.Counter and return the sorted pairs that appear more than once.",
          "The checks include reuse under two keys, the same nonce under different keys (fine), and an empty log.",
          "Practice 2: key_strength(algorithm, bits). Upper-case the name; DES and 3DES are WEAK; AES 128 or 192 is OK and 256 STRONG (other sizes ValueError); RSA and ECC use the thresholds above; anything else raises ValueError.",
          "The checks cover every family and two invalid inputs.",
          "After passing, audit an imaginary system: list its keys and nonces and run both functions.",
          "The example prints a mini crypto audit report.",
          "Tomorrow applies hashing to passwords, where getting the details right protects millions of accounts.",
          "Cryptography is unforgiving: small mistakes in use, not the algorithms themselves, cause most real failures.",
          "Libraries with safe defaults are your best friend; this lesson teaches you to recognise when defaults have been changed."
        ],
        "example": "An inspector's checklist for locks: the right type, the right size, and no duplicate keys lying around.",
        "code": "from collections import Counter\n\nkeys = [(\"payments\", \"AES\", 256), (\"legacy-api\", \"RSA\", 1024), (\"tls\", \"ECC\", 256)]\nnonces = [(\"payments\", \"0f\"), (\"payments\", \"10\"), (\"payments\", \"0f\")]\nfor name, algo, bits in keys:\n    weak = (algo == \"RSA\" and bits < 2048)\n    print(f\"{name:10} {algo} {bits:4} {'WEAK' if weak else 'ok'}\")\nprint(\"nonce reuse:\", [p for p, n in Counter(nonces).items() if n > 1])",
        "output": "payments   AES  256 ok\nlegacy-api RSA 1024 WEAK\ntls        ECC  256 ok\nnonce reuse: [('payments', '0f')]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Flag weak keys."
          },
          {
            "line": 8,
            "note": "Flag reused nonces."
          }
        ],
        "tryIt": "Which finding is more urgent, and why?",
        "check": {
          "question": "key_strength(\"AES\", 100) should?",
          "options": [
            "Return WEAK",
            "Raise ValueError",
            "Return OK"
          ],
          "answer": 1,
          "why": "100 is not a valid AES key size."
        }
      }
    ],
    "summary": [
      "Symmetric encryption (AES) is fast but needs safe key sharing.",
      "Authenticated encryption detects tampering; never reuse a nonce with the same key.",
      "Public-key cryptography solves key sharing and enables signatures.",
      "Hashes fingerprint data; MACs add a secret key for integrity and origin.",
      "Use current algorithms and key sizes, and trusted libraries."
    ],
    "projectStep": {
      "title": "Crypto inventory",
      "steps": [
        "List the cryptography used by an app you know (HTTPS, storage, tokens).",
        "Rate each key with key_strength and check a message log for nonce reuse.",
        "Recommend upgrades and explain them in plain language."
      ]
    }
  },
  {
    "day": 7,
    "title": "Password Hashing & Key Derivation: Argon2id, Bcrypt & Salt Invariants",
    "goal": "You can explain why passwords must be hashed with slow, salted functions, describe Argon2id and bcrypt, implement salted key stretching and constant-time verification in Python, and design a good password policy.",
    "minutes": 30,
    "recap": "Yesterday you met hashes. Today you apply them to the most attacked secret of all, passwords, where a fast hash is actually a weakness.",
    "parts": [
      {
        "title": "Never store passwords",
        "say": [
          "A system should never store users' passwords, not even encrypted, because anyone with the key (including attackers) could recover them all.",
          "Instead it stores a password hash. At login, it hashes the entered password the same way and compares the results.",
          "If the database leaks, attackers get hashes, not passwords, and must try to guess each one.",
          "Many people reuse passwords across sites, so a leak from one site threatens accounts everywhere; strong hashing protects users far beyond your own system.",
          "Breach notification laws in many countries, including India's data protection rules, make leaks costly for organisations too.",
          "The example shows a plain hash of a common password.",
          "Hashing is necessary but not sufficient; the next parts show why fast hashes and missing salts are dangerous.",
          "Password managers let users have a unique strong password everywhere, which is the best defence against reuse.",
          "Even with perfect hashing, you should still protect the database; hashing is the last line of defence, not the only one."
        ],
        "example": "A bank that keeps only an impression of your signature, not a blank cheque you already signed.",
        "code": "import hashlib\n\nstored = hashlib.sha256(b\"password123\").hexdigest()\nattempt = hashlib.sha256(b\"password123\").hexdigest()\nprint(\"stored hash:\", stored[:24] + \"...\")\nprint(\"login matches:\", attempt == stored)",
        "output": "stored hash: ef92b778bafe771e89245b89...\nlogin matches: True",
        "codeNotes": [
          {
            "line": 3,
            "note": "Store the hash, never the password."
          }
        ],
        "tryIt": "Why is this simple SHA-256 hash still a bad way to store passwords? (Parts 2 and 3.)",
        "check": {
          "question": "What should a system store for each user password?",
          "options": [
            "The password encrypted",
            "A salted, slow hash of the password",
            "The password in plain text"
          ],
          "answer": 1,
          "why": "Store only a proper password hash."
        }
      },
      {
        "title": "Salts",
        "say": [
          "If two users choose the same password, a plain hash gives them the same stored value, and attackers can crack both at once.",
          "Attackers also use precomputed tables of hashes for common passwords (rainbow tables).",
          "A salt is a random value, unique per user, mixed into the hash and stored next to it. It is not secret.",
          "With salts, identical passwords give different hashes, and precomputed tables become useless.",
          "Salts should be at least 16 random bytes from a secure generator such as the secrets module.",
          "The example hashes the same password with two different salts.",
          "Modern password hashing functions generate and store salts automatically.",
          "A pepper is an extra secret kept outside the database (for example in a secrets manager) and mixed in too, adding protection if only the database leaks.",
          "Salts must be stored with the hash, which is why formats like the one in Practice 1 include them."
        ],
        "example": "Adding a different random spice to each batch of the same recipe, so no two batches taste identical.",
        "code": "import hashlib\n\nfor salt in [bytes.fromhex(\"a1b2c3d4\"), bytes.fromhex(\"99887766\")]:\n    h = hashlib.sha256(salt + b\"password123\").hexdigest()\n    print(f\"salt {salt.hex()} -> {h[:24]}...\")",
        "output": "salt a1b2c3d4 -> 9138f2df85b98f98a8dd8945...\nsalt 99887766 -> 9cfc39550b2036b836fd2525...",
        "codeNotes": [
          {
            "line": 4,
            "note": "The salt is combined with the password before hashing."
          }
        ],
        "tryIt": "Is it a problem that the salt is stored next to the hash in plain view? Why not?",
        "check": {
          "question": "What does a salt defeat?",
          "options": [
            "Slow logins",
            "Precomputed tables and identical hashes for identical passwords",
            "Phishing"
          ],
          "answer": 1,
          "why": "Unique salts make each hash distinct."
        }
      },
      {
        "title": "Slow on purpose: key stretching",
        "say": [
          "SHA-256 is designed to be fast: a modern graphics card can compute billions of hashes per second, so attackers can try billions of guesses per second.",
          "Password hashing functions are deliberately slow and memory-hungry, so each guess costs attackers real time and money.",
          "Argon2id (the winner of the Password Hashing Competition) is the current recommendation; bcrypt and scrypt are also widely used; PBKDF2 is acceptable with high iteration counts.",
          "These functions have tunable cost settings; increase them as hardware gets faster.",
          "Practice 1 is hash_password(password, salt_hex, rounds), a teaching version of key stretching that repeats SHA-256 many times with the salt, stored in a self-describing format.",
          "The example times how much longer many rounds take, and shows the self-describing format.",
          "In real projects, use argon2-cffi or bcrypt; the teaching function only demonstrates the ideas of salt, cost and format.",
          "A login taking a fraction of a second is fine for a user but multiplies an attacker's cost by millions.",
          "Memory-hard functions such as Argon2id also defeat specialised cracking hardware, which is why they are preferred."
        ],
        "example": "A safe with a time lock: the owner waits a few seconds, but a burglar trying thousands of combinations would wait for years.",
        "code": "import hashlib\n\ndef stretch(password, salt_hex, rounds):\n    pw = password.encode()\n    h = hashlib.sha256(bytes.fromhex(salt_hex) + pw).digest()\n    for _ in range(rounds - 1):\n        h = hashlib.sha256(h + pw).digest()\n    return f\"sha256r${rounds}${salt_hex}${h.hex()}\"\n\nrecord = stretch(\"correct horse\", \"0a1b2c3d\", 5000)\nscheme, rounds, salt, digest = record.split(\"$\")\nprint(\"scheme:\", scheme, \"| rounds:\", rounds, \"| salt:\", salt, \"| hash:\", digest[:16] + \"...\")\nprint(\"each guess now costs\", rounds, \"hash computations instead of 1\")",
        "output": "scheme: sha256r | rounds: 5000 | salt: 0a1b2c3d | hash: 1a8514c8db8f5707...\neach guess now costs 5000 hash computations instead of 1",
        "codeNotes": [
          {
            "line": 7,
            "note": "Each round feeds the previous result back in."
          },
          {
            "line": 8,
            "note": "The format records everything needed to verify later."
          }
        ],
        "tryIt": "Why store the number of rounds in the record rather than in the code?",
        "check": {
          "question": "Why should password hashing be slow?",
          "options": [
            "To annoy users",
            "So attackers can test far fewer guesses per second",
            "To save storage"
          ],
          "answer": 1,
          "why": "Slowness multiplies the attacker's cost."
        }
      },
      {
        "title": "Verifying safely",
        "say": [
          "To verify a login, split the stored record into scheme, cost, salt and hash, recompute with the entered password, and compare.",
          "Compare with hmac.compare_digest so the timing of the comparison does not leak how much of the hash matched.",
          "Verification must never crash on malformed records; it should simply return False, and log the problem for investigation.",
          "Practice 2 is verify_password(password, stored), which does exactly this.",
          "When you raise the cost setting, you can rehash a user's password at their next successful login, upgrading stored hashes gradually.",
          "The example verifies a correct and a wrong password against a stored record.",
          "Error messages at login should not reveal whether the username or the password was wrong, which would help attackers find valid accounts.",
          "Rate limiting and lockouts (Day 15) protect the login form from online guessing.",
          "Logging failed logins, without logging the passwords themselves, supports detection (Day 24)."
        ],
        "example": "A key cutter who remakes your key from the stored pattern and checks it against the lock, rather than keeping a spare key lying around.",
        "code": "import hashlib\nimport hmac\n\ndef verify(password, stored):\n    scheme, rounds, salt, expected = stored.split(\"$\")\n    pw = password.encode()\n    h = hashlib.sha256(bytes.fromhex(salt) + pw).digest()\n    for _ in range(int(rounds) - 1):\n        h = hashlib.sha256(h + pw).digest()\n    return hmac.compare_digest(h.hex(), expected)\n\npw = b\"S3cure!pass\"\nh = hashlib.sha256(bytes.fromhex(\"beef\") + pw).digest()\nfor _ in range(999):\n    h = hashlib.sha256(h + pw).digest()\nstored = f\"sha256r$1000$beef${h.hex()}\"\nprint(\"correct:\", verify(\"S3cure!pass\", stored), \"| wrong:\", verify(\"s3cure!pass\", stored))",
        "output": "correct: True | wrong: False",
        "codeNotes": [
          {
            "line": 10,
            "note": "Constant-time comparison."
          }
        ],
        "tryIt": "What should verify do if stored is missing a $ separator? Change it to return False safely.",
        "check": {
          "question": "Why should login errors not say \"wrong password\" versus \"unknown user\"?",
          "options": [
            "It is rude",
            "It would help attackers discover valid usernames",
            "It is slower"
          ],
          "answer": 1,
          "why": "Uniform errors avoid account enumeration."
        }
      },
      {
        "title": "Password policies that help",
        "say": [
          "Modern guidance (NIST SP 800-63B) favours long passwords over complex rules: at least 8 characters, preferably allowing 64 or more.",
          "Check new passwords against lists of breached and common passwords, and reject them.",
          "Avoid forced periodic changes unless there is evidence of compromise; they push people towards predictable patterns like Summer2024!.",
          "Allow paste so that password managers work, and allow all characters including spaces.",
          "Add multi-factor authentication for important accounts (Day 10), because even strong passwords get phished.",
          "The example checks candidate passwords against length and a small breached list.",
          "Good policies make secure behaviour easy rather than punishing users.",
          "Passphrases of several random words are both memorable and strong.",
          "Showing a strength meter with honest feedback helps users choose well without rigid rules."
        ],
        "example": "A good lock on the door plus a doorbell camera: the lock is strong, and you also see who is trying it.",
        "code": "breached = {\"password123\", \"qwerty\", \"iloveyou\", \"123456789\"}\ndef policy(pw):\n    problems = []\n    if len(pw) < 8:\n        problems.append(\"too short\")\n    if pw.lower() in breached:\n        problems.append(\"found in breach lists\")\n    return problems or [\"ok\"]\n\nfor pw in [\"qwerty\", \"Summer2024!\", \"blue tiger river lamp\", \"Password123\"]:\n    print(f\"{pw!r:24} {policy(pw)}\")",
        "output": "'qwerty'                 ['too short', 'found in breach lists']\n'Summer2024!'            ['ok']\n'blue tiger river lamp'  ['ok']\n'Password123'            ['found in breach lists']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Check against known breached passwords."
          }
        ],
        "tryIt": "Summer2024! passes this simple check. Why is it still a poor password, and what would catch it?",
        "check": {
          "question": "What does modern guidance favour?",
          "options": [
            "Forced monthly changes",
            "Long passwords checked against breach lists, plus MFA",
            "Exactly one symbol and one digit"
          ],
          "answer": 1,
          "why": "Length, breach checks and MFA beat complexity rules."
        }
      },
      {
        "title": "Practice time: hash and verify",
        "say": [
          "Practice 1: hash_password(password, salt_hex, rounds). Raise ValueError if rounds < 1000; compute h = sha256(salt bytes + password bytes), then rounds - 1 more times h = sha256(h + password bytes); return \"sha256r$rounds$salt_hex$hex\".",
          "The checks rebuild the hash independently, confirm a different salt gives a different result, and reject too few rounds.",
          "Practice 2: verify_password(password, stored). Split into four parts (return False on any parsing error), require the scheme sha256r, recompute, and compare with hmac.compare_digest.",
          "The checks include the right password, a case difference, a malformed record and an unknown scheme.",
          "After passing, time hash_password with 1,000 and 100,000 rounds and note the difference.",
          "The example shows a full register-and-login flow.",
          "Tomorrow moves from secrets you know to trust you can verify: certificates and TLS.",
          "In production, replace this teaching scheme with Argon2id through a maintained library.",
          "The self-describing format makes that migration possible: verify old records, rehash with the new scheme at login."
        ],
        "example": "A registration desk that files a fingerprint, and a door that checks each visitor against the file.",
        "code": "import hashlib\nimport hmac\n\ndef make(pw, salt, rounds=1000):\n    h = hashlib.sha256(bytes.fromhex(salt) + pw.encode()).digest()\n    for _ in range(rounds - 1):\n        h = hashlib.sha256(h + pw.encode()).digest()\n    return f\"sha256r${rounds}${salt}${h.hex()}\"\n\nusers = {\"asha\": make(\"blue tiger river\", \"c0ffee00\")}\nfor name, pw in [(\"asha\", \"blue tiger river\"), (\"asha\", \"blue tiger\")]:\n    ok = hmac.compare_digest(make(pw, \"c0ffee00\"), users[name])\n    print(f\"login {name} with {pw!r}: {'OK' if ok else 'rejected'}\")",
        "output": "login asha with 'blue tiger river': OK\nlogin asha with 'blue tiger': rejected",
        "codeNotes": [
          {
            "line": 10,
            "note": "Register: store only the record."
          },
          {
            "line": 12,
            "note": "Login: recompute and compare."
          }
        ],
        "tryIt": "This example reuses a fixed salt for the demo. Why must real code generate a new random salt for each user?",
        "check": {
          "question": "verify_password(\"pw\", \"garbage\") should?",
          "options": [
            "Raise an error",
            "Return False",
            "Return True"
          ],
          "answer": 1,
          "why": "Malformed records never verify and never crash."
        }
      }
    ],
    "summary": [
      "Never store passwords; store salted, slow hashes.",
      "Unique salts defeat precomputed tables and identical hashes.",
      "Use Argon2id, bcrypt or scrypt with tunable cost; teaching stretching shows the idea.",
      "Verify with constant-time comparison and fail safely on bad records.",
      "Favour long passwords, breach checks and MFA over complexity rules."
    ],
    "projectStep": {
      "title": "Password storage review",
      "steps": [
        "Implement hash_password and verify_password.",
        "Write a policy function with length and breach-list checks.",
        "Plan a migration from plain SHA-256 hashes to a modern scheme."
      ]
    }
  },
  {
    "day": 8,
    "title": "Public Key Infrastructure (PKI): X.509 Digital Certificates & TLS 1.3",
    "goal": "You can explain how TLS and X.509 certificates establish trust, check certificate validity dates and hostnames including wildcards, verify a certificate chain up to a trusted root, and recognise common certificate problems.",
    "minutes": 30,
    "recap": "Passwords prove who a user is. Certificates prove who a website is. Today you learn how your browser decides to show the padlock.",
    "parts": [
      {
        "title": "What TLS protects",
        "say": [
          "TLS (Transport Layer Security) is the protocol behind HTTPS. It encrypts traffic between browser and server and proves the server's identity.",
          "Without TLS, anyone on the network path, such as public Wi-Fi, could read or change traffic, including passwords and payment details.",
          "TLS 1.3 (2018) is faster and simpler than earlier versions and removed many weak options; TLS 1.0 and 1.1 are retired.",
          "A TLS handshake agrees on keys using public-key cryptography, then encrypts the session with fast symmetric ciphers (Day 6).",
          "The server proves its identity with a certificate; the browser checks it before trusting the connection.",
          "The example lists what a passive and an active attacker could do with and without TLS.",
          "Free certificate authorities such as Let's Encrypt have made HTTPS the default on most websites.",
          "TLS protects data in transit; data at rest on the server needs separate protection.",
          "Internal services should use TLS too; attackers who get inside a network look for unencrypted internal traffic."
        ],
        "example": "A sealed, signed envelope versus a postcard: the postcard can be read and altered by anyone who handles it.",
        "code": "threats = {\"read passwords on public Wi-Fi\": (True, False),\n           \"change a bank transfer amount in transit\": (True, False),\n           \"pretend to be the bank's website\": (True, False)}\nprint(f\"{'threat':42} without TLS  with TLS\")\nfor threat, (without, with_tls) in threats.items():\n    print(f\"{threat:42} {str(without):11}  {with_tls}\")",
        "output": "threat                                     without TLS  with TLS\nread passwords on public Wi-Fi             True         False\nchange a bank transfer amount in transit   True         False\npretend to be the bank's website           True         False",
        "codeNotes": [
          {
            "line": 1,
            "note": "Each tuple: possible without TLS, possible with correct TLS."
          }
        ],
        "tryIt": "Which of these threats is stopped by certificate checking specifically, rather than by encryption?",
        "check": {
          "question": "What does TLS provide?",
          "options": [
            "Faster pages only",
            "Encryption and server identity verification for data in transit",
            "Password hashing"
          ],
          "answer": 1,
          "why": "Confidentiality, integrity and authentication in transit."
        }
      },
      {
        "title": "X.509 certificates",
        "say": [
          "A certificate is a signed document binding a public key to names, such as www.example.com.",
          "Key fields include the subject names (in the Subject Alternative Name extension), the issuer, the validity period (not before and not after), and the public key.",
          "A certificate authority (CA) signs it, vouching that the owner controls the named domains.",
          "Browsers reject a certificate if the date is outside its validity period, the hostname does not match, or the signature chain does not lead to a trusted root.",
          "Practice 1 is cert_problems(cert, today, hostname), which reports NOT_YET_VALID, EXPIRED and HOSTNAME_MISMATCH.",
          "Certificate lifetimes are getting shorter (around 90 days for many issuers), which is why automated renewal is essential.",
          "The example prints the validity problems for a certificate on different dates.",
          "Expired certificates are one of the most common causes of outages; monitoring expiry dates prevents embarrassing downtime.",
          "Dates in ISO format (YYYY-MM-DD) compare correctly as strings, which keeps the example simple."
        ],
        "example": "A passport: it names the holder, is issued by a trusted authority, and is valid only between two dates.",
        "code": "cert = {\"names\": [\"example.com\", \"*.example.com\"], \"not_before\": \"2026-01-01\", \"not_after\": \"2026-03-31\"}\nfor today in [\"2025-12-20\", \"2026-02-10\", \"2026-04-02\"]:\n    problems = []\n    if today < cert[\"not_before\"]:\n        problems.append(\"NOT_YET_VALID\")\n    if today > cert[\"not_after\"]:\n        problems.append(\"EXPIRED\")\n    print(today, problems or \"valid dates\")",
        "output": "2025-12-20 ['NOT_YET_VALID']\n2026-02-10 valid dates\n2026-04-02 ['EXPIRED']",
        "codeNotes": [
          {
            "line": 4,
            "note": "ISO date strings compare in date order."
          }
        ],
        "tryIt": "How many days before expiry would you want an alert, and why?",
        "check": {
          "question": "What does a certificate bind together?",
          "options": [
            "A password and a username",
            "A public key and names such as domain names",
            "Two private keys"
          ],
          "answer": 1,
          "why": "Certificates bind identities to public keys."
        }
      },
      {
        "title": "Hostname matching and wildcards",
        "say": [
          "The browser checks that the hostname in the address bar appears in the certificate's names.",
          "Matching is case-insensitive, because domain names are.",
          "A wildcard such as *.example.com matches exactly one extra label: shop.example.com matches, but example.com and a.shop.example.com do not.",
          "Wildcards are convenient but risky: if the private key leaks, every subdomain is exposed.",
          "Look-alike domains, such as examp1e.com or example.com.evil.io, can get valid certificates for their own names, so users must check the actual domain.",
          "The example tests several hostnames against a wildcard.",
          "Correct matching logic is subtle; always use the TLS library's built-in verification in real code.",
          "Disabling verification (for example verify=False in HTTP libraries) removes the protection entirely and is a common, serious mistake.",
          "Internationalised domain names can contain look-alike characters from other alphabets, a trick called homograph attacks."
        ],
        "example": "A season ticket valid for \"any stand in the main stadium\", but not for the car park or a different stadium.",
        "code": "def matches(name, host):\n    name, host = name.lower(), host.lower()\n    if name.startswith(\"*.\"):\n        first, _, rest = host.partition(\".\")\n        return bool(first) and rest == name[2:]\n    return name == host\n\nfor host in [\"shop.example.com\", \"SHOP.Example.com\", \"example.com\", \"a.shop.example.com\", \"example.com.evil.io\"]:\n    print(f\"{host:22} matches *.example.com: {matches('*.example.com', host)}\")",
        "output": "shop.example.com       matches *.example.com: True\nSHOP.Example.com       matches *.example.com: True\nexample.com            matches *.example.com: False\na.shop.example.com     matches *.example.com: False\nexample.com.evil.io    matches *.example.com: False",
        "codeNotes": [
          {
            "line": 5,
            "note": "Exactly one non-empty label before the wildcard's domain."
          }
        ],
        "tryIt": "Why should *.example.com not match example.com itself?",
        "check": {
          "question": "Does *.example.com match a.b.example.com?",
          "options": [
            "Yes",
            "No, a wildcard covers exactly one label",
            "Only on weekends"
          ],
          "answer": 1,
          "why": "Wildcards match a single label."
        }
      },
      {
        "title": "Chains of trust",
        "say": [
          "Browsers and operating systems ship with a list of trusted root certificate authorities.",
          "Roots rarely sign website certificates directly. They sign intermediate CAs, which sign server certificates, forming a chain.",
          "To verify, each certificate's issuer must match the next certificate's subject, each signature must be valid, and the chain must end at a trusted root.",
          "Practice 2 is chain_trusted(chain, trusted_roots), which checks the subject and issuer links and the final trust anchor (real verification also checks every signature cryptographically).",
          "Servers must send the intermediate certificates; a missing intermediate is a classic cause of \"works in my browser but not in my app\" errors.",
          "The example walks a chain and shows where a broken link is found.",
          "Self-signed certificates are their own issuer and are only trusted where you explicitly install them, such as internal test systems.",
          "Certificate revocation, through CRLs and OCSP, lets CAs mark stolen or mis-issued certificates as invalid before they expire.",
          "Certificate Transparency logs publicly record issued certificates, helping owners spot certificates issued for their domains without permission."
        ],
        "example": "A reference letter from a manager, whose own credentials were vouched for by the company director, whom you already know and trust.",
        "code": "chain = [{\"subject\": \"shop.example.com\", \"issuer\": \"Intermediate R3\"},\n         {\"subject\": \"Intermediate R3\", \"issuer\": \"Root CA X1\"}]\nroots = {\"Root CA X1\"}\nfor a, b in zip(chain, chain[1:]):\n    print(f\"{a['subject']:17} issued by {a['issuer']:15} next subject {b['subject']:15} link ok: {a['issuer'] == b['subject']}\")\nprint(\"ends at trusted root:\", chain[-1][\"issuer\"] in roots)",
        "output": "shop.example.com  issued by Intermediate R3 next subject Intermediate R3 link ok: True\nends at trusted root: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "Check each link in the chain."
          },
          {
            "line": 6,
            "note": "Check the trust anchor."
          }
        ],
        "tryIt": "What happens if the server forgets to send the intermediate certificate?",
        "check": {
          "question": "What must a certificate chain end at?",
          "options": [
            "Any certificate",
            "A root certificate authority in the trusted store",
            "The server itself"
          ],
          "answer": 1,
          "why": "Trust flows from a known root."
        }
      },
      {
        "title": "Common certificate mistakes",
        "say": [
          "Expired certificates cause outages; automate renewal and monitor expiry dates.",
          "Disabling certificate verification in code \"to make it work\" silently removes the protection; fix the underlying problem instead.",
          "Leaving private keys in source repositories or shared folders lets anyone impersonate the site (Day 18 scans for secrets).",
          "Missing intermediate certificates break some clients; test with tools such as SSL Labs.",
          "Mixed content, loading scripts over plain HTTP on an HTTPS page, undermines the whole page; browsers now block much of it.",
          "The example scans a small inventory of certificates for issues.",
          "Most certificate incidents are operational, not cryptographic: a checklist and monitoring prevent them.",
          "HSTS (Day 14) tells browsers to always use HTTPS for your domain, closing the gap before the first redirect.",
          "Keeping an inventory of every certificate, with owner and expiry date, is the foundation of good certificate management."
        ],
        "example": "Forgetting to renew a shop's licence: nothing is wrong with the shop, but it is closed until the paperwork is fixed.",
        "code": "inventory = [{\"host\": \"shop.example.com\", \"expires\": \"2026-10-05\", \"verify_disabled\": False},\n             {\"host\": \"api.example.com\", \"expires\": \"2026-09-01\", \"verify_disabled\": False},\n             {\"host\": \"legacy.example.com\", \"expires\": \"2027-01-01\", \"verify_disabled\": True}]\ntoday = \"2026-09-20\"\nfor c in inventory:\n    issues = ([\"EXPIRED\"] if c[\"expires\"] < today else []) + ([\"VERIFY_DISABLED\"] if c[\"verify_disabled\"] else [])\n    print(f\"{c['host']:20} {issues or 'ok'}\")",
        "output": "shop.example.com     ok\napi.example.com      ['EXPIRED']\nlegacy.example.com   ['VERIFY_DISABLED']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Combine the checks into one list of issues."
          }
        ],
        "tryIt": "shop.example.com expires in 15 days. Should that be flagged too? Add a warning threshold.",
        "check": {
          "question": "Why is disabling certificate verification dangerous?",
          "options": [
            "It slows the app",
            "It removes protection against impersonation and interception",
            "It is illegal"
          ],
          "answer": 1,
          "why": "Without verification, any certificate is accepted."
        }
      },
      {
        "title": "Practice time: validity and chains",
        "say": [
          "Practice 1: cert_problems(cert, today, hostname). Compare today with not_before and not_after, then check the hostname against every name, handling wildcards as one extra label and ignoring case. Return problems in the order NOT_YET_VALID, EXPIRED, HOSTNAME_MISMATCH.",
          "The checks include a valid wildcard match, a capitalised hostname, an expired certificate with a two-level subdomain, and a future certificate for the wrong domain.",
          "Practice 2: chain_trusted(chain, trusted_roots). Return False for an empty chain; check every adjacent issuer and subject link; require the last issuer to be in trusted_roots.",
          "The checks include a valid chain, a broken link, a self-signed certificate and an empty chain.",
          "After passing, look at the certificate of a site you use (click the padlock) and identify its names, dates and chain.",
          "The example runs both checks on a small certificate set.",
          "Tomorrow you will look inside another kind of signed token, the JWT, and learn how its verification can go wrong.",
          "The same trust logic, verify the signature, check the dates, check the name, applies to almost every signed credential.",
          "Real code should always rely on the TLS library's verification; these practices teach what it is checking for you."
        ],
        "example": "A border officer checking a passport's dates, the name on it, and that it was issued by a recognised country.",
        "code": "cert = {\"names\": [\"*.bank.example\"], \"not_before\": \"2026-01-01\", \"not_after\": \"2026-12-31\"}\nchain = [{\"subject\": \"www.bank.example\", \"issuer\": \"Bank CA\"}, {\"subject\": \"Bank CA\", \"issuer\": \"Global Root\"}]\nhost, today = \"www.bank.example\", \"2026-07-01\"\ndates_ok = cert[\"not_before\"] <= today <= cert[\"not_after\"]\nname_ok = host.split(\".\", 1)[1] == cert[\"names\"][0][2:]\nchain_ok = all(a[\"issuer\"] == b[\"subject\"] for a, b in zip(chain, chain[1:])) and chain[-1][\"issuer\"] in {\"Global Root\"}\nprint(\"dates:\", dates_ok, \"| name:\", name_ok, \"| chain:\", chain_ok)",
        "output": "dates: True | name: True | chain: True",
        "codeNotes": [
          {
            "line": 5,
            "note": "A simplified wildcard check for this one example."
          }
        ],
        "tryIt": "What would each check print for the host \"bank.example\"?",
        "check": {
          "question": "chain_trusted([], roots) returns?",
          "options": [
            "True",
            "False",
            "An error"
          ],
          "answer": 1,
          "why": "An empty chain proves nothing."
        }
      }
    ],
    "summary": [
      "TLS encrypts traffic and proves server identity with certificates.",
      "Certificates bind names to public keys and have validity dates.",
      "Hostnames match exactly or through single-label wildcards, case-insensitively.",
      "Chains link server, intermediate and trusted root; send intermediates.",
      "Automate renewal, never disable verification, and protect private keys."
    ],
    "projectStep": {
      "title": "Certificate monitor",
      "steps": [
        "Implement cert_problems and chain_trusted.",
        "Build an inventory of five certificates and flag issues and upcoming expiries.",
        "Write a short runbook for renewing and deploying certificates."
      ]
    }
  },
  {
    "day": 9,
    "title": "Identity & Access Management: JWT Vulnerabilities & Alg 'none' Attacks",
    "goal": "You can explain JSON Web Tokens, decode them, verify HS256 signatures correctly in Python, reject the \"alg: none\" and algorithm confusion attacks, enforce expiry, and choose safe token practices.",
    "minutes": 30,
    "recap": "Certificates prove a server's identity. After login, many applications give users a token proving who they are for later requests. Today you learn to verify one properly.",
    "parts": [
      {
        "title": "What a JWT is",
        "say": [
          "A JSON Web Token (JWT) is a compact token with three parts separated by dots: a header, a payload and a signature, each base64url encoded.",
          "The header names the signing algorithm; the payload holds claims such as sub (subject, the user ID), exp (expiry time) and custom data like role.",
          "The signature is computed over the header and payload with a secret or private key, so any change to them breaks it.",
          "JWTs are signed, not encrypted: anyone who has the token can read its contents, so never put secrets in the payload.",
          "Practice 1 is decode_jwt(token), which reads the header and payload without verifying anything.",
          "The example builds and decodes a token to show that the payload is readable by anyone.",
          "Decoding is useful for debugging, but trusting decoded data without verification is a serious vulnerability.",
          "base64url is ordinary base64 with - and _ instead of + and /, and usually without = padding, so it is safe in URLs.",
          "Tokens are often sent in the Authorization header as \"Bearer <token>\"."
        ],
        "example": "A signed visitor badge: anyone can read the name on it, but only security can issue one that passes inspection.",
        "code": "import base64\nimport json\n\ndef b64(obj):\n    return base64.urlsafe_b64encode(json.dumps(obj).encode()).rstrip(b\"=\").decode()\n\ntoken = b64({\"alg\": \"HS256\", \"typ\": \"JWT\"}) + \".\" + b64({\"sub\": \"u42\", \"role\": \"user\"}) + \".signature\"\nprint(token)\npayload = token.split(\".\")[1]\nprint(json.loads(base64.urlsafe_b64decode(payload + \"=\" * (-len(payload) % 4))))",
        "output": "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidTQyIiwgInJvbGUiOiAidXNlciJ9.signature\n{'sub': 'u42', 'role': 'user'}",
        "codeNotes": [
          {
            "line": 5,
            "note": "base64url without padding, as in real JWTs."
          },
          {
            "line": 10,
            "note": "Add padding back before decoding."
          }
        ],
        "tryIt": "What would an attacker learn by decoding a JWT that contained a user's phone number?",
        "check": {
          "question": "Is the payload of a signed JWT secret?",
          "options": [
            "Yes, it is encrypted",
            "No, anyone with the token can read it",
            "Only the header is readable"
          ],
          "answer": 1,
          "why": "Signing protects integrity, not confidentiality."
        }
      },
      {
        "title": "Verifying an HS256 signature",
        "say": [
          "HS256 means HMAC with SHA-256: the server computes HMAC-SHA256(secret, header + \".\" + payload) and compares it with the token's signature.",
          "If an attacker changes the payload (for example role to admin), the signature no longer matches and the token is rejected.",
          "The comparison must use hmac.compare_digest to avoid timing leaks.",
          "Practice 2 is verify_jwt(token, secret, now), which checks the algorithm, the signature and the expiry, in that order.",
          "The secret must be long and random; short or guessable secrets can be cracked offline from any captured token.",
          "The example signs a token, then shows that tampering with the payload breaks verification.",
          "Libraries such as PyJWT do this for you, but you must pass the expected algorithm explicitly.",
          "RS256 and ES256 use public-key signatures instead, letting many services verify tokens without being able to create them.",
          "Only after verification should the application read claims such as role or user ID."
        ],
        "example": "A wax seal pressed with a unique ring: if anyone changes the letter, the seal breaks.",
        "code": "import base64\nimport hashlib\nimport hmac\nimport json\n\nb64 = lambda data: base64.urlsafe_b64encode(data).rstrip(b\"=\").decode()\nsecret = b\"a-long-random-server-secret\"\nh, p = b64(json.dumps({\"alg\": \"HS256\"}).encode()), b64(json.dumps({\"sub\": \"u42\", \"role\": \"user\"}).encode())\nsig = b64(hmac.new(secret, f\"{h}.{p}\".encode(), hashlib.sha256).digest())\nforged_p = b64(json.dumps({\"sub\": \"u42\", \"role\": \"admin\"}).encode())\nfor label, payload in [(\"original\", p), (\"tampered\", forged_p)]:\n    expected = b64(hmac.new(secret, f\"{h}.{payload}\".encode(), hashlib.sha256).digest())\n    print(label, \"signature valid:\", hmac.compare_digest(expected, sig))",
        "output": "original signature valid: True\ntampered signature valid: False",
        "codeNotes": [
          {
            "line": 9,
            "note": "The signature covers header and payload."
          },
          {
            "line": 12,
            "note": "Recompute and compare in constant time."
          }
        ],
        "tryIt": "Why can the attacker not simply recompute the signature for the tampered payload?",
        "check": {
          "question": "What does changing the payload of an HS256 JWT do?",
          "options": [
            "Nothing",
            "Breaks the signature, so verification fails",
            "Changes the secret"
          ],
          "answer": 1,
          "why": "The signature covers the payload."
        }
      },
      {
        "title": "The \"alg: none\" attack",
        "say": [
          "The JWT standard allows \"alg\": \"none\", meaning an unsigned token. Some early libraries trusted the algorithm named in the token's own header.",
          "An attacker could change the header to \"none\", change the payload to role admin, remove the signature, and be accepted.",
          "The fix: the server decides which algorithm it expects and rejects anything else, never letting the token choose.",
          "A related attack, algorithm confusion, tricks a server expecting RS256 into verifying with HS256 using the public key as the HMAC secret.",
          "Practice 2 rejects any algorithm other than HS256 with ValueError(\"bad alg\") before checking the signature.",
          "The example shows the header of a forged unsigned token.",
          "The lesson generalises: never let attacker-controlled data choose your security mechanism.",
          "Keep JWT libraries up to date; these attacks were fixed in mainstream libraries years ago, but old versions linger.",
          "Security tests should include an \"alg: none\" token to confirm it is rejected."
        ],
        "example": "A bouncer who accepts any badge that says \"no badge needed\" printed on it.",
        "code": "import base64\nimport json\n\nb64 = lambda obj: base64.urlsafe_b64encode(json.dumps(obj).encode()).rstrip(b\"=\").decode()\nforged = b64({\"alg\": \"none\"}) + \".\" + b64({\"sub\": \"u42\", \"role\": \"admin\"}) + \".\"\nheader = json.loads(base64.urlsafe_b64decode(forged.split(\".\")[0] + \"==\"))\nprint(\"forged token:\", forged)\nprint(\"header says alg =\", header[\"alg\"], \"-> a safe server rejects it:\", header[\"alg\"] != \"HS256\")",
        "output": "forged token: eyJhbGciOiAibm9uZSJ9.eyJzdWIiOiAidTQyIiwgInJvbGUiOiAiYWRtaW4ifQ.\nheader says alg = none -> a safe server rejects it: True",
        "codeNotes": [
          {
            "line": 5,
            "note": "No signature at all."
          },
          {
            "line": 8,
            "note": "The server, not the token, decides the algorithm."
          }
        ],
        "tryIt": "How should a server configured for RS256 treat a token whose header says HS256?",
        "check": {
          "question": "How do you prevent the \"alg: none\" attack?",
          "options": [
            "Use longer tokens",
            "Have the server require its expected algorithm and reject others",
            "Encrypt the header"
          ],
          "answer": 1,
          "why": "Never trust the token's own choice of algorithm."
        }
      },
      {
        "title": "Expiry and revocation",
        "say": [
          "Tokens should expire quickly, often within 5 to 60 minutes, using the exp claim (seconds since 1970).",
          "Verification must reject tokens where the current time is at or after exp; Practice 2 raises ValueError(\"expired\").",
          "Short-lived access tokens are paired with longer-lived refresh tokens, which are stored more carefully and can be revoked.",
          "Stateless JWTs cannot be revoked easily before expiry, which is why short lifetimes matter; high-security systems keep a deny-list or use server-side sessions.",
          "Other useful claims are iat (issued at), nbf (not before), iss (issuer) and aud (audience), each worth checking where relevant.",
          "The example checks a token at several times.",
          "Clocks differ slightly between servers, so libraries allow a small leeway, typically under a minute.",
          "When a user logs out or changes their password, their refresh tokens should be revoked.",
          "Logging token identifiers (jti), not whole tokens, supports investigations without exposing credentials."
        ],
        "example": "A day pass at a theme park: useful all day, worthless tomorrow, and the gate checks the date every time.",
        "code": "payload = {\"sub\": \"u42\", \"iat\": 1_700_000_000, \"exp\": 1_700_000_900}\nfor now in [1_700_000_100, 1_700_000_899, 1_700_000_900, 1_700_003_600]:\n    status = \"valid\" if now < payload[\"exp\"] else \"expired\"\n    print(f\"t={now}: {status} ({payload['exp'] - now:+} s to expiry)\")",
        "output": "t=1700000100: valid (+800 s to expiry)\nt=1700000899: valid (+1 s to expiry)\nt=1700000900: expired (+0 s to expiry)\nt=1700003600: expired (-2700 s to expiry)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Expired at exactly exp, not one second later."
          }
        ],
        "tryIt": "How long is this token's lifetime in minutes?",
        "check": {
          "question": "Why keep JWT lifetimes short?",
          "options": [
            "To save bandwidth",
            "Because stateless tokens are hard to revoke before they expire",
            "Browsers require it"
          ],
          "answer": 1,
          "why": "Short lifetimes limit the damage of a stolen token."
        }
      },
      {
        "title": "Storing and sending tokens safely",
        "say": [
          "Tokens are credentials: anyone who has one can act as the user until it expires.",
          "In browsers, HttpOnly Secure cookies protect tokens from XSS (Day 3) but need CSRF protection (Day 4); localStorage is readable by any script on the page.",
          "Always send tokens over HTTPS, never in URLs (which end up in logs and browser history).",
          "Validate the audience claim so a token issued for one service cannot be replayed against another.",
          "Keep payloads small and free of sensitive data, since they are readable.",
          "The example checks a few token-handling practices and reports problems.",
          "Most JWT incidents come from handling mistakes, not from breaking the cryptography.",
          "Rotate signing secrets periodically and support two active keys during the change, identified with a kid (key ID) header.",
          "Treat any token found in logs as compromised and revoke it."
        ],
        "example": "Carrying your house key on a lanyard inside your jacket, not taped to the front door.",
        "code": "practices = {\"sent only over HTTPS\": True, \"never placed in URLs\": False,\n             \"stored in HttpOnly cookie\": True, \"audience checked\": False, \"no personal data in payload\": True}\nfor practice, ok in practices.items():\n    print(f\"{'ok  ' if ok else 'FIX '} {practice}\")\nprint(f\"{sum(practices.values())}/{len(practices)} practices followed\")",
        "output": "ok   sent only over HTTPS\nFIX  never placed in URLs\nok   stored in HttpOnly cookie\nFIX  audience checked\nok   no personal data in payload\n3/5 practices followed",
        "codeNotes": [
          {
            "line": 5,
            "note": "True counts as 1."
          }
        ],
        "tryIt": "Which of the two failures is more dangerous, and why?",
        "check": {
          "question": "Where should tokens never be placed?",
          "options": [
            "In the Authorization header",
            "In URLs, which leak into logs and history",
            "In HttpOnly cookies"
          ],
          "answer": 1,
          "why": "URLs are logged and shared."
        }
      },
      {
        "title": "Practice time: decode and verify",
        "say": [
          "Practice 1: decode_jwt(token). Split into three parts (ValueError otherwise), add = padding to each of the first two, base64url decode, and json.loads.",
          "The checks build a token with base64url and confirm both parts decode, and reject tokens with one, two or four parts.",
          "Practice 2: verify_jwt(token, secret, now). Check three parts; reject any alg other than HS256 with \"bad alg\"; recompute the HMAC-SHA256 signature and compare in constant time (\"bad signature\"); reject expired tokens (\"expired\"); return the payload.",
          "The checks use a valid token, a wrong secret, an expired time and an \"alg: none\" forgery, and verify the exact error messages.",
          "After passing, create a token with a 10-minute expiry and test it at different times.",
          "The example runs the full verify sequence on a good and a tampered token.",
          "Tomorrow adds a second factor: one-time codes from an authenticator app.",
          "Order matters in verification: reject bad algorithms before doing anything else with the token.",
          "Use PyJWT or a similar library in production, always passing the expected algorithms explicitly."
        ],
        "example": "An inspector who checks the seal type, the seal itself and the expiry date, in that order, before opening the letter.",
        "code": "import base64, hashlib, hmac, json\n\nb64 = lambda d: base64.urlsafe_b64encode(d).rstrip(b\"=\").decode()\nsecret = \"k3y-long-and-random\"\nh, p = b64(b'{\"alg\":\"HS256\"}'), b64(b'{\"sub\":\"u7\",\"exp\":2000}')\ntoken = f\"{h}.{p}.{b64(hmac.new(secret.encode(), f'{h}.{p}'.encode(), hashlib.sha256).digest())}\"\nhh, pp, ss = token.split(\".\")\nalg_ok = json.loads(base64.urlsafe_b64decode(hh + \"==\")).get(\"alg\") == \"HS256\"\nsig_ok = hmac.compare_digest(b64(hmac.new(secret.encode(), f\"{hh}.{pp}\".encode(), hashlib.sha256).digest()), ss)\nexp_ok = 1500 < json.loads(base64.urlsafe_b64decode(pp + \"==\"))[\"exp\"]\nprint(\"alg:\", alg_ok, \"| signature:\", sig_ok, \"| not expired at t=1500:\", exp_ok)",
        "output": "alg: True | signature: True | not expired at t=1500: True",
        "codeNotes": [
          {
            "line": 8,
            "note": "Step 1: algorithm."
          },
          {
            "line": 9,
            "note": "Step 2: signature."
          },
          {
            "line": 10,
            "note": "Step 3: expiry."
          }
        ],
        "tryIt": "Change one character of the payload part and rerun. Which step fails?",
        "check": {
          "question": "verify_jwt with an \"alg: none\" token raises?",
          "options": [
            "bad signature",
            "bad alg",
            "expired"
          ],
          "answer": 1,
          "why": "The algorithm check comes first."
        }
      }
    ],
    "summary": [
      "JWTs are signed, readable tokens: header, payload and signature.",
      "Verify HS256 by recomputing the HMAC and comparing in constant time.",
      "Reject any algorithm you did not expect, especially \"none\".",
      "Keep tokens short-lived, enforce exp and check audience.",
      "Send tokens only over HTTPS, never in URLs, and store them carefully."
    ],
    "projectStep": {
      "title": "Token service",
      "steps": [
        "Implement decode_jwt and verify_jwt.",
        "Write tests for tampering, alg none, wrong secret and expiry.",
        "Document how your app would store, refresh and revoke tokens."
      ]
    }
  },
  {
    "day": 10,
    "title": "Authentication: Multi-Factor Authentication & TOTP (RFC 6238)",
    "goal": "You can explain multi-factor authentication, implement TOTP codes exactly as RFC 6238 specifies, verify codes with a clock-drift window, and compare the strength of different second factors.",
    "minutes": 30,
    "recap": "Passwords can be phished, guessed or leaked. Multi-factor authentication makes a stolen password far less useful. Today you build the six-digit codes that authenticator apps show.",
    "parts": [
      {
        "title": "Why multiple factors",
        "say": [
          "Authentication factors are something you know (a password or PIN), something you have (a phone or security key) and something you are (a fingerprint or face).",
          "Multi-factor authentication (MFA) requires two or more different kinds, so an attacker who steals a password still cannot log in.",
          "Microsoft has reported that MFA blocks over 99 percent of automated account-takeover attacks.",
          "Common second factors include SMS codes, authenticator app codes (TOTP), push notifications and hardware security keys (FIDO2/WebAuthn).",
          "They differ in strength: SMS can be intercepted through SIM swapping, and codes can still be phished, while security keys resist phishing because they check the website's domain.",
          "The example ranks second factors by phishing resistance.",
          "Any MFA is much better than none; the best choice depends on the users and the risk.",
          "Recovery options (backup codes, a second device) must be as carefully protected as the factors themselves, or attackers target them instead.",
          "Banks in India commonly use OTPs for transactions, a familiar example of a second factor."
        ],
        "example": "A bank locker that needs both your key and the bank's key: stealing one is not enough.",
        "code": "factors = [(\"security key (FIDO2)\", \"high\", \"checks the site domain, cannot be phished\"),\n           (\"authenticator app (TOTP)\", \"medium\", \"codes can be phished in real time\"),\n           (\"push approval\", \"medium\", \"users may approve prompts they did not start\"),\n           (\"SMS code\", \"low\", \"SIM swapping and interception\")]\nfor name, resistance, note in factors:\n    print(f\"{name:26} phishing resistance: {resistance:6} ({note})\")",
        "output": "security key (FIDO2)       phishing resistance: high   (checks the site domain, cannot be phished)\nauthenticator app (TOTP)   phishing resistance: medium (codes can be phished in real time)\npush approval              phishing resistance: medium (users may approve prompts they did not start)\nSMS code                   phishing resistance: low    (SIM swapping and interception)",
        "codeNotes": [
          {
            "line": 1,
            "note": "Ordered from strongest to weakest."
          }
        ],
        "tryIt": "Which factor would you give to a company's finance team, and why?",
        "check": {
          "question": "Why is MFA effective?",
          "options": [
            "Passwords become longer",
            "A stolen password alone is no longer enough to log in",
            "It encrypts the database"
          ],
          "answer": 1,
          "why": "Attackers need a second, different factor."
        }
      },
      {
        "title": "How TOTP works",
        "say": [
          "TOTP (time-based one-time password, RFC 6238) is what authenticator apps such as Google Authenticator and Microsoft Authenticator use.",
          "During setup, the server and the app share a secret key, usually shown as a QR code containing a base32 string.",
          "Both sides divide the current Unix time by 30 seconds to get a counter, compute HMAC-SHA1(secret, counter), and turn the result into a short number.",
          "Because both sides share the secret and the time, they produce the same code without communicating; each code changes every 30 seconds.",
          "The truncation step picks 4 bytes from the HMAC at an offset given by its last half-byte, clears the top bit, and takes the number modulo 10 to the power of the digits.",
          "Practice 1 is totp(secret_b32, t), which implements this exactly and is tested against the official RFC test vectors.",
          "The example computes the time counter for a few timestamps.",
          "The secret must be protected like a password; anyone who has it can generate valid codes forever.",
          "HOTP, the older counter-based version (RFC 4226), uses an event counter instead of time."
        ],
        "example": "Two synchronised watches and a shared secret recipe: both can bake the same \"cake\" each half-minute without talking.",
        "code": "for t in [0, 29, 30, 59, 60, 1_700_000_000]:\n    print(f\"time {t:>10} -> counter {t // 30}\")",
        "output": "time          0 -> counter 0\ntime         29 -> counter 0\ntime         30 -> counter 1\ntime         59 -> counter 1\ntime         60 -> counter 2\ntime 1700000000 -> counter 56666666",
        "codeNotes": [
          {
            "line": 2,
            "note": "Integer division by the 30-second step."
          }
        ],
        "tryIt": "Why do times 30 and 59 give the same code?",
        "check": {
          "question": "What do the server and the authenticator app share to produce the same codes?",
          "options": [
            "The user's password",
            "A secret key and the current time",
            "The phone number"
          ],
          "answer": 1,
          "why": "Secret plus time gives matching codes."
        }
      },
      {
        "title": "Implementing TOTP",
        "say": [
          "In Python: key = base64.b32decode(secret); counter = struct.pack(\">Q\", t // 30) gives 8 big-endian bytes; h = hmac.new(key, counter, hashlib.sha1).digest().",
          "offset = h[-1] & 0x0F; code = (int.from_bytes(h[offset:offset + 4], \"big\") & 0x7FFFFFFF) % 10**digits.",
          "Pad the code with leading zeros to the required length: 7081804 with 8 digits is shown as 07081804.",
          "Testing against RFC vectors is essential: small mistakes such as little-endian packing or a missing mask give codes that look fine but never match an app.",
          "SHA-1 is still acceptable here because HMAC does not rely on SHA-1's broken collision resistance.",
          "The example computes a code with the RFC test secret.",
          "Real implementations add rate limiting so attackers cannot try all one million six-digit codes.",
          "Codes should be accepted only once, to stop an intercepted code being reused within its 30-second window.",
          "The secret is usually 20 random bytes, generated with the secrets module during enrolment."
        ],
        "example": "Following a recipe to the gram: any small change produces a different result that nobody else will recognise.",
        "code": "import base64\nimport hashlib\nimport hmac\nimport struct\n\nsecret = \"GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\"      # RFC 6238 test key\nkey = base64.b32decode(secret)\nh = hmac.new(key, struct.pack(\">Q\", 59 // 30), hashlib.sha1).digest()\noffset = h[-1] & 0x0F\ncode = (int.from_bytes(h[offset:offset + 4], \"big\") & 0x7FFFFFFF) % 10 ** 8\nprint(\"offset\", offset, \"-> code\", str(code).zfill(8), \"(RFC expects 94287082)\")",
        "output": "offset 11 -> code 94287082 (RFC expects 94287082)",
        "codeNotes": [
          {
            "line": 8,
            "note": "HMAC-SHA1 over the 8-byte counter."
          },
          {
            "line": 10,
            "note": "Dynamic truncation."
          }
        ],
        "tryIt": "What would struct.pack(\"<Q\", ...) (little-endian) do to the result?",
        "check": {
          "question": "Why test a TOTP implementation against RFC vectors?",
          "options": [
            "To make it faster",
            "Small mistakes produce plausible codes that never match real apps",
            "Vectors are required by law"
          ],
          "answer": 1,
          "why": "Known answers catch subtle bugs."
        }
      },
      {
        "title": "Clock drift and verification",
        "say": [
          "Phones and servers disagree by a few seconds, and users take time to type codes, so strict matching would reject valid codes.",
          "Verification usually accepts the current step and one step either side (a window of about 90 seconds).",
          "Practice 2 is verify_totp(secret_b32, code, t, window), which checks each step in the window and compares with hmac.compare_digest.",
          "A wider window is more forgiving but gives attackers more valid codes to guess, so keep it small.",
          "Record the last accepted counter per user and reject codes from that step or earlier, preventing replay.",
          "The example shows which time offsets are accepted with a window of 1.",
          "Good verification balances usability and security, as most security decisions do.",
          "Monitoring repeated wrong codes can reveal an attacker who already has the password.",
          "Server clocks should be synchronised with NTP so that drift stays small."
        ],
        "example": "A train door that stays open a few seconds either side of the timetable, but not for the whole afternoon.",
        "code": "window, step = 1, 30\nnow = 1_700_000_000\naccepted_counters = [(now + k * step) // step for k in range(-window, window + 1)]\nfor code_time in [now - 70, now - 25, now, now + 20, now + 65]:\n    ok = code_time // step in accepted_counters\n    print(f\"code from {code_time - now:+4} s -> {'accepted' if ok else 'rejected'}\")",
        "output": "code from  -70 s -> rejected\ncode from  -25 s -> accepted\ncode from   +0 s -> accepted\ncode from  +20 s -> accepted\ncode from  +65 s -> rejected",
        "codeNotes": [
          {
            "line": 3,
            "note": "Counters for the previous, current and next steps."
          }
        ],
        "tryIt": "Why is a code from 70 seconds ago rejected but one from 25 seconds ago accepted?",
        "check": {
          "question": "What does a verification window allow?",
          "options": [
            "Any old code",
            "Codes from neighbouring time steps, to handle clock drift",
            "Codes without a secret"
          ],
          "answer": 1,
          "why": "A small window tolerates drift."
        }
      },
      {
        "title": "MFA fatigue, phishing and recovery",
        "say": [
          "Attackers adapt. Real-time phishing kits relay the password and the TOTP code to the real site within seconds.",
          "MFA fatigue attacks bombard users with push prompts until someone taps approve; number matching (typing a number shown on screen) counters this.",
          "Security keys and passkeys (FIDO2/WebAuthn) are phishing-resistant because the browser only signs challenges for the genuine domain.",
          "Account recovery is often the weakest link: helpdesks tricked into resetting MFA have caused major breaches.",
          "Strong recovery requires identity checks, waiting periods and notifications to the user.",
          "The example scores a login flow for common MFA weaknesses.",
          "The goal is not perfect security but making attacks expensive enough that attackers move on.",
          "Passkeys, now supported by major platforms, replace passwords entirely with phishing-resistant key pairs.",
          "Educating users to never share codes, even with someone claiming to be support, remains important."
        ],
        "example": "A strong front door is little use if the locksmith will open it for anyone who phones and says they lost their key.",
        "code": "flow = {\"number matching on push\": False, \"phishing-resistant option offered\": True,\n        \"recovery needs identity check\": True, \"codes single-use\": False, \"rate limit on code entry\": True}\ngaps = [k for k, v in flow.items() if not v]\nprint(f\"MFA hardening score: {len(flow) - len(gaps)}/{len(flow)}\")\nprint(\"fix next:\", gaps)",
        "output": "MFA hardening score: 3/5\nfix next: ['number matching on push', 'codes single-use']",
        "codeNotes": [
          {
            "line": 3,
            "note": "List what is still missing."
          }
        ],
        "tryIt": "Which gap would stop an MFA fatigue attack?",
        "check": {
          "question": "Why are security keys resistant to phishing?",
          "options": [
            "They are expensive",
            "They only sign challenges for the genuine website domain",
            "They use SMS"
          ],
          "answer": 1,
          "why": "Domain binding defeats look-alike sites."
        }
      },
      {
        "title": "Practice time: generate and verify codes",
        "say": [
          "Practice 1: totp(secret_b32, t, step=30, digits=6). Decode the base32 key, pack t // step as 8 big-endian bytes, compute HMAC-SHA1, apply dynamic truncation and zero-pad to digits characters.",
          "The checks use three RFC 6238 test vectors (including one with a leading zero), the six-digit version, and the 30-second step behaviour.",
          "Practice 2: verify_totp(secret_b32, code, t, window=1). Compute the code for each step from -window to +window and accept if any matches, using hmac.compare_digest.",
          "The checks include the current code, the previous step, a code that is too old, a wider window, and a wrong code.",
          "After passing, add the secret JBSWY3DPEHPK3PXP to an authenticator app and compare its codes with your function.",
          "The example generates the current code for that secret at a fixed time.",
          "Milestone 2 tomorrow combines password hashing, TOTP and lockouts into one login engine.",
          "Implementing a real standard exactly, and proving it with official test vectors, is a valuable professional skill.",
          "Never log TOTP secrets or codes; treat them like passwords."
        ],
        "example": "A pair of synchronised watches: checking that yours matches the reference clock before relying on it.",
        "code": "import base64, hashlib, hmac, struct\n\ndef totp(secret, t, digits=6):\n    h = hmac.new(base64.b32decode(secret), struct.pack(\">Q\", t // 30), hashlib.sha1).digest()\n    o = h[-1] & 0x0F\n    return str((int.from_bytes(h[o:o + 4], \"big\") & 0x7FFFFFFF) % 10 ** digits).zfill(digits)\n\nt = 1_700_000_000\nprint(\"previous:\", totp(\"JBSWY3DPEHPK3PXP\", t - 30), \"| current:\", totp(\"JBSWY3DPEHPK3PXP\", t), \"| next:\", totp(\"JBSWY3DPEHPK3PXP\", t + 30))",
        "output": "previous: 822542 | current: 324550 | next: 367665",
        "codeNotes": [
          {
            "line": 9,
            "note": "The three codes a window of 1 would accept."
          }
        ],
        "tryIt": "Which of these three codes should be rejected if the user already logged in with the current one?",
        "check": {
          "question": "totp(secret, 1111111109, digits=8) for the RFC key returns?",
          "options": [
            "7081804",
            "07081804",
            "70818040"
          ],
          "answer": 1,
          "why": "Codes are zero-padded to the full length."
        }
      }
    ],
    "summary": [
      "MFA combines different factor types so a stolen password is not enough.",
      "TOTP: HMAC-SHA1 of a shared secret and the 30-second time step, truncated to digits.",
      "Test implementations against RFC vectors; zero-pad codes.",
      "Verify with a small window, constant-time comparison and single-use codes.",
      "Prefer phishing-resistant factors and protect account recovery."
    ],
    "projectStep": {
      "title": "Two-factor enrolment",
      "steps": [
        "Implement totp and verify_totp and test them with an authenticator app.",
        "Design enrolment: secret generation, QR code, backup codes.",
        "Write a recovery process that resists social engineering."
      ]
    }
  },
  {
    "day": 11,
    "title": "Authorization: Role-Based (RBAC) & Attribute-Based Access Control (ABAC)",
    "goal": "You can explain the difference between authentication and authorisation, implement role-based access control with role inheritance, write attribute-based rules, and apply deny-by-default and least privilege.",
    "minutes": 30,
    "recap": "Days 7 to 10 proved who a user is. Today asks the next question: what is that user allowed to do?",
    "parts": [
      {
        "title": "Authentication versus authorisation",
        "say": [
          "Authentication answers \"who are you?\", with passwords, tokens and MFA. Authorisation answers \"what may you do?\".",
          "Broken access control is number one in the OWASP Top 10 (2021): it is the most common serious web vulnerability.",
          "A perfectly authenticated user can still cause a breach if authorisation checks are missing or wrong.",
          "Authorisation must be enforced on the server for every request; hiding a button in the user interface is not a control.",
          "Deny by default: if no rule explicitly allows an action, it is refused.",
          "HTTP uses 401 for requests that are not authenticated and 403 for requests that are authenticated but not allowed, a distinction worth keeping in your own APIs.",
          "The example shows a user who is authenticated but not authorised.",
          "Every endpoint should answer two questions in order: is the user logged in, and may they perform this action on this resource?",
          "Centralising authorisation logic in one well-tested module prevents inconsistent checks scattered across the code.",
          "Logging authorisation failures helps detect users probing for access they should not have."
        ],
        "example": "A hotel key card: it proves you are a guest (authentication) but only opens your own room and the gym (authorisation).",
        "code": "user = {\"id\": \"u7\", \"logged_in\": True, \"permissions\": {\"read_reports\"}}\ndef request(action):\n    if not user[\"logged_in\"]:\n        return \"401 please log in\"\n    if action not in user[\"permissions\"]:\n        return \"403 forbidden\"\n    return \"200 ok\"\n\nfor action in [\"read_reports\", \"delete_reports\"]:\n    print(f\"{action:15} -> {request(action)}\")",
        "output": "read_reports    -> 200 ok\ndelete_reports  -> 403 forbidden",
        "codeNotes": [
          {
            "line": 4,
            "note": "401: not authenticated."
          },
          {
            "line": 6,
            "note": "403: authenticated but not authorised."
          }
        ],
        "tryIt": "Why is hiding the Delete button in the app not enough?",
        "check": {
          "question": "What does authorisation decide?",
          "options": [
            "Who the user is",
            "What the user is allowed to do",
            "The user's password"
          ],
          "answer": 1,
          "why": "Authorisation is about permissions."
        }
      },
      {
        "title": "Role-based access control",
        "say": [
          "Role-based access control (RBAC) assigns permissions to roles, and roles to users, instead of permissions directly to each person.",
          "Typical roles: viewer, editor, admin. Changing a person's job becomes a change of role, not dozens of permission edits.",
          "Roles can inherit: an admin has everything an editor has, who has everything a viewer has.",
          "Practice 1 is rbac_allowed(user_roles, permission, role_perms, parents), which follows inheritance chains and guards against cycles.",
          "Walking inheritance with a stack and a set of visited roles avoids infinite loops if someone configures a cycle by mistake.",
          "The example resolves all permissions a role ends up with.",
          "RBAC is simple and auditable, which is why it is the most common model in business software.",
          "Auditors can answer \"who can approve payments?\" by listing one role's members, which is much harder when permissions are assigned person by person.",
          "Too many narrowly defined roles (\"role explosion\") make RBAC hard to manage; review roles periodically.",
          "Separation of duties, such as preventing one person from both creating and approving a payment, is expressed with carefully designed roles."
        ],
        "example": "Job titles in a company: new staff get the access their title needs, instead of a custom list for each person.",
        "code": "perms = {\"viewer\": {\"read\"}, \"editor\": {\"write\"}, \"admin\": {\"delete\", \"manage_users\"}}\nparents = {\"admin\": [\"editor\"], \"editor\": [\"viewer\"]}\ndef effective(role):\n    stack, seen, result = [role], set(), set()\n    while stack:\n        r = stack.pop()\n        if r not in seen:\n            seen.add(r)\n            result |= perms.get(r, set())\n            stack.extend(parents.get(r, []))\n    return sorted(result)\n\nfor role in [\"viewer\", \"editor\", \"admin\"]:\n    print(f\"{role:7} -> {effective(role)}\")",
        "output": "viewer  -> ['read']\neditor  -> ['read', 'write']\nadmin   -> ['delete', 'manage_users', 'read', 'write']",
        "codeNotes": [
          {
            "line": 7,
            "note": "The seen set prevents loops."
          },
          {
            "line": 10,
            "note": "Follow inheritance upwards."
          }
        ],
        "tryIt": "Add a role \"auditor\" with only \"read\" and \"export\". Should it inherit from viewer?",
        "check": {
          "question": "What does RBAC assign permissions to?",
          "options": [
            "Individual users only",
            "Roles, which users are then given",
            "Computers"
          ],
          "answer": 1,
          "why": "Permissions attach to roles."
        }
      },
      {
        "title": "Attribute-based access control",
        "say": [
          "Attribute-based access control (ABAC) decides using attributes of the user, the resource, the action and the context.",
          "Example rule: a user may read a document if their clearance is at least the document's classification and they are in the same department, or the document is public.",
          "ABAC expresses fine-grained policies that would need hundreds of roles in RBAC, such as \"managers may approve expenses under ₹50,000 for their own team\".",
          "Practice 2 is abac_allowed(user, resource, action), with rules for read and edit, and denial for anything else.",
          "Context attributes, such as time of day, device health or location, connect ABAC to zero trust (Day 27).",
          "The example evaluates a clearance rule for several users.",
          "Many systems combine both: roles for broad access, attributes for the fine details.",
          "Policy languages such as AWS IAM policies, Open Policy Agent (Rego) and Cedar express ABAC rules outside application code.",
          "ABAC rules need tests just like code, because a small mistake can open access widely."
        ],
        "example": "A library where adults can borrow any book, children only from the children's section, and rare books only inside the reading room.",
        "code": "doc = {\"classification\": 2, \"department\": \"finance\", \"public\": False}\nusers = [{\"name\": \"Asha\", \"clearance\": 3, \"department\": \"finance\"},\n         {\"name\": \"Ravi\", \"clearance\": 1, \"department\": \"finance\"},\n         {\"name\": \"Meena\", \"clearance\": 4, \"department\": \"hr\"}]\nfor u in users:\n    ok = u[\"clearance\"] >= doc[\"classification\"] and (u[\"department\"] == doc[\"department\"] or doc[\"public\"])\n    print(f\"{u['name']:5} read -> {ok}\")",
        "output": "Asha  read -> True\nRavi  read -> False\nMeena read -> False",
        "codeNotes": [
          {
            "line": 6,
            "note": "Both the clearance and the department conditions must hold."
          }
        ],
        "tryIt": "Meena has high clearance but is refused. Is that the right outcome for a finance document?",
        "check": {
          "question": "What does ABAC use to make decisions?",
          "options": [
            "Only roles",
            "Attributes of user, resource, action and context",
            "Random choice"
          ],
          "answer": 1,
          "why": "Decisions come from attributes."
        }
      },
      {
        "title": "Least privilege and privilege creep",
        "say": [
          "Least privilege means every account has only the access it needs, for only as long as it needs it.",
          "Privilege creep happens when people change jobs and keep old access, slowly accumulating far more than their role requires.",
          "Regular access reviews, where managers confirm each person's access, remove unneeded permissions.",
          "Just-in-time access grants powerful permissions temporarily, for a specific task, with approval and automatic expiry.",
          "Service accounts used by programs need least privilege too; they are often forgotten and over-powered.",
          "The example compares what a user has with what their current role needs.",
          "Removing unused access is one of the cheapest, most effective security improvements.",
          "When people leave the organisation, removing all their access promptly is essential.",
          "Break-glass accounts for emergencies should be tightly controlled, monitored and tested."
        ],
        "example": "Returning the keys to your old office when you move desks, instead of keeping a growing bunch in your pocket.",
        "code": "has = {\"read\", \"write\", \"approve_payments\", \"manage_users\", \"export_data\"}\nrole_needs = {\"read\", \"write\"}\nexcess = sorted(has - role_needs)\nprint(\"access beyond current role:\", excess)\nprint(f\"remove {len(excess)} of {len(has)} permissions\")",
        "output": "access beyond current role: ['approve_payments', 'export_data', 'manage_users']\nremove 3 of 5 permissions",
        "codeNotes": [
          {
            "line": 3,
            "note": "Set difference finds unneeded permissions."
          }
        ],
        "tryIt": "Which excess permission is most dangerous to leave in place?",
        "check": {
          "question": "What is privilege creep?",
          "options": [
            "A slow computer",
            "Accumulating access over time beyond what the current role needs",
            "A type of malware"
          ],
          "answer": 1,
          "why": "Old access is never removed."
        }
      },
      {
        "title": "Testing authorisation",
        "say": [
          "Authorisation bugs are rarely found by normal testing, because testers usually use the \"right\" account.",
          "An authorisation matrix lists every role against every action with the expected result, and tests each cell.",
          "Include negative tests: each role trying actions it must not perform.",
          "Automate the matrix so every code change re-checks it; regressions in access control are common.",
          "Log and alert on repeated 403 responses from one user, which may indicate probing.",
          "The example runs a small authorisation matrix.",
          "A clear matrix is also excellent documentation for auditors and new developers.",
          "Test with real tokens against the real API, not only by calling the check function, to catch routes that forget to call it.",
          "Tomorrow focuses on the most common access-control bug in APIs: checking the role but not the specific object."
        ],
        "example": "A fire drill for every floor and every exit, not just the main staircase.",
        "code": "perms = {\"viewer\": {\"read\"}, \"editor\": {\"read\", \"write\"}, \"admin\": {\"read\", \"write\", \"delete\"}}\nexpected = {(\"viewer\", \"write\"): False, (\"editor\", \"write\"): True, (\"editor\", \"delete\"): False, (\"admin\", \"delete\"): True}\nfor (role, action), want in expected.items():\n    got = action in perms[role]\n    print(f\"{'PASS' if got == want else 'FAIL'} {role:6} {action:6} allowed={got}\")",
        "output": "PASS viewer write  allowed=False\nPASS editor write  allowed=True\nPASS editor delete allowed=False\nPASS admin  delete allowed=True",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each cell of the matrix is a test."
          }
        ],
        "tryIt": "Add the missing cells so every role and action is tested.",
        "check": {
          "question": "Why include negative tests in authorisation testing?",
          "options": [
            "They are faster",
            "Most access bugs are actions that should be denied but are allowed",
            "They are required by browsers"
          ],
          "answer": 1,
          "why": "Test what must fail, not only what must work."
        }
      },
      {
        "title": "Practice time: RBAC and ABAC",
        "say": [
          "Practice 1: rbac_allowed(user_roles, permission, role_perms, parents). Use a stack starting with the user's roles and a seen set; for each unseen role, return True if it has the permission, otherwise push its parents. Return False at the end.",
          "The checks include two-level inheritance, a denied permission, multiple roles and a cycle.",
          "Practice 2: abac_allowed(user, resource, action). read needs enough clearance and the same department or a public resource; edit needs enough clearance and ownership; other actions are denied.",
          "The checks include an owner, insufficient clearance, a public memo and an unknown action.",
          "After passing, write an authorisation matrix for a small app and test both functions against it.",
          "The example combines RBAC for the action with ABAC for the object.",
          "Tomorrow you will find and fix broken object-level authorisation, the bug behind many real API breaches.",
          "Deny by default runs through both functions: anything not explicitly allowed returns False.",
          "Clear, small authorisation functions are far easier to review than checks buried inside business logic."
        ],
        "example": "A building with keycards for floors (roles) and a receptionist who checks the specific meeting booking (attributes).",
        "code": "perms = {\"editor\": {\"read\", \"edit\"}}\nuser = {\"id\": \"u1\", \"roles\": [\"editor\"], \"clearance\": 2, \"department\": \"sales\"}\ndoc = {\"owner\": \"u2\", \"classification\": 1, \"department\": \"sales\", \"public\": False}\nrole_ok = any(\"edit\" in perms.get(r, set()) for r in user[\"roles\"])\nattr_ok = user[\"clearance\"] >= doc[\"classification\"] and user[\"id\"] == doc[\"owner\"]\nprint(\"role allows edit:\", role_ok, \"| attributes allow edit:\", attr_ok, \"| decision:\", role_ok and attr_ok)",
        "output": "role allows edit: True | attributes allow edit: False | decision: False",
        "codeNotes": [
          {
            "line": 4,
            "note": "RBAC: may editors edit at all?"
          },
          {
            "line": 5,
            "note": "ABAC: may this user edit this document?"
          }
        ],
        "tryIt": "Why does the editor still get refused here? Is that correct?",
        "check": {
          "question": "rbac_allowed with a cyclic inheritance should?",
          "options": [
            "Loop forever",
            "Finish and return the correct answer",
            "Raise RecursionError"
          ],
          "answer": 1,
          "why": "The seen set breaks cycles."
        }
      }
    ],
    "summary": [
      "Authentication proves identity; authorisation decides permissions, on the server, for every request.",
      "RBAC groups permissions into roles with inheritance.",
      "ABAC uses attributes of user, resource, action and context for fine-grained rules.",
      "Apply least privilege, review access regularly and remove privilege creep.",
      "Test authorisation with a full matrix including negative cases."
    ],
    "projectStep": {
      "title": "Access control model",
      "steps": [
        "Design roles and inheritance for a small company app.",
        "Implement rbac_allowed and abac_allowed with deny by default.",
        "Write and automate an authorisation matrix."
      ]
    }
  },
  {
    "day": 12,
    "title": "Broken Object Level Authorization (BOLA / IDOR) Defense",
    "goal": "You can explain broken object level authorisation (BOLA/IDOR), check ownership and sharing for every object request, find risky API routes automatically, and design APIs that are hard to misuse.",
    "minutes": 30,
    "recap": "Yesterday a role decided whether a user may edit invoices at all. Today asks a sharper question: may this user edit this particular invoice?",
    "parts": [
      {
        "title": "What BOLA and IDOR are",
        "say": [
          "Broken object level authorisation (BOLA), also called insecure direct object reference (IDOR), happens when an API trusts the object ID in a request without checking the user may access that object.",
          "A user viewing /invoices/501 changes the URL to /invoices/502 and sees someone else's invoice.",
          "BOLA is number one in the OWASP API Security Top 10 because it is easy to introduce and easy to exploit.",
          "Real incidents have exposed millions of records this way, often through mobile app APIs.",
          "The root cause is checking \"is the user logged in?\" and \"is the user an editor?\" but not \"does this object belong to them?\".",
          "Mobile apps are especially prone to it, because developers assume users cannot see or change the API calls the app makes.",
          "The example shows an API handler that forgets the ownership check.",
          "Every endpoint that takes an object ID must check access to that specific object.",
          "Automated scanners struggle to find BOLA because they cannot tell whose data is whose; manual testing with two accounts is effective.",
          "Logging access to sensitive objects helps detect enumeration attempts."
        ],
        "example": "A cloakroom that hands over any coat whose ticket number you say out loud, without checking your ticket.",
        "code": "invoices = {501: {\"owner\": \"u1\", \"amount\": 4200}, 502: {\"owner\": \"u2\", \"amount\": 98000}}\ndef get_invoice_unsafe(user_id, invoice_id):\n    return invoices.get(invoice_id)        # no ownership check\n\nprint(\"u1 asks for 501:\", get_invoice_unsafe(\"u1\", 501))\nprint(\"u1 asks for 502:\", get_invoice_unsafe(\"u1\", 502), \"<- someone else's invoice\")",
        "output": "u1 asks for 501: {'owner': 'u1', 'amount': 4200}\nu1 asks for 502: {'owner': 'u2', 'amount': 98000} <- someone else's invoice",
        "codeNotes": [
          {
            "line": 3,
            "note": "The missing check that causes BOLA."
          }
        ],
        "tryIt": "Write the one-line condition that fixes get_invoice_unsafe.",
        "check": {
          "question": "What causes BOLA?",
          "options": [
            "Weak passwords",
            "Not checking that the user may access the specific object requested",
            "Slow servers"
          ],
          "answer": 1,
          "why": "Object-level checks are missing."
        }
      },
      {
        "title": "Object-level checks",
        "say": [
          "The fix is an explicit check for every object: is the user the owner, is the object shared with them, or are they an administrator?",
          "Different actions need different rules: a shared user might read but not update or delete.",
          "Practice 1 is can_access(user, obj, action), which implements owner, shared-read and admin rules with deny by default.",
          "Return 404 Not Found rather than 403 when the user may not see an object, so attackers cannot even learn which IDs exist.",
          "Query databases with the user in the condition, for example WHERE id = ? AND owner_id = ?, so other users' rows are never loaded.",
          "The example applies the check to several requests.",
          "Centralising object checks in one helper ensures no endpoint forgets them.",
          "Code reviewers can then look for any data access that bypasses the helper, which is much easier than checking every endpoint's logic separately.",
          "Admin access to everything should itself be logged and reviewed, since admins are high-value targets.",
          "Shared access lists need maintenance too: remove sharing when it is no longer needed."
        ],
        "example": "A cloakroom attendant who compares your ticket with the tag on the coat before handing it over.",
        "code": "def can_access(user, obj, action):\n    if user[\"role\"] == \"admin\":\n        return True\n    if obj[\"owner_id\"] == user[\"id\"]:\n        return action in (\"read\", \"update\", \"delete\")\n    if user[\"id\"] in obj[\"shared_with\"]:\n        return action == \"read\"\n    return False\n\ninvoice = {\"owner_id\": \"u1\", \"shared_with\": [\"u2\"]}\nfor uid, action in [(\"u1\", \"delete\"), (\"u2\", \"read\"), (\"u2\", \"update\"), (\"u3\", \"read\")]:\n    print(f\"{uid} {action:6} -> {can_access({'id': uid, 'role': 'user'}, invoice, action)}\")",
        "output": "u1 delete -> True\nu2 read   -> True\nu2 update -> False\nu3 read   -> False",
        "codeNotes": [
          {
            "line": 8,
            "note": "Deny by default."
          }
        ],
        "tryIt": "Why might you return 404 rather than 403 to u3?",
        "check": {
          "question": "Which query helps prevent BOLA?",
          "options": [
            "SELECT * FROM invoices WHERE id = ?",
            "SELECT * FROM invoices WHERE id = ? AND owner_id = ?",
            "SELECT * FROM invoices"
          ],
          "answer": 1,
          "why": "Include the owner in the condition."
        }
      },
      {
        "title": "Guessable IDs",
        "say": [
          "Sequential IDs (501, 502, 503) make enumeration trivial: an attacker can loop through every number.",
          "Random identifiers such as UUIDs make guessing hard, which reduces exposure if a check is missing.",
          "But unguessable IDs are not a substitute for authorisation: IDs leak through logs, shared links and browser history.",
          "The correct approach is both: authorisation checks always, and non-sequential IDs as an extra layer.",
          "Rate limiting and monitoring for many 404 responses from one user catch enumeration attempts.",
          "The example contrasts guessing sequential and random IDs.",
          "Defence in depth again: several imperfect layers together are strong.",
          "Never expose internal database IDs in URLs just because it is convenient; convenience is how most of these bugs begin.",
          "Python's uuid.uuid4() and secrets.token_urlsafe() generate identifiers that are practically impossible to guess.",
          "Sharing links that grant access by secret token must be revocable and should expire."
        ],
        "example": "House numbers on a street are easy to walk along; a secret combination for each door is much harder, but you still need a lock.",
        "code": "import math\n\nsequential_ids = 1_000_000\nuuid_space = 2 ** 122                   # random bits in a version 4 UUID\nprint(\"sequential: an attacker needs at most\", f\"{sequential_ids:,}\", \"guesses to find every record\")\nprint(\"uuid4: about 10 to the power\", round(math.log10(uuid_space)), \"possibilities per guess\")",
        "output": "sequential: an attacker needs at most 1,000,000 guesses to find every record\nuuid4: about 10 to the power 37 possibilities per guess",
        "codeNotes": [
          {
            "line": 4,
            "note": "A UUID4 has 122 random bits."
          }
        ],
        "tryIt": "If a random ID appears in an email link that gets forwarded, what protects the data?",
        "check": {
          "question": "Do random IDs fix BOLA on their own?",
          "options": [
            "Yes",
            "No, IDs leak; authorisation checks are still required",
            "Only for small databases"
          ],
          "answer": 1,
          "why": "Obscurity is a layer, not a fix."
        }
      },
      {
        "title": "Finding risky routes",
        "say": [
          "In a large API, reviewing every route by hand is slow. A simple automated scan can prioritise the review.",
          "Routes with path parameters ending in id, such as /invoices/{invoice_id}, access specific objects and must check ownership.",
          "Practice 2 is idor_risks(routes), which flags routes with ID parameters whose metadata says they do not check ownership.",
          "In real projects, this metadata can come from decorators, OpenAPI documents or code analysis.",
          "The scan is a triage tool: flagged routes need human review, and unflagged routes are not guaranteed safe.",
          "The example lists routes and marks which ones need an object check.",
          "Adding such a scan to CI prevents new unprotected routes from being merged.",
          "Framework features such as Django's object-level permissions or policy middleware make the check harder to forget.",
          "Nested routes, like /users/{id}/orders/{order_id}, need both IDs checked, including that the order belongs to that user."
        ],
        "example": "A building inspector with a list of every door, marking which ones have no lock yet.",
        "code": "import re\n\nroutes = [(\"GET\", \"/invoices/{invoice_id}\", False), (\"GET\", \"/health\", False),\n          (\"DELETE\", \"/users/{id}\", True), (\"PUT\", \"/orders/{order_id}/address\", False)]\nfor method, path, checks_owner in routes:\n    has_id = bool(re.search(r\"\\{[a-z_]*id\\}\", path))\n    risk = has_id and not checks_owner\n    print(f\"{method:6} {path:30} {'RISK' if risk else 'ok'}\")",
        "output": "GET    /invoices/{invoice_id}         RISK\nGET    /health                        ok\nDELETE /users/{id}                    ok\nPUT    /orders/{order_id}/address     RISK",
        "codeNotes": [
          {
            "line": 6,
            "note": "Path parameters like {id} or {order_id}."
          }
        ],
        "tryIt": "Which route would you fix first, and why?",
        "check": {
          "question": "What does an IDOR route scan provide?",
          "options": [
            "A guarantee of safety",
            "A prioritised list of routes for human review",
            "Automatic fixes"
          ],
          "answer": 1,
          "why": "It triages; people still review."
        }
      },
      {
        "title": "Mass assignment and excessive data",
        "say": [
          "Two related API mistakes often appear alongside BOLA.",
          "Mass assignment: an API copies every field from the request into the object, so a user can send \"role\": \"admin\" or \"price\": 1 and have it saved.",
          "The fix is an allow-list of fields each role may set.",
          "Excessive data exposure: the API returns whole database objects, including fields the client does not display, such as password hashes or internal notes.",
          "The fix is explicit response schemas that include only the fields the client needs.",
          "The example filters an update request through an allow-list.",
          "Both mistakes come from convenience code that trusts the client too much.",
          "Serialisation libraries such as Pydantic make allow-listed input and output schemas easy.",
          "Reviewing API responses in the browser's developer tools often reveals excessive data within minutes."
        ],
        "example": "A form where you can only fill in the boxes printed on it, not write new instructions in the margins.",
        "code": "ALLOWED = {\"name\", \"phone\", \"address\"}\nupdate = {\"name\": \"Asha K\", \"phone\": \"9876543210\", \"role\": \"admin\", \"balance\": 1_000_000}\nsafe = {k: v for k, v in update.items() if k in ALLOWED}\nignored = sorted(set(update) - ALLOWED)\nprint(\"applied:\", safe)\nprint(\"ignored fields:\", ignored)",
        "output": "applied: {'name': 'Asha K', 'phone': '9876543210'}\nignored fields: ['balance', 'role']",
        "codeNotes": [
          {
            "line": 3,
            "note": "Only allow-listed fields are applied."
          }
        ],
        "tryIt": "Should ignored fields be silently dropped, or should the request be rejected? Argue both ways.",
        "check": {
          "question": "What is mass assignment?",
          "options": [
            "Assigning many users at once",
            "Copying all request fields into an object, letting users set fields they should not",
            "A database backup"
          ],
          "answer": 1,
          "why": "Allow-list writable fields."
        }
      },
      {
        "title": "Practice time: object checks and route scans",
        "say": [
          "Practice 1: can_access(user, obj, action). Admins can do anything; owners can read, update and delete; users in shared_with can only read; everyone else is denied.",
          "The checks include an owner deleting, a shared user reading and trying to update, a stranger guessing the ID, and an admin.",
          "Practice 2: idor_risks(routes). Flag routes whose path matches r\"\\{[a-z_]*id\\}\" and whose checks_owner is False, returning sorted \"METHOD path\" strings.",
          "The checks include two risky routes, a protected route and a route without parameters.",
          "After passing, draw your own API's routes, mark which check ownership, and run idor_risks.",
          "The example protects a handler with the object check.",
          "Tomorrow moves down the stack to the network: floods, scans and firewalls.",
          "BOLA is simple to prevent once you look for it; the challenge is remembering to look everywhere.",
          "Testing with two accounts, trying to access each other's objects, remains the most reliable way to find it."
        ],
        "example": "Checking every guest's ticket at every door, not just at the entrance.",
        "code": "invoices = {501: {\"owner_id\": \"u1\", \"shared_with\": []}, 502: {\"owner_id\": \"u2\", \"shared_with\": [\"u1\"]}}\ndef get_invoice(user_id, invoice_id):\n    inv = invoices.get(invoice_id)\n    if inv is None or (inv[\"owner_id\"] != user_id and user_id not in inv[\"shared_with\"]):\n        return \"404 not found\"\n    return f\"invoice {invoice_id}\"\n\nfor uid, iid in [(\"u1\", 501), (\"u1\", 502), (\"u3\", 501), (\"u1\", 999)]:\n    print(uid, iid, \"->\", get_invoice(uid, iid))",
        "output": "u1 501 -> invoice 501\nu1 502 -> invoice 502\nu3 501 -> 404 not found\nu1 999 -> 404 not found",
        "codeNotes": [
          {
            "line": 4,
            "note": "Missing and forbidden look the same: 404."
          }
        ],
        "tryIt": "Why can an attacker not tell whether invoice 501 exists?",
        "check": {
          "question": "idor_risks flags a route when?",
          "options": [
            "It is a GET route",
            "It has an ID parameter and does not check ownership",
            "It is slow"
          ],
          "answer": 1,
          "why": "ID parameter plus no ownership check."
        }
      }
    ],
    "summary": [
      "BOLA/IDOR: trusting object IDs without checking access to that object.",
      "Check owner, sharing and admin rules for every object; deny by default.",
      "Return 404 for forbidden objects and include the owner in queries.",
      "Random IDs help but never replace authorisation.",
      "Allow-list writable fields and returned fields to avoid mass assignment and data exposure."
    ],
    "projectStep": {
      "title": "API access review",
      "steps": [
        "Implement can_access and idor_risks.",
        "Test an API with two accounts trying to access each other's objects.",
        "Add allow-lists for input and output fields of one endpoint."
      ]
    }
  },
  {
    "day": 13,
    "title": "Network Security: TCP SYN Flood, Port Scanning & Stateful Firewalls",
    "goal": "You can explain how TCP connections start, how SYN floods and port scans work at a high level, detect flood sources from connection events, and write first-match firewall rules with default deny using Python's ipaddress module.",
    "minutes": 30,
    "recap": "So far the attacks targeted applications. Today you look at the network underneath: how connections start, how attackers abuse them, and how firewalls decide what gets through.",
    "parts": [
      {
        "title": "The TCP handshake",
        "say": [
          "TCP connections start with a three-way handshake: the client sends SYN, the server replies SYN-ACK, and the client answers ACK.",
          "Between the SYN and the ACK, the server keeps a \"half-open\" connection in memory, waiting for the client to finish.",
          "Ports identify services: 443 for HTTPS, 22 for SSH, 5432 for PostgreSQL.",
          "IP addresses identify machines; private ranges such as 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 are used inside organisations.",
          "Understanding the handshake explains both a classic attack and how firewalls track connections.",
          "Every service you expose starts with this handshake, so the more services you expose, the more doors an attacker can knock on.",
          "The example prints the handshake steps and the server state after each.",
          "Tools like Wireshark let you watch handshakes happen on your own machine, a great way to learn.",
          "UDP, used by DNS and video calls, has no handshake, which makes it easier to spoof and abuse in amplification attacks.",
          "Network defenders spend much of their time understanding what normal traffic looks like, so that abnormal traffic stands out."
        ],
        "example": "A phone call: you dial (SYN), they pick up and say hello (SYN-ACK), you say hello back (ACK), and only then does the conversation begin.",
        "code": "steps = [(\"client -> server\", \"SYN\", \"half-open connection reserved\"),\n         (\"server -> client\", \"SYN-ACK\", \"waiting for the client\"),\n         (\"client -> server\", \"ACK\", \"connection established\")]\nfor direction, packet, state in steps:\n    print(f\"{direction:17} {packet:8} server: {state}\")",
        "output": "client -> server  SYN      server: half-open connection reserved\nserver -> client  SYN-ACK  server: waiting for the client\nclient -> server  ACK      server: connection established",
        "codeNotes": [
          {
            "line": 1,
            "note": "The server reserves memory as soon as a SYN arrives."
          }
        ],
        "tryIt": "What happens to the server's memory if many clients send SYN and never send ACK?",
        "check": {
          "question": "What is a half-open TCP connection?",
          "options": [
            "A slow connection",
            "One where the server replied to SYN but the final ACK has not arrived",
            "An encrypted connection"
          ],
          "answer": 1,
          "why": "The handshake is incomplete."
        }
      },
      {
        "title": "SYN floods",
        "say": [
          "A SYN flood sends huge numbers of SYN packets, often from spoofed addresses, and never completes the handshake.",
          "The server's table of half-open connections fills up, and legitimate users cannot connect: a denial-of-service attack.",
          "Defences include SYN cookies (the server encodes state in its reply instead of storing it), shorter timeouts, rate limits per source, and upstream DDoS protection services.",
          "Detection looks for sources with many SYNs and few ACKs, the half-open count.",
          "Practice 1 is syn_flood_suspects(events, threshold), which computes half-open counts per IP and reports those above a threshold.",
          "The example counts half-open connections from a short event log.",
          "Large distributed attacks come from thousands of machines, which is why cloud providers offer DDoS protection at their network edge.",
          "Blocking by source IP helps against simple floods but not against spoofed or widely distributed ones.",
          "Availability, the A in CIA, is the target of every denial-of-service attack."
        ],
        "example": "Prank callers who ring a shop, make the assistant say hello, and hang up, over and over, so real customers get a busy tone.",
        "code": "events = [(\"10.0.0.5\", \"SYN\"), (\"10.0.0.5\", \"ACK\")] + [(\"203.0.113.9\", \"SYN\")] * 8 + [(\"198.51.100.2\", \"SYN\")] * 3 + [(\"198.51.100.2\", \"ACK\")] * 2\nhalf = {}\nfor ip, flag in events:\n    half[ip] = half.get(ip, 0) + (1 if flag == \"SYN\" else -1)\nfor ip, n in sorted(half.items(), key=lambda kv: -kv[1]):\n    print(f\"{ip:14} half-open {n}\")",
        "output": "203.0.113.9    half-open 8\n198.51.100.2   half-open 1\n10.0.0.5       half-open 0",
        "codeNotes": [
          {
            "line": 4,
            "note": "A SYN adds one; an ACK completes one."
          }
        ],
        "tryIt": "Which IP would you rate-limit? What threshold would you choose?",
        "check": {
          "question": "How do SYN cookies help?",
          "options": [
            "They encrypt traffic",
            "The server avoids storing state for half-open connections",
            "They block all SYN packets"
          ],
          "answer": 1,
          "why": "No table to fill up."
        }
      },
      {
        "title": "Port scanning",
        "say": [
          "A port scan checks which ports on a machine accept connections, revealing which services are running.",
          "Attackers scan to find targets; defenders scan their own networks to find services that should not be exposed.",
          "Tools such as Nmap are standard for authorised scanning; scanning systems you do not own or have permission to test may be illegal (Day 1).",
          "Scans are detectable: one source touching many ports on one machine, or one port on many machines, in a short time.",
          "The best defence is exposing as little as possible: close unused ports and put internal services behind firewalls or VPNs.",
          "The example detects a scan-like pattern from connection attempts.",
          "An exposed database or remote-desktop port on the internet is one of the most common causes of breaches.",
          "Search engines such as Shodan index exposed services worldwide, so assume anything open will be found quickly.",
          "Regular authorised scans of your own public addresses catch accidental exposures before attackers do."
        ],
        "example": "Someone walking down a hotel corridor trying every door handle to see which rooms are unlocked.",
        "code": "attempts = [(\"198.51.100.7\", p) for p in [21, 22, 23, 25, 80, 110, 143, 443, 3306, 3389]] + [(\"10.0.0.9\", 443), (\"10.0.0.9\", 443)]\nports_by_ip = {}\nfor ip, port in attempts:\n    ports_by_ip.setdefault(ip, set()).add(port)\nfor ip, ports in ports_by_ip.items():\n    print(f\"{ip:13} distinct ports {len(ports):2} -> {'possible scan' if len(ports) >= 8 else 'normal'}\")",
        "output": "198.51.100.7  distinct ports 10 -> possible scan\n10.0.0.9      distinct ports  1 -> normal",
        "codeNotes": [
          {
            "line": 4,
            "note": "Collect distinct ports per source."
          }
        ],
        "tryIt": "How might a slow scan, one port per hour, evade this detection?",
        "check": {
          "question": "What is the best defence against port scanning?",
          "options": [
            "Hiding the server name",
            "Exposing only the services you really need",
            "Using port 80 for everything"
          ],
          "answer": 1,
          "why": "Fewer open ports, smaller attack surface."
        }
      },
      {
        "title": "Firewall rules",
        "say": [
          "A firewall decides which traffic is allowed, using rules on source address, destination address, port and protocol.",
          "Rules are usually evaluated in order, and the first matching rule decides; if none matches, the default policy applies.",
          "Default deny is the secure choice: only explicitly allowed traffic gets through.",
          "Practice 2 is firewall(rules, src_ip, dst_port), which uses Python's ipaddress module to match addresses against networks such as 10.0.0.0/8.",
          "Order matters: a broad allow rule placed before a specific deny rule makes the deny rule useless.",
          "The example evaluates packets against a small rule set.",
          "Stateful firewalls also remember established connections, so replies are allowed back in automatically.",
          "Cloud security groups and Kubernetes network policies are firewalls expressed as configuration.",
          "Reviewing firewall rules periodically removes old \"temporary\" rules that were never cleaned up."
        ],
        "example": "A guest list at a private event, checked from top to bottom, with anyone not on the list turned away.",
        "code": "import ipaddress\n\nrules = [(\"deny\", \"203.0.113.0/24\", \"any\"), (\"allow\", \"10.0.0.0/8\", 22), (\"allow\", \"any\", 443)]\ndef decide(src, port):\n    ip = ipaddress.ip_address(src)\n    for action, net, p in rules:\n        if (net == \"any\" or ip in ipaddress.ip_network(net)) and (p == \"any\" or p == port):\n            return action\n    return \"deny\"\n\nfor src, port in [(\"10.2.3.4\", 22), (\"8.8.8.8\", 22), (\"8.8.8.8\", 443), (\"203.0.113.9\", 443)]:\n    print(f\"{src:12} :{port:<4} -> {decide(src, port)}\")",
        "output": "10.2.3.4     :22   -> allow\n8.8.8.8      :22   -> deny\n8.8.8.8      :443  -> allow\n203.0.113.9  :443  -> deny",
        "codeNotes": [
          {
            "line": 7,
            "note": "ip in ip_network checks membership of a range."
          },
          {
            "line": 9,
            "note": "Default deny."
          }
        ],
        "tryIt": "What would happen if the blocklist rule were moved to the end?",
        "check": {
          "question": "What does \"default deny\" mean for a firewall?",
          "options": [
            "Everything is allowed",
            "Traffic not explicitly allowed by a rule is blocked",
            "Only port 80 is blocked"
          ],
          "answer": 1,
          "why": "Unmatched traffic is refused."
        }
      },
      {
        "title": "Network segmentation",
        "say": [
          "Segmentation divides a network into zones, such as public web servers, internal applications, databases and staff laptops, with firewalls between them.",
          "If an attacker compromises one zone, segmentation stops them moving freely to others (lateral movement).",
          "Databases should accept connections only from the application servers that need them, never from the internet or staff Wi-Fi.",
          "A DMZ (demilitarised zone) holds internet-facing services separately from the internal network.",
          "Micro-segmentation (Day 27) applies the same idea between individual services.",
          "The example checks connections between zones against allowed paths.",
          "Segmentation is one of the most effective ways to limit the damage of ransomware.",
          "Flat networks, where every machine can reach every other, turn one infected laptop into a company-wide incident.",
          "Documenting which zones may talk to which makes both firewall rules and incident response clearer."
        ],
        "example": "Watertight compartments in a ship: a leak in one compartment does not sink the whole vessel.",
        "code": "allowed = {(\"internet\", \"web\"), (\"web\", \"app\"), (\"app\", \"db\"), (\"staff\", \"app\")}\nfor src, dst in [(\"internet\", \"web\"), (\"internet\", \"db\"), (\"staff\", \"db\"), (\"app\", \"db\")]:\n    print(f\"{src:8} -> {dst:4} {'allowed' if (src, dst) in allowed else 'BLOCKED'}\")",
        "output": "internet -> web  allowed\ninternet -> db   BLOCKED\nstaff    -> db   BLOCKED\napp      -> db   allowed",
        "codeNotes": [
          {
            "line": 1,
            "note": "Only these zone-to-zone paths are permitted."
          }
        ],
        "tryIt": "Why should staff laptops not connect directly to the database?",
        "check": {
          "question": "What does network segmentation limit?",
          "options": [
            "Download speed",
            "An attacker's ability to move between parts of the network",
            "The number of users"
          ],
          "answer": 1,
          "why": "It contains lateral movement."
        }
      },
      {
        "title": "Practice time: floods and firewalls",
        "say": [
          "Practice 1: syn_flood_suspects(events, threshold). Keep a dict of half-open counts per IP (SYN adds one, ACK subtracts one) and return the sorted IPs above the threshold.",
          "The checks include a normal client, a heavy flooder, a moderate one and an empty log.",
          "Practice 2: firewall(rules, src_ip, dst_port). Convert the source with ipaddress.ip_address; for each rule, match \"any\" or network membership for the source and \"any\" or equality for the port; return the first match's action, or \"deny\".",
          "The checks include internal SSH, external SSH falling to default deny, public HTTPS and a blocklisted network.",
          "After passing, write firewall rules for a three-tier web application and test them with a list of packets.",
          "The example combines detection and blocking: suspects are added as deny rules.",
          "Tomorrow returns to the web: HTTP security headers that turn on browser protections.",
          "Networks are the foundation; application security cannot fully compensate for an exposed database port.",
          "Automating the step from detection to a temporary block, with human review, is how many real defences work."
        ],
        "example": "A security desk that spots a troublemaker on camera and adds their name to the \"do not admit\" list.",
        "code": "import ipaddress\n\nevents = [(\"203.0.113.9\", \"SYN\")] * 20 + [(\"10.0.0.5\", \"SYN\"), (\"10.0.0.5\", \"ACK\")]\nhalf = {}\nfor ip, flag in events:\n    half[ip] = half.get(ip, 0) + (1 if flag == \"SYN\" else -1)\nrules = [(\"deny\", f\"{ip}/32\", \"any\") for ip, n in sorted(half.items()) if n > 10] + [(\"allow\", \"any\", 443)]\nprint(\"rules:\", rules)\nip = ipaddress.ip_address(\"203.0.113.9\")\nprint(\"flooder blocked:\", ip in ipaddress.ip_network(rules[0][1]))",
        "output": "rules: [('deny', '203.0.113.9/32', 'any'), ('allow', 'any', 443)]\nflooder blocked: True",
        "codeNotes": [
          {
            "line": 7,
            "note": "Detected suspects become deny rules at the top."
          }
        ],
        "tryIt": "What risk comes with automatically blocking IPs, given that source addresses can be spoofed?",
        "check": {
          "question": "firewall with no matching rule returns?",
          "options": [
            "allow",
            "deny",
            "None"
          ],
          "answer": 1,
          "why": "Default deny."
        }
      }
    ],
    "summary": [
      "TCP starts with SYN, SYN-ACK, ACK; half-open connections use server memory.",
      "SYN floods exhaust that memory; detect high half-open counts, use SYN cookies and DDoS protection.",
      "Port scans reveal services; expose as little as possible and scan yourself.",
      "Firewalls evaluate rules in order with default deny; order matters.",
      "Segment networks to stop lateral movement."
    ],
    "projectStep": {
      "title": "Network defence plan",
      "steps": [
        "Implement syn_flood_suspects and firewall.",
        "Design zones and firewall rules for a small company network.",
        "Test the rules with a list of allowed and forbidden connections."
      ]
    }
  },
  {
    "day": 14,
    "title": "Secure HTTP Headers: HSTS, X-Content-Type-Options & Frame-Options",
    "goal": "You can explain the main HTTP security headers (HSTS, CSP, X-Content-Type-Options, X-Frame-Options and Referrer-Policy), audit a site's headers with Python, parse HSTS values, and prevent clickjacking.",
    "minutes": 30,
    "recap": "Yesterday's firewalls filtered traffic. Today you configure the browser itself: a few response headers switch on powerful protections for every user.",
    "parts": [
      {
        "title": "Why security headers matter",
        "say": [
          "Browsers include many security features that stay off unless a website asks for them through HTTP response headers.",
          "A handful of headers, set once in the server or framework configuration, protect every page and every user.",
          "The most important are Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options (or CSP frame-ancestors) and Referrer-Policy.",
          "Missing headers are among the most common findings in security scans because they are easy to overlook.",
          "Tools such as securityheaders.com and the Mozilla Observatory grade a site's headers.",
          "The example lists the headers and what each protects against.",
          "Headers are defence in depth: they limit the damage of bugs such as XSS or clickjacking.",
          "They cost almost nothing to add, which makes them one of the best value security improvements available.",
          "Frameworks and reverse proxies such as Nginx can add headers globally, so no page is forgotten.",
          "Headers should be tested after every deployment, because configuration changes can silently remove them."
        ],
        "example": "Safety settings on a new car: seatbelt warnings and lane assist exist, but you have to switch some of them on.",
        "code": "headers = {\"Strict-Transport-Security\": \"force HTTPS on future visits\",\n           \"Content-Security-Policy\": \"limit where scripts and content can load from\",\n           \"X-Content-Type-Options\": \"stop the browser guessing file types\",\n           \"X-Frame-Options\": \"stop other sites framing your pages (clickjacking)\",\n           \"Referrer-Policy\": \"limit URLs leaked to other sites\"}\nfor name, purpose in headers.items():\n    print(f\"{name:26} {purpose}\")",
        "output": "Strict-Transport-Security  force HTTPS on future visits\nContent-Security-Policy    limit where scripts and content can load from\nX-Content-Type-Options     stop the browser guessing file types\nX-Frame-Options            stop other sites framing your pages (clickjacking)\nReferrer-Policy            limit URLs leaked to other sites",
        "codeNotes": [
          {
            "line": 1,
            "note": "Five headers that switch on browser protections."
          }
        ],
        "tryIt": "Which of these headers relates to Day 3's lesson on XSS?",
        "check": {
          "question": "Why are security headers valuable?",
          "options": [
            "They speed up pages",
            "They switch on browser protections for every page and user",
            "They replace HTTPS"
          ],
          "answer": 1,
          "why": "One configuration protects everything."
        }
      },
      {
        "title": "HSTS",
        "say": [
          "Strict-Transport-Security (HSTS) tells the browser to use only HTTPS for your domain for a period of time (max-age, in seconds).",
          "Without it, a user typing example.com may first connect over plain HTTP, giving an attacker on the network a chance to intercept or downgrade the connection (SSL stripping).",
          "A max-age of at least one year (31,536,000 seconds) is recommended, with includeSubDomains once all subdomains support HTTPS.",
          "The preload directive allows the domain to be added to browsers' built-in HSTS list, protecting even the very first visit.",
          "Practice 2 is parse_hsts(value), which extracts max-age and the two flags, and rejects values without max-age.",
          "The example parses two HSTS headers.",
          "Enable HSTS carefully: once browsers have seen it, the site must keep working over HTTPS for the whole max-age.",
          "Start with a short max-age, check everything works, then increase it.",
          "Removing a domain from the preload list takes months, so preload only when you are sure."
        ],
        "example": "A standing instruction to your post office: \"Always deliver my letters in sealed envelopes, for the next year, no exceptions.\"",
        "code": "def parse_hsts(value):\n    result = {\"max_age\": None, \"include_subdomains\": False, \"preload\": False}\n    for part in value.split(\";\"):\n        part = part.strip().lower()\n        if part.startswith(\"max-age=\"):\n            result[\"max_age\"] = int(part[8:])\n        elif part == \"includesubdomains\":\n            result[\"include_subdomains\"] = True\n        elif part == \"preload\":\n            result[\"preload\"] = True\n    return result\n\nprint(parse_hsts(\"max-age=63072000; includeSubDomains; preload\"))\nprint(parse_hsts(\"max-age=300\"))",
        "output": "{'max_age': 63072000, 'include_subdomains': True, 'preload': True}\n{'max_age': 300, 'include_subdomains': False, 'preload': False}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Directives are case-insensitive."
          }
        ],
        "tryIt": "Is the second header strong enough? What would you change?",
        "check": {
          "question": "What attack does HSTS prevent?",
          "options": [
            "SQL injection",
            "Downgrading or intercepting the first plain HTTP connection",
            "Password guessing"
          ],
          "answer": 1,
          "why": "HSTS forces HTTPS from the start."
        }
      },
      {
        "title": "Content types and clickjacking",
        "say": [
          "X-Content-Type-Options: nosniff stops the browser from guessing a file's type, so an uploaded \"image\" containing script is not run as JavaScript.",
          "Clickjacking loads your site in an invisible frame on a malicious page and tricks users into clicking buttons they cannot see, such as \"Transfer\" or \"Delete account\".",
          "X-Frame-Options: DENY (or SAMEORIGIN) stops other sites framing your pages.",
          "The modern replacement is the CSP directive frame-ancestors, for example frame-ancestors 'none'.",
          "Referrer-Policy: strict-origin-when-cross-origin stops full URLs, which may contain tokens or private paths, leaking to other sites.",
          "The example checks whether a page can be framed by another site.",
          "These headers are simple on/off switches with almost no downside for most sites.",
          "Check a sample of pages after enabling them, because a few features such as embedded payment pages may need adjusted settings.",
          "Sites that legitimately need framing, such as embeddable widgets, can list specific allowed parents in frame-ancestors.",
          "Permissions-Policy is another useful header that turns off browser features, such as camera or geolocation, that a site does not use."
        ],
        "example": "A transparent sheet laid over a real button panel, with fake labels painted on it: you think you are pressing one thing and press another.",
        "code": "def framing_allowed(headers):\n    h = {k.lower(): v for k, v in headers.items()}\n    if h.get(\"x-frame-options\", \"\").upper() in (\"DENY\", \"SAMEORIGIN\"):\n        return False\n    return \"frame-ancestors\" not in h.get(\"content-security-policy\", \"\")\n\nprint(\"no headers:\", framing_allowed({}))\nprint(\"X-Frame-Options DENY:\", framing_allowed({\"X-Frame-Options\": \"DENY\"}))\nprint(\"CSP frame-ancestors:\", framing_allowed({\"Content-Security-Policy\": \"frame-ancestors 'none'\"}))",
        "output": "no headers: True\nX-Frame-Options DENY: False\nCSP frame-ancestors: False",
        "codeNotes": [
          {
            "line": 2,
            "note": "Header names are case-insensitive."
          }
        ],
        "tryIt": "Which pages of a banking site are most important to protect from framing?",
        "check": {
          "question": "What does X-Frame-Options: DENY prevent?",
          "options": [
            "File type guessing",
            "Other sites loading your pages inside frames (clickjacking)",
            "Cookie theft"
          ],
          "answer": 1,
          "why": "No framing, no clickjacking."
        }
      },
      {
        "title": "Auditing headers",
        "say": [
          "A header audit checks a response for missing or weak security headers.",
          "Practice 1 is header_audit(headers), which reports HSTS (missing or max-age below one year), NOSNIFF, FRAMING and CSP problems.",
          "Header names are case-insensitive, so normalise them to lower case before checking.",
          "Returning a sorted list of problem codes makes the result easy to test, compare between releases and show in dashboards.",
          "Run the audit in CI against a staging environment so regressions are caught before release.",
          "The example audits a weak and a strong configuration.",
          "An audit like this takes minutes to build and can prevent entire classes of attacks.",
          "Comparing audit results between releases turns security headers into a measurable, trackable part of quality.",
          "Different pages can send different headers, so audit important pages individually, not just the home page.",
          "APIs that return only JSON need fewer headers, but nosniff and HSTS still apply."
        ],
        "example": "A safety inspector with a checklist of fire exits, alarms and extinguishers for each floor.",
        "code": "import re\n\ndef audit(headers):\n    h = {k.lower(): v for k, v in headers.items()}\n    problems = []\n    m = re.search(r\"max-age=(\\d+)\", h.get(\"strict-transport-security\", \"\"))\n    if not m or int(m.group(1)) < 31536000:\n        problems.append(\"HSTS\")\n    if h.get(\"x-content-type-options\", \"\").lower() != \"nosniff\":\n        problems.append(\"NOSNIFF\")\n    if \"content-security-policy\" not in h:\n        problems.append(\"CSP\")\n    return sorted(problems)\n\nprint(\"weak site:  \", audit({\"Strict-Transport-Security\": \"max-age=600\"}))\nprint(\"strong site:\", audit({\"strict-transport-security\": \"max-age=63072000\", \"x-content-type-options\": \"nosniff\", \"content-security-policy\": \"default-src 'self'\"}))",
        "output": "weak site:   ['CSP', 'HSTS', 'NOSNIFF']\nstrong site: []",
        "codeNotes": [
          {
            "line": 4,
            "note": "Normalise header names."
          },
          {
            "line": 7,
            "note": "At least one year."
          }
        ],
        "tryIt": "Add the FRAMING check from part 3 to this audit.",
        "check": {
          "question": "Why normalise header names to lower case?",
          "options": [
            "To save space",
            "HTTP header names are case-insensitive",
            "Browsers require lower case"
          ],
          "answer": 1,
          "why": "Content-Type and content-type are the same header."
        }
      },
      {
        "title": "Other hardening details",
        "say": [
          "Remove headers that reveal software versions, such as Server: Apache/2.4.29 or X-Powered-By: PHP/7.2, which help attackers find known vulnerabilities.",
          "Set Cache-Control: no-store on pages with private data, so shared computers and proxies do not keep copies.",
          "Use HTTPS redirects plus HSTS, and serve all resources over HTTPS to avoid mixed content.",
          "Configure CORS (Cross-Origin Resource Sharing) narrowly: never reflect any Origin while also allowing credentials.",
          "Error pages should not show stack traces, file paths or database errors to users.",
          "The example flags headers that leak version information.",
          "Small configuration details like these often decide whether a vulnerability is easy or hard to exploit.",
          "Configuration as code, stored in version control and reviewed, keeps these settings consistent across servers.",
          "Security baselines, such as the CIS benchmarks, list recommended settings for common servers."
        ],
        "example": "Not leaving the brand and model of your safe printed on the outside for every burglar to read.",
        "code": "import re\n\nresponse = {\"Server\": \"nginx/1.18.0\", \"X-Powered-By\": \"Express\", \"Cache-Control\": \"no-store\", \"Content-Type\": \"text/html\"}\nfor name, value in response.items():\n    leaks = name.lower() in (\"server\", \"x-powered-by\") and bool(re.search(r\"[A-Za-z]\", value))\n    print(f\"{name:14} {value:14} {'REMOVE or genericise' if leaks else 'ok'}\")",
        "output": "Server         nginx/1.18.0   REMOVE or genericise\nX-Powered-By   Express        REMOVE or genericise\nCache-Control  no-store       ok\nContent-Type   text/html      ok",
        "codeNotes": [
          {
            "line": 5,
            "note": "Server and X-Powered-By reveal software details."
          }
        ],
        "tryIt": "Why does knowing \"nginx/1.18.0\" help an attacker?",
        "check": {
          "question": "Why remove version information from headers?",
          "options": [
            "To save bandwidth",
            "It helps attackers find known vulnerabilities for that version",
            "Browsers reject it"
          ],
          "answer": 1,
          "why": "Less information, less targeting."
        }
      },
      {
        "title": "Practice time: audit and parse",
        "say": [
          "Practice 1: header_audit(headers). Lower-case the names; flag HSTS if max-age is missing or below 31,536,000; NOSNIFF unless the value is nosniff; FRAMING unless X-Frame-Options is DENY or SAMEORIGIN or the CSP contains frame-ancestors; CSP if it is missing. Return the sorted list.",
          "The checks include a strong configuration, a weak one with lower-case names, and an empty one.",
          "Practice 2: parse_hsts(value). Split on \";\", strip and lower-case each directive, read max-age (ValueError if missing or not digits), and set the two flags.",
          "The checks include a full header, upper-case directives and three invalid values.",
          "After passing, open the developer tools on a site you use, copy its response headers, and run your audit.",
          "The example audits a site and suggests the exact headers to add.",
          "Milestone 2 tomorrow combines passwords, TOTP and lockouts into a complete login engine.",
          "Adding the right headers is often a one-line configuration change with a large security benefit.",
          "Keep the audit in your toolkit; you can run it against any site you build from now on."
        ],
        "example": "A pre-opening inspection for a new shop: every safety sign in place before the doors open.",
        "code": "recommended = {\"Strict-Transport-Security\": \"max-age=31536000; includeSubDomains\",\n               \"X-Content-Type-Options\": \"nosniff\",\n               \"Content-Security-Policy\": \"default-src 'self'; frame-ancestors 'none'\",\n               \"Referrer-Policy\": \"strict-origin-when-cross-origin\"}\ncurrent = {\"x-content-type-options\": \"nosniff\"}\nmissing = [n for n in recommended if n.lower() not in current]\nfor name in missing:\n    print(f\"add  {name}: {recommended[name]}\")",
        "output": "add  Strict-Transport-Security: max-age=31536000; includeSubDomains\nadd  Content-Security-Policy: default-src 'self'; frame-ancestors 'none'\nadd  Referrer-Policy: strict-origin-when-cross-origin",
        "codeNotes": [
          {
            "line": 6,
            "note": "Compare case-insensitively."
          }
        ],
        "tryIt": "Why does the recommended CSP include frame-ancestors 'none'?",
        "check": {
          "question": "parse_hsts(\"includeSubDomains\") should?",
          "options": [
            "Return max_age 0",
            "Raise ValueError because max-age is required",
            "Return None"
          ],
          "answer": 1,
          "why": "HSTS without max-age is invalid."
        }
      }
    ],
    "summary": [
      "Security headers switch on browser protections for every page.",
      "HSTS forces HTTPS; use at least a year, add includeSubDomains and preload carefully.",
      "nosniff stops type guessing; X-Frame-Options or frame-ancestors stops clickjacking.",
      "Audit headers automatically and treat names case-insensitively.",
      "Hide version details, avoid stack traces and configure CORS narrowly."
    ],
    "projectStep": {
      "title": "Header hardening",
      "steps": [
        "Implement header_audit and parse_hsts.",
        "Audit three real sites and compare results.",
        "Write the exact header configuration for your own project."
      ]
    }
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete PKI Certificate Validation, Argon2id & TOTP MFA Auth Engine",
    "goal": "You can build a complete login engine that checks lockouts, salted password hashes and TOTP codes in the right order, design progressive lockouts, and reason about the security and usability trade-offs of each step.",
    "minutes": 30,
    "recap": "Milestone 2 combines cryptography (Day 6), password hashing (Day 7), certificates (Day 8), tokens (Day 9), MFA (Day 10), access control (Days 11 and 12) and headers (Day 14) around the most attacked page of any site: the login.",
    "parts": [
      {
        "title": "The login flow",
        "say": [
          "A secure login checks, in order: is the account locked? Is the password correct? Is the second factor correct?",
          "Checking the lockout first means a locked account cannot be used to test passwords, and it is cheaper than hashing.",
          "The password is verified against a slow, salted hash (Day 7) in constant time.",
          "Only after the password succeeds is the TOTP code checked (Day 10), with a small window for clock drift.",
          "On success, the server issues a session cookie or token (Days 4 and 9) and resets the failure counter.",
          "Practice 1 is login(user, password, code, t), returning LOCKED, BAD_PASSWORD, BAD_CODE or OK.",
          "The example prints the flow as a checklist.",
          "All of this happens over HTTPS with HSTS (Days 8 and 14), protected by rate limits and monitoring.",
          "A clear, testable flow is easier to secure than one with special cases scattered through the code."
        ],
        "example": "An airport: first check the passenger is not on a no-fly list, then the passport, then the boarding pass, and only then open the gate.",
        "code": "flow = [\"1. account locked?        -> stop with LOCKED\",\n        \"2. password hash matches? -> otherwise BAD_PASSWORD\",\n        \"3. TOTP code valid?       -> otherwise BAD_CODE\",\n        \"4. issue session, reset failure counter -> OK\"]\nprint(\"\\n\".join(flow))",
        "output": "1. account locked?        -> stop with LOCKED\n2. password hash matches? -> otherwise BAD_PASSWORD\n3. TOTP code valid?       -> otherwise BAD_CODE\n4. issue session, reset failure counter -> OK",
        "codeNotes": [
          {
            "line": 1,
            "note": "The cheapest, safest check goes first."
          }
        ],
        "tryIt": "Why should the TOTP code not be checked before the password?",
        "check": {
          "question": "Why check the lockout before the password?",
          "options": [
            "It is alphabetical",
            "Locked accounts cannot be used to test passwords, and it avoids expensive hashing",
            "Passwords are optional"
          ],
          "answer": 1,
          "why": "Stop early and cheaply."
        }
      },
      {
        "title": "What to tell the user",
        "say": [
          "Internally, the engine distinguishes BAD_PASSWORD and BAD_CODE for logging and lockout decisions.",
          "Externally, the user interface should say something general, such as \"Incorrect details\", to avoid confirming which part was right.",
          "Revealing that the password was correct but the code was wrong tells an attacker they have a valid password worth phishing a code for.",
          "Locked accounts should show a clear message about waiting or contacting support, and send a notification to the real account owner.",
          "Consistent response timing also matters: a very fast \"unknown user\" reply versus a slow hash for a known user reveals which accounts exist.",
          "The example maps internal results to user-facing messages.",
          "Good security messages are honest enough to help real users without helping attackers.",
          "Notifying users by email of new logins and failed attempts lets them spot attacks themselves.",
          "Support staff need a secure process for unlocking accounts that resists social engineering (Day 10)."
        ],
        "example": "A receptionist who says \"sorry, I can't let you in\" without explaining which of your documents was wrong.",
        "code": "shown = {\"OK\": \"Welcome back!\", \"BAD_PASSWORD\": \"Incorrect details. Please try again.\",\n         \"BAD_CODE\": \"Incorrect details. Please try again.\",\n         \"LOCKED\": \"Too many attempts. Try again later or reset your password.\"}\nfor result in [\"OK\", \"BAD_PASSWORD\", \"BAD_CODE\", \"LOCKED\"]:\n    print(f\"{result:12} -> {shown[result]}\")",
        "output": "OK           -> Welcome back!\nBAD_PASSWORD -> Incorrect details. Please try again.\nBAD_CODE     -> Incorrect details. Please try again.\nLOCKED       -> Too many attempts. Try again later or reset your password.",
        "codeNotes": [
          {
            "line": 2,
            "note": "Two different internal results share one message."
          }
        ],
        "tryIt": "What should happen behind the scenes when an account becomes locked?",
        "check": {
          "question": "Why show the same message for a wrong password and a wrong code?",
          "options": [
            "To save space",
            "So attackers cannot confirm that a password was correct",
            "Codes are unimportant"
          ],
          "answer": 1,
          "why": "Do not reveal partial success."
        }
      },
      {
        "title": "Progressive lockout",
        "say": [
          "Lockouts slow down online password guessing, but permanent lockouts let attackers deliberately lock out real users (a denial of service).",
          "Progressive lockouts increase the waiting time with each failure: a few free attempts, then 30 seconds, 60, 120 and so on, up to a cap.",
          "Practice 2 is lockout_seconds(failed), which returns 0 for fewer than 3 failures and 30 × 2 to the power (failed − 3) up to 3,600 seconds.",
          "Combine per-account lockouts with per-IP rate limits (Day 20), because attackers also try one common password against many accounts (password spraying).",
          "CAPTCHAs or proof-of-work challenges can replace hard lockouts for suspicious traffic.",
          "The example prints the lockout schedule.",
          "The goal is to make guessing slow for attackers while keeping mistakes cheap for real users.",
          "Resetting the counter after a successful login avoids punishing users for old mistakes.",
          "Monitoring many lockouts across accounts reveals large-scale attacks early."
        ],
        "example": "A phone that makes you wait longer after each wrong PIN, instead of wiping itself after three tries.",
        "code": "def lockout_seconds(failed):\n    return 0 if failed < 3 else min(3600, 30 * 2 ** (failed - 3))\n\nfor n in range(0, 11):\n    print(f\"{n:2} failures -> wait {lockout_seconds(n):4} s\")",
        "output": " 0 failures -> wait    0 s\n 1 failures -> wait    0 s\n 2 failures -> wait    0 s\n 3 failures -> wait   30 s\n 4 failures -> wait   60 s\n 5 failures -> wait  120 s\n 6 failures -> wait  240 s\n 7 failures -> wait  480 s\n 8 failures -> wait  960 s\n 9 failures -> wait 1920 s\n10 failures -> wait 3600 s",
        "codeNotes": [
          {
            "line": 2,
            "note": "Doubling with a one-hour cap."
          }
        ],
        "tryIt": "How many guesses per day could an attacker make against one account with this schedule?",
        "check": {
          "question": "What is password spraying?",
          "options": [
            "Many passwords against one account",
            "One common password tried against many accounts",
            "Encrypting passwords"
          ],
          "answer": 1,
          "why": "Per-IP limits catch spraying that per-account lockouts miss."
        }
      },
      {
        "title": "Putting the pieces together",
        "say": [
          "The login engine reuses earlier pieces: verify_password from Day 7 and the TOTP check from Day 10.",
          "Keeping each piece as a small, tested helper function makes the combined engine easy to read and audit.",
          "The engine returns a result code; separate code updates the failure counter, sets the lockout and writes the audit log.",
          "Separating decisions from side effects keeps the logic easy to test with plain inputs and outputs.",
          "The example runs the engine for a successful login and several failures.",
          "In production, a framework or identity provider (such as Auth0, Keycloak or Cognito) often supplies this engine; knowing how it works lets you configure it well.",
          "Whatever you use, test the whole flow with realistic attack scenarios.",
          "Never write your own cryptography, but do understand the flow that uses it.",
          "Audit logs of logins, failures and lockouts are the raw material for detection (Day 24)."
        ],
        "example": "An assembly of trusted parts, each already tested, bolted together according to a clear plan.",
        "code": "def login(user, pw_ok, code_ok):\n    if user[\"failed\"] >= 5:\n        return \"LOCKED\"\n    if not pw_ok:\n        return \"BAD_PASSWORD\"\n    if not code_ok:\n        return \"BAD_CODE\"\n    return \"OK\"\n\nfor failed, pw_ok, code_ok in [(0, True, True), (0, False, True), (2, True, False), (5, True, True)]:\n    print(f\"failed={failed} password={pw_ok!s:5} code={code_ok!s:5} -> {login({'failed': failed}, pw_ok, code_ok)}\")",
        "output": "failed=0 password=True  code=True  -> OK\nfailed=0 password=False code=True  -> BAD_PASSWORD\nfailed=2 password=True  code=False -> BAD_CODE\nfailed=5 password=True  code=True  -> LOCKED",
        "codeNotes": [
          {
            "line": 2,
            "note": "Lockout first."
          },
          {
            "line": 4,
            "note": "Then the password."
          },
          {
            "line": 6,
            "note": "Then the second factor."
          }
        ],
        "tryIt": "Which result should increase the failure counter? All of them, or only some?",
        "check": {
          "question": "Why keep decisions separate from side effects like logging?",
          "options": [
            "It is faster",
            "The decision logic becomes easy to test with plain inputs and outputs",
            "Logs are optional"
          ],
          "answer": 1,
          "why": "Pure functions are easy to test."
        }
      },
      {
        "title": "Threat model of the login page",
        "say": [
          "Applying STRIDE from Day 1 to the login page shows how the week's lessons fit together.",
          "Spoofing: stolen passwords, countered by hashing, MFA and breach checks. Tampering: modified requests, countered by TLS and CSRF protection.",
          "Repudiation: users denying logins, countered by audit logs. Information disclosure: leaked hashes or account existence, countered by slow hashes and uniform messages.",
          "Denial of service: deliberate lockouts and floods, countered by progressive lockouts and rate limits.",
          "Elevation of privilege: a normal user reaching admin functions, countered by authorisation checks after login.",
          "The example maps each STRIDE category to the control from this week that addresses it.",
          "A threat model like this is excellent documentation for reviews and audits.",
          "Revisit it whenever the login flow changes, for example when adding social login or passkeys.",
          "The same exercise works for any important feature, such as payments or password reset."
        ],
        "example": "A security guard's map of the building showing each entrance and the protection at each one.",
        "code": "controls = {\"Spoofing\": \"salted slow hashes + TOTP\", \"Tampering\": \"TLS + CSRF tokens\",\n            \"Repudiation\": \"login audit log\", \"Information disclosure\": \"uniform error messages\",\n            \"Denial of service\": \"progressive lockout + rate limits\", \"Elevation of privilege\": \"authorisation checks after login\"}\nfor threat, control in controls.items():\n    print(f\"{threat:23} -> {control}\")",
        "output": "Spoofing                -> salted slow hashes + TOTP\nTampering               -> TLS + CSRF tokens\nRepudiation             -> login audit log\nInformation disclosure  -> uniform error messages\nDenial of service       -> progressive lockout + rate limits\nElevation of privilege  -> authorisation checks after login",
        "codeNotes": [
          {
            "line": 1,
            "note": "Each STRIDE category has at least one control."
          }
        ],
        "tryIt": "Which control would you strengthen first for a banking app?",
        "check": {
          "question": "Which control addresses denial of service on the login page?",
          "options": [
            "Uniform error messages",
            "Progressive lockouts and rate limits",
            "TLS certificates"
          ],
          "answer": 1,
          "why": "Limits keep the service available."
        }
      },
      {
        "title": "Milestone practice: login and lockout",
        "say": [
          "Practice 1: login(user, password, code, t). Return LOCKED if user[\"failed\"] >= 5; verify the password against user[\"hash\"] (Day 7 format) or return BAD_PASSWORD; verify the six-digit TOTP against user[\"totp_secret\"] for steps -1, 0 and +1 or return BAD_CODE; otherwise OK. Use hmac.compare_digest for both comparisons.",
          "The checks build a real hash and real codes, then test success, a wrong password, an old code and a locked account with correct details.",
          "Practice 2: lockout_seconds(failed). Raise ValueError for negative counts; return 0 below 3 failures, otherwise 30 × 2**(failed − 3) capped at 3,600.",
          "The checks cover the first nine counts, the cap and a negative count.",
          "Congratulations on Milestone 2: you have built the core of a secure authentication system from first principles.",
          "Next week covers server-side request forgery, deserialisation, secrets, dependencies and API rate limiting.",
          "The example simulates a guessing attack against the engine and shows the lockout slowing it down.",
          "Keep these functions: tests built on them make excellent regression checks for any login system.",
          "Understanding every step means you can configure real identity providers confidently."
        ],
        "example": "A new bank vault door, installed and tested with the right key, a wrong key and a burglar's drill.",
        "code": "def lockout_seconds(failed):\n    return 0 if failed < 3 else min(3600, 30 * 2 ** (failed - 3))\n\ntotal_wait, failed = 0, 0\nfor attempt in range(1, 11):\n    total_wait += lockout_seconds(failed)\n    failed += 1                       # every guess is wrong\nprint(f\"10 wrong guesses took the attacker at least {total_wait} seconds of waiting\")",
        "output": "10 wrong guesses took the attacker at least 3810 seconds of waiting",
        "codeNotes": [
          {
            "line": 6,
            "note": "Wait before each attempt according to the failures so far."
          }
        ],
        "tryIt": "How much would 20 wrong guesses cost? Why does the cap matter for real users?",
        "check": {
          "question": "login for a user with failed = 5 and correct details returns?",
          "options": [
            "OK",
            "LOCKED",
            "BAD_CODE"
          ],
          "answer": 1,
          "why": "The lockout check comes first."
        }
      }
    ],
    "summary": [
      "Login order: lockout, then password, then second factor, then session.",
      "Show uniform messages; log detailed results internally.",
      "Progressive lockouts slow guessing without permanently locking out users.",
      "Build the engine from small tested helpers and keep side effects separate.",
      "Threat-model the login page with STRIDE and map each threat to a control."
    ],
    "projectStep": {
      "title": "Milestone 2: secure login engine",
      "steps": [
        "Implement login and lockout_seconds with real hashes and TOTP codes.",
        "Write tests for success, each failure type and lockout.",
        "Document the threat model and the user-facing messages."
      ]
    }
  },
  {
    "day": 16,
    "title": "Server-Side Request Forgery (SSRF) & Cloud Metadata Protection",
    "goal": "You can explain server-side request forgery, why cloud metadata endpoints make it dangerous, validate outbound URLs by scheme and IP range with Python's ipaddress module, and prefer allow-lists for outbound requests.",
    "minutes": 30,
    "recap": "Milestone 2 secured logins. The third week looks at attacks against the server's own behaviour, starting with tricking a server into making requests on the attacker's behalf.",
    "parts": [
      {
        "title": "What SSRF is",
        "say": [
          "Many applications fetch URLs supplied by users: link previews, webhooks, \"import from URL\" features, PDF generators that load images.",
          "Server-side request forgery (SSRF) abuses this: the attacker supplies an internal address, and the server fetches it from inside the network.",
          "The server can reach places the attacker cannot: internal admin panels, databases with web interfaces, and cloud metadata services.",
          "SSRF entered the OWASP Top 10 in 2021 because of several high-profile cloud breaches.",
          "The example shows the kinds of URLs an attacker might submit to a link-preview feature, as plain strings.",
          "Any feature that makes the server fetch a user-chosen URL needs SSRF defences.",
          "The danger grows with the server's privileges and network position, which is why least privilege matters here too.",
          "Blind SSRF, where the attacker never sees the response, can still probe internal networks by timing or trigger actions.",
          "Outbound requests from servers should be treated as carefully as inbound ones."
        ],
        "example": "Asking a trusted employee to \"please fetch the document from room 12\", where room 12 is the locked records office they have a key to.",
        "code": "submitted = [\"https://news.example.com/article\", \"http://127.0.0.1:8080/admin\",\n             \"http://169.254.169.254/latest/meta-data/\", \"http://10.0.0.12:5432/\"]\nfor url in submitted:\n    internal = any(x in url for x in (\"127.0.0.1\", \"169.254.\", \"//10.\"))\n    print(f\"{url:44} {'targets an internal address' if internal else 'public site'}\")",
        "output": "https://news.example.com/article             public site\nhttp://127.0.0.1:8080/admin                  targets an internal address\nhttp://169.254.169.254/latest/meta-data/     targets an internal address\nhttp://10.0.0.12:5432/                       targets an internal address",
        "codeNotes": [
          {
            "line": 4,
            "note": "A crude check just for this illustration; the practice uses the ipaddress module."
          }
        ],
        "tryIt": "Which of these would be most damaging on a cloud server, and why?",
        "check": {
          "question": "What does SSRF make the server do?",
          "options": [
            "Store passwords",
            "Fetch a URL chosen by the attacker, possibly on the internal network",
            "Crash immediately"
          ],
          "answer": 1,
          "why": "The server makes the request for the attacker."
        }
      },
      {
        "title": "Cloud metadata endpoints",
        "say": [
          "Cloud servers can query a special address, 169.254.169.254, to learn about themselves, including temporary credentials for the server's cloud role.",
          "If an attacker makes the server fetch that address through SSRF, they may obtain those credentials and access cloud resources such as storage buckets.",
          "The 2019 Capital One breach, affecting over 100 million customers, involved SSRF against the metadata service.",
          "Defences include AWS's IMDSv2, which requires a special token that a simple forged request cannot obtain, and giving servers minimal cloud permissions (Day 28).",
          "Other clouds have similar endpoints, such as metadata.google.internal.",
          "The example classifies addresses with the ipaddress module, including the link-local range that holds the metadata service.",
          "Blocking metadata access from applications that do not need it is an important hardening step.",
          "Container platforms add further internal endpoints, such as Kubernetes APIs, that also need protection.",
          "The metadata example shows why \"internal\" does not mean \"safe\"."
        ],
        "example": "A hotel room safe whose code is written on a card at reception: anyone who can send the porter to fetch the card can open the safe.",
        "code": "import ipaddress\n\nfor addr in [\"169.254.169.254\", \"10.1.2.3\", \"127.0.0.1\", \"8.8.8.8\"]:\n    ip = ipaddress.ip_address(addr)\n    print(f\"{addr:16} private={ip.is_private!s:5} loopback={ip.is_loopback!s:5} link_local={ip.is_link_local}\")",
        "output": "169.254.169.254  private=True  loopback=False link_local=True\n10.1.2.3         private=True  loopback=False link_local=False\n127.0.0.1        private=True  loopback=True  link_local=False\n8.8.8.8          private=False loopback=False link_local=False",
        "codeNotes": [
          {
            "line": 5,
            "note": "Properties built into ipaddress classify each address."
          }
        ],
        "tryIt": "Which property identifies the metadata address?",
        "check": {
          "question": "Why is 169.254.169.254 dangerous in SSRF attacks?",
          "options": [
            "It is a public website",
            "Cloud metadata there can hand out server credentials",
            "It is slow"
          ],
          "answer": 1,
          "why": "Metadata services expose credentials."
        }
      },
      {
        "title": "Validating URLs",
        "say": [
          "A basic SSRF check parses the URL, allows only http and https, and rejects internal hostnames and private, loopback, link-local, reserved or unspecified IP addresses.",
          "Practice 1 is ssrf_check(url), which returns (ok, reason) with reasons BAD_URL, INTERNAL_HOST or PRIVATE_IP.",
          "Schemes like file://, gopher:// and dict:// must be rejected; they can read local files or talk to internal services.",
          "Block-lists are hard to get right: attackers use decimal IPs (2130706433 for 127.0.0.1), IPv6 forms, and DNS names that resolve to internal addresses.",
          "A stronger check resolves the hostname and validates the resolved IP, then connects to that exact IP, to defeat DNS tricks such as DNS rebinding.",
          "The example runs the check on several URLs.",
          "Treat this check as one layer; tomorrow's allow-list idea is stronger where possible.",
          "Redirects are another trap: a safe URL can redirect to an internal one, so either disable redirects or check each hop.",
          "Network-level controls, such as a firewall that stops application servers reaching the metadata address, back up the code checks."
        ],
        "example": "A courier who refuses deliveries to \"the building's own back office\" and only goes to real street addresses.",
        "code": "import ipaddress\nimport re\n\ndef ssrf_check(url):\n    m = re.fullmatch(r\"(https?)://([^/:?#]+)(?::(\\d+))?([/?#].*)?\", url, re.IGNORECASE)\n    if not m:\n        return False, \"BAD_URL\"\n    host = m.group(2).lower()\n    if host == \"localhost\" or host.endswith(\".internal\"):\n        return False, \"INTERNAL_HOST\"\n    try:\n        ip = ipaddress.ip_address(host)\n    except ValueError:\n        return True, \"OK\"\n    bad = ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_unspecified\n    return (False, \"PRIVATE_IP\") if bad else (True, \"OK\")\n\nfor u in [\"https://api.example.com/v1\", \"http://169.254.169.254/\", \"file:///etc/passwd\", \"http://LOCALHOST/\"]:\n    print(f\"{u:28} {ssrf_check(u)}\")",
        "output": "https://api.example.com/v1   (True, 'OK')\nhttp://169.254.169.254/      (False, 'PRIVATE_IP')\nfile:///etc/passwd           (False, 'BAD_URL')\nhttp://LOCALHOST/            (False, 'INTERNAL_HOST')",
        "codeNotes": [
          {
            "line": 5,
            "note": "Only http and https URLs match."
          },
          {
            "line": 15,
            "note": "Reject every internal kind of address."
          }
        ],
        "tryIt": "A hostname like internal-app.company.example resolves to 10.0.0.8. Would this check catch it? What would?",
        "check": {
          "question": "Why must file:// URLs be rejected?",
          "options": [
            "They are slow",
            "They can read files from the server itself",
            "Browsers do not support them"
          ],
          "answer": 1,
          "why": "Only http and https should be fetched."
        }
      },
      {
        "title": "Allow-lists for outbound requests",
        "say": [
          "Where possible, allow only the specific hosts a feature needs, such as a payment provider or a partner's webhook domain.",
          "Allow-lists fail safe: anything not listed is refused, including tricks nobody thought of.",
          "Practice 2 is allowed_url(url, allowed_hosts), which requires https and an exact host match, rejecting look-alikes and userinfo tricks.",
          "The userinfo trick hides the real host after an @ sign: in https://good.com@evil.com the real host is evil.com.",
          "Suffix checks are risky: \"ends with example.com\" also matches attackerexample.com; exact matches or careful dot-prefixed suffixes are safer.",
          "The example checks several URLs against an allow-list.",
          "When users genuinely need arbitrary URLs, fetch them from an isolated service with no access to internal networks.",
          "Egress proxies, which all outbound traffic must pass through, enforce allow-lists centrally.",
          "Logging every outbound request helps investigate SSRF attempts afterwards."
        ],
        "example": "A company driver with a list of approved client addresses: any other destination needs a manager's approval.",
        "code": "import re\n\nallow = {\"api.partner.com\", \"hooks.example.com\"}\ndef allowed(url):\n    m = re.fullmatch(r\"(https?)://([^/:?#@]+)(?::\\d+)?([/?#].*)?\", url, re.IGNORECASE)\n    return bool(m) and m.group(1).lower() == \"https\" and m.group(2).lower() in allow\n\nfor u in [\"https://api.partner.com/orders\", \"https://api.partner.com.evil.io/\", \"https://api.partner.com@evil.io/\", \"http://hooks.example.com/\"]:\n    print(f\"{u:36} {allowed(u)}\")",
        "output": "https://api.partner.com/orders       True\nhttps://api.partner.com.evil.io/     False\nhttps://api.partner.com@evil.io/     False\nhttp://hooks.example.com/            False",
        "codeNotes": [
          {
            "line": 5,
            "note": "@ is excluded from the host part, so userinfo tricks fail to match."
          }
        ],
        "tryIt": "Why is an exact host match safer than checking that the URL starts with \"https://api.partner.com\"?",
        "check": {
          "question": "What is the userinfo trick?",
          "options": [
            "A password manager feature",
            "Putting a trusted name before @ so the real host comes after it",
            "A DNS record type"
          ],
          "answer": 1,
          "why": "https://trusted@evil goes to evil."
        }
      },
      {
        "title": "Designing features safely",
        "say": [
          "Ask first whether the feature really needs arbitrary URLs. Often a fixed list of integrations is enough.",
          "Run URL-fetching code in a separate, isolated service with no credentials and no route to internal networks.",
          "Disable automatic redirects or re-validate every redirect target.",
          "Limit response size, timeouts and content types, so the feature cannot be used for denial of service.",
          "Never return raw fetched content to the user if it could reveal internal data; return only what the feature needs, such as a title and thumbnail.",
          "The example shows a checklist for a link-preview feature.",
          "Secure design removes whole classes of bugs, rather than patching each one.",
          "Threat modelling with STRIDE (Day 1) at design time would flag SSRF for any \"fetch a URL\" feature.",
          "Security reviews should specifically ask \"can a user make our server fetch something?\" for every new feature."
        ],
        "example": "Building the post room in a separate hut, so a suspicious parcel cannot harm the main building.",
        "code": "design = {\"only https allowed\": True, \"internal IP ranges blocked\": True, \"redirects re-validated\": False,\n          \"runs in isolated service\": True, \"response size limited\": True, \"raw content returned\": False}\ngood_when_true = {k: v for k, v in design.items() if k != \"raw content returned\"}\ngaps = [k for k, v in good_when_true.items() if not v] + ([\"raw content returned\"] if design[\"raw content returned\"] else [])\nprint(\"remaining gaps:\", gaps)",
        "output": "remaining gaps: ['redirects re-validated']",
        "codeNotes": [
          {
            "line": 4,
            "note": "For \"raw content returned\", True would be the problem."
          }
        ],
        "tryIt": "What could go wrong if redirects are not re-validated?",
        "check": {
          "question": "Why run URL fetching in an isolated service?",
          "options": [
            "It is faster",
            "If abused, it cannot reach internal systems or credentials",
            "It is cheaper"
          ],
          "answer": 1,
          "why": "Isolation limits the damage."
        }
      },
      {
        "title": "Practice time: SSRF checks and allow-lists",
        "say": [
          "Practice 1: ssrf_check(url). Match the URL pattern (BAD_URL otherwise), lower-case the host, reject localhost and .internal names (INTERNAL_HOST), and reject private, loopback, link-local, reserved or unspecified IPs (PRIVATE_IP).",
          "The checks include a public host, the metadata endpoint, a private address with a port, loopback, a capitalised localhost, an internal DNS name, a file URL and a public IP.",
          "Practice 2: allowed_url(url, allowed_hosts). Match the pattern that excludes @ from the host, require https, and check the lower-cased host is exactly in the allow-list.",
          "The checks include an allowed host, capitals, plain http, a look-alike domain and the userinfo trick.",
          "After passing, list every feature in an app you know that fetches URLs and decide which defence each needs.",
          "The example runs both checks on a webhook configuration.",
          "Tomorrow covers another way servers get tricked: loading untrusted serialised data.",
          "Allow-lists where possible, careful block-lists where not, and isolation always.",
          "These checks belong in a shared library so every feature uses the same, tested logic."
        ],
        "example": "Two checkpoints for outgoing couriers: one refuses dangerous addresses, the other only allows approved destinations.",
        "code": "import ipaddress\nimport re\n\nwebhooks = [\"https://hooks.example.com/orders\", \"https://10.0.0.5/hook\", \"https://hooks.example.com.attacker.io/x\"]\nallow = {\"hooks.example.com\"}\nfor url in webhooks:\n    host = re.fullmatch(r\"https?://([^/:?#@]+).*\", url).group(1)\n    try:\n        private = ipaddress.ip_address(host).is_private\n    except ValueError:\n        private = False\n    print(f\"{url:42} private={private!s:5} allow-listed={host in allow}\")",
        "output": "https://hooks.example.com/orders           private=False allow-listed=True\nhttps://10.0.0.5/hook                      private=True  allow-listed=False\nhttps://hooks.example.com.attacker.io/x    private=False allow-listed=False",
        "codeNotes": [
          {
            "line": 9,
            "note": "Only IP-address hosts can be checked this way."
          },
          {
            "line": 12,
            "note": "Only the exact allowed host passes."
          }
        ],
        "tryIt": "Which check alone would have caught all the bad webhooks?",
        "check": {
          "question": "ssrf_check(\"http://169.254.169.254/\") returns?",
          "options": [
            "(True, \"OK\")",
            "(False, \"PRIVATE_IP\")",
            "(False, \"BAD_URL\")"
          ],
          "answer": 1,
          "why": "Link-local addresses are rejected."
        }
      }
    ],
    "summary": [
      "SSRF makes a server fetch attacker-chosen URLs, often inside the network.",
      "Cloud metadata endpoints can leak credentials; use IMDSv2 and least privilege.",
      "Allow only http and https and reject internal names and private IP ranges.",
      "Prefer exact host allow-lists; watch for look-alikes, userinfo and redirects.",
      "Isolate URL-fetching features and limit what they return."
    ],
    "projectStep": {
      "title": "Safe URL fetcher design",
      "steps": [
        "Implement ssrf_check and allowed_url.",
        "Design a link-preview service with isolation, limits and logging.",
        "Test it against twenty tricky URLs."
      ]
    }
  },
  {
    "day": 17,
    "title": "Insecure Deserialization & Remote Code Execution (RCE)",
    "goal": "You can explain why deserialising untrusted data can lead to remote code execution, prefer data-only formats such as JSON, enforce type allow-lists, and scan code for dangerous deserialisation calls with the ast module.",
    "minutes": 30,
    "recap": "Yesterday the server fetched something harmful. Today it loads something harmful: serialised objects that can run code the moment they are read.",
    "parts": [
      {
        "title": "Serialisation and its dangers",
        "say": [
          "Serialisation turns objects into bytes or text so they can be stored or sent; deserialisation turns them back into objects.",
          "Data-only formats such as JSON produce only plain values: strings, numbers, lists and dictionaries.",
          "Object formats such as Python's pickle, Java serialisation and some YAML loaders can recreate arbitrary objects, and creating certain objects can run code.",
          "If an attacker controls the serialised data, loading it can mean remote code execution (RCE): the attacker runs commands on your server.",
          "Python's own documentation warns: never unpickle data received from an untrusted or unauthenticated source.",
          "Attackers do not need to understand your application to exploit this; public tools generate malicious payloads for common libraries.",
          "The example shows that JSON parsing only ever produces plain data types.",
          "Insecure deserialisation appears in the OWASP Top 10 under \"Software and Data Integrity Failures\".",
          "Cookies, cache entries, message queues and uploaded files are common places where serialised objects hide.",
          "The safest rule is simple: use data-only formats for anything that crosses a trust boundary."
        ],
        "example": "Receiving flat-pack furniture with instructions, versus receiving a box that assembles itself, and does whatever it was programmed to do, the moment you open it.",
        "code": "import json\n\ntext = '{\"user\": \"asha\", \"roles\": [\"viewer\"], \"age\": 31, \"active\": true, \"manager\": null}'\ndata = json.loads(text)\nfor key, value in data.items():\n    print(f\"{key:8} -> {type(value).__name__}\")",
        "output": "user     -> str\nroles    -> list\nage      -> int\nactive   -> bool\nmanager  -> NoneType",
        "codeNotes": [
          {
            "line": 4,
            "note": "JSON can only produce plain data types."
          }
        ],
        "tryIt": "Why can a JSON document never contain a Python function or object?",
        "check": {
          "question": "Why is unpickling untrusted data dangerous?",
          "options": [
            "It is slow",
            "Recreating objects can run attacker-chosen code",
            "Pickle files are large"
          ],
          "answer": 1,
          "why": "Object deserialisation can execute code."
        }
      },
      {
        "title": "Type allow-lists",
        "say": [
          "Sometimes applications need typed data, for example an Order containing Items.",
          "A safe pattern is JSON with an explicit \"__type__\" field, where the application maps only allowed type names to its own classes.",
          "Anything outside the allow-list is rejected, however it is nested.",
          "Practice 1 is safe_load(text, allowed_types), which parses JSON and walks every nested dictionary and list to check \"__type__\" values.",
          "Recursion makes the walk simple: a helper checks a dictionary, then calls itself on each value; lists are handled the same way.",
          "The example walks a nested document and reports the types found.",
          "Allow-lists again: name what is permitted, refuse everything else.",
          "Schema validation libraries such as Pydantic or jsonschema add checks on fields and types as well.",
          "Setting limits on document size and nesting depth prevents denial-of-service through huge or deeply nested input."
        ],
        "example": "A customs officer with a list of permitted goods: anything not on the list is turned back, even if it is hidden inside another package.",
        "code": "import json\n\ndef types_in(node, found):\n    if isinstance(node, dict):\n        if \"__type__\" in node:\n            found.append(node[\"__type__\"])\n        for v in node.values():\n            types_in(v, found)\n    elif isinstance(node, list):\n        for v in node:\n            types_in(v, found)\n    return found\n\ndoc = json.loads('{\"__type__\": \"Order\", \"items\": [{\"__type__\": \"Item\"}, {\"__type__\": \"ShellCommand\"}]}')\nfound = types_in(doc, [])\nprint(\"types found:\", found, \"| not allowed:\", [t for t in found if t not in {\"Order\", \"Item\"}])",
        "output": "types found: ['Order', 'Item', 'ShellCommand'] | not allowed: ['ShellCommand']",
        "codeNotes": [
          {
            "line": 8,
            "note": "Recurse into dictionary values."
          },
          {
            "line": 11,
            "note": "And into list items."
          }
        ],
        "tryIt": "Why must the check go into nested lists, not just the top level?",
        "check": {
          "question": "What does a type allow-list do during deserialisation?",
          "options": [
            "Speeds it up",
            "Refuses any type not explicitly permitted, even deep inside the data",
            "Encrypts the data"
          ],
          "answer": 1,
          "why": "Only named types are accepted."
        }
      },
      {
        "title": "YAML and other loaders",
        "say": [
          "YAML is popular for configuration files. PyYAML's yaml.load with the default or full loader can create arbitrary Python objects.",
          "yaml.safe_load, or yaml.load with Loader=yaml.SafeLoader, restricts output to plain data types and should be used for anything untrusted.",
          "Similar issues exist in other ecosystems: Java's ObjectInputStream, .NET's BinaryFormatter and PHP's unserialize have all caused serious vulnerabilities.",
          "marshal, Python's internal format, is not designed for untrusted data either.",
          "Signing serialised data with an HMAC (Day 6) proves it came from you, but does not make unsafe formats safe if the key leaks.",
          "The example lists safe and unsafe loading functions.",
          "When reviewing code, any deserialisation of data that crosses a trust boundary deserves a close look.",
          "Configuration files edited only by trusted staff are lower risk, but safe loaders cost nothing and remove the risk entirely.",
          "Library upgrades have changed defaults over time, which is why explicit safe loaders are better than relying on defaults."
        ],
        "example": "Some kitchen gadgets only slice vegetables; others can do anything, including things you did not intend. Use the slicer for strangers' vegetables.",
        "code": "loaders = {\"json.loads\": \"safe: data only\", \"yaml.safe_load\": \"safe: data only\",\n           \"yaml.load(..., Loader=yaml.SafeLoader)\": \"safe: data only\",\n           \"yaml.load (default/full loader)\": \"UNSAFE for untrusted input\",\n           \"pickle.loads\": \"UNSAFE for untrusted input\", \"marshal.loads\": \"UNSAFE for untrusted input\"}\nfor fn, verdict in loaders.items():\n    print(f\"{fn:40} {verdict}\")",
        "output": "json.loads                               safe: data only\nyaml.safe_load                           safe: data only\nyaml.load(..., Loader=yaml.SafeLoader)   safe: data only\nyaml.load (default/full loader)          UNSAFE for untrusted input\npickle.loads                             UNSAFE for untrusted input\nmarshal.loads                            UNSAFE for untrusted input",
        "codeNotes": [
          {
            "line": 3,
            "note": "The same function is safe or unsafe depending on the loader."
          }
        ],
        "tryIt": "A colleague stores user sessions as pickled objects in a cookie. What would you recommend?",
        "check": {
          "question": "Which PyYAML call is safe for untrusted input?",
          "options": [
            "yaml.load(text)",
            "yaml.safe_load(text)",
            "yaml.full_load(text)"
          ],
          "answer": 1,
          "why": "safe_load produces only plain data."
        }
      },
      {
        "title": "Scanning code for dangerous calls",
        "say": [
          "Static analysis reads source code without running it and flags risky patterns.",
          "Python's ast module parses code into a tree; you can walk it to find calls such as pickle.loads or yaml.load.",
          "Practice 2 is dangerous_calls(source), which reports risky deserialisation calls, treating yaml.load with Loader=yaml.SafeLoader as safe.",
          "Because ast understands code structure, it avoids false alarms from comments or strings that merely mention pickle.",
          "Tools such as Bandit do exactly this for hundreds of security patterns in Python projects.",
          "The example lists every attribute call in a small snippet.",
          "Adding a scanner to CI stops dangerous patterns from being merged unnoticed.",
          "Static analysis finds candidates; a person decides whether the input can really be controlled by an attacker.",
          "Parsing untrusted code with ast is safe because nothing is executed."
        ],
        "example": "A proofreader who understands grammar, not just spelling, and can tell a quotation from an instruction.",
        "code": "import ast\n\nsource = \"import pickle, json\\n# pickle.loads is mentioned in a comment\\nx = json.loads(s)\\ny = pickle.loads(blob)\\n\"\nfor node in ast.walk(ast.parse(source)):\n    if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):\n        print(f\"line {node.lineno}: {node.func.value.id}.{node.func.attr}\")",
        "output": "line 3: json.loads\nline 4: pickle.loads",
        "codeNotes": [
          {
            "line": 4,
            "note": "Parse without running anything."
          },
          {
            "line": 6,
            "note": "Comments never appear as calls."
          }
        ],
        "tryIt": "How would you extend this to report only the risky calls?",
        "check": {
          "question": "Why use ast rather than searching the text for \"pickle.loads\"?",
          "options": [
            "It is shorter",
            "It understands code structure, ignoring comments and strings",
            "Text search is illegal"
          ],
          "answer": 1,
          "why": "Structure-aware scanning avoids false alarms."
        }
      },
      {
        "title": "Integrity of data and updates",
        "say": [
          "Deserialisation is part of a wider category: trusting data or code without verifying where it came from.",
          "Software updates, plugins, CI pipelines and package downloads all need integrity checks, such as signatures and hashes.",
          "The 2020 SolarWinds attack inserted malicious code into a trusted software update, reaching thousands of organisations.",
          "Verifying a download's SHA-256 hash against a published value detects corruption and tampering in transit.",
          "Signed commits, signed packages and reproducible builds strengthen trust in the software supply chain (Day 19).",
          "The example verifies a downloaded file's hash against the expected value.",
          "Trust must be earned by verification, not assumed from the source's reputation.",
          "Keep signing keys offline or in hardware modules, since a stolen signing key makes malicious updates look genuine.",
          "Least privilege for build systems limits what a compromised pipeline can do."
        ],
        "example": "Checking the seal on a medicine bottle before taking the tablets, even though you bought it from a trusted pharmacy.",
        "code": "import hashlib\n\ndownload = b\"installer contents version 2.4.1\"\npublished = hashlib.sha256(b\"installer contents version 2.4.1\").hexdigest()\ntampered = download + b\" + hidden extra\"\nfor label, data in [(\"original\", download), (\"tampered\", tampered)]:\n    ok = hashlib.sha256(data).hexdigest() == published\n    print(f\"{label:8} hash matches published value: {ok}\")",
        "output": "original hash matches published value: True\ntampered hash matches published value: False",
        "codeNotes": [
          {
            "line": 7,
            "note": "Compare with the value published by the vendor."
          }
        ],
        "tryIt": "If an attacker controls both the download and the web page showing the hash, is the check still useful?",
        "check": {
          "question": "What does verifying a download's published hash detect?",
          "options": [
            "Slow downloads",
            "Corruption or tampering of the file",
            "Viruses in general"
          ],
          "answer": 1,
          "why": "A mismatch means the file changed."
        }
      },
      {
        "title": "Practice time: safe loading and scanning",
        "say": [
          "Practice 1: safe_load(text, allowed_types). Parse with json.loads (invalid JSON raises ValueError), then recursively check every dictionary's \"__type__\" against allowed_types, raising ValueError for anything else. Return the data.",
          "The checks include allowed nested types, a forbidden type hidden inside a list, an unknown top-level type, invalid JSON and plain data without types.",
          "Practice 2: dangerous_calls(source). Parse with ast (SyntaxError becomes ValueError), find attribute calls on names, keep pickle.loads, pickle.load, marshal.loads and yaml.load except when yaml.load has Loader=yaml.SafeLoader, and return sorted unique names.",
          "The checks include duplicates, a safe yaml.load, JSON only and unparseable code.",
          "After passing, run dangerous_calls on a Python project you have and review every hit.",
          "The example scans a snippet and suggests the safe replacement for each finding.",
          "Tomorrow you will hunt for another dangerous thing hiding in code: hard-coded secrets.",
          "Data-only formats plus allow-lists remove this whole class of vulnerability.",
          "Scanners in CI keep it removed as the code base grows."
        ],
        "example": "A delivery bay that accepts only flat-pack boxes from approved suppliers, and an inspector who checks the paperwork for anything unusual.",
        "code": "import ast\n\nFIX = {\"pickle.loads\": \"json.loads with a schema\", \"yaml.load\": \"yaml.safe_load\"}\nsource = \"import pickle, yaml\\ncfg = yaml.load(text)\\nobj = pickle.loads(data)\\n\"\nfor node in ast.walk(ast.parse(source)):\n    if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):\n        name = f\"{node.func.value.id}.{node.func.attr}\"\n        if name in FIX:\n            print(f\"line {node.lineno}: {name} -> use {FIX[name]}\")",
        "output": "line 2: yaml.load -> use yaml.safe_load\nline 3: pickle.loads -> use json.loads with a schema",
        "codeNotes": [
          {
            "line": 8,
            "note": "Report only known risky calls with a suggested fix."
          }
        ],
        "tryIt": "Is yaml.load safe if the file is written only by your own deployment scripts? What could change that?",
        "check": {
          "question": "safe_load with a forbidden \"__type__\" nested in a list should?",
          "options": [
            "Ignore it",
            "Raise ValueError",
            "Remove that item"
          ],
          "answer": 1,
          "why": "Forbidden types anywhere are rejected."
        }
      }
    ],
    "summary": [
      "Object deserialisation of untrusted data can run attacker code.",
      "Use data-only formats such as JSON, with type allow-lists where types are needed.",
      "Use yaml.safe_load; never unpickle untrusted data.",
      "Scan code with ast for risky calls and review each finding.",
      "Verify the integrity of data, downloads and updates with hashes and signatures."
    ],
    "projectStep": {
      "title": "Deserialisation audit",
      "steps": [
        "Implement safe_load and dangerous_calls.",
        "Scan a project and replace every unsafe loader.",
        "Add a hash check for one file your project downloads."
      ]
    }
  },
  {
    "day": 18,
    "title": "Security Misconfiguration & Hardcoded Secrets Auditing: Shannon Entropy",
    "goal": "You can explain why hard-coded secrets are dangerous, measure randomness with Shannon entropy, scan code for keys and high-entropy tokens, and manage secrets properly with environment variables and secret managers.",
    "minutes": 30,
    "recap": "Yesterday you scanned code for dangerous calls. Today you scan it for dangerous data: passwords, API keys and tokens written straight into source files.",
    "parts": [
      {
        "title": "Secrets in code",
        "say": [
          "Developers sometimes paste API keys, database passwords or tokens directly into code \"just for now\".",
          "Once committed, secrets live forever in version control history, even if deleted in a later commit.",
          "Public repositories are scanned by attackers within minutes; leaked cloud keys are often abused for crypto-mining or data theft almost immediately.",
          "Even private repositories are risky: many people and tools can read them, and laptops get lost.",
          "Security misconfiguration, including exposed secrets, is in the OWASP Top 10.",
          "The example shows the kinds of lines a secret scanner looks for.",
          "The fix is to keep secrets out of code entirely and load them at runtime from a secure store.",
          "GitHub and other platforms scan public repositories and notify providers of leaked keys, but relying on that is too late.",
          "Pre-commit hooks can scan changes before they ever leave a developer's machine."
        ],
        "example": "Writing your PIN on the back of your bank card: convenient until the card is lost.",
        "code": "lines = [\"DB_HOST = \\\"db.internal\\\"\", \"DB_PASSWORD = \\\"Sup3r$ecretPassw0rd!\\\"\",\n         \"API_KEY = os_env_lookup(\\\"API_KEY\\\")\", \"aws_key = \\\"AKIAABCDEFGHIJKLMNOP\\\"\"]\nfor i, line in enumerate(lines, 1):\n    suspicious = (\"PASSWORD\" in line.upper() or \"AKIA\" in line) and \"lookup\" not in line\n    print(f\"line {i}: {'SUSPICIOUS' if suspicious else 'ok':10} {line}\")",
        "output": "line 1: ok         DB_HOST = \"db.internal\"\nline 2: SUSPICIOUS DB_PASSWORD = \"Sup3r$ecretPassw0rd!\"\nline 3: ok         API_KEY = os_env_lookup(\"API_KEY\")\nline 4: SUSPICIOUS aws_key = \"AKIAABCDEFGHIJKLMNOP\"",
        "codeNotes": [
          {
            "line": 4,
            "note": "A naive check; the practice uses patterns and entropy."
          }
        ],
        "tryIt": "Why is line 3 fine even though it mentions API_KEY?",
        "check": {
          "question": "Why is deleting a leaked secret in a new commit not enough?",
          "options": [
            "Deleting is slow",
            "The secret remains in version control history",
            "Git forbids deletion"
          ],
          "answer": 1,
          "why": "History keeps old versions; rotate the secret."
        }
      },
      {
        "title": "Shannon entropy",
        "say": [
          "Real secrets are usually random-looking strings, while ordinary words and variable names are not.",
          "That difference is measurable, which lets a program find secrets it has never seen before.",
          "Shannon entropy measures unpredictability: the average number of bits needed per character, based on how often each character appears.",
          "A string of one repeated letter has entropy 0; eight different equally common characters have 3 bits per character; random keys often score above 4.",
          "Practice 1 is entropy(s), computing the sum of -p × log2(p) over each distinct character.",
          "Secret scanners use entropy to spot random-looking strings that simple patterns miss.",
          "The example computes entropy for words, keys and repeated characters.",
          "Entropy is a heuristic: long English sentences and hashes of harmless data can also score high, so findings need review.",
          "Short strings give unreliable entropy values, which is why scanners only check strings of a minimum length.",
          "Password strength meters use related ideas to estimate how hard a password is to guess."
        ],
        "example": "Judging whether a jar of marbles was filled at random: all one colour is predictable, an even mix of many colours is not.",
        "code": "import math\nfrom collections import Counter\n\ndef entropy(s):\n    n = len(s)\n    return round(-sum(c / n * math.log2(c / n) for c in Counter(s).values()) + 0.0, 3)\n\nfor s in [\"aaaaaaaa\", \"password\", \"abcdefgh\", \"Xq7!vR2#pL9@zK4$\"]:\n    print(f\"{s:18} {entropy(s)} bits per character\")",
        "output": "aaaaaaaa           0.0 bits per character\npassword           2.75 bits per character\nabcdefgh           3.0 bits per character\nXq7!vR2#pL9@zK4$   4.0 bits per character",
        "codeNotes": [
          {
            "line": 6,
            "note": "Adding 0.0 turns -0.0 into 0.0 for the all-same case."
          }
        ],
        "tryIt": "Why does \"password\" score lower than \"abcdefgh\"?",
        "check": {
          "question": "What does a high Shannon entropy suggest about a string?",
          "options": [
            "It is a real word",
            "It looks random, like a key or token",
            "It is short"
          ],
          "answer": 1,
          "why": "Random-looking strings have high entropy."
        }
      },
      {
        "title": "Scanning for secrets",
        "say": [
          "Secret scanners combine patterns for known key formats with entropy checks for unknown ones.",
          "Known formats include AWS access keys (AKIA followed by 16 uppercase letters or digits), GitHub tokens (ghp_...), Stripe keys (sk_live_...) and private key headers.",
          "Entropy checks focus on assignments to names like key, secret, token or password, which reduces false positives.",
          "Practice 2 is find_secrets(text), reporting AWS_KEY pattern matches and HIGH_ENTROPY values with their line numbers.",
          "Tools such as gitleaks, trufflehog and GitHub secret scanning apply hundreds of such rules to code and history.",
          "The example scans a small configuration file.",
          "Scan both the current code and the full history, because old commits still contain old secrets.",
          "Allow-list known false positives, such as test fixtures, so real findings are not drowned out.",
          "Every confirmed finding needs the same response: rotate the secret, then remove it."
        ],
        "example": "A sniffer dog trained on specific smells (known key formats) plus a general alertness to anything unusual (entropy).",
        "code": "import re\n\nconfig = \"region = \\\"ap-south-1\\\"\\naws = \\\"AKIAABCDEFGHIJKLMNOP\\\"\\ntoken = \\\"n3K$8pQz!Lw2@Vx7rT5m\\\"\"\nfor i, line in enumerate(config.splitlines(), 1):\n    if re.search(r\"AKIA[0-9A-Z]{16}\", line):\n        print(f\"line {i}: AWS access key pattern\")\n    m = re.search(r\"(?i)(key|secret|token|password)\\w*\\s*=\\s*\\\"([^\\\"]{16,})\\\"\", line)\n    if m:\n        print(f\"line {i}: {m.group(1)} assignment with a long value, check its entropy\")",
        "output": "line 2: AWS access key pattern\nline 3: token assignment with a long value, check its entropy",
        "codeNotes": [
          {
            "line": 5,
            "note": "Known format."
          },
          {
            "line": 7,
            "note": "Suspicious assignment for the entropy check."
          }
        ],
        "tryIt": "Why does the region line not trigger anything?",
        "check": {
          "question": "Why do scanners combine patterns with entropy?",
          "options": [
            "It is faster",
            "Patterns catch known formats; entropy catches unknown random-looking secrets",
            "Entropy is required by law"
          ],
          "answer": 1,
          "why": "Each catches what the other misses."
        }
      },
      {
        "title": "Managing secrets properly",
        "say": [
          "Load secrets at runtime from environment variables or, better, a secrets manager such as AWS Secrets Manager, Google Secret Manager, Azure Key Vault or HashiCorp Vault.",
          "Secrets managers control who can read each secret, log every access, and support automatic rotation.",
          "Keep a .env file for local development out of version control with .gitignore, and provide a .env.example with placeholder values.",
          "Give each service its own credentials with least privilege, so one leak does not expose everything.",
          "Never log secrets, print them in error messages or send them in URLs.",
          "Masking secrets in logs, for example showing only the last four characters, keeps logs useful without exposing anything.",
          "The example builds configuration from a dictionary standing in for environment variables, failing clearly if a secret is missing.",
          "Good secret management makes rotation routine instead of an emergency.",
          "Short-lived credentials, issued automatically by the platform, avoid long-lived keys altogether.",
          "Document who owns each secret and how to rotate it, before you need to."
        ],
        "example": "Keeping spare keys in a locked key cabinet with a sign-out book, instead of under the doormat.",
        "code": "fake_environment = {\"DB_HOST\": \"db.internal\", \"DB_PASSWORD\": \"********\"}\ndef require(name):\n    value = fake_environment.get(name)\n    if not value:\n        raise RuntimeError(f\"missing required secret: {name}\")\n    return value\n\nprint(\"host:\", require(\"DB_HOST\"))\ntry:\n    require(\"PAYMENT_API_KEY\")\nexcept RuntimeError as e:\n    print(\"startup stopped:\", e)",
        "output": "host: db.internal\nstartup stopped: missing required secret: PAYMENT_API_KEY",
        "codeNotes": [
          {
            "line": 5,
            "note": "Fail loudly at start-up rather than running with missing secrets."
          }
        ],
        "tryIt": "Why should the error message name the missing secret but never print a secret's value?",
        "check": {
          "question": "Where should production secrets live?",
          "options": [
            "In the source code",
            "In a secrets manager or environment, loaded at runtime",
            "In the README"
          ],
          "answer": 1,
          "why": "Keep secrets out of code."
        }
      },
      {
        "title": "When a secret leaks",
        "say": [
          "Assume any secret that appeared in a repository, log, chat or screenshot is compromised.",
          "The first step is rotation: create a new secret, deploy it, and revoke the old one. Removing the text from code comes second.",
          "Then investigate: check the provider's logs for use of the leaked key between the leak and the revocation.",
          "Clean the history with tools such as git filter-repo if needed, but remember copies may already exist elsewhere.",
          "Record the incident, the cause and the fix, and add a scanner rule or pre-commit hook so it does not happen again.",
          "The example prints an incident checklist in order.",
          "Speed matters: automated attackers can use a leaked key within minutes.",
          "Practising rotation in advance makes the real event calm and quick.",
          "Blameless reviews encourage people to report leaks immediately rather than hide them."
        ],
        "example": "Losing your house keys: you change the locks first, then look for the keys, not the other way round.",
        "code": "steps = [\"rotate: issue a new key and deploy it\", \"revoke the leaked key\",\n         \"check provider logs for misuse since the leak\", \"remove the secret from code and history\",\n         \"add a scanner rule or pre-commit hook\", \"write a short incident report\"]\nfor i, step in enumerate(steps, 1):\n    print(f\"{i}. {step}\")",
        "output": "1. rotate: issue a new key and deploy it\n2. revoke the leaked key\n3. check provider logs for misuse since the leak\n4. remove the secret from code and history\n5. add a scanner rule or pre-commit hook\n6. write a short incident report",
        "codeNotes": [
          {
            "line": 1,
            "note": "Rotation comes before clean-up."
          }
        ],
        "tryIt": "Why is revoking the key more urgent than cleaning the git history?",
        "check": {
          "question": "What is the first response to a leaked API key?",
          "options": [
            "Delete the commit",
            "Rotate and revoke the key",
            "Wait and see"
          ],
          "answer": 1,
          "why": "A leaked key must stop working."
        }
      },
      {
        "title": "Practice time: entropy and scanning",
        "say": [
          "Practice 1: entropy(s). Return 0.0 for an empty string; otherwise count characters and return the rounded sum of -p × log2(p).",
          "The checks: all one character (0.0), two symbols (1.0), eight symbols (3.0), \"password\" (2.75), empty, and a random-looking secret above 3.9.",
          "Practice 2: find_secrets(text). For each numbered line, report (line, \"AWS_KEY\") for the AKIA pattern and (line, \"HIGH_ENTROPY\") for key/secret/token/password assignments with a quoted value of 16 or more characters and entropy of at least 3.5.",
          "The checks include a harmless host, an AWS key, two high-entropy secrets and a low-entropy password.",
          "After passing, run find_secrets over a real configuration file (with secrets removed first) and review the results.",
          "The example scans a file and prints a finding report.",
          "Tomorrow looks at code you did not write: your dependencies and their vulnerabilities.",
          "A scanner in CI plus a secrets manager turns leaks from disasters into rare, contained events.",
          "Tune thresholds using your own code base, balancing missed secrets against false alarms."
        ],
        "example": "A metal detector at the door and a safe inside: catch what slips through, and give valuables a proper home.",
        "code": "import math\nimport re\nfrom collections import Counter\n\ndef entropy(s):\n    return -sum(c / len(s) * math.log2(c / len(s)) for c in Counter(s).values()) + 0.0\n\ntext = \"debug = true\\nsecret_key = \\\"Zx8#qP2!mW7vL4@tR9sY\\\"\\npassword = \\\"aaaaaaaaaaaaaaaaaaaa\\\"\"\nfor i, line in enumerate(text.splitlines(), 1):\n    m = re.search(r\"(?i)(key|secret|token|password)\\w*\\s*=\\s*\\\"([^\\\"]{16,})\\\"\", line)\n    if m:\n        e = entropy(m.group(2))\n        print(f\"line {i}: entropy {e:.2f} -> {'HIGH_ENTROPY' if e >= 3.5 else 'low, probably a placeholder'}\")",
        "output": "line 2: entropy 4.32 -> HIGH_ENTROPY\nline 3: entropy 0.00 -> low, probably a placeholder",
        "codeNotes": [
          {
            "line": 13,
            "note": "Only random-looking values are reported."
          }
        ],
        "tryIt": "Should a password of twenty \"a\" characters be reported anyway? Why might it be a problem even with low entropy?",
        "check": {
          "question": "entropy(\"abab\") returns?",
          "options": [
            "0.5",
            "1.0",
            "2.0"
          ],
          "answer": 1,
          "why": "Two symbols, each half the time: 1 bit per character."
        }
      }
    ],
    "summary": [
      "Hard-coded secrets leak through history, forks and laptops; keep them out of code.",
      "Shannon entropy spots random-looking strings.",
      "Scanners combine known key patterns with entropy on suspicious assignments.",
      "Load secrets at runtime from a secrets manager; never log them.",
      "On a leak: rotate and revoke first, then investigate and clean up."
    ],
    "projectStep": {
      "title": "Secret hygiene",
      "steps": [
        "Implement entropy and find_secrets.",
        "Add a pre-commit or CI secret scan to a project.",
        "Write a rotation runbook for your most important secret."
      ]
    }
  },
  {
    "day": 19,
    "title": "Dependency Vulnerabilities: Software Bill of Materials (SBOM) & CVE Auditing",
    "goal": "You can explain software supply chain risk, read a software bill of materials, compare versions correctly to find vulnerable dependencies, summarise licences, and plan safe dependency updates.",
    "minutes": 30,
    "recap": "Yesterday you protected secrets in your own code. Most modern applications are mostly other people's code: open-source dependencies. Today you learn to track and secure them.",
    "parts": [
      {
        "title": "Your code is mostly dependencies",
        "say": [
          "A typical application uses dozens of direct dependencies, which bring in hundreds of indirect (transitive) ones.",
          "Every one of them is code written by someone else, running with your application's permissions.",
          "A vulnerability in any of them can become a vulnerability in your application.",
          "Log4Shell (2021) was a flaw in the widely used Java logging library Log4j that let attackers run code on countless servers; many organisations did not even know they used it.",
          "Attackers also target the supply chain directly: typosquatted package names, hijacked maintainer accounts and malicious updates.",
          "\"Using vulnerable and outdated components\" is in the OWASP Top 10.",
          "The example counts direct and transitive dependencies in a small tree.",
          "You cannot protect what you do not know you have, which is why inventories matter.",
          "Lock files, such as package-lock.json and poetry.lock, record exact versions so builds are reproducible.",
          "Fewer dependencies mean a smaller attack surface; question each new one."
        ],
        "example": "A restaurant that buys ingredients from many suppliers: a contaminated batch from any one of them can make diners ill.",
        "code": "tree = {\"my-app\": [\"web-framework\", \"http-client\", \"image-lib\"],\n        \"web-framework\": [\"templating\", \"routing\"], \"http-client\": [\"tls-helper\"],\n        \"image-lib\": [\"zip-lib\"], \"templating\": [\"markup-safe\"]}\ndef all_deps(pkg, seen=None):\n    seen = set() if seen is None else seen\n    for d in tree.get(pkg, []):\n        if d not in seen:\n            seen.add(d)\n            all_deps(d, seen)\n    return seen\n\nprint(\"direct:\", len(tree[\"my-app\"]), \"| total including transitive:\", len(all_deps(\"my-app\")))",
        "output": "direct: 3 | total including transitive: 8",
        "codeNotes": [
          {
            "line": 9,
            "note": "Recurse into each dependency's own dependencies."
          }
        ],
        "tryIt": "Which package here would you never have known about without walking the tree?",
        "check": {
          "question": "What are transitive dependencies?",
          "options": [
            "Packages you wrote",
            "Dependencies of your dependencies",
            "Deleted packages"
          ],
          "answer": 1,
          "why": "They come in indirectly."
        }
      },
      {
        "title": "SBOMs and CVEs",
        "say": [
          "A software bill of materials (SBOM) lists every component in an application with its version, like an ingredients label.",
          "Standard formats include CycloneDX and SPDX; many tools generate them automatically from lock files.",
          "Known vulnerabilities are catalogued as CVEs (Common Vulnerabilities and Exposures), each with an ID such as CVE-2021-44228 and a list of affected and fixed versions.",
          "Matching an SBOM against advisory databases (such as OSV, the GitHub Advisory Database or the NVD) reveals which components are vulnerable.",
          "Practice 1 is vulnerable(sbom, advisories), which flags components whose version is lower than the advisory's fixed version.",
          "The example prints a tiny SBOM.",
          "Governments increasingly require SBOMs for software they buy, making them a standard deliverable.",
          "Automated tools such as pip-audit, npm audit and OSV-Scanner do this matching for you in seconds.",
          "Keeping SBOMs for each release lets you answer \"are we affected?\" within minutes when a new CVE is announced.",
          "Not every CVE is exploitable in your use of a library, but checking is far better than guessing."
        ],
        "example": "The ingredients list on a food packet, checked against a recall notice from the food safety authority.",
        "code": "sbom = [{\"name\": \"web-framework\", \"version\": \"4.2.1\", \"license\": \"BSD-3-Clause\"},\n        {\"name\": \"yamlkit\", \"version\": \"5.3\", \"license\": \"MIT\"},\n        {\"name\": \"imgtools\", \"version\": \"9.0.0\", \"license\": \"MIT-CMU\"}]\nfor c in sbom:\n    print(f\"{c['name']:14} {c['version']:7} {c['license']}\")",
        "output": "web-framework  4.2.1   BSD-3-Clause\nyamlkit        5.3     MIT\nimgtools       9.0.0   MIT-CMU",
        "codeNotes": [
          {
            "line": 1,
            "note": "Each component: name, version and licence."
          }
        ],
        "tryIt": "What extra fields would help when a new vulnerability is announced?",
        "check": {
          "question": "What is an SBOM?",
          "options": [
            "A security bug",
            "A list of all components and versions in a piece of software",
            "A firewall rule"
          ],
          "answer": 1,
          "why": "A software ingredients list."
        }
      },
      {
        "title": "Comparing versions correctly",
        "say": [
          "Versions like 1.10.0 and 1.9.2 must be compared number by number, not as text: as text, \"1.10.0\" sorts before \"1.9.2\", which is wrong.",
          "Converting to tuples of integers, (1, 10, 0) versus (1, 9, 2), gives the correct order.",
          "Tuples also handle different lengths sensibly: (3, 1) is lower than (3, 1, 1).",
          "Real version schemes add pre-releases and build tags (1.2.0-rc1), which libraries such as packaging.version handle properly.",
          "A component is vulnerable if its version is below the fixed version (and at or above the first affected version, when advisories give one).",
          "The example shows text comparison getting the wrong answer.",
          "Small comparison bugs in security tools lead to missed vulnerabilities, so test them carefully.",
          "Semantic versioning suggests that patch updates (1.2.3 to 1.2.4) contain only fixes, making them low-risk to apply.",
          "Not every project follows semantic versioning strictly, so tests remain your real safety net.",
          "Major version updates may change behaviour, so they need more testing."
        ],
        "example": "Sorting house numbers alphabetically puts 10 before 9; any postman knows to compare them as numbers.",
        "code": "def ver(v):\n    return tuple(int(x) for x in v.split(\".\"))\n\npairs = [(\"1.10.0\", \"1.9.2\"), (\"3.1\", \"3.1.1\"), (\"2.31.0\", \"2.9.0\")]\nfor a, b in pairs:\n    print(f\"{a:7} < {b:7}? text says {a < b!s:5} | numbers say {ver(a) < ver(b)}\")",
        "output": "1.10.0  < 1.9.2  ? text says True  | numbers say False\n3.1     < 3.1.1  ? text says True  | numbers say True\n2.31.0  < 2.9.0  ? text says True  | numbers say False",
        "codeNotes": [
          {
            "line": 2,
            "note": "Split on dots and convert each part to an integer."
          }
        ],
        "tryIt": "Which pair does text comparison get wrong?",
        "check": {
          "question": "Why compare versions as tuples of integers?",
          "options": [
            "It is shorter",
            "Text comparison puts 1.10 before 1.9",
            "Tuples are encrypted"
          ],
          "answer": 1,
          "why": "Numbers must compare as numbers."
        }
      },
      {
        "title": "Licences",
        "say": [
          "Every open-source dependency has a licence that sets the rules for using it.",
          "Permissive licences (MIT, BSD, Apache 2.0) allow almost any use with attribution; copyleft licences (GPL, AGPL) can require you to publish your own source code in some situations.",
          "Organisations usually keep a policy of allowed and denied licences, reviewed with legal advice.",
          "Practice 2 is licence_summary(components, denied), counting licences and listing components with denied licences.",
          "SBOM tools report licences automatically, making compliance checks part of CI.",
          "The example counts licences in a small SBOM.",
          "Licence problems are not security bugs, but they can be serious legal and business risks.",
          "Unknown or missing licences deserve attention too, since using unlicensed code is legally unclear.",
          "This is general information, not legal advice; organisations should consult their legal team about licence policies."
        ],
        "example": "Rules for borrowing library books: some you can photocopy freely, some you must credit, and some come with conditions on what you do next.",
        "code": "from collections import Counter\n\nlicences = [\"MIT\", \"Apache-2.0\", \"MIT\", \"GPL-3.0\", \"BSD-3-Clause\", \"MIT\", \"AGPL-3.0\"]\ncounts = dict(sorted(Counter(licences).items()))\nprint(counts)\nprint(\"needs review:\", sorted({l for l in licences if l in {\"GPL-3.0\", \"AGPL-3.0\"}}))",
        "output": "{'AGPL-3.0': 1, 'Apache-2.0': 1, 'BSD-3-Clause': 1, 'GPL-3.0': 1, 'MIT': 3}\nneeds review: ['AGPL-3.0', 'GPL-3.0']",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sorted keys make the output stable."
          }
        ],
        "tryIt": "Why might a company building a closed-source web service treat AGPL-3.0 differently from GPL-3.0?",
        "check": {
          "question": "Which licence family can require you to share your own source code?",
          "options": [
            "Permissive (MIT)",
            "Copyleft (GPL/AGPL)",
            "None"
          ],
          "answer": 1,
          "why": "Copyleft licences carry sharing obligations."
        }
      },
      {
        "title": "Updating safely",
        "say": [
          "Tools such as Dependabot and Renovate open pull requests automatically when new versions or security fixes are released.",
          "Good tests make updates safe to merge; without tests, teams fear updates and fall dangerously behind.",
          "Prioritise updates by severity and exploitability: a critical, actively exploited CVE in an internet-facing component comes first.",
          "Pin exact versions in lock files and verify package hashes, so a compromised registry cannot silently swap code.",
          "Watch for typosquatting when adding packages: reqeusts or python-dateutils are not the packages you think.",
          "The example sorts findings into an update order.",
          "Keeping dependencies current in small steps is far easier than a huge upgrade years later.",
          "Remove unused dependencies; they add risk and give nothing back.",
          "Private package mirrors let organisations vet packages before developers can install them."
        ],
        "example": "Regular servicing of a car: small, routine checks prevent the big, expensive breakdown.",
        "code": "findings = [(\"image-lib\", \"HIGH\", True), (\"templating\", \"MEDIUM\", False), (\"zip-lib\", \"CRITICAL\", True), (\"routing\", \"LOW\", False)]\nrank = {\"CRITICAL\": 0, \"HIGH\": 1, \"MEDIUM\": 2, \"LOW\": 3}\nfor name, sev, internet_facing in sorted(findings, key=lambda f: (rank[f[1]], not f[2])):\n    print(f\"{name:11} {sev:8} internet-facing={internet_facing}\")",
        "output": "zip-lib     CRITICAL internet-facing=True\nimage-lib   HIGH     internet-facing=True\ntemplating  MEDIUM   internet-facing=False\nrouting     LOW      internet-facing=False",
        "codeNotes": [
          {
            "line": 3,
            "note": "Severity first, then internet-facing components."
          }
        ],
        "tryIt": "What extra information would change this order? (Hint: is there a public exploit?)",
        "check": {
          "question": "Why are good tests important for dependency updates?",
          "options": [
            "They make updates slower",
            "They make it safe to merge updates quickly",
            "They replace updates"
          ],
          "answer": 1,
          "why": "Confidence to update is a security control."
        }
      },
      {
        "title": "Practice time: CVEs and licences",
        "say": [
          "Practice 1: vulnerable(sbom, advisories). For each component and each advisory with the same name, convert versions to integer tuples and report (name, version, id) when the component version is lower than fixed_in. Return the sorted list.",
          "The checks include a vulnerable old version, a component exactly at the fixed version (safe), a 1.10 versus 1.9 comparison (safe) and a short version string (3.1 versus 3.1.1, vulnerable).",
          "Practice 2: licence_summary(components, denied). Return the total, a licence count dictionary with sorted keys, and the sorted names of components with denied licences.",
          "The checks include duplicate licences, two denied licences, sorted keys and an empty list.",
          "After passing, generate an SBOM for a real project (for example with pip-audit or a CycloneDX tool) and check it.",
          "The example turns findings into an update plan.",
          "Tomorrow protects APIs from abuse with rate limiting and secures mobile logins with PKCE.",
          "Supply chain security is a team habit: inventory, monitor, update and verify, continuously.",
          "Knowing your dependencies turns a scary headline CVE into a quick, calm check."
        ],
        "example": "A kitchen that checks its pantry against every recall notice and keeps receipts for everything it buys.",
        "code": "def ver(v):\n    return tuple(int(x) for x in v.split(\".\"))\n\nsbom = [(\"httpkit\", \"2.9.0\"), (\"yamlkit\", \"1.10.0\"), (\"imgtools\", \"3.1\")]\nadvisories = {\"httpkit\": \"2.31.0\", \"yamlkit\": \"1.9.2\", \"imgtools\": \"3.1.1\"}\nfor name, version in sbom:\n    fixed = advisories[name]\n    status = f\"UPGRADE to {fixed}\" if ver(version) < ver(fixed) else \"ok\"\n    print(f\"{name:9} {version:7} {status}\")",
        "output": "httpkit   2.9.0   UPGRADE to 2.31.0\nyamlkit   1.10.0  ok\nimgtools  3.1     UPGRADE to 3.1.1",
        "codeNotes": [
          {
            "line": 8,
            "note": "Numeric comparison decides."
          }
        ],
        "tryIt": "Would a text comparison have flagged yamlkit? Why would that be a false alarm?",
        "check": {
          "question": "Is a component at exactly the fixed_in version vulnerable?",
          "options": [
            "Yes",
            "No, only versions lower than fixed_in are",
            "Only on Linux"
          ],
          "answer": 1,
          "why": "The fixed version contains the fix."
        }
      }
    ],
    "summary": [
      "Most application code is dependencies, including transitive ones.",
      "SBOMs list components; CVE advisories list affected and fixed versions.",
      "Compare versions as integer tuples, never as text.",
      "Track licences against an approved policy.",
      "Update continuously with automation, tests, pinned versions and verified hashes."
    ],
    "projectStep": {
      "title": "Dependency review",
      "steps": [
        "Implement vulnerable and licence_summary.",
        "Generate an SBOM for a project and check it against an advisory list.",
        "Write an update plan ordered by risk."
      ]
    }
  },
  {
    "day": 20,
    "title": "API Security: Token Bucket Rate Limiting & OAuth 2.0 PKCE Flow",
    "goal": "You can explain API abuse and why rate limiting matters, implement a token bucket rate limiter, describe the OAuth 2.0 authorisation code flow, and compute PKCE code challenges exactly as RFC 7636 specifies.",
    "minutes": 30,
    "recap": "Yesterday secured the code you depend on. Today secures the APIs you expose: limiting how fast clients can call them, and letting apps log users in safely with OAuth.",
    "parts": [
      {
        "title": "Why rate limiting",
        "say": [
          "Without limits, a single client can call an API as fast as the network allows.",
          "Attackers exploit this for password guessing, scraping data, enumerating IDs (Day 12), sending spam and exhausting expensive resources such as AI calls or SMS messages.",
          "Rate limiting caps how many requests a client may make in a period, identified by API key, user, IP address or a combination.",
          "\"Unrestricted resource consumption\" is in the OWASP API Security Top 10.",
          "When a client exceeds the limit, the API returns HTTP 429 Too Many Requests, often with a Retry-After header.",
          "The example shows how quickly an unlimited attacker can try a list of guesses.",
          "Limits protect availability for everyone and make many attacks slow and noisy.",
          "Different endpoints need different limits: a login endpoint needs a much stricter limit than a product listing.",
          "Rate limits also protect your budget when each call costs money."
        ],
        "example": "A ticket counter that serves each person a few times per hour, so one person cannot buy up the whole show.",
        "code": "guesses_per_second = 500\ncommon_passwords = 100_000\nprint(f\"without limits: {common_passwords / guesses_per_second / 60:.1f} minutes to try every common password\")\nlimited_rate = 5 / 60                # five attempts per minute\nprint(f\"with 5 per minute: {common_passwords / limited_rate / 86400:.0f} days\")",
        "output": "without limits: 3.3 minutes to try every common password\nwith 5 per minute: 14 days",
        "codeNotes": [
          {
            "line": 4,
            "note": "Five attempts per minute, expressed per second."
          }
        ],
        "tryIt": "How would per-IP limits change if the attacker used 1,000 different IP addresses?",
        "check": {
          "question": "What HTTP status code signals a rate limit?",
          "options": [
            "404",
            "429",
            "500"
          ],
          "answer": 1,
          "why": "429 Too Many Requests."
        }
      },
      {
        "title": "The token bucket",
        "say": [
          "The token bucket is the most common rate-limiting algorithm.",
          "Each client has a bucket holding up to capacity tokens; tokens refill at a steady rate; each request spends one token; requests with no token are refused.",
          "It allows short bursts (up to the capacity) while enforcing an average rate over time.",
          "Practice 1 is a TokenBucket class with allow(now), refilling based on elapsed time and never exceeding capacity.",
          "Storing just two numbers per client, tokens and last time, makes it cheap enough to run for millions of clients.",
          "The example simulates a burst followed by steady requests.",
          "In distributed systems, buckets are often kept in a shared store such as Redis so all servers enforce the same limit.",
          "Related algorithms include leaky bucket, fixed window and sliding window counters, each with different burst behaviour.",
          "Choosing capacity and rate is a product decision: generous enough for real users, strict enough to stop abuse."
        ],
        "example": "A pass that holds up to five ride tickets and gives you a new ticket every minute: you can ride five times in a row, but not fifty.",
        "code": "capacity, rate = 3, 1.0\ntokens, last = float(capacity), None\nfor t in [0, 0, 0, 0, 0.5, 1.0, 5.0, 5.0, 5.0, 5.0]:\n    if last is not None:\n        tokens = min(capacity, tokens + (t - last) * rate)\n    last = t\n    allowed = tokens >= 1\n    if allowed:\n        tokens -= 1\n    print(f\"t={t:<4} {'ALLOW' if allowed else '429':5} tokens left {tokens:.1f}\")",
        "output": "t=0    ALLOW tokens left 2.0\nt=0    ALLOW tokens left 1.0\nt=0    ALLOW tokens left 0.0\nt=0    429   tokens left 0.0\nt=0.5  429   tokens left 0.5\nt=1.0  ALLOW tokens left 0.0\nt=5.0  ALLOW tokens left 2.0\nt=5.0  ALLOW tokens left 1.0\nt=5.0  ALLOW tokens left 0.0\nt=5.0  429   tokens left 0.0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Refill by elapsed time, capped at capacity."
          },
          {
            "line": 9,
            "note": "Spend a token only when allowing."
          }
        ],
        "tryIt": "Why does the request at t=5.0 not get 5 tokens back?",
        "check": {
          "question": "What does a token bucket allow?",
          "options": [
            "Unlimited requests",
            "Short bursts up to capacity while enforcing an average rate",
            "Exactly one request per second"
          ],
          "answer": 1,
          "why": "Bursts plus a long-run average."
        }
      },
      {
        "title": "OAuth 2.0 in brief",
        "say": [
          "OAuth 2.0 lets an application act on a user's behalf with another service (\"Sign in with Google\", \"Connect your calendar\") without ever seeing the user's password.",
          "In the authorisation code flow, the app sends the user to the authorisation server, the user logs in and consents, and the server redirects back with a short-lived code.",
          "The app exchanges that code for an access token, which it uses to call the API.",
          "The code travels through the browser, so an attacker who intercepts it (for example through a malicious app registered for the same redirect) could exchange it themselves.",
          "Confidential clients (server apps) prove themselves with a client secret; public clients (mobile and single-page apps) cannot keep a secret, so they need PKCE.",
          "The example prints the steps of the flow.",
          "OpenID Connect builds on OAuth 2.0 to add standard login, returning an ID token that describes the user.",
          "Scopes limit what the token may do, so request only the scopes you need.",
          "The state parameter protects the flow from CSRF (Day 4) and must be checked on return."
        ],
        "example": "A hotel giving a valet a key that only starts the car and opens nothing else, instead of your whole keyring.",
        "code": "steps = [\"app -> auth server: please let the user log in (with state + PKCE challenge)\",\n         \"user logs in and consents at the auth server\",\n         \"auth server -> app: redirect with a one-time code\",\n         \"app -> auth server: exchange code (+ PKCE verifier) for an access token\",\n         \"app -> API: call with the access token\"]\nfor i, s in enumerate(steps, 1):\n    print(f\"{i}. {s}\")",
        "output": "1. app -> auth server: please let the user log in (with state + PKCE challenge)\n2. user logs in and consents at the auth server\n3. auth server -> app: redirect with a one-time code\n4. app -> auth server: exchange code (+ PKCE verifier) for an access token\n5. app -> API: call with the access token",
        "codeNotes": [
          {
            "line": 1,
            "note": "The challenge goes out first."
          },
          {
            "line": 4,
            "note": "The verifier proves it is the same app."
          }
        ],
        "tryIt": "At which step does the app first learn anything secret about the user?",
        "check": {
          "question": "What problem does OAuth solve?",
          "options": [
            "Faster logins",
            "Letting apps act for a user without seeing their password",
            "Encrypting disks"
          ],
          "answer": 1,
          "why": "Delegated access without sharing passwords."
        }
      },
      {
        "title": "PKCE",
        "say": [
          "PKCE (Proof Key for Code Exchange, RFC 7636, pronounced \"pixy\") protects the authorisation code flow for public clients.",
          "The app creates a random code verifier (43 to 128 characters) and sends only its SHA-256 hash, the code challenge, at the start of the flow.",
          "When exchanging the code, the app sends the original verifier; the server hashes it and checks it matches the challenge.",
          "An attacker who steals the code does not know the verifier, so the stolen code is useless.",
          "Practice 2 is pkce_challenge(verifier), which validates the verifier and returns the base64url-encoded SHA-256 hash without padding, tested with the RFC's example.",
          "The example computes the challenge for the RFC 7636 test verifier.",
          "Current best practice (OAuth 2.1) recommends PKCE for all clients, not just public ones.",
          "The verifier must come from a secure random generator, such as the secrets module.",
          "Using the \"plain\" method, where challenge equals verifier, defeats the purpose; always use S256."
        ],
        "example": "Showing the cloakroom attendant a torn half of a ticket; only the person holding the matching other half can collect the coat.",
        "code": "import base64\nimport hashlib\n\nverifier = \"dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk\"      # RFC 7636 example\nchallenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b\"=\").decode()\nprint(\"challenge:\", challenge)\nprint(\"matches RFC:\", challenge == \"E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM\")",
        "output": "challenge: E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM\nmatches RFC: True",
        "codeNotes": [
          {
            "line": 5,
            "note": "SHA-256, then base64url without padding."
          }
        ],
        "tryIt": "Why is it safe to send the challenge openly but not the verifier?",
        "check": {
          "question": "What does PKCE stop?",
          "options": [
            "Password guessing",
            "An attacker using a stolen authorisation code",
            "SQL injection"
          ],
          "answer": 1,
          "why": "Without the verifier, the code cannot be exchanged."
        }
      },
      {
        "title": "Other API protections",
        "say": [
          "Authenticate every API call, preferably with short-lived tokens (Day 9), and authorise every object (Day 12).",
          "Validate request sizes, field types and allowed values; reject unexpected fields (mass assignment, Day 12).",
          "Paginate list endpoints with a maximum page size, so one call cannot return a million records.",
          "Return consistent errors without internal details, and log security-relevant events for monitoring (Day 24).",
          "Keep an inventory of all API versions and endpoints; forgotten old versions (\"zombie APIs\") often lack newer protections.",
          "The example enforces a maximum page size.",
          "API security is the sum of many small, consistent controls applied to every endpoint.",
          "API gateways centralise many of these controls: authentication, rate limits, size limits and logging.",
          "Tomorrow's milestone combines rate limiting with SSRF protection in a small gateway."
        ],
        "example": "A library that lends at most ten books at a time, whatever the borrower asks for.",
        "code": "MAX_PAGE = 100\ndef page_size(requested):\n    try:\n        n = int(requested)\n    except (TypeError, ValueError):\n        return 20\n    return max(1, min(n, MAX_PAGE))\n\nfor req in [\"50\", \"100000\", \"-5\", \"abc\", None]:\n    print(f\"requested {req!r:9} -> served {page_size(req)}\")",
        "output": "requested '50'      -> served 50\nrequested '100000'  -> served 100\nrequested '-5'      -> served 1\nrequested 'abc'     -> served 20\nrequested None      -> served 20",
        "codeNotes": [
          {
            "line": 7,
            "note": "Clamp to a safe range; bad input gets the default."
          }
        ],
        "tryIt": "Why clamp rather than reject large page sizes? When would rejecting be better?",
        "check": {
          "question": "What are zombie APIs?",
          "options": [
            "Very fast APIs",
            "Forgotten old API versions that lack current protections",
            "APIs that return errors"
          ],
          "answer": 1,
          "why": "Old endpoints are often unprotected."
        }
      },
      {
        "title": "Practice time: buckets and PKCE",
        "say": [
          "Practice 1: TokenBucket(capacity, rate). Store capacity, rate, tokens (starting full) and the last time (None at first). In allow(now), refill by (now - last) × rate if there was a previous call, cap at capacity, record now, and spend a token if at least one is available.",
          "The checks include a burst of three then refusal, half a token (refused), refill after a second, refill capped after a long gap, and a slow bucket allowing one request every two seconds.",
          "Practice 2: pkce_challenge(verifier). Validate with re.fullmatch(r\"[A-Za-z0-9\\-._~]{43,128}\"), then return base64url(sha256(verifier)) without padding.",
          "The checks use the RFC 7636 example, the 43-character output length, and three invalid verifiers.",
          "After passing, simulate a login endpoint with a bucket of 5 and a rate of one per minute, and count how many of 100 rapid attempts succeed.",
          "The example runs that simulation.",
          "Milestone 3 tomorrow combines rate limiting and SSRF defences into an API gateway.",
          "Both functions implement published standards and well-known algorithms; exactness matters.",
          "In production, use your framework's or gateway's rate limiter and an OAuth library, configured with these ideas in mind."
        ],
        "example": "A turnstile that counts people, paired with a two-part ticket that only works when both halves match.",
        "code": "capacity, rate = 5, 1 / 60\ntokens, last, ok = float(capacity), None, 0\nfor i in range(100):\n    now = i * 0.5                          # an attempt every half second\n    if last is not None:\n        tokens = min(capacity, tokens + (now - last) * rate)\n    last = now\n    if tokens >= 1:\n        tokens -= 1\n        ok += 1\nprint(f\"{ok} of 100 rapid login attempts were allowed\")",
        "output": "5 of 100 rapid login attempts were allowed",
        "codeNotes": [
          {
            "line": 4,
            "note": "100 attempts over 50 seconds."
          }
        ],
        "tryIt": "How many attempts would be allowed if the attacker spread them over an hour?",
        "check": {
          "question": "pkce_challenge(\"short\") should?",
          "options": [
            "Return a short hash",
            "Raise ValueError because verifiers need 43-128 characters",
            "Pad it"
          ],
          "answer": 1,
          "why": "Verifiers have a minimum length."
        }
      }
    ],
    "summary": [
      "Rate limiting stops guessing, scraping and resource exhaustion; respond with 429.",
      "Token buckets allow bursts up to capacity and enforce an average rate.",
      "OAuth 2.0 delegates access without sharing passwords; check state and request minimal scopes.",
      "PKCE sends a hash of a random verifier first, making stolen codes useless.",
      "Apply consistent API controls: authentication, authorisation, validation, pagination and inventory."
    ],
    "projectStep": {
      "title": "API protection layer",
      "steps": [
        "Implement TokenBucket and pkce_challenge.",
        "Choose limits for login, search and checkout endpoints and justify them.",
        "Walk through an OAuth login with PKCE for a mobile app, step by step."
      ]
    }
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete SSRF Metadata Defense & Token Bucket API Rate Limiter",
    "goal": "You can combine SSRF defences and per-client token buckets into a small API gateway, process traffic in order with clear decisions, summarise gateway outcomes, and explain where gateways fit in a layered defence.",
    "minutes": 30,
    "recap": "Milestone 3 brings together SSRF (Day 16), safe deserialisation (Day 17), secrets (Day 18), dependencies (Day 19) and rate limiting (Day 20). You will build the core of an API gateway.",
    "parts": [
      {
        "title": "What an API gateway does",
        "say": [
          "An API gateway sits in front of backend services and applies shared controls to every call: authentication, rate limits, request validation, routing and logging.",
          "Centralising these controls means each backend team does not have to reimplement them, and none can forget them.",
          "Products include Kong, AWS API Gateway, Apigee, Nginx and Envoy.",
          "Gateways are an important layer, but backends must still authorise objects (Day 12) and validate their own inputs.",
          "The milestone gateway handles webhook registrations: each call includes a callback URL that the platform will later fetch, so it needs SSRF checks, and each client is rate limited.",
          "The example lists the checks the gateway applies, in order.",
          "Ordering matters: cheap checks that reject bad input should come before expensive or stateful ones.",
          "Every decision is logged, which feeds monitoring (Day 24) and incident response (Day 29).",
          "A gateway is also the natural place to add new protections quickly during an incident."
        ],
        "example": "The security desk of an office building: it checks every visitor once, so each office does not need its own desk.",
        "code": "checks = [(\"callback URL passes SSRF check\", \"BLOCKED_SSRF, no token spent\"),\n          (\"client has a token in its bucket\", \"RATE_LIMITED\"),\n          (\"otherwise\", \"ALLOW and log\")]\nfor i, (check_, outcome) in enumerate(checks, 1):\n    print(f\"{i}. {check_:34} -> {outcome}\")",
        "output": "1. callback URL passes SSRF check     -> BLOCKED_SSRF, no token spent\n2. client has a token in its bucket   -> RATE_LIMITED\n3. otherwise                          -> ALLOW and log",
        "codeNotes": [
          {
            "line": 1,
            "note": "The stateless check runs first."
          }
        ],
        "tryIt": "Why should a blocked SSRF attempt not use up one of the client's tokens?",
        "check": {
          "question": "What is a benefit of an API gateway?",
          "options": [
            "It removes the need for backend security",
            "Shared controls are applied consistently to every call",
            "It makes APIs slower on purpose"
          ],
          "answer": 1,
          "why": "Central, consistent controls."
        }
      },
      {
        "title": "Per-client buckets",
        "say": [
          "Each client (identified by an API key or user ID) needs its own token bucket; one noisy client must not use up everyone else's allowance.",
          "A dictionary mapping client IDs to (tokens, last_time) holds the state in memory for this exercise.",
          "New clients start with a full bucket, following the Day 20 rules.",
          "In a real gateway with several servers, this state lives in a shared store such as Redis, with atomic updates.",
          "Old entries can be expired to save memory, since an idle client's bucket would be full again anyway.",
          "The example keeps buckets for two clients and shows that they are independent.",
          "Fairness between clients is part of availability: a single tenant should not degrade the service for others.",
          "Premium clients can be given larger capacities or rates simply by looking up their limits per client.",
          "Limits should be documented for API users, so legitimate clients can pace their calls."
        ],
        "example": "Separate prepaid cards for each family member, so one person's spending does not empty everyone else's balance.",
        "code": "capacity, rate = 2, 1.0\nbuckets = {}\ndef allow(client, t):\n    tokens, last = buckets.get(client, (float(capacity), None))\n    if last is not None:\n        tokens = min(capacity, tokens + (t - last) * rate)\n    ok = tokens >= 1\n    buckets[client] = (tokens - 1 if ok else tokens, t)\n    return ok\n\nfor t, c in [(0, \"a\"), (0, \"a\"), (0, \"a\"), (0, \"b\"), (0, \"b\"), (1, \"a\")]:\n    print(f\"t={t} client {c}: {'ALLOW' if allow(c, t) else 'RATE_LIMITED'}\")",
        "output": "t=0 client a: ALLOW\nt=0 client a: ALLOW\nt=0 client a: RATE_LIMITED\nt=0 client b: ALLOW\nt=0 client b: ALLOW\nt=1 client a: ALLOW",
        "codeNotes": [
          {
            "line": 4,
            "note": "New clients start full."
          },
          {
            "line": 8,
            "note": "Store the updated state."
          }
        ],
        "tryIt": "Why is client b still allowed after client a is rate limited?",
        "check": {
          "question": "Why give each client its own bucket?",
          "options": [
            "It is simpler",
            "So one noisy client cannot use up everyone else's allowance",
            "Redis requires it"
          ],
          "answer": 1,
          "why": "Isolation keeps limits fair."
        }
      },
      {
        "title": "Building the gateway",
        "say": [
          "Practice 1 is gateway(calls, capacity, rate), which processes (time, client, callback_url) calls in order and returns a decision for each.",
          "For each call: run the SSRF check (scheme, internal hosts, private IP ranges); if it fails, record BLOCKED_SSRF and skip the bucket; otherwise ALLOW or RATE_LIMITED from the client's bucket.",
          "Reusing the exact SSRF logic from Day 16 as a helper function keeps behaviour consistent and tested.",
          "Processing calls strictly in time order makes the results deterministic and easy to test.",
          "The function returns decisions rather than printing them, so other code can log, count or respond to them.",
          "The example runs a short sequence of calls through a compact version of the gateway.",
          "This is a miniature of what production gateways do millions of times per second.",
          "Adding a new rule later, such as a request size limit, means adding one more check in the right place.",
          "Tests with mixed traffic, good calls, abusive clients and SSRF attempts, confirm that the rules interact correctly."
        ],
        "example": "A toll plaza that turns away vehicles with forged plates and makes frequent travellers wait their turn.",
        "code": "import ipaddress\nimport re\n\ndef ssrf_ok(url):\n    m = re.fullmatch(r\"(https?)://([^/:?#]+)(?::\\d+)?([/?#].*)?\", url, re.IGNORECASE)\n    if not m or m.group(2).lower() == \"localhost\":\n        return False\n    try:\n        ip = ipaddress.ip_address(m.group(2))\n    except ValueError:\n        return True\n    return not (ip.is_private or ip.is_loopback or ip.is_link_local)\n\nfor url in [\"https://hooks.example.com/x\", \"http://169.254.169.254/\", \"ftp://files.example.com\"]:\n    print(f\"{url:30} {'passes' if ssrf_ok(url) else 'BLOCKED_SSRF'}\")",
        "output": "https://hooks.example.com/x    passes\nhttp://169.254.169.254/        BLOCKED_SSRF\nftp://files.example.com        BLOCKED_SSRF",
        "codeNotes": [
          {
            "line": 6,
            "note": "Unparseable URLs and localhost fail."
          },
          {
            "line": 12,
            "note": "Internal IP ranges fail."
          }
        ],
        "tryIt": "Which check stops the ftp:// URL?",
        "check": {
          "question": "What does the gateway do with a call that fails the SSRF check?",
          "options": [
            "Allows it",
            "Records BLOCKED_SSRF without spending a token",
            "Rate limits the client"
          ],
          "answer": 1,
          "why": "SSRF is checked first and does not use tokens."
        }
      },
      {
        "title": "Summarising decisions",
        "say": [
          "Raw decisions are hard to read in bulk; summaries show what is happening at a glance.",
          "Practice 2 is decision_summary(decisions), which counts each decision and computes the percentage of calls that were not allowed.",
          "A sudden rise in BLOCKED_SSRF suggests someone probing for internal services; a rise in RATE_LIMITED suggests abuse or a misbehaving client.",
          "Dashboards built from such summaries let teams spot problems in minutes.",
          "Sorted keys make summaries stable, which is useful in tests and when comparing reports over time.",
          "The example summarises a batch of decisions.",
          "Metrics like these turn a gateway from a silent filter into a source of security intelligence.",
          "Alert thresholds should be based on normal levels, measured over several weeks.",
          "Breaking summaries down by client identifies exactly who needs attention."
        ],
        "example": "A daily report from the security desk: how many visitors came, how many were turned away, and why.",
        "code": "from collections import Counter\n\ndecisions = [\"ALLOW\"] * 42 + [\"RATE_LIMITED\"] * 5 + [\"BLOCKED_SSRF\"] * 3\nsummary = dict(sorted(Counter(decisions).items()))\nblocked = sum(1 for d in decisions if d != \"ALLOW\")\nsummary[\"blocked_pct\"] = round(blocked / len(decisions) * 100, 1)\nprint(summary)",
        "output": "{'ALLOW': 42, 'BLOCKED_SSRF': 3, 'RATE_LIMITED': 5, 'blocked_pct': 16.0}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Counts with sorted keys."
          },
          {
            "line": 6,
            "note": "Share of calls not allowed."
          }
        ],
        "tryIt": "What blocked percentage would worry you for a public API? What would you check first?",
        "check": {
          "question": "What might a rise in BLOCKED_SSRF decisions indicate?",
          "options": [
            "Normal traffic growth",
            "Someone probing for internal services",
            "A slow database"
          ],
          "answer": 1,
          "why": "SSRF attempts target internal addresses."
        }
      },
      {
        "title": "Layers around the gateway",
        "say": [
          "The gateway is one layer among many built in this course.",
          "In front of it: DDoS protection and a web application firewall (Day 5). Beside it: TLS and security headers (Days 8 and 14).",
          "Behind it: services that authenticate tokens (Day 9), authorise objects (Day 12), use parameterised queries (Day 2) and load data safely (Day 17).",
          "Around everything: secrets managed properly (Day 18), dependencies tracked (Day 19) and monitoring (Day 24).",
          "Each layer assumes the others might fail, which is the essence of defence in depth.",
          "The example maps attacks to the layers that stop them.",
          "Drawing this map for a real system reveals gaps, such as an attack that only one layer stops.",
          "The fourth week turns to the low-level attacks, detection and response that complete the picture.",
          "Security architecture is largely the art of arranging these layers so that no single failure is catastrophic."
        ],
        "example": "The walls, gates, guards and vault of a castle, each designed on the assumption that the others might be breached.",
        "code": "layers = {\"WAF\": {\"sqli\", \"xss\"}, \"gateway\": {\"ssrf\", \"abuse\"}, \"service authz\": {\"idor\"},\n          \"param queries\": {\"sqli\"}, \"safe loaders\": {\"deserialisation\"}}\nfor attack in [\"sqli\", \"ssrf\", \"idor\", \"abuse\", \"deserialisation\"]:\n    stoppers = [l for l, stops in layers.items() if attack in stops]\n    print(f\"{attack:16} {len(stoppers)} layer(s): {stoppers}\")",
        "output": "sqli             2 layer(s): ['WAF', 'param queries']\nssrf             1 layer(s): ['gateway']\nidor             1 layer(s): ['service authz']\nabuse            1 layer(s): ['gateway']\ndeserialisation  1 layer(s): ['safe loaders']",
        "codeNotes": [
          {
            "line": 4,
            "note": "Find every layer that stops each attack."
          }
        ],
        "tryIt": "Which attacks rely on a single layer here? What second layer would you add?",
        "check": {
          "question": "What is the essence of defence in depth?",
          "options": [
            "One very strong layer",
            "Several layers, each assuming the others might fail",
            "Hiding the servers"
          ],
          "answer": 1,
          "why": "Independent, overlapping layers."
        }
      },
      {
        "title": "Milestone practice: gateway and summary",
        "say": [
          "Practice 1: gateway(calls, capacity, rate). For each (t, client, url): if the URL fails the SSRF check (http or https; not localhost or .internal; not a private, loopback, link-local, reserved or unspecified IP), record BLOCKED_SSRF; otherwise refill the client's bucket and record ALLOW or RATE_LIMITED.",
          "The checks include a client exceeding its burst, an SSRF attempt that does not consume tokens, an independent second client, a refill after two seconds, a bad scheme and no calls.",
          "Practice 2: decision_summary(decisions). Count decisions with sorted keys and add blocked_pct, rounded to one decimal, or 0.0 for an empty list.",
          "The checks include a mixed list and an empty list.",
          "Congratulations on Milestone 3: you have built SSRF defences, safe loading, secret scanning, dependency checks and rate limiting, and combined them.",
          "The final week covers memory safety, detection, penetration testing, zero trust, cloud security and incident response.",
          "The example runs a small traffic replay through the gateway and prints the summary.",
          "Replaying recorded traffic against new rules before deploying them is how real teams avoid blocking good users.",
          "Keep the gateway code: the capstone refers back to these ideas."
        ],
        "example": "A toll plaza's end-of-day report: every vehicle recorded, every rejection explained.",
        "code": "from collections import Counter\n\ndecisions = [\"ALLOW\", \"ALLOW\", \"RATE_LIMITED\", \"BLOCKED_SSRF\", \"ALLOW\", \"ALLOW\", \"RATE_LIMITED\"]\nsummary = dict(sorted(Counter(decisions).items()))\nsummary[\"blocked_pct\"] = round(sum(d != \"ALLOW\" for d in decisions) / len(decisions) * 100, 1)\nprint(summary)",
        "output": "{'ALLOW': 4, 'BLOCKED_SSRF': 1, 'RATE_LIMITED': 2, 'blocked_pct': 42.9}",
        "codeNotes": [
          {
            "line": 5,
            "note": "True counts as 1 in the sum."
          }
        ],
        "tryIt": "How would you break this summary down per client?",
        "check": {
          "question": "decision_summary([]) returns?",
          "options": [
            "An error",
            "{\"blocked_pct\": 0.0}",
            "None"
          ],
          "answer": 1,
          "why": "An empty list gives 0.0 without dividing by zero."
        }
      }
    ],
    "summary": [
      "API gateways apply shared controls consistently to every call.",
      "Give each client its own token bucket; keep state in a shared store in production.",
      "Order checks: cheap stateless rejections first, then stateful limits.",
      "Summaries and metrics turn decisions into security intelligence.",
      "The gateway is one layer in a defence-in-depth architecture."
    ],
    "projectStep": {
      "title": "Milestone 3: webhook gateway",
      "steps": [
        "Implement gateway and decision_summary.",
        "Replay 50 mixed calls, including abuse and SSRF attempts.",
        "Draw your system's layers and mark which attacks each one stops."
      ]
    }
  },
  {
    "day": 22,
    "title": "Binary Exploitation: Buffer Overflows, Stack Canaries & ASLR",
    "goal": "You can explain how buffer overflows corrupt memory, how stack canaries, ASLR and non-executable memory make them harder to exploit, simulate canary detection in Python, and write bounded copies that never overflow.",
    "minutes": 30,
    "recap": "The final week starts at the lowest level: memory. Languages like C and C++ give programmers direct control of memory, and mistakes there have caused some of the most serious vulnerabilities in history.",
    "parts": [
      {
        "title": "What a buffer overflow is",
        "say": [
          "A buffer is a fixed-size area of memory, such as space for 16 characters. A buffer overflow happens when a program writes more data than the buffer can hold.",
          "In languages without automatic bounds checking, such as C, the extra bytes overwrite whatever comes next in memory.",
          "On the stack, that can include other variables and the saved return address, which tells the program where to continue after a function ends.",
          "Overwriting the return address can redirect execution, historically letting attackers run their own code.",
          "Classic unsafe C functions such as strcpy and gets copy without checking length.",
          "The example simulates a fixed buffer next to another value in a bytearray, and shows an unchecked copy spilling over. Nothing here is real exploitation; it only shows the idea.",
          "Python, Java, Go and Rust check bounds automatically, which prevents this class of bug in ordinary code.",
          "Memory-unsafe code still sits underneath much of the world's software, including operating systems, browsers and libraries.",
          "The famous Morris worm of 1988 spread partly through a buffer overflow, and such bugs still appear in security advisories today."
        ],
        "example": "Pouring two litres of water into a one-litre jug on a crowded table: the extra water ruins the papers next to it.",
        "code": "memory = bytearray(b\"........\") + bytearray(b\"LIMIT=05\")     # 8-byte buffer, then another value\ndata = b\"AAAAAAAAAAAA\"                                   # 12 bytes into an 8-byte buffer\nn = min(len(data), len(memory))\nmemory[:n] = data[:n]                                     # an unchecked copy\nprint(\"buffer:\", bytes(memory[:8]))\nprint(\"neighbouring value now:\", bytes(memory[8:]))",
        "output": "buffer: b'AAAAAAAA'\nneighbouring value now: b'AAAAT=05'",
        "codeNotes": [
          {
            "line": 4,
            "note": "The copy does not stop at the end of the buffer."
          },
          {
            "line": 6,
            "note": "The neighbouring value has been overwritten."
          }
        ],
        "tryIt": "What would happen if the neighbouring value were a flag such as \"is_admin\"?",
        "check": {
          "question": "What is a buffer overflow?",
          "options": [
            "A full hard disk",
            "Writing more data into a buffer than it can hold, corrupting nearby memory",
            "A slow network"
          ],
          "answer": 1,
          "why": "Data spills past the buffer's end."
        }
      },
      {
        "title": "Stack canaries",
        "say": [
          "A stack canary is a secret random value placed between a function's buffers and its return address.",
          "Before the function returns, it checks the canary. If an overflow changed it, the program stops immediately with an error such as \"stack smashing detected\".",
          "The name comes from canaries once carried into coal mines to warn miners of danger.",
          "Compilers add canaries automatically with options such as -fstack-protector.",
          "Practice 1 is copy_into_frame(buf_size, data, canary), which simulates an unchecked copy and reports whether the canary survived.",
          "Canaries only work if they are secret and random; an attacker who knows the value can rewrite it unchanged, as one of the practice checks shows.",
          "The example shows the canary detecting a long write.",
          "Detection turns silent corruption into a crash, which is far safer than letting an attacker take control.",
          "Canaries do not protect data before the canary, such as other local variables, so they are one layer among several."
        ],
        "example": "A thin thread across a doorway: you may not stop an intruder, but you will know someone passed through.",
        "code": "def copy_into_frame(buf_size, data, canary):\n    frame = bytearray(buf_size) + bytearray(canary)\n    n = min(len(data), len(frame))\n    frame[:n] = data[:n]\n    return \"OK\" if bytes(frame[buf_size:]) == canary else \"STACK_SMASHING_DETECTED\"\n\ncanary = bytes.fromhex(\"8f1ac300\")\nfor data in [b\"hello\", b\"A\" * 8, b\"A\" * 12]:\n    print(f\"{len(data):2} bytes into 8 -> {copy_into_frame(8, data, canary)}\")",
        "output": " 5 bytes into 8 -> OK\n 8 bytes into 8 -> OK\n12 bytes into 8 -> STACK_SMASHING_DETECTED",
        "codeNotes": [
          {
            "line": 2,
            "note": "The canary sits right after the buffer."
          },
          {
            "line": 5,
            "note": "Compare before \"returning\"."
          }
        ],
        "tryIt": "Why do real canaries often contain a zero byte?",
        "check": {
          "question": "What does a stack canary do?",
          "options": [
            "Prevents all overflows",
            "Detects that an overflow changed memory before the function returns",
            "Encrypts the stack"
          ],
          "answer": 1,
          "why": "It detects corruption and stops the program."
        }
      },
      {
        "title": "ASLR and non-executable memory",
        "say": [
          "Address space layout randomisation (ASLR) places the stack, heap and libraries at random addresses each time a program runs.",
          "Attackers who hijack control flow need to know where useful code is; randomisation makes that a guessing game.",
          "Non-executable memory (NX, also called DEP) marks data areas such as the stack as non-executable, so injected bytes cannot run as code.",
          "Attackers responded with techniques that reuse existing code, and defenders responded with control-flow integrity and hardware features such as shadow stacks.",
          "This back-and-forth shows why layered mitigations matter: each raises the cost of attacks.",
          "The example shows how many guesses ASLR forces for different amounts of randomness.",
          "Modern operating systems enable these protections by default; disabling them for convenience weakens every program.",
          "Information leaks that reveal a single address can undo ASLR, which is why even small leaks are treated seriously.",
          "Keeping systems patched ensures these mitigations and fixes are actually in place."
        ],
        "example": "Rearranging the furniture in a dark house every night: an intruder who memorised the layout keeps bumping into things.",
        "code": "for bits in [8, 16, 28, 40]:\n    print(f\"{bits:2} bits of randomness -> about {2 ** bits:,} possible layouts\")",
        "output": " 8 bits of randomness -> about 256 possible layouts\n16 bits of randomness -> about 65,536 possible layouts\n28 bits of randomness -> about 268,435,456 possible layouts\n40 bits of randomness -> about 1,099,511,627,776 possible layouts",
        "codeNotes": [
          {
            "line": 2,
            "note": "Each extra bit doubles the attacker's guessing work."
          }
        ],
        "tryIt": "Why does 64-bit hardware allow much stronger ASLR than 32-bit?",
        "check": {
          "question": "What does ASLR do?",
          "options": [
            "Encrypts memory",
            "Places code and data at random addresses so attackers cannot predict them",
            "Blocks all network traffic"
          ],
          "answer": 1,
          "why": "Randomised layouts defeat hard-coded addresses."
        }
      },
      {
        "title": "Bounded copies",
        "say": [
          "The real fix is to never write past a buffer: every copy must know the destination size.",
          "C's strlcpy and snprintf take the buffer size, copy at most size - 1 bytes and always add a terminating zero byte.",
          "Practice 2 is bounded_copy(buf_size, data), which returns the copied bytes with a terminator and whether data was truncated.",
          "Reporting truncation matters: silently cutting a filename or amount could cause a different bug.",
          "Safer languages make this automatic; for C and C++ code, static analysers and compiler warnings catch many unsafe calls.",
          "The example copies strings of several lengths into an 8-byte buffer.",
          "Checking lengths at every boundary is the programming habit that prevents overflows.",
          "Fuzzing, feeding programs huge numbers of random inputs, is one of the best ways to find overflows before attackers do.",
          "Code review should flag any copy whose length is controlled by input but not checked against the destination."
        ],
        "example": "Measuring the jug before pouring, and stopping one centimetre from the top.",
        "code": "def bounded_copy(buf_size, data):\n    kept = data[:buf_size - 1]\n    return kept + b\"\\x00\", len(data) > len(kept)\n\nfor data in [b\"hi\", b\"exactly7\", b\"much longer than eight\"]:\n    copied, truncated = bounded_copy(8, data)\n    print(f\"{data!r:26} -> {copied!r:14} truncated={truncated}\")",
        "output": "b'hi'                      -> b'hi\\x00'      truncated=False\nb'exactly7'                -> b'exactly\\x00' truncated=True\nb'much longer than eight'  -> b'much lo\\x00' truncated=True",
        "codeNotes": [
          {
            "line": 2,
            "note": "Leave one byte for the terminator."
          }
        ],
        "tryIt": "Why is \"exactly7\" (8 characters) truncated even though it has 8 bytes?",
        "check": {
          "question": "What does a bounded copy guarantee?",
          "options": [
            "Faster copying",
            "Never writing past the destination buffer",
            "Encryption"
          ],
          "answer": 1,
          "why": "The size limit is always respected."
        }
      },
      {
        "title": "Memory safety today",
        "say": [
          "Microsoft and Google have each reported that around 70 percent of their serious security bugs are memory-safety issues.",
          "Government agencies, including the US CISA, now encourage moving new code to memory-safe languages such as Rust, Go, Java, C# and Python.",
          "Rust achieves memory safety without garbage collection by checking ownership and borrowing rules at compile time.",
          "Rewriting everything is impractical, so organisations isolate risky components, add fuzzing and sanitisers, and write new components in safe languages.",
          "Python developers benefit indirectly: the interpreter and many libraries are written in C, which is why keeping them patched matters.",
          "The example compares categories of languages by how they handle bounds.",
          "Understanding memory bugs helps you judge risk in the tools and libraries you depend on.",
          "Sanitisers such as AddressSanitizer detect memory errors during testing, turning silent corruption into clear reports.",
          "Tomorrow looks at the other half of memory safety: using memory after it has been freed."
        ],
        "example": "Replacing old wiring with modern circuit breakers: you cannot rewire every building at once, so you start with the most dangerous rooms.",
        "code": "languages = {\"C\": \"manual, no automatic bounds checks\", \"C++\": \"manual, with safer library options\",\n             \"Rust\": \"checked at compile time and run time\", \"Python\": \"checked at run time (IndexError)\",\n             \"Go\": \"checked at run time\", \"Java\": \"checked at run time\"}\nfor lang, bounds in languages.items():\n    print(f\"{lang:6} {bounds}\")\ntry:\n    [1, 2, 3][10]\nexcept IndexError as e:\n    print(\"Python refuses out-of-bounds access:\", e)",
        "output": "C      manual, no automatic bounds checks\nC++    manual, with safer library options\nRust   checked at compile time and run time\nPython checked at run time (IndexError)\nGo     checked at run time\nJava   checked at run time\nPython refuses out-of-bounds access: list index out of range",
        "codeNotes": [
          {
            "line": 7,
            "note": "Python raises an error instead of reading other memory."
          }
        ],
        "tryIt": "Which components of a system you know are likely to be written in C?",
        "check": {
          "question": "Roughly what share of serious bugs do major vendors attribute to memory safety?",
          "options": [
            "About 5 percent",
            "About 70 percent",
            "None"
          ],
          "answer": 1,
          "why": "Memory safety dominates serious vulnerabilities."
        }
      },
      {
        "title": "Practice time: canaries and bounded copies",
        "say": [
          "Practice 1: copy_into_frame(buf_size, data, canary). Build frame = bytearray(buf_size) + bytearray(canary), copy min(len(data), len(frame)) bytes from the start, and return OK if frame[buf_size:] still equals the canary, else STACK_SMASHING_DETECTED.",
          "The checks include data that fits, data that exactly fills the buffer, an overflow, and an overflow that rewrites the same canary value, which shows why canaries must be secret.",
          "Practice 2: bounded_copy(buf_size, data). Raise ValueError if buf_size < 1; keep data[:buf_size - 1], add a zero byte, and report truncation.",
          "The checks include a short string, a truncated string, a one-byte buffer and a zero-size buffer.",
          "After passing, feed random byte strings of random lengths into both functions (a tiny fuzzer) and confirm bounded_copy never exceeds the buffer.",
          "The example runs that tiny fuzzer with a fixed seed.",
          "Tomorrow covers use-after-free and safe handles.",
          "Detection (canaries) and prevention (bounded copies) together illustrate defence in depth at the lowest level.",
          "These simulations teach concepts; real mitigations live in compilers and operating systems."
        ],
        "example": "A smoke alarm in the kitchen and a pan that simply cannot overheat.",
        "code": "import random\n\nrandom.seed(22)\nworst = 0\nfor _ in range(1000):\n    size = random.randint(1, 32)\n    data = bytes(random.randint(65, 90) for _ in range(random.randint(0, 64)))\n    copied = data[:size - 1] + b\"\\x00\"\n    worst = max(worst, len(copied) - size)\nprint(\"1000 random copies, worst overrun:\", worst, \"bytes\")",
        "output": "1000 random copies, worst overrun: 0 bytes",
        "codeNotes": [
          {
            "line": 8,
            "note": "The bounded copy."
          },
          {
            "line": 9,
            "note": "Any positive value would be an overflow."
          }
        ],
        "tryIt": "What would the worst overrun be for an unbounded copy of the same inputs?",
        "check": {
          "question": "bounded_copy(8, b\"overflowing\") returns?",
          "options": [
            "(b\"overflowing\", False)",
            "(b\"overflo\\x00\", True)",
            "An error"
          ],
          "answer": 1,
          "why": "Seven bytes plus the terminator, and truncated."
        }
      }
    ],
    "summary": [
      "Buffer overflows write past a buffer and corrupt nearby memory.",
      "Stack canaries detect overflows; ASLR and NX make exploitation harder.",
      "Bounded copies prevent overflows and should report truncation.",
      "Memory-safe languages remove this class of bug; C code needs fuzzing and sanitisers.",
      "Layered mitigations raise attackers' costs at every step."
    ],
    "projectStep": {
      "title": "Memory safety notes",
      "steps": [
        "Implement copy_into_frame and bounded_copy.",
        "Write a tiny fuzzer and run it against both.",
        "List the C components your projects depend on and how they are kept patched."
      ]
    }
  },
  {
    "day": 23,
    "title": "Memory Safety: Use-After-Free, Dangling Pointers & Spatial/Temporal Safety",
    "goal": "You can explain use-after-free, double free and memory leaks, audit a sequence of memory events for lifetime errors, and implement generational handles that make stale references safe to detect.",
    "minutes": 30,
    "recap": "Yesterday memory was written in the wrong place. Today memory is used at the wrong time: after it has been handed back.",
    "parts": [
      {
        "title": "Object lifetimes",
        "say": [
          "In languages with manual memory management, a program allocates memory (malloc, new), uses it, and frees it (free, delete) when finished.",
          "Every allocation has a lifetime: from allocation to free. Using the memory outside that lifetime is a temporal safety error.",
          "Spatial safety (Day 22) is about where you access memory; temporal safety is about when.",
          "Garbage-collected languages such as Python and Java free memory automatically only when nothing refers to it any more, preventing these bugs in ordinary code.",
          "Rust prevents them at compile time through ownership: the compiler proves no reference outlives its data.",
          "The example prints a simple lifetime as a sequence of events.",
          "Thinking in lifetimes helps in any language, for example with files, database connections and locks.",
          "Resources such as open files have lifetimes too, and Python's with statement closes them reliably.",
          "Temporal bugs are often intermittent, appearing only under particular timing, which makes them hard to find by ordinary testing."
        ],
        "example": "Borrowing a library book: you can read it from when you check it out until you return it, not before and not after.",
        "code": "events = [(\"alloc\", \"buffer A\"), (\"use\", \"buffer A\"), (\"use\", \"buffer A\"), (\"free\", \"buffer A\")]\nalive = False\nfor op, name in events:\n    alive = True if op == \"alloc\" else False if op == \"free\" else alive\n    print(f\"{op:5} {name}: {'alive' if alive else 'freed'}\")",
        "output": "alloc buffer A: alive\nuse   buffer A: alive\nuse   buffer A: alive\nfree  buffer A: freed",
        "codeNotes": [
          {
            "line": 4,
            "note": "alloc starts the lifetime; free ends it."
          }
        ],
        "tryIt": "What would a \"use\" after the last line be called?",
        "check": {
          "question": "What is temporal memory safety about?",
          "options": [
            "Where memory is accessed",
            "When memory is accessed relative to its lifetime",
            "How fast memory is"
          ],
          "answer": 1,
          "why": "Time, not place."
        }
      },
      {
        "title": "Use-after-free and double free",
        "say": [
          "Use-after-free (UAF) happens when a program keeps a pointer to freed memory and uses it later.",
          "The memory may already be reused for something else, so the program reads or writes another object's data, which attackers can arrange to their advantage.",
          "Double free happens when the same memory is freed twice, corrupting the allocator's internal records.",
          "UAF bugs are among the most common serious vulnerabilities in browsers, where complex object lifetimes are hard to track.",
          "Setting pointers to NULL after freeing, clear ownership rules and smart pointers (unique_ptr, shared_ptr in C++) reduce these bugs.",
          "The example shows a freed slot being reused, so an old reference now sees new data.",
          "The danger is not the crash; it is a program silently acting on the wrong data.",
          "Memory allocators often reuse recently freed memory quickly, which makes UAF more exploitable.",
          "Browsers use special allocators and sandboxing to limit what a UAF can achieve."
        ],
        "example": "Keeping the key to a hotel room after checking out: the next guest has moved in, and your key still opens their door.",
        "code": "heap = {0: \"invoice for Asha\"}\nold_reference = 0\ndel heap[0]                        # freed\nheap[0] = \"salary data for Ravi\"   # the slot is reused\nprint(\"old reference now sees:\", heap[old_reference])",
        "output": "old reference now sees: salary data for Ravi",
        "codeNotes": [
          {
            "line": 4,
            "note": "Reuse makes the stale reference dangerous."
          }
        ],
        "tryIt": "How could the program have noticed that old_reference was stale?",
        "check": {
          "question": "Why is use-after-free dangerous?",
          "options": [
            "It always crashes safely",
            "Freed memory may hold other data that the program then reads or changes",
            "It wastes disk space"
          ],
          "answer": 1,
          "why": "Stale references touch reused memory."
        }
      },
      {
        "title": "Auditing lifetimes",
        "say": [
          "Tools such as AddressSanitizer and Valgrind track every allocation and report lifetime errors while tests run.",
          "You can model the same idea: walk a list of alloc, free and use events, tracking each pointer's state.",
          "Practice 1 is lifetime_audit(events), which reports USE_AFTER_FREE, DOUBLE_FREE and INVALID (never allocated), and lists leaks at the end.",
          "A leak is memory still allocated when the program ends; small leaks waste memory, and large ones can crash long-running services.",
          "A pointer that is allocated again after being freed becomes live again, as with a real allocator reusing an address.",
          "The example audits a short event log.",
          "Dynamic analysis tools like this catch bugs that are almost impossible to see by reading code.",
          "Running tests under sanitisers in CI finds lifetime bugs soon after they are introduced.",
          "Reports that name the event index make bugs easy to locate, just like line numbers."
        ],
        "example": "A librarian's loan register that flags books returned twice, loans of books that were never in stock, and books never returned.",
        "code": "events = [(\"alloc\", \"p1\"), (\"alloc\", \"p2\"), (\"free\", \"p1\"), (\"use\", \"p1\"), (\"free\", \"p1\")]\nstate, problems = {}, []\nfor i, (op, ptr) in enumerate(events):\n    s = state.get(ptr)\n    if op == \"alloc\":\n        state[ptr] = \"live\"\n    elif op == \"use\" and s == \"freed\":\n        problems.append((i, \"USE_AFTER_FREE\"))\n    elif op == \"free\":\n        problems.append((i, \"DOUBLE_FREE\")) if s == \"freed\" else state.__setitem__(ptr, \"freed\")\nproblems += [(\"END\", f\"LEAK:{p}\") for p in sorted(p for p, s in state.items() if s == \"live\")]\nprint(problems)",
        "output": "[(3, 'USE_AFTER_FREE'), (4, 'DOUBLE_FREE'), ('END', 'LEAK:p2')]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Using a freed pointer."
          },
          {
            "line": 11,
            "note": "Anything still live at the end leaked."
          }
        ],
        "tryIt": "Rewrite line 10 as a normal if/else. Which version is easier to read?",
        "check": {
          "question": "What is a memory leak?",
          "options": [
            "Reading freed memory",
            "Memory that stays allocated but is no longer needed",
            "Freeing memory twice"
          ],
          "answer": 1,
          "why": "Leaks are allocations never freed."
        }
      },
      {
        "title": "Generational handles",
        "say": [
          "A safe design replaces raw pointers with handles: an index into a table plus a generation number.",
          "When a slot is freed and reused, its generation increases, so any old handle (with the old generation) no longer matches.",
          "Using a stale handle raises a clear error instead of silently touching reused memory.",
          "Practice 2 is a HandleTable class with put, get and remove, reusing freed slots with incremented generations.",
          "Game engines and entity-component systems use generational handles widely for both safety and speed.",
          "The example shows an old handle becoming stale after its slot is reused.",
          "Designs that make errors detectable are a recurring theme in secure engineering.",
          "Rust libraries such as slotmap provide exactly this structure, combining safety with performance.",
          "The same idea protects database rows: optimistic locking uses version numbers to reject stale updates."
        ],
        "example": "Hotel key cards that are re-coded for each new guest: the previous guest's card simply stops working.",
        "code": "slots, gens = [\"invoice A\"], [0]\nhandle_a = (0, 0)\nslots[0], gens[0] = \"invoice B\", gens[0] + 1      # slot freed and reused\nhandle_b = (0, gens[0])\nfor name, (i, g) in [(\"old handle\", handle_a), (\"new handle\", handle_b)]:\n    print(f\"{name}: {slots[i] if gens[i] == g else 'stale handle, access refused'}\")",
        "output": "old handle: stale handle, access refused\nnew handle: invoice B",
        "codeNotes": [
          {
            "line": 3,
            "note": "Reuse bumps the generation."
          },
          {
            "line": 6,
            "note": "Generations must match."
          }
        ],
        "tryIt": "How many times can a slot be reused before the generation number could matter for overflow in C? In Python?",
        "check": {
          "question": "What does the generation number in a handle detect?",
          "options": [
            "Encryption errors",
            "That a slot was freed and reused since the handle was issued",
            "Network failures"
          ],
          "answer": 1,
          "why": "A mismatch means the handle is stale."
        }
      },
      {
        "title": "Lifetimes beyond memory",
        "say": [
          "The same bugs appear with other resources: using a session after logout, a token after revocation, a file after closing.",
          "Session fixation and reuse of revoked tokens are \"use after free\" at the application level.",
          "Time-of-check to time-of-use (TOCTOU) bugs check something, then act later when it may have changed, such as checking a file's permissions and then opening a replaced file.",
          "Defences mirror memory safety: clear ownership, invalidation on release, and checks at the moment of use.",
          "Python's with statement guarantees resources are released even when errors occur.",
          "The example shows a revoked session being refused because every use is checked.",
          "Lifetime thinking is useful far beyond low-level code.",
          "Password resets should invalidate existing sessions, so a stolen session does not survive the reset.",
          "Tokens and invitations should be single-use where possible, like one-time codes (Day 10)."
        ],
        "example": "Cancelling a lost credit card: the old card number stops working everywhere, immediately.",
        "code": "sessions = {\"s1\": {\"user\": \"asha\", \"active\": True}}\ndef use(session_id):\n    s = sessions.get(session_id)\n    return f\"hello {s['user']}\" if s and s[\"active\"] else \"session invalid, please log in\"\n\nprint(use(\"s1\"))\nsessions[\"s1\"][\"active\"] = False     # logout or password reset\nprint(use(\"s1\"))",
        "output": "hello asha\nsession invalid, please log in",
        "codeNotes": [
          {
            "line": 4,
            "note": "Check the session's state at the moment of use."
          }
        ],
        "tryIt": "Where in a web app would a TOCTOU bug be possible?",
        "check": {
          "question": "What is a TOCTOU bug?",
          "options": [
            "A slow check",
            "Checking something, then acting later after it may have changed",
            "A type of encryption"
          ],
          "answer": 1,
          "why": "Time of check differs from time of use."
        }
      },
      {
        "title": "Practice time: audits and handles",
        "say": [
          "Practice 1: lifetime_audit(events). Track each pointer's state (live or freed). Report (index, \"USE_AFTER_FREE\") for using freed memory, (index, \"DOUBLE_FREE\") for freeing it again, (index, \"INVALID\") for using or freeing an unknown pointer, and finally (\"END\", \"LEAK:<ptr>\") for each live pointer in sorted order.",
          "The checks include every problem type, a re-allocated pointer that later leaks, and a clean lifetime.",
          "Practice 2: HandleTable. put reuses a freed slot (bumping its generation) or appends a new one; get and remove raise ValueError(\"stale handle\") if the slot is not alive or the generation differs.",
          "The checks store two objects, remove one, reuse its slot, and confirm the old handle is refused for both get and remove.",
          "After passing, use HandleTable to store user sessions and show that revoked sessions cannot be used.",
          "The example does exactly that.",
          "Tomorrow moves from preventing bugs to detecting attacks in logs.",
          "Making stale references detectable is one of the most useful ideas in safe design.",
          "The audit function is a miniature of what memory sanitisers do for real programs."
        ],
        "example": "A key-card system that knows every card ever issued and refuses any card from a previous guest.",
        "code": "class Handles:\n    def __init__(self):\n        self.objs, self.gens, self.alive = [], [], []\n    def put(self, obj):\n        self.objs.append(obj); self.gens.append(0); self.alive.append(True)\n        return (len(self.objs) - 1, 0)\n    def get(self, h):\n        i, g = h\n        if not self.alive[i] or self.gens[i] != g:\n            raise ValueError(\"stale handle\")\n        return self.objs[i]\n\ntable = Handles()\nsession = table.put({\"user\": \"asha\"})\nprint(table.get(session))\ntable.alive[session[0]] = False           # logout\ntry:\n    table.get(session)\nexcept ValueError as e:\n    print(\"after logout:\", e)",
        "output": "{'user': 'asha'}\nafter logout: stale handle",
        "codeNotes": [
          {
            "line": 9,
            "note": "Refuse dead slots and old generations."
          }
        ],
        "tryIt": "This simplified class never reuses slots. What changes when it does?",
        "check": {
          "question": "lifetime_audit reports what for freeing a pointer twice?",
          "options": [
            "USE_AFTER_FREE",
            "DOUBLE_FREE",
            "LEAK"
          ],
          "answer": 1,
          "why": "A second free is a double free."
        }
      }
    ],
    "summary": [
      "Temporal safety is about using memory only during its lifetime.",
      "Use-after-free and double free corrupt or expose reused memory.",
      "Audit alloc, free and use events to find lifetime errors and leaks.",
      "Generational handles make stale references detectable.",
      "The same lifetime thinking applies to sessions, tokens, files and TOCTOU bugs."
    ],
    "projectStep": {
      "title": "Lifetime-safe resources",
      "steps": [
        "Implement lifetime_audit and HandleTable.",
        "Store sessions in a HandleTable and prove revoked ones are refused.",
        "Find one TOCTOU risk in an app you know and describe the fix."
      ]
    }
  },
  {
    "day": 24,
    "title": "Security Information & Event Management (SIEM): Log Analysis & IOC Detection",
    "goal": "You can explain how SIEM systems collect and analyse logs, parse log lines, detect brute-force logins within sliding time windows, and match logs against indicators of compromise in Python.",
    "minutes": 30,
    "recap": "So far the course has been about prevention. Prevention eventually fails, so defenders also need detection: noticing attacks in progress from the traces they leave.",
    "parts": [
      {
        "title": "Logs and SIEM",
        "say": [
          "Almost every system writes logs: logins, errors, requests, configuration changes, firewall decisions.",
          "A SIEM (security information and event management) system collects logs from many sources, stores them centrally, and runs detection rules across them.",
          "Examples include Splunk, Microsoft Sentinel, Elastic Security and Google Chronicle.",
          "Central collection matters because attacks cross systems: a phishing email, then a login, then a file download, each logged in a different place.",
          "Good logs include a timestamp in a standard format (ISO 8601, in UTC), the event type, the user, the source IP and the outcome.",
          "The example parses structured log lines into fields.",
          "Detection is only as good as the logs: missing or inconsistent logs create blind spots.",
          "Keeping clocks synchronised across servers matters, because events from different systems must line up in time.",
          "Logs must be protected from tampering and deletion, since attackers try to cover their tracks (Day 29).",
          "Never log passwords, tokens or full card numbers; logs are often read by many people."
        ],
        "example": "A building's visitor book, door sensors and camera footage, all brought together in one security office.",
        "code": "import re\n\nlines = [\"2026-05-01T10:00:05 FAILED_LOGIN user=admin ip=203.0.113.9\",\n         \"2026-05-01T10:00:09 LOGIN_OK user=meena ip=10.0.0.5\"]\nfor line in lines:\n    ts, event, rest = line.split(\" \", 2)\n    fields = dict(re.findall(r\"(\\w+)=(\\S+)\", rest))\n    print({\"time\": ts, \"event\": event, **fields})",
        "output": "{'time': '2026-05-01T10:00:05', 'event': 'FAILED_LOGIN', 'user': 'admin', 'ip': '203.0.113.9'}\n{'time': '2026-05-01T10:00:09', 'event': 'LOGIN_OK', 'user': 'meena', 'ip': '10.0.0.5'}",
        "codeNotes": [
          {
            "line": 6,
            "note": "Split off the timestamp and event type."
          },
          {
            "line": 7,
            "note": "key=value pairs become a dictionary."
          }
        ],
        "tryIt": "What extra field would help investigate a suspicious login?",
        "check": {
          "question": "Why does a SIEM collect logs centrally?",
          "options": [
            "To save disk space",
            "Attacks span many systems, so correlation needs all the logs together",
            "Logs are illegal locally"
          ],
          "answer": 1,
          "why": "Correlation needs a central view."
        }
      },
      {
        "title": "Detecting brute force with sliding windows",
        "say": [
          "A brute-force attack produces many failed logins from one source in a short time.",
          "A sliding window checks whether any window of, say, 60 seconds contains at least N failures, rather than using fixed clock minutes that an attacker could straddle.",
          "Sorting each IP's failure times and comparing the time of failure i with failure i + N - 1 finds such windows efficiently.",
          "Practice 1 is brute_force_ips(lines, threshold, window), which parses timestamps with datetime.fromisoformat and reports offending IPs.",
          "Thresholds need tuning: too low flags users who mistype, too high misses slow attacks.",
          "The example finds the tightest window of failures for each IP.",
          "Slow attacks spread over hours need longer windows, which is why several rules with different windows are common.",
          "Combining signals, such as many failures followed by a success, gives much stronger alerts than either alone.",
          "A success right after a burst of failures may mean the attacker guessed correctly, which deserves an urgent look.",
          "Password spraying, one attempt per account across many accounts, needs a rule that counts failures per IP across users."
        ],
        "example": "A shop assistant who notices the same customer trying fifteen different card PINs within a minute.",
        "code": "from datetime import datetime\n\ntimes = sorted(datetime.fromisoformat(t) for t in [\"2026-05-01T10:00:00\", \"2026-05-01T10:00:20\",\n       \"2026-05-01T10:00:35\", \"2026-05-01T10:03:00\", \"2026-05-01T10:00:50\"])\nthreshold = 3\nspans = [(times[i + threshold - 1] - times[i]).total_seconds() for i in range(len(times) - threshold + 1)]\nprint(\"seconds spanned by each run of 3 failures:\", spans)\nprint(\"brute force within 60 s:\", any(s <= 60 for s in spans))",
        "output": "seconds spanned by each run of 3 failures: [35.0, 30.0, 145.0]\nbrute force within 60 s: True",
        "codeNotes": [
          {
            "line": 6,
            "note": "Compare each failure with the one threshold - 1 later."
          }
        ],
        "tryIt": "What would a fixed 10:00-10:01 window miss if the failures were at 10:00:50, 10:01:05 and 10:01:20?",
        "check": {
          "question": "Why use sliding windows for detection?",
          "options": [
            "They use less memory",
            "Attacks can straddle fixed time boundaries",
            "They are required by law"
          ],
          "answer": 1,
          "why": "Sliding windows catch bursts at any time."
        }
      },
      {
        "title": "Indicators of compromise",
        "say": [
          "Indicators of compromise (IOCs) are known signs of malicious activity: IP addresses, domain names, file hashes, URLs.",
          "Threat intelligence feeds from vendors, governments (such as CERT-In in India) and industry groups share IOCs.",
          "Matching logs against IOC lists finds contact with known-bad infrastructure.",
          "Practice 2 is ioc_hits(lines, iocs), which tokenises each line and reports matches once per line, case-insensitively.",
          "IOCs age quickly: attackers change IP addresses and domains often, so feeds must be updated and old entries retired.",
          "The example matches a few log lines against an IOC set.",
          "IOC matching is simple and fast, but behaviour-based detection (like the brute-force rule) catches attackers using new infrastructure.",
          "Normalising case and format, such as lower-casing domains, prevents easy misses.",
          "A match is a lead to investigate, not proof of compromise; shared hosting can put innocent sites on the same IP."
        ],
        "example": "A police \"wanted\" list: useful for spotting known offenders, but no help against someone new.",
        "code": "import re\n\niocs = {\"198.51.100.77\", \"evil-cdn.example\"}\nlogs = [\"conn 10.0.0.2:443\", \"DNS query EVIL-CDN.example from 10.0.0.9\", \"conn 198.51.100.77:443 and 198.51.100.77:80\"]\nfor i, line in enumerate(logs, 1):\n    hits = sorted({t.lower() for t in re.findall(r\"[A-Za-z0-9.:-]+\", line)} & iocs)\n    print(f\"line {i}: {hits or 'clean'}\")",
        "output": "line 1: clean\nline 2: ['evil-cdn.example']\nline 3: clean",
        "codeNotes": [
          {
            "line": 6,
            "note": "Tokenise, lower-case, and intersect with the IOC set."
          }
        ],
        "tryIt": "Why did \"198.51.100.77:443\" not match directly? How does the practice handle ports?",
        "check": {
          "question": "What is an indicator of compromise?",
          "options": [
            "A strong password",
            "A known sign of malicious activity, such as a bad IP or file hash",
            "A firewall rule"
          ],
          "answer": 1,
          "why": "IOCs describe known-bad artefacts."
        }
      },
      {
        "title": "Alert quality",
        "say": [
          "Security teams are often flooded with alerts; too many false alarms cause alert fatigue, and real attacks get missed.",
          "Good alerts are specific, explain why they fired, include the evidence, and suggest the next step.",
          "Measuring precision (how many alerts were real) guides tuning.",
          "Grouping related alerts into one incident, for example all alerts involving one IP in an hour, reduces noise.",
          "Suppression lists for known-good activity, such as a vulnerability scanner the team runs, avoid repeated false alarms.",
          "The example computes precision for a week of alerts.",
          "An alert that nobody acts on is worse than no alert, because it trains people to ignore alerts.",
          "Regularly reviewing which rules fire most often, and why, keeps the system useful.",
          "Detection engineering treats rules as code: versioned, tested and reviewed."
        ],
        "example": "A car alarm that goes off every time a cat walks past: soon nobody looks up when it rings.",
        "code": "alerts = {\"brute_force\": (40, 36), \"ioc_match\": (25, 9), \"new_country_login\": (120, 12)}\nfor rule, (fired, real) in alerts.items():\n    print(f\"{rule:18} fired {fired:3} real {real:2} precision {real / fired:.0%}\")",
        "output": "brute_force        fired  40 real 36 precision 90%\nioc_match          fired  25 real  9 precision 36%\nnew_country_login  fired 120 real 12 precision 10%",
        "codeNotes": [
          {
            "line": 3,
            "note": "Precision: real alerts divided by all alerts."
          }
        ],
        "tryIt": "Which rule would you tune first? What change might improve it?",
        "check": {
          "question": "What is alert fatigue?",
          "options": [
            "Tired servers",
            "People ignoring alerts because too many are false alarms",
            "Slow networks"
          ],
          "answer": 1,
          "why": "Too much noise hides real attacks."
        }
      },
      {
        "title": "From detection to response",
        "say": [
          "Detection is valuable only if someone acts. Runbooks describe the steps for each alert type.",
          "For brute force: confirm the pattern, check whether any login succeeded, block or rate-limit the source, and notify the account owner.",
          "For IOC matches: identify the affected machine, check what data it accessed, and isolate it if needed.",
          "SOAR (security orchestration, automation and response) tools automate routine steps, such as adding an IP to a blocklist.",
          "Every response should be recorded, feeding the incident process (Day 29) and improving future detection.",
          "The example maps alert types to first response steps.",
          "Mean time to detect and mean time to respond are key metrics for security teams.",
          "Automating the first steps buys time for people to investigate carefully.",
          "Practising responses with simulated alerts keeps teams ready."
        ],
        "example": "A fire alarm connected to a plan: who calls the fire service, who checks each floor, and where everyone meets.",
        "code": "runbooks = {\"brute_force\": [\"check for a successful login\", \"rate-limit the source IP\", \"notify the account owner\"],\n            \"ioc_match\": [\"identify the machine\", \"review its recent activity\", \"isolate it if confirmed\"]}\nfor alert, steps in runbooks.items():\n    print(alert)\n    for i, step in enumerate(steps, 1):\n        print(f\"  {i}. {step}\")",
        "output": "brute_force\n  1. check for a successful login\n  2. rate-limit the source IP\n  3. notify the account owner\nioc_match\n  1. identify the machine\n  2. review its recent activity\n  3. isolate it if confirmed",
        "codeNotes": [
          {
            "line": 1,
            "note": "Each alert type has written first steps."
          }
        ],
        "tryIt": "Which step in these runbooks could be automated safely?",
        "check": {
          "question": "What is a runbook?",
          "options": [
            "A log file",
            "Written steps for responding to a specific alert type",
            "A type of malware"
          ],
          "answer": 1,
          "why": "Runbooks turn alerts into action."
        }
      },
      {
        "title": "Practice time: brute force and IOCs",
        "say": [
          "Practice 1: brute_force_ips(lines, threshold, window). Keep only FAILED_LOGIN lines; parse the first field with datetime.fromisoformat and the IP with re.search(r\"ip=(\\S+)\"); for each IP sort the times and report it if any run of threshold failures spans at most window seconds. Return sorted IPs.",
          "The checks include a fast attacker, a slow one visible only with a one-hour window, successful logins that must be ignored, and a window too short to trigger.",
          "Practice 2: ioc_hits(lines, iocs). For each numbered line, tokenise with re.findall(r\"[A-Za-z0-9.:-]+\", line), lower-case tokens, and report (line, token) for IOC matches once per line in order of appearance.",
          "The checks include a capitalised domain, a file hash and repeated matches in one line.",
          "After passing, generate a day of fake logs with a hidden attack and see whether your rules find it.",
          "The example combines both rules into a small alert report.",
          "Tomorrow writes network detection rules in the style of Snort and Suricata.",
          "Detection is a craft: rules improve steadily with real data and honest review of misses and false alarms.",
          "These two rules, behaviour and indicators, represent the two main families of detection."
        ],
        "example": "A security desk that watches both for known faces and for anyone behaving suspiciously.",
        "code": "import re\nfrom datetime import datetime\n\nlogs = [f\"2026-05-01T10:00:{s:02d} FAILED_LOGIN user=admin ip=198.51.100.77\" for s in (0, 10, 20, 30)]\niocs = {\"198.51.100.77\"}\ntimes = sorted(datetime.fromisoformat(l.split()[0]) for l in logs)\nbrute = (times[3] - times[0]).total_seconds() <= 60\nioc = any(re.search(r\"ip=(\\S+)\", l).group(1) in iocs for l in logs)\nprint(\"brute force:\", brute, \"| known-bad IP:\", ioc, \"| severity:\", \"HIGH\" if brute and ioc else \"MEDIUM\")",
        "output": "brute force: True | known-bad IP: True | severity: HIGH",
        "codeNotes": [
          {
            "line": 9,
            "note": "Two independent signals together raise severity."
          }
        ],
        "tryIt": "Why is an alert with both signals more trustworthy than either alone?",
        "check": {
          "question": "brute_force_ips ignores which lines?",
          "options": [
            "Lines with IP addresses",
            "Lines without FAILED_LOGIN",
            "Lines from the morning"
          ],
          "answer": 1,
          "why": "Only failed logins count."
        }
      }
    ],
    "summary": [
      "SIEMs collect logs centrally and run detection rules across them.",
      "Sliding windows detect bursts such as brute-force logins.",
      "IOC matching finds contact with known-bad infrastructure; update feeds often.",
      "Tune alerts for precision to avoid alert fatigue.",
      "Connect detection to response with runbooks and automation."
    ],
    "projectStep": {
      "title": "Detection rules",
      "steps": [
        "Implement brute_force_ips and ioc_hits.",
        "Create a day of synthetic logs with two hidden attacks.",
        "Measure your rules' hits and false alarms, and write runbooks for each."
      ]
    }
  },
  {
    "day": 25,
    "title": "Intrusion Detection & Prevention Systems (IDS/IPS): Snort & Suricata Rules",
    "goal": "You can explain intrusion detection and prevention systems, read and parse Snort-style rules, match packets against rules including network ranges and content, and understand the trade-offs of signature-based detection.",
    "minutes": 30,
    "recap": "Yesterday you analysed logs after the fact. Today you watch network traffic as it passes, using rules like those in Snort and Suricata, the most widely used open-source network intrusion detection systems.",
    "parts": [
      {
        "title": "IDS and IPS",
        "say": [
          "An intrusion detection system (IDS) watches network traffic and raises alerts on suspicious patterns; an intrusion prevention system (IPS) sits in the traffic path and can block it.",
          "Signature-based detection matches known attack patterns; anomaly-based detection learns normal behaviour and flags deviations.",
          "Snort (created in 1998) and Suricata are popular open-source engines; commercial firewalls include similar features.",
          "An IDS can monitor a copy of traffic without risk of blocking good users; an IPS protects actively but must avoid false positives carefully.",
          "Encrypted traffic (TLS) hides content from network sensors, so modern detection also relies on metadata, DNS and endpoint telemetry.",
          "Metadata such as who talks to whom, how often and how much still reveals a great deal even when content is encrypted.",
          "The example compares IDS and IPS behaviour for the same traffic.",
          "Network detection complements log-based detection by seeing attacks that never reach application logs.",
          "Placing sensors at key points, such as the internet edge and between network zones, maximises what they can see.",
          "Rules are shared by communities and vendors, and updated as new attacks appear."
        ],
        "example": "A security camera (IDS) versus a guard at the door who can also stop people (IPS).",
        "code": "packets = [(\"normal page view\", False), (\"SQL injection attempt\", True), (\"backup traffic\", False)]\nfor desc, malicious in packets:\n    ids = \"ALERT\" if malicious else \"-\"\n    ips = \"DROP\" if malicious else \"pass\"\n    print(f\"{desc:22} IDS: {ids:6} IPS: {ips}\")",
        "output": "normal page view       IDS: -      IPS: pass\nSQL injection attempt  IDS: ALERT  IPS: DROP\nbackup traffic         IDS: -      IPS: pass",
        "codeNotes": [
          {
            "line": 4,
            "note": "An IPS can act on the same detection."
          }
        ],
        "tryIt": "What happens to a legitimate user if an IPS rule has a false positive?",
        "check": {
          "question": "How does an IPS differ from an IDS?",
          "options": [
            "It is slower",
            "It sits in the traffic path and can block traffic, not just alert",
            "It only reads logs"
          ],
          "answer": 1,
          "why": "Prevention means blocking."
        }
      },
      {
        "title": "Anatomy of a rule",
        "say": [
          "A Snort-style rule has a header and options: action protocol source source_port -> destination destination_port (options).",
          "For example: alert tcp any any -> 10.0.0.5 22 (msg:\"SSH root\"; content:\"root\"; sid:1001;).",
          "The action is alert, drop, or pass; the protocol is tcp, udp or icmp; addresses can be any, a single IP or a network like 203.0.113.0/24.",
          "Options include msg (the alert text), content (bytes to find in the payload) and sid (a unique rule ID); real rules support many more.",
          "Common extras include nocase for case-insensitive content, flow to specify the direction, and classtype to categorise the alert.",
          "Practice 1 is parse_rule(rule), which extracts these fields with a regular expression and requires a sid.",
          "The example splits a rule into its header and options.",
          "Reading rules fluently is a core skill for network defenders.",
          "Rule IDs let teams track, tune and disable specific rules without confusion.",
          "Rule sets are version-controlled and tested like code."
        ],
        "example": "A recipe card with a heading (which dish, which oven) and detailed instructions underneath.",
        "code": "import re\n\nrule = 'alert tcp any any -> 10.0.0.5 22 (msg:\"SSH root\"; content:\"root\"; sid:1001;)'\nm = re.fullmatch(r\"(\\w+) (\\w+) (\\S+) (\\S+) -> (\\S+) (\\S+) \\((.*)\\)\", rule)\nprint(\"header:\", m.groups()[:6])\nprint(\"options:\", dict(re.findall(r'(\\w+):\\s*\"?([^\";]*)\"?;', m.group(7))))",
        "output": "header: ('alert', 'tcp', 'any', 'any', '10.0.0.5', '22')\noptions: {'msg': 'SSH root', 'content': 'root', 'sid': '1001'}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Seven groups: six header fields and the options."
          },
          {
            "line": 6,
            "note": "key:value pairs, values optionally quoted."
          }
        ],
        "tryIt": "What would this rule alert on? What legitimate traffic might trigger it?",
        "check": {
          "question": "What does the sid option provide?",
          "options": [
            "The severity",
            "A unique ID for the rule",
            "The source IP"
          ],
          "answer": 1,
          "why": "sid identifies the rule."
        }
      },
      {
        "title": "Matching packets",
        "say": [
          "To match, every header field must fit the packet: protocol, source (any, or an address inside a network), destination and destination port.",
          "If the rule has content, that byte string must appear in the payload.",
          "Practice 2 is rule_matches(rule, packet), which applies these checks with Python's ipaddress module for source networks.",
          "Real engines are highly optimised, matching thousands of rules against millions of packets per second with multi-pattern search algorithms.",
          "Content matching is case-sensitive by default; options such as nocase change that.",
          "The example matches a few packets against one rule.",
          "Understanding matching logic helps you write rules that are precise rather than noisy.",
          "Rules that match only on common content, such as \"admin\", generate many false positives; combining ports, directions and content narrows them.",
          "Testing rules against captured normal traffic before deployment prevents floods of false alerts."
        ],
        "example": "A customs officer checking a parcel's origin, destination and contents against a list of rules.",
        "code": "import ipaddress\n\nrule = {\"proto\": \"tcp\", \"src\": \"203.0.113.0/24\", \"dst\": \"any\", \"dst_port\": \"22\", \"content\": \"root\"}\npackets = [{\"proto\": \"tcp\", \"src\": \"203.0.113.40\", \"dst\": \"10.0.0.5\", \"dst_port\": 22, \"payload\": \"login root\"},\n           {\"proto\": \"tcp\", \"src\": \"198.51.100.3\", \"dst\": \"10.0.0.5\", \"dst_port\": 22, \"payload\": \"login root\"},\n           {\"proto\": \"tcp\", \"src\": \"203.0.113.40\", \"dst\": \"10.0.0.5\", \"dst_port\": 22, \"payload\": \"login priya\"}]\nfor p in packets:\n    ok = (p[\"proto\"] == rule[\"proto\"] and ipaddress.ip_address(p[\"src\"]) in ipaddress.ip_network(rule[\"src\"])\n          and str(p[\"dst_port\"]) == rule[\"dst_port\"] and rule[\"content\"] in p[\"payload\"])\n    print(f\"{p['src']:13} {p['payload']:12} -> {'MATCH' if ok else 'no match'}\")",
        "output": "203.0.113.40  login root   -> MATCH\n198.51.100.3  login root   -> no match\n203.0.113.40  login priya  -> no match",
        "codeNotes": [
          {
            "line": 8,
            "note": "Every condition must hold."
          },
          {
            "line": 9,
            "note": "Ports compared as strings."
          }
        ],
        "tryIt": "Which single condition fails for each non-matching packet?",
        "check": {
          "question": "When does a rule with content match a packet?",
          "options": [
            "When any field matches",
            "When all header fields match and the content appears in the payload",
            "Always"
          ],
          "answer": 1,
          "why": "All conditions must be satisfied."
        }
      },
      {
        "title": "Signatures versus anomalies",
        "say": [
          "Signatures are precise and explainable: when a rule fires, you know exactly why. But they only catch known patterns.",
          "That precision makes them ideal for well-understood threats such as known exploit strings or malware traffic.",
          "Attackers evade signatures with small changes: encoding, fragmentation, different capitalisation or new tools.",
          "Anomaly detection models normal behaviour, such as typical traffic volumes or which servers talk to each other, and flags deviations, catching some new attacks.",
          "Anomaly detection produces more false positives and needs a period of learning; changes in business activity can look like attacks.",
          "Most organisations combine both, plus threat intelligence (Day 24).",
          "The example flags an anomaly when traffic exceeds a multiple of the normal average.",
          "No single detection method is enough; again, layers matter.",
          "Machine learning helps with anomaly detection but still needs human review of what it flags.",
          "Baselines should be updated as the organisation changes, or alerts drift out of tune."
        ],
        "example": "A guard with a list of known troublemakers, and another who simply notices when something feels out of the ordinary.",
        "code": "import statistics\n\nnormal_mb_per_hour = [120, 135, 110, 128, 140, 125, 118]\nbaseline = statistics.mean(normal_mb_per_hour)\nfor hour, mb in [(\"09:00\", 130), (\"02:00\", 980), (\"14:00\", 160)]:\n    flag = \"ANOMALY\" if mb > 3 * baseline else \"normal\"\n    print(f\"{hour} {mb:4} MB -> {flag} (baseline {baseline:.0f} MB)\")",
        "output": "09:00  130 MB -> normal (baseline 125 MB)\n02:00  980 MB -> ANOMALY (baseline 125 MB)\n14:00  160 MB -> normal (baseline 125 MB)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Flag anything above three times the average."
          }
        ],
        "tryIt": "Why might a large upload at 02:00 be more suspicious than one at 14:00?",
        "check": {
          "question": "What is a weakness of signature-based detection?",
          "options": [
            "It is unexplainable",
            "It only catches known patterns and is evaded by small changes",
            "It never fires"
          ],
          "answer": 1,
          "why": "New or modified attacks slip past."
        }
      },
      {
        "title": "Tuning and testing rules",
        "say": [
          "New rules should start in alert-only mode, even on an IPS, until their false-positive rate is known.",
          "Test each rule against captured normal traffic (should not match) and against safe samples of the attack pattern (should match).",
          "Document each rule's purpose, the threat it covers, and how to respond when it fires.",
          "Disable or refine rules that fire constantly without real attacks; noise hides important alerts.",
          "Keep rule sets in version control with review, just like application code.",
          "The example runs a rule against labelled test traffic and reports hits and misses.",
          "Well-tuned rules are an asset that improves year after year.",
          "Sharing rules and results with peer organisations raises everyone's defences.",
          "Tomorrow shifts from defence to assessment: how professionals find and score vulnerabilities."
        ],
        "example": "Calibrating a metal detector at the airport with test objects before passengers arrive.",
        "code": "def rule(payload):\n    return \"union select\" in payload.lower()\n\ntests = [(\"GET /search?q=union+select+data\", True), (\"GET /search?q=trade union news\", False),\n         (\"POST id=1 UNION SELECT password\", True), (\"GET /products\", False)]\nfor payload, should_match in tests:\n    got = rule(payload)\n    print(f\"{'PASS' if got == should_match else 'FAIL'} matched={got!s:5} {payload}\")",
        "output": "FAIL matched=False GET /search?q=union+select+data\nPASS matched=False GET /search?q=trade union news\nPASS matched=True  POST id=1 UNION SELECT password\nPASS matched=False GET /products",
        "codeNotes": [
          {
            "line": 2,
            "note": "A simple content rule."
          },
          {
            "line": 8,
            "note": "Each labelled sample checks the rule."
          }
        ],
        "tryIt": "The first test fails. What does URL encoding (+ for spaces) teach you about writing content rules?",
        "check": {
          "question": "How should a new IPS rule be deployed?",
          "options": [
            "Immediately in blocking mode",
            "In alert-only mode first, until its false positives are understood",
            "Only on weekends"
          ],
          "answer": 1,
          "why": "Observe before blocking."
        }
      },
      {
        "title": "Practice time: parse and match rules",
        "say": [
          "Practice 1: parse_rule(rule). Match the rule with re.fullmatch(r\"(\\w+) (\\w+) (\\S+) (\\S+) -> (\\S+) (\\S+) \\((.*)\\)\"), extract options with re.findall, require sid (ValueError otherwise), and return a dictionary with sid as an int and content None if absent.",
          "The checks include an alert rule with content, a drop rule without content, a rule with no arrow, and a rule without sid.",
          "Practice 2: rule_matches(rule, packet). Check protocol, source network (with ipaddress), destination and destination port (as strings), treating \"any\" as a wildcard, then the content if present.",
          "The checks include a match, missing content, a wrong port, and a source-network rule matching one address and not another.",
          "After passing, write three rules for threats from earlier lessons (SQL injection, SSH brute force, a known-bad IP) and test them against sample packets.",
          "The example parses a rule and matches it against a small packet list.",
          "Tomorrow covers penetration testing and how vulnerabilities are scored.",
          "Rule writing combines everything: knowing the attack, the protocol and the normal traffic.",
          "Precision is the goal: every alert should deserve a person's attention."
        ],
        "example": "A new sensor installed, calibrated against known test objects, and put into service.",
        "code": "import re\n\nrule = 'alert tcp any any -> any 80 (msg:\"Admin probe\"; content:\"/admin\"; sid:3001;)'\nm = re.fullmatch(r\"(\\w+) (\\w+) (\\S+) (\\S+) -> (\\S+) (\\S+) \\((.*)\\)\", rule)\nopts = dict(re.findall(r'(\\w+):\\s*\"?([^\";]*)\"?;', m.group(7)))\ntraffic = [(80, \"GET /admin/login\"), (80, \"GET /products\"), (443, \"GET /admin\")]\nfor port, payload in traffic:\n    hit = str(port) == m.group(6) and opts[\"content\"] in payload\n    print(f\":{port:<4} {payload:18} {'ALERT sid ' + opts['sid'] if hit else '-'}\")",
        "output": ":80   GET /admin/login   ALERT sid 3001\n:80   GET /products      -\n:443  GET /admin         -",
        "codeNotes": [
          {
            "line": 8,
            "note": "Port and content must both match."
          }
        ],
        "tryIt": "Why does the request on port 443 not alert? What does that tell you about encrypted traffic?",
        "check": {
          "question": "parse_rule without a sid option should?",
          "options": [
            "Assign sid 0",
            "Raise ValueError",
            "Ignore it"
          ],
          "answer": 1,
          "why": "Every rule needs a unique ID."
        }
      }
    ],
    "summary": [
      "IDS alerts on suspicious traffic; IPS can block it.",
      "Snort-style rules have a header (action, protocol, addresses, ports) and options (msg, content, sid).",
      "A packet matches when every header field and the content match.",
      "Signatures are precise but miss new attacks; anomalies catch some new ones but are noisier.",
      "Deploy rules in alert mode first and test them against labelled traffic."
    ],
    "projectStep": {
      "title": "Network detection rule set",
      "steps": [
        "Implement parse_rule and rule_matches.",
        "Write five rules for threats from this course.",
        "Test them against labelled traffic and tune away false positives."
      ]
    }
  },
  {
    "day": 26,
    "title": "Penetration Testing & Vulnerability Assessment: CVSS v3.1 Scoring",
    "goal": "You can describe the phases of an authorised penetration test, explain vulnerability assessment, compute CVSS v3.1 base scores exactly from the specification, parse CVSS vectors, and map scores to severity ratings.",
    "minutes": 30,
    "recap": "Days 22 to 25 detected attacks. Today switches perspective to the authorised tester who finds weaknesses first, and to the standard way of scoring how serious each weakness is.",
    "parts": [
      {
        "title": "Penetration testing",
        "say": [
          "A penetration test is an authorised, simulated attack on a system to find weaknesses before real attackers do.",
          "It always starts with written permission and a clear scope: which systems, which techniques, which times, and who to call if something breaks (Day 1).",
          "Typical phases: planning and scoping, reconnaissance, scanning and enumeration, careful exploitation to confirm findings, and reporting with fixes.",
          "Vulnerability assessment is broader but shallower: automated scanners list many possible issues without proving each one.",
          "Frameworks such as the OWASP Web Security Testing Guide and the PTES (Penetration Testing Execution Standard) guide professional work.",
          "The example prints the phases with what each produces.",
          "The report is the product: clear findings, evidence, risk ratings and practical fixes.",
          "Red teams run longer, goal-based exercises that also test detection and response; blue teams defend; purple teaming has them work together.",
          "Retesting after fixes confirms that the vulnerabilities are really closed."
        ],
        "example": "A fire safety inspection by a qualified inspector, arranged with the owner, before any real fire.",
        "code": "phases = [(\"scoping\", \"signed authorisation and scope\"), (\"reconnaissance\", \"list of targets and technologies\"),\n          (\"scanning\", \"open services and candidate weaknesses\"), (\"verification\", \"confirmed findings with evidence\"),\n          (\"reporting\", \"risk-rated findings and fixes\"), (\"retest\", \"confirmation that fixes work\")]\nfor i, (phase, output) in enumerate(phases, 1):\n    print(f\"{i}. {phase:15} -> {output}\")",
        "output": "1. scoping         -> signed authorisation and scope\n2. reconnaissance  -> list of targets and technologies\n3. scanning        -> open services and candidate weaknesses\n4. verification    -> confirmed findings with evidence\n5. reporting       -> risk-rated findings and fixes\n6. retest          -> confirmation that fixes work",
        "codeNotes": [
          {
            "line": 1,
            "note": "Nothing starts without authorisation."
          }
        ],
        "tryIt": "Why is the report more valuable to the client than the testing itself?",
        "check": {
          "question": "What must exist before a penetration test begins?",
          "options": [
            "A new server",
            "Written authorisation and an agreed scope",
            "A public announcement"
          ],
          "answer": 1,
          "why": "Permission and scope first."
        }
      },
      {
        "title": "CVSS: scoring severity",
        "say": [
          "The Common Vulnerability Scoring System (CVSS) gives vulnerabilities a score from 0.0 to 10.0 so they can be compared and prioritised.",
          "Version 3.1 base metrics describe exploitability (attack vector, attack complexity, privileges required, user interaction) and impact (confidentiality, integrity, availability), plus scope.",
          "Scores are written as vectors such as CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H, which scores 9.8: network-reachable, easy, no privileges, no user action, high impact.",
          "Ratings: None 0.0, Low 0.1-3.9, Medium 4.0-6.9, High 7.0-8.9, Critical 9.0-10.0.",
          "Base scores describe the vulnerability itself; temporal and environmental metrics adjust for exploit availability and your own systems.",
          "The example splits a vector into its metrics.",
          "CVSS is a starting point for prioritisation, not the whole story: an internet-facing 7.5 can matter more than an internal 9.0.",
          "CVSS 4.0 was released in 2023 with refined metrics; 3.1 remains very widely used.",
          "Knowing the metrics lets you read any advisory and understand quickly why it was scored as it was."
        ],
        "example": "A hospital triage score: a standard number that helps decide who is treated first, alongside the doctor's judgement.",
        "code": "vector = \"CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\"\nnames = {\"AV\": \"attack vector\", \"AC\": \"complexity\", \"PR\": \"privileges\", \"UI\": \"user interaction\",\n         \"S\": \"scope\", \"C\": \"confidentiality\", \"I\": \"integrity\", \"A\": \"availability\"}\nfor part_ in vector.split(\"/\")[1:]:\n    key, value = part_.split(\":\")\n    print(f\"{key:2} {names[key]:16} = {value}\")",
        "output": "AV attack vector    = N\nAC complexity       = L\nPR privileges       = N\nUI user interaction = N\nS  scope            = U\nC  confidentiality  = H\nI  integrity        = H\nA  availability     = H",
        "codeNotes": [
          {
            "line": 4,
            "note": "Skip the \"CVSS:3.1\" prefix."
          }
        ],
        "tryIt": "Which metric would you change to describe a flaw that needs the victim to click a link?",
        "check": {
          "question": "What CVSS rating does a score of 7.5 have?",
          "options": [
            "Medium",
            "High",
            "Critical"
          ],
          "answer": 1,
          "why": "7.0-8.9 is High."
        }
      },
      {
        "title": "Computing the base score",
        "say": [
          "The specification defines weights for each metric value, for example attack vector Network 0.85 and Physical 0.2, and impact High 0.56.",
          "The impact sub-score starts from ISS = 1 - (1 - C)(1 - I)(1 - A); with scope unchanged, impact = 6.42 × ISS.",
          "Exploitability = 8.22 × AV × AC × PR × UI. The base score adds impact and exploitability, capped at 10, and rounds up to one decimal.",
          "When scope changes (the vulnerability affects components beyond its own), the formulas use different constants and privilege weights.",
          "Practice 1 is cvss_base(m), which implements the full 3.1 formula, including the special round-up function that avoids floating point surprises.",
          "The example computes exploitability and impact for the classic 9.8 vector.",
          "Implementing the formula exactly and testing it against known scores (9.8, 6.1, 7.8) is good practice for any standard.",
          "The round-up function works on scaled integers, because naive rounding of values like 4.000000001 would give the wrong answer.",
          "Official calculators exist from FIRST and NIST, which are useful for checking your results."
        ],
        "example": "Following an official recipe to the gram so every kitchen produces the same cake.",
        "code": "import math\n\nAV, AC, PR, UI = 0.85, 0.77, 0.85, 0.85\nC = I = A = 0.56\niss = 1 - (1 - C) * (1 - I) * (1 - A)\nimpact = 6.42 * iss\nexploit = 8.22 * AV * AC * PR * UI\nraw = min(impact + exploit, 10)\nprint(f\"ISS {iss:.4f} | impact {impact:.4f} | exploitability {exploit:.4f} | raw {raw:.4f}\")\nprint(\"rounded up to one decimal:\", math.ceil(raw * 10) / 10)",
        "output": "ISS 0.9148 | impact 5.8731 | exploitability 3.8870 | raw 9.7602\nrounded up to one decimal: 9.8",
        "codeNotes": [
          {
            "line": 5,
            "note": "Combined impact on C, I and A."
          },
          {
            "line": 10,
            "note": "A simple round-up; the specification defines a more careful version."
          }
        ],
        "tryIt": "Change UI to 0.62 (user interaction required). What happens to the score?",
        "check": {
          "question": "What does the CVSS round-up function do?",
          "options": [
            "Rounds to the nearest whole number",
            "Rounds up to one decimal place, carefully avoiding floating point errors",
            "Truncates"
          ],
          "answer": 1,
          "why": "Base scores always round up to one decimal."
        }
      },
      {
        "title": "From score to priority",
        "say": [
          "Practice 2 is cvss_severity(vector, score), which validates a 3.1 vector with all eight base metrics and maps the score to its rating.",
          "Real prioritisation combines CVSS with context: is the system internet-facing, is there a public exploit, is it being exploited now?",
          "CISA's Known Exploited Vulnerabilities catalogue lists flaws seen in real attacks; those should jump the queue.",
          "EPSS (Exploit Prediction Scoring System) estimates the probability that a vulnerability will be exploited soon.",
          "Service-level targets, such as fixing critical findings within 7 days and high within 30, turn ratings into action.",
          "The example sorts findings by rating and exposure.",
          "Good prioritisation fixes the most dangerous problems first, not simply the highest numbers.",
          "Tracking how long findings stay open shows whether the process works.",
          "Exceptions, when a fix must wait, should be documented with compensating controls and a review date."
        ],
        "example": "A to-do list sorted not only by how big each job is, but by which ones are already causing damage.",
        "code": "def rating(score):\n    return \"None\" if score == 0 else \"Low\" if score < 4 else \"Medium\" if score < 7 else \"High\" if score < 9 else \"Critical\"\n\nfindings = [(\"admin panel SQLi\", 9.8, True), (\"internal info leak\", 5.3, False), (\"VPN flaw, exploited in the wild\", 7.5, True)]\nfor name, score, exposed in sorted(findings, key=lambda f: (not f[2], -f[1])):\n    print(f\"{rating(score):8} {score:4} exposed={exposed!s:5} {name}\")",
        "output": "Critical  9.8 exposed=True  admin panel SQLi\nHigh      7.5 exposed=True  VPN flaw, exploited in the wild\nMedium    5.3 exposed=False internal info leak",
        "codeNotes": [
          {
            "line": 5,
            "note": "Exposed systems first, then by score."
          }
        ],
        "tryIt": "Would you move the VPN flaw above the SQLi if it was on the CISA exploited list? Why?",
        "check": {
          "question": "Why is CVSS alone not enough to prioritise?",
          "options": [
            "It is inaccurate",
            "Context such as exposure and active exploitation also matters",
            "It is secret"
          ],
          "answer": 1,
          "why": "Scores describe the flaw; context decides urgency."
        }
      },
      {
        "title": "Writing good findings",
        "say": [
          "Each finding in a report should include a clear title, severity with CVSS vector, affected systems, evidence, business impact and recommended fix.",
          "Evidence must be reproducible but safe: screenshots, requests and responses, without exposing real customer data.",
          "Recommendations should be specific (\"use parameterised queries in /search\") rather than generic (\"fix input validation\").",
          "An executive summary explains overall risk in plain language for decision makers.",
          "Findings should be shared securely, since a report is a map of how to attack the organisation.",
          "The example formats a finding from structured data.",
          "A well-written report gets vulnerabilities fixed; a confusing one gets filed away.",
          "Positive findings, controls that worked, are worth reporting too, so teams know what to keep.",
          "Tracking findings in the team's normal ticket system keeps fixes visible alongside other work."
        ],
        "example": "A doctor's referral letter: what was found, how serious it is, the evidence, and exactly what should be done next.",
        "code": "finding = {\"title\": \"SQL injection in product search\", \"cvss\": \"9.8 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)\",\n           \"affected\": \"/api/search?q=\", \"impact\": \"full read access to the customer database\",\n           \"fix\": \"use parameterised queries in search_products(); add a WAF rule as a stopgap\"}\nfor key, value in finding.items():\n    print(f\"{key.upper():9} {value}\")",
        "output": "TITLE     SQL injection in product search\nCVSS      9.8 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)\nAFFECTED  /api/search?q=\nIMPACT    full read access to the customer database\nFIX       use parameterised queries in search_products(); add a WAF rule as a stopgap",
        "codeNotes": [
          {
            "line": 3,
            "note": "A specific fix plus a temporary mitigation."
          }
        ],
        "tryIt": "Write a one-sentence executive summary for this finding.",
        "check": {
          "question": "What makes a recommendation useful?",
          "options": [
            "It is generic",
            "It is specific about what to change and where",
            "It is long"
          ],
          "answer": 1,
          "why": "Specific fixes get done."
        }
      },
      {
        "title": "Practice time: CVSS",
        "say": [
          "Practice 1: cvss_base(m). Use the weight tables; pick privilege weights by scope; compute ISS, impact (unchanged or changed formula) and exploitability; return 0.0 if impact <= 0; otherwise round up min(impact + exploitability, 10) (or 1.08 times the sum for changed scope) using the specification's round-up function.",
          "The checks: 9.8 for the classic critical vector, 6.1 for a typical reflected XSS with changed scope, 7.8 for local privilege escalation, and 0.0 when there is no impact.",
          "Practice 2: cvss_severity(vector, score). Require the CVSS:3.1/ prefix and all eight metrics (ValueError otherwise), parse the metrics, and map the score to None, Low, Medium, High or Critical.",
          "The checks include the boundaries 3.9, 4.0, 7.0 and 8.9 and two invalid vectors.",
          "After passing, look up a recent CVE on a public database and confirm your function reproduces its base score.",
          "The example scores and rates three vectors.",
          "Tomorrow covers zero trust: never trust a request just because of where it comes from.",
          "Standards like CVSS let the whole industry talk about risk in the same language.",
          "Exact implementation plus official test cases is the professional way to build any scoring tool."
        ],
        "example": "A standard exam mark scheme: every examiner arrives at the same score for the same answer.",
        "code": "def roundup(x):\n    i = round(x * 100000)\n    return i / 100000 if i % 10000 == 0 else (i // 10000 + 1) / 10\n\nfor raw in [9.7, 9.71, 4.0000000001, 6.0499999]:\n    print(f\"raw {raw!r:14} -> {roundup(raw)}\")",
        "output": "raw 9.7            -> 9.7\nraw 9.71           -> 9.8\nraw 4.0000000001   -> 4.0\nraw 6.0499999      -> 6.1",
        "codeNotes": [
          {
            "line": 2,
            "note": "Work in scaled integers to avoid floating point noise."
          }
        ],
        "tryIt": "Why does 4.0000000001 round to 4.0 rather than 4.1?",
        "check": {
          "question": "cvss_severity(vector, 0.0) returns which rating?",
          "options": [
            "Low",
            "None",
            "Medium"
          ],
          "answer": 1,
          "why": "A zero score is rated None."
        }
      }
    ],
    "summary": [
      "Penetration tests are authorised, scoped simulations ending in a useful report.",
      "CVSS 3.1 scores vulnerabilities from 0 to 10 using exploitability, impact and scope.",
      "Implement the base formula exactly, including the round-up function.",
      "Prioritise with context: exposure, active exploitation and EPSS.",
      "Write specific, evidence-backed findings with clear fixes."
    ],
    "projectStep": {
      "title": "Vulnerability report",
      "steps": [
        "Implement cvss_base and cvss_severity.",
        "Score three findings from earlier lessons with full vectors.",
        "Write a short report with an executive summary and prioritised fixes."
      ]
    }
  },
  {
    "day": 27,
    "title": "Zero Trust Architecture (ZTA): BeyondCorp & Continuous Verification",
    "goal": "You can explain zero trust architecture, make access decisions from device health, recent MFA, location and risk, apply micro-segmentation between services, and contrast zero trust with perimeter-based security.",
    "minutes": 30,
    "recap": "Yesterday scored weaknesses. Today reshapes the whole design: instead of trusting everything inside the network, zero trust verifies every request, every time.",
    "parts": [
      {
        "title": "Beyond the perimeter",
        "say": [
          "Traditional security built a strong perimeter (firewalls, VPNs) and trusted anything inside it, like a castle with a moat.",
          "Remote work, cloud services and mobile devices dissolved the perimeter: users and data are everywhere.",
          "Attackers who get inside, through phishing or a compromised laptop, then move freely in a flat, trusting network.",
          "Zero trust, described in NIST SP 800-207, assumes no request is trustworthy just because of its network location.",
          "Google's BeyondCorp, started after a major 2009 attack, showed that employees could work securely from any network without a traditional VPN.",
          "The example contrasts perimeter and zero trust decisions for the same request.",
          "Zero trust is a strategy, not a product; vendors sell pieces of it.",
          "Its core principles: verify explicitly, use least privilege, and assume breach.",
          "Many organisations adopt it gradually, starting with their most sensitive applications.",
          "A useful test question for any design is: if an attacker were already inside this network, what could they reach from here?"
        ],
        "example": "An office where your badge is checked at every door, not just at the front entrance.",
        "code": "request = {\"network\": \"office LAN\", \"device_managed\": False, \"mfa\": False}\nperimeter = \"ALLOW\" if request[\"network\"] == \"office LAN\" else \"DENY\"\nzero_trust = \"ALLOW\" if request[\"device_managed\"] and request[\"mfa\"] else \"DENY\"\nprint(\"perimeter model:\", perimeter)\nprint(\"zero trust model:\", zero_trust)",
        "output": "perimeter model: ALLOW\nzero trust model: DENY",
        "codeNotes": [
          {
            "line": 2,
            "note": "Trusts the location."
          },
          {
            "line": 3,
            "note": "Trusts only verified device and identity."
          }
        ],
        "tryIt": "Which model would stop an attacker who plugged an unknown laptop into the office network?",
        "check": {
          "question": "What does zero trust assume?",
          "options": [
            "The internal network is safe",
            "No request is trusted just because of its network location",
            "Firewalls are unnecessary"
          ],
          "answer": 1,
          "why": "Location alone never grants trust."
        }
      },
      {
        "title": "Continuous verification",
        "say": [
          "Zero trust decisions combine several signals for every request: user identity, device health, recent MFA, location, time and behaviour.",
          "Device health means the device is managed, patched, encrypted and running endpoint protection.",
          "A policy engine evaluates the signals and returns allow, deny, or step-up (ask for MFA again).",
          "Practice 1 is zt_decide(req), with deny rules first (non-compliant device, disallowed country, very high risk), then step-up rules (stale MFA, elevated risk), then allow.",
          "Order matters: a request that is both high-risk and has stale MFA must be denied, not merely stepped up.",
          "The example evaluates several requests.",
          "Decisions happen continuously, not only at login: a session can be downgraded if the device falls out of compliance.",
          "Risk scores often come from identity providers that analyse unusual behaviour, such as impossible travel between countries.",
          "Clear feedback to users, such as \"please update your device\", makes strict policies bearable.",
          "Every decision, including the signals that led to it, should be logged so that analysts can later explain why access was granted or refused."
        ],
        "example": "An airport that checks passports at check-in, again at security, and again at the gate.",
        "code": "def decide(device_ok, mfa_age_min, country_ok, risk):\n    if not device_ok or not country_ok or risk >= 80:\n        return \"DENY\"\n    if mfa_age_min > 60 or risk >= 50:\n        return \"STEP_UP\"\n    return \"ALLOW\"\n\nfor args in [(True, 10, True, 20), (True, 90, True, 20), (False, 5, True, 10), (True, 90, True, 85)]:\n    print(args, \"->\", decide(*args))",
        "output": "(True, 10, True, 20) -> ALLOW\n(True, 90, True, 20) -> STEP_UP\n(False, 5, True, 10) -> DENY\n(True, 90, True, 85) -> DENY",
        "codeNotes": [
          {
            "line": 2,
            "note": "Deny conditions are checked first."
          },
          {
            "line": 4,
            "note": "Then step-up conditions."
          }
        ],
        "tryIt": "What should happen to an open session if the user's device stops being compliant?",
        "check": {
          "question": "What does STEP_UP mean in a zero trust decision?",
          "options": [
            "Grant admin rights",
            "Ask the user to verify again, for example with MFA",
            "Block the device forever"
          ],
          "answer": 1,
          "why": "Extra verification before access."
        }
      },
      {
        "title": "Micro-segmentation",
        "say": [
          "Zero trust also applies between services: each service may talk only to the specific services it needs.",
          "Micro-segmentation enforces this with fine-grained rules, often per service and port, rather than broad network zones (Day 13).",
          "Service identities (for example certificates issued to each service, as in mutual TLS with SPIFFE) replace IP addresses as the basis for trust.",
          "Practice 2 is segment_violations(flows, policy), which lists observed service-to-service flows that the policy does not allow.",
          "Observing flows first, then writing the policy, then enforcing it, avoids breaking legitimate traffic.",
          "The example compares observed flows with an allowed set.",
          "If one service is compromised, micro-segmentation limits what the attacker can reach next.",
          "Service meshes such as Istio and Linkerd provide mutual TLS and per-service policies in Kubernetes.",
          "Unexpected flows are also a valuable detection signal, even before enforcement.",
          "Start enforcement in a monitor-only mode, review the violations for a week or two, and only then switch to blocking."
        ],
        "example": "Internal doors with their own keys inside a building, so a visitor to one department cannot wander into others.",
        "code": "policy = {(\"web\", \"api\", 443), (\"api\", \"db\", 5432), (\"api\", \"cache\", 6379)}\nobserved = [(\"web\", \"api\", 443), (\"api\", \"db\", 5432), (\"web\", \"db\", 5432), (\"api\", \"db\", 22)]\nviolations = sorted({f for f in observed if f not in policy})\nprint(\"violations:\", violations)",
        "output": "violations: [('api', 'db', 22), ('web', 'db', 5432)]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Distinct flows not covered by the policy."
          }
        ],
        "tryIt": "Which violation looks most like an attacker moving around, and why?",
        "check": {
          "question": "What does micro-segmentation limit?",
          "options": [
            "Download speed",
            "Which services can talk to which, containing a compromise",
            "The number of users"
          ],
          "answer": 1,
          "why": "Fine-grained allowed paths."
        }
      },
      {
        "title": "Identity as the new perimeter",
        "say": [
          "In zero trust, strong identity becomes the main control: single sign-on, phishing-resistant MFA and short-lived tokens.",
          "Every access decision is logged, giving rich data for detection.",
          "Least privilege and just-in-time access (Day 11) keep powerful permissions rare and temporary.",
          "Privileged access management tools broker admin sessions, record them and require approval.",
          "Identity providers become critical infrastructure and must themselves be protected carefully.",
          "The example shows access being granted just in time and expiring automatically.",
          "When identity is strong, where someone connects from matters much less.",
          "Attackers know this too, which is why identity systems are prime targets for phishing and token theft.",
          "Monitoring identity events, such as new MFA devices or unusual consent grants, is a key zero trust detection."
        ],
        "example": "A building where your personal ID badge, not the door you came in through, decides where you may go.",
        "code": "grants = [{\"user\": \"asha\", \"role\": \"db-admin\", \"start\": 100, \"minutes\": 30}]\ndef has_access(user, role, now):\n    return any(g[\"user\"] == user and g[\"role\"] == role and g[\"start\"] <= now < g[\"start\"] + g[\"minutes\"] * 60\n               for g in grants)\n\nfor now in [50, 200, 1800, 1901]:\n    print(f\"t={now:5} asha db-admin: {has_access('asha', 'db-admin', now)}\")",
        "output": "t=   50 asha db-admin: False\nt=  200 asha db-admin: True\nt= 1800 asha db-admin: True\nt= 1901 asha db-admin: False",
        "codeNotes": [
          {
            "line": 3,
            "note": "Access only inside the approved window."
          }
        ],
        "tryIt": "Why is temporary admin access safer than permanent admin access?",
        "check": {
          "question": "What becomes the main control in zero trust?",
          "options": [
            "The office firewall",
            "Strong identity and verified devices",
            "Physical locks"
          ],
          "answer": 1,
          "why": "Identity replaces location."
        }
      },
      {
        "title": "Adopting zero trust",
        "say": [
          "Start by inventorying users, devices, applications and data flows, because you cannot protect what you cannot see.",
          "Pick a high-value application and put it behind an identity-aware proxy with MFA and device checks.",
          "Measure and expand: add more applications, then service-to-service policies, then continuous risk evaluation.",
          "Expect cultural change: users need clear messages about why access was refused and how to fix it.",
          "CISA's Zero Trust Maturity Model describes stages from traditional to optimal across identity, devices, networks, applications and data.",
          "The example tracks maturity across the five pillars.",
          "Zero trust is a journey measured in years, with security improving at every step.",
          "Quick wins, such as MFA everywhere and removing broad VPN access, deliver value early.",
          "Legacy systems that cannot support modern identity may need to be isolated behind gateways.",
          "Report progress in business terms, such as how many critical applications now require MFA and a healthy device, so leaders can see the value."
        ],
        "example": "Renovating a house one room at a time while still living in it.",
        "code": "pillars = {\"identity\": 3, \"devices\": 2, \"networks\": 1, \"applications\": 2, \"data\": 1}\nlevels = {1: \"traditional\", 2: \"initial\", 3: \"advanced\", 4: \"optimal\"}\nfor pillar, level in pillars.items():\n    print(f\"{pillar:12} {'#' * level:4} {levels[level]}\")\nprint(\"focus next:\", sorted(p for p, l in pillars.items() if l == min(pillars.values())))",
        "output": "identity     ###  advanced\ndevices      ##   initial\nnetworks     #    traditional\napplications ##   initial\ndata         #    traditional\nfocus next: ['data', 'networks']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Work on the weakest pillars next."
          }
        ],
        "tryIt": "Which pillar would you improve first in a hospital, and why?",
        "check": {
          "question": "What should be the first step in adopting zero trust?",
          "options": [
            "Buy a firewall",
            "Inventory users, devices, applications and data flows",
            "Remove all passwords"
          ],
          "answer": 1,
          "why": "Visibility comes first."
        }
      },
      {
        "title": "Practice time: decisions and segments",
        "say": [
          "Practice 1: zt_decide(req). Return DENY if the device is not compliant, the country is not in allowed_countries, or risk is at least 80; STEP_UP if MFA is older than 60 minutes or risk is at least 50; otherwise ALLOW.",
          "The checks include a healthy request, stale MFA, elevated risk, an unmanaged device, a disallowed country with stale MFA (deny wins) and risk exactly 80.",
          "Practice 2: segment_violations(flows, policy). Return the sorted distinct flows not in the policy.",
          "The checks include duplicates, a wrong port on an allowed pair, and no traffic.",
          "After passing, write a zero trust policy for three applications you use at work or college, and list the signals each should check.",
          "The example evaluates a day of access requests and summarises the decisions.",
          "Tomorrow applies these ideas in the cloud: identity policies, storage buckets and keys.",
          "Zero trust turns implicit trust into explicit, logged, revocable decisions.",
          "Every decision function in this course has put deny rules first; that pattern is worth remembering.",
          "When in doubt, a zero trust system should fail closed: if the policy engine cannot be reached, access is refused rather than silently allowed."
        ],
        "example": "A smart building that checks badge, device and schedule at every door, and keeps a record of each decision.",
        "code": "from collections import Counter\n\nreqs = [(True, 5, True, 10), (True, 120, True, 30), (False, 5, True, 5), (True, 10, False, 20), (True, 20, True, 60)]\ndef decide(dev, mfa, country, risk):\n    if not dev or not country or risk >= 80:\n        return \"DENY\"\n    return \"STEP_UP\" if mfa > 60 or risk >= 50 else \"ALLOW\"\nprint(dict(sorted(Counter(decide(*r) for r in reqs).items())))",
        "output": "{'ALLOW': 1, 'DENY': 2, 'STEP_UP': 2}",
        "codeNotes": [
          {
            "line": 8,
            "note": "Summarise the day's decisions."
          }
        ],
        "tryIt": "Which request was denied for location, and which for the device?",
        "check": {
          "question": "zt_decide with a disallowed country and stale MFA returns?",
          "options": [
            "STEP_UP",
            "DENY",
            "ALLOW"
          ],
          "answer": 1,
          "why": "Deny rules are checked first."
        }
      }
    ],
    "summary": [
      "Zero trust verifies every request; network location grants no trust.",
      "Decisions combine identity, device health, MFA age, location and risk: deny, step-up or allow.",
      "Micro-segmentation limits which services can talk to which.",
      "Strong identity, least privilege and just-in-time access become the main controls.",
      "Adopt gradually: inventory, protect a key application, measure and expand."
    ],
    "projectStep": {
      "title": "Zero trust plan",
      "steps": [
        "Implement zt_decide and segment_violations.",
        "Map the flows between services in a small system and write the policy.",
        "Assess maturity across the five pillars and choose next steps."
      ]
    }
  },
  {
    "day": 28,
    "title": "Cloud Security: AWS IAM Least Privilege, S3 Bucket Policies & KMS",
    "goal": "You can explain the shared responsibility model, find over-permissive IAM policy statements, decide whether a storage bucket is public, and apply least privilege, encryption and logging in the cloud.",
    "minutes": 30,
    "recap": "Yesterday's zero trust principles apply directly in the cloud, where identity policies decide almost everything. Today you audit cloud permissions and storage like a cloud security engineer.",
    "parts": [
      {
        "title": "Shared responsibility",
        "say": [
          "Cloud providers secure the underlying infrastructure: data centres, hardware and the core services. Customers secure what they build and configure on top.",
          "This is the shared responsibility model: the provider is responsible for security \"of\" the cloud; the customer for security \"in\" the cloud.",
          "Most cloud breaches come from customer misconfiguration: public storage buckets, over-permissive identities, exposed keys and open network ports.",
          "The division shifts by service type: with managed services (SaaS), the provider does more; with virtual machines (IaaS), the customer does more.",
          "Understanding the line prevents gaps where each side assumes the other is responsible.",
          "The example lists responsibilities for a virtual machine service.",
          "Cloud security is mostly configuration security, which makes automated checks especially effective.",
          "Infrastructure as code (Terraform, CloudFormation) lets teams review and scan configurations before they go live.",
          "Cloud security posture management (CSPM) tools continuously check accounts against best practices.",
          "Read the provider documentation for each service you use, because the exact split of responsibility differs between services."
        ],
        "example": "Renting a flat: the landlord maintains the building and the locks on the main door; you decide who gets a copy of your key.",
        "code": "responsibilities = {\"physical data centre\": \"provider\", \"hypervisor and hardware\": \"provider\",\n                    \"operating system patches\": \"customer\", \"firewall rules\": \"customer\",\n                    \"IAM users and roles\": \"customer\", \"data encryption settings\": \"customer\"}\nfor item, owner in responsibilities.items():\n    print(f\"{item:26} -> {owner}\")",
        "output": "physical data centre       -> provider\nhypervisor and hardware    -> provider\noperating system patches   -> customer\nfirewall rules             -> customer\nIAM users and roles        -> customer\ndata encryption settings   -> customer",
        "codeNotes": [
          {
            "line": 1,
            "note": "Typical split for virtual machines."
          }
        ],
        "tryIt": "How would this list change for a fully managed database service?",
        "check": {
          "question": "What causes most cloud breaches?",
          "options": [
            "Provider hardware failures",
            "Customer misconfiguration",
            "Solar flares"
          ],
          "answer": 1,
          "why": "Misconfiguration is the main cause."
        }
      },
      {
        "title": "IAM policies",
        "say": [
          "Cloud identity and access management (IAM) policies are JSON documents listing statements with an Effect (Allow or Deny), Actions and Resources.",
          "For example: allow s3:GetObject on arn:aws:s3:::reports/* lets a role read objects in one bucket.",
          "Wildcards are dangerous: Action \"*\" allows everything, Resource \"*\" applies to every resource, and \"s3:*\" allows every storage action.",
          "Practice 1 is iam_findings(policy), which reports WILDCARD_ACTION and WILDCARD_RESOURCE for Allow statements.",
          "Actions and resources can be strings or lists, so normalise them to lists first.",
          "Explicit Deny statements always win in AWS evaluation, which makes them useful guardrails.",
          "The example reads a policy and lists what each statement allows.",
          "Tools such as IAM Access Analyzer and open-source scanners find over-permissive policies automatically.",
          "Policies generated from actual usage logs help tighten permissions to what is really needed."
        ],
        "example": "A key cabinet where each key is labelled with exactly which doors it opens; a master key labelled \"*\" opens everything.",
        "code": "policy = {\"Statement\": [\n    {\"Sid\": \"ReadReports\", \"Effect\": \"Allow\", \"Action\": \"s3:GetObject\", \"Resource\": \"arn:aws:s3:::reports/*\"},\n    {\"Sid\": \"Everything\", \"Effect\": \"Allow\", \"Action\": \"*\", \"Resource\": \"*\"}]}\nfor st in policy[\"Statement\"]:\n    actions = st[\"Action\"] if isinstance(st[\"Action\"], list) else [st[\"Action\"]]\n    risky = \"*\" in actions or st[\"Resource\"] == \"*\"\n    print(f\"{st['Sid']:12} {st['Effect']:5} {actions} on {st['Resource']} {'<- too broad' if risky else ''}\".rstrip())",
        "output": "ReadReports  Allow ['s3:GetObject'] on arn:aws:s3:::reports/*\nEverything   Allow ['*'] on * <- too broad",
        "codeNotes": [
          {
            "line": 5,
            "note": "Normalise single strings to lists."
          }
        ],
        "tryIt": "What would you replace the Everything statement with for an application that only reads reports?",
        "check": {
          "question": "Why is Action \"*\" dangerous?",
          "options": [
            "It is slow",
            "It allows every action, far beyond what any application needs",
            "It is invalid JSON"
          ],
          "answer": 1,
          "why": "Wildcards grant everything."
        }
      },
      {
        "title": "Public storage buckets",
        "say": [
          "Object storage buckets (S3, Google Cloud Storage, Azure Blob) have leaked billions of records when accidentally made public.",
          "A bucket can become public through its access control list (ACL public-read) or a bucket policy that allows Principal \"*\" to read objects.",
          "AWS S3 Block Public Access, enabled at the account or bucket level, overrides both and is on by default for new buckets.",
          "Practice 2 is bucket_public(bucket), which returns the reasons a bucket is public, or none if Block Public Access is on.",
          "Some buckets are meant to be public, such as website assets; they should hold nothing sensitive and be clearly labelled.",
          "The example checks three buckets.",
          "Regular automated checks for public buckets are one of the highest-value cloud controls.",
          "Signed URLs grant temporary access to specific objects without making a bucket public.",
          "Data classification helps: buckets holding personal or financial data should never be public under any circumstances.",
          "Access logging on sensitive buckets records every read, which is vital when working out whether exposed data was actually downloaded."
        ],
        "example": "A storage unit with a glass front: fine for a shop display, disastrous for your filing cabinets.",
        "code": "buckets = [{\"name\": \"website-assets\", \"block\": False, \"acl\": \"public-read\"},\n           {\"name\": \"customer-exports\", \"block\": False, \"acl\": \"public-read\"},\n           {\"name\": \"backups\", \"block\": True, \"acl\": \"public-read\"}]\nfor b in buckets:\n    public = not b[\"block\"] and b[\"acl\"] in (\"public-read\", \"public-read-write\")\n    print(f\"{b['name']:17} public={public}\")",
        "output": "website-assets    public=True\ncustomer-exports  public=True\nbackups           public=False",
        "codeNotes": [
          {
            "line": 5,
            "note": "Block Public Access overrides the ACL."
          }
        ],
        "tryIt": "website-assets and customer-exports are both public. Which is a problem, and why?",
        "check": {
          "question": "What does S3 Block Public Access do?",
          "options": [
            "Encrypts data",
            "Overrides ACLs and policies that would make data public",
            "Deletes old files"
          ],
          "answer": 1,
          "why": "It is a safety net against public exposure."
        }
      },
      {
        "title": "Keys and encryption",
        "say": [
          "Cloud key management services (AWS KMS, Google Cloud KMS, Azure Key Vault) create and protect encryption keys in hardware security modules.",
          "Encryption at rest protects storage, databases and backups; encryption in transit (TLS, Day 8) protects network traffic.",
          "Envelope encryption encrypts data with a data key, and encrypts the data key with a master key held in KMS.",
          "Key policies control who can use each key; separating who manages keys from who uses them limits insider risk.",
          "Automatic key rotation and logging of every key use support audits and investigations.",
          "The example shows the idea of envelope encryption with toy steps (no real cryptography).",
          "Encryption is only as strong as the control over its keys.",
          "Deleting a key can make data permanently unreadable, which is why key deletion has waiting periods.",
          "Customer-managed keys give organisations more control, at the cost of more responsibility."
        ],
        "example": "Locking documents in a box, then locking the box key inside a bank vault that logs every visit.",
        "code": "steps = [\"generate a data key (KMS returns plaintext + encrypted copy)\",\n         \"encrypt the file with the plaintext data key\",\n         \"discard the plaintext data key from memory\",\n         \"store the encrypted file with the encrypted data key\",\n         \"to decrypt: ask KMS to decrypt the data key (logged), then decrypt the file\"]\nfor i, s in enumerate(steps, 1):\n    print(f\"{i}. {s}\")",
        "output": "1. generate a data key (KMS returns plaintext + encrypted copy)\n2. encrypt the file with the plaintext data key\n3. discard the plaintext data key from memory\n4. store the encrypted file with the encrypted data key\n5. to decrypt: ask KMS to decrypt the data key (logged), then decrypt the file",
        "codeNotes": [
          {
            "line": 3,
            "note": "Plaintext keys never stay on disk."
          }
        ],
        "tryIt": "Why does every decryption request going through KMS help an investigation?",
        "check": {
          "question": "What is envelope encryption?",
          "options": [
            "Encrypting emails",
            "Encrypting data with a data key, and that key with a master key in KMS",
            "A type of hash"
          ],
          "answer": 1,
          "why": "Keys protect keys."
        }
      },
      {
        "title": "Logging and guardrails",
        "say": [
          "Cloud audit logs (AWS CloudTrail, Google Cloud Audit Logs, Azure Activity Log) record every API call: who did what, when and from where.",
          "Enable them for all regions and accounts, store them in a separate, locked-down account, and alert on sensitive events.",
          "Sensitive events include disabling logging, creating access keys for the root account, making buckets public and changing IAM policies.",
          "Organisation-wide guardrails (AWS Service Control Policies, Azure Policy) prevent risky actions in every account, whatever local administrators do.",
          "Infrastructure as code scanning catches misconfigurations before deployment.",
          "The example flags sensitive events in an audit log.",
          "Guardrails and logging together make mistakes both harder to make and easier to spot.",
          "Protect the root or global admin account with hardware MFA and never use it for daily work.",
          "Budgets and billing alerts detect abuse such as crypto-mining with stolen keys."
        ],
        "example": "CCTV in every corridor and doors that physically cannot be propped open.",
        "code": "SENSITIVE = {\"StopLogging\", \"PutBucketAcl\", \"CreateAccessKey\", \"AttachUserPolicy\"}\nevents = [(\"09:01\", \"ravi\", \"GetObject\"), (\"09:05\", \"unknown-key\", \"StopLogging\"),\n          (\"09:06\", \"unknown-key\", \"PutBucketAcl\"), (\"09:10\", \"meena\", \"ListBuckets\")]\nfor t, who, action in events:\n    if action in SENSITIVE:\n        print(f\"ALERT {t} {who} performed {action}\")",
        "output": "ALERT 09:05 unknown-key performed StopLogging\nALERT 09:06 unknown-key performed PutBucketAcl",
        "codeNotes": [
          {
            "line": 5,
            "note": "Only sensitive actions raise alerts."
          }
        ],
        "tryIt": "Why is StopLogging followed by PutBucketAcl from the same key especially alarming?",
        "check": {
          "question": "Where should cloud audit logs be stored?",
          "options": [
            "In the same account they record",
            "In a separate, locked-down account",
            "Nowhere"
          ],
          "answer": 1,
          "why": "Attackers try to delete logs."
        }
      },
      {
        "title": "Practice time: IAM and buckets",
        "say": [
          "Practice 1: iam_findings(policy). For each Allow statement, normalise Action and Resource to lists; report (Sid, \"WILDCARD_ACTION\") if any action is \"*\" or ends with \":*\", and (Sid, \"WILDCARD_RESOURCE\") if any resource is \"*\".",
          "The checks include a narrow statement, a full wildcard, a service wildcard in a list, a Deny statement (ignored) and an empty policy.",
          "Practice 2: bucket_public(bucket). Return [] if Block Public Access is on; otherwise add PUBLIC_ACL for public ACLs and PUBLIC_POLICY for an Allow statement with Principal \"*\" and s3:GetObject or s3:*; return the sorted reasons.",
          "The checks include both reasons, the Block Public Access override and a policy for a specific role.",
          "After passing, write the least-privilege policy for an application that reads one bucket and writes to one queue.",
          "The example audits a small account.",
          "Tomorrow covers what to do when something goes wrong: incident response and evidence handling.",
          "Most cloud incidents are preventable with exactly these kinds of automated checks.",
          "Scanning configurations continuously catches drift when someone changes a setting by hand."
        ],
        "example": "A building manager's weekly walk-through: checking which keys exist and which windows are open.",
        "code": "policy = [(\"AppRead\", \"Allow\", [\"s3:GetObject\"], [\"arn:aws:s3:::app-data/*\"]), (\"Ops\", \"Allow\", [\"ec2:*\"], [\"*\"])]\nbucket = {\"block\": False, \"acl\": \"private\", \"principal_star_read\": True}\nfor sid, effect, actions, resources in policy:\n    issues = ([\"WILDCARD_ACTION\"] if any(a == \"*\" or a.endswith(\":*\") for a in actions) else []) + \\\n             ([\"WILDCARD_RESOURCE\"] if \"*\" in resources else [])\n    print(sid, issues or \"ok\")\nprint(\"bucket public:\", (not bucket[\"block\"]) and (bucket[\"acl\"] != \"private\" or bucket[\"principal_star_read\"]))",
        "output": "AppRead ok\nOps ['WILDCARD_ACTION', 'WILDCARD_RESOURCE']\nbucket public: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "Service-level wildcards count too."
          }
        ],
        "tryIt": "The bucket ACL is private, yet the bucket is public. Why?",
        "check": {
          "question": "bucket_public with block_public_access True returns?",
          "options": [
            "[\"PUBLIC_ACL\"]",
            "[]",
            "An error"
          ],
          "answer": 1,
          "why": "Block Public Access overrides everything."
        }
      }
    ],
    "summary": [
      "Providers secure the cloud; customers secure their configuration and data.",
      "Find wildcard actions and resources in Allow statements and replace them with least privilege.",
      "Buckets become public through ACLs or policies; Block Public Access overrides both.",
      "Use KMS, envelope encryption and key policies; log every key use.",
      "Centralise audit logs, alert on sensitive events and use organisation guardrails."
    ],
    "projectStep": {
      "title": "Cloud account audit",
      "steps": [
        "Implement iam_findings and bucket_public.",
        "Audit a sample set of policies and buckets.",
        "Write least-privilege replacements and a list of guardrails."
      ]
    }
  },
  {
    "day": 29,
    "title": "Incident Response: Forensic Chain of Custody & Containment Strategy",
    "goal": "You can describe the incident response lifecycle, choose containment strategies, preserve evidence with a tamper-evident hash chain, detect tampering in custody logs, and run a blameless post-incident review.",
    "minutes": 30,
    "recap": "Every lesson so far aimed to prevent or detect attacks. Sooner or later something gets through. Today is about responding well: calmly, quickly and with evidence that stands up.",
    "parts": [
      {
        "title": "The incident response lifecycle",
        "say": [
          "NIST SP 800-61 describes four phases: preparation; detection and analysis; containment, eradication and recovery; and post-incident activity.",
          "Preparation means having a plan, contacts, tools, logging and practised runbooks before anything happens.",
          "Detection and analysis confirms whether an alert is a real incident, and how serious it is.",
          "Containment stops the damage spreading; eradication removes the attacker's access and tools; recovery restores normal service safely.",
          "Post-incident activity captures lessons and improves defences.",
          "The example prints the phases with a typical first action for each.",
          "In India, CERT-In rules require many organisations to report certain incidents within six hours, so preparation includes knowing reporting duties.",
          "Clear roles, an incident lead, communications, technical responders and legal, avoid confusion under pressure.",
          "Tabletop exercises, walking through a scenario around a table, test the plan without real damage.",
          "Keep the plan and contact list somewhere reachable even if the main systems are down, such as printed copies or a separate secure service."
        ],
        "example": "A fire brigade: training and equipment before the fire, rapid assessment on arrival, containing and putting it out, then investigating the cause.",
        "code": "phases = [(\"preparation\", \"incident plan, contacts, logging, practised runbooks\"),\n          (\"detection and analysis\", \"confirm the alert and assess severity\"),\n          (\"containment, eradication, recovery\", \"isolate, remove access, restore safely\"),\n          (\"post-incident\", \"blameless review and improvements\")]\nfor phase, action in phases:\n    print(f\"{phase:36} {action}\")",
        "output": "preparation                          incident plan, contacts, logging, practised runbooks\ndetection and analysis               confirm the alert and assess severity\ncontainment, eradication, recovery   isolate, remove access, restore safely\npost-incident                        blameless review and improvements",
        "codeNotes": [
          {
            "line": 1,
            "note": "Preparation happens before any incident."
          }
        ],
        "tryIt": "Which phase is most often skipped, and what is the cost?",
        "check": {
          "question": "What is the first phase of incident response?",
          "options": [
            "Recovery",
            "Preparation",
            "Eradication"
          ],
          "answer": 1,
          "why": "Preparation happens before incidents."
        }
      },
      {
        "title": "Containment choices",
        "say": [
          "Containment options include isolating a machine from the network, disabling accounts, revoking tokens and keys, and blocking IPs or domains.",
          "Short-term containment stops the bleeding; long-term containment keeps systems running safely while a full fix is prepared.",
          "Containing too early can alert the attacker and destroy evidence; too late lets damage spread. Decide based on risk.",
          "Isolating a machine (keeping it powered on) preserves memory evidence, which switching it off would destroy.",
          "For ransomware, speed matters most: isolate affected machines quickly to stop encryption spreading.",
          "The example chooses containment actions for different incident types.",
          "Every containment action should be recorded with the time and the person who did it.",
          "Rotating credentials the attacker may have seen is part of containment, not an afterthought (Day 18).",
          "Communicating with affected users and regulators is planned alongside technical steps.",
          "Before eradication, make sure you understand how the attacker got in, or they may simply return the same way after you clean up."
        ],
        "example": "Closing fire doors to stop smoke spreading, without destroying the evidence of where the fire started.",
        "code": "playbook = {\"ransomware on a laptop\": [\"isolate from network\", \"keep powered on\", \"check backups\"],\n            \"stolen API key\": [\"revoke the key\", \"issue a new key\", \"review key usage logs\"],\n            \"phished account\": [\"reset password\", \"revoke sessions and tokens\", \"review mailbox rules\"]}\nfor incident, steps in playbook.items():\n    print(f\"{incident:24} -> {steps}\")",
        "output": "ransomware on a laptop   -> ['isolate from network', 'keep powered on', 'check backups']\nstolen API key           -> ['revoke the key', 'issue a new key', 'review key usage logs']\nphished account          -> ['reset password', 'revoke sessions and tokens', 'review mailbox rules']",
        "codeNotes": [
          {
            "line": 1,
            "note": "Keeping the machine on preserves memory evidence."
          }
        ],
        "tryIt": "Why check mailbox forwarding rules after a phished account?",
        "check": {
          "question": "Why isolate a compromised machine instead of switching it off?",
          "options": [
            "It is faster",
            "Memory evidence is preserved while the network threat is stopped",
            "Switching off is illegal"
          ],
          "answer": 1,
          "why": "Isolation contains without destroying evidence."
        }
      },
      {
        "title": "Evidence and chain of custody",
        "say": [
          "Digital evidence must be collected so that it can be trusted later, internally, by insurers or in court.",
          "Chain of custody records who collected each item, when, how, where it was stored and every time it changed hands.",
          "Evidence is copied (imaged) and hashed; analysis happens on copies, and the hash proves the original has not changed.",
          "A hash chain makes a custody log tamper-evident: each entry's hash includes the previous hash, so changing any entry breaks every later hash.",
          "Practice 1 is chain_hashes(entries), which computes such a chain with SHA-256, starting from 64 zeros.",
          "The example builds a short chain and prints the first characters of each hash.",
          "The same idea underlies blockchains and certificate transparency logs.",
          "Storing the latest hash somewhere separate, such as in a sealed report, makes the chain even harder to rewrite.",
          "Time stamps should use a reliable, synchronised clock and include the time zone.",
          "Use write-blockers or read-only copies when imaging disks, so the act of collecting evidence never changes it."
        ],
        "example": "A sealed evidence bag with a log sheet signed by everyone who handles it.",
        "code": "import hashlib\n\nentries = [\"09:00 laptop seized by Officer Rao\", \"09:30 disk imaged, image hash recorded\", \"10:15 image copied to lab\"]\nprev = \"0\" * 64\nfor e in entries:\n    prev = hashlib.sha256((prev + e).encode()).hexdigest()\n    print(f\"{prev[:16]}...  {e}\")",
        "output": "3bf05236773d3613...  09:00 laptop seized by Officer Rao\n07b82bfbd48b4d87...  09:30 disk imaged, image hash recorded\nfc58add440f5ed1a...  10:15 image copied to lab",
        "codeNotes": [
          {
            "line": 6,
            "note": "Each hash covers the previous hash and the new entry."
          }
        ],
        "tryIt": "What happens to the second and third hashes if someone edits the first entry?",
        "check": {
          "question": "Why does a hash chain make a log tamper-evident?",
          "options": [
            "It encrypts the log",
            "Changing any entry changes all later hashes",
            "It deletes old entries"
          ],
          "answer": 1,
          "why": "Every hash depends on everything before it."
        }
      },
      {
        "title": "Detecting tampering",
        "say": [
          "To verify a custody log, recompute the chain from the entries and compare with the stored hashes.",
          "The first index where they differ is where tampering (or corruption) happened.",
          "Practice 2 is first_tampered(entries, hashes), which returns that index, or detects deleted entries at the end, or returns None if the log is intact.",
          "Deleting the last entry is detected by comparing lengths; this is why the final hash should also be stored separately.",
          "Verification should be routine, not only when something looks suspicious.",
          "The example edits one entry and finds it.",
          "Tamper-evidence does not prevent changes, but it guarantees they are noticed.",
          "Write-once storage, such as object lock, adds prevention on top of evidence.",
          "The same verification protects audit logs, which attackers often try to edit to hide their activity.",
          "Record who ran each verification and when, so the verification itself becomes part of the custody record."
        ],
        "example": "Checking each signature on the evidence log sheet against the one before it.",
        "code": "import hashlib\n\ndef chain(es):\n    prev, out = \"0\" * 64, []\n    for e in es:\n        prev = hashlib.sha256((prev + e).encode()).hexdigest()\n        out.append(prev)\n    return out\n\nentries = [\"seized\", \"imaged\", \"copied\", \"analysed\"]\nstored = chain(entries)\nedited = [\"seized\", \"imaged (edited later)\", \"copied\", \"analysed\"]\nrecomputed = chain(edited)\nprint(\"first mismatch at index:\", next(i for i, (a, b) in enumerate(zip(recomputed, stored)) if a != b))",
        "output": "first mismatch at index: 1",
        "codeNotes": [
          {
            "line": 13,
            "note": "Recompute from the entries as they are now."
          },
          {
            "line": 14,
            "note": "The first difference locates the tampering."
          }
        ],
        "tryIt": "Why do all hashes after the edited entry also differ?",
        "check": {
          "question": "How is a deleted final entry detected?",
          "options": [
            "It cannot be",
            "The number of entries no longer matches the stored hashes",
            "By the file size"
          ],
          "answer": 1,
          "why": "Lengths differ, and the stored final hash no longer matches."
        }
      },
      {
        "title": "Recovery and the blameless review",
        "say": [
          "Recovery restores systems from known-good sources, such as clean images and tested backups, and monitors closely for the attacker's return.",
          "Backups must be protected from the attacker: offline or immutable copies survive ransomware.",
          "A post-incident review asks what happened, why, how it was detected, what went well and what should change.",
          "Blameless reviews focus on systems and processes, not individuals, so people report problems honestly and quickly.",
          "Each review should produce specific, owned, dated actions, such as adding MFA to a service or a detection rule for the technique used.",
          "The example formats review actions with owners and dates.",
          "Organisations that learn from incidents get stronger after each one.",
          "Sharing anonymised lessons with the wider community helps others avoid the same attack.",
          "Measuring time to detect, contain and recover shows whether improvements work.",
          "Follow up on review actions at a fixed date, because unfinished actions are how the same incident happens twice."
        ],
        "example": "An aviation accident investigation: the goal is to prevent the next crash, not to punish the pilot.",
        "code": "actions = [(\"enforce MFA on the VPN\", \"IT security\", \"2026-10-15\"),\n           (\"detection rule for mass file renames\", \"SOC\", \"2026-10-08\"),\n           (\"test restoring backups monthly\", \"infrastructure\", \"2026-10-31\")]\nfor what, owner, due in sorted(actions, key=lambda a: a[2]):\n    print(f\"{due}  {owner:15} {what}\")",
        "output": "2026-10-08  SOC             detection rule for mass file renames\n2026-10-15  IT security     enforce MFA on the VPN\n2026-10-31  infrastructure  test restoring backups monthly",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sorted by due date."
          }
        ],
        "tryIt": "Why does each action need an owner and a date?",
        "check": {
          "question": "Why are post-incident reviews blameless?",
          "options": [
            "To protect managers",
            "So people report problems honestly and the focus stays on fixing systems",
            "Because nobody is ever at fault"
          ],
          "answer": 1,
          "why": "Honesty improves learning."
        }
      },
      {
        "title": "Practice time: custody chains",
        "say": [
          "Practice 1: chain_hashes(entries). Start with prev = \"0\" * 64; for each entry compute sha256((prev + entry).encode()).hexdigest(), append it and make it the new prev.",
          "The checks confirm one hash per entry, the genesis rule, that each hash covers the previous one, and an empty log.",
          "Practice 2: first_tampered(entries, hashes). Recompute the chain alongside the stored hashes; return the first mismatching index; if lengths differ, return the shorter length; otherwise None.",
          "The checks include an intact log, an edited entry and a deleted final entry.",
          "After passing, keep a custody log for a pretend incident exercise and verify it at the end.",
          "The example runs a small tabletop exercise with a custody chain.",
          "Tomorrow's capstone combines triage, prioritisation and a security scorecard.",
          "Trustworthy evidence is what turns an investigation's findings into facts others can rely on.",
          "Practising the response, not just reading about it, is what makes teams calm when it matters."
        ],
        "example": "A training exercise with real paperwork, so the team knows the routine before the real emergency.",
        "code": "import hashlib\n\nlog, hashes, prev = [], [], \"0\" * 64\nfor event in [\"alert: mass file renames on FIN-LAPTOP-7\", \"laptop isolated from network\",\n              \"memory captured, hash recorded\", \"backup restore started\"]:\n    prev = hashlib.sha256((prev + event).encode()).hexdigest()\n    log.append(event)\n    hashes.append(prev)\nprint(len(log), \"entries, final hash\", hashes[-1][:16] + \"...\")\nprint(\"store the final hash separately, for example in the signed incident report\")",
        "output": "4 entries, final hash be26858dc6f23d0c...\nstore the final hash separately, for example in the signed incident report",
        "codeNotes": [
          {
            "line": 6,
            "note": "Extend the chain as each action is logged."
          }
        ],
        "tryIt": "Why record the final hash somewhere outside the log itself?",
        "check": {
          "question": "first_tampered on an intact log returns?",
          "options": [
            "0",
            "None",
            "-1"
          ],
          "answer": 1,
          "why": "No mismatch means None."
        }
      }
    ],
    "summary": [
      "Incident response: prepare, detect and analyse, contain and recover, learn.",
      "Choose containment by risk; isolate rather than power off to keep evidence.",
      "Keep chain of custody; hash evidence and work on copies.",
      "Hash chains make logs tamper-evident; recompute to find the first change.",
      "Recover from clean sources and run blameless reviews with owned actions."
    ],
    "projectStep": {
      "title": "Incident exercise",
      "steps": [
        "Implement chain_hashes and first_tampered.",
        "Run a tabletop exercise for a phished account and keep a custody log.",
        "Write the blameless review with at least three owned actions."
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Defensive & Offensive Cybersecurity Operations Suite",
    "goal": "You can triage security alerts by severity and asset criticality, measure an organisation's security posture with a scorecard, and connect every lesson of the course into a coherent defensive programme.",
    "minutes": 30,
    "recap": "The final capstone steps back to the view of a security lead: many alerts, many controls, limited time. You will prioritise alerts and grade an organisation's defences, drawing on everything from Day 1 to Day 29.",
    "parts": [
      {
        "title": "Triage: what to look at first",
        "say": [
          "Security teams receive far more alerts than they can investigate immediately, so triage decides the order.",
          "A simple and effective priority multiplies the alert's severity by the criticality of the affected asset: a medium alert on the payments database outranks a high alert on a test machine.",
          "Ties are broken by severity, then by a stable identifier, so the queue is predictable.",
          "Practice 1 is triage(alerts, assets), which returns alert IDs in priority order, treating unknown assets as low criticality.",
          "An asset inventory with criticality ratings is therefore essential, linking back to Day 1's risk thinking.",
          "The example ranks a small alert queue.",
          "Good triage means the most dangerous alert is always looked at first, even on a busy day.",
          "Unknown assets should also trigger an inventory task, because unmanaged systems are a risk in themselves.",
          "Automation can handle low-priority alerts, leaving people for the complex ones.",
          "Review the triage rules regularly: if analysts keep manually promoting a type of alert, its severity or the asset rating is probably wrong."
        ],
        "example": "A hospital emergency department: the most serious patient in the most critical condition is seen first, not the one who arrived earliest.",
        "code": "assets = {\"payments-db\": 5, \"hr-laptop\": 2, \"dev-vm\": 1}\nalerts = [(\"A1\", 5, \"dev-vm\"), (\"A2\", 5, \"payments-db\"), (\"A3\", 3, \"payments-db\"), (\"A4\", 4, \"unknown-host\")]\nranked = sorted(alerts, key=lambda a: (-a[1] * assets.get(a[2], 1), -a[1], a[0]))\nfor aid, sev, asset in ranked:\n    print(f\"{aid} severity {sev} on {asset:12} priority {sev * assets.get(asset, 1)}\")",
        "output": "A2 severity 5 on payments-db  priority 25\nA3 severity 3 on payments-db  priority 15\nA1 severity 5 on dev-vm       priority 5\nA4 severity 4 on unknown-host priority 4",
        "codeNotes": [
          {
            "line": 3,
            "note": "Priority, then severity, then ID."
          }
        ],
        "tryIt": "Should the unknown host really be treated as low criticality? What would you do about it?",
        "check": {
          "question": "Why multiply severity by asset criticality?",
          "options": [
            "It is traditional",
            "The same alert matters more on a critical system",
            "To make numbers bigger"
          ],
          "answer": 1,
          "why": "Context changes urgency."
        }
      },
      {
        "title": "Measuring security posture",
        "say": [
          "Leaders need a simple view of how well protected the organisation is and where the gaps are.",
          "A scorecard lists key controls, such as MFA, patching, backups, logging, secret scanning, least privilege, WAF and an incident plan, and marks each as in place or missing.",
          "Practice 2 is scorecard(controls), which computes the percentage in place, a letter grade and the sorted list of gaps.",
          "Scorecards should be based on evidence (reports, configuration checks), not self-assessment alone.",
          "Frameworks such as the CIS Controls, ISO 27001 and the NIST Cybersecurity Framework provide structured control lists.",
          "The example grades an organisation and lists its gaps.",
          "Tracking the score over time shows progress and justifies investment.",
          "A single number hides detail, so always show the gaps alongside the score.",
          "Weighting controls by importance, for example MFA above a WAF, can make scorecards more meaningful.",
          "Be honest when scoring: a control that exists on paper but is not enforced everywhere should count as a gap until it is."
        ],
        "example": "A school report card: a grade for the whole year, with the subjects needing work listed underneath.",
        "code": "controls = {\"mfa\": True, \"patching\": True, \"backups\": True, \"waf\": False, \"logging\": True,\n            \"secret_scanning\": True, \"least_privilege\": False, \"incident_plan\": True}\nscore = round(sum(controls.values()) / len(controls) * 100, 1)\ngrade = \"A\" if score >= 90 else \"B\" if score >= 75 else \"C\" if score >= 50 else \"D\"\nprint(f\"score {score}% grade {grade}\")\nprint(\"gaps:\", sorted(k for k, v in controls.items() if not v))",
        "output": "score 75.0% grade B\ngaps: ['least_privilege', 'waf']",
        "codeNotes": [
          {
            "line": 3,
            "note": "True counts as 1."
          },
          {
            "line": 6,
            "note": "Gaps are the real action list."
          }
        ],
        "tryIt": "Which gap would you close first, and which lesson in this course covers it?",
        "check": {
          "question": "Why show the list of gaps alongside the score?",
          "options": [
            "To make the report longer",
            "A single number hides which controls actually need work",
            "Grades are unreliable"
          ],
          "answer": 1,
          "why": "Gaps drive action."
        }
      },
      {
        "title": "The course as a defensive programme",
        "say": [
          "Week 1 protected web inputs: threat modelling, SQL injection, XSS, CSRF and a WAF.",
          "Week 2 protected identity and data: cryptography, password hashing, certificates, tokens, MFA, access control and headers.",
          "Week 3 protected the server's behaviour and supply chain: SSRF, deserialisation, secrets, dependencies and rate limiting.",
          "Week 4 covered depth and response: memory safety, detection, IDS rules, vulnerability scoring, zero trust, cloud security and incident response.",
          "Each topic is a layer; together they form defence in depth, the idea introduced on Day 1.",
          "The example maps each control on the scorecard to the day that taught it.",
          "Real security programmes combine these layers with people, processes and continuous improvement.",
          "No organisation does everything perfectly; the goal is steady, measured progress on the most important risks.",
          "You now have both the concepts and working Python tools for each layer.",
          "When a single layer fails, as eventually one will, the others should still slow the attacker down and make detection likely."
        ],
        "example": "A castle built wall by wall, gate by gate, and guard by guard, each added deliberately.",
        "code": "taught = {\"mfa\": 10, \"patching\": 19, \"backups\": 29, \"waf\": 5, \"logging\": 24,\n          \"secret_scanning\": 18, \"least_privilege\": 11, \"incident_plan\": 29}\nfor control, day in sorted(taught.items(), key=lambda kv: kv[1]):\n    print(f\"Day {day:2}: {control}\")",
        "output": "Day  5: waf\nDay 10: mfa\nDay 11: least_privilege\nDay 18: secret_scanning\nDay 19: patching\nDay 24: logging\nDay 29: backups\nDay 29: incident_plan",
        "codeNotes": [
          {
            "line": 3,
            "note": "Ordered by the day each control was taught."
          }
        ],
        "tryIt": "Which week of the course would you revisit first for your own projects?",
        "check": {
          "question": "What ties the course's lessons together?",
          "options": [
            "A single tool",
            "Defence in depth: independent layers that cover each other",
            "One programming language"
          ],
          "answer": 1,
          "why": "Layers, from Day 1 to Day 30."
        }
      },
      {
        "title": "Careers in security",
        "say": [
          "Security offers many paths: application security engineer, security analyst in a security operations centre, penetration tester, cloud security engineer, incident responder, security architect and governance roles.",
          "Developers with security skills are especially valuable: they prevent vulnerabilities where they start.",
          "Well-known certifications include CompTIA Security+, CEH, OSCP for penetration testing, cloud provider security certifications and CISSP for experienced professionals.",
          "Practical experience counts most: capture-the-flag competitions, authorised labs, bug bounties within their rules, and open-source contributions.",
          "Ethics remain central (Day 1): permission, scope and responsible disclosure, always.",
          "The example matches course topics to roles.",
          "Security changes constantly, so curiosity and continuous learning are the most important skills.",
          "Communities such as OWASP chapters, local security meetups and conferences are good places to learn and find mentors.",
          "Writing up what you learn, for example as blog posts, builds both understanding and reputation."
        ],
        "example": "A hospital needs surgeons, nurses, radiologists and administrators; security needs builders, defenders, testers and planners.",
        "code": "roles = {\"application security engineer\": [\"SQLi\", \"XSS\", \"CSRF\", \"dependencies\"],\n         \"SOC analyst\": [\"SIEM\", \"IDS rules\", \"triage\"],\n         \"cloud security engineer\": [\"IAM\", \"buckets\", \"zero trust\"],\n         \"incident responder\": [\"containment\", \"custody chains\", \"reviews\"]}\nfor role, topics in roles.items():\n    print(f\"{role:30} {', '.join(topics)}\")",
        "output": "application security engineer  SQLi, XSS, CSRF, dependencies\nSOC analyst                    SIEM, IDS rules, triage\ncloud security engineer        IAM, buckets, zero trust\nincident responder             containment, custody chains, reviews",
        "codeNotes": [
          {
            "line": 1,
            "note": "Each role draws on different lessons."
          }
        ],
        "tryIt": "Which role matches the lessons you enjoyed most?",
        "check": {
          "question": "What matters most for a security career?",
          "options": [
            "Only certificates",
            "Practical, ethical experience and continuous learning",
            "Knowing one tool"
          ],
          "answer": 1,
          "why": "Skills, ethics and curiosity."
        }
      },
      {
        "title": "Keeping your defences current",
        "say": [
          "Threats change: new vulnerabilities, techniques and tools appear every week.",
          "Follow reliable sources: CERT-In and CISA advisories, vendor security bulletins, the OWASP projects and reputable security news.",
          "Re-run your tools regularly: dependency checks, secret scans, header audits and configuration reviews.",
          "Practise: run tabletop exercises, test backups and review access every quarter.",
          "Measure progress with your scorecard and triage metrics, and share results with the people who fund improvements.",
          "The example builds a simple recurring security calendar.",
          "Security is a habit, not a project with an end date.",
          "Small, regular improvements beat occasional large efforts.",
          "Celebrate improvements; morale matters in a field where most successes are invisible.",
          "Assign an owner to each recurring task, because tasks that belong to everyone tend to be done by no one."
        ],
        "example": "Brushing your teeth: a little every day prevents a lot of pain later.",
        "code": "calendar = {\"weekly\": [\"review high alerts\", \"dependency updates\"],\n            \"monthly\": [\"secret scan of all repos\", \"backup restore test\", \"header audit\"],\n            \"quarterly\": [\"access review\", \"tabletop exercise\", \"scorecard update\"]}\nfor cadence, tasks in calendar.items():\n    print(f\"{cadence:9} {tasks}\")",
        "output": "weekly    ['review high alerts', 'dependency updates']\nmonthly   ['secret scan of all repos', 'backup restore test', 'header audit']\nquarterly ['access review', 'tabletop exercise', 'scorecard update']",
        "codeNotes": [
          {
            "line": 1,
            "note": "Recurring tasks keep defences current."
          }
        ],
        "tryIt": "Which task would you add for a small startup with no dedicated security staff?",
        "check": {
          "question": "Why run security checks on a schedule?",
          "options": [
            "To fill calendars",
            "Threats and systems change, so defences must be rechecked",
            "Tools expire"
          ],
          "answer": 1,
          "why": "Continuous checking keeps up with change."
        }
      },
      {
        "title": "Capstone practice: triage and scorecard",
        "say": [
          "Practice 1: triage(alerts, assets). Sort alerts by (-severity × criticality, -severity, id), using criticality 1 for unknown assets, and return the IDs.",
          "The checks include critical and unknown assets and a tie broken by severity.",
          "Practice 2: scorecard(controls). Compute the percentage of controls in place (rounded to one decimal, 0.0 for none), the grade (A 90+, B 75+, C 50+, otherwise D) and the sorted gaps.",
          "The checks include a B grade with two gaps, a perfect score and an empty dictionary.",
          "Congratulations: you have completed Cybersecurity in Python, from threat modelling to incident response, with 60 working tools and 30 lessons of practice.",
          "Keep building: pick one system you care about, threat model it, run your tools against it, and close its biggest gap.",
          "The example produces a final one-page security summary.",
          "Thank you for learning to defend; the world needs more people who build safely and respond calmly.",
          "Your certificate reflects real, tested skills that employers value."
        ],
        "example": "Graduation day: every skill from the year shown in one final performance.",
        "code": "assets = {\"payments-db\": 5, \"website\": 4, \"dev-vm\": 1}\nalerts = [(\"A7\", 4, \"website\"), (\"A8\", 2, \"payments-db\"), (\"A9\", 5, \"dev-vm\")]\nqueue = [a[0] for a in sorted(alerts, key=lambda a: (-a[1] * assets.get(a[2], 1), -a[1], a[0]))]\ncontrols = {\"mfa\": True, \"patching\": False, \"backups\": True, \"logging\": True}\nscore = round(sum(controls.values()) / len(controls) * 100, 1)\nprint(\"investigate in order:\", queue)\nprint(f\"posture {score}% | gaps {sorted(k for k, v in controls.items() if not v)}\")",
        "output": "investigate in order: ['A7', 'A8', 'A9']\nposture 75.0% | gaps ['patching']",
        "codeNotes": [
          {
            "line": 3,
            "note": "Triage queue."
          },
          {
            "line": 5,
            "note": "Posture score."
          }
        ],
        "tryIt": "Which single improvement would raise this organisation's score the most, and which lesson covers it?",
        "check": {
          "question": "triage treats an alert on an unknown asset how?",
          "options": [
            "Ignores it",
            "Uses criticality 1",
            "Uses criticality 5"
          ],
          "answer": 1,
          "why": "Unknown assets default to low criticality, and should be inventoried."
        }
      }
    ],
    "summary": [
      "Triage by severity × asset criticality, with stable tie-breaking.",
      "Scorecards summarise posture; always show the gaps.",
      "The course forms a defence-in-depth programme across web, identity, server, depth and response.",
      "Security careers value practical, ethical experience and continuous learning.",
      "Keep defences current with recurring checks, exercises and measurement."
    ],
    "projectStep": {
      "title": "Final capstone: security programme",
      "steps": [
        "Implement triage and scorecard.",
        "Threat model a real system, run five tools from this course against it and score its posture.",
        "Write a one-page plan closing the three biggest gaps, with owners and dates."
      ]
    }
  }
];
