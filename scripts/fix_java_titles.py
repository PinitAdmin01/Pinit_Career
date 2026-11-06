with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    ('"JVM Architecture, Stack vs Heap Memory & Object-Oriented Invariants"', '"Java Platform Architecture & First Program: Hello World, Classes and System.out"'),
    ('"Java Memory Model, Collections Architecture & Spring Concurrency Pipelines"', '"Variables, Primitive Types & Interactive Input: The Scanner Console Engine"'),
    ('"Generics, Reflection & Modern Java 21 Sealed Class Patterns"', '"Operators, Mathematical Expressions & String Concatenation"'),
    ('"Reactive WebFlux, Netty EventLoop, Backpressure Strategies & R2DBC"', '"Arithmetic Algorithms, Modulo Arithmetic & Computational Logic"'),
    ('"Java 21 Enterprise Systems: Project Panama (FFM API), Project Loom Virtual Threads, Structured Concurrency & Generational ZGC"', '"Conditional Logic, Boolean Expressions & Branching Decision Engines (if / else)"')
]

for old, new in replacements:
    if old in text:
        text = text.replace(old, new)
        print(f"Replaced: {old[:30]}... -> {new[:30]}...")
    else:
        print(f"Warning: Old title not found: {old}")

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Finished updating src/lib/data/java30DayData.ts")
