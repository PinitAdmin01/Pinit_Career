with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    ('"title": "JVM Architecture, Stack vs Heap Memory & Object-Oriented Invariants",',
     '"title": "Java Platform Architecture & First Program: Hello World, Classes and System.out",'),
    ('"title": "Java Memory Model, Collections Architecture & Spring Concurrency Pipelines",',
     '"title": "Variables, Primitive Types & Interactive Input: The Scanner Console Engine",'),
    ('"eTitle": "Day 2 Challenge: Fix the Broken Input Reader (Java Memory Model, Collections Architecture & Spring Concurrency Pipelines)",',
     '"eTitle": "Day 2 Challenge: Fix the Broken Input Reader",'),
    ('"title": "Generics, Reflection & Modern Java 21 Sealed Class Patterns",',
     '"title": "Operators, Mathematical Expressions & String Concatenation",'),
    ('"eTitle": "Day 3 Challenge: Declare Variables & Calculate Total (Generics, Reflection & Modern Java 21 Sealed Class Patterns)",',
     '"eTitle": "Day 3 Challenge: Declare Variables & Calculate Total",'),
    ('"title": "Reactive WebFlux, Netty EventLoop, Backpressure Strategies & R2DBC",',
     '"title": "Arithmetic Algorithms, Modulo Arithmetic & Computational Logic",'),
    ('"aTitle": "Day 4 Assignment: Modulo Checker (Reactive WebFlux, Netty EventLoop, Backpressure Strategies & R2DBC)",',
     '"aTitle": "Day 4 Assignment: Modulo Checker",'),
    ('"title": "Java 21 Enterprise Systems: Project Panama (FFM API), Project Loom Virtual Threads, Structured Concurrency & Generational ZGC",',
     '"title": "Conditional Logic, Boolean Expressions & Branching Decision Engines (if / else)",'),
    ('"eTitle": "Day 5 Milestone 1: Decision Console (Java 21 Enterprise Systems)",',
     '"eTitle": "Day 5 Milestone 1: Decision Console",')
]

for old, new in replacements:
    if old in text:
        text = text.replace(old, new)
        print(f"Patched: {new[:50]}")
    else:
        print(f"Not found: {old[:50]}")

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Block 1 titles patched successfully in java30DayData.ts.")
