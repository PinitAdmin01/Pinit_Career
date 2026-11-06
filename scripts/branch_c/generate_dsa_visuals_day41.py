# scripts/branch_c/generate_dsa_visuals_day41.py
import json
import hashlib
import os

with open("scripts/branch_c/day41_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Algorithmic optimization explores advanced tree dynamic programming.",
        "say2": "Dynamic programming leverages optimal substructure across trees.",
        "example": "Datacenter cooling engineers optimize enterprise thermal dissipation.",
        "tryIt": "Recursive method computes subtree sizes from bottom leaf vertices."
    },
    # Part 2
    {
        "say1": "Maximum independent set establishes canonical benchmark on trees.",
        "say2": "Dynamic programming recurrence evaluates included and excluded states.",
        "example": "Cellular network towers deploy radio engineers avoiding collisions.",
        "tryIt": "Examine recursive function calculating independent set selections."
    },
    # Part 3
    {
        "say1": "Subtree aggregations empower centroid discovery in dynamic routing.",
        "say2": "Tree centroid minimizes component sizes when removing vertex.",
        "example": "Distributed cluster leader coordinates consensus across cloud regions.",
        "tryIt": "Examine centroid implementation computing subtree node counts."
    },
    # Part 4
    {
        "say1": "Structural duality connects maximum independent set with vertex cover.",
        "say2": "Combinatorial optimization theorem proves duality on tree graphs.",
        "example": "Facility security engineers deploy surveillance cameras along campus.",
        "tryIt": "Examine vertex cover implementation evaluating tree children."
    },
    # Part 5
    {
        "say1": "Enterprise role allocator coordinates cloud infrastructure hierarchy.",
        "say2": "Primary controller roles prevent catastrophic failure cascades.",
        "example": "Enterprise cloud teams deploy primary database replicas securely.",
        "tryIt": "Explore role allocation class optimizing primary compute capacities."
    }
]

titles = [
    "Tree DP Subtree Aggregation Architecture.",
    "Maximum Independent Set Two State DP Matrix.",
    "Tree Centroid Identification and Decomposition.",
    "Gallai Identity MIS and MVC Equivalence.",
    "Enterprise Role Allocation Governance Matrix."
]

columns_list = [
    ["Tree Node Level", "Subtree Aggregation State", "Traversal Order"],
    ["Candidate Vertex", "Excluded State Weight", "Included State Weight"],
    ["Tree Candidate", "Max Component Cardinality", "Centroid Verdict"],
    ["Optimization Metric", "Selected Vertex Count", "Graph Theory Duality"],
    ["Cluster Node", "Assigned Operational Role", "Failover Safety Verdict"]
]

rows_list = [
    [
        ["Leaf Boundary Vertices", "Unit Leaf Size Base", "Post Order Traversal"],
        ["Internal Coordination Root", "Coalesced Subtree Weight", "Top Level Synthesis"]
    ],
    [
        ["Internal Cluster Node", "Child Maxima Combination", "Disjoint Subtree Sum"],
        ["Boundary Leaf Node", "Zero Weight Assignment", "Full Intrinsic Capacity"]
    ],
    [
        ["Root Candidate Node", "Component Exceeds Half Limit", "Centroid Rejected"],
        ["Optimal Balance Point", "Component Within Half Limit", "Centroid Verified"]
    ],
    [
        ["Maximum Independent Set", "Maximum Non Adjacent Subset", "Gallai Primal Form"],
        ["Minimum Vertex Cover", "Complete Edge Incidence", "Gallai Dual Solution"]
    ],
    [
        ["Primary Active Controller", "Independent Role Assignment", "High Availability Mode"],
        ["Secondary Backup Standby", "Complementary Role Guard", "Zero Conflict Policy"]
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
    "day": 41,
    "promptSha": "dsa-optim-day-41-tree-dp-mis-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-41.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
