# scripts/test_day59_snippets.py
import subprocess

s1 = """interface RFCProposal {
  id: string;
  title: string;
  author: string;
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  approvals: Set<string>;
}

class RFCGovernanceEngine {
  private rfcs = new Map<string, RFCProposal>();

  submitRFC(id: string, title: string, author: string): void {
    this.rfcs.set(id, { id, title, author, status: "DRAFT", approvals: new Set() });
  }

  transitionToReview(id: string): void {
    const rfc = this.rfcs.get(id);
    if (rfc) rfc.status = "IN_REVIEW";
  }

  vote(id: string, reviewer: string, approve: boolean): string {
    const rfc = this.rfcs.get(id);
    if (!rfc) return `RFC ${id} not found`;
    if (approve) rfc.approvals.add(reviewer);
    if (rfc.approvals.size >= 2) {
      rfc.status = "APPROVED";
      return `[RFC Governance] RFC ${id} APPROVED with ${rfc.approvals.size} signatures`;
    }
    return `[RFC Governance] RFC ${id} IN_REVIEW (Approvals: ${rfc.approvals.size}/2)`;
  }
}

const gov = new RFCGovernanceEngine();
gov.submitRFC("RFC-042", "Migrate to Modular Monorepo", "principal_lead");
gov.transitionToReview("RFC-042");
console.log(gov.vote("RFC-042", "staff_arch_1", true));
console.log(gov.vote("RFC-042", "vp_engineering", true));"""
exp1 = """[RFC Governance] RFC RFC-042 IN_REVIEW (Approvals: 1/2)
[RFC Governance] RFC RFC-042 APPROVED with 2 signatures"""

s2 = """interface ArchitectureOption {
  name: string;
  developerVelocity: number;
  operationalComplexity: number;
  infrastructureCost: number;
}

class DecisionScoringMatrix {
  static evaluate(option: ArchitectureOption): number {
    return (option.developerVelocity * 2) - option.operationalComplexity - option.infrastructureCost;
  }
}

const monolith: ArchitectureOption = { name: "Modular Monolith", developerVelocity: 9, operationalComplexity: 3, infrastructureCost: 2 };
const microservices: ArchitectureOption = { name: "25 Microservices", developerVelocity: 5, operationalComplexity: 9, infrastructureCost: 8 };

console.log(`[Score Matrix] ${monolith.name} Score: ${DecisionScoringMatrix.evaluate(monolith)}`);
console.log(`[Score Matrix] ${microservices.name} Score: ${DecisionScoringMatrix.evaluate(microservices)}`);"""
exp2 = """[Score Matrix] Modular Monolith Score: 13
[Score Matrix] 25 Microservices Score: -7"""

s3 = """class DependencyGraph {
  private adjacency = new Map<string, string[]>();

  addNode(name: string, deps: string[] = []): void {
    this.adjacency.set(name, deps);
  }

  getExecutionOrder(): string[] {
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (node: string) => {
      if (visited.has(node)) return;
      visited.add(node);
      for (const dep of this.adjacency.get(node) || []) {
        visit(dep);
      }
      order.push(node);
    };

    for (const node of this.adjacency.keys()) visit(node);
    return order;
  }
}

const graph = new DependencyGraph();
graph.addNode("web-client", ["ui-kit", "api-client"]);
graph.addNode("api-client", ["types"]);
graph.addNode("ui-kit", ["types"]);
graph.addNode("types", []);

const buildOrder = graph.getExecutionOrder();
console.log(`[Monorepo Graph] Topological Build Order: ${buildOrder.join(" -> ")}`);"""
exp3 = """[Monorepo Graph] Topological Build Order: types -> ui-kit -> api-client -> web-client"""

s4 = """interface LatencyAllocation {
  edgeCdnMs: number;
  apiGatewayMs: number;
  businessLogicMs: number;
  databaseMs: number;
}

class SystemLatencyBudget {
  static calculateTotalP99(budget: LatencyAllocation): number {
    return budget.edgeCdnMs + budget.apiGatewayMs + budget.businessLogicMs + budget.databaseMs;
  }
}

const budget: LatencyAllocation = {
  edgeCdnMs: 15,
  apiGatewayMs: 10,
  businessLogicMs: 25,
  databaseMs: 30,
};

const totalP99 = SystemLatencyBudget.calculateTotalP99(budget);
console.log(`[Latency Budget] Subsystem P99 Total: ${totalP99}ms`);
console.log(`[Latency Budget] Compliant with < 100ms SLA: ${totalP99 < 100}`);"""
exp4 = """[Latency Budget] Subsystem P99 Total: 80ms
[Latency Budget] Compliant with < 100ms SLA: true"""

s5 = """interface MigrationMilestone {
  phase: number;
  name: string;
  trafficPercentage: number;
  rollbackTriggerP99Ms: number;
}

class MigrationGuardSentinel {
  static evaluatePhaseGate(milestone: MigrationMilestone, measuredP99Ms: number): string {
    if (measuredP99Ms > milestone.rollbackTriggerP99Ms) {
      return `[Migration Guard] Phase ${milestone.phase} (${milestone.name}): ROLLBACK TRIGGERED! Measured P99 ${measuredP99Ms}ms > ${milestone.rollbackTriggerP99Ms}ms`;
    }
    return `[Migration Guard] Phase ${milestone.phase} (${milestone.name}): PASS (Traffic: ${milestone.trafficPercentage}%, P99: ${measuredP99Ms}ms)`;
  }
}

const phase1: MigrationMilestone = { phase: 1, name: "Canary 10%", trafficPercentage: 10, rollbackTriggerP99Ms: 150 };
console.log(MigrationGuardSentinel.evaluatePhaseGate(phase1, 85));
console.log(MigrationGuardSentinel.evaluatePhaseGate(phase1, 190));"""
exp5 = """[Migration Guard] Phase 1 (Canary 10%): PASS (Traffic: 10%, P99: 85ms)
[Migration Guard] Phase 1 (Canary 10%): ROLLBACK TRIGGERED! Measured P99 190ms > 150ms"""

for idx, (code, exp) in enumerate([(s1, exp1), (s2, exp2), (s3, exp3), (s4, exp4), (s5, exp5)]):
    with open('tmp_test.ts', 'w', encoding='utf-8') as f:
        f.write(code.strip())
    res = subprocess.run(['npx', 'tsx', 'tmp_test.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = 'PASS' if act == exp.strip() else f'FAIL\nExp:\n{exp}\nAct:\n{act}'
    print(f'Snippet {idx+1}: {status}')
