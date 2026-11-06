// scripts/branch_c/test_day44_snippets.ts

// Part 1: Subtree Size-Bounded Tree Knapsack
function part1() {
  const n = 6;
  const k = 3;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const values = [10, 20, 15, 30, 25, 18];
  const sz = new Array(n).fill(1);
  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(-Infinity));

  function dfs(u: number, p: number) {
    dp[u][1] = values[u];
    sz[u] = 1;

    for (const v of adj[u]) {
      if (v === p) continue;
      dfs(v, u);

      const nextDP = new Array(k + 1).fill(-Infinity);
      const limitU = Math.min(k, sz[u]);
      const limitV = Math.min(k, sz[v]);

      for (let i = 1; i <= limitU; i++) {
        for (let j = 0; j <= limitV && i + j <= k; j++) {
          const val = j === 0 ? dp[u][i] : dp[u][i] + dp[v][j];
          nextDP[i + j] = Math.max(nextDP[i + j], val);
        }
      }
      for (let w = 1; w <= k; w++) {
        dp[u][w] = Math.max(dp[u][w], nextDP[w]);
      }
      sz[u] += sz[v];
    }
  }
  dfs(0, -1);

  const bestVal = Math.max(...dp[0].filter(v => isFinite(v)));
  console.log(JSON.stringify({
    nodeCount: n,
    maxBudgetK: k,
    rootDP: dp[0],
    optimalValue: bestVal
  }));
}

// Part 2: Cartesian Pairwise Sizing Lemma Verification
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

  const sz = new Array(n).fill(1);
  let totalInnerIterations = 0;

  function dfsCount(u: number, p: number) {
    sz[u] = 1;
    for (const v of adj[u]) {
      if (v === p) continue;
      dfsCount(v, u);
      // Inner loop executes sz[u] * sz[v] times
      totalInnerIterations += sz[u] * sz[v];
      sz[u] += sz[v];
    }
  }
  dfsCount(0, -1);

  const theoreticalMax = (n * (n - 1)) / 2;
  console.log(JSON.stringify({
    nodeCount: n,
    totalInnerIterations,
    theoreticalMax,
    strictlyWithinBound: totalInnerIterations <= theoreticalMax
  }));
}

// Part 3: In-Place 1D Vector Convolution for Tree Merging
function part3() {
  const n = 5;
  const k = 3;
  const values = [5, 8, 12, 14, 7];
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const sz = new Array(n).fill(1);
  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(-1));

  function dfsMerge(u: number, p: number) {
    dp[u][1] = values[u];
    dp[u][0] = 0;
    sz[u] = 1;

    for (const v of adj[u]) {
      if (v === p) continue;
      dfsMerge(v, u);

      const maxU = Math.min(k, sz[u]);
      const maxV = Math.min(k, sz[v]);

      // Reverse iteration to merge in-place safely
      for (let i = maxU; i >= 1; i--) {
        for (let j = 1; j <= maxV && i + j <= k; j++) {
          if (dp[u][i] !== -1 && dp[v][j] !== -1) {
            dp[u][i + j] = Math.max(dp[u][i + j], dp[u][i] + dp[v][j]);
          }
        }
      }
      sz[u] += sz[v];
    }
  }
  dfsMerge(0, -1);

  console.log(JSON.stringify({
    rootDPTable: dp[0],
    budget3Max: dp[0][3]
  }));
}

// Part 4: Euler Tour Flattening to Linear Skip Knapsack
function part4() {
  const n = 6;
  const k = 3;
  const values = [10, 20, 15, 30, 25, 18];
  const costs = [1, 1, 1, 1, 1, 1];
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const eulerOrder: number[] = [];
  const subSize = new Array(n).fill(0);

  function dfsEuler(u: number, p: number) {
    eulerOrder.push(u);
    let s = 1;
    for (const v of adj[u]) {
      if (v === p) continue;
      dfsEuler(v, u);
      s += subSize[v];
    }
    subSize[u] = s;
  }
  dfsEuler(0, -1);

  // Linear DP table: dp[i][w] = max value considering items from index i to n with weight capacity w
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    const node = eulerOrder[i];
    const c = costs[node];
    const v = values[node];
    const skipIndex = i + subSize[node];

    for (let w = 0; w <= k; w++) {
      // Option A: Skip this node and its entire subtree
      const skipVal = skipIndex <= n ? dp[skipIndex][w] : 0;
      let takeVal = 0;
      // Option B: Take this node and advance to immediate next in euler tour
      if (w >= c) {
        takeVal = v + dp[i + 1][w - c];
      }
      dp[i][w] = Math.max(skipVal, takeVal);
    }
  }

  console.log(JSON.stringify({
    eulerOrder,
    optimalBudgetK: dp[0][k],
    matchesPart1: dp[0][k] === 60
  }));
}

// Part 5: Enterprise Application: CloudTreeResourceAllocator
function part5() {
  interface ServiceNode {
    id: number;
    name: string;
    cpuCoresRequired: number;
    businessSlaValue: number;
  }

  interface AllocationPlan {
    totalBudgetCPU: number;
    allocatedCPU: number;
    totalSlaScore: number;
    selectedServiceIds: number[];
  }

  class CloudTreeResourceAllocator {
    private n: number;
    private services: ServiceNode[];
    private adj: number[][];

    constructor(serviceCount: number) {
      this.n = serviceCount;
      this.services = [];
      this.adj = Array.from({ length: serviceCount }, () => []);
    }

    public registerService(id: number, name: string, cpuCores: number, slaValue: number): void {
      this.services[id] = { id, name, cpuCoresRequired: cpuCores, businessSlaValue: slaValue };
    }

    public addDependency(parentId: number, childId: number): void {
      this.adj[parentId].push(childId);
    }

    public optimizeAllocation(maxCpuBudget: number): AllocationPlan {
      // 1. Euler Tour Flattening
      const euler: number[] = [];
      const subSize = new Array(this.n).fill(0);

      const dfs = (u: number) => {
        euler.push(u);
        let count = 1;
        for (const v of this.adj[u]) {
          dfs(v);
          count += subSize[v];
        }
        subSize[u] = count;
      };
      dfs(0);

      // 2. Linear DAG Knapsack
      const dp: number[][] = Array.from({ length: this.n + 1 }, () => new Array(maxCpuBudget + 1).fill(0));
      const choice: boolean[][] = Array.from({ length: this.n + 1 }, () => new Array(maxCpuBudget + 1).fill(false));

      for (let i = this.n - 1; i >= 0; i--) {
        const u = euler[i];
        const cost = this.services[u].cpuCoresRequired;
        const val = this.services[u].businessSlaValue;
        const skipIdx = i + subSize[u];

        for (let w = 0; w <= maxCpuBudget; w++) {
          const skipVal = skipIdx <= this.n ? dp[skipIdx][w] : 0;
          let takeVal = -1;
          if (w >= cost) {
            takeVal = val + dp[i + 1][w - cost];
          }

          if (takeVal > skipVal) {
            dp[i][w] = takeVal;
            choice[i][w] = true;
          } else {
            dp[i][w] = skipVal;
            choice[i][w] = false;
          }
        }
      }

      // 3. Reconstruct selection
      const selected: number[] = [];
      let currIdx = 0;
      let currBudget = maxCpuBudget;
      while (currIdx < this.n && currBudget > 0) {
        if (choice[currIdx][currBudget]) {
          const u = euler[currIdx];
          selected.push(u);
          currBudget -= this.services[u].cpuCoresRequired;
          currIdx++;
        } else {
          currIdx += subSize[euler[currIdx]];
        }
      }

      const allocatedCpu = selected.reduce((sum, id) => sum + this.services[id].cpuCoresRequired, 0);

      return {
        totalBudgetCPU: maxCpuBudget,
        allocatedCPU: allocatedCpu,
        totalSlaScore: dp[0][maxCpuBudget],
        selectedServiceIds: selected
      };
    }
  }

  const allocator = new CloudTreeResourceAllocator(6);
  allocator.registerService(0, "Gateway-Proxy", 2, 50);
  allocator.registerService(1, "Auth-Domain", 2, 40);
  allocator.registerService(2, "Billing-Domain", 3, 45);
  allocator.registerService(3, "OAuth-Subservice", 1, 30);
  allocator.registerService(4, "MFA-Subservice", 2, 25);
  allocator.registerService(5, "Ledger-Subservice", 2, 35);

  allocator.addDependency(0, 1);
  allocator.addDependency(0, 2);
  allocator.addDependency(1, 3);
  allocator.addDependency(1, 4);
  allocator.addDependency(2, 5);

  const plan = allocator.optimizeAllocation(6);
  console.log(JSON.stringify(plan));
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
