# scripts/generate_dist_day51_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day51_data import DAY_51_DATA as day51_data

entries = []

captions = [
    [
        "Architectural overview illustrates distributed tracing data models uniting spans into directed acyclic call graphs.",
        "Deep inspection monitors parent identifier relationships, span timestamps, and microservice execution hierarchies.",
        "Comparative analysis demonstrates full transactional visibility over fragmented uncoordinated server log files.",
        "Verification confirms trace identifier propagation, child span parent linkage, and call tree DAG construction."
    ],
    [
        "Architectural overview displays the standard context propagation format structuring traceparent across microservices.",
        "Deep inspection evaluates header validation, hexadecimal trace coordinates, and distributed baggage injection.",
        "Comparative analysis demonstrates global cross-vendor interoperability over brittle proprietary tracing headers.",
        "Verification confirms valid header parsing, trace coordinate preservation, and cross-service context propagation."
    ],
    [
        "Architectural overview illustrates the batch span processor decoupling tracing serialization from request threads.",
        "Deep inspection evaluates thread-safe ring buffering and background threshold flushes transmitting compressed batches.",
        "Comparative analysis demonstrates zero request latency degradation alongside bounded memory leak protection.",
        "Verification confirms buffer capacity triggers, background batch exports, and zero application thread pauses."
    ],
    [
        "Architectural overview displays intelligent tail-based sampling capturing one hundred percent of anomalies and errors.",
        "Deep inspection evaluates collector memory buffers inspecting completed traces for error flags and latency outliers.",
        "Comparative analysis demonstrates massive cloud storage savings alongside uncompromised failure diagnostic visibility.",
        "Verification confirms error detection sampling triggers, latency threshold evaluation, and healthy trace pruning."
    ],
    [
        "Architectural overview displays the production distributed tracing telemetry and critical path analysis dashboard.",
        "Deep inspection monitors millions of spans, tail sampling retention rates, and latency waterfall breakdowns.",
        "Comparative analysis demonstrates immediate bottleneck identification over hours of manual log correlation.",
        "Verification certifies four hundred sixty millisecond tail latency, bottleneck isolation, and production readiness."
    ]
]

for idx, p in enumerate(day51_data["parts"]):
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
            "title": f"Distributed Tracing: {p['title']}",
            "left": {
                "label": "Fragmented Microservice Logging",
                "content": [
                    "Isolated log files with independent server clocks create blind spots",
                    "No correlation identifiers across asynchronous microservice RPC hops",
                    "Synchronous tracing calls add latency to every user request",
                    "Head-based sampling drops critical rare errors and latency outliers"
                ]
            },
            "right": {
                "label": "W3C TraceContext & OpenTelemetry",
                "content": [
                    "Unified trace identifiers link all operations into a coherent call DAG",
                    "Standard W3C traceparent headers propagate context across clouds",
                    "BatchSpanProcessor buffers spans and flushes asynchronously via OTLP",
                    "Tail-based sampling captures all errors while discarding healthy data"
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
            "leftLabel": "Fragmented Microservice Logging",
            "rightLabel": "W3C TraceContext & OpenTelemetry",
            "leftHighlights": [
                "Disconnected log silos",
                "Zero RPC correlation",
                "Synchronous export latency",
                "Lost error traces"
            ],
            "rightHighlights": [
                "Coherent call graph DAG",
                "Universal W3C standard",
                "Asynchronous batch flushes",
                "Total error capture"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 51,
    "promptSha": hashlib.sha256(b"dist-day-51-distributed-tracing-w3c-tracecontext-opentelemetry-spans").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-51.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
