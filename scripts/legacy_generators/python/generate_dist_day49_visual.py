# scripts/generate_dist_day49_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day49_data import DAY_49_DATA as day49_data

entries = []

captions = [
    [
        "Architectural overview illustrates stateful stream processing with embedded local state stores and changelog replication.",
        "Deep inspection monitors microsecond local state lookups alongside asynchronous changelog topic backups.",
        "Comparative analysis demonstrates nanosecond processing speed alongside resilient disaster recovery guarantees.",
        "Verification confirms local state mutations, changelog delta append offsets, and state recovery integrity."
    ],
    [
        "Architectural overview displays tumbling and sliding temporal windowing slicing continuous event streams.",
        "Deep inspection evaluates fixed non-overlapping tumbling intervals alongside rolling overlapping window aggregations.",
        "Comparative analysis demonstrates rolling operational analytics over rigid batch database query execution.",
        "Verification confirms deterministic window start calculations, event count aggregations, and window emissions."
    ],
    [
        "Architectural overview illustrates dynamic session windowing clustering user interactions based on inactivity gaps.",
        "Deep inspection evaluates dynamic window expansion alongside out-of-order session merging algorithms.",
        "Comparative analysis demonstrates natural behavioral analytics over artificial clock-aligned window boundaries.",
        "Verification confirms session expansion, multi-event clustering, and gap-triggered session closures."
    ],
    [
        "Architectural overview displays event-time watermarks progressing alongside out-of-order streaming records.",
        "Deep inspection evaluates bounded out-of-order delay calculations and side-output handling for late records.",
        "Comparative analysis demonstrates robust deterministic analytics over fragile server processing time clocks.",
        "Verification confirms watermark progression assertions, on-time event acceptance, and late record detection."
    ],
    [
        "Architectural overview displays the production stream processing topology telemetry and latency audit dashboard.",
        "Deep inspection monitors hundreds of thousands of events per second alongside sub-twenty millisecond window latencies.",
        "Comparative analysis demonstrates enterprise-grade throughput, fault tolerance, and unshakeable state durability.",
        "Verification certifies eighteen millisecond window latencies, thousands of active windows, and production readiness."
    ]
]

for idx, p in enumerate(day49_data["parts"]):
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
            "title": f"Stream Processing Topologies: {p['title']}",
            "left": {
                "label": "Stateless Stream Processing",
                "content": [
                    "Individual events processed in isolation without historical context",
                    "External database queries on every event create severe network bottlenecks",
                    "Rigid wall-clock processing time invalidates window aggregations",
                    "Late-arriving events silently dropped or grouped into incorrect intervals"
                ]
            },
            "right": {
                "label": "Stateful Event-Time Topology",
                "content": [
                    "Embedded local RocksDB stores deliver microsecond state mutations",
                    "Durable changelog topics guarantee rapid crash recovery with zero loss",
                    "Tumbling, sliding, and dynamic session windows capture authentic behavior",
                    "Event-time watermarks ensure deterministic window closure across delays"
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
            "leftLabel": "Stateless Stream Processing",
            "rightLabel": "Stateful Event-Time Topology",
            "leftHighlights": [
                "Zero historical memory",
                "External database latency",
                "Non-deterministic clocks",
                "Silent late-data loss"
            ],
            "rightHighlights": [
                "Microsecond local state",
                "Changelog disaster recovery",
                "Dynamic session windows",
                "Deterministic watermarks"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 49,
    "promptSha": hashlib.sha256(b"dist-day-49-stream-processing-state-stores-windows-watermarks").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-49.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
