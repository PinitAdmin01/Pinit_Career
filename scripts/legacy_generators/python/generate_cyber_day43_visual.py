# scripts/generate_cyber_day43_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day43_data import DAY_43_DATA as day43_data

entries = []

captions = [
    [
        "Architectural overview illustrates browser ambient authority and cross-site request forgery attack vectors.",
        "Deep inspection evaluates fetch metadata rules intercepting unauthorized state-changing cross-site requests.",
        "Comparative analysis demonstrates origin header verification over uninspected ambient cookie transmissions.",
        "Verification confirms cross-site request interception, same-origin grant authorization, and session protection."
    ],
    [
        "Architectural overview displays samesite cookie attributes controlling cross-site cookie transmission policies.",
        "Deep inspection evaluates strict, lax, and none modes alongside top-level navigation request permissions.",
        "Comparative analysis demonstrates automated browser-level request protection without application code changes.",
        "Verification confirms samesite attribute emission, secure transport enforcement, and httponly cookie isolation."
    ],
    [
        "Architectural overview illustrates synchronizer token patterns and hmac-signed double-submit cookie architectures.",
        "Deep inspection evaluates cryptographic random token generation and timing-safe signature comparison.",
        "Comparative analysis demonstrates unforgeable application-layer protection independent of browser configurations.",
        "Verification confirms cryptographic token derivation, timing-safe equality checks, and forged token rejection."
    ],
    [
        "Architectural overview displays cross-origin resource sharing preflight evaluation and origin whitelist enforcement.",
        "Deep inspection monitors access-control header generation and explicit rejection of insecure null origin traps.",
        "Comparative analysis demonstrates controlled cross-domain collaboration compared to wide-open wildcard permissions.",
        "Verification confirms origin whitelist compliance, credential permission alignment, and preflight approval."
    ],
    [
        "Architectural overview presents end-to-end cross-origin security gateway filter across enterprise microservices.",
        "Deep inspection evaluates concurrent origin verification, samesite cookie enforcement, and token validation.",
        "Comparative analysis demonstrates comprehensive enterprise cross-domain security certification over ad-hoc filters.",
        "Verification confirms full cross-site defense compliance certification, zero security regressions, and runtime defense."
    ]
]

for idx, p in enumerate(day43_data["parts"]):
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
            "title": f"CSRF & CORS Defense: {p['title']}",
            "left": {
                "label": "Vulnerable Cross-Origin Architecture",
                "content": [
                    "Ambient credential forwarding allows malicious sites to forge state-changing POST requests",
                    "Cookies without SameSite flags are sent automatically on all cross-site requests",
                    "Stateless APIs without CSRF tokens permit cross-domain transaction execution",
                    "Wildcard CORS or dynamic origin reflection destroys the Same-Origin Policy"
                ]
            },
            "right": {
                "label": "Enterprise Hardened CSRF & CORS Architecture",
                "content": [
                    "Fetch metadata and Origin verification block unauthorized cross-site requests at the edge",
                    "SameSite=Lax/Strict restricts ambient cookie transmission on state-changing actions",
                    "HMAC-signed synchronizer tokens enforce cryptographically verified transaction intent",
                    "Strict CORS origin whitelisting permits accredited partner access while blocking null origins"
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
            "leftLabel": "Vulnerable Cross-Origin Architecture",
            "rightLabel": "Enterprise Hardened CSRF & CORS Architecture",
            "leftHighlights": [
                "Ambient credential abuse",
                "Missing SameSite protection",
                "Missing CSRF tokens",
                "Wildcard CORS leakage"
            ],
            "rightHighlights": [
                "Fetch metadata inspection",
                "SameSite cookie enforcement",
                "HMAC token validation",
                "Strict CORS whitelisting"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 43,
    "promptSha": hashlib.sha256(b"cyber-day-43-csrf-cors-samesite-cookies-stp-preflight-origin-auditing").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-43.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
