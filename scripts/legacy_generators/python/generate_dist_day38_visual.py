# scripts/generate_dist_day38_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day38_data import DAY_38_DATA as day38_data

entries = []

captions = [
    [
        "Architectural overview illustrates the Saga pattern replacing distributed database locks with local commit sequences.",
        "Deep inspection monitors paired forward actions and compensating transactions preserving eventual business consistency.",
        "Comparative analysis demonstrates high throughput and immediate lock release over blocking two-phase commit protocols.",
        "Verification confirms configuration of long-lived transaction steps, local commits, and eventual consistency contracts."
    ],
    [
        "Architectural overview displays Choreography-based Sagas executing reactive event decoupling across domain services.",
        "Deep inspection monitors asynchronous domain event publication and reactive message handler triggers.",
        "Comparative analysis demonstrates autonomous service boundaries over fragile point-to-point synchronous RPC coupling.",
        "Verification confirms reactive event bus subscriptions, zero direct service coupling, and decoupled state progression."
    ],
    [
        "Architectural overview illustrates Orchestration-based Sagas driven by a centralized finite state machine coordinator.",
        "Deep inspection monitors durable execution logging, step command serialization, and failure detection telemetry.",
        "Comparative analysis demonstrates comprehensive end-to-end workflow visibility over fragmented choreography topologies.",
        "Verification confirms durable event logging, step execution tracking, and centralized workflow state management."
    ],
    [
        "Architectural overview displays semantic rollbacks executing idempotent compensating transactions in reverse sequence.",
        "Deep inspection monitors reverse compensation triggers and financial audit ledger immutability across cohorts.",
        "Comparative analysis demonstrates safe semantic undo operations over impossible physical database block rollbacks.",
        "Verification confirms reverse compensation order, pivot boundary safety, and certified semantic rollback completion."
    ],
    [
        "Architectural overview displays the production Saga workflow engine and telemetry dashboard under enterprise load.",
        "Deep inspection monitors sub-twenty millisecond execution latency and automated failure compensation handling.",
        "Comparative analysis demonstrates enterprise resilience and fault recovery under simulated downstream service failures.",
        "Verification certifies eventual business consistency, zero orphaned reservations, and full production readiness."
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
            "title": f"Distributed Saga Architecture: {p['title']}",
            "left": {
                "label": "Blocking Distributed ACID (2PC)",
                "content": [
                    "Exclusive row locks held across wide area network boundaries",
                    "Cascading wait queues collapsing transactional throughput",
                    "Indefinite liveness stalls during partial coordinator crashes",
                    "Unsuitable for long-running multi-stage business workflows"
                ]
            },
            "right": {
                "label": "The Saga Pattern (Eventual Consistency)",
                "content": [
                    "Local transactions commit immediately, releasing locks in milliseconds",
                    "Eventual consistency guaranteed through compensating transactions",
                    "High availability and fault isolation across microservice domains",
                    "Durable state orchestrators tracking long-lived business workflows"
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
            "leftLabel": "Blocking Distributed ACID (2PC)",
            "rightLabel": "The Saga Pattern (Eventual Consistency)",
            "leftHighlights": [
                "Exclusive row locks held",
                "Cascading wait queues",
                "Indefinite liveness stalls",
                "Unsuitable for long-running workflows"
            ],
            "rightHighlights": [
                "Local transactions commit immediately",
                "Eventual consistency guaranteed",
                "High availability and fault isolation",
                "Durable state orchestrators"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 38,
    "promptSha": hashlib.sha256(b"dist-day-38-saga-orchestration-choreography-compensation").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-38.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
