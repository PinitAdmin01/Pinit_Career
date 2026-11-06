interface RollbackOp {
  u: string;
  v: string;
  increasedRank: boolean;
}

class EnterpriseNetworkConnectivityOracle {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();
  private clusterSize = new Map<string, number>();
  private history: RollbackOp[] = [];
  private allNodes = new Set<string>();

  registerNode(node: string): void {
    if (!this.parent.has(node)) {
      this.parent.set(node, node);
      this.rank.set(node, 0);
      this.clusterSize.set(node, 1);
      this.allNodes.add(node);
    }
  }

  find(x: string): string {
    let curr = x;
    while (curr !== (this.parent.get(curr) || curr)) {
      curr = this.parent.get(curr)!;
    }
    return curr;
  }

  establishMeshLink(u: string, v: string): boolean {
    this.registerNode(u);
    this.registerNode(v);
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
    this.clusterSize.set(rootU, this.clusterSize.get(rootU)! + this.clusterSize.get(rootV)!);
    this.history.push({ u: rootU, v: rootV, increasedRank: inc });
    return true;
  }

  rollbackLink(): void {
    if (this.history.length === 0) return;
    const op = this.history.pop()!;
    if (op.u === '' && op.v === '') return;

    this.clusterSize.set(op.u, this.clusterSize.get(op.u)! - this.clusterSize.get(op.v)!);
    this.parent.set(op.v, op.v);
    if (op.increasedRank) {
      this.rank.set(op.u, this.rank.get(op.u)! - 1);
    }
  }

  auditMeshHealth(): {
    totalNodes: number;
    connectedComponentsCount: number;
    largestClusterSize: number;
    auditStatus: string;
  } {
    const roots = new Set<string>();
    let maxSize = 0;

    for (const node of this.allNodes) {
      const r = this.find(node);
      roots.add(r);
      maxSize = Math.max(maxSize, this.clusterSize.get(r) || 1);
    }

    const status = roots.size === 1 ? 'UNIFIED MESH (100% CONNECTED)' : `PARTITIONED (${roots.size} ISOLATED ISLANDS)`;

    return {
      totalNodes: this.allNodes.size,
      connectedComponentsCount: roots.size,
      largestClusterSize: maxSize,
      auditStatus: status
    };
  }

  isRouteAvailable(u: string, v: string): boolean {
    return this.find(u) === this.find(v);
  }

  checkpoint(): number {
    return this.history.length;
  }

  rollbackTo(cp: number): void {
    while (this.history.length > cp) this.rollbackLink();
  }
}

const oracle = new EnterpriseNetworkConnectivityOracle();
oracle.establishMeshLink('US-East-Gateway', 'US-East-Worker1');
oracle.establishMeshLink('US-East-Worker1', 'US-East-Worker2');
oracle.establishMeshLink('EU-Central-Gateway', 'EU-Central-Worker1');

const initialAudit = oracle.auditMeshHealth();
console.log('=== ENTERPRISE TOPOLOGY ORACLE INITIAL AUDIT ===');
console.log(`Registered Nodes: ${initialAudit.totalNodes}`);
console.log(`Isolated Component Clusters: ${initialAudit.connectedComponentsCount}`);
console.log(`Network Status: ${initialAudit.auditStatus}`);

const cp = oracle.checkpoint();
console.log('\n--- Evaluating Speculative Transatlantic WAN Bridge ---');
oracle.establishMeshLink('US-East-Gateway', 'EU-Central-Gateway');
console.log('US-East-Worker2 <-> EU-Central-Worker1 Reachable:', oracle.isRouteAvailable('US-East-Worker2', 'EU-Central-Worker1'));
console.log('Post-Bridge Network Status:', oracle.auditMeshHealth().auditStatus);

oracle.rollbackTo(cp);
console.log('\n--- Rolled Back Speculative WAN Bridge ---');
console.log('Post-Rollback Reachable:', oracle.isRouteAvailable('US-East-Worker2', 'EU-Central-Worker1'));
console.log('Restored Network Status:', oracle.auditMeshHealth().auditStatus);
