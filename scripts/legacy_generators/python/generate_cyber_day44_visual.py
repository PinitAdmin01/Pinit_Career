# scripts/generate_cyber_day44_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day44_data import DAY_44_DATA as day44_data

entries = []

captions = [
    [
        "Architectural overview illustrates broken object level authorization vulnerabilities across exposed api endpoints.",
        "Deep inspection evaluates direct object identifier references lacking tenant and user ownership verification.",
        "Comparative analysis demonstrates tenant-scoped document access enforcement over vulnerable direct lookups.",
        "Verification confirms tenant boundary validation, unauthorized cross-tenant blocking, and object safety."
    ],
    [
        "Architectural overview displays centralized policy decision points evaluating multi-attribute access context.",
        "Deep inspection evaluates subject credentials, target resource metadata, and requested action permissions.",
        "Comparative analysis demonstrates declarative policy enforcement over ad-hoc controller conditional statements.",
        "Verification confirms owner authorization, administrator override grants, and non-owner access denial."
    ],
    [
        "Architectural overview illustrates mass assignment defense pipelines filtering client request bodies.",
        "Deep inspection evaluates data transfer object schemas and strict property whitelisting enforcement.",
        "Comparative analysis demonstrates automatic stripping of injected administrative fields over naive orm binding.",
        "Verification confirms permitted profile property retention and complete privileged role removal."
    ],
    [
        "Architectural overview displays token bucket rate limiting pipelines governing api traffic throughput.",
        "Deep inspection evaluates continuous time-based token refilling and atomic burst consumption mechanics.",
        "Comparative analysis demonstrates disciplined traffic throttling over vulnerable unthrottled endpoints.",
        "Verification confirms burst request approval, rate threshold enforcement, and automated scraping defense."
    ],
    [
        "Architectural overview presents end-to-end api security gateway benchmark across enterprise microservices.",
        "Deep inspection evaluates concurrent rate limiting, tenant-scoped authorization, and payload sanitization.",
        "Comparative analysis demonstrates comprehensive enterprise api security certification over ad-hoc filters.",
        "Verification confirms full api defense compliance certification, zero security regressions, and runtime security."
    ]
]

for idx, p in enumerate(day44_data["parts"]):
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
            "title": f"API Security & BOLA: {p['title']}",
            "left": {
                "label": "Vulnerable API Architecture",
                "content": [
                    "Direct object lookups by ID without verifying user ownership permits massive BOLA data theft",
                    "Ad-hoc authorization checks in controller code lead to missed checks on new endpoints",
                    "Binding client request bodies directly to database entities allows mass assignment privilege escalation",
                    "Unthrottled endpoints permit automated credential stuffing, scraping, and enumeration attacks"
                ]
            },
            "right": {
                "label": "Enterprise Hardened API Architecture",
                "content": [
                    "Tenant-scoped and user-scoped database queries mathematically prevent cross-tenant record leakage",
                    "Centralized Policy Decision Points (PDP) decouple and standardize declarative access rules",
                    "Strict Data Transfer Object (DTO) schemas strip unapproved properties before entity persistence",
                    "Token bucket rate limiting meters traffic throughput, protecting endpoints from automated abuse"
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
            "leftLabel": "Vulnerable API Architecture",
            "rightLabel": "Enterprise Hardened API Architecture",
            "leftHighlights": [
                "BOLA IDOR data theft",
                "Ad-hoc authorization gaps",
                "Mass assignment escalation",
                "Unthrottled scraping abuse"
            ],
            "rightHighlights": [
                "Tenant-scoped query isolation",
                "Centralized PDP governance",
                "Strict DTO property filtering",
                "Token bucket rate limiting"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 44,
    "promptSha": hashlib.sha256(b"cyber-day-44-api-security-bola-idor-mass-assignment-rate-limiting").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-44.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
