# scripts/generate_cyber_day32_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day32_data import DAY_32_DATA as day32_data

entries = []

captions = [
    [
        "Architectural overview displays asymmetric cryptography key scaling and trapdoor function mathematical foundations.",
        "Deep inspection evaluates integer factorization key explosion versus elliptic curve discrete logarithm efficiency.",
        "Comparative analysis demonstrates equivalent security margins with significantly smaller key sizes.",
        "Verification confirms compact key representations, reduced network overhead, and high computational efficiency."
    ],
    [
        "Architectural overview illustrates ephemeral Diffie-Hellman key exchange and perfect forward secrecy guarantees.",
        "Deep inspection monitors independent shared secret derivation and immediate zeroization of ephemeral private keys.",
        "Comparative analysis demonstrates protection against retrospective decryption over static key exchange models.",
        "Verification confirms shared secret convergence, ephemeral key destruction, and historical session isolation."
    ],
    [
        "Architectural overview displays deterministic digital signatures and side-channel immune curve operations.",
        "Deep inspection evaluates deterministic nonce derivation from private key and message hash components.",
        "Comparative analysis demonstrates total elimination of random number generator bias and nonce reuse vulnerabilities.",
        "Verification confirms sixty-four-byte signature generation, fast verification, and tamper detection."
    ],
    [
        "Architectural overview illustrates hybrid cryptosystems uniting asymmetric key encapsulation with symmetric encryption.",
        "Deep inspection evaluates data encryption key wrapping under master keys and payload encryption via counter modes.",
        "Comparative analysis demonstrates multi-gigabit throughput combined with zero-shared-secret access governance.",
        "Verification confirms envelope bundling, authenticated tag attachment, and instant key revocation capabilities."
    ],
    [
        "Architectural overview displays production asymmetric cipher benchmarks and automated forward secrecy verification.",
        "Deep inspection audits sequential ephemeral handshakes to confirm absolute cryptographic key independence.",
        "Comparative analysis demonstrates hardware-rooted identity attestation and mutual authentication compliance.",
        "Verification confirms zero cross-session correlation, perfect forward secrecy, and enterprise readiness."
    ]
]

for idx, p in enumerate(day32_data["parts"]):
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
            "title": f"Asymmetric Cryptography: {p['title']}",
            "left": {
                "label": "Legacy Public-Key Architectures",
                "content": [
                    "Bloated RSA keys consume excessive CPU cycles and packet bandwidth",
                    "Static key exchanges expose historical traffic to retrospective decryption",
                    "ECDSA random nonce failures leak master private signing keys",
                    "Direct asymmetric bulk encryption exhausts server compute resources"
                ]
            },
            "right": {
                "label": "Modern Elliptic Curve Architecture",
                "content": [
                    "Curve25519 delivers high security with compact thirty-two-byte keys",
                    "Ephemeral ECDHE derives session secrets and enforces forward secrecy",
                    "Ed25519 derives nonces deterministically to eliminate RNG bias",
                    "Hybrid envelope encryption wraps symmetric keys for gigabit speed"
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
            "leftLabel": "Legacy Public-Key Architectures",
            "rightLabel": "Modern Elliptic Curve Architecture",
            "leftHighlights": [
                "Bloated key overhead",
                "Retrospective decryption risk",
                "ECDSA nonce leakage",
                "Asymmetric CPU exhaustion"
            ],
            "rightHighlights": [
                "Compact thirty-two-byte keys",
                "Ephemeral forward secrecy",
                "Deterministic Ed25519 signing",
                "Hybrid envelope performance"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 32,
    "promptSha": hashlib.sha256(b"cyber-day-32-asymmetric-cryptography-elliptic-curves-x25519-ed25519").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-32.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
