interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
}

class KonigVertexCoverEngine {
  private adj = new Map<string, ResidualEdge[]>();
  private leftNodes = new Set<string>();
  private rightNodes = new Set<string>();
  private originalEdges: [string, string][] = [];

  addEdge(u: string, v: string, capacity: number): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);

    const forward: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0 };
    const backward: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0 };

    this.adj.get(u)!.push(forward);
    this.adj.get(v)!.push(backward);
  }

  registerBipartiteEdge(u: string, v: string): void {
    this.leftNodes.add(u);
    this.rightNodes.add(v);
    this.originalEdges.push([u, v]);
  }

  computeMatchingAndVertexCover(): {
    matchingSize: number;
    vertexCoverSize: number;
    vertexCoverNodes: string[];
    coversAllEdges: boolean;
  } {
    const s = 'Source';
    const t = 'Sink';

    for (const u of this.leftNodes) this.addEdge(s, u, 1);
    for (const v of this.rightNodes) this.addEdge(v, t, 1);
    for (const [u, v] of this.originalEdges) this.addEdge(u, v, 1);

    // Edmonds-Karp BFS
    let maxFlow = 0;
    while (true) {
      const parentNode = new Map<string, string>();
      const parentEdgeIndex = new Map<string, number>();
      const queue: string[] = [s];
      parentNode.set(s, s);

      while (queue.length > 0 && !parentNode.has(t)) {
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

      if (!parentNode.has(t)) break;

      let curr = t;
      while (curr !== s) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![idx];
        e.flow += 1;
        const rev = this.adj.get(e.to)![e.rev];
        rev.flow -= 1;
        curr = p;
      }
      maxFlow += 1;
    }

    // Residual Reachability from Source S
    const reachableS = new Set<string>();
    const queue: string[] = [s];
    reachableS.add(s);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const e of this.adj.get(curr) || []) {
        if (e.capacity - e.flow > 0 && !reachableS.has(e.to)) {
          reachableS.add(e.to);
          queue.push(e.to);
        }
      }
    }

    // Konig Minimum Vertex Cover = (L \ S) U (R ∩ S)
    const vertexCover = new Set<string>();
    for (const u of this.leftNodes) {
      if (!reachableS.has(u)) vertexCover.add(u);
    }
    for (const v of this.rightNodes) {
      if (reachableS.has(v)) vertexCover.add(v);
    }

    const coversAll = this.originalEdges.every(([u, v]) => vertexCover.has(u) || vertexCover.has(v));

    return {
      matchingSize: maxFlow,
      vertexCoverSize: vertexCover.size,
      vertexCoverNodes: Array.from(vertexCover).sort(),
      coversAllEdges: coversAll
    };
  }
}

const konig = new KonigVertexCoverEngine();
konig.registerBipartiteEdge('U1', 'V1');
konig.registerBipartiteEdge('U1', 'V2');
konig.registerBipartiteEdge('U2', 'V2');
konig.registerBipartiteEdge('U3', 'V2');
konig.registerBipartiteEdge('U3', 'V3');

const kc = konig.computeMatchingAndVertexCover();
console.log("Konig's Theorem Verification:");
console.log('- Maximum Matching Size:', kc.matchingSize);
console.log('- Minimum Vertex Cover Size:', kc.vertexCoverSize);
console.log('- Minimum Vertex Cover Nodes:', kc.vertexCoverNodes);
console.log('- All Bipartite Edges Covered:', kc.coversAllEdges);
