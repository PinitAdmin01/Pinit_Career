# scripts/generate_dist_day50_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day50_data import DAY_50_DATA as day50_data

entries = []

captions = [
    [
        "Architectural overview illustrates the four-tier streaming analytics architecture synthesizing ingestion and processing.",
        "Deep inspection monitors in-memory buffering, tumbling window bucketing, and atomic window state finalization.",
        "Comparative analysis demonstrates sub-second streaming insights over slow historical batch database queries.",
        "Verification confirms event ingestion, window sum aggregations, and committed window persistence without memory leaks."
    ],
    [
        "Architectural overview displays replicated append-only logs enforcing quorum replication across follower replicas.",
        "Deep inspection evaluates leader offset progression and high watermark advancement upon quorum acknowledgment.",
        "Comparative analysis demonstrates zero data loss upon broker failover alongside zero-copy network streaming velocity.",
        "Verification confirms leader offset progression, follower synchronization quorums, and committed high watermarks."
    ],
    [
        "Architectural overview illustrates cooperative group coordination distributing partitions with zero stop-the-world pauses.",
        "Deep inspection evaluates incremental two-phase partition migrations and monotonic generation identifier fencing.",
        "Comparative analysis demonstrates uninterrupted processing during rolling container updates over legacy eager freezes.",
        "Verification confirms balanced partition allocation, generation epoch protection, and continuous stream consumption."
    ],
    [
        "Architectural overview displays stateful event-time windowing with embedded local state stores and watermark barriers.",
        "Deep inspection evaluates watermark progression triggering window closure alongside late-arriving event handling.",
        "Comparative analysis demonstrates deterministic temporal analytics alongside atomic exactly-once commit loops.",
        "Verification confirms on-time event aggregation, watermark-triggered window emissions, and late data isolation."
    ],
    [
        "Architectural overview displays the Milestone Capstone production stream analytics telemetry and chaos audit dashboard.",
        "Deep inspection monitors ten million events processed with zero duplicate records and sub-thirty millisecond latency.",
        "Comparative analysis demonstrates planetary enterprise throughput, unshakeable fault tolerance, and absolute data parity.",
        "Verification certifies twenty-four millisecond tail latency, zero duplicates, and full production certification."
    ]
]

for idx, p in enumerate(day50_data["parts"]):
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
            "title": f"Production Stream Analytics Engine: {p['title']}",
            "left": {
                "label": "Legacy Batch Processing Architecture",
                "content": [
                    "Hours of latency between event occurrence and batch query insights",
                    "External database queries create severe network choke points",
                    "Stop-the-world rebalance freezes halt processing during container scaling",
                    "At-least-once retries create duplicate transactions and financial skew"
                ]
            },
            "right": {
                "label": "Production Exactly-Once Stream Platform",
                "content": [
                    "Sub-second real-time event ingestion and rolling window analytics",
                    "Embedded RocksDB state stores eliminate network round-trip bottlenecks",
                    "Cooperative Sticky rebalances complete in milliseconds without pausing",
                    "Transactional exactly-once loops eradicate duplicate records and data loss"
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
            "leftLabel": "Legacy Batch Processing Architecture",
            "rightLabel": "Production Exactly-Once Stream Platform",
            "leftHighlights": [
                "Hours of batch delay",
                "External database bottlenecks",
                "Stop-the-world freezes",
                "Duplicate records on retry"
            ],
            "rightHighlights": [
                "Sub-second event analytics",
                "Embedded RocksDB stores",
                "Cooperative rebalancing",
                "True exactly-once parity"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 50,
    "promptSha": hashlib.sha256(b"dist-day-50-milestone-10-capstone-exactly-once-stream-analytics-engine").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-50.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
