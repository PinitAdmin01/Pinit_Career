"""Test and calibrate Day 53 code snippets."""
import json
import re

def test_part1():
    print("=== PART 1 OUTPUT ===")
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
    print("Structured Logging Invariant: Single-line JSON envelopes enable high-speed indexation and filtering.")

def test_part2():
    print("\n=== PART 2 OUTPUT ===")
    import uuid

    class CorrelationIDTracker:
        @staticmethod
        def get_or_generate_correlation_id(inbound_headers: dict) -> str:
            # Check standard header variants
            for k, v in inbound_headers.items():
                if k.lower() in ["x-correlation-id", "x-request-id"]:
                    return v
            # Deterministic simulation fallback
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
    print("Correlation Invariant: Unique correlation IDs thread causal identity across all service hops.")

def test_part3():
    print("\n=== PART 3 OUTPUT ===")
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
    print("Context Injection Invariant: Context variables automatically enrich every log call with trace IDs.")

def test_part4():
    print("\n=== PART 4 OUTPUT ===")
    class PIISanitizer:
        CREDIT_CARD_REGEX = re.compile(r'\b(?:\d{4}[ -]?){3}\d{4}\b')
        BEARER_TOKEN_REGEX = re.compile(r'Bearer\s+[A-Za-z0-9_\-\.]{15,}')

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
    print("PII Redaction Invariant: Sensitive credentials and card numbers are masked before log emission.")

def test_part5():
    print("\n=== PART 5 OUTPUT ===")
    class ProductionIncidentLogAnalyzer:
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
    print("INVARIANT SATISFIED: Correlation IDs reconstruct complete execution timelines across noisy log streams.")

if __name__ == "__main__":
    test_part1()
    test_part2()
    test_part3()
    test_part4()
    test_part5()
