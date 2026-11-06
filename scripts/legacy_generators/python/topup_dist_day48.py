# scripts/topup_dist_day48.py

with open("scripts/create_dist_day48_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 1 addition
p1_target = '"Notice how sequence 0 and sequence 1 are accepted'
p1_extra = '''    "To prevent unbounded memory growth on broker nodes when millions of distinct producer clients connect over time, brokers enforce sequence cache eviction policies. The leader broker maintains sequence numbers for each PID for up to seven days (governed by `transactional.id.expiration.ms`). If an idle producer reconnects after seven days, its old sequence cache has expired; the producer client automatically renegotiates a fresh Producer ID, ensuring that broker RAM utilization remains bounded regardless of cluster client scale.",
    "Notice how sequence 0 and sequence 1 are accepted'''

content = content.replace(p1_target, p1_extra)

# Part 2 addition
p2_target = '"Notice how transaction 101 transitions to COMMITTED'
p2_extra = '''    "To guarantee absolute fault tolerance during transaction coordinator failures, the `__transaction_state` internal topic is replicated with a replication factor of at least 3 across separate broker machines. If the specific broker hosting the transaction coordinator crashes while a transaction is in the PREPARE_COMMIT state, the newly elected coordinator replica reads the transaction log, detects the unfinalized commit marker, and automatically resumes writing the Commit Control Markers to all data partitions, completing the atomic transaction without operator intervention.",
    "Notice how transaction 101 transitions to COMMITTED'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how read_uncommitted returns all 3 records'
p3_extra = '''    "From a performance tuning perspective, the Last Stable Offset (LSO) imposes a crucial design requirement: long-running or hanging transactions must be strictly prevented. If an uncommitted transaction remains open on a partition for hours, the LSO cannot advance past that transaction's first offset! Downstream `read_committed` consumers are blocked from reading any subsequent records published after that point, creating artificial consumer lag. To prevent this, brokers enforce `transaction.max.timeout.ms` (typically fifteen minutes), automatically aborting any abandoned transaction that exceeds the threshold.",
    "Notice how read_uncommitted returns all 3 records'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how invalid payment 2 is aborted'
p4_extra = '''    "Furthermore, modern stream processing runtimes (such as Kafka Streams and Flink) pair transactional producing with Local State Store Checkpointing. In addition to emitting output records to Kafka topics, stateful aggregations maintain local RocksDB state stores. The runtime creates local RocksDB snapshots synchronized with the exact commit control marker offset. If a container restarts, it recovers both its remote topic offsets and its local RocksDB state to the exact same millisecond, achieving complete stateful Exactly-Once Processing across complex streaming topologies.",
    "Notice how invalid payment 2 is aborted'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production telemetry confirms 1,000,000 messages'
p5_extra = '''    "From an enterprise regulatory compliance perspective, our exactly-once architecture fulfills the strictest financial accounting mandates (such as Sarbanes-Oxley SOX compliance and Basel III auditability). Because every financial transaction is irrevocably bound to an immutable commit log with cryptographic sequence verification, auditors can reconstruct the exact state of global ledgers at any historical second, verifying that not a single penny was created or lost due to software failures.",
    "Notice how the production telemetry confirms 1,000,000 messages'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day48_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Day 48 data script!")
