class DisjointSetUnion {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();

  makeSet(x: string): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): boolean {
    this.makeSet(x);
    this.makeSet(y);
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }

  isConnected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }
}

const dsu = new DisjointSetUnion();
dsu.union('NodeA', 'NodeB');
dsu.union('NodeB', 'NodeC');
dsu.union('NodeD', 'NodeE');

console.log('NodeA connected to NodeC:', dsu.isConnected('NodeA', 'NodeC'));
console.log('NodeA connected to NodeE:', dsu.isConnected('NodeA', 'NodeE'));
dsu.union('NodeC', 'NodeD');
console.log('Post-Merge NodeA connected to NodeE:', dsu.isConnected('NodeA', 'NodeE'));
