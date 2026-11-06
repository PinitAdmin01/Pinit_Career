import json
import hashlib
import os
import re
import sys
import subprocess

sys.path.insert(0, 'scripts')
from block5_day21 import DAY_21
from block5_day22 import DAY_22
from block5_day23 import DAY_23
from block5_day24 import DAY_24
from block5_day25 import DAY_25
from block6_day26 import DAY_26
from block6_day27 import DAY_27
from block6_day28 import DAY_28
from block6_day29 import DAY_29
from block6_day30 import DAY_30

ALL_NEW_DAYS = [DAY_21, DAY_22, DAY_23, DAY_24, DAY_25, DAY_26, DAY_27, DAY_28, DAY_29, DAY_30]

print("=== ASSEMBLING BLOCKS 5 & 6 (DAYS 21 to 30) ===")

# 1. Update java30DayData.ts
with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    daydata = f.read()

title_patches = [
    # Day 21
    ('"title": "Functional Programming I: Lambdas, SAM Interfaces, Function Packages & Method References",\n    "desc": "Interfaces specify pure contracts that implementing classes must fulfill.',
     '"title": "Interfaces, Abstract Contracts & Milestone 4: Payment Gateway Engine",\n    "desc": "Interfaces specify pure contracts that implementing classes must fulfill.'),
    # Day 22
    ('"title": "Java Streams I: Stream Pipelines, Lazy Evaluation, Intermediate & Terminal Operations",\n    "desc": "Static fields and methods belong to the Class itself',
     '"title": "Static Keyword: Static Fields, Methods & Class-Level Memory Topologies",\n    "desc": "Static fields and methods belong to the Class itself'),
    # Day 23
    ('"title": "Java Streams II: Advanced Collectors, Grouping Pipelines & Parallel Streams",\n    "desc": "Exceptions represent runtime anomalies.',
     '"title": "Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery",\n    "desc": "Exceptions represent runtime anomalies.'),
    # Day 24
    ('"title": "Modern Concurrency I: Threads, Memory Visibility (volatile), Atomic Variables & CAS",\n    "desc": "Defensively validate method arguments using throw',
     '"title": "Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies",\n    "desc": "Defensively validate method arguments using throw'),
    # Day 25
    ('"title": "Modern Concurrency II: Synchronization, Locks & Milestone 5 Concurrent Banking Engine",\n    "desc": "ArrayList is a dynamic resizable array in Java.',
     '"title": "Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals",\n    "desc": "ArrayList is a dynamic resizable array in Java.'),
    ('"aTitle": "Day 25 Assignment: Add and Get List Elements (Modern Concurrency II)"',
     '"aTitle": "Day 25 Assignment: Add and Get List Elements"'),
    # Day 26
    ('"title": "Modern Concurrency III: Thread Pools, ExecutorService & CompletableFuture Async Pipelines",\n    "desc": "HashMap stores key-value pairs',
     '"title": "Java Collections Framework II: Key-Value Maps & HashMap Mechanics",\n    "desc": "HashMap stores key-value pairs'),
    ('"aTitle": "Day 26 Assignment: Stock Lookup Map (Modern Concurrency III)"',
     '"aTitle": "Day 26 Assignment: Stock Lookup Map"'),
    # Day 27
    ('"title": "High-Performance I/O & Modern File Systems: Classic Streams, NIO.2, Zero-Copy & Memory-Mapped Buffers",\n    "desc": "Parameterize classes and methods with generic type parameters <T>',
     '"title": "Generics & Type Parameterization: Type Safety, Generic Classes & Methods",\n    "desc": "Parameterize classes and methods with generic type parameters <T>'),
    ('"aTitle": "Day 27 Assignment: Generic Box (High-Performance I/O & Modern File Systems)"',
     '"aTitle": "Day 27 Assignment: Generic Box"'),
    # Day 28
    ('"title": "Modern Network Programming & HTTP: TCP/UDP Sockets, Non-Blocking Selectors & Java 11+ Reactive HttpClient",\n    "desc": "Execute tasks concurrently using the Runnable interface',
     '"title": "Multithreading & Concurrency Fundamentals: Threads, Runnables & Execution Lifecycle",\n    "desc": "Execute tasks concurrently using the Runnable interface'),
    ('"eTitle": "Day 28 Challenge: Parallel Task Runner (Modern Network Programming & HTTP)"',
     '"eTitle": "Day 28 Challenge: Parallel Task Runner"'),
    # Day 29
    ('"title": "JVM Architecture & Performance Engineering: ClassLoaders, Memory Model, ZGC & JIT Compilation",\n    "desc": "Process data streams efficiently and parse real multi-line application log records',
     '"title": "Stream & Text I/O: Readers, Writers, Buffered Streams & Data Parsing",\n    "desc": "Process data streams efficiently and parse real multi-line application log records'),
    # Day 30
    ('"title": "Milestone 6: Full Production-Grade Resilient Microservice Gateway & Java Principal Engineer Certification Capstone",\n    "desc": "Synthesize all 30 days into a unified enterprise financial auditing engine',
     '"title": "Month 1 Capstone: Enterprise Ledger Audit & Financial Transaction Engine",\n    "desc": "Synthesize all 30 days into a unified enterprise financial auditing engine')
]

for old, new in title_patches:
    if old in daydata:
        daydata = daydata.replace(old, new)
        print(f"Patched: {new[:45]}...")
    else:
        print(f"Skipped / already patched: {new[:45]}...")

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(daydata)
print("Updated src/lib/data/java30DayData.ts successfully.")

# 2. Update javaBasicsLongLessons.ts
with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m_day21 = re.search(r'\n  \{\s*["\']?day["\']?:\s*21\s*,', content)
m_day31 = re.search(r'\n  \{\s*["\']?day["\']?:\s*31\s*,', content)

if not m_day21:
    raise Exception("Could not find Day 21 in javaBasicsLongLessons.ts")
if not m_day31:
    raise Exception("Could not find Day 31 in javaBasicsLongLessons.ts")

idx_start = m_day21.start()
idx_end = m_day31.start()

print(f"Replacing from index {idx_start} (Day 21) to {idx_end} (Day 31)")

prefix = content[:idx_start]
suffix = content[idx_end:]

new_days_json = []
for d in ALL_NEW_DAYS:
    s = json.dumps(d, indent=4)
    indented = '\n'.join(('  ' + line if line else line) for line in s.split('\n'))
    new_days_json.append(indented)

new_content = prefix + '\n' + ',\n'.join(new_days_json) + ',\n' + suffix.lstrip('\n')

with open('src/lib/data/javaBasicsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated src/lib/data/javaBasicsLongLessons.ts for Days 21 to 30.")

# 3. Generate visual JSON files
visuals_dir = 'src/lib/data/lessonVisuals/java-basics'
for d in ALL_NEW_DAYS:
    day_num = d['day']
    padded = f"day-{day_num:02d}.json"
    p = os.path.join(visuals_dir, padded)

    entries = []
    for p_idx, part in enumerate(d['parts']):
        code_str = part.get('code', '')
        h = hashlib.sha256(code_str.encode('utf-8')).hexdigest()
        title_short = part['title'][:40]

        spec = {
            "template": "stack-queue",
            "title": f"{title_short} — JVM Execution Flow",
            "mode": "stack",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Allocate stack frame and inspect class contracts for {title_short}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Execution Engine", "Class Invariants"],
                    "action": "push",
                    "actionItem": "Class Invariants",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Execute bytecode instructions and operand stack push for {title_short}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Operand Stack", "Heap Reference"],
                    "action": "push",
                    "actionItem": "Heap Reference",
                    "tones": ["data", "active", "accent"]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Verify bounds, state integrity, and object references...",
                    "mode": "stack",
                    "items": ["main() Frame", "Verified Contract", "Return Register"],
                    "action": "push",
                    "actionItem": "Verified Contract",
                    "tones": ["data", "ok", "ok"]
                },
                {
                    "at": "tryIt",
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

    obj = {
        "schemaVersion": 1,
        "prefix": "java-basics",
        "day": day_num,
        "entries": entries
    }

    with open(p, 'w', encoding='utf-8') as f_out:
        json.dump(obj, f_out, indent=2, ensure_ascii=False)

print("Generated on-disk visuals for Days 21 to 30.")

# 4. Rebuild long-lessons archive
print("Running build-long-lessons-json.cjs...")
subprocess.run(["node", "scripts/utils/build-long-lessons-json.cjs"], check=True)
print("ALL ASSEMBLED AND ARCHIVED SUCCESSFULLY!")
