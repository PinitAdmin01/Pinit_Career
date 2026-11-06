# scripts/generate_dist_day53_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day53_data import DAY_53_DATA as day53_data

entries = []

captions = [
    [
        "Architectural overview illustrates Prometheus metric primitives recording counters gauges and cumulative histogram distributions.",
        "Deep inspection monitors monotonic counter increments, fluctuating gauge levels, and cumulative bucket observations.",
        "Comparative analysis demonstrates statistical telemetry precision over unaggregated raw request logging.",
        "Verification confirms counter increments, gauge updates, and cumulative histogram bucket distributions."
    ],
    [
        "Architectural overview displays the mathematical fallacy of average latency alongside histogram quantile estimation.",
        "Deep inspection evaluates target percentile ranks and linear interpolation across discrete histogram bucket boundaries.",
        "Comparative analysis demonstrates accurate tail latency detection over deceptive arithmetic averages.",
        "Verification confirms bucket boundary identification, linear interpolation, and quantile estimation accuracy."
    ],
    [
        "Architectural overview illustrates the pull-based scraping model and OpenMetrics plaintext exposition standard.",
        "Deep inspection evaluates HTTP metrics scraping, help documentation strings, type definitions, and label dimensions.",
        "Comparative analysis demonstrates bounded collector overhead over chaotic push-based telemetry network storms.",
        "Verification confirms compliant OpenMetrics line formatting, multi-label serialization, and scrape reliability."
    ],
    [
        "Architectural overview displays PromQL vector querying, range buffer evaluation, and per-second rate calculations.",
        "Deep inspection evaluates counter reset detection, time delta division, and multi-service vector aggregation.",
        "Comparative analysis demonstrates dynamic traffic throughput velocity over static cumulative counter numbers.",
        "Verification confirms counter reset compensation, per-second rate calculation, and vector grouping accuracy."
    ],
    [
        "Architectural overview displays the production Prometheus metrics grid and time-series telemetry audit dashboard.",
        "Deep inspection monitors high-throughput scrape ingestion, gorilla TSDB compression, and sub-fifty millisecond queries.",
        "Comparative analysis demonstrates planetary telemetry scale, uncompromised cardinality controls, and flawless alerting.",
        "Verification certifies five hundred thousand samples per second, high compression, and production certification."
    ]
]

for idx, p in enumerate(day53_data["parts"]):
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
            "title": f"Prometheus Metrics & PromQL: {p['title']}",
            "left": {
                "label": "Legacy Push-Based Logging",
                "content": [
                    "Push storms overwhelm monitoring servers during traffic surges",
                    "Arithmetic average latencies mask critical tail-latency spikes",
                    "Parsing unstructured log files is computationally prohibitive",
                    "High label cardinality crashes unindexed time-series databases"
                ]
            },
            "right": {
                "label": "Prometheus Time-Series Engine",
                "content": [
                    "Pull-based scraping strictly rate-limits monitoring overhead",
                    "Histograms and linear interpolation compute accurate p99 quantiles",
                    "PromQL rate() computes instantaneous per-second derivatives",
                    "Gorilla double-delta compression shrinks storage footprint"
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
            "leftLabel": "Legacy Push-Based Logging",
            "rightLabel": "Prometheus Time-Series Engine",
            "leftHighlights": [
                "Unbounded push storms",
                "Misleading latency averages",
                "Prohibitive log parsing",
                "Storage exhaustion"
            ],
            "rightHighlights": [
                "Bounded pull scraping",
                "Accurate quantile interpolation",
                "Instant rate derivatives",
                "Gorilla TSDB compression"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 53,
    "promptSha": hashlib.sha256(b"dist-day-53-prometheus-metrics-time-series-promql-aggregation").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-53.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
