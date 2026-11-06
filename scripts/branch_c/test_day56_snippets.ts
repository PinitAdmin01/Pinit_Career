// scripts/branch_c/test_day56_snippets.ts

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export enum Orientation {
  Collinear = 0,
  Clockwise = 1,
  CounterClockwise = 2
}

// Part 1: Cross Product & Orientation Predicate
export function crossProduct2D(p: Point2D, q: Point2D, r: Point2D): number {
  return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
}

export function getOrientation(p: Point2D, q: Point2D, r: Point2D): Orientation {
  const val = crossProduct2D(p, q, r);
  if (Math.abs(val) < 1e-9) return Orientation.Collinear;
  return val > 0 ? Orientation.CounterClockwise : Orientation.Clockwise;
}

// Part 2: Graham Scan Algorithm
export function squaredDist(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

export function grahamScan(points: readonly Point2D[]): Point2D[] {
  if (points.length <= 2) return [...points];

  // 1. Find pivot (lowest y, break ties with lowest x)
  let pivot = points[0];
  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    if (pt.y < pivot.y || (pt.y === pivot.y && pt.x < pivot.x)) {
      pivot = pt;
    }
  }

  // 2. Sort remaining points by polar angle with pivot
  const sorted = points.filter(p => p !== pivot).sort((a, b) => {
    const o = getOrientation(pivot, a, b);
    if (o === Orientation.Collinear) {
      return squaredDist(pivot, a) - squaredDist(pivot, b);
    }
    return o === Orientation.CounterClockwise ? -1 : 1;
  });

  // 3. Stack construction
  const stack: Point2D[] = [pivot, sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const pt = sorted[i];
    while (stack.length >= 2 && getOrientation(stack[stack.length - 2], stack[stack.length - 1], pt) !== Orientation.CounterClockwise) {
      stack.pop();
    }
    stack.push(pt);
  }

  return stack;
}

// Part 3: Andrew's Monotone Chain Algorithm
export function monotoneChain(points: readonly Point2D[]): Point2D[] {
  const n = points.length;
  if (n <= 2) return [...points];

  // Sort lexicographically by x, then y
  const sorted = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

  // Build lower hull
  const lower: Point2D[] = [];
  for (const pt of sorted) {
    while (lower.length >= 2 && getOrientation(lower[lower.length - 2], lower[lower.length - 1], pt) !== Orientation.CounterClockwise) {
      lower.pop();
    }
    lower.push(pt);
  }

  // Build upper hull
  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const pt = sorted[i];
    while (upper.length >= 2 && getOrientation(upper[upper.length - 2], upper[upper.length - 1], pt) !== Orientation.CounterClockwise) {
      upper.pop();
    }
    upper.push(pt);
  }

  // Remove duplicate end points (lower[-1] is upper[0], upper[-1] is lower[0])
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

// Part 4: Rotating Calipers & Convex Hull Diameter
export interface AntipodalPair {
  readonly p1: Point2D;
  readonly p2: Point2D;
  readonly distance: number;
}

export function computeHullDiameter(hull: readonly Point2D[]): AntipodalPair {
  const n = hull.length;
  if (n < 2) return { p1: hull[0], p2: hull[0], distance: 0 };
  if (n === 2) {
    return { p1: hull[0], p2: hull[1], distance: Math.sqrt(squaredDist(hull[0], hull[1])) };
  }

  let k = 1;
  while (Math.abs(crossProduct2D(hull[n - 1], hull[0], hull[(k + 1) % n])) >
         Math.abs(crossProduct2D(hull[n - 1], hull[0], hull[k]))) {
    k++;
  }

  let maxDistSq = 0;
  let bestPair: [Point2D, Point2D] = [hull[0], hull[k]];

  for (let i = 0, j = k; i <= k && j < n; i++) {
    const d1 = squaredDist(hull[i], hull[j]);
    if (d1 > maxDistSq) {
      maxDistSq = d1;
      bestPair = [hull[i], hull[j]];
    }

    while (j < n && Math.abs(crossProduct2D(hull[i], hull[(i + 1) % n], hull[(j + 1) % n])) >
                    Math.abs(crossProduct2D(hull[i], hull[(i + 1) % n], hull[j]))) {
      j++;
      const d2 = squaredDist(hull[i], hull[j % n]);
      if (d2 > maxDistSq) {
        maxDistSq = d2;
        bestPair = [hull[i], hull[j % n]];
      }
    }
  }

  return {
    p1: bestPair[0],
    p2: bestPair[1],
    distance: Math.sqrt(maxDistSq)
  };
}

// Part 5: Enterprise Fleet Perimeter Engine
export interface DroneTelemetry {
  readonly droneId: string;
  readonly position: Point2D;
  readonly altitudeMeters: number;
  readonly batteryPercent: number;
}

export interface AirspaceGeofence {
  readonly boundaryVertices: readonly Point2D[];
  readonly totalPerimeterMeters: number;
  readonly maxDiameterMeters: number;
  readonly farthestDrones: readonly [string, string];
}

export class EnterpriseFleetPerimeterEngine {
  private readonly activeDrones = new Map<string, DroneTelemetry>();

  registerDrone(drone: DroneTelemetry): void {
    this.activeDrones.set(drone.droneId, drone);
  }

  updatePosition(droneId: string, newPos: Point2D): boolean {
    const drone = this.activeDrones.get(droneId);
    if (!drone) return false;
    this.activeDrones.set(droneId, { ...drone, position: newPos });
    return true;
  }

  computeAirspaceGeofence(): AirspaceGeofence {
    const drones = Array.from(this.activeDrones.values());
    if (drones.length === 0) {
      return {
        boundaryVertices: [],
        totalPerimeterMeters: 0,
        maxDiameterMeters: 0,
        farthestDrones: ['', '']
      };
    }

    const points = drones.map(d => d.position);
    const hull = monotoneChain(points);

    // Compute perimeter
    let perimeter = 0;
    for (let i = 0; i < hull.length; i++) {
      const next = hull[(i + 1) % hull.length];
      perimeter += Math.sqrt(squaredDist(hull[i], next));
    }

    // Compute diameter via rotating calipers
    const diam = computeHullDiameter(hull);

    // Identify farthest drones
    const id1 = drones.find(d => d.position.x === diam.p1.x && d.position.y === diam.p1.y)?.droneId ?? 'UNKNOWN';
    const id2 = drones.find(d => d.position.x === diam.p2.x && d.position.y === diam.p2.y)?.droneId ?? 'UNKNOWN';

    return {
      boundaryVertices: hull,
      totalPerimeterMeters: Math.round(perimeter * 100) / 100,
      maxDiameterMeters: Math.round(diam.distance * 100) / 100,
      farthestDrones: [id1, id2]
    };
  }

  isPointInsideGeofence(pt: Point2D, geofence: AirspaceGeofence): boolean {
    const hull = geofence.boundaryVertices;
    if (hull.length < 3) return false;

    // Point-in-convex-polygon: all cross products must be >= 0 (CCW)
    for (let i = 0; i < hull.length; i++) {
      const next = hull[(i + 1) % hull.length];
      const o = getOrientation(hull[i], next, pt);
      if (o === Orientation.Clockwise) {
        return false;
      }
    }
    return true;
  }
}

// Self-test execution
function main() {
  console.log("=== Part 1: Orientation Predicate ===");
  const p1: Point2D = { x: 0, y: 0 };
  const q1: Point2D = { x: 4, y: 4 };
  const rCCW: Point2D = { x: 2, y: 5 };
  const rCW: Point2D = { x: 5, y: 2 };
  const rCol: Point2D = { x: 8, y: 8 };

  console.log("P->Q->R_CCW orientation:", Orientation[getOrientation(p1, q1, rCCW)]);
  console.log("P->Q->R_CW orientation:", Orientation[getOrientation(p1, q1, rCW)]);
  console.log("P->Q->R_Col orientation:", Orientation[getOrientation(p1, q1, rCol)]);

  console.log("\n=== Part 2: Graham Scan ===");
  const cloud: Point2D[] = [
    { x: 0, y: 3 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 4 },
    { x: 0, y: 0 }, { x: 1, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 3 }
  ];
  const grahamHull = grahamScan(cloud);
  console.log("Graham Scan Hull Vertices:", JSON.stringify(grahamHull));

  console.log("\n=== Part 3: Andrew's Monotone Chain ===");
  const monoHull = monotoneChain(cloud);
  console.log("Monotone Chain Hull Vertices:", JSON.stringify(monoHull));

  console.log("\n=== Part 4: Rotating Calipers Diameter ===");
  const diameter = computeHullDiameter(monoHull);
  console.log(`Max Distance: ${diameter.distance.toFixed(4)} between (${diameter.p1.x},${diameter.p1.y}) and (${diameter.p2.x},${diameter.p2.y})`);

  console.log("\n=== Part 5: Enterprise Fleet Perimeter Engine ===");
  const engine = new EnterpriseFleetPerimeterEngine();
  engine.registerDrone({ droneId: 'DRONE-ALPHA', position: { x: 10, y: 20 }, altitudeMeters: 120, batteryPercent: 95 });
  engine.registerDrone({ droneId: 'DRONE-BETA', position: { x: 80, y: 15 }, altitudeMeters: 110, batteryPercent: 88 });
  engine.registerDrone({ droneId: 'DRONE-GAMMA', position: { x: 95, y: 85 }, altitudeMeters: 130, batteryPercent: 91 });
  engine.registerDrone({ droneId: 'DRONE-DELTA', position: { x: 25, y: 90 }, altitudeMeters: 115, batteryPercent: 82 });
  engine.registerDrone({ droneId: 'DRONE-EPSILON', position: { x: 50, y: 50 }, altitudeMeters: 125, batteryPercent: 98 });

  const fence = engine.computeAirspaceGeofence();
  console.log(`Boundary Vertices Count: ${fence.boundaryVertices.length}`);
  console.log(`Total Geofence Perimeter: ${fence.totalPerimeterMeters}m`);
  console.log(`Max Fleet Diameter: ${fence.maxDiameterMeters}m between [${fence.farthestDrones.join(', ')}]`);

  const patrolPoint: Point2D = { x: 50, y: 50 };
  const intruderPoint: Point2D = { x: 110, y: 50 };
  console.log(`Patrol point inside geofence: ${engine.isPointInsideGeofence(patrolPoint, fence)}`);
  console.log(`Intruder point inside geofence: ${engine.isPointInsideGeofence(intruderPoint, fence)}`);
}

main();
