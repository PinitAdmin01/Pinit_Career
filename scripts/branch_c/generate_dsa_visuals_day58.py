# scripts/branch_c/generate_dsa_visuals_day58.py
import json
import hashlib
import os

with open("scripts/branch_c/day58_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Spatial computing explores voronoi diagram and delaunay triangulation.",
        "say2": "Voronoi diagram partitions plane into convex polygonal regions.",
        "example": "Emergency dispatcher maps ambulance stations in voronoi diagram.",
        "tryIt": "Examine typescript code calculating circumcenter and triangle radius."
    },
    # Part 2
    {
        "say1": "Delaunay triangulation uniquely satisfies empty circumcircle property.",
        "say2": "Angle maximization property maximizes minimum angle across triangles.",
        "example": "Engineering simulation generates delaunay triangulation of nodes.",
        "tryIt": "Examine typescript code evaluating circumcircle determinant of triangle."
    },
    # Part 3
    {
        "say1": "Fortune sweep line algorithm computes complete voronoi diagram.",
        "say2": "Beachline parabolic arcs maintain dynamic spatial boundary curve.",
        "example": "Satellite imaging platform sweeps coordinates generating voronoi diagram.",
        "tryIt": "Examine typescript code finding exact parabola intersection coordinate."
    },
    # Part 4
    {
        "say1": "Euclidean minimum spanning tree connects spatial graph vertices.",
        "say2": "Euclidean minimum spanning tree is guaranteed subgraph of delaunay graph.",
        "example": "Telecommunications utility extracts spanning tree from delaunay mesh.",
        "tryIt": "Examine typescript code extracting delaunay edges for spanning tree."
    },
    # Part 5
    {
        "say1": "Enterprise telecommunications platform manages cellular network towers.",
        "say2": "Voronoi tessellation models service polygon for cellular cell towers.",
        "example": "Network optimizer identifies coverage blind spot across cell towers.",
        "tryIt": "Explore complete enterprise optimizer evaluating network topology."
    }
]

titles = [
    "Voronoi Diagram Perpendicular Bisector Spatial Partition.",
    "Delaunay Triangulation Empty Circumcircle Invariant Model.",
    "Fortune Sweep Line Parabolic Beachline Breakpoint Engine.",
    "Euclidean Minimum Spanning Tree Delaunay Planar Subgraph.",
    "Enterprise Cellular Network Voronoi Topology Optimizer."
]

columns_list = [
    ["Generating Site Seed", "Voronoi Region Convex Cell", "Circumcenter Vertex Locus"],
    ["Candidate Point Query", "In Circumcircle Determinant", "Delaunay Mesh Inclusion"],
    ["Sweep Line Directrix", "Parabolic Arc Intersection", "Breakline Trajectory Path"],
    ["Planar Triangulation Edge", "Euclidean Distance Metric", "Spanning Tree Invariant"],
    ["Base Station Antenna", "Coverage Voronoi Polygon", "Network Blind Spot State"]
]

rows_list = [
    [
        ["Primary Generator Seed", "Perpendicular Half Plane", "Equidistant Voronoi Vertex"],
        ["Convex Hull Boundary", "Unbounded Spatial Ray", "Asymptotic Linear Growth"]
    ],
    [
        ["Inscribed Triangle Face", "Zero Interior Incursion", "Equiangular Delaunay Mesh"],
        ["Bowyer Watson Cavity", "Star Shaped Hole Border", "Incremental Point Insertion"]
    ],
    [
        ["Downward Sweep Cursor", "Parabolic Arc Breakpoint", "Hyperbolic Boundary Trace"],
        ["Converging Arc Triplet", "Circle Event Collapse", "Discovered Voronoi Vertex"]
    ],
    [
        ["Planar Delaunay Edge", "Euler Formula Linear Bound", "Minimum Weight Candidate"],
        ["Disjoint Set Union", "Acyclic Graph Spanner", "Optimal Backbone Topology"]
    ],
    [
        ["Radio Frequency Tower", "Cellular Service Polygon", "Handover Boundary Frontier"],
        ["Largest Empty Circle", "Maximized Gap Radius", "Optimal Small Cell Locus"]
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
    "day": 58,
    "promptSha": "dsa-optim-day-58-voronoi-and-delaunay",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-58.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
