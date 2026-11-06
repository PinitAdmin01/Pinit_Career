# scripts/topup_cyber_day32_p5.py

content = open("scripts/create_cyber_day32_data.py", "r", encoding="utf-8").read()

p5_more = """    "Eighth, Continuous Formal Cryptographic Attestation: In mission-critical environments such as banking cores, aerospace telemetry, and defense communications, cryptographic verification is executed as a continuous automated health probe. Every sixty seconds, synthetic canary agents execute ephemeral ECDH key derivations and verify Ed25519 digital signatures against known test vectors (NIST CAVP / CAVS validation suites), guaranteeing that underlying kernel cryptographic drivers and hardware acceleration microcode have not experienced silent corruption or bit rot.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ForwardSecrecyAuditor.',
    f'{p5_more}    "In the TypeScript snippet below, we implement the ForwardSecrecyAuditor.'
)

open("scripts/create_cyber_day32_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day32_data.py with Part 5 top-up.")
