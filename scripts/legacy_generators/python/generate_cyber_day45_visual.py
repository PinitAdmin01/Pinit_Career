# scripts/generate_cyber_day45_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day45_data import DAY_45_DATA as day45_data

entries = []

captions = [
    [
        "Architectural overview illustrates unified perimeter web application firewall and embedded runtime self-protection.",
        "Deep inspection evaluates multi-threat signature matching across uris, headers, and request bodies.",
        "Comparative analysis demonstrates edge traffic filtering combined with internal application memory introspection.",
        "Verification confirms threat signature detection, cumulative score calculation, and ingress request blocking."
    ],
    [
        "Architectural overview displays high-performance multi-rule signature scanning using compiled regular expressions.",
        "Deep inspection evaluates positive openapi schema validation paired with negative threat pattern blacklisting.",
        "Comparative analysis demonstrates microsecond threat scoring over vulnerable uninspected request pipelines.",
        "Verification confirms multi-rule execution, threat classification, and deterministic ingress filtering."
    ],
    [
        "Architectural overview illustrates runtime application self-protection hooks embedded inside system sinks.",
        "Deep inspection monitors database driver query abstract syntax trees for suspicious time-delay functions.",
        "Comparative analysis demonstrates internal exploit neutralization even when payloads evade external edge firewalls.",
        "Verification confirms query ast inspection, sleep function interception, and runtime memory defense."
    ],
    [
        "Architectural overview displays behavioral bot anomaly detection tracking request velocity per client address.",
        "Deep inspection evaluates client fingerprinting signatures and dynamic threat intelligence telemetry feeds.",
        "Comparative analysis demonstrates automated mitigation against distributed residential proxy scraping campaigns.",
        "Verification confirms request burst tracking, anomaly threshold enforcement, and automated bot containment."
    ],
    [
        "Architectural overview presents the grand milestone capstone audit certifying sovereign application security.",
        "Deep inspection evaluates complete five-dimension compliance across injection, xss, cross-origin, api, and waf.",
        "Comparative analysis demonstrates complete mathematical compliance across all enterprise application benchmarks.",
        "Verification confirms grand milestone capstone certification, zero security regressions, and application security mastery."
    ]
]

for idx, p in enumerate(day45_data["parts"]):
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
            "title": f"WAF & RASP Defense: {p['title']}",
            "left": {
                "label": "Vulnerable Application Infrastructure",
                "content": [
                    "Direct uninspected HTTP traffic reaches application servers without edge filtering",
                    "Pure signature blacklists fail against novel zero-day obfuscation and encoding tricks",
                    "Application runtime cannot detect hostile execution occurring within valid database queries",
                    "Unmitigated automated botnets execute distributed credential stuffing across rotating proxies"
                ]
            },
            "right": {
                "label": "Enterprise WAF & RASP Architecture",
                "content": [
                    "Edge WAF inspects and scores requests across URIs, headers, and bodies in microseconds",
                    "Hybrid security model pairs positive OpenAPI schema enforcement with threat signatures",
                    "Embedded RASP hooks inspect database query ASTs and memory sinks to neutralize zero-days",
                    "Behavioral bot mitigation and TLS/JA4 fingerprinting throttle distributed automation"
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
            "leftLabel": "Vulnerable Application Infrastructure",
            "rightLabel": "Enterprise WAF & RASP Architecture",
            "leftHighlights": [
                "Uninspected edge traffic",
                "Signature evasion vulnerability",
                "Blind runtime execution",
                "Botnet credential stuffing"
            ],
            "rightHighlights": [
                "Microsecond edge filtering",
                "Hybrid schema enforcement",
                "Contextual RASP introspection",
                "Behavioral bot mitigation"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 45,
    "promptSha": hashlib.sha256(b"cyber-day-45-milestone-9-capstone-enterprise-waf-rasp-bot-mitigation").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-45.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
