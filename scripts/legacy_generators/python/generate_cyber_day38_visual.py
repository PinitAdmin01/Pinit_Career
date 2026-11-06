# scripts/generate_cyber_day38_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day38_data import DAY_38_DATA as day38_data

entries = []

captions = [
    [
        "Architectural overview illustrates openid connect identity layer decoupled from oauth authorization tokens.",
        "Deep inspection evaluates id token claims and cryptographic left-half hash binding over access tokens.",
        "Comparative analysis demonstrates elimination of pseudo-authentication vulnerabilities and token substitution.",
        "Verification confirms cryptographic nonce validation, access token hash alignment, and subject integrity."
    ],
    [
        "Architectural overview displays dynamic provider metadata discovery at standardized well-known paths.",
        "Deep inspection evaluates strict issuer domain matching and universal transport layer security prerequisites.",
        "Comparative analysis demonstrates elimination of brittle static configuration files through dynamic metadata.",
        "Verification confirms valid issuer matching, all secure endpoint urls, and cached metadata integrity."
    ],
    [
        "Architectural overview illustrates key set distribution endpoints and wire-speed in-memory key resolution.",
        "Deep inspection monitors seamless multi-key coexistence during zero-downtime cryptographic key rotation cycles.",
        "Comparative analysis demonstrates zero service disruption during planned key retirement and rollover.",
        "Verification confirms active key parsing, key identifier indexing, and fast cache lookup readiness."
    ],
    [
        "Architectural overview displays userinfo API endpoint returning rich profile claims for authorized clients.",
        "Deep inspection evaluates bearer access token verification and strict scope-based claim filtering policies.",
        "Comparative analysis demonstrates lightweight token headers combined with on-demand detailed profile retrieval.",
        "Verification confirms successful user claims retrieval, valid email verification flags, and data minimization."
    ],
    [
        "Architectural overview presents end-to-end relying party federation gateway across enterprise environments.",
        "Deep inspection evaluates multi-stage validation including state checks, id tokens, nonces, and access tokens.",
        "Comparative analysis demonstrates comprehensive enterprise identity federation certification over ad-hoc setups.",
        "Verification confirms full federation compliance certification, zero security regressions, and zero-trust mastery."
    ]
]

for idx, p in enumerate(day38_data["parts"]):
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
            "title": f"OIDC Federation: {p['title']}",
            "left": {
                "label": "Insecure / Ad-hoc Identity Federation",
                "content": [
                    "Pseudo-authentication using access tokens risks token substitution attacks",
                    "Hardcoded provider URLs break on certificate or endpoint rotation",
                    "Static key files require server restarts during cryptographic key rollover",
                    "Bloated tokens with all profile claims exceed HTTP header size limits"
                ]
            },
            "right": {
                "label": "Standardized OIDC Enterprise Architecture",
                "content": [
                    "Dedicated ID Tokens bind user identity and access tokens with cryptographic hashes",
                    "Standardized discovery documents allow dynamic provider configuration",
                    "In-memory JWKS cache enables zero-downtime key rotation by Key ID",
                    "Decoupled UserInfo endpoint delivers deep profile data on-demand securely"
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
            "leftLabel": "Insecure / Ad-hoc Identity Federation",
            "rightLabel": "Standardized OIDC Enterprise Architecture",
            "leftHighlights": [
                "Token substitution risk",
                "Fragile static endpoints",
                "Service restart outages",
                "HTTP header bloat"
            ],
            "rightHighlights": [
                "Cryptographic ID token binding",
                "Dynamic discovery metadata",
                "Zero-downtime key rotation",
                "On-demand UserInfo retrieval"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 38,
    "promptSha": hashlib.sha256(b"cyber-day-38-oidc-identity-federation-id-tokens-discovery-jwks-userinfo").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-38.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
