// scripts/branch_c/test_day58_snippets.ts

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface Triangle2D {
  readonly a: Point2D;
  readonly b: Point2D;
  readonly c: Point2D;
}

export interface Circle2D {
  readonly center: Point2D;
  readonly radius: number;
}

// Part 1: Circumcenter & Perpendicular Bisectors
export function computeCircumcircle(tri: Triangle2D): Circle2D | null {
  const { a, b, c } = tri;
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null; // Collinear points

  const aSq = a.x * a.x + a.y * a.y;
  const bSq = b.x * b.x + b.y * b.y;
  const cSq = c.x * c.x + c.y * c.y;

  const ux = (aSq * (b.y - c.y) + bSq * (c.y - a.y) + cSq * (a.y - b.y)) / d;
  const uy = (aSq * (c.x - b.x) + bSq * (a.x - c.x) + cSq * (b.x - a.x)) / d;
  const center: Point2D = { x: Math.round(ux * 1000) / 1000, y: Math.round(uy * 1000) / 1000 };

  const dx = a.x - center.x;
  const dy = a.y - center.y;
  const radius = Math.round(Math.sqrt(dx * dx + dy * dy) * 1000) / 1000;

  return { center, radius };
}

// Part 2: Delaunay Empty Circumcircle Criterion & In-Circle Predicate
export function inCircumcircle(tri: Triangle2D, p: Point2D): boolean {
  const { a, b, c } = tri;
  const ax_ = a.x - p.x, ay_ = a.y - p.y;
  const bx_ = b.x - p.x, by_ = b.y - p.y;
  const cx_ = c.x - p.x, cy_ = c.y - p.y;

  // 3x3 determinant testing if p is inside circumcircle of CCW triangle abc
  const det = (ax_ * ax_ + ay_ * ay_) * (bx_ * cy_ - cx_ * by_) -
              (bx_ * bx_ + by_ * by_) * (ax_ * cy_ - cx_ * ay_) +
              (cx_ * cx_ + cy_ * cy_) * (ax_ * by_ - bx_ * ay_);

  return det > 1e-9;
}

// Simple Bowyer-Watson Delaunay Triangulation for demonstration
export interface Edge2D {
  readonly u: Point2D;
  readonly v: Point2D;
}

export function computeDelaunayTriangulation(points: readonly Point2D[]): Triangle2D[] {
  if (points.length < 3) return [];

  // Super-triangle enclosing all points
  const superTri: Triangle2D = {
    a: { x: -1000, y: -1000 },
    b: { x: 2000, y: -1000 },
    c: { x: 500, y: 2000 }
  };

  let triangles: Triangle2D[] = [superTri];

  for (const pt of points) {
    const badTriangles: Triangle2D[] = [];
    for (const tri of triangles) {
      const cc = computeCircumcircle(tri);
      if (cc) {
        const dist = Math.sqrt((pt.x - cc.center.x) ** 2 + (pt.y - cc.center.y) ** 2);
        if (dist <= cc.radius + 1e-9) {
          badTriangles.push(tri);
        }
      }
    }

    // Find boundary of polygonal hole
    const polygon: Edge2D[] = [];
    for (const tri of badTriangles) {
      const edges: Edge2D[] = [
        { u: tri.a, v: tri.b },
        { u: tri.b, v: tri.c },
        { u: tri.c, v: tri.a }
      ];
      for (const edge of edges) {
        const isShared = badTriangles.some(other => {
          if (other === tri) return false;
          const otherEdges: Edge2D[] = [
            { u: other.a, v: other.b },
            { u: other.b, v: other.c },
            { u: other.c, v: other.a }
          ];
          return otherEdges.some(e =>
            (e.u.x === edge.u.x && e.u.y === edge.u.y && e.v.x === edge.v.x && e.v.y === edge.v.y) ||
            (e.u.x === edge.v.x && e.u.y === edge.v.y && e.v.x === edge.u.x && e.v.y === edge.u.y)
          );
        });
        if (!isShared) {
          polygon.push(edge);
        }
      }
    }

    triangles = triangles.filter(t => !badTriangles.includes(t));
    for (const edge of polygon) {
      triangles.push({ a: edge.u, b: edge.v, c: pt });
    }
  }

  // Remove super-triangle vertices
  return triangles.filter(tri =>
    tri.a !== superTri.a && tri.a !== superTri.b && tri.a !== superTri.c &&
    tri.b !== superTri.a && tri.b !== superTri.b && tri.b !== superTri.c &&
    tri.c !== superTri.a && tri.c !== superTri.b && tri.c !== superTri.c
  );
}

// Part 3: Fortune's Sweep-Line Beachline Breakpoint Calculation
export function computeBeachlineBreakpoint(p1: Point2D, p2: Point2D, sweepY: number): number | null {
  // Parabola 1: focus (p1.x, p1.y), directrix y = sweepY
  // Parabola 2: focus (p2.x, p2.y), directrix y = sweepY
  // Find x where y1(x) = y2(x)
  const d1 = 2 * (p1.y - sweepY);
  const d2 = 2 * (p2.y - sweepY);

  if (Math.abs(d1) < 1e-9 || Math.abs(d2) < 1e-9) return null;

  // For demonstration: intersection of equal y parabolas
  // (x - p1.x)^2 / d1 + (p1.y + sweepY)/2 = (x - p2.x)^2 / d2 + (p2.y + sweepY)/2
  const a = 1 / d1 - 1 / d2;
  const b = -2 * (p1.x / d1 - p2.x / d2);
  const c = (p1.x * p1.x) / d1 - (p2.x * p2.x) / d2 + (p1.y - p2.y) / 2;

  if (Math.abs(a) < 1e-9) {
    return Math.round((-c / b) * 1000) / 1000;
  }

  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const xInt = (-b + Math.sqrt(disc)) / (2 * a);
  return Math.round(xInt * 1000) / 1000;
}

// Part 4: Euclidean Minimum Spanning Tree (EMST) from Delaunay Edges
export interface WeightedEdge {
  readonly uIndex: number;
  readonly vIndex: number;
  readonly weight: number;
}

export function computeEMST(points: readonly Point2D[], triangles: readonly Triangle2D[]): { edges: WeightedEdge[]; totalWeight: number } {
  const edgeMap = new Map<string, WeightedEdge>();

  const getPointIndex = (p: Point2D) => points.findIndex(pt => Math.abs(pt.x - p.x) < 1e-6 && Math.abs(pt.y - p.y) < 1e-6);

  for (const tri of triangles) {
    const pairs: [Point2D, Point2D][] = [[tri.a, tri.b], [tri.b, tri.c], [tri.c, tri.a]];
    for (const [p1, p2] of pairs) {
      const u = getPointIndex(p1);
      const v = getPointIndex(p2);
      if (u !== -1 && v !== -1 && u !== v) {
        const uIdx = Math.min(u, v);
        const vIdx = Math.max(u, v);
        const key = `${uIdx}-${vIdx}`;
        if (!edgeMap.has(key)) {
          const w = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          edgeMap.set(key, { uIndex: uIdx, vIndex: vIdx, weight: w });
        }
      }
    }
  }

  const allEdges = Array.from(edgeMap.values()).sort((a, b) => a.weight - b.weight);

  // Kruskal's algorithm on Delaunay edges
  const parent = points.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (i: number, j: number): boolean => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  const mstEdges: WeightedEdge[] = [];
  let totalWeight = 0;

  for (const edge of allEdges) {
    if (union(edge.uIndex, edge.vIndex)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
      if (mstEdges.length === points.length - 1) break;
    }
  }

  return { edges: mstEdges, totalWeight: Math.round(totalWeight * 100) / 100 };
}

// Part 5: Enterprise Cellular Network Optimization Engine
export interface CellTower {
  readonly towerId: string;
  readonly position: Point2D;
  readonly powerWatts: number;
  readonly frequencyMhz: number;
}

export interface CellularOptimizationReport {
  readonly totalTowers: number;
  readonly voronoiVerticesCount: number;
  readonly maxCoverageGapMeters: number;
  readonly largestBlindSpotLocation: Point2D;
  readonly emstInterconnectLengthMeters: number;
}

export class EnterpriseCellularNetworkOptimizer {
  private readonly towers = new Map<string, CellTower>();

  registerTower(tower: CellTower): void {
    this.towers.set(tower.towerId, tower);
  }

  optimizeNetworkTopology(): CellularOptimizationReport {
    const towerList = Array.from(this.towers.values());
    if (towerList.length < 3) {
      return {
        totalTowers: towerList.length,
        voronoiVerticesCount: 0,
        maxCoverageGapMeters: 0,
        largestBlindSpotLocation: { x: 0, y: 0 },
        emstInterconnectLengthMeters: 0
      };
    }

    const points = towerList.map(t => t.position);
    const delaunay = computeDelaunayTriangulation(points);

    // Each circumcenter of a Delaunay triangle is a Voronoi vertex!
    let maxGap = 0;
    let worstLocation: Point2D = { x: 0, y: 0 };
    let voronoiVerticesCount = 0;

    for (const tri of delaunay) {
      const cc = computeCircumcircle(tri);
      if (cc) {
        voronoiVerticesCount++;
        if (cc.radius > maxGap) {
          maxGap = cc.radius;
          worstLocation = cc.center;
        }
      }
    }

    const emst = computeEMST(points, delaunay);

    return {
      totalTowers: towerList.length,
      voronoiVerticesCount,
      maxCoverageGapMeters: Math.round(maxGap * 10) / 10,
      largestBlindSpotLocation: worstLocation,
      emstInterconnectLengthMeters: emst.totalWeight
    };
  }
}

// Self-test execution
function main() {
  console.log("=== Part 1: Circumcenter & Voronoi Vertex ===");
  const tri: Triangle2D = {
    a: { x: 0, y: 0 },
    b: { x: 4, y: 0 },
    c: { x: 0, y: 4 }
  };
  const cc = computeCircumcircle(tri);
  console.log("Circumcenter:", JSON.stringify(cc));

  console.log("\n=== Part 2: Delaunay In-Circumcircle Test ===");
  const insidePt: Point2D = { x: 1, y: 1 };
  const outsidePt: Point2D = { x: 5, y: 5 };
  console.log("Point (1,1) inside circumcircle:", inCircumcircle(tri, insidePt));
  console.log("Point (5,5) inside circumcircle:", inCircumcircle(tri, outsidePt));

  console.log("\n=== Part 3: Fortune's Beachline Breakpoint ===");
  const site1: Point2D = { x: 0, y: 4 };
  const site2: Point2D = { x: 4, y: 4 };
  const bp = computeBeachlineBreakpoint(site1, site2, 0);
  console.log("Breakpoint x for sites (0,4) and (4,4) at sweep y=0:", bp);

  console.log("\n=== Part 4: Delaunay Triangulation & EMST ===");
  const sites: Point2D[] = [
    { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }
  ];
  const delaunay = computeDelaunayTriangulation(sites);
  console.log(`Delaunay Triangles Count: ${delaunay.length}`);
  const emst = computeEMST(sites, delaunay);
  console.log(`EMST Total Interconnect Length: ${emst.totalWeight} with ${emst.edges.length} edges`);

  console.log("\n=== Part 5: Enterprise Cellular Network Optimizer ===");
  const optimizer = new EnterpriseCellularNetworkOptimizer();
  optimizer.registerTower({ towerId: 'TOWER-01', position: { x: 100, y: 100 }, powerWatts: 50, frequencyMhz: 1800 });
  optimizer.registerTower({ towerId: 'TOWER-02', position: { x: 500, y: 100 }, powerWatts: 50, frequencyMhz: 1800 });
  optimizer.registerTower({ towerId: 'TOWER-03', position: { x: 100, y: 500 }, powerWatts: 50, frequencyMhz: 1800 });
  optimizer.registerTower({ towerId: 'TOWER-04', position: { x: 500, y: 500 }, powerWatts: 50, frequencyMhz: 1800 });

  const report = optimizer.optimizeNetworkTopology();
  console.log(`Total Towers: ${report.totalTowers}`);
  console.log(`Voronoi Vertices Count: ${report.voronoiVerticesCount}`);
  console.log(`Max Coverage Gap (Largest Empty Circle Radius): ${report.maxCoverageGapMeters}m`);
  console.log(`Largest Blind Spot Location: (${report.largestBlindSpotLocation.x}, ${report.largestBlindSpotLocation.y})`);
  console.log(`EMST Fiber Backhaul Length: ${report.emstInterconnectLengthMeters}m`);
}

main();
