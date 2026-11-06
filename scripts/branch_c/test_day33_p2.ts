interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
}

class MinCutExtractor {
  private adj = new Map<string, ResidualEdge[]>();
  private allNodes = new Set<string>();

  addEdge(u: string, v: string, capacity: number): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.allNodes.add(u);
    this.allNodes.add(v);

    const forward: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0 };
    const backward: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0 };

    this.adj.get(u)!.push(forward);
    this.adj.get(v)!.push(backward);
  }

  computeMaxFlowAndMinCut(source: string, sink: string): {
    maxFlow: number;
    cutPartitionS: string[];
    cutPartitionT: string[];
    minCutEdges: [string, string, number][];
  } {
    // 1. Edmonds-Karp BFS Augmentations
    let totalFlow = 0;
    while (true) {
      const parentNode = new Map<string, string>();
      const parentEdgeIndex = new Map<string, number>();
      const queue: string[] = [source];
      parentNode.set(source, source);

      while (queue.length > 0 && !parentNode.has(sink)) {
        const curr = queue.shift()!;
        for (let i = 0; i < (this.adj.get(curr) || []).length; i++) {
          const e = this.adj.get(curr)![i];
          if (e.capacity - e.flow > 0 && !parentNode.has(e.to)) {
            parentNode.set(e.to, curr);
            parentEdgeIndex.set(e.to, i);
            queue.push(e.to);
          }
        }
      }

      if (!parentNode.has(sink)) break;

      let bottleneck = Infinity;
      let curr = sink;
      while (curr !== source) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![idx];
        bottleneck = Math.min(bottleneck, e.capacity - e.flow);
        curr = p;
      }

      curr = sink;
      while (curr !== source) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![idx];
        e.flow += bottleneck;
        const rev = this.adj.get(e.to)![e.rev];
        rev.flow -= bottleneck;
        curr = p;
      }

      totalFlow += bottleneck;
    }

    // 2. Extract Set S via Reachability in Residual Graph
    const reachableS = new Set<string>();
    const queue: string[] = [source];
    reachableS.add(source);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const e of this.adj.get(curr) || []) {
        if (e.capacity - e.flow > 0 && !reachableS.has(e.to)) {
          reachableS.add(e.to);
          queue.push(e.to);
        }
      }
    }

    const cutPartitionS = Array.from(reachableS).sort();
    const cutPartitionT = Array.from(this.allNodes).filter(n => !reachableS.has(n)).sort();

    // 3. Find Min-Cut Edges (edges from S to T in original graph)
    const minCutEdges: [string, string, number][] = [];
    for (const u of reachableS) {
      for (const e of this.adj.get(u) || []) {
        if (e.capacity > 0 && !reachableS.has(e.to)) {
          minCutEdges.push([u, e.to, e.capacity]);
        }
      }
    }

    return { maxFlow: totalFlow, cutPartitionS, cutPartitionT, minCutEdges };
  }
}

const extractor = new MinCutExtractor();
extractor.addEdge('S', 'A', 10);
extractor.addEdge('S', 'B', 10);
extractor.addEdge('A', 'B', 2);
extractor.addEdge('A', 'T', 4);
extractor.addEdge('B', 'T', 9);

const res = extractor.computeMaxFlowAndMinCut('S', 'T');
console.log('Certified Max Flow:', res.maxFlow);
console.log('Cut Partition S (Reachable):', res.cutPartitionS);
console.log('Cut Partition T (Unreachable):', res.cutPartitionT);
console.log('Minimum Cut Bottleneck Edges:', res.minCutEdges.map(e => `${e[0]} -> ${e[1]} (${e[2]})`));
console.log('Min-Cut Total Capacity:', res.minCutEdges.reduce((sum, e) => sum + e[2], 0));
