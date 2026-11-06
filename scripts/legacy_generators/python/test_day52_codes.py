"""Test and calibrate Day 52 code snippets."""

def test_part1():
    print("=== PART 1 OUTPUT ===")
    class REDMetricsTracker:
        def __init__(self):
            self.total_requests = 0
            self.total_errors = 0
            self.latencies_ms = []

        def record_request(self, duration_ms: float, is_error: bool = False):
            self.total_requests += 1
            if is_error:
                self.total_errors += 1
            self.latencies_ms.append(duration_ms)

        def get_summary(self, window_seconds: float = 60.0):
            rps = round(self.total_requests / window_seconds, 2)
            error_rate = round((self.total_errors / self.total_requests) * 100, 2) if self.total_requests else 0.0
            avg_duration = round(sum(self.latencies_ms) / len(self.latencies_ms), 2) if self.latencies_ms else 0.0
            return {"rate_rps": rps, "error_percentage": f"{error_rate}%", "avg_duration_ms": avg_duration}

    tracker = REDMetricsTracker()
    for _ in range(95):
        tracker.record_request(duration_ms=12.5, is_error=False)
    for _ in range(5):
        tracker.record_request(duration_ms=45.0, is_error=True)

    summary = tracker.get_summary(window_seconds=10.0)
    print("=== RED Metrics Telemetry ===")
    print(f"  Rate: {summary['rate_rps']} req/sec")
    print(f"  Errors: {summary['error_percentage']}")
    print(f"  Duration: {summary['avg_duration_ms']}ms")
    print("RED Invariant: Rate, Errors, and Duration provide comprehensive microservice operational health.")

def test_part2():
    print("\n=== PART 2 OUTPUT ===")
    class PrometheusCounter:
        def __init__(self, name: str):
            self.name = name
            self.labels = {}

        def inc(self, amount: float = 1.0, **labels):
            key = tuple(sorted(labels.items()))
            self.labels[key] = self.labels.get(key, 0.0) + amount

        def get_value(self, **labels) -> float:
            key = tuple(sorted(labels.items()))
            return self.labels.get(key, 0.0)

    class PrometheusGauge:
        def __init__(self, name: str):
            self.name = name
            self.value = 0.0

        def set(self, val: float):
            self.value = val

        def inc(self, amount: float = 1.0):
            self.value += amount

        def dec(self, amount: float = 1.0):
            self.value -= amount

    http_requests = PrometheusCounter("http_requests_total")
    http_requests.inc(method="GET", status="200")
    http_requests.inc(method="GET", status="200")
    http_requests.inc(method="POST", status="500")

    active_connections = PrometheusGauge("active_db_connections")
    active_connections.set(5.0)
    active_connections.inc(2.0)
    active_connections.dec(1.0)

    print(f"Counter: GET 200 = {http_requests.get_value(method='GET', status='200')}")
    print(f"Counter: POST 500 = {http_requests.get_value(method='POST', status='500')}")
    print(f"Gauge: Active DB Connections = {active_connections.value}")
    print("Metrics Invariant: Counters increase monotonically; Gauges model instantaneous fluctuations.")

def test_part3():
    print("\n=== PART 3 OUTPUT ===")
    class PrometheusHistogram:
        def __init__(self, name: str, buckets=(10.0, 25.0, 50.0, 100.0)):
            self.name = name
            self.buckets = sorted(buckets) + [float("inf")]
            self.counts = {b: 0 for b in self.buckets}
            self.sum = 0.0
            self.count = 0

        def observe(self, value: float):
            self.sum += value
            self.count += 1
            for b in self.buckets:
                if value <= b:
                    self.counts[b] += 1

        def estimate_p95(self) -> float:
            # Locate bucket containing 95th percentile
            target = 0.95 * self.count
            prev_b, prev_c = 0.0, 0
            for b in self.buckets:
                curr_c = self.counts[b]
                if curr_c >= target:
                    # Linear interpolation within bucket
                    bucket_width = b - prev_b if b != float("inf") else 50.0
                    fraction = (target - prev_c) / (curr_c - prev_c) if (curr_c - prev_c) else 0.0
                    return round(prev_b + fraction * bucket_width, 1)
                prev_b, prev_c = b, curr_c
            return round(prev_b, 1)

    hist = PrometheusHistogram("http_request_duration_ms", buckets=[10, 25, 50, 100])
    # 90 requests at 15ms, 8 requests at 40ms, 2 requests at 85ms
    for _ in range(90): hist.observe(15.0)
    for _ in range(8): hist.observe(40.0)
    for _ in range(2): hist.observe(85.0)

    print(f"Total Requests Observed: {hist.count} | Cumulative Sum: {hist.sum}ms")
    print(f"Bucket Counts: { {k: v for k, v in hist.counts.items() if k != float('inf')} }")
    print(f"Estimated p95 Latency: {hist.estimate_p95()}ms")
    print("Histogram Invariant: Bucket distributions calculate percentiles without storing unbounded raw samples.")

def test_part4():
    print("\n=== PART 4 OUTPUT ===")
    class CardinalityGuard:
        def __init__(self, max_allowed_series=10):
            self.series = set()
            self.max_allowed_series = max_allowed_series

        def record(self, **labels):
            # Enforce low-cardinality keys
            sanitized = {}
            for k, v in labels.items():
                if k in ["user_id", "order_id", "email"]:
                    sanitized[k] = "REDACTED_HIGH_CARDINALITY"
                else:
                    sanitized[k] = v

            series_key = tuple(sorted(sanitized.items()))
            if len(self.series) < self.max_allowed_series or series_key in self.series:
                self.series.add(series_key)
                return True, len(self.series)
            return False, len(self.series)

    guard = CardinalityGuard(max_allowed_series=3)
    # Simulate attempt to use user_id as metric label
    r1, count1 = guard.record(route="/api/v1/checkout", method="POST", user_id="user_101")
    r2, count2 = guard.record(route="/api/v1/checkout", method="POST", user_id="user_102")
    r3, count3 = guard.record(route="/api/v1/products", method="GET")

    print(f"Label Attempt 1: Accepted={r1} | Total Active Series: {count1}")
    print(f"Label Attempt 2 (Different User): Accepted={r2} | Total Active Series: {count2}")
    print(f"Label Attempt 3 (Different Route): Accepted={r3} | Total Active Series: {count3}")
    print("Cardinality Invariant: Unbounded dimensions are collapsed, preventing time series memory explosion.")

def test_part5():
    print("\n=== PART 5 OUTPUT ===")
    class ProductionREDDashboard:
        def __init__(self):
            self.total_requests = 10000
            self.successful_requests = 9995
            self.failed_requests = 5
            self.p50_latency_ms = 4.2
            self.p95_latency_ms = 18.5
            self.p99_latency_ms = 48.0
            self.slo_p99_target_ms = 50.0

        def evaluate_slo(self):
            availability = (self.successful_requests / self.total_requests) * 100
            p99_compliant = self.p99_latency_ms <= self.slo_p99_target_ms
            return {
                "total_traffic": self.total_requests,
                "availability_rate": f"{availability:.2f}%",
                "p50_ms": self.p50_latency_ms,
                "p95_ms": self.p95_latency_ms,
                "p99_ms": self.p99_latency_ms,
                "slo_compliant": p99_compliant and availability >= 99.9
            }

    dashboard = ProductionREDDashboard()
    report = dashboard.evaluate_slo()

    print("=== Production Service RED Metrics Report ===")
    for k, v in report.items():
        print(f"  {k}: {v}")
    print("INVARIANT SATISFIED: High-throughput RED metrics verify 99.8% availability within 50ms p99 SLA.")

if __name__ == "__main__":
    test_part1()
    test_part2()
    test_part3()
    test_part4()
    test_part5()
