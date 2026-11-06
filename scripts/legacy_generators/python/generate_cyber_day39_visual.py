# scripts/generate_cyber_day39_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day39_data import DAY_39_DATA as day39_data

entries = []

captions = [
    [
        "Architectural overview illustrates enterprise federation boundaries between identity providers and service providers.",
        "Deep inspection evaluates saml authnrequest generation and assertion response extraction mechanics.",
        "Comparative analysis demonstrates enterprise directory single sign-on over isolated username password databases.",
        "Verification confirms assertion issuer extraction, subject identity parsing, and unique assertion identification."
    ],
    [
        "Architectural overview displays exclusive xml canonicalization pipelines transforming irregular markup into standard streams.",
        "Deep inspection monitors deterministic attribute alphabetization, whitespace normalization, and sha hashing.",
        "Comparative analysis demonstrates reliable cryptographic digest generation despite transport formatting variations.",
        "Verification confirms canonical stream generation, reference digest calculation, and xml signature verification."
    ],
    [
        "Architectural overview illustrates structural schema validation defending against xml signature wrapping attacks.",
        "Deep inspection evaluates strict assertion cardinality enforcement and contextual identifier binding checks.",
        "Comparative analysis demonstrates total interception of cloned or nested assertion injection exploits.",
        "Verification confirms single assertion presence, absolute xpath navigation, and malicious wrapping containment."
    ],
    [
        "Architectural overview displays temporal assertion boundary checks and single-use identifier caching mechanisms.",
        "Deep inspection monitors in-response-to correlation, recipient destination matching, and expiration enforcement.",
        "Comparative analysis demonstrates mathematical interception of replayed enterprise single sign-on assertions.",
        "Verification confirms original request matching, single-use assertion consumption, and immediate replay blocking."
    ],
    [
        "Architectural overview presents end-to-end assertion consumer service verification gateway for enterprise sso.",
        "Deep inspection evaluates multi-checkpoint defense including entity expansion protection and signature checks.",
        "Comparative analysis demonstrates complete enterprise federation compliance certification over vulnerable parsers.",
        "Verification confirms full enterprise single sign-on compliance certification and zero-trust identity mastery."
    ]
]

for idx, p in enumerate(day39_data["parts"]):
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
            "title": f"SAML Enterprise SSO: {p['title']}",
            "left": {
                "label": "Insecure / Naive SAML Handling",
                "content": [
                    "Direct XML hashing without C14N fails on minor proxy whitespace changes",
                    "Naive relative XPath queries permit XML Signature Wrapping privilege escalation",
                    "Missing InResponseTo and recipient checks allow cross-site assertion injection",
                    "Uncached assertion IDs allow attackers to replay intercepted assertions indefinitely"
                ]
            },
            "right": {
                "label": "Enterprise Hardened SAML Architecture",
                "content": [
                    "Exclusive C14N guarantees deterministic XML hashing across all platforms",
                    "Strict schema validation and absolute XPath enforce single assertion cardinality",
                    "Rigorous InResponseTo, recipient, and temporal boundaries bound assertion scope",
                    "Single-use assertion ID caching in distributed memory neutralizes replay attacks"
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
            "leftLabel": "Insecure / Naive SAML Handling",
            "rightLabel": "Enterprise Hardened SAML Architecture",
            "leftHighlights": [
                "Brittle whitespace hashing",
                "Signature wrapping vulnerability",
                "Unsolicited assertion injection",
                "Indefinite assertion replay"
            ],
            "rightHighlights": [
                "Deterministic C14N normalization",
                "Schema cardinality enforcement",
                "Strict contextual binding",
                "Single-use replay neutralization"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 39,
    "promptSha": hashlib.sha256(b"cyber-day-39-saml-2.0-enterprise-sso-xmldsig-c14n-xsw-replay-mitigation").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-39.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
