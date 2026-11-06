class TarjanSCC {
  private adj = new Map<string, string[]>();
  private tin = new Map<string, number>();
  private low = new Map<string, number>();
  private onStack = new Set<string>();
  private stack: string[] = [];
  private timer = 0;
  private sccs: string[][] = [];

  addEdge(u: string, v: string): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.adj.get(u)!.push(v);
  }

  findSCCs(): string[][] {
    this.tin.clear();
    this.low.clear();
    this.onStack.clear();
    this.stack = [];
    this.timer = 0;
    this.sccs = [];

    for (const node of this.adj.keys()) {
      if (!this.tin.has(node)) {
        this.dfs(node);
      }
    }
    return this.sccs;
  }

  private dfs(u: string): void {
    this.timer++;
    this.tin.set(u, this.timer);
    this.low.set(u, this.timer);
    this.stack.push(u);
    this.onStack.add(u);

    for (const v of this.adj.get(u) || []) {
      if (!this.tin.has(v)) {
        this.dfs(v);
        this.low.set(u, Math.min(this.low.get(u)!, this.low.get(v)!));
      } else if (this.onStack.has(v)) {
        this.low.set(u, Math.min(this.low.get(u)!, this.tin.get(v)!));
      }
    }

    if (this.low.get(u) === this.tin.get(u)) {
      const component: string[] = [];
      let curr: string;
      do {
        curr = this.stack.pop()!;
        this.onStack.delete(curr);
        component.push(curr);
      } while (curr !== u);
      this.sccs.push(component);
    }
  }
}

const tarjan = new TarjanSCC();
tarjan.addEdge("A", "B");
tarjan.addEdge("B", "C");
tarjan.addEdge("C", "A");
tarjan.addEdge("C", "D");
tarjan.addEdge("D", "E");
tarjan.addEdge("E", "F");
tarjan.addEdge("F", "D");

const components = tarjan.findSCCs();
console.log(`Discovered ${components.length} Strongly Connected Components:`);
components.forEach((c, i) => console.log(`SCC ${i + 1}: [${c.sort().join(", ")}]`));
