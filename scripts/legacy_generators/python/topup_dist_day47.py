# scripts/topup_dist_day47.py

with open("scripts/create_dist_day47_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 1 addition
p1_target = '"Notice how joining member-1 establishes it as group leader'
p1_extra = '''    "To prevent premature rebalances during temporary network blips, the group coordinator relies on two independent heartbeat timers: `session.timeout.ms` and `heartbeat.interval.ms`. Consumers transmit periodic background heartbeat pings (typically every three seconds). If the coordinator fails to receive a heartbeat within the session timeout window (typically forty-five seconds), it concludes that the consumer pod has suffered an unrecoverable failure and triggers a group rebalance to reassign its partitions to surviving healthy members.",
    "Furthermore, consumers configure `max.poll.interval.ms` to monitor the application processing thread. If a consumer's background heartbeat thread is alive but its main event processing loop hangs for longer than five minutes (for example, blocked on a slow downstream third-party REST API call), the consumer actively sends a `LeaveGroup` notification, voluntarily relinquishing its partitions so that healthy consumer pods can step in and prevent catastrophic stream pipeline stalls.",
    "Notice how joining member-1 establishes it as group leader'''

content = content.replace(p1_target, p1_extra)

# Part 2 addition
p2_target = '"Notice how RangeAssignor maps partitions 0 and 1'
p2_extra = '''    "In addition to Range and Round-Robin assignors, modern streaming applications utilize Custom Partition Assignors for specialized domain constraints. For instance, in multi-tenant SaaS platforms, an enterprise might deploy a Tenant-Aware Assignor that groups partitions based on company security tier, ensuring that high-tier enterprise customer partitions run exclusively on dedicated high-memory worker pods while lower-tier trial accounts share commodity worker nodes.",
    "Notice how RangeAssignor maps partitions 0 and 1'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how only partition 2 is revoked and reassigned'
p3_extra = '''    "To support stateful stream processing engines (such as Kafka Streams, Apache Flink, or Spark Streaming), the Cooperative Sticky Assignor integrates with Static Group Membership (KIP-345). Under static membership, each consumer is provisioned with a persistent unique identifier (`group.instance.id`, typically tied to a Kubernetes StatefulSet ordinal pod name like `consumer-0`). When `consumer-0` restarts during a rolling container update, the broker coordinator does NOT trigger an immediate rebalance! Instead, it holds `consumer-0`\'s assigned partitions in reserve for up to sixty seconds.",
    "When `consumer-0` boots back up and rejoins with the same instance ID, the coordinator immediately restores its exact same partitions without triggering any rebalance whatsoever across the rest of the cluster! This completely eliminates partition churn during routine Kubernetes rolling upgrades.",
    "Notice how only partition 2 is revoked and reassigned'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how committing offset 1500 for topic orders'
p4_extra = '''    "From an operational reliability perspective, production streaming consumers implement a ConsumerRebalanceListener callback. The listener exposes two critical lifecycle hooks: `onPartitionsRevoked()` and `onPartitionsAssigned()`. When the cooperative rebalance coordinator signals that a specific partition is about to be migrated to another member, the client executes `onPartitionsRevoked()`, flushing in-memory write buffers and synchronously committing offsets for that specific partition before handing over ownership. This ensures that the incoming consumer starts from a perfectly synchronized checkpoint with zero duplicated messages.",
    "Notice how committing offset 1500 for topic orders'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production telemetry confirms 8 active consumers'
p5_extra = '''    "To prevent consumer group lag from degrading user experiences, enterprise organizations enforce Automated Lag Autoscaling via Kubernetes Event-driven Autoscaling (KEDA). KEDA continuously polls broker consumer lag metrics; when the aggregate lag across a topic partition exceeds a critical threshold (e.g., 10,000 unread records), KEDA automatically scales the consumer deployment from eight pods to sixteen pods. The Cooperative Sticky Assignor seamlessly incorporates the eight new pods in milliseconds, doubling consumption throughput and burning down the backlog without freezing existing workers.",
    "Notice how the production telemetry confirms 8 active consumers'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day47_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Day 47 data script!")
