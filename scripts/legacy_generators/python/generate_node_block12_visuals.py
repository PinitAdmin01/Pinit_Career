import json, hashlib, os

def compute_code_hash(code_str):
    return hashlib.sha256(code_str.encode('utf-8')).hexdigest()

def make_flow_spec(title, node_ids_labels, edges_tuples, captions):
    nodes = [{"id": nid, "label": nlbl, "sub": "Active Stage", "status": "ok"} for nid, nlbl in node_ids_labels]
    edges = [{"from": f, "to": t, "label": l} for f, t, l in edges_tuples]
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        vals = {nid: {"status": "Processing" if i == 1 else ("Committed" if i == 2 else "Online")} for nid, _ in node_ids_labels}
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": vals
        })
    return {
        "template": "flow",
        "title": title,
        "nodes": nodes,
        "edges": edges,
        "steps": steps
    }

def make_compare_spec(title, left_title, left_points, right_title, right_points, captions):
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": {
                "activeSide": "both" if i >= 2 else ("left" if i == 0 else "right")
            }
        })
    return {
        "template": "compare",
        "title": title,
        "left": {
            "title": left_title,
            "points": left_points
        },
        "right": {
            "title": right_title,
            "points": right_points
        },
        "steps": steps
    }

def make_boxes_spec(title, box_items, captions):
    items = [{"id": b[0], "title": b[1], "desc": b[2], "status": "ok"} for b in box_items]
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        vals = {b[0]: {"status": "Inspecting" if i == 0 else "Synchronized"} for b in box_items}
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": vals
        })
    return {
        "template": "boxes",
        "title": title,
        "items": items,
        "steps": steps
    }

def make_states_spec(title, states_list, transitions_list, captions):
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        active_idx = min(i, len(states_list) - 1)
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": {
                "activeState": states_list[active_idx]["id"]
            }
        })
    return {
        "template": "states",
        "title": title,
        "states": states_list,
        "transitions": transitions_list,
        "steps": steps
    }

# Day 56 Visual Specs (Kafka)
day56_specs = [
    make_flow_spec(
        "Kafka Distributed Partition Streaming Architecture",
        [("producer", "Kafka Producer"), ("broker", "Broker Cluster"), ("p0", "Partition 0"), ("p1", "Partition 1"), ("consumer", "Consumer Group")],
        [("producer", "broker", "Batch Send (linger.ms=5)"), ("broker", "p0", "Hash Key Routing"), ("broker", "p1", "Round-Robin Routing"), ("p0", "consumer", "At-Least-Once Pull"), ("p1", "consumer", "At-Least-Once Pull")],
        [
            "Producers batch messages with Snappy compression before network dispatch.",
            "Kafka brokers append records to immutable commit logs across partitions.",
            "Consumer groups pull messages in parallel with partition assignment.",
            "Offloaded partition streams scale horizontally across distributed brokers."
        ]
    ),
    make_compare_spec(
        "Kafka Producer Semantics: acks=0 vs acks=all",
        "Fire-and-Forget (acks=0)",
        ["Zero network round-trip wait", "Maximum write throughput", "High message loss risk on broker crash", "Suitable only for non-critical telemetry"],
        "Idempotent Durability (acks=all)",
        ["Waits for all in-sync replicas (ISR)", "Strict zero message loss guarantee", "Enables idempotent producer PID/sequence", "Enterprise standard for financial transactions"],
        [
            "acks=0 fires packets into socket buffer without acknowledgment.",
            "acks=all waits for complete ISR quorum disk commits.",
            "Idempotent producers prevent duplicate records on retry.",
            "Critical transaction pipelines mandate acks=all and min.insync.replicas=2."
        ]
    ),
    make_boxes_spec(
        "Kafka Consumer Group Partition Rebalance Protocols",
        [
            ("eager", "Eager Rebalance Protocol", "Revokes all partitions from all consumers during rebalance, causing total stop-the-world pauses."),
            ("cooperative", "Cooperative Sticky Protocol", "Revokes only migrated partitions incrementally, allowing continuous processing on unaffected partitions."),
            ("heartbeat", "Heartbeat & Liveness Thread", "Maintains session leases with group coordinator independently of message processing event loop."),
            ("offsets", "Committed Offset Checkpoints", "Persists consumer position in __consumer_offsets topic with manual synchronous or asynchronous commits.")
        ],
        [
            "Eager protocol halts entire consumer fleet during partition rebalancing.",
            "Cooperative sticky assignor isolates partition shifts without fleet stoppage.",
            "Background heartbeat thread prevents premature member evictions.",
            "Committed offsets provide strict resume checkpoints upon failure."
        ]
    ),
    make_states_spec(
        "Consumer Rebalance Listener Lifecycle & Offset Commit States",
        [
            {"id": "processing", "label": "Active Message Processing"},
            {"id": "revoking", "label": "Partitions Revoking"},
            {"id": "committing", "label": "Flushing Offset Checkpoint"},
            {"id": "assigned", "label": "Partitions Assigned & Resumed"}
        ],
        [
            {"from": "processing", "to": "revoking", "label": "Rebalance Triggered"},
            {"from": "revoking", "to": "committing", "label": "onPartitionsRevoked"},
            {"from": "committing", "to": "assigned", "label": "onPartitionsAssigned"},
            {"from": "assigned", "to": "processing", "label": "Resume Poll Loop"}
        ],
        [
            "Consumer actively polls and processes records from assigned partitions.",
            "Coordinator signals rebalance; listener intercepts partition revocation.",
            "Consumer synchronously commits offsets and flushes pending writes to disk.",
            "New partition assignments received; consumer seeks to committed offsets."
        ]
    ),
    make_flow_spec(
        "End-to-End Kafka Streaming Pipeline SLA Verification",
        [("ingress", "Event Ingress"), ("producer", "Idempotent Producer"), ("broker", "Kafka Cluster"), ("consumer", "Cooperative Consumer"), ("audit", "SLA Certifier")],
        [("ingress", "producer", "Validated Event Payload"), ("producer", "broker", "Deterministic Partition Write"), ("broker", "consumer", "Cooperative Stream Pull"), ("consumer", "audit", "Processed Batch Checkpoint"), ("audit", "ingress", "Grade A+ Certification")],
        [
            "Ingress records arrive with monotonic sequence numbers.",
            "Idempotent producer dispatches batches across partition keys.",
            "Cooperative consumer streams records without stop-the-world pauses.",
            "Verification harness certifies zero message loss and Grade A+ throughput."
        ]
    )
]

# Day 57 Visual Specs (Outbox & CQRS)
day57_specs = [
    make_flow_spec(
        "The Transactional Outbox Pattern: Atomic Local Transactions",
        [("app", "Node.js Service"), ("tx", "Local ACID Transaction"), ("orders", "Orders Table"), ("outbox", "Outbox Table"), ("cdc", "CDC Relay")],
        [("app", "tx", "BEGIN Transaction"), ("tx", "orders", "INSERT INTO orders"), ("tx", "outbox", "INSERT INTO outbox"), ("tx", "app", "COMMIT"), ("outbox", "cdc", "FOR UPDATE SKIP LOCKED Poll")],
        [
            "Application opens a single local ACID transaction in PostgreSQL.",
            "Order entity and outbox event are inserted atomically in same transaction.",
            "Database write-ahead log guarantees atomic commit or rollback.",
            "Asynchronous relay safely harvests uncommitted outbox events."
        ]
    ),
    make_compare_spec(
        "Dual-Write Anti-Pattern vs Transactional Outbox",
        "Naive Dual-Write Anti-Pattern",
        ["Commit DB then publish to Kafka", "Network drop causes lost events", "Publish first causes phantom events", "Violates distributed atomicity"],
        "Transactional Outbox Architecture",
        ["Atomic commit of DB entity + outbox event", "Zero distributed 2PC locking", "CDC or SKIP LOCKED relay guarantees delivery", "Guarantees At-Least-Once event publishing"],
        [
            "Dual-writes suffer from network timeouts and partial failure splits.",
            "Transactional outbox unifies state mutation and event staging in one ACID unit.",
            "Background relay decouples messaging latency from user HTTP response.",
            "Downstream systems receive guaranteed At-Least-Once event streams."
        ]
    ),
    make_boxes_spec(
        "Event Sourcing Engine: Append-Only Event Store Architecture",
        [
            ("events", "Immutable Event Stream", "Append-only log recording every domain fact with monotonic sequence numbers."),
            ("aggregate", "Aggregate Rehydration", "Reconstructs current state in memory by replaying historical events from genesis."),
            ("snapshot", "Periodic Snapshots", "Compressed state checkpoints taken every N events to optimize rehydration latency."),
            ("optimistic", "Optimistic Concurrency", "Expected version checks prevent concurrent write conflicts and event corruption.")
        ],
        [
            "Domain events are persisted as immutable chronological records.",
            "Aggregates rehydrate state deterministically by replaying event logs.",
            "Snapshots truncate event replay time for high-velocity aggregates.",
            "Version guards ensure single-writer consistency across distributed nodes."
        ]
    ),
    make_flow_spec(
        "Command Query Responsibility Segregation (CQRS) Data Flow",
        [("command", "Write Command"), ("eventStore", "Event Store (Write)"), ("kafka", "Kafka Event Bus"), ("projector", "Async Projector"), ("readModel", "Denormalized View (Read)")],
        [("command", "eventStore", "Append Domain Event"), ("eventStore", "kafka", "Publish Event Stream"), ("kafka", "projector", "Consume Event Batch"), ("projector", "readModel", "Update Query Materialization"), ("readModel", "command", "Sub-Millisecond Read Serving")],
        [
            "Commands append immutable events directly to write-side event store.",
            "Domain events are published asynchronously to Kafka event streams.",
            "Read projectors consume events and build optimized read materializations.",
            "Queries hit denormalized views directly with zero table join overhead."
        ]
    ),
    make_flow_spec(
        "Production Outbox & CQRS Pipeline SLA Verification",
        [("harness", "SLA Test Harness"), ("outbox", "Outbox ACID Staging"), ("cdc", "CDC Relay Engine"), ("projector", "CQRS Projector"), ("audit", "Grade A+ Certifier")],
        [("harness", "outbox", "Atomic Dual-Insert"), ("outbox", "cdc", "Harvest Staged Records"), ("cdc", "projector", "Stream to Read Projector"), ("projector", "audit", "Verify Projection State"), ("audit", "harness", "Grade A+ Outbox & CQRS Certified")],
        [
            "Harness stages orders and outbox records in atomic ACID transactions.",
            "CDC relay harvests uncommitted records and dispatches to stream.",
            "Read projector materializes denormalized customer views.",
            "Verification harness validates zero event loss and awards Grade A+."
        ]
    )
]

# Day 58 Visual Specs (Sagas)
day58_specs = [
    make_flow_spec(
        "Distributed Saga Pattern: Forward Transactions & Backward Compensation",
        [("order", "Order Service (T1)"), ("payment", "Payment Service (T2)"), ("inventory", "Inventory Service (T3)"), ("cPayment", "Compensate Payment (C2)"), ("cOrder", "Compensate Order (C1)")],
        [("order", "payment", "Step 1: Create Order -> Charge Payment"), ("payment", "inventory", "Step 2: Reserve Inventory"), ("inventory", "cPayment", "Step 3: Out of Stock! Trigger C2"), ("cPayment", "cOrder", "Refund Payment -> Cancel Order (C1)"), ("cOrder", "order", "Consistent Rollback Complete")],
        [
            "Forward transactions commit locally in each service without distributed locks.",
            "Inventory service encounters out-of-stock condition.",
            "Saga unwinds previously committed transactions in reverse LIFO order.",
            "Compensations restore consistent distributed business state without 2PC."
        ]
    ),
    make_compare_spec(
        "Saga Architectures: Choreography vs Orchestration",
        "Choreography (Decentralized Events)",
        ["Services coordinate autonomously via domain events", "No central point of failure coordinator", "Suffers from distributed spaghetti at scale", "Prone to cyclic deadlocks and poor observability"],
        "Orchestration (Central State Machine)",
        ["Central state machine commands participants", "Explicit end-to-end workflow visibility", "Participants remain decoupled from saga logic", "Straightforward state querying and timeout management"],
        [
            "Choreography works well for simple linear flows between 2 services.",
            "Orchestration centralizes workflow definitions in a single state machine.",
            "Orchestrators track timeouts, retries, and compensation stacks durably.",
            "Enterprise systems mandate orchestration for complex business workflows."
        ]
    ),
    make_states_spec(
        "Saga Orchestrator State Machine Transitions",
        [
            {"id": "initial", "label": "INITIAL"},
            {"id": "order_pending", "label": "ORDER_PENDING"},
            {"id": "payment_charged", "label": "PAYMENT_CHARGED"},
            {"id": "compensating", "label": "COMPENSATING (LIFO)"},
            {"id": "failed", "label": "FAILED (Symmetric State)"}
        ],
        [
            {"from": "initial", "to": "order_pending", "label": "Create Order"},
            {"from": "order_pending", "to": "payment_charged", "label": "Charge Card"},
            {"from": "payment_charged", "to": "compensating", "label": "Inventory Depleted"},
            {"from": "compensating", "to": "failed", "label": "Rollback Finished"}
        ],
        [
            "Orchestrator initiates saga and transitions to ORDER_PENDING.",
            "Payment charged successfully; orchestrator pushes compensation handler.",
            "Inventory allocation fails; orchestrator immediately triggers COMPENSATING.",
            "Compensation stack unwound in LIFO order; saga transitions to clean FAILED state."
        ]
    ),
    make_boxes_spec(
        "Idempotency Barriers & Failure Handling Mechanisms",
        [
            ("idempotencyKey", "Idempotency Key Cache", "Unique ${sagaId}:${step} key guarantees duplicate requests return cached results."),
            ("semanticFencing", "Semantic Fencing Epochs", "Rejects out-of-order stale commands on cancelled or completed entities."),
            ("exponentialBackoff", "Exponential Backoff & Jitter", "Prevents thundering herds during transient network and database retries."),
            ("deadLetterQueue", "Dead Letter Queue (DLQ)", "Isolates poison pill messages for manual operator inspection.")
        ],
        [
            "Idempotency keys prevent double-charging cards during network retries.",
            "Semantic fencing rejects delayed commands arriving after cancellation.",
            "Exponential jittered backoff spreads out retry pressure gracefully.",
            "Dead letter queues prevent poison pills from blocking message partitions."
        ]
    ),
    make_flow_spec(
        "Distributed Saga SLA Verification Harness",
        [("harness", "SLA Harness"), ("fsm", "State Machine Logger"), ("lifo", "LIFO Compensation Engine"), ("idempotency", "Idempotent Barrier"), ("cert", "Grade A+ Certifier")],
        [("harness", "fsm", "Evaluate State Transitions"), ("fsm", "lifo", "Verify Reverse Compensation"), ("lifo", "idempotency", "Test Duplicate Suppression"), ("idempotency", "cert", "Assert All SLAs"), ("cert", "harness", "Grade A+ Distributed Saga Certified")],
        [
            "Harness validates durable state machine transition logging.",
            "LIFO compensation engine unwinds committed steps symmetrically.",
            "Idempotency barrier suppresses duplicate retry requests.",
            "Certification harness awards Grade A+ for production saga consistency."
        ]
    )
]

# Day 59 Visual Specs (Redis Caching)
day59_specs = [
    make_flow_spec(
        "Redis Cluster 16384 Hash Slot Sharding & Hash Tags",
        [("client", "Node.js Client"), ("router", "CRC16 Hash Router"), ("nodeA", "Node A (Slots 0-5460)"), ("nodeB", "Node B (Slots 5461-10922)"), ("nodeC", "Node C (Slots 10923-16383)")],
        [("client", "router", "Key: '{user:991}.profile'"), ("router", "nodeB", "CRC16('user:991') -> Slot 8402"), ("client", "router", "Key: '{user:991}.orders'"), ("router", "nodeB", "CRC16('user:991') -> Slot 8402"), ("nodeB", "client", "Atomic Colocated Response")],
        [
            "Client routes keys through deterministic CRC16 slot calculation.",
            "Hash tags '{...}' isolate key hashing strictly to tagged substring.",
            "Related user profile and order keys land on identical master node.",
            "Colocation guarantees cross-key multi-operations execute without CROSSSLOT errors."
        ]
    ),
    make_compare_spec(
        "Cache-Aside Invalidation: Delete (DEL) vs Update",
        "Direct Cache Update Anti-Pattern",
        ["Updates cache key on every DB write", "Concurrent writes interleave unpredictably", "Older value overwrites newer value in cache", "Causes permanent silent data corruption"],
        "Cache-Aside Invalidation (DEL)",
        ["Deletes cache key on DB write", "Subsequent read forces fresh DB fetch", "Eliminates concurrent write races entirely", "Industry standard for relational cache consistency"],
        [
            "Updating cache directly causes race conditions under concurrent writes.",
            "Deleting cache keys forces authoritative refreshes from database.",
            "Cache-aside guarantees eventual consistency without desynchronization.",
            "Simple, robust invalidation eliminates silent data divergence permanently."
        ]
    ),
    make_flow_spec(
        "Cache Stampede (Thundering Herd) Mutex Protection",
        [("requests", "10,000 Concurrent Requests"), ("cache", "Redis Cache (Key Expired)"), ("mutex", "Distributed Mutex (SETNX)"), ("leader", "1 Leader Thread (DB Query)"), ("followers", "9,999 Follower Threads (Wait & Read)")],
        [("requests", "cache", "Simultaneous Cache Miss"), ("cache", "mutex", "Acquire Lock 'SET lock:key NX EX 5'"), ("mutex", "leader", "Lock Granted (Query PostgreSQL)"), ("mutex", "followers", "Lock Busy (Wait / Read Fresh Cache)"), ("leader", "cache", "Cache Populated & Lock Released")],
        [
            "Hot key expires in Redis while thousands of requests arrive.",
            "Distributed mutex (SETNX) allows only single leader thread through.",
            "Leader queries database and repopulates Redis cache entry.",
            "Followers share refreshed cache entry with zero database connection exhaustion."
        ]
    ),
    make_boxes_spec(
        "High-Throughput Write-Behind Pipeline Architecture",
        [
            ("buffer", "In-Memory Write Buffer", "Ingests user mutations in RAM in microseconds, returning instant 200 OK responses."),
            ("coalescer", "Batch Mutation Coalescer", "Collapses hundreds of increments on same entity into a single consolidated SQL update."),
            ("flush", "Timed / Sized Flush Engine", "Synchronizes coalesced batches to PostgreSQL at scheduled intervals or buffer thresholds."),
            ("durability", "Append-Only Stream Log", "Persists uncommitted write buffers to Redis Streams to prevent data loss on reboot.")
        ],
        [
            "Write mutations buffer in memory with sub-millisecond client acknowledgment.",
            "Batch coalescing collapses multiple increments into single SQL statements.",
            "Scheduled background flusher syncs coalesced updates to persistent disk.",
            "Write amplification slashed by over 75%, preserving database capacity."
        ]
    ),
    make_flow_spec(
        "Production Redis Caching SLA Verification Suite",
        [("harness", "SLA Harness"), ("sharding", "CRC16 Hash Slot Verifier"), ("invalidation", "Cache-Aside Invalidation Engine"), ("stampede", "Stampede Mutex Suppressor"), ("cert", "Grade A+ Certifier")],
        [("harness", "sharding", "Test Hash Tag Colocation"), ("sharding", "invalidation", "Verify Key Eviction on Write"), ("invalidation", "stampede", "Simulate 5x Concurrent Misses"), ("stampede", "cert", "Check Write Coalescing Ratio"), ("cert", "harness", "Grade A+ Caching SLA Certified")],
        [
            "Harness validates deterministic hash tag slot colocation in Redis Cluster.",
            "Cache-aside invalidation verified with zero stale read anomalies.",
            "Stampede mutex successfully collapses concurrent misses to single query.",
            "Write-behind coalescing reduces database writes by over 60%, awarding Grade A+."
        ]
    )
]

# Day 60 Visual Specs (Milestone 10 Capstone)
day60_specs = [
    make_flow_spec(
        "Milestone 10 Unified Event-Driven Microservices Hub Topology",
        [("gateway", "API Gateway Ingress"), ("orderService", "Order Service (Outbox CDC)"), ("kafka", "Kafka Event Streaming Hub"), ("saga", "Saga Orchestrator (FSM)"), ("redis", "Redis Cluster & Write-Behind")],
        [("gateway", "orderService", "Ingress Order Request"), ("orderService", "kafka", "Atomic CDC Outbox Event Stream"), ("kafka", "saga", "Trigger Distributed Checkout Saga"), ("saga", "redis", "Colocated Cache & Buffer Queries"), ("redis", "gateway", "Sub-Millisecond Read Projections")],
        [
            "API gateway receives customer orders and routes to Order Service.",
            "Order Service commits order and outbox atomically, streaming to Kafka.",
            "Saga Orchestrator drives multi-service fulfillment with LIFO compensations.",
            "Redis Cluster and write-behind pipelines deliver sub-millisecond throughput."
        ]
    ),
    make_flow_spec(
        "Transactional Outbox & Partitioned Kafka Event Streaming",
        [("orderTx", "PostgreSQL Local ACID Tx"), ("outbox", "Outbox Table (UUIDv7)"), ("cdc", "Debezium CDC Engine"), ("p0", "Kafka Partition 0 (cust_88)"), ("p1", "Kafka Partition 1 (cust_89)")],
        [("orderTx", "outbox", "Atomic Commit in Same Tx"), ("outbox", "cdc", "Byte-Level WAL Capture"), ("cdc", "p0", "Key=cust_88 (Strict FIFO Order)"), ("cdc", "p1", "Key=cust_89 (Strict FIFO Order)"), ("p0", "orderTx", "At-Least-Once Delivery")],
        [
            "Local PostgreSQL transaction commits order and outbox records atomically.",
            "CDC engine reads Write-Ahead Log without polling query overhead.",
            "Deterministic partition keying preserves strict per-customer FIFO order.",
            "Downstream consumers scale horizontally across independent partitions."
        ]
    ),
    make_states_spec(
        "Milestone 10 Distributed Saga Orchestrator Lifecycle",
        [
            {"id": "initial", "label": "INITIAL"},
            {"id": "order_staged", "label": "ORDER_STAGED"},
            {"id": "payment_charged", "label": "PAYMENT_CHARGED"},
            {"id": "compensating", "label": "COMPENSATING (LIFO Stack)"},
            {"id": "failed", "label": "FAILED (Symmetric Rollback)"}
        ],
        [
            {"from": "initial", "to": "order_staged", "label": "OrderPlaced Event"},
            {"from": "order_staged", "to": "payment_charged", "label": "Charge Payment"},
            {"from": "payment_charged", "to": "compensating", "label": "Inventory Out-of-Stock"},
            {"from": "compensating", "to": "failed", "label": "Refund & Cancel Finished"}
        ],
        [
            "Orchestrator consumes OrderPlaced event and stages order transaction.",
            "Payment service charges customer and registers refund compensation handler.",
            "Inventory allocation fails; orchestrator transitions to COMPENSATING.",
            "Compensation stack unwinds in LIFO order, restoring consistent state."
        ]
    ),
    make_boxes_spec(
        "Milestone 10 High-Throughput Caching & Write-Behind Tier",
        [
            ("hashTags", "Redis Cluster Hash Tags", "Collocates '{user:88}.profile' and '{user:88}.orders' on same slot, eliminating CROSSSLOT errors."),
            ("stampedeMutex", "Thundering Herd Mutex", "SETNX lock ensures only one worker queries DB during hot cache expirations."),
            ("writeCoalescer", "Write-Behind Batch Coalescer", "Buffers high-frequency mutations in RAM and executes consolidated bulk SQL updates."),
            ("cacheAside", "Cache-Aside Invalidation", "Deletes cache keys on database updates to guarantee race-free eventual consistency.")
        ],
        [
            "Hash tags collocate related domain entities on identical Redis cluster nodes.",
            "Distributed mutex locks prevent thundering herds from crashing databases.",
            "Write-behind coalescer slashes database write amplification by over 75%.",
            "Cache-aside invalidation guarantees strict eventual consistency."
        ]
    ),
    make_flow_spec(
        "Milestone 10 Capstone End-to-End Enterprise Certification",
        [("harness", "Milestone 10 Harness"), ("outboxSla", "Pillar 1: Outbox & Kafka"), ("sagaSla", "Pillar 2: Saga & LIFO Rollback"), ("cachingSla", "Pillar 3: Redis & Write-Behind"), ("award", "Grade A+ Milestone 10 Capstone Certification")],
        [("harness", "outboxSla", "Validate CDC Atomicity"), ("outboxSla", "sagaSla", "Assert LIFO Compensation"), ("sagaSla", "cachingSla", "Test Stampede & Coalescing"), ("cachingSla", "award", "Confirm 5 Non-Negotiable SLAs"), ("award", "harness", "Grade A+ Enterprise Architecture Certified")],
        [
            "Harness validates atomic outbox staging and deterministic Kafka partitioning.",
            "Saga orchestrator confirms symmetric LIFO compensation and idempotency.",
            "Redis cluster testing validates slot colocation, stampede suppression, and batching.",
            "Final verification harness issues official Grade A+ Milestone 10 Capstone Certification."
        ]
    )
]

day_specs_map = {
    56: day56_specs,
    57: day57_specs,
    58: day58_specs,
    59: day59_specs,
    60: day60_specs
}

os.makedirs('src/lib/data/lessonVisuals/node-web', exist_ok=True)

for day_num in range(56, 61):
    with open(f'scripts/node_day{day_num}.json', 'r', encoding='utf-8') as f:
        day_data = json.load(f)

    entries = []
    specs = day_specs_map[day_num]
    for idx, part in enumerate(day_data['parts']):
        code_hash = compute_code_hash(part['code'])
        spec = specs[idx]
        entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": spec
        })

    visual_doc = {
        "schemaVersion": 2,
        "prefix": "node-web",
        "day": day_num,
        "promptSha": "node-web-b12-gate-v2-prompt-sha",
        "model": "manual-gate-v2-generator",
        "entries": entries
    }

    out_path = f'src/lib/data/lessonVisuals/node-web/day-{day_num}.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(visual_doc, f, indent=2, ensure_ascii=False)
    print(f"Generated {out_path} with 5 visual entries (schemaVersion: 2)")

print("\n>>> ALL BLOCK 12 VISUAL FILES GENERATED SUCCESSFULLY! <<<")
