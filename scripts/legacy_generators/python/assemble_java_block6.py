import json
import hashlib
import os
import re
import sys
import subprocess

sys.path.insert(0, 'scripts')
from block6_day26 import DAY_26
from block6_day27 import DAY_27
from block6_day28 import DAY_28
from block6_day29 import DAY_29
from block6_day30 import DAY_30

NEW_DAYS = [DAY_26, DAY_27, DAY_28, DAY_29, DAY_30]

print("=== ASSEMBLING BLOCK 6 (DAYS 26 to 30) ===")

# 1. Update java30DayData.ts titles for Days 26 to 30
with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    daydata = f.read()

daydata = daydata.replace(
    '"title": "Modern Concurrency III: Thread Pools, ExecutorService & CompletableFuture Async Pipelines",\n    "desc": "HashMap stores key-value pairs',
    '"title": "Java Collections Framework II: Key-Value Maps & HashMap Mechanics",\n    "desc": "HashMap stores key-value pairs'
)
daydata = daydata.replace(
    '"aTitle": "Day 26 Assignment: Stock Lookup Map (Modern Concurrency III)"',
    '"aTitle": "Day 26 Assignment: Stock Lookup Map"'
)
daydata = daydata.replace(
    '"title": "High-Performance I/O & Modern File Systems: Classic Streams, NIO.2, Zero-Copy & Memory-Mapped Buffers",\n    "desc": "Parameterize classes and methods with generic type parameters <T>',
    '"title": "Generics & Type Parameterization: Type Safety, Generic Classes & Methods",\n    "desc": "Parameterize classes and methods with generic type parameters <T>'
)
daydata = daydata.replace(
    '"aTitle": "Day 27 Assignment: Generic Box (High-Performance I/O & Modern File Systems)"',
    '"aTitle": "Day 27 Assignment: Generic Box"'
)
daydata = daydata.replace(
    '"title": "Modern Network Programming & HTTP: TCP/UDP Sockets, Non-Blocking Selectors & Java 11+ Reactive HttpClient",\n    "desc": "Execute tasks concurrently using the Runnable interface',
    '"title": "Multithreading & Concurrency Fundamentals: Threads, Runnables & Execution Lifecycle",\n    "desc": "Execute tasks concurrently using the Runnable interface'
)
daydata = daydata.replace(
    '"eTitle": "Day 28 Challenge: Parallel Task Runner (Modern Network Programming & HTTP)"',
    '"eTitle": "Day 28 Challenge: Parallel Task Runner"'
)
daydata = daydata.replace(
    '"title": "JVM Architecture & Performance Engineering: ClassLoaders, Memory Model, ZGC & JIT Compilation",\n    "desc": "Process data streams efficiently and parse real multi-line application log records',
    '"title": "Stream & Text I/O: Readers, Writers, Buffered Streams & Data Parsing",\n    "desc": "Process data streams efficiently and parse real multi-line application log records'
)
daydata = daydata.replace(
    '"title": "Milestone 6: Full Production-Grade Resilient Microservice Gateway & Java Principal Engineer Certification Capstone",\n    "desc": "Synthesize all 30 days into a unified enterprise financial auditing engine',
    '"title": "Month 1 Capstone: Enterprise Ledger Audit & Financial Transaction Engine",\n    "desc": "Synthesize all 30 days into a unified enterprise financial auditing engine'
)

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(daydata)
print("Updated src/lib/data/java30DayData.ts titles for Days 26 to 30.")

# 2. Update javaBasicsLongLessons.ts
with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Locate where Day 26 starts and Day 31 starts
m_start = re.search(r'\n  \{\s*["\']?day["\']?:\s*26\s*,', content)
if not m_start:
    raise Exception("Could not find start of Day 26 in javaBasicsLongLessons.ts")
day26_start_idx = m_start.start()

m_end = re.search(r'\n  \{\s*["\']?day["\']?:\s*31\s*,', content)
if not m_end:
    raise Exception("Could not find start of Day 31 in javaBasicsLongLessons.ts")
day31_start_idx = m_end.start()

print(f"Day 26 starts at index: {day26_start_idx}")
print(f"Day 31 starts at index: {day31_start_idx}")

prefix = content[:day26_start_idx]
suffix = content[day31_start_idx:]

new_days_json = []
for d in NEW_DAYS:
    s = json.dumps(d, indent=4)
    # indent by 2 spaces
    indented = '\n'.join(('  ' + line if line else line) for line in s.split('\n'))
    new_days_json.append(indented)

new_content = prefix + '\n' + ',\n'.join(new_days_json) + ',\n' + suffix.lstrip('\n')

with open('src/lib/data/javaBasicsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated src/lib/data/javaBasicsLongLessons.ts for Days 26 to 30.")

# 3. Generate on-disk visual JSON files for Days 26 to 30
visuals_dir = 'src/lib/data/lessonVisuals/java-basics'
os.makedirs(visuals_dir, exist_ok=True)

for d in NEW_DAYS:
    day_num = d['day']
    padded = f"day-{day_num:02d}.json"
    p = os.path.join(visuals_dir, padded)

    entries = []
    for part in d['parts']:
        code_str = part.get('code', '')
        h = hashlib.sha256(code_str.encode('utf-8')).hexdigest()

        spec = {
            "template": "stack-queue",
            "title": f"{part['title'][:45]} — Execution Topology",
            "mode": "stack",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Frame initialization and contract binding for {part['title'][:35]}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Execution Engine", "Class Invariants"],
                    "action": "push",
                    "actionItem": "Class Invariants",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Bytecode instruction sequence for {part['title'][:35]}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Operand Stack", "Heap Reference"],
                    "action": "push",
                    "actionItem": "Heap Reference",
                    "tones": ["data", "active", "accent"]
                },
                {
                    "at": "say2",
                    "caption": "Step 3: Verification of invariants, type boundaries, and memory state...",
                    "mode": "stack",
                    "items": ["main() Frame", "Verified Contract", "Return Register"],
                    "action": "push",
                    "actionItem": "Verified Contract",
                    "tones": ["data", "ok", "ok"]
                },
                {
                    "at": "summary",
                    "caption": "Step 4: Clean stack frame and yield execution...",
                    "mode": "stack",
                    "items": ["Result Register (Success)"],
                    "action": "pop",
                    "actionItem": "Result Register (Success)",
                    "tones": ["ok"]
                }
            ]
        }

        entries.append({
            "partTitle": part['title'],
            "codeHash": h,
            "spec": spec
        })

    visual_obj = {
        "schemaVersion": 1,
        "entries": entries
    }

    with open(p, 'w', encoding='utf-8') as f_vis:
        json.dump(visual_obj, f_vis, indent=2, ensure_ascii=False)
    print(f"Generated visual JSON: {p}")

print("\nRunning build-long-lessons-json.cjs...")
subprocess.run(["node", "scripts/utils/build-long-lessons-json.cjs"], check=True)

print("\nBLOCK 6 ASSEMBLY COMPLETE!")
