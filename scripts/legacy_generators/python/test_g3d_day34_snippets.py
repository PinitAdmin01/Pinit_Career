import subprocess
import sys

snippets = [
    # Snippet 1: Verlet Numerical Integrator
    {
        'name': 'Day 34 Snippet 1 - Verlet Integrator',
        'code': """interface VerletParticle {
  pos: number;
  prevPos: number;
  accel: number;
}

class VerletSimulator {
  static step(p: VerletParticle, dt: number): { nextPos: number; impliedVelocity: number } {
    // Verlet integration formula: x(t+dt) = 2*x(t) - x(t-dt) + a*dt^2
    const nextPos = 2 * p.pos - p.prevPos + p.accel * dt * dt;
    const impliedVelocity = (nextPos - p.pos) / dt;
    return {
      nextPos: parseFloat(nextPos.toFixed(4)),
      impliedVelocity: parseFloat(impliedVelocity.toFixed(4))
    };
  }
}

const particle: VerletParticle = {
  pos: 10.0,
  prevPos: 9.8,
  accel: -9.8
};
const dt = 0.016; // 60 FPS frame delta
const result = VerletSimulator.step(particle, dt);

console.log(`[Verlet] Current Pos: ${particle.pos}, Prev Pos: ${particle.prevPos}`);
console.log(`[Verlet] Next Computed Pos: ${result.nextPos}`);
console.log(`[Verlet] Implied Velocity: ${result.impliedVelocity}`);
""",
        'expected': """[Verlet] Current Pos: 10, Prev Pos: 9.8
[Verlet] Next Computed Pos: 10.1975
[Verlet] Implied Velocity: 12.3432"""
    },
    # Snippet 2: 3D Spatial Hash Function
    {
        'name': 'Day 34 Snippet 2 - Spatial Hash Function',
        'code': """interface Point3D {
  x: number;
  y: number;
  z: number;
}

class SpatialHasher {
  private static readonly P1 = 73856093;
  private static readonly P2 = 19349663;
  private static readonly P3 = 83492791;

  static getCellCoords(p: Point3D, cellSize: number): [number, number, number] {
    return [
      Math.floor(p.x / cellSize),
      Math.floor(p.y / cellSize),
      Math.floor(p.z / cellSize)
    ];
  }

  static hashCell(cell: [number, number, number], tableSize: number): number {
    // Large prime XOR spatial hash
    const rawHash = (cell[0] * this.P1) ^ (cell[1] * this.P2) ^ (cell[2] * this.P3);
    return Math.abs(rawHash) % tableSize;
  }
}

const position: Point3D = { x: 15.2, y: 8.4, z: 23.9 };
const cellSize = 5.0;
const tableSize = 1024;

const cellCoords = SpatialHasher.getCellCoords(position, cellSize);
const hashKey = SpatialHasher.hashCell(cellCoords, tableSize);

console.log(`[Spatial Hash] Position: (${position.x}, ${position.y}, ${position.z})`);
console.log(`[Spatial Hash] Discrete Cell: (${cellCoords.join(",")})`);
console.log(`[Spatial Hash] Hash Key (mod ${tableSize}): ${hashKey}`);
""",
        'expected': """[Spatial Hash] Position: (15.2, 8.4, 23.9)
[Spatial Hash] Discrete Cell: (3,1,4)
[Spatial Hash] Hash Key (mod 1024): 852"""
    },
    # Snippet 3: Spatial Cell Bucketing
    {
        'name': 'Day 34 Snippet 3 - Spatial Cell Bucketing',
        'code': """interface HashEntry {
  particleId: number;
  cellKey: number;
}

class SpatialGridBucketer {
  static bucketParticles(entries: HashEntry[]): Map<number, number[]> {
    const buckets = new Map<number, number[]>();
    for (const e of entries) {
      if (!buckets.has(e.cellKey)) {
        buckets.set(e.cellKey, []);
      }
      buckets.get(e.cellKey)!.push(e.particleId);
    }
    return buckets;
  }
}

const entries: HashEntry[] = [
  { particleId: 101, cellKey: 42 },
  { particleId: 102, cellKey: 88 },
  { particleId: 103, cellKey: 42 },
  { particleId: 104, cellKey: 42 },
  { particleId: 105, cellKey: 88 }
];

const grid = SpatialGridBucketer.bucketParticles(entries);
for (const [cell, ids] of grid.entries()) {
  console.log(`[Cell Bucket] Cell ${cell}: Particles [${ids.join(", ")}] (Count: ${ids.length})`);
}
""",
        'expected': """[Cell Bucket] Cell 42: Particles [101, 103, 104] (Count: 3)
[Cell Bucket] Cell 88: Particles [102, 105] (Count: 2)"""
    },
    # Snippet 4: 27-Neighbor Query Simulator
    {
        'name': 'Day 34 Snippet 4 - 27-Neighbor Query',
        'code': """class NeighborSearchSimulator {
  static getNeighborCellOffsets(): [number, number, number][] {
    const offsets: [number, number, number][] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          offsets.push([dx, dy, dz]);
        }
      }
    }
    return offsets;
  }

  static countCandidatePairs(particleCell: [number, number, number], cellCounts: Record<string, number>): number {
    const offsets = this.getNeighborCellOffsets();
    let candidates = 0;
    for (const [dx, dy, dz] of offsets) {
      const key = `${particleCell[0] + dx},${particleCell[1] + dy},${particleCell[2] + dz}`;
      if (cellCounts[key]) {
        candidates += cellCounts[key];
      }
    }
    return candidates;
  }
}

const centerCell: [number, number, number] = [3, 1, 4];
const mockCellCounts: Record<string, number> = {
  "3,1,4": 4, // Self cell
  "4,1,4": 3, // Neighbor X+1
  "3,2,4": 2, // Neighbor Y+1
  "9,9,9": 100 // Far away cell (should not match)
};

const totalNeighbors = NeighborSearchSimulator.getNeighborCellOffsets().length;
const candidates = NeighborSearchSimulator.countCandidatePairs(centerCell, mockCellCounts);

console.log(`[Neighbor Search] Total Neighbor Cell Offsets: ${totalNeighbors}`);
console.log(`[Neighbor Search] Potential Colliding Candidates: ${candidates}`);
""",
        'expected': """[Neighbor Search] Total Neighbor Cell Offsets: 27
[Neighbor Search] Potential Colliding Candidates: 9"""
    },
    # Snippet 5: Elastic Sphere-Sphere Collision Resolver
    {
        'name': 'Day 34 Snippet 5 - Elastic Sphere Collision',
        'code': """interface SphereParticle {
  id: number;
  x: number;
  vx: number;
  radius: number;
  mass: number;
}

class ElasticCollisionResolver {
  static resolve1D(p1: SphereParticle, p2: SphereParticle): { v1Next: number; v2Next: number; overlap: number } {
    const dist = Math.abs(p2.x - p1.x);
    const minDist = p1.radius + p2.radius;
    const overlap = Math.max(0, minDist - dist);

    // 1D elastic collision impulse
    const m1 = p1.mass;
    const m2 = p2.mass;
    const u1 = p1.vx;
    const u2 = p2.vx;

    const v1Next = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
    const v2Next = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);

    return {
      v1Next: parseFloat(v1Next.toFixed(2)),
      v2Next: parseFloat(v2Next.toFixed(2)),
      overlap: parseFloat(overlap.toFixed(2))
    };
  }
}

const s1: SphereParticle = { id: 1, x: 2.0, vx: 5.0, radius: 1.0, mass: 1.0 };
const s2: SphereParticle = { id: 2, x: 3.5, vx: -3.0, radius: 1.0, mass: 1.0 };

const collision = ElasticCollisionResolver.resolve1D(s1, s2);
console.log(`[Elastic Collision] Overlap: ${collision.overlap} units`);
console.log(`[Elastic Collision] Particle 1 Velocity Post-Impact: ${collision.v1Next}`);
console.log(`[Elastic Collision] Particle 2 Velocity Post-Impact: ${collision.v2Next}`);
""",
        'expected': """[Elastic Collision] Overlap: 0.5 units
[Elastic Collision] Particle 1 Velocity Post-Impact: -3
[Elastic Collision] Particle 2 Velocity Post-Impact: 5"""
    }
]

failed = False
for s in snippets:
    proc = subprocess.run(['npx', 'tsx'], input=s['code'], capture_output=True, text=True, shell=True)
    out = proc.stdout.strip()
    exp = s['expected'].strip()
    if out == exp:
        print(f"PASS: {s['name']}")
    else:
        print(f"FAIL: {s['name']}")
        print(f"Expected:\n{exp}")
        print(f"Got:\n{out}")
        if proc.stderr:
            print(f"Stderr:\n{proc.stderr}")
        failed = True

if failed:
    sys.exit(1)
print("ALL 5 SNIPPETS PASS!")
