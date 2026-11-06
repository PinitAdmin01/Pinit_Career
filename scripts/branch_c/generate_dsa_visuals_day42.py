# scripts/branch_c/generate_dsa_visuals_day42.py
import json
import hashlib
import os

with open("scripts/branch_c/day42_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Algorithmic optimization evaluates geodesic foundation of tree diameter.",
        "say2": "Algorithmic paradigms compare traversal methods for computing diameter.",
        "example": "Optical carrier network evaluates fiber route optimization latency.",
        "tryIt": "Examine typescript code evaluating single post order traversal."
    },
    # Part 2
    {
        "say1": "Tree centers identify structural equilibrium minimizing eccentricity.",
        "say2": "Foundational graph theory theorem establishes central vertex bounds.",
        "example": "Telecom infrastructure engineers analyze optical distribution network.",
        "tryIt": "Review typescript implementation trimming peripheral leaves in rounds."
    },
    # Part 3
    {
        "say1": "Subtree distance sums bridge computational analytics across network.",
        "say2": "Dynamic programming recurrence calculates bottom subtree distance sums.",
        "example": "Kubernetes cluster autoscaler evaluates hierarchical topology tree.",
        "tryIt": "Examine typescript code recursively accumulating subtree sizes."
    },
    # Part 4
    {
        "say1": "Algorithmic graph theory introduces heavy light path decomposition.",
        "say2": "Mathematical foundation classifies tree edges into heavy and light.",
        "example": "Cloud networking provider traces packet loss across virtual switches.",
        "tryIt": "Examine typescript implementation identifying heavy child vertices."
    },
    # Part 5
    {
        "say1": "Optical backplane router optimizes modern enterprise datacenter switches.",
        "say2": "Operational responsibilities compute worst case optical delay bounds.",
        "example": "Cloud datacenter engineers deploy optical chassis routers for clusters.",
        "tryIt": "Explore optical backplane class evaluating bidirectional topology."
    }
]

titles = [
    "Tree Diameter Geodesic Metric Architecture.",
    "Tree Center and Minimum Eccentricity Trimming.",
    "Subtree Distance Sums Bottom Up DP Matrix.",
    "Heavy Light Path Decomposition Chain Hierarchy.",
    "Optical Backplane Switch Interconnect Matrix."
]

columns_list = [
    ["Algorithm Paradigm", "Traversal Sweeps", "Metric Convexity"],
    ["Topology Level", "Node Degree Status", "Trimming Verdict"],
    ["Subtree Node", "Accumulated Size Weight", "Distance Sum Contribution"],
    ["Edge Classification", "Child Subtree Weight", "Path Bound Guarantee"],
    ["Optical Line Card", "Interconnect Wavelength", "Worst Case Latency"]
]

rows_list = [
    [
        ["Single Pass Tree DP", "Single Post Order Sweep", "Local Apex Convexity"],
        ["Classic Two DFS", "Dual Global Graph Sweeps", "Peripheral Endpoint Search"]
    ],
    [
        ["Boundary Leaf Nodes", "Degree At Most One", "Pruned In Current Round"],
        ["Topological Center", "Minimum Radius Equilibrium", "Retained Central Anchor"]
    ],
    [
        ["Subtree Root Coordinator", "Coalesced Child Sizes", "Aggregated Distance Sum"],
        ["Boundary Leaf Replica", "Unit Size Baseline", "Zero Intrinsic Distance"]
    ],
    [
        ["Heavy Edge Conduit", "Dominant Majority Weight", "Continuous Linear Chain"],
        ["Light Edge Branch", "Halving Subtree Cardinality", "Logarithmic Transition Bound"]
    ],
    [
        ["Core Center Switch", "Broadband Optical Waveguide", "Sub Nanosecond Clock Jitter"],
        ["Peripheral Line Card", "Dedicated Carrier Channel", "Bounded Hop Delivery"]
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
    "day": 42,
    "promptSha": "dsa-optim-day-42-tree-diameter-hld-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-42.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
