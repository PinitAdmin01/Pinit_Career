// Part 1: Directed Graph Mutually Reachable Vertices & Cycle Detection
class DirectedGraph {
  private adj = new Map<string, string[]>();

  addEdge(u: string, v: string): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    this.adj.get(u)!.push(v);
  }

  isReachable(start: string, target: string): boolean {
    const visited = new Set<string>();
    const queue = [start];
    visited.add(start);
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === target) return true;
      for (const neighbor of this.adj.get(curr) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return false;
  }

  areMutuallyReachable(u: string, v: string): boolean {
    return this.isReachable(u, v) && this.isReachable(v, u);
  }
}

const g1 = new DirectedGraph();
g1.addEdge("Auth", "Token");
g1.addEdge("Token", "Session");
g1.addEdge("Session", "Auth");
g1.addEdge("Session", "Billing");

console.log("Auth <-> Session mutual:", g1.areMutuallyReachable("Auth", "Session"));
console.log("Auth <-> Billing mutual:", g1.areMutuallyReachable("Auth", "Billing"));
