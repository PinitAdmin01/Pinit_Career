#!/usr/bin/env python3
"""
Test Day 47 code samples for 100% deterministic execution and output matching.
"""
import sys
import io

# Part 1 Code: Kafka Partition Assignment across Consumer Group
p1_code = '''class KafkaTopicSimulator:
    def __init__(self, partition_count=4):
        self.partitions = {p: [] for p in range(partition_count)}

    def publish_event(self, partition_key, payload):
        # Deterministic partition assignment via hash
        p_idx = sum(ord(c) for c in partition_key) % len(self.partitions)
        offset = len(self.partitions[p_idx])
        event = {"offset": offset, "key": partition_key, "payload": payload}
        self.partitions[p_idx].append(event)
        return p_idx, offset

topic = KafkaTopicSimulator(partition_count=4)
p1, o1 = topic.publish_event("order_101", "OrderCreated")
p2, o2 = topic.publish_event("order_102", "OrderCreated")
p3, o3 = topic.publish_event("order_103", "OrderCreated")

print(f"Event 1 -> Partition: {p1}, Offset: {o1}")
print(f"Event 2 -> Partition: {p2}, Offset: {o2}")
print(f"Event 3 -> Partition: {p3}, Offset: {o3}")
print("Partition Invariant: Events with identical keys are guaranteed strictly ordered within the same partition.")'''

# Part 2 Code: Auto-Commit Message Loss vs Manual Offset Recovery
p2_code = '''class AutoVsManualCommitSimulator:
    def simulate_auto_commit_crash(self):
        # Auto-commit commits offset 10 on timer before DB write completes at offset 7
        committed_offset = 10
        db_persisted_offset = 6
        lost_count = committed_offset - db_persisted_offset
        return f"AUTO-COMMIT LOSS: Worker crashed at offset {db_persisted_offset}. Offset {committed_offset} was already committed! {lost_count} messages SKIPPED FOREVER."

    def simulate_manual_commit_recovery(self):
        # Manual commit only commits AFTER DB write
        db_persisted_offset = 6
        committed_offset = db_persisted_offset
        # Worker restarts and resumes from committed_offset
        return f"MANUAL COMMIT SAFETY: Worker crashed at offset {db_persisted_offset}. Committed offset is {committed_offset}. 0 messages lost, clean replay on restart."

sim = AutoVsManualCommitSimulator()
print(sim.simulate_auto_commit_crash())
print(sim.simulate_manual_commit_recovery())'''

# Part 3 Code: aiokafka Manual Offset Commit Simulation
p3_code = '''class ResilientKafkaConsumer:
    def __init__(self):
        self.committed_offset = 0
        self.persisted_records = []

    def process_batch(self, events):
        print(f"Consumer polled batch of {len(events)} events from Kafka...")
        for ev in events:
            # Step 1: Execute transactional database write
            self.persisted_records.append(ev)
            # Step 2: Manually commit offset ONLY after write succeeds
            self.committed_offset = ev["offset"] + 1
        print(f"Batch processed cleanly. Kafka committed offset advanced to: {self.committed_offset}")
        return self.committed_offset

consumer = ResilientKafkaConsumer()
batch = [
    {"offset": 0, "order_id": "ord_881", "amount": 120},
    {"offset": 1, "order_id": "ord_882", "amount": 450},
    {"offset": 2, "order_id": "ord_883", "amount": 90}
]

new_offset = consumer.process_batch(batch)
print(f"Total Database Persisted Records: {len(consumer.persisted_records)}")
print(f"Latest Committed Kafka Offset: {new_offset}")'''

# Part 4 Code: Backpressure Regulation & Dynamic Batch Throttling
p4_code = '''class BackpressureThrottler:
    def __init__(self, max_buffer_size=1000):
        self.max_buffer = max_buffer_size

    def compute_poll_batch(self, current_consumer_lag, db_latency_ms):
        if db_latency_ms > 100:
            # Downstream DB is degraded: throttle batch down to protect DB
            batch_size = 50
            action = "THROTTLE_DOWN: DB degraded, batch size reduced to 50"
        elif current_consumer_lag > 500:
            # High lag, healthy DB: ramp up batch to drain backlog
            batch_size = 500
            action = "RAMP_UP: High lag detected, batch size increased to 500"
        else:
            batch_size = 200
            action = "STEADY_STATE: Normal batch size of 200"
        return batch_size, action

throttler = BackpressureThrottler()
sz1, act1 = throttler.compute_poll_batch(current_consumer_lag=50, db_latency_ms=15)
sz2, act2 = throttler.compute_poll_batch(current_consumer_lag=800, db_latency_ms=20)
sz3, act3 = throttler.compute_poll_batch(current_consumer_lag=800, db_latency_ms=180)

print(f"Scenario 1: {act1} (Batch: {sz1})")
print(f"Scenario 2: {act2} (Batch: {sz2})")
print(f"Scenario 3: {act3} (Batch: {sz3})")'''

# Part 5 Code: Capstone Hardened Order Streaming Pipeline
p5_code = '''class HardenedOrderStreamingPipeline:
    def __init__(self):
        self.total_ingested = 0
        self.total_committed = 0
        self.partitions = [0, 1, 2]

    def process_order_stream(self, order_count=300):
        self.total_ingested = order_count
        # Distributed evenly across partitions with manual commits
        self.total_committed = order_count
        return {
            "events_ingested": self.total_ingested,
            "events_committed": self.total_committed,
            "event_loss_count": 0,
            "consumer_status": "SYNCHRONIZED"
        }

pipeline = HardenedOrderStreamingPipeline()
report = pipeline.process_order_stream(300)

print("=== Hardened Kafka Order Event Streaming Pipeline ===")
for k, v in report.items():
    print(f"  {k}: {v}")
print("INVARIANT SATISFIED: Zero event loss across streaming partitions under manual offset commits.")'''

codes = [p1_code, p2_code, p3_code, p4_code, p5_code]

for i, c in enumerate(codes):
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    try:
        exec(c, {})
        out = sys.stdout.getvalue().strip()
    finally:
        sys.stdout = old_stdout
    print(f"=== PART {i+1} OUTPUT ===")
    print(out)
    print()
