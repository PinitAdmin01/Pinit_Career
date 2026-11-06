# scripts/topup_dist_day31.py
import re

extra = {
    3: [
        "To understand how Raft preserves log consistency without complex recovery phases, we must examine the induction mechanism of the Log Matching Invariant. Raft enforces this invariant through a simple consistency check in every AppendEntries RPC. When the leader sends an AppendEntries request, it includes the index and term of the entry immediately preceding the new entries (prevLogIndex and prevLogTerm). If the follower does not find a matching entry in its local log with that exact index and term, it immediately rejects the RPC! The leader then decrements nextIndex for that follower and retries until a common ancestor entry is found, at which point any conflicting uncommitted follower entries are overwritten by the leader's authoritative log.",
        "Furthermore, Raft achieves extreme architectural simplicity by reducing the entire cluster communication protocol to just two Remote Procedure Calls (RPCs): RequestVote (invoked by candidates during elections to gather votes) and AppendEntries (invoked by the leader to replicate log entries and periodically broadcast as heartbeats to maintain leadership). By consolidating log replication, heartbeat monitoring, and log consistency checks into a single unified RPC, Raft eliminates dozens of edge-case states that plague Multi-Paxos implementations."
    ],
    4: [
        "In production cloud environments, network partitions are frequently asymmetric: Node A can send packets to Node B, but Node B cannot send packets back to Node A; or a partitioned node can hear from the cluster but cannot broadcast. If a severed node repeatedly times out, increments its term, and broadcasts RequestVote RPCs, it could cause disruptive term inflation. When the partition heals, the severed node returns with a massive term number, forcing the healthy cluster leader to instantly step down into follower state, needlessly disrupting active client traffic!",
        "To solve this edge case, modern production Raft implementations (including etcd and HashiCorp Consul) incorporate The Pre-Vote Protocol Extension. Before a follower increments its currentTerm and transitions to Candidate, it first enters a Pre-Candidate phase. It broadcasts a speculative PreVote request to peers: 'If I were to call an election, would you vote for me?' Only if a majority quorum responds affirmatively (confirming that the current leader has indeed lapsed) does the node increment its term and trigger a real election. This prevents disconnected zombie nodes from causing spurious leader changes."
    ],
    5: [
        "In enterprise distributed databases, the true physical bottleneck of consensus commit latency is not CPU processing or in-memory serialization; it is Physical Disk I/O. When a leader appends an entry to its log, safety invariants demand that the entry be flushed to non-volatile storage (via fdatasync or O_SYNC) before the leader sends AppendEntries RPCs. If the disk write only lived in volatile operating system page cache, a simultaneous power failure across the data center could erase uncommitted entries, violating the Leader Completeness invariant.",
        "To achieve tens of thousands of commits per second despite disk write latencies, production Raft engines deploy Dynamic Request Batching and Pipeline Amortization. Instead of executing an independent fsync and network round-trip for every single client command, the leader groups hundreds of concurrent write requests arriving within a microsecond window into a single contiguous disk write and a single batched AppendEntries RPC. This amortizes the fixed cost of disk synchronization across thousands of transactions.",
        "Finally, what gives engineers absolute confidence in Raft is its Formal Mathematical Verification. Diego Ongaro verified the complete Raft consensus specification using TLA+ (Temporal Logic of Actions), a formal mathematical modeling language invented by Leslie Lamport. Model checkers exhaustively explored billions of concurrent execution interleavings—including arbitrary network delays, message duplications, and cascading node crashes—proving that Raft's safety invariants hold true under all possible circumstances."
    ]
}

with open('scripts/create_dist_day31_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
current_part = 1
for line in lines:
    if line.strip().startswith('say_p'):
        m = re.match(r'say_p(\d)', line.strip())
        if m:
            current_part = int(m.group(1))
    if 'In the TypeScript snippet below' in line and current_part in extra:
        for p in extra[current_part]:
            new_lines.append(f'    "{p}",\n')
        del extra[current_part]
    new_lines.append(line)

with open('scripts/create_dist_day31_data.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated create_dist_day31_data.py with all extras!")
