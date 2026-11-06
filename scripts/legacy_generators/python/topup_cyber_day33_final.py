# scripts/topup_cyber_day33_final.py

content = open("scripts/create_cyber_day33_data.py", "r", encoding="utf-8").read()

p4_more = """    "Seventh, Hardware Sizing & Thread Lane Optimization: When deploying Argon2id in cloud microservices, engineers must tune the parallelism parameter `p` to match available CPU cores. For an authentication container provisioned with two virtual CPUs, configuring `p=4` creates thread scheduling contention, while `p=2` optimizes throughput without thrashing. RFC 9106 recommends benchmarking parameter sets on target production hardware to achieve a total hash verification time of approximately three hundred to five hundred milliseconds—striking the optimal balance between high login throughput and impenetrable cryptographic protection.",
"""

p5_more = """    "Seventh, Continuous Key Lifecycle Management & Secret Zeroization: In production credential management, secret pepper keys and HMAC signing tokens must never remain unprotected in memory. Production authentication services pin pepper keys into protected memory regions using operating system syscalls like `mlock` to prevent secret material from being swapped to unencrypted swap disks. Upon completing password verification, the server explicitly zeroizes all intermediate buffers, eliminating residual plaintext credentials from process memory.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we construct the MemoryHardPasswordGuard',
    f'{p4_more}    "In the TypeScript snippet below, we construct the MemoryHardPasswordGuard'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the HashingSecurityAuditor',
    f'{p5_more}    "In the TypeScript snippet below, we implement the HashingSecurityAuditor'
)

open("scripts/create_cyber_day33_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day33_data.py with final top-ups.")
