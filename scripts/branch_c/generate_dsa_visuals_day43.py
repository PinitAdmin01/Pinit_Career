# scripts/branch_c/generate_dsa_visuals_day43.py
import json
import hashlib
import os

with open("scripts/branch_c/day43_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Algorithmic optimization explores advanced graph all roots techniques.",
        "say2": "Distributed systems evaluate enterprise infrastructure challenge.",
        "example": "Enterprise cloud cluster evaluates candidate coordinator nodes.",
        "tryIt": "Examine typescript code executing naive independent recursive search."
    },
    # Part 2
    {
        "say1": "Rerooting technique architecture coordinates bottom pull and top push.",
        "say2": "Bottom pull phase designates initial vertex accumulating subtree info.",
        "example": "Retail logistics network models warehouse distribution hubs securely.",
        "tryIt": "Examine typescript code calculating algebraic rerooting transitions."
    },
    # Part 3
    {
        "say1": "Dynamic programming confronts non invertible state transitions.",
        "say2": "Classic all roots problem computes maximum distance eccentricity.",
        "example": "Telecommunications network computes maximum delay across relay towers.",
        "tryIt": "Examine typescript code constructing prefix and suffix arrays."
    },
    # Part 4
    {
        "say1": "Structural analysis explores all roots distance variance on trees.",
        "say2": "Strict convexity of distance sum identifies optimal tree medians.",
        "example": "Autonomous vehicle convoy algorithm computes mesh tree distance sums.",
        "tryIt": "Examine typescript code deriving two pass rerooting distance sums."
    },
    # Part 5
    {
        "say1": "Enterprise topology optimizer coordinates modern cloud infrastructure.",
        "say2": "Positioned consensus leader prevents catastrophic tail latency spikes.",
        "example": "Global financial exchange evaluates inter datacenter fiber links.",
        "tryIt": "Explore optimizer class evaluating total distance sums and arrays."
    }
]

titles = [
    "All Roots Tree Paradigm Complexity Matrix.",
    "Two Pass Up Down Rerooting Architecture.",
    "Prefix Suffix Non Invertible State Transition.",
    "Tree Median Convexity and Variance Distribution.",
    "Consensus Leader Multi Criteria Optimization."
]

columns_list = [
    ["Root Evaluation Strategy", "Pass Complexity", "Scaling Limit"],
    ["Traversal Direction", "Computed Information", "Transition Time"],
    ["Child Branch Direction", "Partial Array Representation", "Query Cost"],
    ["Topology Metric", "Optimization Goal", "Optimal Graph Node"],
    ["Consensus Replica", "Broadcast Hop Metric", "Quorum Commit Latency"]
]

rows_list = [
    [
        ["Naive Multi Sweep Search", "Quadratic Graph Traversal", "Intractable On Scale"],
        ["Two Pass Tree Rerooting", "Strict Linear Execution", "Scalable To Millions"]
    ],
    [
        ["Bottom Up Pull Phase", "Subtree Size And Downward Sum", "Post Order Leaf Advance"],
        ["Top Down Push Phase", "Global Rerooted Distribution", "Constant Time Shift"]
    ],
    [
        ["Prefix Child Traversal", "Accumulated Sibling Maxima", "Unit Time Evaluation"],
        ["Suffix Child Sweep", "Complementary Sibling Maxima", "Instantaneous Lookup"]
    ],
    [
        ["Tree Topological Center", "Minimizes Maximum Eccentricity", "Worst Case Clock Master"],
        ["Tree Topological Median", "Minimizes Cumulative Distances", "Throughput Coordination"]
    ],
    [
        ["Optimal Primary Leader", "Minimal Broadcast Serialization", "Sub Microsecond Commit"],
        ["Peripheral Backup Node", "High Latency Overhead", "Failover Candidate Standby"]
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
    "day": 43,
    "promptSha": "dsa-optim-day-43-all-roots-rerooting-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-43.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
