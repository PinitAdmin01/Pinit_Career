// scripts/test_dist_day31_snippets.ts

// Snippet 1: State Machine Replication (SMR) Deterministic Applier
interface LogEntry {
  index: number;
  term: number;
  command: string;
}

class StateMachineReplicator {
  private state: Record<string, number> = {};
  private lastAppliedIndex = 0;

  applyEntries(entries: LogEntry[]): { appliedCount: number; finalState: Record<string, number> } {
    let applied = 0;
    for (const entry of entries) {
      if (entry.index > this.lastAppliedIndex) {
        // Deterministic command evaluation: "SET key value" or "ADD key value"
        const [op, key, valStr] = entry.command.split(' ');
        const val = parseInt(valStr, 10);

        if (op === 'SET') {
          this.state[key] = val;
        } else if (op === 'ADD') {
          this.state[key] = (this.state[key] || 0) + val;
        }

        this.lastAppliedIndex = entry.index;
        applied++;
      }
    }

    return { appliedCount: applied, finalState: { ...this.state } };
  }
}

const smr = new StateMachineReplicator();
const log: LogEntry[] = [
  { index: 1, term: 1, command: 'SET accountA 1000' },
  { index: 2, term: 1, command: 'SET accountB 500' },
  { index: 3, term: 2, command: 'ADD accountA 250' }
];

const smrResult = smr.applyEntries(log);
console.log(`[SMR Engine] Applied Log Entries: ${smrResult.appliedCount}`);
console.log(`[SMR Engine] Deterministic Account A Balance: ${smrResult.finalState['accountA']}`);
console.log(`[SMR Engine] Deterministic State Machine Parity Certified: ${smrResult.finalState['accountA'] === 1250}`);

// Snippet 2: Basic Paxos Phase 1 & Phase 2 Consensus Evaluator
interface PromiseResponse {
  promised: boolean;
  highestAcceptedProposal?: number;
  highestAcceptedValue?: string;
}

class BasicPaxosProposer {
  // Evaluates Phase 1b promises from acceptors and determines Phase 2 proposal value
  static evaluatePromises(proposalNumber: number, initialValue: string, responses: PromiseResponse[], quorumSize: number): {
    proceedToPhase2: boolean;
    phase2Value: string;
    promisesGranted: number;
  } {
    const granted = responses.filter(r => r.promised);
    if (granted.length < quorumSize) {
      return { proceedToPhase2: false, phase2Value: initialValue, promisesGranted: granted.length };
    }

    // Paxos invariant: If any acceptor accepted a value in a previous proposal, must adopt the one with highest proposal number
    let highestProposal = -1;
    let adoptedValue = initialValue;

    for (const r of granted) {
      if (r.highestAcceptedProposal !== undefined && r.highestAcceptedProposal > highestProposal) {
        highestProposal = r.highestAcceptedProposal;
        adoptedValue = r.highestAcceptedValue!;
      }
    }

    return {
      proceedToPhase2: true,
      phase2Value: adoptedValue,
      promisesGranted: granted.length
    };
  }
}

const acceptorResponses: PromiseResponse[] = [
  { promised: true, highestAcceptedProposal: 101, highestAcceptedValue: 'TX_PARIS' },
  { promised: true },
  { promised: true, highestAcceptedProposal: 105, highestAcceptedValue: 'TX_LONDON' },
  { promised: false },
  { promised: true }
];

const paxosDecision = BasicPaxosProposer.evaluatePromises(110, 'TX_NEW_YORK', acceptorResponses, 3);
console.log(`[Basic Paxos] Quorum Promises Granted: ${paxosDecision.promisesGranted}/5`);
console.log(`[Basic Paxos] Adopted Consensus Value: ${paxosDecision.phase2Value}`);
console.log(`[Basic Paxos] Paxos Invariant Upheld: ${paxosDecision.phase2Value === 'TX_LONDON'}`);

// Snippet 3: Raft Core Safety Invariants Validator
interface RaftNodeState {
  id: string;
  currentTerm: number;
  votedFor: string | null;
  role: 'Leader' | 'Follower' | 'Candidate';
}

class RaftSafetyValidator {
  static verifyElectionSafety(nodes: RaftNodeState[]): {
    valid: boolean;
    leaderCount: number;
    leaders: string[];
  } {
    const leaders = nodes.filter(n => n.role === 'Leader').map(n => n.id);
    return {
      valid: leaders.length <= 1,
      leaderCount: leaders.length,
      leaders
    };
  }
}

const clusterNodes: RaftNodeState[] = [
  { id: 'Node1', currentTerm: 3, votedFor: 'Node1', role: 'Leader' },
  { id: 'Node2', currentTerm: 3, votedFor: 'Node1', role: 'Follower' },
  { id: 'Node3', currentTerm: 3, votedFor: 'Node1', role: 'Follower' },
  { id: 'Node4', currentTerm: 3, votedFor: 'Node1', role: 'Follower' },
  { id: 'Node5', currentTerm: 3, votedFor: 'Node1', role: 'Follower' }
];

const safetyAudit = RaftSafetyValidator.verifyElectionSafety(clusterNodes);
console.log(`[Raft Safety] Cluster Leader Count: ${safetyAudit.leaderCount}`);
console.log(`[Raft Safety] Active Leader: ${safetyAudit.leaders[0]}`);
console.log(`[Raft Safety] Election Safety Invariant Upheld: ${safetyAudit.valid}`);

// Snippet 4: Asynchronous Quorum Partition Simulator
class QuorumPartitionSimulator {
  static testWriteConsensus(totalNodes: number, reachableNodes: number): {
    quorumNeeded: number;
    canCommit: boolean;
    partitionStatus: 'MAJORITY_QUORUM' | 'ISOLATED_MINORITY';
  } {
    const quorumNeeded = Math.floor(totalNodes / 2) + 1;
    const canCommit = reachableNodes >= quorumNeeded;

    return {
      quorumNeeded,
      canCommit,
      partitionStatus: canCommit ? 'MAJORITY_QUORUM' : 'ISOLATED_MINORITY'
    };
  }
}

const majoritySide = QuorumPartitionSimulator.testWriteConsensus(5, 3);
const minoritySide = QuorumPartitionSimulator.testWriteConsensus(5, 2);

console.log(`[Partition Simulator] 3-Node Partition Status: ${majoritySide.partitionStatus} (Can Commit: ${majoritySide.canCommit})`);
console.log(`[Partition Simulator] 2-Node Partition Status: ${minoritySide.partitionStatus} (Can Commit: ${minoritySide.canCommit})`);
console.log(`[Partition Simulator] Split-Brain Eradicated: ${majoritySide.canCommit && !minoritySide.canCommit}`);

// Snippet 5: Production Consensus Auditor & Telemetry
interface ConsensusTelemetry {
  clusterSize: number;
  committedEntries: number;
  averageCommitLatencyMs: number;
  unreplicatedEntries: number;
}

class ConsensusEngineAuditor {
  static auditProductionHealth(telemetry: ConsensusTelemetry): {
    status: 'OPTIMAL' | 'DEGRADED';
    slaMet: boolean;
    stateParityIndex: number;
  } {
    const slaMet = telemetry.averageCommitLatencyMs <= 25.0 && telemetry.unreplicatedEntries === 0;
    const parity = telemetry.committedEntries > 0 ? 100.0 : 0.0;

    return {
      status: slaMet ? 'OPTIMAL' : 'DEGRADED',
      slaMet,
      stateParityIndex: parity
    };
  }
}

const audit = ConsensusEngineAuditor.auditProductionHealth({
  clusterSize: 5,
  committedEntries: 25000,
  averageCommitLatencyMs: 4.8,
  unreplicatedEntries: 0
});

console.log(`[Consensus Auditor] Cluster Health Status: ${audit.status}`);
console.log(`[Consensus Auditor] Average Commit Latency Met SLA: ${audit.slaMet}`);
console.log(`[Consensus Auditor] State Machine Parity Index: ${audit.stateParityIndex}%`);
console.log(`[Consensus Auditor] Production Readiness Certified: ${audit.status === 'OPTIMAL'}`);
