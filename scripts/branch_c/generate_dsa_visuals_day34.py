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

with open("scripts/branch_c/day34_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

entries = []

captions_data = [
    # Part 1
    {
        "say1": "Disjoint sets partition elements into dynamic equivalence classes.",
        "say2": "Find operation traverses pointer references to canonical root.",
        "example": "Security infrastructure monitors regional server cluster links.",
        "tryIt": "Union call merges independent clusters into equivalence class."
    },
    # Part 2
    {
        "say1": "Complementary heuristics govern disjoint set optimization phases.",
        "say2": "Union by rank bounds subtree height to logarithmic depth.",
        "example": "Cluster management system tracks host machine unions.",
        "tryIt": "Component size queries verify unified cluster member totals."
    },
    # Part 3
    {
        "say1": "Dynamic connectivity investigates changing graph components.",
        "say2": "Path compression prevents tracking severed edge deletions.",
        "example": "Telecommunications audit analyzes router link connectivity.",
        "tryIt": "Segment tree assigns edges to active lifetime intervals."
    },
    # Part 4
    {
        "say1": "Rollback disjoint sets empower temporal graph persistence.",
        "say2": "Rollback mechanics strictly forbid path compression flattening.",
        "example": "Controller establishes checkpoint before speculative link test.",
        "tryIt": "Rollback calls cleanly restore parent pointers and ranks."
    },
    # Part 5
    {
        "say1": "Topology oracle monitors multi region hybrid cloud networks.",
        "say2": "Oracle encapsulates rollback engine with cluster tracking.",
        "example": "Oracle simulates transatlantic bridge across regional zones.",
        "tryIt": "Speculative bridge tests verify multi region mesh governance."
    }
]

table_specs = [
    # Part 1 Table Spec
    {
        "columns": ["Cluster Node", "Parent Pointer", "Rank Level", "Equivalence Group"],
        "rows_step1": [
            ["Node Alpha", "Node Alpha", "Rank Zero", "Initial Singleton"],
            ["Node Beta", "Node Alpha", "Rank One", "Merged Cluster"]
        ],
        "rows_step2": [
            ["Node Gamma", "Node Alpha", "Rank Zero", "Compressed Path"],
            ["Node Delta", "Node Delta", "Rank Zero", "Independent Root"]
        ],
        "rows_step3": [
            ["Regional Server A", "Parent Cluster", "Active Ingestion", "Mutual Reachable"],
            ["Regional Server C", "Parent Cluster", "Active Ingestion", "Direct Lookup"]
        ],
        "rows_step4": [
            ["Unified Network", "Canonical Master", "Bounded Rank", "Single Class"],
            ["Inverse Ackermann", "Constant Time", "Four Max Steps", "Optimal Scaling"]
        ]
    },
    # Part 2 Table Spec
    {
        "columns": ["Host Cluster", "Heuristic Applied", "Winning Master", "Aggregate Size"],
        "rows_step1": [
            ["Cluster One", "Union By Size", "Host One", "Three Members"],
            ["Cluster Two", "Union By Size", "Host Four", "Two Members"]
        ],
        "rows_step2": [
            ["Combined Hosts", "Subordinate Two", "Host One Master", "Five Members"],
            ["Path Compression", "Two Pass Flatten", "Direct Children", "Depth One Tree"]
        ],
        "rows_step3": [
            ["Host Four Node", "Pointer Shifted", "Points Host One", "Instant Find"],
            ["Host Five Node", "Pointer Shifted", "Points Host One", "Cache Aligned"]
        ],
        "rows_step4": [
            ["Typed Buffer RAM", "Contiguous Integers", "Prefetcher Load", "Minimal Misses"],
            ["Subtree Height", "Logarithmic Bound", "Binary Ratio", "Certified Fast"]
        ]
    },
    # Part 3 Table Spec
    {
        "columns": ["Timeline Interval", "Graph Action", "Rollback State", "Connectivity Result"],
        "rows_step1": [
            ["Time Step Zero", "Alpha Beta Active", "Baseline Level", "Isolated Gamma"],
            ["Time Step One", "Beta Gamma Active", "Pushed Union", "Connected Path"]
        ],
        "rows_step2": [
            ["Time Step Two", "Both Links Active", "Stable Level", "Full Triad Mesh"],
            ["Time Step Three", "Beta Gamma Closed", "Popped Union", "Partition Restored"]
        ],
        "rows_step3": [
            ["Segment Tree Node", "Interval Bound", "Canonical Decompose", "Log Tree Steps"],
            ["Euler Traversal", "Depth First Tour", "Post Order Pop", "Zero State Leak"]
        ],
        "rows_step4": [
            ["Forensic Audit", "Replay Orders", "Microsecond Time", "Accurate Timeline"],
            ["Dynamic Complexity", "Log Squared Bound", "Fast Resolution", "Verified Math"]
        ]
    },
    # Part 4 Table Spec
    {
        "columns": ["Stack Record", "Parent Restored", "Rank Adjusted", "Operation Status"],
        "rows_step1": [
            ["Primary Core Link", "Switch One", "Rank Zero Base", "Permanent Root"],
            ["Secondary Branch", "Switch Two", "Attached Under One", "Active Route"]
        ],
        "rows_step2": [
            ["Speculative Union", "Switch Three Attached", "Rank Incremented", "Hypothesis Open"],
            ["Snapshot Marker", "History Depth Two", "Checkpoint Saved", "Ready For Test"]
        ],
        "rows_step3": [
            ["Popped Operation", "Reset Self Pointer", "Rank Decremented", "Undo Complete"],
            ["Restored Baseline", "Switch Three Isolated", "Rank Normalized", "Zero Pollution"]
        ],
        "rows_step4": [
            ["No Path Compress", "Tree Height Intact", "Pure Undo Stack", "Constant Rollback"],
            ["Speculative Routing", "Subsecond Trial", "Zero Crash Risk", "Production Safe"]
        ]
    },
    # Part 5 Table Spec
    {
        "columns": ["Mesh Domain", "Cluster Health", "Component Count", "Oracle Decision"],
        "rows_step1": [
            ["US East Region", "Gateway Connected", "Three Hosts Cluster", "Subnet Ready"],
            ["EU Central Region", "Gateway Connected", "Two Hosts Cluster", "Subnet Ready"]
        ],
        "rows_step2": [
            ["Baseline Network", "Two Separate Islands", "Partitioned State", "Alert Logged"],
            ["Speculative WAN", "Simulate Transatlantic", "Unified One Mesh", "Approved Route"]
        ],
        "rows_step3": [
            ["Executed Rollback", "Restored Baseline", "Two Islands State", "Zero Telemetry Drift"],
            ["Prometheus Gauge", "Component Counter", "Cluster Diameter", "Monitored Metric"]
        ],
        "rows_step4": [
            ["SDN Controller", "Automated Failover", "Backup WireGuard", "Disaster Proof"],
            ["Production Oracle", "Logarithmic Latency", "Verified Quorum", "Optimal Status"]
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
        "title": f"{title_short} Matrix",
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

prompt_str = f"Course dsa-optim Day 34: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 34,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-34.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully!")
