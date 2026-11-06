// scripts/branch_c/test_day60_snippets.ts

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface DroneVehicle {
  readonly droneId: string;
  readonly position: Point2D;
  readonly velocity: Point2D;
  readonly batteryPercent: number;
  readonly missionStatus: 'PATROL' | 'DISPATCH' | 'CHARGING' | 'EMERGENCY';
}

export interface GeofenceEnclosure {
  readonly hullVertices: readonly Point2D[];
  readonly totalPerimeterMeters: number;
  readonly maxFleetDiameterMeters: number;
  readonly farthestDronePair: readonly [string, string];
}

export interface CollisionWarning {
  readonly primaryDroneId: string;
  readonly intruderDroneId: string;
  readonly timeToCpaSeconds: number;
  readonly cpaDistanceMeters: number;
  readonly evasiveWaypoint: Point2D;
}

export interface PlanetaryFleetReport {
  readonly totalActiveDrones: number;
  readonly geofence: GeofenceEnclosure;
  readonly activeCollisions: readonly CollisionWarning[];
  readonly largestBlindSpotCenter: Point2D;
  readonly largestBlindSpotRadius: number;
  readonly dispatchBackhaulMeters: number;
}

// Orientation & Geometry Primitives
export function crossProduct2D(p: Point2D, q: Point2D, r: Point2D): number {
  return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
}

export function squaredDistance(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

// Part 2: Monotone Chain Convex Hull
export function computeConvexHull(points: readonly Point2D[]): Point2D[] {
  const n = points.length;
  if (n <= 2) return [...points];
  const sorted = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

  const lower: Point2D[] = [];
  for (const pt of sorted) {
    while (lower.length >= 2 && crossProduct2D(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) {
      lower.pop();
    }
    lower.push(pt);
  }

  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const pt = sorted[i];
    while (upper.length >= 2 && crossProduct2D(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) {
      upper.pop();
    }
    upper.push(pt);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

// Rotating Calipers Diameter
export function computeHullDiameter(hull: readonly Point2D[]): { p1: Point2D; p2: Point2D; distance: number } {
  const n = hull.length;
  if (n < 2) return { p1: hull[0], p2: hull[0], distance: 0 };
  if (n === 2) return { p1: hull[0], p2: hull[1], distance: Math.sqrt(squaredDistance(hull[0], hull[1])) };

  let k = 1;
  while (Math.abs(crossProduct2D(hull[n - 1], hull[0], hull[(k + 1) % n])) >
         Math.abs(crossProduct2D(hull[n - 1], hull[0], hull[k]))) {
    k++;
  }

  let maxDistSq = 0;
  let best: [Point2D, Point2D] = [hull[0], hull[k]];

  for (let i = 0, j = k; i <= k && j < n; i++) {
    const d1 = squaredDistance(hull[i], hull[j]);
    if (d1 > maxDistSq) {
      maxDistSq = d1;
      best = [hull[i], hull[j]];
    }
    while (j < n && Math.abs(crossProduct2D(hull[i], hull[(i + 1) % n], hull[(j + 1) % n])) >
                    Math.abs(crossProduct2D(hull[i], hull[(i + 1) % n], hull[j]))) {
      j++;
      const d2 = squaredDistance(hull[i], hull[j % n]);
      if (d2 > maxDistSq) {
        maxDistSq = d2;
        best = [hull[i], hull[j % n]];
      }
    }
  }

  return { p1: best[0], p2: best[1], distance: Math.sqrt(maxDistSq) };
}

// Part 3: Proximity & Largest Empty Circle
export function computeCircumcircle(p1: Point2D, p2: Point2D, p3: Point2D): { center: Point2D; radius: number } | null {
  const d = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
  if (Math.abs(d) < 1e-9) return null;

  const aSq = p1.x * p1.x + p1.y * p1.y;
  const bSq = p2.x * p2.x + p2.y * p2.y;
  const cSq = p3.x * p3.x + p3.y * p3.y;

  const ux = (aSq * (p2.y - p3.y) + bSq * (p3.y - p1.y) + cSq * (p1.y - p2.y)) / d;
  const uy = (aSq * (p3.x - p2.x) + bSq * (p1.x - p3.x) + cSq * (p2.x - p1.x)) / d;
  const center: Point2D = { x: Math.round(ux * 10) / 10, y: Math.round(uy * 10) / 10 };
  const radius = Math.round(Math.sqrt((p1.x - center.x) ** 2 + (p1.y - center.y) ** 2) * 10) / 10;

  return { center, radius };
}

// Part 4: Analytical CPA Collision Avoidance
export function evaluateTrajectoryCpa(
  pos1: Point2D, vel1: Point2D,
  pos2: Point2D, vel2: Point2D
): { timeSec: number; distMeters: number } {
  const rx = pos2.x - pos1.x;
  const ry = pos2.y - pos1.y;
  const vx = vel2.x - vel1.x;
  const vy = vel2.y - vel1.y;

  const vSq = vx * vx + vy * vy;
  if (vSq < 1e-9) {
    return { timeSec: 0, distMeters: Math.sqrt(rx * rx + ry * ry) };
  }

  const dot = rx * vx + ry * vy;
  const timeSec = Math.max(0, -dot / vSq);
  const cpaX = rx + timeSec * vx;
  const cpaY = ry + timeSec * vy;
  return {
    timeSec: Math.round(timeSec * 10) / 10,
    distMeters: Math.round(Math.sqrt(cpaX * cpaX + cpaY * cpaY) * 10) / 10
  };
}

// Part 5: PlanetaryGeospatialFleetEngine
export class PlanetaryGeospatialFleetEngine {
  private readonly fleet = new Map<string, DroneVehicle>();

  registerDrone(drone: DroneVehicle): void {
    this.fleet.set(drone.droneId, drone);
  }

  updateTelemetry(droneId: string, position: Point2D, velocity: Point2D): boolean {
    const d = this.fleet.get(droneId);
    if (!d) return false;
    this.fleet.set(droneId, { ...d, position, velocity });
    return true;
  }

  executePlanetaryAnalysis(collisionHorizonSec: number = 30, safetyThresholdM: number = 100): PlanetaryFleetReport {
    const drones = Array.from(this.fleet.values());
    if (drones.length < 3) {
      throw new Error("Fleet must contain at least 3 drones for planetary spatial analysis");
    }

    const points = drones.map(d => d.position);

    // 1. Compute Swarm Geofence via Monotone Chain & Rotating Calipers
    const hull = computeConvexHull(points);
    let perimeter = 0;
    for (let i = 0; i < hull.length; i++) {
      const next = hull[(i + 1) % hull.length];
      perimeter += Math.sqrt(squaredDistance(hull[i], next));
    }

    const diam = computeHullDiameter(hull);
    const id1 = drones.find(d => d.position.x === diam.p1.x && d.position.y === diam.p1.y)?.droneId ?? 'UNKNOWN';
    const id2 = drones.find(d => d.position.x === diam.p2.x && d.position.y === diam.p2.y)?.droneId ?? 'UNKNOWN';

    const geofence: GeofenceEnclosure = {
      hullVertices: hull,
      totalPerimeterMeters: Math.round(perimeter * 10) / 10,
      maxFleetDiameterMeters: Math.round(diam.distance * 10) / 10,
      farthestDronePair: [id1, id2]
    };

    // 2. Trajectory Conflict & Collision Threat Radar
    const alerts: CollisionWarning[] = [];
    for (let i = 0; i < drones.length; i++) {
      for (let j = i + 1; j < drones.length; j++) {
        const d1 = drones[i];
        const d2 = drones[j];
        const cpa = evaluateTrajectoryCpa(d1.position, d1.velocity, d2.position, d2.velocity);

        if (cpa.timeSec <= collisionHorizonSec && cpa.distMeters < safetyThresholdM) {
          const evasivePoint: Point2D = {
            x: Math.round(d1.position.x + d1.velocity.x * (cpa.timeSec / 2) - d1.velocity.y * 5),
            y: Math.round(d1.position.y + d1.velocity.y * (cpa.timeSec / 2) + d1.velocity.x * 5)
          };
          alerts.push({
            primaryDroneId: d1.droneId,
            intruderDroneId: d2.droneId,
            timeToCpaSeconds: cpa.timeSec,
            cpaDistanceMeters: cpa.distMeters,
            evasiveWaypoint: evasivePoint
          });
        }
      }
    }

    // 3. Largest Empty Circle Blind Spot Analysis
    let maxBlindSpotRadius = 0;
    let worstBlindSpotCenter: Point2D = { x: 0, y: 0 };

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        for (let k = j + 1; k < points.length; k++) {
          const cc = computeCircumcircle(points[i], points[j], points[k]);
          if (cc) {
            // Verify empty circle property
            const isCircleEmpty = points.every(p => {
              const d = Math.sqrt((p.x - cc.center.x) ** 2 + (p.y - cc.center.y) ** 2);
              return d >= cc.radius - 1e-4;
            });
            if (isCircleEmpty && cc.radius > maxBlindSpotRadius) {
              maxBlindSpotRadius = cc.radius;
              worstBlindSpotCenter = cc.center;
            }
          }
        }
      }
    }

    // 4. Backhaul Interconnect Length (approximate MST over hull)
    let backhaulLength = 0;
    for (let i = 0; i < hull.length - 1; i++) {
      backhaulLength += Math.sqrt(squaredDistance(hull[i], hull[i + 1]));
    }

    return {
      totalActiveDrones: drones.length,
      geofence,
      activeCollisions: alerts,
      largestBlindSpotCenter: worstBlindSpotCenter,
      largestBlindSpotRadius: maxBlindSpotRadius,
      dispatchBackhaulMeters: Math.round(backhaulLength * 10) / 10
    };
  }
}

// Self-test execution
function main() {
  console.log("=== Planetary Geospatial Fleet Engine Capstone ===");
  const engine = new PlanetaryGeospatialFleetEngine();

  // Register 5 autonomous drones in planetary sector
  engine.registerDrone({ droneId: 'SATURN-01', position: { x: 100, y: 100 }, velocity: { x: 0, y: 10 }, batteryPercent: 98, missionStatus: 'PATROL' });
  engine.registerDrone({ droneId: 'SATURN-02', position: { x: 500, y: 100 }, velocity: { x: 0, y: 10 }, batteryPercent: 88, missionStatus: 'PATROL' });
  engine.registerDrone({ droneId: 'SATURN-03', position: { x: 500, y: 500 }, velocity: { x: -10, y: 0 }, batteryPercent: 92, missionStatus: 'PATROL' });
  engine.registerDrone({ droneId: 'SATURN-04', position: { x: 100, y: 500 }, velocity: { x: 0, y: -10 }, batteryPercent: 85, missionStatus: 'PATROL' });
  engine.registerDrone({ droneId: 'SATURN-05', position: { x: 300, y: 300 }, velocity: { x: 5, y: 5 }, batteryPercent: 94, missionStatus: 'DISPATCH' });

  // Add conflicting interceptor drone heading directly toward SATURN-01
  engine.registerDrone({ droneId: 'INTERCEPT-99', position: { x: 100, y: 300 }, velocity: { x: 0, y: -10 }, batteryPercent: 99, missionStatus: 'PATROL' });

  const report = engine.executePlanetaryAnalysis(30, 100);

  console.log(`Active Drones: ${report.totalActiveDrones}`);
  console.log(`Geofence Perimeter: ${report.geofence.totalPerimeterMeters}m across ${report.geofence.hullVertices.length} hull vertices`);
  console.log(`Max Fleet Diameter: ${report.geofence.maxFleetDiameterMeters}m between [${report.geofence.farthestDronePair.join(', ')}]`);
  console.log(`Largest Coverage Blind Spot: Radius ${report.largestBlindSpotRadius}m at (${report.largestBlindSpotCenter.x}, ${report.largestBlindSpotCenter.y})`);
  console.log(`Dispatch Backhaul Length: ${report.dispatchBackhaulMeters}m`);
  console.log(`Active Collision Warnings Count: ${report.activeCollisions.length}`);

  if (report.activeCollisions.length > 0) {
    const w = report.activeCollisions[0];
    console.log(`Conflict Alert: ${w.primaryDroneId} vs ${w.intruderDroneId} | CPA in ${w.timeToCpaSeconds}s at ${w.cpaDistanceMeters}m`);
    console.log(`Evasive Waypoint for ${w.primaryDroneId}: (${w.evasiveWaypoint.x}, ${w.evasiveWaypoint.y})`);
  }
}

main();
