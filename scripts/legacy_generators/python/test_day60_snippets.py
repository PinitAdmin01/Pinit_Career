import subprocess

s1 = """interface EdgeRoutingDecision {
  geoRegion: string;
  targetOrigin: string;
  cacheControl: string;
  streamP99BudgetMs: number;
}

class EdgeMeshRouter {
  static routeRequest(countryCode: string): EdgeRoutingDecision {
    if (countryCode === "EU") {
      return { geoRegion: "eu-central", targetOrigin: "origin-eu.apexcommerce.internal", cacheControl: "s-maxage=60, stale-while-revalidate=300", streamP99BudgetMs: 25 };
    }
    return { geoRegion: "us-east", targetOrigin: "origin-us.apexcommerce.internal", cacheControl: "s-maxage=60, stale-while-revalidate=300", streamP99BudgetMs: 20 };
  }
}

const euDecision = EdgeMeshRouter.routeRequest("EU");
const usDecision = EdgeMeshRouter.routeRequest("US");
console.log(`[Edge Mesh] EU Origin: ${euDecision.targetOrigin} (Budget: ${euDecision.streamP99BudgetMs}ms)`);
console.log(`[Edge Mesh] US Origin: ${usDecision.targetOrigin} (Budget: ${usDecision.streamP99BudgetMs}ms)`);"""
exp1 = """[Edge Mesh] EU Origin: origin-eu.apexcommerce.internal (Budget: 25ms)
[Edge Mesh] US Origin: origin-us.apexcommerce.internal (Budget: 20ms)"""

s2 = """interface LedgerAccount {
  tenantId: string;
  sku: string;
  availableStock: number;
  reservedStock: number;
}

class DistributedLedgerManager {
  static executeAtomicReservation(account: LedgerAccount, quantity: number): { success: boolean; balanceRemaining: number } {
    if (account.availableStock >= quantity) {
      account.availableStock -= quantity;
      account.reservedStock += quantity;
      return { success: true, balanceRemaining: account.availableStock };
    }
    return { success: false, balanceRemaining: account.availableStock };
  }
}

const tenantLedger: LedgerAccount = { tenantId: "tenant_alpha_88", sku: "TITAN-GPU-9000", availableStock: 15, reservedStock: 0 };
const tx1 = DistributedLedgerManager.executeAtomicReservation(tenantLedger, 5);
const tx2 = DistributedLedgerManager.executeAtomicReservation(tenantLedger, 12);

console.log(`[Ledger] TX1 Success: ${tx1.success}, Stock Remaining: ${tx1.balanceRemaining}`);
console.log(`[Ledger] TX2 Success: ${tx2.success}, Stock Remaining: ${tx2.balanceRemaining}`);"""
exp2 = """[Ledger] TX1 Success: true, Stock Remaining: 10
[Ledger] TX2 Success: false, Stock Remaining: 10"""

s3 = """interface OutboxMessage {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: string;
  published: boolean;
}

class TransactionalOutboxRelay {
  private messages: OutboxMessage[] = [];

  enqueue(aggregateId: string, eventType: string, payload: string): OutboxMessage {
    const msg: OutboxMessage = { id: `msg_${this.messages.length + 1}`, aggregateId, eventType, payload, published: false };
    this.messages.push(msg);
    return msg;
  }

  processPending(publisher: (msg: OutboxMessage) => boolean): number {
    let processed = 0;
    for (const msg of this.messages) {
      if (!msg.published && publisher(msg)) {
        msg.published = true;
        processed++;
      }
    }
    return processed;
  }
}

const relay = new TransactionalOutboxRelay();
relay.enqueue("ORD-9842", "OrderCreated", "{ total: 499 }");
relay.enqueue("ORD-9843", "OrderPaid", "{ txId: 'tx_stripe_01' }");

const publishedCount = relay.processPending((m) => true);
console.log(`[Outbox Relay] Published ${publishedCount} pending event(s) to message bus`);"""
exp3 = """[Outbox Relay] Published 2 pending event(s) to message bus"""

s4 = """interface CRDTNode {
  id: string;
  char: string;
  clock: number;
  deleted: boolean;
}

class SequenceCRDTCompactor {
  static compactDocument(nodes: CRDTNode[], maxRetainedClock: number): { liveText: string; purgedTombstones: number } {
    const liveNodes = nodes.filter(n => !n.deleted);
    const purgedCount = nodes.filter(n => n.deleted && n.clock < maxRetainedClock).length;
    return {
      liveText: liveNodes.map(n => n.char).join(""),
      purgedTombstones: purgedCount
    };
  }
}

const docNodes: CRDTNode[] = [
  { id: "n1", char: "A", clock: 10, deleted: false },
  { id: "n2", char: "P", clock: 12, deleted: false },
  { id: "n3", char: "X", clock: 15, deleted: true },
  { id: "n4", char: "E", clock: 18, deleted: false },
  { id: "n5", char: "X", clock: 20, deleted: false }
];

const result = SequenceCRDTCompactor.compactDocument(docNodes, 16);
console.log(`[CRDT Compactor] Live Content: "${result.liveText}", Purged Tombstones: ${result.purgedTombstones}`);"""
exp4 = """[CRDT Compactor] Live Content: "APEX", Purged Tombstones: 1"""

s5 = """interface VivaGateEvaluation {
  gateNumber: number;
  domain: string;
  passed: boolean;
  telemetrySummary: string;
}

class GrandMasterVivaEvaluationMatrix {
  static evaluatePlatform(evaluations: VivaGateEvaluation[]): { status: "CERTIFIED" | "DEFICIENT"; summary: string } {
    const allPassed = evaluations.every(e => e.passed);
    return {
      status: allPassed ? "CERTIFIED" : "DEFICIENT",
      summary: `Evaluated ${evaluations.length}/5 Enterprise Viva Gates. Status: ${allPassed ? "FULL CERTIFICATION" : "AUDIT REMEDIATION"}`
    };
  }
}

const gates: VivaGateEvaluation[] = [
  { gateNumber: 1, domain: "Edge Streaming SSR & Routing Mesh", passed: true, telemetrySummary: "p99 18ms < 25ms" },
  { gateNumber: 2, domain: "PostgreSQL Multi-Tenant Ledger RLS", passed: true, telemetrySummary: "Zero cross-tenant leaks" },
  { gateNumber: 3, domain: "Transactional Outbox & Job Engine", passed: true, telemetrySummary: "100% at-least-once delivery" },
  { gateNumber: 4, domain: "Decentralized CRDT State Compaction", passed: true, telemetrySummary: "Zero divergence across nodes" },
  { gateNumber: 5, domain: "Zero-Downtime Canary Sentinel Matrix", passed: true, telemetrySummary: "Autonomous rollback verified" }
];

const certification = GrandMasterVivaEvaluationMatrix.evaluatePlatform(gates);
console.log(`[Viva Matrix] Enterprise Platform Status: ${certification.status}`);
console.log(`[Viva Matrix] ${certification.summary}`);"""
exp5 = """[Viva Matrix] Enterprise Platform Status: CERTIFIED
[Viva Matrix] Evaluated 5/5 Enterprise Viva Gates. Status: FULL CERTIFICATION"""

for idx, (code, exp) in enumerate([(s1, exp1), (s2, exp2), (s3, exp3), (s4, exp4), (s5, exp5)]):
    with open('tmp_test_day60.ts', 'w', encoding='utf-8') as f:
        f.write(code.strip())
    res = subprocess.run(['npx', 'tsx', 'tmp_test_day60.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = 'PASS' if act == exp.strip() else f'FAIL\nExp:\n{exp}\nAct:\n{act}'
    print(f'Day 60 Snippet {idx+1}: {status}')
