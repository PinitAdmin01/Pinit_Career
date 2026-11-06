with open('scripts/assemble_block5.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace Day 23
c = c.replace(
    '"title": "Java Streams II: Advanced Collectors, Grouping Pipelines & Parallel Streams",\n    "desc": "Exceptions represent runtime anomalies.',
    '"title": "Java Streams II: Advanced Collectors, Grouping Pipelines & Parallel Streams",\n    "desc": "Catch and recover from runtime exceptions'
)

# Replace Day 24
c = c.replace(
    '"title": "Modern Concurrency I: Threads, Memory Visibility (volatile), Atomic Variables & CAS",\n    "desc": "Defensively validate method arguments using throw',
    '"title": "Modern Concurrency I: Threads, Memory Visibility (volatile), Atomic Variables & CAS",\n    "desc": "Defensive programming validates method inputs upfront.'
)

# Replace Day 25
c = c.replace(
    '"title": "Modern Concurrency II: Synchronization, Locks & Milestone 5 Concurrent Banking Engine",\n    "desc": "ArrayList is a dynamic resizable array in Java.',
    '"title": "Modern Concurrency II: Synchronization, Locks & Milestone 5 Concurrent Banking Engine",\n    "desc": "ArrayList provides dynamic resizable collections in Java.'
)

with open('scripts/assemble_block5.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated assemble_block5.py replacement targets")
