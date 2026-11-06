interface PipelineEdge {
  from: string;
  to: string;
  capacityGbps: number;
}

interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
  original: boolean;
}

class EnterpriseTransitFlowOptimizer {
  private adj = new Map<string, ResidualEdge[]>();
  private edgeList: { from: string; to: string; capacity: number }[] = [];

  registerPipelineLink(from: string, to: string, capacityGbps: number): void {
    if (!this.adj.has(from)) this.adj.set(from, []);
    if (!this.adj.has(to)) this.adj.set(to, []);

    const forward: ResidualEdge = { to, rev: this.adj.get(to)!.length, capacity: capacityGbps, flow: 0, original: true };
    const backward: ResidualEdge = { to: from, rev: this.adj.get(from)!.length, capacity: 0, flow: 0, original: false };

    this.adj.get(from)!.push(forward);
    this.adj.get(to)!.push(backward);
    this.edgeList.push({ from, to, capacity: capacityGbps });
  }

  optimizeTransitFlow(ingressGateway: string, egressGateway: string): {
    maxBandwidthGbps: number;
    saturatedConduits: { conduit: string; capacityGbps: number }[];
    linkUtilization: { conduit: string; utilizedGbps: number; capacityGbps: number; percentage: string }[];
  } {
    let totalFlow = 0;

    while (true) {
      const parentNode = new Map<string, string>();
      const parentEdgeIndex = new Map<string, number>();
      const queue: string[] = [ingressGateway];
      parentNode.set(ingressGateway, ingressGateway);

      while (queue.length > 0 && !parentNode.has(egressGateway)) {
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

      if (!parentNode.has(egressGateway)) break;

      let bottleneck = Infinity;
      let curr = egressGateway;
      while (curr !== ingressGateway) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![idx];
        bottleneck = Math.min(bottleneck, e.capacity - e.flow);
        curr = p;
      }

      curr = egressGateway;
      while (curr !== ingressGateway) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIndex.get(curr)!;
        const e = this.adj.get(p)![idx];
        e.flow += bottleneck;
        const rev = this.adj.get(e.to)![e.rev];
        rev.flow -= bottleneck;
        curr = p;
      }

      totalFlow += bottleneck;
    }

    const saturatedConduits: { conduit: string; capacityGbps: number }[] = [];
    const linkUtilization: { conduit: string; utilizedGbps: number; capacityGbps: number; percentage: string }[] = [];

    for (const [from, edges] of this.adj.entries()) {
      for (const e of edges) {
        if (e.original) {
          const conduit = `${from} -> ${e.to}`;
          const pct = ((e.flow / e.capacity) * 100).toFixed(1) + '%';
          linkUtilization.push({ conduit, utilizedGbps: e.flow, capacityGbps: e.capacity, percentage: pct });
          if (e.flow === e.capacity) {
            saturatedConduits.push({ conduit, capacityGbps: e.capacity });
          }
        }
      }
    }

    return { maxBandwidthGbps: totalFlow, saturatedConduits, linkUtilization };
  }
}

const optimizer = new EnterpriseTransitFlowOptimizer();
optimizer.registerPipelineLink('IngressGateway', 'EdgeRouterA', 40);
optimizer.registerPipelineLink('IngressGateway', 'EdgeRouterB', 30);
optimizer.registerPipelineLink('EdgeRouterA', 'CoreMeshAlpha', 25);
optimizer.registerPipelineLink('EdgeRouterA', 'CoreMeshBeta', 20);
optimizer.registerPipelineLink('EdgeRouterB', 'CoreMeshBeta', 30);
optimizer.registerPipelineLink('CoreMeshAlpha', 'EgressGateway', 30);
optimizer.registerPipelineLink('CoreMeshBeta', 'EgressGateway', 35);

const flowReport = optimizer.optimizeTransitFlow('IngressGateway', 'EgressGateway');
console.log('=== ENTERPRISE TRANSIT FLOW REPORT ===');
console.log(`Peak Aggregate Throughput: ${flowReport.maxBandwidthGbps} Gbps`);
console.log(`Saturated Bottleneck Conduits: ${flowReport.saturatedConduits.length}`);
flowReport.saturatedConduits.forEach(s => console.log(`- Bottleneck: ${s.conduit} (Cap: ${s.capacityGbps} Gbps)`));
console.log('Transit Infrastructure Health: HIGH CAPACITY (OPTIMIZED)');
