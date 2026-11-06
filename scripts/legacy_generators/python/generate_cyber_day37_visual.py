# scripts/generate_cyber_day37_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day37_data import DAY_37_DATA as day37_data

entries = []

captions = [
    [
        "Architectural overview illustrates three part token layout with header payload and signature segments.",
        "Deep inspection evaluates base sixty-four url decoding without sensitive character mangling.",
        "Comparative analysis demonstrates transparent claim readability compared to encrypted payload envelopes.",
        "Verification confirms segment boundaries, claims parsing integrity, and signature isolation."
    ],
    [
        "Architectural overview displays asymmetric signing pipelines and key identifier resolution caches.",
        "Deep inspection evaluates signature generation using private keys and public key verification.",
        "Comparative analysis demonstrates non-repudiation and elimination of shared symmetric secrets.",
        "Verification confirms mathematical signature validity, key cache lookup, and public key binding."
    ],
    [
        "Architectural overview illustrates algorithm whitelisting guard defending against algorithm confusion.",
        "Deep inspection evaluates unconditional blocking of algorithm none and forged header parameters.",
        "Comparative analysis demonstrates strict rejection of symmetric confusion attacks on public keys.",
        "Verification confirms whitelist enforcement, tamper interception, and automated alerts."
    ],
    [
        "Architectural overview displays temporal claims evaluation with configurable clock skew tolerance.",
        "Deep inspection monitors issuer and audience exact string matching alongside expiration windows.",
        "Comparative analysis demonstrates resilient inter-service synchronization preventing clock drift failures.",
        "Verification confirms audience alignment, temporal validity within skew bounds, and expiration enforcement."
    ],
    [
        "Architectural overview presents end-to-end zero-trust token inspection across cloud api gateways.",
        "Deep inspection evaluates concurrent structure validation, signature verification, and claims auditing.",
        "Comparative analysis demonstrates comprehensive enterprise security certification over ad-hoc verifiers.",
        "Verification confirms full compliance certification, zero security regressions, and identity defense mastery."
    ]
]

for idx, p in enumerate(day37_data["parts"]):
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
            "title": f"JOSE Standards: {p['title']}",
            "left": {
                "label": "Insecure / Naive Token Handling",
                "content": [
                    "Treats Base64URL encoding as encryption and exposes secrets in payload",
                    "Shares symmetric HMAC secrets across dozens of downstream microservices",
                    "Blindly trusts alg header allowing alg none or HMAC key confusion bypass",
                    "Rejects valid tokens on slight sub-second NTP clock drift without skew tolerance"
                ]
            },
            "right": {
                "label": "Enterprise Hardened JOSE Architecture",
                "content": [
                    "Recognizes Base64URL as encoding only and encapsulates secrets in JWE",
                    "Asymmetric RS256 or ES256 provides non-repudiation with public key verification",
                    "Strict compile-time algorithm whitelist unconditionally rejects unapproved algorithms",
                    "Controlled clock skew tolerance absorbs minor drift while strictly bounding lifetimes"
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
            "leftLabel": "Insecure / Naive Token Handling",
            "rightLabel": "Enterprise Hardened JOSE Architecture",
            "leftHighlights": [
                "Encoding mistaken for encryption",
                "Shared symmetric secret risk",
                "Algorithm confusion vulnerability",
                "Clock drift rejection outage"
            ],
            "rightHighlights": [
                "Explicit payload encapsulation",
                "Asymmetric non-repudiation",
                "Strict algorithm whitelisting",
                "Hardened clock skew tolerance"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 37,
    "promptSha": hashlib.sha256(b"cyber-day-37-jwt-jose-standards-jws-signatures-kid-algorithm-confusion").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-37.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
