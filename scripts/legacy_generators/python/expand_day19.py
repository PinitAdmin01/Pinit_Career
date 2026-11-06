import sys
import json
sys.path.insert(0, 'scripts')
from block4_day19 import DAY_19

p1_add = """ At the JVM architecture level, when a class is loaded, the ClassLoader resolves its superclass chain recursively up to java.lang.Object before completing the linking phase. The Bytecode Verifier inspects the class structure to prevent Circular Inheritance hierarchies (e.g. class A extends B, while B extends A), which would trigger an immediate fatal java.lang.ClassCircularityError. Furthermore, software architects can deliberately terminate an inheritance hierarchy using the 'final' keyword on class declarations: 'public final class SystemSecurityManager { ... }'. When a class is declared 'final', the Java compiler strictly prohibits any other class from extending it. In the Java Standard Library, core security-critical classes\u2014such as java.lang.String, java.lang.Integer, and java.lang.Math\u2014are marked 'final' to prevent malicious or accidental subclassing that could compromise string immutability, bypass security sandbox managers, or inject fraudulent cryptographic logic into runtime environments."""

p2_add = """ In the HotSpot JVM memory layout engine, the arrangement of inherited fields is governed by the Superclass-First Invariant. During object allocation on the heap, instance variables belonging to java.lang.Object (if any) are laid out first, followed by the instance fields declared in the direct superclass (e.g. Employee's 8-byte 'salary' double), followed by fields declared in the subclass (e.g. Manager's 8-byte 'bonus' double). This contiguous linear layout allows superclass method bytecodes to read and write their fields at compile-time fixed memory offsets, regardless of whether the object is an instance of Employee or Manager! This memory architecture also explains why Field Shadowing (declaring a field in a subclass with the same name as a superclass field) is so treacherous: if Manager declared 'double salary', both fields would physically exist on the heap at separate memory offsets! Accessing 'mgr.salary' would read the subclass offset, while casting '((Employee) mgr).salary' would read the superclass offset, creating bewildering dual-state bugs."""

p3_add = """ At the compiled bytecode level, an explicit 'super(...)' constructor call emits the 'invokespecial' instruction with an exact symbolic reference to the superclass '<init>' method. Because constructor calls are non-virtual, they are bound statically at compile time rather than resolved dynamically through a V-Table. However, this initialization protocol exposes one of the most notorious traps in Java systems engineering: Calling Overridable Methods from Constructors! If a superclass constructor invokes an instance method that happens to be overridden by a subclass (e.g. Employee's constructor calls 'calculateBonus()', which Manager overrides), the JVM's dynamic dispatch will execute the Subclass's overridden method BEFORE the subclass constructor body has executed! Consequently, the subclass method runs against uninitialized subclass instance fields (where numbers are 0 and object references are null), leading to catastrophic NullPointerExceptions or corrupted calculations. For this reason, Effective Java strictly mandates: Constructors must never invoke overridable methods!"""

p4_add = """ In modern systems engineering, the Liskov Substitution Principle (LSP) is formalized through four strict subtyping rules:
1. Contravariance of Arguments: Method parameters in an overridden method must match the superclass types exactly in Java (enforced via compile-time signature equality).
2. Covariance of Return Types: Since Java 5, an overridden method in a subclass is legally permitted to return a more specialized subtype than the superclass method (e.g., if Employee declares 'Employee getSelf()', Manager can override it declaring 'Manager getSelf()', sparing callers from ugly typecasts).
3. Exception Rule (No Broader Checked Exceptions): An overridden method in a subclass cannot declare new or broader checked exceptions than those declared by the superclass method, ensuring that callers catching parent exceptions are never blind-sided by unhandled child errors.
4. Invariant Rule: The subclass must preserve all mathematical and business invariants of the superclass. If Employee requires non-negative salaries, Manager cannot permit negative compensation. Adhering to these four LSP invariants guarantees that polymorphic client code remains stable and bug-free."""

p5_add = """ In our automated test harness implemented within the main method, we execute exhaustive verification suites testing every dimension of inheritance integrity:
- Test 1 (Solution Contract Verification): Asserts that 'Solution.getPay()' executes cleanly and returns certified compensation of exactly 60000.0.
- Test 2 (Direct Subclass Verification): Instantiates a Manager instance, validating that 'salary' is inherited cleanly with initial value 50000.0, 'bonus' is initialized to 10000.0, and 'getTotalPay()' evaluates to 60000.0 without precision loss.
- Test 3 (Base Entity Isolation): Instantiates a standalone Employee instance, asserting that its base salary remains 50000.0 and that Manager's existence has zero collateral impact on Employee.
- Test 4 (Assignment Contract Verification): Asserts that 'Solution.getWheels()' evaluates to 2 for a newly constructed Bike.
- Test 5 (Vehicle Invariant Isolation): Instantiates a standalone Vehicle instance, asserting that parent vehicles retain their baseline 4 wheels.
This end-to-end verification harness certifies complete student mastery over Java inheritance, constructor chaining, and subclass specialization."""

DAY_19['parts'][0]['content'] += p1_add
DAY_19['parts'][1]['content'] += p2_add
DAY_19['parts'][2]['content'] += p3_add
DAY_19['parts'][3]['content'] += p4_add
DAY_19['parts'][4]['content'] += p5_add

with open('scripts/block4_day19.py', 'w', encoding='utf-8') as f:
    f.write("# Day 19: Inheritance, Subclassing, Constructor Chaining & Code Reusability\n\nDAY_19 = ")
    json.dump(DAY_19, f, indent=4)
    f.write("\n")

print("Expanded Day 19 completely!")
