# scripts/topup_dist_day49.py

with open("scripts/create_dist_day49_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 1 addition
p1_target = '"Notice how storing device metrics records changelog entries'
p1_extra = '''    "To prevent unbounded growth of changelog topics inside the broker cluster, stateful streaming runtimes configure Log Compaction (`cleanup.policy=compact`). Under log compaction, the broker does not delete messages based on retention time alone; instead, background cleaner threads periodically sweep the changelog topic, retaining only the single most recent value for each distinct key. If a sensor updates its temperature a million times over five months, log compaction preserves only the final temperature reading, ensuring that recovering state stores from scratch requires scanning only the active working set rather than millions of historical deltas.",
    "Furthermore, stateful stream processors implement Standby Replicas (such as Kafka Streams standby tasks). A standby replica runs on a separate worker node, continuously consuming the changelog topic in the background and populating a shadow RocksDB store. If the active processing task crashes, the standby replica is promoted to active immediately, achieving Warm Failover in milliseconds without waiting to download gigabytes of state over the network.",
    "Notice how storing device metrics records changelog entries'''

content = content.replace(p1_target, p1_extra)

# Part 2 addition
p2_target = '"Notice how timestamps 1000, 2500, and 3100'
p2_extra = '''    "In addition to fixed duration windows, production streaming systems implement Hopping Windows with variable hop intervals to track operational trends across financial markets and IoT telematics. For example, a financial fraud detection pipeline might configure a thirty-minute window hopping every ten seconds. At any given moment, one hundred eighty distinct overlapping windows are concurrently evaluated in memory. When a credit card tap occurs, the engine updates all one hundred eighty active window aggregates simultaneously in local RocksDB memory.",
    "To manage memory efficiently under heavy sliding workloads, industrial stream runtimes deploy Segmented Window Stores. A segmented store divides the continuous time horizon into discrete physical RocksDB segments (e.g., three one-hour segments covering a three-hour retention period). As time advances, expired segments are dropped at the operating system file level via simple file unlinks, completely eradicating expensive row-by-row point deletions and eliminating RocksDB write amplification.",
    "Notice how timestamps 1000, 2500, and 3100'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how an event at timestamp 5000'
p3_extra = '''    "From an algorithmic data structure perspective, dynamic session merging is executed using an Interval Tree or Disjoint-Set Union (Union-Find) forest. When a delayed event arrives with timestamp T, the session engine queries the interval tree for any existing session intervals intersecting `[T - gap, T + gap]`. If one intersecting session is found, its boundary is expanded. If two adjacent sessions are bridged by the new event, the engine invokes an atomic merge: it unifies the two session aggregates into a single merged session and purges the two redundant predecessor intervals.",
    "Session windowing is extraordinarily powerful in cybersecurity analysis: when an advanced persistent threat (APT) executes lateral movements across corporate networks, individual port scans and credential brute-force attempts may be separated by ten-minute pauses to evade basic rate limiters. A twenty-minute session window captures the entire multi-stage intrusion as a single unified attack sequence, enabling automated threat response systems to quarantine compromised host instances.",
    "Notice how an event at timestamp 5000'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how event 6000 is accepted as on-time'
p4_extra = '''    "What happens when an event arrives so late that its window has already closed and its result has already been emitted? Distributed stream engines provide an explicit mechanism known as Allowed Lateness (or Grace Period). Under allowed lateness, if a window closes at time 12:00, the engine retains the window's state in RocksDB for an additional configured grace period (e.g., ten minutes). If an event timestamped 11:58 arrives at 12:04, the engine updates the window aggregate and emits a Corrected Retraction / Revision event!",
    "If an event arrives after both the watermark and the allowed lateness grace period have expired, the event is permanently rejected. However, to prevent data loss, production topologies route these ultra-late records to a Dead Letter Queue or Side Output topic, where data engineers can audit network anomalies or trigger manual ledger adjustments.",
    "Notice how event 6000 is accepted as on-time'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production telemetry confirms 150,000 events'
p5_extra = '''    "To ensure high availability during catastrophic cloud datacenter outages, our production stream topology utilizes Cross-Region State Replication. Changelog topics are mirrored across independent cloud regions using cluster replication fabrics (such as MirrorMaker 2 or Confluent Cluster Linking). In the event of a regional datacenter power failure, standby stream worker pods in the secondary region attach to the replicated changelog topics, restoring multi-gigabyte state stores in under thirty seconds and resuming real-time analytics with zero data loss.",
    "Furthermore, our deployment undergoes continuous automated Chaos Engineering drills via Chaos Mesh. Throughout synthetic pod terminations, ten-percent network packet loss, and CPU throttling pauses, our embedded RocksDB state stores and event-time watermark generators demonstrate complete deterministic resilience: window calculations maintain zero divergence, consumer lag recovers automatically, and late events are quarantined cleanly.",
    "This triumph marks the culmination of advanced stream processing engineering. By uniting local state caches, temporal windowing math, dynamic session clustering, and event-time watermarks, you have constructed an industrial stream computation platform capable of powering the most demanding real-time analytics on Earth.",
    "Notice how the production telemetry confirms 150,000 events'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day49_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Day 49 data script!")
