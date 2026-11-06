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

with open("scripts/branch_c/day31_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

entries = []

captions_data = [
    # Part 1
    {
        "say1": "Mathematical abstraction models directed graph connectivity topologies.",
        "say2": "Isolating circular dependencies prevents cascading distributed deadlocks.",
        "example": "Platform models checkout microservice dependency flows.",
        "tryIt": "Directed edge merges components into circular ring."
    },
    # Part 2
    {
        "say1": "Linear algorithm discovers strongly connected components.",
        "say2": "Traversal tracks discovery timestamp and low values.",
        "example": "Automation tool parses software package dependencies.",
        "tryIt": "Exploring back edge updates low link vertex values."
    },
    # Part 3
    {
        "say1": "Bridge detection governs undirected network resilience.",
        "say2": "Undirected traversal mechanics identify cycle boundaries.",
        "example": "Infrastructure audit evaluates regional network routers.",
        "tryIt": "Redundant link resolves critical bridge condition."
    },
    # Part 4
    {
        "say1": "Condensation graph transforms cyclic topologies into pipelines.",
        "say2": "Iterating directed edges constructs condensed graph.",
        "example": "Platform condenses microservices into macro components.",
        "tryIt": "Condensed edges verify absorbed internal invocations."
    },
    # Part 5
    {
        "say1": "TypeScript engine audits graph topology resilience.",
        "say2": "Guardian maintains dual internal graph representations.",
        "example": "Network deploys guardian to audit payment topology.",
        "tryIt": "Registering circular edge updates bridge metrics."
    }
]

table_specs = [
    # Part 1 Table Spec
    {
        "columns": ["Component", "Mutual Reachability", "Axiom Type", "Status"],
        "rows_step1": [
            ["Auth <-> Session", "Bidirectional Path", "Equivalence", "Verified"],
            ["Auth -> Billing", "One Way Dependent", "Asymmetric", "Isolated"]
        ],
        "rows_step2": [
            ["Session -> Auth", "Circular Feedback", "Reflexive Loop", "Protected"],
            ["Token -> Session", "Chained Path", "Transitive", "Equated"]
        ],
        "rows_step3": [
            ["Checkout Mesh", "Full Permutation", "Atomic Unit", "Co-located"],
            ["Payment Gateway", "External Egress", "Acyclic Link", "Bounded"]
        ],
        "rows_step4": [
            ["Billing -> Auth", "Backward Edge", "Merged Cycle", "Warning"],
            ["Master Cluster", "Single Class", "Equivalence Ring", "Contained"]
        ]
    },
    # Part 2 Table Spec
    {
        "columns": ["Vertex", "Discovery (tin)", "Low-Link (low)", "Stack State"],
        "rows_step1": [
            ["Vertex A", "Order Alpha", "Minimum Reached", "Pushed Active"],
            ["Vertex B", "Order Beta", "Inherited Root", "Pushed Active"]
        ],
        "rows_step2": [
            ["Vertex C", "Order Gamma", "Back Edge Pull", "Pushed Active"],
            ["Vertex D", "Order Delta", "Root Entry point", "Evaluation"]
        ],
        "rows_step3": [
            ["Vertex E", "Subtree Order", "Equal Low Link", "Pending Pop"],
            ["Vertex F", "Subtree Term", "Cycle Reached", "Popped SCC"]
        ],
        "rows_step4": [
            ["SCC Cluster One", "Discovered Order", "Component Done", "Popped Clean"],
            ["SCC Cluster Two", "Topological Order", "Metagraph Node", "Finalized"]
        ]
    },
    # Part 3 Table Spec
    {
        "columns": ["Network Conduit", "Parent tin", "Child low", "Classification"],
        "rows_step1": [
            ["Router One -> Two", "Equal Level", "Cycle Back-Edge", "Redundant Mesh"],
            ["Router Two -> Three", "Equal Level", "Cycle Loop", "Protected Link"]
        ],
        "rows_step2": [
            ["Router Three -> Gate", "Preceding Timer", "Strictly Greater", "Vulnerable Bridge"],
            ["Gateway -> CloudEast", "Preceding Timer", "Strictly Greater", "Critical Cut Edge"]
        ],
        "rows_step3": [
            ["Gateway Node", "Internal Vertex", "Subtree Severed", "Cut Vertex"],
            ["Router Three Node", "Transit Junction", "Subtree Isolated", "Articulation Point"]
        ],
        "rows_step4": [
            ["Redundant Transit", "Cycle Formed", "Low Link Dropped", "Survivable Mesh"],
            ["Global Core Trunk", "Biconnected Block", "Disjoint Paths", "High Resilience"]
        ]
    },
    # Part 4 Table Spec
    {
        "columns": ["Original Edge", "Source Cluster", "Target Cluster", "Metagraph Action"],
        "rows_step1": [
            ["Auth -> Token", "Auth Cluster", "Auth Cluster", "Internal Absorbed"],
            ["Session -> Auth", "Auth Cluster", "Auth Cluster", "Cycle Dissolved"]
        ],
        "rows_step2": [
            ["Session -> Billing", "Auth Super-Node", "Billing Super-Node", "Macro-Edge Added"],
            ["Billing -> Invoice", "Billing Cluster", "Billing Cluster", "Internal Absorbed"]
        ],
        "rows_step3": [
            ["Invoice -> Payment", "Billing Cluster", "Billing Cluster", "Absorbed Ring"],
            ["Payment -> Billing", "Billing Cluster", "Billing Cluster", "Absorbed Loop"]
        ],
        "rows_step4": [
            ["Auth Super-Node", "Stage Alpha", "Topological Root", "Acyclic Exec"],
            ["Billing Super-Node", "Stage Beta", "Topological Target", "Acyclic Sched"]
        ]
    },
    # Part 5 Table Spec
    {
        "columns": ["Audit Target", "Directed Metric", "Undirected Metric", "Health Action"],
        "rows_step1": [
            ["Order -> Inventory", "Call Sequence", "Physical Link", "Telemetry Span"],
            ["Inventory -> Payment", "Call Sequence", "Physical Conduit", "Active Ingestion"]
        ],
        "rows_step2": [
            ["Payment -> Order", "Circular Ring", "Mesh Redundancy", "Alert Developer"],
            ["Order -> Gateway", "Acyclic Call", "Vulnerable Bridge", "Flag Risk"]
        ],
        "rows_step3": [
            ["Gateway -> SMS", "Linear Egress", "Critical Conduit", "Auto Provision"],
            ["Service Mesh", "One Cycle Flagged", "Two Cut Edges", "Degraded State"]
        ],
        "rows_step4": [
            ["Remediation Webhook", "Async Queue Cut", "Secondary BGP Fiber", "Self Healing"],
            ["Restored Cluster", "Zero Deadlocks", "Zero Single Points", "Optimal Status"]
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
        "title": f"{title_short} Structural Matrix",
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

prompt_str = f"Course dsa-optim Day 31: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 31,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-31.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully!")
