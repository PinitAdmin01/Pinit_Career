interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
}

class ResidualGraph {
  private adj = new Map<string, ResidualEdge[]>();

  addEdge(u: string, v: string, capacity: number): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);

    const forward: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0 };
    const backward: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0 };

    this.adj.get(u)!.push(forward);
    this.adj.get(v)!.push(backward);
  }

  getResidualCapacity(u: string, edgeIndex: number): number {
    const e = this.adj.get(u)![edgeIndex];
    return e.capacity - e.flow;
  }

  augmentPath(path: { u: string; edgeIndex: number }[], bottleneck: number): void {
    for (const step of path) {
      const e = this.adj.get(step.u)![step.edgeIndex];
      e.flow += bottleneck;
      const revEdge = this.adj.get(e.to)![e.rev];
      revEdge.flow -= bottleneck;
    }
  }

  inspectResiduals(u: string): { to: string; residual: number }[] {
    return (this.adj.get(u) || []).map(e => ({
      to: e.to,
      residual: e.capacity - e.flow
    }));
  }
}

const rg = new ResidualGraph();
rg.addEdge('S', 'A', 10);
rg.addEdge('A', 'T', 7);

console.log('Initial S -> A residual:', rg.inspectResiduals('S'));
rg.augmentPath([{ u: 'S', edgeIndex: 0 }, { u: 'A', edgeIndex: 0 }], 7);
console.log('Post-Augmentation S residuals:', rg.inspectResiduals('S'));
console.log('Post-Augmentation A residuals:', rg.inspectResiduals('A'));
