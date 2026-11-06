# scripts/topup_cyber_day33.py

content = open("scripts/create_cyber_day33_data.py", "r", encoding="utf-8").read()

p1_extra = """    "Seventh, The Birthday Paradox & Hash Output Collision Bounds: In assessing collision resistance, security engineers must account for the Birthday Paradox: finding ANY collision among random inputs requires only square-root of N operations (`2^(N/2)`), rather than `2^N` operations. For an obsolete 128-bit hash like MD5, finding a collision requires only `2^64` evaluations—a workload easily achievable on modern distributed GPU botnets. For 256-bit hashes like SHA-256 and SHA3-256, finding a collision requires `2^128` operations, which exceeds the total energy output of all stars in our galaxy, guaranteeing permanent mathematical collision safety against classical computation.",
"""

p2_extra = """    "Sixth, Constant-Time Comparison Axioms & Timing Attacks: In web applications, when verifying an HMAC signature, developers frequently write `if (userHmac === expectedHmac)`. In high-level languages like JavaScript and Python, string comparison short-circuits: it checks the first byte; if mismatched, it returns false immediately. If the first byte matches, it takes slightly longer to compare the second byte. By measuring microsecond round-trip network response times across thousands of automated HTTP requests, an attacker can determine byte by byte whether their guessed signature was correct! Using constant-time comparisons (`crypto.timingSafeEqual`) ensures that the CPU evaluates every single byte regardless of where a mismatch occurs, neutralizing timing attacks.",
"""

p3_extra = """    "Sixth, Salting versus Peppering in Defense-in-Depth Architecture: While a Salt is a unique public value stored directly in the database alongside the password hash to defeat rainbow tables, a Pepper is an additional secret key known only to the application server and stored outside the database (e.g., in an HSM or cloud secrets manager). During authentication, the server computes `Argon2id(password, salt, pepper)`. If an adversary compromises the database via SQL injection and dumps all password hashes and salts, the hashes remain completely uncrackable because the adversary lacks the server-side pepper key. Peppering adds an essential secondary cryptographic perimeter.",
    "Seventh, Hardware-Accelerated Hash Cracking Realities: In modern penetration testing and red teaming, security auditors deploy multi-GPU cracking clusters powered by hashcat. A cluster with eight modern graphics cards can test hundreds of millions of bcrypt hashes per hour and billions of NTLM or SHA-1 hashes per second. This stark reality reinforces why enterprise policy must mandate memory-hard algorithms: forcing memory bus bottlenecks is the only physical barrier that levels the playing field between defenders and attackers.",
"""

p4_extra = """    "Sixth, Side-Channel Immunity & RFC 9106 Specification: Argon2's internal compression block utilizes a modified version of the Blake2b round function, operating on 1024-byte blocks organized into sixteen 64-byte registers. The algorithm performs passes over the memory matrix using multi-threading lanes (parallelism `p`). By utilizing data-independent memory lookups during the initial round, Argon2id guarantees that an attacker observing CPU cache hits or hardware bus contention cannot deduce whether specific password characters triggered specific memory page faults, delivering robust resistance against local virtualization side-channel attacks.",
"""

p5_extra = """    "Fifth, Credential Stuffing Mitigation & Adaptive Proof-of-Work: In addition to slow password hashing, production identity systems enforce adaptive defensive perimeters against credential stuffing botnets. When a login endpoint detects anomalous authentication surges originating from distributed residential proxy networks, the system dynamically elevates security friction: it requires clients to solve a cryptographic Client-Side Proof-of-Work challenge (such as finding a SHA-256 partial collision) before processing the login request. This shifts the computational cost back onto the attacker's botnet, preserving backend server CPU resources.",
    "Sixth, Cryptographic Audit Trail Immutability: In regulatory compliance frameworks like SOC 2 and ISO 27001, security logs must be mathematically immutable. Our production audit suite hashes every security event into an append-only cryptographic Merkle Hash Chain: each log entry contains the SHA-256 hash of the preceding log entry. If an attacker breaches the system and attempts to delete audit records to hide their tracks, the broken hash pointers immediately alert the security operations center (SOC) that historical audit records have been manipulated.",
"""

# Replace in content
content = content.replace(
    '    "In the TypeScript snippet below, we construct the HashAlgorithmSpec',
    f'{p1_extra}    "In the TypeScript snippet below, we construct the HashAlgorithmSpec'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the HmacAuthenticator',
    f'{p2_extra}    "In the TypeScript snippet below, we implement the HmacAuthenticator'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the Pbkdf2DerivationEngine',
    f'{p3_extra}    "In the TypeScript snippet below, we implement the Pbkdf2DerivationEngine'
)

content = content.replace(
    '    "In the TypeScript snippet below, we construct the MemoryHardPasswordGuard',
    f'{p4_extra}    "In the TypeScript snippet below, we construct the MemoryHardPasswordGuard'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the HashingSecurityAuditor',
    f'{p5_extra}    "In the TypeScript snippet below, we implement the HashingSecurityAuditor'
)

open("scripts/create_cyber_day33_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day33_data.py with expansions.")
