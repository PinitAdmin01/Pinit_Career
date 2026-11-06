# scripts/topup_dist_day46.py

with open("scripts/create_dist_day46_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 2 addition
p2_target = '"Notice how publishing for user:101 routes deterministically'
p2_extra = '''    "To prevent hot-partition skew when certain keys experience viral popularity (such as a celebrity social media account or flash sale product), advanced streaming architectures implement Salted Hashing or Key Randomization. If an application detects that a single key accounts for thirty percent of total topic ingress, it appends a bounded pseudo-random salt (e.g., `user:101#salt1` through `user:101#salt4`). This fans out the hot key writes across four distinct partitions, preventing a single broker disk controller from becoming a cluster-wide throughput bottleneck.",
    "Furthermore, modern brokers utilize Segment File Rollover within each partition. Instead of maintaining a single monolithic fifty-gigabyte file on disk, each partition is subdivided into one-gigabyte Segment Files accompanied by sparse offset and timestamp index files. When an active segment reaches its size or age threshold, the broker rolls over to a new active segment and closes the previous one, allowing background garbage collection threads to cleanly purge or compact expired historical data without locking active write pipelines.",
    "Notice how publishing for user:101 routes deterministically'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how the leader appends two records, advancing its LEO to 2'
p3_extra = '''    "To handle catastrophic datacenter splits and prevent the split-brain crisis where two isolated nodes both claim to be partition leaders, distributed brokers integrate with a distributed metadata quorum (such as Apache ZooKeeper or Kafka Raft KRaft metadata mode). The metadata controller maintains epoch numbers (Leader Epoch) attached to every partition state change. If an isolated partition leader attempts to accept writes after a network partition, follower nodes inspect the leader epoch and immediately reject the stale leader, preventing catastrophic divergent log branches.",
    "Additionally, brokers enforce the Min In-Sync Replicas (`min.insync.replicas`) configuration. If a partition is configured with a replication factor of 3 and `min.insync.replicas=2`, a producer writing with `acks=all` will receive an error if two out of the three replicas crash, refusing to accept un-replicated writes and prioritizing strict data safety over partial availability.",
    "Notice how the leader appends two records, advancing its LEO to 2'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how the legacy path incurs 4 context switches'
p4_extra = '''    "From a hardware network topology perspective, modern distributed brokers pair zero-copy data transfer with Network Interface Card (NIC) Scatter-Gather Direct Memory Access. With scatter-gather DMA, the network adapter reads multiple non-contiguous memory pages (such as protocol headers stored in kernel buffers and message payloads stored in OS page cache) in a single hardware transaction without requiring contiguous physical memory allocation.",
    "This zero-copy synergy extends directly to file system caching: because Linux manages the page cache dynamically across all available server RAM, a broker process can run with a modest four-gigabyte JVM or process heap while utilizing one hundred twenty-eight gigabytes of server RAM as high-speed kernel page cache. This architectural separation completely immunizes the broker from Java garbage collection pause freezes and out-of-memory container crashes.",
    "Notice how the legacy path incurs 4 context switches'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production telemetry confirms 2,500,000 messages'
p5_extra = '''    "To certify enterprise disaster recovery preparedness, our production validation suite executes simulated broker kill-9 terminations during sustained 2.5-million message stress streams. When a leader broker is abruptly killed, the surviving in-sync follower detects the missing heartbeat within three seconds, advances its state to leader via KRaft metadata consensus, and resumes servicing client traffic with zero message loss and zero committed offset regressions.",
    "This deterministic fault recovery validates the mathematical rigor of the High Watermark protocol. By strictly separating uncommitted data from consumer visibility and anchoring consensus in append-only storage, modern distributed streaming engines achieve the ultimate trifecta of distributed systems engineering: massive horizontal scalability, sub-millisecond latency, and unshakeable durability.",
    "Notice how the production telemetry confirms 2,500,000 messages'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day46_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Day 46 data script!")
