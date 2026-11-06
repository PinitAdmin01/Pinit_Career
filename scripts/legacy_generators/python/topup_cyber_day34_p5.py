# scripts/topup_cyber_day34_p5.py

content = open("scripts/create_cyber_day34_data.py", "r", encoding="utf-8").read()

p5_more = """    "Eighth, Cryptographic Agility & Post-Quantum PKI Migration: The future of Public Key Infrastructure demands post-quantum readiness. Standard-setting bodies are currently drafting X.509 extensions for post-quantum hybrid certificates that bundle classical Ed25519 or ECDSA keys alongside ML-DSA (Dilithium) post-quantum signatures, ensuring that enterprise trust roots remain sovereign and mathematically inviolable through the quantum computing era.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionPkiChainValidator',
    f'{p5_more}    "In the TypeScript snippet below, we implement the ProductionPkiChainValidator'
)

open("scripts/create_cyber_day34_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day34_data.py with Part 5 top-up.")
