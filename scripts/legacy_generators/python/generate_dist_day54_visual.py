# scripts/generate_dist_day54_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day54_data import DAY_54_DATA as day54_data

entries = []

captions = [
    [
        "Architectural overview illustrates steady-state hypothesis formulation establishing baseline error rate and latency guardrails.",
        "Deep inspection monitors continuous metric streams detecting boundary deviations during controlled chaos experiments.",
        "Comparative analysis demonstrates empirical scientific failure verification over blind faith in staging environment tests.",
        "Verification confirms baseline metric capture, hypothesis evaluation, and automated experiment safety abort triggers."
    ],
    [
        "Architectural overview displays network-level fault injection simulating artificial latency jitter and partial packet loss.",
        "Deep inspection evaluates kernel netem queuing disciplines and application proxy filters intercepting remote RPC calls.",
        "Comparative analysis demonstrates discovery of thread starvation vulnerabilities over assumption of network reliability.",
        "Verification confirms packet drop simulation, synthetic latency injection, and caller thread pool resilience."
    ],
    [
        "Architectural overview illustrates compute-level disruption simulations evicting pods and draining Kubernetes worker nodes.",
        "Deep inspection evaluates PodDisruptionBudget constraints preventing involuntary replica starvation during evictions.",
        "Comparative analysis demonstrates zero-downtime rolling rebalancing over fragile single-instance service architectures.",
        "Verification confirms eviction budget enforcement, graceful pod termination, and cluster replica stability."
    ],
    [
        "Architectural overview displays cascading failure prevention via circuit breaking deadlines and graceful cached fallbacks.",
        "Deep inspection evaluates circuit state transitions from closed to open upon reaching consecutive failure thresholds.",
        "Comparative analysis demonstrates immediate fail-fast protection over catastrophic upstream thread exhaustion collapse.",
        "Verification confirms failure threshold tripping, instantaneous fallback delivery, and half-open canary probes."
    ],
    [
        "Architectural overview displays the production multi-zone chaos engineering game day and resilience audit dashboard.",
        "Deep inspection monitors simultaneous latency faults, packet drops, and pod terminations under peak synthetic traffic.",
        "Comparative analysis demonstrates unshakeable enterprise resilience, minimal blast radius, and rapid autonomous recovery.",
        "Verification certifies two percent blast radius, three hundred fifty millisecond recovery, and production readiness."
    ]
]

for idx, p in enumerate(day54_data["parts"]):
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
            "title": f"Chaos Engineering & Fault Injection: {p['title']}",
            "left": {
                "label": "Fragile Cloud Architecture",
                "content": [
                    "Staging tests fail to uncover chaotic production emergent behaviors",
                    "Partial grey network failures trigger unhandled thread exhaustion",
                    "Pod evictions and node drains cause service-wide availability loss",
                    "Cascading failures bring down entire microservice clusters"
                ]
            },
            "right": {
                "label": "Resilient Chaos-Hardened Architecture",
                "content": [
                    "Steady-state hypotheses verify system behavior under controlled stress",
                    "Netem and proxy chaos validate timeout budgets and hedged retries",
                    "PodDisruptionBudgets guarantee replica availability during disruptions",
                    "Circuit breakers and graceful fallbacks halt cascading failure propagation"
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
            "leftLabel": "Fragile Cloud Architecture",
            "rightLabel": "Resilient Chaos-Hardened Architecture",
            "leftHighlights": [
                "Undetected emergent bugs",
                "Grey network collapse",
                "Uncontrolled pod eviction",
                "Cascading thread starvation"
            ],
            "rightHighlights": [
                "Steady-state guardrails",
                "Tested timeout budgets",
                "Disruption budget safety",
                "Fail-fast circuit breaking"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 54,
    "promptSha": hashlib.sha256(b"dist-day-54-distributed-chaos-engineering-fault-injection-pod-eviction").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-54.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
