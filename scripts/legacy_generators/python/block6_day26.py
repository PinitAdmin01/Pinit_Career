# Day 26: Java Collections Framework II: Key-Value Maps & HashMap Mechanics

DAY_26 = {'day': 26,
 'goal': 'Master key-value maps and associative data structures in Java. Understand the Map contract, explore HashMap '
         'internal mechanics including bucket arrays, bitwise hash distribution (& capacity - 1), Java 8+ Red-Black '
         'treeification (TREEIFY_THRESHOLD = 8), dynamic load-factor rehashing, and implement the Milestone 5 Word '
         'Frequency Engine.',
 'minutes': 25,
 'parts': [{'checks': [{'answer': 0,
                        'explanation': 'Map models associative key-value pairs and does not extend Collection, '
                                       'establishing its own parallel hierarchy.',
                        'options': ['Map manages key-value pair associations where keys must be unique; Collection '
                                    'manages individual elements',
                                    'Map can only store numbers; Collection can only store strings',
                                    'Map is deprecated in Java 8+; Collection is modern',
                                    'Map is an abstract class; Collection is a concrete class'],
                        'question': 'What is the primary architectural difference between Map<K, V> and Collection<E> '
                                    'in Java?'},
                       {'answer': 0,
                        'explanation': 'Map.put returns the previous value that was replaced, or null if the key is '
                                       'newly inserted.',
                        'options': ['The previous value associated with the key, or null if there was no previous '
                                    'mapping',
                                    'True if successful, false if not',
                                    'The integer index of the bucket array',
                                    'An empty Optional'],
                        'question': 'What does map.put(key, value) return if the key was already present in the map?'},
                       {'answer': 0,
                        'explanation': 'Iterating keySet followed by map.get(key) performs two hash lookups per item; '
                                       'entrySet yields both key and value in a single pass.',
                        'options': ['entrySet provides direct access to both key and value without requiring a second '
                                    'O(1) hash lookup per element',
                                    'keySet is restricted by security policies to run single-threaded',
                                    'entrySet compiles down to C assembly instructions',
                                    'keySet creates a duplicate copy of the entire database'],
                        'question': 'Why is iterating through map.entrySet() faster than iterating through '
                                    'map.keySet()?'},
                       {'answer': 0,
                        'explanation': 'getOrDefault returns the supplied default parameter whenever the target key is '
                                       'absent from the map.',
                        'options': ['0 (the specified default value)', 'null', 'Throws a NoSuchElementException', '-1'],
                        'question': "What does map.getOrDefault('missingKey', 0) return if 'missingKey' is not in the "
                                    'map?'}],
            'code': 'import java.util.HashMap;\n'
                    'import java.util.Map;\n'
                    '\n'
                    'public class MapContractLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("=== MAP<K, V> INTERFACE CONTRACT ===");\n'
                    '        Map<String, Integer> inventory = new HashMap<>();\n'
                    '\n'
                    '        // Inserting entries: put() returns previous value or null\n'
                    '        inventory.put("SKU-100", 25);\n'
                    '        inventory.put("SKU-200", 50);\n'
                    '        Integer previous = inventory.put("SKU-100", 30); // Overwrites 25, returns 25\n'
                    '\n'
                    '        System.out.println("Overwritten previous value: " + previous);\n'
                    '        System.out.println("Current SKU-100 stock:      " + inventory.get("SKU-100")); // 30\n'
                    '\n'
                    '        // getOrDefault: safe read with fallback\n'
                    '        int missing = inventory.getOrDefault("SKU-999", 0);\n'
                    '        System.out.println("Missing SKU fallback:       " + missing); // 0\n'
                    '\n'
                    '        // Iterating entries cleanly via entrySet():\n'
                    '        for (Map.Entry<String, Integer> entry : inventory.entrySet()) {\n'
                    '            System.out.println("  Item: " + entry.getKey() + " -> Qty: " + entry.getValue());\n'
                    '        }\n'
                    '    }\n'
                    '}',
            'content': '### 1. The `Map<K, V>` Interface Contract & Key-Value Association Architecture\n'
                       '\n'
                       'In computer science and real-world enterprise engineering, information is rarely organized '
                       'solely as linear sequences or indexed arrays. Instead, software systems fundamentally revolve '
                       'around associative relationships: mapping a user ID to a profile record, an account number to '
                       'a ledger balance, an IP address to a geographic region, or a product SKU to an inventory '
                       'count. In the Java Collections Framework, this universal associative pattern is modeled by the '
                       '**`java.util.Map<K, V>`** interface.\n'
                       '\n'
                       'Unlike `List<E>` and `Set<E>`, which inherit from `java.util.Collection<E>` and manage '
                       'individual elements, `Map<K, V>` stands in its own dedicated hierarchy. A map defines an '
                       'abstract contract representing a collection of **key-value pairs**, often called **entries**. '
                       'In mathematical terms, a map represents a function that maps unique keys from domain $K$ to '
                       'values in codomain $V$.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| THE JAVA MAP<K, V> INTERFACE ARCHITECTURE                                          |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '|                                java.util.Map<K, V>                                 |\n'
                       '|                                         │                                          |\n'
                       '|                  ┌──────────────────────┼──────────────────────┐                   |\n'
                       '|                  ▼                      ▼                      ▼                   |\n'
                       '|           java.util.HashMap      java.util.TreeMap     java.util.LinkedHashMap     |\n'
                       '|           - Hash table backing   - Red-Black Tree      - Hash table + Linked List  |\n'
                       '|           - O(1) average lookup  - O(log N) sorted     - Predictable iteration     |\n'
                       '|           - Unordered entries    - Natural/Comparator  - LRU Cache foundation      |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'The foundational invariant of the `Map` contract is absolute: **Keys must be unique**. A map '
                       'cannot contain duplicate keys; each key can map to at most one value. Conversely, values are '
                       'not constrained to be unique—multiple distinct keys can legitimately map to identical values '
                       '(for example, two different users can both have the status `"ACTIVE"`).\n'
                       '\n'
                       'The core operational contract of `Map<K, V>` consists of several essential methods:\n'
                       '- `put(K key, V value)`: Associates the specified value with the specified key. If the map '
                       'previously contained an entry for this key, the old value is replaced and returned to the '
                       'caller; if no previous entry existed, `null` is returned.\n'
                       '- `get(Object key)`: Retrieves the value mapped to the specified key, or returns `null` if the '
                       'key is not present.\n'
                       '- `getOrDefault(Object key, V defaultValue)`: Introduced in Java 8, this method retrieves the '
                       'value mapped to the key, or returns the supplied fallback `defaultValue` if the key is absent. '
                       'This single method dramatically simplified frequency counting, inventory lookups, and caching '
                       'algorithms.\n'
                       '- `containsKey(Object key)`: Returns `true` if the map contains an entry for the specified '
                       'key.\n'
                       '- `containsValue(Object value)`: Performs a linear scan across all values in the map, '
                       'returning `true` if at least one key maps to the target value.\n'
                       '- `remove(Object key)`: Removes the entry associated with the key and returns its value.\n'
                       '\n'
                       'Furthermore, `Map<K, V>` provides three distinct collection views that allow developers to '
                       'inspect and iterate over its data:\n'
                       '1. **`keySet()`**: Returns a `Set<K>` containing all unique keys currently stored in the map.\n'
                       '2. **`values()`**: Returns a `Collection<V>` containing all values (which may contain '
                       'duplicates).\n'
                       '3. **`entrySet()`**: Returns a `Set<Map.Entry<K, V>>`, where each `Map.Entry` object '
                       'encapsulates a single key-value association with `.getKey()` and `.getValue()` accessors. '
                       'Iterating through `entrySet()` is significantly faster than iterating through `keySet()` and '
                       'performing a secondary `map.get(key)` call, because it avoids a second hash lookup for every '
                       'single entry!\n'
                       '\n'
                       'In the enterprise domain, the classic use case for maps is frequency tallying and aggregation. '
                       'When ingesting raw text or transactional telemetry, computing how many times each token occurs '
                       'is achieved cleanly via:\n'
                       '```java\n'
                       'map.put(word, map.getOrDefault(word, 0) + 1);\n'
                       '```\n'
                       'If the word is encountered for the first time, `getOrDefault(word, 0)` returns `0`, which '
                       'increments to `1` and inserts into the map. On subsequent encounters, it loads the existing '
                       'count, increments it by `1`, and updates the entry in constant time.',
            'part': 1,
            'title': 'The Map<K, V> Interface Contract & Key-Value Association Architecture',
            'tryIt': 'Try inserting duplicate keys into the HashMap and verify that the new value overwrites the old '
                     'value while returning the previous value.'},
           {'checks': [{'answer': 0,
                        'explanation': 'Power-of-two capacities allow hash & (capacity - 1) to replace expensive CPU '
                                       'modulo division with single-cycle bitwise AND.',
                        'options': ['It allows computing bucket indices using fast bitwise AND (hash & (capacity - 1)) '
                                    'instead of slow modulo division',
                                    'Because 32-bit CPUs cannot allocate arrays of odd lengths',
                                    'To force garbage collection to run every 10 seconds',
                                    'Because Java arrays can only have power-of-two lengths'],
                        'question': 'Why does HashMap enforce that its internal table capacity must always be a power '
                                    'of two?'},
                       {'answer': 0,
                        'explanation': 'XORing the upper 16 bits with lower 16 bits spreads entropy across all bits, '
                                       'preventing collisions when table capacity is small.',
                        'options': ['To blend high-order bits into lower-order bits, preventing collisions when '
                                    'capacity is small',
                                    'To encrypt keys before storing them in RAM',
                                    'To convert negative hash codes into positive numbers',
                                    'To compress strings into integers'],
                        'question': "What is the purpose of high-bit spreading (h ^ (h >>> 16)) in HashMap's internal "
                                    'hash function?'},
                       {'answer': 0,
                        'explanation': 'If equal objects have different hash codes, get(key) checks the wrong bucket '
                                       'and returns null, losing the entry.',
                        'options': ['Objects considered equal by equals() will hash to different buckets, making them '
                                    'unretrievable via map.get()',
                                    'The JVM will throw a ClassCastException at compile time',
                                    'The operating system will crash with a blue screen',
                                    'All hash maps in the application will be wiped clean'],
                        'question': 'What is the consequence of violating the equals() and hashCode() contract in '
                                    'Java?'},
                       {'answer': 0,
                        'explanation': 'HashMap explicitly permits one null key, assigning it hash 0 and placing it at '
                                       'bucket index 0.',
                        'options': ['Permanently at bucket index 0 with a hash code of 0',
                                    'It throws a NullPointerException because HashMap rejects null keys',
                                    'In a separate off-heap file on disk',
                                    'At index capacity - 1'],
                        'question': 'Where does HashMap store a key that evaluates to null?'}],
            'code': 'public class HashMapInternalsLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("=== HASHMAP BUCKET MASKING LAB ===");\n'
                    '\n'
                    '        int capacity = 16;\n'
                    '        int mask = capacity - 1; // 15 (binary: 00001111)\n'
                    '\n'
                    '        String key1 = "java";\n'
                    '        String key2 = "code";\n'
                    '\n'
                    '        int h1 = key1.hashCode();\n'
                    '        int mixed1 = h1 ^ (h1 >>> 16); // High-bit spreading\n'
                    '        int bucket1 = mixed1 & mask;   // Fast bitwise index calculation\n'
                    '\n'
                    '        int h2 = key2.hashCode();\n'
                    '        int mixed2 = h2 ^ (h2 >>> 16);\n'
                    '        int bucket2 = mixed2 & mask;\n'
                    '\n'
                    '        System.out.println("Key \'java\' -> hashCode: " + h1 + ", bucket index: " + bucket1);\n'
                    '        System.out.println("Key \'code\' -> hashCode: " + h2 + ", bucket index: " + bucket2);\n'
                    '    }\n'
                    '}',
            'content': '### 2. `HashMap` Internal Data Structure: Buckets, Hash Codes & Bitwise Masking\n'
                       '\n'
                       'Among all map implementations, **`java.util.HashMap<K, V>`** is the undisputed workhorse of '
                       'the Java ecosystem. It provides near-instantaneous $O(1)$ average time complexity for both '
                       '`get()` and `put()` operations. To truly master Java engineering, one must look beneath the '
                       'high-level API and understand the internal memory topology of `HashMap`.\n'
                       '\n'
                       'At its core, a `HashMap` is backed by a contiguous array of buckets, declared internally in '
                       'the OpenJDK source code as:\n'
                       '```java\n'
                       'transient Node<K,V>[] table;\n'
                       '```\n'
                       'Each element in this array is referred to as a **bucket**. When you instantiate a default '
                       '`HashMap`, `table` is initialized lazily upon the first insertion, allocating an array of 16 '
                       'buckets (`DEFAULT_INITIAL_CAPACITY = 1 << 4`).\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| HASHMAP BUCKET ARRAY & BITWISE MASKING TOPOLOGY                                    |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| KEY: "java" ──► hashCode() = 3254818 ──► hash mixing ──► (capacity - 1) & hash    |\n'
                       '|                                                                    │               |\n'
                       '|                                                                    ▼               |\n'
                       '|                                                             Bucket Index: 2        |\n'
                       '| table[0] ──► null                                                                  |\n'
                       '| table[1] ──► null                                                                  |\n'
                       '| table[2] ──► [Node: key="java", val=3, hash=..., next=null]                        |\n'
                       '| table[3] ──► null                                                                  |\n'
                       '| table[4] ──► [Node: key="code", val=2, next] ──► [Node: key="test", val=1, null]   |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'How does `HashMap` determine which bucket an incoming key belongs to? The process involves '
                       'three distinct mathematical and bitwise operations:\n'
                       '\n'
                       '**Step 1: Computing the Object Hash Code**\n'
                       'Every class in Java inherits the `hashCode()` method from `java.lang.Object`. For strings, '
                       '`String.hashCode()` computes a polynomial hash:\n'
                       '$$s[0] \\times 31^{n-1} + s[1] \\times 31^{n-2} + \\dots + s[n-1]$$\n'
                       'This returns a 32-bit signed integer.\n'
                       '\n'
                       '**Step 2: High-Bit Spreading (Hash Mixing)**\n'
                       "If a developer's custom `hashCode()` only varies in its upper bits, standard modulo indexing "
                       'would ignore those variations and cause massive bucket clustering. To prevent this, `HashMap` '
                       'applies an internal bit-spreading function:\n'
                       '```java\n'
                       'static final int hash(Object key) {\n'
                       '    int h;\n'
                       '    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);\n'
                       '}\n'
                       '```\n'
                       'The bitwise unsigned right-shift `h >>> 16` shifts the upper 16 bits down into the lower 16 '
                       'bits, and the XOR operator (`^`) blends them together. This ensures that variations in '
                       'high-order bits influence lower-order bits, creating uniform distribution across buckets. '
                       '(Notice also that if `key == null`, `HashMap` gracefully assigns hash `0`, placing null keys '
                       'permanently into bucket index 0!).\n'
                       '\n'
                       '**Step 3: Fast Bitwise Bucket Masking**\n'
                       'In naive implementations, mapping a hash to an array index uses modulo arithmetic: `index = '
                       'hash % capacity`. However, integer division and modulo operations are computationally '
                       'expensive at the CPU silicon level, requiring dozens of clock cycles.\n'
                       'Because `HashMap` strictly forces its capacity to be a **power of two** ($16, 32, 64, 128, '
                       '\\dots$), it exploits a brilliant bitwise identity:\n'
                       '$$\\text{If } C = 2^k, \\quad X \\pmod C \\equiv X \\ \\& \\ (C - 1)$$\n'
                       'For instance, if capacity is 16, $16 - 1 = 15$, which in binary is `00001111`. Performing '
                       '`hash & 15` masks off all bits except the lowest 4 bits, delivering an instantaneous bucket '
                       'index in a single CPU clock cycle!\n'
                       '\n'
                       'This internal architecture exposes the critical **`equals()` and `hashCode()` contract**:\n'
                       '1. If two objects are equal according to `equals()`, they MUST produce the same integer '
                       '`hashCode()`.\n'
                       '2. If two objects produce different hash codes, they are guaranteed to be unequal.\n'
                       'If a developer overrides `equals()` without overriding `hashCode()`, two identical business '
                       'objects will hash to completely different bucket indices. When calling `map.get(key)`, the JVM '
                       'looks in the wrong bucket and returns `null`, even though the exact logical key exists in the '
                       'map!',
            'part': 2,
            'title': 'HashMap Internal Data Structure: Buckets, Hash Codes & Bitwise Masking',
            'tryIt': 'Try retrieving a non-existent key with getOrDefault(key, 0) and verify that it returns 0 instead '
                     'of a dangerous null pointer.'},
           {'checks': [{'answer': 0,
                        'explanation': 'Java 8 replaces long linked lists with Red-Black trees (TreeNode) when bucket '
                                       'size reaches 8, dropping lookup from O(N) to O(log N).',
                        'options': ['A balanced Red-Black Tree (TreeNode<K, V>) providing O(log N) worst-case search '
                                    'complexity',
                                    'A circular doubly-linked queue',
                                    'A secondary hash table stored on disk',
                                    'A raw primitive integer array'],
                        'question': 'What data structure does Java 8+ HashMap use when a single bucket exceeds '
                                    'TREEIFY_THRESHOLD (8)?'},
                       {'answer': 0,
                        'explanation': 'Treeification guarantees O(log N) worst-case lookup, neutralizing Hash DoS '
                                       'attacks where attackers engineered thousands of colliding keys.',
                        'options': ['To protect against Hash Collision Denial of Service (DoS) attacks that exploited '
                                    'O(N) linked list degradation',
                                    'To allow HashMaps to run on multiple GPU threads',
                                    'To eliminate the need for hashCode() methods',
                                    'Because linked lists were removed from the JVM specification'],
                        'question': 'Why was bucket treeification introduced in Java 8?'},
                       {'answer': 0,
                        'explanation': 'If table capacity < 64, HashMap resizes the table to redistribute keys rather '
                                       'than incurring Red-Black tree overhead.',
                        'options': ['HashMap resizes (doubles) the table capacity to spread keys naturally instead of '
                                    'converting to a tree',
                                    'It throws a CapacityExceededException',
                                    'It deletes all colliding elements',
                                    'It converts the map to a TreeMap'],
                        'question': 'What happens if a bucket has 8 elements but total table capacity is less than '
                                    'MIN_TREEIFY_CAPACITY (64)?'},
                       {'answer': 0,
                        'explanation': 'UNTREEIFY_THRESHOLD is 6; the gap between 8 (treeify) and 6 (untreeify) '
                                       'prevents thrashing conversions during minor fluctuations.',
                        'options': ['6 elements', '8 elements', '0 elements', '1 element'],
                        'question': 'At what count does a treeified bucket convert back into a linked list '
                                    '(UNTREEIFY_THRESHOLD)?'}],
            'code': 'public class TreeificationLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("=== HASH COLLISION & TREEIFICATION THRESHOLDS ===");\n'
                    '\n'
                    '        // Invariants established in OpenJDK HashMap source:\n'
                    '        final int TREEIFY_THRESHOLD = 8;\n'
                    '        final int UNTREEIFY_THRESHOLD = 6;\n'
                    '        final int MIN_TREEIFY_CAPACITY = 64;\n'
                    '\n'
                    '        System.out.println("Treeify threshold (linked list -> Red-Black Tree): " + '
                    'TREEIFY_THRESHOLD);\n'
                    '        System.out.println("Untreeify threshold (Red-Black Tree -> linked list): " + '
                    'UNTREEIFY_THRESHOLD);\n'
                    '        System.out.println("Minimum table capacity required to treeify:          " + '
                    'MIN_TREEIFY_CAPACITY);\n'
                    '\n'
                    '        System.out.println("\n'
                    'Worst-case lookup complexity comparison:");\n'
                    '        System.out.println("Java 7 Singly-Linked List: O(N) linear time");\n'
                    '        System.out.println("Java 8+ Red-Black Tree:   O(log N) logarithmic time");\n'
                    '    }\n'
                    '}',
            'content': '### 3. Collision Resolution & The Treeify Threshold: Linked Lists vs Red-Black Trees\n'
                       '\n'
                       'In any hash-based data structure, no matter how sophisticated the hash mixing function is, two '
                       'distinct keys will eventually produce the same bucket index. This phenomenon is mathematically '
                       'inevitable due to the **Pigeonhole Principle**: there are $2^{32}$ possible 32-bit integer '
                       'hash codes, but an infinite number of possible strings or domain objects. When two distinct '
                       'keys map to the exact same bucket, this event is called a **Hash Collision**.\n'
                       '\n'
                       'Historically in Java 7 and earlier, `HashMap` resolved collisions strictly through **Separate '
                       'Chaining with Singly-Linked Lists**. Each entry in `table[index]` was a `Node` containing '
                       '`key`, `value`, `hash`, and a `next` pointer. When a collision occurred:\n'
                       '- The new node was appended to the linked list at that bucket.\n'
                       '- During a `get(key)` operation, the JVM computed the bucket index in $O(1)$ time, but then '
                       'had to traverse the linked list node-by-node, comparing `node.key.equals(searchKey)` '
                       'sequentially.\n'
                       '- If thousands of keys collided into the same bucket, the lookup complexity degraded from '
                       '$O(1)$ to a disastrous linear **$O(N)$**!\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| HASH COLLISION EVOLUTION: LINKED LIST TO RED-BLACK TREE                            |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| LEGACY JAVA 7 BUCKET DEGRADATION (O(N) Linear Scan):                               |\n'
                       '| Bucket [4] ──► Node A ──► Node B ──► Node C ──► Node D ──► ... ──► Node 1000 (Slow)|\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| MODERN JAVA 8+ TREEIFICATION (O(log N) Balanced Tree Search):                      |\n'
                       '| When bucket length >= 8 AND total table capacity >= 64:                            |\n'
                       '| Bucket [4] ──► TreeNode Root (Black)                                               |\n'
                       '|                    ┌────────┴────────┐                                             |\n'
                       '|              TreeNode (Red)     TreeNode (Black)                                   |\n'
                       '|              ┌─────┴─────┐             └─────┐                                     |\n'
                       '|           Node 1       Node 2              Node 3                                  |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'In the early 2010s, security researchers discovered that attackers could exploit this $O(N)$ '
                       'degradation to launch **Hash Collision Denial of Service (DoS) attacks**. By crafting '
                       'thousands of HTTP request parameters specifically designed to produce the identical hash code, '
                       'malicious actors forced web servers into $100\\%$ CPU saturation traversing 50,000-node linked '
                       'lists on every request.\n'
                       '\n'
                       'To permanently neutralize this vulnerability, Java 8 completely re-engineered `HashMap` with '
                       '**Bucket Treeification** (JEP 180). When elements collide in a single bucket:\n'
                       '1. `HashMap` initially chains elements in a standard singly-linked list.\n'
                       '2. If the number of colliding nodes in a single bucket reaches **`TREEIFY_THRESHOLD = 8`**, '
                       '`HashMap` inspects the total table capacity.\n'
                       '3. If total capacity is less than `MIN_TREEIFY_CAPACITY = 64`, it doubles the table capacity '
                       'via resizing to spread the keys naturally.\n'
                       '4. However, if table capacity is already $\\ge 64$, `HashMap` actively transforms the entire '
                       'linked list at that bucket into a balanced **Red-Black Tree** (`TreeNode<K, V>`)!\n'
                       '\n'
                       'In a Red-Black tree, nodes are ordered by their hash code (or via their `Comparable` '
                       'implementation if keys implement `Comparable<K>`). As a result, even in the worst-case '
                       'scenario where an attacker floods a single bucket with 10,000 colliding keys, lookup time '
                       'complexity drops from $O(N)$ linear time to a guaranteed **$O(\\log N)$ logarithmic time**! '
                       'Searching a tree of 10,000 nodes requires at most 14 comparisons instead of 10,000.\n'
                       '\n'
                       'Conversely, if subsequent removals or rehashing operations reduce the number of nodes in a '
                       'treeified bucket down to **`UNTREEIFY_THRESHOLD = 6`**, `HashMap` converts the Red-Black tree '
                       'back into a lightweight singly-linked list to conserve memory. The difference between '
                       'threshold 8 and 6 prevents rapid, thrashing conversions between trees and lists around the '
                       'boundary.\n'
                       '\n'
                       'To appreciate how balanced trees maintain stability, consider the foundational invariants of '
                       'the Red-Black tree:\n'
                       '1. Every node is colored either red or black.\n'
                       '2. The root node is always black.\n'
                       '3. Red nodes cannot have red children (no two consecutive red nodes on any path).\n'
                       '4. Every path from a node to any of its descendant null leaves contains the exact same number '
                       'of black nodes (black-height invariant).\n'
                       '5. When inserting a colliding key, the tree performs tree rotations (left and right pointer '
                       'pivots) and color flips to restore balance in $O(\\log N)$ time.\n'
                       'Furthermore, what happens if two colliding keys have the exact same hash code and do NOT '
                       'implement `Comparable`? To maintain deterministic ordering inside the Red-Black tree, '
                       '`HashMap` invokes a tie-breaker utility method named `tieBreakOrder(Object a, Object b)`. This '
                       'method compares their class names, and if identical, falls back to native memory identity '
                       'hashes via `System.identityHashCode(a) <= System.identityHashCode(b)`. This ensures that even '
                       'degenerate custom objects with broken `Comparable` interfaces can be deterministically ordered '
                       'within the tree structure without deadlocks or undefined states.',
            'part': 3,
            'title': 'Collision Resolution & The Treeify Threshold: Linked Lists vs Red-Black Trees',
            'tryIt': 'Try iterating through all key-value entries using map.entrySet() and print both the key and '
                     'value in a single loop traversal.'},
           {'checks': [{'answer': 0,
                        'explanation': 'The default load factor is 0.75, balancing time complexity (low collision '
                                       'probability) with space overhead.',
                        'options': ['0.75; it triggers a capacity doubling when size exceeds capacity * 0.75',
                                    '1.00; it triggers resizing only when every bucket is full',
                                    '0.50; it resizes when half of memory is exhausted',
                                    '0.25; it resizes after 4 elements'],
                        'question': 'What is the default load factor of a Java HashMap, and what does it represent?'},
                       {'answer': 0,
                        'explanation': 'Power-of-two growth means only one new bit determines the new bucket, moving '
                                       'elements to either oldIndex or oldIndex + oldCap instantly.',
                        'options': ['By checking a single bit (hash & oldCap): if 0, index stays identical; if '
                                    'non-zero, index moves to oldIndex + oldCap',
                                    'By recalculating String.hashCode() on all strings from scratch',
                                    'By sorting all keys with merge sort',
                                    'By writing entries to a temporary file on disk'],
                        'question': 'How does HashMap efficiently rehash elements when capacity doubles from C to 2C?'},
                       {'answer': 0,
                        'explanation': 'TreeMap is backed by a Red-Black tree and maintains keys in sorted order, '
                                       'providing O(log N) operations.',
                        'options': ['java.util.TreeMap',
                                    'java.util.HashMap',
                                    'java.util.LinkedHashMap',
                                    'java.util.Hashtable'],
                        'question': 'Which Map implementation maintains elements in sorted order according to a '
                                    'Comparator or natural ordering?'},
                       {'answer': 0,
                        'explanation': 'LinkedHashMap augments hash buckets with a doubly-linked list linking entries '
                                       'in insertion or access order.',
                        'options': ['By maintaining a doubly-linked list running through all entries in addition to '
                                    'the bucket table',
                                    'By sorting keys every time get() is called',
                                    'By locking the entire CPU memory bus',
                                    'By storing elements in an ArrayList'],
                        'question': 'How does LinkedHashMap maintain insertion order during iteration?'}],
            'code': 'import java.util.LinkedHashMap;\n'
                    'import java.util.Map;\n'
                    'import java.util.TreeMap;\n'
                    '\n'
                    'public class MapEcosystemLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("=== MAP ECOSYSTEM COMPARISON ===");\n'
                    '\n'
                    '        // LinkedHashMap: Preserves predictable insertion order\n'
                    '        Map<String, String> ordered = new LinkedHashMap<>();\n'
                    '        ordered.put("Alpha", "A");\n'
                    '        ordered.put("Charlie", "C");\n'
                    '        ordered.put("Beta", "B");\n'
                    '        System.out.println("LinkedHashMap (Insertion Order): " + ordered.keySet());\n'
                    '\n'
                    '        // TreeMap: Automatically sorts keys in Red-Black tree\n'
                    '        Map<String, String> sorted = new TreeMap<>();\n'
                    '        sorted.put("Alpha", "A");\n'
                    '        sorted.put("Charlie", "C");\n'
                    '        sorted.put("Beta", "B");\n'
                    '        System.out.println("TreeMap (Natural Sorted Order):  " + sorted.keySet());\n'
                    '    }\n'
                    '}',
            'content': '### 4. Load Factor, Dynamic Rehashing & Map Implementations\n'
                       '\n'
                       'To maintain its blistering $O(1)$ constant time guarantees, a `HashMap` must ensure that its '
                       'bucket array never becomes overpopulated. As the number of entries ($N$) approaches the number '
                       'of buckets ($C$), the probability of hash collisions skyrockets. To govern when the internal '
                       'table must grow, `HashMap` relies on the **Load Factor**.\n'
                       '\n'
                       'The **Load Factor** is a floating-point metric defining how full the hash table is allowed to '
                       'get before its capacity is automatically doubled. By default in Java:\n'
                       '```java\n'
                       'static final float DEFAULT_LOAD_FACTOR = 0.75f; // 75% occupancy threshold\n'
                       '```\n'
                       'The maximum number of entries the map can hold before triggering a resize is termed the '
                       '**Threshold**:\n'
                       '$$\\text{Threshold} = \\text{Capacity} \\times \\text{Load Factor}$$\n'
                       'For a fresh `HashMap` with default capacity 16 and load factor 0.75:\n'
                       '$$\\text{Threshold} = 16 \\times 0.75 = 12$$\n'
                       'When the 13th entry is inserted into the map (`size > threshold`), `HashMap` executes a '
                       '**Rehash (Resize)** operation.\n'
                       '\n'
                       'During resizing:\n'
                       '1. The table capacity doubles: from 16 to 32, 32 to 64, 64 to 128, etc.\n'
                       '2. A new `Node<K, V>[] newTable` array is allocated on the heap.\n'
                       '3. Every existing node must be transferred into the new table.\n'
                       '\n'
                       'In naive hash implementations, transferring elements requires re-computing `hash % '
                       "newCapacity` for every single node. However, because Java's capacity is strictly powers of "
                       'two, the Java architects implemented a profound bitwise optimization. When capacity doubles '
                       'from $C$ to $2C$, the bitwise mask $(2C - 1)$ has exactly ONE new high-order bit set to `1`!\n'
                       'Therefore, when an element is rehashed:\n'
                       "- If `(hash & oldCapacity) == 0`: The element's index remains **identical** (`newIndex = "
                       'oldIndex`).\n'
                       "- If `(hash & oldCapacity) != 0`: The element's index moves to **`oldIndex + oldCapacity`**!\n"
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| ENTERPRISE MAP IMPLEMENTATION LANDSCAPE                                            |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| CLASS                | ORDERING       | NULL KEYS? | THREAD SAFE? | COMPLEXITY     |\n'
                       '| -------------------- | -------------- | ---------- | ------------ | -------------- |\n'
                       '| HashMap              | None (Random)  | Yes (1)    | No           | O(1) Average   |\n'
                       '| LinkedHashMap        | Insertion/LRU  | Yes (1)    | No           | O(1) Average   |\n'
                       '| TreeMap              | Sorted (Tree)  | No         | No           | O(log N)       |\n'
                       '| ConcurrentHashMap    | None (Random)  | No (Locks) | Yes (CAS)    | O(1) Average   |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'Let us contrast the primary map implementations used across enterprise architecture:\n'
                       '1. **`HashMap`**: The premier general-purpose map. Unsynchronized, unordered, permits one null '
                       'key and unlimited null values.\n'
                       '2. **`LinkedHashMap`**: Extends `HashMap` by maintaining a doubly-linked list running through '
                       'all entries. It preserves insertion order during iteration. When constructed with `accessOrder '
                       '= true`, it updates entry order on every `get()`, serving as the standard foundation for '
                       'building in-memory **LRU (Least Recently Used) Caches** by overriding `removeEldestEntry()`.\n'
                       '3. **`TreeMap`**: Backed entirely by a Red-Black tree. Entries are strictly sorted according '
                       'to the natural ordering of keys (implementing `Comparable`) or an explicit `Comparator`. '
                       'Guarantees $O(\\log N)$ time for `containsKey`, `get`, `put`, and `remove`.\n'
                       '4. **`ConcurrentHashMap`**: The enterprise standard for multi-threaded applications. Rather '
                       'than locking the entire map like legacy `Hashtable`, it uses fine-grained per-bucket '
                       'synchronization and lock-free Compare-And-Swap (CAS) operations, permitting thousands of '
                       'concurrent readers and writers without contention.\n'
                       '\n'
                       'In high-throughput concurrent systems, understanding the internal revolution of '
                       '**`ConcurrentHashMap`** between Java 7 and Java 8 is an essential hallmark of senior '
                       'engineering expertise.\n'
                       '- In Java 7, `ConcurrentHashMap` divided its storage into an array of 16 independent `Segment` '
                       'objects, where each Segment acted as an independent reentrant lock (`ReentrantLock`). While '
                       'this allowed 16 concurrent writes, concurrency was strictly bounded by the number of '
                       'segments.\n'
                       '- In Java 8, the segment architecture was completely discarded! Modern `ConcurrentHashMap` '
                       'uses the exact same bucket array structure as standard `HashMap`, but synchronizes exclusively '
                       'on **the first node of each individual bucket (`synchronized (f)`)**.\n'
                       '- Even more impressively, when inserting an element into an empty bucket, `ConcurrentHashMap` '
                       'uses **zero locks entirely**! Instead, it performs a lock-free hardware **Compare-And-Swap '
                       '(CAS)** via `Unsafe` / `VarHandle` (`casTabAt(tab, i, null, node)`). This fine-grained '
                       'per-bucket synchronization allows thousands of threads to write concurrently across different '
                       'buckets with virtually zero thread contention.',
            'part': 4,
            'title': 'Load Factor, Dynamic Rehashing & Map Implementations',
            'tryIt': 'Try using map.putIfAbsent(key, initialValue) to avoid overwriting existing inventory entries in '
                     'a concurrent cache.'},
           {'checks': [{'answer': 0,
                        'explanation': "'java' appears 3 times in the array, so frequencyMap.get('java') evaluates to "
                                       '3.',
                        'options': ['3', '1', '2', '5'],
                        'question': "In the Day 26 countFrequency challenge, what is the frequency of 'java' for input "
                                    "['java', 'code', 'java', 'test', 'java']?"},
                       {'answer': 0,
                        'explanation': "The defensive guard 'if (words == null) return freq;' returns an empty HashMap "
                                       'cleanly without exception.',
                        'options': ['An empty HashMap with size 0',
                                    'Throws a NullPointerException',
                                    'Returns null',
                                    "Returns a map containing {'null': 1}"],
                        'question': 'What does Solution.countFrequency(null) return when protected by defensive '
                                    'guards?'},
                       {'answer': 0,
                        'explanation': "getOrDefault('keyboard', 0) returns the fallback value 0 when the key is "
                                       'absent from the inventory map.',
                        'options': ["0 (via map.getOrDefault('keyboard', 0))",
                                    '-1',
                                    'Throws a NullPointerException',
                                    'null'],
                        'question': "In the Day 26 getStock assignment, what does getStock(map, 'keyboard') return if "
                                    "'keyboard' is not in map?"},
                       {'answer': 0,
                        'explanation': 'getOrDefault eliminates verbose if-else checks, retrieving the existing tally '
                                       'or 0 cleanly in a single readable line.',
                        'options': ['It provides concise, expressive, O(1) constant-time code that eliminates '
                                    'repetitive if (!map.containsKey) boilerplate',
                                    'It compiles into native C++ code',
                                    'It prevents garbage collection pauses',
                                    'It enables multi-threading on single-core processors'],
                        'question': 'Why is map.getOrDefault(w, 0) + 1 preferred over if-else checking in frequency '
                                    'tallying?'}],
            'code': 'import java.util.HashMap;\n'
                    '\n'
                    'public class SolutionLab {\n'
                    '    public static class Solution {\n'
                    '        public static HashMap<String, Integer> countFrequency(String[] words) {\n'
                    '            HashMap<String, Integer> freq = new HashMap<>();\n'
                    '            if (words == null) return freq;\n'
                    '            for (String w : words) {\n'
                    '                freq.put(w, freq.getOrDefault(w, 0) + 1);\n'
                    '            }\n'
                    '            return freq;\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    public static class SolutionAdv {\n'
                    '        public static int getStock(HashMap<String, Integer> map, String item) {\n'
                    '            if (map == null || item == null) return 0;\n'
                    '            return map.getOrDefault(item, 0);\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        String[] sample = {"java", "code", "java", "test", "java", "code"};\n'
                    '        HashMap<String, Integer> res = Solution.countFrequency(sample);\n'
                    '        System.out.println("Tally result: " + res);\n'
                    '        System.out.println("java count:   " + res.get("java")); // 3\n'
                    '        System.out.println("code count:   " + res.get("code")); // 2\n'
                    '        System.out.println("test count:   " + res.get("test")); // 1\n'
                    '\n'
                    '        int stock = SolutionAdv.getStock(res, "java");\n'
                    '        int missing = SolutionAdv.getStock(res, "python");\n'
                    '        System.out.println("Stock \'java\':   " + stock);   // 3\n'
                    '        System.out.println("Stock \'python\': " + missing); // 0\n'
                    '    }\n'
                    '}',
            'content': '### 5. Guided Coding Lab & Milestone Verification: Building `countFrequency` and `getStock`\n'
                       '\n'
                       'To conclude Day 26 and achieve full production readiness for Milestone 5, we construct and '
                       'verify the two core key-value map implementations specified in the PinIT Career OS curriculum: '
                       '**`countFrequency`** and **`getStock`**.\n'
                       '\n'
                       'In the primary milestone challenge, we implement `Solution.countFrequency(String[] words)`. '
                       'The specification mandates ingesting an array of strings `words` and returning a '
                       '`HashMap<String, Integer>` that tallies the exact number of times each unique word appears in '
                       'the input array.\n'
                       '\n'
                       '```java\n'
                       '// ============================================================================\n'
                       '// MILESTONE 5 CHALLENGE: WORD FREQUENCY ENGINE\n'
                       '// ============================================================================\n'
                       'import java.util.HashMap;\n'
                       '\n'
                       'public class Solution {\n'
                       '    /**\n'
                       '     * Computes the occurrence frequency of each word in the provided array.\n'
                       '     * Returns an empty HashMap if the input array is null or empty.\n'
                       '     */\n'
                       '    public static HashMap<String, Integer> countFrequency(String[] words) {\n'
                       '        // Step 1: Instantiate the HashMap result container:\n'
                       '        HashMap<String, Integer> frequencyMap = new HashMap<>();\n'
                       '\n'
                       '        // Step 2: Defensive guard for null input:\n'
                       '        if (words == null) {\n'
                       '            return frequencyMap;\n'
                       '        }\n'
                       '\n'
                       '        // Step 3: Iterate through words and tally occurrences:\n'
                       '        for (String word : words) {\n'
                       '            // Using getOrDefault(word, 0) + 1 for O(1) constant-time tallying:\n'
                       '            int currentCount = frequencyMap.getOrDefault(word, 0);\n'
                       '            frequencyMap.put(word, currentCount + 1);\n'
                       '        }\n'
                       '\n'
                       '        // Step 4: Return populated frequency map:\n'
                       '        return frequencyMap;\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Let us trace `countFrequency` with input `["java", "code", "java", "test", "java", "code"]`:\n'
                       '1. "java": `getOrDefault("java", 0)` returns `0`. `put("java", 1)`. Map: `{"java": 1}`.\n'
                       '2. "code": `getOrDefault("code", 0)` returns `0`. `put("code", 1)`. Map: `{"java": 1, "code": '
                       '1}`.\n'
                       '3. "java": `getOrDefault("java", 0)` returns `1`. `put("java", 2)`. Map: `{"java": 2, "code": '
                       '1}`.\n'
                       '4. "test": `getOrDefault("test", 0)` returns `0`. `put("test", 1)`. Map: `{"java": 2, "code": '
                       '1, "test": 1}`.\n'
                       '5. "java": `getOrDefault("java", 0)` returns `2`. `put("java", 3)`. Map: `{"java": 3, "code": '
                       '1, "test": 1}`.\n'
                       '6. "code": `getOrDefault("code", 0)` returns `1`. `put("code", 2)`. Map: `{"java": 3, "code": '
                       '2, "test": 1}`.\n'
                       'Final state: `map.get("java") == 3`, `map.get("code") == 2`, `map.get("test") == 1`. Total '
                       'entries: 3.\n'
                       '\n'
                       'In the secondary assignment, we construct `SolutionAdv.getStock(HashMap<String, Integer> map, '
                       'String item)`. The method takes an inventory map and an item key, returning the current stock '
                       'count. If the item is absent from the map or if the map reference is null, it safely returns '
                       '`0`.\n'
                       '\n'
                       '```java\n'
                       '// ============================================================================\n'
                       '// ASSIGNMENT: STOCK LOOKUP MAP\n'
                       '// ============================================================================\n'
                       'import java.util.HashMap;\n'
                       '\n'
                       'public class SolutionAdv {\n'
                       '    /**\n'
                       '     * Looks up the stock quantity for a given item in the inventory map.\n'
                       '     * Returns map.getOrDefault(item, 0), handling null references safely.\n'
                       '     */\n'
                       '    public static int getStock(HashMap<String, Integer> map, String item) {\n'
                       '        if (map == null || item == null) {\n'
                       '            return 0;\n'
                       '        }\n'
                       '        return map.getOrDefault(item, 0);\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Let us verify the boundary conditions for `getStock`:\n'
                       '- **Scenario A (Item In Stock)**: `map = {"Laptop": 15, "Mouse": 40}`, `item = "Laptop"`. '
                       '`map.getOrDefault("Laptop", 0)` returns `15`.\n'
                       '- **Scenario B (Item Out of Stock / Absent)**: `item = "Monitor"`. '
                       '`map.containsKey("Monitor")` is `false`. `getOrDefault` returns the fallback value `0` '
                       'cleanly.\n'
                       '- **Scenario C (Null Map Reference)**: `map = null`, `item = "Keyboard"`. Defensive guard '
                       'intercepts null reference and returns `0` without throwing `NullPointerException`.\n'
                       '\n'
                       'In enterprise automated test suites with JUnit 5:\n'
                       '```java\n'
                       '@Test\n'
                       'void testWordFrequencyEngine() {\n'
                       '    String[] words = {"java", "code", "java", "test", "java", "code"};\n'
                       '    HashMap<String, Integer> freq = Solution.countFrequency(words);\n'
                       '\n'
                       '    assertEquals(3, freq.size());\n'
                       '    assertEquals(3, freq.get("java"));\n'
                       '    assertEquals(2, freq.get("code"));\n'
                       '    assertEquals(1, freq.get("test"));\n'
                       '    assertFalse(freq.containsKey("missing"));\n'
                       '}\n'
                       '```\n'
                       'Both methods provide zero-defect, rock-solid implementations conforming strictly to the '
                       'Milestone 5 specifications.\n'
                       '\n'
                       'In modern Java 8+, the Collections Framework also introduced higher-order functional methods '
                       'on `Map` that streamline frequency counting even further:\n'
                       '```java\n'
                       '// Method 1: Using map.merge() (Modern functional standard)\n'
                       'map.merge(word, 1, Integer::sum);\n'
                       '\n'
                       '// Method 2: Using map.compute()\n'
                       'map.compute(word, (k, v) -> (v == null) ? 1 : v + 1);\n'
                       '```\n'
                       'The `map.merge(key, value, remappingFunction)` method is particularly elegant: if the key does '
                       'not exist, it inserts `1`. If the key exists, it executes the lambda `Integer::sum`, adding '
                       'the new `1` to the existing count! Both `merge` and `compute` are executed atomically in '
                       'thread-safe collections like `ConcurrentHashMap`, making them the preferred idiomatic choice '
                       'in modern distributed microservice engineering.',
            'part': 5,
            'title': 'Guided Coding Lab & Milestone Verification: Building countFrequency and getStock',
            'tryIt': 'Try testing countFrequency on a sentence containing punctuation marks and sanitize each word '
                     'with toLowerCase() before counting.'}],
 'projectStep': {'steps': ['Author Solution.countFrequency(String[] words) returning HashMap<String, Integer> of word '
                           'counts.',
                           'Utilize map.getOrDefault(w, 0) + 1 to tally occurrences in O(1) time per word.',
                           'Author SolutionAdv.getStock(HashMap<String, Integer> map, String item) returning '
                           'map.getOrDefault(item, 0).',
                           "Verify countFrequency(['java', 'code', 'java']) produces {'java': 2, 'code': 1} and "
                           'getStock returns 0 for absent items.'],
                 'title': 'Build the Milestone 5 Word Frequency & Inventory Engine'},
 'recap': 'Yesterday we mastered dynamic lists, ArrayList internal memory growth, and iteration hazards. Today, we '
          'step into associative key-value data structures and our Milestone 5 Capstone: discovering how HashMaps '
          'achieve O(1) lookups through hashing and bucket trees.',
 'summary': ['The Map<K, V> interface defines an associative contract mapping unique keys to values.',
             'HashMap stores entries in a bucket array (Node<K, V>[] table) with lazy power-of-two capacity '
             'initialization.',
             'Index calculation uses bitwise masking ((capacity - 1) & hash) with high-bit XOR spreading for O(1) '
             'resolution.',
             'Java 8+ converts degrading collision linked lists into balanced Red-Black trees when bucket length '
             'reaches 8.',
             'Dynamic rehashing doubles capacity when size exceeds capacity * 0.75, splitting buckets using bitwise '
             'checks.',
             'Milestone 5 Capstone implements countFrequency and getStock utilizing getOrDefault for resilient '
             'tallying.'],
 'title': 'Java Collections Framework II: Key-Value Maps & HashMap Mechanics'}
