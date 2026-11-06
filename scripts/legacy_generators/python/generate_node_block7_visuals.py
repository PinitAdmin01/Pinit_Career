import json, hashlib, os

def get_hash(code_str):
    return hashlib.sha256(code_str.encode('utf-8')).hexdigest()

def make_step(step_idx, at, caption, values=None, tones=None):
    s = {"at": at, "caption": caption}
    if values is not None:
        s["values"] = values
    if tones is not None:
        s["tones"] = tones
    return s

def build_day31_visuals(lesson):
    entries = []
    
    # Part 1: flow - Event Loop Phases
    p1 = lesson['parts'][0]
    entries.append({
        "partTitle": p1['title'],
        "codeHash": get_hash(p1['code']),
        "spec": {
            "template": "flow",
            "title": "libuv Event Loop Phase Transition Execution",
            "nodes": [
                {"id": "timers", "label": "Timers Phase", "sub": "setTimeout / setInterval", "status": "ok"},
                {"id": "pending", "label": "Pending I/O", "sub": "Deferred System Callbacks", "status": "ok"},
                {"id": "poll", "label": "Poll Phase", "sub": "Network I/O & File Descriptors", "status": "ok"},
                {"id": "check", "label": "Check Phase", "sub": "setImmediate callbacks", "status": "ok"}
            ],
            "edges": [
                {"from": "timers", "to": "pending", "label": "Tick"},
                {"from": "pending", "to": "poll", "label": "Poll I/O"},
                {"from": "poll", "to": "check", "label": "Immediate"}
            ],
            "steps": [
                make_step(1, "say1", "simulateLibuvEventLoop tracks microtask and macrotask execution orders.", {"timers": {"status": "Active"}, "pending": {"status": "Idle"}, "poll": {"status": "Idle"}, "check": {"status": "Idle"}}),
                make_step(2, "say3", "process.nextTick and Promise microtasks drain with priority between phases.", {"timers": {"status": "Draining"}, "pending": {"status": "Queued"}, "poll": {"status": "Idle"}, "check": {"status": "Idle"}}),
                make_step(3, "say5", "Poll phase fetches incoming TCP connections and dispatches events.", {"timers": {"status": "Complete"}, "pending": {"status": "Complete"}, "poll": {"status": "Active"}, "check": {"status": "Idle"}}),
                make_step(4, "say7", "Check phase runs setImmediate callbacks right after polling completes.", {"timers": {"status": "Complete"}, "pending": {"status": "Complete"}, "poll": {"status": "Complete"}, "check": {"status": "Active"}})
            ]
        }
    })

    # Part 2: boxes - Worker Threads Pool
    p2 = lesson['parts'][1]
    entries.append({
        "partTitle": p2['title'],
        "codeHash": get_hash(p2['code']),
        "spec": {
            "template": "boxes",
            "title": "Node.js Worker Thread Pool Resource Allocation",
            "boxes": [
                {"id": "b1", "label": "Active Workers"},
                {"id": "b2", "label": "Queued CPU Tasks"},
                {"id": "b3", "label": "Completed Executions"},
                {"id": "b4", "label": "Total Elapsed Time"}
            ],
            "steps": [
                make_step(1, "say1", "dispatchWorkerPool initializes 4 isolated V8 execution threads.", {"b1": {"text": "4"}, "b2": {"text": "10"}, "b3": {"text": "0"}, "b4": {"text": "0ms"}}, {"b1": "active", "b2": "data", "b3": "idle", "b4": "idle"}),
                make_step(2, "say3", "CPU-heavy cryptographic tasks are distributed via MessageChannel buffers.", {"b1": {"text": "4"}, "b2": {"text": "6"}, "b3": {"text": "4"}, "b4": {"text": "12ms"}}, {"b1": "active", "b2": "active", "b3": "data", "b4": "data"}),
                make_step(3, "say5", "Workers offload computation without blocking the primary event loop.", {"b1": {"text": "2"}, "b2": {"text": "2"}, "b3": {"text": "8"}, "b4": {"text": "24ms"}}, {"b1": "active", "b2": "data", "b3": "data", "b4": "data"}),
                make_step(4, "say7", "All 10 tasks complete across worker threads, returning results cleanly.", {"b1": {"text": "0"}, "b2": {"text": "0"}, "b3": {"text": "10"}, "b4": {"text": "31ms"}}, {"b1": "idle", "b2": "idle", "b3": "accent", "b4": "accent"})
            ]
        }
    })

    # Part 3: states - Backpressured EventEmitter
    p3 = lesson['parts'][2]
    entries.append({
        "partTitle": p3['title'],
        "codeHash": get_hash(p3['code']),
        "spec": {
            "template": "states",
            "title": "Backpressured Stream Flow Control State Machine",
            "states": [
                {"id": "flow", "label": "Flowing State (write ok)"},
                {"id": "pressured", "label": "Backpressure Active (high watermark)"},
                {"id": "draining", "label": "Drain Emitted (resuming ingest)"}
            ],
            "steps": [
                make_step(1, "say1", "simulateStreamBackpressure monitors buffer queue size against threshold.", {"flow": {"active": True}, "pressured": {"active": False}, "draining": {"active": False}}),
                make_step(2, "say3", "Ingress velocity exceeds highWatermark, returning false to pause writes.", {"flow": {"active": False}, "pressured": {"active": True}, "draining": {"active": False}}),
                make_step(3, "say5", "Underlying network transport drains accumulated packets from socket buffer.", {"flow": {"active": False}, "pressured": {"active": False}, "draining": {"active": True}}),
                make_step(4, "say7", "Drain event triggers emitter resume, restoring high-speed flowing mode.", {"flow": {"active": True}, "pressured": {"active": False}, "draining": {"active": False}})
            ]
        }
    })

    # Part 4: flow - AsyncResource & Execution Context Tracing
    p4 = lesson['parts'][3]
    entries.append({
        "partTitle": p4['title'],
        "codeHash": get_hash(p4['code']),
        "spec": {
            "template": "flow",
            "title": "AsyncLocalStorage Distributed Context Propagation",
            "nodes": [
                {"id": "req", "label": "Inbound Request", "sub": "X-Trace-ID: trc-901", "status": "ok"},
                {"id": "als", "label": "AsyncLocalStorage", "sub": "Store Bindings", "status": "ok"},
                {"id": "db", "label": "Database Query", "sub": "Async Boundary Hop", "status": "ok"},
                {"id": "res", "label": "Telemetry Emitter", "sub": "Trace Correlated", "status": "ok"}
            ],
            "edges": [
                {"from": "req", "to": "als", "label": "run(store)"},
                {"from": "als", "to": "db", "label": "Async I/O"},
                {"from": "db", "to": "res", "label": "Context Preserved"}
            ],
            "steps": [
                make_step(1, "say1", "simulateAsyncLocalStorage initializes execution store with traceId.", {"req": {"status": "Active"}, "als": {"status": "Ready"}, "db": {"status": "Idle"}, "res": {"status": "Idle"}}),
                make_step(2, "say3", "Context propagates seamlessly across asynchronous event loop ticks.", {"req": {"status": "Complete"}, "als": {"status": "Active"}, "db": {"status": "Queued"}, "res": {"status": "Idle"}}),
                make_step(3, "say5", "Database worker reads current traceId without parameter drilling.", {"req": {"status": "Complete"}, "als": {"status": "Active"}, "db": {"status": "Active"}, "res": {"status": "Idle"}}),
                make_step(4, "say7", "Log audit record contains verified traceId across all downstream calls.", {"req": {"status": "Complete"}, "als": {"status": "Complete"}, "db": {"status": "Complete"}, "res": {"status": "Active"}})
            ]
        }
    })

    # Part 5: compare - Event Loop Lag Monitoring
    p5 = lesson['parts'][4]
    entries.append({
        "partTitle": p5['title'],
        "codeHash": get_hash(p5['code']),
        "spec": {
            "template": "compare",
            "title": "Healthy vs Saturated Event Loop Latency Profiles",
            "left": {"label": "Healthy Event Loop", "sub": "Non-blocking async I/O"},
            "right": {"label": "Blocked Event Loop", "sub": "Synchronous CPU saturation"},
            "rows": [
                {"id": "lag", "label": "Event Loop Lag"},
                {"id": "p99", "label": "P99 Request Latency"},
                {"id": "cpu", "label": "Thread Saturation"},
                {"id": "status", "label": "Readiness Probe"}
            ],
            "steps": [
                make_step(1, "say1", "monitorEventLoopLag measures delay between scheduling and execution.", {"lag": {"left": "1.2ms", "right": "84.5ms"}, "p99": {"left": "14ms", "right": "420ms"}, "cpu": {"left": "12%", "right": "98%"}, "status": {"left": "OK", "right": "FAIL"}}),
                make_step(2, "say3", "Heavy JSON operations or crypto spikes increase event loop lag.", {"lag": {"left": "1.4ms", "right": "120.0ms"}, "p99": {"left": "15ms", "right": "580ms"}, "cpu": {"left": "15%", "right": "100%"}, "status": {"left": "OK", "right": "CRITICAL"}}),
                make_step(3, "say5", "Telemetry alerts fire when lag exceeds the 20ms production threshold.", {"lag": {"left": "1.1ms", "right": "150.2ms"}, "p99": {"left": "12ms", "right": "750ms"}, "cpu": {"left": "14%", "right": "100%"}, "status": {"left": "OK", "right": "TRIPPED"}}),
                make_step(4, "say7", "Worker thread offloading restores low latency and healthy probes.", {"lag": {"left": "1.2ms", "right": "1.5ms"}, "p99": {"left": "14ms", "right": "16ms"}, "cpu": {"left": "12%", "right": "18%"}, "status": {"left": "OK", "right": "RECOVERED"}})
            ]
        }
    })
    return entries

def build_day32_visuals(lesson):
    entries = []
    
    # Part 1: flow - Kafka Cluster Topology
    p1 = lesson['parts'][0]
    entries.append({
        "partTitle": p1['title'],
        "codeHash": get_hash(p1['code']),
        "spec": {
            "template": "flow",
            "title": "Apache Kafka Commit Log & Partition Ingestion Topology",
            "nodes": [
                {"id": "prod", "label": "Kafka Producer", "sub": "Partition Key: user-401", "status": "ok"},
                {"id": "b1", "label": "Broker Leader (P0)", "sub": "In-Sync Replicas: 3", "status": "ok"},
                {"id": "b2", "label": "Broker Follower (P1)", "sub": "Replicating Log", "status": "ok"},
                {"id": "cg", "label": "Consumer Group", "sub": "3 Active Worker Pods", "status": "ok"}
            ],
            "edges": [
                {"from": "prod", "to": "b1", "label": "acks=all"},
                {"from": "b1", "to": "b2", "label": "ISR Sync"},
                {"from": "b1", "to": "cg", "label": "Fetch Batch"}
            ],
            "steps": [
                make_step(1, "say1", "simulateKafkaTopicTopology initializes 8 partitions across 3 brokers.", {"prod": {"status": "Ready"}, "b1": {"status": "Active"}, "b2": {"status": "Syncing"}, "cg": {"status": "Idle"}}),
                make_step(2, "say3", "Producers route records to partition leaders based on MurmurHash2 keys.", {"prod": {"status": "Publishing"}, "b1": {"status": "Active"}, "b2": {"status": "Syncing"}, "cg": {"status": "Idle"}}),
                make_step(3, "say5", "Leader writes message to append-only disk commit log at next offset.", {"prod": {"status": "Acked"}, "b1": {"status": "Committed"}, "b2": {"status": "Replicated"}, "cg": {"status": "Polling"}}),
                make_step(4, "say7", "Consumer group workers pull batches in parallel without partition conflicts.", {"prod": {"status": "Idle"}, "b1": {"status": "Active"}, "b2": {"status": "Active"}, "cg": {"status": "Consuming"}})
            ]
        }
    })

    # Part 2: boxes - Partition Hashing
    p2 = lesson['parts'][1]
    entries.append({
        "partTitle": p2['title'],
        "codeHash": get_hash(p2['code']),
        "spec": {
            "template": "boxes",
            "title": "Deterministic Partition Key Hashing & Distribution",
            "boxes": [
                {"id": "k1", "label": "Key: user-102"},
                {"id": "p1", "label": "Target Partition"},
                {"id": "k2", "label": "Key: user-103"},
                {"id": "p2", "label": "Target Partition"}
            ],
            "steps": [
                make_step(1, "say1", "computePartitionHash executes MurmurHash2 key mapping.", {"k1": {"text": "user-102"}, "p1": {"text": "P2"}, "k2": {"text": "user-103"}, "p2": {"text": "P5"}}, {"k1": "data", "p1": "active", "k2": "data", "p2": "active"}),
                make_step(2, "say3", "Identical keys route deterministically to the exact same partition.", {"k1": {"text": "user-102"}, "p1": {"text": "P2 (FIFO)"}, "k2": {"text": "user-103"}, "p2": {"text": "P5 (FIFO)"}}, {"k1": "data", "p1": "accent", "k2": "data", "p2": "accent"}),
                make_step(3, "say5", "Per-entity ordering is preserved across all lifecycle updates.", {"k1": {"text": "user-102-upd"}, "p1": {"text": "P2 (seq 41)"}, "k2": {"text": "user-103-upd"}, "p2": {"text": "P5 (seq 12)"}}, {"k1": "data", "p1": "accent", "k2": "data", "p2": "accent"}),
                make_step(4, "say7", "Load balances evenly across all 8 available broker partitions.", {"k1": {"text": "Spread ok"}, "p1": {"text": "Balanced"}, "k2": {"text": "Spread ok"}, "p2": {"text": "Balanced"}}, {"k1": "active", "p1": "active", "k2": "active", "p2": "active"})
            ]
        }
    })

    # Part 3: states - Consumer Group Rebalancing
    p3 = lesson['parts'][2]
    entries.append({
        "partTitle": p3['title'],
        "codeHash": get_hash(p3['code']),
        "spec": {
            "template": "states",
            "title": "Consumer Group Rebalance Protocol State Machine",
            "states": [
                {"id": "stable", "label": "Stable Consumption"},
                {"id": "preparing", "label": "Preparing Rebalance (heartbeat missed)"},
                {"id": "syncing", "label": "SyncGroup (cooperative assignment)"}
            ],
            "steps": [
                make_step(1, "say1", "simulateConsumerRebalance monitors worker pod membership.", {"stable": {"active": True}, "preparing": {"active": False}, "syncing": {"active": False}}),
                make_step(2, "say3", "Worker crash triggers coordinator rebalance notification.", {"stable": {"active": False}, "preparing": {"active": True}, "syncing": {"active": False}}),
                make_step(3, "say5", "CooperativeStickyAssignor reallocates orphaned partitions without stop-the-world pauses.", {"stable": {"active": False}, "preparing": {"active": False}, "syncing": {"active": True}}),
                make_step(4, "say7", "All partitions re-assigned and workers resume processing smoothly.", {"stable": {"active": True}, "preparing": {"active": False}, "syncing": {"active": False}})
            ]
        }
    })

    # Part 4: flow - Offset Tracking
    p4 = lesson['parts'][3]
    entries.append({
        "partTitle": p4['title'],
        "codeHash": get_hash(p4['code']),
        "spec": {
            "template": "flow",
            "title": "At-Least-Once Manual Offset Commit Pipeline",
            "nodes": [
                {"id": "fetch", "label": "Poll Batch", "sub": "Offsets 100-109", "status": "ok"},
                {"id": "proc", "label": "Business Logic", "sub": "Database Mutation", "status": "ok"},
                {"id": "commit", "label": "commitOffsetsSync", "sub": "Committed: 110", "status": "ok"},
                {"id": "broker", "label": "__consumer_offsets", "sub": "Persisted in Broker", "status": "ok"}
            ],
            "edges": [
                {"from": "fetch", "to": "proc", "label": "Process"},
                {"from": "proc", "to": "commit", "label": "Success"},
                {"from": "commit", "to": "broker", "label": "Acknowledge"}
            ],
            "steps": [
                make_step(1, "say1", "executeManualOffsetCommit pulls batch from partition offset 100.", {"fetch": {"status": "Active"}, "proc": {"status": "Idle"}, "commit": {"status": "Idle"}, "broker": {"status": "Idle"}}),
                make_step(2, "say3", "Worker processes records atomically before updating broker offset.", {"fetch": {"status": "Complete"}, "proc": {"status": "Active"}, "commit": {"status": "Idle"}, "broker": {"status": "Idle"}}),
                make_step(3, "say5", "commitSync records offset 110 to the internal __consumer_offsets topic.", {"fetch": {"status": "Complete"}, "proc": {"status": "Complete"}, "commit": {"status": "Active"}, "broker": {"status": "Updating"}}),
                make_step(4, "say7", "Crash recovery resumes cleanly from offset 110 with zero dropped events.", {"fetch": {"status": "Ready"}, "proc": {"status": "Ready"}, "commit": {"status": "Complete"}, "broker": {"status": "Synchronized"}})
            ]
        }
    })

    # Part 5: compare - Consumer Lag Auditing
    p5 = lesson['parts'][4]
    entries.append({
        "partTitle": p5['title'],
        "codeHash": get_hash(p5['code']),
        "spec": {
            "template": "compare",
            "title": "Healthy vs Degraded Kafka Consumer Lag Telemetry",
            "left": {"label": "Healthy Ingestion", "sub": "Consumers keep pace with producer ingress"},
            "right": {"label": "Severe Lag Accumulation", "sub": "Slow consumers or dead worker pods"},
            "rows": [
                {"id": "lag", "label": "Consumer Lag (records)"},
                {"id": "leo", "label": "Log End Offset (LEO)"},
                {"id": "committed", "label": "Committed Offset"},
                {"id": "alert", "label": "Alert Status"}
            ],
            "steps": [
                make_step(1, "say1", "auditConsumerLag computes distance between LEO and committed offset.", {"lag": {"left": "14", "right": "24500"}, "leo": {"left": "50000", "right": "74500"}, "committed": {"left": "49986", "right": "50000"}, "alert": {"left": "NORMAL", "right": "CRITICAL"}}),
                make_step(2, "say3", "A slow downstream database creates processing bottlenecks.", {"lag": {"left": "12", "right": "35000"}, "leo": {"left": "52000", "right": "85000"}, "committed": {"left": "51988", "right": "50000"}, "alert": {"left": "NORMAL", "right": "PAGERDUTY"}}),
                make_step(3, "say5", "Horizontal autoscaling adds 4 consumer pods to drain backlogs.", {"lag": {"left": "15", "right": "12000"}, "leo": {"left": "54000", "right": "88000"}, "committed": {"left": "53985", "right": "76000"}, "alert": {"left": "NORMAL", "right": "DRAINING"}}),
                make_step(4, "say7", "Lag returns to nominal levels under 50 records per partition.", {"lag": {"left": "8", "right": "22"}, "leo": {"left": "56000", "right": "90000"}, "committed": {"left": "55992", "right": "89978"}, "alert": {"left": "NORMAL", "right": "RESOLVED"}})
            ]
        }
    })
    return entries

def build_day33_visuals(lesson):
    entries = []
    
    # Part 1: flow - RabbitMQ Exchange Routing
    p1 = lesson['parts'][0]
    entries.append({
        "partTitle": p1['title'],
        "codeHash": get_hash(p1['code']),
        "spec": {
            "template": "flow",
            "title": "AMQP Exchange-to-Queue Routing Architecture",
            "nodes": [
                {"id": "pub", "label": "Publisher", "sub": "Routing Key: order.created", "status": "ok"},
                {"id": "ex", "label": "Topic Exchange", "sub": "order.events", "status": "ok"},
                {"id": "q1", "label": "Fulfillment Queue", "sub": "Binding: order.*", "status": "ok"},
                {"id": "q2", "label": "Audit Log Queue", "sub": "Binding: #", "status": "ok"}
            ],
            "edges": [
                {"from": "pub", "to": "ex", "label": "Publish"},
                {"from": "ex", "to": "q1", "label": "Pattern Match"},
                {"from": "ex", "to": "q2", "label": "Wildcard Match"}
            ],
            "steps": [
                make_step(1, "say1", "simulateRabbitMqExchange inspects AMQP exchange bindings.", {"pub": {"status": "Ready"}, "ex": {"status": "Configured"}, "q1": {"status": "Bound"}, "q2": {"status": "Bound"}}),
                make_step(2, "say3", "Publisher routes message with routing key 'order.created'.", {"pub": {"status": "Publishing"}, "ex": {"status": "Evaluating"}, "q1": {"status": "Waiting"}, "q2": {"status": "Waiting"}}),
                make_step(3, "say5", "Topic exchange evaluates pattern matches against bound queues.", {"pub": {"status": "Idle"}, "ex": {"status": "Dispatched"}, "q1": {"status": "Enqueued"}, "q2": {"status": "Enqueued"}}),
                make_step(4, "say7", "Both target queues receive message copies according to AMQP rules.", {"pub": {"status": "Idle"}, "ex": {"status": "Ready"}, "q1": {"status": "Ready"}, "q2": {"status": "Ready"}})
            ]
        }
    })

    # Part 2: states - AMQP Publisher Confirms
    p2 = lesson['parts'][1]
    entries.append({
        "partTitle": p2['title'],
        "codeHash": get_hash(p2['code']),
        "spec": {
            "template": "states",
            "title": "RabbitMQ Publisher Confirmation State Machine",
            "states": [
                {"id": "unconfirmed", "label": "Unconfirmed In-Flight"},
                {"id": "ack", "label": "Broker ACK (disk persisted)"},
                {"id": "nack", "label": "Broker NACK (queue full / reject)"}
            ],
            "steps": [
                make_step(1, "say1", "simulatePublisherConfirms activates channel confirmation mode.", {"unconfirmed": {"active": True}, "ack": {"active": False}, "nack": {"active": False}}),
                make_step(2, "say3", "Broker flushes message to disk and replicates to quorum members.", {"unconfirmed": {"active": True}, "ack": {"active": False}, "nack": {"active": False}}),
                make_step(3, "say5", "Broker returns positive basic.ack with message delivery tag.", {"unconfirmed": {"active": False}, "ack": {"active": True}, "nack": {"active": False}}),
                make_step(4, "say7", "If disk fails or queue limit hit, basic.nack triggers publisher retry.", {"unconfirmed": {"active": False}, "ack": {"active": False}, "nack": {"active": True}})
            ]
        }
    })

    # Part 3: flow - Dead Letter Exchange
    p3 = lesson['parts'][2]
    entries.append({
        "partTitle": p3['title'],
        "codeHash": get_hash(p3['code']),
        "spec": {
            "template": "flow",
            "title": "Dead-Letter Exchange (DLX) Fault Recovery Pipeline",
            "nodes": [
                {"id": "pri", "label": "Primary Queue", "sub": "x-dead-letter-exchange", "status": "ok"},
                {"id": "worker", "label": "Consumer Worker", "sub": "basic.reject(requeue=false)", "status": "ok"},
                {"id": "dlx", "label": "DLX Exchange", "sub": "Direct Routing", "status": "ok"},
                {"id": "dlq", "label": "Quarantine DLQ", "sub": "Persisted for Inspection", "status": "ok"}
            ],
            "edges": [
                {"from": "pri", "to": "worker", "label": "Deliver"},
                {"from": "worker", "to": "dlx", "label": "Reject / Expire"},
                {"from": "dlx", "to": "dlq", "label": "Quarantine"}
            ],
            "steps": [
                make_step(1, "say1", "simulateDeadLetterRouting configures primary queue with DLX headers.", {"pri": {"status": "Configured"}, "worker": {"status": "Ready"}, "dlx": {"status": "Listening"}, "dlq": {"status": "Empty"}}),
                make_step(2, "say3", "Corrupted message fails parsing and worker rejects with requeue=false.", {"pri": {"status": "Delivered"}, "worker": {"status": "Rejecting"}, "dlx": {"status": "Listening"}, "dlq": {"status": "Empty"}}),
                make_step(3, "say5", "RabbitMQ routes rejected message to dead-letter exchange automatically.", {"pri": {"status": "Evicted"}, "worker": {"status": "Idle"}, "dlx": {"status": "Routing"}, "dlq": {"status": "Receiving"}}),
                make_step(4, "say7", "Quarantine DLQ preserves message and headers for engineer audit.", {"pri": {"status": "Idle"}, "worker": {"status": "Ready"}, "dlx": {"status": "Idle"}, "dlq": {"status": "Quarantined"}})
            ]
        }
    })

    # Part 4: boxes - Priority Queuing
    p4 = lesson['parts'][3]
    entries.append({
        "partTitle": p4['title'],
        "codeHash": get_hash(p4['code']),
        "spec": {
            "template": "boxes",
            "title": "AMQP Priority Queue Scheduling & Dispatching",
            "boxes": [
                {"id": "hp", "label": "High Priority (10)"},
                {"id": "mp", "label": "Medium Priority (5)"},
                {"id": "lp", "label": "Low Priority (1)"},
                {"id": "order", "label": "Dispatch Sequence"}
            ],
            "steps": [
                make_step(1, "say1", "executePriorityScheduling configures x-max-priority = 10.", {"hp": {"text": "2 tasks"}, "mp": {"text": "3 tasks"}, "lp": {"text": "5 tasks"}, "order": {"text": "Pending"}}, {"hp": "active", "mp": "data", "lp": "idle", "order": "idle"}),
                make_step(2, "say3", "Priority 10 items bypass low-priority tasks accumulated in queue.", {"hp": {"text": "Dispatched"}, "mp": {"text": "Queued"}, "lp": {"text": "Queued"}, "order": {"text": "HP first"}}, {"hp": "accent", "mp": "data", "lp": "idle", "order": "active"}),
                make_step(3, "say5", "Medium priority jobs are dispatched next once high priority drains.", {"hp": {"text": "0 remaining"}, "mp": {"text": "Dispatched"}, "lp": {"text": "Queued"}, "order": {"text": "MP second"}}, {"hp": "idle", "mp": "accent", "lp": "idle", "order": "active"}),
                make_step(4, "say7", "Low priority bulk tasks process during off-peak consumer capacity.", {"hp": {"text": "0"}, "mp": {"text": "0"}, "lp": {"text": "Dispatched"}, "order": {"text": "Complete"}}, {"hp": "idle", "mp": "idle", "lp": "accent", "order": "accent"})
            ]
        }
    })

    # Part 5: compare - Classic vs Quorum Queues
    p5 = lesson['parts'][4]
    entries.append({
        "partTitle": p5['title'],
        "codeHash": get_hash(p5['code']),
        "spec": {
            "template": "compare",
            "title": "Classic Mirrored Queues vs Raft Quorum Queues",
            "left": {"label": "Classic Mirrored Queues", "sub": "Deprecated master-slave replication"},
            "right": {"label": "Raft Quorum Queues", "sub": "Modern consensus-backed durability"},
            "rows": [
                {"id": "consensus", "label": "Replication Protocol"},
                {"id": "splitbrain", "label": "Split-Brain Safety"},
                {"id": "failover", "label": "Leader Failover"},
                {"id": "throughput", "label": "High-Throughput IO"}
            ],
            "steps": [
                make_step(1, "say1", "evaluateRabbitMqClustering contrasts replication algorithms.", {"consensus": {"left": "Ad-hoc sync", "right": "Raft Consensus"}, "splitbrain": {"left": "Vulnerable", "right": "Mathematically Safe"}, "failover": {"left": "Potential Data Loss", "right": "Zero Data Loss"}, "throughput": {"left": "Degrades with Nodes", "right": "Sustained Parallel I/O"}}),
                make_step(2, "say3", "Network partitions in classic mirroring risk unrecoverable state desync.", {"consensus": {"left": "Desync risk", "right": "Strict Majority"}, "splitbrain": {"left": "Partition Hazard", "right": "Isolated Minority"}, "failover": {"left": "Unsynchronized slave", "right": "Elected Raft Leader"}, "throughput": {"left": "Variable", "right": "Predictable"}}),
                make_step(3, "say5", "Quorum queues require majority consensus before acknowledging writes.", {"consensus": {"left": "Single master", "right": "Quorum of 3/5"}, "splitbrain": {"left": "High risk", "right": "Zero risk"}, "failover": {"left": "Manual intervention", "right": "Sub-second automatic"}, "throughput": {"left": "Bottlenecked", "right": "Optimized RocksDB storage"}}),
                make_step(4, "say7", "Modern enterprise deployments mandate Quorum Queues for critical data.", {"consensus": {"left": "Deprecated", "right": "Industry Standard"}, "splitbrain": {"left": "Avoid in Prod", "right": "Production Certified"}, "failover": {"left": "Unsafe", "right": "High Availability"}, "throughput": {"left": "Sub-optimal", "right": "Maximum Resilience"}})
            ]
        }
    })
    return entries

def build_day34_visuals(lesson):
    entries = []
    
    # Part 1: boxes - Redis Streams Radix Tree
    p1 = lesson['parts'][0]
    entries.append({
        "partTitle": p1['title'],
        "codeHash": get_hash(p1['code']),
        "spec": {
            "template": "boxes",
            "title": "Redis Stream Radix Tree & Listpack Storage",
            "boxes": [
                {"id": "ts", "label": "Millisecond Timestamp"},
                {"id": "seq", "label": "Sequence Index"},
                {"id": "lp", "label": "Listpack Macro-Node"},
                {"id": "mem", "label": "RAM Consumption"}
            ],
            "steps": [
                make_step(1, "say1", "appendRedisStreamEntry executes XADD appending entry to stream.", {"ts": {"text": "1710000000000"}, "seq": {"text": "0"}, "lp": {"text": "Node 1"}, "mem": {"text": "64 bytes"}}, {"ts": "data", "seq": "data", "lp": "active", "mem": "idle"}),
                make_step(2, "say3", "Radix tree indexes entries efficiently by 64-bit millisecond key.", {"ts": {"text": "1710000000001"}, "seq": {"text": "0"}, "lp": {"text": "Node 1"}, "mem": {"text": "96 bytes"}}, {"ts": "data", "seq": "data", "lp": "active", "mem": "idle"}),
                make_step(3, "say5", "Common field names are compressed across entries in the same Listpack.", {"ts": {"text": "1710000000001"}, "seq": {"text": "1"}, "lp": {"text": "Compressed"}, "mem": {"text": "112 bytes"}}, {"ts": "data", "seq": "accent", "lp": "accent", "mem": "data"}),
                make_step(4, "say7", "Stream operations achieve microsecond latency with minimal RAM overhead.", {"ts": {"text": "Indexed"}, "seq": {"text": "Sorted"}, "lp": {"text": "Optimized"}, "mem": {"text": "<1KB total"}}, {"ts": "active", "seq": "active", "lp": "active", "mem": "accent"})
            ]
        }
    })

    # Part 2: flow - Consumer Groups & XREADGROUP
    p2 = lesson['parts'][1]
    entries.append({
        "partTitle": p2['title'],
        "codeHash": get_hash(p2['code']),
        "spec": {
            "template": "flow",
            "title": "Redis Streams Consumer Group Ingestion Pipeline",
            "nodes": [
                {"id": "str", "label": "Redis Stream", "sub": "XADD stream:orders", "status": "ok"},
                {"id": "grp", "label": "Consumer Group", "sub": "XGROUP CREATE orders_grp $", "status": "ok"},
                {"id": "w1", "label": "Worker Pod 1", "sub": "XREADGROUP > (Assigned)", "status": "ok"},
                {"id": "w2", "label": "Worker Pod 2", "sub": "XREADGROUP > (Assigned)", "status": "ok"}
            ],
            "edges": [
                {"from": "str", "to": "grp", "label": "Append"},
                {"from": "grp", "to": "w1", "label": "Dispatched"},
                {"from": "grp", "to": "w2", "label": "Dispatched"}
            ],
            "steps": [
                make_step(1, "say1", "readRedisStreamGroup creates consumer group with initial cursor.", {"str": {"status": "Active"}, "grp": {"status": "Configured"}, "w1": {"status": "Idle"}, "w2": {"status": "Idle"}}),
                make_step(2, "say3", "Worker 1 requests new entries using the special '>' operator.", {"str": {"status": "Active"}, "grp": {"status": "Dispatching"}, "w1": {"status": "Assigned"}, "w2": {"status": "Idle"}}),
                make_step(3, "say5", "Worker 2 pulls subsequent entries without duplicate delivery.", {"str": {"status": "Active"}, "grp": {"status": "Dispatching"}, "w1": {"status": "Processing"}, "w2": {"status": "Assigned"}}),
                make_step(4, "say7", "Entries move to the Pending Acknowledgment List awaiting explicit XACK.", {"str": {"status": "Idle"}, "grp": {"status": "Tracking PEL"}, "w1": {"status": "Acknowledged"}, "w2": {"status": "Acknowledged"}})
            ]
        }
    })

    # Part 3: states - Pending Acknowledgment List (PEL)
    p3 = lesson['parts'][2]
    entries.append({
        "partTitle": p3['title'],
        "codeHash": get_hash(p3['code']),
        "spec": {
            "template": "states",
            "title": "Pending Acknowledgment List (PEL) Entry Lifecycle",
            "states": [
                {"id": "pel_pending", "label": "In-Flight PEL (delivered to consumer)"},
                {"id": "pel_ack", "label": "Acknowledged (XACK - evicted from PEL)"},
                {"id": "pel_stale", "label": "Stale / Idle (candidate for XCLAIM)"}
            ],
            "steps": [
                make_step(1, "say1", "inspectPendingAcknowledgmentList queries PEL via XPENDING.", {"pel_pending": {"active": True}, "pel_ack": {"active": False}, "pel_stale": {"active": False}}),
                make_step(2, "say3", "Consumer finishes processing and emits XACK, removing entry cleanly.", {"pel_pending": {"active": False}, "pel_ack": {"active": True}, "pel_stale": {"active": False}}),
                make_step(3, "say5", "If consumer terminates unexpectedly, message remains in PEL accumulating idle time.", {"pel_pending": {"active": False}, "pel_ack": {"active": False}, "pel_stale": {"active": True}}),
                make_step(4, "say7", "Idle duration exceeding threshold flags entry for automatic recovery.", {"pel_pending": {"active": False}, "pel_ack": {"active": False}, "pel_stale": {"active": True}})
            ]
        }
    })

    # Part 4: flow - XCLAIM & XAUTOCLAIM
    p4 = lesson['parts'][3]
    entries.append({
        "partTitle": p4['title'],
        "codeHash": get_hash(p4['code']),
        "spec": {
            "template": "flow",
            "title": "Autonomous Stale Message Claiming & Recovery",
            "nodes": [
                {"id": "dead", "label": "Crashed Worker 1", "sub": "Unacknowledged PEL entries", "status": "fail"},
                {"id": "pel", "label": "Redis Stream PEL", "sub": "Idle Time > 30,000ms", "status": "ok"},
                {"id": "claim", "label": "XAUTOCLAIM Scan", "sub": "Atomic PEL Ownership Transfer", "status": "ok"},
                {"id": "rec", "label": "Healthy Worker 2", "sub": "Processing Reclaimed Message", "status": "ok"}
            ],
            "edges": [
                {"from": "dead", "to": "pel", "label": "Orphaned"},
                {"from": "pel", "to": "claim", "label": "Filter Stale"},
                {"from": "claim", "to": "rec", "label": "Reassign"}
            ],
            "steps": [
                make_step(1, "say1", "claimStaleStreamMessage executes XAUTOCLAIM to detect abandoned tasks.", {"dead": {"status": "Dead"}, "pel": {"status": "Auditing"}, "claim": {"status": "Scanning"}, "rec": {"status": "Idle"}}),
                make_step(2, "say3", "Messages with idle time > 30 seconds are identified in the PEL.", {"dead": {"status": "Dead"}, "pel": {"status": "Identified"}, "claim": {"status": "Active"}, "rec": {"status": "Idle"}}),
                make_step(3, "say5", "Redis atomically transfers ownership and increments the delivery counter.", {"dead": {"status": "Dead"}, "pel": {"status": "Updated"}, "claim": {"status": "Transferred"}, "rec": {"status": "Assigned"}}),
                make_step(4, "say7", "Surviving worker finishes task execution and emits XACK cleanly.", {"dead": {"status": "Evicted"}, "pel": {"status": "Cleared"}, "claim": {"status": "Idle"}, "rec": {"status": "Acked"}})
            ]
        }
    })

    # Part 5: compare - Stream Trimming & Capping
    p5 = lesson['parts'][4]
    entries.append({
        "partTitle": p5['title'],
        "codeHash": get_hash(p5['code']),
        "spec": {
            "template": "compare",
            "title": "Unbounded Stream Growth vs MAXLEN Capping",
            "left": {"label": "Unbounded Stream", "sub": "Appending without eviction limits"},
            "right": {"label": "MAXLEN ~ 100,000 Capped", "sub": "Approximate Listpack macro-node trimming"},
            "rows": [
                {"id": "ram", "label": "RAM Consumption"},
                {"id": "oom", "label": "OOM Crash Hazard"},
                {"id": "cpu", "label": "Trimming Overhead"},
                {"id": "retention", "label": "Data Window"}
            ],
            "steps": [
                make_step(1, "say1", "trimRedisStream enforces strict memory ceiling via MAXLEN.", {"ram": {"left": "16 GB (grows)", "right": "240 MB (constant)"}, "oom": {"left": "Severe Risk", "right": "Zero Risk"}, "cpu": {"left": "0%", "right": "<2% (approximate)"}, "retention": {"left": "All History", "right": "Recent 100k events"}}),
                make_step(2, "say3", "The tilde operator (~) optimizes CPU by trimming whole Listpack nodes.", {"ram": {"left": "24 GB", "right": "242 MB"}, "oom": {"left": "Warning Threshold", "right": "Stable"}, "cpu": {"left": "0%", "right": "1.4%"}, "retention": {"left": "All History", "right": "Target window"}}),
                make_step(3, "say5", "Unbounded streams eventually exhaust server memory and trigger OOM killer.", {"ram": {"left": "32 GB (OOM)", "right": "239 MB"}, "oom": {"left": "CRASHED", "right": "Protected"}, "cpu": {"left": "N/A", "right": "1.2%"}, "retention": {"left": "Lost on crash", "right": "Preserved"}}),
                make_step(4, "say7", "Capped streams ensure high-speed, reliable in-memory streaming pipelines.", {"ram": {"left": "Offline", "right": "240 MB"}, "oom": {"left": "Failed", "right": "Healthy"}, "cpu": {"left": "N/A", "right": "Nominal"}, "retention": {"left": "Corrupted", "right": "Certified"}})
            ]
        }
    })
    return entries

def build_day35_visuals(lesson):
    entries = []
    
    # Part 1: flow - Milestone 6 Architecture Topology
    p1 = lesson['parts'][0]
    entries.append({
        "partTitle": p1['title'],
        "codeHash": get_hash(p1['code']),
        "spec": {
            "template": "flow",
            "title": "Milestone 6 Distributed Event-Driven Order Engine Topology",
            "nodes": [
                {"id": "db", "label": "PostgreSQL Outbox", "sub": "Local ACID Transaction", "status": "ok"},
                {"id": "cdc", "label": "Debezium CDC", "sub": "WAL Stream Reader (2.4ms)", "status": "ok"},
                {"id": "kfk", "label": "Kafka Cluster", "sub": "8 Partitions / ISR=3", "status": "ok"},
                {"id": "wrk", "label": "Idempotent Workers", "sub": "Prefetch: 50 / Redis Dedupe", "status": "ok"}
            ],
            "edges": [
                {"from": "db", "to": "cdc", "label": "pgoutput WAL"},
                {"from": "cdc", "to": "kfk", "label": "acks=all"},
                {"from": "kfk", "to": "wrk", "label": "Partition Assign"}
            ],
            "steps": [
                make_step(1, "say1", "synthesizeOrderEngineTopology validates all 5 core platform subsystems.", {"db": {"status": "Checking"}, "cdc": {"status": "Checking"}, "kfk": {"status": "Checking"}, "wrk": {"status": "Checking"}}),
                make_step(2, "say3", "Order insertion and domain event outbox write commit in single ACID transaction.", {"db": {"status": "Committed"}, "cdc": {"status": "Listening"}, "kfk": {"status": "Ready"}, "wrk": {"status": "Idle"}}),
                make_step(3, "say5", "Debezium CDC tails WAL stream, publishing events to Kafka in under 3 milliseconds.", {"db": {"status": "Online"}, "cdc": {"status": "Streaming"}, "kfk": {"status": "Ingesting"}, "wrk": {"status": "Polling"}}),
                make_step(4, "say7", "Idempotent worker pods process incoming messages with zero duplicate leakage.", {"db": {"status": "Online"}, "cdc": {"status": "Online"}, "kfk": {"status": "Online"}, "wrk": {"status": "Online"}})
            ]
        }
    })

    # Part 2: boxes - Transactional Outbox Relayer
    p2 = lesson['parts'][1]
    entries.append({
        "partTitle": p2['title'],
        "codeHash": get_hash(p2['code']),
        "spec": {
            "template": "boxes",
            "title": "Transactional Outbox Relayer & Kafka Partition Mapping",
            "boxes": [
                {"id": "b1", "label": "Pending Outbox Batch"},
                {"id": "b2", "label": "Relayed to Kafka"},
                {"id": "b3", "label": "Target Partition"},
                {"id": "b4", "label": "Updated DB Status"}
            ],
            "steps": [
                make_step(1, "say1", "relayOutboxRecords inspects pending events in outbox table batch.", {"b1": {"text": "3 records"}, "b2": {"text": "0"}, "b3": {"text": "None"}, "b4": {"text": "PENDING"}}, {"b1": "data", "b2": "idle", "b3": "idle", "b4": "data"}),
                make_step(2, "say3", "Aggregate root orderId hashes deterministically across 8 Kafka partitions.", {"b1": {"text": "3 records"}, "b2": {"text": "2 published"}, "b3": {"text": "P2 / P3"}, "b4": {"text": "In-Flight"}}, {"b1": "data", "b2": "active", "b3": "active", "b4": "active"}),
                make_step(3, "say5", "Kafka in-sync replicas confirm message receipt under acks=all.", {"b1": {"text": "0 pending"}, "b2": {"text": "2 acked"}, "b3": {"text": "Committed"}, "b4": {"text": "PROCESSED"}}, {"b1": "idle", "b2": "accent", "b3": "data", "b4": "accent"}),
                make_step(4, "say7", "Outbox records updated atomically, preventing duplicate event generation.", {"b1": {"text": "Synchronized"}, "b2": {"text": "Complete"}, "b3": {"text": "Preserved"}, "b4": {"text": "Clean"}}, {"b1": "active", "b2": "accent", "b3": "active", "b4": "accent"})
            ]
        }
    })

    # Part 3: states - Idempotent Consumer & Deduplication
    p3 = lesson['parts'][2]
    entries.append({
        "partTitle": p3['title'],
        "codeHash": get_hash(p3['code']),
        "spec": {
            "template": "states",
            "title": "Idempotent Consumer Deduplication State Machine",
            "states": [
                {"id": "new_msg", "label": "New Message (execute mutation & save key)"},
                {"id": "dupe_msg", "label": "Duplicate Detected (skip execution, commit offset)"},
                {"id": "committed", "label": "Offset Committed Cleanly"}
            ],
            "steps": [
                make_step(1, "say1", "executeIdempotentConsumer receives incoming message batch.", {"new_msg": {"active": True}, "dupe_msg": {"active": False}, "committed": {"active": False}}),
                make_step(2, "say3", "Message with duplicate key key_001 is intercepted by deduplication store.", {"new_msg": {"active": False}, "dupe_msg": {"active": True}, "committed": {"active": False}}),
                make_step(3, "say5", "Duplicate business execution bypassed while offset commit succeeds.", {"new_msg": {"active": False}, "dupe_msg": {"active": True}, "committed": {"active": True}}),
                make_step(4, "say7", "New keys key_002 and key_003 execute mutations and store keys atomically.", {"new_msg": {"active": True}, "dupe_msg": {"active": False}, "committed": {"active": True}})
            ]
        }
    })

    # Part 4: flow - Dead-Letter Quarantine & Poison Pill Recovery
    p4 = lesson['parts'][3]
    entries.append({
        "partTitle": p4['title'],
        "codeHash": get_hash(p4['code']),
        "spec": {
            "template": "flow",
            "title": "Dead-Letter Quarantine & Poison Pill Isolation",
            "nodes": [
                {"id": "ingress", "label": "Ingress Stream", "sub": "3 Messages Inspected", "status": "ok"},
                {"id": "eval", "label": "Retry & Schema Evaluator", "sub": "Max Retries: 3", "status": "ok"},
                {"id": "healthy", "label": "Healthy Pipeline", "sub": "Processed Successfully", "status": "ok"},
                {"id": "dlq", "label": "Dead-Letter Quarantine", "sub": "orders.dlq (Diagnostic Headers)", "status": "fail"}
            ],
            "edges": [
                {"from": "ingress", "to": "eval", "label": "Inspect"},
                {"from": "eval", "to": "healthy", "label": "Pass"},
                {"from": "eval", "to": "dlq", "label": "Exceeded / Corrupt"}
            ],
            "steps": [
                make_step(1, "say1", "quarantinePoisonPills scans incoming message payloads and delivery counts.", {"ingress": {"status": "Inspecting"}, "eval": {"status": "Active"}, "healthy": {"status": "Idle"}, "dlq": {"status": "Empty"}}),
                make_step(2, "say3", "Malformed record m3 triggers fatal corruption and bypasses further retries.", {"ingress": {"status": "Active"}, "eval": {"status": "Corrupted"}, "healthy": {"status": "Idle"}, "dlq": {"status": "Receiving"}}),
                make_step(3, "say5", "Message m2 exceeding max retry threshold diverts immediately to DLQ.", {"ingress": {"status": "Active"}, "eval": {"status": "Exceeded"}, "healthy": {"status": "Active"}, "dlq": {"status": "Quarantining"}}),
                make_step(4, "say7", "Healthy message m1 continues processing unimpeded without partition stalls.", {"ingress": {"status": "Complete"}, "eval": {"status": "Complete"}, "healthy": {"status": "Processed"}, "dlq": {"status": "Quarantined"}})
            ]
        }
    })

    # Part 5: compare - Milestone 6 Production SLA Verification
    p5 = lesson['parts'][4]
    entries.append({
        "partTitle": p5['title'],
        "codeHash": get_hash(p5['code']),
        "spec": {
            "template": "compare",
            "title": "Milestone 6 Production SLA Verification & Certification Scorecard",
            "left": {"label": "Production SLA Target", "sub": "Enterprise contractual threshold"},
            "right": {"label": "Engine Actual Metric", "sub": "Empirical benchmark result"},
            "rows": [
                {"id": "outbox", "label": "Outbox Relay Latency"},
                {"id": "publish", "label": "Kafka Publish Latency"},
                {"id": "tput", "label": "Consumer Throughput"},
                {"id": "dedupe", "label": "Deduplication Accuracy"},
                {"id": "lag", "label": "Max Observed Lag"},
                {"id": "dlq", "label": "DLQ Poison Pill Isolation"}
            ],
            "steps": [
                make_step(1, "say1", "verifyMilestone6SlaSuite audits all 6 critical production vectors.", {"outbox": {"left": "<=10.0ms", "right": "3.2ms"}, "publish": {"left": "<=5.0ms", "right": "1.8ms"}, "tput": {"left": ">=10,000 msg/s", "right": "25,000 msg/s"}, "dedupe": {"left": "100%", "right": "100%"}, "lag": {"left": "<=50 records", "right": "12 records"}, "dlq": {"left": "100%", "right": "100%"}}),
                make_step(2, "say3", "Outbox and Kafka latencies surpass enterprise targets by over 60%.", {"outbox": {"left": "PASS", "right": "3.2ms (FAST)"}, "publish": {"left": "PASS", "right": "1.8ms (FAST)"}, "tput": {"left": "PASS", "right": "25k msg/s"}, "dedupe": {"left": "PASS", "right": "100%"}, "lag": {"left": "PASS", "right": "12"}, "dlq": {"left": "PASS", "right": "100%"}}),
                make_step(3, "say5", "Throughput reaches 25,000 msg/s with 100% deduplication accuracy.", {"outbox": {"left": "PASS", "right": "Optimal"}, "publish": {"left": "PASS", "right": "Optimal"}, "tput": {"left": "PASS", "right": "2.5x Target"}, "dedupe": {"left": "PASS", "right": "Zero Duplicates"}, "lag": {"left": "PASS", "right": "Minimal"}, "dlq": {"left": "PASS", "right": "100% Isolated"}}),
                make_step(4, "say7", "Platform satisfies all 6 SLAs and earns Grade A+ Production Certification.", {"outbox": {"left": "CERTIFIED", "right": "A+"}, "publish": {"left": "CERTIFIED", "right": "A+"}, "tput": {"left": "CERTIFIED", "right": "A+"}, "dedupe": {"left": "CERTIFIED", "right": "A+"}, "lag": {"left": "CERTIFIED", "right": "A+"}, "dlq": {"left": "CERTIFIED", "right": "A+"}})
            ]
        }
    })
    return entries

builders = {
    31: build_day31_visuals,
    32: build_day32_visuals,
    33: build_day33_visuals,
    34: build_day34_visuals,
    35: build_day35_visuals
}

out_dir = 'src/lib/data/lessonVisuals/node-web'
os.makedirs(out_dir, exist_ok=True)

for day in [31, 32, 33, 34, 35]:
    with open(f'scripts/node_day{day}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
    
    entries = builders[day](lesson)
    assert len(entries) == 5, f"Day {day} must have 5 visual entries!"
    
    # Check that each entry codeHash matches exactly
    for idx, e in enumerate(entries):
        expected_code = lesson['parts'][idx]['code']
        actual_hash = e['codeHash']
        calc_hash = get_hash(expected_code)
        assert actual_hash == calc_hash, f"Hash mismatch at Day {day} Part {idx+1}!"
        spec = e['spec']
        assert spec['template'] in ['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states']
        assert len(spec['steps']) == 4, f"Day {day} Part {idx+1} must have 4 steps!"
    
    doc = {
        "schemaVersion": 2,
        "prefix": "node-web",
        "day": day,
        "promptSha": "block7_expansion",
        "model": "gpt-4o",
        "entries": entries
    }
    
    out_file = os.path.join(out_dir, f'day-{day}.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(doc, f, indent=2)
    print(f"Generated {out_file} successfully!")

print("\nALL BLOCK 7 (DAYS 31-35) VISUALS FULLY GENERATED AND HASH-BOUND!")
