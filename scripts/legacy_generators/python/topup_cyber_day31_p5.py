# scripts/topup_cyber_day31_p5.py

content = open("scripts/create_cyber_day31_data.py", "r", encoding="utf-8").read()

p5_more = """    "Seventh, Defense-in-Depth and Formal Verification of Cryptographic State Machines: Modern enterprise security architectures combine constant-time operations, cryptographic zeroization, and AEAD authentication into a formally verified state machine. By enforcing automated fuzzing pipelines and fault injection tests in continuous integration, security teams mathematically prove that corrupted ciphertexts, invalid nonces, and malicious payload mutations are neutralized with zero false negatives across production clusters.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionCipherAuditor.',
    f'{p5_more}    "In the TypeScript snippet below, we implement the ProductionCipherAuditor.'
)

open("scripts/create_cyber_day31_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day31_data.py with Part 5 top-up.")
