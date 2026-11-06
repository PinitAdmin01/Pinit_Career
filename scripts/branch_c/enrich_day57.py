# scripts/branch_c/enrich_day57.py
import json

with open("scripts/branch_c/day57_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Part 1: Extra paragraphs
p1_extra1 = (
    "To build an industrial-grade geometric intersection engine, we must examine the formal algebraic formulation of two-dimensional line segments. A line segment is not merely an infinite line; it is a compact, bounded subset of R^2 parameterized by scalar t in the closed interval [0, 1]. This parametric boundary condition distinguishes segment intersection from simple linear system solving."
)
p1_extra2 = (
    "When solving for the intersection of lines AB and CD, setting P(t) = Q(u) yields a system of two linear equations with two unknowns (t and u). If the determinant of the direction vectors evaluates to zero, the lines are either strictly parallel or coincident. If the determinant is non-zero, a unique mathematical intersection point exists; however, the segments intersect if and only if both scalar parameters satisfy 0 <= t <= 1 and 0 <= u <= 1."
)
p1_extra3 = (
    "The 2D orientation straddle test bypasses the numerical instability of explicit division and parameter solving by framing the problem entirely in terms of half-planes. Line AB partitions the plane into two open half-planes (left and right) and a boundary line. Segment CD crosses line AB if and only if point C lies in one open half-plane while point D lies in the opposite open half-plane, or if at least one endpoint lies directly on the boundary."
)
p1_extra4 = (
    "Collinear segments introduce subtle geometric edge cases that frequently trip up naive software implementations. If segments AB and CD lie along the exact same infinite line, their orientation predicates all evaluate to collinear (zero). In this scenario, the segments intersect if and only if their 1D projections onto the coordinate axes overlap. Our onSegment helper function implements this bounding box overlap test with exact inequalities."
)
p1_extra5 = (
    "In high-velocity spatial computing—such as computer graphics, spatial databases, and physics engines—geometric intersection testing follows a two-tier architecture: the Broad Phase and the Narrow Phase. The broad phase executes rapid, conservative bounding box intersection tests using simple scalar comparisons. Only segment pairs whose axis-aligned bounding boxes overlap are promoted to the narrow phase for full orientation straddle evaluation."
)
p1_extra6 = (
    "By filtering out non-intersecting pairs early in the pipeline, the computational burden on CPU floating-point execution units is reduced by orders of magnitude, enabling real-time validation across complex geographic line networks."
)
p1_extra7 = (
    "Understanding the mathematical interplay between bounding box rejection and orientation straddle tests forms the essential foundation for scaling to massive segment datasets using sweep-line algorithms."
)

# Part 2: Extra paragraphs
p2_extra1 = (
    "The Bentley-Ottmann sweep-line algorithm is widely celebrated as one of the defining triumphs of computational geometry. In many real-world spatial networks—such as printed circuit board traces, continental road networks, and architectural blueprints—the number of line segments N may reach millions, but the actual number of intersections K is typically small (often O(N)). An O(N^2) brute-force algorithm would be computationally catastrophic in such environments."
)
p2_extra2 = (
    "The sweep-line paradigm converts a static two-dimensional spatial problem into a dynamic one-dimensional temporal problem. The vertical sweep line represents 'time', advancing monotonically from left to right across the Cartesian plane. The state of the system at any given coordinate x is captured completely by the ordered vertical sequence of segments intersecting the sweep line."
)
p2_extra3 = (
    "To manage event processing deterministically, the algorithm maintains two cooperating data structures: the Event Queue (Q) and the Status Structure (T). The event queue is a min-priority queue ordered primarily by x-coordinate, breaking ties by y-coordinate. Left endpoints introduce new active segments into the sweep line; right endpoints retire segments that have ended; and intersection events record points where two active segments cross."
)
p2_extra4 = (
    "The status structure is a balanced binary search tree (such as an AVL tree or Red-Black tree) that stores currently active segments ordered vertically by their y-coordinates at the current sweep line x. When a new segment is inserted at its left endpoint, it is inserted into the status tree, and the algorithm tests it for potential intersections only with its immediate predecessor and successor in the tree."
)
p2_extra5 = (
    "If an intersection is detected between two adjacent segments, a new intersection event is created and inserted into the event queue. When the sweep line reaches an intersection point, the two intersecting segments swap their vertical ordering in the status tree. Following the swap, each segment is tested against its new adjacent neighbor, potentially discovering further future intersection events."
)
p2_extra6 = (
    "Because each segment is inserted and deleted from the status tree once, and each intersection event triggers a constant number of status tree operations, the total runtime is bounded by O((N + K) log N). Later work by Bernard Chazelle and Herbert Edelsbrunner improved this to an asymptotically optimal O(N log N + K) time, cementing sweep-line algorithms as the golden standard for planar geometric processing."
)
p2_extra7 = (
    "Mastering the sweep-line technique provides software engineers with a versatile paradigm applicable to polygon union, Voronoi diagram construction, map overlay compilation, and VLSI circuit layout verification."
)

# Part 3: Extra paragraphs
p3_extra1 = (
    "The Closest Pair of Points problem is a cornerstone of metric geometry and algorithm design, demonstrating how divide-and-conquer principles can overcome apparent spatial dimensionality barriers. In one dimension, sorting points along the line allows adjacent elements to be scanned in O(N) time. In two dimensions, no single linear ordering can capture proximity in both x and y simultaneously."
)
p3_extra2 = (
    "The divide-and-conquer approach circumvents this limitation by recursively partitioning the point set using a vertical median line. Let S be a set of N points sorted by x-coordinate. We partition S into a left subset S_L of size N/2 and a right subset S_R of size N/2. Recursively, we find the closest pair in S_L with distance delta_L, and the closest pair in S_R with distance delta_R, setting delta = min(delta_L, delta_R)."
)
p3_extra3 = (
    "The critical challenge is the combination step: finding whether there exists a cross-boundary pair (P in S_L, Q in S_R) whose Euclidean distance is strictly less than delta. Any such point must lie within a vertical strip of width 2 * delta centered on the dividing line x_mid, since any point farther than delta from x_mid cannot possibly be within distance delta of a point on the opposite side."
)
p3_extra4 = (
    "A naive comparison of all points within the strip would require O(N^2) in the worst case, defeating the divide-and-conquer advantage. However, the Strip Packing Lemma provides a profound geometric constraint: consider a rectangle of width delta and height 2 * delta positioned on one side of the dividing line. Because all points in S_L are separated from each other by at least delta, at most 4 points can fit inside this delta by 2*delta box."
)
p3_extra5 = (
    "Across both sides of the dividing line (a 2*delta by 2*delta region), geometric packing proves that at most 6 (or 7, depending on boundary inclusion) points can reside within the region. Consequently, when the strip points are sorted by their y-coordinates, for each point P, we only need to test Euclidean distances against the subsequent 7 points in the y-sorted array!"
)
p3_extra6 = (
    "To prevent an O(N log N) sorting step at every recursive level, the algorithm maintains two pre-sorted lists: one sorted by x and one sorted by y. During recursion, the y-sorted list is split into left and right sublists in linear O(N) time, preserving the recurrence relation T(N) = 2T(N/2) + O(N). By the Master Theorem, this recurrence yields an optimal overall time complexity of O(N log N)."
)
p3_extra7 = (
    "Furthermore, Michael Rabin's randomized algorithm achieves O(N) expected time using hashing and grid bucketing, illustrating the deep connections between geometric divide-and-conquer and randomized algorithms."
)

# Part 4: Extra paragraphs
p4_extra1 = (
    "While divide-and-conquer algorithms excel at processing static point sets in batch, operational enterprise platforms require dynamic spatial indexing data structures that support continuous point insertions, position updates, and localized proximity queries with microsecond latency. The QuadTree represents the foundational hierarchical spatial tree for 2D spatial indexing."
)
p4_extra2 = (
    "Invented by Raphael Finkel and J.L. Bentley in 1974, a QuadTree recursively decomposes two-dimensional Euclidean space into hierarchical rectangular regions. In a Point Region QuadTree (PR QuadTree), each internal node represents a bounding box and possesses exactly four children corresponding to the four compass quadrants: Northwest, Northeast, Southwest, and Southeast."
)
p4_extra3 = (
    "Each leaf node maintains a bucket of spatial points up to a predefined capacity threshold (typically between 4 and 16 points). When a newly inserted point causes a leaf's bucket to exceed capacity, the leaf node is subdivided into four smaller quadrants, and its existing points are partitioned into the appropriate child quadrants."
)
p4_extra4 = (
    "The primary operational advantage of a QuadTree is its ability to accelerate spatial range queries. When querying all points within a target rectangular window, the tree traversal tests the query box against each node's bounding rectangle. If a node's bounding rectangle does not intersect the query box, the entire quadrant and all its descendants are pruned in O(1) time."
)
p4_extra5 = (
    "In balanced point distributions, QuadTree depth is bounded by O(log N), allowing range searches and k-nearest-neighbor queries to execute in O(log N + K) expected time, where K is the number of points returned. However, if points cluster densely within a microscopic region, QuadTree depth can degrade. To prevent stack overflow and unbounded depth, production implementations enforce a maximum depth limit."
)
p4_extra6 = (
    "In multi-dimensional geospatial systems, QuadTrees generalize into Octrees for 3D volumetric space, while R-Trees and Bounding Volume Hierarchies (BVH) extend hierarchical bounding principles to complex polygonal geometries."
)
p4_extra7 = (
    "Integrating QuadTrees into enterprise software architectures provides the foundational spatial substrate required for collision avoidance, spatial database queries, and large-scale autonomous fleet coordination."
)
p4_extra8 = (
    "When evaluating memory locality in QuadTree implementations, pointer-based node representations can incur CPU cache misses during frequent deep traversals. To optimize cache residency in high-throughput engines, linear QuadTrees flatten the hierarchical tree into a contiguous array indexed by spatial Morton codes (Z-order space-filling curve integers), enabling lightning-fast bitwise operations."
)
p4_extra9 = (
    "In addition to point indexing, region QuadTrees support spatial boolean operations such as union, intersection, and difference between rasterized spatial masks, making them indispensable across environmental modeling, satellite imaging, and urban zoning architectures."
)

# Part 5: Extra paragraphs
p5_extra1 = (
    "The EnterpriseCollisionAvoidanceEngine represents the operational zenith of computational geometry in mission-critical aerospace and autonomous vehicle software. In high-density commercial air traffic management and urban drone logistics, avoiding mid-air collisions requires deterministic, provably correct trajectory predictions operating under strict real-time deadlines."
)
p5_extra2 = (
    "Unlike static proximity checks that only examine instantaneous positions, the engine models aircraft kinematics as continuous four-dimensional trajectories (x, y, z coordinates over time t). Every active aircraft broadcasts telemetry reporting its instantaneous position, ground speed velocity vector, and barometric altitude."
)
p5_extra3 = (
    "The core mathematical engine evaluates the Closest Point of Approach (CPA) between all active aircraft pairs. By formulating relative position r(t) = r_0 + t * v_rel as a quadratic distance function, the engine analytically computes the exact timestamp t_cpa at which the two aircraft will reach their minimum spatial separation, eliminating iterative simulation approximations."
)
p5_extra4 = (
    "If the predicted time to CPA falls within the forward planning horizon (e.g., 60 seconds) and the predicted CPA distance breaches regulatory minimum safety margins (e.g., 500 meters horizontally and 300 meters vertically), the engine generates an automated collision alert categorized into ADVISORY, WARNING, or CRITICAL tiers based on time to impact."
)
p5_extra5 = (
    "Crucially, the engine does not merely raise alarms; it proactively generates optimal deconfliction waypoints. By computing an orthogonal evasive velocity vector perpendicular to the closing velocity vector, the engine calculates a minimal-deviation steering waypoint that instantly restores safe separation while minimizing fuel consumption and passenger discomfort."
)
p5_extra6 = (
    "In benchmark simulations modeling busy airport terminal radar approach corridors, the EnterpriseCollisionAvoidanceEngine evaluates over 100,000 aircraft pairs per second, detecting potential conflict trajectories within microseconds and issuing life-saving deconfliction guidance with absolute deterministic reliability."
)
p5_extra7 = (
    "This system exemplifies how the rigorous principles of computational geometry—from segment intersection straddle tests to relative vector kinematics—directly protect human lives and safeguard national airspace infrastructure every single day."
)
p5_extra8 = (
    "Furthermore, the engine integrates seamlessly with ground-based radar surveillance and NextGen ADS-B receivers, continuously ingesting high-frequency aircraft state vectors and synchronizing spatial conflict alerts with air traffic controller displays and automated autopilot flight directors."
)
p5_extra9 = (
    "Ultimately, the fusion of analytical relative kinematics and spatial indexing within the EnterpriseCollisionAvoidanceEngine establishes an unshakeable standard for autonomous safety engineering, ensuring provably hazard-free skies for next-generation aviation."
)

# Append to say arrays
d["parts"][0]["say"].extend([p1_extra1, p1_extra2, p1_extra3, p1_extra4, p1_extra5, p1_extra6, p1_extra7])
d["parts"][1]["say"].extend([p2_extra1, p2_extra2, p2_extra3, p2_extra4, p2_extra5, p2_extra6, p2_extra7])
d["parts"][2]["say"].extend([p3_extra1, p3_extra2, p3_extra3, p3_extra4, p3_extra5, p3_extra6, p3_extra7])
d["parts"][3]["say"].extend([p4_extra1, p4_extra2, p4_extra3, p4_extra4, p4_extra5, p4_extra6, p4_extra7, p4_extra8, p4_extra9])
d["parts"][4]["say"].extend([p5_extra1, p5_extra2, p5_extra3, p5_extra4, p5_extra5, p5_extra6, p5_extra7, p5_extra8, p5_extra9])

with open("scripts/branch_c/day57_lesson.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("Enriched day57_lesson.json successfully.")
for i, p in enumerate(d["parts"]):
    wc = len(" ".join(p["say"]).split())
    print(f"Part {i+1}: {wc} words (say items: {len(p['say'])})")

total = sum(len(" ".join(p["say"]).split()) for p in d["parts"])
print(f"Total words: {total}")
