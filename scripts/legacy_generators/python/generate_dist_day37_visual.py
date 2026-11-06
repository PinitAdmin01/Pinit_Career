# scripts/generate_dist_day37_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day37_data import DAY_37_DATA as day37_data

entries = []

captions = [
    [
        "Architectural overview illustrates Skeen Non-Blocking atomic commitment state transition rules across cohorts.",
        "Deep inspection monitors intermediate state decoupling ensuring no direct transitions between commit and abort.",
        "Comparative analysis demonstrates non-blocking liveness over classic two-phase commit coordinator lockups.",
        "Verification confirms state graph compliance, unilateral abort capability, and non-blocking safety invariants."
    ],
    [
        "Architectural overview displays PreCommit phase coordination collecting unanimous second-order knowledge across nodes.",
        "Deep inspection monitors participant acknowledgments validating that all cohorts voted affirmatively in advance.",
        "Comparative analysis demonstrates elimination of epistemic uncertainty over vulnerable direct two-phase commits.",
        "Verification confirms PreCommit acknowledgment collection, irreversible progress guarantees, and clean commit execution."
    ],
    [
        "Architectural overview illustrates the Three-Phase Commit timeout transition matrix across distributed followers.",
        "Deep inspection evaluates autonomous state transitions resolving coordinator crashes without indefinite stalls.",
        "Comparative analysis demonstrates deterministic fail-safe recovery over human intervention and terminal lockouts.",
        "Verification confirms prepared nodes safely aborting while precommitted nodes autonomously commit on timeout."
    ],
    [
        "Architectural overview displays the fatal Three-Phase Commit split-brain divergence under network partitions.",
        "Deep inspection monitors isolated partition segments executing contradictory autonomous commit and abort choices.",
        "Comparative analysis demonstrates profound partition vulnerability over modern majority quorum consensus.",
        "Verification confirms detection of state divergence hazards and highlights the necessity of quorum consensus."
    ],
    [
        "Architectural overview displays the production Three-Phase Commit distributed transaction engine and telemetry dashboard.",
        "Deep inspection monitors three round trip latencies and crash safety scores across multiple database replicas.",
        "Comparative analysis demonstrates non-blocking execution efficiency under stable local datacenter networks.",
        "Verification certifies complete transaction resolution, zero coordinator lockups, and full production readiness."
    ]
]

for idx, p in enumerate(day37_data["parts"]):
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
            "title": f"Non-Blocking Atomic Commitment: {p['title']}",
            "left": {
                "label": "Blocking Two-Phase Commit",
                "content": [
                    "Direct transitions from prepared to commit or abort states",
                    "Indefinite lockups when coordinator crashes in prepared state",
                    "Persistent database lock contention blocking concurrent traffic",
                    "Manual administrator intervention required to unlock tables"
                ]
            },
            "right": {
                "label": "Three-Phase Commit Protocol",
                "content": [
                    "Intermediate PreCommit phase eliminating epistemic uncertainty",
                    "Deterministic timeout matrix resolving crashes autonomously",
                    "Non-blocking liveness guaranteeing rapid lock release",
                    "Strict Skeen state transition compliance across all cohorts"
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
            "leftLabel": "Blocking Two-Phase Commit",
            "rightLabel": "Three-Phase Commit Protocol",
            "leftHighlights": [
                "Direct transitions to commit/abort",
                "Indefinite coordinator lockups",
                "Persistent lock contention",
                "Manual administrator intervention"
            ],
            "rightHighlights": [
                "Intermediate PreCommit phase",
                "Deterministic timeout matrix",
                "Non-blocking liveness",
                "Strict Skeen compliance"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 37,
    "promptSha": hashlib.sha256(b"dist-day-37-three-phase-commit-non-blocking").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-37.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
