"""
PinIT Career OS — Python Backend Course
Puzzle data for Days 46-60: Distributed Systems, Observability & Capstone
All puzzles use pure-Python simulations (stdlib only). No external services required.
"""

PUZZLES = [
    # ── Day 46: gRPC, Protocol Buffers & HTTP/2 ──────────────────────────
    {
        "day": 46,
        "title": "gRPC Unary RPC with Protobuf Message Simulation",
        "mission": "Simulate a gRPC-style unary RPC call: define a protobuf-like message schema, a service stub, and invoke the RPC method to get a serialized response.",
        "labels": [
            "Define protobuf message schema as a dict validator",
            "Create the gRPC service class with RPC method",
            "Create a request message using the schema",
            "Invoke the unary RPC and capture response",
            "Print the serialized response fields",
        ],
        "blocks": [
            'def create_message(schema, **fields):\n    for key in schema:\n        if key not in fields:\n            raise ValueError(f"Missing field: {key}")\n    return {k: fields[k] for k in schema}',
            'class UserService:\n    def GetUser(self, request):\n        uid = request["user_id"]\n        return create_message(\n            RESPONSE_SCHEMA,\n            user_id=uid, name=f"User_{uid}", role="admin"\n        )',
            'REQUEST_SCHEMA = ["user_id"]\nRESPONSE_SCHEMA = ["user_id", "name", "role"]',
            'request = create_message(REQUEST_SCHEMA, user_id=42)\nservice = UserService()\nresponse = service.GetUser(request)',
            'print(f"gRPC Response: id={response[\'user_id\']}, name={response[\'name\']}, role={response[\'role\']}")',
        ],
        "decoys": [
            (
                'def create_message(schema, **fields):\n    return fields',
                "Skipping schema validation defeats the purpose of Protocol Buffers — protobuf enforces strict field definitions to catch missing or extra fields at serialization time.",
            ),
            (
                'response = service.GetUser(42)',
                "gRPC methods receive structured message objects, not raw primitives. Passing a bare int bypasses the protobuf message contract and would fail deserialization.",
            ),
        ],
        "output": "gRPC Response: id=42, name=User_42, role=admin",
        "hint": "Protocol Buffers enforce a schema: every field in the schema must be present in the message. The service method receives a request message and returns a response message.",
        "success": "You simulated a gRPC unary RPC with protobuf-style schema validation — the foundation of high-performance inter-service communication!",
    },
    # ── Day 47: Kafka Event-Driven Architecture ──────────────────────────
    {
        "day": 47,
        "title": "Kafka Producer-Consumer with Partition Routing",
        "mission": "Simulate a Kafka topic with partitions: produce keyed events that route to partitions via hashing, then consume from each partition in order.",
        "labels": [
            "Create the Kafka topic with partitions",
            "Define the producer with partition routing",
            "Produce keyed events to the topic",
            "Define consumer to read from partitions in order",
            "Consume and print all events",
        ],
        "blocks": [
            'class KafkaTopic:\n    def __init__(self, name, num_partitions):\n        self.name = name\n        self.partitions = {i: [] for i in range(num_partitions)}\n        self.num_partitions = num_partitions',
            'class Producer:\n    def send(self, topic, key, value):\n        partition = hash(key) % topic.num_partitions\n        offset = len(topic.partitions[partition])\n        topic.partitions[partition].append({"key": key, "value": value, "offset": offset})',
            'topic = KafkaTopic("orders", 2)\nproducer = Producer()\nfor oid in ["A1", "B2", "A1", "C3"]:\n    producer.send(topic, key=oid, value=f"order_{oid}")',
            'class Consumer:\n    def poll(self, topic):\n        events = []\n        for pid in sorted(topic.partitions):\n            for record in topic.partitions[pid]:\n                events.append((pid, record["offset"], record["value"]))\n        return events',
            'consumer = Consumer()\nfor pid, offset, value in consumer.poll(topic):\n    print(f"P{pid}|offset={offset}: {value}")',
        ],
        "decoys": [
            (
                'class Producer:\n    def send(self, topic, key, value):\n        import random\n        partition = random.randint(0, topic.num_partitions - 1)\n        topic.partitions[partition].append({"key": key, "value": value})',
                "Random partition assignment breaks Kafka's key-ordering guarantee. Kafka uses deterministic key hashing so all events with the same key land on the same partition, preserving per-key ordering.",
            ),
            (
                'class Consumer:\n    def poll(self, topic):\n        events = []\n        for pid in sorted(topic.partitions):\n            events.append(topic.partitions[pid][-1])\n        return events',
                "Reading only the last record per partition loses all earlier events. Kafka consumers read from an offset and process ALL records sequentially — that is the core of event sourcing.",
            ),
        ],
        "output": "P0|offset=0: order_B2\nP0|offset=1: order_C3\nP1|offset=0: order_A1\nP1|offset=1: order_A1",
        "hint": "Kafka routes events to partitions using hash(key) % num_partitions. Events with the same key always go to the same partition, guaranteeing per-key ordering.",
        "success": "You built a Kafka simulation with deterministic partition routing — the backbone of event-driven architectures at scale!",
    },
    # ── Day 48: Distributed Caching & Cache Invalidation ─────────────────
    {
        "day": 48,
        "title": "Cache-Aside Pattern with TTL Expiration",
        "mission": "Simulate a Redis-style cache with TTL-based expiration using the cache-aside (lazy-loading) pattern: check cache first, fall back to the database, then populate cache.",
        "labels": [
            "Create the simulated Redis cache with TTL support",
            "Define the database and cache-aside getter",
            "Fetch data (cache miss populates cache)",
            "Fetch again (cache hit) then simulate TTL expiry",
            "Fetch after expiry (cache miss again) and print stats",
        ],
        "blocks": [
            'class RedisCache:\n    def __init__(self):\n        self.store = {}\n        self.hits = 0\n        self.misses = 0\n        self.clock = 0\n    def get(self, key):\n        if key in self.store:\n            val, expires = self.store[key]\n            if self.clock < expires:\n                self.hits += 1\n                return val\n            del self.store[key]\n        self.misses += 1\n        return None\n    def set(self, key, val, ttl):\n        self.store[key] = (val, self.clock + ttl)',
            'DATABASE = {"user:1": "Alice", "user:2": "Bob"}\ndef cache_aside_get(cache, key):\n    result = cache.get(key)\n    if result is None:\n        result = DATABASE[key]\n        cache.set(key, result, ttl=5)\n    return result',
            'cache = RedisCache()\nv1 = cache_aside_get(cache, "user:1")\nprint(f"Fetch1: {v1} (hits={cache.hits}, misses={cache.misses})")',
            'v2 = cache_aside_get(cache, "user:1")\nprint(f"Fetch2: {v2} (hits={cache.hits}, misses={cache.misses})")\ncache.clock = 10',
            'v3 = cache_aside_get(cache, "user:1")\nprint(f"Fetch3: {v3} (hits={cache.hits}, misses={cache.misses})")',
        ],
        "decoys": [
            (
                'def cache_aside_get(cache, key):\n    result = DATABASE[key]\n    cache.set(key, result, ttl=5)\n    return result',
                "Always reading from the database and writing to cache defeats caching entirely — cache-aside checks the cache FIRST and only falls back to the DB on a miss.",
            ),
            (
                '    def get(self, key):\n        if key in self.store:\n            self.hits += 1\n            return self.store[key][0]\n        self.misses += 1\n        return None',
                "Ignoring TTL expiry means stale data is served forever. Redis TTL ensures data freshness by automatically expiring entries after the time-to-live elapses.",
            ),
        ],
        "output": "Fetch1: Alice (hits=0, misses=1)\nFetch2: Alice (hits=1, misses=1)\nFetch3: Alice (hits=1, misses=2)",
        "hint": "Cache-aside: check cache → on miss, read DB → store in cache with TTL. On subsequent reads, cache hits until TTL expires, then it is a miss again.",
        "success": "You mastered the cache-aside pattern with TTL — the most common distributed caching strategy used with Redis in production systems!",
    },
    # ── Day 49: Circuit Breakers, Bulkheads & Rate Limiting ──────────────
    {
        "day": 49,
        "title": "Circuit Breaker State Machine",
        "mission": "Implement a circuit breaker that transitions between CLOSED → OPEN → HALF_OPEN → CLOSED states based on failure thresholds and recovery probes.",
        "labels": [
            "Define the CircuitBreaker class with state and counters",
            "Implement the call method with state transitions",
            "Create a flaky service and wire it to the breaker",
            "Execute calls that trigger state transitions",
            "Print the transition log",
        ],
        "blocks": [
            'class CircuitBreaker:\n    def __init__(self, threshold=3, recovery_timeout=1):\n        self.state = "CLOSED"\n        self.fail_count = 0\n        self.threshold = threshold\n        self.log = []',
            '    def call(self, func):\n        if self.state == "OPEN":\n            self.state = "HALF_OPEN"\n            self.log.append("OPEN->HALF_OPEN")\n        try:\n            result = func()\n            if self.state == "HALF_OPEN":\n                self.state = "CLOSED"\n                self.fail_count = 0\n                self.log.append("HALF_OPEN->CLOSED")\n            return result\n        except Exception:\n            self.fail_count += 1\n            if self.fail_count >= self.threshold:\n                self.state = "OPEN"\n                self.log.append(f"CLOSED->OPEN(fails={self.fail_count})")\n            return None',
            'call_num = 0\ndef flaky_service():\n    global call_num\n    call_num += 1\n    if call_num <= 3:\n        raise ConnectionError("service down")\n    return "OK"',
            'cb = CircuitBreaker(threshold=3)\nresults = []\nfor _ in range(5):\n    results.append(cb.call(flaky_service))',
            'for entry in cb.log:\n    print(entry)\nprint(f"Results: {results}")',
        ],
        "decoys": [
            (
                '    def call(self, func):\n        if self.state == "OPEN":\n            return None\n        try:\n            return func()\n        except Exception:\n            self.fail_count += 1\n            return None',
                "A circuit breaker that never transitions to HALF_OPEN will stay OPEN forever once tripped. The HALF_OPEN state is essential — it allows a probe request to test if the downstream service has recovered.",
            ),
            (
                '    def call(self, func):\n        try:\n            result = func()\n            self.fail_count = 0\n            return result\n        except Exception:\n            self.fail_count += 1\n            return None',
                "Without an OPEN state, the breaker keeps hammering a failing service. The whole point of a circuit breaker is to STOP sending requests once the failure threshold is crossed, giving the service time to recover.",
            ),
        ],
        "output": "CLOSED->OPEN(fails=3)\nOPEN->HALF_OPEN\nHALF_OPEN->CLOSED\nResults: [None, None, None, None, 'OK']",
        "hint": "CLOSED: requests pass through, failures counted. At threshold → OPEN. On next call in OPEN → HALF_OPEN (probe). If probe succeeds → CLOSED. If probe fails → back to OPEN.",
        "success": "You built a circuit breaker state machine — the critical resilience pattern that prevents cascading failures across microservices!",
    },
    # ── Day 50: Milestone — Event-Driven Microservice & gRPC Gateway ────
    {
        "day": 50,
        "title": "Event-Driven Microservice with gRPC Gateway Engine",
        "mission": "Build a mini system: a gRPC gateway receives an order, publishes it to an event bus, and a downstream inventory service consumes and processes it.",
        "labels": [
            "Define the event bus (simulated Kafka topic)",
            "Define the inventory service consumer",
            "Define the gRPC gateway that publishes events",
            "Process an order through the gateway",
            "Consume events and print results",
        ],
        "blocks": [
            'class EventBus:\n    def __init__(self):\n        self.events = []\n    def publish(self, event_type, payload):\n        self.events.append({"type": event_type, "payload": payload})\n    def consume(self):\n        while self.events:\n            yield self.events.pop(0)',
            'class InventoryService:\n    def __init__(self):\n        self.processed = []\n    def handle(self, event):\n        item = event["payload"]["item"]\n        qty = event["payload"]["qty"]\n        self.processed.append(f"{item}(x{qty})")\n        return f"reserved:{item}"',
            'class OrderGateway:\n    def __init__(self, bus):\n        self.bus = bus\n    def CreateOrder(self, request):\n        self.bus.publish("ORDER_CREATED", request)\n        return {"status": "ACCEPTED", "order": request["item"]}',
            'bus = EventBus()\ngateway = OrderGateway(bus)\nfor item, qty in [("Widget", 5), ("Gadget", 3)]:\n    resp = gateway.CreateOrder({"item": item, "qty": qty})\n    print(f"Gateway: {resp[\'status\']} {resp[\'order\']}")',
            'inventory = InventoryService()\nfor event in bus.consume():\n    inventory.handle(event)\nprint(f"Inventory: {inventory.processed}")',
        ],
        "decoys": [
            (
                'class OrderGateway:\n    def __init__(self, bus):\n        self.bus = bus\n    def CreateOrder(self, request):\n        return {"status": "ACCEPTED", "order": request["item"]}',
                "The gateway must publish to the event bus before responding — without publishing, downstream services never learn about the order. Event-driven architecture requires events to actually be emitted.",
            ),
            (
                'for event in bus.events:\n    inventory.handle(event)',
                "Iterating over the event list directly does not consume the events. A proper consumer must dequeue events so they are not reprocessed, simulating Kafka's offset-based consumption.",
            ),
        ],
        "output": "Gateway: ACCEPTED Widget\nGateway: ACCEPTED Gadget\nInventory: ['Widget(x5)', 'Gadget(x3)']",
        "hint": "The gateway acts as a gRPC entry point that publishes domain events. The event bus decouples producer and consumer. The inventory service processes events asynchronously.",
        "success": "You wired a gRPC gateway to an event-driven backbone — the architecture pattern behind high-throughput order processing systems!",
    },
    # ── Day 51: OpenTelemetry Distributed Tracing ────────────────────────
    {
        "day": 51,
        "title": "Distributed Trace with W3C TraceContext Propagation",
        "mission": "Simulate OpenTelemetry tracing: create a trace with parent and child spans, propagate trace context (trace_id + span_id) across service boundaries, and print the trace tree.",
        "labels": [
            "Define the Tracer that creates spans with context",
            "Define the Span class with parent linking",
            "Create root span and child spans simulating cross-service calls",
            "Build the trace tree from collected spans",
            "Print the trace hierarchy",
        ],
        "blocks": [
            'import hashlib\nclass Tracer:\n    def __init__(self, service):\n        self.service = service\n        self.spans = []\n        self._counter = 0\n    def start_span(self, name, parent=None):\n        self._counter += 1\n        sid = f"{self.service[0]}{self._counter}"\n        trace_id = parent.trace_id if parent else "trace_001"\n        span = Span(name, sid, trace_id, parent.span_id if parent else None, self.service)\n        self.spans.append(span)\n        return span',
            'class Span:\n    def __init__(self, name, span_id, trace_id, parent_id, service):\n        self.name = name\n        self.span_id = span_id\n        self.trace_id = trace_id\n        self.parent_id = parent_id\n        self.service = service',
            'api_tracer = Tracer("api-gateway")\ndb_tracer = Tracer("db-service")\nroot = api_tracer.start_span("handle_request")\nauth = api_tracer.start_span("authenticate", parent=root)\ndb_query = db_tracer.start_span("SELECT_user", parent=root)',
            'all_spans = api_tracer.spans + db_tracer.spans\ntree = {}\nfor s in all_spans:\n    tree.setdefault(s.parent_id, []).append(s)',
            'def print_tree(parent_id, depth=0):\n    for s in tree.get(parent_id, []):\n        indent = "  " * depth\n        print(f"{indent}[{s.service}] {s.name} (span={s.span_id}, trace={s.trace_id})")\n        print_tree(s.span_id, depth + 1)\nprint_tree(None)',
        ],
        "decoys": [
            (
                '    def start_span(self, name, parent=None):\n        self._counter += 1\n        sid = f"{self.service[0]}{self._counter}"\n        trace_id = f"trace_{self._counter}"\n        span = Span(name, sid, trace_id, None, self.service)\n        self.spans.append(span)\n        return span',
                "Each span must NOT create a new trace_id — all spans in a distributed trace share the SAME trace_id inherited from the root. Generating new trace_ids breaks trace correlation across services.",
            ),
            (
                'db_query = db_tracer.start_span("SELECT_user")',
                "Cross-service spans must propagate the parent context (trace_id + parent span_id). Without passing the parent, this span becomes an orphan trace disconnected from the request flow.",
            ),
        ],
        "output": "[api-gateway] handle_request (span=a1, trace=trace_001)\n  [api-gateway] authenticate (span=a2, trace=trace_001)\n  [db-service] SELECT_user (span=d1, trace=trace_001)",
        "hint": "In distributed tracing, ALL spans share one trace_id from the root. Child spans reference their parent's span_id. W3C TraceContext propagates this across service boundaries.",
        "success": "You simulated OpenTelemetry distributed tracing with W3C context propagation — the standard for observing requests across microservices!",
    },
    # ── Day 52: Prometheus Metrics & RED Method ──────────────────────────
    {
        "day": 52,
        "title": "Prometheus RED Metrics Instrumentation",
        "mission": "Simulate Prometheus counter and histogram metrics to implement the RED method: track Request rate, Error rate, and Duration for an API endpoint.",
        "labels": [
            "Define Counter and Histogram metric classes",
            "Define the instrumented endpoint handler",
            "Simulate request traffic with varying outcomes",
            "Calculate RED metrics from the collected data",
            "Print the RED method summary",
        ],
        "blocks": [
            'class Counter:\n    def __init__(self, name):\n        self.name = name\n        self.values = {}\n    def inc(self, labels):\n        key = tuple(sorted(labels.items()))\n        self.values[key] = self.values.get(key, 0) + 1\n    def get(self, labels):\n        return self.values.get(tuple(sorted(labels.items())), 0)\n\nclass Histogram:\n    def __init__(self, name):\n        self.name = name\n        self.observations = []\n    def observe(self, value):\n        self.observations.append(value)',
            'requests_total = Counter("http_requests_total")\nrequest_duration = Histogram("http_request_duration_seconds")\n\ndef handle_request(method, status, duration):\n    requests_total.inc({"method": method, "status": str(status)})\n    request_duration.observe(duration)',
            'traffic = [\n    ("GET", 200, 0.05), ("GET", 200, 0.12),\n    ("POST", 201, 0.20), ("GET", 500, 0.80),\n    ("POST", 201, 0.15), ("GET", 200, 0.03),\n]\nfor method, status, dur in traffic:\n    handle_request(method, status, dur)',
            'total = sum(requests_total.values.values())\nerrors = requests_total.get({"method": "GET", "status": "500"})\navg_dur = sum(request_duration.observations) / len(request_duration.observations)',
            'print(f"Rate: {total} requests")\nprint(f"Errors: {errors}/{total} ({errors/total*100:.1f}%)")\nprint(f"Duration: {avg_dur:.3f}s avg")',
        ],
        "decoys": [
            (
                'class Counter:\n    def __init__(self, name):\n        self.name = name\n        self.value = 0\n    def inc(self, labels):\n        self.value += 1',
                "A Prometheus counter without label support cannot differentiate between status codes or methods. Labels are essential for computing error rates — you need to count 200s and 500s separately.",
            ),
            (
                'errors = requests_total.get({"status": "500"})',
                "Missing the 'method' label in the query changes the label set key. Prometheus queries must match the exact label set used during recording, or the lookup returns zero.",
            ),
        ],
        "output": "Rate: 6 requests\nErrors: 1/6 (16.7%)\nDuration: 0.225s avg",
        "hint": "RED method: Rate (total requests), Errors (failed requests), Duration (latency distribution). Prometheus counters track counts by labels; histograms track value distributions.",
        "success": "You instrumented RED metrics like a Prometheus pro — the golden signals for monitoring any request-driven microservice!",
    },
    # ── Day 53: Structured Logging & Correlation IDs ─────────────────────
    {
        "day": 53,
        "title": "Structured JSON Logging with Correlation IDs",
        "mission": "Implement structured logging that attaches a correlation ID to every log entry across a simulated multi-service request, enabling end-to-end request tracing in log aggregators.",
        "labels": [
            "Define the structured logger with JSON output",
            "Create the correlation context manager",
            "Log across two simulated services with shared correlation ID",
            "Collect and print all log entries",
            "Print correlation ID consistency check",
        ],
        "blocks": [
            'import json\n\nclass StructuredLogger:\n    def __init__(self, service):\n        self.service = service\n        self.entries = []\n    def log(self, level, msg, correlation_id, **extra):\n        entry = {"service": self.service, "level": level,\n                 "msg": msg, "correlation_id": correlation_id}\n        entry.update(extra)\n        self.entries.append(entry)',
            'def create_correlation_id(request_id):\n    return f"corr-{request_id}"',
            'api_log = StructuredLogger("api")\ndb_log = StructuredLogger("db")\ncorr_id = create_correlation_id("req-42")\napi_log.log("INFO", "request received", corr_id, path="/users")\ndb_log.log("INFO", "query executed", corr_id, table="users", rows=5)\napi_log.log("INFO", "response sent", corr_id, status=200)',
            'all_logs = api_log.entries + db_log.entries\nfor entry in all_logs:\n    print(json.dumps(entry, separators=(",", ":")))',
            'ids = {e["correlation_id"] for e in all_logs}\nprint(f"Unique correlation IDs: {len(ids)}, consistent: {len(ids) == 1}")',
        ],
        "decoys": [
            (
                'def create_correlation_id(request_id):\n    import random\n    return f"corr-{random.randint(1000,9999)}"',
                "Random correlation IDs make it impossible to correlate logs across services. The correlation ID must be deterministic and shared — derived from the original request ID and propagated to every service.",
            ),
            (
                '    def log(self, level, msg, **extra):\n        entry = {"service": self.service, "level": level, "msg": msg}\n        entry.update(extra)\n        self.entries.append(entry)',
                "Omitting the correlation_id parameter from log entries defeats the purpose of structured logging for distributed tracing. Every log entry must carry the correlation ID for log aggregation tools to link them.",
            ),
        ],
        "output": '{"service":"api","level":"INFO","msg":"request received","correlation_id":"corr-req-42","path":"/users"}\n{"service":"db","level":"INFO","msg":"query executed","correlation_id":"corr-req-42","table":"users","rows":5}\n{"service":"api","level":"INFO","msg":"response sent","correlation_id":"corr-req-42","status":200}\nUnique correlation IDs: 1, consistent: True',
        "hint": "Structured logging outputs JSON so log aggregators (ELK, Loki) can parse fields. The correlation ID is generated once per request and propagated to all downstream services.",
        "success": "You built structured logging with correlation IDs — the essential technique for tracing requests across distributed microservices in production!",
    },
    # ── Day 54: Health Checks, K8s Probes & Graceful Draining ────────────
    {
        "day": 54,
        "title": "Kubernetes Health Probes & Graceful Shutdown",
        "mission": "Simulate Kubernetes liveness, readiness, and startup probes for a microservice, then demonstrate graceful draining where the service stops accepting new requests before shutting down.",
        "labels": [
            "Define the service with health probe endpoints",
            "Implement the graceful drain lifecycle",
            "Run startup sequence and check probes",
            "Initiate drain and verify probe changes",
            "Print the full lifecycle log",
        ],
        "blocks": [
            'class Microservice:\n    def __init__(self, name):\n        self.name = name\n        self.started = False\n        self.ready = False\n        self.draining = False\n        self.log = []\n    def liveness(self):\n        return {"status": "ok" if self.started else "fail"}\n    def readiness(self):\n        return {"status": "ok" if (self.ready and not self.draining) else "fail"}\n    def startup(self):\n        return {"status": "ok" if self.started else "fail"}',
            '    def boot(self):\n        self.started = True\n        self.log.append("STARTED")\n        self.ready = True\n        self.log.append("READY")\n    def drain(self):\n        self.draining = True\n        self.ready = False\n        self.log.append("DRAINING")\n    def shutdown(self):\n        self.started = False\n        self.log.append("SHUTDOWN")',
            'svc = Microservice("order-svc")\nsvc.boot()\nprint(f"After boot -> live:{svc.liveness()[\'status\']}, ready:{svc.readiness()[\'status\']}")',
            'svc.drain()\nprint(f"Draining -> live:{svc.liveness()[\'status\']}, ready:{svc.readiness()[\'status\']}")\nsvc.shutdown()\nprint(f"Shutdown -> live:{svc.liveness()[\'status\']}, ready:{svc.readiness()[\'status\']}")',
            'print(f"Lifecycle: {svc.log}")',
        ],
        "decoys": [
            (
                '    def drain(self):\n        self.started = False\n        self.ready = False\n        self.log.append("SHUTDOWN")',
                "Drain must NOT kill the process immediately. The liveness probe must still return 'ok' during draining so Kubernetes does not restart the pod. Only readiness becomes 'fail' to stop new traffic while in-flight requests complete.",
            ),
            (
                '    def readiness(self):\n        return {"status": "ok" if self.started else "fail"}',
                "Readiness must also check the draining flag. A service that is draining should report NOT ready so the load balancer removes it from rotation, even though it is still alive and processing in-flight requests.",
            ),
        ],
        "output": "After boot -> live:ok, ready:ok\nDraining -> live:ok, ready:fail\nShutdown -> live:fail, ready:fail\nLifecycle: ['STARTED', 'READY', 'DRAINING', 'SHUTDOWN']",
        "hint": "Liveness = is the process alive? Readiness = can it accept traffic? During graceful drain, liveness stays 'ok' (don't restart me) but readiness becomes 'fail' (stop sending traffic).",
        "success": "You mastered Kubernetes health probes and graceful shutdown — critical for zero-downtime deployments in production!",
    },
    # ── Day 55: Milestone — Observability & SRE Telemetry Suite ──────────
    {
        "day": 55,
        "title": "Production Observability & SRE Telemetry Suite",
        "mission": "Combine tracing, metrics, and structured logging into a unified observability pipeline: instrument a request that generates a trace span, increments RED metrics, and emits correlated structured logs.",
        "labels": [
            "Define the unified telemetry collector",
            "Define the instrumented request handler",
            "Process a request through the instrumented handler",
            "Collect and format all telemetry signals",
            "Print the unified observability report",
        ],
        "blocks": [
            'import json\n\nclass TelemetryCollector:\n    def __init__(self):\n        self.traces = []\n        self.metrics = {"requests": 0, "errors": 0, "durations": []}\n        self.logs = []',
            'def handle(collector, path, status, duration, corr_id):\n    collector.traces.append({"span": f"handle_{path}", "trace_id": corr_id})\n    collector.metrics["requests"] += 1\n    if status >= 500:\n        collector.metrics["errors"] += 1\n    collector.metrics["durations"].append(duration)\n    collector.logs.append(json.dumps(\n        {"corr_id": corr_id, "path": path, "status": status},\n        separators=(",", ":")))',
            'tc = TelemetryCollector()\nhandle(tc, "/api/orders", 200, 0.05, "corr-1")\nhandle(tc, "/api/pay", 500, 0.90, "corr-2")\nhandle(tc, "/api/orders", 200, 0.10, "corr-3")',
            'avg_dur = sum(tc.metrics["durations"]) / len(tc.metrics["durations"])\nerr_rate = tc.metrics["errors"] / tc.metrics["requests"] * 100',
            'print(f"Traces: {len(tc.traces)} spans")\nprint(f"RED -> R:{tc.metrics[\'requests\']} E:{tc.metrics[\'errors\']}({err_rate:.0f}%) D:{avg_dur:.2f}s")\nfor log in tc.logs:\n    print(f"Log: {log}")',
        ],
        "decoys": [
            (
                'def handle(collector, path, status, duration, corr_id):\n    collector.metrics["requests"] += 1\n    collector.metrics["durations"].append(duration)\n    collector.logs.append(f"{path} {status}")',
                "This handler is missing trace span creation and error counting. The three pillars of observability require ALL signals — traces, metrics, AND logs — to be emitted together for full request visibility.",
            ),
            (
                'err_rate = tc.metrics["errors"] / tc.metrics["requests"]',
                "Forgetting to multiply by 100 reports the error rate as a decimal (0.33) instead of a percentage (33%). SRE dashboards display error rates as percentages for quick human interpretation.",
            ),
        ],
        "output": 'Traces: 3 spans\nRED -> R:3 E:1(33%) D:0.35s\nLog: {"corr_id":"corr-1","path":"/api/orders","status":200}\nLog: {"corr_id":"corr-2","path":"/api/pay","status":500}\nLog: {"corr_id":"corr-3","path":"/api/orders","status":200}',
        "hint": "The three pillars of observability: Traces (request flow), Metrics (aggregated numbers), Logs (detailed events). All must share a correlation ID for unified analysis.",
        "success": "You built a complete SRE observability suite combining traces, RED metrics, and structured logs — the three pillars of production monitoring!",
    },
    # ── Day 56: Case Study — Fintech Transactional Ledger ────────────────
    {
        "day": 56,
        "title": "High-Frequency Fintech Transactional Ledger",
        "mission": "Build a double-entry bookkeeping ledger that ensures every transaction creates balanced debit and credit entries, with an immutable audit trail and balance computation.",
        "labels": [
            "Define the Ledger with double-entry enforcement",
            "Define the balance calculation method",
            "Post transactions to the ledger",
            "Calculate balances for all accounts",
            "Print the audit trail and balances",
        ],
        "blocks": [
            'class Ledger:\n    def __init__(self):\n        self.entries = []\n        self.seq = 0\n    def post(self, debit_acct, credit_acct, amount, memo):\n        self.seq += 1\n        self.entries.append({"seq": self.seq, "account": debit_acct,\n            "type": "DEBIT", "amount": amount, "memo": memo})\n        self.entries.append({"seq": self.seq, "account": credit_acct,\n            "type": "CREDIT", "amount": amount, "memo": memo})',
            '    def balances(self):\n        bals = {}\n        for e in self.entries:\n            acct = e["account"]\n            bals.setdefault(acct, 0)\n            if e["type"] == "DEBIT":\n                bals[acct] += e["amount"]\n            else:\n                bals[acct] -= e["amount"]\n        return bals',
            'ledger = Ledger()\nledger.post("wallet:alice", "wallet:bob", 100, "payment")\nledger.post("wallet:bob", "fees:platform", 5, "fee")',
            'bals = ledger.balances()\nfor acct in sorted(bals):\n    print(f"{acct}: {bals[acct]:+d}")',
            'total = sum(bals.values())\nprint(f"Entries: {len(ledger.entries)}, Zero-sum: {total == 0}")',
        ],
        "decoys": [
            (
                '    def post(self, debit_acct, credit_acct, amount, memo):\n        self.seq += 1\n        self.entries.append({"seq": self.seq, "account": debit_acct,\n            "type": "DEBIT", "amount": amount, "memo": memo})',
                "Only recording the debit side violates double-entry bookkeeping. Every transaction MUST create both a debit AND a credit entry of equal amount — this is what ensures the ledger always sums to zero.",
            ),
            (
                '    def balances(self):\n        bals = {}\n        for e in self.entries:\n            bals[e["account"]] = e["amount"]\n        return bals',
                "Overwriting the balance with each entry loses accumulated history. Balances must be computed by summing all debits and subtracting all credits for each account across the full ledger.",
            ),
        ],
        "output": "fees:platform: -5\nwallet:alice: +100\nwallet:bob: -95\nEntries: 4, Zero-sum: True",
        "hint": "Double-entry bookkeeping: every transaction creates a debit in one account and a credit in another for the same amount. The sum of all balances must always be zero.",
        "success": "You built a double-entry ledger with zero-sum verification — the foundational pattern behind every fintech transaction system!",
    },
    # ── Day 57: Case Study — Real-Time Collaborative Streaming ───────────
    {
        "day": 57,
        "title": "Real-Time Collaborative Streaming Engine",
        "mission": "Build a CRDT-inspired last-writer-wins (LWW) register for real-time collaborative editing: multiple users can concurrently update a shared document and conflicts are resolved deterministically by timestamp.",
        "labels": [
            "Define the LWW Register CRDT",
            "Define the collaborative document with field-level CRDTs",
            "Apply concurrent edits from multiple users",
            "Merge two replicas to resolve conflicts",
            "Print the resolved document state",
        ],
        "blocks": [
            'class LWWRegister:\n    def __init__(self):\n        self.value = None\n        self.timestamp = 0\n    def update(self, value, timestamp):\n        if timestamp > self.timestamp:\n            self.value = value\n            self.timestamp = timestamp\n    def merge(self, other):\n        if other.timestamp > self.timestamp:\n            self.value = other.value\n            self.timestamp = other.timestamp',
            'class CollabDoc:\n    def __init__(self):\n        self.fields = {}\n    def set_field(self, field, value, timestamp):\n        if field not in self.fields:\n            self.fields[field] = LWWRegister()\n        self.fields[field].update(value, timestamp)\n    def merge(self, other):\n        for field, reg in other.fields.items():\n            if field not in self.fields:\n                self.fields[field] = LWWRegister()\n            self.fields[field].merge(reg)',
            'replica_a = CollabDoc()\nreplica_b = CollabDoc()\nreplica_a.set_field("title", "Draft v1", timestamp=1)\nreplica_b.set_field("title", "Draft v2", timestamp=3)\nreplica_a.set_field("title", "Draft v3", timestamp=2)\nreplica_a.set_field("body", "Hello world", timestamp=1)',
            'replica_a.merge(replica_b)',
            'for field in sorted(replica_a.fields):\n    reg = replica_a.fields[field]\n    print(f"{field}: \'{reg.value}\' (t={reg.timestamp})")',
        ],
        "decoys": [
            (
                '    def update(self, value, timestamp):\n        self.value = value\n        self.timestamp = timestamp',
                "Blindly overwriting without comparing timestamps causes last-call-wins instead of last-writer-wins. The LWW Register MUST compare timestamps and only accept the update if it is newer.",
            ),
            (
                '    def merge(self, other):\n        self.value = other.value\n        self.timestamp = other.timestamp',
                "Merging without comparing timestamps means the 'other' replica always wins regardless of recency. CRDT merge must pick the value with the higher timestamp for convergence.",
            ),
        ],
        "output": "body: 'Hello world' (t=1)\ntitle: 'Draft v2' (t=3)",
        "hint": "LWW Register: each update carries a timestamp. On update or merge, the higher timestamp wins. This ensures all replicas converge to the same state — the core of CRDTs.",
        "success": "You built a CRDT-based collaborative document — the conflict resolution strategy behind Google Docs, Figma, and real-time collaborative editors!",
    },
    # ── Day 58: Case Study — Global E-Commerce Flash Sale ────────────────
    {
        "day": 58,
        "title": "Global E-Commerce Flash Sale Architecture",
        "mission": "Build a flash sale system with atomic inventory reservation, per-user purchase limits, and an ordered queue — ensuring no overselling even under concurrent demand.",
        "labels": [
            "Define the inventory with atomic reservation",
            "Define the sale controller with per-user limits",
            "Process a burst of flash sale purchase attempts",
            "Summarize sale results",
            "Print the final sale report",
        ],
        "blocks": [
            'class Inventory:\n    def __init__(self, stock):\n        self.stock = stock\n        self.reserved = 0\n    def try_reserve(self, qty):\n        if self.reserved + qty <= self.stock:\n            self.reserved += qty\n            return True\n        return False\n    def available(self):\n        return self.stock - self.reserved',
            'class FlashSale:\n    def __init__(self, inventory, max_per_user=1):\n        self.inventory = inventory\n        self.max_per_user = max_per_user\n        self.purchases = {}\n        self.log = []\n    def attempt(self, user_id):\n        bought = self.purchases.get(user_id, 0)\n        if bought >= self.max_per_user:\n            self.log.append((user_id, "LIMIT_EXCEEDED"))\n            return False\n        if not self.inventory.try_reserve(1):\n            self.log.append((user_id, "SOLD_OUT"))\n            return False\n        self.purchases[user_id] = bought + 1\n        self.log.append((user_id, "SUCCESS"))\n        return True',
            'inv = Inventory(stock=3)\nsale = FlashSale(inv, max_per_user=1)\nbuyers = ["alice", "bob", "alice", "carol", "dave"]',
            'for buyer in buyers:\n    sale.attempt(buyer)',
            'for user, status in sale.log:\n    print(f"{user}: {status}")\nprint(f"Remaining: {inv.available()}")',
        ],
        "decoys": [
            (
                '    def try_reserve(self, qty):\n        self.reserved += qty\n        return True',
                "Reserving without checking available stock causes overselling — the cardinal sin of flash sales. Atomic reservation must verify stock BEFORE committing, or you sell inventory you do not have.",
            ),
            (
                '    def attempt(self, user_id):\n        if not self.inventory.try_reserve(1):\n            self.log.append((user_id, "SOLD_OUT"))\n            return False\n        self.purchases[user_id] = self.purchases.get(user_id, 0) + 1\n        self.log.append((user_id, "SUCCESS"))\n        return True',
                "Skipping the per-user limit check lets a single user buy the entire inventory. Flash sales enforce purchase limits to ensure fair distribution across customers.",
            ),
        ],
        "output": "alice: SUCCESS\nbob: SUCCESS\nalice: LIMIT_EXCEEDED\ncarol: SUCCESS\ndave: SOLD_OUT\nRemaining: 0",
        "hint": "Flash sale architecture: atomic inventory reservation (check-then-reserve), per-user purchase limits, and ordered queue processing. No overselling, no hoarding.",
        "success": "You built a flash sale system with atomic reservation and fairness controls — the architecture behind Black Friday and limited-edition product drops!",
    },
    # ── Day 59: RFC & System Design Defense ──────────────────────────────
    {
        "day": 59,
        "title": "Principal Architect RFC: System Design Decision Record",
        "mission": "Create an Architectural Decision Record (ADR) as structured data: define the context, decision, alternatives considered, and consequences — the format used by principal architects to propose and defend system designs.",
        "labels": [
            "Define the ADR schema and builder",
            "Build the ADR for a database selection decision",
            "Add alternatives considered with trade-off analysis",
            "Render the ADR as a formatted document",
            "Print the complete ADR",
        ],
        "blocks": [
            'class ADR:\n    def __init__(self, title, status="PROPOSED"):\n        self.title = title\n        self.status = status\n        self.context = ""\n        self.decision = ""\n        self.alternatives = []\n        self.consequences = []\n    def add_alternative(self, name, pros, cons):\n        self.alternatives.append({"name": name, "pros": pros, "cons": cons})',
            'adr = ADR("ADR-001: Primary Database Selection")\nadr.context = "Need sub-10ms reads at 50K RPS with strong consistency"\nadr.decision = "PostgreSQL with read replicas and connection pooling"\nadr.consequences = ["Operational complexity of replicas", "Well-understood failure modes"]',
            'adr.add_alternative("MongoDB", ["Flexible schema"], ["Weak consistency model"])\nadr.add_alternative("DynamoDB", ["Auto-scaling"], ["Vendor lock-in"])\nadr.status = "ACCEPTED"',
            'def render_adr(adr):\n    lines = [f"# {adr.title}", f"Status: {adr.status}", f"Context: {adr.context}",\n             f"Decision: {adr.decision}"]\n    lines.append("Alternatives:")\n    for alt in adr.alternatives:\n        lines.append(f"  - {alt[\'name\']}: +{alt[\'pros\'][0]} / -{alt[\'cons\'][0]}")\n    lines.append("Consequences:")\n    for c in adr.consequences:\n        lines.append(f"  * {c}")\n    return "\\n".join(lines)',
            'print(render_adr(adr))',
        ],
        "decoys": [
            (
                'adr = ADR("ADR-001: Primary Database Selection")\nadr.decision = "PostgreSQL with read replicas and connection pooling"',
                "An ADR without context is incomplete and undefendable. The context section is critical — it documents the constraints and requirements that justify WHY this decision was made, which is the whole point of an ADR.",
            ),
            (
                'def render_adr(adr):\n    return f"{adr.title}: {adr.decision}"',
                "Rendering only the title and decision strips away the architectural reasoning. ADRs must include context, alternatives, and consequences — stakeholders need to understand the trade-offs considered.",
            ),
        ],
        "output": "# ADR-001: Primary Database Selection\nStatus: ACCEPTED\nContext: Need sub-10ms reads at 50K RPS with strong consistency\nDecision: PostgreSQL with read replicas and connection pooling\nAlternatives:\n  - MongoDB: +Flexible schema / -Weak consistency model\n  - DynamoDB: +Auto-scaling / -Vendor lock-in\nConsequences:\n  * Operational complexity of replicas\n  * Well-understood failure modes",
        "hint": "An ADR captures: Context (why), Decision (what), Alternatives (what else), Consequences (trade-offs). It is the written artifact of architectural thinking that survives long after the meeting ends.",
        "success": "You crafted an Architectural Decision Record — the communication tool that principal architects use to propose, defend, and document critical system design decisions!",
    },
    # ── Day 60: Capstone — ApexPython Distributed Platform ───────────────
    {
        "day": 60,
        "title": "ApexPython: Distributed Microservices Platform Master Capstone",
        "mission": "Build a mini distributed platform integrating the course's core patterns: an API gateway routes requests through a circuit breaker to a service, which logs with correlation IDs, emits RED metrics, and publishes events to a bus.",
        "labels": [
            "Define the event bus and metrics collector",
            "Define the circuit breaker and backend service",
            "Define the API gateway that orchestrates everything",
            "Process requests through the full platform",
            "Print the unified platform telemetry report",
        ],
        "blocks": [
            'import json\n\nclass EventBus:\n    def __init__(self):\n        self.events = []\n    def publish(self, evt):\n        self.events.append(evt)\n\nclass Metrics:\n    def __init__(self):\n        self.total = 0\n        self.errors = 0\n    def record(self, status):\n        self.total += 1\n        if status >= 500:\n            self.errors += 1',
            'class Breaker:\n    def __init__(self, threshold=2):\n        self.fails = 0\n        self.open = False\n    def call(self, fn):\n        if self.open:\n            return None, 503\n        try:\n            return fn(), 200\n        except Exception:\n            self.fails += 1\n            if self.fails >= self.threshold:\n                self.open = True\n            return None, 500\n    threshold = 2\n\nclass Service:\n    def __init__(self):\n        self.call_count = 0\n    def process(self):\n        self.call_count += 1\n        if self.call_count == 2:\n            raise RuntimeError("overload")\n        return {"result": f"ok-{self.call_count}"}',
            'class Gateway:\n    def __init__(self):\n        self.bus = EventBus()\n        self.metrics = Metrics()\n        self.breaker = Breaker()\n        self.service = Service()\n        self.logs = []\n    def handle(self, corr_id, path):\n        result, status = self.breaker.call(self.service.process)\n        self.metrics.record(status)\n        self.logs.append(json.dumps(\n            {"corr_id": corr_id, "path": path, "status": status},\n            separators=(",", ":")))\n        if status == 200:\n            self.bus.publish({"type": "REQUEST_OK", "corr_id": corr_id})\n        return status',
            'gw = Gateway()\nresults = []\nfor i in range(1, 5):\n    s = gw.handle(f"c-{i}", "/api/data")\n    results.append(s)',
            'print(f"Statuses: {results}")\nprint(f"RED -> R:{gw.metrics.total} E:{gw.metrics.errors}")\nprint(f"Events: {len(gw.bus.events)}")\nfor log in gw.logs:\n    print(f"Log: {log}")',
        ],
        "decoys": [
            (
                'class Gateway:\n    def __init__(self):\n        self.service = Service()\n    def handle(self, corr_id, path):\n        result = self.service.process()\n        return 200',
                "A gateway without a circuit breaker, metrics, event bus, or logging has zero production readiness. The capstone must integrate ALL the observability and resilience patterns taught throughout the course.",
            ),
            (
                '    def handle(self, corr_id, path):\n        result, status = self.breaker.call(self.service.process)\n        return status',
                "Returning status without recording metrics, logging, or publishing events means the platform has no observability. In production you are flying blind — traces, metrics, and logs are non-negotiable.",
            ),
        ],
        "output": 'Statuses: [200, 500, 503, 503]\nRED -> R:4 E:3\nEvents: 1\nLog: {"corr_id":"c-1","path":"/api/data","status":200}\nLog: {"corr_id":"c-2","path":"/api/data","status":500}\nLog: {"corr_id":"c-3","path":"/api/data","status":503}\nLog: {"corr_id":"c-4","path":"/api/data","status":503}',
        "hint": "The capstone integrates: API Gateway → Circuit Breaker → Service → Event Bus + RED Metrics + Structured Logs. Every request flows through all layers, producing unified telemetry.",
        "success": "Congratulations! You built the ApexPython Distributed Platform — integrating gRPC patterns, circuit breakers, event-driven architecture, RED metrics, and structured logging into a production-grade microservices backend!",
    },
]
