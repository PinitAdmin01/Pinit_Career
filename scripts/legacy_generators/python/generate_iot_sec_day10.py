#!/usr/bin/env python3
"""
generate_iot_sec_day10.py
Course 19 (iot_sec) Month 1 Block 2 Day 10:
Milestone 2: Flash Encryption & Bus Scrambling: AES-XTS on External SPI Flash
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1: SPI Flash Sniffing vs In-Transit Interception ---
p1_code = """# External SPI Flash Eavesdropping vs Direct Bus Extraction Simulator
class ExternalFlashProbeSimulator:
    def __init__(self):
        # Simulated external SPI NOR Flash chip contents (unencrypted)
        self.raw_flash_chip = {
            0x0000: b"\\x7FELF_BOOTLOADER_FIRMWARE_HEADER_OEM_SIGNATURE",
            0x1000: b"SECRET_API_KEY_CLOUDFLEET_9921_PRIVATE_HMAC_CREDENTIAL",
            0x2000: b"NEURAL_NETWORK_EDGE_WEIGHTS_FP32_TENSOR_MODEL_MATRIX"
        }

    def simulate_clip_probe_sniff(self, target_address: int, length: int) -> dict:
        # Attacker attaches SOIC-8 test clip to external flash chip on PCB
        read_bytes = self.raw_flash_chip.get(target_address, b"")[:length]
        return {
            "spi_clock_frequency_mhz": 80.0,
            "sniffed_address": hex(target_address),
            "hex_dump": read_bytes.hex(),
            "extracted_plaintext": read_bytes.decode(errors="ignore"),
            "threat_impact": "TOTAL_INTELLECTUAL_PROPERTY_AND_CREDENTIAL_THEFT"
        }

probe = ExternalFlashProbeSimulator()
sniff_header = probe.simulate_clip_probe_sniff(0x0000, 32)
sniff_secret = probe.simulate_clip_probe_sniff(0x1000, 32)

print("=== External SPI Flash Hardware Interception Audit ===")
print("Physical Probe Attachment: SOIC-8 Test Clip clamped onto PCB flash IC")
print("Sniffed 0x0000 (Firmware Header):", sniff_header["extracted_plaintext"])
print("Sniffed 0x1000 (Cloud Secret):   ", sniff_secret["extracted_plaintext"])
print("Vulnerability Assessment:        ", sniff_secret["threat_impact"])
print("Architecture Invariant: External SPI bus traces expose all firmware and keys without on-chip encryption.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "In modern IoT and embedded systems design, microcontrollers are frequently constrained by internal silicon die area. Integrating multi-megabyte flash arrays directly onto the MCU die increases wafer fabrication costs, limits process node scaling, and inflates package thermal resistance. Consequently, embedded hardware engineers routinely connect high-capacity external Serial NOR Flash or NAND Flash memory chips—typically ranging from 4 megabytes to 128 megabytes—using high-speed serial peripheral interface buses such as Quad-SPI (QSPI) or Octal-SPI (OSPI). These external flash chips store the primary operating system kernel, network communication stacks, filesystem assets, and machine learning models.",
    "However, placing firmware and persistent configuration assets on an external memory chip creates an enormous physical vulnerability. The serial bus lines connecting the microcontroller to the flash chip—including Clock (SCK), Chip Select (CS#), and multiple data lines (IO0 through IO7)—traverse the printed circuit board as exposed copper PCB traces. An attacker who gains physical possession of the device can exploit this physical exposure using basic, inexpensive laboratory tools with virtually zero risk of damaging the hardware.",
    "The simplest and most pervasive attack technique is the non-destructive test clip attachment. Using a \$10 spring-loaded SOIC-8 or WSON-8 pomona test clip, an attacker can clamp directly onto the exposed pins of the external flash package without soldering. By connecting the clip leads to a standard USB SPI programmer (such as a CH341A or Flashrom programmer) while holding the host MCU in hardware reset, the attacker can dump the entire multi-megabyte flash contents to a laptop within thirty seconds. If the flash pins are covered in conformal coating, a hot-air rework station allows the attacker to cleanly desolder the chip in under two minutes for socketed readout.",
    "Even if the microcontroller utilizes proprietary packaging or buried PCB traces that prevent static dumping while powered down, an attacker can attach miniature high-bandwidth oscilloscope probes or a 100 MHz logic analyzer to the SPI bus while the device operates normally. As the microcontroller boots and streams code from external flash via Execute-in-Place (XiP), the logic analyzer records every instruction byte in plaintext. The attacker reconstructs the entire application binary, reverse-engineers proprietary algorithms, extracts machine learning neural network weights, and discovers hardcoded API tokens and cryptographic private keys.",
    "Furthermore, physical bus access enables active manipulation attacks. An attacker equipped with an FPGA-based bus interposer can perform on-the-fly instruction injection. By monitoring the SPI address phase and selectively driving the MISO/IO lines during specific clock cycles, the attacker can replace an authenticated signature check instruction with a `NOP` sequence or an unconditional branch, hijacking execution flow despite secure boot checks located earlier in the boot chain.",
    "Therefore, trusting an external memory chip without hardware-level cryptographic protection completely undermines device security. To achieve true physical resilience, embedded systems require transparent, on-chip hardware engines that ensure that all data written to external flash is cryptographically encrypted and physically scrambled before it leaves the silicon perimeter."
]

# --- PART 2: AES-XTS (IEEE 1619) & Address-Bound Tweak Math ---
p2_code = """# AES-XTS Sector Tweak Generation & Address-Bound Encryption Simulator
import hashlib

class XTSAddressTweakSimulator:
    def __init__(self):
        # XTS uses two 256-bit keys: Key1 (Data Cipher), Key2 (Tweak Cipher)
        self.key1 = hashlib.sha256(b"SILICON_XTS_KEY1_DATA_CIPHER").digest()
        self.key2 = hashlib.sha256(b"SILICON_XTS_KEY2_TWEAK_CIPHER").digest()

    def generate_sector_tweak(self, physical_address: int, sector_idx: int) -> bytes:
        # IEEE 1619: Tweak = AES_Encrypt(Key2, Sector_Address)
        # Binds ciphertext strictly to physical flash geometry
        sector_addr_bytes = physical_address.to_bytes(8, "big") + sector_idx.to_bytes(8, "big")
        # Compute 128-bit tweak value via SHA-256 KDF
        tweak = hashlib.sha256(self.key2 + sector_addr_bytes).digest()[:16]
        return tweak

    def encrypt_block_xts_emulation(self, plaintext_block: bytes, tweak: bytes) -> bytes:
        # XTS core concept: C = AES(P ^ Tweak) ^ Tweak
        # Emulated block cipher via keyed HMAC stream
        keystream = hashlib.sha256(self.key1 + tweak).digest()[:len(plaintext_block)]
        # Mask with tweak before and after cipher
        masked_in = bytes([p ^ t for p, t in zip(plaintext_block, tweak)])
        cipher_core = bytes([m ^ k for m, k in zip(masked_in, keystream)])
        ciphertext = bytes([c ^ t for c, t in zip(cipher_core, tweak)])
        return ciphertext

xts = XTSAddressTweakSimulator()
p_block = b"FIRMWARE_SECTOR_"  # 16-byte block
# Scenario 1: Same data stored at Address 0x1000
tweak_addr1 = xts.generate_sector_tweak(0x1000, 0)
cipher_addr1 = xts.encrypt_block_xts_emulation(p_block, tweak_addr1)

# Scenario 2: Identical data stored at Address 0x4000
tweak_addr2 = xts.generate_sector_tweak(0x4000, 0)
cipher_addr2 = xts.encrypt_block_xts_emulation(p_block, tweak_addr2)

print("=== IEEE 1619 AES-XTS Address-Bound Tweak Simulation ===")
print("Plaintext Block (16 bytes):   ", p_block.decode())
print(f"Address 0x1000 Tweak:          {tweak_addr1.hex()[:24]}...")
print(f"Address 0x1000 Ciphertext:     {cipher_addr1.hex()}")
print(f"Address 0x4000 Tweak:          {tweak_addr2.hex()[:24]}...")
print(f"Address 0x4000 Ciphertext:     {cipher_addr2.hex()}")
print(f"Ciphertexts Identical?         {cipher_addr1 == cipher_addr2}")
print("XTS Invariant: Identical plaintext at different physical addresses produces radically different ciphertext.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "When selecting an encryption algorithm for external flash memory, naive implementations often make disastrous architectural choices. Standard symmetric block cipher modes designed for network communication—such as Electronic Codebook (ECB) or Cipher Block Chaining (CBC)—are entirely unsuitable for random-access memory storage. AES-ECB encrypts each 16-byte plaintext block independently without an initialization vector; consequently, identical plaintext blocks always produce identical ciphertext blocks.",
    "In embedded firmware, huge sections of external flash contain repeated patterns: empty padding sectors filled with `0xFF` or `0x00`, repeated jump tables, or uniform graphic bitmaps. An attacker dumping an ECB-encrypted flash chip cannot read the raw code directly, but the structural contours of the firmware—function boundaries, data tables, and image layouts—are completely visible, leaking critical architectural information through pattern analysis.",
    "Cipher Block Chaining (CBC) mode resolves pattern leakage by XORing each plaintext block with the preceding ciphertext block. However, CBC introduces fatal synchronization dependencies: decrypting a random 16-byte instruction in the middle of a 4-megabyte binary requires knowledge of the immediately preceding ciphertext block as an IV, and encrypting data requires sequential processing across entire sectors. Because the CPU core randomly branches to arbitrary memory addresses during execution, CBC imposes intolerable latency and requires complex state buffering that cripples microcontroller performance.",
    "To solve the challenge of high-performance random-access block encryption, the IEEE 1619 standard established AES-XTS (XEX TCB with ciphertext stealing). AES-XTS is a tweakable block cipher mode specifically engineered for storage media. Under AES-XTS, two separate cryptographic keys are employed: a Data Encryption Key (`Key1`) and a Tweak Encryption Key (`Key2`). For every physical sector or block in flash, an address-derived value called the Tweak (`T`) is calculated: `T = AES_Encrypt(Key2, Physical_Address)`.",
    "Within the sector, each 16-byte block is masked by multiplying the tweak by successive powers of an algebraic element $\\alpha$ within the Galois Field $GF(2^{128})$: $T_j = T \\cdot \\alpha^j$. The plaintext block $P_j$ is XORed with the tweak $T_j$, processed through the core AES cipher under $Key1$, and XORed once more with $T_j$ to yield the final ciphertext: $C_j = AES_{Key1}(P_j \\oplus T_j) \\oplus T_j$. Because the physical memory address is mathematically embedded into the tweak, identical plaintext stored at two different memory locations produces completely distinct, uncorrelated ciphertext.",
    "Crucially, AES-XTS defeats block-relocation and copy-paste tampering attacks. If an attacker copies an encrypted sector from address `0x00010000` (e.g., a function that grants administrative privileges) and overwrites the sector at `0x00020000` (a function enforcing security restrictions), the CPU decrypts the relocated sector using the tweak for address `0x00020000`. The resulting plaintext decrypts into randomized garbage data, causing an immediate instruction trap rather than executing the attacker's relocated code."
]

# --- PART 3: Bus Scrambling & Address Permutation ---
p3_code = """# Physical Bus Scrambler & Address Line Permutation Simulator
import hashlib

class HardwareBusScrambler:
    def __init__(self, scrambler_seed: bytes):
        # Scrambler key loaded into hardware LFSR/PRNG registers from eFuses
        self.seed = scrambler_seed
        self.address_mask = int.from_bytes(hashlib.sha256(scrambler_seed + b":ADDR_MASK").digest()[:4], "big")
        self.data_mask = int.from_bytes(hashlib.sha256(scrambler_seed + b":DATA_DIFFUSE").digest()[:4], "big")

    def scramble_address_bus(self, logical_address: int) -> int:
        # Bitwise polynomial permutation and XOR diffusion of SPI address lines
        # Defeats pattern recognition and address bus logic analysis
        scrambled = (logical_address ^ self.address_mask) & 0xFFFFFFFF
        # Rotate bits by 11 positions
        scrambled = ((scrambled << 11) | (scrambled >> 21)) & 0xFFFFFFFF
        return scrambled

    def diffuse_data_bus(self, data_word: int, scrambled_addr: int) -> int:
        # Dynamic address-dependent data line scrambling
        addr_salt = (scrambled_addr ^ self.data_mask) & 0xFFFFFFFF
        return (data_word ^ addr_salt) & 0xFFFFFFFF

scrambler = HardwareBusScrambler(b"SILICON_BUS_SCRAMBLER_KEY_7701")
log_addr = 0x08001000
scrambled_addr = scrambler.scramble_address_bus(log_addr)
data_word = 0xAA55AA55
diffused_word = scrambler.diffuse_data_bus(data_word, scrambled_addr)

print("=== Physical SPI Bus Scrambler Simulation ===")
print(f"Logical Microcontroller Address: {hex(log_addr)}")
print(f"Scrambled Physical SPI Address:  {hex(scrambled_addr)}")
print(f"Original 32-bit Data Word:       {hex(data_word)}")
print(f"Scrambled Bus Signal Waveform:   {hex(diffused_word)}")
print("Scrambling Invariant: Hardware scramblers eliminate static bit patterns on PCB copper traces.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "Even when external flash payloads are encrypted with AES-XTS, a sophisticated hardware adversary can still glean vital operational intelligence by monitoring the physical address bus. When a microcontroller executes code over Quad-SPI or Octal-SPI, the CPU issues sequential read commands to fetch instructions. As the internal program counter steps linearly from `0x00001000` to `0x00001004`, `0x00001008`, and so on, the binary addresses transmitted over the SPI bus toggle predictable bit patterns.",
    "By capturing these address transitions with a logic analyzer, an attacker can map the device's control flow graph in real time. The attacker can identify where major loops execute, detect when the system branches into interrupt handlers, and measure execution timing with nanosecond precision. Furthermore, when the device performs differential cryptographic operations, slight variations in memory access latency or branching can facilitate timing side-channel attacks.",
    "To neutralize address bus profiling and electromagnetic side-channel radiation, high-security microcontrollers integrate dedicated Hardware Bus Scramblers between the memory controller and the physical SPI PHY interface. A bus scrambler is a high-speed combinatorial hardware pipeline that dynamically permutes and diffuses both address and data lines on every single clock cycle before signals leave the silicon package.",
    "Hardware bus scramblers are seeded by unique cryptographic keys provisioned into silicon eFuses during factory manufacturing. The scrambler utilizes a Linear Feedback Shift Register (LFSR) or high-speed hardware pseudo-random number generator (PRNG) to generate dynamic whitening sequences. The physical address lines undergo a non-linear bitwise permutation: individual address bits are swapped, rotated, and XORed with the scrambling polynomial. As a result, sequential logical addresses appear as high-entropy, uncorrelated pseudo-random values on the PCB copper traces.",
    "Simultaneously, the scrambler applies address-dependent data line diffusion. Even if external flash were to contain consecutive identical bytes, the scrambler diffuses the electrical transitions across the data lines (IO0-IO7). This eliminates high-frequency electromagnetic (EM) harmonics that would otherwise radiate from the PCB traces, effectively defeating near-field EM side-channel probes and preventing frequency spectrum analysis.",
    "Because the bus scrambler is implemented entirely in dedicated silicon combinatorial gates, it operates with zero cycle latency overhead. The microcontroller core experiences seamless memory mapping, while an adversary monitoring the physical circuit board with an oscilloscope observes only continuous, white-noise digital transitions that reveal neither code logic nor control flow."
]

# --- PART 4: XiP Execute-in-Place Decryption Cache ---
p4_code = """# Execute-in-Place (XiP) Transparent Decryption Cache Simulator
import hashlib

class XiPDecryptionCacheEngine:
    def __init__(self):
        self.cache_lines = {}
        self.flash_storage = {}
        self.aes_key = hashlib.sha256(b"XIP_ON_THE_FLY_KEY_256").digest()

    def write_encrypted_flash_sector(self, addr: int, plaintext: bytes):
        # Simulate hardware flash controller writing encrypted blocks
        keystream = hashlib.sha256(self.aes_key + addr.to_bytes(4, "big")).digest()
        cipher = bytes([p ^ keystream[i % len(keystream)] for i, p in enumerate(plaintext)])
        self.flash_storage[addr] = cipher

    def fetch_instruction_xip(self, addr: int) -> bytes:
        # Check L1 hardware instruction cache hit
        if addr in self.cache_lines:
            return self.cache_lines[addr] + b" (CACHE_HIT: 0_WAIT_STATES)"

        # Cache Miss: Fetch encrypted ciphertext from external SPI flash
        ciphertext = self.flash_storage.get(addr, b"\\x00" * 16)
        # On-the-fly hardware AES decryption pipeline (1 cycle latency)
        keystream = hashlib.sha256(self.aes_key + addr.to_bytes(4, "big")).digest()
        decrypted = bytes([c ^ keystream[i % len(keystream)] for i, c in enumerate(ciphertext)])
        
        # Populate cache line
        self.cache_lines[addr] = decrypted
        return decrypted + b" (CACHE_MISS: DECRYPTED_ON_THE_FLY)"

xip = XiPDecryptionCacheEngine()
# Write encrypted firmware function at 0x1000
xip.write_encrypted_flash_sector(0x1000, b"PUSH {R4-R7, LR}")

# Cycle 1: Cache Miss, fetched from external flash and decrypted on the fly
cycle1 = xip.fetch_instruction_xip(0x1000)
# Cycle 2: Cache Hit, zero wait states from internal cache line
cycle2 = xip.fetch_instruction_xip(0x1000)

print("=== XiP On-the-Fly Transparent Decryption Cache ===")
print("Access Cycle 1:", cycle1.decode())
print("Access Cycle 2:", cycle2.decode())
print("XiP Invariant: Transparent on-the-fly decryption enables executing directly from external SPI flash.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "In embedded computing, executing software directly from external flash memory without copying the entire binary into internal SRAM first is known as Execute-in-Place (XiP). XiP is an indispensable architectural feature for memory-constrained microcontrollers: while internal SRAM is typically limited to a few hundred kilobytes, external flash provides tens of megabytes of program memory. To enable XiP, the microcontroller's memory controller maps the external serial flash into the CPU's global 32-bit linear address space (e.g., at base address `0x08000000` or `0x90000000`).",
    "However, executing encrypted firmware via XiP presents an acute performance challenge. A modern Cortex-M or RISC-V processor clocked at 200 MHz fetches instructions every 5 nanoseconds. Standard AES decryption requires 10 to 14 rounds of substitution and permutation logic, which in software would consume hundreds of clock cycles per 16-byte block. If the CPU had to wait for software decryption on every instruction fetch, execution speed would collapse by over 99%, rendering real-time motor control, DSP processing, and network communications impossible.",
    "To reconcile cryptographic security with gigahertz memory access speeds, semiconductor vendors integrate dedicated On-the-Fly Decryption (OTFDEC) hardware engines directly into the memory bus pipeline. An OTFDEC engine is a pipelined, multi-stage AES hardware accelerator coupled to a high-speed L1 instruction and data cache. The engine sits directly between the CPU's internal system crossbar and the Quad-SPI/Octal-SPI peripheral interface.",
    "When the CPU core requests an instruction at a given memory address, the memory controller first interrogates the internal L1 cache. If a cache hit occurs, the decrypted 32-bit instruction word is delivered to the CPU execution pipeline in zero wait states (a single clock cycle). If a cache miss occurs, the cache controller initiates a high-speed burst read over the QSPI/OSPI interface (e.g., a Quad Fast Read command `0xEB` operating at 133 MHz with DDR signalling).",
    "As the encrypted 16-byte burst stream arrives from external flash, it flows through the OTFDEC pipeline. The hardware decryptor computes the sector tweak, executes parallel AES decryption rounds, and writes the plaintext line into the L1 cache within 1 to 2 pipeline clock cycles. The instruction is immediately forwarded to the CPU core. To maximize throughput, OTFDEC engines often support AES-CTR or AES-XTS modes with speculative prefetching, anticipating sequential instruction fetches and decrypting the next cache line before the program counter reaches it.",
    "Importantly, the plaintext instructions exist only within the internal, physically shielded L1 cache and core registers of the microcontroller. The plaintext never touches external pins, PCB copper traces, or the external flash memory chip. If an attacker attaches logic analyzers or probes to the circuit board while the processor runs at full speed, they observe only scrambled, encrypted ciphertext flowing across the serial interface."
]

# --- PART 5: Milestone 2: ApexFlash-XTS Complete Pipeline ---
p5_code = """# Milestone 2: ApexFlash-XTS Full-Pipeline External Flash Encryptor & Scrambler
import hashlib

class ApexFlashXTSEngine:
    def __init__(self, eFuse_flash_key: bytes, eFuse_scrambler_key: bytes):
        # 512-bit XTS Keys (256-bit Key1 Data, 256-bit Key2 Tweak)
        self.key_data = hashlib.sha256(eFuse_flash_key + b":KEY1").digest()
        self.key_tweak = hashlib.sha256(eFuse_flash_key + b":KEY2").digest()
        self.scrambler_mask = int.from_bytes(hashlib.sha256(eFuse_scrambler_key).digest()[:4], "big")
        
        # External SPI Flash physical memory array (holds encrypted, scrambled data)
        self.physical_spi_flash = {}

    def _compute_tweak(self, physical_addr: int) -> bytes:
        # Tweak is mathematically bound to 32-bit physical address
        return hashlib.sha256(self.key_tweak + physical_addr.to_bytes(4, "big")).digest()[:16]

    def _scramble_address(self, logical_addr: int) -> int:
        return (logical_addr ^ self.scrambler_mask) & 0xFFFFFFFF

    def write_flash_block(self, logical_addr: int, plaintext_block: bytes):
        # Stage 1: Scramble address
        phys_addr = self._scramble_address(logical_addr)
        # Stage 2: Generate XTS address tweak
        tweak = self._compute_tweak(phys_addr)
        # Stage 3: AES-XTS block cipher emulation
        keystream = hashlib.sha256(self.key_data + tweak).digest()[:len(plaintext_block)]
        masked_in = bytes([p ^ t for p, t in zip(plaintext_block, tweak)])
        cipher_core = bytes([m ^ k for m, k in zip(masked_in, keystream)])
        ciphertext = bytes([c ^ t for c, t in zip(cipher_core, tweak)])
        # Store in external physical SPI flash
        self.physical_spi_flash[phys_addr] = ciphertext

    def read_flash_block(self, logical_addr: int, block_size: int = 16) -> bytes:
        phys_addr = self._scramble_address(logical_addr)
        tweak = self._compute_tweak(phys_addr)
        ciphertext = self.physical_spi_flash.get(phys_addr, b"\\x00" * block_size)
        keystream = hashlib.sha256(self.key_data + tweak).digest()[:len(ciphertext)]
        masked_out = bytes([c ^ t for c, t in zip(ciphertext, tweak)])
        plain_core = bytes([m ^ k for m, k in zip(masked_out, keystream)])
        plaintext = bytes([p ^ t for p, t in zip(plain_core, tweak)])
        return plaintext

# Instantiate Milestone 2 Engine
engine = ApexFlashXTSEngine(
    eFuse_flash_key=b"FACTORY_PROVISIONED_EFUSE_XTS_KEY_512",
    eFuse_scrambler_key=b"FACTORY_PROVISIONED_EFUSE_SCRAMBLER_32"
)

# Test Data: Critical RTOS Kernel Task Descriptor
secret_payload = b"CRITICAL_RTOS_KERNEL_SECURE_TASK"  # 32 bytes
engine.write_flash_block(0x08000000, secret_payload[:16])
engine.write_flash_block(0x08000010, secret_payload[16:])

# Attacker inspects physical flash chip directly
phys_addr_block0 = engine._scramble_address(0x08000000)
eavesdropped_raw = engine.physical_spi_flash[phys_addr_block0]

# Host CPU reads flash transparently via memory-mapped XiP controller
recovered_block0 = engine.read_flash_block(0x08000000, 16)
recovered_block1 = engine.read_flash_block(0x08000010, 16)
full_recovered = recovered_block0 + recovered_block1

print("=== Milestone 2: ApexFlash-XTS Full-Pipeline Engine ===")
print("Plaintext Firmware Code:       ", secret_payload.decode())
print(f"Physical SPI Bus Eavesdrop:     {eavesdropped_raw.hex()} (High-Entropy Noise)")
print(f"Eavesdropped Matches Secret?   {eavesdropped_raw == secret_payload[:16]}")
print("XiP Transparent Recovered Code:", full_recovered.decode())
print(f"End-to-End Cryptographic Match:{full_recovered == secret_payload}")
print("Milestone 2 Invariant: AES-XTS + Bus Scrambling delivers transparent XiP with total physical confidentiality.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "Milestone 2 represents the architectural convergence of physical bus defense, storage cryptography, and real-time execution performance in the PinIT Career OS curriculum. The `ApexFlashXTSEngine` synthesizes every foundational concept explored across Month 1 Block 2 into a unified, silicon-grade security pipeline: hardware eFuse key provisioning, address bus scrambling, IEEE 1619 AES-XTS tweakable block encryption, and transparent Execute-in-Place memory retrieval.",
    "The operational journey begins with silicon root-of-trust initialization. During factory wafer sort and packaging, two independent cryptographic keys are permanently blown into the microcontroller's on-chip OTP eFuse arrays: a 512-bit master flash encryption key and a 32-bit bus scrambler polynomial seed. These eFuses are locked against software readouts. When the device powers on, the hardware memory controller automatically loads these keys directly into dedicated registers within the physical memory controller, completely bypassing system buses and software access.",
    "When the operating system or application writes executable code or persistent data to external flash, the payload enters the `write_flash_block` pipeline. First, the 32-bit logical address undergoes non-linear scrambling via the hardware scrambler polynomial, mapping the logical address to a dispersed physical memory location. Second, the engine computes a 128-bit cryptographic tweak mathematically derived from the physical destination address using the dedicated tweak key. Third, the block is masked with the tweak, encrypted with the primary data cipher, and masked once more before being transmitted over the physical SPI bus.",
    "An adversary who physically taps the PCB copper traces with a logic analyzer or desolders the flash chip encounters impenetrable entropy. As demonstrated by `eavesdropped_raw`, the physical memory array contains only pseudo-random ciphertext that bears zero mathematical correlation to the original firmware binary. Because the tweak embeds the destination address, identical code sequences (such as standard RTOS loop headers or empty padding sectors) produce completely distinct byte sequences across the flash chip, rendering frequency analysis and pattern recognition impossible.",
    "Conversely, when the host CPU initiates instruction fetches during normal operation, the `read_flash_block` controller executes on-the-fly reverse transformation with zero software overhead. The hardware recovers the physical address, recalculates the sector tweak, decrypts the ciphertext block, and delivers the original plaintext instruction to the CPU execution pipeline. The round-trip verification check (`End-to-End Cryptographic Match: True`) mathematically confirms that the application executes normally while physical confidentiality remains absolute.",
    "By mastering the architecture of AES-XTS flash encryption and bus scrambling, embedded security engineers guarantee that physical hardware possession no longer equates to system compromise. Even if an attacker has physical possession of the device, laboratory microscopes, logic analyzers, and chip-rework stations, the confidential core of the IoT appliance remains unbreakable."
]

def make_long_lesson_day10():
    return {
        "coursePrefix": "iot_sec",
        "day": 10,
        "title": "Milestone 2: Flash Encryption & Bus Scrambling: AES-XTS on External SPI Flash",
        "goal": "Build a production-grade external flash encryption and bus scrambling hardware engine utilizing AES-XTS / AES-CTR address-bound encryption, tweak generation, side-channel bus scrambling, and flash read-write verify gates.",
        "minutes": 38,
        "recap": "Previously, we mastered JTAG/SWD debug port lockout and authenticated RMA lifecycles. Today, we culminate Month 1 Block 2 with Milestone 2: securing external SPI flash against physical probing and reverse engineering via AES-XTS.",
        "parts": [
            {
                "title": "Anatomy of External SPI Flash Probing & Bus Sniffing Attacks",
                "say": p1_say,
                "example": "An attacker attaches a $10 SOIC-8 test clip to an external Quad-SPI flash chip, dumping plaintext firmware binaries and credentials in under thirty seconds.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "ExternalFlashProbeSimulator demonstrates how unencrypted SPI bus lines leak firmware headers, API keys, and ML models.",
                    "SOIC-8 clips and logic analyzers allow non-destructive plaintext readout while holding the MCU in reset.",
                    "Active bus interposers can inject malicious instructions into the SPI bus during boot if encryption is absent."
                ],
                "tryIt": "Add a proprietary neural network weight tensor to raw_flash_chip and simulate sniffing it over the external bus.",
                "check": {
                    "question": "Why is storing unencrypted firmware on an external SPI flash chip a critical hardware vulnerability?",
                    "options": [
                        "Exposed PCB copper traces allow an attacker to dump the entire flash binary using a cheap test clip or logic analyzer in seconds.",
                        "Unencrypted flash chips consume ten times more electrical current from the battery.",
                        "External flash memory cannot execute code faster than 1 kHz without hardware encryption.",
                        "SPI flash chips automatically delete their contents if encryption is not detected."
                    ],
                    "answer": 0,
                    "why": "External flash chips connect via exposed circuit board traces; without on-chip encryption, anyone with a basic programmer can read out all stored firmware and secrets."
                }
            },
            {
                "title": "Flash Encryption Modes: AES-ECB & CBC Flaws vs IEEE 1619 AES-XTS",
                "say": p2_say,
                "example": "AES-ECB leaks structural firmware patterns and CBC prevents random-access branching; IEEE 1619 AES-XTS uses address-bound tweaks to achieve secure random-access storage encryption.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "XTSAddressTweakSimulator calculates 128-bit sector tweaks mathematically bound to physical memory addresses.",
                    "AES-XTS masks plaintext with the tweak before and after block cipher execution: C = AES(P ^ T) ^ T.",
                    "Identical plaintext stored at address 0x1000 and 0x4000 generates completely distinct, uncorrelated ciphertext."
                ],
                "tryIt": "Change physical_address in generate_sector_tweak and verify that the resulting ciphertext block changes completely.",
                "check": {
                    "question": "What is the primary security advantage of IEEE 1619 AES-XTS over simple block cipher modes for flash storage?",
                    "options": [
                        "It binds a unique cryptographic tweak to each physical memory address, ensuring identical plaintext at different locations produces different ciphertext.",
                        "It allows the flash chip to operate at double its maximum clock frequency.",
                        "It compresses the firmware image by 50% to save storage space.",
                        "It eliminates the need for a hardware reset pin."
                    ],
                    "answer": 0,
                    "why": "AES-XTS incorporates an address-derived tweak into the block cipher math, preventing pattern leakage and blocking sector copy-paste relocation attacks."
                }
            },
            {
                "title": "Hardware Bus Scramblers & Address Permutation Defenses",
                "say": p3_say,
                "example": "A hardware bus scrambler dynamically permutes address lines and whitens data lines with an eFuse-seeded polynomial, eliminating EM radiation patterns and bus profiling.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "HardwareBusScrambler applies bitwise polynomial permutation and rotation to logical address buses.",
                    "Data line diffusion whitens bus signals, eliminating static bit patterns that leak execution flow.",
                    "Scrambler operates combinatorially in hardware with zero clock cycle latency penalty."
                ],
                "tryIt": "Provide a different scrambler_seed to HardwareBusScrambler and observe the change in the scrambled physical address.",
                "check": {
                    "question": "What threat does physical address bus scrambling mitigate on high-speed SPI interfaces?",
                    "options": [
                        "It prevents attackers with logic analyzers from profiling the CPU control flow graph, function loops, and execution timing.",
                        "It prevents the microcontroller from overheating under heavy computational loads.",
                        "It converts SPI communication into an Ethernet protocol automatically.",
                        "It protects the flash chip from high-voltage electrostatic discharge (ESD) shocks."
                    ],
                    "answer": 0,
                    "why": "Address scrambling randomizes address line transitions on PCB traces, preventing attackers from observing control flow, branch targets, and program counter progression."
                }
            },
            {
                "title": "On-the-Fly Decryption Engines (XiP: Execute-in-Place)",
                "say": p4_say,
                "example": "The OTFDEC hardware engine combines pipelined AES decryption with an L1 cache, delivering 0-wait-state instruction execution directly from encrypted external flash.",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "XiPDecryptionCacheEngine models transparent memory-mapped execution from encrypted external flash.",
                    "L1 cache hits return decrypted instructions in zero wait states without triggering SPI bus transactions.",
                    "Cache misses trigger burst reads that flow through the hardware decryption pipeline in 1 to 2 cycles."
                ],
                "tryIt": "Simulate fetching instructions from a sequence of consecutive addresses and verify cache hit vs miss behavior.",
                "check": {
                    "question": "How does an On-the-Fly Decryption (OTFDEC) engine achieve high-speed Execute-in-Place (XiP) without crippling CPU performance?",
                    "options": [
                        "It pairs a dedicated multi-stage hardware AES decryption pipeline with an L1 cache to deliver 0-wait-state execution on cache hits.",
                        "It decrypts the entire external flash into external DRAM upon power-up.",
                        "It skips cryptographic decryption whenever the CPU executes critical loops.",
                        "It reduces the instruction width from 32 bits to 4 bits."
                    ],
                    "answer": 0,
                    "why": "OTFDEC engines use high-speed pipelined hardware cryptography integrated with an L1 cache, servicing cached instructions in zero wait states and streaming misses in 1-2 cycles."
                }
            },
            {
                "title": "Milestone 2: ApexFlash-XTS Full-Pipeline Encrypted Bus Engine",
                "say": p5_say,
                "example": "ApexFlashXTSEngine unifies eFuse key derivation, address scrambling, and AES-XTS tweak encryption into an end-to-end transparent memory protection engine.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexFlashXTSEngine coordinates 512-bit eFuse XTS keys and 32-bit bus scrambler masks for complete hardware protection.",
                    "write_flash_block scrambles the address, generates the XTS tweak, and stores encrypted noise in external SPI flash.",
                    "read_flash_block executes transparent XiP decryption, achieving 100% cryptographic round-trip fidelity."
                ],
                "tryIt": "Write a 48-byte firmware payload spanning 3 blocks and verify that every block is encrypted with a distinct address tweak.",
                "check": {
                    "question": "What happens if an attacker copies an encrypted sector from address 0x08000000 and writes it to address 0x08001000?",
                    "options": [
                        "The CPU decrypts the relocated sector with the tweak for 0x08001000, producing randomized invalid code and triggering an immediate CPU trap.",
                        "The CPU successfully executes the relocated code with administrator privileges.",
                        "The flash memory controller permanently locks the entire memory chip.",
                        "The device automatically uploads an intrusion alert to the cloud."
                    ],
                    "answer": 0,
                    "why": "Because AES-XTS binds the decryption tweak to the physical destination address, relocated sectors decrypt into random garbage data, preventing copy-paste tampering."
                }
            }
        ],
        "summary": [
            "External SPI flash memory chips (Quad/Octal SPI) expose sensitive firmware, keys, and ML models to non-destructive test clips and bus sniffing if unencrypted.",
            "Standard AES-ECB leaks structural firmware patterns and CBC prevents random access; IEEE 1619 AES-XTS uses address-bound tweaks for secure random-access storage.",
            "Hardware bus scramblers whiten address and data lines with eFuse-seeded polynomials, defeating PCB trace logic analysis and electromagnetic side-channel profiling.",
            "On-the-Fly Decryption (OTFDEC) engines enable transparent Execute-in-Place (XiP), combining hardware AES pipelines with L1 caches for 0-wait-state instruction execution.",
            "⭐ Milestone 2 ApexFlash-XTS Engine unifies eFuse keying, address scrambling, and AES-XTS encryption to guarantee complete physical confidentiality on external buses."
        ],
        "projectStep": {
            "title": "Build & Validate Milestone 2: ApexFlash-XTS Encrypted Bus Engine",
            "steps": [
                "Implement an external SPI flash sniffing simulator demonstrating plaintext firmware and credential exposure.",
                "Construct an IEEE 1619 AES-XTS address-bound tweak generator ensuring distinct ciphertexts for identical code blocks.",
                "Build a hardware bus scrambler applying polynomial permutation and dynamic data line whitening.",
                "Implement a transparent Execute-in-Place (XiP) on-the-fly decryption cache servicing zero-wait-state fetches.",
                "Assemble the complete ApexFlashXTSEngine and verify end-to-end cryptographic integrity across encrypted flash sectors."
            ]
        }
    }

day10_data = make_long_lesson_day10()
with open("scripts/iot_sec_day10.json", "w", encoding="utf-8") as f:
    json.dump(day10_data, f, indent=2)

words = [sum(len(s.split()) for s in p["say"]) for p in day10_data["parts"]]
print(f"Day 10 generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
