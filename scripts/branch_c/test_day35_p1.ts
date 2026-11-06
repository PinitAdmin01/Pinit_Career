/**
 * Day 35 - Part 1: Enterprise Transit Topology & Multi-Commodity Capacity Formulation
 */

interface TransitNode {
  id: number;
  label: string;
  tier: 'CORE' | 'AGGREGATION' | 'EDGE';
}

interface TransitLink {
  from: number;
  to: number;
  capacityGbps: number;
  delayMs: number;
  costMetric: number;
}

class TransitTopologyGraph {
  public nodes: Map<number, TransitNode> = new Map();
  public adj: Map<number, TransitLink[]> = new Map();

  addNode(node: TransitNode): void {
    this.nodes.set(node.id, node);
    if (!this.adj.has(node.id)) {
      this.adj.set(node.id, []);
    }
  }

  addLink(link: TransitLink): void {
    this.adj.get(link.from)!.push(link);
  }

  computeTotalTransitCapacity(): number {
    let total = 0;
    for (const links of this.adj.values()) {
      for (const link of links) {
        total += link.capacityGbps;
      }
    }
    return total;
  }

  displayTopologySummary(): void {
    console.log(`[TransitTopology] Registered Nodes: ${this.nodes.size}, Total Directed Links: ${Array.from(this.adj.values()).reduce((acc, l) => acc + l.length, 0)}`);
    console.log(`[TransitTopology] Aggregate Provisioned Bandwidth: ${this.computeTotalTransitCapacity()} Gbps`);
  }
}

function main(): void {
  const topology = new TransitTopologyGraph();

  // Tier 1 Core, Tier 2 Aggregation, Tier 3 Edge Gateways
  topology.addNode({ id: 0, label: "Core-Alpha-US-East", tier: 'CORE' });
  topology.addNode({ id: 1, label: "Core-Beta-EU-Central", tier: 'CORE' });
  topology.addNode({ id: 2, label: "Agg-Dist-1", tier: 'AGGREGATION' });
  topology.addNode({ id: 3, label: "Agg-Dist-2", tier: 'AGGREGATION' });
  topology.addNode({ id: 4, label: "Edge-GW-Ingress", tier: 'EDGE' });
  topology.addNode({ id: 5, label: "Edge-GW-Egress", tier: 'EDGE' });

  // Links with capacity, delay, and metrics
  topology.addLink({ from: 4, to: 2, capacityGbps: 100, delayMs: 2, costMetric: 10 });
  topology.addLink({ from: 4, to: 3, capacityGbps: 100, delayMs: 4, costMetric: 15 });
  topology.addLink({ from: 2, to: 0, capacityGbps: 200, delayMs: 5, costMetric: 5 });
  topology.addLink({ from: 3, to: 1, capacityGbps: 150, delayMs: 8, costMetric: 8 });
  topology.addLink({ from: 0, to: 1, capacityGbps: 400, delayMs: 12, costMetric: 2 });
  topology.addLink({ from: 0, to: 5, capacityGbps: 150, delayMs: 6, costMetric: 12 });
  topology.addLink({ from: 1, to: 5, capacityGbps: 250, delayMs: 4, costMetric: 6 });

  topology.displayTopologySummary();
}

main();
