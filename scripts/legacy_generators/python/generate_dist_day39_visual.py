# scripts/generate_dist_day39_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day39_data import DAY_39_DATA as day39_data

entries = []

captions = [
    [
        "Architectural overview illustrates the fatal dual-write anti-pattern causing database and event bus divergence.",
        "Deep inspection monitors uncoordinated sequential updates failing during network timeouts and process crashes.",
        "Comparative analysis demonstrates inevitable data loss over atomic single-boundary transaction execution.",
        "Verification confirms detection of dual-write divergence hazards and reinforces the necessity of unified transactions."
    ],
    [
        "Architectural overview displays the Transactional Outbox pattern executing local atomic database commitments.",
        "Deep inspection monitors business state inserts paired simultaneously with outbox table event descriptors.",
        "Comparative analysis demonstrates unshakeable local durability over fragile uncoordinated network calls.",
        "Verification confirms unified local transaction execution, permanent outbox logging, and zero event loss."
    ],
    [
        "Architectural overview illustrates Change Data Capture tailing the internal database write-ahead log in real time.",
        "Deep inspection monitors binary log sequence numbers and automated streaming directly into distributed topics.",
        "Comparative analysis demonstrates sub-millisecond streaming velocity over costly polling queries and index bloat.",
        "Verification confirms write-ahead log tailing, committed offset tracking, and asynchronous event streaming."
    ],
    [
        "Architectural overview displays idempotent consumer mechanics and message deduplication stores.",
        "Deep inspection evaluates unique message identifiers and atomic inbox checks suppressing redundant deliveries.",
        "Comparative analysis demonstrates guaranteed exactly-once processing semantics over duplicate side-effect bugs.",
        "Verification confirms duplicate message suppression, invariant preservation, and clean idempotent consumption."
    ],
    [
        "Architectural overview displays the production Change Data Capture pipeline telemetry and audit dashboard.",
        "Deep inspection monitors sub-ten millisecond write-ahead log streaming lag and zero dual-write error metrics.",
        "Comparative analysis demonstrates astronautical-grade consistency across databases and downstream stream consumers.",
        "Verification certifies total dual-write eradication, one hundred percent state parity, and production readiness."
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
            "title": f"Transactional Outbox & CDC: {p['title']}",
            "left": {
                "label": "Dual-Write Anti-Pattern",
                "content": [
                    "Database commits but message broker network call times out",
                    "Message broker accepts event but local database transaction deadlocks",
                    "Silent data divergence between core databases and downstream views",
                    "Requires costly offline manual reconciliations to fix balances"
                ]
            },
            "right": {
                "label": "Transactional Outbox & CDC Pipeline",
                "content": [
                    "Business data and outbox event commit in single local ACID transaction",
                    "Debezium tails binary database WAL with sub-ten millisecond latency",
                    "Kafka Connect guarantees durable at-least-once message streaming",
                    "Idempotent consumer deduplication guarantees exactly-once semantics"
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
            "leftLabel": "Dual-Write Anti-Pattern",
            "rightLabel": "Transactional Outbox & CDC Pipeline",
            "leftHighlights": [
                "Broker network call times out",
                "Local transaction deadlocks",
                "Silent data divergence",
                "Costly manual reconciliations"
            ],
            "rightHighlights": [
                "Single local ACID transaction",
                "Debezium tails binary WAL",
                "At-least-once streaming",
                "Idempotent consumer deduplication"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 39,
    "promptSha": hashlib.sha256(b"dist-day-39-transactional-outbox-change-data-capture-debezium").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-39.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
