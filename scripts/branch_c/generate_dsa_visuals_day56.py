# scripts/branch_c/generate_dsa_visuals_day56.py
import json
import hashlib
import os

with open("scripts/branch_c/day56_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Computational geometry module analyzes spatial structures and algorithms.",
        "say2": "Orientation predicate evaluates ordered triplet of cartesian points.",
        "example": "Autonomous vehicle navigation evaluates trajectory steering waypoint.",
        "tryIt": "Examine typescript code computing determinant and orientation values."
    },
    # Part 2
    {
        "say1": "Convex hull constructs minimum enclosing convex polygon of planar points.",
        "say2": "Graham scan algorithm constructs convex hull identifying pivot vertex.",
        "example": "Ground station tracks satellites identifying minimum convex perimeter.",
        "tryIt": "Examine typescript code sorting points by polar angle in monotonic stack."
    },
    # Part 3
    {
        "say1": "Monotone chain algorithm sorts points lexicographically by coordinates.",
        "say2": "Lexicographical sorting offers numerical advantages in production systems.",
        "example": "Mapping engine sorts coordinates lexicographically constructing perimeter.",
        "tryIt": "Examine typescript code constructing lower and upper hull into polygon."
    },
    # Part 4
    {
        "say1": "Rotating calipers algorithm evaluates convex hull in linear time.",
        "say2": "Rotating calipers computes convex hull diameter between farthest vertices.",
        "example": "Control system tracks drones computing maximum fleet diameter distance.",
        "tryIt": "Examine typescript code advancing antipodal caliper pointer for distance."
    },
    # Part 5
    {
        "say1": "Enterprise geospatial engine synthesizes monotone chain and calipers.",
        "say2": "Autonomous fleet operators maintain dynamic geofences for drone swarms.",
        "example": "Logistics enterprise tracks drones computing convex geofence perimeter.",
        "tryIt": "Explore complete enterprise engine executing orientation containment."
    }
]

titles = [
    "Two Dimensional Orientation Predicate Determinant Grid.",
    "Graham Scan Convex Hull Polar Angle Monotonic Stack.",
    "Andrews Monotone Chain Lexicographical Hull Decomposition.",
    "Rotating Calipers Antipodal Pair Convex Hull Diameter.",
    "Enterprise Autonomous Fleet Perimeter Geospatial Enclosure."
]

columns_list = [
    ["Geometric Vector Pair", "Determinant Area Sign", "Turn Classification"],
    ["Polar Sweep Vertex", "Stack Top Orientation", "Monotonic Boundary Inclusion"],
    ["Coordinate Sort Key", "Monotone Chain Half", "Convex Boundary Polygon"],
    ["Base Edge Direction", "Antipodal Vertex Target", "Maximum Euclidean Separation"],
    ["Drone Telemetry Node", "Geofence Boundary Vertex", "Containment Status Verification"]
]

rows_list = [
    [
        ["Vector Cross Product", "Positive Signed Determinant", "Strict Counter Clockwise Turn"],
        ["Collinear Ray Triplet", "Zero Determinant Area", "Degenerate Collinear Alignment"]
    ],
    [
        ["Global Pivot Vertex", "Minimum Y Coordinate Point", "Guaranteed Convex Extremum"],
        ["Polar Angle Sequence", "Concave Right Turn Rejection", "Linear Amortized Stack Pop"]
    ],
    [
        ["Lexicographical Sort", "Lower Hull Monotone Sweep", "Leftmost To Rightmost Chain"],
        ["Reverse Lexicographical", "Upper Hull Monotone Sweep", "Rightmost To Leftmost Return"]
    ],
    [
        ["Caliper Tangent Pair", "Maximized Triangle Area", "Antipodal Extremum Discovery"],
        ["Parallel Support Lines", "Monotonic Caliper Advance", "Optimal Linear Scan Bound"]
    ],
    [
        ["Airspace Fleet Telemetry", "Convex Enclosure Boundary", "Real Time Geofence Enforced"],
        ["Autonomous Patrol Drone", "Counter Clockwise Test Pass", "Authorized Flight Corridor"]
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
    "day": 56,
    "promptSha": "dsa-optim-day-56-convex-hulls-and-orientation",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-56.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
