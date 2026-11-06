# scripts/topup_cyber_day32_final.py

content = open("scripts/create_cyber_day32_data.py", "r", encoding="utf-8").read()

p4_more = """    "Seventh, Cryptographic Envelope Access Control & Key Revocation: By storing only encrypted data keys alongside database records, enterprise administrators can achieve Instant Data Revocation. If an employee leaves the company or a tenant subscription is cancelled, the KMS administrator revokes access to the master key encryption key (KEK). Without the KEK, the encrypted DEK cannot be unwrapped, rendering billions of encrypted records instantaneously unreadable across all global backups without requiring time-consuming physical file erasure.",
"""

p5_more = """    "Seventh, Enterprise Cryptographic Inventory & Automated Key Rotation: In regulatory compliance frameworks such as SOC 2 and PCI-DSS, organizations must maintain an active cryptographic inventory. Security automated agents continuously scan production environments, identifying any lingering legacy RSA keys or un-rotated certificates. Modern KMS systems automate key rotation: master keys are re-encrypted with fresh key versions annually, while existing data keys remain decryptable via backward-compatible key version identifiers, ensuring continuous zero-downtime cryptographic modernization.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we implement the HybridEnvelopeEncryptor',
    f'{p4_more}    "In the TypeScript snippet below, we implement the HybridEnvelopeEncryptor'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ForwardSecrecyAuditor.',
    f'{p5_more}    "In the TypeScript snippet below, we implement the ForwardSecrecyAuditor.'
)

open("scripts/create_cyber_day32_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day32_data.py with final top-ups.")
