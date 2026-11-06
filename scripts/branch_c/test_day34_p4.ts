interface RollbackOp {
  u: string;
  v: string;
  increasedRank: boolean;
}

class RollbackDSU {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();
  private history: RollbackOp[] = [];

  makeSet(x: string): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }

  find(x: string): string {
    let curr = x;
    while (curr !== (this.parent.get(curr) || curr)) {
      curr = this.parent.get(curr)!;
    }
    return curr;
  }

  union(u: string, v: string): boolean {
    this.makeSet(u);
    this.makeSet(v);
    let rootU = this.find(u);
    let rootV = this.find(v);
    if (rootU === rootV) {
      this.history.push({ u: '', v: '', increasedRank: false });
      return false;
    }

    if (this.rank.get(rootU)! < this.rank.get(rootV)!) {
      [rootU, rootV] = [rootV, rootU];
    }
    const inc = this.rank.get(rootU)! === this.rank.get(rootV)!;
    if (inc) this.rank.set(rootU, this.rank.get(rootU)! + 1);

    this.parent.set(rootV, rootU);
    this.history.push({ u: rootU, v: rootV, increasedRank: inc });
    return true;
  }

  rollback(): void {
    if (this.history.length === 0) return;
    const op = this.history.pop()!;
    if (op.u === '' && op.v === '') return;
    this.parent.set(op.v, op.v);
    if (op.increasedRank) this.rank.set(op.u, this.rank.get(op.u)! - 1);
  }

  isConnected(u: string, v: string): boolean {
    return this.find(u) === this.find(v);
  }

  checkpoint(): number {
    return this.history.length;
  }

  rollbackTo(cp: number): void {
    while (this.history.length > cp) this.rollback();
  }
}

interface TimelineEdge {
  u: string;
  v: string;
  startTime: number;
  endTime: number;
}

interface Query {
  time: number;
  u: string;
  v: string;
}

class OfflineDynamicConnectivity {
  private dsu = new RollbackDSU();

  solve(numTimeSteps: number, edges: TimelineEdge[], queries: Query[]): { time: number; query: string; connected: boolean }[] {
    const results: { time: number; query: string; connected: boolean }[] = [];
    const tree = new Map<number, [string, string][]>();

    const addEdgeToTree = (node: number, l: number, r: number, ql: number, qr: number, edge: [string, string]) => {
      if (ql <= l && r <= qr) {
        if (!tree.has(node)) tree.set(node, []);
        tree.get(node)!.push(edge);
        return;
      }
      const mid = Math.floor((l + r) / 2);
      if (ql <= mid) addEdgeToTree(2 * node, l, mid, ql, qr, edge);
      if (qr > mid) addEdgeToTree(2 * node + 1, mid + 1, r, ql, qr, edge);
    };

    for (const e of edges) {
      addEdgeToTree(1, 0, numTimeSteps - 1, e.startTime, e.endTime, [e.u, e.v]);
    }

    const queriesByTime = new Map<number, Query[]>();
    for (const q of queries) {
      if (!queriesByTime.has(q.time)) queriesByTime.set(q.time, []);
      queriesByTime.get(q.time)!.push(q);
    }

    const dfs = (node: number, l: number, r: number) => {
      const cp = this.dsu.checkpoint();
      for (const [u, v] of tree.get(node) || []) {
        this.dsu.union(u, v);
      }

      if (l === r) {
        for (const q of queriesByTime.get(l) || []) {
          results.push({
            time: l,
            query: `${q.u} <-> ${q.v}`,
            connected: this.dsu.isConnected(q.u, q.v)
          });
        }
      } else {
        const mid = Math.floor((l + r) / 2);
        dfs(2 * node, l, mid);
        dfs(2 * node + 1, mid + 1, r);
      }

      this.dsu.rollbackTo(cp);
    };

    dfs(1, 0, numTimeSteps - 1);
    return results;
  }
}

const solver = new OfflineDynamicConnectivity();
const edges: TimelineEdge[] = [
  { u: 'Alpha', v: 'Beta', startTime: 0, endTime: 3 },
  { u: 'Beta', v: 'Gamma', startTime: 1, endTime: 2 }
];
const queries: Query[] = [
  { time: 0, u: 'Alpha', v: 'Gamma' },
  { time: 1, u: 'Alpha', v: 'Gamma' },
  { time: 3, u: 'Alpha', v: 'Gamma' }
];

const answers = solver.solve(4, edges, queries);
console.log('Offline Dynamic Connectivity Timeline Results:');
answers.forEach(a => console.log(`Time ${a.time} [${a.query}]: connected = ${a.connected}`));
