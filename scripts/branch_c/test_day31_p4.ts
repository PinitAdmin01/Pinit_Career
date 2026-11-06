class CondensationGraph {
  buildDAG(nodes: string[], adj: Map<string, string[]>, sccs: string[][]): {
    condensedNodes: string[];
    condensedEdges: [string, string][];
    componentMap: Map<string, string>;
  } {
    const componentMap = new Map<string, string>();
    const condensedNodes: string[] = [];

    sccs.forEach((comp, idx) => {
      const compId = `SCC_${idx + 1}`;
      condensedNodes.push(compId);
      for (const node of comp) {
        componentMap.set(node, compId);
      }
    });

    const edgeSet = new Set<string>();
    const condensedEdges: [string, string][] = [];

    for (const [u, neighbors] of adj.entries()) {
      const compU = componentMap.get(u)!;
      for (const v of neighbors) {
        const compV = componentMap.get(v)!;
        if (compU !== compV) {
          const edgeKey = `${compU}->${compV}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            condensedEdges.push([compU, compV]);
          }
        }
      }
    }

    return { condensedNodes, condensedEdges, componentMap };
  }
}

const cg = new CondensationGraph();
const adj = new Map<string, string[]>([
  ["Auth", ["Token"]],
  ["Token", ["Session"]],
  ["Session", ["Auth", "Billing"]],
  ["Billing", ["Invoice"]],
  ["Invoice", ["Payment"]],
  ["Payment", ["Billing"]]
]);
const sccs = [["Billing", "Invoice", "Payment"], ["Auth", "Token", "Session"]];
const dag = cg.buildDAG(["Auth", "Token", "Session", "Billing", "Invoice", "Payment"], adj, sccs);

console.log("Condensed Super-Nodes:", dag.condensedNodes);
console.log("Condensed Inter-Component Edges:", dag.condensedEdges.map(e => `${e[0]} -> ${e[1]}`));
