# scripts/topup_cyber_day31.py

content = open("scripts/create_cyber_day31_data.py", "r", encoding="utf-8").read()

p2_extra = """    "Sixth, Galois Counter Mode Hardware Pipeline Acceleration: Modern server microprocessors implement carry-less multiplication instructions, such as Intel PCLMULQDQ and ARM PMULL. These hardware primitives compute polynomial multiplication over the Galois field GF(2^128) in just one or two processor clock cycles, allowing AES-GCM to achieve memory-bandwidth throughput exceeding twenty gigabits per second per CPU core while simultaneously maintaining unbreakable cryptographic authenticity across billions of daily enterprise web transactions.",
"""

p3_extra = """    "Sixth, Modern Deployments in WireGuard and TLS 1.3: The IETF incorporated ChaCha20-Poly1305 as a mandatory-to-implement cipher in TLS 1.3 and the core primitive for the next-generation WireGuard VPN protocol. When a mobile client initiates a TLS connection to Cloudflare or Google edge servers, the client's TLS ClientHello advertises cipher preferences. If the client lacks dedicated hardware AES instructions, the edge reverse proxy automatically negotiates ChaCha20-Poly1305, dramatically reducing client battery consumption and eliminating thermal throttling on mobile devices while preserving maximum twenty-five-gigabit server throughput.",
"""

p4_extra = """    "Sixth, Synthetic Nonce Generation and AES-GCM-SIV: In distributed cloud architectures where thousands of microservice instances run concurrently across multiple data centers, coordinating a single centralized monotonic counter is impractical. To address this, the cryptographic research community created Synthetic Initialization Vector (SIV) modes, such as AES-GCM-SIV (RFC 8452). AES-GCM-SIV is Nonce-Misuse Resistant: if a nonce is accidentally repeated, the cipher gracefully degrades to deterministic encryption—meaning identical messages produce identical ciphertexts—but the secret key and past and future keystreams remain completely protected from mathematical recovery.",
"""

p5_extra = """    "Fifth, Constant-Time Memory Comparisons and Side-Channel Hardening: In production security systems, verifying the authentication tag is just as critical as computing it. If an application compares the received authentication tag with the calculated tag using standard string equality (`tagA === tagB`), the execution halts at the first mismatched byte. Attackers can measure the nanosecond latency differences (Timing Attacks) to guess each byte of the tag sequentially! Production cryptographic engines mandate Constant-Time Comparisons using `crypto.timingSafeEqual()`, which inspects every single byte regardless of where a mismatch occurs, neutralizing side-channel timing leakage.",
    "Sixth, Cryptographic Zeroization and Secure Memory Cleanup: Beyond transit encryption, production systems must prevent secret keys from lingering in operating system RAM. In garbage-collected runtimes like Node.js and V8, deallocated key objects may remain in unmanaged heap memory for minutes before garbage collection runs. If an attacker leverages a memory disclosure vulnerability (such as Heartbleed or an unhandled buffer over-read), residual key material can be dumped. High-assurance systems enforce explicit Cryptographic Zeroization: wiping plaintext buffers with zero bytes (`buffer.fill(0)`) immediately after cipher execution completes.",
"""

# Replace in content
content = content.replace(
    '    "In the TypeScript snippet below, we implement the AesGcmEngine',
    f'{p2_extra}    "In the TypeScript snippet below, we implement the AesGcmEngine'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ChaChaEngine',
    f'{p3_extra}    "In the TypeScript snippet below, we implement the ChaChaEngine'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the NonceSafetyGuard',
    f'{p4_extra}    "In the TypeScript snippet below, we implement the NonceSafetyGuard'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionCipherAuditor.',
    f'{p5_extra}    "In the TypeScript snippet below, we implement the ProductionCipherAuditor.'
)

open("scripts/create_cyber_day31_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day31_data.py with expansions.")
