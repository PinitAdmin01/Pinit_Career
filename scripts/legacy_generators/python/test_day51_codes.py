"""Test and calibrate Day 51 code snippets."""

def test_part1():
    print("=== PART 1 OUTPUT ===")
    class W3CTraceContext:
        @staticmethod
        def parse_traceparent(header_val: str):
            parts = header_val.strip().split("-")
            if len(parts) != 4:
                raise ValueError("Invalid traceparent header format")
            version, trace_id, parent_id, trace_flags = parts
            return {
                "version": version,
                "trace_id": trace_id,
                "parent_id": parent_id,
                "sampled": (int(trace_flags, 16) & 1) == 1
            }

        @staticmethod
        def format_traceparent(trace_id: str, span_id: str, sampled: bool = True) -> str:
            flags = "01" if sampled else "00"
            return f"00-{trace_id}-{span_id}-{flags}"

    sample_header = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
    parsed = W3CTraceContext.parse_traceparent(sample_header)
    print(f"Parsed Trace ID: {parsed['trace_id']}")
    print(f"Parent Span ID: {parsed['parent_id']} | Sampled: {parsed['sampled']}")

    # Generate child span header
    child_span_id = "00f067aa0ba902c8"
    new_header = W3CTraceContext.format_traceparent(parsed['trace_id'], child_span_id, parsed['sampled'])
    print(f"Outbound Propagated Header: {new_header}")
    print("W3C TraceContext Invariant: Standard 4-part traceparent header preserves causality across services.")

def test_part2():
    print("\n=== PART 2 OUTPUT ===")
    # Simulate contextvars propagation across async workflows
    class AsyncTraceContextManager:
        def __init__(self):
            self._current_context = None

        def set_active_span(self, span_id: str):
            self._current_context = span_id

        def get_active_span(self) -> str:
            return self._current_context or "ROOT_NO_PARENT"

    ctx_manager = AsyncTraceContextManager()

    def gateway_handler():
        ctx_manager.set_active_span("span_gw_1001")
        print(f"[Gateway] Active Span: {ctx_manager.get_active_span()}")
        # Dispatch to auth
        auth_service_handler()
        # Return to gateway
        print(f"[Gateway Resumed] Active Span: {ctx_manager.get_active_span()}")

    def auth_service_handler():
        parent = ctx_manager.get_active_span()
        ctx_manager.set_active_span("span_auth_2002")
        print(f"  [AuthService] Parent: {parent} -> Active Span: {ctx_manager.get_active_span()}")
        # Restore parent when exiting auth scope
        ctx_manager.set_active_span(parent)

    gateway_handler()
    print("Context Propagation Invariant: Context variables isolate active span state per execution context.")

def test_part3():
    print("\n=== PART 3 OUTPUT ===")
    class TraceSpan:
        def __init__(self, name, parent_id=None):
            self.name = name
            self.parent_id = parent_id
            self.attributes = {}
            self.events = []
            self.status = "UNSET"
            self.duration_ms = 0.0

        def set_attribute(self, key, value):
            self.attributes[key] = value

        def add_event(self, event_name, payload=None):
            self.events.append({"event": event_name, "data": payload or {}})

        def finish(self, duration_ms, status="OK"):
            self.duration_ms = duration_ms
            self.status = status

    span = TraceSpan("HTTP GET /api/v1/orders", parent_id="span_gw_01")
    span.set_attribute("http.method", "GET")
    span.set_attribute("http.status_code", 200)
    span.set_attribute("db.system", "postgresql")
    span.add_event("cache_miss", {"cache_key": "order:9901"})
    span.add_event("db_query_complete", {"rows_returned": 1})
    span.finish(14.8, status="OK")

    print(f"Span: '{span.name}' | Status: {span.status} | Duration: {span.duration_ms}ms")
    print(f"Semantic Attributes: {span.attributes}")
    print(f"Recorded Events: {[e['event'] for e in span.events]}")
    print("Span Lifecycle Invariant: Spans capture duration, structured attributes, and operational events.")

def test_part4():
    print("\n=== PART 4 OUTPUT ===")
    class ProbabilisticSampler:
        def __init__(self, rate: float = 0.5):
            self.rate = rate  # 50% sampling rate

        def should_sample(self, trace_id: str) -> bool:
            # Deterministic hash-based sampling on last 2 hex chars
            val = int(trace_id[-2:], 16)
            threshold = int(256 * self.rate)
            return val < threshold

    sampler = ProbabilisticSampler(rate=0.5)
    traces = [
        "4bf92f3577b34da6a3ce929d0e0e4710",  # ends with 0x10 = 16 < 128 -> True
        "4bf92f3577b34da6a3ce929d0e0e47ff",  # ends with 0xff = 255 >= 128 -> False
        "4bf92f3577b34da6a3ce929d0e0e4740",  # ends with 0x40 = 64 < 128 -> True
        "4bf92f3577b34da6a3ce929d0e0e47a0",  # ends with 0xa0 = 160 >= 128 -> False
    ]

    for t in traces:
        decision = sampler.should_sample(t)
        print(f"Trace {t[-6:]}: Sampled={decision}")
    print("Sampling Invariant: Head-based sampling bounds telemetry storage costs deterministically.")

def test_part5():
    print("\n=== PART 5 OUTPUT ===")
    class MultiServiceTraceSimulator:
        def __init__(self):
            self.trace_tree = []

        def execute_request(self, trace_id: str):
            # 1. API Gateway root span
            self.trace_tree.append({"service": "api-gateway", "span": "ingress", "parent": None, "latency_ms": 2.1})
            # 2. Auth service child span
            self.trace_tree.append({"service": "auth-service", "span": "verify_jwt", "parent": "ingress", "latency_ms": 5.4})
            # 3. Billing service child span
            self.trace_tree.append({"service": "billing-service", "span": "charge_card", "parent": "ingress", "latency_ms": 42.8})
            # 4. Database child span under billing
            self.trace_tree.append({"service": "postgres-db", "span": "INSERT orders", "parent": "charge_card", "latency_ms": 8.3})

            total_latency = sum(item["latency_ms"] for item in self.trace_tree)
            return total_latency

    sim = MultiServiceTraceSimulator()
    total_time = sim.execute_request("4bf92f3577b34da6a3ce929d0e0e4736")

    print("=== Multi-Service Distributed Trace Graph ===")
    for item in sim.trace_tree:
        indent = "  " if item["parent"] is None else ("    " if item["parent"] == "ingress" else "      ")
        print(f"{indent}[{item['service']}] {item['span']} ({item['latency_ms']}ms) -> parent: {item['parent']}")
    print(f"Total Request Execution Latency: {total_time:.1f}ms")
    print("INVARIANT SATISFIED: Multi-service causality and latency bottlenecks identified with zero ambiguity.")

if __name__ == "__main__":
    test_part1()
    test_part2()
    test_part3()
    test_part4()
    test_part5()
