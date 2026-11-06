import sys
import json
sys.path.insert(0, 'scripts')
from block4_day18 import DAY_18

p3_extra = """ Another crucial dimension of accessor design is Defensive Copying in Getters. If an encapsulated class holds a reference to a mutable object\u2014such as a primitive array 'int[] transactionHistory' or a Date object\u2014a naive getter that returns the raw pointer ('public int[] getHistory() { return this.transactionHistory; }') completely shatters encapsulation! The calling code receives a direct memory address pointing to the internal heap buffer and can freely modify array elements from the outside (e.g., 'acc.getHistory()[0] = 999999;'). To preserve invariant integrity, defensive accessors must return either a deep clone of the array ('return this.transactionHistory.clone();') or wrap mutable collections in unmodifiable views (such as 'Collections.unmodifiableList(list)'), ensuring that external callers can inspect data without ever possessing the capability to mutate internal state."""

p4_extra = """ Furthermore, encapsulating state mutation within centralized methods provides the essential prerequisite for Thread Safety in concurrent multi-threaded applications. When multiple threads concurrently attempt to modify an account balance, encapsulating the operation inside 'deposit' allows engineers to apply synchronization locks ('synchronized public void deposit(...)'), atomic operations ('AtomicInteger balance'), or reentrant read-write locks without altering external method calls. In upcoming modules on Java concurrency, we will discover how this encapsulation barrier protects enterprise banking systems from race conditions and dirty reads."""

p5_extra = """ In addition, the test harness verifies that encapsulation preserves domain invariants across complex, multi-step transaction histories: simulating real-world student grading cycles where students attempt to register extra credit beyond the 4.0 ceiling, confirming that the defensive setter preserves the prior valid GPA without throwing unhandled exceptions or destabilizing memory. This end-to-end verification confirms that your domain models satisfy the highest standards of enterprise software engineering."""

DAY_18['parts'][2]['content'] += p3_extra
DAY_18['parts'][3]['content'] += p4_extra
DAY_18['parts'][4]['content'] += p5_extra

with open('scripts/block4_day18.py', 'w', encoding='utf-8') as f:
    f.write("# Day 18: Encapsulation, Access Modifiers, Defensive Setters & Invariant Protection\n\nDAY_18 = ")
    json.dump(DAY_18, f, indent=4)
    f.write("\n")

print("Day 18 expanded step 2!")
