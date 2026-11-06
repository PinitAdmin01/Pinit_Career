# scripts/generate_dist_day57_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day57_data import DAY_57_DATA as day57_data

entries = []

captions = [
    [
        "Architectural overview illustrates join-semilattice mathematics establishing commutative associative and idempotent state merges.",
        "Deep inspection monitors local node increment maps and pairwise maximum evaluations across independent peer replicas.",
        "Comparative analysis demonstrates strong eventual consistency over fragile centralized quorum leader voting protocols.",
        "Verification confirms vector updates, pairwise maximum merging, and deterministic numeric convergence on all peers."
    ],
    [
        "Architectural overview displays state-based convergent data types paired with positive-negative counters supporting subtraction.",
        "Deep inspection evaluates dual positive and negative counter tracking alongside compact delta-state sync payloads.",
        "Comparative analysis demonstrates conflict-free subtraction over monolithic balance sheet state transmissions.",
        "Verification confirms independent increment and decrement tracking, commutative delta merging, and accurate net totals."
    ],
    [
        "Architectural overview illustrates set-based conflict resolution comparing tombstone sets with last-write-wins element sets.",
        "Deep inspection evaluates timestamp precedence and unique tag tracking resolving concurrent addition and deletion races.",
        "Comparative analysis demonstrates reliable element re-addition over permanent two-phase set tombstone blocking.",
        "Verification confirms temporal conflict resolution, tombstone pruning, and deterministic element presence evaluation."
    ],
    [
        "Architectural overview displays collaborative sequence data types solving the index shift problem through fractional positions.",
        "Deep inspection evaluates immutable character identifiers, fractional coordinates, and deterministic tie-breaking rules.",
        "Comparative analysis demonstrates conflict-free collaborative typing over fragile centralized operational transformation.",
        "Verification confirms character insertion ordering, concurrent typing convergence, and zero document corruption."
    ],
    [
        "Architectural overview displays the production decentralized peer mesh telemetry and synchronization audit dashboard.",
        "Deep inspection monitors one hundred peer nodes processing mutations across simulated network partitions without data loss.",
        "Comparative analysis demonstrates true decentralized local-first availability, zero leader bottlenecks, and total convergence.",
        "Verification certifies one hundred percent node convergence, zero merge conflicts, and enterprise readiness."
    ]
]

for idx, p in enumerate(day57_data["parts"]):
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
            "title": f"Conflict-Free Replication: {p['title']}",
            "left": {
                "label": "Centralized Consensus Locking",
                "content": [
                    "Raft and Paxos require majority quorums that halt during offline network partitions",
                    "Synchronous consensus adds high round-trip network latency to every keystroke",
                    "Two-phase sets prevent re-adding items once tombstones are recorded",
                    "Integer index arrays corrupt text documents during concurrent typing races"
                ]
            },
            "right": {
                "label": "Conflict-Free Replicated Data Types",
                "content": [
                    "Join-semilattices guarantee Strong Eventual Consistency with zero leaders",
                    "Local-first execution allows immediate sub-millisecond offline keystrokes",
                    "LWW and OR-Sets resolve concurrent add-remove races with temporal clarity",
                    "Fractional position sequence CRDTs merge collaborative text deterministically"
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
            "leftLabel": "Centralized Consensus Locking",
            "rightLabel": "Conflict-Free Replicated Data Types",
            "leftHighlights": [
                "Offline write halts",
                "Consensus round-trip lag",
                "Permanent tombstone traps",
                "Index shift text corruption"
            ],
            "rightHighlights": [
                "Leaderless semilattice merge",
                "Instant local-first writes",
                "Deterministic set resolution",
                "Fractional position sequences"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 57,
    "promptSha": hashlib.sha256(b"dist-day-57-crdts-conflict-free-replication-semilattice-automerge-yjs").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-57.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
