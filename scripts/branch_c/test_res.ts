interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
}

class ResidualGraph {
  public adj = new Map<string, ResidualEdge[]>();

  addEdge(u: string, v: string, capacity: number): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);

    const forward: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0 };
    const backward: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0 };

    this.adj.get(u)!.push(forward);
    this.adj.get(v)!.push(backward);
  }

  augment(u: string, edgeIdx: number, delta: number): void {
    const e = this.adj.get(u)![edgeIdx];
    e.flow += delta;
    const rev = this.adj.get(e.to)![e.rev];
    rev.flow -= delta;
  }
}

const g = new ResidualGraph();
g.addEdge('S', 'A', 10);
g.addEdge('A', 'T', 7);

console.log('Before:');
console.log('S:', g.adj.get('S'));
console.log('A:', g.adj.get('A'));

g.augment('S', 0, 7);
g.augment('A', 1, 7);

console.log('After augment 7:');
console.log('S:', g.adj.get('S')!.map(e => ({ to: e.to, res: e.capacity - e.flow })));
console.log('A:', g.adj.get('A')!.map(e => ({ to: e.to, res: e.capacity - e.flow })));
