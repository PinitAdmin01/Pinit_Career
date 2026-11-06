import sys
import json
sys.path.insert(0, 'scripts')
from block4_day19 import DAY_19

p1_extra = """ In modern Java (Java 17 through Java 21+ LTS), the inheritance paradigm has been further augmented by the introduction of Sealed Classes and Interfaces. By declaring 'public abstract sealed class Employee permits Manager, Engineer, Executive { ... }', enterprise architects can strictly define the exact, exhaustive list of permitted subclasses. Any unauthorized external class attempting to extend Employee is rejected at compile time. Sealed classes bridge the gap between traditional open inheritance and exhaustive domain modeling, enabling the Java compiler and pattern-matching switch expressions to guarantee complete exhaustiveness checking without requiring fragile fallback default clauses."""

p2_extra = """ When writing subclass methods, developers can use the explicit 'super.' prefix (e.g. 'super.salary') to explicitly document that a field is inherited from a parent entity, though omitting it ('salary') behaves identically when no field shadowing exists. In the HotSpot execution engine, accessing inherited fields incurs zero performance penalty compared to accessing subclass fields because the memory offset relative to the object's base address is fixed and known at compile time, compiling down to a single base-plus-offset MOV instruction in native CPU assembly."""

p3_extra = """ At the bytecode level, an explicit or implicit super constructor invocation generates the three-instruction sequence: 'aload_0' (push the current 'this' pointer onto the operand stack), followed by 'invokespecial' referencing the parent class constructor method, followed by 'return' upon completion. Because constructor execution occurs during early object initialization, modern Java compilers enforce that no local instance state is accessed before this base initialization succeeds, preserving JVM memory invariants."""

p4_extra = """ One of the most famous historical examples of inheritance misuse resides in Java's own legacy standard library: java.util.Stack extending java.util.Vector. Because Stack extends Vector via inheritance rather than using composition, Stack inherited all of Vector's arbitrary-index manipulation methods\u2014such as 'insertElementAt(0, item)' and 'removeElementAt(5)'. Consequently, client code can insert or delete elements from the middle or bottom of a Stack, completely violating the fundamental Last-In-First-Out (LIFO) stack invariant! Had the Java designers employed Composition (a Stack 'has-a' Vector internally), the Stack class could have exposed only push, pop, and peek, preserving pure stack invariants. This legendary cautionary tale reminds every systems architect: always verify the genuine 'is-a' relationship before extending a superclass."""

p5_extra = """ Furthermore, when interacting with polymorphic inheritance hierarchies in modern Java (Java 16+), developers leverage Pattern Matching for instanceof. Instead of writing verbose, error-prone two-step type testing and casting ('if (emp instanceof Manager) { Manager m = (Manager) emp; m.getTotalPay(); }'), modern Java allows concise pattern binding: 'if (emp instanceof Manager m) { double total = m.getTotalPay(); }'. The compiler automatically performs the safe type assertion and binds the cast variable 'm' within the scope of the conditional block, eliminating boilerplate class-cast exceptions while reinforcing clean type hierarchy inspection."""

DAY_19['parts'][0]['content'] += p1_extra
DAY_19['parts'][1]['content'] += p2_extra
DAY_19['parts'][2]['content'] += p3_extra
DAY_19['parts'][3]['content'] += p4_extra
DAY_19['parts'][4]['content'] += p5_extra

with open('scripts/block4_day19.py', 'w', encoding='utf-8') as f:
    f.write("# Day 19: Inheritance, Subclassing, Constructor Chaining & Code Reusability\n\nDAY_19 = ")
    json.dump(DAY_19, f, indent=4)
    f.write("\n")

print("Day 19 expanded completely step 2!")
