#!/usr/bin/env python3
"""
generate_iot_sec_day8.py
Course 19 (iot_sec) Month 1 Block 2 Day 8:
Secure Elements (SE) & Hardware Security Modules (TPM 2.0): I2C/SPI Bus Crypto Coprocessors & PCR Measurement
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1: Secure Elements vs SOC Isolation ---
p1_code = """# Silicon Physical Attack Surface vs Secure Element Isolation Simulator
class HardwareIsolationAudit:
    def __init__(self):
        self.soc_attack_surfaces = {
            "Differential Power Analysis (DPA)": "VULNERABLE (Unshielded power rails reveal S-Box keys)",
            "Electromagnetic EM Radiation": "VULNERABLE (Near-field probes capture crypto traces)",
            "Voltage & Clock Glitching": "VULNERABLE (Single glitch skips branch instruction)",
            "Focused Ion Beam (FIB) Probing": "VULNERABLE (Raw silicon exposes unprotected metal buses)"
        }
        self.secure_element_defenses = {
            "Active Active-Shield Silicon Mesh": "ACTIVE (Severing metal line immediately erases RAM/keys)",
            "Dual-Rail Precharge Logic": "ACTIVE (Power consumption is independent of processed bit values)",
            "Internal Clock & Voltage Monitors": "ACTIVE (Brownout or frequency spike triggers zeroization)",
            "Tamper Response Zeroization Circuit": "ACTIVE (Dismantling packaging destroys battery-backed RAM)"
        }

    def evaluate_isolation(self) -> dict:
        return {
            "soc_risk_score": 9.5,
            "soc_evaluation": "INSUFFICIENT FOR ROOT OF TRUST STORAGE",
            "se_cert_rating": "Common Criteria EAL6+ / FIPS 140-3 Level 3",
            "se_hardware_protection": "ISOLATED TAMPER-RESISTANT SILICON PERIMETER"
        }

audit = HardwareIsolationAudit()
eval_res = audit.evaluate_isolation()

print("=== Hardware Security Boundary Audit: General SOC vs Secure Element ===")
print("Standard Microcontroller Physical Vulnerability:", eval_res["soc_evaluation"])
print("  DPA Power Side-Channel:", audit.soc_attack_surfaces["Differential Power Analysis (DPA)"])
print("  Clock Glitch Injection:", audit.soc_attack_surfaces["Voltage & Clock Glitching"])
print("Secure Element Hardening Rating:", eval_res["se_cert_rating"])
print("  Silicon Active Mesh Shield:   ", audit.secure_element_defenses["Active Active-Shield Silicon Mesh"])
print("  Side-Channel DPA Resistance:  ", audit.secure_element_defenses["Dual-Rail Precharge Logic"])
print("Architecture Invariant: Root private keys must reside within tamper-hardened SE/TPM boundary.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "In embedded computing and connected IoT devices, the host microcontroller or system-on-chip (SoC) is primarily optimized for computational throughput, rich peripheral interfacing, low power consumption, and bill-of-materials cost. Standard commercial microcontrollers manufactured in modern CMOS processes—such as generic ARM Cortex-M or RISC-V application processors—lack specialized silicon-level defenses against sophisticated physical side-channel and invasive fault-injection attacks. When an attacker gains physical possession of an edge device in the field, standard on-chip security perimeters can be rapidly compromised by adversaries equipped with standard laboratory equipment.",
    "Non-invasive attacks, such as Differential Power Analysis (DPA) and Correlation Power Analysis (CPA), exploit microscopic variations in the microcontroller's power consumption as cryptographic operations execute. When an unprotected hardware accelerator or software routine computes an AES S-Box lookup or an elliptic curve scalar multiplication, the momentary switching of CMOS transistors draws varying amounts of electrical current that directly correlate with the secret bits of the private key. By attaching a high-speed oscilloscope probe to the power supply rail or decoupling capacitors, an adversary can reconstruct private keys within minutes across a few thousand measured traces.",
    "Semi-invasive and fault-injection techniques pose an even more catastrophic threat to general SoCs. Techniques such as clock glitching, voltage brownout pulsing, and electromagnetic fault injection (EMFI) induce transient bit-flips in internal registers or the instruction pipeline. A precisely timed 10-nanosecond voltage drop on the CPU core voltage rail can cause the program counter to skip a conditional branch instruction—such as an `if (!signature_verified) halt();` check—allowing unauthorized firmware to boot without resistance. Furthermore, invasive laboratory attacks using Focused Ion Beam (FIB) workstations can mill away passivation layers to microprobe internal bus lines directly.",
    "To counteract these physical attack surfaces, embedded security architectures integrate dedicated Secure Elements (SEs), such as the Microchip ATECC608B or NXP SE050. A Secure Element is a specialized, tamper-hardened cryptographic coprocessor fabricated on a physically isolated silicon die. Unlike general-purpose SoCs, Secure Elements are engineered from the ground up to achieve stringent Common Criteria EAL6+ and FIPS 140-3 Level 3 certifications. Every internal structure inside a Secure Element is designed to defeat both non-invasive and invasive physical exploitation.",
    "Silicon-level countermeasures inside a Secure Element include active silicon shields—a dense, multi-layer serpentine mesh of energized microscopic metal traces running over the active circuitry. If an attacker uses chemical etching or laser ablation to expose the die, any severed or shorted trace instantly triggers an analog tamper response circuit that zeroizes (erases) all internal cryptographic keys in nanoseconds. Additionally, Secure Elements utilize dual-rail precharge logic and internal cryptographic blinding to equalize electrical current consumption, rendering DPA and EM leakage mathematically uncorrelated with key material.",
    "By offloading private key storage, cryptographic root-of-trust operations, and certificate proofs to a discrete Secure Element, the overall system achieves robust defense-in-depth. Even if a remote vulnerability or buffer overflow allows an attacker to gain full arbitrary code execution on the main host processor, the adversary cannot extract the device's root private keys. The private keys remain physically quarantined behind the silicon perimeter of the coprocessor, capable only of signing validated challenges via restricted API commands."
]

# --- PART 2: TPM 2.0 Hierarchy: EK, SRK, PCRs ---
p2_code = """# TPM 2.0 Cryptographic Key Hierarchy & PCR Bank Simulator
import hashlib

class TPM2HierarchySimulator:
    def __init__(self):
        # Endorsement Primary Seed (EPS) permanently burned into silicon
        self.eps = b"SILICON_EPS_FACTORY_SEED_8892"
        # Derive Endorsement Key (EK) - unique hardware identity, non-migratable
        self.ek_pub = hashlib.sha256(self.eps + b":EK_PRIMARY").hexdigest()
        
        # Storage Primary Seed (SPS) managed by platform owner
        self.sps = b"PLATFORM_OWNER_SPS_SEED_1042"
        # Derive Storage Root Key (SRK) - root of object/key hierarchy
        self.srk_pub = hashlib.sha256(self.sps + b":SRK_PRIMARY").hexdigest()
        
        # Initialize 8-bank SHA-256 Platform Configuration Registers (PCRs) to all zeros
        self.pcrs = {i: b"\\x00" * 32 for i in range(8)}

    def extend_pcr(self, pcr_index: int, measurement: bytes):
        # TPM 2.0 Invariant: PCR_New = SHA256(PCR_Old || Measurement)
        old_val = self.pcrs[pcr_index]
        self.pcrs[pcr_index] = hashlib.sha256(old_val + measurement).digest()

tpm = TPM2HierarchySimulator()
print("=== TPM 2.0 Hardware Key Hierarchy Initialized ===")
print(f"Endorsement Key (EK) Public Fingerprint: {tpm.ek_pub[:32]}...")
print(f"Storage Root Key (SRK) Public Fingerprint: {tpm.srk_pub[:32]}...")
print(f"Initial PCR[0] Digest (32 zero bytes):    {tpm.pcrs[0].hex()[:32]}...")
print("Hierarchy Invariant: EK never leaves TPM; objects are sealed to SRK and PCR state.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "While compact I2C Secure Elements are widely deployed in lightweight microcontrollers, more complex embedded systems, industrial gateways, automotive domain controllers, and edge servers rely on the Trusted Platform Module (TPM 2.0) standard. Defined by the Trusted Computing Group (TCG) and ratified internationally as ISO/IEC 11889, TPM 2.0 specifies a standardized cryptographic subsystem that provides hardware-rooted device identity, measured boot state logging, secure key storage hierarchies, and platform attestation.",
    "At the core of TPM 2.0 is a structured entity hierarchy organized into distinct cryptographic domains: the Endorsement Hierarchy, the Storage Hierarchy, and the Platform Hierarchy. Each hierarchy is rooted in a dedicated silicon primary seed burned into tamper-proof non-volatile storage. The Endorsement Hierarchy is rooted in the Endorsement Primary Seed (EPS), injected into silicon by the semiconductor vendor. From the EPS, the TPM derives the Endorsement Key (EK)—an asymmetric keypair accompanied by an EK certificate signed by the TPM manufacturer's CA. The EK represents the permanent, non-migratable physical identity of the silicon and can never be exported or modified by the user.",
    "The Storage Hierarchy is rooted in the Storage Primary Seed (SPS), which is under the administrative control of the platform owner. From the SPS, the TPM derives the Storage Root Key (SRK). The SRK serves as the parent key for an arbitrary tree of encrypted child keys and data blobs stored in external flash memory. Whenever an application requests the creation of a new cryptographic key (such as an application-specific signing key or an AES disk encryption key), the TPM generates the key inside its secure boundary and wraps (encrypts) it with the parent SRK before returning the ciphertext to host memory. This allows the TPM to manage virtually unlimited keys without requiring extensive internal non-volatile memory.",
    "Crucial to TPM 2.0's security model are Platform Configuration Registers (PCRs). PCRs are specialized cryptographic registers located inside the TPM silicon designed specifically to record integrity measurements of the system's software execution state. A standard TPM 2.0 implementation contains banks of PCRs (typically 24 registers per bank) supporting cryptographic hash algorithms such as SHA-256 and SHA-384. PCRs are initialized to a known state (usually all zeros) upon hardware reset and cannot be written directly with arbitrary values by software.",
    "The only permitted operation to modify a PCR value during execution is the cryptographic `TPM2_PCR_Extend` command. When software presents a new measurement digest `D` to extend PCR `i`, the TPM computes a mathematical accumulation: `PCR[i]_new = Hash(PCR[i]_old || D)`. Because cryptographic hash functions are strictly one-way and collision-resistant, it is mathematically impossible for an attacker to manipulate the input sequence to reach a desired PCR value or revert a PCR to an earlier state. The order of events is permanently baked into the final hash value.",
    "Standardized TCG specifications allocate specific PCR indices to distinct boot stages. For example, PCR[0] records measurements of the Core Root of Trust for Measurement (CRTM), Boot ROM code, and motherboard firmware configuration. PCR[1] captures platform hardware settings, PCR[2] measures option ROMs, and PCR[4] records the Stage 2 bootloader and OS kernel image. By inspecting the final values of these registers, the TPM maintains a tamper-proof cryptographic summary of every component that executed during system initialization."
]

# --- PART 3: PCR Measurement Logging & Remote Attestation Quote ---
p3_code = """# TPM 2.0 Measured Boot & Cryptographic Remote Attestation Quote Simulator
import hashlib, hmac

class MeasuredBootAttestationEngine:
    def __init__(self):
        self.pcr0 = b"\\x00" * 32
        self.event_log = []
        # Attestation Key (AK) derived under Endorsement Key
        self.ak_secret = b"TPM_ATTESTATION_KEY_SECRET_P256"

    def measure_and_extend(self, component_name: str, binary_bytes: bytes):
        comp_hash = hashlib.sha256(binary_bytes).digest()
        # Extend PCR0: SHA256(old_pcr0 || comp_hash)
        self.pcr0 = hashlib.sha256(self.pcr0 + comp_hash).digest()
        self.event_log.append({
            "component": component_name,
            "hash": comp_hash.hex(),
            "pcr_after": self.pcr0.hex()
        })

    def generate_attestation_quote(self, nonce: bytes) -> dict:
        # Quote mathematically binds current PCR state + nonce using AK signature
        quote_payload = self.pcr0 + nonce
        quote_sig = hmac.new(self.ak_secret, quote_payload, hashlib.sha256).hexdigest()
        return {
            "pcr0_val": self.pcr0.hex(),
            "nonce": nonce.hex(),
            "quote_signature": quote_sig,
            "event_count": len(self.event_log)
        }

engine = MeasuredBootAttestationEngine()
# Stage 1: Measure Boot ROM configuration
engine.measure_and_extend("BootROM_Config", b"SECURE_BOOT_FUSES_CONFIG_V1")
# Stage 2: Measure Stage 2 Bootloader (SBL) binary
engine.measure_and_extend("Stage2_Bootloader", b"ELF_BINARY_SBL_IMAGE_V2.1.0")

# Cloud Verifier challenges device with nonce
cloud_nonce = b"EPHEMERAL_CHALLENGE_NONCE_7721"
quote = engine.generate_attestation_quote(cloud_nonce)

print("=== TPM 2.0 Measured Boot & Attestation Quote ===")
print("Measured Boot Events Logged:", quote["event_count"])
print(f"Final Extended PCR[0] Hash:  {quote['pcr0_val'][:32]}...")
print(f"Cloud Nonce Challenge:       {quote['nonce']}")
print(f"Cryptographic Quote Sig:     {quote['quote_signature'][:32]}...")
print("Attestation Invariant: Verifier replays event log to deterministically verify PCR quote.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "A fundamental distinction in embedded systems security exists between Secure Boot and Measured Boot. In Secure Boot, each stage of firmware cryptographically verifies the digital signature of the subsequent stage before jumping to it; if signature verification fails, the bootloader halts the processor immediately, preventing execution. However, Secure Boot has limitations: it is a binary go/no-go gate that provides no external visibility into intermediate system states, hardware peripheral configurations, or kernel runtime parameters once boot succeeds.",
    "Measured Boot complements Secure Boot by maintaining an unalterable, cumulative cryptographic audit log of the entire execution chain. Under Measured Boot, before a boot component (e.g., Boot ROM, UEFI/U-Boot, Linux kernel, or device tree blob) transfers execution control to the next stage, it hashes the binary payload and hardware configuration of that next stage and commands the TPM to extend the measurement into a specific PCR register. Even if a boot component is vulnerable, altered, or malicious, the TPM will faithfully extend its hash into the PCR before execution begins.",
    "Because the raw PCR registers store only a single condensed 32-byte digest representing the cumulative accumulation of all boot events, the host operating system maintains an accompanying TCG Event Log in system memory. The event log is a linear list of structures detailing each measurement event: the PCR index targeted, the event type, the binary digest, and human-readable metadata identifying the measured component (e.g., `grub.cfg`, `kernel_cmdline`, or `vmlinuz`). While an attacker with root privileges can tamper with the plaintext event log in RAM, they cannot alter the hardware PCR inside the TPM.",
    "Remote Attestation is the cryptographic protocol by which an edge device proves its operational integrity to a remote cloud verifier or zero-trust network controller. To perform remote attestation, the remote cloud server generates a high-entropy random nonce and sends an attestation challenge to the device. The device forwards the challenge to its local TPM alongside a selection mask specifying which PCRs to report. The TPM executes the `TPM2_Quote` command, generating a signed attestation quote.",
    "The TPM Quote operation concatenates the selected PCR values and the cloud-supplied nonce into an internal data structure called `TPMS_ATTEST` and signs it using a restricted Attestation Key (AK). The AK is an asymmetric key certified beneath the hardware Endorsement Key (EK), ensuring that quotes can only be generated by genuine, physical TPM hardware. The signed quote and the plaintext TCG event log are transmitted back to the cloud verifier.",
    "The cloud verifier validates the attestation quote through a two-step cryptographic process. First, it verifies the AK signature over the quote structure and checks that the returned nonce matches its challenge, preventing replay attacks. Second, the verifier reads the received event log, replays the recorded hashes sequentially from the initial zero state, and computes the expected synthetic PCR value. If the computed digest matches the hardware PCR value signed inside the TPM Quote, and if every measured component corresponds to known, authorized golden baselines, the verifier certifies the edge device as untampered."
]

# --- PART 4: I2C/SPI Interception & SCP03 Secure Channel ---
p4_code = """# Inter-Chip Bus Interception Attack vs SCP03 Encrypted Tunnel Simulator
import hashlib, hmac

class SecureBusChannelSimulator:
    def __init__(self):
        # Shared Static Keys between Main SOC and Secure Element (provisioned at factory)
        self.kenc = hashlib.sha256(b"FACTORY_STATIC_SCP03_ENC_KEY").digest()
        self.kmac = hashlib.sha256(b"FACTORY_STATIC_SCP03_MAC_KEY").digest()

    def transmit_unprotected_bus(self, plaintext_pin: str) -> str:
        # Attacker with logic analyzer taps physical I2C SDA/SCL lines
        intercepted_payload = f"I2C_WRITE [0x50]: {plaintext_pin}"
        return intercepted_payload

    def transmit_scp03_bus(self, plaintext_pin: str, seq_num: int) -> dict:
        # Authenticated encryption over inter-chip SPI/I2C bus (SCP03 protocol)
        # Derive per-session keystream block via HMAC-SHA256
        seq_bytes = seq_num.to_bytes(4, "big")
        keystream = hmac.new(self.kenc, b"ENCRYPTION_COUNTER:" + seq_bytes, hashlib.sha256).digest()
        
        # Stream encrypt plaintext payload
        payload_bytes = plaintext_pin.encode("utf-8")
        ciphertext = bytes([b ^ keystream[i % len(keystream)] for i, b in enumerate(payload_bytes)])
        
        # Calculate AES-CMAC / HMAC integrity tag over sequence + ciphertext
        mac_tag = hmac.new(self.kmac, seq_bytes + ciphertext, hashlib.sha256).hexdigest()[:16]
        return {
            "seq_num": seq_num,
            "ciphertext": ciphertext.hex(),
            "mac_tag": mac_tag,
            "security": "ENCRYPTED_AND_AUTHENTICATED_BUS_TRAFFIC"
        }

bus = SecureBusChannelSimulator()
raw_tap = bus.transmit_unprotected_bus("ROOT_ADMIN_PIN_99182")
scp03_tap = bus.transmit_scp03_bus("ROOT_ADMIN_PIN_99182", seq_num=1)

print("=== Physical Inter-Chip Bus Interception Audit ===")
print("Unprotected I2C Bus Tap: ", raw_tap)
print("  Eavesdropping Result:   CRITICAL LEAK (Logic analyzer extracts raw credentials)")
print("Hardened SCP03 Bus Tap:  ", scp03_tap["ciphertext"])
print(f"  Integrity MAC Tag:      {scp03_tap['mac_tag']}")
print("Defense Invariant: External Secure Elements require encrypted transport (SCP03) against bus probes.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "Integrating a discrete Secure Element or external TPM onto an IoT printed circuit board (PCB) solves the problem of secure on-chip key storage, but it introduces a severe physical vulnerability: the inter-chip communication bus. Discrete security chips interface with the host SoC using standard low-pin-count serial buses such as I2C, SPI, or LPC. These bus lines run as exposed copper PCB traces between the microcontroller and the security chip. If the communication protocol transmitted over these traces is unencrypted, the physical boundary of the security chip is effectively nullified.",
    "A hardware attacker equipped with a budget \$15 USB logic analyzer or digital storage oscilloscope can easily clip miniature probe needles onto the exposed I2C clock (SCL) and data (SDA) lines or the SPI MOSI/MISO pins. If the host SoC communicates with the Secure Element using plaintext commands, the attacker can observe everything that passes over the bus. For instance, when the host sends user passwords, PINs, or symmetric encryption keys to the Secure Element, the eavesdropper captures them directly. Even more critically, an attacker can perform bus injection attacks, splicing malicious frames onto the bus to forge responses from the security chip.",
    "A famous real-world demonstration of this vulnerability occurred with game consoles and laptops utilizing discrete TPMs over unencrypted LPC and SPI buses. During BitLocker disk decryption at boot, the host CPU queries the TPM for the Volume Master Key (VMK) after verifying PCR measurements. The TPM releases the raw VMK over the SPI bus in plaintext. Security researchers showed that by simply touching a spring-loaded probe needle to the SPI flash line during power-on, a \$10 Raspberry Pi Pico microcontroller could capture the 256-bit AES disk encryption key in less than a second, completely bypassing disk encryption without exploiting any software bugs.",
    "To eliminate inter-chip bus sniffing and injection attacks, modern high-security IoT designs mandate the use of authenticated and encrypted transport protocols between the host processor and the Secure Element. The industry standard for this layer is the GlobalPlatform Secure Channel Protocol 03 (SCP03). SCP03 establishes an end-to-end cryptographic tunnel over the untrusted physical I2C or SPI bus lines. Under SCP03, both the host microcontroller and the Secure Element are pre-provisioned with a set of shared static base keys: a Channel Encryption Key (`K-ENC`) and a Channel MAC Key (`K-MAC`).",
    "During bus initialization, the host and Secure Element perform an authenticated mutual handshake that derives ephemeral session keys using AES-CMAC key derivation functions. Every subsequent Application Protocol Data Unit (APDU) packet or command transmitted across the PCB traces is encrypted using AES in Cipher Block Chaining (CBC) or Galois/Counter Mode (GCM), ensuring total confidentiality. Furthermore, every packet incorporates a strictly incrementing sequence counter and a cryptographic Message Authentication Code (MAC) tag.",
    "If an adversary attempts to tap the physical bus lines, they observe only high-entropy pseudorandom ciphertext bytes. If the adversary attempts to inject forged commands, replay previous packets, or manipulate clock lines, the MAC tag verification inside the receiving chip fails immediately, causing the Secure Element to abort the session and lock the bus. For hardware designs that cannot afford the computational overhead of discrete SCP03 chips, the modern industry trend is moving toward integrated Secure Elements—incorporating the hardware root-of-trust and secure enclave directly onto the main SoC die to eradicate external bus traces entirely."
]

# --- PART 5: Complete End-to-End SE & TPM Measured Boot Engine ---
p5_code = """# Apex-TPM2: End-to-End Measured Boot, Key Sealing & Attestation Simulator
import hashlib, hmac

class ApexTPM2Engine:
    def __init__(self):
        # Platform Configuration Registers (PCR[0] = Boot Chain, PCR[1] = Hardware Config)
        self.pcrs = {0: b"\\x00" * 32, 1: b"\\x00" * 32}
        self.sealed_secrets = {}
        self.ak_priv = b"APEX_ATTESTATION_KEY_256"

    def extend(self, pcr_idx: int, data: bytes):
        d_hash = hashlib.sha256(data).digest()
        self.pcrs[pcr_idx] = hashlib.sha256(self.pcrs[pcr_idx] + d_hash).digest()

    def seal_data(self, key_name: str, payload: bytes, required_pcr0: bytes):
        # Seal cryptographic key to a specific trusted PCR[0] measurement state
        self.sealed_secrets[key_name] = {
            "payload": payload,
            "required_pcr0": required_pcr0
        }

    def unseal_data(self, key_name: str) -> bytes:
        # TPM unseals payload ONLY if current PCR[0] matches the sealed policy
        item = self.sealed_secrets.get(key_name)
        if not item:
            raise KeyError("Key not found in TPM storage hierarchy")
        if self.pcrs[0] != item["required_pcr0"]:
            return b"ERROR: PCR_POLICY_FAILED_INTEGRITY_TAMPERED"
        return item["payload"]

# Step 1: Golden Boot Chain
golden_tpm = ApexTPM2Engine()
golden_tpm.extend(0, b"GOLDEN_BOOT_ROM_V1")
golden_tpm.extend(0, b"GOLDEN_OS_KERNEL_V4.19")
trusted_pcr0 = golden_tpm.pcrs[0]

# Seal disk encryption key strictly to golden boot state
golden_tpm.seal_data("DISK_ENCRYPTION_KEY", b"SECRET_AES_256_STORAGE_KEY", trusted_pcr0)

# Unseal test on healthy system
recovered_key = golden_tpm.unseal_data("DISK_ENCRYPTION_KEY")

# Step 2: Compromised Boot Chain (Malicious Rootkit injected into kernel)
tampered_tpm = ApexTPM2Engine()
tampered_tpm.extend(0, b"GOLDEN_BOOT_ROM_V1")
tampered_tpm.extend(0, b"ROOTKIT_MODIFIED_KERNEL_V4.19")
tampered_tpm.sealed_secrets = golden_tpm.sealed_secrets  # Same disk image

tampered_attempt = tampered_tpm.unseal_data("DISK_ENCRYPTION_KEY")

print("=== Apex-TPM2 Measured Boot & Key Sealing Engine ===")
print(f"Trusted PCR[0] Digest:   {trusted_pcr0.hex()[:32]}...")
print(f"Golden Boot Unseal Key:  {recovered_key.decode()}")
print(f"Tampered Boot PCR[0]:    {tampered_tpm.pcrs[0].hex()[:32]}...")
print(f"Tampered Unseal Result:  {tampered_attempt.decode()}")
print("TPM Sealing Invariant: Modifying a single byte of firmware locks all cryptographic keys.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "One of the most powerful and transformative capabilities of TPM 2.0 and modern cryptographic coprocessors is Data Sealing (also known as Key Sealing). In conventional computing systems, sensitive assets—such as full-disk encryption keys, database credentials, or zero-trust client private keys—are protected by user passwords or static configuration secrets. However, if an attacker injects a malicious bootloader, rootkit, or compromised kernel into the operating system, the compromised OS can still prompt for the password or unwrap the key, giving malware full access to encrypted user data.",
    "Data Sealing fundamentally binds cryptographic secrets to the physical health and integrity state of the platform. When a secret is sealed inside the TPM using the `TPM2_Seal` command, the caller specifies an explicit authorization policy tied to specific Platform Configuration Registers (e.g., `PCR[0]` and `PCR[2]`). The TPM encrypts the secret under its internal Storage Root Key (SRK) and mathematically binds the required golden PCR digest into the wrapped key's policy metadata. The wrapped key blob can then be safely written to untrusted flash memory.",
    "During subsequent device reboots, software requests the TPM to execute `TPM2_Unseal`. Before the TPM releases the plaintext secret, its internal security controller inspects the current live state of the hardware PCR registers. The unsealing operation succeeds IF AND ONLY IF the current values of the designated PCR registers match the exact policy digest specified during sealing. If a single bit in the Boot ROM, bootloader, kernel binary, or hardware device tree has been modified—whether due to physical tampering, rootkit installation, or an unauthorized downgrade—the cumulative hash extension produces an entirely different PCR value.",
    "Because the live PCR digest diverges from the sealed policy requirement, the TPM hardware refuses to unseal the secret. The disk encryption key is never released into system memory, preventing the compromised kernel from mounting sensitive filesystem partitions or accessing confidential database records. The device effectively locks itself down at the silicon level, thwarting data exfiltration attempts even by adversaries with full physical hardware possession and direct access to storage chips.",
    "Furthermore, TPM 2.0 supports sophisticated Policy Authorizations that accommodate legitimate software updates. Using `TPM2_PolicyAuthorize`, platform administrators can sign authorized updates with a vendor release key, allowing the TPM to update sealed policies dynamically when new legitimate kernels are deployed. This enables enterprise IoT fleets to maintain automated over-the-air firmware update pipelines without triggering false-positive key lockouts or requiring manual recovery keys.",
    "In industrial and mission-critical edge appliances, combining Measured Boot, Data Sealing, and Remote Attestation creates an impenetrable zero-trust posture. The device proves to the network that its hardware boot chain is authentic and uncompromised before it is granted access to the production network, and its internal keys remain sealed until that integrity is proven. By anchoring security in tamper-resistant silicon coprocessors, IoT systems maintain cryptographic resilience against both remote network intrusions and hands-on physical attacks."
]

def make_long_lesson_day8():
    return {
        "coursePrefix": "iot_sec",
        "day": 8,
        "title": "Secure Elements (SE) & Hardware Security Modules (TPM 2.0): I2C/SPI Bus Crypto Coprocessors & PCR Measurement",
        "goal": "Master hardware security coprocessors, exploring discrete Secure Elements (ATECC608B, SE050), TPM 2.0 architecture, Platform Configuration Registers (PCRs), cryptographic attestation quotes, and bus tampering defenses.",
        "minutes": 38,
        "recap": "Previously, we mastered asymmetric device identity and X.509 PKI hierarchies. Today, we examine the physical silicon boundaries that safeguard these cryptographic keys against side-channel and bus attacks.",
        "parts": [
            {
                "title": "Silicon Physical Attack Surfaces vs Secure Element Isolation",
                "say": p1_say,
                "example": "Standard SoC CMOS buses leak private keys through DPA and clock glitches; Secure Elements deploy active shields and dual-rail logic to achieve EAL6+ physical tamper resistance.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "HardwareIsolationAudit compares general SoC CMOS vulnerabilities against specialized Secure Element defenses.",
                    "Active silicon mesh shields physically overlie sensitive circuits, triggering zeroization upon mechanical or laser breach.",
                    "Dual-rail precharge logic balances power consumption across clock cycles, defeating Differential Power Analysis (DPA)."
                ],
                "tryIt": "Add an optical fault injection attack vector to HardwareIsolationAudit and simulate the SE's internal light sensor trigger.",
                "check": {
                    "question": "Why is an active silicon shield critical on a Secure Element coprocessor?",
                    "options": [
                        "It instantly detects physical milling, cutting, or probing attempts and triggers key zeroization before keys can be read.",
                        "It boosts the radio frequency transmission range of the I2C bus.",
                        "It reduces the thermal dissipation of the main application microcontroller.",
                        "It allows the device to operate without any external power source."
                    ],
                    "answer": 0,
                    "why": "An active silicon shield is an energized mesh of microscopic traces covering the die; any physical breach or cut triggers instant hardware zeroization of all stored secrets."
                }
            },
            {
                "title": "TPM 2.0 Cryptographic Hierarchy: EK, SRK, and PCR Registers",
                "say": p2_say,
                "example": "TPM 2.0 structures keys into Endorsement (EK) and Storage (SRK) hierarchies, while cumulative Platform Configuration Registers (PCRs) record boot integrity via one-way hash extensions.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "Endorsement Key (EK) is permanently derived from silicon primary seed (EPS) and represents unique device physical identity.",
                    "Storage Root Key (SRK) encrypts and wraps child keys, allowing virtually unlimited external key storage.",
                    "PCR extend operations compute SHA-256(old_PCR || measurement), creating an unalterable cumulative hash history."
                ],
                "tryIt": "Extend PCR[0] with a third measurement representing application runtime parameters and print the updated digest.",
                "check": {
                    "question": "What mathematical property prevents an attacker from resetting or manipulating a TPM PCR register to a prior state?",
                    "options": [
                        "PCRs can only be extended via one-way cryptographic hash chaining: PCR_new = Hash(PCR_old || measurement).",
                        "PCRs are stored in volatile static RAM that requires manual jumper pins to modify.",
                        "PCR registers are locked with a user password that is changed on every reboot.",
                        "PCRs only accept plaintext integers and reject binary hash digests."
                    ],
                    "answer": 0,
                    "why": "PCRs cannot be written with arbitrary values; they can only be extended through one-way cryptographic hashing, making history reversal mathematically impossible."
                }
            },
            {
                "title": "Measured Boot Logging & Cryptographic Attestation Quotes",
                "say": p3_say,
                "example": "Measured Boot records each firmware component into PCRs and system event logs; Remote Attestation signs the PCR bank alongside an ephemeral challenge nonce using an Attestation Key.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "MeasuredBootAttestationEngine maintains both hardware PCR0 accumulation and a companion software event log.",
                    "Attestation Quote binds PCR state with an ephemeral verifier nonce using HMAC/digital signature to prevent replay attacks.",
                    "Remote verifier validates the quote by replaying the event log and verifying the cryptographic signature."
                ],
                "tryIt": "Modify the Stage2_Bootloader binary bytes and observe how the resulting attestation quote signature changes.",
                "check": {
                    "question": "How does a remote cloud verifier ensure that an Attestation Quote is fresh and not an intercepted replay?",
                    "options": [
                        "The verifier provides an ephemeral high-entropy nonce that the TPM mathematically includes inside the signed quote.",
                        "The verifier asks the device to re-flash its Boot ROM with an unencrypted image.",
                        "The verifier compares the device's local clock against the UTC network time protocol server.",
                        "The verifier disables the TPM hardware clock using an I2C command."
                    ],
                    "answer": 0,
                    "why": "The verifier sends an unpredictable random nonce in its challenge, which the TPM binds into the cryptographically signed quote, guaranteeing freshness and preventing replay."
                }
            },
            {
                "title": "Inter-Chip Bus Interception & SCP03 Encrypted Transport",
                "say": p4_say,
                "example": "Unprotected PCB copper traces between SoC and Secure Element are vulnerable to \$15 logic analyzer sniffing; GlobalPlatform SCP03 establishes an AES-encrypted, authenticated session tunnel.",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "SecureBusChannelSimulator demonstrates raw bus sniffing versus encrypted, MAC-authenticated bus traffic.",
                    "SCP03 derives session keystreams from static base keys to encrypt payload data crossing physical PCB copper traces.",
                    "Sequence counters and MAC integrity tags protect against packet replay, injection, and bus tampering."
                ],
                "tryIt": "Tamper with a single byte of ciphertext in transmit_scp03_bus and verify that MAC tag verification fails.",
                "check": {
                    "question": "Why is an unencrypted SPI or I2C bus between a host SoC and an external TPM a major security vulnerability?",
                    "options": [
                        "An attacker with physical access can tap PCB traces with a logic analyzer and extract unencrypted keys (like BitLocker VMK) as they cross the bus.",
                        "Unencrypted buses draw twice as much power from the battery supply.",
                        "Unencrypted signals cause severe electromagnetic interference that disables the device's radio antennas.",
                        "I2C buses cannot transmit binary cryptographic keys without crashing the microcontroller."
                    ],
                    "answer": 0,
                    "why": "External bus traces are physically accessible on the circuit board; unencrypted buses allow adversaries with basic probes to intercept keys released by the TPM."
                }
            },
            {
                "title": "Complete TPM 2.0 Measured Boot, Data Sealing & Attestation Engine",
                "say": p5_say,
                "example": "ApexTPM2Engine seals disk encryption keys to golden PCR[0] boot measurements; any kernel tampering or unauthorized code execution permanently locks the decryption key in hardware.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexTPM2Engine simulates hardware key sealing where decryption keys are bound to expected PCR[0] hash states.",
                    "Golden boot sequence successfully unseals the secret storage key because measurements match the registered policy.",
                    "Tampered boot chain causes PCR[0] to diverge, causing hardware unseal to reject access and protect confidential data."
                ],
                "tryIt": "Add PCR[1] hardware device tree configuration to the sealing policy and verify that altering peripheral configs blocks unsealing.",
                "check": {
                    "question": "What occurs when software attempts to unseal a TPM key after a malicious rootkit was injected into the OS kernel?",
                    "options": [
                        "The TPM rejects the unseal request because the extended PCR digest does not match the sealed authorization policy.",
                        "The TPM executes an automatic factory reset and deletes all hardware seeds.",
                        "The TPM boots the kernel into safe mode with administrator privileges.",
                        "The TPM sends an unencrypted alert email to the device owner."
                    ],
                    "answer": 0,
                    "why": "Because the rootkit binary modifies the measurement extended into the PCR, the live PCR value diverges from the sealed policy, causing the TPM to refuse unsealing."
                }
            }
        ],
        "summary": [
            "Discrete Secure Elements (SEs) provide Common Criteria EAL6+ physical tamper resistance against DPA, EMFI, and microprobing via active shields and dual-rail logic.",
            "TPM 2.0 organizes cryptographic assets into Endorsement (EK) and Storage (SRK) hierarchies, with Platform Configuration Registers (PCRs) tracking boot state.",
            "Measured Boot logs cumulative component hashes into PCRs via one-way extend operations, enabling cryptographic remote attestation quotes to prove platform integrity.",
            "Inter-chip bus communication (I2C/SPI) between SoC and Secure Element must be encrypted and MAC-authenticated using protocols like SCP03 to prevent physical bus probing.",
            "TPM Data Sealing binds sensitive storage keys to trusted golden PCR measurements, mathematically preventing compromised firmware from accessing encrypted assets."
        ],
        "projectStep": {
            "title": "Build & Validate Hardware Secure Element & TPM 2.0 Engine",
            "steps": [
                "Implement a simulated TPM 2.0 key hierarchy generating Endorsement (EK) and Storage Root Keys (SRK) from primary seeds.",
                "Construct an 8-bank SHA-256 Platform Configuration Register (PCR) subsystem enforcing one-way cryptographic extend operations.",
                "Build a Measured Boot pipeline logging execution events and generating signed Remote Attestation Quotes with challenge nonces.",
                "Implement an SCP03 encrypted bus channel protecting inter-chip I2C/SPI transmissions against logic analyzer sniffing.",
                "Develop and verify an end-to-end Data Sealing engine that releases disk encryption keys only when golden boot PCR state is verified."
            ]
        }
    }

day8_data = make_long_lesson_day8()
with open("scripts/iot_sec_day8.json", "w", encoding="utf-8") as f:
    json.dump(day8_data, f, indent=2)

words = [sum(len(s.split()) for s in p["say"]) for p in day8_data["parts"]]
print(f"Day 8 generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
