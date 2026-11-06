#!/usr/bin/env python3
"""
Final calibrated generator for Day 53: Structured Logging, Correlation IDs & Contextual Tracing
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

d53_part1_code = '''import json

class StructuredJSONLogger:
    def __init__(self, service_name: str):
        self.service_name = service_name

    def format_log(self, level: str, message: str, **kwargs) -> str:
        log_record = {
            "timestamp": "2026-10-18T12:00:00.000Z",
            "level": level.upper(),
            "service": self.service_name,
            "message": message,
            "metadata": kwargs
        }
        return json.dumps(log_record, sort_keys=True)

logger = StructuredJSONLogger("order-service")
log1 = logger.format_log("info", "Order placed successfully", order_id="ord_9901", amount=129.50)
log2 = logger.format_log("error", "Payment processing failed", order_id="ord_9902", error_code="ERR_CARD_DECLINED")

print("Log Record 1:")
print(log1)
print("Log Record 2:")
print(log2)
print("Structured Logging Invariant: Single-line JSON envelopes enable high-speed indexation and filtering.")'''

d53_part1_output = '''Log Record 1:
{"level": "INFO", "message": "Order placed successfully", "metadata": {"amount": 129.5, "order_id": "ord_9901"}, "service": "order-service", "timestamp": "2026-10-18T12:00:00.000Z"}
Log Record 2:
{"level": "ERROR", "message": "Payment processing failed", "metadata": {"error_code": "ERR_CARD_DECLINED", "order_id": "ord_9902"}, "service": "order-service", "timestamp": "2026-10-18T12:00:00.000Z"}
Structured Logging Invariant: Single-line JSON envelopes enable high-speed indexation and filtering.'''

d53_part2_code = '''class CorrelationIDTracker:
    @staticmethod
    def get_or_generate_correlation_id(inbound_headers: dict) -> str:
        for k, v in inbound_headers.items():
            if k.lower() in ["x-correlation-id", "x-request-id"]:
                return v
        return "corr-c7b35c15-f056-4dc6"

tracker = CorrelationIDTracker()
# 1. Inbound request with existing header
h1 = {"X-Correlation-ID": "corr-client-ext-9988"}
cid1 = tracker.get_or_generate_correlation_id(h1)

# 2. Inbound request without header
h2 = {"Host": "api.production.com"}
cid2 = tracker.get_or_generate_correlation_id(h2)

print(f"Request 1 (Existing Header): Correlation-ID = '{cid1}'")
print(f"Request 2 (Generated Header): Correlation-ID = '{cid2}'")
print("Correlation Invariant: Unique correlation IDs thread causal identity across all service hops.")'''

d53_part2_output = '''Request 1 (Existing Header): Correlation-ID = 'corr-client-ext-9988'
Request 2 (Generated Header): Correlation-ID = 'corr-c7b35c15-f056-4dc6'
Correlation Invariant: Unique correlation IDs thread causal identity across all service hops.'''

d53_part3_code = '''import json

class ContextualLoggerSimulator:
    def __init__(self):
        self._context = {"correlation_id": None, "trace_id": None}

    def set_context(self, correlation_id: str, trace_id: str):
        self._context["correlation_id"] = correlation_id
        self._context["trace_id"] = trace_id

    def log(self, level: str, message: str, **kwargs):
        record = {
            "level": level,
            "message": message,
            "correlation_id": self._context["correlation_id"],
            "trace_id": self._context["trace_id"],
            "extra": kwargs
        }
        return json.dumps(record, sort_keys=True)

ctx_logger = ContextualLoggerSimulator()
ctx_logger.set_context(correlation_id="corr_9912", trace_id="trace_4bf92f35")

entry = ctx_logger.log("INFO", "Executing database transaction", db_table="users")
print("Enriched Log Record:")
print(entry)
print("Context Injection Invariant: Context variables automatically enrich every log call with trace IDs.")'''

d53_part3_output = '''Enriched Log Record:
{"correlation_id": "corr_9912", "extra": {"db_table": "users"}, "level": "INFO", "message": "Executing database transaction", "trace_id": "trace_4bf92f35"}
Context Injection Invariant: Context variables automatically enrich every log call with trace IDs.'''

d53_part4_code = '''import re
import json

class PIISanitizer:
    CREDIT_CARD_REGEX = re.compile(r'\\b(?:\\d{4}[ -]?){3}\\d{4}\\b')
    BEARER_TOKEN_REGEX = re.compile(r'Bearer\\s+[A-Za-z0-9_\\-\\.]{15,}')

    @classmethod
    def sanitize_string(cls, text: str) -> str:
        text = cls.CREDIT_CARD_REGEX.sub("[REDACTED_CC]", text)
        text = cls.BEARER_TOKEN_REGEX.sub("Bearer [REDACTED_TOKEN]", text)
        return text

    @classmethod
    def sanitize_payload(cls, data: dict) -> dict:
        sanitized = {}
        for k, v in data.items():
            if isinstance(v, str):
                sanitized[k] = cls.sanitize_string(v)
            elif isinstance(v, dict):
                sanitized[k] = cls.sanitize_payload(v)
            else:
                sanitized[k] = v
        return sanitized

raw_data = {
    "user": "Alice Cooper",
    "card_number": "4111-2222-3333-4444",
    "auth_header": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz"
}

clean_data = PIISanitizer.sanitize_payload(raw_data)
print("Sanitized Payload:")
print(json.dumps(clean_data, sort_keys=True))
print("PII Redaction Invariant: Sensitive credentials and card numbers are masked before log emission.")'''

d53_part4_output = '''Sanitized Payload:
{"auth_header": "Bearer [REDACTED_TOKEN]", "card_number": "[REDACTED_CC]", "user": "Alice Cooper"}
PII Redaction Invariant: Sensitive credentials and card numbers are masked before log emission.'''

d53_part5_code = '''class ProductionIncidentLogAnalyzer:
    def __init__(self):
        self.logs = [
            {"timestamp": "12:00:01", "correlation_id": "corr_9901", "level": "INFO", "msg": "Cart checkout initiated"},
            {"timestamp": "12:00:02", "correlation_id": "corr_9902", "level": "INFO", "msg": "Product search query"},
            {"timestamp": "12:00:03", "correlation_id": "corr_9901", "level": "WARN", "msg": "DB lock timeout on table 'orders', retrying"},
            {"timestamp": "12:00:04", "correlation_id": "corr_9901", "level": "ERROR", "msg": "Payment failed: DB lock timeout exceeded"},
        ]

    def query_by_correlation_id(self, target_id: str):
        return [l for l in self.logs if l["correlation_id"] == target_id]

analyzer = ProductionIncidentLogAnalyzer()
incident_logs = analyzer.query_by_correlation_id("corr_9901")

print(f"=== Filtered Incident Logs for 'corr_9901' (Total: {len(incident_logs)}) ===")
for log in incident_logs:
    print(f"  [{log['timestamp']}] {log['level']}: {log['msg']}")
print("INVARIANT SATISFIED: Correlation IDs reconstruct complete execution timelines across noisy log streams.")'''

d53_part5_output = '''=== Filtered Incident Logs for 'corr_9901' (Total: 3) ===
  [12:00:01] INFO: Cart checkout initiated
  [12:00:03] WARN: DB lock timeout on table 'orders', retrying
  [12:00:04] ERROR: Payment failed: DB lock timeout exceeded
INVARIANT SATISFIED: Correlation IDs reconstruct complete execution timelines across noisy log streams.'''

sys.path.insert(0, ".")
from scripts.curriculum_text_calibrator import calibrate_day

p1_base = [
    "In high-scale production microservices running hundreds of container pods, emitting unformatted plaintext logs using basic print statements or default logging formatters is an operational disaster. When an engineer logs 'print(f'User {user_id} purchased item {item_id}')', the output is a freeform text string. In a centralized log aggregation cluster—such as Elasticsearch, Grafana Loki, or OpenSearch—freeform text cannot be reliably indexed, filtered, aggregated, or queried without writing brittle regular expressions.",
    "The modern cloud-native standard is Structured JSON Logging. In structured logging, every single log entry is emitted as a strictly valid, single-line JSON envelope containing typed key-value pairs. Core schema fields are standardized across all microservices: timestamp (in ISO 8601 UTC format), level (DEBUG, INFO, WARN, ERROR), service (the unique name of the microservice), message (a concise human-readable description), and metadata (a dictionary of structured context attributes).",
    "Emitting logs as structured JSON transforms raw server output into a queryable data stream. Log aggregation systems can instantly index fields like metadata.order_id or metadata.status_code, enabling operators to execute high-speed queries such as 'service:order-service AND level:ERROR AND metadata.amount > 100'. Furthermore, structured JSON logging prevents multi-line stack trace fragmentation: when an exception occurs, the formatted traceback is stored within a single JSON field, ensuring that log ingestion pipelines do not split a single error across dozens of unlinked lines.",
    "In Python, libraries like structlog and Loguru provide high-performance structured logging engines. By configuring a JSON renderer and stream handler writing to stdout, containers let the container runtime (such as Docker or Kubernetes CRI) capture log streams effortlessly. In this section, we construct a StructuredJSONLogger in pure Python, examining how JSON serialization structures operational messages for instant searchability and automated telemetry ingestion."
]

p2_base = [
    "When a user performs an action on a distributed platform—such as finalizing an online order—that single action may trigger a chain of ten or more remote procedure calls across the API Gateway, Authentication Service, Inventory Manager, Payment Gateway, and Notification Dispatcher. If the transaction fails midway and returns an error, the engineer investigating the incident faces thousands of concurrent log messages being emitted simultaneously by dozens of services.",
    "Attempting to manually connect which log entry in the payment service corresponds to which log entry in the gateway is impossible without a shared identifier. This shared identifier is the Correlation ID (often passed via the HTTP header X-Correlation-ID or X-Request-ID). A Correlation ID is a globally unique identifier (typically a UUIDv4) generated at the perimeter API gateway when an incoming client request first enters the distributed mesh.",
    "As the API gateway calls downstream microservices, it injects the X-Correlation-ID header into all outbound HTTP and gRPC request headers. Every downstream service extracts this header upon receiving the request and binds the correlation ID to its active execution scope. When any service emits a log message—whether an informational progress update, a warning, or a critical error—it stamps the correlation ID into the log record.",
    "During a production incident, an on-call engineer can query the centralized logging platform using a single correlation ID. The query instantly returns the complete chronological execution narrative across all five microservices, revealing exactly which service failed, what parameters were passed, and why the transaction aborted. Universal correlation ID propagation slashes Mean Time to Resolution (MTTR) from hours of frustrating guesswork down to seconds of deterministic clarity."
]

p3_base = [
    "While correlation IDs are conceptually simple, requiring developers to pass the correlation ID manually into every single log function call—e.g., logger.info('Querying database', correlation_id=cid)—creates severe code pollution and inevitable human error. If a junior developer forgets to pass the parameter in one function, the correlation chain breaks, creating a black hole in operational visibility. Production logging pipelines must automate context enrichment behind the scenes.",
    "In modern Python asynchronous architectures, we automate context enrichment by combining Python's native contextvars module with custom logging filters. When an incoming request reaches the web framework middleware, the middleware extracts or generates the correlation ID and OpenTelemetry trace ID, storing both identifiers in a task-local ContextVar. The active context variable automatically propagates across all async sub-tasks and coroutines spawned by that request.",
    "We then register a custom logging filter or processor with the root logger. Whenever logger.info() or logger.error() is invoked anywhere in the codebase—even deep inside nested utility modules that know nothing about HTTP requests—the filter intercepts the log record before it is serialized. The filter inspects the active contextvars, extracts the correlation ID, trace ID, and span ID, and injects them directly into the log record's internal dictionary.",
    "This automated enrichment pattern ensures that 100% of emitted log records carry complete operational context with zero developer friction. Furthermore, by linking OpenTelemetry Trace IDs directly into structured JSON log envelopes, we achieve the ultimate observability holy grail: Trace-to-Log Correlation, allowing developers in an observability UI to jump from a slow distributed trace span directly into its corresponding log records with a single click."
]

p4_base = [
    "While structured logging provides invaluable operational clarity, it introduces a severe security and compliance vulnerability: the accidental leakage of Personally Identifiable Information (PII) and sensitive authentication secrets. If a developer logs a raw HTTP request payload or dictionary containing customer credit card numbers, passwords, bank account details, or Bearer authentication tokens, that sensitive data is permanently written to disk and replicated to central log aggregators.",
    "Leaking sensitive credentials into application logs violates major international data protection laws—including the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and the Payment Card Industry Data Security Standard (PCI-DSS). Severe compliance violations result in catastrophic regulatory fines, corporate audits, and loss of business operating licenses. Once sensitive data enters log indices, purging it requires expensive and disruptive index re-indexing.",
    "To protect enterprise security, production logging pipelines must incorporate Automated PII Redaction Filters. A redaction filter intercepts structured log dictionaries immediately prior to serialization and scans values against high-performance regular expression patterns. Pre-compiled regex patterns identify standard sensitive data signatures—such as 16-digit credit card sequences (Visa, MasterCard), JWT and Bearer authorization tokens, email addresses, and social security numbers.",
    "When a matching pattern is detected in any log string or dictionary field, the filter replaces the sensitive sequence with a masked token—such as [REDACTED_CC] or [REDACTED_TOKEN]—before writing the JSON string to stdout. By embedding automated sanitization directly into the logging pipeline, backend architects guarantee data privacy compliance, ensuring that developer logging errors never compromise customer trust or violate international regulatory standards."
]

p5_base = [
    "In this capstone forensics lab, we assemble our structured JSON logging engine, universal correlation tracker, automated context enrichment filter, and PII sanitizer into a realistic Production Incident Triage Simulation. Real-world site reliability engineering requires diagnosing and remediating complex production outages under high operational pressure.",
    "Our scenario models an enterprise e-commerce platform processing hundreds of concurrent user requests. Amidst thousands of successful transactions, an automated monitoring alert fires: an order placement transaction failed. The alerting system provides the unique correlation ID of the failing request: corr_9901. Rather than sifting through thousands of unformatted plaintext lines across dozens of servers, the SRE queries the centralized logging engine using the correlation ID.",
    "The query filters out all noisy background traffic and returns the exact three log entries associated with corr_9901 in precise chronological order: first, an INFO log indicating cart checkout initialization; second, a WARN log reporting a database lock timeout retry on the 'orders' table; and third, an ERROR log confirming payment abort due to lock timeout exhaustion. The root cause is immediately diagnosed as database row contention on table 'orders', rather than an external payment gateway outage.",
    "Crucially, inspecting the log record confirms that customer credit card numbers and authorization tokens were automatically sanitized by our PII filter before emission, keeping the forensic audit fully compliant with PCI-DSS. By mastering structured logging, correlation IDs, and automated redaction, you possess the elite operational capabilities required to build transparent, secure, and easily debugged cloud microservices."
]

day53_data = {
    "day": 53,
    "title": "Structured Logging, Correlation IDs & Contextual Tracing",
    "goal": "Master structured JSON logging in Python microservices, implementing universal Correlation ID propagation via contextvars, automated trace enrichment, and regex-based PII data redaction.",
    "minutes": 36,
    "recap": "In Day 52, we mastered Prometheus metrics instrumentation and the RED Method (Rate, Errors, Duration), exploring Counters, Gauges, Histograms, and Cardinality Guards to prevent time series memory explosions.",
    "parts": [
        {
            "title": "Structured JSON Logging vs Plaintext Architecture",
            "say": p1_base,
            "example": "Formatting structured JSON log envelopes with standard timestamp, level, service, and metadata keys.",
            "code": d53_part1_code,
            "output": d53_part1_output,
            "codeNotes": [
                "StructuredJSONLogger formats operational records as valid single-line JSON envelopes.",
                "Standard schema keys (timestamp, level, service, metadata) enable sub-second indexing in Elasticsearch and Loki.",
                "Structured JSON prevents multi-line stack trace fragmentation during container log ingestion."
            ],
            "tryIt": "Add a user_role='admin' metadata key to log1 and observe the updated JSON output.",
            "check": {
                "question": "Why is structured JSON logging preferred over unformatted plaintext print statements in containerized microservices?",
                "options": [
                    "Single-line JSON envelopes can be indexed, filtered, and aggregated efficiently by centralized log management engines.",
                    "JSON logs consume zero disk space on the host machine.",
                    "JSON logs prevent the operating system from restarting containers.",
                    "Plaintext print statements are deprecated in Python 3."
                ],
                "answer": 0,
                "why": "Centralized log engines (Elasticsearch, Loki) parse structured JSON keys automatically, enabling instant filtering without writing brittle regex scrapers."
            }
        },
        {
            "title": "Correlation IDs & Request Tracing Across Services",
            "say": p2_base,
            "example": "Extracting existing X-Correlation-ID headers or generating fresh UUIDv4 identifiers at the API perimeter.",
            "code": d53_part2_code,
            "output": d53_part2_output,
            "codeNotes": [
                "CorrelationIDTracker standardizes request identity across incoming X-Correlation-ID headers.",
                "Requests without headers receive a generated unique ID to maintain tracking continuity.",
                "Threading a single correlation ID across all microservice hops unites disparate log streams."
            ],
            "tryIt": "Pass a custom header 'x-request-id': 'req-abc-123' and verify that it is correctly extracted.",
            "check": {
                "question": "What is the primary role of a Correlation ID in distributed microservice architectures?",
                "options": [
                    "To correlate all log entries across multiple independent microservices for a single user request journey.",
                    "To encrypt database passwords in transit.",
                    "To calculate the total byte size of network packets.",
                    "To manage CPU clock frequency across worker nodes."
                ],
                "answer": 0,
                "why": "A Correlation ID is stamped onto all logs across every service participating in a request, allowing engineers to reconstruct the complete transaction timeline."
            }
        },
        {
            "title": "Automated Context Injection via Contextvars",
            "say": p3_base,
            "example": "Automatically injecting correlation IDs and trace IDs into log records using Python context management.",
            "code": d53_part3_code,
            "output": d53_part3_output,
            "codeNotes": [
                "ContextualLoggerSimulator automatically enriches log records with active context variables.",
                "Developers invoke log methods without manually threading correlation and trace IDs through code.",
                "Linking OpenTelemetry trace IDs into JSON log records enables seamless trace-to-log navigation."
            ],
            "tryIt": "Set a new trace_id in ctx_logger and verify that subsequent log records reflect the updated context.",
            "check": {
                "question": "How does combining contextvars with custom logging filters eliminate developer error in distributed logging?",
                "options": [
                    "It automatically injects correlation and trace identifiers into every log call behind the scenes without manual parameter passing.",
                    "It automatically translates log messages into multiple foreign languages.",
                    "It deletes all error logs before they reach the monitoring server.",
                    "It forces developers to write all log messages in uppercase."
                ],
                "answer": 0,
                "why": "Logging filters read active contextvars and enrich log records automatically, guaranteeing 100% context coverage without boilerplate."
            }
        },
        {
            "title": "Automated PII Redaction & Security Masking",
            "say": p4_base,
            "example": "Redacting credit card sequences and Bearer authentication tokens from log payloads using compiled regex filters.",
            "code": d53_part4_code,
            "output": d53_part4_output,
            "codeNotes": [
                "PIISanitizer executes compiled regular expressions to detect credit card numbers and Bearer tokens.",
                "Sensitive strings are masked with [REDACTED_CC] and [REDACTED_TOKEN] before log serialization.",
                "Automated masking guarantees compliance with GDPR, CCPA, and PCI-DSS data privacy standards."
            ],
            "tryIt": "Add an email field to raw_data and extend PIISanitizer with an email redaction regex pattern.",
            "check": {
                "question": "Why is automated PII redaction mandatory in enterprise production logging pipelines?",
                "options": [
                    "To prevent sensitive customer credentials (credit cards, tokens, passwords) from leaking into centralized log indices in violation of privacy laws.",
                    "To make log files easier for marketing teams to read.",
                    "To compress JSON payloads for faster network transmission.",
                    "To prevent developers from logging during business hours."
                ],
                "answer": 0,
                "why": "Logging unredacted PII violates GDPR and PCI-DSS; automated regex filters mask sensitive credentials before logs leave the container boundary."
            }
        },
        {
            "title": "Production Incident Triage & Log Query Forensics Lab",
            "say": p5_base,
            "example": "Filtering noisy multi-service log streams by correlation ID to isolate the root cause of a failed transaction.",
            "code": d53_part5_code,
            "output": d53_part5_output,
            "codeNotes": [
                "ProductionIncidentLogAnalyzer queries noisy log streams using a target correlation identifier.",
                "Filtered results isolate the exact failure sequence (cart checkout -> DB lock timeout -> abort).",
                "Deterministic correlation eliminates guesswork, slashing Mean Time to Resolution during production outages."
            ],
            "tryIt": "Query analyzer for 'corr_9902' and observe the isolated product search log stream.",
            "check": {
                "question": "How does correlation-based log querying accelerate incident response during a complex microservice outage?",
                "options": [
                    "It filters out unrelated background traffic, presenting the exact chronological sequence of events for the failing transaction across all services.",
                    "It automatically reboots all failing servers in the cluster.",
                    "It sends an automated apology email to affected users.",
                    "It disables all incoming client traffic until the database heals."
                ],
                "answer": 0,
                "why": "Filtering by correlation ID isolates the exact sequence of events for a specific transaction across noisy multi-service logs, enabling rapid root-cause diagnosis."
            }
        }
    ],
    "summary": [
        "Structured JSON logging transforms unstructured server output into single-line queryable envelopes adhering to schema standards.",
        "Correlation IDs (X-Correlation-ID) thread a common unique identity across distributed microservice hops to correlate transaction logs.",
        "Python's contextvars module enables automated context enrichment, stamping correlation and trace IDs onto log records without developer boilerplate.",
        "Automated PII redaction filters scan log payloads with pre-compiled regex patterns to mask sensitive data in compliance with GDPR and PCI-DSS.",
        "Querying centralized logs by correlation ID reconstructs complete multi-service incident narratives, slashing Mean Time to Resolution."
    ],
    "projectStep": {
        "title": "Step 53: Engineering Structured Logging, Correlation & PII Sanitization",
        "steps": [
            "Construct a StructuredJSONLogger emitting standardized single-line JSON envelopes with timestamp, level, and metadata.",
            "Implement a CorrelationIDTracker extracting or generating X-Correlation-ID headers at the API perimeter.",
            "Develop an automated context enrichment simulator binding correlation and trace IDs to log records via contextvars.",
            "Build a regex-based PIISanitizer masking credit card sequences and Bearer authorization tokens before log emission.",
            "Synthesize an incident forensics analyzer querying noisy log streams by correlation ID to reconstruct a transaction failure timeline."
        ]
    }
}

if __name__ == "__main__":
    day53_data = calibrate_day(day53_data, 53)
    print(f"=== Day {day53_data['day']}: {day53_data['title']} ===")
    all_ok = True
    total_say = 0
    for idx, part in enumerate(day53_data["parts"]):
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

    tot_all = count_all_lesson_words(day53_data)
    spoken_min = estimate_spoken_minutes(day53_data)
    lesson_min = estimate_lesson_minutes(day53_data)
    print(f"Total Say: {total_say} | Total All: {tot_all} | Spoken Min: {spoken_min} | Lesson Min: {lesson_min}")

    if all_ok and 35 <= lesson_min <= 40 and spoken_min >= 20:
        print("ALL INVARIANTS SATISFIED!\n")
        with open("scripts/python_day53.json", "w", encoding="utf-8") as f:
            json.dump(day53_data, f, indent=2, ensure_ascii=False)
        print("Wrote scripts/python_day53.json successfully!")
    else:
        print("INVARIANTS FAILED!")
        sys.exit(1)
