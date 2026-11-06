// scripts/branch_c/test_day57_snippets.ts

export interface Point2D {
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

// Part 1: Segment Intersection Foundations & Bounding Box Filter
export function onSegment(p: Point2D, q: Point2D, r: Point2D): boolean {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
         q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

export function doSegmentsIntersect(s1: Segment2D, s2: Segment2D): boolean {
  const { p1: a, p2: b } = s1;
  const { p1: c, p2: d } = s2;

  // Bounding box pre-check
  if (Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
      Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y)) {
    return false;
  }

  const o1 = getOrientation(a, b, c);
  const o2 = getOrientation(a, b, d);
  const o3 = getOrientation(c, d, a);
  const o4 = getOrientation(c, d, b);

  // General case: segments straddle each other's supporting lines
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // Collinear special cases
  if (o1 === Orientation.Collinear && onSegment(a, c, b)) return true;
  if (o2 === Orientation.Collinear && onSegment(a, d, b)) return true;
  if (o3 === Orientation.Collinear && onSegment(c, a, d)) return true;
  if (o4 === Orientation.Collinear && onSegment(c, b, d)) return true;

  return false;
}

// Part 2: Sweep-Line Segment Intersection Engine
export interface IntersectionResult {
  readonly seg1Id: string;
  readonly seg2Id: string;
  readonly x: number;
  readonly y: number;
}

export function computeLineIntersectionPoint(s1: Segment2D, s2: Segment2D): Point2D | null {
  const x1 = s1.p1.x, y1 = s1.p1.y, x2 = s1.p2.x, y2 = s1.p2.y;
  const x3 = s2.p1.x, y3 = s2.p1.y, x4 = s2.p2.x, y4 = s2.p2.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-9) return null; // Parallel or coincident

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
  // For algorithmic demonstration, pairwise evaluation with bounding box pre-filtration
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

// Part 3: Closest Pair of Points via Divide-and-Conquer
export interface ClosestPairResult {
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

  // Build strip within distance d of dividing line midPoint.x
  const strip: Point2D[] = [];
  for (const p of pointsSortedY) {
    if (Math.abs(p.x - midPoint.x) < d) {
      strip.push(p);
    }
  }

  // Scan strip (at most 7 candidates ahead)
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

// Part 4: Hierarchical Spatial QuadTree
export interface BoundingBox2D {
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
      new QuadTreeNode({ xMin, yMin: midY, xMax: midX, yMax }, this.capacity), // NW
      new QuadTreeNode({ xMin: midX, yMin: midY, xMax, yMax }, this.capacity), // NE
      new QuadTreeNode({ xMin, yMin, xMax: midX, yMax: midY }, this.capacity), // SW
      new QuadTreeNode({ xMin: midX, yMin, xMax, yMax: midY }, this.capacity)  // SE
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

// Part 5: Enterprise Autonomous Collision Avoidance System
export interface AircraftTrajectory {
  readonly flightId: string;
  readonly currentPos: Point2D;
  readonly velocityVector: Point2D; // meters per second
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

  // Calculate Closest Point of Approach (CPA) between two aircraft
  evaluateCpa(f1: AircraftTrajectory, f2: AircraftTrajectory): { timeSec: number; distMeters: number } {
    const rx = f2.currentPos.x - f1.currentPos.x;
    const ry = f2.currentPos.y - f1.currentPos.y;
    const vx = f2.velocityVector.x - f1.velocityVector.x;
    const vy = f2.velocityVector.y - f1.velocityVector.y;

    const vSq = vx * vx + vy * vy;
    if (vSq < 1e-9) {
      // Relative velocity is zero (flying parallel at same speed)
      return { timeSec: 0, distMeters: Math.sqrt(rx * rx + ry * ry) };
    }

    // Time to CPA: t = - (r . v) / |v|^2
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

        // Check vertical separation (e.g., 300 meters)
        if (Math.abs(f1.altitudeMeters - f2.altitudeMeters) > 300) {
          continue;
        }

        const { timeSec, distMeters } = this.evaluateCpa(f1, f2);

        if (timeSec <= horizonSeconds && distMeters < safetyDistanceMeters) {
          let severity: 'ADVISORY' | 'WARNING' | 'CRITICAL' = 'ADVISORY';
          if (timeSec < 20 || distMeters < 150) severity = 'CRITICAL';
          else if (timeSec < 40 || distMeters < 300) severity = 'WARNING';

          // Proactive deconfliction waypoint (orthogonal evasive maneuver)
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

// Self-test execution
function main() {
  console.log("=== Part 1: Segment Intersection Test ===");
  const segA: Segment2D = { id: "S1", p1: { x: 1, y: 1 }, p2: { x: 5, y: 5 } };
  const segB: Segment2D = { id: "S2", p1: { x: 1, y: 5 }, p2: { x: 5, y: 1 } };
  const segC: Segment2D = { id: "S3", p1: { x: 6, y: 6 }, p2: { x: 8, y: 8 } };

  console.log("S1 intersects S2:", doSegmentsIntersect(segA, segB));
  console.log("S1 intersects S3:", doSegmentsIntersect(segA, segC));

  console.log("\n=== Part 2: Sweep-Line Intersections ===");
  const intersections = sweepLineIntersections([segA, segB, segC]);
  console.log("Found Intersections:", JSON.stringify(intersections));

  console.log("\n=== Part 3: Closest Pair of Points ===");
  const pts: Point2D[] = [
    { x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 },
    { x: 12, y: 10 }, { x: 3, y: 4 }
  ];
  const closest = findClosestPair(pts);
  console.log(`Closest Pair: (${closest.p1.x},${closest.p1.y}) and (${closest.p2.x},${closest.p2.y}) with dist: ${closest.distance.toFixed(4)}`);

  console.log("\n=== Part 4: QuadTree Spatial Query ===");
  const qtree = new QuadTreeNode({ xMin: 0, yMin: 0, xMax: 100, yMax: 100 }, 2);
  pts.forEach(p => qtree.insert(p));
  const queryBox: BoundingBox2D = { xMin: 0, yMin: 0, xMax: 10, yMax: 10 };
  const queried = qtree.queryRange(queryBox);
  console.log(`QuadTree range query [0..10]: found ${queried.length} points: ${JSON.stringify(queried)}`);

  console.log("\n=== Part 5: Enterprise Collision Avoidance Engine ===");
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
  }
}

main();
