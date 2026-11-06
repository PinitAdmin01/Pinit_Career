# scripts/generate_cyber_day34_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day34_data import DAY_34_DATA as day34_data

entries = []

captions = [
    [
        "Architectural overview displays public key infrastructure hierarchy from root to intermediate and leaf certificates.",
        "Deep inspection evaluates self-signed root anchors and delegation constraints protecting master signing keys.",
        "Comparative analysis demonstrates global trust scalability over decentralized peer signing models.",
        "Verification confirms three-tier certificate chain construction, path constraints, and leaf validation."
    ],
    [
        "Architectural overview illustrates structured certificate serialization using abstract syntax notation distinguished rules.",
        "Deep inspection evaluates subject alternative names and critical basic constraints preventing leaf signing attacks.",
        "Comparative analysis demonstrates canonical binary uniqueness over ambiguous textual certificate formatting.",
        "Verification confirms public key export, standardized encoding blocks, and extension enforcement."
    ],
    [
        "Architectural overview displays certificate revocation mechanisms and online status protocol optimizations.",
        "Deep inspection monitors cached status assertions stapled directly into initial transport layer handshakes.",
        "Comparative analysis demonstrates elimination of user privacy tracking and connection latency overhead.",
        "Verification confirms fresh status assertions, valid signatures, and immediate interception of revoked keys."
    ],
    [
        "Architectural overview illustrates public append-only cryptographic Merkle trees and certificate transparency ledgers.",
        "Deep inspection evaluates signed certificate timestamps and multi-log compliance verification policies.",
        "Comparative analysis demonstrates public auditable visibility over hidden rogue certificate issuance risks.",
        "Verification confirms multi-log timestamp inclusion, consistency proof audits, and phishing detection."
    ],
    [
        "Architectural overview displays the production public key infrastructure chain validation benchmark suite.",
        "Deep inspection audits full path construction, temporal expiration windows, and subject alternative name matches.",
        "Comparative analysis demonstrates enterprise cryptographic assurance across multi-cloud service meshes.",
        "Verification confirms total chain validity, domain name matches, and zero trust identity compliance."
    ]
]

for idx, p in enumerate(day34_data["parts"]):
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
            "title": f"Public Key Infrastructure: {p['title']}",
            "left": {
                "label": "Insecure / Legacy PKI",
                "content": [
                    "Direct root signing exposes master private keys on network interfaces",
                    "Massive revocation lists add seconds of download latency and fail soft",
                    "Direct status queries leak end-user browsing histories to third parties",
                    "Hidden rogue certificate authorities issue undetectable forged certificates"
                ]
            },
            "right": {
                "label": "Modern Sovereign PKI Architecture",
                "content": [
                    "Hierarchical chains keep root keys in offline air-gapped vaults",
                    "OCSP stapling caches signed status assertions with zero network latency",
                    "Subject alternative names strictly validate domains without ambiguity",
                    "Certificate transparency logs every certificate in public Merkle trees"
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
            "leftLabel": "Insecure / Legacy PKI",
            "rightLabel": "Modern Sovereign PKI Architecture",
            "leftHighlights": [
                "Online root exposure",
                "Revocation list latency",
                "Status privacy leakage",
                "Hidden rogue certificates"
            ],
            "rightHighlights": [
                "Air-gapped root security",
                "Zero-latency stapling",
                "Strict domain validation",
                "Public Merkle transparency"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 34,
    "promptSha": hashlib.sha256(b"cyber-day-34-pki-x509-certificate-authorities-ocsp-stapling-transparency").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-34.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
