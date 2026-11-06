interface EdgeData {
  u: string;
  v: string;
  lower: number;
  capacity: number;
}

class CirculationWithDemands {
  private demands = new Map<string, number>();
  private edges: EdgeData[] = [];

  setDemand(node: string, demand: number): void {
    this.demands.set(node, demand);
  }

  addEdge(u: string, v: string, lower: number, capacity: number): void {
    this.edges.push({ u, v, lower, capacity });
  }

  transformToMaxFlow(): {
    superSourceEdges: [string, string, number][];
    superSinkEdges: [string, string, number][];
    transformedEdges: [string, string, number][];
    totalDemandSum: number;
  } {
    const netDemand = new Map<string, number>();
    for (const [node, d] of this.demands.entries()) {
      netDemand.set(node, d);
    }

    const transformedEdges: [string, string, number][] = [];
    for (const e of this.edges) {
      transformedEdges.push([e.u, e.v, e.capacity - e.lower]);
      netDemand.set(e.u, (netDemand.get(e.u) || 0) + e.lower);
      netDemand.set(e.v, (netDemand.get(e.v) || 0) - e.lower);
    }

    const superSourceEdges: [string, string, number][] = [];
    const superSinkEdges: [string, string, number][] = [];
    let totalDemandSum = 0;

    for (const [node, d] of netDemand.entries()) {
      if (d < 0) {
        superSourceEdges.push(['SuperSource', node, -d]);
      } else if (d > 0) {
        superSinkEdges.push([node, 'SuperSink', d]);
        totalDemandSum += d;
      }
    }

    return { superSourceEdges, superSinkEdges, transformedEdges, totalDemandSum };
  }
}

const circ = new CirculationWithDemands();
circ.setDemand('NodeA', -10); // supply of 10
circ.setDemand('NodeB', 0);
circ.setDemand('NodeC', 10);  // demand of 10
circ.addEdge('NodeA', 'NodeB', 2, 8);
circ.addEdge('NodeB', 'NodeC', 3, 7);

const reduction = circ.transformToMaxFlow();
console.log('Target Required Flow Sum:', reduction.totalDemandSum);
console.log('Transformed Internal Edges:', reduction.transformedEdges.map(e => `${e[0]}->${e[1]} (cap: ${e[2]})`));
console.log('SuperSource Ingestion Edges:', reduction.superSourceEdges.map(e => `${e[0]}->${e[1]} (cap: ${e[2]})`));
console.log('SuperSink Delivery Edges:', reduction.superSinkEdges.map(e => `${e[0]}->${e[1]} (cap: ${e[2]})`));
