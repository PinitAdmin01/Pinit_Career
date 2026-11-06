// scripts/branch_c/test_day45_snippets.ts

// Part 1: Grid Topology Modeling & Subtree Power Aggregation
function part1() {
  const n = 6;
  const adj: Array<Array<{ to: number; impedance: number }>> = Array.from({ length: n }, () => []);
  const edges = [
    { u: 0, v: 1, imp: 2 },
    { u: 0, v: 2, imp: 3 },
    { u: 1, v: 3, imp: 1 },
    { u: 1, v: 4, imp: 2 },
    { u: 2, v: 5, imp: 4 }
  ];
  for (const e of edges) {
    adj[e.u].push({ to: e.v, impedance: e.imp });
    adj[e.v].push({ to: e.u, impedance: e.imp });
  }

  const loadsMW = [0, 15, 20, 10, 25, 30]; // Power consumption at substations
  const subLoad = new Array(n).fill(0);
  const subLoss = new Array(n).fill(0);

  function dfsPower(u: number, p: number) {
    subLoad[u] = loadsMW[u];
    for (const edge of adj[u]) {
      if (edge.to === p) continue;
      dfsPower(edge.to, u);
      subLoad[u] += subLoad[edge.to];
      // Transmission loss = I^2 * R approximation
      subLoss[u] += subLoss[edge.to] + subLoad[edge.to] * edge.impedance;
    }
  }
  dfsPower(0, -1);

  console.log(JSON.stringify({
    totalGridDemandMW: subLoad[0],
    substationOneSubtreeDemandMW: subLoad[1],
    rootTotalTransmissionLoss: subLoss[0]
  }));
}

// Part 2: All-Roots Rerooting for Generation Injection Point
function part2() {
  const n = 6;
  const adj: Array<Array<{ to: number; imp: number }>> = Array.from({ length: n }, () => []);
  const edges = [
    { u: 0, v: 1, imp: 2 },
    { u: 0, v: 2, imp: 3 },
    { u: 1, v: 3, imp: 1 },
    { u: 1, v: 4, imp: 2 },
    { u: 2, v: 5, imp: 4 }
  ];
  for (const e of edges) {
    adj[e.u].push({ to: e.v, imp: e.imp });
    adj[e.v].push({ to: e.u, imp: e.imp });
  }

  const loads = [5, 10, 15, 8, 12, 20];
  const totalLoad = loads.reduce((a, b) => a + b, 0);
  const szLoad = new Array(n).fill(0);
  const dpLoss = new Array(n).fill(0);
  const totalLoss = new Array(n).fill(0);

  // Pass 1: Bottom-up pull
  function dfsPull(u: number, p: number) {
    szLoad[u] = loads[u];
    for (const e of adj[u]) {
      if (e.to === p) continue;
      dfsPull(e.to, u);
      szLoad[u] += szLoad[e.to];
      dpLoss[u] += dpLoss[e.to] + szLoad[e.to] * e.imp;
    }
  }
  dfsPull(0, -1);

  // Pass 2: Top-down push
  totalLoss[0] = dpLoss[0];
  function dfsPush(u: number, p: number) {
    for (const e of adj[u]) {
      if (e.to === p) continue;
      // Rerooting loss: moving source from u to e.to across impedance e.imp
      // nodes in e.to's subtree get closer by e.imp: -szLoad[e.to] * e.imp
      // nodes outside get further by e.imp: +(totalLoad - szLoad[e.to]) * e.imp
      totalLoss[e.to] = totalLoss[u] + (totalLoad - 2 * szLoad[e.to]) * e.imp;
      dfsPush(e.to, u);
    }
  }
  dfsPush(0, -1);

  const minLoss = Math.min(...totalLoss);
  const optimalGenSite = totalLoss.indexOf(minLoss);

  console.log(JSON.stringify({
    totalGridLoad: totalLoad,
    allRootsLossProfile: totalLoss,
    optimalInjectionSubstation: optimalGenSite,
    minimalLossScore: minLoss
  }));
}

// Part 3: Islanding Detection & Centroid Quorum Failover
function part3() {
  const n = 6;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  // Transmission line (0, 1) trips, islanding Island A {0, 2, 5} and Island B {1, 3, 4}
  const activeEdges = [[0, 2], [2, 5], [1, 3], [1, 4]];
  for (const [u, v] of activeEdges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  function findCentroid(nodes: number[]): number {
    const size = new Array(n).fill(0);
    const islandSize = nodes.length;

    function dfsSize(u: number, p: number) {
      size[u] = 1;
      for (const v of adj[u]) {
        if (v === p) continue;
        dfsSize(v, u);
        size[u] += size[v];
      }
    }
    dfsSize(nodes[0], -1);

    let centroid = nodes[0];
    function dfsCen(u: number, p: number) {
      let isCen = true;
      for (const v of adj[u]) {
        if (v === p) continue;
        if (size[v] > Math.floor(islandSize / 2)) isCen = false;
        dfsCen(v, u);
      }
      if (islandSize - size[u] > Math.floor(islandSize / 2)) isCen = false;
      if (isCen) centroid = u;
    }
    dfsCen(nodes[0], -1);
    return centroid;
  }

  const islandA = [0, 2, 5];
  const islandB = [1, 3, 4];
  const cenA = findCentroid(islandA);
  const cenB = findCentroid(islandB);

  console.log(JSON.stringify({
    islandACentroid: cenA,
    islandBCentroid: cenB,
    isolatedQuorumEstablished: true
  }));
}

// Part 4: Euler Tour Knapsack Emergency Load Shedding
function part4() {
  const n = 6;
  const maxGenerationMW = 35; // Generation budget limit
  const demands = [5, 10, 15, 8, 12, 10]; // MW demand
  const priorities = [100, 80, 90, 60, 70, 75]; // Societal priority score

  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
  }

  const euler: number[] = [];
  const subSize = new Array(n).fill(0);
  function dfsEuler(u: number) {
    euler.push(u);
    let s = 1;
    for (const v of adj[u]) {
      dfsEuler(v);
      s += subSize[v];
    }
    subSize[u] = s;
  }
  dfsEuler(0);

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(maxGenerationMW + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    const u = euler[i];
    const cost = demands[u];
    const val = priorities[u];
    const skipIdx = i + subSize[u];

    for (let w = 0; w <= maxGenerationMW; w++) {
      const skipVal = skipIdx <= n ? dp[skipIdx][w] : 0;
      let takeVal = 0;
      if (w >= cost) {
        takeVal = val + dp[i + 1][w - cost];
      }
      dp[i][w] = Math.max(skipVal, takeVal);
    }
  }

  console.log(JSON.stringify({
    maxGenerationMW,
    maxRetainedPriority: dp[0][maxGenerationMW],
    loadSheddingResolved: true
  }));
}

// Part 5: ⭐ Grand Capstone Project: EnterpriseGridTopologyOptimizer
function part5() {
  interface Substation {
    id: number;
    name: string;
    powerDemandMW: number;
    societalPriority: number;
  }

  interface GridTelemetryReport {
    totalSubstations: number;
    totalGridDemandMW: number;
    optimalGenerationInjectionSubstation: number;
    minimalLossImpedanceScore: number;
    emergencyIslandCentroids: number[];
    loadSheddingMaxPriority: number;
  }

  class EnterpriseGridTopologyOptimizer {
    private n: number;
    private substations: Substation[];
    private adj: Array<Array<{ to: number; impedance: number }>>;

    constructor(substationCount: number) {
      this.n = substationCount;
      this.substations = [];
      this.adj = Array.from({ length: substationCount }, () => []);
    }

    public registerSubstation(id: number, name: string, demandMW: number, priority: number): void {
      this.substations[id] = { id, name, powerDemandMW: demandMW, societalPriority: priority };
    }

    public addTransmissionLine(u: number, v: number, impedance: number): void {
      this.adj[u].push({ to: v, impedance });
      this.adj[v].push({ to: u, impedance });
    }

    public executeOptimization(maxGenerationCapacityMW: number): GridTelemetryReport {
      const totalDemand = this.substations.reduce((s, sub) => s + sub.powerDemandMW, 0);

      // 1. Two-pass All-Roots Rerooting for optimal power injection
      const szLoad = new Array(this.n).fill(0);
      const dpLoss = new Array(this.n).fill(0);
      const totalLoss = new Array(this.n).fill(0);

      const dfsPull = (u: number, p: number) => {
        szLoad[u] = this.substations[u].powerDemandMW;
        for (const edge of this.adj[u]) {
          if (edge.to === p) continue;
          dfsPull(edge.to, u);
          szLoad[u] += szLoad[edge.to];
          dpLoss[u] += dpLoss[edge.to] + szLoad[edge.to] * edge.impedance;
        }
      };
      dfsPull(0, -1);

      totalLoss[0] = dpLoss[0];
      const dfsPush = (u: number, p: number) => {
        for (const edge of this.adj[u]) {
          if (edge.to === p) continue;
          totalLoss[edge.to] = totalLoss[u] + (totalDemand - 2 * szLoad[edge.to]) * edge.impedance;
          dfsPush(edge.to, u);
        }
      };
      dfsPush(0, -1);

      const minLoss = Math.min(...totalLoss);
      const optimalInjection = totalLoss.indexOf(minLoss);

      // 2. Kahn Leaf Peeling Centroid Discovery for Islanding Stability
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
      const islandCentroids = leaves.sort((a, b) => a - b);

      // 3. Euler Tour Skip Knapsack for Load Shedding under capacity limits
      const euler: number[] = [];
      const subSize = new Array(this.n).fill(0);
      const dfsEuler = (u: number, p: number) => {
        euler.push(u);
        let count = 1;
        for (const edge of this.adj[u]) {
          if (edge.to === p) continue;
          dfsEuler(edge.to, u);
          count += subSize[edge.to];
        }
        subSize[u] = count;
      };
      dfsEuler(optimalInjection, -1);

      const dp: number[][] = Array.from({ length: this.n + 1 }, () => new Array(maxGenerationCapacityMW + 1).fill(0));
      for (let i = this.n - 1; i >= 0; i--) {
        const u = euler[i];
        const cost = this.substations[u].powerDemandMW;
        const val = this.substations[u].societalPriority;
        const skipIdx = i + subSize[u];

        for (let w = 0; w <= maxGenerationCapacityMW; w++) {
          const skipVal = skipIdx <= this.n ? dp[skipIdx][w] : 0;
          let takeVal = 0;
          if (w >= cost) {
            takeVal = val + dp[i + 1][w - cost];
          }
          dp[i][w] = Math.max(skipVal, takeVal);
        }
      }

      return {
        totalSubstations: this.n,
        totalGridDemandMW: totalDemand,
        optimalGenerationInjectionSubstation: optimalInjection,
        minimalLossImpedanceScore: minLoss,
        emergencyIslandCentroids: islandCentroids,
        loadSheddingMaxPriority: dp[0][maxGenerationCapacityMW]
      };
    }
  }

  const gridOptimizer = new EnterpriseGridTopologyOptimizer(6);
  gridOptimizer.registerSubstation(0, "Central-Grid-Hub", 5, 100);
  gridOptimizer.registerSubstation(1, "Metropolitan-North", 10, 80);
  gridOptimizer.registerSubstation(2, "Industrial-Park-East", 15, 90);
  gridOptimizer.registerSubstation(3, "Suburban-West", 8, 60);
  gridOptimizer.registerSubstation(4, "Healthcare-District", 12, 95);
  gridOptimizer.registerSubstation(5, "Port-Logistics", 10, 75);

  gridOptimizer.addTransmissionLine(0, 1, 2);
  gridOptimizer.addTransmissionLine(0, 2, 3);
  gridOptimizer.addTransmissionLine(1, 3, 1);
  gridOptimizer.addTransmissionLine(1, 4, 2);
  gridOptimizer.addTransmissionLine(2, 5, 4);

  const report = gridOptimizer.executeOptimization(40);
  console.log(JSON.stringify(report));
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
