# scripts/topup_cyber_day32.py

content = open("scripts/create_cyber_day32_data.py", "r", encoding="utf-8").read()

p1_extra = """    "Sixth, Quantum Computing Horizons & Post-Quantum Cryptography (PQC): As we look to the decade ahead, systems architects must account for Shor's Algorithm running on fault-tolerant quantum computers. Because Shor's algorithm solves both integer factorization and discrete logarithms in polynomial time, both RSA and ECC will be broken when cryptographically relevant quantum computers emerge. To prepare, the National Institute of Standards and Technology (NIST) finalized post-quantum standards: ML-KEM (Kyber) for lattice-based key encapsulation and ML-DSA (Dilithium) for digital signatures. Enterprise systems today deploy Hybrid PQC Handshakes, combining classical X25519 with ML-KEM to guarantee security against both present-day classical adversaries and future quantum harvest-now-decrypt-later attacks.",
"""

p2_extra = """    "Sixth, Elliptic Curve Point Validation & Invalid Curve Attacks: In production ECDH implementations, secure engines must perform rigorous point validation before computing scalar multiplication. If an API accepts arbitrary coordinates from an untrusted client without validating that the point lies on the defined curve, an attacker can supply coordinates belonging to an alternative, vulnerable curve with a small subgroup order (Invalid Curve Attack)! Computing scalar multiplication on the invalid curve leaks bits of the server's private key. Modern curves like Curve25519 are Twist-Secure and utilize the Montgomery ladder, ensuring that all 256-bit input strings map safely to valid group operations without leaking secret scalar bits.",
"""

p3_extra = """    "Fourth, Batch Signature Verification in Distributed Systems: In hyper-scale distributed ledgers and microservice meshes, validating signatures one by one introduces severe CPU bottlenecks. Ed25519 natively supports Batch Verification: evaluating multiple signatures simultaneously using randomized linear combinations (`sum(z_i * s_i) * B = sum(z_i * R_i) + sum(z_i * h_i * A_i)`). Batch verification validates thousands of signatures in parallel, cutting CPU verification overhead by more than fifty percent compared to sequential verification.",
    "Fifth, Hardware-Isolated Signing & HSM Integration: High-assurance enterprise environments isolate master Ed25519 private keys inside dedicated Hardware Security Modules (HSMs) or cloud KMS enclaves. When a code-signing release pipeline or financial payment authorization occurs, the service never exports the private key to application memory. Instead, the service submits a pre-hashed digest to the HSM over authenticated gRPC, and the HSM returns the 64-byte Ed25519 signature computed entirely within its physically tamper-resistant cryptographic boundary.",
"""

p4_extra = """    "Sixth, Key Derivation Functions (KDF) & HKDF Standards: In hybrid cryptosystems, the raw byte array produced by ECDH scalar multiplication is not directly suitable for use as an AES symmetric key. Elliptic curve shared points may have mathematical biases or uneven entropy distribution across coordinate bits. Modern standards (RFC 5869) mandate passing the shared secret through HKDF (HMAC-based Extract-and-Expand Key Derivation Function). HKDF uses SHA-256 to first extract a pseudo-random master key and then expand it into distinct, cryptographically independent encryption keys, initialization vectors, and authentication subkeys, preventing cryptographic cross-protocol contamination.",
"""

p5_extra = """    "Fifth, Zero-Trust Mutual TLS (mTLS) Handshake Architecture: The ultimate real-world manifestation of asymmetric cryptography is the TLS 1.3 handshake. During an mTLS connection, the client and server exchange ephemeral X25519 public keys to establish forward-secret symmetric session keys, while simultaneously exchanging Ed25519 or RSA-4096 X.509 digital certificates to authenticate both endpoints. Neither party trusts the underlying network; cryptographic identity is proven at every hop.",
    "Sixth, Sovereign Hardware Key Attestation & TPM Integration: In addition to software audits, sovereign enterprise deployments enforce hardware-rooted identity using Trusted Platform Modules (TPM 2.0). The server's asymmetric identity keypair is generated directly inside the TPM silicon chip during manufacturing. The private key cannot be extracted, duplicated, or dumped even by an administrator with root operating system privileges. When communicating with the enterprise control plane, the TPM signs hardware measurement registers, mathematically proving that the host is running a genuine, untampered operating system kernel.",
"""

# Replace in content
content = content.replace(
    '    "In the TypeScript snippet below, we implement the AsymmetricCurveComparison',
    f'{p1_extra}    "In the TypeScript snippet below, we implement the AsymmetricCurveComparison'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the EcdhKeyExchange',
    f'{p2_extra}    "In the TypeScript snippet below, we implement the EcdhKeyExchange'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the Ed25519Signer',
    f'{p3_extra}    "In the TypeScript snippet below, we implement the Ed25519Signer'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the HybridEnvelopeEncryptor',
    f'{p4_extra}    "In the TypeScript snippet below, we implement the HybridEnvelopeEncryptor'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ForwardSecrecyAuditor.',
    f'{p5_extra}    "In the TypeScript snippet below, we implement the ForwardSecrecyAuditor.'
)

open("scripts/create_cyber_day32_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day32_data.py with expansions.")
