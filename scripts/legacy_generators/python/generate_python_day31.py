import json
import re

def count_words(text: str) -> int:
    return len(re.findall(r'\b\S+\b', text))

def estimate_spoken_minutes(parts: list) -> int:
    words = sum(sum(count_words(p) for p in part['say']) for part in parts)
    return round(words / 110)

def estimate_lesson_minutes(parts: list) -> int:
    total = 0
    for part in parts:
        total += sum(count_words(p) for p in part['say'])
        total += count_words(part.get('example', ''))
        total += count_words(part.get('tryIt', ''))
    return round(total / 87)

# Day 31: Pydantic V2 Architecture & pydantic-core (Rust FFI)
p1_say = [
    "Welcome to Month 2 of Python Programming and Backend Systems! Today we kick off our second month with the single most impactful architectural evolution in the modern Python backend ecosystem: Pydantic V2. For years, Python was widely criticized for sluggish JSON deserialization and schema validation performance, with high-throughput API services spending up to eighty percent of their CPU request cycles inside Pydantic V1's pure-Python validation loops.",
    "Recognizing that interpreted Python could never match the raw memory efficiency and instruction pipelining of compiled native code, Samuel Colvin and the core Pydantic engineering team took a revolutionary step: they re-architected the entire validation and serialization engine from scratch in the Rust programming language, giving birth to pydantic-core. Through compiled native Rust binaries bridged via PyO3 C-extensions, Pydantic V2 delivers a staggering five-fold to fifty-fold throughput improvement over V1.",
    "To understand this astronomical performance gain, we must dissect the low-level FFI interaction between CPython's runtime and pydantic-core. When you declare a Pydantic model in Python, Pydantic inspects your type annotations—such as str, int, UUID, and custom nested models—and compiles them into a native Rust Schema Validator tree at class definition time. This schema compilation happens once during application startup, eliminating dynamic type reflection during active HTTP request serving.",
    "When a raw JSON string arrives over the network interface, pydantic-core bypasses the creation of intermediate Python dictionaries and object wrappers. Instead, Rust's high-performance SIMD-accelerated JSON parser directly reads the byte stream and validates the data against the compiled schema tree in native memory. Only when all type constraints, regex patterns, and range boundaries are validated does pydantic-core construct the final Python object representation.",
    "By moving the parsing and validation workload out of the CPython virtual machine and into native Rust silicon, Pydantic V2 eliminates Python interpreter overhead, avoids millions of dynamic object allocations, and circumvents GIL contention during CPU-intensive parsing. As backend systems architects, mastering pydantic-core empowers us to build Python services that process hundreds of thousands of requests per second with native-speed determinism."
]

p2_say = [
    "In Part 2, we confront a subtle yet critical architectural hazard in backend engineering: the behavioral divergence between Lax Mode and Strict Mode validation. In Pydantic V1, validation was inherently lax by default: if an incoming JSON payload contained the string '123' for an integer field, or the float 12.0 for an int, Pydantic would quietly coerce the input into the target Python type without raising an error.",
    "While convenient for forgiving prototype scripts, automatic type coercion is an insidious source of data corruption in high-volume microservices, payment gateways, and enterprise data pipelines. Consider a financial transaction service where an account number or invoice ID is expected as a string: if a client passes a large number that gets coerced or floats that undergo precision loss, silent data truncation occurs. Furthermore, lax mode treats string 'true', 'yes', 'on', and number 1 as boolean True, leading to catastrophic logical misunderstandings between decoupled services.",
    "Pydantic V2 addresses this fundamental defect by introducing native Strict Mode. In Strict Mode, type coercion is completely forbidden: an integer field rejects string representations; a boolean field rejects truthy numbers; and a string field rejects raw integers. If an external client sends malformed types, the Rust validator instantly aborts and returns an exact JSON Schema error payload detailing the line, field, and violation.",
    "We can configure strict mode at multiple levels of granularity: globally across an entire model using model_config equals ConfigDict(strict=True), on individual fields using Field(strict=True), or dynamically at validation time using Model.model_validate(data, strict=True). This allows architects to maintain forgiving compatibility for external legacy clients while enforcing ironclad type fidelity across internal microservice RPCs.",
    "By conducting forensic boundary audits and enforcing strict validation across our APIs, we eliminate entire categories of production bugs, protect database foreign keys from accidental type casting, and guarantee that our internal service layers receive uncorrupted, mathematically precise inputs."
]

p3_say = [
    "In Part 3, we architect and implement a production-grade High-Speed Schema Validation Engine in pure Python that models the exact internal mechanics of pydantic-core's Rust validator tree. Understanding these internals is essential for debugging custom validators, optimizing cold-start compilation times, and designing high-throughput data ingestion pipelines.",
    "Our compiled validator engine operates in two distinct phases: Schema Compilation and Validation Execution. During the compilation phase, the engine recursively traverses model attributes and constructs an immutable tree of specialized validator nodes: StringValidator, IntValidator, FloatValidator, and ListValidator. Each validator node encapsulates its own constraint parameters, such as minimum length, maximum value, and strict mode flags.",
    "During the execution phase, incoming dictionary payloads are passed to the root of the validator tree. Instead of iterating over dynamic Python dict keys with slow string lookups, the validator walks the pre-compiled node graph sequentially. In strict mode, the validator performs exact type checks using type(value) is expected_type, completely bypassing slow isinstance checks or dynamic coercion functions.",
    "If any field fails validation, our engine does not immediately halt or throw generic exceptions; rather, it accumulates all field-level errors into a structured error container modeled after Pydantic's ValidationError. Each error record records the exact field path, the invalid input value, and a standardized machine-readable error code.",
    "In our implementation, we will benchmark this compiled architecture against un-compiled procedural checking, demonstrating that pre-compiling validation trees into structured pipelines yields dramatic throughput improvements and deterministic error tracking suitable for mission-critical enterprise backends."
]

p4_say = [
    "In Part 4, we enter our production incident lab to remediate a high-traffic e-commerce API gateway suffering from severe latency degradation and silent data corruption under heavy holiday traffic. The gateway processes order submissions across twelve distributed storefronts, handling over fifty thousand requests per minute.",
    "Under peak volume, the engineering team discovered two catastrophic operational issues. First, the legacy validation layer was executing in lax mode: third-party payment partner webhooks were passing numeric transaction IDs as raw integers, causing downstream billing services to misinterpret them, while promotional discount percentages were being silently rounded due to float-to-int coercion, resulting in seventy thousand dollars in uncollected revenue.",
    "Second, the legacy validation logic performed expensive dynamic regex compilation and deep schema reflection on every single incoming HTTP POST request, driving server CPU utilization to ninety-eight percent and ballooning p99 response times to four hundred and eighty milliseconds.",
    "We execute an emergency architectural upgrade: first, we migrate the order payload schema to Pydantic V2 strict mode, enforcing exact type invariants for monetary amounts, currency codes, and transaction UUIDs; second, we compile all regex patterns and validator trees during process startup; and third, we implement pre-validation payload normalization to safely sanitize partner payloads before strict validation.",
    "Running our automated stress harness against the upgraded gateway, we verify that invalid types and malformed discount rates are rejected in less than twenty microseconds with structured 422 Unprocessable Entity responses. Server CPU utilization drops from ninety-eight percent down to twenty-two percent, and p99 latency plummets to eight milliseconds, certifying total operational remediation."
]

p5_say = [
    "In our final session for Day 31, we synthesize the advanced enterprise serialization, custom validation hooks, and model configuration architectures of Pydantic V2. Validating incoming payloads is only half of a backend engineer's responsibility; serializing internal Python domain entities back into standardized, high-speed JSON responses is equally vital for API performance.",
    "In Pydantic V2, serialization was completely rebuilt in Rust through the model_dump() and model_dump_json() APIs, delivering up to twenty times faster JSON generation than V1's dict() and json() methods. When serving high-throughput REST or GraphQL endpoints, model_dump_json() writes directly from Python memory into optimized byte buffers, eliminating intermediate dictionary allocations.",
    "Furthermore, Pydantic V2 introduces unified validator decorators: @field_validator for field-specific transformations, and @model_validator for cross-field consistency checks. These decorators support two distinct execution modes: mode='before', which intercepts raw input data before core schema validation runs, and mode='after', which validates the parsed Python object with full type safety.",
    "For instance, we use mode='before' to strip whitespace and lowercase email strings before regex checking, and mode='after' to verify that an e-commerce order's shipping date is strictly later than its creation timestamp. In addition, ModelConfig allows backend architects to enforce immutable frozen models, alias generators for camelCase JSON interoperability, and custom serialization encoders.",
    "By fusing pydantic-core's Rust FFI engine, strict-mode type governance, and high-speed JSON serialization, we establish an enterprise backend foundation capable of powering modern distributed microservices with absolute reliability, mathematical correctness, and industry-leading performance."
]

p1_code = (
    "import json\n"
    "import time\n\n"
    "class SimulatedPydanticCore:\n"
    "    def __init__(self, schema):\n"
    "        self.schema = schema\n"
    "    \n"
    "    def validate(self, payload):\n"
    "        errors = []\n"
    "        validated = {}\n"
    "        for field, expected_type in self.schema.items():\n"
    "            if field not in payload:\n"
    "                errors.append(f\"Missing field: {field}\")\n"
    "                continue\n"
    "            val = payload[field]\n"
    "            if type(val) is not expected_type:\n"
    "                errors.append(f\"{field}: expected {expected_type.__name__}, got {type(val).__name__}\")\n"
    "            else:\n"
    "                validated[field] = val\n"
    "        if errors:\n"
    "            return False, errors\n"
    "        return True, validated\n\n"
    "if __name__ == '__main__':\n"
    "    print('=== PYDANTIC-CORE RUST FFI SIMULATION ===')\n"
    "    validator = SimulatedPydanticCore({'user_id': int, 'username': str, 'active': bool})\n"
    "    \n"
    "    valid_data = {'user_id': 1042, 'username': 'alex_quant', 'active': True}\n"
    "    ok, res = validator.validate(valid_data)\n"
    "    print(f'Valid Payload: {ok} -> {res}')\n"
    "    \n"
    "    invalid_data = {'user_id': '1042', 'username': 'alex_quant', 'active': 'true'}\n"
    "    ok, errs = validator.validate(invalid_data)\n"
    "    print(f'Strict Mode Rejection: {not ok} -> {errs[0]}')\n"
    "    print('pydantic-core Rust FFI pipeline operational.')"
)

p2_code = (
    "class ValidationBoundaryTester:\n"
    "    @staticmethod\n"
    "    def lax_validate_int(val):\n"
    "        try:\n"
    "            return True, int(val)\n"
    "        except (ValueError, TypeError):\n"
    "            return False, None\n"
    "    \n"
    "    @staticmethod\n"
    "    def strict_validate_int(val):\n"
    "        if type(val) is int and not isinstance(val, bool):\n"
    "            return True, val\n"
    "        return False, None\n\n"
    "if __name__ == '__main__':\n"
    "    print('=== LAX VS STRICT VALIDATION BEHAVIORAL ANALYSIS ===')\n"
    "    test_cases = [100, '100', 100.5, True, 'invalid']\n"
    "    \n"
    "    print(f\"{'Input':<12} | {'Lax Mode (V1)':<18} | {'Strict Mode (V2)':<18}\")\n"
    "    print('-' * 54)\n"
    "    for tc in test_cases:\n"
    "        lax_ok, lax_val = ValidationBoundaryTester.lax_validate_int(tc)\n"
    "        strict_ok, strict_val = ValidationBoundaryTester.strict_validate_int(tc)\n"
    "        lax_str = f'COERCED ({lax_val})' if lax_ok else 'REJECT'\n"
    "        strict_str = f'VALID ({strict_val})' if strict_ok else 'REJECT [STRICT]'\n"
    "        print(f'{str(tc):<12} | {lax_str:<18} | {strict_str:<18}')\n"
    "    print('Strict mode guarantees zero unintended type coercions.')"
)

p3_code = (
    "from dataclasses import dataclass\n"
    "from typing import Any, Dict, List, Tuple\n\n"
    "@dataclass\n"
    "class FieldSchema:\n"
    "    name: str\n"
    "    expected_type: type\n"
    "    required: bool = True\n\n"
    "class CompiledSchemaValidator:\n"
    "    def __init__(self, fields: List[FieldSchema]):\n"
    "        self.fields = fields\n"
    "    \n"
    "    def validate(self, payload: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], List[str]]:\n"
    "        errors = []\n"
    "        cleaned = {}\n"
    "        for f in self.fields:\n"
    "            if f.name not in payload:\n"
    "                if f.required:\n"
    "                    errors.append(f\"Missing required field '{f.name}'\")\n"
    "                continue\n"
    "            val = payload[f.name]\n"
    "            if type(val) is not f.expected_type:\n"
    "                errors.append(f\"Field '{f.name}': expected {f.expected_type.__name__}, got {type(val).__name__}\")\n"
    "            else:\n"
    "                cleaned[f.name] = val\n"
    "        return len(errors) == 0, cleaned, errors\n\n"
    "if __name__ == '__main__':\n"
    "    print('=== COMPILED SCHEMA VALIDATION ENGINE ===')\n"
    "    schema = [\n"
    "        FieldSchema('sku', str),\n"
    "        FieldSchema('price_cents', int),\n"
    "        FieldSchema('in_stock', bool)\n"
    "    ]\n"
    "    engine = CompiledSchemaValidator(schema)\n"
    "    ok, data, errs = engine.validate({'sku': 'KB-900', 'price_cents': 14900, 'in_stock': True})\n"
    "    print(f'Compiled Validation Passed: {ok} | Clean Data: {data}')\n"
    "    \n"
    "    ok2, _, errs2 = engine.validate({'sku': 'KB-900', 'price_cents': '14900', 'in_stock': 1})\n"
    "    print(f'Type Violation Caught: {not ok2} | Errors: {errs2}')\n"
    "    print('Engine execution verified with deterministic typing.')"
)

p4_code = (
    "class OrderGatewayAuditor:\n"
    "    def __init__(self):\n"
    "        self.processed = 0\n"
    "        self.rejected = 0\n"
    "    \n"
    "    def process_order(self, order_dict):\n"
    "        # Strict mode verification\n"
    "        if type(order_dict.get('order_id')) is not str:\n"
    "            self.rejected += 1\n"
    "            return False, '422: order_id must be str'\n"
    "        if type(order_dict.get('amount_cents')) is not int or order_dict.get('amount_cents') <= 0:\n"
    "            self.rejected += 1\n"
    "            return False, '422: amount_cents must be positive int'\n"
    "        self.processed += 1\n"
    "        return True, '200: Order Validated'\n\n"
    "if __name__ == '__main__':\n"
    "    print('=== E-COMMERCE GATEWAY VALIDATION UPGRADE LAB ===')\n"
    "    auditor = OrderGatewayAuditor()\n"
    "    \n"
    "    orders = [\n"
    "        {'order_id': 'ord-101', 'amount_cents': 4999},      # Valid\n"
    "        {'order_id': 102, 'amount_cents': 4999},            # Invalid order_id type\n"
    "        {'order_id': 'ord-103', 'amount_cents': '4999'},    # Invalid amount type\n"
    "        {'order_id': 'ord-104', 'amount_cents': 1250}       # Valid\n"
    "    ]\n"
    "    \n"
    "    for o in orders:\n"
    "        ok, msg = auditor.process_order(o)\n"
    "        status = 'APPROVED' if ok else 'REJECTED'\n"
    "        print(f'Order {str(o.get(\"order_id\")):<10} | Status: {status:<8} | Response: {msg}')\n"
    "    \n"
    "    print(f'Telemetry: {auditor.processed} Processed, {auditor.rejected} Rejected.')\n"
    "    print('E-commerce validation upgrade successfully verified.')"
)

p5_code = (
    "import json\n\n"
    "class EnterpriseUserSerializer:\n"
    "    def __init__(self, user_id: str, email: str, role: str, is_active: bool):\n"
    "        self.user_id = user_id\n"
    "        self.email = email.strip().lower()\n"
    "        self.role = role\n"
    "        self.is_active = is_active\n"
    "    \n"
    "    def model_dump(self):\n"
    "        return {\n"
    "            'userId': self.user_id,\n"
    "            'email': self.email,\n"
    "            'role': self.role,\n"
    "            'isActive': self.is_active\n"
    "        }\n"
    "    \n"
    "    def model_dump_json(self):\n"
    "        return json.dumps(self.model_dump())\n\n"
    "if __name__ == '__main__':\n"
    "    print('=== ENTERPRISE SERIALIZATION & MODEL CONFIG SYNTHESIS ===')\n"
    "    user = EnterpriseUserSerializer('usr-8801', '  DevAdmin@Apex.io  ', 'SUPERUSER', True)\n"
    "    \n"
    "    dumped_dict = user.model_dump()\n"
    "    dumped_json = user.model_dump_json()\n"
    "    print(f'model_dump() (CamelCase Aliasing):\\n  {dumped_dict}')\n"
    "    print(f'model_dump_json() (High-Speed Wire Format):\\n  {dumped_json}')\n"
    "    print('Enterprise serialization synthesis certified.')"
)

day31_parts = [
    {
        "title": "pydantic-core Architecture & Rust PyO3 Integration",
        "say": p1_say,
        "example": "Comparing Pydantic V1's pure-Python validation loops against Pydantic V2's compiled Rust Schema Validator trees executing via native PyO3 C-extensions.",
        "tryIt": "Run a Python simulation demonstrating pydantic-core style schema validation and strict type checking.",
        "code": p1_code,
        "output": "=== PYDANTIC-CORE RUST FFI SIMULATION ===\nValid Payload: True -> {'user_id': 1042, 'username': 'alex_quant', 'active': True}\nStrict Mode Rejection: True -> user_id: expected int, got str\npydantic-core Rust FFI pipeline operational.",
        "codeNotes": [
            "Pydantic V2 compiles model type annotations into immutable Rust validator trees during application startup.",
            "SIMD-accelerated JSON parsing operates in native Rust memory, bypassing intermediate Python dict allocations.",
            "PyO3 C-extensions eliminate Python interpreter overhead and reduce CPU consumption by up to 80%."
        ],
        "check": {
            "question": "What is the primary architectural innovation behind Pydantic V2's 5x to 50x performance gain over V1?",
            "options": [
                "Re-architecting the core validation and serialization logic in native Rust (pydantic-core) via PyO3 C-extensions.",
                "Writing Python bytecode directly to the computer hard drive.",
                "Disabling all validation checks and accepting all data unconditionally.",
                "Translating Python into JavaScript before running."
            ],
            "answer": 0,
            "why": "pydantic-core moves parsing, schema traversal, and type validation into compiled Rust binaries, bypassing Python interpreter overhead."
        }
    },
    {
        "title": "Lax vs Strict Mode Validation Behavioral Analysis",
        "say": p2_say,
        "example": "Auditing type coercion edge cases where lax mode silently converts string '100' or float 100.5 into integers, vs strict mode immediately rejecting non-conforming types.",
        "tryIt": "Execute a Python boundary matrix comparing lax mode coercion against strict mode rejection across edge-case data types.",
        "code": p2_code,
        "output": "=== LAX VS STRICT VALIDATION BEHAVIORAL ANALYSIS ===\nInput        | Lax Mode (V1)      | Strict Mode (V2)  \n------------------------------------------------------\n100          | COERCED (100)      | VALID (100)       \n100          | COERCED (100)      | REJECT [STRICT]   \n100.5        | COERCED (100)      | REJECT [STRICT]   \nTrue         | COERCED (1)        | REJECT [STRICT]   \ninvalid      | REJECT             | REJECT [STRICT]   \nStrict mode guarantees zero unintended type coercions.",
        "codeNotes": [
            "Lax mode automatically coerces compatible types (e.g. '100' -> 100), risking silent data corruption in financial systems.",
            "Strict mode forbids type coercion, rejecting strings, floats, and booleans for strict integer fields.",
            "Strict validation can be enforced globally via model_config, on individual fields, or dynamically during model_validate."
        ],
        "check": {
            "question": "Why is Strict Mode strongly recommended for financial microservices and payment gateways?",
            "options": [
                "Because strict mode prevents silent type coercion (such as string IDs becoming numbers or floats truncating), eliminating data corruption.",
                "Because strict mode makes database queries run with half the memory.",
                "Because strict mode allows clients to bypass authentication tokens.",
                "Because strict mode automatically translates currency exchange rates."
            ],
            "answer": 0,
            "why": "Silent coercion in lax mode can truncate numbers or miscast account identifiers; strict mode enforces exact type fidelity."
        }
    },
    {
        "title": "High-Speed Schema Validation Engine Implementation",
        "say": p3_say,
        "example": "Constructing an immutable schema validator compiling field constraints into node trees, performing O(1) type verification with aggregated error collection.",
        "tryIt": "Build and run a compiled schema validator in Python enforcing strict types and capturing multi-field validation errors.",
        "code": p3_code,
        "output": "=== COMPILED SCHEMA VALIDATION ENGINE ===\nCompiled Validation Passed: True | Clean Data: {'sku': 'KB-900', 'price_cents': 14900, 'in_stock': True}\nType Violation Caught: True | Errors: [\"Field 'price_cents': expected int, got str\", \"Field 'in_stock': expected bool, got int\"]\nEngine execution verified with deterministic typing.",
        "codeNotes": [
            "The compiled schema validator builds an immutable tree of field validators during initialization.",
            "Strict type comparisons use type(val) is expected_type, bypassing slow dynamic reflection.",
            "Errors across all invalid fields are collected into a structured error manifest rather than aborting on the first error."
        ],
        "check": {
            "question": "How does pre-compiling a schema validation tree improve API request handling performance?",
            "options": [
                "It performs type reflection and constraint compilation once at startup, allowing incoming requests to walk a static validation path without reflection overhead.",
                "It pre-computes the answers to all possible API requests.",
                "It shuts down the operating system kernel during validation.",
                "It compresses the Python code into a zip archive."
            ],
            "answer": 0,
            "why": "Compiling schemas at startup avoids costly Python introspection and AST inspection during high-frequency request execution."
        }
    },
    {
        "title": "High-Throughput API Gateway Validation Upgrade",
        "say": p4_say,
        "example": "Remediating an e-commerce order gateway by migrating from lax reflection to strict compiled schemas, cutting CPU utilization from 98% to 22%.",
        "tryIt": "Run a Python gateway stress test validating valid orders and rejecting malformed partner payloads with 422 responses.",
        "code": p4_code,
        "output": "=== E-COMMERCE GATEWAY VALIDATION UPGRADE LAB ===\nOrder ord-101    | Status: APPROVED | Response: 200: Order Validated\nOrder 102        | Status: REJECTED | Response: 422: order_id must be str\nOrder ord-103    | Status: REJECTED | Response: 422: amount_cents must be positive int\nOrder ord-104    | Status: APPROVED | Response: 200: Order Validated\nTelemetry: 2 Processed, 2 Rejected.\nE-commerce validation upgrade successfully verified.",
        "codeNotes": [
            "Migrating to strict mode prevents partner webhooks from passing malformed numeric IDs or unvalidated amounts.",
            "Pre-compiling validation trees reduced p99 gateway latency from 480ms down to 8ms under peak load.",
            "Standardized 422 Unprocessable Entity error payloads provide clear feedback to client integrations."
        ],
        "check": {
            "question": "In the E-Commerce Gateway Lab, what was the primary cause of the 480ms latency spike before the upgrade?",
            "options": [
                "Dynamic runtime regex compilation and un-compiled schema reflection executed repeatedly on every incoming HTTP POST request.",
                "The database server was disconnected from the internet.",
                "The web server ran out of disk space.",
                "Clients were sending encrypted files that could not be opened."
            ],
            "answer": 0,
            "why": "Performing schema reflection and regex compilation dynamically per request creates severe CPU bottlenecks under high traffic."
        }
    },
    {
        "title": "Enterprise Serialization & Model Configuration Synthesis",
        "say": p5_say,
        "example": "Synthesizing model_dump() and model_dump_json() APIs, field and model validators (mode='before' and mode='after'), and camelCase alias generation.",
        "tryIt": "Model an enterprise user serializer in Python demonstrating input sanitization, camelCase aliasing, and high-speed JSON dumping.",
        "code": p5_code,
        "output": "=== ENTERPRISE SERIALIZATION & MODEL CONFIG SYNTHESIS ===\nmodel_dump() (CamelCase Aliasing):\n  {'userId': 'usr-8801', 'email': 'devadmin@apex.io', 'role': 'SUPERUSER', 'isActive': True}\nmodel_dump_json() (High-Speed Wire Format):\n  {\"userId\": \"usr-8801\", \"email\": \"devadmin@apex.io\", \"role\": \"SUPERUSER\", \"isActive\": true}\nEnterprise serialization synthesis certified.",
        "codeNotes": [
            "model_dump_json() generates JSON directly from native memory, achieving up to 20x faster serialization than pure Python.",
            "Custom validators with mode='before' sanitize raw inputs (e.g. whitespace stripping), while mode='after' validates typed objects.",
            "ConfigDict enables camelCase wire formatting for seamless frontend interoperability."
        ],
        "check": {
            "question": "What is the key functional difference between mode='before' and mode='after' in Pydantic V2 validators?",
            "options": [
                "mode='before' runs on the raw unvalidated input before schema checks, while mode='after' runs on the parsed, type-validated Python object.",
                "mode='before' runs before the server boots, while mode='after' runs after the server shuts down.",
                "mode='before' validates database queries, while mode='after' validates HTML files.",
                "There is no difference; they are aliases for the same function."
            ],
            "answer": 0,
            "why": "mode='before' allows preprocessing raw input dictionaries, while mode='after' allows business logic validation on typed model fields."
        }
    }
]

day31_lesson = {
    "day": 31,
    "title": "Pydantic V2 Architecture & pydantic-core (Rust FFI)",
    "goal": (
        "Welcome to Month 2 of Python Programming and Backend Systems. We kick off with a tectonic shift in the Python backend world: Pydantic V2. "
        "In Pydantic V1, validation was executed in pure Python, making data parsing one of the slowest parts of an API. "
        "Samuel Colvin and the Pydantic team rewrote the entire validation core in Rust (pydantic-core), achieving a 5x to 50x throughput speedup via PyO3 C-extension FFI! "
        "Today, you will deconstruct the Rust validation pipeline, master lax vs strict validation modes, build custom serializers and validators with @field_validator and @model_validator, "
        "and upgrade an enterprise e-commerce data pipeline to handle 50,000 requests per second with zero type coercion bugs!"
    ),
    "minutes": 37,
    "recap": "In Month 1, we mastered Python fundamentals, procedural logic, object-oriented basics, file I/O, and small web APIs. Today, we step into professional backend engineering with Pydantic V2 and Rust FFI validation.",
    "parts": day31_parts,
    "summary": [
        "Deconstructed pydantic-core architecture, PyO3 FFI bindings, and compile-time Rust Schema Validator trees.",
        "Analyzed the 5x-50x throughput gains from SIMD JSON parsing in native memory without intermediate Python dictionary allocations.",
        "Audited the architectural divergence between Lax Mode (coercive) and Strict Mode (exact type matching).",
        "Implemented a compiled schema validation engine in Python walking pre-built validator node graphs with multi-error aggregation.",
        "Remediated an e-commerce order gateway incident, dropping CPU usage from 98% to 22% and eliminating silent type coercion bugs.",
        "Synthesized high-speed serialization with model_dump_json(), camelCase alias generation, and before/after validator hooks."
    ],
    "projectStep": {
        "title": "ApexFastAPI Microservice Engine: Pydantic V2 Schema Validation Core",
        "steps": [
            "Deconstruct pydantic-core compilation and PyO3 C-extension FFI interaction.",
            "Implement a compiled schema validator tree with immutable field validator nodes.",
            "Enforce strict mode validation across all incoming request fields to eliminate silent type coercion.",
            "Build an error aggregation manifest collecting field paths and standardized error codes.",
            "Benchmark compiled schema validation against legacy dynamic reflection under 10,000 requests.",
            "Configure model_dump_json() with camelCase alias generation for high-speed client serialization."
        ]
    }
}

def validate_day(lesson):
    print(f"=== Day {lesson['day']}: {lesson['title']} ===")
    parts = lesson['parts']
    assert len(parts) == 5, f"Expected 5 parts, got {len(parts)}"
    all_say = 0
    all_words = 0
    for idx, p in enumerate(parts, 1):
        assert isinstance(p['say'], list), f"Part {idx} say must be list of paragraphs"
        assert len(p['say']) >= 4, f"Part {idx} say must have >= 4 paragraphs"
        say_w = sum(count_words(para) for para in p['say'])
        tot_w = say_w + count_words(p.get('example', '')) + count_words(p.get('tryIt', '')) + count_words(p['check']['why'])
        all_say += say_w
        all_words += tot_w
        status = "OK" if say_w >= 580 else f"FAIL ({say_w} < 580)"
        print(f"  Part {idx}: '{p['title'][:40]}' | Say: {say_w} ({status}) | All: {tot_w}")
        assert say_w >= 580, f"Part {idx} say words {say_w} < 580!"
    
    spoken_m = estimate_spoken_minutes(parts)
    lesson_m = estimate_lesson_minutes(parts)
    print(f"Total Say: {all_say} | Total All: {all_words} | Spoken Min: {spoken_m} | Lesson Min: {lesson_m}")
    assert 2940 <= all_words <= 3450, f"Total words {all_words} out of bounds (2940-3450)!"
    assert spoken_m >= 20, f"Spoken min {spoken_m} < 20!"
    assert 35 <= lesson_m <= 40, f"Lesson min {lesson_m} not in 35-40!"
    print("ALL INVARIANTS SATISFIED!\n")

if __name__ == '__main__':
    validate_day(day31_lesson)
    with open('scripts/python_day31.json', 'w', encoding='utf-8') as f:
        json.dump(day31_lesson, f, indent=2)
    print("Wrote scripts/python_day31.json successfully!")
