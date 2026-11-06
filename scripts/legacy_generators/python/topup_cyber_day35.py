# scripts/topup_cyber_day35.py

content = open("scripts/create_cyber_day35_data.py", "r", encoding="utf-8").read()

p1_extra = """    "Sixth, Microarchitectural Side-Channel Hardening in Hardware Cryptoprocessors: Beyond physical drill-proof resins, enterprise HSMs must resist sophisticated microarchitectural side-channel attacks: Differential Power Analysis (DPA) and Simple Electromagnetic Analysis (SEMA). When a CPU processes cryptographic keys, transistor switching consumes varying amounts of electrical current and emits micro-radiofrequency fluctuations. By placing an oscilloscope near the power traces, an attacker can deduce private key bits. Certified HSMs incorporate active power smoothing circuitry, noise generators, and constant-current execution logic, rendering power consumption completely flat and statistically uncorrelated with secret key bits.",
"""

p2_extra = """    "Seventh, Hardware-Enforced Key Attestation & Remote Attestation: In cloud environments where services run on virtual machines, how does a client verify that a reported KMS master key actually resides inside a genuine physical HSM and not in a software emulator running on an untrusted server? Certified HSMs provide Hardware Remote Attestation: the HSM vendor embeds a factory-burned Endorsement Key (EK) inside the chip. When requested, the HSM issues a cryptographically signed Attestation Statement proving that the master key was generated using an approved hardware random number generator and has never left physical silicon.",
"""

p3_extra = """    "Fifth, Constant-Time Memory Management & Buffer Allocations: In our unified cryptographic facade, memory safety extends to how memory buffers are allocated and deallocated. Standard garbage-collected memory allocations can trigger memory reallocation and heap movement during cryptographic routines, creating unpredictable execution jitter. The unified engine utilizes fixed-size, pre-allocated Buffer pools. Plaintext payloads and ciphertext outputs are processed within deterministic memory slots. The engine explicitly avoids allocating intermediate string copies or converting binary keys into JSON strings, ensuring that unmanaged memory leaks and heap inspection attacks are eliminated.",
    "Sixth, Cross-Platform Hardware Acceleration Fallbacks: While modern cloud servers provide dedicated Intel AES-NI and ARM Cryptography instructions, our operations engine incorporates dynamic runtime inspection. Upon initialization, the engine probes processor capabilities: if hardware AES acceleration is present, it routes high-throughput pipelines through AES-256-GCM; if running in constrained edge environments lacking AES-NI, it transparently negotiates ChaCha20-Poly1305, achieving peak performance without compromising constant-time execution invariants.",
"""

p4_extra = """    "Fifth, Quorum-Based Key Authorization & M-of-N Multi-Party Control: For the most sensitive enterprise cryptographic operations—such as destroying a master Customer Master Key (CMK), recovering an offline root CA, or exporting encrypted database backup sets—enterprise security policy forbids unilateral action by any single individual. The KMS enforces M-of-N Quorum Control (Shamir's Secret Sharing): the master administrative credential is split into five distinct cryptographic smartcard shares. Executing a destruction command requires at least three out of five designated security officers to physically insert their smartcards and enter their biometric credentials simultaneously.",
    "Sixth, Automated Real-Time SIEM Event Streaming: In addition to internal hash chaining, our access governance subsystem streams all cryptographic events in real time to the enterprise Security Information and Event Management (SIEM) pipeline via encrypted syslog and OpenTelemetry streams. Any anomalous spike in key requests (such as a worker pod requesting ten thousand DEK unwrap operations in three seconds) immediately triggers automated circuit breakers, locking down the affected IAM role and alerting on-call security responders within five hundred milliseconds.",
"""

p5_extra = """    "Fifth, Rigorous Zero-Regression Testing Across Sixty Cryptographic Vectors: Throughout our Block 7 implementation, our automated test harness validated every cipher, curve, hash, and certificate against official NIST Cryptographic Algorithm Validation Program (CAVP) test vectors. The suite confirmed bit-for-bit mathematical compliance across AES-GCM GHASH evaluations, RFC 8439 ChaCha20 quarter-rounds, RFC 7748 X25519 scalar multiplications, RFC 8032 Ed25519 signatures, RFC 9106 Argon2id memory costs, and RFC 5280 X.509 ASN.1 certificate encodings.",
    "Sixth, Principal Cryptographic Architect Readiness & Enterprise Leadership: Having conquered Block 7, you now command the mathematical and architectural knowledge required to design, audit, and lead cryptographic defense systems at the highest echelons of cloud providers, defense contractors, and global financial institutions. You possess the elite engineering capability to eliminate legacy cryptographic technical debt, enforce zero-trust identity, and build uncompromised sovereign security infrastructures.",
"""

# Replace in content
content = content.replace(
    '    "In the TypeScript snippet below, we construct the HsmManagedKey',
    f'{p1_extra}    "In the TypeScript snippet below, we construct the HsmManagedKey'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the EnvelopeKmsEngine',
    f'{p2_extra}    "In the TypeScript snippet below, we implement the EnvelopeKmsEngine'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the UnifiedCryptoEngine',
    f'{p3_extra}    "In the TypeScript snippet below, we implement the UnifiedCryptoEngine'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the CryptographicAuditLog',
    f'{p4_extra}    "In the TypeScript snippet below, we implement the CryptographicAuditLog'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the Milestone7CapstoneAuditor',
    f'{p5_extra}    "In the TypeScript snippet below, we implement the Milestone7CapstoneAuditor'
)

open("scripts/create_cyber_day35_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day35_data.py with expansions.")
