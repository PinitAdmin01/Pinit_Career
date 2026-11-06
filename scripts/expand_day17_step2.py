import sys
import json
sys.path.insert(0, 'scripts')
from block4_day17 import DAY_17

p1_more = """ Additionally, constructors can be decorated with standard Java access modifiers to enforce strict architectural constraints: a 'public' constructor permits universal instantiation across all packages; a package-private (default) constructor restricts instantiation to classes within the same package, facilitating package-level encapsulation; and a 'private' constructor strictly prevents external instantiation altogether. Private constructors are heavily utilized in enterprise utility classes (such as java.lang.Math and java.util.Collections) to prevent pointless object allocation, as well as in the Singleton design pattern and static factory methods (e.g., 'User.of(...)') where instance creation must be strictly controlled through a centralized gatekeeper."""

p2_more = """ This architectural pattern embodies the Fail-Fast Principle of modern systems engineering. When an invalid parameter is detected at the boundary of a constructor, failing immediately with an explicit IllegalArgumentException prevents corrupt data from contaminating downstream database tables, analytics data lakes, or external API partners. If a system permitted an invalid User object with an age of -5 or a null name to be created, that defect might remain undetected until days later during a payroll calculation or credit card settlement, creating an arduous, time-consuming debugging ordeal. Invariant enforcement in constructors turns runtime errors into immediate, localized, and deterministic assertions."""

p5_more = """ In our automated verification harness implemented in the main method, we execute deterministic checks validating every contract requirement: Test 1 asserts that 'Solution.createUser(\"Vinay\", 22)' accurately instantiates a User with 'u1.name.equals(\"Vinay\")' and 'u1.age == 22'; Test 2 instantiates a second distinct user 'Alice' with age 30, proving that field state across distinct objects remains strictly partitioned; and Test 3 instantiates a Book entity with 'title=\"Java\"' and 'price=29.99', validating that 'Solution.getTitle()' cleanly accesses the title field. All tests employ strict assertion verification, guaranteeing zero regressions across test runs."""

DAY_17['parts'][0]['content'] += p1_more
DAY_17['parts'][1]['content'] += p2_more
DAY_17['parts'][4]['content'] += p5_more

with open('scripts/block4_day17.py', 'w', encoding='utf-8') as f:
    f.write("# Day 17: Constructors, Parameter Shadowing & The this Reference\n\nDAY_17 = ")
    json.dump(DAY_17, f, indent=4)
    f.write("\n")

print("Day 17 expanded completely!")
