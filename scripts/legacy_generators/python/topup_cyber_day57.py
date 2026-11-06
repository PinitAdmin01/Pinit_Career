# scripts/topup_cyber_day57.py

with open("scripts/create_cyber_day57_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Fix invalid escape sequence \ge
content = content.replace(r"($\ge 95\mathpercent$)", "greater than or equal to ninety-five percent")
content = content.replace(r"($\ge 95\%$)", "greater than or equal to ninety-five percent")

# Top up say_p2 (+150w)
p2_add = '''    "In addition to simulating system call errors, kernel-level chaos experiments rigorously stress-test memory management under adversarial pressure. For example, by simulating kernel memory fragmentation or cgroup memory limit exhaustion during active cryptographic handshakes, engineers verify that worker pods do not crash in unhandled states or expose uninitialized memory buffers to other processes. This rigorous validation ensures that underlying memory sanitization routines execute reliably under extreme host resource starvation.",
    "Furthermore, security chaos engineering with eBPF validates the reliability of network policy enforcement engines. By selectively dropping ingress SYN packets or injecting TCP reset packets directly at the eBPF layer, teams verify that distributed service meshes maintain zero-trust session termination without falling back to unencrypted or unauthenticated network routes.",'''

# Top up say_p3 (+160w)
p3_add = '''    "To prevent Sybil attacks where an adversary spawns numerous virtual identities to overwhelm the consensus threshold, Byzantine-resilient security meshes enforce strict stake-backed or hardware-attested cryptographic enrollment. Each voting node must possess a verifiable physical TPM 2.0 endorsement key or secure enclave attestation report (such as Intel SGX or AMD SEV) certifying that its identity is bound to physical hardware and cannot be duplicated in software.",
    "Additionally, modern Byzantine consensus engines implement asynchronous verifiable secret sharing and threshold decryption protocols. Even if a malicious node attempts to selectively delay packet delivery or execute timing attacks against distributed key generation ceremonies, the cryptographic threshold guarantees that honest nodes complete the ceremony and achieve deterministic state progression without stalling.",'''

# Top up say_p4 (+100w)
p4_add = '''    "Self-healing security architectures also maintain immutable audit ledgers recording every automated remediation action taken across the cluster. When a compromised node is cordoned and its cryptographic certificates are revoked, the orchestrator writes a signed, tamper-evident record into the SIEM and distributed ledger. This forensic trail ensures that incident response teams have complete historical visibility into exactly what triggered the remediation and how the system restored its steady state.",'''

# Top up say_p5 (+180w)
p5_add = '''    "A world-class resilience platform also continuously simulates cascading multi-region disaster scenarios. By simulating the simultaneous loss of an entire cloud region alongside an adversarial DDoS attack against surviving regional gateways, the platform benchmark verifies that global DNS traffic automatically fails over to sovereign standby enclaves, maintaining zero-trust policy enforcement across distributed multi-cloud endpoints.",
    "Ultimately, Cloud-Native Security Resilience proves that the best defense is not an impenetrable wall, but an adaptable, self-healing organism. By subjecting our distributed systems to continuous scientific chaos, validating Byzantine consensus, and automating instant remediation, enterprise architectures achieve absolute survivability in modern adversarial cyberspace.",'''

content = content.replace(
    '    "In the TypeScript snippet below, we implement the KernelChaosSimulator class',
    p2_add + '\n    "In the TypeScript snippet below, we implement the KernelChaosSimulator class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ByzantineMeshConsensus class',
    p3_add + '\n    "In the TypeScript snippet below, we implement the ByzantineMeshConsensus class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the SelfHealingSecurityOrchestrator class',
    p4_add + '\n    "In the TypeScript snippet below, we implement the SelfHealingSecurityOrchestrator class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionSecurityResiliencePlatform class',
    p5_add + '\n    "In the TypeScript snippet below, we implement the ProductionSecurityResiliencePlatform class'
)

with open("scripts/create_cyber_day57_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated create_cyber_day57_data.py with topup text!")
