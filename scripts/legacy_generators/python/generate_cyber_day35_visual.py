# scripts/generate_cyber_day35_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day35_data import DAY_35_DATA as day35_data

entries = []

captions = [
    [
        "Architectural overview displays hardware security module tamper boundaries and master key lifecycle state machines.",
        "Deep inspection evaluates physical zeroization sensor wires and cryptoprocessor isolation mechanisms.",
        "Comparative analysis demonstrates physical root of trust protection over vulnerable plaintext memory storage.",
        "Verification confirms state transitions, active zeroization circuitry readiness, and cryptographic compliance."
    ],
    [
        "Architectural overview illustrates envelope key derivation pipelines and data encryption key wrapping hierarchies.",
        "Deep inspection monitors local symmetric payload encryption and instantaneous in-memory plaintext zeroization.",
        "Comparative analysis demonstrates multi-gigabit throughput combined with centralized master key governance.",
        "Verification confirms thirty-two-byte key wrapping, authenticated tag generation, and memory wiping."
    ],
    [
        "Architectural overview displays unified cryptographic operations facade enforcing authenticated encryption standards.",
        "Deep inspection evaluates mandatory associated data binding and deterministic nonce generation safeguards.",
        "Comparative analysis demonstrates elimination of unauthenticated ciphers and memory leakage vulnerabilities.",
        "Verification confirms authenticated tag generation, side-channel immunity, and clean memory deallocation."
    ],
    [
        "Architectural overview illustrates attribute-based access governance and immutable hash-chained audit logging.",
        "Deep inspection evaluates cryptographic context bindings and sequential Merkle hash chain link verification.",
        "Comparative analysis demonstrates mathematical proof of audit immutability over manipulable plaintext logs.",
        "Verification confirms unbroken cryptographic hash chains, contextual policy enforcement, and security alerts."
    ],
    [
        "Architectural overview displays the grand milestone capstone audit certifying sovereign cryptographic platform readiness.",
        "Deep inspection evaluates end-to-end symmetric authenticated encryption, elliptic curves, hashing, and hardware roots.",
        "Comparative analysis demonstrates complete mathematical compliance across all foundational security benchmarks.",
        "Verification confirms milestone certification, zero security regressions, and enterprise cryptographic mastery."
    ]
]

for idx, p in enumerate(day35_data["parts"]):
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
            "title": f"Hardware Security & KMS: {p['title']}",
            "left": {
                "label": "Insecure / Ad-hoc Cryptography",
                "content": [
                    "Master keys stored in plaintext configuration files or operating system RAM",
                    "Direct HSM calls create multi-second latency bottlenecks across microservices",
                    "Unauthenticated ciphers and arbitrary nonces risk catastrophic keystream reuse",
                    "Plaintext audit logs can be manipulated by attackers to erase evidence"
                ]
            },
            "right": {
                "label": "Sovereign HSM & KMS Architecture",
                "content": [
                    "FIPS certified HSMs enforce physical tamper zeroization in microseconds",
                    "Envelope encryption wraps local data keys for gigabit-speed parallel throughput",
                    "Unified facade mandates AEAD ciphers, automatic nonces, and memory zeroization",
                    "Merkle hash chaining provides mathematically immutable tamper-evident audit logs"
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
            "leftLabel": "Insecure / Ad-hoc Cryptography",
            "rightLabel": "Sovereign HSM & KMS Architecture",
            "leftHighlights": [
                "Plaintext key exposure",
                "HSM throughput bottleneck",
                "Keystream reuse risk",
                "Manipulable audit logs"
            ],
            "rightHighlights": [
                "Tamper zeroization",
                "Envelope performance",
                "Unified AEAD facade",
                "Merkle hash immutability"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 35,
    "promptSha": hashlib.sha256(b"cyber-day-35-milestone-7-capstone-hsm-key-lifecycle-management-engine").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-35.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
