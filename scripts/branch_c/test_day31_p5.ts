class EnterpriseTopologyGuardian {
  private adjDirected = new Map<string, string[]>();
  private adjUndirected = new Map<string, string[]>();

  registerDependency(caller: string, callee: string): void {
    if (!this.adjDirected.has(caller)) this.adjDirected.set(caller, []);
    if (!this.adjDirected.has(callee)) this.adjDirected.set(callee, []);
    this.adjDirected.get(caller)!.push(callee);

    if (!this.adjUndirected.has(caller)) this.adjUndirected.set(caller, []);
    if (!this.adjUndirected.has(callee)) this.adjUndirected.set(callee, []);
    this.adjUndirected.get(caller)!.push(callee);
    this.adjUndirected.get(callee)!.push(caller);
  }

  auditTopology(): {
    circularRings: string[][];
    vulnerableBridges: [string, string][];
    healthStatus: string;
  } {
    // Tarjan's SCC on directed graph
    const tin = new Map<string, number>();
    const low = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    let timer = 0;
    const sccs: string[][] = [];

    const dfsSCC = (u: string) => {
      timer++;
      tin.set(u, timer);
      low.set(u, timer);
      stack.push(u);
      onStack.add(u);

      for (const v of this.adjDirected.get(u) || []) {
        if (!tin.has(v)) {
          dfsSCC(v);
          low.set(u, Math.min(low.get(u)!, low.get(v)!));
        } else if (onStack.has(v)) {
          low.set(u, Math.min(low.get(u)!, tin.get(v)!));
        }
      }

      if (low.get(u) === tin.get(u)) {
        const comp: string[] = [];
        let curr: string;
        do {
          curr = stack.pop()!;
          onStack.delete(curr);
          comp.push(curr);
        } while (curr !== u);
        if (comp.length > 1) {
          sccs.push(comp);
        }
      }
    };

    for (const node of this.adjDirected.keys()) {
      if (!tin.has(node)) dfsSCC(node);
    }

    // Bridge detection on undirected topology
    const tinUndir = new Map<string, number>();
    const lowUndir = new Map<string, number>();
    let timerUndir = 0;
    const bridges: [string, string][] = [];

    const dfsBridge = (u: string, p: string | null) => {
      timerUndir++;
      tinUndir.set(u, timerUndir);
      lowUndir.set(u, timerUndir);

      for (const v of this.adjUndirected.get(u) || []) {
        if (v === p) continue;
        if (tinUndir.has(v)) {
          lowUndir.set(u, Math.min(lowUndir.get(u)!, tinUndir.get(v)!));
        } else {
          dfsBridge(v, u);
          lowUndir.set(u, Math.min(lowUndir.get(u)!, lowUndir.get(v)!));
          if (lowUndir.get(v)! > tinUndir.get(u)!) {
            bridges.push([u, v]);
          }
        }
      }
    };

    for (const node of this.adjUndirected.keys()) {
      if (!tinUndir.has(node)) dfsBridge(node, null);
    }

    const health = sccs.length === 0 && bridges.length === 0 ? "OPTIMAL" : "DEGRADED (RISKS DETECTED)";

    return {
      circularRings: sccs,
      vulnerableBridges: bridges,
      healthStatus: health
    };
  }
}

const guardian = new EnterpriseTopologyGuardian();
guardian.registerDependency("OrderService", "InventoryService");
guardian.registerDependency("InventoryService", "PaymentService");
guardian.registerDependency("PaymentService", "OrderService");
guardian.registerDependency("OrderService", "NotificationGateway");
guardian.registerDependency("NotificationGateway", "SMSService");

const audit = guardian.auditTopology();
console.log("=== ENTERPRISE TOPOLOGY AUDIT REPORT ===");
console.log(`Detected Circular Rings: ${audit.circularRings.length}`);
audit.circularRings.forEach((ring, i) => console.log(`Ring ${i + 1}: [${ring.sort().join(" -> ")}]`));
console.log(`Vulnerable Transit Bridges: ${audit.vulnerableBridges.length}`);
audit.vulnerableBridges.forEach((b, i) => console.log(`Bridge ${i + 1}: ${b[0]} <-> ${b[1]}`));
console.log(`Architecture Status: ${audit.healthStatus}`);
