interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
}

class EdmondsKarpMaxFlow {
  private adj = new Map<string, ResidualEdge[]>();

  addEdge(u: string, v: string, capacity: number): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);

    const forward: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0 };
    const backward: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0 };

    this.adj.get(u)!.push(forward);
    this.adj.get(v)!.push(backward);
  }

  computeMaxFlow(source: string, sink: string): { maxFlow: number; augmentations: number } {
    let totalFlow = 0;
    let augmentations = 0;

    while (true) {
      const parentNode = new Map<string, string>();
      const parentEdgeIndex = new Map<string, number>();
      const queue: string[] = [source];
      parentNode.set(source, source);

      while (queue.length > 0 && !parentNode.has(sink)) {
        const curr = queue.shift()!;
        const edges = this.adj.get(curr) || [];

        for (let i = 0; i < edges.length; i++) {
          const e = edges[i];
          const residual = e.capacity - e.flow;
          if (residual > 0 && !parentNode.has(e.to)) {
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
        const edgeIdx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![edgeIdx];
        bottleneck = Math.min(bottleneck, e.capacity - e.flow);
        curr = p;
      }

      curr = sink;
      while (curr !== source) {
        const p = parentNode.get(curr)!;
        const edgeIdx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![edgeIdx];
        e.flow += bottleneck;
        const rev = this.adj.get(e.to)![e.rev];
        rev.flow -= bottleneck;
        curr = p;
      }

      totalFlow += bottleneck;
      augmentations++;
    }

    return { maxFlow: totalFlow, augmentations };
  }
}

const ek = new EdmondsKarpMaxFlow();
ek.addEdge('S', 'A', 10);
ek.addEdge('S', 'B', 10);
ek.addEdge('A', 'B', 2);
ek.addEdge('A', 'T', 4);
ek.addEdge('B', 'T', 9);

const result = ek.computeMaxFlow('S', 'T');
console.log('Edmonds-Karp Maximum Network Flow:', result.maxFlow);
console.log('Total Augmenting Paths Traversed:', result.augmentations);
