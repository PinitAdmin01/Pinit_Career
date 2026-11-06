# scripts/branch_c/generate_dsa_visuals_day57.py
import json
import hashlib
import os

with open("scripts/branch_c/day57_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Planar computational geometry detects line segment intersections.",
        "say2": "Geometric software executes segment intersection primitive operations.",
        "example": "Layout engine applies bounding box filtering and orientation tests.",
        "tryIt": "Examine typescript code combining bounding box and straddle tests."
    },
    # Part 2
    {
        "say1": "Collection testing finds all intersections among line segments.",
        "say2": "Bentley Ottmann sweep line algorithm achieves output sensitive time.",
        "example": "Transportation department analyzes transit line segments in network.",
        "tryIt": "Examine typescript code solving linear system for exact coordinates."
    },
    # Part 3
    {
        "say1": "Divide and conquer strategy solves closest pair of points in space.",
        "say2": "Decomposing plane recursively across vertical median coordinate.",
        "example": "Radar system tracks aircraft executing closest pair safety monitor.",
        "tryIt": "Examine typescript code splitting points and scanning median strip."
    },
    # Part 4
    {
        "say1": "Hierarchical spatial quadtree accelerates dynamic collision queries.",
        "say2": "Quadtree decomposes rectangular space into four equal quadrants.",
        "example": "City ridesharing platform indexes vehicles in quadtree bounding box.",
        "tryIt": "Examine typescript code subdividing boxes and pruning quadrants."
    },
    # Part 5
    {
        "say1": "Enterprise avionics platform synthesizes relative velocity vectors.",
        "say2": "Air traffic management systems calculate closest point of approach.",
        "example": "Control sector monitors aircraft generating deconfliction waypoint.",
        "tryIt": "Explore complete enterprise engine generating deconfliction waypoints."
    }
]

titles = [
    "Line Segment Intersection Orientation Straddle Verification.",
    "Bentley Ottmann Vertical Sweep Line Dynamic Status Tree.",
    "Closest Pair Of Points Divide And Conquer Strip Filter.",
    "Hierarchical Spatial QuadTree Quadrant Decomposition Model.",
    "Enterprise Autonomous Aircraft Collision Avoidance Matrix."
]

columns_list = [
    ["Segment Bounding Box", "Straddle Orientation Sign", "Geometric Intersection State"],
    ["Sweep Line Position", "Event Queue Entry Type", "Status Tree Vertical Neighbor"],
    ["Recursive Spatial Half", "Median Strip Boundary", "Minimum Euclidean Separation"],
    ["Quadrant Compass Sector", "Node Point Capacity", "Spatial Range Pruning State"],
    ["Aircraft Flight Vector", "Closest Approach Metric", "Deconfliction Guidance Action"]
]

rows_list = [
    [
        ["Candidate Segment Pair", "Opposite Straddle Signs", "Valid Interior Intersection"],
        ["Disjoint Coordinate Box", "Filtered Broad Phase", "Immediate Rejection Notice"]
    ],
    [
        ["Vertical Sweep Cursor", "Segment Left Endpoint", "Status Tree Insertion Step"],
        ["Crossing Event Point", "Interchange Tree Order", "Next Neighbor Cross Check"]
    ],
    [
        ["Median Dividing Line", "Delta Proximity Strip", "Optimal Packing Comparison"],
        ["Recursive Subproblem", "Halved Coordinate Subset", "Asymptotic Logarithmic Recurrence"]
    ],
    [
        ["Northwest Quadrant", "Capacitated Bucket Fill", "Recursive Subtree Split"],
        ["Disjoint Window Box", "Bounding Box Rejection", "Subtree Traversal Pruning"]
    ],
    [
        ["Converging Vector Pair", "Critical Approach Time", "Immediate Warning Broadcast"],
        ["Orthogonal Steering Step", "Restored Safe Buffer", "Autonomous Flight Clearance"]
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
    "day": 57,
    "promptSha": "dsa-optim-day-57-segment-intersection-and-closest-pair",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-57.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
