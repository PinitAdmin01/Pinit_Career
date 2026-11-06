// scripts/branch_c/test_day43_snippets.ts

// Part 1: Naive O(N^2) Distance Sum Calculation
function part1() {
  const n = 6;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const naiveDistSums: number[] = new Array(n).fill(0);
  for (let root = 0; root < n; root++) {
    function dfs(u: number, parent: number, d: number): number {
      let sum = d;
      for (const v of adj[u]) {
        if (v === parent) continue;
        sum += dfs(v, u, d + 1);
      }
      return sum;
    }
    naiveDistSums[root] = dfs(root, -1, 0);
  }

  console.log(JSON.stringify({
    nodeCount: n,
    naiveDistSums,
    bestRoot: naiveDistSums.indexOf(Math.min(...naiveDistSums)),
    minDist: Math.min(...naiveDistSums)
  }));
}

// Part 2: Two-Pass O(N) Up-Down Rerooting DP
function part2() {
  const n = 6;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const sz = new Array(n).fill(1);
  const dpDown = new Array(n).fill(0);
  const ans = new Array(n).fill(0);

  // Pass 1: Bottom-up pull phase
  function dfsPull(u: number, p: number) {
    for (const v of adj[u]) {
      if (v === p) continue;
      dfsPull(v, u);
      sz[u] += sz[v];
      dpDown[u] += dpDown[v] + sz[v];
    }
  }
  dfsPull(0, -1);

  // Pass 2: Top-down push / rerooting phase
  ans[0] = dpDown[0];
  function dfsPush(u: number, p: number) {
    for (const v of adj[u]) {
      if (v === p) continue;
      // Rerooting transition: ans[v] = ans[u] + (n - sz[v]) - sz[v]
      ans[v] = ans[u] + n - 2 * sz[v];
      dfsPush(v, u);
    }
  }
  dfsPush(0, -1);

  console.log(JSON.stringify({
    rootPullDist: dpDown[0],
    rerootedAns: ans,
    verifiedMatch: JSON.stringify(ans) === JSON.stringify([8, 8, 10, 12, 12, 14])
  }));
}

// Part 3: Non-Invertible Transitions via Prefix/Suffix Maxima
function part3() {
  const n = 5;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [0, 3], [3, 4]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const downHeight = new Array(n).fill(0);
  function dfsDown(u: number, p: number) {
    for (const v of adj[u]) {
      if (v === p) continue;
      dfsDown(v, u);
      downHeight[u] = Math.max(downHeight[u], downHeight[v] + 1);
    }
  }
  dfsDown(0, -1);

  const maxDist = new Array(n).fill(0);
  function dfsRerootMax(u: number, p: number, upH: number) {
    maxDist[u] = Math.max(downHeight[u], upH);

    const children: number[] = [];
    for (const v of adj[u]) {
      if (v !== p) children.push(v);
    }
    const k = children.length;
    if (k === 0) return;

    const pref = new Array(k + 1).fill(-1);
    const suff = new Array(k + 1).fill(-1);

    for (let i = 0; i < k; i++) {
      pref[i + 1] = Math.max(pref[i], downHeight[children[i]] + 1);
    }
    for (let i = k - 1; i >= 0; i--) {
      suff[i] = Math.max(suff[i + 1], downHeight[children[i]] + 1);
    }

    for (let i = 0; i < k; i++) {
      const v = children[i];
      const bestSibling = Math.max(pref[i], suff[i + 1]);
      const nextUp = Math.max(upH + 1, bestSibling + 1);
      dfsRerootMax(v, u, nextUp);
    }
  }
  dfsRerootMax(0, -1, 0);

  console.log(JSON.stringify({
    downHeight,
    allRootsMaxEccentricity: maxDist
  }));
}

// Part 4: All-Roots Variance & Global Optimization
function part4() {
  const n = 6;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const sz = new Array(n).fill(1);
  const dpDown = new Array(n).fill(0);
  const totalDist = new Array(n).fill(0);

  function dfsPull(u: number, p: number) {
    for (const v of adj[u]) {
      if (v === p) continue;
      dfsPull(v, u);
      sz[u] += sz[v];
      dpDown[u] += dpDown[v] + sz[v];
    }
  }
  dfsPull(0, -1);

  totalDist[0] = dpDown[0];
  function dfsPush(u: number, p: number) {
    for (const v of adj[u]) {
      if (v === p) continue;
      totalDist[v] = totalDist[u] + n - 2 * sz[v];
      dfsPush(v, u);
    }
  }
  dfsPush(0, -1);

  const avgDistances = totalDist.map(sum => +(sum / (n - 1)).toFixed(2));
  const minSum = Math.min(...totalDist);
  const optimalNodes = totalDist
    .map((sum, idx) => ({ idx, sum }))
    .filter(item => item.sum === minSum)
    .map(item => item.idx);

  console.log(JSON.stringify({
    totalDist,
    avgDistances,
    optimalNodes,
    minSum
  }));
}

// Part 5: Enterprise Application: ConsensusLeaderOptimizer
function part5() {
  interface NodeCandidate {
    nodeId: number;
    clusterBroadcastLatencyHops: number;
    maxQuorumCommitLatencyHops: number;
    averagePeerLatencyHops: number;
    isPrimaryLeaderCandidate: boolean;
  }

  interface ConsensusClusterReport {
    totalNodes: number;
    recommendedLeaderId: number;
    minimalBroadcastHops: number;
    candidates: NodeCandidate[];
  }

  class ConsensusLeaderOptimizer {
    private n: number;
    private adj: number[][];

    constructor(clusterSize: number) {
      this.n = clusterSize;
      this.adj = Array.from({ length: clusterSize }, () => []);
    }

    public addNetworkLink(u: number, v: number): void {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }

    public evaluateCluster(): ConsensusClusterReport {
      // 1. Two-pass DP for total broadcast latency sums
      const sz = new Array(this.n).fill(1);
      const dpDown = new Array(this.n).fill(0);
      const totalDist = new Array(this.n).fill(0);

      const dfsPull = (u: number, p: number) => {
        for (const v of this.adj[u]) {
          if (v === p) continue;
          dfsPull(v, u);
          sz[u] += sz[v];
          dpDown[u] += dpDown[v] + sz[v];
        }
      };
      dfsPull(0, -1);

      totalDist[0] = dpDown[0];
      const dfsPush = (u: number, p: number) => {
        for (const v of this.adj[u]) {
          if (v === p) continue;
          totalDist[v] = totalDist[u] + this.n - 2 * sz[v];
          dfsPush(v, u);
        }
      };
      dfsPush(0, -1);

      // 2. Prefix/Suffix Rerooting for maximum eccentricity (worst-case quorum latency)
      const downH = new Array(this.n).fill(0);
      const dfsDownH = (u: number, p: number) => {
        for (const v of this.adj[u]) {
          if (v === p) continue;
          dfsDownH(v, u);
          downH[u] = Math.max(downH[u], downH[v] + 1);
        }
      };
      dfsDownH(0, -1);

      const maxDist = new Array(this.n).fill(0);
      const dfsRerootMax = (u: number, p: number, upH: number) => {
        maxDist[u] = Math.max(downH[u], upH);
        const children = this.adj[u].filter(v => v !== p);
        const k = children.length;
        if (k === 0) return;

        const pref = new Array(k + 1).fill(-1);
        const suff = new Array(k + 1).fill(-1);
        for (let i = 0; i < k; i++) pref[i + 1] = Math.max(pref[i], downH[children[i]] + 1);
        for (let i = k - 1; i >= 0; i--) suff[i] = Math.max(suff[i + 1], downH[children[i]] + 1);

        for (let i = 0; i < k; i++) {
          const v = children[i];
          const bestSibling = Math.max(pref[i], suff[i + 1]);
          dfsRerootMax(v, u, Math.max(upH + 1, bestSibling + 1));
        }
      };
      dfsRerootMax(0, -1, 0);

      // 3. Selection
      const minTotal = Math.min(...totalDist);
      let bestLeader = 0;
      let minMaxLat = Infinity;
      for (let i = 0; i < this.n; i++) {
        if (totalDist[i] === minTotal) {
          if (maxDist[i] < minMaxLat) {
            minMaxLat = maxDist[i];
            bestLeader = i;
          }
        }
      }

      const candidates: NodeCandidate[] = [];
      for (let i = 0; i < this.n; i++) {
        candidates.push({
          nodeId: i,
          clusterBroadcastLatencyHops: totalDist[i],
          maxQuorumCommitLatencyHops: maxDist[i],
          averagePeerLatencyHops: +(totalDist[i] / (this.n - 1)).toFixed(2),
          isPrimaryLeaderCandidate: i === bestLeader
        });
      }

      return {
        totalNodes: this.n,
        recommendedLeaderId: bestLeader,
        minimalBroadcastHops: minTotal,
        candidates
      };
    }
  }

  const optimizer = new ConsensusLeaderOptimizer(7);
  optimizer.addNetworkLink(0, 1);
  optimizer.addNetworkLink(0, 2);
  optimizer.addNetworkLink(1, 3);
  optimizer.addNetworkLink(1, 4);
  optimizer.addNetworkLink(4, 5);
  optimizer.addNetworkLink(4, 6);

  const report = optimizer.evaluateCluster();
  console.log(JSON.stringify({
    totalNodes: report.totalNodes,
    recommendedLeaderId: report.recommendedLeaderId,
    minimalBroadcastHops: report.minimalBroadcastHops,
    leaderCandidateStats: report.candidates.find(c => c.isPrimaryLeaderCandidate)
  }));
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
