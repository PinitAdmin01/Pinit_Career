import re

with open('scripts/block4_day16.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Paragraph additions to parts 1, 3, 4, 5

p1_extra = """ At the architecture level, the JVM ClassLoader subsystem enforces the hierarchical Delegation Model (Bootstrap ClassLoader, Platform/Extension ClassLoader, and Application/System ClassLoader). When a class is requested, loaders delegate upward to parents before attempting to locate bytecodes locally, preventing malicious or accidental shadowing of core java.lang runtime classes. Furthermore, the migration from Java 7's legacy PermGen to Java 8+ Metaspace permanently solved notorious 'java.lang.OutOfMemoryError: PermGen space' crashes: by housing class metadata in native process virtual memory, Metaspace dynamically expands up to system RAM limits or administrative bounds (-XX:MaxMetaspaceSize), undergoing metadata garbage collection only when all instances and the defining ClassLoader itself become completely unreachable."""

p3_extra = """ At the CPU assembly level on x86-64 and ARM64 architectures, HotSpot C2 compiles the 'new' allocation into an ultra-fast inline instruction sequence. Under the fast-path TLAB bump-the-pointer mechanism, the thread reads its current TLAB allocation pointer from register r15, increments it by the object's byte size, and compares it against the TLAB end-boundary register. If within bounds, it stores the new pointer with zero lock synchronization, and zeroes the memory using 256-bit SIMD AVX vector registers (such as 'vpxor' and 'vmovdqu') in just three CPU clock cycles! If the TLAB is exhausted, execution falls back to a runtime stub that atomically claims a new TLAB buffer from the Eden generation via atomic Compare-And-Swap (CAS) instructions."""

p4_extra = """ To optimize instance method invocation performance, the HotSpot execution engine employs Virtual Method Tables (V-Tables) coupled with Inline Caching (IC). When a class is linked in Metaspace, the JVM generates a V-Table containing function entry pointers for all inherited and overridden instance methods. When 'invokevirtual' executes, the CPU reads the object's Klass Word from offset 8 in the object header, indexes into the V-Table at a fixed integer offset computed during compilation, and executes an indirect call. To eliminate even the microscopic cost of indirect calls, the C2 compiler utilizes Inline Caching: it tracks call site polymorphism, classifying calls as Monomorphic (1 target class), Bimorphic (2 target classes), or Megamorphic (3+ targets). At monomorphic sites, C2 inlines the method body directly into the caller, achieving zero function-call overhead!"""

p5_extra = """ From an enterprise software architecture perspective, domain entities like BankAccount embody the core principles of Domain-Driven Design (DDD): ensuring that entities always exist in valid states and that state transitions are strictly governed through domain events and validated mutation methods. In financial ledger systems, allowing unvalidated field updates can lead to devastating discrepancies where debit transactions fail to match credit journals, violating standard double-entry bookkeeping laws. By encapsulating balance adjustments inside 'deposit' and accompanying methods with explicit assertion contracts, engineers guarantee that only positive increments are admitted to the ledger. This architecture also forms the bedrock for thread safety: in upcoming blocks, we will see how encapsulating fields enables synchronized state locking, atomic CAS updates, and thread-safe concurrent banking engines."""

# Let's insert these paragraphs into the respective parts in block4_day16.py
# Part 1 content ends before ",\\n            \"code\":"
import sys
sys.path.insert(0, 'scripts')
from block4_day16 import DAY_16

DAY_16['parts'][0]['content'] += p1_extra
DAY_16['parts'][2]['content'] += p3_extra
DAY_16['parts'][3]['content'] += p4_extra
DAY_16['parts'][4]['content'] += p5_extra

import json

# Output updated DAY_16 to block4_day16.py
with open('scripts/block4_day16.py', 'w', encoding='utf-8') as f:
    f.write("# Day 16: Classes, Objects, Instance Fields & JVM Heap Memory Allocation\n\nDAY_16 = ")
    json.dump(DAY_16, f, indent=4)
    f.write("\n")

print("Expanded Day 16 successfully!")
