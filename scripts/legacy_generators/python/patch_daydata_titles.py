with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"title": "Java Streams II: Advanced Collectors, Grouping Pipelines & Parallel Streams"',
    '"title": "Exception Handling I: Throwable Hierarchy, Try-Catch-Finally & Defensive Recovery"'
)

text = text.replace(
    '"title": "Modern Concurrency I: Threads, Memory Visibility (volatile), Atomic Variables & CAS"',
    '"title": "Exception Handling II: The throw Statement, Defensive Validation & Custom Exception Hierarchies"'
)

text = text.replace(
    '"title": "Modern Concurrency II: Synchronization, Locks & Milestone 5 Concurrent Banking Engine"',
    '"title": "Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals"'
)

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Directly patched titles for Days 23, 24, and 25 in java30DayData.ts")
