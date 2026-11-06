with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"title": "Java Streams II: Advanced Collectors, Grouping Pipelines & Parallel Streams",\n    "desc": "Catch and recover from runtime exceptions',
    '"title": "Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery",\n    "desc": "Catch and recover from runtime exceptions'
)

text = text.replace(
    '"title": "Modern Concurrency I: Threads, Memory Visibility (volatile), Atomic Variables & CAS",\n    "desc": "Defensive programming validates method inputs upfront.',
    '"title": "Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies",\n    "desc": "Defensive programming validates method inputs upfront.'
)

text = text.replace(
    '"title": "Modern Concurrency II: Synchronization, Locks & Milestone 5 Concurrent Banking Engine",\n    "desc": "ArrayList provides dynamic resizable collections',
    '"title": "Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals",\n    "desc": "ArrayList provides dynamic resizable collections'
)

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patched Days 23, 24, 25 titles in java30DayData.ts successfully.")
