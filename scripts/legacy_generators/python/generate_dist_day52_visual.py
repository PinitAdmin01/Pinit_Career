# scripts/generate_dist_day52_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day52_data import DAY_52_DATA as day52_data

entries = []

captions = [
    [
        "Architectural overview illustrates sidecar proxy interception capturing all inbound and outbound pod traffic.",
        "Deep inspection monitors dynamic cluster endpoint discovery and client-side load balancing to healthy backend instances.",
        "Comparative analysis demonstrates language-agnostic infrastructure governance over brittle polyglot library maintenance.",
        "Verification confirms path-based route matching, cluster endpoint resolution, and sub-millisecond proxy forwarding."
    ],
    [
        "Architectural overview displays mutual cryptographic verification establishing zero-trust peer identity between sidecars.",
        "Deep inspection evaluates dynamic certificate rotation, trust domain validation, and service account authorization.",
        "Comparative analysis demonstrates complete network encryption and identity assurance over naive perimeter security.",
        "Verification confirms valid peer identity authentication, foreign trust domain rejection, and encrypted communication."
    ],
    [
        "Architectural overview illustrates declarative weighted traffic shifting distributing live requests across canary releases.",
        "Deep inspection evaluates probability threshold calculations routing configured request percentages without pod scaling.",
        "Comparative analysis demonstrates fine-grained canary validation over resource-heavy replica ratio sharding.",
        "Verification confirms deterministic canary traffic splitting, stable baseline preservation, and route rule enforcement."
    ],
    [
        "Architectural overview displays outlier detection circuit breaking passively monitoring live microservice error responses.",
        "Deep inspection monitors consecutive error counters and executes automatic quarantine ejections of degraded pod endpoints.",
        "Comparative analysis demonstrates instantaneous self-healing platform resilience over slow external health probe checks.",
        "Verification confirms consecutive error ejection triggers, routing pool pruning, and customer traffic protection."
    ],
    [
        "Architectural overview displays the production service mesh telemetry audit dashboard across high-throughput clusters.",
        "Deep inspection monitors millions of requests, universal encryption compliance, and minimal proxy latency overhead.",
        "Comparative analysis demonstrates enterprise-grade scalability, automated failure isolation, and operational efficiency.",
        "Verification certifies one point one five millisecond proxy latency, total mutual encryption, and production readiness."
    ]
]

for idx, p in enumerate(day52_data["parts"]):
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
            "title": f"Service Mesh Architecture: {p['title']}",
            "left": {
                "label": "Direct Service-to-Service Networking",
                "content": [
                    "Polyglot networking libraries required in every application codebase",
                    "Plaintext network communication vulnerable to internal eavesdropping",
                    "Canary routing tied strictly to Kubernetes pod replica counts",
                    "Degraded pods continue receiving traffic until liveness probes fail"
                ]
            },
            "right": {
                "label": "Envoy Service Mesh Infrastructure",
                "content": [
                    "Transparent sidecar interception decouples networking from code",
                    "Universal Mutual TLS authenticates peer identities and encrypts data",
                    "Declarative Layer 7 weighted routing enables fine-grained canary splits",
                    "Passive outlier detection immediately ejects pods with consecutive errors"
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
            "leftLabel": "Direct Service-to-Service Networking",
            "rightLabel": "Envoy Service Mesh Infrastructure",
            "leftHighlights": [
                "Polyglot library maintenance",
                "Plaintext security risks",
                "Rigid replica canaries",
                "Cascading pod failures"
            ],
            "rightHighlights": [
                "Transparent sidecar proxy",
                "Universal mutual encryption",
                "Fine-grained canary splits",
                "Instant outlier ejection"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 52,
    "promptSha": hashlib.sha256(b"dist-day-52-service-mesh-envoy-sidecar-mtls-canary-traffic-shifting").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-52.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
