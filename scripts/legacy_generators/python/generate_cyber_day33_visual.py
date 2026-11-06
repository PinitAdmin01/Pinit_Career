# scripts/generate_cyber_day33_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day33_data import DAY_33_DATA as day33_data

entries = []

captions = [
    [
        "Architectural overview displays cryptographic hash properties and collision resistance mathematical axioms.",
        "Deep inspection evaluates compression functions and contrasts sponge constructions against legacy Merkle Damgard models.",
        "Comparative analysis demonstrates elimination of length extension risks and multi-gigabit hashing performance.",
        "Verification confirms fixed digest output sizes, collision resistance margins, and hardware vectorization."
    ],
    [
        "Architectural overview illustrates nested message authentication codes preventing length extension attacks.",
        "Deep inspection monitors inner and outer key padding and constant-time token comparison execution.",
        "Comparative analysis demonstrates unforgeable message integrity over naive concatenated hash models.",
        "Verification confirms timing-safe verification, rejection of tampered tokens, and signature convergence."
    ],
    [
        "Architectural overview displays password hashing evolution and hardware acceleration vulnerabilities.",
        "Deep inspection evaluates specialized parallel cracking rigs and key-stretching iteration mechanisms.",
        "Comparative analysis demonstrates the necessity of high computational and memory resistance in password storage.",
        "Verification confirms iteration latency stretching, salt uniqueness, and rainbow table neutralization."
    ],
    [
        "Architectural overview illustrates memory-hard password derivation and multi-megabyte matrix memory allocation.",
        "Deep inspection evaluates data-independent and data-dependent memory access patterns across parallel lanes.",
        "Comparative analysis demonstrates memory bus saturation defeating massively parallel graphics hardware.",
        "Verification confirms sixty-four-megabyte memory allocation, thread lane scaling, and side-channel immunity."
    ],
    [
        "Architectural overview displays production credential hashing benchmarks and token tampering audit suites.",
        "Deep inspection subjects authentication tokens to intentional single-byte mutations and monitors rejection.",
        "Comparative analysis demonstrates cryptographic proof-of-work resistance and immutable audit logging.",
        "Verification confirms instantaneous tamper interception, zero timing leakage, and enterprise security compliance."
    ]
]

for idx, p in enumerate(day33_data["parts"]):
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
            "title": f"Hashing & Credentials: {p['title']}",
            "left": {
                "label": "Legacy / Insecure Hashing",
                "content": [
                    "Fast cryptographic hashes allow billions of password guesses per second",
                    "Naive keyed hashing allows length extension forged signatures",
                    "CPU-only algorithms fail against specialized hardware cracking arrays",
                    "Standard string comparisons leak microsecond timing signals"
                ]
            },
            "right": {
                "label": "Modern Memory-Hard Architecture",
                "content": [
                    "Sponge and tree hashes eliminate length extension vulnerabilities",
                    "Nested HMAC uses inner and outer padded keys for unforgeable integrity",
                    "Argon2id forces sixty-four-megabyte RAM allocation to defeat GPUs",
                    "Constant-time memory comparisons neutralize side-channel timing attacks"
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
            "leftLabel": "Legacy / Insecure Hashing",
            "rightLabel": "Modern Memory-Hard Architecture",
            "leftHighlights": [
                "Fast hash cracking risk",
                "Length extension vulnerability",
                "Hardware brute-force exposure",
                "Timing side-channel leakage"
            ],
            "rightHighlights": [
                "Immune sponge construction",
                "Nested HMAC integrity",
                "Memory-hard Argon2id RAM",
                "Constant-time verification"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 33,
    "promptSha": hashlib.sha256(b"cyber-day-33-cryptographic-hashing-password-storage-sha3-argon2id").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-33.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
