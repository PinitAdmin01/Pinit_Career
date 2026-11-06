# scripts/branch_c/enrich_day56.py
import json

with open("scripts/branch_c/day56_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Part 1: Extra paragraphs
p1_extra1 = (
    "To establish a rigorous mathematical foundation for computational geometry, we must first understand the geometric properties of affine spaces and linear transformations in two dimensions. Unlike standard Euclidean vectors which are defined purely by magnitude and direction emanating from the origin, geometric algorithms frequently operate upon affine points, directed line segments, and affine combinations."
)
p1_extra2 = (
    "The 2D orientation predicate can be interpreted as the signed area of the parallelogram spanned by vectors PQ and PR. When this signed area is strictly positive, vector PR lies strictly to the left of directed vector PQ, corresponding to a counter-clockwise orientation. Conversely, when the determinant evaluates to a negative quantity, PR lies to the right of PQ, indicating a clockwise turning angle."
)
p1_extra3 = (
    "A critical subtlety in industrial geometry engines is the handling of numerical degeneracy. If three points P, Q, and R lie along an identical geometric line, the signed determinant evaluates to zero. In practice, whether collinear boundary points should be classified as part of the convex hull or discarded depends heavily on application requirements. In boundary containment and collision detection, omitting collinear interior points minimizes vertex count without altering spatial coverage."
)
p1_extra4 = (
    "In IEEE 754 double-precision floating-point arithmetic, roundoff errors can produce catastrophic topological inconsistencies known as predicate failures. For example, three nearly collinear points might evaluate as counter-clockwise when tested in order (P, Q, R), but evaluate as counter-clockwise as well when tested in reverse (R, Q, P)—violating antisymmetry. Jonathan Shewchuk's seminal work on adaptive precision floating-point arithmetic demonstrates that evaluating orientation predicates with exact rational numbers or filtered precision is necessary to prevent algorithmic crashes in production CAD, GIS, and game engines."
)
p1_extra5 = (
    "When coordinates are represented as 64-bit signed integers, exact orientation testing can be performed without division or transcendental function calls. The difference terms (Q.x - P.x) and (R.y - P.y) can span up to 2^31 - 1, meaning their products can reach 2^62, comfortably fitting within 64-bit integer limits (or JavaScript's BigInt if coordinates exceed 53-bit integer precision)."
)
p1_extra6 = (
    "By encapsulating the 2D cross product within a strongly typed, zero-overhead utility function, our software architecture ensures that downstream algorithms—from convex hulls to polygon triangulation and Voronoi diagram generation—rely on a single, battle-tested geometric predicate kernel."
)
p1_extra7 = (
    "Understanding the orientation predicate is not merely a theoretical exercise; it represents the mathematical building block upon which all planar computational geometry rests. Without robust orientation testing, advanced spatial algorithms become brittle and prone to catastrophic failure under edge cases."
)

# Part 2: Extra paragraphs
p2_extra1 = (
    "The theoretical foundation of the convex hull is deeply rooted in convex analysis and Caratheodory's Theorem, which establishes that any point within the convex hull of a subset of R^2 can be expressed as a convex combination of at most three points from that set. The convex hull forms the boundary of the intersection of all convex sets containing the points, or equivalently, the intersection of all closed half-planes bounded by lines passing through pairs of points."
)
p2_extra2 = (
    "Ronald Graham's breakthrough was recognizing that sorting points by polar angle transforms an otherwise intractable global spatial search into a local, sequential verification problem. By designating the pivot point as the global reference origin, the polar angle of any point S with respect to the pivot monotonically increases from 0 to 180 degrees."
)
p2_extra3 = (
    "To sort points by polar angle without incurring the computational expense and numerical instability of transcendental trigonometric functions (such as Math.atan2), modern implementations utilize the orientation predicate directly as a custom comparator. For any two points A and B, point A precedes point B in polar order if the orientation of triplet (pivot, A, B) is strictly counter-clockwise."
)
p2_extra4 = (
    "When two candidate points A and B are collinear with the pivot, polar angle comparisons alone cannot distinguish their relative order. To resolve this degeneracy deterministically, Graham Scan sorts collinear points by their squared Euclidean distance from the pivot. During stack processing, interior collinear points are safely popped, preserving only the outermost extreme vertex on the boundary."
)
p2_extra5 = (
    "The stack-based scanning phase exhibits an elegant amortized computational complexity that can be proven using the potential method of amortized analysis. Let Phi denote the number of points currently on the stack. Pushing a new point onto the stack increments Phi by one. Each while-loop iteration pops an invalid vertex, decrementing Phi by one. Since at most N points are pushed, the total number of pop operations across the entire algorithm cannot exceed N, proving that the stack processing phase executes in strict O(N) amortized time."
)
p2_extra6 = (
    "Consequently, the asymptotic complexity of Graham Scan is strictly bounded by the comparison-based sorting phase, which requires O(N log N) time. It has been mathematically proven via reduction from sorting that any algorithm computing the convex hull of N planar points in an algebraic computation tree model requires Omega(N log N) operations in the worst case."
)
p2_extra7 = (
    "Mastering Graham Scan equips developers with a deep appreciation for algorithmic efficiency, showcasing how strategic sorting and monotonic data structures combine to reduce seemingly complex two-dimensional problems to linear-time sweeps."
)

# Part 3: Extra paragraphs
p3_extra1 = (
    "While Graham Scan represents a milestone in computer science history, practical implementations in enterprise GIS platforms, geospatial libraries (such as GEOS and JTS), and robotics navigation stacks overwhelmingly favor Andrew's Monotone Chain algorithm. The primary motivation lies in the sheer numerical stability and simplicity of lexicographical Cartesian sorting compared to polar angle sorting."
)
p3_extra2 = (
    "In standard polar sorting, small numerical perturbations in the coordinates of points nearly collinear with the pivot can cause dramatic swings in their relative angular ordering. Furthermore, floating-point inaccuracies in computing the pivot or handling points with identical y-coordinates require cumbersome boundary case handling. In contrast, lexicographical sorting compares x-coordinates first and y-coordinates second—an operation that is completely immune to angular singularities."
)
p3_extra3 = (
    "The conceptual beauty of Andrew's Monotone Chain is its decomposition of the closed convex boundary into two x-monotone polygonal chains. An x-monotone chain is a polygonal path such that any vertical line intersects the path at most once. By sorting points by x-coordinate, the lower boundary and upper boundary can be traced independently in strict left-to-right order."
)
p3_extra4 = (
    "During the construction of the lower hull, the algorithm scans from the leftmost point (minimum x) to the rightmost point (maximum x). As each point is processed, the algorithm enforces a local invariant: every adjacent triplet on the lower hull must make a strict counter-clockwise turn. If a clockwise or collinear turn is detected, the middle vertex is interior to the lower boundary and is popped from the stack."
)
p3_extra5 = (
    "Symmetrically, the upper hull is constructed by scanning in reverse order—from the rightmost point back to the leftmost point—while enforcing the identical counter-clockwise turning condition. Alternatively, the upper hull can be constructed by scanning left to right while enforcing a clockwise turning condition; however, using counter-clockwise turns in reverse order maintains complete code symmetry and simplifies unit testing."
)
p3_extra6 = (
    "When merging the lower and upper hulls into the final convex polygon, the last element of the lower hull is identical to the first element of the upper hull (the rightmost extreme point), and the last element of the upper hull is identical to the first element of the lower hull (the leftmost extreme point). Popping the trailing element from each chain prior to concatenation prevents vertex duplication and yields a strictly counter-clockwise ordered polygon."
)
p3_extra7 = (
    "Andrew's Monotone Chain operates in O(N log N) time, dominated entirely by the lexicographical sorting phase. Once sorted, both the lower hull and upper hull sweeps execute in O(N) time, making Monotone Chain one of the fastest and most numerically robust 2D convex hull algorithms available."
)
p3_extra8 = (
    "In high-performance applications, the sorted array of points can be reused across multiple successive queries, amortizing the sorting overhead and allowing dynamic geometric systems to update hulls with extraordinary throughput."
)

# Part 4: Extra paragraphs
p4_extra1 = (
    "Once the convex hull of a point set has been computed, the geometric complexity of the problem is dramatically reduced: an arbitrary cloud of N points is summarized by a simple convex polygon of H vertices, where H <= N. However, downstream spatial operations—such as finding the maximum fleet separation distance, computing minimum enclosing bounding boxes, or determining polygon collision separation axes—can still degrade to O(H^2) if approached naively."
)
p4_extra2 = (
    "Godfried Toussaint's Rotating Calipers algorithm solves this challenge by introducing an ingenious mechanical analogy: imagine placing a two-pronged caliper around the convex polygon and rotating the caliper through a full 360-degree rotation while keeping both caliper arms tangent to opposite sides of the polygon at all times."
)
p4_extra3 = (
    "The points where the caliper arms touch the polygon boundary are called antipodal pairs. Two vertices Pi and Pj form an antipodal pair if and only if there exist two parallel lines of support passing through Pi and Pj such that the entire polygon lies entirely between the two lines. The maximum distance between any two points in the original set is guaranteed to be attained by at least one antipodal pair on the convex hull."
)
p4_extra4 = (
    "To implement rotating calipers without explicitly simulating continuous angle rotations, the algorithm exploits the relationship between triangle area and perpendicular distance. For a base edge (Pi, Pi+1), the vertex Pj that maximizes the perpendicular distance to the edge is precisely the vertex that maximizes the area of triangle (Pi, Pi+1, Pj), which can be evaluated directly via the cross-product determinant."
)
p4_extra5 = (
    "As the base edge index i advances around the polygon in counter-clockwise order, the optimal antipodal vertex j also moves monotonically in the counter-clockwise direction. Therefore, pointer j does not need to be reset to 0 for each new edge; instead, pointer j simply continues advancing forward around the polygon until the triangle area ceases to increase."
)
p4_extra6 = (
    "Because both pointer i and pointer j advance around the polygon at most twice throughout the entire procedure, the total number of cross-product evaluations and distance calculations is bounded by O(H). Combining Andrew's Monotone Chain with Rotating Calipers yields an end-to-end diameter calculation that executes in O(N log N) total time."
)
p4_extra7 = (
    "Beyond computing the maximum diameter, rotating calipers generalizes seamlessly to finding the Minimum Area Bounding Box (also known as the Oriented Bounding Box or OBB). By tracking four simultaneous caliper jaws at 90-degree orthogonal angles, the algorithm identifies the rectangle of minimum area enclosing the entire point set in linear O(H) time."
)
p4_extra8 = (
    "This elegant duality between support lines, cross-product areas, and monotonic pointer tracking underscores the immense power of discrete computational geometry in production software engineering."
)

# Part 5: Extra paragraphs
p5_extra1 = (
    "The EnterpriseFleetPerimeterEngine represents a textbook synthesis of theoretical geometry and mission-critical cloud-edge software engineering. In modern autonomous avionics and urban delivery ecosystems, drone operators manage fleets that range from dozens to thousands of autonomous aircraft flying in close formation over densely populated metropolitan zones."
)
p5_extra2 = (
    "Every aircraft streams periodic telemetry packets containing real-time GPS coordinates, barometric altitude, ground speed, and battery health. The perimeter engine aggregates these telemetry streams into an in-memory spatial state store, providing an always-up-to-date model of the fleet's physical distribution."
)
p5_extra3 = (
    "At every operational epoch (typically every 100 to 500 milliseconds), the engine triggers an airspace geofence calculation. By feeding the active fleet positions into Andrew's Monotone Chain, the engine extracts the minimal convex boundary enclosing all drones. This convex polygon represents the absolute minimum airspace footprint required by the fleet at that exact instant."
)
p5_extra4 = (
    "Once the convex geofence boundary is established, the engine immediately executes the Rotating Calipers algorithm to compute the fleet diameter. If the maximum distance between any two drones exceeds the maximum range of their mesh communications antennas (for example, 500 meters), the engine raises an operational telemetry alert indicating that the swarm is at risk of network fragmentation."
)
p5_extra5 = (
    "Equally vital is the engine's real-time containment testing capability. When an autonomous patrol drone or delivery vehicle reports its coordinates, the system must verify whether the aircraft is operating within authorized fleet boundaries. While general non-convex polygon containment requires the ray-casting algorithm (which involves parity testing and complex edge-case handling for ray-vertex intersections), convex polygons allow an ultra-fast O(H) orientation test."
)
p5_extra6 = (
    "Specifically, because the convex hull vertices are ordered counter-clockwise, any point that lies inside the convex polygon must lie to the left of every directed edge along the perimeter. By evaluating getOrientation(V[i], V[i+1], P) for each edge, the engine determines containment with zero trigonometric calculations, zero floating-point division, and immediate short-circuiting on the first clockwise turn."
)
p5_extra7 = (
    "In addition to safety containment, the EnterpriseFleetPerimeterEngine exposes REST and WebSocket APIs allowing civil aviation authorities and automated air traffic management (UTM) networks to query active fleet perimeters in real time, enabling safe deconfliction between autonomous commercial drones and emergency medical helicopters."
)
p5_extra8 = (
    "Through its zero-allocation architecture, robust numerical invariants, and optimal O(N log N) algorithmic pipeline, the EnterpriseFleetPerimeterEngine establishes an industrial benchmark for geospatial systems engineering, safeguarding both airborne fleets and ground infrastructure."
)

# Append to say arrays
d["parts"][0]["say"].extend([p1_extra1, p1_extra2, p1_extra3, p1_extra4, p1_extra5, p1_extra6, p1_extra7])
d["parts"][1]["say"].extend([p2_extra1, p2_extra2, p2_extra3, p2_extra4, p2_extra5, p2_extra6, p2_extra7])
d["parts"][2]["say"].extend([p3_extra1, p3_extra2, p3_extra3, p3_extra4, p3_extra5, p3_extra6, p3_extra7, p3_extra8])
d["parts"][3]["say"].extend([p4_extra1, p4_extra2, p4_extra3, p4_extra4, p4_extra5, p4_extra6, p4_extra7, p4_extra8])
d["parts"][4]["say"].extend([p5_extra1, p5_extra2, p5_extra3, p5_extra4, p5_extra5, p5_extra6, p5_extra7, p5_extra8])

with open("scripts/branch_c/day56_lesson.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("Enriched day56_lesson.json successfully.")
for i, p in enumerate(d["parts"]):
    wc = len(" ".join(p["say"]).split())
    print(f"Part {i+1}: {wc} words (say items: {len(p['say'])})")

total = sum(len(" ".join(p["say"]).split()) for p in d["parts"])
print(f"Total words: {total}")
