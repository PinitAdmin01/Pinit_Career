# scripts/branch_c/generate_dsa_visuals_day46.py
import json
import hashlib
import os

with open("scripts/branch_c/day46_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Advanced network optimization models foundational flow conservation laws.",
        "say2": "Directed graph structures enforce non negative capacity bounds.",
        "example": "Urban water utility networks model aqueducts connecting reservoirs.",
        "tryIt": "Examine typescript code constructing forward edges and reverse edges."
    },
    # Part 2
    {
        "say1": "Maximum flow algorithms deploy celebrated edmonds karp augmentation.",
        "say2": "Iterative path augmentation pushes flow along residual paths.",
        "example": "Regional telecommunications carrier backbone executes edmonds karp routing.",
        "tryIt": "Examine typescript code executing breadth first search queue traversal."
    },
    # Part 3
    {
        "say1": "Pathological failure modes motivate capacity scaling algorithmic search.",
        "say2": "Capacity scaling amortizes flow augmentations across scaling phases.",
        "example": "Inter datacenter cloud replication mesh allocates bandwidth across fiber.",
        "tryIt": "Examine typescript code enforcing residual capacity delta conditions."
    },
    # Part 4
    {
        "say1": "Profound applied mathematics formalizes max flow min cut theorem.",
        "say2": "Disjoint partition separates reachable source vertices from sink vertex.",
        "example": "Urban water pipeline network verifies delivery capacity across districts.",
        "tryIt": "Examine typescript code identifying reachable sets and cut edges."
    },
    # Part 5
    {
        "say1": "Industrial infrastructure engine implements municipal flow dispatcher.",
        "say2": "Managing municipal fluid networks solves maximum throughput challenges.",
        "example": "Metropolitan water district simulates aqueduct throughput from reservoirs.",
        "tryIt": "Explore flow dispatcher class registering aqueduct pipelines."
    }
]

titles = [
    "Flow Network Conservation And Residual Graph Model.",
    "Edmonds Karp Breadth First Augmenting Path Search.",
    "Logarithmic Bit Shift Capacity Scaling Matrix.",
    "Max Flow Min Cut Bottleneck Partition Table.",
    "Municipal Flow Dispatcher Infrastructure Matrix."
]

columns_list = [
    ["Network Pipeline Edge", "Nominal Pipe Capacity", "Residual Backflow Slack"],
    ["Augmentation Step", "Shortest Path Selection", "Residual Capacity Bottleneck"],
    ["Scaling Phase Parameter", "Active Capacity Threshold", "Augmentation Search Paradigm"],
    ["Network Cut Partition", "Set Reachability Status", "Cut Boundary Conduit Classification"],
    ["Municipal Infrastructure Node", "Hydraulic Dispatch Mode", "Bottleneck Monitoring Telemetry"]
]

rows_list = [
    [
        ["Forward Supply Conduit", "Configured Volume Rate", "Decreasing Residual Headroom"],
        ["Reverse Conceptual Edge", "Zero Base Capacity", "Available Pushback Cancellation"]
    ],
    [
        ["Breadth First Traversal", "Fewest Hop Edge Sequence", "Pivotal Saturated Conduit"],
        ["Residual Graph Update", "Forward Capacity Deducted", "Reverse Slack Incremented"]
    ],
    [
        ["High Order Bitmask", "Coarse Grain Flow Corridor", "High Volume Depth First Search"],
        ["Unit Step Baseline", "Residual Edge Inclusion", "Exact Flow Network Saturation"]
    ],
    [
        ["Source Reachable Nodes", "Positive Residual Slack", "Saturated Forward Bottleneck"],
        ["Sink Disconnected Nodes", "Zero Residual Headroom", "Isolated Target Domain"]
    ],
    [
        ["Primary Reservoir Inflow", "Max Flow Optimization", "Real Time Pressure Sensor Array"],
        ["Metropolitan District Outflow", "Min Cut Vulnerability", "Preventive Valve Actuation Alert"]
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
    "day": 46,
    "promptSha": "dsa-optim-day-46-max-flow-foundations-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-46.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
