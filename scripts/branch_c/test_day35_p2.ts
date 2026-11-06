/**
 * Day 35 - Part 2: High-Throughput Residual Flow Augmentation & Min-Cut Partitioning
 */

interface FlowEdge {
  to: number;
  rev: number;
  cap: number;
  flow: number;
}

class TransitFlowPipeline {
  private n: number;
  private adj: FlowEdge[][];

  constructor(n: number) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
  }

  addEdge(u: number, v: number, cap: number): void {
    const a: FlowEdge = { to: v, rev: this.adj[v].length, cap, flow: 0 };
    const b: FlowEdge = { to: u, rev: this.adj[u].length, cap: 0, flow: 0 };
    this.adj[u].push(a);
    this.adj[v].push(b);
  }

  computeMaxFlow(source: number, sink: number): { maxFlow: number; minCutEdges: [number, number, number][] } {
    let maxFlow = 0;

    while (true) {
      const parentEdge: { u: number; edgeIdx: number }[] = Array(this.n).fill(null);
      const queue: number[] = [source];
      let head = 0;

      while (head < queue.length) {
        const curr = queue[head++];
        if (curr === sink) break;

        for (let i = 0; i < this.adj[curr].length; i++) {
          const edge = this.adj[curr][i];
          const residual = edge.cap - edge.flow;
          if (residual > 0 && parentEdge[edge.to] === null && edge.to !== source) {
            parentEdge[edge.to] = { u: curr, edgeIdx: i };
            queue.push(edge.to);
          }
        }
      }

      if (parentEdge[sink] === null) break;

      let bottleNeck = Infinity;
      let curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parentEdge[curr];
        const edge = this.adj[u][edgeIdx];
        bottleNeck = Math.min(bottleNeck, edge.cap - edge.flow);
        curr = u;
      }

      curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parentEdge[curr];
        this.adj[u][edgeIdx].flow += bottleNeck;
        const revIdx = this.adj[u][edgeIdx].rev;
        this.adj[curr][revIdx].flow -= bottleNeck;
        curr = u;
      }

      maxFlow += bottleNeck;
    }

    // Min-cut discovery via BFS from source in residual graph
    const reachable = Array(this.n).fill(false);
    const q: number[] = [source];
    reachable[source] = true;
    let h = 0;
    while (h < q.length) {
      const u = q[h++];
      for (const edge of this.adj[u]) {
        if (edge.cap - edge.flow > 0 && !reachable[edge.to]) {
          reachable[edge.to] = true;
          q.push(edge.to);
        }
      }
    }

    const minCutEdges: [number, number, number][] = [];
    for (let u = 0; u < this.n; u++) {
      if (reachable[u]) {
        for (const edge of this.adj[u]) {
          if (!reachable[edge.to] && edge.cap > 0) {
            minCutEdges.push([u, edge.to, edge.cap]);
          }
        }
      }
    }

    return { maxFlow, minCutEdges };
  }
}

function main(): void {
  // 6 nodes: 0: Ingress-GW, 1: Agg-East, 2: Agg-West, 3: Core-1, 4: Core-2, 5: Egress-GW
  const flowNet = new TransitFlowPipeline(6);
  flowNet.addEdge(0, 1, 120);
  flowNet.addEdge(0, 2, 80);
  flowNet.addEdge(1, 3, 100);
  flowNet.addEdge(1, 4, 50);
  flowNet.addEdge(2, 3, 30);
  flowNet.addEdge(2, 4, 70);
  flowNet.addEdge(3, 5, 110);
  flowNet.addEdge(4, 5, 80);

  const { maxFlow, minCutEdges } = flowNet.computeMaxFlow(0, 5);
  console.log(`[TransitFlow] Max Flow Throughput: ${maxFlow} Gbps`);
  console.log(`[TransitFlow] S-T Min-Cut Bottleneck Links: ${minCutEdges.map(([u, v, c]) => `${u}->${v} (cap: ${c})`).join(", ")}`);
  const cutCapacity = minCutEdges.reduce((sum, [, , c]) => sum + c, 0);
  console.log(`[TransitFlow] Min-Cut Capacity: ${cutCapacity} Gbps (Theorem holds: ${maxFlow === cutCapacity})`);
}

main();
