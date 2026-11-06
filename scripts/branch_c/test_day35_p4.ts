/**
 * Day 35 - Part 4: Dynamic Route Churn Governor with Rollback Disjoint Set Union
 */

interface RollbackHistory {
  u: number;
  v: number;
  rankUChanged: boolean;
  componentsChanged: boolean;
}

class RollbackTransitDSU {
  private parent: number[];
  private rank: number[];
  private history: RollbackHistory[] = [];
  public componentCount: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.componentCount = n;
  }

  find(u: number): number {
    let curr = u;
    while (curr !== this.parent[curr]) {
      curr = this.parent[curr];
    }
    return curr;
  }

  connected(u: number, v: number): boolean {
    return this.find(u) === this.find(v);
  }

  union(u: number, v: number): boolean {
    let rootU = this.find(u);
    let rootV = this.find(v);

    if (rootU === rootV) {
      return false;
    }

    if (this.rank[rootU] < this.rank[rootV]) {
      const temp = rootU;
      rootU = rootV;
      rootV = temp;
    }

    let rankChanged = false;
    if (this.rank[rootU] === this.rank[rootV]) {
      this.rank[rootU]++;
      rankChanged = true;
    }

    this.parent[rootV] = rootU;
    this.componentCount--;

    this.history.push({
      u: rootU,
      v: rootV,
      rankUChanged: rankChanged,
      componentsChanged: true
    });

    return true;
  }

  getCheckpoint(): number {
    return this.history.length;
  }

  rollback(checkpoint: number): void {
    while (this.history.length > checkpoint) {
      const op = this.history.pop()!;
      this.parent[op.v] = op.v;
      if (op.rankUChanged) {
        this.rank[op.u]--;
      }
      if (op.componentsChanged) {
        this.componentCount++;
      }
    }
  }
}

function main(): void {
  // 6 routers
  const dsu = new RollbackTransitDSU(6);
  dsu.union(0, 1);
  dsu.union(1, 2);
  dsu.union(3, 4);

  console.log(`[TransitDSU] Base State - Active Components: ${dsu.componentCount}, Connected(0, 2): ${dsu.connected(0, 2)}, Connected(0, 4): ${dsu.connected(0, 4)}`);

  const checkpoint = dsu.getCheckpoint();
  // Simulate speculative link addition during failover
  dsu.union(2, 3);
  console.log(`[TransitDSU] Speculative Link (2-3) Added - Components: ${dsu.componentCount}, Connected(0, 4): ${dsu.connected(0, 4)}`);

  // Link flap triggers rollback
  dsu.rollback(checkpoint);
  console.log(`[TransitDSU] Rollback Complete - Components: ${dsu.componentCount}, Connected(0, 4): ${dsu.connected(0, 4)}`);
}

main();
