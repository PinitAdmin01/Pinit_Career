# scripts/generate_dist_day45_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day45_data import DAY_45_DATA as day45_data

entries = []

captions = [
    [
        "Architectural overview illustrates the multi-tier hierarchy integrating in-process heap with distributed clusters.",
        "Deep inspection monitors microsecond memory lookups and seamless backfill propagation upon cluster and database fetches.",
        "Comparative analysis demonstrates nanosecond edge velocity over latency-constrained remote-only cache architectures.",
        "Verification confirms fifty percent initial hits on repeated reads, rapid fallback handling, and backfill integrity."
    ],
    [
        "Architectural overview displays the consistent hashing ring router directing traffic across virtual node tokens.",
        "Deep inspection evaluates binary search ring traversal mapping keys to specific cluster nodes in microsecond intervals.",
        "Comparative analysis demonstrates resilient cluster elasticity and minimal churn over fragile static sharding.",
        "Verification confirms one hundred fifty virtual tokens, deterministic node mappings, and sub-ten microsecond lookups."
    ],
    [
        "Architectural overview illustrates the probabilistic XFetch engine mitigating catastrophic cache stampede avalanches.",
        "Deep inspection evaluates exponential threshold calculations triggering early background refreshes before key expiration.",
        "Comparative analysis demonstrates continuous cache availability over blocking mutex locks and database connection crashes.",
        "Verification confirms early background refreshes for near-expiry records and continuous cache hits for concurrent clients."
    ],
    [
        "Architectural overview displays the dual-threshold Write-Behind buffer queue coalescing mutations before database flushing.",
        "Deep inspection monitors buffer capacity triggers and periodic debounce timers initiating atomic batch disk operations.",
        "Comparative analysis demonstrates massive database IOPS reduction alongside sub-millisecond client write acknowledgments.",
        "Verification confirms automatic flush triggers upon capacity threshold, zero pending items, and batched write integrity."
    ],
    [
        "Architectural overview displays the Milestone Capstone production multi-tier cache telemetry audit dashboard.",
        "Deep inspection monitors over ninety-two percent memory hits, ninety-nine percent cluster hits, and sub-millisecond latencies.",
        "Comparative analysis demonstrates world-class enterprise scalability, zero cache stampedes, and extreme cloud efficiency.",
        "Verification certifies four hundred twenty microsecond tail latency, zero stampedes, and full production certification."
    ]
]

for idx, p in enumerate(day45_data["parts"]):
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
            "title": f"Production Multi-Tier Cache Engine: {p['title']}",
            "left": {
                "label": "Naive Single-Tier Caching",
                "content": [
                    "Single remote cache layer constrained by network interface latency floor",
                    "Hard TTL cliffs triggering catastrophic concurrent database stampedes",
                    "Synchronous writes serializing transactions and throttling cluster throughput",
                    "Severe cache churn and database saturation during sudden traffic surges"
                ]
            },
            "right": {
                "label": "Production Multi-Tier Distributed Engine",
                "content": [
                    "In-process heap cache serving hot keys in tens of nanoseconds",
                    "Probabilistic XFetch algorithm pre-warming records prior to expiration",
                    "Dual-threshold Write-Behind buffer coalescing writes and slashing IOPS",
                    "Consistent hash ring with virtual nodes enabling elastic zero-churn scaling"
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
            "leftLabel": "Naive Single-Tier Caching",
            "rightLabel": "Production Multi-Tier Distributed Engine",
            "leftHighlights": [
                "Network latency floor",
                "Catastrophic stampedes",
                "Synchronous write bottlenecks",
                "Severe database saturation"
            ],
            "rightHighlights": [
                "Nanosecond heap cache",
                "Probabilistic XFetch pre-warming",
                "Dual-threshold Write-Behind",
                "Sub-millisecond tail latencies"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 45,
    "promptSha": hashlib.sha256(b"dist-day-45-milestone-9-capstone-multi-tier-cache-engine").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-45.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
