import json
import hashlib
import re
import os

STOP_WORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'your', 'will',
    'then', 'them', 'they', 'some', 'each', 'also', 'just', 'into', 'only', 'more',
    'here', 'make', 'like', 'than', 'been', 'there', 'their', 'which', 'about', 'would',
    'could', 'should', 'other', 'these', 'those', 'after', 'first', 'where', 'while',
    'being', 'does', 'doing', 'look', 'same', 'over', 'such', 'most'
}

def get_important_words(text):
    words = re.findall(r'[a-z0-9]+', text.lower())
    return {w for w in words if len(w) >= 4 and w not in STOP_WORDS}

with open("scripts/branch_c/day33_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

entries = []

captions_data = [
    # Part 1
    {
        "say1": "Fundamental duality connects maximum flow and cut capacity.",
        "say2": "Partition divides vertices into disjoint source and sink subsets.",
        "example": "Electrical grid transmission substations deliver industrial power.",
        "tryIt": "Partition shifts confirm cut capacity remains upper bound."
    },
    # Part 2
    {
        "say1": "Residual graph reachability extracts minimum cut partition.",
        "say2": "Source traversal identifies all reachable residual vertices.",
        "example": "Replication cluster analyzes topology after reaching throughput.",
        "tryIt": "Queue confirms saturated forward edges block target node."
    },
    # Part 3
    {
        "say1": "Bipartite matching models workforce resource assignment.",
        "say2": "Matching selects disjoint edges sharing zero common vertices.",
        "example": "Engineering department matches specialized developers to epics.",
        "tryIt": "Removing affinity edge reroutes optimal matching flow."
    },
    # Part 4
    {
        "say1": "Konig theorem establishes matching and vertex cover equivalence.",
        "say2": "Theorem proves matching size equals vertex cover size.",
        "example": "Cybersecurity audit models permissions across microservices.",
        "tryIt": "Cover array verifies complete protection across bipartite edges."
    },
    # Part 5
    {
        "say1": "Governance engine automates enterprise resource allocation.",
        "say2": "Governor models team capacities and task requirements.",
        "example": "Organization deploys governor to assign infrastructure epics.",
        "tryIt": "Unassigned tasks trigger capacity deficit alerts."
    }
]

table_specs = [
    # Part 1 Table Spec
    {
        "columns": ["Cut Partition Pair", "Crossing Conduit", "Edge Capacity", "Duality Role"],
        "rows_step1": [
            ["Source to TransitB", "Forward Edge", "Ten Units", "Bottleneck Bound"],
            ["TransitA to TransitB", "Cross Branch", "Two Units", "Internal Divert"]
        ],
        "rows_step2": [
            ["TransitA to Sink", "Egress Channel", "Four Units", "Direct Output"],
            ["Total Cut Capacity", "Summed Crossing", "Sixteen Units", "Upper Bound Verified"]
        ],
        "rows_step3": [
            ["Substation Alpha", "Direct Conduit", "Hydro Electric", "Primary Feeder"],
            ["Substation Beta", "Cross Feeder", "Industrial Zone", "Balanced Load"]
        ],
        "rows_step4": [
            ["Alternative Cut", "Shifted Partition", "Eighteen Units", "Relaxed Bound"],
            ["Minimum Cut", "Optimal Partition", "Thirteen Units", "Exact Equality"]
        ]
    },
    # Part 2 Table Spec
    {
        "columns": ["Vertex Group", "Residual Reachability", "Boundary Status", "Saturated Edges"],
        "rows_step1": [
            ["Partition Set S", "Reachable From Source", "Active Domain", "Forward Conduits"],
            ["Partition Set T", "Unreachable Nodes", "Sink Boundary", "Zero Residual"]
        ],
        "rows_step2": [
            ["Node A to Node T", "Capacity Four", "Flow Four", "Saturated Crossing"],
            ["Node B to Node T", "Capacity Nine", "Flow Nine", "Saturated Crossing"]
        ],
        "rows_step3": [
            ["Database Master S", "Primary Ingestion", "Thirteen Gbps", "Full Throughput"],
            ["Replica Target T", "Consumer Endpoint", "Thirteen Gbps", "Bottleneck Reached"]
        ],
        "rows_step4": [
            ["Sum Crossing Cuts", "Certified Min Cut", "Thirteen Gbps", "Linear Extraction"],
            ["Reachability Sweep", "Breadth Traversal", "Order V Plus E", "Instant Proof"]
        ]
    },
    # Part 3 Table Spec
    {
        "columns": ["Bipartite Element", "Flow Assignment", "Capacity Rule", "Matching Outcome"],
        "rows_step1": [
            ["Developer One", "Frontend Epic", "Unit Integer Flow", "Matched Pair"],
            ["Developer Two", "Backend Epic", "Unit Integer Flow", "Matched Pair"]
        ],
        "rows_step2": [
            ["Developer Three", "Database Epic", "Unit Integer Flow", "Matched Pair"],
            ["Developer Four", "DevOps Epic", "Unit Integer Flow", "Matched Pair"]
        ],
        "rows_step3": [
            ["Source Inflow", "Four Developers", "Unit Supply Each", "Full Utilization"],
            ["Sink Outflow", "Four Tasks Done", "Unit Demand Each", "Zero Idle Time"]
        ],
        "rows_step4": [
            ["Integrality Law", "Integer Bounds", "Zero Fractional Work", "Perfect Cardinality"],
            ["Matching Capacity", "Maximum Flow Four", "Four Pairs Bound", "Optimal Schedule"]
        ]
    },
    # Part 4 Table Spec
    {
        "columns": ["Graph Element", "Matching Role", "Vertex Cover Role", "Konig Equality"],
        "rows_step1": [
            ["Account U One", "Matched Left Node", "Selected In Cover", "Cardinality One"],
            ["Account U Two", "Matched Left Node", "Selected In Cover", "Cardinality Two"]
        ],
        "rows_step2": [
            ["Account U Three", "Matched Left Node", "Selected In Cover", "Cardinality Three"],
            ["Service V Nodes", "Matched Right Nodes", "Covered By Left", "Zero Redundancy"]
        ],
        "rows_step3": [
            ["Five Permission Links", "Original Edges", "All Touched Once", "Complete Protection"],
            ["Audit Perimeter", "Three User Nodes", "Minimal Security Cut", "Least Privilege"]
        ],
        "rows_step4": [
            ["Max Matching Size", "Three Edge Pairs", "Optimal Allocation", "Proven Dual"],
            ["Min Cover Size", "Three Vertex Nodes", "Exact Equivalence", "Konig Theorem"]
        ]
    },
    # Part 5 Table Spec
    {
        "columns": ["Team Entity", "Sprint Quota", "Assigned Backlog", "Capacity Cut Alert"],
        "rows_step1": [
            ["Platform Team", "Two Task Quota", "Kubernetes Upgrade", "Quota Saturated"],
            ["Security Team", "One Task Quota", "Vulnerability Audit", "Quota Saturated"]
        ],
        "rows_step2": [
            ["Data Team", "Two Task Quota", "Schema Migration", "Quota Saturated"],
            ["Secondary Data Task", "Second Slot", "Pipeline Optimize", "Quota Saturated"]
        ],
        "rows_step3": [
            ["Total Backlog Intake", "Five Epics", "Five Delivered", "Optimal Sprint"],
            ["Bottleneck Resource", "Team Source Cuts", "Three Saturated Ranks", "Scaling Clue"]
        ],
        "rows_step4": [
            ["Governance Audit", "Zero Backlog Drop", "Autonomous Schedule", "High Productivity"],
            ["Capacity Expansion", "Platform Security", "Direct Release Boost", "Budget Aligned"]
        ]
    }
]

for idx, part in enumerate(lesson["parts"]):
    caps = captions_data[idx]
    tbl = table_specs[idx]
    
    # Check say1 (attached to part.say[0])
    w_cap = get_important_words(caps["say1"])
    w_text = get_important_words(part["say"][0])
    shared_say1 = w_cap.intersection(w_text)
    assert len(shared_say1) >= 1, f"Part {idx+1} say1 shares {len(shared_say1)} words: {shared_say1}"
    assert len(caps["say1"]) <= 75 and caps["say1"].endswith('.') and not re.search(r'\d', caps["say1"])
    
    # Check say2 (attached to part.say[1])
    w_cap = get_important_words(caps["say2"])
    w_text = get_important_words(part["say"][1])
    shared_say2 = w_cap.intersection(w_text)
    assert len(shared_say2) >= 1, f"Part {idx+1} say2 shares {len(shared_say2)} words: {shared_say2}"
    assert len(caps["say2"]) <= 75 and caps["say2"].endswith('.') and not re.search(r'\d', caps["say2"])
    
    # Check example
    w_cap = get_important_words(caps["example"])
    w_text = get_important_words(part["example"])
    shared_ex = w_cap.intersection(w_text)
    assert len(shared_ex) >= 1, f"Part {idx+1} example shares {len(shared_ex)} words: {shared_ex}"
    assert len(caps["example"]) <= 75 and caps["example"].endswith('.') and not re.search(r'\d', caps["example"])
    
    # Check tryIt
    w_cap = get_important_words(caps["tryIt"])
    w_text = get_important_words(part["tryIt"])
    shared_try = w_cap.intersection(w_text)
    assert len(shared_try) >= 1, f"Part {idx+1} tryIt shares {len(shared_try)} words: {shared_try}"
    assert len(caps["tryIt"]) <= 75 and caps["tryIt"].endswith('.') and not re.search(r'\d', caps["tryIt"])
    
    code_hash = hashlib.sha256(part["code"].encode("utf-8")).hexdigest()
    title_short = part["title"][:40]
    
    spec_obj = {
        "template": "table",
        "title": f"{title_short} Duality Matrix",
        "columns": tbl["columns"],
        "steps": [
            {
                "at": "say1",
                "caption": caps["say1"],
                "rows": tbl["rows_step1"]
            },
            {
                "at": "say2",
                "caption": caps["say2"],
                "rows": tbl["rows_step2"]
            },
            {
                "at": "example",
                "caption": caps["example"],
                "rows": tbl["rows_step3"]
            },
            {
                "at": "tryIt",
                "caption": caps["tryIt"],
                "rows": tbl["rows_step4"]
            }
        ]
    }
    
    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "filled": spec_obj,
        "spec": spec_obj
    }
    entries.append(entry)

prompt_str = f"Course dsa-optim Day 33: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 33,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-33.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully!")
