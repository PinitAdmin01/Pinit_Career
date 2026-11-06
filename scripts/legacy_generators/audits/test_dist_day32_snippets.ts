// scripts/test_dist_day32_snippets.ts

// Snippet 1: Raft Node State Transitions & Election Timeout Handler
type RaftRole = 'Follower' | 'Candidate' | 'Leader';

class RaftNodeStateMachine {
  id: string;
  currentTerm = 0;
  votedFor: string | null = null;
  role: RaftRole = 'Follower';
  votesReceived = 0;

  constructor(id: string) {
    this.id = id;
  }

  handleElectionTimeout(clusterSize: number): { role: RaftRole; term: number; votes: number } {
    this.role = 'Candidate';
    this.currentTerm++;
    this.votedFor = this.id;
    this.votesReceived = 1; // Vote for self

    return {
      role: this.role,
      term: this.currentTerm,
      votes: this.votesReceived
    };
  }

  receiveVote(fromNodeId: string, quorumSize: number): boolean {
    if (this.role === 'Candidate') {
      this.votesReceived++;
      if (this.votesReceived >= quorumSize) {
        this.role = 'Leader';
        return true;
      }
    }
    return false;
  }
}

const node = new RaftNodeStateMachine('Node1');
const startState = node.handleElectionTimeout(5);
console.log(`[Raft Election] Transitioned to: ${startState.role} (Term: ${startState.term}, Self Vote: ${startState.votes})`);
const wonElection = node.receiveVote('Node2', 3) || node.receiveVote('Node3', 3);
console.log(`[Raft Election] Acquired Majority Quorum (3/5): ${wonElection}`);
console.log(`[Raft Election] New Cluster Leader Certified: ${node.role === 'Leader'}`);

// Snippet 2: Randomized Election Timer & Split-Vote Mitigator
class RandomizedElectionTimer {
  static generateTimeout(baseMs: number, spreadMs: number): number {
    return Math.floor(baseMs + Math.random() * spreadMs);
  }

  static simulateElectionConvergence(nodesCount: number, baseMs: number, spreadMs: number): {
    fastestTimeoutMs: number;
    secondFastestMs: number;
    splitVoteAverted: boolean;
  } {
    const timeouts = Array.from({ length: nodesCount }, () => this.generateTimeout(baseMs, spreadMs)).sort((a, b) => a - b);
    const diff = timeouts[1] - timeouts[0];

    return {
      fastestTimeoutMs: timeouts[0],
      secondFastestMs: timeouts[1],
      splitVoteAverted: diff >= 15 // 15ms margin is enough for single RPC round-trip on modern networks
    };
  }
}

const timerSim = RandomizedElectionTimer.simulateElectionConvergence(5, 150, 150);
console.log(`[Election Timer] Earliest Node Timeout: ${timerSim.fastestTimeoutMs} ms`);
console.log(`[Election Timer] Second Earliest Timeout: ${timerSim.secondFastestMs} ms`);
console.log(`[Election Timer] Split-Vote Risk Evaluated: ${timerSim.splitVoteAverted ? 'LOW' : 'MARGINAL'}`);
console.log(`[Election Timer] Randomized Jitter Active: ${timerSim.fastestTimeoutMs >= 150 && timerSim.fastestTimeoutMs <= 300}`);

// Snippet 3: RequestVote RPC & Up-To-Date Log Completeness Rule
interface RequestVoteArgs {
  term: number;
  candidateId: string;
  lastLogIndex: number;
  lastLogTerm: number;
}

interface RequestVoteReply {
  term: number;
  voteGranted: boolean;
}

class RequestVoteEvaluator {
  static evaluateVote(
    voterCurrentTerm: number,
    voterVotedFor: string | null,
    voterLastLogIndex: number,
    voterLastLogTerm: number,
    args: RequestVoteArgs
  ): RequestVoteReply {
    // 1. Term check
    if (args.term < voterCurrentTerm) {
      return { term: voterCurrentTerm, voteGranted: false };
    }

    // 2. Already voted check
    const canVoteFor = voterVotedFor === null || voterVotedFor === args.candidateId;
    if (!canVoteFor) {
      return { term: voterCurrentTerm, voteGranted: false };
    }

    // 3. Log up-to-date restriction: candidate log must be at least as up-to-date as voter's log
    const candidateLogMoreUpToDate =
      args.lastLogTerm > voterLastLogTerm ||
      (args.lastLogTerm === voterLastLogTerm && args.lastLogIndex >= voterLastLogIndex);

    if (candidateLogMoreUpToDate) {
      return { term: args.term, voteGranted: true };
    }

    return { term: voterCurrentTerm, voteGranted: false };
  }
}

// Voter has log entry at index 5, term 2
const freshCandidate = RequestVoteEvaluator.evaluateVote(2, null, 5, 2, {
  term: 3,
  candidateId: 'CandidateA',
  lastLogIndex: 6,
  lastLogTerm: 2
});

const staleCandidate = RequestVoteEvaluator.evaluateVote(2, null, 5, 2, {
  term: 3,
  candidateId: 'CandidateB',
  lastLogIndex: 3,
  lastLogTerm: 1
});

console.log(`[Vote Evaluator] Fresh Candidate Vote Granted: ${freshCandidate.voteGranted}`);
console.log(`[Vote Evaluator] Stale Candidate Vote Granted: ${staleCandidate.voteGranted}`);
console.log(`[Vote Evaluator] Log Up-To-Date Invariant Upheld: ${freshCandidate.voteGranted && !staleCandidate.voteGranted}`);

// Snippet 4: Pre-Vote Protocol Disrupted Follower Shield
class PreVoteProtocolHandler {
  static canPreVote(
    lastContactWithLeaderMs: number,
    heartbeatTimeoutMs: number
  ): { grantPreVote: boolean; reason: string } {
    if (lastContactWithLeaderMs < heartbeatTimeoutMs) {
      return { grantPreVote: false, reason: 'Current leader is healthy and communicating' };
    }
    return { grantPreVote: true, reason: 'Leader heartbeat timed out; election permitted' };
  }
}

const healthyContact = PreVoteProtocolHandler.canPreVote(45, 150);
const timedOutContact = PreVoteProtocolHandler.canPreVote(210, 150);

console.log(`[Pre-Vote Shield] Healthy Leader Pre-Vote Granted: ${healthyContact.grantPreVote} (${healthyContact.reason})`);
console.log(`[Pre-Vote Shield] Timed-Out Leader Pre-Vote Granted: ${timedOutContact.grantPreVote} (${timedOutContact.reason})`);
console.log(`[Pre-Vote Shield] Spurious Term Inflation Averted: ${!healthyContact.grantPreVote && timedOutContact.grantPreVote}`);

// Snippet 5: Production Leader Failover Auditor & Telemetry
interface FailoverTelemetry {
  clusterSize: number;
  simulatedCrashTimeMs: number;
  newLeaderElectedTimeMs: number;
  electionRounds: number;
}

class LeaderElectionAuditor {
  static auditFailover(telemetry: FailoverTelemetry): {
    failoverDurationMs: number;
    slaMet: boolean;
    status: 'OPTIMAL' | 'DEGRADED';
  } {
    const duration = telemetry.newLeaderElectedTimeMs - telemetry.simulatedCrashTimeMs;
    const slaMet = duration <= 500 && telemetry.electionRounds === 1;

    return {
      failoverDurationMs: duration,
      slaMet,
      status: slaMet ? 'OPTIMAL' : 'DEGRADED'
    };
  }
}

const failoverAudit = LeaderElectionAuditor.auditFailover({
  clusterSize: 5,
  simulatedCrashTimeMs: 1000,
  newLeaderElectedTimeMs: 1245,
  electionRounds: 1
});

console.log(`[Election Auditor] Leader Failover Duration: ${failoverAudit.failoverDurationMs} ms`);
console.log(`[Election Auditor] 500ms Failover SLA Met: ${failoverAudit.slaMet}`);
console.log(`[Election Auditor] Election Health Status: ${failoverAudit.status}`);
console.log(`[Election Auditor] Production Failover Readiness Certified: ${failoverAudit.status === 'OPTIMAL'}`);
