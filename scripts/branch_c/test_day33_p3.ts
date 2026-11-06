interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
}

class BipartiteMatchingFlow {
  private adj = new Map<string, ResidualEdge[]>();
  private workers = new Set<string>();
  private tasks = new Set<string>();

  addEdge(u: string, v: string, capacity: number): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);

    const forward: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0 };
    const backward: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0 };

    this.adj.get(u)!.push(forward);
    this.adj.get(v)!.push(backward);
  }

  registerWorkerTaskAffinity(worker: string, task: string): void {
    this.workers.add(worker);
    this.tasks.add(task);
    this.addEdge(worker, task, 1);
  }

  solveMaximumMatching(): {
    matchingSize: number;
    assignedPairs: [string, string][];
  } {
    const source = 'Source';
    const sink = 'Sink';

    for (const w of this.workers) {
      this.addEdge(source, w, 1);
    }
    for (const t of this.tasks) {
      this.addEdge(t, sink, 1);
    }

    // Edmonds-Karp BFS
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

      let curr = sink;
      while (curr !== source) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![idx];
        e.flow += 1;
        const rev = this.adj.get(e.to)![e.rev];
        rev.flow -= 1;
        curr = p;
      }
      totalFlow += 1;
    }

    const assignedPairs: [string, string][] = [];
    for (const w of this.workers) {
      for (const e of this.adj.get(w) || []) {
        if (this.tasks.has(e.to) && e.flow === 1) {
          assignedPairs.push([w, e.to]);
        }
      }
    }

    return { matchingSize: totalFlow, assignedPairs };
  }
}

const bmf = new BipartiteMatchingFlow();
bmf.registerWorkerTaskAffinity('Dev1', 'Frontend');
bmf.registerWorkerTaskAffinity('Dev1', 'Backend');
bmf.registerWorkerTaskAffinity('Dev2', 'Backend');
bmf.registerWorkerTaskAffinity('Dev3', 'Database');
bmf.registerWorkerTaskAffinity('Dev3', 'DevOps');
bmf.registerWorkerTaskAffinity('Dev4', 'DevOps');

const allocation = bmf.solveMaximumMatching();
console.log('Maximum Bipartite Matching Size:', allocation.matchingSize);
console.log('Optimal Task Assignments:');
allocation.assignedPairs.forEach(p => console.log(`- ${p[0]} => ${p[1]}`));
