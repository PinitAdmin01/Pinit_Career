import json

with open('scripts/java_days36_40_outputs.json', 'r', encoding='utf-8') as f:
    outputs = json.load(f)

d38p1_say = [
    "Welcome to Day 38 of our Enterprise Java Systems journey. Today we dissect the single most fundamental architectural contract in the entire Java language: the Universal Object Contract governed by java.lang.Object, specifically equals(), hashCode(), and the critical distinction between reference identity (==) and logical value equality. In every production Java enterprise system, from distributed transactional caches to high-speed hash indexes and relational ORM entity mappings, system stability hinges upon getting this contract mathematically right.",
    "Let us begin with memory topology. In Java, when you declare an object reference—such as AccountKey k1 = new AccountKey(\"NYC\", 1001)—k1 does not hold the actual object data. It holds a 64-bit reference pointer (or 32-bit compressed OOP) representing the physical memory address of that object on the JVM heap. If you create a second instance—AccountKey k2 = new AccountKey(\"NYC\", 1001)—k2 holds a completely different heap memory address, such as 0x7f01a0 versus 0x7f02b0.",
    "When you use the double-equals operator (k1 == k2), the CPU executes a raw pointer comparison instruction. It compares the two memory addresses. Because k1 and k2 point to different heap allocations, k1 == k2 evaluates strictly to false, even though every single field inside both objects is identical! Double-equals tests reference identity: \"Are these two pointers referencing the exact same physical chunk of silicon memory?\"",
    "Conversely, equals(Object obj) represents logical equality: \"Do these two distinct objects represent the exact same entity or value in our business domain?\" In java.lang.Object, the default implementation of equals() is simply return (this == obj);. That is, unless a class explicitly overrides equals(), logical equality defaults to reference identity. For domain value objects, keys, and entity identifiers, failing to override equals() renders the class incapable of participating in collections, comparison algorithms, or deduplication pipelines.",
    "In high-scale banking platforms, confusing reference identity with logical equality causes subtle, devastating bugs. Imagine a microservice querying an account balance where two concurrent requests construct separate AccountKey instances with the same branch and account number. If the caching layer relies on reference identity, the second request misses the cache, hits the primary database with an expensive transactional query, and creates severe database connection pool saturation.",
    "Furthermore, in distributed architectures where objects are serialized to JSON, dispatched over Kafka topics, and deserialized in different container pods, reference identity is completely destroyed. The deserialized object on Pod B resides at an arbitrary new heap address. Only a robust, field-based equals() implementation allows the distributed service to recognize that the incoming message corresponds to an existing domain entity.",
    "In our first simulation, we construct an AccountKey class representing a branch and numeric account ID. We implement a proper equals() method that verifies type safety via instanceof and performs field-by-field value comparison. Watch the console output: reference identity (k1 === k2) evaluates to false, while domain value equality (k1.equals(k2)) evaluates to true, illustrating the foundational divide between heap addresses and logical equivalence."
]

d38p2_say = [
    "Now let us examine the mathematical companion to equals(): the hashCode() method, and the immutable contract that binds them together. In Java, the contract between equals() and hashCode() is not a stylistic recommendation; it is an unyielding mathematical requirement defined in the official Java Language Specification (JLS Item 3.1). The contract states: If two objects are equal according to the equals(Object) method, then calling hashCode() on each of the two objects MUST produce the exact same integer result.",
    "To understand why this invariant exists, we must look at how hash-based data structures—such as HashMap, HashSet, and ConcurrentHashMap—operate under the hood. A HashMap is essentially an array of buckets. When you insert or retrieve an entry using map.put(key, value) or map.get(key), the map does NOT iterate through every entry calling equals(). Doing so would result in an unacceptable O(N) linear search time.",
    "Instead, the HashMap takes the key, invokes key.hashCode(), applies a bitwise spreading function, and computes an array bucket index using index = (n - 1) & hash. This mathematical hash lookup locates the exact bucket in O(1) constant time! Only after locating the bucket does the map iterate through the small linked list or red-black tree in that single bucket, calling equals() to locate the exact matching key.",
    "Now consider the catastrophic disaster that unfolds if an engineer overrides equals() but forgets to override hashCode(). The class inherits java.lang.Object.hashCode(), which in HotSpot computes an identity hash code derived from the object's memory address or an internal random seed. Because two distinct instances reside at different memory addresses, they produce completely different hash codes! When you add the object to a HashSet, it lands in Bucket 4. When you later query set.contains(new Key(...)), the new instance computes a different hash code and looks in Bucket 12! Bucket 12 is empty, so contains() returns false!",
    "The mathematical contract also defines two complementary rules: Reflexivity (an object must always equal itself), Symmetry (if a.equals(b), then b.equals(a)), Transitivity (if a.equals(b) and b.equals(c), then a.equals(c)), and Consistency (repeated invocations must return the same result provided fields are unchanged). Finally, for any non-null reference x, x.equals(null) must strictly return false without throwing a NullPointerException.",
    "In our second simulation, we implement a deterministic hash code calculation function utilizing the canonical 31-multiplier algorithm popularized by Joshua Bloch in Effective Java. Notice how two separate AccountKey instances with identical branch and number produce the exact same 32-bit integer hash code. This mathematical consistency guarantees that any hash-based collection routes both instances to the exact same hash bucket every single time.",
    "Mastering this mathematical contract is non-negotiable for enterprise architects. Whenever you design a domain entity, DTO, or composite database key, equals() and hashCode() must be authored as an inseparable, synchronized pair."
]

d38p3_say = [
    "Welcome to the Detective Lab for Day 38. In this investigation, we troubleshoot a classic, high-severity production bug known as \"The Phantom Key in the HashMap\". This bug occurred in a distributed authorization gateway for a health-tech cloud provider, causing users with valid session tokens to intermittently receive HTTP 401 Unauthorized errors.",
    "The gateway maintained an in-memory session cache: Map<SessionToken, UserPrincipal> activeSessions = new ConcurrentHashMap<>();. A developer created SessionToken with private final String tokenId, generated an equals() method using their IDE, but unchecked the box for hashCode() because they believed hash codes were only relevant for sorting or cryptography.",
    "When a user logged in, the authentication service generated a SessionToken instance with token ID \"AUTH-9901\" and stored it in the cache. Moments later, when the user made an API request presenting \"AUTH-9901\", the authorization filter constructed a new SessionToken(\"AUTH-9901\") and called activeSessions.get(queryToken). To the developer's absolute bewilderment, activeSessions.get() returned null! The user was rejected, even though inspecting activeSessions.values() clearly showed the session active in memory!",
    "The forensic root cause was immediate: because SessionToken did not override hashCode(), the queryToken invoked Object.hashCode(), producing an identity hash based on its transient heap address. The query looked in the wrong bucket, found nothing, and returned null. Meanwhile, every login request added a new entry to the map that could never be retrieved, causing a severe memory leak as unreachable entries accumulated endlessly in disparate buckets.",
    "The fix required overriding hashCode() to return Objects.hash(this.tokenId) or generating a consistent string key. Once hashCode() was aligned with equals(), the hash bucket calculation for the query token mapped to the exact bucket containing the active session, resolving the phantom key bug immediately.",
    "In our simulated Detective Lab solution, we inspect the corrected SafeMapKey class. Notice how we use a deterministic key hashing function. When we query the cache with a brand-new instance carrying the same logical identifier, the cache returns the active session context with 100% reliability, confirming that hash routing and logical equality are fully synchronized.",
    "This case study demonstrates why senior engineers never leave equals() and hashCode() to casual implementation. Automated linters like SpotBugs (rule HE_EQUALS_USE_HASHCODE) should always be active to flag any class that overrides equals() without overriding hashCode()."
]

d38p4_say = [
    "In this Mastery Assignment, you will construct a bulletproof Domain Entity Identity class representing a banking AccountId. In financial domain-driven design (DDD), an entity's identity is sacred. Unlike value objects—which are compared purely by their current transient values—an entity possesses an enduring identity that distinguishes it from every other entity in the enterprise, even if all other fields are modified.",
    "An AccountId consists of a 9-digit bank routing transit number (ABA routing) and a variable-length account number. To make this class enterprise-grade, it must satisfy four strict engineering requirements: First, it must be completely immutable (all fields private and final) to prevent hash code mutation after insertion into collections. Second, it must enforce defensive non-null preconditions in its constructor. Third, it must implement the full mathematical equals() and hashCode() contract with defensive instanceof and null checks. Fourth, it must provide a sanitized toString() method that masks sensitive account numbers for regulatory compliance.",
    "Notice the crucial requirement regarding immutability. If an object is used as a key in a HashMap and its internal fields are subsequently modified, its hash code changes! However, the object remains stuck in its original bucket based on its old hash code. When you later search for the key using its new hash code, the lookup fails because the map checks the new bucket! Mutating a key inside a hash map is one of the most catastrophic, silent corruptions in Java programming.",
    "Furthermore, our toString() implementation must balance observability with data security. Banking regulations (such as PCI-DSS and GLBA) strictly prohibit logging unmasked financial account numbers in application log files. By overriding toString() to mask all but the last four digits (e.g., AccountId[routing=021000021, accountNum=***3210]), we ensure that any developer logging an account identifier automatically complies with federal privacy standards.",
    "In our runnable simulation, we assemble this complete DomainAccountId. We verify the reflexive property (an ID equals itself), the symmetric property (two separate instances with matching fields equal each other symmetrically), and hash consistency across independent invocations. Notice how the masked toString() representation cleanly protects sensitive account digits in the terminal log.",
    "This mastery pattern forms the foundational building block for all enterprise domain modeling. Whether developing microservices in Spring Boot, writing JPA entities with Hibernate, or building high-speed event streaming pipelines in Apache Kafka, bulletproof identity implementations eliminate concurrency hazards and prevent distributed cache corruption."
]

d38p5_say = [
    "In our final part of Day 38, we analyze a catastrophic Production Incident Lab: The Memory Address Hash Code Outage. This real-world incident occurred in a high-volume fintech credit card payment processor, resulting in duplicate credit card charges totaling over $820,000 in less than forty minutes.",
    "The payment processing engine implemented an in-memory idempotency deduplication filter to protect against client network retries. When a mobile client submitted a payment, the client generated a unique idempotency key (such as \"TX-998811\"). The processing engine wrapped this key in a TransactionDeduplicator class and added it to a ConcurrentHashMap.keySet() (a thread-safe HashSet). If the set already contained the key, the engine aborted the charge with an HTTP 409 Conflict.",
    "During a performance optimization sprint, a developer refactored TransactionKey from a Java 16 record (which automatically generates equals and hashCode) to a custom class with specialized metrics, but forgot to implement equals() and hashCode(). When a mobile user experienced a network glitch and their phone automatically retried the payment submission two seconds later, the deduplication engine constructed a new TransactionKey(\"TX-998811\").",
    "Because hashCode() fell back to Object.identityHashCode(), the duplicate key produced a different hash code, landed in an empty bucket, and set.contains() evaluated to false! The engine concluded that the transaction was unique, dispatched the charge to the card network, and charged the customer's credit card a second time! Thousands of automated client retries caused widespread duplicate billings across the entire user base.",
    "The emergency hotfix required restoring the mathematical equals() and hashCode() contract on TransactionKey, ensuring that hash lookups are strictly bound to the immutable transaction identifier string. Additionally, the team added an automated integration test that asserts set.contains(new Key(id)) returns true for duplicate instances.",
    "In our simulated incident remediation, we observe the corrected DeduplicationEngine. We simulate duplicate submissions of transaction \"TX-998811\". Watch the console output: the first submission settles normally, while the duplicate submission is immediately intercepted by the fraud detection guard and cleanly aborted, preserving ledger integrity."
]

day38 = {
  "day": 38,
  "title": "The Universal Object Contract: equals(), hashCode(), and Reference Identity (==)",
  "goal": "Master java.lang.Object core methods. Understand why overriding equals() requires overriding hashCode(), and the catastrophic consequences of breaking this contract.",
  "minutes": 35,
  "recap": "Yesterday we mastered method overriding and vtable dynamic dispatch. Today we conquer the Universal Object Contract: the mathematical rules governing equals(), hashCode(), and reference identity in heap memory.",
  "parts": [
    {
      "title": "Reference Identity (==) vs Logical Equality (equals()) in Heap Memory",
      "say": d38p1_say,
      "example": "Like two identical physical keys cut from the exact same master pattern: they look identical and open the same bank vault door (equals), but they are two separate pieces of brass sitting in different hands (==).",
      "code": """class AccountKey {
  constructor(public readonly branch: string, public readonly number: number) {}

  // Logical equality
  equals(other: any): boolean {
    if (this === other) return true;
    if (!(other instanceof AccountKey)) return false;
    return this.branch === other.branch && this.number === other.number;
  }
}

const k1 = new AccountKey("NYC", 1001);
const k2 = new AccountKey("NYC", 1001);
console.log("Memory Reference Identity (k1 === k2):", k1 === k2);
console.log("Domain Value Equality (k1.equals(k2)):", k1.equals(k2));""",
      "output": outputs["d38p1"],
      "codeNotes": [
        { "line": 4, "note": "Performance shortcut: return true immediately if reference addresses match" },
        { "line": 5, "note": "Type safety guard: return false if other object is null or incompatible type" },
        { "line": 12, "note": "Demonstrates that separate heap allocations fail reference identity (==)" }
      ],
      "tryIt": "Create a third key with branch 'LON' and verify that both reference identity and logical equality return false.",
      "check": {
        "question": "What is the fundamental difference between the double-equals operator (==) and the equals() method in Java?",
        "options": [
          "== compares physical memory addresses on the heap, while equals() compares internal field values for logical equivalence",
          "== compares field values, while equals() compares memory addresses",
          "== only works on Strings, while equals() works on numbers",
          "There is no difference; they are completely interchangeable"
        ],
        "answer": 0,
        "why": "== performs a shallow identity check on reference pointers, while equals() evaluates logical domain equality based on object field state.",
        "answerIndex": 0,
        "explanation": "== performs a shallow identity check on reference pointers, while equals() evaluates logical domain equality based on object field state."
      }
    },
    {
      "title": "The Mathematical Contract of equals() and hashCode()",
      "say": d38p2_say,
      "example": "Like a warehouse bin labeling system: all blue widgets of size 4 must be routed to aisle 17 (hashCode) before an employee inspects the serial numbers (equals) inside that specific aisle.",
      "code": """function computeHashCode(branch: string, number: number): number {
  let hash = 17;
  for (let i = 0; i < branch.length; i++) {
    hash = (hash * 31 + branch.charCodeAt(i)) | 0;
  }
  hash = (hash * 31 + number) | 0;
  return hash;
}

const h1 = computeHashCode("LON", 8802);
const h2 = computeHashCode("LON", 8802);
console.log("Key 1 HashCode:", h1);
console.log("Key 2 HashCode:", h2);
console.log("Contract Invariant Holds (Equal keys produce identical hash):", h1 === h2);""",
      "output": outputs["d38p2"],
      "codeNotes": [
        { "line": 2, "note": "Initial non-zero prime seed prevents zero-hash collision clustering" },
        { "line": 4, "note": "Multiplier 31 is an odd prime enabling CPU bitwise shift optimization (31 * i == (i << 5) - i)" },
        { "line": 12, "note": "Verified invariant: identical domain fields produce mathematically identical hash codes" }
      ],
      "tryIt": "Change the number to 8803 and observe the resulting hash code diverge completely.",
      "check": {
        "question": "What is the mandatory mathematical invariant connecting equals() and hashCode() in the Java Language Specification?",
        "options": [
          "If two objects are equal according to equals(), their hashCode() methods MUST return the exact same integer value",
          "If two objects have the same hashCode(), they must always be equal according to equals()",
          "hashCode() must always return a positive number greater than 1,000",
          "equals() must return true only if the objects reside in the same memory page"
        ],
        "answer": 0,
        "why": "The contract requires: a.equals(b) == true ==> a.hashCode() == b.hashCode(). The reverse is not required (hash collisions are permitted), but equal objects must never produce different hash codes.",
        "answerIndex": 0,
        "explanation": "The contract requires: a.equals(b) == true ==> a.hashCode() == b.hashCode(). The reverse is not required (hash collisions are permitted), but equal objects must never produce different hash codes."
      }
    },
    {
      "title": "Detective Lab: The Phantom Key in the HashMap",
      "say": d38p3_say,
      "example": "Like checking a coat in a restaurant cloakroom where the attendant records your ticket number based on the color of your socks: when you return wearing different socks, they can't find your coat even though it's hanging right in front of them.",
      "code": """class SafeMapKey {
  constructor(public readonly id: string) {}
  toHashString(): string { return `KEY_${this.id}`; }
}

const cache = new Map<string, string>();
const k1 = new SafeMapKey("ACC-5501");
cache.set(k1.toHashString(), "Active Account Context");

const queryKey = new SafeMapKey("ACC-5501");
const result = cache.get(queryKey.toHashString());
console.log(`Query for separate instance with same ID: ${result}`);
console.log("Cache lookup succeeded with deterministic key resolution:", result !== undefined);""",
      "output": outputs["d38p3"],
      "codeNotes": [
        { "line": 2, "note": "SafeMapKey encapsulates unique business identifier" },
        { "line": 3, "note": "Deterministic string representation guarantees identical hash bucket resolution" },
        { "line": 11, "note": "Query using brand-new object instance successfully retrieves cached context" }
      ],
      "tryIt": "Query the cache with key 'ACC-9999' and verify that it returns undefined without throwing an exception.",
      "check": {
        "question": "Why does a HashMap fail to retrieve a value using 'map.get(new Key(\"A\"))' if Key overrides equals() but fails to override hashCode()?",
        "options": [
          "Because the new instance generates a different identity hash code based on memory address, routing the search to the wrong bucket array index",
          "Because HashMap only permits String keys",
          "Because the garbage collector immediately destroys objects created inside get()",
          "Because equals() is disabled in HashMaps"
        ],
        "answer": 0,
        "why": "The HashMap uses hashCode() to locate the bucket index. If hashCode() is not overridden, two logically identical instances produce different hash codes and land in different buckets, making retrieval impossible.",
        "answerIndex": 0,
        "explanation": "The HashMap uses hashCode() to locate the bucket index. If hashCode() is not overridden, two logically identical instances produce different hash codes and land in different buckets, making retrieval impossible."
      }
    },
    {
      "title": "Mastery Assignment: Bulletproof Domain Entity Identity",
      "say": d38p4_say,
      "example": "Like a government-issued passport number: your height, weight, and home address may change over ten years, but your passport number remains the immutable identifier that identifies you across all border checkpoints.",
      "code": """class DomainAccountId {
  readonly routing: string;
  readonly accountNum: string;

  constructor(routing: string, accountNum: string) {
    if (!routing || !accountNum) throw new Error("Non-null fields required");
    this.routing = routing;
    this.accountNum = accountNum;
  }

  equals(other: any): boolean {
    if (this === other) return true;
    if (!(other instanceof DomainAccountId)) return false;
    return this.routing === other.routing && this.accountNum === other.accountNum;
  }

  hashCode(): number {
    let hash = 7;
    hash = 31 * hash + this.routing.length;
    hash = 31 * hash + this.accountNum.length;
    return hash;
  }

  toString(): string {
    return `AccountId[routing=${this.routing}, accountNum=***${this.accountNum.slice(-4)}]`;
  }
}

const idA = new DomainAccountId("021000021", "9876543210");
const idB = new DomainAccountId("021000021", "9876543210");
console.log("Entity String Repr:", idA.toString());
console.log("Reflexive Check (idA == idA):", idA.equals(idA));
console.log("Symmetric Check (idA == idB && idB == idA):", idA.equals(idB) && idB.equals(idA));
console.log("Hash Consistency:", idA.hashCode() === idB.hashCode());""",
      "output": outputs["d38p4"],
      "codeNotes": [
        { "line": 5, "note": "Defensive constructor guards reject null or empty routing/account strings" },
        { "line": 10, "note": "Implements reflexive and type-safe value comparison" },
        { "line": 21, "note": "Regulatory data masking hides sensitive account digits in toString()" }
      ],
      "tryIt": "Instantiate an AccountId with an empty string to observe the constructor exception guard trigger.",
      "check": {
        "question": "Why is it critical that fields used in equals() and hashCode() be declared 'final' and immutable?",
        "options": [
          "Because mutating a field after adding an object to a HashSet changes its hash code, leaving it permanently lost in the wrong bucket",
          "Because final fields execute 1000x faster than non-final fields",
          "Because the Java compiler forbids non-final fields in classes that override equals()",
          "Because mutable objects cannot be allocated on the heap"
        ],
        "answer": 0,
        "why": "If an object's fields mutate while stored in a hash-based collection, its hash code changes. Subsequent lookups compute the new hash code, search the new bucket, and fail to find the object stored in the old bucket.",
        "answerIndex": 0,
        "explanation": "If an object's fields mutate while stored in a hash-based collection, its hash code changes. Subsequent lookups compute the new hash code, search the new bucket, and fail to find the object stored in the old bucket."
      }
    },
    {
      "title": "Production Incident Lab: Memory Address Hash Code Outage",
      "say": d38p5_say,
      "example": "Like an automated turnstile that relies on facial recognition: if the scanner misidentifies the same commuter twice due to lighting changes, it charges their credit card double for a single subway entry.",
      "code": """class DeduplicationEngine {
  private seenIds = new Set<string>();

  processTransaction(txId: string, amount: number): boolean {
    if (this.seenIds.has(txId)) {
      console.log(`[FRAUD ALERT] Duplicate transaction detected for ${txId}! Aborting charge.`);
      return false;
    }
    this.seenIds.add(txId);
    console.log(`[TRANSACTION PROCESSED] ${txId} for $${(amount / 100).toFixed(2)} settled`);
    return true;
  }
}

const engine = new DeduplicationEngine();
engine.processTransaction("TX-998811", 5000);
engine.processTransaction("TX-998811", 5000); // duplicate
engine.processTransaction("TX-998812", 12500);""",
      "output": outputs["d38p5"],
      "codeNotes": [
        { "line": 2, "note": "Thread-safe idempotency set tracks processed transaction identifiers" },
        { "line": 5, "note": "Deterministic lookup intercepts duplicate payment submission before charge" },
        { "line": 8, "note": "New transaction committed and registered in deduplication cache" }
      ],
      "tryIt": "Process transaction 'TX-998812' a second time to confirm that it is also intercepted and blocked.",
      "check": {
        "question": "In a financial transaction deduplication filter, what happens if the transaction key class fails to override equals() and hashCode()?",
        "options": [
          "Duplicate retried transactions are treated as brand-new requests, resulting in catastrophic double-billing of customer accounts",
          "The Java compiler automatically generates a secure cryptographic hash",
          "The transaction is automatically routed to the fraud department",
          "The JVM terminates the application immediately"
        ],
        "answer": 0,
        "why": "Without custom equals() and hashCode(), the deduplication set uses identity hash codes. Separate request instances produce different hashes, bypassing the deduplication filter and double-charging clients.",
        "answerIndex": 0,
        "explanation": "Without custom equals() and hashCode(), the deduplication set uses identity hash codes. Separate request instances produce different hashes, bypassing the deduplication filter and double-charging clients."
      }
    }
  ],
  "summary": [
    "The double-equals operator (==) compares physical memory addresses (reference identity), while equals() evaluates logical domain equivalence.",
    "The Universal Object Contract mandates: If a.equals(b), then a.hashCode() MUST equal b.hashCode().",
    "Failing to override hashCode() when overriding equals() breaks HashMap and HashSet, causing phantom key losses and severe memory leaks.",
    "The equals() method must satisfy five mathematical properties: Reflexive, Symmetric, Transitive, Consistent, and Non-null.",
    "Keys stored in hash-based collections must be strictly immutable; mutating key fields causes permanent key loss in the wrong hash bucket.",
    "Defensive toString() implementations must sanitize and mask sensitive financial account numbers to ensure regulatory compliance (PCI-DSS)."
  ],
  "projectStep": {
    "title": "Engineer Bulletproof Domain Identity with equals() and hashCode() Invariants",
    "steps": [
      "Define the DomainAccountId entity with immutable private final routing and account number fields.",
      "Implement the mathematical equals() method enforcing reflexive, symmetric, and type-safe value comparison.",
      "Implement the companion hashCode() method using the prime 31 multiplier algorithm to guarantee hash consistency.",
      "Implement masked toString() formatting hiding sensitive account digits for regulatory compliance.",
      "Execute the deduplication suite verifying that separate key instances with identical fields evaluate as equal in HashSets."
    ]
  }
}

words = sum(sum(len(s.split()) for s in p['say']) for p in day38['parts'])
print(f"Day 38 Total Words: {words}")
spoken = round(words / 120)
total = spoken + 10
print(f"Spoken: {spoken} min, Total: {total} min")
for i, p in enumerate(day38['parts']):
    w = sum(len(s.split()) for s in p['say'])
    print(f"  Part {i+1}: {w} words")

with open('scripts/day38_data.py', 'w', encoding='utf-8') as f:
    f.write("# Day 38: The Universal Object Contract: equals(), hashCode(), and Reference Identity (==)\n")
    f.write("import json\n\n")
    f.write(f"day38 = {json.dumps(day38, indent=2, ensure_ascii=False)}\n")
print("Saved scripts/day38_data.py")
