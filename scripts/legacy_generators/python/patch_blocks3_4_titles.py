with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    # Day 11
    ('"title": "Classes, Objects, Fields, Constructors & JVM Heap Object Allocation",\n    "desc": "Method overloading defines multiple methods',
     '"title": "Method Overloading, Parameter Signatures & Compile-Time Resolution",\n    "desc": "Method overloading defines multiple methods'),
    ('"title": "Classes, Objects, Fields, Constructors & JVM Heap Object Allocation",',
     '"title": "Method Overloading, Parameter Signatures & Compile-Time Resolution",'),
     
    # Day 12
    ('"title": "Encapsulation, Access Modifiers, Defensive Copying & Immutability Patterns",\n    "desc": "An array is a fixed-size container',
     '"title": "Single-Dimensional Arrays, Heap Memory Layout & Maximum Element Search",\n    "desc": "An array is a fixed-size container'),
    ('"title": "Encapsulation, Access Modifiers, Defensive Copying & Immutability Patterns",',
     '"title": "Single-Dimensional Arrays, Heap Memory Layout & Maximum Element Search",'),

    # Day 13
    ('"title": "Inheritance, Subclassing, Constructor Chaining & Liskov Substitution Principle",\n    "desc": "Traverse array elements using for-each',
     '"title": "Array Traversal, Enhanced For-Each & Accumulator Algorithms",\n    "desc": "Traverse array elements using for-each'),
    ('"title": "Inheritance, Subclassing, Constructor Chaining & Liskov Substitution Principle",',
     '"title": "Array Traversal, Enhanced For-Each & Accumulator Algorithms",'),

    # Day 14
    ('"title": "Polymorphism, Dynamic Method Dispatch, V-Tables & Upcasting Mechanics",\n    "desc": "A 2D array is an array of arrays',
     '"title": "Multi-Dimensional Arrays, Matrices & Diagonal Summation",\n    "desc": "A 2D array is an array of arrays'),
    ('"title": "Polymorphism, Dynamic Method Dispatch, V-Tables & Upcasting Mechanics",',
     '"title": "Multi-Dimensional Arrays, Matrices & Diagonal Summation",'),

    # Day 15
    ('"title": "Abstract Classes, Interfaces, Default Methods & \u2b50 MILESTONE 3: Fast Data Ledger",',
     '"title": "Searching Algorithms: Linear Search vs Binary Search & \u2b50 MILESTONE 3: Fast Data Ledger",'),

    # Day 16
    ('"title": "Exception Handling: Checked vs Unchecked Exceptions, try-with-resources & Resilient Systems",',
     '"title": "Classes, Objects, Instance Fields & JVM Heap Memory Allocation",'),

    # Day 17
    ('"title": "Strings Deep Dive: String Pool, Immutability, Compact Strings & Text Processing",',
     '"title": "Constructors, Parameter Shadowing & The this Reference",'),
    ('"aTitle": "Day 17 Assignment: Book Constructor (Strings Deep Dive)"',
     '"aTitle": "Day 17 Assignment: Book Constructor"'),

    # Day 18
    ('"title": "Generics Deep Dive: Type Safety, Bounded Wildcards (PECS) & Type Erasure",',
     '"title": "Encapsulation, Access Modifiers, Defensive Setters & Invariant Protection",'),

    # Day 19
    ('"title": "Collections Framework I: Lists, Dynamic Array Resizing, Linked Nodes & Iterators",',
     '"title": "Inheritance, Subclassing, Constructor Chaining & Code Reusability",'),

    # Day 20
    ('"title": "Collections Framework II: Sets, Maps, Red-Black Trees & Milestone 4 LRU Cache",',
     '"title": "Polymorphism, Dynamic Method Dispatch & Method Overriding",'),
    ('"eTitle": "Day 20 Challenge: Polymorphic Payment Fees (Collections Framework II)"',
     '"eTitle": "Day 20 Challenge: Polymorphic Payment Fees"'),
    ('"aTitle": "Day 20 Assignment: Animal Sounds Polymorphism (Collections Framework II)"',
     '"aTitle": "Day 20 Assignment: Animal Sounds Polymorphism"')
]

for old, new in replacements:
    if old in text:
        text = text.replace(old, new)
        print(f"Patched: {new[:50]}")
    else:
        print(f"Skipped / not found: {old[:50]}")

with open('src/lib/data/java30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Titles patched for Days 11 to 20 in java30DayData.ts.")
