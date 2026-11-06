# scripts/generate_dist_day55_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day55_data import DAY_55_DATA as day55_data

entries = []

captions = [
    [
        "Architectural overview illustrates the autonomic closed-loop control architecture unifying observability and adaptive actuation.",
        "Deep inspection monitors the continuous cycle evaluating real-time telemetry signals to plan and execute remediations.",
        "Comparative analysis demonstrates autonomous sub-second self-healing over slow panicked human incident bridge calls.",
        "Verification confirms telemetry evaluation, adaptive action triggering, and closed-loop equilibrium restoration."
    ],
    [
        "Architectural overview displays real-time telemetry fusion correlating OpenMetrics exemplars with distributed trace spans.",
        "Deep inspection evaluates instant transitions from histogram latency spikes to microscopic call tree waterfalls.",
        "Comparative analysis demonstrates immediate root cause identification over hours of disjointed log search frustration.",
        "Verification confirms exemplar trace correlation, diagnostic bundle synthesis, and predictive error budget burn tracking."
    ],
    [
        "Architectural overview illustrates dynamic service mesh routing shifting traffic away from degraded canary pods in milliseconds.",
        "Deep inspection evaluates automatic outlier detection, weight rebalancing, and graceful in-flight connection draining.",
        "Comparative analysis demonstrates zero-loss blast-radius containment over sluggish DNS failover propagation delays.",
        "Verification confirms failing endpoint isolation, healthy endpoint rebalancing, and zero dropped user requests."
    ],
    [
        "Architectural overview displays progressive autonomous remediation escalating across circuit breaking, restarts, and scaling.",
        "Deep inspection evaluates execution of automated runbooks restoring compromised service pods without human intervention.",
        "Comparative analysis demonstrates systematic algorithmic healing over error-prone manual operator command execution.",
        "Verification confirms progressive remediation plan generation, container cycling, and horizontal scale-out acceleration."
    ],
    [
        "Architectural overview displays the grand Milestone Capstone autonomous self-healing observability and chaos audit dashboard.",
        "Deep inspection monitors one hundred thousand requests per second under simultaneous latency, drop, and eviction chaos.",
        "Comparative analysis demonstrates planetary cloud-native excellence, total resilience, and unshakeable service availability.",
        "Verification certifies three hundred eighty millisecond recovery, zero human intervention, and capstone certification."
    ]
]

for idx, p in enumerate(day55_data["parts"]):
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
            "title": f"Milestone Capstone: {p['title']}",
            "left": {
                "label": "Manual Reactive Operations",
                "content": [
                    "Fractured observability across disconnected metric and trace silos",
                    "Slow human response to catastrophic cascading outages in production",
                    "Shallow health checks route traffic to zombie containers",
                    "Manual runbook execution is slow, inconsistent, and error-prone"
                ]
            },
            "right": {
                "label": "Autonomous Self-Healing Mesh",
                "content": [
                    "Closed-loop autonomic control executes sub-second remediation",
                    "Telemetry fusion binds distributed traces directly to metric spikes",
                    "Envoy xDS route shifting isolates failing pods in zero milliseconds",
                    "Progressive automated remediation heals degraded tiers autonomously"
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
            "leftLabel": "Manual Reactive Operations",
            "rightLabel": "Autonomous Self-Healing Mesh",
            "leftHighlights": [
                "Fractured telemetry silos",
                "Panicked human triage",
                "Traffic to zombie nodes",
                "Slow manual runbooks"
            ],
            "rightHighlights": [
                "Closed-loop control",
                "Fused trace exemplars",
                "Sub-millisecond xDS shift",
                "Autonomous remediation"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 55,
    "promptSha": hashlib.sha256(b"dist-day-55-milestone-11-capstone-autonomous-self-healing-observability-mesh").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-55.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
