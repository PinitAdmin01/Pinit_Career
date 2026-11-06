# scripts/branch_c/generate_dsa_visuals_day60.py
import json
import hashlib
import os

with open("scripts/branch_c/day60_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Grand finale capstone synthesizes advanced structures and algorithms.",
        "say2": "Planetary fleet engine coordinates autonomous aerial drone logistics.",
        "example": "Logistics conglomerate manages drones across planetary delivery corridor.",
        "tryIt": "Examine typescript code establishing foundation for spatial analysis."
    },
    # Part 2
    {
        "say1": "Perimeter geofencing subsystem enforces continuous dynamic boundary.",
        "say2": "Monotone chain algorithm constructs convex polygon of boundary drones.",
        "example": "Geofencing subsystem calculates convex hull and farthest drone pair.",
        "tryIt": "Examine typescript code computing convex hull and fleet separation."
    },
    # Part 3
    {
        "say1": "Proximity tessellation models communication coverage and sensor nodes.",
        "say2": "Voronoi diagram and delaunay triangulation model swarm territory.",
        "example": "Coverage analyzer evaluates circumcircles identifying blind spot radius.",
        "tryIt": "Examine typescript code calculating circumcircle and empty circle."
    },
    # Part 4
    {
        "say1": "Trajectory conflict radar provides predictive collision avoidance.",
        "say2": "Relative velocity vectors yield exact time to closest point of approach.",
        "example": "Conflict radar detects collision generating evasive steering waypoint.",
        "tryIt": "Examine typescript code computing analytical collision waypoints."
    },
    # Part 5
    {
        "say1": "Grand finale capstone unifies master planetary fleet engine fabric.",
        "say2": "Engine executes planetary analysis generating executive fleet report.",
        "example": "Operations center executes fleet analysis providing spatial awareness.",
        "tryIt": "Explore complete planetary engine orchestrating executive report."
    }
]

titles = [
    "Planetary Fleet Operating System Multi Layer Architecture.",
    "Swarm Perimeter Geofencing Monotone Chain Boundary Polygon.",
    "Spatial Tessellation Voronoi Circumcenter Blind Spot Radar.",
    "Predictive Trajectory Closest Approach Evasive Deconfliction.",
    "Master Planetary Geospatial Fleet Engine Executive Console."
]

columns_list = [
    ["Architectural Layer", "Algorithmic Invariant", "Autonomous System Outcome"],
    ["Hull Vertex Position", "Antipodal Caliper Pair", "Enclosure Boundary Buffer"],
    ["Voronoi Generator Node", "Circumcenter Gap Center", "Maximum Coverage Radius"],
    ["Closing Trajectory Pair", "Predicted Collision Epoch", "Evasive Guidance Vector"],
    ["Planetary Fleet Token", "Executive Status Metric", "Operational Mission Command"]
]

rows_list = [
    [
        ["Convex Perimeter Layer", "Monotone Chain Convexity", "Sub Microsecond Geofence"],
        ["Relative Kinematics Layer", "Analytical CPA Derivation", "Provable Mid Air Safety"]
    ],
    [
        ["Outer Extreme Boundary", "Counter Clockwise Order", "Guaranteed Convex Enclosure"],
        ["Maximum Fleet Diameter", "Rotating Calipers Scan", "Ad Hoc Mesh Range Buffer"]
    ],
    [
        ["Tessellated Radio Cell", "Perpendicular Bisector Line", "Natural Service Footprint"],
        ["Largest Empty Circle", "Voronoi Vertex Coordinate", "Prioritized Drone Dispatch"]
    ],
    [
        ["Converging Vector Pair", "Critical Approach Time", "Immediate Warning Broadcast"],
        ["Lateral Steering Waypoint", "Orthogonal Velocity Step", "Zero Delay Conflict Free"]
    ],
    [
        ["Autonomous Drone Fleet", "Convex Airspace Enclosure", "Full Mission Compliance"],
        ["Planetary Executive Report", "Deterministic Verification", "Grand Finale Accomplished"]
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
    "day": 60,
    "promptSha": "dsa-optim-day-60-grand-finale-capstone",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-60.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
