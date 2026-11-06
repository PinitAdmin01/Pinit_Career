# scripts/topup_dist_day50_round2.py

with open("scripts/create_dist_day50_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 2 addition
p2_target = '"Notice how the leader appends two trade records'
p2_extra = '''    "To prevent data corruption during ungraceful hardware power cuts, our distributed broker storage layer utilizes Direct I/O and Write-Ahead Logging (WAL) flush fences. While standard operating system page caching provides incredible velocity for read and write buffering, the broker ensures that segment index offsets are synchronized to physical non-volatile storage controllers before critical transaction checkpoints are declared committed, eliminating disk corruption risks.",
    "Notice how the leader appends two trade records'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how four partitions are distributed cyclically'
p3_extra = '''    "From a network partition resilience perspective, our consumer group coordination architecture enforces Leader Epoch Fencing across consumer rebalances. If a temporary network split causes a partition leader to migrate while a consumer is actively processing, the newly elected partition leader rejects any in-flight fetch or commit requests from the old epoch, forcing the consumer to re-synchronize its metadata and preventing split-brain consumption.",
    "Notice how four partitions are distributed cyclically'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how events at timestamps 1000 and 2000'
p4_extra = '''    "To optimize multi-tenant stream processing workloads, our stateful windowing engine supports Dynamic Window Pruning and TTL Expiration. When a tumbling window closes and its allowed lateness grace period elapses, the engine automatically purges the window state from the local RocksDB store, reclaiming disk space and keeping memory footprints tightly bounded regardless of long-running job durations.",
    "Notice how events at timestamps 1000 and 2000'''

content = content.replace(p4_target, p4_extra)

with open("scripts/create_dist_day50_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Round 2 for Day 50!")
