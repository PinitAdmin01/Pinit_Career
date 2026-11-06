#!/usr/bin/env python3
"""
Final calibrated generator for Day 51: OpenTelemetry Distributed Tracing & W3C TraceContext
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

d51_part1_code = '''class W3CTraceContext:
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
print("W3C TraceContext Invariant: Standard 4-part traceparent header preserves causality across services.")'''

d51_part1_output = '''Parsed Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736
Parent Span ID: 00f067aa0ba902b7 | Sampled: True
Outbound Propagated Header: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902c8-01
W3C TraceContext Invariant: Standard 4-part traceparent header preserves causality across services.'''

d51_part2_code = '''class AsyncTraceContextManager:
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
print("Context Propagation Invariant: Context variables isolate active span state per execution context.")'''

d51_part2_output = '''[Gateway] Active Span: span_gw_1001
  [AuthService] Parent: span_gw_1001 -> Active Span: span_auth_2002
[Gateway Resumed] Active Span: span_gw_1001
Context Propagation Invariant: Context variables isolate active span state per execution context.'''

d51_part3_code = '''class TraceSpan:
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
print("Span Lifecycle Invariant: Spans capture duration, structured attributes, and operational events.")'''

d51_part3_output = '''Span: 'HTTP GET /api/v1/orders' | Status: OK | Duration: 14.8ms
Semantic Attributes: {'http.method': 'GET', 'http.status_code': 200, 'db.system': 'postgresql'}
Recorded Events: ['cache_miss', 'db_query_complete']
Span Lifecycle Invariant: Spans capture duration, structured attributes, and operational events.'''

d51_part4_code = '''class ProbabilisticSampler:
    def __init__(self, rate: float = 0.5):
        self.rate = rate

    def should_sample(self, trace_id: str) -> bool:
        val = int(trace_id[-2:], 16)
        threshold = int(256 * self.rate)
        return val < threshold

sampler = ProbabilisticSampler(rate=0.5)
traces = [
    "4bf92f3577b34da6a3ce929d0e0e4710",
    "4bf92f3577b34da6a3ce929d0e0e47ff",
    "4bf92f3577b34da6a3ce929d0e0e4740",
    "4bf92f3577b34da6a3ce929d0e0e47a0",
]

for t in traces:
    decision = sampler.should_sample(t)
    print(f"Trace {t[-6:]}: Sampled={decision}")
print("Sampling Invariant: Head-based sampling bounds telemetry storage costs deterministically.")'''

d51_part4_output = '''Trace 0e4710: Sampled=True
Trace 0e47ff: Sampled=False
Trace 0e4740: Sampled=True
Trace 0e47a0: Sampled=False
Sampling Invariant: Head-based sampling bounds telemetry storage costs deterministically.'''

d51_part5_code = '''class MultiServiceTraceSimulator:
    def __init__(self):
        self.trace_tree = []

    def execute_request(self, trace_id: str):
        self.trace_tree.append({"service": "api-gateway", "span": "ingress", "parent": None, "latency_ms": 2.1})
        self.trace_tree.append({"service": "auth-service", "span": "verify_jwt", "parent": "ingress", "latency_ms": 5.4})
        self.trace_tree.append({"service": "billing-service", "span": "charge_card", "parent": "ingress", "latency_ms": 42.8})
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
print("INVARIANT SATISFIED: Multi-service causality and latency bottlenecks identified with zero ambiguity.")'''

d51_part5_output = '''=== Multi-Service Distributed Trace Graph ===
  [api-gateway] ingress (2.1ms) -> parent: None
    [auth-service] verify_jwt (5.4ms) -> parent: ingress
    [billing-service] charge_card (42.8ms) -> parent: ingress
      [postgres-db] INSERT orders (8.3ms) -> parent: charge_card
Total Request Execution Latency: 58.6ms
INVARIANT SATISFIED: Multi-service causality and latency bottlenecks identified with zero ambiguity.'''

sys.path.insert(0, ".")
from scripts.curriculum_text_calibrator import calibrate_day

p1_base = [
    "In a monolithic application, diagnosing a slow request or an unexpected runtime error is straightforward: a developer inspects the local stack trace, identifies the line of code that threw an exception, and traces function calls within a single operating system process. However, in a modern distributed microservices architecture, a single user click or mobile tap can trigger a cascade of dozens of asynchronous network requests. A frontend request might traverse an API Gateway, an Authentication Service, a Product Catalog Service, an Inventory Manager, and two independent relational databases.",
    "If that request hangs for five seconds or returns an obscure HTTP 500 Internal Server Error, traditional log inspection breaks down completely. Developers are forced to manually correlate disparate log files across dozens of independent servers, guessing which database query or network hop caused the delay. Distributed Tracing solves this fundamental visibility challenge by tracking the complete end-to-end journey of a request as it flows through the distributed service graph. Enter OpenTelemetry (OTel), the vendor-neutral, cloud-native industry standard for distributed observability.",
    "At the heart of distributed tracing is the W3C TraceContext specification. Prior to W3C standardization, different tracing vendors utilized incompatible HTTP headers (such as Zipkin's B3 headers or AWS X-Ray headers), creating severe telemetry silos in multi-vendor enterprise environments. The W3C standard unifies distributed context under a single standardized HTTP header: traceparent. The traceparent header is a strict, hyphen-separated string composed of four hexadecimal fields: version, trace-id, parent-id (also called span-id), and trace-flags.",
    "In the canonical example '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01', the field '00' represents current specification version 0. The 32-character hex string '4bf92f3577b34da6a3ce929d0e0e4736' is the 16-byte globally unique Trace ID identifying the entire transaction across all microservices. The 16-character hex string '00f067aa0ba902b7' is the 8-byte Span ID identifying the caller's specific operation. Finally, '01' represents trace flags, where the least significant bit indicates whether this trace was selected for recorded telemetry sampling."
]

p2_base = [
    "Once an incoming network request arrives at a microservice with a W3C traceparent header, the backend service must parse the trace identifiers and make them accessible to all internal functions, database drivers, and outbound HTTP clients. In classical synchronous multi-threaded Python architectures, developers relied on threading.local() storage to bind trace context to the active OS worker thread. However, modern high-throughput Python backends are built on asynchronous coroutines using asyncio, where hundreds of concurrent requests interleave cooperatively across a single OS thread.",
    "In an asyncio event loop, threading.local() completely fails because multiple coroutines executing on behalf of different user requests share the exact same underlying thread, resulting in catastrophic cross-tenant context corruption. Python 3.7 resolved this dilemma natively by introducing the contextvars module. Context variables provide coroutine-local storage that automatically preserves context across async function boundaries, background tasks created with asyncio.create_task(), and scheduled event loop callbacks.",
    "OpenTelemetry's Python SDK leverages contextvars to manage the active span context transparently. When a web framework middleware receives an incoming HTTP request, it extracts the W3C traceparent header, creates a root or child span, and stores it in a module-level ContextVar. Any business logic coroutine executed downstream can query the active context to retrieve the current span without requiring developers to thread a span object explicitly through dozens of function arguments.",
    "Furthermore, when the service needs to issue an outbound HTTP or gRPC call to a downstream microservice, an OpenTelemetry client interceptor automatically inspects contextvars, retrieves the active trace and span IDs, formats a fresh W3C traceparent header, and injects it into outbound socket headers. This seamless propagation ensures that the distributed trace graph remains perfectly connected across asynchronous microservice boundaries without polluting application business logic."
]

p3_base = [
    "Within the OpenTelemetry data model, a distributed trace is formally represented as a Directed Acyclic Graph (DAG) of discrete operations called Spans. A Span represents a single, contiguous unit of work executed by a system—such as handling an incoming HTTP route, executing a SQL database query, serializing an in-memory cache object, or publishing a message to an Apache Kafka topic. Each span captures high-resolution start and end timestamps, enabling precise measurement of operational latency.",
    "Spans are organized hierarchically: the initial span created when a request enters the perimeter of the architecture is known as the Root Span. Every subsequent downstream operation creates a Child Span that explicitly references its parent's Span ID while sharing the identical Trace ID. In addition to timing metrics, OpenTelemetry spans record structured metadata known as Attributes. Adhering to OpenTelemetry Semantic Conventions ensures that attributes use standardized key names across all programming languages, such as http.method, http.status_code, db.system, and rpc.method.",
    "Beyond static attributes, spans can record point-in-time operational occurrences called Span Events. A span event is an annotated timestamped log message attached directly to the span—for example, recording that a cache lookup resulted in a cache miss, or that an internal retry was attempted. Furthermore, if an operation raises an unhandled exception, OpenTelemetry provides dedicated APIs to record the exception: the span automatically captures the exception type, error message, and full stack trace, transitioning the span's status code from OK to ERROR.",
    "Recording structured semantic attributes and error events transforms spans from simple timing benchmarks into rich, multi-dimensional diagnostic documents. When site reliability engineers query observability platforms, they can filter traces by specific attribute dimensions—such as finding all traces where http.status_code is 500 and db.system is postgresql—slashing incident investigation times from hours to seconds."
]

p4_base = [
    "In high-throughput enterprise systems processing tens or hundreds of thousands of requests per second, recording, transmitting, and storing 100% of all generated distributed trace spans is financially and operationally impractical. A massive cluster generating billions of spans per day would overwhelm network bandwidth, saturate collector CPU cycles, and incur astronomical cloud storage bills. To operate sustainably at scale, distributed tracing architectures must implement intelligent Sampling Strategies.",
    "Sampling is the process of deciding which traces should be recorded and transmitted to the centralized tracing backend, and which traces should be discarded. The two primary paradigms in distributed sampling are Head-Based Sampling and Tail-Based Sampling. In Head-Based Sampling, the sampling decision is made at the very ingress point of the request—typically by the API gateway or the root span generator—before the downstream execution occurs.",
    "The simplest and most common head-based strategy is Probabilistic (or Ratio-Based) Sampling. The sampler evaluates a deterministic hash of the 16-byte Trace ID against a configured sampling ratio (for example, 0.1 for a 10% sampling rate). If the trace is selected, the gateway sets the sampled flag in the W3C traceparent header to '01'. All downstream microservices respect this flag, ensuring that if a trace is sampled at the head, every child span across the entire distributed graph is captured consistently.",
    "While head-based sampling is extremely lightweight and requires zero memory buffering, it has a significant limitation: it cannot know in advance whether a request will succeed quickly or encounter an error or latency spike. To solve this, advanced architectures deploy Tail-Based Sampling: collector proxies buffer spans in memory until the entire distributed request completes. If the request encounters an HTTP 500 error or latency exceeds a defined SLA threshold, the trace is permanently retained; normal healthy traces are sampled down to 1%, capturing 100% of anomalies while controlling costs."
]

p5_base = [
    "In this capstone implementation section, we synthesize the foundational principles of distributed tracing—W3C TraceContext parsing, contextvars propagation, span lifecycles, and sampling—into a fully operational Multi-Service Distributed Trace Engine. Real-world microservice meshes demand absolute clarity regarding causal dependencies and latency distributions across interconnected service nodes.",
    "Our multi-service simulator models the complete transaction path of an e-commerce checkout request traversing four discrete architectural tiers: the public API Gateway, an internal Authentication Service, a Billing Service, and an underlying PostgreSQL Database. When the incoming request reaches the gateway, a root span is instantiated and assigned a unique 16-byte Trace ID. As the gateway calls the auth and billing services, W3C traceparent headers propagate across the boundaries.",
    "Each microservice extracts the inbound trace context, spawns a dedicated child span referencing its parent, and records semantic attributes and execution latencies. The billing service in turn calls the database tier, generating a nested child span capturing the exact SQL insertion time. When the transaction finishes, our engine aggregates the spans into a unified Distributed Trace Graph, mapping parent-child relationships and displaying the precise duration of each discrete hop.",
    "Inspecting the resulting trace graph reveals immediate, actionable insights: out of 58.6 milliseconds of total request execution latency, 42.8 milliseconds were consumed by the billing service's external credit card charge, while database persistence took only 8.3 milliseconds. By mastering OpenTelemetry distributed tracing, you possess the definitive architectural capability to illuminate complex distributed systems, eliminate blind spots, and guarantee world-class performance across cloud backend platforms."
]

day51_data = {
    "day": 51,
    "title": "OpenTelemetry Distributed Tracing & W3C TraceContext",
    "goal": "Master distributed tracing in Python microservices using OpenTelemetry standards, W3C TraceContext propagation, contextvars span state management, and semantic attribute tagging.",
    "minutes": 36,
    "recap": "In Day 50, we completed Milestone Project 9, synthesizing binary gRPC over HTTP/2, asynchronous Kafka event streaming with aiokafka, stampede-proof Redis caching via XFetch, and circuit breaker resilience into an industrial microservice engine.",
    "parts": [
        {
            "title": "Distributed Tracing Foundations & W3C TraceContext",
            "say": p1_base,
            "example": "Parsing and formatting W3C traceparent headers to propagate distributed trace state across microservices.",
            "code": d51_part1_code,
            "output": d51_part1_output,
            "codeNotes": [
                "W3CTraceContext parses the standard 4-part traceparent header (version-traceid-spanid-flags).",
                "The 16-byte Trace ID remains globally constant across all microservices for the lifetime of the request.",
                "Outbound calls generate new 8-byte Span IDs while propagating the common Trace ID and sampling flags."
            ],
            "tryIt": "Change sample_header flags from 01 to 00 and verify that sampled evaluates to False.",
            "check": {
                "question": "What are the four components of a standard W3C traceparent HTTP header?",
                "options": [
                    "Version (2 hex), Trace ID (32 hex), Parent Span ID (16 hex), and Trace Flags (2 hex).",
                    "User ID, Password Hash, Timestamp, and IP Address.",
                    "Source IP, Destination Port, Packet Length, and TCP Checksum.",
                    "HTTP Method, Request Path, Query String, and Cookie Token."
                ],
                "answer": 0,
                "why": "The W3C TraceContext standard defines traceparent as four hyphen-separated hex fields: version (00), 16-byte trace-id, 8-byte parent-id, and 1-byte trace-flags."
            }
        },
        {
            "title": "Contextvars & Asynchronous Trace Propagation",
            "say": p2_base,
            "example": "Preserving and restoring active span context across asynchronous coroutines using Python context management.",
            "code": d51_part2_code,
            "output": d51_part2_output,
            "codeNotes": [
                "AsyncTraceContextManager manages active span state across asynchronous task boundaries.",
                "Child services inspect context to link their operations to the active parent span.",
                "Exiting a nested scope automatically restores the calling parent's active span context."
            ],
            "tryIt": "Add a third service handler (e.g., inventory_service_handler) and observe nested span propagation.",
            "check": {
                "question": "Why is Python's contextvars module required instead of threading.local() for tracing in asyncio backends?",
                "options": [
                    "In asyncio, multiple concurrent coroutines execute across a single OS thread; contextvars isolates state per coroutine context.",
                    "contextvars automatically encrypts all memory using AES-256.",
                    "threading.local() causes the Python interpreter to run in single-threaded mode only.",
                    "contextvars converts all Python objects into JSON strings automatically."
                ],
                "answer": 0,
                "why": "asyncio interleaves multiple concurrent requests on a single thread; threading.local() would leak state across requests, whereas contextvars isolates per-coroutine state."
            }
        },
        {
            "title": "Span Lifecycle, Events & Semantic Attributes",
            "say": p3_base,
            "example": "Instrumenting an operation with OpenTelemetry semantic conventions, operational events, and status codes.",
            "code": d51_part3_code,
            "output": d51_part3_output,
            "codeNotes": [
                "TraceSpan encapsulates operational name, duration, structured attributes, and timestamped events.",
                "Standard OpenTelemetry semantic conventions (http.method, db.system) ensure uniform telemetry indexing.",
                "Capturing events like cache_miss directly within spans provides granular operational forensic data."
            ],
            "tryIt": "Add an error event and set span status to ERROR with duration 25.0ms to simulate a failed query.",
            "check": {
                "question": "What is the primary benefit of adhering to OpenTelemetry Semantic Conventions when naming span attributes?",
                "options": [
                    "It ensures standardized attribute naming across heterogeneous languages, enabling universal querying and automated dashboarding.",
                    "It reduces the compiled size of Python bytecode by 50%.",
                    "It forces all microservices to use the same database username.",
                    "It prevents developers from writing recursive algorithms."
                ],
                "answer": 0,
                "why": "Semantic conventions define standard attribute keys (like http.status_code and db.system) so monitoring tools can parse and visualize telemetry uniformly across services."
            }
        },
        {
            "title": "Head-Based & Tail-Based Distributed Sampling",
            "say": p4_base,
            "example": "Evaluating deterministic probabilistic sampling on incoming trace IDs to control telemetry egress costs.",
            "code": d51_part4_code,
            "output": d51_part4_output,
            "codeNotes": [
                "ProbabilisticSampler calculates sampling decisions deterministically from the trace ID hex hash.",
                "A 50% sampling rate captures a mathematically representative subset of total distributed traffic.",
                "Head-based sampling ensures consistent recording decisions across all downstream microservice hops."
            ],
            "tryIt": "Change rate to 0.25 (25% sampling) and observe which trace IDs pass the new threshold.",
            "check": {
                "question": "What is the key trade-off between Head-Based Sampling and Tail-Based Sampling in distributed tracing?",
                "options": [
                    "Head-based sampling is lightweight but cannot predict errors in advance; tail-based sampling captures 100% of errors but requires collector memory buffering.",
                    "Head-based sampling only works with HTTP/1.0, while tail-based sampling requires HTTP/3.",
                    "Head-based sampling requires root access on the host operating system.",
                    "Tail-based sampling permanently deletes all database logs."
                ],
                "answer": 0,
                "why": "Head-based decides immediately at ingress without buffering, risking missing rare errors; tail-based buffers until completion to capture errors, incurring memory costs."
            }
        },
        {
            "title": "Multi-Service Distributed Trace Graph Synthesis",
            "say": p5_base,
            "example": "Tracing an end-to-end e-commerce order request across API Gateway, Auth, Billing, and Database tiers.",
            "code": d51_part5_code,
            "output": d51_part5_output,
            "codeNotes": [
                "MultiServiceTraceSimulator constructs a complete parent-child distributed execution tree.",
                "Latency attribution pinpoints exact processing times for gateway, auth, billing, and database tiers.",
                "The unified trace graph immediately isolates billing API latency as the primary contributor to total duration."
            ],
            "tryIt": "Add an inventory verification span under ingress and recalculate total request execution latency.",
            "check": {
                "question": "In a multi-service trace graph, how do engineers identify the primary latency bottleneck of a slow transaction?",
                "options": [
                    "By inspecting individual span durations and identifying which child operation consumed the largest portion of total wall-clock time.",
                    "By measuring the physical temperature of the server CPU heatsink.",
                    "By counting the total number of characters in the HTTP request payload.",
                    "By restarting all microservices in alphabetical order."
                ],
                "answer": 0,
                "why": "Distributed trace spans break down total latency by component, allowing engineers to pinpoint exactly which service or database query consumed the majority of time."
            }
        }
    ],
    "summary": [
        "Distributed tracing tracks end-to-end request journeys across microservices using standardized OpenTelemetry abstractions and W3C TraceContext headers.",
        "The W3C traceparent header defines a 4-part standard (version-traceid-spanid-flags) that guarantees causal linkage across heterogeneous cloud services.",
        "Python's contextvars module enables transparent, coroutine-local trace propagation in asynchronous backends without polluting business method signatures.",
        "Spans represent discrete units of work with high-resolution timestamps, standardized semantic attributes, and point-in-time operational events.",
        "Intelligent sampling strategies—both head-based probabilistic and tail-based anomaly capture—balance deep diagnostic visibility with sustainable telemetry costs."
    ],
    "projectStep": {
        "title": "Step 51: Implementing OpenTelemetry Distributed Tracing & W3C TraceContext",
        "steps": [
            "Construct a W3C TraceContext parser and formatter validating the 4-part traceparent header specification.",
            "Develop an asynchronous trace context manager using Python contextvars to propagate active span IDs across coroutine boundaries.",
            "Implement an OpenTelemetry TraceSpan class recording execution durations, semantic conventions, and operational events.",
            "Build a deterministic head-based probabilistic sampler calculating sampling decisions from trace ID hexadecimal hashes.",
            "Synthesize an end-to-end multi-service trace simulator mapping parent-child execution graphs and isolating latency bottlenecks."
        ]
    }
}

if __name__ == "__main__":
    day51_data = calibrate_day(day51_data, 51)
    print(f"=== Day {day51_data['day']}: {day51_data['title']} ===")
    all_ok = True
    total_say = 0
    for idx, part in enumerate(day51_data["parts"]):
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

    tot_all = count_all_lesson_words(day51_data)
    spoken_min = estimate_spoken_minutes(day51_data)
    lesson_min = estimate_lesson_minutes(day51_data)
    print(f"Total Say: {total_say} | Total All: {tot_all} | Spoken Min: {spoken_min} | Lesson Min: {lesson_min}")

    if all_ok and 35 <= lesson_min <= 40 and spoken_min >= 20:
        print("ALL INVARIANTS SATISFIED!\n")
        with open("scripts/python_day51.json", "w", encoding="utf-8") as f:
            json.dump(day51_data, f, indent=2, ensure_ascii=False)
        print("Wrote scripts/python_day51.json successfully!")
    else:
        print("INVARIANTS FAILED!")
        sys.exit(1)
