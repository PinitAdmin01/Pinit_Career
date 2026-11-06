import sys
sys.path.insert(0, 'scripts')
import pprint

from block5_day25 import DAY_25

d25_codes = [
    """import java.util.ArrayList;
import java.util.List;

public class CollectionsHierarchyLab {
    public static void main(String[] args) {
        System.out.println("=== COLLECTIONS FRAMEWORK: LIST CONTRACT ===");

        // Programming to an Interface: List reference pointing to ArrayList instance
        List<Integer> numbers = new ArrayList<>();

        // Autoboxing: primitive int is automatically wrapped in Integer.valueOf()
        numbers.add(100); // index 0
        numbers.add(200); // index 1
        numbers.add(100); // duplicate allowed in List!

        System.out.println("List contents: " + numbers);
        System.out.println("Size: " + numbers.size());
        System.out.println("Element at index 1: " + numbers.get(1)); // 200

        // Type safety: Generics prevent invalid types at compile time
        // numbers.add("InvalidString"); // Compile-time error!
    }
}""",
    """import java.util.ArrayList;

public class ArrayListResizingLab {
    public static void main(String[] args) {
        System.out.println("=== ARRAYLIST RESIZING DEMONSTRATION ===");

        // Pre-sizing optimization: Allocates exact capacity, avoiding reallocations
        int expectedItems = 15;
        ArrayList<String> list = new ArrayList<>(expectedItems);

        // Demonstrating dynamic growth formula: oldCapacity + (oldCapacity >> 1)
        int initialCap = 10;
        int nextCap = initialCap + (initialCap >> 1); // 10 + 5 = 15
        int thirdCap = nextCap + (nextCap >> 1);     // 15 + 7 = 22

        System.out.println("Growth sequence: 10 -> " + nextCap + " -> " + thirdCap);

        for (int i = 1; i <= 12; i++) {
            list.add("Item-" + i);
        }
        System.out.println("Added 12 items. Size: " + list.size());
    }
}""",
    """import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ComplexityAndRemovalLab {
    public static void main(String[] args) {
        List<Integer> scores = new ArrayList<>(List.of(85, 42, 95, 60, 72));
        System.out.println("Initial scores: " + scores);

        // O(1) Positional Random Access: Direct memory address calculation
        int topScore = scores.get(2); // 95
        System.out.println("O(1) access at index 2: " + topScore);

        // Safe removal using removeIf (Java 8+ single-pass two-pointer algorithm)
        scores.removeIf(score -> score < 70);
        System.out.println("After removeIf (< 70): " + scores); // [85, 95, 72]

        // Demonstrating iterator safe removal:
        List<String> names = new ArrayList<>(List.of("Alice", "Bob", "Charlie"));
        Iterator<String> it = names.iterator();
        while (it.hasNext()) {
            if (it.next().equals("Bob")) {
                it.remove(); // Safe: updates expectedModCount!
            }
        }
        System.out.println("After iterator removal: " + names); // [Alice, Charlie]
    }
}""",
    """import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ThreadSafetyAndImmutableLab {
    public static void main(String[] args) {
        // Modern truly immutable list (Java 9+ List.of): compact, zero array overhead for <= 2 items
        List<String> immutableList = List.of("USD", "EUR", "GBP");
        System.out.println("Immutable List: " + immutableList);
        try {
            immutableList.add("JPY"); // Throws UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("Verified: List.of is strictly immutable and cannot be modified!");
        }

        // Thread-safe copy-on-write list for read-heavy environments:
        List<String> cowList = new CopyOnWriteArrayList<>();
        cowList.add("ServiceA");
        cowList.add("ServiceB");
        System.out.println("CopyOnWriteArrayList: " + cowList);
    }
}""",
    """import java.util.ArrayList;

public class SolutionLab {
    public static class Solution {
        public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {
            ArrayList<Integer> result = new ArrayList<>();
            if (scores == null) return result;
            for (int score : scores) {
                if (score > cutoff) {
                    result.add(score); // Autoboxed int -> Integer
                }
            }
            return result;
        }
    }

    public static class SolutionAdv {
        public static ArrayList<String> createList(String a, String b) {
            ArrayList<String> list = new ArrayList<>();
            list.add(a);
            list.add(b);
            return list;
        }
    }

    public static void main(String[] args) {
        int[] scores = {85, 42, 95, 60, 72};
        ArrayList<Integer> filtered = Solution.filterAbove(scores, 70);
        System.out.println("filterAbove result: " + filtered); // [85, 95, 72]

        ArrayList<String> created = SolutionAdv.createList("Java", "Spring");
        System.out.println("createList result:  " + created);  // [Java, Spring]
        System.out.println("created.get(0): " + created.get(0));
        System.out.println("created.get(1): " + created.get(1));
    }
}"""
]

d25_checks = [
    [
        {
            "question": "Which interface sits at the root of the Java Collections Framework hierarchy, enabling enhanced for-each loop iteration?",
            "options": [
                "java.lang.Iterable",
                "java.util.Map",
                "java.lang.Cloneable",
                "java.io.Serializable"
            ],
            "answer": 0,
            "explanation": "Iterable<E> defines iterator() and sits at the top of the collection hierarchy, enabling enhanced for-loop syntax."
        },
        {
            "question": "What is the primary behavioral characteristic that distinguishes a List from a Set in the Collections Framework?",
            "options": [
                "A List maintains an ordered sequence with positional indexing and allows duplicates; a Set enforces uniqueness with no duplicates",
                "A List can only store integers; a Set can store any object",
                "A List cannot be iterated with a loop; a Set can",
                "A List is always synchronized; a Set is always unsynchronized"
            ],
            "answer": 0,
            "explanation": "Lists preserve insertion order and permit duplicate elements accessible by index; Sets enforce element uniqueness."
        },
        {
            "question": "Why does ArrayList<Integer> require autoboxing when adding primitive ints?",
            "options": [
                "Because Java generic collections can only store heap object references, requiring primitive ints to be wrapped in java.lang.Integer",
                "Because primitive ints are not supported on 64-bit operating systems",
                "Because the compiler deletes primitive variables at runtime",
                "Because ArrayList is written in JavaScript under the hood"
            ],
            "answer": 0,
            "explanation": "Java generics are erased to Object references on the heap, requiring primitives to be autoboxed into their wrapper types."
        },
        {
            "question": "Why does java.util.Map not inherit from java.util.Collection?",
            "options": [
                "Because a Map models key-value pair associations rather than a collection of individual elements",
                "Because Map was deprecated in Java 5",
                "Because Map only works with database tables",
                "Because Map cannot be garbage collected"
            ],
            "answer": 0,
            "explanation": "Map models key-value associations and provides three distinct collection views (keySet, values, entrySet) rather than extending Collection."
        }
    ],
    [
        {
            "question": "By what factor does the backing array of an ArrayList grow when its capacity is exhausted during an add operation?",
            "options": [
                "Approximately 1.5x (oldCapacity + (oldCapacity >> 1))",
                "Exactly 10x the original size",
                "It doubles by 2.0x on every single element added",
                "It never grows; attempting to exceed capacity throws an error"
            ],
            "answer": 0,
            "explanation": "ArrayList expands its backing array using the formula 'oldCapacity + (oldCapacity >> 1)', growing capacity by 50% (1.5x)."
        },
        {
            "question": "What native method does ArrayList use to transfer elements to a newly allocated backing array during resize?",
            "options": [
                "System.arraycopy()",
                "Thread.sleep()",
                "Object.clone()",
                "Runtime.gc()"
            ],
            "answer": 0,
            "explanation": "System.arraycopy() is a high-speed native memory transfer routine implemented in C++ inside the JVM."
        },
        {
            "question": "What is the difference between an ArrayList's 'size' and its 'capacity'?",
            "options": [
                "Size is the count of active elements currently in the list; capacity is the allocated physical length of the backing Object[] array",
                "Size is measured in gigabytes; capacity is measured in megabytes",
                "Size and capacity are identical synonyms with no distinction",
                "Capacity is always smaller than size"
            ],
            "answer": 0,
            "explanation": "Size is the number of elements added (list.size()); capacity is the physical length of elementData on the heap."
        },
        {
            "question": "Why should high-throughput applications pre-size ArrayLists using 'new ArrayList<>(expectedSize)'?",
            "options": [
                "To allocate the exact backing array upfront, eliminating costly resizing reallocations and GC pressure",
                "To make the ArrayList thread-safe",
                "To prevent any elements from ever being removed",
                "Because the default constructor is deprecated in modern Java"
            ],
            "answer": 0,
            "explanation": "Pre-sizing allocates memory in a single heap request, eliminating intermediate array copy operations when populating large lists."
        }
    ],
    [
        {
            "question": "What is the time complexity of retrieving an element by index using list.get(index) in an ArrayList?",
            "options": [
                "O(1) Constant time due to direct contiguous array memory address computation",
                "O(N) Linear time because the JVM must traverse pointers from head to index",
                "O(log N) Logarithmic time using binary search",
                "O(N^2) Quadratic time due to garbage collection scanning"
            ],
            "answer": 0,
            "explanation": "Array indexing calculates memory address via pointer offset (baseAddress + index * refSize) in a single CPU cycle."
        },
        {
            "question": "What is the worst-case time complexity of inserting an element at the beginning (index 0) of an ArrayList?",
            "options": [
                "O(N) Linear time because all existing N elements must be shifted one position to the right",
                "O(1) Constant time",
                "O(log N) Logarithmic time",
                "O(N!) Factorial time"
            ],
            "answer": 0,
            "explanation": "Inserting at index 0 requires shifting every existing element to the right via System.arraycopy, making it O(N)."
        },
        {
            "question": "Why does modifying an ArrayList directly inside an enhanced for-each loop trigger ConcurrentModificationException?",
            "options": [
                "Because modifying the list alters modCount, causing a mismatch with the iterator's expectedModCount on the next iteration",
                "Because the JVM disables memory writes while a loop is running",
                "Because ArrayList can only be modified by the Garbage Collector",
                "Because for-each loops run in read-only mode at the CPU hardware level"
            ],
            "answer": 0,
            "explanation": "Structural mutations change modCount; the iterator detects modCount != expectedModCount and immediately fails fast."
        },
        {
            "question": "What is the recommended modern approach (Java 8+) to safely remove elements matching a predicate from an ArrayList?",
            "options": [
                "list.removeIf(predicate)",
                "Using a standard for-loop and ignoring exceptions",
                "Deleting the ArrayList and re-creating it",
                "Writing a recursive function with Thread.sleep"
            ],
            "answer": 0,
            "explanation": "list.removeIf() performs an efficient single-pass in-place compaction algorithm without ConcurrentModificationException risk."
        }
    ],
    [
        {
            "question": "Why is java.util.ArrayList unsafe to modify concurrently from multiple threads without synchronization?",
            "options": [
                "It lacks internal synchronization, leading to race conditions, lost updates, and corrupted size/indices",
                "The JVM terminates the operating system whenever two threads access the same class",
                "It automatically converts all strings into raw binary integers",
                "It is restricted by Java security policies to run only on single-core CPUs"
            ],
            "answer": 0,
            "explanation": "ArrayList has no internal synchronization locks; concurrent updates cause data races and corrupted internal arrays."
        },
        {
            "question": "What is a major advantage of List.of() (Java 9+) over Collections.unmodifiableList(new ArrayList<>())?",
            "options": [
                "List.of returns a truly immutable, compact object that allocates zero spare array capacity and rejects nulls",
                "List.of runs on the graphics card GPU",
                "List.of allows modifying elements without changing the size",
                "List.of is compatible with Java 1.0"
            ],
            "answer": 0,
            "explanation": "List.of() is truly immutable, compact (specialized List12 types avoid array allocation for 1-2 items), and prevents null elements."
        },
        {
            "question": "When is CopyOnWriteArrayList an optimal architectural choice?",
            "options": [
                "In read-heavy concurrent scenarios where reads vastly outnumber writes (e.g. event listener registries)",
                "In write-heavy batch logging systems",
                "When sorting arrays with billions of numbers",
                "When allocating off-heap native memory buffers"
            ],
            "answer": 0,
            "explanation": "CopyOnWriteArrayList provides lock-free instant reads, making it ideal when reads occur frequently and mutations are rare."
        },
        {
            "question": "Why is LinkedList generally considered an anti-pattern compared to ArrayList on modern CPU hardware?",
            "options": [
                "LinkedList nodes are scattered across the heap, causing severe CPU cache misses and 24 bytes of pointer overhead per node",
                "LinkedList cannot store strings",
                "LinkedList only runs on 32-bit JVMs",
                "LinkedList was removed from the Java language specification"
            ],
            "answer": 0,
            "explanation": "LinkedList's node pointer chasing causes severe CPU cache misses, whereas ArrayList's contiguous memory ensures optimal L1/L2 cache locality."
        }
    ],
    [
        {
            "question": "In the Day 25 filterAbove challenge, what does filterAbove(new int[]{85, 42, 95, 60, 72}, 70) return?",
            "options": [
                "An ArrayList<Integer> containing [85, 95, 72]",
                "An array containing [85, 42, 95, 60, 72]",
                "A single integer representing the average score",
                "An empty list because 70 is greater than 60"
            ],
            "answer": 0,
            "explanation": "Scores 85, 95, and 72 are strictly greater than 70; they are added to the ArrayList in sequential order."
        },
        {
            "question": "What does Solution.filterAbove(null, 50) return when protected by a defensive guard?",
            "options": [
                "An empty ArrayList<Integer> with size 0",
                "Throws a NullPointerException",
                "Returns null",
                "Returns [-1]"
            ],
            "answer": 0,
            "explanation": "The defensive guard 'if (scores == null) return result;' returns an empty ArrayList, avoiding a NullPointerException."
        },
        {
            "question": "In the Day 25 createList assignment, what does createList('Java', 'Spring') return?",
            "options": [
                "An ArrayList<String> containing ['Java', 'Spring'] with size 2",
                "A single concatenated string 'JavaSpring'",
                "An array of characters",
                "An empty list"
            ],
            "answer": 0,
            "explanation": "createList instantiates an ArrayList, adds 'Java' at index 0, adds 'Spring' at index 1, and returns the 2-element list."
        },
        {
            "question": "What happens if createList('Java', null) is called?",
            "options": [
                "Returns an ArrayList containing ['Java', null], as ArrayList accepts null elements",
                "Throws a NullPointerException",
                "Replaces null with an empty string",
                "Terminates the program"
            ],
            "answer": 0,
            "explanation": "Standard ArrayList allows null elements, storing null cleanly at index 1."
        }
    ]
]

DAY_25["minutes"] = 25
DAY_25["recap"] = "Yesterday we mastered active exception throwing, precondition verification, and custom exception design. Today, we step into the Java Collections Framework (JCF), exploring dynamic lists, ArrayList internal mechanics, 1.5x resizing, and algorithmic complexities."
DAY_25["summary"] = [
    "The Java Collections Framework separates abstract contracts (Collection, List, Set, Queue) from concrete algorithmic data structures.",
    "ArrayList is a dynamic array backed by a contiguous Object[] array on the heap.",
    "When full, ArrayList expands by approximately 1.5x via System.arraycopy, providing amortized O(1) appends.",
    "Positional access (get/set) is strictly O(1) constant time, while arbitrary insertions/deletions require O(N) element shifts.",
    "ArrayList is not thread-safe; iterating while structurally mutating throws ConcurrentModificationException.",
    "The filterAbove and createList challenges verify dynamic list construction, conditional filtering, and autoboxing."
]
DAY_25["projectStep"] = {
    "title": "Build the Dynamic Score Filtering and List Factory Engine",
    "steps": [
        "Author Solution.filterAbove(int[] scores, int cutoff) returning an ArrayList<Integer> of scores > cutoff.",
        "Handle null and empty array inputs defensively by returning an empty ArrayList.",
        "Author SolutionAdv.createList(String a, String b) returning an ArrayList<String> containing elements a and b.",
        "Verify filterAbove([85, 42, 95, 60, 72], 70) returns [85, 95, 72] with exact ordering preserved."
    ]
}

for i in range(5):
    DAY_25["parts"][i]["code"] = d25_codes[i]
    DAY_25["parts"][i]["checks"] = d25_checks[i]
    if "check" in DAY_25["parts"][i]:
        del DAY_25["parts"][i]["check"]

with open("scripts/block5_day25.py", "w", encoding="utf-8") as f:
    f.write("# Day 25: Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals\n\nDAY_25 = ")
    f.write(pprint.pformat(DAY_25, indent=4, width=120))
    f.write("\n")

print("Enriched Day 25 successfully")
