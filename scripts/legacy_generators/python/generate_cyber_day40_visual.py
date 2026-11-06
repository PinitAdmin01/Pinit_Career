# scripts/generate_cyber_day40_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day40_data import DAY_40_DATA as day40_data

entries = []

captions = [
    [
        "Architectural overview illustrates sovereign hybrid identity gateway routing incoming federation requests.",
        "Deep inspection evaluates multi-protocol dispatch across authorization code and token exchange grants.",
        "Comparative analysis demonstrates consolidated zero-trust perimeter over fragmented identity silos.",
        "Verification confirms intelligent grant routing, supported protocol selection, and gateway request validity."
    ],
    [
        "Architectural overview displays standard token exchange pipelines downscoping permissions across microservices.",
        "Deep inspection evaluates subject token ingestion, target audience binding, and actor delegation semantics.",
        "Comparative analysis demonstrates strict least-privilege enforcement over broad token forwarding chains.",
        "Verification confirms downscoped audience token generation, bounded lifetime, and delegation validity."
    ],
    [
        "Architectural overview illustrates zero-trust token translation transforming legacy xml into modern jwt format.",
        "Deep inspection monitors attribute sanitization, subject claim extraction, and asymmetric signing.",
        "Comparative analysis demonstrates seamless cloud microservice compatibility without modifying legacy servers.",
        "Verification confirms translated subject claims, audience binding, and preserved federation provenance."
    ],
    [
        "Architectural overview displays distributed out-of-band back-channel logout coordinator across relying parties.",
        "Deep inspection evaluates direct server-to-server logout tokens and registered session mapping invalidation.",
        "Comparative analysis demonstrates deterministic session termination over fragile browser redirect cascades.",
        "Verification confirms simultaneous multi-session revocation, zero client reliance, and session cleanup."
    ],
    [
        "Architectural overview presents the grand milestone capstone audit certifying sovereign identity mastery.",
        "Deep inspection evaluates complete five-dimension compliance across oauth, jose, oidc, saml, and exchange.",
        "Comparative analysis demonstrates complete mathematical compliance across all enterprise identity benchmarks.",
        "Verification confirms grand milestone capstone certification, zero security regressions, and identity defense mastery."
    ]
]

for idx, p in enumerate(day40_data["parts"]):
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
            "title": f"Identity Gateway & Capstone: {p['title']}",
            "left": {
                "label": "Fragmented / Ad-hoc Identity Architecture",
                "content": [
                    "Isolated protocol silos with uncoordinated authentication policies",
                    "Forwarding broad user tokens down microservice chains violates least privilege",
                    "Bulky legacy XML assertions cause latency spikes on mobile and cloud APIs",
                    "Fragile front-channel browser redirects fail to terminate distributed sessions"
                ]
            },
            "right": {
                "label": "Sovereign Enterprise Identity Platform",
                "content": [
                    "Unified hybrid gateway normalizes OAuth 2.1, OIDC, and SAML 2.0 at the edge",
                    "RFC 8693 token exchange mints downscoped, audience-restricted microservice tokens",
                    "Zero-trust token translation converts legacy XML assertions into signed modern JWTs",
                    "Deterministic back-channel logout terminates cross-domain sessions out-of-band"
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
            "leftLabel": "Fragmented / Ad-hoc Identity Architecture",
            "rightLabel": "Sovereign Enterprise Identity Platform",
            "leftHighlights": [
                "Fragmented protocol silos",
                "Broad token over-privilege",
                "Bulky XML latency bloat",
                "Fragile front-channel logout"
            ],
            "rightHighlights": [
                "Unified hybrid gateway",
                "Downscoped token exchange",
                "Zero-trust token translation",
                "Deterministic back-channel logout"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 40,
    "promptSha": hashlib.sha256(b"cyber-day-40-milestone-8-capstone-sovereign-identity-gateway-token-exchange").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-40.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
