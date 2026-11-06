import json

def generate_day25():
    day25 = {
        "coursePrefix": "iot_sec",
        "day": 25,
        "title": "Milestone 5: Resilient FOTA Ingestion, Anti-Rollback Enforcement & Remote Device Attestation Engine",
        "goal": "Architect and implement an end-to-end bare-metal firmware lifecycle engine integrating dual-bank A/B flash staging, asymmetric manifest digest chains, OTP eFuse monotonic anti-rollback version fencing, and TCG DICE remote attestation token generation.",
        "minutes": 38,
        "recap": "Over the past four days, we mastered dual-bank flash partitioning, cryptographic manifest signing, OTP eFuse monotonic counter mechanics, and TCG DICE attestation architectures. Today, we unite these subsystems into our Milestone 5 production engine.",
        "parts": [
            {
                "title": "Milestone Architecture: The Unified FOTA, Anti-Rollback & DICE Attestation Pipeline",
                "say": [
                    "Welcome to Milestone 5. Throughout Month 1, we have engineered individual security primitives: physical memory bus encryption, fault injection countermeasures, secure boot chain verification, hardware roots of trust, and cryptographic peripheral authentication. Today, we achieve architectural culmination by synthesizing these isolated security controls into an integrated, industrial-grade subsystem: the ApexMilestone5FotaAttestationEngine.",
                    "In enterprise IoT deployments, firmware management cannot be treated as a collection of disconnected scripts. An edge device operates in hostile environments where wireless connectivity is intermittent, power sources are unstable, and adversaries possess physical access to hardware pins. To survive and maintain security guarantees, every firmware update must execute across a unified, deterministic pipeline governed by immutable state transitions.",
                    "The pipeline begins in the IDLE state, where the device runs verified golden firmware in Slot A. When a Firmware Over-The-Air (FOTA) update notification arrives from the cloud backend, the device transitions to DOWNLOADING, buffering the binary manifest into secure RAM. The engine then transitions to MANIFEST_VERIFIED, validating the asymmetric signature against the OEM public key anchored in silicon eFuses.",
                    "Next, the engine checks the Security Version Number (SVN). If the package attempts to flash an older security version, the engine aborts the pipeline, flagging a downgrade attack. If the version fence is satisfied, the payload is written to flash, moving to STAGED_SLOT_B. The device reboots under hardware watchdog supervision into TRIAL_BOOT mode. Crucially, the hardware eFuse is NOT blown yet.",
                    "During TRIAL_BOOT, the candidate image runs diagnostic routines, verifies sensor peripherals, and executes a cloud health check. If an anomaly occurs, the watchdog resets the device, safely reverting execution to Slot A. Only if all self-tests succeed does the device issue the atomic commit command, permanently blowing the hardware eFuse to the new SVN, transitioning to CONFIRMED_COMMITTED, and deriving new DICE attestation credentials.",
                    "This unified lifecycle guarantees zero-downtime resilience, eliminates device bricking risks, prevents malicious downgrade attacks, and provides mathematical attestation proof to the cloud backend that the node is running verified software."
                ],
                "example": "Let us trace the deterministic state machine transitions of the unified FOTA, anti-rollback, and attestation lifecycle pipeline.",
                "code": "states = [\"IDLE\", \"DOWNLOADING\", \"MANIFEST_VERIFIED\", \"STAGED_SLOT_B\", \"TRIAL_BOOT\", \"CONFIRMED_COMMITTED\"]\ncurrent_state = \"IDLE\"\ntransitions = []\n\nfor next_state in states[1:]:\n    current_state = next_state\n    transitions.append(current_state)\n    \nprint(f\"Pipeline Initial State: IDLE\")\nprint(f\"State Sequence: {' -> '.join(transitions)}\")\nprint(f\"Final State Valid: {current_state == 'CONFIRMED_COMMITTED'}\")",
                "output": "Pipeline Initial State: IDLE\nState Sequence: DOWNLOADING -> MANIFEST_VERIFIED -> STAGED_SLOT_B -> TRIAL_BOOT -> CONFIRMED_COMMITTED\nFinal State Valid: True",
                "codeNotes": [
                    "Defines the strict deterministic state progression of the secure firmware lifecycle.",
                    "Prevents invalid state jumps, ensuring no firmware is booted before manifest authentication.",
                    "Enforces two-stage trial boot before committing permanent hardware eFuse state changes."
                ],
                "tryIt": "Simulate a failed trial boot transition where TRIAL_BOOT reverts back to IDLE in Slot A.",
                "check": {
                    "question": "What is the primary benefit of modeling the FOTA, anti-rollback, and attestation process as a formal state machine?",
                    "options": [
                        "It eliminates invalid execution paths and ensures that security checks, trial runs, and eFuse commits execute in an immutable, deterministic order.",
                        "It reduces the size of the firmware binary by 80%.",
                        "It allows the bootloader to run without a CPU.",
                        "It automatically translates Python code into Verilog."
                    ],
                    "answer": 0,
                    "why": "A formal state machine guarantees that every stage—from manifest verification to trial testing and eFuse burning—executes deterministically without exploitable race conditions."
                }
            },
            {
                "title": "Dual-Bank Staging & Asymmetric Manifest Digest Chain Ingestion",
                "say": [
                    "The second stage of our Milestone 5 engine handles package ingestion, manifest parsing, and dual-bank staging. As established in Days 21 and 22, receiving raw binary code directly over the network without structural metadata is an architectural hazard.",
                    "The engine requires a structured binary manifest prepended to the firmware payload. The manifest begins with a 4-byte magic identifier (b'APEX'), followed by a 4-byte big-endian Security Version Number (SVN), a 4-byte payload length integer, and a 32-byte SHA-256 cryptographic digest of the complete firmware payload.",
                    "To guarantee authenticity, the manifest is digitally signed using the OEM root private key. During ingestion, the engine computes the expected HMAC or asymmetric signature over the manifest bytes using the OEM public key. If an attacker tampers with even a single bit in the manifest—such as altering the declared SVN or image size—the signature check fails immediately, and the update package is discarded before touching flash memory.",
                    "Once the manifest signature is verified, the engine streams the firmware payload into the inactive flash slot (Slot B). During streaming, the hardware cryptographic accelerator continuously calculates the SHA-256 digest of the incoming bytes. Upon completion, the calculated digest is compared against the digest declared inside the signed manifest.",
                    "If the digests match, the payload is confirmed to be intact and authentic. Slot B is marked as 'STAGED', and the bootloader prepares to initiate a trial boot. By staging the candidate image into the secondary bank while the primary bank remains actively executing in Slot A, the device guarantees uninterrupted uptime and immunity to power failures during wireless transmission."
                ],
                "example": "Let us simulate the binary manifest verification, payload digest validation, and staging sequence.",
                "code": "import struct\nimport hashlib\nimport hmac\n\noem_root_pubkey = b\"OEM_ROOT_ED25519_PUBLIC_KEY_COORDS\"[:32]\nefuse_pubkey_hash = hashlib.sha256(oem_root_pubkey).digest()\n\nsec_version = 14\napp_code = b\"APEX_FIRMWARE_PAYLOAD_V2_4_0_SEC_PATCHED\"\napp_digest = hashlib.sha256(app_code).digest()\n\nmanifest = struct.pack(\">4sII\", b\"APEX\", sec_version, len(app_code)) + app_digest\nmanifest_signature = hmac.new(oem_root_pubkey, manifest, hashlib.sha256).digest()\n\nsig_ok = hmac.compare_digest(hmac.new(oem_root_pubkey, manifest, hashlib.sha256).digest(), manifest_signature)\npayload_ok = hashlib.sha256(app_code).digest() == app_digest\n\nprint(f\"Manifest Magic: {manifest[:4].decode()}, Declared SVN: {sec_version}\")\nprint(f\"Signature Verification: {'PASSED' if sig_ok else 'FAILED'}\")\nprint(f\"Payload Digest Match  : {'PASSED' if payload_ok else 'FAILED'}\")",
                "output": "Manifest Magic: APEX, Declared SVN: 14\nSignature Verification: PASSED\nPayload Digest Match  : PASSED",
                "codeNotes": [
                    "Packs manifest fields into canonical big-endian binary format with fixed offsets.",
                    "Verifies cryptographic signature over manifest metadata before streaming payload into flash.",
                    "Validates that the streaming payload digest matches the authentic manifest declaration."
                ],
                "tryIt": "Alter a single byte in app_code and verify that Payload Digest Match returns FAILED.",
                "check": {
                    "question": "Why is the firmware payload digest included inside the signed manifest rather than signing the entire payload directly?",
                    "options": [
                        "It allows memory-constrained bootloaders to verify the signature in constant RAM before streaming large binary payloads into flash.",
                        "Direct payload signing is illegal under international cryptography treaties.",
                        "SHA-256 cannot hash files larger than 10 kilobytes.",
                        "It allows the microcontroller to skip flashing the image entirely."
                    ],
                    "answer": 0,
                    "why": "Verifying a compact signed manifest requires minimal RAM and allows streaming large binaries into flash while validating the digest on the fly."
                }
            },
            {
                "title": "Anti-Rollback Enforcement & The Atomic Trial-Commit Sequence",
                "say": [
                    "The third critical pillar of Milestone 5 is hardware anti-rollback enforcement and the timing of physical eFuse burning. As analyzed on Day 23, authentic signatures do not protect against downgrade attacks where an attacker feeds an authentic, older, vulnerable binary to the device.",
                    "Our engine incorporates a hardware MonotonicFence abstraction simulating on-chip OTP eFuses. When the manifest is parsed, the engine immediately compares the declared SVN against the hardware counter: Declared SVN >= Hardware eFuse SVN.",
                    "If the candidate SVN is strictly less than the active hardware counter, the engine flags a downgrade attack and terminates the update immediately. The candidate binary is rejected, preventing the revival of patched vulnerabilities.",
                    "When an upgrade package declares an SVN greater than the active counter, the engine stages the target value in a volatile register. It DOES NOT blow the physical eFuse. The device reboots into Slot B in trial mode with a hardware watchdog timer armed.",
                    "If the candidate firmware boots successfully, runs internal diagnostics, and verifies cloud telemetry, the application issues an authenticated syscall to commit the update. The engine applies the programming voltage, permanently burning the OTP eFuses to the new SVN. If the candidate crashes, the watchdog reboots the MCU, and the engine safely falls back to Slot A, whose SVN remains valid because no eFuses were prematurely blown."
                ],
                "example": "Let us simulate the MonotonicFence rejecting a downgrade attack while staging an authentic upgrade and committing post-trial.",
                "code": "class MonotonicFence:\n    def __init__(self, hw_counter: int):\n        self.hw_counter = hw_counter\n        self.staged_counter = None\n\n    def check_fence(self, incoming_svn: int) -> bool:\n        if incoming_svn < self.hw_counter:\n            return False\n        self.staged_counter = incoming_svn\n        return True\n\n    def commit(self, self_test_passed: bool) -> bool:\n        if not self_test_passed or self.staged_counter is None:\n            self.staged_counter = None\n            return False\n        if self.staged_counter > self.hw_counter:\n            self.hw_counter = self.staged_counter\n        self.staged_counter = None\n        return True\n\nfence = MonotonicFence(hw_counter=10)\nattack_allowed = fence.check_fence(9)\nupgrade_allowed = fence.check_fence(14)\ncommit_success = fence.commit(self_test_passed=True)\n\nprint(f\"Downgrade SVN 9 Allowed : {attack_allowed}\")\nprint(f\"Upgrade SVN 14 Allowed  : {upgrade_allowed}\")\nprint(f\"Post-Trial Burn Active  : {commit_success} (Active eFuse: {fence.hw_counter})\")",
                "output": "Downgrade SVN 9 Allowed : False\nUpgrade SVN 14 Allowed  : True\nPost-Trial Burn Active  : True (Active eFuse: 14)",
                "codeNotes": [
                    "Enforces hardware anti-rollback inequality check before writing or booting firmware.",
                    "Stages the incremented counter in volatile memory during the trial execution window.",
                    "Permanently increments the physical hardware counter only after successful trial self-test."
                ],
                "tryIt": "Run commit with self_test_passed=False and confirm that Active eFuse remains at 10.",
                "check": {
                    "question": "Under what condition is the hardware anti-rollback eFuse counter permanently incremented?",
                    "options": [
                        "Only after the candidate firmware successfully boots in trial mode and passes all diagnostic self-tests.",
                        "Immediately when the wireless download begins.",
                        "As soon as the manifest signature is verified.",
                        "Every time the microcontroller is rebooted by the user."
                    ],
                    "answer": 0,
                    "why": "Delayed post-trial eFuse burning ensures the system can always fall back to the golden slot if the candidate image fails to boot stably."
                }
            },
            {
                "title": "TCG DICE Measurement & Attestation Token Verification",
                "say": [
                    "The fourth layer of our Milestone 5 engine extends trust to external cloud services through TCG DICE remote attestation. Once the new firmware is confirmed and running in Slot B, the device must prove its untampered software state to the cloud.",
                    "The engine ingests the on-chip Unique Device Secret (UDS), simulating factory wafer-provisioned silicon trust. The engine measures the SHA-256 hash of the active firmware binary. It combines the UDS and the measurement using HMAC-SHA256 to derive the Compound Device Identifier (CDI): CDI = HMAC(UDS, 'DICE_APP_LAYER' || Measurement).",
                    "From the CDI, the engine derives the operational Alias Key. This key is mathematically unique to both the physical chip and the exact firmware running in flash.",
                    "When the cloud verifier transmits an attestation challenge containing an ephemeral 16-byte random Nonce, the engine constructs an attestation claim binding the Nonce, the active Security Version Number, and the active firmware measurement. It signs the claim using the Alias Key.",
                    "The cloud verifier receives the attestation token and verifies the signature against the registered Alias Key while matching the reported measurement against its Golden Measurement Registry. If an attacker injected malware or tampered with the binary, the measurement and derived key diverge, and the cloud immediately rejects the connection, isolating the compromised node from fleet operations."
                ],
                "example": "Let us simulate the TCG DICE CDI derivation, challenge-response claim signing, and cloud verifier appraisal.",
                "code": "import struct\nimport hashlib\nimport hmac\n\nuds = b\"FOUNDRY_OTP_UDS_KEY_32B_SECRET_\"[:32]\napp_payload = b\"APEX_FIRMWARE_PAYLOAD_V2_4_0_SEC_PATCHED\"\napp_meas = hashlib.sha256(app_payload).digest()\n\ncdi = hmac.new(uds, b\"DICE_APP_LAYER\" + app_meas, hashlib.sha256).digest()\nalias_key = hmac.new(cdi, b\"ALIAS_KEY\", hashlib.sha256).digest()\n\nchallenge_nonce = b\"NONCE_CHALLENGE_\"\nclaim = challenge_nonce + struct.pack(\">I\", 14) + app_meas\ntoken_sig = hmac.new(alias_key, claim, hashlib.sha256).digest()\n\nexpected_meas = hashlib.sha256(b\"APEX_FIRMWARE_PAYLOAD_V2_4_0_SEC_PATCHED\").digest()\nexpected_claim = challenge_nonce + struct.pack(\">I\", 14) + expected_meas\ncloud_verified = hmac.compare_digest(hmac.new(alias_key, expected_claim, hashlib.sha256).digest(), token_sig)\n\nprint(f\"DICE CDI Hash         : {cdi[:8].hex()}...\")\nprint(f\"Attestation Proof HMAC: {token_sig[:8].hex()}...\")\nprint(f\"Cloud Verifier Result : {'AUTHORIZED' if cloud_verified else 'REJECTED'}\")",
                "output": "DICE CDI Hash         : 0df085c18ca26f5e...\nAttestation Proof HMAC: 147c60286f0dea09...\nCloud Verifier Result : AUTHORIZED",
                "codeNotes": [
                    "Derives the Compound Device Identifier (CDI) by combining the hardware UDS with the firmware digest.",
                    "Constructs a replay-protected attestation claim binding the cloud's ephemeral challenge nonce.",
                    "Cloud verifier evaluates cryptographic proof against authorized golden measurements."
                ],
                "tryIt": "Modify the app_payload bytes and verify that Cloud Verifier Result returns REJECTED.",
                "check": {
                    "question": "How does DICE attestation guarantee that an attacker who compromises an application cannot forge authentic credentials for other firmware versions?",
                    "options": [
                        "The CDI and Alias Key are derived mathematically from the hash of the running software; changing the code automatically scrambles the derived keys.",
                        "DICE keys are stored on public web servers.",
                        "Microcontrollers automatically self-destruct if modified.",
                        "DICE requires entering a PIN code on a physical keypad."
                    ],
                    "answer": 0,
                    "why": "Because DICE keys are mathematically bound to software measurements, any modification to the code creates a different key that cannot produce valid signatures for registered certificates."
                }
            },
            {
                "title": "The Complete ApexMilestone5FotaAttestationEngine Execution",
                "say": [
                    "To complete Milestone 5, we unite all four subsystems into the unified ApexMilestone5FotaAttestationEngine class. This class represents the production-grade bare-metal firmware management framework for the Apex IoT platform.",
                    "The engine maintains hardware trust anchors: the 32-byte Unique Device Secret (UDS), the OEM Root Public Key, and the active OTP eFuse monotonic counter. It manages the dual-bank flash layout (Slot A and Slot B) and actively tracks running execution context.",
                    "When an OTA update package is ingested, the engine executes the complete verification cascade: 1) Cryptographic manifest signature check; 2) Monotonic anti-rollback version fence check; 3) Binary payload SHA-256 digest verification; and 4) Staging into the alternate bank.",
                    "Next, the engine manages the trial boot transition and atomic commit sequence. When the candidate image confirms successful self-test diagnostics, the engine commits Slot B as the active partition, permanently updates the hardware eFuse counter, and re-derives active DICE attestation credentials.",
                    "Finally, when cloud gateways challenge the device, the engine generates fresh attestation proofs bound to challenge nonces. The resulting architecture delivers total lifecycle integrity: zero-downtime updates, complete downgrade attack defense, zero bricking risk, and continuous cryptographic attestation across the enterprise fleet."
                ],
                "example": "Let us execute the ApexMilestone5FotaAttestationEngine across package ingestion, trial commitment, and challenge-response attestation proof generation.",
                "code": "import struct\nimport hashlib\nimport hmac\n\nclass ApexMilestone5FotaAttestationEngine:\n    def __init__(self, uds: bytes, root_pubkey: bytes, initial_sec_version: int):\n        self.uds = uds\n        self.root_pubkey = root_pubkey\n        self.hw_counter = initial_sec_version\n        self.active_slot = \"SLOT_A\"\n        self.slot_a_code = b\"BASELINE_FIRMWARE_V1_0\"\n        self.slot_b_code = b\"\"\n        self.cdi = None\n        self.alias_key = None\n        self._derive_active_dice()\n\n    def _derive_active_dice(self):\n        active_code = self.slot_a_code if self.active_slot == \"SLOT_A\" else self.slot_b_code\n        meas = hashlib.sha256(active_code).digest()\n        self.cdi = hmac.new(self.uds, b\"DICE_LAYER\" + meas, hashlib.sha256).digest()\n        self.alias_key = hmac.new(self.cdi, b\"ALIAS_KEY\", hashlib.sha256).digest()\n\n    def ingest_fota_package(self, manifest: bytes, signature: bytes, payload: bytes) -> tuple:\n        expected_sig = hmac.new(self.root_pubkey, manifest, hashlib.sha256).digest()\n        if not hmac.compare_digest(signature, expected_sig):\n            return False, \"MANIFEST_SIGNATURE_INVALID\"\n        \n        magic, svn, size = struct.unpack(\">4sII\", manifest[:12])\n        payload_hash = manifest[12:44]\n        if magic != b\"APEX\":\n            return False, \"INVALID_MAGIC\"\n        \n        if svn < self.hw_counter:\n            return False, f\"DOWNGRADE_BLOCKED: {svn} < {self.hw_counter}\"\n        \n        if hashlib.sha256(payload).digest() != payload_hash:\n            return False, \"PAYLOAD_HASH_MISMATCH\"\n        \n        self.slot_b_code = payload\n        return True, f\"STAGED_SLOT_B_SVN_{svn}\"\n\n    def execute_trial_and_commit(self, self_test_passed: bool, candidate_svn: int) -> bool:\n        if not self_test_passed:\n            self.slot_b_code = b\"\"\n            return False\n        self.active_slot = \"SLOT_B\"\n        if candidate_svn > self.hw_counter:\n            self.hw_counter = candidate_svn\n        self._derive_active_dice()\n        return True\n\n    def generate_attestation(self, nonce: bytes) -> dict:\n        active_code = self.slot_a_code if self.active_slot == \"SLOT_A\" else self.slot_b_code\n        meas = hashlib.sha256(active_code).digest()\n        claim = nonce + struct.pack(\">I\", self.hw_counter) + meas\n        sig = hmac.new(self.alias_key, claim, hashlib.sha256).digest()\n        return {\"nonce\": nonce.hex(), \"svn\": self.hw_counter, \"meas\": meas.hex(), \"proof\": sig.hex()}\n\nroot_key = b\"OEM_AUTHORIZATION_PUBKEY_32BYTES\"[:32]\nengine = ApexMilestone5FotaAttestationEngine(\n    uds=b\"FOUNDRY_OTP_UDS_KEY_32B_SECRET_\"[:32],\n    root_pubkey=root_key,\n    initial_sec_version=10\n)\n\nupg_code = b\"APEX_SECURE_OPERATING_SYSTEM_V2_0\"\nupg_meas = hashlib.sha256(upg_code).digest()\nupg_manifest = struct.pack(\">4sII\", b\"APEX\", 15, len(upg_code)) + upg_meas\nupg_sig = hmac.new(root_key, upg_manifest, hashlib.sha256).digest()\n\nok_ingest, msg_ingest = engine.ingest_fota_package(upg_manifest, upg_sig, upg_code)\ncommit_ok = engine.execute_trial_and_commit(self_test_passed=True, candidate_svn=15)\n\nnonce = b\"VERIFIER_NONCE__\"\natt_token = engine.generate_attestation(nonce)\n\nprint(f\"FOTA Ingestion: {msg_ingest} (Success: {ok_ingest})\")\nprint(f\"Trial Commit  : Committed={commit_ok}, Active Slot={engine.active_slot}, eFuse={engine.hw_counter}\")\nprint(f\"Attestation Proof SVN: {att_token['svn']}, Proof: {att_token['proof'][:16]}...\")",
                "output": "FOTA Ingestion: STAGED_SLOT_B_SVN_15 (Success: True)\nTrial Commit  : Committed=True, Active Slot=SLOT_B, eFuse=15\nAttestation Proof SVN: 15, Proof: e29a43012c9ea9c9...",
                "codeNotes": [
                    "Coordinates dual-bank staging, manifest validation, anti-rollback fencing, and atomic commit.",
                    "Updates active DICE measurements and re-derives Alias Keys upon firmware activation.",
                    "Generates replay-protected attestation proofs bound to hardware eFuse counters and running digests."
                ],
                "tryIt": "Attempt to ingest a package with SVN 8 and verify that ingest_fota_package returns False with DOWNGRADE_BLOCKED.",
                "check": {
                    "question": "What is the ultimate accomplishment of the ApexMilestone5FotaAttestationEngine?",
                    "options": [
                        "Synthesizing dual-bank failover, manifest signing, hardware anti-rollback fencing, and DICE attestation into an integrated, zero-downtime firmware engine.",
                        "Eliminating the need for internet access in IoT devices.",
                        "Writing machine code directly to flash without a compiler.",
                        "Allowing any user to bypass secure boot checks."
                    ],
                    "answer": 0,
                    "why": "Milestone 5 synthesizes all Block 5 security primitives into an end-to-end, resilient bare-metal firmware management and remote attestation engine."
                }
            }
        ],
        "summary": [
            "Milestone 5 establishes an integrated, production-grade firmware lifecycle and remote attestation subsystem.",
            "Dual-bank A/B partitioning paired with asymmetric manifest verification ensures uninterrupted updates and zero bricking risk.",
            "Hardware eFuse monotonic counters enforce version fencing, blocking downgrade attacks while safely deferring eFuse burns until post-trial self-test.",
            "TCG DICE hardware-anchored attestation provides continuous cryptographic proof of running firmware integrity to enterprise cloud backends."
        ],
        "projectStep": {
            "title": "ApexMilestone5FotaAttestationEngine Integration & Fleet Deployment",
            "steps": [
                "Implement the complete ApexMilestone5FotaAttestationEngine state machine covering IDLE, STAGED, TRIAL, and COMMITTED phases.",
                "Integrate binary manifest parsing and HMAC/Ed25519 signature verification against factory root keys.",
                "Enforce hardware eFuse version fencing with delayed two-stage atomic burn timing.",
                "Implement TCG DICE CDI derivation and challenge-response attestation proof generation for cloud verifiers."
            ]
        }
    }
    with open('scripts/iot_sec_day25.json', 'w', encoding='utf-8') as f:
        json.dump(day25, f, indent=2)
    print("Generated base Day 25 in scripts/iot_sec_day25.json")

if __name__ == '__main__':
    generate_day25()
