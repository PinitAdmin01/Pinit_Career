# scripts/branch_c/generate_dsa_visuals_day48.py
import json
import hashlib
import os

with open("scripts/branch_c/day48_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Advanced data structures explore classical augmenting path paradigms.",
        "say2": "Computer scientists introduced revolutionary push relabel algorithms.",
        "example": "Municipal water reservoir networks model pipelines connecting tanks.",
        "tryIt": "Examine typescript code initializing height and pushing full capacity."
    },
    # Part 2
    {
        "say1": "Mathematical invariants formalize valid distance labeling routines.",
        "say2": "Valid distance labeling provides lower bounds on shortest path hops.",
        "example": "Cloud data pipelines connect regional storage clusters accumulating data.",
        "tryIt": "Examine typescript code implementing discharge alternating pushes."
    },
    # Part 3
    {
        "say1": "Highest label preflow push achieves optimal worst case bound search.",
        "say2": "Highest label active vertices discharge cascading fluid movements.",
        "example": "Distributed container scheduling clusters manage job placements.",
        "tryIt": "Examine typescript code organizing active vertices into height buckets."
    },
    # Part 4
    {
        "say1": "Practical engineering heuristics elevate push relabel solver speed.",
        "say2": "Gap relabeling eliminates pathological behaviors across array counts.",
        "example": "Continental pipeline networks model compressor stations and valves.",
        "tryIt": "Examine typescript code comparing heuristic speedup optimizations."
    },
    # Part 5
    {
        "say1": "Enterprise financial infrastructure implements liquidity settler.",
        "say2": "Continuous settlement engines clear interbank credit obligations.",
        "example": "International interbank clearing systems settle bilateral credit lines.",
        "tryIt": "Explore liquidity settler class defining bilateral clearing limits."
    }
]

titles = [
    "Preflow Push Excess Relaxation Height Field Matrix.",
    "Discharge Mechanics Valid Distance Labeling Table.",
    "Highest Label Preflow Push Height Bucket Queue.",
    "Global Reverse BFS And Gap Relabeling Diagnostics.",
    "Continuous Linked Settlement Interbank Credit Matrix."
]

columns_list = [
    ["Preflow Vertex State", "Excess Flow Level", "Local Height Gradient"],
    ["Discharge Push Type", "Residual Headroom Delta", "Height Function Invariant"],
    ["Bucket Height Index", "Active Node Bucket Set", "Non Saturating Bound"],
    ["Heuristic Engine Component", "Execution Trigger Event", "Computational Work Saved"],
    ["Multinational Bank Entity", "Intraday Credit Line", "Multilateral Netting Status"]
]

rows_list = [
    [
        ["Active Node Inflow", "Positive Excess Accumulated", "Steepest Downhill Slope"],
        ["Drained Node Balance", "Zero Excess Conservation", "Equilibrium Energy Level"]
    ],
    [
        ["Saturating Forward Push", "Capacity Fully Exhausted", "Admissible Hop Preserved"],
        ["Non Saturating Push", "Excess Drained Completely", "Vertex Deactivated Instantly"]
    ],
    [
        ["Maximum Height Tier", "Ceiling Active Vertices", "Bounded Downward Cascade"],
        ["Ground Sink Level", "Terminal Inflow Absorption", "Zero Return Cancellation"]
    ],
    [
        ["Gap Relabeling Circuit", "Empty Height Level Detected", "Eliminate Stranded Relabels"],
        ["Global Reverse BFS", "Periodic Work Interval", "Direct True Shortest Paths"]
    ],
    [
        ["Tier One Settlement Member", "Bilateral Facility Active", "Liquidity Discharged Smoothly"],
        ["Central Bank Clearing Hub", "Reserve Account Inflow", "Continuous Settlement Complete"]
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
    "day": 48,
    "promptSha": "dsa-optim-day-48-push-relabel-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-48.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
