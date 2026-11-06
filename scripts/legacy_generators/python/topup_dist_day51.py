# scripts/topup_dist_day51.py

with open("scripts/create_dist_day51_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 2 addition
p2_target = '"Notice how parsing the header validates the 32-character trace ID'
p2_extra = '''    "From an asynchronous messaging perspective, context propagation must also bridge message queue boundaries. When a microservice publishes an event to an Apache Kafka topic or RabbitMQ queue, the OpenTelemetry injector serializes the W3C `traceparent` and Baggage into Kafka Record Headers. When a downstream consumer group member polls the record from a partition, the consumer extractor deserializes the headers, starts a new child span referencing the publisher span ID, and links the asynchronous background consumer pipeline directly to the originating user trace.",
    "This asynchronous tracing linkage is pivotal in event-driven systems: even if a message sits in a partition queue for ten minutes before being processed by an asynchronous batch worker, the distributed trace clearly displays the queue wait latency alongside active processing duration, allowing performance engineers to distinguish between slow database execution and message broker consumer lag.",
    "Notice how parsing the header validates the 32-character trace ID'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how enqueuing two spans into a processor with batch size two'
p3_extra = '''    "To prevent network serialization overhead from saturating application CPU cores, modern OpenTelemetry SDKs utilize the OpenTelemetry Protocol (OTLP) encoded via Google Protocol Buffers (Protobuf) over gRPC HTTP/2 transport. Protobuf serialization packs trace attributes, timestamps, and span hierarchies into tight, compact binary payloads that compress by up to eighty percent compared to legacy JSON formats, slashing network bandwidth consumption across cloud availability zones.",
    "Furthermore, OpenTelemetry architectures support Auto-Instrumentation (via bytecode manipulation in Java, monkey-patching in Python, or monkey-wrapping in Node.js). Auto-instrumentation agents automatically inject tracing interceptors into popular HTTP frameworks (such as Express, Fastify, Spring Boot, or Flask), database drivers (such as PostgreSQL, MySQL, and MongoDB), and RPC clients without requiring developers to write a single line of manual tracing code.",
    "Notice how enqueuing two spans into a processor with batch size two'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how a trace with an error flag is sampled immediately'
p4_extra = '''    "To scale tail-based sampling horizontally across multiple collector instances, observability architectures deploy a Trace ID Routing Layer (such as the OpenTelemetry Load-Balancing Exporter). Because child spans for a single trace arrive from dozens of independent microservice pods simultaneously, a random round-robin load balancer would scatter spans for the same trace across five different collector instances, making tail evaluation impossible! The trace ID routing layer hashes the trace ID and routes all spans sharing the same trace ID to the exact same collector instance, guaranteeing that the tail sampler holds complete, coherent traces before evaluating sampling rules.",
    "Notice how a trace with an error flag is sampled immediately'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production audit confirms 8,500,000 spans ingested'
p5_extra = '''    "From a continuous reliability engineering perspective, our production tracing platform integrates directly with Service Level Objectives (SLOs) and automated rollback triggers. If a new canary release of the order microservice causes p99 latency to degrade by more than fifteen percent, automated tracing telemetry identifies the exact newly introduced slow code path within forty seconds, triggering an automated Kubernetes deployment rollback before customer checkout funnels are compromised.",
    "Furthermore, our distributed tracing dataset powers Service Dependency Graph Generation. By aggregating millions of span parent-child relationships, the observability platform dynamically visualizes live architecture topologies, highlighting high-traffic RPC edges, circular dependency anti-patterns, and single-point-of-failure bottlenecks across hundreds of microservices in real time.",
    "Notice how the production audit confirms 8,500,000 spans ingested'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day51_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Day 51 data script!")
