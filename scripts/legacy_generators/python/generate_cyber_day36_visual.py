# scripts/generate_cyber_day36_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day36_data import DAY_36_DATA as day36_data

entries = []

captions = [
    [
        "Architectural overview illustrates delegated authorization boundaries and deprecation of insecure legacy flows.",
        "Deep inspection evaluates the universal authorization code flow and strict redirect matching policies.",
        "Comparative analysis highlights elimination of front-channel token leaks compared to legacy implicit grants.",
        "Verification confirms authorization code parameters, secure redirection, and zero legacy flow vulnerabilities."
    ],
    [
        "Architectural overview displays ephemeral challenge derivation and code verifier exchange mechanics.",
        "Deep inspection monitors secure random verifier generation and cryptographic hash transformation.",
        "Comparative analysis demonstrates complete protection against mobile custom scheme code interception attacks.",
        "Verification confirms timing-safe challenge validation, parameter integrity, and interceptor lockout."
    ],
    [
        "Architectural overview illustrates confidential backend authentication using asymmetric digital signatures.",
        "Deep inspection evaluates client assertion claims, audience validation, and expiration boundaries.",
        "Comparative analysis demonstrates elimination of static pre-shared secrets through public key infrastructure.",
        "Verification confirms asymmetric assertion signature validity, token endpoint binding, and replay immunity."
    ],
    [
        "Architectural overview displays single-use refresh token issuance and session family tracking pipelines.",
        "Deep inspection monitors token family state transitions and automated breach containment triggers.",
        "Comparative analysis demonstrates instantaneous revocation of compromised token families upon duplicate reuse.",
        "Verification confirms rotated token issuance, single-use state updates, and family-wide revocation readiness."
    ],
    [
        "Architectural overview presents end-to-end authorization security audit suite across enterprise identity gateways.",
        "Deep inspection evaluates concurrent authorization code exchanges, client assertions, and rotated tokens.",
        "Comparative analysis demonstrates full compliance with modern delegated authorization specifications.",
        "Verification confirms zero legacy grant vulnerabilities, timing-safe PKCE checks, and complete breach containment."
    ]
]

for idx, p in enumerate(day36_data["parts"]):
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
            "title": f"OAuth Framework: {p['title']}",
            "left": {
                "label": "Insecure Legacy Authorization",
                "content": [
                    "Implicit grants expose access tokens directly in front-channel browser URLs",
                    "Password grant forces users to enter master credentials into untrusted clients",
                    "Authorization codes without challenges risk mobile redirect interception",
                    "Static long-lived refresh tokens allow indefinite unauthorized access on theft"
                ]
            },
            "right": {
                "label": "OAuth Two Point One Architecture",
                "content": [
                    "Authorization Code grant with PKCE is mandated across all client types",
                    "Strict exact redirect matching prevents open redirector token theft",
                    "Asymmetric Private Key JWT validates confidential client identities securely",
                    "Single-use Refresh Token Rotation with automated family-wide breach revocation"
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
            "leftLabel": "Insecure Legacy Authorization",
            "rightLabel": "OAuth Two Point One Architecture",
            "leftHighlights": [
                "Front-channel URL token leakage",
                "Password credential exposure",
                "Authorization code interception",
                "Static refresh token theft"
            ],
            "rightHighlights": [
                "Universal PKCE enforcement",
                "Exact redirect matching",
                "Asymmetric client assertion",
                "Rotated token family revocation"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 36,
    "promptSha": hashlib.sha256(b"cyber-day-36-oauth-2.1-framework-pkce-client-auth-refresh-token-rotation").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-36.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
