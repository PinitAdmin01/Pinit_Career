import sys
import pprint

p1_content = """### 1. The Evolution of Type Safety: From Raw Types and Manual Casting to Java Generics

In the foundational releases of the Java programming language (Java 1.0 through Java 1.4), data structures suffered from a profound architectural vulnerability: **the total absence of compile-time type safety**. When the Java Collections Framework debuted in Java 2, collections like `ArrayList`, `Vector`, and `HashMap` were designed to hold elements of type `java.lang.Object`. Because every non-primitive type in Java implicitly inherits from `Object`, any object could be inserted into any collection without restriction.

While this universal polymorphism provided flexibility, it created a notorious developer hazard: **Runtime ClassCastExceptions**. Consider a legacy financial portfolio tracker written in Java 1.4:
```java
// Legacy Java 1.4 Raw Collection:
List accountBalances = new ArrayList();
accountBalances.add(new Double(15000.50));
accountBalances.add(new Double(4200.00));
accountBalances.add("MALICIOUS_OR_ACCIDENTAL_STRING"); // Compiles cleanly!

// At retrieval time, the developer is forced to write manual casts:
for (int i = 0; i < accountBalances.size(); i++) {
    Double balance = (Double) accountBalances.get(i); // CRASH on index 2!
}
```
In this legacy architecture, the compiler was completely blind to what kind of data the collection was supposed to contain. When execution reached index 2, the attempt to cast a `String` into a `Double` threw a catastrophic `java.lang.ClassCastException` at runtime! In enterprise banking and aerospace software, runtime casting crashes in production environments were unacceptable.

To eradicate this entire category of defects, Java 5 introduced **Generics** (JSR 14). Generics revolutionized the language by introducing **Type Parameterization**. Instead of storing raw `Object` references, collections and container classes can be parameterized with specific type arguments:
```java
List<Double> accountBalances = new ArrayList<Double>();
accountBalances.add(15000.50); // Autoboxed cleanly
// accountBalances.add("ILLEGAL_STRING"); // COMPILE-TIME ERROR!
```
Notice the profound paradigm shift: **Type safety moved from runtime execution to compile time!** If an engineer attempts to insert a `String` into a `List<Double>`, the `javac` compiler immediately rejects the code with a compile-time error: `incompatible types: String cannot be converted to Double`. The bug is caught instantly inside the IDE, before the code is ever committed, built, or deployed to production servers.

Furthermore, Java 7 enhanced generics by introducing **Type Inference with the Diamond Operator (`<>`)**. Instead of redundantly writing `List<Double> list = new ArrayList<Double>()`, developers write `List<Double> list = new ArrayList<>()`. The compiler automatically infers the type parameter of the constructor from the variable declaration on the left-hand side, eliminating visual clutter while maintaining 100% compile-time type safety.

A critical topic when managing large legacy codebases is **Raw Type Interoperability and Heap Pollution**. Although modern Java strictly discourages raw types, the compiler still permits declaring `List raw = new ArrayList();` without angle brackets. Why? To maintain 100% binary backward compatibility with millions of lines of legacy code written before 2004. However, mixing raw types with parameterized types introduces severe hazards:
```java
List<String> stringList = new ArrayList<>();
List rawList = stringList; // Permitted with compiler warning
rawList.add(Integer.valueOf(99)); // HEAP POLLUTION: Injected an Integer into a List<String>!
String item = stringList.get(0); // RUNTIME ClassCastException: Integer cannot be cast to String!
```
This catastrophic scenario is formally designated as **Heap Pollution**: a situation where a variable of a parameterized type refers to an object that is not of that parameterized type. To catch heap pollution before it enters production, enterprise build systems (like Maven and Gradle) configure compiler flags: `-Xlint:unchecked` and `-Werror`. These flags treat unchecked raw type warnings as fatal compilation failures. If an engineer must interact with a legacy library that returns raw types, they isolate the cast within a tightly scoped helper method and annotate it explicitly with `@SuppressWarnings("unchecked")`, accompanied by an architectural comment explaining why the cast is mathematically guaranteed to be safe.

"""

p2_content = """### 2. Generic Classes, Methods & Type Parameter Conventions

In modern enterprise software engineering, generics are not restricted merely to standard library collections like `List` and `Map`. Architects frequently design **Generic Classes**, **Generic Interfaces**, and **Generic Methods** to create reusable, type-safe software models that operate uniformly across diverse data domains.

To maintain clarity and consistency across the global software industry, Java developers adhere strictly to standard **Type Parameter Naming Conventions**:
- **`T`** stands for **Type** (general-purpose type parameter).
- **`E`** stands for **Element** (used extensively by the Collections Framework, e.g. `List<E>`, `Set<E>`).
- **`K`** stands for **Key** (used in mapping structures, e.g. `Map<K, V>`).
- **`V`** stands for **Value** (used in mapping structures and pair containers).
- **`N`** stands for **Number** (used for numerical algorithms).
- **`R`** stands for **Result** or **Return** (used in functional programming and pipelines).

Let us examine how to construct a multi-parameter generic container: the classic **`Pair<K, V>`** container:
```java
public class Pair<K, V> {
    private final K key;
    private final V val;

    public Pair(K key, V val) {
        this.key = key;
        this.val = val;
    }

    public K getKey() {
        return this.key;
    }

    public V getVal() {
        return this.val;
    }
}
```

Notice the elegant architectural properties of `Pair<K, V>`:
1. **Universal Reusability**: The single `Pair` class blueprint can represent a user ID and balance (`Pair<String, Double>`), a geographic coordinate (`Pair<Double, Double>`), or an error code and message (`Pair<Integer, String>`).
2. **Compile-Time Contract Enforcement**: When an engineer declares `Pair<String, Integer> p = new Pair<>("Age", 22);`, the compiler guarantees that `p.getKey()` returns a strongly-typed `String` and `p.getVal()` returns an `Integer`. No manual type casting (`(Integer)`) is ever required by the caller!
3. **Immutability and Encapsulation**: By declaring `private final K key;` and `private final V val;`, the internal state cannot be corrupted after construction.

In addition to generic classes, Java allows declaring **Generic Methods**. A generic method introduces its own type parameters independently of whether the enclosing class is generic or not. The type parameter is declared **before the method return type**:
```java
public class UtilityContainer {
    // Generic static factory method:
    public static <T> Box<T> wrap(T item) {
        Box<T> box = new Box<>();
        box.set(item);
        return box;
    }
}
```
When calling `UtilityContainer.wrap("Present")`, the compiler uses target typing to automatically infer that `T` is `String`, returning a strongly-typed `Box<String>` without any explicit type arguments required at the call site.

Another advanced architectural pattern is **Generic Interfaces and Recursive Type Bounds**. Consider the standard Java interface `java.lang.Comparable<T>`:
```java
public interface Comparable<T> {
    int compareTo(T o);
}
```
Notice that `Comparable` is parameterized by the very type that implements it! When authoring an enterprise entity such as `Employee`:
```java
public class Employee implements Comparable<Employee> {
    private final int id;
    public Employee(int id) { this.id = id; }

    @Override
    public int compareTo(Employee other) {
        return Integer.compare(this.id, other.id); // Strongly-typed comparison!
    }
}
```
Because `Employee` implements `Comparable<Employee>`, the `compareTo` method accepts an `Employee` directly—not an `Object`! If an engineer attempts to call `emp.compareTo("A String")`, the compiler rejects it immediately.

Furthermore, algorithms that find the maximum or sort collections employ **Recursive Type Bounds**:
```java
public static <T extends Comparable<T>> T findMax(List<T> list) {
    T max = list.get(0);
    for (T item : list) {
        if (item.compareTo(max) > 0) {
            max = item;
        }
    }
    return max;
}
```
The bound `<T extends Comparable<T>>` expresses an elegant mathematical invariant: "T must be a type that is comparable to instances of its own type." This ensures that `findMax` works universally on `Integer`, `String`, `LocalDate`, or any custom domain entity implementing `Comparable`, while guaranteeing compile-time type safety across all iterations.

"""

p3_content = """### 3. Type Erasure & JVM Bytecode Mechanics: What Happens at Runtime?

When Sun Microsystems designed Generics for Java 5, they faced a massive existential dilemma: how to introduce generics without breaking billions of lines of existing, compiled legacy Java 1.0–1.4 bytecode running across global financial institutions and servers. Languages like C++ implement generics (templates) via **code specialization (monomorphization)**, where `std::vector<int>` and `std::vector<double>` generate two completely independent binary machine code classes in the executable.

Java rejected monomorphization because it causes binary code bloat and breaks backward compatibility. Instead, Java implemented generics through an architectural compromise known as **Type Erasure**.

The fundamental invariant of Type Erasure is: **Generics exist exclusively at compile time to enforce type safety; at runtime, all generic type parameters are completely ERASED by the compiler!**

```
+------------------------------------------------------------------------------------+
| THE COMPILE-TIME vs RUNTIME TYPE ERASURE LIFECYCLE                                 |
+------------------------------------------------------------------------------------+
| SOURCE CODE (Compile Time):                                                        |
| class Pair<K, V> {                                                                 |
|     private K key;                                                                 |
|     public K getKey() { return key; }                                              |
| }                                                                                  |
| Pair<String, Integer> p = new Pair<>("Age", 22);                                   |
| String k = p.getKey(); // Compiler checks type safety                              |
+------------------------------------------------------------------------------------+
| BYTECODE AFTER JAVAC COMPILATION (Runtime Execution):                              |
| class Pair {                                                                       |
|     private Object key; // Unbounded type parameter K erased to Object!            |
|     public Object getKey() { return key; }                                         |
| }                                                                                  |
| Pair p = new Pair("Age", Integer.valueOf(22));                                     |
| String k = (String) p.getKey(); // JAVAC INSERTS SYNTHETIC CHECKCAST INSTRUCTION!  |
+------------------------------------------------------------------------------------+
```

When `javac` compiles `Pair<K, V>`, it performs two transformations:
1. It erases all unbounded type parameters (`K`, `V`) and replaces them with `java.lang.Object`. (If a parameter has an upper bound like `<T extends Number>`, it is replaced with `Number`).
2. At every call site where a generic method is invoked (e.g., `p.getKey()`), `javac` automatically synthesizes and inserts the `checkcast` bytecode instruction: `checkcast java/lang/String`.

Because of Type Erasure, generics in Java have several critical limitations that every enterprise architect must memorize:
- **Cannot Instantiate Type Parameters**: Writing `new T()` is strictly forbidden because at runtime, the JVM has no idea what `T` is! It only sees `Object`.
- **Cannot Create Generic Arrays**: Writing `new T[10]` or `new Pair<String, Integer>[10]` causes a compile error (`generic array creation`). Arrays in Java are covariant and reified (they preserve their component type at runtime and verify it during array stores), whereas generics are invariant and erased. Mixing reified arrays with erased generics would break type safety.
- **No Primitives in Type Arguments**: You cannot write `Pair<int, double>`. Primitives do not inherit from `java.lang.Object`, so they cannot be erased to `Object`. You must use their object wrapper types (`Pair<Integer, Double>`).
- **Static Context Separation**: Static fields cannot reference class type parameters (`private static T instance;` is illegal) because a single static field is shared across all instantiations of the class, regardless of whether callers use `Box<String>` or `Box<Integer>`.
- **Instanceof Limitations**: You cannot check `if (obj instanceof Pair<String, Integer>)` because the generic arguments are gone at runtime. You can only check raw or wildcard types: `if (obj instanceof Pair<?, ?>)`.

A fascinating internal mechanism of Type Erasure that every senior engineer must master is the synthesis of **Bridge Methods**.
Consider what occurs when a class implements a parameterized interface:
```java
public class StringHolder implements Comparable<StringHolder> {
    private String data;
    public int compareTo(StringHolder o) {
        return this.data.compareTo(o.data);
    }
}
```
After Type Erasure, `Comparable<T>` is erased to raw `Comparable`, whose abstract method signature is `public int compareTo(Object o)`.
However, `StringHolder` declared `public int compareTo(StringHolder o)`! In the JVM bytecode, parameter types are part of the method descriptor; therefore, `compareTo(StringHolder)` does NOT match the signature of `compareTo(Object)`! If nothing were done, polymorphism would break completely when invoking `comparable.compareTo(obj)` via `invokeinterface`.

To resolve this discrepancy, the `javac` compiler automatically synthesizes an invisible **Bridge Method** in the `StringHolder.class` bytecode:
```
// Synthetic bridge method emitted by javac:
public int compareTo(java.lang.Object);
  Code:
   0: aload_0
   1: aload_1
   2: checkcast     #2 // class StringHolder
   5: invokevirtual #3 // Method compareTo:(LStringHolder;)I
   8: ireturn
```
The synthetic bridge method takes `Object`, casts it to `StringHolder` via `checkcast`, and immediately delegates to the strongly-typed `compareTo(StringHolder)` method! This brilliant compiler synthesis preserves runtime polymorphism and V-Table dispatch while upholding compile-time type parameterization.

"""

p4_content = """### 4. Bounded Type Parameters & Wildcards: Upper Bounds, Lower Bounds & PECS

In basic generics, an unbounded parameter like `<T>` allows any object to be supplied. However, enterprise systems frequently require imposing structural constraints on what types are acceptable. For instance, a mathematical statistical calculator should only accept numbers, not arbitrary strings or UI buttons. To enforce this, Java provides **Bounded Type Parameters**.

**Upper Bounds (`<T extends SuperType>`)**
By declaring `<T extends Number>`, you instruct the compiler that `T` must be `Number` or one of its subclasses (`Integer`, `Double`, `BigDecimal`). Inside the generic class or method, the compiler guarantees that any method defined on `Number` (such as `doubleValue()`, `longValue()`) can be called directly on instances of `T`:
```java
public class NumericCalculator<T extends Number> {
    public double sum(T a, T b) {
        return a.doubleValue() + b.doubleValue(); // Guaranteed safe!
    }
}
```
Java also supports multiple bounds: `<T extends Number & Comparable<T>>`. Notice that only one class can be extended (and must be listed first), followed by any number of interfaces separated by the `&` operator.

**Generic Invariance vs Wildcards**
A common misconception among developing engineers is assuming that because `Integer` extends `Number`, `List<Integer>` must be a subtype of `List<Number>`. **This is completely false! In Java, generic types are INVARIANT.**
Why? Consider what would happen if `List<Integer>` were a subtype of `List<Number>`:
```java
List<Integer> intList = new ArrayList<>();
List<Number> numList = intList; // If this were allowed...
numList.add(3.14159); // Adding a Double into a List of Integers!
Integer val = intList.get(0); // CATASTROPHIC HEAP POLLUTION!
```
To prevent heap pollution, the compiler forbids assigning `List<Integer>` to `List<Number>`.

To restore flexible polymorphism across APIs without sacrificing type safety, Java introduced **Wildcards (`?`)** governed by Joshua Bloch's famous **PECS Principle**:
$$\\mathbf{PECS: \\quad Producer \\ Extends, \\ Consumer \\ Super}$$

```
+------------------------------------------------------------------------------------+
| THE PECS WILDCARD MATRIX (Producer Extends, Consumer Super)                        |
+------------------------------------------------------------------------------------+
| WILDCARD TYPE            | ROLE          | OPERATIONS PERMITTED | TYPICAL USE CASE  |
| ------------------------ | ------------- | -------------------- | ----------------- |
| <? extends T>            | PRODUCER      | READ ONLY (get)      | Reading numbers   |
| (Upper Bounded Wildcard) | (Yields data) | Writes FORBIDDEN     | from source list  |
| ------------------------ | ------------- | -------------------- | ----------------- |
| <? super T>              | CONSUMER      | WRITE ONLY (add)     | Adding elements   |
| (Lower Bounded Wildcard) | (Absorbs data)| Reads yield Object   | to dest collection|
+------------------------------------------------------------------------------------+
```

- **Producer Extends (`<? extends T>`)**: If a collection **produces** items for your method to read, declare it with `<? extends T>`. For example, `double sumOfList(List<? extends Number> list)`. You can read elements as `Number`, but you cannot add anything to `list` (except `null`) because the compiler cannot verify the concrete underlying list type.
- **Consumer Super (`<? super T>`)**: If a collection **consumes** items that your method writes into it, declare it with `<? super T>`. For example, `void addIntegers(List<? super Integer> list)`. You can safely call `list.add(new Integer(42))` because whatever supertype the list holds (`Number` or `Object`), an `Integer` is guaranteed to be a valid subtype!

Another subtle challenge in wildcard programming is **Wildcard Capture**. Consider writing a generic utility to swap the first two elements of a list:
```java
public static void swapFirstTwo(List<?> list) {
    // Attempting to swap:
    Object temp = list.get(0);
    // list.set(0, list.get(1)); // COMPILE ERROR!
}
```
Why does `list.set(0, list.get(1))` fail? Because the compiler assigns an internal capture symbol to the wildcard (e.g., `capture#1 of ?`). When `list.get(1)` is read, its type is `capture#1 of ?`. But when passing it into `set(0, ...)`, the compiler cannot prove that the object being inserted matches whatever unknown specific type the list actually holds! The compiler conservatively rejects the write to prevent heap pollution.

To solve this, architects use a **Private Helper Method with Type Inference**:
```java
public static void swapFirstTwo(List<?> list) {
    swapHelper(list, 0, 1); // Wildcard captured into concrete T!
}

private static <T> void swapHelper(List<T> list, int i, int j) {
    T temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp); // 100% type-safe and verified!
}
```
By delegating to `swapHelper(List<T> list)`, the compiler binds the unknown wildcard `?` to the concrete generic type parameter `T`, allowing safe reads and writes within the helper method while presenting a clean, user-friendly wildcard API to external callers.

"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `Pair<K, V>` and `Box<T>`

To conclude Day 27 and verify complete mastery of Java Generics, we implement and thoroughly test the two core generic container implementations required by the PinIT Career OS curriculum: the generic **`Pair<K, V>`** container and the generic **`Box<T>`** container.

In the primary challenge, we construct the generic class `Pair<K, V>`. The class must declare private fields for `key` of type `K` and `val` of type `V`, a constructor `Pair(K key, V val)` that initializes both fields using the `this` reference, and two public accessor methods: `getKey()` and `getVal()`. We then implement `Solution.testPair()` which instantiates a `Pair<String, Integer>` with `"Age"` and `22`, returning the concatenated string formatted as `"Age: 22"`.

```java
// ============================================================================
// CHALLENGE 1: GENERIC PAIR CONTAINER
// ============================================================================
class Pair<K, V> {
    private K key;
    private V val;

    // Generic constructor assigning parameters using 'this':
    public Pair(K key, V val) {
        this.key = key;
        this.val = val;
    }

    public K getKey() {
        return this.key;
    }

    public V getVal() {
        return this.val;
    }
}

public class Solution {
    public static String testPair() {
        // Instantiate parameterized generic pair:
        Pair<String, Integer> p = new Pair<>("Age", 22);

        // Access strongly-typed fields without manual casting:
        return p.getKey() + ": " + p.getVal();
    }
}
```

Let us trace the execution of `Solution.testPair()`:
1. `Pair<String, Integer> p = new Pair<>("Age", 22);`: The string literal `"Age"` and primitive `22` (autoboxed to `Integer.valueOf(22)`) are passed into the constructor. The JVM assigns `this.key = "Age"` and `this.val = 22`.
2. `p.getKey()` executes `invokevirtual Pair.getKey()`. At the bytecode level, `getKey()` returns an `Object` reference which is cast to `String` via `checkcast java/lang/String`.
3. `p.getVal()` returns the `Integer` reference.
4. String concatenation combines `"Age"`, `": "`, and `22`, returning the exact string `"Age: 22"`.

In the secondary assignment, we construct the generic class `Box<T>`. The container must maintain a private `T item` field, provide a `set(T item)` mutator, and a `get()` accessor. We then implement `SolutionAdv.test()` which instantiates `Box<String>`, sets its value to `"Present"`, and returns the stored item.

```java
// ============================================================================
// CHALLENGE 2: GENERIC BOX CONTAINER
// ============================================================================
class Box<T> {
    private T item;

    // Mutator: accepts parameter of type T
    public void set(T item) {
        this.item = item;
    }

    // Accessor: returns element of type T
    public T get() {
        return this.item;
    }
}

public class SolutionAdv {
    public static String test() {
        // Instantiate parameterized generic Box:
        Box<String> b = new Box<>();

        // Store string item:
        b.set("Present");

        // Retrieve and return item:
        return b.get();
    }
}
```

Let us review the automated test verification in JUnit 5:
```java
@Test
void testGenericPair() {
    Pair<String, Integer> p = new Pair<>("Score", 98);
    assertEquals("Score", p.getKey());
    assertEquals(98, p.getVal());
    assertEquals("Age: 22", Solution.testPair());
}

@Test
void testGenericBox() {
    Box<String> stringBox = new Box<>();
    stringBox.set("Enterprise");
    assertEquals("Enterprise", stringBox.get());
    assertEquals("Present", SolutionAdv.test());

    // Verify type safety across different type parameters:
    Box<Double> doubleBox = new Box<>();
    doubleBox.set(99.99);
    assertEquals(99.99, doubleBox.get());
}
```
Both generic structures exhibit complete compile-time type safety, zero manual casting, and strict compliance with the Day 27 curriculum specifications.

In modern Java (Java 16+), generic containers can also be expressed with extreme conciseness using **Generic Records**:
```java
// Modern Java 16+ immutable generic pair:
public record PairRecord<K, V>(K key, V val) {
    public PairRecord {
        java.util.Objects.requireNonNull(key, "key cannot be null");
        java.util.Objects.requireNonNull(val, "val cannot be null");
    }
}
```
Records automatically synthesize private final fields, accessor methods matching component names (`key()`, `val()`), an canonical constructor, and mathematically sound `equals()`, `hashCode()`, and `toString()` implementations. However, understanding standard generic classes like our Day 27 `Pair<K, V>` and `Box<T>` remains foundational, because mutable containers, entity proxies, and custom getter/setter logic require class-based state encapsulation.

Finally, consider edge cases when testing generic classes. What happens if a caller passes `null` as a generic parameter (e.g., `new Pair<String, Integer>(null, null)`)?
Under the Java language specification, `null` is a valid literal that can be converted to any reference type `T`. Thus, `p.getKey()` returns `null` without error. However, when returning `p.getKey() + ": " + p.getVal()`, Java's string concatenation automatically converts null references into the literal string `"null"`, producing `"null: null"`. By verifying both populated objects and null edge cases, your generic components achieve enterprise-grade resilience.

"""

DAY_27 = {
    "day": 27,
    "title": "Generics & Type Parameterization: Type Safety, Generic Classes & Methods",
    "goal": "Master Java Generics and compile-time type parameterization. Understand the historical evolution from raw types to generic containers, learn type parameter naming conventions, explore JVM type erasure and synthetic checkcast instructions, analyze bounded wildcards and the PECS principle, and implement the Pair and Box generic containers.",
    "minutes": 25,
    "recap": "Yesterday we mastered key-value maps, HashMap bucket arrays, and Red-Black treeification. Today, we delve into Java Generics, discovering how compile-time type parameterization guarantees type safety and eliminates ClassCastExceptions.",
    "summary": [
        "Generics shift type validation from runtime execution to compile time, eliminating manual casting and ClassCastExceptions.",
        "Standard type parameters follow clear conventions: T (Type), E (Element), K (Key), V (Value), N (Number).",
        "Type Erasure removes type parameters at compile time for backward compatibility, inserting synthetic checkcast instructions.",
        "Generics are invariant: List<Integer> is not a subtype of List<Number>; wildcards (? extends / ? super) restore polymorphism.",
        "The PECS principle dictates: Producer Extends (read-only) and Consumer Super (write-only).",
        "The Pair<K, V> and Box<T> challenges demonstrate universal reusable generic containers with zero runtime casting overhead."
    ],
    "projectStep": {
        "title": "Implement the Generic Pair and Box Data Containers",
        "steps": [
            "Author generic class Pair<K, V> with private K key, private V val, and constructor Pair(K key, V val).",
            "Implement public K getKey() and public V getVal() accessors.",
            "Author generic class Box<T> with private T item, set(T item) setter, and get() getter.",
            "Author Solution.testPair() returning 'Age: 22' and SolutionAdv.test() returning 'Present'.",
            "Verify complete type safety across automated test runners with zero ClassCastExceptions."
        ]
    },
    "parts": [
        {
            "part": 1,
            "title": "The Evolution of Type Safety: From Raw Types and Manual Casting to Java Generics",
            "content": p1_content.strip(),
            "code": """import java.util.ArrayList;
import java.util.List;

public class RawTypesVsGenericsLab {
    public static void main(String[] args) {
        System.out.println("=== TYPE SAFETY EVOLUTION DEMO ===");

        // Modern Type-Safe Generic Collection:
        List<String> validatedNames = new ArrayList<>();
        validatedNames.add("Vinay");
        validatedNames.add("Sarah");

        // Compile-time check prevents invalid types:
        // validatedNames.add(12345); // COMPILE ERROR!

        // Direct retrieval without manual casting:
        String firstName = validatedNames.get(0);
        System.out.println("Retrieved name with 100% type safety: " + firstName);
    }
}""",
            "checks": [
                {
                    "question": "What primary problem did the introduction of Generics in Java 5 solve?",
                    "options": [
                        "It eliminated runtime ClassCastExceptions by enforcing type safety at compile time rather than runtime",
                        "It made Java run directly on GPU hardware",
                        "It allowed Java to execute without a JVM",
                        "It removed all garbage collection pauses"
                    ],
                    "answer": 0,
                    "explanation": "Generics move type checking to compile time, preventing ClassCastExceptions caused by manual casting from raw Object collections."
                },
                {
                    "question": "What is the Diamond Operator (<>) introduced in Java 7?",
                    "options": [
                        "A syntax shortcut enabling type inference on constructor calls without repeating type arguments",
                        "A mathematical operator for matrix multiplication",
                        "A special security encryption modifier",
                        "A new type of generic array"
                    ],
                    "answer": 0,
                    "explanation": "The diamond operator '<>' allows the compiler to infer constructor type arguments from variable declarations."
                },
                {
                    "question": "What occurs if you attempt to add an Integer into a List<String> in modern Java?",
                    "options": [
                        "The javac compiler generates an incompatible types compile-time error",
                        "The Integer is converted to an empty string silently",
                        "The program throws a NullPointerException at runtime",
                        "The operating system closes the application"
                    ],
                    "answer": 0,
                    "explanation": "The compiler checks generic type arguments and halts compilation upon detecting type mismatches."
                },
                {
                    "question": "Why did legacy Java 1.4 collections require explicit casts like (String) list.get(0)?",
                    "options": [
                        "Because pre-generic collections only stored raw Object references on the heap",
                        "Because strings were not supported in Java 1.4",
                        "Because all variables in Java 1.4 were 16-bit integers",
                        "Because casting was mandatory on every CPU instruction"
                    ],
                    "answer": 0,
                    "explanation": "Legacy collections stored raw Objects; callers had to manually cast references back to their expected concrete types."
                }
            ]
        },
        {
            "part": 2,
            "title": "Generic Classes, Methods & Type Parameter Conventions",
            "content": p2_content.strip(),
            "code": """public class GenericClassesLab {
    // Multi-parameter generic class:
    public static class KeyValueHolder<K, V> {
        private final K key;
        private final V value;

        public KeyValueHolder(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() { return key; }
        public V getValue() { return value; }
    }

    public static void main(String[] args) {
        KeyValueHolder<String, Double> stock = new KeyValueHolder<>("AAPL", 224.50);
        System.out.println("Stock: " + stock.getKey() + " -> $" + stock.getValue());

        KeyValueHolder<Integer, String> status = new KeyValueHolder<>(200, "OK");
        System.out.println("Status: " + status.getKey() + " -> " + status.getValue());
    }
}""",
            "checks": [
                {
                    "question": "Which type parameter name is conventionally used to represent an Element in the Collections Framework?",
                    "options": [
                        "E",
                        "T",
                        "K",
                        "V"
                    ],
                    "answer": 0,
                    "explanation": "By convention, 'E' represents an Element in collections, 'T' represents Type, 'K' is Key, and 'V' is Value."
                },
                {
                    "question": "Where is the type parameter declared in a standalone generic method?",
                    "options": [
                        "Immediately before the method return type (e.g. public static <T> void process(T item))",
                        "Inside the method body after the opening brace",
                        "In the package declaration header",
                        "At the end of the method parameter list"
                    ],
                    "answer": 0,
                    "explanation": "Generic methods declare their type parameters inside angle brackets directly before the return type."
                },
                {
                    "question": "Can a generic class declare multiple type parameters (e.g. class Pair<K, V>)?",
                    "options": [
                        "Yes, multiple comma-separated type parameters can be declared inside the angle brackets",
                        "No, Java limits all generic classes to exactly one type parameter",
                        "Only if all parameters are Numbers",
                        "Only in abstract classes"
                    ],
                    "answer": 0,
                    "explanation": "Java allows multiple comma-separated type parameters, commonly used in mapping and tuple classes like Pair<K, V>."
                },
                {
                    "question": "Why does calling p.getKey() on a Pair<String, Integer> not require an explicit (String) cast?",
                    "options": [
                        "The compiler knows p is parameterized with K=String and automatically inserts the synthetic cast in bytecode",
                        "Because strings do not require memory in Java",
                        "Because getKey() is a native C++ method",
                        "Because generics disable all bytecode verification"
                    ],
                    "answer": 0,
                    "explanation": "The compiler tracks the concrete type argument and handles casting transparently in synthesized bytecode."
                }
            ]
        },
        {
            "part": 3,
            "title": "Type Erasure & JVM Bytecode Mechanics: What Happens at Runtime?",
            "content": p3_content.strip(),
            "code": """public class TypeErasureLab {
    public static class Container<T> {
        private T value;
        public void set(T val) { this.value = val; }
        public T get() { return this.value; }
    }

    public static void main(String[] args) {
        Container<String> c1 = new Container<>();
        Container<Integer> c2 = new Container<>();

        // Due to Type Erasure, both instances share the exact same runtime class!
        System.out.println("c1 class: " + c1.getClass().getName());
        System.out.println("c2 class: " + c2.getClass().getName());
        System.out.println("Are runtime classes identical: " + (c1.getClass() == c2.getClass())); // true
    }
}""",
            "checks": [
                {
                    "question": "What is Type Erasure in Java?",
                    "options": [
                        "The process where javac removes all generic type parameters during compilation, replacing them with Object or bounds",
                        "A tool that deletes unused Java source files",
                        "A garbage collection algorithm that reclaims dead classes",
                        "A hardware feature of Intel CPUs"
                    ],
                    "answer": 0,
                    "explanation": "Type erasure removes generic types at compile time to maintain backward compatibility with legacy bytecode."
                },
                {
                    "question": "Why is 'new T()' forbidden inside a generic class in Java?",
                    "options": [
                        "Because type parameters are erased at runtime; the JVM cannot determine what concrete class constructor to invoke",
                        "Because constructors cannot be called with the new operator",
                        "Because T is always null",
                        "Because Java disallows dynamic object allocation"
                    ],
                    "answer": 0,
                    "explanation": "Due to type erasure, the JVM does not know the actual runtime type of T and cannot execute its constructor."
                },
                {
                    "question": "Why is creating generic arrays like 'new T[10]' forbidden in Java?",
                    "options": [
                        "Java arrays are reified and covariant at runtime, which directly conflicts with erased and invariant generics",
                        "Because arrays can only hold primitive types",
                        "Because arrays cannot exceed 5 elements",
                        "Because arrays do not exist in Java 5+"
                    ],
                    "answer": 0,
                    "explanation": "Arrays check types at runtime (reified), whereas generics are erased at compile time; mixing them creates unsafe heap pollution."
                },
                {
                    "question": "Why does (c1.getClass() == c2.getClass()) evaluate to true for Container<String> and Container<Integer>?",
                    "options": [
                        "Because both share the exact same raw Container.class mirror on the heap after type erasure",
                        "Because String and Integer are identical types",
                        "Because the JVM merged both classes into Object",
                        "It evaluates to false in modern Java"
                    ],
                    "answer": 0,
                    "explanation": "At runtime, type parameters are erased, so both instances share the single loaded Container.class type."
                }
            ]
        },
        {
            "part": 4,
            "title": "Bounded Type Parameters & Wildcards: Upper Bounds, Lower Bounds & PECS",
            "content": p4_content.strip(),
            "code": """import java.util.ArrayList;
import java.util.List;

public class BoundedWildcardsLab {
    // Producer Extends: Reads numbers from list (Read-Only)
    public static double sumOfNumbers(List<? extends Number> numbers) {
        double total = 0.0;
        for (Number num : numbers) {
            total += num.doubleValue(); // Safe read
        }
        return total;
    }

    // Consumer Super: Writes integers into list (Write-Only)
    public static void populateIntegers(List<? super Integer> target) {
        target.add(10);
        target.add(20);
        target.add(30);
    }

    public static void main(String[] args) {
        List<Integer> intList = List.of(1, 2, 3, 4, 5);
        System.out.println("Sum of integers via <? extends Number>: " + sumOfNumbers(intList));

        List<Number> numList = new ArrayList<>();
        populateIntegers(numList);
        System.out.println("Consumer Super populated numbers: " + numList);
    }
}""",
            "checks": [
                {
                    "question": "What does the PECS mnemonic stand for in Java Generics?",
                    "options": [
                        "Producer Extends, Consumer Super",
                        "Parameter Encapsulation, Class Security",
                        "Package Extension, Collection Synchronization",
                        "Private Execution, Consumer Scope"
                    ],
                    "answer": 0,
                    "explanation": "PECS stands for Producer Extends, Consumer Super: use extends when reading from a collection, and super when writing."
                },
                {
                    "question": "Why is List<Integer> NOT a subtype of List<Number> in Java (Generic Invariance)?",
                    "options": [
                        "To prevent heap pollution; otherwise, code could add a Double into a List<Integer> through a List<Number> reference",
                        "Because Integer does not inherit from Number",
                        "Because List is an interface rather than a class",
                        "Because the JVM disallows inheritance in collections"
                    ],
                    "answer": 0,
                    "explanation": "Generics are invariant to prevent heap pollution: allowing List<Number> = List<Integer> would permit inserting non-integers into an integer list."
                },
                {
                    "question": "What operations are permitted on a collection parameterized with <? extends Number>?",
                    "options": [
                        "Reading elements as Number is permitted, but adding elements (other than null) is forbidden",
                        "Writing any Number is permitted, but reading is forbidden",
                        "Both reading and writing any Number are fully permitted",
                        "No operations are permitted; it is a marker type"
                    ],
                    "answer": 0,
                    "explanation": "Upper bounded wildcards (extends) are producers: elements can be read as the upper bound, but writes are blocked to preserve safety."
                },
                {
                    "question": "How do you specify multiple bounds on a generic type parameter (e.g. Number and Comparable)?",
                    "options": [
                        "<T extends Number & Comparable<T>>",
                        "<T extends Number, Comparable<T>>",
                        "<T implements Number + Comparable<T>>",
                        "<T extends Number || Comparable<T>>"
                    ],
                    "answer": 0,
                    "explanation": "Multiple bounds use the '&' symbol: the class must come first, followed by any number of interfaces."
                }
            ]
        },
        {
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building Pair<K, V> and Box<T>",
            "content": p5_content.strip(),
            "code": """public class SolutionLab {
    // Challenge 1: Generic Pair Container
    static class Pair<K, V> {
        private K key;
        private V val;

        public Pair(K key, V val) {
            this.key = key;
            this.val = val;
        }

        public K getKey() { return this.key; }
        public V getVal() { return this.val; }
    }

    // Challenge 2: Generic Box Container
    static class Box<T> {
        private T item;
        public void set(T item) { this.item = item; }
        public T get() { return this.item; }
    }

    public static class Solution {
        public static String testPair() {
            Pair<String, Integer> p = new Pair<>("Age", 22);
            return p.getKey() + ": " + p.getVal();
        }
    }

    public static class SolutionAdv {
        public static String test() {
            Box<String> b = new Box<>();
            b.set("Present");
            return b.get();
        }
    }

    public static void main(String[] args) {
        String pairResult = Solution.testPair();
        String boxResult = SolutionAdv.test();

        System.out.println("Pair test: " + pairResult); // Age: 22
        System.out.println("Box test:  " + boxResult);  // Present
    }
}""",
            "checks": [
                {
                    "question": "In the Day 27 testPair challenge, what does Solution.testPair() return?",
                    "options": [
                        "'Age: 22'",
                        "'Age 22'",
                        "'Pair[Age=22]'",
                        "'22: Age'"
                    ],
                    "answer": 0,
                    "explanation": "Solution.testPair creates Pair('Age', 22) and returns p.getKey() + ': ' + p.getVal(), which evaluates to 'Age: 22'."
                },
                {
                    "question": "In the Day 27 Generic Box assignment, what does Box.get() return after box.set('Present')?",
                    "options": [
                        "'Present'",
                        "null",
                        "0",
                        "A new Box object"
                    ],
                    "answer": 0,
                    "explanation": "box.set('Present') stores 'Present' in private field item, which is returned by box.get()."
                },
                {
                    "question": "Why does the Pair class constructor use 'this.key = key;'?",
                    "options": [
                        "To resolve parameter shadowing and assign the incoming argument to the instance field",
                        "Because 'this' creates a new thread in Java",
                        "Because generic fields cannot be assigned without 'this'",
                        "To force garbage collection of previous fields"
                    ],
                    "answer": 0,
                    "explanation": "The parameter 'key' shadows the instance field 'key'; 'this.key' explicitly references the instance variable."
                },
                {
                    "question": "What is the return type of p.getKey() when p is declared as Pair<String, Integer>?",
                    "options": [
                        "String",
                        "Object",
                        "Integer",
                        "void"
                    ],
                    "answer": 0,
                    "explanation": "Because K is parameterized to String, p.getKey() is statically typed as String by the compiler."
                }
            ]
        }
    ]
}

with open("scripts/block6_day27.py", "w", encoding="utf-8") as f:
    f.write("# Day 27: Generics & Type Parameterization: Type Safety, Generic Classes & Methods\n\nDAY_27 = ")
    f.write(pprint.pformat(DAY_27, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block6_day27.py successfully")
