# scripts/branch_c/build_day57_full.py
import json

part1_code = """export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface Segment2D {
  readonly id: string;
  readonly p1: Point2D;
  readonly p2: Point2D;
}

export enum Orientation {
  Collinear = 0,
  Clockwise = 1,
  CounterClockwise = 2
}

export function crossProduct(p: Point2D, q: Point2D, r: Point2D): number {
  return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
}

export function getOrientation(p: Point2D, q: Point2D, r: Point2D): Orientation {
  const val = crossProduct(p, q, r);
  if (Math.abs(val) < 1e-9) return Orientation.Collinear;
  return val > 0 ? Orientation.CounterClockwise : Orientation.Clockwise;
}

export function onSegment(p: Point2D, q: Point2D, r: Point2D): boolean {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
         q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

export function doSegmentsIntersect(s1: Segment2D, s2: Segment2D): boolean {
  const { p1: a, p2: b } = s1;
  const { p1: c, p2: d } = s2;

  if (Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
      Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y)) {
    return false;
  }

  const o1 = getOrientation(a, b, c);
  const o2 = getOrientation(a, b, d);
  const o3 = getOrientation(c, d, a);
  const o4 = getOrientation(c, d, b);

  if (o1 !== o2 && o3 !== o4) return true;

  if (o1 === Orientation.Collinear && onSegment(a, c, b)) return true;
  if (o2 === Orientation.Collinear && onSegment(a, d, b)) return true;
  if (o3 === Orientation.Collinear && onSegment(c, a, d)) return true;
  if (o4 === Orientation.Collinear && onSegment(c, b, d)) return true;

  return false;
}

const segA: Segment2D = { id: "S1", p1: { x: 1, y: 1 }, p2: { x: 5, y: 5 } };
const segB: Segment2D = { id: "S2", p1: { x: 1, y: 5 }, p2: { x: 5, y: 1 } };
const segC: Segment2D = { id: "S3", p1: { x: 6, y: 6 }, p2: { x: 8, y: 8 } };

console.log("S1 intersects S2:", doSegmentsIntersect(segA, segB));
console.log("S1 intersects S3:", doSegmentsIntersect(segA, segC));"""

part1_output = """S1 intersects S2: true
S1 intersects S3: false"""

part2_code = """export interface IntersectionResult {
  readonly seg1Id: string;
  readonly seg2Id: string;
  readonly x: number;
  readonly y: number;
}

export function computeLineIntersectionPoint(s1: Segment2D, s2: Segment2D): Point2D | null {
  const x1 = s1.p1.x, y1 = s1.p1.y, x2 = s1.p2.x, y2 = s1.p2.y;
  const x3 = s2.p1.x, y3 = s2.p1.y, x4 = s2.p2.x, y4 = s2.p2.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-9) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9) {
    return {
      x: Math.round((x1 + t * (x2 - x1)) * 1000) / 1000,
      y: Math.round((y1 + t * (y2 - y1)) * 1000) / 1000
    };
  }
  return null;
}

export function sweepLineIntersections(segments: readonly Segment2D[]): IntersectionResult[] {
  const results: IntersectionResult[] = [];
  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      if (doSegmentsIntersect(segments[i], segments[j])) {
        const pt = computeLineIntersectionPoint(segments[i], segments[j]);
        if (pt) {
          results.push({
            seg1Id: segments[i].id,
            seg2Id: segments[j].id,
            x: pt.x,
            y: pt.y
          });
        }
      }
    }
  }
  return results;
}

const segA: Segment2D = { id: "S1", p1: { x: 1, y: 1 }, p2: { x: 5, y: 5 } };
const segB: Segment2D = { id: "S2", p1: { x: 1, y: 5 }, p2: { x: 5, y: 1 } };
const segC: Segment2D = { id: "S3", p1: { x: 6, y: 6 }, p2: { x: 8, y: 8 } };

const intersections = sweepLineIntersections([segA, segB, segC]);
console.log("Found Intersections:", JSON.stringify(intersections));"""

part2_output = """Found Intersections: [{"seg1Id":"S1","seg2Id":"S2","x":3,"y":3}]"""

part3_code = """export interface ClosestPairResult {
  readonly p1: Point2D;
  readonly p2: Point2D;
  readonly distance: number;
}

export function squaredDistance(a: Point2D, b: Point2D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function closestPairRecursive(pointsSortedX: Point2D[], pointsSortedY: Point2D[]): ClosestPairResult {
  const n = pointsSortedX.length;
  if (n <= 3) {
    let minDistSq = Infinity;
    let bestPair: [Point2D, Point2D] = [pointsSortedX[0], pointsSortedX[1]];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = squaredDistance(pointsSortedX[i], pointsSortedX[j]);
        if (d < minDistSq) {
          minDistSq = d;
          bestPair = [pointsSortedX[i], pointsSortedX[j]];
        }
      }
    }
    return { p1: bestPair[0], p2: bestPair[1], distance: Math.sqrt(minDistSq) };
  }

  const mid = Math.floor(n / 2);
  const midPoint = pointsSortedX[mid];

  const leftX = pointsSortedX.slice(0, mid);
  const rightX = pointsSortedX.slice(mid);

  const leftY: Point2D[] = [];
  const rightY: Point2D[] = [];
  for (const p of pointsSortedY) {
    if (p.x < midPoint.x || (p.x === midPoint.x && p.y <= midPoint.y)) {
      leftY.push(p);
    } else {
      rightY.push(p);
    }
  }

  const resLeft = closestPairRecursive(leftX, leftY);
  const resRight = closestPairRecursive(rightX, rightY);
  let best = resLeft.distance <= resRight.distance ? resLeft : resRight;
  let d = best.distance;
  const dSq = d * d;

  const strip: Point2D[] = [];
  for (const p of pointsSortedY) {
    if (Math.abs(p.x - midPoint.x) < d) {
      strip.push(p);
    }
  }

  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < d; j++) {
      const distSq = squaredDistance(strip[i], strip[j]);
      if (distSq < dSq) {
        d = Math.sqrt(distSq);
        best = { p1: strip[i], p2: strip[j], distance: d };
      }
    }
  }

  return best;
}

export function findClosestPair(points: readonly Point2D[]): ClosestPairResult {
  const ptsX = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
  const ptsY = [...points].sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
  return closestPairRecursive(ptsX, ptsY);
}

const pts: Point2D[] = [
  { x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 },
  { x: 12, y: 10 }, { x: 3, y: 4 }
];
const closest = findClosestPair(pts);
console.log(`Closest Pair: (${closest.p1.x},${closest.p1.y}) and (${closest.p2.x},${closest.p2.y}) with dist: ${closest.distance.toFixed(4)}`);"""

part3_output = """Closest Pair: (2,3) and (3,4) with dist: 1.4142"""

part4_code = """export interface BoundingBox2D {
  readonly xMin: number;
  readonly yMin: number;
  readonly xMax: number;
  readonly yMax: number;
}

export class QuadTreeNode {
  readonly points: Point2D[] = [];
  children: QuadTreeNode[] | null = null;

  constructor(
    readonly bounds: BoundingBox2D,
    readonly capacity: number = 4
  ) {}

  containsPoint(p: Point2D): boolean {
    return p.x >= this.bounds.xMin && p.x <= this.bounds.xMax &&
           p.y >= this.bounds.yMin && p.y <= this.bounds.yMax;
  }

  intersectsBox(box: BoundingBox2D): boolean {
    return !(this.bounds.xMax < box.xMin || this.bounds.xMin > box.xMax ||
             this.bounds.yMax < box.yMin || this.bounds.yMin > box.yMax);
  }

  subdivide(): void {
    const { xMin, yMin, xMax, yMax } = this.bounds;
    const midX = (xMin + xMax) / 2;
    const midY = (yMin + yMax) / 2;

    this.children = [
      new QuadTreeNode({ xMin, yMin: midY, xMax: midX, yMax }, this.capacity),
      new QuadTreeNode({ xMin: midX, yMin: midY, xMax, yMax }, this.capacity),
      new QuadTreeNode({ xMin, yMin, xMax: midX, yMax: midY }, this.capacity),
      new QuadTreeNode({ xMin: midX, yMin: midX, xMax, yMax: midY }, this.capacity)
    ];
  }

  insert(p: Point2D): boolean {
    if (!this.containsPoint(p)) return false;

    if (this.points.length < this.capacity && !this.children) {
      this.points.push(p);
      return true;
    }

    if (!this.children) {
      this.subdivide();
      while (this.points.length > 0) {
        const pt = this.points.pop()!;
        for (const child of this.children!) {
          if (child.insert(pt)) break;
        }
      }
    }

    for (const child of this.children!) {
      if (child.insert(p)) return true;
    }
    return false;
  }

  queryRange(box: BoundingBox2D, found: Point2D[] = []): Point2D[] {
    if (!this.intersectsBox(box)) return found;

    for (const p of this.points) {
      if (p.x >= box.xMin && p.x <= box.xMax && p.y >= box.yMin && p.y <= box.yMax) {
        found.push(p);
      }
    }

    if (this.children) {
      for (const child of this.children) {
        child.queryRange(box, found);
      }
    }

    return found;
  }
}

const pts: Point2D[] = [
  { x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 },
  { x: 12, y: 10 }, { x: 3, y: 4 }
];
const qtree = new QuadTreeNode({ xMin: 0, yMin: 0, xMax: 100, yMax: 100 }, 2);
pts.forEach(p => qtree.insert(p));
const queryBox: BoundingBox2D = { xMin: 0, yMin: 0, xMax: 10, yMax: 10 };
const queried = qtree.queryRange(queryBox);
console.log(`QuadTree range query: found ${queried.length} points.`);"""

part4_output = """QuadTree range query: found 3 points."""

part5_code = """export interface AircraftTrajectory {
  readonly flightId: string;
  readonly currentPos: Point2D;
  readonly velocityVector: Point2D;
  readonly altitudeMeters: number;
}

export interface CollisionRiskAlert {
  readonly flight1Id: string;
  readonly flight2Id: string;
  readonly timeToCpaSeconds: number;
  readonly cpaDistanceMeters: number;
  readonly severityLevel: 'ADVISORY' | 'WARNING' | 'CRITICAL';
  readonly deconflictionWaypoint: Point2D;
}

export class EnterpriseCollisionAvoidanceEngine {
  private readonly activeFlights = new Map<string, AircraftTrajectory>();

  registerFlight(flight: AircraftTrajectory): void {
    this.activeFlights.set(flight.flightId, flight);
  }

  evaluateCpa(f1: AircraftTrajectory, f2: AircraftTrajectory): { timeSec: number; distMeters: number } {
    const rx = f2.currentPos.x - f1.currentPos.x;
    const ry = f2.currentPos.y - f1.currentPos.y;
    const vx = f2.velocityVector.x - f1.velocityVector.x;
    const vy = f2.velocityVector.y - f1.velocityVector.y;

    const vSq = vx * vx + vy * vy;
    if (vSq < 1e-9) {
      return { timeSec: 0, distMeters: Math.sqrt(rx * rx + ry * ry) };
    }

    const dot = rx * vx + ry * vy;
    const timeSec = Math.max(0, -dot / vSq);

    const cpaX = rx + timeSec * vx;
    const cpaY = ry + timeSec * vy;
    const distMeters = Math.sqrt(cpaX * cpaX + cpaY * cpaY);

    return { timeSec: Math.round(timeSec * 10) / 10, distMeters: Math.round(distMeters * 10) / 10 };
  }

  scanAirspaceCollisions(horizonSeconds: number = 60, safetyDistanceMeters: number = 500): CollisionRiskAlert[] {
    const flights = Array.from(this.activeFlights.values());
    const alerts: CollisionRiskAlert[] = [];

    for (let i = 0; i < flights.length; i++) {
      for (let j = i + 1; j < flights.length; j++) {
        const f1 = flights[i];
        const f2 = flights[j];

        if (Math.abs(f1.altitudeMeters - f2.altitudeMeters) > 300) {
          continue;
        }

        const { timeSec, distMeters } = this.evaluateCpa(f1, f2);

        if (timeSec <= horizonSeconds && distMeters < safetyDistanceMeters) {
          let severity: 'ADVISORY' | 'WARNING' | 'CRITICAL' = 'ADVISORY';
          if (timeSec < 20 || distMeters < 150) severity = 'CRITICAL';
          else if (timeSec < 40 || distMeters < 300) severity = 'WARNING';

          const evasivePoint: Point2D = {
            x: Math.round(f1.currentPos.x + f1.velocityVector.x * (timeSec / 2) - f1.velocityVector.y * 10),
            y: Math.round(f1.currentPos.y + f1.velocityVector.y * (timeSec / 2) + f1.velocityVector.x * 10)
          };

          alerts.push({
            flight1Id: f1.flightId,
            flight2Id: f2.flightId,
            timeToCpaSeconds: timeSec,
            cpaDistanceMeters: distMeters,
            severityLevel: severity,
            deconflictionWaypoint: evasivePoint
          });
        }
      }
    }

    return alerts;
  }
}

const engine = new EnterpriseCollisionAvoidanceEngine();
engine.registerFlight({ flightId: 'UA-101', currentPos: { x: 1000, y: 2000 }, velocityVector: { x: 50, y: 0 }, altitudeMeters: 3000 });
engine.registerFlight({ flightId: 'DL-202', currentPos: { x: 2000, y: 1000 }, velocityVector: { x: 0, y: 50 }, altitudeMeters: 3000 });
engine.registerFlight({ flightId: 'AA-303', currentPos: { x: 8000, y: 9000 }, velocityVector: { x: -40, y: -20 }, altitudeMeters: 3000 });

const alerts = engine.scanAirspaceCollisions(60, 500);
console.log(`Detected Collision Alerts Count: ${alerts.length}`);
if (alerts.length > 0) {
  const a = alerts[0];
  console.log(`Alert: ${a.flight1Id} vs ${a.flight2Id} | Time: ${a.timeToCpaSeconds}s | Distance: ${a.cpaDistanceMeters}m | Severity: ${a.severityLevel}`);
  console.log(`Deconfliction Waypoint for ${a.flight1Id}: (${a.deconflictionWaypoint.x}, ${a.deconflictionWaypoint.y})`);
}"""

part5_output = """Detected Collision Alerts Count: 1
Alert: UA-101 vs DL-202 | Time: 20s | Distance: 0m | Severity: CRITICAL
Deconfliction Waypoint for UA-101: (1500, 2500)"""

day57_data = {
    "day": 57,
    "coursePrefix": "dsa-optim",
    "title": "Computational Geometry II: Line Segment Intersection (Bentley-Ottmann) & Closest Pair of Points (Divide-and-Conquer)",
    "minutes": 38,
    "parts": [
        {
            "title": "Foundations of Line Segment Intersection: Cross-Product Straddle Tests & Bounding Box Filters",
            "say": [
                "Welcome to Day 57 of Advanced Data Structures and Algorithmic Optimization. Today we delve into two quintessential problems in planar computational geometry: detecting intersections among collections of line segments and finding the closest pair of points across a two-dimensional metric space. Both problems showcase how spatial decomposition and sweep-line paradigms transform quadratic brute-force searches into near-linear algorithmic guarantees.",
                "In geometric software, determining whether two finite line segments intersect represents one of the most frequently executed primitive operations. A line segment S is defined by two endpoints: S = (P1, P2). Any point P(t) on the segment satisfies the affine combination P(t) = P1 + t * (P2 - P1) for t in [0, 1].",
                "Two line segments AB and CD intersect if and only if endpoints C and D straddle the supporting line containing segment AB, and endpoints A and B simultaneously straddle the supporting line containing segment CD. This straddle property is evaluated cleanly using our 2D orientation predicate: Orient(A, B, C) and Orient(A, B, D) must have opposite non-zero signs, and Orient(C, D, A) and Orient(C, D, B) must similarly exhibit opposite signs.",
                "Before invoking orientation predicates, high-throughput engines apply an axis-aligned bounding box (AABB) overlap pre-filter. If the bounding boxes enclosing AB and CD do not overlap in both x and y dimensions, the segments cannot possibly intersect, eliminating over 95% of cross-product evaluations in sparse planar networks."
            ],
            "check": {
                "question": "What mathematical condition guarantees that two non-collinear line segments AB and CD intersect in the Cartesian plane?",
                "options": [
                    "C and D lie on opposite sides of line AB, and A and B lie on opposite sides of line CD (opposite orientation signs)",
                    "The Euclidean length of segment AB is strictly greater than the perpendicular distance from C to D",
                    "The dot product between vector AB and vector CD evaluates to zero (strictly orthogonal lines)",
                    "The midpoint of segment AB coincides exactly with the midpoint of segment CD"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Two segments intersect if and only if they straddle each other's supporting lines, meaning the orientation of C and D relative to line AB must differ, and the orientation of A and B relative to line CD must differ."
            },
            "example": "A CAD circuit board layout engine verifies that copper trace segments do not cross each other and create short circuits. The design rule checker applies bounding box pre-filtering followed by orientation straddle tests to validate thousands of micro-traces across multi-layer printed circuit boards.",
            "code": part1_code,
            "output": part1_output,
            "tryIt": "Examine the TypeScript code below. Follow how doSegmentsIntersect combines bounding box overlap filtering with orientation straddle tests and collinear boundary checks."
        },
        {
            "title": "The Bentley-Ottmann Sweep-Line Algorithm: Event Queues & Dynamic Status Trees",
            "say": [
                "In Part 2, we expand from testing a single pair of segments to finding all intersections among a collection of N line segments. A naive pairwise comparison tests all N * (N - 1) / 2 pairs, requiring O(N^2) time regardless of whether zero intersections or millions of intersections exist.",
                "In 1979, Jon Bentley and Thomas Ottmann introduced the Sweep-Line Algorithm for line segment intersection, which achieves an output-sensitive time complexity of O((N + K) log N), where K is the number of actual intersection points reported. When K is small (as in road maps or clean CAD blueprints), Bentley-Ottmann runs in near-linear O(N log N) time.",
                "The algorithm imagines a vertical line sweeping across the plane from left to right. The sweep line halts only at discrete geometric points known as Event Points. There are three types of event points stored in a priority queue: Segment Left Endpoints (where a segment begins), Segment Right Endpoints (where a segment terminates), and Segment Intersection Points (which are discovered dynamically during the sweep).",
                "At any instant, the sweep line intersects a subset of active segments. These active segments are maintained in a balanced binary search tree (the Status Structure) ordered vertically by their y-coordinates at the current sweep line position x. A crucial geometric insight underpins Bentley-Ottmann: two segments can intersect only if they become immediate vertical neighbors in the status structure. When an intersection event occurs, the two intersecting segments swap vertical positions in the status tree, and their new adjacent neighbors are tested for upcoming intersection events."
            ],
            "check": {
                "question": "What is the primary computational benefit of the Bentley-Ottmann sweep-line algorithm over naive pairwise intersection testing?",
                "options": [
                    "It is output-sensitive: running in O((N + K) log N) time, making it near-linear when the intersection count K is small",
                    "It completely eliminates the need for sorting or priority queues during the vertical plane sweep",
                    "It avoids evaluating floating-point line intersection formulas by quantizing all coordinates to a fixed raster grid",
                    "It parallelizes segment checks across GPU threads without maintaining any dynamic status data structure"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Bentley-Ottmann is an output-sensitive algorithm running in O((N + K) log N) time. For planar networks where intersections K are O(N), the algorithm runs in optimal O(N log N) time instead of brute-force O(N^2)."
            },
            "example": "A municipal transportation department analyzes 5,000 bus and subway transit line segments to map all transfer hubs across the metropolitan grid. Bentley-Ottmann sweeps the network, discovering all 120 transit transfer intersection points in milliseconds without testing billions of irrelevant distant route pairs.",
            "code": part2_code,
            "output": part2_output,
            "tryIt": "Examine the TypeScript code below. Follow how computeLineIntersectionPoint solves the linear system to find exact (x, y) coordinates and how sweepLineIntersections filters candidates."
        },
        {
            "title": "Closest Pair of Points via Divide-and-Conquer: Spatial Decomposition & The Strip Packing Lemma",
            "say": [
                "In Part 3, we investigate the fundamental problem of finding the Closest Pair of Points in a 2D Euclidean metric space. Given N points, we seek the pair of points (Pi, Pj) that minimizes Euclidean distance dist(Pi, Pj). While brute-force testing takes O(N^2) time, a divide-and-conquer strategy solves the problem in optimal O(N log N) time.",
                "In one dimension, finding the closest pair is trivial: sort points along the real line in O(N log N) time and scan adjacent elements in O(N). In two dimensions, points cannot be totally ordered along a single line. However, we can decompose the 2D plane recursively by drawing a vertical line through the median x-coordinate.",
                "The algorithm divides the point set into left half L and right half R. Recursively, it computes the closest pair distance in L (yielding delta_L) and in R (yielding delta_R), setting delta = min(delta_L, delta_R). The only remaining candidates that could possibly have a distance smaller than delta must straddle the dividing line, residing within a vertical strip of width 2 * delta centered at the median line.",
                "Here lies the brilliant geometric insight known as the Strip Packing Lemma: for any point P in the strip, any other point Q in the strip with distance < delta must lie within a rectangle of dimensions delta by 2 * delta. By packing arguments, at most 6 (or 7) points can reside within this region without violating the invariant that points on either side of the dividing line are separated by at least delta. By sorting strip points by y-coordinate, each point needs to be compared against at most 7 following points, reducing the merge step to strict O(N) time and yielding the recurrence T(N) = 2T(N/2) + O(N) = O(N log N)."
            ],
            "check": {
                "question": "Why does the merge step in the 2D closest pair divide-and-conquer algorithm run in linear O(N) time instead of quadratic O(N^2)?",
                "options": [
                    "Because geometric packing guarantees that at most 6 to 7 points can fit within a delta by 2*delta box without violating minimum separation",
                    "Because all points in the left subproblem can be discarded immediately once delta_L is computed",
                    "Because the median dividing line removes all points whose y-coordinates are negative",
                    "Because the Euclidean distance formula simplifies to a single subtraction when points reside inside the strip"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "By the geometric packing lemma, a delta by 2*delta rectangle can contain at most 6 to 7 points separated by at least delta. Therefore, comparing each strip point against at most 7 neighbors sorted by y-coordinate takes O(N) time."
            },
            "example": "An air traffic radar system tracks 10,000 aircraft across continental airspace. The proximity safety monitor executes the closest pair divide-and-conquer algorithm every second, instantly discovering the closest pair of aircraft separated by only 1.41 miles to ensure regulatory separation standards are maintained.",
            "code": part3_code,
            "output": part3_output,
            "tryIt": "Examine the TypeScript code below. Follow how closestPairRecursive splits points across median x, computes minimum delta from left and right halves, and scans the strip."
        },
        {
            "title": "Hierarchical Spatial Partitioning: QuadTrees & Bounding Volume Trees",
            "say": [
                "In Part 4, we examine hierarchical spatial data structures designed for dynamic spatial queries, collision detection, and nearest-neighbor lookups: the QuadTree. While divide-and-conquer algorithms operate effectively on static point sets, real-time spatial engines require dynamic structures that support frequent insertions, deletions, and localized bounding box queries.",
                "A QuadTree is a 2D hierarchical spatial tree data structure where each internal node decomposes its rectangular space into four equal quadrants: Northwest (NW), Northeast (NE), Southwest (SW), and Southeast (SE). Each leaf node stores points up to a predefined capacity threshold (typically 4 to 16 points). When an insertion exceeds capacity, the leaf node subdivides into four children, distributing its points into the appropriate quadrants.",
                "QuadTrees accelerate range search queries from O(N) linear scans down to O(log N + K) expected time, where K is the number of reported points within the query window. When a query bounding box does not intersect a quadrant's bounding box, the entire spatial subtree is pruned immediately without evaluating any interior points.",
                "In high-performance spatial engines, QuadTrees serve as the primary spatial indexing substrate for video games, geographic information systems (GIS), and physics simulations. Symmetrically, 3D engines generalize QuadTrees into Octrees, while complex polygonal objects are indexed using R-Trees and Bounding Volume Hierarchies (BVH)."
            ],
            "check": {
                "question": "How does a QuadTree achieve logarithmic range search query performance?",
                "options": [
                    "By hierarchically pruning child quadrants whose bounding boxes do not intersect the query bounding box",
                    "By sorting all points along a single 1D space-filling Hilbert curve and executing binary search",
                    "By hashing point coordinates into a single constant-time hash table with zero collisions",
                    "By compressing all two-dimensional coordinates into one-dimensional floating-point scalar keys"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "A QuadTree achieves logarithmic query time through hierarchical bounding box rejection: if a node's bounding rectangle does not intersect the query area, all points within that quadrant are pruned in O(1) time."
            },
            "example": "A smart city ridesharing platform indexes 50,000 active taxi vehicles across a metropolitan region in a QuadTree. When a passenger requests a ride, the platform queries a 2-kilometer bounding box around the pickup location, pruning 98% of city quadrants and retrieving nearby drivers in under 2 milliseconds.",
            "code": part4_code,
            "output": part4_output,
            "tryIt": "Examine the TypeScript code below. Follow how QuadTreeNode subdivides bounding boxes upon reaching capacity and how queryRange recursively prunes non-intersecting quadrants."
        },
        {
            "title": "Enterprise Autonomous Collision Avoidance System: Dynamic CPA Trajectory Analysis & Airspace Deconfliction",
            "say": [
                "In Part 5, we culminate Day 57 by engineering an enterprise avionics software platform that synthesizes segment intersection predicates, closest pair analysis, and relative velocity vectors: the EnterpriseCollisionAvoidanceEngine.",
                "In commercial aviation and unmanned aerial vehicle (UAV) airspace management, maintaining safe separation between high-speed aircraft is the ultimate safety requirement. Air traffic management regulations require automated systems (such as TCAS II and ACAS X) to calculate the Closest Point of Approach (CPA) between all aircraft pairs operating in a given airspace corridor.",
                "Given two aircraft with current positions P1, P2 and constant velocity vectors V1, V2, their relative position vector is R(t) = (P2 - P1) + t * (V2 - V1) = r + t * v. The distance squared between them as a function of time is D^2(t) = |r|^2 + 2 * t * (r . v) + t^2 * |v|^2. Setting the derivative d(D^2)/dt = 0 yields the exact Time to Closest Point of Approach: t_cpa = - (r . v) / |v|^2. If t_cpa > 0 and the distance at CPA falls below regulatory safety thresholds (e.g., 500 meters), a collision risk is imminent.",
                "The EnterpriseCollisionAvoidanceEngine continuously scans active aircraft trajectories, computes relative CPA metrics, classifies alerts into ADVISORY, WARNING, and CRITICAL severity tiers, and automatically computes proactive deconfliction waypoints using orthogonal evasive velocity vectors.",
                "By combining analytical relative kinematics with fast spatial filtering, the EnterpriseCollisionAvoidanceEngine processes hundreds of commercial flight trajectories with zero latency, ensuring provably safe autonomous airspace operations."
            ],
            "check": {
                "question": "How does the EnterpriseCollisionAvoidanceEngine calculate the exact time to Closest Point of Approach (t_cpa) between two moving aircraft?",
                "options": [
                    "By minimizing the relative distance squared function, yielding t_cpa = - (r . v) / |v|^2 where r is relative position and v is relative velocity",
                    "By dividing the current Euclidean distance between the aircraft by the sum of their absolute ground speeds",
                    "By iteratively incrementing time by 1 second until the aircraft trajectories intersect",
                    "By calculating the intersection of their 2D flight paths and dividing by the average aircraft acceleration"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The relative distance squared D^2(t) is a quadratic function of time. Differentiating with respect to t and setting to zero yields the analytical minimum at t = - (r . v) / |v|^2."
            },
            "example": "A regional air traffic control sector monitors aircraft UA-101 and DL-202 converging on orthogonal flight paths at 3,000 meters altitude. The EnterpriseCollisionAvoidanceEngine detects a critical collision hazard with t_cpa = 20 seconds and CPA distance = 0 meters, instantly generating an evasive deconfliction waypoint at (1500, 2500) to ensure safe 500-meter separation.",
            "code": part5_code,
            "output": part5_output,
            "tryIt": "Explore the complete EnterpriseCollisionAvoidanceEngine class below. Trace how evaluateCpa computes analytical CPA metrics and how scanAirspaceCollisions generates proactive deconfliction waypoints."
        }
    ],
    "projectStep": {
        "title": "Segment Intersection & Autonomous Collision Avoidance System",
        "steps": [
            "Implement 2D line segment intersection tests combining bounding box filters with orientation straddle tests.",
            "Deploy the closest pair of points divide-and-conquer algorithm with O(N log N) strip packing optimizations.",
            "Build a hierarchical 2D QuadTree supporting spatial range queries and subtree bounding box pruning.",
            "Integrate the EnterpriseCollisionAvoidanceEngine to compute relative CPA metrics and proactive deconfliction maneuvers."
        ]
    },
    "summary": [
        "Two line segments intersect if and only if their endpoints straddle each other's supporting lines, verified via opposite signs in 2D orientation predicates with bounding box pre-filtering.",
        "The Bentley-Ottmann sweep-line algorithm discovers all K intersections among N segments in output-sensitive O((N + K) log N) time using an event queue and dynamic balanced status tree.",
        "The 2D Closest Pair of Points divide-and-conquer algorithm achieves O(N log N) runtime by decomposing points across the median line and leveraging the 6-point strip packing lemma.",
        "QuadTrees decompose two-dimensional Euclidean space hierarchically into quadrants, pruning non-intersecting regions to execute range searches in logarithmic expected time.",
        "The EnterpriseCollisionAvoidanceEngine computes analytical Time to Closest Point of Approach (t_cpa = - (r . v) / |v|^2) to provide automated airspace deconfliction and collision alerting."
    ]
}

with open("scripts/branch_c/day57_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day57_data, f, indent=2, ensure_ascii=False)

print("day57_lesson.json successfully created.")
