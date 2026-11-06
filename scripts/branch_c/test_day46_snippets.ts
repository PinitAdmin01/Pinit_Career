// scripts/branch_c/test_day46_snippets.ts

// Part 1: Flow Network Representation & Residual Graph Mechanics
function part1() {
  interface Edge {
    to: number;
    cap: number;
    flow: number;
    rev: number;
  }

  const n = 4;
  const graph: Edge[][] = Array.from({ length: n }, () => []);

  function addEdge(u: number, v: number, cap: number) {
    const forwardIdx = graph[u].length;
    const revIdx = graph[v].length;
    graph[u].push({ to: v, cap, flow: 0, rev: revIdx });
    graph[v].push({ to: u, cap: 0, flow: 0, rev: forwardIdx });
  }

  addEdge(0, 1, 10);
  addEdge(0, 2, 5);
  addEdge(1, 2, 15);
  addEdge(1, 3, 10);
  addEdge(2, 3, 10);

  // Manually push 5 units along path 0 -> 1 -> 3
  graph[0][0].flow += 5;
  graph[1][graph[0][0].rev].flow -= 5;
  graph[1][1].flow += 5;
  graph[3][graph[1][1].rev].flow -= 5;

  const residual_0_1 = graph[0][0].cap - graph[0][0].flow;
  const residual_1_0_backward = graph[1][graph[0][0].rev].flow * -1; // back edge capacity is flow

  console.log(JSON.stringify({
    forwardResidualCapacity: residual_0_1,
    backwardResidualCapacity: residual_1_0_backward,
    flowConservationNode1: graph[0][0].flow === graph[1][1].flow
  }));
}

// Part 2: Edmonds-Karp Algorithm (O(V E^2))
function part2() {
  interface Edge {
    to: number;
    cap: number;
    flow: number;
    rev: number;
  }

  const n = 6;
  const s = 0;
  const t = 5;
  const graph: Edge[][] = Array.from({ length: n }, () => []);

  function addEdge(u: number, v: number, cap: number) {
    const a = graph[u].length;
    const b = graph[v].length;
    graph[u].push({ to: v, cap, flow: 0, rev: b });
    graph[v].push({ to: u, cap: 0, flow: 0, rev: a });
  }

  addEdge(0, 1, 16);
  addEdge(0, 2, 13);
  addEdge(1, 2, 10);
  addEdge(1, 3, 12);
  addEdge(2, 1, 4);
  addEdge(2, 4, 14);
  addEdge(3, 2, 9);
  addEdge(3, 5, 20);
  addEdge(4, 3, 7);
  addEdge(4, 5, 4);

  let maxFlow = 0;

  while (true) {
    const parentEdge: Array<{ u: number; edgeIdx: number } | null> = new Array(n).fill(null);
    const visited = new Array(n).fill(false);
    const queue = [s];
    visited[s] = true;

    while (queue.length > 0 && !visited[t]) {
      const u = queue.shift()!;
      for (let i = 0; i < graph[u].length; i++) {
        const edge = graph[u][i];
        const res = edge.cap - edge.flow;
        if (!visited[edge.to] && res > 0) {
          visited[edge.to] = true;
          parentEdge[edge.to] = { u, edgeIdx: i };
          queue.push(edge.to);
        }
      }
    }

    if (!visited[t]) break;

    // Find bottleneck
    let push = Infinity;
    let curr = t;
    while (curr !== s) {
      const p = parentEdge[curr]!;
      const edge = graph[p.u][p.edgeIdx];
      push = Math.min(push, edge.cap - edge.flow);
      curr = p.u;
    }

    // Augment flow
    curr = t;
    while (curr !== s) {
      const p = parentEdge[curr]!;
      const edge = graph[p.u][p.edgeIdx];
      edge.flow += push;
      graph[edge.to][edge.rev].flow -= push;
      curr = p.u;
    }

    maxFlow += push;
  }

  console.log(JSON.stringify({
    source: s,
    sink: t,
    maxFlow,
    optimal: maxFlow === 23
  }));
}

// Part 3: Capacity Scaling Algorithm (O(E^2 log U))
function part3() {
  interface Edge {
    to: number;
    cap: number;
    flow: number;
    rev: number;
  }

  const n = 6;
  const s = 0;
  const t = 5;
  const graph: Edge[][] = Array.from({ length: n }, () => []);

  function addEdge(u: number, v: number, cap: number) {
    const a = graph[u].length;
    const b = graph[v].length;
    graph[u].push({ to: v, cap, flow: 0, rev: b });
    graph[v].push({ to: u, cap: 0, flow: 0, rev: a });
  }

  addEdge(0, 1, 1000);
  addEdge(0, 2, 1000);
  addEdge(1, 2, 1);
  addEdge(1, 3, 1000);
  addEdge(2, 4, 1000);
  addEdge(3, 5, 1000);
  addEdge(4, 5, 1000);

  let delta = 1024; // Power of 2 >= max capacity 1000
  let maxFlow = 0;

  function dfsScale(u: number, minCap: number, visited: boolean[]): number {
    if (u === t) return minCap;
    visited[u] = true;
    for (const edge of graph[u]) {
      const res = edge.cap - edge.flow;
      if (!visited[edge.to] && res >= delta) {
        const pushed = dfsScale(edge.to, Math.min(minCap, res), visited);
        if (pushed > 0) {
          edge.flow += pushed;
          graph[edge.to][edge.rev].flow -= pushed;
          return pushed;
        }
      }
    }
    return 0;
  }

  while (delta >= 1) {
    while (true) {
      const visited = new Array(n).fill(false);
      const pushed = dfsScale(s, Infinity, visited);
      if (pushed === 0) break;
      maxFlow += pushed;
    }
    delta = Math.floor(delta / 2);
  }

  console.log(JSON.stringify({
    capacityScalingMaxFlow: maxFlow,
    isCorrect: maxFlow === 2000
  }));
}

// Part 4: Residual Graph Min-Cut Discovery
function part4() {
  interface Edge {
    u: number;
    v: number;
    cap: number;
  }

  const n = 4;
  const s = 0;
  const t = 3;
  const edges: Edge[] = [
    { u: 0, v: 1, cap: 3 },
    { u: 0, v: 2, cap: 2 },
    { u: 1, v: 2, cap: 1 },
    { u: 1, v: 3, cap: 2 },
    { u: 2, v: 3, cap: 3 }
  ];

  // Adjacency for max flow
  const graph: Array<Array<{ to: number; cap: number; flow: number; rev: number }>> = Array.from({ length: n }, () => []);
  for (const e of edges) {
    const a = graph[e.u].length;
    const b = graph[e.v].length;
    graph[e.u].push({ to: e.v, cap: e.cap, flow: 0, rev: b });
    graph[e.v].push({ to: e.u, cap: 0, flow: 0, rev: a });
  }

  // Run Edmonds-Karp
  while (true) {
    const parent: Array<{ u: number; edgeIdx: number } | null> = new Array(n).fill(null);
    const visited = new Array(n).fill(false);
    const q = [s];
    visited[s] = true;
    while (q.length > 0 && !visited[t]) {
      const u = q.shift()!;
      for (let i = 0; i < graph[u].length; i++) {
        const edge = graph[u][i];
        if (!visited[edge.to] && edge.cap - edge.flow > 0) {
          visited[edge.to] = true;
          parent[edge.to] = { u, edgeIdx: i };
          q.push(edge.to);
        }
      }
    }
    if (!visited[t]) break;
    let push = Infinity;
    let curr = t;
    while (curr !== s) {
      const p = parent[curr]!;
      push = Math.min(push, graph[p.u][p.edgeIdx].cap - graph[p.u][p.edgeIdx].flow);
      curr = p.u;
    }
    curr = t;
    while (curr !== s) {
      const p = parent[curr]!;
      graph[p.u][p.edgeIdx].flow += push;
      graph[curr][graph[p.u][p.edgeIdx].rev].flow -= push;
      curr = p.u;
    }
  }

  // Find min-cut by BFS reachable from s in residual graph
  const reachable = new Array(n).fill(false);
  const qCut = [s];
  reachable[s] = true;
  while (qCut.length > 0) {
    const u = qCut.shift()!;
    for (const edge of graph[u]) {
      if (!reachable[edge.to] && edge.cap - edge.flow > 0) {
        reachable[edge.to] = true;
        qCut.push(edge.to);
      }
    }
  }

  const setS: number[] = [];
  const setT: number[] = [];
  for (let i = 0; i < n; i++) {
    if (reachable[i]) setS.push(i);
    else setT.push(i);
  }

  // Min-cut capacity: sum of original capacities from S to T
  let minCutCap = 0;
  const cutEdges: Array<{ from: number; to: number; cap: number }> = [];
  for (const e of edges) {
    if (reachable[e.u] && !reachable[e.v]) {
      minCutCap += e.cap;
      cutEdges.push({ from: e.u, to: e.v, cap: e.cap });
    }
  }

  console.log(JSON.stringify({
    reachableSetS: setS,
    unreachableSetT: setT,
    minCutCapacity: minCutCap,
    cutEdgesCount: cutEdges.length
  }));
}

// Part 5: Enterprise Application: MunicipalFlowDispatcher
function part5() {
  interface PipelineTelemetry {
    sourceReservoirId: number;
    sinkZoneId: number;
    maxThroughputMegalitersDay: number;
    bottleneckCutCapacity: number;
    bottleneckPipelines: Array<{ from: number; to: number; capacity: number }>;
  }

  class MunicipalFlowDispatcher {
    private n: number;
    private graph: Array<Array<{ to: number; cap: number; flow: number; rev: number }>>;
    private edgesList: Array<{ u: number; v: number; cap: number }>;

    constructor(junctionCount: number) {
      this.n = junctionCount;
      this.graph = Array.from({ length: junctionCount }, () => []);
      this.edgesList = [];
    }

    public addAqueductPipeline(u: number, v: number, capacityMld: number): void {
      const a = this.graph[u].length;
      const b = this.graph[v].length;
      this.graph[u].push({ to: v, cap: capacityMld, flow: 0, rev: b });
      this.graph[v].push({ to: u, cap: 0, flow: 0, rev: a });
      this.edgesList.push({ u, v, cap: capacityMld });
    }

    public dispatchFlow(source: number, sink: number): PipelineTelemetry {
      let totalFlow = 0;

      while (true) {
        const parent: Array<{ u: number; edgeIdx: number } | null> = new Array(this.n).fill(null);
        const visited = new Array(this.n).fill(false);
        const q = [source];
        visited[source] = true;

        while (q.length > 0 && !visited[sink]) {
          const u = q.shift()!;
          for (let i = 0; i < this.graph[u].length; i++) {
            const edge = this.graph[u][i];
            if (!visited[edge.to] && edge.cap - edge.flow > 0) {
              visited[edge.to] = true;
              parent[edge.to] = { u, edgeIdx: i };
              q.push(edge.to);
            }
          }
        }

        if (!visited[sink]) break;

        let push = Infinity;
        let curr = sink;
        while (curr !== source) {
          const p = parent[curr]!;
          push = Math.min(push, this.graph[p.u][p.edgeIdx].cap - this.graph[p.u][p.edgeIdx].flow);
          curr = p.u;
        }

        curr = sink;
        while (curr !== source) {
          const p = parent[curr]!;
          this.graph[p.u][p.edgeIdx].flow += push;
          this.graph[curr][this.graph[p.u][p.edgeIdx].rev].flow -= push;
          curr = p.u;
        }

        totalFlow += push;
      }

      // Min-cut discovery
      const reachable = new Array(this.n).fill(false);
      const qCut = [source];
      reachable[source] = true;
      while (qCut.length > 0) {
        const u = qCut.shift()!;
        for (const edge of this.graph[u]) {
          if (!reachable[edge.to] && edge.cap - edge.flow > 0) {
            reachable[edge.to] = true;
            qCut.push(edge.to);
          }
        }
      }

      let cutCap = 0;
      const bottlenecks: Array<{ from: number; to: number; capacity: number }> = [];
      for (const e of this.edgesList) {
        if (reachable[e.u] && !reachable[e.v]) {
          cutCap += e.cap;
          bottlenecks.push({ from: e.u, to: e.v, capacity: e.cap });
        }
      }

      return {
        sourceReservoirId: source,
        sinkZoneId: sink,
        maxThroughputMegalitersDay: totalFlow,
        bottleneckCutCapacity: cutCap,
        bottleneckPipelines: bottlenecks
      };
    }
  }

  const dispatcher = new MunicipalFlowDispatcher(6);
  // Source 0 (Mountain Reservoir) to Sink 5 (Industrial Port)
  dispatcher.addAqueductPipeline(0, 1, 40);
  dispatcher.addAqueductPipeline(0, 2, 30);
  dispatcher.addAqueductPipeline(1, 2, 10);
  dispatcher.addAqueductPipeline(1, 3, 25);
  dispatcher.addAqueductPipeline(2, 4, 20);
  dispatcher.addAqueductPipeline(3, 4, 15);
  dispatcher.addAqueductPipeline(3, 5, 30);
  dispatcher.addAqueductPipeline(4, 5, 35);

  const telemetry = dispatcher.dispatchFlow(0, 5);
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
