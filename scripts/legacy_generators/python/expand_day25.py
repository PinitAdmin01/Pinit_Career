with open("scripts/build_day25_full.py", "r", encoding="utf-8") as f:
    text = f.read()

extra_p1 = """
A critical underlying mechanism of Java collections is **Type Erasure**. When generics were introduced in Java 5, Java maintained backward compatibility with legacy raw types (`ArrayList`). At compile time, `javac` verifies that you only add `Integer` objects to `ArrayList<Integer>`. But when translating to bytecode, the type parameter `<Integer>` is completely erased! The backing array is simply `Object[]`, and whenever you call `list.get(index)`, the compiler automatically inserts a synthetic `checkcast` bytecode instruction: `(Integer) elementData[index]`.

Furthermore, for applications processing hundreds of millions of numerical records (such as high-frequency trading platforms, algorithmic telemetry pipelines, and scientific simulations), autoboxing overhead becomes prohibitive. Each `Integer` wrapper object requires 16 bytes of heap memory, plus an 8-byte pointer in the `elementData` array—costing 24 bytes per integer instead of 4 bytes! In such high-performance domains, systems architects utilize specialized primitive collection libraries such as **Eclipse Collections** or **fastutil**, which provide unboxed primitive lists like `IntArrayList` that store raw `int[]` buffers directly, reducing memory consumption by up to 80% and unlocking vectorized SIMD hardware acceleration.
"""

extra_p3 = """
Another valuable method provided by `ArrayList` for memory optimization is **`trimToSize()`**. If an application builds a large list of 100,000 elements and then removes 80,000 of them, the underlying `elementData` array remains at capacity 100,000! By calling `list.trimToSize()`, the list allocates a new array sized exactly to the current `size` (20,000), allowing the Garbage Collector to reclaim the 80,000 unused references.

Additionally, be aware of the view semantics of **`list.subList(int fromIndex, int toIndex)`**. The `subList` method does NOT create a new independent copy of the list. Instead, it returns a lightweight view window backed by the original `ArrayList`. Any structural changes made to the parent list directly (such as adding or removing elements) immediately invalidate the sublist view, causing subsequent operations on the sublist to throw `ConcurrentModificationException`. Always treat sublists as short-lived, transient views.
"""

extra_p4 = """
To understand why `List.of()` is vastly superior to `Collections.unmodifiableList(new ArrayList<>())`, consider their internal object architectures:
- `Collections.unmodifiableList` wraps a mutable list instance. It requires two distinct heap objects: the wrapper object itself, and the underlying `ArrayList` (which in turn holds an `Object[]` array). Even worse, if external code retains a reference to the underlying mutable `ArrayList`, it can mutate the data, compromising the integrity of the unmodifiable view!
- In contrast, `List.of()` returns a truly immutable, compact representation. For 0 elements, it returns a static singleton `ImmutableCollections.EMPTY_LIST`. For 1 or 2 elements, it instantiates specialized classes `List12` with dedicated fields `e0` and `e1`, requiring **zero backing array allocation**! For 3 or more elements, it stores items in a single compact `Object[]` array with zero spare capacity. It also enforces non-nullability, immediately rejecting null elements.

In ultra-high concurrency systems where multiple threads need to accumulate batch items without lock contention, a proven pattern is **Thread-Confined Buffers** using `ThreadLocal<ArrayList<T>>`. Each worker thread appends items to its own private, unsynchronized `ArrayList` with zero locking overhead. Once a thread's buffer reaches a threshold (e.g. 500 items), the thread flushes the entire batch to a persistent message queue in a single atomic transaction. This pattern achieves millions of operations per second while avoiding all lock contention.
"""

extra_p5 = """
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

# Replace in text
text = text.replace(
    'enterprise engineers must consider when storing millions of numbers.\n"""',
    'enterprise engineers must consider when storing millions of numbers.\n' + extra_p1 + '\n"""'
)

text = text.replace(
    '`removeIf` utilizes a two-pointer compaction algorithm that shifts elements in a single $O(N)$ pass, avoiding both multiple shifts and `ConcurrentModificationException`.\n"""',
    '`removeIf` utilizes a two-pointer compaction algorithm that shifts elements in a single $O(N)$ pass, avoiding both multiple shifts and `ConcurrentModificationException`.\n' + extra_p3 + '\n"""'
)

text = text.replace(
    'In virtually every real-world benchmark, `ArrayList` dramatically outperforms `LinkedList`, even for operations involving moderate middle insertions.\n"""',
    'In virtually every real-world benchmark, `ArrayList` dramatically outperforms `LinkedList`, even for operations involving moderate middle insertions.\n' + extra_p4 + '\n"""'
)

text = text.replace(
    'Both implementations satisfy all curriculum specifications and pass all automated test validations with zero regressions.\n"""',
    'Both implementations satisfy all curriculum specifications and pass all automated test validations with zero regressions.\n' + extra_p5 + '\n"""'
)

with open("scripts/build_day25_full.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated build_day25_full.py with expansions")
