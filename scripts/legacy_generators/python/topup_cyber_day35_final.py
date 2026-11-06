# scripts/topup_cyber_day35_final.py

content = open("scripts/create_cyber_day35_data.py", "r", encoding="utf-8").read()

p1_more = """    "Seventh, Multi-Cloud Cryptographic Enclaves & Confidential Computing: In modern multi-cloud architectures (AWS Nitro Enclaves, Google Cloud Confidential VMs, Azure Confidential Computing), virtualized HSM capabilities are extended to cloud hypervisors using AMD SEV-SNP and Intel SGX. Memory encryption keys are generated directly by the CPU memory controller; even if an attacker gains physical access to the RAM DIMM chips or hypervisor host kernel, memory traces remain cryptographically opaque, guaranteeing sovereign hardware isolation.",
"""

p3_more = """    "Seventh, Hardware-Accelerated ChaCha20 Vectorization: In high-throughput distributed microservices, software stream ciphers achieve blazing speeds via advanced CPU vector extensions, including Intel AVX-512 and ARM NEON. By processing four 128-bit vector lanes concurrently, modern vectorized ChaCha20 engines encrypt data at memory-bus speeds exceeding eight gigabytes per second on a single commodity core without requiring specialized cryptographic coprocessors.",
"""

p4_more = """    "Seventh, Autonomous Cryptographic Anomaly Detection & Threat Containment: In addition to standard RBAC policies, enterprise KMS engines deploy real-time behavioral machine learning models. By establishing baseline key request patterns for each microservice, the system detects anomalous key usage deviations—such as off-hours mass decryptions or unexpected geographical request origins—and automatically enforces step-up cryptographic challenges before unauthorized data exfiltration can occur.",
"""

p5_more = """    "Seventh, Lifelong Mastery of Sovereign Cybersecurity Systems: The completion of Milestone 7 marks your mastery of the fundamental mathematical and physical laws of enterprise cybersecurity. The rigorous principles you have internalized—from authenticated encryption and ephemeral key exchanges to memory-hard hashing and hardware root of trust—will serve as the foundational bedrock for securing planetary digital infrastructure throughout your engineering career.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we construct the HsmManagedKey',
    f'{p1_more}    "In the TypeScript snippet below, we construct the HsmManagedKey'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the UnifiedCryptoEngine',
    f'{p3_more}    "In the TypeScript snippet below, we implement the UnifiedCryptoEngine'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the CryptographicAuditLog',
    f'{p4_more}    "In the TypeScript snippet below, we implement the CryptographicAuditLog'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the Milestone7CapstoneAuditor',
    f'{p5_more}    "In the TypeScript snippet below, we implement the Milestone7CapstoneAuditor'
)

open("scripts/create_cyber_day35_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day35_data.py with final top-ups.")
