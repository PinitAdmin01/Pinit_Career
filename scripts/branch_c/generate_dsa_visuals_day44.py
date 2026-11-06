# scripts/branch_c/generate_dsa_visuals_day44.py
import json
import hashlib
import os

with open("scripts/branch_c/day44_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Algorithmic optimization explores advanced tree knapsack dynamic patterns.",
        "say2": "Rooted tree knapsack problem assigns weight to vertices.",
        "example": "Corporate enterprise platform teams allocate cloud compute instances.",
        "tryIt": "Examine typescript code bounding convolution loops to subtree sizes."
    },
    # Part 2
    {
        "say1": "Mathematical proof establishes cartesian pairwise sizing lemma bounds.",
        "say2": "Examine cartesian product interpretation during subtree vertex merge.",
        "example": "Enterprise supply chain network algorithm merges distribution constraints.",
        "tryIt": "Examine typescript code incrementing merge iterations dynamically."
    },
    # Part 3
    {
        "say1": "Systems implementation optimizes in place vector convolution on trees.",
        "say2": "Production environments execute convolution using single array per vertex.",
        "example": "Autonomous robotics system allocates real time sensor pipelines.",
        "tryIt": "Examine typescript code updating dynamic table backward in place."
    },
    # Part 4
    {
        "say1": "Euler tour flattening introduces subtree skip transitions on knapsacks.",
        "say2": "Conceptual foundation rests upon euler tour pre order traversal.",
        "example": "Virtualization hypervisor software evaluates nested containers.",
        "tryIt": "Examine typescript code evaluating linear table and euler order."
    },
    # Part 5
    {
        "say1": "Enterprise resource management system coordinates cloud architectures.",
        "say2": "Cluster administrators face physical datacenter capacity constraints.",
        "example": "Global platform engineers allocate cores across microservices.",
        "tryIt": "Explore resource allocator class flattening tree via euler tour."
    }
]

titles = [
    "Capacity Bounded Tree Knapsack DP Architecture.",
    "Cartesian Pairwise Sizing Lemma Proof Matrix.",
    "In Place Reverse Vector Convolution Model.",
    "Euler Tour Linear DAG Knapsack Skip Transition.",
    "Hierarchical Cloud Service Allocation Matrix."
]

columns_list = [
    ["Tree Node Level", "Bounded Loop Limits", "Convolution Reachability"],
    ["Pairing Phase", "Pairwise Iteration Count", "Complexity Classification"],
    ["Merge State Traversal", "In Place Array Strategy", "Dirty Overwrite Guard"],
    ["Euler Sequence Action", "DAG Transition Option", "Evaluation Complexity"],
    ["Microservice Domain", "Allocated CPU Resource", "Business SLA Utility"]
]

rows_list = [
    [
        ["Subtree Coordinator Node", "Bounded By Min Capacity", "Reachability Enforced"],
        ["Boundary Leaf Component", "Unit Capacity Allocation", "Strict Subtree Baseline"]
    ],
    [
        ["Cartesian Product Merge", "Exact Node Pairings", "Strict Quadratic Cap"],
        ["Global Tree Convolution", "Unique Lowest Ancestor", "Bounded Linear Pairs"]
    ],
    [
        ["Reverse Capacity Loop", "Decremental Capacity Scan", "Zero Read Pollution"],
        ["Subtree Convolution Merge", "Single Static Vector", "High Cache Residency"]
    ],
    [
        ["Select Service Node", "Advance To Immediate Child", "Unit Time State Step"],
        ["Skip Subtree Branch", "Jump Past Subtree Interval", "Constant Time Skip"]
    ],
    [
        ["Gateway Authentication", "Dedicated Compute Quota", "Maximized SLA Health"],
        ["Subservice Component", "Dependent Allocation Link", "Zero Dependency Fault"]
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
    "day": 44,
    "promptSha": "dsa-optim-day-44-subtree-knapsack-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-44.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
