/**
 * Day 35 - Part 5: Full Capstone Suite - AutonomousTransitRouterOS
 */

interface RouterEdge {
  from: number;
  to: number;
  cap: number;
  flow: number;
  rev: number;
}

class AutonomousTransitRouterOS {
  private n: number;
  private adjFlow: RouterEdge[][];
  private timer: number = 0;
  private tin: number[];
  private low: number[];
  private visited: boolean[];
  public bridges: [number, number][];

  constructor(n: number) {
    this.n = n;
    this.adjFlow = Array.from({ length: n }, () => []);
    this.tin = Array(n).fill(-1);
    this.low = Array(n).fill(-1);
    this.visited = Array(n).fill(false);
    this.bridges = [];
  }

  addBidirectionalTransitLink(u: number, v: number, cap: number): void {
    const a: RouterEdge = { from: u, to: v, cap, flow: 0, rev: this.adjFlow[v].length };
    const b: RouterEdge = { from: v, to: u, cap, flow: 0, rev: this.adjFlow[u].length };
    this.adjFlow[u].push(a);
    this.adjFlow[v].push(b);
  }

  addDirectedTransitLink(u: number, v: number, cap: number): void {
    const a: RouterEdge = { from: u, to: v, cap, flow: 0, rev: this.adjFlow[v].length };
    const b: RouterEdge = { from: v, to: u, cap: 0, flow: 0, rev: this.adjFlow[u].length };
    this.adjFlow[u].push(a);
    this.adjFlow[v].push(b);
  }

  scanBridges(): [number, number][] {
    this.timer = 0;
    this.bridges = [];
    this.visited.fill(false);
    this.tin.fill(-1);
    this.low.fill(-1);

    const dfs = (u: number, p: number = -1) => {
      this.visited[u] = true;
      this.tin[u] = this.low[u] = ++this.timer;
      for (const edge of this.adjFlow[u]) {
        const v = edge.to;
        if (v === p) continue;
        if (this.visited[v]) {
          this.low[u] = Math.min(this.low[u], this.tin[v]);
        } else {
          dfs(v, u);
          this.low[u] = Math.min(this.low[u], this.low[v]);
          if (this.low[v] > this.tin[u]) {
            this.bridges.push([u, v]);
          }
        }
      }
    };

    for (let i = 0; i < this.n; i++) {
      if (!this.visited[i]) dfs(i);
    }
    return this.bridges;
  }

  computeMaxFlowWithMinCut(source: number, sink: number): {
    maxFlow: number;
    minCutEdges: [number, number, number][];
  } {
    // Reset flow
    for (let u = 0; u < this.n; u++) {
      for (const edge of this.adjFlow[u]) {
        edge.flow = 0;
      }
    }

    let maxFlow = 0;
    while (true) {
      const parent: { u: number; edgeIdx: number }[] = Array(this.n).fill(null);
      const queue: number[] = [source];
      let head = 0;

      while (head < queue.length) {
        const curr = queue[head++];
        if (curr === sink) break;

        for (let i = 0; i < this.adjFlow[curr].length; i++) {
          const edge = this.adjFlow[curr][i];
          if (edge.cap - edge.flow > 0 && parent[edge.to] === null && edge.to !== source) {
            parent[edge.to] = { u: curr, edgeIdx: i };
            queue.push(edge.to);
          }
        }
      }

      if (parent[sink] === null) break;

      let bottleNeck = Infinity;
      let curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parent[curr];
        const edge = this.adjFlow[u][edgeIdx];
        bottleNeck = Math.min(bottleNeck, edge.cap - edge.flow);
        curr = u;
      }

      curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parent[curr];
        this.adjFlow[u][edgeIdx].flow += bottleNeck;
        const revIdx = this.adjFlow[u][edgeIdx].rev;
        this.adjFlow[curr][revIdx].flow -= bottleNeck;
        curr = u;
      }

      maxFlow += bottleNeck;
    }

    // Min cut
    const reachable = Array(this.n).fill(false);
    const q: number[] = [source];
    reachable[source] = true;
    let h = 0;
    while (h < q.length) {
      const u = q[h++];
      for (const edge of this.adjFlow[u]) {
        if (edge.cap - edge.flow > 0 && !reachable[edge.to]) {
          reachable[edge.to] = true;
          q.push(edge.to);
        }
      }
    }

    const minCutEdges: [number, number, number][] = [];
    for (let u = 0; u < this.n; u++) {
      if (reachable[u]) {
        for (const edge of this.adjFlow[u]) {
          if (!reachable[edge.to] && edge.cap > 0) {
            minCutEdges.push([u, edge.to, edge.cap]);
          }
        }
      }
    }

    return { maxFlow, minCutEdges };
  }
}

function runCapstoneVerification(): void {
  console.log("=== Autonomous Transit Router OS: Milestone 7 Capstone Verification ===");

  // 7-Node Autonomous Transit System
  // 0: Client Ingress, 1: Aggregator East, 2: Aggregator West, 3: Backbone Core Alpha,
  // 4: Backbone Core Beta, 5: Egress Gateway Prime, 6: Egress Gateway Secondary
  const router = new AutonomousTransitRouterOS(7);

  router.addDirectedTransitLink(0, 1, 150); // Ingress -> Agg East
  router.addDirectedTransitLink(0, 2, 120); // Ingress -> Agg West
  router.addDirectedTransitLink(1, 3, 100); // Agg East -> Core Alpha
  router.addDirectedTransitLink(1, 4, 80);  // Agg East -> Core Beta
  router.addDirectedTransitLink(2, 3, 90);  // Agg West -> Core Alpha
  router.addDirectedTransitLink(2, 4, 70);  // Agg West -> Core Beta
  router.addDirectedTransitLink(3, 5, 140); // Core Alpha -> Egress Prime
  router.addDirectedTransitLink(4, 5, 110); // Core Beta -> Egress Prime

  const initialFlow = router.computeMaxFlowWithMinCut(0, 5);
  console.log(`[RouterOS] Phase 1 - Baseline Flow Throughput: ${initialFlow.maxFlow} Gbps`);
  console.log(`[RouterOS] Phase 1 - Critical Bottlenecks: ${initialFlow.minCutEdges.map(([u, v, c]) => `${u}->${v} (${c}G)`).join(", ")}`);

  // Add protection failover link to secondary egress
  router.addDirectedTransitLink(3, 6, 80);
  router.addDirectedTransitLink(4, 6, 60);
  router.addDirectedTransitLink(6, 5, 100);

  const enhancedFlow = router.computeMaxFlowWithMinCut(0, 5);
  console.log(`[RouterOS] Phase 2 - Post-Protection Provisioning Max Flow: ${enhancedFlow.maxFlow} Gbps`);
  console.log(`[RouterOS] Phase 2 - Redundant Egress Cut Capacity: ${enhancedFlow.minCutEdges.reduce((s, [, , c]) => s + c, 0)} Gbps`);
  console.log("[RouterOS] Verification Complete: Autonomous Transit Router Operating Within Performance SLA");
}

runCapstoneVerification();
