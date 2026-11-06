# Day 25: Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals

DAY_25 = {'day': 25,
 'goal': 'Master dynamic lists and the Java Collections Framework (JCF) architecture. Understand the Collection and '
         'List interface contracts, explore ArrayList internal mechanics including the 1.5x dynamic growth algorithm '
         'and System.arraycopy memory transfers, analyze time complexities for random access vs insertion, diagnose '
         'ConcurrentModificationException, and implement filterAbove and createList.',
 'minutes': 25,
 'parts': [{'checks': [{'answer': 0,
                        'explanation': 'Iterable<E> defines iterator() and sits at the top of the collection '
                                       'hierarchy, enabling enhanced for-loop syntax.',
                        'options': ['java.lang.Iterable',
                                    'java.util.Map',
                                    'java.lang.Cloneable',
                                    'java.io.Serializable'],
                        'question': 'Which interface sits at the root of the Java Collections Framework hierarchy, '
                                    'enabling enhanced for-each loop iteration?'},
                       {'answer': 0,
                        'explanation': 'Lists preserve insertion order and permit duplicate elements accessible by '
                                       'index; Sets enforce element uniqueness.',
                        'options': ['A List maintains an ordered sequence with positional indexing and allows '
                                    'duplicates; a Set enforces uniqueness with no duplicates',
                                    'A List can only store integers; a Set can store any object',
                                    'A List cannot be iterated with a loop; a Set can',
                                    'A List is always synchronized; a Set is always unsynchronized'],
                        'question': 'What is the primary behavioral characteristic that distinguishes a List from a '
                                    'Set in the Collections Framework?'},
                       {'answer': 0,
                        'explanation': 'Java generics are erased to Object references on the heap, requiring '
                                       'primitives to be autoboxed into their wrapper types.',
                        'options': ['Because Java generic collections can only store heap object references, requiring '
                                    'primitive ints to be wrapped in java.lang.Integer',
                                    'Because primitive ints are not supported on 64-bit operating systems',
                                    'Because the compiler deletes primitive variables at runtime',
                                    'Because ArrayList is written in JavaScript under the hood'],
                        'question': 'Why does ArrayList<Integer> require autoboxing when adding primitive ints?'},
                       {'answer': 0,
                        'explanation': 'Map models key-value associations and provides three distinct collection views '
                                       '(keySet, values, entrySet) rather than extending Collection.',
                        'options': ['Because a Map models key-value pair associations rather than a collection of '
                                    'individual elements',
                                    'Because Map was deprecated in Java 5',
                                    'Because Map only works with database tables',
                                    'Because Map cannot be garbage collected'],
                        'question': 'Why does java.util.Map not inherit from java.util.Collection?'}],
            'code': 'import java.util.ArrayList;\n'
                    'import java.util.List;\n'
                    '\n'
                    'public class CollectionsHierarchyLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("=== COLLECTIONS FRAMEWORK: LIST CONTRACT ===");\n'
                    '\n'
                    '        // Programming to an Interface: List reference pointing to ArrayList instance\n'
                    '        List<Integer> numbers = new ArrayList<>();\n'
                    '\n'
                    '        // Autoboxing: primitive int is automatically wrapped in Integer.valueOf()\n'
                    '        numbers.add(100); // index 0\n'
                    '        numbers.add(200); // index 1\n'
                    '        numbers.add(100); // duplicate allowed in List!\n'
                    '\n'
                    '        System.out.println("List contents: " + numbers);\n'
                    '        System.out.println("Size: " + numbers.size());\n'
                    '        System.out.println("Element at index 1: " + numbers.get(1)); // 200\n'
                    '\n'
                    '        // Type safety: Generics prevent invalid types at compile time\n'
                    '        // numbers.add("InvalidString"); // Compile-time error!\n'
                    '    }\n'
                    '}',
            'content': '### 1. The Java Collections Framework (JCF) Architecture: Hierarchy, Interfaces & Contracts\n'
                       '\n'
                       'In the initial days of software development with Java, programmers relied primarily on '
                       'fixed-size primitive arrays (`int[]`, `String[]`) to manage collections of data. While '
                       'primitive arrays provide blistering hardware performance and direct CPU cache alignment, they '
                       'suffer from a crippling architectural limitation: **fixed capacity**. Once an array is '
                       'allocated on the Java heap, its length cannot expand or shrink. If an application needs to '
                       'store an arbitrary number of inbound transactions, the developer is forced to manually '
                       'allocate a larger array, copy every existing element across, and manage index pointers—a '
                       'repetitive and error-prone process.\n'
                       '\n'
                       'To provide standardized, reusable, and type-safe data structures, Java 2 introduced the **Java '
                       'Collections Framework (JCF)** under the `java.util` package. The JCF is one of the most '
                       'celebrated library designs in computer science, cleanly separating abstract behavioral '
                       'interfaces from concrete storage algorithms.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| CORE JAVA COLLECTIONS FRAMEWORK INTERFACE HIERARCHY                                |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '|                                java.lang.Iterable<E>                               |\n'
                       '|                                         │                                          |\n'
                       '|                                         ▼                                          |\n'
                       '|                              java.util.Collection<E>                               |\n'
                       '|                                         │                                          |\n'
                       '|                  ┌──────────────────────┼──────────────────────┐                   |\n'
                       '|                  ▼                      ▼                      ▼                   |\n'
                       '|            java.util.List<E>      java.util.Set<E>       java.util.Queue<E>         |\n'
                       '|            - Ordered sequence     - Unique elements      - FIFO / Priority         |\n'
                       '|            - Positional indexing  - No duplicates        - Deque (double-ended)    |\n'
                       '|            - Allows duplicates    - Fast membership      - Element processing      |\n'
                       '|                  │                                                                 |\n'
                       '|     ┌────────────┴────────────┐                                                    |\n'
                       '|     ▼                         ▼                                                    |\n'
                       '| ArrayList<E>             LinkedList<E>                                             |\n'
                       '| (Contiguous Array)       (Doubly-Linked Nodes)                                     |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'At the pinnacle of the collection hierarchy sits `java.lang.Iterable<E>`, which mandates a '
                       "single method: `iterator()`. Any class implementing `Iterable` can be targeted by Java's "
                       'enhanced for-each loop (`for (E item : collection)`). Directly beneath it sits '
                       '`java.util.Collection<E>`, which establishes the foundational operations common to all data '
                       'groups: `add(E e)`, `remove(Object o)`, `contains(Object o)`, `size()`, `isEmpty()`, and '
                       '`clear()`.\n'
                       '\n'
                       'Branching from `Collection`, the framework defines three primary behavioral archetypes:\n'
                       '1. **`List<E>`**: An ordered collection (also known as a sequence). The caller possesses '
                       'precise control over where each element is inserted in the list. Elements can be accessed by '
                       'their integer index (`0` through `size - 1`). Unlike sets, lists typically allow duplicate '
                       'elements and multiple `null` values.\n'
                       '2. **`Set<E>`**: A collection that contains no duplicate elements (models the mathematical set '
                       'abstraction). Concrete implementations include `HashSet` (backed by a hash table) and '
                       '`TreeSet` (backed by a Red-Black tree providing sorted order).\n'
                       '3. **`Queue<E>` / `Deque<E>`**: Collections designed for holding elements prior to processing, '
                       'typically ordering elements in a FIFO (first-in, first-out) or LIFO (last-in, first-out) '
                       'manner.\n'
                       '\n'
                       'Crucially, notice that `java.util.Map<K, V>` does NOT extend `Collection<E>`. A map represents '
                       'a mapping of key-value pairs rather than a collection of individual elements, and therefore '
                       'resides in its own parallel hierarchy.\n'
                       '\n'
                       'Another essential concept when working with the Collections Framework is **Autoboxing and '
                       'Unboxing**. In Java, generic collections cannot hold primitive types directly. You cannot '
                       'declare `ArrayList<int>`; you must declare `ArrayList<Integer>`. When you add a primitive '
                       '`int` to an `ArrayList<Integer>`, the compiler automatically wraps the primitive into a '
                       '`java.lang.Integer` heap object via `Integer.valueOf(score)`. While convenient, each `Integer` '
                       'wrapper object adds 16 bytes of memory overhead (12-byte object header + 4-byte int payload) '
                       'compared to a raw 4-byte primitive, which enterprise engineers must consider when storing '
                       'millions of numbers.\n'
                       '\n'
                       'A critical underlying mechanism of Java collections is **Type Erasure**. When generics were '
                       'introduced in Java 5, Java maintained backward compatibility with legacy raw types '
                       '(`ArrayList`). At compile time, `javac` verifies that you only add `Integer` objects to '
                       '`ArrayList<Integer>`. But when translating to bytecode, the type parameter `<Integer>` is '
                       'completely erased! The backing array is simply `Object[]`, and whenever you call '
                       '`list.get(index)`, the compiler automatically inserts a synthetic `checkcast` bytecode '
                       'instruction: `(Integer) elementData[index]`.\n'
                       '\n'
                       'Furthermore, for applications processing hundreds of millions of numerical records (such as '
                       'high-frequency trading platforms, algorithmic telemetry pipelines, and scientific '
                       'simulations), autoboxing overhead becomes prohibitive. Each `Integer` wrapper object requires '
                       '16 bytes of heap memory, plus an 8-byte pointer in the `elementData` array—costing 24 bytes '
                       'per integer instead of 4 bytes! In such high-performance domains, systems architects utilize '
                       'specialized primitive collection libraries such as **Eclipse Collections** or **fastutil**, '
                       'which provide unboxed primitive lists like `IntArrayList` that store raw `int[]` buffers '
                       'directly, reducing memory consumption by up to 80% and unlocking vectorized SIMD hardware '
                       'acceleration.',
            'part': 1,
            'title': 'The Java Collections Framework (JCF) Architecture: Hierarchy, Interfaces & Contracts',
            'tryIt': 'Try calling list.add(index, element) to insert an item at the head of the ArrayList and note the '
                     'O(N) array element shifting cost.'},
           {'checks': [{'answer': 0,
                        'explanation': "ArrayList expands its backing array using the formula 'oldCapacity + "
                                       "(oldCapacity >> 1)', growing capacity by 50% (1.5x).",
                        'options': ['Approximately 1.5x (oldCapacity + (oldCapacity >> 1))',
                                    'Exactly 10x the original size',
                                    'It doubles by 2.0x on every single element added',
                                    'It never grows; attempting to exceed capacity throws an error'],
                        'question': 'By what factor does the backing array of an ArrayList grow when its capacity is '
                                    'exhausted during an add operation?'},
                       {'answer': 0,
                        'explanation': 'System.arraycopy() is a high-speed native memory transfer routine implemented '
                                       'in C++ inside the JVM.',
                        'options': ['System.arraycopy()', 'Thread.sleep()', 'Object.clone()', 'Runtime.gc()'],
                        'question': 'What native method does ArrayList use to transfer elements to a newly allocated '
                                    'backing array during resize?'},
                       {'answer': 0,
                        'explanation': 'Size is the number of elements added (list.size()); capacity is the physical '
                                       'length of elementData on the heap.',
                        'options': ['Size is the count of active elements currently in the list; capacity is the '
                                    'allocated physical length of the backing Object[] array',
                                    'Size is measured in gigabytes; capacity is measured in megabytes',
                                    'Size and capacity are identical synonyms with no distinction',
                                    'Capacity is always smaller than size'],
                        'question': "What is the difference between an ArrayList's 'size' and its 'capacity'?"},
                       {'answer': 0,
                        'explanation': 'Pre-sizing allocates memory in a single heap request, eliminating intermediate '
                                       'array copy operations when populating large lists.',
                        'options': ['To allocate the exact backing array upfront, eliminating costly resizing '
                                    'reallocations and GC pressure',
                                    'To make the ArrayList thread-safe',
                                    'To prevent any elements from ever being removed',
                                    'Because the default constructor is deprecated in modern Java'],
                        'question': "Why should high-throughput applications pre-size ArrayLists using 'new "
                                    "ArrayList<>(expectedSize)'?"}],
            'code': 'import java.util.ArrayList;\n'
                    '\n'
                    'public class ArrayListResizingLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("=== ARRAYLIST RESIZING DEMONSTRATION ===");\n'
                    '\n'
                    '        // Pre-sizing optimization: Allocates exact capacity, avoiding reallocations\n'
                    '        int expectedItems = 15;\n'
                    '        ArrayList<String> list = new ArrayList<>(expectedItems);\n'
                    '\n'
                    '        // Demonstrating dynamic growth formula: oldCapacity + (oldCapacity >> 1)\n'
                    '        int initialCap = 10;\n'
                    '        int nextCap = initialCap + (initialCap >> 1); // 10 + 5 = 15\n'
                    '        int thirdCap = nextCap + (nextCap >> 1);     // 15 + 7 = 22\n'
                    '\n'
                    '        System.out.println("Growth sequence: 10 -> " + nextCap + " -> " + thirdCap);\n'
                    '\n'
                    '        for (int i = 1; i <= 12; i++) {\n'
                    '            list.add("Item-" + i);\n'
                    '        }\n'
                    '        System.out.println("Added 12 items. Size: " + list.size());\n'
                    '    }\n'
                    '}',
            'content': '### 2. `ArrayList` Internal Mechanics: Dynamic Array Growth, Capacity & Memory Layout\n'
                       '\n'
                       'Among all concrete implementations of the `List` interface, **`java.util.ArrayList<E>`** is by '
                       'far the most widely used collection in the Java ecosystem. Understanding its internal memory '
                       'layout and resizing mechanics is vital for writing performant, scalable software.\n'
                       '\n'
                       'Under the hood, `ArrayList` is surprisingly simple: it is not a complex pointer-based '
                       'structure; rather, it is a **dynamically resizing wrapper around a standard Java `Object[]` '
                       'array**. In the JDK source code, the backing store is declared as:\n'
                       '```java\n'
                       'transient Object[] elementData; // Non-private to simplify nested class access\n'
                       'private int size;               // The number of active elements in the list\n'
                       '```\n'
                       '\n'
                       'Notice the critical distinction between **Capacity** and **Size**:\n'
                       '- **Size (`size`)**: The actual number of elements currently stored in the list. This is what '
                       '`list.size()` returns.\n'
                       '- **Capacity (`elementData.length`)**: The physical length of the underlying backing array '
                       'allocated on the heap. Capacity is always greater than or equal to size.\n'
                       '\n'
                       'When you create an empty `ArrayList` using the default constructor (`new ArrayList<>()`), Java '
                       'does not immediately allocate an array of 10 elements. Instead, it assigns `elementData` to a '
                       'shared empty array constant (`DEFAULTCAPACITY_EMPTY_ELEMENTDATA`). This lazy initialization '
                       'optimization ensures that if an application creates thousands of empty lists that never '
                       'receive elements, zero unnecessary array heap memory is consumed.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| ARRAYLIST DYNAMIC MEMORY LAYOUT & 1.5x RESIZE SEQUENCE                            |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| INITIAL STATE (First add element):                                                 |\n'
                       '| elementData = [ "A", null, null, null, null, null, null, null, null, null ]        |\n'
                       '| size = 1, capacity = 10                                                            |\n'
                       '|                                                                                    |\n'
                       '| FULL STATE (size reaches capacity 10):                                             |\n'
                       '| elementData = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" ]                |\n'
                       '| size = 10, capacity = 10                                                           |\n'
                       '|                                                                                    |\n'
                       '| TRIGGER RESIZE (Adding 11th element "K"):                                          |\n'
                       '| 1. Compute new capacity: 10 + (10 >> 1) = 10 + 5 = 15                              |\n'
                       '| 2. Allocate new array: new Object[15]                                              |\n'
                       '| 3. Native copy: System.arraycopy(oldArray, 0, newArray, 0, 10)                     |\n'
                       '| 4. Assign elementData = newArray                                                   |\n'
                       '| elementData = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", ...null ]  |\n'
                       '| size = 11, capacity = 15                                                           |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'When the 11th element is added, the capacity is exhausted (`size == elementData.length`). To '
                       'accommodate the new element, `ArrayList` executes its internal growth algorithm:\n'
                       '```java\n'
                       'int newCapacity = oldCapacity + (oldCapacity >> 1); // 1.5x growth\n'
                       '```\n'
                       'The bitwise shift `oldCapacity >> 1` divides `oldCapacity` by 2 using a single ultra-fast CPU '
                       'instruction. Thus, an array with capacity 10 grows to 15; capacity 15 grows to 22; capacity 22 '
                       'grows to 33, and so on.\n'
                       '\n'
                       'Once the new capacity is calculated, the JVM allocates a brand new `Object[newCapacity]` array '
                       'on the heap and calls **`System.arraycopy()`**. `System.arraycopy()` is a native C++ method '
                       'implemented inside the JVM that uses vectorized hardware memory instructions (such as `memcpy` '
                       'or AVX registers) to transfer blocks of memory in bulk. The old array reference is abandoned '
                       'and eventually reclaimed by the Garbage Collector.\n'
                       '\n'
                       'Because resizing requires copying all $N$ elements into a new array, a single resize operation '
                       'takes $O(N)$ time. However, because resizing occurs exponentially less frequently as the list '
                       'expands, the **amortized time complexity** of appending an element (`list.add(e)`) remains a '
                       'blistering **$O(1)$**. Nevertheless, if you know in advance that you are loading 100,000 '
                       'records from a database, creating `new ArrayList<>(100000)` pre-allocates the backing array in '
                       'a single heap allocation, completely eliminating dozens of intermediate array copies and '
                       'saving massive CPU and GC cycles.',
            'part': 2,
            'title': 'ArrayList Internal Mechanics: Dynamic Array Growth, Capacity & Memory Layout',
            'tryIt': 'Try converting an array to an ArrayList using new ArrayList<>(Arrays.asList(arr)) and verify '
                     'dynamic resizing capability.'},
           {'checks': [{'answer': 0,
                        'explanation': 'Array indexing calculates memory address via pointer offset (baseAddress + '
                                       'index * refSize) in a single CPU cycle.',
                        'options': ['O(1) Constant time due to direct contiguous array memory address computation',
                                    'O(N) Linear time because the JVM must traverse pointers from head to index',
                                    'O(log N) Logarithmic time using binary search',
                                    'O(N^2) Quadratic time due to garbage collection scanning'],
                        'question': 'What is the time complexity of retrieving an element by index using '
                                    'list.get(index) in an ArrayList?'},
                       {'answer': 0,
                        'explanation': 'Inserting at index 0 requires shifting every existing element to the right via '
                                       'System.arraycopy, making it O(N).',
                        'options': ['O(N) Linear time because all existing N elements must be shifted one position to '
                                    'the right',
                                    'O(1) Constant time',
                                    'O(log N) Logarithmic time',
                                    'O(N!) Factorial time'],
                        'question': 'What is the worst-case time complexity of inserting an element at the beginning '
                                    '(index 0) of an ArrayList?'},
                       {'answer': 0,
                        'explanation': 'Structural mutations change modCount; the iterator detects modCount != '
                                       'expectedModCount and immediately fails fast.',
                        'options': ['Because modifying the list alters modCount, causing a mismatch with the '
                                    "iterator's expectedModCount on the next iteration",
                                    'Because the JVM disables memory writes while a loop is running',
                                    'Because ArrayList can only be modified by the Garbage Collector',
                                    'Because for-each loops run in read-only mode at the CPU hardware level'],
                        'question': 'Why does modifying an ArrayList directly inside an enhanced for-each loop trigger '
                                    'ConcurrentModificationException?'},
                       {'answer': 0,
                        'explanation': 'list.removeIf() performs an efficient single-pass in-place compaction '
                                       'algorithm without ConcurrentModificationException risk.',
                        'options': ['list.removeIf(predicate)',
                                    'Using a standard for-loop and ignoring exceptions',
                                    'Deleting the ArrayList and re-creating it',
                                    'Writing a recursive function with Thread.sleep'],
                        'question': 'What is the recommended modern approach (Java 8+) to safely remove elements '
                                    'matching a predicate from an ArrayList?'}],
            'code': 'import java.util.ArrayList;\n'
                    'import java.util.Iterator;\n'
                    'import java.util.List;\n'
                    '\n'
                    'public class ComplexityAndRemovalLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        List<Integer> scores = new ArrayList<>(List.of(85, 42, 95, 60, 72));\n'
                    '        System.out.println("Initial scores: " + scores);\n'
                    '\n'
                    '        // O(1) Positional Random Access: Direct memory address calculation\n'
                    '        int topScore = scores.get(2); // 95\n'
                    '        System.out.println("O(1) access at index 2: " + topScore);\n'
                    '\n'
                    '        // Safe removal using removeIf (Java 8+ single-pass two-pointer algorithm)\n'
                    '        scores.removeIf(score -> score < 70);\n'
                    '        System.out.println("After removeIf (< 70): " + scores); // [85, 95, 72]\n'
                    '\n'
                    '        // Demonstrating iterator safe removal:\n'
                    '        List<String> names = new ArrayList<>(List.of("Alice", "Bob", "Charlie"));\n'
                    '        Iterator<String> it = names.iterator();\n'
                    '        while (it.hasNext()) {\n'
                    '            if (it.next().equals("Bob")) {\n'
                    '                it.remove(); // Safe: updates expectedModCount!\n'
                    '            }\n'
                    '        }\n'
                    '        System.out.println("After iterator removal: " + names); // [Alice, Charlie]\n'
                    '    }\n'
                    '}',
            'content': '### 3. Algorithmic Complexity: Positional Access, Insertions, Deletions & Iteration\n'
                       '\n'
                       'Choosing the right data structure requires an intimate understanding of algorithmic time '
                       'complexities and CPU memory cache characteristics. Let us analyze how `ArrayList` performs '
                       'across fundamental computer science operations.\n'
                       '\n'
                       '**1. Positional Random Access: $O(1)$ Constant Time**\n'
                       'When you call `list.get(index)` or `list.set(index, element)`, `ArrayList` executes in '
                       'strictly $O(1)$ time. Because the underlying array occupies a single contiguous block of '
                       'physical RAM, the JVM computes the exact memory address of any element using direct pointer '
                       'arithmetic:\n'
                       '$$\\text{Target Address} = \\text{Base Address} + (\\text{index} \\times \\text{Reference '
                       'Size})$$\n'
                       'The CPU calculates this offset in a single clock cycle and fetches the data directly into '
                       'L1/L2 hardware CPU caches. This cache locality makes `ArrayList` significantly faster than '
                       'linked structures in real-world benchmarks.\n'
                       '\n'
                       '**2. Appending Elements at the End: Amortized $O(1)$**\n'
                       'Calling `list.add(element)` places the element at `elementData[size++]`. Unless a resize is '
                       'triggered, this involves a single array write and integer increment. As proven mathematically, '
                       'the amortized cost per append across $N$ insertions is $O(1)$.\n'
                       '\n'
                       '**3. Arbitrary Insertions and Deletions: $O(N)$ Linear Time**\n'
                       'When you insert or remove an element from the beginning or middle of an `ArrayList`:\n'
                       '```java\n'
                       'list.add(0, "First");  // Inserts at the head\n'
                       'list.remove(5);        // Deletes element at index 5\n'
                       '```\n'
                       'Every single element located to the right of the insertion or deletion point must be '
                       'physically shifted by one position using `System.arraycopy()`. In the worst-case scenario '
                       '(inserting or removing at index 0), all $N$ elements must be shifted. Therefore, middle '
                       'insertions and deletions scale linearly with $O(N)$ complexity.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| ARRAYLIST TIME COMPLEXITY SUMMARY TABLE                                            |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| OPERATION                | METHOD                     | TIME COMPLEXITY           |\n'
                       '| ------------------------ | -------------------------- | ------------------------- |\n'
                       '| Positional Read          | list.get(index)            | O(1) Constant             |\n'
                       '| Positional Write         | list.set(index, elem)      | O(1) Constant             |\n'
                       '| Append to End            | list.add(elem)             | O(1) Amortized            |\n'
                       '| Insert at Index          | list.add(index, elem)      | O(N) Linear               |\n'
                       '| Delete from Index        | list.remove(index)         | O(N) Linear               |\n'
                       '| Search by Value          | list.indexOf(elem)         | O(N) Linear Scan          |\n'
                       '| Contains Value           | list.contains(elem)        | O(N) Linear Scan          |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       '**4. The ConcurrentModificationException Hazard & Safe Iteration**\n'
                       'A notorious bug encountered by developers is modifying a list while iterating over it:\n'
                       '```java\n'
                       '// SEVERE BUG: Throws ConcurrentModificationException!\n'
                       'for (Integer score : list) {\n'
                       '    if (score < 50) {\n'
                       '        list.remove(score); // Modifying list during enhanced for-loop iteration!\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       'Why does this happen? Under the hood, the enhanced for-loop compiles into an explicit '
                       '`Iterator<Integer>`. The `ArrayList` class maintains an internal counter called **`modCount`** '
                       'that increments every time a structural modification (add or remove) occurs. When the iterator '
                       'is created, it records `expectedModCount = modCount`. On every call to `iterator.next()`, the '
                       'iterator verifies `if (modCount != expectedModCount) throw new '
                       'ConcurrentModificationException()`. Calling `list.remove()` directly alters `modCount`, '
                       'desynchronizing the iterator and triggering the exception.\n'
                       '\n'
                       'To safely remove elements during iteration in modern Java, use:\n'
                       '1. **Explicit Iterator removal**:\n'
                       '   ```java\n'
                       '   Iterator<Integer> it = list.iterator();\n'
                       '   while (it.hasNext()) {\n'
                       '       if (it.next() < 50) {\n'
                       '           it.remove(); // Safely updates both modCount and expectedModCount!\n'
                       '       }\n'
                       '   }\n'
                       '   ```\n'
                       '2. **The Modern `removeIf` method (Java 8+)**:\n'
                       '   ```java\n'
                       '   list.removeIf(score -> score < 50); // High-performance single-pass in-place removal\n'
                       '   ```\n'
                       '`removeIf` utilizes a two-pointer compaction algorithm that shifts elements in a single $O(N)$ '
                       'pass, avoiding both multiple shifts and `ConcurrentModificationException`.\n'
                       '\n'
                       'Another valuable method provided by `ArrayList` for memory optimization is **`trimToSize()`**. '
                       'If an application builds a large list of 100,000 elements and then removes 80,000 of them, the '
                       'underlying `elementData` array remains at capacity 100,000! By calling `list.trimToSize()`, '
                       'the list allocates a new array sized exactly to the current `size` (20,000), allowing the '
                       'Garbage Collector to reclaim the 80,000 unused references.\n'
                       '\n'
                       'Additionally, be aware of the view semantics of **`list.subList(int fromIndex, int '
                       'toIndex)`**. The `subList` method does NOT create a new independent copy of the list. Instead, '
                       'it returns a lightweight view window backed by the original `ArrayList`. Any structural '
                       'changes made to the parent list directly (such as adding or removing elements) immediately '
                       'invalidate the sublist view, causing subsequent operations on the sublist to throw '
                       '`ConcurrentModificationException`. Always treat sublists as short-lived, transient views.',
            'part': 3,
            'title': 'Algorithmic Complexity: Positional Access, Insertions, Deletions & Iteration',
            'tryIt': 'Try removing elements from an ArrayList inside a standard for-each loop and observe the '
                     'ConcurrentModificationException.'},
           {'checks': [{'answer': 0,
                        'explanation': 'ArrayList has no internal synchronization locks; concurrent updates cause data '
                                       'races and corrupted internal arrays.',
                        'options': ['It lacks internal synchronization, leading to race conditions, lost updates, and '
                                    'corrupted size/indices',
                                    'The JVM terminates the operating system whenever two threads access the same '
                                    'class',
                                    'It automatically converts all strings into raw binary integers',
                                    'It is restricted by Java security policies to run only on single-core CPUs'],
                        'question': 'Why is java.util.ArrayList unsafe to modify concurrently from multiple threads '
                                    'without synchronization?'},
                       {'answer': 0,
                        'explanation': 'List.of() is truly immutable, compact (specialized List12 types avoid array '
                                       'allocation for 1-2 items), and prevents null elements.',
                        'options': ['List.of returns a truly immutable, compact object that allocates zero spare array '
                                    'capacity and rejects nulls',
                                    'List.of runs on the graphics card GPU',
                                    'List.of allows modifying elements without changing the size',
                                    'List.of is compatible with Java 1.0'],
                        'question': 'What is a major advantage of List.of() (Java 9+) over '
                                    'Collections.unmodifiableList(new ArrayList<>())?'},
                       {'answer': 0,
                        'explanation': 'CopyOnWriteArrayList provides lock-free instant reads, making it ideal when '
                                       'reads occur frequently and mutations are rare.',
                        'options': ['In read-heavy concurrent scenarios where reads vastly outnumber writes (e.g. '
                                    'event listener registries)',
                                    'In write-heavy batch logging systems',
                                    'When sorting arrays with billions of numbers',
                                    'When allocating off-heap native memory buffers'],
                        'question': 'When is CopyOnWriteArrayList an optimal architectural choice?'},
                       {'answer': 0,
                        'explanation': "LinkedList's node pointer chasing causes severe CPU cache misses, whereas "
                                       "ArrayList's contiguous memory ensures optimal L1/L2 cache locality.",
                        'options': ['LinkedList nodes are scattered across the heap, causing severe CPU cache misses '
                                    'and 24 bytes of pointer overhead per node',
                                    'LinkedList cannot store strings',
                                    'LinkedList only runs on 32-bit JVMs',
                                    'LinkedList was removed from the Java language specification'],
                        'question': 'Why is LinkedList generally considered an anti-pattern compared to ArrayList on '
                                    'modern CPU hardware?'}],
            'code': 'import java.util.ArrayList;\n'
                    'import java.util.Collections;\n'
                    'import java.util.List;\n'
                    'import java.util.concurrent.CopyOnWriteArrayList;\n'
                    '\n'
                    'public class ThreadSafetyAndImmutableLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        // Modern truly immutable list (Java 9+ List.of): compact, zero array overhead for <= 2 '
                    'items\n'
                    '        List<String> immutableList = List.of("USD", "EUR", "GBP");\n'
                    '        System.out.println("Immutable List: " + immutableList);\n'
                    '        try {\n'
                    '            immutableList.add("JPY"); // Throws UnsupportedOperationException\n'
                    '        } catch (UnsupportedOperationException e) {\n'
                    '            System.out.println("Verified: List.of is strictly immutable and cannot be '
                    'modified!");\n'
                    '        }\n'
                    '\n'
                    '        // Thread-safe copy-on-write list for read-heavy environments:\n'
                    '        List<String> cowList = new CopyOnWriteArrayList<>();\n'
                    '        cowList.add("ServiceA");\n'
                    '        cowList.add("ServiceB");\n'
                    '        System.out.println("CopyOnWriteArrayList: " + cowList);\n'
                    '    }\n'
                    '}',
            'content': '### 4. Production Best Practices: Thread Safety, Immutability & List Variants\n'
                       '\n'
                       'In enterprise software engineering, choosing the appropriate list variant and enforcing thread '
                       'safety invariants is essential for building resilient, concurrent systems.\n'
                       '\n'
                       'First and foremost: **`java.util.ArrayList` is fundamentally NOT thread-safe**. If multiple '
                       'threads access an `ArrayList` concurrently, and at least one thread modifies it structurally, '
                       'the list state will become corrupted. Common symptoms of unsynchronized concurrent access '
                       'include:\n'
                       '- `ArrayIndexOutOfBoundsException` during `add()`: Two threads see `size = 9` in an array of '
                       'capacity 10, both write to index 9, and one increments `size` to 10 while the other attempts '
                       'to write to index 10 without resizing!\n'
                       '- Torn writes and lost elements: Elements overwritten due to race conditions.\n'
                       '- Infinite loops inside internal iterators.\n'
                       '\n'
                       'When thread safety is required, enterprise architectures employ three distinct strategies:\n'
                       '1. **Thread-Safe Synchronized Wrappers**:\n'
                       '   ```java\n'
                       '   List<String> syncList = Collections.synchronizedList(new ArrayList<>());\n'
                       '   ```\n'
                       '   This wraps the list in a proxy that synchronizes every method on a common intrinsic lock '
                       '(`mutex`). While safe, it serializes all reads and writes, creating severe thread contention '
                       'under high concurrency.\n'
                       '2. **CopyOnWriteArrayList (`java.util.concurrent`)**:\n'
                       '   ```java\n'
                       '   List<String> cowList = new CopyOnWriteArrayList<>();\n'
                       '   ```\n'
                       '   `CopyOnWriteArrayList` is a thread-safe variant where every mutative operation (`add`, '
                       '`set`, `remove`) creates a completely fresh copy of the underlying array. Read operations '
                       '(`get()`) proceed lock-free and never block! This structure is optimal for event listener '
                       'registries and read-heavy configurations where reads outnumber writes by 100:1.\n'
                       '3. **Immutable and Unmodifiable Lists (Modern Java Standards)**:\n'
                       '   In modern microservices, shared mutable state is actively discouraged. Instead, components '
                       'pass unmodifiable views or truly immutable list snapshots:\n'
                       '   - **Java 9+ `List.of(e1, e2, ...)`**: Creates a truly immutable, highly compact list. It '
                       'rejects `null` elements (throws `NullPointerException`) and consumes significantly less memory '
                       'than `ArrayList` by using specialized internal types (`List12` for 1-2 elements, `ListN` for '
                       'more). Any attempt to call `add()` or `remove()` throws `UnsupportedOperationException`.\n'
                       '   - **Java 10+ `List.copyOf(existingCollection)`**: Creates an unmodifiable defensive copy of '
                       'an existing collection.\n'
                       '   - **`Collections.unmodifiableList(mutableList)`**: Wraps an existing list. Beware: if the '
                       'underlying `mutableList` is modified elsewhere, the change is reflected in the unmodifiable '
                       'view!\n'
                       '\n'
                       'Finally, let us address the perennial question: **`ArrayList` vs `LinkedList`**. In academic '
                       'textbooks, `LinkedList` is often touted for $O(1)$ head insertions. However, in modern '
                       'computer hardware architectures, **`LinkedList` is virtually always an anti-pattern**. Each '
                       'node in a `LinkedList` requires 24 bytes of heap overhead (object header + previous pointer + '
                       'next pointer) in addition to the data reference. Even worse, linked nodes are scattered '
                       'randomly across the heap, causing catastrophic CPU cache misses during traversal. In virtually '
                       'every real-world benchmark, `ArrayList` dramatically outperforms `LinkedList`, even for '
                       'operations involving moderate middle insertions.\n'
                       '\n'
                       'To understand why `List.of()` is vastly superior to `Collections.unmodifiableList(new '
                       'ArrayList<>())`, consider their internal object architectures:\n'
                       '- `Collections.unmodifiableList` wraps a mutable list instance. It requires two distinct heap '
                       'objects: the wrapper object itself, and the underlying `ArrayList` (which in turn holds an '
                       '`Object[]` array). Even worse, if external code retains a reference to the underlying mutable '
                       '`ArrayList`, it can mutate the data, compromising the integrity of the unmodifiable view!\n'
                       '- In contrast, `List.of()` returns a truly immutable, compact representation. For 0 elements, '
                       'it returns a static singleton `ImmutableCollections.EMPTY_LIST`. For 1 or 2 elements, it '
                       'instantiates specialized classes `List12` with dedicated fields `e0` and `e1`, requiring '
                       '**zero backing array allocation**! For 3 or more elements, it stores items in a single compact '
                       '`Object[]` array with zero spare capacity. It also enforces non-nullability, immediately '
                       'rejecting null elements.\n'
                       '\n'
                       'In ultra-high concurrency systems where multiple threads need to accumulate batch items '
                       'without lock contention, a proven pattern is **Thread-Confined Buffers** using '
                       '`ThreadLocal<ArrayList<T>>`. Each worker thread appends items to its own private, '
                       "unsynchronized `ArrayList` with zero locking overhead. Once a thread's buffer reaches a "
                       'threshold (e.g. 500 items), the thread flushes the entire batch to a persistent message queue '
                       'in a single atomic transaction. This pattern achieves millions of operations per second while '
                       'avoiding all lock contention.',
            'part': 4,
            'title': 'Production Best Practices: Thread Safety, Immutability & List Variants',
            'tryIt': "Try safely removing elements matching a predicate using the collection's removeIf(item -> item < "
                     'cutoff) method.'},
           {'checks': [{'answer': 0,
                        'explanation': 'Scores 85, 95, and 72 are strictly greater than 70; they are added to the '
                                       'ArrayList in sequential order.',
                        'options': ['An ArrayList<Integer> containing [85, 95, 72]',
                                    'An array containing [85, 42, 95, 60, 72]',
                                    'A single integer representing the average score',
                                    'An empty list because 70 is greater than 60'],
                        'question': 'In the Day 25 filterAbove challenge, what does filterAbove(new int[]{85, 42, 95, '
                                    '60, 72}, 70) return?'},
                       {'answer': 0,
                        'explanation': "The defensive guard 'if (scores == null) return result;' returns an empty "
                                       'ArrayList, avoiding a NullPointerException.',
                        'options': ['An empty ArrayList<Integer> with size 0',
                                    'Throws a NullPointerException',
                                    'Returns null',
                                    'Returns [-1]'],
                        'question': 'What does Solution.filterAbove(null, 50) return when protected by a defensive '
                                    'guard?'},
                       {'answer': 0,
                        'explanation': "createList instantiates an ArrayList, adds 'Java' at index 0, adds 'Spring' at "
                                       'index 1, and returns the 2-element list.',
                        'options': ["An ArrayList<String> containing ['Java', 'Spring'] with size 2",
                                    "A single concatenated string 'JavaSpring'",
                                    'An array of characters',
                                    'An empty list'],
                        'question': "In the Day 25 createList assignment, what does createList('Java', 'Spring') "
                                    'return?'},
                       {'answer': 0,
                        'explanation': 'Standard ArrayList allows null elements, storing null cleanly at index 1.',
                        'options': ["Returns an ArrayList containing ['Java', null], as ArrayList accepts null "
                                    'elements',
                                    'Throws a NullPointerException',
                                    'Replaces null with an empty string',
                                    'Terminates the program'],
                        'question': "What happens if createList('Java', null) is called?"}],
            'code': 'import java.util.ArrayList;\n'
                    '\n'
                    'public class SolutionLab {\n'
                    '    public static class Solution {\n'
                    '        public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {\n'
                    '            ArrayList<Integer> result = new ArrayList<>();\n'
                    '            if (scores == null) return result;\n'
                    '            for (int score : scores) {\n'
                    '                if (score > cutoff) {\n'
                    '                    result.add(score); // Autoboxed int -> Integer\n'
                    '                }\n'
                    '            }\n'
                    '            return result;\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    public static class SolutionAdv {\n'
                    '        public static ArrayList<String> createList(String a, String b) {\n'
                    '            ArrayList<String> list = new ArrayList<>();\n'
                    '            list.add(a);\n'
                    '            list.add(b);\n'
                    '            return list;\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        int[] scores = {85, 42, 95, 60, 72};\n'
                    '        ArrayList<Integer> filtered = Solution.filterAbove(scores, 70);\n'
                    '        System.out.println("filterAbove result: " + filtered); // [85, 95, 72]\n'
                    '\n'
                    '        ArrayList<String> created = SolutionAdv.createList("Java", "Spring");\n'
                    '        System.out.println("createList result:  " + created);  // [Java, Spring]\n'
                    '        System.out.println("created.get(0): " + created.get(0));\n'
                    '        System.out.println("created.get(1): " + created.get(1));\n'
                    '    }\n'
                    '}',
            'content': '### 5. Guided Coding Lab & Milestone Verification: Building `filterAbove` and `createList`\n'
                       '\n'
                       'To conclude Day 25, we implement and thoroughly verify the two dynamic list challenges '
                       'specified in the PinIT Career OS curriculum: **`filterAbove`** and **`createList`**.\n'
                       '\n'
                       'In the primary challenge, we implement `Solution.filterAbove(int[] scores, int cutoff)`. The '
                       'specification requires taking an array of primitive integers `scores` and a threshold integer '
                       '`cutoff`, filtering all scores that are **strictly greater than `cutoff`** (`score > cutoff`), '
                       'storing them in an `ArrayList<Integer>`, and returning the resulting dynamic list.\n'
                       '\n'
                       '```java\n'
                       '// ============================================================================\n'
                       '// CHALLENGE 1: FILTER HIGH SCORES\n'
                       '// ============================================================================\n'
                       'import java.util.ArrayList;\n'
                       '\n'
                       'public class Solution {\n'
                       '    /**\n'
                       '     * Filters an array of scores, returning an ArrayList<Integer>\n'
                       '     * containing only the scores strictly greater than the cutoff.\n'
                       '     */\n'
                       '    public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {\n'
                       '        // Step 1: Instantiate the dynamic list result container:\n'
                       '        ArrayList<Integer> result = new ArrayList<>();\n'
                       '\n'
                       '        // Step 2: Defensive guard for null array input:\n'
                       '        if (scores == null) {\n'
                       '            return result;\n'
                       '        }\n'
                       '\n'
                       '        // Step 3: Iterate through primitive scores array:\n'
                       '        for (int score : scores) {\n'
                       '            if (score > cutoff) {\n'
                       '                // Step 4: Add passing score (autoboxed from int to Integer):\n'
                       '                result.add(score);\n'
                       '            }\n'
                       '        }\n'
                       '\n'
                       '        // Step 5: Return the populated ArrayList:\n'
                       '        return result;\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Let us trace the execution dynamics across standard and edge-case inputs:\n'
                       '- **Trace 1 (Standard Filtering)**:\n'
                       '  `scores = [85, 42, 95, 60, 72]`, `cutoff = 70`.\n'
                       '  - Check 85: `85 > 70` is `true` $\to$ `result.add(85)`. `result = [85]`.\n'
                       '  - Check 42: `42 > 70` is `false` $\to$ skipped.\n'
                       '  - Check 95: `95 > 70` is `true` $\to$ `result.add(95)`. `result = [85, 95]`.\n'
                       '  - Check 60: `60 > 70` is `false` $\to$ skipped.\n'
                       '  - Check 72: `72 > 70` is `true` $\to$ `result.add(72)`. `result = [85, 95, 72]`.\n'
                       '  - Returns `[85, 95, 72]` with `result.size() == 3`.\n'
                       '- **Trace 2 (Exact Cutoff Boundary)**:\n'
                       '  `scores = [70, 71]`, `cutoff = 70`.\n'
                       '  - Check 70: `70 > 70` is `false` (strictly greater requirement). Not added.\n'
                       '  - Check 71: `71 > 70` is `true`. Added.\n'
                       '  - Returns `[71]`.\n'
                       '- **Trace 3 (No Matching Scores)**:\n'
                       '  `scores = [10, 20, 30]`, `cutoff = 50`. Returns empty list `[]` with `size == 0`.\n'
                       '- **Trace 4 (Null Input)**:\n'
                       '  `scores = null`. The defensive guard immediately returns an empty `ArrayList<Integer>`, '
                       'avoiding a `NullPointerException`.\n'
                       '\n'
                       'In the advanced assignment, we implement `SolutionAdv.createList(String a, String b)`. The '
                       'contract mandates taking two string arguments `a` and `b`, constructing a new '
                       '`ArrayList<String>`, appending element `a` followed by element `b`, and returning the list.\n'
                       '\n'
                       '```java\n'
                       '// ============================================================================\n'
                       '// CHALLENGE 2: ADD AND GET LIST ELEMENTS\n'
                       '// ============================================================================\n'
                       'import java.util.ArrayList;\n'
                       '\n'
                       'public class SolutionAdv {\n'
                       '    /**\n'
                       '     * Constructs an ArrayList<String> containing elements a and b in sequential order.\n'
                       '     */\n'
                       '    public static ArrayList<String> createList(String a, String b) {\n'
                       '        ArrayList<String> list = new ArrayList<>();\n'
                       '        list.add(a); // Appends element a at index 0\n'
                       '        list.add(b); // Appends element b at index 1\n'
                       '        return list;\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Let us verify the properties of `createList`:\n'
                       '- Invoking `createList("Java", "Spring")` allocates an `ArrayList<String>`, stores `"Java"` at '
                       'index 0, stores `"Spring"` at index 1, and returns the list.\n'
                       '- `list.get(0)` evaluates to `"Java"`.\n'
                       '- `list.get(1)` evaluates to `"Spring"`.\n'
                       '- `list.size()` evaluates to `2`.\n'
                       '- If either string is `null` (e.g. `createList("Java", null)`), `ArrayList` gracefully accepts '
                       'the `null` reference, storing `null` at index 1, consistent with the standard `List` '
                       'contract.\n'
                       '\n'
                       'Both implementations satisfy all curriculum specifications and pass all automated test '
                       'validations with zero regressions.\n'
                       '\n'
                       'In professional enterprise testing with JUnit 5 and AssertJ, verifying collections goes beyond '
                       'checking basic equality:\n'
                       '```java\n'
                       '@Test\n'
                       'void testFilterAboveComprehensive() {\n'
                       '    int[] scores = {85, 42, 95, 60, 72};\n'
                       '    ArrayList<Integer> filtered = Solution.filterAbove(scores, 70);\n'
                       '\n'
                       '    // Verify size and exact element ordering:\n'
                       '    assertEquals(3, filtered.size());\n'
                       '    assertIterableEquals(List.of(85, 95, 72), filtered);\n'
                       '\n'
                       '    // AssertJ fluent assertion:\n'
                       '    assertThat(filtered)\n'
                       '        .hasSize(3)\n'
                       '        .containsExactly(85, 95, 72)\n'
                       '        .doesNotContain(42, 60);\n'
                       '}\n'
                       '```\n'
                       'Notice how `containsExactly` verifies both membership and sequential order in a single fluent '
                       'assertion. By validating both happy paths and edge cases (such as all scores failing the '
                       'cutoff or empty arrays), you ensure the utility is completely robust and production-ready.',
            'part': 5,
            'title': 'Guided Coding Lab & Milestone Verification: Building filterAbove and createList',
            'tryIt': 'Try pre-sizing the ArrayList using new ArrayList<>(1000) to eliminate internal array copy '
                     'overhead during heavy insertions.'}],
 'projectStep': {'steps': ['Author Solution.filterAbove(int[] scores, int cutoff) returning an ArrayList<Integer> of '
                           'scores > cutoff.',
                           'Handle null and empty array inputs defensively by returning an empty ArrayList.',
                           'Author SolutionAdv.createList(String a, String b) returning an ArrayList<String> '
                           'containing elements a and b.',
                           'Verify filterAbove([85, 42, 95, 60, 72], 70) returns [85, 95, 72] with exact ordering '
                           'preserved.'],
                 'title': 'Build the Dynamic Score Filtering and List Factory Engine'},
 'recap': 'Yesterday we mastered active exception throwing, precondition verification, and custom exception design. '
          'Today, we step into the Java Collections Framework (JCF), exploring dynamic lists, ArrayList internal '
          'mechanics, 1.5x resizing, and algorithmic complexities.',
 'summary': ['The Java Collections Framework separates abstract contracts (Collection, List, Set, Queue) from concrete '
             'algorithmic data structures.',
             'ArrayList is a dynamic array backed by a contiguous Object[] array on the heap.',
             'When full, ArrayList expands by approximately 1.5x via System.arraycopy, providing amortized O(1) '
             'appends.',
             'Positional access (get/set) is strictly O(1) constant time, while arbitrary insertions/deletions require '
             'O(N) element shifts.',
             'ArrayList is not thread-safe; iterating while structurally mutating throws '
             'ConcurrentModificationException.',
             'The filterAbove and createList challenges verify dynamic list construction, conditional filtering, and '
             'autoboxing.'],
 'title': 'Java Collections Framework I: Dynamic Lists & ArrayList Fundamentals'}
