// scripts/branch_c/test_day42_snippets.ts

// Part 1: Two-DFS vs Single-Pass Tree DP Diameter
function part1() {
  const n = 7;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [
    [0, 1], [0, 2],
    [1, 3], [1, 4],
    [4, 5], [4, 6]
  ];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Method A: Single-pass Tree DP
  let dpDiameter = 0;
  function dfsDP(u: number, parent: number): number {
    let first = 0;
    let second = 0;
    for (const v of adj[u]) {
      if (v === parent) continue;
      const childH = dfsDP(v, u) + 1;
      if (childH > first) {
        second = first;
        first = childH;
      } else if (childH > second) {
        second = childH;
      }
    }
    dpDiameter = Math.max(dpDiameter, first + second);
    return first;
  }
  dfsDP(0, -1);

  // Method B: 2-DFS Approach
  function bfsFarthest(start: number): { node: number; dist: number } {
    const dist = new Array(n).fill(-1);
    const queue = [start];
    dist[start] = 0;
    let farthestNode = start;
    let maxDist = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      if (dist[u] > maxDist) {
        maxDist = dist[u];
        farthestNode = u;
      }
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          queue.push(v);
        }
      }
    }
    return { node: farthestNode, dist: maxDist };
  }

  const endA = bfsFarthest(0).node;
  const resB = bfsFarthest(endA);
  const twoDfsDiameter = resB.dist;

  console.log(JSON.stringify({
    dpDiameter,
    twoDfsDiameter,
    endpoints: [endA, resB.node],
    match: dpDiameter === twoDfsDiameter
  }));
}

// Part 2: Tree Center and Minimum Eccentricity Discovery
function part2() {
  const n = 7;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [
    [0, 1], [0, 2],
    [1, 3], [1, 4],
    [4, 5], [4, 6]
  ];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Degree array for leaf-peeling
  const degree = adj.map(neighbors => neighbors.length);
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) {
    if (degree[i] <= 1) {
      leaves.push(i);
    }
  }

  let remaining = n;
  while (remaining > 2) {
    const count = leaves.length;
    remaining -= count;
    const newLeaves: number[] = [];
    for (const leaf of leaves) {
      for (const v of adj[leaf]) {
        degree[v]--;
        if (degree[v] === 1) {
          newLeaves.push(v);
        }
      }
    }
    leaves = newLeaves;
  }

  const centers = leaves.sort((a, b) => a - b);
  console.log(JSON.stringify({
    nodeCount: n,
    treeCenters: centers,
    centerCount: centers.length
  }));
}

// Part 3: Subtree Distance Sums
function part3() {
  const n = 6;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const subtreeSize = new Array(n).fill(1);
  const sumDistSubtree = new Array(n).fill(0);

  function dfsDist(u: number, parent: number) {
    for (const v of adj[u]) {
      if (v === parent) continue;
      dfsDist(v, u);
      subtreeSize[u] += subtreeSize[v];
      sumDistSubtree[u] += sumDistSubtree[v] + subtreeSize[v];
    }
  }
  dfsDist(0, -1);

  console.log(JSON.stringify({
    root: 0,
    rootSubtreeSize: subtreeSize[0],
    rootSumDistSubtree: sumDistSubtree[0],
    nodeOneSumDist: sumDistSubtree[1]
  }));
}

// Part 4: Heavy-Light Path Decomposition Preliminaries
function part4() {
  const n = 7;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [
    [0, 1], [0, 2],
    [1, 3], [1, 4],
    [4, 5], [4, 6]
  ];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const sz = new Array(n).fill(1);
  const heavy = new Array(n).fill(-1);
  const depth = new Array(n).fill(0);
  const parent = new Array(n).fill(-1);

  function dfsHeavy(u: number, p: number, d: number) {
    depth[u] = d;
    parent[u] = p;
    let maxSub = 0;
    for (const v of adj[u]) {
      if (v === p) continue;
      dfsHeavy(v, u, d + 1);
      sz[u] += sz[v];
      if (sz[v] > maxSub) {
        maxSub = sz[v];
        heavy[u] = v;
      }
    }
  }
  dfsHeavy(0, -1, 0);

  console.log(JSON.stringify({
    rootHeavyChild: heavy[0],
    nodeOneHeavyChild: heavy[1],
    nodeOneSubtreeSize: sz[1],
    heavyVector: heavy
  }));
}

// Part 5: Enterprise Application: OpticalBackplaneRouter
function part5() {
  interface SwitchLink {
    u: number;
    v: number;
    bandwidthGbps: number;
  }

  interface BackplaneTelemetry {
    totalSwitches: number;
    backplaneDiameterHops: number;
    centralSwitchId: number;
    worstCasePropagationDelayNs: number;
    heavyTrunks: Array<{ from: number; to: number }>;
  }

  class OpticalBackplaneRouter {
    private n: number;
    private adj: Array<Array<{ to: number; bw: number }>>;

    constructor(switchCount: number) {
      this.n = switchCount;
      this.adj = Array.from({ length: switchCount }, () => []);
    }

    public addFiberInterconnect(u: number, v: number, bandwidthGbps: number): void {
      this.adj[u].push({ to: v, bw: bandwidthGbps });
      this.adj[v].push({ to: u, bw: bandwidthGbps });
    }

    public analyzeTopology(): BackplaneTelemetry {
      // 1. Calculate diameter via Tree DP
      let maxDiameter = 0;
      const dfsDiam = (u: number, p: number): number => {
        let f = 0;
        let s = 0;
        for (const edge of this.adj[u]) {
          if (edge.to === p) continue;
          const h = dfsDiam(edge.to, u) + 1;
          if (h > f) {
            s = f;
            f = h;
          } else if (h > s) {
            s = h;
          }
        }
        maxDiameter = Math.max(maxDiameter, f + s);
        return f;
      };
      dfsDiam(0, -1);

      // 2. Find tree center via leaf peeling
      const deg = this.adj.map(l => l.length);
      let leaves: number[] = [];
      for (let i = 0; i < this.n; i++) {
        if (deg[i] <= 1) leaves.push(i);
      }
      let rem = this.n;
      while (rem > 2) {
        rem -= leaves.length;
        const nextLeaves: number[] = [];
        for (const leaf of leaves) {
          for (const edge of this.adj[leaf]) {
            deg[edge.to]--;
            if (deg[edge.to] === 1) nextLeaves.push(edge.to);
          }
        }
        leaves = nextLeaves;
      }
      const center = leaves[0];

      // 3. Compute heavy trunks rooted at center
      const sz = new Array(this.n).fill(1);
      const heavyTrunk = new Array(this.n).fill(-1);
      const dfsHeavy = (u: number, p: number) => {
        let maxC = 0;
        for (const edge of this.adj[u]) {
          if (edge.to === p) continue;
          dfsHeavy(edge.to, u);
          sz[u] += sz[edge.to];
          if (sz[edge.to] > maxC) {
            maxC = sz[edge.to];
            heavyTrunk[u] = edge.to;
          }
        }
      };
      dfsHeavy(center, -1);

      const trunks: Array<{ from: number; to: number }> = [];
      for (let i = 0; i < this.n; i++) {
        if (heavyTrunk[i] !== -1) {
          trunks.push({ from: i, to: heavyTrunk[i] });
        }
      }

      // Optical delay: 5 ns per meter, ~2 meters per hop + 10 ns switch latency = 20 ns/hop
      const worstCaseDelay = maxDiameter * 20;

      return {
        totalSwitches: this.n,
        backplaneDiameterHops: maxDiameter,
        centralSwitchId: center,
        worstCasePropagationDelayNs: worstCaseDelay,
        heavyTrunks: trunks
      };
    }
  }

  const router = new OpticalBackplaneRouter(8);
  // Interconnect optical topology: 0 connected to 1, 2; 1 to 3, 4; 4 to 5, 6; 6 to 7
  router.addFiberInterconnect(0, 1, 800);
  router.addFiberInterconnect(0, 2, 800);
  router.addFiberInterconnect(1, 3, 400);
  router.addFiberInterconnect(1, 4, 800);
  router.addFiberInterconnect(4, 5, 400);
  router.addFiberInterconnect(4, 6, 800);
  router.addFiberInterconnect(6, 7, 400);

  const telemetry = router.analyzeTopology();
  console.log(JSON.stringify(telemetry));
}

console.log("--- Part 1 ---");
part1();
console.log("--- Part 2 ---");
part2();
console.log("--- Part 3 ---");
part3();
console.log("--- Part 4 ---");
part4();
console.log("--- Part 5 ---");
part5();
