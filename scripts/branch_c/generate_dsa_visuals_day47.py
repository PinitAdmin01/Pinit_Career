# scripts/branch_c/generate_dsa_visuals_day47.py
import json
import hashlib
import os

with open("scripts/branch_c/day47_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Advanced data structures establish algorithmic optimization foundations.",
        "say2": "Soviet computer scientist introduced revolutionary maximum flow algorithm.",
        "example": "Metropolitan data centers model optical transport networks with fiber.",
        "tryIt": "Examine typescript code constructing level graph builder queue traversal."
    },
    # Part 2
    {
        "say1": "Algorithmic machinery dissects phases combining level assignment search.",
        "say2": "Level graph transitions extracting blocking flow across directed paths.",
        "example": "Regional cloud transit exchange routes data flows across centers.",
        "tryIt": "Examine typescript code alternating between breadth first search passes."
    },
    # Part 3
    {
        "say1": "Specialized network topologies accelerate unit capacity networks analysis.",
        "say2": "Combinatorial geometry accelerates unit flows across successive phases.",
        "example": "Course scheduling system matches students to laboratory workstations.",
        "tryIt": "Examine typescript code tracing bipartite matching benchmark network."
    },
    # Part 4
    {
        "say1": "Production grade flow engines separate theoretical implementation rules.",
        "say2": "Current arc optimization maintains index array for admissible edges.",
        "example": "Dense telecommunications network connects parallel fiber channels.",
        "tryIt": "Examine typescript code comparing edge traversal evaluations."
    },
    # Part 5
    {
        "say1": "Enterprise infrastructure engine implements optical switch controller.",
        "say2": "Software defined optical controller provisions dynamic lightpaths.",
        "example": "Transcontinental optical fiber network connects regional switching hubs.",
        "tryIt": "Explore optical switch engine class registering wavelength channels."
    }
]

titles = [
    "Residual Network Hop Distance Level Layering Graph.",
    "Blocking Flow Multi Path Augmentation Dynamics.",
    "Unit Capacity Geometric Bound Phase Analysis.",
    "Current Arc Pointer Optimization Efficiency Matrix.",
    "Optical Carrier Wavelength Switch Provisioning Table."
]

columns_list = [
    ["Level Layer Tier", "Residual Admissibility Rule", "DAG Traversal Property"],
    ["Algorithmic Phase Step", "Search Traversal Method", "Network Saturation Impact"],
    ["Network Architecture Model", "Theoretical Phase Bound", "Worst Case Time Complexity"],
    ["Traversal Optimization Mode", "Adjacency Scan Strategy", "Redundant Edge Evaluations"],
    ["Regional Optical Node", "Wavelength Allocation Plan", "Photonic Signal Quality OSNR"]
]

rows_list = [
    [
        ["Source Node Baseline", "Zero Distance Label", "Root Level Broadcast Frontier"],
        ["Intermediate Core Tier", "Strict Single Hop Advance", "Cycle Free Forward Progress"]
    ],
    [
        ["Level Construction Pass", "Queue Breadth First Search", "Shortest Hop Distance Verification"],
        ["Blocking Flow Extraction", "Depth First Path Saturation", "Admissible Layer Saturated"]
    ],
    [
        ["General Integer Flow", "Vertex Count Bound", "Quadratic Vertex Linear Edge"],
        ["Unit Capacity Matching", "Square Root Vertex Bound", "Square Root Vertex Linear Edge"]
    ],
    [
        ["Naive Depth First Search", "Reset Pointer Per Path", "High Redundant Search Workload"],
        ["Current Arc Optimization", "Persistent Forward Pointer", "Amortized Single Edge Scan"]
    ],
    [
        ["Ingress Transponder Hub", "Dense Carrier Provisioning", "Forward Error Correction Safe"],
        ["Transit ROADM Switch", "Optical Cross Connect Matrix", "Sub Millisecond Low Latency"]
    ]
]

entries = []

for idx, part in enumerate(lesson["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_data[idx]
    title = titles[idx]
    cols = columns_list[idx]
    rows = rows_list[idx]

    steps = [
        {
            "at": "say1",
            "caption": caps["say1"],
            "rows": rows
        },
        {
            "at": "say2",
            "caption": caps["say2"],
            "rows": rows
        },
        {
            "at": "example",
            "caption": caps["example"],
            "rows": rows
        },
        {
            "at": "tryIt",
            "caption": caps["tryIt"],
            "rows": rows
        }
    ]

    filled_obj = {
        "template": "table",
        "title": title,
        "columns": cols,
        "steps": steps
    }

    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "filled": filled_obj,
        "spec": filled_obj
    }
    entries.append(entry)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 47,
    "promptSha": "dsa-optim-day-47-dinic-blocking-flows-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-47.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
