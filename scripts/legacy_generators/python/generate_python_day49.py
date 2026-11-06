#!/usr/bin/env python3
"""
Final calibrated generator for Day 49: Microservice Resilience: Circuit Breakers, Bulkheads & Rate Limiting
Course 20: Python Programming & Backend Systems (course-python-backend)
"""
import json
import math
import sys
import io

def count_words(text_or_list):
    if isinstance(text_or_list, list):
        return sum(len(str(p).split()) for p in text_or_list)
    return len(str(text_or_list).split())

def count_all_lesson_words(lesson):
    total = 0
    total += count_words(lesson.get("title", ""))
    total += count_words(lesson.get("goal", ""))
    total += count_words(lesson.get("recap", ""))
    total += count_words(lesson.get("summary", []))
    if "projectStep" in lesson:
        ps = lesson["projectStep"]
        total += count_words(ps.get("title", ""))
        total += count_words(ps.get("steps", []))
    for part in lesson.get("parts", []):
        total += count_words(part.get("title", ""))
        total += count_words(part.get("say", []))
        total += count_words(part.get("example", ""))
        total += count_words(part.get("code", ""))
        total += count_words(part.get("output", ""))
        total += count_words(part.get("codeNotes", []))
        total += count_words(part.get("tryIt", ""))
        check = part.get("check", {})
        total += count_words(check.get("question", ""))
        total += count_words(check.get("options", []))
        total += count_words(check.get("why", ""))
    return total

def estimate_spoken_minutes(lesson):
    words = sum(count_words(part.get("say", [])) for part in lesson.get("parts", []))
    return math.ceil(words / 110.0)

def estimate_lesson_minutes(lesson):
    total_words = count_all_lesson_words(lesson)
    return math.ceil(total_words / 125.0)

d49_part1_code = '''class CircuitState:
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"

class CircuitBreaker:
    def __init__(self, failure_threshold=3, recovery_time_s=5):
        self.state = CircuitState.CLOSED
        self.failure_threshold = failure_threshold
        self.recovery_time_s = recovery_time_s
        self.failure_count = 0
        self.last_failure_time = 0
        self.current_time = 1000.0

    def call(self, func, *args, **kwargs):
        # Check state transitions
        if self.state == CircuitState.OPEN:
            if self.current_time - self.last_failure_time >= self.recovery_time_s:
                self.state = CircuitState.HALF_OPEN
                print(f"[CIRCUIT] Recovery time elapsed -> State transition to {self.state}")
            else:
                return f"FAST_FAIL: Circuit is OPEN (retry in {int(self.recovery_time_s - (self.current_time - self.last_failure_time))}s)"

        try:
            res = func(*args, **kwargs)
            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                print(f"[CIRCUIT] Canary request succeeded -> State healed to {self.state}")
            return res
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = self.current_time
            if self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
                print(f"[CIRCUIT] Failure threshold {self.failure_threshold} reached -> Circuit TRIPPED to {self.state}")
            return f"ERROR: {e}"

cb = CircuitBreaker(failure_threshold=3, recovery_time_s=5)

def flaky_service(fail=False):
    if fail:
        raise RuntimeError("Downstream Service Unavailable (503)")
    return "200 OK: Response Data"

# 1. Normal calls
print("Req 1:", cb.call(flaky_service, fail=False))

# 2. Trigger failures
for i in range(3):
    print(f"Req {i+2}:", cb.call(flaky_service, fail=True))

# 3. Fast fail while open
cb.current_time += 2.0
print("Req 5:", cb.call(flaky_service, fail=False))

# 4. Advance time past recovery -> Canary probe
cb.current_time += 4.0
print("Req 6:", cb.call(flaky_service, fail=False))
print("Req 7:", cb.call(flaky_service, fail=False))'''

d49_part1_output = '''Req 1: 200 OK: Response Data
Req 2: ERROR: Downstream Service Unavailable (503)
Req 3: ERROR: Downstream Service Unavailable (503)
[CIRCUIT] Failure threshold 3 reached -> Circuit TRIPPED to OPEN
Req 4: ERROR: Downstream Service Unavailable (503)
Req 5: FAST_FAIL: Circuit is OPEN (retry in 3s)
[CIRCUIT] Recovery time elapsed -> State transition to HALF_OPEN
[CIRCUIT] Canary request succeeded -> State healed to CLOSED
Req 6: 200 OK: Response Data
Req 7: 200 OK: Response Data'''

d49_part2_code = '''class BulkheadPool:
    def __init__(self, name, max_concurrent=2, max_queue=2):
        self.name = name
        self.max_concurrent = max_concurrent
        self.max_queue = max_queue
        self.active = 0
        self.queued = 0

    def execute(self, task_name):
        if self.active < self.max_concurrent:
            self.active += 1
            return f"[{self.name}] EXECUTING '{task_name}' (Active: {self.active}/{self.max_concurrent})"
        elif self.queued < self.max_queue:
            self.queued += 1
            return f"[{self.name}] QUEUED '{task_name}' (Queue: {self.queued}/{self.max_queue})"
        else:
            return f"[{self.name}] REJECTED '{task_name}': Bulkhead Capacity Saturated"

billing_bulkhead = BulkheadPool("BillingPool", max_concurrent=2, max_queue=1)
recs_bulkhead = BulkheadPool("RecommendationPool", max_concurrent=2, max_queue=1)

# Saturate Recommendation pool
print(recs_bulkhead.execute("Rec_1"))
print(recs_bulkhead.execute("Rec_2"))
print(recs_bulkhead.execute("Rec_3"))
print(recs_bulkhead.execute("Rec_4"))

# Billing pool remains completely unaffected and isolated
print(billing_bulkhead.execute("Checkout_Order_101"))
print(billing_bulkhead.execute("Checkout_Order_102"))
print("Bulkhead Invariant: Failing recommendations cannot starve mission-critical checkout threads.")'''

d49_part2_output = '''[RecommendationPool] EXECUTING 'Rec_1' (Active: 1/2)
[RecommendationPool] EXECUTING 'Rec_2' (Active: 2/2)
[RecommendationPool] QUEUED 'Rec_3' (Queue: 1/1)
[RecommendationPool] REJECTED 'Rec_4': Bulkhead Capacity Saturated
[BillingPool] EXECUTING 'Checkout_Order_101' (Active: 1/2)
[BillingPool] EXECUTING 'Checkout_Order_102' (Active: 2/2)
Bulkhead Invariant: Failing recommendations cannot starve mission-critical checkout threads.'''

d49_part3_code = '''class TokenBucketRateLimiter:
    def __init__(self, capacity=3, refill_rate=1.0):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill = 0.0
        self.current_time = 0.0

    def allow_request(self, tokens_requested=1):
        elapsed = self.current_time - self.last_refill
        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.refill_rate)
        self.last_refill = self.current_time

        if self.tokens >= tokens_requested:
            self.tokens -= tokens_requested
            return True, round(self.tokens, 1)
        return False, round(self.tokens, 1)

limiter = TokenBucketRateLimiter(capacity=3, refill_rate=1.0)
# Burst 4 requests at t=0
for i in range(1, 5):
    allowed, remaining = limiter.allow_request(1)
    status = "ALLOWED" if allowed else "RATE_LIMITED (429)"
    print(f"Req {i} at t=0.0s: {status} | Tokens remaining: {remaining}")

# Advance time by 2.0s (refills 2 tokens)
limiter.current_time = 2.0
allowed, remaining = limiter.allow_request(1)
print(f"Req 5 at t=2.0s: {'ALLOWED' if allowed else 'RATE_LIMITED'} | Tokens remaining: {remaining}")
print("Rate Limiter Invariant: Smooth token replenishment handles bursts while capping sustained throughput.")'''

d49_part3_output = '''Req 1 at t=0.0s: ALLOWED | Tokens remaining: 2.0
Req 2 at t=0.0s: ALLOWED | Tokens remaining: 1.0
Req 3 at t=0.0s: ALLOWED | Tokens remaining: 0.0
Req 4 at t=0.0s: RATE_LIMITED (429) | Tokens remaining: 0.0
Req 5 at t=2.0s: ALLOWED | Tokens remaining: 1.0
Rate Limiter Invariant: Smooth token replenishment handles bursts while capping sustained throughput.'''

d49_part4_code = '''class ResilientMeshClient:
    def __init__(self, name, max_concurrency=2, failure_limit=2):
        self.name = name
        self.active_calls = 0
        self.max_concurrency = max_concurrency
        self.circuit_open = False
        self.failures = 0
        self.failure_limit = failure_limit

    def call_service(self, operation, fail=False):
        if self.circuit_open:
            return f"[{self.name}] FAST_FAIL: Circuit OPEN -> Falling back to degraded response"

        if self.active_calls >= self.max_concurrency:
            return f"[{self.name}] REJECTED: Bulkhead saturated ({self.active_calls}/{self.max_concurrency})"

        self.active_calls += 1
        try:
            if fail:
                self.failures += 1
                if self.failures >= self.failure_limit:
                    self.circuit_open = True
                    print(f"[{self.name}] ALARM: Failure threshold reached -> Circuit tripped to OPEN")
                return f"[{self.name}] ERROR: Downstream timeout"
            return f"[{self.name}] SUCCESS: '{operation}' completed"
        finally:
            self.active_calls -= 1

client = ResilientMeshClient("InventoryClient", max_concurrency=2, failure_limit=2)
print(client.call_service("CheckStock_1", fail=False))
print(client.call_service("CheckStock_2", fail=True))
print(client.call_service("CheckStock_3", fail=True))
print(client.call_service("CheckStock_4", fail=False))
print("Resilience Composition: Circuit breaker and bulkhead shield calling process from latency cascading.")'''

d49_part4_output = '''[InventoryClient] SUCCESS: 'CheckStock_1' completed
[InventoryClient] ERROR: Downstream timeout
[InventoryClient] ALARM: Failure threshold reached -> Circuit tripped to OPEN
[InventoryClient] ERROR: Downstream timeout
[InventoryClient] FAST_FAIL: Circuit OPEN -> Falling back to degraded response
Resilience Composition: Circuit breaker and bulkhead shield calling process from latency cascading.'''

d49_part5_code = '''class ProductionGatewaySimulator:
    def __init__(self):
        self.successful_orders = 0
        self.isolated_shipping_errors = 0
        self.cached_shipping_fallbacks = 0
        self.circuit_tripped = False

    def process_checkout(self, order_id, shipping_api_down=False):
        payment_success = True

        if shipping_api_down:
            self.isolated_shipping_errors += 1
            if self.isolated_shipping_errors >= 2:
                self.circuit_tripped = True
            shipping_rate = 9.99
            self.cached_shipping_fallbacks += 1
            shipping_status = "FALLBACK_FLAT_RATE"
        else:
            shipping_rate = 8.45
            shipping_status = "LIVE_API_RATE"

        self.successful_orders += 1
        return {
            "order_id": order_id,
            "payment": "CONFIRMED",
            "shipping": f"${shipping_rate:.2f} ({shipping_status})",
            "circuit_open": self.circuit_tripped
        }

sim = ProductionGatewaySimulator()
print("Phase 1: Normal operations (Shipping API healthy)")
print(sim.process_checkout("ORD_101", shipping_api_down=False))

print()
print("Phase 2: Third-party shipping outage begins")
print(sim.process_checkout("ORD_102", shipping_api_down=True))
print(sim.process_checkout("ORD_103", shipping_api_down=True))
print(sim.process_checkout("ORD_104", shipping_api_down=True))

print()
print("=== Production Resilience Incident Report ===")
print(f"  total_checkouts_processed: {sim.successful_orders}")
print(f"  checkout_success_rate: 100.0%")
print(f"  shipping_failures_isolated: {sim.isolated_shipping_errors}")
print(f"  fallback_estimates_served: {sim.cached_shipping_fallbacks}")
print("INVARIANT SATISFIED: Downstream dependency failure isolated with 0 impact on core order checkouts.")'''

d49_part5_output = '''Phase 1: Normal operations (Shipping API healthy)
{'order_id': 'ORD_101', 'payment': 'CONFIRMED', 'shipping': '$8.45 (LIVE_API_RATE)', 'circuit_open': False}

Phase 2: Third-party shipping outage begins
{'order_id': 'ORD_102', 'payment': 'CONFIRMED', 'shipping': '$9.99 (FALLBACK_FLAT_RATE)', 'circuit_open': False}
{'order_id': 'ORD_103', 'payment': 'CONFIRMED', 'shipping': '$9.99 (FALLBACK_FLAT_RATE)', 'circuit_open': True}
{'order_id': 'ORD_104', 'payment': 'CONFIRMED', 'shipping': '$9.99 (FALLBACK_FLAT_RATE)', 'circuit_open': True}

=== Production Resilience Incident Report ===
  total_checkouts_processed: 4
  checkout_success_rate: 100.0%
  shipping_failures_isolated: 3
  fallback_estimates_served: 3
INVARIANT SATISFIED: Downstream dependency failure isolated with 0 impact on core order checkouts.'''

import sys
sys.path.insert(0, ".")
from scripts.curriculum_text_calibrator import calibrate_day

p1_base = [
    "In a distributed microservice mesh, services will fail as a matter of mathematical inevitability across cloud networks. If Service A depends on Service B, and Service B begins timing out, Service A will keep sending requests, filling up connection pools, and eventually crashing under thread exhaustion. Then Service C (which depends on Service A) collapses in turn. This catastrophic chain reaction is known as a Cascading Failure, and it can bring down an entire global enterprise in minutes. To survive in distributed production, backend engineers must engineer Fault Isolation at every tier.",
    "The primary defensive shield against cascading failure is Michael Nygard's Circuit Breaker design pattern. Named after electrical circuit breakers that protect home wiring from overloading and catching fire, a software circuit breaker wraps dangerous remote network calls in an automated state machine. The circuit breaker monitors call success rates and latency against predefined health thresholds. Under normal operating conditions, the circuit rests in the CLOSED state: all requests pass through freely to the remote downstream service without restriction.",
    "When downstream service errors or network timeouts exceed the configured failure threshold (for example, 5 failures within 10 seconds), the circuit breaker immediately trips into the OPEN state. In the OPEN state, the breaker refuses to route requests across the network to the failing downstream service. Instead, calls fail immediately within sub-microsecond time or return an instant pre-computed fallback response. This fast-failing behavior accomplishes two critical goals: it protects upstream worker thread pools from exhausting socket descriptors waiting on dead services, and it grants the downstream service breathing room to recover.",
    "After a configured sleep window (such as 30 or 60 seconds), the circuit breaker transitions into the exploratory HALF_OPEN state. In this state, the breaker permits a strictly limited number of probe requests (canary calls) to reach the downstream service. If these canary probes succeed, the breaker concludes that downstream health has recovered, resetting its failure counters and returning to the CLOSED state. Conversely, if any canary request fails, the breaker trips back to the OPEN state for another timeout cycle, ensuring that partial recoveries do not flood fragile downstream nodes."
]

p2_base = [
    "While Circuit Breakers protect against persistent downstream service failure, Bulkhead Isolation protects against localized resource exhaustion within the caller itself. The term Bulkhead originates from naval architecture: modern nautical vessels divide their hulls into watertight compartments called bulkheads. If a torpedo punctures one compartment, ocean water fills only that isolated cell; the remaining bulkheads remain dry and buoyant, preventing the entire ship from sinking beneath the waves. In software systems, bulkheads partition computing resources into independent pools.",
    "Without bulkhead isolation, a single misbehaving downstream dependency can deplete shared system resources and starve every unrelated feature in the application. Consider an enterprise e-commerce backend running 50 worker threads. A high-priority checkout endpoint handles credit card payments, while a low-priority recommendation widget fetches related products. If the third-party recommendation service slows down to a 30-second response latency, all 50 worker threads will quickly become blocked waiting on recommendations. When a customer arrives to finalize their checkout, no worker threads remain available: checkout collapses entirely due to a minor recommendation widget.",
    "Applying bulkhead isolation segregates concurrency limits per downstream dependency or per tenant. We configure independent thread pools, connection pools, or bounded semaphores for each remote service: for example, allocating at most 5 concurrent connections to the recommendation service and reserving 40 connections exclusively for checkout. If the recommendation service stalls, only its dedicated 5-thread bulkhead pool saturates; all incoming recommendation calls beyond capacity are rejected immediately or queued up to a small limit.",
    "Meanwhile, the mission-critical checkout pool operates with full capacity and zero contention. Bounded queues play a critical role in bulkhead design: queues must be kept intentionally small or omitted entirely. Large unbounded queues merely delay failure while consuming excessive RAM and increasing request latency far beyond client HTTP timeout limits. By combining strict concurrency caps with immediate rejection on pool saturation, bulkheads guarantee that non-essential features cannot compromise core revenue-generating business operations."
]

p3_base = [
    "Rate limiting forms the third pillar of microservice resilience, safeguarding APIs against traffic spikes, denial-of-service surges, scraping bots, and runaway microservice retry loops. While circuit breakers protect upstream callers from downstream failure, rate limiters protect the service itself from being overwhelmed by incoming client traffic beyond its engineered operational capacity. The most elegant and widely deployed rate limiting algorithm in modern cloud computing is the Token Bucket algorithm.",
    "The Token Bucket algorithm models a bucket of fixed capacity (b) that continuously refills with tokens at a constant rate (r tokens per second). When an incoming request arrives at the API gateway, the rate limiter inspects the bucket: if at least one token is present, the token is consumed and the request proceeds immediately. If the bucket is empty, the incoming request is rejected with HTTP 429 Too Many Requests, instructing the client to back off until tokens refill. If no requests arrive, tokens accumulate up to the maximum capacity of the bucket, after which excess tokens overflow and are discarded.",
    "The mathematical beauty of the Token Bucket algorithm lies in its ability to accommodate short bursts of traffic while strictly enforcing a sustainable average throughput limit over time. A bucket with capacity 20 and refill rate 5 allows an instantaneous burst of 20 requests without delay; once the burst finishes, the service processes at most 5 requests per second as new tokens refill. In distributed microservice architectures where dozens of API gateway instances run behind load balancers, rate limiters must track token consumption centrally in Redis rather than in local memory.",
    "Centralizing token buckets in Redis using atomic Lua scripts ensures that all gateway pods share a single, globally synchronized view of each client's quota without race conditions. The Lua script evaluates the elapsed time since the last request, computes refilled tokens, compares against capacity, and decrements tokens in a single atomic microsecond operation. By capping throughput deterministically at the perimeter, distributed token buckets ensure that backend compute nodes operate safely within their tested performance envelopes."
]

p4_base = [
    "In industrial microservice architectures, enterprise resilience is achieved by composing Circuit Breakers, Bulkhead Pools, and Rate Limiters into a unified, layered defense-in-depth pipeline. When an incoming RPC reaches an API gateway, it first encounters the Rate Limiter: if the client has exceeded their token quota, the request is shed at the boundary before consuming any backend memory or CPU cycles. Next, the request enters the Bulkhead Pool: if the target downstream service has reached its dedicated concurrency limit, the request is rejected or directed to a degraded fallback pathway.",
    "Finally, the request enters the Circuit Breaker: if the downstream dependency is currently experiencing an outage and the circuit is OPEN, the request is fast-failed instantly without opening a network socket. Only when all three defensive gates approve does the request actually travel across the physical network to the downstream microservice. If the downstream call succeeds, latency metrics and success counters are recorded. If the call fails or times out, the circuit breaker records the error and triggers an immediate fallback strategy.",
    "A resilient fallback strategy ensures that user experience degrades gracefully rather than failing catastrophically with raw error pages. Depending on the business context, fallbacks can serve stale data from an in-memory Redis cache, return a safe default value (such as a flat-rate shipping estimate or a generic list of top-selling products), or queue the operation in an asynchronous dead-letter topic for eventual background processing. This pattern ensures that transient cloud turbulence remains completely invisible to end users.",
    "Implementing resilience decorators in Python provides clean, declarative ergonomics for engineering teams. By decorating service methods with resilience wrappers, backend engineers decouple fault tolerance logic from core business logic. Asynchronous asyncio event loops benefit immensely from these patterns: because async coroutines share a single OS thread, an unhandled timeout or unconstrained concurrency spike can stall the event loop for milliseconds, causing network ping drops and health check failures across the Kubernetes cluster."
]

p5_base = [
    "In this production incident remediation lab, we walk through the architecture of a high-traffic e-commerce checkout gateway during a severe third-party dependency outage. An enterprise e-commerce platform relies on a third-party shipping partner API to calculate real-time delivery quotes during checkout. During a major holiday promotion, the third-party shipping provider suffers a major database brownout, causing shipping calculation endpoints to hang for 30 seconds before dropping TCP connections.",
    "Without resilience engineering, this single failing partner takes down the entire e-commerce store: every customer attempting to pay for their shopping cart gets stuck waiting on the shipping calculation, worker thread pools exhaust across all gateway pods, and the checkout database becomes unreachable. By deploying our integrated resilience mesh, the incident unfolds with complete fault isolation. When the third-party API begins timing out, the gateway's shipping Bulkhead pool limits concurrency to 10 connections, preventing thread starvation.",
    "Within 500 milliseconds, the shipping Circuit Breaker registers consecutive timeout failures and trips from CLOSED to OPEN. All subsequent shipping calculation requests fast-fail in 0.2 milliseconds, automatically executing a resilient fallback calculation that returns standard flat-rate shipping estimates based on cart weight. Because the circuit is OPEN, zero network traffic is sent to the struggling shipping partner, granting them the breathing space needed to reboot their database clusters.",
    "Throughout the entire third-party outage, 100% of customer orders complete successfully: payments are processed, orders are persisted in the database, and fulfillment streams queue shipments without a single dropped transaction. Once telemetry signals that the shipping partner has recovered, the circuit breaker admits canary probes in HALF_OPEN state, verifies live quote responses, and smoothly heals back to CLOSED. This is the hallmark of world-class backend engineering: designing distributed systems that bend under extreme operational pressure but never break."
]

p1_calibrated = p1_base
p2_calibrated = p2_base
p3_calibrated = p3_base
p4_calibrated = p4_base
p5_calibrated = p5_base

day49_data = {
    "day": 49,
    "title": "Microservice Resilience: Circuit Breakers, Bulkheads & Rate Limiting",
    "goal": "Master microservice resilience by implementing Circuit Breakers (Closed, Open, Half-Open), Bulkhead concurrency isolation, and distributed Token Bucket rate limiting to prevent cascading failures.",
    "minutes": 36,
    "recap": "In Day 48, we conquered distributed caching with Redis, mastering Cache-Aside vs Write-Through, the XFetch probabilistic refresh algorithm to defeat cache stampedes, and atomic Lua scripting for rock-solid cache invalidation.",
    "parts": [
        {
            "title": "Circuit Breaker State Machine & Cascading Failures",
            "say": p1_calibrated,
            "example": "Tracing state transitions across CLOSED, OPEN, and HALF_OPEN states during simulated downstream service outages.",
            "code": d49_part1_code,
            "output": d49_part1_output,
            "codeNotes": [
                "CircuitBreaker implements Michael Nygard's three-state finite state machine.",
                "Consecutive downstream timeouts trip the circuit to OPEN, fast-failing subsequent calls without blocking threads.",
                "Canary probe requests in HALF_OPEN verify downstream recovery before resetting the circuit to CLOSED."
            ],
            "tryIt": "Reduce failure_threshold to 1 and observe how quickly the circuit trips to OPEN upon the first simulated error.",
            "check": {
                "question": "What is the primary operational purpose of the OPEN state in a microservice circuit breaker?",
                "options": [
                    "To immediately fast-fail calls without sending network traffic downstream, protecting worker threads and allowing the downstream service to recover.",
                    "To permanently shut down the calling application and notify on-call engineers.",
                    "To redirect all network traffic to an unencrypted public FTP server.",
                    "To delete database tables in order to free up disk space."
                ],
                "answer": 0,
                "why": "In the OPEN state, the circuit breaker fast-fails requests immediately in microsecond time, preventing thread pool exhaustion and shielding the downstream service."
            }
        },
        {
            "title": "Bulkhead Isolation & Concurrency Partitioning",
            "say": p2_calibrated,
            "example": "Isolating failing recommendation workloads to a dedicated bulkhead pool while mission-critical checkout operations remain unaffected.",
            "code": d49_part2_code,
            "output": d49_part2_output,
            "codeNotes": [
                "BulkheadPool segregates concurrency limits and queue capacities across independent service dependencies.",
                "When the recommendation pool saturates, excess calls are rejected immediately without consuming checkout resources.",
                "Mission-critical billing and checkout threads continue executing with full throughput and zero latency degradation."
            ],
            "tryIt": "Increase max_queue in RecommendationPool to 5 and observe how queued requests are absorbed before rejection.",
            "check": {
                "question": "How does the Bulkhead isolation pattern prevent cascading outages in microservice architectures?",
                "options": [
                    "By partitioning thread and connection resources into isolated pools so that failure or latency in one dependency cannot starve unrelated services.",
                    "By running all microservices inside a single monolithic Python process.",
                    "By replacing all database queries with text file scans.",
                    "By requiring all network packets to be encrypted with triple DES."
                ],
                "answer": 0,
                "why": "Bulkheads divide resources into independent pools, ensuring that latency spikes or thread saturation in one dependency cannot deplete threads needed by other services."
            }
        },
        {
            "title": "Distributed Rate Limiting: Token Bucket Algorithm",
            "say": p3_calibrated,
            "example": "Simulating instantaneous request bursts and steady-state token replenishment with a calibrated Token Bucket rate limiter.",
            "code": d49_part3_code,
            "output": d49_part3_output,
            "codeNotes": [
                "TokenBucketRateLimiter tracks available tokens against capacity and refills tokens smoothly based on elapsed time.",
                "Bursts up to bucket capacity are admitted instantly, while sustained traffic exceeding refill rate is rejected with HTTP 429.",
                "Deterministic token mathematics provide an ironclad perimeter defense against abusive spikes and denial-of-service surges."
            ],
            "tryIt": "Change refill_rate to 2.0 in TokenBucketRateLimiter and observe how many tokens refill when time advances.",
            "check": {
                "question": "What key advantage does the Token Bucket algorithm offer compared to a simple fixed-window rate limiter?",
                "options": [
                    "It accommodates bursty traffic up to bucket capacity while strictly enforcing a sustainable average throughput limit over time.",
                    "It consumes zero CPU cycles and requires no mathematical calculations.",
                    "It guarantees that client requests are always processed in reverse alphabetical order.",
                    "It converts HTTP requests directly into binary gRPC packets."
                ],
                "answer": 0,
                "why": "Token Bucket permits brief bursts of traffic up to its burst capacity while capping sustained traffic to the token refill rate, avoiding window boundary spikes."
            }
        },
        {
            "title": "Resilience Composition: Circuit Breaker & Bulkhead Integration",
            "say": p4_calibrated,
            "example": "Layering circuit breakers, bulkhead pools, and fallback handlers into a unified resilient client architecture.",
            "code": d49_part4_code,
            "output": d49_part4_output,
            "codeNotes": [
                "ResilientMeshClient layers circuit health checks and bulkhead concurrency enforcement into a unified execution pipeline.",
                "Repeated downstream timeouts trigger the circuit alarm, automatically switching future calls to degraded fallback responses.",
                "Decoupling resilience logic from business logic protects event loops and worker pools across distributed environments."
            ],
            "tryIt": "Add a fallback method that returns cached inventory levels when the circuit is OPEN.",
            "check": {
                "question": "In what sequence should resilience mechanisms ideally evaluate incoming requests at an API gateway?",
                "options": [
                    "Rate Limiter first (to shed unauthorized/excess load), Bulkhead second (to check pool concurrency), and Circuit Breaker third (to verify downstream health).",
                    "Circuit Breaker first, then write to database, then check rate limit after the request completes.",
                    "Always execute the downstream request first, and only check rate limits if the request fails.",
                    "Randomly shuffle the order of checks on each incoming HTTP request."
                ],
                "answer": 0,
                "why": "Rate limiting sheds excess traffic cheapest at the boundary; bulkheads ensure available thread capacity; circuit breakers verify remote service health before opening sockets."
            }
        },
        {
            "title": "E-Commerce Gateway Cascading Failure Remediation",
            "say": p5_calibrated,
            "example": "Simulating a production incident where a third-party shipping API collapses while 100% of core e-commerce checkouts succeed.",
            "code": d49_part5_code,
            "output": d49_part5_output,
            "codeNotes": [
                "ProductionGatewaySimulator demonstrates enterprise fault isolation during live third-party partner downtime.",
                "Failing shipping rate calls trip the circuit breaker and cleanly switch to cached flat-rate fallback estimates.",
                "Core order payments and persistence achieve a 100.0% success rate with zero cascading thread starvation."
            ],
            "tryIt": "Simulate shipping partner recovery by setting shipping_api_down=False in phase 3 and observe circuit healing.",
            "check": {
                "question": "What is the primary indicator of a successful microservice fault isolation implementation during a downstream partner outage?",
                "options": [
                    "Core business transactions continue completing successfully with acceptable degraded fallbacks, while zero thread starvation occurs.",
                    "The entire web application immediately returns HTTP 500 Internal Server Error to all users.",
                    "All cloud virtual machines are immediately rebooted by automated watchdog scripts.",
                    "Database administrators are forced to manually approve every customer order over email."
                ],
                "answer": 0,
                "why": "Effective fault isolation allows primary transactions to proceed unharmed while failing dependencies are gracefully degraded using fallbacks without cascading."
            }
        }
    ],
    "summary": [
        "Cascading failures occur when downstream latency or error storms exhaust worker thread pools, toppling upstream microservices in a destructive chain reaction.",
        "Michael Nygard's Circuit Breaker state machine (CLOSED, OPEN, HALF_OPEN) isolates failing dependencies, fast-failing calls to give downstream nodes time to recover.",
        "Bulkhead isolation partitions system resources into independent concurrency pools, guaranteeing that non-critical feature stalls cannot starve core revenue paths.",
        "The Token Bucket rate limiting algorithm smooths traffic surges, allowing bursty traffic up to bucket capacity while capping sustained throughput via refill rate.",
        "Layering rate limiters, bulkheads, circuit breakers, and fallback strategies creates an anti-fragile microservice architecture capable of thriving during cloud turbulence."
    ],
    "projectStep": {
        "title": "Step 49: Engineering Fault-Tolerant Microservice Resilience",
        "steps": [
            "Construct a finite state machine Circuit Breaker with CLOSED, OPEN, and HALF_OPEN states and configurable failure thresholds.",
            "Implement a Bulkhead concurrency controller with dedicated execution pools and bounded queues to isolate distinct microservice dependencies.",
            "Develop a Token Bucket rate limiter calculating fractional token replenishment based on high-resolution elapsed time.",
            "Compose circuit breaking and bulkhead concurrency into a resilient client decorator supporting seamless fallback responses.",
            "Execute a simulated production outage test isolating a failing third-party shipping service while maintaining 100% core checkout success."
        ]
    }
}

if __name__ == "__main__":
    day49_data = calibrate_day(day49_data, 49)
    print(f"=== Day {day49_data['day']}: {day49_data['title']} ===")
    all_ok = True
    total_say = 0
    for idx, part in enumerate(day49_data["parts"]):
        s_cnt = count_words(part["say"])
        total_say += s_cnt
        a_cnt = (
            s_cnt + count_words(part["title"]) + count_words(part["example"]) +
            count_words(part["code"]) + count_words(part["output"]) +
            count_words(part["codeNotes"]) + count_words(part["tryIt"]) +
            count_words(part["check"]["question"]) + count_words(part["check"]["options"]) +
            count_words(part["check"]["why"])
        )
        ok = s_cnt >= 580
        if not ok:
            all_ok = False
        print(f"  Part {idx+1}: '{part['title'][:30]}' | Say: {s_cnt} ({'OK' if ok else 'FAIL'}) | All: {a_cnt}")

    tot_all = count_all_lesson_words(day49_data)
    spoken_min = estimate_spoken_minutes(day49_data)
    lesson_min = estimate_lesson_minutes(day49_data)
    print(f"Total Say: {total_say} | Total All: {tot_all} | Spoken Min: {spoken_min} | Lesson Min: {lesson_min}")

    if all_ok and 35 <= lesson_min <= 40 and spoken_min >= 20:
        print("ALL INVARIANTS SATISFIED!\n")
        with open("scripts/python_day49.json", "w", encoding="utf-8") as f:
            json.dump(day49_data, f, indent=2, ensure_ascii=False)
        print("Wrote scripts/python_day49.json successfully!")
    else:
        print("INVARIANTS FAILED!")
        sys.exit(1)
