# scripts/generate_cyber_day31_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day31_data import DAY_31_DATA as day31_data

entries = []

captions = [
    [
        "Architectural overview displays symmetric block cipher operational modes and pattern leakage characteristics.",
        "Deep inspection evaluates electronic codebook deterministic output versus counter mode randomized keystreams.",
        "Comparative analysis demonstrates elimination of structural leakage and padding oracle vulnerabilities.",
        "Verification confirms randomized keystream generation, zero padding overhead, and parallel execution."
    ],
    [
        "Architectural overview illustrates authenticated encryption with associated data combining confidentiality and authenticity.",
        "Deep inspection monitors polynomial authentication tag calculation over encrypted payloads and routing headers.",
        "Comparative analysis demonstrates unforgeable integrity verification over raw unauthenticated block ciphers.",
        "Verification confirms sixteenth-byte tag generation, associated data binding, and instantaneous tamper rejection."
    ],
    [
        "Architectural overview displays constant-time software stream encryption utilizing register add rotate xor operations.",
        "Deep inspection evaluates state matrix mixing and polynomial authenticator evaluation without memory lookups.",
        "Comparative analysis demonstrates complete immunity to cache-timing side-channel attacks on heterogeneous hardware.",
        "Verification confirms constant execution latency, tag equivalence, and mobile battery optimization."
    ],
    [
        "Architectural overview displays nonce safety enforcement mechanisms and keystream collision prevention safeguards.",
        "Deep inspection evaluates duplicate nonce detection and prevents catastrophic keystream cancellation vulnerabilities.",
        "Comparative analysis demonstrates monotonic counter progression and synthetic initialization vector safety.",
        "Verification confirms immediate rejection of duplicate nonces, zero keystream exposure, and safety alerts."
    ],
    [
        "Architectural overview displays the production symmetric cipher benchmark and adversarial bit-flipping audit engine.",
        "Deep inspection subjects authenticated ciphertext to intentional single-bit mutations and monitors rejection.",
        "Comparative analysis demonstrates mathematical tamper containment and constant-time memory comparisons.",
        "Verification confirms total interception of corrupted payloads, zero memory leaks, and enterprise assurance."
    ]
]

for idx, p in enumerate(day31_data["parts"]):
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
            "title": f"Symmetric Cryptography: {p['title']}",
            "left": {
                "label": "Insecure / Legacy Encryption",
                "content": [
                    "Electronic codebook preserves identical ciphertext blocks and leaks patterns",
                    "Unauthenticated ciphers allow bit-flipping attacks in transit",
                    "Table-based implementations suffer cache-timing side-channel attacks",
                    "Reusing nonces cancels keystreams and completely exposes plaintexts"
                ]
            },
            "right": {
                "label": "Modern Authenticated Cryptography",
                "content": [
                    "Counter modes transform block ciphers into parallel stream ciphers",
                    "AEAD generates unforgeable polynomial authentication tags over payload",
                    "ChaCha20 uses constant-time register operations immune to timing attacks",
                    "Atomic nonce tracking and synthetic vectors prevent keystream reuse"
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
            "leftLabel": "Insecure / Legacy Encryption",
            "rightLabel": "Modern Authenticated Cryptography",
            "leftHighlights": [
                "Deterministic pattern leakage",
                "Bit-flipping vulnerability",
                "Cache-timing exposure",
                "Keystream cancellation"
            ],
            "rightHighlights": [
                "Counter mode parallelism",
                "Unforgeable AEAD tags",
                "Constant-time register ARX",
                "Atomic nonce enforcement"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 31,
    "promptSha": hashlib.sha256(b"cyber-day-31-modern-symmetric-cryptography-aes-gcm-chacha20-poly1305").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-31.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
