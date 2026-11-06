import os, datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
if os.path.exists(tasks_path):
    with open(tasks_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if any(f'TASK-{t}' in line for t in [1724, 1725, 1726, 1727, 1728]):
            # Replace IN_PROGRESS with COMPLETED
            line = line.replace('IN_PROGRESS,IN_PROGRESS', 'COMPLETED,COMPLETED')
        new_lines.append(line)
    
    with open(tasks_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Updated TASK-1724..1728 to COMPLETED in agent_tasks.csv")

# 2. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
if os.path.exists(mac_path):
    with open(mac_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if 'AGENT-476' in line:
            parts = line.split(',')
            if len(parts) >= 8:
                parts[7] = 'Completed\n'
                line = ','.join(parts)
        new_lines.append(line)
    
    with open(mac_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Updated AGENT-476 to Completed in multi_agent_control.csv")

# 3. Prepend Milestone 10 record to PROJECT_MEMORY.md
pm_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
if os.path.exists(pm_path):
    with open(pm_path, 'r', encoding='utf-8') as f:
        pm_content = f.read()
    
    entry = f"""### {now_str} - Course 03 (`node-web`) Month 2 Block 11 (Days 51–55) Milestone 10 (Core) Certified
- **Track**: Full-Stack Node.js & TypeScript Backend Engineering (`course-node-web` / `node-web`)
- **Block**: Month 2 Block 11 (Days 51–55)
- **Milestone 10 (Core)**: 🏆 High-Throughput Edge Routing & Policy Engine with Transcoding & Adaptive Rate Limiting
- **Key Modules Delivered**:
  - **Day 51**: High-Throughput Stream Processing & Reactive Pipelines: Transform Streams, Backpressure & Memory Bounds (3,056 words, 38 min, Duplex/Transform streams, highWaterMark tuning, length-prefixed binary framing, windowed batch aggregators).
  - **Day 52**: Edge Security, TLS Offloading & Zero-Trust Identity: mTLS, Ephemeral Certificates, JWKS & RBAC (3,010 words, 38 min, TLS 1.3, ALPN negotiation, mTLS client certificate verification, CRL/OCSP registries, JWKS RS256/ES256 verification, RBAC matrices).
  - **Day 53**: Full-Lifecycle Distributed Observability: OpenTelemetry SDK, Trace Context Injection & Prometheus Histograms (3,012 words, 38 min, Three Pillars of Observability, W3C TraceContext propagation, Prometheus counters/gauges/histograms, AsyncLocalStorage trace-log correlation).
  - **Day 54**: Dynamic Reverse Proxying, Protocol Translation & WebSocket Multiplexing: HTTP/1.1 to gRPC & WebSocket Hubs (2,967 words, 38 min, Radix route matching, header sanitization, gRPC 5-byte framing, status mapping, RFC 6455 WebSockets, circuit breaker outlier ejection).
  - **Day 55 (Milestone 10 Core)**: High-Throughput Edge Routing & Policy Engine with Transcoding & Adaptive Rate Limiting (2,990 words, 40 min, unified ingress pipeline, multi-tenant isolation, zero-trust security gate, adaptive token bucket with latency backpressure, least-connections dispatching, W3C tracing, Capstone Grade A+ verification).
- **Invariants Certified**:
  - 100% strict 5-part `LongLesson` format with all 25 parts >= 580 words (2,967-3,056 words/day, delivering 25 min of spoken audio per day).
  - Pure JS VM sandbox execution passed for all 25 lesson code snippets with 100% deterministic output match (zero random/date jitter).
  - Gate v2 Visual JSON contracts generated at `src/lib/data/lessonVisuals/node-web/day-{{51..55}}.json` with exact SHA-256 `codeHash` bindings and 4 synchronized steps.
  - Exam and Assignment sandbox tests passing in `NODE_WEB_30_DAYS_CONFIGS`.
  - Regression test suite `web_track_long_lessons.test.ts` (26/26 tests) and block expansion test `node_days51_55_expansion.test.ts` (3/3 tests) passing with zero defects.
  - Zero TypeScript compiler errors (`npx tsc --noEmit` clean).

---

"""
    # Insert entry right after the top header
    header_end = pm_content.find('\n---\n')
    if header_end != -1:
        updated_pm = pm_content[:header_end + 5] + "\n" + entry + pm_content[header_end + 5:]
    else:
        updated_pm = entry + pm_content
    
    with open(pm_path, 'w', encoding='utf-8') as f:
        f.write(updated_pm)
    print("Prepended Milestone 10 (Core) record to PROJECT_MEMORY.md")
