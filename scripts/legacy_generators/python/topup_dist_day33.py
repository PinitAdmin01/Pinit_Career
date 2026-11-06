# scripts/topup_dist_day33.py
import re

extra = {
    1: [
        "In enterprise Raft implementations, high throughput relies on the strict architectural Decoupling of commitIndex and lastApplied. When a majority quorum confirms receipt of a log entry, the leader updates commitIndex immediately. However, applying that entry to the local State Machine (such as executing an SQL insert or mutating a B-Tree index) is performed asynchronously by a dedicated State Machine Worker Thread. The state machine worker continuously monitors commitIndex and advances lastApplied sequentially: while (lastApplied < commitIndex) { apply(log[++lastApplied]); }. This separation ensures that compute-heavy state machine mutations never stall the network replication event loop."
    ],
    2: [
        "To prevent multiple round-trip delays when recovering a severely lagged follower, production Raft engines implement The Fast-Recovery Optimization (detailed in Diego Ongaro's Stanford thesis). When a follower rejects an AppendEntries RPC due to a log conflict, it does not simply return false; it includes two diagnostic hints: conflictTerm (the term of the conflicting entry in the follower's log) and conflictIndex (the first index in the follower's log for that conflictTerm).",
        "Upon receiving these hints, the leader searches its own log for entries from conflictTerm. If the leader has no entries from conflictTerm, it immediately sets nextIndex for that follower to conflictIndex! If the leader does have entries from conflictTerm, it sets nextIndex to the index immediately following the last entry of that term in its log. This optimization bypasses hundreds or thousands of conflicting entries in a single network round-trip, bringing lagging followers back into sync almost instantaneously."
    ],
    4: [
        "To prevent state machine snapshotting from stalling active client transactions, production engines leverage Copy-on-Write (CoW) memory architectures. On operating systems like Linux, the database process can execute a lightweight fork() system call. The child process inherits a point-in-time snapshot of the entire state machine memory space via hardware-assisted virtual memory paging. While the parent process continues serving client reads and writes with zero interruption, the child background process serializes the frozen memory state to disk, terminating cleanly once the snapshot file is written.",
        "Furthermore, when a leader must transmit a massive multi-gigabyte snapshot to a newly provisioned or severely lagged follower, the transfer is executed via The InstallSnapshot RPC in fixed-size Chunks (typically 1 Megabyte to 4 Megabytes per chunk). Each chunk includes an offset, a byte payload, and a cryptographic SHA-256 hash. The follower verifies each chunk upon arrival, reconstructs the snapshot file on disk, and verifies the cumulative checksum before swapping its active state machine database. This chunked protocol guarantees that snapshot synchronization survives network interruptions and server restarts without corruption."
    ],
    5: [
        "Under sustained enterprise workloads, log replication performance is fundamentally constrained by disk persistence latency. When a leader appends client entries, it must execute a synchronous flush (via fsync or fdatasync) to ensure entries survive unexpected power outages. If the disk takes 2 milliseconds to complete each fsync, naively executing one transaction per disk flush would cap total cluster throughput at barely 500 transactions per second! Production Raft engines overcome this bottleneck through Group Commit and Pipelined AppendEntries.",
        "Under Group Commit, incoming client transactions arriving within a microsecond window are batched together. The leader flushes hundreds of commands to disk in a single contiguous I/O operation and broadcasts them in a single batched AppendEntries RPC. Concurrently, the leader does not wait for peer acknowledgments before sending the next batch; it pipelines AppendEntries messages over TCP connections, saturating available network bandwidth and unlocking sustained throughput exceeding 25,000 operations per second at sub-4ms commit latencies.",
        "Through continuous automated verification—injecting follower log conflicts, testing Figure 8 commit guards under leader churn, and evaluating snapshot compaction under heavy traffic—our Raft engine certifies unshakeable data integrity and 100% linearizable consistency."
    ]
}

with open('scripts/create_dist_day33_data.py', 'r', encoding='utf-8') as f:
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

with open('scripts/create_dist_day33_data.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated create_dist_day33_data.py with all extras!")
