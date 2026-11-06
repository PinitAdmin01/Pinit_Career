interface DirectedEdge {
  from: string;
  to: string;
  capacity: number;
}

class CutDualityVerifier {
  private edges: DirectedEdge[] = [];

  addEdge(from: string, to: string, capacity: number): void {
    this.edges.push({ from, to, capacity });
  }

  computeCutCapacity(cutS: Set<string>): {
    cutCapacity: number;
    crossingEdges: [string, string, number][];
  } {
    let cutCapacity = 0;
    const crossingEdges: [string, string, number][] = [];

    for (const e of this.edges) {
      if (cutS.has(e.from) && !cutS.has(e.to)) {
        cutCapacity += e.capacity;
        crossingEdges.push([e.from, e.to, e.capacity]);
      }
    }

    return { cutCapacity, crossingEdges };
  }
}

const verifier = new CutDualityVerifier();
verifier.addEdge('Source', 'TransitA', 10);
verifier.addEdge('Source', 'TransitB', 10);
verifier.addEdge('TransitA', 'TransitB', 2);
verifier.addEdge('TransitA', 'Sink', 4);
verifier.addEdge('TransitB', 'Sink', 9);

const sSet = new Set(['Source', 'TransitA']);
const cutResult = verifier.computeCutCapacity(sSet);
console.log('Capacity of s-t Cut (S, T):', cutResult.cutCapacity);
console.log('Crossing Edges:', cutResult.crossingEdges.map(e => `${e[0]} -> ${e[1]} (${e[2]})`));
