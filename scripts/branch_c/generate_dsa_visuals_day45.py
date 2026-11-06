# scripts/branch_c/generate_dsa_visuals_day45.py
import json
import hashlib
import os

with open("scripts/branch_c/day45_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Milestone capstone unifies advanced tree dynamic programming.",
        "say2": "Enterprise power distribution architecture avoids destructive loops.",
        "example": "Metropolitan power utility engineers analyze electrical feeder loading.",
        "tryIt": "Examine typescript code aggregating downstream power demand loads."
    },
    # Part 2
    {
        "say1": "Dynamic grid reconfiguration applies all roots rerooting technique.",
        "say2": "Central optimization challenge identifies candidate power substation.",
        "example": "Regional power grid isolates primary nuclear generating facility.",
        "tryIt": "Examine typescript code propagating algebraic rerooting loss formula."
    },
    # Part 3
    {
        "say1": "Modern power grid operations mitigate extreme grid islanding events.",
        "say2": "Islanding event triggers zero latency failure domain isolation.",
        "example": "Metropolitan center isolates industrial port microgrid during storm.",
        "tryIt": "Examine typescript code executing leaf trimming on islanded networks."
    },
    # Part 4
    {
        "say1": "Emergency load shedding deploys capacity bounded subtree knapsack.",
        "say2": "Grid operators execute under frequency load shedding during collapse.",
        "example": "Regional grid executes euler tour skip knapsack during winter storm.",
        "tryIt": "Examine typescript code evaluating linear table and euler order."
    },
    # Part 5
    {
        "say1": "Milestone capstone constructs enterprise grid topology optimizer.",
        "say2": "Industrial operating cycle traces complete execution lifecycle.",
        "example": "Smart megacity coordinates real time power dispatch across meters.",
        "tryIt": "Explore grid optimizer class orchestrating rerooting and peeling."
    }
]

titles = [
    "Radial Spanning Tree Power Flow Architecture.",
    "Two Pass Electrical Impedance Rerooting Matrix.",
    "Microgrid Island Centroid Governor Identification.",
    "Euler Tour Skip Knapsack Under Frequency Shedding.",
    "Enterprise Autonomous Grid Optimizer Governance."
]

columns_list = [
    ["Electrical Branch Node", "Feeder Subtree Load", "Joule Loss Dissipation"],
    ["Candidate Substation", "Aggregate Branch Impedance", "Generation Injection Score"],
    ["Isolated Microgrid Island", "Kahn Centroid Identification", "Quorum Frequency Control"],
    ["Feeder Breaker Action", "Shedding Priority Retained", "Generation Capacity Constraint"],
    ["Grid Optimization Module", "Mathematical Foundation", "SCADA Actuation Latency"]
]

rows_list = [
    [
        ["Primary Substation Feeder", "Coalesced Subtree Load", "Radial Flow Preservation"],
        ["Boundary Lateral Circuit", "Local Consumer Demand", "Zero Loop Circulating VAR"]
    ],
    [
        ["Optimal Generation Site", "Minimal Line Loss Metric", "Primary Dispatch Elected"],
        ["Peripheral Feeder Busses", "High Electrical Distance", "Standby Injection Node"]
    ],
    [
        ["Metropolitan Island Area", "Topological Center Vertex", "Sub Nanosecond Clock Sync"],
        ["Industrial Port Microgrid", "Decentralized Centroid Quorum", "Instantaneous Droop Control"]
    ],
    [
        ["Retained Feeder Breaker", "Essential Infrastructure Guard", "Advance To Subordinate Branch"],
        ["Shed Lateral Breaker", "Commercial Load Disconnected", "Jump Past Subtree Interval"]
    ],
    [
        ["All Roots Power Flow", "Two Pass Algebraic Rerooting", "Sub Millisecond Dispatch"],
        ["UFLS Skip Knapsack", "Euler Tour DAG Linearization", "Precision Demand Response"]
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
    "day": 45,
    "promptSha": "dsa-optim-day-45-milestone-9-capstone-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-45.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
