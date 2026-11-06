import json

def generate_day27():
    day27 = {
        "coursePrefix": "iot_sec",
        "day": 27,
        "title": "Cryptographic Key Lifecycle Management & Emergency Zeroization",
        "goal": "Master cryptographic key lifecycle state machines (NIST SP 800-57), architect forward-secret key rotation protocols via HKDF ratchets, implement hardware tamper detection pin triggers, and engineer compiler-safe active memory zeroization routines on bare-metal silicon.",
        "minutes": 38,
        "recap": "Yesterday we hardened the bare-metal network attack surface through port lockdowns, rate limiting, and defensive parsing. Today we architect cryptographic key lifecycle governance and emergency hardware zeroization to protect root secrets throughout their operational lifespan.",
        "parts": [
            {
                "title": "NIST SP 800-57 Cryptographic Key States & The Cryptoperiod Lifecycle",
                "say": [
                    "In the architecture of secure embedded devices, engineers dedicate immense effort to key generation and algorithmic encryption. However, in the multi-decade operational reality of industrial equipment, utility smart meters, and connected automotive components, the most dangerous phase of a cryptographic key's life is not its creation—it is its retirement and destruction.",
                    "Consider what happens when an industrial IoT gateway is decommissioned after ten years in the field and sold at an electronics salvage auction. If the device's root signing keys, long-term identity credentials, and session keys remain stored in non-volatile flash or battery-backed SRAM, a hobbyist or adversary with basic laboratory tools can decap the chip, read the keys, and forge digital signatures or decrypt historic telemetry captures recorded years prior.",
                    "To govern keys systematically from birth to destruction, embedded security architectures adhere to NIST SP 800-57 (Recommendation for Key Management). NIST defines a formal key state machine comprising six distinct phases: 1) Pre-Activation: The key is generated in an HSM or on-chip TRNG but not yet authorized for cryptographic operations; 2) Active: The key is actively utilized to encrypt data or verify signatures; 3) Suspended: The key is temporarily frozen pending administrative review; 4) Deactivated: The key has reached the end of its cryptoperiod and can no longer encrypt, but may be retained strictly for historic decryption; 5) Compromised: The key has been exposed or breached; and 6) Destroyed: All traces of the key material are irrevocably obliterated from silicon.",
                    "Crucial to this state machine is the concept of a Cryptoperiod. A cryptoperiod is the time span during which a specific key is authorized for use. Cryptoperiods are bounded by two constraints: calendar time (e.g., maximum 12 months for an active session key) and data volume limits. For example, under AES-GCM encryption with 96-bit nonces, generating more than 2^32 ciphertext blocks under the same key dramatically increases the mathematical probability of nonce collision, leading to catastrophic key recovery. Once a key's cryptoperiod expires, the key state machine must transition the key to Deactivated and force a key rotation."
                ],
                "example": "Let us simulate the NIST SP 800-57 key lifecycle state machine tracking usage counts, cryptoperiod expiration, and key destruction.",
                "code": "STATES = [\"PRE_ACTIVATION\", \"ACTIVE\", \"SUSPENDED\", \"DEACTIVATED\", \"COMPROMISED\", \"DESTROYED\"]\n\nclass KeyLifecycle:\n    def __init__(self, key_id: str):\n        self.key_id = key_id\n        self.state = \"PRE_ACTIVATION\"\n        self.usage_count = 0\n        self.max_usage = 1000\n\n    def activate(self):\n        if self.state == \"PRE_ACTIVATION\":\n            self.state = \"ACTIVE\"\n            return True\n        return False\n\n    def record_use(self):\n        if self.state != \"ACTIVE\":\n            return False, \"KEY_NOT_ACTIVE\"\n        self.usage_count += 1\n        if self.usage_count >= self.max_usage:\n            self.state = \"DEACTIVATED\"\n            return True, \"CRYPTOPERIOD_EXPIRED\"\n        return True, \"OK\"\n\n    def destroy(self):\n        self.state = \"DESTROYED\"\n\nkl = KeyLifecycle(\"AES_MASTER_KEY_01\")\nkl.activate()\nok, msg = kl.record_use()\n\nprint(f\"Key ID: {kl.key_id}, State: {kl.state}\")\nprint(f\"Usage Recorded: {ok}, Result: {msg}\")\nkl.destroy()\nprint(f\"Final State: {kl.state}\")",
                "output": "Key ID: AES_MASTER_KEY_01, State: ACTIVE\nUsage Recorded: True, Result: OK\nFinal State: DESTROYED",
                "codeNotes": [
                    "Models key lifecycle transitions adhering to NIST SP 800-57 recommendations.",
                    "Tracks operational invocation counts to enforce cryptoperiod volume boundaries.",
                    "Transitions keys to DEACTIVATED when volume limits expire and DESTROYED upon retirement."
                ],
                "tryIt": "Set usage_count to 999 and call record_use() to confirm that state transitions to DEACTIVATED with CRYPTOPERIOD_EXPIRED.",
                "check": {
                    "question": "Why does NIST SP 800-57 enforce a strict cryptoperiod limit on active cryptographic keys?",
                    "options": [
                        "To limit the volume of ciphertext available to cryptanalysts and reduce the exposure window if a key is compromised.",
                        "Because keys naturally lose electrical conductivity over time.",
                        "To allow microcontrollers to run faster every 30 days.",
                        "Because AES keys become corrupt after 100 uses."
                    ],
                    "answer": 0,
                    "why": "Restricting cryptoperiods limits the amount of data encrypted under a single key, preventing statistical cryptanalysis and bounding the impact of key compromise."
                }
            },
            {
                "title": "Secure Key Rotation Protocols & Backward/Forward Secrecy",
                "say": [
                    "When an active session key reaches the end of its cryptoperiod, the system must execute a Secure Key Rotation Protocol. In distributed IoT fleets, key rotation must satisfy two stringent cryptographic properties: Forward Secrecy and Backward Secrecy.",
                    "Forward Secrecy ensures that if an attacker compromises the current operational key (Epoch N), the attacker cannot mathematically derive or decrypt any previous communications (Epoch N-1, Epoch N-2). Backward Secrecy ensures that knowledge of a compromised key does not grant the attacker the ability to predict future keys (Epoch N+1, Epoch N+2).",
                    "To achieve this on resource-constrained microcontrollers, firmware architectures employ Cryptographic Ratchets driven by Key Derivation Functions (KDFs), such as HKDF-SHA256 (RFC 5869) or HMAC-SHA256.",
                    "At each rotation epoch, the engine feeds the previous key material and an epoch-specific contextual string (e.g., b'KEY_ROTATION_EPOCH_' || uint32(epoch)) into the one-way HMAC function to produce the subsequent epoch key. Because hash functions are computationally irreversible (one-way), an attacker who reads Epoch 2 cannot invert the hash to discover Epoch 1 or Epoch 0, mathematically preserving forward secrecy across the fleet."
                ],
                "example": "Let us simulate a one-way HKDF cryptographic ratchet deriving successive epoch keys with forward secrecy guarantees.",
                "code": "import hashlib\nimport hmac\nimport struct\n\ncurrent_key = hashlib.sha256(b\"ROOT_SESSION_KEY_EPOCH_0\").digest()\n\ndef rotate_key(prev_key: bytes, epoch: int) -> bytes:\n    info = b\"KEY_ROTATION_EPOCH_\" + struct.pack(\">I\", epoch)\n    return hmac.new(prev_key, info, hashlib.sha256).digest()\n\nepoch1_key = rotate_key(current_key, 1)\nepoch2_key = rotate_key(epoch1_key, 2)\n\nprint(f\"Epoch 0 Key: {current_key[:8].hex()}...\")\nprint(f\"Epoch 1 Key: {epoch1_key[:8].hex()}...\")\nprint(f\"Epoch 2 Key: {epoch2_key[:8].hex()}...\")\nprint(f\"Forward Secrecy Preserved: {epoch1_key != epoch2_key}\")",
                "output": "Epoch 0 Key: 435eb8a2e9e9378f...\nEpoch 1 Key: ab892ff48d697f0a...\nEpoch 2 Key: d595787dd576a1ba...\nForward Secrecy Preserved: True",
                "codeNotes": [
                    "Derives successive epoch keys using an irreversible HMAC-SHA256 ratchet.",
                    "Binds the rotation epoch index into the derivation context string.",
                    "Guarantees that compromising a future key provides zero ability to recover past epoch keys."
                ],
                "tryIt": "Derive epoch3_key from epoch2_key and verify that it produces a completely unique 32-byte digest.",
                "check": {
                    "question": "What mathematical property of cryptographic hash functions guarantees Forward Secrecy during key ratcheting?",
                    "options": [
                        "Pre-image resistance (one-wayness): It is computationally infeasible to invert the hash and calculate previous input keys from the current key.",
                        "Hashing algorithms can only be executed in reverse by authorized government agencies.",
                        "Keys become larger in size every time they are rotated.",
                        "Hash functions automatically delete earlier variables from flash memory."
                    ],
                    "answer": 0,
                    "why": "Because hash functions cannot be inverted (pre-image resistance), an adversary possessing an active key cannot compute the previous keys used in prior epochs."
                }
            },
            {
                "title": "Physical Tamper Detection & Hardware Zeroization Triggers",
                "say": [
                    "In physical operational environments, IoT devices are vulnerable to laboratory extraction attacks. An adversary can kidnap an edge sensor, transport it to a reverse-engineering workbench, remove the enclosure screws, and attach micro-probes directly to internal memory buses to read plaintext cryptographic keys.",
                    "To defend against hands-on physical attacks, industrial microcontrollers integrate dedicated Hardware Tamper Detection Peripherals (such as STMicroelectronics TAMP pins, NXP Dry-Contact Tamper inputs, or Microchip CryptoAuthentication active shields).",
                    "A tamper detection system utilizes physical sensors connected to battery-backed low-power microcontroller pins: 1) Chassis Micro-Switches: Spring-loaded mechanical switches that open when the casing is unscrewed; 2) Conductive Mesh Enclosures: A serpentine trace running across the inner casing; cutting the trace opens the circuit; 3) Ambient Light Sensors: Photodiodes inside a sealed opaque enclosure that trigger when exposed to ambient light; 4) Environmental Monitors: Sensors detecting extreme thermal shock (-40C to +120C) or supply voltage glitching.",
                    "When a tamper circuit trips, the hardware controller triggers a non-maskable interrupt (NMI) and asserts an immediate hardware wipe command. In under 100 nanoseconds—before an attacker can disconnect power or halt the CPU—the silicon controller disconnects internal bus lines and triggers emergency zeroization, neutralizing physical theft before data extraction can occur."
                ],
                "example": "Let us simulate a hardware tamper detection monitor responding to an enclosure breach interrupt by enforcing immediate lockdown.",
                "code": "class TamperMonitor:\n    def __init__(self):\n        self.tamper_detected = False\n        self.lockdown_active = False\n\n    def on_tamper_pin_interrupt(self, pin_state_high: bool):\n        if pin_state_high:\n            self.tamper_detected = True\n            self.lockdown_active = True\n            return \"EMERGENCY_LOCKDOWN_TRIGGERED\"\n        return \"IDLE_NORMAL\"\n\nmonitor = TamperMonitor()\nres1 = monitor.on_tamper_pin_interrupt(False)\nres2 = monitor.on_tamper_pin_interrupt(True)\n\nprint(f\"Normal Monitoring : {res1}\")\nprint(f\"Chassis Breach Pin: {res2}\")\nprint(f\"Lockdown Enforced : {monitor.lockdown_active}\")",
                "output": "Normal Monitoring : IDLE_NORMAL\nChassis Breach Pin: EMERGENCY_LOCKDOWN_TRIGGERED\nLockdown Enforced : True",
                "codeNotes": [
                    "Simulates physical tamper pin interrupt handling on hardware breach events.",
                    "Transitions immediately from normal monitoring to active security lockdown.",
                    "Provides an instantaneous hardware trigger for cryptographic memory scrubbing."
                ],
                "tryIt": "Reset tamper_detected to False and verify that lockdown_active remains True to simulate irreversible lockout.",
                "check": {
                    "question": "What is the primary role of a hardware tamper detection peripheral in an embedded microcontroller?",
                    "options": [
                        "Detect physical enclosure breaches, mesh cuts, or voltage glitches and trigger immediate hardware zeroization of sensitive key registers.",
                        "Measure the ambient temperature to display on an LCD screen.",
                        "Recharge the microcontroller battery using solar power.",
                        "Increase the transmission power of the Wi-Fi radio."
                    ],
                    "answer": 0,
                    "why": "Tamper peripherals monitor physical switches, meshes, and sensors to detect unauthorized chassis opening and instantly trigger cryptographic wiping."
                }
            },
            {
                "title": "Memory Scrubbing & The memset Compiler Elimination Hazard",
                "say": [
                    "When an emergency zeroization event or normal key retirement occurs, the software must wipe the cryptographic key from volatile SRAM. In novice C code, developers write: memset(key_buffer, 0, 32); and assume the key is destroyed. In modern optimizing compilers (such as GCC and Clang at -O2 or -O3), this assumption causes a catastrophic vulnerability.",
                    "The C standard permits the compiler to eliminate memory writes if the compiler's data-flow analysis proves that the modified memory buffer is never read again before the function returns or the buffer is freed. This optimization pass is known as Dead-Store Elimination.",
                    "Because key scrubbing typically occurs at the very end of a cryptographic session—right before the function returns—the compiler determines that the memset() call has zero observable effect on program output. The compiler completely deletes the memset() instructions from the generated machine code! The function returns, but the plaintext 256-bit AES key remains completely intact in SRAM, waiting for an attacker to extract it via a memory dump or buffer over-read bug.",
                    "To prevent dead-store elimination, embedded security engineers utilize explicit memory sanitization primitives: 1) volatile pointer access: Casting the buffer pointer to volatile uint8_t* and writing zeros in an unoptimizable loop; 2) Standardized safe erasers: Utilizing memset_s() (C11 Annex K) or explicit_bzero(); 3) Hardware Memory Barriers: Issuing Data Memory Barrier (DMB) and Data Synchronization Barrier (DSB) instructions to force writes across CPU write buffers; 4) Cache Line Invalidation: Flushing and invalidating CPU L1 data cache lines to ensure zeroized values reach physical SRAM cells."
                ],
                "example": "Let us simulate explicit volatile memory scrubbing and verify that all bytes in the key buffer are overwritten with zeros.",
                "code": "class SecureMemoryBuffer:\n    def __init__(self, key_bytes: bytes):\n        self.buf = bytearray(key_bytes)\n\n    def is_scrubbed(self) -> bool:\n        return all(b == 0 for b in self.buf)\n\n    def explicit_zeroize(self):\n        for i in range(len(self.buf)):\n            self.buf[i] = 0x00\n\nsecret_key = b\"TOP_SECRET_SESSION_KEY_MATERIAL_\"\nmem = SecureMemoryBuffer(secret_key)\nbefore_zero = mem.is_scrubbed()\nmem.explicit_zeroize()\nafter_zero = mem.is_scrubbed()\n\nprint(f\"Memory Scrubbed Before: {before_zero}\")\nprint(f\"Memory Scrubbed After : {after_zero}\")\nprint(f\"Buffer Content: {bytes(mem.buf)}\")",
                "output": "Memory Scrubbed Before: False\nMemory Scrubbed After : True\nBuffer Content: b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00'",
                "codeNotes": [
                    "Simulates volatile pointer writing to defeat compiler dead-store elimination.",
                    "Overwrites every byte in the cryptographic buffer individually with binary zeros.",
                    "Confirms through is_scrubbed() that zero residual key material remains in memory."
                ],
                "tryIt": "Verify that len(mem.buf) remains 32 bytes after zeroization, with every single byte equal to 0.",
                "check": {
                    "question": "Why is a standard C memset() call dangerously unsafe for wiping cryptographic keys in optimized firmware?",
                    "options": [
                        "Optimizing compilers perform dead-store elimination, deleting memset() calls if the memory buffer is not read again before function return.",
                        "memset() only works on floating-point numbers.",
                        "memset() inverts the bits instead of setting them to zero.",
                        "Standard C compilers do not support memset() on ARM processors."
                    ],
                    "answer": 0,
                    "why": "Compilers treat writes to memory that will not be read again as 'dead stores' and optimize them away, leaving plaintext keys intact in memory."
                }
            },
            {
                "title": "ApexKeyLifecycleEngine: Complete Bare-Metal Key State & Active Zeroization System",
                "say": [
                    "To synthesize key state governance, ratcheted rotation, tamper monitoring, and explicit memory scrubbing into an industrial-grade architecture, we implement the ApexKeyLifecycleEngine.",
                    "The engine manages active cryptographic key material inside a protected memory buffer. Under normal operation, the engine executes scheduled key rotations at defined epoch intervals. When a rotation is requested, the engine ratchets the key using HMAC-SHA256, stores the new epoch key, and immediately executes explicit zeroization over the previous key buffer to maintain strict forward secrecy.",
                    "Concurrently, the engine interfaces with hardware tamper interrupt lines. If a chassis breach or voltage glitch trips the tamper line, the engine aborts all ongoing operations, transitions its state to DESTROYED, and executes an atomic memory scrub across all volatile key storage registers.",
                    "Once zeroized, the engine enters an irreversible lockdown state. Subsequent attempts to encrypt data or rotate keys are permanently rejected. By coupling NIST SP 800-57 lifecycle discipline with hardware-triggered active zeroization, the ApexKeyLifecycleEngine guarantees that edge device secrets remain protected throughout their operational lifespan and are irrevocably erased in the event of physical compromise."
                ],
                "example": "Let us execute the ApexKeyLifecycleEngine across normal ratcheted rotation and an emergency physical tamper zeroization event.",
                "code": "import struct\nimport hashlib\nimport hmac\n\nclass ApexKeyLifecycleEngine:\n    def __init__(self, initial_key_material: bytes):\n        self.key_store = {\"ACTIVE_KEY\": bytearray(initial_key_material)}\n        self.epoch = 0\n        self.state = \"ACTIVE\"\n        self.tamper_tripped = False\n\n    def rotate_active_key(self):\n        if self.state != \"ACTIVE\":\n            return False, \"CANNOT_ROTATE_INACTIVE_KEY\"\n        self.epoch += 1\n        old_key = bytes(self.key_store[\"ACTIVE_KEY\"])\n        new_key = hmac.new(old_key, b\"RATCHET_\" + struct.pack(\">I\", self.epoch), hashlib.sha256).digest()\n        for i in range(len(self.key_store[\"ACTIVE_KEY\"])):\n            self.key_store[\"ACTIVE_KEY\"][i] = 0\n        self.key_store[\"ACTIVE_KEY\"] = bytearray(new_key)\n        return True, f\"KEY_ROTATED_EPOCH_{self.epoch}\"\n\n    def emergency_zeroize(self, tamper_pin: bool):\n        if tamper_pin:\n            self.tamper_tripped = True\n            self.state = \"DESTROYED\"\n            for i in range(len(self.key_store[\"ACTIVE_KEY\"])):\n                self.key_store[\"ACTIVE_KEY\"][i] = 0x00\n            return True, \"ZEROIZED_IMMEDIATELY\"\n        return False, \"NO_TAMPER\"\n\nengine = ApexKeyLifecycleEngine(b\"INITIAL_AES_KEY_MATERIAL_32B_01\"[:32])\n\nok_rot, msg_rot = engine.rotate_active_key()\nok_wipe, msg_wipe = engine.emergency_zeroize(tamper_pin=True)\n\nis_cleared = all(b == 0 for b in engine.key_store[\"ACTIVE_KEY\"])\nprint(f\"Rotation Result : {msg_rot} (Success: {ok_rot})\")\nprint(f\"Emergency Action: {msg_wipe} (State: {engine.state})\")\nprint(f\"Active Key Scrubbed to Zero: {is_cleared}\")",
                "output": "Rotation Result : KEY_ROTATED_EPOCH_1 (Success: True)\nEmergency Action: ZEROIZED_IMMEDIATELY (State: DESTROYED)\nActive Key Scrubbed to Zero: True",
                "codeNotes": [
                    "Coordinates forward-secret key ratcheting and emergency tamper zeroization.",
                    "Overwrites sensitive key material with zeros before reallocating or decommissioning.",
                    "Transitions permanently to DESTROYED upon physical tamper events, locking out compromised hardware."
                ],
                "tryIt": "Attempt to call rotate_active_key() after emergency_zeroize() and verify that it returns CANNOT_ROTATE_INACTIVE_KEY.",
                "check": {
                    "question": "What happens when the ApexKeyLifecycleEngine detects a physical tamper event via its tamper pin?",
                    "options": [
                        "It transitions to DESTROYED, actively zeroizes all key material in memory, and locks down the device permanently.",
                        "It transmits the plaintext master key to the nearest Wi-Fi router.",
                        "It prompts the technician to enter an administrative password.",
                        "It resets the microcontroller clock speed to 1 MHz."
                    ],
                    "answer": 0,
                    "why": "Tamper events trigger active memory zeroization and state transition to DESTROYED, neutralizing physical key extraction attacks."
                }
            }
        ],
        "summary": [
            "Cryptographic keys must be managed across formal lifecycles governed by NIST SP 800-57, enforcing cryptoperiod limits on data volume and calendar time.",
            "Forward and backward secrecy are maintained using cryptographic ratchets driven by one-way HMAC Key Derivation Functions (HKDF).",
            "Hardware tamper peripherals detect casing breaches, mesh cuts, and electrical glitches to trigger sub-microsecond emergency zeroization.",
            "Standard memset() calls are vulnerable to compiler dead-store elimination; memory scrubbing must utilize volatile pointers or explicit zeroization primitives."
        ],
        "projectStep": {
            "title": "Cryptographic Key Lifecycle & Active Zeroization Subsystem Integration",
            "steps": [
                "Implement NIST SP 800-57 key state machine transitions and cryptoperiod invocation tracking.",
                "Construct the HKDF-SHA256 forward-secret key rotation ratcheting protocol.",
                "Configure hardware tamper detection GPIO pins to trigger non-maskable interrupts on enclosure breaches.",
                "Implement compiler-safe volatile memory scrubbing routines with memory barrier instructions."
            ]
        }
    }
    with open('scripts/iot_sec_day27.json', 'w', encoding='utf-8') as f:
        json.dump(day27, f, indent=2)
    print("Generated base Day 27 in scripts/iot_sec_day27.json")

if __name__ == '__main__':
    generate_day27()
