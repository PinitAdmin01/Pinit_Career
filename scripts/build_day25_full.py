import sys
import pprint

p1_content = """### 1. The Java Collections Framework (JCF) Architecture: Hierarchy, Interfaces & Contracts

In the initial days of software development with Java, programmers relied primarily on fixed-size primitive arrays (`int[]`, `String[]`) to manage collections of data. While primitive arrays provide blistering hardware performance and direct CPU cache alignment, they suffer from a crippling architectural limitation: **fixed capacity**. Once an array is allocated on the Java heap, its length cannot expand or shrink. If an application needs to store an arbitrary number of inbound transactions, the developer is forced to manually allocate a larger array, copy every existing element across, and manage index pointers—a repetitive and error-prone process.

To provide standardized, reusable, and type-safe data structures, Java 2 introduced the **Java Collections Framework (JCF)** under the `java.util` package. The JCF is one of the most celebrated library designs in computer science, cleanly separating abstract behavioral interfaces from concrete storage algorithms.

```
+------------------------------------------------------------------------------------+
| CORE JAVA COLLECTIONS FRAMEWORK INTERFACE HIERARCHY                                |
+------------------------------------------------------------------------------------+
|                                java.lang.Iterable<E>                               |
|                                         │                                          |
|                                         ▼                                          |
|                              java.util.Collection<E>                               |
|                                         │                                          |
|                  ┌──────────────────────┼──────────────────────┐                   |
|                  ▼                      ▼                      ▼                   |
|            java.util.List<E>      java.util.Set<E>       java.util.Queue<E>         |
|            - Ordered sequence     - Unique elements      - FIFO / Priority         |
|            - Positional indexing  - No duplicates        - Deque (double-ended)    |
|            - Allows duplicates    - Fast membership      - Element processing      |
|                  │                                                                 |
|     ┌────────────┴────────────┐                                                    |
|     ▼                         ▼                                                    |
| ArrayList<E>             LinkedList<E>                                             |
| (Contiguous Array)       (Doubly-Linked Nodes)                                     |
+------------------------------------------------------------------------------------+
```

At the pinnacle of the collection hierarchy sits `java.lang.Iterable<E>`, which mandates a single method: `iterator()`. Any class implementing `Iterable` can be targeted by Java's enhanced for-each loop (`for (E item : collection)`). Directly beneath it sits `java.util.Collection<E>`, which establishes the foundational operations common to all data groups: `add(E e)`, `remove(Object o)`, `contains(Object o)`, `size()`, `isEmpty()`, and `clear()`.

Branching from `Collection`, the framework defines three primary behavioral archetypes:
1. **`List<E>`**: An ordered collection (also known as a sequence). The caller possesses precise control over where each element is inserted in the list. Elements can be accessed by their integer index (`0` through `size - 1`). Unlike sets, lists typically allow duplicate elements and multiple `null` values.
2. **`Set<E>`**: A collection that contains no duplicate elements (models the mathematical set abstraction). Concrete implementations include `HashSet` (backed by a hash table) and `TreeSet` (backed by a Red-Black tree providing sorted order).
3. **`Queue<E>` / `Deque<E>`**: Collections designed for holding elements prior to processing, typically ordering elements in a FIFO (first-in, first-out) or LIFO (last-in, first-out) manner.

Crucially, notice that `java.util.Map<K, V>` does NOT extend `Collection<E>`. A map represents a mapping of key-value pairs rather than a collection of individual elements, and therefore resides in its own parallel hierarchy.

Another essential concept when working with the Collections Framework is **Autoboxing and Unboxing**. In Java, generic collections cannot hold primitive types directly. You cannot declare `ArrayList<int>`; you must declare `ArrayList<Integer>`. When you add a primitive `int` to an `ArrayList<Integer>`, the compiler automatically wraps the primitive into a `java.lang.Integer` heap object via `Integer.valueOf(score)`. While convenient, each `Integer` wrapper object adds 16 bytes of memory overhead (12-byte object header + 4-byte int payload) compared to a raw 4-byte primitive, which enterprise engineers must consider when storing millions of numbers.

A critical underlying mechanism of Java collections is **Type Erasure**. When generics were introduced in Java 5, Java maintained backward compatibility with legacy raw types (`ArrayList`). At compile time, `javac` verifies that you only add `Integer` objects to `ArrayList<Integer>`. But when translating to bytecode, the type parameter `<Integer>` is completely erased! The backing array is simply `Object[]`, and whenever you call `list.get(index)`, the compiler automatically inserts a synthetic `checkcast` bytecode instruction: `(Integer) elementData[index]`.

Furthermore, for applications processing hundreds of millions of numerical records (such as high-frequency trading platforms, algorithmic telemetry pipelines, and scientific simulations), autoboxing overhead becomes prohibitive. Each `Integer` wrapper object requires 16 bytes of heap memory, plus an 8-byte pointer in the `elementData` array—costing 24 bytes per integer instead of 4 bytes! In such high-performance domains, systems architects utilize specialized primitive collection libraries such as **Eclipse Collections** or **fastutil**, which provide unboxed primitive lists like `IntArrayList` that store raw `int[]` buffers directly, reducing memory consumption by up to 80% and unlocking vectorized SIMD hardware acceleration.

"""

p2_content = """### 2. `ArrayList` Internal Mechanics: Dynamic Array Growth, Capacity & Memory Layout

Among all concrete implementations of the `List` interface, **`java.util.ArrayList<E>`** is by far the most widely used collection in the Java ecosystem. Understanding its internal memory layout and resizing mechanics is vital for writing performant, scalable software.

Under the hood, `ArrayList` is surprisingly simple: it is not a complex pointer-based structure; rather, it is a **dynamically resizing wrapper around a standard Java `Object[]` array**. In the JDK source code, the backing store is declared as:
```java
transient Object[] elementData; // Non-private to simplify nested class access
private int size;               // The number of active elements in the list
```

Notice the critical distinction between **Capacity** and **Size**:
- **Size (`size`)**: The actual number of elements currently stored in the list. This is what `list.size()` returns.
- **Capacity (`elementData.length`)**: The physical length of the underlying backing array allocated on the heap. Capacity is always greater than or equal to size.

When you create an empty `ArrayList` using the default constructor (`new ArrayList<>()`), Java does not immediately allocate an array of 10 elements. Instead, it assigns `elementData` to a shared empty array constant (`DEFAULTCAPACITY_EMPTY_ELEMENTDATA`). This lazy initialization optimization ensures that if an application creates thousands of empty lists that never receive elements, zero unnecessary array heap memory is consumed.

```
+------------------------------------------------------------------------------------+
| ARRAYLIST DYNAMIC MEMORY LAYOUT & 1.5x RESIZE SEQUENCE                            |
+------------------------------------------------------------------------------------+
| INITIAL STATE (First add element):                                                 |
| elementData = [ "A", null, null, null, null, null, null, null, null, null ]        |
| size = 1, capacity = 10                                                            |
|                                                                                    |
| FULL STATE (size reaches capacity 10):                                             |
| elementData = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" ]                |
| size = 10, capacity = 10                                                           |
|                                                                                    |
| TRIGGER RESIZE (Adding 11th element "K"):                                          |
| 1. Compute new capacity: 10 + (10 >> 1) = 10 + 5 = 15                              |
| 2. Allocate new array: new Object[15]                                              |
| 3. Native copy: System.arraycopy(oldArray, 0, newArray, 0, 10)                     |
| 4. Assign elementData = newArray                                                   |
| elementData = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", ...null ]  |
| size = 11, capacity = 15                                                           |
+------------------------------------------------------------------------------------+
```

When the 11th element is added, the capacity is exhausted (`size == elementData.length`). To accommodate the new element, `ArrayList` executes its internal growth algorithm:
```java
int newCapacity = oldCapacity + (oldCapacity >> 1); // 1.5x growth
```
The bitwise shift `oldCapacity >> 1` divides `oldCapacity` by 2 using a single ultra-fast CPU instruction. Thus, an array with capacity 10 grows to 15; capacity 15 grows to 22; capacity 22 grows to 33, and so on.

Once the new capacity is calculated, the JVM allocates a brand new `Object[newCapacity]` array on the heap and calls **`System.arraycopy()`**. `System.arraycopy()` is a native C++ method implemented inside the JVM that uses vectorized hardware memory instructions (such as `memcpy` or AVX registers) to transfer blocks of memory in bulk. The old array reference is abandoned and eventually reclaimed by the Garbage Collector.

Because resizing requires copying all $N$ elements into a new array, a single resize operation takes $O(N)$ time. However, because resizing occurs exponentially less frequently as the list expands, the **amortized time complexity** of appending an element (`list.add(e)`) remains a blistering **$O(1)$**. Nevertheless, if you know in advance that you are loading 100,000 records from a database, creating `new ArrayList<>(100000)` pre-allocates the backing array in a single heap allocation, completely eliminating dozens of intermediate array copies and saving massive CPU and GC cycles.
"""

p3_content = """### 3. Algorithmic Complexity: Positional Access, Insertions, Deletions & Iteration

Choosing the right data structure requires an intimate understanding of algorithmic time complexities and CPU memory cache characteristics. Let us analyze how `ArrayList` performs across fundamental computer science operations.

**1. Positional Random Access: $O(1)$ Constant Time**
When you call `list.get(index)` or `list.set(index, element)`, `ArrayList` executes in strictly $O(1)$ time. Because the underlying array occupies a single contiguous block of physical RAM, the JVM computes the exact memory address of any element using direct pointer arithmetic:
$$\\text{Target Address} = \\text{Base Address} + (\\text{index} \\times \\text{Reference Size})$$
The CPU calculates this offset in a single clock cycle and fetches the data directly into L1/L2 hardware CPU caches. This cache locality makes `ArrayList` significantly faster than linked structures in real-world benchmarks.

**2. Appending Elements at the End: Amortized $O(1)$**
Calling `list.add(element)` places the element at `elementData[size++]`. Unless a resize is triggered, this involves a single array write and integer increment. As proven mathematically, the amortized cost per append across $N$ insertions is $O(1)$.

**3. Arbitrary Insertions and Deletions: $O(N)$ Linear Time**
When you insert or remove an element from the beginning or middle of an `ArrayList`:
```java
list.add(0, "First");  // Inserts at the head
list.remove(5);        // Deletes element at index 5
```
Every single element located to the right of the insertion or deletion point must be physically shifted by one position using `System.arraycopy()`. In the worst-case scenario (inserting or removing at index 0), all $N$ elements must be shifted. Therefore, middle insertions and deletions scale linearly with $O(N)$ complexity.

```
+------------------------------------------------------------------------------------+
| ARRAYLIST TIME COMPLEXITY SUMMARY TABLE                                            |
+------------------------------------------------------------------------------------+
| OPERATION                | METHOD                     | TIME COMPLEXITY           |
| ------------------------ | -------------------------- | ------------------------- |
| Positional Read          | list.get(index)            | O(1) Constant             |
| Positional Write         | list.set(index, elem)      | O(1) Constant             |
| Append to End            | list.add(elem)             | O(1) Amortized            |
| Insert at Index          | list.add(index, elem)      | O(N) Linear               |
| Delete from Index        | list.remove(index)         | O(N) Linear               |
| Search by Value          | list.indexOf(elem)         | O(N) Linear Scan          |
| Contains Value           | list.contains(elem)        | O(N) Linear Scan          |
+------------------------------------------------------------------------------------+
```

**4. The ConcurrentModificationException Hazard & Safe Iteration**
A notorious bug encountered by developers is modifying a list while iterating over it:
```java
// SEVERE BUG: Throws ConcurrentModificationException!
for (Integer score : list) {
    if (score < 50) {
        list.remove(score); // Modifying list during enhanced for-loop iteration!
    }
}
```
Why does this happen? Under the hood, the enhanced for-loop compiles into an explicit `Iterator<Integer>`. The `ArrayList` class maintains an internal counter called **`modCount`** that increments every time a structural modification (add or remove) occurs. When the iterator is created, it records `expectedModCount = modCount`. On every call to `iterator.next()`, the iterator verifies `if (modCount != expectedModCount) throw new ConcurrentModificationException()`. Calling `list.remove()` directly alters `modCount`, desynchronizing the iterator and triggering the exception.

To safely remove elements during iteration in modern Java, use:
1. **Explicit Iterator removal**:
   ```java
   Iterator<Integer> it = list.iterator();
   while (it.hasNext()) {
       if (it.next() < 50) {
           it.remove(); // Safely updates both modCount and expectedModCount!
       }
   }
   ```
2. **The Modern `removeIf` method (Java 8+)**:
   ```java
   list.removeIf(score -> score < 50); // High-performance single-pass in-place removal
   ```
`removeIf` utilizes a two-pointer compaction algorithm that shifts elements in a single $O(N)$ pass, avoiding both multiple shifts and `ConcurrentModificationException`.

Another valuable method provided by `ArrayList` for memory optimization is **`trimToSize()`**. If an application builds a large list of 100,000 elements and then removes 80,000 of them, the underlying `elementData` array remains at capacity 100,000! By calling `list.trimToSize()`, the list allocates a new array sized exactly to the current `size` (20,000), allowing the Garbage Collector to reclaim the 80,000 unused references.

Additionally, be aware of the view semantics of **`list.subList(int fromIndex, int toIndex)`**. The `subList` method does NOT create a new independent copy of the list. Instead, it returns a lightweight view window backed by the original `ArrayList`. Any structural changes made to the parent list directly (such as adding or removing elements) immediately invalidate the sublist view, causing subsequent operations on the sublist to throw `ConcurrentModificationException`. Always treat sublists as short-lived, transient views.

"""

p4_content = """### 4. Production Best Practices: Thread Safety, Immutability & List Variants

In enterprise software engineering, choosing the appropriate list variant and enforcing thread safety invariants is essential for building resilient, concurrent systems.

First and foremost: **`java.util.ArrayList` is fundamentally NOT thread-safe**. If multiple threads access an `ArrayList` concurrently, and at least one thread modifies it structurally, the list state will become corrupted. Common symptoms of unsynchronized concurrent access include:
- `ArrayIndexOutOfBoundsException` during `add()`: Two threads see `size = 9` in an array of capacity 10, both write to index 9, and one increments `size` to 10 while the other attempts to write to index 10 without resizing!
- Torn writes and lost elements: Elements overwritten due to race conditions.
- Infinite loops inside internal iterators.

When thread safety is required, enterprise architectures employ three distinct strategies:
1. **Thread-Safe Synchronized Wrappers**:
   ```java
   List<String> syncList = Collections.synchronizedList(new ArrayList<>());
   ```
   This wraps the list in a proxy that synchronizes every method on a common intrinsic lock (`mutex`). While safe, it serializes all reads and writes, creating severe thread contention under high concurrency.
2. **CopyOnWriteArrayList (`java.util.concurrent`)**:
   ```java
   List<String> cowList = new CopyOnWriteArrayList<>();
   ```
   `CopyOnWriteArrayList` is a thread-safe variant where every mutative operation (`add`, `set`, `remove`) creates a completely fresh copy of the underlying array. Read operations (`get()`) proceed lock-free and never block! This structure is optimal for event listener registries and read-heavy configurations where reads outnumber writes by 100:1.
3. **Immutable and Unmodifiable Lists (Modern Java Standards)**:
   In modern microservices, shared mutable state is actively discouraged. Instead, components pass unmodifiable views or truly immutable list snapshots:
   - **Java 9+ `List.of(e1, e2, ...)`**: Creates a truly immutable, highly compact list. It rejects `null` elements (throws `NullPointerException`) and consumes significantly less memory than `ArrayList` by using specialized internal types (`List12` for 1-2 elements, `ListN` for more). Any attempt to call `add()` or `remove()` throws `UnsupportedOperationException`.
   - **Java 10+ `List.copyOf(existingCollection)`**: Creates an unmodifiable defensive copy of an existing collection.
   - **`Collections.unmodifiableList(mutableList)`**: Wraps an existing list. Beware: if the underlying `mutableList` is modified elsewhere, the change is reflected in the unmodifiable view!

Finally, let us address the perennial question: **`ArrayList` vs `LinkedList`**. In academic textbooks, `LinkedList` is often touted for $O(1)$ head insertions. However, in modern computer hardware architectures, **`LinkedList` is virtually always an anti-pattern**. Each node in a `LinkedList` requires 24 bytes of heap overhead (object header + previous pointer + next pointer) in addition to the data reference. Even worse, linked nodes are scattered randomly across the heap, causing catastrophic CPU cache misses during traversal. In virtually every real-world benchmark, `ArrayList` dramatically outperforms `LinkedList`, even for operations involving moderate middle insertions.

To understand why `List.of()` is vastly superior to `Collections.unmodifiableList(new ArrayList<>())`, consider their internal object architectures:
- `Collections.unmodifiableList` wraps a mutable list instance. It requires two distinct heap objects: the wrapper object itself, and the underlying `ArrayList` (which in turn holds an `Object[]` array). Even worse, if external code retains a reference to the underlying mutable `ArrayList`, it can mutate the data, compromising the integrity of the unmodifiable view!
- In contrast, `List.of()` returns a truly immutable, compact representation. For 0 elements, it returns a static singleton `ImmutableCollections.EMPTY_LIST`. For 1 or 2 elements, it instantiates specialized classes `List12` with dedicated fields `e0` and `e1`, requiring **zero backing array allocation**! For 3 or more elements, it stores items in a single compact `Object[]` array with zero spare capacity. It also enforces non-nullability, immediately rejecting null elements.

In ultra-high concurrency systems where multiple threads need to accumulate batch items without lock contention, a proven pattern is **Thread-Confined Buffers** using `ThreadLocal<ArrayList<T>>`. Each worker thread appends items to its own private, unsynchronized `ArrayList` with zero locking overhead. Once a thread's buffer reaches a threshold (e.g. 500 items), the thread flushes the entire batch to a persistent message queue in a single atomic transaction. This pattern achieves millions of operations per second while avoiding all lock contention.

"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `filterAbove` and `createList`

To conclude Day 25, we implement and thoroughly verify the two dynamic list challenges specified in the PinIT Career OS curriculum: **`filterAbove`** and **`createList`**.

In the primary challenge, we implement `Solution.filterAbove(int[] scores, int cutoff)`. The specification requires taking an array of primitive integers `scores` and a threshold integer `cutoff`, filtering all scores that are **strictly greater than `cutoff`** (`score > cutoff`), storing them in an `ArrayList<Integer>`, and returning the resulting dynamic list.

```java
// ============================================================================
// CHALLENGE 1: FILTER HIGH SCORES
// ============================================================================
import java.util.ArrayList;

public class Solution {
    /**
     * Filters an array of scores, returning an ArrayList<Integer>
     * containing only the scores strictly greater than the cutoff.
     */
    public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {
        // Step 1: Instantiate the dynamic list result container:
        ArrayList<Integer> result = new ArrayList<>();

        // Step 2: Defensive guard for null array input:
        if (scores == null) {
            return result;
        }

        // Step 3: Iterate through primitive scores array:
        for (int score : scores) {
            if (score > cutoff) {
                // Step 4: Add passing score (autoboxed from int to Integer):
                result.add(score);
            }
        }

        // Step 5: Return the populated ArrayList:
        return result;
    }
}
```

Let us trace the execution dynamics across standard and edge-case inputs:
- **Trace 1 (Standard Filtering)**:
  `scores = [85, 42, 95, 60, 72]`, `cutoff = 70`.
  - Check 85: `85 > 70` is `true` $\to$ `result.add(85)`. `result = [85]`.
  - Check 42: `42 > 70` is `false` $\to$ skipped.
  - Check 95: `95 > 70` is `true` $\to$ `result.add(95)`. `result = [85, 95]`.
  - Check 60: `60 > 70` is `false` $\to$ skipped.
  - Check 72: `72 > 70` is `true` $\to$ `result.add(72)`. `result = [85, 95, 72]`.
  - Returns `[85, 95, 72]` with `result.size() == 3`.
- **Trace 2 (Exact Cutoff Boundary)**:
  `scores = [70, 71]`, `cutoff = 70`.
  - Check 70: `70 > 70` is `false` (strictly greater requirement). Not added.
  - Check 71: `71 > 70` is `true`. Added.
  - Returns `[71]`.
- **Trace 3 (No Matching Scores)**:
  `scores = [10, 20, 30]`, `cutoff = 50`. Returns empty list `[]` with `size == 0`.
- **Trace 4 (Null Input)**:
  `scores = null`. The defensive guard immediately returns an empty `ArrayList<Integer>`, avoiding a `NullPointerException`.

In the advanced assignment, we implement `SolutionAdv.createList(String a, String b)`. The contract mandates taking two string arguments `a` and `b`, constructing a new `ArrayList<String>`, appending element `a` followed by element `b`, and returning the list.

```java
// ============================================================================
// CHALLENGE 2: ADD AND GET LIST ELEMENTS
// ============================================================================
import java.util.ArrayList;

public class SolutionAdv {
    /**
     * Constructs an ArrayList<String> containing elements a and b in sequential order.
     */
    public static ArrayList<String> createList(String a, String b) {
        ArrayList<String> list = new ArrayList<>();
        list.add(a); // Appends element a at index 0
        list.add(b); // Appends element b at index 1
        return list;
    }
}
```

Let us verify the properties of `createList`:
- Invoking `createList("Java", "Spring")` allocates an `ArrayList<String>`, stores `"Java"` at index 0, stores `"Spring"` at index 1, and returns the list.
- `list.get(0)` evaluates to `"Java"`.
- `list.get(1)` evaluates to `"Spring"`.
- `list.size()` evaluates to `2`.
- If either string is `null` (e.g. `createList("Java", null)`), `ArrayList` gracefully accepts the `null` reference, storing `null` at index 1, consistent with the standard `List` contract.

Both implementations satisfy all curriculum specifications and pass all automated test validations with zero regressions.

In professional enterprise testing with JUnit 5 and AssertJ, verifying collections goes beyond checking basic equality:
```java
@Test
void testFilterAboveComprehensive() {
    int[] scores = {85, 42, 95, 60, 72};
    ArrayList<Integer> filtered = Solution.filterAbove(scores, 70);

    // Verify size and exact element ordering:
    assertEquals(3, filtered.size());
    assertIterableEquals(List.of(85, 95, 72), filtered);

    // AssertJ fluent assertion:
    assertThat(filtered)
        .hasSize(3)
        .containsExactly(85, 95, 72)
        .doesNotContain(42, 60);
}
```
Notice how `containsExactly` verifies both membership and sequential order in a single fluent assertion. By validating both happy paths and edge cases (such as all scores failing the cutoff or empty arrays), you ensure the utility is completely robust and production-ready.

"""

DAY_25 = {
    "day": 25,
    "title": "Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals",
    "goal": "Master dynamic lists and the Java Collections Framework (JCF) architecture. Understand the Collection and List interface contracts, explore ArrayList internal mechanics including the 1.5x dynamic growth algorithm and System.arraycopy memory transfers, analyze time complexities for random access vs insertion, diagnose ConcurrentModificationException, and implement filterAbove and createList.",
    "parts": [
        {
            "part": 1,
            "title": "The Java Collections Framework (JCF) Architecture: Hierarchy, Interfaces & Contracts",
            "content": p1_content.strip(),
            "check": {
                "question": "Which interface sits at the root of the Java Collections Framework hierarchy, enabling enhanced for-each loop iteration?",
                "options": [
                    "java.lang.Iterable",
                    "java.util.Map",
                    "java.lang.Cloneable",
                    "java.io.Serializable"
                ],
                "answer": 0
            }
        },
        {
            "part": 2,
            "title": "ArrayList Internal Mechanics: Dynamic Array Growth, Capacity & Memory Layout",
            "content": p2_content.strip(),
            "check": {
                "question": "By what factor does the backing array of an ArrayList grow when its capacity is exhausted during an add operation?",
                "options": [
                    "Approximately 1.5x (oldCapacity + (oldCapacity >> 1))",
                    "Exactly 10x the original size",
                    "It doubles by 2.0x on every single element added",
                    "It never grows; attempting to exceed capacity throws an error"
                ],
                "answer": 0
            }
        },
        {
            "part": 3,
            "title": "Algorithmic Complexity: Positional Access, Insertions, Deletions & Iteration",
            "content": p3_content.strip(),
            "check": {
                "question": "What is the time complexity of retrieving an element by index using list.get(index) in an ArrayList?",
                "options": [
                    "O(1) Constant time due to direct contiguous array memory address computation",
                    "O(N) Linear time because the JVM must traverse pointers from head to index",
                    "O(log N) Logarithmic time using binary search",
                    "O(N^2) Quadratic time due to garbage collection scanning"
                ],
                "answer": 0
            }
        },
        {
            "part": 4,
            "title": "Production Best Practices: Thread Safety, Immutability & List Variants",
            "content": p4_content.strip(),
            "check": {
                "question": "Why is java.util.ArrayList unsafe to modify concurrently from multiple threads without synchronization?",
                "options": [
                    "It lacks internal synchronization, leading to race conditions, lost updates, and corrupted size/indices",
                    "The JVM terminates the operating system whenever two threads access the same class",
                    "It automatically converts all strings into raw binary integers",
                    "It is restricted by Java security policies to run only on single-core CPUs"
                ],
                "answer": 0
            }
        },
        {
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building filterAbove and createList",
            "content": p5_content.strip(),
            "check": {
                "question": "In the Day 25 filterAbove challenge, what does filterAbove(new int[]{85, 42, 95, 60, 72}, 70) return?",
                "options": [
                    "An ArrayList<Integer> containing [85, 95, 72]",
                    "An array containing [85, 42, 95, 60, 72]",
                    "A single integer representing the average score",
                    "An empty list because 70 is greater than 60"
                ],
                "answer": 0
            }
        }
    ]
}

with open("scripts/block5_day25.py", "w", encoding="utf-8") as f:
    f.write("# Day 25: Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals\n\nDAY_25 = ")
    f.write(pprint.pformat(DAY_25, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block5_day25.py successfully")
