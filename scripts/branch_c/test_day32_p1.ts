interface FlowEdge {
  from: string;
  to: string;
  capacity: number;
  flow: number;
}

class FlowNetwork {
  private edges: FlowEdge[] = [];
  private adj = new Map<string, number[]>();

  addEdge(from: string, to: string, capacity: number, flow: number = 0): void {
    const edgeIndex = this.edges.length;
    this.edges.push({ from, to, capacity, flow });
    if (!this.adj.has(from)) this.adj.set(from, []);
    this.adj.get(from)!.push(edgeIndex);
  }

  verifyConservation(source: string, sink: string): { valid: boolean; netFlow: number } {
    const inFlow = new Map<string, number>();
    const outFlow = new Map<string, number>();

    for (const e of this.edges) {
      if (e.flow > e.capacity || e.flow < 0) return { valid: false, netFlow: 0 };
      outFlow.set(e.from, (outFlow.get(e.from) || 0) + e.flow);
      inFlow.set(e.to, (inFlow.get(e.to) || 0) + e.flow);
    }

    for (const node of this.adj.keys()) {
      if (node === source || node === sink) continue;
      if ((inFlow.get(node) || 0) !== (outFlow.get(node) || 0)) {
        return { valid: false, netFlow: 0 };
      }
    }

    const sourceOut = (outFlow.get(source) || 0) - (inFlow.get(source) || 0);
    const sinkIn = (inFlow.get(sink) || 0) - (outFlow.get(sink) || 0);

    return { valid: sourceOut === sinkIn, netFlow: sourceOut };
  }
}

const net = new FlowNetwork();
net.addEdge('Source', 'TransitA', 10, 7);
net.addEdge('Source', 'TransitB', 10, 5);
net.addEdge('TransitA', 'TransitB', 5, 1);
net.addEdge('TransitA', 'Sink', 8, 6);
net.addEdge('TransitB', 'Sink', 10, 6);

const audit = net.verifyConservation('Source', 'Sink');
console.log('Flow Conservation Valid:', audit.valid);
console.log('Total Network Throughput:', audit.netFlow);
