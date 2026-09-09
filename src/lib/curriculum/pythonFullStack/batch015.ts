// src/lib/curriculum/pythonFullStack/batch015.ts
// Single Source of Truth for PINIT BATCH 015: Month 4 · Week 15 · Days 73–77
// Core Data Structures: Hashing, Hash Tables, Collision Resolution & Key-Value Invariants
// Pedagogical Flow: UNDERSTAND (Hash Functions, Determinism & Hash Stability) -> APPLY (Collision Resolution: Separate Chaining vs Open Addressing) -> BUILD (ChainedHashTable with Dynamic Resizing & Load Factor) -> DEBUG (Hashing Traps, Mutability Hazards & Tombstone Errors) -> TRANSFER (Formative Hashing Synthesis: Chained Map & Distribution Diagnostics)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_HASHING_AND_KEY_VALUE = 'comp-pfs-m4-015';

// ── CANONICAL DOMAIN EXCEPTIONS FOR HASHING & KEY-VALUE STRUCTURES ──
// Used across all instruction, labs, challenges, and assessment contracts:
// 1. HashStructureError: Base class for all hash table and key-value invariant failures.
// 2. KeyNotFoundError: Raised when retrieving, deleting, or peeking a non-existent key.
// 3. TableFullError: Raised when inserting into a saturated, non-resizable open addressing table.
// 4. UnhashableKeyError: Raised when an unhashable type (e.g. mutable list/dict) is passed to set, get, delete, or contains.
// 5. InvalidCapacityError: Raised when initializing a hash table with capacity <= 0 or invalid resizing parameters.

// ── DAY 73: UNDERSTAND — The Hashing Contract, Hash Functions & Hash Stability ──
export const DAY_73_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w15-015',
  dayNumber: 1,
  title: 'The Hashing Contract, Hash Functions & Hash Stability',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b15-d73-01',
      type: 'THEORY',
      order: 1,
      title: 'The Mathematical Hashing Mapping & Hash Table Foundations',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the fundamental computer science distinction between an Associative Map ADT and a physical Hash Table data structure, the mathematical properties of hash functions, and why determinism and uniformity are required for average O(1) performance.',
      whatItIs: 'A Hash Function is a deterministic mathematical function h: K -> Z that maps keys from an arbitrarily large universe of inputs into fixed-size integer values. A Hash Table is an array-backed data structure that uses this integer to compute an array bucket index (index = hash(key) % capacity), achieving average O(1) key lookups and insertions.',
      whyItExists: 'Sequential array searches take O(n) time, and binary search requires sorted, contiguous memory taking O(log n) time while incurring O(n) insertion costs. Hash tables provide near-instant O(1) expected time for insert, search, and delete without requiring elements to maintain global sorted order.',
      problemSolved: 'Eliminates linear scanning bottlenecks across associative indexing, set membership tests, caching layers, and database primary key index lookups.',
      mentalModel: 'The Library Subject Catalog vs The Infinite Shelf: Rather than searching every bookshelf sequentially from left to right (O(n)), a patron consults a deterministic catalog code (hash) that directs them immediately to a specific aisle and shelf section (bucket index) in O(1) time.',
      realWorldUse: 'Python dict and set internals, database hash indexes, routing tables, in-memory caches, symbol tables in compilers, and deduplication pipelines.',
      commonMistakes: [
        'Confusing general-purpose hash table hashing with cryptographic hashing (e.g., using slow SHA-256 for internal dictionary lookups, or using fast Python hash() for password storage).',
        'Believing that hash(a) == hash(b) implies a == b (the converse of the hash invariant; collisions are a mathematical certainty).',
        'Assuming string hashing produces identical integer values across separate Python processes without accounting for randomized hash seeds.',
      ],
      commonMisconceptions: [
        'Misconception: "Hash tables provide absolute worst-case O(1) lookup guarantees." Reality: Worst-case lookup in an unmitigated hash table is O(n) if all keys collide into the same bucket. O(1) is an average/expected complexity bound predicated on uniform distribution.',
        'Misconception: "Python string hashes are constant across all computers and runs." Reality: Python initializes PYTHONHASHSEED with a random secret per process to prevent algorithmic complexity denial-of-service attacks (HashDoS); identical strings produce different hash integers across independent interpreter lifecycles.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b15-d73-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Python hash(), CPython Hashing Mechanics & The Hash Stability Invariant',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Detailed examination of the Python built-in hash() function, CPython internal hashing mechanisms, the strict mathematical contract between __hash__ and __eq__, and the critical Hash Stability Invariant.',
      language: 'python',
      codeSnippet: `"""
CPython Hashing Architecture Context:
Python's built-in hash() provides hash codes for hashable objects.
In CPython, hashing for str, bytes, and memoryview uses a build-configurable hash algorithm
such as SipHash-1-3, SipHash-2-4, or FNV; a short-input optimization may also apply.
Numeric types use a separate numeric hashing scheme based on modular arithmetic (sys.hash_info).
Cryptographic hash functions like SHA-256 provide preimage and collision resistance for security,
whereas hash table functions prioritize speed and uniform bucket dispersion.

THE CORE HASH CONTRACT INVARIANT:
  If a == b:
      hash(a) MUST equal hash(b)
  The converse does NOT hold:
      hash(a) == hash(b) does NOT imply a == b (this is a collision!)

THE HASH STABILITY INVARIANT:
  A key's hash and equality behavior must remain completely stable
  for the entire duration that the key resides inside a hash table.
"""

# 1. Demonstrating the Hash Invariant
a = 42
b = 42.0
assert a == b
assert hash(a) == hash(b)  # Invariant holds: equality implies equal hash!

# 2. Demonstrating Collisions (Equal hashes, unequal objects)
# While rare for built-in types, collisions are physically inevitable:
# For example, in modular reduction: 1 % 8 == 9 % 8 == 1, but 1 != 9.

# 3. The Mutable Key Hazard (The "Phantom Key" Trap)
class MutableCoordinate:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __hash__(self):
        return hash((self.x, self.y))

    def __eq__(self, other):
        if not isinstance(other, MutableCoordinate):
            return False
        return (self.x, self.y) == (other.x, other.y)

# Creating an entry in a dictionary:
point = MutableCoordinate(10, 20)
registry = {point: "Warehouse Alpha"}

print("Initial lookup:", registry[point])  # Succeeds: "Warehouse Alpha"

# DANGEROUS MUTATION: Modifying the object while it is inside the table
point.x = 999  # Hash changes!

try:
    print("Post-mutation lookup:", registry[point])
except KeyError:
    print("CRITICAL DEFECT: Key has become an unreachable phantom!")
    # The entry still sits in the old bucket corresponding to hash((10, 20)),
    # but registry[point] now searches the bucket corresponding to hash((999, 20))!
`,
      expectedOutput: `Initial lookup: Warehouse Alpha
Post-mutation lookup: CRITICAL DEFECT: Key has become an unreachable phantom!`,
    } as ExampleBlock,
    {
      id: 'blk-b15-d73-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Enforcing the Hash Stability Invariant: Building Immutable Value Objects',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Examine the EntityId class design intended for mission-critical dictionary keys.',
        'Enforce immutability by setting _namespace and _uid in __init__ and raising TypeError if invalid types are provided.',
        'Cache the computed hash code in self._hash = hash((self._namespace, self._uid)) to guarantee O(1) hash evaluation.',
        'Implement __hash__() to return the cached integer hash and __eq__() to compare namespace and uid equality.',
      ],
      expectedOutcome: 'An immutable, hash-stable EntityId value class suitable for safe associative map keys that never becomes an unreachable phantom key.',
      starterCode: `class EntityId:
    """
    An immutable domain identifier engineered for hash table safety.
    Invariants:
      1. namespace and uid are set at initialization and must not be mutated.
      2. If a == b, then hash(a) == hash(b).
      3. Caches computed hash code to guarantee O(1) hash evaluation and complete stability.
    """
    def __init__(self, namespace: str, uid: int):
        # TODO: Validate types and cache immutable hash
        pass

    def get_namespace(self) -> str:
        # TODO: Return namespace
        pass

    def get_uid(self) -> int:
        # TODO: Return uid
        pass

    def __hash__(self) -> int:
        # TODO: Return cached hash
        pass

    def __eq__(self, other: object) -> bool:
        # TODO: Implement symmetric equality
        pass
`,
      solutionReference: `class EntityId:
    def __init__(self, namespace: str, uid: int):
        if not isinstance(namespace, str) or not isinstance(uid, int):
            raise TypeError("namespace must be str and uid must be int")
        self._namespace = namespace
        self._uid = uid
        self._hash = hash((self._namespace, self._uid))

    def get_namespace(self) -> str:
        return self._namespace

    def get_uid(self) -> int:
        return self._uid

    def __hash__(self) -> int:
        return self._hash

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, EntityId):
            return False
        return self._namespace == other._namespace and self._uid == other._uid
`,
      hints: [
        'Compute self._hash in __init__ using a tuple of the immutable attributes: hash((self._namespace, self._uid)).',
        'Never allow self._namespace or self._uid to be mutated after construction.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b15-d73-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: The Hash Contract & Hash Stability Boundaries',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is modifying an attribute of an object currently stored as a dictionary key considered one of the most insidious bugs in Python software engineering?',
      options: [
        'Python immediately raises a MutableKeyMutationError as soon as an attribute assignment occurs.',
        'The object will be physically deleted from RAM by the Python garbage collector.',
        'The newly calculated hash will map future lookups to a different bucket, making the object unretrievable while remaining stuck in the old bucket.',
        'Modifying the object causes the underlying C array to automatically reallocate as a linked list.',
      ],
      correctIndex: 2,
      explanation: 'Because hash table lookups compute bucket = hash(key) % capacity, altering any field contributing to the hash causes future lookups to query the wrong bucket slot. The object still resides in the old bucket, creating both a lookup failure and an unintended memory retention bug.',
      misconceptionIdentified: 'Believing that Python automatically detects or moves keys when their internal fields change inside a hash table.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 74: APPLY — Collision Resolution Mechanics: Separate Chaining vs Open Addressing ──
export const DAY_74_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w15-015',
  dayNumber: 2,
  title: 'Collision Resolution Mechanics: Separate Chaining vs Open Addressing',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b15-d74-01',
      type: 'THEORY',
      order: 1,
      title: 'The Pigeonhole Principle & The Two Collision Resolution Paradigms',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn why hash collisions are mathematically guaranteed by the Pigeonhole Principle, and analyze the architectural trade-offs between Separate Chaining and Open Addressing with Linear Probing.',
      whatItIs: 'The Pigeonhole Principle states that if n items are put into m containers, with n > m, then at least one container must contain more than one item. Because the universe of possible keys |K| vastly exceeds bucket capacity M, collisions are physically unavoidable. Data structures resolve collisions via: 1) Separate Chaining (closed addressing with secondary bucket lists), or 2) Open Addressing (closed hashing directly in the table array via probing sequences).',
      whyItExists: 'Without collision resolution, inserting a second key that maps to an occupied bucket index would either overwrite the existing key (destroying data) or reject the insertion (breaking associative map semantics).',
      problemSolved: 'Guarantees reliable multi-key storage and retrieval even when multiple distinct keys hash to the identical modulo bucket index.',
      mentalModel: 'The Coat Check: Separate Chaining gives each numbered hook a clothes hanger holding multiple coats (a chain). Open Addressing insists on one coat per hook: if hook 7 is taken, you walk down the row to the first vacant hook (8, 9, 10...) to hang your coat.',
      realWorldUse: 'Java HashMap and C++ std::unordered_map historically use Separate Chaining; Python dict and CPython internals use Open Addressing with compact index tables and pseudo-random probing.',
      commonMistakes: [
        'Deleting an item in open addressing by writing None over the slot, which breaks the probe chain for collided keys inserted afterward.',
        'Failing to recognize primary clustering in linear probing, where adjacent occupied slots merge into long chains that degrade performance toward O(n).',
        'Assuming separate chaining never needs resizing because chains can grow arbitrarily long.',
      ],
      commonMisconceptions: [
        'Misconception: "A better hash function can completely eliminate collisions." Reality: The Pigeonhole Principle proves that as soon as you have more potential keys than buckets, collisions are mathematically certain.',
        'Misconception: "Open addressing is always slower than separate chaining." Reality: Open addressing stores elements contiguously in a flat array, offering superior CPU L1/L2 cache locality compared to the pointer-chasing memory jumps of separate chaining.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b15-d74-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Deleted-Slot / Tombstone Confusion in Open Addressing vs Separate Chaining',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Detailed technical comparison of how Separate Chaining handles deletions effortlessly by unlinking nodes, contrasted with why Open Addressing requires a dedicated TOMBSTONE sentinel to prevent probe chains from terminating prematurely.',
      language: 'python',
      codeSnippet: `"""
OPEN ADDRESSING: THE TOMBSTONE INVARIANT
In Open Addressing (linear probing):
  When searching for key K:
    probe index = hash(K) % capacity
    while slot is not NEVER_USED:
        if slot matches K: return value
        probe index = (probe index + 1) % capacity
    raise KeyNotFoundError()

THE DELETED-SLOT TRAP:
If we delete a slot by resetting it to None (NEVER_USED),
any key inserted AFTER that slot during a collision probe sequence
will become unreachable because the search loop terminates prematurely at the None!

SOLUTION: A unique TOMBSTONE sentinel distinguishes a DELETED slot from a NEVER_USED slot.
A probe search continues past TOMBSTONES, while an insertion can reuse a TOMBSTONE slot.
"""

# Unique identity-based tombstone sentinel
_TOMBSTONE = object()
_EMPTY = object()

class ToyOpenAddressingMap:
    def __init__(self, capacity=5):
        self._capacity = capacity
        self._slots = [_EMPTY] * capacity

    def put(self, key, value):
        idx = hash(key) % self._capacity
        first_tombstone = None
        for _ in range(self._capacity):
            slot = self._slots[idx]
            if slot is _EMPTY:
                target = first_tombstone if first_tombstone is not None else idx
                self._slots[target] = (key, value)
                return
            if slot is _TOMBSTONE and first_tombstone is None:
                first_tombstone = idx
            elif slot is not _TOMBSTONE and slot[0] == key:
                self._slots[idx] = (key, value)  # Overwrite
                return
            idx = (idx + 1) % self._capacity
        if first_tombstone is not None:
            self._slots[first_tombstone] = (key, value)
            return
        raise RuntimeError("Table full")

    def get(self, key):
        idx = hash(key) % self._capacity
        for _ in range(self._capacity):
            slot = self._slots[idx]
            if slot is _EMPTY:
                raise KeyError(key)  # Never-used slot terminates probe!
            if slot is not _TOMBSTONE and slot[0] == key:
                return slot[1]
            idx = (idx + 1) % self._capacity
        raise KeyError(key)

    def delete(self, key):
        idx = hash(key) % self._capacity
        for _ in range(self._capacity):
            slot = self._slots[idx]
            if slot is _EMPTY:
                raise KeyError(key)
            if slot is not _TOMBSTONE and slot[0] == key:
                val = slot[1]
                self._slots[idx] = _TOMBSTONE  # CRITICAL: Mark as deleted, NOT _EMPTY!
                return val
            idx = (idx + 1) % self._capacity
        raise KeyError(key)
`,
      expectedOutput: ``,
    } as ExampleBlock,
    {
      id: 'blk-b15-d74-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Tracing Bucket Chain Preservation Across Deletions',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Inspect ToyChainedBucket which stores [key, value] pairs in a linear list.',
        'Implement set(key, value): update existing value if key found (return False), else append [key, value] (return True).',
        'Implement get(key): scan chain and return value, or raise KeyError if key not found.',
        'Implement delete(key): remove pair from chain, return value, and ensure remaining chain elements are not broken.',
      ],
      expectedOutcome: 'A verified bucket chain demonstrating that deleting any node (head, middle, or tail) leaves all other collided keys intact and retrievable.',
      starterCode: `class ToyChainedBucket:
    """
    A single separate-chaining bucket storing [key, value] pairs.
    Maintains items in order of insertion.
    """
    def __init__(self):
        self.chain = []

    def set(self, key, value):
        # TODO: Implement set with overwrite detection
        pass

    def get(self, key):
        # TODO: Implement get with KeyError defense
        pass

    def delete(self, key):
        # TODO: Implement delete returning removed value
        pass

    def contains(self, key):
        # TODO: Implement membership check
        pass
`,
      solutionReference: `class ToyChainedBucket:
    def __init__(self):
        self.chain = []

    def set(self, key, value):
        for entry in self.chain:
            if entry[0] == key:
                entry[1] = value
                return False
        self.chain.append([key, value])
        return True

    def get(self, key):
        for entry in self.chain:
            if entry[0] == key:
                return entry[1]
        raise KeyError(key)

    def delete(self, key):
        for i, entry in enumerate(self.chain):
            if entry[0] == key:
                val = entry[1]
                del self.chain[i]
                return val
        raise KeyError(key)

    def contains(self, key):
        for entry in self.chain:
            if entry[0] == key:
                return True
        return False
`,
      hints: [
        'Iterate through self.chain and compare entry[0] with key.',
        'When deleting, record entry[1], call del self.chain[i], and return the recorded value.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b15-d74-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Tombstones vs Never-Used Slots in Open Addressing',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In an open addressing hash table with linear probing, why does overwriting a deleted slot with None break future lookups for other keys?',
      options: [
        'None triggers a Python TypeError inside the hash() built-in.',
        'Future searches terminate immediately upon encountering None, failing to inspect collided keys probed beyond that slot.',
        'Setting a slot to None causes the array size to be recalculated as smaller.',
        'None permanently corrupts the CPU cache line for all adjacent indices.',
      ],
      correctIndex: 1,
      explanation: 'In open addressing, a search probe sequence stops when it reaches an empty (never-used) slot, knowing the key was never inserted. If a deleted slot is set to None, the search assumes the key does not exist and stops prematurely, hiding any collided keys placed further down the probe chain.',
      misconceptionIdentified: 'Believing that None and a tombstone sentinel serve the same function in open addressing.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 75: BUILD — Invariant-Driven Hash Table with Dynamic Resizing & Load Factor Management ──
export const DAY_75_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w15-015',
  dayNumber: 3,
  title: 'Invariant-Driven Hash Table with Dynamic Resizing & Load Factor Management',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b15-d75-01',
      type: 'THEORY',
      order: 1,
      title: 'Load Factor Physics, Amortized O(1) Growth & Rehashing Mechanics',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the mathematical definition of Load Factor (alpha = n/M), why collision probability increases non-linearly with load, and how geometric table doubling achieves amortized O(1) operations.',
      whatItIs: 'The Load Factor (alpha) is the ratio of stored items n to total bucket capacity M (alpha = n / M). In Separate Chaining, alpha represents the average chain length per bucket. When alpha reaches a critical threshold (typically alpha >= 0.75), the table must dynamically resize by allocating 2 * M buckets and rehashing every stored key into the new array.',
      whyItExists: 'As n grows relative to M, bucket chains lengthen. Without resizing, lookup complexity degrades from O(1) toward O(n) linear search. Resizing preserves the average O(1) bound.',
      problemSolved: 'Maintains constant-time access latency as datasets scale from tens of elements to millions of elements.',
      mentalModel: 'The Post Office Mailboxes: If 100 residents share 10 mailboxes (alpha = 10), the mail carrier must sift through 10 letters per box. When the town builds 200 mailboxes (alpha = 0.5), almost every resident gets their own box, making mail pickup instantaneous.',
      realWorldUse: 'All industrial hash maps (Python dict, Java HashMap, Go map, C++ std::unordered_map) dynamically resize and rehash based on load factor thresholds.',
      commonMistakes: [
        'Forgetting that rehashing requires recomputing bucket indices: slot = hash(key) % new_capacity (not copying buckets verbatim).',
        'Triggering resizing on the wrong item count (e.g. for M=8, alpha >= 0.75 is reached at n=6, since 6/8 = 0.75).',
        'Incrementing the size counter when updating the value of an existing key, which corrupts the load factor.',
      ],
      commonMisconceptions: [
        'Misconception: "Resizing is an expensive O(n) operation, so hash tables are not O(1)." Reality: Resizing occurs geometrically (capacity doubles). By the aggregate method of amortized analysis, n insertions cost O(n) total rehash work, yielding amortized O(1) time per operation.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b15-d75-02',
      type: 'GUIDED_PRACTICE',
      order: 2,
      title: 'Building ChainedHashTable with Dynamic Resizing & Uniform Exception Handling',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Initialize ChainedHashTable with initial_capacity (default 8) and max_load_factor (default 0.75). Validate parameters > 0.',
        'Implement _hash_key(key): catch TypeError on unhashable keys and raise UnhashableKeyError.',
        'Implement set(key, value): update existing keys in-place without incrementing size; append new keys and increment size; resize to 2*capacity when load_factor() >= max_load_factor.',
        'Implement get(key) and delete(key): raise KeyNotFoundError on missing keys; handle None value payloads cleanly.',
        'Implement contains(key), size(), capacity(), and load_factor().',
      ],
      expectedOutcome: 'A robust, dynamically resizable ChainedHashTable implementation handling collision chains, in-place overwrites, 6th-item resizing for capacity 8, and uniform UnhashableKeyError handling.',
      starterCode: `class HashStructureError(Exception):
    pass

class KeyNotFoundError(HashStructureError):
    pass

class TableFullError(HashStructureError):
    pass

class UnhashableKeyError(HashStructureError):
    pass

class InvalidCapacityError(HashStructureError):
    pass

class ChainedHashTable:
    def __init__(self, initial_capacity=8, max_load_factor=0.75):
        # TODO: Validate parameters and allocate bucket arrays
        pass

    def set(self, key, value):
        # TODO: Implement set with in-place overwrite and resizing
        pass

    def get(self, key):
        # TODO: Implement get with KeyNotFoundError
        pass

    def delete(self, key):
        # TODO: Implement delete with KeyNotFoundError
        pass

    def contains(self, key):
        # TODO: Implement contains
        pass

    def size(self):
        # TODO: Return stored size
        pass

    def capacity(self):
        # TODO: Return capacity
        pass

    def load_factor(self):
        # TODO: Return size / capacity
        pass
`,
      solutionReference: `class HashStructureError(Exception):
    pass

class KeyNotFoundError(HashStructureError):
    pass

class TableFullError(HashStructureError):
    pass

class UnhashableKeyError(HashStructureError):
    pass

class InvalidCapacityError(HashStructureError):
    pass

class ChainedHashTable:
    def __init__(self, initial_capacity=8, max_load_factor=0.75):
        if initial_capacity <= 0 or max_load_factor <= 0:
            raise InvalidCapacityError("Invalid capacity or load factor parameters.")
        self._capacity = initial_capacity
        self._max_load_factor = max_load_factor
        self._size = 0
        self._buckets = [[] for _ in range(self._capacity)]

    def _hash_key(self, key):
        try:
            return hash(key) % self._capacity
        except TypeError:
            raise UnhashableKeyError(f"Key of type {type(key).__name__} is unhashable.")

    def set(self, key, value):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for entry in bucket:
            if entry[0] == key:
                entry[1] = value
                return
        bucket.append([key, value])
        self._size += 1
        if self.load_factor() >= self._max_load_factor:
            self._resize(self._capacity * 2)

    def get(self, key):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for entry in bucket:
            if entry[0] == key:
                return entry[1]
        raise KeyNotFoundError(f"Key {key!r} not found in table.")

    def delete(self, key):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for i, entry in enumerate(bucket):
            if entry[0] == key:
                val = entry[1]
                del bucket[i]
                self._size -= 1
                return val
        raise KeyNotFoundError(f"Key {key!r} not found in table.")

    def contains(self, key):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for entry in bucket:
            if entry[0] == key:
                return True
        return False

    def size(self):
        return self._size

    def capacity(self):
        return self._capacity

    def load_factor(self):
        return self._size / self._capacity

    def _resize(self, new_capacity):
        old_buckets = self._buckets
        self._capacity = new_capacity
        self._buckets = [[] for _ in range(new_capacity)]
        self._size = 0
        for bucket in old_buckets:
            for key, value in bucket:
                self.set(key, value)
`,
      hints: [
        'Notice that 6 / 8 = 0.75, so for initial capacity 8, the 6th item triggers resizing to 16.',
        'Always wrap hash(key) in a try-except TypeError block raising UnhashableKeyError.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b15-d75-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Verifying Invariants: Overwriting Existing Keys & Load Factor Accuracy',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Construct test assertions evaluating the overwrite behavior of ChainedHashTable.',
        'Assert that updating an existing key 50 times leaves size() at 1 and capacity() at 8.',
        'Assert that load_factor() remains 1/8 and does not drift upward.',
      ],
      expectedOutcome: 'Automated verification proving that key updates execute in-place without corrupting the table size counter or triggering premature table resizing.',
      starterCode: `def verify_overwrite_invariant(table_cls):
    table = table_cls(initial_capacity=8, max_load_factor=0.75)
    # TODO: Write overwrite assertions
    pass
`,
      solutionReference: `def verify_overwrite_invariant(table_cls):
    table = table_cls(initial_capacity=8, max_load_factor=0.75)
    table.set("service_url", "http://alpha:8000")
    assert table.size() == 1
    assert table.capacity() == 8
    assert table.load_factor() == 1 / 8

    for i in range(50):
        table.set("service_url", f"http://alpha:{8000 + i}")
        assert table.size() == 1, "Overwrite must NOT increase size!"
        assert table.capacity() == 8, "Overwrite must NOT trigger resize!"
        assert table.load_factor() == 1 / 8

    assert table.get("service_url") == "http://alpha:8049"
    print("Overwrite invariant fully verified!")
`,
      hints: [
        'Check that table.size() remains 1 across all 50 overwrites.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b15-d75-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Load Factor Math & Resizing Trigger Point',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Given a hash table initialized with capacity M = 8 and a resizing threshold of alpha >= 0.75, which insertion triggers dynamic table doubling?',
      options: [
        'The 5th insertion (5 / 8 = 0.625)',
        'The 6th insertion (6 / 8 = 0.750)',
        'The 7th insertion (7 / 8 = 0.875)',
        'The 8th insertion (8 / 8 = 1.000)',
      ],
      correctIndex: 1,
      explanation: 'Since 6 / 8 = 0.75, inserting the 6th element immediately satisfies the threshold alpha >= 0.75, triggering dynamic doubling to capacity 16.',
      misconceptionIdentified: 'Believing that alpha >= 0.75 requires strictly greater than 75% load rather than being satisfied at exactly 75%.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 76: DEBUG — Hashing Traps, Mutability Corruptions & Probing Boundary Failures ──
export const DAY_76_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w15-015',
  dayNumber: 4,
  title: 'Hashing Traps, Mutability Corruptions & Probing Boundary Failures',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b15-d76-01',
      type: 'THEORY',
      order: 1,
      title: 'Anatomy of 4 Classic Hashing Architectural Defects',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Analyze four catastrophic hashing defects encountered in systems software: mutable key phantom bugs, __hash__/__eq__ asymmetry, Deleted-slot / tombstone confusion that prematurely terminates probe chains, and load factor overwrite drift.',
      whatItIs: 'Rigorous diagnostic taxonomy of subtle bugs that compromise hash table integrity: 1) Mutating attributes that define an object hash after insertion, 2) Breaking the invariant that equality implies equal hash codes, 3) Deleted-slot / tombstone confusion that prematurely terminates probe chains in open addressing, and 4) Artificially inflating load factor on key overwrites.',
      whyItExists: 'These defects bypass standard syntax checkers and compiler warnings because all methods execute without syntax errors while silently violating mathematical invariants and corrupting state.',
      problemSolved: 'Provides systematic diagnostic procedures to identify and isolate hash table corruption and phantom key leaks.',
      mentalModel: 'The Moving Safe: If you lock valuables in a bank safe located in Vault 3, and a bank employee secretly moves the safe to Vault 9 without updating the directory, your key will fit the lock but you will search Vault 3 and report your valuables lost forever.',
      realWorldUse: 'Debugging session token lookups, routing map leaks, caching invalidation bugs, and entity tracking engines.',
      commonMistakes: [
        'Defining __eq__ on a class without defining __hash__, causing Python to set __hash__ = None and crash on insertion.',
        'Overwriting a deleted entry with None in linear probing, cutting off downstream collided keys.',
        'Allowing mutable objects like lists or dicts to be inserted as keys without defensive validation.',
      ],
      commonMisconceptions: [
        'Misconception: "If my class works as a dictionary key today, it will always work." Reality: If any attribute used in __hash__ can be reassigned or mutated, the class is a ticking time-bomb as a hash key.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b15-d76-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge: Triaging a Corrupted Key-Value Engine',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An internal key-value cache contains 3 critical defects: (1) Calling put() with an unhashable key crashes with unhandled TypeError; (2) Overwriting an existing key increments self._size, causing artificial load factor inflation; (3) get() returns None for missing keys, creating an unresolvable ambiguity when None is a valid payload.',
      symptom: 'Worker tasks crash on unhashable inputs, cache capacity doubles prematurely under heavy overwrite workloads, and callers cannot distinguish missing keys from stored None values.',
      brokenArtifact: `class CorruptedKeyValueCache:
    def __init__(self, capacity=8):
        self._capacity = capacity
        self._size = 0
        self._buckets = [[] for _ in range(capacity)]

    def put(self, key, value):
        idx = hash(key) % self._capacity
        bucket = self._buckets[idx]
        for entry in bucket:
            if entry[0] == key:
                entry[1] = value
                self._size += 1
                return
        bucket.append([key, value])
        self._size += 1

    def get(self, key):
        idx = hash(key) % self._capacity
        bucket = self._buckets[idx]
        for entry in bucket:
            if entry[0] == key:
                return entry[1]
        return None
`,
      expectedBehavior: 'All 3 defects are patched: UnhashableKeyError is raised on unhashable inputs, overwriting an existing key updates in-place without incrementing size, and get() raises KeyNotFoundError on absent keys.',
      difficulty: 'INTERMEDIATE',
      hints: [
        'Wrap hash(key) in a try-except block catching TypeError and raising UnhashableKeyError.',
        'When overwriting an existing key in a bucket, return immediately without incrementing self._size.',
        'In get(), raise KeyNotFoundError when the key is absent so caller can distinguish missing key from value None.',
      ],
      targetCompetencyId: COMPETENCY_ID_HASHING_AND_KEY_VALUE,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b15-d76-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Writing Automated Invariant Tests for Collision Chain Preservation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Construct an automated invariant test using small numeric keys k1=1 and k2=9 for initial capacity 8.',
        'Verify that both keys hash to bucket 1 (1 % 8 == 1 and 9 % 8 == 1) while 1 != 9.',
        'Assert that deleting key 1 returns its value and leaves key 9 fully retrievable.',
        'Assert that subsequent get(1) raises KeyNotFoundError.',
      ],
      expectedOutcome: 'A deterministic collision chain test proving that deleting the head of a collision chain does not orphan or disconnect subsequent collided keys.',
      starterCode: `def test_deterministic_collision_chain_defense(table_cls):
    """
    Deterministic collision verification:
      For capacity M=8:
      Small integer keys k1=1 and k2=9 satisfy:
        1 % 8 == 1
        9 % 8 == 1
        1 != 9
    """
    table = table_cls(initial_capacity=8)
    # TODO: Implement deterministic collision test
    pass
`,
      solutionReference: `def test_deterministic_collision_chain_defense(table_cls):
    table = table_cls(initial_capacity=8)
    table.set(1, "First Value")
    table.set(9, "Second Value")

    assert table.get(1) == "First Value"
    assert table.get(9) == "Second Value"

    deleted = table.delete(1)
    assert deleted == "First Value"

    assert table.get(9) == "Second Value"

    try:
        table.get(1)
        assert False, "Should have raised KeyNotFoundError"
    except Exception as e:
        assert e.__class__.__name__ == "KeyNotFoundError"

    print("Collision chain preservation verified!")
`,
      hints: [
        'Notice that 1 and 9 both map to bucket index 1 when capacity is 8.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b15-d76-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: The __hash__ and __eq__ Symmetry Rule',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'If class UserAccount overrides __eq__ to compare self.user_id, but does NOT override __hash__, what happens when two UserAccount instances with user_id = 42 are used as dictionary keys in Python?',
      options: [
        'Python automatically derives an integer hash from the user_id attribute.',
        'Python raises TypeError: unhashable type: "UserAccount" because defining __eq__ without __hash__ sets __hash__ = None.',
        'Both objects hash to 0 by default, causing a guaranteed collision.',
        'Python converts the dictionary into a tuple of user_ids.',
      ],
      correctIndex: 1,
      explanation: 'In Python, if a class defines __eq__ but not __hash__, Python explicitly sets __hash__ = None. Attempting to hash the object or insert it into a set or dict raises a TypeError, protecting developers from accidentally using mutable equality with identity hashing.',
      misconceptionIdentified: 'Believing that Python falls back to object identity hashing when __eq__ is overridden.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 77: TRANSFER — Formative Assessment: Resilient Key-Value Store & Collision Analysis Engine ──
export const DAY_77_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m4-w15-015',
  assessmentCode: 'ASM-PFS-M4-W15-015',
  title: 'Batch 015 Formative Assessment: Resilient Chained Map & Collision Distribution Analyzer',
  description: 'Synthesize Hash Functions, Hash Stability, Collision Resolution, Dynamic Resizing, and Distribution Diagnostics in a mission-critical in-memory key-value subsystem.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'INTERMEDIATE',
  timeLimitMinutes: 90,
  passingScore: 70,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_HASHING_AND_KEY_VALUE,
  batchId: 'batch-pfs-m4-w15-015',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
  items: [
    {
      id: 'item-b15-01',
      assessmentId: 'asm-pfs-m4-w15-015',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 90,
      version: '1.0.0',
      prompt: `Implement two mission-critical data structures for an in-memory storage and diagnostic engine:

TASK A: ChainedHashTable (Dynamic Resizable Separate-Chaining Map)
Contract & Complexity:
- Initialize with initial_capacity: int = 8, max_load_factor: float = 0.75.
  Raise InvalidCapacityError if initial_capacity <= 0 or max_load_factor <= 0.
- set(key, value): O(1) amortized time.
  - If key is unhashable, raise UnhashableKeyError.
  - If key exists, update value in-place without incrementing size.
  - If key is absent, insert [key, value] into bucket and increment size.
  - If load_factor() >= max_load_factor, trigger dynamic doubling (_resize(capacity * 2)) and rehash all elements.
    Note: For capacity 8, adding the 6th item (6/8 = 0.75) MUST trigger resize to capacity 16.
- get(key): O(1) average time, O(n) worst-case.
  - If key is unhashable, raise UnhashableKeyError.
  - Return value. Raise KeyNotFoundError if key absent.
  - INVARIANT: None is a valid payload (set("k", None)). Calling get("k") must return None, NOT raise KeyNotFoundError.
- delete(key): O(1) average time.
  - If key is unhashable, raise UnhashableKeyError.
  - Remove entry, decrement size, and return removed value. Raise KeyNotFoundError if key absent.
- contains(key) -> bool: O(1) average time.
  - If key is unhashable, raise UnhashableKeyError.
  - Return True if key exists, False otherwise.
- size() -> int, capacity() -> int, load_factor() -> float.

TASK B: KeyDistributionAnalyzer (Collision Frequency & Uniformity Diagnostics)
Contract & Complexity:
- Initialize with bucket_count: int.
  Raise InvalidCapacityError if bucket_count <= 0.
- record_key(key): O(1) time.
  - If key is unhashable, raise UnhashableKeyError.
  - Compute bucket = hash(key) % bucket_count, increment counter for that bucket, and return assigned bucket index.
- bucket_depth(bucket_index: int) -> int:
  - Return count of keys mapped to bucket_index. Raise IndexError if bucket_index < 0 or bucket_index >= bucket_count.
- max_chain_length() -> int:
  - Return maximum count across all buckets in O(M) time.
- empty_bucket_count() -> int:
  - Return count of buckets with 0 recorded keys.
- variance() -> float:
  - Return the mathematical variance of bucket depths:
    $$ \mu=\frac{N}{M} $$
    $$ \sigma^2=\frac{1}{M}\sum_{i=0}^{M-1}(depth_i-\mu)^2 $$
    where $N$ is total recorded keys, $M$ is bucket_count, and $depth_i$ is the count of keys in bucket $i$.
    In code:
      mean = total_keys / bucket_count
      variance = sum((depth_i - mean) ** 2 for depth_i in depths) / bucket_count
  - Return 0.0 if total_keys == 0.
  - Note: Deterministic tests will verify this using explicitly chosen small numeric keys (e.g. 0, 1, 4, 8) where hash(k) == k.

CANONICAL EXCEPTION HIERARCHY:
All classes must raise the canonical exceptions defined below:
  class HashStructureError(Exception): pass
  class KeyNotFoundError(HashStructureError): pass
  class TableFullError(HashStructureError): pass
  class UnhashableKeyError(HashStructureError): pass
  class InvalidCapacityError(HashStructureError): pass
`,
      starterCode: `class HashStructureError(Exception):
    pass

class KeyNotFoundError(HashStructureError):
    pass

class TableFullError(HashStructureError):
    pass

class UnhashableKeyError(HashStructureError):
    pass

class InvalidCapacityError(HashStructureError):
    pass

class ChainedHashTable:
    def __init__(self, initial_capacity=8, max_load_factor=0.75):
        # TODO: Implement initialization and parameter validation
        pass

    def set(self, key, value):
        # TODO: Implement O(1) amortized insertion, overwrite, and dynamic resizing
        pass

    def get(self, key):
        # TODO: Implement O(1) average lookup with KeyNotFoundError and None payload safety
        pass

    def delete(self, key):
        # TODO: Implement O(1) average deletion with KeyNotFoundError
        pass

    def contains(self, key):
        # TODO: Implement O(1) average membership check
        pass

    def size(self):
        # TODO: Return stored item count
        pass

    def capacity(self):
        # TODO: Return current bucket array capacity
        pass

    def load_factor(self):
        # TODO: Return size / capacity
        pass

class KeyDistributionAnalyzer:
    def __init__(self, bucket_count):
        # TODO: Implement initialization and parameter validation
        pass

    def record_key(self, key):
        # TODO: Record key and return assigned bucket index
        pass

    def bucket_depth(self, bucket_index):
        # TODO: Return count for specific bucket
        pass

    def max_chain_length(self):
        # TODO: Return max depth across all buckets
        pass

    def empty_bucket_count(self):
        # TODO: Return count of buckets with 0 keys
        pass

    def variance(self):
        # TODO: Calculate and return mathematical variance of bucket depths
        pass
`,
      solutionCode: `class HashStructureError(Exception):
    pass

class KeyNotFoundError(HashStructureError):
    pass

class TableFullError(HashStructureError):
    pass

class UnhashableKeyError(HashStructureError):
    pass

class InvalidCapacityError(HashStructureError):
    pass

class ChainedHashTable:
    def __init__(self, initial_capacity=8, max_load_factor=0.75):
        if initial_capacity <= 0 or max_load_factor <= 0:
            raise InvalidCapacityError("Capacity and max_load_factor must be positive.")
        self._capacity = initial_capacity
        self._max_load_factor = max_load_factor
        self._size = 0
        self._buckets = [[] for _ in range(self._capacity)]

    def _hash_key(self, key):
        try:
            return hash(key) % self._capacity
        except TypeError:
            raise UnhashableKeyError(f"Key of type {type(key).__name__} is unhashable.")

    def set(self, key, value):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for entry in bucket:
            if entry[0] == key:
                entry[1] = value
                return
        bucket.append([key, value])
        self._size += 1
        if self.load_factor() >= self._max_load_factor:
            self._resize(self._capacity * 2)

    def get(self, key):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for entry in bucket:
            if entry[0] == key:
                return entry[1]
        raise KeyNotFoundError(f"Key {key!r} not found in table.")

    def delete(self, key):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for i, entry in enumerate(bucket):
            if entry[0] == key:
                val = entry[1]
                del bucket[i]
                self._size -= 1
                return val
        raise KeyNotFoundError(f"Key {key!r} not found in table.")

    def contains(self, key):
        bucket_idx = self._hash_key(key)
        bucket = self._buckets[bucket_idx]
        for entry in bucket:
            if entry[0] == key:
                return True
        return False

    def size(self):
        return self._size

    def capacity(self):
        return self._capacity

    def load_factor(self):
        return self._size / self._capacity

    def _resize(self, new_capacity):
        old_buckets = self._buckets
        self._capacity = new_capacity
        self._buckets = [[] for _ in range(new_capacity)]
        self._size = 0
        for bucket in old_buckets:
            for key, value in bucket:
                self.set(key, value)

class KeyDistributionAnalyzer:
    def __init__(self, bucket_count):
        if bucket_count <= 0:
            raise InvalidCapacityError("bucket_count must be positive.")
        self._bucket_count = bucket_count
        self._depths = [0] * bucket_count
        self._total_keys = 0

    def record_key(self, key):
        try:
            h = hash(key)
        except TypeError:
            raise UnhashableKeyError(f"Key of type {type(key).__name__} is unhashable.")
        idx = h % self._bucket_count
        self._depths[idx] += 1
        self._total_keys += 1
        return idx

    def bucket_depth(self, bucket_index):
        if bucket_index < 0 or bucket_index >= self._bucket_count:
            raise IndexError(f"Bucket index {bucket_index} out of range [0, {self._bucket_count}).")
        return self._depths[bucket_index]

    def max_chain_length(self):
        return max(self._depths)

    def empty_bucket_count(self):
        return sum(1 for d in self._depths if d == 0)

    def variance(self):
        if self._total_keys == 0:
            return 0.0
        mean = self._total_keys / self._bucket_count
        return sum((d - mean) ** 2 for d in self._depths) / self._bucket_count
`,
      visibleTests: [
        {
          id: 'vt-b15-01',
          name: 'Task A: Basic Operations, None Safety & Overwrite Invariant',
          input: '{"key": "a", "val": 100}',
          expectedOutput: '{"get_a": 100, "contains_a": true, "contains_b": true, "get_b": null, "size": 2}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b15-02',
          name: 'Task A: Deterministic Collision Chain Defense Across Deletion',
          input: '{"keys": [1, 9]}',
          expectedOutput: '{"k1_val": "Alpha", "k2_val": "Beta", "k2_after_del": "Beta", "k1_deleted_raised": true}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-b15-01',
          name: 'Task A: Resizing Trigger Point (6th Insertion for M=8, alpha >= 0.75)',
          input: '{"items_count": 6}',
          expectedOutput: '{"initial_cap": 8, "post_resize_cap": 16, "size": 6, "all_retrievable": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-b15-02',
          name: 'Task A: Uniform Unhashable Key Defense (set, get, delete, contains)',
          input: '{"unhashable_key": [1, 2]}',
          expectedOutput: '{"all_ops_raise_unhashable": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-b15-03',
          name: 'Task B: KeyDistributionAnalyzer Deterministic Variance Math',
          input: '{"keys": [0, 4, 8, 1], "bucket_count": 4}',
          expectedOutput: '{"depth_0": 3, "depth_1": 1, "depth_2": 0, "depth_3": 0, "max_chain": 3, "empty_count": 2, "variance": 1.5}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-b15-01',
          name: 'Static AST & Builtin Dict Delegation Anti-Cheating Guard',
          input: '{"check": "AST_RAW_DICT_PROBE"}',
          expectedOutput: '{"raw_dict_bypass": false, "competency_floor_met": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        {
          id: 'rub-b15-01',
          name: 'Correctness',
          description: 'Task A separate chaining maintains collision chains across insertion, overwrite, and deletion. None is safely supported as a valid payload. Task B accurately calculates bucket depths, max chain, empty count, and deterministic variance.',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
        },
        {
          id: 'rub-b15-02',
          name: 'ErrorHandling',
          description: 'Canonical domain exceptions raised: KeyNotFoundError on absent keys, UnhashableKeyError across all four key operations, and InvalidCapacityError on invalid parameters.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b15-03',
          name: 'Performance',
          description: 'Task A: Strict O(1) amortized insertion, O(1) average lookup and deletion. Resizing triggered accurately on 6th item for capacity 8.',
          weight: 0.20,
          maxPoints: 20,
        },
        {
          id: 'rub-b15-04',
          name: 'DataStructureSelection',
          description: 'Separate chaining bucket layout correctly isolates collided elements without data loss. Rehash recalculates all bucket indices.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b15-05',
          name: 'EdgeCaseRobustness',
          description: 'Resilient against empty queries, single-bucket collisions, None values, unhashable key inputs, and consecutive deletions.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-b15-06',
          name: 'CodeQuality',
          description: 'Clean class architecture adhering strictly to prerequisite firewall (zero premature decorators, ABCs, or advanced typing).',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-b15-07',
          name: 'Reasoning',
          description: 'Defends the Hash Stability Invariant and explains why load factor resizing preserves O(1) average performance.',
          weight: 0.05,
          maxPoints: 5,
        },
      ],
    },
  ],
};

export const DAY_77_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w15-015',
  dayNumber: 5,
  title: 'Formative Assessment: Resilient Key-Value Store & Collision Analysis Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b15-d77-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Engineering a Resilient Key-Value Storage & Diagnostics Engine',
      estimatedMinutes: 75,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 75,
      targetCompetencyId: COMPETENCY_ID_HASHING_AND_KEY_VALUE,
      unfamiliarDomainContext: 'High-Throughput In-Memory Key-Value Routing & Collision Diagnostics Engine',
      task: 'Synthesize ChainedHashTable with dynamic resizing and KeyDistributionAnalyzer with collision variance diagnostics under rigorous asymptotic complexity and invariant defense contracts.',
      constraints: [
        'Strict O(1) amortized insertion, O(1) average search/delete.',
        'Initial capacity 8 with max_load_factor 0.75 MUST resize to 16 on the 6th item.',
        'set, get, delete, contains MUST uniformly raise UnhashableKeyError on unhashable keys.',
        'None is a valid payload; get("k") must return None, NOT raise KeyNotFoundError.',
        'KeyDistributionAnalyzer must compute exact variance without floating point drift.',
      ],
      starterArtifact: `class HashStructureError(Exception): pass
class KeyNotFoundError(HashStructureError): pass
class TableFullError(HashStructureError): pass
class UnhashableKeyError(HashStructureError): pass
class InvalidCapacityError(HashStructureError): pass

class ChainedHashTable:
    pass

class KeyDistributionAnalyzer:
    pass
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b15-d77-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Architectural Reflection: Associative Structures, Memory Overhead & Cache Physics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the trade-offs between dynamic arrays, separate chaining hash maps, open addressing linear probing tables, and hardware CPU cache line mechanics.',
      guidingQuestions: [
        'Why does a hash table require significantly more memory than a contiguous array holding the same number of elements?',
        'How does the choice between Separate Chaining and Open Addressing impact CPU cache locality and branch prediction?',
        'Why is hash stability a critical design principle for domain entity keys?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b15-d77-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 015 Reference Sheet: Hash Invariants, Big-O Complexity & Exception Hierarchy',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Documentation: Mapping Types — dict',
          url: 'https://docs.python.org/3/library/stdtypes.html#dict',
        },
        {
          title: 'Python Official Documentation: sys.hash_info',
          url: 'https://docs.python.org/3/library/sys.html#sys.hash_info',
        },
        {
          title: 'Python Wiki: TimeComplexity Analysis',
          url: 'https://wiki.python.org/moin/TimeComplexity',
        },
      ],
      documentationExtracts: [
        'Python 3.14 Documentation: In CPython, hashing for str, bytes, and memoryview uses a build-configurable hash algorithm such as SipHash-1-3, SipHash-2-4, or FNV; a short-input optimization may also apply. Numeric types use a separate numeric hashing scheme.',
        'Python 3.14 Documentation: PYTHONHASHSEED enables randomization of the hash seed for str and bytes to guard against HashDoS attacks.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 015 MASTER MANIFEST ──
export const BATCH_015_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m4-w15-015',
  batchCode: 'P2-M4-W15-BATCH015',
  title: 'Core Data Structures: Hashing, Hash Tables, Collision Resolution & Key-Value Invariants',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_73_MANIFEST,
    DAY_74_MANIFEST,
    DAY_75_MANIFEST,
    DAY_76_MANIFEST,
    DAY_77_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
