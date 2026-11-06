# scripts/topup_dist_day48_p4_p5.py

with open("scripts/create_dist_day48_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 4 topup
target_p4 = '"Notice how invalid payment 2 is aborted'
extra_p4 = '''    "To prevent data corruption during container restarts, modern stream processing runtimes (such as Kafka Streams and Flink) pair transactional producing with Local State Store Checkpointing. In addition to emitting output records to destination topics, stateful aggregations maintain local RocksDB state stores. The runtime creates local RocksDB snapshots synchronized with the exact commit control marker offset. If a container restarts, it recovers both its remote topic offsets and its local RocksDB state to the exact same millisecond, achieving complete stateful Exactly-Once Processing across complex streaming topologies.",
    "Notice how invalid payment 2 is aborted'''

content = content.replace(target_p4, extra_p4)

# Part 5 topup
target_p5 = '"Notice how the production telemetry confirms 1,000,000 messages'
extra_p5 = '''    "From an enterprise regulatory compliance perspective, our exactly-once architecture fulfills the strictest financial accounting mandates (such as Sarbanes-Oxley SOX compliance and Basel III auditability). Because every financial transaction is irrevocably bound to an immutable commit log with cryptographic sequence verification, auditors can reconstruct the exact state of global ledgers at any historical second, verifying that not a single penny was created or lost due to software failures.",
    "Notice how the production telemetry confirms 1,000,000 messages'''

content = content.replace(target_p5, extra_p5)

with open("scripts/create_dist_day48_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 4 and Part 5 of Day 48!")
