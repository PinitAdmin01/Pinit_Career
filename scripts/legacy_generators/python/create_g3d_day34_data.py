import json

say_p1 = [
    "Welcome to Day 34 of 3D Computer Graphics, WebGL2 & GPU Shader Architecture. Yesterday, we conquered lock-free atomic concurrency, Blelloch parallel prefix scans, and GPU stream compaction. Today, we harness the raw computing power of WebGPU compute pipelines to construct an industrial-grade GPGPU physics engine: Parallel Particle Physics and Spatial Hash Collision Detection.",
    "At the heart of every physical simulation—from molecular dynamics and astrophysical galaxy mergers to real-time cloth simulation and game particle physics—lies the mathematical challenge of Numerical Integration. How do we update an object's position and velocity over discrete time steps $\\Delta t$ under the influence of physical forces such as gravity, wind, drag, and inter-particle collisions?",
    "Consider the physical analogy of an archer firing an arrow across a windy valley at dusk. If you close your eyes and only open them once every half-second to glance at the arrow, how do you predict where the arrow will strike? If you use Explicit Forward Euler Integration, you assume the arrow's velocity remains completely constant across the entire half-second window ($x(t+\\Delta t) = x(t) + v(t) \\cdot \\Delta t$). But in the real physical world, gravity is continuously bending the trajectory downward, and air drag is exponentially decelerating the flight! Under Forward Euler, every tiny estimation error accumulates without correction. In a particle system or spring-mass cloth mesh, Forward Euler introduces artificial energy into the simulation, causing particles to violently oscillate, gain infinite velocity, and explode off the screen in a catastrophic instability known as numerical explosion.",
    "To achieve unbreakable physical stability without expensive multi-stage Runge-Kutta solvers, graphics and physics engineers rely on Verlet Integration (specifically Time-Corrected Verlet or Position Verlet). First formulated by French physicist Loup Verlet in 1967 for molecular dynamics, Verlet integration calculates the new position directly from the current position, the previous position, and the current acceleration: $x(t+\\Delta t) = 2 x(t) - x(t-\\Delta t) + a(t) \\cdot \\Delta t^2$.",
    "Notice the profound mathematical elegance of Verlet integration: Velocity is completely implicit! You do not need to store or integrate an independent velocity vector in memory. Velocity is naturally encoded in the spatial displacement between the current position $x(t)$ and the previous position $x(t-\\Delta t)$: $v(t) \\approx \\frac{x(t) - x(t-\\Delta t)}{\\Delta t}$. Because Verlet integration is Symplectic—meaning it strictly conserves energy and phase space volume over time—particles bouncing inside a box will never gain phantom energy or blow up, even with large time steps or stiff collision constraints!",
    "In WebGPU compute shaders, Verlet integration offers immense memory bandwidth advantages. A compute thread simply loads `pos` and `prev_pos` from the particle storage buffer, calculates external forces (such as gravity `vec3(0.0, -9.8, 0.0)`), updates the coordinates with a single multiply-add instruction, and writes the results back to VRAM. Damping or friction is applied effortlessly by scaling the displacement term: $x(t+\\Delta t) = x(t) + (x(t) - x(t-\\Delta t)) \\cdot (1.0 - \\text{damping}) + a \\cdot \\Delta t^2$.",
    "Furthermore, Verlet integration simplifies positional collision constraints. When a particle penetrates an obstacle or exceeds a boundary wall, the solver simply projects the current position $x(t)$ directly out of the obstacle surface. In the subsequent frame, the implicit velocity automatically reverses, generating a realistic physical bounce without requiring complex impulse momentum math.",
    "In production high-frequency game engines and visual effects suites, Verlet integration is extended to Velocity Verlet (also called Stormer-Verlet). Velocity Verlet maintains explicit synchronized velocity vectors alongside positions: updating position with current velocity and acceleration, calculating new forces at the updated position, and finally completing the velocity update using the average of old and new accelerations. This preserves second-order precision while making impulse calculations and kinetic energy tracking straightforward for multi-body physics.",
    "In the TypeScript snippet below, we implement the `VerletSimulator`. We execute a discrete numerical integration step, calculate the new spatial position under gravitational acceleration, and extract the resulting implied physical velocity.",
    "Notice how the particle smoothly advances while maintaining numerical stability. With Verlet integration established as our numerical foundation, we now tackle the greatest challenge in physics simulation: Inter-Particle Collision Detection."
]

say_p2 = [
    "Simulating isolated particles flying through space is trivial: each particle executes independently with zero communication. But the true beauty of physical simulations emerges when particles interact: smoke clouds curling against walls, water droplets splashing into pools, or sand grains piling into natural dunes. To create these phenomena, particles must detect and resolve collisions with each other. This brings us face-to-face with the infamous $O(N^2)$ Pairwise Collision Bottleneck.",
    "Consider the physical analogy of a grand masquerade ballroom hosting one thousand masked guests. Imagine that every guest wears a name badge, and you are tasked with identifying every pair of guests who share the exact same birthday. If you adopt a naive pairwise brute-force approach, Guest 1 must walk around the entire room and converse with all 999 other guests. Then Guest 2 must converse with 998 guests, Guest 3 with 997, and so forth. For one thousand guests, this requires nearly five hundred thousand individual conversations! Now imagine a massive outdoor music festival with one million attendees. A pairwise comparison would require $\\frac{N(N-1)}{2} \\approx 500,000,000,000$ (five hundred billion) conversations! Even the most powerful GPU on Earth executing hundreds of billions of comparisons per second would grind to a dead halt, dropping to less than one frame per minute.",
    "Yet in the real physical world, two particles can only collide if they are in close spatial proximity! A grain of sand in Tokyo cannot possibly collide with a grain of sand in London during the current frame. Checking whether every particle in the universe touches every other particle is astronomical computational waste. To eliminate ninety-nine point nine percent of candidate collision checks, computational geometers apply Spatial Partitioning: dividing the continuous 3D world into discrete localized regions, so that particles only test collisions against immediate neighbors in their local vicinity.",
    "On CPUs, spatial partitioning is commonly implemented using hierarchical tree structures, such as Octrees, k-d Trees, or Bounding Volume Hierarchies (BVH). While tree structures are fantastic for serial traversal, they are notoriously hostile to GPU architectures! Tree traversal involves dynamic pointer chasing, divergent branching as different threads traverse different depths of the tree, and non-coalesced memory reads that stall GPU compute units.",
    "To achieve peak GPU throughput, graphics architects abandon hierarchical trees in favor of a flat, perfectly parallel structure: The Uniform Spatial Grid and Spatial Hashing. In a uniform spatial grid, the entire 3D simulation volume is subdivided into regular cubic cells of fixed size $d$, where $d$ is chosen to match or slightly exceed the maximum particle collision diameter ($2 \\cdot r$). Under this geometric invariant, a particle in Cell $(x, y, z)$ can only ever collide with particles in its own cell or the twenty-six adjacent neighboring cells in a $3 \\times 3 \\times 3$ block!",
    "By restricting collision testing to this localized 27-cell neighborhood, the computational complexity collapses from catastrophic quadratic $O(N^2)$ down to optimal linear $O(N)$ amortized time. One million particles now execute in sub-millisecond time on WebGPU compute hardware.",
    "In large open-world simulations where particles spread across miles of terrain, allocating a dense 3D array of cells would consume gigabytes of VRAM. Spatial Hashing solves this memory dilemma by mapping unbounded 3D grid coordinates into a compact, fixed-size hash table using large prime number hashing.",
    "When configuring uniform grids for dynamic simulations, cell dimensions must be tuned with extreme care. If the cell size is made too small (smaller than particle diameters), large particles span across multiple cells, creating complex multi-cell boundary conditions. Conversely, if cells are made excessively large, each cell encapsulates hundreds of particles, triggering localized quadratic bottlenecks within the cell. The golden rule of uniform grid partitioning is to set cell diameter equal to exactly twice the maximum particle radius.",
    "In the TypeScript snippet below, we demonstrate the architectural transition from continuous coordinate spaces to discrete bounding cell queries, laying the theoretical groundwork for parallel spatial hashing.",
    "Understanding the $O(N^2)$ barrier and why uniform grids are superior to trees on SIMD hardware is the key architectural leap required to build AAA-grade physics simulation systems."
]

say_p3 = [
    "Now that we understand why uniform spatial partitioning is essential, we must bridge the mathematical gap between continuous floating-point 3D world coordinates and discrete 1D GPU memory arrays. How does a GPU compute shader map a particle at $(15.2, 8.4, 23.9)$ into a memory address in a storage buffer? This is the mission of The Spatial Hash Function.",
    "Consider the physical analogy of an automated postal sorting facility for a sprawling metropolitan city. Imagine millions of letters arriving with continuous geographic street addresses. The sorting machines do not try to build a 3D physical map of every house on every hill! Instead, the post office divides the map into discrete postal ZIP codes. Every house within a four-square-mile zone is assigned ZIP code 94102. When letters enter the sorting facility, optical scanners convert street numbers into the discrete ZIP code, and conveyor belts immediately drop the envelopes into twenty-four standardized regional mail bins. The postal system translates infinite geographic variety into a finite set of indexed sorting containers.",
    "In a GPU spatial hashing pipeline, this translation happens in two distinct mathematical stages: Cell Discretization and Prime Hashing. In Stage 1 (Cell Discretization), the continuous 3D world position $P = (x, y, z)$ is converted into integer grid cell coordinates $(c_x, c_y, c_z)$ by dividing each component by the uniform cell size $S$ and applying the mathematical floor function: $c_x = \\lfloor x / S \\rfloor$, $c_y = \\lfloor y / S \\rfloor$, $c_z = \\lfloor z / S \\rfloor$. For example, with a cell size of $S = 5.0$, a particle at $(15.2, 8.4, 23.9)$ maps to discrete cell coordinates $(3, 1, 4)$. All particles whose positions fall between $x \\in [15.0, 20.0)$, $y \\in [5.0, 10.0)$, and $z \\in [20.0, 25.0)$ share this exact discrete cell coordinate.",
    "In Stage 2 (Prime Hashing), we must map the 3D integer coordinate $(c_x, c_y, c_z)$—which can theoretically range across positive and negative infinity—into a single 1D unsigned integer hash key that fits within a fixed-size table of size $M$ (typically a power of two, such as $M = 65,536$ or $1,048,576$). To minimize hash collisions where completely unrelated distant cells map to the same bucket, we use Large Prime Multiplicative Hashing, formulated by Teschner et al.: $\\text{hash}(c_x, c_y, c_z) = \\left( (c_x \\cdot p_1) \\oplus (c_y \\cdot p_2) \\oplus (c_z \\cdot p_3) \\right) \\pmod M$, where $p_1, p_2, p_3$ are massive, carefully chosen prime numbers (such as $p_1 = 73,856,093$, $p_2 = 19,349,663$, and $p_3 = 83,492,791$) and $\\oplus$ represents the bitwise XOR operator.",
    "Because these prime numbers are coprime to each other and distribute bits uniformly across all 32 bits of the integer word, the XOR combination acts as an avalanche mixer. Neighboring cells produce wildly divergent bit patterns, ensuring that particles in adjacent or distant cells disperse evenly across the hash table with minimal clustering.",
    "In WGSL, this hash function compiles into just five fast hardware instructions: three integer multiplications, two bitwise XORs, and a modulo or bitwise AND (if $M$ is a power of two, $\\pmod M$ is computed instantly via `hash & (M - 1u)`). Every thread computes its particle's spatial hash in less than two nanoseconds.",
    "In addition to 3D grid hashing, modern GPU engines often employ Morton Codes (Z-Order Space Filling Curves). By interleaving the binary bits of discrete coordinates (x, y, z), Morton encoding maps 3D points to a 1D curve that preserves spatial locality. When particles are sorted along the Morton curve, nearby physical particles remain closely clustered in memory cache lines, dramatically enhancing GPU L1 and L2 cache hit rates during neighbor queries.",
    "In the TypeScript snippet below, we implement the `SpatialHasher`. We calculate discrete 3D cell coordinates from continuous floating-point positions, execute the prime XOR spatial hash formula, and output the resulting 1D table hash key.",
    "Notice how position $(15.2, 8.4, 23.9)$ discretizes cleanly to cell $(3, 1, 4)$ and hashes to key 852. With spatial hashing mastered, we now examine how the GPU organizes these hash keys into collision query buckets."
]

say_p4 = [
    "Generating a spatial hash key for each particle is only half the battle. Now, thousands of threads need to query which OTHER particles currently share the same cell or reside in adjacent cells. If multiple particles hash to cell 852, how does Thread 42 discover the list of particle indices in cell 852 without encountering data races or requiring expensive dynamic memory allocation?",
    "Consider the physical analogy of an old-fashioned library card catalog. Imagine thousands of newly acquired books arriving at a university library every morning. If librarians tried to place books directly onto shelves simultaneously without coordination, they would constantly bump into each other in the narrow aisles. Instead, the intake staff writes each book's catalog code onto an index card. At noon, an automated sorting machine sorts the index cards in ascending numerical order of their catalog numbers. Once the cards are sorted, finding all books on astrophysics (e.g. code 520) is instantaneous: you flip directly to section 520, read the contiguous block of cards, and find every book listed back-to-back without searching the rest of the library.",
    "In GPU architecture, this exact strategy is implemented as GPU Radix Sort and Cell Offset Indexing. The pipeline executes across four synchronized compute passes: Pass 1 (Hash Generation): Each thread computes its particle's 32-bit cell hash key and writes a pair `(cell_hash, particle_id)` into a global key-value buffer. Pass 2 (Parallel Radix Sort): The GPU runs a high-speed parallel Radix Sort on the key-value buffer. Because radix sort operates on 32-bit integer keys using Blelloch prefix scans, one million keys are sorted in under two milliseconds! After sorting, all particles belonging to the same spatial cell are grouped together in contiguous memory.",
    "Pass 3 (Cell Range Construction): A compute kernel launches with one thread per sorted entry. Thread $i$ compares `keys[i]` with `keys[i-1]`. If the key changed, Thread $i$ knows that a new cell begins at index $i$! It writes $i$ into `cell_start[keys[i]]` and writes $i$ into `cell_end[keys[i-1]]`. If a cell is empty, its start index is marked invalid (`0xFFFFFFFF`). In a single pass, we have constructed an $O(1)$ constant-time lookup table of cell ranges!",
    "Pass 4 (Neighbor Search & Collision Query): When a particle in cell $C$ seeks colliding partners, it calculates the hash keys for the twenty-seven cells in its $3 \\times 3 \\times 3$ neighborhood. For each neighbor cell hash, it looks up `cell_start[hash]` and `cell_end[hash]`. If valid, it iterates through that tiny contiguous slice of particles (typically 2 to 6 particles) in VRAM, performing exact geometric collision math.",
    "Notice the sheer architectural triumph: There are zero dynamic memory allocations, zero linked list pointers, zero lock contention, and memory accesses within each cell are perfectly coalesced streaming reads across contiguous cache lines!",
    "To further accelerate neighbor searches across the 27-cell stencil, compute shaders leverage Workgroup Shared Memory (var<workgroup>). Instead of having every thread redundantly load neighbor cell bounds from global VRAM, threads within a workgroup cooperatively preload neighbor cell data into on-chip cache. By staging candidate neighbor particles in shared memory, threads resolve collision checks with single-cycle SRAM latency, completely bypassing global memory bus saturation.",
    "This cooperative caching pattern demonstrates the power of co-designing spatial data structures with modern SIMD hardware. Rather than treating memory access as an afterthought, every step of the spatial grid build—from hashing and radix sorting to offset indexing and neighbor iteration—is sculpted around GPU memory hierarchy strengths.",
    "In the TypeScript snippet below, we implement the `SpatialGridBucketer` and `NeighborSearchSimulator`. We bucket particles by spatial keys, enumerate the complete 27-cell neighbor offset stencil, and evaluate candidate collision pairs.",
    "Notice how candidate checks are constrained to immediate spatial neighbors, slashing computation by orders of magnitude. Next, we resolve physical collision responses."
]

say_p5 = [
    "We now culminate our GPGPU physics engine by resolving the physical mechanics of impact: Elastic Particle-Particle Collisions and Boundary Restitution. Once the spatial hash neighbor query identifies that Particle A and Particle B are within collision distance ($||P_A - P_B|| < r_A + r_B$), the compute shader must adjust their positions and velocities to simulate realistic physical contact.",
    "Consider the physical analogy of two billiard balls colliding on a tournament pool table. When the cue ball strikes the eight-ball, two physical events happen in a fraction of a millisecond: First, the elastic material of the billiard balls compresses slightly and pushes back with immense normal force, preventing the two solid balls from occupying the same physical space. Second, momentum and kinetic energy are exchanged along the line connecting their centers of mass: the cue ball decelerates or deflects, while the eight-ball shoots forward into the pocket. If the cue ball strikes the wooden rail of the table, the rail absorbs a fraction of the energy (surface restitution) and reflects the ball back onto the green felt with dampened velocity.",
    "In our GPU physics kernel, we resolve particle-particle collisions using Position-Based Dynamics (PBD) and Elastic Impulse Exchange. First, the compute shader calculates the displacement vector between the two particle centers: $\\Delta P = P_B - P_A$, and computes the Euclidean distance $d = ||\\Delta P||$. If $d < r_A + r_B$, a collision has occurred! The penetration depth is $\\delta = (r_A + r_B) - d$, and the contact normal unit vector is $\\hat{n} = \\frac{\\Delta P}{d}$.",
    "To eliminate particle overlap and prevent unsightly visual interpenetration, the solver immediately displaces each particle along the collision normal inversely proportional to their masses: $P_A \\leftarrow P_A - \\hat{n} \\cdot \\delta \\cdot \\frac{m_B}{m_A + m_B}$, and $P_B \\leftarrow P_B + \\hat{n} \\cdot \\delta \\cdot \\frac{m_A}{m_A + m_B}$. For equal mass particles, each particle simply steps backward by half the penetration depth ($\\frac{\\delta}{2}$).",
    "Next, the shader computes the relative velocity along the contact normal: $v_{rel} = (V_B - V_A) \\cdot \\hat{n}$. If $v_{rel} < 0$ (the particles are moving toward each other), the elastic impulse magnitude $J$ is calculated: $J = \\frac{-(1.0 + e) \\cdot v_{rel}}{\\frac{1}{m_A} + \\frac{1}{m_B}}$, where $e \\in [0, 1]$ is the Coefficient of Restitution ($e = 1.0$ represents a perfectly elastic collision like steel ball bearings; $e = 0.0$ represents a completely inelastic collision like wet clay). The velocities are updated instantaneously: $V_A \\leftarrow V_A - \\frac{J}{m_A} \\cdot \\hat{n}$ and $V_B \\leftarrow V_B + \\frac{J}{m_B} \\cdot \\hat{n}$.",
    "Finally, Boundary Collisions are enforced against simulation domain walls (such as bounding boxes or floor planes). If a particle's coordinate exceeds the box boundary, its position is clamped to the boundary surface, and its normal velocity component is reflected and multiplied by the wall restitution coefficient ($V_n \\leftarrow -V_n \\cdot e_{wall}$).",
    "In dense fluid and granular media simulations, multiple particles often collide simultaneously within a single time step. To prevent solver divergence and ensure deterministic convergence, modern GPU solvers execute Jacobi-style position relaxation. In each iteration, positional corrections are computed concurrently for all particle pairs, averaged across all participating contacts, and applied simultaneously at a workgroup barrier fence. This multi-pass relaxation stabilizes high-pressure particle stacks, such as avalanches or fluid splashes.",
    "Furthermore, friction and tangential drag are incorporated using Coulomb friction cones. When contact normal forces are resolved, tangential velocity components are clamped against the maximum frictional force limit ($F_{friction} \le \mu \cdot F_{normal}$), giving piles of granular sand and debris their characteristic natural angles of repose.",
    "In the TypeScript snippet below, we implement the `ElasticCollisionResolver`. We calculate geometric penetration overlaps, apply conservation of linear momentum, and compute post-impact velocity vectors.",
    "Notice how two colliding particles with velocities $+5.0$ and $-3.0$ exchange momentum and separate with velocities $-3.0$ and $+5.0$. Tomorrow, in Day 35, we bring all these systems together into the Grand Milestone 7 Capstone: The 1,000,000 Particle WebGPU Compute Engine!"
]

# Snippets from test script
c1 = """interface VerletParticle {
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
console.log(`[Verlet] Implied Velocity: ${result.impliedVelocity}`);"""

o1 = """[Verlet] Current Pos: 10, Prev Pos: 9.8
[Verlet] Next Computed Pos: 10.1975
[Verlet] Implied Velocity: 12.3432"""

c2 = """interface Point3D {
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
console.log(`[Spatial Hash] Hash Key (mod ${tableSize}): ${hashKey}`);"""

o2 = """[Spatial Hash] Position: (15.2, 8.4, 23.9)
[Spatial Hash] Discrete Cell: (3,1,4)
[Spatial Hash] Hash Key (mod 1024): 852"""

c3 = """interface HashEntry {
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
}"""

o3 = """[Cell Bucket] Cell 42: Particles [101, 103, 104] (Count: 3)
[Cell Bucket] Cell 88: Particles [102, 105] (Count: 2)"""

c4 = """class NeighborSearchSimulator {
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
console.log(`[Neighbor Search] Potential Colliding Candidates: ${candidates}`);"""

o4 = """[Neighbor Search] Total Neighbor Cell Offsets: 27
[Neighbor Search] Potential Colliding Candidates: 9"""

c5 = """interface SphereParticle {
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
console.log(`[Elastic Collision] Particle 2 Velocity Post-Impact: ${collision.v2Next}`);"""

o5 = """[Elastic Collision] Overlap: 0.5 units
[Elastic Collision] Particle 1 Velocity Post-Impact: -3
[Elastic Collision] Particle 2 Velocity Post-Impact: 5"""

day34_data = {
    'day': 34,
    'coursePrefix': 'g3d',
    'title': 'GPGPU Parallel Particle Physics & Spatial Hash Collision Detection',
    'goal': 'Implement high-throughput GPU physics: Verlet numerical integration, 3D prime spatial hashing, 27-cell neighbor search, and elastic collision response.',
    'recap': 'Recap of Day 33: Atomic concurrency in WGSL, append counters, bounding volume reduction, Blelloch work-efficient parallel scan, and stream compaction.',
    'minutes': 120,
    'parts': [
        {
            'part': 1,
            'title': 'Numerical Integration on GPU: Euler vs Verlet Integration',
            'say': say_p1,
            'example': 'An archer tracking an arrow trajectory with symplectic energy conservation versus unstable forward Euler velocity estimations.',
            'code': c1,
            'output': o1,
            'check': {
                'question': 'Why is Verlet Integration preferred over Explicit Forward Euler in GPU physics simulations?',
                'options': [
                    'Because Verlet integration is symplectic and unconditionally conserves energy over time, eliminating numerical explosions and artificial energy gain.',
                    'Because Forward Euler requires double precision 64-bit floating point hardware not available in WebGPU.',
                    'Because Verlet integration requires solving implicit matrix inverses on the CPU.',
                    'Because Forward Euler cannot be executed inside a compute shader.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Verlet integration naturally conserves energy by maintaining phase-space volume, preventing particles from oscillating wildly or blowing up.'
            }
        },
        {
            'part': 2,
            'title': 'The O(N^2) Pairwise Collision Bottleneck & Spatial Partitioning',
            'say': say_p2,
            'example': 'A masquerade ballroom where guests only speak to nearby neighbors rather than conversing with every attendee in a half-billion pair nightmare.',
            'code': c2,
            'output': o2,
            'check': {
                'question': 'How does uniform spatial partitioning reduce the computational complexity of particle collision detection?',
                'options': [
                    'It subdivides continuous 3D space into uniform cells so particles only test collisions against immediately adjacent neighbors, dropping complexity from O(N^2) to O(N).',
                    'It deletes eighty percent of the particles from memory before running the collision check.',
                    'It forces all particles to travel along a single one-dimensional axis.',
                    'It runs collision checks exclusively on the CPU while the GPU sleeps.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'By restricting candidate pairs to particles residing in the immediate 27 neighboring cells, pairwise checks scale linearly with particle count.'
            }
        },
        {
            'part': 3,
            'title': 'Spatial Hash Mapping: 3D Discrete Cell Coordinates to 1D Hash Keys',
            'say': say_p3,
            'example': 'A metropolitan postal sorting center that converts continuous home addresses into discrete ZIP codes and standardized sorting bins.',
            'code': c3,
            'output': o3,
            'check': {
                'question': 'Why are large prime numbers used in the 3D spatial hash formula ((x*p1) ^ (y*p2) ^ (z*p3)) % M?',
                'options': [
                    'Because multiplying by large primes distributes coordinate bits across the integer word, acting as an avalanche mixer that minimizes hash collisions.',
                    'Because WebGPU compute units can only execute arithmetic on prime numbers.',
                    'Because prime numbers prevent the browser from caching shader bytecode.',
                    'Because the IEEE 754 standard requires prime numbers for floating-point calculations.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Prime multiplication and bitwise XOR thoroughly mix spatial coordinate bits, dispersing nearby and distant cells evenly across the hash table.'
            }
        },
        {
            'part': 4,
            'title': 'Building the GPU Spatial Cell Bucket & Particle Linked List / Index Table',
            'say': say_p4,
            'example': 'A university library card catalog that sorts book slips in numerical order so all physics books appear consecutively on the shelf.',
            'code': c4,
            'output': o4,
            'check': {
                'question': 'How does parallel radix sorting eliminate dynamic pointer allocation in GPU spatial grid construction?',
                'options': [
                    'By sorting (cell_hash, particle_id) pairs into contiguous order, allowing cell contents to be identified as contiguous index slices [start, end].',
                    'By converting all 3D particle positions into 2D screen space coordinates.',
                    'By transmitting the particle array across WebSockets to a Node.js server.',
                    'By compressing particle positions using lossy JPEG encoding.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Sorting by cell key groups all particles in the same cell contiguously in VRAM, turning spatial queries into fast bounded range scans.'
            }
        },
        {
            'part': 5,
            'title': 'Resolving Elastic Particle-Particle Collisions & Boundary Restitution',
            'say': say_p5,
            'example': 'Two tournament billiard balls exchanging momentum along their contact normal line with acoustic and kinetic energy conservation.',
            'code': c5,
            'output': o5,
            'check': {
                'question': 'In Position-Based Dynamics (PBD), how is inter-particle penetration resolved when two spheres collide?',
                'options': [
                    'Each sphere is immediately displaced along the contact normal inversely proportional to its mass by its share of the overlap depth.',
                    'Both spheres are deleted and replaced by a single explosion particle.',
                    'The simulation halts and rewinds the clock by one full second.',
                    'The particles are assigned zero velocity and frozen in place forever.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Projecting positions along the collision normal separates penetrating spheres instantaneously, and subsequent Verlet steps generate accurate rebound velocity.'
            }
        }
    ],
    'projectStep': {
        'title': 'Implement GPU Spatial Hashing & Real-Time Parallel Particle Collision Engine',
        'steps': [
            'Deploy Verlet numerical integration compute kernels to advance particle coordinates with energy conservation.',
            'Implement 3D large prime spatial hashing to discretize particle positions into 1D hash keys.',
            'Construct cell offset range tables via GPU key-value sorting to enable O(1) neighbor lookups.',
            'Execute 27-cell neighbor search kernels to detect overlaps and resolve elastic sphere collisions.'
        ]
    },
    'summary': [
        'Verlet numerical integration provides symplectic energy conservation and robust physical stability without explicit velocity storage.',
        'The quadratic O(N^2) collision bottleneck is eliminated by uniform spatial grid partitioning, restricting checks to 27 neighboring cells.',
        'Large prime spatial hashing maps unbounded 3D coordinates into a compact 1D hash table with minimal clustering.',
        'Sorting particles by spatial hash keys produces contiguous memory ranges that can be queried in O(1) time without pointer allocations.',
        'Position-Based Dynamics (PBD) and momentum impulse exchange resolve elastic sphere-sphere impacts and boundary reflections.'
    ]
}

# Verify word count
for p in day34_data['parts']:
    wc = sum(len(para.split()) for para in p['say'])
    print(f"G3D Day 34 Part {p['part']} Word Count: {wc}")
    assert wc >= 600, f"Part {p['part']} word count {wc} below 600 words!"

with open('scripts/g3d_day34_data.py', 'w', encoding='utf-8') as f:
    f.write(f"day34_data = {repr(day34_data)}\n")

print("scripts/g3d_day34_data.py successfully written!")
