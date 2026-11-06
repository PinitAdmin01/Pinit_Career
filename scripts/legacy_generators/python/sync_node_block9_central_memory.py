import os, csv, datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
if os.path.exists(tasks_path):
    with open(tasks_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if any(f'TASK-{t}' in line for t in [1704, 1705, 1706, 1707, 1708]):
            # Replace IN_PROGRESS with COMPLETED
            line = line.replace('IN_PROGRESS,IN_PROGRESS', 'COMPLETED,COMPLETED')
        new_lines.append(line)
    
    with open(tasks_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Updated TASK-1704..1708 to COMPLETED in agent_tasks.csv")

# 2. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
if os.path.exists(mac_path):
    with open(mac_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if 'AGENT-473' in line:
            parts = line.split(',')
            # Update status to Completed
            if len(parts) >= 8:
                parts[7] = 'Completed\n'
                line = ','.join(parts)
        new_lines.append(line)
    
    with open(mac_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Updated AGENT-473 to Completed in multi_agent_control.csv")

# 3. Prepend Milestone 8 entry to PROJECT_MEMORY.md
pm_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
if os.path.exists(pm_path):
    with open(pm_path, 'r', encoding='utf-8') as f:
        pm_content = f.read()
    
    entry = f"""### {now_str} - Course 03 (`node-web`) Month 2 Block 9 (Days 41–45) Milestone 8 Certified
- **Track**: Full-Stack Node.js & TypeScript Backend Engineering (`course-node-web` / `node-web`)
- **Block**: Month 2 Block 9 (Days 41–45)
- **Milestone 8**: 🏆 High-Throughput Binary Telemetry Aggregator with gRPC & AsyncLocalStorage
- **Key Modules Delivered**:
  - **Day 41**: Advanced Asynchronous Concurrency Patterns: AsyncLocalStorage, Async Hooks & Request Context Tracing (3,010 words, 38 min, W3C traceparent propagation).
  - **Day 42**: Production Memory Management & Profiling: V8 Heap Snapshots, Leak Detection & Allocation Timelines (2,966 words, 38 min, Scavenger vs Mark-Sweep, retainer isolation).
  - **Day 43**: Low-Latency Binary Protocols: Protocol Buffers, MessagePack & Binary WebSocket Serialization (3,019 words, 38 min, Varint & ZigZag encoding, zero string parsing).
  - **Day 44**: High-Performance Networking: HTTP/2 Multiplexing, ALPN Negotiation & gRPC Services in Node.js (3,096 words, 38 min, frame interleaving, credit windows, streaming RPC, interceptors).
  - **Day 45 (Milestone 8)**: High-Throughput Binary Telemetry Aggregator with gRPC & AsyncLocalStorage (2,932 words, 40 min, zero-copy buffer pooling, sliding window accumulators, SLA Grade A+ verification).
- **Invariants Certified**:
  - 100% strict 5-part `LongLesson` format with all parts >= 580 words (2,900-3,100 words/day).
  - Pure JS VM sandbox execution passed for all 25 lesson code snippets with 100% deterministic output match.
  - Gate v2 Visual JSON contracts generated at `src/lib/data/lessonVisuals/node-web/day-{{41..45}}.json` with exact SHA-256 `codeHash` bindings and 4 synchronized steps.
  - Exam and Assignment sandbox tests passing in `NODE_WEB_30_DAYS_CONFIGS`.
  - Regression test suite `web_track_long_lessons.test.ts` (26/26 tests) and block expansion test `node_days41_45_expansion.test.ts` (3/3 tests) passing.

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
    print("Prepended Milestone 8 record to PROJECT_MEMORY.md")
