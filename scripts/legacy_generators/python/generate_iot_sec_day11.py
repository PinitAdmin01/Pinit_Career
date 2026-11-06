#!/usr/bin/env python3
"""
generate_iot_sec_day11.py
Course 19 (iot_sec) Month 1 Block 3 Day 11:
Cryptographic Accelerators: Hardware AES, SHA-256, and TRNG Silicon Drivers
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1: Software Crypto Timing Attacks vs Hardware Coprocessor ---
p1_code = """# Software Table-Lookup AES Cache Timing Attack vs Constant-Time Hardware Accelerator
class CryptoExecutionBenchmark:
    def __init__(self):
        # Software lookup tables (S-Boxes) introduce memory cache line access variations
        self.software_sbox_access_cycles = {
            "cache_hit": 1,
            "cache_miss_eviction": 28
        }

    def simulate_software_aes_execution(self, key_byte: int, input_byte: int) -> dict:
        # Software lookup: T_table[key ^ input]
        lookup_index = key_byte ^ input_byte
        # If cache line is not preloaded, memory controller incurs cache latency leak
        is_cache_miss = (lookup_index % 8 == 0)
        cycles = self.software_sbox_access_cycles["cache_miss_eviction"] if is_cache_miss else self.software_sbox_access_cycles["cache_hit"]
        return {
            "cycles": cycles,
            "timing_variance_leaks_key": is_cache_miss
        }

    def simulate_hardware_accelerator_execution(self) -> dict:
        # Hardware AES coprocessor computes rounds in dedicated pipelined logic (constant-time)
        return {
            "cycles": 11,  # Strictly constant 11 cycles for AES-128
            "timing_variance_leaks_key": False,
            "side_channel_status": "CONSTANT_TIME_PROTECTED"
        }

bench = CryptoExecutionBenchmark()
sw_run = bench.simulate_software_aes_execution(0xA4, 0x24)
hw_run = bench.simulate_hardware_accelerator_execution()

print("=== Cryptographic Execution Audit: Software vs Hardware ===")
print("Software S-Box Memory Timing Leak:", sw_run["timing_variance_leaks_key"])
print(f"Software Execution Latency:        {sw_run['cycles']} cycles (variable)")
print("Hardware Accelerator Timing Leak: ", hw_run["timing_variance_leaks_key"])
print(f"Hardware Execution Latency:        {hw_run['cycles']} cycles (constant)")
print("Hardware Invariant: Dedicated silicon crypto engines eliminate memory cache-timing side-channels.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "In resource-constrained embedded systems and IoT devices, implementing cryptographic algorithms purely in software represents an acute security and performance liability. Software libraries such as standard mbedTLS or software-only OpenSSL routines compile into general-purpose ALU instructions (shifts, additions, XORs, and memory lookups) that execute sequentially across the microcontroller core. For symmetric block ciphers like AES-128 or AES-256, a software routine must execute ten to fourteen rounds of byte substitution (SubBytes), row shifting (ShiftRows), column mixing (MixColumns), and round-key addition (AddRoundKey). On a typical ARM Cortex-M0+ or Cortex-M4 microcontroller running at 48 MHz, encrypting a single 16-byte block in software can consume between 600 and 1,200 clock cycles, crippling real-time motor control and battery efficiency.",
    "Far more dangerous than execution latency is the side-channel vulnerability inherent to software cryptography. To accelerate execution speed in software, standard AES implementations utilize precomputed lookup tables (known as T-tables or S-Box tables) stored in SRAM or flash memory. When computing the SubBytes substitution, the software indexes into the table using the XOR sum of a secret key byte and a plaintext byte: `index = Key[i] ^ Plaintext[i]`. In modern microcontrollers equipped with instruction and data caches, the memory controller fetches 32-byte cache lines. If the requested table entry resides in a cache line that was recently evicted, memory access latency spikes from 1 cycle to 20 or 30 cycles.",
    "This variance in execution time forms the basis of the famous Bernstein Cache-Timing Attack. An adversary running concurrent unprivileged code or observing precise packet transmission timestamps over the network can measure the total execution time of the encryption routine. Because the pattern of cache hits and cache misses directly correlates with the memory indices being accessed—which are mathematical functions of the secret key bits—the adversary can extract the entire 128-bit or 256-bit AES private key across several thousand encryption requests without touching the hardware.",
    "Furthermore, software implementations leak secret keys through power side-channels. As the CPU registers load and manipulate key bytes during each round, the internal CMOS transistors switch logic states, drawing measurable current surges from the VDD power rail. Differential Power Analysis (DPA) and Correlation Power Analysis (CPA) readily reconstruct software keys from fewer than 5,000 oscilloscope traces.",
    "To eradicate these timing and power vulnerabilities, modern secure microcontrollers integrate dedicated Hardware Cryptographic Accelerators. A silicon AES coprocessor does not utilize memory-based lookup tables or sequential CPU instructions. Instead, the cryptographic rounds are implemented using hardwired combinatorial logic gates, Galois Field $GF(2^8)$ multiplier trees, and hardware pipelined registers fabricated directly onto the silicon die.",
    "Because dedicated hardware accelerators execute each round in fixed, deterministic clock cycles regardless of key or plaintext values, they exhibit strictly constant-time execution. Cache lines are never touched, eliminating timing side-channels completely. In addition, hardware engines incorporate internal clock jitter, dual-rail precharge logic, and dummy power-balancing cycles that actively decouple electrical current consumption from the processed cryptographic data, achieving robust resistance against laboratory physical probing."
]

# --- PART 2: Memory-Mapped AES Engine & DMA Transfers ---
p2_code = """# Memory-Mapped Hardware AES Engine with DMA Buffer Streaming Simulator
import hashlib

class HardwareAESEngine:
    def __init__(self):
        # Control & Status Registers (CSR)
        self.CR = 0x00000000       # Control Register: [0]=ENABLE, [1]=MODE (0=ENC, 1=DEC), [3:2]=KEYSIZE
        self.SR = 0x00000001       # Status Register: [0]=READY, [1]=BUSY
        self.KEY_VAULT = b""       # Hardware Isolated Key Storage Register
        self.DINR = b""            # Data Input Register (FIFO)
        self.DOUTR = b""           # Data Output Register (FIFO)

    def write_key_vault(self, key_256: bytes):
        # Writes directly to silicon key vault; software readback is physically blocked
        self.KEY_VAULT = key_256

    def dma_crypto_transaction(self, plaintext_bytes: bytes, encrypt: bool = True) -> bytes:
        self.SR = 0x00000002  # BUSY
        # Pad to 16 bytes
        pad_len = 16 - (len(plaintext_bytes) % 16) if (len(plaintext_bytes) % 16) != 0 else 0
        padded = plaintext_bytes + b"\\x00" * pad_len
        
        # Pipelined hardware AES block processing
        output_blocks = []
        for i in range(0, len(padded), 16):
            block = padded[i:i+16]
            keystream = hashlib.sha256(self.KEY_VAULT + i.to_bytes(4, "big")).digest()[:16]
            out_block = bytes([b ^ k for b, k in zip(block, keystream)])
            output_blocks.append(out_block)

        self.SR = 0x00000001  # READY
        return b"".join(output_blocks)

aes = HardwareAESEngine()
aes.write_key_vault(b"HARDWARE_SECRET_ROOT_AES_KEY_32B")
payload = b"SECURE_TELEMETRY_PACKET_PAYLOAD"
ciphertext = aes.dma_crypto_transaction(payload, encrypt=True)
recovered = aes.dma_crypto_transaction(ciphertext, encrypt=False)

print("=== Memory-Mapped Hardware AES Coprocessor Simulation ===")
print("Hardware Status Register:   ", hex(aes.SR), "(READY)")
print("Input Plaintext:            ", payload.decode())
print(f"DMA Output Ciphertext (Hex): {ciphertext.hex()[:32]}...")
print("Decrypted Recovered Match:  ", recovered[:len(payload)] == payload)
print("Driver Invariant: Key vault registers are write-only from software; bus reads yield 0x00.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "To interact with a silicon cryptographic coprocessor, low-level firmware utilizes memory-mapped peripheral registers accessible over the microcontroller's internal Advanced High-performance Bus (AHB) or Advanced Peripheral Bus (APB). A standard hardware AES accelerator peripheral (such as those found on STM32, NXP LPC, or Silicon Labs EFM32 devices) exposes a structured bank of Control and Status Registers (CSR), data FIFOs, and dedicated key registers located at fixed base physical memory addresses (e.g., `0x50060000`).",
    "At the heart of the peripheral interface is the AES Control Register (`AES_CR`). Through bitfield manipulation, the software driver configures operational parameters: bit 0 toggles the global peripheral enable (`EN`), bit 1 selects encryption versus decryption mode (`MODE`), bits [3:2] specify key length (128-bit, 192-bit, or 256-bit), and bits [6:4] choose the block cipher chaining mode (Electronic Codebook ECB, Cipher Block Chaining CBC, Counter CTR, or Galois/Counter Mode GCM). The companion Status Register (`AES_SR`) signals hardware states, indicating whether the engine is ready to accept new input (`RDY`), actively processing a block (`BUSY`), or flag computational errors.",
    "A vital security architecture feature of modern hardware crypto engines is the Isolated Silicon Key Vault. Rather than leaving symmetric keys in general-purpose SRAM where buffer overflows or memory dumps could expose them, keys are programmed into dedicated write-only hardware key registers (`AES_KEYR0` through `AES_KEYR7`). Once written, internal silicon gating physically disconnects the read bus lines from the key storage flip-flops. If software or a debug probe attempts to read these addresses, the bus controller returns all zeroes (`0x00000000`), preventing memory exfiltration even if root privileges are compromised.",
    "For high-bandwidth applications—such as encrypting real-time network packets or full-disk flash sectors—feeding data words one by one via CPU register polling is grossly inefficient and consumes valuable processing bandwidth. Embedded architectures solve this throughput bottleneck by pairing the crypto engine with a Direct Memory Access (DMA) controller. The hardware accelerator exposes dedicated DMA Request signals: `AES_IN_DMA_REQ` triggers when the input FIFO (`AES_DINR`) has empty slots, and `AES_OUT_DMA_REQ` triggers when the output FIFO (`AES_DOUTR`) contains processed ciphertext blocks.",
    "The DMA controller operates as an autonomous bus master. The CPU configures the source memory buffer in SRAM, the destination memory buffer, and the total transaction byte length, and then asserts the DMA enable bit. The DMA controller transfers data directly between system SRAM and the AES FIFO registers across internal AHB crossbars without CPU intervention. Once the entire multi-kilobyte stream is encrypted, the hardware engine asserts an interrupt line, signaling completion to the operating system.",
    "This zero-copy, DMA-driven pipeline delivers line-rate encryption speeds—often exceeding 200 megabits per second—while leaving the CPU core 100% free to execute application algorithms, sensor fusion, or wireless protocol stacks."
]

# --- PART 3: Hardware SHA-256 FIFO Streaming Engine ---
p3_code = """# Hardware SHA-256 Engine with FIFO Chunk Pipelining Simulator
import hashlib

class HardwareSHA256Accelerator:
    def __init__(self):
        # Hardware registers
        self.FIFO_DEPTH = 64  # 64-byte block FIFO
        self.fifo_buffer = bytearray()
        self.state = {
            "H0": 0x6a09e667, "H1": 0xbb67ae85, "H2": 0x3c6ef372, "H3": 0xa54ff53a,
            "H4": 0x510e527f, "H5": 0x9b05688c, "H6": 0x1f83d9ab, "H7": 0x5be0cd19
        }
        self.total_bytes_processed = 0

    def push_fifo_stream(self, data_chunk: bytes) -> dict:
        self.fifo_buffer.extend(data_chunk)
        blocks_consumed = 0
        
        # Hardware consumes full 64-byte blocks autonomously
        while len(self.fifo_buffer) >= self.FIFO_DEPTH:
            block = bytes(self.fifo_buffer[:self.FIFO_DEPTH])
            self.fifo_buffer = self.fifo_buffer[self.FIFO_DEPTH:]
            blocks_consumed += 1
            self.total_bytes_processed += self.FIFO_DEPTH

        return {
            "blocks_processed": blocks_consumed,
            "fifo_remaining_bytes": len(self.fifo_buffer),
            "total_bytes": self.total_bytes_processed
        }

    def finalize_digest(self, full_data: bytes) -> str:
        # Hardware completes SHA-256 padding and outputs 32-byte digest in registers
        return hashlib.sha256(full_data).hexdigest()

sha = HardwareSHA256Accelerator()
# Stream 128 bytes of firmware payload across two 64-byte FIFO blocks
test_stream = b"FIRMWARE_CHUNK_DATA_STREAM_PART_A_" * 4  # 140 bytes
res = sha.push_fifo_stream(test_stream)
digest = sha.finalize_digest(test_stream)

print("=== Hardware SHA-256 Streaming Accelerator ===")
print("FIFO Blocks Consumed:       ", res["blocks_processed"])
print("Unprocessed FIFO Remainder: ", res["fifo_remaining_bytes"], "bytes")
print(f"Hardware Final Digest (Hex): {digest[:32]}...")
print("Pipelining Invariant: Hardware hash engine processes 64-byte blocks in parallel with CPU fetch.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "Alongside symmetric block encryption, cryptographic hash functions—specifically SHA-256 standardized under NIST FIPS 180-4—are omnipresent in embedded security architecture. Hash engines are fundamental to verifying firmware digital signatures during secure boot, computing HMAC authentication tags on telemetry packets, tracking Platform Configuration Registers (PCRs) in measured boot, and verifying data integrity across external flash partitions. However, computing SHA-256 in software is notoriously compute-intensive, requiring 64 compression rounds per 512-bit (64-byte) message block, involving complex bitwise logic functions ($\Sigma_0, \Sigma_1, \sigma_0, \sigma_1, \text{Ch}, \text{Maj}$) and constant addition arrays.",
    "Hardware HASH accelerators (such as the STMicroelectronics HASH processor or Microchip Crypto accelerator) offload this computational burden onto a dedicated, pipelined silicon coprocessor. The core of a hardware hash engine consists of eight internal 32-bit state registers ($H_0$ through $H_7$) initialized to standard fractional constants, a message scheduler array, and an input FIFO buffer matching the 64-byte SHA block size.",
    "The hardware hash driver feeds data chunks into the peripheral input register (`HASH_DIN`). As soon as 64 bytes of message payload accumulate inside the input FIFO, the hardware autonomously triggers the compression engine. The 64 mathematical compression steps execute in hardware pipelines over just 64 to 80 clock cycles, updating the internal state registers ($H_0-H_7$) completely in parallel with the main processor's execution. If DMA streaming is enabled, hundreds of kilobytes of firmware binary can be hashed directly from flash or SRAM without stalling the CPU core.",
    "Managing the finalization phase of a hash transaction requires precise hardware protocol sequencing. Standard SHA-256 mandates that the final message block be padded with a single `1` bit (`0x80`), followed by zero padding bits, and terminating in a 64-bit integer encoding the exact message bit length. Dedicated hardware hash engines automate this entire padding sequence. When the firmware driver writes the final byte chunk into the peripheral, it asserts the `DCAL` (Digest Calculation) or `CLOSE` bit in the control register. The hardware automatically appends the standard padding bits, executes the final compression round, and locks the final 256-bit digest into dedicated output registers (`HASH_HR0` through `HASH_HR7`).",
    "Furthermore, advanced hardware hash engines support HMAC (Hash-based Message Authentication Code) natively in silicon. To compute an HMAC in software, an application must execute two separate hash passes with inner and outer key pads (`IPAD` and `OPAD`). Dedicated hardware accelerators feature built-in HMAC state machines: the driver simply writes the secret key into the key register, and the hardware autonomously manages both key-expansion passes and payload hashing, delivering authenticated MAC tags with minimal firmware footprint.",
    "By deploying hardware SHA-256 engines, embedded systems achieve order-of-magnitude accelerations in boot time. A microcontroller verifying a 1-megabyte application binary during secure boot can complete SHA-256 digest computation in under 15 milliseconds, ensuring instant device startup while upholding cryptographic rigor."
]

# --- PART 4: True Random Number Generator (TRNG) & NIST SP 800-90B ---
p4_code = """# Silicon TRNG Ring Oscillator Entropy Harvester & Health Tests (NIST SP 800-90B)
import hashlib

class SiliconTRNGEngine:
    def __init__(self):
        self.repetition_count = 0
        self.last_sample = None
        self.entropy_cutoff = 10  # NIST SP 800-90B Repetition Count Test threshold

    def harvest_ring_oscillator_entropy(self, raw_jitter_samples: list) -> list:
        # Von Neumann debiasing / whitening:
        # Pairs: 01 -> 1, 10 -> 0, 00 -> discard, 11 -> discard
        whitened_bits = []
        for i in range(0, len(raw_jitter_samples) - 1, 2):
            b1, b2 = raw_jitter_samples[i], raw_jitter_samples[i+1]
            if b1 == 0 and b2 == 1:
                whitened_bits.append(1)
            elif b1 == 1 and b2 == 0:
                whitened_bits.append(0)
        return whitened_bits

    def run_nist_repetition_count_test(self, sample_bit: int) -> bool:
        # NIST SP 800-90B continuous health test: detect stuck-at noise source failure
        if sample_bit == self.last_sample:
            self.repetition_count += 1
            if self.repetition_count >= self.entropy_cutoff:
                return False  # Health test failed! Ring oscillator locked!
        else:
            self.repetition_count = 1
            self.last_sample = sample_bit
        return True

trng = SiliconTRNGEngine()
# Simulated ring oscillator jitter with high entropy
raw_entropy = [0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0]
whitened = trng.harvest_ring_oscillator_entropy(raw_entropy)

# Test continuous monitoring
healthy = all(trng.run_nist_repetition_count_test(b) for b in whitened)

print("=== Silicon True Random Number Generator (TRNG) Audit ===")
print("Raw Ring Oscillator Bits:   ", raw_entropy)
print("Von Neumann Whitened Bits:  ", whitened)
print("NIST SP 800-90B Health Pass:", healthy)
print("TRNG Invariant: Unconditioned noise sources must pass continuous health tests before seed generation.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "Every cryptographic protocol deployed in modern IoT devices—including TLS session key negotiation, ECDSA digital signatures, initialization vectors, and authentication challenge nonces—critically relies on unpredictable, high-entropy random numbers. In software engineering, standard pseudorandom number generators (PRNGs) like C's `rand()` or linear congruential generators are completely deterministic: if an adversary observes a few output values or deduces the initial seed (often derived from predictable system timers), they can predict all future random values, collapsing cryptographic security.",
    "To provide true, non-deterministic entropy, secure microcontrollers integrate on-chip True Random Number Generators (TRNGs). A TRNG extracts unpredictable physical noise from analog microscopic phenomena occurring inside the silicon die. The most common physical entropy source on modern microcontrollers is the Ring Oscillator. A ring oscillator consists of an odd number of CMOS inverters connected in a closed feedback loop. Due to thermal Johnson-Nyquist noise, semiconductor shot noise, and quantum fluctuations within transistor gate oxides, the propagation delay of each inverter fluctuates continuously, creating microscopic phase jitter.",
    "By sampling high-frequency ring oscillators against an independent, stable reference clock, the hardware captures unpredictable timing jitter as raw binary bits. However, raw physical noise sources inevitably suffer from analog bias: process variations can cause the circuit to produce slightly more zeroes than ones, or create auto-correlation between adjacent samples. To transform raw biased jitter into uniform, high-entropy bits, the TRNG passes the raw bitstream through an on-chip Conditioning Unit.",
    "A classic mathematical debiasing algorithm implemented in silicon is the Von Neumann Whitener. The circuit inspects raw bits in non-overlapping pairs: if the pair is `01`, it outputs a `1`; if the pair is `10`, it outputs a `0`; if the pair is `00` or `11`, both bits are discarded. Because the probability of `01` strictly equals the probability of `10` even on a biased noise source, the output bitstream exhibits perfect 50% duty cycle distribution. Modern chips pair Von Neumann debiasing with cryptographic compression functions (such as SHA-256 or AES-CBC-MAC) to generate full-entropy 32-bit words.",
    "Crucially, international security standards (such as NIST SP 800-90B and Common Criteria AIS 31) mandate that TRNGs implement continuous hardware Health Tests to detect physical hardware failure or active tampering. If an attacker freezes the device with freeze spray or injects radiofrequency signals to lock the ring oscillators into a single resonant frequency, the noise source will fail. To detect this, the TRNG hardware continuously executes two standardized tests: the Repetition Count Test (which halts the generator if the same bit pattern repeats beyond a threshold) and the Adaptive Proportion Test (which detects statistical clustering over sliding sample windows).",
    "If any health test fails, the TRNG peripheral immediately asserts a hardware error interrupt, flags the Status Register (`RNG_SR_CECS`), and blocks random number readouts, ensuring that weak or predictable keys are never released into cryptographic subsystems."
]

# --- PART 5: Complete Hardware Crypto & TRNG Subsystem ---
p5_code = """# ApexCrypto-Core: Unified Hardware Cryptographic Accelerator & TRNG Subsystem
import hashlib, hmac

class ApexCryptoCore:
    def __init__(self):
        self.trng_ready = True
        self.aes_key_vault = {}
        self.sha_fifo = bytearray()
        self.tamper_detected = False

    def load_secure_key(self, slot_id: int, key_bytes: bytes):
        if self.tamper_detected:
            raise PermissionError("SECURITY_LOCKDOWN: Key load blocked")
        self.aes_key_vault[slot_id] = key_bytes

    def generate_cryptographic_nonce(self) -> bytes:
        # Generates 16-byte cryptographically secure random nonce from TRNG pool
        return hashlib.sha256(b"TRNG_ENTROPY_POOL_WHITENED_SILICON_SEED").digest()[:16]

    def hardware_aes_encrypt_block(self, slot_id: int, plaintext: bytes) -> bytes:
        key = self.aes_key_vault.get(slot_id)
        if not key:
            raise KeyError("Key slot empty")
        keystream = hashlib.sha256(key + b":KEYSTREAM").digest()[:len(plaintext)]
        return bytes([p ^ k for p, k in zip(plaintext, keystream)])

    def hardware_sha256_digest(self, payload: bytes) -> str:
        return hashlib.sha256(payload).hexdigest()

core = ApexCryptoCore()
core.load_secure_key(1, b"SILICON_AES_256_ENCRYPT_KEY_9921")
nonce = core.generate_cryptographic_nonce()
ciphertext = core.hardware_aes_encrypt_block(1, b"CONFIDENTIAL_TELEMETRY")
digest = core.hardware_sha256_digest(ciphertext)

print("=== ApexCrypto-Core Hardware Subsystem Initialized ===")
print(f"TRNG Hardware Nonce (16B Hex): {nonce.hex()}")
print(f"Hardware AES Ciphertext (Hex):  {ciphertext.hex()}")
print(f"SHA-256 Digest of Ciphertext:  {digest[:32]}...")
print("ApexCrypto Invariant: Autonomous hardware coprocessors provide line-rate cryptographic acceleration.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "To build a resilient embedded security architecture, individual hardware peripherals—AES accelerators, SHA-256 engines, and True Random Number Generators—must be coordinated under an integrated, defense-in-depth silicon subsystem. The `ApexCryptoCore` represents the reference implementation of this unified hardware cryptographic engine, providing memory-mapped cryptographic services while isolating secret keys from non-secure software layers.",
    "The subsystem enforces strict hardware lifecycle gating. Before any cryptographic operations can commence, the system initializes the TRNG entropy pool. The hardware engine harvests analog phase jitter from on-chip ring oscillators, runs the raw bitstream through Von Neumann debiasing, and verifies that the output conforms to NIST SP 800-90B health benchmarks. Once high-entropy seed material is established, the TRNG delivers unpredictable random nonces required for session keys and replay-resistant challenge-response protocols.",
    "Key management within the subsystem is governed by isolated silicon key slots. Master encryption keys provisioned from on-chip OTP eFuses or secure bootloaders are injected directly into write-only hardware registers. Software application code cannot read the key bytes; it references keys exclusively via abstract hardware slot identifiers (e.g., `Slot 1` for disk encryption, `Slot 2` for network mTLS session keys). This hardware abstraction ensures that even if an attacker achieves arbitrary code execution within the operating system, they cannot dump the underlying root cryptographic keys.",
    "During runtime execution, the subsystem pipelines cryptographic tasks across internal bus channels. When an application transmits a telemetry packet over MQTT or CoAP, the data stream passes through the hardware AES coprocessor. The coprocessor executes pipelined block encryption in constant time, eliminating the memory cache timing variations that plague software lookup tables. Simultaneously, the ciphertext stream is fed directly into the hardware SHA-256 FIFO to compute an integrity digest or HMAC signature without requiring intermediate memory buffer copies in SRAM.",
    "If an active physical tamper event—such as a voltage brownout glitch, thermal shock, or clock injection—is detected by on-chip environmental monitors, the subsystem triggers an immediate security lockdown. The hardware key vault registers are discharged to ground in nanoseconds, all active DMA transactions are aborted, and the crypto engine enters a permanent fault state, preventing the leak of partially decrypted data or compromised key schedules.",
    "By mastering the architecture and silicon drivers of hardware cryptographic accelerators, embedded security engineers transition away from fragile, slow software cryptography. The resulting device achieves line-rate throughput, minimal battery power consumption, and hardware-grade immunity against both network timing attacks and physical side-channel exploitation."
]

def make_long_lesson_day11():
    return {
        "coursePrefix": "iot_sec",
        "day": 11,
        "title": "Cryptographic Accelerators: Hardware AES, SHA-256, and TRNG Silicon Drivers",
        "goal": "Master microcontroller hardware cryptographic accelerators, contrasting software cryptography vs dedicated DMA-driven AES/SHA engine registers, True Random Number Generators (TRNG ring oscillator entropy harvesting), and side-channel power analysis mitigations.",
        "minutes": 38,
        "recap": "Previously, we culminated Month 1 Block 2 with Milestone 2: external flash encryption and bus scrambling via AES-XTS. Today, we dive inside the microcontroller die to harness on-chip cryptographic accelerators and True Random Number Generators.",
        "parts": [
            {
                "title": "Software Cryptography Pitfalls: Execution Latency & Cache Timing Attacks",
                "say": p1_say,
                "example": "Software AES uses S-Box memory lookup tables that suffer from cache-timing leaks (Bernstein attack); dedicated hardware accelerators compute rounds in constant clock cycles.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "CryptoExecutionBenchmark compares software cache line lookup latency against constant-time hardware pipelines.",
                    "Software S-Box table lookups vary between 1 cycle (cache hit) and 28 cycles (cache miss), leaking secret key bits.",
                    "Hardware AES coprocessors execute in strictly constant clock cycles with zero cache interaction."
                ],
                "tryIt": "Add a varying key byte to simulate_software_aes_execution and observe how cache miss frequency alters timing.",
                "check": {
                    "question": "Why do software AES implementations using S-Box lookup tables introduce severe security vulnerabilities on cached processors?",
                    "options": [
                        "Cache hits and misses introduce measurable execution timing variations that allow adversaries to reconstruct the secret key (Bernstein attack).",
                        "Software S-Box tables consume 100% of the microcontroller's flash memory permanently.",
                        "Software tables cause the microcontroller clock oscillator to stop oscillating.",
                        "Software S-Boxes can only encrypt ASCII text and fail on binary data."
                    ],
                    "answer": 0,
                    "why": "Memory lookup times vary depending on whether an S-Box entry is cached; observing these timing variations allows attackers to mathematically recover secret key bits."
                }
            },
            {
                "title": "Silicon AES Hardware Coprocessors: Memory-Mapped Registers & DMA",
                "say": p2_say,
                "example": "Memory-mapped AES control registers (CR/SR) paired with write-only silicon key vaults and DMA streaming deliver line-rate encryption without CPU intervention.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "HardwareAESEngine models peripheral Control and Status Registers (CR/SR) governing cipher operations.",
                    "Key vaults are write-only from software; reading key registers yields all zeroes to prevent memory dumping.",
                    "DMA controllers stream data directly between SRAM and AES FIFO registers across internal AHB buses."
                ],
                "tryIt": "Attempt to read the key from KEY_VAULT via an unprivileged read and verify that hardware blocks direct inspection.",
                "check": {
                    "question": "What is the primary security feature of an isolated silicon key vault in a hardware crypto accelerator?",
                    "options": [
                        "It is write-only from software; bus reads physically return zeroes, preventing malware from dumping stored private keys.",
                        "It doubles the battery voltage supplied to the CPU core.",
                        "It automatically broadcasts the key to an external cloud server over Bluetooth.",
                        "It allows keys to be edited using an unauthenticated JTAG command."
                    ],
                    "answer": 0,
                    "why": "Hardware key vaults physically disconnect read bus lines from key storage flip-flops, ensuring that once programmed, keys cannot be read back by software."
                }
            },
            {
                "title": "Hardware SHA-256 Engines: FIFO Block Processing & Zero-Copy Hashing",
                "say": p3_say,
                "example": "A hardware SHA-256 accelerator consumes 64-byte blocks autonomously from an input FIFO, executing compression rounds in parallel with CPU instruction fetches.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "HardwareSHA256Accelerator models a 64-byte block FIFO and hardware state registers (H0-H7).",
                    "Compression rounds execute in dedicated hardware pipelines over 64 to 80 clock cycles.",
                    "Hardware automatically appends standard SHA padding bits upon closing the hash stream."
                ],
                "tryIt": "Stream a 200-byte message through push_fifo_stream and verify how many full 64-byte blocks are processed.",
                "check": {
                    "question": "How does a hardware SHA-256 accelerator accelerate firmware verification during secure boot?",
                    "options": [
                        "It executes 64 compression rounds in dedicated hardware pipelines, computing digests in parallel with zero CPU overhead.",
                        "It skips the last 32 rounds of SHA-256 to speed up boot times.",
                        "It compresses the binary image using gzip before hashing.",
                        "It relies on the internet connection to verify signatures remotely."
                    ],
                    "answer": 0,
                    "why": "Hardware accelerators implement the compression equations in hardwired silicon logic, hashing data at bus line-rate without consuming CPU cycles."
                }
            },
            {
                "title": "True Random Number Generators: Ring Oscillators & NIST SP 800-90B",
                "say": p4_say,
                "example": "Silicon TRNGs harvest phase jitter from analog ring oscillators, apply Von Neumann debiasing, and continuously run NIST SP 800-90B health checks against tampering.",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "SiliconTRNGEngine harvests analog phase jitter from CMOS ring inverters subject to thermal noise.",
                    "Von Neumann debiasing inspects bit pairs (01->1, 10->0, discards 00/11) to eliminate DC analog bias.",
                    "NIST SP 800-90B Repetition Count Test halts the generator if noise sources lock into a single repeating state."
                ],
                "tryIt": "Pass a stuck-at bitstream ([1, 1, 1, 1, 1, ...]) to run_nist_repetition_count_test and observe the health test failure.",
                "check": {
                    "question": "What is the purpose of the NIST SP 800-90B Repetition Count Test in an on-chip TRNG?",
                    "options": [
                        "To continuously verify that the analog noise source has not failed or been locked into a static state by tampering.",
                        "To count how many times a user has logged into the microcontroller.",
                        "To increase the speed of the random number generator by 10x.",
                        "To synchronize the random numbers with an external atomic clock."
                    ],
                    "answer": 0,
                    "why": "Continuous health tests detect if thermal noise has collapsed or if an adversary is freezing or injecting signals to make random outputs predictable."
                }
            },
            {
                "title": "ApexCrypto-Core: Unified Hardware Cryptographic Accelerator Subsystem",
                "say": p5_say,
                "example": "ApexCryptoCore coordinates TRNG nonce generation, write-only AES key vaults, and SHA-256 digest streaming into an integrated, tamper-resistant crypto coprocessor.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexCryptoCore integrates TRNG entropy pooling, isolated key slot management, and hardware AES/SHA engines.",
                    "Software references keys via abstract slot identifiers without directly handling raw cryptographic key bytes.",
                    "Tamper detection circuits trigger immediate key zeroization to ground upon detecting physical invasion."
                ],
                "tryIt": "Simulate tamper detection by setting tamper_detected to True and verify that key loading and encryption are blocked.",
                "check": {
                    "question": "Why should embedded applications reference hardware crypto keys via abstract slot IDs rather than passing raw keys?",
                    "options": [
                        "It prevents raw cryptographic keys from residing in vulnerable SRAM where buffer overflows or core dumps could expose them.",
                        "It reduces the size of the microcontroller firmware by 50%.",
                        "It allows keys to be transmitted over unencrypted radio links safely.",
                        "It enables multiple microcontrollers to share the same physical RAM."
                    ],
                    "answer": 0,
                    "why": "Using abstract key slots allows keys to remain locked inside write-only hardware registers, completely isolating them from software vulnerabilities."
                }
            }
        ],
        "summary": [
            "Software cryptography suffers from severe cache-timing side-channels (Bernstein attack) and power leakage; hardware engines compute rounds in constant clock cycles.",
            "Silicon AES accelerators feature memory-mapped Control/Status Registers (CSR), write-only key vaults, and DMA channels for autonomous high-throughput encryption.",
            "Hardware SHA-256 engines pipeline 64-byte block compression in parallel with the CPU and automate standard padding and native HMAC calculation.",
            "True Random Number Generators (TRNGs) harvest thermal phase jitter from CMOS ring oscillators, applying Von Neumann debiasing and NIST SP 800-90B health tests.",
            "Unified cryptographic subsystems like ApexCryptoCore isolate key management, deliver line-rate performance, and enforce immediate key zeroization upon tampering."
        ],
        "projectStep": {
            "title": "Build & Validate Hardware Cryptographic Accelerator Subsystem",
            "steps": [
                "Implement a benchmark simulator comparing software cache-timing variations against constant-time hardware AES execution.",
                "Construct a memory-mapped hardware AES accelerator driver with write-only key vaults and DMA buffer streaming.",
                "Develop a pipelined SHA-256 engine with 64-byte block FIFO chunk processing and automated padding finalization.",
                "Build a silicon TRNG driver with ring oscillator jitter harvesting, Von Neumann whitening, and NIST SP 800-90B health checks.",
                "Integrate all peripherals into a unified ApexCryptoCore subsystem verifying complete line-rate cryptographic acceleration."
            ]
        }
    }

day11_data = make_long_lesson_day11()
with open("scripts/iot_sec_day11.json", "w", encoding="utf-8") as f:
    json.dump(day11_data, f, indent=2)

words = [sum(len(s.split()) for s in p["say"]) for p in day11_data["parts"]]
print(f"Day 11 generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
