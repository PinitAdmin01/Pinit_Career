class UndirectedNetwork {
  private adj = new Map<string, string[]>();
  private tin = new Map<string, number>();
  private low = new Map<string, number>();
  private timer = 0;
  private bridges: [string, string][] = [];
  private articulationPoints = new Set<string>();

  addEdge(u: string, v: string): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.adj.get(u)!.push(v);
    this.adj.get(v)!.push(u);
  }

  analyze(): { bridges: [string, string][]; cutVertices: string[] } {
    this.tin.clear();
    this.low.clear();
    this.timer = 0;
    this.bridges = [];
    this.articulationPoints.clear();

    for (const node of this.adj.keys()) {
      if (!this.tin.has(node)) {
        this.dfs(node, null);
      }
    }
    return {
      bridges: this.bridges,
      cutVertices: Array.from(this.articulationPoints)
    };
  }

  private dfs(u: string, p: string | null): void {
    this.timer++;
    this.tin.set(u, this.timer);
    this.low.set(u, this.timer);
    let children = 0;

    for (const v of this.adj.get(u) || []) {
      if (v === p) continue;
      if (this.tin.has(v)) {
        this.low.set(u, Math.min(this.low.get(u)!, this.tin.get(v)!));
      } else {
        this.dfs(v, u);
        this.low.set(u, Math.min(this.low.get(u)!, this.low.get(v)!));
        if (this.low.get(v)! > this.tin.get(u)!) {
          this.bridges.push([u, v]);
        }
        if (this.low.get(v)! >= this.tin.get(u)! && p !== null) {
          this.articulationPoints.add(u);
        }
        children++;
      }
    }
    if (p === null && children > 1) {
      this.articulationPoints.add(u);
    }
  }
}

const net = new UndirectedNetwork();
net.addEdge("Router1", "Router2");
net.addEdge("Router2", "Router3");
net.addEdge("Router3", "Router1");
net.addEdge("Router3", "Gateway");
net.addEdge("Gateway", "CloudEast");
net.addEdge("Gateway", "CloudWest");

const res = net.analyze();
console.log("Vulnerable Bridges (Cut Edges):", res.bridges.map(b => `${b[0]} <-> ${b[1]}`));
console.log("Single Points of Failure (Cut Vertices):", res.cutVertices.sort());
