# scripts/generate_cyber_day41_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day41_data import DAY_41_DATA as day41_data

entries = []

captions = [
    [
        "Architectural overview illustrates injection boundaries between untrusted inputs and interpreter execution engines.",
        "Deep inspection evaluates taint detection rules intercepting string concatenation breakout syntax.",
        "Comparative analysis demonstrates complete separation of data literals from executable database commands.",
        "Verification confirms pattern detection, taint alert generation, and vulnerable query interception."
    ],
    [
        "Architectural overview displays prepared statement execution plans frozen in abstract syntax tree memory.",
        "Deep inspection evaluates safe parameter vector binding treating hostile strings strictly as literal data.",
        "Comparative analysis demonstrates total immunity against query logic manipulation compared to dynamic sql.",
        "Verification confirms abstract syntax tree immutability, parameter isolation, and safe query execution."
    ],
    [
        "Architectural overview illustrates document query sanitization pipelines stripping nosql injection operators.",
        "Deep inspection monitors recursive object traversal and immediate blocking of dollar prefixed parameters.",
        "Comparative analysis demonstrates total interception of unauthorized boolean operator bypass exploits.",
        "Verification confirms operator rejection, safe primitive query validation, and database security."
    ],
    [
        "Architectural overview displays shell-free subprocess invocation pipelines utilizing discrete argument vectors.",
        "Deep inspection evaluates input whitelisting regex rules blocking semicolons, pipes, and redirection operators.",
        "Comparative analysis demonstrates total immunity to shell metacharacter injection over string command execution.",
        "Verification confirms vectorized argument creation, direct binary execution, and shell bypass defense."
    ],
    [
        "Architectural overview presents end-to-end multi-layer injection defense gateway across enterprise applications.",
        "Deep inspection evaluates concurrent inspection of relational sql, document nosql, and host system commands.",
        "Comparative analysis demonstrates comprehensive enterprise application security certification over ad-hoc filters.",
        "Verification confirms full injection defense certification, zero security regressions, and robust runtime protection."
    ]
]

for idx, p in enumerate(day41_data["parts"]):
    code = p["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    
    # Check no digits in captions
    for c in captions[idx]:
        for ch in c:
            if ch.isdigit():
                raise ValueError(f"Digit found in caption: {c}")

    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "title": f"Injection Defense: {p['title']}",
            "left": {
                "label": "Vulnerable / Unhardened Application",
                "content": [
                    "Direct string concatenation into SQL queries allows complete logic breakout",
                    "Naive raw ORM queries without parameterization expose database tables",
                    "Direct JSON query body forwarding allows NoSQL operator injection bypass",
                    "Spawning system commands through shell strings permits metacharacter injection"
                ]
            },
            "right": {
                "label": "Enterprise Hardened Injection Defense",
                "content": [
                    "Pre-compiled prepared statements treat user input strictly as literal data",
                    "Abstract syntax tree freezing permanently prevents SQL query restructuring",
                    "Recursive object sanitization strips dollar-prefixed NoSQL query operators",
                    "Subprocess argument vectorization executes binaries without shell interpreters"
                ]
            },
            "steps": [
                {
                    "at": "intro",
                    "caption": captions[idx][0]
                },
                {
                    "at": "inspect",
                    "caption": captions[idx][1]
                },
                {
                    "at": "compare",
                    "caption": captions[idx][2]
                },
                {
                    "at": "verify",
                    "caption": captions[idx][3]
                }
            ]
        },
        "filled": {
            "leftLabel": "Vulnerable / Unhardened Application",
            "rightLabel": "Enterprise Hardened Injection Defense",
            "leftHighlights": [
                "Raw string concatenation",
                "Query logic breakout",
                "NoSQL operator injection",
                "Shell command injection"
            ],
            "rightHighlights": [
                "Prepared statement compilation",
                "AST structural immutability",
                "Recursive operator sanitization",
                "Shell-free argument vectors"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 41,
    "promptSha": hashlib.sha256(b"cyber-day-41-owasp-top-10-injection-sqli-nosql-command-parameterized").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-41.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
