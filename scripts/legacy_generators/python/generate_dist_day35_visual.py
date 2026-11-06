# scripts/generate_dist_day35_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day35_data import DAY_35_DATA as day35_data

entries = []

captions = [
    [
        "Architectural overview illustrates the convergence of six foundational Raft subsystems under the cluster coordinator.",
        "Deep inspection monitors subsystem lifecycle initialization, health heartbeats, and actor mailbox event queues.",
        "Comparative analysis demonstrates unshakeable cluster resilience over fragile uncoordinated ad hoc consensus scripts.",
        "Verification confirms all six core subsystems online, active, and certified for enterprise production workloads."
    ],
    [
        "Architectural overview displays linearizable client read and write paths with in-memory leader lease acceleration.",
        "Deep inspection evaluates leader lease validity windows and clock drift guard margins preventing stale reads.",
        "Comparative analysis demonstrates sub-millisecond in-memory read throughput over costly write-ahead log append cycles.",
        "Verification confirms linearizable consistency, instantaneous memory retrieval, and zero stale read anomalies."
    ],
    [
        "Architectural overview illustrates the five-node chaos partition harness bisecting the cluster into isolated zones.",
        "Deep inspection monitors majority quorum authority and minority isolation under simulated network severance.",
        "Comparative analysis demonstrates total prevention of split-brain corruption through strict quorum threshold mathematics.",
        "Verification confirms minority write rejections, rapid automated healing, and complete state reconciliation."
    ],
    [
        "Architectural overview displays the distributed key-value state machine executing atomic multi-key transactions.",
        "Deep inspection evaluates monotonic revision tracking, optimistic concurrency controls, and client session caches.",
        "Comparative analysis demonstrates guaranteed transactional atomicity over partial dirty read state modifications.",
        "Verification confirms simultaneous balance updates, deterministic state transitions, and zero lost updates."
    ],
    [
        "Architectural overview displays the Milestone Seven Capstone telemetry dashboard under high enterprise workload.",
        "Deep inspection monitors one hundred thousand transactions, sub-ten millisecond latency, and rapid failover.",
        "Comparative analysis demonstrates astronautical-grade fault tolerance over fragile uncertified distributed systems.",
        "Verification confirms one hundred percent state parity, zero split-brain, and full Milestone Seven certification."
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
            "title": f"Milestone 7 Capstone Engine: {p['title']}",
            "left": {
                "label": "Fragile Ad-Hoc Consensus Architectures",
                "content": [
                    "Split-brain data corruption during minor network partitions",
                    "Stale read anomalies returning obsolete client balances",
                    "Uncoordinated membership swaps causing permanent cluster death",
                    "Partial dirty writes and lost updates under crash-recovery"
                ]
            },
            "right": {
                "label": "Milestone 7 Production Raft Engine",
                "content": [
                    "Unified 6-pillar consensus architecture with coordinator supervision",
                    "Linearizable client reads accelerated via in-memory leader leases",
                    "Automated 5-node chaos harness proving zero split-brain resilience",
                    "Atomic multi-key KV state machine with 100% state parity"
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
            "leftLabel": "Fragile Ad-Hoc Consensus Architectures",
            "rightLabel": "Milestone 7 Production Raft Engine",
            "leftHighlights": [
                "Split-brain data corruption",
                "Stale read anomalies",
                "Uncoordinated membership swaps",
                "Partial dirty writes"
            ],
            "rightHighlights": [
                "Unified 6-pillar consensus",
                "Linearizable client reads",
                "Automated 5-node chaos harness",
                "Atomic multi-key KV state machine"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "day": 35,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-35.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
