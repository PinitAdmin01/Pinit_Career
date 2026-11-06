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

  // Pure traversal without path compression to allow exact rollbacks
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

    const increased = this.rank.get(rootU)! === this.rank.get(rootV)!;
    if (increased) {
      this.rank.set(rootU, this.rank.get(rootU)! + 1);
    }

    this.parent.set(rootV, rootU);
    this.history.push({ u: rootU, v: rootV, increasedRank: increased });
    return true;
  }

  rollback(): void {
    if (this.history.length === 0) return;
    const op = this.history.pop()!;
    if (op.u === '' && op.v === '') return;

    this.parent.set(op.v, op.v);
    if (op.increasedRank) {
      this.rank.set(op.u, this.rank.get(op.u)! - 1);
    }
  }

  isConnected(u: string, v: string): boolean {
    return this.find(u) === this.find(v);
  }

  historyDepth(): number {
    return this.history.length;
  }
}

const rdsu = new RollbackDSU();
rdsu.union('Switch1', 'Switch2');
rdsu.union('Switch2', 'Switch3');
console.log('Switch1 <-> Switch3 connected:', rdsu.isConnected('Switch1', 'Switch3'));

// Snapshot before speculative link
const snapshot = rdsu.historyDepth();
rdsu.union('Switch3', 'IsolatedSwitch');
console.log('Speculative connectivity:', rdsu.isConnected('Switch1', 'IsolatedSwitch'));

// Rollback speculative change
while (rdsu.historyDepth() > snapshot) {
  rdsu.rollback();
}
console.log('Post-Rollback connectivity:', rdsu.isConnected('Switch1', 'IsolatedSwitch'));
console.log('Original link Switch1 <-> Switch3 preserved:', rdsu.isConnected('Switch1', 'Switch3'));
