class DSUWithSize {
  private parent = new Map<string, string>();
  private size = new Map<string, number>();

  makeSet(x: string): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.size.set(x, 1);
    }
  }

  find(x: string): string {
    let root = x;
    while (root !== (this.parent.get(root) || root)) {
      root = this.parent.get(root)!;
    }
    // Two-pass path compression
    let curr = x;
    while (curr !== root) {
      const nxt = this.parent.get(curr)!;
      this.parent.set(curr, root);
      curr = nxt;
    }
    return root;
  }

  union(x: string, y: string): { merged: boolean; root: string; componentSize: number } {
    this.makeSet(x);
    this.makeSet(y);
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX === rootY) {
      return { merged: false, root: rootX, componentSize: this.size.get(rootX)! };
    }

    if (this.size.get(rootX)! < this.size.get(rootY)!) {
      [rootX, rootY] = [rootY, rootX];
    }

    this.parent.set(rootY, rootX);
    this.size.set(rootX, this.size.get(rootX)! + this.size.get(rootY)!);

    return { merged: true, root: rootX, componentSize: this.size.get(rootX)! };
  }

  getComponentSize(x: string): number {
    return this.size.get(this.find(x)) || 1;
  }
}

const dsuSize = new DSUWithSize();
dsuSize.union('Host1', 'Host2');
dsuSize.union('Host2', 'Host3');
console.log('Host1 cluster size:', dsuSize.getComponentSize('Host1'));

dsuSize.union('Host4', 'Host5');
console.log('Host4 cluster size:', dsuSize.getComponentSize('Host4'));

const mergeRes = dsuSize.union('Host3', 'Host5');
console.log('Merged master root:', mergeRes.root);
console.log('Unified cluster size:', mergeRes.componentSize);
