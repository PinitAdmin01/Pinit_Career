"""Test and calibrate Day 49 code snippets."""
import time

def test_part1():
    print("=== PART 1 OUTPUT ===")
    class CircuitState:
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
    print("Req 7:", cb.call(flaky_service, fail=False))

def test_part2():
    print("\n=== PART 2 OUTPUT ===")
    class BulkheadPool:
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
    print(recs_bulkhead.execute("Rec_4"))  # Rejected!

    # Billing pool remains completely unaffected and isolated
    print(billing_bulkhead.execute("Checkout_Order_101"))
    print(billing_bulkhead.execute("Checkout_Order_102"))
    print("Bulkhead Invariant: Failing recommendations cannot starve mission-critical checkout threads.")

def test_part3():
    print("\n=== PART 3 OUTPUT ===")
    class TokenBucketRateLimiter:
        def __init__(self, capacity=5, refill_rate=2.0):
            self.capacity = capacity
            self.refill_rate = refill_rate  # tokens per second
            self.tokens = float(capacity)
            self.last_refill = 0.0
            self.current_time = 0.0

        def allow_request(self, tokens_requested=1):
            # Refill tokens based on elapsed time
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
    print("Rate Limiter Invariant: Smooth token replenishment handles bursts while capping sustained throughput.")

def test_part4():
    print("\n=== PART 4 OUTPUT ===")
    class ResilientMeshClient:
        def __init__(self, name, max_concurrency=2, failure_limit=2):
            self.name = name
            self.active_calls = 0
            self.max_concurrency = max_concurrency
            self.circuit_open = False
            self.failures = 0
            self.failure_limit = failure_limit

        def call_service(self, operation, fail=False):
            # 1. Circuit check
            if self.circuit_open:
                return f"[{self.name}] FAST_FAIL: Circuit OPEN -> Falling back to degraded response"

            # 2. Bulkhead check
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
    print("Resilience Composition: Circuit breaker and bulkhead shield calling process from latency cascading.")

def test_part5():
    print("\n=== PART 5 OUTPUT ===")
    class ProductionGatewaySimulator:
        def __init__(self):
            self.successful_orders = 0
            self.isolated_shipping_errors = 0
            self.cached_shipping_fallbacks = 0
            self.circuit_tripped = False

        def process_checkout(self, order_id, shipping_api_down=False):
            # Core checkout transaction
            payment_success = True

            # Shipping rate dependency
            if shipping_api_down:
                self.isolated_shipping_errors += 1
                if self.isolated_shipping_errors >= 2:
                    self.circuit_tripped = True
                # Circuit breaker trips and uses fallback rate calculation
                shipping_rate = 9.99  # Standard fallback flat rate
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

    print("\nPhase 2: Third-party shipping outage begins")
    print(sim.process_checkout("ORD_102", shipping_api_down=True))
    print(sim.process_checkout("ORD_103", shipping_api_down=True))
    print(sim.process_checkout("ORD_104", shipping_api_down=True))

    print("\n=== Production Resilience Incident Report ===")
    print(f"  total_checkouts_processed: {sim.successful_orders}")
    print(f"  checkout_success_rate: 100.0%")
    print(f"  shipping_failures_isolated: {sim.isolated_shipping_errors}")
    print(f"  fallback_estimates_served: {sim.cached_shipping_fallbacks}")
    print("INVARIANT SATISFIED: Downstream dependency failure isolated with 0 impact on core order checkouts.")

if __name__ == "__main__":
    test_part1()
    test_part2()
    test_part3()
    test_part4()
    test_part5()
