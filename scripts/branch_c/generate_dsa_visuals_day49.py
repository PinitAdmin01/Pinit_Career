# scripts/branch_c/generate_dsa_visuals_day49.py
import json
import hashlib
import os

with open("scripts/branch_c/day49_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Advanced data structures investigate discrete optimization duality theory.",
        "say2": "Formal flow networks define partition of vertices into disjoint sets.",
        "example": "Regional highway transit systems analyze critical transportation paths.",
        "tryIt": "Examine typescript code computing maximum flow and residual partition."
    },
    # Part 2
    {
        "say1": "Flow networks solve widely applicable maximum bipartite matching tasks.",
        "say2": "Reducing bipartite matching to maximum flow models combinatorial edges.",
        "example": "Airline crew dispatch systems match incoming pilots to flights.",
        "tryIt": "Examine typescript code introducing super source and super sink nodes."
    },
    # Part 3
    {
        "say1": "Algebraic dualities formalize minimum vertex cover in bipartite graphs.",
        "say2": "Extracting minimum vertex covers leverages minimum cut partitions.",
        "example": "Municipal security monitoring grids place surveillance cameras.",
        "tryIt": "Examine typescript code computing minimum vertex cover size directly."
    },
    # Part 4
    {
        "say1": "Menger theorem formalizes algorithmic extraction of disjoint paths.",
        "say2": "Edge disjoint paths connect vertices without sharing physical edges.",
        "example": "Military communications satellite network transmits telemetry.",
        "tryIt": "Examine typescript code transforming intermediate nodes with capacity."
    },
    # Part 5
    {
        "say1": "Enterprise cloud fabrics engineer autonomous gpu scheduler engines.",
        "say2": "Autonomous orchestration control planes manage gpu cluster resources.",
        "example": "Enterprise cloud cluster hosts deep learning accelerators and workloads.",
        "tryIt": "Explore gpu scheduler class registering accelerators and workloads."
    }
]

titles = [
    "Residual Reachability Minimum Cut Boundary Model.",
    "Bipartite Assignment Unit Flow Network Reduction.",
    "Konig Duality Vertex Cover And Independent Set.",
    "Menger Vertex Splitting Disjoint Path Routing.",
    "Autonomous Cloud GPU Allocation Scheduling Matrix."
]

columns_list = [
    ["Cut Partition Set", "Reachability Criterion", "Cut Boundary Forward Edge"],
    ["Flow Network Tier", "Edge Unit Capacity", "Bipartite Assignment Impact"],
    ["Combinatorial Metric", "Algebraic Graph Theory", "Polynomial Duality Rule"],
    ["Disjoint Path Routing", "Vertex Splitting Node", "Network Path Redundancy"],
    ["AI Compute Workload", "GPU Accelerator Model", "Hardware Allocation Status"]
]

rows_list = [
    [
        ["Source Reachable Set", "Positive Residual Slack", "Saturated Capacity BottleNeck"],
        ["Sink Disconnected Set", "Zero Residual Inflow", "Target Destination Terminal"]
    ],
    [
        ["Virtual Super Source", "Unit Inflow Invariant", "Single Task Allocation Guard"],
        ["Worker Node Terminal", "Unit Outflow Invariant", "Zero Overlap Execution Match"]
    ],
    [
        ["Maximum Matching Size", "Cardinality Of Integral Flow", "Equivalent Vertex Cover Bound"],
        ["Maximum Independent Set", "Vertex Graph Complement", "Complete Non Conflicting Subset"]
    ],
    [
        ["Edge Disjoint Route", "Shared Intermediate Vertex", "Single Edge Failure Protected"],
        ["Vertex Disjoint Route", "Split Input Output Nodes", "Total Node Failure Protected"]
    ],
    [
        ["Large Foundation Model", "High Memory Tensor Cores", "Full NVLink Bandwidth Assigned"],
        ["Quantized Inference Job", "Standard VRAM Compute Node", "Cost Efficient Execution Match"]
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
    "day": 49,
    "promptSha": "dsa-optim-day-49-min-cut-duality-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-49.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
